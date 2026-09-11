export type ConfidenceLevel = 'HIGH' | 'MEDIUM' | 'LOW';

export interface MatchingFactor {
  fieldName: string;
  value: string;
  description: string;
}

export interface CorrelationLink {
  id: string;
  sourceNodeId: string;
  targetNodeId: string;
  sourceLabel: string;
  targetLabel: string;
  matchingFactors: MatchingFactor[];
  confidenceScore: number;
  confidenceLevel: ConfidenceLevel;
  humanExplanation: string;
}

export interface AttackStageItem {
  stageNumber: number;
  stageName: string;
  timestamp: string;
  source: string;
  eventTitle: string;
  entity: string;
  ipOrDevice: string;
  severity: 'critical' | 'high' | 'medium' | 'info';
  riskLevel: 'CRITICAL' | 'HIGH' | 'MODERATE' | 'LOW';
  connectionExplanation: string;
  confidenceScore: number;
  confidenceReasons: string[];
}

export interface InvestigationSummaryStory {
  totalCorrelatedEvents: number;
  evidenceConnectionsCount: number;
  highConfidenceCount: number;
  attackStagesCount: number;
  overallConfidenceScore: number;
  narrativeText: string;
  keyActors: {
    primaryUser: string;
    primaryHost: string;
    entryIp: string;
    targetAsset: string;
    exfiltrationDomain: string;
    exfiltrationIp: string;
  };
}

export interface AnalysisPipelineStep {
  id: string;
  label: string;
  status: 'pending' | 'running' | 'completed';
}
