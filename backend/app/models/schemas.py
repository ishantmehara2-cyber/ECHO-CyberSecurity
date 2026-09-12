from pydantic import BaseModel
from typing import List, Dict, Any, Optional

class RawEventInput(BaseModel):
    id: Optional[str] = None
    timestamp: Optional[str] = None
    source: Optional[str] = None
    rawData: Dict[str, Any]

class NormalizedEvent(BaseModel):
    id: str
    timestamp: str
    source: str
    eventType: str
    entity_user: Optional[str] = None
    entity_host: Optional[str] = None
    entity_ip: Optional[str] = None
    entity_asset: Optional[str] = None
    entity_process: Optional[str] = None
    entity_session: Optional[str] = None
    entity_domain: Optional[str] = None
    entity_hash: Optional[str] = None
    entity_url: Optional[str] = None
    entity_port: Optional[str] = None
    severity: str
    description: str
    raw_source: Dict[str, Any]

class ExtractedEntity(BaseModel):
    id: str
    name: str
    category: str  # 'identity', 'ip', 'endpoint', 'domain', 'session', 'file'
    sources: List[str]
    firstSeen: Optional[str] = None
    lastSeen: Optional[str] = None
    relatedEntities: List[str] = []
    confidence: str = 'HIGH'
    description: Optional[str] = None

class MatchingFactor(BaseModel):
    fieldName: str
    value: str
    description: str

class CorrelationLink(BaseModel):
    id: str
    sourceNodeId: str
    targetNodeId: str
    sourceLabel: str
    targetLabel: str
    matchingFactors: List[MatchingFactor]
    confidenceScore: int
    confidenceLevel: str
    humanExplanation: str

class AttackStage(BaseModel):
    stageNumber: int
    stageName: str
    timestamp: str
    source: str
    eventTitle: str
    entity: str
    ipOrDevice: str
    severity: str
    riskLevel: str
    connectionExplanation: str
    confidenceScore: int
    confidenceReasons: List[str]
    statusType: str = 'OBSERVED'  # 'OBSERVED' or 'INFERRED'
    relatedEventIds: List[str] = []
    eventCount: int = 1
    sourceCount: int = 1

class EvidenceGap(BaseModel):
    id: str
    expectedStage: str
    observedBefore: str
    observedAfter: str
    timeWindow: str
    whyFlagged: str
    gapConfidence: int
    priority: str
    recommendedSource: str
    whyRecommended: str
    status: str
    relatedEntities: List[str]

class InvestigationSummary(BaseModel):
    totalCorrelatedEvents: int
    evidenceConnectionsCount: int
    highConfidenceCount: int
    attackStagesCount: int
    overallConfidenceScore: int
    narrativeText: str
    keyActors: Dict[str, str]

class InvestigationRequest(BaseModel):
    siloFilesCount: Optional[int] = 4
    customEvents: Optional[List[Dict[str, Any]]] = None

class InvestigationResponse(BaseModel):
    investigationId: str
    timestamp: str
    silosLoadedCount: int
    totalRawEvents: int
    coverageScore: int
    normalizedEvents: List[NormalizedEvent]
    extractedEntities: List[ExtractedEntity]
    correlationLinks: List[CorrelationLink]
    attackStages: List[AttackStage]
    evidenceGaps: List[EvidenceGap]
    summary: InvestigationSummary
    diagnostics: Optional[Dict[str, Any]] = None
