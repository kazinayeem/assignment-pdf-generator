"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { GraduationCap, Clock, Target, Zap, BookOpen, Trophy, ArrowRight } from "lucide-react";
import type { ExamMode } from "@/lib/learning/types";
import { buildExamConfig } from "@/lib/learning/question-engine";
import { getQuestionCount } from "@/lib/learning/question-bank";
import { ALL_SUBJECT_REGISTRIES } from "@/lib/learning/topics-registry";
import { QuizRunner } from "./quiz-runner";
import { ExamReview } from "./exam-review";
import { CertificateView } from "./certificate-view";
import { useExamStore } from "@/lib/exam-store";
import type { Certificate, ExamResult } from "@/lib/learning/types";

const MODES: { id: ExamMode; label: string; desc: string; icon: typeof BookOpen }[] = [
  { id: "practice", label: "Practice", desc: "Unlimited attempts, instant feedback", icon: BookOpen },
  { id: "timed", label: "Timed Exam", desc: "Countdown timer, auto submit", icon: Clock },
  { id: "mock-university", label: "Mock University", desc: "Negative marking, full analysis", icon: GraduationCap },
  { id: "interview", label: "Interview Prep", desc: "Company-style assessments", icon: Target },
  { id: "final-assessment", label: "Final Assessment", desc: "Complete subject exam + certificate", icon: Trophy },
];

type ExamHubClientProps = {
  subjectSlug: string;
  topicSlug?: string;
};

export function ExamHubClient({ subjectSlug, topicSlug }: ExamHubClientProps) {
  const subject = ALL_SUBJECT_REGISTRIES.find((s) => s.slug === subjectSlug);
  const [mode, setMode] = useState<ExamMode | null>(null);
  const [result, setResult] = useState<ExamResult | null>(null);
  const [cert, setCert] = useState<Certificate | null>(null);
  const { recordExam, issueCertificate, studentName } = useExamStore();

  const qCount = getQuestionCount(subjectSlug, topicSlug);

  const handleComplete = (r: Omit<ExamResult, "id" | "completedAt">) => {
    const full = recordExam(r);
    setResult(full);
    if (full.passed && (full.mode === "final-assessment" || full.percentage >= 90)) {
      const c = issueCertificate({
        studentName,
        subject: subject?.title ?? subjectSlug,
        topic: topicSlug,
        score: full.percentage,
        type: full.mode === "final-assessment" ? "final-exam" : "excellence",
      });
      setCert(c);
    }
  };

  if (result) {
    return (
      <div className="py-8 px-4">
        <ExamReview
          result={result}
          onRetry={() => { setResult(null); setMode(null); setCert(null); }}
          onCertificate={cert ? undefined : () => {}}
        />
        {cert && <div className="mt-8"><CertificateView cert={cert} /></div>}
      </div>
    );
  }

  if (mode) {
    const config = buildExamConfig(mode, subjectSlug, topicSlug);
    if (topicSlug) config.topicSlug = topicSlug;
    return (
      <div className="py-8 px-4">
        <QuizRunner config={config} onComplete={handleComplete} onCancel={() => setMode(null)} />
      </div>
    );
  }

  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mb-2">
          {topicSlug ? `${topicSlug.replace(/-/g, " ")} Quiz` : `${subject?.title ?? subjectSlug} Exams`}
        </h1>
        <p className="text-slate-500">{qCount}+ questions available · Choose your exam mode</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {MODES.map((m, i) => (
          <motion.button
            key={m.id}
            type="button"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            onClick={() => setMode(m.id)}
            className="glass-card p-5 text-left hover:border-brand/30 transition-colors group"
          >
            <m.icon size={24} className="text-brand mb-3" />
            <h3 className="font-bold group-hover:text-brand transition-colors">{m.label}</h3>
            <p className="text-sm text-slate-500 mt-1">{m.desc}</p>
          </motion.button>
        ))}
      </div>

      {!topicSlug && subject && (
        <div>
          <h2 className="text-lg font-bold mb-4">Topic Quizzes</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {subject.categories.flatMap((c) => c.topics).map((t) => (
              <Link key={t.slug} href={`/tools/exam/${subjectSlug}/${t.slug}`} className="glass-card p-4 flex items-center justify-between hover:border-brand/30 transition-colors group">
                <div>
                  <p className="font-semibold text-sm group-hover:text-brand">{t.title}</p>
                  <p className="text-xs text-slate-400">{getQuestionCount(subjectSlug, t.slug)} questions</p>
                </div>
                <ArrowRight size={16} className="text-slate-400 group-hover:text-brand" />
              </Link>
            ))}
          </div>
        </div>
      )}

      <div className="mt-8 flex gap-3">
        <Link href="/tools/learning/progress" className="inline-flex items-center gap-2 text-sm text-brand font-medium hover:underline">
          <Zap size={14} /> View Progress
        </Link>
        <Link href="/tools/learning/leaderboard" className="inline-flex items-center gap-2 text-sm text-brand font-medium hover:underline">
          <Trophy size={14} /> Leaderboard
        </Link>
      </div>
    </div>
  );
}
