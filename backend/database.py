from motor.motor_asyncio import AsyncIOMotorClient
import os
from dotenv import load_dotenv

load_dotenv()

MONGO_URL = os.getenv("MONGO_URL")

client = AsyncIOMotorClient(MONGO_URL, tls=True)  # TLS required for Atlas
db = client.get_default_database()

if db is None:
    db = client["SkillSync"]  # fallback

user_dashboard_collection = db["user_dashboard"]
recruiter_dashboard_collection = db["recruiter_dashboard"]
drives_collection = db["drives"]
user_job_statuses_collection = db["user_job_statuses"]
users_collection = db["users"]
