from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import auth, recruiter_dashboard, user_dashboard, resume_parser 
from routes import matching_jobs  # Import the new route

app = FastAPI()

# Register the matching jobs API
app.include_router(matching_jobs.router)
# ✅ Include all routers
app.include_router(auth.router)
app.include_router(recruiter_dashboard.router)
app.include_router(user_dashboard.router)
app.include_router(resume_parser.router)  # ✅ Register resume parser API

# ✅ CORS Configuration (Allow Frontend to Communicate)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def read_root():
    return {"message": "Welcome to FastAPI - AI Job Matching System!"}
