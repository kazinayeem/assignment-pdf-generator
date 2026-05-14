"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight, BookOpen, Target, TrendingUp, Cpu, Database,
  BrainCircuit, BarChart3, GitBranch, Network, FileJson,
  Sigma, Layers, Sparkles, ChevronRight, Zap,
} from "lucide-react";

const TOPICS = [
  { id: "python", label: "Python", icon: FileJson, desc: "Data structures, libraries, best practices", color: "emerald", diff: "Beginner" },
  { id: "numpy", label: "NumPy", icon: Sigma, desc: "Arrays, operations, linear algebra", color: "blue", diff: "Beginner" },
  { id: "pandas", label: "Pandas", icon: Layers, desc: "DataFrames, cleaning, transformation", color: "violet", diff: "Beginner" },
  { id: "statistics", label: "Statistics", icon: BarChart3, desc: "Probability, hypothesis testing, distributions", color: "cyan", diff: "Intermediate" },
  { id: "machine-learning", label: "Machine Learning", icon: BrainCircuit, desc: "Regression, classification, clustering", color: "purple", diff: "Advanced", sim: true },
  { id: "deep-learning", label: "Deep Learning", icon: Cpu, desc: "Neural networks, CNN, RNN, transformers", color: "rose", diff: "Advanced", sim: true },
  { id: "nlp", label: "NLP", icon: GitBranch, desc: "Text processing, embeddings, transformers", color: "indigo", diff: "Advanced" },
  { id: "llm", label: "LLM & GPT", icon: Sparkles, desc: "Large language models, fine-tuning, RAG", color: "amber", diff: "Advanced" },
  { id: "sql", label: "SQL", icon: Database, desc: "Queries, joins, window functions", color: "orange", diff: "Intermediate" },
  { id: "big-data", label: "Big Data", icon: Network, desc: "Spark, Hadoop, data pipelines", color: "teal", diff: "Advanced" },
];

const ROADMAP = [
  { phase: "1", title: "Python & Math", items: ["Python", "NumPy", "Pandas", "Statistics"], color: "from-emerald-500 to-teal-600" },
  { phase: "2", title: "Machine Learning", items: ["ML Algorithms", "Deep Learning", "NLP"], color: "from-blue-500 to-indigo-600" },
  { phase: "3", title: "Advanced AI", items: ["LLMs", "Prompt Engineering", "Big Data"], color: "from-violet-500 to-purple-600" },
];

const colorMap: Record<string, string> = {
  emerald: "from-emerald-500 to-teal-600", blue: "from-blue-500 to-cyan-600",
  violet: "from-violet-500 to-purple-600", cyan: "from-cyan-500 to-blue-600",
  purple: "from-purple-500 to-violet-600", rose: "from-rose-500 to-pink-600",
  indigo: "from-indigo-500 to-purple-600", amber: "from-amber-500 to-orange-600",
  orange: "from-orange-500 to-red-600", teal: "from-teal-500 to-emerald-600",
};

const badgeStyle: Record<string, string> = {
  Beginner: "bg-emerald-50 text-emerald-700 border border-emerald-200",
  Intermediate: "bg-blue-50 text-blue-700 border border-blue-200",
  Advanced: "bg-purple-50 text-purple-700 border border-purple-200",
};

export default function DataSciencePage() {
  const [hovered, setHovered] = useState<string | null>(null);
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      <style>{`
        @keyframes gradientShift { 0%,100% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } }
        .ds-hero { background: linear-gradient(135deg, #064e3b 0%, #065f46 30%, #1e3a5f 70%, #312e81 100%); background-size: 300% 300%; animation: gradientShift 10s ease infinite; }
      `}</style>

      <div className="ds-hero text-white px-4 sm:px-6 py-16 sm:py-20 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[length:24px_24px]" />
        <div className="max-w-4xl mx-auto relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 backdrop-blur-md rounded-full text-xs font-semibold mb-6 border border-white/20">
              <BrainCircuit className="w-3.5 h-3.5 text-emerald-300" /> Data Science & AI Learning Platform
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black mb-4 leading-tight tracking-tight">
              <span className="bg-gradient-to-r from-emerald-300 via-teal-300 to-blue-300 bg-clip-text text-transparent">
                Data Science & AI
              </span>
            </h1>
            <p className="text-base sm:text-lg text-emerald-100 max-w-2xl mx-auto mb-8">
              Master Python, ML, deep learning, and LLMs through interactive lessons and hands-on projects.
            </p>
            <div className="flex gap-3 justify-center flex-wrap">
              <Link href="/tools/data-science/python">
                <button className="bg-white text-emerald-700 px-7 py-3 rounded-xl font-bold text-sm hover:bg-emerald-50 transition shadow-xl cursor-pointer flex items-center gap-2">
                  Start Learning <ArrowRight size={16} />
                </button>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-12">
        <section>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mb-6">Learning Roadmap</h2>
          <div className="grid sm:grid-cols-3 gap-4">
            {ROADMAP.map((phase) => (
              <div key={phase.phase} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center bg-gradient-to-br ${phase.color} shadow-sm mb-3`}>
                  <span className="text-white font-bold text-xs">{phase.phase}</span>
                </div>
                <h3 className="font-bold text-slate-900 text-sm mb-3">{phase.title}</h3>
                <ul className="space-y-1.5">
                  {phase.items.map((item) => (
                    <li key={item} className="flex items-center gap-2 text-xs text-slate-600">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" /> {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mb-6">All Topics</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {TOPICS.map((topic) => {
              const Icon = topic.icon;
              return (
                <Link key={topic.id} href={`/tools/data-science/${topic.id}`}>
                  <div onMouseEnter={() => setHovered(topic.id)} onMouseLeave={() => setHovered(null)}
                    className={`p-5 rounded-2xl border-2 transition-all h-full cursor-pointer ${
                      hovered === topic.id ? "border-emerald-400 bg-emerald-50 shadow-lg" : "border-slate-200 bg-white shadow-sm hover:border-emerald-300"
                    }`}>
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 bg-gradient-to-br ${colorMap[topic.color]} shadow-sm`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="font-bold text-sm text-slate-900 mb-1.5">{topic.label}</h3>
                    <p className="text-xs text-slate-500 mb-3">{topic.desc}</p>
                    <span className={`inline-block px-2 py-0.5 text-[10px] font-bold rounded-full ${badgeStyle[topic.diff]}`}>
                      {topic.diff}{topic.sim ? " • SIM" : ""}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}
