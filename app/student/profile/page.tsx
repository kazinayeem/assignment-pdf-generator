"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/auth-store";
import { useProtectedRoute } from "@/lib/use-protected-route";
import { updateUserProfile, getAllDepartments } from "@/lib/firestore-service";
import type { DepartmentDoc } from "@/lib/types";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, UserCircle } from "lucide-react";
import toast from "react-hot-toast";

export default function StudentProfilePage() {
  const router = useRouter();
  const { loading } = useProtectedRoute("student");
  const { user: authUser, refreshUser } = useAuthStore();
  const [saving, setSaving] = useState(false);
  const [departments, setDepartments] = useState<DepartmentDoc[]>([]);

  // Form state — pre-filled from Firestore user doc
  const [name, setName] = useState("");
  const [studentId, setStudentId] = useState("");
  const [department, setDepartment] = useState("");
  const [batch, setBatch] = useState("");
  const [semester, setSemester] = useState("");
  const [section, setSection] = useState("");
  const [subSection, setSubSection] = useState("");

  useEffect(() => {
    getAllDepartments().then(setDepartments).catch(() => {});
  }, []);

  // Pre-fill form from the Firestore user doc (loaded via auth store)
  useEffect(() => {
    if (authUser) {
      setName(authUser.name || "");
      setStudentId(authUser.studentId || "");
      setDepartment(authUser.department || "");
      setBatch(authUser.batch || "");
      setSemester(authUser.semester || "");
      setSection(authUser.section || "");
      setSubSection(authUser.subSection || "");
    }
  }, [authUser]);

  const handleSave = async () => {
    if (!name.trim() || !studentId.trim()) {
      toast.error("Name and Student ID are required!");
      return;
    }
    if (!department) {
      toast.error("Please select your department!");
      return;
    }

    try {
      setSaving(true);
      // Save to Firestore
      await updateUserProfile(authUser!.uid, {
        name: name.trim(),
        studentId: studentId.trim(),
        department,
        batch: batch.trim(),
        semester: semester.trim(),
        section: section.trim(),
        subSection: subSection.trim(),
      });
      // Refresh Zustand store so all pages see updated data immediately
      await refreshUser();
      toast.success("Profile saved!");
      router.push("/student/mycourses");
    } catch (error) {
      toast.error("Failed to save profile");
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  if (loading || !authUser) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  const isProfileComplete = !!authUser.studentId && !!authUser.name && !!authUser.department;
  const inputCls =
    "w-full px-4 py-3 bg-gray-50 border border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-xl transition-all text-sm";

  return (
    <div className="max-w-3xl mx-auto py-8">
      {!isProfileComplete && (
        <div className="bg-amber-50 border-l-4 border-amber-500 p-4 mb-6 rounded-r-lg shadow-sm">
          <div className="flex items-center gap-3">
            <UserCircle className="h-5 w-5 text-amber-500 shrink-0" />
            <p className="text-sm text-amber-800 font-medium">
              Please complete your profile — Student ID and Department are required to use all features.
            </p>
          </div>
        </div>
      )}

      <Card className="overflow-hidden border-0 shadow-lg rounded-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-8 sm:p-10 text-white">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
              <UserCircle className="h-10 w-10 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Your Profile</h1>
              <p className="text-blue-100 mt-1 opacity-90">
                Saved data auto-fills your assignments and lab reports
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 sm:p-10 space-y-8 bg-white">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

            {/* Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                className={inputCls}
              />
            </div>

            {/* Student ID */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Student ID <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                placeholder="e.g. 211-15-1444"
                className={inputCls}
              />
            </div>

            {/* Department */}
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Department <span className="text-red-500">*</span>
              </label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className={inputCls}
              >
                <option value="">-- Select Department --</option>
                {departments.map((d) => (
                  <option key={d.id} value={d.code}>
                    {d.code} — {d.name}
                  </option>
                ))}
                {departments.length === 0 && (
                  <>
                    <option value="SWE">SWE — Software Engineering</option>
                    <option value="CSE">CSE — Computer Science & Engineering</option>
                    <option value="EEE">EEE — Electrical & Electronic Engineering</option>
                    <option value="BBA">BBA — Business Administration</option>
                  </>
                )}
              </select>
              {department && (
                <p className="text-xs text-blue-600 mt-1.5">
                  ✓ My Courses will show only <strong>{department}</strong> courses & teachers
                </p>
              )}
            </div>

            {/* Batch */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Batch</label>
              <select value={batch} onChange={(e) => setBatch(e.target.value)} className={inputCls}>
                <option value="">Select Batch</option>
                {[...Array(38)].map((_, i) => (
                  <option key={i} value={(37 + i).toString()}>
                    Batch {37 + i}
                  </option>
                ))}
              </select>
            </div>

            {/* Semester */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Semester</label>
              <select value={semester} onChange={(e) => setSemester(e.target.value)} className={inputCls}>
                <option value="">Select Semester</option>
                {Array.from({ length: 7 }, (_, i) => 2024 + i).flatMap((year) => [
                  <option key={`Spring ${year}`} value={`Spring ${year}`}>
                    Spring {year}
                  </option>,
                  <option key={`Summer ${year}`} value={`Summer ${year}`}>
                    Summer {year}
                  </option>,
                  <option key={`Fall ${year}`} value={`Fall ${year}`}>
                    Fall {year}
                  </option>,
                ])}
              </select>
            </div>

            {/* Section */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Section</label>
              <input
                type="text"
                value={section}
                onChange={(e) => setSection(e.target.value)}
                placeholder="e.g. A, B, 42B2"
                className={inputCls}
              />
            </div>

            {/* Lab Sub-section */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Lab Sub-section
              </label>
              <input
                type="text"
                value={subSection}
                onChange={(e) => setSubSection(e.target.value)}
                placeholder="e.g. A1, A2, B1, B2"
                className={inputCls}
              />
              <p className="text-xs text-gray-500 mt-1.5">Required for lab reports.</p>
            </div>
          </div>

          <div className="pt-6 border-t border-gray-100 flex justify-end">
            <Button
              size="lg"
              onClick={handleSave}
              disabled={saving}
              className="bg-blue-600 hover:bg-blue-700 text-white shadow-md w-full sm:w-auto rounded-xl px-8"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Profile"
              )}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
