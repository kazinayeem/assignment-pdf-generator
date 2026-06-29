import { CATEGORY_META } from "./constants";
import { CHANGELOG_RELEASES } from "./catalog";
import type { ChangeCategory, ChangelogFilters, ChangelogStats, Release } from "./types";

export function computeStats(releases: Release[] = CHANGELOG_RELEASES): ChangelogStats {
  let totalFeatures = 0;
  let bugFixes = 0;
  let performanceImprovements = 0;
  let commits = 0;
  let linesChanged = 0;
  let roadmapsAdded = 0;
  let devToolsAdded = 0;
  let universitiesAdded = 0;
  let interviewQuestionsAdded = 0;
  let learningTopicsAdded = 0;

  for (const release of releases) {
    for (const change of release.changes) {
      if (change.category === "feature") totalFeatures++;
      if (change.category === "bugfix") bugFixes++;
      if (change.category === "performance") performanceImprovements++;
    }
    commits += release.stats?.commits ?? 0;
    linesChanged += release.stats?.linesChanged ?? 0;
    roadmapsAdded += release.stats?.roadmapsAdded ?? 0;
    devToolsAdded += release.stats?.devToolsAdded ?? 0;
    universitiesAdded += release.stats?.universitiesAdded ?? 0;
    interviewQuestionsAdded += release.stats?.interviewQuestionsAdded ?? 0;
    learningTopicsAdded += release.stats?.learningTopicsAdded ?? 0;
  }

  return {
    totalReleases: releases.length,
    totalFeatures,
    bugFixes,
    performanceImprovements,
    contributors: 2,
    commits,
    linesChanged,
    roadmapsAdded,
    devToolsAdded,
    universitiesAdded,
    interviewQuestionsAdded,
    learningTopicsAdded,
  };
}

export function filterReleases(filters: ChangelogFilters, releases: Release[] = CHANGELOG_RELEASES): Release[] {
  const q = filters.query.trim().toLowerCase();

  return releases.filter((release) => {
    if (filters.version !== "all" && release.version !== filters.version) return false;
    if (filters.releaseType !== "all" && release.releaseType !== filters.releaseType) return false;
    if (filters.status !== "all" && release.status !== filters.status) return false;
    if (filters.year !== "all") {
      const year = new Date(release.date).getFullYear().toString();
      if (year !== filters.year) return false;
    }
    if (filters.month !== "all") {
      const month = (new Date(release.date).getMonth() + 1).toString().padStart(2, "0");
      if (month !== filters.month) return false;
    }
    if (filters.product !== "all" && !release.products.includes(filters.product)) return false;

    if (filters.category !== "all") {
      const hasCategory = release.changes.some((c) => c.category === filters.category);
      if (!hasCategory) return false;
    }

    if (!q) return true;

    const terms = q.split(/\s+/).filter(Boolean);
    const categoryLabels = release.changes.map((c) => CATEGORY_META[c.category].label.toLowerCase());
    const searchable = [
      release.version,
      release.title,
      release.overview,
      ...release.changes.map((c) => c.title),
      ...release.changes.map((c) => c.description ?? ""),
      ...categoryLabels,
      ...(release.breakingChanges ?? []),
      ...(release.knownIssues ?? []),
    ]
      .join(" ")
      .toLowerCase();

    return terms.every((term) => searchable.includes(term));
  });
}

export function groupChangesByCategory(release: Release) {
  const groups = new Map<ChangeCategory, typeof release.changes>();
  for (const change of release.changes) {
    const list = groups.get(change.category) ?? [];
    list.push(change);
    groups.set(change.category, list);
  }
  return groups;
}

export function getUniqueYears(releases: Release[] = CHANGELOG_RELEASES): string[] {
  const years = new Set(releases.map((r) => new Date(r.date).getFullYear().toString()));
  return Array.from(years).sort((a, b) => Number(b) - Number(a));
}

export function getUniqueVersions(releases: Release[] = CHANGELOG_RELEASES): string[] {
  return releases.map((r) => r.version);
}

export function formatReleaseDate(date: string, locale = "en"): string {
  return new Date(date).toLocaleDateString(locale === "bn" ? "bn-BD" : "en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
