import { notFound } from "next/navigation";
import { PlannedTopicPage } from "@/components/tools/planned-topic-page";
import { getPlannedTopic, MOBILE_CURRICULUM } from "@/lib/tools/curriculum";

export function generateStaticParams() {
  return MOBILE_CURRICULUM.topics.map((t) => ({ topic: t.slug }));
}

export default async function MobileTopicPage({ params }: { params: Promise<{ topic: string }> }) {
  const { topic: slug } = await params;
  const topic = getPlannedTopic("mobile", slug);
  if (!topic) notFound();
  return (
    <PlannedTopicPage
      topic={topic}
      parentPath="/tools/mobile"
      parentLabel="Mobile Development"
      subjectPath="/tools/mobile"
    />
  );
}
