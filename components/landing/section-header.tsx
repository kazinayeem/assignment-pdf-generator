"use client";

import { motion } from "framer-motion";
import { type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type SectionHeaderProps = {
  badge?: string;
  badgeIcon?: LucideIcon;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
};

export function SectionHeader({
  badge,
  badgeIcon: BadgeIcon,
  title,
  description,
  align = "center",
  className,
}: SectionHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5 }}
      className={cn(
        "mb-12 md:mb-16",
        align === "center" && "text-center",
        className
      )}
    >
      {badge && (
        <div
          className={cn(
            "inline-flex items-center gap-2 rounded-full border border-brand/20 bg-brand/8 px-4 py-1.5 text-sm font-semibold text-brand mb-4",
            align === "center" && "mx-auto"
          )}
        >
          {BadgeIcon && <BadgeIcon size={14} aria-hidden />}
          {badge}
        </div>
      )}
      <h2 className="text-heading font-bold text-slate-900 dark:text-white">{title}</h2>
      {description && (
        <p className="mt-4 text-base md:text-lg text-slate-500 dark:text-slate-400 max-w-2xl leading-relaxed mx-auto">
          {description}
        </p>
      )}
    </motion.div>
  );
}
