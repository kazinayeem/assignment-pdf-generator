"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Home, GraduationCap, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/lib/i18n/provider";
import { ThemeToggle } from "@/components/landing/theme-toggle";
import { LanguageSwitcher } from "@/components/landing/language-switcher";
import { getUniversity } from "@/lib/universities";

const HUB_LINKS = [
  { key: "explore", href: "/universities" },
  { key: "compare", href: "/universities/compare" },
  { key: "predictor", href: "/universities/predictor" },
  { key: "calculator", href: "/universities/calculator" },
  { key: "scholarships", href: "/universities/scholarships" },
  { key: "recommend", href: "/universities/recommend" },
] as const;

function getPageTitle(pathname: string): string | null {
  if (pathname === "/universities") return null;
  if (pathname === "/universities/compare") return "compare";
  if (pathname === "/universities/calculator") return "calculator";
  if (pathname === "/universities/predictor") return "predictor";
  if (pathname === "/universities/scholarships") return "scholarships";
  if (pathname === "/universities/recommend") return "recommend";
  const match = pathname.match(/^\/universities\/([^/]+)$/);
  if (match) return getUniversity(match[1])?.shortName ?? null;
  return null;
}

export function UniversitiesNav() {
  const pathname = usePathname();
  const { t } = useTranslation("universities");
  const isHub = pathname === "/universities";
  const pageTitle = pathname ? getPageTitle(pathname) : null;

  return (
    <header className="sticky top-0 z-50 px-3 sm:px-4 pt-3 pb-2">
      <div className="max-w-[1280px] mx-auto flex items-center gap-2 sm:gap-3 h-14 px-3 sm:px-4 rounded-2xl bg-background/80 backdrop-blur-xl border border-border shadow-sm">
        <Link href="/" className="flex items-center shrink-0" aria-label="CampusFlow home">
          <Image src="/logo_navbar.png" alt="CampusFlow" width={100} height={26} className="h-7 w-auto hidden sm:block" />
        </Link>

        <nav className="flex items-center gap-1 text-sm text-muted-foreground min-w-0" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-brand transition-colors shrink-0 hidden sm:flex items-center gap-1">
            <Home size={14} aria-hidden /> Home
          </Link>
          <ChevronRight size={14} className="shrink-0 hidden sm:block" aria-hidden />
          <Link
            href="/universities"
            className={cn("hover:text-brand transition-colors shrink-0 flex items-center gap-1", isHub && "text-brand font-medium")}
          >
            <GraduationCap size={14} aria-hidden />
            <span className="hidden sm:inline">{t("nav.hub")}</span>
            <span className="sm:hidden">Unis</span>
          </Link>
          {pageTitle && (
            <>
              <ChevronRight size={14} className="shrink-0" aria-hidden />
              <span className="text-foreground font-medium truncate max-w-[100px] sm:max-w-xs">
                {pageTitle === "compare" || pageTitle === "calculator" || pageTitle === "recommend" || pageTitle === "predictor" || pageTitle === "scholarships"
                  ? t(`nav.${pageTitle}`)
                  : pageTitle}
              </span>
            </>
          )}
        </nav>

        <nav className="hidden lg:flex items-center gap-1 ml-4" aria-label="University Hub">
          {HUB_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-medium transition-colors min-h-[36px] flex items-center",
                pathname === link.href
                  ? "bg-brand/10 text-brand"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
            >
              {t(`nav.${link.key}`)}
            </Link>
          ))}
        </nav>

        <div className="flex-1" />
        <LanguageSwitcher scrolled compact />
        <ThemeToggle scrolled />
      </div>
    </header>
  );
}
