"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Bookmark, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import type { SubjectMeta } from "@/lib/tools/subjects";
import { accentStyles } from "@/lib/tools/tokens";
import { useLearningStore } from "@/lib/learning-store";
import { ToolsBadge } from "./tools-badge";
import { ProgressBar } from "./progress-bar";
import { ToolsButton } from "./tools-button";

function DifficultyStars({ difficulty }: { difficulty: SubjectMeta["difficulty"] }) {
  const filled = difficulty === "Beginner" ? 2 : difficulty === "Intermediate" ? 3 : 4;
  return (
    <div className="flex items-center gap-0.5" aria-label={`Difficulty: ${difficulty}`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={12}
          className={cn(i < filled ? "text-amber-400 fill-amber-400" : "text-slate-200 dark:text-slate-600")}
          aria-hidden
        />
      ))}
    </div>
  );
}

export function SubjectCard({ subject, index = 0 }: { subject: SubjectMeta; index?: number }) {
  const { toggleBookmark, isBookmarked } = useLearningStore();
  const bookmarked = isBookmarked(subject.href);
  const accent = accentStyles[subject.accent];
  const Icon = subject.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
    >
      <div className="glass-card h-full p-6 sm:p-8 flex flex-col group relative overflow-hidden">
        <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-brand/5 blur-2xl group-hover:bg-brand/10 transition-colors" aria-hidden />

        <div className="flex items-start justify-between mb-6 relative">
          <div
            className={cn(
              "w-14 h-14 rounded-2xl bg-gradient-to-br flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:scale-105 transition-all",
              accent.gradient
            )}
          >
            <Icon size={26} className="text-white" aria-hidden />
          </div>
          <button
            onClick={(e) => {
              e.preventDefault();
              toggleBookmark(subject.href);
            }}
            aria-label={bookmarked ? "Remove bookmark" : "Bookmark subject"}
            className="p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-white/10 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
          >
            <Bookmark
              size={18}
              className={cn(bookmarked ? "fill-brand text-brand" : "text-slate-400")}
            />
          </button>
        </div>

        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-2">{subject.title}</h2>
        <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 leading-relaxed mb-4 flex-1">
          {subject.description}
        </p>

        <div className="flex flex-wrap items-center gap-2 mb-4">
          <DifficultyStars difficulty={subject.difficulty} />
          <ToolsBadge variant={subject.difficulty}>{subject.difficulty}</ToolsBadge>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-5 text-center">
          <div className="rounded-xl bg-slate-50 dark:bg-white/5 p-2.5">
            <p className="text-lg font-bold text-slate-900 dark:text-white">{subject.modules}</p>
            <p className="text-[10px] text-slate-500 uppercase tracking-wide">Modules</p>
          </div>
          <div className="rounded-xl bg-slate-50 dark:bg-white/5 p-2.5">
            <p className="text-lg font-bold text-slate-900 dark:text-white">{subject.lessons}</p>
            <p className="text-[10px] text-slate-500 uppercase tracking-wide">Lessons</p>
          </div>
          <div className="rounded-xl bg-slate-50 dark:bg-white/5 p-2.5">
            <p className="text-lg font-bold text-slate-900 dark:text-white">{subject.hours}h</p>
            <p className="text-[10px] text-slate-500 uppercase tracking-wide">Est.</p>
          </div>
        </div>

        <ProgressBar value={subject.progress} showLabel className="mb-6" />

        <Link href={subject.href} className="w-full">
          <ToolsButton variant="primary" size="md" className="w-full">
            Continue Learning <ArrowRight size={18} aria-hidden />
          </ToolsButton>
        </Link>
      </div>
    </motion.div>
  );
}
