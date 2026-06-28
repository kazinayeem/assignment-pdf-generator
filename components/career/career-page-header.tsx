"use client";

import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";

type CareerPageHeaderProps = {
  title: string;
  description: string;
  icon: LucideIcon;
  badge?: string;
};

export function CareerPageHeader({ title, description, icon: Icon, badge }: CareerPageHeaderProps) {
  return (
    <section className="border-b border-border dark:border-white/10">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          {badge && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand/10 text-brand text-xs font-semibold mb-3 border border-brand/20">
              {badge}
            </span>
          )}
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-brand to-brand-accent flex items-center justify-center shadow-lg shrink-0">
              <Icon size={24} className="text-white" aria-hidden />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-2">{title}</h1>
              <p className="text-slate-500 dark:text-slate-400 max-w-2xl leading-relaxed">{description}</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
