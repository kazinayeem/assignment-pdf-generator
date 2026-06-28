"use client";

import { useTranslation } from "@/lib/i18n/provider";
import type { Division, SpecializationCategory, UniversityFilters, UniversityType } from "@/lib/universities/types";
import { cn } from "@/lib/utils";

type UniversityFiltersPanelProps = {
  filters: {
    type: UniversityType | "all";
    division: Division | "all";
    category: SpecializationCategory | "all";
    sort: UniversityFilters["sort"];
    hostel: boolean;
    scholarship: boolean;
    evening: boolean;
    online: boolean;
    admissionOpen: boolean;
    qsRanked: boolean;
    top10: boolean;
    budgetFriendly: boolean;
    highestRated: boolean;
  };
  onChange: (patch: Partial<UniversityFiltersPanelProps["filters"]>) => void;
  onClear: () => void;
};

type ChipDef = {
  key: keyof UniversityFiltersPanelProps["filters"];
  labelKey: string;
  value: boolean | string;
  toggle?: boolean;
};

const DIVISIONS: Division[] = ["Dhaka", "Chattogram", "Rajshahi", "Khulna", "Barishal", "Sylhet", "Rangpur", "Mymensingh"];

export function UniversityFiltersPanel({ filters, onChange, onClear }: UniversityFiltersPanelProps) {
  const { t } = useTranslation("universities");

  const chips: ChipDef[] = [
    { key: "type", labelKey: "types.public", value: "public", toggle: false },
    { key: "type", labelKey: "types.private", value: "private", toggle: false },
    { key: "category", labelKey: "filters.engineering", value: "engineering", toggle: false },
    { key: "category", labelKey: "filters.medical", value: "medical", toggle: false },
    { key: "category", labelKey: "filters.science", value: "science", toggle: false },
    { key: "category", labelKey: "filters.business", value: "business", toggle: false },
    ...DIVISIONS.map((d) => ({ key: "division" as const, labelKey: d, value: d, toggle: false })),
    { key: "admissionOpen", labelKey: "filters.admissionOpen", value: true, toggle: true },
    { key: "scholarship", labelKey: "filters.scholarship", value: true, toggle: true },
    { key: "hostel", labelKey: "filters.hostel", value: true, toggle: true },
    { key: "evening", labelKey: "filters.evening", value: true, toggle: true },
    { key: "online", labelKey: "filters.online", value: true, toggle: true },
    { key: "qsRanked", labelKey: "filters.qsRanked", value: true, toggle: true },
    { key: "top10", labelKey: "filters.top10", value: true, toggle: true },
    { key: "budgetFriendly", labelKey: "filters.budgetFriendly", value: true, toggle: true },
    { key: "highestRated", labelKey: "filters.highestRated", value: true, toggle: true },
  ];

  const isActive = (chip: ChipDef) => {
    if (chip.toggle) return filters[chip.key as keyof typeof filters] === true;
    return filters[chip.key as keyof typeof filters] === chip.value;
  };

  const handleChip = (chip: ChipDef) => {
    if (chip.toggle) {
      onChange({ [chip.key]: !filters[chip.key as keyof typeof filters] });
      return;
    }
    const current = filters[chip.key as keyof typeof filters];
    onChange({ [chip.key]: current === chip.value ? (chip.key === "type" || chip.key === "division" || chip.key === "category" ? "all" : false) : chip.value });
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {chips.map((chip) => (
          <button
            key={`${String(chip.key)}-${chip.labelKey}`}
            type="button"
            onClick={() => handleChip(chip)}
            className={cn(
              "px-3 py-1.5 rounded-full text-xs font-medium border transition-colors min-h-[32px]",
              isActive(chip)
                ? "bg-brand/10 border-brand text-brand"
                : "border-border text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            {chip.key === "type" || chip.key === "category"
              ? t(chip.labelKey)
              : chip.key === "division"
                ? chip.labelKey
                : t(chip.labelKey)}
          </button>
        ))}
        <button
          type="button"
          onClick={onClear}
          className="px-3 py-1.5 rounded-full text-xs text-muted-foreground hover:text-foreground min-h-[32px]"
        >
          {t("landing.filters.clear")}
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <label className="text-xs text-muted-foreground font-medium">{t("filters.sortBy")}</label>
        <select
          value={filters.sort ?? "name"}
          onChange={(e) => onChange({ sort: e.target.value as UniversityFilters["sort"] })}
          aria-label={t("filters.sortBy")}
          className="px-3 py-2 rounded-xl border border-border bg-background text-sm min-h-[40px]"
        >
          <option value="name">{t("filters.sortName")}</option>
          <option value="newest">{t("filters.sortNewest")}</option>
          <option value="oldest">{t("filters.sortOldest")}</option>
          <option value="tuition-asc">{t("filters.sortTuitionAsc")}</option>
          <option value="tuition-desc">{t("filters.sortTuitionDesc")}</option>
          <option value="qs-rank">{t("filters.sortQs")}</option>
        </select>
      </div>
    </div>
  );
}
