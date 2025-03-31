from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from fastapi.responses import FileResponse
from database import recruiter_dashboard_collection
import os
from bson import ObjectId

# Initialize router
router = APIRouter()

# Directory for storing company images
UPLOAD_DIR = "uploads/company_images"
os.makedirs(UPLOAD_DIR, exist_ok=True)  # Ensure the directory exists


# ✅ Serialize job post for API response
async def serialize_job(job):
    return {
        "id": str(job["_id"]),  # Convert `_id` from ObjectId to string
        "recruiter_name": job["recruiter_name"],
        "email": job["email"],
        "company": job["company"],
        "skills_required": job.get("skills_required", "Not specified"),
        "job_description": job["job_description"],
        "salary_range": job.get("salary_range", "Not specified"),
        "job_location": job.get("job_location", "Not specified"),
        "location": job.get("location", "Not specified"),
        "match_percentage": job.get("match_percentage", "0%"),  # Default to 0% if not provided
        "company_image_filename": job["company_image_filename"],
        "company_image_url": f"http://127.0.0.1:8000/get-company-image/{job['company_image_filename']}",
    }


# **🔹 POST Route: Recruiter Posts a Job**
@router.post("/recruiter-dashboard")
async def post_job(
    recruiter_name: str = Form(...),
    email: str = Form(...),
    company: str = Form(...),
    skills_required: str = Form(...),
    job_description: str = Form(...),
    salary_range: str = Form(...),
    job_location: str = Form(...),
    location: str = Form(...),
    match_percentage: str = Form(...),
    company_image: UploadFile = File(...)
):
    try:
        print(f"Received match_percentage: {match_percentage}")  # ✅ Debugging

        # ✅ Save company image with a unique filename
        image_filename = f"{email.replace('@', '_')}_{company_image.filename}"
        file_path = os.path.join(UPLOAD_DIR, image_filename)

        with open(file_path, "wb") as buffer:
            buffer.write(await company_image.read())

        # ✅ Prepare job data
        job_data = {
            "recruiter_name": recruiter_name,
            "email": email,
            "company": company,
            "skills_required": skills_required,
            "job_description": job_description,
            "salary_range": salary_range,
            "job_location": job_location,
            "location": location,
            "match_percentage": match_percentage,  # ✅ Ensure it's included
            "company_image_filename": image_filename,
            "company_image_url": f"http://127.0.0.1:8000/get-company-image/{image_filename}",
        }

        print(f"Job data before insert: {job_data}")  # ✅ Debugging

        # ✅ Insert into MongoDB
        inserted_job = await recruiter_dashboard_collection.insert_one(job_data)

        return {
            "message": "Job posted successfully",
            "job_id": str(inserted_job.inserted_id),
            "match_percentage": match_percentage,  # ✅ Add in response to check
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


# **🔹 GET Route: Retrieve Jobs Posted by a Specific Recruiter (Using Email)**
@router.get("/recruiter-dashboard/{email}")
async def get_recruiter_jobs(email: str):
    try:
        jobs = await recruiter_dashboard_collection.find({"email": email}).to_list(100)
        if not jobs:
            raise HTTPException(status_code=404, detail="No jobs found for this recruiter")
        return [await serialize_job(job) for job in jobs]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error retrieving jobs: {str(e)}")



# **🔹 DELETE Route: Delete a Job Post**
@router.delete("/recruiter-dashboard/{job_id}")
async def delete_job(job_id: str):
    try:
        # ✅ Convert job_id to ObjectId
        job_object_id = ObjectId(job_id)

        # ✅ Find the job post
        job = await recruiter_dashboard_collection.find_one({"_id": job_object_id})
        if not job:
            raise HTTPException(status_code=404, detail="Job not found")

        # ✅ Delete the job post
        await recruiter_dashboard_collection.delete_one({"_id": job_object_id})

        return {"message": "Job deleted successfully"}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error deleting job: {str(e)}")



# **🔹 PUT Route: Update a Job Post**
@router.put("/recruiter-dashboard/{job_id}")
async def update_job(
    job_id: str,
    recruiter_name: str = Form(...),
    email: str = Form(...),
    company: str = Form(...),
    skills_required: str = Form(...),
    job_description: str = Form(...),
    salary_range: str = Form(...),
    job_location: str = Form(...),
    location: str = Form(...),
    match_percentage: str = Form(...),
    company_image: UploadFile = File(None)  # Optional file update
):
    try:
        job_object_id = ObjectId(job_id)
        
        # ✅ Check if job exists
        existing_job = await recruiter_dashboard_collection.find_one({"_id": job_object_id})
        if not existing_job:
            raise HTTPException(status_code=404, detail="Job not found")

        # ✅ Update job details
        updated_job_data = {
            "recruiter_name": recruiter_name,
            "email": email,
            "company": company,
            "skills_required": skills_required,
            "job_description": job_description,
            "salary_range": salary_range,
            "job_location": job_location,
            "location": location,
            "match_percentage": match_percentage,
        }

        # ✅ Handle image upload (if provided)
        if company_image:
            image_filename = f"{email.replace('@', '_')}_{company_image.filename}"
            file_path = os.path.join(UPLOAD_DIR, image_filename)
            with open(file_path, "wb") as buffer:
                buffer.write(await company_image.read())

            updated_job_data["company_image_filename"] = image_filename
            updated_job_data["company_image_url"] = f"http://127.0.0.1:8000/get-company-image/{image_filename}"

        # ✅ Update job in MongoDB
        await recruiter_dashboard_collection.update_one(
            {"_id": job_object_id}, {"$set": updated_job_data}
        )

        return {"message": "Job updated successfully"}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error updating job: {str(e)}")
