"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, BookOpen, HelpCircle, Code, Layers } from "lucide-react";
import type { InterviewSubject } from "@/lib/career/types";
import { cn } from "@/lib/utils";

type Tab = "theory" | "mcqs" | "flashcards" | "questions" | "cheatsheet";

export function InterviewSubjectClient({ subject }: { subject: InterviewSubject }) {
  const [tab, setTab] = useState<Tab>("theory");
  const [mcqAnswers, setMcqAnswers] = useState<Record<number, number>>({});
  const [flashIndex, setFlashIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  const tabs: { id: Tab; label: string; icon: typeof BookOpen }[] = [
    { id: "theory", label: "Theory", icon: BookOpen },
    { id: "mcqs", label: "MCQs", icon: HelpCircle },
    { id: "flashcards", label: "Flashcards", icon: Layers },
    { id: "questions", label: "Interview Qs", icon: Code },
    { id: "cheatsheet", label: "Cheat Sheet", icon: BookOpen },
  ];

  const card = subject.flashcards[flashIndex];

  return (
    <div>
      <div className="border-b border-[#E5E7EB] dark:border-white/10">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Link href="/career/interview" className="inline-flex items-center gap-1 text-sm text-[#6D5DF6] mb-4 hover:underline">
            <ArrowLeft size={14} /> Back to Interview Hub
          </Link>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mb-2">{subject.title}</h1>
          <p className="text-slate-500 max-w-2xl">{subject.description}</p>
        </div>
      </div>

      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-wrap gap-2 mb-6">
          {tabs.map((t) => (
            <button key={t.id} type="button" onClick={() => setTab(t.id)} className={cn("flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium min-h-[44px]", tab === t.id ? "gradient-primary text-white" : "bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300")}>
              <t.icon size={16} /> {t.label}
            </button>
          ))}
        </div>

        {tab === "theory" && (
          <div className="glass-card p-6 space-y-3">
            {subject.theory.map((t, i) => (
              <div key={i} className="flex gap-3 p-3 rounded-xl bg-slate-50 dark:bg-white/5">
                <span className="w-6 h-6 rounded-full bg-[#6D5DF6]/10 text-[#6D5DF6] text-xs font-bold flex items-center justify-center shrink-0">{i + 1}</span>
                <p className="text-sm text-slate-700 dark:text-slate-200">{t}</p>
              </div>
            ))}
          </div>
        )}

        {tab === "mcqs" && (
          <div className="space-y-4">
            {subject.mcqs.map((mcq, i) => (
              <div key={i} className="glass-card p-5">
                <p className="font-semibold text-sm mb-3">{i + 1}. {mcq.q}</p>
                <div className="space-y-2">
                  {mcq.options.map((opt, j) => (
                    <button
                      key={j}
                      type="button"
                      onClick={() => setMcqAnswers({ ...mcqAnswers, [i]: j })}
                      className={cn(
                        "w-full text-left px-4 py-3 rounded-xl text-sm min-h-[44px] transition-colors",
                        mcqAnswers[i] === j
                          ? j === mcq.answer ? "bg-emerald-500/10 text-emerald-700 border border-emerald-500/30" : "bg-red-500/10 text-red-700 border border-red-500/30"
                          : "bg-slate-50 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10"
                      )}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "flashcards" && card && (
          <div className="max-w-lg mx-auto">
            <button
              type="button"
              onClick={() => setFlipped(!flipped)}
              className="w-full glass-card p-8 min-h-[200px] flex items-center justify-center text-center cursor-pointer"
            >
              <p className="text-lg font-medium text-slate-800 dark:text-slate-100">
                {flipped ? card.back : card.front}
              </p>
            </button>
            <div className="flex justify-between mt-4">
              <button type="button" onClick={() => { setFlashIndex(Math.max(0, flashIndex - 1)); setFlipped(false); }} className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-white/5 text-sm min-h-[44px]" disabled={flashIndex === 0}>Previous</button>
              <span className="text-sm text-slate-400 self-center">{flashIndex + 1} / {subject.flashcards.length}</span>
              <button type="button" onClick={() => { setFlashIndex(Math.min(subject.flashcards.length - 1, flashIndex + 1)); setFlipped(false); }} className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-white/5 text-sm min-h-[44px]" disabled={flashIndex === subject.flashcards.length - 1}>Next</button>
            </div>
          </div>
        )}

        {tab === "questions" && (
          <div className="grid lg:grid-cols-2 gap-6">
            <div className="glass-card p-5">
              <h3 className="font-bold mb-4">Interview Questions</h3>
              <ul className="space-y-2">
                {subject.interviewQuestions.map((q) => <li key={q} className="text-sm p-3 rounded-xl bg-slate-50 dark:bg-white/5 text-slate-700 dark:text-slate-200">• {q}</li>)}
              </ul>
            </div>
            <div className="glass-card p-5">
              <h3 className="font-bold mb-4">Company Questions</h3>
              <ul className="space-y-2">
                {subject.companyQuestions.map((q) => <li key={q} className="text-sm p-3 rounded-xl bg-slate-50 dark:bg-white/5 text-slate-700 dark:text-slate-200">• {q}</li>)}
              </ul>
            </div>
          </div>
        )}

        {tab === "cheatsheet" && (
          <div className="glass-card p-6">
            <div className="grid sm:grid-cols-2 gap-3">
              {subject.cheatSheet.map((item, i) => (
                <div key={i} className="p-3 rounded-xl bg-[#6D5DF6]/5 border border-[#6D5DF6]/10 text-sm text-slate-700 dark:text-slate-200">{item}</div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
