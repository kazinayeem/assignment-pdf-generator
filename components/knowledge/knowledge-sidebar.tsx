"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, ChevronRight, Search, Menu, X } from "lucide-react";
import { knowledgeIndex } from "@/lib/knowledge/loader";
import { cn } from "@/lib/utils";

function SidebarNodeView({ node, depth = 0 }: { node: typeof knowledgeIndex.sidebar[0]; depth?: number }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(true);
  const hasChildren = node.children && node.children.length > 0;
  const isActive = node.route === pathname;

  return (
    <div>
      <div className="flex items-center" style={{ paddingLeft: depth * 12 }}>
        {hasChildren ? (
          <button type="button" onClick={() => setOpen(!open)} className="p-1 rounded hover:bg-slate-100 dark:hover:bg-white/10 min-h-[32px] min-w-[32px] flex items-center justify-center" aria-label={open ? "Collapse" : "Expand"}>
            {open ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          </button>
        ) : <span className="w-8" />}
        {node.route ? (
          <Link href={node.route} className={cn("flex-1 py-2 px-2 rounded-lg text-sm truncate min-h-[40px] flex items-center", isActive ? "bg-[#6D5DF6]/10 text-[#6D5DF6] font-semibold" : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5")}>
            {node.title}
          </Link>
        ) : (
          <span className="flex-1 py-2 px-2 text-sm font-semibold text-slate-800 dark:text-slate-100">{node.title}</span>
        )}
      </div>
      {hasChildren && open && (
        <div className="ml-1">
          {node.children!.map((child) => <SidebarNodeView key={child.id} node={child} depth={depth + 1} />)}
        </div>
      )}
    </div>
  );
}

export function KnowledgeSidebar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [filter, setFilter] = useState("");

  const filteredSidebar = useMemo(() => {
    if (!filter.trim()) return knowledgeIndex.sidebar;
    const q = filter.toLowerCase();
    const filterNode = (node: typeof knowledgeIndex.sidebar[0]): typeof node | null => {
      const match = node.title.toLowerCase().includes(q) || node.route?.toLowerCase().includes(q);
      const kids = node.children?.map(filterNode).filter(Boolean) as typeof knowledgeIndex.sidebar | undefined;
      if (match || kids?.length) return { ...node, children: kids };
      return null;
    };
    return knowledgeIndex.sidebar.map(filterNode).filter(Boolean) as typeof knowledgeIndex.sidebar;
  }, [filter]);

  const sidebarContent = (
    <div className="h-full flex flex-col">
      <div className="p-3 border-b border-slate-200 dark:border-white/10">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder="Filter sidebar..."
            className="w-full pl-9 pr-3 py-2 rounded-xl text-sm border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 outline-none focus:border-[#6D5DF6]/50 min-h-[40px]"
          />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {filteredSidebar.map((node) => <SidebarNodeView key={node.id} node={node} />)}
      </div>
    </div>
  );

  return (
    <>
      <button type="button" onClick={() => setMobileOpen(true)} className="lg:hidden fixed bottom-4 left-4 z-40 w-12 h-12 rounded-full gradient-primary text-white shadow-lg flex items-center justify-center" aria-label="Open sidebar">
        <Menu size={20} />
      </button>

      <aside className="hidden lg:block w-72 shrink-0 border-r border-slate-200 dark:border-white/10 bg-white/50 dark:bg-[#0F172A]/50 sticky top-[4.5rem] h-[calc(100vh-4.5rem)] overflow-hidden rounded-r-2xl">
        {sidebarContent}
      </aside>

      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/50" onClick={() => setMobileOpen(false)}>
          <aside className="w-[min(320px,85vw)] h-full bg-white dark:bg-[#0F172A] shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-3 border-b">
              <span className="font-bold">Navigation</span>
              <button type="button" onClick={() => setMobileOpen(false)} className="p-2 min-h-[44px] min-w-[44px] flex items-center justify-center"><X size={20} /></button>
            </div>
            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  );
}
