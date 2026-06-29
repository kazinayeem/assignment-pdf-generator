"use client";

import React, { useRef } from "react";
import { useCVStore } from "@/lib/cv-store";
import { Plus, Trash2, GripVertical, ChevronDown, ChevronUp, Upload } from "lucide-react";
import { Input } from "@/components/ui/input";

const LEVEL_LABELS = ["", "Beginner", "Elementary", "Intermediate", "Advanced", "Expert"];
const LANG_LEVELS = ["Native", "Fluent", "Advanced", "Intermediate", "Basic"] as const;
const SKILL_CATEGORIES = ["Technical", "Soft Skills", "Tools", "Languages", "Other"];

const labelCls = "text-[10px] font-black uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-1 block";
const inputCls = "h-9 text-sm rounded-lg border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 dark:text-white";
const textareaCls = "w-full text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 dark:text-white p-2.5 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400";

function EditorSection({ title, children, onAdd, addLabel }: {
  title: string; children: React.ReactNode; onAdd?: () => void; addLabel?: string;
}) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-black text-gray-900 dark:text-white">{title}</h3>
        {onAdd && (
          <button onClick={onAdd} className="flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 transition-colors">
            <Plus className="w-3.5 h-3.5" />{addLabel || "Add"}
          </button>
        )}
      </div>
      {children}
    </div>
  );
}

function ItemCard({ title, onRemove, children }: { title: string; onRemove: () => void; children: React.ReactNode; }) {
  const [open, setOpen] = React.useState(true);
  return (
    <div className="border border-gray-100 dark:border-gray-700 rounded-xl overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2.5 bg-gray-50 dark:bg-gray-800/50 cursor-pointer" onClick={() => setOpen(!open)}>
        <div className="flex items-center gap-2">
          <GripVertical className="w-3.5 h-3.5 text-gray-300 dark:text-gray-600" />
          <span className="text-xs font-bold text-gray-700 dark:text-gray-300 truncate max-w-[180px]">{title || "Untitled"}</span>
        </div>
        <div className="flex items-center gap-1">
          <button onClick={(e) => { e.stopPropagation(); onRemove(); }} className="p-1 text-gray-300 dark:text-gray-600 hover:text-red-500 transition-colors">
            <Trash2 className="w-3.5 h-3.5" />
          </button>
          {open ? <ChevronUp className="w-3.5 h-3.5 text-gray-400" /> : <ChevronDown className="w-3.5 h-3.5 text-gray-400" />}
        </div>
      </div>
      {open && <div className="p-4 space-y-3">{children}</div>}
    </div>
  );
}

function PersonalEditor() {
  const { cv, updatePersonal } = useCVStore();
  const { personal } = cv;
  const fileRef = useRef<HTMLInputElement>(null);

  const handlePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => updatePersonal({ photoUrl: ev.target?.result as string });
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div onClick={() => fileRef.current?.click()} className="w-16 h-16 rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-700 flex items-center justify-center cursor-pointer hover:border-blue-400 transition-colors overflow-hidden shrink-0">
          {personal.photoUrl ? <img src={personal.photoUrl} alt="Photo" className="w-full h-full object-cover" /> : <Upload className="w-5 h-5 text-gray-300" />}
        </div>
        <div className="flex-1">
          <p className="text-xs font-bold text-gray-700 dark:text-gray-300">Profile Photo</p>
          <p className="text-[10px] text-gray-400 mt-0.5">Optional. JPG or PNG.</p>
          <button onClick={() => fileRef.current?.click()} className="text-[11px] text-blue-600 dark:text-blue-400 font-bold mt-1 hover:underline">Upload photo</button>
        </div>
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handlePhoto} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="col-span-2"><label className={labelCls}>Full Name *</label><Input className={inputCls} value={personal.fullName} onChange={(e) => updatePersonal({ fullName: e.target.value })} placeholder="John Doe" /></div>
        <div className="col-span-2"><label className={labelCls}>Professional Title</label><Input className={inputCls} value={personal.title} onChange={(e) => updatePersonal({ title: e.target.value })} placeholder="Software Engineer" /></div>
        <div><label className={labelCls}>Email *</label><Input className={inputCls} type="email" value={personal.email} onChange={(e) => updatePersonal({ email: e.target.value })} placeholder="john@example.com" /></div>
        <div><label className={labelCls}>Phone</label><Input className={inputCls} value={personal.phone} onChange={(e) => updatePersonal({ phone: e.target.value })} placeholder="+880 1234 567890" /></div>
        <div className="col-span-2"><label className={labelCls}>Location</label><Input className={inputCls} value={personal.location} onChange={(e) => updatePersonal({ location: e.target.value })} placeholder="Dhaka, Bangladesh" /></div>
        <div><label className={labelCls}>LinkedIn</label><Input className={inputCls} value={personal.linkedin} onChange={(e) => updatePersonal({ linkedin: e.target.value })} placeholder="linkedin.com/in/johndoe" /></div>
        <div><label className={labelCls}>GitHub</label><Input className={inputCls} value={personal.github} onChange={(e) => updatePersonal({ github: e.target.value })} placeholder="github.com/johndoe" /></div>
        <div className="col-span-2"><label className={labelCls}>Website</label><Input className={inputCls} value={personal.website} onChange={(e) => updatePersonal({ website: e.target.value })} placeholder="johndoe.dev" /></div>
      </div>
    </div>
  );
}

function SummaryEditor() {
  const { cv, updateSummary } = useCVStore();
  return (
    <div>
      <label className={labelCls}>Professional Summary</label>
      <textarea className={textareaCls} rows={5} value={cv.summary} onChange={(e) => updateSummary(e.target.value)} placeholder="A results-driven software engineer with 3+ years of experience building scalable web applications..." />
      <p className="text-[10px] text-gray-400 mt-1">{cv.summary.trim().split(/\s+/).filter(Boolean).length} words · ATS recommends 40–80 words</p>
    </div>
  );
}

function ExperienceEditor() {
  const { cv, addExperience, updateExperience, removeExperience } = useCVStore();
  return (
    <EditorSection title="Work Experience" onAdd={addExperience} addLabel="Add Experience">
      {cv.experience.length === 0 && <p className="text-xs text-gray-400 text-center py-4">No experience added yet.</p>}
      {cv.experience.map((exp) => (
        <ItemCard key={exp.id} title={exp.role || exp.company || "New Experience"} onRemove={() => removeExperience(exp.id)}>
          <div className="grid grid-cols-2 gap-3">
            <div><label className={labelCls}>Job Title *</label><Input className={inputCls} value={exp.role} onChange={(e) => updateExperience(exp.id, { role: e.target.value })} placeholder="Software Engineer" /></div>
            <div><label className={labelCls}>Company *</label><Input className={inputCls} value={exp.company} onChange={(e) => updateExperience(exp.id, { company: e.target.value })} placeholder="Google" /></div>
            <div><label className={labelCls}>Start Date</label><Input className={inputCls} type="month" value={exp.startDate} onChange={(e) => updateExperience(exp.id, { startDate: e.target.value })} /></div>
            <div>
              <label className={labelCls}>End Date</label>
              <Input className={inputCls} type="month" value={exp.endDate} disabled={exp.current} onChange={(e) => updateExperience(exp.id, { endDate: e.target.value })} />
              <label className="flex items-center gap-1.5 mt-1.5 cursor-pointer"><input type="checkbox" checked={exp.current} onChange={(e) => updateExperience(exp.id, { current: e.target.checked })} className="rounded" /><span className="text-[10px] text-gray-500">Currently working here</span></label>
            </div>
            <div className="col-span-2"><label className={labelCls}>Location</label><Input className={inputCls} value={exp.location} onChange={(e) => updateExperience(exp.id, { location: e.target.value })} placeholder="Dhaka, Bangladesh" /></div>
          </div>
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className={labelCls}>Bullet Points</label>
              <button onClick={() => updateExperience(exp.id, { bullets: [...exp.bullets, ""] })} className="text-[10px] text-blue-600 dark:text-blue-400 font-bold flex items-center gap-1"><Plus className="w-3 h-3" /> Add bullet</button>
            </div>
            <div className="space-y-2">
              {exp.bullets.map((b, i) => (
                <div key={i} className="flex gap-2">
                  <Input className={inputCls + " flex-1"} value={b} onChange={(e) => { const bullets = [...exp.bullets]; bullets[i] = e.target.value; updateExperience(exp.id, { bullets }); }} placeholder="Led development of a feature that increased retention by 20%" />
                  <button onClick={() => updateExperience(exp.id, { bullets: exp.bullets.filter((_, j) => j !== i) })} className="text-gray-300 hover:text-red-500 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
              ))}
            </div>
          </div>
        </ItemCard>
      ))}
    </EditorSection>
  );
}

function EducationEditor() {
  const { cv, addEducation, updateEducation, removeEducation } = useCVStore();
  return (
    <EditorSection title="Education" onAdd={addEducation} addLabel="Add Education">
      {cv.education.length === 0 && <p className="text-xs text-gray-400 text-center py-4">No education added yet.</p>}
      {cv.education.map((edu) => (
        <ItemCard key={edu.id} title={edu.institution || edu.degree || "New Education"} onRemove={() => removeEducation(edu.id)}>
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2"><label className={labelCls}>Institution *</label><Input className={inputCls} value={edu.institution} onChange={(e) => updateEducation(edu.id, { institution: e.target.value })} placeholder="Daffodil International University" /></div>
            <div><label className={labelCls}>Degree</label><Input className={inputCls} value={edu.degree} onChange={(e) => updateEducation(edu.id, { degree: e.target.value })} placeholder="B.Sc." /></div>
            <div><label className={labelCls}>Field of Study</label><Input className={inputCls} value={edu.field} onChange={(e) => updateEducation(edu.id, { field: e.target.value })} placeholder="Software Engineering" /></div>
            <div><label className={labelCls}>Start Date</label><Input className={inputCls} type="month" value={edu.startDate} onChange={(e) => updateEducation(edu.id, { startDate: e.target.value })} /></div>
            <div>
              <label className={labelCls}>End Date</label>
              <Input className={inputCls} type="month" value={edu.endDate} disabled={edu.current} onChange={(e) => updateEducation(edu.id, { endDate: e.target.value })} />
              <label className="flex items-center gap-1.5 mt-1.5 cursor-pointer"><input type="checkbox" checked={edu.current} onChange={(e) => updateEducation(edu.id, { current: e.target.checked })} className="rounded" /><span className="text-[10px] text-gray-500">Currently studying</span></label>
            </div>
            <div><label className={labelCls}>GPA / Grade</label><Input className={inputCls} value={edu.gpa} onChange={(e) => updateEducation(edu.id, { gpa: e.target.value })} placeholder="3.8 / 4.0" /></div>
            <div><label className={labelCls}>Location</label><Input className={inputCls} value={edu.location} onChange={(e) => updateEducation(edu.id, { location: e.target.value })} placeholder="Dhaka" /></div>
          </div>
        </ItemCard>
      ))}
    </EditorSection>
  );
}

function SkillsEditor() {
  const { cv, addSkill, updateSkill, removeSkill } = useCVStore();
  return (
    <EditorSection title="Skills" onAdd={addSkill} addLabel="Add Skill">
      {cv.skills.length === 0 && <p className="text-xs text-gray-400 text-center py-4">No skills added yet.</p>}
      <div className="space-y-3">
        {cv.skills.map((sk) => (
          <div key={sk.id} className="flex items-center gap-3 p-3 border border-gray-100 dark:border-gray-700 rounded-xl">
            <div className="flex-1 grid grid-cols-2 gap-2">
              <Input className={inputCls} value={sk.name} onChange={(e) => updateSkill(sk.id, { name: e.target.value })} placeholder="React.js" />
              <select value={sk.category} onChange={(e) => updateSkill(sk.id, { category: e.target.value })} className="h-9 text-xs rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 dark:text-white px-2">
                {SKILL_CATEGORIES.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button key={n} onClick={() => updateSkill(sk.id, { level: n })} className={`w-4 h-4 rounded-full border-2 transition-all ${n <= sk.level ? "border-blue-500 bg-blue-500" : "border-gray-200 dark:border-gray-600"}`} title={LEVEL_LABELS[n]} />
                ))}
              </div>
              <button onClick={() => removeSkill(sk.id)} className="text-gray-300 hover:text-red-500 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
            </div>
          </div>
        ))}
      </div>
    </EditorSection>
  );
}

function ProjectsEditor() {
  const { cv, addProject, updateProject, removeProject } = useCVStore();
  return (
    <EditorSection title="Projects" onAdd={addProject} addLabel="Add Project">
      {cv.projects.length === 0 && <p className="text-xs text-gray-400 text-center py-4">No projects added yet.</p>}
      {cv.projects.map((p) => (
        <ItemCard key={p.id} title={p.name || "New Project"} onRemove={() => removeProject(p.id)}>
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2"><label className={labelCls}>Project Name *</label><Input className={inputCls} value={p.name} onChange={(e) => updateProject(p.id, { name: e.target.value })} placeholder="BornoFlow" /></div>
            <div className="col-span-2"><label className={labelCls}>Tech Stack</label><Input className={inputCls} value={p.tech} onChange={(e) => updateProject(p.id, { tech: e.target.value })} placeholder="Next.js, TypeScript, Firebase" /></div>
            <div className="col-span-2"><label className={labelCls}>Description</label><textarea className={textareaCls} rows={2} value={p.description} onChange={(e) => updateProject(p.id, { description: e.target.value })} placeholder="Built a platform that..." /></div>
            <div><label className={labelCls}>Start Date</label><Input className={inputCls} type="month" value={p.startDate} onChange={(e) => updateProject(p.id, { startDate: e.target.value })} /></div>
            <div><label className={labelCls}>End Date</label><Input className={inputCls} type="month" value={p.endDate} onChange={(e) => updateProject(p.id, { endDate: e.target.value })} /></div>
            <div className="col-span-2"><label className={labelCls}>URL</label><Input className={inputCls} value={p.url} onChange={(e) => updateProject(p.id, { url: e.target.value })} placeholder="github.com/user/project" /></div>
          </div>
        </ItemCard>
      ))}
    </EditorSection>
  );
}

function CertificationsEditor() {
  const { cv, addCertification, updateCertification, removeCertification } = useCVStore();
  return (
    <EditorSection title="Certifications" onAdd={addCertification} addLabel="Add Certification">
      {cv.certifications.length === 0 && <p className="text-xs text-gray-400 text-center py-4">No certifications added yet.</p>}
      {cv.certifications.map((c) => (
        <ItemCard key={c.id} title={c.name || "New Certification"} onRemove={() => removeCertification(c.id)}>
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2"><label className={labelCls}>Certification Name *</label><Input className={inputCls} value={c.name} onChange={(e) => updateCertification(c.id, { name: e.target.value })} placeholder="AWS Solutions Architect" /></div>
            <div><label className={labelCls}>Issuer</label><Input className={inputCls} value={c.issuer} onChange={(e) => updateCertification(c.id, { issuer: e.target.value })} placeholder="Amazon Web Services" /></div>
            <div><label className={labelCls}>Date</label><Input className={inputCls} type="month" value={c.date} onChange={(e) => updateCertification(c.id, { date: e.target.value })} /></div>
            <div className="col-span-2"><label className={labelCls}>Credential URL</label><Input className={inputCls} value={c.url} onChange={(e) => updateCertification(c.id, { url: e.target.value })} placeholder="credly.com/badges/..." /></div>
          </div>
        </ItemCard>
      ))}
    </EditorSection>
  );
}

function LanguagesEditor() {
  const { cv, addLanguage, updateLanguage, removeLanguage } = useCVStore();
  return (
    <EditorSection title="Languages" onAdd={addLanguage} addLabel="Add Language">
      {cv.languages.length === 0 && <p className="text-xs text-gray-400 text-center py-4">No languages added yet.</p>}
      <div className="space-y-2">
        {cv.languages.map((l) => (
          <div key={l.id} className="flex items-center gap-3 p-3 border border-gray-100 dark:border-gray-700 rounded-xl">
            <Input className={inputCls + " flex-1"} value={l.name} onChange={(e) => updateLanguage(l.id, { name: e.target.value })} placeholder="English" />
            <select value={l.level} onChange={(e) => updateLanguage(l.id, { level: e.target.value as typeof l.level })} className="h-9 text-xs rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 dark:text-white px-2">
              {LANG_LEVELS.map((lv) => <option key={lv}>{lv}</option>)}
            </select>
            <button onClick={() => removeLanguage(l.id)} className="text-gray-300 hover:text-red-500 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
          </div>
        ))}
      </div>
    </EditorSection>
  );
}

export default function CVEditor() {
  const { activeSection } = useCVStore();
  const sectionMap: Record<string, React.ReactNode> = {
    personal: <PersonalEditor />,
    summary: <SummaryEditor />,
    experience: <ExperienceEditor />,
    education: <EducationEditor />,
    skills: <SkillsEditor />,
    projects: <ProjectsEditor />,
    certifications: <CertificationsEditor />,
    languages: <LanguagesEditor />,
  };
  return <div className="p-5 overflow-y-auto h-full">{sectionMap[activeSection] || <PersonalEditor />}</div>;
}
