"use client";

import React from "react";
import type { CVData } from "@/lib/cv-types";
import { Mail, Phone, MapPin, Globe, Linkedin, Github } from "lucide-react";
import {
  ModernATSTemplate,
  EuropassTemplate,
  DarkThemeTemplate,
  CreativeGradientTemplate,
  MinimalElegantTemplate,
  CorporateTemplate,
  AcademicTemplate,
  StartupTemplate,
  TwoColumnTemplate,
  GlassmorphismTemplate,
} from "./cv-templates-new";

interface Props {
  cv: CVData;
  forExport?: boolean;
}

const LEVEL_LABELS = ["", "Beginner", "Elementary", "Intermediate", "Advanced", "Expert"];

// ── Shared helpers ────────────────────────────────────────────────────────────
function formatDate(d: string) {
  if (!d) return "";
  const [y, m] = d.split("-");
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  return `${months[parseInt(m) - 1] || ""} ${y}`;
}

function SectionHeading({ label, accent }: { label: string; accent: string }) {
  return (
    <div className="flex items-center gap-3 mb-3">
      <h2 style={{ color: accent }} className="text-[11px] font-black uppercase tracking-[0.18em]">
        {label}
      </h2>
      <div className="flex-1 h-px" style={{ backgroundColor: accent, opacity: 0.25 }} />
    </div>
  );
}

// ── Modern Template ───────────────────────────────────────────────────────────
function ModernTemplate({ cv, forExport }: Props) {
  const { personal, summary, experience, education, skills, projects, certifications, languages, sections, accentColor } = cv;
  const ordered = [...sections].filter((s) => s.enabled).sort((a, b) => a.order - b.order);

  const skillsByCategory = skills.reduce<Record<string, typeof skills>>((acc, sk) => {
    const cat = sk.category || "Other";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(sk);
    return acc;
  }, {});

  return (
    <div
      id="cv-preview"
      className="bg-white text-gray-900 font-sans"
      style={{
        width: forExport ? "794px" : "100%",
        minHeight: forExport ? "1123px" : undefined,
        fontSize: "12px",
        lineHeight: "1.5",
        fontFamily: "'Arial', 'Helvetica', sans-serif",
      }}
    >
      {/* Header */}
      <div style={{ backgroundColor: accentColor }} className="px-10 py-8 text-white">
        <div className="flex items-start gap-6">
          {personal.photoUrl && (
            <img
              src={personal.photoUrl}
              alt={personal.fullName}
              className="w-20 h-20 rounded-full object-cover border-2 border-white/30 shrink-0"
            />
          )}
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-black tracking-tight leading-tight">
              {personal.fullName || "Your Name"}
            </h1>
            {personal.title && (
              <p className="text-sm font-semibold mt-1 opacity-85">{personal.title}</p>
            )}
            <div className="flex flex-wrap gap-x-5 gap-y-1 mt-3 text-[11px] opacity-80">
              {personal.email && <span className="flex items-center gap-1"><Mail className="w-3 h-3" />{personal.email}</span>}
              {personal.phone && <span className="flex items-center gap-1"><Phone className="w-3 h-3" />{personal.phone}</span>}
              {personal.location && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{personal.location}</span>}
              {personal.website && <span className="flex items-center gap-1"><Globe className="w-3 h-3" />{personal.website}</span>}
              {personal.linkedin && <span className="flex items-center gap-1"><Linkedin className="w-3 h-3" />{personal.linkedin}</span>}
              {personal.github && <span className="flex items-center gap-1"><Github className="w-3 h-3" />{personal.github}</span>}
            </div>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="px-10 py-7 space-y-6">
        {ordered.map((sec) => {
          if (sec.id === "summary" && summary) return (
            <section key="summary">
              <SectionHeading label="Professional Summary" accent={accentColor} />
              <p className="text-[12px] text-gray-700 leading-relaxed">{summary}</p>
            </section>
          );

          if (sec.id === "experience" && experience.length > 0) return (
            <section key="experience">
              <SectionHeading label="Work Experience" accent={accentColor} />
              <div className="space-y-5">
                {experience.map((exp) => (
                  <div key={exp.id}>
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="font-bold text-[13px] text-gray-900">{exp.role || "Role"}</p>
                        <p className="text-[12px] font-semibold" style={{ color: accentColor }}>{exp.company}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-[11px] text-gray-500 font-medium">
                          {formatDate(exp.startDate)} – {exp.current ? "Present" : formatDate(exp.endDate)}
                        </p>
                        {exp.location && <p className="text-[10px] text-gray-400">{exp.location}</p>}
                      </div>
                    </div>
                    {exp.bullets.filter(Boolean).length > 0 && (
                      <ul className="mt-2 space-y-1 pl-4">
                        {exp.bullets.filter(Boolean).map((b, i) => (
                          <li key={i} className="text-[11.5px] text-gray-700 list-disc">{b}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </section>
          );

          if (sec.id === "education" && education.length > 0) return (
            <section key="education">
              <SectionHeading label="Education" accent={accentColor} />
              <div className="space-y-4">
                {education.map((edu) => (
                  <div key={edu.id} className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-bold text-[13px]">{edu.degree}{edu.field ? ` in ${edu.field}` : ""}</p>
                      <p className="text-[12px] font-semibold" style={{ color: accentColor }}>{edu.institution}</p>
                      {edu.gpa && <p className="text-[11px] text-gray-500">GPA: {edu.gpa}</p>}
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-[11px] text-gray-500 font-medium">
                        {formatDate(edu.startDate)} – {edu.current ? "Present" : formatDate(edu.endDate)}
                      </p>
                      {edu.location && <p className="text-[10px] text-gray-400">{edu.location}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          );

          if (sec.id === "skills" && skills.length > 0) return (
            <section key="skills">
              <SectionHeading label="Skills" accent={accentColor} />
              <div className="space-y-3">
                {Object.entries(skillsByCategory).map(([cat, items]) => (
                  <div key={cat}>
                    <p className="text-[10px] font-black uppercase tracking-wider text-gray-400 mb-2">{cat}</p>
                    <div className="grid grid-cols-2 gap-x-8 gap-y-2">
                      {items.map((sk) => (
                        <div key={sk.id}>
                          <div className="flex justify-between mb-0.5">
                            <span className="text-[11.5px] font-semibold text-gray-800">{sk.name}</span>
                            <span className="text-[10px] text-gray-400">{LEVEL_LABELS[sk.level]}</span>
                          </div>
                          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full transition-all"
                              style={{ width: `${(sk.level / 5) * 100}%`, backgroundColor: accentColor }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          );

          if (sec.id === "projects" && projects.length > 0) return (
            <section key="projects">
              <SectionHeading label="Projects" accent={accentColor} />
              <div className="space-y-4">
                {projects.map((p) => (
                  <div key={p.id}>
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="font-bold text-[13px]">{p.name}</p>
                        {p.tech && <p className="text-[10px] font-semibold text-gray-400 mt-0.5">{p.tech}</p>}
                      </div>
                      {(p.startDate || p.endDate) && (
                        <p className="text-[11px] text-gray-500 shrink-0">
                          {formatDate(p.startDate)}{p.endDate ? ` – ${formatDate(p.endDate)}` : ""}
                        </p>
                      )}
                    </div>
                    {p.description && <p className="text-[11.5px] text-gray-700 mt-1">{p.description}</p>}
                    {p.url && <p className="text-[10px] mt-0.5" style={{ color: accentColor }}>{p.url}</p>}
                  </div>
                ))}
              </div>
            </section>
          );

          if (sec.id === "certifications" && certifications.length > 0) return (
            <section key="certifications">
              <SectionHeading label="Certifications" accent={accentColor} />
              <div className="space-y-2">
                {certifications.map((c) => (
                  <div key={c.id} className="flex items-center justify-between">
                    <div>
                      <span className="font-semibold text-[12px]">{c.name}</span>
                      {c.issuer && <span className="text-gray-500 text-[11px]"> · {c.issuer}</span>}
                    </div>
                    {c.date && <span className="text-[11px] text-gray-400 shrink-0">{formatDate(c.date)}</span>}
                  </div>
                ))}
              </div>
            </section>
          );

          if (sec.id === "languages" && languages.length > 0) return (
            <section key="languages">
              <SectionHeading label="Languages" accent={accentColor} />
              <div className="flex flex-wrap gap-3">
                {languages.map((l) => (
                  <div key={l.id} className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-gray-200 text-[11px]">
                    <span className="font-semibold">{l.name}</span>
                    <span className="text-gray-400">·</span>
                    <span className="text-gray-500">{l.level}</span>
                  </div>
                ))}
              </div>
            </section>
          );

          return null;
        })}
      </div>
    </div>
  );
}

// ── Classic Template ──────────────────────────────────────────────────────────
function ClassicTemplate({ cv, forExport }: Props) {
  const { personal, summary, experience, education, skills, projects, certifications, languages, sections, accentColor } = cv;
  const ordered = [...sections].filter((s) => s.enabled).sort((a, b) => a.order - b.order);

  return (
    <div
      id="cv-preview"
      className="bg-white text-gray-900"
      style={{
        width: forExport ? "794px" : "100%",
        minHeight: forExport ? "1123px" : undefined,
        fontSize: "12px",
        lineHeight: "1.5",
        fontFamily: "'Georgia', 'Times New Roman', serif",
        padding: "48px 56px",
      }}
    >
      {/* Header */}
      <div className="text-center border-b-2 pb-5 mb-6" style={{ borderColor: accentColor }}>
        {personal.photoUrl && (
          <img src={personal.photoUrl} alt={personal.fullName} className="w-16 h-16 rounded-full object-cover mx-auto mb-3 border-2" style={{ borderColor: accentColor }} />
        )}
        <h1 className="text-[22px] font-black tracking-tight" style={{ color: accentColor }}>
          {personal.fullName || "Your Name"}
        </h1>
        {personal.title && <p className="text-[13px] text-gray-600 mt-1 font-medium italic">{personal.title}</p>}
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 mt-3 text-[10.5px] text-gray-500">
          {personal.email && <span>{personal.email}</span>}
          {personal.phone && <span>{personal.phone}</span>}
          {personal.location && <span>{personal.location}</span>}
          {personal.linkedin && <span>{personal.linkedin}</span>}
          {personal.github && <span>{personal.github}</span>}
        </div>
      </div>

      <div className="space-y-5">
        {ordered.map((sec) => {
          if (sec.id === "summary" && summary) return (
            <section key="summary">
              <h2 className="text-[11px] font-black uppercase tracking-[0.2em] mb-2" style={{ color: accentColor }}>Summary</h2>
              <p className="text-[12px] text-gray-700 leading-relaxed">{summary}</p>
            </section>
          );

          if (sec.id === "experience" && experience.length > 0) return (
            <section key="experience">
              <h2 className="text-[11px] font-black uppercase tracking-[0.2em] mb-3" style={{ color: accentColor }}>Experience</h2>
              <div className="space-y-4">
                {experience.map((exp) => (
                  <div key={exp.id}>
                    <div className="flex justify-between items-baseline">
                      <span className="font-bold text-[13px]">{exp.role}</span>
                      <span className="text-[10.5px] text-gray-500">{formatDate(exp.startDate)} – {exp.current ? "Present" : formatDate(exp.endDate)}</span>
                    </div>
                    <p className="text-[11.5px] italic text-gray-600">{exp.company}{exp.location ? `, ${exp.location}` : ""}</p>
                    {exp.bullets.filter(Boolean).length > 0 && (
                      <ul className="mt-1.5 space-y-1 pl-4">
                        {exp.bullets.filter(Boolean).map((b, i) => (
                          <li key={i} className="text-[11.5px] text-gray-700 list-disc">{b}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </section>
          );

          if (sec.id === "education" && education.length > 0) return (
            <section key="education">
              <h2 className="text-[11px] font-black uppercase tracking-[0.2em] mb-3" style={{ color: accentColor }}>Education</h2>
              <div className="space-y-3">
                {education.map((edu) => (
                  <div key={edu.id} className="flex justify-between items-baseline">
                    <div>
                      <p className="font-bold text-[13px]">{edu.degree}{edu.field ? ` in ${edu.field}` : ""}</p>
                      <p className="text-[11.5px] italic text-gray-600">{edu.institution}{edu.location ? `, ${edu.location}` : ""}</p>
                      {edu.gpa && <p className="text-[11px] text-gray-500">GPA: {edu.gpa}</p>}
                    </div>
                    <span className="text-[10.5px] text-gray-500 shrink-0">{formatDate(edu.startDate)} – {edu.current ? "Present" : formatDate(edu.endDate)}</span>
                  </div>
                ))}
              </div>
            </section>
          );

          if (sec.id === "skills" && skills.length > 0) return (
            <section key="skills">
              <h2 className="text-[11px] font-black uppercase tracking-[0.2em] mb-2" style={{ color: accentColor }}>Skills</h2>
              <p className="text-[12px] text-gray-700">{skills.map((s) => s.name).filter(Boolean).join(" · ")}</p>
            </section>
          );

          if (sec.id === "projects" && projects.length > 0) return (
            <section key="projects">
              <h2 className="text-[11px] font-black uppercase tracking-[0.2em] mb-3" style={{ color: accentColor }}>Projects</h2>
              <div className="space-y-3">
                {projects.map((p) => (
                  <div key={p.id}>
                    <p className="font-bold text-[13px]">{p.name}{p.tech ? <span className="font-normal text-gray-500 text-[11px]"> · {p.tech}</span> : null}</p>
                    {p.description && <p className="text-[11.5px] text-gray-700 mt-0.5">{p.description}</p>}
                  </div>
                ))}
              </div>
            </section>
          );

          if (sec.id === "certifications" && certifications.length > 0) return (
            <section key="certifications">
              <h2 className="text-[11px] font-black uppercase tracking-[0.2em] mb-2" style={{ color: accentColor }}>Certifications</h2>
              <div className="space-y-1">
                {certifications.map((c) => (
                  <p key={c.id} className="text-[12px]">
                    <span className="font-semibold">{c.name}</span>
                    {c.issuer && <span className="text-gray-500"> · {c.issuer}</span>}
                    {c.date && <span className="text-gray-400"> · {formatDate(c.date)}</span>}
                  </p>
                ))}
              </div>
            </section>
          );

          if (sec.id === "languages" && languages.length > 0) return (
            <section key="languages">
              <h2 className="text-[11px] font-black uppercase tracking-[0.2em] mb-2" style={{ color: accentColor }}>Languages</h2>
              <p className="text-[12px] text-gray-700">{languages.map((l) => `${l.name} (${l.level})`).join(" · ")}</p>
            </section>
          );

          return null;
        })}
      </div>
    </div>
  );
}

// ── Minimal Template ──────────────────────────────────────────────────────────
function MinimalTemplate({ cv, forExport }: Props) {
  const { personal, summary, experience, education, skills, projects, certifications, languages, sections, accentColor } = cv;
  const ordered = [...sections].filter((s) => s.enabled).sort((a, b) => a.order - b.order);

  return (
    <div
      id="cv-preview"
      className="bg-white text-gray-900"
      style={{
        width: forExport ? "794px" : "100%",
        minHeight: forExport ? "1123px" : undefined,
        fontSize: "12px",
        lineHeight: "1.6",
        fontFamily: "'Arial', 'Helvetica', sans-serif",
        display: "grid",
        gridTemplateColumns: "200px 1fr",
      }}
    >
      {/* Left sidebar */}
      <div style={{ backgroundColor: `${accentColor}12`, borderRight: `3px solid ${accentColor}` }} className="p-6 space-y-6">
        {personal.photoUrl && (
          <img src={personal.photoUrl} alt={personal.fullName} className="w-full aspect-square object-cover rounded-xl" />
        )}
        <div>
          <p className="text-[9px] font-black uppercase tracking-widest mb-2" style={{ color: accentColor }}>Contact</p>
          <div className="space-y-1.5 text-[10.5px] text-gray-600">
            {personal.email && <p className="break-all">{personal.email}</p>}
            {personal.phone && <p>{personal.phone}</p>}
            {personal.location && <p>{personal.location}</p>}
            {personal.website && <p className="break-all">{personal.website}</p>}
            {personal.linkedin && <p className="break-all">{personal.linkedin}</p>}
            {personal.github && <p className="break-all">{personal.github}</p>}
          </div>
        </div>

        {skills.length > 0 && (
          <div>
            <p className="text-[9px] font-black uppercase tracking-widest mb-2" style={{ color: accentColor }}>Skills</p>
            <div className="space-y-2">
              {skills.map((sk) => (
                <div key={sk.id}>
                  <p className="text-[10.5px] font-semibold text-gray-700 mb-0.5">{sk.name}</p>
                  <div className="h-1 bg-gray-200 rounded-full">
                    <div className="h-full rounded-full" style={{ width: `${(sk.level / 5) * 100}%`, backgroundColor: accentColor }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {languages.length > 0 && (
          <div>
            <p className="text-[9px] font-black uppercase tracking-widest mb-2" style={{ color: accentColor }}>Languages</p>
            <div className="space-y-1">
              {languages.map((l) => (
                <div key={l.id}>
                  <p className="text-[10.5px] font-semibold text-gray-700">{l.name}</p>
                  <p className="text-[9.5px] text-gray-400">{l.level}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Right main */}
      <div className="p-7 space-y-5">
        <div>
          <h1 className="text-[20px] font-black tracking-tight text-gray-900">{personal.fullName || "Your Name"}</h1>
          {personal.title && <p className="text-[13px] font-semibold mt-0.5" style={{ color: accentColor }}>{personal.title}</p>}
        </div>

        {ordered.map((sec) => {
          if (sec.id === "summary" && summary) return (
            <section key="summary">
              <h2 className="text-[10px] font-black uppercase tracking-[0.2em] mb-2" style={{ color: accentColor }}>About</h2>
              <p className="text-[11.5px] text-gray-700 leading-relaxed">{summary}</p>
            </section>
          );

          if (sec.id === "experience" && experience.length > 0) return (
            <section key="experience">
              <h2 className="text-[10px] font-black uppercase tracking-[0.2em] mb-3" style={{ color: accentColor }}>Experience</h2>
              <div className="space-y-4">
                {experience.map((exp) => (
                  <div key={exp.id} className="relative pl-4 border-l-2" style={{ borderColor: `${accentColor}40` }}>
                    <div className="absolute -left-[5px] top-1 w-2 h-2 rounded-full" style={{ backgroundColor: accentColor }} />
                    <p className="font-bold text-[12.5px]">{exp.role}</p>
                    <p className="text-[11px] font-semibold text-gray-500">{exp.company} · {formatDate(exp.startDate)} – {exp.current ? "Present" : formatDate(exp.endDate)}</p>
                    {exp.bullets.filter(Boolean).length > 0 && (
                      <ul className="mt-1.5 space-y-0.5 pl-3">
                        {exp.bullets.filter(Boolean).map((b, i) => (
                          <li key={i} className="text-[11px] text-gray-600 list-disc">{b}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </section>
          );

          if (sec.id === "education" && education.length > 0) return (
            <section key="education">
              <h2 className="text-[10px] font-black uppercase tracking-[0.2em] mb-3" style={{ color: accentColor }}>Education</h2>
              <div className="space-y-3">
                {education.map((edu) => (
                  <div key={edu.id} className="relative pl-4 border-l-2" style={{ borderColor: `${accentColor}40` }}>
                    <div className="absolute -left-[5px] top-1 w-2 h-2 rounded-full" style={{ backgroundColor: accentColor }} />
                    <p className="font-bold text-[12.5px]">{edu.degree}{edu.field ? ` in ${edu.field}` : ""}</p>
                    <p className="text-[11px] text-gray-500">{edu.institution} · {formatDate(edu.startDate)} – {edu.current ? "Present" : formatDate(edu.endDate)}</p>
                    {edu.gpa && <p className="text-[10.5px] text-gray-400">GPA: {edu.gpa}</p>}
                  </div>
                ))}
              </div>
            </section>
          );

          if (sec.id === "projects" && projects.length > 0) return (
            <section key="projects">
              <h2 className="text-[10px] font-black uppercase tracking-[0.2em] mb-3" style={{ color: accentColor }}>Projects</h2>
              <div className="space-y-3">
                {projects.map((p) => (
                  <div key={p.id}>
                    <p className="font-bold text-[12.5px]">{p.name}</p>
                    {p.tech && <p className="text-[10px] text-gray-400 font-medium">{p.tech}</p>}
                    {p.description && <p className="text-[11px] text-gray-600 mt-0.5">{p.description}</p>}
                  </div>
                ))}
              </div>
            </section>
          );

          if (sec.id === "certifications" && certifications.length > 0) return (
            <section key="certifications">
              <h2 className="text-[10px] font-black uppercase tracking-[0.2em] mb-2" style={{ color: accentColor }}>Certifications</h2>
              <div className="space-y-1">
                {certifications.map((c) => (
                  <p key={c.id} className="text-[11.5px]">
                    <span className="font-semibold">{c.name}</span>
                    {c.issuer && <span className="text-gray-500"> · {c.issuer}</span>}
                  </p>
                ))}
              </div>
            </section>
          );

          return null;
        })}
      </div>
    </div>
  );
}

// ── Main export ───────────────────────────────────────────────────────────────
export default function CVPreview({ cv, forExport = false }: Props) {
  switch (cv.template) {
    case "classic":            return <ClassicTemplate cv={cv} forExport={forExport} />;
    case "minimal":            return <MinimalTemplate cv={cv} forExport={forExport} />;
    case "modern-ats":         return <ModernATSTemplate cv={cv} forExport={forExport} />;
    case "europass":           return <EuropassTemplate cv={cv} forExport={forExport} />;
    case "dark-theme":         return <DarkThemeTemplate cv={cv} forExport={forExport} />;
    case "creative-gradient":  return <CreativeGradientTemplate cv={cv} forExport={forExport} />;
    case "minimal-elegant":    return <MinimalElegantTemplate cv={cv} forExport={forExport} />;
    case "corporate":          return <CorporateTemplate cv={cv} forExport={forExport} />;
    case "academic":           return <AcademicTemplate cv={cv} forExport={forExport} />;
    case "startup":            return <StartupTemplate cv={cv} forExport={forExport} />;
    case "two-column":         return <TwoColumnTemplate cv={cv} forExport={forExport} />;
    case "glassmorphism":      return <GlassmorphismTemplate cv={cv} forExport={forExport} />;
    default:                   return <ModernTemplate cv={cv} forExport={forExport} />;
  }
}
