"use client";

import { Suspense } from "react";
import { useProtectedRoute } from "@/lib/use-protected-route";
import { useSearchParams } from "next/navigation";
import LabReportForm from "@/components/lab-report-form";

function LabReportContent() {
  const { loading } = useProtectedRoute("student");
  const searchParams = useSearchParams();

  if (loading) return null;

  const prefilledData = {
    courseCode: searchParams.get("courseCode") || undefined,
    courseTitle: searchParams.get("courseTitle") || undefined,
    instructorName: searchParams.get("teacherName") || undefined,
    instructorDesignation: searchParams.get("teacherDesignation") || undefined,
  };

  return <LabReportForm prefilledData={prefilledData} />;
}

export default function StudentLabReportPage() {
  return (
    <Suspense fallback={null}>
      <LabReportContent />
    </Suspense>
  );
}
