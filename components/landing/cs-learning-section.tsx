"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Eye, EyeOff, Search } from "lucide-react";
import { ALL_TOOLS, CATEGORIES } from "@/lib/landing-data";
import { SectionHeader } from "./section-header";
import { cn } from "@/lib/utils";

export function CSLearningSection() {
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
  const [categorySearch, setCategorySearch] = useState<Record<string, string>>({});

  const toggle = (key: string) => setCollapsed((p) => ({ ...p, [key]: !p[key] }));

  const collapseAll = () =>
    setCollapsed(Object.fromEntries(CATEGORIES.map((c) => [c.name, true])));
  const expandAll = () => setCollapsed({});

  return (
    <section className="section-padding relative bg-[#FAFAFC] dark:bg-[#0F172A]">
      <div className="blur-orb w-[350px] h-[350px] bg-[#8B5CF6]/10 top-20 right-0" aria-hidden />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12 md:mb-16">
          <SectionHeader
            badge="CS Learning"
            title="CS Learning Tools"
            description="Interactive educational tools across 13+ computer science topics."
            align="left"
            className="mb-0"
          />
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={collapseAll}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm text-slate-500 hover:text-slate-700 hover:bg-white dark:hover:bg-white/10 transition cursor-pointer min-h-[44px] border border-slate-200 dark:border-white/10"
            >
              <EyeOff size={14} aria-hidden /> Collapse
            </button>
            <button
              onClick={expandAll}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm text-slate-500 hover:text-slate-700 hover:bg-white dark:hover:bg-white/10 transition cursor-pointer min-h-[44px] border border-slate-200 dark:border-white/10"
            >
              <Eye size={14} aria-hidden /> Expand
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {CATEGORIES.map((cat, catIndex) => {
            const isOpen = !collapsed[cat.name];
            const search = categorySearch[cat.name] || "";
            const tools = ALL_TOOLS.filter((t) => cat.tools.includes(t.name)).filter((t) => {
              if (!search) return true;
              const q = search.toLowerCase();
              return t.name.toLowerCase().includes(q) || t.desc.toLowerCase().includes(q);
            });
            const progress = Math.round((cat.tools.length / ALL_TOOLS.length) * 100);

            return (
              <motion.div
                key={cat.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: catIndex * 0.05 }}
                className="glass-card overflow-hidden !rounded-3xl"
              >
                <button
                  onClick={() => toggle(cat.name)}
                  aria-expanded={isOpen}
                  className="w-full flex items-center justify-between p-5 sm:p-6 hover:bg-slate-50/50 dark:hover:bg-white/5 transition-colors cursor-pointer min-h-[44px]"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${cat.color} flex items-center justify-center shadow-lg`}
                    >
                      <cat.icon size={22} className="text-white" aria-hidden />
                    </div>
                    <div className="text-left">
                      <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                        {cat.name}
                      </h3>
                      <div className="flex items-center gap-3 mt-1">
                        <p className="text-sm text-slate-400">{cat.tools.length} topics</p>
                        <div className="hidden sm:flex items-center gap-2">
                          <div className="w-20 h-1.5 rounded-full bg-slate-100 dark:bg-white/10 overflow-hidden">
                            <div
                              className="h-full rounded-full transition-all duration-500"
                              style={{
                                width: `${progress}%`,
                                backgroundColor: cat.accent,
                              }}
                            />
                          </div>
                          <span className="text-xs text-slate-400">{progress}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.25 }}
                  >
                    <ChevronDown size={20} className="text-slate-400" aria-hidden />
                  </motion.div>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 sm:px-6 pb-5 sm:pb-6 border-t border-slate-100 dark:border-white/10">
                        <div className="relative mt-4 mb-4">
                          <Search
                            size={16}
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                            aria-hidden
                          />
                          <input
                            value={search}
                            onChange={(e) =>
                              setCategorySearch((p) => ({ ...p, [cat.name]: e.target.value }))
                            }
                            placeholder={`Search in ${cat.name}...`}
                            aria-label={`Search tools in ${cat.name}`}
                            className="w-full pl-11 pr-4 py-3 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-sm text-slate-800 dark:text-white placeholder:text-slate-400 outline-none focus:border-[#6D5DF6]/50 transition-colors min-h-[44px]"
                            onClick={(e) => e.stopPropagation()}
                          />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                          {tools.length === 0 ? (
                            <p className="col-span-full text-center py-6 text-sm text-slate-400">
                              No tools match your search
                            </p>
                          ) : (
                            tools.map((tool, i) => (
                              <motion.div
                                key={tool.href}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.03 }}
                              >
                                <Link href={tool.href} className="block group">
                                  <div
                                    className={cn(
                                      "p-4 rounded-2xl border border-slate-200 dark:border-white/10",
                                      "hover:border-[#6D5DF6]/30 hover:bg-[#6D5DF6]/5 transition-all",
                                      "hover:shadow-lg hover:shadow-[#6D5DF6]/10 hover:-translate-y-0.5"
                                    )}
                                  >
                                    <div
                                      className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 bg-gradient-to-br ${tool.color} shadow-md group-hover:scale-105 transition-transform`}
                                    >
                                      <tool.icon size={18} className="text-white" aria-hidden />
                                    </div>
                                    <p className="text-sm font-bold text-slate-800 dark:text-white group-hover:text-[#6D5DF6] transition-colors">
                                      {tool.name}
                                    </p>
                                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">{tool.desc}</p>
                                  </div>
                                </Link>
                              </motion.div>
                            ))
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
