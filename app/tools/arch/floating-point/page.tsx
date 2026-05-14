"use client";

import { useState } from "react";
import Link from "next/link";
import { Home, ChevronRight } from "lucide-react";
import { Section, InfoCard, CodeBlock, Diagram, InterviewQuestion } from "../components";

function ieee754repr(f: number): { sign: number; exp: number; mant: string; hex: string; binary: string } {
  const buf = new ArrayBuffer(4);
  const view = new DataView(buf);
  view.setFloat32(0, f, false);
  const bits = view.getUint32(0, false);
  const sign = (bits >> 31) & 1;
  const exp = (bits >> 23) & 0xff;
  const mant = bits & 0x7fffff;
  return {
    sign,
    exp,
    mant: mant.toString(2).padStart(23, "0"),
    hex: "0x" + bits.toString(16).toUpperCase().padStart(8, "0"),
    binary: bits.toString(2).padStart(32, "0"),
  };
}

const SPECIAL_VALS = [
  { label: "+0", hex: "0x00000000", exp: "00", mant: "000...000" },
  { label: "-0", hex: "0x80000000", exp: "00", mant: "000...000" },
  { label: "+∞", hex: "0x7F800000", exp: "FF", mant: "000...000" },
  { label: "-∞", hex: "0xFF800000", exp: "FF", mant: "000...000" },
  { label: "NaN", hex: "0x7FC00000", exp: "FF", mant: "100...000" },
  { label: "Max Normal", hex: "0x7F7FFFFF", exp: "FE", mant: "111...111" },
  { label: "Min Normal", hex: "0x00800000", exp: "01", mant: "000...000" },
  { label: "Denorm Min", hex: "0x00000001", exp: "00", mant: "000...001" },
];

export default function FloatingPointPage() {
  const [inputVal, setInputVal] = useState("42.5");
  const [parsed, setParsed] = useState<number>(42.5);
  const handleConvert = () => {
    const v = parseFloat(inputVal);
    if (!isNaN(v)) setParsed(v);
  };

  const repr = ieee754repr(parsed);
  const isSpecial = repr.exp === 0 || repr.exp === 0xff;
  const actualVal = isSpecial
    ? repr.exp === 0xff
      ? repr.mant === "0".repeat(23) ? (repr.sign ? "-Infinity" : "+Infinity") : "NaN"
      : "Denormalized"
    : null;

  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      <div className="flex items-center gap-2 mb-6 text-xs text-slate-500">
        <Link href="/tools/arch" className="text-cyan-600 no-underline flex items-center gap-1.5 hover:text-cyan-800 transition">
          <Home size={16} /> Architecture
        </Link>
        <ChevronRight size={16} />
        <span className="text-slate-900 font-semibold">Floating Point Arithmetic</span>
      </div>

      <div className="mb-10">
        <h1 className="text-4xl font-extrabold text-slate-900 mb-3">🔢 Floating Point Arithmetic</h1>
        <p className="text-base text-slate-500 leading-relaxed max-w-xl">
          IEEE 754 standard for representing and computing with real numbers in binary. Single precision (32-bit) and double precision (64-bit) formats.
        </p>
      </div>

      <Section title="IEEE 754 Single Precision Format">
        <InfoCard title="The Standard" type="info">
          IEEE 754 is the universal standard for floating-point computation. Single precision uses 32 bits: 1 sign bit, 8 exponent bits (biased by 127), and 23 mantissa bits (with implicit leading 1 for normalized numbers).
        </InfoCard>
        <Diagram title="32-bit Floating Point Layout">
          <div className="flex w-full max-w-lg mb-4">
            <div className="bg-rose-100 border-2 border-rose-400 rounded-lg p-2 text-center flex-1">
              <div className="font-mono text-lg font-bold text-rose-700">S</div>
              <div className="text-[9px] text-rose-500">1 bit</div>
              <div className="text-[8px] text-rose-400 mt-1">bit 31</div>
            </div>
            <div className="bg-blue-100 border-2 border-blue-400 rounded-lg p-2 text-center flex-[2] mx-1">
              <div className="font-mono text-lg font-bold text-blue-700">Exponent</div>
              <div className="text-[9px] text-blue-500">8 bits</div>
              <div className="text-[8px] text-blue-400 mt-1">bits 30-23</div>
            </div>
            <div className="bg-emerald-100 border-2 border-emerald-400 rounded-lg p-2 text-center flex-[3]">
              <div className="font-mono text-lg font-bold text-emerald-700">Mantissa / Fraction</div>
              <div className="text-[9px] text-emerald-500">23 bits</div>
              <div className="text-[8px] text-emerald-400 mt-1">bits 22-0</div>
            </div>
          </div>
          <div className="text-xs text-slate-500 leading-relaxed text-center">
            <strong>Value</strong> = (-1)^S × 2^(E-127) × 1.M &nbsp;|&nbsp; <strong>Bias</strong> = 127<br />
            Range: ±1.18×10⁻³⁸ to ±3.4×10³⁸ &nbsp;|&nbsp; Precision: ~7 decimal digits
          </div>
        </Diagram>
      </Section>

      <Section title="Interactive IEEE 754 Converter">
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <div className="flex items-end gap-3 mb-5">
            <div className="flex-1">
              <label className="text-xs font-semibold text-slate-600 block mb-1">Enter a decimal number:</label>
              <input value={inputVal} onChange={e => setInputVal(e.target.value)}
                className="border border-slate-300 rounded-lg px-3 py-2 text-sm w-full font-mono" />
            </div>
            <button onClick={handleConvert}
              className="bg-cyan-600 text-white px-5 py-2 rounded-lg text-sm font-semibold cursor-pointer hover:bg-cyan-700 transition">
              Convert
            </button>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="bg-slate-50 rounded-lg p-3">
                <div className="text-[10px] font-bold text-slate-400 mb-1">Full 32-bit Binary</div>
                <div className="font-mono text-sm tracking-wider">
                  <span className="text-rose-600 font-bold">{repr.binary[0]}</span>
                  <span className="text-blue-600">{repr.binary.slice(1, 9)}</span>
                  <span className="text-emerald-600">{repr.binary.slice(9)}</span>
                </div>
                <div className="flex gap-4 text-[9px] text-slate-400 mt-1">
                  <span className="text-rose-600">Sign</span>
                  <span className="text-blue-600">Exponent</span>
                  <span className="text-emerald-600">Mantissa</span>
                </div>
              </div>
              <div className="bg-slate-50 rounded-lg p-3">
                <div className="text-[10px] font-bold text-slate-400 mb-1">Hex</div>
                <div className="font-mono text-sm font-bold text-slate-800">{repr.hex}</div>
              </div>
            </div>
            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-2">
                {[
                  { label: "Sign", val: repr.sign, cls: "text-rose-600" },
                  { label: "Exponent", val: repr.exp, cls: "text-blue-600" },
                  { label: "Bias Adj", val: repr.exp - 127, cls: "text-blue-600" },
                ].map((f, i) => (
                  <div key={i} className="bg-slate-50 rounded-lg p-2.5 text-center">
                    <div className="text-[9px] text-slate-400 mb-0.5">{f.label}</div>
                    <div className={`font-mono text-base font-bold ${f.cls}`}>{f.val}</div>
                  </div>
                ))}
              </div>
              {actualVal && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-2.5 text-center">
                  <span className="text-[10px] font-semibold text-amber-700">{actualVal}</span>
                </div>
              )}
              {!actualVal && (
                <div className="bg-slate-50 rounded-lg p-2.5">
                  <div className="text-[10px] font-bold text-slate-400 mb-1">Normalized Representation</div>
                  <div className="font-mono text-xs text-slate-600">
                    (-1)^{repr.sign} × 2^({repr.exp - 127}) × 1.{repr.mant.slice(0, 8)}...
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </Section>

      <Section title="Special Values">
        <div className="overflow-x-auto mb-4">
          <table className="w-full text-xs border-collapse">
            <thead><tr className="bg-slate-100"><th className="border border-slate-200 px-3 py-2">Value</th><th className="border border-slate-200 px-3 py-2">Hex</th><th className="border border-slate-200 px-3 py-2">Sign</th><th className="border border-slate-200 px-3 py-2">Exp</th><th className="border border-slate-200 px-3 py-2">Mantissa</th><th className="border border-slate-200 px-3 py-2">Meaning</th></tr></thead>
            <tbody>
              {SPECIAL_VALS.map((v, i) => (
                <tr key={i} className="hover:bg-slate-50">
                  <td className="border border-slate-200 px-3 py-2 font-semibold">{v.label}</td>
                  <td className="border border-slate-200 px-3 py-2 font-mono">{v.hex}</td>
                  <td className="border border-slate-200 px-3 py-2 text-center font-mono">{v.label.startsWith("-") ? "1" : v.label === "NaN" ? "0/1" : "0"}</td>
                  <td className="border border-slate-200 px-3 py-2 text-center font-mono">{v.exp}</td>
                  <td className="border border-slate-200 px-3 py-2 font-mono text-[9px]">{v.mant}</td>
                  <td className="border border-slate-200 px-3 py-2 text-slate-500">{i < 2 ? "Zero" : i < 4 ? "Infinity" : i === 4 ? "Not a Number" : i < 7 ? "Normal" : "Denormalized"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <InfoCard title="Special Case Rules" type="warning">
          <ul className="list-disc pl-4 space-y-0.5 text-xs">
            <li><strong>Zero (E=0, M=0)</strong>: Signed zero exists (+0 and -0)</li>
            <li><strong>Infinity (E=255, M=0)</strong>: Represents overflow or division by zero</li>
            <li><strong>NaN (E=255, M≠0)</strong>: Result of invalid operations (0/0, ∞-∞)</li>
            <li><strong>Denormalized (E=0, M≠0)</strong>: Gradual underflow; implicit leading 0 instead of 1</li>
          </ul>
        </InfoCard>
      </Section>

      <Section title="Floating Point Addition">
        <p className="text-sm text-slate-600 leading-relaxed mb-4">
          Adding two floating-point numbers requires aligning exponents, adding significands, then normalizing the result.
        </p>
        <Diagram title="Addition Steps">
          <div className="flex flex-wrap justify-center gap-3">
            {[
              { n: "1", t: "Align", d: "Shift smaller exponent to match larger" },
              { n: "2", t: "Add", d: "Add significands (with hidden bit)" },
              { n: "3", t: "Normalize", d: "Shift result and adjust exponent" },
              { n: "4", t: "Round", d: "Round to fit 23-bit mantissa" },
              { n: "5", t: "Check", d: "Check for overflow/underflow" },
            ].map((s, i) => (
              <div key={i} className="bg-gradient-to-br from-cyan-50 to-white border-2 border-cyan-500 rounded-xl p-3 text-center min-w-[80px]">
                <div className="bg-cyan-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold mx-auto mb-1.5">{s.n}</div>
                <h4 className="text-[10px] font-bold text-cyan-700">{s.t}</h4>
                <p className="text-[8px] text-slate-500 mt-0.5">{s.d}</p>
              </div>
            ))}
          </div>
        </Diagram>
        <div className="font-mono text-xs bg-slate-50 p-4 rounded-xl space-y-1 leading-relaxed">
          <p className="text-slate-400 mb-1">Example: 42.5 + 3.75</p>
          <p className="text-slate-600">42.5 = 1.010101 × 2⁵ → E=132(5+127), M=0101010...</p>
          <p className="text-slate-600">3.75 = 1.111 × 2¹ → align: shift right 4 → 0.0001111 × 2⁵</p>
          <p className="text-slate-600">Sum: 1.010101 + 0.0001111 = 1.0111001 × 2⁵</p>
          <p className="font-bold text-slate-800">Result: 0 10000100 0111001000... = 46.25 (hex: 0x42390000)</p>
        </div>
      </Section>

      <Section title="Code Example">
        <CodeBlock code={`import struct

def float_to_ieee754(f: float) -> dict:
    """Convert a Python float to IEEE 754 single precision representation."""
    bits = struct.pack('>f', f)
    binary = ''.join(f'{b:08b}' for b in bits)
    hex_str = bits.hex().upper()
    
    sign = int(binary[0])
    exp = int(binary[1:9], 2)
    mant = binary[9:]
    
    if exp == 0 and int(mant) == 0:
        desc = "Zero"
    elif exp == 255 and int(mant) == 0:
        desc = "Infinity"
    elif exp == 255:
        desc = "NaN"
    elif exp == 0:
        desc = f"Denormalized: (-1)^{sign} × 2^{-126} × 0.{mant}"
    else:
        desc = f"Normal: (-1)^{sign} × 2^{exp-127} × 1.{mant}"
    
    return {
        "sign": sign, "exponent": exp, "mantissa": mant,
        "binary": binary, "hex": f"0x{hex_str}", "description": desc
    }

# Example
print(float_to_ieee754(-3.14))
# Output: sign=1, exponent=128, mantissa=100100011110...`} language="python" />
      </Section>

      <Section title="Interview Questions">
        <InterviewQuestion question="What is the IEEE 754 bias and why is it used?" answer="The exponent in IEEE 754 uses a bias of 127 (single) or 1023 (double) to represent both positive and negative exponents without a sign bit. This allows simpler comparison of floating-point numbers as integer bit patterns. The actual exponent is stored_exponent - bias." />
        <InterviewQuestion question="Explain the difference between normalized and denormalized numbers." answer="Normalized numbers have an implicit leading 1 before the binary point (1.M), while denormalized numbers have an implicit leading 0 (0.M). Denormals allow gradual underflow to zero, filling the gap between the smallest normal number and zero. They trade precision for the ability to represent extremely small values." />
        <InterviewQuestion question="What causes floating point precision errors and how can they be mitigated?" answer="Floating point errors occur because not all decimal fractions have exact binary representations (e.g., 0.1). Operations accumulate rounding errors. Mitigation: use double precision, avoid equality comparisons, use epsilon tolerances, consider decimal arithmetic (e.g., Python's Decimal module) for financial calculations." />
      </Section>
    </div>
  );
}
