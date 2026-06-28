"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Download } from "lucide-react";
import { useTranslation } from "@/lib/i18n/provider";
import { UNIVERSITIES } from "@/lib/universities";
import { calculateTuition } from "@/lib/universities/calculator";
import { exportTuitionPdf } from "@/lib/universities/pdf-export";
import { card, animation, button } from "@/lib/design-system";
import { cn } from "@/lib/utils";

export function UniversityCalculatorClient() {
  const { t } = useTranslation("universities");
  const verifiedUnis = UNIVERSITIES.filter((u) => u.tuition.verified);
  const [slug, setSlug] = useState(verifiedUnis[0]?.slug ?? UNIVERSITIES[0]?.slug ?? "");
  const [credits, setCredits] = useState(18);
  const [semesters, setSemesters] = useState(8);
  const [creditsCompleted, setCreditsCompleted] = useState(0);
  const [scholarshipPercent, setScholarshipPercent] = useState(0);
  const [waiverPercent, setWaiverPercent] = useState(0);
  const [includeLiving, setIncludeLiving] = useState(true);
  const [includeHostel, setIncludeHostel] = useState(false);
  const [includeTransport, setIncludeTransport] = useState(true);
  const [includeFood, setIncludeFood] = useState(true);

  const university = UNIVERSITIES.find((u) => u.slug === slug);

  const result = useMemo(() => {
    if (!university) return null;
    return calculateTuition(university, {
      slug,
      creditsPerSemester: credits,
      semesters,
      creditsCompleted,
      scholarshipPercent,
      waiverPercent,
      includeLiving,
      includeHostel,
      includeTransport,
      includeFood,
    });
  }, [university, slug, credits, semesters, creditsCompleted, scholarshipPercent, waiverPercent, includeLiving, includeHostel, includeTransport, includeFood]);

  const rows = result ? [
    [t("tuition.admissionFee"), result.admissionFee],
    [t("tuition.registrationFee"), result.registrationFee],
    [t("calculator.perCreditTotal"), result.perCreditTotal],
    [t("calculator.semesterFees"), result.semesterFees],
    [t("calculator.scholarshipDiscount"), -result.scholarshipDiscount],
    [t("calculator.waiverDiscount"), -result.waiverDiscount],
    [t("calculator.academicTotal"), result.academicTotal],
    [t("calculator.livingCost"), result.livingCost],
    [t("calculator.hostelLine"), result.hostelCost],
    [t("calculator.transportCost"), result.transportCost],
    [t("calculator.foodCost"), result.foodCost],
    [t("calculator.grandTotal"), result.grandTotal],
    [t("calculator.monthlyInstallment"), result.monthlyInstallment],
  ] : [];

  return (
    <div className="max-w-[800px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <motion.div {...animation.fadeUp} className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground mb-2">{t("calculator.title")}</h1>
        <p className="text-muted-foreground">{t("calculator.subtitle")}</p>
      </motion.div>

      <motion.div {...animation.fadeUp} className={cn(card.base, "p-6 space-y-4")}>
        <div>
          <label className="text-sm font-medium block mb-2">{t("calculator.selectUniversity")}</label>
          <select value={slug} onChange={(e) => setSlug(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-border bg-background min-h-[44px]">
            {UNIVERSITIES.map((u) => (
              <option key={u.slug} value={u.slug}>{u.name}{!u.tuition.verified ? ` (${t("tuition.unverified")})` : ""}</option>
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
          <div>
            <label className="text-sm font-medium block mb-2">{t("calculator.creditsCompleted")}</label>
            <input type="number" value={creditsCompleted} onChange={(e) => setCreditsCompleted(Number(e.target.value))} min={0} className="w-full px-4 py-3 rounded-xl border border-border bg-background min-h-[44px]" />
          </div>
          <div>
            <label className="text-sm font-medium block mb-2">{t("calculator.scholarshipPercent")}</label>
            <input type="number" value={scholarshipPercent} onChange={(e) => setScholarshipPercent(Number(e.target.value))} min={0} max={100} className="w-full px-4 py-3 rounded-xl border border-border bg-background min-h-[44px]" />
          </div>
          <div>
            <label className="text-sm font-medium block mb-2">{t("calculator.waiverPercent")}</label>
            <input type="number" value={waiverPercent} onChange={(e) => setWaiverPercent(Number(e.target.value))} min={0} max={100} className="w-full px-4 py-3 rounded-xl border border-border bg-background min-h-[44px]" />
          </div>
        </div>

        {[
          [includeLiving, setIncludeLiving, t("calculator.includeLiving")],
          [includeHostel, setIncludeHostel, t("calculator.hostelCost")],
          [includeTransport, setIncludeTransport, t("calculator.transportCost")],
          [includeFood, setIncludeFood, t("calculator.foodCost")],
        ].map(([checked, setter, label]) => (
          <label key={String(label)} className="flex items-center gap-2 text-sm cursor-pointer">
            <input type="checkbox" checked={checked as boolean} onChange={(e) => (setter as (v: boolean) => void)(e.target.checked)} className="accent-brand" />
            {label as string}
          </label>
        ))}

        {!result?.verified && result && (
          <p className="text-sm text-warning border-t border-border pt-4">{t("calculator.unverified")}</p>
        )}

        {result && (
          <div className="pt-4 border-t border-border space-y-2">
            {rows.map(([label, val]) => (
              <div key={String(label)} className="flex justify-between text-sm">
                <span className="text-muted-foreground">{label}</span>
                <span className={cn("font-semibold", String(label) === t("calculator.grandTotal") && "text-brand text-base")}>
                  ৳{Math.abs(val as number).toLocaleString()}{(val as number) < 0 ? " (−)" : ""}
                </span>
              </div>
            ))}
            {university && (
              <button type="button" onClick={() => exportTuitionPdf(university, result)} className={cn(button.secondary, "mt-4 inline-flex items-center gap-2 text-sm")}>
                <Download size={14} /> {t("pdf.exportCost")}
              </button>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
}
