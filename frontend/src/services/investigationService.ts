export interface BackendAnalysisResult {
  success: boolean;
  total_records: number;
  files_processed: { filename: string; format: string; source_type: string; records_parsed: number }[];
  normalized_events: any[];
  entities: {
    identities: any[];
    network_indicators: any[];
    endpoints: any[];
    domains: any[];
    sessions: any[];
    files_assets: any[];
  };
  extractedEntities: any[];
  suspicious_entities: any[];
  correlations: any[];
  timeline: any[];
  confidence: { overallScore: number; coverageScore: number };
  evidence_gaps: any[];
  summary: any;
}

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

export interface UploadResponse {
  success: boolean;
  filename: string;
  file_type: string;
  silo: string;
  records_detected: number;
  status: string;
}

const API_BASE_URL = 'http://127.0.0.1:8000';

export async function analyzeFiles(files: File[]): Promise<BackendAnalysisResult> {
  const formData = new FormData();
  for (const file of files) {
    formData.append('files', file);
  }

  try {
    const response = await fetch(`${API_BASE_URL}/api/analyze`, {
      method: 'POST',
      body: formData,
    });

    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      const errText = await response.text();
      throw new Error(`Analysis request failed: ${response.status} ${errText}`);
    }
  } catch (error) {
    console.warn('Backend /api/analyze error or unreachable:', error);
    throw error;
  }
}

export async function uploadEvidenceFile(file: File, siloKey?: string): Promise<UploadResponse> {
  const formData = new FormData();
  formData.append('file', file);
  if (siloKey) formData.append('silo', siloKey);

  try {
    const response = await fetch(`${API_BASE_URL}/api/evidence/upload`, {
      method: 'POST',
      body: formData,
    });

    if (response.ok) {
      const data = await response.json();
      return data;
    }
  } catch (error) {
    console.warn('Backend upload unreachable, falling back to local metadata parsing:', error);
  }

  throw new Error('Evidence upload service is unavailable. Start the ECHO backend and retry.');
}

export async function analyzeDemoFiles(): Promise<BackendAnalysisResult> {
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
      return {
        success: true,
        total_records: data.totalRawEvents,
        files_processed: data.files_processed || [],
        normalized_events: data.normalizedEvents,
        entities: data.entities || {},
        extractedEntities: data.extractedEntities,
        suspicious_entities: data.suspicious_entities || [],
        correlations: data.correlationLinks,
        timeline: data.attackStages,
        confidence: { overallScore: data.summary.overallConfidenceScore, coverageScore: data.coverageScore },
        evidence_gaps: data.evidenceGaps,
        summary: data.summary,
      };
    }
  } catch (error) {
    console.warn('Backend demo API unreachable:', error);
  }

    throw new Error('Demo investigation service is unavailable. Start the ECHO backend and retry.');
}

export async function checkBackendHealth(): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/health`);
    return response.ok;
  } catch {
    return false;
  }
}
