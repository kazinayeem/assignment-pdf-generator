"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import NextImage from "next/image";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import dynamic from "next/dynamic";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const BarChart = dynamic(
  () => import("react-chartjs-2").then((mod) => mod.Bar),
  {
    ssr: false,
  }
);

type Semester = {
  semesterId: string;
  semesterName: string;
  semesterYear: number;
};

type Result = {
  courseTitle: string;
  customCourseId: string;
  gradeLetter: string;
  pointEquivalent: number;
  totalCredit: number;
  semesterId: string;
};

type StudentInfo = {
  studentId: string;
  fkCampus: string;
  campusName: string;
  studentName: string;
  batchId: string;
  batchNo: number;
  programCredit: number;
  programId: string;
  programName: string;
  progShortName: string;
  programType: string;
  deptShortName: string;
  departmentName: string;
  facultyName: string;
  facShortName: string;
  semesterId: string;
  semesterName: string;
  shift: string;
};

export default function ResultPage() {
  const [studentId, setStudentId] = useState<string>("");
  const [studentInfo, setStudentInfo] = useState<StudentInfo | null>(null);
  const [semesters, setSemesters] = useState<Semester[]>([]);
  const [allResults, setAllResults] = useState<{ [key: string]: Result[] }>({});
  const [loadingStudentInfo, setLoadingStudentInfo] = useState(false);
  const [loadingResults, setLoadingResults] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);

  const stopSemesterId = 20253;
  const [startSemesterId, setStartSemesterId] = useState<number | null>(null);

  // Fetch semesters (once on mount)
  useEffect(() => {
    axios
      .get("/api/semester-list")
      .then((res) => setSemesters(res.data))
      .catch(() => setSemesters([]));
  }, []);

  // Fetch student info on button click
  const fetchStudentInfo = async () => {
    if (!studentId.trim()) return;
    setLoadingStudentInfo(true);
    setStudentInfo(null);
    setAllResults({});
    setStartSemesterId(null);
    try {
      const res = await axios.get(`/api/student-info?studentId=${studentId}`);
      const info: StudentInfo = res.data;
      setStudentInfo(info);

      setStartSemesterId(parseInt(info.semesterId));
    } catch {
      alert("Student info not found or error occurred.");
    } finally {
      setLoadingStudentInfo(false);
    }
  };

  // Fetch all results on button click (only if studentInfo present)
  const fetchAllResults = async () => {
    if (!studentInfo || !startSemesterId) return;
    setLoadingResults(true);
    setAllResults({});

    const filteredSemesters = semesters.filter(
      (s) =>
        parseInt(s.semesterId) >= startSemesterId &&
        parseInt(s.semesterId) <= stopSemesterId
    );

    const resultsBySemester: { [key: string]: Result[] } = {};

    try {
      await Promise.all(
        filteredSemesters.map(async (semester) => {
          try {
            const { data } = await axios.get(
              `/api/result-by-semester?semesterId=${semester.semesterId}&studentId=${studentId}`
            );
            if (data.length > 0) {
              resultsBySemester[
                `${semester.semesterName} ${semester.semesterYear}`
              ] = data;
            }
          } catch {
            alert("error");
          }
        })
      );

      setAllResults(resultsBySemester);
    } catch {
      alert("Error fetching results.");
    } finally {
      setLoadingResults(false);
    }
  };

  // Calculate GPA helpers
  const calculateSemesterGPA = (courses: Result[]) => {
    const totalCredit = courses.reduce((sum, r) => sum + r.totalCredit, 0);
    const totalPoints = courses.reduce(
      (sum, r) => sum + r.totalCredit * r.pointEquivalent,
      0
    );
    return totalCredit ? (totalPoints / totalCredit).toFixed(2) : "0.00";
  };
  const calculateTotalCredit = (courses: Result[]) => {
    return courses.reduce((sum, r) => sum + r.totalCredit, 0);
  };

  const calculateTotalCGPA = (results: { [key: string]: Result[] }) => {
    let totalCredits = 0;
    let totalPoints = 0;
    for (const courses of Object.values(results)) {
      for (const r of courses) {
        totalCredits += r.totalCredit;
        totalPoints += r.totalCredit * r.pointEquivalent;
      }
    }
    return totalCredits ? (totalPoints / totalCredits).toFixed(2) : "0.00";
  };

  // PDF generation (same as before)
  const generatePDF = async () => {
    if (Object.keys(allResults).length === 0) return;
    if (!studentInfo) return;

    setPdfLoading(true);

    try {
      const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const pageWidth = doc.internal.pageSize.getWidth();
      const imgWidth = 90;
      const imgHeight = 25;
      const imgX = (pageWidth - imgWidth) / 2;

      // Load logo image
      const imgData = await getBase64ImageFromURL("/diulogoside.png");
      doc.addImage(imgData, "PNG", imgX, 15, imgWidth, imgHeight);

      // University info
      doc.setFontSize(16);
      doc.setFont("helvetica", "bold");
      doc.text("Daffodil International University", pageWidth / 2, 50, {
        align: "center",
      });

      doc.setFontSize(12);
      doc.setFont("helvetica", "normal");
      doc.text("Unofficial Transcript", pageWidth / 2, 58, { align: "center" });

      // Student info block
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");

      const infoStartY = 65;
      const leftX = 14;
      const rightX = pageWidth / 2 + 10;

      doc.text(`Student ID: ${studentInfo.studentId}`, leftX, infoStartY);
      doc.text(`Name: ${studentInfo.studentName}`, leftX, infoStartY + 7);
      doc.text(`Program: ${studentInfo.programName}`, leftX, infoStartY + 14);
      doc.text(
        `Department: ${studentInfo.departmentName}`,
        leftX,
        infoStartY + 21
      );
      doc.text(`Faculty: ${studentInfo.facultyName}`, leftX, infoStartY + 28);
      doc.text(`Campus: ${studentInfo.campusName}`, leftX, infoStartY + 35);
      // doc.text(`Batch: ${studentInfo.batchId}`, leftX, infoStartY + 42);
      doc.text(`Shift: ${studentInfo.shift}`, leftX, infoStartY + 42);

      doc.text(
        `Generated: ${new Date().toLocaleDateString()}`,
        rightX,
        infoStartY,
        { align: "left" }
      );

      let y = infoStartY + 50;

      // Add semester tables
      Object.entries(allResults).forEach(([semesterLabel, courses]) => {
        // Semester header
        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        doc.text(semesterLabel, leftX, y);
        y += 6;

        const semesterGPA = calculateSemesterGPA(courses);

        autoTable(doc, {
          startY: y,
          head: [["Code", "Course Title", "Grade", "Points", "Credits"]],
          body: courses.map((c) => [
            c.customCourseId,
            c.courseTitle,
            c.gradeLetter,
            c.pointEquivalent.toFixed(2),
            c.totalCredit.toString(),
          ]),
          theme: "grid",
          styles: {
            fontSize: 8,
            cellPadding: 2,
            overflow: "linebreak",
          },
          headStyles: {
            fillColor: [59, 130, 246],
            textColor: 255,
            fontStyle: "bold",
          },
          margin: { left: leftX, right: 14 },
          didDrawPage: (data) => {
            if (data.cursor) {
              y = data.cursor.y + 5;
            }
          },
        });

        doc.setFontSize(10);
        doc.setFont("helvetica", "bold");
        doc.text(`Semester GPA: ${semesterGPA}`, pageWidth - 14, y, {
          align: "right",
        });
        y += 12;
      });

      const totalCGPA = calculateTotalCGPA(allResults);

      // Footer CGPA
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text(`Cumulative GPA (CGPA): ${totalCGPA}`, pageWidth / 2, y + 10, {
        align: "center",
      });

      // Page border
      doc.setDrawColor(200, 200, 200);
      doc.rect(5, 5, pageWidth - 10, doc.internal.pageSize.getHeight() - 10);

      doc.save(`Transcript_${studentInfo.studentId}.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
    } finally {
      setPdfLoading(false);
    }
  };

  // Prepare data for chart
  const semesterLabels = Object.keys(allResults);
  const semesterGPAs = semesterLabels.map((label) => {
    const data = allResults[label] || [];
    const totalCredit = data.reduce((sum, r) => sum + r.totalCredit, 0);
    const totalPoints = data.reduce(
      (sum, r) => sum + r.totalCredit * r.pointEquivalent,
      0
    );
    return totalCredit ? parseFloat((totalPoints / totalCredit).toFixed(2)) : 0;
  });

  const totalGPA = calculateTotalCGPA(allResults);

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6 space-y-6">
      <Link
        href="/"
        className="inline-block px-5 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition"
      >
        Go Home Page
      </Link>
      <div className="flex flex-col items-center gap-4">
        <NextImage
          src="/diulogoside.png"
          alt="DIU Logo"
          width={100}
          height={40}
          className="w-auto h-12"
        />

        <div className="w-full max-w-md space-y-4">
          <Input
            type="text"
            placeholder="Enter Student ID (e.g. 000-00-000)"
            className="w-full"
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
            disabled={loadingStudentInfo || loadingResults}
          />

          <Button
            onClick={fetchStudentInfo}
            disabled={!studentId.trim() || loadingStudentInfo || loadingResults}
            className="w-full"
          >
            {loadingStudentInfo
              ? "Loading Student Info..."
              : "Get Student Info"}
          </Button>

          {studentInfo && (
            <Button
              onClick={fetchAllResults}
              disabled={loadingResults}
              className="w-full"
            >
              {loadingResults ? "Loading Results..." : "Get All Results"}
            </Button>
          )}

          {Object.keys(allResults).length > 0 && (
            <Button
              onClick={generatePDF}
              disabled={pdfLoading}
              variant="outline"
              className="w-full"
            >
              {pdfLoading ? "Generating PDF..." : "Generate PDF"}
            </Button>
          )}
        </div>
      </div>

      {/* Show Student Info */}
      {studentInfo && (
        <Card className="max-w-md mx-auto p-4">
          <CardContent>
            <h2 className="text-lg font-semibold mb-3">Student Information</h2>
            <p>
              <strong>Name:</strong> {studentInfo.studentName}
            </p>
            <p>
              <strong>Student ID:</strong> {studentInfo.studentId}
            </p>
            <p>
              <strong>Program:</strong> {studentInfo.programName} (
              {studentInfo.progShortName})
            </p>
            <p>
              <strong>Department:</strong> {studentInfo.departmentName}
            </p>
            <p>
              <strong>Faculty:</strong> {studentInfo.facultyName}
            </p>
            <p>
              <strong>Batch:</strong> {studentInfo.batchId} (No:{" "}
              {studentInfo.batchNo})
            </p>
            <p>
              <strong>Campus:</strong> {studentInfo.campusName}
            </p>
            <p>
              <strong>Shift:</strong> {studentInfo.shift}
            </p>
            <p>
              <strong>Semester:</strong> {studentInfo.semesterName}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Show Total CGPA */}
      {Object.keys(allResults).length > 0 && !loadingResults && (
        <Card className="max-w-4xl mx-auto p-4 mt-6 text-center">
          <CardContent>
            <h3 className="text-xl font-bold mb-2">Cumulative GPA</h3>
            <p className="text-3xl font-extrabold text-blue-600">{totalGPA}</p>
          </CardContent>
        </Card>
      )}

      {/* Show GPA chart */}
      {Object.keys(allResults).length > 0 && !loadingResults && (
        <div className="max-w-4xl mx-auto p-4">
          <BarChart
            data={{
              labels: semesterLabels,
              datasets: [
                {
                  label: "GPA",
                  data: semesterGPAs,
                  backgroundColor: "rgba(59, 130, 246, 0.7)",
                  borderColor: "rgba(59, 130, 246, 1)",
                  borderWidth: 1,
                  borderRadius: 4,
                },
              ],
            }}
            options={{
              responsive: true,
              scales: {
                y: {
                  beginAtZero: true,
                  max: 4,
                },
              },
            }}
          />
        </div>
      )}

      {/* Show semester results tables */}
      {loadingResults && (
        <div className="max-w-4xl mx-auto space-y-4">
          {[...Array(3)].map((_, i) => (
            <Skeleton
              key={i}
              className="w-full h-12 rounded-md border border-gray-200"
            />
          ))}
        </div>
      )}

      {!loadingResults &&
        Object.entries(allResults).map(([semesterLabel, courses]) => (
          <Card key={semesterLabel} className="max-w-4xl mx-auto p-4">
            <CardContent>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">{semesterLabel}</h3>
                <Badge variant="secondary">
                  Credit : {calculateTotalCredit(courses)}
                </Badge>
                <Badge variant="secondary">
                  GPA: {calculateSemesterGPA(courses)}
                </Badge>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Code</TableHead>
                    <TableHead>Course Title</TableHead>
                    <TableHead>Grade</TableHead>
                    <TableHead>Points</TableHead>
                    <TableHead>Credits</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {courses.map((course) => (
                    <TableRow key={course.customCourseId}>
                      <TableCell>{course.customCourseId}</TableCell>
                      <TableCell>{course.courseTitle}</TableCell>
                      <TableCell
                        className={
                          course.pointEquivalent < 2
                            ? "text-red-600 font-semibold"
                            : course.pointEquivalent < 2.5
                            ? "text-rose-500 font-medium"
                            : course.pointEquivalent < 3
                            ? "text-orange-500 font-medium"
                            : course.pointEquivalent < 3.25
                            ? "text-yellow-600 font-medium"
                            : course.pointEquivalent < 3.5
                            ? "text-amber-600 font-medium"
                            : course.pointEquivalent < 4
                            ? "text-lime-600 font-medium"
                            : "text-green-600 font-semibold"
                        }
                      >
                        {course.gradeLetter}
                      </TableCell>
                      <TableCell
                        className={
                          course.pointEquivalent < 2
                            ? "text-red-600 font-semibold"
                            : course.pointEquivalent < 2.5
                            ? "text-rose-500 font-medium"
                            : course.pointEquivalent < 3
                            ? "text-orange-500 font-medium"
                            : course.pointEquivalent < 3.25
                            ? "text-yellow-600 font-medium"
                            : course.pointEquivalent < 3.5
                            ? "text-amber-600 font-medium"
                            : course.pointEquivalent < 4
                            ? "text-lime-600 font-medium"
                            : "text-green-600 font-semibold"
                        }
                      >
                        {course.pointEquivalent.toFixed(2)}
                      </TableCell>

                      <TableCell>{course.totalCredit}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        ))}
    </div>
  );
}

async function getBase64ImageFromURL(url: string): Promise<string> {
  const res = await fetch(url);
  const blob = await res.blob();

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      resolve(reader.result as string);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}
