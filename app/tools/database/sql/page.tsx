"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function SQLPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-6 py-8">
        <Link
          href="/tools/database"
          className="inline-flex items-center gap-2 text-sm font-semibold text-amber-600 hover:text-amber-700 mb-8"
        >
          <ArrowLeft size={18} />
          Back to Database Systems
        </Link>

        <div className="mb-12">
          <p className="text-sm uppercase tracking-widest text-gray-500 font-bold mb-3">Database Systems</p>
          <h1 className="text-5xl font-black text-gray-900 mb-4">💾 SQL & Queries</h1>
          <p className="text-xl text-gray-600 max-w-3xl">
            Master SQL basics: SELECT, INSERT, UPDATE, DELETE, JOIN operations and advanced queries
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Core Concepts */}
            <section className="bg-white rounded-xl border-2 border-gray-200 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">SQL Fundamentals</h2>
              <p className="text-gray-700 mb-4">
                SQL (Structured Query Language) is the standard language for managing and querying relational databases.
              </p>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-3">SELECT Statement</h3>
                  <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm overflow-x-auto mb-3">
                    {`SELECT column1, column2 FROM table_name
WHERE condition
ORDER BY column_name
LIMIT 10;`}
                  </div>
                  <p className="text-gray-700 text-sm">
                    Retrieves data from one or more tables with optional filtering, sorting, and limiting
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-3">JOIN Operations</h3>
                  <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm overflow-x-auto mb-3">
                    {`SELECT a.id, a.name, b.email
FROM users a
INNER JOIN emails b ON a.id = b.user_id;`}
                  </div>
                  <p className="text-gray-700 text-sm">
                    Combine rows from multiple tables based on related columns
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-3">Aggregate Functions</h3>
                  <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm overflow-x-auto mb-3">
                    {`SELECT COUNT(*), AVG(price), MAX(price), SUM(quantity)
FROM products
GROUP BY category
HAVING COUNT(*) > 5;`}
                  </div>
                  <p className="text-gray-700 text-sm">
                    Calculate statistics: COUNT, SUM, AVG, MAX, MIN with GROUP BY and HAVING clauses
                  </p>
                </div>
              </div>
            </section>

            {/* CRUD Operations */}
            <section className="bg-white rounded-xl border-2 border-gray-200 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">CRUD Operations</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="border-l-4 border-blue-500 pl-4">
                  <h3 className="font-bold text-gray-900 mb-2">CREATE (INSERT)</h3>
                  <div className="bg-gray-100 p-3 rounded font-mono text-xs text-gray-800 mb-2">
                    INSERT INTO users VALUES ('John', 'john@email.com');
                  </div>
                  <p className="text-sm text-gray-600">Add new records to table</p>
                </div>

                <div className="border-l-4 border-green-500 pl-4">
                  <h3 className="font-bold text-gray-900 mb-2">READ (SELECT)</h3>
                  <div className="bg-gray-100 p-3 rounded font-mono text-xs text-gray-800 mb-2">
                    SELECT * FROM users WHERE id = 1;
                  </div>
                  <p className="text-sm text-gray-600">Retrieve records from table</p>
                </div>

                <div className="border-l-4 border-yellow-500 pl-4">
                  <h3 className="font-bold text-gray-900 mb-2">UPDATE</h3>
                  <div className="bg-gray-100 p-3 rounded font-mono text-xs text-gray-800 mb-2">
                    UPDATE users SET email = 'new@email.com' WHERE id = 1;
                  </div>
                  <p className="text-sm text-gray-600">Modify existing records</p>
                </div>

                <div className="border-l-4 border-red-500 pl-4">
                  <h3 className="font-bold text-gray-900 mb-2">DELETE</h3>
                  <div className="bg-gray-100 p-3 rounded font-mono text-xs text-gray-800 mb-2">
                    DELETE FROM users WHERE id = 1;
                  </div>
                  <p className="text-sm text-gray-600">Remove records from table</p>
                </div>
              </div>
            </section>

            {/* Best Practices */}
            <section className="bg-white rounded-xl border-2 border-gray-200 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Best Practices</h2>
              <ul className="space-y-3 text-gray-700">
                <li className="flex gap-3">
                  <span className="text-amber-600 font-bold">✓</span>
                  <span>Always use WHERE clauses carefully - avoid accidentally deleting all data</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-amber-600 font-bold">✓</span>
                  <span>Use indexes on frequently queried columns for better performance</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-amber-600 font-bold">✓</span>
                  <span>Use parameterized queries to prevent SQL injection attacks</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-amber-600 font-bold">✓</span>
                  <span>Normalize your schema to avoid data redundancy</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-amber-600 font-bold">✓</span>
                  <span>Use transactions for multiple related operations</span>
                </li>
              </ul>
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-amber-50 rounded-xl border-2 border-amber-200 p-6">
              <div className="text-sm font-bold text-amber-900 uppercase tracking-wider mb-2">Difficulty</div>
              <div className="flex gap-1 mb-3">
                {[1, 2].map((i) => (
                  <div key={i} className="h-2 flex-1 bg-amber-500 rounded"></div>
                ))}
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-2 flex-1 bg-gray-300 rounded"></div>
                ))}
              </div>
              <p className="text-xs text-amber-900">Beginner to Intermediate</p>
            </div>

            <div className="bg-white rounded-xl border-2 border-gray-200 p-6">
              <h3 className="font-bold text-gray-900 mb-4">Quick Links</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-amber-600 hover:underline">→ Data Types</a></li>
                <li><a href="#" className="text-amber-600 hover:underline">→ Constraints</a></li>
                <li><a href="#" className="text-amber-600 hover:underline">→ Subqueries</a></li>
                <li><a href="#" className="text-amber-600 hover:underline">→ Performance Tips</a></li>
              </ul>
            </div>

            <button className="w-full py-3 bg-amber-600 text-white font-bold rounded-lg hover:bg-amber-700 transition-colors">
              Try SQL Editor →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
