"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Home, Map, ChevronRight, LayoutDashboard } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/lib/i18n/provider";
import { ThemeToggle } from "@/components/landing/theme-toggle";
import { LanguageSwitcher } from "@/components/landing/language-switcher";
import { getRoadmap } from "@/lib/roadmaps";
import { RoadmapExportMenu } from "./roadmap-export-menu";

const NAV_LINKS = [
  { key: "explore", href: "/roadmaps" },
  { key: "dashboard", href: "/roadmaps/dashboard" },
] as const;

function getPageTitle(pathname: string): string | null {
  if (pathname === "/roadmaps") return null;
  if (pathname === "/roadmaps/dashboard") return "dashboard";
  const slug = pathname.replace("/roadmaps/", "");
  if (slug && slug !== "dashboard") {
    return getRoadmap(slug)?.title ?? slug;
  }
  return null;
}

export function RoadmapsNav() {
  const pathname = usePathname();
  const { t } = useTranslation("roadmaps");
  const pageTitle = getPageTitle(pathname ?? "");
  const detailSlug =
    pathname?.startsWith("/roadmaps/") && pathname !== "/roadmaps/dashboard"
      ? pathname.replace("/roadmaps/", "")
      : null;
  const detailRoadmap = detailSlug ? getRoadmap(detailSlug) : null;

  return (
    <header className="sticky top-0 z-50 px-3 sm:px-4 pt-3 pb-2">
      <div className="max-w-[1400px] mx-auto flex items-center gap-2 sm:gap-3 h-14 px-3 sm:px-4 rounded-2xl bg-card/90 backdrop-blur-xl border border-border shadow-sm">
        <Link href="/" className="flex items-center shrink-0" aria-label="CampusFlow home">
          <Home size={18} className="text-muted-foreground sm:hidden" />
          <Image src="/logo_navbar.png" alt="CampusFlow" width={100} height={26} className="h-7 w-auto hidden sm:block" />
        </Link>

        <ChevronRight size={14} className="text-muted-foreground shrink-0 hidden sm:block" aria-hidden />
        <Link href="/roadmaps" className="flex items-center gap-1.5 text-sm font-semibold text-brand shrink-0">
          <Map size={16} aria-hidden />
          <span className="hidden sm:inline">{t("nav.hub")}</span>
        </Link>

        {pageTitle && (
          <>
            <ChevronRight size={14} className="text-muted-foreground shrink-0 hidden sm:block" aria-hidden />
            <span className="text-sm font-medium text-foreground truncate hidden sm:block">
              {pageTitle === "dashboard" ? t("nav.dashboard") : pageTitle}
            </span>
          </>
        )}

        <nav className="hidden md:flex items-center gap-1 ml-4">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors",
                pathname === link.href ? "bg-brand/10 text-brand" : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
            >
              {t(`nav.${link.key}`)}
            </Link>
          ))}
        </nav>

        <div className="flex-1" />

        {detailRoadmap && <RoadmapExportMenu roadmap={detailRoadmap} className="hidden sm:block" />}

        <Link
          href="/roadmaps/dashboard"
          className={cn(
            "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold md:hidden",
            pathname === "/roadmaps/dashboard" ? "bg-brand/10 text-brand" : "text-muted-foreground"
          )}
        >
          <LayoutDashboard size={16} />
        </Link>
        <LanguageSwitcher scrolled compact />
        <ThemeToggle scrolled />
      </div>
    </header>
  );
}
