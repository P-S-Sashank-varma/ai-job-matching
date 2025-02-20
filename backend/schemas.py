from pydantic import BaseModel, EmailStr
from typing import Optional

class UserSchema(BaseModel):
    name: str  
    email: EmailStr
    password: str
    role: str  

class LoginSchema(BaseModel):
    email: EmailStr
    password: str

class UserDashboardSchema(BaseModel):
    name: str
    email: EmailStr
    phone: Optional[str] = None
    resume_filename: Optional[str] = None 
    resume: Optional[bytes] = None 




class RecruiterDashboardSchema(BaseModel):
    recruiter_name: str  
    email: EmailStr 
    company: str  
    company_image: Optional[bytes] = None  
    company_image_filename: Optional[str] = None  
    job_description: str  
    skills_required: str  # ✅ New field for required skills
