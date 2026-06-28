"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Home, BookOpen, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/landing/theme-toggle";

export function KnowledgeNav() {
  const pathname = usePathname();
  const isHub = pathname === "/interview";

  return (
    <header className="sticky top-0 z-50 px-3 sm:px-4 pt-3 pb-2">
      <div className="max-w-[1400px] mx-auto flex items-center gap-2 sm:gap-3 h-14 px-3 sm:px-4 rounded-2xl bg-white/80 dark:bg-[#0F172A]/80 backdrop-blur-xl border border-[#E5E7EB]/80 dark:border-white/10 shadow-sm">
        <Link href="/" className="flex items-center shrink-0" aria-label="CampusFlow home">
          <Image src="/logo_navbar.png" alt="CampusFlow" width={100} height={26} className="h-7 w-auto hidden sm:block" />
        </Link>
        <nav className="flex items-center gap-1 text-sm text-slate-400 min-w-0" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-[#6D5DF6] transition-colors shrink-0 hidden sm:flex items-center gap-1">
            <Home size={14} aria-hidden /> Home
          </Link>
          <ChevronRight size={14} className="shrink-0 hidden sm:block" aria-hidden />
          <Link href="/interview" className={cn("hover:text-[#6D5DF6] transition-colors shrink-0 flex items-center gap-1", isHub && "text-[#6D5DF6] font-medium")}>
            <BookOpen size={14} aria-hidden />
            <span className="hidden sm:inline">Interview KB</span>
            <span className="sm:hidden">KB</span>
          </Link>
        </nav>
        <div className="flex-1" />
        <Link href="/interview/search" className="text-sm text-slate-500 hover:text-[#6D5DF6] hidden sm:block min-h-[44px] flex items-center">Search</Link>
        <ThemeToggle scrolled className="!text-slate-500 dark:!text-slate-300" />
      </div>
    </header>
  );
}
