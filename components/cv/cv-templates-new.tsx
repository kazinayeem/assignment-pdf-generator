"use client";

import React from "react";
import type { CVData } from "@/lib/cv-types";

interface Props {
  cv: CVData;
  forExport?: boolean;
}

const LEVEL_LABELS = ["", "Beginner", "Elementary", "Intermediate", "Advanced", "Expert"];

function formatDate(d: string) {
  if (!d) return "";
  const [y, m] = d.split("-");
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  return `${months[parseInt(m) - 1] || ""} ${y}`;
}

function fmtRange(s: string, e: string, cur: boolean) {
  return `${formatDate(s)} – ${cur ? "Present" : formatDate(e)}`;
}

// ── 1. Modern ATS Professional ─────────────────────────────────────────────────
export function ModernATSTemplate({ cv, forExport }: Props) {
  const { personal, summary, experience, education, skills, projects, certifications, languages, sections, accentColor } = cv;
  const ordered = [...sections].filter((s) => s.enabled).sort((a, b) => a.order - b.order);
  const skillCats = skills.reduce<Record<string, typeof skills>>((acc, sk) => {
    const cat = sk.category || "Other"; if (!acc[cat]) acc[cat] = []; acc[cat].push(sk); return acc;
  }, {});

  return (
    <div id="cv-preview" style={{ width: forExport ? "794px" : "100%", minHeight: forExport ? "1123px" : undefined, fontSize: "11.5px", lineHeight: "1.5", fontFamily: "'Inter','Segoe UI',Arial,sans-serif" }} className="bg-white text-gray-900">
      {/* Minimal header */}
      <div style={{ borderBottom: `3px solid ${accentColor}`, padding: "28px 32px 20px" }}>
        <h1 style={{ fontSize: "22px", fontWeight: 900, letterSpacing: "-0.5px", color: "#111" }}>{personal.fullName || "Your Name"}</h1>
        {personal.title && <p style={{ fontSize: "13px", fontWeight: 600, color: accentColor, marginTop: 2 }}>{personal.title}</p>}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", marginTop: 10, fontSize: "10.5px", color: "#666" }}>
          {personal.email && <span>{personal.email}</span>}
          {personal.phone && <span>{personal.phone}</span>}
          {personal.location && <span>{personal.location}</span>}
          {personal.linkedin && <span>{personal.linkedin}</span>}
          {personal.github && <span>{personal.github}</span>}
          {personal.website && <span>{personal.website}</span>}
        </div>
      </div>
      <div style={{ padding: "20px 32px", display: "flex", gap: "24px" }}>
        {personal.photoUrl && (
          <img src={personal.photoUrl} alt="" style={{ width: 72, height: 72, borderRadius: "50%", objectFit: "cover", border: `2px solid ${accentColor}30`, flexShrink: 0 }} />
        )}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 16 }}>
          {ordered.map((sec) => {
            if (sec.id === "summary" && summary) return (
              <section key="summary">
                <h2 style={{ fontSize: "10px", fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.15em", color: accentColor, marginBottom: 6 }}>Summary</h2>
                <p style={{ fontSize: "11.5px", color: "#444", lineHeight: "1.6" }}>{summary}</p>
              </section>
            );
            if (sec.id === "experience" && experience.length > 0) return (
              <section key="experience">
                <h2 style={{ fontSize: "10px", fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.15em", color: accentColor, marginBottom: 8 }}>Experience</h2>
                {experience.map((exp) => (
                  <div key={exp.id} style={{ marginBottom: 10 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                      <span style={{ fontWeight: 700, fontSize: "12px" }}>{exp.role}</span>
                      <span style={{ fontSize: "10px", color: "#888" }}>{fmtRange(exp.startDate, exp.endDate, exp.current)}</span>
                    </div>
                    <p style={{ fontSize: "11px", fontWeight: 600, color: accentColor }}>{exp.company}{exp.location ? `, ${exp.location}` : ""}</p>
                    {exp.bullets.filter(Boolean).length > 0 && (
                      <ul style={{ margin: "4px 0 0 16px", padding: 0 }}>
                        {exp.bullets.filter(Boolean).map((b, i) => <li key={i} style={{ fontSize: "11px", color: "#555", marginBottom: 1 }}>{b}</li>)}
                      </ul>
                    )}
                  </div>
                ))}
              </section>
            );
            if (sec.id === "education" && education.length > 0) return (
              <section key="education">
                <h2 style={{ fontSize: "10px", fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.15em", color: accentColor, marginBottom: 8 }}>Education</h2>
                {education.map((edu) => (
                  <div key={edu.id} style={{ marginBottom: 6, display: "flex", justifyContent: "space-between" }}>
                    <div><span style={{ fontWeight: 700, fontSize: "12px" }}>{edu.degree}{edu.field ? ` in ${edu.field}` : ""}</span><p style={{ fontSize: "11px", color: "#555" }}>{edu.institution}{edu.gpa ? ` · GPA: ${edu.gpa}` : ""}</p></div>
                    <span style={{ fontSize: "10px", color: "#888", whiteSpace: "nowrap" }}>{fmtRange(edu.startDate, edu.endDate, edu.current)}</span>
                  </div>
                ))}
              </section>
            );
            if (sec.id === "skills" && skills.length > 0) return (
              <section key="skills">
                <h2 style={{ fontSize: "10px", fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.15em", color: accentColor, marginBottom: 6 }}>Skills</h2>
                {Object.entries(skillCats).map(([cat, items]) => (
                  <div key={cat} style={{ marginBottom: 6 }}>
                    <p style={{ fontSize: "9px", fontWeight: 800, textTransform: "uppercase", color: "#999", marginBottom: 4 }}>{cat}</p>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "4px 12px" }}>
                      {items.map((sk) => <span key={sk.id} style={{ fontSize: "11px", color: "#444" }}>{sk.name}<span style={{ color: "#aaa" }}> ({LEVEL_LABELS[sk.level]})</span></span>)}
                    </div>
                  </div>
                ))}
              </section>
            );
            if (sec.id === "projects" && projects.length > 0) return (
              <section key="projects">
                <h2 style={{ fontSize: "10px", fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.15em", color: accentColor, marginBottom: 6 }}>Projects</h2>
                {projects.map((p) => (
                  <div key={p.id} style={{ marginBottom: 8 }}>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span style={{ fontWeight: 700, fontSize: "12px" }}>{p.name}</span>
                      {(p.startDate || p.endDate) && <span style={{ fontSize: "10px", color: "#888" }}>{fmtRange(p.startDate, p.endDate, false)}</span>}
                    </div>
                    {p.tech && <p style={{ fontSize: "10px", color: accentColor, fontWeight: 600 }}>{p.tech}</p>}
                    {p.description && <p style={{ fontSize: "11px", color: "#555", marginTop: 2 }}>{p.description}</p>}
                  </div>
                ))}
              </section>
            );
            if (sec.id === "certifications" && certifications.length > 0) return (
              <section key="certifications">
                <h2 style={{ fontSize: "10px", fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.15em", color: accentColor, marginBottom: 6 }}>Certifications</h2>
                {certifications.map((c) => (
                  <div key={c.id} style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                    <span style={{ fontSize: "11px" }}><span style={{ fontWeight: 600 }}>{c.name}</span>{c.issuer ? <span style={{ color: "#777" }}> · {c.issuer}</span> : null}</span>
                    {c.date && <span style={{ fontSize: "10px", color: "#888" }}>{formatDate(c.date)}</span>}
                  </div>
                ))}
              </section>
            );
            if (sec.id === "languages" && languages.length > 0) return (
              <section key="languages">
                <h2 style={{ fontSize: "10px", fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.15em", color: accentColor, marginBottom: 6 }}>Languages</h2>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {languages.map((l) => <span key={l.id} style={{ fontSize: "11px", padding: "2px 10px", borderRadius: 999, border: "1px solid #eee", color: "#555" }}>{l.name} · {l.level}</span>)}
                </div>
              </section>
            );
            return null;
          })}
        </div>
      </div>
    </div>
  );
}

// ── 2. Europass Style ──────────────────────────────────────────────────────────
export function EuropassTemplate({ cv, forExport }: Props) {
  const { personal, summary, experience, education, skills, projects, certifications, languages, sections, accentColor } = cv;
  const ordered = [...sections].filter((s) => s.enabled).sort((a, b) => a.order - b.order);

  return (
    <div id="cv-preview" style={{ width: forExport ? "794px" : "100%", minHeight: forExport ? "1123px" : undefined, fontSize: "11px", lineHeight: "1.5", fontFamily: "'Calibri','Segoe UI',Arial,sans-serif" }} className="bg-white text-gray-900">
      <div style={{ background: `linear-gradient(135deg, ${accentColor}, ${accentColor}dd)`, padding: "32px 40px 24px", color: "#fff" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          {personal.photoUrl && <img src={personal.photoUrl} alt="" style={{ width: 80, height: 80, borderRadius: "50%", objectFit: "cover", border: "3px solid rgba(255,255,255,0.4)" }} />}
          <div>
            <h1 style={{ fontSize: "24px", fontWeight: 900, letterSpacing: "-0.3px" }}>{personal.fullName || "Your Name"}</h1>
            {personal.title && <p style={{ fontSize: "14px", fontWeight: 600, opacity: 0.9, marginTop: 2 }}>{personal.title}</p>}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px 16px", marginTop: 8, fontSize: "10.5px", opacity: 0.85 }}>
              {personal.email && <span>✉ {personal.email}</span>}
              {personal.phone && <span>📞 {personal.phone}</span>}
              {personal.location && <span>📍 {personal.location}</span>}
              {personal.linkedin && <span>🔗 {personal.linkedin}</span>}
            </div>
          </div>
        </div>
      </div>
      <div style={{ padding: "24px 40px", display: "flex", flexDirection: "column", gap: 14 }}>
        {ordered.map((sec) => {
          if (sec.id === "summary" && summary) return (
            <section key="summary">
              <h2 style={{ fontSize: "11px", fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.12em", color: accentColor, borderBottom: `2px solid ${accentColor}30`, paddingBottom: 4, marginBottom: 8 }}>Professional Summary</h2>
              <p style={{ fontSize: "11px", color: "#444", lineHeight: "1.6" }}>{summary}</p>
            </section>
          );
          if (sec.id === "experience" && experience.length > 0) return (
            <section key="experience">
              <h2 style={{ fontSize: "11px", fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.12em", color: accentColor, borderBottom: `2px solid ${accentColor}30`, paddingBottom: 4, marginBottom: 8 }}>Work Experience</h2>
              {experience.map((exp) => (
                <div key={exp.id} style={{ marginBottom: 10, paddingLeft: 12, borderLeft: `2px solid ${accentColor}20` }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                    <span style={{ fontWeight: 700, fontSize: "12px" }}>{exp.role}</span>
                    <span style={{ fontSize: "10px", color: "#888" }}>{fmtRange(exp.startDate, exp.endDate, exp.current)}</span>
                  </div>
                  <p style={{ fontSize: "11px", color: accentColor, fontWeight: 600 }}>{exp.company}</p>
                  {exp.bullets.filter(Boolean).length > 0 && (
                    <ul style={{ margin: "4px 0 0 16px", padding: 0 }}>
                      {exp.bullets.filter(Boolean).map((b, i) => <li key={i} style={{ fontSize: "10.5px", color: "#555", marginBottom: 1 }}>{b}</li>)}
                    </ul>
                  )}
                </div>
              ))}
            </section>
          );
          if (sec.id === "education" && education.length > 0) return (
            <section key="education">
              <h2 style={{ fontSize: "11px", fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.12em", color: accentColor, borderBottom: `2px solid ${accentColor}30`, paddingBottom: 4, marginBottom: 8 }}>Education</h2>
              {education.map((edu) => (
                <div key={edu.id} style={{ marginBottom: 6, paddingLeft: 12, borderLeft: `2px solid ${accentColor}20` }}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ fontWeight: 700, fontSize: "12px" }}>{edu.degree}{edu.field ? ` in ${edu.field}` : ""}</span>
                    <span style={{ fontSize: "10px", color: "#888" }}>{fmtRange(edu.startDate, edu.endDate, edu.current)}</span>
                  </div>
                  <p style={{ fontSize: "11px", color: "#555" }}>{edu.institution}{edu.location ? `, ${edu.location}` : ""}{edu.gpa ? ` | GPA: ${edu.gpa}` : ""}</p>
                </div>
              ))}
            </section>
          );
          if (sec.id === "skills" && skills.length > 0) return (
            <section key="skills">
              <h2 style={{ fontSize: "11px", fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.12em", color: accentColor, borderBottom: `2px solid ${accentColor}30`, paddingBottom: 4, marginBottom: 8 }}>Skills</h2>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4px 16px" }}>
                {skills.map((sk) => (
                  <div key={sk.id} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: "11px", fontWeight: 600, color: "#333", flex: 1 }}>{sk.name}</span>
                    <div style={{ flex: 1, height: 6, background: "#eee", borderRadius: 3 }}>
                      <div style={{ width: `${(sk.level / 5) * 100}%`, height: "100%", background: accentColor, borderRadius: 3 }} />
                    </div>
                  </div>
                ))}
              </div>
            </section>
          );
          if (sec.id === "projects" && projects.length > 0) return (
            <section key="projects">
              <h2 style={{ fontSize: "11px", fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.12em", color: accentColor, borderBottom: `2px solid ${accentColor}30`, paddingBottom: 4, marginBottom: 8 }}>Projects</h2>
              {projects.map((p) => (
                <div key={p.id} style={{ marginBottom: 8, paddingLeft: 12, borderLeft: `2px solid ${accentColor}20` }}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ fontWeight: 700, fontSize: "12px" }}>{p.name}</span>
                    {(p.startDate || p.endDate) && <span style={{ fontSize: "10px", color: "#888" }}>{fmtRange(p.startDate, p.endDate, false)}</span>}
                  </div>
                  {p.tech && <p style={{ fontSize: "10px", color: accentColor, fontWeight: 600 }}>{p.tech}</p>}
                  {p.description && <p style={{ fontSize: "10.5px", color: "#555", marginTop: 2 }}>{p.description}</p>}
                </div>
              ))}
            </section>
          );
          if (sec.id === "certifications" && certifications.length > 0) return (
            <section key="certifications">
              <h2 style={{ fontSize: "11px", fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.12em", color: accentColor, borderBottom: `2px solid ${accentColor}30`, paddingBottom: 4, marginBottom: 8 }}>Certifications</h2>
              {certifications.map((c) => (
                <div key={c.id} style={{ marginBottom: 3, paddingLeft: 12, borderLeft: `2px solid ${accentColor}20` }}>
                  <span style={{ fontSize: "11px", fontWeight: 600 }}>{c.name}</span>
                  {c.issuer && <span style={{ color: "#777" }}> · {c.issuer}</span>}
                  {c.date && <span style={{ color: "#999", fontSize: "10px" }}> · {formatDate(c.date)}</span>}
                </div>
              ))}
            </section>
          );
          if (sec.id === "languages" && languages.length > 0) return (
            <section key="languages">
              <h2 style={{ fontSize: "11px", fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.12em", color: accentColor, borderBottom: `2px solid ${accentColor}30`, paddingBottom: 4, marginBottom: 8 }}>Languages</h2>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {languages.map((l) => (
                  <div key={l.id} style={{ display: "flex", alignItems: "center", gap: 6, padding: "4px 12px", background: `${accentColor}08`, borderRadius: 6, border: `1px solid ${accentColor}20` }}>
                    <span style={{ fontWeight: 600, fontSize: "11px" }}>{l.name}</span>
                    <span style={{ color: accentColor, fontSize: "10px" }}>{l.level}</span>
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

// ── 3. Dark Theme ──────────────────────────────────────────────────────────────
export function DarkThemeTemplate({ cv, forExport }: Props) {
  const { personal, summary, experience, education, skills, projects, certifications, languages, sections, accentColor } = cv;
  const ordered = [...sections].filter((s) => s.enabled).sort((a, b) => a.order - b.order);

  return (
    <div id="cv-preview" style={{ width: forExport ? "794px" : "100%", minHeight: forExport ? "1123px" : undefined, fontSize: "11px", lineHeight: "1.5", fontFamily: "'Inter','Segoe UI',Arial,sans-serif", background: "#1a1a2e", color: "#e0e0e0" }}>
      <div style={{ background: `linear-gradient(135deg, ${accentColor} 0%, ${accentColor}aa 100%)`, padding: "28px 36px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          {personal.photoUrl && <img src={personal.photoUrl} alt="" style={{ width: 70, height: 70, borderRadius: 12, objectFit: "cover", border: "2px solid rgba(255,255,255,0.2)" }} />}
          <div>
            <h1 style={{ fontSize: "22px", fontWeight: 900, color: "#fff", letterSpacing: "-0.3px" }}>{personal.fullName || "Your Name"}</h1>
            {personal.title && <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.8)", fontWeight: 600, marginTop: 2 }}>{personal.title}</p>}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px 14px", marginTop: 8, fontSize: "10px", color: "rgba(255,255,255,0.7)" }}>
              {personal.email && <span>{personal.email}</span>}
              {personal.phone && <span>{personal.phone}</span>}
              {personal.location && <span>{personal.location}</span>}
              {personal.github && <span>{personal.github}</span>}
              {personal.linkedin && <span>{personal.linkedin}</span>}
            </div>
          </div>
        </div>
      </div>
      <div style={{ padding: "20px 36px", display: "flex", flexDirection: "column", gap: 14 }}>
        {ordered.map((sec) => {
          if (sec.id === "summary" && summary) return (
            <section key="summary">
              <h2 style={{ fontSize: "9px", fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.18em", color: accentColor, marginBottom: 6 }}>Summary</h2>
              <p style={{ fontSize: "11px", color: "#b0b0c0", lineHeight: "1.6" }}>{summary}</p>
            </section>
          );
          if (sec.id === "experience" && experience.length > 0) return (
            <section key="experience">
              <h2 style={{ fontSize: "9px", fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.18em", color: accentColor, marginBottom: 8 }}>Experience</h2>
              {experience.map((exp) => (
                <div key={exp.id} style={{ marginBottom: 10, padding: "10px 12px", background: "rgba(255,255,255,0.04)", borderRadius: 8, border: "1px solid rgba(255,255,255,0.06)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                    <span style={{ fontWeight: 700, fontSize: "12px", color: "#fff" }}>{exp.role}</span>
                    <span style={{ fontSize: "9.5px", color: "#888" }}>{fmtRange(exp.startDate, exp.endDate, exp.current)}</span>
                  </div>
                  <p style={{ fontSize: "10.5px", color: accentColor, fontWeight: 600 }}>{exp.company}</p>
                  {exp.bullets.filter(Boolean).length > 0 && (
                    <ul style={{ margin: "4px 0 0 16px", padding: 0 }}>
                      {exp.bullets.filter(Boolean).map((b, i) => <li key={i} style={{ fontSize: "10.5px", color: "#aaa", marginBottom: 1 }}>{b}</li>)}
                    </ul>
                  )}
                </div>
              ))}
            </section>
          );
          if (sec.id === "education" && education.length > 0) return (
            <section key="education">
              <h2 style={{ fontSize: "9px", fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.18em", color: accentColor, marginBottom: 6 }}>Education</h2>
              {education.map((edu) => (
                <div key={edu.id} style={{ marginBottom: 6, padding: "8px 12px", background: "rgba(255,255,255,0.04)", borderRadius: 8, border: "1px solid rgba(255,255,255,0.06)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ fontWeight: 700, fontSize: "12px", color: "#fff" }}>{edu.degree}{edu.field ? ` in ${edu.field}` : ""}</span>
                    <span style={{ fontSize: "9.5px", color: "#888" }}>{fmtRange(edu.startDate, edu.endDate, edu.current)}</span>
                  </div>
                  <p style={{ fontSize: "10.5px", color: "#aaa" }}>{edu.institution}{edu.gpa ? ` · GPA: ${edu.gpa}` : ""}</p>
                </div>
              ))}
            </section>
          );
          if (sec.id === "skills" && skills.length > 0) return (
            <section key="skills">
              <h2 style={{ fontSize: "9px", fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.18em", color: accentColor, marginBottom: 6 }}>Skills</h2>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                {skills.map((sk) => (
                  <div key={sk.id} style={{ padding: "4px 12px", background: `rgba(255,255,255,0.04)`, borderRadius: 6, border: `1px solid ${accentColor}30`, fontSize: "10.5px", color: "#ccc" }}>
                    {sk.name}<span style={{ color: accentColor, fontSize: "9px", marginLeft: 4 }}>{LEVEL_LABELS[sk.level]}</span>
                  </div>
                ))}
              </div>
            </section>
          );
          if (sec.id === "projects" && projects.length > 0) return (
            <section key="projects">
              <h2 style={{ fontSize: "9px", fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.18em", color: accentColor, marginBottom: 6 }}>Projects</h2>
              {projects.map((p) => (
                <div key={p.id} style={{ marginBottom: 8, padding: "8px 12px", background: "rgba(255,255,255,0.04)", borderRadius: 8 }}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ fontWeight: 700, fontSize: "12px", color: "#fff" }}>{p.name}</span>
                    {(p.startDate || p.endDate) && <span style={{ fontSize: "9.5px", color: "#888" }}>{fmtRange(p.startDate, p.endDate, false)}</span>}
                  </div>
                  {p.tech && <p style={{ fontSize: "10px", color: accentColor }}>{p.tech}</p>}
                  {p.description && <p style={{ fontSize: "10.5px", color: "#aaa", marginTop: 2 }}>{p.description}</p>}
                </div>
              ))}
            </section>
          );
          if (sec.id === "certifications" && certifications.length > 0) return (
            <section key="certifications">
              <h2 style={{ fontSize: "9px", fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.18em", color: accentColor, marginBottom: 6 }}>Certifications</h2>
              {certifications.map((c) => (
                <div key={c.id} style={{ fontSize: "11px", color: "#ccc", marginBottom: 3 }}><span style={{ fontWeight: 600, color: "#fff" }}>{c.name}</span>{c.issuer ? <span style={{ color: "#888" }}> · {c.issuer}</span> : null}{c.date ? <span style={{ color: "#666" }}> · {formatDate(c.date)}</span> : null}</div>
              ))}
            </section>
          );
          if (sec.id === "languages" && languages.length > 0) return (
            <section key="languages">
              <h2 style={{ fontSize: "9px", fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.18em", color: accentColor, marginBottom: 6 }}>Languages</h2>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {languages.map((l) => <span key={l.id} style={{ fontSize: "10.5px", padding: "3px 10px", borderRadius: 6, border: `1px solid ${accentColor}30`, color: "#ccc" }}>{l.name} · {l.level}</span>)}
              </div>
            </section>
          );
          return null;
        })}
      </div>
    </div>
  );
}

// ── 4. Creative Gradient ───────────────────────────────────────────────────────
export function CreativeGradientTemplate({ cv, forExport }: Props) {
  const { personal, summary, experience, education, skills, projects, certifications, languages, sections, accentColor } = cv;
  const ordered = [...sections].filter((s) => s.enabled).sort((a, b) => a.order - b.order);

  return (
    <div id="cv-preview" style={{ width: forExport ? "794px" : "100%", minHeight: forExport ? "1123px" : undefined, fontSize: "11px", lineHeight: "1.5", fontFamily: "'Inter','Segoe UI',Arial,sans-serif" }} className="bg-white text-gray-900">
      <div style={{ display: "flex", minHeight: forExport ? "1123px" : "100%" }}>
        {/* Colored sidebar */}
        <div style={{ width: 180, background: `linear-gradient(180deg, ${accentColor} 0%, ${accentColor}cc 60%, ${accentColor}88 100%)`, padding: "24px 16px", color: "#fff", flexShrink: 0 }}>
          {personal.photoUrl && <img src={personal.photoUrl} alt="" style={{ width: 100, height: 100, borderRadius: 16, objectFit: "cover", margin: "0 auto 16px", display: "block", border: "3px solid rgba(255,255,255,0.3)" }} />}
          <h1 style={{ fontSize: "18px", fontWeight: 900, letterSpacing: "-0.3px", textAlign: "center" }}>{personal.fullName || "Your Name"}</h1>
          {personal.title && <p style={{ fontSize: "11px", opacity: 0.85, textAlign: "center", marginTop: 4, fontWeight: 600 }}>{personal.title}</p>}
          <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 8, fontSize: "10px", opacity: 0.9 }}>
            {personal.email && <p>✉ {personal.email}</p>}
            {personal.phone && <p>📞 {personal.phone}</p>}
            {personal.location && <p>📍 {personal.location}</p>}
            {personal.website && <p>🌐 {personal.website}</p>}
            {personal.linkedin && <p>🔗 {personal.linkedin}</p>}
            {personal.github && <p>💻 {personal.github}</p>}
          </div>
          {languages.length > 0 && (
            <div style={{ marginTop: 20 }}>
              <p style={{ fontSize: "9px", fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.15em", opacity: 0.7, marginBottom: 8 }}>Languages</p>
              {languages.map((l) => <p key={l.id} style={{ fontSize: "10.5px", fontWeight: 600, marginBottom: 4 }}>{l.name} <span style={{ fontWeight: 400, opacity: 0.7 }}>{l.level}</span></p>)}
            </div>
          )}
        </div>
        {/* Main content */}
        <div style={{ flex: 1, padding: "24px 28px", display: "flex", flexDirection: "column", gap: 14 }}>
          {ordered.map((sec) => {
            if (sec.id === "summary" && summary) return (
              <section key="summary">
                <h2 style={{ fontSize: "9px", fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.18em", color: accentColor, marginBottom: 6 }}>About</h2>
                <p style={{ fontSize: "11px", color: "#555", lineHeight: "1.6" }}>{summary}</p>
              </section>
            );
            if (sec.id === "experience" && experience.length > 0) return (
              <section key="experience">
                <h2 style={{ fontSize: "9px", fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.18em", color: accentColor, marginBottom: 8 }}>Experience</h2>
                {experience.map((exp) => (
                  <div key={exp.id} style={{ marginBottom: 10, padding: "10px 14px", background: `${accentColor}04`, borderRadius: 10, border: `1px solid ${accentColor}10` }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                      <span style={{ fontWeight: 700, fontSize: "12px", color: "#222" }}>{exp.role}</span>
                      <span style={{ fontSize: "9.5px", color: "#999" }}>{fmtRange(exp.startDate, exp.endDate, exp.current)}</span>
                    </div>
                    <p style={{ fontSize: "10.5px", color: accentColor, fontWeight: 600 }}>{exp.company}</p>
                    {exp.bullets.filter(Boolean).length > 0 && (
                      <ul style={{ margin: "4px 0 0 16px", padding: 0 }}>
                        {exp.bullets.filter(Boolean).map((b, i) => <li key={i} style={{ fontSize: "10.5px", color: "#666", marginBottom: 1 }}>{b}</li>)}
                      </ul>
                    )}
                  </div>
                ))}
              </section>
            );
            if (sec.id === "education" && education.length > 0) return (
              <section key="education">
                <h2 style={{ fontSize: "9px", fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.18em", color: accentColor, marginBottom: 6 }}>Education</h2>
                {education.map((edu) => (
                  <div key={edu.id} style={{ marginBottom: 6, padding: "8px 14px", background: `${accentColor}04`, borderRadius: 10 }}>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span style={{ fontWeight: 700, fontSize: "12px", color: "#222" }}>{edu.degree}{edu.field ? ` in ${edu.field}` : ""}</span>
                      <span style={{ fontSize: "9.5px", color: "#999" }}>{fmtRange(edu.startDate, edu.endDate, edu.current)}</span>
                    </div>
                    <p style={{ fontSize: "10.5px", color: "#666" }}>{edu.institution}{edu.gpa ? ` | GPA: ${edu.gpa}` : ""}</p>
                  </div>
                ))}
              </section>
            );
            if (sec.id === "skills" && skills.length > 0) return (
              <section key="skills">
                <h2 style={{ fontSize: "9px", fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.18em", color: accentColor, marginBottom: 6 }}>Skills</h2>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {skills.map((sk) => (
                    <div key={sk.id} style={{ padding: "4px 12px", background: `${accentColor}08`, borderRadius: 6, border: `1px solid ${accentColor}20`, fontSize: "10.5px", color: "#444" }}>
                      {sk.name} <span style={{ color: accentColor, fontSize: "9px" }}>{LEVEL_LABELS[sk.level]}</span>
                    </div>
                  ))}
                </div>
              </section>
            );
            if (sec.id === "projects" && projects.length > 0) return (
              <section key="projects">
                <h2 style={{ fontSize: "9px", fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.18em", color: accentColor, marginBottom: 6 }}>Projects</h2>
                {projects.map((p) => (
                  <div key={p.id} style={{ marginBottom: 8, padding: "8px 14px", background: `${accentColor}04`, borderRadius: 10 }}>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span style={{ fontWeight: 700, fontSize: "12px", color: "#222" }}>{p.name}</span>
                      {(p.startDate || p.endDate) && <span style={{ fontSize: "9.5px", color: "#999" }}>{fmtRange(p.startDate, p.endDate, false)}</span>}
                    </div>
                    {p.tech && <p style={{ fontSize: "10px", color: accentColor }}>{p.tech}</p>}
                    {p.description && <p style={{ fontSize: "10.5px", color: "#666", marginTop: 2 }}>{p.description}</p>}
                  </div>
                ))}
              </section>
            );
            if (sec.id === "certifications" && certifications.length > 0) return (
              <section key="certifications">
                <h2 style={{ fontSize: "9px", fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.18em", color: accentColor, marginBottom: 6 }}>Certifications</h2>
                {certifications.map((c) => (
                  <div key={c.id} style={{ fontSize: "11px", color: "#555", marginBottom: 3, padding: "4px 10px", background: `${accentColor}04`, borderRadius: 6 }}>
                    <span style={{ fontWeight: 600 }}>{c.name}</span>{c.issuer ? <span style={{ color: "#888" }}> · {c.issuer}</span> : null}{c.date ? <span style={{ color: "#aaa" }}> · {formatDate(c.date)}</span> : null}
                  </div>
                ))}
              </section>
            );
            if (sec.id === "languages" && languages.length > 0) return null; // shown in sidebar
            return null;
          })}
        </div>
      </div>
    </div>
  );
}

// ── 5. Minimal Elegant ─────────────────────────────────────────────────────────
export function MinimalElegantTemplate({ cv, forExport }: Props) {
  const { personal, summary, experience, education, skills, projects, certifications, languages, sections, accentColor } = cv;
  const ordered = [...sections].filter((s) => s.enabled).sort((a, b) => a.order - b.order);

  return (
    <div id="cv-preview" style={{ width: forExport ? "794px" : "100%", minHeight: forExport ? "1123px" : undefined, fontSize: "11px", lineHeight: "1.7", fontFamily: "'Georgia','Times New Roman',serif", padding: "48px 56px" }} className="bg-white text-gray-900">
      <div style={{ textAlign: "center", marginBottom: 28 }}>
        <h1 style={{ fontSize: "26px", fontWeight: 400, letterSpacing: "2px", textTransform: "uppercase", color: "#111" }}>{personal.fullName || "Your Name"}</h1>
        {personal.title && <p style={{ fontSize: "13px", color: accentColor, fontStyle: "italic", marginTop: 6, letterSpacing: "0.5px" }}>{personal.title}</p>}
        <div style={{ width: 40, height: 1, background: accentColor, margin: "12px auto" }} />
        <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", gap: "4px 16px", fontSize: "10px", color: "#888" }}>
          {personal.email && <span>{personal.email}</span>}
          {personal.phone && <span>{personal.phone}</span>}
          {personal.location && <span>{personal.location}</span>}
          {personal.linkedin && <span>{personal.linkedin}</span>}
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        {ordered.map((sec) => {
          if (sec.id === "summary" && summary) return (
            <section key="summary">
              <p style={{ fontSize: "11.5px", color: "#555", lineHeight: "1.8", fontStyle: "italic" }}>{summary}</p>
            </section>
          );
          if (sec.id === "experience" && experience.length > 0) return (
            <section key="experience">
              <h2 style={{ fontSize: "9px", fontWeight: 400, textTransform: "uppercase", letterSpacing: "3px", color: accentColor, marginBottom: 10 }}>Experience</h2>
              {experience.map((exp) => (
                <div key={exp.id} style={{ marginBottom: 12 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                    <span style={{ fontWeight: 700, fontSize: "12px", color: "#222" }}>{exp.role}</span>
                    <span style={{ fontSize: "10px", color: "#aaa", fontStyle: "italic" }}>{fmtRange(exp.startDate, exp.endDate, exp.current)}</span>
                  </div>
                  <p style={{ fontSize: "11px", color: accentColor, fontWeight: 600 }}>{exp.company}</p>
                  {exp.bullets.filter(Boolean).length > 0 && (
                    <ul style={{ margin: "4px 0 0 16px", padding: 0 }}>
                      {exp.bullets.filter(Boolean).map((b, i) => <li key={i} style={{ fontSize: "11px", color: "#666", marginBottom: 1, lineHeight: "1.6" }}>{b}</li>)}
                    </ul>
                  )}
                </div>
              ))}
            </section>
          );
          if (sec.id === "education" && education.length > 0) return (
            <section key="education">
              <h2 style={{ fontSize: "9px", fontWeight: 400, textTransform: "uppercase", letterSpacing: "3px", color: accentColor, marginBottom: 10 }}>Education</h2>
              {education.map((edu) => (
                <div key={edu.id} style={{ marginBottom: 8 }}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ fontWeight: 700, fontSize: "12px", color: "#222" }}>{edu.degree}{edu.field ? ` in ${edu.field}` : ""}</span>
                    <span style={{ fontSize: "10px", color: "#aaa", fontStyle: "italic" }}>{fmtRange(edu.startDate, edu.endDate, edu.current)}</span>
                  </div>
                  <p style={{ fontSize: "11px", color: "#666" }}>{edu.institution}{edu.gpa ? ` — GPA: ${edu.gpa}` : ""}</p>
                </div>
              ))}
            </section>
          );
          if (sec.id === "skills" && skills.length > 0) return (
            <section key="skills">
              <h2 style={{ fontSize: "9px", fontWeight: 400, textTransform: "uppercase", letterSpacing: "3px", color: accentColor, marginBottom: 10 }}>Skills</h2>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "4px 20px" }}>
                {skills.map((sk) => <span key={sk.id} style={{ fontSize: "11px", color: "#555" }}>{sk.name} <span style={{ color: "#aaa" }}>({LEVEL_LABELS[sk.level]})</span></span>)}
              </div>
            </section>
          );
          if (sec.id === "projects" && projects.length > 0) return (
            <section key="projects">
              <h2 style={{ fontSize: "9px", fontWeight: 400, textTransform: "uppercase", letterSpacing: "3px", color: accentColor, marginBottom: 10 }}>Projects</h2>
              {projects.map((p) => (
                <div key={p.id} style={{ marginBottom: 8 }}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ fontWeight: 700, fontSize: "12px", color: "#222" }}>{p.name}</span>
                    {(p.startDate || p.endDate) && <span style={{ fontSize: "10px", color: "#aaa", fontStyle: "italic" }}>{fmtRange(p.startDate, p.endDate, false)}</span>}
                  </div>
                  {p.tech && <p style={{ fontSize: "10px", color: accentColor }}>{p.tech}</p>}
                  {p.description && <p style={{ fontSize: "11px", color: "#666", marginTop: 2 }}>{p.description}</p>}
                </div>
              ))}
            </section>
          );
          if (sec.id === "certifications" && certifications.length > 0) return (
            <section key="certifications">
              <h2 style={{ fontSize: "9px", fontWeight: 400, textTransform: "uppercase", letterSpacing: "3px", color: accentColor, marginBottom: 8 }}>Certifications</h2>
              {certifications.map((c) => (
                <p key={c.id} style={{ fontSize: "11px", color: "#555", marginBottom: 2 }}><span style={{ fontWeight: 600 }}>{c.name}</span>{c.issuer ? <span style={{ color: "#888" }}> — {c.issuer}</span> : null}</p>
              ))}
            </section>
          );
          if (sec.id === "languages" && languages.length > 0) return (
            <section key="languages">
              <h2 style={{ fontSize: "9px", fontWeight: 400, textTransform: "uppercase", letterSpacing: "3px", color: accentColor, marginBottom: 8 }}>Languages</h2>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "4px 16px" }}>
                {languages.map((l) => <span key={l.id} style={{ fontSize: "11px", color: "#555" }}>{l.name} <span style={{ color: "#aaa" }}>({l.level})</span></span>)}
              </div>
            </section>
          );
          return null;
        })}
      </div>
    </div>
  );
}

// ── 6. Corporate Executive ─────────────────────────────────────────────────────
export function CorporateTemplate({ cv, forExport }: Props) {
  const { personal, summary, experience, education, skills, projects, certifications, languages, sections, accentColor } = cv;
  const ordered = [...sections].filter((s) => s.enabled).sort((a, b) => a.order - b.order);

  return (
    <div id="cv-preview" style={{ width: forExport ? "794px" : "100%", minHeight: forExport ? "1123px" : undefined, fontSize: "11px", lineHeight: "1.5", fontFamily: "'Times New Roman','Georgia',serif" }} className="bg-white text-gray-900">
      <div style={{ background: "#111", padding: "32px 40px 24px", color: "#fff" }}>
        <h1 style={{ fontSize: "26px", fontWeight: 900, letterSpacing: "1px", textTransform: "uppercase" }}>{personal.fullName || "Your Name"}</h1>
        {personal.title && <p style={{ fontSize: "13px", color: accentColor, fontWeight: 600, marginTop: 4, letterSpacing: "0.5px" }}>{personal.title}</p>}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px 20px", marginTop: 12, fontSize: "10.5px", color: "#aaa", borderTop: `1px solid ${accentColor}40`, paddingTop: 12 }}>
          {personal.email && <span>{personal.email}</span>}
          {personal.phone && <span>{personal.phone}</span>}
          {personal.location && <span>{personal.location}</span>}
          {personal.linkedin && <span>{personal.linkedin}</span>}
        </div>
      </div>
      <div style={{ padding: "24px 40px", display: "flex", flexDirection: "column", gap: 16 }}>
        {ordered.map((sec) => {
          if (sec.id === "summary" && summary) return (
            <section key="summary">
              <h2 style={{ fontSize: "10px", fontWeight: 900, textTransform: "uppercase", letterSpacing: "2px", color: accentColor, marginBottom: 8 }}>Executive Summary</h2>
              <p style={{ fontSize: "11.5px", color: "#444", lineHeight: "1.7" }}>{summary}</p>
            </section>
          );
          if (sec.id === "experience" && experience.length > 0) return (
            <section key="experience">
              <h2 style={{ fontSize: "10px", fontWeight: 900, textTransform: "uppercase", letterSpacing: "2px", color: accentColor, marginBottom: 8, borderBottom: `1px solid ${accentColor}20`, paddingBottom: 4 }}>Professional Experience</h2>
              {experience.map((exp) => (
                <div key={exp.id} style={{ marginBottom: 10 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                    <div><span style={{ fontWeight: 700, fontSize: "12.5px", color: "#111" }}>{exp.role}</span><span style={{ color: "#888", fontSize: "11px", marginLeft: 8 }}>{exp.company}</span></div>
                    <span style={{ fontSize: "10px", color: "#aaa" }}>{fmtRange(exp.startDate, exp.endDate, exp.current)}</span>
                  </div>
                  {exp.bullets.filter(Boolean).length > 0 && (
                    <ul style={{ margin: "4px 0 0 16px", padding: 0 }}>
                      {exp.bullets.filter(Boolean).map((b, i) => <li key={i} style={{ fontSize: "11px", color: "#555", marginBottom: 1 }}>{b}</li>)}
                    </ul>
                  )}
                </div>
              ))}
            </section>
          );
          if (sec.id === "education" && education.length > 0) return (
            <section key="education">
              <h2 style={{ fontSize: "10px", fontWeight: 900, textTransform: "uppercase", letterSpacing: "2px", color: accentColor, marginBottom: 8, borderBottom: `1px solid ${accentColor}20`, paddingBottom: 4 }}>Education</h2>
              {education.map((edu) => (
                <div key={edu.id} style={{ marginBottom: 6, display: "flex", justifyContent: "space-between" }}>
                  <div><span style={{ fontWeight: 700, fontSize: "12px" }}>{edu.degree}{edu.field ? ` in ${edu.field}` : ""}</span><p style={{ fontSize: "11px", color: "#666" }}>{edu.institution}{edu.gpa ? ` | GPA: ${edu.gpa}` : ""}</p></div>
                  <span style={{ fontSize: "10px", color: "#aaa", whiteSpace: "nowrap" }}>{fmtRange(edu.startDate, edu.endDate, edu.current)}</span>
                </div>
              ))}
            </section>
          );
          if (sec.id === "skills" && skills.length > 0) return (
            <section key="skills">
              <h2 style={{ fontSize: "10px", fontWeight: 900, textTransform: "uppercase", letterSpacing: "2px", color: accentColor, marginBottom: 8, borderBottom: `1px solid ${accentColor}20`, paddingBottom: 4 }}>Core Competencies</h2>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                {skills.map((sk) => <span key={sk.id} style={{ padding: "3px 12px", background: "#f5f5f5", borderRadius: 3, fontSize: "10.5px", color: "#444", fontWeight: 600 }}>{sk.name}</span>)}
              </div>
            </section>
          );
          if (sec.id === "projects" && projects.length > 0) return (
            <section key="projects">
              <h2 style={{ fontSize: "10px", fontWeight: 900, textTransform: "uppercase", letterSpacing: "2px", color: accentColor, marginBottom: 8, borderBottom: `1px solid ${accentColor}20`, paddingBottom: 4 }}>Key Projects</h2>
              {projects.map((p) => (
                <div key={p.id} style={{ marginBottom: 6 }}>
                  <p style={{ fontWeight: 700, fontSize: "12px", color: "#111" }}>{p.name}{p.tech ? <span style={{ fontWeight: 400, color: "#888", fontSize: "10px", marginLeft: 6 }}>{p.tech}</span> : null}</p>
                  {p.description && <p style={{ fontSize: "11px", color: "#555", marginTop: 1 }}>{p.description}</p>}
                </div>
              ))}
            </section>
          );
          if (sec.id === "certifications" && certifications.length > 0) return (
            <section key="certifications">
              <h2 style={{ fontSize: "10px", fontWeight: 900, textTransform: "uppercase", letterSpacing: "2px", color: accentColor, marginBottom: 6, borderBottom: `1px solid ${accentColor}20`, paddingBottom: 4 }}>Certifications</h2>
              {certifications.map((c) => <p key={c.id} style={{ fontSize: "11px", marginBottom: 2 }}><span style={{ fontWeight: 600 }}>{c.name}</span>{c.issuer ? <span style={{ color: "#888" }}> — {c.issuer}</span> : null}</p>)}
            </section>
          );
          if (sec.id === "languages" && languages.length > 0) return (
            <section key="languages">
              <h2 style={{ fontSize: "10px", fontWeight: 900, textTransform: "uppercase", letterSpacing: "2px", color: accentColor, marginBottom: 6, borderBottom: `1px solid ${accentColor}20`, paddingBottom: 4 }}>Languages</h2>
              <p style={{ fontSize: "11px", color: "#555" }}>{languages.map((l) => `${l.name} (${l.level})`).join(" | ")}</p>
            </section>
          );
          return null;
        })}
      </div>
    </div>
  );
}

// ── 7. Academic Student ────────────────────────────────────────────────────────
export function AcademicTemplate({ cv, forExport }: Props) {
  const { personal, summary, experience, education, skills, projects, certifications, languages, sections, accentColor } = cv;
  const ordered = [...sections].filter((s) => s.enabled).sort((a, b) => a.order - b.order);

  return (
    <div id="cv-preview" style={{ width: forExport ? "794px" : "100%", minHeight: forExport ? "1123px" : undefined, fontSize: "11px", lineHeight: "1.5", fontFamily: "'Arial','Helvetica',sans-serif" }} className="bg-white text-gray-900">
      <div style={{ padding: "28px 36px", borderBottom: `4px solid ${accentColor}`, marginBottom: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          {personal.photoUrl && <img src={personal.photoUrl} alt="" style={{ width: 75, height: 75, borderRadius: "50%", objectFit: "cover", border: `3px solid ${accentColor}30` }} />}
          <div>
            <h1 style={{ fontSize: "22px", fontWeight: 900, color: "#111" }}>{personal.fullName || "Your Name"}</h1>
            {personal.title && <p style={{ fontSize: "13px", color: accentColor, fontWeight: 600 }}>{personal.title}</p>}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px 16px", marginTop: 6, fontSize: "10px", color: "#777" }}>
              {personal.email && <span>{personal.email}</span>}
              {personal.phone && <span>{personal.phone}</span>}
              {personal.location && <span>{personal.location}</span>}
              {personal.github && <span>{personal.github}</span>}
            </div>
          </div>
        </div>
      </div>
      <div style={{ padding: "20px 36px", display: "flex", flexDirection: "column", gap: 14 }}>
        {ordered.map((sec) => {
          if (sec.id === "summary" && summary) return (
            <section key="summary">
              <h2 style={{ fontSize: "9px", fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.15em", color: accentColor, marginBottom: 4 }}>Objective</h2>
              <p style={{ fontSize: "11px", color: "#555", lineHeight: "1.6" }}>{summary}</p>
            </section>
          );
          if (sec.id === "education" && education.length > 0) return (
            <section key="education">
              <h2 style={{ fontSize: "9px", fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.15em", color: accentColor, marginBottom: 6, background: `${accentColor}08`, padding: "4px 8px", borderRadius: 4 }}>Education</h2>
              {education.map((edu) => (
                <div key={edu.id} style={{ marginBottom: 8, padding: "8px 12px", background: "#fafafa", borderRadius: 8, border: "1px solid #eee" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                    <span style={{ fontWeight: 700, fontSize: "12px", color: "#222" }}>{edu.degree}{edu.field ? ` in ${edu.field}` : ""}</span>
                    <span style={{ fontSize: "10px", color: "#999" }}>{fmtRange(edu.startDate, edu.endDate, edu.current)}</span>
                  </div>
                  <p style={{ fontSize: "11px", color: accentColor, fontWeight: 600 }}>{edu.institution}</p>
                  {edu.gpa && <p style={{ fontSize: "10.5px", color: "#777" }}>GPA: {edu.gpa}</p>}
                </div>
              ))}
            </section>
          );
          if (sec.id === "experience" && experience.length > 0) return (
            <section key="experience">
              <h2 style={{ fontSize: "9px", fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.15em", color: accentColor, marginBottom: 6, background: `${accentColor}08`, padding: "4px 8px", borderRadius: 4 }}>Experience</h2>
              {experience.map((exp) => (
                <div key={exp.id} style={{ marginBottom: 8 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                    <span style={{ fontWeight: 700, fontSize: "12px", color: "#222" }}>{exp.role}</span>
                    <span style={{ fontSize: "10px", color: "#999" }}>{fmtRange(exp.startDate, exp.endDate, exp.current)}</span>
                  </div>
                  <p style={{ fontSize: "11px", color: accentColor }}>{exp.company}</p>
                  {exp.bullets.filter(Boolean).length > 0 && (
                    <ul style={{ margin: "2px 0 0 16px", padding: 0 }}>
                      {exp.bullets.filter(Boolean).map((b, i) => <li key={i} style={{ fontSize: "10.5px", color: "#666" }}>{b}</li>)}
                    </ul>
                  )}
                </div>
              ))}
            </section>
          );
          if (sec.id === "projects" && projects.length > 0) return (
            <section key="projects">
              <h2 style={{ fontSize: "9px", fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.15em", color: accentColor, marginBottom: 6, background: `${accentColor}08`, padding: "4px 8px", borderRadius: 4 }}>Projects</h2>
              {projects.map((p) => (
                <div key={p.id} style={{ marginBottom: 8, padding: "8px 12px", background: "#fafafa", borderRadius: 8, border: "1px solid #eee" }}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ fontWeight: 700, fontSize: "12px", color: "#222" }}>{p.name}</span>
                    {(p.startDate || p.endDate) && <span style={{ fontSize: "10px", color: "#999" }}>{fmtRange(p.startDate, p.endDate, false)}</span>}
                  </div>
                  {p.tech && <p style={{ fontSize: "10px", color: accentColor, fontWeight: 600 }}>{p.tech}</p>}
                  {p.description && <p style={{ fontSize: "10.5px", color: "#666", marginTop: 2 }}>{p.description}</p>}
                </div>
              ))}
            </section>
          );
          if (sec.id === "skills" && skills.length > 0) return (
            <section key="skills">
              <h2 style={{ fontSize: "9px", fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.15em", color: accentColor, marginBottom: 6, background: `${accentColor}08`, padding: "4px 8px", borderRadius: 4 }}>Skills</h2>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "4px 12px" }}>
                {skills.map((sk) => (
                  <span key={sk.id} style={{ fontSize: "10.5px", color: "#555" }}>
                    {sk.name} <span style={{ display: "inline-flex", gap: 2 }}>{Array.from({ length: 5 }, (_, i) => (
                      <span key={i} style={{ color: i < sk.level ? accentColor : "#ddd", fontSize: "10px" }}>●</span>
                    ))}</span>
                  </span>
                ))}
              </div>
            </section>
          );
          if (sec.id === "certifications" && certifications.length > 0) return (
            <section key="certifications">
              <h2 style={{ fontSize: "9px", fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.15em", color: accentColor, marginBottom: 6, background: `${accentColor}08`, padding: "4px 8px", borderRadius: 4 }}>Certifications</h2>
              {certifications.map((c) => <p key={c.id} style={{ fontSize: "11px", marginBottom: 2 }}><span style={{ fontWeight: 600 }}>{c.name}</span>{c.issuer ? <span style={{ color: "#888" }}> · {c.issuer}</span> : null}</p>)}
            </section>
          );
          if (sec.id === "languages" && languages.length > 0) return (
            <section key="languages">
              <h2 style={{ fontSize: "9px", fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.15em", color: accentColor, marginBottom: 4, background: `${accentColor}08`, padding: "4px 8px", borderRadius: 4 }}>Languages</h2>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {languages.map((l) => <span key={l.id} style={{ fontSize: "10.5px", padding: "2px 10px", background: "#f5f5f5", borderRadius: 4 }}>{l.name} · {l.level}</span>)}
              </div>
            </section>
          );
          return null;
        })}
      </div>
    </div>
  );
}

// ── 8. Startup Portfolio ───────────────────────────────────────────────────────
export function StartupTemplate({ cv, forExport }: Props) {
  const { personal, summary, experience, education, skills, projects, certifications, languages, sections, accentColor } = cv;
  const ordered = [...sections].filter((s) => s.enabled).sort((a, b) => a.order - b.order);

  return (
    <div id="cv-preview" style={{ width: forExport ? "794px" : "100%", minHeight: forExport ? "1123px" : undefined, fontSize: "11px", lineHeight: "1.5", fontFamily: "'Inter','Segoe UI',Arial,sans-serif" }} className="bg-white text-gray-900">
      <div style={{ background: `linear-gradient(135deg, ${accentColor} 0%, #111 100%)`, padding: "32px 36px 24px", color: "#fff" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <h1 style={{ fontSize: "28px", fontWeight: 900, letterSpacing: "-1px" }}>{personal.fullName || "Your Name"}</h1>
            {personal.title && <p style={{ fontSize: "14px", fontWeight: 500, opacity: 0.85, marginTop: 2 }}>{personal.title}</p>}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px 16px", marginTop: 10, fontSize: "10.5px", opacity: 0.8 }}>
              {personal.email && <span>✉ {personal.email}</span>}
              {personal.phone && <span>📞 {personal.phone}</span>}
              {personal.location && <span>📍 {personal.location}</span>}
              {personal.github && <span>🐙 {personal.github}</span>}
              {personal.linkedin && <span>🔗 {personal.linkedin}</span>}
            </div>
          </div>
          {personal.photoUrl && <img src={personal.photoUrl} alt="" style={{ width: 80, height: 80, borderRadius: 20, objectFit: "cover", border: "3px solid rgba(255,255,255,0.2)" }} />}
        </div>
      </div>
      <div style={{ padding: "20px 36px", display: "flex", flexDirection: "column", gap: 16 }}>
        {ordered.map((sec) => {
          if (sec.id === "summary" && summary) return (
            <section key="summary">
              <h2 style={{ fontSize: "10px", fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.12em", color: accentColor, marginBottom: 6 }}>About</h2>
              <p style={{ fontSize: "11.5px", color: "#555", lineHeight: "1.7" }}>{summary}</p>
            </section>
          );
          if (sec.id === "experience" && experience.length > 0) return (
            <section key="experience">
              <h2 style={{ fontSize: "10px", fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.12em", color: accentColor, marginBottom: 8 }}>Experience</h2>
              {experience.map((exp) => (
                <div key={exp.id} style={{ marginBottom: 10, paddingLeft: 16, borderLeft: `3px solid ${accentColor}` }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                    <span style={{ fontWeight: 700, fontSize: "12.5px", color: "#222" }}>{exp.role}</span>
                    <span style={{ fontSize: "10px", color: "#aaa" }}>{fmtRange(exp.startDate, exp.endDate, exp.current)}</span>
                  </div>
                  <p style={{ fontSize: "11px", color: accentColor, fontWeight: 600 }}>{exp.company}</p>
                  {exp.bullets.filter(Boolean).length > 0 && (
                    <ul style={{ margin: "4px 0 0 16px", padding: 0 }}>
                      {exp.bullets.filter(Boolean).map((b, i) => <li key={i} style={{ fontSize: "11px", color: "#666", marginBottom: 1 }}>{b}</li>)}
                    </ul>
                  )}
                </div>
              ))}
            </section>
          );
          if (sec.id === "education" && education.length > 0) return (
            <section key="education">
              <h2 style={{ fontSize: "10px", fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.12em", color: accentColor, marginBottom: 6 }}>Education</h2>
              {education.map((edu) => (
                <div key={edu.id} style={{ marginBottom: 6, paddingLeft: 16, borderLeft: `3px solid ${accentColor}` }}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ fontWeight: 700, fontSize: "12px", color: "#222" }}>{edu.degree}{edu.field ? ` in ${edu.field}` : ""}</span>
                    <span style={{ fontSize: "10px", color: "#aaa" }}>{fmtRange(edu.startDate, edu.endDate, edu.current)}</span>
                  </div>
                  <p style={{ fontSize: "11px", color: "#666" }}>{edu.institution}{edu.gpa ? ` · GPA: ${edu.gpa}` : ""}</p>
                </div>
              ))}
            </section>
          );
          if (sec.id === "skills" && skills.length > 0) return (
            <section key="skills">
              <h2 style={{ fontSize: "10px", fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.12em", color: accentColor, marginBottom: 6 }}>Skills</h2>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4px 20px" }}>
                {skills.map((sk) => (
                  <div key={sk.id}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "10.5px", marginBottom: 2 }}>
                      <span style={{ fontWeight: 600, color: "#333" }}>{sk.name}</span>
                      <span style={{ color: "#aaa" }}>{LEVEL_LABELS[sk.level]}</span>
                    </div>
                    <div style={{ height: 4, background: "#eee", borderRadius: 2 }}>
                      <div style={{ width: `${(sk.level / 5) * 100}%`, height: "100%", background: accentColor, borderRadius: 2 }} />
                    </div>
                  </div>
                ))}
              </div>
            </section>
          );
          if (sec.id === "projects" && projects.length > 0) return (
            <section key="projects">
              <h2 style={{ fontSize: "10px", fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.12em", color: accentColor, marginBottom: 8 }}>Projects</h2>
              {projects.map((p) => (
                <div key={p.id} style={{ marginBottom: 8, paddingLeft: 16, borderLeft: `3px solid ${accentColor}` }}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ fontWeight: 700, fontSize: "12px", color: "#222" }}>{p.name}</span>
                    {(p.startDate || p.endDate) && <span style={{ fontSize: "10px", color: "#aaa" }}>{fmtRange(p.startDate, p.endDate, false)}</span>}
                  </div>
                  {p.tech && <span style={{ fontSize: "9.5px", color: accentColor, fontWeight: 600 }}>{p.tech}</span>}
                  {p.description && <p style={{ fontSize: "10.5px", color: "#666", marginTop: 2 }}>{p.description}</p>}
                </div>
              ))}
            </section>
          );
          if (sec.id === "certifications" && certifications.length > 0) return (
            <section key="certifications">
              <h2 style={{ fontSize: "10px", fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.12em", color: accentColor, marginBottom: 6 }}>Certifications</h2>
              {certifications.map((c) => <p key={c.id} style={{ fontSize: "11px", marginBottom: 2, paddingLeft: 16 }}><span style={{ fontWeight: 600 }}>{c.name}</span>{c.issuer ? <span style={{ color: "#888" }}> — {c.issuer}</span> : null}</p>)}
            </section>
          );
          if (sec.id === "languages" && languages.length > 0) return (
            <section key="languages">
              <h2 style={{ fontSize: "10px", fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.12em", color: accentColor, marginBottom: 4 }}>Languages</h2>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6, paddingLeft: 16 }}>
                {languages.map((l) => <span key={l.id} style={{ fontSize: "10.5px", padding: "2px 10px", background: `${accentColor}08`, borderRadius: 4, border: `1px solid ${accentColor}20`, color: "#555" }}>{l.name} · {l.level}</span>)}
              </div>
            </section>
          );
          return null;
        })}
      </div>
    </div>
  );
}

// ── 9. Two Column Professional ─────────────────────────────────────────────────
export function TwoColumnTemplate({ cv, forExport }: Props) {
  const { personal, summary, experience, education, skills, projects, certifications, languages, sections, accentColor } = cv;
  const ordered = [...sections].filter((s) => s.enabled).sort((a, b) => a.order - b.order);

  return (
    <div id="cv-preview" style={{ width: forExport ? "794px" : "100%", minHeight: forExport ? "1123px" : undefined, fontSize: "11px", lineHeight: "1.5", fontFamily: "'Inter','Segoe UI',Arial,sans-serif" }} className="bg-white text-gray-900">
      <div style={{ display: "flex", minHeight: forExport ? "1123px" : "100%" }}>
        {/* Left sidebar */}
        <div style={{ width: 210, background: "#f8f9fa", padding: "28px 20px", flexShrink: 0, borderRight: `1px solid ${accentColor}20` }}>
          {personal.photoUrl && <img src={personal.photoUrl} alt="" style={{ width: 100, height: 100, borderRadius: "50%", objectFit: "cover", margin: "0 auto 16px", display: "block", border: `3px solid ${accentColor}30` }} />}
          <h1 style={{ fontSize: "18px", fontWeight: 900, textAlign: "center", color: "#111" }}>{personal.fullName || "Your Name"}</h1>
          {personal.title && <p style={{ fontSize: "11px", color: accentColor, textAlign: "center", fontWeight: 600, marginTop: 4 }}>{personal.title}</p>}

          <div style={{ marginTop: 20, borderTop: `2px solid ${accentColor}20`, paddingTop: 16 }}>
            <h3 style={{ fontSize: "8px", fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.2em", color: accentColor, marginBottom: 10 }}>Contact</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: "10px", color: "#555" }}>
              {personal.email && <p>{personal.email}</p>}
              {personal.phone && <p>{personal.phone}</p>}
              {personal.location && <p>{personal.location}</p>}
              {personal.website && <p>{personal.website}</p>}
              {personal.linkedin && <p>{personal.linkedin}</p>}
              {personal.github && <p>{personal.github}</p>}
            </div>
          </div>

          {skills.length > 0 && (
            <div style={{ marginTop: 16, borderTop: `2px solid ${accentColor}20`, paddingTop: 16 }}>
              <h3 style={{ fontSize: "8px", fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.2em", color: accentColor, marginBottom: 10 }}>Skills</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {skills.map((sk) => (
                  <div key={sk.id}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "10px", marginBottom: 2 }}>
                      <span style={{ fontWeight: 600, color: "#333" }}>{sk.name}</span>
                      <span style={{ color: "#999", fontSize: "9px" }}>{LEVEL_LABELS[sk.level]}</span>
                    </div>
                    <div style={{ height: 4, background: "#e5e5e5", borderRadius: 2 }}>
                      <div style={{ width: `${(sk.level / 5) * 100}%`, height: "100%", background: accentColor, borderRadius: 2 }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {languages.length > 0 && (
            <div style={{ marginTop: 16, borderTop: `2px solid ${accentColor}20`, paddingTop: 16 }}>
              <h3 style={{ fontSize: "8px", fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.2em", color: accentColor, marginBottom: 8 }}>Languages</h3>
              {languages.map((l) => <p key={l.id} style={{ fontSize: "10.5px", marginBottom: 4 }}><span style={{ fontWeight: 600 }}>{l.name}</span> <span style={{ color: "#888" }}>{l.level}</span></p>)}
            </div>
          )}
        </div>
        {/* Right main */}
        <div style={{ flex: 1, padding: "28px 24px", display: "flex", flexDirection: "column", gap: 16 }}>
          {ordered.map((sec) => {
            if (sec.id === "summary" && summary) return (
              <section key="summary">
                <h2 style={{ fontSize: "9px", fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.15em", color: accentColor, marginBottom: 6 }}>Professional Summary</h2>
                <p style={{ fontSize: "11px", color: "#555", lineHeight: "1.6" }}>{summary}</p>
              </section>
            );
            if (sec.id === "experience" && experience.length > 0) return (
              <section key="experience">
                <h2 style={{ fontSize: "9px", fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.15em", color: accentColor, marginBottom: 8 }}>Experience</h2>
                {experience.map((exp) => (
                  <div key={exp.id} style={{ marginBottom: 8 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                      <span style={{ fontWeight: 700, fontSize: "12px", color: "#222" }}>{exp.role}</span>
                      <span style={{ fontSize: "9.5px", color: "#999" }}>{fmtRange(exp.startDate, exp.endDate, exp.current)}</span>
                    </div>
                    <p style={{ fontSize: "11px", color: accentColor, fontWeight: 600 }}>{exp.company}</p>
                    {exp.bullets.filter(Boolean).length > 0 && (
                      <ul style={{ margin: "2px 0 0 16px", padding: 0 }}>
                        {exp.bullets.filter(Boolean).map((b, i) => <li key={i} style={{ fontSize: "10.5px", color: "#666" }}>{b}</li>)}
                      </ul>
                    )}
                  </div>
                ))}
              </section>
            );
            if (sec.id === "education" && education.length > 0) return (
              <section key="education">
                <h2 style={{ fontSize: "9px", fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.15em", color: accentColor, marginBottom: 6 }}>Education</h2>
                {education.map((edu) => (
                  <div key={edu.id} style={{ marginBottom: 6, display: "flex", justifyContent: "space-between" }}>
                    <div><span style={{ fontWeight: 700, fontSize: "12px", color: "#222" }}>{edu.degree}{edu.field ? ` in ${edu.field}` : ""}</span><p style={{ fontSize: "10.5px", color: "#666" }}>{edu.institution}{edu.gpa ? ` · GPA: ${edu.gpa}` : ""}</p></div>
                    <span style={{ fontSize: "9.5px", color: "#999", whiteSpace: "nowrap" }}>{fmtRange(edu.startDate, edu.endDate, edu.current)}</span>
                  </div>
                ))}
              </section>
            );
            if (sec.id === "projects" && projects.length > 0) return (
              <section key="projects">
                <h2 style={{ fontSize: "9px", fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.15em", color: accentColor, marginBottom: 6 }}>Projects</h2>
                {projects.map((p) => (
                  <div key={p.id} style={{ marginBottom: 6 }}>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span style={{ fontWeight: 700, fontSize: "12px", color: "#222" }}>{p.name}</span>
                      {(p.startDate || p.endDate) && <span style={{ fontSize: "9.5px", color: "#999" }}>{fmtRange(p.startDate, p.endDate, false)}</span>}
                    </div>
                    {p.tech && <p style={{ fontSize: "10px", color: accentColor }}>{p.tech}</p>}
                    {p.description && <p style={{ fontSize: "10.5px", color: "#666" }}>{p.description}</p>}
                  </div>
                ))}
              </section>
            );
            if (sec.id === "certifications" && certifications.length > 0) return (
              <section key="certifications">
                <h2 style={{ fontSize: "9px", fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.15em", color: accentColor, marginBottom: 4 }}>Certifications</h2>
                {certifications.map((c) => <p key={c.id} style={{ fontSize: "11px", marginBottom: 2 }}><span style={{ fontWeight: 600 }}>{c.name}</span>{c.issuer ? <span style={{ color: "#888" }}> · {c.issuer}</span> : null}</p>)}
              </section>
            );
            if (sec.id === "languages" && languages.length > 0) return null;
            return null;
          })}
        </div>
      </div>
    </div>
  );
}

// ── 10. Futuristic Glassmorphism ───────────────────────────────────────────────
export function GlassmorphismTemplate({ cv, forExport }: Props) {
  const { personal, summary, experience, education, skills, projects, certifications, languages, sections, accentColor } = cv;
  const ordered = [...sections].filter((s) => s.enabled).sort((a, b) => a.order - b.order);

  return (
    <div id="cv-preview" style={{ width: forExport ? "794px" : "100%", minHeight: forExport ? "1123px" : undefined, fontSize: "11px", lineHeight: "1.5", fontFamily: "'Inter','Segoe UI',Arial,sans-serif", background: `linear-gradient(135deg, ${accentColor}08 0%, ${accentColor}04 50%, #fff 100%)` }} className="text-gray-900">
      <div style={{ padding: "32px 36px", background: `linear-gradient(135deg, ${accentColor}15, ${accentColor}08)`, backdropFilter: "blur(20px)", borderBottom: `1px solid ${accentColor}20`, position: "relative" }}>
        <div style={{ position: "absolute", top: -40, right: -40, width: 160, height: 160, borderRadius: "50%", background: `radial-gradient(circle, ${accentColor}15, transparent)`, pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: -60, left: -20, width: 120, height: 120, borderRadius: "50%", background: `radial-gradient(circle, ${accentColor}10, transparent)`, pointerEvents: "none" }} />
        <div style={{ display: "flex", alignItems: "center", gap: 20, position: "relative", zIndex: 1 }}>
          {personal.photoUrl && (
            <div style={{ borderRadius: 20, padding: 3, background: `linear-gradient(135deg, ${accentColor}, ${accentColor}88)`, boxShadow: `0 8px 32px ${accentColor}30` }}>
              <img src={personal.photoUrl} alt="" style={{ width: 72, height: 72, borderRadius: 17, objectFit: "cover", display: "block" }} />
            </div>
          )}
          <div>
            <h1 style={{ fontSize: "24px", fontWeight: 900, letterSpacing: "-0.5px", background: `linear-gradient(135deg, ${accentColor}, #111)`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{personal.fullName || "Your Name"}</h1>
            {personal.title && <p style={{ fontSize: "13px", color: accentColor, fontWeight: 600, marginTop: 2 }}>{personal.title}</p>}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px 14px", marginTop: 8, fontSize: "10px", color: "#888" }}>
              {personal.email && <span style={{ padding: "2px 8px", background: "rgba(255,255,255,0.5)", borderRadius: 4, border: "1px solid rgba(255,255,255,0.3)" }}>{personal.email}</span>}
              {personal.phone && <span style={{ padding: "2px 8px", background: "rgba(255,255,255,0.5)", borderRadius: 4, border: "1px solid rgba(255,255,255,0.3)" }}>{personal.phone}</span>}
              {personal.location && <span style={{ padding: "2px 8px", background: "rgba(255,255,255,0.5)", borderRadius: 4, border: "1px solid rgba(255,255,255,0.3)" }}>{personal.location}</span>}
              {personal.linkedin && <span style={{ padding: "2px 8px", background: "rgba(255,255,255,0.5)", borderRadius: 4, border: "1px solid rgba(255,255,255,0.3)" }}>{personal.linkedin}</span>}
              {personal.github && <span style={{ padding: "2px 8px", background: "rgba(255,255,255,0.5)", borderRadius: 4, border: "1px solid rgba(255,255,255,0.3)" }}>{personal.github}</span>}
            </div>
          </div>
        </div>
      </div>
      <div style={{ padding: "24px 36px", display: "flex", flexDirection: "column", gap: 14 }}>
        {ordered.map((sec) => {
          if (sec.id === "summary" && summary) return (
            <section key="summary" style={{ padding: "14px 18px", background: "rgba(255,255,255,0.7)", backdropFilter: "blur(10px)", borderRadius: 12, border: "1px solid rgba(255,255,255,0.5)", boxShadow: "0 4px 16px rgba(0,0,0,0.04)" }}>
              <h2 style={{ fontSize: "9px", fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.15em", color: accentColor, marginBottom: 6 }}>Summary</h2>
              <p style={{ fontSize: "11px", color: "#555", lineHeight: "1.6" }}>{summary}</p>
            </section>
          );
          if (sec.id === "experience" && experience.length > 0) return (
            <section key="experience">
              <h2 style={{ fontSize: "9px", fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.15em", color: accentColor, marginBottom: 8 }}>Experience</h2>
              {experience.map((exp) => (
                <div key={exp.id} style={{ marginBottom: 8, padding: "12px 16px", background: "rgba(255,255,255,0.7)", backdropFilter: "blur(10px)", borderRadius: 12, border: "1px solid rgba(255,255,255,0.5)", boxShadow: "0 4px 16px rgba(0,0,0,0.04)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                    <span style={{ fontWeight: 700, fontSize: "12px", color: "#222" }}>{exp.role}</span>
                    <span style={{ fontSize: "9.5px", color: "#999" }}>{fmtRange(exp.startDate, exp.endDate, exp.current)}</span>
                  </div>
                  <p style={{ fontSize: "11px", color: accentColor, fontWeight: 600 }}>{exp.company}</p>
                  {exp.bullets.filter(Boolean).length > 0 && (
                    <ul style={{ margin: "4px 0 0 16px", padding: 0 }}>
                      {exp.bullets.filter(Boolean).map((b, i) => <li key={i} style={{ fontSize: "10.5px", color: "#666", marginBottom: 1 }}>{b}</li>)}
                    </ul>
                  )}
                </div>
              ))}
            </section>
          );
          if (sec.id === "education" && education.length > 0) return (
            <section key="education">
              <h2 style={{ fontSize: "9px", fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.15em", color: accentColor, marginBottom: 6 }}>Education</h2>
              {education.map((edu) => (
                <div key={edu.id} style={{ marginBottom: 6, padding: "10px 16px", background: "rgba(255,255,255,0.7)", backdropFilter: "blur(10px)", borderRadius: 12, border: "1px solid rgba(255,255,255,0.5)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ fontWeight: 700, fontSize: "12px", color: "#222" }}>{edu.degree}{edu.field ? ` in ${edu.field}` : ""}</span>
                    <span style={{ fontSize: "9.5px", color: "#999" }}>{fmtRange(edu.startDate, edu.endDate, edu.current)}</span>
                  </div>
                  <p style={{ fontSize: "10.5px", color: "#666" }}>{edu.institution}{edu.gpa ? ` · GPA: ${edu.gpa}` : ""}</p>
                </div>
              ))}
            </section>
          );
          if (sec.id === "skills" && skills.length > 0) return (
            <section key="skills" style={{ padding: "14px 18px", background: "rgba(255,255,255,0.7)", backdropFilter: "blur(10px)", borderRadius: 12, border: "1px solid rgba(255,255,255,0.5)" }}>
              <h2 style={{ fontSize: "9px", fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.15em", color: accentColor, marginBottom: 8 }}>Skills</h2>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {skills.map((sk) => (
                  <span key={sk.id} style={{ padding: "4px 12px", background: `${accentColor}08`, borderRadius: 8, border: `1px solid ${accentColor}15`, fontSize: "10.5px", color: "#444" }}>
                    {sk.name} <span style={{ color: accentColor, fontSize: "9px", fontWeight: 600 }}>{LEVEL_LABELS[sk.level]}</span>
                  </span>
                ))}
              </div>
            </section>
          );
          if (sec.id === "projects" && projects.length > 0) return (
            <section key="projects">
              <h2 style={{ fontSize: "9px", fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.15em", color: accentColor, marginBottom: 6 }}>Projects</h2>
              {projects.map((p) => (
                <div key={p.id} style={{ marginBottom: 6, padding: "10px 16px", background: "rgba(255,255,255,0.7)", backdropFilter: "blur(10px)", borderRadius: 12, border: "1px solid rgba(255,255,255,0.5)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ fontWeight: 700, fontSize: "12px", color: "#222" }}>{p.name}</span>
                    {(p.startDate || p.endDate) && <span style={{ fontSize: "9.5px", color: "#999" }}>{fmtRange(p.startDate, p.endDate, false)}</span>}
                  </div>
                  {p.tech && <p style={{ fontSize: "10px", color: accentColor }}>{p.tech}</p>}
                  {p.description && <p style={{ fontSize: "10.5px", color: "#666", marginTop: 2 }}>{p.description}</p>}
                </div>
              ))}
            </section>
          );
          if (sec.id === "certifications" && certifications.length > 0) return (
            <section key="certifications">
              <h2 style={{ fontSize: "9px", fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.15em", color: accentColor, marginBottom: 4 }}>Certifications</h2>
              {certifications.map((c) => (
                <p key={c.id} style={{ fontSize: "11px", marginBottom: 2, padding: "4px 10px", background: "rgba(255,255,255,0.5)", borderRadius: 6 }}>
                  <span style={{ fontWeight: 600 }}>{c.name}</span>{c.issuer ? <span style={{ color: "#888" }}> · {c.issuer}</span> : null}
                </p>
              ))}
            </section>
          );
          if (sec.id === "languages" && languages.length > 0) return (
            <section key="languages">
              <h2 style={{ fontSize: "9px", fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.15em", color: accentColor, marginBottom: 4 }}>Languages</h2>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {languages.map((l) => <span key={l.id} style={{ fontSize: "10.5px", padding: "3px 12px", background: "rgba(255,255,255,0.6)", borderRadius: 8, border: "1px solid rgba(255,255,255,0.4)" }}>{l.name} · {l.level}</span>)}
              </div>
            </section>
          );
          return null;
        })}
      </div>
    </div>
  );
}
