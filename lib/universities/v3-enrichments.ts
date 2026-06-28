import type { UniversityEnrichment } from "./types";
import { sampleCseCurriculum } from "./curriculum";

/** V3 extended data — departments, timeline, stats, alumni, etc. */
export const V3_ENRICHMENTS: Record<string, Partial<UniversityEnrichment>> = {
  buet: {
    aiSummary: "Bangladesh University of Engineering and Technology (BUET) is Bangladesh's premier public engineering university, established in 1962. Known for rigorous academics and near-subsidized tuition, BUET produces top engineers recruited by leading tech and infrastructure firms.",
    programs: [
      { id: "cse", name: "Computer Science & Engineering", faculty: "Faculty of Electrical & Computer Engineering", department: "CSE", degree: "BSc", level: "bachelor", durationYears: 4, creditHours: 160, semesterCount: 8, shifts: ["morning"] },
      { id: "eee", name: "Electrical & Electronic Engineering", faculty: "Faculty of Electrical & Computer Engineering", department: "EEE", degree: "BSc", level: "bachelor", durationYears: 4, creditHours: 160, semesterCount: 8, shifts: ["morning"] },
      { id: "civil", name: "Civil Engineering", faculty: "Faculty of Civil Engineering", department: "Civil", degree: "BSc", level: "bachelor", durationYears: 4, creditHours: 160, semesterCount: 8, shifts: ["morning"] },
      { id: "me", name: "Mechanical Engineering", faculty: "Faculty of Mechanical Engineering", department: "ME", degree: "BSc", level: "bachelor", durationYears: 4, creditHours: 160, semesterCount: 8, shifts: ["morning"] },
      { id: "arch", name: "Architecture", faculty: "Faculty of Architecture & Planning", department: "Architecture", degree: "BArch", level: "bachelor", durationYears: 5, creditHours: 180, semesterCount: 10, shifts: ["morning"] },
      { id: "cse-msc", name: "MSc in CSE", faculty: "Faculty of Electrical & Computer Engineering", department: "CSE", degree: "MSc", level: "masters", durationYears: 2, creditHours: 36, semesterCount: 4, shifts: ["morning"] },
      { id: "cse-phd", name: "PhD in CSE", faculty: "Faculty of Electrical & Computer Engineering", department: "CSE", degree: "PhD", level: "phd", durationYears: 4, creditHours: 60, semesterCount: 8, shifts: ["morning"] },
    ],
    departments: [
      {
        slug: "cse",
        name: "CSE",
        faculty: "Faculty of Electrical & Computer Engineering",
        overview: "BUET CSE is one of the most competitive engineering programs in Bangladesh, focusing on algorithms, systems, AI, and software engineering.",
        headOfDepartment: "Prof. Dr. (verify on buet.ac.bd)",
        researchAreas: ["Machine Learning", "Computer Networks", "Embedded Systems", "Software Engineering"],
        careerOpportunities: ["Software Engineer", "ML Engineer", "Systems Architect", "Research Scientist"],
        internshipOpportunities: ["Samsung R&D", "BJIT", "bKash"],
        admissionRequirements: ["SSC GPA ≥ 4.75", "HSC GPA ≥ 4.75", "Engineering cluster admission test"],
        programs: [],
        curriculum: sampleCseCurriculum(),
      },
    ],
    timeline: [
      { year: 1912, title: "Origins as Ahsanullah School", description: "Roots trace to Ahsanullah School of Engineering.", category: "founded" },
      { year: 1962, title: "BUET Established", description: "Established as East Pakistan University of Engineering and Technology.", category: "founded" },
      { year: 1986, title: "Renamed BUET", description: "Renamed Bangladesh University of Engineering and Technology.", category: "milestone" },
      { year: 2024, title: "QS Asia Ranking", description: "Ranked in QS Asia University Rankings.", category: "recognition" },
    ],
    accreditations: [
      { name: "UGC Approved", type: "ugc", status: "active", source: "https://www.ugc.gov.bd", verified: true },
      { name: "Washington Accord", type: "washington", status: "active", source: "https://www.buet.ac.bd", verified: true, issueDate: "2015" },
    ],
    admissionStats: {
      verified: false,
      applicants: null,
      selected: null,
      acceptanceRate: null,
      availableSeats: null,
      competitionRatio: "Highly competitive — verify on admission authority",
      avgGpa: 4.85,
      byDepartment: [
        { department: "CSE", applicants: null, selected: null, seats: null },
        { department: "EEE", applicants: null, selected: null, seats: null },
      ],
      yearlyTrend: [],
    },
    alumni: [
      { id: "buet-1", name: "Notable BUET Alumni", department: "CSE", graduationYear: 2000, company: "Various", position: "Engineering Leadership", advice: "Focus on fundamentals and problem-solving skills." },
    ],
    partners: [
      { name: "University of Tokyo", country: "Japan", countryCode: "JP", programs: ["Research exchange"], type: "research" },
      { name: "Kyoto University", country: "Japan", countryCode: "JP", programs: ["Student exchange"], type: "exchange" },
    ],
    admission: {
      circularUrl: "https://www.buet.ac.bd",
      applyUrl: "https://www.buet.ac.bd",
    },
    admissionCalendar: {
      applicationOpens: "September (cluster cycle)",
      applicationDeadline: "October (cluster admission cycle)",
      admissionTest: "November",
      resultDate: "December",
      semesterStart: "January",
    },
  },
  "university-of-dhaka": {
    aiSummary: "University of Dhaka, established in 1921, is Bangladesh's oldest and most prestigious public university with 83+ departments across multiple faculties.",
    timeline: [
      { year: 1921, title: "University of Dhaka Founded", description: "Established as the first university in East Bengal.", category: "founded" },
      { year: 1971, title: "Liberation War Role", description: "Played a pivotal role in Bangladesh's independence movement.", category: "milestone" },
      { year: 2024, title: "QS Asia Ranking", description: "Ranked in QS Asia University Rankings.", category: "recognition" },
    ],
    accreditations: [
      { name: "UGC Approved", type: "ugc", status: "active", source: "https://www.ugc.gov.bd", verified: true },
    ],
    admission: {
      circularUrl: "https://admission.eis.du.ac.bd",
      applyUrl: "https://admission.eis.du.ac.bd",
    },
    alumni: [
      { id: "du-1", name: "DU Distinguished Alumni", department: "Economics", graduationYear: 1985, company: "Various", position: "National Leadership", story: "DU has produced leaders across government, academia, and industry." },
    ],
  },
  diu: {
    aiSummary: "Daffodil International University is a leading private university in Dhaka with industry-linked programs, modern campus facilities, and waiver up to 100%.",
    partners: [
      { name: "Partner Universities", country: "Multiple", countryCode: "UN", programs: ["Exchange programs"], type: "exchange" },
    ],
    accreditations: [
      { name: "UGC Approved", type: "ugc", status: "active", source: "https://www.ugc.gov.bd", verified: true },
    ],
    admission: {
      circularUrl: "https://admission.daffodilvarsity.edu.bd",
    },
    admissionCalendar: {
      applicationOpens: "Rolling admissions",
      applicationDeadline: "Varies by semester",
      semesterStart: "January / May / September",
    },
  },
};
