"use client";

import Link from "next/link";
import { Home, ChevronRight } from "lucide-react";

const PATTERNS = [
  {
    category: "Two Pointers",
    desc: "Two pointers traverse data in different directions or speeds",
    difficulty: "Easy-Medium",
    problems: [
      { name: "Two Sum II (Sorted)", difficulty: "Easy", href: "/tools/algorithms/two-pointer" },
      { name: "3Sum", difficulty: "Medium", href: "/tools/algorithms/two-pointer" },
      { name: "Container With Most Water", difficulty: "Medium", href: "/tools/algorithms/two-pointer" },
    ],
  },
  {
    category: "Sliding Window",
    desc: "Maintain a window that slides across the data structure",
    difficulty: "Medium",
    problems: [
      { name: "Maximum Sum Subarray (Fixed Size)", difficulty: "Easy", href: "/tools/algorithms/sliding-window" },
      { name: "Longest Substring Without Repeating", difficulty: "Medium", href: "/tools/algorithms/sliding-window" },
      { name: "Minimum Window Substring", difficulty: "Hard", href: "/tools/algorithms/sliding-window" },
    ],
  },
  {
    category: "Binary Search",
    desc: "Divide search space in half repeatedly",
    difficulty: "Easy-Medium",
    problems: [
      { name: "Basic Binary Search", difficulty: "Easy", href: "/tools/algorithms/binary-search" },
      { name: "Search in Rotated Array", difficulty: "Medium", href: "/tools/algorithms/binary-search" },
      { name: "Find Peak Element", difficulty: "Medium", href: "/tools/algorithms/binary-search" },
    ],
  },
  {
    category: "DFS / Backtracking",
    desc: "Explore all possibilities, backtracking when needed",
    difficulty: "Medium-Hard",
    problems: [
      { name: "Subsets", difficulty: "Medium", href: "/tools/algorithms/backtracking" },
      { name: "Permutations", difficulty: "Medium", href: "/tools/algorithms/backtracking" },
      { name: "N-Queens", difficulty: "Hard", href: "/tools/algorithms/backtracking" },
    ],
  },
  {
    category: "BFS on Trees/Graphs",
    desc: "Level-by-level traversal using a queue",
    difficulty: "Easy-Medium",
    problems: [
      { name: "Level Order Traversal", difficulty: "Easy", href: "/tools/algorithms/tree" },
      { name: "Shortest Path in Graph", difficulty: "Medium", href: "/tools/algorithms/graph" },
      { name: "Word Ladder", difficulty: "Hard", href: "/tools/algorithms/graph" },
    ],
  },
  {
    category: "Dynamic Programming",
    desc: "Optimize by storing subproblem solutions",
    difficulty: "Medium-Hard",
    problems: [
      { name: "Climbing Stairs", difficulty: "Easy", href: "/tools/algorithms/dynamic-programming" },
      { name: "Coin Change", difficulty: "Medium", href: "/tools/algorithms/dynamic-programming" },
      { name: "Longest Common Subsequence", difficulty: "Medium", href: "/tools/algorithms/dynamic-programming" },
    ],
  },
  {
    category: "Greedy Algorithms",
    desc: "Make locally optimal choices at each step",
    difficulty: "Medium",
    problems: [
      { name: "Activity Selection", difficulty: "Medium", href: "/tools/algorithms/greedy" },
      { name: "Fractional Knapsack", difficulty: "Medium", href: "/tools/algorithms/greedy" },
      { name: "Huffman Coding", difficulty: "Hard", href: "/tools/algorithms/greedy" },
    ],
  },
  {
    category: "Heap / Priority Queue",
    desc: "Use heap to efficiently access min/max elements",
    difficulty: "Medium",
    problems: [
      { name: "Kth Largest Element", difficulty: "Medium", href: "/tools/algorithms/heap" },
      { name: "Merge K Sorted Lists", difficulty: "Hard", href: "/tools/algorithms/heap" },
      { name: "Find Median from Stream", difficulty: "Hard", href: "/tools/algorithms/heap" },
    ],
  },
  {
    category: "Trie / Prefix Tree",
    desc: "Efficient string prefix search and storage",
    difficulty: "Medium-Hard",
    problems: [
      { name: "Implement Trie", difficulty: "Medium", href: "/tools/algorithms/trie" },
      { name: "Word Break", difficulty: "Medium", href: "/tools/algorithms/trie" },
      { name: "Maximum XOR of Two Numbers", difficulty: "Hard", href: "/tools/algorithms/trie" },
    ],
  },
];

const COMPANY_FOCUS = [
  { company: "Google/Meta", patterns: ["Dynamic Programming", "Graph (DFS/BFS)", "Binary Search", "Sliding Window"], tips: "Focus on optimal solutions with clean code. Discuss tradeoffs." },
  { company: "Amazon", patterns: ["Arrays & Sorting", "Two Pointers", "Trees", "Greedy"], tips: "Focus on scalability and system-level thinking. OOP design matters." },
  { company: "Microsoft", patterns: ["Trees", "Dynamic Programming", "String Manipulation", "Backtracking"], tips: "Write test cases first. Show edge case awareness." },
  { company: "Startups", patterns: ["General problem-solving", "Practical algorithms", "System design"], tips: "Focus on clean, working code. Pragmatic solutions preferred over theoretical optimality." },
];

export default function InterviewPatternsPage() {

  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      <div className="flex items-center gap-2 mb-6 text-xs text-slate-500">
        <Link href="/tools/algorithms" className="text-indigo-600 no-underline flex items-center gap-1.5 hover:text-indigo-800 transition"><Home size={16} /> Algorithms</Link>
        <ChevronRight size={16} /><span className="text-slate-900 font-semibold">Interview Patterns</span>
      </div>

      <div className="mb-10">
        <h1 className="text-4xl font-extrabold text-slate-900 mb-3">💡 Interview Patterns</h1>
        <p className="text-base text-slate-500 leading-relaxed max-w-2xl">Master the most common coding interview patterns. Each pattern includes problem examples and links to detailed explanations.</p>
      </div>

      {/* Pattern Grid */}
      <div className="grid sm:grid-cols-2 gap-5 mb-10">
        {PATTERNS.map((p) => (
          <div key={p.category} className="bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-lg hover:border-indigo-400 transition-all">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-slate-900 text-base">{p.category}</h3>
              <span className={`text-[10px] px-2 py-1 rounded-md font-semibold uppercase ${
                p.difficulty.includes("Easy") ? "bg-green-100 text-green-700" :
                p.difficulty.includes("Hard") ? "bg-red-100 text-red-700" :
                "bg-amber-100 text-amber-700"
              }`}>{p.difficulty}</span>
            </div>
            <p className="text-xs text-slate-500 mb-4">{p.desc}</p>
            <div className="space-y-2">
              {p.problems.map((prob, i) => (
                <Link key={i} href={prob.href} className="flex items-center justify-between no-underline group">
                  <span className="text-xs text-slate-600 group-hover:text-indigo-600 transition-colors">{prob.name}</span>
                  <span className={`text-[9px] px-1.5 py-0.5 rounded font-semibold uppercase ${
                    prob.difficulty === "Easy" ? "bg-green-100 text-green-700" :
                    prob.difficulty === "Hard" ? "bg-red-100 text-red-700" :
                    "bg-amber-100 text-amber-700"
                  }`}>{prob.difficulty}</span>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Company Focus */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-10">
        <h2 className="text-xl font-bold text-slate-900 mb-5">🏢 Company-Specific Focus</h2>
        <div className="grid sm:grid-cols-2 gap-5">
          {COMPANY_FOCUS.map((c) => (
            <div key={c.company} className="bg-slate-50 rounded-xl p-5">
              <h3 className="font-bold text-slate-900 text-sm mb-3">{c.company}</h3>
              <div className="flex flex-wrap gap-1.5 mb-3">
                {c.patterns.map((p) => (
                  <span key={p} className="text-[9px] bg-indigo-100 text-indigo-600 px-2 py-0.5 rounded-full font-semibold">{p}</span>
                ))}
              </div>
              <p className="text-xs text-slate-500">{c.tips}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Tips */}
      <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl p-6 text-white">
        <h3 className="text-lg font-bold mb-4">🎯 Interview Success Tips</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="bg-white/10 rounded-xl p-4">
            <h4 className="text-sm font-bold mb-2">Before the Interview</h4>
            <ul className="space-y-1.5 text-xs text-white/80">
              <li>• Review top 5 patterns thoroughly</li>
              <li>• Practice on a whiteboard or text editor</li>
              <li>• Know time/space complexity of common algorithms</li>
              <li>• Prepare 2-3 questions to ask interviewers</li>
            </ul>
          </div>
          <div className="bg-white/10 rounded-xl p-4">
            <h4 className="text-sm font-bold mb-2">During the Interview</h4>
            <ul className="space-y-1.5 text-xs text-white/80">
              <li>• Clarify requirements and edge cases first</li>
              <li>• Think out loud - explain your approach</li>
              <li>• Start with brute force, then optimize</li>
              <li>• Write clean, readable code with proper naming</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
