import { X, AlertTriangle, ShieldCheck, HelpCircle } from 'lucide-react';
import { EvidenceGap } from '../../types/gap';

interface GapDetailModalProps {
  gap: EvidenceGap | null;
  onClose: () => void;
}

export const GapDetailModal = ({ gap, onClose }: GapDetailModalProps) => {
  if (!gap) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-fade-in">
      <div className="bg-dark-900 border border-amber-500/80 rounded-2xl w-full max-w-2xl p-6 space-y-5 shadow-2xl relative overflow-hidden font-sans">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-dark-800 pb-3">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-950 text-amber-400 border border-amber-800 font-mono">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 font-mono">
                <span className="text-xs font-bold text-amber-400 uppercase">
                  EVIDENCE GAP INSPECTOR // {gap.id}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-red-950 text-red-400 border border-red-800 font-bold uppercase">
                  {gap.priority} PRIORITY
                </span>
              </div>
              <h2 className="text-lg font-bold text-slate-100 font-mono">
                {gap.expectedStage}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-dark-800 text-slate-400 hover:text-slate-100 border border-dark-700 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="space-y-4 text-xs leading-relaxed">
          {/* Surrounding Context */}
          <div className="grid grid-cols-2 gap-3 font-mono bg-dark-800 p-3 rounded-xl border border-dark-700">
            <div>
              <span className="text-[10px] text-slate-500 block uppercase font-bold">OBSERVED BEFORE</span>
              <span className="text-slate-200 font-bold">{gap.observedBefore}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 block uppercase font-bold">OBSERVED AFTER</span>
              <span className="text-slate-200 font-bold">{gap.observedAfter}</span>
            </div>
          </div>

          {/* Why ECHO Expects It */}
          <div className="p-4 bg-dark-800 border border-dark-700 rounded-xl space-y-1.5">
            <span className="font-mono text-[10px] font-bold text-cyan-400 uppercase flex items-center gap-1.5">
              <HelpCircle className="w-4 h-4" /> WHY ECHO EXPECTS THIS EVIDENCE
            </span>
            <p className="text-slate-300">
              {gap.whyFlagged}
            </p>
          </div>

          {/* Recommended Next Evidence */}
          <div className="p-4 bg-dark-800 border border-dark-700 rounded-xl space-y-1.5">
            <span className="font-mono text-[10px] font-bold text-emerald-400 uppercase flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" /> RECOMMENDED NEXT DATA SOURCE
            </span>
            <div className="font-mono font-bold text-slate-100 text-sm">{gap.recommendedSource}</div>
            <p className="text-slate-300 text-xs">
              {gap.whyRecommended}
            </p>
          </div>

          {/* Related Entities */}
          <div className="p-3 bg-dark-800 border border-dark-700 rounded-xl font-mono text-xs space-y-1">
            <span className="text-[10px] text-slate-500 uppercase font-bold block">TARGET ENTITIES AFFECTED</span>
            <div className="flex flex-wrap gap-1.5">
              {gap.relatedEntities.map((ent, i) => (
                <span key={i} className="px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800 font-bold">
                  {ent}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-dark-800 border-t border-dark-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold rounded-lg text-xs font-mono transition-colors cursor-pointer uppercase"
          >
            Acknowledge Gap Analysis
          </button>
        </div>
      </div>
    </div>
  );
};
