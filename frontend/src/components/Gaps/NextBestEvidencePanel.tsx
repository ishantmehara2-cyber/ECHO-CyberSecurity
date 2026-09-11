import { Sparkles, ShieldCheck } from 'lucide-react';
import { DETECTED_EVIDENCE_GAPS } from '../../data/gapDetectionEngine';

export const NextBestEvidencePanel = () => {
  return (
    <div className="bg-dark-800 border border-dark-700 rounded-xl p-6 shadow-xl space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-dark-700 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-mono font-bold text-cyan-400 uppercase">
              RECOMMENDED DATA COLLECTION STEPS
            </span>
          </div>
          <h2 className="text-xl font-bold text-slate-100 mt-1">
            ECHO Next Best Evidence Recommendations
          </h2>
        </div>

        <span className="text-xs font-mono px-3 py-1 bg-emerald-950 text-emerald-400 border border-emerald-800 rounded-lg font-bold">
          TARGETED COLLECTION GUIDE
        </span>
      </div>

      <div className="space-y-4">
        {DETECTED_EVIDENCE_GAPS.map((gap, idx) => (
          <div key={gap.id} className="bg-dark-900 border border-dark-700 rounded-xl p-5 space-y-3 font-mono text-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-dark-800 pb-2">
              <span className="font-bold text-cyan-400 text-sm">
                RECOMMENDATION #{idx + 1}: {gap.recommendedSource}
              </span>
              <span className="text-amber-400 font-bold bg-amber-950 px-2 py-0.5 rounded border border-amber-800">
                ADDRESSES {gap.id}
              </span>
            </div>

            <div className="space-y-1 font-sans">
              <span className="font-mono text-[10px] font-bold text-slate-500 uppercase block">
                WHY THIS DATA SOURCE?
              </span>
              <p className="text-slate-300 text-xs leading-relaxed">
                {gap.whyRecommended}
              </p>
            </div>

            <div className="p-3 bg-dark-800 rounded border border-dark-700 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
              <span className="text-slate-400 font-sans">
                Target Entities: <strong className="text-purple-300 font-mono">{gap.relatedEntities.join(', ')}</strong>
              </span>
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <ShieldCheck className="w-4 h-4" /> EXPECTED CONFIDENCE GAIN: +15%
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
