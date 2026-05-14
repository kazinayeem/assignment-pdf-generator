"use client";

import SidebarShell from "../components/SidebarShell";

const config = {
  title: "DSA Learning",
  icon: "DSA",
  basePath: "/tools/dsa",
  accent: "emerald" as const,
  categories: [
    {
      title: "Linear Data Structures",
      items: [
        { name: "Arrays", href: "/tools/dsa/arrays" },
        { name: "Linked List", href: "/tools/dsa/linked-list" },
        { name: "Stack", href: "/tools/dsa/stack" },
        { name: "Queue", href: "/tools/dsa/queue" },
      ],
    },
    {
      title: "Non-Linear & Algorithms",
      items: [
        { name: "Tree", href: "/tools/dsa/tree" },
        { name: "Searching", href: "/tools/dsa/searching" },
        { name: "Sorting", href: "/tools/dsa/sorting" },
      ],
    },
  ],
};

export default function DSALayout({ children }: { children: React.ReactNode }) {
  return <SidebarShell config={config}>{children}</SidebarShell>;
}
