export interface ActivityLog {
  id: string;
  timestamp: string;
  source: 'SYSTEM' | 'API' | 'DEMO' | 'TELEMETRY';
  message: string;
  type?: 'info' | 'success' | 'warning' | 'error';
}

export interface PipelineStage {
  id: string;
  number: string;
  title: string;
  simpleExplanation: string;
  technicalDescription: string;
  iconName: string;
}

export interface EvidenceCardData {
  id: 'cardA' | 'cardB' | 'cardC';
  title: string;
  sourceType: 'AUTHENTICATION' | 'ENDPOINT' | 'NETWORK';
  user?: string;
  event: string;
  time: string;
  host: string;
  destination?: string;
}

export interface DigitalDnaEntity {
  id: string;
  name: string;
  type: 'IDENTITY' | 'DEVICE' | 'NETWORK_NODE' | 'PROCESS';
  attributes: {
    identity?: string;
    deviceBehavior?: string;
    networkBehavior?: string;
    activityTiming?: string;
    communicationPatterns?: string;
  };
}
