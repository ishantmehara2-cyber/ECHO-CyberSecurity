import { CheckCircle2, Clock, Activity } from 'lucide-react';
import { InvestigationStage } from '../../types/vault';

interface InvestigationProgressTrackerProps {
  currentStage: InvestigationStage;
  onSelectStage?: (stage: InvestigationStage) => void;
}

export const InvestigationProgressTracker = ({ currentStage, onSelectStage }: InvestigationProgressTrackerProps) => {
  const stages: { key: InvestigationStage; label: string }[] = [
    { key: 'ingestion', label: 'DOCUMENTS INGESTED' },
    { key: 'extraction', label: 'ENTITIES EXTRACTED' },
    { key: 'discovery', label: 'CANDIDATE DISCOVERY' },
    { key: 'correlation', label: 'CORRELATION GRAPH' },
    { key: 'timeline', label: 'INCIDENT TIMELINE' },
    { key: 'reconstruction', label: 'ATTACK RECONSTRUCTION' },
  ];

  const getStageIndex = (stageKey: string): number => {
    switch (stageKey) {
      case 'ingestion': return 1;
      case 'extraction': return 2;
      case 'discovery': return 3;
      case 'correlation': return 4;
      case 'timeline': return 5;
      case 'reconstruction':
      case 'complete': return 6;
      default: return 0;
    }
  };

  const currentIndex = getStageIndex(currentStage);

  return (
    <div className="bg-dark-800 border border-cyan-800/80 rounded-xl p-4 shadow-xl mb-6 font-sans">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-3 border-b border-dark-700/80 pb-2 font-mono">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-cyan-400" />
          <span className="text-xs font-bold text-slate-100 uppercase tracking-wider">
            INVESTIGATION PROGRESS STATUS
          </span>
        </div>

        <div className="text-xs text-cyan-400 font-bold flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          <span>
            {currentStage === 'complete' ? 'INVESTIGATION COMPLETE' : `STAGE ${currentIndex} OF 6 IN PROGRESS`}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 text-xs font-mono">
        {stages.map((st, idx) => {
          const stageNum = idx + 1;
          const isDone = currentIndex > stageNum || currentStage === 'complete';
          const isCurrent = currentIndex === stageNum && currentStage !== 'complete';

          return (
            <button
              key={st.key}
              onClick={() => {
                if (onSelectStage && (isDone || isCurrent)) {
                  onSelectStage(st.key);
                }
              }}
              disabled={!isDone && !isCurrent}
              className={`p-2.5 rounded-lg border transition-all flex items-center gap-2 text-left ${
                isDone || isCurrent ? 'cursor-pointer hover:scale-[1.02]' : 'cursor-not-allowed opacity-50'
              } ${
                isDone
                  ? 'bg-emerald-950/60 border-emerald-800 text-emerald-400 font-bold'
                  : isCurrent
                  ? 'bg-cyan-950/80 border-cyan-500 text-cyan-300 font-bold shadow-[0_0_10px_rgba(6,182,212,0.2)]'
                  : 'bg-dark-900/60 border-dark-700 text-slate-500'
              }`}
            >
              {isDone ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              ) : isCurrent ? (
                <Clock className="w-4 h-4 text-cyan-400 animate-spin shrink-0" />
              ) : (
                <span className="w-4 h-4 rounded-full border border-dark-600 flex items-center justify-center text-[10px] text-slate-600 shrink-0">
                  {stageNum}
                </span>
              )}

              <span className="text-[11px] truncate tracking-tight">{st.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
