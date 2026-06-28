"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Search, Sparkles, Star, Clock, Bookmark, TrendingUp,
  FileText, Send, Calendar, Target, Zap, Bell, ArrowRight,
} from "lucide-react";
import { CAREER_TOOLS } from "@/lib/career/tools";
import { CAREER_CATEGORIES } from "@/lib/career/categories";
import type { CareerToolCategory } from "@/lib/career/types";
import { useCareerStore } from "@/lib/career-store";
import { CareerToolCard } from "./career-tool-card";
import { CareerStatCard } from "./career-stat-card";
import { FilterChips } from "@/components/tools/filter-chips";

type FilterId = "all" | CareerToolCategory | "popular" | "favorites" | "recent";

const RECOMMENDED_JOBS = [
  { company: "Google", role: "Software Engineering Intern", location: "Mountain View, CA" },
  { company: "Microsoft", role: "Explore Program Intern", location: "Redmond, WA" },
  { company: "Stripe", role: "Backend Engineer Intern", location: "Remote" },
  { company: "Shopify", role: "Developer Intern", location: "Toronto, ON" },
];

const QUICK_ACTIONS = [
  { label: "Build Resume", href: "/cv-builder", icon: FileText },
  { label: "ATS Check", href: "/career/ats-checker", icon: Target },
  { label: "Mock Interview", href: "/career/interview/mock", icon: Zap },
  { label: "Track Application", href: "/career/job-tracker", icon: Send },
];

export function CareerLanding() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<FilterId>("all");
  const { favorites, recent, getStats, resumeScore, atsScore, skillProgress, activities, savedJobs } = useCareerStore();
  const stats = getStats();

  const filters: { id: FilterId; label: string }[] = [
    { id: "all", label: "All" },
    { id: "popular", label: "Popular" },
    { id: "favorites", label: "Favorites" },
    { id: "recent", label: "Recent" },
    ...CAREER_CATEGORIES.map((c) => ({ id: c.id as FilterId, label: `${c.emoji} ${c.label}` })),
  ];

  const filtered = useMemo(() => {
    let items = [...CAREER_TOOLS];
    if (search) {
      const q = search.toLowerCase();
      items = items.filter((t) => t.title.toLowerCase().includes(q) || t.description.toLowerCase().includes(q));
    }
    if (filter === "popular") items = items.filter((t) => t.popular);
    else if (filter === "favorites") items = items.filter((t) => favorites.includes(t.slug));
    else if (filter === "recent") items = items.filter((t) => recent.includes(t.slug));
    else if (filter !== "all") items = items.filter((t) => t.category === filter);
    return items;
  }, [search, filter, favorites, recent]);

  const recentTools = useMemo(() => recent.map((s) => CAREER_TOOLS.find((t) => t.slug === s)).filter(Boolean), [recent]);
  const favoriteTools = useMemo(() => favorites.map((s) => CAREER_TOOLS.find((t) => t.slug === s)).filter(Boolean), [favorites]);
  const featured = CAREER_TOOLS.filter((t) => t.featured);
  const avgSkill = Math.round(skillProgress.reduce((a, s) => a + s.progress, 0) / (skillProgress.length || 1));

  return (
    <div className="min-h-full">
      <section className="relative overflow-hidden border-b border-border dark:border-white/10">
        <div className="blur-orb w-[500px] h-[500px] bg-brand/10 -top-40 left-0" aria-hidden />
        <div className="blur-orb w-[400px] h-[400px] bg-brand-accent/10 -top-20 right-0" aria-hidden />
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand/10 text-brand text-sm font-semibold mb-4 border border-brand/20">
              <Sparkles size={14} aria-hidden />
              All-in-One Career Platform
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-4">
              Career Hub
            </h1>
            <p className="text-base sm:text-lg text-slate-500 dark:text-slate-400 max-w-2xl leading-relaxed mb-8">
              Resume building, ATS optimization, interview prep, application tracking, and career roadmaps — everything CS students need to land their dream job.
            </p>
            <div className="relative max-w-lg">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" aria-hidden />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search career tools..."
                aria-label="Search career tools"
                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white dark:bg-white/5 border border-border dark:border-white/10 text-base outline-none focus:border-brand/50 focus:ring-2 focus:ring-brand/20 min-h-[44px] shadow-sm"
              />
            </div>
          </motion.div>
        </div>
      </section>

      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
        {/* Dashboard Stats */}
        <section>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Career Dashboard</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <CareerStatCard label="Resume Score" value={resumeScore || "—"} suffix={resumeScore ? "/100" : undefined} icon={FileText} index={0} />
            <CareerStatCard label="ATS Score" value={atsScore || "—"} suffix={atsScore ? "/100" : undefined} icon={Target} gradient="from-[#F59E0B] to-[#EF4444]" index={1} />
            <CareerStatCard label="Applications" value={stats.totalApplications} icon={Send} gradient="from-[#10B981] to-brand-accent" index={2} />
            <CareerStatCard label="Interviews" value={stats.interviews} icon={Calendar} gradient="from-[#8B5CF6] to-brand" index={3} />
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mt-3 sm:mt-4">
            <CareerStatCard label="Offers" value={stats.offers} icon={TrendingUp} index={4} />
            <CareerStatCard label="Deadlines" value={stats.upcomingDeadlines} icon={Bell} gradient="from-[#EF4444] to-[#F59E0B]" index={5} />
            <CareerStatCard label="Saved Jobs" value={savedJobs.length} icon={Bookmark} index={6} />
            <CareerStatCard label="Skill Progress" value={avgSkill} suffix="%" icon={Zap} index={7} />
          </div>
        </section>

        {/* Quick Actions */}
        <section>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {QUICK_ACTIONS.map((action) => (
              <Link
                key={action.href}
                href={action.href}
                className="glass-card p-4 flex flex-col items-center gap-2 text-center hover:border-brand/30 transition-colors min-h-[88px] justify-center"
              >
                <action.icon size={22} className="text-brand" aria-hidden />
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">{action.label}</span>
              </Link>
            ))}
          </div>
        </section>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Skill Progress */}
          <section className="lg:col-span-1 glass-card p-5">
            <h2 className="text-base font-bold text-slate-900 dark:text-white mb-4">Skill Progress</h2>
            <div className="space-y-3">
              {skillProgress.slice(0, 5).map((s) => (
                <div key={s.skill}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-600 dark:text-slate-300 truncate">{s.skill}</span>
                    <span className="text-slate-400 tabular-nums">{s.progress}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-100 dark:bg-white/10 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${s.progress}%` }}
                      transition={{ duration: 0.8, delay: 0.2 }}
                      className="h-full rounded-full bg-gradient-to-r from-brand to-brand-accent"
                    />
                  </div>
                </div>
              ))}
            </div>
            <Link href="/career/analytics" className="inline-flex items-center gap-1 text-sm text-brand font-medium mt-4 hover:underline">
              View analytics <ArrowRight size={14} />
            </Link>
          </section>

          {/* Recommended Jobs */}
          <section className="lg:col-span-1 glass-card p-5">
            <h2 className="text-base font-bold text-slate-900 dark:text-white mb-4">Recommended Jobs</h2>
            <div className="space-y-3">
              {RECOMMENDED_JOBS.map((job) => (
                <div key={job.company + job.role} className="p-3 rounded-xl bg-slate-50 dark:bg-white/5">
                  <p className="font-semibold text-sm text-slate-800 dark:text-slate-100">{job.role}</p>
                  <p className="text-xs text-slate-500">{job.company} · {job.location}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Recent Activity */}
          <section className="lg:col-span-1 glass-card p-5">
            <h2 className="text-base font-bold text-slate-900 dark:text-white mb-4">Recent Activity</h2>
            {activities.length === 0 ? (
              <p className="text-sm text-slate-400">No activity yet. Start tracking applications!</p>
            ) : (
              <div className="space-y-3">
                {activities.slice(0, 5).map((a) => (
                  <div key={a.id} className="text-sm">
                    <span className="font-medium text-brand">{a.action}</span>
                    <span className="text-slate-500 dark:text-slate-400"> — {a.detail}</span>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>

        <FilterChips filters={filters} active={filter} onChange={setFilter} ariaLabel="Filter career tools" />

        {filter === "all" && !search && (
          <section>
            <div className="flex items-center gap-2 mb-6">
              <Star size={20} className="text-[#F59E0B]" aria-hidden />
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Featured Tools</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {featured.slice(0, 8).map((t, i) => <CareerToolCard key={t.slug} tool={t} index={i} />)}
            </div>
          </section>
        )}

        {filter === "all" && !search && recentTools.length > 0 && (
          <section>
            <div className="flex items-center gap-2 mb-6">
              <Clock size={20} className="text-slate-400" aria-hidden />
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Recently Used</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {recentTools.slice(0, 4).map((t, i) => t && <CareerToolCard key={t.slug} tool={t} index={i} />)}
            </div>
          </section>
        )}

        {filter === "all" && !search && favoriteTools.length > 0 && (
          <section>
            <div className="flex items-center gap-2 mb-6">
              <Bookmark size={20} className="text-brand" aria-hidden />
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Favorites</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {favoriteTools.slice(0, 4).map((t, i) => t && <CareerToolCard key={t.slug} tool={t} index={i} />)}
            </div>
          </section>
        )}

        <section>
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp size={20} className="text-brand" aria-hidden />
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              {search || filter !== "all" ? `Results (${filtered.length})` : "All Career Tools"}
            </h2>
          </div>
          {filtered.length === 0 ? (
            <p className="text-slate-500 text-center py-12">No tools match your search.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {filtered.map((t, i) => <CareerToolCard key={t.slug} tool={t} index={i} />)}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
