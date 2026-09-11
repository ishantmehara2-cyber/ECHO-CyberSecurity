import { useState } from 'react';
import {
  DownloadCloud,
  Binary,
  GitCompare,
  Network,
  Layers,
  MessageSquareText,
  HelpCircle
} from 'lucide-react';

export const DataJourneyPipeline = () => {
  const [activeStage, setActiveStage] = useState<number | null>(null);

  const stages = [
    {
      num: '01',
      title: 'INGEST',
      icon: DownloadCloud,
      simple: 'Receive security events from different sources.',
      technical: 'Collect raw JSON/Syslog/CEF logs from EDR, SIEM, IAM, Firewalls, and Cloud identity providers.'
    },
    {
      num: '02',
      title: 'NORMALIZE',
      icon: Binary,
      simple: 'Convert different event formats into one comparable structure.',
      technical: 'Map disparate schemas into the standardized ECHO Evidence Model (Entity, Action, Asset, Timestamp).'
    },
    {
      num: '03',
      title: 'COMPARE',
      icon: GitCompare,
      simple: 'Look for shared people, devices, IP addresses and time patterns.',
      technical: 'Execute multi-attribute entity similarity comparison across identity hashes, device GUIDs, and temporal windows.'
    },
    {
      num: '04',
      title: 'CONNECT',
      icon: Network,
      simple: 'Link events when meaningful similarities are found.',
      technical: 'Construct weighted directed evidence graphs linking related events based on shared attribute confidence.'
    },
    {
      num: '05',
      title: 'RECONSTRUCT',
      icon: Layers,
      simple: 'Build a probable sequence from connected evidence.',
      technical: 'Synthesize temporal attack chains using heuristic sequence alignment to assemble multi-stage kill chains.'
    },
    {
      num: '06',
      title: 'EXPLAIN',
      icon: MessageSquareText,
      simple: 'Show why ECHO reached its conclusion.',
      technical: 'Generate plain-language investigative narratives detailing exact correlation reasoning and confidence scores.'
    }
  ];

  return (
    <div className="bg-dark-800 border border-dark-700 rounded-xl p-6 shadow-lg">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-6">
        <div>
          <h2 className="text-base font-bold text-slate-100 uppercase tracking-wider flex items-center gap-2">
            <Network className="w-5 h-5 text-cyan-400" />
            ECHO Data Journey
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            How ECHO transforms raw telemetry into an explainable attack story. Hover over any stage for technical details.
          </p>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-cyan-400 font-mono bg-cyan-950/50 border border-cyan-800/40 px-2.5 py-1 rounded-full">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
          <span>Pipeline Architecture</span>
        </div>
      </div>

      {/* Grid Pipeline */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-3 relative">
        {stages.map((stage, idx) => {
          const Icon = stage.icon;
          const isSelected = activeStage === idx;

          return (
            <div
              key={idx}
              onMouseEnter={() => setActiveStage(idx)}
              onMouseLeave={() => setActiveStage(null)}
              onClick={() => setActiveStage(activeStage === idx ? null : idx)}
              className={`cursor-pointer rounded-lg p-4 border transition-all duration-300 relative flex flex-col justify-between ${
                isSelected
                  ? 'bg-cyan-950/40 border-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.15)] -translate-y-1'
                  : 'bg-dark-900/80 border-dark-700 hover:border-dark-600 hover:bg-dark-800/90'
              }`}
            >
              {/* Header */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className={`text-xs font-mono font-bold ${isSelected ? 'text-cyan-400' : 'text-slate-500'}`}>
                    {stage.num}
                  </span>
                  <div className={`p-1.5 rounded-md ${isSelected ? 'bg-cyan-900/60 text-cyan-400' : 'bg-dark-800 text-slate-400'}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                </div>

                <h3 className={`text-sm font-bold tracking-wider mb-2 ${isSelected ? 'text-cyan-200' : 'text-slate-200'}`}>
                  {stage.title}
                </h3>

                <p className="text-xs text-slate-400 leading-relaxed">
                  {stage.simple}
                </p>
              </div>

              {/* Technical description popover / bottom note */}
              <div className="mt-4 pt-3 border-t border-dark-700/60 flex items-center gap-1 text-[11px] font-mono text-slate-500">
                <HelpCircle className="w-3 h-3 text-cyan-500/70 shrink-0" />
                <span className="truncate">Hover for Tech Spec</span>
              </div>

              {/* Hover Tooltip / Detail overlay if selected */}
              {isSelected && (
                <div className="absolute inset-x-0 -bottom-2 translate-y-full z-30 p-3 bg-dark-900 border border-cyan-500/50 rounded-lg shadow-xl text-xs text-slate-300 font-sans pointer-events-none">
                  <span className="font-bold text-cyan-400 block mb-1">Technical Specification:</span>
                  {stage.technical}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
