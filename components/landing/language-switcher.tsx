"use client";

import { useEffect, useState } from "react";
import { Globe } from "lucide-react";
import { useI18n } from "@/lib/i18n/provider";
import type { Locale } from "@/lib/i18n/types";
import { cn } from "@/lib/utils";

const LOCALES: { code: Locale; label: string }[] = [
  { code: "en", label: "EN" },
  { code: "bn", label: "বাং" },
];

type LanguageSwitcherProps = {
  scrolled?: boolean;
  compact?: boolean;
  className?: string;
};

export function LanguageSwitcher({ scrolled = true, compact = false, className }: LanguageSwitcherProps) {
  const { locale, setLocale, t } = useI18n();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <div className={cn("relative", className)} role="group" aria-label={t("common", "language.switch")}>
      <div
        className={cn(
          "flex items-center rounded-xl border p-0.5 min-h-[44px]",
          scrolled
            ? "border-border bg-muted/50"
            : "border-white/20 bg-white/10"
        )}
      >
        {!compact && (
          <Globe
            size={14}
            className={cn("ml-2 shrink-0", scrolled ? "text-muted-foreground" : "text-white/70")}
            aria-hidden
          />
        )}
        {LOCALES.map((l) => (
          <button
            key={l.code}
            type="button"
            onClick={() => setLocale(l.code)}
            aria-pressed={locale === l.code}
            className={cn(
              "px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all min-h-[36px] min-w-[36px]",
              locale === l.code
                ? scrolled
                  ? "bg-background text-foreground shadow-sm"
                  : "bg-white/20 text-white"
                : scrolled
                  ? "text-muted-foreground hover:text-foreground"
                  : "text-white/60 hover:text-white"
            )}
          >
            {l.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export function LanguageSwitcherLink({ className }: { className?: string }) {
  const { locale, setLocale } = useI18n();
  const next = locale === "en" ? "bn" : "en";

  return (
    <button
      type="button"
      onClick={() => setLocale(next)}
      className={cn("inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors min-h-[44px]", className)}
    >
      <Globe size={16} aria-hidden />
      {locale === "en" ? "বাংলা" : "English"}
    </button>
  );
}
