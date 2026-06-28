"use client";

import { useMemo, useState } from "react";
import { GraduationCap, Briefcase, Plus, Trash2, Calendar } from "lucide-react";
import { CareerPageHeader } from "./career-page-header";
import { useCareerStore, STATUS_LABELS, STATUS_COLORS } from "@/lib/career-store";
import type { ApplicationStatus } from "@/lib/career/types";
import { ToolsButton } from "@/components/tools/tools-button";
import { cn } from "@/lib/utils";

const STATUSES: ApplicationStatus[] = ["applied", "under-review", "interview", "technical", "hr-round", "offer", "rejected", "accepted"];

type TrackerProps = {
  type: "job" | "internship";
  title: string;
  description: string;
  icon: typeof GraduationCap;
};

export function TrackerClient({ type, title, description, icon }: TrackerProps) {
  const { applications, addApplication, updateApplication, removeApplication, getStats } = useCareerStore();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ company: "", role: "", location: "", salary: "", deadline: "", notes: "", recruiter: "", jobUrl: "" });
  const [statusFilter, setStatusFilter] = useState<ApplicationStatus | "all">("all");

  const apps = useMemo(() => applications.filter((a) => a.type === type), [applications, type]);
  const filtered = statusFilter === "all" ? apps : apps.filter((a) => a.status === statusFilter);
  const stats = getStats();
  const typeStats = useMemo(() => ({
    total: apps.length,
    interviews: apps.filter((a) => ["interview", "technical", "hr-round"].includes(a.status)).length,
    offers: apps.filter((a) => ["offer", "accepted"].includes(a.status)).length,
    rejected: apps.filter((a) => a.status === "rejected").length,
  }), [apps]);

  const handleAdd = () => {
    if (!form.company || !form.role) return;
    addApplication({
      company: form.company,
      role: form.role,
      location: form.location,
      salary: form.salary,
      deadline: form.deadline,
      notes: form.notes,
      recruiter: form.recruiter,
      jobUrl: form.jobUrl,
      status: "applied",
      appliedAt: new Date().toISOString().split("T")[0],
      type,
    });
    setForm({ company: "", role: "", location: "", salary: "", deadline: "", notes: "", recruiter: "", jobUrl: "" });
    setShowForm(false);
  };

  return (
    <div>
      <CareerPageHeader title={title} description={description} icon={icon} badge="Application Tracker" />
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "Total", value: typeStats.total },
            { label: "Interviews", value: typeStats.interviews },
            { label: "Offers", value: typeStats.offers },
            { label: "Rejected", value: typeStats.rejected },
          ].map((s) => (
            <div key={s.label} className="glass-card p-4 text-center">
              <p className="text-2xl font-extrabold text-[#6D5DF6]">{s.value}</p>
              <p className="text-xs text-slate-500">{s.label}</p>
            </div>
          ))}
        </div>

        {stats.upcomingDeadlines > 0 && (
          <div className="glass-card p-4 flex items-center gap-3 border-amber-500/20">
            <Calendar size={20} className="text-amber-500" />
            <p className="text-sm text-slate-600 dark:text-slate-300">{stats.upcomingDeadlines} deadline(s) coming up this week</p>
          </div>
        )}

        <div className="flex flex-wrap gap-2 items-center justify-between">
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={() => setStatusFilter("all")} className={cn("px-3 py-2 rounded-xl text-sm min-h-[44px]", statusFilter === "all" ? "gradient-primary text-white" : "bg-slate-100 dark:bg-white/5")}>All</button>
            {STATUSES.map((s) => (
              <button key={s} type="button" onClick={() => setStatusFilter(s)} className={cn("px-3 py-2 rounded-xl text-sm min-h-[44px]", statusFilter === s ? "gradient-primary text-white" : "bg-slate-100 dark:bg-white/5")}>{STATUS_LABELS[s]}</button>
            ))}
          </div>
          <ToolsButton onClick={() => setShowForm(!showForm)}><Plus size={16} /> Add Application</ToolsButton>
        </div>

        {showForm && (
          <div className="glass-card p-5 grid sm:grid-cols-2 gap-4">
            {(["company", "role", "location", "salary", "deadline", "recruiter", "jobUrl"] as const).map((f) => (
              <div key={f}>
                <label className="text-xs font-bold uppercase text-slate-500 mb-1 block">{f}</label>
                <input
                  value={form[f]}
                  onChange={(e) => setForm({ ...form, [f]: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 p-3 text-sm min-h-[44px] outline-none focus:border-[#6D5DF6]/50 capitalize"
                />
              </div>
            ))}
            <div className="sm:col-span-2">
              <label className="text-xs font-bold uppercase text-slate-500 mb-1 block">Notes</label>
              <textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} className="w-full rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 p-3 text-sm min-h-[80px] outline-none focus:border-[#6D5DF6]/50" />
            </div>
            <div className="sm:col-span-2">
              <ToolsButton onClick={handleAdd}>Save Application</ToolsButton>
            </div>
          </div>
        )}

        {filtered.length === 0 ? (
          <p className="text-center text-slate-500 py-12">No applications yet. Add your first one!</p>
        ) : (
          <div className="space-y-3">
            {filtered.map((app) => (
              <div key={app.id} className="glass-card p-4 sm:p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white">{app.role}</h3>
                    <p className="text-sm text-slate-500">{app.company}{app.location ? ` · ${app.location}` : ""}</p>
                    {app.salary && <p className="text-sm text-emerald-600 mt-1">{app.salary}</p>}
                  </div>
                  <div className="flex items-center gap-2">
                    <select
                      value={app.status}
                      onChange={(e) => updateApplication(app.id, { status: e.target.value as ApplicationStatus })}
                      className={cn("px-3 py-1.5 rounded-lg text-xs font-semibold border-0 outline-none min-h-[44px]", STATUS_COLORS[app.status])}
                    >
                      {STATUSES.map((s) => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
                    </select>
                    <button type="button" onClick={() => removeApplication(app.id)} aria-label="Remove" className="p-2 rounded-lg hover:bg-red-500/10 text-red-500 min-h-[44px] min-w-[44px] flex items-center justify-center">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                <div className="flex flex-wrap gap-3 mt-2 text-xs text-slate-400">
                  {app.appliedAt && <span>Applied: {app.appliedAt}</span>}
                  {app.deadline && <span>Deadline: {app.deadline}</span>}
                  {app.recruiter && <span>Recruiter: {app.recruiter}</span>}
                </div>
                {app.notes && <p className="text-sm text-slate-500 mt-2">{app.notes}</p>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export function InternshipTrackerClient() {
  return <TrackerClient type="internship" title="Internship Tracker" description="Track internship applications, deadlines, interviews, and offers." icon={GraduationCap} />;
}

export function JobTrackerClient() {
  return <TrackerClient type="job" title="Job Tracker" description="Manage job applications, recruiters, salary notes, and interview pipeline." icon={Briefcase} />;
}
