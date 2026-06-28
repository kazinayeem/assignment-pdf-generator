"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Search } from "lucide-react";
import { useTranslation } from "@/lib/i18n/provider";
import { spacing, animation, card } from "@/lib/design-system";
import { SectionHeader } from "./section-header";
import { cn } from "@/lib/utils";

type FaqItem = {
  category: string;
  question: string;
  answer: string;
};

const CATEGORY_IDS = ["general", "learning", "resume", "career", "devtools", "payments", "privacy", "support"] as const;

export function FaqSection() {
  const { t, tArray } = useTranslation("faq");
  const items = tArray<FaqItem>("items");
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [openIndex, setOpenIndex] = useState<number | null>(0);

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

  return (
    <section className={cn(spacing.section, "relative bg-surface-page")}>
      <div className="blur-orb w-[350px] h-[350px] bg-brand/10 bottom-0 right-1/4" aria-hidden />
      <div className={cn(spacing.container, "relative max-w-3xl")}>
        <SectionHeader
          title={t("title")}
          subtitle={t("subtitle")}
        />

        <div className="relative mb-6">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
            aria-hidden
          />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t("search")}
            aria-label={t("search")}
            className="w-full pl-12 pr-4 py-3 rounded-xl bg-background border border-border text-foreground placeholder:text-muted-foreground outline-none focus:border-brand/50 focus:ring-2 focus:ring-brand/20 min-h-[44px] transition-colors"
          />
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
            {t("categories.all")}
          </button>
          {CATEGORY_IDS.map((id) => (
            <button
              key={id}
              type="button"
              onClick={() => setActiveCategory(activeCategory === id ? null : id)}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-medium min-h-[44px] transition-colors",
                activeCategory === id
                  ? "bg-brand text-brand-foreground"
                  : "bg-muted text-muted-foreground hover:text-foreground"
              )}
            >
              {t(`categories.${id}`)}
            </button>
          ))}
        </div>

        <div className="space-y-3">
          {filtered.length === 0 ? (
            <div className={cn(card.base, "text-center py-12 px-6")} role="status">
              <p className="text-sm font-semibold text-foreground">{t("emptyTitle")}</p>
              <p className="text-sm text-muted-foreground mt-2">{t("emptyDesc")}</p>
            </div>
          ) : (
            filtered.map((item, i) => {
              const isOpen = openIndex === i;
              return (
                <motion.div
                  key={`${item.question}-${i}`}
                  {...animation.fadeUp}
                  {...animation.stagger(i % 6)}
                  className={cn(card.base, "overflow-hidden !rounded-2xl")}
                >
                  <button
                    type="button"
                    onClick={() => setOpenIndex(isOpen ? null : i)}
                    aria-expanded={isOpen}
                    className="w-full flex items-center justify-between gap-4 p-5 text-left min-h-[44px] hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <span className="text-xs font-medium text-brand uppercase tracking-wider">
                        {t(`categories.${item.category}`)}
                      </span>
                      <p className="text-sm font-semibold text-foreground mt-1">
                        {item.question}
                      </p>
                    </div>
                    <motion.div
                      animate={{ rotate: isOpen ? 180 : 0 }}
                      transition={{ duration: 0.25 }}
                      className="shrink-0"
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
                        <div className="px-5 pb-5 pt-0 text-sm text-muted-foreground leading-relaxed border-t border-border">
                          <p className="pt-4">{item.answer}</p>
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
