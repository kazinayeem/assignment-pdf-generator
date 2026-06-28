import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getUniversity, getUniversitySlugs } from "@/lib/universities";
import { getDepartment } from "@/lib/universities/departments";
import { UniversityDepartmentDetailClient } from "@/components/universities/university-department-detail-client";

type Props = { params: Promise<{ slug: string; dept: string }> };

export async function generateStaticParams() {
  const slugs = getUniversitySlugs();
  const params: { slug: string; dept: string }[] = [];
  for (const slug of slugs.slice(0, 20)) {
    const uni = getUniversity(slug);
    if (!uni) continue;
    for (const p of uni.programs) {
      const deptSlug = p.department.toLowerCase().replace(/[^a-z0-9]+/g, "-");
      if (!params.some((x) => x.slug === slug && x.dept === deptSlug)) {
        params.push({ slug, dept: deptSlug });
      }
    }
  }
  return params;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, dept } = await params;
  const university = getUniversity(slug);
  const department = university ? getDepartment(university, dept) : undefined;
  if (!university || !department) return { title: "Department | University Hub" };
  return {
    title: `${department.name} — ${university.shortName} | University Hub`,
    description: department.overview,
  };
}

export default async function DepartmentPage({ params }: Props) {
  const { slug, dept } = await params;
  const university = getUniversity(slug);
  if (!university || !getDepartment(university, dept)) notFound();
  return <UniversityDepartmentDetailClient university={university} deptSlug={dept} />;
}
