"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu, X, ChevronDown, ChevronLeft, Search, Bookmark, Clock,
  CheckCircle2, LayoutDashboard, GripVertical,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { accentStyles, type AccentKey } from "@/lib/tools/tokens";
import { useLearningStore } from "@/lib/learning-store";

interface SidebarItem {
  name: string;
  href: string;
  sim?: boolean;
}

interface SidebarCategory {
  title: string;
  items: SidebarItem[];
}

export interface SidebarConfig {
  title: string;
  icon: string;
  basePath: string;
  categories: SidebarCategory[];
  accent: AccentKey;
}

const MIN_WIDTH = 220;
const MAX_WIDTH = 320;
const DEFAULT_WIDTH = 272;

export default function SidebarShell({ config, children }: { config: SidebarConfig; children: React.ReactNode }) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [expandedCats, setExpandedCats] = useState<Set<string>>(new Set());
  const [lessonSearch, setLessonSearch] = useState("");
  const [width, setWidth] = useState(DEFAULT_WIDTH);
  const [resizing, setResizing] = useState(false);

  const { recentLessons, bookmarked, isCompleted, addRecentLesson } = useLearningStore();
  const a = accentStyles[config.accent] || accentStyles.indigo;

  const allItems = useMemo(
    () => config.categories.flatMap((c) => c.items.map((i) => ({ ...i, category: c.title }))),
    [config.categories]
  );

  const subjectRecent = recentLessons.filter((r) => r.href.startsWith(config.basePath));
  const subjectBookmarks = allItems.filter((i) => bookmarked.includes(i.href));

  useEffect(() => {
    const activeCat = config.categories.find((c) => c.items.some((i) => pathname === i.href));
    if (activeCat) setExpandedCats((prev) => new Set([...prev, activeCat.title]));
  }, [pathname, config.categories]);

  useEffect(() => {
    const saved = localStorage.getItem(`sidebar-${config.basePath}-collapsed`);
    if (saved === "true") setCollapsed(true);
    const savedWidth = localStorage.getItem(`sidebar-${config.basePath}-width`);
    if (savedWidth) setWidth(Number(savedWidth));
  }, [config.basePath]);

  useEffect(() => {
    localStorage.setItem(`sidebar-${config.basePath}-collapsed`, String(collapsed));
  }, [collapsed, config.basePath]);

  useEffect(() => {
    if (!resizing) localStorage.setItem(`sidebar-${config.basePath}-width`, String(width));
  }, [width, resizing, config.basePath]);

  useEffect(() => setMobileOpen(false), [pathname]);

  useEffect(() => {
    const item = allItems.find((i) => i.href === pathname);
    if (item) addRecentLesson(item.href, item.name);
  }, [pathname, allItems, addRecentLesson]);

  useEffect(() => {
    if (!resizing) return;
    const onMove = (e: MouseEvent) => {
      const next = Math.min(MAX_WIDTH, Math.max(MIN_WIDTH, e.clientX - 80));
      setWidth(next);
    };
    const onUp = () => setResizing(false);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, [resizing]);

  const isActive = (href: string) => pathname === href;
  const closeMobile = useCallback(() => setMobileOpen(false), []);

  const toggleCat = (title: string) => {
    setExpandedCats((prev) => {
      const next = new Set(prev);
      if (next.has(title)) next.delete(title);
      else next.add(title);
      return next;
    });
  };

  const filterItems = (items: SidebarItem[]) => {
    if (!lessonSearch) return items;
    const q = lessonSearch.toLowerCase();
    return items.filter((i) => i.name.toLowerCase().includes(q));
  };

  const renderLessonLink = (item: SidebarItem, onClick?: () => void) => {
    const active = isActive(item.href);
    const completed = isCompleted(item.href);
    return (
      <Link
        key={item.href}
        href={item.href}
        onClick={onClick}
        className={cn(
          "group flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-all min-h-[44px]",
          active
            ? `bg-gradient-to-r ${a.gradient} text-white shadow-md`
            : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/10"
        )}
      >
        {completed ? (
          <CheckCircle2 size={14} className={cn("shrink-0", active ? "text-white" : "text-[#22C55E]")} aria-hidden />
        ) : (
          <span className={cn("w-1.5 h-1.5 rounded-full shrink-0", active ? "bg-white" : "bg-slate-300 group-hover:bg-[#6D5DF6]")} />
        )}
        <span className="truncate flex-1">{item.name}</span>
        {item.sim && (
          <span className={cn("text-[10px] font-bold px-1.5 py-0.5 rounded-md shrink-0", active ? "bg-white/20 text-white" : "bg-amber-50 text-amber-600 dark:bg-amber-500/10")}>
            SIM
          </span>
        )}
      </Link>
    );
  };

  const sidebarContent = (onClickLink?: () => void) => (
    <>
      <div className="p-4 border-b border-[#E5E7EB] dark:border-white/10 shrink-0">
        <Link href={config.basePath} onClick={onClickLink} className="flex items-center gap-3 group">
          <div className={cn("w-10 h-10 rounded-xl bg-gradient-to-br flex items-center justify-center shadow-lg", a.gradient)}>
            <span className="text-white font-bold text-xs">{config.icon}</span>
          </div>
          {!collapsed && (
            <span className="font-bold text-slate-900 dark:text-white text-sm tracking-tight">{config.title}</span>
          )}
        </Link>
      </div>

      {!collapsed && (
        <div className="px-3 pt-3 shrink-0">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" aria-hidden />
            <input
              value={lessonSearch}
              onChange={(e) => setLessonSearch(e.target.value)}
              placeholder="Search lessons..."
              aria-label="Search lessons"
              className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-100 dark:bg-white/5 border border-transparent focus:border-[#6D5DF6]/30 text-sm outline-none min-h-[44px]"
            />
          </div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        <Link
          href={config.basePath}
          onClick={onClickLink}
          className={cn(
            "flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-semibold min-h-[44px] transition-all",
            isActive(config.basePath)
              ? `${a.bg} ${a.text}`
              : "text-slate-500 hover:bg-slate-100 dark:hover:bg-white/10"
          )}
        >
          <LayoutDashboard size={16} aria-hidden />
          {!collapsed && "Dashboard"}
        </Link>

        {!collapsed && subjectBookmarks.length > 0 && !lessonSearch && (
          <div className="pt-2">
            <p className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
              <Bookmark size={10} aria-hidden /> Bookmarked
            </p>
            {subjectBookmarks.slice(0, 4).map((item) => renderLessonLink(item, onClickLink))}
          </div>
        )}

        {!collapsed && subjectRecent.length > 0 && !lessonSearch && (
          <div className="pt-2">
            <p className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
              <Clock size={10} aria-hidden /> Recent
            </p>
            {subjectRecent.slice(0, 3).map((r) => renderLessonLink({ name: r.title, href: r.href }, onClickLink))}
          </div>
        )}

        {config.categories.map((cat) => {
          const items = filterItems(cat.items);
          if (lessonSearch && items.length === 0) return null;
          const isExpanded = expandedCats.has(cat.title) || !!lessonSearch;
          const catHasActive = cat.items.some((i) => isActive(i.href));

          return (
            <div key={cat.title} className="pt-1">
              {!collapsed && (
                <button
                  onClick={() => toggleCat(cat.title)}
                  aria-expanded={isExpanded}
                  className={cn(
                    "w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold uppercase tracking-wide min-h-[44px] cursor-pointer transition-colors",
                    catHasActive ? a.text : "text-slate-500 hover:bg-slate-100 dark:hover:bg-white/10"
                  )}
                >
                  <span className="truncate">{cat.title}</span>
                  <motion.div animate={{ rotate: isExpanded ? 180 : 0 }}>
                    <ChevronDown size={14} aria-hidden />
                  </motion.div>
                </button>
              )}
              <AnimatePresence initial={false}>
                {isExpanded && !collapsed && (
                  <motion.div
                    initial={collapsed ? false : { height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className={cn("space-y-0.5", !collapsed && "mt-1 ml-1")}>
                      {items.map((item) => renderLessonLink(item, onClickLink))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      <div className="p-3 border-t border-[#E5E7EB] dark:border-white/10 shrink-0">
        <Link
          href="/tools"
          onClick={onClickLink}
          className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm text-slate-500 hover:text-[#6D5DF6] hover:bg-slate-100 dark:hover:bg-white/10 transition-all min-h-[44px]"
        >
          <ChevronLeft size={16} aria-hidden />
          {!collapsed && "Back to Hub"}
        </Link>
      </div>
    </>
  );

  return (
    <div className="flex min-h-0 flex-1">
      {/* Desktop sidebar */}
      <motion.aside
        animate={{ width: collapsed ? 72 : width }}
        className="hidden md:flex flex-col shrink-0 relative rounded-2xl bg-white/70 dark:bg-white/5 backdrop-blur-xl border border-[#E5E7EB]/80 dark:border-white/10 overflow-hidden shadow-sm m-3 ml-0"
      >
        {sidebarContent()}
        {!collapsed && (
          <button
            onMouseDown={() => setResizing(true)}
            aria-label="Resize sidebar"
            className="absolute right-0 top-0 bottom-0 w-1.5 cursor-col-resize hover:bg-[#6D5DF6]/20 transition-colors flex items-center justify-center group"
          >
            <GripVertical size={12} className="text-slate-300 opacity-0 group-hover:opacity-100" />
          </button>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-8 w-6 h-8 bg-white dark:bg-slate-800 border border-[#E5E7EB] dark:border-white/10 rounded-r-lg flex items-center justify-center shadow-sm hover:bg-slate-50 transition-all cursor-pointer z-10"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <ChevronLeft size={12} className={cn("text-slate-400 transition-transform", collapsed && "rotate-180")} />
        </button>
      </motion.aside>

      {/* Mobile trigger */}
      <div className="md:hidden fixed bottom-6 left-4 z-30">
        <button
          onClick={() => setMobileOpen(true)}
          aria-label="Open course navigation"
          className="p-4 rounded-2xl shadow-xl bg-gradient-to-r from-[#6D5DF6] to-[#8B5CF6] text-white cursor-pointer min-h-[44px] min-w-[44px]"
        >
          <Menu size={20} />
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="md:hidden fixed inset-0 bg-slate-900/50 z-40 backdrop-blur-sm" onClick={closeMobile} />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 300 }}
              className="md:hidden fixed left-0 top-0 h-full z-50 w-[min(300px,90vw)] bg-white dark:bg-[#0F172A] border-r border-[#E5E7EB] dark:border-white/10 shadow-2xl flex flex-col"
            >
              <div className="p-4 border-b flex justify-between items-center">
                <span className="font-bold text-slate-900 dark:text-white">{config.title}</span>
                <button onClick={closeMobile} aria-label="Close" className="p-2 rounded-xl min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer">
                  <X size={18} />
                </button>
              </div>
              <div className="flex flex-col flex-1 overflow-hidden">{sidebarContent(closeMobile)}</div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <main className="flex-1 min-w-0">{children}</main>
    </div>
  );
}
