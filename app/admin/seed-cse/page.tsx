"use client";
import { useState } from "react";
import { useProtectedRoute } from "@/lib/use-protected-route";
import { batchImportTeachers } from "@/lib/firestore-service";
import { Loader2, CheckCircle } from "lucide-react";
import toast from "react-hot-toast";
import CSE_TEACHERS from "@/app/data/cse-teachers.json";

export default function SeedCseTeachersPage() {
  const { loading } = useProtectedRoute("super-admin");
  const [seeding, setSeeding] = useState(false);
  const [done, setDone] = useState(false);
  const [progress, setProgress] = useState(0);
  const total = CSE_TEACHERS.length;

  const handleSeed = async () => {
    if (!confirm(`This will add ${total} CSE teachers to Firestore. Continue?`)) return;
    setSeeding(true);
    setProgress(0);

    try {
      const toImport = CSE_TEACHERS.map((t: any) => ({
        name: t.name,
        initial: t.initial || "",
        designation: t.designation || "Lecturer",
        department: "CSE",
        email: t.email || null,
        phone: t.phone || null,
        room: t.room || null,
        profile_url: t.profile_url || null,
        image_url: t.image_url || null,
        approved: true,
      }));

      const result = await batchImportTeachers(toImport as any);
      setProgress(total);
      toast.success(`Seed complete — ${result.success} added, ${result.failed} skipped`);
      setDone(true);
    } catch (err) {
      console.error("Seed error:", err);
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
      <h1 className="text-2xl font-bold text-gray-900">Seed CSE Teachers</h1>
      <p className="text-gray-500">
        This will insert <strong>{total}</strong> CSE department teachers into Firebase with <code>approved: true</code>.
        Already-existing teachers will be skipped if errors occur.
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
      {done && <p className="text-green-600 font-semibold">✅ Done! All {total} teachers seeded.</p>}
      {!done && (
        <button
          onClick={handleSeed}
          disabled={seeding}
          className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-md disabled:opacity-60 transition"
        >
          {seeding ? <><Loader2 className="w-4 h-4 animate-spin" /> Seeding…</> : "🚀 Seed All CSE Teachers"}
        </button>
      )}
    </div>
  );
}
