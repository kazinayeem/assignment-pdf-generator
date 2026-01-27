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
// import { courseData } from "@/app/data"; // No longer needed here
import autoTable from "jspdf-autotable";
import jsPDF from "jspdf";
import "jspdf-autotable";
import Link from "next/link";



type FormData = {
  courseCode: string;
  courseTitle: string;
  section: string;
  topic: string;
  teacherName: string;
  teacherDesignation: string;
  department: string; 
  studentName: string;
  studentId: string;
  submissionDate: string;
  batch: string;
  semester: string;
};

export default function AssignmentForm() {
  const [formData, setFormData] = useState<FormData>({
    courseCode: "",
    courseTitle: "",
    section: "",
    topic: "",
    teacherName: "",
    teacherDesignation: "",
    department: "",
    studentName: "",
    studentId: "",
    submissionDate: "",
    batch: "",
    semester: "",
  });

  

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const generatePDF = () => {
    const doc = new jsPDF("p", "mm", "a4") as jsPDF & {
      lastAutoTable?: { finalY: number };
    };

    let y = 15;

    const logo = new Image();
    logo.src = "./diulogoside.png";
    logo.onload = () => {
      doc.addImage(logo, "PNG", 60, y, 90, 25);
      y += 30;

      doc.setFont("times", "bold");
      doc.setFontSize(16);
      doc.text("Assignment", 105, y, { align: "center" });
      y += 8;

      // === Teacher Evaluation Table ===
      doc.setFontSize(11);
      autoTable(doc, {
        startY: y,
        head: [
          [
            {
              content: "Only for course Teacher",
              colSpan: 7,
              styles: {
                halign: "center",
                fontStyle: "bold",
                fontSize: 11,
              },
            },
          ],
          [
            { content: "", colSpan: 2 },
            { content: "Needs Improvement" },
            { content: "Developing" },
            { content: "Sufficient" },
            { content: "Above Average" },
            { content: "Total Mark" },
          ],
          [
            { content: "Allocate mark & Percentage", colSpan: 2 },
            "25%",
            "50%",
            "75%",
            "100%",
            "5",
          ],
        ],
        body: [
          ["Clarity", "1", "", "", "", "", ""],
          ["Content Quality", "2", "", "", "", "", ""],
          ["Spelling & Grammar", "1", "", "", "", "", ""],
          ["Organization and Formatting", "1", "", "", "", "", ""],
          [
            {
              content: "Total obtained mark",
              colSpan: 6,
              styles: {
                halign: "right",
                fontStyle: "bold",
              },
            },
            "", 
            "", 
            "",
            "",
            "",
          ],
          [
            {
              content: "Comments \n \n", 
              colSpan: 2,
              styles: {
                halign: "left",
                fontStyle: "bold",
              },
            },
            {
              content: "", 
              colSpan: 5,
            },
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
          fillColor: false, // No fill color for head
          textColor: 0,
          fontStyle: "bold",
        },
      });

      y = (doc as any).lastAutoTable.finalY + 10; // Increased gap after table

      // Student Information Section
      const formattedDate = formData.submissionDate
        ? formData.submissionDate.split("-").reverse().join(" / ")
        : "";

      doc.setFontSize(13);
      doc.setFont("times", "bold");
      doc.text("Student Information", 12, y);
      y += 8;

      doc.setFont("times", "bold");
      doc.text("Semester:", 12, y);
      doc.setFont("times", "normal");
      doc.text(`${formData.semester}`, 45, y);
      y += 7;

      doc.setFont("times", "bold");
      doc.text("Student Name:", 12, y);
      doc.setFont("times", "normal");
      doc.text(`${formData.studentName}`, 45, y);
      y += 7;

      doc.setFont("times", "bold");
      doc.text("Student ID:", 12, y);
      doc.setFont("times", "normal");
      doc.text(`${formData.studentId}`, 45, y);
      y += 7;

      doc.setFont("times", "bold");
      doc.text("Batch:", 12, y);
      doc.setFont("times", "normal");
      doc.text(`${formData.batch}`, 45, y);
      doc.setFont("times", "bold");
      doc.text("Section:", 100, y); // Student's section
      doc.setFont("times", "normal");
      doc.text(`${formData.section}`, 125, y);
      y += 12;

      // Course Teacher Information Section
      doc.setFont("times", "bold");
      doc.text("Course & Teacher Information", 12, y);
      y += 8;

      doc.setFont("times", "bold");
      doc.text("Course Code:", 12, y);
      doc.setFont("times", "normal");
      doc.text(`${formData.courseCode}`, 45, y);

      doc.setFont("times", "bold");
      doc.text("Course Title:", 100, y);
      doc.setFont("times", "normal");
      const maxWidthCourseName = 60; // Max width for course title before wrapping
      const courseNameLines = doc.splitTextToSize(
        formData.courseTitle,
        maxWidthCourseName
      );
      doc.text(courseNameLines, 130, y); // Adjusted x-position for course title
      y += Math.max(7, courseNameLines.length * 5); // Adjust y based on lines

      doc.setFont("times", "bold");
      doc.text("Teacher Name:", 12, y);
      doc.setFont("times", "normal");
      const maxWidthTeacherName = 90; // Max width for teacher name
      const teacherNameLines = doc.splitTextToSize(
        formData.teacherName,
        maxWidthTeacherName
      );
      doc.text(teacherNameLines, 45, y);
      y += Math.max(7, teacherNameLines.length * 5); // Adjust y based on lines

      doc.setFont("times", "bold");
      doc.text("Designation:", 12, y);
      doc.setFont("times", "normal");
      doc.text(`${formData.teacherDesignation}`, 45, y);
      y += 7;

      doc.setFont("times", "bold");
      doc.text("Submission Date:", 12, y);
      doc.setFont("times", "normal");
      doc.text(`${formattedDate}`, 50, y);
      y += 10;

      const sanitizedName = formData.studentName.replace(/\s+/g, "_");
      doc.save(
        `${formData.studentId}_${sanitizedName}_${formData.courseCode}.pdf`
      ); // Added course code to filename
    };
    // Handle image loading error
    logo.onerror = () => {
      console.error("Failed to load logo image.");
      doc.setFont("times", "bold");
      doc.setFontSize(16);
      doc.text("Assignment", 105, y, { align: "center" });
      y += 8;
      const sanitizedName = formData.studentName.replace(/\s+/g, "_");
      doc.save(
        `${formData.studentId}_${sanitizedName}_${formData.courseCode}_no_logo.pdf`
      );
    };
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 md:px-8 py-8 w-full">
        <Link
          href="/"
          className="inline-block px-5 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition mb-6"
        >
          ← Go Home Page
        </Link>
        <h2 className="text-2xl sm:text-3xl font-semibold text-center text-gray-800 mb-8">
          Assignment PDF Generator
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Course Code */}
        <div>
          <label className="text-sm font-medium mb-1 block">Course Code</label>
          <Input
            name="courseCode"
            value={formData.courseCode}
            onChange={handleChange}
            placeholder="e.g., SE 224"
            className="h-9 text-sm"
          />
        </div>

        {/* Course Title */}
        <div>
          <label className="text-sm font-medium mb-1 block">Course Title</label>
          <Input
            name="courseTitle"
            value={formData.courseTitle}
            onChange={handleChange}
            placeholder="e.g., Database System Lab"
            className="h-9 text-sm"
          />
        </div>

        {/* Section */}
        <div>
          <label className="text-sm font-medium mb-1 block">Section</label>
          <Input
            name="section"
            value={formData.section}
            onChange={handleChange}
            placeholder="e.g., 42B2"
            className="h-9 text-sm"
          />
        </div>

        {/* Teacher Name */}
        <div>
          <label className="text-sm font-medium mb-1 block">Teacher Name</label>
          <Input
            name="teacherName"
            value={formData.teacherName}
            onChange={handleChange}
            placeholder="Enter teacher's full name"
            className="h-9 text-sm"
          />
        </div>

        {/* Teacher Designation */}
        <div>
          <label className="text-sm font-medium mb-1 block">
            Teacher Designation
          </label>
          <Select
            value={formData.teacherDesignation} // Controlled component
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
              <SelectItem value="Associate Professor">
                Associate Professor
              </SelectItem>
              {/* Add other designations as needed */}
            </SelectContent>
          </Select>
        </div>

        {/* Assignment Topic */}
        {/* Making it full width for better topic visibility */}
        <div className="md:col-span-2">
          <label className="text-sm font-medium mb-1 block">
            Assignment Topic
          </label>
          <Input
            name="topic"
            value={formData.topic}
            onChange={handleChange}
            placeholder="Enter assignment topic"
            className="h-9 text-sm"
          />
        </div>

        {/* Student Name */}
        <Input
          name="studentName"
          value={formData.studentName}
          onChange={handleChange}
          placeholder="Student name"
          className="h-9 text-sm"
          aria-label="Student Name"
        />

        {/* Student ID */}
        <Input
          name="studentId"
          value={formData.studentId}
          onChange={handleChange}
          placeholder="Student ID"
          className="h-9 text-sm"
          aria-label="Student ID"
        />

        {/* Batch */}
        <div>
          <label className="text-sm font-medium mb-1 block">Batch</label>
          <Select
            value={formData.batch}
            onValueChange={(value) =>
              setFormData({ ...formData, batch: value })
            }
          >
            <SelectTrigger className="w-full h-9 text-sm">
              <SelectValue placeholder="Select batch " />
            </SelectTrigger>
            <SelectContent>
              {[...Array(38)].map((_, i) => {
                const val = (37 + i).toString();
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
            value={formData.semester} // Controlled component
            onValueChange={(value) =>
              setFormData({ ...formData, semester: value })
            }
          >
            <SelectTrigger className="w-full h-9 text-sm">
              <SelectValue placeholder="Select semester" />
            </SelectTrigger>
            <SelectContent>
              {/* Consider generating these dynamically for future years */}
              <SelectItem value="Spring 2024">Spring 2024</SelectItem>
              <SelectItem value="Summer 2024">Summer 2024</SelectItem>
              <SelectItem value="Fall 2024">Fall 2024</SelectItem>
              <SelectItem value="Spring 2025">Spring 2025</SelectItem>
              <SelectItem value="Summer 2025">Summer 2025</SelectItem>
              <SelectItem value="Fall 2025">Fall 2025</SelectItem>
              <SelectItem value="Spring 2026">Spring 2026</SelectItem>
              <SelectItem value="Summer 2026">Summer 2026</SelectItem>
              <SelectItem value="Fall 2026">Fall 2026</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Submission Date */}
        <div className="sm:col-span-2">
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

      <Button className="w-full h-10 text-sm mt-6 bg-blue-600 hover:bg-blue-700" onClick={generatePDF}>
        Generate PDF
      </Button>
      </div>
    </div>
  );
}
