"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X, BookOpen, Code2, HelpCircle, Briefcase, Link2, CheckCircle2,
  Sparkles, FileText, Target,
} from "lucide-react";
import { card, badge, button } from "@/lib/design-system";
import type { Roadmap, RoadmapNode } from "@/lib/roadmaps/types";
import { RoadmapExportMenu } from "./roadmap-export-menu";
import { useRoadmapsStore } from "@/lib/roadmaps/store";
import { cn } from "@/lib/utils";

const TABS = [
  { id: "overview", label: "Overview", icon: BookOpen },
  { id: "theory", label: "Theory", icon: FileText },
  { id: "code", label: "Code", icon: Code2 },
  { id: "coding", label: "Problems", icon: Target },
  { id: "quiz", label: "Quiz", icon: HelpCircle },
  { id: "interview", label: "Interview", icon: Briefcase },
  { id: "resources", label: "Resources", icon: Link2 },
  { id: "projects", label: "Projects", icon: Target },
  { id: "ai", label: "AI", icon: Sparkles },
] as const;

type TabId = (typeof TABS)[number]["id"];

type RoadmapNodePanelProps = {
  roadmap: Roadmap;
  node: RoadmapNode | null;
  onClose: () => void;
  isComplete: boolean;
  onToggleComplete: () => void;
  onQuizAnswer?: (correct: boolean) => void;
};

export function RoadmapNodePanel({
  roadmap,
  node,
  onClose,
  isComplete,
  onToggleComplete,
  onQuizAnswer,
}: RoadmapNodePanelProps) {
  const [tab, setTab] = useState<TabId>("overview");
  const [quizIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const { markInterviewPracticed, markCodingSolved } = useRoadmapsStore();

  if (!node) return null;

  const quiz = node.quizzes[quizIndex];

  return (
    <AnimatePresence>
      <motion.aside
        initial={{ x: "100%", opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: "100%", opacity: 0 }}
        transition={{ type: "spring", damping: 28, stiffness: 320 }}
        className={cn(
          card.base,
          "fixed right-0 top-0 z-50 h-full w-full sm:w-[420px] lg:w-[480px]",
          "border-l border-border rounded-none sm:rounded-l-2xl shadow-2xl flex flex-col"
        )}
      >
        <div className="p-4 sm:p-5 border-b border-border flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex flex-wrap gap-1.5 mb-2">
              <span className={cn(badge.muted, "text-[10px] capitalize")}>{node.difficulty}</span>
              <span className={cn(badge.muted, "text-[10px]")}>{node.estimatedHours}h estimated</span>
              {isComplete && <span className={cn(badge.success, "text-[10px]")}>Completed</span>}
            </div>
            <h2 className="text-lg font-bold text-foreground">{node.title}</h2>
            <p className="text-sm text-muted-foreground mt-1">{node.description}</p>
          </div>
          <button type="button" onClick={onClose} className="p-2 rounded-lg hover:bg-muted shrink-0" aria-label="Close panel">
            <X size={18} />
          </button>
        </div>
        <div className="px-4 pb-2">
          <RoadmapExportMenu roadmap={roadmap} node={node} className="w-full" />
        </div>

        <div className="flex gap-1 px-3 py-2 border-b border-border overflow-x-auto scrollbar-none">
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={cn(
                "flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-semibold whitespace-nowrap transition-colors",
                tab === t.id ? "bg-brand/10 text-brand" : "text-muted-foreground hover:bg-muted"
              )}
            >
              <t.icon size={12} />
              {t.label}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {tab === "overview" && (
            <>
              {node.bestPractices && (
                <section>
                  <h3 className="text-xs font-bold uppercase text-muted-foreground mb-2">Best Practices</h3>
                  <ul className="space-y-1.5 text-sm text-foreground">
                    {node.bestPractices.map((b) => (
                      <li key={b} className="flex gap-2"><CheckCircle2 size={14} className="text-success shrink-0 mt-0.5" />{b}</li>
                    ))}
                  </ul>
                </section>
              )}
              {node.commonMistakes && (
                <section>
                  <h3 className="text-xs font-bold uppercase text-muted-foreground mb-2">Common Mistakes</h3>
                  <ul className="space-y-1.5 text-sm text-muted-foreground">
                    {node.commonMistakes.map((m) => <li key={m}>• {m}</li>)}
                  </ul>
                </section>
              )}
              {node.cheatSheet && (
                <section>
                  <h3 className="text-xs font-bold uppercase text-muted-foreground mb-2">Cheat Sheet</h3>
                  <div className="flex flex-wrap gap-1.5">
                    {node.cheatSheet.map((c) => (
                      <span key={c} className={badge.muted}>{c}</span>
                    ))}
                  </div>
                </section>
              )}
              {node.challenges.length > 0 && (
                <section>
                  <h3 className="text-xs font-bold uppercase text-muted-foreground mb-2">Coding Challenges</h3>
                  {node.challenges.map((c) => (
                    <div key={c.title} className={cn(card.base, "p-3 mb-2")}>
                      <p className="text-sm font-semibold">{c.title}</p>
                      <p className="text-xs text-muted-foreground capitalize mt-1">{c.difficulty}</p>
                    </div>
                  ))}
                </section>
              )}
            </>
          )}

          {tab === "theory" && (
            <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">{node.theory}</p>
          )}

          {tab === "code" && node.codeExample && (
            <pre className="text-xs bg-muted rounded-xl p-4 overflow-x-auto border border-border">
              <code>{node.codeExample}</code>
            </pre>
          )}

          {tab === "quiz" && quiz && (
            <div className="space-y-4">
              <p className="text-sm font-medium">{quiz.question}</p>
              <div className="space-y-2">
                {quiz.options.map((opt, i) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => {
                      setSelectedAnswer(i);
                      onQuizAnswer?.(i === quiz.answer);
                    }}
                    className={cn(
                      "w-full text-left px-3 py-2.5 rounded-xl border text-sm transition-colors",
                      selectedAnswer === i
                        ? i === quiz.answer
                          ? "border-success bg-success/10"
                          : "border-destructive bg-destructive/10"
                        : "border-border hover:border-brand/30"
                    )}
                  >
                    {opt}
                  </button>
                ))}
              </div>
              {selectedAnswer != null && (
                <p className="text-xs text-muted-foreground p-3 rounded-lg bg-muted">{quiz.explanation}</p>
              )}
            </div>
          )}

          {tab === "interview" && (
            <div className="space-y-3 max-h-[50vh] overflow-y-auto">
              {node.interviewQuestions.map((q) => (
                <div key={q.id} className={cn(card.base, "p-3")}>
                  <span className={cn(badge.muted, "text-[10px] mb-2 capitalize")}>{q.difficulty} · {q.category}</span>
                  <p className="text-sm font-medium">{q.question}</p>
                  <p className="text-xs text-muted-foreground mt-2">{q.answer}</p>
                  <button type="button" onClick={() => markInterviewPracticed(roadmap.slug, q.id)} className="text-xs text-brand mt-2 font-semibold">
                    Mark practiced
                  </button>
                </div>
              ))}
            </div>
          )}

          {tab === "coding" && (
            <div className="space-y-3 max-h-[50vh] overflow-y-auto">
              {node.codingProblems.map((p) => (
                <div key={p.id} className={cn(card.base, "p-3")}>
                  <p className="text-sm font-bold">{p.title}</p>
                  <p className="text-xs text-muted-foreground mt-1">{p.statement}</p>
                  <p className="text-[10px] text-muted-foreground mt-2">Input: {p.input}</p>
                  <p className="text-[10px] text-muted-foreground">Output: {p.output}</p>
                  <pre className="text-[10px] bg-muted rounded-lg p-2 mt-2 overflow-x-auto">{p.solution}</pre>
                  <p className="text-[10px] mt-1">{p.timeComplexity} · {p.spaceComplexity}</p>
                  <button type="button" onClick={() => markCodingSolved(roadmap.slug, p.id)} className="text-xs text-brand mt-2 font-semibold">
                    Mark solved
                  </button>
                </div>
              ))}
            </div>
          )}

          {tab === "resources" && (
            <div className="space-y-2 max-h-[50vh] overflow-y-auto">
              {node.learningResources.map((r) => (
                <a
                  key={r.id}
                  href={r.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(card.base, card.hover, "p-3 flex items-center gap-2 text-sm font-medium text-brand")}
                >
                  <Link2 size={14} />
                  <div className="min-w-0 flex-1">
                    <p>{r.title}</p>
                    <p className="text-[10px] text-muted-foreground font-normal">{r.description}</p>
                  </div>
                  <span className={cn(badge.muted, "text-[10px]")}>{r.pricing}</span>
                </a>
              ))}
            </div>
          )}

          {tab === "projects" && (
            <div className="space-y-3">
              {node.projects.map((p) => (
                <div key={p.title} className={cn(card.base, "p-4")}>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <h4 className="text-sm font-bold">{p.title}</h4>
                    <span className={cn(badge.brand, "text-[10px] capitalize")}>{p.level}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mb-2">{p.description}</p>
                  <p className="text-[10px] font-semibold text-muted-foreground uppercase mb-1">Requirements</p>
                  <ul className="text-xs text-foreground space-y-0.5">
                    {p.requirements.map((r) => <li key={r}>• {r}</li>)}
                  </ul>
                </div>
              ))}
            </div>
          )}

          {tab === "ai" && (
            <div className={cn(card.base, "p-4 bg-gradient-to-br from-brand/5 to-brand-accent/5")}>
              <div className="flex items-center gap-2 mb-3">
                <Sparkles size={16} className="text-brand" />
                <span className="text-sm font-bold">AI Summary</span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">{node.aiSummary}</p>
              <p className="text-xs text-muted-foreground mt-4 pt-3 border-t border-border">
                AI Learning Assistant, code review, and mock interviews coming in V1.1.
              </p>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-border">
          <button
            type="button"
            onClick={onToggleComplete}
            className={cn(
              button.primary,
              "w-full flex items-center justify-center gap-2",
              isComplete && "opacity-90"
            )}
          >
            <CheckCircle2 size={16} />
            {isComplete ? "Mark Incomplete" : "Mark Complete"}
          </button>
        </div>
      </motion.aside>
    </AnimatePresence>
  );
}
