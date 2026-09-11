import { useState } from 'react';
import {
  Network,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { GraphNode } from '../../types/vault';
import { DEMO_GRAPH_NODES, DEMO_GRAPH_EDGES } from '../../data/vaultDemoData';

interface StageCorrelationGraphProps {
  onCompleteStage: () => void;
}

export const StageCorrelationGraph = ({ onCompleteStage }: StageCorrelationGraphProps) => {
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(DEMO_GRAPH_NODES[0]);

  return (
    <div className="bg-dark-800 border border-dark-700 rounded-xl p-6 space-y-6 shadow-xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-dark-700 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-cyan-400 uppercase">
              STAGE 3 // EVIDENCE CORRELATION GRAPH
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 bg-cyan-950 text-cyan-400 border border-cyan-800 rounded font-bold">
              CLICK NODES TO INSPECT
            </span>
          </div>
          <h2 className="text-xl font-bold text-slate-100 mt-1">
            ECHO Discovered Evidence Cluster
          </h2>
        </div>

        <button
          onClick={onCompleteStage}
          className="flex items-center gap-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold rounded-lg text-xs font-mono transition-all shadow-[0_0_15px_rgba(6,182,212,0.3)] cursor-pointer self-start md:self-auto"
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
              <Network className="w-4 h-4" /> Multi-Source Evidence Cluster (8 Nodes)
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
                <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.8" />
                </linearGradient>
              </defs>
              {DEMO_GRAPH_EDGES.map((edge) => {
                const fromNode = DEMO_GRAPH_NODES.find((n) => n.id === edge.from);
                const toNode = DEMO_GRAPH_NODES.find((n) => n.id === edge.to);
                if (!fromNode || !toNode) return null;

                return (
                  <g key={edge.id}>
                    <line
                      x1={`${fromNode.x}%`}
                      y1={`${fromNode.y}%`}
                      x2={`${toNode.x}%`}
                      y2={`${toNode.y}%`}
                      stroke="url(#lineGrad)"
                      strokeWidth="2"
                      strokeDasharray="6 3"
                      className="animate-pulse"
                    />
                  </g>
                );
              })}
            </svg>

            {/* Nodes */}
            {DEMO_GRAPH_NODES.map((node) => {
              const isSelected = selectedNode?.id === node.id;

              return (
                <div
                  key={node.id}
                  onClick={() => setSelectedNode(node)}
                  style={{ left: `${node.x}%`, top: `${node.y}%` }}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-300 z-20 group`}
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

          <div className="relative z-10 text-[11px] font-mono text-slate-500 flex items-center justify-between border-t border-dark-800 pt-3">
            <span>Visual Evidence Graph: Click any node to view correlation attributes.</span>
            <span className="text-cyan-400">8 High-Confidence Nodes</span>
          </div>
        </div>

        {/* Selected Node Details & WHY ECHO CONNECTED THIS Panel (1 col) */}
        <div className="space-y-6">
          {/* Node Info Panel */}
          {selectedNode && (
            <div className="bg-dark-900 border border-cyan-900/60 rounded-xl p-5 space-y-3 font-mono text-xs shadow-xl">
              <div className="flex justify-between items-start border-b border-dark-800 pb-2">
                <div>
                  <span className="text-[10px] text-slate-500 block uppercase font-bold">SELECTED NODE DETAILS</span>
                  <span className="text-sm font-bold text-cyan-400">{selectedNode.label}</span>
                </div>
                <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800 font-bold uppercase text-[10px]">
                  {selectedNode.type}
                </span>
              </div>

              <div className="space-y-2 text-[11px]">
                <div>
                  <span className="text-slate-500 block text-[10px]">FIRST SEEN / LAST SEEN</span>
                  <span className="text-slate-200">{selectedNode.firstSeen} — {selectedNode.lastSeen}</span>
                </div>

                <div>
                  <span className="text-slate-500 block text-[10px]">FOUND IN EVIDENCE SOURCES</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {selectedNode.sources.map((s, i) => (
                      <span key={i} className="px-1.5 py-0.5 rounded bg-dark-800 text-slate-300 border border-dark-700">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="text-slate-500 block text-[10px]">CORRELATION CONFIDENCE</span>
                  <span className="text-emerald-400 font-bold">{selectedNode.confidence} (94%)</span>
                </div>

                <div>
                  <span className="text-slate-500 block text-[10px]">ANALYSIS NOTE</span>
                  <p className="text-slate-400 font-sans leading-snug mt-0.5">
                    {selectedNode.details}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* SIGNATURE PANEL: WHY ECHO CONNECTED THIS */}
          <div className="bg-dark-900 border border-cyan-500/50 rounded-xl p-5 space-y-4 shadow-xl relative overflow-hidden">
            <div className="flex items-center justify-between border-b border-cyan-900/60 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <h3 className="text-xs font-bold text-slate-100 uppercase tracking-wider">
                  WHY ECHO CONNECTED THIS
                </h3>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 font-bold">
                HIGH CONFIDENCE
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="bg-dark-800 p-3 rounded border border-dark-700">
                <div className="text-[10px] font-mono text-slate-500 uppercase font-bold mb-0.5">SHARED ENTITY</div>
                <div className="font-mono font-bold text-cyan-400">WORKSTATION-07</div>
                <div className="text-[11px] text-slate-400 mt-0.5">Found in 3 separate evidence sources (Identity, Endpoint, Network)</div>
              </div>

              <div className="bg-dark-800 p-3 rounded border border-dark-700">
                <div className="text-[10px] font-mono text-slate-500 uppercase font-bold mb-0.5">TEMPORAL RELATIONSHIP</div>
                <div className="font-mono font-bold text-amber-400">8 MINUTES TOTAL DURATION</div>
                <div className="text-[11px] text-slate-400 mt-0.5">All 8 events occurred sequentially between 10:28:43 and 10:36:19</div>
              </div>

              <div className="bg-dark-800 p-3 rounded border border-dark-700">
                <div className="text-[10px] font-mono text-slate-500 uppercase font-bold mb-0.5">BEHAVIOURAL PATTERN</div>
                <div className="font-mono font-bold text-purple-400 text-[11px]">
                  AUTH → EXECUTION → COLLECTION → ARCHIVE → TRANSFER
                </div>
              </div>

              <div className="pt-2 border-t border-dark-800 flex justify-between items-center text-xs font-mono">
                <span className="text-slate-400">CORRELATION CONFIDENCE:</span>
                <span className="text-emerald-400 font-extrabold text-sm">94%</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
