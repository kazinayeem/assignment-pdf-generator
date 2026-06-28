import type {
  AdmissionInfo,
  TuitionInfo,
  University,
  UniversityCareer,
  UniversityFacilities,
  UniversityProgram,
  UniversityRanking,
  UniversityReview,
  UniversitySeed,
  UniversityType,
} from "./types";

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

function defaultTuition(type: UniversityType): TuitionInfo {
  const isPublic = type === "public";
  const perCredit = isPublic ? 350 : 4200;
  const semesterFee = isPublic ? 12000 : 85000;
  const total = semesterFee + perCredit * 18 + 15000;
  return {
    admissionFee: isPublic ? 5000 : 25000,
    registrationFee: isPublic ? 3000 : 15000,
    perCreditFee: perCredit,
    semesterFee,
    labFee: isPublic ? 2000 : 12000,
    developmentFee: isPublic ? 5000 : 20000,
    libraryFee: isPublic ? 1500 : 5000,
    examFee: isPublic ? 2500 : 8000,
    totalPerSemester: total,
    estimatedGraduationCost: total * 8,
    scholarshipPercent: isPublic ? 100 : 50,
    waiverPolicy: isPublic
      ? "Merit-based tuition waiver for top performers"
      : "Up to 100% waiver based on SSC/HSC GPA",
    monthlyEstimate: Math.round(total / 4),
    installmentAvailable: !isPublic,
    emiSupport: !isPublic,
    educationLoan: true,
  };
}

function defaultAdmission(type: UniversityType, website: string): AdmissionInfo {
  return {
    applicationFee: type === "public" ? 1000 : 1500,
    applicationDeadline: "July 31",
    sscGpaMin: type === "public" ? 4.0 : 3.5,
    hscGpaMin: type === "public" ? 4.0 : 3.0,
    diplomaAllowed: true,
    oLevelAllowed: true,
    aLevelAllowed: true,
    requiredDocuments: [
      "SSC & HSC marksheets",
      "Passport-size photographs",
      "National ID / Birth certificate",
      "Admission test admit card",
    ],
    testPattern: type === "public" ? "MCQ + Written (cluster system)" : "University admission test",
    applyUrl: website,
    process: [
      "Check admission circular",
      "Submit online application",
      "Pay application fee",
      "Sit for admission test",
      "Check merit list & confirm admission",
    ],
    creditTransfer: true,
    internationalAdmission: true,
  };
}

function defaultFacilities(seed: UniversitySeed): UniversityFacilities {
  return {
    library: true,
    hostel: seed.hostel ?? seed.type === "public",
    transport: seed.type === "private",
    medical: true,
    sports: true,
    researchCenters: seed.type === "public" ? 5 : 2,
    clubs: seed.type === "public" ? 30 : 15,
    campusAreaAcres: seed.type === "public" ? 50 : 5,
  };
}

function defaultCareer(shortName: string): UniversityCareer {
  return {
    employmentRate: 78,
    avgStartingSalary: 35000,
    topRecruiters: ["Brain Station 23", "Cefalo", "Samsung R&D", "bKash", "Pathao"],
    internshipPartners: ["Grameenphone", "Robi", "SSL Wireless", "BJIT"],
    popularPrograms: ["CSE", "EEE", "BBA", "MBA"],
    highestPayingDegrees: ["CSE", "EEE", "Pharmacy"],
  };
}

function defaultRankings(seed: UniversitySeed): UniversityRanking {
  return {
    national: seed.nationalRank,
    employability: seed.type === "public" ? 75 : 70,
    research: seed.type === "public" ? 70 : 55,
  };
}

function defaultReviews(shortName: string): UniversityReview[] {
  return [
    {
      id: `${shortName}-1`,
      rating: 4,
      review: `Solid academic environment with growing tech community at ${shortName}.`,
      department: "CSE",
      graduationYear: 2025,
      pros: ["Active clubs", "Good faculty", "Career events"],
      cons: ["Limited parking", "Crowded cafeteria"],
      anonymous: true,
    },
  ];
}

function websiteFromSlug(slug: string, shortName: string): string {
  const known: Record<string, string> = {
    du: "https://www.du.ac.bd",
    buet: "https://www.buet.ac.bd",
    brac: "https://www.bracu.ac.bd",
    nsu: "https://www.northsouth.edu",
    diu: "https://www.daffodilvarsity.edu.bd",
    uiu: "https://www.uiu.ac.bd",
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
  const domain = shortName.toLowerCase().replace(/[^a-z0-9]/g, "");
  return `https://www.${domain}.edu.bd`;
}

export function buildUniversity(seed: UniversitySeed, enrichment?: Partial<University>): University {
  const website = seed.website ?? websiteFromSlug(seed.slug, seed.shortName.toLowerCase());
  const tags: string[] = [seed.type, seed.division];
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
    specialization: seed.specialization ?? "General",
    division: seed.division,
    district: seed.district,
    city: seed.city,
    address: `${seed.city}, ${seed.district}, ${seed.division} Division, Bangladesh`,
    website,
    admissionPortal: website,
    email: `info@${seed.shortName.toLowerCase().replace(/[^a-z0-9]/g, "")}.edu.bd`,
    studentPopulation: seed.studentPopulation ?? (seed.type === "public" ? 15000 : 8000),
    facultyCount: Math.round((seed.studentPopulation ?? 10000) / 25),
    departmentCount: seed.departmentCount ?? (seed.type === "public" ? 35 : 20),
    facilities: defaultFacilities(seed),
    rankings: defaultRankings(seed),
    scholarships: [
      "Merit scholarship for GPA 5.00",
      "Freedom fighter quota",
      "Regional quota (public)",
    ],
    waivers: seed.type === "private" ? ["GPA-based tuition waiver up to 100%"] : ["Government subsidized tuition"],
    financialAid: ["Need-based aid", "Work-study programs"],
    internationalPartnerships: ["Erasmus+", "Commonwealth exchange"],
    exchangePrograms: ["Semester abroad programs"],
    events: ["Orientation", "Tech fest", "Career fair", "Cultural week"],
    programs: DEFAULT_PROGRAMS.map((p) => ({
      ...p,
      shifts: seed.eveningProgram ? [...p.shifts, "evening"] : p.shifts,
    })),
    tuition: defaultTuition(seed.type),
    admission: defaultAdmission(seed.type, website),
    career: defaultCareer(seed.shortName),
    reviews: defaultReviews(seed.shortName),
    faqs: [
      {
        question: `Is ${seed.shortName} UGC approved?`,
        answer: `Yes, ${seed.name} is approved by the University Grants Commission (UGC) of Bangladesh.`,
      },
      {
        question: `What is the admission GPA requirement?`,
        answer: `Typically SSC GPA ${seed.type === "public" ? "4.00+" : "3.50+"} and HSC GPA ${seed.type === "public" ? "4.00+" : "3.00+"} for most programs.`,
      },
    ],
    pros: [
      "UGC approved institution",
      seed.type === "public" ? "Affordable public tuition" : "Modern campus facilities",
      "Multiple academic programs",
    ],
    cons: [
      seed.type === "public" ? "Competitive admission" : "Higher tuition than public universities",
      "Limited seats in popular departments",
    ],
    tags,
    mapUrl: `https://maps.google.com/?q=${encodeURIComponent(seed.name + " Bangladesh")}`,
  };

  return { ...base, ...enrichment };
}

export function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}
