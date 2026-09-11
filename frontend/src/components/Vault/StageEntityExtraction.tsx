import { useEffect, useState, useRef } from 'react';
import {
  Users,
  Globe,
  Monitor,
  Search,
  FileText,
  Key,
  CheckCircle2,
  Loader2,
  ArrowRight
} from 'lucide-react';
import { ExtractedEntity } from '../../types/vault';
import { DEMO_EXTRACTED_ENTITIES } from '../../data/vaultDemoData';

interface StageEntityExtractionProps {
  onCompleteStage: () => void;
  isDemoMode: boolean;
  totalParsedRecords?: number;
  customEntities?: ExtractedEntity[];
}

export const StageEntityExtraction = ({
  onCompleteStage,
  isDemoMode,
  totalParsedRecords = 2214,
  customEntities
}: StageEntityExtractionProps) => {
  const targetEventCount = (customEntities && customEntities.length > 0)
    ? (totalParsedRecords || customEntities.length)
    : isDemoMode
    ? 2214
    : (totalParsedRecords || 640);

  const targetEntities = (customEntities && customEntities.length > 0)
    ? customEntities
    : isDemoMode
    ? DEMO_EXTRACTED_ENTITIES
    : DEMO_EXTRACTED_ENTITIES.slice(0, 6);

  const [currentRecord, setCurrentRecord] = useState<number>(0);
  const [pipelinePhase, setPipelinePhase] = useState<string>('READING TELEMETRY');
  const [visibleEntities, setVisibleEntities] = useState<ExtractedEntity[]>([]);
  const [status, setStatus] = useState<'extracting' | 'complete'>('extracting');

  const hasStartedRef = useRef<boolean>(false);

  useEffect(() => {
    if (hasStartedRef.current) return;
    hasStartedRef.current = true;

    // Phases with thresholds
    const phases = [
      { threshold: Math.floor(targetEventCount * 0.2), name: 'READING TELEMETRY' },
      { threshold: Math.floor(targetEventCount * 0.45), name: 'ENTITY EXTRACTION' },
      { threshold: Math.floor(targetEventCount * 0.70), name: 'CROSS-SOURCE CORRELATION' },
      { threshold: Math.floor(targetEventCount * 0.90), name: 'TEMPORAL ANALYSIS' },
      { threshold: targetEventCount, name: 'FINAL RECONSTRUCTION' }
    ];

    let count = 0;
    let timerId: ReturnType<typeof setTimeout>;

    // Smooth, non-looping monotonic progress steps
    const step = () => {
      let inc = 0;
      if (count < targetEventCount * 0.3) {
        inc = Math.max(1, Math.floor(targetEventCount * 0.1));
      } else if (count < targetEventCount * 0.7) {
        inc = Math.max(1, Math.floor(targetEventCount * 0.05));
      } else if (count < targetEventCount * 0.95) {
        inc = Math.max(1, Math.floor(targetEventCount * 0.02));
      } else {
        inc = 1;
      }

      count = Math.min(count + inc, targetEventCount);
      setCurrentRecord(count);

      // Phase update
      const activePhase = phases.find((p) => count <= p.threshold) || phases[phases.length - 1];
      setPipelinePhase(activePhase.name);

      if (count < targetEventCount) {
        timerId = setTimeout(step, 80);
      } else {
        // EXTRACTION COMPLETE
        setStatus('complete');
        setPipelinePhase('EXTRACTION COMPLETE');
      }
    };

    timerId = setTimeout(step, 80);

    // Sequential entity reveal
    let entityIdx = 0;
    const entityInterval = setInterval(() => {
      if (entityIdx < targetEntities.length) {
        const nextEnt = targetEntities[entityIdx];
        setVisibleEntities((prev) => {
          if (prev.some((e) => e.id === nextEnt.id)) return prev;
          return [...prev, nextEnt];
        });
        entityIdx++;
      } else {
        clearInterval(entityInterval);
      }
    }, 300);

    return () => {
      clearTimeout(timerId);
      clearInterval(entityInterval);
    };
  }, [targetEventCount, targetEntities]);

  // Handle stage completion transition when status becomes complete
  useEffect(() => {
    if (status === 'complete') {
      const completionTimer = setTimeout(() => {
        onCompleteStage();
      }, 1200);
      return () => clearTimeout(completionTimer);
    }
  }, [status, onCompleteStage]);

  const categories = [
    { key: 'identity', label: 'IDENTITIES', icon: Users, color: 'text-purple-400' },
    { key: 'ip', label: 'NETWORK INDICATORS', icon: Globe, color: 'text-emerald-400' },
    { key: 'endpoint', label: 'ENDPOINTS', icon: Monitor, color: 'text-blue-400' },
    { key: 'domain', label: 'DOMAINS', icon: Search, color: 'text-amber-400' },
    { key: 'session', label: 'SESSIONS', icon: Key, color: 'text-cyan-400' },
    { key: 'file', label: 'FILES & ASSETS', icon: FileText, color: 'text-rose-400' },
  ];

  return (
    <div className="bg-dark-800 border border-dark-700 rounded-xl p-6 space-y-6 shadow-xl font-sans">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-dark-700 pb-4">
        <div>
          <span className="text-xs font-mono font-bold text-cyan-400 uppercase">
            STAGE 2 // ENTITY & ATTRIBUTE EXTRACTION
          </span>
          <h2 className="text-xl font-bold text-slate-100 mt-1 font-mono">
            Extracting Security Entities from Telemetry
          </h2>
        </div>

        {/* Live Monotonic Progress Counter */}
        <div className={`px-4 py-2.5 bg-dark-900 border rounded-xl flex items-center gap-3 transition-colors ${
          status === 'complete' ? 'border-emerald-800 bg-emerald-950/40' : 'border-cyan-800/80'
        }`}>
          {status === 'complete' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          ) : (
            <Loader2 className="w-5 h-5 text-cyan-400 animate-spin shrink-0" />
          )}
          <div>
            <span className={`text-[10px] font-mono block uppercase font-bold ${
              status === 'complete' ? 'text-emerald-400' : 'text-cyan-400'
            }`}>
              ● {pipelinePhase}
            </span>
            <span className="text-lg font-mono font-bold text-slate-100">
              {currentRecord.toLocaleString()} / {targetEventCount.toLocaleString()} RECORDS
            </span>
          </div>
        </div>
      </div>

      {/* Grid of Entity Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const matchingEntities = visibleEntities.filter((e) => e.category === cat.key);

          return (
            <div key={cat.key} className="bg-dark-900 border border-dark-700 rounded-xl p-4 flex flex-col space-y-3">
              <div className="flex items-center justify-between border-b border-dark-800 pb-2">
                <div className="flex items-center gap-2">
                  <Icon className={`w-4 h-4 ${cat.color}`} />
                  <span className="text-xs font-mono font-bold text-slate-200">
                    {cat.label} ({matchingEntities.length})
                  </span>
                </div>
                {matchingEntities.length > 0 && (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                )}
              </div>

              <div className="flex-1 flex flex-wrap gap-1.5 min-h-[70px]">
                {matchingEntities.length === 0 ? (
                  <span className="text-[11px] font-mono text-slate-600 self-center">Scanning telemetry...</span>
                ) : (
                  matchingEntities.map((ent) => (
                    <div
                      key={ent.id}
                      className={`px-2.5 py-1 rounded text-xs font-mono font-bold border animate-fade-in flex items-center gap-1.5 ${
                        ent.confidence === 'HIGH'
                          ? 'bg-cyan-950/80 text-cyan-300 border-cyan-800/80 shadow-[0_0_8px_rgba(6,182,212,0.2)]'
                          : 'bg-dark-800 text-slate-400 border-dark-700'
                      }`}
                    >
                      <span>✓ {ent.name}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Completion Banner */}
      {status === 'complete' && (
        <div className="p-3 bg-emerald-950/50 border border-emerald-800/80 rounded-lg text-xs font-mono text-emerald-400 flex items-center justify-between animate-fade-in">
          <span className="flex items-center gap-2 font-bold">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" /> EXTRACTION COMPLETE: {targetEventCount.toLocaleString()} TELEMETRY RECORDS PROCESSED
          </span>
          <span className="text-cyan-400 flex items-center gap-1">
            Proceeding to Candidate Discovery <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </div>
      )}
    </div>
  );
};
