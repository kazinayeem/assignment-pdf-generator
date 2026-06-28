"use client";

import { useState } from "react";
import Link from "next/link";
import { Home, ChevronRight, Plus, AlertTriangle } from "lucide-react";
import { Section, InfoCard, CodeBlock, InterviewQuestion } from "../components";

function toBin(v: number, bits: number): string {
  if (v < 0) v = (1 << bits) + v;
  return v.toString(2).padStart(bits, "0");
}

function fromBin(b: string): number {
  const bits = b.length;
  const val = parseInt(b, 2);
  return (b[0] === "1") ? val - (1 << bits) : val;
}

type RepType = "sign-mag" | "ones-comp" | "twos-comp";

function encode(val: number, bits: number, type: RepType): string {
  if (type === "sign-mag") {
    const abs = Math.abs(val);
    const sign = val < 0 ? "1" : "0";
    return sign + abs.toString(2).padStart(bits - 1, "0").slice(-(bits - 1));
  }
  if (type === "ones-comp") {
    const u = val < 0 ? (1 << bits) + val - 1 : val;
    return u.toString(2).padStart(bits, "0");
  }
  const u = val < 0 ? (1 << bits) + val : val;
  return u.toString(2).padStart(bits, "0");
}

function decode(bin: string, type: RepType): number {
  const bits = bin.length;
  if (type === "sign-mag") {
    const sign = bin[0] === "1" ? -1 : 1;
    const mag = parseInt(bin.slice(1) || "0", 2);
    return sign * mag;
  }
  if (type === "ones-comp") {
    const val = parseInt(bin, 2);
    return (bin[0] === "1") ? val - ((1 << bits) - 1) : val;
  }
  const val = parseInt(bin, 2);
  return (bin[0] === "1") ? val - (1 << bits) : val;
}

const REP_TYPES: { key: RepType; label: string; desc: string }[] = [
  { key: "sign-mag", label: "Sign-Magnitude", desc: "MSB = sign, rest = magnitude" },
  { key: "ones-comp", label: "One's Complement", desc: "Negate by flipping all bits" },
  { key: "twos-comp", label: "Two's Complement", desc: "Negate: flip bits + 1" },
];

const RANGES = [
  { type: "Sign-Magnitude", n4: "[-7, +7]", n8: "[-127, +127]", n16: "[-32767, +32767]", note: "Two zeros (+0, -0)" },
  { type: "One's Complement", n4: "[-7, +7]", n8: "[-127, +127]", n16: "[-32767, +32767]", note: "Two zeros (+0, -0)" },
  { type: "Two's Complement", n4: "[-8, +7]", n8: "[-128, +127]", n16: "[-32768, +32767]", note: "One zero, asymmetric range" },
];

export default function SignedNumbersPage() {
  const [bits] = useState(4);
  const [value, setValue] = useState("5");
  const [repType, setRepType] = useState<RepType>("twos-comp");
  const [addA, setAddA] = useState("0011");
  const [addB, setAddB] = useState("0101");
  const [showAddStep, setShowAddStep] = useState(false);

  const numVal = parseInt(value) || 0;
  const encoded = encode(numVal, bits, repType);
  const decoded = decode(encoded, repType);
  const encodedHex = parseInt(encoded, 2).toString(16).toUpperCase().padStart(Math.ceil(bits / 4), "0");

  const addResult = (() => {
    const a = fromBin(addA);
    const b = fromBin(addB);
    const sum = a + b;
    const sumBin = toBin(sum, bits);
    const overflow = (addA[0] === addB[0]) && (sumBin[0] !== addA[0]);
    return { a, b, sum, sumBin, overflow };
  })();

  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      <div className="flex items-center gap-2 mb-6 text-xs text-slate-500">
        <Link href="/tools/arch" className="text-cyan-600 no-underline flex items-center gap-1.5 hover:text-cyan-800 transition">
          <Home size={16} /> Architecture
        </Link>
        <ChevronRight size={16} />
        <span className="text-slate-900 font-semibold">Signed Numbers</span>
      </div>

      <div className="mb-10">
        <h1 className="text-4xl font-extrabold text-slate-900 mb-3">± Signed Number Representations</h1>
        <p className="text-base text-slate-500 leading-relaxed max-w-xl">
          How computers represent negative numbers: sign-magnitude, one&apos;s complement, and two&apos;s complement. Two&apos;s complement is the dominant standard in modern computing.
        </p>
      </div>

      <Section title="Interactive Representation Explorer">
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm mb-5">
          <div className="flex flex-wrap items-end gap-3 mb-5">
            <div>
              <label className="text-xs font-semibold text-slate-600 block mb-1">Decimal value ({bits}-bit):</label>
              <input type="number" value={value} onChange={e => setValue(e.target.value)}
                className="border border-slate-300 rounded-lg px-3 py-2 text-sm w-24 font-mono" />
            </div>
            <div className="flex gap-1.5">
              {REP_TYPES.map((r) => (
                <button key={r.key} onClick={() => setRepType(r.key)}
                  className={`px-3 py-2 rounded-lg text-xs font-semibold cursor-pointer transition border ${
                    repType === r.key
                      ? "bg-cyan-600 text-white border-cyan-600"
                      : "bg-white text-slate-600 border-slate-300 hover:border-cyan-400"
                  }`}>
                  {r.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            <div className="bg-slate-50 rounded-xl p-4 text-center">
              <div className="text-[10px] font-bold text-slate-400 mb-1.5">Binary Representation</div>
              <div className="font-mono text-xl font-bold tracking-widest text-slate-800">
                {encoded.split("").map((b, i) => (
                  <span key={i} className={i === 0 && repType === "sign-mag" ? "text-rose-500" : "text-slate-800"}>{b}</span>
                ))}
              </div>
              {repType === "sign-mag" && <div className="text-[9px] text-slate-400 mt-1"><span className="text-rose-500">sign bit</span> | magnitude</div>}
            </div>
            <div className="bg-slate-50 rounded-xl p-4 text-center">
              <div className="text-[10px] font-bold text-slate-400 mb-1.5">Hexadecimal</div>
              <div className="font-mono text-xl font-bold text-slate-800">0x{encodedHex}</div>
            </div>
            <div className="bg-slate-50 rounded-xl p-4 text-center">
              <div className="text-[10px] font-bold text-slate-400 mb-1.5">Decoded Value</div>
              <div className={`font-mono text-xl font-bold ${decoded === numVal ? "text-emerald-600" : "text-rose-600"}`}>
                {decoded} {decoded !== numVal && <span className="text-[10px]">(round-trip error)</span>}
              </div>
            </div>
          </div>
        </div>
      </Section>

      <Section title="Representation Methods">
        <div className="grid sm:grid-cols-3 gap-4 mb-4">
          {REP_TYPES.map((r, i) => (
            <div key={i} className={`bg-white rounded-xl border-2 p-4 shadow-sm ${repType === r.key ? "border-cyan-400 ring-1 ring-cyan-200" : "border-slate-200"}`}>
              <h4 className="text-sm font-bold text-slate-900 mb-2">{r.label}</h4>
              <p className="text-xs text-slate-500 mb-3">{r.desc}</p>
              {r.key === "sign-mag" && (
                <div className="font-mono text-[10px] bg-slate-50 p-2 rounded space-y-0.5">
                  <p>+5 = <span className="text-rose-500">0</span>101</p>
                  <p>-5 = <span className="text-rose-500">1</span>101</p>
                </div>
              )}
              {r.key === "ones-comp" && (
                <div className="font-mono text-[10px] bg-slate-50 p-2 rounded space-y-0.5">
                  <p>+5 = 0101</p>
                  <p>-5 = 1010 (flip bits of +5)</p>
                </div>
              )}
              {r.key === "twos-comp" && (
                <div className="font-mono text-[10px] bg-slate-50 p-2 rounded space-y-0.5">
                  <p>+5 = 0101</p>
                  <p>-5 = 1011 (flip bits + 1)</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </Section>

      <Section title="Range of Representable Numbers">
        <div className="overflow-x-auto mb-4">
          <table className="w-full text-xs border-collapse">
            <thead><tr className="bg-slate-100"><th className="border border-slate-200 px-3 py-2 text-left">Representation</th><th className="border border-slate-200 px-3 py-2 text-center">4-bit</th><th className="border border-slate-200 px-3 py-2 text-center">8-bit</th><th className="border border-slate-200 px-3 py-2 text-center">16-bit</th><th className="border border-slate-200 px-3 py-2 text-left">Notes</th></tr></thead>
            <tbody>{RANGES.map((r, i) => (
              <tr key={i} className="hover:bg-slate-50">
                <td className="border border-slate-200 px-3 py-2 font-semibold">{r.type}</td>
                <td className="border border-slate-200 px-3 py-2 text-center font-mono">{r.n4}</td>
                <td className="border border-slate-200 px-3 py-2 text-center font-mono">{r.n8}</td>
                <td className="border border-slate-200 px-3 py-2 text-center font-mono">{r.n16}</td>
                <td className="border border-slate-200 px-3 py-2 text-slate-500 text-[10px]">{r.note}</td>
              </tr>
            ))}</tbody>
          </table>
        </div>
        <InfoCard title="Two's Complement Advantage" type="tip">
          Two&apos;s complement has only one zero (so +0 = -0), and addition/subtraction work identically for signed and unsigned numbers at the binary level. This is why all modern CPUs use two&apos;s complement.
        </InfoCard>
      </Section>

      <Section title="Addition &amp; Overflow Detection">
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm mb-4">
          <div className="flex flex-wrap items-end gap-3 mb-4">
            <div>
              <label className="text-xs font-semibold text-slate-600 block mb-1">A (4-bit binary):</label>
              <input value={addA} onChange={e => setAddA(e.target.value.replace(/[^01]/g, "").slice(0, 4))}
                className="border border-slate-300 rounded-lg px-3 py-2 text-sm font-mono w-20" />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-600 block mb-1">B (4-bit binary):</label>
              <input value={addB} onChange={e => setAddB(e.target.value.replace(/[^01]/g, "").slice(0, 4))}
                className="border border-slate-300 rounded-lg px-3 py-2 text-sm font-mono w-20" />
            </div>
            <button onClick={() => setShowAddStep(!showAddStep)}
              className="bg-cyan-600 text-white px-4 py-2 rounded-lg text-sm font-semibold cursor-pointer hover:bg-cyan-700 transition flex items-center gap-1.5">
              <Plus size={16} /> Add
            </button>
          </div>

          <div className="font-mono text-sm bg-slate-50 p-4 rounded-lg space-y-1">
            <p className="text-slate-400 text-xs">Two&apos;s complement addition</p>
            <p>  {addA} = {addResult.a}</p>
            <p>+ {addB} = {addResult.b}</p>
            <p className="border-t border-slate-300 pt-1 font-bold text-slate-900">
              {addResult.sumBin} = {addResult.sum}
            </p>
            {addResult.overflow && (
              <p className="text-rose-600 text-xs font-semibold flex items-center gap-1 mt-1">
                <AlertTriangle size={12} /> Overflow detected! Signs of A and B match but result sign differs.
              </p>
            )}
            {!addResult.overflow && (
              <p className="text-emerald-600 text-xs mt-1">No overflow. ✓</p>
            )}
          </div>
        </div>

        <InfoCard title="Overflow Detection Rule" type="warning">
          In two&apos;s complement, overflow occurs when the carry into the sign bit differs from the carry out of the sign bit. A simpler check: if two positive numbers produce a negative result, or two negatives produce a positive result, overflow has occurred.
        </InfoCard>
      </Section>

      <Section title="Detailed Comparison Table (4-bit)">
        <div className="overflow-x-auto mb-4">
          <table className="w-full text-xs border-collapse">
            <thead><tr className="bg-slate-100"><th className="border border-slate-200 px-3 py-2">Decimal</th><th className="border border-slate-200 px-3 py-2">Sign-Mag</th><th className="border border-slate-200 px-3 py-2">One&apos;s Comp</th><th className="border border-slate-200 px-3 py-2 bg-cyan-100">Two&apos;s Comp</th></tr></thead>
            <tbody>
              {[7,6,5,4,3,2,1,0,-0,-1,-2,-3,-4,-5,-6,-7,-8].filter(v => {
                const sm = v >= -7 && v <= 7;
                const oc = v >= -7 && v <= 7;
                const tc = v >= -8 && v <= 7;
                return sm || oc || tc;
              }).map((v) => (
                <tr key={v} className="hover:bg-slate-50">
                  <td className="border border-slate-200 px-3 py-1.5 font-semibold">{v}</td>
                  <td className="border border-slate-200 px-3 py-1.5 font-mono text-center">{v >= -7 && v <= 7 ? encode(v, 4, "sign-mag") : "—"}</td>
                  <td className="border border-slate-200 px-3 py-1.5 font-mono text-center">{v >= -7 && v <= 7 ? encode(v, 4, "ones-comp") : "—"}</td>
                  <td className="border border-slate-200 px-3 py-1.5 font-mono text-center bg-cyan-50">{v >= -8 && v <= 7 ? encode(v, 4, "twos-comp") : "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Section title="Code Example">
        <CodeBlock code={`def twos_complement(val: int, bits: int = 8) -> str:
    """Convert signed integer to two's complement binary string."""
    mask = (1 << bits) - 1
    masked = val & mask if val < 0 else val
    return format(masked, f'0{bits}b')

def from_twos_complement(bin_str: str) -> int:
    """Convert two's complement binary string to signed integer."""
    bits = len(bin_str)
    val = int(bin_str, 2)
    if bin_str[0] == '1':
        val -= (1 << bits)
    return val

def detect_overflow(a_bin: str, b_bin: str, result_bin: str) -> bool:
    """Detect signed overflow in two's complement addition."""
    a_sign, b_sign, r_sign = a_bin[0], b_bin[0], result_bin[0]
    return a_sign == b_sign and a_sign != r_sign

# Examples
print(twos_complement(-5, 4))           # 1011
print(from_twos_complement("1011"))      # -5
print(detect_overflow("0111", "0010", "1001"))  # True (7+2=-7)`} language="python" />
      </Section>

      <Section title="Interview Questions">
        <InterviewQuestion question="Why do most computers use two's complement instead of sign-magnitude?" answer="Two's complement has several advantages: (1) only one representation for zero, avoiding the ambiguity of +0 and -0; (2) addition and subtraction hardware works identically for signed and unsigned numbers; (3) the ALU doesn't need special logic for signed operations; (4) the asymmetric range gives one extra negative value (-2^{n-1})." />
        <InterviewQuestion question="How do you negate a number in two's complement?" answer="To negate a two's complement number, invert all bits (bitwise NOT) and add 1. This is equivalent to taking the one's complement and adding 1. For example, +5 (0101) becomes -5: invert to 1010, add 1 → 1011." />
        <InterviewQuestion question="What is the range of signed numbers in 8-bit two's complement and why is it asymmetric?" answer="8-bit two's complement ranges from -128 to +127. It is asymmetric because zero takes one slot in the positive range. With 8 bits there are 2^8 = 256 possible values. If one is zero, the remaining 255 are split between negative and positive. Since the MSB is the sign bit, -128 (10000000) is a valid value with no positive counterpart." />
      </Section>
    </div>
  );
}
