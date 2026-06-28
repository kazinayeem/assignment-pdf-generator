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
export type SpecializationCategory =
  | "engineering"
  | "medical"
  | "science"
  | "business"
  | "general";

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
  verified: boolean;
  variesByDepartment: boolean;
  source?: string;
  admissionFee: number | null;
  registrationFee: number | null;
  perCreditFee: number | null;
  perCreditFeeMax: number | null;
  semesterFee: number | null;
  semesterFeeMax: number | null;
  labFee: number | null;
  developmentFee: number | null;
  libraryFee: number | null;
  examFee: number | null;
  totalPerSemester: number | null;
  totalPerSemesterMax: number | null;
  estimatedGraduationCost: number | null;
  graduationCostMin: number | null;
  graduationCostMax: number | null;
  creditHours: number | null;
  semesterCount: number | null;
  scholarshipPercent: number | null;
  waiverPolicy: string | null;
  monthlyEstimate: number | null;
  installmentAvailable: boolean;
  emiSupport: boolean;
  educationLoan: boolean;
};

export type AdmissionInfo = {
  circularUrl?: string;
  applicationFee: number | null;
  applicationDeadline: string | null;
  sscGpaMin: number | null;
  hscGpaMin: number | null;
  diplomaAllowed: boolean;
  oLevelAllowed: boolean;
  aLevelAllowed: boolean;
  requiredDocuments: string[];
  testPattern: string | null;
  seatPlan?: string;
  resultUrl?: string;
  applyUrl?: string;
  process: string[];
  creditTransfer: boolean;
  internationalAdmission: boolean;
  isOpen: boolean | null;
};

export type UniversityFacilities = {
  library: boolean;
  hostel: boolean;
  transport: boolean;
  medical: boolean;
  sports: boolean;
  researchCenters: number | null;
  clubs: number | null;
  campusAreaAcres?: number | null;
};

export type UniversityRanking = {
  verified: boolean;
  source?: string;
  qsWorld?: number | null;
  qsAsia?: number | null;
  the?: number | null;
  webometrics?: number | null;
  national?: number | null;
  /** @deprecated use qsWorld */
  qs?: number | null;
  employability?: number | null;
  research?: number | null;
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
  difficulty?: number;
  campusLife?: number;
  facultyRating?: number;
  hostelRating?: number;
  placementRating?: number;
  verified?: boolean;
  helpful?: number;
};

export type GalleryImage = {
  id: string;
  category: "campus" | "library" | "labs" | "hostel" | "auditorium" | "sports" | "classrooms" | "events";
  url?: string;
  caption: string;
};

export type VideoTour = {
  id: string;
  title: string;
  youtubeId: string;
  category: "campus" | "admission" | "convocation" | "student-life" | "labs" | "department";
};

export type AdmissionCalendar = {
  applicationOpens?: string | null;
  applicationDeadline?: string | null;
  admissionTest?: string | null;
  resultDate?: string | null;
  orientation?: string | null;
  semesterStart?: string | null;
};

export type AdmissionChance = "very-high" | "high" | "medium" | "low" | "very-low";

export type AdmissionPredictorInput = {
  sscGpa: number;
  hscGpa: number;
  group: "science" | "commerce" | "arts";
  preferredSubject: string;
  preferredCity: string;
  budget: number;
  typePreference: UniversityType | "any";
  preferredUniversitySlug?: string;
  quota?: "freedom-fighter" | "tribal" | "disabled" | "none";
};

export type AdmissionPrediction = {
  university: University;
  chance: AdmissionChance;
  confidence: number;
  reasons: string[];
  eligibility: string[];
};

export type ScholarshipCheckInput = {
  sscGpa: number;
  hscGpa: number;
  incomeRange: "low" | "medium" | "high";
  universitySlug: string;
  department: string;
};

export type ScholarshipOffer = {
  name: string;
  type: "merit" | "need-based" | "waiver" | "financial-aid";
  waiverPercent: number | null;
  eligible: boolean;
  documents: string[];
  deadline: string | null;
  description: string;
};

export type TuitionCalculationInput = {
  slug: string;
  creditsPerSemester: number;
  semesters: number;
  creditsCompleted: number;
  scholarshipPercent: number;
  waiverPercent: number;
  includeLiving: boolean;
  includeHostel: boolean;
  includeTransport: boolean;
  includeFood: boolean;
};

export type TuitionCalculationResult = {
  admissionFee: number;
  registrationFee: number;
  perCreditTotal: number;
  semesterFees: number;
  scholarshipDiscount: number;
  waiverDiscount: number;
  academicTotal: number;
  livingCost: number;
  hostelCost: number;
  transportCost: number;
  foodCost: number;
  grandTotal: number;
  monthlyInstallment: number;
  verified: boolean;
};

export type RecommendationResult = {
  university: University;
  matchPercent: number;
  admissionChance: AdmissionChance;
  estimatedCost: number | null;
  reasons: string[];
};

export type TopListKey =
  | "public"
  | "private"
  | "engineering"
  | "business"
  | "medical"
  | "research"
  | "qs-ranked"
  | "affordable"
  | "popular"
  | "recent";

export type UniversityCareer = {
  verified: boolean;
  employmentRate: number | null;
  avgStartingSalary: number | null;
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
  category: SpecializationCategory;
  division: Division;
  district: string;
  city: string;
  address: string;
  website: string;
  logoUrl?: string;
  admissionPortal?: string;
  email?: string;
  phone?: string;
  facebook?: string;
  linkedin?: string;
  youtube?: string;
  mapEmbedUrl?: string;
  mapUrl?: string;
  galleryImages?: string[];
  gallery?: GalleryImage[];
  videoTours?: VideoTour[];
  admissionCalendar?: AdmissionCalendar;
  studentPopulation: number | null;
  facultyCount: number | null;
  departmentCount: number | null;
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

export type UniversityEnrichment = Partial<
  Omit<University, "admission" | "tuition" | "career" | "rankings" | "facilities">
> & {
  admission?: Partial<AdmissionInfo>;
  tuition?: Partial<TuitionInfo>;
  career?: Partial<UniversityCareer>;
  rankings?: Partial<UniversityRanking>;
  facilities?: Partial<UniversityFacilities>;
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
  facultyCount?: number;
  departmentCount?: number;
  hostel?: boolean;
  eveningProgram?: boolean;
  onlineProgram?: boolean;
};

export type UniversitySort =
  | "name"
  | "newest"
  | "oldest"
  | "rating"
  | "tuition-asc"
  | "tuition-desc"
  | "qs-rank";

export type UniversityFilters = {
  query?: string;
  type?: UniversityType | "all";
  division?: Division | "all";
  district?: string;
  department?: string;
  program?: string;
  subject?: string;
  category?: SpecializationCategory | "all";
  maxBudget?: number;
  scholarship?: boolean;
  hostel?: boolean;
  evening?: boolean;
  online?: boolean;
  admissionOpen?: boolean;
  qsRanked?: boolean;
  top10?: boolean;
  budgetFriendly?: boolean;
  highestRated?: boolean;
  sort?: UniversitySort;
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
  typePreference?: UniversityType | "any";
  hostelNeeded?: boolean;
  scholarshipNeeded?: boolean;
  preferredCity?: string;
};

export type SearchSuggestion = {
  type: "university" | "department" | "program" | "location";
  label: string;
  sublabel?: string;
  slug?: string;
  matchField: string;
};
