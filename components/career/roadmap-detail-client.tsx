"use client";

import Link from "next/link";
import { ArrowLeft, Clock, CheckCircle2 } from "lucide-react";
import type { CareerRoadmap } from "@/lib/career/types";

export function RoadmapDetailClient({ roadmap }: { roadmap: CareerRoadmap }) {
  return (
    <div>
      <div className="border-b border-border dark:border-white/10">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Link href="/career/roadmaps" className="inline-flex items-center gap-1 text-sm text-brand mb-4 hover:underline">
            <ArrowLeft size={14} /> All Roadmaps
          </Link>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mb-2">{roadmap.title}</h1>
          <p className="text-slate-500 max-w-2xl mb-3">{roadmap.description}</p>
          <span className="inline-flex items-center gap-1 text-sm text-slate-400"><Clock size={14} /> Estimated timeline: {roadmap.estimatedMonths} months</span>
        </div>
      </div>

      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {roadmap.phases.map((phase, i) => (
          <div key={phase.title} className="glass-card p-6">
            <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-brand/10 text-brand text-sm font-bold flex items-center justify-center">{i + 1}</span>
              {phase.title}
            </h2>
            <ul className="space-y-2">
              {phase.items.map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-300">
                  <CheckCircle2 size={16} className="text-emerald-500 shrink-0 mt-0.5" /> {item}
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { title: "Skills", items: roadmap.skills },
            { title: "Courses", items: roadmap.courses },
            { title: "Projects", items: roadmap.projects },
            { title: "Certifications", items: roadmap.certifications },
            { title: "Interview Prep", items: roadmap.interviewPrep },
          ].map((section) => (
            <div key={section.title} className="glass-card p-5">
              <h3 className="font-bold mb-3">{section.title}</h3>
              {section.items.length === 0 ? (
                <p className="text-sm text-slate-400">Optional — build portfolio projects instead.</p>
              ) : (
                <ul className="space-y-1">
                  {section.items.map((item) => <li key={item} className="text-sm text-slate-600 dark:text-slate-300">• {item}</li>)}
                </ul>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
