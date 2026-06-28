"use client";

import { motion, useSpring, useTransform } from "framer-motion";
import { useEffect } from "react";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

type StatCardProps = {
  label: string;
  value: string | number;
  icon: LucideIcon;
  gradient?: string;
  className?: string;
  animate?: boolean;
};

export function StatCard({ label, value, icon: Icon, gradient = "from-[#6D5DF6] to-[#8B5CF6]", className, animate = true }: StatCardProps) {
  const numValue = typeof value === "string" ? parseInt(value.replace(/\D/g, ""), 10) || 0 : value;
  const suffix = typeof value === "string" ? value.replace(/[\d.]/g, "") : "";
  const spring = useSpring(0, { stiffness: 60, damping: 20 });
  const display = useTransform(spring, (v) => Math.round(v) + suffix);

  useEffect(() => {
    if (animate && typeof value === "number") spring.set(value);
    else if (animate) spring.set(numValue);
  }, [value, numValue, spring, animate]);

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.02 }}
      className={cn(
        "glass-card p-5 sm:p-6 text-center group",
        className
      )}
    >
      <div
        className={cn(
          "w-11 h-11 mx-auto mb-3 rounded-2xl bg-gradient-to-br flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow",
          gradient
        )}
      >
        <Icon size={20} className="text-white" aria-hidden />
      </div>
      {animate && typeof value === "number" ? (
        <motion.div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
          {display}
        </motion.div>
      ) : (
        <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">{value}</div>
      )}
      <div className="text-sm text-slate-500 dark:text-slate-400 mt-1">{label}</div>
    </motion.div>
  );
}

export function HeroStatCard({ label, value, icon: Icon }: StatCardProps) {
  return (
    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 sm:p-5 border border-white/15 text-center">
      <Icon className="w-5 h-5 mx-auto mb-2 text-white/80" aria-hidden />
      <div className="text-xl sm:text-2xl font-extrabold text-white">{value}</div>
      <div className="text-xs text-white/60 mt-0.5">{label}</div>
    </div>
  );
}
