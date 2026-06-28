import type { CurriculumCourse, CurriculumSemester, DepartmentDetail } from "./types";

/** Generic CSE semester template — labeled as sample when not from official source */
export function sampleCseCurriculum(): CurriculumSemester[] {
  const base = (n: number, courses: CurriculumCourse[]): CurriculumSemester => ({ number: n, courses });
  return [
    base(1, [
      { code: "CSE101", name: "Introduction to Computer Science", credits: 3, type: "theory", category: "core" },
      { code: "MAT101", name: "Calculus I", credits: 3, type: "theory", category: "core" },
      { code: "PHY101", name: "Physics I", credits: 3, type: "theory", category: "core" },
      { code: "ENG101", name: "English", credits: 2, type: "theory", category: "core" },
    ]),
    base(2, [
      { code: "CSE102", name: "Structured Programming", credits: 3, type: "theory", category: "core", prerequisites: ["CSE101"] },
      { code: "CSE103", name: "Structured Programming Lab", credits: 1.5, type: "lab", category: "core", prerequisites: ["CSE101"] },
      { code: "MAT102", name: "Calculus II", credits: 3, type: "theory", category: "core", prerequisites: ["MAT101"] },
    ]),
    base(3, [
      { code: "CSE201", name: "Data Structures", credits: 3, type: "theory", category: "core", prerequisites: ["CSE102"] },
      { code: "CSE202", name: "Data Structures Lab", credits: 1.5, type: "lab", category: "core" },
      { code: "CSE203", name: "Discrete Mathematics", credits: 3, type: "theory", category: "core" },
    ]),
    base(4, [
      { code: "CSE301", name: "Algorithms", credits: 3, type: "theory", category: "core", prerequisites: ["CSE201"] },
      { code: "CSE302", name: "Database Systems", credits: 3, type: "theory", category: "core" },
      { code: "CSE303", name: "Database Lab", credits: 1.5, type: "lab", category: "core" },
    ]),
    base(5, [
      { code: "CSE401", name: "Operating Systems", credits: 3, type: "theory", category: "core" },
      { code: "CSE402", name: "Computer Networks", credits: 3, type: "theory", category: "core" },
      { code: "CSE4XX", name: "Technical Elective I", credits: 3, type: "theory", category: "elective" },
    ]),
    base(6, [
      { code: "CSE501", name: "Software Engineering", credits: 3, type: "theory", category: "core" },
      { code: "CSE502", name: "Artificial Intelligence", credits: 3, type: "theory", category: "core" },
      { code: "CSE5XX", name: "Technical Elective II", credits: 3, type: "theory", category: "elective" },
    ]),
    base(7, [
      { code: "CSE601", name: "Machine Learning", credits: 3, type: "theory", category: "elective" },
      { code: "CSE602", name: "Web Technologies", credits: 3, type: "theory", category: "elective" },
    ]),
    base(8, [
      { code: "CSE701", name: "Capstone Project", credits: 4, type: "project", category: "core" },
      { code: "CSE702", name: "Internship / Thesis", credits: 3, type: "project", category: "core" },
    ]),
  ];
}

export function getDepartmentCurriculum(department: DepartmentDetail): CurriculumSemester[] {
  if (department.curriculum?.length) return department.curriculum;
  if (department.slug === "cse" || department.name.toLowerCase().includes("computer")) {
    return sampleCseCurriculum();
  }
  const semesters = department.programs[0]?.semesterCount ?? 8;
  return Array.from({ length: semesters }, (_, i) => ({
    number: i + 1,
    courses: [
      {
        code: `${department.slug.toUpperCase()}${i + 1}01`,
        name: `Semester ${i + 1} Core Course`,
        credits: 3,
        type: "theory" as const,
        category: "core" as const,
        description: "Verify official syllabus on university website",
      },
    ],
  }));
}

export function searchCourses(curriculum: CurriculumSemester[], query: string): { semester: number; course: CurriculumCourse }[] {
  const q = query.toLowerCase().trim();
  if (!q) return [];
  const results: { semester: number; course: CurriculumCourse }[] = [];
  for (const sem of curriculum) {
    for (const course of sem.courses) {
      if (course.code.toLowerCase().includes(q) || course.name.toLowerCase().includes(q)) {
        results.push({ semester: sem.number, course });
      }
    }
  }
  return results;
}
