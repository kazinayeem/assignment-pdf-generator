"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HelpCircle, ChevronDown, Code2, MessageSquare } from "lucide-react";
import type { ExtractedQuestion } from "@/lib/knowledge/types";
import { cn } from "@/lib/utils";

const TYPE_ICONS = {
  technical: HelpCircle,
  coding: Code2,
  "system-design": Code2,
  behavioral: MessageSquare,
  hr: MessageSquare,
  general: HelpCircle,
};

export function QuestionCards({ questions, company }: { questions: ExtractedQuestion[]; company?: string }) {
  const [openId, setOpenId] = useState<string | null>(null);

  if (!questions.length) return null;

  return (
    <section className="mt-10">
      <h2 className="text-xl font-bold mb-4">Interview Questions ({questions.length})</h2>
      <div className="space-y-3">
        {questions.map((q) => {
          const Icon = TYPE_ICONS[q.type] ?? HelpCircle;
          const isOpen = openId === q.id;
          return (
            <motion.div key={q.id} layout className="glass-card overflow-hidden">
              <button
                type="button"
                onClick={() => setOpenId(isOpen ? null : q.id)}
                className="w-full flex items-start gap-3 p-4 text-left min-h-[44px]"
                aria-expanded={isOpen}
              >
                <div className="w-8 h-8 rounded-lg bg-brand/10 flex items-center justify-center shrink-0">
                  <Icon size={16} className="text-brand" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap gap-2 mb-1">
                    <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 dark:bg-white/5 capitalize">{q.type.replace("-", " ")}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 dark:bg-white/5 capitalize">{q.difficulty}</span>
                    {(company || q.company) && <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600">{company || q.company}</span>}
                  </div>
                  <p className="font-semibold text-sm text-slate-800 dark:text-slate-100 line-clamp-3">{q.question.replace(/[#*`]/g, "").slice(0, 300)}</p>
                </div>
                <ChevronDown size={18} className={cn("text-slate-400 shrink-0 transition-transform", isOpen && "rotate-180")} />
              </button>
              <AnimatePresence>
                {isOpen && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="border-t border-slate-100 dark:border-white/5">
                    <div className="p-4 pt-0 text-sm text-slate-600 dark:text-slate-300 whitespace-pre-wrap">
                      {q.answer ? (
                        <div className="mt-3 p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/10">
                          <p className="font-semibold text-emerald-700 dark:text-emerald-400 mb-2">Answer</p>
                          {q.answer.slice(0, 3000)}
                        </div>
                      ) : (
                        <p className="mt-3 text-slate-400 italic">Open the full article above for context and solutions.</p>
                      )}
                      {q.explanation && <p className="mt-3 text-xs text-slate-400">{q.explanation}</p>}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
