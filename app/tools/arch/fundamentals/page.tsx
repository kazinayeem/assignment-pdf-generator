"use client";

import Link from "next/link";
import { Home, ChevronRight } from "lucide-react";
import { Section, InfoCard, CodeBlock, Diagram, InterviewQuestion, AnimatedFlow } from "../components";

const ARCH_COMPONENTS = [
  { title: "Hardware Organization", desc: "Physical layout and interconnection of components" },
  { title: "Instruction Set", desc: "Set of commands CPU can execute" },
  { title: "Memory System", desc: "How memory is organized and accessed" },
  { title: "I/O System", desc: "How CPU communicates with peripherals" },
];

const VON_NEUMANN_PARTS = [
  { name: "CPU", desc: "Executes instructions" },
  { name: "Memory", desc: "Stores data & instructions" },
  { name: "I/O", desc: "Input/Output devices" },
  { name: "Bus", desc: "Connects components" },
];

const ARCH_COMPARISON = [
  { title: "Von Neumann", pros: ["Simple design", "Less hardware"], cons: ["Memory bottleneck", "Slower"] },
  { title: "Harvard", pros: ["Parallel access", "Faster", "Better cache"], cons: ["More complex", "More expensive"] },
];

const CYCLE_STEPS = [
  { step: "1. Fetch", desc: "PC (Program Counter) holds address of next instruction. Instruction is fetched from memory into IR (Instruction Register)." },
  { step: "2. Decode", desc: "Control Unit decodes the instruction and generates control signals. Operands are identified and fetched if needed." },
  { step: "3. Execute", desc: "ALU performs the operation specified by the instruction. This might be arithmetic, logic, or data movement." },
  { step: "4. Memory Access", desc: "If needed, data is read from or written to memory. Not all instructions need this step." },
  { step: "5. Write Back", desc: "Result is written back to a register or memory. PC is incremented to point to the next instruction." },
];

const INTERVIEW_QS = [
  { q: "What is the difference between Von Neumann and Harvard Architecture?", a: "Von Neumann uses a single memory for both instructions and data with one bus, causing the Von Neumann bottleneck. Harvard uses separate memories and buses for instructions and data, allowing simultaneous access but requiring more hardware." },
  { q: "Explain the Fetch-Execute cycle in detail.", a: "The CPU repeatedly: 1) Fetches instruction from memory address in PC, 2) Decodes it in control unit, 3) Executes using ALU, 4) Accesses memory if needed, 5) Writes back results and increments PC." },
  { q: "What is the Von Neumann bottleneck?", a: "The single bus connecting CPU and memory in Von Neumann architecture can only transfer either an instruction or data at a time, not both. This limits throughput, known as the Von Neumann bottleneck." },
];

export default function FundamentalsPage() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 mb-6 text-xs text-slate-500">
        <Link href="/tools/arch" className="text-cyan-600 no-underline flex items-center gap-1.5 hover:text-cyan-800 transition">
          <Home size={16} /> Architecture
        </Link>
        <ChevronRight size={16} />
        <span className="text-slate-900 font-semibold">Fundamentals</span>
      </div>

      {/* Header */}
      <div className="mb-10">
        <h1 className="text-4xl font-extrabold text-slate-900 mb-3">📚 Computer Architecture Fundamentals</h1>
        <p className="text-base text-slate-500 leading-relaxed max-w-xl">
          Understand the basic principles of how computers work: Von Neumann architecture, Harvard architecture, and the fundamental components that make up a computer system.
        </p>
      </div>

      {/* What is Computer Architecture? */}
      <Section title="What is Computer Architecture?">
        <InfoCard title="Definition" type="info">
          Computer Architecture refers to the design and organization of computer systems. It defines the structure, behavior, and interaction of components within a computer. Architecture is about HOW the computer works at a fundamental level.
        </InfoCard>

        <div className="grid sm:grid-cols-2 gap-4 mb-5">
          {ARCH_COMPONENTS.map((item, i) => (
            <div key={i} className="bg-cyan-50 rounded-xl border border-cyan-200 p-4">
              <h4 className="text-sm font-bold text-cyan-700 mb-1.5">{item.title}</h4>
              <p className="text-xs text-slate-500">{item.desc}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Von Neumann Architecture */}
      <Section title="Von Neumann Architecture">
        <InfoCard title="Key Concept" type="tip">
          Proposed by John von Neumann in 1945. Most computers today follow this model: a single memory stores both instructions and data, and the CPU fetches, decodes, and executes instructions one at a time.
        </InfoCard>

        <Diagram title="Von Neumann Architecture Components">
          <div className="grid grid-cols-2 gap-5 w-full max-w-md">
            {VON_NEUMANN_PARTS.map((comp, i) => (
              <div key={i} className="bg-gradient-to-br from-cyan-50 to-white border-2 border-cyan-500 rounded-xl p-4 text-center">
                <h4 className="text-sm font-bold text-cyan-700 mb-1.5">{comp.name}</h4>
                <p className="text-xs text-slate-500">{comp.desc}</p>
              </div>
            ))}
          </div>
        </Diagram>

        <InfoCard title="Von Neumann Bottleneck" type="warning">
          The single bus connecting CPU and memory limits performance. Both instructions and data must pass through the same bus, creating a bottleneck that restricts data flow rate.
        </InfoCard>
      </Section>

      {/* Harvard Architecture */}
      <Section title="Harvard Architecture">
        <InfoCard title="Key Difference" type="info">
          Separate memory and bus for instructions and data. Allows simultaneous access to both, eliminating the Von Neumann bottleneck. Widely used in DSPs and embedded systems.
        </InfoCard>

        <div className="grid sm:grid-cols-2 gap-4">
          {ARCH_COMPARISON.map((arch, i) => (
            <div key={i} className="bg-white rounded-xl border border-slate-200 p-4">
              <h4 className="text-sm font-bold text-slate-900 mb-3">{arch.title}</h4>
              <div>
                <p className="text-xs font-semibold text-emerald-600 mb-2">Advantages:</p>
                <ul className="text-xs text-slate-500 mb-3 space-y-1">
                  {arch.pros.map((pro, j) => <li key={j}>✓ {pro}</li>)}
                </ul>
                <p className="text-xs font-semibold text-pink-600 mb-2">Limitations:</p>
                <ul className="text-xs text-slate-500 space-y-1">
                  {arch.cons.map((con, j) => <li key={j}>✗ {con}</li>)}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* CPU Execution Cycle */}
      <Section title="CPU Execution Cycle (Fetch-Execute Cycle)">
        <AnimatedFlow steps={[
          { label: "Fetch", desc: "Get instruction from memory" },
          { label: "Decode", desc: "Interpret instruction" },
          { label: "Execute", desc: "Perform operation" },
          { label: "Memory", desc: "Access memory if needed" },
          { label: "Write", desc: "Store results" },
        ]} />

        <div className="flex flex-col gap-3">
          {CYCLE_STEPS.map((item, i) => (
            <div key={i} className="bg-white rounded-xl border border-slate-200 p-3.5 flex gap-3">
              <span className="bg-cyan-600 text-white w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs shrink-0">
                {i + 1}
              </span>
              <div>
                <strong className="text-sm text-slate-900">{item.step}</strong>
                <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Code Example */}
      <Section title="Simple CPU Simulator (Python)">
        <CodeBlock code={`class CPU:
    def __init__(self):
        self.registers = [0] * 32
        self.pc = 0
        self.memory = [0] * 4096

    def fetch(self):
        instruction = self.memory[self.pc]
        self.pc += 1
        return instruction

    def execute(self, instruction):
        opcode = (instruction >> 24) & 0xFF
        rd = (instruction >> 16) & 0x1F
        rs = (instruction >> 8) & 0x1F
        imm = instruction & 0xFF
        
        if opcode == 0:  # ADD
            self.registers[rd] = self.registers[rs] + imm
        elif opcode == 1:  # LOAD
            self.registers[rd] = self.memory[imm]
        elif opcode == 2:  # STORE
            self.memory[imm] = self.registers[rs]`} language="python" />
      </Section>

      {/* Interview Questions */}
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
