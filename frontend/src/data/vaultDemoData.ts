import {
  UploadedEvidenceFile,
  ExtractedEntity,
  GraphNode,
  GraphEdge,
  TimelineEvent,
  AttackDnaItem,
  SiloSlotConfig
} from '../types/vault';

export const SILO_SLOT_CONFIGS: SiloSlotConfig[] = [
  {
    key: 'identity',
    title: 'IDENTITY & AUTHENTICATION',
    description: 'Login events, authentication attempts, user identities and session activity.',
    iconName: 'Lock',
    uploadLabel: 'UPLOAD AUTHENTICATION EVIDENCE',
    expectedFileName: '01_RAW_AUTHENTICATION_TELEMETRY.pdf',
    emptyStatusText: 'WAITING FOR IDENTITY DATA',
    classification: 'authentication',
    sourceName: 'Identity Gateway'
  },
  {
    key: 'network',
    title: 'NETWORK TELEMETRY',
    description: 'Network flows, external connections, domains and data transfer activity.',
    iconName: 'Globe',
    uploadLabel: 'UPLOAD NETWORK EVIDENCE',
    expectedFileName: '02_RAW_NETWORK_TELEMETRY.pdf',
    emptyStatusText: 'WAITING FOR NETWORK DATA',
    classification: 'network',
    sourceName: 'Network Sensor'
  },
  {
    key: 'threat_intel',
    title: 'THREAT INTELLIGENCE',
    description: 'Indicator context, reputation signals and known relationship information.',
    iconName: 'ShieldAlert',
    uploadLabel: 'UPLOAD INTELLIGENCE EVIDENCE',
    expectedFileName: '03_RAW_THREAT_INTELLIGENCE_FEED.pdf',
    emptyStatusText: 'WAITING FOR INTELLIGENCE DATA',
    classification: 'threat_intel',
    sourceName: 'Intelligence Source'
  },
  {
    key: 'endpoint',
    title: 'ENDPOINT & SYSTEM',
    description: 'Processes, files, endpoint activity and system-level telemetry.',
    iconName: 'Monitor',
    uploadLabel: 'UPLOAD ENDPOINT EVIDENCE',
    expectedFileName: '04_RAW_ENDPOINT_SYSTEM_TELEMETRY.pdf',
    emptyStatusText: 'WAITING FOR ENDPOINT DATA',
    classification: 'endpoint',
    sourceName: 'Endpoint Sensor'
  }
];

export const OFFICIAL_DEMO_FILES: UploadedEvidenceFile[] = [
  {
    id: 'demo-01',
    name: '01_RAW_AUTHENTICATION_TELEMETRY.pdf',
    size: '1.8 MB',
    status: 'ready',
    classification: 'authentication',
    sourceName: 'Identity Gateway',
    siloSlotKey: 'identity',
    isOfficialDemoFile: true
  },
  {
    id: 'demo-02',
    name: '02_RAW_NETWORK_TELEMETRY.pdf',
    size: '2.4 MB',
    status: 'ready',
    classification: 'network',
    sourceName: 'Network Sensor',
    siloSlotKey: 'network',
    isOfficialDemoFile: true
  },
  {
    id: 'demo-03',
    name: '03_RAW_THREAT_INTELLIGENCE_FEED.pdf',
    size: '1.2 MB',
    status: 'ready',
    classification: 'threat_intel',
    sourceName: 'Intelligence Source',
    siloSlotKey: 'threat_intel',
    isOfficialDemoFile: true
  },
  {
    id: 'demo-04',
    name: '04_RAW_ENDPOINT_SYSTEM_TELEMETRY.pdf',
    size: '3.1 MB',
    status: 'ready',
    classification: 'endpoint',
    sourceName: 'Endpoint Sensor',
    siloSlotKey: 'endpoint',
    isOfficialDemoFile: true
  }
];

export const DEMO_EXTRACTED_ENTITIES: ExtractedEntity[] = [
  {
    id: 'ent-1',
    name: 'employee_07',
    category: 'identity',
    sources: ['Identity Gateway', 'Endpoint Sensor', 'Network Sensor'],
    firstSeen: '10:28:43',
    lastSeen: '10:36:19',
    relatedEntities: ['185.220.101.45', 'WORKSTATION-07', 'finance_records.xlsx'],
    confidence: 'HIGH',
    description: 'Primary compromised user account exhibiting anomalous authentication and egress behavior.'
  },
  {
    id: 'ent-2',
    name: 'employee_02',
    category: 'identity',
    sources: ['Identity Gateway'],
    firstSeen: '08:15:10',
    lastSeen: '12:00:00',
    relatedEntities: ['WORKSTATION-02'],
    confidence: 'LOW',
    description: 'Unrelated clean background user activity.'
  },
  {
    id: 'ent-3',
    name: 'finance_view',
    category: 'identity',
    sources: ['Identity Gateway'],
    firstSeen: '09:00:00',
    lastSeen: '10:00:00',
    relatedEntities: ['FINANCE-SRV'],
    confidence: 'LOW',
    description: 'Service account with routine query activity.'
  },
  {
    id: 'ent-4',
    name: '185.220.101.45',
    category: 'ip',
    sources: ['Identity Gateway', 'Intelligence Source'],
    firstSeen: '10:28:43',
    lastSeen: '10:30:16',
    relatedEntities: ['employee_07', 'WORKSTATION-07'],
    confidence: 'HIGH',
    description: 'External IP address flagged in Threat Intelligence Feed for Tor exit node activity.'
  },
  {
    id: 'ent-5',
    name: '198.51.100.77',
    category: 'ip',
    sources: ['Network Sensor', 'Intelligence Source'],
    firstSeen: '10:36:19',
    lastSeen: '10:36:19',
    relatedEntities: ['sync-archive.example.test', 'WORKSTATION-07'],
    confidence: 'HIGH',
    description: 'External egress destination associated with unauthorized data transfer.'
  },
  {
    id: 'ent-6',
    name: 'WORKSTATION-07',
    category: 'endpoint',
    sources: ['Endpoint Sensor', 'Identity Gateway', 'Network Sensor'],
    firstSeen: '10:30:16',
    lastSeen: '10:36:19',
    relatedEntities: ['employee_07', 'powershell.exe', 'finance_records.xlsx'],
    confidence: 'HIGH',
    description: 'Host workstation assigned to employee_07 where process execution and staging occurred.'
  },
  {
    id: 'ent-7',
    name: 'NB-FIN-04',
    category: 'endpoint',
    sources: ['Endpoint Sensor'],
    firstSeen: '08:30:00',
    lastSeen: '11:00:00',
    relatedEntities: [],
    confidence: 'LOW',
    description: 'Normal workstation with no security anomalies.'
  },
  {
    id: 'ent-8',
    name: 'sync-archive.example.test',
    category: 'domain',
    sources: ['Network Sensor', 'Intelligence Source'],
    firstSeen: '10:36:19',
    lastSeen: '10:36:19',
    relatedEntities: ['198.51.100.77', 'review_package.zip'],
    confidence: 'HIGH',
    description: 'External file staging endpoint matching known cloud exfiltration targets.'
  },
  {
    id: 'ent-9',
    name: 'SES-7F21A',
    category: 'session',
    sources: ['Identity Gateway'],
    firstSeen: '10:30:16',
    lastSeen: '10:36:19',
    relatedEntities: ['employee_07', 'WORKSTATION-07'],
    confidence: 'HIGH',
    description: 'Authenticated SSO token established following initial brute-force attempts.'
  },
  {
    id: 'ent-10',
    name: 'finance_records.xlsx',
    category: 'file',
    sources: ['Endpoint Sensor'],
    firstSeen: '10:32:28',
    lastSeen: '10:34:09',
    relatedEntities: ['WORKSTATION-07', 'review_package.zip'],
    confidence: 'HIGH',
    description: 'Restricted financial spreadsheet accessed out-of-bounds.'
  },
  {
    id: 'ent-11',
    name: 'review_package.zip',
    category: 'file',
    sources: ['Endpoint Sensor'],
    firstSeen: '10:34:09',
    lastSeen: '10:36:19',
    relatedEntities: ['finance_records.xlsx', 'sync-archive.example.test'],
    confidence: 'HIGH',
    description: 'Compressed archive containing staging copy of sensitive files.'
  }
];

export const DEMO_GRAPH_NODES: GraphNode[] = [
  {
    id: 'node-1',
    label: '185.220.101.45',
    type: 'ip',
    x: 12,
    y: 30,
    highlighted: true,
    firstSeen: '10:28:43',
    lastSeen: '10:30:16',
    sources: ['Identity Gateway', 'Intelligence Source'],
    relatedEntities: ['employee_07', 'WORKSTATION-07'],
    confidence: 'HIGH',
    details: 'Tor Exit Node / Brute force source IP.'
  },
  {
    id: 'node-2',
    label: 'employee_07',
    type: 'identity',
    x: 28,
    y: 50,
    highlighted: true,
    firstSeen: '10:28:43',
    lastSeen: '10:36:19',
    sources: ['Identity Gateway', 'Endpoint Sensor'],
    relatedEntities: ['185.220.101.45', 'WORKSTATION-07', 'SES-7F21A'],
    confidence: 'HIGH',
    details: 'Compromised corporate user credentials.'
  },
  {
    id: 'node-3',
    label: 'WORKSTATION-07',
    type: 'endpoint',
    x: 44,
    y: 35,
    highlighted: true,
    firstSeen: '10:30:16',
    lastSeen: '10:36:19',
    sources: ['Endpoint Sensor', 'Identity Gateway', 'Network Sensor'],
    relatedEntities: ['employee_07', 'SES-7F21A', 'finance_records.xlsx'],
    confidence: 'HIGH',
    details: 'Host system used for execution and exfiltration.'
  },
  {
    id: 'node-4',
    label: 'SES-7F21A',
    type: 'session',
    x: 44,
    y: 70,
    highlighted: true,
    firstSeen: '10:30:16',
    lastSeen: '10:36:19',
    sources: ['Identity Gateway'],
    relatedEntities: ['employee_07', 'WORKSTATION-07'],
    confidence: 'HIGH',
    details: 'Authenticated SSO token established.'
  },
  {
    id: 'node-5',
    label: 'finance_records.xlsx',
    type: 'file',
    x: 60,
    y: 45,
    highlighted: true,
    firstSeen: '10:32:28',
    lastSeen: '10:34:09',
    sources: ['Endpoint Sensor'],
    relatedEntities: ['WORKSTATION-07', 'review_package.zip'],
    confidence: 'HIGH',
    details: 'Restricted file accessed without ticket authorization.'
  },
  {
    id: 'node-6',
    label: 'review_package.zip',
    type: 'file',
    x: 74,
    y: 55,
    highlighted: true,
    firstSeen: '10:34:09',
    lastSeen: '10:36:19',
    sources: ['Endpoint Sensor'],
    relatedEntities: ['finance_records.xlsx', 'sync-archive.example.test'],
    confidence: 'HIGH',
    details: 'Encrypted ZIP archive generated in temp workspace.'
  },
  {
    id: 'node-7',
    label: 'sync-archive.example.test',
    type: 'domain',
    x: 88,
    y: 35,
    highlighted: true,
    firstSeen: '10:36:19',
    lastSeen: '10:36:19',
    sources: ['Network Sensor', 'Intelligence Source'],
    relatedEntities: ['198.51.100.77', 'review_package.zip'],
    confidence: 'HIGH',
    details: 'Malicious drop host identified in intelligence feeds.'
  },
  {
    id: 'node-8',
    label: '198.51.100.77',
    type: 'ip',
    x: 88,
    y: 75,
    highlighted: true,
    firstSeen: '10:36:19',
    lastSeen: '10:36:19',
    sources: ['Network Sensor'],
    relatedEntities: ['sync-archive.example.test'],
    confidence: 'HIGH',
    details: 'Destination IP receiving 148MB outbound payload.'
  }
];

export const DEMO_GRAPH_EDGES: GraphEdge[] = [
  { id: 'edge-1', from: 'node-1', to: 'node-2', label: 'Failed/Success Auth', highlighted: true },
  { id: 'edge-2', from: 'node-2', to: 'node-3', label: 'Session On', highlighted: true },
  { id: 'edge-3', from: 'node-2', to: 'node-4', label: 'Generates', highlighted: true },
  { id: 'edge-4', from: 'node-3', to: 'node-5', label: 'Accesses Asset', highlighted: true },
  { id: 'edge-5', from: 'node-5', to: 'node-6', label: 'Archives into', highlighted: true },
  { id: 'edge-6', from: 'node-6', to: 'node-7', label: 'Exfiltrates to', highlighted: true },
  { id: 'edge-7', from: 'node-7', to: 'node-8', label: 'Resolves IP', highlighted: true }
];

export const DEMO_TIMELINE_EVENTS: TimelineEvent[] = [
  {
    id: 't-1',
    time: '10:28:43',
    title: 'Failed Login Attempt',
    entity: 'employee_07',
    ipOrHost: '185.220.101.45',
    description: 'Initial credential stuffing attempt against SSO portal.',
    source: 'Identity Gateway',
    severity: 'medium'
  },
  {
    id: 't-2',
    time: '10:29:08',
    title: 'Failed Login Attempt',
    entity: 'employee_07',
    ipOrHost: '185.220.101.45',
    description: 'Second authentication failure from same external IP.',
    source: 'Identity Gateway',
    severity: 'medium'
  },
  {
    id: 't-3',
    time: '10:29:41',
    title: 'Failed Login Attempt',
    entity: 'employee_07',
    ipOrHost: '185.220.101.45',
    description: 'Third password attempt from Tor exit node IP.',
    source: 'Identity Gateway',
    severity: 'high'
  },
  {
    id: 't-4',
    time: '10:30:16',
    title: 'Successful Authentication',
    entity: 'employee_07',
    ipOrHost: 'WORKSTATION-07 (SES-7F21A)',
    description: 'Authentication succeeded, issuing valid token SES-7F21A.',
    source: 'Identity Gateway',
    severity: 'high'
  },
  {
    id: 't-5',
    time: '10:30:42',
    title: 'Unusual Process Activity',
    entity: 'powershell.exe',
    ipOrHost: 'WORKSTATION-07',
    description: 'PowerShell execution with base64 encoded payload.',
    source: 'Endpoint Sensor',
    severity: 'high'
  },
  {
    id: 't-6',
    time: '10:32:28',
    title: 'Sensitive File Access',
    entity: 'finance_records.xlsx',
    ipOrHost: 'WORKSTATION-07',
    description: 'Unusual read access to restricted financial data.',
    source: 'Endpoint Sensor',
    severity: 'high'
  },
  {
    id: 't-7',
    time: '10:34:09',
    title: 'Archive Created',
    entity: 'review_package.zip',
    ipOrHost: 'WORKSTATION-07',
    description: 'Local staging zip archive generated in AppData\\Temp.',
    source: 'Endpoint Sensor',
    severity: 'high'
  },
  {
    id: 't-8',
    time: '10:36:19',
    title: 'Large Outbound Transfer',
    entity: 'sync-archive.example.test',
    ipOrHost: '198.51.100.77',
    description: '148MB exfiltration traffic sent to external drop host.',
    source: 'Network Sensor',
    severity: 'critical'
  }
];

export const DEMO_ATTACK_DNA: AttackDnaItem[] = [
  { category: 'IDENTITY', value: 'employee_07', subtext: 'Compromised Account' },
  { category: 'ENTRY', value: '185.220.101.45', subtext: 'Tor Exit Node' },
  { category: 'SESSION', value: 'SES-7F21A', subtext: 'SSO Bearer Token' },
  { category: 'ENDPOINT', value: 'WORKSTATION-07', subtext: 'Victim Asset' },
  { category: 'COLLECTION', value: 'finance_records.xlsx', subtext: 'Confidential File' },
  { category: 'PACKAGING', value: 'review_package.zip', subtext: 'Staging Zip' },
  { category: 'DESTINATION', value: 'sync-archive.example.test', subtext: 'C2 / Drop Domain' },
  { category: 'TRANSFER', value: '198.51.100.77', subtext: '148 MB Egress' }
];
