from typing import List, Dict, Any, Optional
from app.models.schemas import NormalizedEvent

USER_FIELD_ALIASES = ["user", "username", "login_user", "user_principal", "account", "proc_owner", "accessor_user", "src_user", "caller"]
HOST_FIELD_ALIASES = ["host", "hostname", "device", "target_host", "workstation", "src_host", "src_device"]
IP_FIELD_ALIASES = ["ip", "src_ip", "client_ip", "dst_ip", "destination_ip", "external_ip", "dst_external_ip"]
ASSET_FIELD_ALIASES = ["asset", "file_path", "filename", "target_file", "resource"]
PROCESS_FIELD_ALIASES = ["process", "process_name", "proc_path", "command_line", "cli_args"]
SESSION_FIELD_ALIASES = ["session_id", "session_token", "auth_session", "sso_session"]
DOMAIN_FIELD_ALIASES = ["domain", "destination_domain", "dest_domain", "fqdn"]
HASH_FIELD_ALIASES = ["hash", "sha256", "sha1", "md5", "file_hash"]
URL_FIELD_ALIASES = ["url", "uri", "destination_url"]
PORT_FIELD_ALIASES = ["port", "dst_port", "destination_port"]

def extract_alias(raw_dict: Dict[str, Any], aliases: List[str]) -> Optional[str]:
    for alias in aliases:
        if alias in raw_dict and raw_dict[alias]:
            return str(raw_dict[alias])
    return None

def normalize_raw_event(event_id: str, raw_event: Dict[str, Any], source_type: str = "authentication") -> NormalizedEvent:
    user = extract_alias(raw_event, USER_FIELD_ALIASES)
    host = extract_alias(raw_event, HOST_FIELD_ALIASES)
    ip = extract_alias(raw_event, IP_FIELD_ALIASES)
    asset = extract_alias(raw_event, ASSET_FIELD_ALIASES)
    process = extract_alias(raw_event, PROCESS_FIELD_ALIASES)
    session = extract_alias(raw_event, SESSION_FIELD_ALIASES)
    domain = extract_alias(raw_event, DOMAIN_FIELD_ALIASES)
    file_hash = extract_alias(raw_event, HASH_FIELD_ALIASES)
    url = extract_alias(raw_event, URL_FIELD_ALIASES)
    port = extract_alias(raw_event, PORT_FIELD_ALIASES)

    timestamp = str(raw_event.get("timestamp") or raw_event.get("rawTimestamp") or raw_event.get("time") or "10:30:00")
    event_type = str(raw_event.get("event") or raw_event.get("eventType") or raw_event.get("event_type") or "security_activity")
    severity = str(raw_event.get("severity") or "info").lower()
    description = str(raw_event.get("description") or f"Activity recorded on {source_type}")

    return NormalizedEvent(
        id=event_id,
        timestamp=timestamp,
        source=source_type,
        eventType=event_type,
        entity_user=user,
        entity_host=host,
        entity_ip=ip,
        entity_asset=asset,
        entity_process=process,
        entity_session=session,
        entity_domain=domain,
        entity_hash=file_hash,
        entity_url=url,
        entity_port=port,
        severity=severity,
        description=description,
        raw_source=raw_event
    )
