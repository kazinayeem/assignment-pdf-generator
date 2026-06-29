import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getRoadmap, ROADMAP_SLUGS } from "@/lib/roadmaps";
import { RoadmapDetailClient } from "@/components/roadmaps/roadmap-detail-client";

type PageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return ROADMAP_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const roadmap = getRoadmap(slug);
  if (!roadmap) return { title: "Roadmap Not Found" };
  return {
    title: `${roadmap.title} Roadmap`,
    description: roadmap.description,
  };
}

export default async function RoadmapDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const roadmap = getRoadmap(slug);
  if (!roadmap) notFound();
  return <RoadmapDetailClient roadmap={roadmap} />;
}
