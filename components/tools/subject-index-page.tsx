"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import type { AccentKey } from "@/lib/tools/tokens";
import { SubjectHero, type SubjectHeroAction } from "./subject-hero";
import { StatCard } from "./stat-card";
import { TopicCard, type TopicCardData } from "./topic-card";

export type TopicCategory = {
  category: string;
  topics: TopicCardData[];
};

export type SubjectIndexConfig = {
  badge?: string;
  badgeIcon?: LucideIcon;
  title: string;
  description: string;
  accent?: AccentKey;
  difficulty?: string;
  progress?: number;
  lessonsCompleted?: string;
  timeRemaining?: string;
  estimatedDuration?: string;
  stats: { label: string; value: string | number; icon: LucideIcon }[];
  actions: SubjectHeroAction[];
  categories: TopicCategory[];
  topicGradient?: string;
  children?: ReactNode;
};

export function SubjectIndexPage({
  badge,
  badgeIcon,
  title,
  description,
  accent,
  difficulty,
  progress,
  lessonsCompleted,
  timeRemaining,
  estimatedDuration,
  stats,
  actions,
  categories,
  topicGradient,
  children,
}: SubjectIndexConfig) {
  const heroStats = stats.map((s) => ({
    ...s,
    value: String(s.value),
  }));

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0F172A]">
      <SubjectHero
        badge={badge}
        badgeIcon={badgeIcon}
        title={title}
        description={description}
        accent={accent}
        difficulty={difficulty}
        progress={progress}
        lessonsCompleted={lessonsCompleted}
        timeRemaining={timeRemaining}
        estimatedDuration={estimatedDuration}
        stats={heroStats}
        actions={actions}
      />

      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-12">
        <section>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat) => (
              <StatCard key={stat.label} {...stat} animate={typeof stat.value === "number"} />
            ))}
          </div>
        </section>

        {categories.map((cat) => (
          <section key={cat.category}>
            <div className="flex items-end justify-between mb-6">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">{cat.category}</h2>
                <p className="text-sm text-slate-500 mt-1">{cat.topics.length} topics</p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {cat.topics.map((topic, i) => (
                <Link key={topic.href} href={topic.href} className="block h-full">
                  <TopicCard topic={topic} gradient={topicGradient} index={i} />
                </Link>
              ))}
            </div>
          </section>
        ))}

        {children}
      </div>
    </div>
  );
}
