import type { University } from "@/lib/universities/types";

export function UniversitySchema({ university }: { university: University }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "CollegeOrUniversity",
    name: university.name,
    alternateName: university.shortName,
    url: university.website,
    address: {
      "@type": "PostalAddress",
      addressLocality: university.city,
      addressRegion: university.division,
      addressCountry: "BD",
    },
    foundingDate: String(university.established),
    ...(university.studentPopulation != null ? { numberOfStudents: university.studentPopulation } : {}),
    sameAs: [university.website, university.facebook, university.linkedin].filter(Boolean),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
