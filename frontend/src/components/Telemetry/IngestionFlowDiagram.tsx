import { Database, Binary, Network, ShieldCheck, ArrowRight } from 'lucide-react';

interface IngestionFlowDiagramProps {
  isStreaming: boolean;
}

export const IngestionFlowDiagram = ({ isStreaming }: IngestionFlowDiagramProps) => {
  const steps = [
    {
      label: 'MULTIPLE SOURCES',
      sub: 'Endpoint, Network, Auth, Apps',
      icon: Database,
      color: 'text-purple-400'
    },
    {
      label: 'RAW TELEMETRY',
      sub: 'JSON, Syslog, CEF, PCAP',
      icon: Binary,
      color: 'text-amber-400'
    },
    {
      label: 'ECHO INGESTION',
      sub: 'Stream buffering & routing',
      icon: Network,
      color: 'text-cyan-400'
    },
    {
      label: 'NORMALIZATION',
      sub: 'Entity & schema alignment',
      icon: Binary,
      color: 'text-blue-400'
    },
    {
      label: 'UNIFIED ECHO EVENT',
      sub: 'Standardized security model',
      icon: ShieldCheck,
      color: 'text-emerald-400'
    }
  ];

  return (
    <div className="bg-dark-800 border border-dark-700 rounded-xl p-5 shadow-lg relative overflow-hidden">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
          <Network className="w-4 h-4 text-cyan-400" />
          Ingestion & Normalization Data Pathway
        </h2>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-dark-900 text-cyan-400 border border-cyan-800">
          REAL-TIME PIPELINE
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-3 relative">
        {steps.map((step, i) => {
          const Icon = step.icon;
          return (
            <div
              key={i}
              className={`bg-dark-900 border border-dark-700 rounded-lg p-3 flex flex-col justify-between relative transition-all duration-300 ${
                isStreaming ? 'border-cyan-800/60 shadow-[0_0_10px_rgba(6,182,212,0.1)]' : ''
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono font-bold text-slate-500">0{i + 1}</span>
                  <Icon className={`w-4 h-4 ${step.color}`} />
                </div>
                <h3 className="text-xs font-bold text-slate-200 tracking-wider">
                  {step.label}
                </h3>
                <p className="text-[11px] text-slate-400 mt-1 font-mono leading-tight">
                  {step.sub}
                </p>
              </div>

              {i < 4 && (
                <div className="hidden md:block absolute -right-3 top-1/2 -translate-y-1/2 z-10">
                  <ArrowRight className={`w-4 h-4 ${isStreaming ? 'text-cyan-400 animate-pulse' : 'text-slate-600'}`} />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Animated glowing flow line when streaming */}
      {isStreaming && (
        <div className="mt-3 h-1 bg-dark-900 rounded-full overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-cyan-400 to-emerald-400 animate-pulse" />
        </div>
      )}
    </div>
  );
};
