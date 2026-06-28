"use client";

import { useState } from "react";
import Link from "next/link";
import { Home, ChevronRight, Cpu, Zap, HardDrive, Database, Archive } from "lucide-react";
import { Section, InfoCard, CodeBlock, Diagram, InterviewQuestion } from "../components";

const HIERARCHY = [
  { level: "Registers", size: "~1 KB", speed: "0.3 ns", cost: "$$$$$", icon: Cpu, color: "bg-red-500", desc: "Inside CPU, word-size storage" },
  { level: "L1 Cache", size: "~128 KB", speed: "1 ns", cost: "$$$$", icon: Zap, color: "bg-orange-500", desc: "On-chip, per-core" },
  { level: "L2 Cache", size: "~1 MB", speed: "5 ns", cost: "$$$", icon: Zap, color: "bg-amber-500", desc: "On-chip, per-core or shared" },
  { level: "L3 Cache", size: "~16 MB", speed: "15 ns", cost: "$$", icon: Zap, color: "bg-yellow-500", desc: "Shared across cores" },
  { level: "RAM", size: "~32 GB", speed: "60 ns", cost: "$", icon: Database, color: "bg-emerald-500", desc: "Main memory (DRAM)" },
  { level: "SSD", size: "~2 TB", speed: "100 µs", cost: "¢", icon: HardDrive, color: "bg-blue-500", desc: "Solid-state storage" },
  { level: "HDD", size: "~10 TB", speed: "10 ms", cost: "¢", icon: Archive, color: "bg-indigo-500", desc: "Magnetic disk storage" },
  { level: "Tape", size: "~100 TB", speed: "60 s", cost: "¢", icon: Archive, color: "bg-purple-500", desc: "Archival cold storage" },
];

const ACCESS_TABLE = [
  { level: "Register", time: "0.3 ns", size: "~1 KB", managed: "Compiler", latency: "1 cycle" },
  { level: "L1 Cache", time: "1 ns", size: "~128 KB", managed: "Hardware", latency: "3-4 cycles" },
  { level: "L2 Cache", time: "5 ns", size: "~1 MB", managed: "Hardware", latency: "10-15 cycles" },
  { level: "L3 Cache", time: "15 ns", size: "~16 MB", managed: "Hardware", latency: "30-50 cycles" },
  { level: "RAM (DRAM)", time: "60 ns", size: "~32 GB", managed: "OS + Hardware", latency: "150-300 cycles" },
  { level: "SSD", time: "100 µs", size: "~2 TB", managed: "OS", latency: "~300K cycles" },
  { level: "HDD", time: "10 ms", size: "~10 TB", managed: "OS", latency: "~30M cycles" },
  { level: "Tape", time: "60 s", size: "~100 TB", managed: "Operator", latency: "~180B cycles" },
];

const LOCALITY_EXAMPLES = [
  { type: "Temporal Locality", desc: "Recently accessed data tends to be accessed again soon.", code: "for (int i = 0; i < 1000; i++) sum += arr[k];  // arr[k] reused 1000x", icon: "🔄" },
  { type: "Spatial Locality", desc: "Data near recently accessed data is likely to be accessed.", code: "for (int i = 0; i < 1000; i++) sum += arr[i];  // sequential access pattern", icon: "↔️" },
];

export default function MemoryHierarchyPage() {
  const [hitRate, setHitRate] = useState(95);
  const [missPenalty, setMissPenalty] = useState(100);
  const [hitTime, setHitTime] = useState(2);
  const [expandedRow, setExpandedRow] = useState<number | null>(null);

  const avgAccessTime = hitTime + ((1 - hitRate / 100) * missPenalty);

  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      <div className="flex items-center gap-2 mb-6 text-xs text-slate-500">
        <Link href="/tools/arch" className="text-cyan-600 no-underline flex items-center gap-1.5 hover:text-cyan-800 transition">
          <Home size={16} /> Architecture
        </Link>
        <ChevronRight size={16} />
        <span className="text-slate-900 font-semibold">Memory Hierarchy</span>
      </div>

      <div className="mb-10">
        <h1 className="text-4xl font-extrabold text-slate-900 mb-3">🗂️ Memory Hierarchy</h1>
        <p className="text-base text-slate-500 leading-relaxed max-w-xl">
          The memory hierarchy organizes storage from fast/expensive (registers) to slow/cheap (tape). Understanding this tradeoff is fundamental to computer architecture.
        </p>
      </div>

      <Section title="The Hierarchy Pyramid">
        <InfoCard title="Core Principle" type="info">
          Faster memory costs more per bit. The hierarchy exploits locality: keep frequently used data in fast, small memory and the rest in slow, large memory.
        </InfoCard>

        <Diagram title="Memory Hierarchy: Speed vs Size">
          <div className="flex flex-col items-center w-full max-w-lg">
            {HIERARCHY.map((item, i) => {
              const Icon = item.icon;
              const width = 100 - i * 10;
              return (
                <div
                  key={i}
                  className={`${item.color} text-white w-full rounded-lg p-3 mb-1.5 flex items-center gap-3 cursor-pointer transition-all hover:scale-105 hover:shadow-lg`}
                  style={{ maxWidth: `${width}%` }}
                  onClick={() => setExpandedRow(expandedRow === i ? null : i)}
                >
                  <Icon size={20} className="shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-sm">{item.level}</div>
                    <div className="text-[10px] text-white/80">Size: {item.size} · Speed: {item.speed}</div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="font-mono text-xs">{item.cost}</div>
                    <div className="text-[10px] text-white/70">/bit</div>
                  </div>
                </div>
              );
            })}
          </div>
        </Diagram>
        {expandedRow !== null && (
          <div className="bg-cyan-50 border border-cyan-200 rounded-xl p-4 mb-4 -mt-2 animate-pulse">
            <p className="text-sm text-cyan-800">{HIERARCHY[expandedRow].desc}</p>
          </div>
        )}
      </Section>

      <Section title="Locality of Reference">
        <InfoCard title="Why Hierarchy Works" type="tip">
          Programs spend 90% of their time accessing only 10% of their code/data. The hierarchy exploits this by keeping the hot 10% in fast memory.
        </InfoCard>

        <div className="grid sm:grid-cols-2 gap-4 mb-4">
          {LOCALITY_EXAMPLES.map((ex, i) => (
            <div key={i} className="bg-white rounded-xl border border-slate-200 p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">{ex.icon}</span>
                <h4 className="text-sm font-bold text-slate-900">{ex.type}</h4>
              </div>
              <p className="text-xs text-slate-500 mb-3">{ex.desc}</p>
              <CodeBlock code={ex.code} language="c" />
            </div>
          ))}
        </div>
      </Section>

      <Section title="Access Time Comparison">
        <div className="overflow-x-auto mb-4">
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100">
                {["Level", "Access Time", "Typical Size", "Managed By", "CPU Latency"].map((h, i) => (
                  <th key={i} className="text-left p-3 font-bold text-slate-700 border-b-2 border-slate-200">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ACCESS_TABLE.map((row, i) => (
                <tr key={i} className={`border-b border-slate-100 ${i % 2 === 0 ? "bg-white" : "bg-slate-50"} hover:bg-cyan-50 transition`}>
                  <td className="p-3 font-semibold text-slate-900">{row.level}</td>
                  <td className="p-3 font-mono text-cyan-700 font-bold">{row.time}</td>
                  <td className="p-3 text-slate-500">{row.size}</td>
                  <td className="p-3 text-slate-500">{row.managed}</td>
                  <td className="p-3 font-mono text-slate-600">{row.latency}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <InfoCard title="Mind the Gap" type="warning">
          The speed gap between CPU registers and HDD is 7+ orders of magnitude. A single HDD access costs ~30 million CPU cycles — equivalent to millions of operations.
        </InfoCard>
      </Section>

      <Section title="Interactive: Average Access Time Calculator">
        <InfoCard title="Formula" type="info">
          Average Access Time = Hit Time + (Miss Rate × Miss Penalty). A higher hit rate dramatically improves performance.
        </InfoCard>

        <div className="bg-white rounded-xl border border-slate-200 p-6 mb-4">
          <div className="grid sm:grid-cols-3 gap-6 mb-6">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">Hit Rate: {hitRate}%</label>
              <input type="range" min="50" max="100" value={hitRate} onChange={e => setHitRate(Number(e.target.value))}
                className="w-full accent-cyan-600" />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1"><span>50%</span><span>100%</span></div>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">Hit Time: {hitTime} cycles</label>
              <input type="range" min="1" max="20" value={hitTime} onChange={e => setHitTime(Number(e.target.value))}
                className="w-full accent-cyan-600" />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1"><span>1</span><span>20</span></div>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">Miss Penalty: {missPenalty} cycles</label>
              <input type="range" min="10" max="500" value={missPenalty} onChange={e => setMissPenalty(Number(e.target.value))}
                className="w-full accent-cyan-600" />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1"><span>10</span><span>500</span></div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl p-5 text-white text-center">
            <p className="text-sm text-white/80 mb-1">Average Memory Access Time</p>
            <p className="text-4xl font-extrabold font-mono">{avgAccessTime.toFixed(2)} <span className="text-lg font-normal">cycles</span></p>
            <div className="flex justify-center gap-6 mt-3 text-xs text-white/70">
              <span>Hit: {hitTime} cycles</span>
              <span>Miss Rate: {(100 - hitRate)}%</span>
              <span>Miss: {missPenalty} cycles</span>
            </div>
          </div>

          {avgAccessTime < 5 && (
            <p className="text-emerald-600 text-xs mt-3 text-center font-semibold">Excellent! Near-ideal access time.</p>
          )}
          {avgAccessTime >= 5 && avgAccessTime < 20 && (
            <p className="text-amber-600 text-xs mt-3 text-center font-semibold">Reasonable access time. Consider optimizing hit rate.</p>
          )}
          {avgAccessTime >= 20 && (
            <p className="text-pink-600 text-xs mt-3 text-center font-semibold">Poor locality-detailed environment. The hierarchy is not working efficiently.</p>
          )}
        </div>
      </Section>

      <Section title="Code Example: Memory Access Profiler">
        <CodeBlock code={`# Simulate memory hierarchy access
class MemoryAccess:
    def __init__(self, hit_time=2, miss_penalty=100):
        self.hit_time = hit_time
        self.miss_penalty = miss_penalty
        self.hits = 0
        self.misses = 0

    def access(self, address):
        """Simulate a memory access"""
        if self._is_cached(address):
            self.hits += 1
            return self.hit_time
        else:
            self.misses += 1
            self._cache_block(address)
            return self.hit_time + self.miss_penalty

    def avg_access_time(self):
        rate = self.hits / (self.hits + self.misses + 1e-9)
        return self.hit_time + (1 - rate) * self.miss_penalty

    def _is_cached(self, addr):
        return hash(addr) % 100 < 90  # 90% hit simulation`} language="python" />
      </Section>

      <Section title="Interview Questions">
        <div className="space-y-3">
          <InterviewQuestion question="Explain the memory hierarchy and why it exists." answer="The memory hierarchy exists because no single storage technology can be simultaneously fast, large, and cheap. Registers are fastest but tiny (~KB); tape is largest but ~60s access. The hierarchy arranges memory in levels: faster/smaller near CPU, slower/larger further away. It exploits locality to give the illusion of fast, large storage at reasonable cost." />
          <InterviewQuestion question="What is temporal vs spatial locality? Give examples." answer="Temporal locality: recently accessed data is accessed again soon (e.g., a loop counter variable reused each iteration). Spatial locality: data near recently accessed data is accessed soon (e.g., iterating through an array sequentially). Cache exploits temporal by keeping data in cache, and spatial by loading cache lines (blocks of adjacent data)." />
          <InterviewQuestion question="How does the memory hierarchy improve system performance?" answer="It exploits locality: the CPU spends 90%+ of time accessing the fastest levels (registers/cache). Cache hit rates of 95-99% mean most accesses are served in 1-15 cycles rather than the 100+ cycles for RAM. This gives the performance of fast memory with the capacity of slow memory at a reasonable cost." />
          <InterviewQuestion question="What happens if the hit rate drops from 99% to 90%?" answer="Average access time = hit_time + (miss_rate × miss_penalty). With hit_time=2, miss_penalty=100: at 99% hit rate → 2 + 0.01×100 = 3 cycles. At 90% → 2 + 0.10×100 = 12 cycles (4× slower). This shows why even small miss rate increases have outsized impact." />
        </div>
      </Section>
    </div>
  );
}
