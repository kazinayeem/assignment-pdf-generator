"use client";

import { useState } from "react";
import Link from "next/link";
import { Infinity, HelpCircle, CheckCircle2, XCircle, BookOpen, ArrowRight } from "lucide-react";

const LANGUAGES = [
  {
    name: "aⁿbⁿ",
    desc: "L = { aⁿbⁿ | n ≥ 0 }",
    isRegular: false,
    isCFL: true,
    proof: "Assume L is regular with pumping length p. Choose s = aᵖbᵖ ∈ L where |s| ≥ p. By PL, s = xyz with |xy| ≤ p, |y| ≥ 1, and xyⁱz ∈ L for all i ≥ 0. Since |xy| ≤ p, y consists only of a's. Then xy²z = aᵖ⁺|ʸ|bᵖ ∉ L, contradicting the PL. Hence L is not regular.",
  },
  {
    name: "ww",
    desc: "L = { ww | w ∈ {a,b}* }",
    isRegular: false,
    isCFL: false,
    proof: "Assume L is context-free with pumping length p. Choose s = aᵖbᵖaᵖbᵖ ∈ L. By CFL-PL, s = uvxyz with |vxy| ≤ p, |vy| ≥ 1, and uvⁱxyⁱz ∈ L for all i. Since |vxy| ≤ p, v and y must lie within a window of p symbols. Pumping changes the count of one segment independently, breaking the ww structure. Hence L is not context-free.",
  },
  {
    name: "aⁿ (prime)",
    desc: "L = { aᵖ | p is prime }",
    isRegular: false,
    isCFL: false,
    proof: "Assume L is regular with pumping length p. Choose a prime q ≥ p and s = aᵠ ∈ L. By PL, s = xyz with |y| ≥ 1 and xyⁱz ∈ L for all i. Let |y| = k. Then xyⁱz = aᵠ⁺⁽ⁱ⁻¹⁾ᵏ. For i = q+1, length = q + qk = q(1+k) which is composite, so xyⁱz ∉ L. Contradiction. Hence L is not regular.",
  },
  {
    name: "aⁿbⁿcⁿ",
    desc: "L = { aⁿbⁿcⁿ | n ≥ 0 }",
    isRegular: false,
    isCFL: false,
    proof: "Assume L is context-free with pumping length p. Choose s = aᵖbᵖcᵖ ∈ L. By CFL-PL, s = uvxyz with |vxy| ≤ p, |vy| ≥ 1. Since |vxy| ≤ p, v and y can touch at most two of the three symbols. Pumping up or down will unbalance the counts, so uvⁱxyⁱz ∉ L for some i. Hence L is not context-free.",
  },
];

const INTERVIEW_QUESTIONS = [
  { q: "State the Pumping Lemma for regular languages.", a: "If L is a regular language, then there exists a pumping length p ≥ 1 such that every string s ∈ L with |s| ≥ p can be written as s = xyz satisfying: (1) |xy| ≤ p, (2) |y| ≥ 1, (3) xyⁱz ∈ L for all i ≥ 0. The lemma is used to prove that certain languages are not regular by contradiction." },
  { q: "How is the Pumping Lemma for CFLs different from the one for regular languages?", a: "The CFL Pumping Lemma states that for any CFL L, there exists p such that any s ∈ L with |s| ≥ p can be written as s = uvxyz satisfying: (1) |vxy| ≤ p, (2) |vy| ≥ 1, (3) uvⁱxyⁱz ∈ L for all i ≥ 0. The key difference is that strings are decomposed into five parts (not three), and the pumped sections (v and y) can appear in different positions." },
  { q: "Why doesn't the Pumping Lemma prove a language is regular?", a: "The Pumping Lemma is a necessary condition for regularity, not a sufficient one. If a language satisfies the PL, it might still be non-regular. The PL only provides a way to prove non-regularity: if a language fails the condition, it cannot be regular. The converse (satisfying PL ⇒ regular) is false — there exist non-regular languages that satisfy the PL." },
];

export default function PumpingLemmaPage() {
  const [selected, setSelected] = useState(0);
  const [pValue, setPValue] = useState(3);
  const [decomposed, setDecomposed] = useState(false);
  const lang = LANGUAGES[selected];

  const handleSelect = (i: number) => {
    setSelected(i);
    setDecomposed(false);
    setPValue(3);
  };

  const handleDecompose = () => {
    setDecomposed(true);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-5xl px-4 py-6">
        <nav className="flex items-center gap-2 text-xs text-slate-400 mb-6">
          <Link href="/tools" className="hover:text-indigo-600 transition-colors">Tools</Link>
          <span>/</span>
          <Link href="/tools/theory-of-computing" className="hover:text-indigo-600 transition-colors">Theory of Comp.</Link>
          <span>/</span>
          <span className="text-slate-700 font-medium">Pumping Lemma</span>
        </nav>

        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-md">
            <Infinity size={20} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Pumping Lemma</h1>
            <p className="text-xs text-slate-500">Prove languages are non-regular and non-context-free</p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-4">
            <div className="rounded-xl bg-white border border-slate-200 shadow-sm p-4">
              <h2 className="flex items-center gap-1.5 text-sm font-bold text-slate-700 mb-2"><BookOpen size={16} className="text-indigo-500" /> Pumping Lemma (Regular Languages)</h2>
              <div className="rounded-lg bg-indigo-50 p-3 font-mono text-xs text-indigo-900 leading-relaxed border border-indigo-100">
                Let L be a regular language. Then ∃ p ≥ 1 (pumping length) such that<br />
                ∀ s ∈ L with |s| ≥ p, s can be written as s = xyz where:<br />
                <span className="text-indigo-700">1. |xy| ≤ p</span><br />
                <span className="text-indigo-700">2. |y| ≥ 1</span><br />
                <span className="text-indigo-700">3. xyⁱz ∈ L for all i ≥ 0</span>
              </div>
            </div>

            <div className="rounded-xl bg-white border border-slate-200 shadow-sm p-4">
              <h2 className="flex items-center gap-1.5 text-sm font-bold text-slate-700 mb-2"><BookOpen size={16} className="text-purple-500" /> Pumping Lemma (Context-Free Languages)</h2>
              <div className="rounded-lg bg-purple-50 p-3 font-mono text-xs text-purple-900 leading-relaxed border border-purple-100">
                Let L be a context-free language. Then ∃ p ≥ 1 such that<br />
                ∀ s ∈ L with |s| ≥ p, s = uvxyz where:<br />
                <span className="text-purple-700">1. |vxy| ≤ p</span><br />
                <span className="text-purple-700">2. |vy| ≥ 1</span><br />
                <span className="text-purple-700">3. uvⁱxyⁱz ∈ L for all i ≥ 0</span>
              </div>
            </div>

            <div className="rounded-xl bg-white border border-slate-200 shadow-sm p-4">
              <h2 className="flex items-center gap-1.5 text-sm font-bold text-slate-700 mb-3"><Infinity size={16} className="text-indigo-500" /> Interactive Proof Assistant</h2>
              <div className="space-y-3">
                <div className="flex flex-wrap gap-1.5">
                  {LANGUAGES.map((l, i) => (
                    <button key={l.name} onClick={() => handleSelect(i)} className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all cursor-pointer ${i === selected ? "bg-indigo-600 text-white shadow-sm" : "bg-slate-100 text-slate-600 hover:bg-indigo-50 hover:text-indigo-700"}`}>
                      {l.name}
                    </button>
                  ))}
                </div>
                <div className="rounded-lg bg-slate-50 p-3">
                  <p className="text-xs font-semibold text-slate-700 mb-1">{lang.desc}</p>
                  <div className="flex items-center gap-2 text-[11px] mb-2">
                    <span className="text-slate-500">Regular:</span>
                    {lang.isRegular ? <CheckCircle2 size={14} className="text-green-500" /> : <XCircle size={14} className="text-red-500" />}
                    <span className="text-slate-500 ml-2">Context-Free:</span>
                    {lang.isCFL ? <CheckCircle2 size={14} className="text-green-500" /> : <XCircle size={14} className="text-red-500" />}
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <label className="text-[10px] text-slate-500 font-medium">Choose p:</label>
                    <input type="number" min={1} max={10} value={pValue} onChange={(e) => setPValue(Number(e.target.value))} className="w-16 rounded border border-slate-200 px-2 py-1 text-xs font-mono text-center focus:border-indigo-400 focus:outline-none" />
                  </div>
                  <button onClick={handleDecompose} className="flex items-center gap-1 rounded-lg bg-indigo-600 text-white px-3 py-1.5 text-xs font-medium hover:bg-indigo-700 transition-colors cursor-pointer">
                    Decompose s = a{pValue >= 10 ? "¹⁰" : "ᵖ".replace("ᵖ", String(pValue).split("").map(d => "⁰¹²³⁴⁵⁶⁷⁸⁹"[Number(d)]).join(""))}b{pValue >= 10 ? "¹⁰" : "ᵖ".replace("ᵖ", String(pValue).split("").map(d => "⁰¹²³⁴⁵⁶⁷⁸⁹"[Number(d)]).join(""))} <ArrowRight size={12} />
                  </button>
                </div>
                {decomposed && (
                  <div className="rounded-lg border border-indigo-100 bg-indigo-50/50 p-3">
                    <h4 className="text-xs font-semibold text-slate-700 mb-1">Proof for {lang.name}</h4>
                    <p className="text-[11px] text-slate-600 leading-relaxed">{lang.proof}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {LANGUAGES.map((l, i) => (
              <div key={l.name} className={`rounded-xl border p-4 transition-all ${i === selected ? "border-indigo-200 bg-white shadow-sm" : "border-slate-200 bg-white/60"}`}>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-sm text-slate-800 font-mono">{l.name}</h3>
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] px-1.5 py-0.5 rounded ${l.isRegular ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
                      {l.isRegular ? "REG" : "¬REG"}
                    </span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded ${l.isCFL ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
                      {l.isCFL ? "CFL" : "¬CFL"}
                    </span>
                  </div>
                </div>
                <p className="text-xs text-slate-500 font-mono">{l.desc}</p>
              </div>
            ))}

            <div className="rounded-xl bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-100 p-4">
              <h3 className="text-xs font-bold text-slate-700 mb-1">Key Insight</h3>
              <p className="text-[11px] text-slate-600 leading-relaxed">The Pumping Lemma captures the idea that any regular/context-free language has a &ldquo;memory limitation.&rdquo; If a language requires counting beyond what a finite automaton or PDA can track, it cannot be regular/context-free. This makes the PL a powerful tool for proving lower bounds on language complexity.</p>
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
