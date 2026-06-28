"use client";

import { useState, useMemo, useCallback } from "react";
import Link from "next/link";
import { Minimize2, HelpCircle, Play, RotateCcw, BookOpen, GitBranch, Layers, Hash } from "lucide-react";
import type { Automaton, State } from "../components/types";

const EXAMPLE_DFAS: Record<string, Automaton> = {
  "DFA 1": {
    states: [
      { id: "q0", label: "q0", x: 200, y: 150, isStart: true, isAccept: true },
      { id: "q1", label: "q1", x: 400, y: 150, isStart: false, isAccept: false },
      { id: "q2", label: "q2", x: 600, y: 150, isStart: false, isAccept: false },
      { id: "q3", label: "q3", x: 400, y: 300, isStart: false, isAccept: true },
    ],
    transitions: [
      { from: "q0", to: "q1", symbol: "0" },
      { from: "q0", to: "q2", symbol: "1" },
      { from: "q1", to: "q0", symbol: "0" },
      { from: "q1", to: "q3", symbol: "1" },
      { from: "q2", to: "q3", symbol: "0" },
      { from: "q2", to: "q0", symbol: "1" },
      { from: "q3", to: "q3", symbol: "0" },
      { from: "q3", to: "q3", symbol: "1" },
    ],
    alphabet: ["0", "1"],
  },
  "DFA 2": {
    states: [
      { id: "A", label: "A", x: 200, y: 150, isStart: true, isAccept: true },
      { id: "B", label: "B", x: 400, y: 150, isStart: false, isAccept: false },
      { id: "C", label: "C", x: 600, y: 150, isStart: false, isAccept: false },
      { id: "D", label: "D", x: 200, y: 300, isStart: false, isAccept: true },
      { id: "E", label: "E", x: 400, y: 300, isStart: false, isAccept: false },
      { id: "F", label: "F", x: 600, y: 300, isStart: false, isAccept: true },
    ],
    transitions: [
      { from: "A", to: "B", symbol: "0" }, { from: "A", to: "C", symbol: "1" },
      { from: "B", to: "A", symbol: "0" }, { from: "B", to: "D", symbol: "1" },
      { from: "C", to: "E", symbol: "0" }, { from: "C", to: "F", symbol: "1" },
      { from: "D", to: "E", symbol: "0" }, { from: "D", to: "F", symbol: "1" },
      { from: "E", to: "E", symbol: "0" }, { from: "E", to: "F", symbol: "1" },
      { from: "F", to: "F", symbol: "0" }, { from: "F", to: "F", symbol: "1" },
    ],
    alphabet: ["0", "1"],
  },
};

interface EquivalenceClass {
  states: string[];
  label: string;
}

function computeMinimization(automaton: Automaton): {
  equivalenceClasses: EquivalenceClass[];
  minimizedAutomaton: Automaton;
  table: { marked: Set<string> };
} {
  const n = automaton.states.length;
  const stateIds = automaton.states.map((s) => s.id);
  const marked = new Set<string>();

  const pairKey = (a: string, b: string) => a < b ? `${a},${b}` : `${b},${a}`;

  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      const si = automaton.states[i];
      const sj = automaton.states[j];
      if (si.isAccept !== sj.isAccept) {
        marked.add(pairKey(si.id, sj.id));
      }
    }
  }

  let changed = true;
  while (changed) {
    changed = false;
    for (let i = 0; i < n; i++) {
      for (let j = i + 1; j < n; j++) {
        const key = pairKey(stateIds[i], stateIds[j]);
        if (marked.has(key)) continue;
        for (const sym of automaton.alphabet) {
          const t1 = automaton.transitions.find((t) => t.from === stateIds[i] && t.symbol === sym);
          const t2 = automaton.transitions.find((t) => t.from === stateIds[j] && t.symbol === sym);
          if (t1 && t2 && t1.to !== t2.to) {
            const nextPair = pairKey(t1.to, t2.to);
            if (marked.has(nextPair)) {
              marked.add(key);
              changed = true;
              break;
            }
          }
        }
      }
    }
  }

  const visited = new Set<string>();
  const equivalenceClasses: EquivalenceClass[] = [];

  for (const s of stateIds) {
    if (visited.has(s)) continue;
    const eq = [s];
    visited.add(s);
    for (const t of stateIds) {
      if (t !== s && !visited.has(t) && !marked.has(pairKey(s, t))) {
        eq.push(t);
        visited.add(t);
      }
    }
    equivalenceClasses.push({ states: eq, label: `{${eq.join(",")}}` });
  }

  const getClassLabel = (stateId: string): string => {
    const cls = equivalenceClasses.find((ec) => ec.states.includes(stateId));
    return cls ? cls.label : stateId;
  };

  const newStates: State[] = equivalenceClasses.map((ec, i) => {
    return {
      id: ec.label,
      label: ec.label,
      x: 300 + Math.cos((i / equivalenceClasses.length) * Math.PI * 2) * 150,
      y: 200 + Math.sin((i / equivalenceClasses.length) * Math.PI * 2) * 150,
      isStart: ec.states.some((sid) => automaton.states.find((s) => s.id === sid)?.isStart),
      isAccept: ec.states.some((sid) => automaton.states.find((s) => s.id === sid)?.isAccept),
    };
  });

  const transitionSet = new Map<string, { from: string; to: string; symbol: string }>();
  for (const t of automaton.transitions) {
    const fromClass = getClassLabel(t.from);
    const toClass = getClassLabel(t.to);
    const key = `${fromClass}->${toClass}@${t.symbol}`;
    if (!transitionSet.has(key)) {
      transitionSet.set(key, { from: fromClass, to: toClass, symbol: t.symbol });
    }
  }

  const minimizedAutomaton: Automaton = {
    states: newStates,
    transitions: Array.from(transitionSet.values()),
    alphabet: [...automaton.alphabet],
  };

  return { equivalenceClasses, minimizedAutomaton, table: { marked } };
}

function AutomatonGraph({ automaton, width = 500, height = 350 }: { automaton: Automaton; width?: number; height?: number }) {
  const startArrows: { from: number; to: number; label: string }[] = [];
  const selfLoops: { stateId: string; label: string; count: number }[] = [];

  const transByFrom = new Map<string, { symbol: string; to: string }[]>();
  for (const t of automaton.transitions) {
    if (!transByFrom.has(t.from)) transByFrom.set(t.from, []);
    transByFrom.get(t.from)!.push({ symbol: t.symbol, to: t.to });
  }

  for (const [from, trans] of transByFrom) {
    const selfGroup = trans.filter((t) => t.to === from);
    const others = trans.filter((t) => t.to !== from);
    if (selfGroup.length > 0) {
      selfLoops.push({ stateId: from, label: selfGroup.map((t) => t.symbol).join(","), count: selfGroup.length });
    }
    for (const t of others) {
      startArrows.push({ from: automaton.states.findIndex((s) => s.id === from), to: automaton.states.findIndex((s) => s.id === t.to), label: t.symbol });
    }
  }

  const rad = 22;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto">
      {automaton.states.map((s) => s.isStart && (
        <g key={`start-${s.id}`}>
          <line x1={s.x - rad - 25} y1={s.y} x2={s.x - rad - 5} y2={s.y} stroke="#6366f1" strokeWidth="2" markerEnd="url(#arrowhead)" />
          <text x={s.x - rad - 14} y={s.y + 3} textAnchor="middle" fill="#6366f1" fontSize="8" fontWeight="bold">start</text>
        </g>
      ))}

      {startArrows.map((a, i) => {
        const s1 = automaton.states[a.from];
        const s2 = automaton.states[a.to];
        const dx = s2.x - s1.x;
        const dy = s2.y - s1.y;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1;
        const mx = (s1.x + s2.x) / 2;
        const my = (s1.y + s2.y) / 2;
        const nx = -dy / dist;
        const ny = dx / dist;
        const isOverlapping = startArrows.some((aa, j) => j < i && ((aa.from === a.to && aa.to === a.from) || (aa.from === a.from && aa.to === a.to)));
        const offset = isOverlapping ? 12 : 0;
        const ox = nx * offset;
        const oy = ny * offset;
        return (
          <g key={`arrow-${i}`}>
            <line x1={s1.x + (dx / dist) * rad + ox} y1={s1.y + (dy / dist) * rad + oy} x2={s2.x - (dx / dist) * rad + ox} y2={s2.y - (dy / dist) * rad + oy} stroke="#94a3b8" strokeWidth="1.5" markerEnd="url(#arrowhead)" />
            <text x={mx + ox} y={my + oy - 6} textAnchor="middle" fill="#6366f1" fontSize="8" fontWeight="bold">{a.label}</text>
          </g>
        );
      })}

      {selfLoops.map((sl) => {
        const s = automaton.states.find((st) => st.id === sl.stateId)!;
        return (
          <g key={`self-${sl.stateId}`}>
            <path d={`M ${s.x + rad} ${s.y - 5} C ${s.x + rad + 30} ${s.y - 30}, ${s.x + rad + 30} ${s.y + 30}, ${s.x + rad} ${s.y + 5}`} fill="none" stroke="#94a3b8" strokeWidth="1.5" markerEnd="url(#arrowhead)" />
            <text x={s.x + rad + 22} y={s.y} textAnchor="middle" fill="#6366f1" fontSize="8" fontWeight="bold" dominantBaseline="middle">{sl.label}</text>
          </g>
        );
      })}

      {automaton.states.map((s) => (
        <g key={s.id}>
          <circle cx={s.x} cy={s.y} r={rad} fill="white" stroke={s.isAccept ? "#6366f1" : "#cbd5e1"} strokeWidth={s.isAccept ? 2.5 : 1.5} />
          {s.isAccept && <circle cx={s.x} cy={s.y} r={rad - 4} fill="none" stroke="#a5b4fc" strokeWidth="1.5" />}
          <text x={s.x} y={s.y + 1} textAnchor="middle" dominantBaseline="middle" fill={s.isAccept ? "#6366f1" : "#64748b"} fontSize="10" fontWeight="bold">{s.label}</text>
        </g>
      ))}

      <defs>
        <marker id="arrowhead" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
          <polygon points="0 0, 8 3, 0 6" fill="#94a3b8" />
        </marker>
      </defs>
    </svg>
  );
}

const INTERVIEW_QUESTIONS = [
  { q: "What is DFA minimization and why is it important?", a: "DFA minimization reduces the number of states in a DFA while preserving the language it recognizes. It produces the unique minimal DFA (up to isomorphism) for a given language. This is important for: (1) reducing memory usage in compilers and pattern matching, (2) proving that every regular language has a unique minimal DFA, and (3) testing DFA equivalence by comparing minimized forms." },
  { q: "Explain the table-filling (Myhill-Nerode) algorithm for DFA minimization.", a: "The algorithm works by identifying indistinguishable (equivalent) states. Steps: (1) Create a table of all state pairs. (2) Mark all pairs where one state is accepting and the other is not. (3) For each remaining unmarked pair (p,q), check if there exists a symbol 'a' such that (δ(p,a), δ(q,a)) is marked. If so, mark (p,q). (4) Repeat until no more marks can be added. The unmarked pairs form equivalence classes that can be merged." },
  { q: "How does the Myhill-Nerode theorem relate to DFA minimization?", a: "The Myhill-Nerode theorem characterizes the regular languages: a language L is regular iff the equivalence relation ≈_L (where x ≈_L y iff for all z, xz ∈ L ⇔ yz ∈ L) has finitely many equivalence classes. The number of equivalence classes equals the number of states in the minimal DFA for L. This provides a theoretical foundation for DFA minimization and proves that the minimal DFA is unique." },
];

export default function MinimizationPage() {
  const [selectedExample, setSelectedExample] = useState("DFA 1");
  const [showMinimized, setShowMinimized] = useState(false);

  const automaton = EXAMPLE_DFAS[selectedExample];

  const result = useMemo(() => {
    if (!automaton) return null;
    return computeMinimization(automaton);
  }, [automaton]);

  const handleMinimize = useCallback(() => {
    setShowMinimized(true);
  }, []);

  const handleReset = useCallback(() => {
    setShowMinimized(false);
  }, []);

  const handleSelectExample = useCallback((key: string) => {
    setSelectedExample(key);
    setShowMinimized(false);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-5xl px-4 py-6">
        <nav className="flex items-center gap-2 text-xs text-slate-400 mb-6">
          <Link href="/tools" className="hover:text-indigo-600 transition-colors">Tools</Link>
          <span>/</span>
          <Link href="/tools/theory-of-computing" className="hover:text-indigo-600 transition-colors">Theory of Comp.</Link>
          <span>/</span>
          <span className="text-slate-700 font-medium">DFA Minimization</span>
        </nav>

        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-md">
            <Minimize2 size={20} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">DFA Minimization</h1>
            <p className="text-xs text-slate-500">Minimize DFAs using the table-filling algorithm</p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-5">
          <div className="lg:col-span-3 space-y-4">
            <div className="rounded-xl bg-white border border-slate-200 shadow-sm p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <h2 className="text-sm font-bold text-slate-700">Original DFA</h2>
                  <div className="flex gap-1">
                    {Object.keys(EXAMPLE_DFAS).map((key) => (
                      <button key={key} onClick={() => handleSelectExample(key)} className={`px-2 py-0.5 text-[10px] font-medium rounded transition-colors cursor-pointer ${selectedExample === key ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}>
                        {key}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex gap-1.5">
                  {!showMinimized ? (
                    <button onClick={handleMinimize} className="flex items-center gap-1 rounded-lg bg-indigo-600 text-white px-3 py-1.5 text-xs font-medium hover:bg-indigo-700 transition-colors cursor-pointer">
                      <Play size={12} /> Minimize
                    </button>
                  ) : (
                    <button onClick={handleReset} className="flex items-center gap-1 rounded-lg bg-slate-200 text-slate-700 px-3 py-1.5 text-xs font-medium hover:bg-slate-300 transition-colors cursor-pointer">
                      <RotateCcw size={12} /> Reset
                    </button>
                  )}
                </div>
              </div>
              <div className="overflow-x-auto">
                <AutomatonGraph automaton={automaton} width={500} height={300} />
              </div>
            </div>

            {showMinimized && result && (
              <>
                <div className="rounded-xl bg-white border border-slate-200 shadow-sm p-4">
                  <h2 className="flex items-center gap-1.5 text-sm font-bold text-slate-700 mb-3"><Layers size={16} className="text-indigo-500" /> Equivalence Classes</h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {result.equivalenceClasses.map((ec) => (
                      <div key={ec.label} className="rounded-lg bg-indigo-50 border border-indigo-100 p-2.5 text-center">
                        <span className="text-xs font-bold text-indigo-800">{ec.label}</span>
                        <div className="text-[10px] text-indigo-600 mt-0.5">States: {ec.states.join(", ")}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-xl bg-white border border-slate-200 shadow-sm p-4">
                  <h2 className="flex items-center gap-1.5 text-sm font-bold text-slate-700 mb-3"><Minimize2 size={16} className="text-purple-500" /> Minimized DFA</h2>
                  <div className="text-xs text-slate-500 mb-2">
                    Reduced from <strong className="text-slate-700">{automaton.states.length}</strong> states to <strong className="text-indigo-700">{result.minimizedAutomaton.states.length}</strong> states
                  </div>
                  <div className="overflow-x-auto">
                    <AutomatonGraph automaton={result.minimizedAutomaton} width={500} height={280} />
                  </div>
                </div>
              </>
            )}
          </div>

          <div className="lg:col-span-2 space-y-4">
            <div className="rounded-xl bg-white border border-slate-200 shadow-sm p-4">
              <h2 className="flex items-center gap-1.5 text-sm font-bold text-slate-700 mb-2"><BookOpen size={16} className="text-indigo-500" /> Theory</h2>
              <p className="text-xs text-slate-600 leading-relaxed mb-2">Two DFA states p and q are <strong>equivalent</strong> (indistinguishable) if for every input string w, running the DFA from p accepts w iff running from q accepts w. Minimization merges all equivalent states into one.</p>
              <div className="space-y-2 text-xs text-slate-600">
                <div className="rounded-lg bg-slate-50 p-2.5">
                  <p className="font-semibold text-slate-700 mb-0.5">Table-Filling Algorithm</p>
                  <p className="text-[11px] text-slate-500 leading-relaxed">1. Mark pairs (p,q) where p ∈ F and q ∉ F (or vice versa)<br />2. For each unmarked pair, check all symbols a. If (δ(p,a), δ(q,a)) is marked, mark (p,q).<br />3. Repeat step 2 until no changes.<br />4. Unmarked pairs are equivalent and can be merged.</p>
                </div>
              </div>
            </div>

            <div className="rounded-xl bg-white border border-slate-200 shadow-sm p-4">
              <h2 className="flex items-center gap-1.5 text-sm font-bold text-slate-700 mb-2"><GitBranch size={16} className="text-indigo-500" /> Why Minimize?</h2>
              <ul className="space-y-1.5 text-xs text-slate-600">
                <li className="flex items-start gap-1.5"><Hash size={10} className="mt-0.5 text-indigo-500 shrink-0" /> Smaller memory footprint for compilers and pattern matchers</li>
                <li className="flex items-start gap-1.5"><Hash size={10} className="mt-0.5 text-indigo-500 shrink-0" /> Unique minimal DFA proves equivalence between two DFAs</li>
                <li className="flex items-start gap-1.5"><Hash size={10} className="mt-0.5 text-indigo-500 shrink-0" /> Reduces complexity for verification and analysis</li>
                <li className="flex items-start gap-1.5"><Hash size={10} className="mt-0.5 text-indigo-500 shrink-0" /> Foundational for understanding the Myhill-Nerode theorem</li>
              </ul>
            </div>

            {showMinimized && result && (
              <div className="rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 border border-green-100 p-4">
                <h3 className="text-xs font-bold text-slate-700 mb-1">Minimization Complete</h3>
                <p className="text-[11px] text-slate-600 leading-relaxed">The DFA was reduced from <strong>{automaton.states.length}</strong> to <strong>{result.minimizedAutomaton.states.length}</strong> states. The {result.equivalenceClasses.length} equivalence class{result.equivalenceClasses.length > 1 ? "es" : ""} found by the table-filling algorithm represent{result.equivalenceClasses.length > 1 ? "" : "s"} the sets of mutually indistinguishable states.</p>
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 rounded-xl bg-white border border-slate-200 shadow-sm p-5">
          <h2 className="flex items-center gap-2 text-base font-bold text-slate-800 mb-4"><HelpCircle size={18} className="text-indigo-500" /> Interview Questions</h2>
          <div className="space-y-4">
            {INTERVIEW_QUESTIONS.map((item, i) => (
              <div key={i} className="rounded-lg bg-slate-50 p-4">
                <p className="text-sm font-semibold text-slate-800 mb-1">Q{i + 1}: {item.q}</p>
                <p className="text-xs text-slate-600 leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
