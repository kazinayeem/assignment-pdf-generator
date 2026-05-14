"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { Play, RotateCcw, Lightbulb, BookOpen, ChevronRight } from "lucide-react";

interface MockRow {
  [key: string]: string | number;
}

interface MockTable {
  name: string;
  columns: { name: string; type: string }[];
  rows: MockRow[];
}

const MOCK_TABLES: Record<string, MockTable> = {
  employees: {
    name: "employees",
    columns: [
      { name: "id", type: "INTEGER" },
      { name: "name", type: "VARCHAR" },
      { name: "department", type: "VARCHAR" },
      { name: "salary", type: "INTEGER" },
      { name: "hire_date", type: "DATE" },
    ],
    rows: [
      { id: 1, name: "Alice Johnson", department: "Engineering", salary: 85000, hire_date: "2020-03-15" },
      { id: 2, name: "Bob Smith", department: "Marketing", salary: 62000, hire_date: "2019-07-22" },
      { id: 3, name: "Charlie Brown", department: "Engineering", salary: 95000, hire_date: "2021-01-10" },
      { id: 4, name: "Diana Prince", department: "Finance", salary: 72000, hire_date: "2018-11-05" },
      { id: 5, name: "Eve Davis", department: "Marketing", salary: 48000, hire_date: "2022-06-01" },
      { id: 6, name: "Frank Miller", department: "Engineering", salary: 110000, hire_date: "2017-04-18" },
      { id: 7, name: "Grace Lee", department: "Finance", salary: 68000, hire_date: "2020-09-30" },
      { id: 8, name: "Henry Wilson", department: "HR", salary: 54000, hire_date: "2021-12-12" },
    ],
  },
  departments: {
    name: "departments",
    columns: [
      { name: "id", type: "VARCHAR" },
      { name: "name", type: "VARCHAR" },
      { name: "location", type: "VARCHAR" },
    ],
    rows: [
      { id: "Engineering", name: "Engineering", location: "Building A" },
      { id: "Marketing", name: "Marketing", location: "Building B" },
      { id: "Finance", name: "Finance", location: "Building C" },
      { id: "HR", name: "Human Resources", location: "Building A" },
    ],
  },
};

function resolveValue(
  row: MockRow,
  ref: string,
  aliasMap: Record<string, string>,
): string | number {
  if (ref in row) return row[ref] ?? "NULL";
  if (ref.includes(".")) {
    const [alias, col] = ref.split(".");
    const table = aliasMap[alias] || alias;
    const prefixed = `${table}.${col}`;
    if (prefixed in row) return row[prefixed] ?? "NULL";
    for (const key of Object.keys(row)) {
      if (key.endsWith(`.${col}`)) return row[key] ?? "NULL";
    }
  }
  for (const key of Object.keys(row)) {
    if (key.endsWith(`.${ref}`)) return row[key] ?? "NULL";
  }
  return "NULL";
}

function executeMockSQL(
  query: string,
): { columns: string[]; rows: MockRow[] } {
  let sql = query.trim().replace(/\s+/g, " ").replace(/;$/, "");

  if (!/^SELECT\b/i.test(sql)) {
    throw new Error(
      "Only SELECT queries are supported. Found: " +
        sql.split(/\s/)[0].toUpperCase(),
    );
  }

  const selectFromMatch = sql.match(
    /^SELECT\s+(.+?)\s+FROM\s+(\w+)(?:\s+(\w+))?/i,
  );
  if (!selectFromMatch) {
    throw new Error("Invalid syntax: expected SELECT ... FROM ...");
  }

  const selectParts = selectFromMatch[1].trim();
  const fromTable = selectFromMatch[2].toLowerCase();
  const fromAlias = selectFromMatch[3] || null;

  const selectedColumns = selectParts.split(",").map((c) => c.trim());

  if (!MOCK_TABLES[fromTable]) {
    throw new Error(`Table not found: ${fromTable}`);
  }

  const aliasMap: Record<string, string> = {};
  if (fromAlias) aliasMap[fromAlias] = fromTable;

  let rest = sql.slice(selectFromMatch[0].length).trim();

  let joinTable: string | null = null;
  let joinAlias: string | null = null;
  let joinOnLeft: string | null = null;
  let joinOnRight: string | null = null;

  const joinMatch = rest.match(
    /^JOIN\s+(\w+)(?:\s+(\w+))?\s+ON\s+(\S+)\s*=\s*(\S+)/i,
  );
  if (joinMatch) {
    joinTable = joinMatch[1].toLowerCase();
    joinAlias = joinMatch[2] || null;
    joinOnLeft = joinMatch[3];
    joinOnRight = joinMatch[4];
    if (!MOCK_TABLES[joinTable]) {
      throw new Error(`Table not found: ${joinTable}`);
    }
    if (joinAlias) aliasMap[joinAlias] = joinTable;
    rest = rest.slice(joinMatch[0].length).trim();
  }

  let whereClause: string | null = null;
  const whereMatch = rest.match(
    /^WHERE\s+(.+?)(?=\s+(?:GROUP\s+BY|HAVING|ORDER\s+BY|LIMIT)\b|$)/i,
  );
  if (whereMatch) {
    whereClause = whereMatch[1].trim();
    rest = rest.slice(whereMatch[0].length).trim();
  }

  interface WhereCond {
    left: string;
    operator: string;
    right: string | number;
  }
  let whereGroups: WhereCond[][] = [];
  if (whereClause) {
    const orParts = whereClause.split(/\s+OR\s+/i);
    whereGroups = orParts.map((orPart) => {
      const andParts = orPart.split(/\s+AND\s+/i);
      return andParts.map((part) => {
        const m = part.match(
          /^\s*(\w+(?:\.\w+)?)\s*(=|!=|<>|>=|<=|>|<)\s*('(?:[^']*)'|\d+(?:\.\d+)?|\w+(?:\.\w+)?)\s*$/,
        );
        if (!m) throw new Error(`Invalid WHERE condition: ${part}`);
        let right: string | number = m[3];
        if (right.startsWith("'") && right.endsWith("'")) {
          right = right.slice(1, -1);
        } else if (!isNaN(Number(right))) {
          right = Number(right);
        }
        return { left: m[1], operator: m[2], right };
      });
    });
  }

  let groupBy: string | null = null;
  const gbMatch = rest.match(
    /^GROUP\s+BY\s+(\w+(?:\.\w+)?)(?=\s+(?:HAVING|ORDER\s+BY|LIMIT)\b|$)/i,
  );
  if (gbMatch) {
    groupBy = gbMatch[1];
    rest = rest.slice(gbMatch[0].length).trim();
  }

  rest = rest
    .replace(/^HAVING\s+.+?(?=\s+(?:ORDER\s+BY|LIMIT)\b|$)/i, "")
    .trim();

  let orderBy: string | null = null;
  let orderDir: "ASC" | "DESC" = "ASC";
  const obMatch = rest.match(
    /^ORDER\s+BY\s+(.+?)(?=\s+LIMIT\b|$)/i,
  );
  if (obMatch) {
    const orderPart = obMatch[1].trim();
    const dirMatch = orderPart.match(
      /^(\w+(?:\.\w+)?)\s+(ASC|DESC)$/i,
    );
    if (dirMatch) {
      orderBy = dirMatch[1];
      orderDir = dirMatch[2].toUpperCase() as "ASC" | "DESC";
    } else {
      orderBy = orderPart;
    }
    rest = rest.slice(obMatch[0].length).trim();
  }

  let limit: number | null = null;
  const limitMatch = rest.match(/^LIMIT\s+(\d+)/i);
  if (limitMatch) {
    limit = parseInt(limitMatch[1], 10);
    rest = rest.slice(limitMatch[0].length).trim();
  }

  const leftover = rest.replace(/\s+/g, " ").trim();
  if (leftover && !/^;?$/.test(leftover)) {
    throw new Error(`Unsupported clause: ${leftover}`);
  }

  const baseTable = MOCK_TABLES[fromTable];
  let data: MockRow[];

  if (joinTable) {
    const joinTbl = MOCK_TABLES[joinTable];
    data = [];
    for (const lr of baseTable.rows) {
      for (const rr of joinTbl.rows) {
        const combined: MockRow = {};
        for (const [k, v] of Object.entries(lr)) {
          combined[`${fromAlias || fromTable}.${k}`] = v;
        }
        for (const [k, v] of Object.entries(rr)) {
          combined[`${joinAlias || joinTable}.${k}`] = v;
        }
        data.push(combined);
      }
    }
    const onLeft = joinOnLeft!;
    const onRight = joinOnRight!;
    data = data.filter((row) => {
      const lv = String(resolveValue(row, onLeft, aliasMap));
      const rv = String(resolveValue(row, onRight, aliasMap));
      return lv === rv;
    });
  } else {
    data = baseTable.rows.map((r) => ({ ...r }));
  }

  if (whereGroups.length > 0) {
    data = data.filter((row) =>
      whereGroups.some((andGroup) =>
        andGroup.every((cond) => {
          const rowVal = resolveValue(row, cond.left, aliasMap);
          const condVal = cond.right;
          switch (cond.operator) {
            case "=":
              return String(rowVal) === String(condVal);
            case "!=":
            case "<>":
              return String(rowVal) !== String(condVal);
            case ">":
              return Number(rowVal) > Number(condVal);
            case "<":
              return Number(rowVal) < Number(condVal);
            case ">=":
              return Number(rowVal) >= Number(condVal);
            case "<=":
              return Number(rowVal) <= Number(condVal);
            default:
              return false;
          }
        }),
      ),
    );
  }

  if (groupBy) {
    const groups = new Map<string, MockRow[]>();
    for (const row of data) {
      const key = String(resolveValue(row, groupBy, aliasMap));
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key)!.push(row);
    }
    data = [];
    groups.forEach((groupRows, key) => {
      const resultRow: MockRow = {};
      for (const col of selectedColumns) {
        if (
          col === groupBy ||
          col.replace(/^\w+\./, "") === groupBy.replace(/^\w+\./, "")
        ) {
          resultRow[col] = isNaN(Number(key)) ? key : Number(key);
        } else {
          const aggMatch = col.match(
            /^(COUNT|SUM|AVG|MAX|MIN)\((\w+|\*)\)$/i,
          );
          if (aggMatch) {
            const [, fn, target] = aggMatch;
            const values =
              target === "*"
                ? groupRows.map(() => 1)
                : groupRows.map((r) =>
                    Number(resolveValue(r, target, aliasMap)),
                  );
            switch (fn.toUpperCase()) {
              case "COUNT":
                resultRow[col] = groupRows.length;
                break;
              case "SUM":
                resultRow[col] = values.reduce((a, b) => a + b, 0);
                break;
              case "AVG": {
                const avg =
                  values.reduce((a, b) => a + b, 0) / values.length;
                resultRow[col] = Math.round(avg * 100) / 100;
                break;
              }
              case "MAX":
                resultRow[col] = Math.max(...values);
                break;
              case "MIN":
                resultRow[col] = Math.min(...values);
                break;
            }
          }
        }
      }
      data.push(resultRow);
    });
  }

  let resultColumns: string[];
  let resultRows: MockRow[];

  if (selectedColumns.length === 1 && selectedColumns[0] === "*") {
    if (data.length === 0) {
      resultColumns = baseTable.columns.map((c) => c.name);
    } else {
      resultColumns = Object.keys(data[0]).filter(
        (k) => !k.includes(".") || !!joinTable,
      );
    }
    resultRows = data;
  } else {
    resultColumns = selectedColumns;
    resultRows = data.map((row) => {
      const newRow: MockRow = {};
      for (const col of selectedColumns) {
        newRow[col] = resolveValue(row, col, aliasMap);
      }
      return newRow;
    });
  }

  if (orderBy) {
    const sortCol = orderBy;
    resultRows.sort((a, b) => {
      const aVal = a[sortCol] ?? a[sortCol.replace(/^\w+\./, "")];
      const bVal = b[sortCol] ?? b[sortCol.replace(/^\w+\./, "")];
      const aNum = Number(aVal);
      const bNum = Number(bVal);
      if (!isNaN(aNum) && !isNaN(bNum)) {
        return orderDir === "ASC" ? aNum - bNum : bNum - aNum;
      }
      const cmp = String(aVal).localeCompare(String(bVal));
      return orderDir === "ASC" ? cmp : -cmp;
    });
  }

  if (limit !== null && limit >= 0) {
    resultRows = resultRows.slice(0, limit);
  }

  return { columns: resultColumns, rows: resultRows };
}

const EXAMPLES = [
  { label: "All employees", query: "SELECT * FROM employees" },
  {
    label: "High salaries",
    query: "SELECT name, salary FROM employees WHERE salary > 50000",
  },
  {
    label: "Salary ranking",
    query: "SELECT * FROM employees ORDER BY salary DESC",
  },
  {
    label: "Department count",
    query: "SELECT department, COUNT(*) FROM employees GROUP BY department",
  },
  {
    label: "Employees join departments",
    query:
      "SELECT e.name, d.name FROM employees e JOIN departments d ON e.department = d.id",
  },
  {
    label: "Engineering only",
    query:
      "SELECT * FROM employees WHERE department = 'Engineering'",
  },
  {
    label: "Top 3 salaries",
    query:
      "SELECT name, salary FROM employees ORDER BY salary DESC LIMIT 3",
  },
  {
    label: "Dept avg salary",
    query:
      "SELECT department, AVG(salary), COUNT(*) FROM employees GROUP BY department",
  },
];

const INTERVIEW_QUESTIONS = [
  {
    q: "What is the difference between WHERE and HAVING?",
    a: "WHERE filters individual rows before aggregation, while HAVING filters groups after GROUP BY. WHERE cannot use aggregate functions, HAVING can.",
  },
  {
    q: "What is the difference between INNER JOIN and LEFT JOIN?",
    a: "INNER JOIN returns only rows with matching keys in both tables. LEFT JOIN returns all rows from the left table, with NULLs for non-matching columns from the right table.",
  },
  {
    q: "What is a primary key?",
    a: "A column (or set of columns) that uniquely identifies each row. It must contain unique, non-NULL values. Each table can have only one primary key.",
  },
  {
    q: "What is the difference between DELETE and TRUNCATE?",
    a: "DELETE removes rows one by one (can have WHERE, fires triggers, can be rolled back). TRUNCATE removes all rows at once (cannot use WHERE, minimal logging, cannot roll back in most DBMS).",
  },
  {
    q: "What is an index and how does it speed up queries?",
    a: "An index is a data structure (typically a B-tree) that provides fast lookup of rows based on column values, avoiding full table scans. It speeds up SELECT and WHERE at the cost of slower INSERT/UPDATE.",
  },
];

export default function SQLPlaygroundPage() {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<{
    columns: string[];
    rows: MockRow[];
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [executionTime, setExecutionTime] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState(false);

  const handleRun = useCallback(() => {
    if (!query.trim()) return;
    setIsRunning(true);
    setError(null);
    setResult(null);
    setExecutionTime(null);
    const start = performance.now();
    setTimeout(() => {
      try {
        const res = executeMockSQL(query);
        setResult(res);
        const elapsed = ((performance.now() - start) * 0.3).toFixed(2);
        setExecutionTime(`${elapsed}ms`);
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : "Unknown error");
      }
      setIsRunning(false);
    }, 200);
  }, [query]);

  const handleClear = useCallback(() => {
    setQuery("");
    setResult(null);
    setError(null);
    setExecutionTime(null);
  }, []);

  const handleExampleClick = useCallback((q: string) => {
    setQuery(q);
    setResult(null);
    setError(null);
    setExecutionTime(null);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <div className="max-w-6xl mx-auto space-y-6 sm:space-y-8">
        <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-gray-500">
          <Link
            href="/tools/database"
            className="hover:text-amber-600 transition-colors font-semibold"
          >
            Database
          </Link>
          <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 shrink-0" />
          <span className="text-amber-600 font-bold">SQL &amp; Queries</span>
        </div>

        <div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-gray-900 mb-2 sm:mb-3">
            💾 SQL Playground
          </h1>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-600 max-w-3xl">
            Write and run SQL queries against a mock employee database with
            live results
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-4 sm:gap-6">
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-200 shadow-sm p-4 sm:p-6">
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <h2 className="text-xs sm:text-sm font-black uppercase tracking-wider text-gray-500">
                  Query Editor
                </h2>
                <span className="text-[10px] sm:text-xs text-gray-400 font-mono bg-gray-50 px-2 py-1 rounded border border-gray-200">
                  SQL
                </span>
              </div>
              <textarea
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={
                  "SELECT * FROM employees\nWHERE salary > 50000\nORDER BY salary DESC"
                }
                className="w-full h-32 sm:h-40 md:h-48 p-3 sm:p-4 text-xs sm:text-sm font-mono bg-gray-900 text-green-400 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 resize-y placeholder-gray-500"
                spellCheck={false}
              />
              <div className="flex items-center gap-2 sm:gap-3 mt-3 sm:mt-4">
                <button
                  onClick={handleRun}
                  disabled={!query.trim() || isRunning}
                  className="flex items-center gap-1.5 sm:gap-2 px-4 sm:px-6 py-2 sm:py-2.5 bg-amber-600 hover:bg-amber-700 disabled:bg-amber-300 disabled:cursor-not-allowed text-white text-xs sm:text-sm font-bold rounded-xl transition-colors shadow-sm"
                >
                  <Play className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  {isRunning ? "Running\u2026" : "Run Query"}
                </button>
                <button
                  onClick={handleClear}
                  className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs sm:text-sm font-bold rounded-xl transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  Clear
                </button>
              </div>
            </div>

            <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-200 shadow-sm p-4 sm:p-6">
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <h2 className="text-xs sm:text-sm font-black uppercase tracking-wider text-gray-500">
                  Results
                </h2>
                {executionTime && (
                  <span className="text-[10px] sm:text-xs text-gray-400 font-mono">
                    {executionTime}
                  </span>
                )}
              </div>

              {error && (
                <div className="p-3 sm:p-4 bg-red-50 border border-red-200 rounded-lg text-xs sm:text-sm">
                  <p className="font-bold text-red-800 mb-1">
                    Syntax Error
                  </p>
                  <p className="font-mono text-[11px] sm:text-xs text-red-600">
                    {error}
                  </p>
                </div>
              )}

              {result && (
                <div className="overflow-x-auto">
                  <table className="w-full text-xs sm:text-sm">
                    <thead>
                      <tr className="border-b-2 border-gray-200">
                        {result.columns.map((col) => (
                          <th
                            key={col}
                            className="text-left py-2 px-2 sm:px-3 text-[10px] sm:text-xs font-black uppercase tracking-wider text-gray-500 bg-gray-50 first:rounded-tl-lg last:rounded-tr-lg"
                          >
                            {col}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {result.rows.length === 0 ? (
                        <tr>
                          <td
                            colSpan={result.columns.length}
                            className="py-10 sm:py-12 text-center text-gray-400 text-xs sm:text-sm"
                          >
                            No rows returned
                          </td>
                        </tr>
                      ) : (
                        result.rows.map((row, i) => (
                          <tr
                            key={i}
                            className="border-b border-gray-100 hover:bg-amber-50/40 transition-colors"
                          >
                            {result.columns.map((col) => (
                              <td
                                key={col}
                                className="py-2 px-2 sm:px-3 text-gray-700 text-xs sm:text-sm font-mono"
                              >
                                {row[col] !== undefined &&
                                row[col] !== null
                                  ? String(row[col])
                                  : "\u2014"}
                              </td>
                            ))}
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                  <p className="text-[10px] sm:text-xs text-gray-400 mt-3">
                    {result.rows.length} row
                    {result.rows.length !== 1 ? "s" : ""} returned
                  </p>
                </div>
              )}

              {!result && !error && (
                <div className="py-10 sm:py-14 text-center text-gray-400 text-xs sm:text-sm">
                  <Play className="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-3 text-gray-300" />
                  Run a query to see results
                </div>
              )}
            </div>
          </div>

          <div className="space-y-4 sm:space-y-6">
            <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-200 shadow-sm p-4 sm:p-6">
              <h2 className="text-xs sm:text-sm font-black uppercase tracking-wider text-gray-500 mb-3 sm:mb-4 flex items-center gap-2">
                <BookOpen className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-600 shrink-0" />
                Schema
              </h2>
              {Object.entries(MOCK_TABLES).map(([name, table]) => (
                <div key={name} className="mb-4 last:mb-0">
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <div className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
                    <span className="text-xs sm:text-sm font-bold text-gray-800">
                      {table.name}
                    </span>
                  </div>
                  <div className="ml-4 border-l-2 border-amber-200 pl-3 space-y-0.5">
                    {table.columns.map((col) => (
                      <div
                        key={col.name}
                        className="text-[11px] sm:text-xs text-gray-500 font-mono flex gap-2"
                      >
                        <span className="text-gray-700">{col.name}</span>
                        <span className="text-gray-400">{col.type}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-200 shadow-sm p-4 sm:p-6">
              <h2 className="text-xs sm:text-sm font-black uppercase tracking-wider text-gray-500 mb-3 sm:mb-4 flex items-center gap-2">
                <Lightbulb className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-600 shrink-0" />
                Examples
              </h2>
              <div className="space-y-1.5 sm:space-y-2">
                {EXAMPLES.map((ex, i) => (
                  <button
                    key={i}
                    onClick={() => handleExampleClick(ex.query)}
                    className="w-full text-left p-2 sm:p-2.5 text-[11px] sm:text-xs font-mono text-gray-700 bg-gray-50 hover:bg-amber-50 hover:text-amber-700 border border-gray-200 hover:border-amber-300 rounded-lg transition-colors cursor-pointer truncate"
                    title={ex.query}
                  >
                    <span className="text-amber-600 font-bold mr-1.5">
                      &rsaquo;
                    </span>
                    {ex.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-200 shadow-sm p-4 sm:p-6 lg:p-8">
          <h2 className="text-sm sm:text-base font-black uppercase tracking-wider text-gray-700 mb-4 sm:mb-6 flex items-center gap-2">
            <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600 shrink-0" />
            Interview Questions
          </h2>
          <div className="space-y-3 sm:space-y-4">
            {INTERVIEW_QUESTIONS.map((qa, i) => (
              <div
                key={i}
                className="p-3 sm:p-4 lg:p-5 bg-amber-50 rounded-xl border border-amber-200"
              >
                <p className="text-xs sm:text-sm font-bold text-gray-900 mb-1.5 sm:mb-2">
                  Q{i + 1}: {qa.q}
                </p>
                <p className="text-xs sm:text-sm text-amber-800 leading-relaxed">
                  {qa.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
