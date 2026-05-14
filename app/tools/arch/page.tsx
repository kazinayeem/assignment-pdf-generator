"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Zap, BookOpen, Target, TrendingUp, Cpu, Database } from "lucide-react";

const MAIN_TOPICS = [
  { id: "fundamentals", label: "Fundamentals", icon: "📚", desc: "Von Neumann, Harvard, Components", color: "cyan" },
  { id: "cpu-organization", label: "CPU Organization", icon: "⚙️", desc: "Registers, ALU, Control Unit", color: "emerald" },
  { id: "instruction-set", label: "Instruction Set", icon: "💻", desc: "Formats, Addressing, RISC/CISC", color: "pink" },
  { id: "memory-hierarchy", label: "Memory Hierarchy", icon: "🗂️", desc: "Cache, RAM, Virtual Memory", color: "amber" },
  { id: "cache-memory", label: "Cache Memory", icon: "⚡", desc: "Direct, Associative, Set Mapping", color: "orange" },
  { id: "virtual-memory", label: "Virtual Memory", icon: "🔄", desc: "Paging, Segmentation, TLB", color: "purple" },
  { id: "arithmetic-logic", label: "Arithmetic & Logic", icon: "🔢", desc: "Booth's, Floating Point, Signed", color: "blue" },
  { id: "io-organization", label: "I/O Organization", icon: "🔌", desc: "Interrupts, DMA, Bus Architecture", color: "rose" },
  { id: "parallel-processing", label: "Parallel Processing", icon: "🚀", desc: "SIMD, MIMD, Multiprocessors", color: "teal" },
];

const colorMap: Record<string, { border: string; hover: string; text: string; light: string }> = {
  cyan: { border: "border-cyan-500", hover: "hover:border-cyan-500", text: "text-cyan-600", light: "bg-cyan-50" },
  emerald: { border: "border-emerald-500", hover: "hover:border-emerald-500", text: "text-emerald-600", light: "bg-emerald-50" },
  pink: { border: "border-pink-500", hover: "hover:border-pink-500", text: "text-pink-600", light: "bg-pink-50" },
  amber: { border: "border-amber-500", hover: "hover:border-amber-500", text: "text-amber-600", light: "bg-amber-50" },
  orange: { border: "border-orange-500", hover: "hover:border-orange-500", text: "text-orange-600", light: "bg-orange-50" },
  purple: { border: "border-purple-500", hover: "hover:border-purple-500", text: "text-purple-600", light: "bg-purple-50" },
  blue: { border: "border-blue-500", hover: "hover:border-blue-500", text: "text-blue-600", light: "bg-blue-50" },
  rose: { border: "border-rose-500", hover: "hover:border-rose-500", text: "text-rose-600", light: "bg-rose-50" },
  teal: { border: "border-teal-500", hover: "hover:border-teal-500", text: "text-teal-600", light: "bg-teal-50" },
};

const STATS = [
  { label: "Topics", value: "50+", icon: <BookOpen size={20} /> },
  { label: "Simulators", value: "12+", icon: <Cpu size={20} /> },
  { label: "Interview Qs", value: "200+", icon: <Target size={20} /> },
  { label: "Real Examples", value: "100+", icon: <TrendingUp size={20} /> },
];

const SIMULATORS = [
  { title: "Cache Mapping Simulator", desc: "Visualize direct, associative, and set-associative cache mapping", icon: "⚡" },
  { title: "Booth's Algorithm", desc: "Step-by-step binary multiplication with bit shifting", icon: "🔢" },
  { title: "Pipeline Visualizer", desc: "See how instructions flow through CPU pipeline stages", icon: "📊" },
  { title: "Addressing Modes", desc: "Interactive addressing mode demonstrations", icon: "🎯" },
  { title: "Memory Hierarchy", desc: "Explore cache → RAM → Disk access patterns", icon: "🗂️" },
  { title: "CPU Execution", desc: "Fetch-Decode-Execute-Write cycle visualization", icon: "⚙️" },
];

const PHASES = [
  { phase: "Phase 1", title: "Fundamentals", topics: ["Von Neumann", "Components", "Performance"], progress: 90 },
  { phase: "Phase 2", title: "CPU & Memory", topics: ["CPU Organization", "Memory Hierarchy", "Cache"], progress: 60 },
  { phase: "Phase 3", title: "Advanced", topics: ["Virtual Memory", "I/O System", "Parallel"], progress: 30 },
  { phase: "Phase 4", title: "Mastery", topics: ["Modern CPUs", "GPU Basics", "Interview Prep"], progress: 0 },
];

const RESOURCES = [
  { title: "Cheat Sheet", desc: "Quick reference for all concepts", icon: "📋" },
  { title: "Interview Questions", desc: "100+ Q&A for placements", icon: "🎯" },
  { title: "Practice MCQs", desc: "Test your knowledge daily", icon: "📝" },
  { title: "Real CPU Examples", desc: "Intel, AMD, ARM architectures", icon: "💾" },
];

export default function ArchPage() {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-cyan-600 via-blue-600 to-indigo-700 px-6 py-16 text-white text-center relative overflow-hidden">
        <div className="absolute w-52 h-52 bg-white/5 rounded-full -top-10 -right-10" />
        <div className="absolute w-52 h-52 bg-white/5 rounded-full -bottom-10 -left-10" />
        <div className="max-w-3xl mx-auto relative z-10">
          <div className="text-3xl mb-4">⚙️</div>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight">
            Computer Architecture
          </h1>
          <p className="text-lg mb-8 text-white/90 leading-relaxed">
            Master CPU design, memory systems, instruction sets, and advanced computing concepts. From Von Neumann to modern GPUs.
          </p>
          <div className="flex gap-4 justify-center flex-wrap mb-12">
            <Link href="/tools/arch/fundamentals" className="no-underline">
              <button className="bg-white text-cyan-600 border-none px-8 py-3 rounded-xl font-semibold cursor-pointer text-sm flex items-center gap-2 hover:shadow-lg transition">
                Start Learning <ArrowRight size={16} />
              </button>
            </Link>
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
        {/* Learning Topics */}
        <div className="mb-14">
          <h2 className="text-2xl font-extrabold text-slate-900 mb-6">Learning Topics</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {MAIN_TOPICS.map((topic) => {
              const c = colorMap[topic.color] || colorMap.cyan;
              return (
                <Link key={topic.id} href={`/tools/arch/${topic.id}`} className="no-underline">
                  <div
                    className={`bg-white rounded-2xl p-6 border-2 h-full flex flex-col cursor-pointer transition-all duration-300 ${
                      hoveredCard === topic.id
                        ? `${c.border} shadow-xl -translate-y-2`
                        : "border-slate-200 shadow-sm"
                    }`}
                    onMouseEnter={() => setHoveredCard(topic.id)}
                    onMouseLeave={() => setHoveredCard(null)}
                  >
                    <div className="text-3xl mb-3">{topic.icon}</div>
                    <h3 className="text-base font-bold text-slate-900 mb-2">{topic.label}</h3>
                    <p className="text-xs text-slate-500 mb-4 flex-1">{topic.desc}</p>
                    <div className="flex items-center gap-2 pt-3 border-t border-slate-200 text-xs font-semibold">
                      <span className={c.text}>Explore</span>
                      <ArrowRight size={14} className={c.text} />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Interactive Simulators */}
        <div className="mb-14">
          <h2 className="text-2xl font-extrabold text-slate-900 mb-6">Interactive Simulators</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {SIMULATORS.map((sim, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 border border-slate-200 cursor-pointer transition-all hover:border-cyan-500 hover:shadow-lg shadow-sm">
                <div className="text-3xl mb-3">{sim.icon}</div>
                <h3 className="text-base font-bold text-slate-900 mb-2">{sim.title}</h3>
                <p className="text-xs text-slate-500 mb-4">{sim.desc}</p>
                <button className="w-full bg-cyan-50 border border-cyan-500 text-cyan-600 py-2.5 rounded-lg font-semibold text-xs cursor-pointer hover:bg-cyan-100 transition">
                  Launch Simulator
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Recommended Learning Path */}
        <div className="mb-14">
          <h2 className="text-2xl font-extrabold text-slate-900 mb-6">Recommended Learning Path</h2>
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {PHASES.map((phase, i) => (
                <div key={i} className="bg-cyan-50 rounded-xl p-4 border border-slate-200">
                  <h4 className="text-[10px] font-bold text-cyan-700 mb-2 uppercase tracking-wider">{phase.phase}</h4>
                  <h3 className="text-base font-bold text-slate-900 mb-3">{phase.title}</h3>
                  <ul className="flex flex-col gap-1.5 mb-3">
                    {phase.topics.map((topic, j) => (
                      <li key={j} className="text-[11px] text-slate-500 flex items-center gap-2">
                        <span className="w-1 h-1 bg-cyan-500 rounded-full shrink-0" />
                        {topic}
                      </li>
                    ))}
                  </ul>
                  <div className="bg-white h-1.5 rounded-full overflow-hidden mb-1.5">
                    <div className="bg-gradient-to-r from-cyan-500 to-blue-500 h-full rounded-full transition-all" style={{ width: `${phase.progress}%` }} />
                  </div>
                  <p className="text-[10px] text-slate-400">{phase.progress}% Complete</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Resources */}
        <div className="mb-10">
          <h2 className="text-2xl font-extrabold text-slate-900 mb-6">Quick Resources</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {RESOURCES.map((resource, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 border border-slate-200 cursor-pointer transition-all hover:border-emerald-500 shadow-sm">
                <div className="text-3xl mb-3">{resource.icon}</div>
                <h3 className="text-base font-bold text-slate-900 mb-2">{resource.title}</h3>
                <p className="text-xs text-slate-500 mb-4">{resource.desc}</p>
                <button className="w-full bg-emerald-50 border border-emerald-500 text-emerald-600 py-2.5 rounded-lg font-semibold text-xs cursor-pointer hover:bg-emerald-100 transition">
                  Explore
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
