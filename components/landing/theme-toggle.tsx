"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";

export function ThemeToggle({ className, scrolled }: { className?: string; scrolled?: boolean }) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <button
        aria-label="Toggle theme"
        className={cn(
          "flex h-11 w-11 items-center justify-center rounded-xl transition-colors",
          scrolled
            ? "text-slate-500 hover:bg-slate-100"
            : "text-white/70 hover:bg-white/10",
          className
        )}
      />
    );
  }

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
      className={cn(
        "flex h-11 w-11 items-center justify-center rounded-xl transition-colors cursor-pointer",
        scrolled
          ? "text-slate-500 hover:bg-slate-100 hover:text-slate-800"
          : "text-white/70 hover:bg-white/10 hover:text-white",
        className
      )}
    >
      {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
}
