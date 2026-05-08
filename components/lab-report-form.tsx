"use client";

import { useState, ChangeEvent, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import autoTable from "jspdf-autotable";
import jsPDF from "jspdf";
import "jspdf-autotable";
import Link from "next/link";
import { useAuthStore } from "@/lib/auth-store";
import { FlaskConical, ArrowLeft, Download, Info, ShieldCheck, Users } from "lucide-react";

type FormData = {
  courseCode: string;
  courseTitle: string;
  section: string;
  projectTitle: string;
  teacherName: string;
  teacherDesignation: string;
  department: string;
  studentName: string;
  studentId: string;
  submissionDate: string;
  batch: string;
  semester: string;
  groupNo: string;
};

interface LabReportFormProps {
  prefilledData?: {
    courseCode?: string;
    courseTitle?: string;
    instructorName?: string;
    instructorDesignation?: string;
  };
}

const DEPT_MAP: Record<string, string> = {
  "SWE": "Software Engineering",
  "CSE": "Computer Science & Engineering",
  "EEE": "Electrical & Electronic Engineering",
  "CE": "Civil Engineering",
  "ETE": "Electronics & Telecommunication Engineering",
  "Pharmacy": "Department of Pharmacy",
  "BBA": "Bachelor of Business Administration",
  "English": "Department of English",
  "Law": "Department of Law",
};

export default function LabReportForm({ prefilledData }: LabReportFormProps) {
  const { user: authUser } = useAuthStore();

  const [formData, setFormData] = useState<FormData>({
    courseCode: "",
    courseTitle: "",
    section: "",
    projectTitle: "",
    teacherName: "",
    teacherDesignation: "",
    department: "",
    studentName: "",
    studentId: "",
    submissionDate: new Date().toISOString().split("T")[0],
    batch: "",
    semester: "",
    groupNo: "",
  });

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      courseCode: prefilledData?.courseCode || prev.courseCode,
      courseTitle: prefilledData?.courseTitle || prev.courseTitle,
      teacherName: prefilledData?.instructorName || prev.teacherName,
      teacherDesignation: prefilledData?.instructorDesignation || prev.teacherDesignation,
      studentName: authUser?.name || prev.studentName,
      studentId: (authUser as any)?.studentId || prev.studentId,
      department: authUser?.department || prev.department,
      batch: (authUser as any)?.batch || prev.batch,
      semester: (authUser as any)?.semester || prev.semester,
      section: (authUser as any)?.section || prev.section,
      groupNo: (authUser as any)?.subSection || prev.groupNo,
    }));
  }, [prefilledData, authUser]);

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
    logo.src = "/diulogoside.png";

    const renderRest = () => {
      doc.setFont("times", "bold");
      doc.setFontSize(16);

      doc.text("Project Report", 105, y, { align: "center" });
      y += 7;

      if (formData.projectTitle) {
        doc.setFontSize(12);
        doc.setFont("times", "normal");
        const titleLines = doc.splitTextToSize(`Topic: ${formData.projectTitle}`, 160);
        doc.text(titleLines, 105, y, { align: "center" });
        y += (titleLines.length * 5) + 2;
      } else {
        y += 2;
      }

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
            "25",
          ],
        ],
        body: [
          ["Understanding", "3", "", "", "", "", ""],
          ["Analysis", "4", "", "", "", "", ""],
          ["Implementation", "8", "", "", "", "", ""],
          ["Report Writing", "10", "", "", "", "", ""],
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
            { content: "", colSpan: 5 },
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
      y += 25;

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

      if (formData.groupNo) {
        doc.setFont("times", "bold");
        doc.text("Group No.:", 12, y);
        doc.setFont("times", "normal");
        doc.text(`${formData.groupNo}`, 45, y);
        y += 7;
      }

      doc.setFont("times", "bold");
      doc.text("Student Name(s):", 12, y);
      doc.setFont("times", "normal");
      doc.text(`${formData.studentName}`, 60, y);
      y += 7;

      doc.setFont("times", "bold");
      doc.text("Student ID(s):", 12, y);
      doc.setFont("times", "normal");
      doc.text(`${formData.studentId}`, 45, y);
      y += 7;

      doc.setFont("times", "bold");
      doc.text("Batch:", 12, y);
      doc.setFont("times", "normal");
      doc.text(`${formData.batch}`, 45, y);
      doc.setFont("times", "bold");
      doc.text("Section:", 100, y);
      doc.setFont("times", "normal");
      doc.text(`${formData.section}`, 125, y);
      y += 12;

      doc.setFont("times", "bold");
      doc.text("Course Teacher Information", 12, y);
      y += 8;

      doc.setFont("times", "bold");
      doc.text("Course Code:", 12, y);
      doc.setFont("times", "normal");
      doc.text(`${formData.courseCode}`, 45, y);
      doc.setFont("times", "bold");
      doc.text("Course Name:", 100, y);
      doc.setFont("times", "normal");
      const courseNameLines = doc.splitTextToSize(formData.courseTitle, 60);
      doc.text(courseNameLines, 140, y);
      y += 7;

      doc.setFont("times", "bold");
      doc.text("Course Teacher Name:", 12, y);
      doc.setFont("times", "normal");
      const teacherNameLines = doc.splitTextToSize(
        formData.teacherName,
        120
      );
      doc.text(teacherNameLines, 60, y);
      y += 7;

      doc.setFont("times", "bold");
      doc.text("Designation:", 12, y);
      doc.setFont("times", "normal");
      doc.text(`${formData.teacherDesignation}`, 45, y);
      y += 7;

      // Add Department full name
      const fullDept = DEPT_MAP[formData.department] || formData.department;
      doc.setFont("times", "bold");
      doc.text("Department:", 12, y);
      doc.setFont("times", "normal");
      doc.text(`${fullDept}`, 45, y);
      y += 7;

      doc.setFont("times", "bold");
      doc.text("Submission Date:", 12, y);
      doc.setFont("times", "normal");
      doc.text(`${formattedDate}`, 50, y);
      y += 10;

      const sanitizedName = formData.studentName.replace(/\s+/g, "_");
      doc.save(`${formData.studentId}_${sanitizedName}_LabReport.pdf`);
    };

    logo.onload = () => {
      doc.addImage(logo, "PNG", 60, y, 90, 25);
      y += 30;
      renderRest();
    };

    logo.onerror = () => {
      console.error("Failed to load logo");
      renderRest();
    };
  };

  const labelCls = "text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-1.5 block ml-1";
  const inputCls = "h-11 rounded-xl border-gray-100 bg-gray-50/50 focus:bg-white focus:ring-2 focus:ring-emerald-500/10 transition-all text-sm";

  return (
    <div className="min-h-screen bg-[#fafafa] pb-20">
      {/* Top Header */}
      <div className="bg-white border-b border-gray-100 px-6 py-4 sticky top-0 z-40">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Link href="/" className="p-2 hover:bg-gray-50 rounded-xl transition-colors group">
            <ArrowLeft className="w-5 h-5 text-gray-400 group-hover:text-emerald-600" />
          </Link>
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
               <FlaskConical className="w-4 h-4 text-white" />
             </div>
             <h1 className="font-bold text-gray-900 hidden sm:block">Lab Report Generator</h1>
          </div>
          <Button onClick={generatePDF} className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold shadow-lg shadow-emerald-100 gap-2">
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Generate PDF</span>
            <span className="sm:hidden">PDF</span>
          </Button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Form Area */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Section: Course Details */}
            <div className="bg-white p-6 sm:p-8 rounded-[2rem] border border-gray-100 shadow-sm">
               <div className="flex items-center gap-3 mb-6">
                 <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
                   <Info className="w-5 h-5 text-emerald-600" />
                 </div>
                 <div>
                   <h2 className="font-bold text-gray-900 leading-tight">Lab & Instructor</h2>
                   <p className="text-xs text-gray-400">Technical course information</p>
                 </div>
               </div>

               <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                 <div className="sm:col-span-1">
                   <label className={labelCls}>Course Code</label>
                   <Input name="courseCode" value={formData.courseCode} onChange={handleChange} placeholder="e.g. SE 224" className={inputCls} />
                 </div>
                 <div className="sm:col-span-1">
                   <label className={labelCls}>Course Title</label>
                   <Input name="courseTitle" value={formData.courseTitle} onChange={handleChange} placeholder="e.g. Database System Lab" className={inputCls} />
                 </div>
                 <div className="sm:col-span-2">
                   <label className={labelCls}>Lab Report Title</label>
                   <Input name="projectTitle" value={formData.projectTitle} onChange={handleChange} placeholder="What is this report about?" className={inputCls} />
                 </div>
                 <div>
                   <label className={labelCls}>Instructor Name</label>
                   <Input name="teacherName" value={formData.teacherName} onChange={handleChange} placeholder="e.g. Prof. Dr. John" className={inputCls} />
                 </div>
                 <div>
                   <label className={labelCls}>Designation</label>
                   <input list="lab-desig-list" name="teacherDesignation" value={formData.teacherDesignation} onChange={handleChange} placeholder="Select or type..." className={`${inputCls} w-full px-3 border border-input`} />
                   <datalist id="lab-desig-list">
                     <option value="Professor" />
                     <option value="Associate Professor" />
                     <option value="Assistant Professor" />
                     <option value="Senior Lecturer" />
                     <option value="Lecturer" />
                   </datalist>
                 </div>
               </div>
            </div>

            {/* Section: Student Details */}
            <div className="bg-white p-6 sm:p-8 rounded-[2rem] border border-gray-100 shadow-sm">
               <div className="flex items-center gap-3 mb-6">
                 <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center">
                   <Users className="w-5 h-5 text-indigo-600" />
                 </div>
                 <div>
                   <h2 className="font-bold text-gray-900 leading-tight">Student Details</h2>
                   <p className="text-xs text-gray-400">Identify yourself and your group</p>
                 </div>
               </div>

               <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                 <div className="sm:col-span-2">
                   <label className={labelCls}>Full Name(s)</label>
                   <Input name="studentName" value={formData.studentName} onChange={handleChange} placeholder="Your Name" className={inputCls} />
                 </div>
                 <div>
                   <label className={labelCls}>Student ID(s)</label>
                   <Input name="studentId" value={formData.studentId} onChange={handleChange} placeholder="e.g. 211-15-XXX" className={inputCls} />
                 </div>
                 <div>
                   <label className={labelCls}>Department</label>
                   <Input name="department" value={formData.department} onChange={handleChange} placeholder="e.g. SWE" className={inputCls} />
                 </div>
                 <div>
                   <label className={labelCls}>Group Number (A1/A2)</label>
                   <Input name="groupNo" value={formData.groupNo} onChange={handleChange} placeholder="e.g. A1" className={inputCls} />
                 </div>
                 <div>
                   <label className={labelCls}>Batch</label>
                   <Select value={formData.batch} onValueChange={(v) => setFormData({...formData, batch: v})}>
                     <SelectTrigger className={inputCls}><SelectValue placeholder="Select" /></SelectTrigger>
                     <SelectContent>
                       {[...Array(38)].map((_, i) => (
                         <SelectItem key={i} value={(37 + i).toString()}>Batch {37 + i}</SelectItem>
                       ))}
                     </SelectContent>
                   </Select>
                 </div>
                 <div>
                   <label className={labelCls}>Semester</label>
                   <Select value={formData.semester} onValueChange={(v) => setFormData({...formData, semester: v})}>
                     <SelectTrigger className={inputCls}><SelectValue placeholder="Select" /></SelectTrigger>
                     <SelectContent>
                       {Array.from({ length: 7 }, (_, i) => 2024 + i).flatMap((year) => [
                         <SelectItem key={`Spring ${year}`} value={`Spring ${year}`}>Spring {year}</SelectItem>,
                         <SelectItem key={`Summer ${year}`} value={`Summer ${year}`}>Summer {year}</SelectItem>,
                         <SelectItem key={`Fall ${year}`} value={`Fall ${year}`}>Fall {year}</SelectItem>,
                       ])}
                     </SelectContent>
                   </Select>
                 </div>
                 <div>
                   <label className={labelCls}>Section</label>
                   <Input name="section" value={formData.section} onChange={handleChange} placeholder="e.g. A" className={inputCls} />
                 </div>
                 <div>
                   <label className={labelCls}>Submission Date</label>
                   <Input type="date" name="submissionDate" value={formData.submissionDate} onChange={handleChange} className={inputCls} />
                 </div>
               </div>
            </div>
          </div>

          {/* Sidebar / Info */}
          <div className="space-y-6">
            <div className="bg-emerald-600 rounded-[2rem] p-8 text-white shadow-xl shadow-emerald-100">
               <h3 className="font-bold text-xl mb-4">Lab Rubric 📊</h3>
               <p className="text-emerald-50 text-sm leading-relaxed mb-6">
                 This report format includes the official evaluation criteria: Understanding (3), Analysis (4), Implementation (8), and Report Writing (10).
               </p>
               <div className="p-4 bg-white/10 rounded-2xl border border-white/20">
                  <p className="text-xs font-medium">Total: 25 Marks</p>
               </div>
            </div>

            <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm">
               <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                 <ShieldCheck className="w-5 h-5 text-blue-500" />
                 PDF Standard
               </h3>
               <div className="space-y-3">
                  <div className="p-3 bg-gray-50 rounded-xl">
                    <p className="text-[10px] uppercase font-bold text-gray-400 mb-1">Dimensions</p>
                    <p className="text-xs font-medium text-gray-600">A4 Vertical (Portrait)</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-xl">
                    <p className="text-[10px] uppercase font-bold text-gray-400 mb-1">Logo Placement</p>
                    <p className="text-xs font-medium text-gray-600">DIU Official Center</p>
                  </div>
               </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
