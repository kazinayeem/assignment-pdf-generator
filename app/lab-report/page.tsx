"use client";

import { useState, ChangeEvent } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { courseData } from "@/app/data"; // Assuming courseData is relevant for lab courses as well
import autoTable from "jspdf-autotable";
import jsPDF from "jspdf";
import "jspdf-autotable";

type Course = {
  code: string;
  title: string;
  credit: string;
  section: string;
  teacher: string;
};

type FormData = {
  courseCode: string;
  courseTitle: string;
  section: string;
  projectTitle: string; // Changed from topic to projectTitle
  teacherName: string;
  teacherDesignation: string;
  department: string; // Added department as it's common for lab reports
  studentName: string;
  studentId: string;
  submissionDate: string;
  batch: string;
  semester: string;
  groupNo: string; // Added group number for lab reports
};

export default function LabReportForm() {
  const [formData, setFormData] = useState<FormData>({
    courseCode: "",
    courseTitle: "",
    section: "",
    projectTitle: "", // Initialize with an empty string
    teacherName: "",
    teacherDesignation: "",
    department: "",
    studentName: "",
    studentId: "",
    submissionDate: "",
    batch: "",
    semester: "",
    groupNo: "",
  });

  const [courseList] = useState<Course[]>(courseData);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCourseChange = (value: string) => {
    const course = courseList.find((c) => c.code === value);
    if (course) {
      setFormData((prev) => ({
        ...prev,
        courseCode: course.code,
        courseTitle: course.title,
        section: course.section,
        teacherName: course.teacher,
      }));
    }
  };

  const generatePDF = () => {
    const doc = new jsPDF("p", "mm", "a4") as jsPDF & {
      lastAutoTable?: { finalY: number };
    };

    let y = 15;

    const logo = new Image();
    logo.src = "./diulogoside.png"; // Make sure this path is correct for your logo

    logo.onload = () => {
      doc.addImage(logo, "PNG", 60, y, 90, 25); // Daffodil International University logo [cite: 1]
      y += 30;

      doc.setFont("times", "bold");
      doc.setFontSize(16);
      // Dynamically display the project title
      doc.text("Project Report", 105, y, {
        align: "center",
      });
      y += 8;

      doc.text(formData.projectTitle, 105, y, {
        align: "center",
      });
      y += 8;

      // === Teacher Evaluation Table ===
      doc.setFontSize(11);
      autoTable(doc, {
        startY: y,
        head: [
          [
            {
              content: "Only for course Teacher", // "Only for course Teacher" [cite: 1]
              colSpan: 6,
              styles: {
                halign: "center",
                fontStyle: "bold",
                fontSize: 11,
              },
            },
          ],
          [
            { content: "" },
            { content: "Needs Improvement" }, // "Needs Improvement" [cite: 2]
            { content: "Developing" }, // "Developing" [cite: 2]
            { content: "Sufficient" }, // "Sufficient" [cite: 2]
            { content: "Above Average" }, // "Above Average" [cite: 2]
            { content: "Total Mark" }, // "Total Mark" [cite: 2]
          ],
          ["Allocate mark & Percentage", "25%", "50%", "75%", "100%", "25"], // Allocate mark & Percentage, 25%, 50%, 75%, 100%, 25 [cite: 2]
        ],
        body: [
          ["Understanding", "", "", "", "", "3"], // Understanding, 3 [cite: 2]
          ["Analysis", "", "", "", "", "4"], // Analysis, 4 [cite: 2]
          ["Implementation", "", "", "", "", "8"], // Implementation, 8 [cite: 2]
          ["Report Writing", "", "", "", "", "10"], // Report Writing, 10 [cite: 2]
          [
            {
              content: "Total obtained mark", // Total obtained mark [cite: 2]
              colSpan: 5,
              styles: {
                halign: "left",
                fontStyle: "bold",
              },
            },
            "",
          ],
        ],
        theme: "grid",
        styles: {
          fontSize: 10,
          valign: "middle",
          halign: "center",
          cellPadding: 2,
          textColor: 0,
          lineColor: 0,
          lineWidth: 0.1,
        },
        headStyles: {
          fillColor: false,
          textColor: 0,
          fontStyle: "bold",
        },
      });

      y = (doc as any).lastAutoTable.finalY + 5;

      doc.setFont("times", "bold");
      doc.setFontSize(11);
      doc.text("Comments", 12, y + 5); // Comments [cite: 3]
      doc.rect(12, y + 8, 186, 30);
      y += 45;

      const formattedDate = formData.submissionDate
        ? formData.submissionDate.split("-").reverse().join(" / ")
        : "";

      doc.setFontSize(13);
      doc.setFont("times", "bold");
      doc.text("Student Information", 12, y);
      y += 8;

      doc.setFont("times", "bold");
      doc.text("Semester:", 12, y); // Semester: Fall ......... [cite: 3]
      doc.setFont("times", "normal");
      doc.text(`${formData.semester}`, 45, y);
      y += 7;

      if (formData.groupNo) {
        // Group No.- [cite: 3]
        doc.setFont("times", "bold");
        doc.text("Group No.:", 12, y);
        doc.setFont("times", "normal");
        doc.text(`${formData.groupNo}`, 45, y);
        y += 7;
      }

      doc.setFont("times", "bold");
      doc.text("Student Name(s):", 12, y); // Names: [cite: 3]
      doc.setFont("times", "normal");
      // Adjusted x-coordinate for better spacing
      doc.text(`${formData.studentName}`, 60, y);
      y += 7;

      doc.setFont("times", "bold");
      doc.text("Student ID(s):", 12, y); // IDs: [cite: 3]
      doc.setFont("times", "normal");
      doc.text(`${formData.studentId}`, 45, y);
      y += 7;

      doc.setFont("times", "bold");
      doc.text("Batch:", 12, y); // Batch: [cite: 3]
      doc.setFont("times", "normal");
      doc.text(`${formData.batch}`, 45, y);
      doc.setFont("times", "bold");
      doc.text("Section:", 100, y); // Section: [cite: 3]
      doc.setFont("times", "normal");
      doc.text(`${formData.section}`, 125, y);
      y += 12;

      // === Teacher Info Section ===
      doc.setFont("times", "bold");
      doc.text("Course Teacher Information", 12, y);
      y += 8;

      doc.setFont("times", "bold");
      doc.text("Course Code:", 12, y); // Course Code: [cite: 3]
      doc.setFont("times", "normal");
      doc.text(`${formData.courseCode}`, 45, y);
      doc.setFont("times", "bold");
      doc.text("Course Name:", 100, y); // Course Name: [cite: 3]
      doc.setFont("times", "normal");
      const maxWidthCourseName = 60;
      const courseNameLines = doc.splitTextToSize(
        formData.courseTitle,
        maxWidthCourseName
      );
      doc.text(courseNameLines, 140, y);
      y += 7;

      doc.setFont("times", "bold");
      doc.text("Course Teacher Name:", 12, y); // Course Teacher Name: [cite: 3]
      doc.setFont("times", "normal");
      // Adjusted x-coordinate and increased maxWidthTeacherName for better spacing
      const maxWidthTeacherName = 120; // Adjusted for potentially longer names
      const teacherNameLines = doc.splitTextToSize(
        formData.teacherName,
        maxWidthTeacherName
      );
      doc.text(teacherNameLines, 60, y);
      y += 7;

      doc.setFont("times", "bold");
      doc.text("Designation:", 12, y); // Designation: [cite: 3]
      doc.setFont("times", "normal");
      doc.text(`${formData.teacherDesignation}`, 45, y);
      y += 7;

      doc.setFont("times", "bold");
      doc.text("Submission Date:", 12, y); // Submission Date: /....../....... [cite: 3]
      doc.setFont("times", "normal");
      doc.text(`${formattedDate}`, 50, y);
      y += 10;

      const sanitizedName = formData.studentName.replace(/\s+/g, "_");
      doc.save(`${formData.studentId}_${sanitizedName}_LabReport.pdf`);
    };
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-10 space-y-8">
      <h2 className="text-2xl font-semibold text-center text-gray-800">
        Lab Report PDF Generator
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Course */}
        <div className="md:col-span-2">
          <label className="text-sm font-medium mb-1 block">Course</label>
          <Select onValueChange={handleCourseChange}>
            <SelectTrigger className="w-full h-9 text-sm">
              <SelectValue placeholder="Select a course" />
            </SelectTrigger>
            <SelectContent>
              {courseList.map((course) => (
                <SelectItem key={course.code} value={course.code}>
                  {course.code} - {course.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Project Title */}
        <div>
          <label className="text-sm font-medium mb-1 block">
            Lab Report Title
          </label>
          <Input
            name="projectTitle"
            value={formData.projectTitle}
            onChange={handleChange}
            placeholder="Title of your Lab Report (e.g., Project Report)"
            className="h-9 text-sm"
          />
        </div>

        {/* Teacher Designation */}
        <div>
          <label className="text-sm font-medium mb-1 block">
            Teacher Designation
          </label>
          <Select
            onValueChange={(value) =>
              setFormData({ ...formData, teacherDesignation: value })
            }
          >
            <SelectTrigger className="w-full h-9 text-sm">
              <SelectValue placeholder="Select designation" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Professor">Professor</SelectItem>
              <SelectItem value="Dr.">Dr.</SelectItem>
              <SelectItem value="Lecturer">Lecturer</SelectItem>
              <SelectItem value="Assistant Professor">
                Assistant Professor
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Student Name */}
        <Input
          name="studentName"
          value={formData.studentName}
          onChange={handleChange}
          placeholder="Student name(s)"
          className="h-9 text-sm"
        />

        {/* Student ID */}
        <Input
          name="studentId"
          value={formData.studentId}
          onChange={handleChange}
          placeholder="Student ID(s)"
          className="h-9 text-sm"
        />

        {/* Batch */}
        <div>
          <label className="text-sm font-medium mb-1 block">Batch</label>
          <Select
            onValueChange={(value) =>
              setFormData({ ...formData, batch: value })
            }
          >
            <SelectTrigger className="w-full h-9 text-sm">
              <SelectValue placeholder="Select batch" />
            </SelectTrigger>
            <SelectContent>
              {[...Array(31)].map((_, i) => {
                const val = (30 + i).toString();
                return (
                  <SelectItem key={val} value={val}>
                    Batch {val}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>

        {/* Semester */}
        <div>
          <label className="text-sm font-medium mb-1 block">Semester</label>
          <Select
            onValueChange={(value) =>
              setFormData({ ...formData, semester: value })
            }
          >
            <SelectTrigger className="w-full h-9 text-sm">
              <SelectValue placeholder="Select semester" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Spring 2025">Spring 2025</SelectItem>
              <SelectItem value="Summer 2025">Summer 2025</SelectItem>
              <SelectItem value="Fall 2025">Fall 2025</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Group Number */}
        <div>
          <label className="text-sm font-medium mb-1 block">Group Number</label>
          <Input
            name="groupNo"
            value={formData.groupNo}
            onChange={handleChange}
            placeholder="e.g., 1, A, etc."
            className="h-9 text-sm"
          />
        </div>

        {/* Submission Date */}
        <div className="md:col-span-2">
          <label className="text-sm font-medium mb-1 block">
            Submission Date
          </label>
          <Input
            type="date"
            name="submissionDate"
            value={formData.submissionDate}
            onChange={handleChange}
            className="w-full h-9 text-sm"
          />
        </div>
      </div>

      <Button className="w-full h-10 text-sm mt-4" onClick={generatePDF}>
        Generate Lab Report PDF
      </Button>
    </div>
  );
}
