"use client";

import { useEffect, useState } from "react";
import { useProtectedRoute } from "@/lib/use-protected-route";
import { useSearchParams } from "next/navigation";
import AssignmentForm from "@/components/assignment-form";
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

export default function StudentAssignmentPage() {
  const { loading } = useProtectedRoute("student");
  const searchParams = useSearchParams();
  const [courseInfo, setCourseInfo] = useState<{
    courseCode?: string;
    courseTitle?: string;
    teacherName?: string;
    teacherDesignation?: string;
  }>({});

  useEffect(() => {
    // Get course info from URL params
    const courseCode = searchParams.get("courseCode");
    const courseTitle = searchParams.get("courseTitle");
    const teacherName = searchParams.get("teacherName");
    const teacherDesignation = searchParams.get("teacherDesignation");

    setCourseInfo({
      courseCode: courseCode || undefined,
      courseTitle: courseTitle || undefined,
      teacherName: teacherName || undefined,
      teacherDesignation: teacherDesignation || undefined,
    });
  }, [searchParams]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Generate Assignment Cover</h1>
        <p className="text-gray-600 mt-2">
          Fill in the details below to generate your assignment cover page
        </p>
      </div>

      <Card className="p-6">
        <AssignmentForm
          prefilledData={{
            courseCode: courseInfo.courseCode,
            courseTitle: courseInfo.courseTitle,
            instructorName: courseInfo.teacherName,
            instructorDesignation: courseInfo.teacherDesignation,
          }}
        />
      </Card>
    </div>
  );
}
