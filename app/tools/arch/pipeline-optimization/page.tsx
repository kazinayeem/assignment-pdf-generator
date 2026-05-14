"use client";

import { useState } from "react";
import Link from "next/link";
import { Home, ChevronRight, GitBranch, Cpu, Zap, RotateCcw, BarChart3, RefreshCw, Target } from "lucide-react";
import { Section, InfoCard, CodeBlock, Diagram, InterviewQuestion } from "../components";

const PREDICTORS = [
  { bits: 1, name: "1-bit Saturating", states: 2, accuracy: "~80%", desc: "Predict taken if last branch was taken, else not taken." },
  { bits: 2, name: "2-bit Saturating", states: 4, accuracy: "~90%", desc: "Four states: Strongly Taken, Weakly Taken, Weakly Not Taken, Strongly Not Taken. Needs 2 mispredictions to flip." },
  { bits: 3, name: "3-bit Saturating", states: 8, accuracy: "~92%", desc: "More hysteresis, but diminishing returns. Rarely used beyond 2-3 bits." },
];

const BP_STATES = ["Strong NT", "Weak NT", "Weak T", "Strong T"];

export default function PipelineOptimizationPage() {
  const [bpCycle, setBpCycle] = useState(0);
  const [bpState, setBpState] = useState(3);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const toggleSection = (id: string) => {
    setExpandedSection(expandedSection === id ? null : id);
  };

  const bpHistory = [true, true, false, true, true, false, true, true, true, false];
  const bpCurrent = bpHistory[bpCycle];

  const advanceBP = () => {
    if (bpCycle < bpHistory.length - 1) {
      const wasTaken = bpCurrent;
      if (wasTaken && bpState < 3) setBpState(s => s + 1);
      if (!wasTaken && bpState > 0) setBpState(s => s - 1);
      setBpCycle(c => c + 1);
    }
  };

  const resetBP = () => {
    setBpCycle(0);
    setBpState(3);
  };

  const isCorrect = bpState >= 2 === bpCurrent;

  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      <div className="flex items-center gap-2 mb-6 text-xs text-slate-500">
        <Link href="/tools/arch" className="text-cyan-600 no-underline flex items-center gap-1.5 hover:text-cyan-800 transition">
          <Home size={16} /> Architecture
        </Link>
        <ChevronRight size={16} />
        <Link href="/tools/arch/pipelining" className="text-cyan-600 no-underline hover:text-cyan-800 transition">Pipelining</Link>
        <ChevronRight size={16} />
        <span className="text-slate-900 font-semibold">Pipeline Optimization</span>
      </div>

      <div className="mb-10">
        <h1 className="text-4xl font-extrabold text-slate-900 mb-3">🚀 Pipeline Optimization</h1>
        <p className="text-base text-slate-500 leading-relaxed max-w-xl">
          Advanced techniques to minimize pipeline stalls: branch prediction, superscalar execution, out-of-order processing, and register renaming.
        </p>
      </div>

      <Section title="Branch Prediction">
        <InfoCard title="The Branch Problem" type="warning">
          Branches (conditional jumps) introduce control hazards. The pipeline doesn't know which instruction to fetch next until the branch resolves in the EX stage. Without prediction, every branch causes a 2-cycle stall.
        </InfoCard>

        <div className="grid sm:grid-cols-3 gap-4 mb-5">
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
            <h4 className="font-bold text-sm text-slate-900 mb-2">📊 Static Prediction</h4>
            <p className="text-xs text-slate-500 mb-2">Always predict taken / not-taken based on opcode.</p>
            <span className="text-[10px] bg-blue-50 text-blue-700 px-2 py-1 rounded font-bold">~60-70% accuracy</span>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
            <h4 className="font-bold text-sm text-slate-900 mb-2">📈 Dynamic Prediction</h4>
            <p className="text-xs text-slate-500 mb-2">Uses branch history table (BHT) to predict based on past behavior.</p>
            <span className="text-[10px] bg-emerald-50 text-emerald-700 px-2 py-1 rounded font-bold">~90-95% accuracy</span>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
            <h4 className="font-bold text-sm text-slate-900 mb-2">🤖 Advanced Predictors</h4>
            <p className="text-xs text-slate-500 mb-2">Hybrid predictors combine local + global history (e.g., Tournament predictor).</p>
            <span className="text-[10px] bg-purple-50 text-purple-700 px-2 py-1 rounded font-bold">~96-98% accuracy</span>
          </div>
        </div>

        <h3 className="font-bold text-base text-slate-900 mb-3">2-Bit Saturating Counter</h3>
        <div className="grid sm:grid-cols-4 gap-2 mb-4">
          {PREDICTORS.map(p => (
            <div key={p.bits} className="bg-white rounded-xl border border-slate-200 p-3 text-center shadow-sm">
              <div className="font-bold text-slate-900 text-sm">{p.name}</div>
              <div className="text-[10px] text-slate-500 mt-1">{p.states} states • {p.accuracy}</div>
              <p className="text-[10px] text-slate-400 mt-1">{p.desc}</p>
            </div>
          ))}
        </div>

        <button onClick={() => toggleSection("predictor")}
          className="w-full text-left bg-gradient-to-r from-cyan-50 to-blue-50 rounded-xl p-4 border border-cyan-200 cursor-pointer hover:from-cyan-100 hover:to-blue-100 transition">
          <div className="flex items-center justify-between">
            <span className="font-bold text-sm text-slate-900">🎮 Interactive: 2-Bit Saturating Counter</span>
            <span className="text-xs text-cyan-600">{expandedSection === "predictor" ? "▲ Hide" : "▼ Show"}</span>
          </div>
        </button>

        {expandedSection === "predictor" && (
          <div className="mt-4 bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              {BP_STATES.map((s, i) => (
                <div key={s} className={`flex-1 text-center p-2 rounded-lg text-[10px] font-bold transition-all ${
                  i === bpState ? "bg-cyan-500 text-white shadow-md scale-105" : "bg-slate-100 text-slate-400"
                }`}>{s}</div>
              ))}
            </div>

            <div className="flex items-center gap-3 mb-4">
              <button onClick={advanceBP} disabled={bpCycle >= bpHistory.length - 1}
                className="px-4 py-2 bg-cyan-600 text-white rounded-xl text-sm font-bold border-none cursor-pointer disabled:opacity-40 hover:bg-cyan-700 transition">Next Branch</button>
              <button onClick={resetBP}
                className="px-4 py-2 border-2 border-slate-300 rounded-xl text-sm font-bold text-slate-600 cursor-pointer bg-white hover:bg-slate-50 transition"><RotateCcw size={14} className="inline" /> Reset</button>
              <span className="text-xs font-mono bg-slate-100 px-3 py-1.5 rounded-lg">Branch #{bpCycle + 1}</span>
            </div>

            <div className="flex items-center gap-3 mb-3">
              <span className="text-xs text-slate-500">Actual outcome:</span>
              <span className={`px-3 py-1 rounded-lg text-xs font-bold text-white ${bpCurrent ? "bg-emerald-500" : "bg-red-400"}`}>
                {bpCurrent ? "Taken ✓" : "Not Taken ✗"}
              </span>
              <span className="text-xs text-slate-500">Prediction:</span>
              <span className={`px-3 py-1 rounded-lg text-xs font-bold text-white ${isCorrect ? "bg-emerald-500" : "bg-red-400"}`}>
                {isCorrect ? "Correct ✓" : "Mispredict ✗"}
              </span>
            </div>

            <div className="flex gap-2 flex-wrap">
              {bpHistory.slice(0, bpCycle + 1).map((t, i) => (
                <span key={i} className={`px-2 py-0.5 rounded text-[10px] font-bold text-white ${t ? "bg-emerald-400" : "bg-red-300"}`}>
                  {t ? "T" : "NT"}
                </span>
              ))}
            </div>
          </div>
        )}
      </Section>

      <Section title="Branch Target Buffer (BTB)">
        <InfoCard title="BTB" type="info">
          The BTB caches the target address of previously taken branches. When a branch is fetched, the BTB is looked up in parallel with instruction fetch. If found, the target PC is used for the next fetch — zero-cycle branch penalty on a hit.
        </InfoCard>
        <div className="grid sm:grid-cols-2 gap-4 mb-3">
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
            <h4 className="font-bold text-sm text-slate-900 mb-2">BTB Entry Fields</h4>
            <ul className="text-xs text-slate-500 space-y-1">
              <li><strong>PC of branch:</strong> tag for lookup</li>
              <li><strong>Target address:</strong> predicted next PC</li>
              <li><strong>Prediction bits:</strong> 2-bit saturating counter</li>
              <li><strong>Type:</strong> conditional / unconditional</li>
            </ul>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
            <h4 className="font-bold text-sm text-slate-900 mb-2">BTB Operation</h4>
            <ul className="text-xs text-slate-500 space-y-1">
              <li><strong>IF stage:</strong> Lookup PC in BTB</li>
              <li><strong>BTB hit:</strong> Predict target address</li>
              <li><strong>BTB miss:</strong> Use PC+4 (sequential)</li>
              <li><strong>Resolution:</strong> Update BTB on mispredict</li>
            </ul>
          </div>
        </div>
      </Section>

      <Section title="Superpipeline & Superscalar">
        <div className="grid sm:grid-cols-2 gap-4 mb-4">
          <div className="bg-gradient-to-br from-blue-50 to-white rounded-xl border border-blue-300 p-5">
            <h4 className="font-bold text-sm text-blue-700 mb-2">🔬 Superpipeline</h4>
            <p className="text-xs text-slate-500 mb-2">Divide pipeline into finer stages (e.g., 10-20 stages vs 5). Each stage does less work, allowing higher clock frequency.</p>
            <ul className="text-xs text-slate-500 space-y-1">
              <li>• More stages = higher clock frequency</li>
              <li>• More pipeline registers = higher latency</li>
              <li>• More stages = more hazards</li>
              <li>• Example: MIPS R4000 had 8 stages</li>
            </ul>
          </div>
          <div className="bg-gradient-to-br from-emerald-50 to-white rounded-xl border border-emerald-300 p-5">
            <h4 className="font-bold text-sm text-emerald-700 mb-2">⚡ Superscalar</h4>
            <p className="text-xs text-slate-500 mb-2">Multiple instructions issued per cycle using parallel functional units (e.g., 2 ALUs, 1 FPU, 1 load/store).</p>
            <ul className="text-xs text-slate-500 space-y-1">
              <li>• Multiple pipelines in parallel</li>
              <li>• IPC &gt; 1 (instructions per cycle)</li>
              <li>• Requires wide instruction fetch/decode</li>
              <li>• Example: Intel Core i7 (4-6 wide)</li>
            </ul>
          </div>
        </div>

        <Diagram title="Superscalar Execution (2-issue)">
          <div className="w-full max-w-lg">
            {[
              ["Cycle 1", { i: "ADD R1,R2,R3", ii: "SUB R4,R5,R6" }],
              ["Cycle 2", { i: "LW R7,0(R8)", ii: "AND R9,R10,R11" }],
              ["Cycle 3", { i: "OR R12,R13,R14", ii: "XOR R15,R16,R17" }],
            ].map(([cycle, insts]) => (
              <div key={cycle as string} className="flex items-center gap-3 mb-2">
                <span className="text-[10px] font-bold text-slate-400 w-14">{cycle as string}</span>
                <div className="flex gap-2 flex-1">
                  <div className="bg-blue-100 border border-blue-300 rounded-lg px-3 py-2 text-[10px] font-mono flex-1 text-center">
                    {(insts as { i: string; ii: string }).i}
                  </div>
                  <div className="bg-emerald-100 border border-emerald-300 rounded-lg px-3 py-2 text-[10px] font-mono flex-1 text-center">
                    {(insts as { i: string; ii: string }).ii}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Diagram>
      </Section>

      <Section title="Out-of-Order Execution">
        <InfoCard title="OoO Execution" type="tip">
          In-order execution stalls when an instruction waits for data. Out-of-order execution allows later independent instructions to execute while earlier ones wait. Instructions are fetched in-order, executed out-of-order, and committed in-order.
        </InfoCard>
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm mb-4">
          <div className="flex items-start gap-3">
            <div className="text-lg">🔄</div>
            <div>
              <h4 className="font-bold text-sm text-slate-900 mb-1">Example: Hiding Load Latency</h4>
              <CodeBlock code={`// In-order: stalls at LW
LW R1, 0(R2)      ; 3-cycle latency
ADD R3, R4, R5    ; stalled! waiting for R1
SUB R6, R7, R8    ; also stalled

// Out-of-order: SUB executes while LW waits
LW R1, 0(R2)      ; long-latency load starts
SUB R6, R7, R8    ; executes immediately (no dep)
ADD R3, R4, R5    ; also executes now
// LW completes, ADD commits in order`} language="assembly" />
            </div>
          </div>
        </div>
      </Section>

      <Section title="Register Renaming">
        <InfoCard title="Renaming" type="info">
          Register renaming eliminates false dependencies (WAR, WAW) by mapping architectural registers to a larger set of physical registers. Each instruction gets a new physical destination register, and the register map table (RMT) tracks the mapping.
        </InfoCard>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
            <h4 className="font-bold text-sm text-slate-900 mb-2">Before Renaming</h4>
            <p className="text-xs text-slate-500 mb-2">WAR hazard detected!</p>
            <CodeBlock code={`ADD R1, R2, R3  ; reads R2
SUB R2, R4, R5  ; writes R2 - WAR!
// Name dependency: different architectural reg`} language="assembly" />
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
            <h4 className="font-bold text-sm text-slate-900 mb-2">After Renaming</h4>
            <p className="text-xs text-slate-500 mb-2">WAR eliminated!</p>
            <CodeBlock code={`// Physical regs: P1→R1, P2→R2, P3→R2_new
ADD P1, P2, P4    ; reads P2
SUB P3, P4, P5    ; writes P3 (not P2!)
// No dependency - both execute in parallel`} language="assembly" />
          </div>
        </div>
      </Section>

      <Section title="Speculative Execution">
        <InfoCard title="Speculation" type="warning">
          Speculative execution executes instructions before the branch outcome is known. Results are held in a reorder buffer (ROB) and committed only when the branch resolves correctly. Mispredicted instructions are flushed — this is called "pipeline flush" or "branch misprediction penalty."
        </InfoCard>
        <CodeBlock code={`// Speculative execution example
BEQZ R1, target    ; branch (resolves in 3 cycles)
// Pre-branch - always executed
ADD R2, R3, R4

// Speculatively executed (predicted taken)
target:
  LW R5, 0(R6)     ; speculative load
  SUB R7, R8, R9   ; speculative sub
  // Stored in ROB, not committed yet

// If mispredicted: ROB flushed, pipeline redirected
// Penalty: ~15-20 cycles on modern CPUs`} language="assembly" />
      </Section>

      <Section title="Code Example: Performance Comparison">
        <CodeBlock code={`// Pipeline comparison: scalar vs superscalar
// n = 8 instructions, k = 5 stages

def pipeline_cycles(n, k, issue_width):
    """Calculate cycles for n instructions"""
    return (n + k - 1) / issue_width

scalar = pipeline_cycles(8, 5, 1)
super2 = pipeline_cycles(8, 5, 2)
super4 = pipeline_cycles(8, 5, 4)

print(f"Scalar (1-wide):    {scalar} cycles = CPI 1.0")
print(f"Superscalar (2-wide): {super2} cycles = CPI 0.5")
print(f"Superscalar (4-wide): {super4} cycles = CPI 0.25")
print(f"Speedup (4-wide): {scalar/super4:.0f}x")`} language="python" />
      </Section>

      <Section title="Interview Questions">
        <InterviewQuestion question="How does a 2-bit saturating counter work for branch prediction?" answer="A 2-bit saturating counter has four states: Strongly Not Taken (00), Weakly Not Taken (01), Weakly Taken (10), Strongly Taken (11). When a branch is taken, the counter increments (saturating at 11). When not taken, it decrements (saturating at 00). Two mispredictions are needed to flip the prediction, providing hysteresis against loop-termination branches." />
        <InterviewQuestion question="What is the difference between superpipeline and superscalar?" answer="Superpipeline divides each stage into finer substages, increasing clock frequency. Superscalar replicates functional units to issue multiple instructions per cycle. A superpipelined processor has a deeper pipeline (more stages). A superscalar processor has wider pipelines (more parallel units). Many modern CPUs use both." />
        <InterviewQuestion question="How does register renaming eliminate WAR and WAW hazards?" answer="Register renaming maps architectural registers to a larger pool of physical registers. Each instruction that writes to a register gets a new unique physical register. The register map table (RMT) tracks the latest mapping. Since no two in-flight instructions share the same physical destination register, false dependencies (WAR, WAW) are eliminated." />
        <InterviewQuestion question="What happens during a branch misprediction in a superscalar processor?" answer="The mispredicted branch and all subsequent speculatively executed instructions must be flushed from the pipeline. The reorder buffer (ROB) entries are cleared, the register map table is restored to the state before the branch, and the correct target address is fetched. Modern CPUs incur a 15-20 cycle penalty for mispredictions." />
      </Section>
    </div>
  );
}
