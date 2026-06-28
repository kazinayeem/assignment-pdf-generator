"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, XCircle, Clock, ChevronRight, SkipForward } from "lucide-react";
import type { ExamConfig, QuizQuestion, QuizDifficulty } from "@/lib/learning/types";
import { checkAnswer, selectQuestions, scoreExam } from "@/lib/learning/question-engine";
import { getAllQuestions } from "@/lib/learning/question-bank";
import { useExamStore } from "@/lib/exam-store";
import { useLearningStore } from "@/lib/learning-store";
import { ToolsButton } from "@/components/tools/tools-button";
import { cn } from "@/lib/utils";

type QuizRunnerProps = {
  config: ExamConfig;
  onComplete: (result: ReturnType<typeof scoreExam>) => void;
  onCancel?: () => void;
};

export function QuizRunner({ config, onComplete, onCancel }: QuizRunnerProps) {
  const { seenQuestionIds, markQuestionsSeen } = useExamStore();
  const { markCompleted } = useLearningStore();
  const [difficulty, setDifficulty] = useState<QuizDifficulty | "all">(config.difficulty ?? "all");
  const [started, setStarted] = useState(false);
  const [qIndex, setQIndex] = useState(0);
  const [answers, setAnswers] = useState<Map<string, QuizQuestion["answer"] | null>>(new Map());
  const [times, setTimes] = useState<Map<string, number>>(new Map());
  const [selected, setSelected] = useState<QuizQuestion["answer"] | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [timeLeft, setTimeLeft] = useState((config.timeLimitMinutes ?? 0) * 60);
  const [qStart, setQStart] = useState(Date.now());

  const fullConfig = useMemo(() => ({ ...config, difficulty }), [config, difficulty]);

  const questions = useMemo(() => {
    if (!started) return [];
    return selectQuestions(getAllQuestions(), fullConfig, seenQuestionIds);
  }, [started, fullConfig, seenQuestionIds]);

  const current = questions[qIndex];
  const isPractice = config.mode === "practice";
  const isLast = qIndex >= questions.length - 1;

  const finishExam = useCallback(() => {
    const result = scoreExam(questions, answers, times, fullConfig);
    markQuestionsSeen(questions.map((q) => q.id));
    if (result.passed && config.topicSlug) {
      markCompleted(`/tools/${config.subjectSlug}/${config.topicSlug}`);
    }
    onComplete(result);
  }, [questions, answers, times, fullConfig, config, markQuestionsSeen, markCompleted, onComplete]);

  useEffect(() => {
    if (!started || !config.timeLimitMinutes) return;
    if (timeLeft <= 0) {
      finishExam();
      return;
    }
    const t = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearTimeout(t);
  }, [started, timeLeft, config.timeLimitMinutes, finishExam]);

  const submitAnswer = () => {
    if (!current) return;
    const elapsed = Math.round((Date.now() - qStart) / 1000);
    const newAnswers = new Map(answers);
    newAnswers.set(current.id, selected);
    const newTimes = new Map(times);
    newTimes.set(current.id, elapsed);
    setAnswers(newAnswers);
    setTimes(newTimes);

    if (isPractice && config.showExplanations) {
      setShowFeedback(true);
      return;
    }

    if (isLast) finishExam();
    else {
      setQIndex(qIndex + 1);
      setSelected(null);
      setQStart(Date.now());
    }
  };

  const nextAfterFeedback = () => {
    setShowFeedback(false);
    if (isLast) finishExam();
    else {
      setQIndex(qIndex + 1);
      setSelected(null);
      setQStart(Date.now());
    }
  };

  const skip = () => {
    if (!current) return;
    const newAnswers = new Map(answers);
    newAnswers.set(current.id, null);
    setAnswers(newAnswers);
    if (isLast) finishExam();
    else {
      setQIndex(qIndex + 1);
      setSelected(null);
      setQStart(Date.now());
    }
  };

  if (!started) {
    return (
      <div className="glass-card p-6 sm:p-8 max-w-xl mx-auto space-y-5">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white capitalize">{config.mode.replace(/-/g, " ")} Mode</h2>
        <p className="text-sm text-slate-500">{config.questionCount} questions{config.timeLimitMinutes ? ` · ${config.timeLimitMinutes} min limit` : ""}{config.negativeMarking ? " · Negative marking" : ""}</p>
        <div>
          <label className="text-xs font-bold uppercase text-slate-500 mb-2 block">Difficulty</label>
          <div className="flex flex-wrap gap-2">
            {(["all", "easy", "medium", "hard", "expert"] as const).map((d) => (
              <button key={d} type="button" onClick={() => setDifficulty(d)} className={cn("px-3 py-2 rounded-xl text-sm capitalize min-h-[44px]", difficulty === d ? "gradient-primary text-white" : "bg-slate-100 dark:bg-white/5")}>{d}</button>
            ))}
          </div>
        </div>
        <div className="flex gap-3">
          <ToolsButton onClick={() => setStarted(true)} className="flex-1 justify-center">Start Exam</ToolsButton>
          {onCancel && <ToolsButton variant="secondary" onClick={onCancel}>Cancel</ToolsButton>}
        </div>
      </div>
    );
  }

  if (!current) return null;

  const isCorrect = showFeedback && checkAnswer(current, selected);

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      <div className="flex items-center justify-between text-sm text-slate-500">
        <span>Question {qIndex + 1} of {questions.length}</span>
        {config.timeLimitMinutes && (
          <span className={cn("flex items-center gap-1 font-bold tabular-nums", timeLeft <= 60 ? "text-red-500" : "text-[#6D5DF6]")}>
            <Clock size={14} /> {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, "0")}
          </span>
        )}
      </div>

      <div className="h-2 rounded-full bg-slate-100 dark:bg-white/10 overflow-hidden">
        <motion.div animate={{ width: `${((qIndex + 1) / questions.length) * 100}%` }} className="h-full bg-gradient-to-r from-[#6D5DF6] to-[#06B6D4]" />
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={current.id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="glass-card p-6">
          <div className="flex gap-2 mb-3">
            <span className="text-xs px-2 py-0.5 rounded-full bg-[#6D5DF6]/10 text-[#6D5DF6] capitalize">{current.difficulty}</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 dark:bg-white/5 text-slate-500 capitalize">{current.type.replace(/-/g, " ")}</span>
          </div>
          <p className="text-base sm:text-lg font-semibold text-slate-800 dark:text-slate-100 mb-5">{current.question}</p>

          {current.type === "true-false" || current.type === "mcq" || current.type === "scenario" ? (
            <div className="space-y-2">
              {(current.options ?? []).map((opt, i) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => !showFeedback && setSelected(current.type === "true-false" ? i === 0 : i)}
                  disabled={showFeedback}
                  className={cn(
                    "w-full text-left px-4 py-3 rounded-xl text-sm min-h-[44px] transition-colors",
                    showFeedback && i === (typeof current.answer === "number" ? current.answer : current.answer ? 0 : 1) ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-700" :
                    showFeedback && selected === (current.type === "true-false" ? i === 0 : i) && !isCorrect ? "bg-red-500/10 border border-red-500/30 text-red-700" :
                    selected === (current.type === "true-false" ? i === 0 : i) ? "bg-[#6D5DF6]/10 border border-[#6D5DF6]/30" :
                    "bg-slate-50 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 border border-transparent"
                  )}
                >
                  {opt}
                </button>
              ))}
            </div>
          ) : current.type === "fill-blank" || current.type === "short-answer" ? (
            <input
              value={typeof selected === "string" ? selected : ""}
              onChange={(e) => setSelected(e.target.value)}
              disabled={showFeedback}
              placeholder="Type your answer..."
              className="w-full rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 p-3 text-sm min-h-[44px] outline-none focus:border-[#6D5DF6]/50"
            />
          ) : null}

          {showFeedback && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className={cn("mt-4 p-4 rounded-xl flex gap-3", isCorrect ? "bg-emerald-500/10" : "bg-amber-500/10")}>
              {isCorrect ? <CheckCircle2 className="text-emerald-500 shrink-0" size={20} /> : <XCircle className="text-amber-500 shrink-0" size={20} />}
              <div>
                <p className="font-semibold text-sm mb-1">{isCorrect ? "Correct!" : "Not quite"}</p>
                <p className="text-sm text-slate-600 dark:text-slate-300">{current.explanation}</p>
              </div>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>

      <div className="flex gap-3">
        {!showFeedback ? (
          <>
            <ToolsButton onClick={submitAnswer} disabled={selected === null} className="flex-1 justify-center">
              {isLast ? "Finish" : "Submit"} <ChevronRight size={16} />
            </ToolsButton>
            <ToolsButton variant="secondary" onClick={skip}><SkipForward size={16} /> Skip</ToolsButton>
          </>
        ) : (
          <ToolsButton onClick={nextAfterFeedback} className="flex-1 justify-center">
            {isLast ? "View Results" : "Next Question"} <ChevronRight size={16} />
          </ToolsButton>
        )}
      </div>
    </div>
  );
}
