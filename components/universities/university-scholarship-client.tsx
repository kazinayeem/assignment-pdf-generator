"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Award, Download, CheckCircle, XCircle } from "lucide-react";
import { useTranslation } from "@/lib/i18n/provider";
import { UNIVERSITIES } from "@/lib/universities";
import { checkScholarshipEligibility } from "@/lib/universities/scholarship-checker";
import { exportScholarshipPdf } from "@/lib/universities/pdf-export";
import { getUniversity } from "@/lib/universities";
import type { ScholarshipCheckInput } from "@/lib/universities/types";
import { card, button, animation, badge } from "@/lib/design-system";
import { cn } from "@/lib/utils";

export function UniversityScholarshipClient() {
  const { t } = useTranslation("universities");
  const [input, setInput] = useState<ScholarshipCheckInput>({
    sscGpa: 4.5,
    hscGpa: 4.0,
    incomeRange: "medium",
    universitySlug: UNIVERSITIES[0]?.slug ?? "",
    department: "CSE",
  });
  const [offers, setOffers] = useState<ReturnType<typeof checkScholarshipEligibility>>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setOffers(checkScholarshipEligibility(input));
  };

  const university = getUniversity(input.universitySlug);

  return (
    <div className="max-w-[800px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <motion.div {...animation.fadeUp} className="mb-8">
        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand/10 text-brand text-xs font-semibold mb-3 border border-brand/20">
          <Award size={12} />
          {t("scholarship.badge")}
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground mb-2">{t("scholarship.title")}</h1>
        <p className="text-muted-foreground">{t("scholarship.subtitle")}</p>
      </motion.div>

      <motion.form {...animation.fadeUp} onSubmit={handleSubmit} className={cn(card.base, "p-6 space-y-4 mb-8")}>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium block mb-2">{t("recommend.sscGpa")}</label>
            <input type="number" step="0.01" value={input.sscGpa} onChange={(e) => setInput({ ...input, sscGpa: Number(e.target.value) })} className="w-full px-4 py-3 rounded-xl border border-border bg-background min-h-[44px]" />
          </div>
          <div>
            <label className="text-sm font-medium block mb-2">{t("recommend.hscGpa")}</label>
            <input type="number" step="0.01" value={input.hscGpa} onChange={(e) => setInput({ ...input, hscGpa: Number(e.target.value) })} className="w-full px-4 py-3 rounded-xl border border-border bg-background min-h-[44px]" />
          </div>
          <div>
            <label className="text-sm font-medium block mb-2">{t("scholarship.income")}</label>
            <select value={input.incomeRange} onChange={(e) => setInput({ ...input, incomeRange: e.target.value as ScholarshipCheckInput["incomeRange"] })} className="w-full px-4 py-3 rounded-xl border border-border bg-background min-h-[44px]">
              <option value="low">{t("scholarship.incomeLow")}</option>
              <option value="medium">{t("scholarship.incomeMedium")}</option>
              <option value="high">{t("scholarship.incomeHigh")}</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-medium block mb-2">{t("calculator.selectUniversity")}</label>
            <select value={input.universitySlug} onChange={(e) => setInput({ ...input, universitySlug: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-border bg-background min-h-[44px]">
              {UNIVERSITIES.map((u) => <option key={u.slug} value={u.slug}>{u.name}</option>)}
            </select>
          </div>
          <div className="sm:col-span-2">
            <label className="text-sm font-medium block mb-2">{t("scholarship.department")}</label>
            <input value={input.department} onChange={(e) => setInput({ ...input, department: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-border bg-background min-h-[44px]" />
          </div>
        </div>
        <button type="submit" className={cn(button.primary)}>{t("scholarship.check")}</button>
      </motion.form>

      {offers.length > 0 && (
        <motion.div {...animation.fadeUp} className="space-y-3">
          {offers.map((offer) => (
            <div key={offer.name} className={cn(card.base, "p-5")}>
              <div className="flex items-start justify-between gap-3 mb-2">
                <div>
                  <h3 className="font-bold text-foreground">{offer.name}</h3>
                  <span className={cn(badge.muted, "text-[10px] mt-1")}>{offer.type}</span>
                </div>
                {offer.eligible ? (
                  <CheckCircle size={20} className="text-success shrink-0" />
                ) : (
                  <XCircle size={20} className="text-muted-foreground shrink-0" />
                )}
              </div>
              <p className="text-sm text-muted-foreground mb-2">{offer.description}</p>
              {offer.waiverPercent != null && (
                <p className="text-sm font-semibold text-brand">{t("scholarship.waiver")}: {offer.waiverPercent}%</p>
              )}
              {offer.deadline && <p className="text-xs text-muted-foreground mt-1">{t("scholarship.deadline")}: {offer.deadline}</p>}
            </div>
          ))}
          {university && (
            <button type="button" onClick={() => exportScholarshipPdf(university, offers)} className={cn(button.secondary, "inline-flex items-center gap-2")}>
              <Download size={14} /> {t("pdf.exportScholarship")}
            </button>
          )}
        </motion.div>
      )}
    </div>
  );
}
