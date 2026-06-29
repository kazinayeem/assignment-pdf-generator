"use client";

import { useTranslation } from "@/lib/i18n/provider";
import type { ChangelogFilters } from "@/lib/changelog/types";
import { CATEGORY_META, PRODUCT_META, RELEASE_TYPE_STYLES } from "@/lib/changelog/constants";
import { getUniqueVersions, getUniqueYears } from "@/lib/changelog/utils";
import { CHANGELOG_RELEASES } from "@/lib/changelog/catalog";
import { cn } from "@/lib/utils";

type ChangelogSidebarProps = {
  filters: ChangelogFilters;
  onChange: (patch: Partial<ChangelogFilters>) => void;
  resultCount: number;
};

const MONTHS = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"];

export function ChangelogSidebar({ filters, onChange, resultCount }: ChangelogSidebarProps) {
  const { t } = useTranslation("changelog");
  const versions = getUniqueVersions();
  const years = getUniqueYears();

  const selectClass = cn(
    "w-full h-9 px-3 rounded-lg border border-border bg-card text-sm text-foreground",
    "focus:outline-none focus:ring-2 focus:ring-brand/30"
  );

  return (
    <aside className="lg:sticky lg:top-24 space-y-6 self-start">
      <div className="rounded-2xl border border-border bg-card/80 backdrop-blur p-5">
        <h3 className="text-sm font-bold text-foreground mb-4">{t("filters.title")}</h3>
        <p className="text-xs text-muted-foreground mb-4">
          {resultCount} {t("filters.results")}
        </p>

        <div className="space-y-4">
          <label className="block">
            <span className="text-xs font-medium text-muted-foreground mb-1.5 block">{t("filters.version")}</span>
            <select value={filters.version} onChange={(e) => onChange({ version: e.target.value })} className={selectClass}>
              <option value="all">{t("filters.all")}</option>
              {versions.map((v) => (
                <option key={v} value={v}>{v}</option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="text-xs font-medium text-muted-foreground mb-1.5 block">{t("filters.category")}</span>
            <select value={filters.category} onChange={(e) => onChange({ category: e.target.value as ChangelogFilters["category"] })} className={selectClass}>
              <option value="all">{t("filters.all")}</option>
              {Object.entries(CATEGORY_META).map(([key, meta]) => (
                <option key={key} value={key}>{meta.emoji} {meta.label}</option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="text-xs font-medium text-muted-foreground mb-1.5 block">{t("filters.releaseType")}</span>
            <select value={filters.releaseType} onChange={(e) => onChange({ releaseType: e.target.value as ChangelogFilters["releaseType"] })} className={selectClass}>
              <option value="all">{t("filters.all")}</option>
              {(["stable", "beta", "alpha", "hotfix", "major", "minor", "patch"] as const).map((type) => (
                <option key={type} value={type}>{t(`releaseTypes.${type}`)}</option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="text-xs font-medium text-muted-foreground mb-1.5 block">{t("filters.product")}</span>
            <select value={filters.product} onChange={(e) => onChange({ product: e.target.value as ChangelogFilters["product"] })} className={selectClass}>
              <option value="all">{t("filters.all")}</option>
              {Object.entries(PRODUCT_META).map(([key, meta]) => (
                <option key={key} value={key}>{meta.emoji} {meta.label}</option>
              ))}
            </select>
          </label>

          <div className="grid grid-cols-2 gap-2">
            <label className="block">
              <span className="text-xs font-medium text-muted-foreground mb-1.5 block">{t("filters.year")}</span>
              <select value={filters.year} onChange={(e) => onChange({ year: e.target.value })} className={selectClass}>
                <option value="all">{t("filters.all")}</option>
                {years.map((y) => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="text-xs font-medium text-muted-foreground mb-1.5 block">{t("filters.month")}</span>
              <select value={filters.month} onChange={(e) => onChange({ month: e.target.value })} className={selectClass}>
                <option value="all">{t("filters.all")}</option>
                {MONTHS.map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </label>
          </div>
        </div>

        <button
          type="button"
          onClick={() =>
            onChange({
              query: "",
              version: "all",
              category: "all",
              releaseType: "all",
              product: "all",
              year: "all",
              month: "all",
              status: "all",
            })
          }
          className="mt-4 w-full h-9 text-xs font-semibold text-brand hover:underline"
        >
          {t("filters.reset")}
        </button>
      </div>

      <div className="rounded-2xl border border-border bg-card/80 backdrop-blur p-5">
        <h3 className="text-sm font-bold text-foreground mb-3">{t("versionHistory.title")}</h3>
        <nav className="space-y-1 max-h-64 overflow-y-auto" aria-label={t("versionHistory.title")}>
          {CHANGELOG_RELEASES.map((r) => (
            <a
              key={r.id}
              href={`#release-${r.id}`}
              className="flex items-center justify-between gap-2 px-2 py-2 rounded-lg text-sm hover:bg-muted transition-colors group"
            >
              <span className="font-semibold text-foreground group-hover:text-brand">{r.version}</span>
              <span className="text-xs text-muted-foreground truncate">{r.title}</span>
            </a>
          ))}
        </nav>
      </div>

      <div className="hidden lg:flex flex-wrap gap-1.5">
        {Object.entries(RELEASE_TYPE_STYLES).slice(0, 4).map(([type]) => (
          <span key={type} className={cn("text-[10px] px-2 py-0.5 rounded-full border font-medium", RELEASE_TYPE_STYLES[type])}>
            {t(`releaseTypes.${type}`)}
          </span>
        ))}
      </div>
    </aside>
  );
}
