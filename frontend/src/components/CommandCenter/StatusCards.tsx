import { Activity, Database, ShieldCheck, AlertCircle } from 'lucide-react';

export const StatusCards = () => {
  const cards = [
    {
      title: 'SYSTEM STATUS',
      value: 'Monitoring',
      subtext: 'Operational',
      statusColor: 'emerald',
      icon: ShieldCheck,
      badge: 'Active'
    },
    {
      title: 'DATA SOURCES',
      value: 'Auth • Endpoint • Network',
      subtext: '3 Connectors Configured',
      statusColor: 'cyan',
      icon: Database,
      badge: 'Ready'
    },
    {
      title: 'INVESTIGATION STATUS',
      value: 'No active investigation',
      subtext: 'System idle',
      statusColor: 'slate',
      icon: Activity,
      badge: 'Standby'
    },
    {
      title: 'THREAT POSTURE',
      value: 'Awaiting telemetry',
      subtext: 'Baseline state',
      statusColor: 'amber',
      icon: AlertCircle,
      badge: 'Nominal'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div
            key={idx}
            className="bg-dark-800 border border-dark-700 rounded-xl p-5 hover:border-dark-600 transition-all duration-200 group relative overflow-hidden flex flex-col justify-between"
          >
            {/* Top Row */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  {card.title}
                </span>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                  card.statusColor === 'emerald' ? 'bg-emerald-950/60 text-emerald-400 border-emerald-800/50' :
                  card.statusColor === 'cyan' ? 'bg-cyan-950/60 text-cyan-400 border-cyan-800/50' :
                  card.statusColor === 'amber' ? 'bg-amber-950/60 text-amber-400 border-amber-800/50' :
                  'bg-slate-800 text-slate-400 border-slate-700'
                }`}>
                  {card.badge}
                </span>
              </div>

              {/* Main Value */}
              <div className="flex items-baseline gap-2 mt-1">
                <h2 className="text-lg font-bold text-slate-100 group-hover:text-cyan-300 transition-colors">
                  {card.value}
                </h2>
              </div>
            </div>

            {/* Subtext and Icon */}
            <div className="flex justify-between items-center mt-4 pt-3 border-t border-dark-700/50">
              <span className="text-xs font-mono text-slate-500">
                {card.subtext}
              </span>
              <Icon className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 transition-colors" />
            </div>
          </div>
        );
      })}
    </div>
  );
};
