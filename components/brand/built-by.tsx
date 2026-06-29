"use client";

import Link from "next/link";
import { Heart } from "lucide-react";
import { BRAND } from "@/lib/brand";
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
        {BRAND.author}
      </p>
      {!isCompact && (
        <>
          <p className={cn("mt-1 text-sm", isAbout ? "text-muted-foreground" : "text-slate-400")}>
            {t("authorSection.title")} · {t("authorSection.role")}
          </p>
          <p className={cn("mt-0.5 text-xs", isAbout ? "text-muted-foreground" : "text-slate-500")}>
            {t("authorSection.poweredBy")} {BRAND.company}
          </p>
          <div className="flex flex-wrap gap-3 mt-3 text-xs">
            <Link
              href={BRAND.portfolioUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={cn("font-medium hover:underline", isAbout ? "text-brand" : "text-brand-accent")}
            >
              {t("authorSection.portfolio")}
            </Link>
            <Link
              href={BRAND.companyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={cn("font-medium hover:underline", isAbout ? "text-brand" : "text-brand-accent")}
            >
              {BRAND.company}
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
