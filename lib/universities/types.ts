export type UniversityType = "public" | "private" | "international";
export type Division =
  | "Dhaka"
  | "Chattogram"
  | "Rajshahi"
  | "Khulna"
  | "Barishal"
  | "Sylhet"
  | "Rangpur"
  | "Mymensingh";

export type ProgramLevel = "diploma" | "bachelor" | "masters" | "phd";
export type ProgramShift = "morning" | "evening" | "weekend" | "online";

export type UniversityProgram = {
  id: string;
  name: string;
  faculty: string;
  department: string;
  degree: string;
  level: ProgramLevel;
  durationYears: number;
  creditHours: number;
  semesterCount: number;
  shifts: ProgramShift[];
};

export type TuitionInfo = {
  admissionFee: number;
  registrationFee: number;
  perCreditFee: number;
  semesterFee: number;
  labFee: number;
  developmentFee: number;
  libraryFee: number;
  examFee: number;
  totalPerSemester: number;
  estimatedGraduationCost: number;
  scholarshipPercent: number;
  waiverPolicy: string;
  monthlyEstimate: number;
  installmentAvailable: boolean;
  emiSupport: boolean;
  educationLoan: boolean;
};

export type AdmissionInfo = {
  circularUrl?: string;
  applicationFee: number;
  applicationDeadline: string;
  sscGpaMin: number;
  hscGpaMin: number;
  diplomaAllowed: boolean;
  oLevelAllowed: boolean;
  aLevelAllowed: boolean;
  requiredDocuments: string[];
  testPattern: string;
  seatPlan?: string;
  resultUrl?: string;
  applyUrl?: string;
  process: string[];
  creditTransfer: boolean;
  internationalAdmission: boolean;
};

export type UniversityFacilities = {
  library: boolean;
  hostel: boolean;
  transport: boolean;
  medical: boolean;
  sports: boolean;
  researchCenters: number;
  clubs: number;
  campusAreaAcres?: number;
};

export type UniversityRanking = {
  national?: number;
  qs?: number;
  the?: number;
  research?: number;
  employability?: number;
};

export type UniversityReview = {
  id: string;
  rating: number;
  review: string;
  department: string;
  graduationYear: number;
  pros: string[];
  cons: string[];
  anonymous: boolean;
  author?: string;
};

export type UniversityCareer = {
  employmentRate: number;
  avgStartingSalary: number;
  topRecruiters: string[];
  internshipPartners: string[];
  popularPrograms: string[];
  highestPayingDegrees: string[];
};

export type University = {
  slug: string;
  name: string;
  shortName: string;
  type: UniversityType;
  ugcApproved: boolean;
  established: number;
  specialization: string;
  division: Division;
  district: string;
  city: string;
  address: string;
  website: string;
  admissionPortal?: string;
  email?: string;
  phone?: string;
  facebook?: string;
  linkedin?: string;
  youtube?: string;
  mapEmbedUrl?: string;
  mapUrl?: string;
  studentPopulation: number;
  facultyCount: number;
  departmentCount: number;
  founder?: string;
  viceChancellor?: string;
  facilities: UniversityFacilities;
  rankings: UniversityRanking;
  scholarships: string[];
  waivers: string[];
  financialAid: string[];
  internationalPartnerships: string[];
  exchangePrograms: string[];
  events: string[];
  programs: UniversityProgram[];
  tuition: TuitionInfo;
  admission: AdmissionInfo;
  career: UniversityCareer;
  reviews: UniversityReview[];
  faqs: { question: string; answer: string }[];
  pros: string[];
  cons: string[];
  tags: string[];
};

export type UniversitySeed = {
  slug: string;
  name: string;
  shortName: string;
  type: UniversityType;
  established: number;
  specialization?: string;
  division: Division | string;
  district: string;
  city: string;
  website?: string;
  studentPopulation?: number;
  departmentCount?: number;
  hostel?: boolean;
  eveningProgram?: boolean;
  onlineProgram?: boolean;
  nationalRank?: number;
};

export type UniversityFilters = {
  query?: string;
  type?: UniversityType | "all";
  division?: Division | "all";
  district?: string;
  department?: string;
  program?: string;
  maxBudget?: number;
  scholarship?: boolean;
  hostel?: boolean;
  evening?: boolean;
  online?: boolean;
  minRanking?: number;
};

export type CompareField =
  | "tuition"
  | "credits"
  | "departments"
  | "scholarships"
  | "hostel"
  | "ranking"
  | "admission"
  | "placement"
  | "research";

export type RecommendationInput = {
  sscGpa: number;
  hscGpa: number;
  preferredSubject: string;
  budget: number;
  division: Division | "any";
  careerGoal: string;
  preferredCampus: "urban" | "suburban" | "any";
};
