"use client";

import { useState } from "react";
import Link from "next/link";
import { Home, ChevronRight } from "lucide-react";
import { Section, InfoCard, CodeBlock, Diagram, InterviewQuestion } from "../components";

const FORMATS = [
  { name: "R-type (Register)", fields: "opcode (6) | rs (5) | rt (5) | rd (5) | shamt (5) | funct (6)", example: "ADD $1, $2, $3 → 000000 00010 00011 00001 00000 100000", bits: 32, use: "Arithmetic & logical operations" },
  { name: "I-type (Immediate)", fields: "opcode (6) | rs (5) | rt (5) | immediate (16)", example: "ADDI $1, $2, 100 → 001000 00010 00001 0000000001100100", bits: 32, use: "ALU with immediate, loads/stores, branches" },
  { name: "J-type (Jump)", fields: "opcode (6) | address (26)", example: "J 0x100000 → 000010 00000100000000000000000000", bits: 32, use: "Unconditional jumps" },
];

const COMPARISON = [
  { feature: "Instruction Length", fixed: "Fixed (32-bit)", variable: "1-15 bytes" },
  { feature: "Encoding Complexity", fixed: "Simple, uniform", variable: "Complex, variable" },
  { feature: "Decoding Hardware", fixed: "Simple decoder", variable: "Complex microcode decoder" },
  { feature: "Pipeline Impact", fixed: "Easy to pipeline", variable: "Harder to pipeline" },
  { feature: "Code Density", fixed: "Lower density", variable: "Higher density" },
  { feature: "Example Architectures", fixed: "MIPS, ARM, RISC-V", variable: "x86, 68000" },
];

const OPCODE_TABLE = [
  { op: "000000", inst: "ADD/SUB/AND/OR (R-type)", desc: "ALU operations, funct field selects exact operation" },
  { op: "001000", inst: "ADDI", desc: "Add immediate" },
  { op: "100011", inst: "LW", desc: "Load word from memory" },
  { op: "101011", inst: "SW", desc: "Store word to memory" },
  { op: "000100", inst: "BEQ", desc: "Branch if equal" },
  { op: "000010", inst: "J", desc: "Jump to address" },
];

const FUNCT_TABLE = [
  { funct: "100000", inst: "ADD", desc: "Add rd = rs + rt" },
  { funct: "100010", inst: "SUB", desc: "Subtract rd = rs - rt" },
  { funct: "100100", inst: "AND", desc: "Bitwise AND" },
  { funct: "100101", inst: "OR", desc: "Bitwise OR" },
  { funct: "101010", inst: "SLT", desc: "Set on less than" },
];

const INTERVIEW_QS = [
  { q: "Explain the three MIPS instruction formats and their differences.", a: "R-type (Register) uses three register operands and is used for arithmetic/logic. I-type (Immediate) uses two registers and a 16-bit immediate for ALU ops, loads/stores, and branches. J-type (Jump) uses a 26-bit target address for unconditional jumps. R-type has a funct field to select the exact ALU operation since opcode is 000000." },
  { q: "What are the tradeoffs between fixed-length and variable-length instructions?", a: "Fixed-length (e.g., MIPS 32-bit) simplifies decoding and pipelining but wastes space on simple instructions. Variable-length (e.g., x86) improves code density but complicates decoding, often requiring microcode, and makes pipelining harder since instruction boundaries aren't known upfront." },
  { q: "How does the opcode field determine instruction behavior?", a: "The opcode tells the CPU which operation to perform. In MIPS, the main opcode (bits 31-26) identifies the instruction type. For R-type, opcode is all zeros and the funct field selects the exact operation. For I-type, the opcode encodes both the operation and identifies it as immediate. J-type opcode identifies jump." },
  { q: "What is the shamt field used for in R-type instructions?", a: "Shamt (shift amount, bits 10-6) specifies the shift amount for shift instructions like SLL (shift left logical) and SRL (shift right logical). For non-shift R-type instructions, shamt is set to 0 and ignored." },
];

export default function InstructionFormatsPage() {
  const [activeFormat, setActiveFormat] = useState<string>("R-type (Register)");

  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      <div className="flex items-center gap-2 mb-6 text-xs text-slate-500">
        <Link href="/tools/arch" className="text-cyan-600 no-underline flex items-center gap-1.5 hover:text-cyan-800 transition">
          <Home size={16} /> Architecture
        </Link>
        <ChevronRight size={16} />
        <span className="text-slate-900 font-semibold">Instruction Formats</span>
      </div>

      <div className="mb-10">
        <h1 className="text-4xl font-extrabold text-slate-900 mb-3">📋 Instruction Formats</h1>
        <p className="text-base text-slate-500 leading-relaxed max-w-xl">
          How instructions are encoded: field layouts, opcodes, operands, and the difference between fixed and variable-length encodings.
        </p>
      </div>

      <Section title="What are Instruction Formats?">
        <InfoCard title="Binary Encoding of Operations" type="info">
          An instruction format defines how the CPU interprets the bits of an instruction. Each format divides the instruction into fields: opcode (what to do), operands (who to do it to/with), and optional modifiers. The CPU decodes these fields to generate control signals.
        </InfoCard>
        <p className="text-sm text-slate-500 mb-5 leading-relaxed">
          MIPS uses three primary formats, each 32 bits wide. The opcode field (bits 31-26) identifies the format and operation. R-type uses a secondary funct field when opcode is 000000.
        </p>
      </Section>

      <Section title="MIPS Instruction Formats">
        <div className="flex flex-wrap gap-2 mb-5">
          {FORMATS.map((fmt) => (
            <button
              key={fmt.name}
              onClick={() => setActiveFormat(fmt.name)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold border-2 transition-all cursor-pointer ${
                activeFormat === fmt.name
                  ? "bg-cyan-600 text-white border-cyan-600 shadow-md"
                  : "bg-white text-slate-600 border-slate-200 hover:border-cyan-300"
              }`}
            >
              {fmt.name}
            </button>
          ))}
        </div>
        {FORMATS.filter((f) => f.name === activeFormat).map((fmt) => (
          <div key={fmt.name} className="bg-white border-2 border-cyan-500 rounded-xl p-5 mb-5">
            <div className="grid sm:grid-cols-2 gap-4 mb-4">
              <div>
                <h4 className="font-bold text-sm text-cyan-700 mb-2">Field Layout</h4>
                <p className="font-mono text-xs text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-200">{fmt.fields}</p>
              </div>
              <div>
                <h4 className="font-bold text-sm text-cyan-700 mb-2">Example</h4>
                <p className="font-mono text-xs text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-200 break-all">{fmt.example}</p>
              </div>
            </div>
            <div className="flex gap-4 text-xs text-slate-500">
              <span><strong>Width:</strong> {fmt.bits}-bit</span>
              <span><strong>Use:</strong> {fmt.use}</span>
            </div>
          </div>
        ))}
        <Diagram title="R-type Instruction Bit Layout">
          <div className="w-full max-w-2xl flex flex-col items-center">
            <div className="flex w-full text-[10px] font-mono font-bold mb-1">
              <div className="flex-1 text-center" style={{ minWidth: "18.75%" }}>opcode</div>
              <div className="flex-1 text-center" style={{ minWidth: "15.625%" }}>rs</div>
              <div className="flex-1 text-center" style={{ minWidth: "15.625%" }}>rt</div>
              <div className="flex-1 text-center" style={{ minWidth: "15.625%" }}>rd</div>
              <div className="flex-1 text-center" style={{ minWidth: "15.625%" }}>shamt</div>
              <div className="flex-1 text-center" style={{ minWidth: "18.75%" }}>funct</div>
            </div>
            <div className="flex w-full h-8 text-xs font-mono font-bold text-white mb-1">
              <div className="flex items-center justify-center" style={{ width: "18.75%", backgroundColor: "#0891b2" }}>31-26</div>
              <div className="flex items-center justify-center" style={{ width: "15.625%", backgroundColor: "#0e7490" }}>25-21</div>
              <div className="flex items-center justify-center" style={{ width: "15.625%", backgroundColor: "#155e75" }}>20-16</div>
              <div className="flex items-center justify-center" style={{ width: "15.625%", backgroundColor: "#164e63" }}>15-11</div>
              <div className="flex items-center justify-center" style={{ width: "15.625%", backgroundColor: "#0891b2" }}>10-6</div>
              <div className="flex items-center justify-center" style={{ width: "18.75%", backgroundColor: "#0e7490" }}>5-0</div>
            </div>
            <div className="flex w-full text-[10px] text-slate-500">
              <div className="flex-1 text-center">6 bits</div>
              <div className="flex-1 text-center">5 bits</div>
              <div className="flex-1 text-center">5 bits</div>
              <div className="flex-1 text-center">5 bits</div>
              <div className="flex-1 text-center">5 bits</div>
              <div className="flex-1 text-center">6 bits</div>
            </div>
          </div>
        </Diagram>
      </Section>

      <Section title="Opcode and Funct Tables">
        <div className="grid sm:grid-cols-2 gap-5 mb-5">
          <div>
            <h4 className="text-sm font-bold text-slate-900 mb-3">Common Opcodes</h4>
            <div className="space-y-1.5">
              {OPCODE_TABLE.map((row) => (
                <div key={row.op} className="flex items-center gap-2 text-xs">
                  <span className="font-mono font-bold text-cyan-700 w-14 shrink-0">{row.op}</span>
                  <span className="text-slate-800 w-20 shrink-0 font-medium">{row.inst}</span>
                  <span className="text-slate-500">{row.desc}</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900 mb-3">Common Funct Codes (R-type)</h4>
            <div className="space-y-1.5">
              {FUNCT_TABLE.map((row) => (
                <div key={row.funct} className="flex items-center gap-2 text-xs">
                  <span className="font-mono font-bold text-cyan-700 w-14 shrink-0">{row.funct}</span>
                  <span className="text-slate-800 w-14 shrink-0 font-medium">{row.inst}</span>
                  <span className="text-slate-500">{row.desc}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      <Section title="Fixed vs Variable Length Instructions">
        <div className="overflow-x-auto mb-5">
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100">
                <th className="text-left p-3 font-bold text-slate-700 border-b border-slate-200">Feature</th>
                <th className="text-left p-3 font-bold text-slate-700 border-b border-slate-200">Fixed-Length</th>
                <th className="text-left p-3 font-bold text-slate-700 border-b border-slate-200">Variable-Length</th>
              </tr>
            </thead>
            <tbody>
              {COMPARISON.map((row, i) => (
                <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-slate-50"}>
                  <td className="p-3 font-medium text-slate-700 border-b border-slate-100">{row.feature}</td>
                  <td className="p-3 text-slate-500 border-b border-slate-100">{row.fixed}</td>
                  <td className="p-3 text-slate-500 border-b border-slate-100">{row.variable}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <InfoCard title="Modern Compromise" type="tip">
          ARM&apos;s Thumb-2 and RISC-V&apos;s compressed instruction extension (RVC) offer a compromise: they use 16-bit encodings for common instructions alongside 32-bit instructions, improving code density while keeping decoding relatively simple.
        </InfoCard>
      </Section>

      <Section title="Encoding & Decoding Example">
        <CodeBlock code={`// Encoding: ADD $9, $10, $11
// R-type: opcode(000000) rs(01010) rt(01011) rd(01001) shamt(00000) funct(100000)
// Binary: 000000 01010 01011 01001 00000 100000
// Hex: 0x014B4820

uint32_t encode_rtype(uint8_t op, uint8_t rs, uint8_t rt, uint8_t rd, uint8_t shamt, uint8_t funct) {
    return (op << 26) | (rs << 21) | (rt << 16) | (rd << 11) | (shamt << 6) | funct;
}

// Decoding
void decode(uint32_t instr) {
    uint8_t opcode = (instr >> 26) & 0x3F;
    uint8_t rs     = (instr >> 21) & 0x1F;
    uint8_t rt     = (instr >> 16) & 0x1F;
    uint8_t rd     = (instr >> 11) & 0x1F;
    uint8_t shamt  = (instr >> 6)  & 0x1F;
    uint8_t funct  = instr & 0x3F;
    uint16_t imm   = instr & 0xFFFF;
    
    if (opcode == 0) {
        // R-type: use funct
        printf("R-type: rd=%d, rs=%d, rt=%d, funct=0x%X\\n", rd, rs, rt, funct);
    } else {
        // I-type
        printf("I-type: opcode=0x%X, rs=%d, rt=%d, imm=%d\\n", opcode, rs, rt, (int16_t)imm);
    }
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
