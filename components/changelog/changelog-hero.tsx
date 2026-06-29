"use client";

import Link from "next/link";
import { Rss, Bell, Search, Rocket } from "lucide-react";
import { useTranslation } from "@/lib/i18n/provider";
import { CURRENT_VERSION } from "@/lib/changelog/catalog";
import { formatReleaseDate } from "@/lib/changelog/utils";
import { CHANGELOG_RELEASES } from "@/lib/changelog/catalog";
import { cn } from "@/lib/utils";

type ChangelogHeroProps = {
  query: string;
  onQueryChange: (q: string) => void;
  onSubscribe: () => void;
  locale: string;
};

export function ChangelogHero({ query, onQueryChange, onSubscribe, locale }: ChangelogHeroProps) {
  const { t } = useTranslation("changelog");

  return (
    <section className="relative overflow-hidden border-b border-border bg-gradient-to-b from-brand/5 via-background to-background">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-brand/10 via-transparent to-transparent pointer-events-none" />
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 relative">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand/10 text-brand text-sm font-semibold mb-4 border border-brand/20">
            <Rocket size={14} aria-hidden />
            {t("hero.badge")}
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-foreground tracking-tight mb-4">
            {t("hero.title")}
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed mb-8">{t("hero.subtitle")}</p>

          <div className="flex flex-wrap gap-3 mb-8">
            <div className="px-4 py-2.5 rounded-xl bg-card border border-border text-sm">
              <span className="text-muted-foreground">{t("hero.currentVersion")}: </span>
              <span className="font-bold text-foreground">{CURRENT_VERSION.version}</span>
            </div>
            <div className="px-4 py-2.5 rounded-xl bg-card border border-border text-sm">
              <span className="text-muted-foreground">{t("hero.latestRelease")}: </span>
              <span className="font-medium text-foreground">{formatReleaseDate(CURRENT_VERSION.date, locale)}</span>
            </div>
            <div className="px-4 py-2.5 rounded-xl bg-card border border-border text-sm">
              <span className="text-muted-foreground">{t("hero.totalReleases")}: </span>
              <span className="font-bold text-foreground">{CHANGELOG_RELEASES.length}</span>
            </div>
            <div className="px-4 py-2.5 rounded-xl bg-success/10 border border-success/20 text-sm">
              <span className="font-semibold text-success">{t("hero.statusStable")}</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" aria-hidden />
              <input
                type="search"
                value={query}
                onChange={(e) => onQueryChange(e.target.value)}
                placeholder={t("hero.searchPlaceholder")}
                aria-label={t("hero.searchPlaceholder")}
                className={cn(
                  "w-full h-11 pl-10 pr-4 rounded-xl border border-border bg-card/80 backdrop-blur",
                  "text-sm text-foreground placeholder:text-muted-foreground",
                  "focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand/40"
                )}
              />
            </div>
            <button
              type="button"
              onClick={onSubscribe}
              className="inline-flex items-center justify-center gap-2 h-11 px-5 rounded-xl bg-brand text-brand-foreground text-sm font-semibold hover:bg-brand/90 transition-colors"
            >
              <Bell size={16} aria-hidden />
              {t("hero.subscribe")}
            </button>
            <Link
              href="/api/changelog/rss"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 h-11 px-5 rounded-xl border border-border bg-card text-sm font-semibold text-foreground hover:bg-muted transition-colors"
            >
              <Rss size={16} aria-hidden />
              RSS
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
