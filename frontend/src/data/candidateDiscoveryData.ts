import { InvestigationCandidate, CandidateDiscoverySummary } from '../types/candidates';

export const CANDIDATES_DATASET: InvestigationCandidate[] = [
  {
    rank: 1,
    id: 'cand-01',
    entityName: 'employee_07',
    entityType: 'identity',
    riskLevel: 'HIGH',
    riskScore: 92,
    correlationConfidence: 94,
    sourcesInvolved: ['Authentication', 'Endpoint', 'File', 'Network'],
    eventCount: 18,
    indicators: ['Auth Failures', 'Tor Exit IP', 'Encoded PowerShell', 'Sensitive File Read', 'Exfiltration'],
    primaryReason: 'Multi-stage suspicious sequence across 4 independent sources',
    status: 'PRIORITY INVESTIGATION',
    whyFlagged: [
      '3 consecutive failed logons followed by success from Tor exit node IP 185.220.101.45',
      'SSO session token SES-7F21A issued and bound to WORKSTATION-07',
      'Base64 encoded PowerShell execution without execution policy enforcement',
      'Restricted financial spreadsheet finance_records.xlsx accessed without ticket authorization',
      'Encrypted staging ZIP archive review_package.zip generated in AppData\\Temp',
      '148 MB outbound egress connection to known C2 drop domain sync-archive.example.test'
    ],
    riskBreakdown: [
      { signal: 'Repeated failed authentication attempts from external IP', points: 15 },
      { signal: 'Successful logon from Tor exit node indicator', points: 15 },
      { signal: 'Unusual encoded process execution (powershell.exe)', points: 20 },
      { signal: 'Access to restricted asset (finance_records.xlsx)', points: 20 },
      { signal: 'Local staging archive creation in temp workspace', points: 10 },
      { signal: 'High-volume external network exfiltration (148 MB)', points: 12 }
    ],
    confidenceBreakdown: [
      { signal: 'Shared User Principal (employee_07)', points: 25 },
      { signal: 'Shared Workstation Host (WORKSTATION-07)', points: 25 },
      { signal: 'Shared Session Bearer Token (SES-7F21A)', points: 20 },
      { signal: 'Tight 8-minute temporal sequence window', points: 15 },
      { signal: 'Threat Feed indicator match (45.33.32.156 / 198.51.100.77)', points: 9 }
    ],
    keyActors: {
      primaryUser: 'employee_07',
      primaryHost: 'WORKSTATION-07',
      entryIp: '185.220.101.45',
      targetAsset: 'finance_records.xlsx',
      exfiltrationDomain: 'sync-archive.example.test',
      exfiltrationIp: '198.51.100.77'
    }
  },
  {
    rank: 2,
    id: 'cand-02',
    entityName: 'employee_22',
    entityType: 'identity',
    riskLevel: 'MEDIUM-HIGH',
    riskScore: 73,
    correlationConfidence: 78,
    sourcesInvolved: ['Authentication', 'Endpoint'],
    eventCount: 11,
    indicators: ['Repeated Failures', 'Unseen Device Logon', 'Domain Admins Enumeration'],
    primaryReason: 'Abnormal authentication pattern & active directory group query',
    status: 'REVIEW RECOMMENDED',
    whyFlagged: [
      '5 consecutive authentication failures from internal IP 10.0.2.122',
      'First-time logon established on WORKSTATION-22 during non-standard hours (03:14 AM)',
      'PowerShell command net group "Domain Admins" /domain executed shortly after login',
      'No file exfiltration or network egress observed for this account'
    ],
    riskBreakdown: [
      { signal: '5 consecutive authentication failures', points: 20 },
      { signal: 'First-time logon from new internal workstation', points: 20 },
      { signal: 'Active Directory Domain Admins group enumeration', points: 18 },
      { signal: 'Activity during non-standard working hours', points: 15 }
    ],
    confidenceBreakdown: [
      { signal: 'Shared User Principal (employee_22)', points: 25 },
      { signal: 'Shared Workstation Host (WORKSTATION-22)', points: 25 },
      { signal: 'Temporal sequence window (< 12 minutes)', points: 18 },
      { signal: 'Sequential logon to process execution', points: 10 }
    ],
    keyActors: {
      primaryUser: 'employee_22',
      primaryHost: 'WORKSTATION-22',
      entryIp: '10.0.2.122',
      targetAsset: 'Active Directory Domain Admins'
    }
  },
  {
    rank: 3,
    id: 'cand-03',
    entityName: 'service_account_09',
    entityType: 'service',
    riskLevel: 'MEDIUM',
    riskScore: 61,
    correlationConfidence: 69,
    sourcesInvolved: ['Endpoint', 'Network'],
    eventCount: 9,
    indicators: ['Off-Schedule Execution', 'External Port Scan', 'Unusual Protocol'],
    primaryReason: 'Anomalous service process execution & external network probe',
    status: 'REVIEW RECOMMENDED',
    whyFlagged: [
      'Service process svc-backup.exe executed outside scheduled backup window',
      'Raw TCP socket connection initiated to unranked external port 8443',
      'No user interactive logon or confidential file access associated with this service'
    ],
    riskBreakdown: [
      { signal: 'Service execution outside approved maintenance window', points: 25 },
      { signal: 'Port scan / connection attempt to external port 8443', points: 20 },
      { signal: 'Unusual outbound RAW TCP protocol', points: 16 }
    ],
    confidenceBreakdown: [
      { signal: 'Shared Service Principal (service_account_09)', points: 25 },
      { signal: 'Shared Server Host (SRV-APP-09)', points: 25 },
      { signal: 'Temporal proximity (< 5 minutes)', points: 19 }
    ],
    keyActors: {
      primaryUser: 'service_account_09',
      primaryHost: 'SRV-APP-09',
      entryIp: '10.0.5.19',
      targetAsset: 'SRV-APP-09 Process Space'
    }
  }
];

export const CANDIDATE_DISCOVERY_SUMMARY: CandidateDiscoverySummary = {
  totalEventsAnalyzed: 2214,
  uniqueEntitiesObserved: 14,
  totalCandidatesCount: 3,
  highRiskCandidatesCount: 1,
  crossSourceCorrelationsCount: 6,
  candidates: CANDIDATES_DATASET,
  crossCandidatePatterns: [
    'Shared authentication gateway IP 10.0.1.15 observed across employee_07 and employee_22.',
    'Shared domain controller authentication authority PAM_NATIVE processing all 3 candidates.',
    'No cross-candidate lateral movement between employee_07 and service_account_09 detected.'
  ]
};
