"use client";

import { Database, Target, BookOpen } from "lucide-react";
import { SubjectIndexPage } from "@/components/tools/subject-index-page";

const dsaTopics = [
  {
    category: "Linear Data Structures",
    topics: [
      { name: "Arrays", href: "/tools/dsa/arrays", icon: "📊", difficulty: "Beginner" as const, duration: "30 min" },
      { name: "Linked List", href: "/tools/dsa/linked-list", icon: "🔗", difficulty: "Intermediate" as const, duration: "40 min" },
      { name: "Stack", href: "/tools/dsa/stack", icon: "📚", difficulty: "Beginner" as const, duration: "25 min" },
      { name: "Queue", href: "/tools/dsa/queue", icon: "📋", difficulty: "Beginner" as const, duration: "25 min" },
    ],
  },
  {
    category: "Non-Linear & Algorithms",
    topics: [
      { name: "Tree", href: "/tools/dsa/tree", icon: "🌳", difficulty: "Intermediate" as const, duration: "45 min" },
      { name: "Searching", href: "/tools/dsa/searching", icon: "🔍", difficulty: "Intermediate" as const, duration: "35 min" },
      { name: "Sorting", href: "/tools/dsa/sorting", icon: "📊", difficulty: "Intermediate" as const, duration: "40 min" },
    ],
  },
];

export default function DSAPage() {
  return (
    <SubjectIndexPage
      badge="Data Structures"
      badgeIcon={Database}
      title="Data Structures & Algorithms"
      description="Master essential DSA concepts for interviews, competitive programming, and real-world problem solving."
      accent="violet"
      difficulty="Intermediate"
      progress={28}
      lessonsCompleted="2 of 8 lessons"
      timeRemaining="~24 hours"
      estimatedDuration="32 hours total"
      stats={[
        { label: "Core Topics", value: 7, icon: Database },
        { label: "Practice Problems", value: "100+", icon: Target },
        { label: "Categories", value: 2, icon: BookOpen },
        { label: "Lessons", value: 8, icon: BookOpen },
      ]}
      actions={[
        { label: "Start Learning", href: "/tools/dsa/arrays", variant: "primary" },
        { label: "Sorting", href: "/tools/dsa/sorting", variant: "secondary" },
      ]}
      categories={dsaTopics}
      topicGradient="from-violet-500 to-purple-600"
    />
  );
}
