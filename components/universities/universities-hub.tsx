"use client";

import { useCallback, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Sparkles, GraduationCap, Building, Globe, ChevronLeft, ChevronRight, Award } from "lucide-react";
import { useTranslation } from "@/lib/i18n/provider";
import {
  UNIVERSITIES,
  filterUniversities,
  getUniversityStats,
  paginateUniversities,
} from "@/lib/universities";
import type { Division, SearchSuggestion, UniversityFilters, UniversityType, SpecializationCategory } from "@/lib/universities/types";
import { UniversityCard } from "./university-card";
import { UniversitySearch } from "./university-search";
import { UniversityFiltersPanel } from "./university-filters";
import { UniversityTopSections } from "./university-top-sections";
import { UniversityHubDashboard } from "./university-hub-dashboard";

const FEATURED_SLUGS = ["buet", "university-of-dhaka", "brac-university", "nsu", "diu", "uiu", "sust", "ruet"];
const MAX_COMPARE = 4;
export function UniversitiesHub() {
  const { t } = useTranslation("universities");
  const router = useRouter();
  const stats = getUniversityStats();

  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [compareSlugs, setCompareSlugs] = useState<string[]>([]);
  const [panel, setPanel] = useState({
    type: "all" as UniversityType | "all",
    division: "all" as Division | "all",
    category: "all" as SpecializationCategory | "all",
    sort: "name" as UniversityFilters["sort"],
    hostel: false,
    scholarship: false,
    evening: false,
    online: false,
    admissionOpen: false,
    qsRanked: false,
    top10: false,
    budgetFriendly: false,
    highestRated: false,
  });

  const filters: UniversityFilters = useMemo(
    () => ({
      query: query || undefined,
      type: panel.type !== "all" ? panel.type : undefined,
      division: panel.division !== "all" ? panel.division : undefined,
      category: panel.category !== "all" ? panel.category : undefined,
      sort: panel.sort,
      hostel: panel.hostel || undefined,
      scholarship: panel.scholarship || undefined,
      evening: panel.evening || undefined,
      online: panel.online || undefined,
      admissionOpen: panel.admissionOpen || undefined,
      qsRanked: panel.qsRanked || undefined,
      top10: panel.top10 || undefined,
      budgetFriendly: panel.budgetFriendly || undefined,
      highestRated: panel.highestRated || undefined,
    }),
    [query, panel]
  );

  const filtered = useMemo(() => filterUniversities(filters), [filters]);
  const pagination = useMemo(() => paginateUniversities(filtered, page), [filtered, page]);
  const featured = useMemo(
    () => FEATURED_SLUGS.map((s) => UNIVERSITIES.find((u) => u.slug === s)).filter(Boolean),
    []
  );

  const handleSearchChange = useCallback((value: string) => {
    setQuery(value);
    setPage(1);
  }, []);

  const handleSuggestion = useCallback((s: SearchSuggestion) => {
    if (s.slug && s.type === "university") {
      router.push(`/universities/${s.slug}`);
      return;
    }
    if (s.slug && s.type === "department" && s.deptSlug) {
      router.push(`/universities/${s.slug}/departments/${s.deptSlug}`);
      return;
    }
    if (s.slug && (s.type === "circular" || s.type === "program" || s.type === "department")) {
      router.push(`/universities/${s.slug}`);
      return;
    }
    if (s.slug) setQuery(s.sublabel ?? s.label);
    else setQuery(s.label);
    setPage(1);
  }, [router]);

  const handleFilterChange = useCallback((patch: Partial<typeof panel>) => {
    setPanel((p) => ({ ...p, ...patch }));
    setPage(1);
  }, []);

  const clearFilters = () => {
    setQuery("");
    setPage(1);
    setPanel({
      type: "all", division: "all", category: "all", sort: "name",
      hostel: false, scholarship: false, evening: false, online: false,
      admissionOpen: false, qsRanked: false, top10: false, budgetFriendly: false, highestRated: false,
    });
  };

  const toggleCompare = (slug: string) => {
    setCompareSlugs((prev) => {
      if (prev.includes(slug)) return prev.filter((s) => s !== slug);
      if (prev.length >= MAX_COMPARE) return prev;
      return [...prev, slug];
    });
  };

  const goToCompare = () => {
    if (compareSlugs.length === 0) return;
    router.push(`/universities/compare?slugs=${compareSlugs.join(",")}`);
  };

  return (
    <div className="min-h-full">
      <section className="relative overflow-hidden border-b border-border">
        <div className="blur-orb w-[500px] h-[500px] bg-brand/10 -top-40 left-0" aria-hidden />
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand/10 text-brand text-sm font-semibold mb-4 border border-brand/20">
              <Sparkles size={14} aria-hidden />
              {t("landing.badge")}
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-foreground tracking-tight mb-4">
              {t("landing.title")}
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground max-w-3xl leading-relaxed mb-8">
              {t("landing.subtitle")}
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-8">
              {[
                { label: t("landing.stats.total"), value: stats.total, icon: GraduationCap },
                { label: t("landing.stats.public"), value: stats.public, icon: Building },
                { label: t("landing.stats.private"), value: stats.private, icon: Building },
                { label: t("landing.stats.international"), value: stats.international, icon: Globe },
                { label: t("landing.stats.qsRanked"), value: stats.qsRanked, icon: Award },
              ].map((s) => (
                <div key={s.label} className="glass-card border border-border rounded-2xl p-4 text-center">
                  <s.icon size={20} className="text-brand mx-auto mb-2" aria-hidden />
                  <p className="text-2xl font-extrabold text-foreground">{s.value}</p>
                  <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-3">
              <Link href="/universities/compare" className="px-4 py-2.5 rounded-xl bg-brand text-brand-foreground text-sm font-semibold min-h-[44px] flex items-center">
                {t("nav.compare")}
              </Link>
              <Link href="/universities/predictor" className="px-4 py-2.5 rounded-xl border border-border text-sm font-semibold min-h-[44px] flex items-center hover:bg-muted transition-colors">
                {t("nav.predictor")}
              </Link>
              <Link href="/universities/calculator" className="px-4 py-2.5 rounded-xl border border-border text-sm font-semibold min-h-[44px] flex items-center hover:bg-muted transition-colors">
                {t("nav.calculator")}
              </Link>
              <Link href="/universities/scholarships" className="px-4 py-2.5 rounded-xl border border-border text-sm font-semibold min-h-[44px] flex items-center hover:bg-muted transition-colors">
                {t("nav.scholarships")}
              </Link>
              <Link href="/universities/recommend" className="px-4 py-2.5 rounded-xl border border-border text-sm font-semibold min-h-[44px] flex items-center hover:bg-muted transition-colors">
                {t("nav.recommend")}
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <UniversityTopSections />
      <UniversityHubDashboard />

      <section className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h2 className="text-lg font-bold text-foreground mb-4">{t("landing.featured")}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {featured.map((u) => u && <UniversityCard key={u.slug} university={u} showCompare={false} />)}
        </div>
      </section>

      <section className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="glass-card border border-border rounded-2xl p-4 sm:p-6 mb-6 space-y-4">
          <UniversitySearch value={query} onChange={handleSearchChange} onSelect={handleSuggestion} />
          <UniversityFiltersPanel filters={panel} onChange={handleFilterChange} onClear={clearFilters} />
        </div>

        {compareSlugs.length > 0 && (
          <div className="flex items-center justify-between mb-4 p-3 rounded-xl bg-brand/10 border border-brand/20">
            <span className="text-sm text-foreground">
              {compareSlugs.length} {t("compare.selected")}
            </span>
            <button
              type="button"
              onClick={goToCompare}
              className="px-4 py-2 rounded-xl bg-brand text-brand-foreground text-sm font-semibold min-h-[40px]"
            >
              {t("compare.viewComparison")}
            </button>
          </div>
        )}

        <p className="text-sm text-muted-foreground mb-4">
          {pagination.total} {t("landing.results")}
          {pagination.totalPages > 1 && ` · ${t("pagination.page")} ${pagination.page}/${pagination.totalPages}`}
        </p>

        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <GraduationCap size={48} className="mx-auto text-muted-foreground/30 mb-4" aria-hidden />
            <p className="text-muted-foreground mb-4">{t("landing.empty")}</p>
            <button type="button" onClick={clearFilters} className="text-sm text-brand font-semibold hover:underline">
              {t("landing.filters.clear")}
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {pagination.items.map((u) => (
                <UniversityCard
                  key={u.slug}
                  university={u}
                  onCompare={toggleCompare}
                  compareSelected={compareSlugs.includes(u.slug)}
                />
              ))}
            </div>

            {pagination.totalPages > 1 && (
              <div className="flex items-center justify-center gap-3 mt-8">
                <button
                  type="button"
                  disabled={pagination.page <= 1}
                  onClick={() => setPage((p) => p - 1)}
                  className="flex items-center gap-1 px-4 py-2 rounded-xl border border-border text-sm font-medium disabled:opacity-40 min-h-[44px]"
                >
                  <ChevronLeft size={16} /> {t("pagination.prev")}
                </button>
                <span className="text-sm text-muted-foreground">
                  {pagination.page} / {pagination.totalPages}
                </span>
                <button
                  type="button"
                  disabled={pagination.page >= pagination.totalPages}
                  onClick={() => setPage((p) => p + 1)}
                  className="flex items-center gap-1 px-4 py-2 rounded-xl border border-border text-sm font-medium disabled:opacity-40 min-h-[44px]"
                >
                  {t("pagination.next")} <ChevronRight size={16} />
                </button>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
}
