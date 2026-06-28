"use client";

import { Shield, ExternalLink } from "lucide-react";
import Link from "next/link";
import { useTranslation } from "@/lib/i18n/provider";
import { getAccreditations } from "@/lib/universities/v3-data";
import type { University } from "@/lib/universities/types";
import { card, badge } from "@/lib/design-system";
import { cn } from "@/lib/utils";

export function UniversityAccreditationSection({ university }: { university: University }) {
  const { t } = useTranslation("universities");
  const accreditations = getAccreditations(university);

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {accreditations.map((a) => (
        <div key={a.name} className={cn(card.base, "p-5 text-center hover:border-brand/20 transition-colors")}>
          <div className="w-12 h-12 rounded-2xl bg-brand/10 flex items-center justify-center mx-auto mb-3">
            <Shield size={22} className="text-brand" />
          </div>
          <h4 className="font-bold text-foreground text-sm mb-1">{a.name}</h4>
          <span className={cn(
            badge.muted, "text-[10px] mb-2",
            a.status === "active" && "!bg-success/10 !text-success !border-success/20"
          )}>
            {t(`accreditation.status.${a.status}`)}
          </span>
          {a.issueDate && <p className="text-[10px] text-muted-foreground">{t("accreditation.issued")}: {a.issueDate}</p>}
          {!a.verified && <p className="text-[10px] text-warning mt-1">{t("accreditation.unverified")}</p>}
          {a.source && (
            <Link href={a.source} target="_blank" className="text-[10px] text-brand mt-2 inline-flex items-center gap-1 hover:underline">
              <ExternalLink size={10} /> {t("rankings.source")}
            </Link>
          )}
        </div>
      ))}
    </div>
  );
}
