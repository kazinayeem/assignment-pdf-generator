"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X, BookOpen, Code2, HelpCircle, Briefcase, Link2, CheckCircle2,
  Sparkles, FileText, Target, Play, AlertTriangle, ArrowRight, GraduationCap,
  Video, FileCode, Layers,
} from "lucide-react";
import { card, badge, button } from "@/lib/design-system";
import type { Roadmap, RoadmapNode } from "@/lib/roadmaps/types";
import { RoadmapExportMenu } from "./roadmap-export-menu";
import { useRoadmapsStore } from "@/lib/roadmaps/store";
import { computeNodeStats } from "@/lib/roadmaps/graph-utils";
import { cn } from "@/lib/utils";

const TABS = [
  { id: "overview", label: "Overview", icon: BookOpen },
  { id: "objectives", label: "Objectives", icon: Target },
  { id: "theory", label: "Theory", icon: FileText },
  { id: "code", label: "Code", icon: Code2 },
  { id: "playground", label: "Playground", icon: Play },
  { id: "coding", label: "Problems", icon: Target },
  { id: "quiz", label: "Quiz", icon: HelpCircle },
  { id: "interview", label: "Interview", icon: Briefcase },
  { id: "cheatsheet", label: "Cheat Sheet", icon: Layers },
  { id: "resources", label: "Resources", icon: Link2 },
  { id: "projects", label: "Projects", icon: Target },
  { id: "ai", label: "AI", icon: Sparkles },
] as const;

const LEARNING_FLOW = [
  { id: "theory", label: "Theory" },
  { id: "playground", label: "Demo" },
  { id: "code", label: "Code" },
  { id: "quiz", label: "Quiz" },
  { id: "coding", label: "Practice" },
  { id: "projects", label: "Project" },
  { id: "interview", label: "Interview" },
  { id: "resources", label: "Resources" },
] as const;

type TabId = (typeof TABS)[number]["id"];

type RoadmapNodePanelProps = {
  roadmap: Roadmap;
  node: RoadmapNode | null;
  onClose: () => void;
  isComplete: boolean;
  onToggleComplete: () => void;
  onQuizAnswer?: (correct: boolean) => void;
  onContinue?: (nextNode: RoadmapNode) => void;
};

export function RoadmapNodePanel({
  roadmap,
  node,
  onClose,
  isComplete,
  onToggleComplete,
  onQuizAnswer,
  onContinue,
}: RoadmapNodePanelProps) {
  const [tab, setTab] = useState<TabId>("overview");
  const [quizIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [aiMode, setAiMode] = useState<"summary" | "explain" | "quiz" | "interview" | "review" | "resources" | "projects">("summary");
  const { markInterviewPracticed, markCodingSolved } = useRoadmapsStore();

  const stats = useMemo(() => (node ? computeNodeStats(node) : null), [node]);

  const nextNode = useMemo(() => {
    if (!node) return null;
    const idx = roadmap.nodes.findIndex((n) => n.id === node.id);
    return roadmap.nodes[idx + 1] ?? null;
  }, [node, roadmap.nodes]);

  const relatedNodes = useMemo(() => {
    if (!node) return [];
    return roadmap.nodes.filter((n) => n.phaseId === node.phaseId && n.id !== node.id).slice(0, 4);
  }, [node, roadmap.nodes]);

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
          "fixed right-0 top-0 z-50 h-full w-full sm:w-[440px] lg:w-[520px]",
          "border-l border-border rounded-none sm:rounded-l-2xl shadow-2xl flex flex-col"
        )}
      >
        <div className="p-4 sm:p-5 border-b border-border flex items-start justify-between gap-3 shrink-0">
          <div className="min-w-0">
            <div className="flex flex-wrap gap-1.5 mb-2">
              <span className={cn(badge.muted, "text-[10px] capitalize")}>{node.difficulty}</span>
              <span className={cn(badge.muted, "text-[10px]")}>{node.estimatedHours}h estimated</span>
              {isComplete && <span className={cn(badge.success, "text-[10px]")}>Completed</span>}
            </div>
            <h2 className="text-lg font-bold text-foreground">{node.title}</h2>
            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{node.description}</p>
            {stats && (
              <p className="text-[10px] text-muted-foreground mt-2">
                {stats.lessons} lessons · {stats.projects} projects · {stats.interviewQuestions} interview · {stats.mcqs} MCQs
              </p>
            )}
          </div>
          <button type="button" onClick={onClose} className="p-2 rounded-lg hover:bg-muted shrink-0" aria-label="Close panel">
            <X size={18} />
          </button>
        </div>

        <div className="px-4 pb-2 shrink-0">
          <RoadmapExportMenu roadmap={roadmap} node={node} className="w-full" />
        </div>

        {/* Learning flow */}
        <div className="px-4 py-2 border-b border-border overflow-x-auto scrollbar-none shrink-0">
          <div className="flex items-center gap-1 min-w-max">
            {LEARNING_FLOW.map((step, i) => (
              <div key={step.id} className="flex items-center">
                <button
                  type="button"
                  onClick={() => setTab(step.id as TabId)}
                  className={cn(
                    "px-2 py-1 rounded-md text-[10px] font-semibold whitespace-nowrap transition-colors",
                    tab === step.id ? "bg-brand text-brand-foreground" : "text-muted-foreground hover:bg-muted"
                  )}
                >
                  {step.label}
                </button>
                {i < LEARNING_FLOW.length - 1 && <ArrowRight size={10} className="text-muted-foreground mx-0.5 shrink-0" />}
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-1 px-3 py-2 border-b border-border overflow-x-auto scrollbar-none shrink-0">
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
              <StatsGrid stats={stats} />
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
              {relatedNodes.length > 0 && (
                <section>
                  <h3 className="text-xs font-bold uppercase text-muted-foreground mb-2">Related Topics</h3>
                  <div className="flex flex-wrap gap-1.5">
                    {relatedNodes.map((n) => (
                      <span key={n.id} className={badge.muted}>{n.title}</span>
                    ))}
                  </div>
                </section>
              )}
              {nextNode && (
                <section>
                  <h3 className="text-xs font-bold uppercase text-muted-foreground mb-2">Next Topic</h3>
                  <button type="button" onClick={() => onContinue?.(nextNode)} className={cn(card.base, card.hover, "p-3 w-full text-left text-sm font-semibold text-brand")}>
                    {nextNode.title} →
                  </button>
                </section>
              )}
            </>
          )}

          {tab === "objectives" && (
            <ul className="space-y-2 text-sm">
              {node.bestPractices?.map((b) => (
                <li key={b} className="flex gap-2 p-3 rounded-xl bg-muted/50"><Target size={14} className="text-brand shrink-0 mt-0.5" />{b}</li>
              ))}
              {node.projects.map((p) => (
                <li key={p.title} className="flex gap-2 p-3 rounded-xl bg-muted/50"><Target size={14} className="text-brand shrink-0 mt-0.5" />Build: {p.title}</li>
              ))}
            </ul>
          )}

          {tab === "theory" && (
            <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">{node.theory}</p>
          )}

          {tab === "code" && node.codeExample && (
            <pre className="text-xs bg-muted rounded-xl p-4 overflow-x-auto border border-border">
              <code>{node.codeExample}</code>
            </pre>
          )}

          {tab === "playground" && (
            <div className={cn(card.base, "p-4 bg-gradient-to-br from-brand/5 to-transparent")}>
              <p className="text-xs text-muted-foreground mb-3">Interactive demo — edit and experiment with the starter code.</p>
              <textarea
                defaultValue={node.codeExample ?? `// ${node.title} playground\nconsole.log("Hello, ${node.title}");`}
                className="w-full h-40 text-xs font-mono bg-muted rounded-xl p-3 border border-border resize-y"
                spellCheck={false}
              />
              <button type="button" className="mt-3 text-xs font-semibold text-brand hover:underline">Run in CampusFlow Playground (coming soon)</button>
            </div>
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
                        ? i === quiz.answer ? "border-success bg-success/10" : "border-destructive bg-destructive/10"
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
            <div className="space-y-3">
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
            <div className="space-y-3">
              {node.codingProblems.map((p) => (
                <div key={p.id} className={cn(card.base, "p-3")}>
                  <p className="text-sm font-bold">{p.title}</p>
                  <p className="text-xs text-muted-foreground mt-1">{p.statement}</p>
                  <pre className="text-[10px] bg-muted rounded-lg p-2 mt-2 overflow-x-auto">{p.solution}</pre>
                  <button type="button" onClick={() => markCodingSolved(roadmap.slug, p.id)} className="text-xs text-brand mt-2 font-semibold">
                    Mark solved
                  </button>
                </div>
              ))}
            </div>
          )}

          {tab === "cheatsheet" && (
            <div className="space-y-3">
              {node.cheatSheet?.map((c) => (
                <div key={c} className={cn(card.base, "p-3 text-sm")}>{c}</div>
              ))}
              {node.commonMistakes && (
                <section>
                  <h3 className="text-xs font-bold uppercase text-muted-foreground mb-2 flex items-center gap-1">
                    <AlertTriangle size={12} /> Common Mistakes
                  </h3>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    {node.commonMistakes.map((m) => <li key={m}>• {m}</li>)}
                  </ul>
                </section>
              )}
            </div>
          )}

          {tab === "resources" && (
            <div className="space-y-2">
              {node.learningResources.map((r) => (
                <a key={r.id} href={r.url} target="_blank" rel="noopener noreferrer" className={cn(card.base, card.hover, "p-3 flex items-center gap-2 text-sm font-medium text-brand")}>
                  <Link2 size={14} />
                  <div className="min-w-0 flex-1">
                    <p>{r.title}</p>
                    <p className="text-[10px] text-muted-foreground font-normal">{r.description}</p>
                  </div>
                  <span className={cn(badge.muted, "text-[10px]")}>{r.pricing}</span>
                </a>
              ))}
              {node.videos?.map((v) => (
                <a key={v.url} href={v.url} target="_blank" rel="noopener noreferrer" className={cn(card.base, "p-3 flex items-center gap-2 text-sm")}>
                  <Video size={14} className="text-destructive" /> {v.title}
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
                  <ul className="text-xs text-foreground space-y-0.5">
                    {p.requirements.map((r) => <li key={r}>• {r}</li>)}
                  </ul>
                </div>
              ))}
            </div>
          )}

          {tab === "ai" && (
            <div className="space-y-4">
              <div className="flex flex-wrap gap-1.5">
                {(["summary", "explain", "quiz", "interview", "review", "resources", "projects"] as const).map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => setAiMode(mode)}
                    className={cn(
                      "px-2 py-1 rounded-lg text-[10px] font-semibold capitalize border",
                      aiMode === mode ? "bg-brand/10 border-brand text-brand" : "border-border hover:bg-muted"
                    )}
                  >
                    AI {mode}
                  </button>
                ))}
              </div>
              <div className={cn(card.base, "p-4 bg-gradient-to-br from-brand/5 to-brand-accent/5")}>
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles size={16} className="text-brand" />
                  <span className="text-sm font-bold">AI {aiMode.charAt(0).toUpperCase() + aiMode.slice(1)}</span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {aiMode === "summary" && node.aiSummary}
                  {aiMode === "explain" && `Let me explain ${node.title}: ${node.theory?.slice(0, 200)}…`}
                  {aiMode === "quiz" && `I'll generate adaptive quiz questions for ${node.title} based on your progress.`}
                  {aiMode === "interview" && `Mock interview for ${node.title} with ${node.interviewQuestions.length} sample questions.`}
                  {aiMode === "review" && `Paste your ${node.title} code for AI review and improvement suggestions.`}
                  {aiMode === "resources" && `Recommended resources: ${node.learningResources.slice(0, 3).map((r) => r.title).join(", ")}.`}
                  {aiMode === "projects" && `Project ideas: ${node.projects.map((p) => p.title).join(", ")}.`}
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-border shrink-0 space-y-2">
          {nextNode && (
            <button
              type="button"
              onClick={() => onContinue?.(nextNode)}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-brand text-brand text-sm font-semibold hover:bg-brand/5"
            >
              <GraduationCap size={16} />
              Continue: {nextNode.title}
            </button>
          )}
          <button
            type="button"
            onClick={onToggleComplete}
            className={cn(button.primary, "w-full flex items-center justify-center gap-2", isComplete && "opacity-90")}
          >
            <CheckCircle2 size={16} />
            {isComplete ? "Mark Incomplete" : "Mark Complete"}
          </button>
        </div>
      </motion.aside>
    </AnimatePresence>
  );
}

function StatsGrid({ stats }: { stats: ReturnType<typeof computeNodeStats> | null }) {
  if (!stats) return null;
  const items = [
    { label: "Lessons", value: stats.lessons, icon: BookOpen },
    { label: "Projects", value: stats.projects, icon: Target },
    { label: "Interview", value: stats.interviewQuestions, icon: Briefcase },
    { label: "MCQs", value: stats.mcqs, icon: HelpCircle },
    { label: "Code", value: stats.codeExamples, icon: FileCode },
    { label: "Videos", value: stats.videos, icon: Video },
  ];
  return (
    <div className="grid grid-cols-3 gap-2">
      {items.map((item) => (
        <div key={item.label} className="p-2 rounded-xl bg-muted/50 text-center">
          <item.icon size={12} className="mx-auto text-brand mb-1" />
          <p className="text-sm font-bold">{item.value}</p>
          <p className="text-[9px] text-muted-foreground">{item.label}</p>
        </div>
      ))}
    </div>
  );
}
