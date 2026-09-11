import { DEMO_EXTRACTED_ENTITIES } from '../data/vaultDemoData';
import { CORRELATION_LINKS, RECONSTRUCTED_ATTACK_STAGES, INVESTIGATION_SUMMARY_STORY } from '../data/correlationEngine';
import { DETECTED_EVIDENCE_GAPS, COVERAGE_SUMMARY_METRICS } from '../data/gapDetectionEngine';

export interface ApiInvestigationResult {
  investigationId: string;
  timestamp: string;
  silosLoadedCount: number;
  totalRawEvents: number;
  coverageScore: number;
  extractedEntities: any[];
  correlationLinks: any[];
  attackStages: any[];
  evidenceGaps: any[];
  summary: any;
}

const API_BASE_URL = 'http://localhost:8000';

export async function fetchInvestigationDemo(): Promise<ApiInvestigationResult> {
  try {
    const response = await fetch(`${API_BASE_URL}/investigation/demo`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ siloFilesCount: 4 }),
    });

    if (response.ok) {
      const data = await response.json();
      return data;
    }
  } catch (error) {
    console.warn('Backend API unreachable, falling back to local deterministic pipeline data:', error);
  }

  // Graceful Local Fallback Data Structure
  return {
    investigationId: `ECHO-LOCAL-${Date.now()}`,
    timestamp: new Date().toISOString(),
    silosLoadedCount: 4,
    totalRawEvents: 2214,
    coverageScore: COVERAGE_SUMMARY_METRICS.overallCoverageScore,
    extractedEntities: DEMO_EXTRACTED_ENTITIES,
    correlationLinks: CORRELATION_LINKS,
    attackStages: RECONSTRUCTED_ATTACK_STAGES,
    evidenceGaps: DETECTED_EVIDENCE_GAPS,
    summary: INVESTIGATION_SUMMARY_STORY
  };
}

export async function checkBackendHealth(): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/health`);
    return response.ok;
  } catch {
    return false;
  }
}
