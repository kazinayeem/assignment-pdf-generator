"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { MessageSquare, Users, Building2, Video, ArrowRight, BookOpen } from "lucide-react";
import { CareerPageHeader } from "./career-page-header";
import { TECHNICAL_SUBJECTS, BEHAVIORAL_TOPICS, HR_QUESTIONS } from "@/lib/career/interview";

export function InterviewHubClient() {
  return (
    <div>
      <CareerPageHeader title="Interview Prep Hub" description="Technical subjects, behavioral prep, HR questions, and mock interviews — everything you need to ace your interviews." icon={MessageSquare} badge={`${TECHNICAL_SUBJECTS.length} Technical Topics`} />
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
        <Link href="/career/interview/mock" className="glass-card p-6 flex items-center gap-4 hover:border-brand/30 transition-colors group">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-brand to-brand-accent flex items-center justify-center">
            <Video size={24} className="text-white" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-lg group-hover:text-brand transition-colors">Mock Interview Simulator</h3>
            <p className="text-sm text-slate-500">Timed practice with scoring and performance analytics</p>
          </div>
          <ArrowRight size={20} className="text-slate-400 group-hover:text-brand" />
        </Link>

        <section>
          <div className="flex items-center gap-2 mb-6">
            <BookOpen size={20} className="text-brand" />
            <h2 className="text-xl font-bold">Technical Interviews</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {TECHNICAL_SUBJECTS.map((s, i) => (
              <motion.div key={s.slug} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.02 }}>
                <Link href={`/career/interview/${s.slug}`} className="glass-card p-4 block h-full hover:border-brand/30 transition-colors group">
                  <h3 className="font-bold text-sm group-hover:text-brand transition-colors mb-1">{s.title}</h3>
                  <p className="text-xs text-slate-500 line-clamp-2">{s.description}</p>
                </Link>
              </motion.div>
            ))}
          </div>
        </section>

        <section>
          <div className="flex items-center gap-2 mb-6">
            <Users size={20} className="text-[#8B5CF6]" />
            <h2 className="text-xl font-bold">Behavioral Interviews</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {BEHAVIORAL_TOPICS.map((t) => (
              <div key={t.slug} className="glass-card p-4">
                <h3 className="font-bold text-sm mb-2">{t.title}</h3>
                <p className="text-xs text-slate-500 mb-2">{t.tip}</p>
                <p className="text-xs text-brand font-medium">STAR: {t.star}</p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <div className="flex items-center gap-2 mb-6">
            <Building2 size={20} className="text-[#10B981]" />
            <h2 className="text-xl font-bold">HR Interview Questions</h2>
          </div>
          <div className="space-y-3">
            {HR_QUESTIONS.map((q) => (
              <div key={q.q} className="glass-card p-4">
                <h3 className="font-bold text-sm mb-2">{q.q}</h3>
                <p className="text-sm text-slate-600 dark:text-slate-300 mb-1"><strong>Best answer:</strong> {q.a}</p>
                <p className="text-xs text-red-500"><strong>Mistake:</strong> {q.mistake}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
