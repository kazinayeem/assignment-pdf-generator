"use client";

import { useState } from "react";
import { Sparkles } from "lucide-react";
import { useTranslation } from "@/lib/i18n/provider";
import {
  generateUniversitySummary,
  generateCareerRecommendation,
  generateScholarshipSuggestions,
} from "@/lib/universities/ai-summaries";
import type { University } from "@/lib/universities/types";
import { card, button } from "@/lib/design-system";
import { cn } from "@/lib/utils";

export function UniversityAiPanel({ university }: { university: University }) {
  const { t } = useTranslation("universities");
  const [careerGoal, setCareerGoal] = useState("Software Engineer");
  const [gpa, setGpa] = useState(4.5);
  const [careerRecs, setCareerRecs] = useState<string[]>([]);
  const [scholarships, setScholarships] = useState<string[]>([]);

  const summary = generateUniversitySummary(university);

  return (
    <div className="space-y-4">
      <div className={cn(card.base, "p-5 bg-gradient-to-br from-brand/5 to-brand-accent/5")}>
        <h3 className="font-bold flex items-center gap-2 mb-2">
          <Sparkles size={16} className="text-brand" /> {t("ai.universitySummary")}
        </h3>
        <p className="text-sm text-muted-foreground leading-relaxed">{summary}</p>
      </div>

      <div className={cn(card.base, "p-5 space-y-3")}>
        <h3 className="font-bold text-sm">{t("ai.careerRecommendation")}</h3>
        <input
          value={careerGoal}
          onChange={(e) => setCareerGoal(e.target.value)}
          className="w-full px-3 py-2 rounded-xl border border-border bg-background text-sm min-h-[40px]"
          placeholder={t("recommend.careerGoal")}
        />
        <button
          type="button"
          onClick={() => setCareerRecs(generateCareerRecommendation(university, careerGoal))}
          className={cn(button.secondary, "text-sm")}
        >
          {t("ai.getCareerRec")}
        </button>
        {careerRecs.length > 0 && (
          <ul className="text-sm text-muted-foreground space-y-1">
            {careerRecs.map((r) => <li key={r}>• {r}</li>)}
          </ul>
        )}
      </div>

      <div className={cn(card.base, "p-5 space-y-3")}>
        <h3 className="font-bold text-sm">{t("ai.scholarshipSuggestions")}</h3>
        <input
          type="number"
          step="0.01"
          min={0}
          max={5}
          value={gpa}
          onChange={(e) => setGpa(Number(e.target.value))}
          className="w-full px-3 py-2 rounded-xl border border-border bg-background text-sm min-h-[40px]"
          placeholder="GPA"
        />
        <button
          type="button"
          onClick={() => setScholarships(generateScholarshipSuggestions(university, gpa))}
          className={cn(button.secondary, "text-sm")}
        >
          {t("ai.getScholarships")}
        </button>
        {scholarships.length > 0 && (
          <ul className="text-sm text-muted-foreground space-y-1">
            {scholarships.map((s) => <li key={s}>• {s}</li>)}
          </ul>
        )}
      </div>
    </div>
  );
}
