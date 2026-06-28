import { notFound } from "next/navigation";
import { RoadmapDetailClient } from "@/components/career/roadmap-detail-client";
import { getRoadmap, ROADMAP_SLUGS } from "@/lib/career/roadmaps";

export function generateStaticParams() {
  return ROADMAP_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const roadmap = getRoadmap(slug);
  return { title: roadmap ? `${roadmap.title} Roadmap | Career Hub` : "Career Roadmap" };
}

export default async function RoadmapDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const roadmap = getRoadmap(slug);
  if (!roadmap) notFound();
  return <RoadmapDetailClient roadmap={roadmap} />;
}
