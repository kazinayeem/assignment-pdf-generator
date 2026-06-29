"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, History } from "lucide-react";
import { useTranslation } from "@/lib/i18n/provider";
import { computeStats, filterReleases } from "@/lib/changelog/utils";
import type { ChangelogFilters } from "@/lib/changelog/types";
import { ChangelogHero } from "./changelog-hero";
import { ChangelogStatsBar } from "./changelog-stats";
import { ChangelogSidebar } from "./changelog-sidebar";
import { ReleaseCard } from "./release-card";
import { UpcomingSection } from "./upcoming-section";
import { SubscribePanel } from "./subscribe-panel";
import { ChangelogContributors } from "./changelog-contributors";
import { ChangelogSkeleton } from "./changelog-motion";
import { LanguageSwitcher } from "@/components/landing/language-switcher";
import { ThemeToggle } from "@/components/landing/theme-toggle";

const DEFAULT_FILTERS: ChangelogFilters = {
  query: "",
  version: "all",
  category: "all",
  releaseType: "all",
  product: "all",
  year: "all",
  month: "all",
  status: "all",
};

export function ChangelogPage() {
  const { t, locale } = useTranslation("changelog");
  const [filters, setFilters] = useState<ChangelogFilters>(DEFAULT_FILTERS);
  const [subscribeOpen, setSubscribeOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showArchive, setShowArchive] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 400);
    return () => clearTimeout(timer);
  }, []);

  const stats = useMemo(() => computeStats(), []);

  const filtered = useMemo(() => {
    let results = filterReleases(filters);
    if (!showArchive) {
      results = results.filter((r) => !r.archived);
    }
    return results;
  }, [filters, showArchive]);

  const patchFilters = (patch: Partial<ChangelogFilters>) => {
    setFilters((prev) => ({ ...prev, ...patch }));
  };

  return (
    <div className="min-h-screen bg-surface-page">
      <header className="sticky top-0 z-50 bg-card/80 backdrop-blur-xl border-b border-border">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-brand transition-colors min-h-[44px]">
            <ArrowLeft size={16} aria-hidden />
            {t("back")}
          </Link>
          <div className="flex items-center gap-2">
            <LanguageSwitcher />
            <ThemeToggle />
          </div>
        </div>
      </header>

      <ChangelogHero
        query={filters.query}
        onQueryChange={(query) => patchFilters({ query })}
        onSubscribe={() => setSubscribeOpen(true)}
        locale={locale}
      />

      <ChangelogStatsBar stats={stats} />

      <main className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid lg:grid-cols-[260px_1fr] gap-8 lg:gap-12">
          <ChangelogSidebar filters={filters} onChange={patchFilters} resultCount={filtered.length} />

          <div className="space-y-8 min-w-0">
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-xl font-bold text-foreground">{t("timeline.title")}</h2>
              <button
                type="button"
                onClick={() => setShowArchive(!showArchive)}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand hover:underline"
              >
                <History size={14} aria-hidden />
                {showArchive ? t("archive.hide") : t("archive.show")}
              </button>
            </div>

            {loading ? (
              <ChangelogSkeleton />
            ) : filtered.length === 0 ? (
              <div className="rounded-2xl border border-border bg-card p-12 text-center">
                <p className="text-muted-foreground">{t("timeline.empty")}</p>
              </div>
            ) : (
              <div className="space-y-6 lg:pl-8">
                {filtered.map((release, i) => (
                  <ReleaseCard key={release.id} release={release} locale={locale} index={i} />
                ))}
              </div>
            )}

            <UpcomingSection />
            <ChangelogContributors />
          </div>
        </div>
      </main>

      <SubscribePanel open={subscribeOpen} onClose={() => setSubscribeOpen(false)} />
    </div>
  );
}
