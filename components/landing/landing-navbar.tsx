"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/lib/i18n/provider";
import { ThemeToggle } from "./theme-toggle";
import { LanguageSwitcher } from "./language-switcher";
import { NavSearchTrigger } from "./nav/nav-search-trigger";
import { NavMegaMenu } from "./nav/nav-mega-menu";
import { NavSignInButton } from "./nav/nav-sign-in-button";
import { MEGA_MENUS } from "./nav/nav-config";

type LandingNavbarProps = {
  onSearchOpen: () => void;
  onMobileOpen: () => void;
  stacked?: boolean;
};

export function LandingNavbar({ onSearchOpen, onMobileOpen, stacked = false }: LandingNavbarProps) {
  const [overHero, setOverHero] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const { t } = useTranslation("common");

  useEffect(() => {
    const hero = document.getElementById("hero-section");
    if (!hero) {
      setOverHero(false);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => setOverHero(entry.isIntersecting),
      { threshold: 0, rootMargin: "-72px 0px 0px 0px" }
    );
    observer.observe(hero);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        onSearchOpen();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onSearchOpen]);

  const lightNav = !overHero;

  return (
    <header
      className={cn(
        "left-0 right-0 h-[72px] transition-[background,box-shadow,border-color] duration-300",
        stacked ? "relative" : "fixed top-0 z-40",
        lightNav
          ? cn(
              "bg-background/75 backdrop-blur-xl border-b",
              scrolled ? "border-border/70 shadow-sm shadow-black/[0.04]" : "border-border/40"
            )
          : cn(
              "bg-brand-dark/70 backdrop-blur-xl border-b border-white/10",
              scrolled && "shadow-md shadow-black/15"
            )
      )}
    >
      <div className="max-w-[1280px] mx-auto px-6 h-full">
        <div className="flex items-center justify-between h-full gap-4 min-w-0">
          {/* Left: mobile menu + logo + desktop nav */}
          <div className="flex items-center gap-7 min-w-0 flex-1">
            <button
              type="button"
              onClick={onMobileOpen}
              aria-label={t("nav.menu")}
              className={cn(
                "lg:hidden flex shrink-0 items-center justify-center h-10 w-10 rounded-xl transition-colors duration-200",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40",
                lightNav ? "text-muted-foreground hover:bg-muted/80" : "text-white/80 hover:bg-white/10"
              )}
            >
              <Menu size={20} />
            </button>

            <Link href="/" className="flex items-center gap-2.5 shrink-0 group pl-0" aria-label="CampusFlow home">
              <Image
                src="/logo_navbar.png"
                alt=""
                width={144}
                height={36}
                priority
                className={cn(
                  "h-9 w-auto transition-transform duration-200 group-hover:scale-[1.02]",
                  !lightNav && "brightness-0 invert"
                )}
              />
              <span
                className={cn(
                  "hidden sm:block text-[22px] leading-none font-bold tracking-tight transition-colors",
                  lightNav ? "text-foreground" : "text-white"
                )}
              >
                CampusFlow
              </span>
            </Link>

            <nav
              className="hidden lg:flex items-center gap-7 min-w-0"
              aria-label="Main navigation"
            >
              {MEGA_MENUS.map((menu) => (
                <NavMegaMenu key={menu.key} menu={menu} lightNav={lightNav} />
              ))}
            </nav>

            {/* Tablet: first 4 mega menus */}
            <nav className="hidden md:flex lg:hidden items-center gap-5 min-w-0" aria-label="Main navigation">
              {MEGA_MENUS.slice(0, 4).map((menu) => (
                <NavMegaMenu key={menu.key} menu={menu} lightNav={lightNav} />
              ))}
            </nav>
          </div>

          {/* Right: utilities */}
          <div className="flex items-center gap-4 shrink-0">
            <NavSearchTrigger onClick={onSearchOpen} lightNav={lightNav} />
            <LanguageSwitcher lightNav={lightNav} />
            <ThemeToggle lightNav={lightNav} scrolled={scrolled} />
            <NavSignInButton />
          </div>
        </div>
      </div>
    </header>
  );
}
