import { ShieldCheck, HelpCircle, FileCheck } from 'lucide-react';
import { TypedInvestigationStory } from '../Correlation/TypedInvestigationStory';
import { useInvestigation } from '../../context/InvestigationContext';

interface ExecutiveOverviewProps {
  onOpenReportModal?: () => void;
}

export const ExecutiveOverview = ({ onOpenReportModal }: ExecutiveOverviewProps) => {
  const { analysisData } = useInvestigation();
  const story = analysisData?.summary;
  const coverage = analysisData?.confidence;

  return (
    <div className="bg-dark-800 border border-cyan-500/60 rounded-xl p-6 shadow-2xl space-y-6 relative overflow-hidden">
      {/* Background Accent */}
      <div className="absolute inset-0 bg-[radial-gradient(#06b6d4_1px,transparent_1px)] [background-size:24px_24px] opacity-15 pointer-events-none" />

      <div className="relative z-10 space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-cyan-900/60 pb-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 text-xs font-mono font-bold uppercase mb-2">
              <ShieldCheck className="w-4 h-4" />
              <span>INCIDENT STATUS: POTENTIAL MULTI-STAGE ATTACK DETECTED</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight font-mono">
              ECHO INVESTIGATION OVERVIEW
            </h1>
          </div>

          {onOpenReportModal && (
            <button
              onClick={onOpenReportModal}
              className="flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-slate-950 font-extrabold rounded-xl transition-all shadow-[0_0_20px_rgba(6,182,212,0.4)] cursor-pointer text-xs uppercase font-mono tracking-wider self-start md:self-auto"
            >
              <FileCheck className="w-4 h-4 fill-slate-950" />
              <span>EXPORT EXECUTIVE REPORT</span>
            </button>
          )}
        </div>

        {/* Quantified Executive Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 font-mono text-xs text-center">
          <div className="p-3.5 bg-dark-900 border border-dark-700 rounded-xl">
            <span className="text-slate-500 text-[10px] block uppercase font-bold">OVERALL CONFIDENCE</span>
            <span className="text-emerald-400 font-extrabold text-lg">{story?.overallConfidenceScore ?? 0}%</span>
          </div>

          <div className="p-3.5 bg-dark-900 border border-dark-700 rounded-xl">
            <span className="text-slate-500 text-[10px] block uppercase font-bold">CORRELATED EVENTS</span>
            <span className="text-cyan-400 font-bold text-lg">{story?.totalCorrelatedEvents ?? 0}</span>
          </div>

          <div className="p-3.5 bg-dark-900 border border-dark-700 rounded-xl">
            <span className="text-slate-500 text-[10px] block uppercase font-bold">EVIDENCE SILOS</span>
            <span className="text-purple-400 font-bold text-lg">{new Set((analysisData?.normalized_events || []).map((event: any) => event.source)).size} Sources</span>
          </div>

          <div className="p-3.5 bg-dark-900 border border-dark-700 rounded-xl">
            <span className="text-slate-500 text-[10px] block uppercase font-bold">POSSIBLE GAPS</span>
            <span className="text-amber-400 font-bold text-lg">{analysisData?.evidence_gaps?.length ?? 0} Detected</span>
          </div>

          <div className="p-3.5 bg-dark-900 border border-cyan-800 rounded-xl">
            <span className="text-slate-500 text-[10px] block uppercase font-bold">COVERAGE SCORE</span>
            <span className="text-emerald-400 font-bold text-lg">{coverage?.coverageScore ?? 0}%</span>
          </div>
        </div>

        {/* Typed Investigation Story Box */}
        <TypedInvestigationStory customText={story?.narrativeText || 'No investigation summary is available.'} />

        {/* WHY THIS MATTERS Callout Banner */}
        <div className="p-4 bg-cyan-950/40 border border-cyan-500/60 rounded-xl text-xs text-slate-300 font-sans flex items-start gap-3">
          <HelpCircle className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <strong className="text-cyan-300 font-mono text-xs uppercase block">WHY THIS MATTERS FOR ANALYSTS:</strong>
            <p className="text-xs leading-relaxed">
              ECHO automatically correlated 4 siloed telemetry streams that would normally require hours of manual SIEM query stitching. Every connection is backed by matching evidence factors (shared user, shared host, 8-minute temporal window) and transparent confidence weighting.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
