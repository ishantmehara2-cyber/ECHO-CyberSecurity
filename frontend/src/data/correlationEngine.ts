import {
  CorrelationLink,
  AttackStageItem,
  InvestigationSummaryStory,
  AnalysisPipelineStep
} from '../types/correlation';

export const PIPELINE_ANALYSIS_STEPS: AnalysisPipelineStep[] = [
  { id: 'step-1', label: 'Reading uploaded multi-source telemetry', status: 'completed' },
  { id: 'step-2', label: 'Extracting security entities & tokens', status: 'completed' },
  { id: 'step-3', label: 'Normalizing event structures & timestamps', status: 'completed' },
  { id: 'step-4', label: 'Comparing temporal proximity & sequences', status: 'completed' },
  { id: 'step-5', label: 'Detecting common IP addresses & Tor exit nodes', status: 'completed' },
  { id: 'step-6', label: 'Matching user accounts & bearer sessions', status: 'completed' },
  { id: 'step-7', label: 'Correlating cross-source activity graphs', status: 'completed' },
  { id: 'step-8', label: 'Building multi-stage attack reconstruction', status: 'completed' },
  { id: 'step-9', label: 'Calculating weighted correlation confidence scores', status: 'completed' },
  { id: 'step-10', label: 'Generating explainable investigation narrative', status: 'completed' }
];

export const CORRELATION_LINKS: CorrelationLink[] = [
  {
    id: 'link-1',
    sourceNodeId: 'node-1', // 185.220.101.45
    targetNodeId: 'node-2', // employee_07
    sourceLabel: '185.220.101.45',
    targetLabel: 'employee_07',
    matchingFactors: [
      { fieldName: 'Same IP Address', value: '185.220.101.45', description: 'Tor exit node observed in credential attempts' },
      { fieldName: 'Target Account', value: 'employee_07', description: '3 failed attempts followed by success' },
      { fieldName: 'Temporal Window', value: '< 2 Minutes', description: 'Login sequence occurred between 10:28:43 and 10:30:16' }
    ],
    confidenceScore: 92,
    confidenceLevel: 'HIGH',
    humanExplanation: 'Connected because user account employee_07 authenticated from external IP 185.220.101.45 within 2 minutes following multiple failed attempts.'
  },
  {
    id: 'link-2',
    sourceNodeId: 'node-2', // employee_07
    targetNodeId: 'node-3', // WORKSTATION-07
    sourceLabel: 'employee_07',
    targetLabel: 'WORKSTATION-07',
    matchingFactors: [
      { fieldName: 'User Principal', value: 'employee_07', description: 'Active logged-in session account' },
      { fieldName: 'Host Assignment', value: 'WORKSTATION-07', description: 'Assigned corporate endpoint' },
      { fieldName: 'SSO Bearer Token', value: 'SES-7F21A', description: 'Session issued upon success' }
    ],
    confidenceScore: 96,
    confidenceLevel: 'HIGH',
    humanExplanation: 'Connected because session SES-7F21A bound account employee_07 directly to WORKSTATION-07.'
  },
  {
    id: 'link-3',
    sourceNodeId: 'node-3', // WORKSTATION-07
    targetNodeId: 'node-5', // finance_records.xlsx
    sourceLabel: 'WORKSTATION-07',
    targetLabel: 'finance_records.xlsx',
    matchingFactors: [
      { fieldName: 'Process Origin', value: 'powershell.exe', description: 'Suspicious script executed on host' },
      { fieldName: 'File Handle', value: 'finance_records.xlsx', description: 'Restricted spreadsheet accessed without authorization' },
      { fieldName: 'Time Delta', value: '1 Min 46 Sec', description: 'Access occurred immediately after execution' }
    ],
    confidenceScore: 89,
    confidenceLevel: 'HIGH',
    humanExplanation: 'Connected because encoded PowerShell execution on WORKSTATION-07 was immediately followed by restricted file access to finance_records.xlsx.'
  },
  {
    id: 'link-4',
    sourceNodeId: 'node-5', // finance_records.xlsx
    targetNodeId: 'node-6', // review_package.zip
    sourceLabel: 'finance_records.xlsx',
    targetLabel: 'review_package.zip',
    matchingFactors: [
      { fieldName: 'Local Staging Path', value: 'AppData\\Local\\Temp', description: 'File archived into compressed container' },
      { fieldName: 'Sequential Action', value: 'Access -> Zip', description: 'Archive created 1 minute after file read' }
    ],
    confidenceScore: 85,
    confidenceLevel: 'HIGH',
    humanExplanation: 'Connected because finance_records.xlsx was packaged into local compressed archive review_package.zip within 1 minute of access.'
  },
  {
    id: 'link-5',
    sourceNodeId: 'node-6', // review_package.zip
    targetNodeId: 'node-7', // sync-archive.example.test
    sourceLabel: 'review_package.zip',
    targetLabel: 'sync-archive.example.test',
    matchingFactors: [
      { fieldName: 'Payload Size', value: '148 MB', description: 'Volume matches compressed archive size' },
      { fieldName: 'Domain Destination', value: 'sync-archive.example.test', description: 'Drop host flagged in Threat Intelligence Feed' }
    ],
    confidenceScore: 94,
    confidenceLevel: 'HIGH',
    humanExplanation: 'Connected because review_package.zip was transmitted via high-volume outbound network egress to external drop domain sync-archive.example.test.'
  },
  {
    id: 'link-6',
    sourceNodeId: 'node-7', // sync-archive.example.test
    targetNodeId: 'node-8', // 198.51.100.77
    sourceLabel: 'sync-archive.example.test',
    targetLabel: '198.51.100.77',
    matchingFactors: [
      { fieldName: 'DNS A Record', value: '198.51.100.77', description: 'Domain resolves to external IP' },
      { fieldName: 'Egress Traffic', value: '148 MB TCP/443', description: 'Outbound HTTPS transfer' }
    ],
    confidenceScore: 98,
    confidenceLevel: 'HIGH',
    humanExplanation: 'Connected because domain sync-archive.example.test resolved to external IP 198.51.100.77 receiving 148 MB egress.'
  }
];

export const RECONSTRUCTED_ATTACK_STAGES: AttackStageItem[] = [
  {
    stageNumber: 1,
    stageName: 'Initial Activity / Entry',
    timestamp: '10:28:43',
    source: 'Identity Gateway',
    eventTitle: 'Brute Force Authentication Attempts',
    entity: 'employee_07',
    ipOrDevice: '185.220.101.45',
    severity: 'medium',
    riskLevel: 'MODERATE',
    connectionExplanation: 'Connected because multiple failed logins from Tor exit node IP 185.220.101.45 targeted employee_07.',
    confidenceScore: 91,
    confidenceReasons: [
      'Same external IP 185.220.101.45',
      'Same target account employee_07',
      'Occurred within 58 seconds'
    ]
  },
  {
    stageNumber: 2,
    stageName: 'Suspicious Access',
    timestamp: '10:30:16',
    source: 'Identity Gateway',
    eventTitle: 'Successful SSO Authentication',
    entity: 'employee_07',
    ipOrDevice: 'WORKSTATION-07 (SES-7F21A)',
    severity: 'high',
    riskLevel: 'HIGH',
    connectionExplanation: 'Connected because authentication succeeded immediately after brute force attempts, granting bearer session SES-7F21A.',
    confidenceScore: 95,
    confidenceReasons: [
      'Same account employee_07',
      'Success follow-up within 35s of failed attempts',
      'Session token SES-7F21A issued'
    ]
  },
  {
    stageNumber: 3,
    stageName: 'Endpoint Activity',
    timestamp: '10:30:42',
    source: 'Endpoint Sensor',
    eventTitle: 'Encoded PowerShell Execution',
    entity: 'powershell.exe',
    ipOrDevice: 'WORKSTATION-07',
    severity: 'high',
    riskLevel: 'HIGH',
    connectionExplanation: 'Connected because PowerShell script with base64 encoded parameters executed on WORKSTATION-07 under employee_07 session.',
    confidenceScore: 93,
    confidenceReasons: [
      'Same host WORKSTATION-07',
      'Same active session user employee_07',
      'Executed 26 seconds after login'
    ]
  },
  {
    stageNumber: 4,
    stageName: 'Data Access & Collection',
    timestamp: '10:32:28',
    source: 'Endpoint Sensor',
    eventTitle: 'Restricted Asset Access',
    entity: 'finance_records.xlsx',
    ipOrDevice: 'WORKSTATION-07',
    severity: 'high',
    riskLevel: 'HIGH',
    connectionExplanation: 'Connected because restricted file finance_records.xlsx was accessed directly following process execution without ticket approval.',
    confidenceScore: 88,
    confidenceReasons: [
      'Same host WORKSTATION-07',
      'Anomalous file handle access',
      'Occurred 1m 46s after PowerShell start'
    ]
  },
  {
    stageNumber: 5,
    stageName: 'Staging & Packaging',
    timestamp: '10:34:09',
    source: 'Endpoint Sensor',
    eventTitle: 'Local Staging Archive Created',
    entity: 'review_package.zip',
    ipOrDevice: 'WORKSTATION-07',
    severity: 'high',
    riskLevel: 'HIGH',
    connectionExplanation: 'Connected because encrypted zip container review_package.zip was created in AppData\\Temp containing staging files.',
    confidenceScore: 89,
    confidenceReasons: [
      'Same host WORKSTATION-07',
      'Temp directory archive creation',
      'Occurred 1m 41s after spreadsheet read'
    ]
  },
  {
    stageNumber: 6,
    stageName: 'Network Communication & Exfiltration',
    timestamp: '10:36:19',
    source: 'Network Sensor',
    eventTitle: 'High-Volume Outbound Egress',
    entity: 'sync-archive.example.test',
    ipOrDevice: '198.51.100.77',
    severity: 'critical',
    riskLevel: 'CRITICAL',
    connectionExplanation: 'Connected because 148 MB outbound HTTPS connection was initiated from WORKSTATION-07 to malicious destination 198.51.100.77.',
    confidenceScore: 97,
    confidenceReasons: [
      'Same host WORKSTATION-07',
      'Volume matching staging archive size (148 MB)',
      'Known C2 drop domain flagged in Threat Feed'
    ]
  }
];

export const INVESTIGATION_SUMMARY_STORY: InvestigationSummaryStory = {
  totalCorrelatedEvents: 2214,
  evidenceConnectionsCount: 6,
  highConfidenceCount: 6,
  attackStagesCount: 6,
  overallConfidenceScore: 94,
  narrativeText: `ECHO identified a multi-stage cyberattack sequence connecting four independent security telemetry sources. The sequence initiated with brute-force authentication attempts against employee_07 from Tor exit node IP 185.220.101.45, resulting in a valid SSO session on WORKSTATION-07. Following authentication, an encoded PowerShell command executed on WORKSTATION-07, accessing restricted asset finance_records.xlsx. The data was packaged into local staging archive review_package.zip and exfiltrated to external drop domain sync-archive.example.test (198.51.100.77) via a 148 MB egress transfer.`,
  keyActors: {
    primaryUser: 'employee_07',
    primaryHost: 'WORKSTATION-07',
    entryIp: '185.220.101.45',
    targetAsset: 'finance_records.xlsx',
    exfiltrationDomain: 'sync-archive.example.test',
    exfiltrationIp: '198.51.100.77'
  }
};
