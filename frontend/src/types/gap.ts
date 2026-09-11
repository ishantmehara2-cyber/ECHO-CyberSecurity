export type GapPriority = 'HIGH' | 'MEDIUM' | 'LOW';

export interface EvidenceGap {
  id: string;
  expectedStage: string;
  observedBefore: string;
  observedAfter: string;
  timeWindow: string;
  whyFlagged: string;
  gapConfidence: number;
  priority: GapPriority;
  recommendedSource: string;
  whyRecommended: string;
  status: string;
  relatedEntities: string[];
}

export interface SourceCoverage {
  sourceName: string;
  category: 'authentication' | 'network' | 'endpoint' | 'application';
  percentage: number;
  status: 'COMPLETE' | 'PARTIAL' | 'LOW';
  description: string;
}

export interface PathCompletionStage {
  id: string;
  stageName: string;
  isObserved: boolean;
  isGap: boolean;
  gapInfo?: EvidenceGap;
  observedDetail?: string;
}

export interface EvidenceCoverageData {
  overallCoverageScore: number;
  sources: SourceCoverage[];
  totalObservedStages: number;
  totalExpectedStages: number;
  detectedGapsCount: number;
}
