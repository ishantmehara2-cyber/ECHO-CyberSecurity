import { Shield, Sparkles, Terminal, FileCode } from 'lucide-react';

interface VaultHeaderProps {
  investigationMode: 'demo' | 'lab';
  onChangeMode: (mode: 'demo' | 'lab') => void;
  onLoadDemoFiles: () => void;
  onOpenResetModal: () => void;
  fileCount: number;
}

export const VaultHeader = ({
  investigationMode,
  onChangeMode,
  onLoadDemoFiles,
  onOpenResetModal,
  fileCount
}: VaultHeaderProps) => {
  return (
    <div className="bg-dark-800/80 border border-dark-700 rounded-xl p-6 overflow-hidden backdrop-blur-sm shadow-xl space-y-4">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Title */}
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-800/50 text-cyan-400 text-xs font-mono font-bold uppercase tracking-wider">
            <Shield className="w-3.5 h-3.5" />
            <span>HEURISTIC CROSS-SILO CORRELATION PIPELINE</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight font-mono">
            ECHO Evidence Vault & Investigation Workspace
          </h1>

          <p className="text-slate-400 text-xs sm:text-sm leading-relaxed max-w-3xl font-sans">
            Upload multi-source security logs, raw telemetry, or threat feeds. ECHO inspects, normalizes, and correlates evidence across data silos.
          </p>
        </div>

        {/* Investigation Mode Selector (Demo vs Lab/Dataset Mode) */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 shrink-0 font-mono text-xs">
          <div className="p-1 bg-dark-900 border border-dark-700 rounded-xl flex items-center gap-1">
            <button
              onClick={() => onChangeMode('demo')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg font-bold transition-all cursor-pointer ${
                investigationMode === 'demo'
                  ? 'bg-cyan-600 text-slate-950 shadow-[0_0_12px_rgba(6,182,212,0.4)]'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>DEMO MODE</span>
            </button>

            <button
              onClick={() => onChangeMode('lab')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg font-bold transition-all cursor-pointer ${
                investigationMode === 'lab'
                  ? 'bg-purple-600 text-slate-950 shadow-[0_0_12px_rgba(168,85,247,0.4)]'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>LAB / DATASET MODE</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mode Banner Warning */}
      {investigationMode === 'lab' ? (
        <div className="p-3 bg-purple-950/40 border border-purple-800/80 rounded-lg text-xs font-mono text-purple-300 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileCode className="w-4 h-4 text-purple-400 shrink-0" />
            <span>
              <strong>LAB DATASET MODE ACTIVE:</strong> Upload JSON, CSV, JSONL, LOG, or TXT telemetry from organizer challenge environments.
            </span>
          </div>

          <span className="text-[10px] text-slate-400 hidden sm:block">
            ⚠️ Only analyze datasets you are authorized to investigate.
          </span>
        </div>
      ) : (
        <div className="p-3 bg-dark-900 border border-dark-700 rounded-lg text-xs font-mono text-slate-400 flex items-center justify-between">
          <span>
            DEMO MODE ACTIVE: Using official 4-silo synthetic attack scenario dataset.
          </span>

          <div className="flex items-center gap-2 font-bold">
            <button
              onClick={onLoadDemoFiles}
              className="text-cyan-400 hover:underline cursor-pointer"
            >
              Reload 4 Demo PDFs
            </button>
            <span className="text-slate-600">•</span>
            <button
              onClick={onOpenResetModal}
              className="text-slate-500 hover:text-red-400 cursor-pointer"
            >
              Clear Workspace ({fileCount} files)
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
