from typing import Dict, Any

AUTH_KEYWORDS = ["user", "username", "login", "auth", "password", "pam", "sso", "session", "logon", "credential"]
ENDPOINT_KEYWORDS = ["process", "cmd", "powershell", "exec", "parent", "sysmon", "file", "asset", "host", "device", "workstation"]
NETWORK_KEYWORDS = ["src_ip", "dst_ip", "port", "bytes", "http", "egress", "dns", "destination", "pcap", "ip"]
APP_KEYWORDS = ["request", "uri", "status_code", "api", "http_method", "sql", "route"]
THREAT_KEYWORDS = ["indicator", "ioc", "reputation", "threat", "malicious_ip", "c2", "feed"]

def classify_event_source(event_dict: Dict[str, Any], filename: str = "") -> str:
    filename_lower = filename.lower()

    if "auth" in filename_lower or "identity" in filename_lower:
        return "authentication"
    if "net" in filename_lower or "pcap" in filename_lower or "traffic" in filename_lower:
        return "network"
    if "threat" in filename_lower or "intel" in filename_lower or "ioc" in filename_lower:
        return "threat_intel"
    if "endpoint" in filename_lower or "system" in filename_lower or "process" in filename_lower:
        return "endpoint"
    if "app" in filename_lower or "web" in filename_lower or "api" in filename_lower:
        return "application"

    keys_str = " ".join([str(k).lower() for k in event_dict.keys()])
    vals_str = " ".join([str(v).lower() for v in event_dict.values() if isinstance(v, (str, int))])
    content_blob = f"{keys_str} {vals_str}"

    auth_hits = sum(1 for kw in AUTH_KEYWORDS if kw in content_blob)
    endpoint_hits = sum(1 for kw in ENDPOINT_KEYWORDS if kw in content_blob)
    network_hits = sum(1 for kw in NETWORK_KEYWORDS if kw in content_blob)
    app_hits = sum(1 for kw in APP_KEYWORDS if kw in content_blob)
    threat_hits = sum(1 for kw in THREAT_KEYWORDS if kw in content_blob)

    hits_map = {
        "authentication": auth_hits,
        "endpoint": endpoint_hits,
        "network": network_hits,
        "application": app_hits,
        "threat_intel": threat_hits
    }

    best_source = max(hits_map, key=hits_map.get)
    if hits_map[best_source] > 0:
        return best_source

    return "unknown"
