from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from database import user_dashboard_collection
from fastapi.responses import FileResponse
import os

router = APIRouter()

UPLOAD_DIR = "uploads/resumes"
os.makedirs(UPLOAD_DIR, exist_ok=True)  # Ensure upload directory exists

BASE_DIR = os.path.dirname(os.path.abspath(__file__))  # Get current backend directory
RESUME_DIR = os.path.join(BASE_DIR, "uploads", "resumes")  
os.makedirs(RESUME_DIR, exist_ok=True)  # Ensure directory exists


@router.post("/user-dashboard")
async def save_user_dashboard(
    name: str = Form(...),
    email: str = Form(...),
    phone: str = Form(...),
    resume: UploadFile = File(...)
):
    resume_path = os.path.join(UPLOAD_DIR, resume.filename)
    
    with open(resume_path, "wb") as buffer:
        buffer.write(await resume.read())  # Save file to disk

    # Check if user already exists
    existing_user = await user_dashboard_collection.find_one({"email": email})
    if existing_user:
        raise HTTPException(status_code=400, detail="User already exists")

    # Store user data in MongoDB
    user_data = {
        "name": name,
        "email": email,
        "phone": phone,
        "resume_filename": resume.filename,
        "resume_path": resume_path
    }

    await user_dashboard_collection.insert_one(user_data)
    return {"message": "User data and resume uploaded successfully!"}

# **🔹 API: Retrieve User Dashboard Data**
@router.get("/user-dashboard/{email}")
async def get_user_dashboard(email: str):
    user = await user_dashboard_collection.find_one({"email": email})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return {
        "name": user["name"],
        "email": user["email"],
        "phone": user["phone"],
        "resume_filename": user["resume_filename"],
        "resume_url": f"http://127.0.0.1:8000/get-resume/{user['resume_filename']}"
    }

# **🔹 API: Get Resume File**
@router.get("/get-resume/{filename}")
async def get_resume(filename: str):
    file_path = os.path.join(UPLOAD_DIR, filename)
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="Resume not found")
    return FileResponse(file_path, media_type="application/pdf", filename=filename)




@router.get("/get-resume/{email}")
async def get_resume(email: str):
    user = await user_dashboard_collection.find_one({"email": email})

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    resume_filename = user.get("resume_filename")
    if not resume_filename:
        raise HTTPException(status_code=404, detail="Resume not found for this user")

    # ✅ Fix: Ensure correct absolute path
    file_path = os.path.join(RESUME_DIR, resume_filename)
    file_path = os.path.abspath(file_path)  # Convert to absolute path

    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail=f"Resume file not found at {file_path}")

    return FileResponse(file_path, media_type="application/pdf", filename=resume_filename)