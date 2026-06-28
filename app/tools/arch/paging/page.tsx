"use client";

import { useState } from "react";
import Link from "next/link";
import { Home, ChevronRight, Clock, AlertTriangle, BarChart3 } from "lucide-react";
import { Section, InfoCard, CodeBlock, InterviewQuestion } from "../components";

const ALGORITHMS = [
  { name: "FIFO", desc: "Evict the oldest-loaded page (first in, first out). Simple but suffers from Belady's anomaly.", color: "bg-blue-50 border-blue-200" },
  { name: "LRU", desc: "Evict the least recently used page. Good performance but requires hardware support or costly timestamp tracking.", color: "bg-emerald-50 border-emerald-200" },
  { name: "Optimal", desc: "Evict the page that won't be used for the longest time. Theoretical benchmark only (needs future knowledge).", color: "bg-amber-50 border-amber-200" },
  { name: "Clock", desc: "Approximates LRU using a reference bit and circular scan. Efficient and practical — used in many real OS kernels.", color: "bg-purple-50 border-purple-200" },
];

function simulateFIFO(pages: number[], frames: number) {
  const memory: number[] = [];
  const history: { step: number; page: number; memory: number[]; fault: boolean }[] = [];

  pages.forEach((page, step) => {
    const fault = !memory.includes(page);
    if (fault) {
      if (memory.length >= frames) memory.shift();
      memory.push(page);
    }
    history.push({ step, page, memory: [...memory], fault });
  });

  return history;
}

function simulateLRU(pages: number[], frames: number) {
  const memory: number[] = [];
  const history: { step: number; page: number; memory: number[]; fault: boolean }[] = [];

  pages.forEach((page, step) => {
    const idx = memory.indexOf(page);
    const fault = idx === -1;
    if (fault) {
      if (memory.length >= frames) memory.shift();
      memory.push(page);
    } else {
      memory.splice(idx, 1);
      memory.push(page);
    }
    history.push({ step, page, memory: [...memory], fault });
  });

  return history;
}

export default function PagingPage() {
  const [refString, setRefString] = useState("7,0,1,2,0,3,0,4,2,3,0,3,2,1,2,0,1,7,0,1");
  const [numFrames, setNumFrames] = useState(3);
  const [algo, setAlgo] = useState<"fifo" | "lru">("fifo");
  const [history, setHistory] = useState<{ step: number; page: number; memory: number[]; fault: boolean }[]>([]);
  const [pageDef] = useState({ size: 4096, pnBits: 20, offsetBits: 12 });

  const runSimulation = () => {
    const pages = refString.split(",").map(s => parseInt(s.trim())).filter(n => !isNaN(n));
    const result = algo === "fifo" ? simulateFIFO(pages, numFrames) : simulateLRU(pages, numFrames);
    setHistory(result);
  };

  const faults = history.filter(h => h.fault).length;
  const total = history.length;

  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      <div className="flex items-center gap-2 mb-6 text-xs text-slate-500">
        <Link href="/tools/arch" className="text-cyan-600 no-underline flex items-center gap-1.5 hover:text-cyan-800 transition">
          <Home size={16} /> Architecture
        </Link>
        <ChevronRight size={16} />
        <span className="text-slate-900 font-semibold">Paging</span>
      </div>

      <div className="mb-10">
        <h1 className="text-4xl font-extrabold text-slate-900 mb-3">📄 Paging</h1>
        <p className="text-base text-slate-500 leading-relaxed max-w-xl">
          Paging divides memory into fixed-size pages. It eliminates external fragmentation and enables virtual memory through page tables and replacement algorithms.
        </p>
      </div>

      <Section title="Page Size, Number & Offset">
        <InfoCard title="Address Breakdown" type="info">
          Virtual address = Page Number (PN) + Offset. If page size is 4KB (2¹²), the lower 12 bits are the offset, and the remaining bits identify the page.
        </InfoCard>

        <div className="grid sm:grid-cols-3 gap-4 mb-4">
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <h4 className="text-sm font-bold text-blue-700 mb-1">Page Number (PN)</h4>
            <p className="text-xs text-slate-500">High-order bits of virtual address. Indexes into the page table to find the physical frame.</p>
            <span className="inline-block mt-2 bg-blue-200 text-blue-800 text-[10px] font-mono px-2 py-0.5 rounded">{pageDef.pnBits} bits</span>
          </div>
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
            <h4 className="text-sm font-bold text-emerald-700 mb-1">Offset</h4>
            <p className="text-xs text-slate-500">Low-order bits. Specifies the exact byte within the page. Not translated — passed through directly.</p>
            <span className="inline-block mt-2 bg-emerald-200 text-emerald-800 text-[10px] font-mono px-2 py-0.5 rounded">{pageDef.offsetBits} bits</span>
          </div>
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
            <h4 className="text-sm font-bold text-amber-700 mb-1">Page Size</h4>
            <p className="text-xs text-slate-500">Typical page size: 4KB. Larger pages = smaller page tables but more internal fragmentation.</p>
            <span className="inline-block mt-2 bg-amber-200 text-amber-800 text-[10px] font-mono px-2 py-0.5 rounded">{pageDef.size / 1024} KB</span>
          </div>
        </div>

        <div className="bg-slate-900 rounded-xl p-4 mb-4 text-center">
          <p className="text-sm font-mono text-white">
            <span className="text-blue-400">Page Number (PN) — {pageDef.pnBits} bits</span>
            <span className="text-slate-500"> | </span>
            <span className="text-emerald-400">Offset — {pageDef.offsetBits} bits</span>
          </p>
        </div>
      </Section>

      <Section title="Multi-Level Page Tables">
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="bg-white rounded-xl border border-slate-200 p-4">
            <h4 className="text-sm font-bold text-slate-900 mb-2">Problem: Huge Page Tables</h4>
            <p className="text-xs text-slate-500 mb-2">32-bit address, 4KB pages → 2²⁰ PTEs (~4MB per process). 64-bit → exabyte-sized tables.</p>
            <p className="text-xs text-slate-500">Multi-level tables: only allocate levels that are actually used. Sparse address spaces become efficient.</p>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-4">
            <h4 className="text-sm font-bold text-slate-900 mb-2">Levels (x86-64 example)</h4>
            <div className="space-y-1.5">
              {[
                { level: "PML4", bits: 9, entries: 512 },
                { level: "PDPT", bits: 9, entries: 512 },
                { level: "PD", bits: 9, entries: 512 },
                { level: "PT", bits: 9, entries: 512 },
                { level: "Offset", bits: 12, entries: "4KB" },
              ].map((l, i) => (
                <div key={i} className="flex items-center gap-2 text-xs">
                  <span className="w-12 font-bold text-slate-600">{l.level}</span>
                  <div className="flex-1 bg-slate-100 rounded h-5 flex items-center px-2">
                    <span className="text-[10px] font-mono text-slate-500">{l.bits} bits · {l.entries} entries</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      <Section title="📱 Interactive: Page Replacement Simulator">
        <InfoCard title="Try It" type="info">
          Enter a page reference string and number of frames. Watch how FIFO and LRU algorithms handle page faults in real time.
        </InfoCard>

        <div className="bg-white rounded-xl border border-slate-200 p-5 mb-4">
          <div className="grid sm:grid-cols-4 gap-3 mb-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">Reference String (comma-separated page numbers)</label>
              <input type="text" value={refString} onChange={e => setRefString(e.target.value)}
                className="w-full p-2 border border-slate-200 rounded-lg text-sm font-mono" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Frames</label>
              <input type="number" min="1" max="12" value={numFrames} onChange={e => setNumFrames(Number(e.target.value))}
                className="w-full p-2 border border-slate-200 rounded-lg text-sm" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Algorithm</label>
              <select value={algo} onChange={e => setAlgo(e.target.value as "fifo" | "lru")}
                className="w-full p-2 border border-slate-200 rounded-lg text-sm bg-white">
                <option value="fifo">FIFO</option>
                <option value="lru">LRU</option>
              </select>
            </div>
          </div>

          <button onClick={runSimulation}
            className="bg-cyan-600 text-white px-5 py-2.5 rounded-lg font-semibold text-sm hover:bg-cyan-700 transition flex items-center gap-2 mb-4">
            <BarChart3 size={16} /> Run Simulation
          </button>

          {history.length > 0 && (
            <>
              <div className="flex items-center gap-4 mb-3 text-xs">
                <span className="font-bold text-slate-700">Total: {total} references</span>
                <span className="text-pink-600 font-bold">Page Faults: {faults}</span>
                <span className="text-emerald-600 font-bold">Hits: {total - faults}</span>
                <span className="text-slate-500">Fault Rate: {total > 0 ? ((faults / total) * 100).toFixed(1) : 0}%</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-100">
                      <th className="p-2 border border-slate-200 text-slate-600">Step</th>
                      <th className="p-2 border border-slate-200 text-slate-600">Page</th>
                      {Array.from({ length: numFrames }, (_, i) => (
                        <th key={i} className="p-2 border border-slate-200 text-slate-600">Frame {i}</th>
                      ))}
                      <th className="p-2 border border-slate-200 text-slate-600">Result</th>
                    </tr>
                  </thead>
                  <tbody>
                    {history.slice(Math.max(0, history.length - 20)).map((h, i) => (
                      <tr key={h.step} className={`${h.fault ? "bg-pink-50" : "bg-emerald-50"} ${i % 2 === 0 ? "" : "opacity-80"}`}>
                        <td className="p-2 border border-slate-200 font-mono text-slate-500">{h.step}</td>
                        <td className="p-2 border border-slate-200 font-bold text-slate-900">{h.page}</td>
                        {Array.from({ length: numFrames }, (_, fi) => (
                          <td key={fi} className={`p-2 border border-slate-200 font-mono ${
                            fi < h.memory.length ? "text-slate-700" : "text-slate-300"
                          }`}>
                            {fi < h.memory.length ? h.memory[fi] : "—"}
                          </td>
                        ))}
                        <td className={`p-2 border border-slate-200 font-bold ${
                          h.fault ? "text-pink-600" : "text-emerald-600"
                        }`}>
                          {h.fault ? "FAULT" : "HIT"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-[10px] text-slate-400 mt-2">Showing last 20 references. Total: {history.length} steps.</p>
            </>
          )}
        </div>
      </Section>

      <Section title="Replacement Algorithms">
        <div className="grid sm:grid-cols-2 gap-4">
          {ALGORITHMS.map((a, i) => (
            <div key={i} className={`${a.color} border rounded-xl p-4`}>
              <h4 className="text-sm font-bold text-slate-900 mb-1">{a.name}</h4>
              <p className="text-xs text-slate-500 leading-relaxed">{a.desc}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Thrashing">
        <InfoCard title="What is Thrashing?" type="warning">
          Thrashing occurs when the system spends more time paging (swapping pages in/out) than executing. It happens when the working set of all processes exceeds available physical memory.
        </InfoCard>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <h4 className="text-sm font-bold text-slate-900 mb-2">Signs of Thrashing:</h4>
          <ul className="text-xs text-slate-500 space-y-1.5">
            <li className="flex items-center gap-2"><AlertTriangle size={12} className="text-pink-500" /> CPU utilization drops (CPU waiting on paging)</li>
            <li className="flex items-center gap-2"><AlertTriangle size={12} className="text-pink-500" /> Page fault rate skyrockets</li>
            <li className="flex items-center gap-2"><AlertTriangle size={12} className="text-pink-500" /> Disk I/O saturates (constant swap activity)</li>
            <li className="flex items-center gap-2"><Clock size={12} className="text-pink-500" /> System throughput approaches zero</li>
          </ul>
          <div className="mt-3 pt-3 border-t border-slate-200">
            <h4 className="text-xs font-bold text-slate-700 mb-1">Solutions:</h4>
            <p className="text-xs text-slate-500">Reduce degree of multiprogramming, increase RAM, use working set model, or implement page fault frequency control.</p>
          </div>
        </div>
      </Section>

      <Section title="Code Example: Page Replacement">
        <CodeBlock code={`def fifo(pages, frames):
    memory = []
    faults = 0
    for page in pages:
        if page not in memory:
            faults += 1
            if len(memory) >= frames:
                memory.pop(0)  # evict oldest
            memory.append(page)
    return faults

def lru(pages, frames):
    memory = []
    faults = 0
    for page in pages:
        if page in memory:
            memory.remove(page)  # re-order: most recent at end
        else:
            faults += 1
            if len(memory) >= frames:
                memory.pop(0)  # evict LRU (front)
        memory.append(page)
    return faults

# Optimal: evict page used furthest in future
def optimal(pages, frames):
    memory = []
    faults = 0
    for i, page in enumerate(pages):
        if page not in memory:
            faults += 1
            if len(memory) >= frames:
                future = pages[i+1:]
                # evict page with furthest next use (or none)
                evict = max(memory, key=lambda p: future.index(p) if p in future else float('inf'))
                memory.remove(evict)
            memory.append(page)
    return faults`} language="python" />
      </Section>

      <Section title="Interview Questions">
        <div className="space-y-3">
          <InterviewQuestion question="What is the difference between paging and segmentation?" answer="Paging divides memory into fixed-size pages (e.g., 4KB). No external fragmentation but internal fragmentation possible. Segmentation divides memory into variable-sized logical segments (code, data, stack). No internal fragmentation but suffers from external fragmentation. Many systems combine both (seg-paged)." />
          <InterviewQuestion question="Explain Belady's Anomaly." answer="Belady's Anomaly occurs in FIFO page replacement: increasing the number of page frames can paradoxically increase the number of page faults. Example: reference string 1,2,3,4,1,2,5,1,2,3,4,5 with 3 frames has 9 faults, but with 4 frames has 10 faults. LRU and Optimal do not suffer from this anomaly (they satisfy the stack property)." />
          <InterviewQuestion question="How does the Clock (Second Chance) algorithm work?" answer="Clock arranges pages in a circular list with a reference bit. When a page must be evicted: scan clockwise. If reference bit = 0, evict this page. If reference bit = 1, clear it to 0 and move to next. This approximates LRU without the cost of timestamps. Used in Linux, BSD, and many other OS kernels." />
          <InterviewQuestion question="What is thrashing and how do you prevent it?" answer="Thrashing = excessive paging that degrades throughput to near zero. Prevention: use a working set model (track the set of pages a process is actively using), employ page fault frequency control (if fault rate exceeds threshold, allocate more frames or suspend a process), and manage the degree of multiprogramming to ensure total working set fits in RAM." />
        </div>
      </Section>
    </div>
  );
}
