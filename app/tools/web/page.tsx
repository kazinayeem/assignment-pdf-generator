"use client";

import { Globe, Target, BookOpen, Layout } from "lucide-react";
import { SubjectIndexPage } from "@/components/tools/subject-index-page";
import { WEB_CURRICULUM, topicHref } from "@/lib/tools/curriculum";

const categories = [
  {
    category: "Web Development",
    topics: WEB_CURRICULUM.topics.map((t) => ({
      name: t.title,
      href: topicHref("web", t),
      icon: t.icon,
      difficulty: t.difficulty,
      description: t.description,
      duration: t.duration,
      comingSoon: t.status === "planned",
    })),
  },
];

export default function WebPage() {
  return (
    <SubjectIndexPage
      badge="Web Development"
      badgeIcon={Globe}
      title="Web Development"
      description="Master frontend, backend, and full-stack development with modern frameworks and best practices."
      accent="teal"
      difficulty="Intermediate"
      progress={8}
      estimatedDuration="36 hours total"
      stats={[
        { label: "Topics", value: WEB_CURRICULUM.topics.length, icon: BookOpen },
        { label: "Frameworks", value: 4, icon: Layout },
        { label: "Projects", value: "12+", icon: Globe },
        { label: "Est. Hours", value: WEB_CURRICULUM.estimatedHours, icon: Target },
      ]}
      actions={[
        { label: "Start Path", href: "/tools/web/html-css", variant: "primary" },
        { label: "Next.js", href: "/tools/web/nextjs", variant: "secondary" },
      ]}
      categories={categories}
      topicGradient="from-teal-500 to-emerald-600"
    />
  );
}
