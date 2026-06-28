import Link from "next/link";
import { GraduationCap, Trophy, TrendingUp } from "lucide-react";
import { ALL_SUBJECT_REGISTRIES } from "@/lib/learning/topics-registry";
import { getQuestionCount } from "@/lib/learning/question-bank";

export const metadata = { title: "Exam Center | CampusFlow Learning" };

export default function ExamCenterPage() {
  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#6D5DF6]/10 text-[#6D5DF6] text-sm font-semibold mb-4 border border-[#6D5DF6]/20">
          <GraduationCap size={14} /> Exam & Quiz Center
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mb-3">Learning Exams</h1>
        <p className="text-slate-500 max-w-2xl">Practice quizzes, timed exams, mock university tests, interview prep, and final assessments with certificates.</p>
      </div>

      <div className="flex flex-wrap gap-3 mb-10">
        <Link href="/tools/learning/progress" className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-white/5 text-sm font-medium min-h-[44px] hover:bg-[#6D5DF6]/10 hover:text-[#6D5DF6] transition-colors">
          <TrendingUp size={16} /> Progress
        </Link>
        <Link href="/tools/learning/leaderboard" className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-white/5 text-sm font-medium min-h-[44px] hover:bg-[#6D5DF6]/10 hover:text-[#6D5DF6] transition-colors">
          <Trophy size={16} /> Leaderboard
        </Link>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {ALL_SUBJECT_REGISTRIES.map((subject) => (
          <Link key={subject.slug} href={`/tools/exam/${subject.slug}`} className="glass-card p-5 hover:border-[#6D5DF6]/30 transition-colors group">
            <h3 className="font-bold text-lg group-hover:text-[#6D5DF6] transition-colors">{subject.title}</h3>
            <p className="text-sm text-slate-500 mt-1 line-clamp-2">{subject.description}</p>
            <p className="text-xs text-slate-400 mt-3">{getQuestionCount(subject.slug)}+ questions · {subject.categories.flatMap((c) => c.topics).length} topics</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
