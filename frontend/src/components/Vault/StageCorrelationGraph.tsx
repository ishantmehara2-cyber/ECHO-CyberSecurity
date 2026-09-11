import { useState } from 'react';
import {
  Network,
  Sparkles,
  ArrowRight,
  HelpCircle,
  CheckCircle2
} from 'lucide-react';
import { CorrelationPipelineStatus } from '../Correlation/CorrelationPipelineStatus';
import { GraphNode } from '../../types/vault';
import { CorrelationLink } from '../../types/correlation';
import { CORRELATION_LINKS } from '../../data/correlationEngine';
import { DEMO_GRAPH_NODES } from '../../data/vaultDemoData';

interface StageCorrelationGraphProps {
  onCompleteStage: () => void;
  customNodes?: GraphNode[];
  customLinks?: CorrelationLink[];
}

export const StageCorrelationGraph = ({
  onCompleteStage,
  customNodes,
  customLinks
}: StageCorrelationGraphProps) => {
  const nodes = (customNodes && customNodes.length > 0) ? customNodes : DEMO_GRAPH_NODES;
  const links = (customLinks && customLinks.length > 0) ? customLinks : CORRELATION_LINKS;

  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(nodes[0] || null);
  const [selectedEdgeId, setSelectedEdgeId] = useState<string>(links[0]?.id || 'link-1');

  const selectedLink = links.find((l) => l.id === selectedEdgeId) || links[0];

  return (
    <div className="space-y-6 font-sans">
      {/* Real Pipeline Execution Visibility */}
      <CorrelationPipelineStatus />

      {/* Main Graph Component */}
      <div className="bg-dark-800 border border-dark-700 rounded-xl p-6 space-y-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-dark-700 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-cyan-400 uppercase">
                STAGE 3 // EVIDENCE CORRELATION GRAPH
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 bg-cyan-950 text-cyan-400 border border-cyan-800 rounded font-bold">
                CLICK EDGES OR NODES TO INSPECT REASONING
              </span>
            </div>
            <h2 className="text-xl font-bold text-slate-100 mt-1 font-mono">
              ECHO Discovered Evidence Cluster
            </h2>
          </div>

          <button
            onClick={onCompleteStage}
            className="flex items-center gap-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold rounded-lg text-xs font-mono transition-all shadow-[0_0_15px_rgba(6,182,212,0.3)] cursor-pointer self-start md:self-auto uppercase tracking-wider"
          >
            <span>PROCEED TO TIMELINE RECONSTRUCTION</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Main Interactive Graph & Node Detail Panel Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Interactive Graph Canvas Area (2 cols) */}
          <div className="lg:col-span-2 bg-dark-900 border border-cyan-900/60 rounded-xl p-6 relative min-h-[420px] flex flex-col justify-between overflow-hidden shadow-2xl">
            {/* Canvas Background Grid */}
            <div className="absolute inset-0 bg-[radial-gradient(#164e63_1px,transparent_1px)] [background-size:20px_20px] opacity-30 pointer-events-none" />

            {/* Canvas Top Controls */}
            <div className="relative z-10 flex justify-between items-center text-xs font-mono text-slate-400">
              <span className="flex items-center gap-1.5 text-cyan-400 font-bold">
                <Network className="w-4 h-4" /> Multi-Source Evidence Cluster ({nodes.length} Nodes • {links.length} Correlated Edges)
              </span>
              <span className="text-emerald-400 font-bold bg-emerald-950/80 px-2.5 py-0.5 rounded border border-emerald-800">
                CLUSTER CONFIDENCE: 94%
              </span>
            </div>

            {/* Interactive Graph Nodes Display */}
            <div className="relative z-10 my-8 flex-1 min-h-[300px]">
              {/* SVG Connecting Lines Overlay */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible">
                <defs>
                  <linearGradient id="lineGradStage" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.8" />
                  </linearGradient>
                </defs>

                {links.map((link) => {
                  const srcNode = nodes.find((n) => n.id === link.sourceNodeId) || nodes[0];
                  const tgtNode = nodes.find((n) => n.id === link.targetNodeId) || nodes[nodes.length - 1];
                  if (!srcNode || !tgtNode) return null;

                  const isSelected = selectedEdgeId === link.id;

                  return (
                    <g key={link.id} className="pointer-events-auto cursor-pointer" onClick={() => setSelectedEdgeId(link.id)}>
                      <line
                        x1={`${srcNode.x || 20}%`}
                        y1={`${srcNode.y || 30}%`}
                        x2={`${tgtNode.x || 80}%`}
                        y2={`${tgtNode.y || 70}%`}
                        stroke={isSelected ? '#22d3ee' : 'url(#lineGradStage)'}
                        strokeWidth={isSelected ? '4' : '2'}
                        strokeDasharray={isSelected ? 'none' : '6 3'}
                        className="animate-pulse cursor-pointer hover:stroke-cyan-300"
                      />
                    </g>
                  );
                })}
              </svg>

              {/* Nodes */}
              {nodes.map((node, idx) => {
                const isSelected = selectedNode?.id === node.id;
                const nodeX = node.x || (15 + (idx * 25) % 70);
                const nodeY = node.y || (20 + (idx * 20) % 60);

                return (
                  <div
                    key={node.id || idx}
                    onClick={() => setSelectedNode(node)}
                    style={{ left: `${nodeX}%`, top: `${nodeY}%` }}
                    className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-300 z-20 group"
                  >
                    <div className={`px-3 py-1.5 rounded-lg border font-mono text-xs font-bold shadow-xl flex items-center gap-1.5 transition-transform ${
                      isSelected
                        ? 'bg-cyan-950 text-cyan-200 border-cyan-400 scale-110 ring-2 ring-cyan-400/50'
                        : 'bg-dark-800 text-slate-300 border-dark-600 hover:border-cyan-500 hover:scale-105'
                    }`}>
                      <div className={`w-2 h-2 rounded-full ${
                        node.type === 'ip' ? 'bg-red-400' :
                        node.type === 'identity' ? 'bg-purple-400' :
                        node.type === 'endpoint' ? 'bg-blue-400' :
                        node.type === 'session' ? 'bg-cyan-400' :
                        'bg-amber-400'
                      }`} />
                      <span>{node.label}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Edge Selector Buttons Bar */}
            <div className="relative z-10 pt-3 border-t border-dark-800 flex flex-wrap items-center gap-1.5 text-xs font-mono">
              <span className="text-slate-500 mr-1">EXPLICIT EDGES:</span>
              {links.map((link, idx) => (
                <button
                  key={link.id}
                  onClick={() => setSelectedEdgeId(link.id)}
                  className={`px-2 py-0.5 rounded border transition-colors cursor-pointer text-[11px] ${
                    selectedEdgeId === link.id
                      ? 'bg-cyan-950 text-cyan-300 border-cyan-500 font-bold'
                      : 'bg-dark-800 text-slate-400 border-dark-700 hover:text-slate-200'
                  }`}
                >
                  EDGE #{idx + 1} ({link.sourceLabel} → {link.targetLabel})
                </button>
              ))}
            </div>
          </div>

          {/* WHY CONNECTED? Explanation Box (1 col) */}
          <div className="space-y-6">
            {selectedLink && (
              <div className="bg-dark-900 border border-cyan-500/80 rounded-xl p-5 space-y-4 shadow-xl relative overflow-hidden">
                <div className="flex items-center justify-between border-b border-cyan-900/60 pb-3">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-cyan-400" />
                    <h3 className="text-xs font-bold text-slate-100 uppercase tracking-wider font-mono">
                      WHY CONNECTED? (EXPLAINABLE REASONING)
                    </h3>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 font-bold">
                    {selectedLink.confidenceScore}% {selectedLink.confidenceLevel}
                  </span>
                </div>

                <div className="p-3 bg-dark-800 border border-dark-700 rounded-lg flex items-center justify-between text-xs font-mono">
                  <span className="text-purple-300 font-bold">{selectedLink.sourceLabel}</span>
                  <span className="text-cyan-400 font-bold">──────►</span>
                  <span className="text-blue-300 font-bold">{selectedLink.targetLabel}</span>
                </div>

                <div className="space-y-2">
                  <span className="text-[10px] font-mono font-bold text-slate-500 uppercase block">
                    EXACT MATCHING FACTORS IDENTIFIED
                  </span>

                  {selectedLink.matchingFactors && selectedLink.matchingFactors.map((factor, idx) => (
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

                <div className="p-3 bg-cyan-950/40 border border-cyan-900/60 rounded-lg text-xs text-slate-300 font-sans space-y-1">
                  <div className="font-bold text-cyan-400 flex items-center gap-1 font-mono text-[10px]">
                    <HelpCircle className="w-3.5 h-3.5" /> EXPLAINABLE NARRATIVE
                  </div>
                  <p className="leading-relaxed">
                    {selectedLink.humanExplanation}
                  </p>
                </div>
              </div>
            )}

            {/* Node Info Panel */}
            {selectedNode && (
              <div className="bg-dark-900 border border-dark-700 rounded-xl p-4 font-mono text-xs space-y-2">
                <div className="flex justify-between items-center text-slate-400">
                  <span className="font-bold text-slate-200">INSPECTED NODE: {selectedNode.label}</span>
                  <span className="text-[10px] uppercase text-cyan-400 font-bold">{selectedNode.type}</span>
                </div>
                <p className="text-[11px] text-slate-400 font-sans leading-snug">
                  {selectedNode.details || 'Security entity extracted from telemetry.'}
                </p>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};
