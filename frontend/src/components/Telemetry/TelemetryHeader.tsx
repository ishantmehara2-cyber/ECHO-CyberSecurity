import { Play, Pause, RotateCcw, Sparkles, Trash2 } from 'lucide-react';

interface TelemetryHeaderProps {
  isStreaming: boolean;
  isPaused: boolean;
  eventCount: number;
  onStartDemo: () => void;
  onPause: () => void;
  onResume: () => void;
  onClear: () => void;
}

export const TelemetryHeader = ({
  isStreaming,
  isPaused,
  eventCount,
  onStartDemo,
  onPause,
  onResume,
  onClear,
}: TelemetryHeaderProps) => {
  return (
    <div className="relative bg-dark-800/80 border border-dark-700 rounded-xl p-6 overflow-hidden backdrop-blur-sm">
      {/* Subtle grid backdrop */}
      <div className="absolute inset-0 bg-[radial-gradient(#1f2937_1px,transparent_1px)] [background-size:16px_16px] opacity-25 pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-800/50 text-cyan-400 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Telemetry Simulation — Current Investigation Events</span>
          </div>

          {/* Title */}
          <h1 className="text-3xl font-extrabold text-slate-100 tracking-tight flex items-center gap-3">
            Multi-Source Telemetry Ingestion
          </h1>

          {/* Subtitle */}
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            Simulated streaming view for demonstration using the current investigation's normalized events.
          </p>
        </div>

        {/* Controls and Status */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {/* Stream Status pill */}
          <div className="flex items-center gap-2 px-3 py-2 bg-dark-900 border border-dark-700 rounded-lg text-xs font-mono">
            <div className={`w-2.5 h-2.5 rounded-full ${
              isStreaming && !isPaused ? 'bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.6)]' :
              isPaused ? 'bg-amber-400' :
              'bg-slate-500'
            }`} />
            <span className="text-slate-300 font-bold">
              {isStreaming && !isPaused ? 'STREAMING LIVE' : isPaused ? 'STREAM PAUSED' : 'STREAM STANDBY'}
            </span>
            <span className="text-slate-500 border-l border-dark-700 pl-2 ml-1">
              {eventCount} Events
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            {!isStreaming ? (
              <button
                onClick={onStartDemo}
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold rounded-lg transition-all shadow-[0_0_15px_rgba(6,182,212,0.3)] hover:shadow-[0_0_20px_rgba(6,182,212,0.5)] cursor-pointer text-xs"
              >
                <Play className="w-4 h-4 fill-slate-950" />
                <span>RUN TELEMETRY SIMULATION</span>
              </button>
            ) : isPaused ? (
              <button
                onClick={onResume}
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold rounded-lg transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)] cursor-pointer text-xs"
              >
                <Play className="w-4 h-4 fill-slate-950" />
                <span>RESUME STREAM</span>
              </button>
            ) : (
              <button
                onClick={onPause}
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold rounded-lg transition-all cursor-pointer text-xs"
              >
                <Pause className="w-4 h-4 fill-slate-950" />
                <span>PAUSE STREAM</span>
              </button>
            )}

            <button
              onClick={onStartDemo}
              title="Restart Demo"
              className="p-2 bg-dark-700 hover:bg-dark-600 text-slate-300 rounded-lg border border-dark-600 cursor-pointer transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <button
              onClick={onClear}
              title="Clear View"
              className="p-2 bg-dark-700 hover:bg-dark-600 text-slate-300 rounded-lg border border-dark-600 cursor-pointer transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
