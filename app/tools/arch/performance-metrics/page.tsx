"use client";

import { useState } from "react";
import Link from "next/link";
import { Home, ChevronRight, Cpu, Gauge, BarChart3, Hash } from "lucide-react";
import { Section, InfoCard, CodeBlock, Diagram, InterviewQuestion } from "../components";

type CPIResult = {
  cpuTime: number;
  mips: number;
  totalCycles: number;
};

type AmdahlResult = {
  speedup: number;
  newTime: number;
};

export default function PerformanceMetricsPage() {
  const [ic, setIc] = useState("1000000");
  const [cpi, setCpi] = useState("2.5");
  const [clockRate, setClockRate] = useState("2.0");

  const [fractionP, setFractionP] = useState("0.6");
  const [speedupS, setSpeedupS] = useState("4");

  const icNum = parseFloat(ic) || 0;
  const cpiNum = parseFloat(cpi) || 0;
  const clockNum = parseFloat(clockRate) || 0;

  const freq = clockNum * 1e9;
  const cycleTime = clockNum > 0 ? 1 / freq : 0;
  const totalCycles = icNum * cpiNum;
  const cpuTime = freq > 0 ? totalCycles / freq : 0;
  const mipsNum = cpuTime > 0 ? icNum / (cpuTime * 1e6) : 0;

  const p = parseFloat(fractionP) || 0;
  const s = parseFloat(speedupS) || 1;
  const amdahlSpeedup = s > 0 ? 1 / ((1 - p) + p / s) : 1;
  const originalTime = 100;
  const newTime = originalTime / amdahlSpeedup;

  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      <div className="flex items-center gap-2 mb-6 text-xs text-slate-500">
        <Link href="/tools/arch" className="text-cyan-600 no-underline flex items-center gap-1.5 hover:text-cyan-800 transition">
          <Home size={16} /> Architecture
        </Link>
        <ChevronRight size={16} />
        <span className="text-slate-900 font-semibold">Performance Metrics</span>
      </div>

      <div className="mb-10">
        <h1 className="text-4xl font-extrabold text-slate-900 mb-3">📈 Performance Metrics</h1>
        <p className="text-base text-slate-500 leading-relaxed max-w-xl">
          Understand how computer performance is measured: clock rate, CPI, MIPS, Amdahl's Law, and benchmarking methodologies.
        </p>
      </div>

      <Section title="Key Performance Metrics">
        <InfoCard title="What Determines Performance?" type="info">
          CPU performance depends on three factors: instruction count (IC), cycles per instruction (CPI), and clock cycle time. The fundamental equation: CPU Time = IC × CPI × Clock Cycle Time.
        </InfoCard>
        <div className="grid sm:grid-cols-2 gap-4">
          {[
            { term: "Clock Rate (f)", desc: "Number of clock cycles per second (GHz). Higher clock rate = potentially faster execution, but also more power and heat.", icon: <Gauge size={20} /> },
            { term: "CPI (Cycles Per Instruction)", desc: "Average number of clock cycles needed to execute one instruction. Lower CPI = better performance.", icon: <Cpu size={20} /> },
            { term: "Instruction Count (IC)", desc: "Total number of instructions executed by a program. Determined by program, compiler, and ISA.", icon: <Hash size={20} /> },
            { term: "MIPS / MFLOPS", desc: "MIPS = millions of instructions per second. MFLOPS = millions of floating-point operations per second.", icon: <BarChart3 size={20} /> },
          ].map((m, i) => (
            <div key={i} className="bg-white rounded-xl border border-slate-200 p-4 flex gap-3">
              <div className="text-cyan-600 mt-0.5">{m.icon}</div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 mb-1">{m.term}</h4>
                <p className="text-xs text-slate-500">{m.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section title="CPU Time Formula">
        <InfoCard title="The Fundamental Equation" type="tip">
          CPU Time = IC × CPI × Clock Cycle Time (where Clock Cycle Time = 1 / Clock Rate). This equation shows that performance improvements can come from reducing any of the three factors.
        </InfoCard>
        <div className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-xl border-2 border-cyan-500 p-6 mb-4 text-center">
          <span className="text-lg font-bold text-cyan-800 font-mono">
            CPU Time = IC × CPI × (1 / f)
          </span>
        </div>
        <div className="grid sm:grid-cols-3 gap-4">
          {[
            { factor: "Reduce IC", how: "Better compilers, optimized algorithms, efficient ISA" },
            { factor: "Reduce CPI", how: "Pipeline optimization, superscalar execution, cache hits" },
            { factor: "Increase Clock Rate", how: "Smaller transistors, deeper pipelines, better cooling" },
          ].map((opt, i) => (
            <div key={i} className="bg-white rounded-xl border border-slate-200 p-4 text-center">
              <h4 className="text-sm font-bold text-slate-900 mb-1.5">{opt.factor}</h4>
              <p className="text-xs text-slate-500">{opt.how}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Interactive CPI Calculator">
        <InfoCard title="Try It Yourself" type="tip">
          Enter instruction count, average CPI, and clock rate to compute CPU time and MIPS.
        </InfoCard>
        <div className="bg-white rounded-xl border border-slate-200 p-6 mb-4 shadow-sm">
          <div className="grid sm:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Instruction Count (IC)</label>
              <input type="number" value={ic} onChange={e => setIc(e.target.value)} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500" placeholder="e.g. 1000000" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Avg CPI</label>
              <input type="number" step="0.1" value={cpi} onChange={e => setCpi(e.target.value)} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500" placeholder="e.g. 2.5" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Clock Rate (GHz)</label>
              <input type="number" step="0.1" value={clockRate} onChange={e => setClockRate(e.target.value)} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500" placeholder="e.g. 2.0" />
            </div>
          </div>
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { label: "Total Cycles", value: totalCycles.toLocaleString(), color: "bg-blue-50 border-blue-200 text-blue-800" },
              { label: "CPU Time", value: `${cpuTime.toFixed(6)} s`, color: "bg-cyan-50 border-cyan-200 text-cyan-800" },
              { label: "MIPS", value: mipsNum > 0 ? mipsNum.toFixed(2) : "—", color: "bg-emerald-50 border-emerald-200 text-emerald-800" },
            ].map((r, i) => (
              <div key={i} className={`${r.color} border rounded-xl p-4 text-center`}>
                <div className="text-xs font-semibold mb-1">{r.label}</div>
                <div className="text-lg font-bold font-mono">{r.value}</div>
              </div>
            ))}
          </div>
        </div>
      </Section>

      <Section title="Amdahl's Law">
        <InfoCard title="Amdahl's Law" type="info">
          Amdahl's Law states that the speedup of a system is limited by the fraction of the task that cannot be parallelized or improved. Speedup = 1 / ((1 - P) + P/S), where P is the proportion that can be improved, and S is the speedup factor of that portion.
        </InfoCard>
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl border-2 border-amber-500 p-6 mb-4 text-center">
          <span className="text-lg font-bold text-amber-800 font-mono">
            Speedup = 1 / ((1 - P) + P / S)
          </span>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          {[
            { pct: "25%", limit: "1.33×", desc: "If only 25% of code can be improved, max speedup is 1.33× regardless of S." },
            { pct: "50%", limit: "2×", desc: "Even if you make the improved portion infinitely fast, total speedup caps at 2×." },
            { pct: "75%", limit: "4×", desc: "Three-quarters must be parallelizable to achieve 4× speedup." },
            { pct: "90%", limit: "10×", desc: "With 90% parallelization, theoretical max speedup is 10×." },
          ].map((a, i) => (
            <div key={i} className="bg-white rounded-xl border border-slate-200 p-4">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="bg-amber-600 text-white text-[10px] font-bold px-2 py-0.5 rounded">{a.pct} parallel</span>
                <span className="text-sm font-bold text-amber-700 font-mono">max {a.limit}</span>
              </div>
              <p className="text-xs text-slate-500">{a.desc}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Interactive Amdahl's Law Calculator">
        <InfoCard title="Visualize Speedup" type="tip">
          Adjust the parallelizable fraction (P) and speedup factor (S) to see the overall system speedup.
        </InfoCard>
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <div className="grid sm:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Parallelizable Fraction (P): {fractionP}</label>
              <input type="range" min="0" max="0.99" step="0.01" value={fractionP} onChange={e => setFractionP(e.target.value)} className="w-full accent-cyan-600" />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                <span>0%</span>
                <span>50%</span>
                <span>99%</span>
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Speedup Factor (S): {speedupS}×</label>
              <input type="range" min="1" max="64" step="1" value={speedupS} onChange={e => setSpeedupS(e.target.value)} className="w-full accent-cyan-600" />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                <span>1×</span>
                <span>32×</span>
                <span>64×</span>
              </div>
            </div>
          </div>
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { label: "Parallelizable Portion", value: `${(p * 100).toFixed(0)}%`, color: "bg-blue-50 border-blue-200 text-blue-800" },
              { label: "Overall Speedup", value: `${amdahlSpeedup.toFixed(2)}×`, color: "bg-cyan-50 border-cyan-200 text-cyan-800" },
              { label: "Execution Time", value: `Normalized: ${newTime.toFixed(1)}%`, color: "bg-emerald-50 border-emerald-200 text-emerald-800" },
            ].map((r, i) => (
              <div key={i} className={`${r.color} border rounded-xl p-4 text-center`}>
                <div className="text-xs font-semibold mb-1">{r.label}</div>
                <div className="text-lg font-bold font-mono">{r.value}</div>
              </div>
            ))}
          </div>
        </div>
      </Section>

      <Section title="MIPS, MFLOPS, and GFLOPS">
        <div className="grid sm:grid-cols-3 gap-4">
          {[
            { name: "MIPS", full: "Million Instructions Per Second", formula: "MIPS = IC / (CPU Time × 10⁶)", note: "Depends on instruction mix. RISC CPUs often have higher MIPS but not always faster." },
            { name: "MFLOPS", full: "Million Floating-Point Ops / Sec", formula: "MFLOPS = FP Ops / (Time × 10⁶)", note: "Better for scientific computing. Does not account for precision differences." },
            { name: "GFLOPS", full: "Giga Floating-Point Ops / Sec", formula: "GFLOPS = FP Ops / (Time × 10⁹)", note: "Modern GPUs achieve TFLOPS. Peak vs sustained GFLOPS differ significantly." },
          ].map((m, i) => (
            <div key={i} className="bg-white rounded-xl border border-slate-200 p-4">
              <h4 className="text-sm font-bold text-slate-900 mb-1">{m.name}</h4>
              <p className="text-[10px] text-slate-400 mb-2">{m.full}</p>
              <div className="bg-slate-50 rounded-lg p-2 mb-2 font-mono text-xs text-cyan-700">{m.formula}</div>
              <p className="text-[10px] text-slate-500">{m.note}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Benchmarking">
        <InfoCard title="Why Benchmark?" type="info">
          Benchmarks are standardized programs used to compare computer performance. Good benchmarks reflect real-world workloads and produce reproducible, comparable results across different systems.
        </InfoCard>
        <div className="grid sm:grid-cols-2 gap-4">
          {[
            { name: "SPEC (Standard Performance Evaluation Corp)", desc: "Suite of CPU-intensive benchmarks (SPECint, SPECfp). Measures performance under realistic workloads. Results reported as SPECratio (normalized to reference machine)." },
            { name: "Dhrystone", desc: "Synthetic benchmark focused on integer operations. Measures MIPS (DMIPS). Criticized for being too small to fit in modern caches, inflating results." },
            { name: "Whetstone", desc: "Synthetic benchmark for floating-point performance. Includes trigonometric functions, array operations, and conditionals. Used historically for MFLOPS ratings." },
            { name: "Linpack", desc: "Solves dense systems of linear equations. Core benchmark for TOP500 supercomputer ranking. Measures GFLOPS for matrix operations." },
          ].map((b, i) => (
            <div key={i} className="bg-white rounded-xl border border-slate-200 p-4">
              <h4 className="text-sm font-bold text-slate-900 mb-1.5">{b.name}</h4>
              <p className="text-xs text-slate-500">{b.desc}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Code Example: Performance Calculation">
        <CodeBlock code={`# Calculate CPU performance metrics

# Given:
instruction_count = 1_000_000_000   # 1 billion instructions
avg_cpi = 2.5                       # cycles per instruction
clock_rate = 3.0e9                  # 3.0 GHz

# CPU Time = IC × CPI × Cycle Time
cycle_time = 1.0 / clock_rate       # seconds per cycle
cpu_time = instruction_count * avg_cpi * cycle_time

print(f"CPU Time: {cpu_time:.4f} seconds")

# MIPS = IC / (CPU Time * 10^6)
mips = instruction_count / (cpu_time * 1e6)
print(f"MIPS: {mips:.2f}")

# Amdahl's Law
P = 0.75  # 75% of code is parallelizable
S = 8     # 8x speedup on parallel portion
speedup = 1 / ((1 - P) + P / S)
print(f"Amdahl Speedup ({P*100}% parallel, {S}x speedup): {speedup:.2f}x")`} language="python" />
      </Section>

      <Section title="Interview Questions">
        <div className="space-y-3">
          <InterviewQuestion question="Explain the CPU performance equation and how to improve performance." answer="CPU Time = IC × CPI × Clock Cycle Time. Performance can be improved by: 1) Reducing IC (better compilers, algorithms), 2) Reducing CPI (pipelining, caching, branch prediction), 3) Increasing clock rate (smaller transistors, better cooling). Each approach has trade-offs — higher clock rate increases power consumption and heat." />
          <InterviewQuestion question="What is the significance of Amdahl's Law in parallel computing?" answer="Amdahl's Law shows that the speedup from parallelization is fundamentally limited by the sequential portion of a program. If 10% of a task is sequential, the maximum speedup is 10× regardless of how many processors are added. This motivates focusing on reducing sequential bottlenecks, not just adding more parallel hardware." />
          <InterviewQuestion question="Why is MIPS considered a flawed performance metric?" answer="MIPS varies with instruction mix — a CPU might achieve high MIPS on one program but lower on another due to different instruction types. Also, RISC CPUs often have higher MIPS than CISC CPUs but may need more instructions per program. MIPS can be misleading when comparing across different ISAs. SPEC benchmarks provide more reliable comparisons." />
          <InterviewQuestion question="What is the difference between peak and sustained performance?" answer="Peak performance is the theoretical maximum throughput under ideal conditions (e.g., all functional units active, no cache misses, perfect parallelism). Sustained performance is what a system actually delivers under real workloads with memory latency, branch mispredictions, and resource contention. The ratio (sustained/peak) is the efficiency, typically 30-70% for most systems." />
        </div>
      </Section>
    </div>
  );
}
