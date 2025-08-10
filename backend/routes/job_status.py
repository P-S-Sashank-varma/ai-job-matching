from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional, Dict
from bson import ObjectId
from database import user_job_statuses_collection  # MongoDB collection
from database import recruiter_dashboard_collection
router = APIRouter()

# Models
class CompletionStatus(BaseModel):
    aptitude: bool = False
    coding: bool = False
    hr: bool = False

class UserJobStatus(BaseModel):
    user_email: str
    recruiter_email: str
    company_name: str
    recruiter_name: str
    location: str
    job_description: str
    rounds_completed: Optional[int]
    completion_status: Optional[Dict[str, bool]]

class SimpleUserJobStatus(BaseModel):
    user_email: str
    recruiter_email: str
    completion_status: CompletionStatus
    all_rounds_completed_email_sent: Optional[bool] = False



@router.get("/job-status/{user_email}")
async def get_user_job_statuses(user_email: str):
    print(f"API HIT: /job-status/{user_email}")
    try:
        cursor = user_job_statuses_collection.find({"user_email": user_email})
        job_statuses = []
        async for document in cursor:
            document.pop("_id", None)  # Remove ObjectId if present
            job_statuses.append(document)
        
        return {"status": "success", "data": job_statuses}
    
    except Exception as e:
        print("MongoDB ERROR:", str(e))
        return {"status": "error", "message": str(e)}



@router.get("/job-status/{user_email}/{recruiter_email}", response_model=SimpleUserJobStatus)
async def get_specific_job_status(user_email: str, recruiter_email: str):
    record = await user_job_statuses_collection.find_one({
        "user_email": user_email,
        "recruiter_email": recruiter_email
    })

    if record:
        record.pop("_id", None)
        # Ensure the email-sent flag is present with a default
        if "all_rounds_completed_email_sent" not in record:
            record["all_rounds_completed_email_sent"] = False
        return record

    return SimpleUserJobStatus(
        user_email=user_email,
        recruiter_email=recruiter_email,
        completion_status=CompletionStatus(),
        all_rounds_completed_email_sent=False,
    )


    

# Create or update job status
@router.post("/job-status")
async def create_or_update_job_status(status: UserJobStatus):
    result = await user_job_statuses_collection.update_one(
        {"user_email": status.user_email, "recruiter_email": status.recruiter_email},
        {"$set": status.dict()},
        upsert=True
    )

    if result.upserted_id or result.modified_count:
        return {"message": "Status updated or created successfully"}

    raise HTTPException(status_code=500, detail="Failed to update or create status")

# Update specific round status
@router.put("/job-status/{user_email}/{recruiter_email}/round")
async def update_round_status(user_email: str, recruiter_email: str, round_name: str, completed: bool):
    if round_name not in ["aptitude", "coding", "hr"]:
        raise HTTPException(status_code=400, detail="Invalid round name")

    update_field = f"completion_status.{round_name}"

    result = await user_job_statuses_collection.update_one(
        {"user_email": user_email, "recruiter_email": recruiter_email},
        {"$set": {update_field: completed}},
        upsert=True
    )

    if result.upserted_id or result.modified_count:
        return {"message": f"{round_name} round status updated successfully"}

    raise HTTPException(status_code=500, detail="Failed to update round status")


# Mark notification sent to avoid duplicate emails across devices
@router.put("/job-status/{user_email}/{recruiter_email}/mark-notified")
async def mark_all_rounds_email_sent(user_email: str, recruiter_email: str):
    result = await user_job_statuses_collection.update_one(
        {"user_email": user_email, "recruiter_email": recruiter_email},
        {"$set": {"all_rounds_completed_email_sent": True}},
        upsert=True,
    )
    if result.upserted_id or result.modified_count:
        return {"message": "notification flag set"}
    raise HTTPException(status_code=500, detail="Failed to set notification flag")



@router.get("/job-status1/{user_email}/{recruiter_email}", response_model=UserJobStatus)
async def get_user_applied_job_status(user_email: str, recruiter_email: str):
    try:
        # Step 1: Get recruiter info
        recruiter_record = await recruiter_dashboard_collection.find_one(
            {"email": recruiter_email},
            {
                "_id": 0,
                "company_name": 1,
                "recruiter_name": 1,
                "location": 1,
                "job_description": 1
            }
        )

        if not recruiter_record:
            raise HTTPException(status_code=404, detail="Recruiter not found")

        # Step 2: Get user job status
        job_status_record = await user_job_statuses_collection.find_one(
            {
                "user_email": user_email,
                "recruiter_email": recruiter_email
            },
            {
                "_id": 0,
                "user_email": 1,
                "recruiter_email": 1,
                "completion_status": 1,
                "rounds_completed": 1
            }
        )

        if not job_status_record:
            raise HTTPException(status_code=404, detail="User job status not found")

        # Step 3: Merge both documents
        combined_data = {
            **job_status_record,
            **recruiter_record
        }

        return combined_data

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching job status: {str(e)}")
