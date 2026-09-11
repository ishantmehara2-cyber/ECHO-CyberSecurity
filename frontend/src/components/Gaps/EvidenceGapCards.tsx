import { AlertTriangle, HelpCircle, ArrowRight } from 'lucide-react';
import { EvidenceGap } from '../../types/gap';

interface EvidenceGapCardsProps {
  onSelectGap: (gap: EvidenceGap) => void;
  customGaps?: any[];
}

export const EvidenceGapCards = ({ onSelectGap, customGaps }: EvidenceGapCardsProps) => {
  const gapsList = customGaps || [];

  return (
    <div className="space-y-4 font-sans">
      <div className="flex items-center justify-between">
        <h2 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-400" />
          Detected Potential Evidence Gaps ({gapsList.length})
        </h2>
        <span className="text-[11px] font-mono text-slate-500">
          Click any card to inspect full gap reasoning and collection steps.
        </span>
      </div>

      {gapsList.length === 0 && (
        <div className="p-6 bg-dark-800 border border-dark-700 rounded-xl text-slate-400 text-sm">
          No evidence gaps were identified from the current investigation data.
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {gapsList.map((gap, idx) => (
          <div
            key={gap.id || idx}
            onClick={() => onSelectGap(gap)}
            className="bg-dark-800 border border-amber-500/60 hover:border-amber-400 rounded-xl p-6 space-y-4 shadow-xl cursor-pointer transition-all hover:scale-[1.01] relative overflow-hidden group"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-dark-700 pb-3 font-mono text-xs">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-amber-950 text-amber-400 border border-amber-800 font-bold">
                  {gap.id || `GAP-0${idx + 1}`}
                </span>
                <span className="font-bold text-slate-200">{gap.expectedStage}</span>
              </div>

              <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase ${
                gap.priority === 'HIGH' ? 'bg-red-950 text-red-400 border border-red-800' : 'bg-amber-950 text-amber-400 border border-amber-800'
              }`}>
                {gap.priority || 'HIGH'} PRIORITY
              </span>
            </div>

            {/* Time Window & Surrounding Events */}
            <div className="grid grid-cols-2 gap-3 font-mono text-xs bg-dark-900 p-3 rounded-lg border border-dark-700">
              <div>
                <span className="text-[10px] text-slate-500 block uppercase font-bold">OBSERVED BEFORE</span>
                <span className="text-slate-300 font-bold">{gap.observedBefore}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block uppercase font-bold">OBSERVED AFTER</span>
                <span className="text-slate-300 font-bold">{gap.observedAfter}</span>
              </div>
            </div>

            {/* Why ECHO Flagged This */}
            <div className="space-y-1 font-sans text-xs">
              <span className="font-mono text-[10px] font-bold text-cyan-400 uppercase flex items-center gap-1">
                <HelpCircle className="w-3.5 h-3.5" /> WHY ECHO FLAGGED THIS:
              </span>
              <p className="text-slate-300 leading-relaxed">
                {gap.whyFlagged}
              </p>
            </div>

            {/* Recommended Evidence Source */}
            <div className="p-3 bg-dark-900 border border-dark-700 rounded-lg font-mono text-xs space-y-1">
              <span className="text-[10px] text-slate-500 block uppercase font-bold">RECOMMENDED DATA SOURCE</span>
              <span className="text-emerald-400 font-bold">{gap.recommendedSource}</span>
            </div>

            {/* Footer */}
            <div className="pt-3 border-t border-dark-700 flex items-center justify-between text-xs font-mono">
              <span className="text-slate-500">GAP CONFIDENCE: <strong className="text-amber-400">{gap.gapConfidence || 78}%</strong></span>
              <span className="text-cyan-400 font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                INSPECT ANALYST DETAILS <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
