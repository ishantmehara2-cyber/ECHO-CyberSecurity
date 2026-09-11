import {
  ShieldCheck,
  Sparkles,
  Dna,
  FileCheck2,
  ArrowRight
} from 'lucide-react';
import { DEMO_ATTACK_DNA } from '../../data/vaultDemoData';

interface StageWowMomentProps {
  onOpenReportModal: () => void;
}

export const StageWowMoment = ({ onOpenReportModal }: StageWowMomentProps) => {
  const steps = [
    { label: 'ACCESS', desc: 'Credential Stuffing' },
    { label: 'EXECUTION', desc: 'Encoded PowerShell' },
    { label: 'COLLECTION', desc: 'Sensitive Spreadsheet' },
    { label: 'ARCHIVE', desc: 'Local Zip Staging' },
    { label: 'EXTERNAL TRANSFER', desc: 'Large Data Egress' },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner: ECHO Incident Reconstruction */}
      <div className="bg-dark-800 border border-cyan-500/60 rounded-xl p-6 shadow-2xl relative overflow-hidden">
        {/* Background Grid Accent */}
        <div className="absolute inset-0 bg-[radial-gradient(#06b6d4_1px,transparent_1px)] [background-size:24px_24px] opacity-15 pointer-events-none" />

        <div className="relative z-10 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-cyan-900/60 pb-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 text-xs font-mono font-bold uppercase mb-2">
                <ShieldCheck className="w-4 h-4" />
                <span>ANALYSIS COMPLETE — HIGH CONFIDENCE CORRELATION</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight">
                ECHO INCIDENT RECONSTRUCTION
              </h2>
            </div>

            <button
              onClick={onOpenReportModal}
              className="flex items-center justify-center gap-2.5 px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-slate-950 font-extrabold rounded-xl transition-all shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:shadow-[0_0_30px_rgba(6,182,212,0.6)] cursor-pointer text-xs uppercase tracking-wider self-start md:self-auto"
            >
              <FileCheck2 className="w-4 h-4 fill-slate-950" />
              <span>GENERATE INVESTIGATION SUMMARY REPORT</span>
            </button>
          </div>

          {/* Quantitative Transformation Pipeline Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center font-mono text-xs">
            <div className="bg-dark-900/90 border border-dark-700 p-3 rounded-lg">
              <span className="text-slate-500 text-[10px] block uppercase font-bold">EVIDENCE SOURCES</span>
              <span className="text-slate-100 font-bold text-sm">4 INDEPENDENT SOURCES</span>
            </div>

            <div className="bg-dark-900/90 border border-dark-700 p-3 rounded-lg">
              <span className="text-slate-500 text-[10px] block uppercase font-bold">RAW EVENTS ANALYZED</span>
              <span className="text-cyan-400 font-bold text-sm">2,214 RAW EVENTS</span>
            </div>

            <div className="bg-dark-900/90 border border-dark-700 p-3 rounded-lg">
              <span className="text-slate-500 text-[10px] block uppercase font-bold">CORRELATED ENTITIES</span>
              <span className="text-purple-400 font-bold text-sm">8 HIGH-VALUE ENTITIES</span>
            </div>

            <div className="bg-dark-900/90 border border-cyan-800 p-3 rounded-lg">
              <span className="text-slate-500 text-[10px] block uppercase font-bold">RECONSTRUCTED INCIDENT</span>
              <span className="text-emerald-400 font-bold text-sm">1 CONNECTED SEQUENCE</span>
            </div>
          </div>

          {/* ATTACK BEHAVIOR PATTERN */}
          <div className="bg-dark-900 border border-dark-700 rounded-xl p-5 space-y-3">
            <h3 className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              ATTACK BEHAVIOURAL PATTERN RECONSTRUCTED
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 font-mono text-xs">
              {steps.map((st, i) => (
                <div key={i} className="bg-dark-800 border border-dark-700 p-3 rounded-lg flex flex-col justify-between relative">
                  <div>
                    <span className="text-cyan-400 text-[10px] font-bold block">0{i + 1} // {st.label}</span>
                    <span className="text-slate-200 font-bold text-xs mt-1 block">{st.desc}</span>
                  </div>
                  {i < 4 && (
                    <ArrowRight className="hidden sm:block absolute -right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-cyan-500/80 z-10" />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Primary Entity Mapping Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 font-mono text-xs">
            <div className="bg-dark-900 p-3 rounded-lg border border-purple-900/60">
              <span className="text-slate-500 text-[10px] block font-bold uppercase">PRIMARY IDENTITY</span>
              <span className="text-purple-300 font-bold text-sm">employee_07</span>
            </div>

            <div className="bg-dark-900 p-3 rounded-lg border border-blue-900/60">
              <span className="text-slate-500 text-[10px] block font-bold uppercase">PRIMARY ENDPOINT</span>
              <span className="text-blue-300 font-bold text-sm">WORKSTATION-07</span>
            </div>

            <div className="bg-dark-900 p-3 rounded-lg border border-red-900/60">
              <span className="text-slate-500 text-[10px] block font-bold uppercase">ENTRY IP</span>
              <span className="text-red-300 font-bold text-sm">185.220.101.45</span>
            </div>

            <div className="bg-dark-900 p-3 rounded-lg border border-amber-900/60">
              <span className="text-slate-500 text-[10px] block font-bold uppercase">SENSITIVE ASSET</span>
              <span className="text-amber-300 font-bold text-sm">finance_records.xlsx</span>
            </div>

            <div className="bg-dark-900 p-3 rounded-lg border border-emerald-900/60">
              <span className="text-slate-500 text-[10px] block font-bold uppercase">DESTINATION IP</span>
              <span className="text-emerald-300 font-bold text-sm">198.51.100.77</span>
            </div>

            <div className="bg-cyan-950/60 p-3 rounded-lg border border-cyan-500/60 text-center">
              <span className="text-slate-400 text-[10px] block font-bold uppercase">CONFIDENCE SCORE</span>
              <span className="text-emerald-400 font-extrabold text-base">94%</span>
            </div>
          </div>
        </div>
      </div>

      {/* ECHO ATTACK DNA COMPONENT */}
      <div className="bg-dark-800 border border-dark-700 rounded-xl p-6 space-y-4 shadow-xl">
        <div className="flex items-center justify-between border-b border-dark-700 pb-3">
          <div className="flex items-center gap-2">
            <Dna className="w-5 h-5 text-purple-400" />
            <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider">
              ECHO ATTACK DNA (STRUCTURED FINGERPRINT)
            </h3>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800 font-bold">
            ATTACK FINGERPRINT GENERATED
          </span>
        </div>

        <p className="text-xs text-slate-400 font-sans">
          ECHO converted thousands of disconnected telemetry records into a single structured Digital Attack Fingerprint.
        </p>

        {/* DNA Fingerprint Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 font-mono text-xs">
          {DEMO_ATTACK_DNA.map((dna, idx) => (
            <div
              key={idx}
              className="bg-dark-900 border border-purple-900/50 hover:border-cyan-500/80 rounded-xl p-3.5 flex flex-col justify-between transition-colors group"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold text-purple-400 uppercase tracking-widest">
                  {dna.category}
                </span>
                <span className="text-[9px] text-slate-600">DNA #{idx + 1}</span>
              </div>

              <div className="text-sm font-bold text-slate-100 group-hover:text-cyan-300 transition-colors">
                {dna.value}
              </div>

              {dna.subtext && (
                <div className="text-[11px] text-slate-500 mt-2 pt-2 border-t border-dark-800">
                  {dna.subtext}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
