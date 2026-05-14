"use client";

import { useState } from "react";
import Link from "next/link";
import { Home, ChevronRight, AlertTriangle, Zap, Shield } from "lucide-react";
import { Section, InfoCard, CodeBlock, Diagram, InterviewQuestion } from "../components";

const HAZARD_TYPES = [
  {
    id: "RAW",
    name: "Read After Write (RAW)",
    desc: "True dependency — an instruction reads a register that a previous instruction writes. Most common data hazard.",
    example: ["ADD R1, R2, R3  ; R1 = R2 + R3", "SUB R4, R1, R5  ; R1 needed here!"],
    color: "bg-red-50 border-red-300",
    icon: "⚠️",
  },
  {
    id: "WAR",
    name: "Write After Read (WAR)",
    desc: "Anti-dependency — an instruction writes to a register that a previous instruction reads. Occurs in out-of-order execution.",
    example: ["ADD R1, R2, R3  ; reads R2", "SUB R2, R4, R5  ; writes R2 (too early)"],
    color: "bg-amber-50 border-amber-300",
    icon: "⚡",
  },
  {
    id: "WAW",
    name: "Write After Write (WAW)",
    desc: "Output dependency — two instructions write to the same register. The last write must be the one that commits.",
    example: ["ADD R1, R2, R3  ; writes R1", "SUB R1, R4, R5  ; also writes R1"],
    color: "bg-orange-50 border-orange-300",
    icon: "🔄",
  },
];

const STAGE_COLORS: Record<string, string> = {
  IF: "bg-blue-500", ID: "bg-emerald-500", EX: "bg-amber-500",
  MEM: "bg-purple-500", WB: "bg-rose-500", STALL: "bg-red-400",
};

export default function DataHazardsPage() {
  const [activeTab, setActiveTab] = useState(0);
  const [showForward, setShowForward] = useState(false);

  const scenarios = [
    {
      title: "Without Forwarding (Stall)",
      cycles: [
        { cycle: 1, I1: "IF", I2: "", I3: "", I4: "", I5: "" },
        { cycle: 2, I1: "ID", I2: "IF", I3: "", I4: "", I5: "" },
        { cycle: 3, I1: "EX", I2: "ID", I3: "IF", I4: "", I5: "" },
        { cycle: 4, I1: "MEM", I2: "STALL", I3: "ID", I4: "IF", I5: "" },
        { cycle: 5, I1: "WB", I2: "STALL", I3: "ID", I4: "IF", I5: "" },
        { cycle: 6, I1: "", I2: "EX", I3: "ID", I4: "IF", I5: "" },
        { cycle: 7, I1: "", I2: "MEM", I3: "EX", I4: "ID", I5: "IF" },
      ],
    },
    {
      title: "With Forwarding (No Stall)",
      cycles: [
        { cycle: 1, I1: "IF", I2: "", I3: "", I4: "", I5: "" },
        { cycle: 2, I1: "ID", I2: "IF", I3: "", I4: "", I5: "" },
        { cycle: 3, I1: "EX", I2: "ID", I3: "IF", I4: "", I5: "" },
        { cycle: 4, I1: "MEM", I2: "EX", I3: "ID", I4: "IF", I5: "" },
        { cycle: 5, I1: "WB", I2: "MEM", I3: "EX", I4: "ID", I5: "IF" },
        { cycle: 6, I1: "", I2: "WB", I3: "MEM", I4: "EX", I5: "ID" },
        { cycle: 7, I1: "", I2: "", I3: "WB", I4: "MEM", I5: "EX" },
      ],
    },
  ];

  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      <div className="flex items-center gap-2 mb-6 text-xs text-slate-500">
        <Link href="/tools/arch" className="text-cyan-600 no-underline flex items-center gap-1.5 hover:text-cyan-800 transition">
          <Home size={16} /> Architecture
        </Link>
        <ChevronRight size={16} />
        <Link href="/tools/arch/pipelining" className="text-cyan-600 no-underline hover:text-cyan-800 transition">Pipelining</Link>
        <ChevronRight size={16} />
        <span className="text-slate-900 font-semibold">Data Hazards</span>
      </div>

      <div className="mb-10">
        <h1 className="text-4xl font-extrabold text-slate-900 mb-3">⚠️ Data Hazards</h1>
        <p className="text-base text-slate-500 leading-relaxed max-w-xl">
          Data hazards occur when instructions depend on each other's results. Learn how to detect, avoid, and resolve them using forwarding, stalling, and hazard detection.
        </p>
      </div>

      <Section title="What Are Data Hazards?">
        <InfoCard title="Data Hazard Definition" type="info">
          A data hazard occurs when the pipeline changes the order of read/write accesses to operands so that the program produces incorrect results. The pipeline must be stalled or reordered to maintain correct data flow.
        </InfoCard>
        <div className="flex items-center gap-2 text-sm text-slate-500 mb-4">
          <AlertTriangle size={16} className="text-amber-500" />
          Data hazards arise from <strong className="text-slate-700">register dependencies</strong> between instructions.
        </div>
      </Section>

      <Section title="Types of Data Hazards">
        <div className="grid sm:grid-cols-3 gap-4 mb-4">
          {HAZARD_TYPES.map((h, i) => (
            <button key={h.id} onClick={() => setActiveTab(i)}
              className={`rounded-xl p-4 border-2 text-left cursor-pointer transition-all ${
                activeTab === i ? `${h.color} shadow-md ring-2 ring-slate-200` : "bg-white border-slate-200 hover:border-slate-300"
              }`}>
              <div className="text-xl mb-2">{h.icon}</div>
              <h4 className="font-bold text-sm text-slate-900 mb-1.5">{h.name}</h4>
              <p className="text-[11px] text-slate-500 leading-relaxed">{h.desc}</p>
            </button>
          ))}
        </div>

        <Diagram title={`Example: ${HAZARD_TYPES[activeTab].name}`}>
          <CodeBlock code={HAZARD_TYPES[activeTab].example.join("\n")} language="assembly" />
          <div className={`rounded-xl p-4 w-full ${HAZARD_TYPES[activeTab].color}`}>
            <p className="text-xs text-slate-600">
              <strong>Explanation:</strong> {
                ["RAW: ADD writes R1 in WB stage, but SUB needs R1 in EX stage. Without forwarding, SUB must stall 2 cycles.",
                 "WAR: ADD reads R2 in ID stage. If SUB (writing R2) executes earlier due to out-of-order, ADD gets wrong value.",
                 "WAW: Both write R1. The last writer must commit last. If SUB completes before ADD, the wrong value persists."][activeTab]
              }
            </p>
          </div>
        </Diagram>
      </Section>

      <Section title="Data Forwarding (Bypassing)">
        <InfoCard title="Forwarding" type="tip">
          Forwarding (or bypassing) sends the result of an instruction directly from the EX or MEM stage back to the ALU input of a dependent instruction, avoiding a stall. The result is "forwarded" before it's written to the register file.
        </InfoCard>
        <div className="bg-gradient-to-r from-cyan-50 to-blue-50 rounded-xl p-5 border border-cyan-200 mb-4">
          <div className="flex items-center gap-3 text-sm">
            <Shield size={20} className="text-cyan-600" />
            <span className="text-slate-700"><strong>Key insight:</strong> The ALU output from EX stage contains the result before WB. Forwarding routes this value back to the next instruction's ALU input in the same cycle.</span>
          </div>
        </div>
        <CodeBlock code={`// LW -> ADD hazard: R1 needed immediately
LW R1, 0(R2)    ; Mem[R2] → R1 (result in MEM)
ADD R3, R1, R4  ; Needs R1 in EX stage

// Without forwarding: 2-cycle stall (bubbles)
// With forwarding: R1 forwarded from MEM stage output
//   directly to ADD's ALU input — 0 stall cycles`} language="assembly" />
      </Section>

      <Section title="Interactive: Stall vs Forwarding">
        <InfoCard title="Toggle Forwarding" type="tip">
          See the difference between stalled and forwarded execution. With stalling, a "bubble" (STALL) is inserted into the pipeline. Forwarding eliminates the need for a stall.
        </InfoCard>

        <div className="flex items-center gap-3 mb-4">
          <button onClick={() => setShowForward(!showForward)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm cursor-pointer transition border-2 bg-white shadow-sm
              data-[active=true]:bg-emerald-50 data-[active=true]:border-emerald-500 data-[active=true]:text-emerald-700
              data-[active=false]:border-slate-300 data-[active=false]:text-slate-600 data-[active=false]:hover:border-slate-400"
            data-active={showForward}>
            <Zap size={16} /> {showForward ? "Forwarding ON" : "Forwarding OFF (Stall)"}
          </button>
          <span className="text-xs text-slate-400">LW R1,0(R2) → ADD R3,R1,R4</span>
        </div>

        <Diagram title={showForward ? "Pipeline with Forwarding — No Stalls" : "Pipeline without Forwarding — 2-Cycle Stall"}>
          <div className="w-full overflow-x-auto">
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100">
                  <th className="p-2 text-left font-bold text-slate-600">Cycle</th>
                  <th className="p-2 text-center font-bold text-slate-600">I1: LW R1,0(R2)</th>
                  <th className="p-2 text-center font-bold text-slate-600">I2: ADD R3,R1,R4</th>
                  <th className="p-2 text-center font-bold text-slate-600">I3: SUB R5,R6,R7</th>
                  <th className="p-2 text-center font-bold text-slate-600">I4: AND R8,R9,R10</th>
                  <th className="p-2 text-center font-bold text-slate-600">I5: OR R11,R12,R13</th>
                </tr>
              </thead>
              <tbody>
                {(showForward ? scenarios[1].cycles : scenarios[0].cycles).map((row) => (
                  <tr key={row.cycle} className="border-t border-slate-100">
                    <td className="p-2 font-bold text-slate-700">C{row.cycle}</td>
                    {["I1","I2","I3","I4","I5"].map(inst => {
                      const stage = row[inst as keyof typeof row] as string;
                      return (
                        <td key={inst} className="p-1.5 text-center">
                          {stage ? (
                            <span className={`inline-block px-2 py-1 rounded-lg text-white font-bold text-[10px] ${
                              stage === "STALL" ? "bg-red-400" : STAGE_COLORS[stage] || "bg-slate-400"
                            }`}>{stage}</span>
                          ) : <span className="text-slate-300">—</span>}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 flex items-center gap-2 text-xs">
            <span className="bg-red-400 w-3 h-3 rounded inline-block" />
            <span className="text-slate-500">STALL = Pipeline bubble (NOP inserted)</span>
            {showForward && <span className="text-emerald-600 font-semibold ml-4">✓ Forwarding active — 0 stalls</span>}
          </div>
        </Diagram>
      </Section>

      <Section title="Hazard Detection Unit">
        <InfoCard title="Hardware Solution" type="info">
          The hazard detection unit monitors the pipeline registers (ID/EX, EX/MEM, MEM/WB) to detect RAW hazards. When it detects a read-after-write where the source register matches the destination of an instruction still in the pipeline, it either stalls (inserts bubble) or enables the forwarding unit.
        </InfoCard>
        <div className="grid sm:grid-cols-2 gap-4 mb-3">
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
            <h4 className="font-bold text-sm text-slate-900 mb-2">Detection Logic</h4>
            <ul className="text-xs text-slate-500 space-y-1.5">
              <li className="flex gap-2"><span className="text-blue-500 shrink-0">1.</span> Compare rs/rt of ID/EX instruction against rd of EX/MEM and MEM/WB</li>
              <li className="flex gap-2"><span className="text-blue-500 shrink-0">2.</span> If match found AND destination register write is enabled</li>
              <li className="flex gap-2"><span className="text-blue-500 shrink-0">3.</span> Activate forwarding mux to select bypassed value</li>
              <li className="flex gap-2"><span className="text-blue-500 shrink-0">4.</span> If LW followed by RAW dependency, stall for 1 cycle</li>
            </ul>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
            <h4 className="font-bold text-sm text-slate-900 mb-2">Forwarding Paths</h4>
            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2 bg-cyan-50 rounded-lg p-2"><span className="font-mono font-bold text-cyan-700">EX/MEM → EX</span><span className="text-slate-500">ALU result → next ALU input</span></div>
              <div className="flex items-center gap-2 bg-emerald-50 rounded-lg p-2"><span className="font-mono font-bold text-emerald-700">MEM/WB → EX</span><span className="text-slate-500">Memory result → next ALU input</span></div>
              <div className="flex items-center gap-2 bg-amber-50 rounded-lg p-2"><span className="font-mono font-bold text-amber-700">MEM/WB → ID</span><span className="text-slate-500">Register write → next register read</span></div>
            </div>
          </div>
        </div>
      </Section>

      <Section title="Code Example: Hazard Detection">
        <CodeBlock code={`class HazardDetectionUnit:
    def __init__(self):
        self.forwardA = 0  # 0=reg, 1=EX/MEM, 2=MEM/WB
        self.forwardB = 0
        self.stall = False

    def check(self, id_ex_rs, id_ex_rt, ex_mem_rd, mem_wb_rd,
              ex_mem_regwrite, mem_wb_regwrite):
        # ForwardA: ALU input 1
        if ex_mem_regwrite and ex_mem_rd != 0 and ex_mem_rd == id_ex_rs:
            self.forwardA = 1
        elif mem_wb_regwrite and mem_wb_rd != 0 and mem_wb_rd == id_ex_rs:
            self.forwardA = 2
        else:
            self.forwardA = 0

        # ForwardB: ALU input 2
        if ex_mem_regwrite and ex_mem_rd != 0 and ex_mem_rd == id_ex_rt:
            self.forwardB = 1
        elif mem_wb_regwrite and mem_wb_rd != 0 and mem_wb_rd == id_ex_rt:
            self.forwardB = 2
        else:
            self.forwardB = 0

        # Stall detection (LW use)
        self.stall = (ex_mem_rd == id_ex_rs or ex_mem_rd == id_ex_rt)`} language="python" />
      </Section>

      <Section title="Compiler Solutions (Software)">
        <InfoCard title="Code Scheduling" type="tip">
          Compilers can reduce hazards by reordering instructions. Independent instructions are moved between dependent ones to create distance. This is called <strong>instruction scheduling</strong> or <strong>pipeline scheduling</strong>.
        </InfoCard>
        <CodeBlock code={`// Before scheduling — stalls everywhere
LW R1, 0(R2)      ; load
ADD R3, R1, R4    ; RAW stall — needs R1
SUB R5, R6, R7    ; independent but blocked

// After scheduling — no stalls
LW R1, 0(R2)      ; load
SUB R5, R6, R7    ; moved up — independent work
ADD R3, R1, R4    ; RAW — R1 ready now (no stall!)`} language="assembly" />
      </Section>

      <Section title="Interview Questions">
        <InterviewQuestion question="What is a RAW hazard and how is it resolved?" answer="RAW (Read After Write) is a true data dependency where an instruction reads a register that a previous instruction writes. It's resolved via forwarding/bypassing: the ALU result is routed directly from the EX or MEM stage output to the ALU input of the dependent instruction. When LW creates a RAW, a 1-cycle stall may still be needed." />
        <InterviewQuestion question="How does a hazard detection unit work?" answer="The HDU monitors pipeline registers and compares source register fields (rs, rt) of the ID/EX stage against destination register fields (rd) in EX/MEM and MEM/WB. If a match is found and RegWrite is active, the forwarding mux selects the bypassed value instead of the register file output." />
        <InterviewQuestion question="What is the difference between WAR and WAW hazards?" answer="WAR (Write After Read) or anti-dependency: an instruction writes a register that an earlier instruction reads. WAW (Write After Write) or output dependency: two instructions write the same register. Both are name dependencies (not true data dependencies) and can be eliminated by register renaming." />
        <InterviewQuestion question="Why can't forwarding fully eliminate the LW-use stall?" answer="A LW instruction reads memory in the MEM stage. The result is available at the end of MEM, but the dependent instruction needs it at the start of its EX stage (same cycle). Since MEM and EX overlap, forwarding can't bridge a 1-cycle gap. One stall cycle (bubble) is inserted between LW and its dependent instruction." />
      </Section>
    </div>
  );
}
