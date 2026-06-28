"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { LogIn, Menu, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/lib/i18n/provider";
import { ThemeToggle } from "./theme-toggle";
import { LanguageSwitcher } from "./language-switcher";

const NAV_ITEMS = [
  { key: "tools", href: "/tools" },
  { key: "interview", href: "/interview" },
  { key: "career", href: "/career" },
  { key: "calculators", href: "/calculators" },
  { key: "devtools", href: "/developer-tools" },
  { key: "assignment", href: "/assignment" },
  { key: "cvBuilder", href: "/cv-builder" },
  { key: "labReport", href: "/lab-report" },
] as const;

type LandingNavbarProps = {
  onSearchOpen: () => void;
  onMobileOpen: () => void;
  /** When true, navbar is inside the fixed header stack (not independently fixed). */
  stacked?: boolean;
};

export function LandingNavbar({ onSearchOpen, onMobileOpen, stacked = false }: LandingNavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const { t } = useTranslation("common");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={cn(
        "left-0 right-0 transition-all duration-500",
        stacked ? "relative" : "fixed top-0 z-40",
        scrolled
          ? "bg-background/80 backdrop-blur-xl border-b border-border shadow-sm"
          : "bg-transparent border-b border-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-[72px]">
          <div className="flex items-center gap-3">
            <button
              onClick={onMobileOpen}
              aria-label={t("nav.menu")}
              className={cn(
                "md:hidden flex items-center justify-center min-h-[44px] min-w-[44px] rounded-xl transition-colors cursor-pointer",
                scrolled
                  ? "text-muted-foreground hover:bg-muted"
                  : "text-white/80 hover:bg-white/10"
              )}
            >
              <Menu size={22} />
            </button>
            <Link href="/" className="flex items-center shrink-0" aria-label="CampusFlow home">
              <Image
                src="/logo_navbar.png"
                alt="CampusFlow"
                width={160}
                height={40}
                priority
                className={cn(
                  "h-8 sm:h-9 w-auto transition-all duration-300",
                  !scrolled && "brightness-0 invert"
                )}
              />
            </Link>
          </div>

          <nav className="hidden lg:flex items-center gap-0.5" aria-label="Main navigation">
            {NAV_ITEMS.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "relative px-3 py-2 rounded-xl text-sm font-medium transition-colors min-h-[44px] flex items-center",
                    scrolled
                      ? isActive
                        ? "text-brand bg-brand/10"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                      : isActive
                        ? "text-white bg-white/15"
                        : "text-white/75 hover:text-white hover:bg-white/10"
                  )}
                >
                  {t(`nav.${link.key}`)}
                  {isActive && (
                    <motion.span
                      layoutId="nav-active"
                      className="absolute inset-0 rounded-xl bg-brand/10 -z-10"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-1 sm:gap-2">
            <button
              onClick={onSearchOpen}
              aria-label={t("nav.search")}
              className={cn(
                "hidden sm:flex items-center gap-2 px-3 py-2 rounded-xl text-sm transition-colors cursor-pointer min-h-[44px]",
                scrolled
                  ? "bg-muted hover:bg-muted/80 text-muted-foreground"
                  : "bg-white/10 hover:bg-white/20 text-white/70"
              )}
            >
              <Search size={16} aria-hidden />
              <span className="hidden xl:inline">{t("nav.search")}</span>
            </button>
            <button
              onClick={onSearchOpen}
              aria-label={t("nav.search")}
              className={cn(
                "sm:hidden flex items-center justify-center min-h-[44px] min-w-[44px] rounded-xl transition-colors cursor-pointer",
                scrolled ? "text-muted-foreground hover:bg-muted" : "text-white/70 hover:bg-white/10"
              )}
            >
              <Search size={18} />
            </button>
            <LanguageSwitcher scrolled={scrolled} compact />
            <ThemeToggle scrolled={scrolled} />
            <Link href="/login" className="hidden sm:block">
              <button
                className="btn-premium flex items-center gap-2 px-5 py-2.5 rounded-xl gradient-primary text-brand-foreground text-sm font-semibold hover:shadow-lg hover:shadow-brand/30 transition cursor-pointer min-h-[44px]"
              >
                <LogIn size={16} aria-hidden />
                {t("nav.signIn")}
              </button>
            </Link>
          </div>
        </div>
      </div>
    </motion.header>
  );
}
