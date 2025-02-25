from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import requests
import os
import re
from typing import List
from dotenv import load_dotenv

# ✅ Load environment variables
load_dotenv()

# ✅ Initialize FastAPI App
app = FastAPI()

# ✅ CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Change this in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ Import and Include Routers
from routes import auth, recruiter_dashboard, user_dashboard, resume_parser, matching_jobs

app.include_router(auth.router)
app.include_router(recruiter_dashboard.router)
app.include_router(user_dashboard.router)
app.include_router(resume_parser.router)
app.include_router(matching_jobs.router)

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
@app.get("/")
async def read_root():
    return {"message": "✅ FastAPI - AI HR Interview System is running!"}
