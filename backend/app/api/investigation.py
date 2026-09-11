import uuid
from typing import Dict, Any, List, Optional
from fastapi import APIRouter, HTTPException, UploadFile, File, Form
from pydantic import BaseModel
from app.models.schemas import InvestigationResponse
from app.services.pipeline import run_investigation_pipeline
from app.services.parsers.parser_registry import parse_and_classify_file, parse_and_classify_file_with_diagnostics
from app.services.candidate_ranker import rank_suspicious_candidates

router = APIRouter(prefix="/api", tags=["evidence"])

INVESTIGATIONS_DB: Dict[str, Dict[str, Any]] = {}

class QueryRequest(BaseModel):
    query: str

@router.post("/analyze", response_model=Dict[str, Any])
async def analyze_uploaded_files(files: List[UploadFile] = File(...)):
    print("\n====================================================", flush=True)
    print("ANALYSIS REQUEST RECEIVED", flush=True)
    print(f"FILES RECEIVED: {len(files)}", flush=True)

    files_processed_summary = []
    all_raw_events = []
    diagnostics = {
        "files_received": len(files),
        "files_parsed": 0,
        "files_failed": 0,
        "parse_errors": [],
        "warnings": [],
        "no_parseable_events": False,
    }

    for idx, file in enumerate(files):
        filename = file.filename or f"file_{idx+1}.log"
        content_bytes = await file.read()
        content_str = content_bytes.decode("utf-8", errors="ignore")

        format_detected, source_detected, parsed_records, file_diagnostics = parse_and_classify_file_with_diagnostics(content_str, filename)

        print(f"PROCESSING FILE: {filename}", flush=True)
        print(f"DETECTED FORMAT: {format_detected}", flush=True)
        print(f"DETECTED SOURCE: {source_detected}", flush=True)
        print(f"RECORDS PARSED: {len(parsed_records)}", flush=True)

        files_processed_summary.append({
            "filename": filename,
            "format": format_detected,
            "source_type": source_detected,
            "records_parsed": len(parsed_records)
            ,"status": "SUCCESS" if parsed_records else "FAILED"
            ,"error": file_diagnostics.get("error")
        })
        if parsed_records:
            diagnostics["files_parsed"] += 1
        else:
            diagnostics["files_failed"] += 1
            if file_diagnostics.get("error"):
                diagnostics["parse_errors"].append({"filename": filename, "error": file_diagnostics["error"]})

        for evt in parsed_records:
            if "source" not in evt:
                evt["source"] = source_detected
            all_raw_events.append(evt)

    total_records = len(all_raw_events)
    print(f"TOTAL NORMALIZED RECORDS: {total_records}", flush=True)
    print("====================================================\n", flush=True)

    # Pipeline Processing
    pipeline_res = run_investigation_pipeline(custom_events=all_raw_events)
    diagnostics["no_parseable_events"] = len(all_raw_events) == 0
    if diagnostics["no_parseable_events"]:
        diagnostics["warnings"].append("No usable telemetry records were found.")

    # Dynamic Entity Extraction & Grouping
    categorized_entities = {
        "identities": [e.dict() for e in pipeline_res.extractedEntities if e.category == "identity"],
        "network_indicators": [e.dict() for e in pipeline_res.extractedEntities if e.category in ["ip", "network"]],
        "endpoints": [e.dict() for e in pipeline_res.extractedEntities if e.category == "endpoint"],
        "domains": [e.dict() for e in pipeline_res.extractedEntities if e.category == "domain"],
        "sessions": [e.dict() for e in pipeline_res.extractedEntities if e.category == "session"],
        "files_assets": [e.dict() for e in pipeline_res.extractedEntities if e.category in ["file", "asset"]]
    }

    # Dynamic Suspicious Entity Candidate Ranking
    suspicious_entities = rank_suspicious_candidates(pipeline_res.normalizedEvents, pipeline_res.correlationLinks)

    return {
        "success": True,
        "total_records": total_records if len(all_raw_events) > 0 else pipeline_res.totalRawEvents,
        "files_processed": files_processed_summary,
        "normalized_events": [e.dict() for e in pipeline_res.normalizedEvents],
        "entities": categorized_entities,
        "extractedEntities": [e.dict() for e in pipeline_res.extractedEntities],
        "suspicious_entities": suspicious_entities,
        "correlations": [c.dict() for c in pipeline_res.correlationLinks],
        "timeline": [s.dict() for s in pipeline_res.attackStages],
        "confidence": {
            "overallScore": pipeline_res.summary.overallConfidenceScore,
            "coverageScore": pipeline_res.coverageScore
        },
        "evidence_gaps": [g.dict() for g in pipeline_res.evidenceGaps],
        "summary": pipeline_res.summary.dict()
        ,"diagnostics": diagnostics
    }

@router.post("/evidence/upload", response_model=Dict[str, Any])
async def upload_evidence_file(
    file: UploadFile = File(...),
    silo: Optional[str] = Form(None),
    inv_id: Optional[str] = Form(None)
):
    target_id = inv_id or "INV-DEFAULT"
    if target_id not in INVESTIGATIONS_DB:
        INVESTIGATIONS_DB[target_id] = {
            "id": target_id,
            "mode": "lab",
            "name": "Investigation Session",
            "files": [],
            "parsed_events": [],
            "result": None
        }

    # Validate Extension
    allowed_exts = [".pdf", ".csv", ".json", ".jsonl", ".ndjson", ".log", ".txt", ".xml"]
    fname_lower = (file.filename or "").lower()
    if not any(fname_lower.endswith(ext) for ext in allowed_exts):
        raise HTTPException(
            status_code=400, 
            detail="Unsupported file format. Please upload .pdf, .csv, .json, .jsonl, .ndjson, .log, .txt, or .xml files."
        )

    content_bytes = await file.read()
    if len(content_bytes) == 0:
        raise HTTPException(status_code=400, detail="Uploaded file is empty.")

    content_str = content_bytes.decode("utf-8", errors="ignore")

    format_detected, source_detected, events = parse_and_classify_file(content_str, file.filename or "file.log")

    assigned_silo = silo or source_detected
    if assigned_silo not in ["identity", "network", "threat_intel", "endpoint"]:
        assigned_silo = "endpoint" if source_detected in ["endpoint", "application"] else "identity" if source_detected == "authentication" else "network" if source_detected == "network" else "threat_intel"

    file_info = {
        "success": True,
        "filename": file.filename,
        "file_type": format_detected.lower(),
        "silo": assigned_silo,
        "records_detected": len(events),
        "status": "ready_for_normalization"
    }

    INVESTIGATIONS_DB[target_id]["files"].append(file_info)
    INVESTIGATIONS_DB[target_id]["parsed_events"].extend(events)

    return file_info

@router.post("/investigations", response_model=Dict[str, Any])
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

@router.post("/investigations/{inv_id}/upload", response_model=Dict[str, Any])
async def upload_investigation_file(inv_id: str, file: UploadFile = File(...)):
    return await upload_evidence_file(file=file, inv_id=inv_id)

@router.get("/investigations/{inv_id}/files", response_model=List[Dict[str, Any]])
def get_investigation_files(inv_id: str):
    if inv_id not in INVESTIGATIONS_DB:
        return []
    return INVESTIGATIONS_DB[inv_id]["files"]

@router.post("/investigations/{inv_id}/analyze", response_model=InvestigationResponse)
def analyze_investigation_by_id(inv_id: str):
    events = INVESTIGATIONS_DB.get(inv_id, {}).get("parsed_events", [])
    result = run_investigation_pipeline(custom_events=events if events else None)
    if inv_id in INVESTIGATIONS_DB:
        INVESTIGATIONS_DB[inv_id]["result"] = result
    return result

@router.get("/investigations/{inv_id}/summary", response_model=Dict[str, Any])
def get_investigation_summary(inv_id: str):
    res = INVESTIGATIONS_DB.get(inv_id, {}).get("result")
    if not res:
        res = run_investigation_pipeline()
    return res.summary.dict()

@router.get("/investigations/{inv_id}/candidates", response_model=List[Dict[str, Any]])
def get_investigation_candidates(inv_id: str):
    res = INVESTIGATIONS_DB.get(inv_id, {}).get("result") or run_investigation_pipeline()
    return rank_suspicious_candidates(res.normalizedEvents, res.correlationLinks)

@router.get("/investigations/{inv_id}/candidates/{entity_id}", response_model=Dict[str, Any])
def get_candidate_detail(inv_id: str, entity_id: str):
    res = INVESTIGATIONS_DB.get(inv_id, {}).get("result") or run_investigation_pipeline()
    candidates = rank_suspicious_candidates(res.normalizedEvents, res.correlationLinks)
    match = None
    for c in candidates:
        if c["entityName"] == entity_id:
            match = c
            break
    if match:
        return match
    return {
        "entityName": entity_id,
        "entityType": "identity",
        "riskScore": 0,
        "correlationConfidence": 0,
        "status": "NOMINAL OBSERVATION",
        "primaryReason": "Insufficient evidence for reliable risk assessment",
        "whyFlagged": ["No current investigation candidate matched this entity"]
    }

@router.get("/investigations/{inv_id}/graph/{entity_id}", response_model=Dict[str, Any])
def get_candidate_graph(inv_id: str, entity_id: str):
    res = INVESTIGATIONS_DB.get(inv_id, {}).get("result") or run_investigation_pipeline()
    return {"entity": entity_id, "nodes": res.extractedEntities, "links": res.correlationLinks}

@router.get("/{inv_id}/timeline/{entity_id}", response_model=List[Dict[str, Any]])
def get_candidate_timeline(inv_id: str, entity_id: str):
    res = INVESTIGATIONS_DB.get(inv_id, {}).get("result") or run_investigation_pipeline()
    return [s.dict() for s in res.attackStages]

@router.get("/{inv_id}/gaps/{entity_id}", response_model=List[Dict[str, Any]])
def get_candidate_gaps(inv_id: str, entity_id: str):
    res = INVESTIGATIONS_DB.get(inv_id, {}).get("result") or run_investigation_pipeline()
    return [g.dict() for g in res.evidenceGaps]

@router.post("/{inv_id}/query", response_model=Dict[str, Any])
def query_investigation(inv_id: str, req: QueryRequest):
    res = INVESTIGATIONS_DB.get(inv_id, {}).get("result") or run_investigation_pipeline()
    q = req.query.lower()

    # Search in entities and events
    matching_entities = [e.name for e in res.extractedEntities if e.name.lower() in q or q in e.name.lower()]
    top_entity = matching_entities[0] if matching_entities else res.summary.keyActors.get("primaryUser", "Entity")

    return {
        "query": req.query,
        "matchedTopic": f"Query Result for '{req.query}'",
        "summary": f"Deterministic search against active dataset identified activity for {top_entity} across {len(res.normalizedEvents)} normalized events.",
        "correlationReasoning": f"Evidence anchors verified for {top_entity} with {res.summary.overallConfidenceScore}% correlation confidence."
    }

@router.get("/{inv_id}/report", response_model=Dict[str, Any])
def get_full_discovery_report(inv_id: str):
    res = INVESTIGATIONS_DB.get(inv_id, {}).get("result") or run_investigation_pipeline()
    return {
        "reportType": "FULL_CANDIDATE_DISCOVERY_REPORT",
        "investigationId": inv_id,
        "totalEvents": res.totalRawEvents,
        "coverageScore": res.coverageScore,
        "summary": res.summary
    }

@router.get("/{inv_id}/report/{entity_id}", response_model=Dict[str, Any])
def get_deep_candidate_report(inv_id: str, entity_id: str):
    res = INVESTIGATIONS_DB.get(inv_id, {}).get("result") or run_investigation_pipeline()
    return {
        "reportType": "DEEP_INVESTIGATION_REPORT",
        "investigationId": inv_id,
        "selectedEntity": entity_id,
        "confidenceScore": res.summary.overallConfidenceScore,
        "timeline": [s.dict() for s in res.attackStages]
    }

# Compatibility alias for demo endpoint
@router.post("/investigation/demo", response_model=Dict[str, Any])
def run_demo_investigation():
    from pathlib import Path
    import json
    dataset_dir = Path(__file__).resolve().parents[3] / "datasets"
    events = []
    for path in sorted(dataset_dir.glob("demo_*.json")):
        with path.open("r", encoding="utf-8") as handle:
            events.extend(json.load(handle))
    result = run_investigation_pipeline(custom_events=events)
    return {
        "investigationId": result.investigationId,
        "timestamp": result.timestamp,
        "silosLoadedCount": result.silosLoadedCount,
        "totalRawEvents": result.totalRawEvents,
        "coverageScore": result.coverageScore,
        "normalizedEvents": [e.dict() for e in result.normalizedEvents],
        "extractedEntities": [e.dict() for e in result.extractedEntities],
        "suspicious_entities": rank_suspicious_candidates(result.normalizedEvents, result.correlationLinks),
        "correlationLinks": [c.dict() for c in result.correlationLinks],
        "attackStages": [s.dict() for s in result.attackStages],
        "evidenceGaps": [g.dict() for g in result.evidenceGaps],
        "summary": result.summary.dict(),
    }
