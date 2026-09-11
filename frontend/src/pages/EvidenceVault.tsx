import { useState } from 'react';
import { VaultHeader } from '../components/Vault/VaultHeader';
import { SiloDataDiagram } from '../components/Vault/SiloDataDiagram';
import { DedicatedSilosGrid } from '../components/Vault/DedicatedSilosGrid';
import { PreInvestigationSummary } from '../components/Vault/PreInvestigationSummary';
import { InvestigationProgressTracker } from '../components/Vault/InvestigationProgressTracker';
import { StageIngestion } from '../components/Vault/StageIngestion';
import { StageEntityExtraction } from '../components/Vault/StageEntityExtraction';
import { CandidateDiscoveryView } from '../components/Vault/CandidateDiscoveryView';
import { StageCorrelationGraph } from '../components/Vault/StageCorrelationGraph';
import { StageIncidentTimeline } from '../components/Vault/StageIncidentTimeline';
import { StageWowMoment } from '../components/Vault/StageWowMoment';
import { InvestigationReportModal } from '../components/Vault/InvestigationReportModal';
import { CandidateDiscoveryReportModal } from '../components/Vault/CandidateDiscoveryReportModal';
import { ResetConfirmationModal } from '../components/Vault/ResetConfirmationModal';
import { OFFICIAL_DEMO_FILES, SILO_SLOT_CONFIGS } from '../data/vaultDemoData';
import { CANDIDATES_DATASET } from '../data/candidateDiscoveryData';
import {
  UploadedEvidenceFile,
  InvestigationStage,
  SiloSlotKey,
  EvidenceClassification
} from '../types/vault';
import { InvestigationCandidate } from '../types/candidates';
import { analyzeFiles, BackendAnalysisResult } from '../services/investigationService';
import { AlertCircle, RefreshCw } from 'lucide-react';

export const EvidenceVault = () => {
  // Mode selection state: 'demo' vs 'lab'
  const [investigationMode, setInvestigationMode] = useState<'demo' | 'lab'>('demo');

  // 4 Silo slots state
  const [siloFiles, setSiloFiles] = useState<Record<SiloSlotKey, UploadedEvidenceFile | null>>({
    identity: OFFICIAL_DEMO_FILES[0],
    network: OFFICIAL_DEMO_FILES[1],
    threat_intel: OFFICIAL_DEMO_FILES[2],
    endpoint: OFFICIAL_DEMO_FILES[3]
  });

  const [currentStage, setCurrentStage] = useState<InvestigationStage>('idle');
  const [selectedCandidate, setSelectedCandidate] = useState<InvestigationCandidate>(CANDIDATES_DATASET[0]);
  const [analysisData, setAnalysisData] = useState<BackendAnalysisResult | null>(null);
  const [analysisError, setAnalysisError] = useState<string | null>(null);

  const [isReportModalOpen, setIsReportModalOpen] = useState<boolean>(false);
  const [isCandidateReportOpen, setIsCandidateReportOpen] = useState<boolean>(false);
  const [isResetModalOpen, setIsResetModalOpen] = useState<boolean>(false);

  // Active files list
  const activeFileList: UploadedEvidenceFile[] = Object.values(siloFiles).filter(Boolean) as UploadedEvidenceFile[];

  const isAllDemoFilesPresent = OFFICIAL_DEMO_FILES.every((demo) =>
    activeFileList.some((f) => f.name.toLowerCase().includes(demo.name.toLowerCase().replace('.pdf', '')))
  );

  const handleLoadDemoFiles = () => {
    setSiloFiles({
      identity: OFFICIAL_DEMO_FILES[0],
      network: OFFICIAL_DEMO_FILES[1],
      threat_intel: OFFICIAL_DEMO_FILES[2],
      endpoint: OFFICIAL_DEMO_FILES[3]
    });
    setInvestigationMode('demo');
    setCurrentStage('idle');
    setAnalysisError(null);
  };

  const handleUploadToSlot = (slotKey: SiloSlotKey, uploadedFiles: File[]) => {
    if (uploadedFiles.length === 0) return;
    const file = uploadedFiles[0];
    const lowerName = file.name.toLowerCase();

    const config = SILO_SLOT_CONFIGS.find((c) => c.key === slotKey);
    let classification: EvidenceClassification = config?.classification || 'unclassified';
    let sourceName = config?.sourceName || 'Unclassified Evidence';
    let warningMismatch: string | undefined = undefined;
    let suggestedSlotKey: SiloSlotKey | undefined = undefined;

    // Source mismatch detection
    if (lowerName.includes('net') && slotKey !== 'network') {
      warningMismatch = `Network telemetry evidence appears to have been uploaded to the ${config?.title} slot. Correlation classification may be affected.`;
      suggestedSlotKey = 'network';
    } else if (lowerName.includes('auth') && slotKey !== 'identity') {
      warningMismatch = `Authentication evidence appears to have been uploaded to the ${config?.title} slot. Correlation classification may be affected.`;
      suggestedSlotKey = 'identity';
    } else if ((lowerName.includes('threat') || lowerName.includes('intel')) && slotKey !== 'threat_intel') {
      warningMismatch = `Threat intelligence feed appears to have been uploaded to the ${config?.title} slot. Correlation classification may be affected.`;
      suggestedSlotKey = 'threat_intel';
    } else if ((lowerName.includes('endpoint') || lowerName.includes('system')) && slotKey !== 'endpoint') {
      warningMismatch = `Endpoint telemetry appears to have been uploaded to the ${config?.title} slot. Correlation classification may be affected.`;
      suggestedSlotKey = 'endpoint';
    }

    const processedFile: UploadedEvidenceFile = {
      id: `file-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      name: file.name,
      size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
      status: 'ready',
      classification,
      sourceName,
      siloSlotKey: slotKey,
      fileObject: file,
      isOfficialDemoFile: false,
      warningMismatch,
      suggestedSlotKey
    };

    setSiloFiles((prev) => ({
      ...prev,
      [slotKey]: processedFile
    }));
  };

  const handleRemoveFromSlot = (slotKey: SiloSlotKey) => {
    setSiloFiles((prev) => ({
      ...prev,
      [slotKey]: null
    }));
  };

  const handleMoveSlot = (fromSlotKey: SiloSlotKey, targetSlotKey: SiloSlotKey) => {
    const fileToMove = siloFiles[fromSlotKey];
    if (!fileToMove) return;

    const targetConfig = SILO_SLOT_CONFIGS.find((c) => c.key === targetSlotKey);

    const updatedFile: UploadedEvidenceFile = {
      ...fileToMove,
      siloSlotKey: targetSlotKey,
      classification: targetConfig?.classification || fileToMove.classification,
      sourceName: targetConfig?.sourceName || fileToMove.sourceName,
      warningMismatch: undefined,
      suggestedSlotKey: undefined
    };

    setSiloFiles((prev) => ({
      ...prev,
      [fromSlotKey]: null,
      [targetSlotKey]: updatedFile
    }));
  };

  const handleConfirmReset = () => {
    setSiloFiles({
      identity: null,
      network: null,
      threat_intel: null,
      endpoint: null
    });
    setCurrentStage('idle');
    setAnalysisError(null);
  };

  const handleStartInvestigation = async () => {
    if (activeFileList.length === 0) return;

    setAnalysisError(null);
    setCurrentStage('ingestion');

    try {
      // Gather actual File objects or create fallback Blobs
      const filesToUpload: File[] = activeFileList.map((f) => {
        if (f.fileObject) return f.fileObject;
        return new File([`Raw telemetry data for ${f.name}`], f.name, { type: 'text/plain' });
      });

      // Send actual POST request to http://127.0.0.1:8000/api/analyze
      const result = await analyzeFiles(filesToUpload);
      setAnalysisData(result);
    } catch (err: any) {
      console.error('Investigation analysis error:', err);
      setAnalysisError(err.message || 'Failed to connect to ECHO backend analysis API.');
    }
  };

  const handleSelectCandidate = (candidate: InvestigationCandidate) => {
    setSelectedCandidate(candidate);
    setCurrentStage('correlation');
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* 1. Header with Mode Selector */}
      <VaultHeader
        investigationMode={investigationMode}
        onChangeMode={setInvestigationMode}
        onLoadDemoFiles={handleLoadDemoFiles}
        onOpenResetModal={() => setIsResetModalOpen(true)}
        fileCount={activeFileList.length}
      />

      {/* Error Notification Banner if Backend API Fails */}
      {analysisError && (
        <div className="p-4 bg-red-950/90 border border-red-800 rounded-xl text-xs font-mono text-red-300 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xl animate-fade-in">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
            <div>
              <strong className="text-red-200 uppercase font-bold block">ANALYSIS PIPELINE ERROR:</strong>
              <span>{analysisError}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleStartInvestigation}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-red-900 hover:bg-red-800 text-red-100 rounded text-xs font-bold transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Retry Request</span>
            </button>
            <button
              onClick={() => {
                setAnalysisError(null);
                setCurrentStage('idle');
              }}
              className="px-3 py-1.5 bg-dark-900 hover:bg-dark-800 text-slate-400 rounded text-xs font-bold transition-colors cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Persistent Progress Tracker when active */}
      {currentStage !== 'idle' && (
        <InvestigationProgressTracker currentStage={currentStage} />
      )}

      {/* IDLE INPUT EXPERIENCE */}
      {currentStage === 'idle' && (
        <div className="space-y-6">
          {/* Visual Silos Pathway Diagram */}
          <SiloDataDiagram siloFiles={siloFiles} />

          {/* 4 Dedicated Upload Cards Grid */}
          <DedicatedSilosGrid
            siloFiles={siloFiles}
            onUploadToSlot={handleUploadToSlot}
            onRemoveFromSlot={handleRemoveFromSlot}
            onMoveSlot={handleMoveSlot}
          />

          {/* Pre-Investigation Checklist & Action Bar */}
          <PreInvestigationSummary
            siloFiles={siloFiles}
            onStartInvestigation={handleStartInvestigation}
          />
        </div>
      )}

      {/* PIPELINE STAGES */}
      {currentStage === 'ingestion' && (
        <StageIngestion
          files={activeFileList}
          onCompleteStage={() => setCurrentStage('extraction')}
        />
      )}

      {currentStage === 'extraction' && (
        <StageEntityExtraction
          onCompleteStage={() => setCurrentStage('discovery')}
          isDemoMode={isAllDemoFilesPresent && investigationMode === 'demo'}
          totalParsedRecords={analysisData?.total_records || 2214}
        />
      )}

      {currentStage === 'discovery' && (
        <CandidateDiscoveryView
          onSelectCandidate={handleSelectCandidate}
          onOpenCandidateReport={() => setIsCandidateReportOpen(true)}
        />
      )}

      {currentStage === 'correlation' && (
        <StageCorrelationGraph
          onCompleteStage={() => setCurrentStage('timeline')}
        />
      )}

      {currentStage === 'timeline' && (
        <StageIncidentTimeline
          onCompleteStage={() => setCurrentStage('reconstruction')}
        />
      )}

      {currentStage === 'reconstruction' && (
        <StageWowMoment
          onOpenReportModal={() => setIsReportModalOpen(true)}
        />
      )}

      {/* Deep Selected Candidate Investigation Report Modal */}
      <InvestigationReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        selectedEntityName={selectedCandidate.entityName}
      />

      {/* Full Candidate Discovery Report Modal */}
      <CandidateDiscoveryReportModal
        isOpen={isCandidateReportOpen}
        onClose={() => setIsCandidateReportOpen(false)}
      />

      {/* Reset Confirmation Modal */}
      <ResetConfirmationModal
        isOpen={isResetModalOpen}
        onClose={() => setIsResetModalOpen(false)}
        onConfirmReset={handleConfirmReset}
      />
    </div>
  );
};

export default EvidenceVault;
