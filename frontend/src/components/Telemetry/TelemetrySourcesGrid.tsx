import { Monitor, Globe, Lock, Cpu, FileText, Radio } from 'lucide-react';
import { TelemetrySourceInfo, TelemetrySourceType } from '../../types/telemetry';

interface TelemetrySourcesGridProps {
  sources: TelemetrySourceInfo[];
  activeFilter: TelemetrySourceType | 'all';
  onSelectFilter: (source: TelemetrySourceType | 'all') => void;
  isStreaming: boolean;
}

const iconMap: Record<string, React.ElementType> = {
  Monitor,
  Globe,
  Lock,
  Cpu,
  FileText
};

export const TelemetrySourcesGrid = ({
  sources,
  activeFilter,
  onSelectFilter,
  isStreaming
}: TelemetrySourcesGridProps) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
          <Radio className="w-4 h-4 text-cyan-400" />
          Active Telemetry Connectors ({sources.length})
        </h2>
        {activeFilter !== 'all' && (
          <button
            onClick={() => onSelectFilter('all')}
            className="text-xs text-cyan-400 hover:underline font-mono"
          >
            Show All Sources
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {sources.map((src) => {
          const IconComponent = iconMap[src.iconName] || Monitor;
          const isSelected = activeFilter === src.id;

          return (
            <div
              key={src.id}
              onClick={() => onSelectFilter(isSelected ? 'all' : src.id)}
              className={`cursor-pointer rounded-xl p-4 border transition-all duration-200 relative overflow-hidden group flex flex-col justify-between ${
                isSelected
                  ? 'bg-cyan-950/60 border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.2)]'
                  : 'bg-dark-800 border-dark-700 hover:border-dark-600 hover:bg-dark-700/80'
              }`}
            >
              {/* Top Row: Icon & Status */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className={`p-2 rounded-lg ${
                    isSelected ? 'bg-cyan-900/80 text-cyan-300' : 'bg-dark-900 text-cyan-400'
                  }`}>
                    <IconComponent className="w-4 h-4" />
                  </div>

                  <div className="flex items-center gap-1.5">
                    <span className={`w-2 h-2 rounded-full ${
                      isStreaming ? 'bg-emerald-400 animate-ping' : 'bg-emerald-500'
                    }`} />
                    <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase">
                      INGESTING
                    </span>
                  </div>
                </div>

                {/* Source Name */}
                <h3 className="text-xs font-bold text-slate-100 group-hover:text-cyan-300 transition-colors">
                  {src.name}
                </h3>

                {/* Examples */}
                <div className="mt-2 text-[11px] text-slate-500 leading-tight space-y-1">
                  {src.examples.slice(0, 2).map((ex, i) => (
                    <div key={i} className="flex items-center gap-1.5 font-mono">
                      <span className="w-1 h-1 rounded-full bg-slate-600" />
                      <span className="truncate">{ex}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom Row: Metrics */}
              <div className="mt-4 pt-3 border-t border-dark-700/60 flex items-center justify-between text-[11px] font-mono">
                <div>
                  <span className="text-slate-500 block text-[9px] uppercase">EVENTS</span>
                  <span className="font-bold text-cyan-400">{src.eventCount}</span>
                </div>
                <div className="text-right">
                  <span className="text-slate-500 block text-[9px] uppercase">LATEST</span>
                  <span className="text-slate-300">{src.latestActivity}</span>
                </div>
              </div>

              {/* Data Flow Pulse Overlay Line when streaming */}
              {isStreaming && (
                <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-pulse" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
