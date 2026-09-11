from fastapi import APIRouter, HTTPException
from app.models.schemas import InvestigationRequest, InvestigationResponse
from app.services.pipeline import run_investigation_pipeline

router = APIRouter(prefix="/investigation", tags=["investigation"])

@router.post("/demo", response_model=InvestigationResponse)
def run_demo_investigation():
    try:
        return run_investigation_pipeline()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Pipeline execution error: {str(e)}")

@router.post("/analyze", response_model=InvestigationResponse)
def analyze_investigation(request: InvestigationRequest):
    try:
        return run_investigation_pipeline(custom_events=request.customEvents)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Analysis error: {str(e)}")

@router.get("/{investigation_id}", response_model=InvestigationResponse)
def get_investigation_by_id(investigation_id: str):
    try:
        return run_investigation_pipeline()
    except Exception as e:
        raise HTTPException(status_code=404, detail="Investigation ID not found")
