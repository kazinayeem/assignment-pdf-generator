import React, { useState } from "react";
import jsPDF from "jspdf";
import "bootstrap/dist/css/bootstrap.min.css";
import autoTable from "jspdf-autotable";
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
  {
    code: "GE 235",
    title: "Principles of Accounting, Business & Economics",
    credit: "3",
    section: "41A",
    teacher: "Ms. Shahana Kabir",
  },
  {
    code: "SE 234",
    title: "Theory of Computing",
    credit: "3",
    section: "41_A",
    teacher: "Ms. Fatama Binta Rafiq",
  },
  {
    code: "SE 233",
    title: "Operating System & System Programming 1 Lab",
    credit: "1",
    section: "41_A1",
    teacher: "Ms. Ishrat Sultana",
  },
  {
    code: "SE 232",
    title: "Operating System & System Programming",
    credit: "3",
    section: "41A",
    teacher: "Ms. Ishrat Sultana",
  },
  {
    code: "SE 231",
    title: "System Analysis & Design Capstone Project",
    credit: "3",
    section: "41A1",
    teacher: "Tapushe Rabaya Toma",
  },
];

export default function App() {
  const generateEvaluationForm = () => {
    const doc = new jsPDF();

    // Title Row
    doc.setFontSize(12);
    doc.text("Only for course Teacher", 80, 10);

    // Table Data
    autoTable(doc, {
      startY: 20,
      head: [
        [
          { content: "Allocate mark &\nPercentage", rowSpan: 2 },
          { content: "Needs Improvement\n25%", colSpan: 1 },
          { content: "Developing\n50%", colSpan: 1 },
          { content: "Sufficient\n75%", colSpan: 1 },
          { content: "Above Average\n100%", colSpan: 1 },
          { content: "Total Mark\n5", rowSpan: 2 },
        ],
      ],
      body: [
        ["Clarity (1)", "", "", "", "", ""],
        ["Content Quality (2)", "", "", "", "", ""],
        ["Spelling & Grammar (1)", "", "", "", "", ""],
        ["Organization and Formatting (1)", "", "", "", "", ""],
      ],
      theme: "grid",
      styles: {
        cellPadding: 3,
        fontSize: 10,
        valign: "middle",
        halign: "center",
      },
      headStyles: {
        fillColor: [240, 240, 240],
        textColor: 0,
        fontStyle: "bold",
      },
    });

    // Total Obtained Mark Row
    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 5,
      body: [["Total obtained mark", ""]],
      theme: "grid",
      styles: {
        fontSize: 10,
        halign: "left",
      },
      columnStyles: {
        0: { cellWidth: 140 },
        1: { cellWidth: 40 },
      },
    });

    // Comments Section
    doc.setFontSize(10);
    doc.text("Comments", 10, doc.lastAutoTable.finalY + 15);
    doc.rect(10, doc.lastAutoTable.finalY + 18, 190, 40); // Draw empty box for comments

    doc.save("evaluation_form.pdf");
  };
  const dateOnly = new Date().toISOString().split("T")[0];
  const [formData, setFormData] = useState({
    courseCode: "",
    courseTitle: "",
    section: "",
    topic: "",
    teacherName: "",
    teacherDesignation: "Mr.",
    department: "Software Engineering",
    studentName: "",
    studentId: "",
    submissionDate: dateOnly,
    batch: "41",
    semester: "Summl-2024",
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

  // const generatePDF = () => {
  //   const doc = new jsPDF("p", "mm", "a4");
  //   const margin = 15;
  //   let y = margin + 6;

  //   // Border
  //   doc.setDrawColor(0, 128, 0);
  //   doc.setLineWidth(0.8);
  //   doc.rect(margin, margin, 180, 267);

  //   // Logo
  //   const img = new Image();
  //   img.src = "./diulogoside.png";
  //   img.onload = () => {
  //     doc.addImage(img, "PNG", 65, y, 70, 22);
  //     y += 28;

  //     doc.setFontSize(13);
  //     doc.setFont("times", "bold");
  //     doc.text("Department of Software Engineering", 105, y, {
  //       align: "center",
  //     });
  //     y += 18;

  //     doc.setFontSize(20);
  //     doc.setFont("times", "bold");
  //     doc.text("Assignment", 105, y, { align: "center" });
  //     y += 15;

  //     doc.setFontSize(14);
  //     doc.setFont("times", "normal");
  //     doc.text(`Course Code: ${formData.courseCode}`, margin + 10, y);
  //     y += 8;
  //     doc.text(`Course Title: ${formData.courseTitle}`, margin + 10, y);
  //     y += 8;
  //     doc.text(`Section: ${formData.section}`, margin + 10, y);
  //     y += 8;
  //     if (formData.topic) {
  //       doc.text(`Topic: ${formData.topic}`, margin + 10, y);
  //       y += 15;
  //     }

  //     doc.setFontSize(14);
  //     doc.setFont("times", "bold");
  //     doc.text("Submitted To:", margin + 10, y);
  //     y += 10;

  //     const centerX = 65;
  //     doc.setFontSize(13);

  //     // Name
  //     doc.setFont("times", "bold");
  //     doc.text("Name:", centerX - 30, y);
  //     doc.setFont("times", "normal");
  //     doc.text(formData.teacherName, centerX - 5, y);
  //     y += 7;

  //     // Designation
  //     doc.setFont("times", "bold");
  //     doc.text("Designation:", centerX - 30, y);
  //     doc.setFont("times", "normal");
  //     doc.text(formData.teacherDesignation, centerX - 5, y);
  //     y += 7;

  //     doc.setFont("times", "normal");
  //     doc.text("Department of Software Engineering", centerX - 30, y);
  //     y += 15;

  //     doc.setFontSize(14);
  //     doc.setFont("times", "bold");
  //     doc.text("Submitted By:", margin + 10, y);
  //     y += 8;

  //     doc.setFontSize(13);
  //     doc.setFont("times", "normal");
  //     doc.text(`Student Name: ${formData.studentName}`, margin + 20, y);
  //     y += 7;
  //     doc.text(`ID: ${formData.studentId}`, margin + 20, y);
  //     y += 7;
  //     doc.text("Department of Software Engineering", margin + 20, y);
  //     y += 12;

  //     if (formData.submissionDate) {
  //       y += 5;
  //       doc.setFontSize(13);
  //       doc.setFont("times", "bold");
  //       doc.text(`Submission Date: ${formData.submissionDate}`, margin + 10, y);
  //     }

  //     // Save the file
  //     doc.save(`${formData.courseCode}_${formData.studentName}_Assignment.pdf`);
  //   };
  // };
  const generatePDF = () => {
    const doc = new jsPDF("p", "mm", "a4");
    let y = 15;

    const logo = new Image();
    logo.src = "./diulogoside.png"; // Make sure path is valid in your public folder

    logo.onload = () => {
      doc.addImage(logo, "PNG", 60, y, 90, 25);
      y += 30;

      doc.setFontSize(18);
      doc.setFont("times", "bold");
      doc.text("Assignment", 105, y, { align: "center" });
      y += 10;

      doc.setFontSize(12);
      doc.setFont("times", "normal");
      doc.text("Only for course Teacher", 85, y);
      y += 5;

      // === Evaluation Table ===
      autoTable(doc, {
        startY: y,
        head: [
          [
            { content: "Allocate mark &\nPercentage", rowSpan: 2 },
            "Needs Improvement\n25%",
            "Developing\n50%",
            "Sufficient\n75%",
            "Above Average\n100%",
            { content: "Total Mark\n5", rowSpan: 2 },
          ],
        ],
        body: [
          ["Clarity", "1", "", "", "", ""],
          ["Content Quality", "2", "", "", "", ""],
          ["Spelling & Grammar", "1", "", "", "", ""],
          ["Organization and Formatting", "1", "", "", "", ""],
        ],
        theme: "grid",
        styles: {
          fontSize: 10,
          valign: "middle",
          halign: "center",
          cellPadding: 2,
          textColor: 0,
          fillColor: false, // no background
        },
        headStyles: {
          fillColor: false, // remove header background
          textColor: 0,
          fontStyle: "bold",
        },
      });

      y = doc.lastAutoTable.finalY + 5;

      autoTable(doc, {
        startY: y,
        body: [["Total obtained mark", ""]],
        theme: "grid",
        styles: { fontSize: 10 },
        columnStyles: {
          0: { cellWidth: 140 },
          1: { cellWidth: 40 },
        },
        headStyles: {
          fillColor: false,
          textColor: 0,
        },
      });

      // === Comments Box ===
      y = doc.lastAutoTable.finalY + 5;
      doc.setFont("times", "bold");
      doc.setFontSize(11);
      doc.text("Comments", 12, y + 5);
      doc.rect(12, y + 8, 186, 30);
      y += 45;

      // === Bottom Information ===
      const formattedDate = formData.submissionDate
        ? formData.submissionDate.split("-").reverse().join(" / ")
        : "";

      doc.setFontSize(12);
      doc.setFont("times", "bold");
      doc.text(`Semester: ${formData.semester}`, 12, y);
      y += 8;

      doc.text(`Student Name:       ${formData.studentName}`, 12, y);
      y += 7;
      doc.text(`Student ID:         ${formData.studentId}`, 12, y);
      y += 7;
      doc.text(
        `Batch: ${formData.batch}               Section: ${formData.section}`,
        12,
        y
      );

      y += 7;
      doc.text(
        `Course Code: ${formData.courseCode}        Course Name: ${formData.courseTitle}`,
        12,
        y
      );
      y += 7;
      doc.text(`Course Teacher Name: ${formData.teacherName}`, 12, y);
      y += 7;
      doc.text(`Designation: ${formData.teacherDesignation}`, 12, y);
      y += 7;
      doc.text(`Submission Date:  ${formattedDate}`, 12, y);

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
        {/* Semester Selection */}
        <div className="col-md-6">
          <label className="form-label fw-semibold">Semester</label>
          <select
            name="semester"
            className="form-select"
            value={formData.semester}
            onChange={handleChange}
          >
            <option value="Spring-2023">Spring-2023</option>
            <option value="Summer-2023">Summer-2023</option>
            <option value="Fall-2023">Fall-2023</option>
            <option value="Spring-2024">Spring-2024</option>
            <option value="Summer-2024">Summer-2024</option>
            <option value="Fall-2024">Fall-2024</option>
            <option value="Spring-2025">Spring-2025</option>
            <option value="Summer-2025">Summer-2025</option>
            <option value="Fall-2025">Fall-2025</option>
          </select>
        </div>

        {/* Batch Selection */}
        <div className="col-md-6">
          <label className="form-label fw-semibold">Batch</label>
          <select
            name="batch"
            className="form-select"
            value={formData.batch}
            onChange={handleChange}
          >
            <option value="40">40</option>
            <option value="41">41</option>
            <option value="42">42</option>
            <option value="43">43</option>
            <option value="44">44</option>
          </select>
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
