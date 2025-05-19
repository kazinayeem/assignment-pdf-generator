import React, { useState } from "react";
import jsPDF from "jspdf";
import "bootstrap/dist/css/bootstrap.min.css";
const courseData = [
  {
    code: "SE 224",
    title: "Database System Lab",
    credit: "1",
    section: "42B2",
    teacher: "Prof. Dr. A. H. M. Saifullah Sadi",
  },
  {
    code: "SE 223",
    title: "Database System",
    credit: "3",
    section: "42_B",
    teacher: "Prof. Dr. A. H. M. Saifullah Sadi",
  },
  {
    code: "SE 133",
    title: "Software Development Capstone Project",
    credit: "3",
    section: "43H2",
    teacher: "Ms. Sumona Afroz",
  },
  {
    code: "SE 132",
    title: "Data Structure Lab",
    credit: "1",
    section: "43H2",
    teacher: "Maliha Bushra Hoque",
  },
  {
    code: "SE 131",
    title: "Data Structure",
    credit: "3",
    section: "43H",
    teacher: "Maliha Bushra Hoque",
  },
];

export default function App() {
  const [formData, setFormData] = useState({
    courseCode: "",
    courseTitle: "",
    section: "",
    topic: "",
    teacherName: "",
    teacherDesignation: "Mr.",
    department: "Software Engineering",
    studentName: "Mohammad Ali Nayeem",
    studentId: "232-35-022",
    submissionDate: "",
  });

  const handleCourseSelect = (e) => {
    const selectedCode = e.target.value;
    const course = courseData.find((c) => c.code === selectedCode);
    if (course) {
      setFormData({
        ...formData,
        courseCode: course.code,
        courseTitle: course.title,
        section: course.section,
        teacherName: course.teacher,
      });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const generatePDF = () => {
    const doc = new jsPDF("p", "mm", "a4");
    const margin = 15;
    let y = margin + 6;

    // Border
    doc.setDrawColor(0, 128, 0);
    doc.setLineWidth(0.8);
    doc.rect(margin, margin, 180, 267);

    // Logo
    const img = new Image();
    img.src = "./diulogoside.png";
    img.onload = () => {
      doc.addImage(img, "PNG", 65, y, 70, 22);
      y += 28;

      doc.setFontSize(13);
      doc.setFont("times", "bold");
      doc.text("Department of Software Engineering", 105, y, {
        align: "center",
      });
      y += 18;

      doc.setFontSize(20);
      doc.setFont("times", "bold");
      doc.text("Assignment", 105, y, { align: "center" });
      y += 15;

      doc.setFontSize(14);
      doc.setFont("times", "normal");
      doc.text(`Course Code: ${formData.courseCode}`, margin + 10, y);
      y += 8;
      doc.text(`Course Title: ${formData.courseTitle}`, margin + 10, y);
      y += 8;
      doc.text(`Section: ${formData.section}`, margin + 10, y);
      y += 8;
      if (formData.topic) {
        doc.text(`Topic: ${formData.topic}`, margin + 10, y);
        y += 15;
      }

      doc.setFontSize(14);
      doc.setFont("times", "bold");
      doc.text("Submitted To:", margin + 10, y);
      y += 10;

      const centerX = 65;
      doc.setFontSize(13);

      // Name
      doc.setFont("times", "bold");
      doc.text("Name:", centerX - 30, y);
      doc.setFont("times", "normal");
      doc.text(formData.teacherName, centerX - 5, y);
      y += 7;

      // Designation
      doc.setFont("times", "bold");
      doc.text("Designation:", centerX - 30, y);
      doc.setFont("times", "normal");
      doc.text(formData.teacherDesignation, centerX - 5, y);
      y += 7;

      doc.setFont("times", "normal");
      doc.text("Department of Software Engineering", centerX - 30, y);
      y += 15;

      doc.setFontSize(14);
      doc.setFont("times", "bold");
      doc.text("Submitted By:", margin + 10, y);
      y += 8;

      doc.setFontSize(13);
      doc.setFont("times", "normal");
      doc.text(`Student Name: ${formData.studentName}`, margin + 20, y);
      y += 7;
      doc.text(`ID: ${formData.studentId}`, margin + 20, y);
      y += 7;
      doc.text("Department of Software Engineering", margin + 20, y);
      y += 12;

      if (formData.submissionDate) {
        y += 5;
        doc.setFontSize(13);
        doc.setFont("times", "bold");
        doc.text(`Submission Date: ${formData.submissionDate}`, margin + 10, y);
      }

      // Save the file
      doc.save(`${formData.courseCode}_${formData.studentName}_Assignment.pdf`);
    };
  };

  return (
    <div className="container py-5 px-3">
      <h2 className="text-center mb-5 text-primary fw-bold">
        Assignment PDF Generator
      </h2>

      <form className="row g-4">
        {/* Course Selection */}
        <div className="col-md-6">
          <label className="form-label fw-semibold">Select Course</label>
          <select className="form-select" onChange={handleCourseSelect}>
            <option value="">Choose a course...</option>
            {courseData.map((course) => (
              <option key={course.code} value={course.code}>
                {course.code} - {course.title}
              </option>
            ))}
          </select>
        </div>

        {/* Topic */}
        <div className="col-md-6">
          <label className="form-label fw-semibold">Assignment Topic</label>
          <input
            name="topic"
            className="form-control"
            placeholder="Enter assignment topic"
            value={formData.topic}
            onChange={handleChange}
          />
        </div>

        {/* Teacher Designation */}
        <div className="col-md-6">
          <label className="form-label fw-semibold">Teacher Designation</label>
          <select
            name="teacherDesignation"
            className="form-select"
            value={formData.teacherDesignation}
            onChange={handleChange}
          >
            <option value="">Select designation</option>
            <option value="Prof.">Prof.</option>
            <option value="Dr.">Dr.</option>
            <option value="Mr.">Mr.</option>
            <option value="Ms.">Ms.</option>
            <option value="Lecturer">Lecturer</option>
          </select>
        </div>

        {/* Student Name */}
        <div className="col-md-6">
          <label className="form-label fw-semibold">Student Name</label>
          <input
            name="studentName"
            className="form-control"
            placeholder="Your full name"
            value={formData.studentName}
            onChange={handleChange}
          />
        </div>

        {/* Student ID */}
        <div className="col-md-6">
          <label className="form-label fw-semibold">Student ID</label>
          <input
            name="studentId"
            className="form-control"
            placeholder="Example: 201-15-12345"
            value={formData.studentId}
            onChange={handleChange}
          />
        </div>

        {/* Submission Date */}
        <div className="col-md-6">
          <label className="form-label fw-semibold">Submission Date</label>
          <input
            name="submissionDate"
            type="date"
            className="form-control"
            value={formData.submissionDate}
            onChange={handleChange}
          />
        </div>

        {/* Generate Button */}
        <div className="col-12 text-center pt-4">
          <button
            type="button"
            className="btn btn-dark px-5 py-2 fs-5"
            onClick={generatePDF}
          >
            Generate PDF
          </button>
        </div>
      </form>
      <footer className="text-center mt-5 pt-4 border-top">
        <div className="container pb-3">
          <p className="mb-1 text-muted">
            &copy; {new Date().getFullYear()} Assignment PDF Generator
          </p>
          <small className="text-muted">
            Developed by Nayeem | Department of Software Engineering, DIU
          </small>
        </div>
      </footer>
    </div>
  );
}
