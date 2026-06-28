"use client";

import { Smartphone } from "lucide-react";
import { SubjectIndexPage } from "@/components/tools/subject-index-page";
import { MOBILE_CURRICULUM, topicHref } from "@/lib/tools/curriculum";

const categories = [{
  category: "Mobile Development",
  topics: MOBILE_CURRICULUM.topics.map((t) => ({
    name: t.title,
    href: topicHref("mobile", t),
    icon: t.icon,
    difficulty: t.difficulty,
    duration: t.duration,
    comingSoon: t.status === "planned",
  })),
}];

export default function MobilePage() {
  return (
    <SubjectIndexPage
      badge="Mobile Development"
      badgeIcon={Smartphone}
      title="Mobile Development"
      description="React Native, Flutter, mobile UI/UX, and app deployment for iOS and Android."
      accent="pink"
      difficulty="Intermediate"
      progress={5}
      lessonsCompleted={`0 of ${MOBILE_CURRICULUM.topics.length} lessons`}
      timeRemaining={`~${MOBILE_CURRICULUM.estimatedHours} hours`}
      estimatedDuration={`${MOBILE_CURRICULUM.estimatedHours} hours total`}
      stats={[
        { label: "Topics", value: MOBILE_CURRICULUM.topics.length, icon: Smartphone },
        { label: "Path Steps", value: MOBILE_CURRICULUM.learningPath.length, icon: Smartphone },
      ]}
      actions={[
        { label: "Start Learning", href: topicHref("mobile", MOBILE_CURRICULUM.topics[0]), variant: "primary" },
      ]}
      categories={categories}
      topicGradient="from-pink-500 to-rose-600"
    />
  );
}
