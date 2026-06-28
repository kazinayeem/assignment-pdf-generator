"use client";

import Link from "next/link";
import { Globe, ExternalLink } from "lucide-react";
import { useTranslation } from "@/lib/i18n/provider";
import { getInternationalPartners } from "@/lib/universities/v3-data";
import type { University } from "@/lib/universities/types";
import { card, badge } from "@/lib/design-system";
import { cn } from "@/lib/utils";

const FLAG: Record<string, string> = {
  JP: "🇯🇵", US: "🇺🇸", UK: "🇬🇧", AU: "🇦🇺", UN: "🌍", DE: "🇩🇪", CA: "🇨🇦",
};

export function UniversityInternationalSection({ university }: { university: University }) {
  const { t } = useTranslation("universities");
  const partners = getInternationalPartners(university);

  if (partners.length === 0 && university.exchangePrograms.length === 0) {
    return (
      <div className={cn(card.base, "p-6 text-sm text-muted-foreground")}>{t("international.empty")}</div>
    );
  }

  return (
    <div className="space-y-4">
      {university.exchangePrograms.length > 0 && (
        <div className={cn(card.base, "p-5")}>
          <h3 className="font-bold mb-3 flex items-center gap-2"><Globe size={16} className="text-brand" />{t("international.exchange")}</h3>
          <div className="flex flex-wrap gap-2">
            {university.exchangePrograms.map((p) => <span key={p} className={badge.muted}>{p}</span>)}
          </div>
        </div>
      )}
      <div className="grid sm:grid-cols-2 gap-4">
        {partners.map((p) => (
          <div key={p.name} className={cn(card.base, "p-5 hover:border-brand/20 transition-colors")}>
            <div className="flex items-start gap-3">
              <span className="text-2xl">{FLAG[p.countryCode] ?? "🌍"}</span>
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-foreground">{p.name}</h4>
                <p className="text-xs text-muted-foreground mb-2">{p.country}</p>
                <span className={cn(badge.brand, "text-[10px] capitalize mb-2")}>{t(`international.types.${p.type}`)}</span>
                {p.programs.length > 0 && (
                  <p className="text-xs text-muted-foreground mt-2">{p.programs.join(" · ")}</p>
                )}
                {p.website && (
                  <Link href={p.website} target="_blank" className="text-xs text-brand font-semibold mt-2 inline-flex items-center gap-1 hover:underline">
                    <ExternalLink size={10} /> {t("detail.website")}
                  </Link>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
