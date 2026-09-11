import { useState } from 'react';
import {
  Network,
  Sparkles,
  CheckCircle2,
  HelpCircle,
  ShieldCheck,
  RotateCcw,
  User,
  Monitor,
  Globe,
  Lock,
  Cpu,
  FileText,
  AlertTriangle,
  Eye,
  Info
} from 'lucide-react';
import { GraphNode } from '../../types/vault';
import { CorrelationLink } from '../../types/correlation';
import { DEMO_GRAPH_NODES } from '../../data/vaultDemoData';
import { CORRELATION_LINKS } from '../../data/correlationEngine';

export const InteractiveCorrelationGraph = () => {
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(DEMO_GRAPH_NODES[0]);
  const [selectedLink, setSelectedLink] = useState<CorrelationLink | null>(CORRELATION_LINKS[0]);
  const [isHighlightPathOnly, setIsHighlightPathOnly] = useState<boolean>(true);

  const handleResetSelection = () => {
    setSelectedNode(DEMO_GRAPH_NODES[0]);
    setSelectedLink(CORRELATION_LINKS[0]);
    setIsHighlightPathOnly(false);
  };

  const legendItems = [
    { label: 'USER / ACCOUNT', icon: User, color: 'text-purple-400' },
    { label: 'HOST / ENDPOINT', icon: Monitor, color: 'text-blue-400' },
    { label: 'IP / NETWORK', icon: Globe, color: 'text-red-400' },
    { label: 'AUTHENTICATION EVENT', icon: Lock, color: 'text-cyan-400' },
    { label: 'PROCESS / APPLICATION', icon: Cpu, color: 'text-emerald-400' },
    { label: 'FILE / DATA ACTIVITY', icon: FileText, color: 'text-amber-400' },
    { label: 'POSSIBLE EVIDENCE GAP', icon: AlertTriangle, color: 'text-amber-500' }
  ];

  return (
    <div className="bg-dark-800 border border-dark-700 rounded-xl p-6 space-y-6 shadow-xl">
      {/* 1. Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-dark-700 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-cyan-400 uppercase">
              EXPLAINABLE EVIDENCE CORRELATION GRAPH
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 bg-cyan-950 text-cyan-400 border border-cyan-800 rounded font-bold">
              CROSS-SILO RELATIONSHIPS
            </span>
          </div>
          <h2 className="text-xl font-bold text-slate-100 mt-1">
            Multi-Vector Cross-Silo Relationship Graph
          </h2>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Highlight Path Toggle */}
          <button
            onClick={() => setIsHighlightPathOnly(!isHighlightPathOnly)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border font-mono text-xs font-bold transition-all cursor-pointer ${
              isHighlightPathOnly
                ? 'bg-cyan-950 text-cyan-300 border-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.3)]'
                : 'bg-dark-900 text-slate-400 border-dark-700 hover:text-slate-200'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>HIGHLIGHT CORRELATED PATH: {isHighlightPathOnly ? 'ON' : 'OFF'}</span>
          </button>

          <button
            onClick={handleResetSelection}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-dark-900 hover:bg-dark-700 text-slate-300 border border-dark-700 rounded-lg text-xs font-mono transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>

          <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 font-bold bg-emerald-950/80 px-3 py-1.5 rounded-lg border border-emerald-800">
            <ShieldCheck className="w-4 h-4" />
            <span>CLUSTER CONFIDENCE: 94%</span>
          </div>
        </div>
      </div>

      {/* 2. HOW TO READ THIS GRAPH Guide Box */}
      <div className="p-4 bg-dark-900/90 border border-dark-700 rounded-xl space-y-2 font-mono text-xs">
        <div className="flex items-center gap-2 text-cyan-400 font-bold uppercase text-[11px]">
          <Info className="w-4 h-4" /> HOW TO READ THIS GRAPH
        </div>
        <ul className="text-slate-300 font-sans text-xs space-y-1 list-disc list-inside">
          <li><strong>Nodes</strong> represent people, devices, IP addresses, sessions, files, or security events.</li>
          <li><strong>Lines</strong> represent evidence-based relationships discovered across data silos.</li>
          <li>Select any node or line to see exact matching factors and why ECHO connected them.</li>
        </ul>
      </div>

      {/* 3. ECHO KEY FINDING Banner */}
      <div className="p-4 bg-cyan-950/40 border border-cyan-500/60 rounded-xl space-y-1 text-xs">
        <div className="flex items-center gap-2 font-mono font-bold text-cyan-400 text-xs uppercase">
          <Sparkles className="w-4 h-4" /> ECHO KEY FINDING
        </div>
        <p className="text-slate-200 font-sans leading-relaxed">
          Out of <strong>2,214 analysed events</strong>, ECHO identified a smaller correlated cluster involving a shared user account (<strong className="text-purple-300 font-mono">employee_07</strong>), host (<strong className="text-blue-300 font-mono">WORKSTATION-07</strong>), and network indicators (<strong className="text-red-300 font-mono">185.220.101.45</strong> & <strong className="text-emerald-300 font-mono">198.51.100.77</strong>).
        </p>
        <div className="text-slate-400 text-[11px] font-sans pt-1">
          <strong className="text-slate-300 font-mono uppercase">WHY IT MATTERS:</strong> These events were initially scattered across different telemetry sources but share verified evidence-based relationships.
        </div>
      </div>

      {/* 4. CLEAN GRAPH LEGEND (NO EMOJIS) */}
      <div className="p-3 bg-dark-900 border border-dark-700 rounded-xl flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
        <span className="text-slate-500 font-bold uppercase text-[10px]">GRAPH LEGEND:</span>
        <div className="flex flex-wrap items-center gap-4">
          {legendItems.map((lg, i) => {
            const Icon = lg.icon;
            return (
              <div key={i} className="flex items-center gap-1.5 text-slate-300 text-[11px]">
                <Icon className={`w-3.5 h-3.5 ${lg.color}`} />
                <span>{lg.label}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 5. Main Canvas & WHY ARE THESE CONNECTED Panel Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Interactive SVG Canvas Area (2 cols) */}
        <div className="lg:col-span-2 bg-dark-900 border border-cyan-900/60 rounded-xl p-6 relative min-h-[440px] flex flex-col justify-between overflow-hidden shadow-2xl">
          {/* Canvas Background Grid */}
          <div className="absolute inset-0 bg-[radial-gradient(#164e63_1px,transparent_1px)] [background-size:20px_20px] opacity-30 pointer-events-none" />

          <div className="relative z-10 flex justify-between items-center text-xs font-mono text-slate-400">
            <span className="flex items-center gap-1.5 text-cyan-400 font-bold">
              <Network className="w-4 h-4" /> Correlated Investigation Path
            </span>
            <span className="text-slate-400">Select Nodes or Edges for Details</span>
          </div>

          {/* Canvas Display */}
          <div className="relative z-10 my-8 flex-1 min-h-[320px]">
            {/* SVG Connecting Lines Overlay */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible">
              <defs>
                <linearGradient id="edgeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.9" />
                </linearGradient>
              </defs>

              {CORRELATION_LINKS.map((link) => {
                const srcNode = DEMO_GRAPH_NODES.find((n) => n.id === link.sourceNodeId);
                const tgtNode = DEMO_GRAPH_NODES.find((n) => n.id === link.targetNodeId);
                if (!srcNode || !tgtNode) return null;

                const isSelected = selectedLink?.id === link.id;

                return (
                  <g key={link.id} className="pointer-events-auto cursor-pointer" onClick={() => setSelectedLink(link)}>
                    <line
                      x1={`${srcNode.x}%`}
                      y1={`${srcNode.y}%`}
                      x2={`${tgtNode.x}%`}
                      y2={`${tgtNode.y}%`}
                      stroke={isSelected ? '#22d3ee' : 'url(#edgeGrad)'}
                      strokeWidth={isSelected ? '4' : '2'}
                      strokeDasharray={isSelected ? 'none' : '6 3'}
                      className="transition-all hover:stroke-cyan-300"
                    />
                  </g>
                );
              })}
            </svg>

            {/* Descriptive 3-Line Nodes */}
            {DEMO_GRAPH_NODES.map((node) => {
              const isSelected = selectedNode?.id === node.id;
              const isHighlighted = isHighlightPathOnly ? node.highlighted : true;

              return (
                <div
                  key={node.id}
                  onClick={() => setSelectedNode(node)}
                  style={{ left: `${node.x}%`, top: `${node.y}%` }}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-300 z-20 group ${
                    !isHighlighted ? 'opacity-30' : 'opacity-100'
                  }`}
                >
                  {/* 3-Line Descriptive Node Card */}
                  <div className={`p-2.5 rounded-xl border font-mono text-xs font-bold shadow-xl flex flex-col space-y-1 min-w-[130px] transition-transform ${
                    isSelected
                      ? 'bg-cyan-950 text-cyan-200 border-cyan-400 scale-105 ring-2 ring-cyan-400/50'
                      : 'bg-dark-800 text-slate-300 border-dark-600 hover:border-cyan-500 hover:scale-105'
                  }`}>
                    {/* Line 1: Type Header */}
                    <div className="flex items-center justify-between border-b border-dark-700/80 pb-1">
                      <span className="text-[9px] uppercase tracking-wider text-cyan-400 font-extrabold">
                        {node.type.toUpperCase()}
                      </span>
                      <div className={`w-2 h-2 rounded-full ${
                        node.type === 'ip' ? 'bg-red-400' :
                        node.type === 'identity' ? 'bg-purple-400' :
                        node.type === 'endpoint' ? 'bg-blue-400' :
                        node.type === 'session' ? 'bg-cyan-400' :
                        'bg-amber-400'
                      }`} />
                    </div>

                    {/* Line 2: Entity Value */}
                    <div className="text-xs font-extrabold text-slate-100 truncate">
                      {node.label}
                    </div>

                    {/* Line 3: Short Role */}
                    <div className="text-[10px] text-slate-400 font-sans truncate font-normal">
                      {node.details}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Edge Selector Buttons Bar */}
          <div className="relative z-10 pt-3 border-t border-dark-800 flex flex-wrap items-center gap-1.5 text-xs font-mono">
            <span className="text-slate-500 mr-1">EXPLICIT EDGES:</span>
            {CORRELATION_LINKS.map((link, idx) => (
              <button
                key={link.id}
                onClick={() => setSelectedLink(link)}
                className={`px-2 py-0.5 rounded border transition-colors cursor-pointer text-[11px] ${
                  selectedLink?.id === link.id
                    ? 'bg-cyan-950 text-cyan-300 border-cyan-500 font-bold'
                    : 'bg-dark-800 text-slate-400 border-dark-700 hover:text-slate-200'
                }`}
              >
                EDGE #{idx + 1} ({link.sourceLabel} → {link.targetLabel})
              </button>
            ))}
          </div>
        </div>

        {/* WHY ARE THESE CONNECTED? Panel (1 col) */}
        <div className="space-y-6">
          {selectedLink && (
            <div className="bg-dark-900 border border-cyan-500/80 rounded-xl p-5 space-y-4 shadow-xl relative overflow-hidden">
              <div className="flex items-center justify-between border-b border-cyan-900/60 pb-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                  <h3 className="text-xs font-bold text-slate-100 uppercase tracking-wider font-mono">
                    WHY ARE THESE CONNECTED?
                  </h3>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 font-bold">
                  {selectedLink.confidenceScore}% {selectedLink.confidenceLevel}
                </span>
              </div>

              {/* Connected Pair Banner */}
              <div className="p-3 bg-dark-800 border border-dark-700 rounded-lg flex items-center justify-between text-xs font-mono">
                <span className="text-purple-300 font-bold">{selectedLink.sourceLabel}</span>
                <span className="text-cyan-400 font-bold">──────►</span>
                <span className="text-blue-300 font-bold">{selectedLink.targetLabel}</span>
              </div>

              {/* Exact Matching Evidence Checklist */}
              <div className="space-y-2">
                <span className="text-[10px] font-mono font-bold text-slate-500 uppercase block">
                  MATCHING EVIDENCE FACTORS
                </span>

                {selectedLink.matchingFactors.map((factor, idx) => (
                  <div key={idx} className="p-2.5 bg-dark-800 border border-dark-700 rounded-lg text-xs space-y-0.5">
                    <div className="font-bold text-cyan-300 flex items-center gap-1.5 font-mono">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>{factor.fieldName}: {factor.value}</span>
                    </div>
                    <div className="text-[11px] text-slate-400 font-sans pl-5 leading-tight">
                      {factor.description}
                    </div>
                  </div>
                ))}
              </div>

              {/* Timeline Relationship */}
              <div className="p-3 bg-cyan-950/40 border border-cyan-900/60 rounded-lg text-xs text-slate-300 font-sans space-y-1">
                <div className="font-bold text-cyan-400 flex items-center gap-1 font-mono text-[10px]">
                  <HelpCircle className="w-3.5 h-3.5" /> TIMELINE RELATIONSHIP
                </div>
                <p className="leading-relaxed">
                  {selectedLink.humanExplanation}
                </p>
              </div>
            </div>
          )}

          {/* Node Attribute Inspection fallback */}
          {selectedNode && (
            <div className="bg-dark-900 border border-dark-700 rounded-xl p-4 font-mono text-xs space-y-2">
              <div className="flex justify-between items-center text-slate-400 border-b border-dark-800 pb-2">
                <span className="font-bold text-slate-200">INSPECTED NODE: {selectedNode.label}</span>
                <span className="text-[10px] uppercase text-cyan-400 font-bold">{selectedNode.type}</span>
              </div>
              <div>
                <span className="text-slate-500 text-[10px] block">ROLE SUMMARY</span>
                <p className="text-[11px] text-slate-300 font-sans leading-snug mt-0.5">
                  {selectedNode.details}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
