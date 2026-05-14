"use client";

import { useState, useCallback, useMemo } from "react";
import Link from "next/link";
import {
  Home, ChevronRight, Play, Plus, Trash2, Beaker,
  ArrowRight, CheckCircle2, XCircle, StepForward, StepBack,
  ToggleLeft, Sigma, Zap, GitCompare, Cpu,
} from "lucide-react";
import type { Automaton, State, SimulationStep } from "../components/types";
import {
  nfaToDfa,
  addState as addNfaState,
  toggleStart as toggleNfaStart,
  toggleAccept as toggleNfaAccept,
  addTransition as addNfaTransition,
  simulateDFA,
  simulateNFA,
  removeState,
} from "../components/types";

const R = 30;

const NFA_EXAMPLES: Record<string, Automaton> = {
  "Ends with 'ab'": {
    states: [
      { id: "q0", label: "q0", x: 120, y: 200, isStart: true, isAccept: false },
      { id: "q1", label: "q1", x: 280, y: 100, isStart: false, isAccept: false },
      { id: "q2", label: "q2", x: 280, y: 300, isStart: false, isAccept: false },
      { id: "q3", label: "q3", x: 440, y: 200, isStart: false, isAccept: true },
    ],
    transitions: [
      { from: "q0", to: "q1", symbol: "a" }, { from: "q0", to: "q2", symbol: "b" },
      { from: "q1", to: "q3", symbol: "b" }, { from: "q2", to: "q3", symbol: "a" },
      { from: "q3", to: "q3", symbol: "a" }, { from: "q3", to: "q3", symbol: "b" },
    ],
    alphabet: ["a", "b"],
  },
  "\u03b5-NFA: a*": {
    states: [
      { id: "q0", label: "q0", x: 200, y: 200, isStart: true, isAccept: true },
      { id: "q1", label: "q1", x: 400, y: 200, isStart: false, isAccept: true },
    ],
    transitions: [
      { from: "q0", to: "q1", symbol: "\u03b5" },
      { from: "q1", to: "q1", symbol: "a" },
    ],
    alphabet: ["a", "\u03b5"],
  },
  "\u03b5-NFA: a(b|c)*": {
    states: [
      { id: "q0", label: "q0", x: 120, y: 200, isStart: true, isAccept: false },
      { id: "q1", label: "q1", x: 260, y: 200, isStart: false, isAccept: false },
      { id: "q2", label: "q2", x: 400, y: 200, isStart: false, isAccept: false },
      { id: "q3", label: "q3", x: 520, y: 200, isStart: false, isAccept: true },
    ],
    transitions: [
      { from: "q0", to: "q1", symbol: "a" },
      { from: "q1", to: "q2", symbol: "\u03b5" },
      { from: "q2", to: "q2", symbol: "b" },
      { from: "q2", to: "q2", symbol: "c" },
      { from: "q2", to: "q3", symbol: "\u03b5" },
    ],
    alphabet: ["a", "b", "c", "\u03b5"],
  },
};

function edgePoint(cx: number, cy: number, tx: number, ty: number): { x: number; y: number } {
  const a = Math.atan2(ty - cy, tx - cx);
  return { x: cx + R * Math.cos(a), y: cy + R * Math.sin(a) };
}

function transPath(from: State, to: State, idx: number, total: number): string {
  const f = edgePoint(from.x, from.y, to.x, to.y);
  const t = edgePoint(to.x, to.y, from.x, from.y);
  const mx = (f.x + t.x) / 2;
  const my = (f.y + t.y) / 2;
  const nx = -(t.y - f.y);
  const ny = t.x - f.x;
  const nl = Math.sqrt(nx * nx + ny * ny) || 1;
  const off = (idx - (total - 1) / 2) * 22;
  return `M ${f.x} ${f.y} Q ${mx + (off * nx) / nl} ${my + (off * ny) / nl} ${t.x} ${t.y}`;
}

function selfLoopPath(s: State): { path: string; lx: number; ly: number } {
  const lx = s.x, ly = s.y - R * 2.1;
  return {
    path: `M ${s.x - R * 0.6} ${s.y - R * 0.6} C ${s.x - R * 1.6} ${s.y - R * 2.2}, ${s.x + R * 1.6} ${s.y - R * 2.2}, ${s.x + R * 0.6} ${s.y - R * 0.6}`,
    lx, ly,
  };
}

function markerId(panel: string) { return `${panel}-arrowhead`; }

function AutomatonGraph({
  automaton, panel, selected, source, highlightStates, onStateClick,
  width = 560, height = 400,
}: {
  automaton: Automaton; panel: string; selected?: string | null; source?: string | null;
  highlightStates?: Set<string>; onStateClick?: (id: string) => void;
  width?: number; height?: number;
}) {
  const transMap = useMemo(() => {
    const m = new Map<string, { symbol: string; from: string; to: string }[]>();
    for (const t of automaton.transitions) {
      const k = `${t.from}|${t.to}`;
      if (!m.has(k)) m.set(k, []);
      m.get(k)!.push(t);
    }
    return m;
  }, [automaton.transitions]);

  const stateMap = useMemo(() => {
    const m = new Map<string, State>();
    for (const s of automaton.states) m.set(s.id, s);
    return m;
  }, [automaton.states]);

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full" style={{ minHeight: 360 }}>
      <defs>
        {["nfa", "dfa"].map((p) => (
          <marker key={p} id={markerId(p)} markerWidth={10} markerHeight={8} refX={9} refY={4} orient="auto">
            <polygon points="0 0, 10 4, 0 8" fill={p === "nfa" ? "#6366f1" : "#8b5cf6"} />
          </marker>
        ))}
      </defs>

      {automaton.states.filter((s) => s.isStart).map((s) => (
        <g key={`start-${s.id}`}>
          <line x1={s.x - R - 30} y1={s.y} x2={s.x - R + 2} y2={s.y} stroke="#059669" strokeWidth={2.5} />
          <polygon points={`${s.x - R + 2},${s.y - 7} ${s.x - R + 2},${s.y + 7} ${s.x - R + 12},${s.y}`} fill="#059669" />
        </g>
      ))}

      {Array.from(transMap.entries()).map(([key, trans]) => {
        const [fid, tid] = key.split("|");
        const fs = stateMap.get(fid);
        const ts = stateMap.get(tid);
        if (!fs || !ts) return null;
        const isSelf = fid === tid;
        const total = trans.length;
        const isEpsilon = trans.some((t) => t.symbol === "\u03b5");

        if (isSelf) {
          const { path, lx, ly } = selfLoopPath(fs);
          const label = trans.map((t) => t.symbol).join(",");
          return (
            <g key={key}>
              <path d={path} fill="none" stroke={isEpsilon ? "#f59e0b" : "#6366f1"} strokeWidth={2}
                strokeDasharray={isEpsilon ? "6,3" : "none"}
                markerEnd={`url(#${markerId(panel)})`} />
              <text x={lx} y={ly + 4} textAnchor="middle" className="text-xs fill-slate-700 font-medium">{label}</text>
            </g>
          );
        }

        const paths = trans.map((_, i) => {
          const d = transPath(fs, ts, i, total);
          const label = trans.map((t) => t.symbol).join(",");
          const mid = d.match(/Q ([\d.-]+) ([\d.-]+)/);
          const lx = mid ? parseFloat(mid[1]) : (fs.x + ts.x) / 2;
          const ly = mid ? parseFloat(mid[2]) : (fs.y + ts.y) / 2;
          return { d, label: i === 0 ? label : null, lx, ly, isEpsilon };
        });

        return paths.map((p, i) => (
          <g key={`${key}-${i}`}>
            <path d={p.d} fill="none" stroke={p.isEpsilon ? "#f59e0b" : "#6366f1"} strokeWidth={2}
              strokeDasharray={p.isEpsilon ? "6,3" : "none"}
              markerEnd={`url(#${markerId(panel)})`} />
            {p.label && (
              <text x={p.lx} y={p.ly - 8} textAnchor="middle" className="text-xs fill-slate-700 font-medium"
                paintOrder="stroke" stroke="white" strokeWidth={3}>
                {p.label}
              </text>
            )}
          </g>
        ));
      })}

      {automaton.states.map((s) => {
        const hl = highlightStates?.has(s.id);
        const sel = selected === s.id;
        const src = source === s.id;
        const fill = hl ? "#c7d2fe" : sel ? "#e0e7ff" : src ? "#fef3c7" : "#f8fafc";
        const stroke = hl ? "#6366f1" : sel ? "#4f46e5" : src ? "#f59e0b" : "#94a3b8";
        const sw = hl || sel || src ? 3 : 1.5;
        return (
          <g key={s.id} onClick={() => onStateClick?.(s.id)} className="cursor-pointer">
            <circle cx={s.x} cy={s.y} r={R} fill={fill} stroke={stroke} strokeWidth={sw} />
            {s.isAccept && <circle cx={s.x} cy={s.y} r={R - 5} fill="none" stroke={stroke} strokeWidth={sw} />}
            <text x={s.x} y={s.y + 4} textAnchor="middle"
              className="text-xs fill-slate-800 font-semibold select-none"
              style={{ fontSize: s.label.length > 6 ? 9 : 11 }}>{s.label}</text>
          </g>
        );
      })}
    </svg>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-8">
      <h2 className="text-xl font-bold text-slate-900 mb-4 pb-2 border-b-2 border-indigo-200">{title}</h2>
      {children}
    </div>
  );
}

function InfoCard({ title, children, type = "info" }: { title: string; children: React.ReactNode; type?: "info" | "warning" | "tip" }) {
  const colors = {
    info: { bg: "bg-indigo-50", border: "border-indigo-200", icon: "ℹ️" },
    warning: { bg: "bg-amber-50", border: "border-amber-200", icon: "⚠️" },
    tip: { bg: "bg-emerald-50", border: "border-emerald-200", icon: "💡" },
  };
  const c = colors[type];
  return (
    <div className={`${c.bg} ${c.border} border rounded-xl p-4 mb-4 flex gap-3`}>
      <span className="text-lg shrink-0">{c.icon}</span>
      <div>
        <h4 className="font-semibold text-slate-900 text-sm mb-1">{title}</h4>
        <div className="text-sm text-slate-600 leading-relaxed">{children}</div>
      </div>
    </div>
  );
}

function InterviewQuestion({ q, a }: { q: string; a: string }) {
  return (
    <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl mb-3">
      <p className="font-semibold text-emerald-800 text-sm mb-2">Q: {q}</p>
      <p className="text-sm text-emerald-700 leading-relaxed">A: {a}</p>
    </div>
  );
}

export default function NfaToDfaPage() {
  const [nfa, setNfa] = useState<Automaton>({
    states: [
      { id: "q0", label: "q0", x: 140, y: 200, isStart: true, isAccept: false },
      { id: "q1", label: "q1", x: 300, y: 100, isStart: false, isAccept: false },
      { id: "q2", label: "q2", x: 300, y: 300, isStart: false, isAccept: true },
    ],
    transitions: [
      { from: "q0", to: "q0", symbol: "a" },
      { from: "q0", to: "q1", symbol: "b" },
      { from: "q1", to: "q2", symbol: "a" },
      { from: "q2", to: "q2", symbol: "a" },
      { from: "q2", to: "q2", symbol: "b" },
    ],
    alphabet: ["a", "b"],
  });
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [transSource, setTransSource] = useState<string | null>(null);
  const [transSymbol, setTransSymbol] = useState("");
  const [nfaTestInput, setNfaTestInput] = useState("");
  const [nfaSimResult, setNfaSimResult] = useState<{ accepted: boolean; steps: { activeStates: string[]; symbol: string; step: number }[] } | null>(null);

  const [dfaData, setDfaData] = useState<{ dfa: Automaton; conversionSteps: { subset: string[]; stateName: string; transitions: { symbol: string; to: string }[] }[] } | null>(null);
  const [stepMode, setStepMode] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [dfaTestInput, setDfaTestInput] = useState("");
  const [dfaSimResult, setDfaSimResult] = useState<{ accepted: boolean; steps: SimulationStep[]; path: string[] } | null>(null);

  const exampleNames = Object.keys(NFA_EXAMPLES);

  const handleAddState = useCallback(() => {
    setNfa((prev) => addNfaState(prev));
  }, []);

  const handleToggleStart = useCallback(() => {
    if (!selectedId) return;
    setNfa((prev) => toggleNfaStart(prev, selectedId));
  }, [selectedId]);

  const handleToggleAccept = useCallback(() => {
    if (!selectedId) return;
    setNfa((prev) => toggleNfaAccept(prev, selectedId));
  }, [selectedId]);

  const handleRemoveState = useCallback(() => {
    if (!selectedId) return;
    setNfa((prev) => removeState(prev, selectedId));
    setSelectedId(null);
  }, [selectedId]);

  const handleAddTransition = useCallback(() => {
    if (!transSource || !transSymbol.trim() || !selectedId) return;
    setNfa((prev) => addNfaTransition(prev, transSource, selectedId, transSymbol.trim()));
  }, [transSource, transSymbol, selectedId]);

  const handleLoadExample = useCallback((name: string) => {
    const ex = NFA_EXAMPLES[name];
    if (!ex) return;
    setNfa({ ...ex, states: ex.states.map((s) => ({ ...s })), transitions: ex.transitions.map((t) => ({ ...t })) });
    setSelectedId(null);
    setTransSource(null);
    setTransSymbol("");
    setNfaSimResult(null);
    setDfaData(null);
    setDfaSimResult(null);
  }, []);

  const handleConvert = useCallback(() => {
    if (nfa.states.length === 0) return;
    const result = nfaToDfa(nfa);
    setDfaData(result);
    setCurrentStep(0);
    setDfaSimResult(null);
  }, [nfa]);

  const handleTestNfa = useCallback(() => {
    if (nfa.states.length === 0) return;
    const result = simulateNFA(nfa, nfaTestInput);
    setNfaSimResult(result);
  }, [nfa, nfaTestInput]);

  const handleTestDfa = useCallback(() => {
    if (!dfaData) return;
    const result = simulateDFA(dfaData.dfa, dfaTestInput);
    setDfaSimResult(result);
  }, [dfaData, dfaTestInput]);

  const handleStepForward = useCallback(() => {
    if (!dfaData) return;
    setCurrentStep((p) => Math.min(p + 1, dfaData.conversionSteps.length - 1));
  }, [dfaData]);

  const handleStepBack = useCallback(() => {
    setCurrentStep((p) => Math.max(p - 1, 0));
  }, []);

  const stepInfo = dfaData && stepMode ? dfaData.conversionSteps[currentStep] : null;
  const highlightStates = stepInfo ? new Set(stepInfo.subset) : undefined;

  const conversionTable = dfaData?.conversionSteps ?? [];
  const alphabet = dfaData ? dfaData.dfa.alphabet : [];

  const transFromOptions = nfa.states.map((s) => (
    <button key={s.id} onClick={() => setTransSource(s.id)}
      className={`px-2 py-1 text-xs rounded border ${transSource === s.id ? "bg-amber-100 border-amber-400 text-amber-800" : "bg-white border-slate-200 text-slate-600 hover:border-indigo-300"}`}>
      {s.label}
    </button>
  ));

  const nfaAccepted = nfaSimResult?.accepted;
  const dfaAccepted = dfaSimResult?.accepted;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
      <div className="flex items-center gap-2 mb-4 text-xs text-slate-500">
        <Link href="/tools/theory-of-computing" className="text-indigo-600 no-underline flex items-center gap-1.5 hover:text-indigo-800 transition">
          <Home size={16} /> Theory of Comp.
        </Link>
        <ChevronRight size={16} />
        <span className="text-slate-900 font-semibold">NFA &rarr; DFA Conversion</span>
      </div>

      <div className="mb-6">
        <h1 className="text-3xl font-extrabold text-slate-900 mb-2">
          <GitCompare className="inline mr-2 text-indigo-600" size={28} />
          NFA &rarr; DFA Conversion
        </h1>
        <p className="text-sm text-slate-500 max-w-2xl">
          Convert Non-deterministic Finite Automata to Deterministic Finite Automata using the
          subset construction algorithm. Build or load an NFA with &epsilon;-transitions, then
          visualize each step of the conversion.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 mb-8">
        <div className="lg:col-span-5 bg-white/70 backdrop-blur-xl border border-indigo-100/50 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Sigma className="text-amber-500" size={20} />
              NFA
            </h2>
            <div className="flex items-center gap-1.5">
              <select onChange={(e) => { if (e.target.value) handleLoadExample(e.target.value); }}
                className="text-xs border border-slate-200 rounded-lg px-2 py-1 bg-white text-slate-700">
                <option value="">Load example...</option>
                {exampleNames.map((n) => <option key={n} value={n}>{n}</option>)}
              </select>
            </div>
          </div>

          <div className="bg-gradient-to-br from-slate-50 to-indigo-50/30 rounded-xl border border-slate-200 mb-3 overflow-hidden">
            <AutomatonGraph automaton={nfa} panel="nfa" selected={selectedId} source={transSource}
              highlightStates={highlightStates} onStateClick={setSelectedId} />
          </div>

          <div className="grid grid-cols-2 gap-2 mb-3">
            <div className="flex flex-wrap gap-1">
              <button onClick={handleAddState}
                className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium bg-indigo-50 text-indigo-700 rounded-lg border border-indigo-200 hover:bg-indigo-100 transition">
                <Plus size={14} /> State
              </button>
              <button onClick={handleToggleStart} disabled={!selectedId}
                className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium bg-emerald-50 text-emerald-700 rounded-lg border border-emerald-200 hover:bg-emerald-100 transition disabled:opacity-30">
                <Play size={14} /> Start
              </button>
              <button onClick={handleToggleAccept} disabled={!selectedId}
                className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium bg-amber-50 text-amber-700 rounded-lg border border-amber-200 hover:bg-amber-100 transition disabled:opacity-30">
                <CheckCircle2 size={14} /> Accept
              </button>
              <button onClick={handleRemoveState} disabled={!selectedId}
                className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium bg-red-50 text-red-700 rounded-lg border border-red-200 hover:bg-red-100 transition disabled:opacity-30">
                <Trash2 size={14} />
              </button>
            </div>
            <div className="text-xs text-slate-400 flex items-center justify-end">
              {selectedId ? <span className="text-indigo-600 font-medium">Selected: {selectedId}</span> : "Click a state"}
            </div>
          </div>

          <div className="bg-slate-50 rounded-xl p-3 border border-slate-200 mb-3">
            <p className="text-xs font-semibold text-slate-600 mb-2 flex items-center gap-1.5">
              <ArrowRight size={13} /> Transition
            </p>
            <div className="flex flex-wrap items-center gap-1.5 mb-2">
              {transFromOptions}
            </div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <input value={transSymbol} onChange={(e) => setTransSymbol(e.target.value)}
                placeholder="symbol" className="w-20 px-2 py-1 text-xs border border-slate-200 rounded-lg bg-white text-slate-700" />
              <button onClick={() => setTransSymbol((p) => p + "\u03b5")}
                className="px-2 py-1 text-xs font-mono font-bold bg-orange-50 text-orange-700 border border-orange-200 rounded-lg hover:bg-orange-100">&epsilon;</button>
              <span className="text-xs text-slate-400">from {transSource || "?"}</span>
              <span className="text-xs text-slate-400">to {selectedId || "?"}</span>
              <button onClick={handleAddTransition} disabled={!transSource || !transSymbol.trim() || !selectedId}
                className="px-2.5 py-1 text-xs font-medium bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition disabled:opacity-30">
                Add
              </button>
            </div>
          </div>

          <div className="bg-slate-50 rounded-xl p-3 border border-slate-200">
            <p className="text-xs font-semibold text-slate-600 mb-2 flex items-center gap-1.5">
              <Beaker size={13} /> Test NFA
            </p>
            <div className="flex items-center gap-2">
              <input value={nfaTestInput} onChange={(e) => setNfaTestInput(e.target.value)}
                placeholder="Enter string..." className="flex-1 px-3 py-1.5 text-xs border border-slate-200 rounded-lg bg-white text-slate-700" />
              <button onClick={handleTestNfa}
                className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition">
                <Play size={13} /> Run
              </button>
            </div>
            {nfaSimResult && (
              <div className={`mt-2 flex items-center gap-2 text-xs font-semibold ${nfaAccepted ? "text-emerald-700" : "text-red-600"}`}>
                {nfaAccepted ? <CheckCircle2 size={14} /> : <XCircle size={14} />}
                {nfaAccepted ? "Accepted" : "Rejected"}
                <span className="text-slate-400 font-normal ml-1">
                  ({nfaSimResult.steps.length - 1} steps)
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-2 flex flex-col items-center justify-start gap-3 pt-6">
          <button onClick={handleConvert} disabled={nfa.states.length === 0}
            className="flex items-center gap-2 px-5 py-2.5 text-sm font-bold bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-xl shadow-lg hover:shadow-xl hover:from-indigo-700 hover:to-violet-700 transition disabled:opacity-30">
            <Zap size={18} /> Convert
          </button>

          {dfaData && (
            <div className="w-full bg-white/60 backdrop-blur-sm border border-indigo-100 rounded-xl p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-600 flex items-center gap-1">
                  <ToggleLeft size={14} /> Step Mode
                </span>
                <button onClick={() => setStepMode((p) => !p)}
                  className={`relative w-9 h-5 rounded-full transition ${stepMode ? "bg-indigo-600" : "bg-slate-300"}`}>
                  <span className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition ${stepMode ? "translate-x-4" : ""}`} />
                </button>
              </div>

              {stepMode && dfaData.conversionSteps.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-500">Step {currentStep + 1} of {dfaData.conversionSteps.length}</span>
                    <div className="flex gap-1">
                      <button onClick={handleStepBack} disabled={currentStep === 0}
                        className="p-1 rounded border border-slate-200 hover:bg-slate-100 disabled:opacity-30">
                        <StepBack size={13} />
                      </button>
                      <button onClick={handleStepForward} disabled={currentStep >= dfaData.conversionSteps.length - 1}
                        className="p-1 rounded border border-slate-200 hover:bg-slate-100 disabled:opacity-30">
                        <StepForward size={13} />
                      </button>
                    </div>
                  </div>

                  <div className="w-full bg-slate-100 rounded-full h-1.5">
                    <div className="bg-indigo-600 h-1.5 rounded-full transition-all"
                      style={{ width: `${((currentStep + 1) / dfaData.conversionSteps.length) * 100}%` }} />
                  </div>

                  {stepInfo && (
                    <div className="bg-indigo-50 rounded-lg p-2.5 space-y-1 text-xs">
                      <p><span className="font-semibold text-indigo-700">Subset:</span> {"{"}{stepInfo.subset.join(", ")}{"}"}</p>
                      <p><span className="font-semibold text-indigo-700">DFA State:</span> {stepInfo.stateName}</p>
                      {stepInfo.transitions.map((tr, i) => (
                        <p key={i}>
                          <span className="font-semibold text-slate-600">&delta;({tr.symbol}):</span> {tr.to}
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              )}

              <div className="mt-2 max-h-32 overflow-y-auto">
                <table className="w-full text-[11px] border-collapse">
                  <thead>
                    <tr className="bg-slate-100 text-slate-600">
                      <th className="px-2 py-1 text-left font-semibold">DFA State</th>
                      <th className="px-2 py-1 text-left font-semibold">NFA Subset</th>
                      {alphabet.map((s) => <th key={s} className="px-2 py-1 text-left font-semibold">&delta;({s})</th>)}
                    </tr>
                  </thead>
                  <tbody>
                    {conversionTable.map((step, i) => (
                      <tr key={i} className={`border-t border-slate-200 ${stepMode && i === currentStep ? "bg-indigo-100" : ""}`}>
                        <td className="px-2 py-1 font-mono text-indigo-700">{step.stateName}</td>
                        <td className="px-2 py-1 text-slate-500">{"{"}{step.subset.join(",")}{"}"}</td>
                        {alphabet.map((s) => {
                          const t = step.transitions.find((tr) => tr.symbol === s);
                          return <td key={s} className="px-2 py-1 font-mono text-slate-700">{t ? t.to : "\u2014"}</td>;
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        <div className="lg:col-span-5 bg-white/70 backdrop-blur-xl border border-violet-100/50 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Cpu className="text-violet-500" size={20} />
              DFA
            </h2>
            {dfaData && (
              <span className="text-xs text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                {dfaData.dfa.states.length} states
              </span>
            )}
          </div>

          <div className="bg-gradient-to-br from-slate-50 to-violet-50/30 rounded-xl border border-slate-200 mb-3 overflow-hidden">
            {dfaData ? (
              <AutomatonGraph automaton={dfaData.dfa} panel="dfa"
                highlightStates={stepInfo ? new Set([stepInfo.stateName]) : undefined} />
            ) : (
              <div className="flex items-center justify-center text-slate-300 text-sm" style={{ minHeight: 360 }}>
                <div className="text-center">
                  <Zap size={40} className="mx-auto mb-2 text-slate-200" />
                  <p>Build an NFA and click Convert</p>
                </div>
              </div>
            )}
          </div>

          {dfaData && (
            <div className="bg-slate-50 rounded-xl p-3 border border-slate-200">
              <p className="text-xs font-semibold text-slate-600 mb-2 flex items-center gap-1.5">
                <Beaker size={13} /> Test DFA
              </p>
              <div className="flex items-center gap-2">
                <input value={dfaTestInput} onChange={(e) => setDfaTestInput(e.target.value)}
                  placeholder="Enter string..." className="flex-1 px-3 py-1.5 text-xs border border-slate-200 rounded-lg bg-white text-slate-700" />
                <button onClick={handleTestDfa}
                  className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition">
                  <Play size={13} /> Run
                </button>
              </div>
              {dfaSimResult && (
                <div className={`mt-2 flex items-center gap-2 text-xs font-semibold ${dfaAccepted ? "text-emerald-700" : "text-red-600"}`}>
                  {dfaAccepted ? <CheckCircle2 size={14} /> : <XCircle size={14} />}
                  {dfaAccepted ? "Accepted" : "Rejected"}
                  <span className="text-slate-400 font-normal ml-1">
                    (path: {dfaSimResult.path.join(" \u2192 ")})
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <Section title="Subset Construction Algorithm">
        <InfoCard title="How It Works">
          <ol className="list-decimal ml-4 space-y-1 text-sm text-slate-600">
            <li>Compute the &epsilon;-closure of the NFA&apos;s start state &mdash; this becomes the DFA&apos;s start state.</li>
            <li>For each new DFA state (an NFA subset), compute the transition for each alphabet symbol:
              take the union of all NFA states reachable from the subset on that symbol, then compute
              the &epsilon;-closure of the result.</li>
            <li>If this produces a new subset not yet seen, add it as a new DFA state.</li>
            <li>A DFA state is accepting if any NFA state in its subset is accepting.</li>
            <li>Repeat until all subsets have been processed.</li>
          </ol>
        </InfoCard>

        <div className="grid sm:grid-cols-2 gap-4 mb-4">
          <InfoCard title="Why Convert NFA to DFA?" type="tip">
            DFAs are faster to simulate (O(n) time versus O(2^n) for NFAs) and are directly
            implementable in hardware and software. Most regex engines first convert the pattern
            to an NFA, then to a DFA for efficient matching.
          </InfoCard>
          <InfoCard title="Exponential Blowup" type="warning">
            A DFA may have up to 2<sup>n</sup> states for an NFA with n states. In the worst case,
            every subset of NFA states becomes a distinct DFA state. This is why DFA minimization
            is important &mdash; it reduces the state count.
          </InfoCard>
        </div>

        <Section title="Interview Questions">
          <InterviewQuestion
            q="What is the subset construction algorithm for NFA to DFA conversion?"
            a="The subset construction algorithm converts an NFA to an equivalent DFA by treating each
              set of NFA states as a single DFA state. For each DFA state (subset of NFA states) and
              each input symbol, we compute the set of NFA states reachable via that symbol (including
              &epsilon;-closure) to determine the next DFA state."
          />
          <InterviewQuestion
            q="Why might a DFA have exponentially more states than the original NFA?"
            a="A DFA state represents a subset of NFA states. With n NFA states, there are 2^n possible
              subsets, each of which could become a DFA state. In practice, many subsets are unreachable
              from the start state, so the actual DFA is usually much smaller than the theoretical maximum."
          />
          <InterviewQuestion
            q="What is &epsilon;-closure and why is it important in NFA to DFA conversion?"
            a="The &epsilon;-closure of a set of NFA states is the set of all states reachable from them
              using only &epsilon;-transitions (transitions on empty string). It is critical because
              &epsilon;-transitions allow an NFA to change state without consuming input; when converting
              to a DFA, we must account for all states reachable via &epsilon; at each step."
          />
        </Section>
      </Section>
    </div>
  );
}
