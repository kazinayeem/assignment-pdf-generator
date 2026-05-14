"use client";

import Link from "next/link";
import { Home, ChevronRight } from "lucide-react";
import { Section, InfoCard } from "../components";

const TOPICS = [
  { title: "Basic Recursion", desc: "Factorial, Fibonacci, Tower of Hanoi" },
  { title: "Backtracking", desc: "N-Queens, Sudoku, Permutations" },
  { title: "Divide & Conquer", desc: "Merge Sort, Quick Sort, Binary Search" },
  { title: "Tail Recursion", desc: "Optimization techniques for recursive functions" },
  { title: "Recursive Structures", desc: "Trees, Graphs, Linked Lists" },
  { title: "Call Stack Analysis", desc: "Understanding recursion depth and complexity" },
];

export default function RecursionPage() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      <div className="flex items-center gap-2 mb-6 text-xs text-slate-500">
        <Link href="/tools/algorithms" className="text-indigo-600 no-underline flex items-center gap-1.5 hover:text-indigo-800 transition">
          <Home size={16} /> Algorithms
        </Link>
        <ChevronRight size={16} />
        <span className="text-slate-900 font-semibold">Recursion</span>
      </div>

      <div className="mb-10">
        <h1 className="text-4xl font-extrabold text-slate-900 mb-3">🔄 Recursion</h1>
        <p className="text-base text-slate-500 leading-relaxed max-w-xl">
          Solve problems by breaking them into smaller subproblems. Master base cases, recursive calls, and call stack visualization.
        </p>
      </div>

      <Section title="Coming Soon">
        <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-xl p-10 text-white text-center">
          <div className="text-6xl mb-4">🚀</div>
          <h2 className="text-xl font-bold mb-2">Page Under Development</h2>
          <p className="text-white/80 mb-6 max-w-md mx-auto text-sm">
            We're building comprehensive content for Recursion algorithms including visualizers, code examples, and interview questions.
          </p>
          <Link href="/tools/algorithms" className="no-underline">
            <button className="bg-white text-indigo-600 border-none px-8 py-3 rounded-xl font-semibold cursor-pointer inline-flex items-center gap-2 text-sm hover:bg-indigo-50 transition">
              ← Back to Algorithms Hub
            </button>
          </Link>
        </div>
      </Section>

      <Section title="Topics Coming Soon">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {TOPICS.map((topic, i) => (
            <div key={i} className="bg-slate-50 rounded-xl border border-slate-200 p-5">
              <div className="text-2xl mb-3">📚</div>
              <h3 className="text-sm font-bold text-slate-900 mb-2">{topic.title}</h3>
              <p className="text-xs text-slate-500">{topic.desc}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Related Topics">
        <div className="grid sm:grid-cols-3 gap-4">
          <Link href="/tools/algorithms/dynamic-programming" className="no-underline">
            <div className="bg-white rounded-xl border border-slate-200 p-5 cursor-pointer transition-all hover:border-indigo-500 hover:shadow-lg">
              <h3 className="text-base font-bold text-indigo-600 mb-2">🧩 Dynamic Programming</h3>
              <p className="text-xs text-slate-500">Learn memoization and tabulation. Often combined with recursion.</p>
            </div>
          </Link>
          <Link href="/tools/algorithms/tree" className="no-underline">
            <div className="bg-white rounded-xl border border-slate-200 p-5 cursor-pointer transition-all hover:border-purple-500 hover:shadow-lg">
              <h3 className="text-base font-bold text-purple-600 mb-2">🌳 Tree Algorithms</h3>
              <p className="text-xs text-slate-500">Recursively traverse and manipulate tree structures.</p>
            </div>
          </Link>
          <Link href="/tools/algorithms/backtracking" className="no-underline">
            <div className="bg-white rounded-xl border border-slate-200 p-5 cursor-pointer transition-all hover:border-pink-500 hover:shadow-lg">
              <h3 className="text-base font-bold text-pink-600 mb-2">↩️ Backtracking</h3>
              <p className="text-xs text-slate-500">Recursively explore all solution possibilities.</p>
            </div>
          </Link>
        </div>
      </Section>
    </div>
  );
}
