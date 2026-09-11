import { useMemo, useState, useEffect } from 'react';
import {
  ArrowDown,
  AlertCircle,
  File,
  Globe,
  Monitor,
  Network,
  Play,
  ShieldAlert,
  User,
  Sparkles
} from 'lucide-react';
import { EmptyInvestigationState } from '../components/Common/EmptyInvestigationState';
import { InteractiveCorrelationGraph } from '../components/Correlation/InteractiveCorrelationGraph';
import { InvestigationStoryNarrative } from '../components/Correlation/InvestigationStoryNarrative';
import { AskEchoSearch } from '../components/Search/AskEchoSearch';
import { useInvestigation } from '../context/InvestigationContext';
import { InvestigationCandidate } from '../types/candidates';

type GraphStep = {
  label: string;
  type: 'user' | 'device' | 'process' | 'file' | 'network';
  action?: string;
  source?: string;
};

const formatTime = (timestamp?: string) => {
  if (!timestamp) return null;
  const parsed = new Date(timestamp);
  return Number.isNaN(parsed.getTime())
    ? timestamp
    : parsed.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const iconFor = (type: GraphStep['type']) => {
  if (type === 'user') return User;
  if (type === 'device') return Monitor;
  if (type === 'process') return Play;
  if (type === 'file') return File;
  return Globe;
};

const actionFor = (previous: GraphStep, next: GraphStep) => {
  if (previous.type === 'user' && next.type === 'device') return 'Logged into';
  if (next.type === 'process') return 'Ran';
  if (next.type === 'file') return 'Accessed';
  if (next.type === 'network') return 'Connected to';
  return 'Related activity';
};

export const CorrelationEnginePage = () => {
  const { analysisData, hasAnalysisData } = useInvestigation();
  const candidates = analysisData?.suspicious_entities || [];
  const [selectedEntity, setSelectedEntity] = useState<InvestigationCandidate | null>(null);

  // Auto-select top candidate when data becomes available
  useEffect(() => {
    if (candidates.length > 0 && !selectedEntity) {
      setSelectedEntity(candidates[0]);
    }
  }, [candidates, selectedEntity]);

  const selectedEvents = useMemo(() => {
    if (!selectedEntity) return [];
    const name = selectedEntity.entityName.toLowerCase();
    return (analysisData?.normalized_events || [])
      .filter((event: any) =>
        [event.entity_user, event.entity_host, event.entity_ip, event.entity_domain, event.entity_asset]
          .filter(Boolean)
          .some((value: string) => value.toLowerCase() === name),
      )
      .sort((a: any, b: any) => {
        const left = Date.parse(a.timestamp);
        const right = Date.parse(b.timestamp);
        return Number.isNaN(left) || Number.isNaN(right) ? 0 : left - right;
      });
  }, [analysisData?.normalized_events, selectedEntity]);

  const graphSteps = useMemo<GraphStep[]>(() => {
    if (!selectedEntity) return [];
    const steps: GraphStep[] = [{
      label: selectedEntity.entityName,
      type: selectedEntity.entityType === 'identity' ? 'user' : 'device',
      source: selectedEntity.sourcesInvolved.join(', '),
    }];
    const add = (label: string | null | undefined, type: GraphStep['type'], source?: string) => {
      if (!label || steps.some((step) => step.label === label)) return;
      steps.push({ label, type, source });
    };
    selectedEvents.forEach((event: any) => {
      add(event.entity_host, 'device', event.source);
      add(event.entity_process, 'process', event.source);
      add(event.entity_asset, 'file', event.source);
      add(event.entity_domain || event.entity_ip, 'network', event.source);
    });
    return steps.slice(0, 6);
  }, [selectedEntity, selectedEvents]);

  if (!hasAnalysisData) {
    return (
      <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
        <PageHeader />
        <EmptyInvestigationState
          moduleTitle="Correlation Graph Engine"
          moduleDescription="Upload and analyze telemetry evidence in the Evidence Vault to generate cross-silo relationship graphs."
        />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 font-sans">
      <PageHeader />
      <AskEchoSearch />

      {/* Primary Interactive Correlation Graph Component */}
      <InteractiveCorrelationGraph
        customNodes={analysisData?.extractedEntities}
        customLinks={analysisData?.correlations}
        totalRecords={analysisData?.total_records}
        confidenceScore={analysisData?.confidence?.overallScore}
        summaryData={analysisData?.summary}
      />

      {/* Candidate Entity Focus Selector */}
      {candidates.length > 0 && (
        <section className="bg-dark-800 border border-dark-700 rounded-xl p-6 space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-dark-700 pb-3 font-mono">
            <div>
              <h2 className="text-sm font-bold text-slate-100 uppercase tracking-wider">
                CANDIDATE ENTITY FOCUS ({candidates.length})
              </h2>
              <p className="text-xs text-slate-400 font-sans mt-0.5">Select an entity candidate to view their specific attack path below.</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
            {candidates.map((candidate: InvestigationCandidate) => {
              const isSelected = selectedEntity?.id === candidate.id;
              return (
                <button
                  key={candidate.id}
                  onClick={() => setSelectedEntity(candidate)}
                  className={`px-3 py-2 rounded-lg border font-bold transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-cyan-950 text-cyan-300 border-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.3)]'
                      : 'bg-dark-900 text-slate-400 border-dark-700 hover:text-slate-200'
                  }`}
                >
                  {candidate.entityName} ({candidate.riskScore}/100)
                </button>
              );
            })}
          </div>
        </section>
      )}

      {/* Selected Entity Detailed Path & Timeline */}
      {selectedEntity && (
        <SelectedGraph
          candidate={selectedEntity}
          steps={graphSteps}
          events={selectedEvents}
        />
      )}

      {/* Summary Narrative */}
      <InvestigationStoryNarrative customStory={analysisData?.summary} />
    </div>
  );
};

const PageHeader = () => (
  <div className="bg-dark-800/80 border border-dark-700 rounded-xl p-6 shadow-xl font-sans">
    <div className="flex items-center gap-3">
      <Network className="w-8 h-8 text-cyan-400" />
      <div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold text-cyan-400 uppercase">CROSS-SILO GRAPH REASONING</span>
          <span className="text-[10px] font-mono px-2 py-0.5 bg-cyan-950 text-cyan-400 border border-cyan-800 rounded font-bold">
            <Sparkles className="w-3 h-3 inline mr-1" /> ACTIVE GRAPH
          </span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-100 font-mono mt-0.5">Attack Graph & Correlation Engine</h1>
      </div>
    </div>
    <p className="text-slate-400 text-sm mt-3 max-w-3xl leading-relaxed">
      Understand who is suspicious, what they did, and how observed activity connects across Identity, Network, Endpoint, and Asset silos.
    </p>
  </div>
);

const SelectedGraph = ({
  candidate,
  steps,
  events,
}: {
  candidate: InvestigationCandidate;
  steps: GraphStep[];
  events: any[];
}) => {
  const reasons = candidate.whyFlagged ? candidate.whyFlagged.filter(Boolean).slice(0, 5) : [];
  const breakdown = candidate.scoreBreakdown || {};

  return (
    <div className="space-y-6 font-sans">
      <div className="grid grid-cols-1 xl:grid-cols-[1.35fr_0.9fr] gap-6 items-start">
        <section className="bg-dark-800 border border-dark-700 rounded-xl p-6 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-dark-700 pb-4">
            <div>
              <p className="text-xs text-cyan-400 font-mono uppercase">SPECIFIC ATTACK PATH FOR</p>
              <h2 className="text-2xl font-bold text-slate-100 font-mono">{candidate.entityName}</h2>
            </div>
            <div className="text-right font-mono">
              <p className="text-xs text-slate-500 uppercase font-bold">Risk Level</p>
              <p className="text-amber-400 text-2xl font-bold">{candidate.riskScore}/100</p>
              <p className="text-xs text-emerald-400">{candidate.correlationConfidence}% correlation confidence</p>
            </div>
          </div>

          {steps.length < 2 ? (
            <div className="p-8 text-center border border-dark-700 rounded-xl text-slate-400 font-mono text-xs">
              Insufficient evidence to establish a multi-node connection.
            </div>
          ) : (
            <div className="flex flex-col items-center py-2">
              {steps.map((step, index) => {
                const Icon = iconFor(step.type);
                const previous = steps[index - 1];
                const relatedEvent = events.find((event: any) =>
                  [event.entity_host, event.entity_process, event.entity_asset, event.entity_domain, event.entity_ip]
                    .filter(Boolean)
                    .includes(step.label),
                );

                return (
                  <div key={`${step.type}-${step.label}`} className="flex flex-col items-center w-full">
                    {previous && (
                      <div className="flex flex-col items-center py-2 text-cyan-400">
                        <span className="text-xs font-mono font-bold uppercase">{actionFor(previous, step)}</span>
                        <ArrowDown className="w-5 h-5 text-cyan-400 mt-1" />
                      </div>
                    )}
                    <div className="w-full max-w-xl flex items-center gap-4 p-4 rounded-xl border border-cyan-700 bg-cyan-950/40 shadow-[0_0_20px_rgba(6,182,212,0.12)]">
                      <Icon className="w-7 h-7 text-cyan-300 shrink-0" />
                      <div className="min-w-0 flex-1 font-mono">
                        <p className="text-[10px] text-cyan-400 uppercase font-bold">{step.type}</p>
                        <p className="text-slate-100 font-bold truncate">{step.label}</p>
                        {step.source && <p className="text-xs text-slate-500 font-sans">{step.source}</p>}
                      </div>
                      {relatedEvent && (
                        <span className="text-xs text-cyan-300 font-mono shrink-0 font-bold">
                          {formatTime(relatedEvent.timestamp) || 'Observed'}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        <ActivityTimeline events={events} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <section className="bg-dark-800 border border-dark-700 rounded-xl p-6 space-y-4">
          <h3 className="text-lg font-bold text-slate-100 font-mono flex items-center gap-2"><AlertCircle className="text-amber-400 w-5 h-5" /> Why is this flagged?</h3>
          {reasons.length ? reasons.map((reason, index) => (
            <div key={index} className="flex gap-2 text-sm text-slate-300"><ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />{reason}</div>
          )) : <p className="text-slate-400 text-sm font-mono text-xs">Insufficient evidence for reliable risk assessment.</p>}
          <div className="pt-3 border-t border-dark-700 space-y-2 font-mono text-xs">
            {Object.entries(breakdown).map(([key, value]: [string, any]) => (
              <div key={key} className="flex justify-between">
                <span className="text-slate-400 capitalize">{key.replace(/_/g, ' ')}</span>
                <span className="text-amber-400 font-bold">+{value.points}/{value.max_points}</span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

const ActivityTimeline = ({ events }: { events: any[] }) => (
  <section className="bg-dark-800 border border-dark-700 rounded-xl p-6 shadow-xl space-y-4 xl:sticky xl:top-6 font-sans">
    <div className="flex items-center justify-between border-b border-dark-700 pb-4 font-mono">
      <div>
        <p className="text-xs text-cyan-400 uppercase font-bold">Observed Sequence</p>
        <h3 className="text-xl font-bold text-slate-100">Possible Activity Timeline</h3>
      </div>
      <span className="text-[10px] text-slate-500 uppercase font-bold">{events.length} events</span>
    </div>
    {events.length ? (
      <div className="relative space-y-1">
        <div className="absolute left-[47px] top-3 bottom-3 w-px bg-cyan-800" />
        {events.map((event: any, index: number) => (
          <div key={event.id || index} className="relative flex gap-3 py-3 font-mono text-xs">
            <div className="w-16 shrink-0 text-right text-xs text-cyan-400 font-bold pt-1">
              {formatTime(event.timestamp) || 'Observed'}
            </div>
            <div className="relative z-10 mt-1.5 w-2.5 h-2.5 rounded-full bg-cyan-400 ring-4 ring-dark-800 shrink-0" />
            <div className="min-w-0">
              <p className="text-sm text-slate-200 font-bold leading-snug font-sans">
                {event.description || event.eventType || 'Observed activity'}
              </p>
              <p className="text-xs text-slate-500 mt-1">{event.source} · {event.severity || 'observed'}</p>
            </div>
          </div>
        ))}
      </div>
    ) : (
      <p className="text-slate-400 text-sm font-mono text-xs">No timeline events are available for this entity.</p>
    )}
  </section>
);

export default CorrelationEnginePage;
