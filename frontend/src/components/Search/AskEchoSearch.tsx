import { useState } from 'react';
import { Search, Sparkles, HelpCircle, CornerDownLeft } from 'lucide-react';
import { DEMO_TIMELINE_EVENTS } from '../../data/vaultDemoData';
import { CORRELATION_LINKS, RECONSTRUCTED_ATTACK_STAGES } from '../../data/correlationEngine';
import { DETECTED_EVIDENCE_GAPS } from '../../data/gapDetectionEngine';

export const AskEchoSearch = () => {
  const [query, setQuery] = useState<string>('Show activity related to employee_07');
  const [activeTab, setActiveTab] = useState<string>('query-1');

  const presetQueries = [
    { id: 'query-1', text: 'Show activity related to employee_07', type: 'user' },
    { id: 'query-2', text: 'What happened on WORKSTATION-07?', type: 'device' },
    { id: 'query-3', text: 'Show events related to 185.220.101.45', type: 'ip' },
    { id: 'query-4', text: 'Why are these events connected?', type: 'reasoning' },
    { id: 'query-5', text: 'What evidence is missing?', type: 'gaps' },
    { id: 'query-6', text: 'Show highest confidence attack path', type: 'path' }
  ];

  const handleSelectPreset = (presetText: string, presetId: string) => {
    setQuery(presetText);
    setActiveTab(presetId);
  };

  const getQueryResult = () => {
    const q = query.toLowerCase();

    if (q.includes('employee_07') || activeTab === 'query-1') {
      const userEvents = DEMO_TIMELINE_EVENTS.filter((e) => e.entity === 'employee_07' || e.description.includes('employee_07'));
      return {
        title: 'INVESTIGATION RESULTS: ACCOUNT "employee_07"',
        badge: 'USER ENTITY MATCH',
        summary: 'Account employee_07 was involved in 5 correlated events starting with brute-force authentication from external IP 185.220.101.45, followed by active SSO token creation (SES-7F21A), sensitive file read (finance_records.xlsx), and exfiltration.',
        items: userEvents.map((e) => ({
          time: e.time,
          title: e.title,
          desc: e.description,
          source: e.source,
          severity: e.severity
        })),
        whyMatters: 'WHY THIS MATTERS: employee_07 is the primary user account bridging authentication events with host execution and external data transfer.'
      };
    }

    if (q.includes('workstation-07') || activeTab === 'query-2') {
      const hostEvents = DEMO_TIMELINE_EVENTS.filter((e) => e.ipOrHost.includes('WORKSTATION-07'));
      return {
        title: 'INVESTIGATION RESULTS: HOST "WORKSTATION-07"',
        badge: 'ENDPOINT ASSET MATCH',
        summary: 'WORKSTATION-07 is the victim endpoint asset where session token SES-7F21A was established, encoded PowerShell executed, local zip archive review_package.zip staged, and 148MB egress initiated.',
        items: hostEvents.map((e) => ({
          time: e.time,
          title: e.title,
          desc: e.description,
          source: e.source,
          severity: e.severity
        })),
        whyMatters: 'WHY THIS MATTERS: WORKSTATION-07 served as the central local execution and staging pivot for the entire attack sequence.'
      };
    }

    if (q.includes('185.220.101.45') || activeTab === 'query-3') {
      return {
        title: 'INVESTIGATION RESULTS: IP INDICATOR "185.220.101.45"',
        badge: 'THREAT INTEL IP MATCH',
        summary: 'External IP 185.220.101.45 was flagged in Threat Intelligence Feed as a Tor exit node. It initiated 3 rapid failed login attempts against employee_07 before a successful logon at 10:30:16.',
        items: [
          { time: '10:28:43', title: 'Failed Login Attempt', desc: 'First password attempt from Tor node', source: 'Identity Gateway', severity: 'medium' },
          { time: '10:29:08', title: 'Failed Login Attempt', desc: 'Second password attempt from Tor node', source: 'Identity Gateway', severity: 'medium' },
          { time: '10:29:41', title: 'Failed Login Attempt', desc: 'Third password attempt from Tor node', source: 'Identity Gateway', severity: 'high' },
          { time: '10:30:16', title: 'Successful Authentication', desc: 'Logon succeeded, issuing bearer session SES-7F21A', source: 'Identity Gateway', severity: 'high' }
        ],
        whyMatters: 'WHY THIS MATTERS: 185.220.101.45 is the primary external entry vector identified in the threat feed.'
      };
    }

    if (q.includes('why') || q.includes('connected') || activeTab === 'query-4') {
      return {
        title: 'CORRELATION REASONING MATRIX',
        badge: 'EXPLAINABLE REASONING',
        summary: 'ECHO connected events across 4 independent sources because of 3 matching factors: Shared User Account (employee_07), Shared Host (WORKSTATION-07), and a tight 8-minute temporal window (10:28:43 to 10:36:19).',
        items: CORRELATION_LINKS.map((l) => ({
          time: `Score: ${l.confidenceScore}%`,
          title: `${l.sourceLabel} → ${l.targetLabel}`,
          desc: l.humanExplanation,
          source: l.confidenceLevel,
          severity: l.confidenceScore >= 90 ? 'critical' : 'high'
        })),
        whyMatters: 'WHY THIS MATTERS: ECHO explains every connection explicitly so analysts never have to guess why events were linked.'
      };
    }

    if (q.includes('missing') || q.includes('gap') || activeTab === 'query-5') {
      return {
        title: 'DETECTED EVIDENCE GAPS & NEXT STEPS',
        badge: 'GAP INTELLIGENCE',
        summary: 'ECHO detected 1 HIGH-PRIORITY gap: Endpoint process creation logs between 10:30 and 10:32 were missing in the ingested evidence. Recommended next step: Ingest Sysmon / Windows Event 4688 logs for WORKSTATION-07.',
        items: DETECTED_EVIDENCE_GAPS.map((g) => ({
          time: g.id,
          title: g.expectedStage,
          desc: g.whyFlagged,
          source: g.recommendedSource,
          severity: g.priority === 'HIGH' ? 'critical' : 'medium'
        })),
        whyMatters: 'WHY THIS MATTERS: Identifying missing evidence prevents incomplete conclusions and guides analysts toward what data to collect next.'
      };
    }

    // Default: Highest Confidence Attack Path
    return {
      title: 'HIGHEST CONFIDENCE RECONSTRUCTED ATTACK PATH',
      badge: '94% HIGH CONFIDENCE',
      summary: 'Reconstructed 6-stage kill chain: Brute Force Entry → Successful SSO Login → Encoded PowerShell Execution → Sensitive File Read → Local Zip Staging → 148 MB External Egress.',
      items: RECONSTRUCTED_ATTACK_STAGES.map((s) => ({
        time: s.timestamp,
        title: `Stage ${s.stageNumber}: ${s.eventTitle}`,
        desc: s.connectionExplanation,
        source: s.source,
        severity: s.severity
      })),
      whyMatters: 'WHY THIS MATTERS: Reconstructing chronological attack paths gives analysts immediate situational awareness.'
    };
  };

  const result = getQueryResult();

  return (
    <div className="bg-dark-800 border border-dark-700 rounded-xl p-6 shadow-xl space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-dark-700 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Search className="w-5 h-5 text-cyan-400" />
            <span className="text-xs font-mono font-bold text-cyan-400 uppercase">
              ASK ECHO // INVESTIGATION SEARCH ENGINE
            </span>
          </div>
          <h2 className="text-xl font-bold text-slate-100 mt-1">
            Query Investigation Findings & Telemetry
          </h2>
        </div>

        <span className="text-xs font-mono px-3 py-1 bg-cyan-950 text-cyan-400 border border-cyan-800 rounded-lg font-bold">
          DETERMINISTIC DATA QUERY
        </span>
      </div>

      {/* Preset Query Buttons */}
      <div className="space-y-2">
        <span className="text-[10px] font-mono font-bold text-slate-500 uppercase block">
          SUGGESTED ANALYST QUERIES
        </span>

        <div className="flex flex-wrap gap-2 text-xs font-mono">
          {presetQueries.map((pq) => (
            <button
              key={pq.id}
              onClick={() => handleSelectPreset(pq.text, pq.id)}
              className={`px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
                activeTab === pq.id
                  ? 'bg-cyan-950 text-cyan-300 border-cyan-500 font-bold shadow-[0_0_10px_rgba(6,182,212,0.2)]'
                  : 'bg-dark-900 text-slate-400 border-dark-700 hover:text-slate-200 hover:border-dark-600'
              }`}
            >
              ⚡ {pq.text}
            </button>
          ))}
        </div>
      </div>

      {/* Search Input Bar */}
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search users, IPs, workstations, files, or ask why events are connected..."
          className="w-full bg-dark-900 border border-dark-700 focus:border-cyan-500 text-slate-100 placeholder-slate-500 rounded-xl px-4 py-3 text-xs font-mono outline-none pr-10"
        />
        <CornerDownLeft className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
      </div>

      {/* Query Results Display Box */}
      <div className="bg-dark-900 border border-cyan-900/80 rounded-xl p-5 space-y-4 shadow-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-dark-800 pb-3 font-mono text-xs">
          <span className="font-bold text-slate-100 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-400" /> {result.title}
          </span>
          <span className="px-2.5 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 font-bold text-[10px] self-start sm:self-auto">
            {result.badge}
          </span>
        </div>

        <p className="text-xs text-slate-300 font-sans leading-relaxed">
          {result.summary}
        </p>

        {/* Itemized Results */}
        <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
          {result.items.map((item, idx) => (
            <div key={idx} className="p-3 bg-dark-800 border border-dark-700 rounded-lg text-xs font-mono space-y-1">
              <div className="flex justify-between items-center text-[11px]">
                <span className="text-cyan-400 font-bold">{item.time}</span>
                <span className="text-slate-500">{item.source}</span>
              </div>
              <div className="font-bold text-slate-200">{item.title}</div>
              <div className="text-slate-400 font-sans text-[11px] leading-snug">{item.desc}</div>
            </div>
          ))}
        </div>

        {/* WHY THIS MATTERS Callout Layer */}
        <div className="p-3 bg-cyan-950/40 border border-cyan-900/60 rounded-lg text-xs text-slate-300 font-sans flex items-start gap-2">
          <HelpCircle className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
          <span className="font-bold text-cyan-300">{result.whyMatters}</span>
        </div>
      </div>
    </div>
  );
};
