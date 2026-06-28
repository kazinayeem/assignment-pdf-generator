"use client";

import { useState } from "react";
import Link from "next/link";
import { Home, ChevronRight, Play, RotateCcw, Zap } from "lucide-react";
import { Section, InfoCard, CodeBlock, Diagram, InterviewQuestion, CPUStage, AnimatedFlow } from "../components";

const STAGES = ["IF", "ID", "EX", "MEM", "WB"];
const STAGE_DESC: Record<string, string> = {
  IF: "Fetch instruction from memory using PC",
  ID: "Decode instruction, read registers",
  EX: "Execute operation in ALU",
  MEM: "Access data memory (load/store)",
  WB: "Write result back to register",
};
const STAGE_COLORS: Record<string, string> = {
  IF: "bg-blue-500", ID: "bg-emerald-500", EX: "bg-amber-500",
  MEM: "bg-purple-500", WB: "bg-rose-500",
};
const STAGE_LIGHT: Record<string, string> = {
  IF: "bg-blue-50 border-blue-300 text-blue-700",
  ID: "bg-emerald-50 border-emerald-300 text-emerald-700",
  EX: "bg-amber-50 border-amber-300 text-amber-700",
  MEM: "bg-purple-50 border-purple-300 text-purple-700",
  WB: "bg-rose-50 border-rose-300 text-rose-700",
};

const INSTRUCTIONS = [
  { id: "I1", text: "ADD R1, R2, R3", desc: "R1 = R2 + R3" },
  { id: "I2", text: "SUB R4, R1, R5", desc: "R4 = R1 - R5" },
  { id: "I3", text: "LW R6, 0(R7)", desc: "R6 = Mem[R7 + 0]" },
  { id: "I4", text: "AND R8, R9, R10", desc: "R8 = R9 & R10" },
  { id: "I5", text: "OR R11, R12, R13", desc: "R11 = R12 | R13" },
];

const SPEEDUP_TABLE = [
  { n: 1, ideal: 1, actual: 1 },
  { n: 5, ideal: 5, actual: 4.44 },
  { n: 10, ideal: 10, actual: 7.14 },
  { n: 50, ideal: 50, actual: 27.78 },
  { n: 100, ideal: 100, actual: 48.08 },
  { n: 1000, ideal: 1000, actual: 498.0 },
];

function getInstructionStage(instIdx: number, cycle: number): number | null {
  const startCycle = instIdx + 1;
  if (cycle < startCycle) return null;
  if (cycle >= startCycle + 5) return null;
  return cycle - startCycle;
}

export default function PipeliningPage() {
  const [cycle, setCycle] = useState(1);
  const [autoPlay, setAutoPlay] = useState(false);
  const maxCycle = 9;
  const canAdvance = cycle < maxCycle;

  const nextCycle = () => {
    if (canAdvance) setCycle(c => c + 1);
  };
  const reset = () => {
    setCycle(1);
    setAutoPlay(false);
  };

  const handleAutoPlay = () => {
    if (autoPlay) { setAutoPlay(false); return; }
    setAutoPlay(true);
    const interval = setInterval(() => {
      setCycle(c => {
        if (c >= maxCycle - 1) {
          clearInterval(interval);
          setAutoPlay(false);
          return maxCycle;
        }
        return c + 1;
      });
    }, 800);
  };

  const totalInstructions = 5;
  const totalCycles = totalInstructions + 5 - 1;
  const speedup = (totalInstructions * 5) / (totalCycles);
  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      <div className="flex items-center gap-2 mb-6 text-xs text-slate-500">
        <Link href="/tools/arch" className="text-cyan-600 no-underline flex items-center gap-1.5 hover:text-cyan-800 transition">
          <Home size={16} /> Architecture
        </Link>
        <ChevronRight size={16} />
        <span className="text-slate-900 font-semibold">Pipelining</span>
      </div>

      <div className="mb-10">
        <h1 className="text-4xl font-extrabold text-slate-900 mb-3">📊 Pipeline Stages</h1>
        <p className="text-base text-slate-500 leading-relaxed max-w-xl">
          Understand how pipelining improves CPU throughput by overlapping instruction execution across five classic stages: Fetch, Decode, Execute, Memory, and Write-back.
        </p>
      </div>

      <Section title="What is Pipelining?">
        <InfoCard title="Pipeline Processing" type="info">
          Pipelining is a technique where multiple instructions are overlapped in execution. While one instruction is being decoded, the next is being fetched. This doesn't reduce latency of a single instruction but increases throughput — more instructions completed per unit time.
        </InfoCard>
        <AnimatedFlow steps={[
          { label: "Fetch", desc: "Get instruction from memory" },
          { label: "Decode", desc: "Interpret instruction" },
          { label: "Execute", desc: "Perform operation" },
          { label: "Memory", desc: "Access data memory" },
          { label: "Write", desc: "Store result" },
        ]} />
      </Section>

      <Section title="Interactive Pipeline Visualizer">
        <InfoCard title="Live Demonstration" type="tip">
          Click <strong>Next Cycle</strong> to watch instructions flow through the 5-stage pipeline. Each colored block represents an instruction in a pipeline stage. See how the pipeline fills and drains over cycles.
        </InfoCard>

        <div className="flex items-center gap-3 mb-5 flex-wrap">
          <button onClick={nextCycle} disabled={!canAdvance}
            className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl font-bold text-sm border-none cursor-pointer bg-gradient-to-r from-cyan-500 to-blue-600 text-white disabled:opacity-40 disabled:cursor-not-allowed hover:from-cyan-600 hover:to-blue-700 transition shadow-md">
            <Play size={16} /> Next Cycle {cycle}/{maxCycle}
          </button>
          <button onClick={handleAutoPlay}
            className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl font-bold text-sm border-2 border-cyan-500 cursor-pointer bg-white text-cyan-600 hover:bg-cyan-50 transition">
            <Zap size={16} /> {autoPlay ? "Stop" : "Auto Play"}
          </button>
          <button onClick={reset}
            className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl font-bold text-sm border-2 border-slate-300 cursor-pointer bg-white text-slate-600 hover:bg-slate-50 transition">
            <RotateCcw size={16} /> Reset
          </button>
          <span className="text-sm font-mono font-bold text-slate-700 bg-slate-100 px-3 py-2 rounded-lg">
            Cycle #{cycle}
          </span>
        </div>

        {/* Pipeline Grid */}
        <Diagram title={`Cycle ${cycle} — Pipeline State`}>
          <div className="w-full overflow-x-auto">
            <table className="w-full border-collapse text-xs">
              <thead>
                <tr>
                  <th className="p-2 text-left font-bold text-slate-600 w-24">Instruction</th>
                  {STAGES.map(s => (
                    <th key={s} className="p-2 text-center font-bold text-white" style={{ width: '14%' }}>
                      <div className={`${STAGE_COLORS[s]} rounded-lg px-2 py-1.5`}>{s}</div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {INSTRUCTIONS.map((inst, i) => {
                  const stageIdx = getInstructionStage(i, cycle);
                  return (
                    <tr key={inst.id} className="border-t border-slate-100">
                      <td className="p-2 font-mono font-bold text-slate-700 text-[11px]">
                        <span className="text-[10px] text-slate-400">{inst.id}</span> {inst.text}
                      </td>
                      {STAGES.map((s, si) => {
                        const isHere = stageIdx !== null && stageIdx === si;
                        return (
                          <td key={s} className="p-1.5 text-center">
                            {isHere ? (
                              <div className={`${STAGE_COLORS[s]} text-white rounded-lg px-1 py-2 font-bold text-[10px] shadow-md animate-pulse`}>
                                {inst.id}
                              </div>
                            ) : (
                              <div className="bg-slate-50 rounded-lg px-1 py-2 text-slate-300 text-[10px]">
                                —
                              </div>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Stage Details */}
          <div className="mt-5 grid grid-cols-5 gap-2 w-full">
            {STAGES.map((s, i) => {
              const activeInst = INSTRUCTIONS.find((_, idx) => {
                const si = getInstructionStage(idx, cycle);
                return si !== null && si === i;
              });
              return (
                <div key={s} className={`rounded-xl p-3 border-2 text-center ${STAGE_LIGHT[s]}`}>
                  <div className="font-bold text-sm mb-1">{s}</div>
                  <div className="text-[10px] leading-tight">{STAGE_DESC[s]}</div>
                  {activeInst && (
                    <div className="mt-2 bg-white rounded-lg px-2 py-1 text-[10px] font-mono font-bold shadow-sm border border-slate-200">
                      {activeInst.text}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </Diagram>
      </Section>

      <Section title="5-Stage Pipeline Breakdown">
        <div className="grid sm:grid-cols-5 gap-3 mb-5">
          {STAGES.map((s, i) => (
            <CPUStage key={s} stage={s} desc={STAGE_DESC[s]} icon={["📡", "🧩", "⚙️", "💾", "📝"][i]} />
          ))}
        </div>

        <InfoCard title="Pipeline Registers" type="info">
          Between each stage are pipeline registers (IF/ID, ID/EX, EX/MEM, MEM/WB) that hold intermediate results. These registers isolate stages so each can work independently on different instructions in the same cycle.
        </InfoCard>
      </Section>

      <Section title="Speedup Formula & Analysis">
        <p className="text-sm text-slate-600 mb-4">
          For a k-stage pipeline executing n instructions:
        </p>
        <div className="bg-gradient-to-r from-cyan-50 to-blue-50 rounded-xl p-5 border border-cyan-200 mb-5 text-center">
          <strong className="text-lg font-mono text-slate-800">
            Speedup = (n × k) / (k + n − 1)
          </strong>
          <p className="text-xs text-slate-500 mt-2">
            Speedup approaches k (number of stages) as n → ∞
          </p>
        </div>

        <p className="text-sm text-slate-600 mb-4">
          For n = {totalInstructions} instructions and k = 5 stages:
        </p>
        <div className="grid sm:grid-cols-3 gap-4 mb-5">
          {[
            { label: "Total Cycles", value: totalCycles, color: "text-blue-600" },
            { label: "Actual Speedup", value: speedup.toFixed(2) + "x", color: "text-emerald-600" },
            { label: "Ideal (k stages)", value: "5.00x", color: "text-amber-600" },
          ].map(item => (
            <div key={item.label} className="bg-white rounded-xl border border-slate-200 p-4 text-center shadow-sm">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">{item.label}</p>
              <p className={`text-2xl font-black ${item.color}`}>{item.value}</p>
            </div>
          ))}
        </div>

        <InfoCard title="Amdahl's Law & Pipelining" type="warning">
          Speedup is limited by the slowest pipeline stage. If EX takes 2ns and all others take 1ns, the pipeline clock is limited to 2ns. Balanced stages maximize throughput.
        </InfoCard>

        <div className="overflow-x-auto">
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100">
                <th className="p-2 text-left font-bold text-slate-600">n (instructions)</th>
                <th className="p-2 text-right font-bold text-slate-600">Ideal Speedup</th>
                <th className="p-2 text-right font-bold text-slate-600">Actual Speedup</th>
                <th className="p-2 text-right font-bold text-slate-600">Efficiency</th>
              </tr>
            </thead>
            <tbody>
              {SPEEDUP_TABLE.map(row => (
                <tr key={row.n} className="border-t border-slate-100">
                  <td className="p-2 font-bold text-slate-700">{row.n}</td>
                  <td className="p-2 text-right text-slate-600">{row.ideal.toFixed(1)}x</td>
                  <td className="p-2 text-right text-emerald-600 font-semibold">{row.actual.toFixed(2)}x</td>
                  <td className="p-2 text-right text-blue-600 font-semibold">{(row.actual / row.ideal * 100).toFixed(0)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Section title="Code Example: Pipeline Simulation">
        <CodeBlock code={`# 5-stage RISC-V pipeline simulation
stages = ["IF", "ID", "EX", "MEM", "WB"]
instructions = ["ADD R1,R2,R3", "SUB R4,R1,R5", "LW R6,0(R7)", "AND R8,R9,R10"]

for cycle in range(1, len(instructions) + 5):
    print(f"Cycle {cycle}: ", end="")
    for i, inst in enumerate(instructions):
        stage_idx = cycle - i - 1
        if 0 <= stage_idx < 5:
            print(f"[{stages[stage_idx]}] {inst}  ", end="")
    print()

# Speedup calculation
n = len(instructions)
k = len(stages)
total_cycles = n + k - 1
speedup = (n * k) / total_cycles
print(f"\\nSpeedup: {speedup:.2f}x (ideal: {k}x)")`} language="python" />
      </Section>

      <Section title="Pipeline Hazards Overview">
        <InfoCard title="Types of Hazards" type="warning">
          Pipelining introduces hazards that can stall the pipeline: <strong>Structural hazards</strong> (resource conflicts), <strong>Data hazards</strong> (instruction dependencies), and <strong>Control hazards</strong> (branches). These are covered in detail in the Data Hazards section.
        </InfoCard>
      </Section>

      <Section title="Interview Questions">
        <InterviewQuestion question="What is pipelining and how does it improve performance?" answer="Pipelining overlaps execution of multiple instructions by dividing the datapath into stages. Each stage works on a different instruction simultaneously. It improves throughput (instructions per cycle) but not single-instruction latency. Speedup = (n × k) / (k + n − 1) for n instructions and k stages." />
        <InterviewQuestion question="Explain the 5 stages of a classic RISC pipeline." answer="(1) IF: Fetch instruction from memory using PC address. (2) ID: Decode instruction and read register operands. (3) EX: Execute ALU operation or calculate address. (4) MEM: Access data memory for load/store. (5) WB: Write result back to register file." />
        <InterviewQuestion question="Why can't pipelining achieve ideal speedup?" answer="Ideal speedup (equal to number of stages) is limited by: pipeline fill/drain latency at start/end, uneven stage delays (clock limited by slowest stage), hazards requiring stalls, and dependencies between instructions. As instruction count → ∞, speedup approaches k." />
        <InterviewQuestion question="What are pipeline registers and why are they needed?" answer="Pipeline registers (IF/ID, ID/EX, EX/MEM, MEM/WB) sit between stages to hold intermediate data. Each cycle, the result of one stage is latched into the next pipeline register. This allows all stages to operate in parallel on different instructions, since each stage reads from its input register and writes to its output register." />
      </Section>
    </div>
  );
}
