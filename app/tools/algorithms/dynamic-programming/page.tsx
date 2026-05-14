"use client";

import { useState } from "react";
import Link from "next/link";
import { Home, ChevronRight } from "lucide-react";
import { Section, ComplexityBadge, CodeBlock, InfoCard, StepByStepBreakdown, VisualAnimationContainer, InterviewQuestions, AlgorithmCard } from "../components";

const DP_ALGORITHMS = [
  {
    id: "fibonacci",
    name: "Fibonacci Sequence",
    description: "Classic problem: compute nth Fibonacci number with memoization",
    complexity: { time: "O(n)", space: "O(n)" },
    featured: false,
    code: `# Memoization approach
def fib(n, memo = {}):
    if n in memo:
        return memo[n]
    if n <= 1:
        return n
    memo[n] = fib(n - 1, memo) + fib(n - 2, memo)
    return memo[n]

# Tabulation approach
def fibTab(n):
    dp = [0] * (n + 1)
    dp[1] = 1
    for i in range(2, n + 1):
        dp[i] = dp[i - 1] + dp[i - 2]
    return dp[n]`,
  },
  {
    id: "coin-change",
    name: "Coin Change Problem",
    description: "Minimum coins needed to make a target amount",
    complexity: { time: "O(n*amount)", space: "O(amount)" },
    featured: true,
    code: `def coinChange(coins, amount):
    dp = [float('inf')] * (amount + 1)
    dp[0] = 0
    for i in range(1, amount + 1):
        for coin in coins:
            if coin <= i:
                dp[i] = min(dp[i], dp[i - coin] + 1)
    return dp[amount] if dp[amount] != float('inf') else -1`,
  },
  {
    id: "lcs",
    name: "Longest Common Subsequence",
    description: "Find longest subsequence common to two strings",
    complexity: { time: "O(n*m)", space: "O(n*m)" },
    featured: false,
    code: `def longestCommonSubsequence(text1, text2):
    m, n = len(text1), len(text2)
    dp = [[0] * (n + 1) for _ in range(m + 1)]
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if text1[i - 1] == text2[j - 1]:
                dp[i][j] = dp[i - 1][j - 1] + 1
            else:
                dp[i][j] = max(dp[i - 1][j], dp[i][j - 1])
    return dp[m][n]`,
  },
  {
    id: "knapsack",
    name: "0/1 Knapsack",
    description: "Maximize value with weight constraint",
    complexity: { time: "O(n*W)", space: "O(W)" },
    featured: false,
    code: `def knapsack(weights, values, W):
    n = len(weights)
    dp = [0] * (W + 1)
    for i in range(n):
        for w in range(W, weights[i] - 1, -1):
            dp[w] = max(dp[w], dp[w - weights[i]] + values[i])
    return dp[W]`,
  },
  {
    id: "edit-distance",
    name: "Edit Distance",
    description: "Minimum operations to convert one string to another",
    complexity: { time: "O(n*m)", space: "O(n*m)" },
    featured: false,
    code: `def editDistance(word1, word2):
    m, n = len(word1), len(word2)
    dp = [[0] * (n + 1) for _ in range(m + 1)]
    for i in range(m + 1):
        dp[i][0] = i
    for j in range(n + 1):
        dp[0][j] = j
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if word1[i - 1] == word2[j - 1]:
                dp[i][j] = dp[i - 1][j - 1]
            else:
                dp[i][j] = 1 + min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1])
    return dp[m][n]`,
  },
];

const PROBLEMS = [
  { title: "Climbing Stairs", pattern: "dp[i] = dp[i-1] + dp[i-2]", diff: "Easy" },
  { title: "House Robber", pattern: "Max of adjacent or current + skip", diff: "Medium" },
  { title: "Longest Increasing Subsequence", pattern: "dp[i] = 1 + max(dp[j]) for j < i", diff: "Medium" },
  { title: "Palindrome Substring", pattern: "Expand center or DP table", diff: "Medium" },
  { title: "Word Break", pattern: "dp[i] = can segment s[0:i]", diff: "Medium" },
  { title: "Maximum Subarray", pattern: "Kadane's algorithm: dp[i] = max(arr[i], dp[i-1] + arr[i])", diff: "Easy" },
];

const MISTAKES = [
  "Starting with tabulation before understanding the recursive solution",
  "Not defining base cases properly - the foundation of correct DP",
  "Using too large a state space - carefully choose what to memoize",
  "Forgetting to handle edge cases: empty input, single element, zero amount",
  "Confusing top-down (memoization) with bottom-up (tabulation) approach",
];

export default function DynamicProgrammingPage() {
  const [selected, setSelected] = useState("fibonacci");
  const algo = DP_ALGORITHMS.find((a) => a.id === selected)!;

  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      <div className="flex items-center gap-2 mb-6 text-xs text-slate-500">
        <Link href="/tools/algorithms" className="text-indigo-600 no-underline flex items-center gap-1.5 hover:text-indigo-800 transition">
          <Home size={16} /> Algorithms
        </Link>
        <ChevronRight size={16} />
        <span className="text-slate-900 font-semibold">Dynamic Programming</span>
      </div>

      <div className="mb-10">
        <h1 className="text-4xl font-extrabold text-slate-900 mb-3">🧩 Dynamic Programming</h1>
        <p className="text-base text-slate-500 leading-relaxed max-w-xl">
          Solve complex problems by breaking them into overlapping subproblems. Master memoization, tabulation, and state transition design.
        </p>
      </div>

      <Section title="Overview">
        <InfoCard title="What is Dynamic Programming?" type="info">
          DP is an optimization technique that solves problems by combining solutions to overlapping subproblems. It's used when a problem has: 1) Optimal substructure - solution depends on optimal solutions to subproblems, 2) Overlapping subproblems - same subproblems recur multiple times.
        </InfoCard>
        
        <div className="bg-white rounded-xl border border-slate-200 p-6 mb-4">
          <h3 className="text-base font-bold text-slate-900 mb-4">Key DP Algorithms</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {DP_ALGORITHMS.map((algo) => (
              <AlgorithmCard key={algo.id} title={algo.name} description={algo.description} complexity={algo.complexity} featured={algo.featured} />
            ))}
          </div>
        </div>
      </Section>

      <Section title="Interactive Visualizer">
        <div className="flex gap-2 flex-wrap mb-5">
          {DP_ALGORITHMS.map((a) => (
            <button key={a.id} onClick={() => setSelected(a.id)}
              className={`px-4 py-2.5 rounded-lg text-xs font-medium cursor-pointer transition-all ${
                selected === a.id ? "bg-indigo-50 text-indigo-600 border-2 border-indigo-500" : "bg-white text-slate-500 border border-slate-200 hover:border-indigo-400"
              }`}>{a.name}</button>
          ))}
        </div>

        <VisualAnimationContainer title="DP Table Visualization">
          <div className="bg-slate-50 rounded-lg p-10 text-center text-slate-500 h-[300px] flex items-center justify-center flex-col">
            <div className="text-5xl mb-3">🧩</div>
            <p className="mb-4">{algo.name} DP Table Visualizer</p>
            <p className="text-xs max-w-xs text-slate-400">Watch how DP tables are filled row by row during the tabulation process.</p>
          </div>
        </VisualAnimationContainer>

        <div className="bg-white rounded-xl border border-slate-200 p-5 grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <button className="py-2.5 bg-indigo-600 text-white border-none rounded-lg font-semibold cursor-pointer text-xs hover:bg-indigo-700 transition">Reset Table</button>
          <button className="py-2.5 bg-purple-600 text-white border-none rounded-lg font-semibold cursor-pointer text-xs hover:bg-purple-700 transition">Step Forward</button>
          <input type="range" min="0.1" max="2" step="0.1" defaultValue="1" className="w-full" />
          <button className="py-2.5 bg-red-500 text-white border-none rounded-lg font-semibold cursor-pointer text-xs hover:bg-red-600 transition">Clear</button>
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
            <h4 className="text-[10px] font-bold text-slate-400 uppercase mb-2 tracking-wider">Approach</h4>
            <span className="text-xs text-slate-900 font-semibold">
              {selected === "fibonacci" ? "Top-down + Bottom-up" : "Tabulation (Bottom-up)"}
            </span>
          </div>
        </div>

        <InfoCard title="DP Pattern" type="tip">
          {algo.id === "fibonacci" ? "Fibonacci shows the essence of DP: memoizing recursive calls eliminates O(2ⁿ) redundant work, reducing it to O(n). The tabulation approach builds from base cases up." :
           algo.id === "coin-change" ? "Minimization problem: dp[i] = min over all coins of dp[i - coin] + 1. State: remaining amount. Transition: try each coin." :
           algo.id === "lcs" ? "Match/mismatch DP: if characters match, extend LCS by 1. Otherwise take max of skipping one character from either string." :
           algo.id === "knapsack" ? "For each item, decide: take it (if weight allows) or skip it. dp[w] = max(dp[w], dp[w - weight[i]] + value[i])." :
           "If characters match, copy diagonal. Otherwise take min of insert, delete, replace. dp[i][j] represents edit distance between first i chars of word1 and first j chars of word2."}
        </InfoCard>

        <CodeBlock code={algo.code} language="python" />

        <StepByStepBreakdown steps={[
          { step: 1, title: "Define State", desc: "What does dp[i] or dp[i][j] represent? This is the most important step." },
          { step: 2, title: "Base Cases", desc: "Initialize dp[0], dp[0][0], etc. with known starting values." },
          { step: 3, title: "State Transition", desc: "How does dp[i] relate to previous states? This is the recurrence relation." },
          { step: 4, title: "Return Result", desc: "The answer is usually dp[n], dp[m][n], or the best value in the table." },
        ]} />
      </Section>

      <Section title="Common DP Problems">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {PROBLEMS.map((p, i) => (
            <div key={i} className="bg-white rounded-xl border border-slate-200 p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-bold text-slate-900">{p.title}</h4>
                <span className={`text-[10px] px-2 py-1 rounded-md font-semibold uppercase ${
                  p.diff === "Easy" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
                }`}>{p.diff}</span>
              </div>
              <p className="text-xs text-slate-500 font-mono bg-slate-50 rounded p-2">{p.pattern}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Interview Questions">
        <InterviewQuestions questions={[
          { q: "What's the difference between memoization and tabulation?", a: "Memoization (top-down) uses recursion + cache. Easier to code from recurrence relation but may hit recursion limits. Tabulation (bottom-up) is iterative, often more efficient in space, and avoids recursion overhead. Both have same time complexity." },
          { q: "How do you identify if DP can be applied?", a: "Look for: 1) Problem asks for optimum (min/max/longest/shortest), 2) Decisions affect future outcomes, 3) Overlapping subproblems - brute force recalculates same subproblems. Classic examples: Fibonacci, knapsack, LCS." },
          { q: "How do you optimize DP space?", a: "Check if dp[i] depends only on dp[i-1] or few previous states. You can use 1D array instead of 2D (e.g., knapsack), or just a few variables (e.g., Fibonacci: just 2 vars). This is called 'rolling array' optimization." },
        ]} />
      </Section>

      <Section title="Common Mistakes to Avoid">
        <div className="flex flex-col gap-3">
          {MISTAKES.map((m, i) => (
            <div key={i} className="bg-red-50 border-l-4 border-red-500 rounded-lg p-3 flex gap-3">
              <span className="text-red-700 text-lg shrink-0">⚠️</span>
              <p className="text-xs text-red-800 leading-relaxed">{m}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section title="What's Next?">
        <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-xl p-6 text-white">
          <h3 className="text-lg font-bold mb-3">Advanced DP Topics</h3>
          <p className="text-white/90 mb-4 text-sm">Level up with these advanced DP patterns:</p>
          <div className="grid sm:grid-cols-3 gap-3">
            {[
              { name: "Tree DP", url: "/tools/algorithms/tree" },
              { name: "Graph DP", url: "/tools/algorithms/graph" },
              { name: "Bitmask DP", url: "#" },
            ].map((topic, i) => (
              <Link key={i} href={topic.url} className="no-underline">
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
