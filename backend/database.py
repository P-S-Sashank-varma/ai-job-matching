from motor.motor_asyncio import AsyncIOMotorClient
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Get MongoDB connection URL from environment or use local fallback
MONGO_URL = os.getenv(
    "MONGO_URL",
    "mongodb://localhost:27017/SkillSync"
)

# ✅ Enable TLS if using MongoDB Atlas
if "mongodb+srv" in MONGO_URL:
    client = AsyncIOMotorClient(MONGO_URL, tls=True)
else:
    client = AsyncIOMotorClient(MONGO_URL)

# Connect to 'SkillSync' database (Atlas URL should include it, but ensure fallback here)
db = client.get_default_database() or client["SkillSync"]

# Define collection references
user_dashboard_collection = db["user_dashboard"]
recruiter_dashboard_collection = db["recruiter_dashboard"]
drives_collection = db["drives"]
user_job_statuses_collection = db["user_job_statuses"]
