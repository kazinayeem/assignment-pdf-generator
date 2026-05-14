"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  Cpu, Database, BrainCircuit, Network, MemoryStick,
  ShieldAlert, Blocks, Code2, Globe, Menu, X,
  ChevronRight, Home, ChevronLeft,
} from "lucide-react";

const TOOL_CATEGORIES = [
  { label: "Operating Systems", href: "/tools/os",          icon: Cpu,          color: "text-sky-500" },
  { label: "Data Structures",   href: "/tools/dsa",         icon: Database,     color: "text-violet-500" },
  { label: "Algorithms",        href: "/tools/algorithms",  icon: BrainCircuit, color: "text-emerald-500" },
  { label: "Computer Networks", href: "/tools/network",     icon: Network,      color: "text-blue-500" },
  { label: "Database Systems",  href: "/tools/database",    icon: MemoryStick,  color: "text-orange-500" },
  { label: "Cyber Security",    href: "/tools/security",    icon: ShieldAlert,  color: "text-red-500" },
  { label: "Software Eng.",     href: "/tools/swe",         icon: Blocks,       color: "text-indigo-500" },
  { label: "Programming",       href: "/tools/programming", icon: Code2,        color: "text-pink-500" },
  { label: "Web Development",   href: "/tools/web",         icon: Globe,        color: "text-teal-500" },
];

export default function ToolsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + "/");

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Top bar */}
      <header className="sticky top-0 z-50 h-12 bg-white border-b border-gray-100 flex items-center px-3 gap-2">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="lg:hidden p-1.5 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
        >
          {sidebarOpen ? <X className="w-4 h-4 text-gray-500" /> : <Menu className="w-4 h-4 text-gray-500" />}
        </button>

        <Link href="/" className="flex items-center gap-2 shrink-0">
          <Image src="/logo_navbar.png" alt="CampusFlow" width={100} height={25} style={{ height: 25, width: "auto" }} />
        </Link>

        <div className="hidden sm:flex items-center gap-1 text-[11px] text-gray-400 ml-2">
          <Link href="/" className="hover:text-gray-700 transition-colors">Home</Link>
          <ChevronRight className="w-2.5 h-2.5" />
          <Link href="/tools" className="hover:text-gray-700 transition-colors">Tools</Link>
          {pathname !== "/tools" && (
            <>
              <ChevronRight className="w-2.5 h-2.5" />
              <span className="text-gray-700 font-medium">
                {pathname.split("/").filter(Boolean).slice(1).join(" / ")}
              </span>
            </>
          )}
        </div>

        <div className="flex-1" />
        <Link href="/" className="hidden sm:flex items-center gap-1 text-[11px] font-semibold text-gray-400 hover:text-gray-700 transition-colors">
          <Home className="w-3 h-3" /> Home
        </Link>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Mobile overlay */}
        {sidebarOpen && (
          <div className="fixed inset-0 bg-black/30 z-40 lg:hidden backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
        )}

        {/* Sidebar */}
        <aside className={`fixed inset-y-0 left-0 top-12 z-40 w-56 bg-white border-r border-gray-100 flex flex-col overflow-y-auto transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:flex ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
          <div className="p-3 flex-1 space-y-4">
            {/* All Tools */}
            <Link
              href="/tools"
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-[11px] font-bold transition-all ${
                pathname === "/tools"
                  ? "bg-gray-900 text-white"
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <BrainCircuit className="w-3.5 h-3.5 shrink-0" />
              All Tools
            </Link>

            {/* CS Topics */}
            <div>
              <p className="text-[8px] font-black uppercase tracking-[0.15em] text-gray-400 px-2.5 mb-1.5">
                CS Topics
              </p>
              <nav className="space-y-0.5">
                {TOOL_CATEGORIES.map((cat) => {
                  const Icon = cat.icon;
                  const active = isActive(cat.href);
                  return (
                    <Link
                      key={cat.href}
                      href={cat.href}
                      onClick={() => setSidebarOpen(false)}
                      className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-[11px] font-semibold transition-all ${
                        active
                          ? "bg-gray-50 text-gray-900"
                          : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                      }`}
                    >
                      <Icon className={`w-3.5 h-3.5 shrink-0 ${active ? cat.color : ""}`} />
                      {cat.label}
                    </Link>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Footer */}
          <div className="p-3 border-t border-gray-100">
            <p className="text-[9px] text-gray-400 text-center">
              Bornosoft
            </p>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
