"use client";

import { cn } from "@/lib/utils";
import type { Difficulty } from "@/lib/tools/tokens";
import { difficultyStyles } from "@/lib/tools/tokens";

type ToolsBadgeProps = {
  children: React.ReactNode;
  variant?: Difficulty | "sim" | "new" | "default";
  className?: string;
};

const extraVariants = {
  sim: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20",
  new: "bg-brand/10 text-brand border-brand/20",
  default: "bg-slate-100 text-slate-600 border-slate-200 dark:bg-white/10 dark:text-slate-300 dark:border-white/10",
};

export function ToolsBadge({ children, variant = "default", className }: ToolsBadgeProps) {
  const style =
    variant === "sim" || variant === "new" || variant === "default"
      ? extraVariants[variant]
      : difficultyStyles[variant];

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold border",
        style,
        className
      )}
    >
      {children}
    </span>
  );
}
