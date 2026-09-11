import {
  GitBranch,
  Network,
  Search,
  Dna,
  HelpCircle,
  FileCheck2,
  Sliders
} from 'lucide-react';

export type ControlViewTab =
  | 'timeline'
  | 'graph'
  | 'gaps'
  | 'dna'
  | 'search'
  | 'report';

interface InvestigationControlPanelProps {
  activeTab: ControlViewTab;
  onSelectTab: (tab: ControlViewTab) => void;
  onOpenReportModal?: () => void;
}

export const InvestigationControlPanel = ({
  activeTab,
  onSelectTab,
  onOpenReportModal
}: InvestigationControlPanelProps) => {
  const tabs = [
    { key: 'timeline' as ControlViewTab, label: 'ATTACK TIMELINE', icon: GitBranch },
    { key: 'graph' as ControlViewTab, label: 'CORRELATION GRAPH', icon: Network },
    { key: 'gaps' as ControlViewTab, label: 'EVIDENCE GAPS', icon: HelpCircle },
    { key: 'dna' as ControlViewTab, label: 'ATTACK DNA', icon: Dna },
    { key: 'search' as ControlViewTab, label: 'ASK ECHO', icon: Search },
  ];

  return (
    <div className="bg-dark-800 border border-dark-700 rounded-xl p-4 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4 font-mono text-xs">
      <div className="flex items-center gap-2 text-slate-400 font-bold shrink-0">
        <Sliders className="w-4 h-4 text-cyan-400" />
        <span className="uppercase text-[11px]">INVESTIGATION CONTROL PANEL:</span>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap items-center gap-2 flex-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;

          return (
            <button
              key={tab.key}
              onClick={() => onSelectTab(tab.key)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border font-bold transition-all cursor-pointer text-xs ${
                isActive
                  ? 'bg-cyan-950 text-cyan-300 border-cyan-500 shadow-[0_0_12px_rgba(6,182,212,0.25)]'
                  : 'bg-dark-900 text-slate-400 border-dark-700 hover:text-slate-200 hover:border-dark-600'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Report Modal Trigger Button */}
      {onOpenReportModal && (
        <button
          onClick={onOpenReportModal}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-slate-950 font-bold rounded-lg transition-colors cursor-pointer text-xs uppercase shrink-0"
        >
          <FileCheck2 className="w-3.5 h-3.5 fill-slate-950" />
          <span>REPORT</span>
        </button>
      )}
    </div>
  );
};
