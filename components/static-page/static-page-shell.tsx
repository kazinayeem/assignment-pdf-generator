"use client";

import Link from "next/link";
import { ArrowLeft, type LucideIcon } from "lucide-react";
import { LanguageSwitcher } from "@/components/landing/language-switcher";
import { useTranslation } from "@/lib/i18n/provider";
import { cn } from "@/lib/utils";

type StaticPageShellProps = {
  title: string;
  backLabel?: string;
  icon: LucideIcon;
  iconClassName?: string;
  children: React.ReactNode;
};

export function StaticPageShell({
  title,
  backLabel,
  icon: Icon,
  iconClassName,
  children,
}: StaticPageShellProps) {
  const { t } = useTranslation("policies");

  return (
    <div className="min-h-screen bg-surface-page">
      <header className="bg-card/80 backdrop-blur-xl border-b border-border px-4 sm:px-6 py-4 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-3">
          <Link
            href="/"
            aria-label={backLabel ?? t("back")}
            className="p-2 hover:bg-muted rounded-xl transition-colors group min-h-[44px] min-w-[44px] flex items-center justify-center"
          >
            <ArrowLeft className="w-5 h-5 text-muted-foreground group-hover:text-brand" />
          </Link>
          <div className="flex items-center gap-3 min-w-0">
            <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center shrink-0 gradient-primary", iconClassName)}>
              <Icon className="w-4 h-4 text-brand-foreground" />
            </div>
            <h1 className="font-bold text-foreground truncate">{title}</h1>
          </div>
          <LanguageSwitcher scrolled compact />
        </div>
      </header>
      <main id="main-content" className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        {children}
      </main>
    </div>
  );
}
