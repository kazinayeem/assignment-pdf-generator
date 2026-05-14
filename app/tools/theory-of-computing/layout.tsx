"use client";

import SidebarShell from "../components/SidebarShell";

const config = {
  title: "Theory of Comp.",
  icon: "TC",
  basePath: "/tools/theory-of-computing",
  accent: "indigo" as const,
  categories: [
    {
      title: "Automata",
      items: [
        { name: "DFA Simulator", href: "/tools/theory-of-computing/dfa", sim: true },
        { name: "NFA Simulator", href: "/tools/theory-of-computing/nfa", sim: true },
        { name: "NFA → DFA", href: "/tools/theory-of-computing/nfa-to-dfa", sim: true },
      ],
    },
    {
      title: "Regex & Languages",
      items: [
        { name: "Regex Engine", href: "/tools/theory-of-computing/regex", sim: true },
        { name: "Pumping Lemma", href: "/tools/theory-of-computing/pumping-lemma" },
        { name: "CFG & PDA", href: "/tools/theory-of-computing/context-free-grammar" },
      ],
    },
    {
      title: "Advanced",
      items: [
        { name: "DFA Minimization", href: "/tools/theory-of-computing/minimization", sim: true },
        { name: "Turing Machines", href: "/tools/theory-of-computing/turing-machines", sim: true },
      ],
    },
  ],
};

export default function TocLayout({ children }: { children: React.ReactNode }) {
  return <SidebarShell config={config}>{children}</SidebarShell>;
}
