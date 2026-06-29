"use client";

import Link from "next/link";
import { Heart } from "lucide-react";
import { BRAND, FOUNDERS } from "@/lib/brand";
import { useTranslation } from "@/lib/i18n/provider";
import { cn } from "@/lib/utils";

type BuiltByProps = {
  variant?: "footer" | "about" | "compact";
  className?: string;
};

export function BuiltBySection({ variant = "footer", className }: BuiltByProps) {
  const { t } = useTranslation("footer");
  const isCompact = variant === "compact";
  const isAbout = variant === "about";

  return (
    <div
      className={cn(
        "rounded-xl border print-author",
        isAbout ? "p-6 sm:p-8 bg-muted/30 border-border" : "p-4 bg-white/5 border-white/10",
        className
      )}
    >
      <p
        className={cn(
          "font-semibold flex items-center gap-1.5 flex-wrap",
          isAbout ? "text-foreground text-base" : "text-slate-300 text-sm"
        )}
      >
        {t("authorSection.builtWith")}{" "}
        <Heart className="w-3.5 h-3.5 text-destructive fill-destructive" aria-hidden />{" "}
        {t("authorSection.by") ? `${t("authorSection.by")} ` : ""}
        <span className="text-brand-accent">{BRAND.authors}</span>
      </p>
      {!isCompact && (
        <>
          <p className={cn("mt-1 text-sm", isAbout ? "text-muted-foreground" : "text-slate-400")}>
            {t("authorSection.coFounders")}
          </p>
          <p className={cn("mt-2 text-xs font-medium", isAbout ? "text-foreground" : "text-slate-300")}>
            {BRAND.platform}
            <span className={cn("block font-normal mt-0.5", isAbout ? "text-muted-foreground" : "text-slate-500")}>
              {t("authorSection.productLine")}
            </span>
          </p>
          <Link
            href={BRAND.companyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              "inline-block mt-1 text-xs hover:underline",
              isAbout ? "text-brand" : "text-brand-accent"
            )}
          >
            {BRAND.companyUrl.replace("https://", "")}
          </Link>
          <div className="flex flex-col gap-2 mt-4 text-xs">
            {FOUNDERS.map((founder) => (
              <Link
                key={founder.id}
                href={founder.portfolioUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  "font-medium hover:underline flex items-center gap-2 min-h-[36px]",
                  isAbout ? "text-brand" : "text-brand-accent"
                )}
              >
                {founder.name}
                <span className={cn("font-normal", isAbout ? "text-muted-foreground" : "text-slate-500")}>
                  · {founder.portfolioUrl.replace("https://www.", "").replace("https://", "")}
                </span>
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
