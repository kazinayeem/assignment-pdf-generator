"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell, BrainCircuit, ChevronRight, Home, LogIn, Menu, Search, X,
  PanelLeftClose, PanelLeft, Pin,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { TOOL_CATEGORIES } from "@/lib/tools/subjects";
import { useLearningStore } from "@/lib/learning-store";
import { accentStyles } from "@/lib/tools/tokens";
import { ThemeToggle } from "@/components/landing/theme-toggle";

function formatBreadcrumb(pathname: string) {
  const parts = pathname.split("/").filter(Boolean).slice(1);
  return parts.map((p) => p.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()));
}

export default function ToolsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [profileOpen, setProfileOpen] = useState(false);
  const { togglePinSubject, isPinnedSubject } = useLearningStore();

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/");
  const crumbs = formatBreadcrumb(pathname);

  useEffect(() => {
    const saved = localStorage.getItem("tools-sidebar-collapsed");
    if (saved === "true") setCollapsed(true);
  }, []);

  useEffect(() => {
    localStorage.setItem("tools-sidebar-collapsed", String(collapsed));
  }, [collapsed]);

  useEffect(() => {
    setMobileOpen(false);
    setProfileOpen(false);
  }, [pathname]);

  const filteredCategories = useMemo(() => {
    if (!searchQuery) return TOOL_CATEGORIES;
    const q = searchQuery.toLowerCase();
    return TOOL_CATEGORIES.filter((c) => c.label.toLowerCase().includes(q));
  }, [searchQuery]);

  const sortedCategories = useMemo(() => {
    const pinned = filteredCategories.filter((c) => isPinnedSubject(c.slug));
    const rest = filteredCategories.filter((c) => !isPinnedSubject(c.slug));
    return [...pinned, ...rest];
  }, [filteredCategories, isPinnedSubject]);

  const sidebarWidth = collapsed ? 72 : 260;

  return (
    <div className="min-h-screen bg-surface-page flex flex-col">
      {/* Floating top navbar */}
      <header className="sticky top-0 z-50 px-3 sm:px-4 pt-3 pb-2">
        <div className="max-w-[1920px] mx-auto flex items-center gap-2 sm:gap-3 h-14 px-3 sm:px-4 rounded-2xl bg-white/80 dark:bg-[#0F172A]/80 backdrop-blur-xl border border-[#E5E7EB]/80 dark:border-white/10 shadow-sm">
          <button
            onClick={() => setMobileOpen(true)}
            className="lg:hidden flex items-center justify-center min-h-[44px] min-w-[44px] rounded-xl hover:bg-slate-100 dark:hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Open menu"
          >
            <Menu size={20} className="text-slate-600 dark:text-slate-300" />
          </button>

          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden lg:flex items-center justify-center min-h-[44px] min-w-[44px] rounded-xl hover:bg-slate-100 dark:hover:bg-white/10 transition-colors cursor-pointer"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? <PanelLeft size={18} className="text-slate-400" /> : <PanelLeftClose size={18} className="text-slate-400" />}
          </button>

          <Link href="/" className="flex items-center shrink-0" aria-label="CampusFlow home">
            <Image src="/logo_navbar.png" alt="CampusFlow" width={120} height={30} className="h-7 w-auto" />
          </Link>

          <nav className="hidden md:flex items-center gap-1 text-sm text-slate-400 min-w-0" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-[#6D5DF6] transition-colors shrink-0 flex items-center gap-1">
              <Home size={14} aria-hidden /> Home
            </Link>
            <ChevronRight size={14} className="shrink-0" aria-hidden />
            <Link href="/tools" className={cn("hover:text-[#6D5DF6] transition-colors shrink-0", pathname === "/tools" && "text-[#6D5DF6] font-medium")}>
              Learning Hub
            </Link>
            {crumbs.length > 0 && (
              <>
                <ChevronRight size={14} className="shrink-0" aria-hidden />
                <span className="text-slate-700 dark:text-slate-200 font-medium truncate">
                  {crumbs.join(" / ")}
                </span>
              </>
            )}
          </nav>

          <div className="flex-1 min-w-0" />

          <div className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 dark:bg-white/10 text-slate-400 max-w-[200px] lg:max-w-xs">
            <Search size={15} aria-hidden />
            <input
              placeholder="Search subjects..."
              aria-label="Search subjects"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-none outline-none text-sm text-slate-700 dark:text-white placeholder:text-slate-400 w-full min-w-0"
            />
          </div>

          <button aria-label="Notifications" className="hidden sm:flex items-center justify-center min-h-[44px] min-w-[44px] rounded-xl hover:bg-slate-100 dark:hover:bg-white/10 text-slate-500 transition-colors cursor-pointer relative">
            <Bell size={18} />
            <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-[#EF4444]" aria-hidden />
          </button>

          <ThemeToggle scrolled className="!text-slate-500 dark:!text-slate-300" />

          <div className="relative">
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              aria-label="Profile menu"
              aria-expanded={profileOpen}
              className="flex items-center justify-center min-h-[44px] min-w-[44px] rounded-xl bg-gradient-to-br from-[#6D5DF6] to-[#8B5CF6] text-white text-sm font-bold shadow-md cursor-pointer"
            >
              CF
            </button>
            <AnimatePresence>
              {profileOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.96 }}
                  className="absolute right-0 top-full mt-2 w-48 rounded-2xl bg-white dark:bg-slate-900 border border-[#E5E7EB] dark:border-white/10 shadow-xl overflow-hidden z-50"
                >
                  <Link href="/login" className="flex items-center gap-2 px-4 py-3 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-white/5 min-h-[44px]">
                    <LogIn size={16} aria-hidden /> Sign In
                  </Link>
                  <Link href="/student/dashboard" className="flex items-center gap-2 px-4 py-3 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-white/5 min-h-[44px]">
                    Dashboard
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden max-w-[1920px] mx-auto w-full px-3 sm:px-4 pb-4 gap-3">
        {/* Desktop sidebar */}
        <motion.aside
          animate={{ width: sidebarWidth }}
          transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
          className="hidden lg:flex flex-col shrink-0 rounded-2xl bg-white/70 dark:bg-white/5 backdrop-blur-xl border border-[#E5E7EB]/80 dark:border-white/10 overflow-hidden shadow-sm"
        >
          <div className="flex flex-col h-full overflow-hidden" style={{ width: sidebarWidth }}>
            {!collapsed ? (
              <>
                <div className="p-4 border-b border-[#E5E7EB] dark:border-white/10">
                  <Link
                    href="/tools"
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all min-h-[44px]",
                      pathname === "/tools"
                        ? "bg-gradient-to-r from-[#6D5DF6] to-[#8B5CF6] text-white shadow-md"
                        : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10"
                    )}
                  >
                    <BrainCircuit size={18} aria-hidden />
                    Learning Hub
                  </Link>
                </div>

                <div className="flex-1 overflow-y-auto p-3 space-y-1">
                  <p className="px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                    Subjects
                  </p>
                  {sortedCategories.map((cat) => {
                    const Icon = cat.icon;
                    const active = isActive(cat.href);
                    const accent = accentStyles[cat.accent];
                    const pinned = isPinnedSubject(cat.slug);
                    return (
                      <div key={cat.href} className="group relative">
                        <Link
                          href={cat.href}
                          className={cn(
                            "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all min-h-[44px]",
                            active
                              ? `${accent.bg} ${accent.text} ring-1 ${accent.ring}`
                              : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/10"
                          )}
                        >
                          <div className={cn("w-8 h-8 rounded-lg bg-gradient-to-br flex items-center justify-center shrink-0", accent.gradient)}>
                            <Icon size={16} className="text-white" aria-hidden />
                          </div>
                          <span className="truncate flex-1">{cat.label}</span>
                          {pinned && <Pin size={12} className="text-[#6D5DF6] fill-[#6D5DF6] shrink-0" aria-hidden />}
                        </Link>
                        <button
                          onClick={() => togglePinSubject(cat.slug)}
                          aria-label={pinned ? "Unpin subject" : "Pin subject"}
                          className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-slate-200 dark:hover:bg-white/10 transition-all cursor-pointer"
                        >
                          <Pin size={12} className={cn(pinned ? "text-[#6D5DF6] fill-[#6D5DF6]" : "text-slate-400")} />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </>
            ) : (
              <div className="flex-1 overflow-y-auto p-2 flex flex-col items-center gap-1 pt-4">
                <Link href="/tools" title="Learning Hub" className="w-10 h-10 rounded-xl flex items-center justify-center hover:bg-slate-100 dark:hover:bg-white/10 mb-2">
                  <BrainCircuit size={18} className="text-[#6D5DF6]" />
                </Link>
                {sortedCategories.map((cat) => {
                  const Icon = cat.icon;
                  const active = isActive(cat.href);
                  const accent = accentStyles[cat.accent];
                  return (
                    <Link key={cat.href} href={cat.href} title={cat.label}
                      className={cn("w-10 h-10 rounded-xl flex items-center justify-center transition-all", active ? accent.bg : "hover:bg-slate-100 dark:hover:bg-white/10")}>
                      <Icon size={18} className={active ? accent.text : "text-slate-400"} aria-hidden />
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </motion.aside>

        {/* Mobile drawer */}
        <AnimatePresence>
          {mobileOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="lg:hidden fixed inset-0 bg-slate-900/50 z-40 backdrop-blur-sm"
                onClick={() => setMobileOpen(false)}
                aria-hidden
              />
              <motion.aside
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{ type: "spring", damping: 28, stiffness: 300 }}
                className="lg:hidden fixed left-3 top-20 bottom-3 z-50 w-[min(300px,85vw)] rounded-2xl bg-white dark:bg-[#0F172A] border border-[#E5E7EB] dark:border-white/10 shadow-2xl overflow-hidden flex flex-col"
              >
                <div className="p-4 border-b border-[#E5E7EB] dark:border-white/10 flex items-center justify-between">
                  <span className="font-bold text-slate-900 dark:text-white">Subjects</span>
                  <button onClick={() => setMobileOpen(false)} aria-label="Close menu" className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-white/10 min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer">
                    <X size={18} />
                  </button>
                </div>
                <div className="flex-1 overflow-y-auto p-3 space-y-1">
                  <Link href="/tools" onClick={() => setMobileOpen(false)}
                    className={cn("flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-semibold min-h-[44px]", pathname === "/tools" ? "bg-[#6D5DF6]/10 text-[#6D5DF6]" : "text-slate-600")}>
                    <BrainCircuit size={18} aria-hidden /> Learning Hub
                  </Link>
                  {sortedCategories.map((cat) => {
                    const Icon = cat.icon;
                    const active = isActive(cat.href);
                    const accent = accentStyles[cat.accent];
                    return (
                      <Link key={cat.href} href={cat.href} onClick={() => setMobileOpen(false)}
                        className={cn("flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium min-h-[44px]", active ? `${accent.bg} ${accent.text}` : "text-slate-600 dark:text-slate-300")}>
                        <div className={cn("w-8 h-8 rounded-lg bg-gradient-to-br flex items-center justify-center", accent.gradient)}>
                          <Icon size={16} className="text-white" aria-hidden />
                        </div>
                        {cat.label}
                      </Link>
                    );
                  })}
                </div>
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        <main id="main-content" className="flex-1 min-w-0 overflow-y-auto rounded-2xl">
          {children}
        </main>
      </div>
    </div>
  );
}
