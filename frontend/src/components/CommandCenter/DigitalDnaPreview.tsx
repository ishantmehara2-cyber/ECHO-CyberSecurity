import { Dna, Sparkles, User, Laptop, Wifi, Clock, MessageSquare } from 'lucide-react';

export const DigitalDnaPreview = () => {
  const signalTypes = [
    { name: 'Identity Fingerprint', icon: User, desc: 'Cross-platform user mapping' },
    { name: 'Device Behaviour', icon: Laptop, desc: 'Execution patterns & process baselines' },
    { name: 'Network Behaviour', icon: Wifi, desc: 'Traffic flow & destination signatures' },
    { name: 'Activity Timing', icon: Clock, desc: 'Temporal clustering & periodicity' },
    { name: 'Communication Patterns', icon: MessageSquare, desc: 'Inter-host & protocol graphs' }
  ];

  return (
    <div className="bg-dark-800 border border-dark-700 rounded-xl p-6 shadow-lg relative overflow-hidden">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-6 border-b border-dark-700 pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[11px] font-mono font-bold bg-purple-950 text-purple-400 border border-purple-800/80">
            <Sparkles className="w-3 h-3" />
            <span>FEATURE PREVIEW</span>
          </div>
          <h2 className="text-lg font-bold text-slate-100 mt-2 flex items-center gap-2">
            <Dna className="w-5 h-5 text-purple-400" />
            ECHO Digital DNA Engine
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Compare multiple behavioural and technical signals to identify hidden similarities between seemingly unrelated entities.
          </p>
        </div>

        <div className="text-xs font-mono px-3 py-1 bg-dark-900 text-purple-300 border border-purple-800/50 rounded-full shrink-0">
          Coming in ECHO Intelligence Phase
        </div>
      </div>

      {/* Signal Type Blueprint Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
        {signalTypes.map((sig, idx) => {
          const Icon = sig.icon;
          return (
            <div key={idx} className="bg-dark-900/80 border border-dark-700/80 rounded-lg p-3 flex flex-col justify-between opacity-80 hover:opacity-100 transition-opacity">
              <div className="flex items-center gap-2 mb-2">
                <div className="p-1.5 rounded bg-purple-950/80 text-purple-400">
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <span className="text-xs font-bold text-slate-200">{sig.name}</span>
              </div>
              <p className="text-[11px] text-slate-500 font-mono leading-tight">
                {sig.desc}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
