"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronRight, Zap, BarChart3, Cpu, BookOpen, Play, RotateCcw, ArrowRight } from "lucide-react";

type QueryPlan = {
  id: string;
  name: string;
  description: string;
  cost: number;
  rows: number;
  steps: string[];
};

const QUERIES = [
  {
    sql: "SELECT * FROM employees WHERE salary > 50000",
    plans: [
      { id: "full-scan", name: "Full Table Scan", description: "Scans all rows sequentially", cost: 1000, rows: 10000, steps: ["Seq Scan on employees", "Filter: salary > 50000", "Return 500 rows"] },
      { id: "index-scan", name: "Index Scan", description: "Uses B-tree index on salary", cost: 150, rows: 10000, steps: ["Index Scan (idx_salary)", "Fetch 500 rows", "Return result"] },
    ],
  },
  {
    sql: "SELECT e.name, d.dept_name FROM employees e JOIN departments d ON e.dept_id = d.id WHERE d.location = 'Dhaka'",
    plans: [
      { id: "nl-join", name: "Nested Loop Join", description: "For each employee, scan departments", cost: 2000, rows: 100, steps: ["Seq Scan on employees (filter employees)", "For each: Seq Scan on departments", "Nested Loop Join", "Filter: location = 'Dhaka'"] },
      { id: "hash-join", name: "Hash Join", description: "Hash departments, then probe", cost: 400, rows: 100, steps: ["Seq Scan on departments", "Hash Join", "Filter: location = 'Dhaka'", "Return 80 rows"] },
      { id: "merge-join", name: "Merge Join", description: "Sort both, then merge", cost: 300, rows: 100, steps: ["Sort employees by dept_id", "Sort departments by id", "Merge Join", "Filter: location = 'Dhaka'"] },
    ],
  },
  {
    sql: "SELECT department, COUNT(*) FROM employees GROUP BY department HAVING COUNT(*) > 5",
    plans: [
      { id: "sort-aggr", name: "Sort + Aggregate", description: "Sort then group", cost: 1200, rows: 10000, steps: ["Seq Scan on employees", "Sort by department", "HashAggregate", "Filter: count > 5"] },
      { id: "hash-aggr", name: "Hash Aggregate", description: "Hash-based grouping", cost: 800, rows: 10000, steps: ["Seq Scan on employees", "HashAggregate", "Filter: count > 5"] },
    ],
  },
];

const OPTIMIZATION_TIPS = [
  { title: "Use Indexes", desc: "Create indexes on columns used in WHERE, JOIN, and ORDER BY clauses to avoid full table scans.", icon: Zap },
  { title: "Avoid SELECT *", desc: "Only select columns you need. Reduces I/O and network overhead significantly.", icon: BarChart3 },
  { title: "Use EXPLAIN ANALYZE", desc: "Always analyze query execution plans to understand bottlenecks before optimizing.", icon: Cpu },
  { title: "Optimize JOINs", desc: "Join on indexed columns. Smaller table should be the inner table in nested loop joins.", icon: Zap },
  { title: "Use LIMIT", desc: "Add LIMIT clauses to reduce result set size, especially during development and testing.", icon: BarChart3 },
  { title: "Partition Large Tables", desc: "Split large tables into partitions based on key columns for faster query pruning.", icon: Cpu },
];

const INTERVIEW_QS = [
  { q: "What is a query execution plan?", a: "A query execution plan is a sequence of steps the database engine follows to execute a query. It shows how tables are accessed, joined, sorted, and aggregated." },
  { q: "How does an index improve query performance?", a: "Indexes allow the database to locate data without scanning the entire table. B-tree indexes reduce search complexity from O(n) to O(log n)." },
  { q: "What is the difference between a nested loop join and a hash join?", a: "Nested loop join iterates through one table and matches each row with the other table. Hash join builds a hash table on one table and probes the other. Hash join is better for large unsorted data." },
  { q: "What is query cost in database terms?", a: "Query cost is a relative measure of resources needed to execute a query, including CPU time, I/O operations, and memory usage. The optimizer chooses the lowest-cost plan." },
  { q: "How does query optimization work?", a: "The query optimizer parses SQL, generates multiple execution plans, estimates costs using table statistics, and selects the cheapest plan. Modern optimizers use cost-based optimization (CBO) or rule-based optimization (RBO)." },
];

export default function QueryOptimizationPage() {
  const [selectedQuery, setSelectedQuery] = useState(0);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [showPlan, setShowPlan] = useState(false);

  const current = QUERIES[selectedQuery];

  return (
    <div className="min-h-screen bg-gray-50 px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <div className="max-w-6xl mx-auto">
        {/* Breadcrumb */}
        <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-6">
          <Link href="/tools/database" className="hover:text-gray-700 transition-colors">Database</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-gray-700 font-semibold">Query Optimization</span>
        </div>

        {/* Hero */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-6 mb-6">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-gray-900">🚀 Query Optimization</h1>
          <p className="text-gray-500 text-xs sm:text-sm mt-1">Learn how databases execute queries and optimize them for maximum performance.</p>
        </div>

        {/* Optimization Tips */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
          {OPTIMIZATION_TIPS.map((tip) => {
            const Icon = tip.icon;
            return (
              <div key={tip.title} className="bg-white rounded-xl border border-gray-200 p-3 sm:p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Icon className="w-4 h-4 text-amber-500" />
                  <h3 className="text-xs sm:text-sm font-bold text-gray-900">{tip.title}</h3>
                </div>
                <p className="text-[11px] sm:text-xs text-gray-600 leading-relaxed">{tip.desc}</p>
              </div>
            );
          })}
        </div>

        {/* Query Plan Explorer */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-6 mb-6">
          <h2 className="text-sm sm:text-base font-black uppercase tracking-wider text-gray-700 mb-4 flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-amber-500" /> Query Plan Explorer
          </h2>

          {/* Query Selector */}
          <div className="flex flex-wrap gap-2 mb-4">
            {QUERIES.map((q, i) => (
              <button key={i} onClick={() => { setSelectedQuery(i); setSelectedPlan(null); setShowPlan(false); }}
                className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-[11px] sm:text-sm font-bold border transition-all ${selectedQuery === i ? "bg-amber-600 text-white border-amber-600" : "bg-white text-gray-600 border-gray-200 hover:border-amber-300"}`}>
                Query {i + 1}
              </button>
            ))}
          </div>

          {/* Current Query */}
          <div className="bg-gray-900 text-green-400 p-3 sm:p-4 rounded-xl font-mono text-xs sm:text-sm mb-4 overflow-x-auto">
            {current.sql}
          </div>

          {/* Plan Buttons */}
          <div className="flex flex-wrap gap-2 sm:gap-3 mb-4">
            {current.plans.map((plan) => (
              <button key={plan.id} onClick={() => { setSelectedPlan(plan.id); setShowPlan(true); }}
                className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-[11px] sm:text-sm font-bold border transition-all ${selectedPlan === plan.id ? "bg-amber-600 text-white border-amber-600" : "bg-white text-gray-600 border-gray-200 hover:border-amber-300"}`}>
                {plan.name}
              </button>
            ))}
            <button onClick={() => { setSelectedPlan(null); setShowPlan(false); }}
              className="flex items-center gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl bg-gray-100 text-gray-600 text-[11px] sm:text-sm font-bold hover:bg-gray-200 transition">
              <RotateCcw className="w-3 h-3" /> Reset
            </button>
          </div>

          {/* Plan Details */}
          {showPlan && selectedPlan && (
            <div className="space-y-3">
              {current.plans.filter(p => p.id === selectedPlan).map((plan) => (
                <div key={plan.id}>
                  {/* Cost Comparison */}
                  <div className="flex flex-wrap gap-3 sm:gap-4 mb-4">
                    {current.plans.map((p) => (
                      <div key={p.id} className={`flex-1 min-w-[120px] p-3 rounded-xl border ${p.id === selectedPlan ? "bg-amber-50 border-amber-300" : "bg-gray-50 border-gray-200"}`}>
                        <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1">{p.name}</p>
                        <p className="text-lg sm:text-xl font-black text-gray-900">Cost: {p.cost}</p>
                        <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                          <div className={`h-2 rounded-full ${p.id === selectedPlan ? "bg-amber-500" : "bg-gray-300"}`} style={{ width: `${Math.min(100, (p.cost / Math.max(...current.plans.map(x => x.cost))) * 100)}%` }} />
                        </div>
                        <p className="text-[10px] text-gray-500 mt-1">Rows: {p.rows.toLocaleString()}</p>
                      </div>
                    ))}
                  </div>

                  <p className="text-xs sm:text-sm text-gray-700 mb-2">{plan.description}</p>

                  {/* Step-by-step */}
                  <div className="bg-gray-50 rounded-xl border border-gray-200 p-3 sm:p-4">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-2">Execution Steps</p>
                    {plan.steps.map((step, i) => (
                      <div key={i} className="flex items-start gap-2 text-[11px] sm:text-xs text-gray-700 py-1 border-b border-gray-100 last:border-0">
                        <span className="text-amber-500 font-bold shrink-0">{i + 1}.</span>
                        <span>{step}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {!showPlan && (
            <div className="p-4 sm:p-6 bg-amber-50 rounded-xl border border-amber-200 text-center">
              <p className="text-xs sm:text-sm text-amber-700">Click a query plan to see the execution details and cost comparison</p>
            </div>
          )}
        </div>

        {/* Explanation */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-6 mb-6">
          <h2 className="text-sm sm:text-base font-black uppercase tracking-wider text-gray-700 mb-4">How Query Optimization Works</h2>
          <div className="space-y-3 text-xs sm:text-sm text-gray-600 leading-relaxed">
            <p><strong className="text-gray-900">1. Parsing:</strong> The SQL query is parsed into a parse tree, checked for syntax errors, and validated against the schema.</p>
            <p><strong className="text-gray-900">2. Optimization:</strong> The optimizer generates multiple execution plans using different join algorithms, access paths, and operation orders. It estimates costs using table statistics.</p>
            <p><strong className="text-gray-900">3. Execution:</strong> The cheapest plan is selected and executed by the query executor. Results are returned to the client.</p>
            <p><strong className="text-gray-900">4. Statistics:</strong> Modern databases use ANALYZE to collect statistics (row count, data distribution, NULL fraction) for accurate cost estimation.</p>
          </div>
        </div>

        {/* Join Methods Comparison */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-6 mb-6">
          <h2 className="text-sm sm:text-base font-black uppercase tracking-wider text-gray-700 mb-4">Join Methods Comparison</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  {["Method", "Best When", "Complexity", "Memory Usage"].map((h) => (
                    <th key={h} className="text-left py-2 px-2 sm:px-3 text-[9px] sm:text-[10px] font-black uppercase tracking-wider text-gray-400">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  ["Nested Loop Join", "Small outer table, indexed inner", "O(n × m)", "Low"],
                  ["Hash Join", "Large unsorted tables", "O(n + m)", "High"],
                  ["Merge Join", "Sorted inputs", "O(n + m)", "Medium"],
                ].map((row) => (
                  <tr key={row[0]} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="py-2 px-2 sm:px-3 font-bold text-gray-800">{row[0]}</td>
                    <td className="py-2 px-2 sm:px-3 text-gray-600 text-[11px] sm:text-xs">{row[1]}</td>
                    <td className="py-2 px-2 sm:px-3 font-mono text-amber-600 text-[11px] sm:text-xs">{row[2]}</td>
                    <td className="py-2 px-2 sm:px-3 text-gray-500 text-[11px] sm:text-xs">{row[3]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
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
