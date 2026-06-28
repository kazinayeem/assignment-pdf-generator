"use client";

import { useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X } from "lucide-react";
import { ALL_TOOLS } from "@/lib/landing-data";

type SearchModalProps = {
  open: boolean;
  query: string;
  onQueryChange: (q: string) => void;
  onClose: () => void;
};

export function SearchModal({ open, query, onQueryChange, onClose }: SearchModalProps) {
  const filteredTools = useMemo(() => {
    if (!query) return ALL_TOOLS;
    const q = query.toLowerCase();
    return ALL_TOOLS.filter(
      (t) => t.name.toLowerCase().includes(q) || t.desc.toLowerCase().includes(q)
    );
  }, [query]);

  const handleClose = () => {
    onClose();
    onQueryChange("");
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50"
          role="dialog"
          aria-modal="true"
          aria-label="Search tools"
        >
          <div
            className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
            onClick={handleClose}
            aria-hidden
          />
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.98 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="absolute top-4 sm:top-8 left-1/2 -translate-x-1/2 w-full max-w-xl px-4"
          >
            <div className="glass-card overflow-hidden !rounded-2xl shadow-2xl">
              <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-100 dark:border-white/10">
                <Search size={18} className="text-slate-400 shrink-0" aria-hidden />
                <input
                  autoFocus
                  value={query}
                  onChange={(e) => onQueryChange(e.target.value)}
                  placeholder="Search tools..."
                  aria-label="Search tools"
                  className="flex-1 text-base bg-transparent border-none outline-none text-slate-800 dark:text-white placeholder:text-slate-400"
                />
                <button
                  onClick={handleClose}
                  aria-label="Close search"
                  className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-white/10 text-slate-400 cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
                >
                  <X size={16} />
                </button>
              </div>
              <div className="max-h-80 overflow-y-auto p-3">
                {filteredTools.length === 0 ? (
                  <div className="text-center py-8 text-sm text-slate-400">No tools found</div>
                ) : (
                  filteredTools.map((tool) => (
                    <Link
                      key={tool.href}
                      href={tool.href}
                      onClick={handleClose}
                      className="flex items-center gap-4 px-4 py-3 rounded-2xl hover:bg-slate-50 dark:hover:bg-white/5 transition-colors group"
                    >
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-br ${tool.color} shadow-lg`}
                      >
                        <tool.icon size={18} className="text-white" aria-hidden />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-slate-800 dark:text-white group-hover:text-[#6D5DF6] transition-colors">
                          {tool.name}
                        </p>
                        <p className="text-xs text-slate-400 truncate">{tool.desc}</p>
                      </div>
                    </Link>
                  ))
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
