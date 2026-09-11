import { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  HelpCircle,
  FileText
} from 'lucide-react';
import { InvestigationCandidate } from '../../types/candidates';
import { CANDIDATE_DISCOVERY_SUMMARY } from '../../data/candidateDiscoveryData';
import { CandidateDetailModal } from './CandidateDetailModal';

interface CandidateDiscoveryViewProps {
  onSelectCandidate: (candidate: InvestigationCandidate) => void;
  onOpenCandidateReport?: () => void;
  customCandidates?: InvestigationCandidate[];
  totalEventsAnalyzed?: number;
}

export const CandidateDiscoveryView = ({
  onSelectCandidate,
  onOpenCandidateReport,
  customCandidates,
  totalEventsAnalyzed
}: CandidateDiscoveryViewProps) => {
  const defaultSummary = CANDIDATE_DISCOVERY_SUMMARY;
  const candidatesList = (customCandidates && customCandidates.length > 0)
    ? customCandidates
    : defaultSummary.candidates;

  const totalEvents = totalEventsAnalyzed || defaultSummary.totalEventsAnalyzed;
  const uniqueEntitiesCount = candidatesList.length * 3 + 2;

  const [selectedModalCandidate, setSelectedModalCandidate] = useState<InvestigationCandidate | null>(null);

  return (
    <div className="bg-dark-800 border border-dark-700 rounded-xl p-6 space-y-6 shadow-xl font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-dark-700 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-mono font-bold text-cyan-400 uppercase">
              MULTI-ENTITY CANDIDATE DISCOVERY ENGINE
            </span>
          </div>
          <h2 className="text-xl font-bold text-slate-100 mt-1 font-mono">
            Potential Investigation Candidates Ranked
          </h2>
        </div>

        {onOpenCandidateReport && (
          <button
            onClick={onOpenCandidateReport}
            className="flex items-center gap-2 px-4 py-2 bg-dark-900 hover:bg-dark-700 text-cyan-400 border border-cyan-800 rounded-lg text-xs font-mono transition-colors cursor-pointer self-start md:self-auto font-bold"
          >
            <FileText className="w-4 h-4" />
            <span>FULL CANDIDATE DISCOVERY REPORT</span>
          </button>
        )}
      </div>

      {/* Top Quantified Summary Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 font-mono text-xs text-center">
        <div className="p-3.5 bg-dark-900 border border-dark-700 rounded-xl">
          <span className="text-slate-500 text-[10px] block uppercase font-bold">TOTAL EVENTS ANALYZED</span>
          <span className="text-cyan-400 font-extrabold text-base">{totalEvents.toLocaleString()}</span>
        </div>

        <div className="p-3.5 bg-dark-900 border border-dark-700 rounded-xl">
          <span className="text-slate-500 text-[10px] block uppercase font-bold">ENTITIES SCANNED</span>
          <span className="text-slate-100 font-bold text-base">{uniqueEntitiesCount}</span>
        </div>

        <div className="p-3.5 bg-dark-900 border border-dark-700 rounded-xl">
          <span className="text-slate-500 text-[10px] block uppercase font-bold">CANDIDATES RANKED</span>
          <span className="text-purple-400 font-bold text-base">{candidatesList.length}</span>
        </div>

        <div className="p-3.5 bg-dark-900 border border-dark-700 rounded-xl">
          <span className="text-slate-500 text-[10px] block uppercase font-bold">HIGH-RISK CANDIDATES</span>
          <span className="text-amber-400 font-bold text-base">
            {candidatesList.filter(c => c.riskLevel === 'HIGH' || c.riskScore >= 80).length || 1}
          </span>
        </div>

        <div className="p-3.5 bg-dark-900 border border-cyan-800 rounded-xl">
          <span className="text-slate-500 text-[10px] block uppercase font-bold">CORRELATIONS FOUND</span>
          <span className="text-emerald-400 font-bold text-base">{candidatesList.length * 2} Edges</span>
        </div>
      </div>

      {/* Explanatory Banner */}
      <div className="p-3.5 bg-cyan-950/40 border border-cyan-900/60 rounded-xl text-xs text-slate-300 font-sans flex items-start gap-2.5">
        <HelpCircle className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
        <div>
          <strong className="text-cyan-300 font-mono text-xs uppercase block">CANDIDATE DISCOVERY PHILOSOPHY:</strong>
          <span>
            ECHO scanned all entities in the normalized dataset and calculated separate Risk and Correlation Confidence scores. Select an investigation candidate below to pivot the deep correlation graph, timeline, and report onto that entity.
          </span>
        </div>
      </div>

      {/* Candidates List / Cards */}
      <div className="space-y-4">
        {candidatesList.map((cand, idx) => (
          <div
            key={cand.id || `cand-${idx}`}
            className="bg-dark-900 border border-dark-700 hover:border-cyan-500 rounded-xl p-5 space-y-4 transition-all shadow-lg group relative overflow-hidden"
          >
            {/* Top Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-dark-800 pb-3 font-mono text-xs">
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-lg bg-cyan-950 border border-cyan-500 text-cyan-400 font-extrabold flex items-center justify-center text-xs">
                  #{cand.rank || idx + 1}
                </div>
                <div>
                  <span className="font-bold text-slate-100 text-sm font-mono">{cand.entityName}</span>
                  <span className="text-slate-500 text-[11px] ml-2">({cand.entityType.toUpperCase()})</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase ${
                  cand.riskLevel === 'HIGH' || cand.riskScore >= 80 ? 'bg-red-950 text-red-400 border border-red-800' :
                  cand.riskLevel === 'MEDIUM-HIGH' || cand.riskScore >= 70 ? 'bg-amber-950 text-amber-400 border border-amber-800' :
                  'bg-blue-950 text-blue-400 border border-blue-800'
                }`}>
                  {cand.riskLevel || 'HIGH'} RISK
                </span>

                <span className="text-emerald-400 font-bold bg-emerald-950 px-2.5 py-0.5 rounded border border-emerald-800 text-[10px]">
                  {cand.status || 'PRIORITY INVESTIGATION'}
                </span>
              </div>
            </div>

            {/* Metrics & Indicators */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 font-mono text-xs">
              <div className="p-2.5 bg-dark-800 rounded border border-dark-700">
                <span className="text-slate-500 text-[10px] block uppercase font-bold">RISK SCORE</span>
                <span className="text-amber-400 font-bold text-sm">{cand.riskScore} / 100</span>
              </div>

              <div className="p-2.5 bg-dark-800 rounded border border-dark-700">
                <span className="text-slate-500 text-[10px] block uppercase font-bold">CORRELATION CONFIDENCE</span>
                <span className="text-emerald-400 font-bold text-sm">{cand.correlationConfidence}%</span>
              </div>

              <div className="p-2.5 bg-dark-800 rounded border border-dark-700">
                <span className="text-slate-500 text-[10px] block uppercase font-bold">SOURCES INVOLVED</span>
                <span className="text-purple-300 font-bold text-xs">{cand.sourcesInvolved ? cand.sourcesInvolved.join(', ') : 'Authentication, Endpoint, Network'}</span>
              </div>

              <div className="p-2.5 bg-dark-800 rounded border border-dark-700">
                <span className="text-slate-500 text-[10px] block uppercase font-bold">EVENT VOLUME</span>
                <span className="text-cyan-400 font-bold text-xs">{cand.eventCount || totalEvents} Events</span>
              </div>
            </div>

            <p className="text-xs text-slate-300 font-sans leading-snug">
              <strong className="text-slate-400 font-mono text-[11px] uppercase">PRIMARY REASON:</strong> {cand.primaryReason}
            </p>

            {/* Action Buttons */}
            <div className="pt-3 border-t border-dark-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono">
              <button
                onClick={() => setSelectedModalCandidate(cand)}
                className="text-slate-400 hover:text-cyan-300 text-left cursor-pointer"
              >
                Inspect Score Breakdown & Reasons →
              </button>

              <button
                onClick={() => onSelectCandidate(cand)}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold rounded-lg transition-colors cursor-pointer text-xs uppercase"
              >
                <span>INVESTIGATE {cand.entityName}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Candidate Inspector Modal */}
      <CandidateDetailModal
        candidate={selectedModalCandidate}
        onClose={() => setSelectedModalCandidate(null)}
        onSelectForInvestigation={onSelectCandidate}
      />
    </div>
  );
};
