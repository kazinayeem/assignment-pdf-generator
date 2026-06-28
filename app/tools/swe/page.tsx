"use client";

import { Blocks, Target, BookOpen, Layers } from "lucide-react";
import { SubjectIndexPage } from "@/components/tools/subject-index-page";
import { SWE_CURRICULUM, topicHref } from "@/lib/tools/curriculum";

const categories = [
  {
    category: "Software Engineering",
    topics: SWE_CURRICULUM.topics.map((t) => ({
      name: t.title,
      href: topicHref("swe", t),
      icon: t.icon,
      difficulty: t.difficulty,
      description: t.description,
      duration: t.duration,
      comingSoon: t.status === "planned",
    })),
  },
];

export default function SWEPage() {
  return (
    <SubjectIndexPage
      badge="Software Engineering"
      badgeIcon={Blocks}
      title="Software Engineering"
      description="Master design patterns, SDLC, UML, testing, quality assurance, and system design principles."
      accent="indigo"
      difficulty="Intermediate"
      progress={10}
      estimatedDuration="28 hours total"
      stats={[
        { label: "Core Topics", value: SWE_CURRICULUM.topics.length, icon: BookOpen },
        { label: "Design Patterns", value: "23+", icon: Layers },
        { label: "Interview Qs", value: "70+", icon: Target },
        { label: "Est. Hours", value: SWE_CURRICULUM.estimatedHours, icon: Blocks },
      ]}
      actions={[
        { label: "Start Path", href: "/tools/swe/sdlc-models", variant: "primary" },
        { label: "System Design", href: "/tools/swe/system-design", variant: "secondary" },
      ]}
      categories={categories}
      topicGradient="from-[#6D5DF6] to-[#8B5CF6]"
    />
  );
}
