"use client";

import SidebarShell from "../components/SidebarShell";

const config = {
  title: "Database",
  icon: "DB",
  basePath: "/tools/database",
  accent: "green" as const,
  categories: [
    {
      title: "Core Topics",
      items: [
        { name: "Database Basics", href: "/tools/database/basics" },
        { name: "Relational Model", href: "/tools/database/relational-model" },
        { name: "SQL & Queries", href: "/tools/database/sql" },
        { name: "Normalization", href: "/tools/database/normalization" },
      ],
    },
    {
      title: "Design & Performance",
      items: [
        { name: "ER Diagrams", href: "/tools/database/erd" },
        { name: "Indexing & Storage", href: "/tools/database/indexing" },
        { name: "Transactions & ACID", href: "/tools/database/transactions" },
        { name: "Query Optimization", href: "/tools/database/query-optimization" },
      ],
    },
  ],
};

export default function DatabaseLayout({ children }: { children: React.ReactNode }) {
  return <SidebarShell config={config}>{children}</SidebarShell>;
}
