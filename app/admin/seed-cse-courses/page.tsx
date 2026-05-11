"use client";

import { useState } from "react";
import { useProtectedRoute } from "@/lib/use-protected-route";
import { batchImportCourses } from "@/lib/firestore-service";
import { Loader2, CheckCircle } from "lucide-react";
import toast from "react-hot-toast";
import CSE_COURSES from "@/app/data/cse-courses.json";

export default function SeedCseCoursesPage() {
  const { loading } = useProtectedRoute("super-admin");
  const [seeding, setSeeding] = useState(false);
  const [done, setDone] = useState(false);
  const [progress, setProgress] = useState(0);
  const total = CSE_COURSES.length;

  const handleSeed = async () => {
    if (!confirm(`This will add ${total} CSE courses to Firestore. Continue?`)) return;
    setSeeding(true);
    setProgress(0);

    try {
      const toImport = (CSE_COURSES as any[]).map((c: any) => ({
        courseCode: c.courseCode,
        courseTitle: c.courseTitle,
        credit: c.credit || 3,
        category: c.category || "General",
        department: c.department || "CSE",
        teacherId: null,
        teacherName: null,
        semester: null,
        prerequisite: null,
        theory_credit: c.credit || 3,
        lab_credit: null,
      }));

      const result = await batchImportCourses(toImport as any);
      setProgress(total);
      toast.success(`Courses: ${result.success} added, ${result.failed} skipped`);
      setDone(true);
    } catch (err) {
      console.error("Course seed error:", err);
      toast.error("Seeding failed — check console for details.");
    } finally {
      setSeeding(false);
    }
  };

  if (loading) return null;

  return (
    <div className="max-w-lg mx-auto py-16 px-4 text-center space-y-6">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-50 mb-2">
        {done ? <CheckCircle className="w-8 h-8 text-green-500" /> : <Loader2 className={`w-8 h-8 text-blue-600 ${seeding ? "animate-spin" : ""}`} />}
      </div>
      <h1 className="text-2xl font-bold text-gray-900">Seed CSE Courses</h1>
      <p className="text-gray-500">
        This will insert <strong>{total}</strong> CSE courses into Firestore across all specialization categories.
        Already-existing courses will be skipped if errors occur.
      </p>
      {seeding && (
        <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
          <div
            className="bg-blue-600 h-3 rounded-full transition-all duration-200"
            style={{ width: `${(progress / total) * 100}%` }}
          />
        </div>
      )}
      {seeding && <p className="text-sm text-gray-500">{progress} / {total} seeded…</p>}
      {done && <p className="text-green-600 font-semibold">✅ Done! All {total} courses seeded.</p>}
      {!done && (
        <button
          onClick={handleSeed}
          disabled={seeding}
          className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-md disabled:opacity-60 transition"
        >
          {seeding ? <><Loader2 className="w-4 h-4 animate-spin" /> Seeding…</> : "🚀 Seed All CSE Courses"}
        </button>
      )}
    </div>
  );
}
