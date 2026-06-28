"use client";

import { useState } from "react";
import Link from "next/link";
import { Home, ChevronRight, Cpu, Server, Database } from "lucide-react";
import { Section, InfoCard, CodeBlock, Diagram, InterviewQuestion } from "../components";

const COUPLING_TYPES = [
  {
    name: "Tightly Coupled",
    desc: "Processors share a single memory and are connected by a high-speed bus or crossbar.",
    pros: ["Fast communication", "Shared memory model", "Cache coherence easy"],
    cons: ["Limited scalability", "Bus contention", "Expensive interconnect"],
    example: "SMP (Symmetric Multiprocessing)",
  },
  {
    name: "Loosely Coupled",
    desc: "Each processor has its own memory, connected via a network. Communication via message passing.",
    pros: ["Highly scalable", "No bus contention", "Cost-effective"],
    cons: ["Slow communication", "Explicit message passing", "Harder to program"],
    example: "Cluster computing",
  },
];

export default function MultiprocessorsPage() {
  const [activeCoupling, setActiveCoupling] = useState(0);
  const [numCores, setNumCores] = useState(4);
  const [serialFraction, setSerialFraction] = useState(10);
  const [expandedAmdahl, setExpandedAmdahl] = useState(false);

  const p = serialFraction / 100;
  const speedup = 1 / (p + (1 - p) / numCores);
  const efficiency = speedup / numCores;

  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      <div className="flex items-center gap-2 mb-6 text-xs text-slate-500">
        <Link href="/tools/arch" className="text-cyan-600 no-underline flex items-center gap-1.5 hover:text-cyan-800 transition">
          <Home size={16} /> Architecture
        </Link>
        <ChevronRight size={16} />
        <span className="text-slate-900 font-semibold">Multiprocessors</span>
      </div>

      <div className="mb-10">
        <h1 className="text-4xl font-extrabold text-slate-900 mb-3">⚙️ Multiprocessors</h1>
        <p className="text-base text-slate-500 leading-relaxed max-w-xl">
          Systems with multiple processors working together. Explore tight vs loose coupling, SMP, NUMA, Amdahl's Law, and parallel performance analysis.
        </p>
      </div>

      <Section title="Tightly vs Loosely Coupled Systems">
        <div className="grid sm:grid-cols-2 gap-4 mb-4">
          {COUPLING_TYPES.map((ct, i) => (
            <button key={ct.name} onClick={() => setActiveCoupling(i)}
              className={`rounded-xl p-5 border-2 text-left cursor-pointer transition-all ${
                activeCoupling === i ? "bg-blue-50 border-blue-300 shadow-md" : "bg-white border-slate-200 hover:border-slate-300"
              }`}>
              <div className="flex items-center gap-2 mb-2">
                {i === 0 ? <Cpu size={18} className="text-blue-600" /> : <Server size={18} className="text-purple-600" />}
                <h4 className="font-bold text-sm text-slate-900">{ct.name}</h4>
              </div>
              <p className="text-xs text-slate-500 mb-3">{ct.desc}</p>
              <div className="grid grid-cols-2 gap-2 text-[10px]">
                <div><span className="text-emerald-600 font-bold">Pros:</span> {ct.pros.join(", ")}</div>
                <div><span className="text-red-500 font-bold">Cons:</span> {ct.cons.join(", ")}</div>
              </div>
              <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded font-bold text-slate-500 mt-2 inline-block">{ct.example}</span>
            </button>
          ))}
        </div>
      </Section>

      <Section title="Symmetric Multiprocessing (SMP)">
        <InfoCard title="SMP Architecture" type="info">
          In SMP, two or more identical processors share a single memory space via a shared bus. Each processor has equal access to all memory (UMA). All processors run the same OS and can execute any process.
        </InfoCard>
        <Diagram title="SMP System">
          <div className="flex items-center gap-3 w-full max-w-lg">
            <div className="flex-1 bg-gradient-to-br from-blue-50 to-white rounded-xl border border-blue-300 p-3 text-center">
              <Cpu size={20} className="text-blue-600 mx-auto mb-1" />
              <div className="text-xs font-bold text-slate-700">CPU 0</div>
              <div className="text-[10px] text-slate-400">L1 + L2 cache</div>
            </div>
            <div className="flex-1 bg-gradient-to-br from-blue-50 to-white rounded-xl border border-blue-300 p-3 text-center">
              <Cpu size={20} className="text-blue-600 mx-auto mb-1" />
              <div className="text-xs font-bold text-slate-700">CPU 1</div>
              <div className="text-[10px] text-slate-400">L1 + L2 cache</div>
            </div>
            <div className="flex-1 bg-gradient-to-br from-blue-50 to-white rounded-xl border border-blue-300 p-3 text-center">
              <Cpu size={20} className="text-blue-600 mx-auto mb-1" />
              <div className="text-xs font-bold text-slate-700">CPU 2</div>
              <div className="text-[10px] text-slate-400">L1 + L2 cache</div>
            </div>
            <div className="flex-1 bg-gradient-to-br from-blue-50 to-white rounded-xl border border-blue-300 p-3 text-center">
              <Cpu size={20} className="text-blue-600 mx-auto mb-1" />
              <div className="text-xs font-bold text-slate-700">CPU 3</div>
              <div className="text-[10px] text-slate-400">L1 + L2 cache</div>
            </div>
          </div>
          <div className="w-full max-w-lg mt-3 border-t-2 border-dashed border-slate-300 pt-3 text-center">
            <span className="text-xs font-bold text-slate-500 bg-slate-100 px-4 py-1 rounded">Shared Bus / Crossbar</span>
          </div>
          <div className="w-full max-w-lg mt-3 bg-gradient-to-r from-purple-50 to-violet-50 rounded-xl border border-purple-300 p-3 text-center">
            <Database size={16} className="text-purple-600 mx-auto mb-1" />
            <div className="text-xs font-bold text-purple-700">Shared Main Memory</div>
          </div>
        </Diagram>
      </Section>

      <Section title="Non-Uniform Memory Access (NUMA)">
        <InfoCard title="NUMA" type="tip">
          In NUMA, each processor has its own local memory. Accessing local memory is fast; accessing remote memory (another processor's memory) is slower. NUMA improves scalability over SMP by eliminating bus contention.
        </InfoCard>
        <div className="grid sm:grid-cols-2 gap-4 mb-3">
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <div className="bg-cyan-500 w-3 h-3 rounded-full" />
              <h4 className="font-bold text-sm text-slate-900">Local Access</h4>
            </div>
            <p className="text-xs text-slate-500">Memory attached to the same processor node. Fast (e.g., 100ns latency). No interconnect overhead.</p>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <div className="bg-amber-500 w-3 h-3 rounded-full" />
              <h4 className="font-bold text-sm text-slate-900">Remote Access</h4>
            </div>
            <p className="text-xs text-slate-500">Memory attached to another processor node. Slower (e.g., 200-300ns). Traverses the interconnect.</p>
          </div>
        </div>
        <CodeBlock code={`// NUMA-aware programming (Linux)
// libnuma: bind memory to specific nodes

#include <numa.h>

void numa_example() {
    int node = 0;  // NUMA node
    void *mem = numa_alloc_local(1024 * 1024);
    // Memory allocated on local node - fast access
    
    // Bind thread to specific CPU
    struct bitmask *mask = numa_allocate_cpumask();
    numa_bitmask_setbit(mask, 0);  // CPU 0
    numa_sched_setaffinity(0, mask);
}`} language="c" />
      </Section>

      <Section title="Amdahl's Law">
        <InfoCard title="Amdahl's Law" type="info">
          Amdahl's Law states that the maximum speedup of a parallel system is limited by the fraction of the program that must be executed serially. Speedup = 1 / (P + (1-P)/N) where P is the serial fraction and N is the number of processors.
        </InfoCard>

        <div className="bg-gradient-to-r from-cyan-50 to-blue-50 rounded-xl p-5 border border-cyan-200 mb-5 text-center">
          <strong className="text-lg font-mono text-slate-800">
            Speedup = 1 / (P + (1-P) / N)
          </strong>
          <p className="text-xs text-slate-500 mt-2">
            P = serial fraction, N = number of processors
          </p>
        </div>

        <button onClick={() => setExpandedAmdahl(!expandedAmdahl)}
          className="w-full flex items-center justify-between bg-gradient-to-r from-cyan-50 to-blue-50 rounded-xl p-4 border border-cyan-200 cursor-pointer mb-4">
          <span className="font-bold text-sm text-slate-900">🎮 Interactive: Amdahl's Law Calculator</span>
          <span className="text-xs text-cyan-600">{expandedAmdahl ? "▲ Hide" : "▼ Show"}</span>
        </button>

        {expandedAmdahl && (
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm mb-4">
            <div className="mb-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-600">Number of Cores: <strong className="text-cyan-700">{numCores}</strong></span>
              </div>
              <input type="range" min={1} max={256} value={numCores} onChange={e => setNumCores(Number(e.target.value))}
                className="w-full accent-cyan-600 cursor-pointer" />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                <span>1</span><span>4</span><span>16</span><span>64</span><span>256</span>
              </div>
            </div>

            <div className="mb-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-600">Serial Fraction: <strong className="text-amber-700">{serialFraction}%</strong></span>
              </div>
              <input type="range" min={0} max={100} value={serialFraction} onChange={e => setSerialFraction(Number(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer" />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                <span>0%</span><span>25%</span><span>50%</span><span>75%</span><span>100%</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="bg-cyan-50 rounded-xl p-3 text-center border border-cyan-200">
                <div className="text-[10px] font-bold uppercase text-cyan-600">Speedup</div>
                <div className="text-xl font-black text-cyan-700">{speedup.toFixed(2)}x</div>
              </div>
              <div className="bg-emerald-50 rounded-xl p-3 text-center border border-emerald-200">
                <div className="text-[10px] font-bold uppercase text-emerald-600">Efficiency</div>
                <div className="text-xl font-black text-emerald-700">{(efficiency * 100).toFixed(0)}%</div>
              </div>
              <div className="bg-purple-50 rounded-xl p-3 text-center border border-purple-200">
                <div className="text-[10px] font-bold uppercase text-purple-600">Max Speedup</div>
                <div className="text-xl font-black text-purple-700">{(1 / p).toFixed(1)}x</div>
              </div>
            </div>
          </div>
        )}

        <InfoCard title="Key Insight" type="tip">
          Even with infinite processors, speedup is limited to 1/P. If 10% of a program is serial, the maximum speedup is 10x — no matter how many cores you add. This is why optimizing the serial portion is critical.
        </InfoCard>

        <div className="overflow-x-auto">
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100">
                <th className="p-2 text-left font-bold text-slate-600">Serial %</th>
                <th className="p-2 text-right font-bold text-slate-600">2 cores</th>
                <th className="p-2 text-right font-bold text-slate-600">4 cores</th>
                <th className="p-2 text-right font-bold text-slate-600">8 cores</th>
                <th className="p-2 text-right font-bold text-slate-600">16 cores</th>
                <th className="p-2 text-right font-bold text-slate-600">∞ cores</th>
              </tr>
            </thead>
            <tbody>
              {[1, 5, 10, 25, 50].map(pct => {
                const sp = pct / 100;
                return (
                  <tr key={pct} className="border-t border-slate-100">
                    <td className="p-2 font-bold text-slate-700">{pct}%</td>
                    <td className="p-2 text-right text-slate-600">{(1 / (sp + (1-sp)/2)).toFixed(2)}x</td>
                    <td className="p-2 text-right text-slate-600">{(1 / (sp + (1-sp)/4)).toFixed(2)}x</td>
                    <td className="p-2 text-right text-slate-600">{(1 / (sp + (1-sp)/8)).toFixed(2)}x</td>
                    <td className="p-2 text-right text-slate-600">{(1 / (sp + (1-sp)/16)).toFixed(2)}x</td>
                    <td className="p-2 text-right text-blue-600 font-semibold">{(1 / sp).toFixed(1)}x</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Section>

      <Section title="Parallel Speedup & Efficiency">
        <InfoCard title="Key Metrics" type="info">
          <strong>Speedup</strong> = T(1) / T(N) — how much faster with N processors. <strong>Efficiency</strong> = Speedup / N — how well processors are utilized. <strong>Linear speedup</strong> (speedup = N) means perfect scaling. Sub-linear speedup (speedup &lt; N) indicates overhead or serial bottlenecks.
        </InfoCard>
        <div className="grid sm:grid-cols-3 gap-4 mb-3">
          {[
            { type: "Linear Speedup", speedup: "S = N", efficiency: "100%", desc: "Perfect scaling. Every processor adds full value.", color: "text-emerald-600" },
            { type: "Sub-linear", speedup: "S < N", efficiency: "< 100%", desc: "Overhead from communication, sync, or serial sections.", color: "text-amber-600" },
            { type: "Super-linear", speedup: "S > N", efficiency: "> 100%", desc: "Cache effects or memory access improvements cause >N speedup.", color: "text-purple-600" },
          ].map(item => (
            <div key={item.type} className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
              <h4 className={`font-bold text-sm ${item.color} mb-1`}>{item.type}</h4>
              <div className="text-xs text-slate-500">{item.desc}</div>
              <div className="flex gap-2 mt-2">
                <span className="text-[10px] font-mono bg-slate-100 px-2 py-0.5 rounded">{item.speedup}</span>
                <span className="text-[10px] font-mono bg-slate-100 px-2 py-0.5 rounded">{item.efficiency}</span>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Code Example: OpenMP Parallelism">
        <CodeBlock code={`// OpenMP: shared-memory multiprocessing
#include <omp.h>
#include <stdio.h>

int main() {
    int n = 1000000;
    double sum = 0.0;
    double *arr = malloc(n * sizeof(double));
    
    // Initialize
    for (int i = 0; i < n; i++) arr[i] = 1.0;
    
    // Parallel reduction with 4 threads
    #pragma omp parallel for num_threads(4) reduction(+:sum)
    for (int i = 0; i < n; i++) {
        sum += arr[i];  // Each thread handles 250K elements
    }
    
    printf("Sum = %f\\n", sum);
    printf("Threads: %d, Speedup: ~%dx\\n",
           omp_get_max_threads(), omp_get_max_threads());
    return 0;
}`} language="c" />
      </Section>

      <Section title="Multiprocessor Challenges">
        <div className="grid sm:grid-cols-2 gap-4">
          {[
            { title: "Cache Coherence", desc: "Multiple caches may hold stale copies of shared data. Solution: snooping protocols (MESI) or directory-based protocols.", icon: "🔄" },
            { title: "Memory Consistency", desc: "Order in which memory operations appear to different processors. Models: Sequential Consistency, Release Consistency.", icon: "📋" },
            { title: "Synchronization", desc: "Locks, semaphores, barriers needed to coordinate access. Can become a bottleneck at scale.", icon: "🔒" },
            { title: "Load Balancing", desc: "Uneven work distribution leaves some processors idle. Dynamic scheduling helps but adds overhead.", icon: "⚖️" },
          ].map(item => (
            <div key={item.title} className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
              <div className="text-lg mb-2">{item.icon}</div>
              <h4 className="font-bold text-sm text-slate-900 mb-1">{item.title}</h4>
              <p className="text-xs text-slate-500">{item.desc}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Interview Questions">
        <InterviewQuestion question="What is the difference between tightly coupled and loosely coupled multiprocessors?" answer="Tightly coupled systems share a single memory accessed equally by all processors via a bus/crossbar (SMP). Fast communication but limited scalability. Loosely coupled systems have private memory per processor, communicating via message passing (clusters). High scalability but slower communication and explicit programming required." />
        <InterviewQuestion question="Explain Amdahl's Law and its implications." answer="Amdahl's Law: Speedup = 1/(P + (1-P)/N) where P is the serial fraction. As N → ∞, max speedup → 1/P. Even 10% serial code limits speedup to 10x regardless of cores. The implication: identify and optimize the serial bottleneck before adding more processors." />
        <InterviewQuestion question="What is SMP and how does it differ from NUMA?" answer="SMP (Symmetric Multiprocessing): all processors share a single memory with uniform access latency via a shared bus. NUMA (Non-Uniform Memory Access): each processor has local memory (fast) and can access remote memory (slower). SMP is simpler but doesn't scale beyond 8-16 processors. NUMA scales to hundreds." />
        <InterviewQuestion question="What factors cause sub-linear speedup in parallel systems?" answer="Sub-linear speedup is caused by: (1) Serial sections — Amdahl's Law limits apply. (2) Communication overhead — processors spend time sending/receiving data. (3) Synchronization overhead — locks and barriers add waiting time. (4) Load imbalance — some processors finish early and idle. (5) Resource contention — bus/memory conflicts increase with more processors." />
      </Section>
    </div>
  );
}
