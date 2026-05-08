"use client";

import { Suspense } from "react";
import { useProtectedRoute } from "@/lib/use-protected-route";
import { useSearchParams } from "next/navigation";
import LabPerformanceForm from "@/components/lab-performance-form";

function LabPerformanceContent() {
  const { loading } = useProtectedRoute("student");
  const searchParams = useSearchParams();

  if (loading) return null;

  const prefilledData = {
    courseCode: searchParams.get("courseCode") || undefined,
    courseTitle: searchParams.get("courseTitle") || undefined,
    instructorName: searchParams.get("teacherName") || undefined,
    instructorDesignation: searchParams.get("teacherDesignation") || undefined,
  };

  return <LabPerformanceForm prefilledData={prefilledData} />;
}

export default function StudentLabPerformancePage() {
  return (
    <Suspense fallback={null}>
      <LabPerformanceContent />
    </Suspense>
  );
}
