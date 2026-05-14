"use client";

import { useState } from "react";
import Link from "next/link";
import { Home, ChevronRight, Cpu, Zap } from "lucide-react";
import { Section, InfoCard, CodeBlock, InterviewQuestion } from "../components";

const RISC_CHARS = [
  { char: "Fixed-length instructions", desc: "All instructions same size (typically 32-bit), simplifying decode" },
  { char: "Load-Store architecture", desc: "Only load/store access memory; all other ops use registers" },
  { char: "Large register file", desc: "Typically 32+ general-purpose registers for compiler optimization" },
  { char: "Simple instructions", desc: "Each instruction does one simple operation; complex ops via multiple instructions" },
  { char: "Hardwired control", desc: "Control logic is hardwired rather than microcoded, faster but less flexible" },
  { char: "Single-cycle execution", desc: "Most instructions execute in one clock cycle (in simple pipelines)" },
];

const CISC_CHARS = [
  { char: "Variable-length instructions", desc: "Instructions range from 1 to 15+ bytes, improving code density" },
  { char: "Memory operands", desc: "ALU instructions can operate directly on memory, reducing instructions needed" },
  { char: "Smaller register file", desc: "Typically 8-16 registers, since memory access is cheaper in instruction count" },
  { char: "Complex instructions", desc: "Single instruction can do multi-step operations (e.g., string copy, polynomial eval)" },
  { char: "Microcoded control", desc: "Complex instructions are implemented as microcode routines in control ROM" },
  { char: "Multi-cycle execution", desc: "Most instructions take multiple cycles, but complex ops need fewer total instructions" },
];

const COMPARISON = [
  { aspect: "Instruction Length", risc: "Fixed (32-bit)", cisc: "Variable (1-15 bytes)" },
  { aspect: "Registers", risc: "32+ GPRs", cisc: "8-16 GPRs" },
  { aspect: "Memory Access", risc: "Load/Store only", cisc: "Any instruction may access memory" },
  { aspect: "Control Unit", risc: "Hardwired", cisc: "Microcoded" },
  { aspect: "Cycles per Instr", risc: "≈1 CPI (pipelined)", cisc: "1-20+ CPI" },
  { aspect: "Code Density", risc: "Lower", cisc: "Higher" },
  { aspect: "Compiler Complexity", risc: "Simpler backend", cisc: "Complex instruction selection" },
  { aspect: "Pipeline Design", risc: "Simple, regular", cisc: "Complex, variable latency" },
];

const BENCHMARKS = [
  { metric: "Dhrystone MIPS", risc: "Higher (simpler pipeline, higher clock)", cisc: "Lower per clock, but fewer instructions" },
  { metric: "Code Size", risc: "Typically 25-40% larger", cisc: "More compact" },
  { metric: "Power Efficiency", risc: "Better (simpler decode, fewer transistors)", cisc: "Worse (complex decode, more transistors)" },
  { metric: "Die Area", risc: "Smaller, more room for caches", cisc: "Larger control logic" },
  { metric: "Design Time", risc: "Shorter design cycle", cisc: "Longer verification" },
];

const INTERVIEW_QS = [
  { q: "What are the key differences between RISC and CISC architectures?", a: "RISC uses fixed-length instructions, a load-store model (only loads/stores access memory), many registers (32+), simple hardwired control, and single-cycle execution. CISC uses variable-length instructions, allows memory operands in any instruction, has fewer registers, uses microcoded control, and executes complex instructions over multiple cycles. RISC emphasizes compiler optimization while CISC emphasizes hardware complexity to simplify assembly programming." },
  { q: "Why did ARM become dominant over x86 in mobile devices?", a: "ARM (RISC) has simpler decode logic, lower power consumption, smaller die area, and better performance-per-watt. x86 (CISC) requires complex decode logic (including microcode translation) that consumes more power and area. For battery-constrained mobile devices, ARM's power efficiency is critical. Additionally, ARM's license model allows customization by manufacturers." },
  { q: "Has the RISC vs CISC distinction become blurred in modern processors?", a: "Yes. Modern x86 processors internally translate CISC instructions into RISC-like micro-ops (micro-operation translation) and execute them on a RISC-like pipeline. Conversely, RISC architectures have added some CISC features (e.g., ARM's Thumb-2 for variable-length encoding, SIMD extensions). Modern CPUs are essentially hybrid designs." },
  { q: "Which architecture has better performance: RISC or CISC?", a: "It's not a simple answer. For the same power budget and die area, RISC typically delivers better performance through higher clock speeds, simpler pipelines, and more room for caches. CISC can win when code density matters (less fetch bandwidth) or when complex instructions replace many RISC instructions. Modern performance is determined more by microarchitecture (pipelines, branch prediction, cache hierarchy) than the ISA philosophy." },
];

export default function RiscVsCiscPage() {
  const [view, setView] = useState<"risc" | "cisc" | "compare">("compare");

  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      <div className="flex items-center gap-2 mb-6 text-xs text-slate-500">
        <Link href="/tools/arch" className="text-cyan-600 no-underline flex items-center gap-1.5 hover:text-cyan-800 transition">
          <Home size={16} /> Architecture
        </Link>
        <ChevronRight size={16} />
        <span className="text-slate-900 font-semibold">RISC vs CISC</span>
      </div>

      <div className="mb-10">
        <h1 className="text-4xl font-extrabold text-slate-900 mb-3">⚖️ RISC vs CISC</h1>
        <p className="text-base text-slate-500 leading-relaxed max-w-xl">
          The fundamental design philosophies of instruction set architecture: simplicity vs complexity, and the tradeoffs involved.
        </p>
      </div>

      <Section title="Design Philosophy">
        <InfoCard title="The Great ISA Debate" type="info">
          RISC (Reduced Instruction Set Computer) and CISC (Complex Instruction Set Computer) represent two opposing philosophies for CPU design. RISC favors simple, regular instructions that execute quickly, relying on compilers to generate efficient code. CISC favors rich, powerful instructions that do more per instruction, simplifying assembly programming at the cost of hardware complexity.
        </InfoCard>
        <div className="grid sm:grid-cols-2 gap-5">
          <div className="bg-white border-2 border-cyan-500 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <Zap className="w-5 h-5 text-cyan-600" />
              <h3 className="font-bold text-slate-900">RISC Philosophy</h3>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed mb-3">&ldquo;Make the common case fast.&rdquo; Simple hardware + optimizing compiler = high performance.</p>
            <p className="text-xs text-slate-400">Examples: ARM, RISC-V, MIPS, PowerPC</p>
          </div>
          <div className="bg-white border-2 border-purple-500 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <Cpu className="w-5 h-5 text-purple-600" />
              <h3 className="font-bold text-slate-900">CISC Philosophy</h3>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed mb-3">&ldquo;Bridging the semantic gap.&rdquo; Complex hardware + fewer instructions = simpler programming.</p>
            <p className="text-xs text-slate-400">Examples: x86, 68000, VAX</p>
          </div>
        </div>
      </Section>

      <Section title="Characteristics">
        <div className="flex gap-2 mb-5">
          <button onClick={() => setView("risc")} className={`px-4 py-2 rounded-xl text-sm font-semibold border-2 transition-all cursor-pointer ${view === "risc" ? "bg-cyan-600 text-white border-cyan-600 shadow-md" : "bg-white text-slate-600 border-slate-200 hover:border-cyan-300"}`}>RISC</button>
          <button onClick={() => setView("cisc")} className={`px-4 py-2 rounded-xl text-sm font-semibold border-2 transition-all cursor-pointer ${view === "cisc" ? "bg-purple-600 text-white border-purple-600 shadow-md" : "bg-white text-slate-600 border-slate-200 hover:border-purple-300"}`}>CISC</button>
          <button onClick={() => setView("compare")} className={`px-4 py-2 rounded-xl text-sm font-semibold border-2 transition-all cursor-pointer ${view === "compare" ? "bg-slate-800 text-white border-slate-800 shadow-md" : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"}`}>Compare</button>
        </div>

        {view === "risc" && (
          <div className="grid sm:grid-cols-2 gap-3">
            {RISC_CHARS.map((c, i) => (
              <div key={i} className="bg-cyan-50 border border-cyan-200 rounded-xl p-4">
                <h4 className="text-sm font-bold text-cyan-700 mb-1">{c.char}</h4>
                <p className="text-xs text-slate-500">{c.desc}</p>
              </div>
            ))}
          </div>
        )}

        {view === "cisc" && (
          <div className="grid sm:grid-cols-2 gap-3">
            {CISC_CHARS.map((c, i) => (
              <div key={i} className="bg-purple-50 border border-purple-200 rounded-xl p-4">
                <h4 className="text-sm font-bold text-purple-700 mb-1">{c.char}</h4>
                <p className="text-xs text-slate-500">{c.desc}</p>
              </div>
            ))}
          </div>
        )}

        {view === "compare" && (
          <div className="overflow-x-auto">
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100">
                  <th className="text-left p-3 font-bold text-slate-700 border-b border-slate-200">Aspect</th>
                  <th className="text-left p-3 font-bold text-cyan-700 border-b border-slate-200">RISC</th>
                  <th className="text-left p-3 font-bold text-purple-700 border-b border-slate-200">CISC</th>
                </tr>
              </thead>
              <tbody>
                {COMPARISON.map((row, i) => (
                  <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-slate-50"}>
                    <td className="p-3 font-medium text-slate-700 border-b border-slate-100">{row.aspect}</td>
                    <td className="p-3 text-slate-500 border-b border-slate-100">{row.risc}</td>
                    <td className="p-3 text-slate-500 border-b border-slate-100">{row.cisc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Section>

      <Section title="Code Comparison: Same Task in RISC vs CISC">
        <div className="grid sm:grid-cols-2 gap-5 mb-5">
          <div>
            <h4 className="text-sm font-bold text-cyan-700 mb-2">RISC (MIPS/Load-Store)</h4>
            <CodeBlock code={`; memcpy(dst, src, count)
; RISC approach: load, store, repeat
memcpy:
    beq  $a2, $zero, done
    li   $t0, 0
loop:
    lw   $t1, 0($a1)     ; load word
    sw   $t1, 0($a0)     ; store word
    addi $a0, $a0, 4     ; dst++
    addi $a1, $a1, 4     ; src++
    addi $t0, $t0, 1
    bne  $t0, $a2, loop
done:
    jr   $ra`} language="mips" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-purple-700 mb-2">CISC (x86/Memory-to-Memory)</h4>
            <CodeBlock code={`; memcpy(dst, src, count)
; CISC approach: single rep movsb
memcpy:
    push  esi
    push  edi
    mov   esi, [esp+12]  ; src
    mov   edi, [esp+8]   ; dst
    mov   ecx, [esp+16]  ; count
    cld                  ; clear direction
    rep   movsb          ; repeat: [edi] = [esi], inc/dec
    pop   edi
    pop   esi
    ret`} language="nasm" />
          </div>
        </div>
        <InfoCard title="Key Observation" type="tip">
          RISC requires 7+ instructions for memcpy but each is simple (1 cycle pipelined). CISC does it in 1 instruction (rep movsb) but the microcode takes many cycles internally. Modern x86 CPUs decode rep movsb into a hardware-accelerated memcpy that outperforms the RISC loop for large blocks.
        </InfoCard>
      </Section>

      <Section title="Performance Analysis">
        <div className="overflow-x-auto mb-5">
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100">
                <th className="text-left p-3 font-bold text-slate-700 border-b border-slate-200">Metric</th>
                <th className="text-left p-3 font-bold text-cyan-700 border-b border-slate-200">RISC</th>
                <th className="text-left p-3 font-bold text-purple-700 border-b border-slate-200">CISC</th>
              </tr>
            </thead>
            <tbody>
              {BENCHMARKS.map((row, i) => (
                <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-slate-50"}>
                  <td className="p-3 font-medium text-slate-700 border-b border-slate-100">{row.metric}</td>
                  <td className="p-3 text-slate-500 border-b border-slate-100">{row.risc}</td>
                  <td className="p-3 text-slate-500 border-b border-slate-100">{row.cisc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-xl border border-cyan-200 p-5 mb-5">
          <h4 className="text-sm font-bold text-cyan-700 mb-2">The Modern Reality: Convergence</h4>
          <p className="text-xs text-slate-500 leading-relaxed">
            Every modern x86 CPU (Intel Core, AMD Ryzen) internally decodes CISC instructions into RISC-like μops. The front-end (legacy decoder, μop cache) translates x86 CISC to internal RISC ops, which then execute on a RISC-like out-of-order pipeline. ARM has added variable-length Thumb-2 instructions and complex SIMD extensions. The distinction has blurred significantly.
          </p>
        </div>
      </Section>

      <Section title="ARM vs x86: Real-World Battle">
        <div className="grid sm:grid-cols-2 gap-5 mb-4">
          <div className="bg-cyan-50 border border-cyan-200 rounded-xl p-5">
            <h4 className="font-bold text-sm text-cyan-700 mb-2">ARM (RISC)</h4>
            <ul className="text-xs text-slate-500 space-y-1.5">
              <li>• 31 general-purpose registers</li>
              <li>• Fixed 32-bit (ARM mode) or 16/32-bit (Thumb-2)</li>
              <li>• Load-store architecture</li>
              <li>• Conditional execution on every instruction</li>
              <li>• Dominates mobile (95%+ smartphones)</li>
              <li>• Apple Silicon M-series: industry-leading perf/watt</li>
            </ul>
          </div>
          <div className="bg-purple-50 border border-purple-200 rounded-xl p-5">
            <h4 className="font-bold text-sm text-purple-700 mb-2">x86 (CISC)</h4>
            <ul className="text-xs text-slate-500 space-y-1.5">
              <li>• 8/16 general-purpose registers</li>
              <li>• Variable 1-15 byte instructions</li>
              <li>• Memory operands in any instruction</li>
              <li>• Complex addressing modes (MODR/M + SIB)</li>
              <li>• Dominates desktop/server (90%+ market)</li>
              <li>• Modern cores: advanced out-of-order, huge caches</li>
            </ul>
          </div>
        </div>
        <CodeBlock code={`// Performance equation comparison
// CPU time = instruction_count × CPI × cycle_time

// For a given program:
// RISC:  more instructions,  lower CPI,  higher clock
// CISC:  fewer instructions, higher CPI, lower clock

// Example: memcpy of 1024 bytes
// RISC (MIPS):  ~260 instructions,  CPI≈1.0,  2GHz → 130ns
// CISC (x86):   ~5 instructions,    CPI≈20,   3GHz → 33ns
// (Modern x86 rep movsb is hw-accelerated, much faster)`} language="plaintext" />
      </Section>

      <Section title="Interview Questions">
        <div className="space-y-3">
          {INTERVIEW_QS.map((item, i) => (
            <InterviewQuestion key={i} question={item.q} answer={item.a} />
          ))}
        </div>
      </Section>
    </div>
  );
}
