import { X, Printer, FileText, CheckCircle2, AlertTriangle } from 'lucide-react';
import { DEMO_ATTACK_DNA, DEMO_TIMELINE_EVENTS } from '../../data/vaultDemoData';

interface InvestigationReportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InvestigationReportModal = ({ isOpen, onClose }: InvestigationReportModalProps) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-fade-in">
      <div className="bg-dark-900 border border-cyan-500/60 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden relative">
        {/* Modal Header */}
        <div className="p-6 bg-dark-800 border-b border-dark-700 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-cyan-950 text-cyan-400 border border-cyan-800">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-cyan-400 uppercase">
                  ECHO INVESTIGATION SUMMARY REPORT
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 font-bold">
                  CONFIDENCE: 94%
                </span>
              </div>
              <h2 className="text-xl font-bold text-slate-100 font-mono">
                INCIDENT REPORT #ECHO-2026-0911-01
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-3 py-1.5 bg-dark-700 hover:bg-dark-600 text-slate-200 rounded-lg text-xs font-mono border border-dark-600 cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Export PDF</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-dark-800 text-slate-400 hover:text-slate-100 border border-dark-700 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-slate-300 font-sans text-sm leading-relaxed">
          {/* Executive Summary */}
          <div className="p-4 bg-dark-800 border border-dark-700 rounded-xl space-y-2">
            <h3 className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">
              1. EXECUTIVE SUMMARY
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              ECHO automated correlation analysis processed <strong className="text-cyan-300">2,214 raw telemetry events</strong> across 4 independent evidence streams (Authentication, Endpoint, Threat Intel, Network). A high-confidence (<strong>94%</strong>) multi-stage attack sequence was reconstructed linking account compromise, endpoint execution, financial asset collection, local archiving, and encrypted exfiltration.
            </p>
          </div>

          {/* Key Entities & Attack DNA Table */}
          <div className="space-y-3">
            <h3 className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">
              2. KEY CORRELATED ENTITIES (ATTACK DNA)
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono text-xs">
              {DEMO_ATTACK_DNA.map((item, idx) => (
                <div key={idx} className="p-2.5 bg-dark-800 border border-dark-700 rounded-lg">
                  <span className="text-[10px] text-slate-500 block uppercase font-bold">{item.category}</span>
                  <span className="text-slate-200 font-bold block mt-0.5">{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Timeline Summary */}
          <div className="space-y-3">
            <h3 className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">
              3. RECONSTRUCTED INCIDENT TIMELINE
            </h3>

            <div className="bg-dark-800 border border-dark-700 rounded-xl p-4 space-y-2 font-mono text-xs">
              {DEMO_TIMELINE_EVENTS.map((evt) => (
                <div key={evt.id} className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-dark-700/60 pb-2 last:border-0">
                  <div className="flex items-center gap-2">
                    <span className="text-cyan-400 font-bold">{evt.time}</span>
                    <span className="text-slate-200 font-bold">{evt.title}</span>
                  </div>
                  <div className="text-slate-400 text-[11px]">
                    {evt.entity} ({evt.ipOrHost})
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Risk Assessment & Recommendations */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-dark-800 border border-dark-700 rounded-xl space-y-2">
              <h3 className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4" /> 4. RISK & IMPACT ASSESSMENT
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Potential exfiltration of restricted financial assets (<code className="text-amber-300 font-mono">finance_records.xlsx</code>) totaling 148 MB transferred to external IP <code className="text-amber-300 font-mono">198.51.100.77</code>. Account <code className="text-cyan-300 font-mono">employee_07</code> displays indicators of credential compromise.
              </p>
            </div>

            <div className="p-4 bg-dark-800 border border-dark-700 rounded-xl space-y-2">
              <h3 className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" /> 5. RECOMMENDED NEXT ACTIONS
              </h3>
              <ul className="text-xs text-slate-300 space-y-1 list-disc list-inside">
                <li>Preserve memory & disk forensic image of WORKSTATION-07.</li>
                <li>Reset credentials & revoke active SSO session <code className="text-cyan-300 font-mono">SES-7F21A</code> for employee_07.</li>
                <li>Block destination IP <code className="text-cyan-300 font-mono">198.51.100.77</code> on perimeter firewalls.</li>
                <li>Conduct data exposure assessment for finance_records.xlsx.</li>
                <li>Escalate ticket for Tier-2 SOC Analyst formal review.</li>
              </ul>
            </div>
          </div>

          {/* Professional Analyst Disclaimer */}
          <div className="p-3 bg-dark-800/80 border border-dark-700 rounded-lg text-[11px] font-mono text-slate-500">
            <strong>Analyst Disclaimer:</strong> ECHO provided automated multi-source hypothesis correlation based on ingested evidence files. Potentially correlated incident sequence detected with high-confidence hypothesis. Human analyst review recommended prior to formal remediation actions.
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-dark-800 border-t border-dark-700 flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold rounded-lg text-xs font-mono transition-colors cursor-pointer uppercase"
          >
            Close Report
          </button>
        </div>
      </div>
    </div>
  );
};
