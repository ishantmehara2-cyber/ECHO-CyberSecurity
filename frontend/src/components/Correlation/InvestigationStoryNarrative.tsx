import { ShieldCheck } from 'lucide-react';
import { TypedInvestigationStory } from './TypedInvestigationStory';

interface InvestigationStoryNarrativeProps {
  customStory?: any;
}

export const InvestigationStoryNarrative = ({ customStory }: InvestigationStoryNarrativeProps) => {
  const story = customStory || {};

  return (
    <div className="bg-dark-800 border border-cyan-500/60 rounded-xl p-6 shadow-2xl space-y-6 relative overflow-hidden font-sans">
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
            <span className="text-emerald-400 font-extrabold text-lg">{story.overallConfidenceScore ?? 0}%</span>
          </div>
        </div>

        {/* Quantified Summary Metrics Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 font-mono text-xs text-center">
          <div className="p-3 bg-dark-900 border border-dark-700 rounded-lg">
            <span className="text-slate-500 text-[10px] block uppercase font-bold">CORRELATED EVENTS</span>
            <span className="text-cyan-400 font-bold text-sm">{(story.totalCorrelatedEvents ?? 0).toLocaleString()}</span>
          </div>

          <div className="p-3 bg-dark-900 border border-dark-700 rounded-lg">
            <span className="text-slate-500 text-[10px] block uppercase font-bold">EVIDENCE EDGES</span>
            <span className="text-purple-400 font-bold text-sm">{story.evidenceConnectionsCount ?? 0} Links</span>
          </div>

          <div className="p-3 bg-dark-900 border border-dark-700 rounded-lg">
            <span className="text-slate-500 text-[10px] block uppercase font-bold">EVIDENCE GAPS</span>
            <span className="text-amber-400 font-bold text-sm">{story.evidenceGapsCount ?? 0} Detected</span>
          </div>

          <div className="p-3 bg-dark-900 border border-dark-700 rounded-lg">
            <span className="text-slate-500 text-[10px] block uppercase font-bold">EVIDENCE COVERAGE</span>
            <span className="text-emerald-400 font-bold text-sm">{story.coverageScore ?? 0}% Complete</span>
          </div>

          <div className="p-3 bg-dark-900 border border-cyan-800 rounded-lg">
            <span className="text-slate-500 text-[10px] block uppercase font-bold">OVERALL VERDICT</span>
            <span className="text-emerald-400 font-bold text-xs uppercase">{story.verdict || 'NO CONCLUSION'}</span>
          </div>
        </div>

        {/* ChatGPT-Style Typed Narrative Component */}
        <TypedInvestigationStory customText={story.narrativeText || 'No investigation summary is available.'} />

        {/* Key Actor Map Grid */}
        {story.keyActors && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 font-mono text-xs">
            <div className="p-2.5 bg-dark-900 border border-purple-900/60 rounded-lg">
              <span className="text-slate-500 text-[10px] block uppercase font-bold">USER ACCOUNT</span>
              <span className="text-purple-300 font-bold">{story.keyActors.primaryUser || 'N/A'}</span>
            </div>

            <div className="p-2.5 bg-dark-900 border border-blue-900/60 rounded-lg">
              <span className="text-slate-500 text-[10px] block uppercase font-bold">TARGET HOST</span>
              <span className="text-blue-300 font-bold">{story.keyActors.primaryHost || 'N/A'}</span>
            </div>

            <div className="p-2.5 bg-dark-900 border border-red-900/60 rounded-lg">
              <span className="text-slate-500 text-[10px] block uppercase font-bold">ENTRY IP</span>
              <span className="text-red-300 font-bold">{story.keyActors.entryIp || 'N/A'}</span>
            </div>

            <div className="p-2.5 bg-dark-900 border border-amber-900/60 rounded-lg">
              <span className="text-slate-500 text-[10px] block uppercase font-bold">TARGET ASSET</span>
              <span className="text-amber-300 font-bold">{story.keyActors.targetAsset || 'N/A'}</span>
            </div>

            <div className="p-2.5 bg-dark-900 border border-emerald-900/60 rounded-lg">
              <span className="text-slate-500 text-[10px] block uppercase font-bold">DROP DOMAIN</span>
              <span className="text-emerald-300 font-bold truncate block">{story.keyActors.exfiltrationDomain || 'N/A'}</span>
            </div>

            <div className="p-2.5 bg-dark-900 border border-emerald-900/60 rounded-lg">
              <span className="text-slate-500 text-[10px] block uppercase font-bold">DESTINATION IP</span>
              <span className="text-emerald-300 font-bold">{story.keyActors.exfiltrationIp || 'N/A'}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
