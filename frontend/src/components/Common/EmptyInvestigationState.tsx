import { ShieldAlert, Upload, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface EmptyInvestigationStateProps {
  moduleTitle: string;
  moduleDescription: string;
}

export const EmptyInvestigationState = ({
  moduleTitle,
  moduleDescription
}: EmptyInvestigationStateProps) => {
  const navigate = useNavigate();

  return (
    <div className="p-8 sm:p-12 bg-dark-800 border border-dark-700 rounded-2xl text-center space-y-6 shadow-2xl font-sans max-w-4xl mx-auto my-8 relative overflow-hidden">
      {/* Accent Background */}
      <div className="absolute inset-0 bg-[radial-gradient(#06b6d4_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center justify-center space-y-4">
        {/* Icon */}
        <div className="p-4 rounded-2xl bg-dark-900 border border-dark-700 text-cyan-400 shadow-inner">
          <ShieldAlert className="w-10 h-10 text-cyan-400" />
        </div>

        {/* Title */}
        <div className="space-y-1">
          <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider block">
            NO INVESTIGATION DATA AVAILABLE
          </span>
          <h2 className="text-2xl font-extrabold text-slate-100 font-mono">
            {moduleTitle}
          </h2>
        </div>

        {/* Description */}
        <p className="text-sm text-slate-400 max-w-lg leading-relaxed">
          {moduleDescription}
        </p>

        {/* Status Badge */}
        <div className="px-3 py-1 rounded-full bg-dark-900 border border-dark-700 text-[11px] font-mono text-slate-500 font-bold uppercase">
          ● STATUS: AWAITING TELEMETRY EVIDENCE
        </div>

        {/* CTA Button */}
        <button
          onClick={() => navigate('/evidence-vault')}
          className="mt-4 flex items-center justify-center gap-2 px-6 py-3 bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-extrabold rounded-xl transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)] cursor-pointer text-xs uppercase font-mono tracking-wider"
        >
          <Upload className="w-4 h-4" />
          <span>UPLOAD EVIDENCE IN VAULT</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
