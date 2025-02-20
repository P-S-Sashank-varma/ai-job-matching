from motor.motor_asyncio import AsyncIOMotorClient
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# MongoDB Connection
MONGO_URL = os.getenv("MONGO_URL", "mongodb://localhost:27017")
client = AsyncIOMotorClient(MONGO_URL)

# Connect to `SkillSync` database
db = client["SkillSync"]

# Create collections
user_dashboard_collection = db["user_dashboard"]
recruiter_dashboard_collection = db["recruiter_dashboard"]
