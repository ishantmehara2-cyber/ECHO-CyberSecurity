import { useState } from 'react';
import { ShieldCheck, AlertTriangle, FileCheck, CheckCircle2, RefreshCw } from 'lucide-react';

interface AnalystDecisionPanelProps {
  onDecisionMade?: (decision: string) => void;
  candidateName?: string;
}

export const AnalystDecisionPanel = ({
  onDecisionMade,
  candidateName = 'employee_07'
}: AnalystDecisionPanelProps) => {
  const [decision, setDecision] = useState<string | null>(null);

  const handleSelectDecision = (choice: string) => {
    setDecision(choice);
    if (onDecisionMade) {
      onDecisionMade(choice);
    }
  };

  return (
    <div className="bg-dark-800 border border-cyan-500/80 rounded-2xl p-6 shadow-2xl space-y-5 font-sans relative overflow-hidden">
      {/* Background Accent */}
      <div className="absolute inset-0 bg-[radial-gradient(#06b6d4_1px,transparent_1px)] [background-size:24px_24px] opacity-15 pointer-events-none" />

      <div className="relative z-10 space-y-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-dark-700 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-cyan-400" />
              <span className="text-xs font-mono font-bold text-cyan-400 uppercase">
                FINAL STAGE 07 // ANALYST DECISION WORKFLOW
              </span>
            </div>
            <h2 className="text-xl font-bold text-slate-100 font-mono mt-0.5">
              SOC Analyst Incident Determination
            </h2>
          </div>

          <div className="px-3 py-1 bg-dark-900 border border-cyan-800 rounded-lg text-xs font-mono font-bold text-emerald-400">
            {decision ? `STATUS: ${decision.toUpperCase()}` : 'STATUS: AWAITING DECISION'}
          </div>
        </div>

        <p className="text-xs text-slate-300 font-sans leading-relaxed">
          ECHO has completed automated cross-silo telemetry correlation and attack hypothesis reconstruction for <strong className="text-cyan-300 font-mono">{candidateName}</strong>. Review the evidence and select an analyst decision:
        </p>

        {/* 4 Decision Options */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 font-mono text-xs">
          <button
            onClick={() => handleSelectDecision('Escalated to Tier-2 SOC')}
            className={`p-4 rounded-xl border text-left transition-all cursor-pointer space-y-1.5 ${
              decision === 'Escalated to Tier-2 SOC'
                ? 'bg-red-950/80 text-red-300 border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.3)]'
                : 'bg-dark-900 text-slate-300 border-dark-700 hover:border-red-500/80'
            }`}
          >
            <div className="flex items-center gap-1.5 font-bold text-red-400 text-xs">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>CONFIRM ESCALATION</span>
            </div>
            <p className="text-[11px] text-slate-400 font-sans leading-snug">
              Escalate incident to Tier-2 Incident Response for credential revocation & endpoint containment.
            </p>
          </button>

          <button
            onClick={() => handleSelectDecision('Evidence Collection Required')}
            className={`p-4 rounded-xl border text-left transition-all cursor-pointer space-y-1.5 ${
              decision === 'Evidence Collection Required'
                ? 'bg-amber-950/80 text-amber-300 border-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.3)]'
                : 'bg-dark-900 text-slate-300 border-dark-700 hover:border-amber-500/80'
            }`}
          >
            <div className="flex items-center gap-1.5 font-bold text-amber-400 text-xs">
              <RefreshCw className="w-4 h-4 shrink-0" />
              <span>REQUEST EVIDENCE</span>
            </div>
            <p className="text-[11px] text-slate-400 font-sans leading-snug">
              Request targeted EDR process execution logs to resolve identified telemetry gaps.
            </p>
          </button>

          <button
            onClick={() => handleSelectDecision('Closed as Benign')}
            className={`p-4 rounded-xl border text-left transition-all cursor-pointer space-y-1.5 ${
              decision === 'Closed as Benign'
                ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.3)]'
                : 'bg-dark-900 text-slate-300 border-dark-700 hover:border-emerald-500/80'
            }`}
          >
            <div className="flex items-center gap-1.5 font-bold text-emerald-400 text-xs">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>MARK AS BENIGN</span>
            </div>
            <p className="text-[11px] text-slate-400 font-sans leading-snug">
              Mark activity as authorized administrator maintenance and close ticket.
            </p>
          </button>

          <button
            onClick={() => handleSelectDecision('Active Monitoring')}
            className={`p-4 rounded-xl border text-left transition-all cursor-pointer space-y-1.5 ${
              decision === 'Active Monitoring'
                ? 'bg-cyan-950/80 text-cyan-300 border-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.3)]'
                : 'bg-dark-900 text-slate-300 border-dark-700 hover:border-cyan-500/80'
            }`}
          >
            <div className="flex items-center gap-1.5 font-bold text-cyan-400 text-xs">
              <FileCheck className="w-4 h-4 shrink-0" />
              <span>CONTINUE MONITORING</span>
            </div>
            <p className="text-[11px] text-slate-400 font-sans leading-snug">
              Keep investigation active in watch status for additional telemetry events.
            </p>
          </button>
        </div>

        {/* Confirmation Note */}
        {decision && (
          <div className="p-3 bg-dark-900 border border-dark-700 rounded-lg text-xs font-mono text-emerald-400 flex items-center justify-between">
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Analyst decision recorded: <strong>{decision}</strong>
            </span>
            <span className="text-[10px] text-slate-500">
              Audit logged to session history
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
