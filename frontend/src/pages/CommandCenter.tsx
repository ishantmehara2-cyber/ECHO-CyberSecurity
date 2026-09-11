import {
  Server,
  ShieldAlert,
  Activity,
  Fingerprint,
  Monitor,
  Network,
  ArrowRight,
  Database,
  Search,
  CheckCircle2,
  TerminalSquare
} from 'lucide-react';

const CommandCenter = () => {
  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">

      {/* Hero */}
      <div className="border-b border-dark-700 pb-6">
        <h1 className="text-3xl font-bold text-slate-100 flex items-center gap-3">
          ECHO Command Center
        </h1>
        <p className="text-slate-400 mt-2 text-lg">
          Turning disconnected security events into an explainable attack story.
        </p>
      </div>

      {/* System Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'System Status', value: 'INITIALIZED', icon: Server, color: 'text-emerald-400' },
          { label: 'Telemetry Sources', value: '0 CONNECTED', icon: Database, color: 'text-slate-400', sub: 'Awaiting Phase 2' },
          { label: 'Active Incidents', value: '0', icon: ShieldAlert, color: 'text-slate-400', sub: 'Monitoring paused' },
          { label: 'Threat Level', value: 'BASELINE', icon: Activity, color: 'text-cyan-400' },
        ].map((card, i) => (
          <div key={i} className="bg-dark-800 border border-dark-700 rounded-lg p-5 flex flex-col relative overflow-hidden group">
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{card.label}</span>
              <card.icon className={`w-5 h-5 ${card.color} opacity-80`} />
            </div>
            <span className={`text-xl font-bold mt-1 ${card.color}`}>{card.value}</span>
            {card.sub && <span className="text-xs text-slate-500 mt-2 font-mono">{card.sub}</span>}
          </div>
        ))}
      </div>

      {/* Investigation Pipeline */}
      <div className="bg-dark-800 border border-dark-700 rounded-lg p-6">
        <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-6 flex items-center gap-2">
          <Activity className="w-4 h-4 text-cyan-400" />
          Planned Investigation Pipeline
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-6 gap-2">
          {[
            { step: 'INGEST', desc: 'Receive raw security events' },
            { step: 'NORMALIZE', desc: 'Convert into one comparable format' },
            { step: 'COMPARE', desc: 'Look for same identities & devices' },
            { step: 'CONNECT', desc: 'Link events with similarities' },
            { step: 'RECONSTRUCT', desc: 'Build the attack timeline' },
            { step: 'EXPLAIN', desc: 'Translate findings to plain text' }
          ].map((stage, i) => (
            <div key={i} className="bg-dark-900 border border-dark-700 rounded p-4 flex flex-col gap-2 relative">
              <div className="text-xs font-bold text-cyan-500 font-mono">0{i+1} // {stage.step}</div>
              <div className="text-xs text-slate-400 leading-relaxed">{stage.desc}</div>
              {i < 5 && (
                <ArrowRight className="absolute -right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-600 hidden lg:block z-10 bg-dark-800" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Grid for Educational Panel & Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* How ECHO Connects the Dots */}
        <div className="bg-dark-800 border border-dark-700 rounded-lg p-6">
          <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-6 flex items-center gap-2">
            <Network className="w-4 h-4 text-cyan-400" />
            How ECHO Connects the Dots (Example)
          </h2>

          <div className="space-y-4">
            <div className="flex items-center gap-4 p-3 bg-dark-900 border border-dark-700 rounded text-sm">
              <Fingerprint className="w-5 h-5 text-purple-400" />
              <div className="flex-1">
                <div className="text-slate-300 font-medium">AUTHENTICATION DATA</div>
                <div className="text-xs text-slate-500 font-mono">employee_07 logged in</div>
              </div>
            </div>

            <div className="flex items-center justify-center -my-2 text-dark-600">
              <div className="h-4 border-l-2 border-dashed border-dark-600"></div>
            </div>

            <div className="flex items-center gap-4 p-3 bg-dark-900 border border-dark-700 rounded text-sm">
              <Monitor className="w-5 h-5 text-blue-400" />
              <div className="flex-1">
                <div className="text-slate-300 font-medium">ENDPOINT DATA</div>
                <div className="text-xs text-slate-500 font-mono">process executed on WORKSTATION-07</div>
              </div>
            </div>

            <div className="p-4 mt-6 bg-cyan-950/30 border border-cyan-900/50 rounded-lg">
              <div className="text-xs font-semibold text-cyan-400 mb-2 flex items-center gap-2">
                <Search className="w-4 h-4" /> ECHO LOOKS FOR SIMILARITIES
              </div>
              <ul className="space-y-2 text-sm text-slate-300 mb-4">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Same identity mapped</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Same device mapped</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Close timestamps</li>
              </ul>
              <div className="border-t border-cyan-900/50 pt-3 mt-3 text-xs font-bold text-cyan-300 tracking-wide text-center uppercase">
                Related events connected
              </div>
            </div>
          </div>
        </div>

        {/* Live Processing Activity */}
        <div className="bg-dark-800 border border-dark-700 rounded-lg p-6 flex flex-col">
          <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-6 flex items-center gap-2">
            <TerminalSquare className="w-4 h-4 text-cyan-400" />
            Live Processing Activity
          </h2>

          <div className="flex-1 bg-dark-900 border border-dark-700 rounded p-4 font-mono text-xs overflow-y-auto max-h-[400px]">
            <div className="space-y-3">
              <div className="flex gap-3 text-slate-400">
                <span className="text-dark-500">[SYSTEM]</span>
                <span>ECHO interface initialized</span>
              </div>
              <div className="flex gap-3 text-slate-400">
                <span className="text-dark-500">[SYSTEM]</span>
                <span>Applying cybersecurity UI shell... Done.</span>
              </div>
              <div className="flex gap-3 text-cyan-500">
                <span className="text-dark-500">[API]</span>
                <span>API health check requested...</span>
              </div>
              <div className="flex gap-3 text-emerald-400">
                <span className="text-dark-500">[API]</span>
                <span>Backend connection verified. ECHO is online.</span>
              </div>
              <div className="flex gap-3 text-yellow-500/70 mt-6 pt-4 border-t border-dark-700/50">
                <span className="text-dark-500">[INFO]</span>
                <span>Phase 1 complete. Awaiting Phase 2 telemetry ingestion...</span>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};

export default CommandCenter;
