import { X, ShieldAlert, ShieldCheck, CheckCircle2, Zap, HelpCircle } from 'lucide-react';
import { InvestigationCandidate } from '../../types/candidates';

interface CandidateDetailModalProps {
  candidate: InvestigationCandidate | null;
  onClose: () => void;
  onSelectForInvestigation: (candidate: InvestigationCandidate) => void;
}

export const CandidateDetailModal = ({
  candidate,
  onClose,
  onSelectForInvestigation
}: CandidateDetailModalProps) => {
  if (!candidate) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-fade-in font-sans">
      <div className="bg-dark-900 border border-cyan-500/80 rounded-2xl w-full max-w-3xl p-6 space-y-5 shadow-2xl relative overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-dark-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-950 border border-cyan-500 text-cyan-400 font-mono font-extrabold flex items-center justify-center text-sm">
              #{candidate.rank}
            </div>
            <div>
              <div className="flex items-center gap-2 font-mono">
                <span className="text-xs font-bold text-cyan-400 uppercase">
                  INVESTIGATION CANDIDATE PROFILE
                </span>
                <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${
                  candidate.riskLevel === 'HIGH' ? 'bg-red-950 text-red-400 border border-red-800' :
                  candidate.riskLevel === 'MEDIUM-HIGH' ? 'bg-amber-950 text-amber-400 border border-amber-800' :
                  'bg-blue-950 text-blue-400 border border-blue-800'
                }`}>
                  {candidate.riskLevel} RISK
                </span>
              </div>
              <h2 className="text-xl font-bold text-slate-100 font-mono mt-0.5">
                {candidate.entityName} ({candidate.entityType.toUpperCase()})
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

        {/* Quantified Scores Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs text-center">
          <div className="p-3 bg-dark-800 border border-dark-700 rounded-xl">
            <span className="text-slate-500 text-[10px] block uppercase font-bold">RISK SCORE</span>
            <span className="text-amber-400 font-extrabold text-base">{candidate.riskScore} / 100</span>
          </div>

          <div className="p-3 bg-dark-800 border border-dark-700 rounded-xl">
            <span className="text-slate-500 text-[10px] block uppercase font-bold">CORRELATION CONFIDENCE</span>
            <span className="text-emerald-400 font-extrabold text-base">{candidate.correlationConfidence}%</span>
          </div>

          <div className="p-3 bg-dark-800 border border-dark-700 rounded-xl">
            <span className="text-slate-500 text-[10px] block uppercase font-bold">SOURCES INVOLVED</span>
            <span className="text-purple-300 font-bold text-xs">{candidate.sourcesInvolved.length} Silos</span>
          </div>

          <div className="p-3 bg-dark-800 border border-dark-700 rounded-xl">
            <span className="text-slate-500 text-[10px] block uppercase font-bold">RELATED EVENTS</span>
            <span className="text-cyan-400 font-bold text-xs">{candidate.eventCount} Events</span>
          </div>
        </div>

        {/* Score Explanations (Risk vs Confidence) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
          {/* Risk Score Breakdown */}
          <div className="p-4 bg-dark-800 border border-amber-900/60 rounded-xl space-y-2">
            <span className="text-amber-400 font-bold uppercase text-[11px] flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4" /> RISK SCORE BREAKDOWN ({candidate.riskScore}/100)
            </span>
            <div className="space-y-1.5 text-[11px]">
              {candidate.scoreBreakdown
                ? Object.entries(candidate.scoreBreakdown).map(([key, category]) => (
                    <div key={key} className="flex justify-between items-start text-slate-300">
                      <span className="text-slate-400 truncate pr-2 font-sans">
                        • {key.replace(/_/g, ' ')}
                        <span className="text-slate-500"> ({category.evidence_count || 0} evidence)</span>
                      </span>
                      <span className="text-amber-400 font-bold shrink-0">
                        +{category.points}/{category.max_points}
                      </span>
                    </div>
                  ))
                : candidate.riskBreakdown.map((r, i) => (
                    <div key={i} className="flex justify-between items-start text-slate-300">
                      <span className="text-slate-400 truncate pr-2 font-sans">• {r.factor || r.signal}</span>
                      <span className="text-amber-400 font-bold shrink-0">+{r.points}</span>
                    </div>
                  ))}
            </div>
          </div>

          {/* Correlation Confidence Breakdown */}
          <div className="p-4 bg-dark-800 border border-emerald-900/60 rounded-xl space-y-2">
            <span className="text-emerald-400 font-bold uppercase text-[11px] flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" /> CORRELATION CONFIDENCE BREAKDOWN ({candidate.correlationConfidence}%)
            </span>
            <div className="space-y-1.5 text-[11px]">
              {candidate.confidenceBreakdown.map((c, i) => (
                <div key={i} className="flex justify-between items-start text-slate-300">
                  <span className="text-slate-400 truncate pr-2 font-sans">• {c.signal}</span>
                  <span className="text-emerald-400 font-bold shrink-0">+{c.points}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Why Flagged Checklist */}
        <div className="p-4 bg-dark-800 border border-dark-700 rounded-xl space-y-2 font-sans text-xs">
          <span className="font-mono text-[10px] font-bold text-cyan-400 uppercase flex items-center gap-1.5">
            <HelpCircle className="w-4 h-4" /> WHY WAS THIS CANDIDATE FLAGGED?
          </span>
          <ul className="space-y-1 text-slate-300">
            {candidate.whyFlagged.map((w, i) => (
              <li key={i} className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span>{w}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Action Footer */}
        <div className="p-4 bg-dark-800 border-t border-dark-800 flex justify-end gap-3 font-mono">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-dark-900 hover:bg-dark-700 text-slate-300 border border-dark-700 rounded-lg text-xs font-mono transition-colors cursor-pointer"
          >
            CLOSE PROFILE
          </button>

          <button
            onClick={() => {
              onSelectForInvestigation(candidate);
              onClose();
            }}
            className="flex items-center gap-2 px-5 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold rounded-lg text-xs font-mono transition-all shadow-[0_0_15px_rgba(6,182,212,0.3)] cursor-pointer uppercase tracking-wider"
          >
            <Zap className="w-4 h-4 fill-slate-950" />
            <span>SELECT FOR DEEP INVESTIGATION</span>
          </button>
        </div>
      </div>
    </div>
  );
};
