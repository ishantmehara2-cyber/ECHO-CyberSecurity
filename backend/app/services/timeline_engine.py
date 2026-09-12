from collections import defaultdict
from datetime import datetime
from typing import Dict, List, Optional, Tuple

from app.models.schemas import AttackStage, NormalizedEvent
from app.services.correlation_engine import parse_event_timestamp

MAX_RECONSTRUCTED_STAGES = 15
TIME_BUCKET_SECONDS = 300


def _event_text(event: NormalizedEvent) -> str:
    return " ".join(
        value.lower()
        for value in (
            event.eventType,
            event.description,
            event.entity_process or "",
            event.entity_asset or "",
            event.entity_domain or "",
            event.entity_url or "",
        )
        if value
    )


def classify_stage(event: NormalizedEvent) -> Tuple[str, str, str]:
    text = _event_text(event)
    if any(word in text for word in ("failed login", "auth_failure", "authentication failure", "invalid password", "denied")):
        return "Authentication Failure", "OBSERVED", "Failed or denied authentication activity was observed"
    if any(word in text for word in ("upload", "transfer", "exfil", "egress", "outbound")):
        return "Data Transfer / Exfiltration Indicator", "INFERRED", "Outbound transfer evidence was observed"
    if any(word in text for word in ("archive", "zip", "compress", "rar", "7z", "tar", "staging")):
        return "Archive / Compression Activity", "OBSERVED", "Archive or staging activity was observed"
    if any(word in text for word in ("powershell", "cmd", "bash", "script", "process", "execution", "exec")):
        if any(word in text for word in ("suspicious", "encoded", "unusual", "malicious")):
            return "Suspicious Process Execution", "INFERRED", "A suspicious process execution indicator was observed"
        return "Process Execution", "OBSERVED", "Process or command execution activity was observed"
    if any(word in text for word in ("sensitive", "finance", "confidential", "password", "secret", "records")):
        return "Sensitive File Access", "OBSERVED", "Sensitive file or record activity was observed"
    if any(word in text for word in (".xlsx", ".csv", ".pdf", ".docx", "file", "read", "write", "document", "asset", "access")):
        return "File Access", "OBSERVED", "File or asset activity was observed"
    if any(word in text for word in ("dns", "domain", "hostname", "fqdn")):
        return "Domain / DNS Activity", "OBSERVED", "Domain or DNS activity was observed"
    if any(word in text for word in ("connection", "socket", "remote address", "http", "network", "ip")):
        if event.entity_ip or any(word in text for word in ("external", "public", "outbound")):
            return "External Network Connection", "OBSERVED", "A network connection to an external indicator was observed"
        return "Network Connection", "OBSERVED", "Network connection activity was observed"
    if any(word in text for word in ("auth", "login", "logon", "credential", "session", "sign-in")):
        return "Authentication", "OBSERVED", "Authentication or session activity was observed"
    return "Other Security Activity", "OBSERVED", "Related security telemetry was retained as supporting evidence"


def _time_bucket(parsed: Optional[datetime]) -> str:
    if parsed is None:
        return "unknown"
    return str(int(parsed.timestamp()) // TIME_BUCKET_SECONDS)


def _priority(event: NormalizedEvent, stage_name: str) -> int:
    text = _event_text(event)
    score = {"critical": 40, "high": 30, "medium": 15}.get(event.severity.lower(), 0)
    score += 20 if stage_name in {
        "Suspicious Process Execution",
        "Sensitive File Access",
        "Archive / Compression Activity",
        "Data Transfer / Exfiltration Indicator",
    } else 0
    score += 10 if event.entity_user or event.entity_host else 0
    score += 5 if any(word in text for word in ("suspicious", "encoded", "external", "restricted")) else 0
    return score


def reconstruct_attack_timeline(events: List[NormalizedEvent]) -> List[AttackStage]:
    if not events:
        return []

    classified = []
    for index, event in enumerate(events):
        parsed = parse_event_timestamp(event.timestamp)
        stage_name, status, reason = classify_stage(event)
        anchor = event.entity_user or event.entity_host or event.entity_asset or event.entity_process or event.source
        classified.append((parsed, index, event, stage_name, status, reason, anchor))

    # Group by meaningful activity, actor, source and a short time window rather than raw rows.
    groups: Dict[Tuple[str, str, str, str], List[Tuple[Optional[datetime], int, NormalizedEvent, str, str, str, str]]] = defaultdict(list)
    for item in classified:
        parsed, _, event, stage_name, _, _, anchor = item
        groups[(stage_name, anchor, event.source, _time_bucket(parsed))].append(item)

    grouped = []
    for items in groups.values():
        ordered = sorted(items, key=lambda item: (item[0] is None, item[0] or datetime.max, item[1]))
        parsed = next((item[0] for item in ordered if item[0] is not None), None)
        representative = max(ordered, key=lambda item: _priority(item[2], item[3]))
        _, _, event, stage_name, status, reason, _ = representative
        timestamps = [item[2].timestamp for item in ordered if item[2].timestamp]
        timestamp = timestamps[0] if timestamps else "Unknown time"
        if len(set(timestamps)) > 1:
            timestamp = f"{timestamps[0]}–{timestamps[-1]}"
        grouped.append({
            "parsed": parsed,
            "event": event,
            "stage_name": stage_name,
            "status": status,
            "reason": reason,
            "items": ordered,
            "priority": max(_priority(item[2], item[3]) for item in ordered),
            "timestamp": timestamp,
        })

    grouped.sort(key=lambda group: (group["parsed"] is None, group["parsed"] or datetime.max, -group["priority"]))
    if len(grouped) > MAX_RECONSTRUCTED_STAGES:
        # Keep the strongest evidence while restoring chronological order for replay.
        selected = sorted(sorted(grouped, key=lambda group: group["priority"], reverse=True)[:MAX_RECONSTRUCTED_STAGES],
                          key=lambda group: (group["parsed"] is None, group["parsed"] or datetime.max))
    else:
        selected = grouped

    stages: List[AttackStage] = []
    for number, group in enumerate(selected, start=1):
        event = group["event"]
        items = group["items"]
        related_ids = [item[2].id for item in items]
        sources = {item[2].source for item in items}
        parsed = group["parsed"]
        reason = group["reason"]
        if len(items) > 1:
            reason = f"{reason}; grouped {len(items)} related telemetry records"
        stages.append(AttackStage(
            stageNumber=number,
            stageName=group["stage_name"],
            timestamp=group["timestamp"],
            source=event.source,
            eventTitle=event.description or event.eventType or group["stage_name"],
            entity=event.entity_user or event.entity_process or event.entity_host or "Observed Entity",
            ipOrDevice=event.entity_host or event.entity_ip or "Observed Indicator",
            severity=event.severity,
            riskLevel=event.severity.upper() if event.severity in {"critical", "high"} else "MODERATE",
            connectionExplanation=reason,
            confidenceScore=82 if parsed else 55,
            confidenceReasons=[
                reason,
                "Timestamp parsed and used for ordering" if parsed else "Timestamp unavailable; evidence grouping preserved original order",
            ],
            statusType=group["status"],
            relatedEventIds=related_ids,
            eventCount=len(items),
            sourceCount=len(sources),
        ))
    return stages
