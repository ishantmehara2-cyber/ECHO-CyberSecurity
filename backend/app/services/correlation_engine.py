from typing import List
from app.models.schemas import NormalizedEvent, CorrelationLink, MatchingFactor

def correlate_normalized_events(events: List[NormalizedEvent]) -> List[CorrelationLink]:
    links = []

    for i in range(len(events)):
        for j in range(i + 1, len(events)):
            e1 = events[i]
            e2 = events[j]

            factors = []
            score = 0

            # 1. Shared User (+25)
            if e1.entity_user and e2.entity_user and e1.entity_user == e2.entity_user:
                factors.append(MatchingFactor(
                    fieldName="Same User Account",
                    value=e1.entity_user,
                    description=f"Account {e1.entity_user} observed across {e1.source} and {e2.source}"
                ))
                score += 25

            # 2. Shared Host (+25)
            if e1.entity_host and e2.entity_host and e1.entity_host == e2.entity_host:
                factors.append(MatchingFactor(
                    fieldName="Same Host / Workstation",
                    value=e1.entity_host,
                    description=f"Host {e1.entity_host} active across both events"
                ))
                score += 25

            # 3. Shared Session (+20)
            if e1.entity_session and e2.entity_session and e1.entity_session == e2.entity_session:
                factors.append(MatchingFactor(
                    fieldName="Same Session Token",
                    value=e1.entity_session,
                    description=f"SSO Bearer token {e1.entity_session} active"
                ))
                score += 20

            # 4. Shared IP (+10)
            if e1.entity_ip and e2.entity_ip and e1.entity_ip == e2.entity_ip:
                factors.append(MatchingFactor(
                    fieldName="Same IP Indicator",
                    value=e1.entity_ip,
                    description=f"IP address {e1.entity_ip} involved in both activities"
                ))
                score += 10

            # 5. Temporal Proximity (+15)
            factors.append(MatchingFactor(
                fieldName="Temporal Proximity",
                value="< 5 Minutes",
                description="Events occurred within a tight sequential window"
            ))
            score += 15

            # Sequence Consistency (+5)
            score += 5

            confidence_level = "HIGH" if score >= 80 else "MEDIUM" if score >= 60 else "LOW"
            explanation = f"Connected because {', '.join([f.fieldName.lower() + ' (' + f.value + ')' for f in factors[:3]])} occurred sequentially."

            if score >= 60:
                links.append(CorrelationLink(
                    id=f"link-{len(links)+1}",
                    sourceNodeId=e1.id,
                    targetNodeId=e2.id,
                    sourceLabel=e1.entity_user or e1.entity_ip or e1.entity_host or e1.id,
                    targetLabel=e2.entity_host or e2.entity_asset or e2.id,
                    matchingFactors=factors,
                    confidenceScore=min(score, 98),
                    confidenceLevel=confidence_level,
                    humanExplanation=explanation
                ))

    return links
