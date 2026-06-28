"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight, BookOpen, Target, FileText, Video, Zap } from "lucide-react";
import type { RegistryTopic } from "@/lib/learning/types";
import { getAdjacentTopics, getTopicHref } from "@/lib/learning/topics-registry";
import { Section, InfoCard, InterviewQuestion } from "@/components/tools/topic-primitives";
import { ToolsButton } from "@/components/tools/tools-button";

type TopicLessonShellProps = {
  subjectSlug: string;
  topic: RegistryTopic;
  children?: React.ReactNode;
};

export function TopicLessonShell({ subjectSlug, topic, children }: TopicLessonShellProps) {
  const { prev, next } = getAdjacentTopics(subjectSlug, topic.slug);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <Link href={`/tools/${subjectSlug}`} className="inline-flex items-center gap-1 text-sm text-[#6D5DF6] mb-6 hover:underline min-h-[44px]">
        <ArrowLeft size={14} /> Back to {subjectSlug.toUpperCase()}
      </Link>

      <div className="mb-8">
        <span className="text-4xl mb-3 block" aria-hidden>{topic.icon}</span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mb-2">{topic.title}</h1>
        <p className="text-slate-500 leading-relaxed">{topic.description}</p>
        <div className="flex flex-wrap gap-2 mt-4">
          <span className="text-xs px-3 py-1 rounded-full bg-[#6D5DF6]/10 text-[#6D5DF6] font-medium">{topic.difficulty}</span>
          <span className="text-xs px-3 py-1 rounded-full bg-slate-100 dark:bg-white/5 text-slate-500">{topic.duration}</span>
          {topic.hasSimulator && <span className="text-xs px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-600">Interactive Simulator</span>}
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-8">
        <Link href={`/tools/exam/${subjectSlug}/${topic.slug}`}>
          <ToolsButton size="sm"><Target size={16} /> Take Quiz</ToolsButton>
        </Link>
        {topic.hasCheatSheet && (
          <ToolsButton size="sm" variant="secondary"><FileText size={16} /> Cheat Sheet</ToolsButton>
        )}
      </div>

      <Section title="Learning Objectives">
        <ul className="space-y-2">
          {topic.learningObjectives.map((obj) => (
            <li key={obj} className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-300">
              <BookOpen size={16} className="text-[#6D5DF6] shrink-0 mt-0.5" /> {obj}
            </li>
          ))}
        </ul>
      </Section>

      {topic.subtopics.length > 0 && (
        <Section title="Subtopics">
          <div className="grid sm:grid-cols-2 gap-3">
            {topic.subtopics.map((sub) => (
              <div key={sub.slug} className="glass-card p-4">
                <p className="font-semibold text-sm">{sub.title}</p>
                <p className="text-xs text-slate-400 mt-1">{sub.duration} · {sub.difficulty}</p>
              </div>
            ))}
          </div>
        </Section>
      )}

      {children}

      {!children && (
        <>
          <Section title="Theory Notes">
            <InfoCard type="info" title="Introduction" content={`This lesson covers ${topic.title} — a core topic in ${subjectSlug.toUpperCase()}. Study the theory, practice with the quiz, and review the cheat sheet before your exam.`} />
            <InfoCard type="tip" title="Study Tip" content="Read theory notes first, then attempt practice questions, and finally take the timed mock exam." />
          </Section>

          <Section title="Common Mistakes">
            <InfoCard type="warning" title="Avoid These" content={`Don't memorize without understanding ${topic.title} concepts. Focus on how and why each mechanism works in real operating systems.`} />
          </Section>

          <Section title="Summary">
            <InfoCard type="success" title="Key Takeaways" content={`You should now understand the fundamentals of ${topic.title}, its subtopics, and how it applies in exams and interviews.`} />
          </Section>
        </>
      )}

      {topic.hasInterview && (
        <Section title="Interview Questions">
          <InterviewQuestion question={`Explain ${topic.title} in simple terms.`} answer={`${topic.title} is a fundamental concept. Describe its purpose, key mechanisms, and a real-world example from Linux or Windows.`} />
          <InterviewQuestion question={`What are common exam questions about ${topic.title}?`} answer="Review definitions, compare related concepts, solve numerical problems, and draw diagrams where applicable." />
        </Section>
      )}

      <Section title="Resources">
        <div className="glass-card p-4 flex items-center gap-3">
          <Video size={20} className="text-slate-400" />
          <p className="text-sm text-slate-500">Video lecture placeholder — coming soon</p>
        </div>
      </Section>

      <div className="flex justify-between items-center pt-8 border-t border-slate-200 dark:border-white/10 mt-10">
        {prev ? (
          <Link href={getTopicHref(subjectSlug, prev)} className="inline-flex items-center gap-1 text-sm text-[#6D5DF6] hover:underline min-h-[44px]">
            <ArrowLeft size={14} /> {prev.title}
          </Link>
        ) : <div />}
        {next ? (
          <Link href={getTopicHref(subjectSlug, next)} className="inline-flex items-center gap-1 text-sm text-[#6D5DF6] hover:underline min-h-[44px]">
            {next.title} <ArrowRight size={14} />
          </Link>
        ) : (
          <Link href={`/tools/exam/${subjectSlug}`} className="inline-flex items-center gap-1 text-sm font-semibold text-white gradient-primary px-4 py-2 rounded-xl min-h-[44px]">
            <Zap size={14} /> Final Assessment
          </Link>
        )}
      </div>
    </div>
  );
}
