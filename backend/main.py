from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import requests
import os
import re
from typing import List
from dotenv import load_dotenv
from database import drives_collection
from fastapi import Form
from datetime import datetime
from bson import ObjectId
from routes import job_status
from fastapi import Response


# ✅ Load environment variables
load_dotenv()

# ✅ Initialize FastAPI App
app = FastAPI()

# ✅ Add CORS middleware RIGHT AFTER app creation
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for debugging; change back in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ Only now, import routers
from routes import auth, recruiter_dashboard, user_dashboard, resume_parser, matching_jobs, execute_code, job_status

# ✅ Then include them
app.include_router(auth.router)
app.include_router(recruiter_dashboard.router)
app.include_router(user_dashboard.router)
app.include_router(resume_parser.router)
app.include_router(matching_jobs.router)
app.include_router(execute_code.router)
app.include_router(job_status.router, prefix="/api")

# ✅ Groq API Configuration
GROQ_API_KEY = os.getenv("GROQ_API_KEY")
GROQ_ENDPOINT = "https://api.groq.com/openai/v1/chat/completions"

if not GROQ_API_KEY:
    raise ValueError("❌ GROQ_API_KEY is missing. Please set it in the .env file!")

# ✅ Pydantic Models
class InterviewRequest(BaseModel):
    skills: List[str]

class AnswerRequest(BaseModel):
    question: str
    answer: str

# ✅ Generate AI-based HR Interview Questions
@app.post("/generate_questions")
async def generate_questions(request: InterviewRequest):
    headers = {
        "Authorization": f"Bearer {GROQ_API_KEY}",
        "Content-Type": "application/json"
    }

    skills_text = ", ".join(request.skills)
    payload = {
        "model": "llama3-8b-8192",
        "messages": [
            {"role": "system", "content": "You are an AI that generates HR interview questions."},
            {"role": "user", "content": f"Generate 10 HR interview questions for a candidate skilled in {skills_text}. Provide only a numbered list of questions without explanations."}
        ],
        "temperature": 0.7
    }

    response = requests.post(GROQ_ENDPOINT, headers=headers, json=payload)

    if response.status_code != 200:
        raise HTTPException(status_code=response.status_code, detail=f"Groq API Error: {response.text}")

    response_json = response.json()
    if not response_json.get("choices") or not response_json["choices"][0].get("message", {}).get("content"):
        raise HTTPException(status_code=500, detail="Invalid response from Groq API")

    raw_content = response_json["choices"][0]["message"]["content"]
    questions = re.findall(r"^\d+\.\s*(.*)", raw_content, re.MULTILINE)
    
    return {"questions": questions[:10]}  # Ensure max 10 questions

# ✅ Evaluate Interview Answers
@app.post("/evaluate_answer")
async def evaluate_answer(data: AnswerRequest):
    prompt = f"""
    Evaluate the following answer to the question: "{data.question}"
    User's answer: "{data.answer}"

    Provide a **numeric score (0-10)** based on correctness, completeness, and relevance.
    **Only return the score as a number. No additional text.**
    """

    headers = {
        "Authorization": f"Bearer {GROQ_API_KEY}",
        "Content-Type": "application/json"
    }

    payload = {
        "model": "llama3-8b-8192",
        "messages": [
            {"role": "system", "content": "You are an AI that evaluates interview responses strictly."},
            {"role": "user", "content": prompt}
        ],
        "max_tokens": 10
    }

    response = requests.post(GROQ_ENDPOINT, json=payload, headers=headers)
    response.raise_for_status()
    response_data = response.json()

    score = int(response_data["choices"][0]["message"]["content"].strip())
    return {"score": max(0, min(10, score))}

# ✅ Health Check Endpoint


# Pydantic Model for Drive Response
class DriveResponse(BaseModel):
    id: str
    name: str
    date: str
    time: str
    location: str
    description: str
    capacity: int
    status: str
    created_at: datetime
    recruiter_name: str
    recruiter_email: str

# Route to create a new drive
@app.post("/drives/", response_model=DriveResponse)
async def create_drive(
    name: str = Form(...),
    date: str = Form(...),
    time: str = Form(...),
    location: str = Form(...),
    description: str = Form(...),
    capacity: int = Form(...),
    recruiter_name: str = Form(...),
    recruiter_email: str = Form(...),
):
    drive_data = {
        "name": name,
        "date": date,
        "time": time,
        "location": location,
        "description": description,
        "capacity": capacity,
        "status": "Scheduled",
        "created_at": datetime.utcnow(),
        "recruiter_name": recruiter_name,
        "recruiter_email": recruiter_email,
    }

    result = await drives_collection.insert_one(drive_data)
    created_drive = await drives_collection.find_one({"_id": result.inserted_id})
    
    if created_drive:
        created_drive["id"] = str(created_drive["_id"])
        return DriveResponse(**created_drive)
    
    raise HTTPException(status_code=500, detail="Drive creation failed")


# Route to fetch all drives for a recruiter
@app.get("/drives/{recruiter_email}", response_model=List[DriveResponse])
async def get_recruiter_drives(recruiter_email: str):
    drives = await  drives_collection.find({"recruiter_email": recruiter_email}).to_list(None)

    for drive in drives:
        drive["id"] = str(drive["_id"])

    return [DriveResponse(**drive) for drive in drives]

# Route to delete a drive
@app.delete("/drives/{drive_id}")
async def delete_drive(drive_id: str):
    drive = await  drives_collection.find_one({"_id": ObjectId(drive_id)})
    if not drive:
        raise HTTPException(status_code=404, detail="Drive not found")
    
    result = await  drives_collection.delete_one({"_id": ObjectId(drive_id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Drive not found")

    return {"message": "Drive deleted successfully"}

@app.get("/drives/", response_model=List[DriveResponse])
async def get_all_drives():
    drives = await drives_collection.find().to_list(None)

    for drive in drives:
        drive["id"] = str(drive["_id"])

    return [DriveResponse(**drive) for drive in drives]

@app.get("/")
async def read_root():
    return {"message": "✅ FastAPI - AI HR Interview System is running!"}

@app.options("/login")
async def options_login(response: Response):
    response.headers["Access-Control-Allow-Origin"] = "*"
    response.headers["Access-Control-Allow-Methods"] = "POST, OPTIONS"
    response.headers["Access-Control-Allow-Headers"] = "*"
    return Response(status_code=204)

