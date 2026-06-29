"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { LogIn, Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/lib/i18n/provider";
import { ThemeToggle } from "./theme-toggle";
import { LanguageSwitcher } from "./language-switcher";
import { NavSearchTrigger } from "./nav/nav-search-trigger";
import { NavMegaMenu } from "./nav/nav-mega-menu";
import { NavLink } from "./nav/nav-link";
import { MEGA_MENUS, SIMPLE_NAV_LINKS, SECONDARY_NAV_LINKS } from "./nav/nav-config";

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
    const onScroll = () => setScrolled(window.scrollY > 8);
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
    <motion.header
      initial={false}
      animate={{
        height: scrolled ? 64 : 72,
      }}
      transition={{ duration: 0.2 }}
      className={cn(
        "left-0 right-0 transition-[background,box-shadow,border-color] duration-300",
        stacked ? "relative" : "fixed top-0 z-40",
        lightNav
          ? cn(
              "bg-background/80 backdrop-blur-xl border-b",
              scrolled ? "border-border/80 shadow-md shadow-black/5" : "border-border/50"
            )
          : cn(
              "bg-brand-dark/75 backdrop-blur-xl border-b border-white/10",
              scrolled && "shadow-lg shadow-black/20"
            )
      )}
    >
      <div className="max-w-[1280px] mx-auto px-6 h-full">
        <div className="flex items-center justify-between h-full gap-4">
          {/* Logo + mobile menu */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={onMobileOpen}
              aria-label={t("nav.menu")}
              className={cn(
                "lg:hidden flex items-center justify-center min-h-11 min-w-11 rounded-xl transition-colors duration-200 cursor-pointer",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40",
                lightNav ? "text-muted-foreground hover:bg-muted" : "text-white/80 hover:bg-white/10"
              )}
            >
              <Menu size={20} />
            </button>
            <Link
              href="/"
              className="flex items-center shrink-0 group"
              aria-label="CampusFlow home"
            >
              <Image
                src="/logo_navbar.png"
                alt="CampusFlow"
                width={160}
                height={40}
                priority
                className={cn(
                  "h-8 sm:h-9 lg:h-10 w-auto transition-all duration-300",
                  "group-hover:opacity-90 group-hover:scale-[1.02]",
                  !lightNav && "brightness-0 invert"
                )}
              />
            </Link>
          </div>

          {/* Main navigation — desktop */}
          <nav
            className="hidden lg:flex items-center gap-6 flex-1 justify-center min-w-0"
            aria-label="Main navigation"
          >
            {MEGA_MENUS.map((menu) => (
              <NavMegaMenu key={menu.key} menu={menu} lightNav={lightNav} scrolled={scrolled} />
            ))}
            {SIMPLE_NAV_LINKS.map((link) => (
              <NavLink key={link.key} href={link.href} labelKey={link.labelKey} lightNav={lightNav} />
            ))}
            {SECONDARY_NAV_LINKS.map((link) => (
              <NavLink
                key={link.key}
                href={link.href}
                labelKey={link.labelKey}
                lightNav={lightNav}
                className="hidden xl:flex"
              />
            ))}
          </nav>

          {/* Tablet: condensed mega menus only */}
          <nav className="hidden md:flex lg:hidden items-center gap-4 flex-1 justify-center" aria-label="Main navigation">
            {MEGA_MENUS.slice(0, 3).map((menu) => (
              <NavMegaMenu key={menu.key} menu={menu} lightNav={lightNav} scrolled={scrolled} />
            ))}
            <NavLink href="/interview" labelKey="interview" lightNav={lightNav} />
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-4 shrink-0">
            <NavSearchTrigger onClick={onSearchOpen} lightNav={lightNav} />
            <LanguageSwitcher lightNav={lightNav} />
            <ThemeToggle lightNav={lightNav} scrolled={scrolled} />
            <Link href="/login" className="hidden sm:block">
              <button
                type="button"
                className={cn(
                  "inline-flex items-center justify-center gap-2 h-11 px-6 rounded-xl",
                  "text-sm font-semibold gradient-primary text-brand-foreground",
                  "shadow-md shadow-brand/20 transition-all duration-200 cursor-pointer",
                  "hover:shadow-lg hover:shadow-brand/30 hover:-translate-y-0.5",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/50 focus-visible:ring-offset-2",
                  "active:translate-y-0 active:shadow-md"
                )}
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
