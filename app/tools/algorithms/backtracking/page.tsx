"use client";

import { useState } from "react";
import Link from "next/link";
import { Home, ChevronRight } from "lucide-react";
import { Section, ComplexityBadge, CodeBlock, InfoCard, StepByStepBreakdown, VisualAnimationContainer, InterviewQuestions, AlgorithmCard } from "../components";

const ALGORITHMS = [
  { id: "n-queens", name: "N-Queens", description: "Place N queens on N×N board so none attack each other", complexity: { time: "O(N!)", space: "O(N²)" }, featured: true, code: `def solveNQueens(n):\n    cols, diag1, diag2 = set(), set(), set()\n    result = []\n    board = [["."]*n for _ in range(n)]\n    def backtrack(row):\n        if row == n:\n            result.append(["".join(r) for r in board])\n            return\n        for col in range(n):\n            if col in cols or (row-col) in diag1 or (row+col) in diag2:\n                continue\n            board[row][col] = "Q"\n            cols.add(col); diag1.add(row-col); diag2.add(row+col)\n            backtrack(row + 1)\n            board[row][col] = "."\n            cols.remove(col); diag1.remove(row-col); diag2.remove(row+col)\n    backtrack(0)\n    return result` },
  { id: "sudoku", name: "Sudoku Solver", description: "Solve 9×9 Sudoku puzzle using constraint satisfaction", complexity: { time: "O(9^(n²))", space: "O(n²)" }, featured: true, code: `def solveSudoku(board):\n    def isValid(board, row, col, num):\n        for i in range(9):\n            if board[row][i] == num: return False\n            if board[i][col] == num: return False\n            br, bc = 3*(row//3)+i//3, 3*(col//3)+i%3\n            if board[br][bc] == num: return False\n        return True\n    def backtrack(board):\n        for i in range(9):\n            for j in range(9):\n                if board[i][j] == ".":\n                    for num in "123456789":\n                        if isValid(board, i, j, num):\n                            board[i][j] = num\n                            if backtrack(board): return True\n                            board[i][j] = "."\n                    return False\n        return True\n    backtrack(board)` },
  { id: "permutations", name: "Permutations", description: "Generate all permutations of an array", complexity: { time: "O(n!)", space: "O(n)" }, featured: false, code: `def permute(nums):\n    result = []\n    def backtrack(path, used):\n        if len(path) == len(nums):\n            result.append(path[:])\n            return\n        for i in range(len(nums)):\n            if used[i]: continue\n            path.append(nums[i])\n            used[i] = True\n            backtrack(path, used)\n            path.pop()\n            used[i] = False\n    backtrack([], [False]*len(nums))\n    return result` },
  { id: "subsets", name: "Subsets", description: "Generate all possible subsets of a set", complexity: { time: "O(2ⁿ)", space: "O(n)" }, featured: false, code: `def subsets(nums):\n    result = []\n    def backtrack(start, path):\n        result.append(path[:])\n        for i in range(start, len(nums)):\n            path.append(nums[i])\n            backtrack(i + 1, path)\n            path.pop()\n    backtrack(0, [])\n    return result` },
  { id: "combination-sum", name: "Combination Sum", description: "Find combinations summing to target (unlimited use)", complexity: { time: "O(2^t)", space: "O(t)" }, featured: false, code: `def combinationSum(candidates, target):\n    result = []\n    def backtrack(start, path, total):\n        if total == target:\n            result.append(path[:])\n            return\n        if total > target:\n            return\n        for i in range(start, len(candidates)):\n            path.append(candidates[i])\n            backtrack(i, path, total + candidates[i])\n            path.pop()\n    backtrack(0, [], 0)\n    return result` },
];

const USES = [
  { title: "Constraint Satisfaction", desc: "Sudoku, crosswords, map coloring, scheduling with constraints" },
  { title: "Combinatorial Optimization", desc: "Traveling salesman, knapsack, graph coloring" },
  { title: "AI & Game Playing", desc: "Chess engines, tic-tac-toe, puzzle solvers use backtracking" },
  { title: "Configuration Problems", desc: "Assigning resources, timetabling, seating arrangements" },
  { title: "Language Parsing", desc: "Context-free grammar parsing, regular expression matching" },
  { title: "Path Finding", desc: "Finding all paths in a maze, Hamiltonian paths" },
];

const QUIZ = [
  { q: "What is the central idea of backtracking?", options: ["Build solution incrementally", "Divide and conquer", "Use dynamic programming", "Sort first"], answer: 0 },
  { q: "What does 'pruning' mean in backtracking?", options: ["Removing duplicates", "Cutting branches that can't lead to solution", "Sorting candidates", "Optimizing with DP"], answer: 1 },
  { q: "Time complexity of N-Queens?", options: ["O(2ⁿ)", "O(n!)", "O(n log n)", "O(n²)"], answer: 1 },
  { q: "When does backtracking stop exploring a branch?", options: ["When path is too long", "When partial solution can't be completed", "When sorting fails", "All of the above"], answer: 1 },
  { q: "What data structure is commonly used?" , options: ["Queue", "Stack (recursion)", "Heap", "Hash table"], answer: 1 },
];

export default function BacktrackingPage() {
  const [selectedAlgo, setSelectedAlgo] = useState("n-queens");
  const [quiz, setQuiz] = useState<Record<number, number>>({});
  const [showResults, setShowResults] = useState(false);
  const algo = ALGORITHMS.find((a) => a.id === selectedAlgo)!;
  const handleAnswer = (qi: number, ai: number) => setQuiz((p) => ({ ...p, [qi]: ai }));
  const quizScore = QUIZ.reduce((s, q, i) => s + (quiz[i] === q.answer ? 1 : 0), 0);

  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      <div className="flex items-center gap-2 mb-6 text-xs text-slate-500">
        <Link href="/tools/algorithms" className="text-indigo-600 no-underline flex items-center gap-1.5 hover:text-indigo-800 transition"><Home size={16} /> Algorithms</Link>
        <ChevronRight size={16} /><span className="text-slate-900 font-semibold">Backtracking</span>
      </div>
      <div className="mb-10">
        <h1 className="text-4xl font-extrabold text-slate-900 mb-3">↩️ Backtracking</h1>
        <p className="text-base text-slate-500 leading-relaxed max-w-xl">Systematically search for solutions by building candidates incrementally and abandoning dead ends. Master N-Queens, Sudoku, and permutation generation.</p>
      </div>
      <Section title="Overview">
        <InfoCard title="What is Backtracking?" type="info">Backtracking incrementally builds candidates for solutions and abandons them (backtracks) when they can't lead to a valid solution. It's essentially DFS on the solution space tree. Key: prune branches that can't yield valid solutions to improve performance.</InfoCard>
        <div className="bg-white rounded-xl border border-slate-200 p-6 mb-4">
          <h3 className="text-base font-bold text-slate-900 mb-4">Key Backtracking Algorithms</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">{ALGORITHMS.map((a) => <AlgorithmCard key={a.id} title={a.name} description={a.description} complexity={a.complexity} featured={a.featured} />)}</div>
        </div>
      </Section>
      <Section title="Interactive Visualizer">
        <div className="flex gap-2 flex-wrap mb-5">{ALGORITHMS.map((a) => (<button key={a.id} onClick={() => setSelectedAlgo(a.id)} className={`px-4 py-2.5 rounded-lg text-xs font-medium cursor-pointer transition-all ${selectedAlgo === a.id ? "bg-indigo-50 text-indigo-600 border-2 border-indigo-500" : "bg-white text-slate-500 border border-slate-200 hover:border-indigo-400"}`}>{a.name}</button>))}</div>
        <VisualAnimationContainer title="Backtracking Tree Visualization">
          <div className="bg-slate-50 rounded-lg p-10 text-center text-slate-500 h-[300px] flex items-center justify-center flex-col">
            <div className="text-5xl mb-3">↩️</div>
            <p className="mb-4">{algo.name} Backtracking Tree</p>
            <p className="text-xs max-w-xs text-slate-400">See how the algorithm explores branches and backtracks when a constraint is violated.</p>
          </div>
        </VisualAnimationContainer>
        <div className="bg-white rounded-xl border border-slate-200 p-5 grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <button className="py-2.5 bg-indigo-600 text-white border-none rounded-lg font-semibold cursor-pointer text-xs hover:bg-indigo-700 transition">Start Search</button>
          <button className="py-2.5 bg-purple-600 text-white border-none rounded-lg font-semibold cursor-pointer text-xs hover:bg-purple-700 transition">Step Forward</button>
          <input type="range" min="0.1" max="2" step="0.1" defaultValue="1" className="w-full" />
          <button className="py-2.5 bg-red-500 text-white border-none rounded-lg font-semibold cursor-pointer text-xs hover:bg-red-600 transition">Reset</button>
        </div>
      </Section>
      <Section title={`Deep Dive: ${algo.name}`}>
        <div className="grid sm:grid-cols-3 gap-4 mb-5">
          <div className="bg-white rounded-xl border border-slate-200 p-4"><h4 className="text-[10px] font-bold text-slate-400 uppercase mb-2 tracking-wider">Time Complexity</h4><ComplexityBadge type="time" value={algo.complexity.time} /></div>
          <div className="bg-white rounded-xl border border-slate-200 p-4"><h4 className="text-[10px] font-bold text-slate-400 uppercase mb-2 tracking-wider">Space Complexity</h4><ComplexityBadge type="space" value={algo.complexity.space} /></div>
          <div className="bg-white rounded-xl border border-slate-200 p-4"><h4 className="text-[10px] font-bold text-slate-400 uppercase mb-2 tracking-wider">Paradigm</h4><span className="text-xs text-slate-900 font-semibold">Systematic Search</span></div>
        </div>
        <InfoCard title="How It Works" type="tip">{algo.id === "n-queens" ? "Place queens row by row. For each row, try each column. If placement is safe, recurse to next row. If no safe column exists, backtrack to previous row and try next column." : algo.id === "sudoku" ? "Find empty cell, try digits 1-9. If digit is valid, recurse. If no digit works, backtrack. Use isValid to prune invalid placements early." : algo.id === "permutations" ? "Build permutations by choosing unused elements. Track used elements with a boolean array. When path length equals array length, we have a complete permutation." : algo.id === "subsets" ? "At each element, make a choice: include or exclude. The subsets are collected at every node of the recursion tree (not just leaves)." : "At each step, pick a candidate and add to current sum. If sum matches target, record solution. If sum exceeds target, backtrack. Same element can be reused."}</InfoCard>
        <CodeBlock code={algo.code} language="python" />
        <StepByStepBreakdown steps={[{ step: 1, title: "Choose", desc: "Make a decision from available options at current state." }, { step: 2, title: "Constrain", desc: "Check if decision leads to a valid partial solution. If not, prune." }, { step: 3, title: "Recurse", desc: "Move to next decision point with updated state." }, { step: 4, title: "Unchoose", desc: "Undo the decision (backtrack) and try the next option." }]} />
      </Section>
      <Section title="Real-World Applications"><div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">{USES.map((u, i) => (<div key={i} className="bg-white rounded-xl border border-slate-200 p-4"><h4 className="text-sm font-bold text-slate-900 mb-1.5">{u.title}</h4><p className="text-xs text-slate-500 leading-relaxed">{u.desc}</p></div>))}</div></Section>
      <Section title="Interview Questions">
        <InterviewQuestions questions={[
          { q: "How is backtracking different from brute force?", a: "Brute force generates all candidates then checks validity. Backtracking prunes invalid branches early, drastically reducing the search space. This is what makes N-Queens tractable for N up to 20+." },
          { q: "What is pruning in backtracking?", a: "Pruning is eliminating branches that cannot lead to a valid solution without fully exploring them. Good pruning is the key to efficient backtracking. Example: in N-Queens, if two queens share same diagonal, prune." },
          { q: "How do you optimize backtracking?", a: "1) Prune aggressively, 2) Order candidates wisely (most constrained first), 3) Use symmetry breaking, 4) Use bitmasks for faster constraint checks." },
          { q: "Can all backtracking problems be solved with DP?", a: "No. Backtracking explores all possibilities (exhaustive). DP optimizes overlapping subproblems. If subproblems don't overlap, DP doesn't help. Backtracking is needed for combinatorial enumeration." },
        ]} />
      </Section>
      <Section title="Knowledge Check">
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="space-y-5">{QUIZ.map((q, qi) => (<div key={qi}><p className="text-sm font-semibold text-slate-900 mb-3">{qi + 1}. {q.q}</p><div className="grid sm:grid-cols-2 gap-2">{q.options.map((opt, oi) => { const selected = quiz[qi] === oi; const correct = showResults && oi === q.answer; const wrong = showResults && selected && oi !== q.answer; return (<button key={oi} onClick={() => !showResults && handleAnswer(qi, oi)} className={`text-xs text-left px-4 py-2.5 rounded-lg border transition-all cursor-pointer ${correct ? "bg-green-50 border-green-500 text-green-700" : wrong ? "bg-red-50 border-red-500 text-red-700" : selected ? "bg-indigo-50 border-indigo-500 text-indigo-700" : "bg-white border-slate-200 text-slate-600 hover:border-indigo-400"}`}>{opt}</button>); })}</div></div>))}</div>
          <div className="flex gap-3 mt-6">{!showResults ? (<button onClick={() => setShowResults(true)} className="px-6 py-2.5 bg-indigo-600 text-white rounded-lg text-xs font-semibold cursor-pointer hover:bg-indigo-700 transition">Submit Answers</button>) : (<div className="flex items-center gap-4"><span className="text-sm font-bold text-slate-900">Score: {quizScore}/{QUIZ.length}</span><button onClick={() => { setQuiz({}); setShowResults(false); }} className="px-6 py-2.5 bg-slate-100 text-slate-600 rounded-lg text-xs font-semibold cursor-pointer hover:bg-slate-200 transition">Reset</button></div>)}</div>
        </div>
      </Section>
      <Section title="What's Next?"><div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-xl p-6 text-white"><h3 className="text-lg font-bold mb-3">Explore Related Topics</h3><p className="text-white/90 mb-4 text-sm">Continue your learning journey:</p><div className="grid sm:grid-cols-3 gap-3">{[{ name: "Recursion", href: "/tools/algorithms/recursion" }, { name: "Dynamic Programming", href: "/tools/algorithms/dynamic-programming" }, { name: "Graph Algorithms", href: "/tools/algorithms/graph" }].map((t, i) => (<Link key={i} href={t.href} className="no-underline"><button className="w-full bg-white/20 border border-white/30 text-white py-3 rounded-lg font-semibold text-xs cursor-pointer hover:bg-white/30 transition">{t.name} →</button></Link>))}</div></div></Section>
    </div>
  );
}
