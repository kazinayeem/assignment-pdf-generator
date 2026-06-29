"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Map, Sparkles } from "lucide-react";
import { useTranslation } from "@/lib/i18n/provider";
import { spacing, animation, card, badge, button, sectionBg } from "@/lib/design-system";
import { ROADMAP_DEFINITIONS } from "@/lib/roadmaps";
import { RoadmapCard } from "@/components/roadmaps/roadmap-card";
import { cn } from "@/lib/utils";

export function RoadmapsLandingSection() {
  const { t } = useTranslation("roadmaps");
  const featured = ROADMAP_DEFINITIONS.filter((r) => r.featured).slice(0, 4);
  const popular = [...ROADMAP_DEFINITIONS]
    .sort((a, b) => b.popularity - a.popularity)
    .filter((r) => !r.featured)
    .slice(0, 8);

  return (
    <section className={cn(spacing.section, sectionBg.mesh, "relative border-y border-border")}>
      <div className="blur-orb w-[400px] h-[400px] bg-brand/10 top-0 right-0" aria-hidden />
      <div className={cn(spacing.container, "relative max-w-[1400px]")}>
        <motion.div {...animation.fadeUp} className="text-center max-w-3xl mx-auto mb-10">
          <span className={cn(badge.brand, "mb-4")}>
            <Map size={14} aria-hidden />
            {t("landing.badge")}
          </span>
          <h2 className="text-heading font-extrabold text-foreground mb-3">{t("landing.title")}</h2>
          <p className="text-body-lg">{t("landing.subtitle")}</p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mb-8">
          {featured.map((r) => (
            <RoadmapCard key={r.slug} roadmap={r} />
          ))}
        </div>

        <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-10">
          {popular.map((r) => (
            <Link
              key={r.slug}
              href={`/roadmaps/${r.slug}`}
              className={cn(
                card.base,
                "px-4 py-2.5 text-sm font-semibold text-foreground",
                "hover:border-brand/30 hover:shadow-md transition-all"
              )}
            >
              {r.shortTitle}
            </Link>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/roadmaps" className={cn(button.primary, "inline-flex items-center gap-2")}>
            <Sparkles size={18} />
            {t("landing.cta")}
            <ArrowRight size={18} />
          </Link>
          <p className="text-sm text-muted-foreground">
            {ROADMAP_DEFINITIONS.length}+ {t("landing.paths")}
          </p>
        </div>
      </div>
    </section>
  );
}
