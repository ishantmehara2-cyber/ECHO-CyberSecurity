import { useState, useEffect, useRef } from 'react';
import {
  GitBranch,
  Sparkles,
  Clock,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  User,
  Monitor,
  Globe,
  FileText,
  ShieldCheck,
  Loader2,
  ArrowRight,
  Database,
  Search
} from 'lucide-react';
import { EmptyInvestigationState } from '../components/Common/EmptyInvestigationState';
import { useInvestigation } from '../context/InvestigationContext';

export interface ReconstructedStage {
  id: number;
  stageNumber: string;
  stageName: string;
  title: string;
  time: string;
  description: string;
  evidenceSource: string;
  entity: string;
  host: string;
  ipOrFile?: string;
  reasoning: string;
  supportLevel: string;
  reconstructionNote: string;
  severity: 'critical' | 'high' | 'medium' | 'info';
  missingEvidenceSuggestions?: string[];
}

export const RECONSTRUCTED_STAGES: ReconstructedStage[] = [
  {
    id: 1,
    stageNumber: '01',
    stageName: 'Initial Authentication',
    title: 'User Authentication Successful',
    time: '10:28:43',
    description: 'employee_21 successfully authenticated into the environment via single sign-on gateway.',
    evidenceSource: 'Authentication Telemetry',
    entity: 'employee_21',
    host: 'WORKSTATION-07',
    reasoning: 'Identity activity established the starting point of the investigation.',
    supportLevel: 'HIGH EVIDENCE SUPPORT',
    reconstructionNote: 'I established this authentication event as the initial temporal anchor because employee_21 authenticated from an external session into the corporate network.',
    severity: 'medium'
  },
  {
    id: 2,
    stageNumber: '02',
    stageName: 'Host Association',
    title: 'Identity Bound to Host WORKSTATION-07',
    time: '10:29:11',
    description: 'The authenticated identity employee_21 was associated with WORKSTATION-07 via active logon session.',
    evidenceSource: 'Authentication + Endpoint Telemetry',
    entity: 'employee_21',
    host: 'WORKSTATION-07',
    reasoning: 'The same identity and related session activity connect the user to the endpoint.',
    supportLevel: 'VERIFIED ASSOCIATION',
    reconstructionNote: 'I correlated session token SES-7F21A which bound employee_21 directly to host WORKSTATION-07 within 28 seconds of authentication.',
    severity: 'medium'
  },
  {
    id: 3,
    stageNumber: '03',
    stageName: 'Process Execution',
    title: 'Suspicious Encoded Command Execution',
    time: '10:30:16',
    description: 'A suspicious process was executed on WORKSTATION-07 shortly after authentication.',
    evidenceSource: 'Endpoint Telemetry',
    entity: 'employee_21',
    host: 'WORKSTATION-07',
    reasoning: 'Temporal proximity and host association connect this activity with the previous authentication event.',
    supportLevel: 'HIGH EVIDENCE SUPPORT',
    reconstructionNote: 'I connected this event to the previous stage because process execution occurred on WORKSTATION-07 within 65 seconds of active logon under the employee_21 account context.',
    severity: 'high'
  },
  {
    id: 4,
    stageNumber: '04',
    stageName: 'Network Communication',
    title: 'Outbound External Network Connection',
    time: '10:31:08',
    description: 'WORKSTATION-07 initiated communication with an external network indicator.',
    evidenceSource: 'Network Telemetry',
    entity: 'employee_21',
    host: 'WORKSTATION-07',
    ipOrFile: '198.51.100.77',
    reasoning: 'The network activity occurred shortly after suspicious endpoint activity and involves the same host.',
    supportLevel: 'CORRELATED NETWORK SIGNAL',
    reconstructionNote: 'I correlated this egress stream because WORKSTATION-07 established an outbound socket connection to 198.51.100.77 shortly after the suspicious process execution.',
    severity: 'high'
  },
  {
    id: 5,
    stageNumber: '05',
    stageName: 'File Access',
    title: 'Restricted Asset finance_records.xlsx Accessed',
    time: '10:32:24',
    description: 'finance_records.xlsx was accessed following the suspicious process and external communication.',
    evidenceSource: 'File Activity Telemetry',
    entity: 'employee_21',
    host: 'WORKSTATION-07',
    ipOrFile: 'finance_records.xlsx',
    reasoning: 'The activity is connected through temporal proximity, host context and investigation sequence.',
    supportLevel: 'HIGH EVIDENCE SUPPORT',
    reconstructionNote: 'I connected file access for finance_records.xlsx to the timeline because the file handle was opened on WORKSTATION-07 under the employee_21 session.',
    severity: 'critical'
  },
  {
    id: 6,
    stageNumber: '06',
    stageName: 'Archive Preparation',
    title: 'Staging Compressed Archive review_pack.zip Created',
    time: '10:33:12',
    description: 'A compressed archive review_pack.zip was created or accessed.',
    evidenceSource: 'File Activity Telemetry',
    entity: 'employee_21',
    host: 'WORKSTATION-07',
    ipOrFile: 'review_pack.zip',
    reasoning: 'The archive preparation may indicate collection or preparation of data for transfer.',
    supportLevel: 'SUSPICIOUS PATTERN',
    reconstructionNote: 'I identified archive creation of review_pack.zip as a potential staging step occurring immediately after the restricted spreadsheet was accessed.',
    severity: 'critical'
  },
  {
    id: 7,
    stageNumber: '07',
    stageName: 'Potential Data Transfer',
    title: 'Potential External Communication & Data Egress',
    time: '10:34:02',
    description: 'The reconstructed sequence indicates possible communication between the endpoint and the external indicator after suspicious file activity.',
    evidenceSource: 'Network + File + Endpoint Correlation',
    entity: 'employee_21',
    host: 'WORKSTATION-07',
    ipOrFile: '198.51.100.77 (148 MB)',
    reasoning: 'The combination of file activity, archive preparation and external communication creates a suspicious investigation narrative.',
    supportLevel: 'POTENTIAL DATA TRANSFER',
    reconstructionNote: 'I correlated this potential data transfer based on multi-source sequence timing. Correlated evidence suggests data exfiltration may have occurred, but requires further investigation.',
    severity: 'critical'
  },
  {
    id: 8,
    stageNumber: '08',
    stageName: 'Evidence Gap Identified',
    title: 'Additional Telemetry Required to Confirm Egress',
    time: 'Investigation Analysis',
    description: 'Additional telemetry is required to confirm whether data was successfully transferred or blocked.',
    evidenceSource: 'Evidence Intelligence Engine',
    entity: 'employee_21',
    host: 'WORKSTATION-07',
    reasoning: 'ECHO identifies the point where the available evidence is insufficient for a definitive conclusion.',
    supportLevel: 'ADDITIONAL EVIDENCE REQUIRED',
    reconstructionNote: 'I flagged this evidence gap because packet payload telemetry is absent. Collecting additional firewall and proxy logs could confirm or reject the current attack hypothesis.',
    severity: 'high',
    missingEvidenceSuggestions: [
      'Firewall logs',
      'Proxy logs',
      'Network packet metadata',
      'Data loss prevention telemetry'
    ]
  }
];

export const AttackReconstructionPage = () => {
  const { hasAnalysisData } = useInvestigation();

  // Animation & Stage State
  const [analyzingState, setAnalyzingState] = useState<'loading' | 'complete'>('loading');
  const [statusText, setStatusText] = useState<string>('ECHO ANALYZING TELEMETRY...');
  const [selectedStage, setSelectedStage] = useState<ReconstructedStage>(RECONSTRUCTED_STAGES[0]);

  // Typewriter Animation State
  const [displayedNote, setDisplayedText] = useState<string>('');
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const typingTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Initial Sequence Load Animation (600ms steps)
  useEffect(() => {
    const steps = [
      { time: 600, text: 'Normalizing evidence sources...' },
      { time: 1200, text: 'Extracting entities and timestamps...' },
      { time: 1800, text: 'Correlating identity, endpoint and network activity...' },
      { time: 2400, text: 'Constructing chronological investigation path...' },
      { time: 3000, text: 'Reconstruction complete.' }
    ];

    const timers = steps.map((s) =>
      setTimeout(() => {
        setStatusText(s.text);
        if (s.text === 'Reconstruction complete.') {
          setAnalyzingState('complete');
        }
      }, s.time)
    );

    return () => timers.forEach(clearTimeout);
  }, []);

  // Fast & Smooth Typewriter Effect when a Stage is Selected
  useEffect(() => {
    if (typingTimerRef.current) {
      clearInterval(typingTimerRef.current);
      typingTimerRef.current = null;
    }

    const noteText = selectedStage.reconstructionNote;
    const words = noteText.split(' ');
    let currentIdx = 0;
    setDisplayedText('');
    setIsTyping(true);

    typingTimerRef.current = setInterval(() => {
      if (currentIdx < words.length) {
        setDisplayedText(words.slice(0, currentIdx + 1).join(' '));
        currentIdx++;
      } else {
        if (typingTimerRef.current) clearInterval(typingTimerRef.current);
        setIsTyping(false);
      }
    }, 35); // 35ms per word for fast, smooth typing

    return () => {
      if (typingTimerRef.current) clearInterval(typingTimerRef.current);
    };
  }, [selectedStage]);

  if (!hasAnalysisData) {
    return (
      <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 font-sans">
        <div className="bg-dark-800/80 border border-dark-700 rounded-xl p-6 overflow-hidden backdrop-blur-sm shadow-xl font-sans">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-800/50 text-cyan-400 text-xs font-semibold uppercase tracking-wider font-mono">
              <Sparkles className="w-3.5 h-3.5" />
              <span>CHRONOLOGICAL MULTI-STAGE KILL CHAIN SYNTHESIS</span>
            </div>

            <h1 className="text-3xl font-extrabold text-slate-100 tracking-tight flex items-center gap-3 font-mono">
              <GitBranch className="w-8 h-8 text-cyan-400" />
              Attack Reconstruction Engine
            </h1>

            <p className="text-slate-400 text-sm sm:text-base leading-relaxed max-w-3xl font-sans">
              Transforming correlated telemetry into an explainable chronological investigation narrative.
            </p>
          </div>
        </div>

        <EmptyInvestigationState
          moduleTitle="Attack Reconstruction Engine"
          moduleDescription="Upload and analyze telemetry evidence in the Evidence Vault to reconstruct chronological attack sequences."
        />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 font-sans">
      {/* 1. TOP HEADER & METRICS BAR */}
      <div className="bg-dark-800/80 border border-dark-700 rounded-xl p-6 space-y-5 shadow-xl font-sans">
        <div className="space-y-2 border-b border-dark-700 pb-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-800/50 text-cyan-400 text-xs font-semibold uppercase tracking-wider font-mono">
            <Sparkles className="w-3.5 h-3.5" />
            <span>CHRONOLOGICAL MULTI-STAGE KILL CHAIN SYNTHESIS</span>
          </div>

          <h1 className="text-3xl font-extrabold text-slate-100 tracking-tight flex items-center gap-3 font-mono">
            <GitBranch className="w-8 h-8 text-cyan-400" />
            Attack Reconstruction Engine
          </h1>

          <p className="text-slate-400 text-sm sm:text-base leading-relaxed max-w-3xl font-sans">
            Transforming correlated telemetry into an explainable chronological investigation narrative.
          </p>
        </div>

        {/* Professional Metrics Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 font-mono text-xs text-center">
          <div className="p-3 bg-dark-900 border border-dark-700 rounded-xl">
            <span className="text-slate-500 text-[10px] block uppercase font-bold">TOTAL EVENTS ANALYZED</span>
            <span className="text-cyan-400 font-extrabold text-base">27</span>
          </div>

          <div className="p-3 bg-dark-900 border border-dark-700 rounded-xl">
            <span className="text-slate-500 text-[10px] block uppercase font-bold">EVENTS CORRELATED</span>
            <span className="text-purple-300 font-bold text-base">23</span>
          </div>

          <div className="p-3 bg-dark-900 border border-dark-700 rounded-xl">
            <span className="text-slate-500 text-[10px] block uppercase font-bold">PRIMARY ENTITY</span>
            <span className="text-purple-300 font-bold text-xs truncate block">employee_21</span>
          </div>

          <div className="p-3 bg-dark-900 border border-dark-700 rounded-xl">
            <span className="text-slate-500 text-[10px] block uppercase font-bold">PRIMARY HOST</span>
            <span className="text-blue-300 font-bold text-xs truncate block">WORKSTATION-07</span>
          </div>

          <div className="p-3 bg-dark-900 border border-dark-700 rounded-xl">
            <span className="text-slate-500 text-[10px] block uppercase font-bold">CORRELATION COVERAGE</span>
            <span className="text-emerald-400 font-extrabold text-base">85%</span>
          </div>

          <div className="p-3 bg-dark-900 border border-cyan-800 rounded-xl">
            <span className="text-slate-500 text-[10px] block uppercase font-bold">STATUS</span>
            <span className="text-emerald-400 font-bold text-xs uppercase flex items-center justify-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>RECONSTRUCTION COMPLETE</span>
            </span>
          </div>
        </div>
      </div>

      {/* 2. INITIAL ANALYSIS ANIMATION BANNER */}
      <div className={`p-4 bg-dark-800 border rounded-xl font-mono text-xs flex items-center justify-between transition-colors shadow-lg ${
        analyzingState === 'complete' ? 'border-emerald-800/80 bg-emerald-950/30' : 'border-cyan-800/80 bg-cyan-950/30'
      }`}>
        <div className="flex items-center gap-3">
          {analyzingState === 'loading' ? (
            <Loader2 className="w-4 h-4 text-cyan-400 animate-spin shrink-0" />
          ) : (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          )}

          <span className={`font-bold uppercase tracking-wider ${
            analyzingState === 'complete' ? 'text-emerald-400' : 'text-cyan-400'
          }`}>
            {statusText}
            {analyzingState === 'loading' && <span className="animate-pulse">▋</span>}
          </span>
        </div>

        <span className="text-slate-500 text-[11px] hidden sm:inline">
          {analyzingState === 'complete' ? '8 STAGES SYNTHESIZED' : 'ECHO RECONSTRUCTION PIPELINE'}
        </span>
      </div>

      {/* 3. HORIZONTAL STAGE NAVIGATOR CARDS */}
      <div className="bg-dark-800 border border-dark-700 rounded-xl p-5 space-y-3 shadow-xl">
        <div className="flex items-center justify-between border-b border-dark-700 pb-3 font-mono text-xs">
          <span className="text-cyan-400 font-bold uppercase flex items-center gap-2">
            <Clock className="w-4 h-4" /> RECONSTRUCTED KILL CHAIN STAGE NAVIGATOR
          </span>
          <span className="text-slate-500 text-[11px]">
            Click any stage card to inspect evidence reasoning
          </span>
        </div>

        {/* 8 Stage Selector Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5 font-mono text-xs">
          {RECONSTRUCTED_STAGES.map((stage) => {
            const isSelected = selectedStage.id === stage.id;
            const isGap = stage.id === 8;

            return (
              <button
                key={stage.id}
                onClick={() => setSelectedStage(stage)}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between space-y-2 ${
                  isSelected
                    ? isGap
                      ? 'bg-amber-950 text-amber-200 border-amber-400 ring-2 ring-amber-400/50 scale-[1.02] shadow-[0_0_15px_rgba(245,158,11,0.25)] font-bold'
                      : 'bg-cyan-950 text-cyan-200 border-cyan-400 ring-2 ring-cyan-400/50 scale-[1.02] shadow-[0_0_15px_rgba(6,182,212,0.25)] font-bold'
                    : isGap
                    ? 'bg-dark-900 text-amber-400/80 border-amber-900/60 hover:border-amber-500 hover:text-amber-200'
                    : 'bg-dark-900 text-slate-400 border-dark-700 hover:border-cyan-500 hover:text-slate-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-slate-500 font-bold block">
                    STAGE {stage.stageNumber}
                  </span>
                  {isSelected && (
                    <span className={`w-2 h-2 rounded-full ${isGap ? 'bg-amber-400' : 'bg-cyan-400'} animate-ping`} />
                  )}
                </div>

                <div className="font-bold truncate text-[11px] font-mono leading-tight">
                  {stage.stageName}
                </div>

                <div className="text-[10px] text-slate-500 truncate block">
                  {stage.time}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. MAIN DETAILED INVESTIGATION PANEL */}
      <div className="bg-dark-800 border border-cyan-500/60 rounded-xl p-6 shadow-2xl space-y-5">
        {/* Stage Title & Support Level Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-dark-700 pb-4 font-mono text-xs">
          <div>
            <span className="text-cyan-400 font-bold uppercase text-[11px] block">
              STAGE {selectedStage.stageNumber} // {selectedStage.stageName.toUpperCase()}
            </span>
            <h2 className="text-xl font-bold text-slate-100 font-sans mt-0.5">
              {selectedStage.title}
            </h2>
          </div>

          <div className="flex items-center gap-2 shrink-0 font-mono">
            <span className="text-slate-400 text-[11px]">{selectedStage.time}</span>
            <span className={`px-3 py-1 rounded-lg text-xs font-bold uppercase border ${
              selectedStage.id === 8
                ? 'bg-amber-950 text-amber-400 border-amber-800'
                : selectedStage.severity === 'critical'
                ? 'bg-red-950 text-red-400 border-red-800'
                : 'bg-cyan-950 text-cyan-400 border-cyan-800'
            }`}>
              {selectedStage.supportLevel}
            </span>
          </div>
        </div>

        {/* Entity, Host & Telemetry Context Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 font-mono text-xs bg-dark-900 p-4 rounded-xl border border-dark-700">
          <div>
            <span className="text-slate-500 text-[10px] block uppercase font-bold">TARGET ENTITY</span>
            <span className="text-purple-300 font-bold text-sm flex items-center gap-1.5 mt-0.5">
              <User className="w-3.5 h-3.5 text-purple-400" /> {selectedStage.entity}
            </span>
          </div>

          <div>
            <span className="text-slate-500 text-[10px] block uppercase font-bold">TARGET HOST</span>
            <span className="text-blue-300 font-bold text-sm flex items-center gap-1.5 mt-0.5">
              <Monitor className="w-3.5 h-3.5 text-blue-400" /> {selectedStage.host}
            </span>
          </div>

          <div>
            <span className="text-slate-500 text-[10px] block uppercase font-bold">INDICATOR / ASSET</span>
            <span className="text-emerald-300 font-bold text-sm flex items-center gap-1.5 mt-0.5 truncate">
              {selectedStage.ipOrFile?.includes('.') && !selectedStage.ipOrFile.includes('.xlsx') && !selectedStage.ipOrFile.includes('.zip') ? (
                <Globe className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              ) : (
                <FileText className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              )}
              <span className="truncate">{selectedStage.ipOrFile || 'Workstation Session'}</span>
            </span>
          </div>

          <div>
            <span className="text-slate-500 text-[10px] block uppercase font-bold">EVIDENCE STREAM</span>
            <span className="text-cyan-300 font-bold text-sm flex items-center gap-1.5 mt-0.5">
              <Database className="w-3.5 h-3.5 text-cyan-400" /> {selectedStage.evidenceSource}
            </span>
          </div>
        </div>

        {/* Description & Investigation Reasoning */}
        <div className="space-y-3 bg-dark-900 p-5 rounded-xl border border-dark-700">
          <div>
            <span className="text-slate-500 text-[10px] font-mono font-bold uppercase block mb-1">
              OBSERVED ACTIVITY DESCRIPTION
            </span>
            <p className="text-sm text-slate-200 leading-relaxed font-sans">
              {selectedStage.description}
            </p>
          </div>

          <div className="pt-3 border-t border-dark-800">
            <span className="text-cyan-400 font-mono text-[10px] font-bold uppercase flex items-center gap-1 mb-1">
              <HelpCircle className="w-3.5 h-3.5" /> CORRELATION REASONING
            </span>
            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              {selectedStage.reasoning}
            </p>
          </div>
        </div>

        {/* Missing Evidence Suggestions for Stage 8 */}
        {selectedStage.missingEvidenceSuggestions && (
          <div className="p-4 bg-amber-950/40 border border-amber-800/80 rounded-xl space-y-2 font-mono text-xs">
            <span className="text-amber-400 font-bold flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
              RECOMMENDED NEXT DATA SOURCES TO RESOLVE GAP:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
              {selectedStage.missingEvidenceSuggestions.map((sug, i) => (
                <div key={i} className="p-2 bg-dark-900 border border-amber-900/60 rounded text-slate-300 font-bold flex items-center gap-2">
                  <Search className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>{sug}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 5. ECHO RECONSTRUCTION NOTE (TYPEWRITER BOX) */}
        <div className="p-5 bg-cyan-950/40 border border-cyan-500/60 rounded-xl space-y-2 font-mono text-xs relative overflow-hidden shadow-lg">
          <div className="flex items-center justify-between border-b border-cyan-900/60 pb-2">
            <span className="text-cyan-400 font-bold uppercase text-[11px] flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
              ECHO RECONSTRUCTION NOTE
            </span>

            {isTyping && (
              <span className="text-[10px] text-cyan-400 flex items-center gap-1 font-bold">
                <Loader2 className="w-3 h-3 animate-spin" /> SYNTHESIZING REASONING...
              </span>
            )}
          </div>

          <p className="text-sm text-slate-200 font-sans leading-relaxed tracking-wide pt-1">
            <strong className="text-cyan-400 font-mono">{'>'} </strong>
            {displayedNote}
            {isTyping && <span className="inline-block w-2 h-4 ml-1 bg-cyan-400 animate-pulse align-middle">▋</span>}
          </p>
        </div>
      </div>

      {/* 6. FINAL ATTACK PATH VISUAL SUMMARY */}
      <div className="bg-dark-800 border border-dark-700 rounded-xl p-6 shadow-xl space-y-4 font-mono text-xs">
        <div className="flex items-center justify-between border-b border-dark-700 pb-3">
          <span className="text-cyan-400 font-bold uppercase flex items-center gap-2">
            <GitBranch className="w-4 h-4" /> VISUAL RECONSTRUCTED ATTACK PATH
          </span>
          <span className="text-slate-500 text-[11px]">Sequential progression flow</span>
        </div>

        <div className="p-4 bg-dark-900 border border-dark-700 rounded-xl overflow-x-auto">
          <div className="flex flex-wrap lg:flex-nowrap items-center justify-between gap-2 min-w-[800px]">
            <div className="p-2.5 rounded-lg bg-dark-800 border border-purple-800/80 text-purple-300 font-bold text-center shrink-0">
              <User className="w-3.5 h-3.5 mx-auto mb-1 text-purple-400" />
              <span>employee_21</span>
            </div>

            <ArrowRight className="w-4 h-4 text-cyan-400 shrink-0" />

            <div className="p-2.5 rounded-lg bg-dark-800 border border-cyan-800/80 text-cyan-300 font-bold text-center shrink-0">
              <span>01 Auth</span>
            </div>

            <ArrowRight className="w-4 h-4 text-cyan-400 shrink-0" />

            <div className="p-2.5 rounded-lg bg-dark-800 border border-blue-800/80 text-blue-300 font-bold text-center shrink-0">
              <Monitor className="w-3.5 h-3.5 mx-auto mb-1 text-blue-400" />
              <span>WORKSTATION-07</span>
            </div>

            <ArrowRight className="w-4 h-4 text-cyan-400 shrink-0" />

            <div className="p-2.5 rounded-lg bg-dark-800 border border-cyan-800/80 text-cyan-300 font-bold text-center shrink-0">
              <span>03 Process</span>
            </div>

            <ArrowRight className="w-4 h-4 text-cyan-400 shrink-0" />

            <div className="p-2.5 rounded-lg bg-dark-800 border border-red-800/80 text-red-300 font-bold text-center shrink-0">
              <Globe className="w-3.5 h-3.5 mx-auto mb-1 text-red-400" />
              <span>198.51.100.77</span>
            </div>

            <ArrowRight className="w-4 h-4 text-cyan-400 shrink-0" />

            <div className="p-2.5 rounded-lg bg-dark-800 border border-amber-800/80 text-amber-300 font-bold text-center shrink-0">
              <FileText className="w-3.5 h-3.5 mx-auto mb-1 text-amber-400" />
              <span>finance_records.xlsx</span>
            </div>

            <ArrowRight className="w-4 h-4 text-cyan-400 shrink-0" />

            <div className="p-2.5 rounded-lg bg-dark-800 border border-amber-800/80 text-amber-300 font-bold text-center shrink-0">
              <span>review_pack.zip</span>
            </div>

            <ArrowRight className="w-4 h-4 text-cyan-400 shrink-0" />

            <div className="p-2.5 rounded-lg bg-dark-800 border border-red-800/80 text-red-300 font-bold text-center shrink-0">
              <span>07 Data Transfer</span>
            </div>

            <ArrowRight className="w-4 h-4 text-amber-400 shrink-0" />

            <div className="p-2.5 rounded-lg bg-amber-950 border-2 border-amber-400 text-amber-300 font-bold text-center shrink-0 shadow-[0_0_12px_rgba(245,158,11,0.3)]">
              <AlertTriangle className="w-3.5 h-3.5 mx-auto mb-1 text-amber-400 animate-pulse" />
              <span>EVIDENCE REQUIRED</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttackReconstructionPage;
