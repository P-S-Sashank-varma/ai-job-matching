from motor.motor_asyncio import AsyncIOMotorClient
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# MongoDB connection URL
MONGO_URL = os.getenv("MONGO_URL", "mongodb://localhost:27017")

# Initialize MongoDB Client
client = AsyncIOMotorClient(MONGO_URL)
db = client["SkillSync"]  # Database Name
