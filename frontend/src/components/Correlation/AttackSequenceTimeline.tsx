import { useState } from 'react';
import {
  GitBranch,
  HelpCircle
} from 'lucide-react';
import { RECONSTRUCTED_ATTACK_STAGES } from '../../data/correlationEngine';
import { AttackStageItem } from '../../types/correlation';

interface AttackSequenceTimelineProps {
  customStages?: any[];
}

export const AttackSequenceTimeline = ({ customStages }: AttackSequenceTimelineProps) => {
  const stagesList = (customStages && customStages.length > 0) ? customStages : RECONSTRUCTED_ATTACK_STAGES;
  const [selectedStage, setSelectedStage] = useState<AttackStageItem>(stagesList[0]);

  return (
    <div className="bg-dark-800 border border-dark-700 rounded-xl p-6 space-y-6 shadow-xl font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-dark-700 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <GitBranch className="w-5 h-5 text-cyan-400" />
            <span className="text-xs font-mono font-bold text-cyan-400 uppercase">
              CHRONOLOGICAL ATTACK TIMELINE
            </span>
          </div>
          <h2 className="text-xl font-bold text-slate-100 font-mono mt-1">
            Reconstructed Multi-Stage Sequence
          </h2>
        </div>

        <span className="text-xs font-mono px-3 py-1 bg-cyan-950 text-cyan-400 border border-cyan-800 rounded-lg font-bold">
          {stagesList.length} STAGES IDENTIFIED
        </span>
      </div>

      {/* Horizontal Stage Selector Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-2 font-mono text-xs">
        {stagesList.map((stage) => {
          const isSelected = selectedStage.stageNumber === stage.stageNumber;
          return (
            <button
              key={stage.stageNumber}
              onClick={() => setSelectedStage(stage)}
              className={`p-3 rounded-lg border text-left transition-all cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? 'bg-cyan-950 text-cyan-300 border-cyan-400 font-bold shadow-[0_0_12px_rgba(6,182,212,0.3)]'
                  : 'bg-dark-900 text-slate-400 border-dark-700 hover:text-slate-200'
              }`}
            >
              <div className="text-[10px] text-slate-500 font-bold">STAGE 0{stage.stageNumber}</div>
              <div className="font-bold text-slate-200 truncate mt-1 text-[11px]">{stage.stageName}</div>
              <div className="text-[10px] text-cyan-400 mt-2">{stage.timestamp}</div>
            </button>
          );
        })}
      </div>

      {/* Active Stage Detailed Card */}
      {selectedStage && (
        <div className="p-5 bg-dark-900 border border-cyan-900/80 rounded-xl space-y-4 text-xs shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-dark-800 pb-3 font-mono">
            <div>
              <span className="text-cyan-400 font-bold uppercase text-[11px]">
                STAGE 0{selectedStage.stageNumber} // {selectedStage.stageName}
              </span>
              <h3 className="text-sm font-bold text-slate-100 font-sans mt-0.5">
                {selectedStage.eventTitle} ({selectedStage.timestamp})
              </h3>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-slate-400">{selectedStage.source}</span>
              <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase ${
                selectedStage.severity === 'critical' ? 'bg-red-950 text-red-400 border border-red-800' :
                selectedStage.severity === 'high' ? 'bg-amber-950 text-amber-400 border border-amber-800' :
                'bg-blue-950 text-blue-400 border border-blue-800'
              }`}>
                {selectedStage.riskLevel}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-xs bg-dark-800 p-3 rounded-lg border border-dark-700">
            <div>
              <span className="text-slate-500 text-[10px] block">TARGET ENTITY</span>
              <span className="text-purple-300 font-bold">{selectedStage.entity}</span>
            </div>
            <div>
              <span className="text-slate-500 text-[10px] block">DEVICE / IP INDICATOR</span>
              <span className="text-blue-300 font-bold">{selectedStage.ipOrDevice}</span>
            </div>
          </div>

          <div className="p-3 bg-cyan-950/40 border border-cyan-900/60 rounded-lg text-xs text-slate-300 font-sans space-y-1">
            <span className="font-mono text-[10px] font-bold text-cyan-400 uppercase flex items-center gap-1">
              <HelpCircle className="w-3.5 h-3.5" /> CONNECTION REASONING
            </span>
            <p className="leading-relaxed">{selectedStage.connectionExplanation}</p>
          </div>
        </div>
      )}
    </div>
  );
};
