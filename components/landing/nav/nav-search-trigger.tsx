"use client";

import { Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/lib/i18n/provider";

type NavSearchTriggerProps = {
  onClick: () => void;
  lightNav: boolean;
};

export function NavSearchTrigger({ onClick, lightNav }: NavSearchTriggerProps) {
  const { t } = useTranslation("common");

  return (
    <>
      <button
        type="button"
        onClick={onClick}
        aria-label={t("nav.search")}
        className={cn(
          "hidden lg:flex items-center gap-2 shrink-0 h-10 px-3 rounded-xl border text-sm",
          "w-[220px] transition-all duration-200 cursor-pointer overflow-hidden",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40",
          lightNav
            ? "bg-muted/30 border-border/50 text-muted-foreground hover:bg-muted/50 hover:border-border"
            : "bg-white/6 border-white/12 text-white/55 hover:bg-white/10 hover:text-white/75 backdrop-blur-md"
        )}
      >
        <Search size={14} className="shrink-0 opacity-60" aria-hidden />
        <span className="flex-1 truncate text-left text-[13px]">{t("nav.searchPlaceholder")}</span>
        <kbd
          className={cn(
            "shrink-0 inline-flex items-center px-1.5 py-0.5 rounded-md text-[10px] font-medium border leading-none",
            lightNav ? "bg-background/80 border-border/80 text-muted-foreground" : "bg-white/8 border-white/15 text-white/45"
          )}
        >
          ⌘K
        </kbd>
      </button>

      <button
        type="button"
        onClick={onClick}
        aria-label={t("nav.search")}
        className={cn(
          "hidden md:flex lg:hidden items-center gap-2 shrink-0 h-10 px-3 rounded-xl border text-sm",
          "w-[180px] transition-all duration-200 cursor-pointer overflow-hidden",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40",
          lightNav
            ? "bg-muted/30 border-border/50 text-muted-foreground hover:bg-muted/50"
            : "bg-white/6 border-white/12 text-white/55 hover:bg-white/10 backdrop-blur-md"
        )}
      >
        <Search size={14} className="shrink-0" aria-hidden />
        <span className="flex-1 truncate text-left text-[13px]">{t("nav.searchPlaceholder")}</span>
      </button>

      <button
        type="button"
        onClick={onClick}
        aria-label={t("nav.search")}
        className={cn(
          "md:hidden flex items-center justify-center shrink-0 h-10 w-10 rounded-xl transition-colors duration-200",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40",
          lightNav ? "text-muted-foreground hover:bg-muted/80" : "text-white/70 hover:bg-white/10"
        )}
      >
        <Search size={18} />
      </button>
    </>
  );
}
