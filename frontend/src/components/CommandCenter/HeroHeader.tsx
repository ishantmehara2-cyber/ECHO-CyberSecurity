import { Network, Sparkles } from 'lucide-react';

export const HeroHeader = () => {
  return (
    <div className="relative bg-dark-800/80 border border-dark-700 rounded-xl p-6 lg:p-8 overflow-hidden backdrop-blur-sm">
      {/* Visual background grid pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#1f2937_1px,transparent_1px)] [background-size:16px_16px] opacity-30 pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-3 max-w-2xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-800/50 text-cyan-400 text-xs font-semibold tracking-wider uppercase">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Evidence-Centric Investigation Platform</span>
          </div>

          {/* Title */}
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-100 tracking-tight flex items-center gap-3">
            ECHO COMMAND CENTER
          </h1>

          {/* Subtitle */}
          <p className="text-slate-400 text-base sm:text-lg leading-relaxed">
            Transforming disconnected security telemetry into an explainable investigation.
          </p>
        </div>

        {/* Visual Concept: Connect The Dots */}
        <div className="flex flex-col items-end justify-center bg-dark-900/60 border border-dark-700/80 rounded-lg p-4 min-w-[240px]">
          <div className="text-xs font-mono font-semibold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-1.5">
            <Network className="w-4 h-4 text-cyan-400" />
            <span>Connect The Dots</span>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex flex-col items-center">
              <div className="w-3 h-3 rounded-full bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.6)]" />
              <span className="text-[10px] font-mono text-slate-500 mt-1">AUTH</span>
            </div>
            <div className="w-8 h-[2px] bg-gradient-to-r from-purple-500 via-cyan-500 to-blue-500 animate-pulse" />
            <div className="flex flex-col items-center">
              <div className="w-3 h-3 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.6)]" />
              <span className="text-[10px] font-mono text-slate-500 mt-1">ENDPOINT</span>
            </div>
            <div className="w-8 h-[2px] bg-gradient-to-r from-blue-500 via-cyan-500 to-emerald-500 animate-pulse" />
            <div className="flex flex-col items-center">
              <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
              <span className="text-[10px] font-mono text-slate-500 mt-1">NETWORK</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
