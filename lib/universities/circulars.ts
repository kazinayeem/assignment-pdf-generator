import { UNIVERSITIES } from "./index";
import type { AdmissionCircular, University } from "./types";

function buildCircularFromUniversity(u: University): AdmissionCircular | null {
  const { admission } = u;
  if (!admission.applyUrl && !admission.circularUrl && admission.isOpen !== true) return null;

  return {
    id: `${u.slug}-latest`,
    title: `${u.shortName} Admission ${new Date().getFullYear()}`,
    universitySlug: u.slug,
    universityName: u.name,
    publishedAt: new Date().toISOString().slice(0, 10),
    deadline: admission.applicationDeadline,
    pdfUrl: admission.circularUrl,
    applyUrl: admission.applyUrl ?? admission.circularUrl,
    applicationFee: admission.applicationFee,
    eligibility: [
      ...(admission.sscGpaMin != null ? [`SSC GPA ≥ ${admission.sscGpaMin}`] : []),
      ...(admission.hscGpaMin != null ? [`HSC GPA ≥ ${admission.hscGpaMin}`] : []),
      ...(admission.diplomaAllowed ? ["Diploma holders eligible"] : []),
    ],
    requiredDocuments: admission.requiredDocuments.length > 0
      ? admission.requiredDocuments
      : ["SSC/HSC marksheets", "NID", "Passport photos"],
    importantDates: [
      ...(u.admissionCalendar?.applicationOpens
        ? [{ label: "Application Opens", date: u.admissionCalendar.applicationOpens }]
        : []),
      ...(admission.applicationDeadline
        ? [{ label: "Deadline", date: admission.applicationDeadline }]
        : []),
      ...(u.admissionCalendar?.admissionTest
        ? [{ label: "Admission Test", date: u.admissionCalendar.admissionTest }]
        : []),
    ],
    isLatest: true,
  };
}

export function getUniversityCirculars(university: University): AdmissionCircular[] {
  if (university.circulars?.length) return university.circulars;
  const latest = buildCircularFromUniversity(university);
  return latest ? [latest] : [];
}

export function getAllCirculars(): AdmissionCircular[] {
  const all: AdmissionCircular[] = [];
  for (const u of UNIVERSITIES) {
    all.push(...getUniversityCirculars(u));
  }
  return all.sort((a, b) => {
    if (a.isLatest !== b.isLatest) return a.isLatest ? -1 : 1;
    return b.publishedAt.localeCompare(a.publishedAt);
  });
}

export function filterCirculars(
  circulars: AdmissionCircular[],
  query: string,
  universitySlug?: string
): AdmissionCircular[] {
  const q = query.toLowerCase().trim();
  return circulars.filter((c) => {
    if (universitySlug && c.universitySlug !== universitySlug) return false;
    if (!q) return true;
    return (
      c.title.toLowerCase().includes(q) ||
      c.universityName.toLowerCase().includes(q)
    );
  });
}
