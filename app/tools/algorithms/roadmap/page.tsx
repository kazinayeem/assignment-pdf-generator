"use client";

import { useState } from "react";
import Link from "next/link";
import { Home, ChevronRight, CheckCircle, Circle, Lock, Trophy, ArrowRight, BookOpen } from "lucide-react";
import { useAlgoStore } from "@/lib/algo-store";

const PATHS = [
  {
    id: "beginner",
    title: "Beginner Path",
    desc: "Start here if you're new to algorithms. Learn fundamental concepts step by step.",
    icon: "🌱",
    color: "from-green-500 to-emerald-600",
    modules: [
      { id: "sorting", name: "Sorting Algorithms", href: "/tools/algorithms/sorting", desc: "Bubble, Merge, Quick, Heap Sort" },
      { id: "searching", name: "Searching", href: "/tools/algorithms/searching", desc: "Linear, Binary, Jump Search" },
      { id: "two-pointer", name: "Two Pointer", href: "/tools/algorithms/two-pointer", desc: "Two Sum, Remove Duplicates" },
      { id: "recursion", name: "Recursion", href: "/tools/algorithms/recursion", desc: "Factorial, Fibonacci, Tower of Hanoi" },
      { id: "binary-search", name: "Binary Search", href: "/tools/algorithms/binary-search", desc: "Basic, First Occurrence, Rotated Array" },
    ],
  },
  {
    id: "interview",
    title: "Interview Prep",
    desc: "Prepare for coding interviews with the most frequently tested patterns.",
    icon: "💼",
    color: "from-blue-500 to-indigo-600",
    modules: [
      { id: "two-pointer", name: "Two Pointer", href: "/tools/algorithms/two-pointer", desc: "3Sum, Container With Most Water" },
      { id: "sliding-window", name: "Sliding Window", href: "/tools/algorithms/sliding-window", desc: "Min Window, Longest Substring" },
      { id: "dynamic-programming", name: "Dynamic Programming", href: "/tools/algorithms/dynamic-programming", desc: "Knapsack, LCS, Coin Change" },
      { id: "graph", name: "Graph Algorithms", href: "/tools/algorithms/graph", desc: "BFS, DFS, Dijkstra, Topological Sort" },
      { id: "backtracking", name: "Backtracking", href: "/tools/algorithms/backtracking", desc: "N-Queens, Sudoku, Permutations" },
    ],
  },
  {
    id: "advanced",
    title: "Advanced Mastery",
    desc: "Deep dive into complex algorithms and advanced problem-solving techniques.",
    icon: "🏆",
    color: "from-purple-500 to-pink-600",
    modules: [
      { id: "graph", name: "Graph Algorithms", href: "/tools/algorithms/graph", desc: "Kruskal, MST, Advanced Graph Theory" },
      { id: "backtracking", name: "Backtracking", href: "/tools/algorithms/backtracking", desc: "Combination Sum, Subsets, Advanced" },
      { id: "trie", name: "Trie Algorithms", href: "/tools/algorithms/trie", desc: "Autocomplete, Max XOR, Word Break" },
      { id: "dynamic-programming", name: "Advanced DP", href: "/tools/algorithms/dynamic-programming", desc: "Edit Distance, Advanced DP Patterns" },
      { id: "heap", name: "Heap & Priority Queue", href: "/tools/algorithms/heap", desc: "Heap Sort, Kth Largest, Merge K Sorted" },
    ],
  },
];

const MODULES_FLAT = PATHS.flatMap((p) => p.modules.map((m) => ({ ...m, pathId: p.id })));

export default function RoadmapPage() {
  const [selectedPath, setSelectedPath] = useState("beginner");
  const { completedTopics, updateLearningPath, completeTopic, isTopicCompleted, getLearningPath } = useAlgoStore();
  const path = PATHS.find((p) => p.id === selectedPath)!;
  const progress = getLearningPath(selectedPath);

  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      <div className="flex items-center gap-2 mb-6 text-xs text-slate-500">
        <Link href="/tools/algorithms" className="text-indigo-600 no-underline flex items-center gap-1.5 hover:text-indigo-800 transition"><Home size={16} /> Algorithms</Link>
        <ChevronRight size={16} /><span className="text-slate-900 font-semibold">Learning Roadmap</span>
      </div>

      <div className="mb-10">
        <h1 className="text-4xl font-extrabold text-slate-900 mb-3">🗺️ Learning Roadmap</h1>
        <p className="text-base text-slate-500 leading-relaxed max-w-xl">Follow a structured path to master algorithms from fundamentals to advanced concepts.</p>
      </div>

      {/* Path Selector */}
      <div className="flex gap-3 flex-wrap mb-10">
        {PATHS.map((p) => (
          <button key={p.id} onClick={() => setSelectedPath(p.id)}
            className={`px-5 py-3 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-2 ${
              selectedPath === p.id ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/30" : "bg-white text-slate-600 border border-slate-200 hover:border-indigo-400"
            }`}
          >
            <span>{p.icon}</span> {p.title}
          </button>
        ))}
      </div>

      {/* Current Path Overview */}
      <div className={`bg-gradient-to-br ${path.color} rounded-2xl p-8 text-white mb-10`}>
        <div className="text-4xl mb-3">{path.icon}</div>
        <h2 className="text-2xl font-extrabold mb-2">{path.title}</h2>
        <p className="text-white/90 mb-6 max-w-lg text-sm">{path.desc}</p>
        <div className="flex items-center gap-4">
          <span className="text-3xl font-bold">{progress?.completedModules.length || 0}</span>
          <span className="text-white/80 text-sm">of {path.modules.length} modules completed</span>
        </div>
        <div className="mt-4 bg-white/20 rounded-full h-2 overflow-hidden">
          <div className="bg-white h-full rounded-full transition-all" style={{ width: `${Math.round(((progress?.completedModules.length || 0) / path.modules.length) * 100)}%` }} />
        </div>
      </div>

      {/* Module List */}
      <div className="space-y-4">
        {path.modules.map((mod, idx) => {
          const completed = isTopicCompleted(mod.id);
          const locked = idx > 0 && !isTopicCompleted(path.modules[idx - 1].id) && false;
          return (
            <Link key={mod.id} href={locked ? "#" : mod.href} className="no-underline block">
              <div className={`bg-white rounded-xl border-2 p-5 transition-all ${
                completed ? "border-green-400 bg-green-50/30" : "border-slate-200 hover:border-indigo-400 hover:shadow-lg"
              }`}>
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    completed ? "bg-green-100" : locked ? "bg-slate-100" : "bg-indigo-100"
                  }`}>
                    {completed ? <CheckCircle size={20} className="text-green-600" /> :
                     locked ? <Lock size={16} className="text-slate-400" /> :
                     <span className="text-indigo-600 font-bold text-sm">{idx + 1}</span>}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className={`text-sm font-bold ${completed ? "text-green-700" : "text-slate-900"}`}>{mod.name}</h3>
                    <p className="text-xs text-slate-500 mt-0.5">{mod.desc}</p>
                  </div>
                  <div className="text-indigo-600 shrink-0">
                    <ArrowRight size={16} />
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* All Paths Overview */}
      <div className="mt-14">
        <h2 className="text-xl font-extrabold text-slate-900 mb-6">All Learning Paths</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {PATHS.map((p) => {
            const pProgress = getLearningPath(p.id);
            return (
              <button key={p.id} onClick={() => setSelectedPath(p.id)}
                className="bg-white rounded-2xl p-6 border border-slate-200 text-left transition-all hover:shadow-lg hover:border-indigo-400 cursor-pointer"
              >
                <div className="text-3xl mb-3">{p.icon}</div>
                <h3 className="text-base font-bold text-slate-900 mb-2">{p.title}</h3>
                <p className="text-xs text-slate-500 mb-4">{p.modules.length} modules</p>
                <div className="bg-slate-200 h-1.5 rounded-full overflow-hidden">
                  <div className={`bg-gradient-to-r ${p.color} h-full rounded-full transition-all`} style={{ width: `${Math.round(((pProgress?.completedModules.length || 0) / p.modules.length) * 100)}%` }} />
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
