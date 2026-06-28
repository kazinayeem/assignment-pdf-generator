"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Video, Timer, Camera, Mic } from "lucide-react";
import { MOCK_QUESTIONS } from "@/lib/career/interview";
import { useCareerStore } from "@/lib/career-store";
import { ToolsButton } from "@/components/tools/tools-button";
import { cn } from "@/lib/utils";

type Category = "hr" | "technical" | "behavioral" | "mixed";
type Difficulty = "easy" | "medium" | "hard";

const DIFFICULTY_TIME: Record<Difficulty, number> = { easy: 120, medium: 90, hard: 60 };

export function MockInterviewClient() {
  const { addMockResult } = useCareerStore();
  const [category, setCategory] = useState<Category>("mixed");
  const [difficulty, setDifficulty] = useState<Difficulty>("medium");
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [qIndex, setQIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(90);
  const [answer, setAnswer] = useState("");
  const [questions, setQuestions] = useState<string[]>([]);

  const currentQ = questions[qIndex];

  const handleNext = useCallback((timedOut = false) => {
    const earned = timedOut ? 0 : answer.trim().length > 50 ? 20 : answer.trim().length > 20 ? 12 : 5;
    const newScore = score + earned;
    if (qIndex >= questions.length - 1) {
      setScore(newScore);
      setFinished(true);
      addMockResult({ category, score: newScore, questionsAnswered: questions.length });
    } else {
      setScore(newScore);
      setQIndex(qIndex + 1);
      setTimeLeft(DIFFICULTY_TIME[difficulty]);
      setAnswer("");
    }
  }, [answer, qIndex, questions.length, score, difficulty, category, addMockResult]);

  useEffect(() => {
    if (!started || finished) return;
    if (timeLeft <= 0) {
      handleNext(true);
      return;
    }
    const t = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearTimeout(t);
  }, [started, finished, timeLeft, handleNext]);

  const handleStart = () => {
    const pool = [...MOCK_QUESTIONS[category]];
    setQuestions(pool.sort(() => Math.random() - 0.5).slice(0, 5));
    setStarted(true);
    setFinished(false);
    setQIndex(0);
    setScore(0);
    setTimeLeft(DIFFICULTY_TIME[difficulty]);
    setAnswer("");
  };

  return (
    <div>
      <div className="border-b border-[#E5E7EB] dark:border-white/10">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Link href="/career/interview" className="inline-flex items-center gap-1 text-sm text-[#6D5DF6] mb-4 hover:underline">
            <ArrowLeft size={14} /> Back to Interview Hub
          </Link>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mb-2">Mock Interview</h1>
          <p className="text-slate-500">Practice with timed questions, scoring, and performance analytics.</p>
        </div>
      </div>

      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!started && (
          <div className="glass-card p-6 max-w-xl mx-auto space-y-4">
            <div>
              <label className="text-xs font-bold uppercase text-slate-500 mb-2 block">Category</label>
              <div className="flex flex-wrap gap-2">
                {(["hr", "technical", "behavioral", "mixed"] as Category[]).map((c) => (
                  <button key={c} type="button" onClick={() => setCategory(c)} className={cn("px-4 py-2 rounded-xl text-sm capitalize min-h-[44px]", category === c ? "gradient-primary text-white" : "bg-slate-100 dark:bg-white/5")}>{c}</button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-xs font-bold uppercase text-slate-500 mb-2 block">Difficulty</label>
              <div className="flex flex-wrap gap-2">
                {(["easy", "medium", "hard"] as Difficulty[]).map((d) => (
                  <button key={d} type="button" onClick={() => setDifficulty(d)} className={cn("px-4 py-2 rounded-xl text-sm capitalize min-h-[44px]", difficulty === d ? "gradient-primary text-white" : "bg-slate-100 dark:bg-white/5")}>{d}</button>
                ))}
              </div>
            </div>
            <ToolsButton onClick={handleStart} className="w-full justify-center"><Video size={16} /> Start Mock Interview</ToolsButton>
          </div>
        )}

        {started && !finished && currentQ && (
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-500">Question {qIndex + 1} of {questions.length}</span>
                <span className={cn("flex items-center gap-1 text-sm font-bold tabular-nums", timeLeft <= 15 ? "text-red-500" : "text-[#6D5DF6]")}>
                  <Timer size={16} /> {timeLeft}s
                </span>
              </div>
              <div className="glass-card p-6">
                <p className="text-lg font-semibold text-slate-800 dark:text-slate-100">{currentQ}</p>
              </div>
              <textarea
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Type your answer here..."
                className="w-full min-h-[160px] rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 p-4 text-sm outline-none focus:border-[#6D5DF6]/50"
              />
              <ToolsButton onClick={() => handleNext()}>Next Question</ToolsButton>
            </div>
            <div className="space-y-4">
              <div className="glass-card p-4 aspect-video flex items-center justify-center bg-slate-100 dark:bg-white/5 border-dashed">
                <div className="text-center text-slate-400">
                  <Camera size={32} className="mx-auto mb-2" />
                  <p className="text-xs">Webcam Placeholder</p>
                </div>
              </div>
              <div className="glass-card p-4 flex items-center justify-center bg-slate-100 dark:bg-white/5 border-dashed">
                <div className="text-center text-slate-400">
                  <Mic size={32} className="mx-auto mb-2" />
                  <p className="text-xs">Voice Mode (Coming Soon)</p>
                </div>
              </div>
              <div className="glass-card p-4 text-center">
                <p className="text-xs text-slate-500">Current Score</p>
                <p className="text-3xl font-extrabold text-[#6D5DF6]">{score}</p>
              </div>
            </div>
          </div>
        )}

        {finished && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="glass-card p-8 max-w-lg mx-auto text-center">
            <h2 className="text-2xl font-extrabold mb-2">Interview Complete!</h2>
            <p className="text-5xl font-extrabold text-[#6D5DF6] mb-2">{score}/100</p>
            <p className="text-sm text-slate-500 mb-6">{questions.length} questions answered · {category} · {difficulty}</p>
            <p className="text-sm text-slate-600 dark:text-slate-300 mb-6">AI feedback placeholder: Focus on structuring answers with STAR method and providing specific examples.</p>
            <ToolsButton onClick={() => { setStarted(false); setFinished(false); }}>Try Again</ToolsButton>
          </motion.div>
        )}
      </div>
    </div>
  );
}
