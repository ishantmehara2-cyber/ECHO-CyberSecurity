import time
from typing import List, Dict, Any
from app.models.schemas import (
    InvestigationResponse, 
    InvestigationSummary
)
from app.services.normalizer import normalize_raw_event
from app.services.entity_extractor import extract_entities_from_events
from app.services.correlation_engine import correlate_normalized_events
from app.services.timeline_engine import reconstruct_attack_timeline
from app.services.gap_engine import detect_evidence_gaps
from app.services.candidate_ranker import rank_suspicious_candidates

def run_investigation_pipeline(
    custom_events: List[Dict[str, Any]] = None,
    allow_default_demo: bool = False,
) -> InvestigationResponse:
    # 1. Raw Telemetry Event Ingestion
    is_custom = custom_events is not None and len(custom_events) > 0
    raw_inputs = custom_events if is_custom else ([
        {"timestamp": "10:28:43", "source": "authentication", "event": "AUTH_FAILURE", "user": "employee_07", "ip": "185.220.101.45", "device": "WORKSTATION-07", "description": "Failed authentication attempt"},
        {"timestamp": "10:30:16", "source": "authentication", "event": "AUTH_SUCCESS", "user": "employee_07", "ip": "185.220.101.45", "device": "WORKSTATION-07", "session": "SES-7F21A", "description": "Successful SSO logon"},
        {"timestamp": "10:30:42", "source": "endpoint", "event": "PROCESS_EXECUTION", "user": "employee_07", "device": "WORKSTATION-07", "process": "powershell.exe -enc", "description": "Encoded PowerShell execution"},
        {"timestamp": "10:32:28", "source": "endpoint", "event": "FILE_READ", "user": "employee_07", "device": "WORKSTATION-07", "asset": "finance_records.xlsx", "description": "Restricted file read"},
        {"timestamp": "10:34:09", "source": "file", "event": "FILE_WRITE", "user": "employee_07", "device": "WORKSTATION-07", "asset": "review_package.zip", "description": "Staging zip created"},
        {"timestamp": "10:36:19", "source": "network", "event": "HTTP_EGRESS", "user": "employee_07", "device": "WORKSTATION-07", "ip": "198.51.100.77", "destination": "sync-archive.example.test", "description": "148 MB outbound data transfer"}
    ] if allow_default_demo else [])

    if not raw_inputs:
        return InvestigationResponse(
            investigationId=f"ECHO-INV-{int(time.time())}",
            timestamp=time.strftime("%Y-%m-%dT%H:%M:%SZ"),
            silosLoadedCount=0,
            totalRawEvents=0,
            coverageScore=0,
            normalizedEvents=[],
            extractedEntities=[],
            correlationLinks=[],
            attackStages=[],
            evidenceGaps=[],
            summary=InvestigationSummary(
                totalCorrelatedEvents=0,
                evidenceConnectionsCount=0,
                highConfidenceCount=0,
                attackStagesCount=0,
                overallConfidenceScore=0,
                narrativeText="No usable telemetry records were found.",
                keyActors={},
            ),
        )

    # 2. Normalization
    normalized_events = []
    for idx, raw_evt in enumerate(raw_inputs):
        source = raw_evt.get("source", "authentication")
        normalized_events.append(normalize_raw_event(f"evt-{idx+1}", raw_evt, source_type=source))

    # 3. Entity Extraction
    extracted_entities = extract_entities_from_events(normalized_events)

    # 4. Event Correlation
    correlation_links = correlate_normalized_events(normalized_events)

    # 5. Temporal Attack Timeline Reconstruction
    attack_stages = reconstruct_attack_timeline(normalized_events)

    # 6. Evidence Gap Detection
    evidence_gaps = detect_evidence_gaps(normalized_events)

    # 7. Dynamic Suspicious Candidate Discovery Ranking
    ranked_candidates = rank_suspicious_candidates(normalized_events, correlation_links)
    top_candidate = ranked_candidates[0] if ranked_candidates else None

    # Dynamic Narrative & Key Actors
    if is_custom:
        if top_candidate:
            actors = top_candidate.get("keyActors", {})
            primary_user = actors.get("primaryUser") or "Observed Entity"
            primary_host = actors.get("primaryHost") or "Observed Host"
            entry_ip = actors.get("entryIp") or "Observed IP"
            target_asset = actors.get("targetAsset")
            exfil_domain = actors.get("exfiltrationDomain")
            narrative_text = (
                f"ECHO found a suspicious sequence of activity involving {primary_user}. "
                f"Observed activity involved host {primary_host}"
                + (f" and IP address {entry_ip}" if entry_ip else "")
                + (f", including activity against {target_asset}" if target_asset else "")
                + (f". Network activity referenced {exfil_domain}" if exfil_domain else "")
                + f". ECHO connected these {len(normalized_events)} events using shared entity anchors and available timestamps."
            )

            key_actors = {
                "primaryUser": primary_user,
                "primaryHost": primary_host,
                "entryIp": entry_ip,
                "targetAsset": target_asset or "None Detected",
                "exfiltrationDomain": exfil_domain or "None Detected",
                "exfiltrationIp": actors.get("exfiltrationIp") or "None Detected"
            }
        else:
            first_evt = normalized_events[0] if normalized_events else None
            user_name = (first_evt.entity_user if first_evt else None) or "Observed Entity"
            host_name = (first_evt.entity_host if first_evt else None) or "Observed Host"
            ip_name = (first_evt.entity_ip if first_evt else None) or "Observed IP"

            narrative_text = (
                f"ECHO processed {len(normalized_events)} events from uploaded telemetry. "
                f"Extracted activity involving {user_name} on host {host_name} ({ip_name}). "
                "No high-risk multi-stage attack sequence was detected across available events."
            )
            key_actors = {
                "primaryUser": user_name,
                "primaryHost": host_name,
                "entryIp": ip_name,
                "targetAsset": "None Detected",
                "exfiltrationDomain": "None Detected",
                "exfiltrationIp": ip_name
            }
    # Summary Narrative Generation
    summary = InvestigationSummary(
        totalCorrelatedEvents=len(normalized_events),
        evidenceConnectionsCount=len(correlation_links),
        highConfidenceCount=len(correlation_links),
        attackStagesCount=len(attack_stages),
        overallConfidenceScore=min(95, max(0, round(sum(c.confidenceScore for c in correlation_links) / len(correlation_links)))) if correlation_links else 0,
        narrativeText=narrative_text,
        keyActors=key_actors
    )

    return InvestigationResponse(
        investigationId=f"ECHO-INV-{int(time.time())}",
        timestamp=time.strftime("%Y-%m-%dT%H:%M:%SZ"),
        silosLoadedCount=len({e.source for e in normalized_events}),
        totalRawEvents=len(normalized_events),
        coverageScore=min(100, round((len({e.source for e in normalized_events}) / 4) * 100)) if normalized_events else 0,
        normalizedEvents=normalized_events,
        extractedEntities=extracted_entities,
        correlationLinks=correlation_links,
        attackStages=attack_stages,
        evidenceGaps=evidence_gaps,
        summary=summary
    )
