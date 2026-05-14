"use client";

import { useState } from "react";
import Link from "next/link";
import { Cpu, HelpCircle, BookOpen, GitBranch, Layers, Hash, ArrowRight, ChevronDown, ChevronUp } from "lucide-react";

const TM_DEFINITION_7 = [
  { symbol: "Q", meaning: "Finite set of states" },
  { symbol: "Σ", meaning: "Input alphabet (does not include blank ⊔)" },
  { symbol: "Γ", meaning: "Tape alphabet (Σ ∪ {⊔} and possibly more)" },
  { symbol: "δ", meaning: "Transition function: Q × Γ → Q × Γ × {L, R}" },
  { symbol: "q₀", meaning: "Start state (q₀ ∈ Q)" },
  { symbol: "q_accept", meaning: "Accept state (q_accept ∈ Q)" },
  { symbol: "q_reject", meaning: "Reject state (q_reject ∈ Q, q_reject ≠ q_accept)" },
];

const EXAMPLES = [
  {
    title: "Unary Addition",
    desc: "Add two unary numbers (e.g., 11+111 → 11111)",
    steps: [
      "Move right to find the + separator",
      "Replace + with 1",
      "Move to the end and erase the last 1",
    ],
    diagram: (
      <svg viewBox="0 0 400 120" className="w-full max-w-md mx-auto">
        <rect x="20" y="10" width="30" height="30" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="1" rx="3" />
        <text x="35" y="29" textAnchor="middle" fill="#475569" fontSize="11" fontWeight="bold">1</text>
        <rect x="50" y="10" width="30" height="30" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="1" rx="3" />
        <text x="65" y="29" textAnchor="middle" fill="#475569" fontSize="11" fontWeight="bold">1</text>
        <rect x="80" y="10" width="30" height="30" fill="#fef08a" stroke="#eab308" strokeWidth="1.5" rx="3" />
        <text x="95" y="29" textAnchor="middle" fill="#854d0e" fontSize="11" fontWeight="bold">+</text>
        <rect x="110" y="10" width="30" height="30" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="1" rx="3" />
        <text x="125" y="29" textAnchor="middle" fill="#475569" fontSize="11" fontWeight="bold">1</text>
        <rect x="140" y="10" width="30" height="30" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="1" rx="3" />
        <text x="155" y="29" textAnchor="middle" fill="#475569" fontSize="11" fontWeight="bold">1</text>
        <rect x="170" y="10" width="30" height="30" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="1" rx="3" />
        <text x="185" y="29" textAnchor="middle" fill="#475569" fontSize="11" fontWeight="bold">1</text>
        <rect x="200" y="10" width="30" height="30" fill="#f1f5f9" stroke="#94a3b8" strokeWidth="1" rx="3" strokeDasharray="3" />
        <text x="215" y="29" textAnchor="middle" fill="#94a3b8" fontSize="11">⊔</text>
        <polygon points="95,45 90,55 100,55" fill="#6366f1" />
        <text x="95" y="65" textAnchor="middle" fill="#6366f1" fontSize="8" fontWeight="bold">Head</text>
        <text x="200" y="95" textAnchor="middle" fill="#94a3b8" fontSize="8">Tape: &ldquo;11+111&rdquo; → &ldquo;11111&rdquo;</text>
      </svg>
    ),
  },
  {
    title: "Palindrome Checker",
    desc: "Check if a binary string is a palindrome",
    steps: [
      "Compare first and last symbol by marking them",
      "Move inward and repeat",
      "Accept if all symbols match",
    ],
    diagram: (
      <svg viewBox="0 0 400 100" className="w-full max-w-md mx-auto">
        <rect x="30" y="10" width="30" height="30" fill="#dbeafe" stroke="#6366f1" strokeWidth="2" rx="3" />
        <text x="45" y="29" textAnchor="middle" fill="#4338ca" fontSize="11" fontWeight="bold">X</text>
        <rect x="60" y="10" width="30" height="30" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="1" rx="3" />
        <text x="75" y="29" textAnchor="middle" fill="#475569" fontSize="11" fontWeight="bold">1</text>
        <rect x="90" y="10" width="30" height="30" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="1" rx="3" />
        <text x="105" y="29" textAnchor="middle" fill="#475569" fontSize="11" fontWeight="bold">0</text>
        <rect x="120" y="10" width="30" height="30" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="1" rx="3" />
        <text x="135" y="29" textAnchor="middle" fill="#475569" fontSize="11" fontWeight="bold">1</text>
        <rect x="150" y="10" width="30" height="30" fill="#dbeafe" stroke="#6366f1" strokeWidth="2" rx="3" />
        <text x="165" y="29" textAnchor="middle" fill="#4338ca" fontSize="11" fontWeight="bold">X</text>
        <polygon points="105,45 100,55 110,55" fill="#6366f1" />
        <text x="105" y="65" textAnchor="middle" fill="#6366f1" fontSize="8" fontWeight="bold">Head</text>
      </svg>
    ),
  },
];

const INTERVIEW_QUESTIONS = [
  { q: "What is a Turing Machine and what are its key components?", a: "A Turing Machine (TM) is a 7-tuple (Q, Σ, Γ, δ, q₀, q_accept, q_reject) consisting of a finite set of states Q, an input alphabet Σ, a tape alphabet Γ (including blank), a transition function δ: Q×Γ → Q×Γ×{L,R}, a start state q₀, an accept state q_accept, and a reject state q_reject. The TM has an infinite tape, a read/write head, and a finite control unit. At each step, it reads a symbol, writes a new symbol, moves left or right, and changes state." },
  { q: "Explain the Church-Turing thesis and its significance.", a: "The Church-Turing thesis states that every effectively computable function can be computed by a Turing Machine. It is a thesis (not a theorem) because 'effectively computable' is an intuitive notion. The thesis is widely accepted because: (1) all reasonable models of computation (lambda calculus, μ-recursive functions, RAM machines) have been proven equivalent to TMs, and (2) no counterexample has been found. It establishes TMs as the standard model for studying computability." },
  { q: "What is the difference between decidability and undecidability?", a: "A decision problem is decidable if there exists a Turing Machine that halts with YES or NO for every input instance. It is undecidable if no such TM exists. The classic example is the Halting Problem: given a TM M and input w, does M halt on w? Alan Turing proved this is undecidable by a diagonalization argument. Other undecidable problems include Post's Correspondence Problem, the Entscheidungsproblem, and determining whether a CFG is ambiguous." },
];

export default function TuringMachinesPage() {
  const [expandedEx, setExpandedEx] = useState<number | null>(0);

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-5xl px-4 py-6">
        <nav className="flex items-center gap-2 text-xs text-slate-400 mb-6">
          <Link href="/tools" className="hover:text-indigo-600 transition-colors">Tools</Link>
          <span>/</span>
          <Link href="/tools/theory-of-computing" className="hover:text-indigo-600 transition-colors">Theory of Comp.</Link>
          <span>/</span>
          <span className="text-slate-700 font-medium">Turing Machines</span>
        </nav>

        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-md">
            <Cpu size={20} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Turing Machines</h1>
            <p className="text-xs text-slate-500">Computability, decidability, and the foundations of computation</p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-4">
            <div className="rounded-xl bg-white border border-slate-200 shadow-sm p-4">
              <h2 className="flex items-center gap-1.5 text-sm font-bold text-slate-700 mb-2"><BookOpen size={16} className="text-indigo-500" /> TM Definition (7-Tuple)</h2>
              <p className="text-xs text-slate-600 mb-3 leading-relaxed">A Turing Machine is defined as <strong>M = (Q, Σ, Γ, δ, q₀, q_accept, q_reject)</strong></p>
              <div className="space-y-1">
                {TM_DEFINITION_7.map((item) => (
                  <div key={item.symbol} className="flex items-center gap-2 rounded-md bg-slate-50 px-3 py-1.5">
                    <span className="w-3 text-center text-xs font-bold text-indigo-700">{item.symbol}</span>
                    <span className="text-[11px] text-slate-600">{item.meaning}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-xl bg-white border border-slate-200 shadow-sm p-4">
              <h2 className="flex items-center gap-1.5 text-sm font-bold text-slate-700 mb-2"><GitBranch size={16} className="text-indigo-500" /> How TMs Work</h2>
              <div className="space-y-2 text-xs text-slate-600">
                <p className="leading-relaxed">A TM has an <strong>infinite tape</strong> divided into cells, a <strong>read/write head</strong> positioned over one cell, and a <strong>finite control</strong> in one of the states. At each step:</p>
                <ol className="list-decimal list-inside space-y-1 text-[11px]">
                  <li>Read the symbol under the head</li>
                  <li>Consult the transition function δ(current_state, symbol)</li>
                  <li>Write a new symbol to the tape</li>
                  <li>Move the head Left or Right</li>
                  <li>Transition to a new state</li>
                </ol>
                <p className="leading-relaxed">The TM halts when it enters q_accept or q_reject. If it never halts, it loops infinitely.</p>
              </div>
            </div>

            <div className="rounded-xl bg-white border border-slate-200 shadow-sm p-4">
              <h2 className="flex items-center gap-1.5 text-sm font-bold text-slate-700 mb-2"><Layers size={16} className="text-indigo-500" /> Church-Turing Thesis</h2>
              <p className="text-xs text-slate-600 leading-relaxed mb-2">The Church-Turing thesis states that <strong>every effectively computable function can be computed by a Turing Machine</strong>. &ldquo;Effectively computable&rdquo; means computable by some mechanical procedure. All known models of computation (λ-calculus, μ-recursive functions, Post systems, RAM machines, cellular automata) have been proven equivalent to TMs, providing strong evidence for the thesis.</p>
              <div className="rounded-lg bg-indigo-50 p-2.5 border border-indigo-100">
                <p className="text-[11px] text-indigo-800 font-semibold">Key Implication:</p>
                <p className="text-[10px] text-indigo-600">If a problem cannot be solved by a Turing Machine, it cannot be solved by any computer — ever.</p>
              </div>
            </div>

            <div className="rounded-xl bg-white border border-slate-200 shadow-sm p-4">
              <h2 className="flex items-center gap-1.5 text-sm font-bold text-slate-700 mb-2"><Hash size={16} className="text-indigo-500" /> Decidability vs. Undecidability</h2>
              <div className="space-y-2 text-xs text-slate-600">
                <div className="rounded-lg bg-green-50 border border-green-100 p-2.5">
                  <p className="font-semibold text-green-800 text-[11px]">Decidable Problems</p>
                  <p className="text-[10px] text-green-700">A TM halts with YES/NO on every input. Examples: DFA emptiness, CFG membership, primality testing.</p>
                </div>
                <div className="rounded-lg bg-red-50 border border-red-100 p-2.5">
                  <p className="font-semibold text-red-800 text-[11px]">Undecidable Problems</p>
                  <p className="text-[10px] text-red-700">No TM exists that always halts with the correct answer. Examples: Halting Problem, Post&apos;s Correspondence Problem, Hilbert&apos;s Entscheidungsproblem.</p>
                </div>
                <p className="leading-relaxed">Alan Turing proved the undecidability of the Halting Problem in 1936 using a diagonalization argument, establishing the fundamental limits of computation.</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-xl bg-white border border-slate-200 shadow-sm p-4">
              <h2 className="flex items-center gap-1.5 text-sm font-bold text-slate-700 mb-3"><Cpu size={16} className="text-indigo-500" /> Examples</h2>
              <div className="space-y-2">
                {EXAMPLES.map((ex, i) => (
                  <div key={i} className="rounded-lg border border-slate-200 overflow-hidden">
                    <button onClick={() => setExpandedEx(expandedEx === i ? null : i)} className="flex items-center justify-between w-full px-3 py-2 bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer">
                      <span className="text-xs font-semibold text-slate-700">{ex.title}</span>
                      {expandedEx === i ? <ChevronUp size={14} className="text-slate-400" /> : <ChevronDown size={14} className="text-slate-400" />}
                    </button>
                    {expandedEx === i && (
                      <div className="p-3 space-y-2">
                        <p className="text-xs text-slate-600">{ex.desc}</p>
                        <ol className="space-y-1 text-[11px] text-slate-600 list-decimal list-inside">
                          {ex.steps.map((step, j) => (<li key={j}>{step}</li>))}
                        </ol>
                        <div className="pt-1">{ex.diagram}</div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-xl bg-white border border-slate-200 shadow-sm p-4">
              <h2 className="flex items-center gap-1.5 text-sm font-bold text-slate-700 mb-2"><GitBranch size={16} className="text-indigo-500" /> State Transition Diagram</h2>
              <svg viewBox="0 0 350 200" className="w-full max-w-sm mx-auto">
                <circle cx="60" cy="100" r="24" fill="white" stroke="#6366f1" strokeWidth="2" />
                <text x="60" y="104" textAnchor="middle" fill="#6366f1" fontSize="9" fontWeight="bold">q₀</text>
                <line x1="36" y1="90" x2="30" y2="80" stroke="#6366f1" strokeWidth="1.5" markerEnd="url(#arrowTm)" />
                <text x="25" y="77" textAnchor="end" fill="#6366f1" fontSize="7">start</text>

                <line x1="82" y1="88" x2="138" y2="76" stroke="#94a3b8" strokeWidth="1.5" markerEnd="url(#arrowTm)" />
                <text x="105" y="78" textAnchor="middle" fill="#6366f1" fontSize="7">0→1,R</text>

                <circle cx="170" cy="60" r="24" fill="white" stroke="#94a3b8" strokeWidth="1.5" />
                <text x="170" y="64" textAnchor="middle" fill="#64748b" fontSize="9" fontWeight="bold">q₁</text>

                <line x1="170" y1="84" x2="170" y2="126" stroke="#94a3b8" strokeWidth="1.5" markerEnd="url(#arrowTm)" />
                <text x="180" y="108" textAnchor="start" fill="#6366f1" fontSize="7">1→0,L</text>

                <circle cx="170" cy="150" r="24" fill="white" stroke="#94a3b8" strokeWidth="1.5" />
                <text x="170" y="154" textAnchor="middle" fill="#64748b" fontSize="9" fontWeight="bold">q₂</text>

                <line x1="146" y1="142" x2="90" y2="122" stroke="#94a3b8" strokeWidth="1.5" markerEnd="url(#arrowTm)" />
                <text x="112" y="128" textAnchor="middle" fill="#6366f1" fontSize="7">⊔→⊔,R</text>

                <circle cx="60" cy="100" r="24" fill="white" stroke="#6366f1" strokeWidth="2" />

                <circle cx="280" cy="60" r="24" fill="#eef2ff" stroke="#6366f1" strokeWidth="2" />
                <circle cx="280" cy="60" r="20" fill="#eef2ff" stroke="#6366f1" strokeWidth="1.5" />
                <text x="280" y="64" textAnchor="middle" fill="#6366f1" fontSize="8" fontWeight="bold">q_acc</text>

                <line x1="194" y1="60" x2="254" y2="60" stroke="#6366f1" strokeWidth="1.5" markerEnd="url(#arrowTm)" />
                <text x="224" y="54" textAnchor="middle" fill="#6366f1" fontSize="7">⊔→⊔,R</text>

                <defs>
                  <marker id="arrowTm" markerWidth="6" markerHeight="4" refX="6" refY="2" orient="auto">
                    <polygon points="0 0, 6 2, 0 4" fill="#94a3b8" />
                  </marker>
                </defs>
              </svg>
              <p className="text-[10px] text-slate-400 text-center mt-1">A simple TM that recognizes {`{ 0ⁿ1ⁿ | n ≥ 0 }`}</p>
            </div>

            <div className="rounded-xl bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-100 p-4">
              <h3 className="text-xs font-bold text-slate-700 mb-1">Limits of Computation</h3>
              <p className="text-[11px] text-slate-600 leading-relaxed">Turing Machines reveal that there are fundamental limits to what computers can do. Some problems are <strong>undecidable</strong> (no algorithm exists), and among decidable problems, some are <strong>intractable</strong> (require exponential time). Understanding these limits is crucial for knowing when to seek approximation algorithms or heuristic solutions.</p>
            </div>
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
