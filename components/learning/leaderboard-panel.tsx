"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Medal, Flame } from "lucide-react";
import { useExamStore } from "@/lib/exam-store";

type Scope = "global" | "weekly" | "monthly";

export function LeaderboardPanel() {
  const [scope, setScope] = useState<Scope>("global");
  const { getLeaderboard } = useExamStore();
  const board = getLeaderboard(scope);

  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mb-2">Leaderboard</h1>
      <p className="text-slate-500 mb-6">Compete with learners worldwide</p>

      <div className="flex flex-wrap gap-2 mb-6">
        {(["global", "weekly", "monthly"] as Scope[]).map((s) => (
          <button key={s} type="button" onClick={() => setScope(s)} className={`px-4 py-2 rounded-xl text-sm font-medium capitalize min-h-[44px] ${scope === s ? "gradient-primary text-white" : "bg-slate-100 dark:bg-white/5"}`}>
            {s}
          </button>
        ))}
      </div>

      <div className="glass-card overflow-hidden">
        {board.map((entry, i) => (
          <motion.div
            key={entry.id}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.03 }}
            className={`flex items-center gap-4 p-4 sm:p-5 border-b border-slate-100 dark:border-white/5 last:border-0 ${entry.id === "you" ? "bg-brand/5" : ""}`}
          >
            <div className="w-8 text-center font-bold text-slate-400">
              {i === 0 ? <Medal className="text-amber-500 mx-auto" size={20} /> : i === 1 ? <Medal className="text-slate-400 mx-auto" size={20} /> : i === 2 ? <Medal className="text-amber-700 mx-auto" size={20} /> : i + 1}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-slate-800 dark:text-slate-100 truncate">{entry.name}{entry.id === "you" ? " (You)" : ""}</p>
              {entry.university && <p className="text-xs text-slate-400">{entry.university} · {entry.department}</p>}
            </div>
            <div className="text-right shrink-0">
              <p className="font-bold text-brand tabular-nums">{entry.score.toLocaleString()}</p>
              <p className="text-xs text-slate-400 flex items-center gap-1 justify-end"><Flame size={10} /> {entry.streak}d · {entry.examsTaken} exams</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
