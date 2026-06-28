"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Brain, Download, Sparkles } from "lucide-react";
import { useTranslation } from "@/lib/i18n/provider";
import { UNIVERSITIES } from "@/lib/universities";
import { predictAdmission } from "@/lib/universities/admission-predictor";
import { exportAdmissionPdf } from "@/lib/universities/pdf-export";
import type { AdmissionChance, AdmissionPredictorInput } from "@/lib/universities/types";
import { UniversityLogo } from "./university-logo";
import { card, button, animation, badge } from "@/lib/design-system";
import { cn } from "@/lib/utils";

const CHANCE_COLORS: Record<AdmissionChance, string> = {
  "very-high": "bg-success/15 text-success border-success/30",
  high: "bg-brand/15 text-brand border-brand/30",
  medium: "bg-warning/15 text-warning border-warning/30",
  low: "bg-orange-500/15 text-orange-600 border-orange-500/30",
  "very-low": "bg-destructive/15 text-destructive border-destructive/30",
};

export function UniversityAdmissionPredictorClient() {
  const { t } = useTranslation("universities");
  const [input, setInput] = useState<AdmissionPredictorInput>({
    sscGpa: 4.5,
    hscGpa: 4.0,
    group: "science",
    preferredSubject: "CSE",
    preferredCity: "Dhaka",
    budget: 2000000,
    typePreference: "any",
    quota: "none",
  });
  const [result, setResult] = useState<ReturnType<typeof predictAdmission> | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setResult(predictAdmission(input));
  };

  return (
    <div className="max-w-[900px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <motion.div {...animation.fadeUp} className="mb-8">
        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand/10 text-brand text-xs font-semibold mb-3 border border-brand/20">
          <Brain size={12} /> AI
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground mb-2">{t("predictor.title")}</h1>
        <p className="text-muted-foreground">{t("predictor.subtitle")}</p>
      </motion.div>

      <motion.form {...animation.fadeUp} onSubmit={handleSubmit} className={cn(card.base, "p-6 space-y-4 mb-8")}>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium block mb-2">{t("recommend.sscGpa")}</label>
            <input type="number" step="0.01" min={0} max={5} value={input.sscGpa} onChange={(e) => setInput({ ...input, sscGpa: Number(e.target.value) })} className="w-full px-4 py-3 rounded-xl border border-border bg-background min-h-[44px]" required />
          </div>
          <div>
            <label className="text-sm font-medium block mb-2">{t("recommend.hscGpa")}</label>
            <input type="number" step="0.01" min={0} max={5} value={input.hscGpa} onChange={(e) => setInput({ ...input, hscGpa: Number(e.target.value) })} className="w-full px-4 py-3 rounded-xl border border-border bg-background min-h-[44px]" required />
          </div>
          <div>
            <label className="text-sm font-medium block mb-2">{t("predictor.group")}</label>
            <select value={input.group} onChange={(e) => setInput({ ...input, group: e.target.value as AdmissionPredictorInput["group"] })} className="w-full px-4 py-3 rounded-xl border border-border bg-background min-h-[44px]">
              <option value="science">{t("predictor.science")}</option>
              <option value="commerce">{t("predictor.commerce")}</option>
              <option value="arts">{t("predictor.arts")}</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-medium block mb-2">{t("recommend.subject")}</label>
            <input value={input.preferredSubject} onChange={(e) => setInput({ ...input, preferredSubject: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-border bg-background min-h-[44px]" />
          </div>
          <div>
            <label className="text-sm font-medium block mb-2">{t("predictor.city")}</label>
            <input value={input.preferredCity} onChange={(e) => setInput({ ...input, preferredCity: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-border bg-background min-h-[44px]" />
          </div>
          <div>
            <label className="text-sm font-medium block mb-2">{t("recommend.budget")}</label>
            <input type="number" value={input.budget} onChange={(e) => setInput({ ...input, budget: Number(e.target.value) })} className="w-full px-4 py-3 rounded-xl border border-border bg-background min-h-[44px]" />
          </div>
          <div>
            <label className="text-sm font-medium block mb-2">{t("predictor.university")}</label>
            <select value={input.preferredUniversitySlug ?? ""} onChange={(e) => setInput({ ...input, preferredUniversitySlug: e.target.value || undefined })} className="w-full px-4 py-3 rounded-xl border border-border bg-background min-h-[44px]">
              <option value="">{t("predictor.anyUniversity")}</option>
              {UNIVERSITIES.slice(0, 50).map((u) => <option key={u.slug} value={u.slug}>{u.shortName}</option>)}
            </select>
          </div>
          <div>
            <label className="text-sm font-medium block mb-2">{t("predictor.quota")}</label>
            <select value={input.quota} onChange={(e) => setInput({ ...input, quota: e.target.value as AdmissionPredictorInput["quota"] })} className="w-full px-4 py-3 rounded-xl border border-border bg-background min-h-[44px]">
              <option value="none">{t("predictor.noQuota")}</option>
              <option value="freedom-fighter">{t("predictor.ffQuota")}</option>
              <option value="tribal">{t("predictor.tribalQuota")}</option>
              <option value="disabled">{t("predictor.disabledQuota")}</option>
            </select>
          </div>
        </div>
        <button type="submit" className={cn(button.primary, "w-full sm:w-auto inline-flex items-center gap-2")}>
          <Sparkles size={16} /> {t("predictor.submit")}
        </button>
      </motion.form>

      {result?.primary && (
        <motion.div {...animation.fadeUp} className={cn(card.base, "p-6 mb-6")}>
          <div className="flex items-start gap-4 mb-4">
            <UniversityLogo university={result.primary.university} size="lg" />
            <div>
              <h2 className="text-lg font-bold text-foreground">{result.primary.university.name}</h2>
              <span className={cn("inline-flex mt-2 px-3 py-1 rounded-full text-sm font-bold border", CHANCE_COLORS[result.primary.chance])}>
                {t(`predictor.chance.${result.primary.chance}`)} — {result.primary.confidence}%
              </span>
            </div>
          </div>
          <ul className="text-sm text-muted-foreground space-y-1 mb-4">
            {result.primary.reasons.map((r) => <li key={r}>• {r}</li>)}
          </ul>
          <button type="button" onClick={() => exportAdmissionPdf(result.primary!.university, result.primary!.chance, result.primary!.confidence)} className={cn(button.secondary, "inline-flex items-center gap-2 text-sm")}>
            <Download size={14} /> {t("pdf.export")}
          </button>
        </motion.div>
      )}

      {result && result.alternatives.length > 0 && (
        <motion.div {...animation.fadeUp}>
          <h3 className="text-lg font-bold mb-4">{t("predictor.alternatives")}</h3>
          <div className="grid sm:grid-cols-2 gap-3">
            {result.alternatives.map((alt) => (
              <div key={alt.university.slug} className={cn(card.base, "p-4 flex items-center gap-3")}>
                <UniversityLogo university={alt.university} size="sm" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold truncate">{alt.university.shortName}</p>
                  <span className={cn(badge.muted, "text-[10px] mt-1")}>{t(`predictor.chance.${alt.chance}`)} {alt.confidence}%</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
