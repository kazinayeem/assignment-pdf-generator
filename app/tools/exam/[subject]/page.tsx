import { notFound } from "next/navigation";
import { ExamHubClient } from "@/components/learning/exam-hub-client";
import { getSubjectRegistry } from "@/lib/learning/topics-registry";

export function generateStaticParams() {
  return ["os", "dsa", "database", "network"].map((subject) => ({ subject }));
}

export async function generateMetadata({ params }: { params: Promise<{ subject: string }> }) {
  const { subject } = await params;
  const reg = getSubjectRegistry(subject);
  return { title: reg ? `${reg.title} Exams` : "Subject Exam" };
}

export default async function SubjectExamPage({ params }: { params: Promise<{ subject: string }> }) {
  const { subject } = await params;
  if (!getSubjectRegistry(subject)) notFound();
  return <ExamHubClient subjectSlug={subject} />;
}
