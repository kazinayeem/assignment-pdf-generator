"use client";

import { cn } from "@/lib/utils";

type ProgressBarProps = {
  value: number;
  className?: string;
  showLabel?: boolean;
  size?: "sm" | "md";
};

export function ProgressBar({ value, className, showLabel, size = "md" }: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, value));
  return (
    <div className={cn("w-full", className)}>
      {showLabel && (
        <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 mb-1.5">
          <span>Progress</span>
          <span className="font-semibold text-brand">{clamped}%</span>
        </div>
      )}
      <div
        className={cn(
          "w-full rounded-full bg-slate-100 dark:bg-white/10 overflow-hidden",
          size === "sm" ? "h-1.5" : "h-2.5"
        )}
        role="progressbar"
        aria-valuenow={clamped}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className="h-full rounded-full bg-gradient-to-r from-brand to-brand-secondary transition-all duration-700 ease-out"
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
}
