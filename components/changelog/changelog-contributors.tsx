"use client";

import Image from "next/image";
import Link from "next/link";
import { FOUNDERS, BRAND } from "@/lib/brand";
import { useTranslation } from "@/lib/i18n/provider";
import { cn } from "@/lib/utils";

export function ChangelogContributors() {
  const { t } = useTranslation("changelog");

  return (
    <section className="rounded-2xl border border-border bg-card/60 backdrop-blur p-6 sm:p-8">
      <h2 className="text-xl font-bold text-foreground mb-6">{t("contributors.title")}</h2>
      <div className="grid sm:grid-cols-2 gap-6 mb-6">
        {FOUNDERS.map((founder) => (
          <div key={founder.id} className="flex items-center gap-4">
            <Image
              src={founder.imageUrl}
              alt={founder.name}
              width={56}
              height={56}
              className="h-14 w-14 rounded-full object-cover border-2 border-brand/20"
              unoptimized
            />
            <div>
              <p className="font-bold text-foreground">{founder.name}</p>
              <p className="text-sm text-brand">{t(`contributors.${founder.id}.role`)}</p>
              <p className="text-xs text-muted-foreground">{t(`contributors.${founder.id}.title`)}</p>
            </div>
          </div>
        ))}
      </div>
      <p className="text-sm text-muted-foreground">
        {t("contributors.poweredBy")}{" "}
        <Link href={BRAND.companyUrl} target="_blank" rel="noopener noreferrer" className={cn("font-semibold text-brand hover:underline")}>
          {BRAND.company}
        </Link>
      </p>
    </section>
  );
}
