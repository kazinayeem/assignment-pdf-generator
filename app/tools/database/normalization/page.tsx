"use client";

import { useState } from "react";
import Link from "next/link";
import { GitFork, Table, ArrowRight, ChevronRight, BookOpen, Info, CheckCircle2 } from "lucide-react";

type NormalStep = 0 | 1 | 2 | 3;

const DENORMALIZED_ROWS = [
  { StudentID: "S1", StudentName: "Alice", CourseID: "C1", CourseName: "Math", Instructor: "Dr. Smith", InstructorDept: "Math Dept", Grade: "A" },
  { StudentID: "S1", StudentName: "Alice", CourseID: "C2", CourseName: "Physics", Instructor: "Dr. Jones", InstructorDept: "Physics Dept", Grade: "B" },
  { StudentID: "S2", StudentName: "Bob", CourseID: "C1", CourseName: "Math", Instructor: "Dr. Smith", InstructorDept: "Math Dept", Grade: "C" },
  { StudentID: "S2", StudentName: "Bob", CourseID: "C3", CourseName: "Chemistry", Instructor: "Dr. Brown", InstructorDept: "Chem Dept", Grade: "A" },
  { StudentID: "S3", StudentName: "Charlie", CourseID: "C2", CourseName: "Physics", Instructor: "Dr. Jones", InstructorDept: "Physics Dept", Grade: "B" },
];

interface TableDef {
  name: string;
  headers: string[];
  rows: Record<string, string>[];
  pk: string[];
}

const NF_THEORY = [
  { nf: "1NF", title: "First Normal Form", desc: "Eliminate repeating groups. Each column must contain atomic (indivisible) values, and each row must be unique. No arrays or nested tables." },
  { nf: "2NF", title: "Second Normal Form", desc: "Remove partial dependencies. Every non-key column must depend on the entire primary key, not just part of it. Must already be in 1NF." },
  { nf: "3NF", title: "Third Normal Form", desc: "Remove transitive dependencies. Every non-key column must depend only on the primary key, not on other non-key columns. Must already be in 2NF." },
  { nf: "BCNF", title: "Boyce-Codd Normal Form", desc: "Every determinant must be a candidate key. A stricter version of 3NF where every functional dependency X → Y requires X to be a superkey." },
];

const STEP_INFO: Record<NormalStep, { label: string; desc: string; tables: TableDef[] }> = {
  0: {
    label: "Denormalized",
    desc: "A single table with redundant data. StudentName repeats for each course, InstructorDept repeats for each instructor. This leads to update anomalies and data inconsistency.",
    tables: [
      { name: "Student_Course", headers: ["StudentID", "StudentName", "CourseID", "CourseName", "Instructor", "InstructorDept", "Grade"], rows: DENORMALIZED_ROWS, pk: [] },
    ],
  },
  1: {
    label: "1NF",
    desc: "Removed repeating groups. Split into Student (student info) and Enrollment (student-course-grade) tables. Each cell is atomic, rows are unique per enrollment.",
    tables: [
      { name: "Student", headers: ["StudentID", "StudentName"], rows: [{ StudentID: "S1", StudentName: "Alice" }, { StudentID: "S2", StudentName: "Bob" }, { StudentID: "S3", StudentName: "Charlie" }], pk: ["StudentID"] },
      { name: "Enrollment", headers: ["StudentID", "CourseID", "CourseName", "Instructor", "InstructorDept", "Grade"], rows: [
        { StudentID: "S1", CourseID: "C1", CourseName: "Math", Instructor: "Dr. Smith", InstructorDept: "Math Dept", Grade: "A" },
        { StudentID: "S1", CourseID: "C2", CourseName: "Physics", Instructor: "Dr. Jones", InstructorDept: "Physics Dept", Grade: "B" },
        { StudentID: "S2", CourseID: "C1", CourseName: "Math", Instructor: "Dr. Smith", InstructorDept: "Math Dept", Grade: "C" },
        { StudentID: "S2", CourseID: "C3", CourseName: "Chemistry", Instructor: "Dr. Brown", InstructorDept: "Chem Dept", Grade: "A" },
        { StudentID: "S3", CourseID: "C2", CourseName: "Physics", Instructor: "Dr. Jones", InstructorDept: "Physics Dept", Grade: "B" },
      ], pk: ["StudentID", "CourseID"] },
    ],
  },
  2: {
    label: "2NF",
    desc: "Removed partial dependencies. Created Course table for course-specific info (CourseName, Instructor). Enrollment now stores only the grade, which depends on the full key (StudentID + CourseID).",
    tables: [
      { name: "Student", headers: ["StudentID", "StudentName"], rows: [{ StudentID: "S1", StudentName: "Alice" }, { StudentID: "S2", StudentName: "Bob" }, { StudentID: "S3", StudentName: "Charlie" }], pk: ["StudentID"] },
      { name: "Course", headers: ["CourseID", "CourseName", "Instructor", "InstructorDept"], rows: [
        { CourseID: "C1", CourseName: "Math", Instructor: "Dr. Smith", InstructorDept: "Math Dept" },
        { CourseID: "C2", CourseName: "Physics", Instructor: "Dr. Jones", InstructorDept: "Physics Dept" },
        { CourseID: "C3", CourseName: "Chemistry", Instructor: "Dr. Brown", InstructorDept: "Chem Dept" },
      ], pk: ["CourseID"] },
      { name: "Enrollment", headers: ["StudentID", "CourseID", "Grade"], rows: [
        { StudentID: "S1", CourseID: "C1", Grade: "A" },
        { StudentID: "S1", CourseID: "C2", Grade: "B" },
        { StudentID: "S2", CourseID: "C1", Grade: "C" },
        { StudentID: "S2", CourseID: "C3", Grade: "A" },
        { StudentID: "S3", CourseID: "C2", Grade: "B" },
      ], pk: ["StudentID", "CourseID"] },
    ],
  },
  3: {
    label: "3NF / BCNF",
    desc: "Removed transitive dependencies. InstructorDept depends on Instructor, not on CourseID. Moved Instructor into its own table. Now every non-key column depends solely on the key — fully normalized.",
    tables: [
      { name: "Student", headers: ["StudentID", "StudentName"], rows: [{ StudentID: "S1", StudentName: "Alice" }, { StudentID: "S2", StudentName: "Bob" }, { StudentID: "S3", StudentName: "Charlie" }], pk: ["StudentID"] },
      { name: "Course", headers: ["CourseID", "CourseName", "InstructorID"], rows: [
        { CourseID: "C1", CourseName: "Math", InstructorID: "I1" },
        { CourseID: "C2", CourseName: "Physics", InstructorID: "I2" },
        { CourseID: "C3", CourseName: "Chemistry", InstructorID: "I3" },
      ], pk: ["CourseID"] },
      { name: "Instructor", headers: ["InstructorID", "InstructorName", "InstructorDept"], rows: [
        { InstructorID: "I1", InstructorName: "Dr. Smith", InstructorDept: "Math Dept" },
        { InstructorID: "I2", InstructorName: "Dr. Jones", InstructorDept: "Physics Dept" },
        { InstructorID: "I3", InstructorName: "Dr. Brown", InstructorDept: "Chem Dept" },
      ], pk: ["InstructorID"] },
      { name: "Enrollment", headers: ["StudentID", "CourseID", "Grade"], rows: [
        { StudentID: "S1", CourseID: "C1", Grade: "A" },
        { StudentID: "S1", CourseID: "C2", Grade: "B" },
        { StudentID: "S2", CourseID: "C1", Grade: "C" },
        { StudentID: "S2", CourseID: "C3", Grade: "A" },
        { StudentID: "S3", CourseID: "C2", Grade: "B" },
      ], pk: ["StudentID", "CourseID"] },
    ],
  },
};

const SQL_STATEMENTS = `-- Fully Normalized Schema (3NF / BCNF)

CREATE TABLE Student (
    StudentID VARCHAR(10) PRIMARY KEY,
    StudentName VARCHAR(100) NOT NULL
);

CREATE TABLE Instructor (
    InstructorID VARCHAR(10) PRIMARY KEY,
    InstructorName VARCHAR(100) NOT NULL,
    InstructorDept VARCHAR(100) NOT NULL
);

CREATE TABLE Course (
    CourseID VARCHAR(10) PRIMARY KEY,
    CourseName VARCHAR(100) NOT NULL,
    InstructorID VARCHAR(10),
    FOREIGN KEY (InstructorID) REFERENCES Instructor(InstructorID)
);

CREATE TABLE Enrollment (
    StudentID VARCHAR(10),
    CourseID VARCHAR(10),
    Grade CHAR(2) NOT NULL,
    PRIMARY KEY (StudentID, CourseID),
    FOREIGN KEY (StudentID) REFERENCES Student(StudentID),
    FOREIGN KEY (CourseID) REFERENCES Course(CourseID)
);`;

const INTERVIEW_QUESTIONS = [
  { q: "What is the difference between 2NF and 3NF?", a: "2NF removes partial dependencies (where a non-key column depends on only part of a composite key). 3NF removes transitive dependencies (where a non-key column depends on another non-key column). A table in 3NF is always in 2NF, but not vice versa." },
  { q: "When would you denormalize a database on purpose?", a: "Denormalization is used for read-heavy workloads to avoid expensive JOIN operations. It improves query performance at the cost of data redundancy. Common in data warehouses, reporting systems, and NoSQL databases where read speed is critical." },
  { q: "What is a functional dependency and how does it relate to normalization?", a: "A functional dependency X → Y means that knowing X determines Y uniquely. Normalization uses functional dependencies to identify and remove redundancy. Each normal form targets specific types of problematic dependencies (partial, transitive, etc.)." },
  { q: "Can a table be in BCNF but not in 3NF?", a: "No. BCNF is stricter than 3NF, so any table in BCNF is automatically in 3NF (and 2NF and 1NF). However, a table can be in 3NF but not in BCNF if there exists a functional dependency where the determinant is not a candidate key." },
  { q: "What are update anomalies and how does normalization fix them?", a: "Update anomalies include: Insert anomaly (cannot insert data due to missing fields), Update anomaly (must update same data in multiple rows), Delete anomaly (deleting a row removes unintended data). Normalization eliminates redundancy so each fact is stored exactly once, preventing these anomalies." },
];

const NF_REQUIREMENTS = [
  { nf: "1NF", requirement: "Atomic values in each column", eliminates: "Repeating groups / multi-valued attributes" },
  { nf: "2NF", requirement: "1NF + full key dependency", eliminates: "Partial dependencies" },
  { nf: "3NF", requirement: "2NF + no transitive dependencies", eliminates: "Transitive dependencies" },
  { nf: "BCNF", requirement: "Every determinant is a candidate key", eliminates: "All anomalies from non-key determinants" },
];

function DataTable({ table, isDenormalized }: { table: TableDef; isDenormalized?: boolean }) {
  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-amber-600">
          <Table size={16} />
        </span>
        <h4 className="font-bold text-gray-900 text-sm">{table.name}</h4>
        {table.pk.length > 0 && (
          <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-mono">
            PK: {table.pk.join(", ")}
          </span>
        )}
      </div>
      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-amber-50 border-b border-gray-200">
              {table.headers.map((h) => (
                <th key={h} className="px-3 py-2 text-left font-semibold text-amber-900 whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {table.rows.map((row, i) => (
              <tr key={i} className={`border-b border-gray-100 ${i % 2 === 0 ? "bg-white" : "bg-gray-50/50"} hover:bg-amber-50/50 transition-colors`}>
                {table.headers.map((h) => {
                  const isRedundant = isDenormalized && (h === "StudentName" || h === "CourseName" || h === "Instructor" || h === "InstructorDept");
                  const isPk = table.pk.includes(h);
                  return (
                    <td key={h} className={`px-3 py-2 whitespace-nowrap ${isRedundant ? "text-amber-700 bg-amber-50" : ""} ${isPk ? "font-mono font-medium text-gray-900" : "text-gray-700"}`}>
                      {isPk && <KeyIcon />}
                      {row[h]}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function KeyIcon() {
  return <span className="text-amber-600 mr-1 text-xs">🔑 </span>;
}

export default function NormalizationPage() {
  const [step, setStep] = useState<NormalStep>(0);

  const showTables = (targetStep: NormalStep) => {
    const from = STEP_INFO[step];
    const to = STEP_INFO[targetStep];
    return (
      <div className="space-y-6">
        {to.tables.map((tbl) => {
          const isNew = targetStep > 0 && !from.tables.some((ft) => ft.name === tbl.name);
          const isModified = targetStep > 0 && from.tables.some((ft) => ft.name === tbl.name && (ft.headers.join() !== tbl.headers.join() || ft.rows.length !== tbl.rows.length));
          return (
            <div
              key={tbl.name}
              className={`relative p-4 rounded-lg border-2 transition-all ${
                isNew
                  ? "border-green-300 bg-green-50"
                  : isModified
                  ? "border-amber-300 bg-amber-50/30"
                  : "border-gray-200 bg-white"
              }`}
            >
              {isNew && (
                <span className="absolute -top-2.5 -right-2.5 bg-green-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow">
                  NEW
                </span>
              )}
              {isModified && (
                <span className="absolute -top-2.5 -right-2.5 bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow">
                  MODIFIED
                </span>
              )}
              <DataTable table={tbl} isDenormalized={targetStep === 0} />
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm font-medium text-gray-500 mb-8">
          <Link href="/tools/database" className="hover:text-amber-600 transition-colors">Database</Link>
          <ChevronRight size={14} className="text-gray-400" />
          <span className="text-amber-600 font-semibold">Normalization</span>
        </nav>

        {/* Hero */}
        <div className="mb-12">
          <div className="text-5xl mb-4">📐</div>
          <h1 className="text-4xl sm:text-5xl font-black text-gray-900 mb-4 leading-tight">Normalization Simulator</h1>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl leading-relaxed">
            Learn how database normalization eliminates redundancy through interactive examples. Step through 1NF, 2NF, 3NF, and BCNF transformations on real data.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">

            {/* Theory Section */}
            <section className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 sm:p-8">
              <div className="flex items-center gap-2 mb-6">
                <BookOpen size={20} className="text-amber-600" />
                <h2 className="text-2xl font-bold text-gray-900">Normal Forms Theory</h2>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                {NF_THEORY.map((nf) => (
                  <div key={nf.nf} className="border border-amber-200 rounded-lg p-4 bg-amber-50/40">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="bg-amber-600 text-white text-xs font-bold px-2 py-0.5 rounded">{nf.nf}</span>
                      <span className="font-bold text-gray-900 text-sm">{nf.title}</span>
                    </div>
                    <p className="text-sm text-gray-700 leading-relaxed">{nf.desc}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Interactive Simulator */}
            <section className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 sm:p-8">
              <div className="flex items-center gap-2 mb-6">
                <GitFork size={20} className="text-amber-600" />
                <h2 className="text-2xl font-bold text-gray-900">Interactive Simulator</h2>
              </div>

              {/* Controls */}
              <div className="flex flex-wrap gap-3 mb-8">
                <button
                  onClick={() => setStep(1)}
                  disabled={step >= 1}
                  className={`px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2 transition-all ${
                    step >= 1
                      ? "bg-green-100 text-green-700 cursor-default"
                      : "bg-amber-600 text-white hover:bg-amber-700 shadow-sm"
                  }`}
                >
                  {step >= 1 ? <CheckCircle2 size={16} /> : <ArrowRight size={16} />}
                  Apply 1NF
                </button>
                <button
                  onClick={() => setStep(2)}
                  disabled={step < 1 || step >= 2}
                  className={`px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2 transition-all ${
                    step >= 2
                      ? "bg-green-100 text-green-700 cursor-default"
                      : step < 1
                      ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                      : "bg-amber-600 text-white hover:bg-amber-700 shadow-sm"
                  }`}
                >
                  {step >= 2 ? <CheckCircle2 size={16} /> : <ArrowRight size={16} />}
                  Apply 2NF
                </button>
                <button
                  onClick={() => setStep(3)}
                  disabled={step < 2 || step >= 3}
                  className={`px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2 transition-all ${
                    step >= 3
                      ? "bg-green-100 text-green-700 cursor-default"
                      : step < 2
                      ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                      : "bg-amber-600 text-white hover:bg-amber-700 shadow-sm"
                  }`}
                >
                  {step >= 3 ? <CheckCircle2 size={16} /> : <ArrowRight size={16} />}
                  Apply 3NF
                </button>
                {step > 0 && (
                  <button
                    onClick={() => setStep(0)}
                    className="px-4 py-2 rounded-lg font-bold text-sm bg-gray-200 text-gray-700 hover:bg-gray-300 transition-all"
                  >
                    Reset
                  </button>
                )}
              </div>

              {/* Step Description */}
              <div className="mb-6 p-4 bg-amber-50 border-l-4 border-amber-500 rounded-r-lg">
                <div className="flex items-center gap-2 mb-1">
                  <Info size={16} className="text-amber-600" />
                  <span className="font-bold text-amber-900 text-sm">Step: {STEP_INFO[step].label}</span>
                </div>
                <p className="text-sm text-gray-700 leading-relaxed">{STEP_INFO[step].desc}</p>
              </div>

              {/* Tables Display */}
              {showTables(step)}
            </section>

            {/* SQL Code */}
            <section className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 sm:p-8">
              <div className="flex items-center gap-2 mb-6">
                <span className="text-2xl">💾</span>
                <h2 className="text-2xl font-bold text-gray-900">SQL Schema</h2>
              </div>
              <p className="text-sm text-gray-600 mb-4">CREATE TABLE statements for the fully normalized schema:</p>
              <div className="bg-gray-900 rounded-xl p-4 sm:p-6 overflow-x-auto">
                <pre className="text-green-400 text-xs sm:text-sm font-mono leading-relaxed whitespace-pre">{SQL_STATEMENTS}</pre>
              </div>
            </section>

            {/* Interview Questions */}
            <section className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 sm:p-8">
              <div className="flex items-center gap-2 mb-6">
                <span className="text-2xl">❓</span>
                <h2 className="text-2xl font-bold text-gray-900">Interview Questions</h2>
              </div>
              <div className="space-y-4">
                {INTERVIEW_QUESTIONS.map((item, i) => (
                  <details key={i} className="group border border-gray-200 rounded-lg overflow-hidden">
                    <summary className="flex items-center gap-2 p-4 cursor-pointer bg-gray-50 hover:bg-amber-50 transition-colors font-semibold text-gray-900 text-sm">
                      <span className="text-amber-600 font-mono text-xs bg-amber-100 px-2 py-0.5 rounded">Q{i + 1}</span>
                      {item.q}
                      <ChevronRight size={16} className="ml-auto text-gray-400 group-open:rotate-90 transition-transform" />
                    </summary>
                    <div className="p-4 pt-2 text-sm text-gray-700 leading-relaxed border-t border-gray-200 bg-white">
                      {item.a}
                    </div>
                  </details>
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-amber-50 rounded-xl border border-amber-200 p-6">
              <div className="flex items-center gap-2 mb-4">
                <Info size={16} className="text-amber-600" />
                <h3 className="font-bold text-amber-900 text-sm">Normal Form Requirements</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-amber-200">
                      <th className="text-left py-2 pr-2 font-bold text-amber-900">NF</th>
                      <th className="text-left py-2 px-2 font-bold text-amber-900">Requirement</th>
                      <th className="text-left py-2 pl-2 font-bold text-amber-900">Eliminates</th>
                    </tr>
                  </thead>
                  <tbody>
                    {NF_REQUIREMENTS.map((r, i) => (
                      <tr key={i} className="border-b border-amber-100">
                        <td className="py-2 pr-2 font-mono font-bold text-amber-700">{r.nf}</td>
                        <td className="py-2 px-2 text-gray-700">{r.requirement}</td>
                        <td className="py-2 pl-2 text-gray-600">{r.eliminates}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
              <h3 className="font-bold text-gray-900 mb-3 text-sm">Steps Summary</h3>
              <ul className="space-y-3 text-sm">
                {[
                  { step: "0 → 1NF", desc: "Atomic columns, split Student & Enrollment" },
                  { step: "1NF → 2NF", desc: "Create Course table, remove partial deps" },
                  { step: "2NF → 3NF", desc: "Create Instructor table, remove transitive deps" },
                  { step: "3NF → BCNF", desc: "All determinants are candidate keys" },
                ].map((s, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <ArrowRight size={14} className="text-amber-600 mt-0.5 shrink-0" />
                    <div>
                      <span className="font-semibold text-gray-900">{s.step}</span>
                      <p className="text-gray-600 text-xs">{s.desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
