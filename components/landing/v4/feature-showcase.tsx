"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useTranslation } from "@/lib/i18n/provider";
import { spacing, animation, card, button, typography, sectionBg, badge, iconBox } from "@/lib/design-system";
import { FEATURES, WHY_CHOOSE } from "@/lib/landing-data";
import { SectionHeader } from "./section-header";
import { cn } from "@/lib/utils";

const FEATURE_KEYS = ["assignment", "cv", "lab"] as const;
const WHY_KEYS = ["diu", "oneClick", "profiles", "ats", "workflow", "interactive", "mobile", "cloud"] as const;

export function FeatureShowcase() {
  const { t } = useTranslation("home");

  return (
    <section className={cn(spacing.section, sectionBg.elevated, "relative")}>
      <div className="blur-orb w-[350px] h-[350px] bg-brand-secondary/10 top-10 right-0" aria-hidden />
      <div className={cn(spacing.container, "relative")}>
        <SectionHeader
          badge={t("features.badge")}
          title={t("features.title")}
          subtitle={t("features.subtitle")}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-16">
          {FEATURES.map((feature, i) => {
            const key = FEATURE_KEYS[i];
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.href}
                {...animation.fadeUp}
                {...animation.stagger(i)}
              >
                <Link href={feature.href} className="block h-full">
                  <div className={cn(card.base, card.hover, card.interactive, card.equal, "p-6 sm:p-7")}>
                    <div className="flex items-start justify-between gap-3 mb-5">
                      <div
                        className={cn(
                          iconBox.lg,
                          "bg-gradient-to-br shadow-lg shadow-brand/15 group-hover:scale-105 transition-transform",
                          feature.color
                        )}
                      >
                        <Icon size={26} className="text-white" aria-hidden />
                      </div>
                      {feature.tag && (
                        <span className={badge[feature.tag]}>{feature.tag}</span>
                      )}
                    </div>
                    <h3 className={cn(typography.cardTitle, "text-foreground mb-2")}>
                      {t(`features.${key}.title`)}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed flex-1 mb-6">
                      {t(`features.${key}.desc`)}
                    </p>
                    <span className={cn(button.primary, "inline-flex items-center justify-center gap-2 w-full sm:w-auto text-sm")}>
                      {t(`features.${key}.cta`)} <ArrowRight size={16} aria-hidden />
                    </span>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {WHY_CHOOSE.map((item, i) => {
            const key = WHY_KEYS[i];
            const Icon = item.icon;
            return (
              <motion.div
                key={key}
                {...animation.fadeUp}
                {...animation.stagger(i)}
                whileHover={{ y: -4 }}
                className={cn(card.base, card.hover, "p-5 sm:p-6 group")}
              >
                <div
                  className={cn(
                    iconBox.md,
                    "bg-gradient-to-br shadow-md group-hover:scale-105 transition-transform mb-4",
                    item.color
                  )}
                >
                  <Icon size={20} className="text-white" aria-hidden />
                </div>
                <h3 className="text-sm font-bold text-foreground mb-1.5">
                  {t(`features.why.${key}.title`)}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {t(`features.why.${key}.desc`)}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
