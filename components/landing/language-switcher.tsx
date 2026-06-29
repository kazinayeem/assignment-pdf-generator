"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useI18n } from "@/lib/i18n/provider";
import type { Locale } from "@/lib/i18n/types";
import { cn } from "@/lib/utils";

const LOCALES: { code: Locale; label: string }[] = [
  { code: "en", label: "EN" },
  { code: "bn", label: "বাংলা" },
];

type LanguageSwitcherProps = {
  scrolled?: boolean;
  lightNav?: boolean;
  compact?: boolean;
  className?: string;
};

export function LanguageSwitcher({ scrolled, lightNav, className }: LanguageSwitcherProps) {
  const { locale, setLocale, t } = useI18n();
  const [mounted, setMounted] = useState(false);
  const onLight = lightNav ?? scrolled ?? true;

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return <div className={cn("h-10 w-[92px] shrink-0 rounded-xl border border-border/50", className)} aria-hidden />;
  }

  return (
    <div className={cn("relative shrink-0", className)} role="group" aria-label={t("common", "language.switch")}>
      <div
        className={cn(
          "relative flex h-10 w-[92px] rounded-xl border p-0.5",
          onLight ? "border-border/50 bg-muted/30" : "border-white/12 bg-white/6 backdrop-blur-md"
        )}
      >
        <motion.div
          className={cn("absolute top-0.5 bottom-0.5 rounded-[10px]", onLight ? "bg-background shadow-sm" : "bg-white/15")}
          style={{ width: "calc(50% - 2px)" }}
          animate={{ left: locale === "bn" ? "calc(50% + 1px)" : "2px" }}
          transition={{ type: "spring", stiffness: 520, damping: 34 }}
        />
        {LOCALES.map((l) => (
          <button
            key={l.code}
            type="button"
            onClick={() => setLocale(l.code)}
            aria-pressed={locale === l.code}
            className={cn(
              "relative z-10 flex-1 h-full text-[11px] font-semibold transition-colors duration-200 rounded-[10px]",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40",
              locale === l.code
                ? onLight ? "text-foreground" : "text-white"
                : onLight ? "text-muted-foreground hover:text-foreground" : "text-white/50 hover:text-white/75"
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
      className={cn(
        "inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors min-h-11",
        className
      )}
    >
      {locale === "en" ? "বাংলা" : "English"}
    </button>
  );
}
