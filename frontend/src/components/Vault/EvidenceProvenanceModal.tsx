import { X, FileCode2, Shield, ArrowRightLeft, FileText } from 'lucide-react';

interface EvidenceProvenanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  eventTitle?: string;
  sourceFile?: string;
  rawRecord?: Record<string, any>;
  normalizedSchema?: Record<string, any>;
  correlationReasoning?: string;
}

export const EvidenceProvenanceModal = ({
  isOpen,
  onClose,
  eventTitle = 'Failed Authentication Attempt',
  sourceFile = '01_RAW_AUTHENTICATION_TELEMETRY.pdf',
  rawRecord = {
    login_user: 'employee_07',
    src_ip: '185.220.101.45',
    auth_service: 'PAM_NATIVE',
    event: 'LOGIN_FAILED',
    reason: 'INVALID_PASSWORD'
  },
  normalizedSchema = {
    entity_user: 'employee_07',
    entity_ip: '185.220.101.45',
    entity_host: 'WORKSTATION-07',
    event_type: 'authentication_failure',
    source: 'authentication',
    severity: 'medium'
  },
  correlationReasoning = 'Connected because user account employee_07 authenticated from external IP 185.220.101.45 within 2 minutes following multiple failed attempts.'
}: EvidenceProvenanceModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-fade-in font-sans">
      <div className="bg-dark-900 border border-cyan-500/60 rounded-2xl w-full max-w-3xl p-6 space-y-5 shadow-2xl relative overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-dark-800 pb-3">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-cyan-950 text-cyan-400 border border-cyan-800 font-mono">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 font-mono">
                <span className="text-xs font-bold text-cyan-400 uppercase">EVIDENCE PROVENANCE INSPECTOR</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 font-bold">VERIFIED SOURCE</span>
              </div>
              <h2 className="text-lg font-bold text-slate-100 font-mono">
                {eventTitle}
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

        {/* Source File Badge */}
        <div className="p-3 bg-dark-800 border border-dark-700 rounded-xl flex items-center justify-between font-mono text-xs">
          <span className="text-slate-400">EVIDENCE SOURCE DOCUMENT:</span>
          <span className="text-cyan-400 font-bold">📄 {sourceFile}</span>
        </div>

        {/* Side-by-Side Raw vs Normalized Comparison */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
          {/* RAW SOURCE */}
          <div className="bg-dark-800 border border-dark-700 rounded-xl p-4 flex flex-col space-y-2">
            <div className="flex items-center gap-2 text-amber-400 font-bold border-b border-dark-700 pb-2 text-[11px]">
              <FileCode2 className="w-4 h-4" /> RAW UNSTRUCTURED EVIDENCE
            </div>
            <pre className="flex-1 bg-dark-950 p-3 rounded border border-dark-800 text-amber-300 text-[11px] overflow-x-auto leading-relaxed">
              {JSON.stringify(rawRecord, null, 2)}
            </pre>
          </div>

          {/* NORMALIZED ECHO SCHEMA */}
          <div className="bg-dark-800 border border-cyan-900/60 rounded-xl p-4 flex flex-col space-y-2">
            <div className="flex items-center gap-2 text-emerald-400 font-bold border-b border-dark-700 pb-2 text-[11px]">
              <Shield className="w-4 h-4" /> UNIFIED ECHO SCHEMA
            </div>
            <pre className="flex-1 bg-dark-950 p-3 rounded border border-emerald-900/50 text-emerald-300 text-[11px] overflow-x-auto leading-relaxed">
              {JSON.stringify(normalizedSchema, null, 2)}
            </pre>
          </div>
        </div>

        {/* Correlation Reasoning */}
        <div className="p-4 bg-cyan-950/40 border border-cyan-900/60 rounded-xl space-y-1 text-xs">
          <span className="font-mono text-[10px] font-bold text-cyan-400 uppercase flex items-center gap-1.5">
            <ArrowRightLeft className="w-3.5 h-3.5" /> CORRELATION REASONING
          </span>
          <p className="text-slate-200 leading-relaxed font-sans">
            {correlationReasoning}
          </p>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-dark-800 border-t border-dark-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold rounded-lg text-xs font-mono transition-colors cursor-pointer uppercase"
          >
            Close Provenance View
          </button>
        </div>
      </div>
    </div>
  );
};
