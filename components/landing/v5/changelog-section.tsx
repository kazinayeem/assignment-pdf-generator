"use client";

import { motion } from "framer-motion";
import { Bug, Rocket, Zap } from "lucide-react";
import { useTranslation } from "@/lib/i18n/provider";
import { spacing, animation, card } from "@/lib/design-system";
import { SectionHeader } from "../v4/section-header";
import { cn } from "@/lib/utils";

type ChangelogVersion = {
  version: string;
  date: string;
  features: string[];
  fixes: string[];
  performance: string[];
};

export function ChangelogSection() {
  const { t, tArray } = useTranslation("v5");
  const versions = tArray<ChangelogVersion>("changelog.versions");

  return (
    <section className={cn(spacing.section, "relative bg-background")}>
      <div className={cn(spacing.container, "relative max-w-3xl")}>
        <SectionHeader
          badge={t("changelog.badge")}
          title={t("changelog.title")}
          subtitle={t("changelog.subtitle")}
        />

        <div className="space-y-6">
          {versions.map((ver, i) => (
            <motion.article
              key={ver.version}
              {...animation.fadeUp}
              {...animation.stagger(i)}
              className={cn(card.base, "p-6 sm:p-8")}
            >
              <div className="flex items-baseline justify-between gap-4 mb-5">
                <h3 className="text-lg font-bold text-foreground">{ver.version}</h3>
                <time className="text-sm text-muted-foreground">{ver.date}</time>
              </div>

              {[
                { key: "features", icon: Rocket, items: ver.features, color: "text-brand" },
                { key: "fixes", icon: Bug, items: ver.fixes, color: "text-success" },
                { key: "performance", icon: Zap, items: ver.performance, color: "text-warning" },
              ].map((group) =>
                group.items.length > 0 ? (
                  <div key={group.key} className="mb-4 last:mb-0">
                    <p className={cn("text-xs font-bold uppercase tracking-wider mb-2 flex items-center gap-1.5", group.color)}>
                      <group.icon size={14} aria-hidden />
                      {t(`changelog.labels.${group.key}`)}
                    </p>
                    <ul className="space-y-1.5">
                      {group.items.map((item) => (
                        <li key={item} className="text-sm text-muted-foreground flex items-start gap-2">
                          <span className="text-brand mt-1.5 w-1 h-1 rounded-full bg-brand shrink-0" aria-hidden />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null
              )}
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
