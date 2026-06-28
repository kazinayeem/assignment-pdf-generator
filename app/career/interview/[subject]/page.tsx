import { notFound } from "next/navigation";
import { InterviewSubjectClient } from "@/components/career/interview-subject-client";
import { getInterviewSubject, INTERVIEW_SUBJECT_SLUGS } from "@/lib/career/interview";

export function generateStaticParams() {
  return INTERVIEW_SUBJECT_SLUGS.map((subject) => ({ subject }));
}

export async function generateMetadata({ params }: { params: Promise<{ subject: string }> }) {
  const { subject: slug } = await params;
  const subject = getInterviewSubject(slug);
  return { title: subject ? `${subject.title} | Interview Prep` : "Interview Prep" };
}

export default async function InterviewSubjectPage({ params }: { params: Promise<{ subject: string }> }) {
  const { subject: slug } = await params;
  const subject = getInterviewSubject(slug);
  if (!subject) notFound();
  return <InterviewSubjectClient subject={subject} />;
}
