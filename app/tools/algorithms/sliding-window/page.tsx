"use client";

import { useState } from "react";
import Link from "next/link";
import { Home, ChevronRight } from "lucide-react";
import { Section, ComplexityBadge, CodeBlock, InfoCard, StepByStepBreakdown, VisualAnimationContainer, InterviewQuestions, AlgorithmCard } from "../components";

const ALGORITHMS = [
  { id: "max-sum-subarray", name: "Max Sum Subarray (Fixed)", description: "Find max sum of k consecutive elements", complexity: { time: "O(n)", space: "O(1)" }, featured: true, code: `def maxSumSubarray(arr, k):\n    window_sum = sum(arr[:k])\n    max_sum = window_sum\n    for i in range(k, len(arr)):\n        window_sum += arr[i] - arr[i - k]\n        max_sum = max(max_sum, window_sum)\n    return max_sum` },
  { id: "longest-substring-kdist", name: "Longest Substring K Distinct", description: "Longest substring with ≤K distinct characters", complexity: { time: "O(n)", space: "O(k)" }, featured: false, code: `from collections import defaultdict\n\ndef longestSubstringKDistinct(s, k):\n    freq = defaultdict(int)\n    left = max_len = 0\n    for right in range(len(s)):\n        freq[s[right]] += 1\n        while len(freq) > k:\n            freq[s[left]] -= 1\n            if freq[s[left]] == 0:\n                del freq[s[left]]\n            left += 1\n        max_len = max(max_len, right - left + 1)\n    return max_len` },
  { id: "min-window-substring", name: "Minimum Window Substring", description: "Smallest substring containing all target characters", complexity: { time: "O(n)", space: "O(k)" }, featured: true, code: `from collections import Counter\n\ndef minWindow(s, t):\n    need = Counter(t)\n    have = 0\n    left = start = 0\n    min_len = float('inf')\n    for right in range(len(s)):\n        if s[right] in need:\n            need[s[right]] -= 1\n            if need[s[right]] >= 0:\n                have += 1\n        while have == len(t):\n            if right - left + 1 < min_len:\n                min_len = right - left + 1\n                start = left\n            if s[left] in need:\n                need[s[left]] += 1\n                if need[s[left]] > 0:\n                    have -= 1\n            left += 1\n    return s[start:start+min_len] if min_len != float('inf') else ""` },
  { id: "longest-repeating-replacement", name: "Longest Repeating Replacement", description: "Longest substring with same char after k replacements", complexity: { time: "O(n)", space: "O(1)" }, featured: false, code: `def characterReplacement(s, k):\n    freq = {}\n    max_freq = left = 0\n    for right in range(len(s)):\n        freq[s[right]] = freq.get(s[right], 0) + 1\n        max_freq = max(max_freq, freq[s[right]])\n        if (right - left + 1) - max_freq > k:\n            freq[s[left]] -= 1\n            left += 1\n    return len(s) - left` },
  { id: "max-consecutive-ones", name: "Max Consecutive Ones III", description: "Longest 1s after flipping at most k zeros", complexity: { time: "O(n)", space: "O(1)" }, featured: false, code: `def longestOnes(nums, k):\n    left = zero_count = 0\n    for right in range(len(nums)):\n        if nums[right] == 0:\n            zero_count += 1\n        if zero_count > k:\n            if nums[left] == 0:\n                zero_count -= 1\n            left += 1\n    return len(nums) - left` },
];

const USES = [
  { title: "Network Traffic", desc: "Monitor packet rates over time windows" },
  { title: "Real-time Analytics", desc: "Moving averages, trend detection in streaming data" },
  { title: "Bioinformatics", desc: "Find GC-rich regions in DNA sequences" },
  { title: "Stock Market", desc: "Maximum profit with sliding window prices" },
  { title: "Image Processing", desc: "Sliding window for convolution and feature detection" },
  { title: "Natural Language", desc: "N-gram extraction, text summarization" },
];

const QUIZ = [
  { q: "What is the key idea of sliding window?", options: ["Sort first", "Maintain a window and slide it", "Use recursion", "Divide and conquer"], answer: 1 },
  { q: "What is the time complexity of sliding window?", options: ["O(n²)", "O(n)", "O(n log n)", "O(2ⁿ)"], answer: 1 },
  { q: "Fixed-size vs variable-size window: which uses while loop to shrink?", options: ["Fixed", "Variable", "Both", "Neither"], answer: 1 },
  { q: "What does 'k' represent in Max Sum Subarray (Fixed)?", options: ["Sum", "Window size", "Array length", "Target"], answer: 1 },
  { q: "When is sliding window not applicable?", options: ["Array problems", "Subarray problems", "Problems requiring sorting", "Problems with non-contiguous elements"], answer: 3 },
];

export default function SlidingWindowPage() {
  const [selected, setSelected] = useState("max-sum-subarray");
  const [quiz, setQuiz] = useState<Record<number, number>>({});
  const [showResults, setShowResults] = useState(false);
  const algo = ALGORITHMS.find((a) => a.id === selected)!;
  const handleAnswer = (qi: number, ai: number) => setQuiz((p) => ({ ...p, [qi]: ai }));
  const quizScore = QUIZ.reduce((s, q, i) => s + (quiz[i] === q.answer ? 1 : 0), 0);

  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      <div className="flex items-center gap-2 mb-6 text-xs text-slate-500">
        <Link href="/tools/algorithms" className="text-indigo-600 no-underline flex items-center gap-1.5 hover:text-indigo-800 transition"><Home size={16} /> Algorithms</Link>
        <ChevronRight size={16} /><span className="text-slate-900 font-semibold">Sliding Window</span>
      </div>
      <div className="mb-10">
        <h1 className="text-4xl font-extrabold text-slate-900 mb-3">🪟 Sliding Window</h1>
        <p className="text-base text-slate-500 leading-relaxed max-w-xl">Efficiently process sequential data by maintaining a window that slides over the array. Master fixed and variable-size window patterns.</p>
      </div>
      <Section title="Overview">
        <InfoCard title="What is Sliding Window?" type="info">Sliding window is a technique for processing arrays/lists by maintaining a contiguous window of elements and sliding it across the data. It reduces O(n²) brute force to O(n). Two types: 1) Fixed-size window, 2) Variable-size window (expand/shrink).</InfoCard>
        <div className="bg-white rounded-xl border border-slate-200 p-6 mb-4">
          <h3 className="text-base font-bold text-slate-900 mb-4">Key Sliding Window Algorithms</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">{ALGORITHMS.map((a) => <AlgorithmCard key={a.id} title={a.name} description={a.description} complexity={a.complexity} featured={a.featured} />)}</div>
        </div>
      </Section>
      <Section title="Interactive Visualizer">
        <div className="flex gap-2 flex-wrap mb-5">{ALGORITHMS.map((a) => (<button key={a.id} onClick={() => setSelected(a.id)} className={`px-4 py-2.5 rounded-lg text-xs font-medium cursor-pointer transition-all ${selected === a.id ? "bg-indigo-50 text-indigo-600 border-2 border-indigo-500" : "bg-white text-slate-500 border border-slate-200 hover:border-indigo-400"}`}>{a.name}</button>))}</div>
        <VisualAnimationContainer title="Window Animation">
          <div className="bg-slate-50 rounded-lg p-10 text-center text-slate-500 h-[300px] flex items-center justify-center flex-col">
            <div className="text-5xl mb-3">🪟</div>
            <p className="mb-4">{algo.name} Visualizer</p>
            <p className="text-xs max-w-xs text-slate-400">Watch the window slide across the array, expanding and contracting as needed.</p>
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
          <div className="bg-white rounded-xl border border-slate-200 p-4"><h4 className="text-[10px] font-bold text-slate-400 uppercase mb-2 tracking-wider">Window Type</h4><span className="text-xs text-slate-900 font-semibold">{algo.id === "max-sum-subarray" ? "Fixed" : "Variable"}</span></div>
        </div>
        <InfoCard title="Pattern Explanation" type="tip">{algo.id === "max-sum-subarray" ? "Fixed-size window. Add the new element entering the window and subtract the one leaving. Maintain max_sum across all positions." : algo.id === "longest-substring-kdist" ? "Expand right pointer, adding characters. When distinct count exceeds k, shrink from left. Track max window length." : algo.id === "min-window-substring" ? "Expand right until all target chars are in window. Then shrink from left to minimize window while still containing target. Track min window." : algo.id === "longest-repeating-replacement" ? "Expand right, track max frequency of any character. If window length - max_freq > k, shrink left. Valid windows have ≤k characters to replace." : "Expand right, count zeros. When zero_count > k, advance left to reduce zeros. Result is max window length."}</InfoCard>
        <CodeBlock code={algo.code} language="python" />
        <StepByStepBreakdown steps={[{ step: 1, title: "Initialize Window", desc: "Set left=0, right=0, and any tracking variables." }, { step: 2, title: "Expand Window", desc: "Move right pointer, adding element to window and updating state." }, { step: 3, title: "Shrink (if needed)", desc: "For variable windows, move left pointer to maintain constraints." }, { step: 4, title: "Update Answer", desc: "Record max/min/valid window after each valid state." }]} />
      </Section>
      <Section title="Real-World Applications"><div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">{USES.map((u, i) => (<div key={i} className="bg-white rounded-xl border border-slate-200 p-4"><h4 className="text-sm font-bold text-slate-900 mb-1.5">{u.title}</h4><p className="text-xs text-slate-500 leading-relaxed">{u.desc}</p></div>))}</div></Section>
      <Section title="Interview Questions">
        <InterviewQuestions questions={[
          { q: "When should you use sliding window?", a: "When the problem involves contiguous subarrays/substrings and asks for min/max/longest/shortest. Key sign: 'subarray' or 'substring' with a constraint." },
          { q: "What is the difference between fixed and variable window?", a: "Fixed window has predetermined size k; just slide and update. Variable window expands/shrinks dynamically based on constraints; uses while loop to shrink when constraint is violated." },
          { q: "How do you identify if sliding window is applicable?", a: "Look for: 1) Contiguous sequence, 2) Constraint (sum, distinct chars, target), 3) Need maximum/minimum window. If elements can be reordered, sliding window doesn't apply." },
        ]} />
      </Section>
      <Section title="Knowledge Check">
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="space-y-5">{QUIZ.map((q, qi) => (<div key={qi}><p className="text-sm font-semibold text-slate-900 mb-3">{qi + 1}. {q.q}</p><div className="grid sm:grid-cols-2 gap-2">{q.options.map((opt, oi) => { const selected = quiz[qi] === oi; const correct = showResults && oi === q.answer; const wrong = showResults && selected && oi !== q.answer; return (<button key={oi} onClick={() => !showResults && handleAnswer(qi, oi)} className={`text-xs text-left px-4 py-2.5 rounded-lg border transition-all cursor-pointer ${correct ? "bg-green-50 border-green-500 text-green-700" : wrong ? "bg-red-50 border-red-500 text-red-700" : selected ? "bg-indigo-50 border-indigo-500 text-indigo-700" : "bg-white border-slate-200 text-slate-600 hover:border-indigo-400"}`}>{opt}</button>); })}</div></div>))}</div>
          <div className="flex gap-3 mt-6">{!showResults ? (<button onClick={() => setShowResults(true)} className="px-6 py-2.5 bg-indigo-600 text-white rounded-lg text-xs font-semibold cursor-pointer hover:bg-indigo-700 transition">Submit Answers</button>) : (<div className="flex items-center gap-4"><span className="text-sm font-bold text-slate-900">Score: {quizScore}/{QUIZ.length}</span><button onClick={() => { setQuiz({}); setShowResults(false); }} className="px-6 py-2.5 bg-slate-100 text-slate-600 rounded-lg text-xs font-semibold cursor-pointer hover:bg-slate-200 transition">Reset</button></div>)}</div>
        </div>
      </Section>
      <Section title="What's Next?"><div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-xl p-6 text-white"><h3 className="text-lg font-bold mb-3">Related Topics</h3><p className="text-white/90 mb-4 text-sm">Continue your learning:</p><div className="grid sm:grid-cols-3 gap-3">{[{ name: "Two Pointer", href: "/tools/algorithms/two-pointer" }, { name: "String Algorithms", href: "/tools/algorithms/string" }, { name: "Dynamic Programming", href: "/tools/algorithms/dynamic-programming" }].map((t, i) => (<Link key={i} href={t.href} className="no-underline"><button className="w-full bg-white/20 border border-white/30 text-white py-3 rounded-lg font-semibold text-xs cursor-pointer hover:bg-white/30 transition">{t.name} →</button></Link>))}</div></div></Section>
    </div>
  );
}
