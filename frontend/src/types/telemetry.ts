export type TelemetrySourceType = 'endpoint' | 'network' | 'authentication' | 'application' | 'file';

export type EventSeverity = 'info' | 'low' | 'medium' | 'high' | 'critical';

export interface TelemetrySourceInfo {
  id: TelemetrySourceType;
  name: string;
  iconName: string;
  status: 'active' | 'ready' | 'idle';
  eventCount: number;
  latestActivity: string;
  examples: string[];
}

export interface RawEventPayload {
  [key: string]: unknown;
}

export interface NormalizedEventPayload {
  id: string;
  timestamp: string;
  entity_user?: string;
  entity_ip?: string;
  entity_device?: string;
  entity_asset?: string;
  event_type: string;
  source: TelemetrySourceType;
  severity: EventSeverity;
  description: string;
  metadata?: Record<string, unknown>;
}

export interface TelemetryEvent {
  id: string;
  timestamp: string;
  rawTimestamp: string;
  source: TelemetrySourceType;
  eventType: string;
  title: string;
  description: string;
  severity: EventSeverity;
  user?: string;
  ip?: string;
  device?: string;
  asset?: string;
  destination?: string;
  isAttackSequence?: boolean;
  rawData: RawEventPayload;
  normalizedData: NormalizedEventPayload;
}

export interface IntelligenceMetrics {
  totalEvents: number;
  activeUsersCount: number;
  activeDevicesCount: number;
  uniqueIpsCount: number;
  sensitiveAssetsCount: number;
  usersList: string[];
  devicesList: string[];
  ipsList: string[];
  assetsList: string[];
}
