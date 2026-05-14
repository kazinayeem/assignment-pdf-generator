"use client";

import { useState } from "react";
import Link from "next/link";
import { Home, ChevronRight, Cpu, Monitor, Grid3X3 } from "lucide-react";
import { Section, InfoCard, CodeBlock, Diagram, InterviewQuestion } from "../components";

const GPU_MEMORY = [
  { name: "Global Memory", size: "4-24 GB", bandwidth: "~900 GB/s", latency: "~400-800 cycles", color: "bg-purple-50 border-purple-300", text: "text-purple-700" },
  { name: "Shared Memory", size: "48-164 KB/SM", bandwidth: "~20 TB/s", latency: "~30 cycles", color: "bg-emerald-50 border-emerald-300", text: "text-emerald-700" },
  { name: "Registers", size: "64K per SM", bandwidth: "~100 TB/s", latency: "~1 cycle", color: "bg-amber-50 border-amber-300", text: "text-amber-700" },
  { name: "L1 Cache", size: "32-128 KB/SM", bandwidth: "~40 TB/s", latency: "~30 cycles", color: "bg-cyan-50 border-cyan-300", text: "text-cyan-700" },
  { name: "L2 Cache", size: "1-6 MB", bandwidth: "~5 TB/s", latency: "~200 cycles", color: "bg-blue-50 border-blue-300", text: "text-blue-700" },
  { name: "Constant Memory", size: "64 KB", bandwidth: "~10 GB/s", latency: "~200 cycles", color: "bg-rose-50 border-rose-300", text: "text-rose-700" },
];

export default function GpuBasicsPage() {
  const [activeMemoryIdx, setActiveMemoryIdx] = useState(0);
  const [simdStep, setSimdStep] = useState(0);

  const simdSteps = [
    { label: "Fetch", desc: "SIMD unit fetches one instruction from memory" },
    { label: "Broadcast", desc: "Instruction broadcast to all ALUs" },
    { label: "Execute", desc: "All ALUs execute same op on different data" },
    { label: "Write", desc: "Results written back in parallel" },
  ];

  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      <div className="flex items-center gap-2 mb-6 text-xs text-slate-500">
        <Link href="/tools/arch" className="text-cyan-600 no-underline flex items-center gap-1.5 hover:text-cyan-800 transition">
          <Home size={16} /> Architecture
        </Link>
        <ChevronRight size={16} />
        <span className="text-slate-900 font-semibold">GPU Basics</span>
      </div>

      <div className="mb-10">
        <h1 className="text-4xl font-extrabold text-slate-900 mb-3">🎮 GPU Basics</h1>
        <p className="text-base text-slate-500 leading-relaxed max-w-xl">
          Understand GPU architecture: CUDA cores, streaming multiprocessors, SIMT execution, memory hierarchy, and how GPUs achieve massive parallelism.
        </p>
      </div>

      <Section title="GPU vs CPU Architecture">
        <InfoCard title="Latency vs Throughput" type="info">
          CPUs are designed for low-latency sequential execution with large caches and complex control logic. GPUs are designed for high-throughput parallel execution with many simple cores, small caches, and massive thread-level parallelism.
        </InfoCard>
        <div className="grid sm:grid-cols-2 gap-4 mb-4">
          <div className="bg-gradient-to-br from-blue-50 to-white rounded-xl border border-blue-300 p-5">
            <Cpu size={24} className="text-blue-600 mb-2" />
            <h4 className="font-bold text-sm text-slate-900 mb-2">CPU (Latency-Optimized)</h4>
            <ul className="text-xs text-slate-500 space-y-1">
              <li>• Few powerful cores (2-16)</li>
              <li>• Large caches (L1-L3)</li>
              <li>• Branch prediction + OoO</li>
              <li>• ~1-4 threads per core</li>
              <li>• Focus: single-thread performance</li>
            </ul>
          </div>
          <div className="bg-gradient-to-br from-emerald-50 to-white rounded-xl border border-emerald-300 p-5">
            <Monitor size={24} className="text-emerald-600 mb-2" />
            <h4 className="font-bold text-sm text-slate-900 mb-2">GPU (Throughput-Optimized)</h4>
            <ul className="text-xs text-slate-500 space-y-1">
              <li>• Thousands of simple cores</li>
              <li>• Small caches per SM</li>
              <li>• SIMT execution model</li>
              <li>• ~64-256 threads per warp</li>
              <li>• Focus: parallel throughput</li>
            </ul>
          </div>
        </div>

        <Diagram title="CPU vs GPU Die Area Allocation">
          <div className="flex items-center gap-4 w-full max-w-xl">
            <div className="flex-1 bg-blue-100 rounded-xl p-3">
              <div className="text-xs font-bold text-center mb-3">CPU</div>
              <div className="space-y-1">
                <div className="bg-blue-400 text-white text-[10px] px-2 py-1 rounded text-center font-bold" style={{ height: "12px" }}>Control</div>
                <div className="bg-cyan-400 text-white text-[10px] px-2 py-1 rounded text-center font-bold" style={{ height: "20px" }}>Cache</div>
                <div className="bg-amber-400 text-white text-[10px] px-2 py-1 rounded text-center font-bold" style={{ height: "8px" }}>ALU</div>
              </div>
            </div>
            <div className="flex-1 bg-emerald-100 rounded-xl p-3">
              <div className="text-xs font-bold text-center mb-3">GPU</div>
              <div className="space-y-1">
                <div className="bg-emerald-400 text-white text-[10px] px-2 py-1 rounded text-center font-bold" style={{ height: "4px" }}>Ctrl</div>
                <div className="bg-emerald-400 text-white text-[10px] px-2 py-1 rounded text-center font-bold" style={{ height: "8px" }}>Cache</div>
                <div className="bg-amber-400 text-white text-[10px] px-2 py-1 rounded text-center font-bold" style={{ height: "28px" }}>ALU ALU ALU ALU ALU ALU</div>
              </div>
            </div>
          </div>
        </Diagram>
      </Section>

      <Section title="CUDA Cores & Streaming Multiprocessors">
        <InfoCard title="GPU Building Blocks" type="tip">
          A GPU consists of multiple <strong>Streaming Multiprocessors (SMs)</strong>, each containing many <strong>CUDA cores</strong> (simple ALUs). Each SM has its own shared memory, register file, warp scheduler, and instruction cache.
        </InfoCard>

        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm mb-4">
          <div className="flex items-center gap-3 mb-3">
            <Grid3X3 size={20} className="text-emerald-600" />
            <h4 className="font-bold text-sm text-slate-900">Streaming Multiprocessor (SM) Internals</h4>
          </div>
          <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 mb-3">
            {Array.from({ length: 16 }, (_, i) => (
              <div key={i} className="bg-emerald-100 border border-emerald-300 rounded-lg p-1.5 text-center">
                <div className="text-[8px] font-bold text-emerald-700">CUDA Core</div>
                <div className="text-[8px] text-slate-500">{i + 1}</div>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-amber-50 rounded-lg p-2 text-center text-[10px] font-bold text-amber-700 border border-amber-200">Shared Mem 48KB</div>
            <div className="bg-purple-50 rounded-lg p-2 text-center text-[10px] font-bold text-purple-700 border border-purple-200">Warp Scheduler</div>
            <div className="bg-cyan-50 rounded-lg p-2 text-center text-[10px] font-bold text-cyan-700 border border-cyan-200">Register File 64K</div>
          </div>
        </div>
      </Section>

      <Section title="SIMT Execution Model">
        <InfoCard title="SIMT vs SIMD" type="info">
          SIMT (Single Instruction, Multiple Threads) is NVIDIA's execution model. Like SIMD, one instruction is executed by multiple threads. Unlike SIMD, threads are independent — each has its own program counter, registers, and can branch independently.
        </InfoCard>

        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm mb-4">
          <h4 className="font-bold text-sm text-slate-900 mb-3">Warp Execution</h4>
          <p className="text-xs text-slate-500 mb-3">
            Threads are grouped into <strong>warps</strong> (32 threads on NVIDIA GPUs). A warp executes one instruction at a time. All 32 threads execute the same instruction on different data. If threads diverge (different branches), both paths are serialized.
          </p>
          <div className="grid grid-cols-8 gap-1">
            {Array.from({ length: 32 }, (_, i) => (
              <div key={i} className={`rounded text-[8px] text-center py-1 font-bold text-white ${i % 4 === 0 ? "bg-emerald-500" : "bg-emerald-400"}`}>
                T{i}
              </div>
            ))}
          </div>
          <p className="text-[10px] text-slate-400 mt-2">Warp of 32 threads executing same instruction</p>
        </div>

        <h3 className="font-bold text-sm text-slate-900 mb-3">SIMT Execution Flow</h3>
        {simdSteps.map((step, i) => (
          <button key={step.label} onClick={() => setSimdStep(i)}
            className={`w-full text-left rounded-lg p-3 mb-1.5 border-2 transition-all cursor-pointer ${
              simdStep === i ? "bg-emerald-50 border-emerald-400" : "bg-white border-slate-200 hover:border-slate-300"
            }`}>
            <div className="flex items-center gap-2">
              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white ${
                simdStep === i ? "bg-emerald-500" : "bg-slate-300"
              }`}>{i + 1}</span>
              <div>
                <span className="font-bold text-sm text-slate-900">{step.label}</span>
                <p className="text-xs text-slate-500">{step.desc}</p>
              </div>
            </div>
          </button>
        ))}
      </Section>

      <Section title="GPU Memory Hierarchy">
        <div className="grid sm:grid-cols-3 gap-3 mb-4">
          {GPU_MEMORY.slice(0, 3).map((m, i) => (
            <button key={m.name} onClick={() => setActiveMemoryIdx(i)}
              className={`rounded-xl p-4 border-2 text-left cursor-pointer transition-all ${
                activeMemoryIdx === i ? `${m.color} shadow-md ring-2 ring-slate-200` : "bg-white border-slate-200 hover:border-slate-300"
              }`}>
              <h4 className="font-bold text-sm text-slate-900 mb-1">{m.name}</h4>
              <div className="space-y-0.5 text-[11px] text-slate-500">
                <p><strong>Size:</strong> {m.size}</p>
                <p><strong>BW:</strong> {m.bandwidth}</p>
                <p><strong>Latency:</strong> {m.latency}</p>
              </div>
            </button>
          ))}
        </div>

        <div className={`rounded-xl p-4 border-2 ${GPU_MEMORY[activeMemoryIdx].color}`}>
          <h4 className={`font-bold text-sm ${GPU_MEMORY[activeMemoryIdx].text} mb-1`}>{GPU_MEMORY[activeMemoryIdx].name}</h4>
          <div className="grid grid-cols-3 gap-2 text-xs text-slate-600">
            <div><strong>Size:</strong> {GPU_MEMORY[activeMemoryIdx].size}</div>
            <div><strong>Bandwidth:</strong> {GPU_MEMORY[activeMemoryIdx].bandwidth}</div>
            <div><strong>Latency:</strong> {GPU_MEMORY[activeMemoryIdx].latency}</div>
          </div>
        </div>

        <InfoCard title="Memory Access Patterns" type="warning">
          GPU performance is maximized when threads in a warp access <strong>coalesced</strong> memory — consecutive threads accessing consecutive addresses. Non-coalesced (strided/random) access wastes bandwidth and reduces throughput significantly.
        </InfoCard>
      </Section>

      <Section title="Parallel Processing on GPU">
        <InfoCard title="Massive Parallelism" type="tip">
          A modern GPU can run thousands of threads simultaneously. Occupancy = active warps / max warps per SM. Higher occupancy hides memory latency by switching to ready warps while others wait.
        </InfoCard>

        <CodeBlock code={`// CUDA kernel concept — vector addition
// Runs on GPU with thousands of threads

__global__ void vecAdd(float *A, float *B, float *C, int N) {
    // Each thread handles one element
    int i = blockIdx.x * blockDim.x + threadIdx.x;
    if (i < N) {
        C[i] = A[i] + B[i];  // Thousands of adds in parallel
    }
}

// Launch 256 threads per block, enough blocks for all N
int threadsPerBlock = 256;
int blocksPerGrid = (N + threadsPerBlock - 1) / threadsPerBlock;
vecAdd<<<blocksPerGrid, threadsPerBlock>>>(d_A, d_B, d_C, N);

// Speedup: 50-200x over CPU for data-parallel code`} language="c" />
      </Section>

      <Section title="Code Example: Matrix Multiplication">
        <CodeBlock code={`// GPU-accelerated matrix multiply (concept)
// C = A × B, each thread computes one element

__global__ void matMul(float *A, float *B, float *C, int N) {
    int row = blockIdx.y * blockDim.y + threadIdx.y;
    int col = blockIdx.x * blockDim.x + threadIdx.x;

    float sum = 0.0f;
    for (int k = 0; k < N; k++) {
        sum += A[row * N + k] * B[k * N + col];
    }
    C[row * N + col] = sum;
}

// Grid of 2D blocks: N×N threads total
dim3 blockSize(16, 16);
dim3 gridSize((N + 15)/16, (N + 15)/16);
matMul<<<gridSize, blockSize>>>(A, B, C, N);

// With shared memory tiling: 10-50x faster than CPU`} language="c" />
      </Section>

      <Section title="GPU vs CPU: When to Use Each">
        <div className="overflow-x-auto">
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100">
                <th className="p-2 text-left font-bold text-slate-600">Characteristic</th>
                <th className="p-2 text-left font-bold text-slate-600">CPU</th>
                <th className="p-2 text-left font-bold text-slate-600">GPU</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["Cores", "4-16", "1000-10000+"],
                ["Clock speed", "3-5 GHz", "1-2 GHz"],
                ["Cache", "Large (MB)", "Small (KB/SM)"],
                ["Memory BW", "~50 GB/s", "~900 GB/s"],
                ["Branch handling", "Excellent", "Poor (divergence)"],
                ["Best for", "Sequential, irregular", "Parallel, regular"],
                ["Programmability", "Easy", "Complex (CUDA/OpenCL)"],
                ["Power efficiency", "~15 W/core", "~5 W/core"],
              ].map(([char, cpu, gpu], i) => (
                <tr key={i} className="border-t border-slate-100">
                  <td className="p-2 font-bold text-slate-700">{char}</td>
                  <td className="p-2 text-slate-600">{cpu}</td>
                  <td className="p-2 text-slate-600">{gpu}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Section title="Interview Questions">
        <InterviewQuestion question="What is the difference between CPU and GPU architecture?" answer="CPUs are latency-optimized with few powerful cores, large caches, and complex control logic (branch prediction, OoO). GPUs are throughput-optimized with thousands of simple cores, small caches, and rely on massive thread-level parallelism to hide latency. CPUs excel at sequential tasks; GPUs excel at data-parallel workloads." />
        <InterviewQuestion question="What is SIMT and how does it differ from SIMD?" answer="SIMT (Single Instruction, Multiple Threads) is NVIDIA's execution model. Like SIMD, one instruction is executed by multiple threads. Unlike SIMD, each thread has its own program counter, registers, and can branch independently. SIMD operates on packed data elements in lockstep; SIMT operates on independent threads grouped into warps." />
        <InterviewQuestion question="What is a warp and what happens on branch divergence?" answer="A warp is a group of 32 threads that execute together on an SM. All threads in a warp execute the same instruction. When threads take different branches (divergence), all paths are serialized — one path executes while others are masked. This reduces utilization. Minimizing divergence is key to GPU performance." />
        <InterviewQuestion question="Explain the GPU memory hierarchy and how it affects performance." answer="GPU memory hierarchy: global (high capacity, high latency, ~900 GB/s), shared (low latency, per-SM, manually managed), registers (fastest, per-thread), constant (cached, read-only), L1/L2 cache. Key optimization: keeping data in shared memory (30-cycle latency) instead of global memory (400+ cycles). Coalesced global memory access maximizes bandwidth utilization." />
      </Section>
    </div>
  );
}
