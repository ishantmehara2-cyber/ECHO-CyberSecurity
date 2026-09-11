import { useRef, useEffect } from 'react';
import {
  Filter,
  Monitor,
  Globe,
  Lock,
  Cpu,
  FileText,
  ArrowRight
} from 'lucide-react';
import { TelemetryEvent, TelemetrySourceType, EventSeverity } from '../../types/telemetry';

interface LiveEventStreamProps {
  events: TelemetryEvent[];
  selectedEventId: string | null;
  onSelectEvent: (event: TelemetryEvent) => void;
  sourceFilter: TelemetrySourceType | 'all';
  severityFilter: EventSeverity | 'all';
  onChangeSourceFilter: (source: TelemetrySourceType | 'all') => void;
  onChangeSeverityFilter: (severity: EventSeverity | 'all') => void;
}

const sourceIconMap: Record<TelemetrySourceType, React.ElementType> = {
  endpoint: Monitor,
  network: Globe,
  authentication: Lock,
  application: Cpu,
  file: FileText
};

export const LiveEventStream = ({
  events,
  selectedEventId,
  onSelectEvent,
  sourceFilter,
  severityFilter,
  onChangeSourceFilter,
  onChangeSeverityFilter
}: LiveEventStreamProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [events]);

  const filteredEvents = events.filter((evt) => {
    if (sourceFilter !== 'all' && evt.source !== sourceFilter) return false;
    if (severityFilter !== 'all' && evt.severity !== severityFilter) return false;
    return true;
  });

  return (
    <div className="bg-dark-800 border border-dark-700 rounded-xl p-5 shadow-xl flex flex-col h-full space-y-4">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-dark-700 pb-3">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-cyan-400" />
          <h2 className="text-sm font-bold text-slate-100 uppercase tracking-wider">
            Live Telemetry Stream ({filteredEvents.length})
          </h2>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
          {/* Source Filter Dropdown */}
          <select
            value={sourceFilter}
            onChange={(e) => onChangeSourceFilter(e.target.value as TelemetrySourceType | 'all')}
            className="bg-dark-900 border border-dark-700 text-slate-300 rounded px-2.5 py-1 text-xs focus:border-cyan-500 outline-none"
          >
            <option value="all">Source: All ({events.length})</option>
            <option value="authentication">Auth</option>
            <option value="endpoint">Endpoint</option>
            <option value="network">Network</option>
            <option value="application">App</option>
            <option value="file">File</option>
          </select>

          {/* Severity Filter Dropdown */}
          <select
            value={severityFilter}
            onChange={(e) => onChangeSeverityFilter(e.target.value as EventSeverity | 'all')}
            className="bg-dark-900 border border-dark-700 text-slate-300 rounded px-2.5 py-1 text-xs focus:border-cyan-500 outline-none"
          >
            <option value="all">Severity: All</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
            <option value="info">Info</option>
          </select>
        </div>
      </div>

      {/* Stream List */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto max-h-[420px] space-y-2 pr-1"
      >
        {filteredEvents.length === 0 ? (
          <div className="p-8 text-center text-slate-500 font-mono text-xs">
            No events match the selected filters.
          </div>
        ) : (
          filteredEvents.map((evt) => {
            const Icon = sourceIconMap[evt.source] || Monitor;
            const isSelected = evt.id === selectedEventId;

            return (
              <div
                key={evt.id}
                onClick={() => onSelectEvent(evt)}
                className={`cursor-pointer rounded-lg p-3.5 border transition-all duration-200 relative ${
                  isSelected
                    ? 'bg-cyan-950/70 border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.2)]'
                    : evt.isAttackSequence
                    ? 'bg-red-950/20 border-red-900/50 hover:border-red-600'
                    : 'bg-dark-900/90 border-dark-700/80 hover:border-dark-600 hover:bg-dark-700/60'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  {/* Left: Source Icon, Timestamp & Title */}
                  <div className="flex items-center gap-3">
                    <div className={`p-1.5 rounded ${
                      evt.severity === 'critical' ? 'bg-red-950 text-red-400 border border-red-800' :
                      evt.severity === 'high' ? 'bg-orange-950 text-orange-400 border border-orange-800' :
                      evt.severity === 'medium' ? 'bg-amber-950 text-amber-400 border border-amber-800' :
                      'bg-dark-800 text-cyan-400'
                    }`}>
                      <Icon className="w-4 h-4" />
                    </div>

                    <div>
                      <div className="flex items-center gap-2 font-mono text-xs">
                        <span className="text-slate-400 font-bold">{evt.timestamp}</span>
                        <span className="text-slate-600">•</span>
                        <span className="text-cyan-400 uppercase font-bold text-[11px]">{evt.source}</span>
                        {evt.isAttackSequence && (
                          <span className="text-[10px] px-1.5 py-0.2 bg-red-950 text-red-400 border border-red-800 rounded font-bold">
                            ATTACK SEQUENCE
                          </span>
                        )}
                      </div>
                      <h4 className="text-xs font-bold text-slate-200 mt-0.5">
                        {evt.title}
                      </h4>
                    </div>
                  </div>

                  {/* Right: Severity Badge & Entity Context */}
                  <div className="flex items-center gap-3 self-end sm:self-auto font-mono text-xs">
                    {/* User / Host / IP Info */}
                    <div className="text-right hidden sm:block text-[11px]">
                      {evt.user && <span className="text-purple-300 block">{evt.user}</span>}
                      {evt.device && <span className="text-blue-300 block">{evt.device}</span>}
                      {!evt.device && evt.ip && <span className="text-emerald-300 block">{evt.ip}</span>}
                    </div>

                    {/* Severity Pill */}
                    <span className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${
                      evt.severity === 'critical' ? 'bg-red-950 text-red-400 border border-red-800' :
                      evt.severity === 'high' ? 'bg-orange-950 text-orange-400 border border-orange-800' :
                      evt.severity === 'medium' ? 'bg-amber-950 text-amber-400 border border-amber-800' :
                      evt.severity === 'low' ? 'bg-blue-950 text-blue-400 border border-blue-800' :
                      'bg-slate-800 text-slate-400'
                    }`}>
                      {evt.severity}
                    </span>

                    <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
                  </div>
                </div>

                <p className="text-xs text-slate-400 mt-2 font-sans line-clamp-1">
                  {evt.description}
                </p>
              </div>
            );
          })
        )}
      </div>

      <div className="text-[11px] font-mono text-slate-500 pt-2 border-t border-dark-700/60 flex items-center justify-between">
        <span>Click any event item above to view its raw vs. normalized schema.</span>
        <span>{filteredEvents.length} Items</span>
      </div>
    </div>
  );
};
