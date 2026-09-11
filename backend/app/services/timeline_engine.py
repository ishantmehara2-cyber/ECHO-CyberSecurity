from typing import List

from app.models.schemas import NormalizedEvent, AttackStage
from app.services.correlation_engine import parse_event_timestamp


def classify_stage(event: NormalizedEvent) -> tuple[str, str, str]:
    text = f"{event.eventType} {event.description} {event.entity_process or ''} {event.entity_asset or ''}".lower()
    if any(word in text for word in ("archive", "zip", "compress", "stage")):
        return "Collection / Staging Activity", "INFERRED", "Archive or staging indicator was observed"
    if any(word in text for word in ("process", "execution", "powershell", "cmd", "bash", "script", "exec")):
        return "Execution Activity", "OBSERVED", "Process or command execution indicator was observed"
    if any(word in text for word in ("file", "read", "write", "access", "document", "asset")):
        return "File / Data Activity", "OBSERVED", "File or asset activity was observed"
    if any(word in text for word in ("egress", "outbound", "transfer", "connection", "dns", "http", "network")):
        if any(word in text for word in ("bytes", "transfer", "exfil")):
            return "Possible Exfiltration", "INFERRED", "Outbound transfer evidence was observed"
        return "Network Activity", "OBSERVED", "Network activity was observed"
    if any(word in text for word in ("auth", "login", "logon", "session", "credential")):
        return "Authentication / Access Activity", "OBSERVED", "Authentication or access activity was observed"
    return "Unclassified Security Activity", "OBSERVED", "The event was retained but did not match a stronger stage classifier"


def reconstruct_attack_timeline(events: List[NormalizedEvent]) -> List[AttackStage]:
    timestamped = [(parse_event_timestamp(event.timestamp), index, event) for index, event in enumerate(events)]
    sorted_events = sorted(timestamped, key=lambda item: (item[0] is None, item[0] or item[1]))
    stages: List[AttackStage] = []
    for index, (parsed_time, _, event) in enumerate(sorted_events):
        stage_name, status, reason = classify_stage(event)
        confidence = 82 if parsed_time else 55
        stages.append(AttackStage(
            stageNumber=index + 1,
            stageName=stage_name,
            timestamp=event.timestamp,
            source=event.source,
            eventTitle=event.description or event.eventType,
            entity=event.entity_user or event.entity_process or event.entity_host or "Observed Entity",
            ipOrDevice=event.entity_host or event.entity_ip or "Observed Indicator",
            severity=event.severity,
            riskLevel=event.severity.upper() if event.severity in {"critical", "high"} else "MODERATE",
            connectionExplanation=reason,
            confidenceScore=confidence,
            confidenceReasons=[
                reason,
                "Timestamp parsed and used for ordering" if parsed_time else "Timestamp could not be reliably parsed; original order preserved",
            ],
            statusType=status,
        ))
    return stages
