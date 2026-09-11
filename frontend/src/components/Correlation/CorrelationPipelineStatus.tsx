import { CheckCircle2, Cpu, Sparkles } from 'lucide-react';
import { PIPELINE_ANALYSIS_STEPS } from '../../data/correlationEngine';

export const CorrelationPipelineStatus = () => {
  return (
    <div className="bg-dark-800 border border-dark-700 rounded-xl p-5 shadow-lg space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-dark-700 pb-3">
        <div className="flex items-center gap-2">
          <Cpu className="w-4 h-4 text-cyan-400" />
          <h2 className="text-xs font-mono font-bold text-slate-100 uppercase tracking-wider">
            REAL-TIME CORRELATION ANALYSIS PIPELINE
          </h2>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-emerald-400">
          <Sparkles className="w-3.5 h-3.5" />
          <span>ALL 10 PIPELINE STAGES VERIFIED</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5 text-xs font-mono">
        {PIPELINE_ANALYSIS_STEPS.map((step, idx) => (
          <div
            key={step.id}
            className="p-2.5 rounded-lg bg-dark-900 border border-emerald-900/60 flex items-center justify-between gap-2"
          >
            <div className="flex items-center gap-2 truncate">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span className="text-slate-300 text-[11px] truncate">{step.label}</span>
            </div>
            <span className="text-[10px] text-emerald-400 font-bold shrink-0">0{idx + 1}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
