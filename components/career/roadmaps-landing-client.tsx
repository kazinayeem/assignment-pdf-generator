"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Map, Clock, ArrowRight } from "lucide-react";
import * as LucideIcons from "lucide-react";
import { CareerPageHeader } from "./career-page-header";
import { CAREER_ROADMAPS } from "@/lib/career/roadmaps";

export function RoadmapsLandingClient() {
  return (
    <div>
      <CareerPageHeader title="Career Roadmaps" description="Step-by-step paths for 14 tech careers with skills, courses, projects, and timelines." icon={Map} badge={`${CAREER_ROADMAPS.length} Career Paths`} />
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {CAREER_ROADMAPS.map((r, i) => {
            const Icon = (LucideIcons as unknown as Record<string, LucideIcons.LucideIcon>)[r.icon] ?? Map;
            return (
              <motion.div key={r.slug} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
                <Link href={`/career/roadmaps/${r.slug}`} className="glass-card p-5 block h-full hover:border-[#6D5DF6]/30 transition-colors group">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#6D5DF6] to-[#06B6D4] flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                    <Icon size={20} className="text-white" />
                  </div>
                  <h3 className="font-bold text-base group-hover:text-[#6D5DF6] transition-colors mb-1">{r.title}</h3>
                  <p className="text-sm text-slate-500 line-clamp-2 mb-3">{r.description}</p>
                  <div className="flex items-center gap-1 text-xs text-slate-400">
                    <Clock size={12} /> ~{r.estimatedMonths} months
                  </div>
                  <span className="inline-flex items-center gap-1 text-sm text-[#6D5DF6] font-medium mt-3">
                    View roadmap <ArrowRight size={14} />
                  </span>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
