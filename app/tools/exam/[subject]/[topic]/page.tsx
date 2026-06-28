import { notFound } from "next/navigation";
import { ExamHubClient } from "@/components/learning/exam-hub-client";
import { getRegistryTopic, getSubjectRegistry } from "@/lib/learning/topics-registry";

export async function generateMetadata({ params }: { params: Promise<{ subject: string; topic: string }> }) {
  const { subject, topic } = await params;
  const reg = getRegistryTopic(subject, topic);
  return { title: reg ? `${reg.title} Quiz` : "Topic Quiz" };
}

export default async function TopicExamPage({ params }: { params: Promise<{ subject: string; topic: string }> }) {
  const { subject, topic } = await params;
  if (!getSubjectRegistry(subject) || !getRegistryTopic(subject, topic)) notFound();
  return <ExamHubClient subjectSlug={subject} topicSlug={topic} />;
}
