"use client";

import { Crown } from "lucide-react";
import { FOUNDERS } from "@/lib/brand";
import { useTranslation } from "@/lib/i18n/provider";
import { card } from "@/lib/design-system";
import { cn } from "@/lib/utils";

export function LeadershipSection() {
  const { t } = useTranslation("about");
  const { tArray } = useTranslation("about");

  return (
    <section id="team" className="mb-10 scroll-mt-24">
      <div className="flex items-center gap-2 mb-6">
        <Crown className="text-brand" size={20} aria-hidden />
        <h3 className="text-xl font-bold text-foreground">{t("leadership.title")}</h3>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        {FOUNDERS.map((founder) => {
          const focusAreas = tArray<string>(`leadership.${founder.id}.focus`);
          return (
            <div key={founder.id} className={cn(card.base, "p-6")}>
              <p className="text-lg font-bold text-foreground">{founder.name}</p>
              <p className="text-sm font-medium text-brand mt-0.5">{t(`leadership.${founder.id}.role`)}</p>
              <ul className="mt-4 space-y-2">
                {focusAreas.map((area) => (
                  <li key={area} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span className="h-1.5 w-1.5 rounded-full bg-brand shrink-0" aria-hidden />
                    {area}
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </section>
  );
}
