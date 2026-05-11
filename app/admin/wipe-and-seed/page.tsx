"use client";

import { useState } from "react";
import { useProtectedRoute } from "@/lib/use-protected-route";
import {
  deleteAllTeachers,
  deleteAllDepartments,
  batchImportDepartments,
  batchImportTeachers,
} from "@/lib/firestore-service";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import DATA from "@/lib/diu_all_teachers.json";

export default function WipeAndSeedPage() {
  const { loading } = useProtectedRoute("super-admin");
  const [running, setRunning] = useState(false);

  const handleWipeAndSeed = async () => {
    if (!confirm("This will DELETE all departments and teachers and re-seed from dataset. Proceed?")) return;
    setRunning(true);

    try {
      toast.loading("Deleting all teachers...");
      const deletedTeachers = await deleteAllTeachers();
      toast.dismiss();
      toast.success(`Deleted ${deletedTeachers} teachers`);

      toast.loading("Deleting all departments...");
      const deletedDepts = await deleteAllDepartments();
      toast.dismiss();
      toast.success(`Deleted ${deletedDepts} departments`);

      // Build departments list from dataset
      const teachers: any[] = DATA as any[];
      const deptSet = new Set<string>();
      for (const t of teachers) {
        const dept = (t.department || t.dep || t.department_name || "").trim();
        if (dept) deptSet.add(dept);
      }

      const departments = Array.from(deptSet).map((name) => ({
        name,
        code: name.toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 30),
      }));

      toast.loading("Seeding departments...");
      const deptResult = await batchImportDepartments(departments as any);
      toast.dismiss();
      toast.success(`Departments: ${deptResult.success} added, ${deptResult.failed} skipped`);

      // Prepare teachers for batch import
      const teachersToImport = teachers.map((t: any) => ({
        name: t.name,
        initial: t.initial || "",
        designation: t.designation || t.position || "Faculty",
        department: t.department || t.dep || "",
        email: t.email || null,
        phone: t.phone || null,
        room: t.room || null,
        profile_url: t.profile_url || t.profile || null,
        image_url: t.image_url || null,
        approved: true,
      }));

      toast.loading("Seeding teachers (this may take a while)...");
      const teacherResult = await batchImportTeachers(teachersToImport as any);
      toast.dismiss();
      toast.success(`Teachers: ${teacherResult.success} added, ${teacherResult.failed} skipped`);

    } catch (error) {
      console.error("Wipe & seed error:", error);
      toast.error("Wipe & Seed failed — check console");
    } finally {
      setRunning(false);
    }
  };

  if (loading) return null;

  return (
    <div className="max-w-2xl mx-auto py-16 px-4 text-center space-y-6">
      <h1 className="text-2xl font-bold">Wipe & Seed All</h1>
      <p className="text-gray-500">Deletes all existing departments and teachers, then re-seeds from the dataset.</p>
      <div className="space-x-4">
        <Button onClick={handleWipeAndSeed} disabled={running} variant="destructive">
          {running ? "Running…" : "⚠️ Wipe & Seed All"}
        </Button>
      </div>
    </div>
  );
}
