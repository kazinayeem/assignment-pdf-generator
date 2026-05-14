"use client";

import { useState } from "react";
import Link from "next/link";
import { Home, ChevronRight, Cpu, Play, StepForward, RefreshCw } from "lucide-react";
import { Section, InfoCard, CodeBlock, Diagram, InterviewQuestion, AnimatedFlow } from "../components";

const CYCLE_STATES = [
  { state: "IF (Instruction Fetch)", desc: "PC sends address to MAR → memory read → instruction → MDR → IR. PC incremented by 4.", icon: "1" },
  { state: "ID (Instruction Decode)", desc: "Control unit decodes opcode and funct fields. Register file reads rs and rt. Sign-extends immediate if needed.", icon: "2" },
  { state: "EX (Execute)", desc: "ALU performs operation: arithmetic, logical, address calculation, or branch target computation. Condition flags set.", icon: "3" },
  { state: "MEM (Memory Access)", desc: "For loads: MAR ← address, memory read → MDR. For stores: MAR ← address, MDR ← data, memory write. Skip for ALU ops.", icon: "4" },
  { state: "WB (Write Back)", desc: "Result written to register file (rd for R-type, rt for I-type). For loads: MDR → register. PC updated (or loaded from branch target).", icon: "5" },
];

const INSTRUCTIONS = [
  { name: "ADD $1, $2, $3", steps: ["IF: Fetch from PC=0x1000", "ID: Decode R-type, read $2=10, $3=20", "EX: ALU computes 10+20=30", "MEM: No memory access", "WB: $1 ← 30, PC ← 0x1004"] },
  { name: "LW $1, 100($2)", steps: ["IF: Fetch from PC=0x1004", "ID: Decode I-type, read $2=0x2000, sign-extend 100", "EX: ALU computes addr = 0x2000+100 = 0x2064", "MEM: Read Mem[0x2064] → MDR", "WB: $1 ← MDR, PC ← 0x1008"] },
  { name: "BEQ $1, $2, loop", steps: ["IF: Fetch from PC=0x1008", "ID: Decode, read $1=5, $2=5", "EX: ALU subtracts, Z flag set (5-5=0)", "MEM: No memory access", "WB: PC ← PC+4+(offset×4) if Z=1"] },
  { name: "SW $1, 0($2)", steps: ["IF: Fetch from PC=0x100C", "ID: Decode, read $1=42, $2=0x3000", "EX: ALU computes addr = 0x3000+0 = 0x3000", "MEM: Write $1=42 → Mem[0x3000]", "WB: PC ← 0x1010"] },
];

const ADDR_IMPACT = [
  { mode: "Immediate", addCycles: "0", desc: "Operand is in instruction register; no extra access" },
  { mode: "Register", addCycles: "0", desc: "Operand in register file; accessed during ID" },
  { mode: "Register Indirect", addCycles: "1", desc: "Need memory access to get operand after address calculation" },
  { mode: "Indirect", addCycles: "2", desc: "Memory access to get address, then another to get operand" },
  { mode: "Indexed", addCycles: "1", desc: "Base + index calculation in EX, then memory access in MEM" },
];

const INTERVIEW_QS = [
  { q: "Explain the Fetch-Decode-Execute cycle in detail.", a: "The instruction cycle has 5 stages: 1) IF: Instruction is fetched from memory address in PC into IR, PC increments. 2) ID: Control unit decodes the opcode, reads registers from register file. 3) EX: ALU performs the operation. 4) MEM: Data memory accessed for loads/stores. 5) WB: Results written back to register file. Each stage takes one clock cycle in a standard 5-stage pipeline." },
  { q: "How does the addressing mode affect the instruction execution cycle?", a: "The addressing mode determines what happens in the EX and MEM stages. Immediate mode skips MEM (operand in instruction). Register mode skips MEM. Register indirect needs address calculation in EX + memory access in MEM. Indirect needs two memory accesses (one for address, one for operand). More complex modes add extra cycles or pipeline stages." },
  { q: "What happens in the CPU during each clock cycle of instruction execution?", a: "In single-cycle implementations, one instruction completes per cycle but the cycle time is long (worst-case path). In multi-cycle, each state (T1-T6) takes one cycle: T1: MAR←PC, memory read. T2: MDR→IR. T3: decode, increment PC. T4: ALU execute. T5: memory access if needed. T6: write back. Multi-cycle allows different instructions to take different numbers of cycles." },
  { q: "How do modern CPUs execute instructions out of order?", a: "Out-of-order execution decodes instructions into μops, places them in a reorder buffer (ROB), and dispatches them to functional units when operands are ready (register renaming avoids false dependencies). Results are written to the ROB and committed in program order to maintain precise exceptions. This extracts ILP beyond what in-order execution can achieve." },
];

export default function InstructionExecutionPage() {
  const [cycleStep, setCycleStep] = useState(0);
  const [instrIndex, setInstrIndex] = useState(0);
  const [running, setRunning] = useState(false);
  const [highlightStage, setHighlightStage] = useState<number | null>(null);

  const runCycle = () => {
    const total = CYCLE_STATES.length;
    if (cycleStep < total - 1) {
      setCycleStep(cycleStep + 1);
    } else {
      setCycleStep(0);
      setInstrIndex((instrIndex + 1) % INSTRUCTIONS.length);
    }
  };

  const startAuto = () => {
    if (running) { setRunning(false); return; }
    setRunning(true);
    const interval = setInterval(() => {
      setCycleStep((prev) => {
        if (prev >= CYCLE_STATES.length - 1) {
          setInstrIndex((i) => (i + 1) % INSTRUCTIONS.length);
          return 0;
        }
        return prev + 1;
      });
    }, 1200);
    const timeout = setTimeout(() => { setRunning(false); clearInterval(interval); }, 30000);
    return () => { clearInterval(interval); clearTimeout(timeout); };
  };

  const resetSim = () => {
    setCycleStep(0);
    setInstrIndex(0);
    setRunning(false);
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      <div className="flex items-center gap-2 mb-6 text-xs text-slate-500">
        <Link href="/tools/arch" className="text-cyan-600 no-underline flex items-center gap-1.5 hover:text-cyan-800 transition">
          <Home size={16} /> Architecture
        </Link>
        <ChevronRight size={16} />
        <span className="text-slate-900 font-semibold">Instruction Execution</span>
      </div>

      <div className="mb-10">
        <h1 className="text-4xl font-extrabold text-slate-900 mb-3">⏱️ Instruction Execution</h1>
        <p className="text-base text-slate-500 leading-relaxed max-w-xl">
          How the CPU fetches, decodes, and executes instructions step by step through the instruction cycle.
        </p>
      </div>

      <Section title="The Instruction Cycle">
        <InfoCard title="Fundamental CPU Operation" type="info">
          The instruction cycle (or fetch-execute cycle) is the basic operation of a CPU. Each instruction goes through a sequence of states, from being fetched from memory to having its results written back. Modern pipelined CPUs overlap these states across multiple instructions.
        </InfoCard>
        <AnimatedFlow steps={CYCLE_STATES.map((s) => ({ label: s.state.split(" ")[0], desc: s.state.split(" ")[1]?.replace(/[()]/g, "") || s.state }))} />
      </Section>

      <Section title="Cycle States in Detail">
        <div className="flex flex-col gap-3 mb-5">
          {CYCLE_STATES.map((state, i) => (
            <div
              key={i}
              onMouseEnter={() => setHighlightStage(i)}
              onMouseLeave={() => setHighlightStage(null)}
              className={`bg-white rounded-xl border p-3.5 flex gap-3 transition-all cursor-pointer ${
                highlightStage === i ? "border-cyan-500 ring-2 ring-cyan-200 shadow-lg" : "border-slate-200"
              }`}
            >
              <span className="bg-cyan-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0">
                {state.icon}
              </span>
              <div>
                <strong className="text-sm text-slate-900">{state.state}</strong>
                <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{state.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Interactive CPU Simulator">
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl p-5 mb-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Cpu className="w-5 h-5 text-cyan-400" />
              <span className="text-white text-sm font-bold">CPU Simulator</span>
            </div>
            <div className="flex gap-2">
              <button onClick={runCycle} className="bg-cyan-600 hover:bg-cyan-500 text-white px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition cursor-pointer">
                <StepForward size={14} /> Step
              </button>
              <button onClick={startAuto} className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition cursor-pointer ${running ? "bg-red-600 hover:bg-red-500 text-white" : "bg-emerald-600 hover:bg-emerald-500 text-white"}`}>
                {running ? <RefreshCw size={14} /> : <Play size={14} />} {running ? "Stop" : "Auto"}
              </button>
              <button onClick={resetSim} className="bg-slate-600 hover:bg-slate-500 text-white px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition cursor-pointer">
                <RefreshCw size={14} /> Reset
              </button>
            </div>
          </div>

          <div className="bg-slate-950 rounded-lg p-4 mb-4">
            <div className="text-xs font-mono text-cyan-400 mb-2">; Current Instruction: {INSTRUCTIONS[instrIndex].name}</div>
            <div className="text-xs font-mono text-slate-400 mb-2">; Cycle: {cycleStep + 1}/{CYCLE_STATES.length} — {CYCLE_STATES[cycleStep].state}</div>
            <div className="text-xs font-mono text-emerald-400">
              {INSTRUCTIONS[instrIndex].steps.map((step, i) => (
                <div key={i} className={`py-0.5 ${i === cycleStep ? "text-emerald-300 font-bold" : i < cycleStep ? "text-slate-500" : "text-slate-600"}`}>
                  {i === cycleStep && <span className="text-emerald-400 mr-1">▶</span>} {step}
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 justify-center flex-wrap">
            {CYCLE_STATES.map((s, i) => (
              <div key={i} className={`px-3 py-1 text-xs rounded-lg font-semibold transition-all ${
                i === cycleStep ? "bg-cyan-600 text-white shadow-md scale-110" : i < cycleStep ? "bg-slate-700 text-slate-400" : "bg-slate-700 text-slate-500"
              }`}>
                {s.state.split(" ")[0]}
              </div>
            ))}
          </div>
        </div>
      </Section>

      <Section title="Addressing Mode Impact on Execution">
        <div className="overflow-x-auto mb-5">
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100">
                <th className="text-left p-3 font-bold text-slate-700 border-b border-slate-200">Addressing Mode</th>
                <th className="text-left p-3 font-bold text-slate-700 border-b border-slate-200">Extra Cycles</th>
                <th className="text-left p-3 font-bold text-slate-700 border-b border-slate-200">Explanation</th>
              </tr>
            </thead>
            <tbody>
              {ADDR_IMPACT.map((row, i) => (
                <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-slate-50"}>
                  <td className="p-3 font-medium text-slate-700 border-b border-slate-100">{row.mode}</td>
                  <td className="p-3 text-slate-500 border-b border-slate-100">{row.addCycles}</td>
                  <td className="p-3 text-slate-500 border-b border-slate-100">{row.desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Section title="Multiple Bus Architecture">
        <Diagram title="CPU Internal Buses for Execution">
          <div className="flex flex-col items-center gap-3 w-full max-w-md">
            <div className="bg-slate-800 text-white rounded-xl p-3 text-xs font-bold text-center w-full">Register File (32 × 32-bit)</div>
            <div className="flex gap-3 text-[10px]">
              <div className="bg-blue-500 text-white px-3 py-1 rounded">Bus A (rs)</div>
              <div className="bg-blue-600 text-white px-3 py-1 rounded">Bus B (rt)</div>
              <div className="bg-blue-400 text-white px-3 py-1 rounded">Bus C (rd)</div>
            </div>
            <div className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl p-3 text-xs font-bold text-center w-full">ALU</div>
            <div className="flex gap-3 text-[10px]">
              <div className="bg-emerald-500 text-white px-3 py-1 rounded">Data Bus</div>
              <div className="bg-emerald-600 text-white px-3 py-1 rounded">Address Bus</div>
            </div>
            <div className="bg-slate-800 text-white rounded-xl p-3 text-xs font-bold text-center w-full">Data Memory</div>
          </div>
        </Diagram>
        <p className="text-xs text-slate-500 leading-relaxed mb-3">
          During a single cycle, the register file reads rs onto Bus A and rt onto Bus B simultaneously. The ALU computes the result while the next instruction is being fetched over the instruction bus. This parallelism is key to single-cycle-per-instruction execution in RISC designs.
        </p>
      </Section>

      <Section title="CPU Simulator (C Code)">
        <CodeBlock code={`#include <stdint.h>

typedef struct {
    uint32_t regs[32];
    uint32_t pc;
    uint32_t memory[4096];
    uint32_t ir;   // instruction register
    uint32_t mar;  // memory address register
    uint32_t mdr;  // memory data register
} CPU;

void fetch(CPU *cpu) {
    cpu->mar = cpu->pc;                    // address out
    cpu->mdr = cpu->memory[cpu->mar >> 2]; // memory read
    cpu->ir  = cpu->mdr;                   // load IR
    cpu->pc += 4;                          // increment PC
}

void execute(CPU *cpu) {
    uint8_t opcode = (cpu->ir >> 26) & 0x3F;
    uint8_t rs     = (cpu->ir >> 21) & 0x1F;
    uint8_t rt     = (cpu->ir >> 16) & 0x1F;
    uint8_t rd     = (cpu->ir >> 11) & 0x1F;
    uint8_t funct  = cpu->ir & 0x3F;
    int16_t imm    = (int16_t)(cpu->ir & 0xFFFF);
    
    if (opcode == 0) { // R-type
        switch (funct) {
            case 0x20: cpu->regs[rd] = cpu->regs[rs] + cpu->regs[rt]; break;
            case 0x22: cpu->regs[rd] = cpu->regs[rs] - cpu->regs[rt]; break;
            case 0x24: cpu->regs[rd] = cpu->regs[rs] & cpu->regs[rt]; break;
            case 0x25: cpu->regs[rd] = cpu->regs[rs] | cpu->regs[rt]; break;
        }
    } else if (opcode == 0x23) { // LW
        uint32_t addr = cpu->regs[rs] + imm;
        cpu->regs[rt] = cpu->memory[addr >> 2];
    }
}

void run(CPU *cpu) {
    while (cpu->pc < sizeof(cpu->memory)) {
        fetch(cpu);
        execute(cpu);
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
