"use client";

import { GitFork, Target, BookOpen, Cpu } from "lucide-react";
import { SubjectIndexPage } from "@/components/tools/subject-index-page";

const categories = [
  {
    category: "Finite Automata",
    topics: [
      { name: "DFA Simulator", href: "/tools/theory-of-computing/dfa", icon: "🔵", sim: true, difficulty: "Beginner" as const, duration: "45 min" },
      { name: "NFA Simulator", href: "/tools/theory-of-computing/nfa", icon: "🟣", sim: true, difficulty: "Intermediate" as const, duration: "50 min" },
      { name: "NFA → DFA", href: "/tools/theory-of-computing/nfa-to-dfa", icon: "➡️", sim: true, difficulty: "Advanced" as const, duration: "55 min" },
    ],
  },
  {
    category: "Formal Languages",
    topics: [
      { name: "Regex Engine", href: "/tools/theory-of-computing/regex", icon: "🔤", sim: true, difficulty: "Intermediate" as const, duration: "48 min" },
      { name: "Pumping Lemma", href: "/tools/theory-of-computing/pumping-lemma", icon: "📐", difficulty: "Advanced" as const, duration: "45 min" },
      { name: "CFG & PDA", href: "/tools/theory-of-computing/context-free-grammar", icon: "🌳", difficulty: "Advanced" as const, duration: "52 min" },
    ],
  },
  {
    category: "Advanced",
    topics: [
      { name: "DFA Minimization", href: "/tools/theory-of-computing/minimization", icon: "📉", sim: true, difficulty: "Advanced" as const, duration: "50 min" },
      { name: "Turing Machines", href: "/tools/theory-of-computing/turing-machines", icon: "🤖", sim: true, difficulty: "Advanced" as const, duration: "55 min" },
    ],
  },
];

export default function TheoryPage() {
  return (
    <SubjectIndexPage
      badge="Theory of Computing"
      badgeIcon={GitFork}
      title="Theory of Computing"
      description="Explore DFA, NFA, regular expressions, context-free grammars, and Turing machines with interactive simulators."
      accent="indigo"
      difficulty="Advanced"
      progress={20}
      lessonsCompleted="2 of 8 lessons"
      estimatedDuration="22 hours total"
      stats={[
        { label: "Topics", value: 8, icon: BookOpen },
        { label: "Simulators", value: 5, icon: Cpu },
        { label: "Interview Qs", value: "45+", icon: Target },
        { label: "Automata", value: "6+", icon: GitFork },
      ]}
      actions={[
        { label: "DFA Simulator", href: "/tools/theory-of-computing/dfa", variant: "primary" },
        { label: "NFA Simulator", href: "/tools/theory-of-computing/nfa", variant: "secondary" },
      ]}
      categories={categories}
      topicGradient="from-[#6D5DF6] to-[#8B5CF6]"
    />
  );
}
