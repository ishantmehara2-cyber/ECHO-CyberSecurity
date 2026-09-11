import { AlertTriangle, X, RotateCcw } from 'lucide-react';

interface ResetConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmReset: () => void;
}

export const ResetConfirmationModal = ({
  isOpen,
  onClose,
  onConfirmReset
}: ResetConfirmationModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-dark-900 border border-amber-500/60 rounded-2xl w-full max-w-md p-6 space-y-5 shadow-2xl relative overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-dark-800 pb-3">
          <div className="flex items-center gap-2.5 text-amber-400 font-bold font-mono">
            <AlertTriangle className="w-5 h-5" />
            <span className="text-sm uppercase tracking-wider">RESET ECHO INVESTIGATION?</span>
          </div>

          <button
            onClick={onClose}
            className="text-slate-500 hover:text-slate-300 p-1 rounded hover:bg-dark-800 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body Text */}
        <p className="text-xs text-slate-300 font-sans leading-relaxed">
          This will clear all loaded evidence documents, reset readiness states, clear extracted entities, and return the application to the beginning of the Evidence Vault.
        </p>

        {/* Buttons */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-dark-800 hover:bg-dark-700 text-slate-300 border border-dark-700 rounded-lg text-xs font-mono transition-colors cursor-pointer"
          >
            CANCEL
          </button>

          <button
            onClick={() => {
              onConfirmReset();
              onClose();
            }}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-500 text-slate-950 font-bold rounded-lg text-xs font-mono transition-colors cursor-pointer shadow-[0_0_15px_rgba(239,68,68,0.3)]"
          >
            <RotateCcw className="w-4 h-4" />
            <span>RESET INVESTIGATION</span>
          </button>
        </div>
      </div>
    </div>
  );
};
