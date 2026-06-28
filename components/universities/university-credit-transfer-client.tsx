"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRightLeft } from "lucide-react";
import { useTranslation } from "@/lib/i18n/provider";
import { UNIVERSITIES } from "@/lib/universities";
import { checkCreditTransfer } from "@/lib/universities/credit-transfer";
import type { CreditTransferInput, CreditTransferResult } from "@/lib/universities/types";
import { card, button, animation, badge } from "@/lib/design-system";
import { cn } from "@/lib/utils";

export function UniversityCreditTransferClient() {
  const { t } = useTranslation("universities");
  const [input, setInput] = useState<CreditTransferInput>({
    fromUniversitySlug: "",
    fromDepartment: "CSE",
    completedCredits: 60,
    completedCourses: "CSE101, CSE201, MAT101",
    toUniversitySlug: "",
    toDepartment: "CSE",
  });
  const [result, setResult] = useState<CreditTransferResult | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setResult(checkCreditTransfer(input));
  };

  return (
    <div className="max-w-[800px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <motion.div {...animation.fadeUp} className="mb-8">
        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand/10 text-brand text-xs font-semibold mb-3 border border-brand/20">
          <ArrowRightLeft size={12} /> {t("creditTransfer.badge")}
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground mb-2">{t("creditTransfer.title")}</h1>
        <p className="text-muted-foreground">{t("creditTransfer.subtitle")}</p>
      </motion.div>

      <motion.form {...animation.fadeUp} onSubmit={handleSubmit} className={cn(card.base, "p-6 space-y-4 mb-8")}>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium block mb-2">{t("creditTransfer.fromUniversity")}</label>
            <select required value={input.fromUniversitySlug} onChange={(e) => setInput({ ...input, fromUniversitySlug: e.target.value })} className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm min-h-[44px]">
              <option value="">{t("calculator.selectUniversity")}</option>
              {UNIVERSITIES.map((u) => <option key={u.slug} value={u.slug}>{u.shortName}</option>)}
            </select>
          </div>
          <div>
            <label className="text-sm font-medium block mb-2">{t("creditTransfer.fromDepartment")}</label>
            <input value={input.fromDepartment} onChange={(e) => setInput({ ...input, fromDepartment: e.target.value })} className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm min-h-[44px]" />
          </div>
          <div>
            <label className="text-sm font-medium block mb-2">{t("creditTransfer.toUniversity")}</label>
            <select required value={input.toUniversitySlug} onChange={(e) => setInput({ ...input, toUniversitySlug: e.target.value })} className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm min-h-[44px]">
              <option value="">{t("calculator.selectUniversity")}</option>
              {UNIVERSITIES.map((u) => <option key={u.slug} value={u.slug}>{u.shortName}</option>)}
            </select>
          </div>
          <div>
            <label className="text-sm font-medium block mb-2">{t("creditTransfer.toDepartment")}</label>
            <input value={input.toDepartment} onChange={(e) => setInput({ ...input, toDepartment: e.target.value })} className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm min-h-[44px]" />
          </div>
          <div>
            <label className="text-sm font-medium block mb-2">{t("creditTransfer.completedCredits")}</label>
            <input type="number" value={input.completedCredits} onChange={(e) => setInput({ ...input, completedCredits: Number(e.target.value) })} className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm min-h-[44px]" />
          </div>
          <div className="sm:col-span-2">
            <label className="text-sm font-medium block mb-2">{t("creditTransfer.completedCourses")}</label>
            <input value={input.completedCourses} onChange={(e) => setInput({ ...input, completedCourses: e.target.value })} className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm min-h-[44px]" placeholder="CSE101, CSE201, MAT101" />
          </div>
        </div>
        <button type="submit" className={cn(button.primary)}>{t("creditTransfer.check")}</button>
      </motion.form>

      {result && (
        <motion.div {...animation.fadeUp} className={cn(card.base, "p-6")}>
          <span className={cn(badge.brand, "mb-4")}>
            {result.eligible ? t("creditTransfer.eligible") : t("creditTransfer.notEligible")}
          </span>
          <div className="grid sm:grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-xs text-muted-foreground">{t("creditTransfer.acceptedCredits")}</p>
              <p className="text-xl font-bold">{result.acceptedCredits ?? t("data.unavailable")}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">{t("creditTransfer.remainingCredits")}</p>
              <p className="text-xl font-bold">{result.remainingCredits ?? t("data.unavailable")}</p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground mb-3"><strong>{t("creditTransfer.policy")}:</strong> {result.policy}</p>
          <p className="text-xs font-bold mb-1">{t("creditTransfer.documents")}</p>
          <ul className="text-xs text-muted-foreground mb-3 space-y-0.5">{result.documents.map((d) => <li key={d}>• {d}</li>)}</ul>
          {result.notes.map((n) => <p key={n} className="text-xs text-warning">• {n}</p>)}
        </motion.div>
      )}
    </div>
  );
}
