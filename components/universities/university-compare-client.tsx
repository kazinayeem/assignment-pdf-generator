"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "@/lib/i18n/provider";
import { UNIVERSITIES, getUniversity } from "@/lib/universities";
import type { University } from "@/lib/universities/types";
import { card, animation } from "@/lib/design-system";
import { cn } from "@/lib/utils";

const MAX_COMPARE = 4;

export function UniversityCompareClient() {
  const { t } = useTranslation("universities");
  const [selected, setSelected] = useState<string[]>([]);

  const universities = useMemo(
    () => selected.map((s) => getUniversity(s)).filter(Boolean) as University[],
    [selected]
  );

  const toggle = (slug: string) => {
    setSelected((prev) => {
      if (prev.includes(slug)) return prev.filter((s) => s !== slug);
      if (prev.length >= MAX_COMPARE) return prev;
      return [...prev, slug];
    });
  };

  const rows = [
    { key: "tuition", label: t("compare.tuition"), get: (u: University) => `৳${u.tuition.estimatedGraduationCost.toLocaleString()}` },
    { key: "credits", label: t("compare.credits"), get: (u: University) => String(u.programs[0]?.creditHours ?? "—") },
    { key: "departments", label: t("compare.departments"), get: (u: University) => String(u.departmentCount) },
    { key: "hostel", label: t("compare.hostel"), get: (u: University) => u.facilities.hostel ? t("compare.yes") : t("compare.no") },
    { key: "ranking", label: t("compare.ranking"), get: (u: University) => u.rankings.national ? `#${u.rankings.national}` : "—" },
    { key: "admission", label: t("compare.admission"), get: (u: University) => `SSC ${u.admission.sscGpaMin} / HSC ${u.admission.hscGpaMin}` },
    { key: "placement", label: t("compare.placement"), get: (u: University) => `${u.career.employmentRate}%` },
    { key: "research", label: t("compare.research"), get: (u: University) => String(u.rankings.research ?? "—") },
  ];

  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <motion.div {...animation.fadeUp} className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground mb-2">{t("compare.title")}</h1>
        <p className="text-muted-foreground">{t("compare.subtitle")}</p>
        <p className="text-sm text-muted-foreground mt-2">{t("compare.max")}</p>
      </motion.div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 mb-8 max-h-48 overflow-y-auto">
        {UNIVERSITIES.slice(0, 40).map((u) => (
          <button
            key={u.slug}
            type="button"
            onClick={() => toggle(u.slug)}
            className={cn(
              "px-3 py-2 rounded-xl text-xs font-medium border transition-colors text-left min-h-[40px]",
              selected.includes(u.slug) ? "bg-brand/10 border-brand text-brand" : "border-border text-muted-foreground hover:bg-muted"
            )}
          >
            {u.shortName}
          </button>
        ))}
      </div>

      {universities.length > 0 && (
        <motion.div {...animation.fadeUp} className="overflow-x-auto">
          <table className={cn(card.base, "w-full min-w-[600px] !rounded-2xl")}>
            <thead>
              <tr className="border-b border-border">
                <th className="p-4 text-left text-sm font-bold text-muted-foreground">Feature</th>
                {universities.map((u) => (
                  <th key={u.slug} className="p-4 text-center text-sm font-bold text-foreground">
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
                  <td className="p-4 text-sm font-medium text-foreground">{row.label}</td>
                  {universities.map((u) => (
                    <td key={u.slug} className="p-4 text-center text-sm text-muted-foreground">
                      {row.get(u)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      )}
    </div>
  );
}
