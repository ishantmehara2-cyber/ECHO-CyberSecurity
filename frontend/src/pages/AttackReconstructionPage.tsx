import { GitBranch, Sparkles } from 'lucide-react';
import { AttackSequenceTimeline } from '../components/Correlation/AttackSequenceTimeline';
import { InvestigationStoryNarrative } from '../components/Correlation/InvestigationStoryNarrative';
import { EmptyInvestigationState } from '../components/Common/EmptyInvestigationState';
import { useInvestigation } from '../context/InvestigationContext';

export const AttackReconstructionPage = () => {
  const { analysisData, hasAnalysisData } = useInvestigation();

  if (!hasAnalysisData) {
    return (
      <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
        <div className="bg-dark-800/80 border border-dark-700 rounded-xl p-6 overflow-hidden backdrop-blur-sm shadow-xl font-sans">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-800/50 text-cyan-400 text-xs font-semibold uppercase tracking-wider font-mono">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Chronological Multi-Stage Kill Chain Synthesis</span>
            </div>

            <h1 className="text-3xl font-extrabold text-slate-100 tracking-tight flex items-center gap-3 font-mono">
              <GitBranch className="w-8 h-8 text-cyan-400" />
              Attack Reconstruction Engine
            </h1>

            <p className="text-slate-400 text-sm sm:text-base leading-relaxed max-w-3xl font-sans">
              Synthesizing disparate telemetry streams into a clear chronological attack story with explicit connection reasoning.
            </p>
          </div>
        </div>

        <EmptyInvestigationState
          moduleTitle="Attack Reconstruction Engine"
          moduleDescription="Upload and analyze telemetry evidence in the Evidence Vault to reconstruct chronological attack sequences."
        />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 font-sans">
      {/* Header */}
      <div className="bg-dark-800/80 border border-dark-700 rounded-xl p-6 overflow-hidden backdrop-blur-sm shadow-xl">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-800/50 text-cyan-400 text-xs font-semibold uppercase tracking-wider font-mono">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Chronological Multi-Stage Kill Chain Synthesis</span>
          </div>

          <h1 className="text-3xl font-extrabold text-slate-100 tracking-tight flex items-center gap-3 font-mono">
            <GitBranch className="w-8 h-8 text-cyan-400" />
            Attack Reconstruction Engine
          </h1>

          <p className="text-slate-400 text-sm sm:text-base leading-relaxed max-w-3xl font-sans">
            Synthesizing disparate telemetry streams into a clear chronological attack story with explicit connection reasoning and transparent confidence weights.
          </p>
        </div>
      </div>

      {/* Multi-stage Timeline */}
      <AttackSequenceTimeline customStages={analysisData?.timeline} />

      {/* Investigation Story Narrative */}
      <InvestigationStoryNarrative customStory={analysisData?.summary} />
    </div>
  );
};

export default AttackReconstructionPage;
