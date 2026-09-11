import { useState } from 'react';
import { ExecutiveOverview } from '../Executive/ExecutiveOverview';
import { InvestigationControlPanel, ControlViewTab } from '../Executive/InvestigationControlPanel';
import { AttackSequenceTimeline } from '../Correlation/AttackSequenceTimeline';
import { InteractiveCorrelationGraph } from '../Correlation/InteractiveCorrelationGraph';
import { EvidenceGapCards } from '../Gaps/EvidenceGapCards';
import { AskEchoSearch } from '../Search/AskEchoSearch';
import { GapDetailModal } from '../Gaps/GapDetailModal';
import { EvidenceGap } from '../../types/gap';
import { Dna } from 'lucide-react';
import { useInvestigation } from '../../context/InvestigationContext';

interface StageWowMomentProps {
  onOpenReportModal: () => void;
}

export const StageWowMoment = ({ onOpenReportModal }: StageWowMomentProps) => {
  const { analysisData } = useInvestigation();
  const [activeTab, setActiveTab] = useState<ControlViewTab>('timeline');
  const [selectedGap, setSelectedGap] = useState<EvidenceGap | null>(null);

  return (
    <div className="space-y-6">
      {/* 1. Executive Summary Overview */}
      <ExecutiveOverview onOpenReportModal={onOpenReportModal} />

      {/* 2. Investigation Quick Control Bar */}
      <InvestigationControlPanel
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onOpenReportModal={onOpenReportModal}
      />

      {/* 3. Active View Based on Selected Control Tab */}
      {activeTab === 'timeline' && (
        <AttackSequenceTimeline customStages={analysisData?.timeline || []} />
      )}

      {activeTab === 'graph' && (
        <InteractiveCorrelationGraph customNodes={analysisData?.extractedEntities || []} customLinks={analysisData?.correlations || []} />
      )}

      {activeTab === 'gaps' && (
        <EvidenceGapCards onSelectGap={setSelectedGap} customGaps={analysisData?.evidence_gaps || []} />
      )}

      {activeTab === 'search' && (
        <AskEchoSearch />
      )}

      {activeTab === 'dna' && (
        <div className="bg-dark-800 border border-dark-700 rounded-xl p-6 space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-dark-700 pb-3">
            <div className="flex items-center gap-2">
              <Dna className="w-5 h-5 text-purple-400" />
              <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider font-mono">
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

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 font-mono text-xs">
            {(analysisData?.extractedEntities || []).map((dna: any, idx: number) => (
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
                  {dna.name}
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
      )}

      {/* Gap Detail Modal */}
      <GapDetailModal
        gap={selectedGap}
        onClose={() => setSelectedGap(null)}
      />
    </div>
  );
};
