import { X, Printer, Users } from 'lucide-react';

interface CandidateDiscoveryReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  candidates?: any[];
  totalEvents?: number;
}

export const CandidateDiscoveryReportModal = ({
  isOpen,
  onClose,
  candidates = [],
  totalEvents = 0
}: CandidateDiscoveryReportModalProps) => {
  if (!isOpen) return null;

  const summary = {
    totalEventsAnalyzed: totalEvents,
    uniqueEntitiesObserved: candidates.length,
    totalCandidatesCount: candidates.length,
    crossSourceCorrelationsCount: candidates.reduce((count, candidate) => count + (candidate.sourcesInvolved?.length || 0), 0),
    candidates,
    crossCandidatePatterns: [],
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-fade-in font-sans">
      <div className="bg-dark-900 border border-cyan-500/60 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden relative">
        {/* Modal Header */}
        <div className="p-6 bg-dark-800 border-b border-dark-700 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-cyan-950 text-cyan-400 border border-cyan-800 font-mono">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-cyan-400 uppercase">
                  FULL CANDIDATE DISCOVERY REPORT
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800 font-bold">
                  MULTI-ENTITY SCAN
                </span>
              </div>
              <h2 className="text-xl font-bold text-slate-100 font-mono">
                INVESTIGATION CANDIDATE DISCOVERY SUMMARY
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-3 py-1.5 bg-dark-700 hover:bg-dark-600 text-slate-200 rounded-lg text-xs font-mono border border-dark-600 cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Export PDF</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-dark-800 text-slate-400 hover:text-slate-100 border border-dark-700 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-slate-300 text-sm leading-relaxed">
          {/* Executive Summary */}
          <div className="p-4 bg-dark-800 border border-dark-700 rounded-xl space-y-2 font-mono text-xs">
            <span className="text-[10px] font-bold text-cyan-400 uppercase">1. SCAN SUMMARY</span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center pt-2">
              <div className="p-2 bg-dark-900 rounded border border-dark-700">
                <span className="text-slate-500 text-[10px] block">EVENTS ANALYZED</span>
                <span className="font-bold text-slate-100 text-sm">{summary.totalEventsAnalyzed.toLocaleString()}</span>
              </div>
              <div className="p-2 bg-dark-900 rounded border border-dark-700">
                <span className="text-slate-500 text-[10px] block">ENTITIES SCANNED</span>
                <span className="font-bold text-purple-300 text-sm">{summary.uniqueEntitiesObserved}</span>
              </div>
              <div className="p-2 bg-dark-900 rounded border border-dark-700">
                <span className="text-slate-500 text-[10px] block">CANDIDATES RANKED</span>
                <span className="font-bold text-amber-300 text-sm">{summary.totalCandidatesCount}</span>
              </div>
              <div className="p-2 bg-dark-900 rounded border border-dark-700">
                <span className="text-slate-500 text-[10px] block">CORRELATION EDGES</span>
                <span className="font-bold text-emerald-400 text-sm">{summary.crossSourceCorrelationsCount}</span>
              </div>
            </div>
          </div>

          {/* Priority Candidates Table */}
          <div className="space-y-3">
            <h3 className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">
              2. RANKED INVESTIGATION CANDIDATES
            </h3>

            <div className="bg-dark-800 border border-dark-700 rounded-xl overflow-x-auto">
              <table className="w-full text-left font-mono text-xs">
                <thead className="bg-dark-950 text-slate-400 border-b border-dark-700 text-[11px] uppercase">
                  <tr>
                    <th className="p-3">RANK</th>
                    <th className="p-3">ENTITY</th>
                    <th className="p-3">TYPE</th>
                    <th className="p-3">RISK SCORE</th>
                    <th className="p-3">CONFIDENCE</th>
                    <th className="p-3">SOURCES</th>
                    <th className="p-3">STATUS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-dark-800 text-[11px]">
                  {summary.candidates.map((cand) => (
                    <tr key={cand.id} className="hover:bg-dark-900/60">
                      <td className="p-3 font-bold text-cyan-400">#{cand.rank}</td>
                      <td className="p-3 font-bold text-slate-100">{cand.entityName}</td>
                      <td className="p-3 text-slate-400 uppercase">{cand.entityType}</td>
                      <td className="p-3 text-amber-400 font-bold">{cand.riskScore} / 100</td>
                      <td className="p-3 text-emerald-400 font-bold">{cand.correlationConfidence}%</td>
                      <td className="p-3 text-purple-300">{cand.sourcesInvolved.length} Silos</td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px] font-bold">
                          {cand.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Individual Candidate Detailed Sections */}
          <div className="space-y-4">
            <h3 className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">
              3. INDIVIDUAL CANDIDATE BREAKDOWNS
            </h3>

            {summary.candidates.map((cand) => (
              <div key={cand.id} className="p-4 bg-dark-800 border border-dark-700 rounded-xl space-y-3 font-mono text-xs">
                <div className="flex justify-between items-center border-b border-dark-700 pb-2">
                  <span className="font-bold text-slate-100 text-sm">
                    CANDIDATE #{cand.rank}: {cand.entityName} ({cand.entityType.toUpperCase()})
                  </span>
                  <span className="text-amber-400 font-bold">RISK: {cand.riskScore}/100</span>
                </div>

                <div className="space-y-1 font-sans text-xs">
                  <strong className="font-mono text-[10px] text-slate-500 uppercase block">WHY FLAGGED:</strong>
                  <ul className="list-disc list-inside text-slate-300 space-y-0.5">
                    {cand.whyFlagged.map((w: string, i: number) => (
                      <li key={i}>{w}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>

          {/* Cross-Candidate Pattern Analysis */}
          <div className="p-4 bg-dark-800 border border-dark-700 rounded-xl space-y-2">
            <h3 className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">
              4. CROSS-CANDIDATE PATTERN ANALYSIS
            </h3>
            <ul className="text-xs text-slate-300 space-y-1 list-disc list-inside font-mono">
              {summary.crossCandidatePatterns.map((pat, idx) => (
                <li key={idx}>{pat}</li>
              ))}
            </ul>
          </div>

          {/* Analyst Disclaimer */}
          <div className="p-3 bg-dark-800/80 border border-dark-700 rounded-lg text-[11px] font-mono text-slate-500">
            <strong>Analyst Note:</strong> Automated correlation indicates suspicious activity across ranked candidates. Analyst verification is required before containment or attribution.
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-dark-800 border-t border-dark-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold rounded-lg text-xs font-mono transition-colors cursor-pointer uppercase"
          >
            Close Full Report
          </button>
        </div>
      </div>
    </div>
  );
};
