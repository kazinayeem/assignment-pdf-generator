"use client";

import Link from "next/link";
import { ArrowLeft, BookOpen, Code2, ListChecks, Zap } from "lucide-react";
import type { CurriculumTopic } from "@/lib/tools/curriculum";
import { ToolsBadge } from "./tools-badge";

type PlannedTopicPageProps = {
  topic: CurriculumTopic;
  parentPath: string;
  parentLabel: string;
  subjectPath: string;
};

export function PlannedTopicPage({ topic, parentPath, parentLabel, subjectPath }: PlannedTopicPageProps) {
  return (
    <div className="min-h-screen bg-surface-page">
      <div className="sticky top-0 z-40 glass border-b border-slate-200/60 dark:border-white/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-4">
          <Link
            href={parentPath}
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#6D5DF6] hover:opacity-80 transition-opacity min-h-[44px]"
          >
            <ArrowLeft size={18} aria-hidden />
            Back to {parentLabel}
          </Link>
          <ToolsBadge variant="Intermediate">Coming Soon</ToolsBadge>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
        <div className="text-center mb-10">
          <div className="text-6xl mb-4" aria-hidden>{topic.icon}</div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-3">
            {topic.title}
          </h1>
          <p className="text-base text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            {topic.description}
          </p>
          <div className="flex flex-wrap justify-center gap-2 mt-5">
            <ToolsBadge variant={topic.difficulty}>{topic.difficulty}</ToolsBadge>
            <span className="text-xs text-slate-500 dark:text-slate-400 px-3 py-1 rounded-full bg-slate-100 dark:bg-white/5">
              {topic.duration}
            </span>
          </div>
        </div>

        <div className="grid sm:grid-cols-3 gap-4 mb-8">
          {[
            { icon: BookOpen, title: "Core Lessons", desc: "Structured theory with examples" },
            { icon: Zap, title: "Simulators", desc: "Interactive visual learning" },
            { icon: Code2, title: "Practice", desc: "Exercises and interview prep" },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="glass-card p-5 text-center">
              <Icon className="w-6 h-6 mx-auto mb-2 text-[#6D5DF6]" aria-hidden />
              <p className="font-bold text-sm text-slate-900 dark:text-white">{title}</p>
              <p className="text-xs text-slate-500 mt-1">{desc}</p>
            </div>
          ))}
        </div>

        {topic.learningObjectives && topic.learningObjectives.length > 0 && (
          <div className="glass-card p-6 mb-8">
            <h2 className="flex items-center gap-2 text-lg font-bold text-slate-900 dark:text-white mb-4">
              <ListChecks className="w-5 h-5 text-[#6D5DF6]" aria-hidden />
              Learning Objectives
            </h2>
            <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400 list-disc pl-5">
              {topic.learningObjectives.map((obj) => (
                <li key={obj}>{obj}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="glass-card p-6 text-center">
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
            This module is on our roadmap. Explore other topics while we build it out.
          </p>
          <Link
            href={subjectPath}
            className="inline-flex items-center justify-center min-h-[44px] px-6 py-2.5 rounded-xl text-sm font-semibold text-white gradient-primary"
          >
            Browse {parentLabel}
          </Link>
        </div>
      </div>
    </div>
  );
}
