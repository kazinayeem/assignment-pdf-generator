"use client";

import { useState, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export function Section({ title, children, className }: { title: string; children: ReactNode; className?: string }) {
  return (
    <section className={cn("mb-10", className)}>
      <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-5 pb-3 border-b border-border dark:border-white/10">
        {title}
      </h2>
      <div className="space-y-4">{children}</div>
    </section>
  );
}

export function InfoCard({
  title,
  children,
  content,
  icon,
  type = "info",
}: {
  title: string;
  children?: ReactNode;
  content?: string;
  icon?: string;
  type?: "info" | "warning" | "tip" | "success";
}) {
  const styles = {
    info: { bg: "bg-brand/5", border: "border-brand/20", emoji: "ℹ️" },
    warning: { bg: "bg-amber-50 dark:bg-amber-500/10", border: "border-amber-200 dark:border-amber-500/20", emoji: "⚠️" },
    tip: { bg: "bg-emerald-50 dark:bg-emerald-500/10", border: "border-emerald-200 dark:border-emerald-500/20", emoji: "💡" },
    success: { bg: "bg-[#22C55E]/5", border: "border-[#22C55E]/20", emoji: "✓" },
  };
  const s = styles[type];

  return (
    <div className={cn("rounded-2xl border p-5 flex gap-4", s.bg, s.border)}>
      <span className="text-lg shrink-0" aria-hidden>{icon || s.emoji}</span>
      <div>
        <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-1.5">{title}</h4>
        <div className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          {children || content}
        </div>
      </div>
    </div>
  );
}

export function CodeBlock({ code, language = "code" }: { code: string; language?: string }) {
  return (
    <div className="rounded-2xl bg-[#0F172A] border border-white/10 overflow-hidden mb-5">
      <div className="px-4 py-2 border-b border-white/10 text-[10px] font-bold uppercase tracking-wider text-slate-400">
        {language}
      </div>
      <pre className="p-5 overflow-x-auto text-sm text-slate-200 font-mono leading-relaxed">
        <code>{code}</code>
      </pre>
    </div>
  );
}

export function InterviewQuestion({ question, answer, q, a }: { question?: string; answer?: string; q?: string; a?: string }) {
  const questionText = question || q || "";
  const answerText = answer || a || "";
  const [open, setOpen] = useState(false);

  return (
    <div className="rounded-2xl border border-border dark:border-white/10 bg-white dark:bg-white/5 overflow-hidden mb-3">
      <button
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left hover:bg-slate-50 dark:hover:bg-white/5 transition-colors min-h-[44px] cursor-pointer"
      >
        <span className="font-semibold text-slate-900 dark:text-white text-sm">{questionText}</span>
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown size={18} className="text-slate-400 shrink-0" aria-hidden />
        </motion.div>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <p className="px-5 pb-4 text-sm text-slate-500 dark:text-slate-400 leading-relaxed border-t border-border dark:border-white/10 pt-4">
              {answerText}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function InterviewQuestions({ questions }: { questions: { q: string; a: string }[] }) {
  return (
    <div>
      {questions.map((item, i) => (
        <InterviewQuestion key={i} q={item.q} a={item.a} />
      ))}
    </div>
  );
}

export function Diagram({ title, children }: { title?: string; children: ReactNode }) {
  return (
    <div className="rounded-2xl border border-border dark:border-white/10 bg-white dark:bg-white/5 p-6 mb-6 shadow-sm">
      {title && <h3 className="font-bold text-slate-900 dark:text-white text-base mb-4">{title}</h3>}
      {children}
    </div>
  );
}
