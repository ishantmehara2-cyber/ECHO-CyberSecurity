import { CheckCircle2, HelpCircle, ArrowRight, Sparkles } from 'lucide-react';
import { PATH_COMPLETION_STAGES } from '../../data/gapDetectionEngine';
import { EvidenceGap } from '../../types/gap';

interface AttackPathCompletionProps {
  onSelectGap?: (gap: EvidenceGap) => void;
}

export const AttackPathCompletion = ({ onSelectGap }: AttackPathCompletionProps) => {
  return (
    <div className="bg-dark-800 border border-dark-700 rounded-xl p-6 space-y-6 shadow-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-dark-700 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-mono font-bold text-cyan-400 uppercase">
              ECHO ATTACK PATH COMPLETION & GAP REASONING
            </span>
          </div>
          <h2 className="text-xl font-bold text-slate-100 mt-1">
            Observed Evidence vs. Potential Evidence Gaps
          </h2>
        </div>

        <div className="text-xs font-mono text-slate-400 bg-dark-900 border border-dark-700 px-3 py-1.5 rounded-lg">
          <span className="text-emerald-400 font-bold">4 OBSERVED</span> • <span className="text-amber-400 font-bold">1 POTENTIAL GAP</span>
        </div>
      </div>

      {/* Visual Pipeline Flow */}
      <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 font-mono text-xs relative">
        {PATH_COMPLETION_STAGES.map((st, idx) => (
          <div
            key={st.id}
            onClick={() => st.isGap && st.gapInfo && onSelectGap && onSelectGap(st.gapInfo)}
            className={`p-4 rounded-xl border flex flex-col justify-between transition-all relative ${
              st.isObserved
                ? 'bg-dark-900 border-emerald-900/80 shadow-[0_0_10px_rgba(16,185,129,0.1)]'
                : 'bg-amber-950/30 border-amber-500/80 cursor-pointer hover:border-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.2)]'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold text-slate-500">0{idx + 1}</span>
                {st.isObserved ? (
                  <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> OBSERVED
                  </span>
                ) : (
                  <span className="text-[10px] font-bold text-amber-400 flex items-center gap-1 animate-pulse">
                    <HelpCircle className="w-3.5 h-3.5" /> POSSIBLE GAP
                  </span>
                )}
              </div>

              <h3 className={`text-xs font-bold font-sans tracking-wide mb-2 ${
                st.isObserved ? 'text-slate-100' : 'text-amber-300'
              }`}>
                {st.stageName}
              </h3>

              <p className="text-[11px] text-slate-400 font-sans leading-snug">
                {st.observedDetail}
              </p>
            </div>

            {st.isGap && (
              <div className="mt-3 pt-2 border-t border-amber-900/60 text-[10px] text-amber-400 font-bold flex items-center justify-between">
                <span>INSPECT GAP</span>
                <ArrowRight className="w-3 h-3" />
              </div>
            )}

            {idx < 4 && (
              <ArrowRight className="hidden sm:block absolute -right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-600 z-10" />
            )}
          </div>
        ))}
      </div>

      {/* Legend Banner */}
      <div className="p-3 bg-dark-900 border border-dark-700 rounded-lg text-xs font-mono text-slate-400 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
            <CheckCircle2 className="w-3.5 h-3.5" /> Observed Telemetry Evidence
          </span>
          <span className="flex items-center gap-1.5 text-amber-400 font-bold">
            <HelpCircle className="w-3.5 h-3.5" /> Possible Evidence Gap (Not Found in Available Logs)
          </span>
        </div>
        <span className="text-slate-500">Note: Missing telemetry does not imply the event did not happen.</span>
      </div>
    </div>
  );
};
