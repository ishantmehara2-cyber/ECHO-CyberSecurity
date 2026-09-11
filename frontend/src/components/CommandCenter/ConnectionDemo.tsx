import { useState, useEffect } from 'react';
import {
  Play,
  RotateCcw,
  CheckCircle2,
  Sparkles,
  Fingerprint,
  Monitor,
  Globe,
  Info,
  Clock,
  ArrowRight
} from 'lucide-react';

export const ConnectionDemo = () => {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(false);

  const steps = [
    { title: 'COMPARING IDENTITIES', action: 'Highlighting shared identity across logs...', highlightField: 'user', matchText: 'MATCH FOUND: employee_07' },
    { title: 'COMPARING DEVICES', action: 'Comparing originating host workstations...', highlightField: 'host', matchText: 'MATCH FOUND: WORKSTATION-07' },
    { title: 'COMPARING TIME RELATIONSHIPS', action: 'Analyzing temporal sequence (09:02 → 09:04 → 09:06)...', highlightField: 'time', matchText: 'TEMPORAL SEQUENCE FOUND' },
    { title: 'CHECKING EVENT PROGRESSION', action: 'Evaluating behavior flow (Login → Process → Network)...', highlightField: 'event', matchText: 'LOGICAL SEQUENCE IDENTIFIED' },
    { title: 'CREATING EVIDENCE RELATIONSHIPS', action: 'Constructing evidence connection graph...', highlightField: 'all', matchText: 'RELATIONSHIPS MAP COMPLETE' },
    { title: 'CORRELATION ANALYSIS COMPLETE', action: 'Synthesis finished. Related activity identified.', highlightField: 'complete', matchText: 'RELATED ACTIVITY IDENTIFIED' }
  ];

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (isRunning && currentStep > 0 && currentStep < 6) {
      timer = setTimeout(() => {
        setCurrentStep((prev) => prev + 1);
      }, 1500);
    } else if (currentStep === 6) {
      setIsRunning(false);
    }
    return () => clearTimeout(timer);
  }, [isRunning, currentStep]);

  const handleRunDemo = () => {
    setCurrentStep(1);
    setIsRunning(true);
  };

  const handleReset = () => {
    setCurrentStep(0);
    setIsRunning(false);
  };

  const isUserHighlighted = currentStep >= 1;
  const isHostHighlighted = currentStep >= 2;
  const isTimeHighlighted = currentStep >= 3;
  const isProgressionHighlighted = currentStep >= 4;
  const isConnected = currentStep >= 5;

  return (
    <div className="bg-dark-800 border border-dark-700 rounded-xl p-6 shadow-xl relative overflow-hidden">

      {/* Section Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 border-b border-dark-700 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[11px] font-mono font-bold bg-cyan-950 text-cyan-400 border border-cyan-800">
              <Sparkles className="w-3 h-3" />
              INTERACTIVE CONNECTION DEMONSTRATION
            </span>
            <span className="text-xs text-slate-500 font-mono hidden md:inline">// Phase 2 Illustration</span>
          </div>
          <h2 className="text-xl font-bold text-slate-100 mt-2">
            How ECHO Connects the Dots
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Watch ECHO analyze three seemingly separate events from different telemetry streams.
          </p>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-3">
          {currentStep === 0 ? (
            <button
              onClick={handleRunDemo}
              className="flex items-center gap-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold rounded-lg transition-all shadow-[0_0_15px_rgba(6,182,212,0.3)] hover:shadow-[0_0_20px_rgba(6,182,212,0.5)] cursor-pointer text-sm"
            >
              <Play className="w-4 h-4 fill-slate-950" />
              <span>RUN CONNECTION DEMO</span>
            </button>
          ) : (
            <button
              onClick={handleReset}
              className="flex items-center gap-2 px-4 py-2 bg-dark-700 hover:bg-dark-600 text-slate-200 font-bold rounded-lg transition-all border border-dark-600 cursor-pointer text-sm"
            >
              <RotateCcw className="w-4 h-4" />
              <span>RESET / REPLAY</span>
            </button>
          )}
        </div>
      </div>

      {/* Progress / Step Banner */}
      {currentStep > 0 && (
        <div className="mb-6 p-4 bg-dark-900 border border-cyan-900/60 rounded-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-cyan-950 border border-cyan-500 flex items-center justify-center font-mono font-bold text-cyan-400 text-xs shrink-0">
              0{currentStep}
            </div>
            <div>
              <div className="text-xs font-mono font-bold text-cyan-400">
                STEP {currentStep} OF 6: {steps[currentStep - 1].title}
              </div>
              <div className="text-xs text-slate-300 mt-0.5">
                {steps[currentStep - 1].action}
              </div>
            </div>
          </div>

          <div className="px-3 py-1 bg-emerald-950/80 border border-emerald-800 text-emerald-400 rounded text-xs font-mono font-bold flex items-center gap-1.5 self-end md:self-auto">
            <CheckCircle2 className="w-3.5 h-3.5" />
            {steps[currentStep - 1].matchText}
          </div>
        </div>
      )}

      {/* Cards Display Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative my-8">

        {/* Animated Connection Overlay Lines for Step 5+ */}
        {isConnected && (
          <div className="absolute inset-0 pointer-events-none hidden md:block z-20">
            <svg className="w-full h-full" style={{ overflow: 'visible' }}>
              <line
                x1="30%" y1="50%" x2="70%" y2="50%"
                stroke="#06b6d4" strokeWidth="2" strokeDasharray="6 4"
                className="animate-pulse"
              />
            </svg>
          </div>
        )}

        {/* CARD A: AUTHENTICATION */}
        <div className={`bg-dark-900 border rounded-xl p-5 relative transition-all duration-300 ${
          isConnected ? 'border-cyan-500 shadow-[0_0_20px_rgba(6,182,212,0.15)]' : 'border-dark-700'
        }`}>
          <div className="flex justify-between items-center mb-4 border-b border-dark-800 pb-3">
            <div className="flex items-center gap-2">
              <Fingerprint className="w-4 h-4 text-purple-400" />
              <span className="text-xs font-bold text-purple-400 font-mono">AUTHENTICATION</span>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-dark-800 text-slate-400">CARD A</span>
          </div>

          <div className="space-y-3 font-mono text-xs">
            <div className={`p-2 rounded transition-colors ${
              isUserHighlighted ? 'bg-purple-950/80 text-purple-300 border border-purple-800/80 font-bold' : 'text-slate-400'
            }`}>
              <span className="text-slate-500 block text-[10px]">USER</span>
              employee_07
            </div>

            <div className={`p-2 rounded transition-colors ${
              isProgressionHighlighted ? 'bg-cyan-950/60 text-cyan-300 border border-cyan-800/60' : 'text-slate-400'
            }`}>
              <span className="text-slate-500 block text-[10px]">EVENT</span>
              Successful Login
            </div>

            <div className={`p-2 rounded transition-colors ${
              isTimeHighlighted ? 'bg-amber-950/60 text-amber-300 border border-amber-800/60' : 'text-slate-400'
            }`}>
              <span className="text-slate-500 block text-[10px]">TIME</span>
              09:02
            </div>

            <div className={`p-2 rounded transition-colors ${
              isHostHighlighted ? 'bg-blue-950/80 text-blue-300 border border-blue-800/80 font-bold' : 'text-slate-400'
            }`}>
              <span className="text-slate-500 block text-[10px]">HOST</span>
              WORKSTATION-07
            </div>
          </div>
        </div>

        {/* CARD B: ENDPOINT */}
        <div className={`bg-dark-900 border rounded-xl p-5 relative transition-all duration-300 ${
          isConnected ? 'border-cyan-500 shadow-[0_0_20px_rgba(6,182,212,0.15)]' : 'border-dark-700'
        }`}>
          <div className="flex justify-between items-center mb-4 border-b border-dark-800 pb-3">
            <div className="flex items-center gap-2">
              <Monitor className="w-4 h-4 text-blue-400" />
              <span className="text-xs font-bold text-blue-400 font-mono">ENDPOINT</span>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-dark-800 text-slate-400">CARD B</span>
          </div>

          <div className="space-y-3 font-mono text-xs">
            <div className={`p-2 rounded transition-colors ${
              isUserHighlighted ? 'bg-purple-950/80 text-purple-300 border border-purple-800/80 font-bold' : 'text-slate-400'
            }`}>
              <span className="text-slate-500 block text-[10px]">USER</span>
              employee_07
            </div>

            <div className={`p-2 rounded transition-colors ${
              isProgressionHighlighted ? 'bg-cyan-950/60 text-cyan-300 border border-cyan-800/60' : 'text-slate-400'
            }`}>
              <span className="text-slate-500 block text-[10px]">EVENT</span>
              Process Execution
            </div>

            <div className={`p-2 rounded transition-colors ${
              isTimeHighlighted ? 'bg-amber-950/60 text-amber-300 border border-amber-800/60' : 'text-slate-400'
            }`}>
              <span className="text-slate-500 block text-[10px]">TIME</span>
              09:04
            </div>

            <div className={`p-2 rounded transition-colors ${
              isHostHighlighted ? 'bg-blue-950/80 text-blue-300 border border-blue-800/80 font-bold' : 'text-slate-400'
            }`}>
              <span className="text-slate-500 block text-[10px]">HOST</span>
              WORKSTATION-07
            </div>
          </div>
        </div>

        {/* CARD C: NETWORK */}
        <div className={`bg-dark-900 border rounded-xl p-5 relative transition-all duration-300 ${
          isConnected ? 'border-cyan-500 shadow-[0_0_20px_rgba(6,182,212,0.15)]' : 'border-dark-700'
        }`}>
          <div className="flex justify-between items-center mb-4 border-b border-dark-800 pb-3">
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-bold text-emerald-400 font-mono">NETWORK</span>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-dark-800 text-slate-400">CARD C</span>
          </div>

          <div className="space-y-3 font-mono text-xs">
            <div className={`p-2 rounded transition-colors ${
              isHostHighlighted ? 'bg-blue-950/80 text-blue-300 border border-blue-800/80 font-bold' : 'text-slate-400'
            }`}>
              <span className="text-slate-500 block text-[10px]">HOST</span>
              WORKSTATION-07
            </div>

            <div className={`p-2 rounded transition-colors ${
              isProgressionHighlighted ? 'bg-cyan-950/60 text-cyan-300 border border-cyan-800/60' : 'text-slate-400'
            }`}>
              <span className="text-slate-500 block text-[10px]">EVENT</span>
              External Connection
            </div>

            <div className={`p-2 rounded transition-colors ${
              isTimeHighlighted ? 'bg-amber-950/60 text-amber-300 border border-amber-800/60' : 'text-slate-400'
            }`}>
              <span className="text-slate-500 block text-[10px]">TIME</span>
              09:06
            </div>

            <div className="p-2 rounded text-slate-400">
              <span className="text-slate-500 block text-[10px]">DESTINATION</span>
              External Endpoint
            </div>
          </div>
        </div>

      </div>

      {/* FINAL EXPLANATION PANEL */}
      {currentStep === 6 && (
        <div className="mt-8 p-6 bg-cyan-950/40 border border-cyan-500/50 rounded-xl space-y-4 animate-fade-in">
          <div className="flex items-center justify-between border-b border-cyan-900/60 pb-3">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <h3 className="text-base font-bold text-slate-100 uppercase tracking-wider">
                WHY DID ECHO CONNECT THESE?
              </h3>
            </div>
            <span className="text-xs font-mono px-2.5 py-1 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 font-bold">
              RELATED ACTIVITY IDENTIFIED
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            <div className="bg-dark-900/80 p-3 rounded border border-dark-700">
              <div className="font-bold text-cyan-400 flex items-center gap-1.5 mb-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Shared Identity
              </div>
              <div className="font-mono text-slate-300">employee_07</div>
            </div>

            <div className="bg-dark-900/80 p-3 rounded border border-dark-700">
              <div className="font-bold text-cyan-400 flex items-center gap-1.5 mb-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Shared Host
              </div>
              <div className="font-mono text-slate-300">WORKSTATION-07</div>
            </div>

            <div className="bg-dark-900/80 p-3 rounded border border-dark-700">
              <div className="font-bold text-cyan-400 flex items-center gap-1.5 mb-1">
                <Clock className="w-3.5 h-3.5 text-emerald-400" /> Time Relationship
              </div>
              <div className="font-mono text-slate-300">4 minutes total sequence</div>
            </div>

            <div className="bg-dark-900/80 p-3 rounded border border-dark-700">
              <div className="font-bold text-cyan-400 flex items-center gap-1.5 mb-1">
                <ArrowRight className="w-3.5 h-3.5 text-emerald-400" /> Sequential Behavior
              </div>
              <div className="font-mono text-slate-300">Login → Process → Network</div>
            </div>
          </div>
        </div>
      )}

      {/* Footer Disclaimer */}
      <div className="mt-6 pt-4 border-t border-dark-700/60 flex items-center gap-2 text-[11px] font-mono text-slate-500">
        <Info className="w-3.5 h-3.5 text-cyan-500/70 shrink-0" />
        <span>
          Note: This interactive illustration simulates ECHO&apos;s upcoming evidence-correlation engine.
        </span>
      </div>

    </div>
  );
};
