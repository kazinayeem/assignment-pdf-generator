"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ChevronDown, ChevronLeft } from "lucide-react";

interface SidebarItem {
  name: string;
  href: string;
  sim?: boolean;
}

interface SidebarCategory {
  title: string;
  items: SidebarItem[];
}

interface SidebarConfig {
  title: string;
  icon: string;
  basePath: string;
  categories: SidebarCategory[];
  accent: "indigo" | "emerald" | "cyan" | "violet" | "blue" | "green";
}

const accentStyles: Record<string, {
  from: string; to: string;
  text: string; bg: string; hoverBg: string; activeText: string; border: string;
}> = {
  indigo: {
    from: "from-indigo-600", to: "to-purple-600",
    text: "text-indigo-600", bg: "bg-indigo-50", hoverBg: "hover:bg-indigo-100",
    activeText: "text-indigo-700", border: "border-indigo-200",
  },
  emerald: {
    from: "from-emerald-600", to: "to-emerald-400",
    text: "text-emerald-600", bg: "bg-emerald-50", hoverBg: "hover:bg-emerald-100",
    activeText: "text-emerald-700", border: "border-emerald-200",
  },
  cyan: {
    from: "from-cyan-600", to: "to-blue-600",
    text: "text-cyan-600", bg: "bg-cyan-50", hoverBg: "hover:bg-cyan-100",
    activeText: "text-cyan-700", border: "border-cyan-200",
  },
  violet: {
    from: "from-violet-600", to: "to-purple-500",
    text: "text-violet-600", bg: "bg-violet-50", hoverBg: "hover:bg-violet-100",
    activeText: "text-violet-700", border: "border-violet-200",
  },
  blue: {
    from: "from-blue-600", to: "to-cyan-500",
    text: "text-blue-600", bg: "bg-blue-50", hoverBg: "hover:bg-blue-100",
    activeText: "text-blue-700", border: "border-blue-200",
  },
  green: {
    from: "from-green-600", to: "to-green-400",
    text: "text-green-600", bg: "bg-green-50", hoverBg: "hover:bg-green-100",
    activeText: "text-green-700", border: "border-green-200",
  },
};

const SIDEBAR_WIDTH = "w-64";
const SIDEBAR_MIN_WIDTH = "min-w-64";

export default function SidebarShell({ config, children }: { config: SidebarConfig; children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [expandedCat, setExpandedCat] = useState<string | null>(null);

  const a = accentStyles[config.accent] || accentStyles.indigo;

  const activeHref = config.categories
    .flatMap((c) => c.items)
    .find((i) => pathname === i.href)?.href;

  const activeCat = config.categories.find((c) =>
    c.items.some((i) => pathname === i.href)
  );

  useEffect(() => {
    if (activeCat) setExpandedCat(activeCat.title);
  }, [activeCat?.title]);

  const isActive = (href: string) => pathname === href;

  const closeMobile = useCallback(() => setMobileOpen(false), []);

  const sidebarContent = (
    <>
      {/* Logo */}
      <div className="p-4 border-b border-slate-200 shrink-0">
        <Link href={config.basePath} className="flex items-center gap-2.5 group">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center bg-gradient-to-br ${a.from} ${a.to} shadow-sm group-hover:shadow-md transition-shadow`}>
            <span className="text-white font-bold text-xs">{config.icon}</span>
          </div>
          <span className="font-bold text-slate-900 text-sm tracking-tight">{config.title}</span>
        </Link>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden p-3 space-y-0.5">
        {/* Dashboard */}
        <Link
          href={config.basePath}
          className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-[11px] font-bold tracking-wide transition-all ${
            isActive(config.basePath)
              ? `${a.bg} ${a.text}`
              : "text-slate-400 hover:bg-slate-100 hover:text-slate-600"
          }`}
        >
          <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
          </svg>
          Dashboard
        </Link>

        {/* Categories */}
        {config.categories.map((cat) => {
          const isExpanded = expandedCat === cat.title;
          const catHasActive = cat.items.some((i) => isActive(i.href));
          return (
            <div key={cat.title} className="pt-2.5 first:pt-0">
              <button
                onClick={() => setExpandedCat(isExpanded ? null : cat.title)}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-[11px] font-semibold tracking-wide transition-all ${
                  catHasActive ? `${a.text}` : "text-slate-500"
                } hover:bg-slate-100 hover:text-slate-700`}
              >
                <span className="truncate">{cat.title}</span>
                <ChevronDown size={12} className={`shrink-0 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`} />
              </button>
              {/* Animated submenu */}
              <div className={`grid transition-all duration-200 ease-in-out ${
                isExpanded ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
              }`}>
                <div className="overflow-hidden">
                  <div className="ml-2 mt-0.5 space-y-0.5 border-l-2 border-slate-100 pl-2">
                    {cat.items.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={`group flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-medium transition-all ${
                          isActive(item.href)
                            ? `${a.bg} ${a.activeText} font-semibold`
                            : "text-slate-400 hover:bg-slate-50 hover:text-slate-600"
                        }`}
                      >
                        <span className={`w-1 h-1 rounded-full shrink-0 transition-all ${
                          isActive(item.href) ? `${a.bg.replace('bg-', 'bg-').replace('-50', '-500')} scale-150` : 'bg-slate-300 group-hover:bg-slate-400'
                        }`} />
                        <span className="truncate">{item.name}</span>
                        {item.sim && (
                          <span className="ml-auto text-[7px] font-bold bg-amber-50 text-amber-600 px-1 py-0.5 rounded shrink-0 border border-amber-200">
                            SIM
                          </span>
                        )}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Back to Tools */}
      <div className="p-3 border-t border-slate-100 shrink-0">
        <Link
          href="/tools"
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all"
        >
          <ChevronLeft size={12} />
          Back to Tools
        </Link>
      </div>
    </>
  );

  return (
    <div className="flex min-h-screen bg-white">
      {/* Desktop sidebar */}
      <aside className={`hidden md:flex flex-col bg-white border-r border-slate-200 overflow-hidden transition-all duration-300 ease-in-out shrink-0 ${
        sidebarCollapsed ? "w-0 border-r-0" : SIDEBAR_WIDTH
      }`}>
        {/* Inner container to maintain width when outer collapses */}
        <div className={`flex flex-col h-full ${SIDEBAR_MIN_WIDTH} ${sidebarCollapsed ? "opacity-0 invisible" : "opacity-100 visible"} transition-all duration-200`}>
          {sidebarContent}
        </div>
      </aside>

      {/* Sidebar toggle button */}
      <button
        onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
        className="hidden md:flex fixed left-0 top-1/2 -translate-y-1/2 z-30 w-5 h-12 bg-white border border-slate-200 rounded-r-lg items-center justify-center hover:bg-slate-50 transition-all shadow-sm cursor-pointer"
        aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        <ChevronLeft size={13} className={`text-slate-300 transition-transform duration-200 ${sidebarCollapsed ? "rotate-180" : ""}`} />
      </button>

      {/* Mobile trigger */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 rounded-lg shadow-md bg-white border border-slate-200 text-slate-500 hover:bg-slate-50 transition-all cursor-pointer"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 bg-black/30 z-40 backdrop-blur-sm" onClick={closeMobile} />
      )}

      {/* Mobile drawer */}
      <aside className={`md:hidden fixed left-0 top-0 h-screen z-50 w-72 bg-white border-r border-slate-200 shadow-xl transition-transform duration-300 ease-in-out ${
        mobileOpen ? "translate-x-0" : "-translate-x-full"
      }`}>
        <div className="flex flex-col h-full">
          <div className="p-4 border-b border-slate-200 flex items-center justify-between shrink-0">
            <Link href={config.basePath} className="flex items-center gap-2.5 group" onClick={closeMobile}>
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center bg-gradient-to-br ${a.from} ${a.to} shadow-sm`}>
                <span className="text-white font-bold text-xs">{config.icon}</span>
              </div>
              <span className="font-bold text-slate-900 text-sm tracking-tight">{config.title}</span>
            </Link>
            <button onClick={closeMobile} className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 cursor-pointer">
              <X size={16} />
            </button>
          </div>

          {/* Mobile scrollable content */}
          <div className="flex-1 overflow-y-auto overflow-x-hidden p-3 space-y-0.5">
            <Link
              href={config.basePath}
              onClick={closeMobile}
              className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-[11px] font-bold tracking-wide transition-all ${
                isActive(config.basePath)
                  ? `${a.bg} ${a.text}`
                  : "text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              }`}
            >
              <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
              Dashboard
            </Link>

            {config.categories.map((cat) => {
              const isExpanded = expandedCat === cat.title;
              const catHasActive = cat.items.some((i) => isActive(i.href));
              return (
                <div key={cat.title} className="pt-2.5 first:pt-0">
                  <button
                    onClick={() => setExpandedCat(isExpanded ? null : cat.title)}
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-[11px] font-semibold tracking-wide transition-all ${
                      catHasActive ? a.text : "text-slate-500"
                    } hover:bg-slate-100 hover:text-slate-700`}
                  >
                    <span className="truncate">{cat.title}</span>
                    <ChevronDown size={12} className={`shrink-0 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`} />
                  </button>
                  <div className={`grid transition-all duration-200 ease-in-out ${
                    isExpanded ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                  }`}>
                    <div className="overflow-hidden">
                      <div className="ml-2 mt-0.5 space-y-0.5 border-l-2 border-slate-100 pl-2">
                        {cat.items.map((item) => (
                          <Link
                            key={item.href}
                            href={item.href}
                            onClick={closeMobile}
                            className={`group flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-medium transition-all ${
                              isActive(item.href)
                                ? `${a.bg} ${a.activeText} font-semibold`
                                : "text-slate-400 hover:bg-slate-50 hover:text-slate-600"
                            }`}
                          >
                            <span className={`w-1 h-1 rounded-full shrink-0 transition-all ${
                              isActive(item.href) ? 'bg-indigo-500 scale-150' : 'bg-slate-300 group-hover:bg-slate-400'
                            }`} />
                            <span className="truncate">{item.name}</span>
                            {item.sim && (
                              <span className="ml-auto text-[7px] font-bold bg-amber-50 text-amber-600 px-1 py-0.5 rounded shrink-0 border border-amber-200">
                                SIM
                              </span>
                            )}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Mobile footer */}
          <div className="p-3 border-t border-slate-100 shrink-0">
            <Link href="/tools" onClick={closeMobile} className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all">
              <ChevronLeft size={12} />
              Back to Tools
            </Link>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 min-w-0 transition-all duration-300">
        {children}
      </main>
    </div>
  );
}
