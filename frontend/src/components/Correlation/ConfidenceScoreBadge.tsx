import { ShieldCheck, CheckCircle2 } from 'lucide-react';
import { ConfidenceLevel } from '../../types/correlation';

interface ConfidenceScoreBadgeProps {
  score: number;
  level?: ConfidenceLevel;
  reasons?: string[];
  showDetails?: boolean;
}

export const ConfidenceScoreBadge = ({
  score,
  level = 'HIGH',
  reasons = [],
  showDetails = true
}: ConfidenceScoreBadgeProps) => {
  const isHigh = score >= 85;
  const isMedium = score >= 60 && score < 85;

  return (
    <div className="space-y-2">
      <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-lg border font-mono text-xs font-bold ${
        isHigh
          ? 'bg-emerald-950/80 text-emerald-400 border-emerald-800'
          : isMedium
          ? 'bg-amber-950/80 text-amber-400 border-amber-800'
          : 'bg-slate-800 text-slate-400 border-slate-700'
      }`}>
        <ShieldCheck className="w-4 h-4" />
        <span>{score}% {level} CONFIDENCE</span>
      </div>

      {showDetails && reasons.length > 0 && (
        <div className="p-3 bg-dark-900 border border-dark-700 rounded-lg text-xs font-mono space-y-1.5">
          <span className="text-[10px] text-slate-500 block uppercase font-bold">CONFIDENCE WEIGHT REASONS</span>
          {reasons.map((r, i) => (
            <div key={i} className="flex items-center gap-1.5 text-slate-300 text-[11px]">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>{r}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
