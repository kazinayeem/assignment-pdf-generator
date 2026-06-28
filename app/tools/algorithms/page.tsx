"use client";

import { BrainCircuit, Target, BookOpen, BarChart3 } from "lucide-react";
import { SubjectIndexPage } from "@/components/tools/subject-index-page";

const categories = [
  {
    category: "Core Algorithms",
    topics: [
      { name: "Sorting Algorithms", href: "/tools/algorithms/sorting", icon: "📊", difficulty: "Beginner" as const, duration: "45 min" },
      { name: "Searching", href: "/tools/algorithms/searching", icon: "🔍", difficulty: "Beginner" as const, duration: "35 min" },
      { name: "Recursion", href: "/tools/algorithms/recursion", icon: "🔄", difficulty: "Beginner" as const, duration: "40 min" },
      { name: "Binary Search", href: "/tools/algorithms/binary-search", icon: "🎯", difficulty: "Beginner" as const, duration: "35 min" },
    ],
  },
  {
    category: "Advanced Paradigms",
    topics: [
      { name: "Dynamic Programming", href: "/tools/algorithms/dynamic-programming", icon: "🧩", difficulty: "Advanced" as const, duration: "60 min" },
      { name: "Greedy Algorithms", href: "/tools/algorithms/greedy", icon: "💰", difficulty: "Intermediate" as const, duration: "45 min" },
      { name: "Backtracking", href: "/tools/algorithms/backtracking", icon: "↩️", difficulty: "Advanced" as const, duration: "55 min" },
    ],
  },
  {
    category: "Data Structures",
    topics: [
      { name: "Graph Algorithms", href: "/tools/algorithms/graph", icon: "🕸️", difficulty: "Intermediate" as const, duration: "50 min" },
      { name: "Tree Algorithms", href: "/tools/algorithms/tree", icon: "🌳", difficulty: "Intermediate" as const, duration: "45 min" },
      { name: "Heap & Priority Queue", href: "/tools/algorithms/heap", icon: "📚", difficulty: "Intermediate" as const, duration: "40 min" },
      { name: "Trie Algorithms", href: "/tools/algorithms/trie", icon: "🌲", difficulty: "Advanced" as const, duration: "48 min" },
    ],
  },
  {
    category: "Patterns",
    topics: [
      { name: "Sliding Window", href: "/tools/algorithms/sliding-window", icon: "🪟", difficulty: "Intermediate" as const, duration: "42 min" },
      { name: "Two Pointer", href: "/tools/algorithms/two-pointer", icon: "👉", difficulty: "Beginner" as const, duration: "35 min" },
      { name: "String Algorithms", href: "/tools/algorithms/string", icon: "📝", difficulty: "Intermediate" as const, duration: "45 min" },
    ],
  },
  {
    category: "Learning Paths",
    topics: [
      { name: "Full Roadmap", href: "/tools/algorithms/roadmap", icon: "🗺️", duration: "20 min" },
      { name: "Beginner Path", href: "/tools/algorithms/beginner-path", icon: "🌱", difficulty: "Beginner" as const },
      { name: "Interview Prep", href: "/tools/algorithms/interview-prep", icon: "💼", difficulty: "Intermediate" as const },
      { name: "Advanced Mastery", href: "/tools/algorithms/advanced-mastery", icon: "🏆", difficulty: "Advanced" as const },
      { name: "Time Complexity", href: "/tools/algorithms/time-complexity", icon: "⏱️" },
      { name: "Practice Problems", href: "/tools/algorithms/practice-problems", icon: "🎯" },
    ],
  },
];

export default function AlgorithmsPage() {
  return (
    <SubjectIndexPage
      badge="Algorithms"
      badgeIcon={BrainCircuit}
      title="Algorithms"
      description="Master sorting, searching, dynamic programming, graphs, and interview patterns with visualizers and practice."
      accent="emerald"
      difficulty="Advanced"
      progress={42}
      lessonsCompleted="9 of 22 lessons"
      timeRemaining="~28 hours"
      estimatedDuration="48 hours total"
      stats={[
        { label: "Algorithms", value: "100+", icon: BrainCircuit },
        { label: "Visualizers", value: "30+", icon: BarChart3 },
        { label: "Interview Qs", value: "500+", icon: Target },
        { label: "Topics", value: 22, icon: BookOpen },
      ]}
      actions={[
        { label: "Continue Learning", href: "/tools/algorithms/sorting", variant: "primary" },
        { label: "Interview Prep", href: "/tools/algorithms/interview-prep", variant: "secondary" },
      ]}
      categories={categories}
      topicGradient="from-emerald-500 to-teal-600"
    />
  );
}
