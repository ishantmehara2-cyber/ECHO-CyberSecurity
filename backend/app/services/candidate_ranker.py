from typing import List, Dict, Any
from app.models.schemas import NormalizedEvent

SUSPICIOUS_PROCESS_KEYWORDS = ["powershell", "cmd", "encoded", "exec", "bash", "nc", "mimikatz", "psexec", "whoami", "net group", "reg"]
SENSITIVE_FILE_KEYWORDS = ["xlsx", "zip", "pdf", "docx", "finance", "secret", "confidential", "db", "passwords", "credit", "ledger"]

def rank_suspicious_candidates(events: List[NormalizedEvent]) -> List[Dict[str, Any]]:
    if not events:
        return []

    # Group events by user principal, host, or IP
    entity_events: Dict[str, List[NormalizedEvent]] = {}
    entity_types: Dict[str, str] = {}

    for evt in events:
        if evt.entity_user:
            key = evt.entity_user
            entity_events.setdefault(key, []).append(evt)
            entity_types[key] = "identity"
        elif evt.entity_host:
            key = evt.entity_host
            entity_events.setdefault(key, []).append(evt)
            entity_types[key] = "endpoint"
        elif evt.entity_ip:
            key = evt.entity_ip
            entity_events.setdefault(key, []).append(evt)
            entity_types[key] = "ip"

    candidates = []

    for name, evt_list in entity_events.items():
        risk_score = 0
        confidence_score = 50
        why_flagged = []
        risk_breakdown = []
        confidence_breakdown = []
        indicators = []

        sources_involved = list(set(e.source for e in evt_list))
        hosts_involved = list(set(e.entity_host for e in evt_list if e.entity_host))
        ips_involved = list(set(e.entity_ip for e in evt_list if e.entity_ip))
        assets_involved = list(set(e.entity_asset for e in evt_list if e.entity_asset))

        # Signal 1: Authentication Failures & Successes
        auth_fails = [e for e in evt_list if "fail" in e.eventType.lower() or "error" in e.description.lower()]
        auth_succs = [e for e in evt_list if "success" in e.eventType.lower() or "logon" in e.eventType.lower()]

        if auth_fails:
            points = min(len(auth_fails) * 10, 30)
            risk_score += points
            why_flagged.append(f"{len(auth_fails)} authentication failure(s) recorded")
            risk_breakdown.append({"signal": f"{len(auth_fails)} failed authentication attempts", "points": points})
            indicators.append("Auth Failures")

        if auth_fails and auth_succs:
            risk_score += 15
            why_flagged.append("Successful authentication established shortly following failed login attempts")
            risk_breakdown.append({"signal": "Logon success following authentication failures", "points": 15})
            indicators.append("Auth Recovery")

        # Signal 2: Suspicious Process Execution
        proc_evts = [e for e in evt_list if e.entity_process or any(k in e.description.lower() for k in SUSPICIOUS_PROCESS_KEYWORDS)]
        if proc_evts:
            risk_score += 25
            proc_names = ", ".join(set(e.entity_process or "command execution" for e in proc_evts[:2]))
            why_flagged.append(f"Suspicious process execution observed ({proc_names})")
            risk_breakdown.append({"signal": f"Process execution ({proc_names})", "points": 25})
            indicators.append("Process Execution")

        # Signal 3: Sensitive File or Asset Read/Access
        file_evts = [e for e in evt_list if e.entity_asset or any(k in e.description.lower() for k in SENSITIVE_FILE_KEYWORDS)]
        if file_evts:
            risk_score += 20
            asset_names = ", ".join(set(e.entity_asset or "sensitive file" for e in file_evts[:2]))
            why_flagged.append(f"Access to sensitive file/asset target ({asset_names})")
            risk_breakdown.append({"signal": f"Sensitive file access ({asset_names})", "points": 20})
            indicators.append("Asset Access")

        # Signal 4: Network Egress / Connection
        net_evts = [e for e in evt_list if e.source == "network" or "egress" in e.eventType.lower() or "http" in e.eventType.lower()]
        if net_evts:
            risk_score += 18
            why_flagged.append(f"{len(net_evts)} network connection/egress transfer event(s) recorded")
            risk_breakdown.append({"signal": "Outbound network connection / data egress", "points": 18})
            indicators.append("Network Egress")

        # Signal 5: Multi-silo Presence
        if len(sources_involved) > 1:
            confidence_score += len(sources_involved) * 10
            why_flagged.append(f"Activity correlated across {len(sources_involved)} telemetry sources ({', '.join(sources_involved)})")
            confidence_breakdown.append({"signal": f"Cross-silo presence across {len(sources_involved)} sources", "points": len(sources_involved) * 10})

        # Confidence Factors
        confidence_breakdown.append({"signal": f"Shared Identity Anchor ({name})", "points": 25})
        confidence_score += 25

        if hosts_involved:
            confidence_breakdown.append({"signal": f"Shared Workstation Host ({hosts_involved[0]})", "points": 20})
            confidence_score += 20

        risk_score = min(max(risk_score, 35), 98)
        confidence_score = min(max(confidence_score, 60), 98)

        status = "PRIORITY INVESTIGATION" if risk_score >= 80 else "REVIEW RECOMMENDED" if risk_score >= 55 else "LOW PRIORITY"
        reason = f"Suspicious activity involving {name} across {len(sources_involved)} source(s)"

        candidates.append({
            "rank": 0,  # Will assign after sort
            "id": f"cand-{len(candidates)+1}",
            "entityName": name,
            "entityType": entity_types.get(name, "identity"),
            "riskLevel": "HIGH" if risk_score >= 80 else "MEDIUM-HIGH" if risk_score >= 65 else "MEDIUM",
            "riskScore": risk_score,
            "correlationConfidence": confidence_score,
            "sourcesInvolved": sources_involved,
            "eventCount": len(evt_list),
            "indicators": indicators or ["Observed Telemetry"],
            "primaryReason": reason,
            "status": status,
            "whyFlagged": why_flagged or [f"Activity recorded on {', '.join(sources_involved)}"],
            "riskBreakdown": risk_breakdown or [{"signal": "Observed activity events", "points": risk_score}],
            "confidenceBreakdown": confidence_breakdown,
            "keyActors": {
                "primaryUser": name,
                "primaryHost": hosts_involved[0] if hosts_involved else "HOST-01",
                "entryIp": ips_involved[0] if ips_involved else "10.0.1.15",
                "targetAsset": assets_involved[0] if assets_involved else None,
                "exfiltrationDomain": "external-destination.test",
                "exfiltrationIp": ips_involved[-1] if len(ips_involved) > 1 else "198.51.100.77"
            }
        })

    # Sort candidates by Risk Score descending
    candidates.sort(key=lambda c: c["riskScore"], reverse=True)
    for idx, c in enumerate(candidates):
        c["rank"] = idx + 1

    return candidates
