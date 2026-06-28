"use client";

import { useState } from "react";
import Link from "next/link";
import { Home, ChevronRight, Search } from "lucide-react";

const PROBLEMS = [
  { id: "p1", title: "Two Sum", difficulty: "Easy", category: "Arrays", href: "/tools/algorithms/two-pointer", desc: "Find two numbers that add up to target" },
  { id: "p2", title: "Valid Parentheses", difficulty: "Easy", category: "Stack", href: "/tools/algorithms/sorting", desc: "Check if brackets are properly matched" },
  { id: "p3", title: "Merge Sorted Arrays", difficulty: "Easy", category: "Arrays", href: "/tools/algorithms/two-pointer", desc: "Merge two sorted arrays in-place" },
  { id: "p4", title: "Maximum Subarray", difficulty: "Easy", category: "DP", href: "/tools/algorithms/dynamic-programming", desc: "Find contiguous subarray with largest sum" },
  { id: "p5", title: "Binary Search", difficulty: "Easy", category: "Search", href: "/tools/algorithms/binary-search", desc: "Search for target in sorted array" },
  { id: "p6", title: "First Bad Version", difficulty: "Easy", category: "Search", href: "/tools/algorithms/binary-search", desc: "Find first bad commit using binary search" },
  { id: "p7", title: "Climbing Stairs", difficulty: "Easy", category: "DP", href: "/tools/algorithms/dynamic-programming", desc: "Count ways to climb n stairs (1 or 2 steps)" },
  { id: "p8", title: "Remove Duplicates", difficulty: "Easy", category: "Arrays", href: "/tools/algorithms/two-pointer", desc: "Remove duplicates from sorted array in-place" },
  { id: "p9", title: "3Sum", difficulty: "Medium", category: "Two Pointers", href: "/tools/algorithms/two-pointer", desc: "Find all triplets that sum to zero" },
  { id: "p10", title: "Container With Most Water", difficulty: "Medium", category: "Two Pointers", href: "/tools/algorithms/two-pointer", desc: "Find max water between two lines" },
  { id: "p11", title: "Longest Substring Without Repeating", difficulty: "Medium", category: "Sliding Window", href: "/tools/algorithms/sliding-window", desc: "Longest substring without repeating chars" },
  { id: "p12", title: "Longest Palindromic Substring", difficulty: "Medium", category: "String", href: "/tools/algorithms/string", desc: "Find longest palindrome substring" },
  { id: "p13", title: "Search in Rotated Array", difficulty: "Medium", category: "Search", href: "/tools/algorithms/binary-search", desc: "Search in rotated sorted array" },
  { id: "p14", title: "Combination Sum", difficulty: "Medium", category: "Backtracking", href: "/tools/algorithms/backtracking", desc: "Find combinations summing to target" },
  { id: "p15", title: "Permutations", difficulty: "Medium", category: "Backtracking", href: "/tools/algorithms/backtracking", desc: "Generate all permutations of array" },
  { id: "p16", title: "Coin Change", difficulty: "Medium", category: "DP", href: "/tools/algorithms/dynamic-programming", desc: "Minimum coins to make amount" },
  { id: "p17", title: "Longest Common Subsequence", difficulty: "Medium", category: "DP", href: "/tools/algorithms/dynamic-programming", desc: "LCS of two strings" },
  { id: "p18", title: "Kth Largest Element", difficulty: "Medium", category: "Heap", href: "/tools/algorithms/heap", desc: "Find kth largest element in array" },
  { id: "p19", title: "Course Schedule", difficulty: "Medium", category: "Graph", href: "/tools/algorithms/graph", desc: "Detect cycle in directed graph (prerequisite check)" },
  { id: "p20", title: "Implement Trie", difficulty: "Medium", category: "Trie", href: "/tools/algorithms/trie", desc: "Implement trie insert and search" },
  { id: "p21", title: "Word Break", difficulty: "Medium", category: "DP/Trie", href: "/tools/algorithms/trie", desc: "Can string be segmented into dictionary words" },
  { id: "p22", title: "Number of Islands", difficulty: "Medium", category: "DFS/BFS", href: "/tools/algorithms/graph", desc: "Count connected islands in grid" },
  { id: "p23", title: "Minimum Window Substring", difficulty: "Hard", category: "Sliding Window", href: "/tools/algorithms/sliding-window", desc: "Smallest substring containing all target chars" },
  { id: "p24", title: "N-Queens", difficulty: "Hard", category: "Backtracking", href: "/tools/algorithms/backtracking", desc: "Place N queens on NxN board" },
  { id: "p25", title: "Merge K Sorted Lists", difficulty: "Hard", category: "Heap", href: "/tools/algorithms/heap", desc: "Merge k sorted linked lists" },
  { id: "p26", title: "Sudoku Solver", difficulty: "Hard", category: "Backtracking", href: "/tools/algorithms/backtracking", desc: "Solve 9x9 Sudoku puzzle" },
  { id: "p27", title: "Longest Increasing Subsequence", difficulty: "Medium", category: "DP", href: "/tools/algorithms/dynamic-programming", desc: "Find LIS length" },
  { id: "p28", title: "Maximum XOR of Two Numbers", difficulty: "Hard", category: "Trie", href: "/tools/algorithms/trie", desc: "Find max XOR using binary trie" },
  { id: "p29", title: "Activity Selection", difficulty: "Medium", category: "Greedy", href: "/tools/algorithms/greedy", desc: "Max non-overlapping activities" },
  { id: "p30", title: "Edit Distance", difficulty: "Hard", category: "DP", href: "/tools/algorithms/dynamic-programming", desc: "Minimum operations to convert string" },
];

const CATEGORIES = ["All", "Easy", "Medium", "Hard"];

export default function PracticeProblemsPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const filtered = PROBLEMS.filter((p) => {
    const matchSearch = p.title.toLowerCase().includes(search.toLowerCase()) || p.category.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "All" || p.difficulty === filter;
    return matchSearch && matchFilter;
  });

  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      <div className="flex items-center gap-2 mb-6 text-xs text-slate-500">
        <Link href="/tools/algorithms" className="text-indigo-600 no-underline flex items-center gap-1.5 hover:text-indigo-800 transition"><Home size={16} /> Algorithms</Link>
        <ChevronRight size={16} /><span className="text-slate-900 font-semibold">Practice Problems</span>
      </div>

      <div className="mb-10">
        <h1 className="text-4xl font-extrabold text-slate-900 mb-3">🎯 Practice Problems</h1>
        <p className="text-base text-slate-500 leading-relaxed max-w-2xl">Curated collection of algorithm problems organized by difficulty and category. Click to learn the underlying concepts.</p>
      </div>

      {/* Search & Filter */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 mb-8">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input type="text" placeholder="Search problems..." value={search} onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all" />
          </div>
          <div className="flex gap-2">
            {CATEGORIES.map((c) => (
              <button key={c} onClick={() => setFilter(c)}
                className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${filter === c ? "bg-indigo-600 text-white shadow-md" : "bg-slate-100 text-slate-500 hover:bg-slate-200"}`}>{c}</button>
            ))}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-green-700">{PROBLEMS.filter((p) => p.difficulty === "Easy").length}</div>
          <div className="text-xs text-green-600 font-semibold mt-1">Easy</div>
        </div>
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-amber-700">{PROBLEMS.filter((p) => p.difficulty === "Medium").length}</div>
          <div className="text-xs text-amber-600 font-semibold mt-1">Medium</div>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-red-700">{PROBLEMS.filter((p) => p.difficulty === "Hard").length}</div>
          <div className="text-xs text-red-600 font-semibold mt-1">Hard</div>
        </div>
      </div>

      {/* Problem Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
          <Search size={40} className="mx-auto text-slate-300 mb-4" />
          <h3 className="text-lg font-bold text-slate-900 mb-2">No problems found</h3>
          <p className="text-sm text-slate-500">Try a different search or filter</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((prob) => (
            <Link key={prob.id} href={prob.href} className="no-underline">
              <div className="bg-white rounded-xl border border-slate-200 p-4 hover:shadow-lg hover:border-indigo-400 transition-all h-full flex flex-col">
                <div className="flex items-start justify-between mb-2">
                  <span className={`text-[10px] px-2 py-0.5 rounded font-semibold uppercase ${
                    prob.difficulty === "Easy" ? "bg-green-100 text-green-700" :
                    prob.difficulty === "Hard" ? "bg-red-100 text-red-700" :
                    "bg-amber-100 text-amber-700"
                  }`}>{prob.difficulty}</span>
                  <span className="text-[9px] text-slate-400 bg-slate-100 px-2 py-0.5 rounded font-medium">{prob.category}</span>
                </div>
                <h3 className="text-sm font-bold text-slate-900 mb-1">{prob.title}</h3>
                <p className="text-xs text-slate-500 flex-1">{prob.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
