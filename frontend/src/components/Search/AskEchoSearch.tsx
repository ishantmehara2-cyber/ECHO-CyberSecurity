import { useState } from 'react';
import {
  Search,
  Terminal,
  CheckCircle2,
  ShieldCheck,
  AlertTriangle
} from 'lucide-react';
import { INVESTIGATION_SUMMARY_STORY } from '../../data/correlationEngine';

interface QueryResult {
  query: string;
  matchedTopic: string;
  summary: string;
  supportingEvents: { time: string; source: string; description: string }[];
  correlationReasoning: string;
  missingEvidenceNote?: string;
}

const PRESET_QUERIES = [
  'Show suspicious activity for employee_07',
  'Why are these events connected?',
  'What evidence is missing?',
  'Show activity on WORKSTATION-07',
  'What happened before exfiltration?',
  'Which candidates accessed finance_records.xlsx?'
];

export const AskEchoSearch = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [activeResult, setActiveResult] = useState<QueryResult | null>(null);

  const handleRunQuery = (queryText: string) => {
    setSearchTerm(queryText);
    const q = queryText.toLowerCase();

    if (q.includes('employee_07') || q.includes('who') || q.includes('highest risk')) {
      setActiveResult({
        query: queryText,
        matchedTopic: 'Entity Activity: employee_07',
        summary: 'ECHO identified employee_07 as Candidate #1 (Risk Score: 92/100). Activity includes 3 failed logins followed by success from Tor exit IP 185.220.101.45, encoded PowerShell execution, finance_records.xlsx read, and 148 MB outbound egress.',
        supportingEvents: [
          { time: '10:28:43', source: 'Authentication', description: 'Failed password attempt from Tor exit IP 185.220.101.45' },
          { time: '10:30:16', source: 'Authentication', description: 'Successful SSO logon; bearer token SES-7F21A issued' },
          { time: '10:30:42', source: 'Endpoint', description: 'powershell.exe -ExecutionPolicy Bypass -enc executed on WORKSTATION-07' },
          { time: '10:32:28', source: 'Endpoint', description: 'Restricted spreadsheet finance_records.xlsx read' },
          { time: '10:36:19', source: 'Network', description: '148 MB outbound data transfer to sync-archive.example.test' }
        ],
        correlationReasoning: 'Connected because session SES-7F21A bound account employee_07 directly to WORKSTATION-07 within an 8-minute temporal window.',
        missingEvidenceNote: 'Process creation telemetry on WORKSTATION-07 between 10:30:16 and 10:32:28 is missing in available logs.'
      });
    } else if (q.includes('connected') || q.includes('why')) {
      setActiveResult({
        query: queryText,
        matchedTopic: 'Correlation Rules & Evidence Factors',
        summary: 'Events were connected through ECHO deterministic heuristics: Shared User Principal (employee_07), Shared Host (WORKSTATION-07), Shared SSO Token (SES-7F21A), and 8-minute temporal proximity.',
        supportingEvents: [
          { time: '10:28 - 10:30', source: 'Auth -> Host', description: 'Same account employee_07 authenticated from Tor exit IP to WORKSTATION-07' },
          { time: '10:30 - 10:34', source: 'Host -> File', description: 'PowerShell execution on WORKSTATION-07 accessed finance_records.xlsx and created review_package.zip' },
          { time: '10:34 - 10:36', source: 'File -> Network', description: 'Compressed container review_package.zip payload size (148 MB) matched network egress volume' }
        ],
        correlationReasoning: 'Correlation confidence is 94% based on 5 matching evidence factors across 4 independent telemetry sources.'
      });
    } else if (q.includes('missing') || q.includes('gap')) {
      setActiveResult({
        query: queryText,
        matchedTopic: 'Evidence Gap Analysis',
        summary: 'ECHO gap detection engine identified 1 high-priority gap: Missing Endpoint Process Creation Telemetry on WORKSTATION-07 during the 10:30:16 - 10:32:28 window.',
        supportingEvents: [
          { time: '10:30:16', source: 'Authentication', description: 'Observed: SSO logon success' },
          { time: '10:32:28', source: 'Endpoint', description: 'Observed: Restricted file finance_records.xlsx read' }
        ],
        correlationReasoning: 'Missing evidence indicates telemetry gap, not proof of absence. Collecting Windows Event ID 4688 or Sysmon process events is recommended.',
        missingEvidenceNote: 'RECOMMENDED ACTION: Ingest EDR process creation logs for WORKSTATION-07 during 10:30 - 10:33.'
      });
    } else if (q.includes('workstation-07') || q.includes('host') || q.includes('device')) {
      setActiveResult({
        query: queryText,
        matchedTopic: 'Asset History: WORKSTATION-07',
        summary: 'WORKSTATION-07 is the target corporate endpoint assigned to employee_07. It experienced 4 correlated events between 10:30:16 and 10:36:19.',
        supportingEvents: [
          { time: '10:30:16', source: 'Authentication', description: 'Session SES-7F21A assigned to WORKSTATION-07' },
          { time: '10:30:42', source: 'Endpoint', description: 'powershell.exe executed under employee_07' },
          { time: '10:32:28', source: 'File', description: 'finance_records.xlsx read' },
          { time: '10:36:19', source: 'Network', description: 'Outbound egress connection initiated' }
        ],
        correlationReasoning: 'WORKSTATION-07 served as the execution anchor connecting authentication, process, asset, and network activities.'
      });
    } else {
      setActiveResult({
        query: queryText,
        matchedTopic: 'General Investigation Search',
        summary: `Query executed against current investigation state for "${queryText}". Found correlated sequence involving ${INVESTIGATION_SUMMARY_STORY.keyActors.primaryUser} on ${INVESTIGATION_SUMMARY_STORY.keyActors.primaryHost}.`,
        supportingEvents: [
          { time: '10:30:16', source: 'Authentication', description: 'Logon success for employee_07' },
          { time: '10:32:28', source: 'Endpoint', description: 'finance_records.xlsx accessed' }
        ],
        correlationReasoning: 'Result generated deterministically from normalized telemetry events.'
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

        <span className="text-[10px] px-2.5 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800 font-bold">
          EVIDENCE-BACKED QUERY
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
            placeholder="Ask ECHO (e.g. Why are these events connected? What evidence is missing?)"
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
        <span className="text-slate-500 text-[10px] font-bold uppercase mr-1">SUPPORTED QUERIES:</span>
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
