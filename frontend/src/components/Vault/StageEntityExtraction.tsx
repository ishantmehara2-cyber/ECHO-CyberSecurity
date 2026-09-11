import { useEffect, useState } from 'react';
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
}

export const StageEntityExtraction = ({ onCompleteStage, isDemoMode }: StageEntityExtractionProps) => {
  const [eventCount, setEventCount] = useState<number>(0);
  const [visibleEntities, setVisibleEntities] = useState<ExtractedEntity[]>([]);

  const targetEntities = isDemoMode ? DEMO_EXTRACTED_ENTITIES : DEMO_EXTRACTED_ENTITIES.slice(0, 6);
  const targetEventCount = isDemoMode ? 2214 : 640;

  useEffect(() => {
    // Animate event counter upward
    const eventInterval = setInterval(() => {
      setEventCount((prev) => {
        if (prev >= targetEventCount) {
          clearInterval(eventInterval);
          return targetEventCount;
        }
        return prev + Math.floor(Math.random() * 120) + 40;
      });
    }, 80);

    // Reveal entities one by one
    let index = 0;
    const entityInterval = setInterval(() => {
      if (index < targetEntities.length) {
        const nextEnt = targetEntities[index];
        setVisibleEntities((prev) => [...prev, nextEnt]);
        index++;
      } else {
        clearInterval(entityInterval);
        setTimeout(() => {
          onCompleteStage();
        }, 1500);
      }
    }, 450);

    return () => {
      clearInterval(eventInterval);
      clearInterval(entityInterval);
    };
  }, [targetEntities, targetEventCount, onCompleteStage]);

  const categories = [
    { key: 'identity', label: 'IDENTITIES', icon: Users, color: 'text-purple-400' },
    { key: 'ip', label: 'NETWORK INDICATORS', icon: Globe, color: 'text-emerald-400' },
    { key: 'endpoint', label: 'ENDPOINTS', icon: Monitor, color: 'text-blue-400' },
    { key: 'domain', label: 'DOMAINS', icon: Search, color: 'text-amber-400' },
    { key: 'session', label: 'SESSIONS', icon: Key, color: 'text-cyan-400' },
    { key: 'file', label: 'FILES & ASSETS', icon: FileText, color: 'text-rose-400' },
  ];

  return (
    <div className="bg-dark-800 border border-dark-700 rounded-xl p-6 space-y-6 shadow-xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-dark-700 pb-4">
        <div>
          <span className="text-xs font-mono font-bold text-cyan-400 uppercase">
            STAGE 2 // ENTITY & ATTRIBUTE EXTRACTION
          </span>
          <h2 className="text-xl font-bold text-slate-100 mt-1">
            Extracting Security Entities from Telemetry
          </h2>
        </div>

        {/* Live Event Counter Banner */}
        <div className="px-4 py-2.5 bg-dark-900 border border-cyan-800/80 rounded-xl flex items-center gap-3">
          <Loader2 className="w-5 h-5 text-cyan-400 animate-spin" />
          <div>
            <span className="text-[10px] font-mono text-slate-500 block uppercase">TOTAL RAW EVENTS ANALYZED</span>
            <span className="text-lg font-mono font-bold text-cyan-400">
              {eventCount.toLocaleString()} / {targetEventCount.toLocaleString()} EVENTS
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
      {visibleEntities.length >= targetEntities.length && (
        <div className="p-3 bg-emerald-950/50 border border-emerald-800/80 rounded-lg text-xs font-mono text-emerald-400 flex items-center justify-between">
          <span className="flex items-center gap-2 font-bold">
            <CheckCircle2 className="w-4 h-4" /> {targetEventCount.toLocaleString()} RAW EVENTS NORMALIZED & EXTRACTED
          </span>
          <span className="text-cyan-400 flex items-center gap-1">
            Constructing Correlation Graph <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </div>
      )}
    </div>
  );
};
