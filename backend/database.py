from motor.motor_asyncio import AsyncIOMotorClient
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# ✅ Get MongoDB URL from .env or fallback to local MongoDB
MONGO_URL = os.getenv("MONGO_URL")
if not MONGO_URL or not (MONGO_URL.startswith("mongodb://") or MONGO_URL.startswith("mongodb+srv://")):
    print("[INFO] Using default local MongoDB URL...")
    MONGO_URL = "mongodb://localhost:27017/SkillSync"

# ✅ Create MongoDB client
if "mongodb+srv" in MONGO_URL:  # Atlas connection
    client = AsyncIOMotorClient(MONGO_URL, tls=True)
else:  # Local connection
    client = AsyncIOMotorClient(MONGO_URL)

# ✅ Select database
try:
    db = client.get_default_database()
    if db is None:
        db = client["SkillSync"]
except Exception as e:
    print(f"[ERROR] Failed to connect to database: {e}")
    raise e

# ✅ Define collection references
user_dashboard_collection = db["user_dashboard"]
recruiter_dashboard_collection = db["recruiter_dashboard"]
drives_collection = db["drives"]
user_job_statuses_collection = db["user_job_statuses"]
users_collection = db["users"]

print("[INFO] Database connection established successfully.")
