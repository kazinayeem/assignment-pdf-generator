"use client";

import Link from "next/link";
import { ChevronRight, Table, Key, Link2, Sigma, BookOpen, Info } from "lucide-react";

const KEY_CONCEPTS = [
  { title: "Relation", desc: "A table with rows (tuples) and columns (attributes). Each relation has a unique name.", icon: Table },
  { title: "Tuple", desc: "A single row in a relation representing an entity or relationship instance.", icon: Table },
  { title: "Attribute", desc: "A named column of a relation describing a property of the entity.", icon: Table },
  { title: "Domain", desc: "The set of allowable values for an attribute (e.g., integer, string, date).", icon: Sigma },
  { title: "Key", desc: "A set of attributes that uniquely identifies a tuple. Includes candidate, primary, foreign keys.", icon: Key },
  { title: "Relationship", desc: "An association between relations. Implemented via foreign keys.", icon: Link2 },
];

const RELATION_PROPERTIES = [
  "Each relation has a unique name within the database schema",
  "Each cell contains exactly one atomic value (1NF compliant)",
  "Each attribute has a distinct name",
  "The order of attributes is irrelevant",
  "The order of tuples is irrelevant",
  "All tuples are distinct (no duplicate rows)",
  "Every attribute value comes from its defined domain",
];

const KEYS_TABLE = [
  { type: "Super Key", desc: "Set of attributes that uniquely identifies a tuple", example: "{StudentID}, {StudentID, Name}" },
  { type: "Candidate Key", desc: "Minimal super key (no unnecessary attributes)", example: "{StudentID}, {Email}" },
  { type: "Primary Key", desc: "Selected candidate key for the relation", example: "StudentID" },
  { type: "Foreign Key", desc: "References primary key of another relation", example: "CourseID in Enrollment table" },
  { type: "Composite Key", desc: "Primary key with two or more attributes", example: "{StudentID, CourseID}" },
  { type: "Alternate Key", desc: "Candidate keys not chosen as primary key", example: "Email (if StudentID is primary)" },
];

const RELATIONAL_ALGEBRA_OPS = [
  { name: "SELECT (σ)", desc: "Filter rows based on condition", syntax: "σ salary > 50000 (Employee)", icon: Sigma },
  { name: "PROJECT (π)", desc: "Select specific columns", syntax: "π name, salary (Employee)", icon: Table },
  { name: "UNION (∪)", desc: "Combine rows from two relations", syntax: "Students ∪ Teachers", icon: Link2 },
  { name: "INTERSECT (∩)", desc: "Rows common to both relations", syntax: "Students ∩ Teachers", icon: Link2 },
  { name: "DIFFERENCE (−)", desc: "Rows in first but not second", syntax: "Students − Teachers", icon: Link2 },
  { name: "JOIN (⋈)", desc: "Combine related rows from two relations", syntax: "Employee ⋈ Department", icon: Link2 },
  { name: "DIVISION (÷)", desc: "Rows in one relation matching all in another", syntax: "R1 ÷ R2", icon: Sigma },
  { name: "RENAME (ρ)", desc: "Rename relation or attribute", syntax: "ρ new_name (Relation)", icon: Key },
];

const INTERVIEW_QS = [
  { q: "What is a relation in the relational model?", a: "A relation is a table consisting of rows (tuples) and columns (attributes). Each relation represents an entity set or relationship." },
  { q: "What are the properties of a relation?", a: "Unique name, atomic values, distinct attribute names, unordered attributes and tuples, all tuples distinct, values from defined domains." },
  { q: "What is the difference between a primary key and a foreign key?", a: "Primary key uniquely identifies each tuple in its relation. Foreign key references the primary key of another relation to establish relationships." },
  { q: "What is referential integrity?", a: "A foreign key value must either match a primary key value in the referenced relation or be NULL. Ensures data consistency across relations." },
  { q: "What are the five basic operations in relational algebra?", a: "SELECT (σ) filters rows, PROJECT (π) selects columns, UNION (∪) combines relations, DIFFERENCE (−) subtracts relations, and RENAME (ρ) renames." },
];

export default function RelationalModelPage() {
  return (
    <div className="min-h-screen bg-gray-50 px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <div className="max-w-6xl mx-auto">
        {/* Breadcrumb */}
        <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-6">
          <Link href="/tools/database" className="hover:text-gray-700 transition-colors">Database</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-gray-700 font-semibold">Relational Model</span>
        </div>

        {/* Hero */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-6 mb-6">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-gray-900">🔗 Relational Model</h1>
          <p className="text-gray-500 text-xs sm:text-sm mt-1">Understand relations, keys, constraints, and relational algebra — the foundation of RDBMS.</p>
        </div>

        {/* Key Concepts */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
          {KEY_CONCEPTS.map((c) => {
            const Icon = c.icon;
            return (
              <div key={c.title} className="bg-white rounded-xl border border-gray-200 p-3 sm:p-4 text-center">
                <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-amber-500 mx-auto mb-2" />
                <h3 className="text-xs sm:text-sm font-bold text-gray-900 mb-1">{c.title}</h3>
                <p className="text-[10px] sm:text-xs text-gray-600 leading-relaxed">{c.desc}</p>
              </div>
            );
          })}
        </div>

        {/* Properties of a Relation */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-6 mb-6">
          <h2 className="text-sm sm:text-base font-black uppercase tracking-wider text-gray-700 mb-4 flex items-center gap-2">
            <Info className="w-4 h-4 text-amber-500" /> Properties of a Relation
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {RELATION_PROPERTIES.map((p, i) => (
              <div key={i} className="flex items-start gap-2 text-xs sm:text-sm text-gray-700">
                <span className="text-amber-500 font-bold shrink-0">•</span>
                <span>{p}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Keys Table */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-6 mb-6">
          <h2 className="text-sm sm:text-base font-black uppercase tracking-wider text-gray-700 mb-4 flex items-center gap-2">
            <Key className="w-4 h-4 text-amber-500" /> Types of Keys
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  {["Key Type", "Description", "Example"].map((h) => (
                    <th key={h} className="text-left py-2 px-2 sm:px-3 text-[9px] sm:text-[10px] font-black uppercase tracking-wider text-gray-400">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {KEYS_TABLE.map((k) => (
                  <tr key={k.type} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="py-2 px-2 sm:px-3 font-bold text-gray-800 text-xs sm:text-sm">{k.type}</td>
                    <td className="py-2 px-2 sm:px-3 text-gray-600 text-[11px] sm:text-xs">{k.desc}</td>
                    <td className="py-2 px-2 sm:px-3 text-gray-500 text-[11px] sm:text-xs font-mono">{k.example}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Relational Algebra */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-6 mb-6">
          <h2 className="text-sm sm:text-base font-black uppercase tracking-wider text-gray-700 mb-4 flex items-center gap-2">
            <Sigma className="w-4 h-4 text-amber-500" /> Relational Algebra Operations
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {RELATIONAL_ALGEBRA_OPS.map((op) => {
              const Icon = op.icon;
              return (
                <div key={op.name} className="p-3 sm:p-4 bg-gray-50 rounded-xl border border-gray-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Icon className="w-4 h-4 text-amber-500 shrink-0" />
                    <h3 className="text-xs sm:text-sm font-bold text-gray-900">{op.name}</h3>
                  </div>
                  <p className="text-[11px] sm:text-xs text-gray-600 mb-1">{op.desc}</p>
                  <code className="text-[10px] sm:text-xs text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded">{op.syntax}</code>
                </div>
              );
            })}
          </div>
        </div>

        {/* Interview Questions */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-6">
          <h2 className="text-xs sm:text-sm font-black uppercase tracking-wider text-gray-700 mb-4 flex items-center gap-2">
            <BookOpen className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-500" /> Interview Questions
          </h2>
          <div className="space-y-3">
            {INTERVIEW_QS.map((qa, i) => (
              <div key={i} className="p-3 sm:p-4 bg-amber-50 rounded-xl border border-amber-100">
                <p className="text-xs sm:text-sm font-bold text-gray-800 mb-1">Q{i + 1}: {qa.q}</p>
                <p className="text-[11px] sm:text-xs text-amber-700">A: {qa.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
