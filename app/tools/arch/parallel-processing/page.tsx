"use client";

import { useState } from "react";
import Link from "next/link";
import { Home, ChevronRight, Cpu, Server, Database, BarChart3 } from "lucide-react";
import { Section, InfoCard, CodeBlock, Diagram, InterviewQuestion, AnimatedFlow } from "../components";

const PARALLELISM_TYPES = [
  {
    name: "Instruction-Level (ILP)",
    desc: "Multiple instructions executed simultaneously within a single core. Achieved via pipelining, superscalar execution, and out-of-order execution.",
    example: "Modern CPUs execute 4-6 instructions per cycle",
    icon: "⚡",
  },
  {
    name: "Data-Level (DLP)",
    desc: "Same operation performed on multiple data elements simultaneously. SIMD instructions (SSE, AVX) and vector processors.",
    example: "AVX-512: 16 single-precision ops per instruction",
    icon: "📊",
  },
  {
    name: "Thread-Level (TLP)",
    desc: "Multiple threads or processes running concurrently on multiple cores or processors. Includes hyperthreading and multicore.",
    example: "16-core CPU running 32 threads via SMT",
    icon: "🧵",
  },
];

export default function ParallelProcessingPage() {
  const [serialFraction, setSerialFraction] = useState(10);
  const [numCores, setNumCores] = useState(8);
  const [expandedAmdahl, setExpandedAmdahl] = useState(true);
  const [expandedGustafson, setExpandedGustafson] = useState(false);
  const [activeMemory, setActiveMemory] = useState(0);
  const [activeModel, setActiveModel] = useState(0);

  const p = serialFraction / 100;
  const amdahlSpeedup = 1 / (p + (1 - p) / numCores);
  const gustafsonSpeedup = numCores - (numCores - 1) * p;

  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      <div className="flex items-center gap-2 mb-6 text-xs text-slate-500">
        <Link href="/tools/arch" className="text-cyan-600 no-underline flex items-center gap-1.5 hover:text-cyan-800 transition">
          <Home size={16} /> Architecture
        </Link>
        <ChevronRight size={16} />
        <span className="text-slate-900 font-semibold">Parallel Processing</span>
      </div>

      <div className="mb-10">
        <h1 className="text-4xl font-extrabold text-slate-900 mb-3">🚀 Parallel Processing</h1>
        <p className="text-base text-slate-500 leading-relaxed max-w-xl">
          Breaking problems into smaller tasks that execute simultaneously. Explore types of parallelism, Amdahl's and Gustafson's Laws, shared vs distributed memory, and parallel programming models.
        </p>
      </div>

      <Section title="What is Parallel Processing?">
        <InfoCard title="Core Concept" type="info">
          Parallel processing is the simultaneous use of multiple compute resources to solve a computational problem. Instead of doing one thing at a time, the problem is broken into smaller independent parts that execute concurrently, dramatically reducing total execution time.
        </InfoCard>
        <div className="grid sm:grid-cols-3 gap-4 mb-4">
          {[
            { label: "Why Parallel?", desc: "Clock speeds plateaued (~4 GHz). Transistor density still grows but power limits prevent faster single cores. Parallelism is the only path to continued performance gains.", color: "from-cyan-500 to-blue-600" },
            { label: "Where Used?", desc: "Scientific computing, AI/ML training, graphics rendering, databases, web servers, video encoding — virtually all performance-critical computing.", color: "from-emerald-500 to-teal-600" },
            { label: "Key Challenge", desc: "Not all code can be parallelized. Dependencies, synchronization, communication overhead, and load imbalance limit speedup.", color: "from-amber-500 to-orange-600" },
          ].map(item => (
            <div key={item.label} className={`bg-gradient-to-br ${item.color} rounded-xl p-5 text-white shadow-md`}>
              <h3 className="font-bold text-sm mb-2">{item.label}</h3>
              <p className="text-xs text-white/90 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
        <AnimatedFlow steps={[
          { label: "Decompose", desc: "Split problem" },
          { label: "Assign", desc: "Distribute work" },
          { label: "Execute", desc: "Compute in parallel" },
          { label: "Combine", desc: "Merge results" },
          { label: "Output", desc: "Final result" },
        ]} />
      </Section>

      <Section title="Types of Parallelism">
        <div className="grid sm:grid-cols-3 gap-4 mb-4">
          {PARALLELISM_TYPES.map((pt) => (
            <div key={pt.name} className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:border-cyan-400 hover:shadow-md transition">
              <div className="text-2xl mb-3">{pt.icon}</div>
              <h3 className="font-bold text-sm text-slate-900 mb-2">{pt.name}</h3>
              <p className="text-xs text-slate-500 mb-3 leading-relaxed">{pt.desc}</p>
              <div className="bg-cyan-50 rounded-lg px-3 py-2 text-[10px] font-mono text-cyan-700 font-bold">
                {pt.example}
              </div>
            </div>
          ))}
        </div>
        <InfoCard title="Flynn's Taxonomy" type="tip">
          Parallel architectures are classified by Flynn's Taxonomy: <strong>SISD</strong> (single instruction, single data — classic uniprocessor), <strong>SIMD</strong> (vector processors, GPUs), <strong>MISD</strong> (rare — fault-tolerant systems), <strong>MIMD</strong> (multicore CPUs, clusters — most common parallel architecture).
        </InfoCard>
      </Section>

      <Section title="Amdahl's Law & Gustafson's Law">
        <div className="grid sm:grid-cols-2 gap-4 mb-5">
          <div className="bg-gradient-to-r from-cyan-50 to-blue-50 rounded-xl p-5 border border-cyan-200">
            <h3 className="font-bold text-sm text-slate-900 mb-2">Amdahl's Law (Fixed-Size)</h3>
            <div className="text-center py-3">
              <strong className="text-lg font-mono text-slate-800">S = 1 / (P + (1-P)/N)</strong>
            </div>
            <p className="text-xs text-slate-500">Speedup bounded by serial fraction. Adding cores gives diminishing returns.</p>
          </div>
          <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl p-5 border border-emerald-200">
            <h3 className="font-bold text-sm text-slate-900 mb-2">Gustafson's Law (Scaled-Speed)</h3>
            <div className="text-center py-3">
              <strong className="text-lg font-mono text-slate-800">S = N - (N-1) × P</strong>
            </div>
            <p className="text-xs text-slate-500">Larger problems can use more processors. Speedup scales with problem size.</p>
          </div>
        </div>

        <button onClick={() => setExpandedAmdahl(!expandedAmdahl)}
          className="w-full flex items-center justify-between bg-gradient-to-r from-cyan-50 to-blue-50 rounded-xl p-4 border border-cyan-200 cursor-pointer mb-3">
          <span className="font-bold text-sm text-slate-900">🎮 Interactive Amdahl Calculator</span>
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
              <div className="bg-cyan-50 rounded-xl p-4 text-center border border-cyan-200">
                <div className="text-[10px] font-bold uppercase text-cyan-600 mb-1">Amdahl Speedup</div>
                <div className="text-2xl font-black text-cyan-700">{amdahlSpeedup.toFixed(2)}x</div>
                <div className="text-[10px] text-slate-400 mt-1">fixed problem size</div>
              </div>
              <div className="bg-emerald-50 rounded-xl p-4 text-center border border-emerald-200">
                <div className="text-[10px] font-bold uppercase text-emerald-600 mb-1">Gustafson Speedup</div>
                <div className="text-2xl font-black text-emerald-700">{gustafsonSpeedup.toFixed(2)}x</div>
                <div className="text-[10px] text-slate-400 mt-1">scaled problem size</div>
              </div>
              <div className="bg-purple-50 rounded-xl p-4 text-center border border-purple-200">
                <div className="text-[10px] font-bold uppercase text-purple-600 mb-1">Max Amdahl Speedup</div>
                <div className="text-2xl font-black text-purple-700">{(1 / p).toFixed(1)}x</div>
                <div className="text-[10px] text-slate-400 mt-1">infinite cores limit</div>
              </div>
            </div>

            <div className="mt-5 bg-slate-50 rounded-xl p-4 border border-slate-200">
              <div className="flex items-center gap-2 mb-2">
                <BarChart3 size={14} className="text-slate-500" />
                <span className="text-xs font-bold text-slate-600">Parallel Portion: {(1 - p) * 100}% — Cores Available: {numCores}</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-4 overflow-hidden">
                <div className="bg-gradient-to-r from-amber-400 to-amber-500 h-full rounded-full transition-all" style={{ width: `${p * 100}%` }} />
              </div>
              <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                <span className="text-amber-600 font-bold">Serial: {serialFraction}%</span>
                <span className="text-cyan-600 font-bold">Parallel: {(100 - serialFraction)}%</span>
              </div>
            </div>
          </div>
        )}

        <button onClick={() => setExpandedGustafson(!expandedGustafson)}
          className="w-full flex items-center justify-between bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl p-4 border border-emerald-200 cursor-pointer mb-3">
          <span className="font-bold text-sm text-slate-900">🎯 Interactive Gustafson Calculator</span>
          <span className="text-xs text-emerald-600">{expandedGustafson ? "▲ Hide" : "▼ Show"}</span>
        </button>

        {expandedGustafson && (
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm mb-4">
            <p className="text-xs text-slate-500 mb-4 leading-relaxed">
              Gustafson observes that as problem size grows, the serial portion often stays constant while parallel work scales. 
              With {numCores} cores and {serialFraction}% serial, scaled speedup reaches <strong className="text-emerald-700">{gustafsonSpeedup.toFixed(2)}x</strong>.
              The key insight: users typically solve larger problems on larger machines, not the same problem faster.
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-100">
                    <th className="p-2 text-left font-bold text-slate-600">Cores</th>
                    <th className="p-2 text-right font-bold text-slate-600">Amdahl S(P)</th>
                    <th className="p-2 text-right font-bold text-slate-600">Gustafson S(P)</th>
                  </tr>
                </thead>
                <tbody>
                  {[1, 2, 4, 8, 16, 32, 64, 128].map(n => {
                    const a = 1 / (p + (1 - p) / n);
                    const g = n - (n - 1) * p;
                    return (
                      <tr key={n} className="border-t border-slate-100">
                        <td className="p-2 font-bold text-slate-700">{n}</td>
                        <td className="p-2 text-right text-cyan-600 font-semibold">{a.toFixed(2)}x</td>
                        <td className="p-2 text-right text-emerald-600 font-semibold">{g.toFixed(2)}x</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </Section>

      <Section title="Shared Memory vs Distributed Memory">
        <div className="grid sm:grid-cols-2 gap-4 mb-4">
          {[
            {
              name: "Shared Memory",
              desc: "All processors access a single global address space via a shared bus or crossbar. Communication is implicit through memory reads/writes.",
              pros: ["Easy programming model", "Fast data sharing", "Familiar semantics"],
              cons: ["Scalability limited by bus", "Cache coherence overhead", "Synchronization needed"],
              icon: <Database size={24} className="text-purple-600" />,
              color: "border-purple-200 bg-purple-50",
            },
            {
              name: "Distributed Memory",
              desc: "Each processor has private memory. Communication is explicit via message passing (send/receive) over a network interconnect.",
              pros: ["Highly scalable", "No bus contention", "Cost-effective clusters"],
              cons: ["Explicit message passing", "Higher latency", "Data partitioning needed"],
              icon: <Server size={24} className="text-blue-600" />,
              color: "border-blue-200 bg-blue-50",
            },
          ].map((m, i) => (
            <button key={m.name} onClick={() => setActiveMemory(i)}
              className={`rounded-xl p-5 border-2 text-left cursor-pointer transition-all ${
                activeMemory === i ? `${m.color} shadow-md ring-2 ring-cyan-400` : "bg-white border-slate-200 hover:border-slate-300"
              }`}>
              <div className="flex items-center gap-3 mb-3">
                {m.icon}
                <h4 className="font-bold text-sm text-slate-900">{m.name}</h4>
              </div>
              <p className="text-xs text-slate-500 mb-3 leading-relaxed">{m.desc}</p>
              <div className="grid grid-cols-2 gap-2 text-[10px]">
                <div><span className="text-emerald-600 font-bold">Pros:</span> {m.pros.join(", ")}</div>
                <div><span className="text-red-500 font-bold">Cons:</span> {m.cons.join(", ")}</div>
              </div>
            </button>
          ))}
        </div>
        <Diagram title="Shared vs Distributed Memory Architecture">
          <div className="grid sm:grid-cols-2 gap-6 w-full">
            <div className="text-center">
              <div className="flex justify-center gap-2 mb-2">
                {[0, 1, 2, 3].map(c => (
                  <div key={c} className="bg-purple-100 border-2 border-purple-300 rounded-lg p-2 w-14">
                    <Cpu size={16} className="text-purple-600 mx-auto" />
                    <div className="text-[8px] font-bold text-purple-700">CPU{c}</div>
                  </div>
                ))}
              </div>
              <div className="border-t-2 border-dashed border-purple-300 pt-2 mb-2">
                <span className="text-[9px] font-bold text-purple-500 bg-purple-50 px-2 py-0.5 rounded">Shared Bus</span>
              </div>
              <div className="bg-purple-50 border-2 border-purple-300 rounded-lg p-2 mx-auto max-w-[200px]">
                <Database size={14} className="text-purple-600 mx-auto" />
                <div className="text-[9px] font-bold text-purple-700">Shared Memory</div>
              </div>
              <div className="text-[9px] text-slate-400 mt-1">UMA / SMP</div>
            </div>
            <div className="text-center">
              <div className="flex justify-center gap-2 mb-2">
                {[0, 1, 2, 3].map(c => (
                  <div key={c} className="flex flex-col items-center">
                    <div className="bg-blue-100 border-2 border-blue-300 rounded-lg p-2 w-14">
                      <Cpu size={16} className="text-blue-600 mx-auto" />
                      <div className="text-[8px] font-bold text-blue-700">CPU{c}</div>
                    </div>
                    <div className="bg-blue-50 border border-blue-200 rounded p-1 mt-1 w-14">
                      <div className="text-[7px] font-bold text-blue-600">Mem{c}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="text-[9px] text-slate-400 mt-1">Interconnect Network</div>
              <div className="text-[9px] text-slate-400">Message Passing</div>
            </div>
          </div>
        </Diagram>
      </Section>

      <Section title="Parallel Programming Models">
        <div className="grid sm:grid-cols-3 gap-4 mb-4">
          {[
            {
              name: "OpenMP",
              desc: "Shared-memory API with compiler directives (#pragma). Easy to use for loop parallelism on multicore CPUs.",
              example: "#pragma omp parallel for",
              best: "CPU multicore, shared mem",
              icon: "🧵",
              color: "border-emerald-200 bg-emerald-50",
            },
            {
              name: "MPI",
              desc: "Message Passing Interface for distributed memory systems. Explicit send/receive between processes.",
              example: "MPI_Send() / MPI_Recv()",
              best: "Clusters, distributed mem",
              icon: "📨",
              color: "border-blue-200 bg-blue-50",
            },
            {
              name: "CUDA",
              desc: "NVIDIA's GPU programming model. Thousands of lightweight threads execute SIMT (Single Instruction, Multiple Thread).",
              example: "kernel<<<grid,block>>>()",
              best: "GPU acceleration, DLP",
              icon: "🎮",
              color: "border-purple-200 bg-purple-50",
            },
          ].map((model, i) => (
            <button key={model.name} onClick={() => setActiveModel(i)}
              className={`rounded-xl p-5 border-2 text-left cursor-pointer transition-all ${
                activeModel === i ? `${model.color} shadow-md ring-2 ring-cyan-400` : "bg-white border-slate-200 hover:border-slate-300"
              }`}>
              <div className="text-2xl mb-2">{model.icon}</div>
              <h4 className="font-bold text-sm text-slate-900 mb-2">{model.name}</h4>
              <p className="text-xs text-slate-500 mb-3 leading-relaxed">{model.desc}</p>
              <div className="bg-white rounded-lg px-3 py-2 text-[10px] font-mono text-slate-700 font-bold border border-slate-200 mb-2">
                {model.example}
              </div>
              <span className="text-[9px] bg-slate-100 px-2 py-0.5 rounded font-bold text-slate-500">{model.best}</span>
            </button>
          ))}
        </div>
      </Section>

      <Section title="Code Example: Parallel Sum">
        <p className="text-sm text-slate-600 mb-3">
          Comparing sequential and parallel summation of an array. The parallel version splits the work across multiple threads and combines results.
        </p>
        <CodeBlock code={`// Parallel sum using OpenMP (shared memory)
#include <omp.h>
#include <stdio.h>
#include <stdlib.h>

#define N 100000000  // 100 million elements

int main() {
    double *data = (double*)malloc(N * sizeof(double));
    double sum = 0.0;
    
    // Initialize with test data
    for (int i = 0; i < N; i++) data[i] = 1.0;
    
    // Sequential sum (baseline)
    double t0 = omp_get_wtime();
    for (int i = 0; i < N; i++) sum += data[i];
    double t1 = omp_get_wtime();
    printf("Sequential: sum=%.0f, time=%.3fs\\n", sum, t1 - t0);
    
    // Parallel sum with reduction
    sum = 0.0;
    t0 = omp_get_wtime();
    #pragma omp parallel for num_threads(8) reduction(+:sum)
    for (int i = 0; i < N; i++) {
        sum += data[i];  // Each thread handles N/8 elements
    }
    t1 = omp_get_wtime();
    printf("Parallel (8 threads): sum=%.0f, time=%.3fs\\n", sum, t1 - t0);
    printf("Speedup: %.2fx\\n", (t1 - t0) > 0 ? (t1 - t0) / (t1 - t0) : 0);
    
    free(data);
    return 0;
}`} language="c" />
        <InfoCard title="MPI Parallel Sum" type="tip">
          In distributed memory systems, each MPI process computes a partial sum on its local data, then uses <strong>MPI_Reduce</strong> to combine all partial sums into the final result on the root process.
        </InfoCard>
        <CodeBlock code={`// Parallel sum using MPI (distributed memory)
#include <mpi.h>
#include <stdio.h>
#include <stdlib.h>

#define N 100000000

int main(int argc, char **argv) {
    MPI_Init(&argc, &argv);
    int rank, size;
    MPI_Comm_rank(MPI_COMM_WORLD, &rank);
    MPI_Comm_size(MPI_COMM_WORLD, &size);
    
    int chunk = N / size;
    double *local = (double*)malloc(chunk * sizeof(double));
    for (int i = 0; i < chunk; i++) local[i] = 1.0;
    
    double local_sum = 0.0, global_sum = 0.0;
    for (int i = 0; i < chunk; i++) local_sum += local[i];
    
    // Reduce all partial sums to root (rank 0)
    MPI_Reduce(&local_sum, &global_sum, 1, MPI_DOUBLE, MPI_SUM, 0, MPI_COMM_WORLD);
    
    if (rank == 0)
        printf("Global sum = %.0f (computed by %d processes)\\n", global_sum, size);
    
    MPI_Finalize();
    return 0;
}`} language="c" />
      </Section>

      <Section title="Interview Questions">
        <InterviewQuestion question="What is the difference between Amdahl's Law and Gustafson's Law?" answer="Amdahl's Law assumes a fixed problem size and predicts diminishing returns as processors increase: S = 1/(P + (1-P)/N). Gustafson's Law assumes the problem size scales with available processors: S = N - (N-1)P. Gustafson is more optimistic — it reflects real-world usage where larger systems tackle larger problems, keeping the serial fraction proportionally smaller." />
        <InterviewQuestion question="Explain instruction-level, data-level, and thread-level parallelism." answer="ILP (Instruction-Level): executing multiple instructions per cycle within one core via pipelining, superscalar, out-of-order execution. DLP (Data-Level): applying one operation to multiple data elements simultaneously (SIMD/vector instructions). TLP (Thread-Level): running multiple threads/processes on multiple cores, including SMT/hyperthreading. Modern CPUs exploit all three levels simultaneously." />
        <InterviewQuestion question="What are the trade-offs between shared memory and distributed memory systems?" answer="Shared memory: easier to program (global address space), fast implicit communication, but limited scalability (bus contention, cache coherence overhead). Distributed memory: highly scalable (each node has private memory), no coherence issues, but requires explicit message passing (MPI), higher latency, and manual data partitioning. Modern supercomputers use hybrid approaches with both." />
        <InterviewQuestion question="How does the parallel sum algorithm work and what limits its speedup?" answer="The parallel sum splits the array across threads/processes. Each computes a partial sum, then a reduction combines all partial sums. Speedup is limited by: (1) serial portion — the final reduction is inherently serial (O(log P) with tree reduction). (2) Load imbalance — if data distribution is uneven. (3) Memory bandwidth — all threads compete for memory. (4) False sharing — threads on the same cache line cause invalidation overhead." />
      </Section>
    </div>
  );
}
