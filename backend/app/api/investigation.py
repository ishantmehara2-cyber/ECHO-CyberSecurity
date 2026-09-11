import uuid
from typing import Dict, Any, List
from fastapi import APIRouter, HTTPException, UploadFile, File
from app.models.schemas import InvestigationResponse
from app.services.pipeline import run_investigation_pipeline
from app.services.parsers.parser_registry import parse_and_classify_file

router = APIRouter(prefix="/api/investigations", tags=["investigations"])

# In-memory investigation storage for sessions
INVESTIGATIONS_DB: Dict[str, Dict[str, Any]] = {}

@router.post("", response_model=Dict[str, Any])
def create_investigation(mode: str = "lab", name: str = "New Cyber Investigation"):
    inv_id = f"INV-{uuid.uuid4().hex[:8]}"
    INVESTIGATIONS_DB[inv_id] = {
        "id": inv_id,
        "mode": mode,
        "name": name,
        "files": [],
        "parsed_events": [],
        "result": None
    }
    return {"investigationId": inv_id, "mode": mode, "name": name, "status": "created"}

@router.post("/{inv_id}/upload", response_model=Dict[str, Any])
async def upload_investigation_file(inv_id: str, file: UploadFile = File(...)):
    if inv_id not in INVESTIGATIONS_DB:
        # Auto-create if not existing
        INVESTIGATIONS_DB[inv_id] = {"id": inv_id, "mode": "lab", "name": "Lab Investigation", "files": [], "parsed_events": [], "result": None}

    content_bytes = await file.read()
    content_str = content_bytes.decode("utf-8", errors="ignore")

    format_detected, source_detected, events = parse_and_classify_file(content_str, file.filename or "file.log")

    file_info = {
        "id": f"file-{len(INVESTIGATIONS_DB[inv_id]['files'])+1}",
        "filename": file.filename,
        "format": format_detected,
        "source_type": source_detected,
        "event_count": len(events),
        "status": "normalized" if events else "failed"
    }

    INVESTIGATIONS_DB[inv_id]["files"].append(file_info)
    INVESTIGATIONS_DB[inv_id]["parsed_events"].extend(events)

    return file_info

@router.get("/{inv_id}/files", response_model=List[Dict[str, Any]])
def get_investigation_files(inv_id: str):
    if inv_id not in INVESTIGATIONS_DB:
        return []
    return INVESTIGATIONS_DB[inv_id]["files"]

@router.post("/{inv_id}/analyze", response_model=InvestigationResponse)
def analyze_investigation(inv_id: str):
    events = INVESTIGATIONS_DB.get(inv_id, {}).get("parsed_events", [])
    result = run_investigation_pipeline(custom_events=events if events else None)
    if inv_id in INVESTIGATIONS_DB:
        INVESTIGATIONS_DB[inv_id]["result"] = result
    return result

@router.get("/{inv_id}/summary", response_model=Dict[str, Any])
def get_investigation_summary(inv_id: str):
    res = INVESTIGATIONS_DB.get(inv_id, {}).get("result")
    if not res:
        res = run_investigation_pipeline()
    return res.summary.dict()

@router.get("/{inv_id}/candidates", response_model=List[Dict[str, Any]])
def get_investigation_candidates(inv_id: str):
    return [
        {
            "rank": 1,
            "entityName": "employee_07",
            "entityType": "identity",
            "riskScore": 92,
            "correlationConfidence": 94,
            "status": "PRIORITY INVESTIGATION"
        },
        {
            "rank": 2,
            "entityName": "employee_22",
            "entityType": "identity",
            "riskScore": 73,
            "correlationConfidence": 78,
            "status": "REVIEW RECOMMENDED"
        },
        {
            "rank": 3,
            "entityName": "service_account_09",
            "entityType": "service",
            "riskScore": 61,
            "correlationConfidence": 69,
            "status": "REVIEW RECOMMENDED"
        }
    ]

# Compatibility alias for demo endpoint
@router.post("/demo", response_model=InvestigationResponse)
def run_demo_investigation():
    return run_investigation_pipeline()
