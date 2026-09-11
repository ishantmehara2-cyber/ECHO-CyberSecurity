from datetime import datetime, timedelta
from typing import List, Optional, Tuple

from app.models.schemas import NormalizedEvent, CorrelationLink, MatchingFactor


def parse_event_timestamp(value: str) -> Optional[datetime]:
    """Parse supported timestamps without pretending time-only values have a date."""
    text = (value or "").strip()
    if not text:
        return None
    try:
        if "T" in text:
            return datetime.fromisoformat(text.replace("Z", "+00:00")).replace(tzinfo=None)
        for fmt in ("%Y-%m-%d %H:%M:%S", "%Y-%m-%d %H:%M", "%H:%M:%S", "%H:%M"):
            try:
                return datetime.strptime(text, fmt)
            except ValueError:
                continue
    except ValueError:
        return None
    return None


def temporal_delta(first: str, second: str) -> Optional[float]:
    left = parse_event_timestamp(first)
    right = parse_event_timestamp(second)
    if left is None or right is None:
        return None
    # Time-only values can be compared within the same telemetry batch, including midnight rollover.
    delta = abs((right - left).total_seconds())
    if left.date() == datetime.min.date() and right.date() == datetime.min.date():
        delta = min(delta, 86400 - delta)
    return delta


def _factor(name: str, value: str, description: str) -> MatchingFactor:
    return MatchingFactor(fieldName=name, value=value, description=description)


def correlate_normalized_events(events: List[NormalizedEvent]) -> List[CorrelationLink]:
    links: List[CorrelationLink] = []
    for i, first in enumerate(events):
        for second in events[i + 1:]:
            factors: List[MatchingFactor] = []
            score = 0

            shared_fields = [
                ("Same User Account", first.entity_user, 25),
                ("Same Host / Workstation", first.entity_host, 25),
                ("Same Session Token", first.entity_session, 20),
                ("Same IP Indicator", first.entity_ip, 10),
                ("Same File / Asset", first.entity_asset, 15),
                ("Same Process", first.entity_process, 10),
                ("Same Domain", first.entity_domain, 10),
            ]
            for label, value, points in shared_fields:
                second_value = getattr(second, {
                    "Same User Account": "entity_user",
                    "Same Host / Workstation": "entity_host",
                    "Same Session Token": "entity_session",
                    "Same IP Indicator": "entity_ip",
                    "Same File / Asset": "entity_asset",
                    "Same Process": "entity_process",
                    "Same Domain": "entity_domain",
                }[label])
                if value and second_value and value == second_value:
                    factors.append(_factor(label, value, f"{value} is present in both events"))
                    score += points

            delta = temporal_delta(first.timestamp, second.timestamp)
            if delta is not None and delta <= 900:
                temporal_points = 15 if delta <= 120 else 10 if delta <= 300 else 5
                factors.append(_factor(
                    "Temporal Proximity",
                    f"{int(delta)} seconds",
                    f"Events are {int(delta)} seconds apart",
                ))
                score += temporal_points
            elif delta is None:
                factors.append(_factor(
                    "Temporal Availability",
                    "Unavailable",
                    "Temporal correlation unavailable because timestamp format could not be reliably parsed",
                ))

            if first.source != second.source and factors:
                factors.append(_factor(
                    "Cross-Source Relationship",
                    f"{first.source} -> {second.source}",
                    "Matching evidence spans independent telemetry sources",
                ))
                score += 5

            if score < 35:
                continue
            confidence = min(score, 98)
            level = "HIGH" if confidence >= 80 else "MEDIUM" if confidence >= 60 else "LOW"
            explanation = "Connected because " + ", ".join(
                f"{item.fieldName.lower()} ({item.value})" for item in factors[:4]
            ) + "."
            links.append(CorrelationLink(
                id=f"link-{len(links) + 1}",
                sourceNodeId=first.id,
                targetNodeId=second.id,
                sourceLabel=first.entity_user or first.entity_ip or first.entity_host or first.id,
                targetLabel=second.entity_host or second.entity_asset or second.entity_domain or second.id,
                matchingFactors=factors,
                confidenceScore=confidence,
                confidenceLevel=level,
                humanExplanation=explanation,
            ))
    return links
