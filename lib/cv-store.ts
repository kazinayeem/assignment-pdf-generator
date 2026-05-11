"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  CVData,
  PersonalInfo,
  ExperienceItem,
  EducationItem,
  SkillItem,
  ProjectItem,
  CertificationItem,
  LanguageItem,
  CVSection,
  CVTemplate,
  SectionId,
} from "./cv-types";
import { DEFAULT_CV } from "./cv-types";

interface CVStore {
  cv: CVData;
  activeSection: SectionId | "personal";
  // Personal
  updatePersonal: (data: Partial<PersonalInfo>) => void;
  updateSummary: (text: string) => void;
  // Experience
  addExperience: () => void;
  updateExperience: (id: string, data: Partial<ExperienceItem>) => void;
  removeExperience: (id: string) => void;
  // Education
  addEducation: () => void;
  updateEducation: (id: string, data: Partial<EducationItem>) => void;
  removeEducation: (id: string) => void;
  // Skills
  addSkill: () => void;
  updateSkill: (id: string, data: Partial<SkillItem>) => void;
  removeSkill: (id: string) => void;
  // Projects
  addProject: () => void;
  updateProject: (id: string, data: Partial<ProjectItem>) => void;
  removeProject: (id: string) => void;
  // Certifications
  addCertification: () => void;
  updateCertification: (id: string, data: Partial<CertificationItem>) => void;
  removeCertification: (id: string) => void;
  // Languages
  addLanguage: () => void;
  updateLanguage: (id: string, data: Partial<LanguageItem>) => void;
  removeLanguage: (id: string) => void;
  // Sections
  reorderSections: (sections: CVSection[]) => void;
  toggleSection: (id: SectionId) => void;
  // Template & style
  setTemplate: (t: CVTemplate) => void;
  setAccentColor: (c: string) => void;
  setActiveSection: (s: SectionId | "personal") => void;
  // Reset
  resetCV: () => void;
}

const uid = () => Math.random().toString(36).slice(2, 9);

export const useCVStore = create<CVStore>()(
  persist(
    (set) => ({
      cv: DEFAULT_CV,
      activeSection: "personal",

      updatePersonal: (data) =>
        set((s) => ({ cv: { ...s.cv, personal: { ...s.cv.personal, ...data } } })),

      updateSummary: (text) =>
        set((s) => ({ cv: { ...s.cv, summary: text } })),

      addExperience: () =>
        set((s) => ({
          cv: {
            ...s.cv,
            experience: [
              ...s.cv.experience,
              {
                id: uid(),
                company: "",
                role: "",
                startDate: "",
                endDate: "",
                current: false,
                location: "",
                bullets: [""],
              },
            ],
          },
        })),

      updateExperience: (id, data) =>
        set((s) => ({
          cv: {
            ...s.cv,
            experience: s.cv.experience.map((e) =>
              e.id === id ? { ...e, ...data } : e
            ),
          },
        })),

      removeExperience: (id) =>
        set((s) => ({
          cv: { ...s.cv, experience: s.cv.experience.filter((e) => e.id !== id) },
        })),

      addEducation: () =>
        set((s) => ({
          cv: {
            ...s.cv,
            education: [
              ...s.cv.education,
              {
                id: uid(),
                institution: "",
                degree: "",
                field: "",
                startDate: "",
                endDate: "",
                current: false,
                gpa: "",
                location: "",
              },
            ],
          },
        })),

      updateEducation: (id, data) =>
        set((s) => ({
          cv: {
            ...s.cv,
            education: s.cv.education.map((e) =>
              e.id === id ? { ...e, ...data } : e
            ),
          },
        })),

      removeEducation: (id) =>
        set((s) => ({
          cv: { ...s.cv, education: s.cv.education.filter((e) => e.id !== id) },
        })),

      addSkill: () =>
        set((s) => ({
          cv: {
            ...s.cv,
            skills: [
              ...s.cv.skills,
              { id: uid(), name: "", level: 3, category: "Technical" },
            ],
          },
        })),

      updateSkill: (id, data) =>
        set((s) => ({
          cv: {
            ...s.cv,
            skills: s.cv.skills.map((sk) =>
              sk.id === id ? { ...sk, ...data } : sk
            ),
          },
        })),

      removeSkill: (id) =>
        set((s) => ({
          cv: { ...s.cv, skills: s.cv.skills.filter((sk) => sk.id !== id) },
        })),

      addProject: () =>
        set((s) => ({
          cv: {
            ...s.cv,
            projects: [
              ...s.cv.projects,
              {
                id: uid(),
                name: "",
                description: "",
                tech: "",
                url: "",
                startDate: "",
                endDate: "",
              },
            ],
          },
        })),

      updateProject: (id, data) =>
        set((s) => ({
          cv: {
            ...s.cv,
            projects: s.cv.projects.map((p) =>
              p.id === id ? { ...p, ...data } : p
            ),
          },
        })),

      removeProject: (id) =>
        set((s) => ({
          cv: { ...s.cv, projects: s.cv.projects.filter((p) => p.id !== id) },
        })),

      addCertification: () =>
        set((s) => ({
          cv: {
            ...s.cv,
            certifications: [
              ...s.cv.certifications,
              { id: uid(), name: "", issuer: "", date: "", url: "" },
            ],
          },
        })),

      updateCertification: (id, data) =>
        set((s) => ({
          cv: {
            ...s.cv,
            certifications: s.cv.certifications.map((c) =>
              c.id === id ? { ...c, ...data } : c
            ),
          },
        })),

      removeCertification: (id) =>
        set((s) => ({
          cv: {
            ...s.cv,
            certifications: s.cv.certifications.filter((c) => c.id !== id),
          },
        })),

      addLanguage: () =>
        set((s) => ({
          cv: {
            ...s.cv,
            languages: [
              ...s.cv.languages,
              { id: uid(), name: "", level: "Intermediate" as const },
            ],
          },
        })),

      updateLanguage: (id, data) =>
        set((s) => ({
          cv: {
            ...s.cv,
            languages: s.cv.languages.map((l) =>
              l.id === id ? { ...l, ...data } : l
            ),
          },
        })),

      removeLanguage: (id) =>
        set((s) => ({
          cv: { ...s.cv, languages: s.cv.languages.filter((l) => l.id !== id) },
        })),

      reorderSections: (sections) =>
        set((s) => ({ cv: { ...s.cv, sections } })),

      toggleSection: (id) =>
        set((s) => ({
          cv: {
            ...s.cv,
            sections: s.cv.sections.map((sec) =>
              sec.id === id ? { ...sec, enabled: !sec.enabled } : sec
            ),
          },
        })),

      setTemplate: (t) =>
        set((s) => ({ cv: { ...s.cv, template: t } })),

      setAccentColor: (c) =>
        set((s) => ({ cv: { ...s.cv, accentColor: c } })),

      setActiveSection: (section) => set({ activeSection: section }),

      resetCV: () => set({ cv: DEFAULT_CV, activeSection: "personal" }),
    }),
    { name: "covergen-cv" }
  )
);
