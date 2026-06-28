"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "@/lib/i18n/provider";
import { TOP_LIST_KEYS, getTopUniversities } from "@/lib/universities/top-lists";
import type { TopListKey } from "@/lib/universities/types";
import { UniversityCompactCard } from "./university-compact-card";
import { spacing, animation } from "@/lib/design-system";
import { cn } from "@/lib/utils";

export function UniversityTopSections() {
  const { t } = useTranslation("universities");
  const [active, setActive] = useState<TopListKey>("public");
  const universities = getTopUniversities(active, 10);

  return (
    <section className={cn(spacing.section, "border-b border-border bg-background")}>
      <div className={cn(spacing.container)}>
        <motion.div {...animation.fadeUp} className="mb-6">
          <h2 className="text-heading font-extrabold text-foreground mb-2">{t("top.title")}</h2>
          <p className="text-muted-foreground text-sm">{t("top.subtitle")}</p>
        </motion.div>

        <div className="flex gap-2 overflow-x-auto pb-4 -mx-1 px-1 scrollbar-thin" role="tablist">
          {TOP_LIST_KEYS.map((key) => (
            <button
              key={key}
              type="button"
              role="tab"
              aria-selected={active === key}
              onClick={() => setActive(key)}
              className={cn(
                "shrink-0 px-4 py-2 rounded-full text-xs font-semibold border transition-colors min-h-[40px]",
                active === key
                  ? "bg-brand text-brand-foreground border-brand"
                  : "border-border text-muted-foreground hover:text-foreground hover:border-brand/30"
              )}
            >
              {t(`top.lists.${key}`)}
            </button>
          ))}
        </div>

        <div className="flex gap-4 overflow-x-auto pb-2 -mx-1 px-1">
          {universities.length === 0 ? (
            <p className="text-sm text-muted-foreground py-8">{t("top.empty")}</p>
          ) : (
            universities.map((u) => <UniversityCompactCard key={u.slug} university={u} />)
          )}
        </div>
      </div>
    </section>
  );
}
