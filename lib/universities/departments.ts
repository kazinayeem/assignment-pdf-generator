import type { DepartmentDetail, ProgramLevel, University, UniversityProgram } from "./types";
import { slugify } from "./builder";

export function buildDepartmentsFromPrograms(university: University): DepartmentDetail[] {
  const map = new Map<string, DepartmentDetail>();

  for (const program of university.programs) {
    const slug = slugify(program.department);
    if (!map.has(slug)) {
      map.set(slug, {
        slug,
        name: program.department,
        faculty: program.faculty,
        overview: `${program.department} programs at ${university.shortName}. Visit the official website for the latest curriculum and admission details.`,
        researchAreas: [],
        careerOpportunities: university.career.popularPrograms.includes(program.department)
          ? [`Careers in ${program.department}`]
          : [],
        internshipOpportunities: university.career.internshipPartners.slice(0, 3),
        admissionRequirements: [
          ...(university.admission.sscGpaMin != null ? [`SSC GPA minimum: ${university.admission.sscGpaMin}`] : []),
          ...(university.admission.hscGpaMin != null ? [`HSC GPA minimum: ${university.admission.hscGpaMin}`] : []),
          ...university.admission.requiredDocuments,
        ],
        programs: [],
        tuitionNote: university.tuition.verified ? null : "Contact university for department-wise fees",
      });
    }
    map.get(slug)!.programs.push(program);
  }

  return [...map.values()];
}

export function getUniversityDepartments(university: University): DepartmentDetail[] {
  if (university.departments?.length) return university.departments;
  return buildDepartmentsFromPrograms(university);
}

export function getDepartment(university: University, deptSlug: string): DepartmentDetail | undefined {
  return getUniversityDepartments(university).find((d) => d.slug === deptSlug);
}

export function getFaculties(university: University): string[] {
  return [...new Set(getUniversityDepartments(university).map((d) => d.faculty))];
}

export function getProgramsByLevel(university: University, level: ProgramLevel): UniversityProgram[] {
  return university.programs.filter((p) => p.level === level);
}

export function filterDepartments(
  departments: DepartmentDetail[],
  query: string,
  faculty: string,
  level: ProgramLevel | "all"
): DepartmentDetail[] {
  const q = query.toLowerCase().trim();
  return departments.filter((d) => {
    if (faculty !== "all" && d.faculty !== faculty) return false;
    if (level !== "all" && !d.programs.some((p) => p.level === level)) return false;
    if (!q) return true;
    return (
      d.name.toLowerCase().includes(q) ||
      d.faculty.toLowerCase().includes(q) ||
      d.programs.some((p) => p.name.toLowerCase().includes(q))
    );
  });
}
