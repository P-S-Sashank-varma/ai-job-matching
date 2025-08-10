from fastapi import APIRouter, HTTPException
from fastapi.responses import JSONResponse
import os
import re
import PyPDF2
import docx2txt
from database import user_dashboard_collection

router = APIRouter()

# ✅ Resolve resume directory relative to backend and routes directories
BACKEND_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
RESUME_DIR_BACKEND = os.path.join(BACKEND_DIR, "uploads", "resumes")
RESUME_DIR_ROUTES = os.path.join(os.path.dirname(os.path.abspath(__file__)), "uploads", "resumes")
for _path in [RESUME_DIR_BACKEND, RESUME_DIR_ROUTES]:
    os.makedirs(_path, exist_ok=True)

# ✅ Define Skills List - Unchanged
SKILL_SET = {
    # Programming Languages
    "c", "c++", "java", "python", "c#", "php", "r language", "go", "swift", "kotlin", "dart", "typescript", "javascript", "rust", "scala", "haskell", "elixir", "lua", "perl", "ruby",
    
    # Web Development
    "html", "css", "html5", "css3", "javascript (ES6+)", "typescript", "react.js", "angular.js", "vue.js", "svelte", "next.js", "nuxt.js", "bootstrap", "tailwindcss", "material-ui", "chakra-ui", "scss", "less", "jquery", "webpack", "vite", "parcel", "babel",
    
    # Backend Development
    "nodejs", "expressjs", "flask", "django", "fastapi", "spring boot", "asp.net", "ruby on rails", "laravel", "symfony", "nestjs", "adonisjs", "gin-gonic", "fiber", "hapi.js", "koa.js",
    
    # Databases
    "mongodb", "sql", "mysql", "postgresql", "sqlite", "firebase", "dynamodb", "cassandra", "neo4j", "redis", "couchdb", "arangodb", "cockroachdb", "tidb",
    
    # Cloud & DevOps
    "aws", "gcp", "azure", "docker", "kubernetes", "terraform", "ansible", "jenkins", "github actions", "gitlab ci/cd", "travis ci", "circleci", "aws lambda", "heroku", "vercel", "netlify", "digitalocean", "cloudflare",
    
    # AI/ML
    "machine learning", "deep learning", "tensorflow", "keras", "pytorch", "scikit-learn", "hugging face", "openai api", "spacy", "nltk", "gensim", "opencv", "mediapipe", "mlflow", "kubeflow", "ray", "dask", "fastai", "nlp",
    
    # Cybersecurity
    "cyber security", "penetration testing", "ethical hacking", "metasploit", "burp suite", "nmap", "wireshark", "osint", "forensics", "kali linux", "snort", "owasp top 10",
    
    # Blockchain & Web3
    "solidity", "web3.js", "ethers.js", "truffle", "hardhat", "polygon", "binance smart chain", "nft development", "ipfs", "smart contracts",
    
    # Networking
    "tcp/ip", "dns", "dhcp", "vpn", "firewalls", "load balancing", "proxy servers", "nginx", "apache", "haproxy",
    
    # Mobile App Development
    "react native", "flutter", "kotlin", "swift", "dart", "xamarin", "cordova", "ionic",
    
    # Big Data & Data Engineering
    "hadoop", "spark", "kafka", "apache flink", "hive", "pig", "airflow", "dbt", "delta lake",
    
    # Operating Systems
    "windows", "macos", "ubuntu", "centos", "debian", "redhat", "arch linux", "freebsd",
    
    # Game Development
    "unity", "unreal engine", "godot", "cocos2d", "phaser.js",
    
    # UI/UX & Graphic Design
    "figma", "adobe xd", "sketch", "photoshop", "illustrator", "invision", "blender",
    
    # Data Analytics & Business Intelligence
    "Power BI", "tableau", "excel", "data analytics", "business intelligence",
    
    # Testing
    "jest", "mocha", "chai", "cypress", "selenium", "junit", "pytest",
    
    # Productivity & Tools
    "git", "github", "gitlab", "bitbucket", "postman", "swagger", "notion", "slack", "jira", "confluence",
    
    # Soft Skills
    "communication", "leadership", "teamwork", "critical thinking", "problem-solving", "time management", "negotiation"
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
def _normalize(s: str) -> str:
    return re.sub(r"[^a-z0-9]", "", s.lower())

def extract_skills(text: str):
    # Normalize text for robust matching (handles dots/spaces like react.js, machine learning)
    text_lower = text.lower()
    text_compact = _normalize(text_lower)
    found = set()
    for skill in SKILL_SET:
        norm_skill = _normalize(skill)
        if not norm_skill:
            continue
        if norm_skill in text_compact:
            found.add(skill)
            continue
        # Fallback token-based match for single-word skills
        if " " not in skill and "." not in skill:
            if re.search(rf"\b{re.escape(skill.lower())}\b", text_lower):
                found.add(skill)
    return list(found)

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

    # Prefer the exact stored path if available
    resume_path = user.get("resume_path")
    if not resume_path or not os.path.exists(resume_path):
        resume_filename = user["resume_filename"]
        # Try both backend-level and routes-level upload directories
        candidate_paths = [
            os.path.abspath(os.path.join(RESUME_DIR_BACKEND, resume_filename)),
            os.path.abspath(os.path.join(RESUME_DIR_ROUTES, resume_filename)),
        ]
        resume_path = next((p for p in candidate_paths if os.path.exists(p)), None)

    if not resume_path or not os.path.exists(resume_path):
        raise HTTPException(status_code=404, detail="Resume file not found on the server")

    file_type = "pdf" if resume_path.lower().endswith(".pdf") else "docx"
    parsed_data = parse_resume(resume_path, file_type)

    # ✅ Update extracted skills & experience in MongoDB
    await user_dashboard_collection.update_one(
        {"email": email},
        {"$set": {"skills": parsed_data["skills"], "experience": parsed_data["experience"]}},
        upsert=False,
    )

    return JSONResponse({
        "email": email,
        "skills": parsed_data["skills"],
        "experience": parsed_data["experience"],
        "resume_path": resume_path,
    })
