"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight, Cpu, Zap, BookOpen, Target, TrendingUp, Database,
  Binary, GitBranch, Monitor, ChevronRight, Activity,
  BarChart3, Sigma, Variable, Radio, Gauge, Layout,
} from "lucide-react";

const TOPICS = [
  { id: "fundamentals", label: "Fundamentals", icon: BookOpen, desc: "Von Neumann, Harvard, CPU components, instruction cycle", color: "cyan", diff: "Beginner", cnt: 8 },
  { id: "cpu-organization", label: "CPU Organization", icon: Cpu, desc: "ALU, control unit, registers, bus architecture", color: "emerald", diff: "Beginner", cnt: 6 },
  { id: "register-organization", label: "Register Organization", icon: Layout, desc: "CPU registers, flags, stack pointer, program counter", color: "blue", diff: "Beginner", cnt: 5 },
  { id: "instruction-formats", label: "Instruction Formats", icon: Binary, desc: "R-type, I-type, J-type, opcode, operand encoding", color: "violet", diff: "Intermediate", cnt: 6 },
  { id: "addressing-modes", label: "Addressing Modes", icon: Target, desc: "Immediate, direct, indirect, indexed, register", color: "pink", diff: "Intermediate", cnt: 7 },
  { id: "memory-hierarchy", label: "Memory Hierarchy", icon: Database, desc: "Cache, RAM, disk, registers, speed vs size", color: "amber", diff: "Intermediate", cnt: 6 },
  { id: "cache-memory", label: "Cache Memory", icon: Zap, desc: "L1/L2/L3, mapping, hit/miss, write policies", color: "orange", diff: "Intermediate", cnt: 8 },
  { id: "pipelining", label: "Pipelining", icon: GitBranch, desc: "Fetch/decode/execute, hazards, forwarding", color: "purple", diff: "Advanced", cnt: 7 },
  { id: "booths-algorithm", label: "Booth's Algorithm", icon: Sigma, desc: "Signed multiplication, bit shifting, optimization", color: "rose", diff: "Advanced", cnt: 5 },
  { id: "floating-point", label: "Floating Point", icon: Variable, desc: "IEEE 754, precision, rounding, arithmetic", color: "teal", diff: "Advanced", cnt: 6 },
  { id: "io-organization", label: "I/O Organization", icon: Radio, desc: "Interrupts, DMA, polling, device controllers", color: "sky", diff: "Intermediate", cnt: 6 },
  { id: "parallel-processing", label: "Parallel Computing", icon: Monitor, desc: "SIMD, MIMD, GPU, multiprocessors, Flynn", color: "indigo", diff: "Advanced", cnt: 7 },
  { id: "risc-vs-cisc", label: "RISC vs CISC", icon: Gauge, desc: "Instruction set philosophies, tradeoffs, examples", color: "cyan", diff: "Intermediate", cnt: 5 },
  { id: "virtual-memory", label: "Virtual Memory", icon: Database, desc: "Paging, segmentation, TLB, address translation", color: "emerald", diff: "Advanced", cnt: 6 },
];

const colorConfig: Record<string, { border: string; hover: string; text: string; light: string; gradient: string }> = {
  cyan: { border: "border-cyan-300", hover: "hover:border-cyan-400", text: "text-cyan-600", light: "bg-cyan-50", gradient: "from-cyan-500 to-blue-600" },
  emerald: { border: "border-emerald-300", hover: "hover:border-emerald-400", text: "text-emerald-600", light: "bg-emerald-50", gradient: "from-emerald-500 to-teal-600" },
  blue: { border: "border-blue-300", hover: "hover:border-blue-400", text: "text-blue-600", light: "bg-blue-50", gradient: "from-blue-500 to-cyan-600" },
  violet: { border: "border-violet-300", hover: "hover:border-violet-400", text: "text-violet-600", light: "bg-violet-50", gradient: "from-violet-500 to-purple-600" },
  pink: { border: "border-pink-300", hover: "hover:border-pink-400", text: "text-pink-600", light: "bg-pink-50", gradient: "from-pink-500 to-rose-600" },
  amber: { border: "border-amber-300", hover: "hover:border-amber-400", text: "text-amber-600", light: "bg-amber-50", gradient: "from-amber-500 to-orange-600" },
  orange: { border: "border-orange-300", hover: "hover:border-orange-400", text: "text-orange-600", light: "bg-orange-50", gradient: "from-orange-500 to-red-600" },
  purple: { border: "border-purple-300", hover: "hover:border-purple-400", text: "text-purple-600", light: "bg-purple-50", gradient: "from-purple-500 to-violet-600" },
  rose: { border: "border-rose-300", hover: "hover:border-rose-400", text: "text-rose-600", light: "bg-rose-50", gradient: "from-rose-500 to-pink-600" },
  teal: { border: "border-teal-300", hover: "hover:border-teal-400", text: "text-teal-600", light: "bg-teal-50", gradient: "from-teal-500 to-emerald-600" },
  sky: { border: "border-sky-300", hover: "hover:border-sky-400", text: "text-sky-600", light: "bg-sky-50", gradient: "from-sky-500 to-blue-600" },
  indigo: { border: "border-indigo-300", hover: "hover:border-indigo-400", text: "text-indigo-600", light: "bg-indigo-50", gradient: "from-indigo-500 to-purple-600" },
};

const STATS = [
  { label: "Topics", value: "50+", icon: BookOpen },
  { label: "Simulators", value: "12+", icon: Cpu },
  { label: "Interactive Demos", value: "8", icon: Zap },
  { label: "Interview Qs", value: "200+", icon: Target },
];

const SIMULATORS = [
  { title: "Cache Mapping Simulator", desc: "Direct, associative & set-associative mapping with live visualization", icon: Zap, color: "cyan", href: "/tools/arch/cache-mapping" },
  { title: "Booth's Algorithm", desc: "Step-by-step signed multiplication with register visualization", icon: Sigma, color: "violet", href: "/tools/arch/booths-algorithm" },
  { title: "Pipeline Visualizer", desc: "Instruction flow through fetch/decode/execute stages", icon: GitBranch, color: "emerald", href: "/tools/arch/pipelining" },
  { title: "Instruction Decoder", desc: "Decode opcode, registers, and immediate values", icon: Binary, color: "pink", href: "/tools/arch/instruction-execution" },
  { title: "Memory Hierarchy Viz", desc: "Cache to RAM to Disk with latency visualization", icon: Database, color: "amber", href: "/tools/arch/memory-hierarchy" },
  { title: "Addressing Mode Demo", desc: "Interactive addressing mode demonstrations", icon: Target, color: "orange", href: "/tools/arch/addressing-modes" },
];

const CALCULATORS = [
  { title: "Binary Calculator", desc: "Add, subtract, multiply & divide binary numbers", icon: Binary, color: "cyan" },
  { title: "Cache Hit Ratio", desc: "Calculate AMAT and performance impact", icon: BarChart3, color: "emerald" },
  { title: "CPI Calculator", desc: "Cycles Per Instruction analysis tool", icon: Activity, color: "violet" },
  { title: "Performance Analyzer", desc: "Speedup, efficiency and throughput", icon: TrendingUp, color: "amber" },
];

const LEARNING_PATHS = [
  { title: "Architecture Foundations", items: ["Fundamentals", "CPU Organization", "Register Organization", "Performance Metrics"], badge: "Beginner" },
  { title: "Memory & Instructions", items: ["Memory Hierarchy", "Cache Memory", "Virtual Memory", "Instruction Formats", "Addressing Modes"], badge: "Intermediate" },
  { title: "Advanced Architecture", items: ["Pipelining", "Booth's Algorithm", "Floating Point", "Parallel Computing", "I/O Systems"], badge: "Advanced" },
];

const badgeStyles: Record<string, string> = {
  Beginner: "bg-emerald-50 text-emerald-700 border border-emerald-200",
  Intermediate: "bg-blue-50 text-blue-700 border border-blue-200",
  Advanced: "bg-purple-50 text-purple-700 border border-purple-200",
};

export default function ArchPage() {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      <style>{`
        @keyframes gradientShift { 0%,100% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } }
        .arch-hero { background: linear-gradient(135deg, #0f172a 0%, #1e3a5f 30%, #155e75 60%, #0f766e 100%); background-size: 300% 300%; animation: gradientShift 10s ease infinite; }
        .grid-bg { background-image: radial-gradient(rgba(255,255,255,0.04) 1px, transparent 1px); background-size: 24px 24px; }
      `}</style>

      {/* Hero */}
      <div className="arch-hero text-white px-4 sm:px-6 py-16 sm:py-20 text-center relative overflow-hidden">
        <div className="grid-bg absolute inset-0" />
        <div className="absolute top-10 left-10 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="max-w-5xl mx-auto relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 backdrop-blur-md rounded-full text-xs font-semibold mb-6 border border-white/20">
              <Cpu className="w-3.5 h-3.5 text-cyan-300" />
              Computer Architecture Learning Platform
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-black mb-4 leading-[1.1] tracking-tight">
              <span className="bg-gradient-to-r from-cyan-300 via-blue-300 to-teal-300 bg-clip-text text-transparent">
                Computer Architecture
              </span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl mb-8 text-slate-300 max-w-3xl mx-auto leading-relaxed">
              Master CPU design, memory systems, instruction sets, and parallel computing through interactive simulations and hands-on learning.
            </p>
            <div className="flex gap-3 sm:gap-4 justify-center flex-wrap mb-12 sm:mb-16">
              <Link href="/tools/arch/fundamentals">
                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}
                  className="bg-white text-slate-900 px-7 sm:px-9 py-3 rounded-xl font-bold text-sm sm:text-base hover:bg-slate-100 transition flex items-center gap-2 shadow-xl cursor-pointer">
                  Start Learning <ArrowRight size={18} />
                </motion.button>
              </Link>
              <Link href="/tools/arch/cache-mapping">
                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}
                  className="bg-white/10 text-white border-2 border-white/30 px-7 sm:px-9 py-3 rounded-xl font-bold text-sm sm:text-base hover:bg-white/20 transition flex items-center gap-2 backdrop-blur-md cursor-pointer">
                  <Zap size={18} /> Try Cache Simulator
                </motion.button>
              </Link>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 max-w-3xl mx-auto">
            {STATS.map((stat) => {
              const Icon = stat.icon;
              return (
                <div key={stat.label} className="bg-white/10 backdrop-blur-md rounded-2xl p-4 sm:p-5 border border-white/20">
                  <Icon className="w-5 h-5 mx-auto mb-2 text-cyan-300" />
                  <div className="text-xl sm:text-2xl font-black">{stat.value}</div>
                  <div className="text-[10px] sm:text-xs text-slate-400 mt-0.5">{stat.label}</div>
                </div>
              );
            })}
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16 space-y-16">
        {/* All Topics Grid */}
        <motion.section initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900">All Architecture Topics</h2>
              <p className="text-sm text-slate-500 mt-1">Comprehensive coverage from fundamentals to advanced</p>
            </div>
            <span className="hidden sm:inline-block text-xs text-slate-400 bg-white px-3 py-1.5 rounded-full border border-slate-200">{TOPICS.length} topics</span>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {TOPICS.map((topic) => {
              const Icon = topic.icon;
              const c = colorConfig[topic.color] || colorConfig.cyan;
              return (
                <Link key={topic.id} href={`/tools/arch/${topic.id}`}>
                  <div onMouseEnter={() => setHoveredCard(topic.id)} onMouseLeave={() => setHoveredCard(null)}
                    className={`p-5 rounded-2xl border-2 transition-all h-full cursor-pointer ${
                      hoveredCard === topic.id
                        ? `${c.border} ${c.light} shadow-lg`
                        : "border-slate-200 bg-white hover:border-slate-300 shadow-sm"
                    }`}>
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 bg-gradient-to-br ${c.gradient} shadow-sm`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="font-bold text-sm sm:text-base text-slate-900 mb-1.5">{topic.label}</h3>
                    <p className="text-xs sm:text-sm text-slate-500 mb-3 leading-relaxed">{topic.desc}</p>
                    <div className="flex items-center justify-between text-[11px]">
                      <span className={c.text + " font-semibold"}>{topic.cnt} topics</span>
                      <span className={`px-2 py-0.5 rounded-full font-bold ${badgeStyles[topic.diff]}`}>{topic.diff}</span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </motion.section>

        {/* Interactive Simulators */}
        <motion.section initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
          <div className="mb-8">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">Interactive Simulators</h2>
            <p className="text-sm text-slate-500 mt-1">Hands-on tools to visualize and experiment with architecture concepts</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {SIMULATORS.map((sim, i) => {
              const c = colorConfig[sim.color] || colorConfig.cyan;
              const Icon = sim.icon;
              return (
                <Link key={i} href={sim.href}>
                  <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 hover:border-slate-300 shadow-sm hover:shadow-lg transition-all h-full cursor-pointer">
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 bg-gradient-to-br ${c.gradient} shadow-sm`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="font-bold text-sm sm:text-base text-slate-900 mb-2">{sim.title}</h3>
                    <p className="text-xs sm:text-sm text-slate-500 mb-4 leading-relaxed">{sim.desc}</p>
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-cyan-600">
                      Launch Simulator <ChevronRight size={14} />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </motion.section>

        {/* Calculators */}
        <motion.section initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
          <div className="mb-8">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">Calculators & Tools</h2>
            <p className="text-sm text-slate-500 mt-1">Quick computation tools for architecture problems</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {CALCULATORS.map((calc, i) => {
              const c = colorConfig[calc.color] || colorConfig.cyan;
              const Icon = calc.icon;
              return (
                <div key={i} className="bg-white rounded-2xl p-5 border border-slate-200 hover:border-slate-300 shadow-sm hover:shadow-lg transition-all cursor-pointer group">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 bg-gradient-to-br ${c.gradient} shadow-sm`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="font-bold text-sm text-slate-900 mb-1.5">{calc.title}</h3>
                  <p className="text-xs text-slate-500 mb-3">{calc.desc}</p>
                  <span className="text-xs font-semibold text-cyan-600 group-hover:underline">Use tool →</span>
                </div>
              );
            })}
          </div>
        </motion.section>

        {/* Learning Roadmap */}
        <motion.section initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
          <div className="mb-8">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">Learning Roadmap</h2>
            <p className="text-sm text-slate-500 mt-1">Follow structured learning paths based on your level</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {LEARNING_PATHS.map((path) => (
              <div key={path.title} className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-3 bg-gradient-to-br from-cyan-500 to-blue-600">
                  <BookOpen className="w-4 h-4 text-white" />
                </div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-3">{path.title}</h3>
                <ul className="space-y-2 mb-4">
                  {path.items.map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-xs sm:text-sm text-slate-600">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
                <span className={`inline-block px-3 py-1 text-[10px] font-bold rounded-full ${badgeStyles[path.badge]}`}>{path.badge}</span>
              </div>
            ))}
          </div>
        </motion.section>

        {/* Features */}
        <motion.section initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
          <div className="mb-8">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">Why Master Architecture Here?</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: Cpu, title: "Interactive Simulations", desc: "Visualize CPU pipelines, cache mapping, and memory hierarchies in real-time." },
              { icon: Zap, title: "Real Performance Data", desc: "See actual timing, hit rates, and throughput calculations as you experiment." },
              { icon: BookOpen, title: "Interview Ready", desc: "200+ curated interview questions with detailed explanations for placements." },
              { icon: BarChart3, title: "Step-by-Step Learning", desc: "Beginner to advanced roadmap covering everything from gates to GPUs." },
            ].map((f, i) => {
              const Icon = f.icon;
              return (
                <div key={i} className="bg-white rounded-xl border border-slate-200 p-5 sm:p-6 shadow-sm">
                  <Icon className="w-8 h-8 text-cyan-600 mb-3" />
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 mb-2">{f.title}</h3>
                  <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">{f.desc}</p>
                </div>
              );
            })}
          </div>
        </motion.section>
      </div>
    </div>
  );
}
