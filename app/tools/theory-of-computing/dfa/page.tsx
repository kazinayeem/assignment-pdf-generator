"use client";

import { useState, useMemo, useCallback, useEffect, useRef } from "react";
import {
  State, Transition, Automaton, SimulationStep,
  addState, toggleStart, toggleAccept, removeState,
  addTransition, updateStatePos,
  simulateDFA, DFA_EXAMPLES, createBlankAutomaton,
} from "../components/types";
import {
  Plus, Play, StepForward, RotateCcw, Trash2,
  Flag, CircleDot, ArrowRight, CheckCircle2, XCircle,
  Beaker, BookOpen, Table2, Network,
} from "lucide-react";

const R = 30;
const COLORS = {
  state: "#6366f1", stateFill: "rgba(99,102,241,0.15)",
  accept: "#10b981", acceptFill: "rgba(16,185,129,0.15)",
  active: "#f59e0b", activeFill: "rgba(245,158,11,0.3)",
  edge: "#818cf8", edgeActive: "#f59e0b", edgeTraversed: "#34d399",
  selected: "#06b6d4",
  glass: "bg-white/5 backdrop-blur-xl border border-white/10",
};

function transitionPath(
  a: { x: number; y: number }, b: { x: number; y: number },
  selfLoop: boolean, idx: number, total: number,
): string {
  if (selfLoop) {
    const lo = 50 + idx * 10;
    const lx = a.x, ly = a.y - R - lo;
    return `M ${a.x + R * 0.866} ${a.y - R * 0.5} Q ${lx + 40} ${ly} ${a.x - R * 0.866} ${a.y - R * 0.5}`;
  }
  const dx = b.x - a.x, dy = b.y - a.y;
  const ang = Math.atan2(dy, dx);
  const sx = a.x + R * Math.cos(ang), sy = a.y + R * Math.sin(ang);
  const ex = b.x - R * Math.cos(ang), ey = b.y - R * Math.sin(ang);
  const mx = (sx + ex) / 2, my = (sy + ey) / 2;
  const px = -(ey - sy), py = ex - sx;
  const len = Math.sqrt(px * px + py * py) || 1;
  const off = 25 + ((idx - (total - 1) / 2)) * 15;
  const cx = mx + (px / len) * off, cy = my + (py / len) * off;
  return `M ${sx} ${sy} Q ${cx} ${cy} ${ex} ${ey}`;
}

function midLabel(a: { x: number; y: number }, b: { x: number; y: number }, selfLoop: boolean, idx: number, total: number) {
  if (selfLoop) {
    const lo = 50 + idx * 10;
    return { x: a.x, y: a.y - R - lo - 14 };
  }
  const dx = b.x - a.x, dy = b.y - a.y;
  const ang = Math.atan2(dy, dx);
  const sx = a.x + R * Math.cos(ang), sy = a.y + R * Math.sin(ang);
  const ex = b.x - R * Math.cos(ang), ey = b.y - R * Math.sin(ang);
  const mx = (sx + ex) / 2, my = (sy + ey) / 2;
  const px = -(ey - sy), py = ex - sx;
  const len = Math.sqrt(px * px + py * py) || 1;
  const off = 25 + ((idx - (total - 1) / 2)) * 15;
  const cx = mx + (px / len) * off, cy = my + (py / len) * off;
  return { x: cx, y: cy - 10 };
}

const interviewQ = [
  { q: "What is the difference between DFA and NFA?", a: "DFA has exactly one transition per input symbol from each state; NFA can have 0, 1, or multiple. NFA allows ε-transitions. Every NFA can be converted to an equivalent DFA (exponential blowup possible)." },
  { q: "What languages cannot be recognized by a DFA?", a: "Non-regular languages like aⁿbⁿ (equal counts) or palindromes require memory beyond finite states. The Pumping Lemma is used to prove a language is not regular." },
  { q: "How do you minimize a DFA?", a: "Merge indistinguishable states using the table-filling algorithm. Two states are distinguishable if one is accepting and the other is not, or if for some symbol they transition to distinguishable states. Repeat until no more merges." },
];

const applications = [
  "Lexical analysis in compilers (token recognition)",
  "Vending machines and protocol verification",
  "Text search (regex engines, grep)",
  "Digital circuit design (sequential logic)",
  "Network intrusion detection (pattern matching)",
];

export default function DFAPage() {
  const [automaton, setAutomaton] = useState<Automaton>(createBlankAutomaton());
  const [selected, setSelected] = useState<string | null>(null);
  const [transMode, setTransMode] = useState(false);
  const [transFrom, setTransFrom] = useState<string | null>(null);
  const [dragging, setDragging] = useState<string | null>(null);
  const [simInput, setSimInput] = useState("");
  const [simResult, setSimResult] = useState<{ accepted: boolean; steps: SimulationStep[]; path: string[] } | null>(null);
  const [simStep, setSimStep] = useState(-1);
  const [simRunning, setSimRunning] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const groupedTransitions = useMemo(() => {
    const g: Record<string, Transition[]> = {};
    automaton.transitions.forEach(t => {
      const k = `${t.from}-${t.to}`;
      if (!g[k]) g[k] = [];
      g[k].push(t);
    });
    return g;
  }, [automaton.transitions]);

  const stateMap = useMemo(() => {
    const m: Record<string, State> = {};
    automaton.states.forEach(s => { m[s.id] = s; });
    return m;
  }, [automaton.states]);

  const simActiveEdges = useMemo(() => {
    if (!simResult || simStep <= 0) return [];
    return simResult.steps.slice(0, simStep).map(s => `${s.fromState}-${s.toState}-${s.symbol}`);
  }, [simResult, simStep]);

  const simCurrentEdge = useMemo(() => {
    if (!simResult || simStep <= 0 || simStep > simResult.steps.length) return null;
    const s = simResult.steps[simStep - 1];
    return s ? `${s.fromState}-${s.toState}-${s.symbol}` : null;
  }, [simResult, simStep]);

  useEffect(() => {
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, []);

  const stopSim = useCallback(() => {
    setSimRunning(false);
    if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
  }, []);

  const handleAddState = useCallback(() => {
    setAutomaton(prev => addState(prev));
  }, []);

  const handleToggleStart = useCallback(() => {
    if (!selected) return;
    setAutomaton(prev => toggleStart(prev, selected));
  }, [selected]);

  const handleToggleAccept = useCallback(() => {
    if (!selected) return;
    setAutomaton(prev => toggleAccept(prev, selected));
  }, [selected]);

  const handleRemoveState = useCallback(() => {
    if (!selected) return;
    setAutomaton(prev => removeState(prev, selected));
    setSelected(null);
  }, [selected]);

  const handleSvgMouseDown = useCallback((e: React.MouseEvent, id: string) => {
    if (transMode) {
      if (!transFrom) { setTransFrom(id); return; }
      const sym = prompt("Enter transition symbol:")?.trim();
      if (sym) setAutomaton(prev => addTransition(prev, transFrom, id, sym));
      setTransFrom(null);
      return;
    }
    setSelected(id);
    setDragging(id);
  }, [transMode, transFrom]);

  const handleSvgMouseMove = useCallback((e: React.MouseEvent) => {
    if (!dragging || !svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const vb = svgRef.current.getAttribute("viewBox")?.split(" ").map(Number) || [0, 0, 600, 450];
    const sx = (e.clientX - rect.left) / rect.width * vb[2];
    const sy = (e.clientY - rect.top) / rect.height * vb[3];
    setAutomaton(prev => updateStatePos(prev, dragging, Math.max(R, Math.min(vb[2] - R, sx)), Math.max(R, Math.min(vb[3] - R, sy))));
  }, [dragging]);

  const handleSvgMouseUp = useCallback(() => {
    setDragging(null);
  }, []);

  const handleAddTransMode = useCallback(() => {
    setTransMode(!transMode);
    setTransFrom(null);
  }, [transMode]);

  const handleExample = useCallback((key: string) => {
    if (key in DFA_EXAMPLES) setAutomaton(DFA_EXAMPLES[key as keyof typeof DFA_EXAMPLES]);
  }, []);

  const handleClear = useCallback(() => {
    setAutomaton(createBlankAutomaton());
    setSelected(null);
    setTransMode(false);
    setTransFrom(null);
    stopSim();
    setSimResult(null);
    setSimStep(-1);
  }, [stopSim]);

  const handleRun = useCallback(() => {
    if (!simInput) return;
    stopSim();
    const result = simulateDFA(automaton, simInput);
    setSimResult(result);
    if (result.steps.length === 0) {
      setSimStep(result.accepted ? 0 : -1);
      return;
    }
    setSimStep(0);
    setSimRunning(true);
    let i = 0;
    timerRef.current = setInterval(() => {
      i++;
      setSimStep(i);
      if (i >= result.steps.length) {
        if (timerRef.current) clearInterval(timerRef.current);
        timerRef.current = null;
        setSimRunning(false);
      }
    }, 600);
  }, [simInput, automaton, stopSim]);

  const handleStep = useCallback(() => {
    if (!simResult) {
      if (!simInput) return;
      const result = simulateDFA(automaton, simInput);
      setSimResult(result);
      setSimStep(1);
      return;
    }
    stopSim();
    setSimStep(prev => Math.min(prev + 1, simResult.steps.length));
  }, [simInput, simResult, automaton, stopSim]);

  const handleReset = useCallback(() => {
    stopSim();
    setSimResult(null);
    setSimStep(-1);
  }, [stopSim]);

  const isFinished = simResult && simStep >= simResult.steps.length;
  const currentStateId = simResult && simStep >= 0
    ? (simStep >= simResult.steps.length
      ? simResult.path[simResult.path.length - 1]
      : simResult.path[simStep])
    : null;

  const transitionTable = useMemo(() => {
    const states = automaton.states;
    const alpha = automaton.alphabet;
    const table: Record<string, Record<string, string>> = {};
    states.forEach(s => { table[s.id] = {}; alpha.forEach(a => { table[s.id][a] = "—"; }); });
    automaton.transitions.forEach(t => {
      if (table[t.from]) table[t.from][t.symbol] = t.to;
    });
    return { states, alpha, table };
  }, [automaton]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-950 to-slate-950 p-3 md:p-6 text-white">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex items-center gap-3 mb-2">
          <Network className="w-7 h-7 text-indigo-400" />
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-300 to-purple-300 bg-clip-text text-transparent">DFA Simulator</h1>
            <p className="text-sm text-white/40">Deterministic Finite Automaton — Interactive Visualization</p>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

          {/* SVG Graph */}
          <div className={`xl:col-span-2 ${COLORS.glass} rounded-2xl shadow-2xl p-1 overflow-hidden ${transMode ? "ring-2 ring-amber-500/50" : ""}`}>
            <svg
              ref={svgRef}
              viewBox="0 0 600 450"
              className="w-full h-full min-h-[320px] cursor-default select-none"
              onMouseMove={handleSvgMouseMove}
              onMouseUp={handleSvgMouseUp}
              onMouseLeave={handleSvgMouseUp}
            >
              <defs>
                <marker id="arr" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
                  <path d="M0 0 L10 5 L0 10 Z" fill={COLORS.edge} />
                </marker>
                <marker id="arr-trav" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
                  <path d="M0 0 L10 5 L0 10 Z" fill={COLORS.edgeTraversed} />
                </marker>
                <marker id="arr-act" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
                  <path d="M0 0 L10 5 L0 10 Z" fill={COLORS.edgeActive} />
                </marker>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="4" result="blur" />
                  <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                </filter>
                <filter id="glow-heavy">
                  <feGaussianBlur stdDeviation="8" result="blur" />
                  <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                </filter>
              </defs>

              {/* Grid dots */}
              {Array.from({ length: 13 }).map((_, i) =>
                Array.from({ length: 10 }).map((_, j) => (
                  <circle key={`dot-${i}-${j}`} cx={50 + i * 45} cy={50 + j * 45} r={1} fill="rgba(255,255,255,0.06)" />
                ))
              )}

              {/* Transitions */}
              {Object.entries(groupedTransitions).map(([key, trans]) => {
                const [f, t] = key.split("-");
                const fa = stateMap[f], ta = stateMap[t];
                if (!fa || !ta) return null;
                const self = f === t;
                const total = trans.length;
                const isActive = trans.some(tr => simActiveEdges.includes(`${tr.from}-${tr.to}-${tr.symbol}`));
                const isCurrent = trans.some(tr => simCurrentEdge === `${tr.from}-${tr.to}-${tr.symbol}`);

                return (
                  <g key={key}>
                    {trans.map((tr, i) => {
                      const path = transitionPath(fa, ta, self, i, total);
                      const label = midLabel(fa, ta, self, i, total);
                      return (
                        <g key={tr.symbol}>
                          <path
                            d={path}
                            fill="none"
                            stroke={isCurrent ? COLORS.edgeActive : isActive ? COLORS.edgeTraversed : COLORS.edge}
                            strokeWidth={isCurrent ? 3 : isActive ? 2.5 : 2}
                            strokeOpacity={isCurrent ? 1 : isActive ? 0.9 : 0.6}
                            markerEnd={isCurrent ? "url(#arr-act)" : isActive ? "url(#arr-trav)" : "url(#arr)"}
                            style={{ transition: "stroke 0.3s, stroke-width 0.3s" }}
                          />
                          <text
                            x={label.x} y={label.y}
                            textAnchor="middle" dominantBaseline="middle"
                            fill={isCurrent ? COLORS.edgeActive : isActive ? COLORS.edgeTraversed : "#c4b5fd"}
                            fontSize={12} fontWeight={500}
                            style={{ transition: "fill 0.3s" }}
                          >
                            {tr.symbol}
                          </text>
                        </g>
                      );
                    })}
                  </g>
                );
              })}

              {/* States */}
              {automaton.states.map(s => {
                const isSel = selected === s.id;
                const isAct = currentStateId === s.id;
                const isFrom = transMode && transFrom === s.id;
                const fill = isAct ? COLORS.activeFill : isSel ? "rgba(6,182,212,0.2)" : s.isAccept ? COLORS.acceptFill : COLORS.stateFill;
                const stroke = isAct ? COLORS.active : isFrom ? "#fbbf24" : isSel ? COLORS.selected : s.isAccept ? COLORS.accept : COLORS.state;
                const sw = isAct ? 3.5 : isSel || isFrom ? 3 : s.isAccept ? 2.5 : 2;

                return (
                  <g key={s.id}>
                    {/* Start arrow */}
                    {s.isStart && (
                      <g>
                        <line x1={s.x - R - 35} y1={s.y} x2={s.x - R - 5} y2={s.y} stroke={COLORS.edge} strokeWidth={2} markerEnd="url(#arr)" />
                        <text x={s.x - R - 40} y={s.y - 8} textAnchor="end" fill="#a5b4fc" fontSize={10}>start</text>
                      </g>
                    )}
                    {/* Accept double circle */}
                    {s.isAccept && (
                      <circle cx={s.x} cy={s.y} r={R + 5} fill="none" stroke={isAct ? COLORS.active : COLORS.accept} strokeWidth={sw * 0.7} opacity={0.5} />
                    )}
                    {/* Main circle */}
                    <circle
                      cx={s.x} cy={s.y} r={R} fill={fill}
                      stroke={isAct ? COLORS.active : stroke} strokeWidth={sw}
                      style={{ transition: "fill 0.3s, stroke 0.3s, stroke-width 0.3s" }}
                      filter={isAct ? "url(#glow-heavy)" : undefined}
                      onMouseDown={(e) => handleSvgMouseDown(e, s.id)}
                      className="cursor-pointer"
                    />
                    {/* Label */}
                    <text
                      x={s.x} y={s.y + 1}
                      textAnchor="middle" dominantBaseline="central"
                      fill="white" fontSize={13} fontWeight={600}
                      pointerEvents="none"
                    >
                      {s.label}
                    </text>
                  </g>
                );
              })}

              {/* Hint text */}
              {automaton.states.length === 0 && (
                <text x={300} y={225} textAnchor="middle" fill="rgba(255,255,255,0.2)" fontSize={16}>
                  Click &quot;Add State&quot; to begin building your DFA
                </text>
              )}
            </svg>
            {transMode && (
              <div className="px-4 pb-2 text-xs text-amber-400/80 flex items-center gap-2">
                <CircleDot className="w-3 h-3" />
                {transFrom ? "Click destination state" : "Click source state"}
                <button onClick={() => { setTransMode(false); setTransFrom(null); }} className="ml-auto text-white/40 hover:text-white/80 text-xs">Cancel</button>
              </div>
            )}
          </div>

          {/* Controls Panel */}
          <div className={`${COLORS.glass} rounded-2xl shadow-2xl p-5 space-y-5 overflow-y-auto max-h-[600px] xl:max-h-none`}>
            {/* State Controls */}
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-indigo-300 mb-3 flex items-center gap-2"><CircleDot className="w-3.5 h-3.5" />States</h3>
              <div className="flex flex-wrap gap-2">
                <button onClick={handleAddState} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 border border-indigo-500/30 text-sm transition">
                  <Plus className="w-3.5 h-3.5" /> Add State
                </button>
                <button onClick={handleToggleStart} disabled={!selected} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 text-sm disabled:opacity-30 disabled:cursor-not-allowed transition">
                  <Flag className="w-3.5 h-3.5" /> Start
                </button>
                <button onClick={handleToggleAccept} disabled={!selected} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 text-sm disabled:opacity-30 disabled:cursor-not-allowed transition">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Accept
                </button>
                <button onClick={handleRemoveState} disabled={!selected} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/30 text-sm disabled:opacity-30 disabled:cursor-not-allowed transition">
                  <Trash2 className="w-3.5 h-3.5" /> Delete
                </button>
              </div>
              {selected && (
                <p className="text-xs text-white/40 mt-2">Selected: <span className="text-cyan-300 font-mono">{stateMap[selected]?.label}</span></p>
              )}
            </div>

            {/* Transition Controls */}
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-indigo-300 mb-3 flex items-center gap-2"><ArrowRight className="w-3.5 h-3.5" />Transitions</h3>
              <div className="flex flex-wrap gap-2">
                <button onClick={handleAddTransMode} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm border transition ${
                  transMode
                    ? "bg-amber-500/30 text-amber-300 border-amber-500/50 ring-1 ring-amber-500/50"
                    : "bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 border-indigo-500/30"
                }`}>
                  <ArrowRight className="w-3.5 h-3.5" /> {transMode ? "Adding..." : "Add Transition"}
                </button>
              </div>
              <p className="text-xs text-white/30 mt-2">Click source then destination, enter symbol</p>
            </div>

            {/* Examples */}
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-indigo-300 mb-3 flex items-center gap-2"><Beaker className="w-3.5 h-3.5" />Examples</h3>
              <div className="flex flex-wrap gap-2">
                {Object.keys(DFA_EXAMPLES).map(key => (
                  <button key={key} onClick={() => handleExample(key)}
                    className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-sm text-white/70 hover:text-white transition">
                    {key}
                  </button>
                ))}
              </div>
            </div>

            {/* Simulation */}
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-indigo-300 mb-3 flex items-center gap-2"><Play className="w-3.5 h-3.5" />Simulation</h3>
              <div className="space-y-3">
                <input
                  value={simInput}
                  onChange={e => setSimInput(e.target.value)}
                  placeholder="Enter input string..."
                  className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/30 text-sm focus:outline-none focus:border-indigo-500/50 font-mono"
                />
                <div className="flex flex-wrap gap-2">
                  <button onClick={handleRun} disabled={simRunning || !simInput} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-500/30 hover:bg-indigo-500/40 text-indigo-300 border border-indigo-500/40 text-sm disabled:opacity-30 transition">
                    <Play className="w-3.5 h-3.5" /> Run
                  </button>
                  <button onClick={handleStep} disabled={simRunning || !simInput} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-500/30 hover:bg-purple-500/40 text-purple-300 border border-purple-500/40 text-sm disabled:opacity-30 transition">
                    <StepForward className="w-3.5 h-3.5" /> Step
                  </button>
                  <button onClick={handleReset} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 border border-white/10 text-sm transition">
                    <RotateCcw className="w-3.5 h-3.5" /> Reset
                  </button>
                </div>

                {/* Result */}
                {isFinished && simResult && (
                  <div className={`p-4 rounded-xl ${simResult.accepted ? "bg-emerald-500/10 border border-emerald-500/30" : "bg-red-500/10 border border-red-500/30"}`}>
                    <div className="flex items-center gap-2 mb-2">
                      {simResult.accepted
                        ? <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                        : <XCircle className="w-6 h-6 text-red-400" />}
                      <span className={`text-lg font-bold ${simResult.accepted ? "text-emerald-300" : "text-red-300"}`}>
                        {simResult.accepted ? "ACCEPTED" : "REJECTED"}
                      </span>
                    </div>
                    <p className="text-xs text-white/50">Path: {simResult.path.map(id => stateMap[id]?.label || id).join(" → ")}</p>
                    {!simResult.accepted && simResult.steps.length > 0 && (
                      <p className="text-xs text-red-400/70 mt-1">
                        Stuck at state {stateMap[simResult.steps[simResult.steps.length - 1]?.fromState]?.label} on symbol &quot;{simResult.steps[simResult.steps.length - 1]?.symbol}&quot;
                      </p>
                    )}
                  </div>
                )}

                {/* Step counter */}
                {simResult && simStep >= 0 && (
                  <p className="text-xs text-white/40">
                    Step {Math.min(simStep, simResult.steps.length)} / {simResult.steps.length}
                  </p>
                )}
              </div>
            </div>

            {/* Clear */}
            <button onClick={handleClear} className="w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 text-sm transition">
              <Trash2 className="w-3.5 h-3.5" /> Clear All
            </button>
          </div>
        </div>

        {/* Theory Section */}
        <div className={`${COLORS.glass} rounded-2xl shadow-2xl p-6 md:p-8 space-y-8`}>
          <h2 className="text-xl font-bold flex items-center gap-2 text-indigo-200">
            <BookOpen className="w-5 h-5" /> Theory & Reference
          </h2>

          {/* What is DFA */}
          <div>
            <h3 className="text-sm font-semibold text-indigo-300 mb-2">What is a DFA?</h3>
            <p className="text-sm text-white/60 leading-relaxed">
              A <strong className="text-white/80">Deterministic Finite Automaton (DFA)</strong> is a 5-tuple (Q, Σ, δ, q₀, F) where:
            </p>
            <ul className="mt-2 space-y-1 text-sm text-white/50 font-mono">
              <li>Q — finite set of states</li>
              <li>Σ — finite input alphabet</li>
              <li>δ: Q × Σ → Q — transition function (deterministic)</li>
              <li>q₀ ∈ Q — start state</li>
              <li>F ⊆ Q — set of accept (final) states</li>
            </ul>
            <p className="text-sm text-white/50 mt-2 leading-relaxed">
              A DFA reads the input string left to right, one symbol at a time. At each step, it follows exactly one transition
              based on current state and input symbol. If after consuming all input the machine is in an accept state, the string is accepted.
            </p>
          </div>

          {/* Transition Table */}
          {automaton.states.length > 0 && automaton.alphabet.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-indigo-300 mb-3 flex items-center gap-2"><Table2 className="w-4 h-4" />Transition Table</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr>
                      <th className="px-3 py-2 text-left text-indigo-300 border border-white/10 bg-white/5">State</th>
                      {transitionTable.alpha.map(a => (
                        <th key={a} className="px-3 py-2 text-indigo-300 border border-white/10 bg-white/5 text-center">{a}</th>
                      ))}
                      <th className="px-3 py-2 text-indigo-300 border border-white/10 bg-white/5 text-center text-xs">Start?</th>
                      <th className="px-3 py-2 text-indigo-300 border border-white/10 bg-white/5 text-center text-xs">Accept?</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transitionTable.states.map(s => (
                      <tr key={s.id} className="hover:bg-white/5 transition">
                        <td className="px-3 py-2 border border-white/10 font-mono text-white/70">{s.label}</td>
                        {transitionTable.alpha.map(a => (
                          <td key={a} className="px-3 py-2 border border-white/10 text-center font-mono text-white/50">{transitionTable.table[s.id]?.[a] || "—"}</td>
                        ))}
                        <td className="px-3 py-2 border border-white/10 text-center">{s.isStart ? "✓" : "—"}</td>
                        <td className="px-3 py-2 border border-white/10 text-center">{s.isAccept ? "✓" : "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Interview Q&A */}
          <div>
            <h3 className="text-sm font-semibold text-indigo-300 mb-3">Common Interview Questions</h3>
            <div className="space-y-4">
              {interviewQ.map((item, i) => (
                <div key={i} className="p-4 rounded-xl bg-white/[0.03] border border-white/5">
                  <p className="text-sm font-medium text-indigo-200 mb-1">Q{i + 1}: {item.q}</p>
                  <p className="text-sm text-white/50">{item.a}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Applications */}
          <div>
            <h3 className="text-sm font-semibold text-indigo-300 mb-3">Real-World Applications</h3>
            <ul className="grid md:grid-cols-2 gap-2">
              {applications.map((app, i) => (
                <li key={i} className="flex items-center gap-2 text-sm text-white/50">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500/60 flex-shrink-0" />
                  {app}
                </li>
              ))}
            </ul>
          </div>
        </div>

      </div>
    </div>
  );
}
