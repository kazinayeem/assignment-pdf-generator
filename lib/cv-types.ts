// ── CV Data Types ─────────────────────────────────────────────────────────────

export type SectionId =
  | "summary"
  | "experience"
  | "education"
  | "skills"
  | "projects"
  | "certifications"
  | "languages";

export interface PersonalInfo {
  fullName: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  website: string;
  linkedin: string;
  github: string;
  photoUrl: string;
}

export interface ExperienceItem {
  id: string;
  company: string;
  role: string;
  startDate: string;
  endDate: string;
  current: boolean;
  location: string;
  bullets: string[];
}

export interface EducationItem {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  current: boolean;
  gpa: string;
  location: string;
}

export interface SkillItem {
  id: string;
  name: string;
  level: number; // 1–5
  category: string;
}

export interface ProjectItem {
  id: string;
  name: string;
  description: string;
  tech: string;
  url: string;
  startDate: string;
  endDate: string;
}

export interface CertificationItem {
  id: string;
  name: string;
  issuer: string;
  date: string;
  url: string;
}

export interface LanguageItem {
  id: string;
  name: string;
  level: "Native" | "Fluent" | "Advanced" | "Intermediate" | "Basic";
}

export interface CVSection {
  id: SectionId;
  label: string;
  enabled: boolean;
  order: number;
}

export type CVTemplate =
  | "modern"
  | "classic"
  | "minimal"
  | "modern-ats"
  | "europass"
  | "dark-theme"
  | "creative-gradient"
  | "minimal-elegant"
  | "corporate"
  | "academic"
  | "startup"
  | "two-column"
  | "glassmorphism";

export interface CVData {
  personal: PersonalInfo;
  summary: string;
  experience: ExperienceItem[];
  education: EducationItem[];
  skills: SkillItem[];
  projects: ProjectItem[];
  certifications: CertificationItem[];
  languages: LanguageItem[];
  sections: CVSection[];
  template: CVTemplate;
  accentColor: string;
}

export const DEFAULT_CV: CVData = {
  personal: {
    fullName: "",
    title: "",
    email: "",
    phone: "",
    location: "",
    website: "",
    linkedin: "",
    github: "",
    photoUrl: "",
  },
  summary: "",
  experience: [],
  education: [],
  skills: [],
  projects: [],
  certifications: [],
  languages: [],
  sections: [
    { id: "summary", label: "Summary", enabled: true, order: 0 },
    { id: "experience", label: "Experience", enabled: true, order: 1 },
    { id: "education", label: "Education", enabled: true, order: 2 },
    { id: "skills", label: "Skills", enabled: true, order: 3 },
    { id: "projects", label: "Projects", enabled: true, order: 4 },
    { id: "certifications", label: "Certifications", enabled: true, order: 5 },
    { id: "languages", label: "Languages", enabled: true, order: 6 },
  ],
  template: "modern",
  accentColor: "#2563eb",
};
