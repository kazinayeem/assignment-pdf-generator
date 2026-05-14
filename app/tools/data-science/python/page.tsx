"use client";

import React from "react";
import Link from "next/link";
import { ChevronRight, FileJson, Code, Database, Cpu } from "lucide-react";

export default function PythonPage() {
  return (
    <div className="min-h-screen bg-gray-50 px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-6">
        <Link href="/tools/data-science" className="hover:text-gray-700 transition-colors">Data Science</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-gray-700 font-semibold">Python</span>
      </div>

      <div className="max-w-4xl mx-auto space-y-6">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-sm">
              <FileJson className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-gray-900">Python for Data Science</h1>
              <p className="text-gray-500 text-sm">Core Python concepts every data scientist must know.</p>
            </div>
          </div>
        </div>

        {/* Data Types */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-sm font-black uppercase tracking-wider text-gray-700 mb-4 flex items-center gap-2">
            <Code className="w-4 h-4 text-emerald-500" /> Data Types & Structures
          </h2>
          <p className="text-sm text-gray-600 mb-4 leading-relaxed">
            Python provides built-in data types that form the foundation of data manipulation. Lists hold ordered mutable sequences, dicts map keys to values for fast lookups, and sets store unique elements with O(1) membership tests.
          </p>
          <div className="bg-gray-900 rounded-xl p-4 font-mono text-xs text-green-400 overflow-x-auto mb-4">
            <pre>{`# Lists, Dicts, and Sets
numbers = [1, 2, 3, 4, 5]
person = {"name": "Alice", "age": 30}
unique = {1, 2, 3, 3, 2}  # {1, 2, 3}

# List operations
numbers.append(6)
squared = [x**2 for x in numbers if x > 2]
print(squared)  # [9, 16, 25, 36]

# Dict comprehension
squares = {x: x**2 for x in range(5)}
print(squares)  # {0: 0, 1: 1, 2: 4, 3: 9, 4: 16}

# Set operations
A, B = {1, 2, 3}, {3, 4, 5}
print(A & B)  # {3} intersection
print(A | B)  # {1, 2, 3, 4, 5} union`}</pre>
          </div>
        </div>

        {/* List Comprehensions & Generators */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-sm font-black uppercase tracking-wider text-gray-700 mb-4 flex items-center gap-2">
            <Cpu className="w-4 h-4 text-blue-500" /> List Comprehensions & Generators
          </h2>
          <p className="text-sm text-gray-600 mb-4 leading-relaxed">
            List comprehensions provide concise syntax for transforming sequences. Generators use lazy evaluation—they yield items one at a time, making them memory-efficient for large datasets.
          </p>
          <div className="bg-gray-900 rounded-xl p-4 font-mono text-xs text-green-400 overflow-x-auto mb-4">
            <pre>{`# List comprehension vs loop
squares = [x**2 for x in range(10)]
# Same as: squares = []
#          for x in range(10): squares.append(x**2)

# Generator expression (lazy)
gen = (x**2 for x in range(10**6))
print(next(gen))  # 0 — no memory blowup

# Generator function
def fibonacci(limit):
    a, b = 0, 1
    while a < limit:
        yield a
        a, b = b, a + b

fib = list(fibonacci(100))
print(fib)  # [0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89]`}</pre>
          </div>
        </div>

        {/* NumPy & Pandas Intro */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-sm font-black uppercase tracking-wider text-gray-700 mb-4 flex items-center gap-2">
            <Database className="w-4 h-4 text-violet-500" /> NumPy & Pandas Overview
          </h2>
          <p className="text-sm text-gray-600 mb-4 leading-relaxed">
            NumPy delivers fast array operations and linear algebra. Pandas adds DataFrame objects for tabular data analysis. Together they form the backbone of the Python data science stack.
          </p>
          <div className="bg-gray-900 rounded-xl p-4 font-mono text-xs text-green-400 overflow-x-auto mb-4">
            <pre>{`import numpy as np
import pandas as pd

# NumPy array
arr = np.array([[1, 2, 3], [4, 5, 6]])
print(arr.shape)     # (2, 3)
print(arr.mean())    # 3.5
print(arr.sum(axis=0))  # [5, 7, 9]

# Pandas DataFrame
df = pd.DataFrame({
    "name": ["Alice", "Bob", "Charlie"],
    "score": [85, 92, 78]
})
print(df.describe())
print(df[df["score"] > 80])`}</pre>
          </div>
        </div>

        {/* DS Libraries Overview */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-sm font-black uppercase tracking-wider text-gray-700 mb-4">Data Science Libraries</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              ["NumPy", "Numerical computing, arrays, linear algebra"],
              ["Pandas", "DataFrames, data cleaning, transformation"],
              ["Matplotlib", "Static, animated, interactive visualizations"],
              ["Seaborn", "Statistical data visualization (built on Matplotlib)"],
              ["Scikit-learn", "ML algorithms: regression, classification, clustering"],
              ["TensorFlow / PyTorch", "Deep learning frameworks for neural networks"],
              ["SciPy", "Scientific computing, optimization, signal processing"],
              ["NLTK / spaCy", "Natural language processing toolkit"],
            ].map(([lib, desc]) => (
              <div key={lib} className="p-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200">
                <p className="text-sm font-bold text-gray-800">{lib}</p>
                <p className="text-xs text-gray-500 mt-0.5">{desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Interview Questions */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-sm font-black uppercase tracking-wider text-gray-700 mb-4">Interview Questions</h2>
          <div className="space-y-4">
            {[
              ["What is the difference between a list and a tuple?",
               "Lists are mutable (can be changed after creation) while tuples are immutable. Lists use square brackets [], tuples use parentheses (). Tuples are hashable and can be used as dictionary keys."],
              ["Explain list comprehension with an example.",
               "List comprehension is a concise way to create lists: `[x**2 for x in range(10) if x % 2 == 0]` generates squares of even numbers 0–9. It is generally faster than a manual for-loop."],
              ["What is a generator and when would you use one?",
               "A generator yields items lazily using the `yield` keyword, producing one value at a time without storing the entire sequence in memory. Use generators for large datasets or infinite sequences to avoid memory blowup."],
              ["How do NumPy arrays differ from Python lists?",
               "NumPy arrays are homogeneous (all elements same type), stored contiguously in memory, and support vectorized operations. They are significantly faster for numerical operations than Python lists, which store pointers to objects."],
            ].map(([q, a]) => (
              <div key={q} className="p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                <p className="text-sm font-bold text-emerald-900 mb-1">Q: {q}</p>
                <p className="text-xs text-emerald-700 leading-relaxed">{a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
