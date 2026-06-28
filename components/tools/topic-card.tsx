"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Bookmark, CheckCircle, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";
import type { Difficulty } from "@/lib/tools/tokens";
import { useLearningStore } from "@/lib/learning-store";
import { ToolsBadge } from "./tools-badge";
import { ProgressBar } from "./progress-bar";

export type TopicCardData = {
  name: string;
  href: string;
  description?: string;
  icon?: LucideIcon | string;
  difficulty?: Difficulty;
  duration?: string;
  progress?: number;
  sim?: boolean;
  lessons?: number;
  comingSoon?: boolean;
};

export function TopicCard({ topic, gradient = "from-brand to-brand-secondary", index = 0 }: {
  topic: TopicCardData;
  gradient?: string;
  index?: number;
}) {
  const { toggleBookmark, isBookmarked, isCompleted } = useLearningStore();
  const bookmarked = isBookmarked(topic.href);
  const completed = isCompleted(topic.href);
  const Icon = typeof topic.icon === "function" ? topic.icon : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-20px" }}
      transition={{ delay: index * 0.04 }}
      whileHover={{ y: -4 }}
    >
      <div className="glass-card h-full p-5 flex flex-col group relative">
        <div className="flex items-start justify-between mb-4">
          <div
            className={cn(
              "w-11 h-11 rounded-xl bg-gradient-to-br flex items-center justify-center shadow-md group-hover:shadow-lg group-hover:scale-105 transition-all",
              gradient
            )}
          >
            {Icon ? (
              <Icon size={20} className="text-white" aria-hidden />
            ) : (
              <span className="text-xl" aria-hidden>{topic.icon as string}</span>
            )}
          </div>
          <div className="flex items-center gap-1">
            {completed && (
              <span className="p-1.5 rounded-lg bg-[#22C55E]/10" title="Completed">
                <CheckCircle size={16} className="text-[#22C55E]" aria-hidden />
              </span>
            )}
            <button
              onClick={(e) => {
                e.preventDefault();
                toggleBookmark(topic.href);
              }}
              aria-label={bookmarked ? "Remove bookmark" : "Bookmark"}
              className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-white/10 min-h-[44px] min-w-[44px] flex items-center justify-center"
            >
              <Bookmark
                size={16}
                className={cn(bookmarked ? "fill-brand text-brand" : "text-slate-400")}
              />
            </button>
          </div>
        </div>

        <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1 group-hover:text-brand transition-colors">
          {topic.name}
        </h3>

        {topic.description && (
          <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-3 line-clamp-2 flex-1">
            {topic.description}
          </p>
        )}

        <div className="flex flex-wrap items-center gap-2 mb-3">
          {topic.difficulty && <ToolsBadge variant={topic.difficulty}>{topic.difficulty}</ToolsBadge>}
          {topic.comingSoon && <ToolsBadge variant="Intermediate">Coming Soon</ToolsBadge>}
          {topic.sim && <ToolsBadge variant="sim">Simulator</ToolsBadge>}
          {topic.duration && (
            <span className="inline-flex items-center gap-1 text-xs text-slate-400">
              <Clock size={12} aria-hidden /> {topic.duration}
            </span>
          )}
        </div>

        {topic.progress !== undefined && (
          <ProgressBar value={topic.progress} size="sm" className="mb-4" />
        )}

        <Link
          href={topic.href}
          className="inline-flex items-center gap-2 text-sm font-semibold text-brand hover:gap-3 transition-all min-h-[44px]"
        >
          {topic.comingSoon ? "Preview" : "Continue"} <ArrowRight size={16} aria-hidden />
        </Link>
      </div>
    </motion.div>
  );
}
