import { useEffect, useRef, useState } from 'react';
import { Terminal, ShieldCheck, Cpu } from 'lucide-react';
import { ActivityLog } from '../../types';

export const LiveActivity = () => {
  const [logs, setLogs] = useState<ActivityLog[]>([
    { id: '1', timestamp: new Date().toISOString().split('T')[1].substring(0, 8), source: 'SYSTEM', message: 'Command Center initialized', type: 'info' },
    { id: '2', timestamp: new Date().toISOString().split('T')[1].substring(0, 8), source: 'SYSTEM', message: 'Loaded Phase 2 UI design shell', type: 'info' },
    { id: '3', timestamp: new Date().toISOString().split('T')[1].substring(0, 8), source: 'API', message: 'Checking backend availability...', type: 'info' },
    { id: '4', timestamp: new Date().toISOString().split('T')[1].substring(0, 8), source: 'API', message: 'Backend connection verified (HTTP 200 OK)', type: 'success' },
    { id: '5', timestamp: new Date().toISOString().split('T')[1].substring(0, 8), source: 'DEMO', message: 'Interactive investigation model ready', type: 'success' }
  ]);

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  // Periodic heartbeat log simulation
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date().toISOString().split('T')[1].substring(0, 8);
      setLogs((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          timestamp: now,
          source: 'SYSTEM',
          message: 'Telemetry heartbeat check — system operational',
          type: 'info'
        }
      ]);
    }, 45000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-dark-800 border border-dark-700 rounded-xl p-6 flex flex-col h-full shadow-lg">
      <div className="flex justify-between items-center mb-4 border-b border-dark-700 pb-3">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-cyan-400" />
          <h2 className="text-sm font-bold text-slate-100 uppercase tracking-wider">
            Live System Activity
          </h2>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono text-emerald-400">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>System Healthy</span>
        </div>
      </div>

      {/* Terminal View */}
      <div
        ref={scrollRef}
        className="flex-1 bg-dark-900 border border-dark-700/80 rounded-lg p-4 font-mono text-xs overflow-y-auto max-h-[320px] space-y-2.5"
      >
        {logs.map((log) => (
          <div key={log.id} className="flex items-start gap-2 leading-relaxed">
            <span className="text-slate-500 shrink-0">{log.timestamp}</span>
            <span className={`px-1.5 py-0.2 rounded text-[10px] font-bold shrink-0 ${
              log.source === 'SYSTEM' ? 'bg-slate-800 text-slate-300' :
              log.source === 'API' ? 'bg-cyan-950 text-cyan-400 border border-cyan-800/50' :
              log.source === 'DEMO' ? 'bg-purple-950 text-purple-400 border border-purple-800/50' :
              'bg-emerald-950 text-emerald-400'
            }`}>
              {log.source}
            </span>
            <span className={
              log.type === 'success' ? 'text-emerald-400' :
              log.type === 'warning' ? 'text-amber-400' :
              log.type === 'error' ? 'text-red-400' :
              'text-slate-300'
            }>
              {log.message}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-3 text-[11px] font-mono text-slate-500 flex items-center justify-between">
        <span className="flex items-center gap-1">
          <Cpu className="w-3 h-3 text-slate-400" /> Auto-scrolling system stream
        </span>
        <span>Ready for telemetry ingestion</span>
      </div>
    </div>
  );
};
