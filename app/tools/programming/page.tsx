"use client";

import { Code2, Target, BookOpen, Terminal } from "lucide-react";
import { SubjectIndexPage } from "@/components/tools/subject-index-page";
import { PROGRAMMING_CURRICULUM, topicHref } from "@/lib/tools/curriculum";

const categories = [
  {
    category: "Programming Languages",
    topics: PROGRAMMING_CURRICULUM.topics.map((t) => ({
      name: t.title,
      href: topicHref("programming", t),
      icon: t.icon,
      difficulty: t.difficulty,
      description: t.description,
      duration: t.duration,
      comingSoon: t.status === "planned",
    })),
  },
];

export default function ProgrammingPage() {
  return (
    <SubjectIndexPage
      badge="Programming"
      badgeIcon={Code2}
      title="Programming"
      description="Learn C, C++, JavaScript, Python, and Java fundamentals with structured lessons and practice exercises."
      accent="pink"
      difficulty="Beginner"
      progress={12}
      estimatedDuration="40 hours total"
      stats={[
        { label: "Languages", value: PROGRAMMING_CURRICULUM.topics.length, icon: Terminal },
        { label: "Live Modules", value: 1, icon: BookOpen },
        { label: "Exercises", value: "80+", icon: Code2 },
        { label: "Est. Hours", value: PROGRAMMING_CURRICULUM.estimatedHours, icon: Target },
      ]}
      actions={[
        { label: "Python (Live)", href: "/tools/data-science/python", variant: "primary" },
        { label: "JavaScript", href: "/tools/programming/javascript", variant: "secondary" },
      ]}
      categories={categories}
      topicGradient="from-pink-500 to-rose-600"
    />
  );
}
