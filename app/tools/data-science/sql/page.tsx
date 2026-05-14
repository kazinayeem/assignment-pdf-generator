"use client";

import React from "react";
import Link from "next/link";
import { ChevronRight, Database, Table, GitMerge, Filter } from "lucide-react";

export default function SQLPage() {
  return (
    <div className="min-h-screen bg-gray-50 px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-6">
        <Link href="/tools/data-science" className="hover:text-gray-700 transition-colors">Data Science</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-gray-700 font-semibold">SQL</span>
      </div>

      <div className="max-w-4xl mx-auto space-y-6">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center shadow-sm">
              <Database className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-gray-900">SQL for Data Science</h1>
              <p className="text-gray-500 text-sm">Query, transform, and analyze data with SQL.</p>
            </div>
          </div>
        </div>

        {/* SELECT, WHERE, GROUP BY */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-sm font-black uppercase tracking-wider text-gray-700 mb-4 flex items-center gap-2">
            <Filter className="w-4 h-4 text-orange-500" /> SELECT, WHERE & GROUP BY
          </h2>
          <p className="text-sm text-gray-600 mb-4 leading-relaxed">
            SELECT retrieves data from tables. WHERE filters rows before aggregation. GROUP BY groups rows sharing a value so aggregate functions (COUNT, SUM, AVG) can be applied per group. HAVING filters groups after aggregation.
          </p>
          <div className="bg-gray-900 rounded-xl p-4 font-mono text-xs text-green-400 overflow-x-auto mb-4">
            <pre>{`-- Basic SELECT
SELECT name, salary
FROM employees
WHERE department = 'Engineering'
ORDER BY salary DESC
LIMIT 10;

-- Aggregation with GROUP BY
SELECT
    department,
    COUNT(*) AS employee_count,
    ROUND(AVG(salary), 2) AS avg_salary,
    MAX(salary) AS max_salary
FROM employees
WHERE hire_date >= '2020-01-01'
GROUP BY department
HAVING COUNT(*) > 5
ORDER BY avg_salary DESC;

-- DISTINCT values
SELECT DISTINCT department FROM employees;

-- Date functions
SELECT
    DATE_TRUNC('month', order_date) AS month,
    SUM(amount) AS total_revenue
FROM orders
GROUP BY month
ORDER BY month;`}</pre>
          </div>
        </div>

        {/* JOINs */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-sm font-black uppercase tracking-wider text-gray-700 mb-4 flex items-center gap-2">
            <GitMerge className="w-4 h-4 text-blue-500" /> JOINs
          </h2>
          <p className="text-sm text-gray-600 mb-4 leading-relaxed">
            JOINs combine rows from multiple tables based on a related column. INNER JOIN keeps matching rows only. LEFT/RIGHT JOIN keeps all rows from one side. FULL OUTER JOIN keeps all rows from both sides.
          </p>
          <div className="bg-gray-900 rounded-xl p-4 font-mono text-xs text-green-400 overflow-x-auto mb-4">
            <pre>{`-- INNER JOIN: only matching customers
SELECT
    o.order_id,
    o.amount,
    c.name,
    c.email
FROM orders o
INNER JOIN customers c ON o.customer_id = c.id;

-- LEFT JOIN: all customers, even without orders
SELECT
    c.name,
    COUNT(o.id) AS order_count,
    COALESCE(SUM(o.amount), 0) AS total_spent
FROM customers c
LEFT JOIN orders o ON c.id = o.customer_id
GROUP BY c.id, c.name;

-- Self JOIN: employees and their managers
SELECT
    e.name AS employee,
    m.name AS manager
FROM employees e
LEFT JOIN employees m ON e.manager_id = m.id;

-- Multiple JOINs
SELECT *
FROM orders o
JOIN customers c ON o.customer_id = c.id
JOIN order_items oi ON o.id = oi.order_id
JOIN products p ON oi.product_id = p.id;`}</pre>
          </div>
        </div>

        {/* Window Functions */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-sm font-black uppercase tracking-wider text-gray-700 mb-4 flex items-center gap-2">
            <Table className="w-4 h-4 text-violet-500" /> Window Functions
          </h2>
          <p className="text-sm text-gray-600 mb-4 leading-relaxed">
            Window functions perform calculations across a set of rows related to the current row, without collapsing them into a single output row. ROW_NUMBER, RANK, LAG, LEAD, and running totals are common use cases.
          </p>
          <div className="bg-gray-900 rounded-xl p-4 font-mono text-xs text-green-400 overflow-x-auto mb-4">
            <pre>{`-- ROW_NUMBER: rank employees by salary per department
SELECT
    name,
    department,
    salary,
    ROW_NUMBER() OVER (
        PARTITION BY department
        ORDER BY salary DESC
    ) AS salary_rank
FROM employees;

-- Running total of sales
SELECT
    order_date,
    amount,
    SUM(amount) OVER (ORDER BY order_date) AS running_total
FROM orders;

-- LAG: compare current to previous month
SELECT
    month,
    revenue,
    LAG(revenue, 1) OVER (ORDER BY month) AS prev_month,
    revenue - LAG(revenue, 1) OVER (ORDER BY month) AS growth
FROM monthly_revenue;

-- RANK vs DENSE_RANK
SELECT
    score,
    RANK() OVER (ORDER BY score DESC) AS rank,
    DENSE_RANK() OVER (ORDER BY score DESC) AS dense_rank
FROM exam_scores;`}</pre>
          </div>
        </div>

        {/* Subqueries & CTEs */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-sm font-black uppercase tracking-wider text-gray-700 mb-4">Subqueries & CTEs</h2>
          <p className="text-sm text-gray-600 mb-4 leading-relaxed">
            Subqueries are queries nested inside another query. CTEs (WITH clause) name a subquery for readability and allow recursion. Both make complex queries cleaner and more maintainable.
          </p>
          <div className="bg-gray-900 rounded-xl p-4 font-mono text-xs text-green-400 overflow-x-auto mb-4">
            <pre>{`-- Subquery in WHERE
SELECT name, salary
FROM employees
WHERE salary > (
    SELECT AVG(salary) FROM employees
);

-- Subquery in SELECT
SELECT
    name,
    salary,
    (SELECT AVG(salary) FROM employees) AS company_avg,
    salary - (SELECT AVG(salary) FROM employees) AS diff
FROM employees;

-- CTE (Common Table Expression)
WITH dept_avg AS (
    SELECT
        department,
        AVG(salary) AS avg_salary
    FROM employees
    GROUP BY department
)
SELECT
    e.name,
    e.salary,
    d.avg_salary,
    e.salary - d.avg_salary AS above_avg
FROM employees e
JOIN dept_avg d ON e.department = d.department;

-- Recursive CTE (hierarchy)
WITH RECURSIVE org_tree AS (
    SELECT id, name, manager_id, 1 AS level
    FROM employees WHERE manager_id IS NULL
    UNION ALL
    SELECT e.id, e.name, e.manager_id, t.level + 1
    FROM employees e
    JOIN org_tree t ON e.manager_id = t.id
)
SELECT * FROM org_tree;`}</pre>
          </div>
        </div>

        {/* Database Design Basics */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-sm font-black uppercase tracking-wider text-gray-700 mb-4">Database Design Basics</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              ["Normalization", "Eliminate redundancy (1NF, 2NF, 3NF). Split data into related tables to avoid update anomalies."],
              ["Indexes", "Speed up queries by creating B-tree or hash indexes on frequently filtered columns. Trade-off: slower writes."],
              ["Primary & Foreign Keys", "PK uniquely identifies a row. FK references a PK in another table, enforcing referential integrity."],
              ["ER Diagrams", "Entity-Relationship diagrams model the logical structure: entities (tables), attributes (columns), and relationships (joins)."],
              ["ACID Transactions", "Atomicity, Consistency, Isolation, Durability — guarantees for reliable data operations."],
              ["Denormalization", "Intentionally adding redundancy for read performance (common in data warehouses and analytics)."],
            ].map(([topic, desc]) => (
              <div key={topic} className="p-3 bg-orange-50 rounded-xl border border-orange-100">
                <p className="text-sm font-bold text-orange-800">{topic}</p>
                <p className="text-xs text-orange-600 mt-0.5">{desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Interview Questions */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-sm font-black uppercase tracking-wider text-gray-700 mb-4">Interview Questions</h2>
          <div className="space-y-4">
            {[
              ["What is the difference between WHERE and HAVING?",
               "WHERE filters rows before aggregation. HAVING filters groups after aggregation (used with GROUP BY). You can use WHERE on individual rows but not on aggregate results like COUNT(*)."],
              ["Explain INNER JOIN vs LEFT JOIN with an example.",
               "INNER JOIN returns only rows with matching keys in both tables. LEFT JOIN returns all rows from the left table and matching rows from the right, with NULLs where no match exists."],
              ["What is a window function and give an example?",
               "A window function performs a calculation across a set of rows related to the current row without collapsing them. Example: `ROW_NUMBER() OVER (PARTITION BY dept ORDER BY salary DESC)` ranks employees within each department."],
              ["What is the difference between a CTE and a subquery?",
               "Both are temporary result sets. CTEs (WITH clause) are more readable, can be referenced multiple times in the same query, and support recursion. Subqueries are typically inlined in WHERE/SELECT clauses."],
            ].map(([q, a]) => (
              <div key={q} className="p-4 bg-orange-50 rounded-xl border border-orange-100">
                <p className="text-sm font-bold text-orange-900 mb-1">Q: {q}</p>
                <p className="text-xs text-orange-700 leading-relaxed">{a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
