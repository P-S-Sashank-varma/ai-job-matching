from fastapi import APIRouter, HTTPException
from database import users_collection
from schemas import UserSchema, LoginSchema  # Ensure both schemas are imported
from utils.security import hash_password, verify_password, create_jwt_token

router = APIRouter()

# Signup route
@router.post("/register")
async def register(user: UserSchema):
    # Check if the email is already registered
    existing_user = await users_collection.find_one({"email": user.email})
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    # Hash the password before storing
    hashed_password = hash_password(user.password)

    # Store user in MongoDB
    user_data = {
        "name": user.name,
        "email": user.email,
        "password": hashed_password,
        "role": user.role  # user or recruiter
    }
    await users_collection.insert_one(user_data)

    return {"message": "User registered successfully"}

# Login route
@router.post("/login")
async def login(user: LoginSchema):
    # Check if the user exists in MongoDB
    db_user = await users_collection.find_one({"email": user.email})
    if not db_user:
        raise HTTPException(status_code=400, detail="Invalid email or password")

    # Verify password
    if not verify_password(user.password, db_user["password"]):
        raise HTTPException(status_code=400, detail="Invalid email or password")

    # Create JWT token
    token = create_jwt_token({"email": db_user["email"], "role": db_user["role"]})

    return {"token": token, "role": db_user["role"]}
