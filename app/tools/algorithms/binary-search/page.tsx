"use client";

import { useState } from "react";
import Link from "next/link";
import { Home, ChevronRight } from "lucide-react";
import { Section, ComplexityBadge, CodeBlock, InfoCard, StepByStepBreakdown, VisualAnimationContainer, InterviewQuestions, AlgorithmCard } from "../components";

const VARIATIONS = [
  {
    id: "basic-binary-search",
    name: "Basic Binary Search",
    description: "Find exact element in sorted array. Return index if found, -1 otherwise.",
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
    id: "first-occurrence",
    name: "First Occurrence",
    description: "Find first occurrence of target in array with duplicates",
    complexity: { time: "O(log n)", space: "O(1)" },
    featured: false,
    code: `def findFirst(arr, target):
    left, right = 0, len(arr) - 1
    result = -1
    while left <= right:
        mid = (left + right) // 2
        if arr[mid] == target:
            result = mid
            right = mid - 1
        elif arr[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    return result`,
  },
  {
    id: "search-rotated",
    name: "Search in Rotated Array",
    description: "Find element in rotated sorted array without duplicates",
    complexity: { time: "O(log n)", space: "O(1)" },
    featured: false,
    code: `def searchRotated(arr, target):
    left, right = 0, len(arr) - 1
    while left <= right:
        mid = (left + right) // 2
        if arr[mid] == target:
            return mid
        if arr[left] <= arr[mid]:
            if arr[left] <= target < arr[mid]:
                right = mid - 1
            else:
                left = mid + 1
        else:
            if arr[mid] < target <= arr[right]:
                left = mid + 1
            else:
                right = mid - 1
    return -1`,
  },
];

const PROBLEMS = [
  { problem: "Find First/Last Position", difficulty: "Medium", pattern: "Adjust conditions to find first/last occurrence" },
  { problem: "Search in Rotated Array", difficulty: "Medium", pattern: "Identify which half is sorted, adjust search" },
  { problem: "Find Peak Element", difficulty: "Medium", pattern: "Use binary search to find peak (max element)" },
  { problem: "Search Insert Position", difficulty: "Easy", pattern: "Return position where target should be inserted" },
  { problem: "Koko Eating Bananas", difficulty: "Medium", pattern: "Binary search on answer space (speed)" },
  { problem: "Capacity to Ship", difficulty: "Medium", pattern: "Binary search on weight capacity" },
];

export default function BinarySearchPage() {
  const [selected, setSelected] = useState("basic-binary-search");
  const algo = VARIATIONS.find((a) => a.id === selected)!;

  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      <div className="flex items-center gap-2 mb-6 text-xs text-slate-500">
        <Link href="/tools/algorithms" className="text-indigo-600 no-underline flex items-center gap-1.5 hover:text-indigo-800 transition">
          <Home size={16} /> Algorithms
        </Link>
        <ChevronRight size={16} />
        <span className="text-slate-900 font-semibold">Binary Search</span>
      </div>

      <div className="mb-10">
        <h1 className="text-4xl font-extrabold text-slate-900 mb-3">🎯 Binary Search</h1>
        <p className="text-base text-slate-500 leading-relaxed max-w-xl">
          The king of logarithmic algorithms. Master binary search and its variations for lightning-fast searches in sorted data.
        </p>
      </div>

      <Section title="Overview">
        <InfoCard title="Why Binary Search?" type="info">
          Linear search is O(n). Binary search is O(log n). For a million elements, binary search needs only 20 comparisons vs 500,000! It's the foundation for efficient searching in databases, file systems, and competitive programming.
        </InfoCard>
        
        <div className="bg-white rounded-xl border border-slate-200 p-6 mb-4">
          <h3 className="text-base font-bold text-slate-900 mb-4">Key Binary Search Variations</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {VARIATIONS.map((algo) => (
              <AlgorithmCard key={algo.id} title={algo.name} description={algo.description} complexity={algo.complexity} featured={algo.featured} />
            ))}
          </div>
        </div>
      </Section>

      <Section title="Interactive Visualizer">
        <div className="flex gap-2 flex-wrap mb-5">
          {VARIATIONS.map((a) => (
            <button key={a.id} onClick={() => setSelected(a.id)}
              className={`px-4 py-2.5 rounded-lg text-xs font-medium cursor-pointer transition-all ${
                selected === a.id ? "bg-indigo-50 text-indigo-600 border-2 border-indigo-500" : "bg-white text-slate-500 border border-slate-200 hover:border-indigo-400"
              }`}>{a.name}</button>
          ))}
        </div>

        <VisualAnimationContainer title="Binary Search Visualization">
          <div className="bg-slate-50 rounded-lg p-10 text-center text-slate-500 h-[300px] flex items-center justify-center flex-col">
            <div className="text-5xl mb-3">🎯</div>
            <p className="mb-4">{algo.name} Visualizer</p>
            <p className="text-xs max-w-xs text-slate-400">Watch the algorithm eliminate half the search space with each step.</p>
          </div>
        </VisualAnimationContainer>

        <div className="bg-white rounded-xl border border-slate-200 p-5 grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <button className="py-2.5 bg-indigo-600 text-white border-none rounded-lg font-semibold cursor-pointer text-xs hover:bg-indigo-700 transition">Generate Array</button>
          <button className="py-2.5 bg-purple-600 text-white border-none rounded-lg font-semibold cursor-pointer text-xs hover:bg-purple-700 transition">Start Search</button>
          <input type="number" placeholder="Search value" className="p-2.5 border border-slate-200 rounded-lg text-xs" />
          <button className="py-2.5 bg-red-500 text-white border-none rounded-lg font-semibold cursor-pointer text-xs hover:bg-red-600 transition">Reset</button>
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
            <span className="text-xs text-slate-900 font-semibold">Sorted Array</span>
          </div>
        </div>

        <CodeBlock code={algo.code} language="python" />

        <StepByStepBreakdown steps={[
          { step: 1, title: "Initialize Pointers", desc: "Set left = 0, right = len(arr) - 1. These define the current search range." },
          { step: 2, title: "Calculate Midpoint", desc: "mid = (left + right) // 2. Avoid overflow with: mid = left + (right - left) // 2." },
          { step: 3, title: "Compare with Target", desc: "If arr[mid] == target, found! If arr[mid] < target, search right half. Otherwise search left half." },
          { step: 4, title: "Update Boundaries", desc: "Move left or right pointer based on comparison. Continue until left > right or target found." },
        ]} />
      </Section>

      <Section title="Common Binary Search Problems">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {PROBLEMS.map((p, i) => (
            <div key={i} className="bg-white rounded-xl border border-slate-200 p-4">
              <h4 className="text-sm font-bold text-slate-900 mb-2">{p.problem}</h4>
              <span className={`text-[10px] px-2 py-1 rounded-md font-semibold uppercase inline-block mb-2 ${
                p.difficulty === "Easy" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
              }`}>{p.difficulty}</span>
              <p className="text-xs text-slate-500">{p.pattern}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Interview Questions">
        <InterviewQuestions questions={[
          { q: "Why is binary search O(log n) not O(n/2)?", a: "Big O notation describes asymptotic behavior. n/2 is still O(n) because it's linear in n. Binary search repeatedly divides by 2, needing log₂(n) iterations maximum." },
          { q: "What causes off-by-one errors in binary search?", a: "Common mistakes: 1) mid = (left + right) / 2 (use // for integer), 2) wrong boundary updates (mid + 1 vs mid), 3) wrong loop condition (< vs <=)." },
          { q: "Can binary search work on unsorted data?", a: "No. Binary search's correctness depends on sorted property. On unsorted data, it may miss the target." },
          { q: "When do you use binary search vs hash table?", a: "Hash table is O(1) average case, better for exact lookup. Binary search is O(log n) guaranteed, better when: data is pre-sorted, need range queries, memory-limited." },
        ]} />
      </Section>

      <Section title="What's Next?">
        <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-xl p-6 text-white">
          <h3 className="text-lg font-bold mb-3">Advanced Concepts</h3>
          <p className="text-white/90 mb-4 text-sm">Take your skills further with these advanced topics:</p>
          <div className="grid sm:grid-cols-3 gap-3">
            {[
              { name: "BST Operations", url: "#" },
              { name: "Binary Indexed Tree", url: "#" },
              { name: "Segment Tree", url: "#" },
            ].map((topic, i) => (
              <button key={i} className="w-full bg-white/20 border border-white/30 text-white py-3 rounded-lg font-semibold text-xs cursor-pointer hover:bg-white/30 transition">
                {topic.name} →
              </button>
            ))}
          </div>
        </div>
      </Section>
    </div>
  );
}
