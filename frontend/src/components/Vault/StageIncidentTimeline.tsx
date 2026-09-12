import { useEffect, useMemo, useState } from 'react';
import { ArrowDown, ArrowRight, CheckCircle2, Clock, File, Globe, Monitor, User, Workflow } from 'lucide-react';

interface StageIncidentTimelineProps {
  onCompleteStage: () => void;
  customTimeline?: any[];
  normalizedEvents?: any[];
  correlations?: any[];
}

const missing = 'Not available in uploaded evidence';
const MAX_TIMELINE_DISPLAY = 25;

export const StageIncidentTimeline = ({
  onCompleteStage,
  customTimeline = [],
  normalizedEvents = [],
  correlations = [],
}: StageIncidentTimelineProps) => {
  // Cap the timeline display to at most 25 key events for optimal performance
  const displayTimeline = useMemo(() => customTimeline.slice(0, MAX_TIMELINE_DISPLAY), [customTimeline]);
  const [visibleCount, setVisibleCount] = useState(0);

  useEffect(() => {
    setVisibleCount(0);
    if (!displayTimeline.length) return;

    // Fast reveal animation up to 25 items within ~1-2 seconds
    const intervalTime = 80;
    const batchSize = Math.max(1, Math.ceil(displayTimeline.length / 15));

    const timer = window.setInterval(() => {
      setVisibleCount((count) => {
        const next = count + batchSize;
        if (next >= displayTimeline.length) {
          window.clearInterval(timer);
          return displayTimeline.length;
        }
        return next;
      });
    }, intervalTime);

    return () => window.clearInterval(timer);
  }, [displayTimeline]);

  const visibleEvents = displayTimeline.slice(0, visibleCount);
  const isComplete = visibleCount >= displayTimeline.length;

  const summary = useMemo(() => ({
    accounts: new Set(displayTimeline.map((event) => event.entity).filter(Boolean)).size,
    devices: new Set(displayTimeline.map((event) => event.ipOrDevice).filter((value) => value && !value.includes('.'))).size,
    ips: new Set(normalizedEvents.map((event) => event.entity_ip).filter(Boolean)).size,
  }), [displayTimeline, normalizedEvents]);

  const normalizedFor = (stage: any) => normalizedEvents.find((event) =>
    event.description === stage.eventTitle &&
    (event.timestamp === stage.timestamp || event.source === stage.source),
  );

  const connectionLabel = (current: any, next: any) => {
    const first = normalizedFor(current);
    const second = normalizedFor(next);
    const factors: string[] = [];
    if (first?.entity_host && first.entity_host === second?.entity_host) factors.push('SAME DEVICE');
    if (first?.entity_ip && first.entity_ip === second?.entity_ip) factors.push('SAME IP ADDRESS');
    if (first?.entity_user && first.entity_user === second?.entity_user) factors.push('SAME USER');
    const link = correlations.find((item) =>
      (item.sourceNodeId === first?.id && item.targetNodeId === second?.id) ||
      (item.targetNodeId === first?.id && item.sourceNodeId === second?.id),
    );
    const temporal = link?.matchingFactors?.find((factor: any) => factor.fieldName === 'Temporal Proximity');
    if (temporal) factors.push(`OCCURRED ${temporal.value} APART`);
    return factors.length ? factors.join(' + ') : 'INSUFFICIENT EVIDENCE TO ESTABLISH A CONNECTION';
  };

  const actionFor = (stage: any) => {
    const text = `${stage.stageName || ''} ${stage.eventTitle || ''}`.toLowerCase();
    if (text.includes('auth') || text.includes('login')) return 'Logged into the system';
    if (text.includes('execution') || text.includes('process')) return 'Ran a process or command';
    if (text.includes('file') || text.includes('data')) return 'Accessed a file or data';
    if (text.includes('network') || text.includes('exfil')) return 'Connected to an external network';
    return stage.eventTitle || 'Observed security activity';
  };

  return (
    <div className="bg-dark-800 border border-dark-700 rounded-xl p-6 space-y-6 shadow-xl font-sans">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-dark-700 pb-4">
        <div>
          <span className="text-xs font-mono font-bold text-cyan-400 uppercase">STAGE 4 // INCIDENT TIMELINE RECONSTRUCTION</span>
          <h2 className="text-xl font-bold text-slate-100 mt-1 font-mono">Chronological Sequence of Correlated Events</h2>
        </div>

        {isComplete || displayTimeline.length === 0 ? (
          <button
            onClick={onCompleteStage}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-slate-950 font-extrabold rounded-lg text-xs font-mono uppercase tracking-wider shadow-[0_0_15px_rgba(6,182,212,0.3)] transition-all cursor-pointer"
          >
            <span>PROCEED TO ATTACK RECONSTRUCTION SUMMARY</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 font-bold bg-cyan-950/80 px-3 py-1.5 rounded-lg border border-cyan-800">
            <Clock className="w-4 h-4 animate-spin text-cyan-400" />
            <span>Reconstructing Timeline [{visibleEvents.length}/{displayTimeline.length}]</span>
          </div>
        )}
      </div>

      {displayTimeline.length === 0 ? (
        <div className="p-8 text-center border border-dark-700 rounded-xl text-slate-400 font-mono text-xs">
          No reconstructed timeline is available for the current investigation.
        </div>
      ) : (
        <>
          <div className="p-4 bg-cyan-950/30 border border-cyan-900/70 rounded-xl space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Workflow className="w-5 h-5 text-cyan-400" />
                <h3 className="text-sm font-bold text-slate-100 font-mono uppercase">What ECHO Found in Telemetry</h3>
              </div>
              {customTimeline.length > MAX_TIMELINE_DISPLAY && (
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-dark-900 text-slate-400 border border-dark-700">
                  SHOWING TOP 25 KEY EVENTS ({customTimeline.length} TOTAL)
                </span>
              )}
            </div>
            <p className="text-sm text-slate-300">
              ECHO observed {summary.accounts || 'multiple'} account(s), {summary.devices || 'multiple'} device(s), and {summary.ips || 'multiple'} IP address(es) across the uploaded evidence.
            </p>
            <p className="text-xs text-amber-300">
              Potential concern: these are evidence-supported connections, not confirmation of a compromise.
            </p>
          </div>

          <div className="relative border-l-2 border-cyan-800/80 ml-4 space-y-2 pl-6 py-2">
            {visibleEvents.map((stage: any, index) => {
              const normalized = normalizedFor(stage);
              const entity = stage.entity || normalized?.entity_user || missing;
              const host = normalized?.entity_host || (!stage.ipOrDevice?.includes('.') ? stage.ipOrDevice : null);
              const ip = normalized?.entity_ip || (stage.ipOrDevice?.includes('.') ? stage.ipOrDevice : null);
              const detail = normalized?.entity_process || normalized?.entity_asset || normalized?.entity_domain;
              const severity = stage.severity || 'info';

              return (
                <div key={stage.stageNumber || index} className="relative animate-fade-in">
                  <div className="absolute -left-[31px] top-5 w-4 h-4 rounded-full bg-dark-900 border-2 border-cyan-400" />
                  <div className={`bg-dark-900 border rounded-xl p-5 ${
                    severity === 'critical' ? 'border-red-600/80 shadow-[0_0_15px_rgba(239,68,68,0.15)]' :
                    severity === 'high' ? 'border-amber-600/80' :
                    'border-dark-700'
                  }`}>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-dark-800 pb-3 mb-3">
                      <div className="flex items-center gap-3">
                        <span className="text-slate-500 font-bold font-mono">#{String(index + 1).padStart(2, '0')}</span>
                        <span className="px-2 py-1 rounded bg-cyan-950 text-cyan-400 font-bold border border-cyan-800 font-mono text-xs">
                          {stage.timestamp || 'Observed'}
                        </span>
                        <h3 className="font-bold text-slate-100 text-sm font-sans">{actionFor(stage)}</h3>
                      </div>
                      <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${
                        severity === 'critical' ? 'bg-red-950 text-red-400 border border-red-800' :
                        severity === 'high' ? 'bg-amber-950 text-amber-400 border border-amber-800' :
                        'bg-slate-800 text-slate-300'
                      }`}>
                        {severity}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs font-mono">
                      <div className="text-slate-300"><User className="inline w-3.5 h-3.5 mr-1 text-cyan-400" />{entity}</div>
                      <div className="text-slate-300"><Monitor className="inline w-3.5 h-3.5 mr-1 text-cyan-400" />{host || missing}</div>
                      <div className="text-slate-300"><Globe className="inline w-3.5 h-3.5 mr-1 text-cyan-400" />{ip || missing}</div>
                      <div className="text-slate-300"><File className="inline w-3.5 h-3.5 mr-1 text-cyan-400" />{detail || 'No related file, process, or network detail'}</div>
                    </div>

                    <p className="text-xs text-slate-300 mt-4"><strong className="text-cyan-300 font-mono uppercase text-[11px]">Observed fact:</strong> {stage.eventTitle || 'Activity was recorded'} from {stage.source || 'uploaded telemetry'}.</p>
                    <p className="text-xs text-amber-300 mt-2 font-mono"><strong className="uppercase text-[11px]">Why this is connected:</strong> {stage.connectionExplanation || 'No additional connection explanation is available.'}</p>
                  </div>

                  {visibleEvents[index + 1] && (
                    <div className="flex flex-col items-center py-3 text-cyan-300 font-mono text-[10px] font-bold">
                      <span className="px-3 py-1 rounded-full bg-cyan-950 border border-cyan-800 text-center">{connectionLabel(stage, visibleEvents[index + 1])}</span>
                      <ArrowDown className="w-5 h-5 mt-1" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </>
      )}

      {isComplete && displayTimeline.length > 0 && (
        <div className="p-4 bg-cyan-950/60 border border-cyan-500/60 rounded-xl text-xs font-mono text-cyan-300 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-lg">
          <div className="flex items-center gap-2 font-bold text-sm">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <span>ECHO HAS RECONSTRUCTED AN EVIDENCE-SUPPORTED ACTIVITY SEQUENCE</span>
          </div>

          <button
            onClick={onCompleteStage}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-slate-950 font-extrabold rounded-lg text-xs font-mono uppercase tracking-wider shadow-[0_0_15px_rgba(6,182,212,0.3)] transition-all cursor-pointer shrink-0"
          >
            <span>PROCEED TO ATTACK RECONSTRUCTION SUMMARY</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
