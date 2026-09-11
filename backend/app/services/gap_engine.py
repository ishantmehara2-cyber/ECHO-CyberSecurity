from typing import List
from app.models.schemas import NormalizedEvent, EvidenceGap

def detect_evidence_gaps(events: List[NormalizedEvent]) -> List[EvidenceGap]:
    gaps = []

    has_auth = any(e.source == "authentication" for e in events)
    has_endpoint = any(e.source == "endpoint" for e in events)
    has_file = any(e.source == "file" or e.entity_asset for e in events)
    has_network = any(e.source == "network" or e.entity_ip for e in events)

    # Detect user and host names from events
    users = list(set(e.entity_user for e in events if e.entity_user))
    hosts = list(set(e.entity_host for e in events if e.entity_host))
    assets = list(set(e.entity_asset for e in events if e.entity_asset))

    user_str = users[0] if users else "Observed Account"
    host_str = hosts[0] if hosts else "Observed Host"
    asset_str = assets[0] if assets else "Target Asset"

    # Gap 1: Auth + File Access but missing Endpoint Execution logs
    if has_auth and (has_file or asset_str != "Target Asset") and not has_endpoint:
        gaps.append(EvidenceGap(
            id="GAP-01",
            expectedStage="Endpoint Process Execution Telemetry",
            observedBefore=f"Successful Authentication for {user_str}",
            observedAfter=f"Sensitive File Access on {asset_str}",
            timeWindow="Sequential window",
            whyFlagged=f"Authentication and file access were correlated for {user_str} on host {host_str}, but process execution logs were missing in ingested telemetry.",
            gapConfidence=78,
            priority="HIGH",
            recommendedSource="Endpoint / EDR Telemetry (Sysmon / Windows Event ID 4688)",
            whyRecommended=f"Endpoint telemetry is recommended because the reconstructed sequence indicates activity occurred on {host_str}, but process creation events were missing.",
            status="REQUIRES ANALYST REVIEW",
            relatedEntities=[host_str, user_str, asset_str]
        ))

    # Gap 2: Endpoint + File Access but missing Network Logs
    if has_endpoint and has_file and not has_network:
        gaps.append(EvidenceGap(
            id="GAP-02",
            expectedStage="Network Egress / Connection Logs",
            observedBefore=f"File Access on {asset_str}",
            observedAfter="Unconfirmed External Egress",
            timeWindow="Sequential window",
            whyFlagged=f"File access occurred on {host_str}, but network connection logs were absent to verify if data exfiltration took place.",
            gapConfidence=72,
            priority="MEDIUM",
            recommendedSource="Network Sensor / Firewall / Proxy Logs",
            whyRecommended=f"Network logs are recommended to verify if files accessed on {host_str} were transmitted externally.",
            status="REQUIRES ANALYST REVIEW",
            relatedEntities=[host_str, user_str, asset_str]
        ))

    return gaps
