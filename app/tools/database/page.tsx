"use client";

import { MemoryStick, Target, BookOpen } from "lucide-react";
import { SubjectIndexPage } from "@/components/tools/subject-index-page";

const categories = [
  {
    category: "Fundamentals",
    topics: [
      { name: "Database Basics", href: "/tools/database/basics", icon: "📚", difficulty: "Beginner" as const, duration: "35 min" },
      { name: "Relational Model", href: "/tools/database/relational-model", icon: "🔗", difficulty: "Beginner" as const, duration: "40 min" },
      { name: "SQL & Queries", href: "/tools/database/sql", icon: "💾", difficulty: "Beginner" as const, duration: "50 min" },
    ],
  },
  {
    category: "Design & Modeling",
    topics: [
      { name: "Normalization", href: "/tools/database/normalization", icon: "📐", difficulty: "Intermediate" as const, duration: "45 min" },
      { name: "ERD", href: "/tools/database/erd", icon: "🗺️", difficulty: "Intermediate" as const, duration: "40 min" },
    ],
  },
  {
    category: "Advanced",
    topics: [
      { name: "Indexing & Storage", href: "/tools/database/indexing", icon: "⚡", difficulty: "Intermediate" as const, duration: "48 min" },
      { name: "Transactions & ACID", href: "/tools/database/transactions", icon: "🔄", difficulty: "Advanced" as const, duration: "55 min" },
      { name: "Query Optimization", href: "/tools/database/query-optimization", icon: "🚀", difficulty: "Advanced" as const, duration: "50 min" },
    ],
  },
];

export default function DatabasePage() {
  return (
    <SubjectIndexPage
      badge="Database Systems"
      badgeIcon={MemoryStick}
      title="Database Systems"
      description="Master SQL, normalization, transactions, ERD design, and query optimization for scalable systems."
      accent="orange"
      difficulty="Intermediate"
      progress={22}
      lessonsCompleted="2 of 8 lessons"
      estimatedDuration="18 hours total"
      stats={[
        { label: "Core Topics", value: 8, icon: BookOpen },
        { label: "Visualizers", value: "15+", icon: Target },
        { label: "Interview Qs", value: "200+", icon: Target },
        { label: "SQL Examples", value: "100+", icon: MemoryStick },
      ]}
      actions={[
        { label: "Start Learning", href: "/tools/database/basics", variant: "primary" },
        { label: "SQL Practice", href: "/tools/database/sql", variant: "secondary" },
      ]}
      categories={categories}
      topicGradient="from-orange-500 to-amber-600"
    />
  );
}
