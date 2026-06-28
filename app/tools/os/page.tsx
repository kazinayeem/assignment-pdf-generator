"use client";

import { useMemo } from "react";
import { Cpu, Target, BookOpen } from "lucide-react";
import { SubjectIndexPage } from "@/components/tools/subject-index-page";
import { OS_REGISTRY, getTopicHref } from "@/lib/learning/topics-registry";
import { getQuestionCount } from "@/lib/learning/question-bank";

const osTopics = OS_REGISTRY.categories.map((cat) => ({
  category: cat.title,
  topics: cat.topics.map((t) => ({
    name: t.title,
    href: getTopicHref("os", t),
    icon: t.icon,
    sim: t.hasSimulator,
    difficulty: t.difficulty,
    duration: t.duration,
    comingSoon: t.status === "planned",
  })),
}));

const topicCount = OS_REGISTRY.categories.flatMap((c) => c.topics).length;

export default function OSPage() {
  const totalQuestions = useMemo(() => getQuestionCount("os"), []);

  return (
    <SubjectIndexPage
      badge="Operating Systems"
      badgeIcon={Cpu}
      title="Operating Systems"
      description="Master OS concepts — processes, threads, scheduling, synchronization, memory, file systems, and security for exams and interviews."
      accent="indigo"
      difficulty="Intermediate"
      progress={35}
      lessonsCompleted={`3 of ${topicCount} lessons`}
      timeRemaining="~24 hours"
      estimatedDuration={`${OS_REGISTRY.estimatedHours} hours total`}
      stats={[
        { label: "Simulators", value: String(OS_REGISTRY.categories.flatMap((c) => c.topics).filter((t) => t.hasSimulator).length), icon: Cpu },
        { label: "Quiz Questions", value: `${totalQuestions}+`, icon: Target },
        { label: "Categories", value: OS_REGISTRY.categories.length, icon: BookOpen },
        { label: "Topics", value: topicCount, icon: BookOpen },
      ]}
      actions={[
        { label: "Continue Learning", href: "/tools/os/process-management", variant: "primary" },
        { label: "Take OS Exam", href: "/tools/exam/os", variant: "secondary" },
        { label: "Final Assessment", href: "/tools/exam/os", variant: "secondary" },
      ]}
      categories={osTopics}
      topicGradient="from-[#6D5DF6] to-[#8B5CF6]"
    />
  );
}
