"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Search, Sparkles, TrendingUp } from "lucide-react";
import { useTranslation } from "@/lib/i18n/provider";
import { spacing, animation, card, badge, button, sectionBg } from "@/lib/design-system";
import { ALL_TOOLS, CATEGORIES } from "@/lib/landing-data";
import { SectionHeader } from "./section-header";
import { SectionCta } from "../v5/section-cta";
import { cn } from "@/lib/utils";

const CATEGORY_KEYS = ["core", "systems", "development", "specialized"] as const;
const TRENDING = new Set(["Data Structures", "Algorithms", "Web Development"]);
const NEW = new Set(["Data Science", "DevOps"]);

export function LearningExplorer() {
  const { t } = useTranslation("home");
  const { t: tV5 } = useTranslation("v5");
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const filtered = useMemo(() => {
    let tools = [...ALL_TOOLS];
    if (activeCategory) {
      const cat = CATEGORIES.find((c) => c.name === activeCategory);
      if (cat) tools = tools.filter((tool) => cat.tools.includes(tool.name));
    }
    if (search) {
      const q = search.toLowerCase();
      tools = tools.filter(
        (tool) =>
          tool.name.toLowerCase().includes(q) || tool.desc.toLowerCase().includes(q)
      );
    }
    return tools;
  }, [search, activeCategory]);

  return (
    <section className={cn(spacing.section, sectionBg.surface, "relative")}>
      <div className="blur-orb w-[400px] h-[400px] bg-brand/10 bottom-0 left-0" aria-hidden />
      <div className={cn(spacing.container, "relative")}>
        <SectionHeader
          badge={t("learning.badge")}
          title={t("learning.title")}
          subtitle={t("learning.subtitle")}
        />

        <div className="flex flex-col lg:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
              aria-hidden
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t("learning.search")}
              aria-label={t("learning.search")}
              className="w-full pl-12 pr-4 py-3 rounded-xl bg-background border border-border text-foreground placeholder:text-muted-foreground outline-none focus:border-brand/50 focus:ring-2 focus:ring-brand/20 min-h-[44px] transition-colors"
            />
          </div>
          <Link
            href="/tools"
            className={cn(button.primary, "inline-flex items-center justify-center gap-2 shrink-0")}
          >
            {t("learning.continue")} <ArrowRight size={16} aria-hidden />
          </Link>
        </div>

        <div className="flex flex-wrap gap-2 mb-8">
          <button
            type="button"
            onClick={() => setActiveCategory(null)}
            className={cn(
              "px-4 py-2 rounded-full text-sm font-medium min-h-[44px] transition-colors",
              activeCategory === null
                ? "bg-brand text-brand-foreground"
                : "bg-muted text-muted-foreground hover:text-foreground"
            )}
          >
            {t("learning.filters")}
          </button>
          {CATEGORIES.map((cat, i) => {
            const key = CATEGORY_KEYS[i];
            const isActive = activeCategory === cat.name;
            return (
              <button
                key={cat.name}
                type="button"
                onClick={() => setActiveCategory(isActive ? null : cat.name)}
                className={cn(
                  "inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium min-h-[44px] transition-colors",
                  isActive
                    ? "bg-brand text-brand-foreground"
                    : "bg-muted text-muted-foreground hover:text-foreground"
                )}
              >
                <cat.icon size={16} aria-hidden />
                {t(`learning.categories.${key}`)}
              </button>
            );
          })}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.length === 0 ? (
            <p className="col-span-full text-center py-12 text-muted-foreground">
              {t("learning.search")}
            </p>
          ) : (
            filtered.map((tool, i) => (
              <motion.div key={tool.href} {...animation.fadeUp} {...animation.stagger(i % 8)}>
                <Link href={tool.href} className="block h-full">
                  <div className={cn(card.base, card.hover, card.interactive, "p-5 h-full relative")}>
                    <div className="absolute top-4 right-4 flex gap-1.5">
                      {TRENDING.has(tool.name) && (
                        <span className={badge.brand}>
                          <TrendingUp size={12} aria-hidden />
                          {t("learning.trending")}
                        </span>
                      )}
                      {NEW.has(tool.name) && (
                        <span className={badge.success}>
                          <Sparkles size={12} aria-hidden />
                          {t("learning.new")}
                        </span>
                      )}
                    </div>
                    <div
                      className={cn(
                        "w-11 h-11 rounded-xl bg-gradient-to-br flex items-center justify-center mb-4 shadow-md",
                        tool.color
                      )}
                    >
                      <tool.icon size={20} className="text-white" aria-hidden />
                    </div>
                    <h3 className="text-sm font-bold text-foreground mb-1 pr-16">{tool.name}</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">{tool.desc}</p>
                  </div>
                </Link>
              </motion.div>
            ))
          )}
        </div>

        <SectionCta label={tV5("sectionCta.learning")} href="/tools" />
      </div>
    </section>
  );
}
