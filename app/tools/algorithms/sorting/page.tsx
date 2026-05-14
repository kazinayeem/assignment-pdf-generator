"use client";

import { useState } from "react";
import Link from "next/link";
import { Home, ChevronRight } from "lucide-react";
import { Section, ComplexityBadge, CodeBlock, InfoCard, StepByStepBreakdown, VisualAnimationContainer, InterviewQuestions, AlgorithmCard } from "../components";

const SORTING_ALGORITHMS = [
  {
    id: "bubble-sort",
    name: "Bubble Sort",
    description: "Repeatedly steps through the list, compares adjacent elements and swaps if needed",
    complexity: { time: "O(n²)", space: "O(1)" },
    featured: false,
    code: `def bubbleSort(arr):
    n = len(arr)
    for i in range(n):
        for j in range(0, n - i - 1):
            if arr[j] > arr[j + 1]:
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
    return arr`,
  },
  {
    id: "merge-sort",
    name: "Merge Sort",
    description: "Divide and conquer: splits array, recursively sorts halves, merges them",
    complexity: { time: "O(n log n)", space: "O(n)" },
    featured: true,
    code: `def mergeSort(arr):
    if len(arr) <= 1:
        return arr
    mid = len(arr) // 2
    left = mergeSort(arr[:mid])
    right = mergeSort(arr[mid:])
    return merge(left, right)

def merge(left, right):
    result = []
    i = j = 0
    while i < len(left) and j < len(right):
        if left[i] <= right[j]:
            result.append(left[i])
            i += 1
        else:
            result.append(right[j])
            j += 1
    result.extend(left[i:])
    result.extend(right[j:])
    return result`,
  },
  {
    id: "quick-sort",
    name: "Quick Sort",
    description: "Divide and conquer: partitions array around a pivot, recursively sorts partitions",
    complexity: { time: "O(n log n) avg, O(n²) worst", space: "O(log n)" },
    featured: false,
    code: `def quickSort(arr):
    if len(arr) <= 1:
        return arr
    pivot = arr[len(arr) // 2]
    left = [x for x in arr if x < pivot]
    middle = [x for x in arr if x == pivot]
    right = [x for x in arr if x > pivot]
    return quickSort(left) + middle + quickSort(right)`,
  },
];

const USES = [
  { title: "Database Indexing", desc: "Sort data to create efficient indexes for fast lookups" },
  { title: "Search Results", desc: "Rank search results by relevance or date" },
  { title: "Data Analysis", desc: "Sort data before computing medians, percentiles, ranges" },
  { title: "Graphics Rendering", desc: "Sort objects by depth for proper rendering (Z-buffer)" },
  { title: "Scheduler Algorithms", desc: "Schedule tasks by priority or deadline" },
  { title: "Machine Learning", desc: "Sort features or samples for preprocessing" },
];

const MISTAKES = [
  "Using bubble sort in production - use library functions or merge/quick sort instead",
  "Not considering stability when sorting objects with multiple keys",
  "Ignoring space constraints - some algorithms need extra memory (merge sort)",
  "Not handling edge cases: empty arrays, single elements, all equal elements, all duplicates",
  "Misunderstanding complexity - amortized vs worst-case, and practical performance differences",
];

const RELATED = [
  { name: "Binary Search", desc: "Search efficiently in sorted arrays", href: "/tools/algorithms/binary-search" },
  { name: "Merge Operations", desc: "Combine sorted arrays efficiently", href: "#" },
  { name: "Heap Algorithms", desc: "Priority queue and heap sort", href: "/tools/algorithms/heap" },
];

export default function SortingPage() {
  const [selectedAlgo, setSelectedAlgo] = useState("bubble-sort");

  const algo = SORTING_ALGORITHMS.find((a) => a.id === selectedAlgo)!;

  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 mb-6 text-xs text-slate-500">
        <Link href="/tools/algorithms" className="text-indigo-600 no-underline flex items-center gap-1.5 hover:text-indigo-800 transition">
          <Home size={16} /> Algorithms
        </Link>
        <ChevronRight size={16} />
        <span className="text-slate-900 font-semibold">Sorting Algorithms</span>
      </div>

      {/* Header */}
      <div className="mb-10">
        <h1 className="text-4xl font-extrabold text-slate-900 mb-3">📊 Sorting Algorithms</h1>
        <p className="text-base text-slate-500 leading-relaxed max-w-xl">
          Learn how to arrange data in order. Sorting is fundamental to computer science and appears in almost every application. Master different sorting techniques and understand their trade-offs.
        </p>
      </div>

      {/* Overview */}
      <Section title="Overview">
        <InfoCard title="What are Sorting Algorithms?" type="info">
          Sorting algorithms rearrange data in a specific order (usually ascending or descending). They form the foundation for searching, database operations, and data analysis. Different algorithms have different performance characteristics.
        </InfoCard>
        
        <div className="bg-white rounded-xl border border-slate-200 p-6 mb-4">
          <h3 className="text-base font-bold text-slate-900 mb-4">Key Sorting Algorithms</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {SORTING_ALGORITHMS.map((a) => (
              <AlgorithmCard
                key={a.id}
                title={a.name}
                description={a.description}
                complexity={a.complexity}
                featured={a.featured}
              />
            ))}
          </div>
        </div>
      </Section>

      {/* Interactive Visualizer */}
      <Section title="Interactive Visualizer">
        <div className="flex gap-2 flex-wrap mb-5">
          {SORTING_ALGORITHMS.map((a) => (
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
            <div className="text-5xl mb-3">📊</div>
            <p className="mb-4">{algo.name} Visualizer</p>
            <p className="text-xs max-w-xs text-slate-400">
              Interactive visualization with animatable bars. Use speed control and step-through buttons to see algorithm in action.
            </p>
          </div>
        </VisualAnimationContainer>

        {/* Controls */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <button className="py-2.5 bg-indigo-600 text-white border-none rounded-lg font-semibold cursor-pointer text-xs hover:bg-indigo-700 transition">
            Generate Array
          </button>
          <button className="py-2.5 bg-purple-600 text-white border-none rounded-lg font-semibold cursor-pointer text-xs hover:bg-purple-700 transition">
            Start Sort
          </button>
          <input type="range" min="0.1" max="2" step="0.1" defaultValue="1" className="w-full" />
          <button className="py-2.5 bg-red-500 text-white border-none rounded-lg font-semibold cursor-pointer text-xs hover:bg-red-600 transition">
            Reset
          </button>
        </div>
      </Section>

      {/* Deep Dive */}
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
            <h4 className="text-[10px] font-bold text-slate-400 uppercase mb-2 tracking-wider">Best For</h4>
            <span className="text-xs text-slate-900 font-semibold">General Purpose</span>
          </div>
        </div>

        <InfoCard title="Algorithm Approach" type="tip">
          {algo.description}
        </InfoCard>

        <StepByStepBreakdown
          steps={[
            { step: 1, title: "Understand the Problem", desc: "You need to arrange elements in order. Know your constraints: array size, data type, stability requirements." },
            { step: 2, title: "Choose Strategy", desc: "Consider time/space trade-offs. For small arrays or nearly sorted data, simple algorithms work. For large data, use efficient algorithms." },
            { step: 3, title: "Implement Algorithm", desc: "Follow the algorithm logic step by step. Make sure your implementation handles edge cases like empty arrays, single elements, and duplicates." },
            { step: 4, title: "Test and Analyze", desc: "Test with different inputs: best case, worst case, average case. Verify complexity analysis matches actual performance." },
          ]}
        />

        <CodeBlock code={algo.code} language="python" />
      </Section>

      {/* Use Cases */}
      <Section title="Real-World Applications">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {USES.map((use, i) => (
            <div key={i} className="bg-white rounded-xl border border-slate-200 p-4">
              <h4 className="text-sm font-bold text-slate-900 mb-1.5">{use.title}</h4>
              <p className="text-xs text-slate-500 leading-relaxed">{use.desc}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Interview Questions */}
      <Section title="Interview Questions">
        <InterviewQuestions
          questions={[
            { q: "What's the difference between stable and unstable sorts?", a: "Stable sorts preserve the relative order of equal elements. Merge sort is stable, quick sort is not. Stability matters in multi-key sorting." },
            { q: "Why is Quick Sort preferred in practice despite O(n²) worst case?", a: "Quick Sort has good average-case performance O(n log n), excellent cache locality, and small space overhead O(log n). Worst case is rare with good pivot selection." },
            { q: "When should you use Bubble Sort?", a: "Almost never in production. Only for: 1) Educational purposes, 2) Nearly sorted small arrays, 3) Detecting whether array is already sorted. Use Tim Sort or standard library instead." },
          ]}
        />
      </Section>

      {/* Common Mistakes */}
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

      {/* Next Steps */}
      <Section title="What's Next?">
        <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-xl p-6 text-white">
          <h3 className="text-lg font-bold mb-3">Master Related Topics</h3>
          <p className="text-white/90 mb-4 text-sm">After sorting, explore these related algorithms:</p>
          <div className="grid sm:grid-cols-3 gap-3">
            {RELATED.map((topic, i) => (
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
