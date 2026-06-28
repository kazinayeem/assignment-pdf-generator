"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { LogIn, Menu, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { NAV_LINKS } from "@/lib/landing-data";
import { ThemeToggle } from "./theme-toggle";

type LandingNavbarProps = {
  onSearchOpen: () => void;
  onMobileOpen: () => void;
};

export function LandingNavbar({ onSearchOpen, onMobileOpen }: LandingNavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

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
        "fixed top-0 left-0 right-0 z-40 transition-all duration-500",
        scrolled
          ? "bg-white/80 dark:bg-[#0F172A]/80 backdrop-blur-xl border-b border-slate-200/60 dark:border-white/10 shadow-sm"
          : "bg-transparent border-b border-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-[72px]">
          <div className="flex items-center gap-3">
            <button
              onClick={onMobileOpen}
              aria-label="Open menu"
              className={cn(
                "md:hidden flex items-center justify-center min-h-[44px] min-w-[44px] rounded-xl transition-colors cursor-pointer",
                scrolled
                  ? "text-slate-600 hover:bg-slate-100"
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

          <nav className="hidden md:flex items-center gap-1" aria-label="Main navigation">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "relative px-4 py-2 rounded-xl text-sm font-medium transition-colors min-h-[44px] flex items-center",
                    scrolled
                      ? isActive
                        ? "text-[#6D5DF6] bg-[#6D5DF6]/8"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-300 dark:hover:text-white dark:hover:bg-white/10"
                      : isActive
                        ? "text-white bg-white/15"
                        : "text-white/75 hover:text-white hover:bg-white/10"
                  )}
                >
                  {link.name}
                  {isActive && (
                    <motion.span
                      layoutId="nav-active"
                      className="absolute inset-0 rounded-xl bg-[#6D5DF6]/10 -z-10"
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
              aria-label="Search tools"
              className={cn(
                "hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl text-sm transition-colors cursor-pointer min-h-[44px]",
                scrolled
                  ? "bg-slate-100 hover:bg-slate-200 text-slate-500 dark:bg-white/10 dark:hover:bg-white/15 dark:text-slate-300"
                  : "bg-white/10 hover:bg-white/20 text-white/70"
              )}
            >
              <Search size={16} aria-hidden />
              <span className="hidden lg:inline">Search</span>
            </button>
            <button
              onClick={onSearchOpen}
              aria-label="Search tools"
              className={cn(
                "sm:hidden flex items-center justify-center min-h-[44px] min-w-[44px] rounded-xl transition-colors cursor-pointer",
                scrolled
                  ? "text-slate-500 hover:bg-slate-100"
                  : "text-white/70 hover:bg-white/10"
              )}
            >
              <Search size={18} />
            </button>
            <ThemeToggle scrolled={scrolled} />
            <Link href="/login" className="hidden sm:block">
              <button
                className="btn-premium flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#6D5DF6] to-[#8B5CF6] text-white text-sm font-semibold hover:shadow-lg hover:shadow-[#6D5DF6]/30 transition cursor-pointer min-h-[44px]"
              >
                <LogIn size={16} aria-hidden />
                Sign In
              </button>
            </Link>
          </div>
        </div>
      </div>
    </motion.header>
  );
}
