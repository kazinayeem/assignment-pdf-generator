"use client";

import Link from "next/link";
import { Home, ChevronRight } from "lucide-react";

const SPACE_CATEGORIES = [
  {
    title: "O(1) - Constant Space",
    desc: "Fixed memory usage regardless of input size",
    color: "text-green-600 bg-green-50 border-green-200",
    examples: ["Variables, primitive types", "Iterative algorithms (binary search, linear search)", "In-place array operations", "Two-pointer techniques"],
  },
  {
    title: "O(log n) - Logarithmic Space",
    desc: "Memory grows logarithmically with input",
    color: "text-emerald-600 bg-emerald-50 border-emerald-200",
    examples: ["Recursive binary search (call stack depth)", "Quick sort recursion (average case)", "Divide and conquer algorithms", "Balanced tree recursion"],
  },
  {
    title: "O(n) - Linear Space",
    desc: "Memory grows proportionally to input",
    color: "text-amber-600 bg-amber-50 border-amber-200",
    examples: ["Arrays, lists, hash tables", "Merge sort auxiliary array", "DFS/BFS visited arrays", "Dynamic programming 1D tables"],
  },
  {
    title: "O(n²) - Quadratic Space",
    desc: "Memory grows quadratically",
    color: "text-red-600 bg-red-50 border-red-200",
    examples: ["2D DP tables (LCS, Edit Distance)", "Adjacency matrix for graphs", "Distance matrices", "Dynamic programming 2D tables"],
  },
];

const ALGORITHM_SPACE = [
  { algo: "Iterative Binary Search", space: "O(1)", why: "Only uses a few pointer variables regardless of array size" },
  { algo: "Recursive Binary Search", space: "O(log n)", why: "Call stack depth equals log n recursive calls" },
  { algo: "Merge Sort", space: "O(n)", why: "Needs auxiliary array of size n for merging" },
  { algo: "Quick Sort", space: "O(log n)", why: "Recursion depth is log n in average case" },
  { algo: "Heap Sort", space: "O(1)", why: "Sorts in-place; only uses a few variables" },
  { algo: "Bubble Sort", space: "O(1)", why: "In-place swapping; no extra memory" },
  { algo: "Linear Search", space: "O(1)", why: "Only uses loop counter variable" },
  { algo: "BFS (Graph)", space: "O(V)", why: "Queue may hold up to V vertices; visited array of size V" },
  { algo: "DFS (Graph)", space: "O(V)", why: "Recursion/stack depth up to V; visited array of size V" },
  { algo: "Dijkstra", space: "O(V)", why: "Distance array of size V; priority queue may hold V elements" },
  { algo: "Fibonacci (Tabulation)", space: "O(1)", why: "Only need last two values, not full array" },
  { algo: "LCS (Space Optimized)", space: "O(min(n,m))", why: "1D rolling array instead of 2D" },
  { algo: "Adjacency List", space: "O(V+E)", why: "List per vertex; total size is vertices + edges" },
  { algo: "Adjacency Matrix", space: "O(V²)", why: "V×V matrix regardless of edge count" },
];

export default function SpaceComplexityPage() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      <div className="flex items-center gap-2 mb-6 text-xs text-slate-500">
        <Link href="/tools/algorithms" className="text-indigo-600 no-underline flex items-center gap-1.5 hover:text-indigo-800 transition"><Home size={16} /> Algorithms</Link>
        <ChevronRight size={16} /><span className="text-slate-900 font-semibold">Space Complexity Guide</span>
      </div>

      <div className="mb-10">
        <h1 className="text-4xl font-extrabold text-slate-900 mb-3">💾 Space Complexity Guide</h1>
        <p className="text-base text-slate-500 leading-relaxed max-w-2xl">Understand memory usage patterns of algorithms. Learn how to analyze and optimize space complexity.</p>
      </div>

      {/* Space Categories */}
      <div className="grid sm:grid-cols-2 gap-5 mb-10">
        {SPACE_CATEGORIES.map((cat) => (
          <div key={cat.title} className={`rounded-2xl border-2 p-6 ${cat.color}`}>
            <h3 className="font-bold text-base mb-2">{cat.title}</h3>
            <p className="text-xs mb-4 opacity-80">{cat.desc}</p>
            <ul className="space-y-1.5">
              {cat.examples.map((ex, i) => (
                <li key={i} className="text-xs flex items-center gap-2">
                  <span className="w-1 h-1 rounded-full bg-current shrink-0" />
                  {ex}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Algorithm Space Table */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-10">
        <h2 className="text-xl font-bold text-slate-900 mb-5">Space Complexity of Common Algorithms</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100 border-b-2 border-slate-200">
                <th className="p-3 text-left font-bold text-slate-900">Algorithm</th>
                <th className="p-3 text-left font-bold text-slate-900">Space</th>
                <th className="p-3 text-left font-bold text-slate-900">Why?</th>
              </tr>
            </thead>
            <tbody>
              {ALGORITHM_SPACE.map((row, i) => (
                <tr key={i} className="border-b border-slate-200 hover:bg-slate-50">
                  <td className="p-3 font-semibold text-slate-900">{row.algo}</td>
                  <td className="p-3"><span className="font-mono font-bold text-purple-600">{row.space}</span></td>
                  <td className="p-3 text-slate-500">{row.why}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Optimization Tips */}
      <div className="bg-purple-50 border border-purple-200 rounded-2xl p-6 mb-10">
        <h2 className="text-lg font-bold text-purple-900 mb-4">🚀 Space Optimization Techniques</h2>
        <div className="space-y-4">
          <div className="flex gap-3">
            <span className="w-8 h-8 rounded-lg bg-purple-200 text-purple-700 flex items-center justify-center font-bold text-sm shrink-0">1</span>
            <div>
              <h4 className="font-semibold text-purple-900 text-sm">In-Place Algorithms</h4>
              <p className="text-xs text-purple-700 mt-0.5">Modify input directly instead of creating copies. Examples: heap sort, two-pointer techniques, array reversal.</p>
            </div>
          </div>
          <div className="flex gap-3">
            <span className="w-8 h-8 rounded-lg bg-purple-200 text-purple-700 flex items-center justify-center font-bold text-sm shrink-0">2</span>
            <div>
              <h4 className="font-semibold text-purple-900 text-sm">Rolling Arrays (Space-Optimized DP)</h4>
              <p className="text-xs text-purple-700 mt-0.5">When dp[i] depends on dp[i-1] only, use 1D array instead of 2D. Reduce O(n²) to O(n) or O(n) to O(1).</p>
            </div>
          </div>
          <div className="flex gap-3">
            <span className="w-8 h-8 rounded-lg bg-purple-200 text-purple-700 flex items-center justify-center font-bold text-sm shrink-0">3</span>
            <div>
              <h4 className="font-semibold text-purple-900 text-sm">Iterative vs Recursive</h4>
              <p className="text-xs text-purple-700 mt-0.5">Recursive solutions use call stack (O(depth) space). Iterative versions often use O(1) space. Convert recursion to iteration when possible.</p>
            </div>
          </div>
          <div className="flex gap-3">
            <span className="w-8 h-8 rounded-lg bg-purple-200 text-purple-700 flex items-center justify-center font-bold text-sm shrink-0">4</span>
            <div>
              <h4 className="font-semibold text-purple-900 text-sm">Choose Right Data Structure</h4>
              <p className="text-xs text-purple-700 mt-0.5">Adjacency list (O(V+E)) vs adjacency matrix (O(V²)). Linked list vs array. The right choice saves both time and space.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Key Takeaways */}
      <div className="bg-gradient-to-br from-purple-600 to-indigo-700 rounded-2xl p-6 text-white">
        <h3 className="text-lg font-bold mb-3">💡 Key Takeaways</h3>
        <ul className="space-y-2 text-sm text-white/90">
          <li className="flex gap-3"><span className="text-amber-300 shrink-0">→</span> Space complexity is often as important as time complexity, especially in memory-constrained environments.</li>
          <li className="flex gap-3"><span className="text-amber-300 shrink-0">→</span> Auxiliary space ≠ total space. Auxiliary space excludes input storage.</li>
          <li className="flex gap-3"><span className="text-amber-300 shrink-0">→</span> There&apos;s usually a time-space tradeoff: faster algorithms often use more memory.</li>
          <li className="flex gap-3"><span className="text-amber-300 shrink-0">→</span> Stack space matters! Deep recursion can cause stack overflow in languages with limited call stack.</li>
        </ul>
      </div>
    </div>
  );
}
