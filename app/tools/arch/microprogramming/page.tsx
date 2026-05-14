"use client";

import { useState } from "react";
import Link from "next/link";
import { Home, ChevronRight, Cpu, Binary, BookOpen, GitBranch, Layers, Zap, CircuitBoard, Database } from "lucide-react";
import { Section, InfoCard, CodeBlock, InterviewQuestion, Diagram } from "../components";

const MICRO_OPS = [
  { micro: "MAR ← PC", desc: "Load memory address register with program counter", encoded: "0001", active: "PC, MAR" },
  { micro: "MDR ← MEM[MAR]", desc: "Read memory at address in MAR into MDR", encoded: "0010", active: "MEM, MDR" },
  { micro: "IR ← MDR", desc: "Transfer MDR to instruction register", encoded: "0011", active: "MDR, IR" },
  { micro: "PC ← PC + 4", desc: "Increment program counter by 4 (word size)", encoded: "0100", active: "PC, ALU" },
  { micro: "A ← Reg[rs]", desc: "Read register rs into A latch", encoded: "0101", active: "RegFile" },
  { micro: "B ← Reg[rt]", desc: "Read register rt into B latch", encoded: "0110", active: "RegFile" },
  { micro: "ALUOut ← A op B", desc: "Perform ALU operation, store result", encoded: "0111", active: "ALU" },
  { micro: "Reg[rd] ← ALUOut", desc: "Write ALU result to destination register", encoded: "1000", active: "RegFile" },
];

const HORIZONTAL_VERTICAL = [
  { type: "Horizontal", width: "Wide (up to 256+ bits)", encoding: "One bit per control signal (direct)", speed: "Fast (no decoding delay)", flexibility: "Low (hard to modify width)", romSize: "Large", usage: "RISC, high-performance" },
  { type: "Vertical", width: "Narrow (16-64 bits)", encoding: "Encoded fields (requires decoder)", speed: "Slower (decoding overhead)", flexibility: "High (compact, easy to extend)", romSize: "Small", usage: "CISC, embedded" },
];

export default function MicroprogrammingPage() {
  const [activeSeq, setActiveSeq] = useState(0);
  const [selectedMicro, setSelectedMicro] = useState<number | null>(null);
  const [showVertical, setShowVertical] = useState(false);

  const SEQUENCER_STEPS = [
    { label: "Fetch μ-instruction", desc: "Control store ROM outputs micro-instruction at address in μPC", icon: Database },
    { label: "Execute μ-instruction", desc: "Control signals are driven to CPU components (ALU, RegFile, Memory)", icon: Cpu },
    { label: "Determine Next Address", desc: "μPC updated: increment, branch, or jump based on opcode/status flags", icon: GitBranch },
  ];

  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      <div className="flex items-center gap-2 mb-6 text-xs text-slate-500">
        <Link href="/tools/arch" className="text-cyan-600 no-underline flex items-center gap-1.5 hover:text-cyan-800 transition">
          <Home size={16} /> Architecture
        </Link>
        <ChevronRight size={16} />
        <span className="text-slate-900 font-semibold">Microprogramming</span>
      </div>

      <div className="mb-10">
        <h1 className="text-4xl font-extrabold text-slate-900 mb-3">🧬 Microprogramming</h1>
        <p className="text-base text-slate-500 leading-relaxed max-w-xl">
          Microprogramming is a technique for implementing the control unit of a CPU using micro-instructions stored in control store ROM. Each machine instruction is executed as a sequence of micro-operations.
        </p>
      </div>

      <Section title="What is Microprogramming?">
        <InfoCard title="Definition" type="info">
          Coined by Maurice Wilkes in 1951, microprogramming implements the control unit by storing control signals as words in a read-only memory (control store). Each micro-instruction specifies a set of control signals to be activated in one clock cycle. A sequence of micro-instructions implements each machine-level instruction.
        </InfoCard>
        <div className="grid sm:grid-cols-3 gap-4 mb-5">
          <div className="bg-cyan-50 rounded-xl border border-cyan-200 p-4">
            <h4 className="text-sm font-bold text-cyan-700 mb-1.5 flex items-center gap-1.5"><Database size={14} /> Control Store ROM</h4>
            <p className="text-xs text-slate-500">Contains all micro-instructions. Addressed by the micro-program counter (μPC). Typically read-only in production.</p>
          </div>
          <div className="bg-emerald-50 rounded-xl border border-emerald-200 p-4">
            <h4 className="text-sm font-bold text-emerald-700 mb-1.5 flex items-center gap-1.5"><Binary size={14} /> Micro-Instruction</h4>
            <p className="text-xs text-slate-500">A word in control store. Bits directly map to control signals (horizontal) or encoded fields (vertical).</p>
          </div>
          <div className="bg-violet-50 rounded-xl border border-violet-200 p-4">
            <h4 className="text-sm font-bold text-violet-700 mb-1.5 flex items-center gap-1.5"><GitBranch size={14} /> Micro-Program Sequencer</h4>
            <p className="text-xs text-slate-500">Determines the next micro-instruction address: increment, branch on opcode, or jump to a subroutine.</p>
          </div>
        </div>
      </Section>

      <Section title="Microprogrammed Control Unit Architecture">
        <Diagram title="Microprogrammed Control Unit Block Diagram">
          <div className="flex flex-col items-center gap-3 w-full max-w-md">
            <div className="flex items-center gap-3 w-full">
              <div className="flex-1 bg-gradient-to-br from-slate-800 to-slate-900 text-white p-4 rounded-xl text-center border border-slate-700">
                <h4 className="text-[10px] font-bold text-slate-400 mb-1">Memory</h4>
                <p className="text-xs font-mono text-emerald-400">Instruction</p>
              </div>
              <ChevronRight size={16} className="text-slate-300 shrink-0" />
              <div className="flex-1 bg-gradient-to-br from-violet-500 to-purple-600 text-white p-4 rounded-xl text-center">
                <h4 className="text-[10px] font-bold text-white/80 mb-1">IR</h4>
                <p className="text-xs font-mono">Opcode → μ-addr</p>
              </div>
            </div>
            <ChevronRight size={16} className="text-slate-300" />
            <div className="bg-gradient-to-br from-cyan-500 to-blue-600 text-white p-4 rounded-xl w-full text-center shadow-md">
              <h4 className="text-[10px] font-bold text-white/80 mb-1">Control Store ROM</h4>
              <p className="text-xs font-mono">Micro-instructions [0 .. 2^k - 1]</p>
              <div className="flex gap-1 justify-center mt-2">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="w-6 h-5 bg-white/20 rounded text-[8px] font-mono flex items-center justify-center">{i}</div>
                ))}
              </div>
            </div>
            <ChevronRight size={16} className="text-slate-300" />
            <div className="grid grid-cols-3 gap-2 w-full">
              {["RegWrite", "ALUSrc", "MemRead", "MemWrite", "Branch", "ALUOp"].map((sig, i) => (
                <div key={i} className="bg-emerald-50 border border-emerald-200 px-2 py-1.5 rounded text-center">
                  <span className="text-[8px] font-bold text-emerald-700">{sig}</span>
                </div>
              ))}
            </div>
          </div>
        </Diagram>

        <InfoCard title="How It Works" type="tip">
          When an instruction is fetched and loaded into the IR, the opcode bits are used as an index into the control store (or a mapping ROM) to find the starting address of the corresponding microprogram. The sequencer then executes micro-instructions sequentially until the instruction is complete.
        </InfoCard>
      </Section>

      <Section title="Micro-operations (Micro-instructions)">
        <InfoCard title="Micro-operation Details" type="info">
          Each micro-operation is a minimal CPU operation that can be performed in a single clock cycle. For example, the instruction ADD R1, R2, R3 decomposes into: fetch instruction → decode → read R2 → read R3 → ALU add → write R1.
        </InfoCard>
        <div className="overflow-x-auto mb-5">
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100">
                <th className="p-3 text-left font-bold text-slate-700 border border-slate-200">Micro-operation</th>
                <th className="p-3 text-left font-bold text-slate-700 border border-slate-200">Description</th>
                <th className="p-3 text-left font-bold text-slate-700 border border-slate-200">Encoding</th>
                <th className="p-3 text-left font-bold text-slate-700 border border-slate-200">Active Components</th>
              </tr>
            </thead>
            <tbody>
              {MICRO_OPS.map((uop, i) => (
                <tr key={i} onClick={() => setSelectedMicro(selectedMicro === i ? null : i)}
                  className={`cursor-pointer transition ${
                    selectedMicro === i ? "bg-cyan-50" : "bg-white hover:bg-slate-50"
                  }`}>
                  <td className="p-3 border border-slate-200 font-mono font-bold text-slate-900">{uop.micro}</td>
                  <td className="p-3 border border-slate-200 text-slate-500">{uop.desc}</td>
                  <td className="p-3 border border-slate-200 font-mono text-cyan-600 font-bold">{uop.encoded}</td>
                  <td className="p-3 border border-slate-200 text-slate-400 font-mono text-[10px]">{uop.active}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {selectedMicro !== null && (
          <div className="bg-cyan-50 border border-cyan-200 rounded-xl p-4 mb-5">
            <p className="text-xs text-slate-600">
              <strong>Active micro-operation:</strong> {MICRO_OPS[selectedMicro].micro} — {MICRO_OPS[selectedMicro].desc}
            </p>
            <p className="text-xs text-slate-500 mt-1">Encoding: <span className="font-mono font-bold text-cyan-700">{MICRO_OPS[selectedMicro].encoded}</span></p>
          </div>
        )}
      </Section>

      <Section title="Horizontal vs Vertical Microprogramming">
        <div className="flex gap-3 mb-5">
          <button onClick={() => setShowVertical(false)}
            className={`flex-1 p-3 rounded-xl text-xs font-bold border transition cursor-pointer ${
              !showVertical ? "bg-cyan-600 text-white border-cyan-600" : "bg-white text-slate-600 border-slate-200"
            }`}>
            Horizontal
          </button>
          <button onClick={() => setShowVertical(true)}
            className={`flex-1 p-3 rounded-xl text-xs font-bold border transition cursor-pointer ${
              showVertical ? "bg-cyan-600 text-white border-cyan-600" : "bg-white text-slate-600 border-slate-200"
            }`}>
            Vertical
          </button>
        </div>

        <div className="overflow-x-auto mb-5">
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100">
                <th className="p-3 text-left font-bold text-slate-700 border border-slate-200">Property</th>
                <th className="p-3 text-left font-bold text-slate-700 border border-slate-200">Horizontal</th>
                <th className="p-3 text-left font-bold text-slate-700 border border-slate-200">Vertical</th>
              </tr>
            </thead>
            <tbody>
              {HORIZONTAL_VERTICAL[0] && Object.entries(HORIZONTAL_VERTICAL[0]).map(([key, val], i) => {
                if (key === "type") return null;
                const vVal = HORIZONTAL_VERTICAL[1][key as keyof typeof HORIZONTAL_VERTICAL[0]];
                const hl = !showVertical ? "bg-cyan-50 font-bold" : "";
                const vl = showVertical ? "bg-cyan-50 font-bold" : "";
                return (
                  <tr key={i}>
                    <td className="p-3 border border-slate-200 text-slate-700 font-semibold capitalize">{key.replace(/([A-Z])/g, " $1")}</td>
                    <td className={`p-3 border border-slate-200 text-slate-600 ${hl}`}>{val}</td>
                    <td className={`p-3 border border-slate-200 text-slate-600 ${vl}`}>{vVal}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {showVertical ? (
          <div className="bg-white rounded-xl border border-slate-200 p-4">
            <h4 className="text-xs font-bold text-slate-900 mb-2">Vertical Microinstruction Format</h4>
            <div className="flex gap-1 mb-3">
              <div className="bg-amber-100 border border-amber-300 px-2 py-1.5 rounded text-center text-[9px] font-mono text-amber-700 font-bold">Opcode (6b)</div>
              <div className="bg-cyan-100 border border-cyan-300 px-2 py-1.5 rounded text-center text-[9px] font-mono text-cyan-700 font-bold">Dest Reg (5b)</div>
              <div className="bg-emerald-100 border border-emerald-300 px-2 py-1.5 rounded text-center text-[9px] font-mono text-emerald-700 font-bold">Src1 Reg (5b)</div>
              <div className="bg-violet-100 border border-violet-300 px-2 py-1.5 rounded text-center text-[9px] font-mono text-violet-700 font-bold">Imm (16b)</div>
            </div>
            <p className="text-[10px] text-slate-500">Encoded fields require a decoder to expand into individual control signals. Saves space but adds decoding delay.</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-slate-200 p-4">
            <h4 className="text-xs font-bold text-slate-900 mb-2">Horizontal Microinstruction Format</h4>
            <div className="flex flex-wrap gap-1 mb-3">
              {["RegWr", "ALUSrc", "MemRd", "MemWr", "RegDst", "Mem2Reg", "Branch", "ALUOp[0]", "ALUOp[1]", "PCWr", "IRWr", "MARWr", "MDRRd", "MDRWr", "AEn", "BEn", "ALUCtrl[0]", "ALUCtrl[1]", "ALUCtrl[2]", "Shamt"].map((sig, i) => (
                <div key={i} className="bg-slate-100 border border-slate-200 px-1.5 py-1 rounded text-center text-[7px] font-mono text-slate-600">{sig}</div>
              ))}
            </div>
            <p className="text-[10px] text-slate-500">Each bit directly controls one signal. No decoding needed. Wide (20+ bits) but fast execution and maximum parallelism.</p>
          </div>
        )}
      </Section>

      <Section title="Microprogram Sequencer">
        <div className="flex gap-2 mb-5 flex-wrap">
          {SEQUENCER_STEPS.map((_, i) => (
            <button key={i} onClick={() => setActiveSeq(i)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition cursor-pointer ${
                activeSeq === i ? "bg-cyan-600 text-white border-cyan-600" : "bg-white text-slate-600 border-slate-200 hover:border-cyan-400"
              }`}>
              Step {i + 1}: {SEQUENCER_STEPS[i].label}
            </button>
          ))}
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-5 mb-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
              {(() => { const Icon = SEQUENCER_STEPS[activeSeq].icon; return <Icon className="w-5 h-5 text-white" />; })()}
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">{SEQUENCER_STEPS[activeSeq].label}</h4>
              <p className="text-xs text-slate-500">{SEQUENCER_STEPS[activeSeq].desc}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-[10px] text-slate-400">
            {SEQUENCER_STEPS.map((_, i) => (
              <div key={i} className={`w-2 h-2 rounded-full ${i === activeSeq ? "bg-cyan-500" : "bg-slate-200"}`} />
            ))}
            <span className="ml-2">Cycle {activeSeq + 1} of 3</span>
          </div>
        </div>
        <InfoCard title="Sequencer Control" type="tip">
          The sequencer supports three addressing modes: (1) <strong>Increment</strong> — μPC ← μPC + 1 for sequential execution, (2) <strong>Branch</strong> — μPC ← address from a branch field when condition flags match (3) <strong>Mapping</strong> — μPC ← mapping ROM[opcode] to jump to the start of the microprogram for the fetched instruction.
        </InfoCard>
      </Section>

      <Section title="Advantages Over Hardwired Control">
        <div className="grid sm:grid-cols-2 gap-4 mb-5">
          <div className="bg-white rounded-xl border border-slate-200 p-4">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-4 h-4 text-emerald-500" />
              <h4 className="text-sm font-bold text-slate-900">Flexibility</h4>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">Adding new instructions requires only updating the control store ROM. No hardware redesign needed. Ideal for evolving ISAs and complex instruction sets.</p>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-4">
            <div className="flex items-center gap-2 mb-2">
              <Layers className="w-4 h-4 text-emerald-500" />
              <h4 className="text-sm font-bold text-slate-900">Systematic Design</h4>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">Microprograms follow a structured sequence (fetch → decode → execute), making the control logic easier to design, verify, and document compared to ad-hoc hardwired logic.</p>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-4">
            <div className="flex items-center gap-2 mb-2">
              <CircuitBoard className="w-4 h-4 text-emerald-500" />
              <h4 className="text-sm font-bold text-slate-900">Error Correction</h4>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">Microcode bugs can be fixed by replacing the control store ROM (or patching in Writable Control Store, WCS). Hardwired control bugs require chip respin.</p>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-4">
            <div className="flex items-center gap-2 mb-2">
              <BookOpen className="w-4 h-4 text-emerald-500" />
              <h4 className="text-sm font-bold text-slate-900">Emulation</h4>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">A microprogrammed CPU can emulate different ISAs by loading different microcode. This was used in System/360 to run both commercial and scientific workloads.</p>
          </div>
        </div>
      </Section>

      <Section title="Microprogramming Example: ADD Instruction">
        <InfoCard title="ADD Instruction Microcode Sequence" type="info">
          Below is the complete microprogram for implementing a MIPS R-type ADD instruction. Each micro-instruction is one clock cycle.
        </InfoCard>
        <CodeBlock code={`// Microprogram for ADD Rd, Rs, Rt instruction
// Control Store Organization: 64 words × 32 bits

Address | Micro-instruction              | Control Signals Active
--------|-------------------------------|------------------------
0x00    | MAR ← PC                      | MARWrite = 1, PCOut = 1
0x01    | MDR ← MEM[MAR]                | MemRead = 1, MDRWrite = 1
0x02    | IR ← MDR                      | IRWrite = 1, MDROut = 1
0x03    | PC ← PC + 4                   | ALUSrcA = PC, ALUSrcB = 4, ALUOp = ADD, PCWrite = 1
0x04    | A ← Reg[IR[25:21]]            | RegRead = 1, AWrite = 1, RsAddr = IR[25:21]
0x05    | B ← Reg[IR[20:16]]            | RegRead = 1, BWrite = 1, RtAddr = IR[20:16]
0x06    | ALUOut ← A + B                | ALUSrcA = A, ALUSrcB = B, ALUOp = ADD, ALUOutWrite = 1
0x07    | Reg[IR[15:11]] ← ALUOut       | RegWrite = 1, RegDst = 1, MemtoReg = 0
0x08    | JUMP to 0x00 (fetch next)     | μPC = 0 (next instruction)

// Control Store Contents (hex):
// 0x00: 0x80000001  (MAR ← PC)
// 0x01: 0x40000002  (MDR ← MEM[MAR])
// 0x02: 0x20000004  (IR ← MDR)
// 0x03: 0x10000008  (PC ← PC + 4)
// 0x04: 0x08000010  (A ← Reg[rs])
// 0x05: 0x04000020  (B ← Reg[rt])
// 0x06: 0x02000040  (ALUOut ← A + B)
// 0x07: 0x01000080  (Reg[rd] ← ALUOut)
// 0x08: 0x00000000  (Jump to fetch)`} language="text" />
      </Section>

      <Section title="Microprogramming in Modern CPUs">
        <InfoCard title="Modern Hybrid Approach" type="warning">
          Modern CPUs (x86-64 from Intel/AMD) use a hybrid approach: hardwired front-end decodes CISC instructions into micro-ops (μops), which are then processed by a RISC-like execution engine. The microcode ROM provides control for complex instructions, while common instructions are hardwired for speed.
        </InfoCard>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="flex items-center gap-4 justify-center">
            <div className="text-center">
              <div className="bg-amber-100 border-2 border-amber-500 rounded-xl p-3 mb-1">
                <span className="text-[10px] font-bold text-amber-700">x86 Front-End</span>
              </div>
              <p className="text-[9px] text-slate-400">Decode</p>
            </div>
            <ChevronRight className="text-slate-300" size={20} />
            <div className="text-center">
              <div className="bg-cyan-100 border-2 border-cyan-500 rounded-xl p-3 mb-1">
                <span className="text-[10px] font-bold text-cyan-700">μop Sequencer</span>
              </div>
              <p className="text-[9px] text-slate-400">ROM + Hardwired</p>
            </div>
            <ChevronRight className="text-slate-300" size={20} />
            <div className="text-center">
              <div className="bg-emerald-100 border-2 border-emerald-500 rounded-xl p-3 mb-1">
                <span className="text-[10px] font-bold text-emerald-700">RISC Core</span>
              </div>
              <p className="text-[9px] text-slate-400">Out-of-order exec</p>
            </div>
          </div>
        </div>
      </Section>

      <Section title="Interview Questions">
        <InterviewQuestion question="Explain the difference between horizontal and vertical microprogramming."
          answer="Horizontal microprogramming uses a wide micro-instruction word where each bit directly controls a single control signal or component. It is fast (no decoding needed) but requires more ROM space. Vertical microprogramming uses encoded fields in the micro-instruction that must be decoded by additional hardware to produce control signals. It uses less ROM but introduces decoding delay. Horizontal allows maximum parallelism (multiple signals per cycle), while vertical produces more compact microcode." />
        <InterviewQuestion question="How does a microprogram sequencer work?"
          answer="The microprogram sequencer (μPC) determines the next micro-instruction address. In sequential mode, μPC is incremented. For branches, the sequencer examines condition flags (zero, carry, overflow) and conditionally loads a branch target address from the micro-instruction. When a new machine instruction is fetched, the opcode is mapped through a mapping ROM or PLA to the starting address of the corresponding microprogram. The sequencer also supports micro-subroutine calls and returns using a micro-stack." />
        <InterviewQuestion question="What are the advantages and disadvantages of microprogrammed control over hardwired control?"
          answer="Advantages: (1) Easier to design and verify — microprograms are systematic. (2) Flexible — new instructions added by updating control store. (3) Error correction through microcode patches. (4) Can emulate different ISAs. (5) Handles complex instructions efficiently. Disadvantages: (1) Slower — each micro-instruction requires a ROM access. (2) Larger area — control store ROM takes space. (3) Higher power consumption. (4) Not suitable for high-frequency RISC designs where hardwired logic is faster." />
        <InterviewQuestion question="What is the role of microprogramming in modern x86 processors?"
          answer="Modern x86 processors (Intel Core, AMD Ryzen) use a two-stage approach: the front-end decodes complex x86 CISC instructions into simpler RISC-like micro-operations (μops). Common instructions (like ADD, MOV) are hardwired for fast decode. Complex instructions (like string operations, system calls) use microcode ROM to produce sequences of μops. The μops are then executed on a RISC-style out-of-order execution engine. This hybrid approach combines the performance of hardwired control for common cases with the flexibility of microprogramming for complex instructions." />
      </Section>
    </div>
  );
}
