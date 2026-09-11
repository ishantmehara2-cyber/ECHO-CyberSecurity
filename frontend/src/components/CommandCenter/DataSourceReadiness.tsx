import { Lock, Monitor, Globe, FileText, CheckCircle2 } from 'lucide-react';

export const DataSourceReadiness = () => {
  const sources = [
    { name: 'AUTHENTICATION', desc: 'Identity logs, SSO, Azure AD, Okta', icon: Lock, status: 'READY FOR INTEGRATION' },
    { name: 'ENDPOINT', desc: 'Process execution, EDR, Sysmon, Powershell', icon: Monitor, status: 'READY FOR INTEGRATION' },
    { name: 'NETWORK', desc: 'NetFlow, DNS queries, Firewall connections', icon: Globe, status: 'READY FOR INTEGRATION' },
    { name: 'FILE ACTIVITY', desc: 'File modifications, SMB access, Downloads', icon: FileText, status: 'READY FOR INTEGRATION' },
  ];

  return (
    <div className="bg-dark-800 border border-dark-700 rounded-xl p-6 shadow-lg">
      <div className="mb-6">
        <h2 className="text-sm font-bold text-slate-100 uppercase tracking-wider flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-cyan-400" />
          Data Source Readiness
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Planned telemetry connectors ready for multi-source ingestion in future phases.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {sources.map((src, idx) => {
          const Icon = src.icon;
          return (
            <div key={idx} className="bg-dark-900/80 border border-dark-700/80 rounded-lg p-4 flex flex-col justify-between hover:border-dark-600 transition-colors">
              <div>
                <div className="flex justify-between items-center mb-3">
                  <div className="p-2 rounded bg-dark-800 text-cyan-400">
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950/80 text-cyan-400 border border-cyan-800/60 font-bold">
                    PLANNED
                  </span>
                </div>
                <h3 className="text-xs font-bold font-mono text-slate-200 tracking-wider">
                  {src.name}
                </h3>
                <p className="text-xs text-slate-400 mt-1 leading-snug">
                  {src.desc}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-dark-700/60 flex items-center justify-between text-[11px] font-mono text-emerald-400 font-bold">
                <span>{src.status}</span>
                <CheckCircle2 className="w-3.5 h-3.5" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
