"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Search, Sparkles, GraduationCap, Building, Globe } from "lucide-react";
import { useTranslation } from "@/lib/i18n/provider";
import {
  UNIVERSITIES,
  filterUniversities,
  getUniversityStats,
  getDivisions,
  getDepartments,
} from "@/lib/universities";
import type { Division, UniversityFilters, UniversityType } from "@/lib/universities/types";
import { UniversityCard } from "./university-card";
import { cn } from "@/lib/utils";

const FEATURED_SLUGS = ["buet", "university-of-dhaka", "brac-university", "nsu", "diu", "uiu", "sust", "ruet"];

export function UniversitiesHub() {
  const { t } = useTranslation("universities");
  const stats = getUniversityStats();
  const divisions = getDivisions();
  const departments = getDepartments();

  const [query, setQuery] = useState("");
  const [type, setType] = useState<UniversityType | "all">("all");
  const [division, setDivision] = useState<Division | "all">("all");
  const [department, setDepartment] = useState("");
  const [maxBudget, setMaxBudget] = useState("");
  const [hostel, setHostel] = useState(false);
  const [scholarship, setScholarship] = useState(false);

  const filters: UniversityFilters = useMemo(
    () => ({
      query: query || undefined,
      type: type !== "all" ? type : undefined,
      division: division !== "all" ? division : undefined,
      department: department || undefined,
      maxBudget: maxBudget ? Number(maxBudget) : undefined,
      hostel: hostel || undefined,
      scholarship: scholarship || undefined,
    }),
    [query, type, division, department, maxBudget, hostel, scholarship]
  );

  const filtered = useMemo(() => filterUniversities(filters), [filters]);
  const featured = useMemo(
    () => FEATURED_SLUGS.map((s) => UNIVERSITIES.find((u) => u.slug === s)).filter(Boolean),
    []
  );

  const clearFilters = () => {
    setQuery("");
    setType("all");
    setDivision("all");
    setDepartment("");
    setMaxBudget("");
    setHostel(false);
    setScholarship(false);
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

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
              {[
                { label: t("landing.stats.total"), value: stats.total, icon: GraduationCap },
                { label: t("landing.stats.public"), value: stats.public, icon: Building },
                { label: t("landing.stats.private"), value: stats.private, icon: Building },
                { label: t("landing.stats.international"), value: stats.international, icon: Globe },
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
              <Link href="/universities/calculator" className="px-4 py-2.5 rounded-xl border border-border text-sm font-semibold min-h-[44px] flex items-center hover:bg-muted transition-colors">
                {t("nav.calculator")}
              </Link>
              <Link href="/universities/recommend" className="px-4 py-2.5 rounded-xl border border-border text-sm font-semibold min-h-[44px] flex items-center hover:bg-muted transition-colors">
                {t("nav.recommend")}
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured */}
      <section className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h2 className="text-lg font-bold text-foreground mb-4">{t("landing.featured")}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {featured.map((u) => u && <UniversityCard key={u.slug} university={u} />)}
        </div>
      </section>

      {/* Search & Filters */}
      <section className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="glass-card border border-border rounded-2xl p-4 sm:p-6 mb-6">
          <div className="relative mb-4">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" aria-hidden />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t("landing.searchPlaceholder")}
              aria-label={t("landing.searchPlaceholder")}
              className="w-full pl-12 pr-4 py-3 rounded-xl bg-background border border-border text-foreground placeholder:text-muted-foreground outline-none focus:border-brand/50 focus:ring-2 focus:ring-brand/20 min-h-[44px]"
            />
          </div>

          <div className="flex flex-wrap gap-3">
            <select
              value={type}
              onChange={(e) => setType(e.target.value as UniversityType | "all")}
              aria-label={t("landing.filters.type")}
              className="px-3 py-2 rounded-xl border border-border bg-background text-sm min-h-[44px]"
            >
              <option value="all">{t("landing.filters.all")} {t("landing.filters.type")}</option>
              <option value="public">{t("types.public")}</option>
              <option value="private">{t("types.private")}</option>
              <option value="international">{t("types.international")}</option>
            </select>

            <select
              value={division}
              onChange={(e) => setDivision(e.target.value as Division | "all")}
              aria-label={t("landing.filters.division")}
              className="px-3 py-2 rounded-xl border border-border bg-background text-sm min-h-[44px]"
            >
              <option value="all">{t("landing.filters.all")} {t("landing.filters.division")}</option>
              {divisions.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>

            <select
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              aria-label={t("landing.filters.department")}
              className="px-3 py-2 rounded-xl border border-border bg-background text-sm min-h-[44px]"
            >
              <option value="">{t("landing.filters.all")} {t("landing.filters.department")}</option>
              {departments.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>

            <input
              type="number"
              value={maxBudget}
              onChange={(e) => setMaxBudget(e.target.value)}
              placeholder={t("landing.filters.budget")}
              aria-label={t("landing.filters.budget")}
              className="px-3 py-2 rounded-xl border border-border bg-background text-sm min-h-[44px] w-40"
            />

            <label className="flex items-center gap-2 text-sm px-3 py-2 rounded-xl border border-border cursor-pointer min-h-[44px]">
              <input type="checkbox" checked={hostel} onChange={(e) => setHostel(e.target.checked)} className="accent-brand" />
              {t("landing.filters.hostel")}
            </label>

            <label className="flex items-center gap-2 text-sm px-3 py-2 rounded-xl border border-border cursor-pointer min-h-[44px]">
              <input type="checkbox" checked={scholarship} onChange={(e) => setScholarship(e.target.checked)} className="accent-brand" />
              {t("landing.filters.scholarship")}
            </label>

            <button
              type="button"
              onClick={clearFilters}
              className="px-3 py-2 rounded-xl text-sm text-muted-foreground hover:text-foreground min-h-[44px]"
            >
              {t("landing.filters.clear")}
            </button>
          </div>
        </div>

        <p className="text-sm text-muted-foreground mb-4">
          {filtered.length} {t("landing.stats.total").toLowerCase()}
        </p>

        {filtered.length === 0 ? (
          <p className="text-center py-16 text-muted-foreground">{t("landing.empty")}</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filtered.map((u) => (
              <UniversityCard key={u.slug} university={u} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
