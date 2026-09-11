from typing import List
from app.models.schemas import NormalizedEvent, ExtractedEntity

def extract_entities_from_events(events: List[NormalizedEvent]) -> List[ExtractedEntity]:
    entity_map = {}

    for evt in events:
        # Users
        if evt.entity_user:
            key = f"identity:{evt.entity_user}"
            if key not in entity_map:
                entity_map[key] = ExtractedEntity(
                    id=f"ent-user-{len(entity_map)}",
                    name=evt.entity_user,
                    category="identity",
                    sources=[evt.source],
                    firstSeen=evt.timestamp,
                    lastSeen=evt.timestamp,
                    description=f"User account observed on {evt.source}"
                )
            else:
                if evt.source not in entity_map[key].sources:
                    entity_map[key].sources.append(evt.source)
                entity_map[key].lastSeen = evt.timestamp

        # Hosts
        if evt.entity_host:
            key = f"endpoint:{evt.entity_host}"
            if key not in entity_map:
                entity_map[key] = ExtractedEntity(
                    id=f"ent-host-{len(entity_map)}",
                    name=evt.entity_host,
                    category="endpoint",
                    sources=[evt.source],
                    firstSeen=evt.timestamp,
                    lastSeen=evt.timestamp,
                    description=f"Host workstation observed on {evt.source}"
                )
            else:
                if evt.source not in entity_map[key].sources:
                    entity_map[key].sources.append(evt.source)
                entity_map[key].lastSeen = evt.timestamp

        # IPs
        if evt.entity_ip:
            key = f"ip:{evt.entity_ip}"
            if key not in entity_map:
                entity_map[key] = ExtractedEntity(
                    id=f"ent-ip-{len(entity_map)}",
                    name=evt.entity_ip,
                    category="ip",
                    sources=[evt.source],
                    firstSeen=evt.timestamp,
                    lastSeen=evt.timestamp,
                    description=f"IP address indicator observed on {evt.source}"
                )
            else:
                if evt.source not in entity_map[key].sources:
                    entity_map[key].sources.append(evt.source)
                entity_map[key].lastSeen = evt.timestamp

        # Assets/Files
        if evt.entity_asset:
            key = f"file:{evt.entity_asset}"
            if key not in entity_map:
                entity_map[key] = ExtractedEntity(
                    id=f"ent-file-{len(entity_map)}",
                    name=evt.entity_asset,
                    category="file",
                    sources=[evt.source],
                    firstSeen=evt.timestamp,
                    lastSeen=evt.timestamp,
                    description=f"File asset target observed on {evt.source}"
                )
            else:
                if evt.source not in entity_map[key].sources:
                    entity_map[key].sources.append(evt.source)
                entity_map[key].lastSeen = evt.timestamp

    return list(entity_map.values())
