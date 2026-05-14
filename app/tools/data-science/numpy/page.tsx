"use client";

import React from "react";
import Link from "next/link";
import { ChevronRight, Sigma, Grid3X3, Calculator, Zap } from "lucide-react";

export default function NumpyPage() {
  return (
    <div className="min-h-screen bg-gray-50 px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-6">
        <Link href="/tools/data-science" className="hover:text-gray-700 transition-colors">Data Science</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-gray-700 font-semibold">NumPy</span>
      </div>

      <div className="max-w-4xl mx-auto space-y-6">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center shadow-sm">
              <Sigma className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-gray-900">NumPy</h1>
              <p className="text-gray-500 text-sm">Numerical computing with fast array operations.</p>
            </div>
          </div>
        </div>

        {/* Arrays & Shapes */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-sm font-black uppercase tracking-wider text-gray-700 mb-4 flex items-center gap-2">
            <Grid3X3 className="w-4 h-4 text-blue-500" /> Arrays & Shapes
          </h2>
          <p className="text-sm text-gray-600 mb-4 leading-relaxed">
            NumPy&apos;s ndarray is a homogeneous n-dimensional array. The shape tuple describes its dimensions. Reshaping changes the layout without copying data when possible.
          </p>
          <div className="bg-gray-900 rounded-xl p-4 font-mono text-xs text-green-400 overflow-x-auto mb-4">
            <pre>{`import numpy as np

# Creating arrays
a = np.array([1, 2, 3])
b = np.zeros((2, 3))        # 2x3 matrix of zeros
c = np.ones((3, 2))         # 3x2 matrix of ones
d = np.arange(0, 10, 2)     # [0, 2, 4, 6, 8]
e = np.linspace(0, 1, 5)    # [0.0, 0.25, 0.5, 0.75, 1.0]

# Shape and reshape
arr = np.array([[1, 2, 3], [4, 5, 6]])
print(arr.shape)            # (2, 3)
flat = arr.reshape(-1)      # [1, 2, 3, 4, 5, 6]
matrix = flat.reshape(2, 3) # back to (2, 3)`}</pre>
          </div>
        </div>

        {/* Broadcasting */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-sm font-black uppercase tracking-wider text-gray-700 mb-4 flex items-center gap-2">
            <Zap className="w-4 h-4 text-yellow-500" /> Broadcasting
          </h2>
          <p className="text-sm text-gray-600 mb-4 leading-relaxed">
            Broadcasting allows arithmetic between arrays of different shapes. NumPy automatically expands dimensions so operations are element-wise without making copies.
          </p>
          <div className="bg-gray-900 rounded-xl p-4 font-mono text-xs text-green-400 overflow-x-auto mb-4">
            <pre>{`import numpy as np

# Broadcasting in action
arr = np.array([[1, 2, 3], [4, 5, 6]])
row = np.array([10, 20, 30])

result = arr + row
print(result)
# [[11 22 33]
#  [14 25 36]]

# Scale entire matrix by scalar
scaled = arr * 2
# [[ 2  4  6]
#  [ 8 10 12]]

# Broadcasting rules:
# 1. Align trailing dimensions
# 2. Dimensions of size 1 are stretched
# 3. If dimensions differ and != 1, error`}</pre>
          </div>
        </div>

        {/* Array Operations & Linear Algebra */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-sm font-black uppercase tracking-wider text-gray-700 mb-4 flex items-center gap-2">
            <Calculator className="w-4 h-4 text-violet-500" /> Array Operations & Linear Algebra
          </h2>
          <p className="text-sm text-gray-600 mb-4 leading-relaxed">
            NumPy provides vectorized math operations (element-wise add, multiply, etc.) and a comprehensive linear algebra module for matrix multiplication, decompositions, and eigenvalues.
          </p>
          <div className="bg-gray-900 rounded-xl p-4 font-mono text-xs text-green-400 overflow-x-auto mb-4">
            <pre>{`import numpy as np

a = np.array([[1, 2], [3, 4]])
b = np.array([[5, 6], [7, 8]])

# Element-wise
print(a + b)
print(a * b)
print(np.sqrt(a))

# Matrix multiplication
print(a @ b)           # Python 3.5+
print(np.dot(a, b))    # Equivalent

# Linear algebra
det = np.linalg.det(a)
inv = np.linalg.inv(a)
eigvals, eigvecs = np.linalg.eig(a)

# Stats on arrays
print(a.mean())        # 2.5
print(a.sum(axis=0))   # [4, 6]
print(a.std())         # 1.118...`}</pre>
          </div>
        </div>

        {/* Random Number Generation */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-sm font-black uppercase tracking-wider text-gray-700 mb-4">Random Number Generation</h2>
          <p className="text-sm text-gray-600 mb-4 leading-relaxed">
            The random module supports sampling from many probability distributions and is essential for simulations, bootstrapping, and initializing ML model weights.
          </p>
          <div className="bg-gray-900 rounded-xl p-4 font-mono text-xs text-green-400 overflow-x-auto mb-4">
            <pre>{`import numpy as np

rng = np.random.default_rng(42)  # seed for reproducibility

ints = rng.integers(0, 100, 10)   # 10 random ints in [0, 100)
floats = rng.random((3, 3))        # 3x3 uniform [0, 1)
normal = rng.normal(0, 1, 1000)    # 1000 N(0, 1) samples
choice = rng.choice(["A", "B", "C"], size=5, p=[0.2, 0.3, 0.5])
shuffle = rng.permutation(np.arange(10))

print(f"Mean: {normal.mean():.3f}, Std: {normal.std():.3f}")`}</pre>
          </div>
        </div>

        {/* Performance Comparison */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-sm font-black uppercase tracking-wider text-gray-700 mb-4">Performance vs Python Lists</h2>
          <div className="bg-gray-900 rounded-xl p-4 font-mono text-xs text-green-400 overflow-x-auto mb-4">
            <pre>{`import numpy as np
import time

n = 10_000_000
py_list = list(range(n))
np_arr = np.arange(n)

t0 = time.time()
py_result = [x**2 for x in py_list]
t_py = time.time() - t0

t0 = time.time()
np_result = np_arr ** 2
t_np = time.time() - t0

print(f"Python list: {t_py:.3f}s")
print(f"NumPy array: {t_np:.3f}s")
print(f"Speedup: {t_py / t_np:.1f}x")
# Typical output: NumPy 20-50x faster`}</pre>
          </div>
          <div className="grid grid-cols-2 gap-3 text-center">
            {[["Python Lists", "Flexible, mixed types", "Slow loops, high overhead"], ["NumPy Arrays", "Homogeneous, contiguous", "Vectorized, C-speed"]].map(([label, pro, con]) => (
              <div key={label} className="p-3 rounded-xl border">
                <p className="text-sm font-bold text-gray-800">{label}</p>
                <p className="text-[10px] text-emerald-600 font-bold mt-1">✅ {pro}</p>
                <p className="text-[10px] text-red-500 font-bold mt-0.5">⚠️ {con}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Interview Questions */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-sm font-black uppercase tracking-wider text-gray-700 mb-4">Interview Questions</h2>
          <div className="space-y-4">
            {[
              ["What is broadcasting in NumPy?",
               "Broadcasting allows arithmetic between arrays of different shapes by automatically expanding smaller arrays to match the larger one's shape. Rules: align trailing dimensions, stretch size-1 dimensions, error on mismatch."],
              ["How is a NumPy array different from a Python list?",
               "NumPy arrays are homogeneous, stored in contiguous memory, and support vectorized operations. Python lists store pointers to objects and are slower for numerical operations. NumPy arrays also have a fixed size."],
              ["Explain the difference between np.dot, np.matmul, and the @ operator.",
               "All three perform matrix multiplication. For 2-D arrays they are equivalent. `np.dot` also handles 1-D dot products. The `@` operator (Python 3.5+) calls `np.matmul` which is preferred for clarity."],
              ["How do you handle missing data in NumPy?",
               "NumPy uses `np.nan` for missing values. Functions like `np.nansum`, `np.nanmean`, and `np.nanstd` ignore NaN values. Use `np.isnan(arr)` to detect them and boolean indexing or `np.where` to handle them."],
            ].map(([q, a]) => (
              <div key={q} className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                <p className="text-sm font-bold text-blue-900 mb-1">Q: {q}</p>
                <p className="text-xs text-blue-700 leading-relaxed">{a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
