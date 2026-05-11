"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import { Calendar, Clock, MapPin, User, Loader2, RefreshCw, Download } from "lucide-react";
import { useAuthStore } from "@/lib/auth-store";
import { useProtectedRoute } from "@/lib/use-protected-route";
import { Input } from "@/components/ui/input";

interface RoutineEntry {
  day: string;
  room: string;
  time: string;
  courseCode: string;
  batch: string;
  section: string;
  teacher: string;
  fullCourse: string;
}

const DAYS = ["Saturday", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"];
const DAY_SHORT = ["Sat", "Sun", "Mon", "Tue", "Wed", "Thu"];

const TIME_SLOTS = [
  "08:30-10:00",
  "10:00-11:30",
  "11:30-01:00",
  "01:00-02:30",
  "02:30-04:00",
  "04:00-05:30",
];

// Color palette per course code (consistent colors)
const COURSE_COLORS = [
  { bg: "bg-blue-50", border: "border-blue-200", text: "text-blue-700", dot: "bg-blue-500", header: "bg-blue-500" },
  { bg: "bg-violet-50", border: "border-violet-200", text: "text-violet-700", dot: "bg-violet-500", header: "bg-violet-500" },
  { bg: "bg-emerald-50", border: "border-emerald-200", text: "text-emerald-700", dot: "bg-emerald-500", header: "bg-emerald-500" },
  { bg: "bg-orange-50", border: "border-orange-200", text: "text-orange-700", dot: "bg-orange-500", header: "bg-orange-500" },
  { bg: "bg-pink-50", border: "border-pink-200", text: "text-pink-700", dot: "bg-pink-500", header: "bg-pink-500" },
  { bg: "bg-cyan-50", border: "border-cyan-200", text: "text-cyan-700", dot: "bg-cyan-500", header: "bg-cyan-500" },
  { bg: "bg-amber-50", border: "border-amber-200", text: "text-amber-700", dot: "bg-amber-500", header: "bg-amber-500" },
  { bg: "bg-indigo-50", border: "border-indigo-200", text: "text-indigo-700", dot: "bg-indigo-500", header: "bg-indigo-500" },
];

function getCourseColor(courseCode: string, colorMap: Map<string, number>) {
  if (!colorMap.has(courseCode)) {
    colorMap.set(courseCode, colorMap.size % COURSE_COLORS.length);
  }
  return COURSE_COLORS[colorMap.get(courseCode)!];
}

// Get today's day name (Bangladesh uses Sat–Thu work week)
function getTodayName(): string {
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  return days[new Date().getDay()];
}

export default function StudentRoutinePage() {
  useProtectedRoute();
  const { user } = useAuthStore();

  const [routineData, setRoutineData] = useState<RoutineEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sectionFilter, setSectionFilter] = useState("");
  const [batchFilter, setBatchFilter] = useState("");
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);
  const exportRef = useRef<HTMLDivElement>(null);

  const today = getTodayName();
  const colorMap = useMemo(() => new Map<string, number>(), []);

  useEffect(() => {
    fetch("/api/routine")
      .then((r) => r.json())
      .then((data) => { setRoutineData(data); setLoading(false); })
      .catch((e) => { setError(e.message); setLoading(false); });
  }, []);

  useEffect(() => {
    if (user) {
      setSectionFilter(user.section || "");
      setBatchFilter(user.batch || "");
    }
  }, [user]);

  const filtered = useMemo(() => {
    return routineData.filter((e) => {
      const sec = sectionFilter.toUpperCase();
      const entrySec = e.section?.toUpperCase() || "";
      const matchSec = !sec || entrySec === sec || (sec.length > 1 && entrySec === sec[0]);
      const matchBatch = !batchFilter || e.batch?.includes(batchFilter);
      return matchSec && matchBatch;
    });
  }, [routineData, sectionFilter, batchFilter]);

  // Build lookup: day → time → entry[]
  const grid = useMemo(() => {
    const map: Record<string, Record<string, RoutineEntry[]>> = {};
    DAYS.forEach((d) => {
      map[d] = {};
      TIME_SLOTS.forEach((t) => { map[d][t] = []; });
    });
    filtered.forEach((e) => {
      if (map[e.day]?.[e.time]) map[e.day][e.time].push(e);
    });
    return map;
  }, [filtered]);

  // Active day for mobile tab view
  const activeDay = selectedDay || (DAYS.includes(today) ? today : DAYS[0]);

  // ── Export to PNG ──────────────────────────────────────────────────────────
  const handleExport = async () => {
    if (!exportRef.current) return;
    setExporting(true);
    try {
      const { toPng } = await import("html-to-image");
      const dataUrl = await toPng(exportRef.current, {
        cacheBust: true,
        pixelRatio: 2,
        backgroundColor: "#ffffff",
        style: { borderRadius: "0" },
      });
      const link = document.createElement("a");
      link.download = `routine-batch${batchFilter}-sec${sectionFilter}-spring2026.png`;
      link.href = dataUrl;
      link.click();
    } catch (e) {
      console.error("Export failed:", e);
    } finally {
      setExporting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
        <p className="text-gray-400 font-medium text-sm animate-pulse">Loading routine...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Calendar className="w-12 h-12 text-red-400" />
        <p className="text-gray-500 font-medium">{error}</p>
        <button onClick={() => window.location.reload()} className="flex items-center gap-2 text-sm text-blue-600 font-bold hover:underline">
          <RefreshCw className="w-4 h-4" /> Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-16">

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="relative p-6 md:p-8 rounded-2xl bg-gradient-to-br from-gray-900 via-blue-950 to-gray-900 overflow-hidden shadow-xl">
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: "radial-gradient(circle at 20% 50%, #3b82f6 0%, transparent 50%), radial-gradient(circle at 80% 20%, #6366f1 0%, transparent 50%)" }} />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="w-5 h-5 text-blue-400" />
              <span className="text-[10px] font-black uppercase tracking-widest text-blue-400">Spring 2026</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">Class Routine</h1>
            <p className="text-blue-200/60 text-sm mt-1">
              {user?.department || "SWE"} · Batch {batchFilter || "—"} · Section {sectionFilter || "—"}
            </p>
          </div>

          {/* Filters */}
          <div className="flex items-end gap-3">
            <div>
              <label className="block text-[9px] font-black uppercase tracking-widest text-blue-300/60 mb-1.5 ml-1">Batch</label>
              <Input
                placeholder="e.g. 43"
                value={batchFilter}
                onChange={(e) => setBatchFilter(e.target.value)}
                className="w-24 h-10 rounded-xl bg-white/10 border-white/10 text-white placeholder:text-white/30 font-bold text-sm focus:bg-white/20"
              />
            </div>
            <div>
              <label className="block text-[9px] font-black uppercase tracking-widest text-blue-300/60 mb-1.5 ml-1">Section</label>
              <Input
                placeholder="e.g. B"
                value={sectionFilter}
                onChange={(e) => setSectionFilter(e.target.value)}
                className="w-24 h-10 rounded-xl bg-white/10 border-white/10 text-white placeholder:text-white/30 font-bold text-sm focus:bg-white/20"
              />
            </div>
            {/* Export Button */}
            <button
              onClick={handleExport}
              disabled={exporting || filtered.length === 0}
              className="flex items-center gap-2 h-10 px-4 bg-white/10 hover:bg-white/20 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-sm rounded-xl border border-white/10 transition-all"
            >
              {exporting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Download className="w-4 h-4" />
              )}
              <span className="hidden sm:inline">{exporting ? "Exporting…" : "Export PNG"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* ── Today Banner ───────────────────────────────────────────────────── */}
      {DAYS.includes(today) && (
        <div className="flex items-center gap-3 px-4 py-3 bg-blue-50 border border-blue-100 rounded-xl">
          <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
          <p className="text-sm font-bold text-blue-700">
            Today is <span className="font-black">{today}</span>
            {grid[today] && Object.values(grid[today]).flat().length > 0
              ? ` — ${Object.values(grid[today]).flat().length} class${Object.values(grid[today]).flat().length > 1 ? "es" : ""} scheduled`
              : " — No classes today"}
          </p>
        </div>
      )}

      {/* ── Mobile: Day Tabs + Single Day View ─────────────────────────────── */}
      <div className="block xl:hidden">
        {/* Day tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {DAYS.map((day, i) => {
            const count = Object.values(grid[day]).flat().length;
            const isToday = day === today;
            const isActive = day === activeDay;
            return (
              <button
                key={day}
                onClick={() => setSelectedDay(day)}
                className={`flex-shrink-0 flex flex-col items-center px-4 py-2.5 rounded-xl font-bold text-sm transition-all border
                  ${isActive
                    ? "bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-200"
                    : isToday
                    ? "bg-blue-50 text-blue-600 border-blue-200"
                    : "bg-white text-gray-500 border-gray-100 hover:border-blue-200 hover:text-blue-600"
                  }`}
              >
                <span className="text-[10px] font-black uppercase tracking-wider">{DAY_SHORT[i]}</span>
                <span className={`text-[9px] mt-0.5 font-bold ${isActive ? "text-blue-200" : "text-gray-400"}`}>
                  {count} cls
                </span>
              </button>
            );
          })}
        </div>

        {/* Single day schedule */}
        <div className="mt-4 space-y-3">
          {TIME_SLOTS.map((slot) => {
            const classes = grid[activeDay]?.[slot] || [];
            return (
              <div key={slot} className="flex gap-3">
                {/* Time label */}
                <div className="w-20 shrink-0 flex flex-col items-end justify-start pt-1">
                  <span className="text-[10px] font-black text-gray-400 leading-tight">{slot.split("-")[0]}</span>
                  <span className="text-[9px] text-gray-300">–{slot.split("-")[1]}</span>
                </div>
                {/* Classes */}
                <div className="flex-1 min-h-[60px]">
                  {classes.length === 0 ? (
                    <div className="h-full min-h-[56px] border border-dashed border-gray-100 rounded-xl flex items-center justify-center">
                      <span className="text-[10px] text-gray-300 font-medium">Free</span>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {classes.map((cls, idx) => {
                        const color = getCourseColor(cls.courseCode, colorMap);
                        return (
                          <div key={idx} className={`p-3 rounded-xl border ${color.bg} ${color.border}`}>
                            <div className="flex items-center justify-between mb-1">
                              <span className={`text-xs font-black ${color.text}`}>{cls.courseCode}</span>
                              <span className="text-[9px] font-bold text-gray-400 bg-white/70 px-2 py-0.5 rounded-full">
                                Sec {cls.section}
                              </span>
                            </div>
                            <div className="flex items-center gap-3 text-[10px] text-gray-500 font-medium">
                              <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {cls.room}</span>
                              <span className="flex items-center gap-1"><User className="w-3 h-3" /> {cls.teacher || "TBA"}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Desktop: Full Weekly Grid ───────────────────────────────────────── */}
      <div className="hidden xl:block">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          {/* Grid header — days */}
          <div className="grid border-b border-gray-100" style={{ gridTemplateColumns: "80px repeat(6, 1fr)" }}>
            <div className="p-4 bg-gray-50 border-r border-gray-100" />
            {DAYS.map((day, i) => {
              const isToday = day === today;
              const count = Object.values(grid[day]).flat().length;
              return (
                <div
                  key={day}
                  className={`p-4 text-center border-r border-gray-100 last:border-r-0 ${isToday ? "bg-blue-600" : "bg-gray-50"}`}
                >
                  <p className={`text-[10px] font-black uppercase tracking-widest ${isToday ? "text-blue-200" : "text-gray-400"}`}>
                    {DAY_SHORT[i]}
                  </p>
                  <p className={`text-sm font-black mt-0.5 ${isToday ? "text-white" : "text-gray-700"}`}>{day}</p>
                  <p className={`text-[9px] font-bold mt-1 ${isToday ? "text-blue-200" : "text-gray-400"}`}>
                    {count} class{count !== 1 ? "es" : ""}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Grid rows — time slots */}
          {TIME_SLOTS.map((slot, slotIdx) => (
            <div
              key={slot}
              className={`grid border-b border-gray-50 last:border-b-0 ${slotIdx % 2 === 0 ? "bg-white" : "bg-gray-50/30"}`}
              style={{ gridTemplateColumns: "80px repeat(6, 1fr)" }}
            >
              {/* Time label */}
              <div className="p-3 border-r border-gray-100 flex flex-col items-center justify-center bg-gray-50/50">
                <Clock className="w-3 h-3 text-gray-300 mb-1" />
                <span className="text-[9px] font-black text-gray-400 text-center leading-tight">
                  {slot.split("-")[0]}
                </span>
                <span className="text-[8px] text-gray-300 text-center">
                  {slot.split("-")[1]}
                </span>
              </div>

              {/* Day cells */}
              {DAYS.map((day) => {
                const classes = grid[day]?.[slot] || [];
                const isToday = day === today;
                return (
                  <div
                    key={day}
                    className={`p-2 border-r border-gray-100 last:border-r-0 min-h-[90px] ${isToday ? "bg-blue-50/20" : ""}`}
                  >
                    {classes.length === 0 ? (
                      <div className="h-full flex items-center justify-center">
                        <span className="text-[9px] text-gray-200">—</span>
                      </div>
                    ) : (
                      <div className="space-y-1.5 h-full">
                        {classes.map((cls, idx) => {
                          const color = getCourseColor(cls.courseCode, colorMap);
                          return (
                            <div
                              key={idx}
                              className={`p-2 rounded-lg border ${color.bg} ${color.border} group cursor-default`}
                            >
                              <div className="flex items-center gap-1.5 mb-1">
                                <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${color.dot}`} />
                                <span className={`text-[11px] font-black truncate ${color.text}`}>
                                  {cls.courseCode}
                                </span>
                              </div>
                              <div className="space-y-0.5">
                                <div className="flex items-center gap-1 text-[9px] text-gray-500">
                                  <MapPin className="w-2.5 h-2.5 shrink-0" />
                                  <span className="truncate">{cls.room}</span>
                                </div>
                                <div className="flex items-center gap-1 text-[9px] text-gray-500">
                                  <User className="w-2.5 h-2.5 shrink-0" />
                                  <span className="truncate">{cls.teacher || "TBA"}</span>
                                </div>
                                <div className="text-[8px] font-bold text-gray-400">
                                  Sec {cls.section} · Batch {cls.batch}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* ── Legend ─────────────────────────────────────────────────────────── */}
      {filtered.length > 0 && (
        <div className="flex flex-wrap gap-2 pt-2">
          {Array.from(new Set(filtered.map((e) => e.courseCode))).map((code) => {
            const color = getCourseColor(code, colorMap);
            return (
              <div key={code} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-bold ${color.bg} ${color.border} ${color.text}`}>
                <span className={`w-2 h-2 rounded-full ${color.dot}`} />
                {code}
              </div>
            );
          })}
        </div>
      )}

      {filtered.length === 0 && !loading && (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <Calendar className="w-12 h-12 text-gray-200" />
          <p className="text-gray-400 font-bold">No classes found for this filter.</p>
          <p className="text-gray-300 text-sm">Try changing your batch or section.</p>
        </div>
      )}

      {/* ── Hidden Export Canvas ────────────────────────────────────────────── */}
      {/* This div is rendered off-screen and captured as PNG on export */}
      <div className="fixed -left-[9999px] -top-[9999px] pointer-events-none" aria-hidden>
        <div
          ref={exportRef}
          style={{
            width: 1400,
            background: "#ffffff",
            fontFamily: "'Google Sans', 'Inter', sans-serif",
            padding: 0,
          }}
        >
          {/* Export Header */}
          <div style={{
            background: "linear-gradient(135deg, #1a73e8 0%, #4285f4 50%, #6366f1 100%)",
            padding: "32px 40px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}>
            <div>
              <div style={{ color: "rgba(255,255,255,0.7)", fontSize: 11, fontWeight: 800, letterSpacing: 3, textTransform: "uppercase", marginBottom: 6 }}>
                Spring 2026 · Class Routine
              </div>
              <div style={{ color: "#fff", fontSize: 28, fontWeight: 900, letterSpacing: -0.5 }}>
                {user?.department || "SWE"} Department
              </div>
              <div style={{ color: "rgba(255,255,255,0.75)", fontSize: 14, fontWeight: 600, marginTop: 4 }}>
                Batch {batchFilter || "All"} · Section {sectionFilter || "All"}
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 11, fontWeight: 700 }}>Generated by</div>
              <div style={{ color: "#fff", fontSize: 18, fontWeight: 900, letterSpacing: -0.5 }}>CoverGen</div>
              <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 10, marginTop: 2 }}>bornosoft-cover.vercel.app</div>
            </div>
          </div>

          {/* Grid */}
          <div style={{ padding: "0 0 32px 0" }}>
            {/* Day headers */}
            <div style={{ display: "grid", gridTemplateColumns: "90px repeat(6, 1fr)", borderBottom: "2px solid #e8eaed" }}>
              <div style={{ padding: "16px 12px", background: "#f8f9fa" }} />
              {DAYS.map((day, i) => {
                const count = Object.values(grid[day] || {}).flat().length;
                const isToday = day === today;
                return (
                  <div key={day} style={{
                    padding: "16px 12px",
                    textAlign: "center",
                    background: isToday ? "#1a73e8" : "#f8f9fa",
                    borderLeft: "1px solid #e8eaed",
                  }}>
                    <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: 2, textTransform: "uppercase", color: isToday ? "rgba(255,255,255,0.7)" : "#80868b" }}>
                      {DAY_SHORT[i]}
                    </div>
                    <div style={{ fontSize: 15, fontWeight: 900, color: isToday ? "#fff" : "#202124", marginTop: 2 }}>
                      {day}
                    </div>
                    <div style={{ fontSize: 10, fontWeight: 600, color: isToday ? "rgba(255,255,255,0.6)" : "#80868b", marginTop: 3 }}>
                      {count} class{count !== 1 ? "es" : ""}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Time slot rows */}
            {TIME_SLOTS.map((slot, slotIdx) => (
              <div key={slot} style={{
                display: "grid",
                gridTemplateColumns: "90px repeat(6, 1fr)",
                borderBottom: "1px solid #f1f3f4",
                background: slotIdx % 2 === 0 ? "#fff" : "#fafafa",
                minHeight: 100,
              }}>
                {/* Time */}
                <div style={{
                  padding: "12px 8px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRight: "1px solid #e8eaed",
                  background: "#f8f9fa",
                }}>
                  <div style={{ fontSize: 11, fontWeight: 800, color: "#5f6368", textAlign: "center" }}>
                    {slot.split("-")[0]}
                  </div>
                  <div style={{ fontSize: 9, color: "#9aa0a6", marginTop: 2 }}>
                    {slot.split("-")[1]}
                  </div>
                </div>

                {/* Day cells */}
                {DAYS.map((day) => {
                  const classes = grid[day]?.[slot] || [];
                  const isToday = day === today;
                  // Inline color map for export (Tailwind classes don't work in off-screen div)
                  const EXPORT_COLORS = [
                    { bg: "#e8f0fe", border: "#4285f4", text: "#1a73e8", dot: "#4285f4" },
                    { bg: "#f3e8fd", border: "#9c27b0", text: "#7b1fa2", dot: "#9c27b0" },
                    { bg: "#e6f4ea", border: "#34a853", text: "#1e8e3e", dot: "#34a853" },
                    { bg: "#fce8e6", border: "#ea4335", text: "#c5221f", dot: "#ea4335" },
                    { bg: "#fef7e0", border: "#fbbc04", text: "#e37400", dot: "#fbbc04" },
                    { bg: "#e4f7fb", border: "#00bcd4", text: "#0097a7", dot: "#00bcd4" },
                    { bg: "#fce4ec", border: "#e91e63", text: "#c2185b", dot: "#e91e63" },
                    { bg: "#e8eaf6", border: "#3f51b5", text: "#303f9f", dot: "#3f51b5" },
                  ];
                  return (
                    <div key={day} style={{
                      padding: 8,
                      borderLeft: "1px solid #e8eaed",
                      background: isToday ? "rgba(26,115,232,0.04)" : "transparent",
                    }}>
                      {classes.length === 0 ? (
                        <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <span style={{ fontSize: 10, color: "#dadce0" }}>—</span>
                        </div>
                      ) : (
                        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                          {classes.map((cls, idx) => {
                            const cIdx = (colorMap.get(cls.courseCode) ?? 0) % EXPORT_COLORS.length;
                            const c = EXPORT_COLORS[cIdx];
                            return (
                              <div key={idx} style={{
                                background: c.bg,
                                border: `1.5px solid ${c.border}`,
                                borderRadius: 8,
                                padding: "8px 10px",
                              }}>
                                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                                  <span style={{ width: 7, height: 7, borderRadius: "50%", background: c.dot, flexShrink: 0 }} />
                                  <span style={{ fontSize: 12, fontWeight: 900, color: c.text }}>{cls.courseCode}</span>
                                </div>
                                <div style={{ fontSize: 10, color: "#5f6368", marginBottom: 2 }}>📍 {cls.room}</div>
                                <div style={{ fontSize: 10, color: "#5f6368", marginBottom: 2 }}>👤 {cls.teacher || "TBA"}</div>
                                <div style={{ fontSize: 9, color: "#9aa0a6", fontWeight: 700 }}>
                                  Sec {cls.section} · Batch {cls.batch}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>

          {/* Footer */}
          <div style={{
            padding: "16px 40px",
            background: "#f8f9fa",
            borderTop: "1px solid #e8eaed",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}>
            {/* Legend */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {Array.from(new Set(filtered.map((e) => e.courseCode))).map((code) => {
                const EXPORT_COLORS = [
                  { bg: "#e8f0fe", border: "#4285f4", text: "#1a73e8", dot: "#4285f4" },
                  { bg: "#f3e8fd", border: "#9c27b0", text: "#7b1fa2", dot: "#9c27b0" },
                  { bg: "#e6f4ea", border: "#34a853", text: "#1e8e3e", dot: "#34a853" },
                  { bg: "#fce8e6", border: "#ea4335", text: "#c5221f", dot: "#ea4335" },
                  { bg: "#fef7e0", border: "#fbbc04", text: "#e37400", dot: "#fbbc04" },
                  { bg: "#e4f7fb", border: "#00bcd4", text: "#0097a7", dot: "#00bcd4" },
                  { bg: "#fce4ec", border: "#e91e63", text: "#c2185b", dot: "#e91e63" },
                  { bg: "#e8eaf6", border: "#3f51b5", text: "#303f9f", dot: "#3f51b5" },
                ];
                const cIdx = (colorMap.get(code) ?? 0) % EXPORT_COLORS.length;
                const c = EXPORT_COLORS[cIdx];
                return (
                  <div key={code} style={{
                    display: "flex", alignItems: "center", gap: 5,
                    padding: "4px 10px", borderRadius: 20,
                    background: c.bg, border: `1px solid ${c.border}`,
                    fontSize: 11, fontWeight: 700, color: c.text,
                  }}>
                    <span style={{ width: 6, height: 6, borderRadius: "50%", background: c.dot }} />
                    {code}
                  </div>
                );
              })}
            </div>
            <div style={{ fontSize: 10, color: "#9aa0a6", fontWeight: 600 }}>
              Generated {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
