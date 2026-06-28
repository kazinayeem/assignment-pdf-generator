"use client";

import { useState } from "react";
import Link from "next/link";
import { Home, ChevronRight, Code, Database, Layers, SquareStack, Shield, Share2, GitBranch } from "lucide-react";
import { Section, InfoCard, CodeBlock, InterviewQuestion } from "../components";

const SEGMENT_TYPES = [
  { name: "Code (Text)", icon: Code, desc: "Executable instructions. Read-only, fixed size. Shared between processes for memory efficiency.", color: "bg-blue-50 border-blue-300", textColor: "text-blue-700" },
  { name: "Data", icon: Database, desc: "Global and static variables. Read-write. Includes BSS (uninitialized data, zero-filled).", color: "bg-emerald-50 border-emerald-300", textColor: "text-emerald-700" },
  { name: "Stack", icon: SquareStack, desc: "Function call frames, local variables, return addresses. Grows downward. LIFO structure per thread.", color: "bg-amber-50 border-amber-300", textColor: "text-amber-700" },
  { name: "Heap", icon: Layers, desc: "Dynamically allocated memory (malloc/new). Grows upward. Shared across threads of a process.", color: "bg-purple-50 border-purple-300", textColor: "text-purple-700" },
];

const SEG_PAGED_STEPS = [
  { step: "Virtual Address", detail: "Segment # + Offset within segment" },
  { step: "Segment Table", detail: "Look up segment base + limit. Check offset ≤ limit." },
  { step: "Linear Address", detail: "Base + Offset = linear address (intermediate)" },
  { step: "Page Tables", detail: "Linear address → Page # + Offset → Page walk" },
  { step: "Physical Address", detail: "Frame # + Offset → actual RAM access" },
];

export default function SegmentationPage() {
  const [selectedSeg, setSelectedSeg] = useState<number | null>(null);
  const [segAddr, setSegAddr] = useState("0x2A");
  const [segOffset, setSegOffset] = useState("0x1F");
  const [transResult, setTransResult] = useState<{ segNum: number; offset: number; base: number; limit: number; physAddr: string; fault: boolean } | null>(null);

  const segmentTable = [
    { name: "Code", base: 0x10000, limit: 0x3000, prot: "R" },
    { name: "Data", base: 0x20000, limit: 0x4000, prot: "R/W" },
    { name: "Stack", base: 0x30000, limit: 0x1000, prot: "R/W" },
    { name: "Heap", base: 0x40000, limit: 0x2000, prot: "R/W" },
  ];

  const translateSegment = () => {
    const segNum = parseInt(segAddr, 16);
    const offset = parseInt(segOffset, 16);
    if (isNaN(segNum) || isNaN(offset) || segNum < 0 || segNum >= segmentTable.length) return;

    const seg = segmentTable[segNum];
    const fault = offset > seg.limit;
    const physAddr = fault ? "SEGMENTATION FAULT" : `0x${(seg.base + offset).toString(16).toUpperCase()}`;
    setTransResult({ segNum, offset, base: seg.base, limit: seg.limit, physAddr, fault });
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      <div className="flex items-center gap-2 mb-6 text-xs text-slate-500">
        <Link href="/tools/arch" className="text-cyan-600 no-underline flex items-center gap-1.5 hover:text-cyan-800 transition">
          <Home size={16} /> Architecture
        </Link>
        <ChevronRight size={16} />
        <span className="text-slate-900 font-semibold">Segmentation</span>
      </div>

      <div className="mb-10">
        <h1 className="text-4xl font-extrabold text-slate-900 mb-3">🔀 Segmentation</h1>
        <p className="text-base text-slate-500 leading-relaxed max-w-xl">
          Segmentation divides memory into variable-sized logical units (segments) that correspond to program structure: code, data, stack, and heap.
        </p>
      </div>

      <Section title="Memory Segments">
        <InfoCard title="Logical Division" type="info">
          Unlike paging (fixed-size, unaware of program structure), segmentation matches the programmer's view. Each segment has a base address and limit for protection.
        </InfoCard>

        <div className="grid sm:grid-cols-2 gap-4">
          {SEGMENT_TYPES.map((seg, i) => {
            const Icon = seg.icon;
            return (
              <div
                key={i}
                className={`${seg.color} border rounded-xl p-4 cursor-pointer transition-all ${
                  selectedSeg === i ? "ring-2 ring-cyan-500 scale-[1.02]" : "hover:scale-[1.02]"
                }`}
                onClick={() => setSelectedSeg(selectedSeg === i ? null : i)}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Icon size={18} className={seg.textColor} />
                  <h4 className={`text-sm font-bold ${seg.textColor}`}>{seg.name}</h4>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">{seg.desc}</p>
              </div>
            );
          })}
        </div>
      </Section>

      <Section title="Segment Table & Address Translation">
        <InfoCard title="Address Format" type="tip">
          Logical address = (segment_number, offset). The segment table maps segment number to base physical address and limit. If offset exceeds limit → segmentation fault.
        </InfoCard>

        <div className="grid sm:grid-cols-2 gap-4 mb-4">
          <div className="bg-white rounded-xl border border-slate-200 p-4">
            <h4 className="text-sm font-bold text-slate-900 mb-3">Segment Table</h4>
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100">
                  <th className="p-2 border border-slate-200 text-left text-slate-600">Seg #</th>
                  <th className="p-2 border border-slate-200 text-left text-slate-600">Name</th>
                  <th className="p-2 border border-slate-200 text-left text-slate-600">Base</th>
                  <th className="p-2 border border-slate-200 text-left text-slate-600">Limit</th>
                  <th className="p-2 border border-slate-200 text-left text-slate-600">Prot</th>
                </tr>
              </thead>
              <tbody>
                {segmentTable.map((seg, i) => (
                  <tr key={i} className={`${i % 2 === 0 ? "bg-white" : "bg-slate-50"} hover:bg-cyan-50`}>
                    <td className="p-2 border border-slate-200 font-mono text-slate-500">{i}</td>
                    <td className="p-2 border border-slate-200 font-bold text-slate-700">{seg.name}</td>
                    <td className="p-2 border border-slate-200 font-mono text-cyan-700">0x{seg.base.toString(16).toUpperCase()}</td>
                    <td className="p-2 border border-slate-200 font-mono text-slate-500">0x{seg.limit.toString(16).toUpperCase()}</td>
                    <td className="p-2 border border-slate-200 font-mono text-slate-500">{seg.prot}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-4">
            <h4 className="text-sm font-bold text-slate-900 mb-3">📱 Interactive Translation</h4>
            <div className="flex gap-2 mb-3">
              <div className="flex-1">
                <label className="block text-[10px] font-bold text-slate-500 mb-1">Segment # (hex)</label>
                <input type="text" value={segAddr} onChange={e => setSegAddr(e.target.value)}
                  className="w-full p-2 border border-slate-200 rounded-lg text-sm font-mono" />
              </div>
              <div className="flex-1">
                <label className="block text-[10px] font-bold text-slate-500 mb-1">Offset (hex)</label>
                <input type="text" value={segOffset} onChange={e => setSegOffset(e.target.value)}
                  className="w-full p-2 border border-slate-200 rounded-lg text-sm font-mono" />
              </div>
            </div>
            <button onClick={translateSegment}
              className="bg-cyan-600 text-white px-4 py-2 rounded-lg font-semibold text-sm hover:bg-cyan-700 transition flex items-center gap-2 w-full justify-center mb-3">
              <GitBranch size={16} /> Translate
            </button>

            {transResult && (
              <div className={`${transResult.fault ? "bg-pink-50 border-pink-300" : "bg-emerald-50 border-emerald-300"} border rounded-xl p-3`}>
                <div className="flex items-center gap-2 mb-2">
                  <span className={`font-bold text-sm ${transResult.fault ? "text-pink-700" : "text-emerald-700"}`}>
                    {transResult.fault ? "⛔ SEGMENTATION FAULT" : "✅ Valid Translation"}
                  </span>
                </div>
                <div className="space-y-1 text-xs">
                  <p><span className="font-bold text-slate-500">Segment:</span> {segmentTable[transResult.segNum].name} (#{transResult.segNum})</p>
                  <p><span className="font-bold text-slate-500">Base:</span> <span className="font-mono">0x{transResult.base.toString(16).toUpperCase()}</span></p>
                  <p><span className="font-bold text-slate-500">Offset:</span> <span className="font-mono">0x{transResult.offset.toString(16).toUpperCase()}</span></p>
                  <p><span className="font-bold text-slate-500">Limit:</span> <span className="font-mono">0x{transResult.limit.toString(16).toUpperCase()}</span></p>
                  {!transResult.fault && (
                    <p><span className="font-bold text-cyan-600">Physical Address:</span> <span className="font-mono text-cyan-700">{transResult.physAddr}</span></p>
                  )}
                  {transResult.fault && (
                    <p className="text-pink-600 font-bold">Offset ({transResult.offset}) exceeds limit ({transResult.limit}). Access denied.</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </Section>

      <Section title="Segmentation with Paging (Seg-Paged)">
        <InfoCard title="Hybrid Approach" type="info">
          Combines segmentation's logical organization with paging's elimination of external fragmentation. Used in x86-64 architecture. Virtual address = Segment + Page Number + Offset.
        </InfoCard>

        <div className="bg-white rounded-xl border border-slate-200 p-4 mb-4">
          <div className="flex flex-col gap-2">
            {SEG_PAGED_STEPS.map((s, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="bg-cyan-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0">{s.step[0]}</span>
                <div className="flex-1">
                  <span className="text-xs font-bold text-slate-700">{s.step}</span>
                  <p className="text-xs text-slate-500">{s.detail}</p>
                </div>
                {i < SEG_PAGED_STEPS.length - 1 && <ChevronRight size={14} className="text-slate-300 shrink-0" />}
              </div>
            ))}
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div className="bg-cyan-50 rounded-xl border border-cyan-200 p-4">
            <h4 className="text-sm font-bold text-cyan-700 mb-2">Benefits</h4>
            <ul className="text-xs text-slate-600 space-y-1">
              <li>✓ Each segment is paged — no external fragmentation</li>
              <li>✓ Segments provide logical structure and protection</li>
              <li>✓ Page sharing within segments is possible</li>
              <li>✓ Combined: best of both worlds</li>
            </ul>
          </div>
          <div className="bg-amber-50 rounded-xl border border-amber-200 p-4">
            <h4 className="text-sm font-bold text-amber-700 mb-2">Drawbacks</h4>
            <ul className="text-xs text-slate-600 space-y-1">
              <li>✗ Two levels of indirection = more TLB/page table lookups</li>
              <li>✗ More complex hardware (MMU must handle both)</li>
              <li>✗ Segment limits can waste page table entries</li>
              <li>✗ Variable segment sizes complicate OS management</li>
            </ul>
          </div>
        </div>
      </Section>

      <Section title="Protection & Sharing">
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="bg-white rounded-xl border border-slate-200 p-4">
            <div className="flex items-center gap-2 mb-2">
              <Shield size={16} className="text-emerald-600" />
              <h4 className="text-sm font-bold text-slate-900">Protection</h4>
            </div>
            <p className="text-xs text-slate-500 mb-3">Each segment has protection bits in the segment descriptor:</p>
            <div className="space-y-1.5">
              {[
                { type: "Code Segment", prot: "Read-only, Execute", desc: "No writes allowed" },
                { type: "Data Segment", prot: "Read/Write", desc: "Full access" },
                { type: "Stack Segment", prot: "Read/Write", desc: "No execution" },
              ].map((p, i) => (
                <div key={i} className="text-xs flex gap-2">
                  <span className="font-bold text-slate-600 w-28">{p.type}:</span>
                  <span className="font-mono text-cyan-600">{p.prot}</span>
                  <span className="text-slate-400">({p.desc})</span>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-4">
            <div className="flex items-center gap-2 mb-2">
              <Share2 size={16} className="text-blue-600" />
              <h4 className="text-sm font-bold text-slate-900">Sharing</h4>
            </div>
            <p className="text-xs text-slate-500 mb-3">Multiple processes can share the same segment via their segment tables:</p>
            <ul className="text-xs text-slate-500 space-y-1.5">
              <li className="flex items-start gap-2"><span className="text-emerald-500 mt-0.5">✓</span> Shared libraries (.so/.dll) loaded as shared code segments</li>
              <li className="flex items-start gap-2"><span className="text-emerald-500 mt-0.5">✓</span> Each process' segment table entry points to same physical segment</li>
              <li className="flex items-start gap-2"><span className="text-emerald-500 mt-0.5">✓</span> Protection bits can make shared segment read-only</li>
              <li className="flex items-start gap-2"><span className="text-emerald-500 mt-0.5">✓</span> Saves significant memory (e.g., libc shared across 100 processes)</li>
            </ul>
          </div>
        </div>
      </Section>

      <Section title="Segmentation vs Paging">
        <div className="overflow-x-auto">
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100">
                {["Property", "Paging", "Segmentation"].map((h, i) => (
                  <th key={i} className="text-left p-3 font-bold text-slate-700 border-b-2 border-slate-200">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                ["Size", "Fixed-size pages", "Variable-sized segments"],
                ["View", "Hardware-oriented", "Programmer-oriented"],
                ["Fragmentation", "Internal (wasted space within page)", "External (gaps between segments)"],
                ["Protection", "Per-page bits", "Per-segment descriptor"],
                ["Sharing", "Shared as pages (coarse)", "Shared as segments (logical units)"],
                ["Table Size", "Large (one entry per page)", "Small (one entry per segment)"],
                ["Addressing", "(page#, offset)", "(segment#, offset)"],
                ["Fault Handling", "Page fault", "Segmentation fault (segviolation)"],
              ].map((row, i) => (
                <tr key={i} className={`border-b border-slate-100 ${i % 2 === 0 ? "bg-white" : "bg-slate-50"} hover:bg-cyan-50`}>
                  <td className="p-3 font-bold text-slate-700">{row[0]}</td>
                  <td className="p-3 text-slate-500">{row[1]}</td>
                  <td className="p-3 text-slate-500">{row[2]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Section title="Code Example: Segment-Based Protection">
        <CodeBlock code={`class SegmentTableEntry:
    def __init__(self, base, limit, prot):
        self.base = base
        self.limit = limit
        self.prot = prot  # "R", "RW", "RX", "RWX"

def translate(segment_table, seg_num, offset):
    if seg_num < 0 or seg_num >= len(segment_table):
        raise SegmentationFault("Invalid segment")

    entry = segment_table[seg_num]
    if offset > entry.limit:
        raise SegmentationFault(
            f"Offset {offset} exceeds limit {entry.limit}"
        )

    physical = entry.base + offset
    return physical

# Example usage
seg_table = [
    SegmentTableEntry(0x10000, 0x3000, "RX"),  # Code
    SegmentTableEntry(0x20000, 0x4000, "RW"),  # Data
    SegmentTableEntry(0x30000, 0x1000, "RW"),  # Stack
]

# Access code segment, offset 0x100
addr = translate(seg_table, 0, 0x100)  # → 0x10100

# Access beyond limit -> Segmentation fault!
try:
    addr = translate(seg_table, 0, 0x4000)
except SegmentationFault as e:
    print(f"Fault: {e}")`} language="python" />
      </Section>

      <Section title="Interview Questions">
        <div className="space-y-3">
          <InterviewQuestion question="What is segmentation and how does it differ from paging?" answer="Segmentation divides memory into variable-sized logical units (code, data, stack, heap) that match program structure. Paging divides memory into fixed-size pages. Segmentation has no internal fragmentation (segments are exactly sized) but suffers external fragmentation. Paging has internal fragmentation but eliminates external fragmentation. Most modern systems use both (seg-paged)." />
          <InterviewQuestion question="How does segmentation provide memory protection?" answer="Each segment descriptor in the segment table contains a base address, limit (size), and protection bits (R/W/X). The MMU checks every access: if offset > limit, a segmentation fault is raised. This prevents a program from accessing memory outside its segments. Protection bits prevent code segments from being written, stack from being executed, etc." />
          <InterviewQuestion question="What is the advantage of combining segmentation with paging?" answer="Seg-Paged combines the logical structure of segments (each segment corresponds to a program section) with the fragmentation-free management of paging. Each segment is divided into pages. Address translation: virtual → (segment table) → linear address → (page tables) → physical. Used in x86-64 architecture. Provides flexible protection, sharing, and efficient memory use." />
          <InterviewQuestion question="Explain the difference between a segmentation fault and a page fault." answer="A segmentation fault occurs when a program accesses memory outside its valid segment (offset > limit) or violates protection (writing to read-only segment). It is a programming error that typically kills the process. A page fault occurs when a valid page is not in physical memory — the OS handles it transparently by loading the page from disk, and the program continues execution unaware." />
        </div>
      </Section>
    </div>
  );
}
