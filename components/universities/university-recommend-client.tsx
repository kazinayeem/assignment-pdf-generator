"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { useTranslation } from "@/lib/i18n/provider";
import { getDivisions } from "@/lib/universities";
import { recommendUniversitiesV2 } from "@/lib/universities/calculator";
import type { Division, RecommendationInput, RecommendationResult } from "@/lib/universities/types";
import { formatCurrency } from "@/lib/universities/format";
import { UniversityLogo } from "./university-logo";
import { card, button, animation, badge } from "@/lib/design-system";
import { cn } from "@/lib/utils";

export function UniversityRecommendClient() {
  const { t } = useTranslation("universities");
  const divisions = getDivisions();

  const [input, setInput] = useState<RecommendationInput>({
    sscGpa: 4.5,
    hscGpa: 4.0,
    preferredSubject: "CSE",
    budget: 2000000,
    division: "any",
    careerGoal: "Software Engineer",
    preferredCampus: "any",
    typePreference: "any",
    hostelNeeded: false,
    scholarshipNeeded: false,
    preferredCity: "",
  });

  const [results, setResults] = useState<RecommendationResult[]>([]);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setResults(recommendUniversitiesV2(input));
    setSubmitted(true);
  };

  return (
    <div className="max-w-[900px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <motion.div {...animation.fadeUp} className="mb-8">
        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand/10 text-brand text-xs font-semibold mb-3 border border-brand/20">
          <Sparkles size={12} aria-hidden /> AI
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground mb-2">{t("recommend.title")}</h1>
        <p className="text-muted-foreground">{t("recommend.subtitle")}</p>
      </motion.div>

      <motion.form {...animation.fadeUp} onSubmit={handleSubmit} className={cn(card.base, "p-6 space-y-4 mb-10")}>
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
            <label className="text-sm font-medium block mb-2">{t("recommend.subject")}</label>
            <input type="text" value={input.preferredSubject} onChange={(e) => setInput({ ...input, preferredSubject: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-border bg-background min-h-[44px]" required />
          </div>
          <div>
            <label className="text-sm font-medium block mb-2">{t("recommend.budget")}</label>
            <input type="number" value={input.budget} onChange={(e) => setInput({ ...input, budget: Number(e.target.value) })} className="w-full px-4 py-3 rounded-xl border border-border bg-background min-h-[44px]" required />
          </div>
          <div>
            <label className="text-sm font-medium block mb-2">{t("recommend.division")}</label>
            <select value={input.division} onChange={(e) => setInput({ ...input, division: e.target.value as Division | "any" })} className="w-full px-4 py-3 rounded-xl border border-border bg-background min-h-[44px]">
              <option value="any">{t("recommend.any")}</option>
              {divisions.map((d) => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
          <div>
            <label className="text-sm font-medium block mb-2">{t("predictor.city")}</label>
            <input type="text" value={input.preferredCity ?? ""} onChange={(e) => setInput({ ...input, preferredCity: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-border bg-background min-h-[44px]" placeholder="Dhaka" />
          </div>
          <div>
            <label className="text-sm font-medium block mb-2">{t("recommend.careerGoal")}</label>
            <input type="text" value={input.careerGoal} onChange={(e) => setInput({ ...input, careerGoal: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-border bg-background min-h-[44px]" />
          </div>
          <div>
            <label className="text-sm font-medium block mb-2">{t("recommend.typePreference")}</label>
            <select value={input.typePreference ?? "any"} onChange={(e) => setInput({ ...input, typePreference: e.target.value as RecommendationInput["typePreference"] })} className="w-full px-4 py-3 rounded-xl border border-border bg-background min-h-[44px]">
              <option value="any">{t("recommend.any")}</option>
              <option value="public">{t("types.public")}</option>
              <option value="private">{t("types.private")}</option>
              <option value="international">{t("types.international")}</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-medium block mb-2">{t("recommend.campus")}</label>
            <select value={input.preferredCampus} onChange={(e) => setInput({ ...input, preferredCampus: e.target.value as RecommendationInput["preferredCampus"] })} className="w-full px-4 py-3 rounded-xl border border-border bg-background min-h-[44px]">
              <option value="any">{t("recommend.any")}</option>
              <option value="urban">{t("recommend.urban")}</option>
              <option value="suburban">{t("recommend.suburban")}</option>
            </select>
          </div>
        </div>
        <div className="flex flex-wrap gap-4">
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={input.hostelNeeded} onChange={(e) => setInput({ ...input, hostelNeeded: e.target.checked })} className="rounded border-border" />
            {t("recommend.hostelNeeded")}
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={input.scholarshipNeeded} onChange={(e) => setInput({ ...input, scholarshipNeeded: e.target.checked })} className="rounded border-border" />
            {t("recommend.scholarshipNeeded")}
          </label>
        </div>
        <button type="submit" className={cn(button.primary, "w-full sm:w-auto")}>{t("recommend.submit")}</button>
      </motion.form>

      {submitted && (
        <motion.div {...animation.fadeUp}>
          <h2 className="text-lg font-bold text-foreground mb-4">{t("recommend.matches")}</h2>
          {results.length === 0 ? (
            <p className="text-muted-foreground">{t("recommend.noMatches")}</p>
          ) : (
            <div className="space-y-4">
              {results.map((r) => (
                <div key={r.university.slug} className={cn(card.base, "p-5")}>
                  <div className="flex items-start gap-4">
                    <UniversityLogo university={r.university} size="md" />
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <Link href={`/universities/${r.university.slug}`} className="font-bold text-foreground hover:text-brand">
                          {r.university.name}
                        </Link>
                        <span className={cn(badge.brand)}>{r.matchPercent}% {t("recommend.matchScore")}</span>
                        <span className={cn(badge.muted)}>{t(`predictor.chance.${r.admissionChance}`)}</span>
                      </div>
                      {r.estimatedCost != null && (
                        <p className="text-sm text-muted-foreground mb-2">
                          {t("recommend.estimatedCost")}: {formatCurrency(r.estimatedCost)}
                        </p>
                      )}
                      <ul className="text-xs text-muted-foreground space-y-0.5">
                        {r.reasons.map((reason) => <li key={reason}>• {reason}</li>)}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}
