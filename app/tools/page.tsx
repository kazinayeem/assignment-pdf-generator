"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Search, Sparkles, GraduationCap, Trophy } from "lucide-react";
import { TOOL_SUBJECTS, HUB_FILTERS, type HubFilter } from "@/lib/tools/subjects";
import { useLearningStore } from "@/lib/learning-store";
import { SubjectCard } from "@/components/tools/subject-card";
import { FilterChips } from "@/components/tools/filter-chips";

const POPULAR_SLUGS = ["os", "dsa", "algorithms", "arch", "security"];

export default function LearnPage() {
  const [filter, setFilter] = useState<HubFilter>("all");
  const [search, setSearch] = useState("");
  const { bookmarked, completedLessons, isPinnedSubject } = useLearningStore();

  const filtered = useMemo(() => {
    let items = [...TOOL_SUBJECTS];

    if (search) {
      const q = search.toLowerCase();
      items = items.filter(
        (s) => s.title.toLowerCase().includes(q) || s.description.toLowerCase().includes(q)
      );
    }

    switch (filter) {
      case "popular":
        items = items.filter((s) => POPULAR_SLUGS.includes(s.slug));
        break;
      case "bookmarked":
        items = items.filter((s) => bookmarked.includes(s.href));
        break;
      case "completed":
        items = items.filter((s) => completedLessons.some((h) => h.startsWith(s.href)));
        break;
      case "beginner":
        items = items.filter((s) => s.difficulty === "Beginner");
        break;
      case "intermediate":
        items = items.filter((s) => s.difficulty === "Intermediate");
        break;
      case "advanced":
        items = items.filter((s) => s.difficulty === "Advanced");
        break;
      case "recent":
        items = [...items].sort((a, b) => b.progress - a.progress);
        break;
    }

    const pinned = items.filter((s) => isPinnedSubject(s.slug));
    const rest = items.filter((s) => !isPinnedSubject(s.slug));
    return [...pinned, ...rest];
  }, [filter, search, bookmarked, completedLessons, isPinnedSubject]);

  return (
    <div className="min-h-full bg-[#F8FAFC] dark:bg-[#0F172A]">
      <section className="relative overflow-hidden border-b border-[#E5E7EB] dark:border-white/10">
        <div className="blur-orb w-[400px] h-[400px] bg-[#6D5DF6]/10 -top-32 right-0" aria-hidden />
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#6D5DF6]/10 text-[#6D5DF6] text-sm font-semibold mb-4 border border-[#6D5DF6]/20">
              <Sparkles size={14} aria-hidden />
              CSE & SWE Learning Hub
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-[2.5rem] font-extrabold text-slate-900 dark:text-white tracking-tight mb-3">
              Master Computer Science
            </h1>
            <p className="text-base sm:text-lg text-slate-500 dark:text-slate-400 max-w-2xl leading-relaxed mb-8">
              Interactive simulators, structured lessons, interview prep, and roadmaps — everything you need to excel in CS & SWE.
            </p>

            <div className="relative max-w-md">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" aria-hidden />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search subjects..."
                aria-label="Search subjects"
                className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white dark:bg-white/5 border border-[#E5E7EB] dark:border-white/10 text-base outline-none focus:border-[#6D5DF6]/50 focus:ring-2 focus:ring-[#6D5DF6]/20 transition-all min-h-[44px] shadow-sm"
              />
            </div>
            <div className="flex flex-wrap gap-3 mt-6">
              <Link href="/tools/exam" className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl gradient-primary text-white text-sm font-semibold min-h-[44px] shadow-md shadow-[#6D5DF6]/20">
                <GraduationCap size={16} /> Exam Center
              </Link>
              <Link href="/tools/learning/progress" className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white dark:bg-white/5 border border-[#E5E7EB] dark:border-white/10 text-sm font-semibold min-h-[44px] hover:border-[#6D5DF6]/30 transition-colors">
                <Trophy size={16} className="text-[#6D5DF6]" /> My Progress
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <FilterChips filters={HUB_FILTERS} active={filter} onChange={setFilter} className="mb-8" />

        {filtered.length === 0 ? (
          <div className="text-center py-20 text-slate-400">
            <p className="text-lg font-medium">No subjects match your filters</p>
            <p className="text-sm mt-2">Try adjusting your search or filter criteria</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filtered.map((subject, i) => (
              <SubjectCard key={subject.slug} subject={subject} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
