import { useState } from 'react';
import {
  Search,
  Terminal,
  CheckCircle2,
  ShieldCheck,
  AlertTriangle
} from 'lucide-react';
import { useInvestigation } from '../../context/InvestigationContext';

interface QueryResult {
  query: string;
  matchedTopic: string;
  summary: string;
  supportingEvents: { time: string; source: string; description: string }[];
  correlationReasoning: string;
  missingEvidenceNote?: string;
}

export const AskEchoSearch = () => {
  const { analysisData, hasAnalysisData } = useInvestigation();
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [activeResult, setActiveResult] = useState<QueryResult | null>(null);

  // Extract entities and candidates from active investigation state
  const candidates = analysisData?.suspicious_entities || [];
  const entities = analysisData?.extractedEntities || [];
  const events = analysisData?.normalized_events || [];
  const gaps = analysisData?.evidence_gaps || [];

  const topCandidate = candidates[0]?.entityName || entities[0]?.name || '';
  const topHost = candidates[0]?.keyActors?.primaryHost || '';

  const PRESET_QUERIES = [
    ...(topCandidate ? [`Show suspicious activity for ${topCandidate}`] : []),
    'Why are these events connected?',
    'What evidence is missing?',
    ...(topHost ? [`Show activity on ${topHost}`] : []),
    'What happened before exfiltration?',
    'Which candidates accessed restricted assets?'
  ];

  const handleRunQuery = (queryText: string) => {
    setSearchTerm(queryText);
    const q = queryText.toLowerCase();

    // 1. Search for specific entity / candidate
    const matchingCandidate = candidates.find(c => c.entityName.toLowerCase().includes(q) || q.includes(c.entityName.toLowerCase()));
    const matchingEntity = entities.find(e => e.name.toLowerCase().includes(q) || q.includes(e.name.toLowerCase()));
    const targetName = matchingCandidate?.entityName || matchingEntity?.name;

    const matchingEvts = events.filter(e =>
      !targetName ||
      [e.entity_user, e.entity_host, e.entity_ip, e.entity_domain, e.entity_asset, e.description, e.eventType]
        .filter(Boolean)
        .some((value: string) => value.toLowerCase().includes(targetName.toLowerCase()))
    );

    const displayEvts = (matchingEvts.length > 0 ? matchingEvts : []).slice(0, 5).map(e => ({
      time: e.timestamp || 'Observed',
      source: e.source || 'Unknown source',
      description: e.description || e.eventType || 'Security Event'
    }));

    if (q.includes('missing') || q.includes('gap')) {
      const firstGap = gaps[0];
      setActiveResult({
        query: queryText,
        matchedTopic: 'Evidence Gap Analysis',
        summary: firstGap
          ? `ECHO identified 1 evidence gap: ${firstGap.expectedStage} (${firstGap.timeWindow || 'Time window'}).`
          : 'No evidence gaps were identified in the current investigation.',
        supportingEvents: displayEvts,
        correlationReasoning: firstGap?.whyFlagged || 'No additional evidence gap explanation is available.',
        missingEvidenceNote: firstGap ? `RECOMMENDED ACTION: ${firstGap.recommendedSource}` : undefined
      });
    } else if (q.includes('why') || q.includes('connected')) {
      setActiveResult({
        query: queryText,
        matchedTopic: 'Correlation Rules & Evidence Factors',
        summary: targetName
          ? `Events associated with ${targetName} were connected using the matching factors recorded by the current analysis.`
          : 'The current analysis did not identify a specific detected entity in that question.',
        supportingEvents: displayEvts,
        correlationReasoning: matchingCandidate
          ? `Correlation confidence for ${matchingCandidate.entityName} is ${matchingCandidate.correlationConfidence}% based on actual correlation links.`
          : 'Select or mention a detected entity to inspect its actual correlation evidence.'
      });
    } else {
      setActiveResult({
        query: queryText,
        matchedTopic: targetName ? `Entity Activity: ${targetName}` : 'Current Investigation Search',
        summary: targetName
          ? `ECHO found ${matchingEvts.length} current telemetry event(s) associated with ${targetName}.`
          : `ECHO searched ${events.length} current normalized event(s) and ${entities.length} detected entities.`,
        supportingEvents: displayEvts,
        correlationReasoning: matchingCandidate?.primaryReason || 'No specific entity match was found for this query.'
      });
    }
  };

  return (
    <div className="bg-dark-800 border border-dark-700 rounded-xl p-6 shadow-xl space-y-5 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-dark-700 pb-3 font-mono">
        <div className="flex items-center gap-2">
          <Terminal className="w-5 h-5 text-cyan-400" />
          <h2 className="text-sm font-bold text-slate-100 uppercase tracking-wider">
            ASK ECHO // DETERMINISTIC INVESTIGATION QUERY ENGINE
          </h2>
        </div>

        <span className="text-[10px] px-2.5 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800 font-bold uppercase">
          {hasAnalysisData ? 'ACTIVE DATASET QUERY' : 'NO INVESTIGATION DATA'}
        </span>
      </div>

      {/* Query Bar */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1 font-mono text-xs">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && searchTerm.trim()) {
                handleRunQuery(searchTerm);
              }
            }}
            placeholder={`Ask ECHO (e.g. Show suspicious activity for ${topCandidate})`}
            className="w-full bg-dark-900 border border-dark-700 text-slate-100 placeholder-slate-500 rounded-lg pl-9 pr-3 py-2.5 text-xs font-mono outline-none focus:border-cyan-500"
          />
        </div>

        <button
          onClick={() => {
            if (searchTerm.trim()) handleRunQuery(searchTerm);
          }}
          className="px-4 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold rounded-lg text-xs font-mono transition-colors cursor-pointer uppercase"
        >
          Query
        </button>
      </div>

      {/* Preset Queries Bar */}
      <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
        <span className="text-slate-500 text-[10px] font-bold uppercase mr-1">PRESET QUERIES:</span>
        {PRESET_QUERIES.map((pq, idx) => (
          <button
            key={idx}
            onClick={() => handleRunQuery(pq)}
            className="px-2.5 py-1 rounded bg-dark-900 border border-dark-700 hover:border-cyan-500 text-slate-300 text-[11px] transition-colors cursor-pointer"
          >
            {pq}
          </button>
        ))}
      </div>

      {/* Query Results Panel */}
      {activeResult && (
        <div className="p-5 bg-dark-900 border border-cyan-900/80 rounded-xl space-y-4 text-xs animate-fade-in shadow-2xl">
          <div className="flex justify-between items-center border-b border-dark-800 pb-2 font-mono">
            <span className="text-cyan-400 font-bold text-xs uppercase flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> {activeResult.matchedTopic}
            </span>
            <span className="text-slate-500 text-[10px]">QUERY: "{activeResult.query}"</span>
          </div>

          <p className="text-slate-200 text-sm leading-relaxed">
            {activeResult.summary}
          </p>

          {/* Supporting Evidence Events */}
          <div className="space-y-2 font-mono">
            <span className="text-[10px] font-bold text-slate-500 uppercase block">
              SUPPORTING NORMALIZED TELEMETRY EVENTS
            </span>
            <div className="bg-dark-800 rounded-lg p-3 space-y-2 border border-dark-700 text-[11px]">
              {activeResult.supportingEvents.map((se, i) => (
                <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-dark-700/60 pb-1.5 last:border-0">
                  <div className="flex items-center gap-2">
                    <span className="text-cyan-400 font-bold">{se.time}</span>
                    <span className="text-slate-200">{se.description}</span>
                  </div>
                  <span className="text-purple-300 font-bold text-[10px]">{se.source}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Correlation Reasoning */}
          <div className="p-3 bg-cyan-950/40 border border-cyan-900/60 rounded-lg text-xs font-sans text-slate-300 space-y-1">
            <span className="font-mono text-[10px] font-bold text-cyan-400 uppercase flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> CORRELATION REASONING
            </span>
            <p className="leading-relaxed">{activeResult.correlationReasoning}</p>
          </div>

          {/* Missing Evidence Note */}
          {activeResult.missingEvidenceNote && (
            <div className="p-3 bg-amber-950/40 border border-amber-800/80 rounded-lg text-xs font-mono text-amber-300 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{activeResult.missingEvidenceNote}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
