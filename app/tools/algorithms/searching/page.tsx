"use client";

import { useState } from "react";
import Link from "next/link";
import { Home, ChevronRight } from "lucide-react";
import { Section, ComplexityBadge, CodeBlock, InfoCard, StepByStepBreakdown, VisualAnimationContainer, InterviewQuestions, AlgorithmCard } from "../components";

const SEARCHING_ALGORITHMS = [
  {
    id: "linear-search",
    name: "Linear Search",
    description: "Check each element sequentially until found. Works on unsorted arrays.",
    complexity: { time: "O(n)", space: "O(1)" },
    featured: false,
    code: `def linearSearch(arr, target):
    for i in range(len(arr)):
        if arr[i] == target:
            return i
    return -1`,
  },
  {
    id: "binary-search",
    name: "Binary Search",
    description: "Efficiently search sorted arrays by eliminating half the search space each iteration",
    complexity: { time: "O(log n)", space: "O(1)" },
    featured: true,
    code: `def binarySearch(arr, target):
    left, right = 0, len(arr) - 1
    while left <= right:
        mid = (left + right) // 2
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    return -1`,
  },
  {
    id: "jump-search",
    name: "Jump Search",
    description: "Jump ahead in blocks, then linear search within a block",
    complexity: { time: "O(√n)", space: "O(1)" },
    featured: false,
    code: `import math
def jumpSearch(arr, target):
    n = len(arr)
    step = int(math.sqrt(n))
    prev = 0
    while arr[min(step, n) - 1] < target:
        prev = step
        step += int(math.sqrt(n))
        if prev >= n:
            return -1
    for i in range(prev, min(step, n)):
        if arr[i] == target:
            return i
    return -1`,
  },
];

const MISTAKES = [
  "Using binary search on unsorted arrays - always verify array is sorted first",
  "Off-by-one errors in binary search - be careful with mid calculation and boundary updates",
  "Not handling edge cases: empty array, single element, element not found",
  "Forgetting that binary search requires O(log n) space with recursion - use iteration for O(1) space",
  "Comparing binary search with data structures like hash tables that can search in O(1) average",
];

export default function SearchingPage() {
  const [selectedAlgo, setSelectedAlgo] = useState("linear-search");
  const algo = SEARCHING_ALGORITHMS.find((a) => a.id === selectedAlgo)!;

  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      <div className="flex items-center gap-2 mb-6 text-xs text-slate-500">
        <Link href="/tools/algorithms" className="text-indigo-600 no-underline flex items-center gap-1.5 hover:text-indigo-800 transition">
          <Home size={16} /> Algorithms
        </Link>
        <ChevronRight size={16} />
        <span className="text-slate-900 font-semibold">Searching Algorithms</span>
      </div>

      <div className="mb-10">
        <h1 className="text-4xl font-extrabold text-slate-900 mb-3">🔍 Searching Algorithms</h1>
        <p className="text-base text-slate-500 leading-relaxed max-w-xl">
          Find elements efficiently in data structures. From simple linear search to logarithmic binary search, understand the techniques that power search engines and databases.
        </p>
      </div>

      <Section title="Overview">
        <InfoCard title="What are Searching Algorithms?" type="info">
          Searching algorithms locate specific elements in data structures. The efficiency depends on whether data is sorted and how much space you can use. Binary search is the gold standard for sorted data.
        </InfoCard>
        
        <div className="bg-white rounded-xl border border-slate-200 p-6 mb-4">
          <h3 className="text-base font-bold text-slate-900 mb-4">Key Searching Algorithms</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {SEARCHING_ALGORITHMS.map((algo) => (
              <AlgorithmCard
                key={algo.id}
                title={algo.name}
                description={algo.description}
                complexity={algo.complexity}
                featured={algo.featured}
              />
            ))}
          </div>
        </div>
      </Section>

      <Section title="Interactive Visualizer">
        <div className="flex gap-2 flex-wrap mb-5">
          {SEARCHING_ALGORITHMS.map((a) => (
            <button
              key={a.id}
              onClick={() => setSelectedAlgo(a.id)}
              className={`px-4 py-2.5 rounded-lg text-xs font-medium cursor-pointer transition-all ${
                selectedAlgo === a.id
                  ? "bg-indigo-50 text-indigo-600 border-2 border-indigo-500"
                  : "bg-white text-slate-500 border border-slate-200 hover:border-indigo-400"
              }`}
            >
              {a.name}
            </button>
          ))}
        </div>

        <VisualAnimationContainer title="Algorithm Visualization">
          <div className="bg-slate-50 rounded-lg p-10 text-center text-slate-500 h-[300px] flex items-center justify-center flex-col">
            <div className="text-5xl mb-3">🔍</div>
            <p className="mb-4">{algo.name} Visualizer</p>
            <p className="text-xs max-w-xs text-slate-400">
              Watch how the search traverses the array, highlighting comparisons and narrowing search space.
            </p>
          </div>
        </VisualAnimationContainer>

        <div className="bg-white rounded-xl border border-slate-200 p-5 grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <button className="py-2.5 bg-indigo-600 text-white border-none rounded-lg font-semibold cursor-pointer text-xs hover:bg-indigo-700 transition">
            Generate Array
          </button>
          <button className="py-2.5 bg-purple-600 text-white border-none rounded-lg font-semibold cursor-pointer text-xs hover:bg-purple-700 transition">
            Start Search
          </button>
          <input type="number" placeholder="Target value" className="p-2.5 border border-slate-200 rounded-lg text-xs" />
          <button className="py-2.5 bg-red-500 text-white border-none rounded-lg font-semibold cursor-pointer text-xs hover:bg-red-600 transition">
            Reset
          </button>
        </div>
      </Section>

      <Section title={`Deep Dive: ${algo.name}`}>
        <div className="grid sm:grid-cols-3 gap-4 mb-5">
          <div className="bg-white rounded-xl border border-slate-200 p-4">
            <h4 className="text-[10px] font-bold text-slate-400 uppercase mb-2 tracking-wider">Time Complexity</h4>
            <ComplexityBadge type="time" value={algo.complexity.time} />
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-4">
            <h4 className="text-[10px] font-bold text-slate-400 uppercase mb-2 tracking-wider">Space Complexity</h4>
            <ComplexityBadge type="space" value={algo.complexity.space} />
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-4">
            <h4 className="text-[10px] font-bold text-slate-400 uppercase mb-2 tracking-wider">Prerequisite</h4>
            <span className="text-xs text-slate-900 font-semibold">
              {selectedAlgo === "binary-search" || selectedAlgo === "jump-search" ? "Sorted Array" : "Any Array"}
            </span>
          </div>
        </div>

        <InfoCard title="Algorithm Approach" type="tip">
          {algo.description}
        </InfoCard>

        <StepByStepBreakdown
          steps={[
            { step: 1, title: "Initialize", desc: "Set up initial search boundaries or position based on algorithm requirements." },
            { step: 2, title: "Compare", desc: "Check current position(s) against target value." },
            { step: 3, title: "Narrow Search", desc: "Use comparison result to eliminate parts of search space or move to next position." },
            { step: 4, title: "Repeat", desc: "Continue until target is found or search space is exhausted." },
          ]}
        />

        <CodeBlock code={algo.code} language="python" />
      </Section>

      <Section title="Algorithm Comparison">
        <div className="overflow-x-auto">
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100 border-b-2 border-slate-200">
                <th className="p-3 text-left font-bold text-slate-900">Algorithm</th>
                <th className="p-3 text-left font-bold text-slate-900">Time</th>
                <th className="p-3 text-left font-bold text-slate-900">Space</th>
                <th className="p-3 text-left font-bold text-slate-900">Requires Sorted?</th>
                <th className="p-3 text-left font-bold text-slate-900">Best For</th>
              </tr>
            </thead>
            <tbody>
              {SEARCHING_ALGORITHMS.map((algo) => (
                <tr key={algo.id} className="border-b border-slate-200">
                  <td className="p-3 text-slate-900 font-semibold">{algo.name}</td>
                  <td className="p-3 text-slate-500">{algo.complexity.time}</td>
                  <td className="p-3 text-slate-500">{algo.complexity.space}</td>
                  <td className="p-3 text-slate-500">{algo.id === "linear-search" ? "No" : "Yes"}</td>
                  <td className="p-3 text-slate-500">
                    {algo.id === "linear-search" ? "Small/unsorted data" : algo.id === "binary-search" ? "Most sorted arrays" : "Large sorted arrays"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Section title="Interview Questions">
        <InterviewQuestions
          questions={[
            { q: "Why is binary search O(log n)?", a: "Binary search eliminates half the search space with each comparison. After k steps, search space is n/2^k. When this equals 1, we've found the answer: n/2^k = 1 means k = log₂(n)." },
            { q: "Can binary search work on unsorted arrays?", a: "No, binary search relies on the sorted property to make decisions about which half to eliminate. On unsorted data, those decisions are meaningless. Use linear search instead." },
            { q: "What's the difference between searching and sorting?", a: "Searching finds an element; sorting arranges all elements. Sorting is often a preprocessing step for efficient searching (binary search requires sorted data). Sorting is O(n log n) minimum, but enables O(log n) searches." },
            { q: "When would you use linear search over binary search?", a: "1) Data is unsorted and sorting cost is prohibitive, 2) Array is very small (linear search has better constants), 3) Only searching once (binary search cost not amortized), 4) Need to find all occurrences." },
          ]}
        />
      </Section>

      <Section title="Common Mistakes to Avoid">
        <div className="flex flex-col gap-3">
          {MISTAKES.map((mistake, i) => (
            <div key={i} className="bg-red-50 border-l-4 border-red-500 rounded-lg p-3 flex gap-3">
              <span className="text-red-700 text-lg shrink-0">⚠️</span>
              <p className="text-xs text-red-800 leading-relaxed">{mistake}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section title="What's Next?">
        <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-xl p-6 text-white">
          <h3 className="text-lg font-bold mb-3">Explore Related Topics</h3>
          <p className="text-white/90 mb-4 text-sm">Build on searching by learning:</p>
          <div className="grid sm:grid-cols-3 gap-3">
            {[
              { name: "Sorting Algorithms", href: "/tools/algorithms/sorting" },
              { name: "Hash Tables", href: "#" },
              { name: "Binary Search Trees", href: "/tools/algorithms/tree" },
            ].map((topic, i) => (
              <Link key={i} href={topic.href} className="no-underline">
                <button className="w-full bg-white/20 border border-white/30 text-white py-3 rounded-lg font-semibold text-xs cursor-pointer hover:bg-white/30 transition">
                  {topic.name} →
                </button>
              </Link>
            ))}
          </div>
        </div>
      </Section>
    </div>
  );
}
