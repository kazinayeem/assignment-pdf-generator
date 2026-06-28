import { notFound } from "next/navigation";
import { TopicLessonShell } from "@/components/learning/topic-lesson-shell";
import { getRegistryTopic, OS_REGISTRY } from "@/lib/learning/topics-registry";

const PLANNED_SLUGS = OS_REGISTRY.categories
  .flatMap((c) => c.topics)
  .filter((t) => t.status === "planned")
  .map((t) => t.slug);

export function generateStaticParams() {
  return PLANNED_SLUGS.map((topic) => ({ topic }));
}

export async function generateMetadata({ params }: { params: Promise<{ topic: string }> }) {
  const { topic } = await params;
  const reg = getRegistryTopic("os", topic);
  return { title: reg ? `${reg.title} | OS` : "OS Topic" };
}

export default async function OSDynamicTopicPage({ params }: { params: Promise<{ topic: string }> }) {
  const { topic } = await params;
  const reg = getRegistryTopic("os", topic);
  if (!reg || reg.status !== "planned") notFound();
  return <TopicLessonShell subjectSlug="os" topic={reg} />;
}
