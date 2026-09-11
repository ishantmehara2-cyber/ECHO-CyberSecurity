import {
  GitBranch,
  CheckCircle2,
  Clock,
  HelpCircle,
  ShieldCheck
} from 'lucide-react';
import { RECONSTRUCTED_ATTACK_STAGES } from '../../data/correlationEngine';

export const AttackSequenceTimeline = () => {
  return (
    <div className="bg-dark-800 border border-dark-700 rounded-xl p-6 space-y-6 shadow-xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-dark-700 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <GitBranch className="w-5 h-5 text-cyan-400" />
            <span className="text-xs font-mono font-bold text-cyan-400 uppercase">
              ECHO ATTACK RECONSTRUCTION ENGINE
            </span>
          </div>
          <h2 className="text-xl font-bold text-slate-100 mt-1">
            Reconstructed Multi-Stage Attack Sequence
          </h2>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 font-bold bg-emerald-950/80 px-3 py-1.5 rounded-lg border border-emerald-800">
          <ShieldCheck className="w-4 h-4" />
          <span>RECONSTRUCTION CONFIDENCE: 94%</span>
        </div>
      </div>

      {/* Chronological Attack Sequence List */}
      <div className="space-y-4">
        {RECONSTRUCTED_ATTACK_STAGES.map((stage) => (
          <div
            key={stage.stageNumber}
            className={`bg-dark-900 border rounded-xl p-5 space-y-3 transition-all relative overflow-hidden ${
              stage.severity === 'critical' ? 'border-red-600/80 shadow-[0_0_15px_rgba(239,68,68,0.15)]' :
              stage.severity === 'high' ? 'border-amber-600/80' :
              'border-dark-700'
            }`}
          >
            {/* Top Stage Title Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-dark-800 pb-3 font-mono text-xs">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-cyan-950 border border-cyan-500 text-cyan-400 font-bold flex items-center justify-center shrink-0">
                  0{stage.stageNumber}
                </span>
                <span className="font-bold text-slate-300 text-xs tracking-wider uppercase">
                  STAGE {stage.stageNumber}: {stage.stageName}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-cyan-400 font-bold flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> {stage.timestamp}
                </span>
                <span className="text-slate-400">{stage.source}</span>
                <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase ${
                  stage.riskLevel === 'CRITICAL' ? 'bg-red-950 text-red-400 border border-red-800' :
                  stage.riskLevel === 'HIGH' ? 'bg-amber-950 text-amber-400 border border-amber-800' :
                  'bg-blue-950 text-blue-400 border border-blue-800'
                }`}>
                  RISK: {stage.riskLevel}
                </span>
              </div>
            </div>

            {/* Event & Entity Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 font-mono text-xs">
              <div className="p-2.5 bg-dark-800 rounded border border-dark-700">
                <span className="text-slate-500 text-[10px] block uppercase font-bold">EVENT TITLE</span>
                <span className="text-slate-100 font-bold font-sans text-sm">{stage.eventTitle}</span>
              </div>

              <div className="p-2.5 bg-dark-800 rounded border border-dark-700">
                <span className="text-slate-500 text-[10px] block uppercase font-bold">RELATED ENTITY</span>
                <span className="text-purple-300 font-bold">{stage.entity}</span>
              </div>

              <div className="p-2.5 bg-dark-800 rounded border border-dark-700">
                <span className="text-slate-500 text-[10px] block uppercase font-bold">DEVICE / IP INDICATOR</span>
                <span className="text-blue-300 font-bold">{stage.ipOrDevice}</span>
              </div>
            </div>

            {/* CONNECTION EXPLANATION & CONFIDENCE REASONS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {/* Left 2 cols: Connection Explanation */}
              <div className="md:col-span-2 p-3 bg-cyan-950/40 border border-cyan-900/60 rounded-lg text-xs space-y-1 font-sans">
                <div className="font-bold text-cyan-300 flex items-center gap-1.5 font-mono text-[11px]">
                  <HelpCircle className="w-3.5 h-3.5 text-cyan-400" />
                  <span>CONNECTION EXPLANATION & REASONING</span>
                </div>
                <p className="text-slate-300 leading-relaxed">
                  {stage.connectionExplanation}
                </p>
              </div>

              {/* Right 1 col: Transparent Confidence Score */}
              <div className="p-3 bg-dark-800 border border-dark-700 rounded-lg text-xs font-mono space-y-1">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[10px] text-slate-500 font-bold uppercase">STAGE CONFIDENCE</span>
                  <span className="text-emerald-400 font-bold">{stage.confidenceScore}% HIGH</span>
                </div>

                <div className="space-y-1 text-[11px]">
                  {stage.confidenceReasons.map((r, i) => (
                    <div key={i} className="flex items-center gap-1 text-slate-400">
                      <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                      <span className="truncate">{r}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
