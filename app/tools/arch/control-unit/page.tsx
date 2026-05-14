"use client";

import { useState } from "react";
import Link from "next/link";
import { Home, ChevronRight, Cpu, CircuitBoard, GitBranch, Zap } from "lucide-react";
import { Section, InfoCard, CodeBlock, InterviewQuestion, Diagram } from "../components";

const CONTROL_TYPES = [
  { type: "Hardwired Control", pros: ["Fast (combinational logic)", "Optimized for RISC", "Small area"], cons: ["Inflexible", "Hard to modify", "Complex for large ISAs"], best: "RISC processors (MIPS, ARM)" },
  { type: "Microprogrammed Control", pros: ["Flexible & easy to modify", "Systematic design", "Handles complex ISAs"], cons: ["Slower (memory access)", "Larger area", "More power"], best: "CISC processors (x86)" },
];

const CYCLE_STATES = [
  { state: "S0: IFetch", desc: "MAR ← PC, MDR ← MEM[MAR], IR ← MDR, PC ← PC + 4", active: ["MAR", "MEM", "MDR", "IR", "PC"] },
  { state: "S1: Decode", desc: "Control unit decodes opcode, reads register file, sign-extends immediate", active: ["Control", "RegFile"] },
  { state: "S2: Execute", desc: "ALU performs operation on operands, computes branch targets", active: ["ALU"] },
  { state: "S3: Memory", desc: "Load/store: MEM[MAR] ← MDR or MDR ← MEM[MAR]", active: ["MAR", "MEM", "MDR"] },
  { state: "S4: WriteBack", desc: "ALU result or memory data written to register file", active: ["RegFile"] },
];

const INSTRUCTION_FLOW = [
  { step: "Instruction Fetch", action: "Get instruction from memory at PC address", dur: "1 cycle" },
  { step: "Instruction Decode", action: "Extract opcode, registers, immediate; generate control signals", dur: "1 cycle" },
  { step: "Operand Fetch", action: "Read register file or sign-extend immediate", dur: "1 cycle" },
  { step: "Execute", action: "ALU operation, address calculation, or branch evaluation", dur: "1-3 cycles" },
  { step: "Memory Access", action: "Load/store to data memory (skipped for ALU instructions)", dur: "1 cycle" },
  { step: "Write Back", action: "Write result to destination register", dur: "1 cycle" },
];

export default function ControlUnitPage() {
  const [activeState, setActiveState] = useState(0);
  const [showMicro, setShowMicro] = useState(true);
  const [view, setView] = useState<"cycle" | "decode">("cycle");

  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      <div className="flex items-center gap-2 mb-6 text-xs text-slate-500">
        <Link href="/tools/arch" className="text-cyan-600 no-underline flex items-center gap-1.5 hover:text-cyan-800 transition">
          <Home size={16} /> Architecture
        </Link>
        <ChevronRight size={16} />
        <span className="text-slate-900 font-semibold">Control Unit</span>
      </div>

      <div className="mb-10">
        <h1 className="text-4xl font-extrabold text-slate-900 mb-3">🎛️ Control Unit</h1>
        <p className="text-base text-slate-500 leading-relaxed max-w-xl">
          The Control Unit is the brain's conductor — it generates timing and control signals that orchestrate every operation in the CPU. Learn how instructions are decoded and how control flows through the processor.
        </p>
      </div>

      <Section title="What is a Control Unit?">
        <InfoCard title="Definition" type="info">
          The Control Unit (CU) is a digital circuit that directs the operation of the processor. It receives instructions from memory, decodes them, and generates the necessary control signals to coordinate the ALU, registers, memory, and I/O devices.
        </InfoCard>
        <div className="grid sm:grid-cols-3 gap-4 mb-5">
          <div className="bg-cyan-50 rounded-xl border border-cyan-200 p-4">
            <h4 className="text-sm font-bold text-cyan-700 mb-1.5 flex items-center gap-1.5"><CircuitBoard size={14} /> Instruction Decode</h4>
            <p className="text-xs text-slate-500">Interprets opcode and funct fields to determine which operation to perform</p>
          </div>
          <div className="bg-emerald-50 rounded-xl border border-emerald-200 p-4">
            <h4 className="text-sm font-bold text-emerald-700 mb-1.5 flex items-center gap-1.5"><Zap size={14} /> Control Signal Generation</h4>
            <p className="text-xs text-slate-500">Produces RegWrite, MemRead, ALUSrc, ALUOp, and other timing signals</p>
          </div>
          <div className="bg-violet-50 rounded-xl border border-violet-200 p-4">
            <h4 className="text-sm font-bold text-violet-700 mb-1.5 flex items-center gap-1.5"><GitBranch size={14} /> Sequencing</h4>
            <p className="text-xs text-slate-500">Determines the next micro-instruction or state in the instruction cycle</p>
          </div>
        </div>
      </Section>

      <Section title="Hardwired vs Microprogrammed Control">
        <InfoCard title="Tradeoff: Speed vs Flexibility" type="tip">
          Hardwired control uses combinational logic gates for fast, fixed control. Microprogrammed control stores control signals in a ROM for flexibility and easier modification. Most modern CPUs use a hybrid approach.
        </InfoCard>
        <div className="flex gap-3 mb-5">
          <button onClick={() => setShowMicro(true)}
            className={`flex-1 p-3 rounded-xl text-xs font-bold border transition cursor-pointer ${
              showMicro ? "bg-cyan-600 text-white border-cyan-600" : "bg-white text-slate-600 border-slate-200 hover:border-cyan-400"
            }`}>
            Microprogrammed
          </button>
          <button onClick={() => setShowMicro(false)}
            className={`flex-1 p-3 rounded-xl text-xs font-bold border transition cursor-pointer ${
              !showMicro ? "bg-cyan-600 text-white border-cyan-600" : "bg-white text-slate-600 border-slate-200 hover:border-cyan-400"
            }`}>
            Hardwired
          </button>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          {(showMicro ? [CONTROL_TYPES[1]] : [CONTROL_TYPES[0]]).map((ct, i) => (
            <div key={i} className="bg-white rounded-xl border border-slate-200 p-5">
              <h4 className="text-sm font-bold text-slate-900 mb-3">{ct.type}</h4>
              <div className="mb-3">
                <p className="text-xs font-semibold text-emerald-600 mb-1.5">Advantages:</p>
                {ct.pros.map((p, j) => <p key={j} className="text-xs text-slate-500 ml-2">✓ {p}</p>)}
              </div>
              <div className="mb-3">
                <p className="text-xs font-semibold text-pink-600 mb-1.5">Disadvantages:</p>
                {ct.cons.map((c, j) => <p key={j} className="text-xs text-slate-500 ml-2">✗ {c}</p>)}
              </div>
              <p className="text-xs text-slate-400">Best for: <span className="font-semibold text-slate-600">{ct.best}</span></p>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Finite State Machine for Instruction Execution">
        <InfoCard title="FSM-based Control" type="info">
          The control unit is often implemented as a finite state machine. Each state corresponds to a cycle step, and the opcode determines the sequence of states traversed. The FSM generates different control signals in each state.
        </InfoCard>

        <div className="flex gap-2 mb-5 flex-wrap">
          {["cycle", "decode"].map((v) => (
            <button key={v} onClick={() => setView(v as typeof view)}
              className={`px-4 py-2 rounded-lg text-xs font-bold border transition cursor-pointer ${
                view === v ? "bg-cyan-600 text-white border-cyan-600" : "bg-white text-slate-600 border-slate-200"
              }`}>
              {v === "cycle" ? "Instruction Cycle" : "Decode Logic"}
            </button>
          ))}
        </div>

        {view === "cycle" ? (
          <div className="space-y-3 mb-5">
            {CYCLE_STATES.map((cs, i) => (
              <div key={i} onClick={() => setActiveState(i)}
                className={`rounded-xl border-2 p-4 cursor-pointer transition ${
                  activeState === i
                    ? "border-cyan-500 bg-cyan-50"
                    : "border-slate-200 bg-white hover:border-slate-300"
                }`}>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-bold text-slate-900">{cs.state}</h4>
                  <div className="flex gap-1">
                    {cs.active.map((comp, j) => (
                      <span key={j} className="px-2 py-0.5 bg-cyan-100 text-cyan-700 rounded text-[10px] font-bold">{comp}</span>
                    ))}
                  </div>
                </div>
                <p className="text-xs text-slate-500 font-mono">{cs.desc}</p>
              </div>
            ))}
          </div>
        ) : (
          <Diagram title="Instruction Decode Logic">
            <div className="flex flex-col items-center gap-3 w-full max-w-md">
              <div className="bg-gradient-to-br from-slate-800 to-slate-900 text-emerald-400 p-4 rounded-xl w-full font-mono text-center text-xs border border-slate-700">
                <p className="text-[10px] text-slate-500 mb-1">32-bit Instruction</p>
                <span className="text-emerald-400 font-bold">[31:26]</span> opcode |
                <span className="text-cyan-400 font-bold"> [25:21]</span> rs |
                <span className="text-amber-400 font-bold"> [20:16]</span> rt |
                <span className="text-violet-400 font-bold"> [15:11]</span> rd |
                <span className="text-slate-400"> [10:6]</span> shamt |
                <span className="text-rose-400 font-bold"> [5:0]</span> funct
              </div>
              <ChevronRight className="text-slate-300" size={20} />
              <div className="bg-gradient-to-br from-cyan-500 to-blue-600 text-white p-4 rounded-xl w-full text-center text-xs">
                <Cpu className="w-5 h-5 mx-auto mb-1" />
                <p className="font-bold mb-1">Control Unit</p>
                <p className="text-[10px] text-white/80">ROM / PLA decodes opcode + funct → control signals</p>
              </div>
              <ChevronRight className="text-slate-300" size={20} />
              <div className="grid grid-cols-4 gap-2 w-full">
                {["RegWrite", "ALUSrc", "MemRead", "MemWrite"].map((sig, i) => (
                  <div key={i} className="bg-emerald-50 border border-emerald-200 p-2 rounded-lg text-center">
                    <span className="text-[9px] font-bold text-emerald-700">{sig}</span>
                    <div className="w-4 h-4 mx-auto mt-1 rounded border border-emerald-300 bg-white" />
                  </div>
                ))}
                {["MemtoReg", "RegDst", "Branch", "ALUOp"].map((sig, i) => (
                  <div key={i} className="bg-amber-50 border border-amber-200 p-2 rounded-lg text-center">
                    <span className="text-[9px] font-bold text-amber-700">{sig}</span>
                    <div className="w-4 h-4 mx-auto mt-1 rounded border border-amber-300 bg-white" />
                  </div>
                ))}
              </div>
            </div>
          </Diagram>
        )}
      </Section>

      <Section title="How the Control Unit Decodes Instructions">
        <div className="space-y-3 mb-5">
          {INSTRUCTION_FLOW.map((step, i) => (
            <div key={i} className="bg-white rounded-xl border border-slate-200 p-4 flex items-start gap-3 hover:border-cyan-200 transition">
              <span className="bg-cyan-600 text-white w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs shrink-0">{i + 1}</span>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-slate-900">{step.step}</h4>
                  <span className="text-[10px] text-slate-400 font-mono">{step.dur}</span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">{step.action}</p>
              </div>
            </div>
          ))}
        </div>

        <InfoCard title="R-type vs I-type Decoding" type="tip">
          R-type instructions use the funct field (bits [5:0]) to select ALU operation and rd as destination. I-type instructions encode the opcode (bits [31:26]) and use rt as destination with an immediate operand. The control unit sets RegDst=1 for R-type and RegDst=0 for I-type.
        </InfoCard>
      </Section>

      <Section title="Control Signal Generation Example">
        <CodeBlock code={`// Simplified control unit in Verilog
module control_unit (
    input  logic [5:0] opcode,
    input  logic [5:0] funct,
    output logic       reg_write, mem_read, mem_write,
    output logic       alu_src, mem_to_reg, reg_dst,
    output logic [1:0] alu_op,
    output logic       branch
);
    logic is_rtype = (opcode == 6'b000000);
    
    always_comb begin
        // Default values
        {reg_write, mem_read, mem_write} = 3'b000;
        {alu_src, mem_to_reg, reg_dst} = 3'b000;
        alu_op = 2'b00;
        branch = 1'b0;
        
        case (opcode)
            6'b000000: begin  // R-type (add, sub, and, or, slt, etc.)
                reg_write = 1'b1; reg_dst = 1'b1; alu_op = 2'b10;
                // funct field selects specific ALU operation
            end
            6'b100011: begin  // lw (load word)
                reg_write = 1'b1; mem_read = 1'b1;
                alu_src = 1'b1; mem_to_reg = 1'b1;
                alu_op = 2'b00;  // ADD for address calc
            end
            6'b101011: begin  // sw (store word)
                mem_write = 1'b1; alu_src = 1'b1;
                alu_op = 2'b00;  // ADD for address calc
            end
            6'b000100: begin  // beq (branch if equal)
                branch = 1'b1; alu_op = 2'b01;  // SUB for comparison
            end
        endcase
    end
endmodule`} language="verilog" />
      </Section>

      <Section title="Micro-operations (Micro-ops)">
        <InfoCard title="Micro-ops Decomposition" type="info">
          Each machine instruction is broken into multiple micro-operations (micro-ops). For example, an ADD instruction decomposes into: fetch, decode, register read, ALU operation, write back. Microprogrammed control stores these sequences in control store ROM.
        </InfoCard>
        <div className="overflow-x-auto mb-5">
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100">
                <th className="p-3 text-left font-bold text-slate-700 border border-slate-200">Instruction</th>
                <th className="p-3 text-left font-bold text-slate-700 border border-slate-200">Micro-op Sequence</th>
                <th className="p-3 text-left font-bold text-slate-700 border border-slate-200">Active Components</th>
              </tr>
            </thead>
            <tbody>
              {[
                { instr: "ADD R1, R2, R3", uops: "Fetch → Decode → Read RF → ALU → Write RF", comps: "PC, MEM, IR, RegFile, ALU" },
                { instr: "LW R1, 0(R2)", uops: "Fetch → Decode → Read RF → Addr Calc → MEM → Write RF", comps: "PC, MEM, IR, RegFile, ALU" },
                { instr: "BEQ R1, R2, L", uops: "Fetch → Decode → Read RF → SUB → Branch Check", comps: "PC, MEM, IR, RegFile, ALU" },
                { instr: "JAL R1, TARGET", uops: "Fetch → Decode → PC+4 → Write RF → PC ← Target", comps: "PC, MEM, IR, RegFile, ALU" },
              ].map((row, i) => (
                <tr key={i} className="bg-white hover:bg-slate-50">
                  <td className="p-3 border border-slate-200 font-mono font-bold text-slate-900">{row.instr}</td>
                  <td className="p-3 border border-slate-200 text-slate-500 text-[10px]">{row.uops}</td>
                  <td className="p-3 border border-slate-200 text-slate-400 text-[10px]">{row.comps}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Section title="Interview Questions">
        <InterviewQuestion question="Explain the difference between hardwired and microprogrammed control units."
          answer="Hardwired control uses combinational logic gates (PLA, ROM, or random logic) to generate control signals directly from the instruction opcode. It is fast but inflexible. Microprogrammed control stores micro-instructions in a control store ROM. Each machine instruction is implemented as a sequence of micro-instructions. It is slower (ROM access time) but easier to design, modify, and extend — ideal for CISC ISAs with complex instructions." />
        <InterviewQuestion question="How does a control unit decode an R-type vs an I-type instruction?"
          answer="For R-type instructions (opcode = 0 in MIPS), the control unit uses the funct field (bits 5:0) to determine the specific ALU operation. RegDst=1 selects rd as the destination register. For I-type instructions, the opcode directly encodes the operation. ALUSrc=1 selects the sign-extended immediate as the second ALU operand. MemRead/MemWrite are asserted for load/store instructions. Branch is asserted for branch instructions to modify PC." />
        <InterviewQuestion question="What is the role of the FSM in control unit design?"
          answer="The control unit FSM manages the instruction cycle through discrete states (Fetch, Decode, Execute, Memory, WriteBack). Each state maps to a clock cycle. The current state and the instruction opcode determine the next state and the control signals output. The FSM ensures proper sequencing: for example, a LOAD instruction goes through Fetch → Decode → AddrCalc → Memory → WriteBack, while an ADD skips the Memory state." />
        <InterviewQuestion question="How does a control unit handle branching and how does it affect the pipeline?"
          answer="The control unit detects branch instructions in the Decode stage. It asserts the Branch signal, which causes the ALU to compare source registers. The zero output from the ALU, combined with the Branch signal, selects the next PC (branch target vs PC+4). In pipelined processors, branches cause control hazards. Modern CUs use branch prediction, branch target buffers (BTB), and delayed branch slots to mitigate these penalties." />
      </Section>
    </div>
  );
}
