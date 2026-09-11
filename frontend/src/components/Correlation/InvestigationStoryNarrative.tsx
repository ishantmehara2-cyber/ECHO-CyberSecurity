import {
  ShieldCheck,
  AlertTriangle
} from 'lucide-react';
import { INVESTIGATION_SUMMARY_STORY } from '../../data/correlationEngine';
import { DETECTED_EVIDENCE_GAPS } from '../../data/gapDetectionEngine';
import { TypedInvestigationStory } from './TypedInvestigationStory';

export const InvestigationStoryNarrative = () => {
  const story = INVESTIGATION_SUMMARY_STORY;

  return (
    <div className="bg-dark-800 border border-cyan-500/60 rounded-xl p-6 shadow-2xl space-y-6 relative overflow-hidden">
      {/* Background Accent */}
      <div className="absolute inset-0 bg-[radial-gradient(#06b6d4_1px,transparent_1px)] [background-size:24px_24px] opacity-15 pointer-events-none" />

      <div className="relative z-10 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-cyan-900/60 pb-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 text-xs font-mono font-bold uppercase mb-2">
              <ShieldCheck className="w-4 h-4" />
              <span>DYNAMIC INVESTIGATION SUMMARY GENERATED</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-100 font-mono">
              ECHO Investigation Summary Narrative
            </h2>
          </div>

          <div className="px-4 py-2 bg-dark-900 border border-cyan-500/60 rounded-xl font-mono text-center shrink-0">
            <span className="text-slate-500 block text-[10px] uppercase font-bold">OVERALL CONFIDENCE</span>
            <span className="text-emerald-400 font-extrabold text-lg">{story.overallConfidenceScore}% HIGH</span>
          </div>
        </div>

        {/* Quantified Summary Metrics Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 font-mono text-xs text-center">
          <div className="p-3 bg-dark-900 border border-dark-700 rounded-lg">
            <span className="text-slate-500 text-[10px] block uppercase font-bold">CORRELATED EVENTS</span>
            <span className="text-cyan-400 font-bold text-sm">{story.totalCorrelatedEvents.toLocaleString()}</span>
          </div>

          <div className="p-3 bg-dark-900 border border-dark-700 rounded-lg">
            <span className="text-slate-500 text-[10px] block uppercase font-bold">EVIDENCE EDGES</span>
            <span className="text-purple-400 font-bold text-sm">{story.evidenceConnectionsCount} Links</span>
          </div>

          <div className="p-3 bg-dark-900 border border-dark-700 rounded-lg">
            <span className="text-slate-500 text-[10px] block uppercase font-bold">EVIDENCE GAPS</span>
            <span className="text-amber-400 font-bold text-sm">{DETECTED_EVIDENCE_GAPS.length} Detected</span>
          </div>

          <div className="p-3 bg-dark-900 border border-dark-700 rounded-lg">
            <span className="text-slate-500 text-[10px] block uppercase font-bold">EVIDENCE COVERAGE</span>
            <span className="text-emerald-400 font-bold text-sm">78% Complete</span>
          </div>

          <div className="p-3 bg-dark-900 border border-cyan-800 rounded-lg">
            <span className="text-slate-500 text-[10px] block uppercase font-bold">OVERALL VERDICT</span>
            <span className="text-emerald-400 font-bold text-xs uppercase">CORRELATED ATTACK</span>
          </div>
        </div>

        {/* ChatGPT-Style Typed Narrative Component */}
        <TypedInvestigationStory customText={story.narrativeText} />

        {/* EVIDENCE GAPS & NEXT STEP RECOMMENDATION */}
        <div className="p-4 bg-amber-950/30 border border-amber-800/80 rounded-xl space-y-2 text-xs font-mono">
          <div className="flex items-center gap-2 text-amber-400 font-bold">
            <AlertTriangle className="w-4 h-4" />
            <span>EVIDENCE GAPS & RECOMMENDED NEXT STEPS</span>
          </div>
          <p className="text-slate-300 font-sans leading-snug">
            <strong>HIGH PRIORITY:</strong> Missing endpoint execution telemetry between successful authentication (10:30) and sensitive data access (10:32) on WORKSTATION-07.
          </p>
          <div className="text-emerald-400 font-bold font-mono text-[11px] pt-1">
            RECOMMENDED NEXT STEP: Ingest Endpoint / EDR telemetry (Sysmon / Windows Event 4688) for WORKSTATION-07 during the 10:30-10:32 time window.
          </div>
        </div>

        {/* Key Actor Map Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 font-mono text-xs">
          <div className="p-2.5 bg-dark-900 border border-purple-900/60 rounded-lg">
            <span className="text-slate-500 text-[10px] block uppercase font-bold">USER ACCOUNT</span>
            <span className="text-purple-300 font-bold">{story.keyActors.primaryUser}</span>
          </div>

          <div className="p-2.5 bg-dark-900 border border-blue-900/60 rounded-lg">
            <span className="text-slate-500 text-[10px] block uppercase font-bold">TARGET HOST</span>
            <span className="text-blue-300 font-bold">{story.keyActors.primaryHost}</span>
          </div>

          <div className="p-2.5 bg-dark-900 border border-red-900/60 rounded-lg">
            <span className="text-slate-500 text-[10px] block uppercase font-bold">ENTRY IP</span>
            <span className="text-red-300 font-bold">{story.keyActors.entryIp}</span>
          </div>

          <div className="p-2.5 bg-dark-900 border border-amber-900/60 rounded-lg">
            <span className="text-slate-500 text-[10px] block uppercase font-bold">TARGET ASSET</span>
            <span className="text-amber-300 font-bold">{story.keyActors.targetAsset}</span>
          </div>

          <div className="p-2.5 bg-dark-900 border border-emerald-900/60 rounded-lg">
            <span className="text-slate-500 text-[10px] block uppercase font-bold">DROP DOMAIN</span>
            <span className="text-emerald-300 font-bold truncate block">{story.keyActors.exfiltrationDomain}</span>
          </div>

          <div className="p-2.5 bg-dark-900 border border-emerald-900/60 rounded-lg">
            <span className="text-slate-500 text-[10px] block uppercase font-bold">DESTINATION IP</span>
            <span className="text-emerald-300 font-bold">{story.keyActors.exfiltrationIp}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
