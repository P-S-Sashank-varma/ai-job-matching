from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import auth  
# Create the FastAPI app instance
app = FastAPI()# Import the auth router


# Include the auth router (which contains /register and /login)
app.include_router(auth.router)

# Allow frontend to communicate with backend (CORS configuration)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # React frontend URL
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods (GET, POST, etc.)
    allow_headers=["*"],  # Allow all headers
)

# Example route (add your other routes here)
@app.get("/")
async def read_root():
    return {"message": "Welcome to FastAPI!"}
