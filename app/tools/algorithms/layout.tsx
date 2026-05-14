"use client";

import SidebarShell from "../components/SidebarShell";

const config = {
  title: "Algorithms",
  icon: "A",
  basePath: "/tools/algorithms",
  accent: "indigo" as const,
  categories: [
    {
      title: "Core Algorithms",
      items: [
        { name: "Sorting Algorithms", href: "/tools/algorithms/sorting" },
        { name: "Searching", href: "/tools/algorithms/searching" },
        { name: "Recursion", href: "/tools/algorithms/recursion" },
        { name: "Binary Search", href: "/tools/algorithms/binary-search" },
      ],
    },
    {
      title: "Advanced Paradigms",
      items: [
        { name: "Dynamic Programming", href: "/tools/algorithms/dynamic-programming" },
        { name: "Greedy Algorithms", href: "/tools/algorithms/greedy" },
        { name: "Backtracking", href: "/tools/algorithms/backtracking" },
      ],
    },
    {
      title: "Data Structure Algorithms",
      items: [
        { name: "Graph Algorithms", href: "/tools/algorithms/graph" },
        { name: "Tree Algorithms", href: "/tools/algorithms/tree" },
        { name: "Heap & Priority Queue", href: "/tools/algorithms/heap" },
        { name: "Trie Algorithms", href: "/tools/algorithms/trie" },
      ],
    },
    {
      title: "Patterns & Techniques",
      items: [
        { name: "Sliding Window", href: "/tools/algorithms/sliding-window" },
        { name: "Two Pointer", href: "/tools/algorithms/two-pointer" },
        { name: "String Algorithms", href: "/tools/algorithms/string" },
      ],
    },
  ],
};

export default function AlgorithmsLayout({ children }: { children: React.ReactNode }) {
  return <SidebarShell config={config}>{children}</SidebarShell>;
}
