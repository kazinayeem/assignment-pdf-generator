"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Search, SlidersHorizontal, Sparkles, X } from "lucide-react";
import { useTranslation } from "@/lib/i18n/provider";
import { spacing, animation, card, badge } from "@/lib/design-system";
import { RoadmapCard } from "./roadmap-card";
import {
  ROADMAP_CATEGORIES,
  ROADMAP_DEFINITIONS,
  recommendRoadmaps,
  searchRoadmaps,
} from "@/lib/roadmaps";
import { useRoadmapsStore, getRoadmapCompletionPercent } from "@/lib/roadmaps/store";
import type { RoadmapCategory, RoadmapDifficulty } from "@/lib/roadmaps/types";
import { cn } from "@/lib/utils";
import Link from "next/link";

export function RoadmapsHubClient() {
  const { t } = useTranslation("roadmaps");
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<RoadmapCategory | "all">("all");
  const [difficulty, setDifficulty] = useState<RoadmapDifficulty | "all">("all");
  const [beginnerOnly, setBeginnerOnly] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const { careerGoal, favoriteTech, bookmarks, recentSlugs } = useRoadmapsStore();

  const recommended = useMemo(
    () => recommendRoadmaps({ careerGoal, favoriteTech, completedSlugs: recentSlugs, limit: 6 }),
    [careerGoal, favoriteTech, recentSlugs]
  );

  const filtered = useMemo(() => {
    let list = query ? searchRoadmaps(query) : ROADMAP_DEFINITIONS;
    if (category !== "all") list = list.filter((r) => r.category === category);
    if (difficulty !== "all") list = list.filter((r) => r.difficulty === difficulty);
    if (beginnerOnly) list = list.filter((r) => r.beginnerFriendly);
    return list.sort((a, b) => b.popularity - a.popularity);
  }, [query, category, difficulty, beginnerOnly]);

  const featured = ROADMAP_DEFINITIONS.filter((r) => r.featured);

  return (
    <div className={cn(spacing.container, "py-8 sm:py-12 max-w-[1400px]")}>
      <motion.div {...animation.fadeUp} className="text-center max-w-3xl mx-auto mb-10">
        <span className={badge.brand}>{t("hub.badge")}</span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground mt-4 mb-3">{t("hub.title")}</h1>
        <p className="text-muted-foreground text-lg leading-relaxed">{t("hub.subtitle")}</p>
        <p className="text-sm text-muted-foreground mt-2">
          {ROADMAP_DEFINITIONS.length}+ {t("hub.roadmapCount")}
        </p>
      </motion.div>

      <motion.div {...animation.fadeUp} className="flex flex-col sm:flex-row gap-3 mb-8">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t("search.placeholder")}
            className="w-full pl-10 pr-4 py-3 rounded-xl bg-card border border-border text-foreground placeholder:text-muted-foreground focus:border-brand/50 focus:ring-2 focus:ring-brand/20 outline-none"
          />
          {query && (
            <button type="button" onClick={() => setQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-lg hover:bg-muted">
              <X size={16} />
            </button>
          )}
        </div>
        <button
          type="button"
          onClick={() => setShowFilters(!showFilters)}
          className={cn(
            "flex items-center justify-center gap-2 px-4 py-3 rounded-xl border font-semibold text-sm",
            showFilters ? "border-brand bg-brand/10 text-brand" : "border-border hover:bg-muted"
          )}
        >
          <SlidersHorizontal size={16} />
          {t("filters.title")}
        </button>
        <Link
          href="/roadmaps/dashboard"
          className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl gradient-primary text-brand-foreground font-semibold text-sm"
        >
          {t("nav.dashboard")}
        </Link>
      </motion.div>

      {showFilters && (
        <motion.div {...animation.fadeUp} className={cn(card.base, "p-4 mb-8 flex flex-wrap gap-3")}>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as RoadmapCategory | "all")}
            className="px-3 py-2 rounded-lg border border-border bg-background text-sm"
          >
            <option value="all">{t("filters.allCategories")}</option>
            {ROADMAP_CATEGORIES.map((c) => (
              <option key={c.id} value={c.id}>{c.label}</option>
            ))}
          </select>
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value as RoadmapDifficulty | "all")}
            className="px-3 py-2 rounded-lg border border-border bg-background text-sm"
          >
            <option value="all">{t("filters.allDifficulty")}</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
            <option value="expert">Expert</option>
          </select>
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input type="checkbox" checked={beginnerOnly} onChange={(e) => setBeginnerOnly(e.target.checked)} className="rounded" />
            {t("filters.beginnerFriendly")}
          </label>
        </motion.div>
      )}

      {recommended.length > 0 && !query && (
        <section className="mb-12">
          <div className="flex items-center gap-2 mb-5">
            <Sparkles size={18} className="text-brand" />
            <h2 className="text-xl font-bold">{t("hub.recommended")}</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {recommended.map((r) => (
              <RoadmapCard
                key={r.slug}
                roadmap={r}
                progress={getRoadmapCompletionPercent(r.slug, r.nodeDefs.length)}
              />
            ))}
          </div>
        </section>
      )}

      {!query && featured.length > 0 && (
        <section className="mb-12">
          <h2 className="text-xl font-bold mb-5">{t("hub.featured")}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {featured.map((r) => (
              <RoadmapCard
                key={r.slug}
                roadmap={r}
                progress={getRoadmapCompletionPercent(r.slug, r.nodeDefs.length)}
              />
            ))}
          </div>
        </section>
      )}

      {bookmarks.length > 0 && !query && (
        <section className="mb-12">
          <h2 className="text-xl font-bold mb-5">{t("hub.bookmarks")}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {bookmarks.map((slug) => {
              const r = ROADMAP_DEFINITIONS.find((x) => x.slug === slug);
              if (!r) return null;
              return (
                <RoadmapCard
                  key={slug}
                  roadmap={r}
                  progress={getRoadmapCompletionPercent(slug, r.nodeDefs.length)}
                />
              );
            })}
          </div>
        </section>
      )}

      <section>
        <h2 className="text-xl font-bold mb-5">
          {query ? t("search.results").replace("{{count}}", String(filtered.length)) : t("hub.allRoadmaps")}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
          {filtered.map((r) => (
            <RoadmapCard
              key={r.slug}
              roadmap={r}
              progress={getRoadmapCompletionPercent(r.slug, r.nodeDefs.length)}
            />
          ))}
        </div>
        {filtered.length === 0 && (
          <p className={cn(card.base, "p-8 text-center text-muted-foreground")}>{t("search.empty")}</p>
        )}
      </section>
    </div>
  );
}
