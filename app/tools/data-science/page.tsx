"use client";

import { BarChart3, Target, BookOpen, Brain } from "lucide-react";
import { SubjectIndexPage } from "@/components/tools/subject-index-page";

const categories = [
  {
    category: "Python & Data",
    topics: [
      { name: "Python", href: "/tools/data-science/python", icon: "🐍", difficulty: "Beginner" as const, duration: "45 min" },
      { name: "NumPy", href: "/tools/data-science/numpy", icon: "🔢", difficulty: "Beginner" as const, duration: "40 min" },
      { name: "Pandas", href: "/tools/data-science/pandas", icon: "🐼", difficulty: "Intermediate" as const, duration: "50 min" },
      { name: "Statistics", href: "/tools/data-science/statistics", icon: "📊", difficulty: "Intermediate" as const, duration: "48 min" },
    ],
  },
  {
    category: "Machine Learning",
    topics: [
      { name: "ML Overview", href: "/tools/data-science/machine-learning", icon: "🤖", sim: true, difficulty: "Intermediate" as const, duration: "55 min" },
      { name: "Deep Learning", href: "/tools/data-science/deep-learning", icon: "🧠", sim: true, difficulty: "Advanced" as const, duration: "60 min" },
      { name: "NLP", href: "/tools/data-science/nlp", icon: "💬", difficulty: "Advanced" as const, duration: "52 min" },
    ],
  },
  {
    category: "AI & Analytics",
    topics: [
      { name: "LLM & GPT", href: "/tools/data-science/llm", icon: "✨", difficulty: "Advanced" as const, duration: "55 min" },
      { name: "Prompt Engineering", href: "/tools/data-science/prompt-engineering", icon: "📝", difficulty: "Intermediate" as const, duration: "45 min" },
      { name: "Data Visualization", href: "/tools/data-science/data-visualization", icon: "📈", difficulty: "Intermediate" as const, duration: "42 min" },
      { name: "SQL", href: "/tools/data-science/sql", icon: "💾", difficulty: "Intermediate" as const, duration: "40 min" },
      { name: "Big Data", href: "/tools/data-science/big-data", icon: "🗄️", difficulty: "Advanced" as const, duration: "50 min" },
    ],
  },
];

export default function DataSciencePage() {
  return (
    <SubjectIndexPage
      badge="Data Science"
      badgeIcon={BarChart3}
      title="Data Science"
      description="Learn Python, pandas, machine learning, deep learning, NLP, and LLMs with hands-on tutorials and demos."
      accent="amber"
      difficulty="Advanced"
      progress={25}
      lessonsCompleted="3 of 12 lessons"
      estimatedDuration="44 hours total"
      stats={[
        { label: "Topics", value: 12, icon: BookOpen },
        { label: "ML Demos", value: 3, icon: Brain },
        { label: "Interview Qs", value: "55+", icon: Target },
        { label: "Projects", value: "8+", icon: BarChart3 },
      ]}
      actions={[
        { label: "Start with Python", href: "/tools/data-science/python", variant: "primary" },
        { label: "Machine Learning", href: "/tools/data-science/machine-learning", variant: "secondary" },
      ]}
      categories={categories}
      topicGradient="from-amber-500 to-orange-600"
    />
  );
}
