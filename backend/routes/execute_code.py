import requests
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

router = APIRouter()

PISTON_API_URL = "https://emkc.org/api/v2/piston/execute"

LANGUAGE_VERSIONS = {
    "python": "3.10.0",
    "cpp": "10.2.0",
    "java": "15.0.2",
}

class CodeExecutionRequest(BaseModel):
    language: str
    source_code: str
    input_data: str = ""

@router.post("/execute/")
def execute_code(request: CodeExecutionRequest):
    payload = {
        "language": request.language,
        "version": LANGUAGE_VERSIONS.get(request.language, "latest"),
        "files": [{"name": "main", "content": request.source_code}],
        "stdin": request.input_data,
    }

    try:
        response = requests.post(PISTON_API_URL, json=payload)
        response.raise_for_status()
        result = response.json()
    except requests.RequestException as e:
        raise HTTPException(status_code=500, detail=f"Error connecting to Piston API: {str(e)}")

    return {
        "output": result["run"]["stdout"].strip() if "run" in result and "stdout" in result["run"] else "No Output",
        "error": result["run"]["stderr"].strip() if "run" in result and "stderr" in result["run"] else "",
        "exit_code": result["run"]["code"] if "run" in result and "code" in result["run"] else -1
    }
