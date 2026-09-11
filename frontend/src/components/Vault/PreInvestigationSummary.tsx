import { CheckCircle2, Clock, ArrowRight, ShieldCheck, HelpCircle } from 'lucide-react';
import { SiloSlotKey, UploadedEvidenceFile } from '../../types/vault';

interface PreInvestigationSummaryProps {
  siloFiles: Record<SiloSlotKey, UploadedEvidenceFile | null>;
  onStartInvestigation: () => void;
}

export const PreInvestigationSummary = ({
  siloFiles,
  onStartInvestigation
}: PreInvestigationSummaryProps) => {
  const loadedCount = Object.values(siloFiles).filter(Boolean).length;
  const isFullMode = loadedCount === 4;

  const silos = [
    { key: 'identity' as SiloSlotKey, label: 'IDENTITY SOURCE' },
    { key: 'network' as SiloSlotKey, label: 'NETWORK SOURCE' },
    { key: 'threat_intel' as SiloSlotKey, label: 'THREAT INTELLIGENCE' },
    { key: 'endpoint' as SiloSlotKey, label: 'ENDPOINT SOURCE' },
  ];

  const pipelineSteps = [
    { num: '01', label: 'INGEST DOCUMENTS', desc: 'Parse raw PDFs' },
    { num: '02', label: 'EXTRACT ENTITIES', desc: 'Identify actors & IPs' },
    { num: '03', label: 'NORMALIZE EVENTS', desc: 'Standardize schema' },
    { num: '04', label: 'CORRELATE ACROSS SILOS', desc: 'Build evidence graph' },
    { num: '05', label: 'RECONSTRUCT INCIDENT', desc: 'Form attack timeline' },
  ];

  return (
    <div className="bg-dark-800 border border-dark-700 rounded-xl p-6 space-y-6 shadow-xl">
      {/* Header & Readiness Checklist */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-dark-700 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-cyan-400" />
            <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider font-mono">
              ECHO EVIDENCE READINESS CHECKLIST
            </h3>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono font-bold">
            <span className="text-slate-400">EVIDENCE SOURCES LOADED:</span>
            <span className={`px-2.5 py-0.5 rounded border ${
              isFullMode
                ? 'bg-emerald-950 text-emerald-400 border-emerald-800'
                : loadedCount > 0
                ? 'bg-cyan-950 text-cyan-400 border-cyan-800'
                : 'bg-dark-900 text-slate-500 border-dark-700'
            }`}>
              {loadedCount} / 4 SILOS
            </span>
          </div>
        </div>

        {/* 4 Silos Status Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 font-mono text-xs">
          {silos.map((s) => {
            const isLoaded = Boolean(siloFiles[s.key]);
            return (
              <div
                key={s.key}
                className={`p-3 rounded-lg border flex items-center justify-between ${
                  isLoaded
                    ? 'bg-emerald-950/60 border-emerald-800 text-emerald-300 font-bold'
                    : 'bg-dark-900/80 border-dark-700 text-slate-500'
                }`}
              >
                <span>{s.label}</span>
                <span className="flex items-center gap-1">
                  {isLoaded ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Clock className="w-3.5 h-3.5 text-slate-600" />}
                  {isLoaded ? 'READY' : 'WAITING'}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* WHEN INVESTIGATION BEGINS Pipeline Preview */}
      <div className="bg-dark-900 border border-dark-700 rounded-xl p-5 space-y-3">
        <h4 className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
          <HelpCircle className="w-4 h-4 text-cyan-400" />
          WHAT ECHO WILL DO WHEN INVESTIGATION BEGINS
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 font-mono text-xs">
          {pipelineSteps.map((st, idx) => (
            <div key={idx} className="bg-dark-800 border border-dark-700 p-3 rounded-lg flex flex-col justify-between relative">
              <div>
                <span className="text-cyan-400 text-[10px] font-bold block">{st.num} // {st.label}</span>
                <span className="text-slate-400 text-[11px] mt-1 block font-sans">{st.desc}</span>
              </div>
              {idx < 4 && (
                <ArrowRight className="hidden sm:block absolute -right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-600 z-10" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Main Mode Badge & Professional Action Trigger Button */}
      <div className="p-5 bg-dark-900 border border-cyan-900/80 rounded-xl flex flex-col lg:flex-row lg:items-center justify-between gap-4 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className={`px-2.5 py-0.5 rounded text-xs font-mono font-bold uppercase border ${
              isFullMode
                ? 'bg-emerald-950 text-emerald-400 border-emerald-800'
                : loadedCount > 0
                ? 'bg-amber-950 text-amber-400 border-amber-800'
                : 'bg-dark-800 text-slate-500 border-dark-700'
            }`}>
              {isFullMode ? 'FULL CORRELATION MODE' : loadedCount > 0 ? 'PARTIAL CORRELATION MODE' : 'AWAITING EVIDENCE'}
            </span>
          </div>

          <p className="text-xs text-slate-400">
            {isFullMode
              ? '4 / 4 independent evidence sources ready. Full deterministic cross-silo attack reconstruction enabled.'
              : loadedCount > 0
              ? 'ECHO can analyze available evidence, but cross-source confidence improves with additional independent sources.'
              : 'Upload evidence to begin investigation.'}
          </p>
        </div>

        <div className="flex flex-col items-end gap-1 shrink-0">
          <button
            onClick={onStartInvestigation}
            disabled={loadedCount === 0}
            className={`flex items-center justify-center gap-2.5 px-6 py-3.5 font-bold rounded-lg transition-all uppercase tracking-wider text-xs font-mono cursor-pointer border ${
              loadedCount > 0
                ? 'bg-cyan-600 hover:bg-cyan-500 text-slate-950 border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.3)] hover:shadow-[0_0_20px_rgba(6,182,212,0.5)] active:scale-[0.99]'
                : 'bg-dark-700 text-slate-500 border-dark-600 cursor-not-allowed'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>BEGIN ECHO INVESTIGATION</span>
          </button>
          <span className="text-[10px] font-mono text-slate-500 text-right">
            Initiate cross-source telemetry correlation
          </span>
        </div>
      </div>
    </div>
  );
};
