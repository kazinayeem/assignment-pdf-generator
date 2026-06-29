"use client";

import { Github, Globe, GraduationCap, FolderGit2, Users } from "lucide-react";
import { COMMUNITY_STATS, GITHUB_REPO } from "@/lib/about/constants";
import { useTranslation } from "@/lib/i18n/provider";
import { AnimatedCounter, SectionLabel, SectionReveal } from "./about-motion";
import { cn } from "@/lib/utils";

const COMMUNITY_ICONS = [Users, GraduationCap, FolderGit2, Github, Globe] as const;

export function AboutCommunity() {
  const { t } = useTranslation("about");

  return (
    <section className="py-24 sm:py-32">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionReveal className="text-center mb-16">
          <SectionLabel>{t("community.label")}</SectionLabel>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight mb-4">{t("community.title")}</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">{t("community.subtitle")}</p>
        </SectionReveal>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-12">
          {COMMUNITY_STATS.map((stat, i) => {
            const Icon = COMMUNITY_ICONS[i] ?? Users;
            return (
              <SectionReveal key={stat.key} delay={i * 0.06}>
                <div className="text-center p-6 rounded-2xl border border-border/60 bg-card/40 backdrop-blur hover:border-brand/25 transition-colors">
                  <Icon className="w-6 h-6 text-brand mx-auto mb-3" aria-hidden />
                  <p className="text-2xl font-extrabold text-foreground tabular-nums">
                    <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">{t(`community.stats.${stat.key}`)}</p>
                </div>
              </SectionReveal>
            );
          })}
        </div>

        <SectionReveal>
          <div className="rounded-2xl border border-border bg-gradient-to-br from-brand/5 to-transparent p-8 text-center">
            <p className="text-sm text-muted-foreground mb-4">{t("community.openSource")}</p>
            <a
              href={GITHUB_REPO}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "inline-flex items-center gap-2 px-6 py-3 rounded-full",
                "bg-foreground text-background font-semibold text-sm hover:opacity-90 transition-opacity"
              )}
            >
              <Github size={18} aria-hidden />
              {t("community.viewGithub")}
            </a>
          </div>
        </SectionReveal>
      </div>
    </section>
  );
}
