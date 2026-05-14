"use client";

import Link from "next/link";
import {
  Binary, GitBranch, Shuffle, Regex, Infinity, FileType, Minimize2, Cpu,
  BookOpen, GraduationCap, Layers, Sparkles, ArrowRight, CheckCircle2, Route
} from "lucide-react";
import { motion } from "framer-motion";

const stats = [
  { label: "Topics", value: "50+", icon: BookOpen },
  { label: "Simulators", value: "6+", icon: Binary },
  { label: "Interview Qs", value: "100+", icon: GraduationCap },
  { label: "Examples", value: "20+", icon: Sparkles },
];

const topics = [
  { title: "DFA Simulator", desc: "Build and simulate deterministic finite automata interactively with SVG graphs", href: "/tools/theory-of-computing/dfa", icon: GitBranch },
  { title: "NFA Simulator", desc: "Explore nondeterministic automata with epsilon transitions and subset construction", href: "/tools/theory-of-computing/nfa", icon: Shuffle },
  { title: "NFA → DFA", desc: "Convert NFAs to equivalent DFAs using the subset construction algorithm", href: "/tools/theory-of-computing/nfa-to-dfa", icon: Binary },
  { title: "Regex Engine", desc: "Test regular expressions against strings with live match highlighting", href: "/tools/theory-of-computing/regex", icon: Regex },
  { title: "Pumping Lemma", desc: "Prove languages are non-regular and non-context-free with interactive proofs", href: "/tools/theory-of-computing/pumping-lemma", icon: Infinity },
  { title: "CFG & PDA", desc: "Context-free grammars, parse trees, derivations, and pushdown automata", href: "/tools/theory-of-computing/context-free-grammar", icon: FileType },
  { title: "DFA Minimization", desc: "Minimize DFAs using the table-filling algorithm to find equivalent states", href: "/tools/theory-of-computing/minimization", icon: Minimize2 },
  { title: "Turing Machines", desc: "Study computability, decidability, and the Church-Turing thesis", href: "/tools/theory-of-computing/turing-machines", icon: Cpu },
];

const features = [
  { title: "Interactive SVG Graphs", desc: "Visualize automata states and transitions with draggable diagrams", icon: Layers },
  { title: "Step-by-Step Simulation", desc: "Watch each computation step with detailed state tracking", icon: Route },
  { title: "Mathematical Rigor", desc: "Formal definitions, proofs, and algorithmically correct implementations", icon: BookOpen },
  { title: "Interview Prep", desc: "Curated questions with detailed explanations for technical interviews", icon: GraduationCap },
];

const learningPath = [
  { step: "1", title: "Start with DFA & NFA", desc: "Understand finite automata basics and how they recognize languages" },
  { step: "2", title: "Master Regular Expressions", desc: "Connect regex patterns to finite automata and learn Kleene's theorem" },
  { step: "3", title: "Pumping Lemma", desc: "Prove that certain languages are not regular using contradiction" },
  { step: "4", title: "CFG & PDA", desc: "Move to context-free languages, parse trees, and pushdown automata" },
  { step: "5", title: "Turing Machines", desc: "Explore the limits of computation and the Church-Turing thesis" },
];

function AnimatedGradientOrb() {
  return (
    <div className="pointer-events-none absolute -top-40 -right-40 h-80 w-80 rounded-full bg-purple-400/20 blur-3xl animate-pulse" />
  );
}

export default function TocDashboard() {
  return (
    <div className="min-h-screen bg-slate-50">
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-800 px-6 py-16 md:py-24">
        <AnimatedGradientOrb />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMjAgMjBMMTIuNSAxMk0yMCAyMEwyNy41IDEyTTIwIDIwTDEyIDI3LjVNMjAgMjBMMjggMjcuNSIgc3Ryb2tlPSIjZmZmIiBzdHJva2Utd2lkdGg9IjAuNSIgZmlsbD0ibm9uZSIgb3BhY2l0eT0iMC4wOCIvPjwvc3ZnPg==')] opacity-50" />
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="relative mx-auto max-w-4xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-medium text-white/90 backdrop-blur-sm border border-white/10">
            <Sparkles size={14} /> Theory of Computing
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 leading-tight">
            Master the <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-300 to-amber-200">Mathematics</span> of Computation
          </h1>
          <p className="text-lg text-indigo-100 max-w-2xl mx-auto leading-relaxed">
            Explore automata theory, formal languages, and computability through interactive simulators, visualizations, and curated interview questions.
          </p>
        </motion.div>
      </section>

      <section className="relative -mt-8 px-6">
        <div className="mx-auto max-w-5xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((s) => (
              <motion.div key={s.label} whileHover={{ y: -2 }} className="rounded-xl bg-white/80 backdrop-blur-md border border-slate-200/60 p-4 text-center shadow-sm hover:shadow-md transition-all">
                <s.icon className="mx-auto mb-2 h-6 w-6 text-indigo-500" />
                <div className="text-2xl font-bold text-slate-800">{s.value}</div>
                <div className="text-xs text-slate-500 font-medium">{s.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-16">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-2xl font-bold text-slate-800 mb-8">Explore Topics</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {topics.map((t) => (
              <Link key={t.href} href={t.href}>
                <motion.div whileHover={{ y: -3, scale: 1.01 }} className="group h-full rounded-xl bg-white border border-slate-200 p-5 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all">
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-50 to-purple-50 text-indigo-600 group-hover:from-indigo-100 group-hover:to-purple-100 transition-colors">
                    <t.icon size={20} />
                  </div>
                  <h3 className="font-semibold text-slate-800 mb-1 text-sm">{t.title}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">{t.desc}</p>
                </motion.div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white border-y border-slate-200 px-6 py-16">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-2xl font-bold text-slate-800 mb-8 text-center">Why This Module?</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f) => (
              <motion.div key={f.title} whileHover={{ y: -2 }} className="text-center">
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-indigo-50 text-indigo-600">
                  <f.icon size={22} />
                </div>
                <h3 className="font-semibold text-slate-800 text-sm mb-1">{f.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-16">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-2xl font-bold text-slate-800 mb-8">Recommended Learning Path</h2>
          <div className="space-y-4">
            {learningPath.map((item, i) => (
              <motion.div key={item.step} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }} className="flex items-start gap-4 bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-indigo-700 text-sm font-bold">{item.step}</div>
                <div className="flex-1">
                  <h3 className="font-semibold text-slate-800 text-sm">{item.title}</h3>
                  <p className="text-xs text-slate-500">{item.desc}</p>
                </div>
                <CheckCircle2 size={16} className="mt-2 text-indigo-400 shrink-0" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-12 text-center">
        <h2 className="text-2xl font-bold text-white mb-2">Ready to dive in?</h2>
        <p className="text-indigo-100 mb-6 max-w-xl mx-auto text-sm">Start with the DFA Simulator and work your way through the learning path.</p>
        <Link href="/tools/theory-of-computing/dfa" className="inline-flex items-center gap-2 rounded-xl bg-white text-indigo-700 px-6 py-3 font-semibold text-sm hover:bg-indigo-50 transition-colors shadow-lg">
          Get Started <ArrowRight size={16} />
        </Link>
      </section>
    </div>
  );
}
