"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Search, Download } from "lucide-react";
import { useTranslation } from "@/lib/i18n/provider";
import { UNIVERSITIES, getUniversity } from "@/lib/universities";
import {
  formatCurrency, formatRanking, formatTuitionRange, getQsDisplayRank,
} from "@/lib/universities/format";
import { exportComparisonPdf } from "@/lib/universities/pdf-export";
import type { University } from "@/lib/universities/types";
import { UniversityLogo } from "./university-logo";
import { card, animation, button } from "@/lib/design-system";
import { cn } from "@/lib/utils";

const MAX_COMPARE = 4;

export function UniversityCompareClient() {
  const { t } = useTranslation("universities");
  const searchParams = useSearchParams();
  const [selected, setSelected] = useState<string[]>([]);
  const [pickerQuery, setPickerQuery] = useState("");

  useEffect(() => {
    const slugs = searchParams.get("slugs")?.split(",").filter(Boolean) ?? [];
    if (slugs.length > 0) setSelected(slugs.slice(0, MAX_COMPARE));
  }, [searchParams]);

  const universities = useMemo(
    () => selected.map((s) => getUniversity(s)).filter(Boolean) as University[],
    [selected]
  );

  const pickerList = useMemo(() => {
    const q = pickerQuery.toLowerCase();
    return UNIVERSITIES.filter((u) =>
      !q || u.name.toLowerCase().includes(q) || u.shortName.toLowerCase().includes(q)
    );
  }, [pickerQuery]);

  const toggle = (slug: string) => {
    setSelected((prev) => {
      if (prev.includes(slug)) return prev.filter((s) => s !== slug);
      if (prev.length >= MAX_COMPARE) return prev;
      return [...prev, slug];
    });
  };

  const tuitionLabels = {
    unavailable: t("tuition.unavailable"),
    variesByDepartment: t("tuition.variesByDepartment"),
    startingFrom: t("tuition.startingFrom"),
    estimated: t("tuition.estimated"),
  };

  const rows = [
    { key: "type", label: t("detail.type"), get: (u: University) => t(`types.${u.type}`) },
    { key: "tuition", label: t("compare.tuition"), get: (u: University) => formatTuitionRange(u.tuition, tuitionLabels) },
    { key: "credits", label: t("compare.credits"), get: (u: University) => String(u.tuition.creditHours ?? u.programs[0]?.creditHours ?? "—") },
    { key: "departments", label: t("compare.departments"), get: (u: University) => String(u.departmentCount ?? "—") },
    { key: "programs", label: t("card.programs"), get: (u: University) => String(u.programs.length) },
    { key: "scholarships", label: t("compare.scholarships"), get: (u: University) => u.scholarships.length > 0 ? u.scholarships.join(", ") : (u.tuition.waiverPolicy ?? "—") },
    { key: "qs", label: t("rankings.qsWorld"), get: (u: University) => formatRanking(getQsDisplayRank(u.rankings), t("rankings.notRanked")) },
    { key: "national", label: t("rankings.national"), get: (u: University) => formatRanking(u.rankings.national, t("rankings.notRanked")) },
    { key: "webometrics", label: t("rankings.webometrics"), get: (u: University) => formatRanking(u.rankings.webometrics, t("rankings.notRanked")) },
    { key: "hostel", label: t("compare.hostel"), get: (u: University) => u.facilities.hostel ? t("compare.yes") : t("compare.no") },
    { key: "students", label: t("detail.students"), get: (u: University) => u.studentPopulation != null ? String(u.studentPopulation) : "—" },
    { key: "placement", label: t("compare.placement"), get: (u: University) => u.career.verified && u.career.employmentRate != null ? `${u.career.employmentRate}%` : "—" },
    { key: "salary", label: t("employability.avgSalary"), get: (u: University) => u.career.verified && u.career.avgStartingSalary != null ? formatCurrency(u.career.avgStartingSalary) : "—" },
    { key: "admission", label: t("compare.admission"), get: (u: University) => {
      const ssc = u.admission.sscGpaMin;
      const hsc = u.admission.hscGpaMin;
      if (ssc == null && hsc == null) return "—";
      return `SSC ${ssc ?? "—"} / HSC ${hsc ?? "—"}`;
    }},
    { key: "established", label: t("detail.established"), get: (u: University) => String(u.established) },
    { key: "location", label: t("detail.division"), get: (u: University) => `${u.city}, ${u.division}` },
    { key: "pros", label: t("detail.pros"), get: (u: University) => u.pros.length > 0 ? u.pros.slice(0, 2).join("; ") : "—" },
    { key: "cons", label: t("detail.cons"), get: (u: University) => u.cons.length > 0 ? u.cons.slice(0, 2).join("; ") : "—" },
  ];

  const tuitionValues = universities.map((u) => u.tuition.graduationCostMin ?? u.tuition.estimatedGraduationCost ?? 0);

  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <motion.div {...animation.fadeUp} className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground mb-2">{t("compare.title")}</h1>
          <p className="text-muted-foreground">{t("compare.subtitle")}</p>
          <p className="text-sm text-muted-foreground mt-2">{t("compare.max")}</p>
        </div>
        {universities.length > 0 && (
          <button type="button" onClick={() => exportComparisonPdf(universities)} className={cn(button.secondary, "inline-flex items-center gap-2 text-sm shrink-0")}>
            <Download size={14} /> {t("pdf.exportComparison")}
          </button>
        )}
      </motion.div>

      <div className="relative mb-4">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" aria-hidden />
        <input
          value={pickerQuery}
          onChange={(e) => setPickerQuery(e.target.value)}
          placeholder={t("landing.searchPlaceholder")}
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-background text-sm min-h-[44px]"
        />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 mb-8 max-h-56 overflow-y-auto">
        {pickerList.map((u) => (
          <button
            key={u.slug}
            type="button"
            onClick={() => toggle(u.slug)}
            className={cn(
              "flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium border transition-colors text-left min-h-[40px]",
              selected.includes(u.slug) ? "bg-brand/10 border-brand text-brand" : "border-border text-muted-foreground hover:bg-muted"
            )}
          >
            <UniversityLogo university={u} size="sm" />
            {u.shortName}
          </button>
        ))}
      </div>

      {universities.length > 0 && (
        <>
          {tuitionValues.some((v) => v > 0) && (
            <motion.div {...animation.fadeUp} className={cn(card.base, "p-6 mb-6")}>
              <h2 className="text-sm font-bold text-foreground mb-4">{t("compare.tuitionChart")}</h2>
              <div className="flex items-end gap-3 h-40">
                {universities.map((u, i) => {
                  const val = tuitionValues[i];
                  const max = Math.max(...tuitionValues.filter((v) => v > 0), 1);
                  const height = val > 0 ? (val / max) * 100 : 4;
                  return (
                    <div key={u.slug} className="flex-1 flex flex-col items-center gap-2">
                      <div
                        className="w-full rounded-t-lg bg-brand/80 min-h-[4px] transition-all"
                        style={{ height: `${height}%` }}
                        title={formatCurrency(val || null)}
                      />
                      <span className="text-[10px] text-muted-foreground text-center truncate w-full">{u.shortName}</span>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}

          <motion.div {...animation.fadeUp} className="overflow-x-auto">
            <table className={cn(card.base, "w-full min-w-[600px] !rounded-2xl")}>
              <thead>
                <tr className="border-b border-border">
                  <th className="p-4 text-left text-sm font-bold text-muted-foreground">Feature</th>
                  {universities.map((u) => (
                    <th key={u.slug} className="p-4 text-center text-sm font-bold text-foreground">
                      <UniversityLogo university={u} size="sm" className="mx-auto mb-2" />
                      {u.shortName}
                      <button type="button" onClick={() => toggle(u.slug)} className="block mx-auto mt-1 text-xs text-destructive">
                        {t("compare.remove")}
                      </button>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.key} className="border-b border-border last:border-0">
                    <td className="p-4 text-sm text-muted-foreground font-medium">{row.label}</td>
                    {universities.map((u) => (
                      <td key={u.slug} className="p-4 text-sm text-center text-foreground">
                        {row.get(u)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        </>
      )}
    </div>
  );
}
