import { Brain, Users, Monitor, Globe, FileText, Activity } from 'lucide-react';
import { TelemetryEvent } from '../../types/telemetry';

interface IntelligenceSummaryProps {
  events: TelemetryEvent[];
}

export const IntelligenceSummary = ({ events }: IntelligenceSummaryProps) => {
  // Extract unique entities dynamically from ingested events
  const users = Array.from(new Set(events.map((e) => e.user).filter(Boolean))) as string[];
  const devices = Array.from(new Set(events.map((e) => e.device).filter(Boolean))) as string[];
  const ips = Array.from(new Set(events.map((e) => e.ip).filter(Boolean))) as string[];
  const assets = Array.from(new Set(events.map((e) => e.asset).filter(Boolean))) as string[];

  const stats = [
    { label: 'Events Ingested', count: events.length, icon: Activity, color: 'text-cyan-400' },
    { label: 'Active Users', count: users.length, icon: Users, color: 'text-purple-400' },
    { label: 'Devices Observed', count: devices.length, icon: Monitor, color: 'text-blue-400' },
    { label: 'Unique IPs', count: ips.length, icon: Globe, color: 'text-emerald-400' },
    { label: 'Sensitive Assets', count: assets.length, icon: FileText, color: 'text-amber-400' },
  ];

  return (
    <div className="bg-dark-800 border border-dark-700 rounded-xl p-5 shadow-lg flex flex-col h-full space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-dark-700 pb-3">
        <div className="flex items-center gap-2">
          <Brain className="w-5 h-5 text-cyan-400" />
          <h2 className="text-sm font-bold text-slate-100 uppercase tracking-wider">
            What ECHO Knows So Far
          </h2>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800 font-bold">
          LIVE METRICS
        </span>
      </div>

      {/* Grid Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {stats.map((s, idx) => {
          const Icon = s.icon;
          return (
            <div key={idx} className="bg-dark-900 border border-dark-700 rounded-lg p-3 flex flex-col justify-between">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-bold text-slate-500 uppercase">{s.label}</span>
                <Icon className={`w-3.5 h-3.5 ${s.color}`} />
              </div>
              <span className={`text-xl font-bold mt-2 ${s.color} font-mono`}>
                {s.count}
              </span>
            </div>
          );
        })}
      </div>

      {/* Discovered Entity Pills */}
      <div className="space-y-3 pt-2">
        <div className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
          Observed Entities in Stream:
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 text-xs font-mono">
          {/* Users */}
          <div className="bg-dark-900 p-3 rounded border border-dark-700">
            <span className="text-slate-500 block text-[10px] uppercase mb-1 font-bold">Users Detected ({users.length})</span>
            <div className="flex flex-wrap gap-1">
              {users.map((u, i) => (
                <span key={i} className={`px-1.5 py-0.5 rounded text-[11px] ${
                  u === 'employee_07' ? 'bg-purple-950 text-purple-300 border border-purple-800 font-bold' : 'bg-dark-800 text-slate-300'
                }`}>
                  {u}
                </span>
              ))}
            </div>
          </div>

          {/* Devices */}
          <div className="bg-dark-900 p-3 rounded border border-dark-700">
            <span className="text-slate-500 block text-[10px] uppercase mb-1 font-bold">Devices Observed ({devices.length})</span>
            <div className="flex flex-wrap gap-1">
              {devices.map((d, i) => (
                <span key={i} className={`px-1.5 py-0.5 rounded text-[11px] ${
                  d === 'WORKSTATION-07' ? 'bg-blue-950 text-blue-300 border border-blue-800 font-bold' : 'bg-dark-800 text-slate-300'
                }`}>
                  {d}
                </span>
              ))}
            </div>
          </div>

          {/* IPs */}
          <div className="bg-dark-900 p-3 rounded border border-dark-700">
            <span className="text-slate-500 block text-[10px] uppercase mb-1 font-bold">IP Addresses ({ips.length})</span>
            <div className="flex flex-wrap gap-1">
              {ips.map((ip, i) => (
                <span key={i} className={`px-1.5 py-0.5 rounded text-[11px] ${
                  ip === '185.220.101.44' || ip === '45.33.32.156' ? 'bg-red-950 text-red-300 border border-red-800 font-bold' : 'bg-dark-800 text-slate-300'
                }`}>
                  {ip}
                </span>
              ))}
            </div>
          </div>

          {/* Assets */}
          <div className="bg-dark-900 p-3 rounded border border-dark-700">
            <span className="text-slate-500 block text-[10px] uppercase mb-1 font-bold">Targeted Assets ({assets.length})</span>
            <div className="flex flex-wrap gap-1">
              {assets.map((ast, i) => (
                <span key={i} className="px-1.5 py-0.5 rounded text-[11px] bg-amber-950 text-amber-300 border border-amber-800 font-bold">
                  {ast}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
