export type RoadmapDifficulty = "beginner" | "intermediate" | "advanced" | "expert";
export type NodeStatus = "locked" | "available" | "in-progress" | "completed";
export type RoadmapCategory =
  | "role"
  | "language"
  | "framework"
  | "cloud"
  | "security"
  | "data"
  | "ai"
  | "mobile"
  | "devops"
  | "design"
  | "other";

export type RoadmapNodeResource = {
  label: string;
  url: string;
  type: "docs" | "book" | "video" | "course" | "article" | "repo" | "practice";
};

export type RoadmapCodingChallenge = {
  title: string;
  difficulty: RoadmapDifficulty;
  hints: string[];
  complexity?: string;
};

export type RoadmapProject = {
  title: string;
  level: "beginner" | "intermediate" | "advanced" | "production" | "open-source" | "portfolio";
  description: string;
  requirements: string[];
  tech: string[];
};

export type RoadmapQuiz = {
  question: string;
  options: string[];
  answer: number;
  explanation: string;
};

export type RoadmapInterviewItem = {
  question: string;
  type: "hr" | "technical" | "behavioral" | "system-design" | "scenario";
  hint?: string;
};

export type InterviewCategory =
  | "theory"
  | "practical"
  | "coding"
  | "scenario"
  | "debugging"
  | "design"
  | "architecture"
  | "behavioral"
  | "hr";

export type InterviewQuestion = {
  id: string;
  question: string;
  answer: string;
  explanation: string;
  commonMistakes: string[];
  followUpQuestions: string[];
  difficulty: RoadmapDifficulty;
  category: InterviewCategory;
  company?: string;
  topic?: string;
  tips: string[];
};

export type CodingProblem = {
  id: string;
  title: string;
  difficulty: RoadmapDifficulty;
  topic?: string;
  statement: string;
  input: string;
  output: string;
  constraints: string[];
  hints: string[];
  solution: string;
  timeComplexity: string;
  spaceComplexity: string;
};

export type LearningResource = {
  id: string;
  title: string;
  description: string;
  url: string;
  type: "docs" | "book" | "video" | "course" | "article" | "repo" | "practice" | "tool" | "cheatsheet";
  difficulty: RoadmapDifficulty;
  pricing: "free" | "paid" | "freemium";
  estimatedHours: number;
  topic?: string;
};

export type SalaryBand = {
  region: string;
  entry: string;
  mid: string;
  senior: string;
  lead: string;
  architect: string;
  freelanceHourly: string;
  remote: string;
};

export type CareerOutlook = {
  overview: string;
  responsibilities: string[];
  industries: string[];
  remoteOpportunities: string;
  freelanceOpportunities: string;
  startupOpportunities: string;
  enterpriseOpportunities: string;
  topHiringCompanies: string[];
  requiredSkills: string[];
  futureDemand: string;
  marketGrowth: string;
  automationRisk: string;
  certifications: string[];
  dailyWorkflow: string[];
  teamStructure: string;
  careerLadder: string[];
  salaries: SalaryBand[];
  salaryDisclaimer: string;
};

export type LearningPathGuide = {
  nextRoadmaps: { slug: string; title: string; reason: string }[];
  prerequisites: string[];
  advancedTopics: string[];
  relatedTechnologies: string[];
};

export type PortfolioChecklistItem = {
  id: string;
  label: string;
  level: string;
  required: boolean;
};

export type ReadinessBreakdown = {
  topicsCompleted: number;
  projectsCompleted: number;
  interviewPracticed: number;
  codingSolved: number;
  portfolioReady: number;
  resumeReady: number;
  githubReady: number;
  linkedinReady: number;
  mockInterviewCompleted: number;
  overall: number;
  isComplete: boolean;
};

export type RoadmapEnrichment = {
  interviewHub: InterviewQuestion[];
  codingProblems: CodingProblem[];
  resources: LearningResource[];
  career: CareerOutlook;
  learningPath: LearningPathGuide;
  portfolioChecklist: PortfolioChecklistItem[];
};

export type RoadmapNode = {
  id: string;
  title: string;
  description: string;
  difficulty: RoadmapDifficulty;
  estimatedHours: number;
  phaseId: string;
  position: { x: number; y: number };
  theory?: string;
  bestPractices?: string[];
  commonMistakes?: string[];
  codeExample?: string;
  cheatSheet?: string[];
  resources: RoadmapNodeResource[];
  projects: RoadmapProject[];
  challenges: RoadmapCodingChallenge[];
  quizzes: RoadmapQuiz[];
  interview: RoadmapInterviewItem[];
  interviewQuestions: InterviewQuestion[];
  codingProblems: CodingProblem[];
  learningResources: LearningResource[];
  videos?: { title: string; url: string }[];
  aiSummary?: string;
};

export type RoadmapEdge = {
  id: string;
  source: string;
  target: string;
};

export type RoadmapPhase = {
  id: string;
  title: string;
  description: string;
};

export type RoadmapMeta = {
  slug: string;
  title: string;
  shortTitle: string;
  description: string;
  icon: string;
  category: RoadmapCategory;
  difficulty: RoadmapDifficulty;
  learningMonths: number;
  learningHours: number;
  prerequisites: string[];
  salaryRange: string;
  jobMarket: "high" | "medium" | "growing" | "niche";
  demand: "very-high" | "high" | "medium";
  tags: string[];
  languages: string[];
  beginnerFriendly: boolean;
  popularity: number;
  updatedAt: string;
  featured?: boolean;
};

export type RoadmapNodeDefinition = Omit<
  RoadmapNode,
  "position" | "interviewQuestions" | "codingProblems" | "learningResources"
>;

export type RoadmapDefinition = RoadmapMeta & {
  phases: RoadmapPhase[];
  nodeDefs: RoadmapNodeDefinition[];
  edges: RoadmapEdge[];
};

export type Roadmap = RoadmapDefinition & {
  nodes: RoadmapNode[];
  enrichment: RoadmapEnrichment;
};

export type RoadmapProgress = {
  completedNodeIds: string[];
  bookmarked: boolean;
  bookmarkedNodeIds: string[];
  recentNodeIds: string[];
  quizScores: Record<string, number>;
  lastVisitedAt: string | null;
  studyMinutes: number;
  interviewPracticedIds: string[];
  codingSolvedIds: string[];
  portfolioCompleted: Record<string, boolean>;
  mockInterviewDone: boolean;
  resumeReady: boolean;
  githubReady: boolean;
  linkedinReady: boolean;
};

export type RoadmapsUserState = {
  progress: Record<string, RoadmapProgress>;
  bookmarks: string[];
  recentSlugs: string[];
  dailyGoalMinutes: number;
  weeklyGoalMinutes: number;
  studyMinutesToday: number;
  studyMinutesWeek: number;
  streakDays: number;
  lastStudyDate: string | null;
  favoriteTech: string[];
  careerGoal: string | null;
};
