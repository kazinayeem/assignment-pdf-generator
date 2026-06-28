"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, BookOpen, Clock, GraduationCap, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import type { AccentKey } from "@/lib/tools/tokens";
import { HeroStatCard } from "./stat-card";
import { ToolsButton } from "./tools-button";
import { ToolsBadge } from "./tools-badge";
import { ProgressBar } from "./progress-bar";

export type SubjectHeroAction = {
  label: string;
  href: string;
  variant?: "primary" | "secondary";
  icon?: LucideIcon;
};

export type SubjectHeroProps = {
  badge?: string;
  badgeIcon?: LucideIcon;
  title: string;
  description: string;
  accent?: AccentKey;
  difficulty?: string;
  instructor?: string;
  lastUpdated?: string;
  progress?: number;
  lessonsCompleted?: string;
  timeRemaining?: string;
  estimatedDuration?: string;
  stats?: { label: string; value: string; icon: LucideIcon }[];
  actions: SubjectHeroAction[];
};

export function SubjectHero({
  badge,
  badgeIcon: BadgeIcon,
  title,
  description,
  accent: _accent = "indigo",
  difficulty,
  instructor = "CampusFlow Team",
  lastUpdated = "Updated 2026",
  progress = 0,
  lessonsCompleted,
  timeRemaining,
  estimatedDuration,
  stats = [],
  actions,
}: SubjectHeroProps) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#0F172A] via-[#1e1b4b] to-[#0F172A] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[length:28px_28px]" aria-hidden />
      <div className="blur-orb w-[400px] h-[400px] bg-[#6D5DF6]/20 -top-32 -left-32" aria-hidden />
      <div className="blur-orb w-[300px] h-[300px] bg-[#8B5CF6]/15 bottom-0 right-0" aria-hidden />

      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20 relative">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            {badge && (
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 backdrop-blur-md rounded-full text-sm font-medium mb-5 border border-white/12">
                {BadgeIcon && <BadgeIcon size={14} className="text-white/80" aria-hidden />}
                {badge}
              </div>
            )}

            <h1 className="text-3xl sm:text-4xl lg:text-[2.5rem] font-extrabold leading-tight tracking-tight mb-4 text-white">
              {title}
            </h1>

            <p className="text-base sm:text-lg text-slate-300 leading-relaxed mb-6 max-w-xl">{description}</p>

            <div className="flex flex-wrap gap-3 mb-6">
              {difficulty && <ToolsBadge variant={difficulty as "Beginner" | "Intermediate" | "Advanced"}>{difficulty}</ToolsBadge>}
              {estimatedDuration && (
                <span className="inline-flex items-center gap-1.5 text-sm text-slate-400">
                  <Clock size={14} aria-hidden /> {estimatedDuration}
                </span>
              )}
              {lessonsCompleted && (
                <span className="inline-flex items-center gap-1.5 text-sm text-slate-400">
                  <BookOpen size={14} aria-hidden /> {lessonsCompleted}
                </span>
              )}
            </div>

            {progress > 0 && (
              <div className="mb-6 max-w-sm">
                <ProgressBar value={progress} showLabel />
                {timeRemaining && (
                  <p className="text-xs text-slate-400 mt-2">{timeRemaining} remaining</p>
                )}
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3">
              {actions.map((action) => (
                <Link key={action.href} href={action.href} className="w-full sm:w-auto">
                  <ToolsButton
                    variant={action.variant === "secondary" ? "secondary" : "primary"}
                    size="md"
                    className={cn(
                      "w-full sm:w-auto",
                      action.variant === "secondary" && "bg-white/10 border-white/20 text-white hover:bg-white/20"
                    )}
                  >
                    {action.icon && <action.icon size={18} aria-hidden />}
                    {action.label}
                    {action.variant !== "secondary" && <ArrowRight size={18} aria-hidden />}
                  </ToolsButton>
                </Link>
              ))}
            </div>

            <div className="flex flex-wrap gap-4 mt-6 text-xs text-slate-400">
              <span className="inline-flex items-center gap-1.5">
                <GraduationCap size={14} aria-hidden /> {instructor}
              </span>
              <span>{lastUpdated}</span>
            </div>
          </motion.div>

          {stats.length > 0 && (
            <motion.div
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="grid grid-cols-2 gap-3 sm:gap-4"
            >
              {stats.map((stat) => (
                <HeroStatCard key={stat.label} {...stat} />
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}
