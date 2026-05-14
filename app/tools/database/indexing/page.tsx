"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import Link from "next/link";
import {
  ChevronRight,
  GitBranch,
  Table,
  Search,
  BookOpen,
  Zap,
  BarChart3,
} from "lucide-react";

type BTreeNode = {
  keys: number[];
  children?: BTreeNode[];
};

const EMPLOYEES = [
  { id: 1, name: "Alice", salary: 45000, dept: "Engineering" },
  { id: 2, name: "Bob", salary: 55000, dept: "Marketing" },
  { id: 3, name: "Charlie", salary: 62000, dept: "Engineering" },
  { id: 4, name: "Diana", salary: 75000, dept: "Finance" },
  { id: 5, name: "Eve", salary: 48000, dept: "HR" },
  { id: 6, name: "Frank", salary: 82000, dept: "Engineering" },
  { id: 7, name: "Grace", salary: 39000, dept: "Marketing" },
  { id: 8, name: "Henry", salary: 92000, dept: "Finance" },
];

const SEARCH_SALARY = 75000;

const B_TREE: BTreeNode = {
  keys: [62000],
  children: [
    {
      keys: [48000],
      children: [
        { keys: [39000, 45000], children: [] },
        { keys: [48000, 55000], children: [] },
      ],
    },
    {
      keys: [82000],
      children: [
        { keys: [62000, 75000], children: [] },
        { keys: [92000], children: [] },
      ],
    },
  ],
};

function getSearchPathKeys(node: BTreeNode, target: number, path: number[]): number[] | null {
  path.push(...node.keys);
  if (node.keys.includes(target)) return path;
  if (!node.children || node.children.length === 0) return null;
  let idx = 0;
  while (idx < node.keys.length && target > node.keys[idx]) idx++;
  const found = getSearchPathKeys(node.children[idx], target, []);
  if (found) { path.push(...found); return path; }
  return null;
}

const SEARCH_PATH_KEYS = getSearchPathKeys(B_TREE, SEARCH_SALARY, []) ?? [];

type AnimStep = {
  label: string;
  tree: BTreeNode;
};

const ANIMATION_STEPS: AnimStep[] = [
  {
    label: "Insert 39000 — start with root node",
    tree: { keys: [39000], children: [] },
  },
  {
    label: "Insert 45000 — keys sorted in the node",
    tree: { keys: [39000, 45000], children: [] },
  },
  {
    label: "Insert 48000 — node overflow! Splitting...",
    tree: {
      keys: [45000],
      children: [
        { keys: [39000], children: [] },
        { keys: [48000], children: [] },
      ],
    },
  },
  {
    label: "Insert 55000, 62000 — tree grows deeper",
    tree: {
      keys: [45000, 55000],
      children: [
        { keys: [39000], children: [] },
        { keys: [48000], children: [] },
        { keys: [62000], children: [] },
      ],
    },
  },
  {
    label: "Insert 75000, 82000 — more splits needed",
    tree: {
      keys: [62000],
      children: [
        {
          keys: [45000],
          children: [
            { keys: [39000], children: [] },
            { keys: [48000, 55000], children: [] },
          ],
        },
        {
          keys: [75000, 82000],
          children: [
            { keys: [62000], children: [] },
            { keys: [75000], children: [] },
            { keys: [82000], children: [] },
          ],
        },
      ],
    },
  },
  {
    label: "Insert 92000 — final balanced B-Tree",
    tree: B_TREE,
  },
];

function TreeNodeView({
  node,
  highlightKeys,
}: {
  node: BTreeNode;
  highlightKeys: number[];
}) {
  const isHot = node.keys.some((k) => highlightKeys.includes(k));
  const hasKids = node.children && node.children.length > 0;

  return (
    <div className="flex flex-col items-center">
      <div
        className={`relative px-3 py-1.5 rounded-lg border-2 font-bold text-[11px] sm:text-xs whitespace-nowrap transition-colors duration-300 ${
          isHot
            ? "bg-amber-100 border-amber-500 text-amber-900 shadow-md shadow-amber-200/50 scale-105"
            : "bg-white border-gray-300 text-gray-700"
        }`}
      >
        {node.keys.map((k, i) => (
          <span key={k}>
            {i > 0 && (
              <span className="mx-0.5 text-gray-400 font-normal">|</span>
            )}
            <span
              className={
                highlightKeys.includes(k)
                  ? "text-amber-600 font-extrabold"
                  : ""
              }
            >
              {k.toLocaleString()}
            </span>
          </span>
        ))}
      </div>

      {hasKids && (
        <div className="relative flex flex-col items-center mt-1.5">
          <div className="w-px h-3 bg-gray-300" />
          <div className="relative flex items-start">
            <div className="absolute top-0 left-[10%] right-[10%] h-px bg-gray-300" />
            <div className="flex gap-2 sm:gap-4 pt-px">
              {node.children!.map((child, i) => (
                <div key={i} className="flex flex-col items-center">
                  <div className="w-px h-3 bg-gray-300" />
                  <TreeNodeView node={child} highlightKeys={highlightKeys} />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function IndexingPage() {
  const [hasIndex, setHasIndex] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [animStep, setAnimStep] = useState(0);
  const [animRunning, setAnimRunning] = useState(false);
  const animTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => {
      if (animTimer.current) clearInterval(animTimer.current);
    };
  }, []);

  const startAnimation = useCallback(() => {
    setAnimRunning(true);
    setAnimStep(0);
    if (animTimer.current) clearInterval(animTimer.current);
    animTimer.current = setInterval(() => {
      setAnimStep((prev) => {
        if (prev >= ANIMATION_STEPS.length - 1) {
          if (animTimer.current) clearInterval(animTimer.current);
          setAnimRunning(false);
          return prev;
        }
        return prev + 1;
      });
    }, 1200);
  }, []);

  const resetAnimation = useCallback(() => {
    if (animTimer.current) {
      clearInterval(animTimer.current);
      animTimer.current = null;
    }
    setAnimRunning(false);
    setAnimStep(0);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 px-4 sm:px-6 lg:px-8 py-8">
      <style>{`
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 0 0 rgba(245, 158, 11, 0.4); }
          50% { box-shadow: 0 0 0 6px rgba(245, 158, 11, 0); }
        }
        .anim-pulse-glow { animation: pulse-glow 1.2s ease-in-out infinite; }
      `}</style>

      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-6">
          <Link
            href="/tools/database"
            className="hover:text-gray-700 transition-colors"
          >
            Database
          </Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-gray-700 font-semibold">
            Indexing &amp; Storage
          </span>
        </div>

        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-gray-900 mb-2">
            ⚡ Indexing Visualizer
          </h1>
          <p className="text-sm sm:text-base text-gray-600 max-w-3xl leading-relaxed">
            Database indexes are special lookup tables that the database search
            engine can use to speed up data retrieval. Learn how B-tree, Hash,
            and Bitmap indexes work under the hood.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-6 mb-6">
          <div className="flex items-center gap-2 mb-3">
            <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600" />
            <h2 className="text-sm sm:text-base font-black uppercase tracking-wider text-gray-500">
              How Indexes Work
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-gray-600 leading-relaxed mb-3">
            An index is a data structure (like a B-tree, Hash table, or Bitmap)
            that stores a copy of selected columns, organized for fast lookup.
            Without an index, the database must perform a{" "}
            <strong className="text-gray-800">full table scan</strong> — reading
            every row. With an index, it can locate rows in{" "}
            <strong className="text-gray-800">
              O(log n) or O(1) time
            </strong>
            .
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4">
            {[
              {
                title: "B-Tree Index",
                desc: "Balanced tree structure. Best for range queries, sorting, and general-purpose indexing. Default in most databases.",
                color: "amber",
              },
              {
                title: "Hash Index",
                desc: "Uses a hash function on the key. Best for exact-match equality lookups. Not suitable for range queries.",
                color: "green",
              },
              {
                title: "Bitmap Index",
                desc: "Uses bit arrays (bitmaps) for each distinct value. Best for low-cardinality columns like gender or status.",
                color: "blue",
              },
            ].map((c) => (
              <div
                key={c.title}
                className={`p-3 sm:p-4 rounded-xl border ${
                  c.color === "amber"
                    ? "bg-amber-50 border-amber-200"
                    : c.color === "green"
                    ? "bg-green-50 border-green-200"
                    : "bg-blue-50 border-blue-200"
                }`}
              >
                <h3 className="font-black text-xs sm:text-sm text-gray-900 mb-1">
                  {c.title}
                </h3>
                <p className="text-[11px] sm:text-xs text-gray-600 leading-relaxed">
                  {c.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600" />
            <h2 className="text-sm sm:text-base font-black uppercase tracking-wider text-gray-500">
              Interactive Indexing Simulator
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-2 mb-4">
            <button
              onClick={() => {
                setHasIndex(false);
                setShowSearch(false);
              }}
              className={`px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-bold rounded-lg transition-colors ${
                !hasIndex
                  ? "bg-amber-600 text-white shadow-sm"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              <Table className="inline w-3 h-3 sm:w-4 sm:h-4 mr-1" />
              Without Index
            </button>
            <button
              onClick={() => {
                setHasIndex(true);
                setShowSearch(false);
              }}
              className={`px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-bold rounded-lg transition-colors ${
                hasIndex
                  ? "bg-amber-600 text-white shadow-sm"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              <GitBranch className="inline w-3 h-3 sm:w-4 sm:h-4 mr-1" />
              With B-Tree Index
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            <div className="overflow-x-auto">
              <table className="w-full text-xs sm:text-sm border-collapse">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="text-left py-2 px-2 sm:px-3 font-black text-[10px] sm:text-xs uppercase tracking-wider text-gray-400">
                      ID
                    </th>
                    <th className="text-left py-2 px-2 sm:px-3 font-black text-[10px] sm:text-xs uppercase tracking-wider text-gray-400">
                      Name
                    </th>
                    <th className="text-left py-2 px-2 sm:px-3 font-black text-[10px] sm:text-xs uppercase tracking-wider text-gray-400">
                      Salary
                    </th>
                    <th className="text-left py-2 px-2 sm:px-3 font-black text-[10px] sm:text-xs uppercase tracking-wider text-gray-400">
                      Department
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {EMPLOYEES.map((emp) => {
                    const isTarget = showSearch && emp.salary === SEARCH_SALARY;
                    return (
                      <tr
                        key={emp.id}
                        className={`border-b border-gray-100 transition-colors ${
                          isTarget ? "bg-amber-100" : "hover:bg-gray-50"
                        }`}
                      >
                        <td className="py-2 px-2 sm:px-3 text-gray-600">
                          {emp.id}
                        </td>
                        <td className="py-2 px-2 sm:px-3 font-medium text-gray-800">
                          {emp.name}
                        </td>
                        <td className="py-2 px-2 sm:px-3 font-mono text-gray-700">
                          ${emp.salary.toLocaleString()}
                        </td>
                        <td className="py-2 px-2 sm:px-3 text-gray-600">
                          {emp.dept}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="flex flex-col">
              {hasIndex ? (
                <div className="bg-gray-50 rounded-xl border border-gray-200 p-3 sm:p-4 min-h-[200px] flex items-start justify-center overflow-x-auto">
                  <TreeNodeView
                    node={B_TREE}
                    highlightKeys={showSearch ? SEARCH_PATH_KEYS : []}
                  />
                </div>
              ) : (
                <div className="bg-gray-50 rounded-xl border border-gray-200 p-3 sm:p-4 min-h-[200px] flex items-center justify-center">
                  <div className="text-center text-gray-400">
                    <Table className="w-8 h-8 sm:w-10 sm:h-10 mx-auto mb-2 opacity-50" />
                    <p className="text-xs sm:text-sm font-medium">
                      Full Table Scan
                    </p>
                    <p className="text-[10px] sm:text-xs">
                      No index — reading all rows sequentially
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 mt-4">
            <button
              onClick={() => setShowSearch(true)}
              className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs sm:text-sm font-bold rounded-lg transition-colors shadow-sm"
            >
              <Search className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              Search for salary = $75,000
            </button>

            {showSearch && (
              <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs sm:text-sm">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-red-50 border border-red-200 rounded-lg text-red-700 font-bold">
                  <BarChart3 className="w-3 h-3 sm:w-4 sm:h-4" />
                  Full Scan: 8 comparisons
                </span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-green-50 border border-green-200 rounded-lg text-green-700 font-bold">
                  <Zap className="w-3 h-3 sm:w-4 sm:h-4" />
                  Index Scan: {SEARCH_PATH_KEYS.length} comparisons
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <GitBranch className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600" />
            <h2 className="text-sm sm:text-base font-black uppercase tracking-wider text-gray-500">
              B-Tree Animation
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-gray-600 mb-4">
            Watch how a B-tree grows as keys are inserted one by one. The tree
            stays balanced by splitting overflowing nodes and promoting the
            middle key.
          </p>

          <div className="flex flex-wrap items-center gap-2 mb-4">
            <button
              onClick={startAnimation}
              disabled={animRunning}
              className="px-3 sm:px-4 py-1.5 sm:py-2 bg-amber-600 hover:bg-amber-700 disabled:bg-amber-300 text-white text-xs sm:text-sm font-bold rounded-lg transition-colors shadow-sm"
            >
              Insert All Keys
            </button>
            <button
              onClick={resetAnimation}
              disabled={animStep === 0 && !animRunning}
              className="px-3 sm:px-4 py-1.5 sm:py-2 bg-gray-100 hover:bg-gray-200 disabled:opacity-40 text-gray-700 text-xs sm:text-sm font-bold rounded-lg transition-colors"
            >
              Reset
            </button>
          </div>

          <div className="bg-gray-50 rounded-xl border border-gray-200 p-3 sm:p-4 min-h-[180px] flex flex-col items-center justify-start overflow-x-auto">
            {animStep > 0 || animRunning ? (
              <>
                <p className="text-[11px] sm:text-xs font-bold text-amber-700 mb-3 text-center">
                  Step {animStep} / {ANIMATION_STEPS.length}:{" "}
                  {ANIMATION_STEPS[Math.min(animStep, ANIMATION_STEPS.length - 1)]?.label}
                </p>
                <TreeNodeView
                  node={
                    ANIMATION_STEPS[
                      Math.min(animStep, ANIMATION_STEPS.length - 1)
                    ]?.tree ?? ANIMATION_STEPS[0].tree
                  }
                  highlightKeys={[]}
                />
              </>
            ) : (
              <div className="text-center text-gray-400 py-8">
                <GitBranch className="w-8 h-8 sm:w-10 sm:h-10 mx-auto mb-2 opacity-50" />
                <p className="text-xs sm:text-sm font-medium">
                  Press &quot;Insert All Keys&quot; to see the B-tree build
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600" />
            <h2 className="text-sm sm:text-base font-black uppercase tracking-wider text-gray-500">
              Index Types Comparison
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs sm:text-sm border-collapse">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  {["Type", "Best For", "Speed", "Space"].map((h) => (
                    <th
                      key={h}
                      className="text-left py-2.5 px-3 font-black text-[10px] sm:text-xs uppercase tracking-wider text-gray-400"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  [
                    "B-Tree",
                    "Range queries, sorting, general purpose",
                    "O(log n) — search, insert, delete",
                    "Moderate — stores keys + pointers",
                  ],
                  [
                    "Hash",
                    "Exact-match equality lookups",
                    "O(1) average — constant time",
                    "Small — only hash + pointer",
                  ],
                  [
                    "Bitmap",
                    "Low-cardinality columns (status, gender)",
                    "Fast bitwise AND/OR operations",
                    "Compact — 1 bit per row per value",
                  ],
                ].map(([type, best, speed, space]) => (
                  <tr
                    key={type}
                    className="border-b border-gray-50 hover:bg-gray-50 transition-colors"
                  >
                    <td className="py-2.5 px-3 font-bold text-gray-800">
                      {type}
                    </td>
                    <td className="py-2.5 px-3 text-gray-600 text-xs sm:text-sm">
                      {best}
                    </td>
                    <td className="py-2.5 px-3 text-gray-600 text-xs sm:text-sm">
                      {speed}
                    </td>
                    <td className="py-2.5 px-3 text-gray-600 text-xs sm:text-sm">
                      {space}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600" />
            <h2 className="text-sm sm:text-base font-black uppercase tracking-wider text-gray-500">
              SQL Index Examples
            </h2>
          </div>
          <div className="space-y-4">
            {[
              {
                title: "Basic Index",
                sql: `CREATE INDEX idx_employees_salary\nON employees(salary);`,
                desc: "Creates a B-tree index on the salary column for faster lookups and range queries.",
              },
              {
                title: "Unique Index",
                sql: `CREATE UNIQUE INDEX idx_employees_email\nON employees(email);`,
                desc: "Ensures all values in the indexed column are unique, while also speeding up searches.",
              },
              {
                title: "Composite Index",
                sql: `CREATE INDEX idx_employees_dept_salary\nON employees(department, salary);`,
                desc: "Indexes multiple columns together. The column order matters for query performance (leftmost prefix rule).",
              },
            ].map((ex) => (
              <div key={ex.title}>
                <h3 className="font-bold text-xs sm:text-sm text-gray-900 mb-1">
                  {ex.title}
                </h3>
                <div className="bg-gray-900 text-green-400 p-3 sm:p-4 rounded-lg font-mono text-[11px] sm:text-xs overflow-x-auto mb-1 leading-relaxed">
                  {ex.sql}
                </div>
                <p className="text-[11px] sm:text-xs text-gray-500">
                  {ex.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-6">
          <div className="flex items-center gap-2 mb-4">
            <Search className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600" />
            <h2 className="text-sm sm:text-base font-black uppercase tracking-wider text-gray-500">
              Interview Questions
            </h2>
          </div>
          <div className="space-y-4">
            {[
              {
                q: "What is a database index and why is it useful?",
                a: "A database index is a data structure that improves the speed of data retrieval operations on a table. It works like an index in a book — instead of scanning every page, you jump directly to the relevant location. Indexes drastically reduce query time at the cost of additional storage and slower writes.",
              },
              {
                q: "How does a B-tree index work internally?",
                a: "A B-tree is a self-balancing tree data structure that maintains sorted data and allows O(log n) search, insert, and delete operations. Each node can hold multiple keys (unlike a binary search tree), reducing tree height and disk I/O. Internal nodes guide the search direction, while leaf nodes contain the actual data pointers.",
              },
              {
                q: "What is the difference between clustered and non-clustered indexes?",
                a: "A clustered index determines the physical order of data in the table — there can be only one per table. A non-clustered index stores a separate copy of the indexed columns with pointers to the actual rows. Non-clustered indexes require an extra lookup step but you can create many of them.",
              },
              {
                q: "When would you choose a hash index over a B-tree?",
                a: "Hash indexes are faster for exact-match equality queries (=) since they use O(1) lookup. However, they cannot be used for range queries (<, >, BETWEEN), sorting, or partial matching. B-tree indexes are more versatile and are the default choice for most database workloads.",
              },
              {
                q: "What are the downsides of adding too many indexes?",
                a: "Each index consumes disk space and must be updated on every INSERT, UPDATE, or DELETE operation, slowing down write performance. The query optimizer also spends more time choosing among many indexes. The rule is to index columns used in WHERE, JOIN, and ORDER BY clauses — not every column.",
              },
            ].map((item, i) => (
              <details
                key={i}
                className="group border border-gray-200 rounded-xl overflow-hidden"
              >
                <summary className="flex items-start gap-2 p-3 sm:p-4 cursor-pointer hover:bg-gray-50 transition-colors list-none">
                  <span className="flex-shrink-0 w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center text-[10px] sm:text-xs font-black mt-0.5">
                    {i + 1}
                  </span>
                  <span className="text-xs sm:text-sm font-bold text-gray-900 flex-1">
                    {item.q}
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400 mt-0.5 transition-transform group-open:rotate-90" />
                </summary>
                <div className="px-3 sm:px-4 pb-3 sm:pb-4 pt-0">
                  <div className="pl-7 sm:pl-8 border-l-2 border-amber-200">
                    <p className="text-[11px] sm:text-xs text-gray-600 leading-relaxed">
                      {item.a}
                    </p>
                  </div>
                </div>
              </details>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
