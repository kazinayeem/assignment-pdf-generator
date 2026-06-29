"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Home, Briefcase, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/landing/theme-toggle";
import { CAREER_TOOLS } from "@/lib/career/tools";
import { getRoadmap } from "@/lib/career/roadmaps";
import { getInterviewSubject } from "@/lib/career/interview";

function getPageTitle(pathname: string): string | null {
  if (pathname === "/career") return null;
  if (pathname === "/career/analytics") return "Career Analytics";
  if (pathname === "/career/interview") return "Interview Prep";
  if (pathname === "/career/interview/mock") return "Mock Interview";
  if (pathname === "/career/roadmaps") return "Career Roadmaps";

  const roadmapMatch = pathname.match(/^\/career\/roadmaps\/([^/]+)$/);
  if (roadmapMatch) return getRoadmap(roadmapMatch[1])?.title ?? "Roadmap";

  const subjectMatch = pathname.match(/^\/career\/interview\/([^/]+)$/);
  if (subjectMatch) return getInterviewSubject(subjectMatch[1])?.title ?? "Subject";

  const tool = CAREER_TOOLS.find((t) => t.href === pathname);
  return tool?.title ?? null;
}

export function CareerNav() {
  const pathname = usePathname();
  const isHub = pathname === "/career";
  const pageTitle = pathname ? getPageTitle(pathname) : null;

  return (
    <header className="sticky top-0 z-50 px-3 sm:px-4 pt-3 pb-2">
      <div className="max-w-[1280px] mx-auto flex items-center gap-2 sm:gap-3 h-14 px-3 sm:px-4 rounded-2xl bg-white/80 dark:bg-background/80 backdrop-blur-xl border border-border/80 dark:border-white/10 shadow-sm">
        <Link href="/" className="flex items-center shrink-0" aria-label="BornoFlow home">
          <Image src="/logo_navbar.png" alt="BornoFlow" width={100} height={26} className="h-7 w-auto hidden sm:block" />
        </Link>

        <nav className="flex items-center gap-1 text-sm text-slate-400 min-w-0" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-brand transition-colors shrink-0 hidden sm:flex items-center gap-1">
            <Home size={14} aria-hidden /> Home
          </Link>
          <ChevronRight size={14} className="shrink-0 hidden sm:block" aria-hidden />
          <Link
            href="/career"
            className={cn("hover:text-brand transition-colors shrink-0 flex items-center gap-1", isHub && "text-brand font-medium")}
          >
            <Briefcase size={14} aria-hidden />
            <span className="hidden sm:inline">Career Hub</span>
            <span className="sm:hidden">Career</span>
          </Link>
          {pageTitle && (
            <>
              <ChevronRight size={14} className="shrink-0" aria-hidden />
              <span className="text-slate-700 dark:text-slate-200 font-medium truncate max-w-[120px] sm:max-w-xs">
                {pageTitle}
              </span>
            </>
          )}
        </nav>

        <div className="flex-1" />
        <ThemeToggle scrolled className="!text-slate-500 dark:!text-slate-300" />
      </div>
    </header>
  );
}
