import { notFound } from "next/navigation";
import { PlannedTopicPage } from "@/components/tools/planned-topic-page";
import { SWE_CURRICULUM, getPlannedTopic } from "@/lib/tools/curriculum";

type Props = { params: Promise<{ topic: string }> };

export function generateStaticParams() {
  return SWE_CURRICULUM.topics
    .filter((t) => !t.href)
    .map((t) => ({ topic: t.slug }));
}

export default async function SWETopicPage({ params }: Props) {
  const { topic: slug } = await params;
  const topic = getPlannedTopic("swe", slug);
  if (!topic || topic.href) notFound();
  return (
    <PlannedTopicPage
      topic={topic}
      parentPath="/tools/swe"
      parentLabel="Software Engineering"
      subjectPath="/tools/swe"
    />
  );
}
