"use client";

import { useState } from "react";
import Link from "next/link";
import { Home, ChevronRight } from "lucide-react";
import { Section, ComplexityBadge, CodeBlock, InfoCard, StepByStepBreakdown, VisualAnimationContainer, InterviewQuestions, AlgorithmCard } from "../components";

const ALGORITHMS = [
  {
    id: "factorial",
    name: "Factorial",
    description: "Compute n! using recursive multiplication: n × (n-1)!",
    complexity: { time: "O(n)", space: "O(n)" },
    featured: false,
    code: `def factorial(n):
    if n <= 1:
        return 1
    return n * factorial(n - 1)`,
  },
  {
    id: "fibonacci",
    name: "Fibonacci",
    description: "Classic recursive sequence where each number is sum of two preceding",
    complexity: { time: "O(2ⁿ)", space: "O(n)" },
    featured: true,
    code: `def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n - 1) + fibonacci(n - 2)`,
  },
  {
    id: "tower-of-hanoi",
    name: "Tower of Hanoi",
    description: "Move n disks from source to destination using auxiliary peg",
    complexity: { time: "O(2ⁿ)", space: "O(n)" },
    featured: false,
    code: `def towerOfHanoi(n, source, dest, aux):
    if n == 1:
        print(f"Move disk 1 from {source} to {dest}")
        return
    towerOfHanoi(n - 1, source, aux, dest)
    print(f"Move disk {n} from {source} to {dest}")
    towerOfHanoi(n - 1, aux, dest, source)`,
  },
  {
    id: "power-set",
    name: "Power Set",
    description: "Generate all subsets of a set using recursive inclusion/exclusion",
    complexity: { time: "O(2ⁿ)", space: "O(n)" },
    featured: false,
    code: `def powerSet(nums):
    result = []
    def backtrack(start, path):
        result.append(path[:])
        for i in range(start, len(nums)):
            path.append(nums[i])
            backtrack(i + 1, path)
            path.pop()
    backtrack(0, [])
    return result`,
  },
];

const USES = [
  { title: "File System Traversal", desc: "Recursively navigate directory trees to list, search, or process files" },
  { title: "Tree & Graph Algorithms", desc: "DFS, tree traversals (preorder, inorder, postorder) are inherently recursive" },
  { title: "Parsing Expressions", desc: "Recursive descent parsers evaluate mathematical expressions and programming languages" },
  { title: "Divide & Conquer", desc: "Merge Sort, Quick Sort, Binary Search all use recursion naturally" },
  { title: "Backtracking Problems", desc: "N-Queens, Sudoku, permutations use recursion to explore solution spaces" },
  { title: "Fractal Generation", desc: "Mathematical fractals like Mandelbrot set use recursive patterns" },
];

const MISTAKES = [
  "Missing base case - leads to infinite recursion and stack overflow",
  "Not reducing problem size - each call must move toward the base case",
  "Stack overflow from deep recursion - consider iterative approach for large inputs",
  "Recomputing same subproblems - use memoization for overlapping subproblems (Fibonacci)",
  "Not understanding recursion vs iteration tradeoffs - recursion isn't always better",
];

const QUIZ = [
  { q: "What is a base case in recursion?", options: ["The simplest case that stops recursion", "The first recursive call", "A case that always returns 0", "The last recursive call"], answer: 0 },
  { q: "What is the space complexity of a recursive function that calls itself n times?", options: ["O(1)", "O(log n)", "O(n)", "O(n²)"], answer: 2 },
  { q: "Which data structure is used internally to manage recursive function calls?", options: ["Queue", "Stack", "Heap", "Tree"], answer: 1 },
  { q: "What happens if a recursive function has no base case?", options: ["Returns 0", "Stack overflow", "Returns null", "Infinite loop"], answer: 1 },
  { q: "What technique optimizes recursive functions that recompute the same subproblems?", options: ["Iteration", "Memoization", "Tail recursion", "Loop unrolling"], answer: 1 },
];

export default function RecursionPage() {
  const [selectedAlgo, setSelectedAlgo] = useState("factorial");
  const [quiz, setQuiz] = useState<Record<number, number>>({});
  const [showResults, setShowResults] = useState(false);
  const algo = ALGORITHMS.find((a) => a.id === selectedAlgo)!;

  const handleAnswer = (qi: number, ai: number) => {
    setQuiz((p) => ({ ...p, [qi]: ai }));
  };

  const quizScore = QUIZ.reduce((s, q, i) => s + (quiz[i] === q.answer ? 1 : 0), 0);

  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      <div className="flex items-center gap-2 mb-6 text-xs text-slate-500">
        <Link href="/tools/algorithms" className="text-indigo-600 no-underline flex items-center gap-1.5 hover:text-indigo-800 transition"><Home size={16} /> Algorithms</Link>
        <ChevronRight size={16} />
        <span className="text-slate-900 font-semibold">Recursion</span>
      </div>

      <div className="mb-10">
        <h1 className="text-4xl font-extrabold text-slate-900 mb-3">🔄 Recursion</h1>
        <p className="text-base text-slate-500 leading-relaxed max-w-xl">
          Solve problems by breaking them into smaller subproblems. Master base cases, recursive calls, and call stack visualization.
        </p>
      </div>

      <Section title="Overview">
        <InfoCard title="What is Recursion?" type="info">
          Recursion is a technique where a function calls itself to solve smaller instances of the same problem. Every recursive function needs: 1) A base case that stops the recursion, and 2) A recursive case that moves toward the base case. Understanding the call stack is key to mastering recursion.
        </InfoCard>
        <div className="bg-white rounded-xl border border-slate-200 p-6 mb-4">
          <h3 className="text-base font-bold text-slate-900 mb-4">Key Recursive Algorithms</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {ALGORITHMS.map((a) => (
              <AlgorithmCard key={a.id} title={a.name} description={a.description} complexity={a.complexity} featured={a.featured} />
            ))}
          </div>
        </div>
      </Section>

      <Section title="Interactive Visualizer">
        <div className="flex gap-2 flex-wrap mb-5">
          {ALGORITHMS.map((a) => (
            <button key={a.id} onClick={() => setSelectedAlgo(a.id)}
              className={`px-4 py-2.5 rounded-lg text-xs font-medium cursor-pointer transition-all ${selectedAlgo === a.id ? "bg-indigo-50 text-indigo-600 border-2 border-indigo-500" : "bg-white text-slate-500 border border-slate-200 hover:border-indigo-400"}`}>{a.name}</button>
          ))}
        </div>
        <VisualAnimationContainer title="Recursion Tree Visualization">
          <div className="bg-slate-50 rounded-lg p-10 text-center text-slate-500 h-[300px] flex items-center justify-center flex-col">
            <div className="text-5xl mb-3">🔄</div>
            <p className="mb-4">{algo.name} Recursion Tree</p>
            <p className="text-xs max-w-xs text-slate-400">Watch how recursive calls build up the call stack and unwind as base cases are reached.</p>
          </div>
        </VisualAnimationContainer>
        <div className="bg-white rounded-xl border border-slate-200 p-5 grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <button className="py-2.5 bg-indigo-600 text-white border-none rounded-lg font-semibold cursor-pointer text-xs hover:bg-indigo-700 transition">Start Animation</button>
          <button className="py-2.5 bg-purple-600 text-white border-none rounded-lg font-semibold cursor-pointer text-xs hover:bg-purple-700 transition">Step Forward</button>
          <input type="range" min="1" max="10" defaultValue="5" className="w-full" />
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
            <h4 className="text-[10px] font-bold text-slate-400 uppercase mb-2 tracking-wider">Stack Depth</h4>
            <span className="text-xs text-slate-900 font-semibold">{algo.id === "factorial" ? "n" : algo.id === "fibonacci" ? "n" : algo.id === "tower-of-hanoi" ? "n" : "n"}</span>
          </div>
        </div>
        <InfoCard title="How It Works" type="tip">
          {algo.id === "factorial" ? "Factorial(n) = n × Factorial(n-1). Base case: n ≤ 1 returns 1. Each call reduces n by 1 until reaching the base case, then unwinds multiplying results." :
           algo.id === "fibonacci" ? "Fibonacci(n) = Fibonacci(n-1) + Fibonacci(n-2). Base cases: n=0 returns 0, n=1 returns 1. Without memoization, this makes O(2ⁿ) calls." :
           algo.id === "tower-of-hanoi" ? "To move n disks: move n-1 to aux, move largest to dest, move n-1 from aux to dest. Base case: 1 disk moves directly." :
           "For each element, either include it or exclude it. This generates all 2ⁿ subsets recursively."}
        </InfoCard>
        <CodeBlock code={algo.code} language="python" />
        <StepByStepBreakdown steps={[
          { step: 1, title: "Identify Base Case", desc: "Determine the simplest input that can be solved without recursion." },
          { step: 2, title: "Define Recursive Case", desc: "Express the problem in terms of smaller instances of itself." },
          { step: 3, title: "Ensure Progress", desc: "Each recursive call must move closer to the base case." },
          { step: 4, title: "Combine Results", desc: "Use returned values from recursive calls to build the final answer." },
        ]} />
      </Section>

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

      <Section title="Interview Questions">
        <InterviewQuestions questions={[
          { q: "What's the difference between recursion and iteration?", a: "Recursion uses function calls and the call stack; iteration uses loops. Recursion is cleaner for problems with recursive structure (trees, graphs). Iteration is generally more efficient (no function call overhead) and avoids stack overflow." },
          { q: "What is tail recursion? Why is it important?", a: "Tail recursion is when the recursive call is the last operation in the function. Some compilers optimize tail recursion into iteration (TCO - Tail Call Optimization), making it as efficient as a loop. Python doesn't have TCO by default." },
          { q: "How would you convert a recursive function to iterative?", a: "Use an explicit stack (data structure) to simulate the call stack. This is always possible since recursion uses the call stack internally. Example: depth-first tree traversal can be done recursively or iteratively with a stack." },
          { q: "What causes stack overflow in recursion?", a: "Each recursive call adds a frame to the call stack. If the recursion is too deep (thousands of calls), the stack runs out of memory. This happens when: 1) no base case, 2) problem size is too large, 3) base case is never reached." },
        ]} />
      </Section>

      <Section title="Knowledge Check">
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="space-y-5">
            {QUIZ.map((q, qi) => (
              <div key={qi}>
                <p className="text-sm font-semibold text-slate-900 mb-3">{qi + 1}. {q.q}</p>
                <div className="grid sm:grid-cols-2 gap-2">
                  {q.options.map((opt, oi) => {
                    const selected = quiz[qi] === oi;
                    const correct = showResults && oi === q.answer;
                    const wrong = showResults && selected && oi !== q.answer;
                    return (
                      <button key={oi} onClick={() => !showResults && handleAnswer(qi, oi)}
                        className={`text-xs text-left px-4 py-2.5 rounded-lg border transition-all cursor-pointer ${
                          correct ? "bg-green-50 border-green-500 text-green-700" :
                          wrong ? "bg-red-50 border-red-500 text-red-700" :
                          selected ? "bg-indigo-50 border-indigo-500 text-indigo-700" :
                          "bg-white border-slate-200 text-slate-600 hover:border-indigo-400"
                        }`}>{opt}</button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
          <div className="flex gap-3 mt-6">
            {!showResults ? (
              <button onClick={() => setShowResults(true)} className="px-6 py-2.5 bg-indigo-600 text-white rounded-lg text-xs font-semibold cursor-pointer hover:bg-indigo-700 transition">Submit Answers</button>
            ) : (
              <div className="flex items-center gap-4">
                <span className="text-sm font-bold text-slate-900">Score: {quizScore}/{QUIZ.length}</span>
                <button onClick={() => { setQuiz({}); setShowResults(false); }} className="px-6 py-2.5 bg-slate-100 text-slate-600 rounded-lg text-xs font-semibold cursor-pointer hover:bg-slate-200 transition">Reset</button>
              </div>
            )}
          </div>
        </div>
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
          <h3 className="text-lg font-bold mb-3">Master Related Topics</h3>
          <p className="text-white/90 mb-4 text-sm">After recursion, explore these related concepts:</p>
          <div className="grid sm:grid-cols-3 gap-3">
            {[
              { name: "Dynamic Programming", href: "/tools/algorithms/dynamic-programming" },
              { name: "Tree Algorithms", href: "/tools/algorithms/tree" },
              { name: "Backtracking", href: "/tools/algorithms/backtracking" },
            ].map((topic, i) => (
              <Link key={i} href={topic.href} className="no-underline">
                <button className="w-full bg-white/20 border border-white/30 text-white py-3 rounded-lg font-semibold text-xs cursor-pointer hover:bg-white/30 transition">{topic.name} →</button>
              </Link>
            ))}
          </div>
        </div>
      </Section>
    </div>
  );
}
