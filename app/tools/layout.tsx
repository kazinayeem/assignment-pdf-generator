"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  Cpu, Database, BrainCircuit, Network, MemoryStick,
  ShieldAlert, Blocks, Code2, Globe, Menu, X,
  ChevronRight, Home, ChevronLeft, PanelLeftClose, PanelLeft,
  Microchip, GitFork,
} from "lucide-react";

const TOOL_CATEGORIES = [
  { label: "Operating Systems", href: "/tools/os",          icon: Cpu,          color: "text-sky-500" },
  { label: "Data Structures",   href: "/tools/dsa",         icon: Database,     color: "text-violet-500" },
  { label: "Algorithms",        href: "/tools/algorithms",  icon: BrainCircuit, color: "text-emerald-500" },
  { label: "Computer Networks", href: "/tools/network",     icon: Network,      color: "text-blue-500" },
  { label: "Database Systems",  href: "/tools/database",    icon: MemoryStick,  color: "text-orange-500" },
  { label: "Cyber Security",    href: "/tools/security",    icon: ShieldAlert,  color: "text-red-500" },
  { label: "Computer Arch.",    href: "/tools/arch",        icon: Microchip,    color: "text-cyan-500" },
  { label: "Theory of Comp.",   href: "/tools/theory-of-computing", icon: GitFork, color: "text-indigo-500" },
  { label: "Software Eng.",     href: "/tools/swe",         icon: Blocks,       color: "text-indigo-500" },
  { label: "Programming",       href: "/tools/programming", icon: Code2,        color: "text-pink-500" },
  { label: "Web Development",   href: "/tools/web",         icon: Globe,        color: "text-teal-500" },
];

export default function ToolsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + "/");

  useEffect(() => {
    const saved = localStorage.getItem("tools-sidebar-collapsed");
    if (saved === "true") setCollapsed(true);
  }, []);

  useEffect(() => {
    localStorage.setItem("tools-sidebar-collapsed", String(collapsed));
  }, [collapsed]);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Top bar */}
      <header className="sticky top-0 z-50 h-11 bg-white border-b border-gray-100 flex items-center px-3 gap-1.5">
        <button
          onClick={() => setMobileOpen(true)}
          className="lg:hidden p-1.5 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
          aria-label="Open menu"
        >
          <Menu size={16} className="text-gray-500" />
        </button>

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="hidden lg:flex p-1.5 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <PanelLeft size={16} className="text-gray-400" /> : <PanelLeftClose size={16} className="text-gray-400" />}
        </button>

        <Link href="/" className="flex items-center gap-2 shrink-0">
          <Image src="/logo_navbar.png" alt="CampusFlow" width={90} height={22} style={{ height: 22, width: "auto" }} />
        </Link>

        <div className="hidden sm:flex items-center gap-1 text-[10px] text-gray-400 ml-1.5 min-w-0">
          <Link href="/" className="hover:text-gray-700 transition-colors shrink-0">Home</Link>
          <ChevronRight className="w-2.5 h-2.5 shrink-0" />
          <Link href="/tools" className="hover:text-gray-700 transition-colors shrink-0">Tools</Link>
          {pathname !== "/tools" && (
            <>
              <ChevronRight className="w-2.5 h-2.5 shrink-0" />
              <span className="text-gray-700 font-medium truncate">
                {pathname.split("/").filter(Boolean).slice(1).join(" / ")}
              </span>
            </>
          )}
        </div>

        <div className="flex-1 min-w-0" />
        <Link href="/" className="hidden sm:flex items-center gap-1 text-[10px] font-semibold text-gray-400 hover:text-gray-700 transition-colors shrink-0">
          <Home className="w-3 h-3" />
        </Link>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Mobile overlay */}
        {mobileOpen && (
          <div className="fixed inset-0 bg-black/30 z-40 lg:hidden backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
        )}

        {/* Desktop sidebar */}
        <aside className={`hidden lg:flex flex-col bg-white border-r border-gray-100 overflow-hidden transition-all duration-300 ease-in-out shrink-0 ${
          collapsed ? "w-12 border-r-0" : "w-48"
        }`}>
          <div className={`flex flex-col h-full ${collapsed ? "w-12 min-w-12" : "w-48 min-w-48"} transition-all duration-200`}>
            {/* Collapsed mode */}
            {collapsed ? (
              <>
                <div className="flex-1 overflow-y-auto p-1.5 flex flex-col items-center gap-0.5 pt-2">
                  {TOOL_CATEGORIES.map((cat) => {
                    const Icon = cat.icon;
                    const active = isActive(cat.href);
                    return (
                      <Link key={cat.href} href={cat.href}
                        className="relative group flex items-center justify-center w-9 h-9 rounded-lg transition-all"
                        title={cat.label}>
                        <Icon className={`w-4 h-4 ${active ? cat.color : "text-gray-400 group-hover:text-gray-600"}`} />
                        <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-[9px] rounded-md whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 pointer-events-none">
                          {cat.label}
                        </div>
                      </Link>
                    );
                  })}
                </div>
                <div className="p-1.5 border-t border-gray-100 flex justify-center">
                  <p className="text-[7px] text-gray-300">B</p>
                </div>
              </>
            ) : (
              /* Expanded mode */
              <>
                <div className="p-2.5 flex-1 space-y-3">
                  <Link href="/tools"
                    className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-[10px] font-bold transition-all ${
                      pathname === "/tools"
                        ? "bg-gray-900 text-white"
                        : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                    }`}>
                    <BrainCircuit className="w-3.5 h-3.5 shrink-0" />
                    All Tools
                  </Link>

                  <div>
                    <p className="text-[7px] font-black uppercase tracking-[0.15em] text-gray-400 px-2.5 mb-1">
                      CS Topics
                    </p>
                    <nav className="space-y-0.5">
                      {TOOL_CATEGORIES.map((cat) => {
                        const Icon = cat.icon;
                        const active = isActive(cat.href);
                        return (
                          <Link key={cat.href} href={cat.href}
                            className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-[10px] font-semibold transition-all ${
                              active
                                ? "bg-gray-50 text-gray-900"
                                : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                            }`}>
                            <Icon className={`w-3.5 h-3.5 shrink-0 ${active ? cat.color : ""}`} />
                            <span className="truncate">{cat.label}</span>
                          </Link>
                        );
                      })}
                    </nav>
                  </div>
                </div>
                <div className="p-2.5 border-t border-gray-100">
                  <p className="text-[8px] text-gray-400 text-center">Bornosoft</p>
                </div>
              </>
            )}
          </div>
        </aside>

        {/* Mobile drawer */}
        <aside className={`lg:hidden fixed inset-y-0 left-0 top-0 z-50 w-60 bg-white border-r border-gray-100 shadow-xl transition-transform duration-300 ease-in-out ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}>
          <div className="flex flex-col h-full">
            <div className="p-3 border-b border-gray-100 flex items-center justify-between">
              <Link href="/" className="flex items-center gap-2">
                <Image src="/logo_navbar.png" alt="CampusFlow" width={80} height={20} style={{ height: 20, width: "auto" }} />
              </Link>
              <button onClick={() => setMobileOpen(false)} className="p-1 rounded-md hover:bg-gray-100 text-gray-400 cursor-pointer">
                <X size={16} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-2.5 space-y-3">
              <Link href="/tools" onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-[10px] font-bold transition-all ${
                  pathname === "/tools" ? "bg-gray-900 text-white" : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                }`}>
                <BrainCircuit className="w-3.5 h-3.5 shrink-0" />
                All Tools
              </Link>
              <div>
                <p className="text-[7px] font-black uppercase tracking-[0.15em] text-gray-400 px-2.5 mb-1">CS Topics</p>
                <nav className="space-y-0.5">
                  {TOOL_CATEGORIES.map((cat) => {
                    const Icon = cat.icon;
                    const active = isActive(cat.href);
                    return (
                      <Link key={cat.href} href={cat.href} onClick={() => setMobileOpen(false)}
                        className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-[10px] font-semibold transition-all ${
                          active ? "bg-gray-50 text-gray-900" : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                        }`}>
                        <Icon className={`w-3.5 h-3.5 shrink-0 ${active ? cat.color : ""}`} />
                        {cat.label}
                      </Link>
                    );
                  })}
                </nav>
              </div>
            </div>
            <div className="p-2.5 border-t border-gray-100">
              <p className="text-[8px] text-gray-400 text-center">Bornosoft</p>
            </div>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 min-w-0 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
