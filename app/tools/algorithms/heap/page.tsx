"use client";

import { useState } from "react";
import Link from "next/link";
import { Home, ChevronRight } from "lucide-react";
import { Section, ComplexityBadge, CodeBlock, InfoCard, StepByStepBreakdown, VisualAnimationContainer, InterviewQuestions, AlgorithmCard } from "../components";

const ALGORITHMS = [
  { id: "min-heap", name: "Min Heap Operations", description: "Build and operate on min heap (smallest element on top)", complexity: { time: "O(log n) push/pop", space: "O(n)" }, featured: true, code: `import heapq\n\n# Min heap (default in Python)\nheap = []\nheapq.heappush(heap, 5)\nheapq.heappush(heap, 3)\nheapq.heappush(heap, 7)\nsmallest = heapq.heappop(heap)  # 3\n\n# Build heap from list\nnums = [5, 3, 7, 1, 9]\nheapq.heapify(nums)\n# nums is now [1, 3, 7, 5, 9]` },
  { id: "max-heap", name: "Max Heap Operations", description: "Build and operate on max heap (largest element on top)", complexity: { time: "O(log n) push/pop", space: "O(n)" }, featured: false, code: `import heapq\n\n# Max heap using negative values\nheap = []\nheapq.heappush(heap, -5)\nheapq.heappush(heap, -3)\nheapq.heappush(heap, -7)\nlargest = -heapq.heappop(heap)  # 7\n\n# Or use tuple with negative priority\nheap = []\nheapq.heappush(heap, (-5, 5))\nheapq.heappush(heap, (-3, 3))` },
  { id: "heap-sort", name: "Heap Sort", description: "Sort array using heap data structure", complexity: { time: "O(n log n)", space: "O(1)" }, featured: true, code: `def heapSort(arr):\n    heapq.heapify(arr)\n    return [heapq.heappop(arr) for _ in range(len(arr))]\n\n# In-place heap sort:\ndef heapSortInPlace(arr):\n    n = len(arr)\n    for i in range(n // 2 - 1, -1, -1):\n        heapify(arr, n, i)\n    for i in range(n - 1, 0, -1):\n        arr[0], arr[i] = arr[i], arr[0]\n        heapify(arr, i, 0)\n    return arr\n\ndef heapify(arr, n, i):\n    largest = i\n    l, r = 2*i+1, 2*i+2\n    if l < n and arr[l] > arr[largest]: largest = l\n    if r < n and arr[r] > arr[largest]: largest = r\n    if largest != i:\n        arr[i], arr[largest] = arr[largest], arr[i]\n        heapify(arr, n, largest)` },
  { id: "kth-largest", name: "Kth Largest Element", description: "Find kth largest element in array efficiently", complexity: { time: "O(n log k)", space: "O(k)" }, featured: false, code: `import heapq\n\ndef findKthLargest(nums, k):\n    heap = nums[:k]\n    heapq.heapify(heap)\n    for num in nums[k:]:\n        if num > heap[0]:\n            heapq.heapreplace(heap, num)\n    return heap[0]` },
  { id: "merge-k-sorted", name: "Merge K Sorted Lists", description: "Merge k sorted linked lists into one sorted list", complexity: { time: "O(n log k)", space: "O(k)" }, featured: false, code: `import heapq\n\ndef mergeKLists(lists):\n    heap = []\n    for i, lst in enumerate(lists):\n        if lst:\n            heapq.heappush(heap, (lst.val, i, lst))\n    dummy = ListNode(0)\n    curr = dummy\n    while heap:\n        val, i, node = heapq.heappop(heap)\n        curr.next = ListNode(val)\n        curr = curr.next\n        if node.next:\n            heapq.heappush(heap, (node.next.val, i, node.next))\n    return dummy.next` },
];

const USES = [
  { title: "Priority Queues", desc: "Task scheduling with priorities, Dijkstra's algorithm" },
  { title: "Median Finding", desc: "Maintain running median with two heaps (min + max)" },
  { title: "Top K Elements", desc: "Find top K frequent elements using min-heap of size k" },
  { title: "CPU Scheduling", desc: "Process scheduling based on priority levels" },
  { title: "Event Simulation", desc: "Discrete event simulation with timestamps as priorities" },
  { title: "Data Compression", desc: "Huffman coding uses min-heap to build optimal prefix tree" },
];

const QUIZ = [
  { q: "What is the time complexity of heap push?", options: ["O(1)", "O(log n)", "O(n)", "O(n log n)"], answer: 1 },
  { q: "How do you implement max heap in Python?", options: ["Use deque", "Use negative values", "Use tuples", "Can't be done"], answer: 1 },
  { q: "What is heapify time complexity?", options: ["O(n)", "O(n log n)", "O(log n)", "O(n²)"], answer: 0 },
  { q: "Time complexity of Heap Sort?", options: ["O(n)", "O(n log n)", "O(n²)", "O(log n)"], answer: 1 },
  { q: "What is space complexity of finding Kth largest with heap?", options: ["O(1)", "O(k)", "O(n)", "O(log n)"], answer: 1 },
];

export default function HeapPage() {
  const [selected, setSelected] = useState("min-heap");
  const [quiz, setQuiz] = useState<Record<number, number>>({});
  const [showResults, setShowResults] = useState(false);
  const algo = ALGORITHMS.find((a) => a.id === selected)!;
  const handleAnswer = (qi: number, ai: number) => setQuiz((p) => ({ ...p, [qi]: ai }));
  const quizScore = QUIZ.reduce((s, q, i) => s + (quiz[i] === q.answer ? 1 : 0), 0);

  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      <div className="flex items-center gap-2 mb-6 text-xs text-slate-500">
        <Link href="/tools/algorithms" className="text-indigo-600 no-underline flex items-center gap-1.5 hover:text-indigo-800 transition"><Home size={16} /> Algorithms</Link>
        <ChevronRight size={16} /><span className="text-slate-900 font-semibold">Heap & Priority Queue</span>
      </div>
      <div className="mb-10">
        <h1 className="text-4xl font-extrabold text-slate-900 mb-3">📚 Heap & Priority Queue</h1>
        <p className="text-base text-slate-500 leading-relaxed max-w-xl">Master the heap data structure: min/max heaps, heap sort, priority queues, and their applications in algorithms.</p>
      </div>
      <Section title="Overview">
        <InfoCard title="What is a Heap?" type="info">A heap is a complete binary tree where each node is ≤ (min-heap) or ≥ (max-heap) its children. Heaps efficiently maintain the minimum or maximum element. Used for priority queues, heap sort, and top-k problems.</InfoCard>
        <div className="bg-white rounded-xl border border-slate-200 p-6 mb-4">
          <h3 className="text-base font-bold text-slate-900 mb-4">Key Heap Algorithms</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">{ALGORITHMS.map((a) => <AlgorithmCard key={a.id} title={a.name} description={a.description} complexity={a.complexity} featured={a.featured} />)}</div>
        </div>
      </Section>
      <Section title="Interactive Visualizer">
        <div className="flex gap-2 flex-wrap mb-5">{ALGORITHMS.map((a) => (<button key={a.id} onClick={() => setSelected(a.id)} className={`px-4 py-2.5 rounded-lg text-xs font-medium cursor-pointer transition-all ${selected === a.id ? "bg-indigo-50 text-indigo-600 border-2 border-indigo-500" : "bg-white text-slate-500 border border-slate-200 hover:border-indigo-400"}`}>{a.name}</button>))}</div>
        <VisualAnimationContainer title="Heap Visualization">
          <div className="bg-slate-50 rounded-lg p-10 text-center text-slate-500 h-[300px] flex items-center justify-center flex-col">
            <div className="text-5xl mb-3">📚</div>
            <p className="mb-4">{algo.name} Heap Visualizer</p>
            <p className="text-xs max-w-xs text-slate-400">Watch elements bubble up and down during heap operations, maintaining the heap property.</p>
          </div>
        </VisualAnimationContainer>
        <div className="bg-white rounded-xl border border-slate-200 p-5 grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <button className="py-2.5 bg-indigo-600 text-white border-none rounded-lg font-semibold cursor-pointer text-xs hover:bg-indigo-700 transition">Generate</button>
          <button className="py-2.5 bg-purple-600 text-white border-none rounded-lg font-semibold cursor-pointer text-xs hover:bg-purple-700 transition">Push Element</button>
          <button className="py-2.5 bg-amber-600 text-white border-none rounded-lg font-semibold cursor-pointer text-xs hover:bg-amber-700 transition">Pop Element</button>
          <button className="py-2.5 bg-red-500 text-white border-none rounded-lg font-semibold cursor-pointer text-xs hover:bg-red-600 transition">Reset</button>
        </div>
      </Section>
      <Section title={`Deep Dive: ${algo.name}`}>
        <div className="grid sm:grid-cols-3 gap-4 mb-5">
          <div className="bg-white rounded-xl border border-slate-200 p-4"><h4 className="text-[10px] font-bold text-slate-400 uppercase mb-2 tracking-wider">Time Complexity</h4><ComplexityBadge type="time" value={algo.complexity.time} /></div>
          <div className="bg-white rounded-xl border border-slate-200 p-4"><h4 className="text-[10px] font-bold text-slate-400 uppercase mb-2 tracking-wider">Space Complexity</h4><ComplexityBadge type="space" value={algo.complexity.space} /></div>
          <div className="bg-white rounded-xl border border-slate-200 p-4"><h4 className="text-[10px] font-bold text-slate-400 uppercase mb-2 tracking-wider">Heap Property</h4><span className="text-xs text-slate-900 font-semibold">{algo.id === "max-heap" ? "Parent ≥ Children" : "Parent ≤ Children"}</span></div>
        </div>
        <InfoCard title="How It Works" type="tip">{algo.id === "min-heap" || algo.id === "max-heap" ? `Push: Add element at end, bubble up until heap property restored. Pop: Remove root, move last element to root, bubble down. ${algo.id === "min-heap" ? "Root is always smallest." : "Root is always largest."}` : algo.id === "heap-sort" ? "Phase 1 (build heap): heapify the array O(n). Phase 2 (sort): repeatedly swap root with last element and restore heap property. Produces sorted array." : algo.id === "kth-largest" ? "Maintain a min-heap of size k. For each element, if larger than heap root, replace root. At end, root is the kth largest. Only O(k) memory needed." : "Push first node of each list into heap. Pop smallest, add to result, push next node from that list. Continue until heap empty."}</InfoCard>
        <CodeBlock code={algo.code} language="python" />
        <StepByStepBreakdown steps={[{ step: 1, title: "Initialize Heap", desc: "Create empty heap or heapify existing array in O(n)." }, { step: 2, title: "Push/Pop", desc: "Add elements with heappush, remove with heappop. Both O(log n)." }, { step: 3, title: "Access Root", desc: "Read heap[0] for minimum (min-heap) or maximum (max-heap with negatives)." }, { step: 4, title: "Maintain Size", desc: "For top-k problems, keep heap at size k, always removing smallest (min-heap) or largest (max-heap)." }]} />
      </Section>
      <Section title="Real-World Applications"><div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">{USES.map((u, i) => (<div key={i} className="bg-white rounded-xl border border-slate-200 p-4"><h4 className="text-sm font-bold text-slate-900 mb-1.5">{u.title}</h4><p className="text-xs text-slate-500 leading-relaxed">{u.desc}</p></div>))}</div></Section>
      <Section title="Interview Questions">
        <InterviewQuestions questions={[
          { q: "How is heap different from binary search tree?", a: "Heap: parent is min/max of subtree, no ordering between siblings. BST: left < root < right for all nodes. Heap: O(log n) min/max access. BST: O(log n) any value search." },
          { q: "What is heapify and why is it O(n)?", a: "Heapify builds a heap from an unsorted array in O(n). It applies bubble-down from the last non-leaf node to root. Most elements are near leaves and need few swaps, giving O(n) total." },
          { q: "How would you find median of streaming data?", a: "Use two heaps: max-heap for left half, min-heap for right half. Maintain size difference ≤1. Median is root of larger heap or average of both roots. O(log n) per insert." },
        ]} />
      </Section>
      <Section title="Knowledge Check">
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="space-y-5">{QUIZ.map((q, qi) => (<div key={qi}><p className="text-sm font-semibold text-slate-900 mb-3">{qi + 1}. {q.q}</p><div className="grid sm:grid-cols-2 gap-2">{q.options.map((opt, oi) => { const selected = quiz[qi] === oi; const correct = showResults && oi === q.answer; const wrong = showResults && selected && oi !== q.answer; return (<button key={oi} onClick={() => !showResults && handleAnswer(qi, oi)} className={`text-xs text-left px-4 py-2.5 rounded-lg border transition-all cursor-pointer ${correct ? "bg-green-50 border-green-500 text-green-700" : wrong ? "bg-red-50 border-red-500 text-red-700" : selected ? "bg-indigo-50 border-indigo-500 text-indigo-700" : "bg-white border-slate-200 text-slate-600 hover:border-indigo-400"}`}>{opt}</button>); })}</div></div>))}</div>
          <div className="flex gap-3 mt-6">{!showResults ? (<button onClick={() => setShowResults(true)} className="px-6 py-2.5 bg-indigo-600 text-white rounded-lg text-xs font-semibold cursor-pointer hover:bg-indigo-700 transition">Submit Answers</button>) : (<div className="flex items-center gap-4"><span className="text-sm font-bold text-slate-900">Score: {quizScore}/{QUIZ.length}</span><button onClick={() => { setQuiz({}); setShowResults(false); }} className="px-6 py-2.5 bg-slate-100 text-slate-600 rounded-lg text-xs font-semibold cursor-pointer hover:bg-slate-200 transition">Reset</button></div>)}</div>
        </div>
      </Section>
      <Section title="What's Next?"><div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-xl p-6 text-white"><h3 className="text-lg font-bold mb-3">Advanced Topics</h3><p className="text-white/90 mb-4 text-sm">Continue your learning:</p><div className="grid sm:grid-cols-3 gap-3">{[{ name: "Sorting Algorithms", href: "/tools/algorithms/sorting" }, { name: "Graph Algorithms", href: "/tools/algorithms/graph" }, { name: "Trie Algorithms", href: "/tools/algorithms/trie" }].map((t, i) => (<Link key={i} href={t.href} className="no-underline"><button className="w-full bg-white/20 border border-white/30 text-white py-3 rounded-lg font-semibold text-xs cursor-pointer hover:bg-white/30 transition">{t.name} →</button></Link>))}</div></div></Section>
    </div>
  );
}
