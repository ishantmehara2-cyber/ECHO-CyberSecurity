import { X, ArrowRightLeft, Shield, FileCode2, CheckCircle2 } from 'lucide-react';
import { TelemetryEvent } from '../../types/telemetry';

interface NormalizationPreviewProps {
  event: TelemetryEvent | null;
  onClose?: () => void;
}

export const NormalizationPreview = ({ event, onClose }: NormalizationPreviewProps) => {
  if (!event) {
    return (
      <div className="bg-dark-800 border border-dark-700 rounded-xl p-6 text-center text-slate-500 font-mono text-xs space-y-2">
        <ArrowRightLeft className="w-8 h-8 text-dark-600 mx-auto" />
        <p className="text-slate-400 font-sans text-sm font-semibold">No Telemetry Event Selected</p>
        <p>Click any event in the Live Telemetry Stream below to inspect raw vs. normalized schema mapping.</p>
      </div>
    );
  }

  return (
    <div className="bg-dark-800 border border-cyan-800/80 rounded-xl p-6 shadow-2xl space-y-4 relative">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-dark-700 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-cyan-950 text-cyan-400 border border-cyan-800">
            <ArrowRightLeft className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-cyan-400 uppercase">
                {event.source} TELEMETRY NORMALIZATION
              </span>
              {event.isAttackSequence && (
                <span className="text-[10px] font-mono px-2 py-0.5 bg-red-950 text-red-400 border border-red-800 rounded font-bold">
                  ATTACK SEQUENCE EVENT
                </span>
              )}
            </div>
            <h3 className="text-base font-bold text-slate-100 mt-0.5">
              {event.title} ({event.timestamp})
            </h3>
          </div>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="self-end sm:self-auto p-1.5 rounded-lg bg-dark-900 text-slate-400 hover:text-slate-200 border border-dark-700 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Comparison Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* LEFT: Raw Source Event */}
        <div className="bg-dark-900 border border-dark-700 rounded-lg p-4 font-mono text-xs flex flex-col">
          <div className="flex items-center justify-between mb-3 text-slate-400 border-b border-dark-800 pb-2">
            <span className="flex items-center gap-1.5 font-bold text-amber-400">
              <FileCode2 className="w-4 h-4" /> RAW UNSTRUCTURED SOURCE LOG
            </span>
            <span className="text-[10px] text-slate-500 uppercase">Vendor Format</span>
          </div>

          <pre className="flex-1 bg-dark-950 p-3 rounded border border-dark-800/80 text-amber-300/90 overflow-x-auto text-[11px] leading-relaxed">
            {JSON.stringify(event.rawData, null, 2)}
          </pre>
        </div>

        {/* RIGHT: Normalized ECHO Event */}
        <div className="bg-dark-900 border border-cyan-900/60 rounded-lg p-4 font-mono text-xs flex flex-col">
          <div className="flex items-center justify-between mb-3 text-slate-400 border-b border-dark-800 pb-2">
            <span className="flex items-center gap-1.5 font-bold text-emerald-400">
              <Shield className="w-4 h-4" /> UNIFIED ECHO SCHEMA
            </span>
            <span className="text-[10px] px-2 py-0.5 bg-emerald-950 text-emerald-400 rounded border border-emerald-800 font-bold">
              STANDARDIZED
            </span>
          </div>

          <pre className="flex-1 bg-dark-950 p-3 rounded border border-emerald-900/40 text-emerald-300/90 overflow-x-auto text-[11px] leading-relaxed">
            {JSON.stringify(event.normalizedData, null, 2)}
          </pre>
        </div>
      </div>

      {/* Explanation Banner */}
      <div className="p-3 bg-cyan-950/40 border border-cyan-900/60 rounded-lg text-xs text-slate-300 flex items-center gap-2 font-sans">
        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
        <span>
          <strong className="text-cyan-300">How ECHO Normalizes:</strong> Vendor-specific keys (e.g., <code className="text-amber-300 font-mono">login_user</code>, <code className="text-amber-300 font-mono">proc_owner</code>) are standard mapped into ECHO fields (<code className="text-emerald-300 font-mono">entity_user</code>, <code className="text-emerald-300 font-mono">entity_device</code>, <code className="text-emerald-300 font-mono">entity_ip</code>) to enable multi-vector entity correlation.
        </span>
      </div>
    </div>
  );
};
