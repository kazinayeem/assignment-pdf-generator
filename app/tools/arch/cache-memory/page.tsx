"use client";

import Link from "next/link";
import { Home, ChevronRight } from "lucide-react";
import { Section, InfoCard, CodeBlock, Diagram, MemoryBlock, AnimatedFlow, InterviewQuestion } from "../components";

export default function CacheMemoryPage() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      <div className="flex items-center gap-2 mb-6 text-xs text-slate-500">
        <Link href="/tools/arch" className="text-cyan-600 no-underline flex items-center gap-1.5 hover:text-cyan-800 transition">
          <Home size={16} /> Architecture
        </Link>
        <ChevronRight size={16} />
        <span className="text-slate-900 font-semibold">Cache Memory</span>
      </div>

      <div className="mb-10">
        <h1 className="text-4xl font-extrabold text-slate-900 mb-3">⚡ Cache Memory</h1>
        <p className="text-base text-slate-500 leading-relaxed max-w-xl">
          Cache is a small, fast memory that stores copies of frequently accessed data. Learn about cache organization, mapping techniques, and performance optimization.
        </p>
      </div>

      <Section title="What is Cache Memory?">
        <InfoCard title="Definition" type="info">
          Cache memory is a small-sized type of volatile computer memory that provides high-speed data access to the processor. It stores frequently used program instructions and data to reduce the average time to access data from the main memory.
        </InfoCard>

        <div className="grid sm:grid-cols-3 gap-4">
          {[
            { label: "L1 Cache", size: "16-128 KB", speed: "~1 ns" },
            { label: "L2 Cache", size: "128 KB - 1 MB", speed: "~5 ns" },
            { label: "L3 Cache", size: "1-32 MB", speed: "~15 ns" },
          ].map((c, i) => (
            <MemoryBlock key={i} label={c.label} size={c.size} speed={c.speed} />
          ))}
        </div>
      </Section>

      <Section title="Cache Mapping Techniques">
        <InfoCard title="Key Concept" type="tip">
          Cache mapping determines how memory blocks are placed in cache lines. The three main techniques are Direct Mapping, Associative Mapping, and Set-Associative Mapping.
        </InfoCard>

        <div className="grid sm:grid-cols-3 gap-4">
          {[
            { title: "Direct Mapping", desc: "Each memory block maps to exactly one cache line. Simple but leads to conflicts.", color: "bg-cyan-50 border-cyan-200" },
            { title: "Associative", desc: "Any block can go to any line. Flexible but requires complex hardware.", color: "bg-amber-50 border-amber-200" },
            { title: "Set-Associative", desc: "Hybrid: block maps to a set of lines. Best trade-off.", color: "bg-emerald-50 border-emerald-200" },
          ].map((m, i) => (
            <div key={i} className={`${m.color} border rounded-xl p-4`}>
              <h4 className="text-sm font-bold text-slate-900 mb-2">{m.title}</h4>
              <p className="text-xs text-slate-500 leading-relaxed">{m.desc}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Cache Performance Metrics">
        <div className="grid sm:grid-cols-2 gap-4">
          {[
            { term: "Hit Rate", def: "Percentage of accesses found in cache. Typical L1 hit rate: 90-95%." },
            { term: "Miss Rate", def: "Percentage of accesses NOT found in cache = 1 - Hit Rate." },
            { term: "Hit Time", def: "Time to access cache when data is found (typically 1-2 CPU cycles)." },
            { term: "Miss Penalty", def: "Extra time needed to fetch data from next level when cache misses." },
            { term: "Average Access Time", def: "Hit Time + (Miss Rate × Miss Penalty). Goal is to minimize this." },
            { term: "Locality", def: "Temporal: reuse same data. Spatial: use nearby data. Cache exploits both." },
          ].map((m, i) => (
            <div key={i} className="bg-white rounded-xl border border-slate-200 p-4">
              <h4 className="text-sm font-bold text-slate-900 mb-1">{m.term}</h4>
              <p className="text-xs text-slate-500">{m.def}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Cache Write Policies">
        <div className="grid sm:grid-cols-2 gap-4">
          {[
            { name: "Write-Through", desc: "Write to both cache AND main memory simultaneously. Simple but slow for writes.", pros: "Data consistency, simple", cons: "Slow writes, high bus traffic" },
            { name: "Write-Back", desc: "Write only to cache. Write back to memory when block is evicted.", pros: "Fast writes, less traffic", cons: "Complex, risk of data loss" },
          ].map((w, i) => (
            <div key={i} className="bg-white rounded-xl border border-slate-200 p-4">
              <h4 className="text-sm font-bold text-slate-900 mb-2">{w.name}</h4>
              <p className="text-xs text-slate-500 mb-3">{w.desc}</p>
              <div className="flex flex-col gap-1.5">
                <span className="text-[10px] font-semibold text-emerald-600">Pros: {w.pros}</span>
                <span className="text-[10px] font-semibold text-pink-600">Cons: {w.cons}</span>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Cache Access Flow">
        <AnimatedFlow steps={[
          { label: "CPU Request", desc: "Request address" },
          { label: "Check Cache", desc: "Tag compare" },
          { label: "Hit?", desc: "Found in cache?" },
          { label: "Return Data", desc: "Fast response" },
          { label: "Miss!", desc: "Fetch from RAM" },
        ]} />
      </Section>

      <Section title="Sample Code: Cache Simulator">
        <CodeBlock code={`class CacheLine:
    def __init__(self, size=64):
        self.valid = False
        self.tag = 0
        self.data = [0] * size
        self.last_access = 0

class DirectMappedCache:
    def __init__(self, num_lines=64, line_size=64):
        self.lines = [CacheLine(line_size) for _ in range(num_lines)]
        self.hits = 0
        self.misses = 0

    def access(self, address):
        block_size = self.lines[0].data.__len__()
        line_index = (address // block_size) % len(self.lines)
        tag = address // (block_size * len(self.lines))
        line = self.lines[line_index]
        
        if line.valid and line.tag == tag:
            self.hits += 1
            return line.data[address % block_size]  # Cache HIT
        else:
            self.misses += 1
            line.valid = True
            line.tag = tag
            return None  # Cache MISS - fetch from memory`} language="python" />
      </Section>

      <Section title="Interview Questions">
        <div className="space-y-3">
          <InterviewQuestion question="What is the difference between cache hit and cache miss?" answer="A cache hit occurs when the CPU finds requested data in cache. A cache miss occurs when data is not in cache and must be fetched from main memory, incurring significant penalty. The goal is to maximize hit rate through good locality and mapping." />
          <InterviewQuestion question="Explain temporal and spatial locality." answer="Temporal locality: recently accessed data is likely to be accessed again soon (e.g., loop variables). Spatial locality: data near recently accessed data is likely to be accessed soon (e.g., array elements). Cache exploits both: temporal via keeping data, spatial via fetching cache lines (blocks)." />
          <InterviewQuestion question="Why is set-associative mapping preferred over direct mapping?" answer="Direct mapping causes conflict misses when multiple frequently used blocks map to the same line. Set-associative mapping reduces conflicts by allowing a block to map to multiple lines in a set. 2-way to 8-way set associative gives most of the benefit of fully associative with much simpler hardware." />
        </div>
      </Section>
    </div>
  );
}
