"use client";

import SidebarShell from "../components/SidebarShell";

const config = {
  title: "Architecture",
  icon: "⚙️",
  basePath: "/tools/arch",
  accent: "cyan" as const,
  categories: [
    {
      title: "Core Concepts",
      items: [
        { name: "Fundamentals", href: "/tools/arch/fundamentals" },
        { name: "CPU Organization", href: "/tools/arch/cpu-organization" },
        { name: "Instruction Set", href: "/tools/arch/instruction-set" },
      ],
    },
    {
      title: "Memory Systems",
      items: [
        { name: "Memory Hierarchy", href: "/tools/arch/memory-hierarchy" },
        { name: "Cache Memory", href: "/tools/arch/cache-memory" },
        { name: "Virtual Memory", href: "/tools/arch/virtual-memory" },
      ],
    },
    {
      title: "Advanced Topics",
      items: [
        { name: "Arithmetic & Logic", href: "/tools/arch/arithmetic-logic" },
        { name: "I/O Organization", href: "/tools/arch/io-organization" },
        { name: "Parallel Processing", href: "/tools/arch/parallel-processing" },
      ],
    },
  ],
};

export default function ArchLayout({ children }: { children: React.ReactNode }) {
  return <SidebarShell config={config}>{children}</SidebarShell>;
}
