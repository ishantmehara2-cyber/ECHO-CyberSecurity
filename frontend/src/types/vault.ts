export type EvidenceClassification =
  | 'authentication'
  | 'network'
  | 'threat_intel'
  | 'endpoint'
  | 'unclassified';

export type SiloSlotKey = 'identity' | 'network' | 'threat_intel' | 'endpoint';

export interface SiloSlotConfig {
  key: SiloSlotKey;
  title: string;
  description: string;
  iconName: string;
  uploadLabel: string;
  expectedFileName: string;
  emptyStatusText: string;
  classification: EvidenceClassification;
  sourceName: string;
}

export interface UploadedEvidenceFile {
  id: string;
  name: string;
  size: string;
  status: 'ready' | 'processing' | 'completed';
  classification: EvidenceClassification;
  sourceName: string;
  siloSlotKey?: SiloSlotKey;
  fileObject?: File;
  isOfficialDemoFile?: boolean;
  warningMismatch?: string;
  suggestedSlotKey?: SiloSlotKey;
}

export type InvestigationStage =
  | 'idle'
  | 'ingestion'
  | 'extraction'
  | 'discovery'
  | 'correlation'
  | 'timeline'
  | 'reconstruction'
  | 'complete';

export interface ExtractedEntity {
  id: string;
  name: string;
  category: 'identity' | 'ip' | 'endpoint' | 'domain' | 'session' | 'file';
  sources: string[];
  firstSeen?: string;
  lastSeen?: string;
  relatedEntities?: string[];
  confidence?: 'HIGH' | 'MEDIUM' | 'LOW';
  description?: string;
}

export interface GraphNode {
  id: string;
  label: string;
  type: 'ip' | 'identity' | 'endpoint' | 'session' | 'file' | 'domain';
  x: number;
  y: number;
  highlighted?: boolean;
  firstSeen?: string;
  lastSeen?: string;
  sources: string[];
  relatedEntities: string[];
  confidence: 'HIGH' | 'MEDIUM' | 'LOW';
  details?: string;
}

export interface GraphEdge {
  id: string;
  from: string;
  to: string;
  label?: string;
  highlighted?: boolean;
}

export interface TimelineEvent {
  id: string;
  time: string;
  title: string;
  entity: string;
  ipOrHost: string;
  description: string;
  source: string;
  severity: 'critical' | 'high' | 'medium' | 'info';
}

export interface AttackDnaItem {
  category: string;
  value: string;
  subtext?: string;
}
