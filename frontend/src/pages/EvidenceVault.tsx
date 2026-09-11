import { useState } from 'react';
import { VaultHeader } from '../components/Vault/VaultHeader';
import { EvidenceUploadArea } from '../components/Vault/EvidenceUploadArea';
import { InvestigationProgressTracker } from '../components/Vault/InvestigationProgressTracker';
import { StageIngestion } from '../components/Vault/StageIngestion';
import { StageEntityExtraction } from '../components/Vault/StageEntityExtraction';
import { StageCorrelationGraph } from '../components/Vault/StageCorrelationGraph';
import { StageIncidentTimeline } from '../components/Vault/StageIncidentTimeline';
import { StageWowMoment } from '../components/Vault/StageWowMoment';
import { InvestigationReportModal } from '../components/Vault/InvestigationReportModal';
import { OFFICIAL_DEMO_FILES } from '../data/vaultDemoData';
import { UploadedEvidenceFile, InvestigationStage, EvidenceClassification } from '../types/vault';

export const EvidenceVault = () => {
  const [files, setFiles] = useState<UploadedEvidenceFile[]>(OFFICIAL_DEMO_FILES);
  const [currentStage, setCurrentStage] = useState<InvestigationStage>('idle');
  const [isReportModalOpen, setIsReportModalOpen] = useState<boolean>(false);

  const isAllDemoFilesPresent = OFFICIAL_DEMO_FILES.every((demoFile) =>
    files.some((f) => f.name.toLowerCase().includes(demoFile.name.toLowerCase().replace('.pdf', '')))
  );

  const handleLoadDemoFiles = () => {
    setFiles(OFFICIAL_DEMO_FILES);
    setCurrentStage('idle');
  };

  const handleFileUpload = (newFiles: File[]) => {
    const processedFiles: UploadedEvidenceFile[] = newFiles.map((file) => {
      const lowerName = file.name.toLowerCase();
      let classification: EvidenceClassification = 'unclassified';
      let sourceName = 'Unclassified Evidence';

      if (lowerName.includes('auth')) {
        classification = 'authentication';
        sourceName = 'Identity Gateway';
      } else if (lowerName.includes('net')) {
        classification = 'network';
        sourceName = 'Network Sensor';
      } else if (lowerName.includes('threat') || lowerName.includes('intel')) {
        classification = 'threat_intel';
        sourceName = 'Intelligence Source';
      } else if (lowerName.includes('endpoint') || lowerName.includes('system')) {
        classification = 'endpoint';
        sourceName = 'Endpoint Sensor';
      }

      return {
        id: `file-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        name: file.name,
        size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
        status: 'ready',
        classification,
        sourceName,
        fileObject: file,
        isOfficialDemoFile: false
      };
    });

    setFiles((prev) => [...prev, ...processedFiles]);
  };

  const handleRemoveFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
    if (files.length <= 1) {
      setCurrentStage('idle');
    }
  };

  const handleClearAll = () => {
    setFiles([]);
    setCurrentStage('idle');
  };

  const handleStartInvestigation = () => {
    if (files.length > 0) {
      setCurrentStage('ingestion');
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Vault Header */}
      <VaultHeader
        onLoadDemoFiles={handleLoadDemoFiles}
        fileCount={files.length}
        isDemoMode={isAllDemoFilesPresent}
      />

      {/* Persistent Investigation Progress Bar when active */}
      {currentStage !== 'idle' && (
        <InvestigationProgressTracker currentStage={currentStage} />
      )}

      {/* STAGE CONTROLLER */}
      {currentStage === 'idle' && (
        <EvidenceUploadArea
          files={files}
          onFileUpload={handleFileUpload}
          onRemoveFile={handleRemoveFile}
          onClearAll={handleClearAll}
          onStartInvestigation={handleStartInvestigation}
          isAllDemoFilesPresent={isAllDemoFilesPresent}
        />
      )}

      {currentStage === 'ingestion' && (
        <StageIngestion
          files={files}
          onCompleteStage={() => setCurrentStage('extraction')}
        />
      )}

      {currentStage === 'extraction' && (
        <StageEntityExtraction
          onCompleteStage={() => setCurrentStage('correlation')}
          isDemoMode={isAllDemoFilesPresent}
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

      {/* Investigation Report Modal */}
      <InvestigationReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
      />
    </div>
  );
};

export default EvidenceVault;
