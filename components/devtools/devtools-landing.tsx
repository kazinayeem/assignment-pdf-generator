"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Search, Sparkles, Star, TrendingUp, Clock, Bookmark } from "lucide-react";
import { ALL_DEVTOOLS, FEATURED_DEVTOOLS, POPULAR_DEVTOOLS } from "@/lib/devtools/registry";
import { DEVTOOL_CATEGORIES } from "@/lib/devtools/categories";
import type { DevToolCategoryId } from "@/lib/devtools/types";
import { useDevToolsStore } from "@/lib/devtools-store";
import { DevToolCard } from "./tool-card";
import { FilterChips } from "@/components/tools/filter-chips";

type FilterId = "all" | DevToolCategoryId | "popular" | "favorites" | "recent";

export function DevToolsLanding() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<FilterId>("all");
  const { favorites, recent } = useDevToolsStore();

  const filters: { id: FilterId; label: string }[] = [
    { id: "all", label: "All" },
    { id: "popular", label: "Popular" },
    { id: "favorites", label: "Favorites" },
    { id: "recent", label: "Recent" },
    ...DEVTOOL_CATEGORIES.map((c) => ({ id: c.id as FilterId, label: `${c.emoji} ${c.label}` })),
  ];

  const filtered = useMemo(() => {
    let items = [...ALL_DEVTOOLS];
    if (search) {
      const q = search.toLowerCase();
      items = items.filter(
        (t) => t.title.toLowerCase().includes(q) || t.description.toLowerCase().includes(q)
      );
    }
    if (filter === "popular") items = items.filter((t) => t.popular);
    else if (filter === "favorites") items = items.filter((t) => favorites.includes(t.slug));
    else if (filter === "recent") items = items.filter((t) => recent.includes(t.slug));
    else if (filter !== "all") items = items.filter((t) => t.category === filter);
    return items;
  }, [search, filter, favorites, recent]);

  const recentTools = useMemo(
    () => recent.map((s) => ALL_DEVTOOLS.find((t) => t.slug === s)).filter(Boolean),
    [recent]
  );

  const favoriteTools = useMemo(
    () => favorites.map((s) => ALL_DEVTOOLS.find((t) => t.slug === s)).filter(Boolean),
    [favorites]
  );

  return (
    <div className="min-h-full">
      <section className="relative overflow-hidden border-b border-[#E5E7EB] dark:border-white/10">
        <div className="blur-orb w-[500px] h-[500px] bg-[#06B6D4]/10 -top-40 left-0" aria-hidden />
        <div className="blur-orb w-[400px] h-[400px] bg-[#6D5DF6]/10 -top-20 right-0" aria-hidden />
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#6D5DF6]/10 text-[#6D5DF6] text-sm font-semibold mb-4 border border-[#6D5DF6]/20">
              <Sparkles size={14} aria-hidden />
              {ALL_DEVTOOLS.length}+ Developer Utilities
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-4">
              Developer Tools
            </h1>
            <p className="text-base sm:text-lg text-slate-500 dark:text-slate-400 max-w-2xl leading-relaxed mb-8">
              JSON, YAML, CSS, colors, encoders, generators, and playgrounds — a premium dev toolbox built into CampusFlow.
            </p>
            <div className="relative max-w-lg">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" aria-hidden />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search developer tools..."
                aria-label="Search developer tools"
                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white dark:bg-white/5 border border-[#E5E7EB] dark:border-white/10 text-base outline-none focus:border-[#6D5DF6]/50 focus:ring-2 focus:ring-[#6D5DF6]/20 min-h-[44px] shadow-sm"
              />
            </div>
          </motion.div>
        </div>
      </section>

      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12">
        <FilterChips filters={filters} active={filter} onChange={setFilter} ariaLabel="Filter developer tools" />

        {filter === "all" && !search && (
          <section>
            <div className="flex items-center gap-2 mb-6">
              <Star size={20} className="text-[#F59E0B]" aria-hidden />
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Featured Tools</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {FEATURED_DEVTOOLS.slice(0, 8).map((t, i) => (
                <DevToolCard key={t.slug} tool={t} index={i} />
              ))}
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
              {recentTools.slice(0, 4).map((t, i) => t && <DevToolCard key={t.slug} tool={t} index={i} />)}
            </div>
          </section>
        )}

        {filter === "all" && !search && favoriteTools.length > 0 && (
          <section>
            <div className="flex items-center gap-2 mb-6">
              <Bookmark size={20} className="text-[#6D5DF6]" aria-hidden />
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Favorites</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {favoriteTools.slice(0, 4).map((t, i) => t && <DevToolCard key={t.slug} tool={t} index={i} />)}
            </div>
          </section>
        )}

        {filter === "all" && !search && (
          <section>
            <div className="flex items-center gap-2 mb-6">
              <TrendingUp size={20} className="text-emerald-500" aria-hidden />
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Popular Tools</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {POPULAR_DEVTOOLS.slice(0, 12).map((t, i) => (
                <DevToolCard key={t.slug} tool={t} index={i} />
              ))}
            </div>
          </section>
        )}

        <section>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">
            {search ? `Results (${filtered.length})` : "All Tools"}
          </h2>
          {filtered.length === 0 ? (
            <div className="glass-card p-12 text-center text-slate-500">No tools match your search.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {filtered.map((t, i) => (
                <DevToolCard key={t.slug} tool={t} index={i} />
              ))}
            </div>
          )}
        </section>

        {filter === "all" && !search && (
          <section>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Categories</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-3">
              {DEVTOOL_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setFilter(cat.id)}
                  className="glass-card p-4 text-left hover:scale-[1.02] transition-transform min-h-[44px]"
                >
                  <span className="text-2xl mb-2 block" aria-hidden>{cat.emoji}</span>
                  <p className="text-sm font-bold text-slate-900 dark:text-white">{cat.label}</p>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">{cat.description}</p>
                </button>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
