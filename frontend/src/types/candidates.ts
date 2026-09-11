export type RiskLevel = 'CRITICAL' | 'HIGH' | 'MEDIUM-HIGH' | 'MEDIUM' | 'LOW';

export interface CandidateScoreSignal {
  signal: string;
  points: number;
}

export interface InvestigationCandidate {
  rank: number;
  id: string;
  entityName: string;
  entityType: 'identity' | 'endpoint' | 'ip' | 'session' | 'service';
  riskLevel: RiskLevel;
  riskScore: number; // 0 - 100
  correlationConfidence: number; // 0 - 100%
  sourcesInvolved: string[];
  eventCount: number;
  indicators: string[];
  primaryReason: string;
  status: 'PRIORITY INVESTIGATION' | 'REVIEW RECOMMENDED' | 'NOMINAL OBSERVATION';
  whyFlagged: string[];
  riskBreakdown: CandidateScoreSignal[];
  confidenceBreakdown: CandidateScoreSignal[];
  keyActors: {
    primaryUser: string;
    primaryHost: string;
    entryIp: string;
    targetAsset?: string;
    exfiltrationDomain?: string;
    exfiltrationIp?: string;
  };
}

export interface CandidateDiscoverySummary {
  totalEventsAnalyzed: number;
  uniqueEntitiesObserved: number;
  totalCandidatesCount: number;
  highRiskCandidatesCount: number;
  crossSourceCorrelationsCount: number;
  candidates: InvestigationCandidate[];
  crossCandidatePatterns: string[];
}
