"use client";

import { useProtectedRoute } from "@/lib/use-protected-route";
import { useSearchParams } from "next/navigation";
import LabReportForm from "@/components/lab-report-form";

export default function StudentLabReportPage() {
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
