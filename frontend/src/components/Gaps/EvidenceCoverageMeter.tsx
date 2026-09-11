import { ShieldCheck, Info } from 'lucide-react';
import { COVERAGE_SUMMARY_METRICS } from '../../data/gapDetectionEngine';

export const EvidenceCoverageMeter = () => {
  const metrics = COVERAGE_SUMMARY_METRICS;

  return (
    <div className="bg-dark-800 border border-dark-700 rounded-xl p-6 shadow-xl space-y-5">
      {/* Top Header & Meter Score */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-dark-700 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-cyan-400" />
            <span className="text-xs font-mono font-bold text-cyan-400 uppercase">
              ECHO EVIDENCE COVERAGE METRIC
            </span>
          </div>
          <h2 className="text-xl font-bold text-slate-100 mt-1">
            Telemetry Completeness Assessment
          </h2>
        </div>

        {/* Score Badge */}
        <div className="px-4 py-2.5 bg-dark-900 border border-cyan-500/60 rounded-xl font-mono text-center shrink-0">
          <span className="text-slate-500 block text-[10px] uppercase font-bold">AVAILABLE EVIDENCE COVERAGE</span>
          <span className="text-cyan-400 font-extrabold text-xl">{metrics.overallCoverageScore}%</span>
        </div>
      </div>

      {/* Source-by-Source Breakdown */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.sources.map((src) => (
          <div key={src.sourceName} className="bg-dark-900 border border-dark-700 rounded-xl p-4 space-y-3">
            <div className="flex justify-between items-center text-xs font-mono">
              <span className="font-bold text-slate-200">{src.sourceName}</span>
              <span className={`font-bold ${
                src.percentage === 100 ? 'text-emerald-400' :
                src.percentage >= 50 ? 'text-amber-400' :
                'text-red-400'
              }`}>
                {src.percentage}%
              </span>
            </div>

            {/* Progress Bar */}
            <div className="h-2 bg-dark-950 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-500 ${
                  src.percentage === 100 ? 'bg-emerald-400' :
                  src.percentage >= 50 ? 'bg-amber-400' :
                  'bg-red-400'
                }`}
                style={{ width: `${src.percentage}%` }}
              />
            </div>

            <p className="text-[11px] text-slate-400 font-sans leading-snug">
              {src.description}
            </p>
          </div>
        ))}
      </div>

      {/* Footer Explanation Note */}
      <div className="p-3 bg-dark-900/80 border border-dark-700 rounded-lg text-xs text-slate-400 font-mono flex items-center gap-2">
        <Info className="w-4 h-4 text-cyan-400 shrink-0" />
        <span>
          Coverage represents how much supporting evidence was available for the reconstructed attack sequence.
        </span>
      </div>
    </div>
  );
};
