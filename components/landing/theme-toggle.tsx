"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/lib/i18n/provider";

export function ThemeToggle({ className, scrolled }: { className?: string; scrolled?: boolean }) {
  const { theme, setTheme } = useTheme();
  const { t } = useTranslation("common");
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <button
        aria-label="Toggle theme"
        className={cn(
          "flex h-11 w-11 items-center justify-center rounded-xl transition-colors",
          scrolled ? "text-muted-foreground hover:bg-muted" : "text-white/70 hover:bg-white/10",
          className
        )}
      />
    );
  }

  const isDark = theme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={isDark ? t("theme.light") : t("theme.dark")}
      className={cn(
        "flex h-11 w-11 items-center justify-center rounded-xl transition-colors cursor-pointer",
        scrolled
          ? "text-muted-foreground hover:bg-muted hover:text-foreground"
          : "text-white/70 hover:bg-white/10 hover:text-white",
        className
      )}
    >
      {isDark ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
}
