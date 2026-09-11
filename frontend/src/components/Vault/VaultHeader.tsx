import { Sparkles, FolderPlus } from 'lucide-react';

interface VaultHeaderProps {
  onLoadDemoFiles: () => void;
  fileCount: number;
  isDemoMode: boolean;
}

export const VaultHeader = ({ onLoadDemoFiles, fileCount, isDemoMode }: VaultHeaderProps) => {
  return (
    <div className="relative bg-dark-800/80 border border-dark-700 rounded-xl p-6 overflow-hidden backdrop-blur-sm shadow-xl">
      {/* Subtle grid backdrop */}
      <div className="absolute inset-0 bg-[radial-gradient(#1f2937_1px,transparent_1px)] [background-size:16px_16px] opacity-25 pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-2 max-w-3xl">
          {/* Badges */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-800/50 text-cyan-400 text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Evidence Processing & Hypotheses Generation</span>
            </div>

            <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider border ${
              isDemoMode
                ? 'bg-purple-950/80 text-purple-300 border-purple-800/80'
                : 'bg-amber-950/80 text-amber-300 border-amber-800/80'
            }`}>
              <span>{isDemoMode ? 'DEMO MODE: Official Telemetry Dataset' : 'EXPLORATION MODE: Custom Evidence'}</span>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-100 tracking-tight flex items-center gap-3">
            ECHO Evidence Vault
          </h1>

          {/* Subtitle */}
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            Upload disconnected security evidence. Let ECHO find the story hidden between the signals.
          </p>
        </div>

        {/* Quick Load Action */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
          <button
            onClick={onLoadDemoFiles}
            className="flex items-center justify-center gap-2.5 px-4 py-2.5 bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-slate-950 font-bold rounded-lg transition-all shadow-[0_0_15px_rgba(168,85,247,0.3)] hover:shadow-[0_0_20px_rgba(168,85,247,0.5)] cursor-pointer text-xs uppercase tracking-wider"
          >
            <FolderPlus className="w-4 h-4 fill-slate-950" />
            <span>Load 4 Official Demo PDFs</span>
          </button>

          <div className="px-3 py-2 bg-dark-900 border border-dark-700 rounded-lg text-xs font-mono text-center sm:text-left">
            <span className="text-slate-500 block text-[9px] uppercase">EVIDENCE LOADED</span>
            <span className="font-bold text-cyan-400 text-sm">{fileCount} Documents</span>
          </div>
        </div>
      </div>
    </div>
  );
};
