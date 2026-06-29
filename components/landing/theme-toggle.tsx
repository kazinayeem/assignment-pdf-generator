"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
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
    return <div className={cn("h-10 w-10 shrink-0 rounded-xl", className)} aria-hidden />;
  }

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={isDark ? t("theme.light") : t("theme.dark")}
      title={isDark ? t("theme.light") : t("theme.dark")}
      className={cn(
        "relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border transition-all duration-200 cursor-pointer",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40",
        "hover:scale-105 active:scale-95",
        onLight
          ? "border-border/50 bg-muted/30 text-muted-foreground hover:bg-muted/60 hover:text-foreground"
          : "border-white/12 bg-white/6 text-white/70 hover:bg-white/12 hover:text-white backdrop-blur-md",
        className
      )}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={isDark ? "moon" : "sun"}
          initial={{ opacity: 0, rotate: -30, scale: 0.8 }}
          animate={{ opacity: 1, rotate: 0, scale: 1 }}
          exit={{ opacity: 0, rotate: 30, scale: 0.8 }}
          transition={{ duration: 0.15 }}
          className="flex items-center justify-center"
        >
          {isDark ? <Moon size={17} /> : <Sun size={17} />}
        </motion.span>
      </AnimatePresence>
    </button>
  );
}
