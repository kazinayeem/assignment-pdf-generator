"use client";

import Link from "next/link";
import { Home, ChevronRight } from "lucide-react";

const BIG_O_TABLE = [
  { notation: "O(1)", name: "Constant", desc: "Fixed time regardless of input size", examples: "Array access, hash lookup, stack push/pop" },
  { notation: "O(log n)", name: "Logarithmic", desc: "Time grows logarithmically with input", examples: "Binary search, balanced BST operations" },
  { notation: "O(n)", name: "Linear", desc: "Time grows proportionally to input", examples: "Linear search, array traversal, string comparison" },
  { notation: "O(n log n)", name: "Linearithmic", desc: "Combination of linear and logarithmic", examples: "Merge sort, heap sort, quick sort (avg)" },
  { notation: "O(n²)", name: "Quadratic", desc: "Time grows quadratically", examples: "Bubble sort, insertion sort, nested loops" },
  { notation: "O(2ⁿ)", name: "Exponential", desc: "Time doubles with each input addition", examples: "Fibonacci (naive), tower of Hanoi" },
  { notation: "O(n!)", name: "Factorial", desc: "Time grows factorially", examples: "Permutations, traveling salesman (naive)" },
];

const ALGORITHM_COMPLEXITIES = [
  { algo: "Array Access", best: "O(1)", average: "O(1)", worst: "O(1)", space: "O(1)" },
  { algo: "Binary Search", best: "O(1)", average: "O(log n)", worst: "O(log n)", space: "O(1)" },
  { algo: "Linear Search", best: "O(1)", average: "O(n)", worst: "O(n)", space: "O(1)" },
  { algo: "Bubble Sort", best: "O(n)", average: "O(n²)", worst: "O(n²)", space: "O(1)" },
  { algo: "Merge Sort", best: "O(n log n)", average: "O(n log n)", worst: "O(n log n)", space: "O(n)" },
  { algo: "Quick Sort", best: "O(n log n)", average: "O(n log n)", worst: "O(n²)", space: "O(log n)" },
  { algo: "Heap Sort", best: "O(n log n)", average: "O(n log n)", worst: "O(n log n)", space: "O(1)" },
  { algo: "Insertion Sort", best: "O(n)", average: "O(n²)", worst: "O(n²)", space: "O(1)" },
  { algo: "Selection Sort", best: "O(n²)", average: "O(n²)", worst: "O(n²)", space: "O(1)" },
  { algo: "BFS/DFS (Graph)", best: "O(V+E)", average: "O(V+E)", worst: "O(V+E)", space: "O(V)" },
  { algo: "Dijkstra", best: "O(V+E log V)", average: "O(V+E log V)", worst: "O(V+E log V)", space: "O(V)" },
  { algo: "Hash Table", best: "O(1)", average: "O(1)", worst: "O(n)", space: "O(n)" },
  { algo: "BST Operations", best: "O(log n)", average: "O(log n)", worst: "O(n)", space: "O(1)" },
];

export default function TimeComplexityPage() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      <div className="flex items-center gap-2 mb-6 text-xs text-slate-500">
        <Link href="/tools/algorithms" className="text-indigo-600 no-underline flex items-center gap-1.5 hover:text-indigo-800 transition"><Home size={16} /> Algorithms</Link>
        <ChevronRight size={16} /><span className="text-slate-900 font-semibold">Time Complexity Cheatsheet</span>
      </div>

      <div className="mb-10">
        <h1 className="text-4xl font-extrabold text-slate-900 mb-3">📊 Time Complexity Cheatsheet</h1>
        <p className="text-base text-slate-500 leading-relaxed max-w-2xl">Quick reference for Big O notation, algorithm complexities, and performance characteristics.</p>
      </div>

      {/* Big O Reference */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-10">
        <h2 className="text-xl font-bold text-slate-900 mb-5">Big O Notation Reference</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100 border-b-2 border-slate-200">
                <th className="p-3 text-left font-bold text-slate-900">Notation</th>
                <th className="p-3 text-left font-bold text-slate-900">Name</th>
                <th className="p-3 text-left font-bold text-slate-900">Description</th>
                <th className="p-3 text-left font-bold text-slate-900">Examples</th>
              </tr>
            </thead>
            <tbody>
              {BIG_O_TABLE.map((row) => (
                <tr key={row.notation} className="border-b border-slate-200 hover:bg-slate-50">
                  <td className="p-3 font-bold text-indigo-600 font-mono">{row.notation}</td>
                  <td className="p-3 text-slate-900 font-semibold">{row.name}</td>
                  <td className="p-3 text-slate-500">{row.desc}</td>
                  <td className="p-3 text-slate-500">{row.examples}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Growth Comparison */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-10">
        <h2 className="text-xl font-bold text-slate-900 mb-5">Growth Rate Comparison</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100 border-b-2 border-slate-200">
                <th className="p-3 text-left font-bold text-slate-900">n</th>
                <th className="p-3 text-left font-bold text-slate-900">O(1)</th>
                <th className="p-3 text-left font-bold text-slate-900">O(log n)</th>
                <th className="p-3 text-left font-bold text-slate-900">O(n)</th>
                <th className="p-3 text-left font-bold text-slate-900">O(n log n)</th>
                <th className="p-3 text-left font-bold text-slate-900">O(n²)</th>
                <th className="p-3 text-left font-bold text-slate-900">O(2ⁿ)</th>
              </tr>
            </thead>
            <tbody>
              {[
                { n: "10", c1: "1", log: "3", n: "10", nlogn: "30", n2: "100", exp: "1,024" },
                { n: "100", c1: "1", log: "7", n: "100", nlogn: "700", n2: "10,000", exp: "1.27×10³⁰" },
                { n: "1,000", c1: "1", log: "10", n: "1,000", nlogn: "10,000", n2: "1,000,000", exp: "—" },
                { n: "10,000", c1: "1", log: "13", n: "10,000", nlogn: "130,000", n2: "100M", exp: "—" },
              ].map((row, i) => (
                <tr key={i} className="border-b border-slate-200">
                  <td className="p-3 font-bold text-slate-900">{row.n}</td>
                  <td className="p-3 text-green-600 font-semibold">{row.c1}</td>
                  <td className="p-3 text-emerald-600 font-semibold">{row.log}</td>
                  <td className="p-3 text-amber-600 font-semibold">{row.n}</td>
                  <td className="p-3 text-orange-600 font-semibold">{row.nlogn}</td>
                  <td className="p-3 text-red-500 font-semibold">{row.n2}</td>
                  <td className="p-3 text-red-700 font-semibold">{row.exp}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Algorithm Complexities */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-10">
        <h2 className="text-xl font-bold text-slate-900 mb-5">Common Algorithm Complexities</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100 border-b-2 border-slate-200">
                <th className="p-3 text-left font-bold text-slate-900">Algorithm</th>
                <th className="p-3 text-left font-bold text-slate-900">Best</th>
                <th className="p-3 text-left font-bold text-slate-900">Average</th>
                <th className="p-3 text-left font-bold text-slate-900">Worst</th>
                <th className="p-3 text-left font-bold text-slate-900">Space</th>
              </tr>
            </thead>
            <tbody>
              {ALGORITHM_COMPLEXITIES.map((row, i) => (
                <tr key={i} className="border-b border-slate-200 hover:bg-slate-50">
                  <td className="p-3 font-semibold text-slate-900">{row.algo}</td>
                  <td className="p-3 text-green-600 font-mono">{row.best}</td>
                  <td className="p-3 text-slate-700 font-mono">{row.average}</td>
                  <td className="p-3 text-red-500 font-mono">{row.worst}</td>
                  <td className="p-3 text-purple-600 font-mono">{row.space}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Tips */}
      <div className="bg-indigo-50 border border-indigo-200 rounded-2xl p-6">
        <h2 className="text-lg font-bold text-indigo-900 mb-4">💡 Quick Tips</h2>
        <ul className="space-y-3 text-sm text-indigo-800">
          <li className="flex gap-3"><span className="font-bold shrink-0">1.</span> Always consider input constraints when choosing algorithms. n ≤ 20 may allow O(2ⁿ), but n ≥ 10⁶ needs O(n) or better.</li>
          <li className="flex gap-3"><span className="font-bold shrink-0">2.</span> O(n log n) is often considered the "gold standard" for sorting - much faster than O(n²) for large inputs.</li>
          <li className="flex gap-3"><span className="font-bold shrink-0">3.</span> Space-time tradeoff: sometimes using O(n) extra space can reduce time complexity significantly (e.g., hash tables).</li>
          <li className="flex gap-3"><span className="font-bold shrink-0">4.</span> Best case complexity is rarely useful - focus on average and worst-case performance.</li>
          <li className="flex gap-3"><span className="font-bold shrink-0">5.</span> Constants matter! O(100n) is still O(n), but an O(n) algorithm with high constant may be slower than O(n log n) for practical inputs.</li>
        </ul>
      </div>
    </div>
  );
}
