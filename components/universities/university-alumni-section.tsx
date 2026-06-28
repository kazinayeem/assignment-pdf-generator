"use client";

import Link from "next/link";
import { Users, Linkedin, MapPin } from "lucide-react";
import { useTranslation } from "@/lib/i18n/provider";
import { getAlumniProfiles } from "@/lib/universities/v3-data";
import type { University } from "@/lib/universities/types";
import { card, badge } from "@/lib/design-system";
import { cn } from "@/lib/utils";

export function UniversityAlumniSection({ university }: { university: University }) {
  const { t } = useTranslation("universities");
  const alumni = getAlumniProfiles(university);

  if (alumni.length === 0) {
    return <p className={cn(card.base, "p-6 text-sm text-muted-foreground")}>{t("alumni.empty")}</p>;
  }

  return (
    <div className="space-y-4">
      {university.career.topRecruiters.length > 0 && (
        <div className={cn(card.base, "p-5")}>
          <h4 className="font-bold mb-2 flex items-center gap-2"><Users size={16} className="text-brand" />{t("alumni.recruiters")}</h4>
          <div className="flex flex-wrap gap-2">
            {university.career.topRecruiters.map((r) => <span key={r} className={badge.muted}>{r}</span>)}
          </div>
        </div>
      )}
      <div className="grid sm:grid-cols-2 gap-4">
        {alumni.map((a) => (
          <div key={a.id} className={cn(card.base, "p-5")}>
            <h4 className="font-bold text-foreground">{a.name}</h4>
            <p className="text-xs text-muted-foreground mb-2">{a.department} · {a.graduationYear}</p>
            {a.company && <p className="text-sm font-medium">{a.position ? `${a.position} @ ` : ""}{a.company}</p>}
            {a.city && <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1"><MapPin size={10} />{a.city}</p>}
            {a.story && <p className="text-sm text-muted-foreground mt-2 italic">&ldquo;{a.story}&rdquo;</p>}
            {a.advice && <p className="text-xs text-brand mt-2">{t("alumni.advice")}: {a.advice}</p>}
            {a.linkedin && (
              <Link href={a.linkedin} target="_blank" className="text-xs text-brand mt-2 inline-flex items-center gap-1 hover:underline">
                <Linkedin size={12} /> LinkedIn
              </Link>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
