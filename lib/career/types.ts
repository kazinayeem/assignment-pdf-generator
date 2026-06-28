export type ApplicationStatus =
  | "applied"
  | "under-review"
  | "interview"
  | "technical"
  | "hr-round"
  | "offer"
  | "rejected"
  | "accepted";

export type JobApplication = {
  id: string;
  company: string;
  role: string;
  location?: string;
  salary?: string;
  status: ApplicationStatus;
  appliedAt: string;
  deadline?: string;
  interviewDate?: string;
  recruiter?: string;
  jobUrl?: string;
  notes?: string;
  type: "job" | "internship";
};

export type SavedJob = {
  id: string;
  company: string;
  role: string;
  location: string;
  url?: string;
  savedAt: string;
};

export type SkillProgress = {
  skill: string;
  progress: number;
  category: string;
};

export type CareerActivity = {
  id: string;
  action: string;
  detail: string;
  timestamp: string;
};

export type MockInterviewResult = {
  id: string;
  category: string;
  score: number;
  questionsAnswered: number;
  date: string;
};

export type CareerTool = {
  slug: string;
  title: string;
  description: string;
  icon: string;
  category: CareerToolCategory;
  href: string;
  popular?: boolean;
  featured?: boolean;
  external?: boolean;
};

export type CareerToolCategory =
  | "resume"
  | "applications"
  | "interview"
  | "growth"
  | "analytics";

export type InterviewSubject = {
  slug: string;
  title: string;
  category: "technical" | "behavioral" | "hr";
  description: string;
  theory: string[];
  mcqs: { q: string; options: string[]; answer: number }[];
  flashcards: { front: string; back: string }[];
  interviewQuestions: string[];
  companyQuestions: string[];
  cheatSheet: string[];
};

export type CareerRoadmap = {
  slug: string;
  title: string;
  description: string;
  icon: string;
  estimatedMonths: number;
  skills: string[];
  courses: string[];
  projects: string[];
  certifications: string[];
  interviewPrep: string[];
  phases: { title: string; items: string[] }[];
};

export type CoverLetterType =
  | "internship"
  | "job"
  | "scholarship"
  | "research"
  | "graduate";
