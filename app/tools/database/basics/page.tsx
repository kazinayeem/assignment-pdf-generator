"use client";

import Link from "next/link";
import { ChevronRight, Database, Server, FileText, Layers, BookOpen, Info } from "lucide-react";

const CORE_CONCEPTS = [
  { title: "DBMS", desc: "Software that manages databases — stores, retrieves, and processes data efficiently.", icon: Server, color: "amber" },
  { title: "Schema", desc: "The logical structure of a database — defines tables, columns, relationships, and constraints.", icon: FileText, color: "blue" },
  { title: "Data Models", desc: "How data is structured: Relational, Document, Key-Value, Graph, and Column-Family.", icon: Layers, color: "purple" },
  { title: "DDL vs DML", desc: "DDL defines structure (CREATE, ALTER). DML manipulates data (SELECT, INSERT, UPDATE, DELETE).", icon: Database, color: "emerald" },
];

const DBMS_TYPES = [
  { name: "Relational (RDBMS)", desc: "Data in tables with rows/columns. Uses SQL. Examples: MySQL, PostgreSQL, Oracle.", badge: "Most Popular" },
  { name: "NoSQL Document", desc: "Data stored as JSON-like documents. Examples: MongoDB, CouchDB.", badge: "Flexible Schema" },
  { name: "NoSQL Key-Value", desc: "Simple key-value pairs. Fast lookups. Examples: Redis, DynamoDB.", badge: "High Performance" },
  { name: "NoSQL Graph", desc: "Nodes & edges for connected data. Examples: Neo4j, ArangoDB.", badge: "Relationships" },
  { name: "Column-Family", desc: "Data in column families. Examples: Cassandra, HBase.", badge: "Big Data" },
];

const THREE_SCHEMA = [
  { level: "External Level", desc: "How individual users view the data. Multiple views for different users.", example: "A student sees only their grades, not all grades." },
  { level: "Conceptual Level", desc: "The community view — entire logical structure of the database.", example: "All tables, relationships, constraints defined." },
  { level: "Internal Level", desc: "Physical storage details — how data is stored on disk.", example: "File organization, indexes, data compression." },
];

const INTERVIEW_QS = [
  { q: "What is a database management system (DBMS)?", a: "A DBMS is software that enables users to define, create, maintain, and control access to databases. It acts as an intermediary between users and data." },
  { q: "What is the difference between DBMS and RDBMS?", a: "DBMS stores data as files, while RDBMS stores data in tables with relationships. RDBMS supports ACID transactions, normalization, and uses SQL." },
  { q: "Explain the three levels of data abstraction.", a: "External (user views), Conceptual (logical structure), Internal (physical storage). This provides data independence." },
  { q: "What is data independence?", a: "The ability to change the schema at one level without affecting the next level. Logical independence: changing conceptual schema without affecting external views. Physical independence: changing storage without affecting conceptual schema." },
  { q: "What are the advantages of using a DBMS?", a: "Data redundancy control, data consistency, data sharing, security enforcement, backup/recovery, concurrent access management, and data independence." },
];

export default function DatabaseBasicsPage() {
  return (
    <div className="min-h-screen bg-gray-50 px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <div className="max-w-6xl mx-auto">
        {/* Breadcrumb */}
        <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-6">
          <Link href="/tools/database" className="hover:text-gray-700 transition-colors">Database</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-gray-700 font-semibold">Database Basics</span>
        </div>

        {/* Hero */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-6 mb-6">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-gray-900">📚 Database Basics</h1>
          <p className="text-gray-500 text-xs sm:text-sm mt-1">Learn fundamental database concepts, DBMS architecture, and data models.</p>
        </div>

        {/* Core Concepts Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
          {CORE_CONCEPTS.map((c) => {
            const Icon = c.icon;
            const colors: Record<string, string> = {
              amber: "bg-amber-50 border-amber-200 text-amber-600",
              blue: "bg-blue-50 border-blue-200 text-blue-600",
              purple: "bg-purple-50 border-purple-200 text-purple-600",
              emerald: "bg-emerald-50 border-emerald-200 text-emerald-600",
            };
            return (
              <div key={c.title} className={`p-4 sm:p-5 rounded-xl border ${colors[c.color]} ${colors[c.color].split(" ")[0]}`}>
                <Icon className="w-5 h-5 sm:w-6 sm:h-6 mb-2" />
                <h3 className="text-sm sm:text-base font-bold text-gray-900 mb-1">{c.title}</h3>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">{c.desc}</p>
              </div>
            );
          })}
        </div>

        {/* DBMS Architecture - Three Schema */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-6 mb-6">
          <h2 className="text-sm sm:text-base font-black uppercase tracking-wider text-gray-700 mb-4 flex items-center gap-2">
            <Layers className="w-4 h-4 text-amber-500" /> Three-Schema Architecture
          </h2>
          <div className="space-y-3 sm:space-y-4">
            {THREE_SCHEMA.map((s, i) => (
              <div key={i} className={`p-3 sm:p-4 rounded-xl border ${i === 0 ? "bg-blue-50 border-blue-200" : i === 1 ? "bg-amber-50 border-amber-200" : "bg-gray-50 border-gray-200"}`}>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-black uppercase tracking-wider text-gray-500">{s.level}</span>
                  {i === 0 && <span className="text-[10px] px-1.5 py-0.5 bg-blue-200 text-blue-700 rounded-full font-bold">User View</span>}
                  {i === 1 && <span className="text-[10px] px-1.5 py-0.5 bg-amber-200 text-amber-700 rounded-full font-bold">Logical</span>}
                  {i === 2 && <span className="text-[10px] px-1.5 py-0.5 bg-gray-200 text-gray-700 rounded-full font-bold">Physical</span>}
                </div>
                <p className="text-xs sm:text-sm text-gray-700 mb-1">{s.desc}</p>
                <p className="text-[11px] sm:text-xs text-gray-500 italic">e.g., {s.example}</p>
              </div>
            ))}
          </div>
        </div>

        {/* DBMS Types */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-6 mb-6">
          <h2 className="text-sm sm:text-base font-black uppercase tracking-wider text-gray-700 mb-4 flex items-center gap-2">
            <Database className="w-4 h-4 text-amber-500" /> Types of DBMS
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {DBMS_TYPES.map((db) => (
              <div key={db.name} className="p-3 sm:p-4 bg-white rounded-xl border border-gray-200">
                <h3 className="text-xs sm:text-sm font-bold text-gray-900 mb-1">{db.name}</h3>
                <p className="text-[11px] sm:text-xs text-gray-600 mb-2">{db.desc}</p>
                <span className="text-[10px] px-2 py-0.5 bg-amber-50 text-amber-600 rounded-full font-bold">{db.badge}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Advantages */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-6 mb-6">
          <h2 className="text-sm sm:text-base font-black uppercase tracking-wider text-gray-700 mb-4 flex items-center gap-2">
            <Info className="w-4 h-4 text-amber-500" /> Advantages of DBMS
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
            {[
              "Controls data redundancy (minimizes duplication)",
              "Ensures data consistency across the system",
              "Enforces data integrity constraints",
              "Provides concurrent access with ACID transactions",
              "Offers data security with authentication/authorization",
              "Enables data independence (logical & physical)",
              "Supports backup and recovery mechanisms",
              "Reduces application development time",
            ].map((adv, i) => (
              <div key={i} className="flex items-start gap-2 text-xs sm:text-sm text-gray-700">
                <span className="text-amber-500 font-bold shrink-0">✓</span>
                <span>{adv}</span>
              </div>
            ))}
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
