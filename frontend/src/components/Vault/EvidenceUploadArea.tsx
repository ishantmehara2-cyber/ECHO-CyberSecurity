import { useRef, useState } from 'react';
import {
  FileText,
  Upload,
  Trash2,
  CheckCircle2,
  Zap,
  Lock,
  Globe,
  Monitor,
  Info,
  AlertCircle,
  X
} from 'lucide-react';
import { UploadedEvidenceFile } from '../../types/vault';

interface EvidenceUploadAreaProps {
  files: UploadedEvidenceFile[];
  onFileUpload: (files: File[]) => void;
  onRemoveFile: (id: string) => void;
  onClearAll: () => void;
  onStartInvestigation: () => void;
  isAllDemoFilesPresent: boolean;
}

const sourceClassificationIcons: Record<string, React.ElementType> = {
  authentication: Lock,
  network: Globe,
  threat_intel: Info,
  endpoint: Monitor,
  unclassified: FileText
};

export const EvidenceUploadArea = ({
  files,
  onFileUpload,
  onRemoveFile,
  onClearAll,
  onStartInvestigation,
  isAllDemoFilesPresent
}: EvidenceUploadAreaProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const processUploadedFiles = (fileList: File[]) => {
    const validPdfFiles: File[] = [];
    let invalidFound = false;

    fileList.forEach((f) => {
      if (f.type === 'application/pdf' || f.name.toLowerCase().endsWith('.pdf')) {
        validPdfFiles.push(f);
      } else {
        invalidFound = true;
      }
    });

    if (invalidFound) {
      setErrorMessage('Unable to extract usable telemetry from unsupported document format. Please upload valid .pdf files.');
    } else {
      setErrorMessage(null);
    }

    if (validPdfFiles.length > 0) {
      onFileUpload(validPdfFiles);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processUploadedFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processUploadedFiles(Array.from(e.target.files));
      e.target.value = '';
    }
  };

  return (
    <div className="space-y-6">
      {/* Graceful Error Notification */}
      {errorMessage && (
        <div className="p-4 bg-red-950/80 border border-red-800 rounded-xl text-xs font-mono text-red-300 flex items-center justify-between shadow-lg animate-fade-in">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{errorMessage}</span>
          </div>
          <button
            onClick={() => setErrorMessage(null)}
            className="text-red-400 hover:text-red-200 p-1 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Drag & Drop Upload Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-300 relative overflow-hidden group ${
          isDragging
            ? 'border-cyan-400 bg-cyan-950/40 shadow-[0_0_25px_rgba(6,182,212,0.2)] scale-[1.01]'
            : 'border-dark-700 bg-dark-800/80 hover:border-dark-600 hover:bg-dark-800'
        }`}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept=".pdf,application/pdf"
          multiple
          className="hidden"
        />

        <div className="flex flex-col items-center justify-center space-y-3 relative z-10">
          <div className="p-3.5 rounded-full bg-dark-900 border border-dark-700 group-hover:border-cyan-500/50 text-cyan-400 transition-colors">
            <Upload className="w-6 h-6" />
          </div>

          <div className="space-y-1">
            <h3 className="text-base font-bold text-slate-100">
              Drag & Drop Evidence PDFs or <span className="text-cyan-400 underline">Browse Files</span>
            </h3>
            <p className="text-xs text-slate-400 max-w-lg mx-auto">
              Upload raw telemetry documents, authentication logs, network captures, or threat feeds for correlation analysis.
            </p>
          </div>

          <div className="text-[11px] font-mono text-slate-500">
            Supported formats: PDF • Multiple files allowed
          </div>
        </div>
      </div>

      {/* Uploaded Evidence Cards & Readiness Panel */}
      {files.length > 0 && (
        <div className="bg-dark-800 border border-dark-700 rounded-xl p-6 space-y-6 shadow-xl">
          {/* Header & Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-dark-700 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider">
                  Loaded Evidence Files ({files.length})
                </h3>
                {isAllDemoFilesPresent && (
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
                    FULL CORRELATION MODE AVAILABLE
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Ready for multi-source ingestion and entity extraction.
              </p>
            </div>

            <button
              onClick={onClearAll}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-dark-900 hover:bg-dark-700 text-slate-400 hover:text-slate-200 border border-dark-700 rounded-lg text-xs font-mono transition-colors self-end sm:self-auto cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear All</span>
            </button>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {files.map((file) => {
              const Icon = sourceClassificationIcons[file.classification] || FileText;

              return (
                <div
                  key={file.id}
                  className="bg-dark-900 border border-dark-700 rounded-xl p-4 flex flex-col justify-between space-y-4 hover:border-dark-600 transition-all relative overflow-hidden group"
                >
                  <div>
                    {/* Top Row */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800/60">
                          <Icon className="w-4 h-4" />
                        </div>
                        <span className="text-[10px] font-mono font-bold uppercase text-cyan-400">
                          {file.sourceName}
                        </span>
                      </div>

                      <button
                        onClick={() => onRemoveFile(file.id)}
                        title="Remove file"
                        className="text-slate-500 hover:text-red-400 p-1 rounded hover:bg-dark-800 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* File Title */}
                    <h4 className="text-xs font-bold text-slate-200 font-mono line-clamp-2 leading-tight">
                      📄 {file.name}
                    </h4>

                    {/* Size */}
                    <div className="text-[11px] font-mono text-slate-500 mt-2">
                      Size: {file.size}
                    </div>
                  </div>

                  {/* Status Indicator */}
                  <div className="pt-3 border-t border-dark-800 flex items-center justify-between text-xs font-mono">
                    <span className="text-slate-500 text-[10px]">STATUS</span>
                    <span className="text-emerald-400 font-bold flex items-center gap-1.5 text-[11px]">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      READY
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* EVIDENCE READINESS SUMMARY & BEGIN INVESTIGATION BUTTON */}
          <div className="p-5 bg-dark-900/90 border border-cyan-900/60 rounded-xl flex flex-col lg:flex-row lg:items-center justify-between gap-4 mt-6">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-mono font-bold text-slate-200 uppercase tracking-wider">
                  EVIDENCE READINESS CHECK: {files.length} SOURCE{files.length > 1 ? 'S' : ''} LOADED
                </span>
              </div>
              <p className="text-xs text-slate-400">
                {isAllDemoFilesPresent
                  ? 'All 4 official telemetry datasets present. Full deterministic attack chain correlation enabled.'
                  : 'Custom evidence files loaded. Exploration mode entity analysis active.'}
              </p>
            </div>

            <button
              onClick={onStartInvestigation}
              disabled={files.length === 0}
              className={`flex items-center justify-center gap-2.5 px-6 py-3.5 font-extrabold rounded-xl transition-all uppercase tracking-wider text-sm cursor-pointer shadow-xl ${
                files.length > 0
                  ? 'bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-slate-950 shadow-[0_0_25px_rgba(6,182,212,0.4)] hover:shadow-[0_0_35px_rgba(6,182,212,0.6)]'
                  : 'bg-dark-700 text-slate-500 cursor-not-allowed border border-dark-600'
              }`}
            >
              <Zap className="w-5 h-5 fill-slate-950" />
              <span>BEGIN ECHO INVESTIGATION</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
