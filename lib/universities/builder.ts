import type {
  AdmissionInfo,
  Division,
  SpecializationCategory,
  TuitionInfo,
  University,
  UniversityCareer,
  UniversityEnrichment,
  UniversityFacilities,
  UniversityProgram,
  UniversityRanking,
  UniversitySeed,
} from "./types";
import { inferCategory } from "./format";

const DEFAULT_PROGRAMS: UniversityProgram[] = [
  {
    id: "cse",
    name: "Computer Science & Engineering",
    faculty: "Faculty of Science & Engineering",
    department: "CSE",
    degree: "BSc",
    level: "bachelor",
    durationYears: 4,
    creditHours: 140,
    semesterCount: 8,
    shifts: ["morning"],
  },
  {
    id: "eee",
    name: "Electrical & Electronic Engineering",
    faculty: "Faculty of Science & Engineering",
    department: "EEE",
    degree: "BSc",
    level: "bachelor",
    durationYears: 4,
    creditHours: 140,
    semesterCount: 8,
    shifts: ["morning"],
  },
  {
    id: "bba",
    name: "Bachelor of Business Administration",
    faculty: "Faculty of Business",
    department: "BBA",
    degree: "BBA",
    level: "bachelor",
    durationYears: 4,
    creditHours: 120,
    semesterCount: 8,
    shifts: ["morning", "evening"],
  },
];

function defaultTuition(): TuitionInfo {
  return {
    verified: false,
    variesByDepartment: true,
    admissionFee: null,
    registrationFee: null,
    perCreditFee: null,
    perCreditFeeMax: null,
    semesterFee: null,
    semesterFeeMax: null,
    labFee: null,
    developmentFee: null,
    libraryFee: null,
    examFee: null,
    totalPerSemester: null,
    totalPerSemesterMax: null,
    estimatedGraduationCost: null,
    graduationCostMin: null,
    graduationCostMax: null,
    creditHours: null,
    semesterCount: null,
    scholarshipPercent: null,
    waiverPolicy: null,
    monthlyEstimate: null,
    installmentAvailable: false,
    emiSupport: false,
    educationLoan: false,
  };
}

function defaultAdmission(website: string): AdmissionInfo {
  return {
    applicationFee: null,
    applicationDeadline: null,
    sscGpaMin: null,
    hscGpaMin: null,
    diplomaAllowed: true,
    oLevelAllowed: true,
    aLevelAllowed: true,
    requiredDocuments: [],
    testPattern: null,
    applyUrl: website,
    process: [],
    creditTransfer: false,
    internationalAdmission: false,
    isOpen: null,
  };
}

function defaultFacilities(seed: UniversitySeed): UniversityFacilities {
  return {
    library: true,
    hostel: seed.hostel ?? seed.type === "public",
    transport: false,
    medical: false,
    sports: true,
    researchCenters: null,
    clubs: null,
    campusAreaAcres: null,
  };
}

function defaultCareer(): UniversityCareer {
  return {
    verified: false,
    employmentRate: null,
    avgStartingSalary: null,
    topRecruiters: [],
    internshipPartners: [],
    popularPrograms: [],
    highestPayingDegrees: [],
  };
}

function defaultRankings(): UniversityRanking {
  return { verified: false };
}

function websiteFromSlug(slug: string, shortName: string): string {
  const known: Record<string, string> = {
    du: "https://www.du.ac.bd",
    "university-of-dhaka": "https://www.du.ac.bd",
    buet: "https://www.buet.ac.bd",
    brac: "https://www.bracu.ac.bd",
    "brac-university": "https://www.bracu.ac.bd",
    nsu: "https://www.northsouth.edu",
    "north-south-university": "https://www.northsouth.edu",
    diu: "https://www.daffodilvarsity.edu.bd",
    "daffodil-international-university": "https://www.daffodilvarsity.edu.bd",
    uiu: "https://www.uiu.ac.bd",
    "united-international-university": "https://www.uiu.ac.bd",
    aiub: "https://www.aiub.edu",
    ewu: "https://www.ewubd.edu",
    iub: "https://www.iub.edu.bd",
    sust: "https://www.sust.edu",
    ruet: "https://www.ruet.ac.bd",
    kuet: "https://www.kuet.ac.bd",
    cuet: "https://www.cuet.ac.bd",
    ju: "https://www.juniv.edu",
    cu: "https://www.cu.ac.bd",
    ru: "https://www.ru.ac.bd",
    aust: "https://www.aust.edu",
    uap: "https://www.uap-bd.edu",
  };
  if (known[slug]) return known[slug];
  if (seedHasWebsite(slug)) return "";
  const domain = shortName.toLowerCase().replace(/[^a-z0-9]/g, "");
  return domain ? `https://www.${domain}.edu.bd` : "";
}

function seedHasWebsite(_slug: string): boolean {
  return false;
}

const DIVISIONS: Division[] = ["Dhaka", "Chattogram", "Rajshahi", "Khulna", "Barishal", "Sylhet", "Rangpur", "Mymensingh"];

const DISTRICT_TO_DIVISION: Record<string, Division> = {
  Dhaka: "Dhaka", Gazipur: "Dhaka", Narayanganj: "Dhaka", Tangail: "Dhaka",
  Munshiganj: "Dhaka", Manikganj: "Dhaka", Kishoreganj: "Dhaka", Faridpur: "Dhaka",
  Gopalganj: "Dhaka", Shariatpur: "Dhaka", Jamalpur: "Mymensingh", Mymensingh: "Mymensingh",
  Netrokona: "Mymensingh", Chattogram: "Chattogram", Chittagong: "Chattogram",
  Cumilla: "Chattogram", Comilla: "Chattogram", Noakhali: "Chattogram", Feni: "Chattogram",
  "Cox's Bazar": "Chattogram", Brahmanbaria: "Chattogram", Bandarban: "Chattogram",
  Rangamati: "Chattogram", Lakshmipur: "Chattogram", Chandpur: "Chattogram",
  Pirojpur: "Barishal", Patuakhali: "Barishal", Barishal: "Barishal",
  Jashore: "Khulna", Khulna: "Khulna", Kushtia: "Khulna", Chuadanga: "Khulna",
  Meherpur: "Khulna", Satkhira: "Khulna", Rajshahi: "Rajshahi", Pabna: "Rajshahi",
  Natore: "Rajshahi", Bogura: "Rajshahi", Sirajganj: "Rajshahi",
  Chapainawabganj: "Rajshahi", Naogaon: "Rajshahi", Sylhet: "Sylhet",
  Sunamganj: "Sylhet", Habiganj: "Sylhet", Rangpur: "Rangpur", Dinajpur: "Rangpur",
  Thakurgaon: "Rangpur", Nilphamari: "Rangpur", Kurigram: "Rangpur",
  Lalmonirhat: "Rangpur", Saidpur: "Rangpur",
};

function normalizeDivision(seed: UniversitySeed): Division {
  if (DIVISIONS.includes(seed.division as Division)) return seed.division as Division;
  return DISTRICT_TO_DIVISION[seed.division as string] ?? DISTRICT_TO_DIVISION[seed.district] ?? DISTRICT_TO_DIVISION[seed.city] ?? "Dhaka";
}

function resolveCategory(seed: UniversitySeed): SpecializationCategory {
  return inferCategory(seed.specialization ?? "General");
}

function mergeTuition(base: TuitionInfo, override?: Partial<TuitionInfo>): TuitionInfo {
  if (!override) return base;
  return { ...base, ...override, verified: override.verified ?? true };
}

function mergeRankings(base: UniversityRanking, override?: Partial<UniversityRanking>): UniversityRanking {
  if (!override) return base;
  const merged = { ...base, ...override };
  if (override.qs != null && override.qsWorld == null) merged.qsWorld = override.qs;
  merged.verified = override.verified ?? true;
  return merged;
}

export function buildUniversity(seed: UniversitySeed, enrichment?: UniversityEnrichment): University {
  const division = normalizeDivision(seed);
  const website = seed.website ?? websiteFromSlug(seed.slug, seed.shortName);
  const specialization = seed.specialization ?? "General";
  const category = resolveCategory(seed);
  const tags: string[] = [seed.type, division, category];
  if (seed.hostel) tags.push("hostel");
  if (seed.eveningProgram) tags.push("evening");
  if (seed.onlineProgram) tags.push("online");

  const base: University = {
    slug: seed.slug,
    name: seed.name,
    shortName: seed.shortName,
    type: seed.type,
    ugcApproved: true,
    established: seed.established,
    specialization,
    category,
    division,
    district: seed.district,
    city: seed.city,
    address: `${seed.city}, ${seed.district}, ${division} Division, Bangladesh`,
    website: website || `https://www.ugc.gov.bd`,
    admissionPortal: website || undefined,
    studentPopulation: seed.studentPopulation ?? null,
    facultyCount: seed.facultyCount ?? null,
    departmentCount: seed.departmentCount ?? null,
    facilities: defaultFacilities(seed),
    rankings: defaultRankings(),
    scholarships: [],
    waivers: [],
    financialAid: [],
    internationalPartnerships: [],
    exchangePrograms: [],
    events: [],
    programs: DEFAULT_PROGRAMS.map((p) => ({
      ...p,
      shifts: seed.eveningProgram ? [...p.shifts, "evening" as const] : p.shifts,
    })),
    tuition: defaultTuition(),
    admission: defaultAdmission(website),
    career: defaultCareer(),
    reviews: [],
    faqs: [
      {
        question: `Is ${seed.shortName} UGC approved?`,
        answer: `Yes, ${seed.name} is listed by the University Grants Commission (UGC) of Bangladesh. Verify current status at ugc.gov.bd.`,
      },
      {
        question: `Where can I find tuition and admission details?`,
        answer: `Visit the official website or admission portal for the latest fees, GPA requirements, and application deadlines.`,
      },
    ],
    pros: ["UGC approved institution"],
    cons: ["Verify tuition and admission details on the official website"],
    tags,
    mapUrl: `https://maps.google.com/?q=${encodeURIComponent(seed.name + " Bangladesh")}`,
  };

  if (!enrichment) return base;

  return {
    ...base,
    ...enrichment,
    facilities: { ...base.facilities, ...enrichment.facilities },
    tuition: mergeTuition(base.tuition, enrichment.tuition),
    admission: { ...base.admission, ...enrichment.admission },
    career: { ...base.career, ...enrichment.career },
    rankings: mergeRankings(base.rankings, enrichment.rankings),
    programs: enrichment.programs ?? base.programs,
    tags: enrichment.tags ?? base.tags,
  };
}

export function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}
