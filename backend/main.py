from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.auth import router as auth_router  
from routes.user_dashboard import router as user_dashboard_router  
from routes.recruiter_dashboard import router as recruiter_dashboard_router  

app = FastAPI()

# Include the routers
app.include_router(auth_router)
app.include_router(user_dashboard_router)  
app.include_router(recruiter_dashboard_router)  

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Root Route (Basic Health Check)
@app.get("/")
async def read_root():
    return {"message": "Welcome to FastAPI! Backend is running successfully 🚀"}
