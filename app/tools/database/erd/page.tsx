"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronRight, GitMerge, Table, ArrowRight, BookOpen, Info, Split } from "lucide-react";

type Entity = {
  name: string;
  pk: string;
  attributes: string[];
  bgColor: string;
  borderColor: string;
  headerBg: string;
  icon: string;
};

const ENTITIES: Entity[] = [
  {
    name: "Student",
    pk: "student_id",
    attributes: ["name", "email", "phone"],
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
    headerBg: "bg-blue-600",
    icon: "👤",
  },
  {
    name: "Course",
    pk: "course_id",
    attributes: ["title", "credits", "dept"],
    bgColor: "bg-green-50",
    borderColor: "border-green-200",
    headerBg: "bg-green-600",
    icon: "📖",
  },
  {
    name: "Instructor",
    pk: "instructor_id",
    attributes: ["name", "dept"],
    bgColor: "bg-purple-50",
    borderColor: "border-purple-200",
    headerBg: "bg-purple-600",
    icon: "👨‍🏫",
  },
  {
    name: "Enrollment",
    pk: "enrollment_id",
    attributes: ["grade", "semester"],
    bgColor: "bg-orange-50",
    borderColor: "border-orange-200",
    headerBg: "bg-orange-600",
    icon: "📋",
  },
];

const RELATIONSHIPS = [
  { from: "Student", to: "Enrollment", label: "enrolls in", cardinality: "M:N", via: "Enrollment (bridge)" },
  { from: "Enrollment", to: "Course", label: "has", cardinality: "M:N", desc: "Many students enroll in many courses" },
  { from: "Instructor", to: "Course", label: "teaches", cardinality: "1:M", desc: "One instructor teaches many courses" },
];

const RELATIONSHIP_TYPES = [
  {
    type: "One-to-One (1:1)",
    icon: "1️⃣",
    desc: "One entity instance relates to exactly one instance of another entity",
    example: "One student has exactly one student profile",
    sql: "Add UNIQUE constraint to foreign key",
  },
  {
    type: "One-to-Many (1:M)",
    icon: "1️⃣➡️📦",
    desc: "One entity instance relates to many instances of another entity",
    example: "One department has many employees",
    sql: "Place foreign key on the 'many' side table",
  },
  {
    type: "Many-to-Many (M:N)",
    icon: "📦📦",
    desc: "Many instances of one entity relate to many instances of another entity",
    example: "Many students enroll in many courses",
    sql: "Create a junction/bridge table with composite foreign keys",
  },
];

const INTERVIEW_QUESTIONS = [
  {
    q: "What is an Entity-Relationship Diagram (ERD)?",
    a: "An ERD is a visual representation of entities (objects/concepts) within a system and the relationships between them. It is used in database design to model the logical structure of a database before implementation.",
  },
  {
    q: "Explain the difference between strong and weak entities.",
    a: "A strong entity can exist independently and has its own primary key. A weak entity depends on a strong entity for its existence and does not have a primary key of its own — it uses a foreign key combined with a partial discriminator to form a primary key.",
  },
  {
    q: "What are cardinality constraints in ER modeling?",
    a: "Cardinality constraints define the maximum number of instances of one entity that can relate to instances of another entity. The three main types are: One-to-One (1:1), One-to-Many (1:M), and Many-to-Many (M:N). They define the structural constraints of relationships.",
  },
  {
    q: "How do you convert an M:N relationship into a relational schema?",
    a: "An M:N relationship cannot be directly represented. A bridge/junction table is created containing the primary keys of both related entities as composite foreign keys. For example, Enrollment bridges Student and Course with (student_id, course_id) as a composite primary key.",
  },
  {
    q: "What is the difference between an entity and an attribute?",
    a: "An entity is a real-world object or concept (e.g., Student, Course) that is stored as a table in the database. An attribute describes a property of an entity (e.g., student's name, email) and is stored as a column. While entities have an independent existence, attributes are always tied to an entity.",
  },
];

function EntityCard({ entity }: { entity: Entity }) {
  return (
    <div className={`${entity.bgColor} ${entity.borderColor} border-2 rounded-xl shadow-md min-w-[190px] overflow-hidden`}>
      <div className={`${entity.headerBg} px-4 py-2.5 flex items-center gap-2`}>
        <span className="text-lg">{entity.icon}</span>
        <h4 className="font-bold text-white text-sm">{entity.name}</h4>
      </div>
      <div className="p-3 space-y-1.5 text-xs">
        <div className="flex items-center gap-1.5 text-amber-700 font-semibold bg-amber-50 rounded px-2 py-1 border border-amber-200">
          <span className="text-[10px]">🔑</span>
          <span className="font-mono">{entity.pk}</span>
          <span className="text-[10px] text-amber-500 ml-auto">PK</span>
        </div>
        {entity.attributes.map((attr) => (
          <div key={attr} className="flex items-center gap-1.5 text-gray-700 px-2 py-0.5">
            <span className="text-gray-400">•</span>
            <span className="font-mono text-xs">{attr}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function HorizontalConnector({
  label,
  cardinality,
  showCardinalities,
}: {
  label: string;
  cardinality: string;
  showCardinalities: boolean;
}) {
  return (
    <div className="flex flex-col items-center mx-1 sm:mx-2 min-w-[80px]">
      <div className="relative w-full flex items-center">
        <div className="flex-1 h-0.5 bg-emerald-400" />
        <div className="w-0 h-0 border-l-[7px] border-l-emerald-400 border-t-[5px] border-t-transparent border-b-[5px] border-b-transparent" />
      </div>
      <span className="text-[11px] font-semibold text-gray-600 mt-1 whitespace-nowrap">{label}</span>
      {showCardinalities && (
        <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 mt-0.5">
          {cardinality}
        </span>
      )}
    </div>
  );
}

function VerticalConnector({
  label,
  cardinality,
  showCardinalities,
}: {
  label: string;
  cardinality: string;
  showCardinalities: boolean;
}) {
  return (
    <div className="flex flex-col items-center py-1">
      <div className="w-0.5 h-8 bg-emerald-400" />
      <div className="w-0 h-0 border-t-[7px] border-t-emerald-400 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent" />
      <span className="text-[11px] font-semibold text-gray-600 mt-1 whitespace-nowrap">{label}</span>
      {showCardinalities && (
        <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 mt-0.5">
          {cardinality}
        </span>
      )}
    </div>
  );
}

export default function ERDPage() {
  const [showCardinalities, setShowCardinalities] = useState(true);
  const [showSchema, setShowSchema] = useState(false);

  const getEntity = (name: string) => ENTITIES.find((e) => e.name === name)!;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-8">
          <Link href="/tools/database" className="text-emerald-600 hover:text-emerald-700 font-semibold">
            Database
          </Link>
          <ChevronRight size={14} />
          <span className="text-gray-800 font-semibold">ER Diagrams</span>
        </nav>

        {/* Hero */}
        <div className="mb-12">
          <h1 className="text-4xl sm:text-5xl font-black text-gray-900 mb-4">🗺️ ER Diagram Builder</h1>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl leading-relaxed">
            Design and visualize entity-relationship models for relational databases. Learn how entities, attributes,
            and relationships map to normalized database schemas.
          </p>
        </div>

        {/* Theory Section */}
        <section className="bg-white rounded-xl border-2 border-gray-200 p-6 sm:p-8 mb-8">
          <div className="flex items-center gap-3 mb-5">
            <BookOpen size={22} className="text-emerald-600" />
            <h2 className="text-2xl font-bold text-gray-900">ER Modeling Theory</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-bold text-blue-800 text-sm mb-2">📦 Entities</h3>
              <p className="text-xs text-blue-900 leading-relaxed">
                Real-world objects or concepts (e.g., Student, Course). Each entity becomes a table in the database.
              </p>
            </div>
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <h3 className="font-bold text-amber-800 text-sm mb-2">🏷️ Attributes</h3>
              <p className="text-xs text-amber-900 leading-relaxed">
                Properties describing an entity (e.g., name, email). Become columns in the table. Keys uniquely identify rows.
              </p>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="font-bold text-green-800 text-sm mb-2">🔗 Relationships</h3>
              <p className="text-xs text-green-900 leading-relaxed">
                Associations between entities (e.g., Student enrolls in Course). Defined by cardinality and participation.
              </p>
            </div>
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <h3 className="font-bold text-purple-800 text-sm mb-2">📐 Cardinalities</h3>
              <p className="text-xs text-purple-900 leading-relaxed">
                Define how many instances relate: 1:1, 1:M, or M:N. Determines foreign key placement in tables.
              </p>
            </div>
          </div>
        </section>

        {/* Interactive ERD Builder */}
        <section className="bg-white rounded-xl border-2 border-gray-200 p-6 sm:p-8 mb-8">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <GitMerge size={22} className="text-emerald-600" />
              <h2 className="text-2xl font-bold text-gray-900">University Management System ERD</h2>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowCardinalities((v) => !v)}
                className={`px-4 py-2 rounded-lg text-sm font-bold border-2 transition ${
                  showCardinalities
                    ? "bg-emerald-600 text-white border-emerald-600"
                    : "bg-white text-gray-600 border-gray-300 hover:border-emerald-400"
                }`}
              >
                {showCardinalities ? "Hide Cardinalities" : "Show Cardinalities"}
              </button>
              <button
                onClick={() => setShowSchema((v) => !v)}
                className={`px-4 py-2 rounded-lg text-sm font-bold border-2 transition flex items-center gap-2 ${
                  showSchema
                    ? "bg-emerald-600 text-white border-emerald-600"
                    : "bg-white text-gray-600 border-gray-300 hover:border-emerald-400"
                }`}
              >
                <Table size={16} />
                {showSchema ? "Hide Schema" : "Show Schema"}
              </button>
            </div>
          </div>

          {/* ERD Visual */}
          <div className="overflow-x-auto pb-4 -mx-2 sm:mx-0">
            <div className="min-w-[680px] px-2 sm:px-0">
              <div className="grid grid-cols-[auto_auto_auto_auto_auto] justify-items-center gap-y-3">
                {/* Row 1: Student → Enrollment → Course */}
                <div className="col-start-1 row-start-1">
                  <EntityCard entity={getEntity("Student")} />
                </div>
                <div className="col-start-2 row-start-1 self-center">
                  <HorizontalConnector label="enrolls in" cardinality="M:N" showCardinalities={showCardinalities} />
                </div>
                <div className="col-start-3 row-start-1">
                  <EntityCard entity={getEntity("Enrollment")} />
                </div>
                <div className="col-start-4 row-start-1 self-center">
                  <HorizontalConnector label="has" cardinality="M:N" showCardinalities={showCardinalities} />
                </div>
                <div className="col-start-5 row-start-1">
                  <EntityCard entity={getEntity("Course")} />
                </div>

                {/* Row 2: vertical connector under Course */}
                <div className="col-start-5 row-start-2 self-center">
                  <VerticalConnector label="teaches" cardinality="1:M" showCardinalities={showCardinalities} />
                </div>

                {/* Row 3: Instructor under Course */}
                <div className="col-start-5 row-start-3">
                  <EntityCard entity={getEntity("Instructor")} />
                </div>
              </div>
            </div>
          </div>

          {/* Relationship details */}
          <div className="mt-6 bg-gray-50 rounded-lg p-4 border border-gray-200">
            <div className="flex items-center gap-2 mb-3">
              <Info size={16} className="text-emerald-600" />
              <h3 className="font-bold text-gray-900 text-sm">Relationship Mapping</h3>
            </div>
            <div className="space-y-2 text-sm text-gray-700">
              {RELATIONSHIPS.map((r) => (
                <div key={r.label} className="flex items-start gap-2">
                  <span className="text-emerald-600 mt-0.5">•</span>
                  <div>
                    <span className="font-semibold">{r.from}</span>
                    <span className="text-gray-400 mx-1">—{r.label}→</span>
                    <span className="font-semibold">{r.to}</span>
                    <span className="text-gray-500 ml-2">({r.cardinality})</span>
                    {r.desc && <span className="text-gray-400 ml-2 text-xs">— {r.desc}</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Conditional: Relational Schema */}
          {showSchema && (
            <div className="mt-6 bg-gray-900 rounded-xl p-5 overflow-x-auto">
              <div className="flex items-center gap-2 mb-4">
                <Table size={18} className="text-emerald-400" />
                <h3 className="text-emerald-400 font-bold text-sm">Derived Relational Schema</h3>
              </div>
              <pre className="text-green-400 text-sm font-mono leading-relaxed">
{`CREATE TABLE Student (
    student_id  INT PRIMARY KEY,
    name        VARCHAR(100) NOT NULL,
    email       VARCHAR(100) UNIQUE NOT NULL,
    phone       VARCHAR(20)
);

CREATE TABLE Course (
    course_id   INT PRIMARY KEY,
    title       VARCHAR(200) NOT NULL,
    credits     INT NOT NULL,
    dept        VARCHAR(50)
);

CREATE TABLE Instructor (
    instructor_id  INT PRIMARY KEY,
    name           VARCHAR(100) NOT NULL,
    dept           VARCHAR(50)
);

-- Bridge table for M:N relationship
CREATE TABLE Enrollment (
    enrollment_id  INT PRIMARY KEY,
    student_id     INT NOT NULL,
    course_id      INT NOT NULL,
    grade          CHAR(2),
    semester       VARCHAR(20),
    FOREIGN KEY (student_id) REFERENCES Student(student_id),
    FOREIGN KEY (course_id) REFERENCES Course(course_id)
);

-- 1:M relationship: add FK to Course
ALTER TABLE Course
ADD COLUMN instructor_id INT,
ADD FOREIGN KEY (instructor_id) REFERENCES Instructor(instructor_id);`}
              </pre>
            </div>
          )}
        </section>

        {/* Relational Schema Section */}
        <section className="bg-white rounded-xl border-2 border-gray-200 p-6 sm:p-8 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <Table size={22} className="text-emerald-600" />
            <h2 className="text-2xl font-bold text-gray-900">Relational Schema from ERD</h2>
          </div>
          <p className="text-gray-700 mb-6">
            Converting an ER diagram to a relational schema follows these rules:
          </p>
          <div className="grid sm:grid-cols-3 gap-4 mb-6">
            <div className="border-l-4 border-emerald-500 pl-4">
              <h3 className="font-bold text-gray-900 text-sm mb-1">Strong Entities</h3>
              <p className="text-xs text-gray-600">Become tables directly. Primary key of the entity becomes the table's PK.</p>
            </div>
            <div className="border-l-4 border-amber-500 pl-4">
              <h3 className="font-bold text-gray-900 text-sm mb-1">1:M Relationships</h3>
              <p className="text-xs text-gray-600">Add PK of the "1" side as a foreign key in the "M" side table.</p>
            </div>
            <div className="border-l-4 border-blue-500 pl-4">
              <h3 className="font-bold text-gray-900 text-sm mb-1">M:N Relationships</h3>
              <p className="text-xs text-gray-600">Create a bridge table with composite PKs referencing both entities.</p>
            </div>
          </div>
          <div className="bg-gray-900 rounded-xl p-5 overflow-x-auto">
            <pre className="text-green-400 text-sm font-mono leading-relaxed">
{`-- Entities (strong)
Student(student_id PK, name, email, phone)
Course(course_id PK, title, credits, dept, instructor_id FK→Instructor)
Instructor(instructor_id PK, name, dept)

-- Bridge table (M:N)
Enrollment(enrollment_id PK, student_id FK→Student, course_id FK→Course, grade, semester)`}
            </pre>
          </div>
        </section>

        {/* Relationship Types Reference */}
        <section className="bg-white rounded-xl border-2 border-gray-200 p-6 sm:p-8 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <Split size={22} className="text-emerald-600" />
            <h2 className="text-2xl font-bold text-gray-900">Relationship Types Reference</h2>
          </div>
          <div className="grid sm:grid-cols-3 gap-5">
            {RELATIONSHIP_TYPES.map((rt) => (
              <div key={rt.type} className="border-2 border-gray-200 rounded-xl p-5 hover:border-emerald-300 transition">
                <div className="text-2xl mb-3">{rt.icon}</div>
                <h3 className="font-bold text-gray-900 text-sm mb-2">{rt.type}</h3>
                <p className="text-xs text-gray-600 mb-3 leading-relaxed">{rt.desc}</p>
                <div className="bg-gray-50 rounded-lg p-3 mb-2">
                  <p className="text-xs text-gray-500 font-medium mb-1">Example:</p>
                  <p className="text-xs text-gray-800">{rt.example}</p>
                </div>
                <div className="bg-emerald-50 rounded-lg p-3">
                  <p className="text-xs text-emerald-700 font-medium mb-1">SQL Rule:</p>
                  <p className="text-xs text-emerald-800">{rt.sql}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Interview Questions */}
        <section className="bg-white rounded-xl border-2 border-gray-200 p-6 sm:p-8 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <BookOpen size={22} className="text-emerald-600" />
            <h2 className="text-2xl font-bold text-gray-900">Interview Questions</h2>
          </div>
          <div className="space-y-4">
            {INTERVIEW_QUESTIONS.map((item, i) => (
              <details key={i} className="group border-2 border-gray-200 rounded-xl overflow-hidden">
                <summary className="flex items-center gap-3 p-4 cursor-pointer bg-gray-50 hover:bg-gray-100 transition list-none">
                  <span className="flex-shrink-0 w-7 h-7 rounded-full bg-emerald-600 text-white text-xs font-bold flex items-center justify-center">
                    {i + 1}
                  </span>
                  <span className="font-semibold text-gray-900 text-sm flex-1">{item.q}</span>
                  <ChevronRight size={18} className="text-gray-400 group-open:rotate-90 transition flex-shrink-0" />
                </summary>
                <div className="p-4 pt-2 border-t border-gray-200">
                  <p className="text-sm text-gray-700 leading-relaxed">{item.a}</p>
                </div>
              </details>
            ))}
          </div>
        </section>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <Link
            href="/tools/database"
            className="inline-flex items-center gap-2 text-sm font-bold text-emerald-600 hover:text-emerald-700 transition"
          >
            <ArrowRight size={16} className="rotate-180" />
            Back to Database
          </Link>
          <Link
            href="/tools/database/normalization"
            className="inline-flex items-center gap-2 text-sm font-bold text-emerald-600 hover:text-emerald-700 transition"
          >
            Next: Normalization
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
}
