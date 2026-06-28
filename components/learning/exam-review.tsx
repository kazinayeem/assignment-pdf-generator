"use client";

import { motion } from "framer-motion";
import { Trophy, Clock, Target, TrendingUp, AlertTriangle, BookOpen, Download } from "lucide-react";
import type { ExamResult } from "@/lib/learning/types";
import { getRegistryTopic } from "@/lib/learning/topics-registry";
import { getAllQuestions } from "@/lib/learning/question-bank";
import { ToolsButton } from "@/components/tools/tools-button";
import { cn } from "@/lib/utils";

type ExamReviewProps = {
  result: ExamResult;
  onRetry?: () => void;
  onCertificate?: () => void;
};

export function ExamReview({ result, onRetry, onCertificate }: ExamReviewProps) {
  const questions = getAllQuestions();
  const accuracy = result.total > 0 ? Math.round((result.score / result.total) * 100) : 0;
  const wrong = result.answers.filter((a) => !a.correct && !a.skipped);
  const skipped = result.answers.filter((a) => a.skipped);
  const weakTopics = Object.entries(result.topicBreakdown)
    .filter(([, v]) => v.total > 0 && v.correct / v.total < 0.5)
    .map(([t]) => t);

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="glass-card p-8 text-center">
        <div className={cn("w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center", result.passed ? "bg-emerald-500/10" : "bg-amber-500/10")}>
          <Trophy size={32} className={result.passed ? "text-emerald-500" : "text-amber-500"} />
        </div>
        <h2 className="text-2xl font-extrabold mb-1">{result.passed ? "Passed!" : "Keep Practicing"}</h2>
        <p className="text-5xl font-extrabold text-[#6D5DF6] tabular-nums my-3">{result.score}/{result.total}</p>
        <p className="text-slate-500 capitalize">{result.mode.replace(/-/g, " ")} · {result.difficulty} · {accuracy}% accuracy</p>
        <div className="flex justify-center gap-6 mt-4 text-sm text-slate-500">
          <span className="flex items-center gap-1"><Clock size={14} /> {Math.floor(result.timeTakenSeconds / 60)}m {result.timeTakenSeconds % 60}s</span>
          <span className="flex items-center gap-1"><Target size={14} /> {result.answers.filter((a) => a.correct).length} correct</span>
        </div>
        <div className="flex flex-wrap justify-center gap-3 mt-6">
          {onRetry && <ToolsButton variant="secondary" onClick={onRetry}>Try Again</ToolsButton>}
          {result.passed && onCertificate && <ToolsButton onClick={onCertificate}><Download size={16} /> Get Certificate</ToolsButton>}
        </div>
      </motion.div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Correct", value: result.answers.filter((a) => a.correct).length, color: "text-emerald-500" },
          { label: "Wrong", value: wrong.length, color: "text-red-500" },
          { label: "Skipped", value: skipped.length, color: "text-slate-400" },
          { label: "Accuracy", value: `${accuracy}%`, color: "text-[#6D5DF6]" },
        ].map((s) => (
          <div key={s.label} className="glass-card p-4 text-center">
            <p className={cn("text-2xl font-extrabold tabular-nums", s.color)}>{s.value}</p>
            <p className="text-xs text-slate-500">{s.label}</p>
          </div>
        ))}
      </div>

      {Object.keys(result.topicBreakdown).length > 1 && (
        <div className="glass-card p-5">
          <h3 className="font-bold mb-4 flex items-center gap-2"><TrendingUp size={18} className="text-[#6D5DF6]" /> Topic-wise Analysis</h3>
          <div className="space-y-3">
            {Object.entries(result.topicBreakdown).map(([topic, data]) => {
              const pct = data.total > 0 ? Math.round((data.correct / data.total) * 100) : 0;
              const reg = getRegistryTopic(result.subjectSlug, topic);
              return (
                <div key={topic}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-600 dark:text-slate-300">{reg?.title ?? topic}</span>
                    <span className="text-slate-400">{data.correct}/{data.total} ({pct}%)</span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-100 dark:bg-white/10 overflow-hidden">
                    <div className="h-full rounded-full bg-gradient-to-r from-[#6D5DF6] to-[#06B6D4]" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {weakTopics.length > 0 && (
        <div className="glass-card p-5">
          <h3 className="font-bold mb-3 flex items-center gap-2"><AlertTriangle size={18} className="text-amber-500" /> Weak Areas</h3>
          <div className="flex flex-wrap gap-2">
            {weakTopics.map((t) => {
              const reg = getRegistryTopic(result.subjectSlug, t);
              return <span key={t} className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-700 text-sm">{reg?.title ?? t}</span>;
            })}
          </div>
          <p className="text-sm text-slate-500 mt-3">Review these topics and retake practice quizzes to improve.</p>
        </div>
      )}

      {wrong.length > 0 && (
        <div className="glass-card p-5">
          <h3 className="font-bold mb-4 flex items-center gap-2"><BookOpen size={18} /> Review Wrong Answers</h3>
          <div className="space-y-4">
            {wrong.slice(0, 10).map((a) => {
              const q = questions.find((x) => x.id === a.questionId);
              if (!q) return null;
              return (
                <div key={a.questionId} className="p-4 rounded-xl bg-red-500/5 border border-red-500/10">
                  <p className="font-medium text-sm text-slate-800 dark:text-slate-100 mb-2">{q.question}</p>
                  <p className="text-sm text-emerald-600 mb-1">Answer: {typeof q.answer === "number" && q.options ? q.options[q.answer] : String(q.answer)}</p>
                  <p className="text-xs text-slate-500">{q.explanation}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
