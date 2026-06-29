"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Briefcase, Code2, BookOpen, TrendingUp, CheckSquare, Target, Award, ChevronDown, CheckCircle2,
} from "lucide-react";
import { card, badge, animation } from "@/lib/design-system";
import { INTERVIEW_CATEGORIES, DIFFICULTY_LEVELS } from "@/lib/roadmaps/content/constants";
import { computeReadiness } from "@/lib/roadmaps/readiness";
import { useRoadmapsStore } from "@/lib/roadmaps/store";
import type { Roadmap, InterviewCategory, RoadmapDifficulty } from "@/lib/roadmaps/types";
import { RoadmapExportMenu } from "./roadmap-export-menu";
import { cn } from "@/lib/utils";

type Props = { roadmap: Roadmap };

export function RoadmapExpandedSections({ roadmap }: Props) {
  const progress = useRoadmapsStore((s) => s.getRoadmapProgress(roadmap.slug));
  const { markInterviewPracticed, markCodingSolved, togglePortfolioItem, setReadinessFlag } = useRoadmapsStore();
  const readiness = useMemo(
    () => computeReadiness(roadmap, progress),
    [roadmap, progress]
  );

  const [interviewFilter, setInterviewFilter] = useState<{ cat: InterviewCategory | "all"; diff: RoadmapDifficulty | "all" }>({ cat: "all", diff: "all" });
  const [codingFilter, setCodingFilter] = useState<RoadmapDifficulty | "all">("all");
  const [expandedQ, setExpandedQ] = useState<string | null>(null);

  const filteredInterview = roadmap.enrichment.interviewHub.filter((q) => {
    if (interviewFilter.cat !== "all" && q.category !== interviewFilter.cat) return false;
    if (interviewFilter.diff !== "all" && q.difficulty !== interviewFilter.diff) return false;
    return true;
  });

  const filteredCoding = roadmap.enrichment.codingProblems.filter(
    (p) => codingFilter === "all" || p.difficulty === codingFilter
  );

  const practiced = new Set(progress.interviewPracticedIds ?? []);
  const solved = new Set(progress.codingSolvedIds ?? []);

  return (
    <div className="space-y-12 mt-12">
      {/* Interview Hub */}
      <section id="interview-hub">
        <SectionHeader icon={Briefcase} title="Interview Preparation Hub" count={`${roadmap.enrichment.interviewHub.length}+ questions`} />
        <div className={cn(card.base, "p-4 mb-4 flex flex-wrap gap-2")}>
          <select
            value={interviewFilter.cat}
            onChange={(e) => setInterviewFilter((f) => ({ ...f, cat: e.target.value as InterviewCategory | "all" }))}
            className="px-3 py-2 rounded-lg border border-border bg-background text-sm"
          >
            <option value="all">All categories</option>
            {INTERVIEW_CATEGORIES.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}
          </select>
          <select
            value={interviewFilter.diff}
            onChange={(e) => setInterviewFilter((f) => ({ ...f, diff: e.target.value as RoadmapDifficulty | "all" }))}
            className="px-3 py-2 rounded-lg border border-border bg-background text-sm"
          >
            <option value="all">All difficulty</option>
            {DIFFICULTY_LEVELS.map((d) => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>
        <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
          {filteredInterview.map((q) => (
            <div key={q.id} className={cn(card.base, "overflow-hidden")}>
              <button
                type="button"
                className="w-full p-4 text-left flex items-start gap-3 hover:bg-muted/50"
                onClick={() => setExpandedQ(expandedQ === q.id ? null : q.id)}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap gap-1.5 mb-1">
                    <span className={cn(badge.muted, "text-[10px] capitalize")}>{q.difficulty}</span>
                    <span className={cn(badge.muted, "text-[10px]")}>{q.category}</span>
                    {q.company && <span className={cn(badge.brand, "text-[10px]")}>{q.company}</span>}
                    {practiced.has(q.id) && <span className={cn(badge.success, "text-[10px]")}>Practiced</span>}
                  </div>
                  <p className="text-sm font-medium">{q.question}</p>
                </div>
                <ChevronDown size={16} className={cn("shrink-0 transition-transform", expandedQ === q.id && "rotate-180")} />
              </button>
              {expandedQ === q.id && (
                <div className="px-4 pb-4 space-y-3 border-t border-border pt-3">
                  <div><p className="text-xs font-bold text-muted-foreground mb-1">Answer</p><p className="text-sm">{q.answer}</p></div>
                  <div><p className="text-xs font-bold text-muted-foreground mb-1">Explanation</p><p className="text-sm text-muted-foreground">{q.explanation}</p></div>
                  <div><p className="text-xs font-bold text-muted-foreground mb-1">Common Mistakes</p><ul className="text-xs text-muted-foreground">{q.commonMistakes.map((m) => <li key={m}>• {m}</li>)}</ul></div>
                  <button type="button" onClick={() => markInterviewPracticed(roadmap.slug, q.id)} className="text-xs font-semibold text-brand hover:underline">
                    Mark as practiced
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Coding Problems */}
      <section id="coding-problems">
        <SectionHeader icon={Code2} title="Coding Problems" count={`${roadmap.enrichment.codingProblems.length} problems`} />
        <div className="flex flex-wrap gap-2 mb-4">
          {(["all", ...DIFFICULTY_LEVELS] as const).map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => setCodingFilter(d)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-semibold capitalize border",
                codingFilter === d ? "bg-brand/10 border-brand text-brand" : "border-border hover:bg-muted"
              )}
            >
              {d}
            </button>
          ))}
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          {filteredCoding.map((p) => (
            <div key={p.id} className={cn(card.base, "p-4")}>
              <div className="flex items-start justify-between gap-2 mb-2">
                <h4 className="text-sm font-bold">{p.title}</h4>
                <span className={cn(badge.muted, "text-[10px] capitalize shrink-0")}>{p.difficulty}</span>
              </div>
              <p className="text-xs text-muted-foreground mb-2 line-clamp-2">{p.statement}</p>
              <p className="text-[10px] text-muted-foreground mb-2">Time: {p.timeComplexity} · Space: {p.spaceComplexity}</p>
              <button
                type="button"
                onClick={() => markCodingSolved(roadmap.slug, p.id)}
                className={cn("text-xs font-semibold", solved.has(p.id) ? "text-success" : "text-brand hover:underline")}
              >
                {solved.has(p.id) ? "✓ Solved" : "Mark solved"}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Resources */}
      <section id="resources">
        <SectionHeader icon={BookOpen} title="Learning Resources" count={`${roadmap.enrichment.resources.length} resources`} />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {roadmap.enrichment.resources.map((r) => (
            <a key={r.id} href={r.url} target="_blank" rel="noopener noreferrer" className={cn(card.base, card.hover, "p-4 block")}>
              <p className="text-sm font-bold text-brand mb-1">{r.title}</p>
              <p className="text-xs text-muted-foreground line-clamp-2 mb-2">{r.description}</p>
              <div className="flex gap-1.5">
                <span className={cn(badge.muted, "text-[10px]")}>{r.type}</span>
                <span className={cn(badge.muted, "text-[10px] capitalize")}>{r.pricing}</span>
                <span className={cn(badge.muted, "text-[10px]")}>{r.estimatedHours}h</span>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* Career */}
      <section id="career-outlook">
        <SectionHeader icon={TrendingUp} title="Career & Salary Outlook" />
        <div className={cn(card.base, "p-5 mb-4")}>
          <p className="text-sm text-muted-foreground mb-4">{roadmap.enrichment.career.overview}</p>
          <div className="grid sm:grid-cols-2 gap-4 text-sm">
            <div><p className="font-bold mb-2">Responsibilities</p><ul className="text-muted-foreground space-y-1">{roadmap.enrichment.career.responsibilities.map((r) => <li key={r}>• {r}</li>)}</ul></div>
            <div><p className="font-bold mb-2">Career Ladder</p><p className="text-xs text-muted-foreground">{roadmap.enrichment.career.careerLadder.join(" → ")}</p></div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className={cn(card.base, "w-full min-w-[600px] text-sm")}>
            <thead><tr className="border-b border-border bg-muted/50">
              {["Region", "Entry", "Mid", "Senior", "Lead", "Architect", "Remote"].map((h) => (
                <th key={h} className="p-3 text-left text-xs font-bold">{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {roadmap.enrichment.career.salaries.map((s) => (
                <tr key={s.region} className="border-b border-border last:border-0">
                  <td className="p-3 font-medium">{s.region}</td>
                  <td className="p-3 text-muted-foreground">{s.entry}</td>
                  <td className="p-3 text-muted-foreground">{s.mid}</td>
                  <td className="p-3 text-muted-foreground">{s.senior}</td>
                  <td className="p-3 text-muted-foreground">{s.lead}</td>
                  <td className="p-3 text-muted-foreground">{s.architect}</td>
                  <td className="p-3 text-muted-foreground">{s.remote}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-muted-foreground mt-3">{roadmap.enrichment.career.salaryDisclaimer}</p>
      </section>

      {/* Learning Path */}
      <section id="learning-path">
        <SectionHeader icon={Target} title="What to Learn Next" />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {roadmap.enrichment.learningPath.nextRoadmaps.map((r) => (
            <Link key={r.slug} href={`/roadmaps/${r.slug}`} className={cn(card.base, card.hover, "p-4 block")}>
              <p className="font-bold text-sm text-brand">{r.title}</p>
              <p className="text-xs text-muted-foreground mt-1">{r.reason}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Portfolio */}
      <section id="portfolio-checklist">
        <SectionHeader icon={CheckSquare} title="Portfolio Checklist" />
        <div className={cn(card.base, "p-4 grid sm:grid-cols-2 gap-2")}>
          {roadmap.enrichment.portfolioChecklist.map((item) => (
            <label key={item.id} className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted cursor-pointer text-sm">
              <input
                type="checkbox"
                checked={!!progress.portfolioCompleted[item.id]}
                onChange={() => togglePortfolioItem(roadmap.slug, item.id)}
                className="rounded"
              />
              {item.label}
            </label>
          ))}
        </div>
        <div className={cn(card.base, "p-4 mt-4 grid sm:grid-cols-2 lg:grid-cols-4 gap-3")}>
          {(["resumeReady", "githubReady", "linkedinReady", "mockInterviewDone"] as const).map((flag) => (
            <label key={flag} className="flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="checkbox"
                checked={!!progress[flag]}
                onChange={(e) => setReadinessFlag(roadmap.slug, flag, e.target.checked)}
              />
              {flag.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase())}
            </label>
          ))}
        </div>
      </section>

      {/* Readiness */}
      <section id="readiness-score">
        <SectionHeader icon={Award} title="Job Readiness Score" count={`${readiness.overall}%`} />
        <motion.div {...animation.fadeUp} className={cn(card.base, "p-6")}>
          <div className="flex items-center justify-between mb-4">
            <p className="text-3xl font-extrabold text-brand">{readiness.overall}%</p>
            {readiness.isComplete ? (
              <span className={cn(badge.success, "flex items-center gap-1")}><CheckCircle2 size={14} /> Roadmap Complete</span>
            ) : (
              <span className={cn(badge.warning)}>Complete all sections for 100%</span>
            )}
          </div>
          <div className="h-3 rounded-full bg-muted overflow-hidden mb-6">
            <div className="h-full bg-gradient-to-r from-brand to-brand-accent transition-all" style={{ width: `${readiness.overall}%` }} />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {Object.entries(readiness).filter(([k]) => k !== "overall" && k !== "isComplete").map(([key, val]) => (
              <div key={key} className="p-3 rounded-xl bg-muted/50">
                <p className="text-[10px] uppercase font-bold text-muted-foreground mb-1">{key.replace(/([A-Z])/g, " $1")}</p>
                <p className="text-lg font-bold">{val as number}%</p>
              </div>
            ))}
          </div>
        </motion.div>
        <div className="mt-6 flex justify-center">
          <RoadmapExportMenu roadmap={roadmap} />
        </div>
      </section>
    </div>
  );
}

function SectionHeader({ icon: Icon, title, count }: { icon: typeof Briefcase; title: string; count?: string }) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <div className="w-10 h-10 rounded-xl bg-brand/10 flex items-center justify-center">
        <Icon size={20} className="text-brand" />
      </div>
      <div>
        <h2 className="text-xl font-bold">{title}</h2>
        {count && <p className="text-xs text-muted-foreground">{count}</p>}
      </div>
    </div>
  );
}
