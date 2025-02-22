from fastapi import APIRouter, HTTPException
from fastapi.responses import JSONResponse
import os
import re
import PyPDF2
import docx2txt
from database import user_dashboard_collection

router = APIRouter()

# ✅ Manually Set Resume Directory (Ensures Correct Path) - Unchanged
RESUME_DIR = r"C:\Users\sasha\Desktop\ai-job-matching\backend\uploads\resumes"
os.makedirs(RESUME_DIR, exist_ok=True)  # Ensure directory exists

# ✅ Define Skills List - Unchanged
SKILL_SET = {
    "html", "css", "javascript", "react", "angular", "flask", "nodejs", "expressjs",
    "mongodb", "sql", "mysql", "c", "c++", "java", "python", "r", "c#", "php",
    "go", "machine learning", "ai", "dl", "deep learning", "nlp", "aws", "mean",
    "mern", "powerbi", "devops", "linux", "cyber security", "tableau", "iot",
    "data analytics", "dsa", "data structures and algorithms"
}

# ✅ Function to Extract Text from PDF - Unchanged
def extract_text_from_pdf(pdf_path):
    text = []
    with open(pdf_path, "rb") as file:
        pdf_reader = PyPDF2.PdfReader(file)
        for page in pdf_reader.pages:
            page_text = page.extract_text()
            if page_text:
                text.append(page_text)
    return " ".join(text)

# ✅ Function to Extract Text from DOCX - Unchanged
def extract_text_from_docx(docx_path):
    return docx2txt.process(docx_path)

# ✅ Extract Skills Without Using NLP Libraries - Unchanged
def extract_skills(text):
    words = set(re.findall(r"\b\w+\b", text.lower()))  # Tokenize words
    return list(SKILL_SET.intersection(words))

# ✅ Extract Experience - Unchanged
def extract_experience(text):
    experience_patterns = [
        r"(\d+)\s+years?\s+of\s+experience",
        r"worked\s+for\s+(\d+)\s+years?",
        r"(\d+)\s+\+?\s*years?\s+experience"
    ]
    for pattern in experience_patterns:
        match = re.search(pattern, text)
        if match:
            return f"{match.group(1)} years"
    return "Not Mentioned"

# ✅ Resume Parsing Function - Unchanged
def parse_resume(file_path, file_type):
    text = extract_text_from_pdf(file_path) if file_type == "pdf" else extract_text_from_docx(file_path)
    return {
        "skills": extract_skills(text),
        "experience": extract_experience(text)
    }

# **🔹 API: Parse Resume and Store Skills in DB**
@router.get("/parse-resume/{email}")
async def parse_user_resume(email: str):
    user = await user_dashboard_collection.find_one({"email": email})

    if not user or "resume_filename" not in user:
        raise HTTPException(status_code=404, detail="Resume not found for this user")

    resume_filename = user["resume_filename"]
    
    # ✅ Manually Construct Correct Resume Path - Unchanged
    resume_path = os.path.join(RESUME_DIR, resume_filename)
    resume_path = os.path.abspath(resume_path)  # Ensure absolute path

    print(f"Checking file at: {resume_path}")  # Debugging output

    if not os.path.exists(resume_path):
        raise HTTPException(status_code=404, detail="Resume file not found on the server")

    file_type = "pdf" if resume_filename.lower().endswith(".pdf") else "docx"
    parsed_data = parse_resume(resume_path, file_type)

    # ✅ **NEW: Update Extracted Skills & Experience in MongoDB**
    await user_dashboard_collection.update_one(
        {"email": email},
        {"$set": {"skills": parsed_data["skills"], "experience": parsed_data["experience"]}}
    )

    return JSONResponse({
        "email": email, 
        "skills": parsed_data["skills"], 
        "experience": parsed_data["experience"]
    })
