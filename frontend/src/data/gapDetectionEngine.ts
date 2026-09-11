import {
  EvidenceGap,
  SourceCoverage,
  PathCompletionStage,
  EvidenceCoverageData
} from '../types/gap';

export const DETECTED_EVIDENCE_GAPS: EvidenceGap[] = [
  {
    id: 'GAP-01',
    expectedStage: 'Endpoint Process Execution Telemetry',
    observedBefore: 'Successful Authentication (10:30:16)',
    observedAfter: 'Sensitive File Access (10:32:28)',
    timeWindow: '10:30:16 – 10:32:28',
    whyFlagged: 'Authentication and sensitive file access were correlated on WORKSTATION-07, but supporting process execution logs (e.g. command-line parameters) between login and file read were absent in ingested telemetry.',
    gapConfidence: 78,
    priority: 'HIGH',
    recommendedSource: 'Endpoint / EDR Telemetry (Sysmon / Windows Event ID 4688)',
    whyRecommended: 'Endpoint telemetry is recommended because the reconstructed sequence indicates activity occurred on WORKSTATION-07, but process-level creation events were missing during this 2-minute window.',
    status: 'REQUIRES ANALYST REVIEW',
    relatedEntities: ['WORKSTATION-07', 'employee_07', 'finance_records.xlsx']
  },
  {
    id: 'GAP-02',
    expectedStage: 'Source File Access Audit',
    observedBefore: 'Unusual Process Activity (10:30:42)',
    observedAfter: 'Local Archive Created (10:34:09)',
    timeWindow: '10:30:42 – 10:34:09',
    whyFlagged: 'A compressed container (review_package.zip) was created in AppData\\Temp, but file read events for the secondary files packaged inside the archive were not captured in the available evidence.',
    gapConfidence: 65,
    priority: 'MEDIUM',
    recommendedSource: 'File System Audit Logs / Storage Access Logs',
    whyRecommended: 'File system auditing is recommended to verify whether additional confidential documents beyond finance_records.xlsx were staged into review_package.zip.',
    status: 'RECOMMENDED COLLECTION',
    relatedEntities: ['review_package.zip', 'WORKSTATION-07']
  }
];

export const SOURCE_COVERAGE_BREAKDOWN: SourceCoverage[] = [
  {
    sourceName: 'AUTHENTICATION',
    category: 'authentication',
    percentage: 100,
    status: 'COMPLETE',
    description: '100% complete logon, session token, and identity gateway logs.'
  },
  {
    sourceName: 'NETWORK TELEMETRY',
    category: 'network',
    percentage: 100,
    status: 'COMPLETE',
    description: '100% complete NetFlow, DNS resolution, and egress data transfer logs.'
  },
  {
    sourceName: 'ENDPOINT TELEMETRY',
    category: 'endpoint',
    percentage: 60,
    status: 'PARTIAL',
    description: 'Partial coverage: process command-line telemetry missing during 10:30-10:32.'
  },
  {
    sourceName: 'APPLICATION TELEMETRY',
    category: 'application',
    percentage: 30,
    status: 'LOW',
    description: 'Low coverage: audit logging for cloud storage application access unavailable.'
  }
];

export const PATH_COMPLETION_STAGES: PathCompletionStage[] = [
  {
    id: 'stage-1',
    stageName: 'AUTHENTICATION & ACCESS',
    isObserved: true,
    isGap: false,
    observedDetail: '✓ OBSERVED: Brute-force logins & successful SSO token SES-7F21A issued'
  },
  {
    id: 'stage-2',
    stageName: 'ENDPOINT EXECUTION',
    isObserved: false,
    isGap: true,
    gapInfo: DETECTED_EVIDENCE_GAPS[0],
    observedDetail: '? POSSIBLE MISSING EVIDENCE: Missing process creation logs between 10:30 and 10:32'
  },
  {
    id: 'stage-3',
    stageName: 'FILE ACCESS & COLLECTION',
    isObserved: true,
    isGap: false,
    observedDetail: '✓ OBSERVED: Read access to restricted file finance_records.xlsx'
  },
  {
    id: 'stage-4',
    stageName: 'ARCHIVE CREATION & STAGING',
    isObserved: true,
    isGap: false,
    observedDetail: '✓ OBSERVED: Compressed archive review_package.zip generated in Temp'
  },
  {
    id: 'stage-5',
    stageName: 'EXTERNAL DATA TRANSFER',
    isObserved: true,
    isGap: false,
    observedDetail: '✓ OBSERVED: 148 MB outbound egress to sync-archive.example.test (198.51.100.77)'
  }
];

export const COVERAGE_SUMMARY_METRICS: EvidenceCoverageData = {
  overallCoverageScore: 78,
  sources: SOURCE_COVERAGE_BREAKDOWN,
  totalObservedStages: 4,
  totalExpectedStages: 5,
  detectedGapsCount: 2
};
