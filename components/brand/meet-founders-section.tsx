"use client";

import { Users } from "lucide-react";
import { FOUNDERS } from "@/lib/brand";
import { useTranslation } from "@/lib/i18n/provider";
import { FounderCard } from "./founder-card";

export function MeetFoundersSection() {
  const { t } = useTranslation("about");

  return (
    <section id="founders" className="mb-10 scroll-mt-24">
      <div className="flex items-center gap-2 mb-2">
        <Users className="text-brand" size={20} aria-hidden />
        <h3 className="text-xl font-bold text-foreground">{t("founders.title")}</h3>
      </div>
      <p className="text-sm text-muted-foreground mb-6 max-w-2xl">{t("founders.subtitle")}</p>
      <div className="grid md:grid-cols-2 gap-6">
        {FOUNDERS.map((founder, i) => (
          <FounderCard key={founder.id} founder={founder} index={i} />
        ))}
      </div>
    </section>
  );
}
