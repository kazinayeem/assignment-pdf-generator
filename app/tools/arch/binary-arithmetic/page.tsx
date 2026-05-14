"use client";

import { useState } from "react";
import Link from "next/link";
import { Home, ChevronRight, Plus, Minus, X, Divide } from "lucide-react";
import { Section, InfoCard, CodeBlock, Diagram, InterviewQuestion } from "../components";

function toBin(v: number, n: number): string {
  const u = v < 0 ? (1 << n) + v : v;
  return u.toString(2).padStart(n, "0").slice(-n);
}

function FullAdder({ a, b, cin, id }: { a: number; b: number; cin: number; id: string }) {
  const sum = a ^ b ^ cin;
  const cout = (a & b) | (b & cin) | (cin & a);
  return (
    <div id={id} className="flex flex-col items-center border border-slate-300 rounded-lg p-2 bg-white min-w-[90px]">
      <div className="text-[10px] font-bold text-slate-400 mb-1.5">FA</div>
      <div className="flex gap-2 text-[10px] font-mono">
        <span className="text-blue-600">{a}</span>
        <span className="text-purple-600">{b}</span>
        <span className="text-orange-600">c{cin}</span>
      </div>
      <div className="w-full border-t border-slate-200 my-1" />
      <div className="flex gap-3 text-[10px] font-bold font-mono">
        <span className="text-emerald-600">s{sum}</span>
        <span className="text-rose-600">c{cout}</span>
      </div>
    </div>
  );
}

const ADDERS = [
  { bits: "4-bit", stages: 4, time: "4 × gate delay" },
  { bits: "8-bit", stages: 8, time: "8 × gate delay" },
  { bits: "16-bit", stages: 16, time: "16 × gate delay" },
  { bits: "32-bit", stages: 32, time: "32 × gate delay" },
];

export default function BinaryArithmeticPage() {
  const [aVal, setAVal] = useState("1010");
  const [bVal, setBVal] = useState("0111");
  const [op, setOp] = useState<"add" | "sub">("add");

  const compute = () => {
    const a = parseInt(aVal, 2);
    const b = parseInt(bVal, 2);
    if (isNaN(a) || isNaN(b)) return null;
    if (op === "add") return { a, b, result: a + b, carry: (a + b) >> 4, bits: Math.max(aVal.length, bVal.length) };
    const diff = a - b;
    return { a, b, result: diff >= 0 ? diff : diff + 256, carry: diff < 0 ? 1 : 0, bits: Math.max(aVal.length, bVal.length) };
  };

  const data = compute();

  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      <div className="flex items-center gap-2 mb-6 text-xs text-slate-500">
        <Link href="/tools/arch" className="text-cyan-600 no-underline flex items-center gap-1.5 hover:text-cyan-800 transition">
          <Home size={16} /> Architecture
        </Link>
        <ChevronRight size={16} />
        <span className="text-slate-900 font-semibold">Binary Arithmetic</span>
      </div>

      <div className="mb-10">
        <h1 className="text-4xl font-extrabold text-slate-900 mb-3">🔢 Binary Arithmetic</h1>
        <p className="text-base text-slate-500 leading-relaxed max-w-xl">
          Addition, subtraction, multiplication, and division in binary. Understanding how computers perform arithmetic at the hardware level.
        </p>
      </div>

      <Section title="Binary Addition">
        <p className="text-sm text-slate-600 leading-relaxed mb-4">
          Binary addition follows the same principles as decimal addition but with only two digits (0 and 1). The four basic rules are: 0+0=0, 0+1=1, 1+0=1, 1+1=0 with carry 1.
        </p>
        <div className="bg-white rounded-xl border border-slate-200 p-5 mb-5 shadow-sm">
          <div className="flex flex-wrap items-end gap-3 mb-4">
            <div>
              <label className="text-xs font-semibold text-slate-600 block mb-1">A (binary):</label>
              <input value={aVal} onChange={e => setAVal(e.target.value.replace(/[^01]/g, "").slice(0, 8))}
                className="border border-slate-300 rounded-lg px-3 py-2 text-sm font-mono w-28" />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-600 block mb-1">B (binary):</label>
              <input value={bVal} onChange={e => setBVal(e.target.value.replace(/[^01]/g, "").slice(0, 8))}
                className="border border-slate-300 rounded-lg px-3 py-2 text-sm font-mono w-28" />
            </div>
            <button onClick={() => setOp(op === "add" ? "sub" : "add")}
              className={`px-4 py-2 rounded-lg text-sm font-semibold cursor-pointer flex items-center gap-1.5 transition ${op === "add" ? "bg-emerald-600 text-white hover:bg-emerald-700" : "bg-rose-600 text-white hover:bg-rose-700"}`}>
              {op === "add" ? <Plus size={16} /> : <Minus size={16} />} {op === "add" ? "Add" : "Subtract"}
            </button>
          </div>
          {data && (
            <div className="font-mono text-sm space-y-1 bg-slate-50 p-4 rounded-lg">
              <p className="text-slate-400 text-xs mb-2">{op === "add" ? "Addition" : "Subtraction"}</p>
              <p className="text-slate-800">  {toBin(data.a, data.bits)} = {data.a}</p>
              <p className="text-slate-800">{op === "add" ? "+ " : "- "} {toBin(data.b, data.bits)} = {data.b}</p>
              <p className="border-t border-slate-300 pt-1 text-slate-900 font-bold">{toBin(data.result, data.bits + 1)} = {data.result} {data.carry ? `(carry: ${data.carry})` : ""}</p>
            </div>
          )}
        </div>
      </Section>

      <Section title="Half Adder &amp; Full Adder">
        <InfoCard title="Building Blocks" type="info">
          The Half Adder adds 2 bits (sum, carry). The Full Adder adds 3 bits (a, b, carry-in). Full adders are cascaded to build multi-bit adders.
        </InfoCard>

        <div className="grid sm:grid-cols-2 gap-4 mb-5">
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
            <h4 className="text-sm font-bold text-slate-900 mb-3">Half Adder</h4>
            <table className="w-full text-xs border-collapse mb-3">
              <thead><tr className="bg-slate-100"><th className="border border-slate-200 px-3 py-1.5">A</th><th className="border border-slate-200 px-3 py-1.5">B</th><th className="border border-slate-200 px-3 py-1.5">Sum</th><th className="border border-slate-200 px-3 py-1.5">Carry</th></tr></thead>
              <tbody>{[[0,0,0,0],[0,1,1,0],[1,0,1,0],[1,1,0,1]].map((r,i)=>(
                <tr key={i} className="hover:bg-slate-50"><td className="border border-slate-200 px-3 py-1.5 font-mono text-center">{r[0]}</td><td className="border border-slate-200 px-3 py-1.5 font-mono text-center">{r[1]}</td><td className="border border-slate-200 px-3 py-1.5 font-mono text-center">{r[2]}</td><td className="border border-slate-200 px-3 py-1.5 font-mono text-center">{r[3]}</td></tr>
              ))}</tbody>
            </table>
            <p className="text-[10px] text-slate-400 font-mono">Sum = A ⊕ B &nbsp; Carry = A · B</p>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
            <h4 className="text-sm font-bold text-slate-900 mb-3">Full Adder</h4>
            <table className="w-full text-xs border-collapse mb-3">
              <thead><tr className="bg-slate-100"><th className="border border-slate-200 px-3 py-1.5">A</th><th className="border border-slate-200 px-3 py-1.5">B</th><th className="border border-slate-200 px-3 py-1.5">Cin</th><th className="border border-slate-200 px-3 py-1.5">Sum</th><th className="border border-slate-200 px-3 py-1.5">Cout</th></tr></thead>
              <tbody>{[[0,0,0,0,0],[0,0,1,1,0],[0,1,0,1,0],[0,1,1,0,1],[1,0,0,1,0],[1,0,1,0,1],[1,1,0,0,1],[1,1,1,1,1]].map((r,i)=>(
                <tr key={i} className="hover:bg-slate-50"><td className="border border-slate-200 px-3 py-1.5 font-mono text-center">{r[0]}</td><td className="border border-slate-200 px-3 py-1.5 font-mono text-center">{r[1]}</td><td className="border border-slate-200 px-3 py-1.5 font-mono text-center">{r[2]}</td><td className="border border-slate-200 px-3 py-1.5 font-mono text-center">{r[3]}</td><td className="border border-slate-200 px-3 py-1.5 font-mono text-center">{r[4]}</td></tr>
              ))}</tbody>
            </table>
            <p className="text-[10px] text-slate-400 font-mono">Sum = A⊕B⊕Cin &nbsp; Cout = A·B + B·Cin + Cin·A</p>
          </div>
        </div>
      </Section>

      <Section title="Ripple Carry Adder">
        <p className="text-sm text-slate-600 leading-relaxed mb-4">
          A ripple carry adder chains full adders together: the carry-out of one stage feeds the carry-in of the next. Simple but slow because carry must propagate through all stages.
        </p>
        <Diagram title="4-bit Ripple Carry Adder">
          <div className="flex flex-wrap justify-center gap-3 items-end mb-4">
            {[3, 2, 1, 0].map(i => (
              <div key={i} className="flex flex-col items-center">
                <FullAdder a={0} b={0} cin={0} id={`fa-${i}`} />
                <div className="text-[9px] text-slate-400 mt-1.5 font-mono">bit {i}</div>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-2 text-[10px] text-slate-500">
            <span className="bg-rose-100 text-rose-700 px-2 py-0.5 rounded">Carry ripples LSB → MSB</span>
            <span className="text-slate-300">|</span>
            <span className="bg-amber-100 text-amber-700 px-2 py-0.5 rounded">Delay: n × gate delay</span>
          </div>
        </Diagram>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
          {ADDERS.map((a, i) => (
            <div key={i} className="bg-cyan-50 border border-cyan-200 rounded-xl p-3 text-center">
              <div className="text-lg font-bold text-cyan-700 mb-1">{a.bits}</div>
              <div className="text-xs text-slate-500">{a.stages} full adders</div>
              <div className="text-[10px] text-slate-400">{a.time}</div>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Carry Lookahead Adder (CLA)">
        <InfoCard title="Performance Improvement" type="tip">
          CLA reduces carry propagation delay by computing carries in parallel using generate (G = A·B) and propagate (P = A⊕B) signals. Much faster but uses more hardware.
        </InfoCard>
        <div className="text-sm text-slate-600 leading-relaxed space-y-2 mb-4">
          <p>For each bit position i:</p>
          <ul className="list-disc pl-5 text-xs space-y-1">
            <li><strong>Generate</strong>: Gᵢ = Aᵢ · Bᵢ (carry is generated if both bits are 1)</li>
            <li><strong>Propagate</strong>: Pᵢ = Aᵢ ⊕ Bᵢ (carry propagates if exactly one bit is 1)</li>
            <li><strong>Carry</strong>: Cᵢ₊₁ = Gᵢ + Pᵢ · Cᵢ</li>
            <li><strong>Sum</strong>: Sᵢ = Pᵢ ⊕ Cᵢ</li>
          </ul>
          <p className="text-xs text-slate-400 mt-2">CLA computes all carries in parallel in 2-3 gate delays regardless of bit width.</p>
        </div>
        <CodeBlock code={`def carry_lookahead_adder(A: int, B: int, bits: int = 4):
    mask = (1 << bits) - 1
    G = A & B          # generate
    P = A ^ B          # propagate
    carry = 0
    result = 0
    for i in range(bits):
        gi = (G >> i) & 1
        pi = (P >> i) & 1
        carry = gi | (pi & carry)
        bit = ((P >> i) & 1) ^ ((carry >> 1) & 1) if i > 0 else ((P >> i) & 1) ^ 0
        result |= (bit << i)
    carry_out = (carry >> (bits - 1)) & 1 if bits > 0 else 0
    return result & mask, carry_out`} language="python" />
      </Section>

      <Section title="Binary Multiplication &amp; Division">
        <div className="grid sm:grid-cols-2 gap-4 mb-4">
          <div className="bg-white rounded-xl border border-slate-200 p-4">
            <h4 className="text-sm font-bold text-slate-900 mb-2 flex items-center gap-1.5"><X size={14} /> Multiplication</h4>
            <p className="text-xs text-slate-500 leading-relaxed mb-2">Repeated shift-and-add: multiply by each multiplier bit, shift left, and sum partial products.  n-bit × n-bit produces up to 2n-bit result.</p>
            <div className="font-mono text-[10px] bg-slate-50 p-2 rounded">
              <p className="text-slate-400">  1011  (11)</p>
              <p className="text-slate-400">× 1101  (13)</p>
              <p className="border-t border-slate-300">  -----</p>
              <p className="text-slate-600">  1011   (partial)</p>
              <p className="text-slate-600"> 0000</p>
              <p className="text-slate-600">1011</p>
              <p className="text-slate-600">1011</p>
              <p className="border-t border-slate-300 font-bold text-slate-900">10001111 (143)</p>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-4">
            <h4 className="text-sm font-bold text-slate-900 mb-2 flex items-center gap-1.5"><Divide size={14} /> Division</h4>
            <p className="text-xs text-slate-500 leading-relaxed mb-2">Repeated shift-and-subtract (restoring/non-restoring). Compare divisor with current remainder; if smaller, subtract and set quotient bit to 1.</p>
            <div className="font-mono text-[10px] bg-slate-50 p-2 rounded">
              <p className="text-slate-400">    1101 (13)  ← quotient</p>
              <p className="text-slate-400">   -----</p>
              <p className="text-slate-400">11)100111</p>
              <p className="text-slate-400">  -011</p>
              <p className="text-slate-400">  ----</p>
              <p className="text-slate-600">   0011</p>
              <p className="text-slate-600">   -011</p>
              <p className="text-slate-400">   ----</p>
              <p className="text-slate-600">     011</p>
              <p className="text-slate-600">    -011</p>
              <p className="border-t border-slate-300 font-bold text-slate-900">     010 (2)  ← remainder</p>
            </div>
          </div>
        </div>
      </Section>

      <Section title="Code Example">
        <CodeBlock code={`def binary_add(a: str, b: str) -> str:
    """Add two binary strings, return binary result."""
    result = []
    i, j = len(a)-1, len(b)-1
    carry = 0
    while i >= 0 or j >= 0 or carry:
        bit_a = int(a[i]) if i >= 0 else 0
        bit_b = int(b[j]) if j >= 0 else 0
        total = bit_a + bit_b + carry
        result.append(str(total % 2))
        carry = total // 2
        i -= 1; j -= 1
    return ''.join(reversed(result))

def binary_multiply(a: str, b: str) -> str:
    result = "0"
    n = len(b)
    for i, bit in enumerate(reversed(b)):
        if bit == "1":
            shifted = a + "0" * i
            result = binary_add(result, shifted)
    return result`} language="python" />
      </Section>

      <Section title="Interview Questions">
        <InterviewQuestion question="What is the difference between a ripple carry adder and a carry lookahead adder?" answer="A ripple carry adder chains full adders where each carry must wait for the previous stage, leading to O(n) delay. A carry lookahead adder computes generate (G=A·B) and propagate (P=A⊕B) signals in parallel, computing all carries simultaneously in O(1) delay, at the cost of more complex hardware." />
        <InterviewQuestion question="How does overflow occur in binary addition and how can it be detected?" answer="Overflow occurs when the result of addition exceeds the representable range. For signed numbers, overflow is detected when carry-in to the MSB differs from carry-out of the MSB. For unsigned numbers, overflow is detected by checking the final carry-out bit." />
        <InterviewQuestion question="Explain the difference between restoring and non-restoring division." answer="In restoring division, if subtraction yields a negative remainder, the divisor is added back (restored). In non-restoring division, the remainder is left negative and the next step uses addition instead, making it faster since it avoids the restore step. Non-restoring is more common in hardware." />
      </Section>
    </div>
  );
}
