"use client";

import { useState } from "react";
import Link from "next/link";
import { Home, ChevronRight, Play, StepForward, RotateCcw, Info } from "lucide-react";
import { Section, InfoCard, CodeBlock, Diagram, InterviewQuestion } from "../components";

type BoothState = {
  A: number; Q: number; Q1: number; M: number; step: number; done: boolean;
  history: { A: number; Q: number; Q1: number; op: string; desc: string }[];
};

function toBin(val: number, bits: number): string {
  if (val < 0) val = (1 << bits) + val;
  return val.toString(2).padStart(bits, "0");
}

function twosComplement(val: number, bits: number): number {
  return val < 0 ? (1 << bits) + val : val;
}

function arithmeticShiftRight(A: number, Q: number, bits: number): { A: number; Q: number } {
  const lsbA = A & 1;
  const msbA = (A >> (bits - 1)) & 1;
  const newA = (A >> 1) | (msbA << (bits - 1));
  const newQ = (Q >> 1) | (lsbA << (bits - 1));
  const mask = (1 << bits) - 1;
  return { A: newA & mask, Q: newQ & mask };
}

const EXAMPLES = [
  { label: "7 × 3 = 21", M: 7, Q: 3 },
  { label: "-5 × 6 = -30", M: -5, Q: 6 },
  { label: "3 × -4 = -12", M: 3, Q: -4 },
  { label: "-7 × -3 = 21", M: -7, Q: -3 },
];

export default function BoothsAlgorithmPage() {
  const [M, setM] = useState("7");
  const [Q, setQ] = useState("3");
  const [bits] = useState(4);
  const [state, setState] = useState<BoothState | null>(null);
  const [inputStr, setInputStr] = useState("");

  const initBooth = (mVal: number, qVal: number) => {
    const n = bits;
    const Mv = twosComplement(mVal, n);
    const Qv = twosComplement(qVal, n);
    const init: BoothState = {
      A: 0, Q: Qv, Q1: 0, M: Mv, step: 0, done: false,
      history: [{ A: 0, Q: Qv, Q1: 0, op: "Initial", desc: `A = 0, Q = ${toBin(qVal, n)}, Q₋₁ = 0, M = ${toBin(mVal, n)}` }],
    };
    setState(init);
    setInputStr(`Computing: ${mVal} × ${qVal}`);
  };

  const handleExample = (m: number, q: number) => {
    setM(String(m)); setQ(String(q)); initBooth(m, q);
  };

  const nextStep = () => {
    if (!state || state.done) return;
    const n = bits;
    const mask = (1 << n) - 1;
    let { A, Q, Q1, M, step } = state;
    const q0 = Q & 1;
    let op = ""; let desc = "";
    let newA = A; let newQ1 = q0;

    if (q0 === 0 && Q1 === 0) {
      op = "0 0 → Shift";
      desc = `Q₀=0, Q₋₁=0: No add/sub. Arithmetic shift right.`;
    } else if (q0 === 0 && Q1 === 1) {
      op = "0 1 → A += M";
      newA = (A + M) & mask;
      desc = `Q₀=0, Q₋₁=1: Add M → A = ${toBin(A, n)} + ${toBin(M, n)} = ${toBin(newA, n)}`;
    } else if (q0 === 1 && Q1 === 0) {
      op = "1 0 → A -= M";
      const negM = ((~M) + 1) & mask;
      newA = (A + negM) & mask;
      desc = `Q₀=1, Q₋₁=0: Subtract M → A = ${toBin(A, n)} + ${toBin(negM, n)} (2's comp of M) = ${toBin(newA, n)}`;
    } else {
      op = "1 1 → Shift";
      desc = `Q₀=1, Q₋₁=1: No add/sub. Arithmetic shift right.`;
    }

    const shifted = arithmeticShiftRight(newA, Q, n);
    A = shifted.A; Q = shifted.Q;
    step++;
    const done = step >= n;

    const newHistory = [...state.history, { A, Q, Q1: newQ1, op, desc }];
    setState({ A, Q, Q1: newQ1, M, step, done, history: newHistory });
  };

  const reset = () => {
    setState(null); setInputStr("");
  };

  const resultVal = state && state.done
    ? (() => {
        const n = bits;
        const combined = (state.A << n) | state.Q;
        const sign = (combined >> (2 * n - 1)) & 1;
        const val = sign === 1 ? combined - (1 << (2 * n)) : combined;
        return val;
      })()
    : null;

  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      <div className="flex items-center gap-2 mb-6 text-xs text-slate-500">
        <Link href="/tools/arch" className="text-cyan-600 no-underline flex items-center gap-1.5 hover:text-cyan-800 transition">
          <Home size={16} /> Architecture
        </Link>
        <ChevronRight size={16} />
        <span className="text-slate-900 font-semibold">Booth&apos;s Algorithm</span>
      </div>

      <div className="mb-10">
        <h1 className="text-4xl font-extrabold text-slate-900 mb-3">✖️ Booth&apos;s Algorithm</h1>
        <p className="text-base text-slate-500 leading-relaxed max-w-xl">
          Signed binary multiplication using bit shifting and addition/subtraction. Reduces the number of partial products for efficient hardware implementation.
        </p>
      </div>

      <Section title="What is Booth&apos;s Algorithm?">
        <InfoCard title="Purpose" type="info">
          Booth&apos;s Algorithm multiplies signed binary numbers in two&apos;s complement form. It works by examining adjacent bit pairs of the multiplier to determine whether to add, subtract, or just shift the multiplicand.
        </InfoCard>
        <p className="text-sm text-slate-600 leading-relaxed mb-4">
          Invented by Andrew Donald Booth in 1951, the algorithm handles both positive and negative multipliers uniformly and reduces the number of add/sub operations when there are consecutive 1s or 0s.
        </p>
        <Diagram title="Booth's Algorithm Flowchart">
          <svg viewBox="0 0 500 620" className="w-full max-w-md">
            <defs>
              <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">
                <polygon points="0 0, 10 3.5, 0 7" fill="#0891b2" />
              </marker>
            </defs>
            <rect x="140" y="10" width="220" height="45" rx="22" fill="#0891b2" stroke="#06b6d4" strokeWidth="2"/>
            <text x="250" y="38" textAnchor="middle" fill="white" fontSize="13" fontWeight="bold">Start</text>
            <line x1="250" y1="55" x2="250" y2="85" stroke="#0891b2" strokeWidth="2" markerEnd="url(#arrowhead)"/>
            <rect x="125" y="85" width="250" height="40" rx="6" fill="#e0f2fe" stroke="#0891b2" strokeWidth="1.5"/>
            <text x="250" y="110" textAnchor="middle" fill="#0c4a6e" fontSize="11" fontWeight="bold">A = 0, Q₋₁ = 0, M = Multiplicand</text>
            <line x1="250" y1="125" x2="250" y2="155" stroke="#0891b2" strokeWidth="2" markerEnd="url(#arrowhead)"/>
            <rect x="100" y="155" width="300" height="40" rx="6" fill="#e0f2fe" stroke="#0891b2" strokeWidth="1.5"/>
            <text x="250" y="180" textAnchor="middle" fill="#0c4a6e" fontSize="11">Count = n (number of bits)</text>
            <line x1="250" y1="195" x2="250" y2="225" stroke="#0891b2" strokeWidth="2" markerEnd="url(#arrowhead)"/>
            <polygon points="250,225 270,250 250,275 230,250" fill="#fef3c7" stroke="#d97706" strokeWidth="1.5"/>
            <text x="250" y="252" textAnchor="middle" fill="#92400e" fontSize="11">Q₀Q₋₁?</text>
            <line x1="270" y1="250" x2="340" y2="250" stroke="#0891b2" strokeWidth="2" markerEnd="url(#arrowhead)"/>
            <line x1="230" y1="250" x2="160" y2="250" stroke="#0891b2" strokeWidth="2" markerEnd="url(#arrowhead)"/>
            <text x="355" y="248" textAnchor="start" fill="#0891b2" fontSize="11">10</text>
            <text x="85" y="248" textAnchor="end" fill="#0891b2" fontSize="11">01</text>
            <rect x="320" y="270" width="140" height="40" rx="6" fill="#e0f2fe" stroke="#0891b2" strokeWidth="1.5"/>
            <text x="390" y="293" textAnchor="middle" fill="#0c4a6e" fontSize="11">A = A - M</text>
            <line x1="460" y1="290" x2="480" y2="290" stroke="#0891b2" strokeWidth="2"/>
            <line x1="480" y1="290" x2="480" y2="370" stroke="#0891b2" strokeWidth="2"/>
            <rect x="40" y="270" width="140" height="40" rx="6" fill="#e0f2fe" stroke="#0891b2" strokeWidth="1.5"/>
            <text x="110" y="293" textAnchor="middle" fill="#0c4a6e" fontSize="11">A = A + M</text>
            <line x1="40" y1="290" x2="20" y2="290" stroke="#0891b2" strokeWidth="2"/>
            <line x1="20" y1="290" x2="20" y2="370" stroke="#0891b2" strokeWidth="2"/>
            <rect x="345" y="315" width="100" height="35" rx="6" fill="#e0f2fe" stroke="#0891b2" strokeWidth="1.5"/>
            <text x="395" y="337" textAnchor="middle" fill="#0c4a6e" fontSize="11">00 or 11</text>
            <text x="395" y="349" textAnchor="middle" fill="#0c4a6e" fontSize="10">No op</text>
            <line x1="395" y1="350" x2="395" y2="370" stroke="#0891b2" strokeWidth="2"/>
            <line x1="110" y1="315" x2="110" y2="370" stroke="#0891b2" strokeWidth="2"/>
            <line x1="20" y1="370" x2="480" y2="370" stroke="#0891b2" strokeWidth="2"/>
            <line x1="250" y1="370" x2="250" y2="400" stroke="#0891b2" strokeWidth="2" markerEnd="url(#arrowhead)"/>
            <rect x="120" y="400" width="260" height="40" rx="6" fill="#e0f2fe" stroke="#0891b2" strokeWidth="1.5"/>
            <text x="250" y="425" textAnchor="middle" fill="#0c4a6e" fontSize="11">Arithmetic Shift Right A, Q, Q₋₁</text>
            <line x1="250" y1="440" x2="250" y2="470" stroke="#0891b2" strokeWidth="2" markerEnd="url(#arrowhead)"/>
            <polygon points="250,470 270,490 250,510 230,490" fill="#fef3c7" stroke="#d97706" strokeWidth="1.5"/>
            <text x="250" y="492" textAnchor="middle" fill="#92400e" fontSize="11">Count = n?</text>
            <line x1="270" y1="490" x2="380" y2="490" stroke="#0891b2" strokeWidth="2" markerEnd="url(#arrowhead)"/>
            <line x1="230" y1="490" x2="120" y2="490" stroke="#0891b2" strokeWidth="2" markerEnd="url(#arrowhead)"/>
            <text x="400" y="488" textAnchor="start" fill="#0891b2" fontSize="11">Yes</text>
            <text x="100" y="488" textAnchor="end" fill="#0891b2" fontSize="11">No</text>
            <rect x="360" y="520" width="100" height="40" rx="22" fill="#059669" stroke="#34d399" strokeWidth="2"/>
            <text x="410" y="545" textAnchor="middle" fill="white" fontSize="13" fontWeight="bold">End</text>
            <line x1="120" y1="490" x2="80" y2="490" stroke="#0891b2" strokeWidth="2"/>
            <line x1="80" y1="490" x2="80" y2="175" stroke="#0891b2" strokeWidth="2" markerEnd="url(#arrowhead)"/>
          </svg>
        </Diagram>
      </Section>

      <Section title="Interactive Simulator">
        <div className="bg-white rounded-xl border border-slate-200 p-6 mb-5 shadow-sm">
          <div className="flex flex-wrap gap-2 mb-4">
            {EXAMPLES.map((ex, i) => (
              <button key={i} onClick={() => handleExample(ex.M, ex.Q)}
                className="bg-cyan-50 border border-cyan-200 text-cyan-700 px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer hover:bg-cyan-100 transition">
                {ex.label}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap gap-4 mb-5">
            <div>
              <label className="text-xs font-semibold text-slate-600 block mb-1">Multiplicand (M):</label>
              <input type="number" value={M} onChange={e => setM(e.target.value)}
                className="border border-slate-300 rounded-lg px-3 py-2 text-sm w-24 font-mono" disabled={!!state} />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-600 block mb-1">Multiplier (Q):</label>
              <input type="number" value={Q} onChange={e => setQ(e.target.value)}
                className="border border-slate-300 rounded-lg px-3 py-2 text-sm w-24 font-mono" disabled={!!state} />
            </div>
            <div className="flex items-end gap-2">
              <button onClick={() => initBooth(parseInt(M) || 0, parseInt(Q) || 0)}
                className="bg-cyan-600 text-white px-4 py-2 rounded-lg text-sm font-semibold cursor-pointer flex items-center gap-1.5 hover:bg-cyan-700 transition disabled:opacity-40"
                disabled={!!state}>
                <Play size={16} /> Start
              </button>
              <button onClick={nextStep}
                className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-semibold cursor-pointer flex items-center gap-1.5 hover:bg-emerald-700 transition disabled:opacity-40"
                disabled={!state || state.done}>
                <StepForward size={16} /> Step
              </button>
              <button onClick={reset}
                className="bg-slate-200 text-slate-700 px-4 py-2 rounded-lg text-sm font-semibold cursor-pointer flex items-center gap-1.5 hover:bg-slate-300 transition">
                <RotateCcw size={16} /> Reset
              </button>
            </div>
          </div>

          {state && (
            <div className="space-y-4">
              <div className="grid grid-cols-4 gap-3 text-center">
                {[
                  { label: "A", val: toBin(state.A, bits), color: "bg-blue-50 border-blue-300 text-blue-800" },
                  { label: "Q", val: toBin(state.Q, bits), color: "bg-purple-50 border-purple-300 text-purple-800" },
                  { label: "Q₋₁", val: String(state.Q1), color: "bg-orange-50 border-orange-300 text-orange-800" },
                  { label: "M", val: toBin(state.M, bits), color: "bg-emerald-50 border-emerald-300 text-emerald-800" },
                ].map((reg, i) => (
                  <div key={i} className={`${reg.color} border-2 rounded-xl p-3`}>
                    <div className="text-[10px] font-bold tracking-wider mb-1">{reg.label}</div>
                    <div className="font-mono text-lg font-bold tracking-widest">{reg.val}</div>
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <Info size={14} />
                <span>Step {state.step} of {bits} {state.done ? "(Complete)" : ""}</span>
              </div>
              {state.done && resultVal !== null && (
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-center">
                  <p className="text-xs text-emerald-600 font-semibold mb-1">Result (A:Q)</p>
                  <p className="font-mono text-xl font-bold text-emerald-800">
                    {toBin(state.A, bits)}:{toBin(state.Q, bits)} = {resultVal} (decimal)
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {state && state.history.length > 0 && (
          <div className="bg-slate-50 rounded-xl border border-slate-200 p-5">
            <h4 className="text-sm font-bold text-slate-900 mb-3">Step History</h4>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {state.history.map((h, i) => (
                <div key={i} className={`flex items-start gap-3 p-2.5 rounded-lg text-xs ${h.op === "Initial" ? "bg-white border border-slate-200" : ""}`}>
                  <span className="bg-cyan-600 text-white w-6 h-6 rounded-full flex items-center justify-center font-bold text-[10px] shrink-0">
                    {i === 0 ? "S" : i}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="font-bold text-slate-900">{h.op}</span>
                      <span className="font-mono text-slate-500">A:{toBin(h.A, bits)} Q:{toBin(h.Q, bits)} Q₋₁:{h.Q1}</span>
                    </div>
                    <p className="text-slate-400 leading-relaxed">{h.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </Section>

      <Section title="How Booth's Algorithm Works">
        <div className="text-sm text-slate-600 leading-relaxed space-y-3 mb-5">
          <p>The algorithm operates on <strong>n-bit</strong> signed binary numbers in two&apos;s complement form. Three registers are used:</p>
          <ul className="list-disc pl-5 space-y-1 text-xs">
            <li><strong>A</strong> (Accumulator): n-bit register, initialized to 0</li>
            <li><strong>Q</strong> (Multiplier): n-bit register holding the multiplier</li>
            <li><strong>Q₋₁</strong>: 1-bit register, initialized to 0</li>
            <li><strong>M</strong> (Multiplicand): n-bit register holding the multiplicand</li>
          </ul>
          <p>At each step, examine the LSB of Q (Q₀) and Q₋₁:</p>
          <div className="overflow-x-auto">
            <table className="w-full text-xs border-collapse">
              <thead><tr className="bg-slate-100"><th className="border border-slate-200 px-3 py-2 text-left">Q₀</th><th className="border border-slate-200 px-3 py-2 text-left">Q₋₁</th><th className="border border-slate-200 px-3 py-2 text-left">Operation</th></tr></thead>
              <tbody>
                {[["0","0","No arithmetic operation. Arithmetic Shift Right."],["0","1","Add M to A. Arithmetic Shift Right."],["1","0","Subtract M from A. Arithmetic Shift Right."],["1","1","No arithmetic operation. Arithmetic Shift Right."]].map((row,i)=>(
                  <tr key={i} className="hover:bg-slate-50"><td className="border border-slate-200 px-3 py-2 font-mono">{row[0]}</td><td className="border border-slate-200 px-3 py-2 font-mono">{row[1]}</td><td className="border border-slate-200 px-3 py-2">{row[2]}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Section>

      <Section title="Numerical Example: 7 × 3">
        <div className="overflow-x-auto mb-4">
          <table className="w-full text-xs border-collapse">
            <thead><tr className="bg-slate-100"><th className="border border-slate-200 px-3 py-2">Step</th><th className="border border-slate-200 px-3 py-2">Q₀Q₋₁</th><th className="border border-slate-200 px-3 py-2">Operation</th><th className="border border-slate-200 px-3 py-2">A</th><th className="border border-slate-200 px-3 py-2">Q</th><th className="border border-slate-200 px-3 py-2">Q₋₁</th></tr></thead>
            <tbody>
              {[["0","–","Initial","0000","0011","0"],["1","10","A = A - M","A=0000-0111=1001","1001","0011","0"],["","","ASR","1100","1001","1"],["2","11","No op","1100","1001","1"],["","","ASR","1110","0100","1"],["3","01","A = A + M","A=1110+0111=0101","0101","0100","1"],["","","ASR","0010","1010","0"],["4","00","No op","0010","1010","0"],["","","ASR","0001","0101","0"]].map((row,i)=>(
                <tr key={i} className="hover:bg-slate-50"><td className="border border-slate-200 px-3 py-2 text-center">{row[0]}</td><td className="border border-slate-200 px-3 py-2 font-mono text-center">{row[1]}</td><td className="border border-slate-200 px-3 py-2">{row[2]}</td><td className="border border-slate-200 px-3 py-2 font-mono text-center">{row[3]}</td><td className="border border-slate-200 px-3 py-2 font-mono text-center">{row[4]}</td><td className="border border-slate-200 px-3 py-2 font-mono text-center">{row[5]}</td></tr>
            ))}</tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500">Result: A:Q = 0001:0101 = 21 (decimal). ✓</p>
      </Section>

      <Section title="Code Example">
        <CodeBlock code={`def booth_multiply(M: int, Q: int, bits: int = 4) -> int:
    A = 0
    Q_1 = 0
    mask = (1 << bits) - 1
    M_neg = ((~M) + 1) & mask  # two's complement negation

    for step in range(bits):
        q0 = Q & 1
        if q0 == 0 and Q_1 == 1:
            A = (A + M) & mask
        elif q0 == 1 and Q_1 == 0:
            A = (A + M_neg) & mask
        
        # arithmetic shift right (A:Q:Q_1)
        lsb_A = A & 1
        msb_A = (A >> (bits - 1)) & 1
        A = (A >> 1) | (msb_A << (bits - 1))
        Q = (Q >> 1) | (lsb_A << (bits - 1))
        Q_1 = q0

    result = (A << bits) | Q
    sign = (result >> (2 * bits - 1)) & 1
    return result if sign == 0 else result - (1 << (2 * bits))`} language="python" />
      </Section>

      <Section title="Interview Questions">
        <InterviewQuestion question="Why is Booth's Algorithm used in hardware multiplication?" answer="Booth's Algorithm allows multiplication of signed binary numbers using only addition, subtraction, and shifting operations. It reduces the number of partial products, especially when the multiplier has consecutive 1s or 0s, making it efficient for hardware implementation in ALUs." />
        <InterviewQuestion question="How does Booth's Algorithm handle negative multipliers?" answer="Unlike simple multiplication algorithms, Booth's Algorithm naturally handles negative multipliers because it works with two's complement representation. The algorithm examines pairs of bits (Q₀ and Q₋₁) and subtracts M when it sees a '10' pattern, which effectively handles the sign extension needed for negative numbers." />
        <InterviewQuestion question="What is the difference between Booth's Algorithm and the modified Booth's Algorithm?" answer="The modified (Booth-2/radix-4) algorithm examines 3 bits at a time (overlapping by 1), reducing the number of partial products by half. While standard Booth's does n steps for n-bit numbers, the modified version does n/2 steps, using operations like +M, +2M, -M, -2M instead of just +M and -M." />
      </Section>
    </div>
  );
}
