import { useEffect, useState } from 'react';
import { Clock, ArrowRight, CheckCircle2 } from 'lucide-react';
import { TimelineEvent } from '../../types/vault';
import { DEMO_TIMELINE_EVENTS } from '../../data/vaultDemoData';

interface StageIncidentTimelineProps {
  onCompleteStage: () => void;
  customTimeline?: TimelineEvent[];
}

export const StageIncidentTimeline = ({
  onCompleteStage,
  customTimeline
}: StageIncidentTimelineProps) => {
  const eventsList = (customTimeline && customTimeline.length > 0) ? customTimeline : DEMO_TIMELINE_EVENTS;
  const [visibleEvents, setVisibleEvents] = useState<TimelineEvent[]>([]);

  useEffect(() => {
    let idx = 0;
    const interval = setInterval(() => {
      if (idx < eventsList.length) {
        const nextEvt = eventsList[idx];
        setVisibleEvents((prev) => [...prev, nextEvt]);
        idx++;
      } else {
        clearInterval(interval);
      }
    }, 350);

    return () => clearInterval(interval);
  }, [eventsList]);

  return (
    <div className="bg-dark-800 border border-dark-700 rounded-xl p-6 space-y-6 shadow-xl font-sans">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-dark-700 pb-4">
        <div>
          <span className="text-xs font-mono font-bold text-cyan-400 uppercase">
            STAGE 4 // INCIDENT TIMELINE RECONSTRUCTION
          </span>
          <h2 className="text-xl font-bold text-slate-100 mt-1 font-mono">
            Chronological Sequence of Correlated Events
          </h2>
        </div>

        {visibleEvents.length >= eventsList.length ? (
          <button
            onClick={onCompleteStage}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-slate-950 font-bold rounded-lg text-xs font-mono transition-all shadow-[0_0_15px_rgba(6,182,212,0.3)] cursor-pointer self-start md:self-auto uppercase tracking-wider"
          >
            <span>PROCEED TO INCIDENT RECONSTRUCTION SUMMARY</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400">
            <Clock className="w-4 h-4 animate-spin" />
            <span>Reconstructing Timeline [{visibleEvents.length}/{eventsList.length}]</span>
          </div>
        )}
      </div>

      {/* Sequential Timeline List */}
      <div className="relative border-l-2 border-cyan-800/80 ml-4 space-y-6 pl-6 py-2">
        {visibleEvents.map((evt, idx) => {
          return (
            <div
              key={evt.id || idx}
              className="relative animate-fade-in group"
            >
              {/* Timeline Bullet */}
              <div className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-dark-900 border-2 border-cyan-400 flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
              </div>

              {/* Event Card */}
              <div className={`bg-dark-900 border rounded-xl p-4 transition-all duration-300 ${
                evt.severity === 'critical' ? 'border-red-600/80 shadow-[0_0_15px_rgba(239,68,68,0.15)]' :
                evt.severity === 'high' ? 'border-amber-600/80' :
                'border-dark-700'
              }`}>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-dark-800 pb-2 mb-2 font-mono text-xs">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-500 font-bold">0{idx + 1}</span>
                    <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 font-bold border border-cyan-800">
                      {evt.time || '10:30'}
                    </span>
                    <h3 className="font-bold text-slate-100 text-sm font-sans">
                      {evt.title}
                    </h3>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-slate-400 text-[11px]">{evt.source}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      evt.severity === 'critical' ? 'bg-red-950 text-red-400 border border-red-800' :
                      evt.severity === 'high' ? 'bg-amber-950 text-amber-400 border border-amber-800' :
                      'bg-slate-800 text-slate-300'
                    }`}>
                      {evt.severity || 'INFO'}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono mb-2">
                  <div className="text-slate-300">
                    <span className="text-slate-500 text-[10px] block">ENTITY</span>
                    {evt.entity}
                  </div>
                  <div className="text-slate-300">
                    <span className="text-slate-500 text-[10px] block">DEVICE / IP</span>
                    {evt.ipOrHost}
                  </div>
                </div>

                <p className="text-xs text-slate-400 font-sans leading-relaxed">
                  {evt.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Completion Banner */}
      {visibleEvents.length >= eventsList.length && (
        <div className="p-4 bg-cyan-950/60 border border-cyan-500/60 rounded-xl text-xs font-mono text-cyan-300 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-lg">
          <div className="flex items-center gap-2 font-bold text-sm">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <span>ECHO HAS RECONSTRUCTED A CORRELATED INCIDENT SEQUENCE</span>
          </div>
          <button
            onClick={onCompleteStage}
            className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-lg transition-colors cursor-pointer text-xs uppercase"
          >
            VIEW INCIDENT SUMMARY
          </button>
        </div>
      )}
    </div>
  );
};
