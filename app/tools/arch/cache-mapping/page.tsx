"use client";

import { useState } from "react";
import Link from "next/link";
import { Home, ChevronRight, Cpu, Hash, Target, Grid3X3, RefreshCw, CheckCircle, XCircle, Sliders } from "lucide-react";
import { Section, InfoCard, CodeBlock, Diagram, InterviewQuestion } from "../components";

type MappingType = "direct" | "associative" | "set-associative";

interface CacheLine {
  valid: boolean;
  tag: number;
  data: string;
  lru: number;
}

export default function CacheMappingPage() {
  const [mappingType, setMappingType] = useState<MappingType>("direct");
  const [numLines, setNumLines] = useState(8);
  const [blockSize, setBlockSize] = useState(4);
  const [ways, setWays] = useState(2);
  const [addressInput, setAddressInput] = useState("");
  const [cache, setCache] = useState<CacheLine[]>([]);
  const [lastResult, setLastResult] = useState<{ address: number; hit: boolean; line: number; tag: number; index: number; offset: number } | null>(null);
  const [history, setHistory] = useState<{ addr: number; hit: boolean }[]>([]);
  const [clock, setClock] = useState(0);

  const initCache = () => {
    const lines: CacheLine[] = [];
    const count = mappingType === "associative" ? numLines : numLines;
    for (let i = 0; i < count; i++) {
      lines.push({ valid: false, tag: -1, data: "----", lru: 0 });
    }
    setCache(lines);
    setLastResult(null);
    setHistory([]);
    setClock(0);
  };

  const accessAddress = () => {
    const addr = parseInt(addressInput.trim(), 16);
    if (isNaN(addr) || addr < 0) return;
    if (cache.length === 0) { initCache(); return; }

    let lines = [...cache];
    const offsetBits = Math.ceil(Math.log2(blockSize));
    const lineCount = mappingType === "associative" ? lines.length : lines.length;
    const indexBits = mappingType === "associative" ? 0 : Math.ceil(Math.log2(lineCount / (mappingType === "set-associative" ? ways : 1)));
    const tagBits = 32 - offsetBits - indexBits;

    const offset = addr & ((1 << offsetBits) - 1);
    let index = 0;
    if (mappingType !== "associative") {
      const setCount = mappingType === "set-associative" ? lineCount / ways : lineCount;
      index = (addr >> offsetBits) % setCount;
    }
    const tag = addr >> (offsetBits + (mappingType === "associative" ? 0 : indexBits));

    let hit = false;
    let lineIdx = -1;

    if (mappingType === "direct") {
      lineIdx = index;
      hit = lines[lineIdx].valid && lines[lineIdx].tag === tag;
      if (!hit || !lines[lineIdx].valid) {
        lines[lineIdx] = { valid: true, tag, data: `0x${addr.toString(16).toUpperCase()}`, lru: 0 };
      }
    } else if (mappingType === "associative") {
      const found = lines.findIndex(l => l.valid && l.tag === tag);
      if (found >= 0) { hit = true; lineIdx = found; }
      else {
        const invalid = lines.findIndex(l => !l.valid);
        if (invalid >= 0) { lineIdx = invalid; }
        else {
          const lruIdx = lines.reduce((min, l, i) => l.lru < lines[min].lru ? i : min, 0);
          lineIdx = lruIdx;
        }
        lines[lineIdx] = { valid: true, tag, data: `0x${addr.toString(16).toUpperCase()}`, lru: 0 };
      }
    } else {
      const setCount = lineCount / ways;
      const setStart = index * ways;
      const setLines = lines.slice(setStart, setStart + ways);
      const foundInSet = setLines.findIndex(l => l.valid && l.tag === tag);
      if (foundInSet >= 0) { hit = true; lineIdx = setStart + foundInSet; }
      else {
        const invalidInSet = setLines.findIndex(l => !l.valid);
        if (invalidInSet >= 0) { lineIdx = setStart + invalidInSet; }
        else {
          const lruInSet = setLines.reduce((min, l, i) => l.lru < setLines[min].lru ? i : min, 0);
          lineIdx = setStart + lruInSet;
        }
        lines[lineIdx] = { valid: true, tag, data: `0x${addr.toString(16).toUpperCase()}`, lru: 0 };
      }
    }

    lines = lines.map((l, i) => ({ ...l, lru: i === lineIdx ? clock + 1 : l.lru }));
    setCache(lines);
    setClock(c => c + 1);
    setLastResult({ address: addr, hit, line: lineIdx, tag, index, offset });
    setHistory(h => [{ addr, hit }, ...h].slice(0, 20));
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      <div className="flex items-center gap-2 mb-6 text-xs text-slate-500">
        <Link href="/tools/arch" className="text-cyan-600 no-underline flex items-center gap-1.5 hover:text-cyan-800 transition">
          <Home size={16} /> Architecture
        </Link>
        <ChevronRight size={16} />
        <span className="text-slate-900 font-semibold">Cache Mapping</span>
      </div>

      <div className="mb-10">
        <h1 className="text-4xl font-extrabold text-slate-900 mb-3">💾 Cache Mapping</h1>
        <p className="text-base text-slate-500 leading-relaxed max-w-xl">
          Cache mapping determines how main memory blocks are placed into cache lines. Direct, associative, and set-associative mapping offer different trade-offs.
        </p>
      </div>

      <Section title="Mapping Techniques">
        <InfoCard title="Key Concept" type="tip">
          Memory address = Tag + Index + Offset. The CPU extracts these fields to locate data in cache. Tag identifies the block, Index selects the cache line, Offset selects the byte within the block.
        </InfoCard>

        <div className="grid sm:grid-cols-3 gap-4">
          {[
            { type: "Direct Mapping", desc: "Each memory block maps to exactly one cache line. Simple, fast, but causes conflict misses.", color: "bg-cyan-50 border-cyan-200", icon: Hash },
            { type: "Associative", desc: "Any block can go to any line. No conflicts but needs comparator per line (expensive).", color: "bg-amber-50 border-amber-200", icon: Grid3X3 },
            { type: "Set-Associative", desc: "Block maps to a set of N lines. Best trade-off: n-way reduces conflicts with reasonable cost.", color: "bg-emerald-50 border-emerald-200", icon: Target },
          ].map((m, i) => {
            const Icon = m.icon;
            return (
              <div key={i} className={`${m.color} border rounded-xl p-4 cursor-pointer transition-all hover:scale-105`}>
                <Icon size={24} className="text-slate-600 mb-2" />
                <h4 className="text-sm font-bold text-slate-900 mb-2">{m.type}</h4>
                <p className="text-xs text-slate-500 leading-relaxed">{m.desc}</p>
              </div>
            );
          })}
        </div>
      </Section>

      <Section title="📱 Interactive Cache Simulator">
        <InfoCard title="Try It" type="info">
          Enter hex memory addresses below. Configure cache parameters and watch hit/miss behavior in real time.
        </InfoCard>

        <div className="bg-white rounded-xl border border-slate-200 p-5 mb-4">
          <div className="grid sm:grid-cols-4 gap-3 mb-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Mapping Type</label>
              <select value={mappingType} onChange={e => { setMappingType(e.target.value as MappingType); setCache([]); setLastResult(null); setHistory([]); }}
                className="w-full p-2 border border-slate-200 rounded-lg text-sm bg-white">
                <option value="direct">Direct Mapped</option>
                <option value="associative">Fully Associative</option>
                <option value="set-associative">Set-Associative</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Cache Lines</label>
              <input type="number" min="2" max="64" step="2" value={numLines} onChange={e => { setNumLines(Number(e.target.value)); setCache([]); }}
                className="w-full p-2 border border-slate-200 rounded-lg text-sm" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Block Size (bytes)</label>
              <input type="number" min="1" max="32" value={blockSize} onChange={e => { setBlockSize(Number(e.target.value)); setCache([]); }}
                className="w-full p-2 border border-slate-200 rounded-lg text-sm" />
            </div>
            {mappingType === "set-associative" && (
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">N-Way</label>
                <input type="number" min="2" max="8" value={ways} onChange={e => { setWays(Number(e.target.value)); setCache([]); }}
                  className="w-full p-2 border border-slate-200 rounded-lg text-sm" />
              </div>
            )}
          </div>

          <div className="flex gap-3 mb-4">
            <input type="text" value={addressInput} onChange={e => setAddressInput(e.target.value)}
              placeholder="Enter hex address (e.g. 1A4F)" onKeyDown={e => e.key === "Enter" && accessAddress()}
              className="flex-1 p-2.5 border border-slate-200 rounded-lg text-sm font-mono" />
            <button onClick={() => { initCache(); accessAddress(); }}
              className="bg-cyan-600 text-white px-5 py-2.5 rounded-lg font-semibold text-sm hover:bg-cyan-700 transition flex items-center gap-2">
              <Cpu size={16} /> Access
            </button>
            <button onClick={() => { setCache([]); setLastResult(null); setHistory([]); setClock(0); }}
              className="bg-slate-100 text-slate-600 px-4 py-2.5 rounded-lg font-semibold text-sm hover:bg-slate-200 transition flex items-center gap-2">
              <RefreshCw size={16} /> Clear
            </button>
          </div>

          {lastResult && (
            <div className={`${lastResult.hit ? "bg-emerald-50 border-emerald-300" : "bg-pink-50 border-pink-300"} border rounded-xl p-4 mb-4`}>
              <div className="flex items-center gap-3 mb-2">
                {lastResult.hit
                  ? <CheckCircle size={24} className="text-emerald-600" />
                  : <XCircle size={24} className="text-pink-600" />}
                <span className={`font-bold text-lg ${lastResult.hit ? "text-emerald-700" : "text-pink-700"}`}>
                  {lastResult.hit ? "CACHE HIT" : "CACHE MISS"}
                </span>
                <span className="text-xs text-slate-500 font-mono">0x{lastResult.address.toString(16).toUpperCase()}</span>
              </div>
              <div className="grid grid-cols-3 gap-3 text-xs">
                <div className="bg-white/60 rounded-lg p-2"><span className="font-bold text-slate-700">Tag:</span> <span className="font-mono">0x{lastResult.tag.toString(16).toUpperCase()}</span></div>
                <div className="bg-white/60 rounded-lg p-2"><span className="font-bold text-slate-700">Index:</span> <span className="font-mono">{lastResult.index}</span></div>
                <div className="bg-white/60 rounded-lg p-2"><span className="font-bold text-slate-700">Offset:</span> <span className="font-mono">{lastResult.offset}</span></div>
              </div>
              <p className="text-xs text-slate-500 mt-2">Placed in cache line #{lastResult.line}</p>
            </div>
          )}

          <div className="grid gap-1.5">
            <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
              <span className="font-bold">Cache Lines:</span>
              <span className="text-emerald-600 font-bold">■ Valid</span>
              <span className="text-red-400 font-bold">■ Invalid</span>
            </div>
            {cache.length > 0 ? cache.map((line, i) => {
              const sets = mappingType === "set-associative" ? Math.ceil(cache.length / ways) : 0;
              const setNum = mappingType === "set-associative" ? Math.floor(i / ways) : -1;
              return (
                <div key={i} className={`flex items-center gap-2 p-2 rounded-lg text-xs ${
                  line.valid ? "bg-emerald-50 border border-emerald-200" : "bg-red-50 border border-red-200"
                } ${lastResult?.line === i ? "ring-2 ring-cyan-500 scale-[1.02] transition-all" : ""}`}>
                  <span className="w-16 font-bold text-slate-500 shrink-0">Line {i}</span>
                  {mappingType === "set-associative" && <span className="w-14 text-slate-400 shrink-0">Set {setNum}</span>}
                  <span className={`w-10 text-center font-bold ${line.valid ? "text-emerald-600" : "text-red-400"}`}>
                    {line.valid ? "V" : "I"}
                  </span>
                  <span className="w-28 font-mono text-slate-700">Tag: {line.valid ? `0x${line.tag.toString(16).toUpperCase()}` : "---"}</span>
                  <span className="font-mono text-slate-400">Data: {line.data}</span>
                </div>
              );
            }) : (
              <div className="text-center py-6 text-slate-400 text-sm">
                Configure cache above and click "Access" with a hex address to begin simulation.
              </div>
            )}
          </div>

          {history.length > 0 && (
            <div className="mt-4 pt-4 border-t border-slate-200">
              <p className="text-xs font-bold text-slate-700 mb-2">Access History (most recent first):</p>
              <div className="flex flex-wrap gap-1.5">
                {history.map((h, i) => (
                  <span key={i} className={`inline-flex items-center gap-1 px-2 py-1 rounded text-[10px] font-mono ${
                    h.hit ? "bg-emerald-100 text-emerald-700" : "bg-pink-100 text-pink-700"
                  }`}>
                    {h.hit ? "✓" : "✗"} 0x{h.addr.toString(16).toUpperCase()}
                  </span>
                ))}
              </div>
              <p className="text-xs text-slate-400 mt-2">
                Hit rate: {history.filter(h => h.hit).length}/{history.length} ({Math.round(history.filter(h => h.hit).length / history.length * 100)}%)
              </p>
            </div>
          )}
        </div>
      </Section>

      <Section title="Address Breakdown">
        <div className="grid sm:grid-cols-3 gap-4">
          {[
            { name: "Tag", bits: "High-order bits", role: "Identifies which memory block is stored in this cache line", color: "bg-blue-500" },
            { name: "Index", bits: "Middle bits", role: "Selects which cache line (or set) to check", color: "bg-emerald-500" },
            { name: "Offset", bits: "Low-order bits", role: "Selects the specific byte within the cache block", color: "bg-amber-500" },
          ].map((f, i) => (
            <div key={i} className="bg-white rounded-xl border border-slate-200 p-4">
              <div className={`${f.color} text-white text-xs font-bold px-2 py-1 rounded inline-block mb-2`}>{f.name}</div>
              <p className="text-[10px] font-mono text-slate-400 mb-1">{f.bits}</p>
              <p className="text-xs text-slate-500">{f.role}</p>
            </div>
          ))}
        </div>
        <div className="mt-4 bg-slate-900 rounded-xl p-4 text-center">
          <p className="text-sm font-mono text-white">
            <span className="text-blue-400">Tag</span>
            <span className="text-slate-500"> | </span>
            <span className="text-emerald-400">Index</span>
            <span className="text-slate-500"> | </span>
            <span className="text-amber-400">Offset</span>
          </p>
        </div>
      </Section>

      <Section title="Code Example: Cache Simulator">
        <CodeBlock code={`class Cache:
    def __init__(self, lines=8, block_size=4, mapping="direct"):
        self.lines = [{"valid": False, "tag": 0} for _ in range(lines)]
        self.block_size = block_size
        self.mapping = mapping
        self.hits = self.misses = 0

    def access(self, addr):
        offset = addr % self.block_size
        if self.mapping == "direct":
            idx = (addr // self.block_size) % len(self.lines)
            tag = addr // (self.block_size * len(self.lines))
            if self.lines[idx]["valid"] and self.lines[idx]["tag"] == tag:
                self.hits += 1; return True
            self.lines[idx] = {"valid": True, "tag": tag}
            self.misses += 1; return False

        elif self.mapping == "associative":
            for line in self.lines:
                if line["valid"] and line["tag"] == tag:
                    self.hits += 1; return True
            lru = min(range(len(self.lines)), key=lambda i: self.lines[i].get("lru", 0))
            self.lines[lru] = {"valid": True, "tag": tag, "lru": 0}
            self.misses += 1; return False`} language="python" />
      </Section>

      <Section title="Interview Questions">
        <div className="space-y-3">
          <InterviewQuestion question="Explain direct-mapped cache. What are its pros and cons?" answer="In direct-mapped cache, each memory block maps to exactly one cache line determined by (block_address % number_of_lines). Pros: simple hardware, fast access (single comparison). Cons: conflict misses — when multiple frequently-used blocks map to the same line, they keep evicting each other, causing poor performance." />
          <InterviewQuestion question="Compare fully associative vs set-associative cache." answer="Fully associative: any block to any line. No conflict misses but requires a comparator per line (expensive for large caches). Set-associative: each block maps to a set of N lines. 2-8 way set-associative gives 90%+ of the miss reduction of fully associative with far less hardware. Most modern L1 caches are 4-8 way set-associative." />
          <InterviewQuestion question="How do you calculate tag, index, and offset from a memory address?" answer="For a direct-mapped cache: offset = log2(block_size) bits; index = log2(num_lines) bits; tag = remaining high-order bits. Example: 64KB cache, 64B blocks, 32-bit address: offset = 6 bits, index = 10 bits (1024 lines), tag = 16 bits. The CPU extracts these fields and compares the tag to determine hit/miss." />
          <InterviewQuestion question="What is a conflict miss and how does set-associative mapping reduce it?" answer="A conflict miss occurs when the cache line is occupied by a different block that maps to the same line, even though other lines are empty. Set-associative mapping reduces conflict misses by providing N locations per set. When one block evicts another, there are N-1 alternative locations in the same set. Increasing associativity from 1 to 2 typically halves conflict misses." />
        </div>
      </Section>
    </div>
  );
}
