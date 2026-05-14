"use client";

import { useState } from "react";
import Link from "next/link";
import { Home, ChevronRight } from "lucide-react";
import { Section, InfoCard, CodeBlock, InterviewQuestion } from "../components";

const MODES = [
  { name: "Immediate", syntax: "ADDI $1, $2, 100", desc: "Operand is the constant value itself. No memory access. Fastest but limited to 16/32-bit constants.", diagram: "instruction → operand value", effAddr: "N/A (value in instr)" },
  { name: "Direct (Absolute)", syntax: "LW $1, 0x1000", desc: "Address field contains the effective memory address. Simple but address must fit in instruction.", diagram: "instruction → address → memory → operand", effAddr: "A (address field)" },
  { name: "Indirect", syntax: "LW $1, ($2)", desc: "Register contains the address of the operand. Two memory accesses: one to get address, one to get data.", diagram: "instruction → register → address → memory → operand", effAddr: "Mem[register]" },
  { name: "Register", syntax: "ADD $1, $2, $3", desc: "Operand is in a register. No memory access. Very fast but limited to registers.", diagram: "register → operand", effAddr: "N/A (register value)" },
  { name: "Register Indirect", syntax: "LW $1, 0($2)", desc: "Register holds memory address. Like indirect but offset may be added. Used for arrays.", diagram: "register + offset → address → memory → operand", effAddr: "Reg + offset" },
  { name: "Indexed", syntax: "LW $1, array($2)", desc: "Base register + index register. Effective address = base + (index × scale). For array access.", diagram: "base + index*scale → address → memory → operand", effAddr: "Base + Index" },
  { name: "Base + Displacement", syntax: "LW $1, 16($2)", desc: "Register base + constant offset. Used for struct fields and stack-allocated locals.", diagram: "register + displacement → address → memory → operand", effAddr: "Reg + displacement" },
  { name: "PC-Relative", syntax: "BEQ $1, $2, label", desc: "Effective address = PC + offset. Used for branches. Allows position-independent code.", diagram: "PC + offset → target address", effAddr: "PC + offset" },
  { name: "Auto-increment", syntax: "MOV ($2)+, $1", desc: "Register is used as address, then incremented. Useful for sequential memory access.", diagram: "use address → access → increment register", effAddr: "Reg, then Reg = Reg + size" },
  { name: "Auto-decrement", syntax: "MOV -($2), $1", desc: "Register is decremented first, then used as address. Used for stack pushes.", diagram: "decrement register → use address → access", effAddr: "Reg = Reg - size, then Reg" },
];

const COMPARISON_TABLE = [
  { mode: "Immediate", speed: "Fastest", flexibility: "Low", codeSize: "Compact", use: "Constants, masks" },
  { mode: "Register", speed: "Fastest", flexibility: "Medium", codeSize: "Compact", use: "ALU operations" },
  { mode: "Direct", speed: "Fast", flexibility: "Low", codeSize: "Medium", use: "Global variables" },
  { mode: "Register Indirect", speed: "Fast", flexibility: "High", codeSize: "Compact", use: "Arrays, pointers" },
  { mode: "Indexed", speed: "Medium", flexibility: "Very High", codeSize: "Medium", use: "Arrays of structs" },
  { mode: "Indirect", speed: "Slowest", flexibility: "High", codeSize: "Medium", use: "Pointers to pointers" },
  { mode: "PC-Relative", speed: "Fast", flexibility: "Medium", codeSize: "Compact", use: "Branches, PIC" },
];

const INTERVIEW_QS = [
  { q: "What is the difference between register mode and register indirect mode?", a: "Register mode uses the register's value directly as the operand (e.g., ADD R1, R2). Register indirect mode uses the register's value as a memory address to fetch the operand (e.g., LW R1, (R2)). Register mode needs no memory access; register indirect needs one memory access to get the operand." },
  { q: "Explain PC-relative addressing and why it's important.", a: "PC-relative addressing computes the effective address as PC + offset. It's used in branch instructions to allow position-independent code (PIC) that works regardless of where the code is loaded in memory. This is critical for shared libraries and dynamically linked code." },
  { q: "How do auto-increment and auto-decrement modes support stack operations?", a: "Auto-increment uses the address then increments, ideal for popping from a stack where the stack pointer increases after read. Auto-decrement decrements then uses the address, ideal for pushing where the stack pointer decreases before write. These are used in architectures like Motorola 68000 for efficient stack-based operations." },
  { q: "Why do modern architectures typically provide fewer addressing modes than older CISC designs?", a: "RISC philosophy argues that complex addressing modes increase hardware complexity, slow down the clock cycle, and complicate pipelining. Modern architectures prefer simpler, regular modes (register, immediate, base+displacement) and rely on compiler optimization to combine simple instructions when needed." },
];

export default function AddressingModesPage() {
  const [selectedMode, setSelectedMode] = useState<string | null>(null);

  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      <div className="flex items-center gap-2 mb-6 text-xs text-slate-500">
        <Link href="/tools/arch" className="text-cyan-600 no-underline flex items-center gap-1.5 hover:text-cyan-800 transition">
          <Home size={16} /> Architecture
        </Link>
        <ChevronRight size={16} />
        <span className="text-slate-900 font-semibold">Addressing Modes</span>
      </div>

      <div className="mb-10">
        <h1 className="text-4xl font-extrabold text-slate-900 mb-3">🎯 Addressing Modes</h1>
        <p className="text-base text-slate-500 leading-relaxed max-w-xl">
          How CPUs determine the location of operands: from immediate constants to complex memory calculations.
        </p>
      </div>

      <Section title="What are Addressing Modes?">
        <InfoCard title="The How of Operand Access" type="info">
          Addressing modes define how the CPU calculates the effective address of an operand. The mode is encoded in the instruction opcode or a separate field. Different modes trade off speed, flexibility, and code size.
        </InfoCard>
        <p className="text-sm text-slate-500 mb-5 leading-relaxed">
          The effective address (EA) is the actual memory address used to access the operand. The addressing mode tells the CPU how to compute EA from the instruction&apos;s address fields and CPU register values.
        </p>
      </Section>

      <Section title="Addressing Modes Overview">
        <div className="grid sm:grid-cols-2 gap-3 mb-5">
          {MODES.map((mode) => (
            <button
              key={mode.name}
              onClick={() => setSelectedMode(selectedMode === mode.name ? null : mode.name)}
              className={`text-left bg-white rounded-xl border p-4 transition-all cursor-pointer ${
                selectedMode === mode.name ? "border-cyan-500 ring-2 ring-cyan-200 shadow-lg" : "border-slate-200 hover:border-cyan-300"
              }`}
            >
              <div className="flex items-center gap-2 mb-1.5">
                <span className="bg-cyan-600 text-white w-5 h-5 rounded flex items-center justify-center text-[10px] font-bold shrink-0">
                  {mode.name[0]}
                </span>
                <h4 className="text-sm font-bold text-slate-900">{mode.name}</h4>
              </div>
              <p className="font-mono text-xs text-cyan-700 mb-1 bg-cyan-50 rounded px-2 py-0.5 inline-block">{mode.syntax}</p>
              <p className="text-xs text-slate-500 mt-1.5">{mode.desc}</p>
            </button>
          ))}
        </div>
        {selectedMode && (
          <div className="bg-gradient-to-br from-cyan-50 to-blue-50 border border-cyan-200 rounded-xl p-5 mb-4">
            {MODES.filter((m) => m.name === selectedMode).map((m) => (
              <div key={m.name}>
                <h4 className="text-sm font-bold text-cyan-700 mb-2">{m.name}</h4>
                <p className="text-xs text-slate-500 mb-2"><strong>Syntax:</strong> <code className="font-mono bg-white px-2 py-0.5 rounded border border-slate-200">{m.syntax}</code></p>
                <p className="text-xs text-slate-500 mb-2"><strong>Effective Address:</strong> {m.effAddr}</p>
                <p className="text-xs text-slate-500"><strong>Flow:</strong> {m.diagram}</p>
              </div>
            ))}
          </div>
        )}
      </Section>

      <Section title="Address Calculation Examples">
        <div className="space-y-4 mb-5">
          <div className="bg-white border border-slate-200 rounded-xl p-4">
            <h4 className="text-sm font-bold text-slate-900 mb-2">Example: Array Access</h4>
            <CodeBlock code={`; C code: arr[i] where arr is at 0x1000, i=5, each element 4 bytes
; Base + Indexed addressing

    li   $t0, 0x1000       ; base address of array
    li   $t1, 5            ; index i
    sll  $t1, $t1, 2       ; t1 = i * 4 (scale by element size)
    add  $t2, $t0, $t1     ; t2 = base + offset = &arr[5]
    lw   $t3, 0($t2)       ; t3 = arr[5] (register indirect with offset)`} language="mips" />
          </div>
          <div className="bg-white border border-slate-200 rounded-xl p-4">
            <h4 className="text-sm font-bold text-slate-900 mb-2">Example: Struct Field Access</h4>
            <CodeBlock code={`; C code: person.age where person is at address in $a0
; Base + Displacement addressing

    lw   $t0, 8($a0)       ; load person.age (offset 8 bytes into struct)
    lw   $t1, 0($a0)       ; load person.name pointer (offset 0)
    lw   $t2, 4($a0)       ; load person.id (offset 4)`} language="mips" />
          </div>
        </div>
      </Section>

      <Section title="Addressing Modes Comparison">
        <div className="overflow-x-auto mb-5">
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100">
                <th className="text-left p-3 font-bold text-slate-700 border-b border-slate-200">Mode</th>
                <th className="text-left p-3 font-bold text-slate-700 border-b border-slate-200">Speed</th>
                <th className="text-left p-3 font-bold text-slate-700 border-b border-slate-200">Flexibility</th>
                <th className="text-left p-3 font-bold text-slate-700 border-b border-slate-200">Code Size</th>
                <th className="text-left p-3 font-bold text-slate-700 border-b border-slate-200">Best For</th>
              </tr>
            </thead>
            <tbody>
              {COMPARISON_TABLE.map((row, i) => (
                <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-slate-50"}>
                  <td className="p-3 font-medium text-slate-700 border-b border-slate-100">{row.mode}</td>
                  <td className="p-3 text-slate-500 border-b border-slate-100">{row.speed}</td>
                  <td className="p-3 text-slate-500 border-b border-slate-100">{row.flexibility}</td>
                  <td className="p-3 text-slate-500 border-b border-slate-100">{row.codeSize}</td>
                  <td className="p-3 text-slate-500 border-b border-slate-100">{row.use}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Section title="Effective Address Calculation">
        <InfoCard title="EA = Base + (Index × Scale) + Displacement" type="tip">
          Many architectures support a generalized formula: Effective Address = Base Register + (Index Register &times; Scale Factor) + Displacement. x86&apos;s MODR/M byte encoding is the classic example, where scale can be 1, 2, 4, or 8.
        </InfoCard>
        <CodeBlock code={`// x86 addressing mode calculation
// MODR/M byte: mod(2) | reg(3) | r/m(3)
// SIB byte:    scale(2) | index(3) | base(3)

uint32_t calc_ea(uint8_t modrm, uint8_t sib, uint32_t base, uint32_t index, int32_t disp) {
    uint8_t mod = (modrm >> 6) & 0x3;
    uint8_t rm  = modrm & 0x7;
    
    if (mod == 0 && rm == 5) return disp;           // [disp32]
    if (mod == 1)             return base + (int8_t)disp;  // [base + disp8]
    if (mod == 2)             return base + disp;         // [base + disp32]
    if (mod == 3)             return base;                // register direct
    
    // With SIB byte
    uint8_t scale_val = 1 << ((sib >> 6) & 0x3);
    return base + (index * scale_val) + disp;
}`} language="c" />
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
