"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  Search,
  HelpCircle,
  BookOpen,
  FileText,
  Briefcase,
  Code2,
  CreditCard,
  Shield,
  Headphones,
  LayoutGrid,
} from "lucide-react";
import { useTranslation } from "@/lib/i18n/provider";
import { spacing, animation, card, badge, input as inputStyles, sectionBg } from "@/lib/design-system";
import { SectionHeader } from "./section-header";
import { cn } from "@/lib/utils";

type FaqItem = {
  category: string;
  question: string;
  answer: string;
};

const CATEGORY_IDS = ["general", "learning", "resume", "career", "devtools", "payments", "privacy", "support"] as const;

const CATEGORY_ICONS: Record<string, typeof HelpCircle> = {
  general: HelpCircle,
  learning: BookOpen,
  resume: FileText,
  career: Briefcase,
  devtools: Code2,
  payments: CreditCard,
  privacy: Shield,
  support: Headphones,
};

export function FaqSection() {
  const { t, tArray } = useTranslation("faq");
  const items = tArray<FaqItem>("items");
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [openKey, setOpenKey] = useState<string | null>(items[0] ? `${items[0].category}-${items[0].question}` : null);

  const filtered = useMemo(() => {
    return items.filter((item) => {
      if (activeCategory && item.category !== activeCategory) return false;
      if (!search) return true;
      const q = search.toLowerCase();
      return (
        item.question.toLowerCase().includes(q) ||
        item.answer.toLowerCase().includes(q)
      );
    });
  }, [items, search, activeCategory]);

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    items.forEach((item) => {
      counts[item.category] = (counts[item.category] ?? 0) + 1;
    });
    return counts;
  }, [items]);

  return (
    <section className={cn(spacing.section, sectionBg.mesh, "relative")}>
      <div className="blur-orb w-[350px] h-[350px] bg-brand/8 bottom-0 right-1/4" aria-hidden />
      <div className={cn(spacing.container, "relative max-w-4xl")}>
        <SectionHeader
          title={t("title")}
          subtitle={t("subtitle")}
        />

        {/* Search */}
        <div className="relative mb-5">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" aria-hidden />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t("search")}
            aria-label={t("search")}
            className={cn(inputStyles.base, "pl-12 shadow-sm")}
          />
        </div>

        {/* Category pills */}
        <div className="flex flex-wrap gap-2 mb-8">
          <button
            type="button"
            onClick={() => setActiveCategory(null)}
            className={cn(
              "inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium min-h-[44px] transition-all border",
              activeCategory === null
                ? "bg-brand text-brand-foreground border-brand shadow-sm shadow-brand/20"
                : "bg-background text-muted-foreground border-border hover:text-foreground hover:border-brand/30"
            )}
          >
            <LayoutGrid size={14} aria-hidden />
            {t("categories.all")}
            <span className="text-xs opacity-70">({items.length})</span>
          </button>
          {CATEGORY_IDS.map((id) => {
            const Icon = CATEGORY_ICONS[id] ?? HelpCircle;
            const count = categoryCounts[id] ?? 0;
            if (count === 0) return null;
            return (
              <button
                key={id}
                type="button"
                onClick={() => setActiveCategory(activeCategory === id ? null : id)}
                className={cn(
                  "inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium min-h-[44px] transition-all border",
                  activeCategory === id
                    ? "bg-brand text-brand-foreground border-brand shadow-sm shadow-brand/20"
                    : "bg-background text-muted-foreground border-border hover:text-foreground hover:border-brand/30"
                )}
              >
                <Icon size={14} aria-hidden />
                {t(`categories.${id}`)}
                <span className="text-xs opacity-70">({count})</span>
              </button>
            );
          })}
        </div>

        {/* Results count */}
        {search && (
          <p className="text-sm text-muted-foreground mb-4">
            {filtered.length} result{filtered.length !== 1 ? "s" : ""}
          </p>
        )}

        {/* Accordion */}
        <div className={cn(card.base, "p-3 sm:p-4 space-y-2")}>
          {filtered.length === 0 ? (
            <div className={cn(card.base, "text-center py-14 px-6")} role="status">
              <HelpCircle size={40} className="text-brand/30 mx-auto mb-4" aria-hidden />
              <p className="text-base font-semibold text-foreground">{t("emptyTitle")}</p>
              <p className="text-sm text-muted-foreground mt-2 max-w-sm mx-auto">{t("emptyDesc")}</p>
            </div>
          ) : (
            filtered.map((item, i) => {
              const key = `${item.category}-${item.question}`;
              const isOpen = openKey === key;
              const Icon = CATEGORY_ICONS[item.category] ?? HelpCircle;
              return (
                <motion.div
                  key={key}
                  {...animation.fadeUp}
                  {...animation.stagger(i % 8)}
                  className={cn(
                    "overflow-hidden rounded-xl border border-border/60 bg-background/60 transition-colors",
                    isOpen && "border-brand/25 shadow-md shadow-brand/5 bg-background"
                  )}
                >
                  <button
                    type="button"
                    onClick={() => setOpenKey(isOpen ? null : key)}
                    aria-expanded={isOpen}
                    className="w-full flex items-start justify-between gap-4 p-5 sm:p-6 text-left min-h-[44px] hover:bg-muted/40 transition-colors group"
                  >
                    <div className="flex gap-4 flex-1 min-w-0">
                      <div className={cn(
                        "w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-colors",
                        isOpen ? "bg-brand/15 text-brand" : "bg-muted text-muted-foreground group-hover:bg-brand/10 group-hover:text-brand"
                      )}>
                        <Icon size={16} aria-hidden />
                      </div>
                      <div className="min-w-0">
                        <span className={badge.brand}>{t(`categories.${item.category}`)}</span>
                        <p className="text-base font-semibold text-foreground mt-2 leading-snug">
                          {item.question}
                        </p>
                      </div>
                    </div>
                    <motion.div
                      animate={{ rotate: isOpen ? 180 : 0 }}
                      transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
                      className="shrink-0 mt-1 p-1 rounded-lg group-hover:bg-muted transition-colors"
                    >
                      <ChevronDown size={20} className="text-muted-foreground" aria-hidden />
                    </motion.div>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                        className="overflow-hidden"
                      >
                        <div className="px-5 sm:px-6 pb-6 pt-0 ml-[52px] sm:ml-[52px]">
                          <div className="border-t border-border pt-4">
                            <p className="text-base text-muted-foreground leading-relaxed">{item.answer}</p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
}
