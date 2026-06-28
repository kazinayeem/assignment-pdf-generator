"use client";

import { useState, useRef, useCallback } from "react";
import {
  Plus, ArrowRight, Trash2, Play, RotateCcw, Sigma,
  Info, BookOpen, Lightbulb, Zap, ChevronRight, Home,
  MousePointer, CheckCircle2, XCircle, GitBranch,
} from "lucide-react";
import {
  Transition, Automaton,
  addState, toggleStart, toggleAccept, removeState,
  addTransition, removeTransition, updateStatePos,
  renameState, simulateNFA, epsilonClosure,
  createBlankAutomaton,
} from "../components/types";

const STATE_RADIUS = 28;
const BRANCH_COLORS = ["#6366f1", "#ec4899", "#f59e0b", "#10b981", "#06b6d4", "#8b5cf6", "#f97316", "#14b8a6"];

const NFA_EXAMPLES: Record<string, Automaton> = {
  "Ends with 01": {
    states: [
      { id: "q0", label: "q0", x: 150, y: 200, isStart: true, isAccept: false },
      { id: "q1", label: "q1", x: 350, y: 120, isStart: false, isAccept: false },
      { id: "q2", label: "q2", x: 550, y: 200, isStart: false, isAccept: true },
    ],
    transitions: [
      { from: "q0", to: "q0", symbol: "0" },
      { from: "q0", to: "q0", symbol: "1" },
      { from: "q0", to: "q1", symbol: "0" },
      { from: "q1", to: "q2", symbol: "1" },
    ],
    alphabet: ["0", "1"],
  },
  "a*b* (ε-NFA)": {
    states: [
      { id: "q0", label: "q0", x: 120, y: 200, isStart: true, isAccept: false },
      { id: "q1", label: "q1", x: 320, y: 200, isStart: false, isAccept: false },
      { id: "q2", label: "q2", x: 520, y: 200, isStart: false, isAccept: true },
    ],
    transitions: [
      { from: "q0", to: "q1", symbol: "ε" },
      { from: "q1", to: "q1", symbol: "a" },
      { from: "q1", to: "q2", symbol: "ε" },
      { from: "q2", to: "q2", symbol: "b" },
    ],
    alphabet: ["a", "b", "ε"],
  },
  "0*1* (ε-NFA)": {
    states: [
      { id: "q0", label: "q0", x: 100, y: 200, isStart: true, isAccept: false },
      { id: "q1", label: "q1", x: 300, y: 130, isStart: false, isAccept: false },
      { id: "q2", label: "q2", x: 300, y: 270, isStart: false, isAccept: false },
      { id: "q3", label: "q3", x: 520, y: 200, isStart: false, isAccept: true },
    ],
    transitions: [
      { from: "q0", to: "q1", symbol: "ε" },
      { from: "q0", to: "q2", symbol: "ε" },
      { from: "q1", to: "q1", symbol: "0" },
      { from: "q1", to: "q3", symbol: "ε" },
      { from: "q2", to: "q2", symbol: "1" },
      { from: "q2", to: "q3", symbol: "ε" },
    ],
    alphabet: ["0", "1", "ε"],
  },
  "(a|b)*abb": {
    states: [
      { id: "q0", label: "q0", x: 100, y: 225, isStart: true, isAccept: false },
      { id: "q1", label: "q1", x: 260, y: 120, isStart: false, isAccept: false },
      { id: "q2", label: "q2", x: 420, y: 120, isStart: false, isAccept: false },
      { id: "q3", label: "q3", x: 580, y: 225, isStart: false, isAccept: true },
    ],
    transitions: [
      { from: "q0", to: "q0", symbol: "a" },
      { from: "q0", to: "q0", symbol: "b" },
      { from: "q0", to: "q1", symbol: "a" },
      { from: "q1", to: "q2", symbol: "b" },
      { from: "q2", to: "q3", symbol: "b" },
    ],
    alphabet: ["a", "b"],
  },
};

function getArrowPoints(x1: number, y1: number, x2: number, y2: number, r: number) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.sqrt(dx * dx + dy * dy) || 1;
  const nx = dx / len;
  const ny = dy / len;
  const sx = x1 + nx * r;
  const sy = y1 + ny * r;
  const ex = x2 - nx * r;
  const ey = y2 - ny * r;
  const mx = (sx + ex) / 2;
  const my = (sy + ey) / 2;
  const px = -ny * 20;
  const py = nx * 20;
  return { sx, sy, ex, ey, mx, my, cx: mx + px, cy: my + py };
}

function getSelfLoopPoints(x: number, y: number, r: number, offset: number) {
  const loopR = 36 + offset * 8;
  return {
    sx: x + r * 0.7,
    sy: y - r * 0.7,
    ex: x - r * 0.7,
    ey: y - r * 0.7,
    mx: x,
    my: y - r - loopR,
    cx: x,
    cy: y - r - loopR * 0.6,
  };
}

function transitionKey(t: Transition) {
  return `${t.from}->${t.to}@{${t.symbol}}`;
}


export default function NFAPage() {
  const [automaton, setAutomaton] = useState<Automaton>({ ...NFA_EXAMPLES["Ends with 01"] });
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const [mode, setMode] = useState<"select" | "transition" | "epsilon">("select");
  const [transSource, setTransSource] = useState<string | null>(null);
  const [transSymbol, setTransSymbol] = useState("");
  const [showSymbolInput, setShowSymbolInput] = useState(false);
  const [inputString, setInputString] = useState("");
  const [simResult, setSimResult] = useState<{
    accepted: boolean;
    steps: { activeStates: string[]; symbol: string; step: number }[];
  } | null>(null);
  const [epsilonClosureResult, setEpsilonClosureResult] = useState<string[] | null>(null);
  const [dragging, setDragging] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [showTheory, setShowTheory] = useState(false);
  const [simStepIndex, setSimStepIndex] = useState(0);
  const [simRunning, setSimRunning] = useState(false);
  const [, setRenameValue] = useState("");
  const svgRef = useRef<SVGSVGElement>(null);

  const updateAuto = useCallback((fn: (a: Automaton) => Automaton) => {
    setAutomaton((prev) => fn(prev));
  }, []);

  const handleSvgMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (mode !== "select") return;
      const svg = svgRef.current;
      if (!svg) return;
      const rect = svg.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const clicked = automaton.states.find(
        (s) => Math.sqrt((s.x - x) ** 2 + (s.y - y) ** 2) < STATE_RADIUS
      );
      if (clicked) {
        setSelectedState(clicked.id);
        setDragging(clicked.id);
        setDragOffset({ x: x - clicked.x, y: y - clicked.y });
      } else {
        setSelectedState(null);
      }
    },
    [automaton.states, mode]
  );

  const handleSvgMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!dragging) return;
      const svg = svgRef.current;
      if (!svg) return;
      const rect = svg.getBoundingClientRect();
      const x = e.clientX - rect.left - dragOffset.x;
      const y = e.clientY - rect.top - dragOffset.y;
      updateAuto((a) => updateStatePos(a, dragging, Math.round(x), Math.round(y)));
    },
    [dragging, dragOffset, updateAuto]
  );

  const handleSvgMouseUp = useCallback(() => {
    setDragging(null);
  }, []);

  const handleStateClick = useCallback(
    (id: string) => {
      if (dragging) return;
      if (mode === "transition" || mode === "epsilon") {
        if (!transSource) {
          setTransSource(id);
        } else if (transSource !== id) {
          const sym = mode === "epsilon" ? "ε" : transSymbol || "a";
          if (sym.trim()) {
            updateAuto((a) => addTransition(a, transSource, id, sym));
          }
          setTransSource(null);
          setTransSymbol("");
          setShowSymbolInput(false);
        } else {
          if (mode === "epsilon") {
            updateAuto((a) => addTransition(a, id, id, "ε"));
            setTransSource(null);
          } else {
            setShowSymbolInput(true);
          }
        }
      } else {
        setSelectedState(id);
      }
    },
    [mode, transSource, transSymbol, dragging, updateAuto]
  );

  const handleSvgDblClick = useCallback(
    (e: React.MouseEvent) => {
      if (mode !== "select") return;
      const svg = svgRef.current;
      if (!svg) return;
      const rect = svg.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const clicked = automaton.states.find(
        (s) => Math.sqrt((s.x - x) ** 2 + (s.y - y) ** 2) < STATE_RADIUS
      );
      if (clicked) {
        setRenameValue(clicked.label);
        const newLabel = prompt("Rename state:", clicked.label);
        if (newLabel && newLabel.trim()) {
          updateAuto((a) => renameState(a, clicked.id, newLabel.trim()));
        }
      } else {
        updateAuto((a) => addState(a));
      }
    },
    [automaton.states, mode, updateAuto]
  );

  const handleTransitionClick = useCallback(
    (idx: number) => {
      if (mode !== "select") return;
      if (window.confirm("Remove this transition?")) {
        updateAuto((a) => removeTransition(a, idx));
      }
    },
    [mode, updateAuto]
  );

  const commitSelfTransition = useCallback(() => {
    if (transSource && transSymbol.trim()) {
      updateAuto((a) => addTransition(a, transSource, transSource, transSymbol.trim()));
      setTransSource(null);
      setTransSymbol("");
      setShowSymbolInput(false);
    }
  }, [transSource, transSymbol, updateAuto]);

  const runSimulation = useCallback(() => {
    if (!inputString.trim()) return;
    const result = simulateNFA(automaton, inputString.trim());
    setSimResult(result);
    setSimStepIndex(0);
    setSimRunning(true);
  }, [automaton, inputString]);

  const computeEpsilonClosure = useCallback(() => {
    if (!selectedState) {
      const all = automaton.states.map((s) => s.id);
      const closure = epsilonClosure(automaton, all);
      setEpsilonClosureResult(closure);
    } else {
      const closure = epsilonClosure(automaton, [selectedState]);
      setEpsilonClosureResult(closure);
    }
  }, [automaton, selectedState]);

  const loadExample = useCallback((name: string) => {
    const ex = NFA_EXAMPLES[name];
    if (ex) {
      setAutomaton({ ...ex, transitions: [...ex.transitions], states: ex.states.map((s) => ({ ...s })) });
      setSimResult(null);
      setEpsilonClosureResult(null);
      setSelectedState(null);
      setSimRunning(false);
      setInputString("");
    }
  }, []);

  const stateMap = new Map(automaton.states.map((s) => [s.id, s]));
  const activeStateIds: Set<string> = new Set();
  if (simResult && simRunning) {
    const step = simResult.steps[simStepIndex];
    if (step) step.activeStates.forEach((id) => activeStateIds.add(id));
  }

  const startStates = automaton.states.filter((s) => s.isStart).map((s) => s.id);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50 px-3 sm:px-6 lg:px-8 py-6">
      <div className="max-w-7xl mx-auto space-y-5">
        <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-2">
          <a href="/tools/theory-of-computing" className="hover:text-gray-700 transition-colors flex items-center gap-1">
            <Home className="w-3 h-3" /> Theory of Comp.
          </a>
          <ChevronRight className="w-3 h-3" />
          <span className="text-indigo-600 font-semibold">NFA Simulator</span>
        </div>

        <div className="bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-800 rounded-2xl p-5 sm:p-7 text-white shadow-xl">
          <div className="flex items-start justify-between flex-wrap gap-3">
            <div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight">NFA Simulator</h1>
              <p className="text-indigo-200 text-sm mt-1 max-w-xl">
                Build and simulate Nondeterministic Finite Automata with ε-transitions, parallel state traversal, and interactive visualization.
              </p>
            </div>
            <div className="flex gap-2">
              {(["select", "transition", "epsilon"] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => { setMode(m); setTransSource(null); setShowSymbolInput(false); }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                    mode === m
                      ? "bg-white/20 text-white shadow-lg backdrop-blur-sm"
                      : "bg-white/5 text-indigo-200 hover:bg-white/10 border border-white/10"
                  }`}
                >
                  {m === "select" ? <MousePointer className="w-3.5 h-3.5" /> : m === "transition" ? <ArrowRight className="w-3.5 h-3.5" /> : <Sigma className="w-3.5 h-3.5" />}
                  {m === "select" ? "Select" : m === "transition" ? "Symbol" : "ε-Trans"}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
          <div className="xl:col-span-2 space-y-5">
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-slate-200/60 shadow-lg overflow-hidden">
              <div className="p-3 border-b border-slate-100 flex flex-wrap items-center gap-2">
                <button onClick={() => updateAuto((a) => addState(a))}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition flex items-center gap-1.5 border border-indigo-200">
                  <Plus className="w-3.5 h-3.5" /> Add State
                </button>
                <button onClick={() => { if (selectedState) updateAuto((a) => toggleStart(a, selectedState)); }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 border ${selectedState ? "bg-emerald-50 text-emerald-600 border-emerald-200 hover:bg-emerald-100" : "bg-gray-50 text-gray-400 border-gray-200 cursor-not-allowed"}`}
                  disabled={!selectedState}>
                  <Play className="w-3.5 h-3.5" /> Start
                </button>
                <button onClick={() => { if (selectedState) updateAuto((a) => toggleAccept(a, selectedState)); }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 border ${selectedState ? "bg-amber-50 text-amber-600 border-amber-200 hover:bg-amber-100" : "bg-gray-50 text-gray-400 border-gray-200 cursor-not-allowed"}`}
                  disabled={!selectedState}>
                  <CheckCircle2 className="w-3.5 h-3.5" /> Accept
                </button>
                <button onClick={() => { if (selectedState) updateAuto((a) => removeState(a, selectedState)); setSelectedState(null); }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 border ${selectedState ? "bg-red-50 text-red-600 border-red-200 hover:bg-red-100" : "bg-gray-50 text-gray-400 border-gray-200 cursor-not-allowed"}`}
                  disabled={!selectedState}>
                  <Trash2 className="w-3.5 h-3.5" /> Remove
                </button>
                <div className="h-5 w-px bg-slate-200 mx-1" />
                <select onChange={(e) => loadExample(e.target.value)}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold bg-purple-50 text-purple-600 border border-purple-200 outline-none cursor-pointer">
                  <option value="">Examples</option>
                  {Object.keys(NFA_EXAMPLES).map((name) => (
                    <option key={name} value={name}>{name}</option>
                  ))}
                </select>
                <button onClick={() => { setAutomaton(createBlankAutomaton()); setSimResult(null); setEpsilonClosureResult(null); setSelectedState(null); setSimRunning(false); }}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold bg-gray-50 text-gray-500 hover:bg-gray-100 transition flex items-center gap-1.5 border border-gray-200">
                  <RotateCcw className="w-3.5 h-3.5" /> Clear
                </button>
                {mode === "transition" && transSource && (
                  <span className="text-xs text-indigo-600 font-semibold ml-auto">
                    Source: {stateMap.get(transSource)?.label} — click target or self
                  </span>
                )}
                {mode === "epsilon" && transSource && (
                  <span className="text-xs text-purple-600 font-semibold ml-auto">
                    ε-source: {stateMap.get(transSource)?.label} — click target
                  </span>
                )}
              </div>

              <svg
                ref={svgRef}
                className="w-full bg-gradient-to-br from-slate-50/50 to-indigo-50/30 cursor-grab active:cursor-grabbing"
                style={{ minHeight: 420 }}
                onMouseDown={handleSvgMouseDown}
                onMouseMove={handleSvgMouseMove}
                onMouseUp={handleSvgMouseUp}
                onMouseLeave={handleSvgMouseUp}
                onDoubleClick={handleSvgDblClick}
              >
                <defs>
                  <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">
                    <polygon points="0 0, 10 3.5, 0 7" fill="#475569" />
                  </marker>
                  <marker id="arrowhead-epsilon" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">
                    <polygon points="0 0, 10 3.5, 0 7" fill="#9333ea" />
                  </marker>
                  <marker id="arrowhead-active" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">
                    <polygon points="0 0, 10 3.5, 0 7" fill="#6366f1" />
                  </marker>
                  <filter id="glow">
                    <feGaussianBlur stdDeviation="6" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                  <filter id="stateShadow">
                    <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#6366f1" floodOpacity="0.15" />
                  </filter>
                </defs>

                {automaton.transitions.map((t, idx) => {
                  const from = stateMap.get(t.from);
                  const to = stateMap.get(t.to);
                  if (!from || !to) return null;
                  const isEpsilon = t.symbol === "ε";
                  const isActive = activeStateIds.has(t.from) && activeStateIds.has(t.to);
                  const isSelf = t.from === t.to;
                  const sameTrans = automaton.transitions.filter(
                    (x, i) => i < idx && x.from === t.from && x.to === t.to && x.symbol === t.symbol
                  );
                  const offset = sameTrans.length;

                  let sx: number, sy: number, ex: number, ey: number, mx: number, my: number;
                  let pathD: string;

                  if (isSelf) {
                    const lp = getSelfLoopPoints(from.x, from.y, STATE_RADIUS, offset);
                    sx = lp.sx; sy = lp.sy; ex = lp.ex; ey = lp.ey; mx = lp.mx; my = lp.my;
                    pathD = `M ${sx} ${sy} Q ${lp.cx} ${lp.cy} ${ex} ${ey}`;
                  } else {
                    const ap = getArrowPoints(from.x, from.y, to.x, to.y, STATE_RADIUS);
                    const perpOffset = (offset + 1) * 15 * (idx % 2 === 0 ? 1 : -1);
                    const nx = -(to.y - from.y);
                    const ny = to.x - from.x;
                    const nl = Math.sqrt(nx * nx + ny * ny) || 1;
                    const cpx = (ap.sx + ap.ex) / 2 + (nx / nl) * perpOffset;
                    const cpy = (ap.sy + ap.ey) / 2 + (ny / nl) * perpOffset;
                    sx = ap.sx; sy = ap.sy; ex = ap.ex; ey = ap.ey;
                    mx = cpx; my = cpy;
                    pathD = `M ${sx} ${sy} Q ${cpx} ${cpy} ${ex} ${ey}`;
                  }

                  const markerEnd = isEpsilon ? "url(#arrowhead-epsilon)" : isActive ? "url(#arrowhead-active)" : "url(#arrowhead)";

                  return (
                    <g key={transitionKey(t) + idx} onClick={() => handleTransitionClick(idx)} style={{ cursor: "pointer" }}>
                      <path d={pathD} fill="none" strokeWidth="8" stroke="transparent" onClick={(e) => { e.stopPropagation(); handleTransitionClick(idx); }} />
                      <path d={pathD} fill="none"
                        stroke={isEpsilon ? "#9333ea" : isActive ? "#6366f1" : "#475569"}
                        strokeWidth={isEpsilon ? 2 : 2.5}
                        strokeDasharray={isEpsilon ? "6,4" : "none"}
                        markerEnd={markerEnd}
                        className="transition-colors duration-300"
                      />
                      <g>
                        <rect x={mx - 14} y={my - 10} width={28} height={20} rx={6} fill={isEpsilon ? "#f3e8ff" : "white"} stroke={isEpsilon ? "#d8b4fe" : "#e2e8f0"} strokeWidth={1} />
                        <text x={mx} y={my + 4} textAnchor="middle" fontSize={11} fontWeight={700}
                          fill={isEpsilon ? "#9333ea" : "#334155"}
                          fontFamily="monospace">
                          {t.symbol}
                        </text>
                      </g>
                    </g>
                  );
                })}

                {automaton.states.map((s) => {
                  const isActive = activeStateIds.has(s.id);
                  const isSel = s.id === selectedState;
                  const isTransSource = s.id === transSource;

                  return (
                    <g key={s.id} onClick={(e) => { e.stopPropagation(); handleStateClick(s.id); }}
                      className="transition-transform duration-75" style={{ cursor: dragging === s.id ? "grabbing" : "pointer" }}>
                      {s.isStart && (
                        <>
                          <line x1={s.x - STATE_RADIUS - 38} y1={s.y} x2={s.x - STATE_RADIUS - 4} y2={s.y}
                            stroke="#475569" strokeWidth={2.5} markerEnd="url(#arrowhead)" />
                          <text x={s.x - STATE_RADIUS - 42} y={s.y + 4} textAnchor="end" fontSize={9} fontWeight={700} fill="#64748b" fontFamily="monospace">start</text>
                        </>
                      )}
                      {isActive && (
                        <circle cx={s.x} cy={s.y} r={STATE_RADIUS + 8} fill="none" stroke="#6366f1" strokeWidth={3} opacity={0.5} filter="url(#glow)" />
                      )}
                      {isTransSource && (mode === "transition" || mode === "epsilon") && (
                        <circle cx={s.x} cy={s.y} r={STATE_RADIUS + 5} fill="none" stroke={mode === "epsilon" ? "#9333ea" : "#6366f1"} strokeWidth={2} strokeDasharray="4,3" />
                      )}
                      <circle cx={s.x} cy={s.y} r={STATE_RADIUS}
                        fill={isSel ? "#eef2ff" : "white"}
                        stroke={isActive ? "#6366f1" : isSel ? "#6366f1" : "#cbd5e1"}
                        strokeWidth={isSel || isActive ? 2.5 : 2}
                        filter="url(#stateShadow)"
                        className="transition-colors duration-200"
                      />
                      {s.isAccept && (
                        <circle cx={s.x} cy={s.y} r={STATE_RADIUS - 4} fill="none" stroke={isActive ? "#6366f1" : "#94a3b8"} strokeWidth={2} />
                      )}
                      <text x={s.x} y={s.y + 4} textAnchor="middle" fontSize={13} fontWeight={700}
                        fill={isActive ? "#6366f1" : "#334155"} fontFamily="monospace">
                        {s.label}
                      </text>
                      {s.isAccept && (
                        <text x={s.x + STATE_RADIUS + 6} y={s.y - 6} fontSize={8} fontWeight={700} fill="#f59e0b" fontFamily="monospace">(accept)</text>
                      )}
                    </g>
                  );
                })}

                {showSymbolInput && transSource && (
                  <foreignObject x={180} y={10} width={240} height={70}>
                    <div className="flex items-center gap-2 bg-white rounded-xl shadow-xl border border-indigo-200 p-3">
                      <input
                        value={transSymbol}
                        onChange={(e) => setTransSymbol(e.target.value)}
                        onKeyDown={(e) => { if (e.key === "Enter") { if (transSource) { updateAuto((a) => addTransition(a, transSource, transSource, transSymbol.trim() || "a")); } setTransSource(null); setTransSymbol(""); setShowSymbolInput(false); } if (e.key === "Escape") { setTransSource(null); setTransSymbol(""); setShowSymbolInput(false); } }}
                        placeholder="Symbol (e.g., a, 0)"
                        className="flex-1 border-2 border-indigo-200 rounded-lg px-3 py-1.5 text-xs font-mono font-bold outline-none focus:border-indigo-500"
                        autoFocus
                      />
                      <button onClick={commitSelfTransition}
                        className="px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-xs font-bold hover:bg-indigo-700 transition">
                        Add
                      </button>
                    </div>
                  </foreignObject>
                )}
              </svg>
            </div>

            <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-slate-200/60 shadow-lg p-4 sm:p-5">
              <h2 className="text-sm font-black text-gray-800 mb-3 flex items-center gap-2">
                <Play className="w-4 h-4 text-indigo-600" /> Simulation
              </h2>
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex-1 min-w-[160px]">
                  <input
                    value={inputString}
                    onChange={(e) => setInputString(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter") runSimulation(); }}
                    placeholder="Enter input string (e.g., 0110)"
                    className="w-full border-2 border-slate-200 rounded-xl px-4 py-2.5 text-sm font-mono font-bold outline-none focus:border-indigo-400 transition"
                  />
                </div>
                <button onClick={runSimulation}
                  className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 transition flex items-center gap-2 shadow-md shadow-indigo-200">
                  <Play className="w-4 h-4" /> Run
                </button>
                <button onClick={() => { setSimResult(null); setSimRunning(false); }}
                  className="px-4 py-2.5 bg-slate-100 text-slate-500 rounded-xl text-sm font-bold hover:bg-slate-200 transition flex items-center gap-1.5">
                  <RotateCcw className="w-3.5 h-3.5" /> Reset
                </button>
              </div>

              {simResult && (
                <div className="mt-4 space-y-3">
                  <div className="flex flex-wrap items-center gap-2">
                    {simResult.steps.map((step, i) => (
                      <button key={i} onClick={() => setSimStepIndex(i)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition border ${
                          simStepIndex === i
                            ? "bg-indigo-600 text-white border-indigo-600 shadow-md"
                            : "bg-white text-slate-600 border-slate-200 hover:border-indigo-300"
                        }`}>
                        {step.step === 0 ? "ε-cl" : step.symbol}
                      </button>
                    ))}
                  </div>

                  <div className="p-4 rounded-xl border"
                    style={{
                      backgroundColor: simResult.accepted ? "#f0fdf4" : "#fef2f2",
                      borderColor: simResult.accepted ? "#86efac" : "#fecaca",
                    }}>
                    <div className="flex items-center gap-3 flex-wrap">
                      <div className="flex items-center gap-1.5">
                        {simResult.accepted
                          ? <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                          : <XCircle className="w-5 h-5 text-red-600" />}
                        <span className={`font-black text-lg ${simResult.accepted ? "text-emerald-700" : "text-red-700"}`}>
                          {simResult.accepted ? "ACCEPTED" : "REJECTED"}
                        </span>
                      </div>
                      <span className="text-xs text-slate-500 font-mono">
                        Steps: {simResult.steps.length - 1} | Final active states: {simResult.steps[simResult.steps.length - 1]?.activeStates.join(", ") || "none"}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {simResult.steps.map((step, i) => (
                      <div key={i} className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                        simStepIndex === i
                          ? "border-indigo-400 bg-indigo-50/50 shadow-md"
                          : "border-slate-100 bg-white"
                      }`}>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
                            {step.step === 0 ? "ε-Closure (start)" : `Step ${step.step}: "${step.symbol}"`}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {step.activeStates.length === 0 ? (
                            <span className="text-xs text-red-500 font-semibold">No active states (dead)</span>
                          ) : (
                            step.activeStates.map((sid, si) => (
                              <span key={sid}
                                className="px-2.5 py-1 rounded-lg text-xs font-bold font-mono text-white"
                                style={{ backgroundColor: BRANCH_COLORS[si % BRANCH_COLORS.length] }}>
                                {stateMap.get(sid)?.label || sid}
                              </span>
                            ))
                          )}
                        </div>
                        {step.step > 0 && step.activeStates.length > 0 && (
                          <div className="mt-1.5 text-[10px] text-slate-400 font-mono">
                            ε-closure: {epsilonClosure(automaton, step.activeStates).map((id) => stateMap.get(id)?.label || id).join(", ")}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-5">
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-slate-200/60 shadow-lg p-4 sm:p-5">
              <h2 className="text-sm font-black text-gray-800 mb-3 flex items-center gap-2">
                <Sigma className="w-4 h-4 text-purple-600" /> ε-Closure
              </h2>
              <p className="text-[11px] text-slate-500 mb-3 leading-relaxed">
                ε-closure of a state is the set of states reachable via zero or more ε-transitions.
                {selectedState ? ` Selected: ${stateMap.get(selectedState)?.label}` : " Click a state first, or compute for all."}
              </p>
              <button onClick={computeEpsilonClosure}
                className="w-full px-4 py-2.5 bg-purple-600 text-white rounded-xl text-sm font-bold hover:bg-purple-700 transition flex items-center justify-center gap-2 shadow-md shadow-purple-200">
                <Sigma className="w-4 h-4" /> Compute ε-Closure
              </button>
              {epsilonClosureResult && (
                <div className="mt-3 p-3 bg-purple-50 rounded-xl border border-purple-200">
                  <p className="text-[10px] font-black text-purple-500 uppercase tracking-wider mb-1.5">
                    {selectedState ? `ε-Closure of ${stateMap.get(selectedState)?.label}` : "ε-Closure of all states"}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {epsilonClosureResult.length === 0 ? (
                      <span className="text-xs text-slate-400">∅ (empty)</span>
                    ) : (
                      epsilonClosureResult.map((id) => (
                        <span key={id} className="px-2 py-1 bg-white rounded-lg text-xs font-bold font-mono text-purple-700 border border-purple-200">
                          {stateMap.get(id)?.label || id}
                        </span>
                      ))
                    )}
                  </div>
                  {selectedState && (
                    <p className="text-[10px] text-purple-400 mt-1.5">
                      ε*({stateMap.get(selectedState)?.label}) = {"{"}{epsilonClosureResult.map((id) => stateMap.get(id)?.label || id).join(", ")}{"}"}
                    </p>
                  )}
                </div>
              )}
            </div>

            <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-slate-200/60 shadow-lg p-4 sm:p-5">
              <h2 className="text-sm font-black text-gray-800 mb-3 flex items-center gap-2">
                <GitBranch className="w-4 h-4 text-indigo-600" /> Automaton Info
              </h2>
              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between items-center p-2.5 bg-slate-50 rounded-lg">
                  <span className="text-slate-500 font-medium">States</span>
                  <span className="font-bold text-slate-800 font-mono">{automaton.states.length}</span>
                </div>
                <div className="flex justify-between items-center p-2.5 bg-slate-50 rounded-lg">
                  <span className="text-slate-500 font-medium">Transitions</span>
                  <span className="font-bold text-slate-800 font-mono">{automaton.transitions.length}</span>
                </div>
                <div className="flex justify-between items-center p-2.5 bg-slate-50 rounded-lg">
                  <span className="text-slate-500 font-medium">ε-Transitions</span>
                  <span className="font-bold text-purple-700 font-mono">{automaton.transitions.filter((t) => t.symbol === "ε").length}</span>
                </div>
                <div className="flex justify-between items-center p-2.5 bg-slate-50 rounded-lg">
                  <span className="text-slate-500 font-medium">Alphabet</span>
                  <span className="font-bold text-slate-800 font-mono">{automaton.alphabet.filter((s) => s !== "ε").join(", ") || "—"}</span>
                </div>
                <div className="flex justify-between items-center p-2.5 bg-slate-50 rounded-lg">
                  <span className="text-slate-500 font-medium">Start State</span>
                  <span className="font-bold text-slate-800 font-mono">
                    {startStates.map((id) => stateMap.get(id)?.label || id).join(", ") || "None"}
                  </span>
                </div>
                <div className="flex justify-between items-center p-2.5 bg-slate-50 rounded-lg">
                  <span className="text-slate-500 font-medium">Accept States</span>
                  <span className="font-bold text-emerald-700 font-mono">
                    {automaton.states.filter((s) => s.isAccept).map((s) => s.label).join(", ") || "None"}
                  </span>
                </div>
              </div>
            </div>

            {selectedState && (
              <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-slate-200/60 shadow-lg p-4 sm:p-5">
                <h2 className="text-sm font-black text-gray-800 mb-3 flex items-center gap-2">
                  <Info className="w-4 h-4 text-indigo-600" /> Selected: {stateMap.get(selectedState)?.label}
                </h2>
                <div className="space-y-2 text-xs">
                  <div className="p-2.5 bg-indigo-50 rounded-lg">
                    <p className="text-[10px] font-black text-indigo-400 uppercase">Outgoing Transitions</p>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {(() => {
                        const outTrans = automaton.transitions.filter((t) => t.from === selectedState);
                        return outTrans.length > 0 ? outTrans.map((t, i) => (
                          <span key={i} className={`px-2 py-0.5 bg-white rounded text-[10px] font-bold font-mono border ${t.symbol === "ε" ? "text-purple-700 border-purple-200" : "text-indigo-700 border-indigo-200"}`}>
                            --{t.symbol === "ε" ? "ε" : t.symbol}→ {stateMap.get(t.to)?.label || t.to}
                          </span>
                        )) : <span className="text-slate-400 italic">None</span>;
                      })()}
                    </div>
                  </div>
                  <div className="flex gap-1.5">
                    <button onClick={() => updateAuto((a) => toggleStart(a, selectedState!))}
                      className="flex-1 px-2 py-1.5 bg-emerald-50 text-emerald-600 rounded-lg text-[10px] font-bold hover:bg-emerald-100 transition border border-emerald-200">
                      Toggle Start
                    </button>
                    <button onClick={() => updateAuto((a) => toggleAccept(a, selectedState!))}
                      className="flex-1 px-2 py-1.5 bg-amber-50 text-amber-600 rounded-lg text-[10px] font-bold hover:bg-amber-100 transition border border-amber-200">
                      Toggle Accept
                    </button>
                    <button onClick={() => { updateAuto((a) => removeState(a, selectedState!)); setSelectedState(null); }}
                      className="flex-1 px-2 py-1.5 bg-red-50 text-red-600 rounded-lg text-[10px] font-bold hover:bg-red-100 transition border border-red-200">
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-slate-200/60 shadow-lg overflow-hidden">
          <button onClick={() => setShowTheory(!showTheory)}
            className="w-full px-5 py-3.5 flex items-center justify-between text-sm font-black text-gray-700 hover:bg-slate-50/50 transition">
            <span className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-indigo-600" /> Theory & Reference
            </span>
            <ChevronRight className={`w-4 h-4 text-slate-400 transition-transform ${showTheory ? "rotate-90" : ""}`} />
          </button>
          {showTheory && (
            <div className="px-5 pb-6 space-y-6 border-t border-slate-100 pt-5">
              <div>
                <h3 className="text-base font-black text-gray-800 mb-2">What is an NFA?</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  A <strong>Nondeterministic Finite Automaton (NFA)</strong> is a 5-tuple (Q, Σ, δ, q₀, F) where the
                  transition function δ: Q × Σ<sub>ε</sub> → <em>P</em>(Q) maps a state and an input symbol (or ε) to a
                  <strong> set of possible next states</strong>. Unlike DFAs, NFAs can have multiple transitions for the
                  same symbol from a single state, and can transition without consuming input (ε-transitions).
                </p>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="p-4 bg-indigo-50 rounded-xl border border-indigo-200">
                  <h4 className="text-xs font-black text-indigo-700 mb-2">NFA vs DFA</h4>
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b border-indigo-200">
                        <th className="py-1.5 text-left font-bold text-indigo-600">Feature</th>
                        <th className="py-1.5 text-left font-bold text-indigo-600">NFA</th>
                        <th className="py-1.5 text-left font-bold text-indigo-600">DFA</th>
                      </tr>
                    </thead>
                    <tbody className="text-slate-600">
                      {[
                        ["δ output", "Set of states", "Single state"],
                        ["ε-transitions", "Allowed", "Not allowed"],
                        ["Same symbol × same state", "Multiple allowed", "Exactly one"],
                        ["Backtracking needed", "Yes (or parallel)", "No"],
                        ["States in DFA conv.", "n", "≤ 2ⁿ"],
                        ["Implementation", "Nondeterministic", "Deterministic"],
                      ].map(([feat, nfa, dfa]) => (
                        <tr key={feat} className="border-b border-indigo-100">
                          <td className="py-1.5 font-semibold text-gray-700">{feat}</td>
                          <td className="py-1.5 text-indigo-600 font-mono">{nfa}</td>
                          <td className="py-1.5 text-cyan-600 font-mono">{dfa}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="p-4 bg-purple-50 rounded-xl border border-purple-200">
                  <h4 className="text-xs font-black text-purple-700 mb-2">ε-NFA (Epsilon NFA)</h4>
                  <p className="text-xs text-slate-600 leading-relaxed mb-2">
                    An ε-NFA extends NFAs with <strong>ε-transitions</strong> that can be taken without consuming any input.
                    The ε-closure of a state includes the state itself plus all states reachable via ε-transitions.
                    Every ε-NFA can be converted to an equivalent NFA (without ε) and then to a DFA.
                  </p>
                  <div className="bg-white rounded-lg p-2.5 border border-purple-100">
                    <p className="text-[10px] font-bold text-purple-600 font-mono mb-1">ε-Closure Definition</p>
                    <p className="text-[11px] text-slate-600 font-mono">
                      ε-closure(q) = {"{q}"} ∪ {"{ q' | ∃ path q →* q' using only ε }"}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-base font-black text-gray-800 mb-2 flex items-center gap-2">
                  <Lightbulb className="w-4 h-4 text-amber-500" /> Interview Questions
                </h3>
                <div className="space-y-2.5">
                  {[
                    { q: "Explain how an NFA differs from a DFA in terms of the transition function.",
                      a: "In a DFA, δ: Q × Σ → Q maps to exactly one state. In an NFA, δ: Q × Σ_ε → P(Q) maps to a set of states. This means an NFA can have multiple transitions for the same symbol from a state, can have ε-transitions, and may have no transition for a given symbol (resulting in a dead configuration)." },
                    { q: "How do you convert an ε-NFA to a DFA?",
                      a: "The subset construction: each DFA state represents a set of NFA states. Start with ε-closure of the NFA start state. For each symbol, compute the ε-closure of all states reachable from the current set. A DFA state is accepting if it contains any NFA accepting state. Worst case: 2ⁿ DFA states." },
                    { q: "What is the ε-closure of a state and why is it important?",
                      a: "ε-closure(q) is the set of all states reachable from q using zero or more ε-transitions. It is crucial for NFA simulation and NFA→DFA conversion because after each symbol, you must take the ε-closure to account for all possible ε-moves before reading the next symbol." },
                  ].map((qa, i) => (
                    <div key={i} className="p-4 bg-amber-50 rounded-xl border border-amber-200">
                      <p className="text-sm font-bold text-gray-800 mb-1">Q{i + 1}: {qa.q}</p>
                      <p className="text-sm text-amber-700 flex items-start gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" /> {qa.a}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-base font-black text-gray-800 mb-2 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-indigo-500" /> Real-World Uses
                </h3>
                <div className="grid sm:grid-cols-2 gap-3">
                  {[
                    { title: "Regex Engines", desc: "Regular expressions are compiled into NFAs (Thompson's construction) for efficient pattern matching in grep, sed, and programming languages." },
                    { title: "Lexical Analysis", desc: "Lexers (scanners) use NFAs to tokenize source code. Tools like Lex and Flex convert regex patterns to NFAs then DFAs." },
                    { title: "Network Protocols", desc: "Protocol parsers use NFAs to match message patterns where multiple valid next states exist depending on message content." },
                    { title: "Natural Language", desc: "Part-of-speech tagging and shallow parsing use NFA-like models where multiple linguistic interpretations are tracked simultaneously." },
                  ].map((use) => (
                    <div key={use.title} className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                      <p className="text-xs font-bold text-gray-800 mb-0.5">{use.title}</p>
                      <p className="text-[11px] text-slate-500 leading-relaxed">{use.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
