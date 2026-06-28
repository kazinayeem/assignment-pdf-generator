"use client";

import { useState } from "react";
import type { KnowledgeQuizItem } from "@/lib/knowledge/types";
import { cn } from "@/lib/utils";

export function KnowledgeQuizPanel({ quiz, title }: { quiz: KnowledgeQuizItem[]; title: string }) {
  const [answers, setAnswers] = useState<Record<string, string | number | boolean>>({});
  const [revealed, setRevealed] = useState<Set<string>>(new Set());

  const reveal = (id: string) => setRevealed((s) => new Set([...s, id]));

  return (
    <section className="mt-10 glass-card p-6">
      <h2 className="text-xl font-bold mb-2">Practice Quiz</h2>
      <p className="text-sm text-slate-500 mb-6">Generated from {title} content</p>
      <div className="space-y-4">
        {quiz.map((q, i) => (
          <div key={q.id} className="p-4 rounded-xl bg-slate-50 dark:bg-white/5">
            <div className="flex gap-2 mb-2">
              <span className="text-xs px-2 py-0.5 rounded-full bg-[#6D5DF6]/10 text-[#6D5DF6] capitalize">{q.type}</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-slate-200 dark:bg-white/10 capitalize">{q.difficulty}</span>
            </div>
            <p className="font-medium text-sm mb-3">{i + 1}. {q.question}</p>
            {q.type === "mcq" && q.options && (
              <div className="space-y-2">
                {q.options.map((opt, j) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => { setAnswers({ ...answers, [q.id]: j }); reveal(q.id); }}
                    className={cn(
                      "w-full text-left px-3 py-2 rounded-lg text-sm min-h-[40px]",
                      revealed.has(q.id) && j === q.answer ? "bg-emerald-500/10 text-emerald-700 border border-emerald-500/30" :
                      answers[q.id] === j ? "bg-[#6D5DF6]/10 border border-[#6D5DF6]/30" :
                      "bg-white dark:bg-white/5 border border-transparent hover:border-slate-200"
                    )}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}
            {q.type === "true-false" && (
              <div className="flex gap-2">
                {[true, false].map((val) => (
                  <button key={String(val)} type="button" onClick={() => { setAnswers({ ...answers, [q.id]: val }); reveal(q.id); }} className="px-4 py-2 rounded-lg text-sm min-h-[40px] bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10">
                    {val ? "True" : "False"}
                  </button>
                ))}
              </div>
            )}
            {q.type === "flashcard" && (
              <button type="button" onClick={() => reveal(q.id)} className="text-sm text-[#6D5DF6] font-medium min-h-[44px]">
                {revealed.has(q.id) ? `Answer: ${String(q.answer).slice(0, 200)}` : "Reveal Flashcard"}
              </button>
            )}
            {revealed.has(q.id) && <p className="mt-2 text-xs text-slate-500">{q.explanation}</p>}
          </div>
        ))}
      </div>
    </section>
  );
}
