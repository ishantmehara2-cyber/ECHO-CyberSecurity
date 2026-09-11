import { Lock, Globe, ShieldAlert, Monitor, Cpu, Sparkles } from 'lucide-react';
import { SiloSlotKey, UploadedEvidenceFile } from '../../types/vault';

interface SiloDataDiagramProps {
  siloFiles: Record<SiloSlotKey, UploadedEvidenceFile | null>;
}

export const SiloDataDiagram = ({ siloFiles }: SiloDataDiagramProps) => {
  const loadedCount = Object.values(siloFiles).filter(Boolean).length;

  return (
    <div className="bg-dark-800/90 border border-dark-700 rounded-xl p-5 shadow-xl relative overflow-hidden">
      {/* Background Accent */}
      <div className="absolute inset-0 bg-[radial-gradient(#06b6d4_1px,transparent_1px)] [background-size:20px_20px] opacity-15 pointer-events-none" />

      <div className="relative z-10 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-dark-700 pb-3">
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-cyan-400" />
            <h2 className="text-xs font-mono font-bold text-slate-100 uppercase tracking-wider">
              FOUR INDEPENDENT SECURITY DATA SILOS → ECHO CORRELATION CORE
            </h2>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="text-slate-400">CONNECTORS ACTIVE:</span>
            <span className={`font-bold px-2 py-0.5 rounded border ${
              loadedCount === 4 ? 'bg-emerald-950 text-emerald-400 border-emerald-800' :
              loadedCount > 0 ? 'bg-cyan-950 text-cyan-400 border-cyan-800' :
              'bg-dark-900 text-slate-500 border-dark-700'
            }`}>
              {loadedCount} / 4 SILOS
            </span>
          </div>
        </div>

        {/* Visual Silos Pathway Flow */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 items-center font-mono text-xs">

          {/* Silo 1: Identity */}
          <div className={`p-3 rounded-lg border transition-all ${
            siloFiles.identity
              ? 'bg-purple-950/60 border-purple-800 text-purple-300 shadow-[0_0_10px_rgba(168,85,247,0.2)]'
              : 'bg-dark-900/80 border-dark-700 text-slate-500'
          }`}>
            <div className="flex items-center justify-between mb-1">
              <span className="font-bold flex items-center gap-1">
                <Lock className="w-3.5 h-3.5 text-purple-400" /> IDENTITY
              </span>
              <span className="text-[9px]">{siloFiles.identity ? '✓ LOADED' : '○ EMPTY'}</span>
            </div>
            <div className="text-[10px] truncate text-slate-400">
              {siloFiles.identity ? siloFiles.identity.name : '01 Auth Telemetry'}
            </div>
          </div>

          {/* Silo 2: Network */}
          <div className={`p-3 rounded-lg border transition-all ${
            siloFiles.network
              ? 'bg-blue-950/60 border-blue-800 text-blue-300 shadow-[0_0_10px_rgba(59,130,246,0.2)]'
              : 'bg-dark-900/80 border-dark-700 text-slate-500'
          }`}>
            <div className="flex items-center justify-between mb-1">
              <span className="font-bold flex items-center gap-1">
                <Globe className="w-3.5 h-3.5 text-blue-400" /> NETWORK
              </span>
              <span className="text-[9px]">{siloFiles.network ? '✓ LOADED' : '○ EMPTY'}</span>
            </div>
            <div className="text-[10px] truncate text-slate-400">
              {siloFiles.network ? siloFiles.network.name : '02 Net Telemetry'}
            </div>
          </div>

          {/* Core Hub */}
          <div className="bg-dark-900 border border-cyan-500/80 rounded-xl p-3 text-center space-y-1 shadow-[0_0_15px_rgba(6,182,212,0.2)] relative">
            <div className="flex items-center justify-center gap-1 text-cyan-400 font-bold text-xs">
              <Sparkles className="w-3.5 h-3.5" />
              <span>ECHO CORE</span>
            </div>
            <div className="text-[10px] text-slate-400">Cross-Silo Engine</div>
          </div>

          {/* Silo 3: Threat Intel */}
          <div className={`p-3 rounded-lg border transition-all ${
            siloFiles.threat_intel
              ? 'bg-amber-950/60 border-amber-800 text-amber-300 shadow-[0_0_10px_rgba(245,158,11,0.2)]'
              : 'bg-dark-900/80 border-dark-700 text-slate-500'
          }`}>
            <div className="flex items-center justify-between mb-1">
              <span className="font-bold flex items-center gap-1">
                <ShieldAlert className="w-3.5 h-3.5 text-amber-400" /> INTEL
              </span>
              <span className="text-[9px]">{siloFiles.threat_intel ? '✓ LOADED' : '○ EMPTY'}</span>
            </div>
            <div className="text-[10px] truncate text-slate-400">
              {siloFiles.threat_intel ? siloFiles.threat_intel.name : '03 Threat Feed'}
            </div>
          </div>

          {/* Silo 4: Endpoint */}
          <div className={`p-3 rounded-lg border transition-all ${
            siloFiles.endpoint
              ? 'bg-emerald-950/60 border-emerald-800 text-emerald-300 shadow-[0_0_10px_rgba(16,185,129,0.2)]'
              : 'bg-dark-900/80 border-dark-700 text-slate-500'
          }`}>
            <div className="flex items-center justify-between mb-1">
              <span className="font-bold flex items-center gap-1">
                <Monitor className="w-3.5 h-3.5 text-emerald-400" /> ENDPOINT
              </span>
              <span className="text-[9px]">{siloFiles.endpoint ? '✓ LOADED' : '○ EMPTY'}</span>
            </div>
            <div className="text-[10px] truncate text-slate-400">
              {siloFiles.endpoint ? siloFiles.endpoint.name : '04 System Telemetry'}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
