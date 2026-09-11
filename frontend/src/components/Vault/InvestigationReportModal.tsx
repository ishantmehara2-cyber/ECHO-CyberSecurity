import { X } from 'lucide-react';

interface InvestigationReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedEntityName?: string;
  analysisData?: any;
}

export const InvestigationReportModal = ({ isOpen, onClose, selectedEntityName, analysisData }: InvestigationReportModalProps) => {
  if (!isOpen) return null;
  const summary = analysisData?.summary;
  const stages = analysisData?.timeline || [];
  const gaps = analysisData?.evidence_gaps || [];
  const entities = analysisData?.extractedEntities || [];
  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-dark-900 border border-cyan-500/60 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        <div className="p-6 bg-dark-800 border-b border-dark-700 flex items-center justify-between">
          <div><span className="text-xs font-mono font-bold text-cyan-400 uppercase">GENERATED FROM CURRENT INVESTIGATION DATA</span><h2 className="text-xl font-bold text-slate-100 font-mono">ECHO INVESTIGATION REPORT</h2></div>
          <div className="flex gap-2"><button onClick={() => window.print()} className="px-3 py-1.5 bg-dark-700 text-slate-200 rounded-lg text-xs font-mono">Print / Export</button><button onClick={onClose} className="p-1.5 bg-dark-800 text-slate-400 border border-dark-700 rounded-lg"><X className="w-5 h-5" /></button></div>
        </div>
        <div className="p-6 overflow-y-auto space-y-5 text-slate-300 text-sm">
          <section className="p-4 bg-dark-800 border border-dark-700 rounded-xl"><h3 className="text-xs font-mono text-cyan-400 uppercase">Summary</h3><p className="mt-2">{summary?.narrativeText || 'No investigation summary is available.'}</p><p className="mt-2 text-xs text-slate-400">Records: {analysisData?.total_records || 0} · Confidence: {analysisData?.confidence?.overallScore ?? 0}% · Coverage: {analysisData?.confidence?.coverageScore ?? 0}% · Selected entity: {selectedEntityName || 'None'}</p></section>
          <section><h3 className="text-xs font-mono text-cyan-400 uppercase mb-2">Key Entities</h3><div className="flex flex-wrap gap-2">{entities.map((entity: any) => <span key={entity.id} className="px-2 py-1 bg-dark-800 border border-dark-700 rounded text-xs">{entity.category}: {entity.name}</span>)}</div></section>
          <section><h3 className="text-xs font-mono text-cyan-400 uppercase mb-2">Timeline</h3>{stages.length ? stages.map((stage: any) => <div key={stage.stageNumber} className="p-3 bg-dark-800 border-b border-dark-700 text-xs"><span className="text-cyan-400">{stage.timestamp}</span> · {stage.stageName} · {stage.eventTitle}</div>) : <p className="text-slate-500">No timeline evidence available.</p>}</section>
          <section><h3 className="text-xs font-mono text-cyan-400 uppercase mb-2">Evidence Gaps</h3>{gaps.length ? gaps.map((gap: any) => <div key={gap.id} className="p-3 bg-dark-800 border border-dark-700 rounded text-xs">{gap.id}: {gap.whyFlagged}</div>) : <p className="text-slate-500">No evidence gaps identified.</p>}</section>
        </div>
      </div>
    </div>
  );
};
