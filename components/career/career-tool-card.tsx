"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Bookmark, Briefcase } from "lucide-react";
import * as LucideIcons from "lucide-react";
import type { CareerTool } from "@/lib/career/types";
import { getCareerCategory } from "@/lib/career/categories";
import { useCareerStore } from "@/lib/career-store";
import { cn } from "@/lib/utils";

export function CareerToolCard({ tool, index = 0 }: { tool: CareerTool; index?: number }) {
  const { toggleFavorite, isFavorite, addRecent } = useCareerStore();
  const fav = isFavorite(tool.slug);
  const category = getCareerCategory(tool.category);
  const Icon = (LucideIcons as unknown as Record<string, LucideIcons.LucideIcon>)[tool.icon] ?? Briefcase;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-20px" }}
      transition={{ delay: index * 0.03 }}
      whileHover={{ y: -4 }}
    >
      <div className="glass-card h-full p-5 flex flex-col group relative">
        <div className="flex items-start justify-between mb-4">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-brand to-brand-accent flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
            <Icon size={20} className="text-white" aria-hidden />
          </div>
          <button
            type="button"
            onClick={(e) => { e.preventDefault(); toggleFavorite(tool.slug); }}
            aria-label={fav ? "Remove from favorites" : "Add to favorites"}
            className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-white/10 min-h-[44px] min-w-[44px] flex items-center justify-center"
          >
            <Bookmark size={16} className={cn(fav ? "fill-brand text-brand" : "text-slate-400")} />
          </button>
        </div>

        <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1 group-hover:text-brand transition-colors line-clamp-1">
          {tool.title}
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-3 line-clamp-2 flex-1">
          {tool.description}
        </p>

        {category && (
          <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 w-fit mb-4">
            {category.emoji} {category.label}
          </span>
        )}

        <Link
          href={tool.href}
          onClick={() => addRecent(tool.slug)}
          {...(tool.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
          className="inline-flex items-center justify-center gap-2 min-h-[44px] px-4 py-2.5 rounded-xl text-sm font-semibold text-white gradient-primary shadow-md shadow-brand/20 hover:opacity-95 transition-opacity"
        >
          {tool.external ? "Open Builder" : "Open Tool"} <ArrowRight size={16} aria-hidden />
        </Link>
      </div>
    </motion.div>
  );
}
