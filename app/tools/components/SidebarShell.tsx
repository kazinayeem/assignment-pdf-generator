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

const accentStyles: Record<string, { from: string; to: string; text: string; bg: string; hoverBg: string; activeText: string }> = {
  indigo:  { from: "from-indigo-600", to: "to-purple-600", text: "text-indigo-600", bg: "bg-indigo-50", hoverBg: "hover:bg-indigo-100", activeText: "text-indigo-700" },
  emerald: { from: "from-emerald-600", to: "to-emerald-400", text: "text-emerald-600", bg: "bg-emerald-50", hoverBg: "hover:bg-emerald-100", activeText: "text-emerald-700" },
  cyan:    { from: "from-cyan-600", to: "to-blue-600", text: "text-cyan-600", bg: "bg-cyan-50", hoverBg: "hover:bg-cyan-100", activeText: "text-cyan-700" },
  violet:  { from: "from-violet-600", to: "to-purple-500", text: "text-violet-600", bg: "bg-violet-50", hoverBg: "hover:bg-violet-100", activeText: "text-violet-700" },
  blue:    { from: "from-blue-600", to: "to-cyan-500", text: "text-blue-600", bg: "bg-blue-50", hoverBg: "hover:bg-blue-100", activeText: "text-blue-700" },
  green:   { from: "from-green-600", to: "to-green-400", text: "text-green-600", bg: "bg-green-50", hoverBg: "hover:bg-green-100", activeText: "text-green-700" },
};

export default function SidebarShell({ config, children }: { config: SidebarConfig; children: React.ReactNode }) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [expandedCat, setExpandedCat] = useState<string | null>(null);

  const a = accentStyles[config.accent] || accentStyles.indigo;
  const activeCat = config.categories.find((c) => c.items.some((i) => pathname === i.href));

  useEffect(() => {
    if (activeCat) setExpandedCat(activeCat.title);
  }, [activeCat?.title]);

  useEffect(() => {
    const saved = localStorage.getItem(`sidebar-${config.basePath}-collapsed`);
    if (saved === "true") setCollapsed(true);
  }, [config.basePath]);

  useEffect(() => {
    localStorage.setItem(`sidebar-${config.basePath}-collapsed`, String(collapsed));
  }, [collapsed, config.basePath]);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const isActive = (href: string) => pathname === href;
  const closeMobile = useCallback(() => setMobileOpen(false), []);

  const CollapsedIcon = () => (
    <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
    </svg>
  );

  const renderCategoryItems = (cat: SidebarCategory, onClickLink?: () => void) => {
    const isExpanded = expandedCat === cat.title;
    const catHasActive = cat.items.some((i) => isActive(i.href));
    return (
      <div key={cat.title} className="pt-2 first:pt-0">
        <button onClick={() => setExpandedCat(isExpanded ? null : cat.title)}
          className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-[10px] font-semibold tracking-wide transition-all ${
            catHasActive ? a.text : "text-slate-500"
          } hover:bg-slate-100 hover:text-slate-700 cursor-pointer`}>
          <span className="truncate">{cat.title}</span>
          <ChevronDown size={11} className={`shrink-0 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`} />
        </button>
        <div className={`grid transition-all duration-200 ease-in-out ${
          isExpanded ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}>
          <div className="overflow-hidden">
            <div className="ml-2 mt-0.5 space-y-0.5 border-l-2 border-slate-100 pl-1.5">
              {cat.items.map((item) => (
                <Link key={item.href} href={item.href} onClick={onClickLink}
                  className={`group flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-[10px] font-medium transition-all ${
                    isActive(item.href)
                      ? `${a.bg} ${a.activeText} font-semibold`
                      : "text-slate-400 hover:bg-slate-50 hover:text-slate-600"
                  }`}>
                  <span className={`w-1 h-1 rounded-full shrink-0 transition-all ${
                    isActive(item.href) ? "bg-indigo-500 scale-150" : "bg-slate-300 group-hover:bg-slate-400"
                  }`} />
                  <span className="truncate">{item.name}</span>
                  {item.sim && <span className="ml-auto text-[6px] font-bold bg-amber-50 text-amber-600 px-1 py-0.5 rounded shrink-0 border border-amber-200">SIM</span>}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex min-h-0 flex-1">
      {/* Desktop sidebar */}
      <aside className={`hidden md:flex flex-col bg-white border-r border-slate-200 overflow-hidden transition-all duration-300 ease-in-out shrink-0 relative ${
        collapsed ? "w-12 border-r-0" : "w-52"
      }`}>
        <div className={`flex flex-col h-full ${collapsed ? "w-12 min-w-12" : "w-52 min-w-52"} transition-all duration-200`}>
          {collapsed ? (
            <>
              <div className="p-2 border-b border-slate-200 shrink-0 flex justify-center">
                <Link href={config.basePath} title={config.title}>
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center bg-gradient-to-br ${a.from} ${a.to} shadow-sm`}>
                    <span className="text-white font-bold text-[10px]">{config.icon}</span>
                  </div>
                </Link>
              </div>
              <div className="flex-1 overflow-y-auto p-1.5 flex flex-col items-center gap-1">
                <Link href={config.basePath} title="Dashboard"
                  className={`flex items-center justify-center w-8 h-8 rounded-md transition-all ${
                    isActive(config.basePath) ? `${a.bg} ${a.text}` : "text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                  }`}>
                  <CollapsedIcon />
                </Link>
                <div className="w-5 border-t border-slate-200 my-1" />
                {config.categories.map((cat) => (
                  <div key={cat.title} className="relative">
                    <button title={cat.title}
                      onClick={() => setExpandedCat(expandedCat === cat.title ? null : cat.title)}
                      className={`flex items-center justify-center w-8 h-8 rounded-md transition-all ${
                        expandedCat === cat.title ? a.text : "text-slate-400"
                      } hover:bg-slate-100 hover:text-slate-600 cursor-pointer`}>
                      <ChevronDown size={12} className={`transition-transform duration-200 ${expandedCat === cat.title ? "rotate-180" : ""}`} />
                    </button>
                    {expandedCat === cat.title && (
                      <div className="absolute left-full ml-1.5 top-0 bg-white border border-slate-200 rounded-lg shadow-lg p-1.5 min-w-[150px] z-[60]">
                        <p className="text-[9px] font-semibold text-slate-400 px-2 pb-1 mb-1 border-b border-slate-100">{cat.title}</p>
                        {cat.items.map((item) => (
                          <Link key={item.href} href={item.href}
                            className={`flex items-center gap-1.5 px-2 py-1.5 rounded-md text-[10px] font-medium transition-all whitespace-nowrap ${
                              isActive(item.href)
                                ? `${a.bg} ${a.activeText} font-semibold`
                                : "text-slate-500 hover:bg-slate-50 hover:text-slate-700"
                            }`}>
                            <span className={`w-1 h-1 rounded-full shrink-0 ${isActive(item.href) ? "bg-indigo-500" : "bg-slate-300"}`} />
                            {item.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <div className="p-2 border-t border-slate-100 shrink-0 flex justify-center">
                <Link href="/tools" title="Back to Tools" className="flex items-center justify-center w-8 h-8 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all">
                  <ChevronLeft size={11} />
                </Link>
              </div>
            </>
          ) : (
            <>
              <div className="p-3 border-b border-slate-200 shrink-0">
                <Link href={config.basePath} className="flex items-center gap-2.5 group">
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center bg-gradient-to-br ${a.from} ${a.to} shadow-sm group-hover:shadow-md transition-shadow`}>
                    <span className="text-white font-bold text-[10px]">{config.icon}</span>
                  </div>
                  <span className="font-bold text-slate-900 text-xs tracking-tight leading-tight">{config.title}</span>
                </Link>
              </div>
              <div className="flex-1 overflow-y-auto overflow-x-hidden p-2.5 space-y-0.5">
                <Link href={config.basePath}
                  className={`flex items-center gap-2 px-2.5 py-1.5 rounded-md text-[10px] font-bold tracking-wide transition-all ${
                    isActive(config.basePath) ? `${a.bg} ${a.text}` : "text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                  }`}>
                  <CollapsedIcon />
                  <span>Dashboard</span>
                </Link>
                {config.categories.map((cat) => renderCategoryItems(cat))}
              </div>
              <div className="p-2.5 border-t border-slate-100 shrink-0">
                <Link href="/tools" className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-[10px] text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all">
                  <ChevronLeft size={11} />
                  Back to Tools
                </Link>
              </div>
            </>
          )}
        </div>

        {/* Collapse toggle button */}
        <button onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-6 w-5 h-8 bg-white border border-slate-200 rounded-r-lg flex items-center justify-center hover:bg-slate-50 transition-all shadow-sm cursor-pointer z-10"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}>
          <ChevronLeft size={11} className={`text-slate-300 transition-transform duration-200 ${collapsed ? "rotate-180" : ""}`} />
        </button>
      </aside>

      {/* Mobile trigger */}
      <div className="md:hidden fixed top-12 left-2 z-30">
        <button onClick={() => setMobileOpen(!mobileOpen)}
          className="p-1.5 rounded-lg shadow-sm bg-white border border-slate-200 text-slate-500 hover:bg-slate-50 transition-all cursor-pointer">
          {mobileOpen ? <X size={15} /> : <Menu size={15} />}
        </button>
      </div>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 bg-black/25 z-30 backdrop-blur-sm" onClick={closeMobile} />
      )}

      {/* Mobile drawer */}
      <aside className={`md:hidden fixed left-0 top-0 h-screen z-40 w-60 bg-white border-r border-slate-200 shadow-xl transition-transform duration-300 ease-in-out ${
        mobileOpen ? "translate-x-0" : "-translate-x-full"
      }`}>
        <div className="flex flex-col h-full">
          <div className="p-3 border-b border-slate-200 flex items-center justify-between shrink-0">
            <Link href={config.basePath} className="flex items-center gap-2.5 group" onClick={closeMobile}>
              <div className={`w-7 h-7 rounded-lg flex items-center justify-center bg-gradient-to-br ${a.from} ${a.to} shadow-sm`}>
                <span className="text-white font-bold text-[10px]">{config.icon}</span>
              </div>
              <span className="font-bold text-slate-900 text-xs tracking-tight">{config.title}</span>
            </Link>
            <button onClick={closeMobile} className="p-1 rounded-md hover:bg-slate-100 text-slate-400 cursor-pointer">
              <X size={15} />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto overflow-x-hidden p-2.5 space-y-0.5">
            <Link href={config.basePath} onClick={closeMobile}
              className={`flex items-center gap-2 px-2.5 py-1.5 rounded-md text-[10px] font-bold tracking-wide transition-all ${
                isActive(config.basePath) ? `${a.bg} ${a.text}` : "text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              }`}>
              <CollapsedIcon />
              Dashboard
            </Link>
            {config.categories.map((cat) => renderCategoryItems(cat, closeMobile))}
          </div>
          <div className="p-2.5 border-t border-slate-100 shrink-0">
            <Link href="/tools" onClick={closeMobile} className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-[10px] text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all">
              <ChevronLeft size={11} />
              Back to Tools
            </Link>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 min-w-0">
        {children}
      </main>
    </div>
  );
}
