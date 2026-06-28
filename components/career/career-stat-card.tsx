"use client";

import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type CareerStatCardProps = {
  label: string;
  value: string | number;
  icon: LucideIcon;
  gradient?: string;
  index?: number;
  suffix?: string;
};

export function CareerStatCard({ label, value, icon: Icon, gradient = "from-[#6D5DF6] to-[#06B6D4]", index = 0, suffix }: CareerStatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="glass-card p-4 sm:p-5"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mb-1">{label}</p>
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tabular-nums">
            {value}
            {suffix && <span className="text-base font-semibold text-slate-400 ml-0.5">{suffix}</span>}
          </p>
        </div>
        <div className={cn("w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br flex items-center justify-center shadow-md shrink-0", gradient)}>
          <Icon size={20} className="text-white" aria-hidden />
        </div>
      </div>
    </motion.div>
  );
}
