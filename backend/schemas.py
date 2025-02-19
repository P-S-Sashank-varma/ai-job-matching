from pydantic import BaseModel, EmailStr

class UserSchema(BaseModel):
    name: str  # Full Name
    email: EmailStr
    password: str
    role: str  # "user" or "recruiter"

class LoginSchema(BaseModel):
    email: EmailStr
    password: str
