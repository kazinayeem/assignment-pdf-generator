import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getUniversity, getUniversitySlugs } from "@/lib/universities";
import { UniversityDetailClient } from "@/components/universities/university-detail-client";
import { UniversitySchema } from "@/components/universities/university-schema";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getUniversitySlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const university = getUniversity(slug);
  if (!university) return { title: "University Not Found" };
  return {
    title: `${university.shortName} | University Hub`,
    description: `${university.name} — ${university.type} university in ${university.city}, ${university.division}. Programs, tuition, admission, and reviews.`,
    openGraph: {
      title: university.name,
      description: `Explore ${university.name} on CampusFlow University Hub`,
      type: "website",
    },
  };
}

export default async function UniversityDetailPage({ params }: Props) {
  const { slug } = await params;
  const university = getUniversity(slug);
  if (!university) notFound();

  return (
    <>
      <UniversitySchema university={university} />
      <UniversityDetailClient university={university} />
    </>
  );
}
