import { notFound, redirect } from "next/navigation";
import { PlannedTopicPage } from "@/components/tools/planned-topic-page";
import { PROGRAMMING_CURRICULUM, getPlannedTopic } from "@/lib/tools/curriculum";

type Props = { params: Promise<{ topic: string }> };

export function generateStaticParams() {
  return PROGRAMMING_CURRICULUM.topics.map((t) => ({ topic: t.slug }));
}

export default async function ProgrammingTopicPage({ params }: Props) {
  const { topic: slug } = await params;
  const topic = getPlannedTopic("programming", slug);
  if (!topic) notFound();
  if (topic.href) redirect(topic.href);
  return (
    <PlannedTopicPage
      topic={topic}
      parentPath="/tools/programming"
      parentLabel="Programming"
      subjectPath="/tools/programming"
    />
  );
}
