"use client";

import { useState } from "react";
import Link from "next/link";
import { Home, ChevronRight } from "lucide-react";
import { Section, ComplexityBadge, CodeBlock, InfoCard, StepByStepBreakdown, VisualAnimationContainer, InterviewQuestions, AlgorithmCard } from "../components";

const ALGORITHMS = [
  {
    id: "activity-selection",
    name: "Activity Selection",
    description: "Select maximum non-overlapping activities from a set",
    complexity: { time: "O(n log n)", space: "O(1)" },
    featured: true,
    code: `def activitySelection(activities):
    activities.sort(key=lambda x: x[1])
    count = 1
    end = activities[0][1]
    for i in range(1, len(activities)):
        if activities[i][0] >= end:
            count += 1
            end = activities[i][1]
    return count`,
  },
  {
    id: "coin-change",
    name: "Coin Change (Greedy)",
    description: "Minimum coins with unlimited supply of denominations",
    complexity: { time: "O(n log n)", space: "O(1)" },
    featured: false,
    code: `def coinChangeGreedy(coins, amount):
    coins.sort(reverse=True)
    count = 0
    for coin in coins:
        if amount >= coin:
            count += amount // coin
            amount %= coin
    return count if amount == 0 else -1`,
  },
  {
    id: "fractional-knapsack",
    name: "Fractional Knapsack",
    description: "Maximize value with fraction-allowed items",
    complexity: { time: "O(n log n)", space: "O(1)" },
    featured: false,
    code: `def fractionalKnapsack(items, W):
    items.sort(key=lambda x: x[1]/x[0], reverse=True)
    total = 0.0
    for w, v in items:
        if W >= w:
            total += v
            W -= w
        else:
            total += v * (W / w)
            break
    return total`,
  },
  {
    id: "huffman",
    name: "Huffman Coding",
    description: "Build optimal prefix code for data compression",
    complexity: { time: "O(n log n)", space: "O(n)" },
    featured: false,
    code: `def huffman(freq):
    heap = [[w, [char, ""]] for char, w in freq.items()]
    heapq.heapify(heap)
    while len(heap) > 1:
        lo = heapq.heappop(heap)
        hi = heapq.heappop(heap)
        for pair in lo[1:]:
            pair[1] = '0' + pair[1]
        for pair in hi[1:]:
            pair[1] = '1' + pair[1]
        heapq.heappush(heap, [lo[0] + hi[0]] + lo[1:] + hi[1:])
    return sorted(heap[0][1:], key=lambda p: len(p[1]))`,
  },
  {
    id: "job-sequencing",
    name: "Job Sequencing",
    description: "Schedule jobs with deadlines for maximum profit",
    complexity: { time: "O(n²)", space: "O(n)" },
    featured: false,
    code: `def jobSequencing(jobs):
    jobs.sort(key=lambda x: x[2], reverse=True)
    maxDeadline = max(jobs, key=lambda x: x[1])[1]
    slots = [-1] * maxDeadline
    profit = 0
    for id, deadline, p in jobs:
        for j in range(deadline - 1, -1, -1):
            if slots[j] == -1:
                slots[j] = id
                profit += p
                break
    return profit`,
  },
];

const USES = [
  { title: "Data Compression", desc: "Huffman coding creates optimal prefix codes for lossless compression" },
  { title: "Network Routing", desc: "Dijkstra's algorithm greedily selects the closest unvisited vertex" },
  { title: "Resource Allocation", desc: "CPU scheduling, memory allocation use greedy strategies" },
  { title: "Minimum Spanning Trees", desc: "Prim's and Kruskal's algorithms build MSTs greedily" },
  { title: "Optimization Problems", desc: "Traveling salesman, task scheduling, packing problems" },
  { title: "Compression Algorithms", desc: "Run-length encoding, dictionary-based compression" },
];

const MISTAKES = [
  "Assuming greedy always gives optimal solution - many problems need DP",
  "Not verifying the greedy choice property - local optimum may not lead to global optimum",
  "Forgetting to sort input first - most greedy algorithms require sorted data",
  "Applying greedy to problems with constraints that require backtracking",
  "Not testing with edge cases: empty input, single element, all same values",
];

const QUIZ = [
  { q: "What makes a problem suitable for greedy algorithms?", options: ["Greedy choice property", "Optimal substructure", "Both", "Neither"], answer: 2 },
  { q: "Does greedy always produce the optimal solution?", options: ["Yes, always", "No, only for specific problems", "Only for sorting", "Never"], answer: 1 },
  { q: "What is the time complexity of Activity Selection?", options: ["O(n)", "O(n log n)", "O(n²)", "O(2ⁿ)"], answer: 1 },
  { q: "Why might greedy fail for coin change?", options: ["Standard denominations work", "Non-canonical coin systems need DP", "Too many coins", "Greedy always fails"], answer: 1 },
  { q: "What data structure is key for Huffman coding?", options: ["Stack", "Queue", "Min Heap", "Hash Table"], answer: 2 },
];

export default function GreedyPage() {
  const [selectedAlgo, setSelectedAlgo] = useState("activity-selection");
  const [quiz, setQuiz] = useState<Record<number, number>>({});
  const [showResults, setShowResults] = useState(false);
  const algo = ALGORITHMS.find((a) => a.id === selectedAlgo)!;
  const handleAnswer = (qi: number, ai: number) => setQuiz((p) => ({ ...p, [qi]: ai }));
  const quizScore = QUIZ.reduce((s, q, i) => s + (quiz[i] === q.answer ? 1 : 0), 0);

  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      <div className="flex items-center gap-2 mb-6 text-xs text-slate-500">
        <Link href="/tools/algorithms" className="text-indigo-600 no-underline flex items-center gap-1.5 hover:text-indigo-800 transition"><Home size={16} /> Algorithms</Link>
        <ChevronRight size={16} /><span className="text-slate-900 font-semibold">Greedy Algorithms</span>
      </div>
      <div className="mb-10">
        <h1 className="text-4xl font-extrabold text-slate-900 mb-3">💰 Greedy Algorithms</h1>
        <p className="text-base text-slate-500 leading-relaxed max-w-xl">Make locally optimal choices at each step to find global optimum. Master activity selection, Huffman coding, and more.</p>
      </div>
      <Section title="Overview">
        <InfoCard title="What are Greedy Algorithms?" type="info">Greedy algorithms make the best local choice at each step hoping to find the global optimum. They work when the problem has the greedy choice property (a local optimum leads to a global optimum) and optimal substructure (optimal solution contains optimal solutions to subproblems).</InfoCard>
        <div className="bg-white rounded-xl border border-slate-200 p-6 mb-4">
          <h3 className="text-base font-bold text-slate-900 mb-4">Key Greedy Algorithms</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">{ALGORITHMS.map((a) => <AlgorithmCard key={a.id} title={a.name} description={a.description} complexity={a.complexity} featured={a.featured} />)}</div>
        </div>
      </Section>
      <Section title="Interactive Visualizer">
        <div className="flex gap-2 flex-wrap mb-5">{ALGORITHMS.map((a) => (<button key={a.id} onClick={() => setSelectedAlgo(a.id)} className={`px-4 py-2.5 rounded-lg text-xs font-medium cursor-pointer transition-all ${selectedAlgo === a.id ? "bg-indigo-50 text-indigo-600 border-2 border-indigo-500" : "bg-white text-slate-500 border border-slate-200 hover:border-indigo-400"}`}>{a.name}</button>))}</div>
        <VisualAnimationContainer title="Algorithm Visualization">
          <div className="bg-slate-50 rounded-lg p-10 text-center text-slate-500 h-[300px] flex items-center justify-center flex-col">
            <div className="text-5xl mb-3">💰</div>
            <p className="mb-4">{algo.name} Visualizer</p>
            <p className="text-xs max-w-xs text-slate-400">Watch greedy decisions being made step by step to build the optimal solution.</p>
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
          <div className="bg-white rounded-xl border border-slate-200 p-4"><h4 className="text-[10px] font-bold text-slate-400 uppercase mb-2 tracking-wider">Key Insight</h4><span className="text-xs text-slate-900 font-semibold">Greedy Choice Property</span></div>
        </div>
        <InfoCard title="Greedy Strategy" type="tip">{algo.id === "activity-selection" ? "Sort by finish time, always pick the earliest-finishing compatible activity. This leaves maximum room for remaining activities." : algo.id === "coin-change" ? "Always pick the largest coin not exceeding remaining amount. Works for standard coin systems (1,5,10,25) but may fail for non-canonical systems." : algo.id === "fractional-knapsack" ? "Sort by value/weight ratio, take as much as possible of the highest-value item. Since fractions are allowed, greedy is optimal here." : algo.id === "huffman" ? "Merge the two lowest-frequency characters into a tree. Repeat until one tree remains. This produces minimum-weight prefix codes." : "Sort by profit descending, schedule each job as late as possible before its deadline."}</InfoCard>
        <CodeBlock code={algo.code} language="python" />
        <StepByStepBreakdown steps={[{ step: 1, title: "Sort/Candidates", desc: "Arrange possible choices in order based on some criterion." }, { step: 2, title: "Make Greedy Choice", desc: "Select the best immediate option from remaining candidates." }, { step: 3, title: "Check Feasibility", desc: "Verify the choice satisfies constraints and maintains correctness." }, { step: 4, title: "Repeat", desc: "Continue until solution is complete or no candidates remain." }]} />
      </Section>
      <Section title="Real-World Applications"><div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">{USES.map((u, i) => (<div key={i} className="bg-white rounded-xl border border-slate-200 p-4"><h4 className="text-sm font-bold text-slate-900 mb-1.5">{u.title}</h4><p className="text-xs text-slate-500 leading-relaxed">{u.desc}</p></div>))}</div></Section>
      <Section title="Interview Questions">
        <InterviewQuestions questions={[
          { q: "When should you use greedy vs DP?", a: "Use greedy when the greedy choice property holds (local optimum → global optimum). Use DP when overlapping subproblems exist and greedy fails. Example: coin change with standard denominations works greedy; with arbitrary denominations, use DP." },
          { q: "What is the greedy choice property?", a: "A globally optimal solution can be arrived at by making locally optimal (greedy) choices at each step. Once made, these choices are never reconsidered." },
          { q: "What is optimal substructure?", a: "An optimal solution to the problem contains optimal solutions to subproblems. This property is shared by both greedy and DP problems." },
        ]} />
      </Section>
      <Section title="Knowledge Check">
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="space-y-5">{QUIZ.map((q, qi) => (<div key={qi}><p className="text-sm font-semibold text-slate-900 mb-3">{qi + 1}. {q.q}</p><div className="grid sm:grid-cols-2 gap-2">{q.options.map((opt, oi) => { const selected = quiz[qi] === oi; const correct = showResults && oi === q.answer; const wrong = showResults && selected && oi !== q.answer; return (<button key={oi} onClick={() => !showResults && handleAnswer(qi, oi)} className={`text-xs text-left px-4 py-2.5 rounded-lg border transition-all cursor-pointer ${correct ? "bg-green-50 border-green-500 text-green-700" : wrong ? "bg-red-50 border-red-500 text-red-700" : selected ? "bg-indigo-50 border-indigo-500 text-indigo-700" : "bg-white border-slate-200 text-slate-600 hover:border-indigo-400"}`}>{opt}</button>); })}</div></div>))}</div>
          <div className="flex gap-3 mt-6">{!showResults ? (<button onClick={() => setShowResults(true)} className="px-6 py-2.5 bg-indigo-600 text-white rounded-lg text-xs font-semibold cursor-pointer hover:bg-indigo-700 transition">Submit Answers</button>) : (<div className="flex items-center gap-4"><span className="text-sm font-bold text-slate-900">Score: {quizScore}/{QUIZ.length}</span><button onClick={() => { setQuiz({}); setShowResults(false); }} className="px-6 py-2.5 bg-slate-100 text-slate-600 rounded-lg text-xs font-semibold cursor-pointer hover:bg-slate-200 transition">Reset</button></div>)}</div>
        </div>
      </Section>
      <Section title="Common Mistakes to Avoid"><div className="flex flex-col gap-3">{MISTAKES.map((m, i) => (<div key={i} className="bg-red-50 border-l-4 border-red-500 rounded-lg p-3 flex gap-3"><span className="text-red-700 text-lg shrink-0">⚠️</span><p className="text-xs text-red-800 leading-relaxed">{m}</p></div>))}</div></Section>
      <Section title="What's Next?"><div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-xl p-6 text-white"><h3 className="text-lg font-bold mb-3">Advanced Topics</h3><p className="text-white/90 mb-4 text-sm">Build on greedy with these concepts:</p><div className="grid sm:grid-cols-3 gap-3">{[{ name: "Dynamic Programming", href: "/tools/algorithms/dynamic-programming" }, { name: "Graph Algorithms", href: "/tools/algorithms/graph" }, { name: "Backtracking", href: "/tools/algorithms/backtracking" }].map((t, i) => (<Link key={i} href={t.href} className="no-underline"><button className="w-full bg-white/20 border border-white/30 text-white py-3 rounded-lg font-semibold text-xs cursor-pointer hover:bg-white/30 transition">{t.name} →</button></Link>))}</div></div></Section>
    </div>
  );
}
