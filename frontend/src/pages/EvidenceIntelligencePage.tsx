import { useState } from 'react';
import { Search, Sparkles, HelpCircle } from 'lucide-react';
import { EvidenceCoverageMeter } from '../components/Gaps/EvidenceCoverageMeter';
import { AttackPathCompletion } from '../components/Gaps/AttackPathCompletion';
import { EvidenceGapCards } from '../components/Gaps/EvidenceGapCards';
import { NextBestEvidencePanel } from '../components/Gaps/NextBestEvidencePanel';
import { GapDetailModal } from '../components/Gaps/GapDetailModal';
import { EvidenceGap } from '../types/gap';

export const EvidenceIntelligencePage = () => {
  const [selectedGap, setSelectedGap] = useState<EvidenceGap | null>(null);

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-dark-800/80 border border-dark-700 rounded-xl p-6 overflow-hidden backdrop-blur-sm shadow-xl relative">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-800/50 text-cyan-400 text-xs font-semibold uppercase tracking-wider font-mono">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Missing Telemetry Detection & Source Recommendations</span>
          </div>

          <h1 className="text-3xl font-extrabold text-slate-100 tracking-tight flex items-center gap-3">
            <Search className="w-8 h-8 text-cyan-400" />
            ECHO Evidence Intelligence & Gap Detection
          </h1>

          <p className="text-slate-400 text-sm sm:text-base leading-relaxed max-w-3xl">
            Identifying missing telemetry between correlated attack stages and recommending targeted data collection steps.
          </p>

          {/* Judge-Friendly Highlight Banner */}
          <div className="p-3 bg-cyan-950/50 border border-cyan-500/60 rounded-xl text-xs font-mono text-cyan-300 flex items-center gap-2 max-w-2xl mt-2">
            <HelpCircle className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>
              <strong>WHY THIS MATTERS:</strong> Most security platforms only display the evidence they have. ECHO also helps analysts understand what important evidence may be missing.
            </span>
          </div>
        </div>
      </div>

      {/* 1. Evidence Coverage Meter */}
      <EvidenceCoverageMeter />

      {/* 2. Attack Path Completion (Observed vs Missing) */}
      <AttackPathCompletion onSelectGap={setSelectedGap} />

      {/* 3. Detected Evidence Gap Cards */}
      <EvidenceGapCards onSelectGap={setSelectedGap} />

      {/* 4. ECHO Next Best Evidence Panel */}
      <NextBestEvidencePanel />

      {/* Gap Detail Inspector Modal */}
      <GapDetailModal
        gap={selectedGap}
        onClose={() => setSelectedGap(null)}
      />
    </div>
  );
};

export default EvidenceIntelligencePage;
