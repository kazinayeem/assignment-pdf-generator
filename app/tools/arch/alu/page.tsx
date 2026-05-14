"use client";

import { useState } from "react";
import Link from "next/link";
import { Home, ChevronRight, Cpu, Hash } from "lucide-react";
import { Section, InfoCard, CodeBlock, InterviewQuestion, Diagram } from "../components";

const ALU_OPS = [
  { op: "ADD", code: "0000", func: "R[rd] = R[rs] + R[rt]", desc: "Arithmetic addition of two registers" },
  { op: "SUB", code: "0001", func: "R[rd] = R[rs] - R[rt]", desc: "Arithmetic subtraction" },
  { op: "AND", code: "0010", func: "R[rd] = R[rs] & R[rt]", desc: "Bitwise AND" },
  { op: "OR", code: "0011", func: "R[rd] = R[rs] | R[rt]", desc: "Bitwise OR" },
  { op: "XOR", code: "0100", func: "R[rd] = R[rs] ^ R[rt]", desc: "Bitwise XOR" },
  { op: "NOR", code: "0101", func: "R[rd] = ~(R[rs] | R[rt])", desc: "Bitwise NOR" },
  { op: "SLT", code: "0110", func: "R[rd] = (R[rs] < R[rt]) ? 1 : 0", desc: "Set on less than (signed comparison)" },
  { op: "SLL", code: "0111", func: "R[rd] = R[rt] << shamt", desc: "Logical left shift" },
];

const CONTROL_SIGNALS = [
  { signal: "RegDst", bits: 1, purpose: "Selects destination register (rt vs rd)" },
  { signal: "ALUSrc", bits: 1, purpose: "Selects second ALU operand (register vs immediate)" },
  { signal: "MemtoReg", bits: 1, purpose: "Selects data written back (ALU result vs memory)" },
  { signal: "RegWrite", bits: 1, purpose: "Enables register file write" },
  { signal: "MemRead", bits: 1, purpose: "Enables memory read" },
  { signal: "MemWrite", bits: 1, purpose: "Enables memory write" },
  { signal: "Branch", bits: 1, purpose: "Indicates branch instruction" },
  { signal: "ALUOp", bits: 2, purpose: "Encodes ALU operation type" },
];

export default function ALUPage() {
  const [selectedOp, setSelectedOp] = useState(0);
  const [a, setA] = useState(10);
  const [b, setB] = useState(3);
  const [showBinary, setShowBinary] = useState(false);

  const computeResult = (opIdx: number) => {
    const op = ALU_OPS[opIdx].op;
    switch (op) {
      case "ADD": return a + b;
      case "SUB": return a - b;
      case "AND": return a & b;
      case "OR": return a | b;
      case "XOR": return a ^ b;
      case "NOR": return ~(a | b);
      case "SLT": return a < b ? 1 : 0;
      case "SLL": return a << 1;
      default: return 0;
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      <div className="flex items-center gap-2 mb-6 text-xs text-slate-500">
        <Link href="/tools/arch" className="text-cyan-600 no-underline flex items-center gap-1.5 hover:text-cyan-800 transition">
          <Home size={16} /> Architecture
        </Link>
        <ChevronRight size={16} />
        <span className="text-slate-900 font-semibold">ALU Design</span>
      </div>

      <div className="mb-10">
        <h1 className="text-4xl font-extrabold text-slate-900 mb-3">🔢 ALU Design</h1>
        <p className="text-base text-slate-500 leading-relaxed max-w-xl">
          The Arithmetic Logic Unit is the computational heart of the CPU. Explore how ALUs perform arithmetic and logic operations, how control signals select operations, and how 32-bit ALUs are constructed.
        </p>
      </div>

      <Section title="What is an ALU?">
        <InfoCard title="Core Definition" type="info">
          The Arithmetic Logic Unit (ALU) is a combinational digital circuit that performs arithmetic and bitwise logic operations on integer binary numbers. It is the fundamental building block of the CPU's execution stage.
        </InfoCard>
        <div className="grid sm:grid-cols-3 gap-4 mb-5">
          <div className="bg-cyan-50 rounded-xl border border-cyan-200 p-4">
            <h4 className="text-sm font-bold text-cyan-700 mb-1.5">Arithmetic</h4>
            <p className="text-xs text-slate-500">Addition, subtraction, multiplication (via iterative add/shift), increment, decrement</p>
          </div>
          <div className="bg-emerald-50 rounded-xl border border-emerald-200 p-4">
            <h4 className="text-sm font-bold text-emerald-700 mb-1.5">Logic</h4>
            <p className="text-xs text-slate-500">AND, OR, XOR, NOR, NAND, NOT — bitwise operations on operands</p>
          </div>
          <div className="bg-violet-50 rounded-xl border border-violet-200 p-4">
            <h4 className="text-sm font-bold text-violet-700 mb-1.5">Comparison</h4>
            <p className="text-xs text-slate-500">Set on less than (SLT), equality check, zero detection for branch decisions</p>
          </div>
        </div>
      </Section>

      <Section title="ALU Block Diagram">
        <Diagram title="Single-Bit ALU Core">
          <div className="grid grid-cols-2 gap-6 w-full max-w-lg">
            <div className="bg-gradient-to-br from-slate-50 to-white border-2 border-slate-300 rounded-xl p-4 text-center">
              <h4 className="text-[10px] font-bold text-slate-400 uppercase mb-2">Input A (32-bit)</h4>
              <div className="flex gap-0.5 justify-center mb-2">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="w-6 h-8 bg-cyan-100 border border-cyan-300 rounded text-[9px] font-mono flex items-center justify-center text-cyan-700 font-bold">
                    {showBinary ? (a >> (7 - i)) & 1 : "x"}
                  </div>
                ))}
              </div>
              <p className="text-[10px] text-slate-400 font-mono">A[31:0]</p>
            </div>
            <div className="bg-gradient-to-br from-slate-50 to-white border-2 border-slate-300 rounded-xl p-4 text-center">
              <h4 className="text-[10px] font-bold text-slate-400 uppercase mb-2">Input B (32-bit)</h4>
              <div className="flex gap-0.5 justify-center mb-2">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="w-6 h-8 bg-amber-100 border border-amber-300 rounded text-[9px] font-mono flex items-center justify-center text-amber-700 font-bold">
                    {showBinary ? (b >> (7 - i)) & 1 : "x"}
                  </div>
                ))}
              </div>
              <p className="text-[10px] text-slate-400 font-mono">B[31:0]</p>
            </div>
            <div className="col-span-2 bg-gradient-to-br from-cyan-500 to-blue-600 text-white rounded-xl p-5 text-center shadow-lg">
              <Cpu className="w-6 h-6 mx-auto mb-2" />
              <h4 className="text-sm font-bold mb-1">ALU</h4>
              <p className="text-[10px] text-white/80 mb-2">Operation Select: {ALU_OPS[selectedOp].code}</p>
              <div className="flex gap-1 justify-center">
                {Array.from({ length: 8 }).map((_, i) => {
                  const r = computeResult(selectedOp);
                  return (
                    <div key={i} className="w-6 h-8 bg-white/20 border border-white/30 rounded text-[9px] font-mono flex items-center justify-center text-white font-bold">
                      {showBinary ? ((r >> (7 - i)) & 1) : "z"}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </Diagram>

        <InfoCard title="ALU Control Signals" type="tip">
          A multiplexer inside the ALU selects which operation to perform based on the ALUOp control signal (typically 3-4 bits, supporting 8-16 operations). The Zero flag output indicates when the result is all zeros.
        </InfoCard>
      </Section>

      <Section title="ALU Operations Table">
        <div className="overflow-x-auto mb-5">
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100">
                <th className="p-3 text-left font-bold text-slate-700 border border-slate-200">Operation</th>
                <th className="p-3 text-left font-bold text-slate-700 border border-slate-200">Opcode</th>
                <th className="p-3 text-left font-bold text-slate-700 border border-slate-200">Function</th>
                <th className="p-3 text-left font-bold text-slate-700 border border-slate-200">Description</th>
              </tr>
            </thead>
            <tbody>
              {ALU_OPS.map((op, i) => (
                <tr key={i} className={`${i === selectedOp ? "bg-cyan-50" : "bg-white"} hover:bg-slate-50 cursor-pointer`} onClick={() => setSelectedOp(i)}>
                  <td className="p-3 border border-slate-200 font-mono font-bold text-slate-900">{op.op}</td>
                  <td className="p-3 border border-slate-200 font-mono text-slate-600">{op.code}</td>
                  <td className="p-3 border border-slate-200 font-mono text-slate-600">{op.func}</td>
                  <td className="p-3 border border-slate-200 text-slate-500">{op.desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Section title="Interactive ALU Simulator">
        <InfoCard title="Try It Yourself" type="tip">
          Select an operation and input values. Watch how the ALU computes the result instantly. Toggle binary view to see bit-level operations.
        </InfoCard>
        <div className="bg-white rounded-xl border border-slate-200 p-6 mb-5 shadow-sm">
          <div className="grid sm:grid-cols-2 gap-4 mb-5">
            <div>
              <label className="text-xs font-bold text-slate-600 block mb-1.5">Input A (decimal)</label>
              <input type="number" value={a} onChange={(e) => setA(Number(e.target.value))}
                className="w-full border-2 border-slate-200 rounded-lg p-2.5 text-sm font-mono focus:border-cyan-500 focus:outline-none" />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-600 block mb-1.5">Input B (decimal)</label>
              <input type="number" value={b} onChange={(e) => setB(Number(e.target.value))}
                className="w-full border-2 border-slate-200 rounded-lg p-2.5 text-sm font-mono focus:border-cyan-500 focus:outline-none" />
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mb-5">
            {ALU_OPS.map((op, i) => (
              <button key={i} onClick={() => setSelectedOp(i)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition ${
                  selectedOp === i
                    ? "bg-cyan-600 text-white border-cyan-600"
                    : "bg-white text-slate-600 border-slate-200 hover:border-cyan-400"
                }`}>
                {op.op}
              </button>
            ))}
          </div>

          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200">
            <div className="text-center">
              <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">A</p>
              <p className="text-lg font-mono font-bold text-slate-900">{a}</p>
              <p className="text-[10px] text-slate-400 font-mono">{showBinary ? `0b${a.toString(2).padStart(8, "0")}` : ""}</p>
            </div>
            <div className="text-2xl text-cyan-600 font-bold">{ALU_OPS[selectedOp].op}</div>
            <div className="text-center">
              <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">B</p>
              <p className="text-lg font-mono font-bold text-slate-900">{b}</p>
              <p className="text-[10px] text-slate-400 font-mono">{showBinary ? `0b${b.toString(2).padStart(8, "0")}` : ""}</p>
            </div>
            <div className="text-2xl text-slate-300 font-bold">=</div>
            <div className="text-center">
              <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Result</p>
              <p className="text-lg font-mono font-bold text-emerald-600">{computeResult(selectedOp)}</p>
              <p className="text-[10px] text-slate-400 font-mono">{showBinary ? `0b${(computeResult(selectedOp) >>> 0).toString(2).padStart(8, "0").slice(-8)}` : ""}</p>
            </div>
          </div>

          <button onClick={() => setShowBinary(!showBinary)}
            className="mt-3 text-xs text-cyan-600 font-semibold flex items-center gap-1.5 hover:text-cyan-800 transition cursor-pointer">
            <Hash size={14} /> {showBinary ? "Show Decimal" : "Show Binary Representation"}
          </button>
        </div>
      </Section>

      <Section title="32-bit ALU Design Concept">
        <InfoCard title="Ripple-Carry Architecture" type="info">
          A 32-bit ALU is constructed by connecting 32 single-bit ALUs in parallel. Each 1-bit ALU computes one bit of the result, and carry signals ripple from the least significant bit (LSB) to the most significant bit (MSB).
        </InfoCard>
        <div className="overflow-x-auto mb-5">
          <div className="flex gap-1 min-w-max py-3">
            {Array.from({ length: 32 }).map((_, i) => (
              <div key={i} className="flex flex-col items-center">
                <div className="bg-gradient-to-br from-cyan-500 to-blue-600 text-white w-8 h-10 rounded text-[9px] font-mono flex items-center justify-center font-bold shadow-sm">
                  ALU
                </div>
                <span className="text-[8px] text-slate-400 mt-1 font-mono">{i}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="grid sm:grid-cols-2 gap-4 mb-5">
          <div className="bg-white rounded-xl border border-slate-200 p-4">
            <h4 className="text-xs font-bold text-slate-900 mb-2">Key Design Components</h4>
            <ul className="text-xs text-slate-500 space-y-1.5">
              <li>• <strong>Full Adders</strong> — One per bit position</li>
              <li>• <strong>MUX-based operation select</strong> — Chooses between ADD, AND, OR, etc.</li>
              <li>• <strong>Carry chain</strong> — Propagates carry from bit 0 through bit 31</li>
              <li>• <strong>Zero detection</strong> — NOR gate across all result bits</li>
              <li>• <strong>Overflow detection</strong> — XOR of carry-in and carry-out of MSB</li>
            </ul>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-4">
            <h4 className="text-xs font-bold text-slate-900 mb-2">Performance Optimizations</h4>
            <ul className="text-xs text-slate-500 space-y-1.5">
              <li>• <strong>Carry Look-Ahead (CLA)</strong> — Computes carries in parallel</li>
              <li>• <strong>Carry Save Adder (CSA)</strong> — For multi-operand addition</li>
              <li>• <strong>Conditional Sum</strong> — Pre-computes with carry=0 and carry=1</li>
              <li>• <strong>Pipeline stages</strong> — For high-frequency ALU operations</li>
            </ul>
          </div>
        </div>
      </Section>

      <Section title="Control Signals Reference">
        <div className="overflow-x-auto mb-5">
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100">
                <th className="p-3 text-left font-bold text-slate-700 border border-slate-200">Signal</th>
                <th className="p-3 text-left font-bold text-slate-700 border border-slate-200">Width</th>
                <th className="p-3 text-left font-bold text-slate-700 border border-slate-200">Purpose</th>
              </tr>
            </thead>
            <tbody>
              {CONTROL_SIGNALS.map((sig, i) => (
                <tr key={i} className="bg-white hover:bg-slate-50">
                  <td className="p-3 border border-slate-200 font-mono font-bold text-slate-900">{sig.signal}</td>
                  <td className="p-3 border border-slate-200 font-mono text-slate-600">{sig.bits} bit</td>
                  <td className="p-3 border border-slate-200 text-slate-500">{sig.purpose}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Section title="ALU in Verilog">
        <InfoCard title="Hardware Description" type="info">
          This Verilog module implements a simple ALU with the core operations. The `alu_op` select line determines which function is performed on inputs `a` and `b`.
        </InfoCard>
        <CodeBlock code={`module alu_32bit (
    input  logic [31:0] a, b,
    input  logic [2:0]  alu_op,
    output logic [31:0] result,
    output logic        zero,
    output logic        overflow
);
    always_comb begin
        case (alu_op)
            3'b000: result = a + b;          // ADD
            3'b001: result = a - b;          // SUB
            3'b010: result = a & b;          // AND
            3'b011: result = a | b;          // OR
            3'b100: result = a ^ b;          // XOR
            3'b101: result = ~(a | b);       // NOR
            3'b110: result = ($signed(a) < $signed(b)) ? 32'b1 : 32'b0;  // SLT
            3'b111: result = b << 1;         // SLL
        endcase
    end
    assign zero = (result == 32'b0);
    assign overflow = (a[31] == b[31]) && (result[31] != a[31]);
endmodule`} language="verilog" />
      </Section>

      <Section title="Interview Questions">
        <InterviewQuestion question="Explain how a 1-bit ALU is constructed and how it scales to 32 bits."
          answer="A 1-bit ALU contains a full adder for arithmetic (sum = A XOR B XOR Cin, Cout = (A&B)|(B&Cin)|(A&Cin)), a logic unit for bitwise operations, and a MUX to select the output. For 32 bits, 32 such units are cascaded with carry ripple from bit 0 to bit 31. Each unit receives the same operation select lines. The Zero flag is computed via a 32-input NOR gate on the result." />
        <InterviewQuestion question="What are the key control signals for an ALU and how do they relate to the instruction format?"
          answer="ALUOp (2-3 bits) encodes the operation class (R-type, branch, memory). In R-type instructions, the funct field selects the specific ALU operation. ALUSrc chooses between register and immediate operand. RegDst selects the destination register. The control unit decodes the opcode and funct fields to generate these signals." />
        <InterviewQuestion question="How does the ALU detect overflow, and why is it important?"
          answer="Overflow occurs when the result of an arithmetic operation exceeds the representable range. For signed addition, overflow = (A[MSB] == B[MSB]) AND (Result[MSB] != A[MSB]) — meaning the sign is wrong. For subtraction, overflow = (A[MSB] != B[MSB]) AND (Result[MSB] == B[MSB]). Overflow detection is critical for correct arithmetic in two's complement representation." />
        <InterviewQuestion question="Compare ripple-carry, carry-lookahead, and carry-save adder designs."
          answer="Ripple-carry is simplest but slowest: carry propagates through all 32 stages (O(n) delay). Carry-lookahead computes generate (G = A&B) and propagate (P = A XOR B) signals to compute carries in parallel (O(log n) delay). Carry-save adder reduces three numbers to two (sum and carry) without propagating carry, useful for multi-operand addition in multipliers." />
      </Section>
    </div>
  );
}
