"use client";

import { Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/lib/i18n/provider";

type NavSearchTriggerProps = {
  onClick: () => void;
  lightNav: boolean;
  className?: string;
};

export function NavSearchTrigger({ onClick, lightNav, className }: NavSearchTriggerProps) {
  const { t } = useTranslation("common");

  return (
    <>
      {/* Desktop */}
      <button
        type="button"
        onClick={onClick}
        aria-label={t("nav.search")}
        className={cn(
          "hidden lg:flex items-center gap-2 h-10 px-3 rounded-xl border text-sm transition-all duration-200 cursor-pointer",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40",
          "w-[220px]",
          lightNav
            ? "bg-muted/40 border-border/60 text-muted-foreground hover:bg-muted/70 hover:border-border"
            : "bg-white/8 border-white/15 text-white/60 hover:bg-white/12 hover:text-white/80 backdrop-blur-md",
          className
        )}
      >
        <Search size={15} aria-hidden className="shrink-0 opacity-70" />
        <span className="flex-1 text-left text-sm">{t("nav.searchPlaceholder")}</span>
        <kbd
          className={cn(
            "hidden xl:inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md text-[10px] font-medium border",
            lightNav ? "bg-background border-border text-muted-foreground" : "bg-white/10 border-white/20 text-white/50"
          )}
        >
          ⌘K
        </kbd>
      </button>

      {/* Tablet */}
      <button
        type="button"
        onClick={onClick}
        aria-label={t("nav.search")}
        className={cn(
          "hidden md:flex lg:hidden items-center gap-2 h-10 px-3 rounded-xl border text-sm transition-all duration-200 cursor-pointer",
          "w-[180px]",
          lightNav
            ? "bg-muted/40 border-border/60 text-muted-foreground hover:bg-muted/70"
            : "bg-white/8 border-white/15 text-white/60 hover:bg-white/12 backdrop-blur-md"
        )}
      >
        <Search size={15} aria-hidden />
        <span className="flex-1 text-left truncate text-sm">{t("nav.search")}</span>
      </button>

      {/* Mobile icon */}
      <button
        type="button"
        onClick={onClick}
        aria-label={t("nav.search")}
        className={cn(
          "md:hidden flex items-center justify-center min-h-11 min-w-11 rounded-xl transition-colors duration-200 cursor-pointer",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40",
          lightNav ? "text-muted-foreground hover:bg-muted" : "text-white/70 hover:bg-white/10"
        )}
      >
        <Search size={18} />
      </button>
    </>
  );
}
