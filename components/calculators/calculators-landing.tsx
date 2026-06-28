"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Search, Sparkles, TrendingUp, Star, Clock, Bookmark } from "lucide-react";
import {
  ALL_CALCULATORS,
  POPULAR_CALCULATORS,
  FEATURED_CALCULATORS,
} from "@/lib/calculators/registry";
import { CALCULATOR_CATEGORIES } from "@/lib/calculators/categories";
import type { CalculatorCategoryId } from "@/lib/calculators/types";
import { useCalculatorsStore } from "@/lib/calculators-store";
import { CalculatorCard } from "./calculator-card";
import { FilterChips } from "@/components/tools/filter-chips";

type FilterId = "all" | CalculatorCategoryId | "popular" | "favorites" | "recent";

export function CalculatorsLanding() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<FilterId>("all");
  const { favorites, recent } = useCalculatorsStore();

  const filters: { id: FilterId; label: string }[] = [
    { id: "all", label: "All" },
    { id: "popular", label: "Popular" },
    { id: "favorites", label: "Favorites" },
    { id: "recent", label: "Recent" },
    ...CALCULATOR_CATEGORIES.map((c) => ({ id: c.id as FilterId, label: `${c.emoji} ${c.label}` })),
  ];

  const filtered = useMemo(() => {
    let items = [...ALL_CALCULATORS];
    if (search) {
      const q = search.toLowerCase();
      items = items.filter(
        (c) => c.title.toLowerCase().includes(q) || c.description.toLowerCase().includes(q)
      );
    }
    if (filter === "popular") items = items.filter((c) => c.popular);
    else if (filter === "favorites") items = items.filter((c) => favorites.includes(c.slug));
    else if (filter === "recent") items = items.filter((c) => recent.includes(c.slug));
    else if (filter !== "all") items = items.filter((c) => c.category === filter);
    return items;
  }, [search, filter, favorites, recent]);

  const recentCalcs = useMemo(
    () => recent.map((s) => ALL_CALCULATORS.find((c) => c.slug === s)).filter(Boolean),
    [recent]
  );

  const favoriteCalcs = useMemo(
    () => favorites.map((s) => ALL_CALCULATORS.find((c) => c.slug === s)).filter(Boolean),
    [favorites]
  );

  return (
    <div className="min-h-full">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-[#E5E7EB] dark:border-white/10">
        <div className="blur-orb w-[500px] h-[500px] bg-[#6D5DF6]/10 -top-40 right-0" aria-hidden />
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#6D5DF6]/10 text-[#6D5DF6] text-sm font-semibold mb-4 border border-[#6D5DF6]/20">
              <Sparkles size={14} aria-hidden />
              {ALL_CALCULATORS.length}+ Financial Tools
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-4">
              Financial Calculators
            </h1>
            <p className="text-base sm:text-lg text-slate-500 dark:text-slate-400 max-w-2xl leading-relaxed mb-8">
              EMI, SIP, tax, salary, investments, and Bangladesh bank calculators — all in one premium fintech hub.
            </p>
            <div className="relative max-w-lg">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" aria-hidden />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search calculators..."
                aria-label="Search calculators"
                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white dark:bg-white/5 border border-[#E5E7EB] dark:border-white/10 text-base outline-none focus:border-[#6D5DF6]/50 focus:ring-2 focus:ring-[#6D5DF6]/20 min-h-[44px] shadow-sm"
              />
            </div>
          </motion.div>
        </div>
      </section>

      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12">
        <FilterChips
          filters={filters}
          active={filter}
          onChange={(id) => setFilter(id)}
          ariaLabel="Filter calculators"
        />

        {/* Featured */}
        {filter === "all" && !search && (
          <section>
            <div className="flex items-center gap-2 mb-6">
              <Star size={20} className="text-[#F59E0B]" aria-hidden />
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">Featured</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {FEATURED_CALCULATORS.slice(0, 8).map((c, i) => (
                <CalculatorCard key={c.slug} calculator={c} index={i} />
              ))}
            </div>
          </section>
        )}

        {/* Recent */}
        {filter === "all" && !search && recentCalcs.length > 0 && (
          <section>
            <div className="flex items-center gap-2 mb-6">
              <Clock size={20} className="text-[#6D5DF6]" aria-hidden />
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">Recently Used</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {recentCalcs.slice(0, 4).map((c, i) => c && <CalculatorCard key={c.slug} calculator={c} index={i} />)}
            </div>
          </section>
        )}

        {/* Popular */}
        {filter === "all" && !search && (
          <section>
            <div className="flex items-center gap-2 mb-6">
              <TrendingUp size={20} className="text-[#22C55E]" aria-hidden />
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">Popular</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {POPULAR_CALCULATORS.slice(0, 8).map((c, i) => (
                <CalculatorCard key={c.slug} calculator={c} index={i} />
              ))}
            </div>
          </section>
        )}

        {/* Favorites quick */}
        {filter === "all" && !search && favoriteCalcs.length > 0 && (
          <section>
            <div className="flex items-center gap-2 mb-6">
              <Bookmark size={20} className="text-[#6D5DF6]" aria-hidden />
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">Your Favorites</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {favoriteCalcs.slice(0, 4).map((c, i) => c && <CalculatorCard key={c.slug} calculator={c} index={i} />)}
            </div>
          </section>
        )}

        {/* Main grid / filtered */}
        <section>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-6">
            {search ? `Results (${filtered.length})` : filter === "all" ? "All Calculators" : filters.find((f) => f.id === filter)?.label}
          </h2>
          {filtered.length === 0 ? (
            <div className="text-center py-16 text-slate-400">
              <p className="text-lg font-medium">No calculators found</p>
              <p className="text-sm mt-2">Try a different search or category</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {filtered.map((c, i) => (
                <CalculatorCard key={c.slug} calculator={c} index={i} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
