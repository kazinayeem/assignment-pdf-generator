"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Bookmark, Calculator } from "lucide-react";
import { cn } from "@/lib/utils";
import type { CalculatorDefinition } from "@/lib/calculators/types";
import { getCategoryById } from "@/lib/calculators/categories";
import { useCalculatorsStore } from "@/lib/calculators-store";
import { ToolsButton } from "@/components/tools/tools-button";

export function CalculatorCard({
  calculator,
  index = 0,
  showFavorite = true,
}: {
  calculator: CalculatorDefinition;
  index?: number;
  showFavorite?: boolean;
}) {
  const category = getCategoryById(calculator.category);
  const { toggleFavorite, isFavorite } = useCalculatorsStore();
  const fav = isFavorite(calculator.slug);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03, duration: 0.35 }}
      whileHover={{ y: -4 }}
    >
      <div className="glass-card h-full p-5 sm:p-6 flex flex-col group relative overflow-hidden">
        <div className="absolute -right-6 -top-6 w-24 h-24 rounded-full bg-[#6D5DF6]/5 blur-2xl group-hover:bg-[#6D5DF6]/10 transition-colors" aria-hidden />

        <div className="flex items-start justify-between mb-4 relative">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#6D5DF6] to-[#8B5CF6] flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
            <Calculator size={22} className="text-white" aria-hidden />
          </div>
          {showFavorite && (
            <button
              onClick={(e) => {
                e.preventDefault();
                toggleFavorite(calculator.slug);
              }}
              aria-label={fav ? "Remove favorite" : "Add favorite"}
              className="p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-white/10 min-h-[44px] min-w-[44px] flex items-center justify-center"
            >
              <Bookmark size={18} className={cn(fav ? "fill-[#6D5DF6] text-[#6D5DF6]" : "text-slate-400")} />
            </button>
          )}
        </div>

        <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mb-2 group-hover:text-[#6D5DF6] transition-colors">
          {calculator.title}
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed flex-1 mb-4 line-clamp-2">
          {calculator.description}
        </p>

        {category && (
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-lg bg-[#6D5DF6]/8 text-[#6D5DF6] border border-[#6D5DF6]/15 w-fit mb-4">
            {category.emoji} {category.label}
          </span>
        )}

        <Link href={`/calculators/${calculator.slug}`} className="mt-auto">
          <ToolsButton variant="primary" size="sm" className="w-full">
            Open Calculator <ArrowRight size={16} aria-hidden />
          </ToolsButton>
        </Link>
      </div>
    </motion.div>
  );
}
