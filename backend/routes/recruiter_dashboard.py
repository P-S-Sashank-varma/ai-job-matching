from fastapi import APIRouter, UploadFile, File, Form, HTTPException, Depends
from database import recruiter_dashboard_collection
from fastapi.responses import FileResponse
import os
from bson import ObjectId

router = APIRouter()
router = APIRouter()

UPLOAD_DIR = "uploads/company_images"
os.makedirs(UPLOAD_DIR, exist_ok=True) 


# ✅ Fix: Include `skills_required` in the API response
async def serialize_job(job):
    return {
        "id": str(job["_id"]),  # Convert `_id` from ObjectId to string
        "recruiter_name": job["recruiter_name"],
        "email": job["email"],
        "company": job["company"],
        "job_description": job["job_description"],
        "skills_required": job.get("skills_required", "Not specified"),  # ✅ Include skills
        "company_image_filename": job["company_image_filename"],
        "company_image_url": f"http://127.0.0.1:8000/get-company-image/{job['company_image_filename']}",
    }

# **🔹 POST Route: Recruiter Posts a Job**

UPLOAD_DIR = "uploads/company_images"
os.makedirs(UPLOAD_DIR, exist_ok=True)  # Ensure the directory exists

@router.post("/recruiter-dashboard")
async def post_job(
    recruiter_name: str = Form(...),
    email: str = Form(...),
    company: str = Form(...),
    skills_required: str = Form(...), 
    job_description: str = Form(...), 
    company_image: UploadFile = File(...)
):
    try:
        # ✅ Save company image
        image_filename = f"{email.replace('@', '_')}_{company_image.filename}"
        file_path = os.path.join(UPLOAD_DIR, image_filename)

        with open(file_path, "wb") as buffer:
            buffer.write(await company_image.read())

        # ✅ Create job data with "Skills Required"
        job_data = {
            "recruiter_name": recruiter_name,
            "email": email,
            "company": company,
            "skills_required": skills_required, 
            "job_description": job_description, 
            "company_image_filename": image_filename,
            "company_image_url": f"http://127.0.0.1:8000/get-company-image/{image_filename}",
        }

        # ✅ Insert into MongoDB
        inserted_job = await recruiter_dashboard_collection.insert_one(job_data)

        return {
            "message": "Job posted successfully",
            "job_id": str(inserted_job.inserted_id),
            "company_image_url": job_data["company_image_url"],
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error posting job: {str(e)}")

# **🔹 GET Route: Retrieve All Job Posts**
@router.get("/recruiter-dashboard")
async def get_all_jobs():
    try:
        jobs = await recruiter_dashboard_collection.find().to_list(100)
        return [await serialize_job(job) for job in jobs]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error retrieving jobs: {str(e)}")

# **🔹 GET Route: Get Company Image File**
@router.get("/get-company-image/{filename}")
async def get_company_image(filename: str):
    file_path = os.path.join(UPLOAD_DIR, filename)
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="Company image not found")
    return FileResponse(file_path, media_type="image/jpeg", filename=filename)
