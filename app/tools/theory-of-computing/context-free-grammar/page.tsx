"use client";

import { useState } from "react";
import Link from "next/link";
import { FileType, HelpCircle, BookOpen, GitBranch, ChevronDown, ChevronUp, TreePine, Layers } from "lucide-react";

const CNF_STEPS = [
  "Eliminate ε-productions (A → ε)",
  "Eliminate unit productions (A → B)",
  "Replace terminals in mixed rules: A → aB becomes A → Xₐ, Xₐ → a",
  "Break long productions: A → BCD becomes A → BZ, Z → CD",
];

const INTERVIEW_QUESTIONS = [
  { q: "What is a context-free grammar and how does it relate to pushdown automata?", a: "A CFG is a 4-tuple (V, Σ, R, S) where V is non-terminals, Σ is terminals, R is production rules, and S is the start symbol. CFGs generate context-free languages, which are exactly the languages recognized by pushdown automata (PDAs). This equivalence means that for every CFG there exists a PDA that recognizes the same language, and vice versa." },
  { q: "Explain Chomsky Normal Form (CNF) and why it's useful.", a: "A CFG is in CNF if every production is of the form A → BC or A → a (where A, B, C are non-terminals and a is a terminal). CNF is useful because: (1) it limits the parse tree structure making analysis easier, (2) the CYK parsing algorithm requires CNF, (3) it provides an upper bound on derivation length — a string of length n requires exactly 2n-1 derivation steps in any parse tree." },
  { q: "What is the difference between a parse tree and a derivation?", a: "A derivation is a sequence of rule applications that transforms the start symbol into a terminal string. A parse tree is a graphical representation of a derivation where each internal node is a non-terminal, each leaf is a terminal, and children of a node correspond to the right-hand side of a production. A single parse tree can correspond to multiple derivations (e.g., leftmost vs. rightmost), but for unambiguous grammars, each string has exactly one parse tree." },
];

function ParseTreeSVG({ type }: { type: string }) {
  if (type === "palindrome") {
    return (
      <svg viewBox="0 0 300 180" className="w-full max-w-xs mx-auto">
        <line x1="150" y1="10" x2="100" y2="60" stroke="#6366f1" strokeWidth="1.5" />
        <line x1="150" y1="10" x2="200" y2="60" stroke="#6366f1" strokeWidth="1.5" />
        <line x1="100" y1="60" x2="70" y2="110" stroke="#a855f7" strokeWidth="1.5" />
        <line x1="100" y1="60" x2="130" y2="110" stroke="#a855f7" strokeWidth="1.5" />
        <line x1="200" y1="60" x2="170" y2="110" stroke="#a855f7" strokeWidth="1.5" />
        <line x1="200" y1="60" x2="230" y2="110" stroke="#a855f7" strokeWidth="1.5" />
        <circle cx="150" cy="10" r="14" fill="#6366f1" />
        <text x="150" y="14" textAnchor="middle" fill="white" fontSize="9" fontWeight="bold">S</text>
        <circle cx="100" cy="60" r="12" fill="#a855f7" />
        <text x="100" y="64" textAnchor="middle" fill="white" fontSize="8" fontWeight="bold">a</text>
        <circle cx="200" cy="60" r="12" fill="#a855f7" />
        <text x="200" y="64" textAnchor="middle" fill="white" fontSize="8" fontWeight="bold">S</text>
        <circle cx="70" cy="110" r="12" fill="#f59e0b" />
        <text x="70" y="114" textAnchor="middle" fill="white" fontSize="9" fontWeight="bold">a</text>
        <circle cx="130" cy="110" r="12" fill="#f59e0b" />
        <text x="130" y="114" textAnchor="middle" fill="white" fontSize="9" fontWeight="bold">b</text>
        <circle cx="170" cy="110" r="12" fill="#f59e0b" />
        <text x="170" y="114" textAnchor="middle" fill="white" fontSize="9" fontWeight="bold">b</text>
        <circle cx="230" cy="110" r="12" fill="#f59e0b" />
        <text x="230" y="114" textAnchor="middle" fill="white" fontSize="9" fontWeight="bold">a</text>
        <text x="150" y="150" textAnchor="middle" fill="#94a3b8" fontSize="8">Parse tree for &ldquo;abba&rdquo;</text>
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 300 160" className="w-full max-w-xs mx-auto">
      <line x1="150" y1="10" x2="90" y2="60" stroke="#6366f1" strokeWidth="1.5" />
      <line x1="150" y1="10" x2="210" y2="60" stroke="#6366f1" strokeWidth="1.5" />
      <line x1="90" y1="60" x2="60" y2="110" stroke="#a855f7" strokeWidth="1.5" />
      <line x1="90" y1="60" x2="120" y2="110" stroke="#a855f7" strokeWidth="1.5" />
      <line x1="210" y1="60" x2="210" y2="110" stroke="#a855f7" strokeWidth="1.5" />
      <circle cx="150" cy="10" r="14" fill="#6366f1" />
      <text x="150" y="14" textAnchor="middle" fill="white" fontSize="9" fontWeight="bold">S</text>
      <circle cx="90" cy="60" r="12" fill="#a855f7" />
      <text x="90" y="64" textAnchor="middle" fill="white" fontSize="8" fontWeight="bold">a</text>
      <circle cx="210" cy="60" r="12" fill="#a855f7" />
      <text x="210" y="64" textAnchor="middle" fill="white" fontSize="8" fontWeight="bold">S</text>
      <circle cx="60" cy="110" r="12" fill="#f59e0b" />
      <text x="60" y="114" textAnchor="middle" fill="white" fontSize="9" fontWeight="bold">a</text>
      <circle cx="120" cy="110" r="12" fill="#f59e0b" />
      <text x="120" y="114" textAnchor="middle" fill="white" fontSize="9" fontWeight="bold">b</text>
      <text x="150" y="130" textAnchor="middle" fill="#94a3b8" fontSize="8">Derivation: S → aSb → aabb</text>
    </svg>
  );
}

export default function ContextFreeGrammarPage() {
  const [expandedExample, setExpandedExample] = useState<number | null>(null);

  const examples = [
    { title: "Palindromes", grammar: "S → aSa | bSb | a | b | ε", desc: "Generates all palindromes over {a, b}", derivation: "S ⇒ aSa ⇒ abSba ⇒ abba" },
    { title: "aⁿbⁿ", grammar: "S → aSb | ε", desc: "Generates { aⁿbⁿ | n ≥ 0 }", derivation: "S ⇒ aSb ⇒ aaSbb ⇒ aabb" },
    { title: "Balanced Parentheses", grammar: "S → SS | (S) | ε", desc: "Generates all balanced parentheses strings", derivation: "S ⇒ (S) ⇒ (SS) ⇒ (()())" },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-5xl px-4 py-6">
        <nav className="flex items-center gap-2 text-xs text-slate-400 mb-6">
          <Link href="/tools" className="hover:text-indigo-600 transition-colors">Tools</Link>
          <span>/</span>
          <Link href="/tools/theory-of-computing" className="hover:text-indigo-600 transition-colors">Theory of Comp.</Link>
          <span>/</span>
          <span className="text-slate-700 font-medium">CFG &amp; PDA</span>
        </nav>

        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-md">
            <FileType size={20} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Context-Free Grammar &amp; PDA</h1>
            <p className="text-xs text-slate-500">Context-free languages, parse trees, and pushdown automata</p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-4">
            <div className="rounded-xl bg-white border border-slate-200 shadow-sm p-4">
              <h2 className="flex items-center gap-1.5 text-sm font-bold text-slate-700 mb-2"><BookOpen size={16} className="text-indigo-500" /> CFG Definition</h2>
              <p className="text-xs text-slate-600 mb-3 leading-relaxed">A context-free grammar is a 4-tuple <strong>G = (V, Σ, R, S)</strong> where:</p>
              <ul className="space-y-1 text-xs text-slate-600">
                <li><strong className="text-indigo-700">V</strong> — Finite set of non-terminal symbols (variables)</li>
                <li><strong className="text-indigo-700">Σ</strong> — Finite set of terminal symbols (alphabet)</li>
                <li><strong className="text-indigo-700">R</strong> — Finite set of production rules A → α</li>
                <li><strong className="text-indigo-700">S</strong> — Start symbol (S ∈ V)</li>
              </ul>
            </div>

            <div className="rounded-xl bg-white border border-slate-200 shadow-sm p-4">
              <h2 className="flex items-center gap-1.5 text-sm font-bold text-slate-700 mb-3"><TreePine size={16} className="text-indigo-500" /> Examples</h2>
              <div className="space-y-2">
                {examples.map((ex, i) => (
                  <div key={i} className="rounded-lg border border-slate-200 overflow-hidden">
                    <button onClick={() => setExpandedExample(expandedExample === i ? null : i)} className="flex items-center justify-between w-full px-3 py-2 bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer">
                      <span className="text-xs font-semibold text-slate-700">{ex.title}</span>
                      {expandedExample === i ? <ChevronUp size={14} className="text-slate-400" /> : <ChevronDown size={14} className="text-slate-400" />}
                    </button>
                    {expandedExample === i && (
                      <div className="p-3 space-y-2">
                        <div className="rounded bg-indigo-50 p-2 font-mono text-xs text-indigo-800">{ex.grammar}</div>
                        <p className="text-xs text-slate-600">{ex.desc}</p>
                        <p className="text-xs text-slate-600">Derivation: <span className="font-mono text-indigo-700">{ex.derivation}</span></p>
                        <ParseTreeSVG type={ex.title === "Palindromes" ? "palindrome" : "anbn"} />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-xl bg-white border border-slate-200 shadow-sm p-4">
              <h2 className="flex items-center gap-1.5 text-sm font-bold text-slate-700 mb-2"><GitBranch size={16} className="text-indigo-500" /> Pushdown Automata (PDA)</h2>
              <p className="text-xs text-slate-600 leading-relaxed mb-2">A PDA is a finite automaton augmented with a stack. It consists of a 7-tuple <strong>(Q, Σ, Γ, δ, q₀, Z₀, F)</strong> where the transition function δ reads input and stack top to determine the next state and stack operation. PDAs recognize exactly the context-free languages, and every CFG can be converted to an equivalent PDA (and vice versa).</p>
              <div className="rounded-lg bg-slate-50 p-3 font-mono text-xs text-slate-700 leading-relaxed border border-slate-200">
                δ(q₁, a, X) = (q₂, γ) means:<br />
                In state q₁, reading input &apos;a&apos; with stack top X,<br />
                transition to q₂ and replace X with γ.
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-xl bg-white border border-slate-200 shadow-sm p-4">
              <h2 className="flex items-center gap-1.5 text-sm font-bold text-slate-700 mb-2"><Layers size={16} className="text-indigo-500" /> Chomsky Normal Form (CNF)</h2>
              <p className="text-xs text-slate-600 mb-3 leading-relaxed">A CFG is in Chomsky Normal Form if every production is of the form:</p>
              <div className="rounded-lg bg-purple-50 p-3 font-mono text-xs text-purple-800 border border-purple-100 mb-3">
                A → BC &nbsp;&nbsp;(two non-terminals)<br />
                A → a &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(single terminal)
              </div>
              <p className="text-xs text-slate-600 mb-2">Conversion steps to CNF:</p>
              <ol className="space-y-1 text-xs text-slate-600 list-decimal list-inside">
                {CNF_STEPS.map((step, i) => (
                  <li key={i}>{step}</li>
                ))}
              </ol>
            </div>

            <div className="rounded-xl bg-white border border-slate-200 shadow-sm p-4">
              <h2 className="flex items-center gap-1.5 text-sm font-bold text-slate-700 mb-2"><FileType size={16} className="text-indigo-500" /> Derivation Steps</h2>
              <p className="text-xs text-slate-600 mb-2 leading-relaxed">A derivation replaces non-terminals using production rules until only terminals remain. Common derivation strategies:</p>
              <div className="space-y-2">
                <div className="rounded-lg bg-indigo-50 p-2.5">
                  <p className="text-[11px] font-semibold text-indigo-800">Leftmost Derivation</p>
                  <p className="text-[10px] text-indigo-600">Always replace the leftmost non-terminal first</p>
                </div>
                <div className="rounded-lg bg-purple-50 p-2.5">
                  <p className="text-[11px] font-semibold text-purple-800">Rightmost Derivation</p>
                  <p className="text-[10px] text-purple-600">Always replace the rightmost non-terminal first</p>
                </div>
                <p className="text-[10px] text-slate-500">A grammar is <strong>ambiguous</strong> if a string has more than one parse tree (equivalently, more than one leftmost derivation).</p>
              </div>
            </div>

            <div className="rounded-xl bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-100 p-4">
              <h3 className="text-xs font-bold text-slate-700 mb-1">Key Equivalence</h3>
              <p className="text-[11px] text-slate-600 leading-relaxed">CFGs and PDAs are equivalent in expressive power: for every CFG there exists a PDA that accepts exactly the strings generated by the grammar, and for every PDA there exists a CFG that generates the language accepted by the PDA. This is a foundational result in formal language theory.</p>
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
