from fastapi import APIRouter, HTTPException, Depends
from fastapi.responses import JSONResponse
from database import user_dashboard_collection, recruiter_dashboard_collection
from utils.security import get_current_user  # Import Token Auth Function

router = APIRouter()


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

    print("\n🔹 Full Job Documents from MongoDB:")
    for job in jobs:
        print(job)  # ✅ DEBUG PRINT FULL JOB ENTRY

    for job in jobs:
        required_skills = set(job.get("skills_required", "").lower().split(","))
        matched_skills = user_skills.intersection(required_skills)
        match_percentage = (len(matched_skills) / len(required_skills)) * 100 if required_skills else 0

        if match_percentage >= 0:
            job_entry = {
                "id": str(job["_id"]),
                "recruiter_name": job.get("recruiter_name", "Unknown Recruiter"),
                "company": job.get("company", "Unknown Company"),
                "skills_required": job.get("skills_required", "N/A"),
                "matched_skills": list(matched_skills),
                "match_percentage": round(match_percentage, 2),
                "company_image_url": job.get("company_image_url", ""),
                "email": job.get("email", "⚠️ Email Missing!")  # ✅ Explicit Warning if Email is Missing
            }

            print("\n✅ Processed Job Entry:", job_entry)  # ✅ DEBUG PRINT FINAL ENTRY
            matched_jobs.append(job_entry)

    return JSONResponse({"email": email, "matched_jobs": matched_jobs})
