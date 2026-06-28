"use client";

import { motion } from "framer-motion";
import { GitFork, GitPullRequest, Star, Shield, ExternalLink } from "lucide-react";
import { useTranslation } from "@/lib/i18n/provider";
import { spacing, animation, card, button, badge } from "@/lib/design-system";
import { SectionHeader } from "../v4/section-header";
import { cn } from "@/lib/utils";

const REPO = "https://github.com/kazinayeem/assignment-pdf-generator";

const STATS = [
  { key: "stars", value: "50+", icon: Star },
  { key: "forks", value: "12+", icon: GitFork },
  { key: "contributors", value: "5+", icon: GitPullRequest },
] as const;

export function GitHubSection() {
  const { t } = useTranslation("v5");

  return (
    <section className={cn(spacing.section, "relative bg-background border-y border-border")}>
      <div className={cn(spacing.container, "relative")}>
        <SectionHeader
          badge={t("github.badge")}
          title={t("github.title")}
          subtitle={t("github.subtitle")}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
          <motion.div {...animation.fadeUp} className="grid grid-cols-3 gap-4">
            {STATS.map((stat) => {
              const Icon = stat.icon;
              return (
                <div key={stat.key} className={cn(card.base, "p-5 text-center")}>
                  <Icon size={20} className="text-brand mx-auto mb-2" aria-hidden />
                  <p className="text-2xl font-extrabold text-foreground">{stat.value}</p>
                  <p className="text-xs text-muted-foreground mt-1">{t(`github.${stat.key}`)}</p>
                </div>
              );
            })}
          </motion.div>

          <motion.div {...animation.fadeUp} className={cn(card.base, "p-6 sm:p-8")}>
            <div className="flex flex-wrap gap-2 mb-5">
              <span className={badge.brand}>
                <Shield size={12} aria-hidden />
                {t("github.badge2")}
              </span>
              <span className={badge.muted}>{t("github.license")}</span>
            </div>
            <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
              MIT licensed · Open for contributions · Built with Next.js & TypeScript
            </p>
            <div className="flex flex-wrap gap-3">
              <a href={REPO} target="_blank" rel="noopener noreferrer" className={cn(button.primary, "inline-flex items-center gap-2")}>
                {t("github.repo")} <ExternalLink size={14} aria-hidden />
              </a>
              <a href={`${REPO}/blob/main/CONTRIBUTING.md`} target="_blank" rel="noopener noreferrer" className={cn(button.secondary, "inline-flex items-center gap-2")}>
                {t("github.contribute")}
              </a>
              <a href={`${REPO}/sponsor`} target="_blank" rel="noopener noreferrer" className={cn(button.ghost, "inline-flex items-center gap-2")}>
                {t("github.sponsor")}
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
