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

def run_investigation_pipeline(custom_events: List[Dict[str, Any]] = None) -> InvestigationResponse:
    # 1. Raw Telemetry Event Ingestion
    is_custom = custom_events is not None and len(custom_events) > 0
    raw_inputs = custom_events if is_custom else [
        {"timestamp": "10:28:43", "source": "authentication", "event": "AUTH_FAILURE", "user": "employee_07", "ip": "185.220.101.45", "device": "WORKSTATION-07", "description": "Failed authentication attempt"},
        {"timestamp": "10:30:16", "source": "authentication", "event": "AUTH_SUCCESS", "user": "employee_07", "ip": "185.220.101.45", "device": "WORKSTATION-07", "session": "SES-7F21A", "description": "Successful SSO logon"},
        {"timestamp": "10:30:42", "source": "endpoint", "event": "PROCESS_EXECUTION", "user": "employee_07", "device": "WORKSTATION-07", "process": "powershell.exe -enc", "description": "Encoded PowerShell execution"},
        {"timestamp": "10:32:28", "source": "endpoint", "event": "FILE_READ", "user": "employee_07", "device": "WORKSTATION-07", "asset": "finance_records.xlsx", "description": "Restricted file read"},
        {"timestamp": "10:34:09", "source": "file", "event": "FILE_WRITE", "user": "employee_07", "device": "WORKSTATION-07", "asset": "review_package.zip", "description": "Staging zip created"},
        {"timestamp": "10:36:19", "source": "network", "event": "HTTP_EGRESS", "user": "employee_07", "device": "WORKSTATION-07", "ip": "198.51.100.77", "destination": "sync-archive.example.test", "description": "148 MB outbound data transfer"}
    ]

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
    ranked_candidates = rank_suspicious_candidates(normalized_events)
    top_candidate = ranked_candidates[0] if ranked_candidates else None

    # Dynamic Narrative & Key Actors
    if is_custom:
        if top_candidate:
            actors = top_candidate.get("keyActors", {})
            primary_user = actors.get("primaryUser") or "Observed Entity"
            primary_host = actors.get("primaryHost") or "Observed Host"
            entry_ip = actors.get("entryIp") or "Observed IP"
            target_asset = actors.get("targetAsset") or "Asset Target"
            exfil_domain = actors.get("exfiltrationDomain") or "External Destination"

            narrative_text = (
                f"ECHO found a suspicious sequence of activity involving {primary_user}. "
                f"Activity was initiated from IP address ({entry_ip}) targeting host {primary_host}. "
                f"Subsequent actions involved process and asset activity on {primary_host}"
                + (f" accessing target resource {target_asset}" if target_asset else "") + ". "
                f"External communication was subsequently observed toward {exfil_domain}. "
                f"Based on shared identity anchors, device correlation, and temporal timestamps, "
                f"ECHO connected these {len(normalized_events)} events into a reconstructed attack sequence."
            )

            key_actors = {
                "primaryUser": primary_user,
                "primaryHost": primary_host,
                "entryIp": entry_ip,
                "targetAsset": target_asset or "Resource Target",
                "exfiltrationDomain": exfil_domain,
                "exfiltrationIp": actors.get("exfiltrationIp") or entry_ip
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
    else:
        narrative_text = (
            "ECHO found a suspicious sequence of activity involving employee_07. "
            "The activity started with repeated failed login attempts from an external IP address (185.220.101.45). "
            "Shortly after a successful login, unusual commands were executed on WORKSTATION-07. "
            "The same session then accessed the finance_records.xlsx file and transferred data to an external destination (sync-archive.example.test). "
            "Based on the timing, user account, device activity and network connection, "
            "ECHO connected these events as part of one possible attack sequence."
        )
        key_actors = {
            "primaryUser": "employee_07",
            "primaryHost": "WORKSTATION-07",
            "entryIp": "185.220.101.45",
            "targetAsset": "finance_records.xlsx",
            "exfiltrationDomain": "sync-archive.example.test",
            "exfiltrationIp": "198.51.100.77"
        }

    # Summary Narrative Generation
    summary = InvestigationSummary(
        totalCorrelatedEvents=len(normalized_events),
        evidenceConnectionsCount=len(correlation_links),
        highConfidenceCount=len(correlation_links),
        attackStagesCount=len(attack_stages),
        overallConfidenceScore=94 if not is_custom else min(70 + len(correlation_links) * 5, 96),
        narrativeText=narrative_text,
        keyActors=key_actors
    )

    return InvestigationResponse(
        investigationId=f"ECHO-INV-{int(time.time())}",
        timestamp=time.strftime("%Y-%m-%dT%H:%M:%SZ"),
        silosLoadedCount=4,
        totalRawEvents=len(normalized_events),
        coverageScore=78 if not is_custom else min(60 + len(extracted_entities) * 3, 95),
        normalizedEvents=normalized_events,
        extractedEntities=extracted_entities,
        correlationLinks=correlation_links,
        attackStages=attack_stages,
        evidenceGaps=evidence_gaps,
        summary=summary
    )
