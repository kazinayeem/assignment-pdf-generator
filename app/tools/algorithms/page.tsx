"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, BookOpen, Zap, Target, TrendingUp } from "lucide-react";

const TOPICS = [
  { id: "sorting", label: "Sorting Algorithms", icon: "📊", desc: "Master sorting techniques", algorithms: 6, difficulty: "Beginner" },
  { id: "searching", label: "Searching", icon: "🔍", desc: "Learn search patterns", algorithms: 3, difficulty: "Beginner" },
  { id: "recursion", label: "Recursion", icon: "🔄", desc: "Think recursively", algorithms: 5, difficulty: "Beginner" },
  { id: "dynamic-programming", label: "Dynamic Programming", icon: "🧩", desc: "Optimize with memoization", algorithms: 8, difficulty: "Advanced" },
  { id: "greedy", label: "Greedy Algorithms", icon: "💰", desc: "Make optimal choices", algorithms: 5, difficulty: "Intermediate" },
  { id: "graph", label: "Graph Algorithms", icon: "🕸️", desc: "Navigate complex structures", algorithms: 10, difficulty: "Intermediate" },
  { id: "backtracking", label: "Backtracking", icon: "↩️", desc: "Explore all solutions", algorithms: 5, difficulty: "Advanced" },
  { id: "tree", label: "Tree Algorithms", icon: "🌳", desc: "Traverse and manipulate trees", algorithms: 8, difficulty: "Intermediate" },
  { id: "string", label: "String Algorithms", icon: "📝", desc: "Pattern matching & manipulation", algorithms: 7, difficulty: "Intermediate" },
  { id: "sliding-window", label: "Sliding Window", icon: "🪟", desc: "Efficient subsequence search", algorithms: 6, difficulty: "Intermediate" },
  { id: "two-pointer", label: "Two Pointer", icon: "👉", desc: "Traverse with two pointers", algorithms: 5, difficulty: "Beginner" },
  { id: "heap", label: "Heap & Priority Queue", icon: "📚", desc: "Priority-based operations", algorithms: 6, difficulty: "Intermediate" },
  { id: "trie", label: "Trie Algorithms", icon: "🌲", desc: "Efficient prefix search", algorithms: 4, difficulty: "Advanced" },
  { id: "binary-search", label: "Binary Search", icon: "🎯", desc: "Divide and conquer search", algorithms: 6, difficulty: "Beginner" },
];

const STATS = [
  { label: "Algorithms", value: "100+", icon: <BookOpen size={20} /> },
  { label: "Visualizers", value: "30+", icon: <Zap size={20} /> },
  { label: "Interview Qs", value: "500+", icon: <Target size={20} /> },
  { label: "Complexity Guide", value: "Complete", icon: <TrendingUp size={20} /> },
];

const LEARNING_PATHS = [
  { title: "Beginner Path", items: ["Sorting", "Searching", "Arrays & Strings"], progress: 45 },
  { title: "Interview Prep", items: ["Two Pointer", "Sliding Window", "DP"], progress: 60 },
  { title: "Advanced Mastery", items: ["Graph", "Backtracking", "Trie"], progress: 25 },
];

const RESOURCES = [
  { title: "Time Complexity Cheatsheet", desc: "Quick reference for Big O notation", icon: "📊" },
  { title: "Space Complexity Guide", desc: "Understand memory usage patterns", icon: "💾" },
  { title: "Interview Patterns", desc: "Common coding interview patterns", icon: "💡" },
  { title: "Practice Problems", desc: "Curated problem sets by difficulty", icon: "🎯" },
];

export default function AlgorithmsPage() {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-500 px-6 py-16 text-white text-center">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight">
            Master Algorithms
          </h1>
          <p className="text-lg mb-8 text-white/90 leading-relaxed">
            Interactive visualizations, real-world applications, and interview preparation for computer science students
          </p>
          <div className="flex gap-4 justify-center flex-wrap mb-12">
            <button className="bg-white text-indigo-600 border-none px-8 py-3 rounded-xl font-semibold cursor-pointer text-sm flex items-center gap-2 hover:shadow-lg transition">
              Start Learning <ArrowRight size={16} />
            </button>
            <button className="bg-white/20 text-white border-2 border-white px-7 py-3 rounded-xl font-semibold cursor-pointer text-sm hover:bg-white/30 transition">
              View Roadmap
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {STATS.map((stat) => (
              <div key={stat.label} className="bg-white/15 backdrop-blur-md p-5 rounded-xl border border-white/20">
                <div className="flex justify-center mb-2 text-white/90">{stat.icon}</div>
                <div className="text-2xl font-bold mb-1">{stat.value}</div>
                <div className="text-xs text-white/80">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Learning Paths */}
        <div className="mb-14">
          <h2 className="text-2xl font-extrabold text-slate-900 mb-6">Guided Learning Paths</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {LEARNING_PATHS.map((path) => (
              <div key={path.title} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                <h3 className="text-base font-bold text-slate-900 mb-3">{path.title}</h3>
                <ul className="flex flex-col gap-2 mb-4">
                  {path.items.map((item) => (
                    <li key={item} className="text-xs text-slate-500 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
                <div className="mb-3">
                  <div className="bg-slate-200 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-gradient-to-r from-indigo-500 to-purple-500 h-full rounded-full transition-all" style={{ width: `${path.progress}%` }} />
                  </div>
                  <p className="text-[10px] text-slate-400 mt-2">{path.progress}% Complete</p>
                </div>
                <button className="w-full bg-indigo-50 border-none py-2.5 rounded-lg text-indigo-600 font-semibold text-xs cursor-pointer hover:bg-indigo-100 transition">
                  Continue Path
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Algorithm Topics */}
        <div className="mb-14">
          <h2 className="text-2xl font-extrabold text-slate-900 mb-6">Algorithm Topics</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {TOPICS.map((topic) => {
              const difficultyColor =
                topic.difficulty === "Beginner" ? "bg-green-100 text-green-700" :
                topic.difficulty === "Intermediate" ? "bg-amber-100 text-amber-700" :
                "bg-red-100 text-red-700";
              return (
                <Link key={topic.id} href={`/tools/algorithms/${topic.id}`} className="no-underline">
                  <div
                    className={`bg-white rounded-2xl p-6 border-2 h-full flex flex-col cursor-pointer transition-all duration-300 ${
                      hoveredCard === topic.id
                        ? "border-indigo-500 shadow-xl shadow-indigo-500/20 -translate-y-2"
                        : "border-slate-200 shadow-sm"
                    }`}
                    onMouseEnter={() => setHoveredCard(topic.id)}
                    onMouseLeave={() => setHoveredCard(null)}
                  >
                    <div className="text-3xl mb-3">{topic.icon}</div>
                    <h3 className="text-base font-bold text-slate-900 mb-2">{topic.label}</h3>
                    <p className="text-xs text-slate-500 mb-4 flex-1">{topic.desc}</p>
                    <div className="flex justify-between items-center pt-3 border-t border-slate-200">
                      <span className={`text-[10px] px-2 py-1 rounded-md font-semibold uppercase ${difficultyColor}`}>
                        {topic.difficulty}
                      </span>
                      <span className="text-[11px] text-slate-400">{topic.algorithms} algorithms</span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Quick Resources */}
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 mb-6">Quick Resources</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {RESOURCES.map((resource) => (
              <div key={resource.title} className="bg-white rounded-2xl p-6 border border-slate-200 flex flex-col shadow-sm">
                <div className="text-3xl mb-3">{resource.icon}</div>
                <h3 className="text-base font-bold text-slate-900 mb-2">{resource.title}</h3>
                <p className="text-xs text-slate-500 mb-4 flex-1">{resource.desc}</p>
                <button className="w-full bg-indigo-50 border-none py-2.5 rounded-lg text-indigo-600 font-semibold text-xs cursor-pointer hover:bg-indigo-100 transition flex items-center justify-center gap-2">
                  Explore <ArrowRight size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
