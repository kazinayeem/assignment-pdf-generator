"use client";

import Link from "next/link";
import { Home, ChevronRight, ArrowRight, CheckCircle } from "lucide-react";
import { useAlgoStore } from "@/lib/algo-store";

const MODULES = [
  { id: "graph", name: "Graph Algorithms", href: "/tools/algorithms/graph", desc: "Kruskal, MST, Advanced Graph Theory", icon: "🕸️" },
  { id: "backtracking", name: "Backtracking", href: "/tools/algorithms/backtracking", desc: "Combination Sum, Subsets, Advanced", icon: "↩️" },
  { id: "trie", name: "Trie Algorithms", href: "/tools/algorithms/trie", desc: "Autocomplete, Max XOR, Word Break", icon: "🌲" },
  { id: "dynamic-programming", name: "Advanced DP", href: "/tools/algorithms/dynamic-programming", desc: "Edit Distance, Advanced DP Patterns", icon: "🧩" },
  { id: "heap", name: "Heap & Priority Queue", href: "/tools/algorithms/heap", desc: "Heap Sort, Kth Largest, Merge K Sorted", icon: "📚" },
];

export default function AdvancedMasteryPage() {
  const { isTopicCompleted, addActivity } = useAlgoStore();

  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      <div className="flex items-center gap-2 mb-6 text-xs text-slate-500">
        <Link href="/tools/algorithms" className="text-indigo-600 no-underline flex items-center gap-1.5 hover:text-indigo-800 transition"><Home size={16} /> Algorithms</Link>
        <ChevronRight size={16} />
        <Link href="/tools/algorithms/roadmap" className="text-indigo-600 no-underline hover:text-indigo-800 transition">Roadmap</Link>
        <ChevronRight size={16} />
        <span className="text-slate-900 font-semibold">Advanced Mastery</span>
      </div>

      <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl p-8 text-white mb-10">
        <div className="text-4xl mb-3">🏆</div>
        <h1 className="text-3xl font-extrabold mb-2">Advanced Mastery</h1>
        <p className="text-white/90 max-w-lg text-sm mb-6">Deep dive into complex algorithms and advanced problem-solving techniques for competitive programming and system design.</p>
        <Link href="/tools/algorithms/roadmap" className="inline-flex items-center gap-2 bg-white/20 border border-white/30 px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-white/30 transition no-underline text-white">
          View Full Roadmap <ArrowRight size={16} />
        </Link>
      </div>

      <div className="space-y-4">
        {MODULES.map((mod, idx) => {
          const completed = isTopicCompleted(mod.id);
          return (
            <Link key={mod.id} href={mod.href} onClick={() => addActivity(mod.id, "view")} className="no-underline block">
              <div className={`bg-white rounded-xl border-2 p-5 transition-all hover:shadow-lg hover:border-indigo-400 ${completed ? "border-green-400 bg-green-50/30" : "border-slate-200"}`}>
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${completed ? "bg-green-100" : "bg-indigo-100"}`}>
                    {completed ? <CheckCircle size={20} className="text-green-600" /> : <span className="text-indigo-600 font-bold text-sm">{idx + 1}</span>}
                  </div>
                  <span className="text-2xl shrink-0">{mod.icon}</span>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-bold text-slate-900">{mod.name}</h3>
                    <p className="text-xs text-slate-500 mt-0.5">{mod.desc}</p>
                  </div>
                  <ArrowRight size={16} className="text-indigo-600 shrink-0" />
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      <div className="mt-10 bg-gradient-to-br from-indigo-600 to-blue-700 rounded-xl p-6 text-white">
        <h3 className="text-lg font-bold mb-3">📚 Keep Learning</h3>
        <p className="text-white/90 mb-4 text-sm">Explore quick resources for interview preparation:</p>
        <div className="flex gap-3 flex-wrap">
          <Link href="/tools/algorithms/interview-patterns" className="inline-flex items-center gap-2 bg-white/20 border border-white/30 px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-white/30 transition no-underline text-white">
            Interview Patterns <ArrowRight size={16} />
          </Link>
          <Link href="/tools/algorithms/practice-problems" className="inline-flex items-center gap-2 bg-white/20 border border-white/30 px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-white/30 transition no-underline text-white">
            Practice Problems <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
}
