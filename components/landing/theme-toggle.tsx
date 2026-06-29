"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/lib/i18n/provider";

type ThemeToggleProps = {
  className?: string;
  scrolled?: boolean;
  lightNav?: boolean;
};

export function ThemeToggle({ className, scrolled, lightNav }: ThemeToggleProps) {
  const { theme, setTheme } = useTheme();
  const { t } = useTranslation("common");
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const isDark = mounted && theme === "dark";
  const onLight = lightNav ?? scrolled ?? true;

  if (!mounted) {
    return (
      <div
        className={cn("h-10 w-[72px] rounded-xl border", onLight ? "border-border bg-muted/40" : "border-white/15 bg-white/8", className)}
        aria-hidden
      />
    );
  }

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={isDark ? t("theme.light") : t("theme.dark")}
      title={isDark ? t("theme.light") : t("theme.dark")}
      className={cn(
        "relative h-10 w-[72px] rounded-xl border p-1 transition-colors duration-200 cursor-pointer",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40",
        onLight ? "border-border/60 bg-muted/40" : "border-white/15 bg-white/8 backdrop-blur-md",
        className
      )}
    >
      <motion.div
        className={cn(
          "absolute top-1 bottom-1 w-[calc(50%-2px)] rounded-lg shadow-sm",
          onLight ? "bg-background" : "bg-white/20"
        )}
        animate={{ left: isDark ? "calc(50% + 1px)" : "4px" }}
        transition={{ type: "spring", stiffness: 500, damping: 32 }}
      />
      <span className="relative z-10 flex h-full">
        <span className={cn("flex-1 flex items-center justify-center", !isDark ? "text-brand" : onLight ? "text-muted-foreground" : "text-white/50")}>
          <Sun size={15} />
        </span>
        <span className={cn("flex-1 flex items-center justify-center", isDark ? "text-brand" : onLight ? "text-muted-foreground" : "text-white/50")}>
          <Moon size={15} />
        </span>
      </span>
    </button>
  );
}
