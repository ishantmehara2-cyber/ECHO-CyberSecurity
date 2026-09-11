import { useNavigate, useLocation } from 'react-router-dom';
import { Play, Sparkles, FolderLock, Network, GitBranch, Search } from 'lucide-react';

export const DemoFlowBar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const demoSteps = [
    { label: '1. Evidence', path: '/evidence-vault', icon: FolderLock },
    { label: '2. Live Telemetry', path: '/live-telemetry', icon: Sparkles },
    { label: '3. Correlation Graph', path: '/correlation-engine', icon: Network },
    { label: '4. Attack Timeline', path: '/attack-reconstruction', icon: GitBranch },
    { label: '5. Evidence Gaps', path: '/evidence-intelligence', icon: Search },
  ];

  return (
    <div className="bg-dark-900 border-b border-cyan-900/60 px-4 py-2 flex flex-wrap items-center justify-between gap-3 text-xs font-mono z-30 shadow-md">
      <div className="flex items-center gap-2">
        <span className="flex items-center gap-1 text-cyan-400 font-bold uppercase tracking-wider text-[11px]">
          <Play className="w-3.5 h-3.5 fill-cyan-400" /> DEMO FLOW NAVIGATION:
        </span>
        <span className="text-[10px] text-slate-500 hidden lg:inline">
          Quick-switch views for live hackathon presentation
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-1.5">
        {demoSteps.map((step) => {
          const Icon = step.icon;
          const isActive = location.pathname === step.path;

          return (
            <button
              key={step.path}
              onClick={() => navigate(step.path)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded border transition-all cursor-pointer text-[11px] ${
                isActive
                  ? 'bg-cyan-950 text-cyan-300 border-cyan-500 font-bold shadow-[0_0_10px_rgba(6,182,212,0.3)]'
                  : 'bg-dark-800 text-slate-400 border-dark-700 hover:text-slate-200 hover:border-dark-600'
              }`}
            >
              <Icon className="w-3 h-3 text-cyan-400" />
              <span>{step.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
