"use client";

import { useState } from "react";
import Link from "next/link";
import { Home, ChevronRight, Layers, Info, Cpu, BookOpen, Flag, ArrowRight } from "lucide-react";
import { Section, InfoCard, CodeBlock, Diagram, InterviewQuestion } from "../components";

const REGISTER_TYPES = [
  { name: "General Purpose Registers (GPR)", desc: "Hold data and addresses. Programmer-visible and used for arithmetic, logic, and data movement. MIPS has 32 × 32-bit GPRs.", icon: Layers },
  { name: "Program Counter (PC)", desc: "Holds address of next instruction to fetch. Automatically incremented after each fetch. Jump/branch instructions modify it.", icon: Cpu },
  { name: "Instruction Register (IR)", desc: "Holds the currently fetched instruction during decoding and execution. Not directly accessible to the programmer.", icon: BookOpen },
  { name: "Memory Address Register (MAR)", desc: "Holds the address of memory location to read/write. Connected to address bus. Both data and instruction fetches use MAR.", icon: Info },
  { name: "Memory Data Register (MDR)", desc: "Holds data transferred between CPU and memory. Acts as a buffer for reads and writes.", icon: Layers },
  { name: "Stack Pointer (SP)", desc: "Points to the top of the stack in memory. Used for function calls, local variables, and context saving.", icon: ArrowRight },
  { name: "Status Register / Flags", desc: "Holds condition codes (Zero, Carry, Overflow, Negative, etc.) set by ALU operations. Used by conditional branch instructions.", icon: Flag },
];

const FLAGS = [
  { name: "Z (Zero)", desc: "Set when ALU result is zero" },
  { name: "C (Carry)", desc: "Set when addition produces a carry out or subtraction needs a borrow" },
  { name: "N (Negative)", desc: "Set when ALU result is negative (MSB = 1)" },
  { name: "V (Overflow)", desc: "Set when signed arithmetic overflows" },
];

const REG_WINDOW_FIELDS = [
  { field: "N", desc: "Number of windows (typically 8-32)" },
  { field: "M", desc: "Number of global registers (typically 8-16)" },
  { field: "C", desc: "Registers per window (typically 24-32)" },
  { field: "Overlapping", desc: "Adjacent windows share registers for parameter passing" },
];

const R31_DESCS = [
  "R0 ($zero): Always zero",
  "R1-R3 ($at-$v1): Assembler temp, function results",
  "R4-R7 ($a0-$a3): Function arguments",
  "R8-R15 ($t0-$t7): Temporary (caller-saved)",
  "R16-R23 ($s0-$s7): Saved (callee-saved)",
  "R24-R25 ($t8-$t9): More temporaries",
  "R26-R27 ($k0-$k1): Kernel reserved",
  "R28 ($gp): Global pointer",
  "R29 ($sp): Stack pointer",
  "R30 ($fp): Frame pointer",
  "R31 ($ra): Return address",
];

const INTERVIEW_QS = [
  { q: "What is the difference between general-purpose and special-purpose registers?", a: "General-purpose registers (GPRs) can hold either data or addresses and are used by arithmetic/logic instructions. Special-purpose registers like PC, IR, MAR, and MDR have dedicated roles: PC tracks the next instruction, IR holds the current instruction, MAR holds memory addresses, and MDR buffers data to/from memory." },
  { q: "Explain register windows in SPARC architecture.", a: "Register windows allow fast context switching by providing multiple overlapping sets of registers. Each window has local registers and shares registers with adjacent windows for parameter passing. The current window pointer (CWP) selects the active window. On function call, the CWP rotates to a new window without saving/loading registers to memory, unless all windows are in use (window overflow trap)." },
  { q: "How does the Stack Pointer (SP) work during function calls?", a: "SP points to the most recently pushed item on the stack. On function call: arguments may be pushed, return address is saved, old frame pointer is saved, local variables are allocated (SP decremented). On return: stack is unwound (SP restored), return address loaded, and execution resumes." },
  { q: "What are condition code flags and how are they used?", a: "Flags like Zero (Z), Carry (C), Negative (N), and Overflow (V) are set by ALU operations and stored in the status register. Conditional branch instructions (e.g., BEQ, BNE) check these flags to make decisions. For example, BEQ branches if Z=1 (last result was zero)." },
];

export default function RegisterOrganizationPage() {
  const [selectedRegister, setSelectedRegister] = useState<string | null>(null);

  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      <div className="flex items-center gap-2 mb-6 text-xs text-slate-500">
        <Link href="/tools/arch" className="text-cyan-600 no-underline flex items-center gap-1.5 hover:text-cyan-800 transition">
          <Home size={16} /> Architecture
        </Link>
        <ChevronRight size={16} />
        <span className="text-slate-900 font-semibold">Register Organization</span>
      </div>

      <div className="mb-10">
        <h1 className="text-4xl font-extrabold text-slate-900 mb-3">📦 Register Organization</h1>
        <p className="text-base text-slate-500 leading-relaxed max-w-xl">
          Understand the different types of CPU registers, their purposes, and how they work together to execute instructions efficiently.
        </p>
      </div>

      <Section title="What are CPU Registers?">
        <InfoCard title="Fastest Memory in the System" type="info">
          Registers are small, ultra-fast storage locations inside the CPU. They hold data, addresses, and control information. Register access is typically 0.5-1 cycle, compared to 4-75 cycles for L1 cache and hundreds for main memory.
        </InfoCard>
        <p className="text-sm text-slate-500 mb-5 leading-relaxed">
          CPU registers are categorized into two broad types: programmer-visible (general-purpose and special-purpose) and internal (temporary storage used during execution).
        </p>
      </Section>

      <Section title="Types of Registers">
        <div className="grid sm:grid-cols-2 gap-3 mb-5">
          {REGISTER_TYPES.map((reg) => {
            const Icon = reg.icon;
            return (
              <button
                key={reg.name}
                onClick={() => setSelectedRegister(selectedRegister === reg.name ? null : reg.name)}
                className={`text-left bg-white rounded-xl border p-4 transition-all cursor-pointer ${
                  selectedRegister === reg.name ? "border-cyan-500 ring-2 ring-cyan-200 shadow-lg" : "border-slate-200 hover:border-cyan-300"
                }`}
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <Icon className="w-4 h-4 text-cyan-600 shrink-0" />
                  <h4 className="text-sm font-bold text-slate-900">{reg.name}</h4>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">{reg.desc}</p>
              </button>
            );
          })}
        </div>
        {selectedRegister && (
          <div className="bg-cyan-50 border border-cyan-200 rounded-xl p-4 mb-4 animate-pulse">
            <p className="text-xs text-cyan-700 font-semibold">Selected: {selectedRegister}</p>
          </div>
        )}
      </Section>

      <Section title="Status Register / Flags">
        <InfoCard title="Condition Code Register (CCR)" type="tip">
          The status register holds individual flag bits that reflect the result of ALU operations. These flags are checked by conditional branch instructions to implement if-else, loops, and comparisons.
        </InfoCard>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
          {FLAGS.map((flag) => (
            <div key={flag.name} className="bg-white border border-slate-200 rounded-xl p-4 text-center">
              <h4 className="text-lg font-black text-cyan-700 mb-1">{flag.name}</h4>
              <p className="text-xs text-slate-500">{flag.desc}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Register File Architecture">
        <Diagram title="MIPS Register File (32 × 32-bit)">
          <div className="w-full max-w-lg space-y-1">
            {R31_DESCS.map((desc, i) => (
              <div key={i} className="flex items-center gap-2 text-xs">
                <span className="w-6 h-6 rounded bg-cyan-100 text-cyan-700 flex items-center justify-center font-bold shrink-0">{i === 29 ? "SP" : i === 31 ? "RA" : `R${i}`}</span>
                <span className="text-slate-600">{desc}</span>
              </div>
            ))}
          </div>
        </Diagram>
        <InfoCard title="Register Convention" type="info">
          MIPS convention divides the 32 registers into categories: caller-saved (t0-t9) and callee-saved (s0-s7). Caller-saved registers must be saved by the calling function, while callee-saved are preserved by the called function.
        </InfoCard>
      </Section>

      <Section title="Register Windows (SPARC Architecture)">
        <InfoCard title="SPARC Innovation" type="warning">
          SPARC uses overlapping register windows to speed up function calls. Instead of saving/restoring registers on every call, the CPU rotates to a fresh set of registers, passing parameters through overlapping windows.
        </InfoCard>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
          {REG_WINDOW_FIELDS.map((f) => (
            <div key={f.field} className="bg-white border border-slate-200 rounded-xl p-4">
              <h4 className="text-sm font-bold text-cyan-700 mb-1">{f.field}</h4>
              <p className="text-xs text-slate-500">{f.desc}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Register Usage Code Example">
        <CodeBlock code={`# MIPS register usage example
# Function: sum array elements
# a0 = array pointer, a1 = count
# v0 = return value (sum)

sum_array:
    li   $v0, 0           # sum = 0
    li   $t0, 0           # i = 0
loop:
    beq  $t0, $a1, done   # if i == count, done
    sll  $t1, $t0, 2      # t1 = i * 4 (byte offset)
    add  $t2, $a0, $t1    # t2 = &array[i]
    lw   $t3, 0($t2)      # t3 = array[i]
    add  $v0, $v0, $t3    # sum += array[i]
    addi $t0, $t0, 1      # i++
    j    loop
done:
    jr   $ra              # return to caller`} language="mips" />
        <div className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-xl p-4 border border-cyan-200 flex items-center gap-3">
          <span className="text-xs text-slate-500 leading-relaxed">
            <strong className="text-cyan-700">Key:</strong> $v0/$v1 = return values, $a0-$a3 = arguments, $t0-$t9 = temporaries, $s0-$s7 = saved registers, $sp = stack pointer, $ra = return address.
          </span>
        </div>
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
