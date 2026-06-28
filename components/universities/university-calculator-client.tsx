"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "@/lib/i18n/provider";
import { UNIVERSITIES } from "@/lib/universities";
import { card, button, animation } from "@/lib/design-system";
import { cn } from "@/lib/utils";

export function UniversityCalculatorClient() {
  const { t } = useTranslation("universities");
  const [slug, setSlug] = useState(UNIVERSITIES[0]?.slug ?? "");
  const [credits, setCredits] = useState(18);
  const [semesters, setSemesters] = useState(8);
  const [includeLiving, setIncludeLiving] = useState(true);
  const [hostel, setHostel] = useState(false);

  const university = UNIVERSITIES.find((u) => u.slug === slug);

  const result = useMemo(() => {
    if (!university) return null;
    const tuition = university.tuition;
    const academic =
      tuition.admissionFee +
      tuition.registrationFee +
      semesters * (tuition.semesterFee + credits * tuition.perCreditFee + tuition.labFee + tuition.developmentFee + tuition.libraryFee + tuition.examFee);
    const livingPerMonth = 15000;
    const hostelCost = hostel ? 6000 * semesters * 4 : 0;
    const transport = 3000 * semesters * 4;
    const food = 8000 * semesters * 4;
    const living = includeLiving ? livingPerMonth * semesters * 4 + hostelCost + transport + food : 0;
    return { academic, living, total: academic + living, monthly: Math.round((academic + living) / (semesters * 4)) };
  }, [university, credits, semesters, includeLiving, hostel]);

  return (
    <div className="max-w-[800px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <motion.div {...animation.fadeUp} className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground mb-2">{t("calculator.title")}</h1>
        <p className="text-muted-foreground">{t("calculator.subtitle")}</p>
      </motion.div>

      <motion.div {...animation.fadeUp} className={cn(card.base, "p-6 space-y-4")}>
        <div>
          <label className="text-sm font-medium text-foreground block mb-2">{t("calculator.selectUniversity")}</label>
          <select
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-border bg-background min-h-[44px]"
          >
            {UNIVERSITIES.map((u) => (
              <option key={u.slug} value={u.slug}>{u.name}</option>
            ))}
          </select>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium block mb-2">{t("calculator.creditsPerSemester")}</label>
            <input type="number" value={credits} onChange={(e) => setCredits(Number(e.target.value))} min={12} max={24} className="w-full px-4 py-3 rounded-xl border border-border bg-background min-h-[44px]" />
          </div>
          <div>
            <label className="text-sm font-medium block mb-2">{t("calculator.semesters")}</label>
            <input type="number" value={semesters} onChange={(e) => setSemesters(Number(e.target.value))} min={6} max={12} className="w-full px-4 py-3 rounded-xl border border-border bg-background min-h-[44px]" />
          </div>
        </div>

        <label className="flex items-center gap-2 text-sm cursor-pointer">
          <input type="checkbox" checked={includeLiving} onChange={(e) => setIncludeLiving(e.target.checked)} className="accent-brand" />
          {t("calculator.includeLiving")}
        </label>
        <label className="flex items-center gap-2 text-sm cursor-pointer">
          <input type="checkbox" checked={hostel} onChange={(e) => setHostel(e.target.checked)} className="accent-brand" />
          {t("calculator.hostelCost")}
        </label>

        {result && (
          <div className="pt-4 border-t border-border space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">{t("calculator.degreeCost")}</span>
              <span className="font-semibold">৳{result.academic.toLocaleString()}</span>
            </div>
            {includeLiving && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">{t("calculator.livingCost")}</span>
                <span className="font-semibold">৳{result.living.toLocaleString()}</span>
              </div>
            )}
            <div className="flex justify-between text-lg font-extrabold text-brand pt-2">
              <span>{t("calculator.result")}</span>
              <span>৳{result.total.toLocaleString()}</span>
            </div>
            <p className="text-sm text-muted-foreground">{t("calculator.monthlyCost")}: ৳{result.monthly.toLocaleString()}/mo</p>
          </div>
        )}
      </motion.div>
    </div>
  );
}
