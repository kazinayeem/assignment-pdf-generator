"use client";

import { useState } from "react";
import Link from "next/link";
import { Home, ChevronRight } from "lucide-react";
import { Section, ComplexityBadge, CodeBlock, InfoCard, StepByStepBreakdown, VisualAnimationContainer, InterviewQuestions, AlgorithmCard } from "../components";

const ALGORITHMS = [
  { id: "two-sum-sorted", name: "Two Sum (Sorted)", description: "Find two numbers in sorted array that sum to target", complexity: { time: "O(n)", space: "O(1)" }, featured: true, code: `def twoSumSorted(arr, target):\n    left, right = 0, len(arr) - 1\n    while left < right:\n        curr = arr[left] + arr[right]\n        if curr == target:\n            return [left, right]\n        elif curr < target:\n            left += 1\n        else:\n            right -= 1\n    return [-1, -1]` },
  { id: "remove-duplicates", name: "Remove Duplicates", description: "Remove duplicates from sorted array in-place", complexity: { time: "O(n)", space: "O(1)" }, featured: false, code: `def removeDuplicates(nums):\n    if not nums: return 0\n    slow = 1\n    for fast in range(1, len(nums)):\n        if nums[fast] != nums[fast - 1]:\n            nums[slow] = nums[fast]\n            slow += 1\n    return slow` },
  { id: "container-water", name: "Container With Most Water", description: "Find max water between two lines", complexity: { time: "O(n)", space: "O(1)" }, featured: true, code: `def maxArea(height):\n    left, right = 0, len(height) - 1\n    max_water = 0\n    while left < right:\n        w = right - left\n        h = min(height[left], height[right])\n        max_water = max(max_water, w * h)\n        if height[left] < height[right]:\n            left += 1\n        else:\n            right -= 1\n    return max_water` },
  { id: "three-sum", name: "3Sum", description: "Find all triplets summing to zero", complexity: { time: "O(n²)", space: "O(1)" }, featured: false, code: `def threeSum(nums):\n    nums.sort()\n    result = []\n    for i in range(len(nums) - 2):\n        if i > 0 and nums[i] == nums[i-1]: continue\n        left, right = i + 1, len(nums) - 1\n        while left < right:\n            s = nums[i] + nums[left] + nums[right]\n            if s == 0:\n                result.append([nums[i], nums[left], nums[right]])\n                while left < right and nums[left] == nums[left+1]: left += 1\n                while left < right and nums[right] == nums[right-1]: right -= 1\n                left += 1; right -= 1\n            elif s < 0: left += 1\n            else: right -= 1\n    return result` },
  { id: "palindrome-check", name: "Valid Palindrome", description: "Check if string is palindrome with two pointers", complexity: { time: "O(n)", space: "O(1)" }, featured: false, code: `def isPalindrome(s):\n    left, right = 0, len(s) - 1\n    while left < right:\n        while left < right and not s[left].isalnum():\n            left += 1\n        while left < right and not s[right].isalnum():\n            right -= 1\n        if s[left].lower() != s[right].lower():\n            return False\n        left += 1\n        right -= 1\n    return True` },
];

const USES = [
  { title: "Array Partitioning", desc: "QuickSort partitioning, Dutch national flag problem" },
  { title: "String Processing", desc: "Palindrome checking, reverse words in place" },
  { title: "Data Validation", desc: "Validating sequences, detecting cycles in linked lists" },
  { title: "Memory Management", desc: "Compacting arrays, defragmentation algorithms" },
  { title: "Search Optimization", desc: "Two pointers reduce O(n²) to O(n) for pair problems" },
  { title: "Linked List", desc: "Detect cycle (Floyd's), find middle, remove nth from end" },
];

const QUIZ = [
  { q: "When is two pointer technique most effective?", options: ["Unsorted data", "Sorted data or defined ordering", "Random access", "Tree data"], answer: 1 },
  { q: "Time complexity of two-pointer pair problems?", options: ["O(n²)", "O(n)", "O(log n)", "O(n log n)"], answer: 1 },
  { q: "What type of pointer is used in Remove Duplicates?", options: ["Left-Right", "Fast-Slow", "Sliding window", "Collision"], answer: 1 },
  { q: "How does Container With Most Water decide which pointer moves?", options: ["Higher line moves", "Shorter line moves", "Both move", "Random"], answer: 1 },
  { q: "What is the time complexity of 3Sum?", options: ["O(n)", "O(n²)", "O(n³)", "O(n log n)"], answer: 1 },
];

export default function TwoPointerPage() {
  const [selected, setSelected] = useState("two-sum-sorted");
  const [quiz, setQuiz] = useState<Record<number, number>>({});
  const [showResults, setShowResults] = useState(false);
  const algo = ALGORITHMS.find((a) => a.id === selected)!;
  const handleAnswer = (qi: number, ai: number) => setQuiz((p) => ({ ...p, [qi]: ai }));
  const quizScore = QUIZ.reduce((s, q, i) => s + (quiz[i] === q.answer ? 1 : 0), 0);

  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      <div className="flex items-center gap-2 mb-6 text-xs text-slate-500">
        <Link href="/tools/algorithms" className="text-indigo-600 no-underline flex items-center gap-1.5 hover:text-indigo-800 transition"><Home size={16} /> Algorithms</Link>
        <ChevronRight size={16} /><span className="text-slate-900 font-semibold">Two Pointer</span>
      </div>
      <div className="mb-10">
        <h1 className="text-4xl font-extrabold text-slate-900 mb-3">👉 Two Pointer Technique</h1>
        <p className="text-base text-slate-500 leading-relaxed max-w-xl">Use two pointers to traverse data structures efficiently. Master collision, fast-slow, and sliding pointer patterns.</p>
      </div>
      <Section title="Overview">
        <InfoCard title="What is Two Pointer?" type="info">The two pointer technique uses two pointers to iterate through data, often in opposite directions or at different speeds. It reduces time complexity by avoiding nested loops. Common patterns: collision (left/right), fast-slow, and parallel iteration.</InfoCard>
        <div className="bg-white rounded-xl border border-slate-200 p-6 mb-4">
          <h3 className="text-base font-bold text-slate-900 mb-4">Key Two Pointer Algorithms</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">{ALGORITHMS.map((a) => <AlgorithmCard key={a.id} title={a.name} description={a.description} complexity={a.complexity} featured={a.featured} />)}</div>
        </div>
      </Section>
      <Section title="Interactive Visualizer">
        <div className="flex gap-2 flex-wrap mb-5">{ALGORITHMS.map((a) => (<button key={a.id} onClick={() => setSelected(a.id)} className={`px-4 py-2.5 rounded-lg text-xs font-medium cursor-pointer transition-all ${selected === a.id ? "bg-indigo-50 text-indigo-600 border-2 border-indigo-500" : "bg-white text-slate-500 border border-slate-200 hover:border-indigo-400"}`}>{a.name}</button>))}</div>
        <VisualAnimationContainer title="Pointer Visualization">
          <div className="bg-slate-50 rounded-lg p-10 text-center text-slate-500 h-[300px] flex items-center justify-center flex-col">
            <div className="text-5xl mb-3">👉</div>
            <p className="mb-4">{algo.name} Visualizer</p>
            <p className="text-xs max-w-xs text-slate-400">Watch how pointers move across the array, making decisions based on element values.</p>
          </div>
        </VisualAnimationContainer>
        <div className="bg-white rounded-xl border border-slate-200 p-5 grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <button className="py-2.5 bg-indigo-600 text-white border-none rounded-lg font-semibold cursor-pointer text-xs hover:bg-indigo-700 transition">Generate Input</button>
          <button className="py-2.5 bg-purple-600 text-white border-none rounded-lg font-semibold cursor-pointer text-xs hover:bg-purple-700 transition">Run Algorithm</button>
          <input type="range" min="0.1" max="2" step="0.1" defaultValue="1" className="w-full" />
          <button className="py-2.5 bg-red-500 text-white border-none rounded-lg font-semibold cursor-pointer text-xs hover:bg-red-600 transition">Reset</button>
        </div>
      </Section>
      <Section title={`Deep Dive: ${algo.name}`}>
        <div className="grid sm:grid-cols-3 gap-4 mb-5">
          <div className="bg-white rounded-xl border border-slate-200 p-4"><h4 className="text-[10px] font-bold text-slate-400 uppercase mb-2 tracking-wider">Time Complexity</h4><ComplexityBadge type="time" value={algo.complexity.time} /></div>
          <div className="bg-white rounded-xl border border-slate-200 p-4"><h4 className="text-[10px] font-bold text-slate-400 uppercase mb-2 tracking-wider">Space Complexity</h4><ComplexityBadge type="space" value={algo.complexity.space} /></div>
          <div className="bg-white rounded-xl border border-slate-200 p-4"><h4 className="text-[10px] font-bold text-slate-400 uppercase mb-2 tracking-wider">Pattern</h4><span className="text-xs text-slate-900 font-semibold">{algo.id === "remove-duplicates" ? "Fast-Slow" : "Collision"}</span></div>
        </div>
        <InfoCard title="Pointer Strategy" type="tip">{algo.id === "two-sum-sorted" ? "Start with left=0, right=last. If sum < target, move left up. If sum > target, move right down. The sorted property guarantees correctness." : algo.id === "remove-duplicates" ? "Fast pointer scans ahead. Slow pointer marks where to place next unique element. When fast finds new value, copy it to slow position." : algo.id === "container-water" ? "Start pointers at ends. Move the pointer with the shorter line inward. Area is bounded by shorter line, so moving it may find taller line. Keep track of max area." : algo.id === "three-sum" ? "Fix first element, then use two-pointer pair search on remaining array. Skip duplicates to avoid redundant triplets. Outer loop O(n), inner pair search O(n) = O(n²)." : "Start pointers at both ends, skipping non-alphanumeric chars. Compare characters after case normalization. If mismatch, not a palindrome."}</InfoCard>
        <CodeBlock code={algo.code} language="python" />
        <StepByStepBreakdown steps={[{ step: 1, title: "Position Pointers", desc: "Decide initial positions: both ends, same start, or offset." }, { step: 2, title: "Compare Values", desc: "Evaluate elements at pointer positions against target or each other." }, { step: 3, title: "Move Pointers", desc: "Advance one or both pointers based on comparison result." }, { step: 4, title: "Repeat", desc: "Continue until pointers meet, cross, or reach end." }]} />
      </Section>
      <Section title="Real-World Applications"><div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">{USES.map((u, i) => (<div key={i} className="bg-white rounded-xl border border-slate-200 p-4"><h4 className="text-sm font-bold text-slate-900 mb-1.5">{u.title}</h4><p className="text-xs text-slate-500 leading-relaxed">{u.desc}</p></div>))}</div></Section>
      <Section title="Interview Questions">
        <InterviewQuestions questions={[
          { q: "What are the three common two-pointer patterns?", a: "1) Collision: pointers start at ends and move inward (Two Sum, Palindrome), 2) Fast-Slow: one pointer moves faster (Remove Duplicates, Cycle Detection), 3) Parallel: both start at same end at different speeds." },
          { q: "When would you use two pointers vs hash map?", a: "Two pointers uses O(1) space, ideal for sorted arrays. Hash map uses O(n) space but works on unsorted data. If array is sorted or sortable, prefer two pointers." },
          { q: "How do you adapt two-pointer for 3Sum?", a: "Sort array, iterate with one pointer as 'anchor', then use two-pointer pair search on the remaining subarray. Total: O(n²) time, O(1) extra space." },
        ]} />
      </Section>
      <Section title="Knowledge Check">
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="space-y-5">{QUIZ.map((q, qi) => (<div key={qi}><p className="text-sm font-semibold text-slate-900 mb-3">{qi + 1}. {q.q}</p><div className="grid sm:grid-cols-2 gap-2">{q.options.map((opt, oi) => { const selected = quiz[qi] === oi; const correct = showResults && oi === q.answer; const wrong = showResults && selected && oi !== q.answer; return (<button key={oi} onClick={() => !showResults && handleAnswer(qi, oi)} className={`text-xs text-left px-4 py-2.5 rounded-lg border transition-all cursor-pointer ${correct ? "bg-green-50 border-green-500 text-green-700" : wrong ? "bg-red-50 border-red-500 text-red-700" : selected ? "bg-indigo-50 border-indigo-500 text-indigo-700" : "bg-white border-slate-200 text-slate-600 hover:border-indigo-400"}`}>{opt}</button>); })}</div></div>))}</div>
          <div className="flex gap-3 mt-6">{!showResults ? (<button onClick={() => setShowResults(true)} className="px-6 py-2.5 bg-indigo-600 text-white rounded-lg text-xs font-semibold cursor-pointer hover:bg-indigo-700 transition">Submit Answers</button>) : (<div className="flex items-center gap-4"><span className="text-sm font-bold text-slate-900">Score: {quizScore}/{QUIZ.length}</span><button onClick={() => { setQuiz({}); setShowResults(false); }} className="px-6 py-2.5 bg-slate-100 text-slate-600 rounded-lg text-xs font-semibold cursor-pointer hover:bg-slate-200 transition">Reset</button></div>)}</div>
        </div>
      </Section>
      <Section title="What's Next?"><div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-xl p-6 text-white"><h3 className="text-lg font-bold mb-3">Advanced Concepts</h3><p className="text-white/90 mb-4 text-sm">Build on these skills:</p><div className="grid sm:grid-cols-3 gap-3">{[{ name: "Sliding Window", href: "/tools/algorithms/sliding-window" }, { name: "Sorting Algorithms", href: "/tools/algorithms/sorting" }, { name: "Binary Search", href: "/tools/algorithms/binary-search" }].map((t, i) => (<Link key={i} href={t.href} className="no-underline"><button className="w-full bg-white/20 border border-white/30 text-white py-3 rounded-lg font-semibold text-xs cursor-pointer hover:bg-white/30 transition">{t.name} →</button></Link>))}</div></div></Section>
    </div>
  );
}
