"use client";

import { useState } from "react";
import Link from "next/link";
import { Home, ChevronRight, Cpu, Monitor, Share2, Database, ArrowRight, Zap, Server } from "lucide-react";
import { Section, InfoCard, CodeBlock, Diagram, InterviewQuestion, CPUStage, AnimatedFlow } from "../components";

const MEMORY_MODELS = [
  {
    name: "UMA (Uniform Memory Access)",
    desc: "All processors share the same memory with equal access latency. Bus-based SMP systems.",
    pros: ["Simple programming model", "Cache coherence easy", "Low latency"],
    cons: ["Limited scalability (bus contention)", "Few processors (2-8)"],
    example: "Dual-core desktop CPU",
  },
  {
    name: "NUMA (Non-Uniform Memory Access)",
    desc: "Each processor has local memory with fast access. Remote memory access is slower.",
    pros: ["Better scalability", "Higher aggregate bandwidth"],
    cons: ["Complex programming", "Remote access penalty"],
    example: "AMD EPYC, Intel Xeon (2-8 sockets)",
  },
  {
    name: "CC-NUMA (Cache-Coherent NUMA)",
    desc: "NUMA with hardware-maintained cache coherence across nodes.",
    pros: ["Scalable + coherent", "Transparent to software"],
    cons: ["Complex hardware", "Higher directory overhead"],
    example: "SGI Origin, modern multi-socket servers",
  },
];

const MESI_STATES = [
  { state: "M", name: "Modified", desc: "Cache line is dirty (modified) and exclusive to this cache. Main memory is stale.", color: "bg-red-100 border-red-400 text-red-700" },
  { state: "E", name: "Exclusive", desc: "Cache line is clean and only in this cache. Same as main memory.", color: "bg-blue-100 border-blue-400 text-blue-700" },
  { state: "S", name: "Shared", desc: "Cache line is clean and may exist in multiple caches.", color: "bg-emerald-100 border-emerald-400 text-emerald-700" },
  { state: "I", name: "Invalid", desc: "Cache line is not valid. Must fetch from another cache or memory.", color: "bg-slate-100 border-slate-400 text-slate-600" },
];

export default function SimdMimdPage() {
  const [activeMemory, setActiveMemory] = useState(0);
  const [expandedCache, setExpandedCache] = useState(false);
  const [mesiState, setMesiState] = useState(0);

  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      <div className="flex items-center gap-2 mb-6 text-xs text-slate-500">
        <Link href="/tools/arch" className="text-cyan-600 no-underline flex items-center gap-1.5 hover:text-cyan-800 transition">
          <Home size={16} /> Architecture
        </Link>
        <ChevronRight size={16} />
        <span className="text-slate-900 font-semibold">SIMD & MIMD</span>
      </div>

      <div className="mb-10">
        <h1 className="text-4xl font-extrabold text-slate-900 mb-3">🎬 SIMD & MIMD Architectures</h1>
        <p className="text-base text-slate-500 leading-relaxed max-w-xl">
          Deep dive into Single Instruction Multiple Data (SIMD) and Multiple Instruction Multiple Data (MIMD) architectures, including vector processing, memory models, and cache coherence.
        </p>
      </div>

      <Section title="SIMD Architecture">
        <InfoCard title="SIMD Processing" type="info">
          SIMD architecture uses a single control unit that broadcasts instructions to multiple processing elements (PEs). Each PE has its own register set and executes the same instruction on different data. This is lockstep parallelism.
        </InfoCard>

        <Diagram title="SIMD Architecture">
          <div className="flex flex-col items-center gap-3 w-full max-w-lg">
            <div className="bg-gradient-to-r from-blue-500 to-cyan-600 text-white px-8 py-3 rounded-xl font-bold text-sm">Control Unit (Single Instruction)</div>
            <ArrowRight size={20} className="text-slate-400" />
            <div className="grid grid-cols-4 gap-3 w-full">
              {["PE 0", "PE 1", "PE 2", "PE 3"].map((pe, i) => (
                <div key={pe} className="bg-emerald-50 border-2 border-emerald-400 rounded-xl p-3 text-center">
                  <div className="text-xs font-bold text-emerald-700">{pe}</div>
                  <div className="text-[10px] text-slate-500">Data[{i}]</div>
                  <div className="mt-1 bg-white rounded-lg px-2 py-1 text-[10px] font-mono">R{i}=A[i]+B[i]</div>
                </div>
              ))}
            </div>
          </div>
        </Diagram>

        <h3 className="font-bold text-base text-slate-900 mb-3">Array Processors</h3>
        <p className="text-sm text-slate-600 mb-4">
          Array processors (also called vector processors) are specialized SIMD machines. Examples: Cray-1 (1976), Thinking Machines CM-2, and modern GPU compute units. They excel at regular, data-parallel computations.
        </p>
        <CodeBlock code={`// Vector processor pseudo-code
// Cray-1 style vector operations

VLOAD V1, A      ; Load vector A into V1 (64 elements)
VLOAD V2, B      ; Load vector B into V2
VADD  V3, V1, V2 ; V3 = V1 + V2 (64 adds in parallel)
VSTORE V3, C     ; Store result to C

// Chaining: pipeline vector operations
VMUL  V4, V3, V5 ; Multiply result with another vector
// Results flow directly between vector units`} language="assembly" />
      </Section>

      <Section title="MIMD Architecture">
        <InfoCard title="MIMD Processing" type="tip">
          MIMD is the most flexible parallel architecture. Each processor fetches its own instructions and operates on its own data. Processors communicate through shared memory or message passing.
        </InfoCard>

        <h3 className="font-bold text-base text-slate-900 mb-3">Shared Memory MIMD</h3>
        <p className="text-sm text-slate-600 mb-3">
          All processors share a single address space. Communication is implicit via shared variables. Synchronization uses locks, semaphores, and barriers.
        </p>
        <CodeBlock code={`// Shared memory MIMD (pseudo-code)
shared int counter = 0;
lock mutex;

void worker(int id) {
    while (1) {
        acquire(mutex);
        if (counter >= N) {
            release(mutex);
            break;
        }
        int work = counter++;
        release(mutex);
        process(work);  // Each CPU works independently
    }
}
// All CPUs run the same code but on different data`} language="c" />
      </Section>

      <Section title="Memory Models in MIMD">
        <div className="grid sm:grid-cols-3 gap-3 mb-4">
          {MEMORY_MODELS.map((m, i) => (
            <button key={m.name} onClick={() => setActiveMemory(i)}
              className={`rounded-xl p-4 border-2 text-left cursor-pointer transition-all ${
                activeMemory === i ? "bg-purple-50 border-purple-300 shadow-md" : "bg-white border-slate-200 hover:border-slate-300"
              }`}>
              <h4 className="font-bold text-sm text-slate-900 mb-1">{m.name}</h4>
              <p className="text-[11px] text-slate-500">{m.desc}</p>
            </button>
          ))}
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm mb-4">
          <h4 className="font-bold text-sm text-slate-900 mb-3">{MEMORY_MODELS[activeMemory].name}</h4>
          <p className="text-sm text-slate-600 mb-3">{MEMORY_MODELS[activeMemory].desc}</p>
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div>
              <p className="text-xs font-semibold text-emerald-600 mb-1">Advantages</p>
              <ul className="text-xs text-slate-500 space-y-1">
                {MEMORY_MODELS[activeMemory].pros.map((p, i) => <li key={i}>✓ {p}</li>)}
              </ul>
            </div>
            <div>
              <p className="text-xs font-semibold text-red-500 mb-1">Limitations</p>
              <ul className="text-xs text-slate-500 space-y-1">
                {MEMORY_MODELS[activeMemory].cons.map((c, i) => <li key={i}>✗ {c}</li>)}
              </ul>
            </div>
          </div>
          <span className="text-[10px] bg-slate-100 px-2 py-1 rounded font-bold text-slate-500">Example: {MEMORY_MODELS[activeMemory].example}</span>
        </div>
      </Section>

      <Section title="Cache Coherence & MESI Protocol">
        <InfoCard title="Cache Coherence Problem" type="warning">
          In shared-memory MIMD systems, multiple processors cache the same memory location. When one processor writes to its cache, the others must see the update. Without coherence, stale data is read.
        </InfoCard>

        <button onClick={() => setExpandedCache(!expandedCache)}
          className="w-full flex items-center justify-between bg-gradient-to-r from-purple-50 to-violet-50 rounded-xl p-4 border border-purple-200 cursor-pointer mb-4">
          <span className="font-bold text-sm text-purple-700">🔍 Explore MESI Protocol States</span>
          <span className="text-xs text-purple-600">{expandedCache ? "▲" : "▼"}</span>
        </button>

        {expandedCache && (
          <div className="mb-4">
            <div className="flex gap-2 mb-4">
              {MESI_STATES.map((s, i) => (
                <button key={s.state} onClick={() => setMesiState(i)}
                  className={`flex-1 text-center p-2 rounded-lg border-2 text-xs font-bold cursor-pointer transition-all ${
                    mesiState === i ? s.color + " shadow-md" : "bg-white border-slate-200 text-slate-400"
                  }`}>{s.state}</button>
              ))}
            </div>
            <div className={`rounded-xl p-4 border-2 ${MESI_STATES[mesiState].color}`}>
              <h4 className="font-bold text-sm mb-1">{MESI_STATES[mesiState].state}: {MESI_STATES[mesiState].name}</h4>
              <p className="text-xs text-slate-600">{MESI_STATES[mesiState].desc}</p>
            </div>
          </div>
        )}

        <Diagram title="MESI Protocol State Machine">
          <div className="grid grid-cols-4 gap-2 w-full max-w-xl">
            {MESI_STATES.map(s => (
              <div key={s.state} className={`rounded-xl p-3 text-center border-2 ${s.color}`}>
                <div className="text-2xl font-black">{s.state}</div>
                <div className="text-[10px] font-bold">{s.name}</div>
              </div>
            ))}
          </div>
          <AnimatedFlow steps={[
            { label: "Private Read", desc: "Load into cache" },
            { label: "Snoop", desc: "Monitor bus" },
            { label: "Invalidate", desc: "Kill copies" },
            { label: "Writeback", desc: "Update memory" },
          ]} />
        </Diagram>

        <CodeBlock code={`// MESI protocol transitions
// Core 0 reads address X:   I → E (Exclusive)
// Core 1 reads same X:      Core 0: E → S (Shared)
//                            Core 1: I → S (Shared)
// Core 0 writes to X:       Core 0: S → M (Modified)
//                            Core 1: S → I (Invalidate)
// Core 1 reads X again:     Core 0: M → S (Writeback + Share)
//                            Core 1: I → S (Shared)`} language="assembly" />
      </Section>

      <Section title="Code Example: MIMD with OpenMP">
        <CodeBlock code={`// OpenMP: Shared memory MIMD on CPU
#include <omp.h>
#define N 1000000

double sum_array(double *arr) {
    double sum = 0.0;
    #pragma omp parallel for reduction(+:sum)
    for (int i = 0; i < N; i++) {
        sum += arr[i];  // Each thread processes part
    }
    return sum;
}

// 4 cores → 4 threads → ~4x speedup
// Each thread: different instructions, different data
// True MIMD parallelism`} language="c" />
      </Section>

      <Section title="SIMD vs MIMD: Comparison">
        <div className="overflow-x-auto">
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100">
                <th className="p-2 text-left font-bold text-slate-600">Property</th>
                <th className="p-2 text-left font-bold text-slate-600">SIMD</th>
                <th className="p-2 text-left font-bold text-slate-600">MIMD</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["Control", "Single (one instruction)", "Multiple (per processor)"],
                ["Data", "Multiple elements", "Multiple streams"],
                ["Synchronization", "Inherent (lockstep)", "Explicit (locks/barriers)"],
                ["Programming", "Data-parallel languages", "Any model (shared/message)"],
                ["Hardware cost", "Lower (shared CU)", "Higher (per-processor logic)"],
                ["Scalability", "Limited by vector width", "Hundreds-thousands of cores"],
                ["Best for", "Regular data parallelism", "Irregular/task parallelism"],
                ["Examples", "GPU, vector processors", "Multi-core CPU, clusters"],
              ].map(([prop, simd, mimd], i) => (
                <tr key={i} className="border-t border-slate-100">
                  <td className="p-2 font-bold text-slate-700">{prop}</td>
                  <td className="p-2 text-slate-600">{simd}</td>
                  <td className="p-2 text-slate-600">{mimd}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Section title="Interview Questions">
        <InterviewQuestion question="What is the difference between SIMD and MIMD architectures?" answer="SIMD uses a single control unit to broadcast one instruction to multiple processing elements, each operating on different data in lockstep. MIMD allows each processor to fetch and execute its own instruction stream on its own data. SIMD is simpler and efficient for data-parallel workloads; MIMD is more flexible for general-purpose parallel computing." />
        <InterviewQuestion question="Explain UMA, NUMA, and CC-NUMA memory models." answer="UMA: all processors access shared memory with uniform latency. Simple but limited scalability. NUMA: each processor has local memory with fast access; remote access is slower. Scales better but programming is harder. CC-NUMA: NUMA with hardware cache coherence, transparent to software — combines scalability of NUMA with programmability of UMA." />
        <InterviewQuestion question="What is the MESI cache coherence protocol?" answer="MESI has four states: Modified (dirty, exclusive), Exclusive (clean, exclusive), Shared (clean, may be shared), Invalid (not in cache). When a processor writes, it invalidates other copies. State transitions are managed by a snooping cache controller watching the bus." />
        <InterviewQuestion question="How do array processors differ from conventional SIMD?" answer="Array processors are dedicated SIMD machines with many simple processing elements (PEs) controlled by one control unit. Conventional SIMD (SSE/AVX) extends a general-purpose CPU with vector registers and instructions. Array processors scale to hundreds of PEs; CPU SIMD is limited by vector register width (128-512 bits)." />
      </Section>
    </div>
  );
}
