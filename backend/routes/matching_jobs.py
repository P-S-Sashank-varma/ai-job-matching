from fastapi import APIRouter, HTTPException, Depends
from fastapi.responses import JSONResponse
from database import user_dashboard_collection, recruiter_dashboard_collection
from utils.security import get_current_user  # Import Token Auth Function

router = APIRouter()

# **🔹 Match Jobs for the Currently Logged-in User**
@router.get("/matching-jobs", tags=["Matching"])
async def get_matching_jobs(user: dict = Depends(get_current_user)):
    """🔹 Get job matches for the logged-in user"""

    email = user["email"]  # ✅ Extract email from JWT token
    user_data = await user_dashboard_collection.find_one({"email": email})

    if not user_data or "skills" not in user_data:
        raise HTTPException(status_code=404, detail="User skills not found. Please upload a resume.")

    user_skills = set(user_data["skills"])  # ✅ Extract skills from DB
    matched_jobs = []

    # **🔹 Fetch all job listings**
    jobs = await recruiter_dashboard_collection.find().to_list(100)

    for job in jobs:
        required_skills = set(job.get("skills_required", "").lower().split(","))
        matched_skills = user_skills.intersection(required_skills)
        match_percentage = (len(matched_skills) / len(required_skills)) * 100 if required_skills else 0

        if match_percentage >= 80:  
            matched_jobs.append({
                "id": str(job["_id"]),
                "recruiter_name": job["recruiter_name"],
                "company": job["company"],
                "skills_required": job["skills_required"],
                "matched_skills": list(matched_skills),
                "match_percentage": round(match_percentage, 2),
                "company_image_url": job["company_image_url"]
            })

    return JSONResponse({"email": email, "matched_jobs": matched_jobs})
