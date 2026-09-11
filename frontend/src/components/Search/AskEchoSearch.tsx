import { useState } from 'react';
import { Search, Terminal } from 'lucide-react';
import { useInvestigation } from '../../context/InvestigationContext';

interface QueryResult {
  query: string;
  matchedTopic: string;
  summary: string;
  supportingEvents: { time: string; source: string; description: string }[];
  correlationReasoning: string;
}

const PRESET_QUERIES = ['Who is the highest-risk entity?', 'What evidence is missing?', 'Show activity for an entity'];

export const AskEchoSearch = () => {
  const { analysisData, hasAnalysisData } = useInvestigation();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeResult, setActiveResult] = useState<QueryResult | null>(null);

  const handleRunQuery = (query: string) => {
    setSearchTerm(query);
    if (!hasAnalysisData || !analysisData) {
      setActiveResult({ query, matchedTopic: 'No Investigation Data', summary: 'No investigation data is available. Upload telemetry in the Evidence Vault to begin analysis.', supportingEvents: [], correlationReasoning: 'No evidence was available to answer this query.' });
      return;
    }
    const q = query.toLowerCase();
    const events = analysisData.normalized_events || [];
    const candidates = analysisData.suspicious_entities || [];
    const gaps = analysisData.evidence_gaps || [];
    const entities = analysisData.extractedEntities || [];
    const candidate = candidates.slice().sort((a: any, b: any) => (b.riskScore || 0) - (a.riskScore || 0))[0];
    const named = entities.find((entity: any) => q.includes(String(entity.name).toLowerCase()));

    if (q.includes('highest') || q.includes('risk') || q.includes('who')) {
      setActiveResult({ query, matchedTopic: candidate ? `Highest Risk: ${candidate.entityName}` : 'Risk Analysis', summary: candidate ? `${candidate.entityName} has the highest observed risk score of ${candidate.riskScore}/100.` : 'No suspicious entities were identified.', supportingEvents: [], correlationReasoning: candidate?.primaryReason || 'No high-confidence risk finding is available.' });
    } else if (q.includes('missing') || q.includes('gap')) {
      setActiveResult({ query, matchedTopic: 'Evidence Gap Analysis', summary: gaps.length ? `${gaps.length} evidence gap(s) were identified.` : 'No evidence gaps were identified.', supportingEvents: gaps.map((gap: any) => ({ time: gap.timeWindow, source: gap.recommendedSource, description: gap.whyFlagged })), correlationReasoning: 'Evidence gaps are recommendations for analyst review, not proof that an event occurred.' });
    } else if (named || q.includes('activity')) {
      const matches = events.filter((event: any) => JSON.stringify(event).toLowerCase().includes((named?.name || q).toLowerCase())).slice(0, 10);
      setActiveResult({ query, matchedTopic: `Activity: ${named?.name || query}`, summary: `${matches.length} current investigation event(s) matched this query.`, supportingEvents: matches.map((event: any) => ({ time: event.timestamp, source: event.source, description: event.description })), correlationReasoning: 'Results were searched from the current normalized investigation events.' });
    } else {
      setActiveResult({ query, matchedTopic: 'Investigation Search', summary: 'I could not find enough evidence in the current investigation to answer that.', supportingEvents: [], correlationReasoning: 'Try a known entity name, "highest risk", or "what evidence is missing?".' });
    }
  };

  return (
    <div className="bg-dark-800 border border-dark-700 rounded-xl p-6 shadow-xl space-y-5 font-sans">
      <div className="flex items-center gap-2 border-b border-dark-700 pb-3 font-mono">
        <Terminal className="w-5 h-5 text-cyan-400" />
        <h2 className="text-sm font-bold text-slate-100 uppercase tracking-wider">ASK ECHO // CURRENT INVESTIGATION SEARCH</h2>
      </div>
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} onKeyDown={(event) => event.key === 'Enter' && searchTerm.trim() && handleRunQuery(searchTerm)} placeholder="Ask about current entities, events, or evidence gaps" className="w-full bg-dark-900 border border-dark-700 text-slate-100 rounded-lg pl-9 pr-3 py-2.5 text-xs font-mono outline-none focus:border-cyan-500" />
        </div>
        <button onClick={() => searchTerm.trim() && handleRunQuery(searchTerm)} className="px-4 py-2.5 bg-cyan-600 text-slate-950 font-bold rounded-lg text-xs font-mono uppercase">Query</button>
      </div>
      <div className="flex flex-wrap gap-2">
        {PRESET_QUERIES.map((query) => <button key={query} onClick={() => handleRunQuery(query)} className="px-3 py-1.5 bg-dark-900 border border-dark-700 text-cyan-300 rounded-lg text-[11px] font-mono">{query}</button>)}
      </div>
      {activeResult && (
        <div className="bg-dark-900 border border-cyan-900 rounded-xl p-5 space-y-3 text-sm">
          <div className="text-cyan-400 text-xs font-mono font-bold uppercase">{activeResult.matchedTopic}</div>
          <p className="text-slate-200">{activeResult.summary}</p>
          <p className="text-slate-400 text-xs">{activeResult.correlationReasoning}</p>
          {activeResult.supportingEvents.map((event, index) => <div key={`${event.time}-${index}`} className="border-t border-dark-700 pt-2 text-xs"><span className="text-cyan-400 font-mono">{event.time}</span> <span className="text-purple-300">{event.source}</span> <span className="text-slate-300">{event.description}</span></div>)}
        </div>
      )}
    </div>
  );
};
