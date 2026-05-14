"use client";

import SidebarShell from "../components/SidebarShell";

const config = {
  title: "Data Science",
  icon: "DS",
  basePath: "/tools/data-science",
  accent: "emerald" as const,
  categories: [
    {
      title: "Fundamentals",
      items: [
        { name: "Python", href: "/tools/data-science/python" },
        { name: "NumPy", href: "/tools/data-science/numpy" },
        { name: "Pandas", href: "/tools/data-science/pandas" },
        { name: "Statistics", href: "/tools/data-science/statistics" },
      ],
    },
    {
      title: "Machine Learning",
      items: [
        { name: "ML Overview", href: "/tools/data-science/machine-learning", sim: true },
        { name: "Deep Learning", href: "/tools/data-science/deep-learning", sim: true },
        { name: "NLP", href: "/tools/data-science/nlp" },
      ],
    },
    {
      title: "Advanced Topics",
      items: [
        { name: "LLM & GPT", href: "/tools/data-science/llm" },
        { name: "Prompt Engineering", href: "/tools/data-science/prompt-engineering" },
        { name: "Data Visualization", href: "/tools/data-science/data-visualization" },
        { name: "SQL", href: "/tools/data-science/sql" },
        { name: "Big Data", href: "/tools/data-science/big-data" },
      ],
    },
  ],
};

export default function DataScienceLayout({ children }: { children: React.ReactNode }) {
  return <SidebarShell config={config}>{children}</SidebarShell>;
}
