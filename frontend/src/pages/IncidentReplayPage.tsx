import { useState, useEffect } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  ChevronRight,
  ChevronLeft,
  ShieldCheck,
  Clock,
  PlayCircle,
  HelpCircle,
  Sparkles
} from 'lucide-react';
import { EvidenceProvenanceModal } from '../components/Vault/EvidenceProvenanceModal';
import { EmptyInvestigationState } from '../components/Common/EmptyInvestigationState';
import { useInvestigation } from '../context/InvestigationContext';

export const IncidentReplayPage = () => {
  const { analysisData, hasAnalysisData } = useInvestigation();
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isProvenanceOpen, setIsProvenanceOpen] = useState<boolean>(false);

  // Use dynamic timeline stages from backend analysisData
  const timelineEvents = analysisData?.timeline || [];

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isPlaying && timelineEvents.length > 0) {
      interval = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev < timelineEvents.length - 1) {
            return prev + 1;
          } else {
            setIsPlaying(false);
            return prev;
          }
        });
      }, 2500);
    }
    return () => clearInterval(interval);
  }, [isPlaying, timelineEvents.length]);

  if (!hasAnalysisData || timelineEvents.length === 0) {
    return (
      <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
        <div className="bg-dark-800/80 border border-dark-700 rounded-xl p-6 overflow-hidden backdrop-blur-sm shadow-xl font-sans">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-800/50 text-cyan-400 text-xs font-semibold uppercase tracking-wider font-mono">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Heuristic Reconstruction</span>
            </div>

            <h1 className="text-3xl font-extrabold text-slate-100 tracking-tight flex items-center gap-3 font-mono">
              <PlayCircle className="w-8 h-8 text-cyan-400" />
              Reconstructed Multi-Stage Sequence
            </h1>

            <p className="text-slate-400 text-sm sm:text-base leading-relaxed max-w-3xl">
              {(analysisData?.total_records || 0).toLocaleString()} raw events analyzed → {timelineEvents.length} correlated investigation stages
            </p>
          </div>
        </div>

        <EmptyInvestigationState
          moduleTitle="Incident Replay Engine"
          moduleDescription="Upload evidence and complete analysis in the Evidence Vault to generate an interactive incident replay."
        />
      </div>
    );
  }

  const activeEvent = timelineEvents[currentStep] || timelineEvents[0];

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 font-sans">
      {/* Header */}
      <div className="bg-dark-800/80 border border-dark-700 rounded-xl p-6 overflow-hidden backdrop-blur-sm shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-800/50 text-cyan-400 text-xs font-semibold uppercase tracking-wider font-mono">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Step-by-Step Incident Sequence Replay</span>
            </div>

            <h1 className="text-3xl font-extrabold text-slate-100 tracking-tight flex items-center gap-3 font-mono">
              <PlayCircle className="w-8 h-8 text-cyan-400" />
              ECHO Incident Replay Engine
            </h1>

            <p className="text-slate-400 text-sm sm:text-base leading-relaxed max-w-3xl">
              Step-by-step chronological replay of the correlated multi-stage attack sequence.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 font-bold bg-emerald-950/80 px-3 py-1.5 rounded-lg border border-emerald-800 self-start md:self-auto">
            <ShieldCheck className="w-4 h-4" />
            <span>HEURISTIC RECONSTRUCTION</span>
          </div>
        </div>
      </div>

      {/* Control Bar & Progress Scrubber */}
      <div className="bg-dark-800 border border-dark-700 rounded-xl p-6 shadow-xl space-y-5">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-dark-700 pb-4">
          {/* Step Indicator */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-cyan-950 border border-cyan-500 text-cyan-400 font-mono font-extrabold flex items-center justify-center text-sm">
              0{currentStep + 1}
            </div>
            <div>
              <div className="text-xs font-mono font-bold text-cyan-400 uppercase">
                REPLAY STEP {currentStep + 1} OF {timelineEvents.length}
              </div>
              <div className="text-sm font-bold text-slate-100 mt-0.5">
                {activeEvent.eventTitle || activeEvent.stageName} ({activeEvent.timestamp})
              </div>
            </div>
          </div>

          {/* Player Buttons */}
          <div className="flex items-center gap-2 font-mono text-xs">
            <button
              onClick={() => {
                setIsPlaying(false);
                setCurrentStep((prev) => Math.max(prev - 1, 0));
              }}
              disabled={currentStep === 0}
              className="p-2 bg-dark-900 border border-dark-700 hover:bg-dark-700 text-slate-300 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {isPlaying ? (
              <button
                onClick={() => setIsPlaying(false)}
                className="flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold rounded-lg cursor-pointer"
              >
                <Pause className="w-4 h-4 fill-slate-950" />
                <span>PAUSE</span>
              </button>
            ) : (
              <button
                onClick={() => setIsPlaying(true)}
                className="flex items-center gap-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold rounded-lg cursor-pointer"
              >
                <Play className="w-4 h-4 fill-slate-950" />
                <span>PLAY</span>
              </button>
            )}

            <button
              onClick={() => {
                setIsPlaying(false);
                setCurrentStep((prev) => Math.min(prev + 1, timelineEvents.length - 1));
              }}
              disabled={currentStep === timelineEvents.length - 1}
              className="p-2 bg-dark-900 border border-dark-700 hover:bg-dark-700 text-slate-300 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => {
                setIsPlaying(false);
                setCurrentStep(0);
              }}
              title="Reset Replay"
              className="p-2 bg-dark-900 border border-dark-700 hover:bg-dark-700 text-slate-300 rounded-lg cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrubber Timeline Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2 font-mono text-xs">
          {timelineEvents.map((evt, idx) => {
            const isCurrent = idx === currentStep;
            const isPast = idx < currentStep;

            return (
              <button
                key={evt.id || idx}
                onClick={() => {
                  setIsPlaying(false);
                  setCurrentStep(idx);
                }}
                className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  isCurrent
                    ? 'bg-cyan-950 text-cyan-300 border-cyan-400 font-bold shadow-[0_0_12px_rgba(6,182,212,0.3)]'
                    : isPast
                    ? 'bg-emerald-950/40 text-emerald-400 border-emerald-900'
                    : 'bg-dark-900 text-slate-500 border-dark-700'
                }`}
              >
                <span className="text-[10px] block opacity-80">{evt.timestamp || evt.time}</span>
                <span className="truncate text-[11px] font-bold mt-1 block">{evt.eventTitle || evt.stageName}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Step Detailed Card */}
      <div className="bg-dark-800 border border-cyan-500/60 rounded-xl p-6 shadow-2xl space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-dark-700 pb-4 font-mono text-xs">
          <div className="flex items-center gap-3">
            <span className="text-cyan-400 font-bold text-sm flex items-center gap-1.5">
              <Clock className="w-4 h-4" /> {activeEvent.timestamp || activeEvent.time}
            </span>
            <span className="text-slate-200 font-bold text-base font-sans">{activeEvent.eventTitle || activeEvent.stageName}</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-400">{activeEvent.source}</span>
            <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase ${
              activeEvent.severity === 'critical' ? 'bg-red-950 text-red-400 border border-red-800' :
              activeEvent.severity === 'high' ? 'bg-amber-950 text-amber-400 border border-amber-800' :
              'bg-blue-950 text-blue-400 border border-blue-800'
            }`}>
              {activeEvent.severity || 'INFO'}
            </span>
          </div>
        </div>

        {/* Entity Context & Description */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-xs bg-dark-900 p-4 rounded-xl border border-dark-700">
          <div>
            <span className="text-slate-500 text-[10px] block uppercase font-bold">TARGET ENTITY</span>
            <span className="text-purple-300 font-bold text-sm">{activeEvent.entity}</span>
          </div>
          <div>
            <span className="text-slate-500 text-[10px] block uppercase font-bold">HOST / IP INDICATOR</span>
            <span className="text-blue-300 font-bold text-sm">{activeEvent.ipOrDevice || activeEvent.ipOrHost}</span>
          </div>
        </div>

        <p className="text-sm text-slate-200 font-sans leading-relaxed p-4 bg-dark-900 rounded-xl border border-dark-700">
          {activeEvent.connectionExplanation || activeEvent.description}
        </p>

        {/* Evidence Provenance Button */}
        <div className="flex items-center justify-between pt-2">
          <span className="text-xs text-slate-400 font-sans">
            Want to see the raw log record that supports this step?
          </span>

          <button
            onClick={() => setIsProvenanceOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-dark-900 hover:bg-dark-700 text-cyan-400 border border-cyan-800/80 rounded-lg text-xs font-mono transition-colors cursor-pointer font-bold"
          >
            <HelpCircle className="w-4 h-4" />
            <span>VIEW EVIDENCE PROVENANCE</span>
          </button>
        </div>
      </div>

      {/* Evidence Provenance Inspector Modal */}
      <EvidenceProvenanceModal
        isOpen={isProvenanceOpen}
        onClose={() => setIsProvenanceOpen(false)}
        eventTitle={activeEvent.eventTitle || activeEvent.stageName}
        sourceFile={`${(activeEvent.source || 'telemetry').toLowerCase().replace(/\s+/g, '_')}_log.txt`}
      />
    </div>
  );
};

export default IncidentReplayPage;
