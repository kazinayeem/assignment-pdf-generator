import { notFound } from "next/navigation";
import { PlannedTopicPage } from "@/components/tools/planned-topic-page";
import { WEB_CURRICULUM, getPlannedTopic } from "@/lib/tools/curriculum";

type Props = { params: Promise<{ topic: string }> };

export function generateStaticParams() {
  return WEB_CURRICULUM.topics.map((t) => ({ topic: t.slug }));
}

export default async function WebTopicPage({ params }: Props) {
  const { topic: slug } = await params;
  const topic = getPlannedTopic("web", slug);
  if (!topic || topic.href) notFound();
  return (
    <PlannedTopicPage
      topic={topic}
      parentPath="/tools/web"
      parentLabel="Web Development"
      subjectPath="/tools/web"
    />
  );
}
