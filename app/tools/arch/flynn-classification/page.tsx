"use client";

import { useState } from "react";
import Link from "next/link";
import { Home, ChevronRight, ChevronDown, ChevronUp } from "lucide-react";
import { Section, InfoCard, CodeBlock, Diagram, InterviewQuestion, CPUStage } from "../components";

const TAXONOMY = [
  {
    id: "SISD",
    name: "Single Instruction, Single Data",
    icon: "💻",
    desc: "A single processor executes one instruction stream on one data stream. This is the traditional von Neumann architecture.",
    examples: ["Single-core CPU", "Microcontrollers", "Legacy mainframes"],
    color: "from-blue-500 to-cyan-600",
    light: "bg-blue-50 border-blue-300",
    text: "text-blue-700",
  },
  {
    id: "SIMD",
    name: "Single Instruction, Multiple Data",
    icon: "🎯",
    desc: "One instruction operates on multiple data elements simultaneously. Used for data-parallel workloads like graphics, audio, and scientific computing.",
    examples: ["GPU shaders", "SSE/AVX instructions", "Vector processors (Cray-1)"],
    color: "from-emerald-500 to-teal-600",
    light: "bg-emerald-50 border-emerald-300",
    text: "text-emerald-700",
  },
  {
    id: "MISD",
    name: "Multiple Instruction, Single Data",
    icon: "🔄",
    desc: "Multiple processors execute different instructions on the same data stream. Rarely used in practice; mainly seen in fault-tolerant systems.",
    examples: ["Fault-tolerant flight control", "Some systolic arrays", "Redundant systems (3x voting)"],
    color: "from-amber-500 to-orange-600",
    light: "bg-amber-50 border-amber-300",
    text: "text-amber-700",
  },
  {
    id: "MIMD",
    name: "Multiple Instruction, Multiple Data",
    icon: "🌐",
    desc: "Multiple processors execute independent instruction streams on independent data. Most common form of parallel computer today.",
    examples: ["Multi-core CPUs", "Cluster computers", "Distributed systems"],
    color: "from-purple-500 to-violet-600",
    light: "bg-purple-50 border-purple-300",
    text: "text-purple-700",
  },
];

const SIMD_EXAMPLES = [
  { name: "MMX", year: 1997, width: 64, desc: "Multimedia Extensions — integer SIMD on x86" },
  { name: "SSE", year: 1999, width: 128, desc: "Streaming SIMD Extensions — single & double precision" },
  { name: "AVX", year: 2011, width: 256, desc: "Advanced Vector Extensions — floating-point SIMD" },
  { name: "AVX-512", year: 2013, width: 512, desc: "512-bit SIMD — 16 single-precision ops per instruction" },
];

export default function FlynnClassificationPage() {
  const [activeCategory, setActiveCategory] = useState(0);
  const [expandedSimd, setExpandedSimd] = useState(false);

  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      <div className="flex items-center gap-2 mb-6 text-xs text-slate-500">
        <Link href="/tools/arch" className="text-cyan-600 no-underline flex items-center gap-1.5 hover:text-cyan-800 transition">
          <Home size={16} /> Architecture
        </Link>
        <ChevronRight size={16} />
        <span className="text-slate-900 font-semibold">Flynn Classification</span>
      </div>

      <div className="mb-10">
        <h1 className="text-4xl font-extrabold text-slate-900 mb-3">📊 Flynn's Taxonomy</h1>
        <p className="text-base text-slate-500 leading-relaxed max-w-xl">
          Michael Flynn proposed a classification of computer architectures based on the number of instruction streams and data streams. The four categories define how parallelism is organized in a system.
        </p>
      </div>

      <Section title="The Taxonomy">
        <InfoCard title="Flynn's Classification" type="info">
          Proposed in 1966, Flynn's taxonomy categorizes computers by whether they have single or multiple instruction streams combined with single or multiple data streams. This creates a 2×2 matrix of four architecture types.
        </InfoCard>

        <Diagram title="Flynn's 2×2 Classification Matrix">
          <div className="grid grid-cols-2 gap-3 w-full max-w-xl">
            {TAXONOMY.map((cat, i) => (
              <button key={cat.id} onClick={() => setActiveCategory(i)}
                className={`rounded-xl p-5 border-2 cursor-pointer text-left transition-all ${
                  activeCategory === i
                    ? `${cat.light} shadow-md ring-2 ring-slate-200 scale-[1.02]`
                    : "bg-white border-slate-200 hover:border-slate-300"
                }`}>
                <div className="text-3xl mb-2">{cat.icon}</div>
                <h4 className="font-bold text-sm text-slate-900">{cat.id}</h4>
                <p className="text-[10px] text-slate-500 mt-1">{cat.name}</p>
                <div className={`mt-2 h-1.5 rounded-full bg-gradient-to-r ${cat.color}`} />
              </button>
            ))}
          </div>
        </Diagram>

        <div className={`rounded-xl p-6 border-2 ${TAXONOMY[activeCategory].light} mb-4`}>
          <div className="flex items-center gap-3 mb-3">
            <span className="text-3xl">{TAXONOMY[activeCategory].icon}</span>
            <div>
              <h3 className="font-bold text-lg text-slate-900">{TAXONOMY[activeCategory].id}</h3>
              <p className={`text-sm font-semibold ${TAXONOMY[activeCategory].text}`}>{TAXONOMY[activeCategory].name}</p>
            </div>
          </div>
          <p className="text-sm text-slate-600 mb-3 leading-relaxed">{TAXONOMY[activeCategory].desc}</p>
          <div>
            <p className="text-xs font-semibold text-slate-500 mb-1.5">Examples:</p>
            <div className="flex flex-wrap gap-2">
              {TAXONOMY[activeCategory].examples.map((ex, i) => (
                <span key={i} className="bg-white px-3 py-1 rounded-lg text-xs font-bold text-slate-600 border border-slate-200">{ex}</span>
              ))}
            </div>
          </div>
        </div>
      </Section>

      <Section title="SISD — Single Instruction, Single Data">
        <CPUStage stage="SISD" desc="One instruction at a time on one data item" icon="💻" />
        <p className="text-sm text-slate-600 mt-3 mb-4">
          A single processor executes one instruction stream, operating on one data stream at a time. This is the classic von Neumann model. Most early computers and simple microcontrollers are SISD.
        </p>
        <CodeBlock code={`// SISD: one addition at a time
int a[100], b[100], c[100];
for (int i = 0; i < 100; i++) {
    c[i] = a[i] + b[i];  // one element per iteration
}`} language="c" />
      </Section>

      <Section title="SIMD — Single Instruction, Multiple Data">
        <InfoCard title="Data Parallelism" type="tip">
          SIMD performs the same operation on multiple data elements in parallel. A single instruction controls multiple ALUs or processing elements. Ideal for vector operations, image processing, and scientific computing.
        </InfoCard>
        <div className="grid sm:grid-cols-2 gap-4 mb-4">
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
            <h4 className="font-bold text-sm text-slate-900 mb-2">Scalar (SISD)</h4>
            <CodeBlock code={`// One at a time
c[0] = a[0] + b[0]
c[1] = a[1] + b[1]
c[2] = a[2] + b[2]
c[3] = a[3] + b[3]`} language="assembly" />
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
            <h4 className="font-bold text-sm text-slate-900 mb-2">Vector (SIMD)</h4>
            <CodeBlock code={`// All at once!
VADD c, a, b
; c[0..3] = a[0..3] + b[0..3]
; Single instruction, 4 operations`} language="assembly" />
          </div>
        </div>

        <button onClick={() => setExpandedSimd(!expandedSimd)}
          className="w-full flex items-center justify-between bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl p-4 border border-emerald-200 cursor-pointer">
          <span className="font-bold text-sm text-emerald-700">SIMD Extensions (MMX, SSE, AVX)</span>
          {expandedSimd ? <ChevronUp size={18} className="text-emerald-600" /> : <ChevronDown size={18} className="text-emerald-600" />}
        </button>

        {expandedSimd && (
          <div className="mt-4 space-y-3">
            {SIMD_EXAMPLES.map(ex => (
              <div key={ex.name} className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm flex items-center gap-4">
                <div className="bg-gradient-to-br from-emerald-500 to-teal-500 text-white w-12 h-12 rounded-xl flex items-center justify-center font-bold text-xs shrink-0">{ex.name}</div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900">{ex.name} ({ex.year})</h4>
                  <p className="text-xs text-slate-500">{ex.desc}</p>
                  <span className="text-[10px] font-mono text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded mt-1 inline-block">{ex.width}-bit</span>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-4">
          <CodeBlock code={`// SIMD in C using SSE intrinsics
#include <xmmintrin.h>
void vector_add_sse(float *a, float *b, float *c, int n) {
    for (int i = 0; i < n; i += 4) {
        __m128 va = _mm_load_ps(&a[i]);   // load 4 floats
        __m128 vb = _mm_load_ps(&b[i]);   // load 4 floats
        __m128 vc = _mm_add_ps(va, vb);   // 4 adds in 1 instruction
        _mm_store_ps(&c[i], vc);          // store 4 results
    }
}`} language="c" />
        </div>
      </Section>

      <Section title="MISD — Multiple Instruction, Single Data">
        <CPUStage stage="MISD" desc="Different instructions on the same data" icon="🔄" />
        <p className="text-sm text-slate-600 mt-3 mb-3">
          Multiple processors execute different instructions on the same data stream. This is the least common category. Practical applications are rare — mainly found in fault-tolerant systems where multiple processors independently process the same input and votes on the result.
        </p>
        <InfoCard title="MISD in Practice" type="info">
          The space shuttle's flight control system used four redundant computers executing the same program on the same inputs — a form of MISD for fault tolerance. Some systolic arrays also exhibit MISD-like behavior.
        </InfoCard>
      </Section>

      <Section title="MIMD — Multiple Instruction, Multiple Data">
        <CPUStage stage="MIMD" desc="Different instructions on different data" icon="🌐" />
        <p className="text-sm text-slate-600 mt-3 mb-3">
          Each processor executes its own instruction stream on its own data. This is the most flexible and most common parallel architecture. Multi-core CPUs, clusters, and distributed systems are all MIMD.
        </p>
        <div className="grid sm:grid-cols-2 gap-4 mb-3">
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
            <h4 className="font-bold text-sm text-slate-900 mb-2">Shared Memory MIMD</h4>
            <p className="text-xs text-slate-500">All processors share a single address space. Communication via shared variables. Examples: SMP, multi-core CPUs.</p>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
            <h4 className="font-bold text-sm text-slate-900 mb-2">Distributed Memory MIMD</h4>
            <p className="text-xs text-slate-500">Each processor has private memory. Communication via message passing. Examples: clusters, supercomputers.</p>
          </div>
        </div>
      </Section>

      <Section title="Code Example: SIMD vs Scalar Performance">
        <CodeBlock code={`// Performance comparison
// Scalar vs SIMD vector addition

double start = clock();
for (int i = 0; i < N; i++) {
    C[i] = A[i] + B[i];   // Scalar
}
double scalar_time = clock() - start;

start = clock();
for (int i = 0; i < N; i += 4) {
    _mm_store_ps(&C[i],
        _mm_add_ps(
            _mm_load_ps(&A[i]),
            _mm_load_ps(&B[i])
        )
    );  // SIMD - 4x less iterations
}
double simd_time = clock() - start;

print(f"Speedup: {scalar_time/simd_time:.1f}x");`} language="c" />
      </Section>

      <Section title="Interview Questions">
        <InterviewQuestion question="What are the four categories of Flynn's Taxonomy?" answer="SISD (Single Instruction, Single Data) — traditional single-core CPU. SIMD (Single Instruction, Multiple Data) — vector processors, GPUs. MISD (Multiple Instruction, Single Data) — fault-tolerant systems. MIMD (Multiple Instruction, Multiple Data) — multi-core CPUs, clusters." />
        <InterviewQuestion question="Why is MISD rarely used in practice?" answer="MISD requires multiple processors to execute different instructions on the same data simultaneously. This is inherently inefficient because most algorithms don't benefit from different operations on the same data. The main use case is fault-tolerant systems where redundant processors run the same program on the same input and vote on the result." />
        <InterviewQuestion question="What is the difference between SIMD and MIMD?" answer="SIMD executes the same instruction on multiple data elements in lockstep — ideal for data-parallel workloads. MIMD allows each processor to execute different instructions on different data — more flexible but requires more complex synchronization. SIMD is simpler hardware; MIMD is more general-purpose." />
        <InterviewQuestion question="How do SIMD extensions like SSE and AVX improve performance?" answer="SIMD extensions add wide registers (128-bit SSE, 256-bit AVX, 512-bit AVX-512) that hold multiple data elements. A single instruction operates on all elements simultaneously. For example, one AVX instruction can do 8 single-precision additions, providing up to 8x speedup for vectorizable code." />
      </Section>
    </div>
  );
}
