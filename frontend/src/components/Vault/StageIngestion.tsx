import { useEffect, useState } from 'react';
import { FileText, CheckCircle2, Loader2, ArrowRight } from 'lucide-react';
import { UploadedEvidenceFile } from '../../types/vault';

interface StageIngestionProps {
  files: UploadedEvidenceFile[];
  onCompleteStage: () => void;
}

export const StageIngestion = ({ files, onCompleteStage }: StageIngestionProps) => {
  const [fileProgresses, setFileProgresses] = useState<Record<string, number>>({});
  const [activeFileIndex, setActiveFileIndex] = useState<number>(0);

  useEffect(() => {
    if (files.length === 0) return;

    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;

      const currentFile = files[activeFileIndex];
      if (currentFile) {
        setFileProgresses((prev) => ({
          ...prev,
          [currentFile.id]: Math.min(progress, 100)
        }));
      }

      if (progress >= 100) {
        progress = 0;
        if (activeFileIndex < files.length - 1) {
          setActiveFileIndex((prev) => prev + 1);
        } else {
          clearInterval(interval);
          setTimeout(() => {
            onCompleteStage();
          }, 1200);
        }
      }
    }, 120);

    return () => clearInterval(interval);
  }, [files, activeFileIndex, onCompleteStage]);

  const getStatusText = (fileName: string): string => {
    const lower = fileName.toLowerCase();
    if (lower.includes('auth')) return 'DOCUMENT STRUCTURE & AUTHENTICATION SCHEMAS IDENTIFIED';
    if (lower.includes('net')) return 'NETWORK CONNECTIONS & PCAP TELEMETRY DETECTED';
    if (lower.includes('threat') || lower.includes('intel')) return 'THREAT INTELLIGENCE FEED PARSED & INDEXED';
    if (lower.includes('endpoint')) return 'ENDPOINT PROCESSES & ASSET TELEMETRY INDEXED';
    return 'UNSTRUCTURED DOCUMENT PARSED AND INDEXED';
  };

  return (
    <div className="bg-dark-800 border border-dark-700 rounded-xl p-6 space-y-6 shadow-xl">
      <div className="flex items-center justify-between border-b border-dark-700 pb-4">
        <div>
          <span className="text-xs font-mono font-bold text-cyan-400 uppercase">
            STAGE 1 // DOCUMENT INGESTION & PARSING
          </span>
          <h2 className="text-xl font-bold text-slate-100 mt-1">
            Processing Uploaded Evidence Streams
          </h2>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-cyan-400">
          <Loader2 className="w-4 h-4 animate-spin text-cyan-400" />
          <span>Ingesting [{activeFileIndex + 1}/{files.length}]</span>
        </div>
      </div>

      <div className="space-y-4">
        {files.map((file, idx) => {
          const progress = fileProgresses[file.id] || 0;
          const isDone = progress === 100;
          const isCurrent = idx === activeFileIndex && !isDone;

          return (
            <div
              key={file.id}
              className={`p-4 rounded-xl border transition-all ${
                isDone
                  ? 'bg-dark-900 border-emerald-900/60'
                  : isCurrent
                  ? 'bg-dark-900 border-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.15)]'
                  : 'bg-dark-900/60 border-dark-700 opacity-60'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2 font-mono text-xs">
                <div className="flex items-center gap-2">
                  <FileText className={`w-4 h-4 ${isDone ? 'text-emerald-400' : 'text-cyan-400'}`} />
                  <span className="font-bold text-slate-200">
                    [{idx + 1}/{files.length}] {file.name}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-slate-500">{file.size}</span>
                  <span className={`font-bold ${isDone ? 'text-emerald-400' : 'text-cyan-400'}`}>
                    {progress}%
                  </span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="h-2 bg-dark-950 rounded-full overflow-hidden mb-2">
                <div
                  className={`h-full transition-all duration-150 ${
                    isDone ? 'bg-emerald-400' : 'bg-gradient-to-r from-cyan-500 to-blue-500'
                  }`}
                  style={{ width: `${progress}%` }}
                />
              </div>

              {/* Processing Status Line */}
              <div className="text-[11px] font-mono flex items-center justify-between">
                <span className={isDone ? 'text-emerald-400 font-bold' : isCurrent ? 'text-cyan-300' : 'text-slate-500'}>
                  {isDone ? `✓ ${getStatusText(file.name)}` : isCurrent ? '● Extracting document tokens...' : '○ Pending...'}
                </span>

                {isDone && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
              </div>
            </div>
          );
        })}
      </div>

      <div className="p-3 bg-dark-900 border border-dark-700 rounded-lg text-xs font-mono text-slate-400 flex items-center justify-between">
        <span>Step 1 of 5: Document Ingestion Complete</span>
        <span className="text-cyan-400 flex items-center gap-1">
          Proceeding to Entity Extraction <ArrowRight className="w-3.5 h-3.5" />
        </span>
      </div>
    </div>
  );
};
