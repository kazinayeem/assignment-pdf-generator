"use client";

import React from "react";
import Link from "next/link";
import { ChevronRight, Layers, FileSpreadsheet, Filter, GitMerge } from "lucide-react";

export default function PandasPage() {
  return (
    <div className="min-h-screen bg-gray-50 px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-6">
        <Link href="/tools/data-science" className="hover:text-gray-700 transition-colors">Data Science</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-gray-700 font-semibold">Pandas</span>
      </div>

      <div className="max-w-4xl mx-auto space-y-6">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-sm">
              <Layers className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-gray-900">Pandas</h1>
              <p className="text-gray-500 text-sm">Data manipulation and analysis with DataFrames.</p>
            </div>
          </div>
        </div>

        {/* DataFrames & Series */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-sm font-black uppercase tracking-wider text-gray-700 mb-4 flex items-center gap-2">
            <Layers className="w-4 h-4 text-violet-500" /> DataFrames & Series
          </h2>
          <p className="text-sm text-gray-600 mb-4 leading-relaxed">
            A Series is a labeled 1-D array. A DataFrame is a 2-D table with rows and columns, the primary Pandas data structure. Both are built on NumPy arrays.
          </p>
          <div className="bg-gray-900 rounded-xl p-4 font-mono text-xs text-green-400 overflow-x-auto mb-4">
            <pre>{`import pandas as pd
import numpy as np

# Series
s = pd.Series([10, 20, 30], index=["a", "b", "c"])
print(s["b"])  # 20

# DataFrame
df = pd.DataFrame({
    "name": ["Alice", "Bob", "Charlie", "Diana"],
    "age": [25, 30, 35, 28],
    "salary": [70000, 80000, 120000, 90000]
})
print(df.head())
print(df.dtypes)
print(df.describe())`}</pre>
          </div>
        </div>

        {/* Reading / Writing Data */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-sm font-black uppercase tracking-wider text-gray-700 mb-4 flex items-center gap-2">
            <FileSpreadsheet className="w-4 h-4 text-emerald-500" /> Reading & Writing Data
          </h2>
          <p className="text-sm text-gray-600 mb-4 leading-relaxed">
            Pandas can read and write from CSV, Excel, SQL databases, JSON, Parquet, and many other formats with a consistent API.
          </p>
          <div className="bg-gray-900 rounded-xl p-4 font-mono text-xs text-green-400 overflow-x-auto mb-4">
            <pre>{`import pandas as pd

# CSV (most common)
df = pd.read_csv("data.csv")
df.to_csv("clean_data.csv", index=False)

# Excel (needs openpyxl or xlrd)
df = pd.read_excel("data.xlsx", sheet_name="Sheet1")
df.to_excel("output.xlsx", sheet_name="Results", index=False)

# SQL (needs SQLAlchemy)
from sqlalchemy import create_engine
engine = create_engine("sqlite:///database.db")
df = pd.read_sql("SELECT * FROM orders", engine)
df.to_sql("orders_clean", engine, if_exists="replace")

# JSON
df = pd.read_json("data.json")
df.to_json("output.json", orient="records")`}</pre>
          </div>
        </div>

        {/* Data Cleaning */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-sm font-black uppercase tracking-wider text-gray-700 mb-4 flex items-center gap-2">
            <Filter className="w-4 h-4 text-red-500" /> Data Cleaning & Missing Values
          </h2>
          <p className="text-sm text-gray-600 mb-4 leading-relaxed">
            Real-world data is messy. Pandas provides tools to detect and handle missing values, remove duplicates, fix data types, and transform columns.
          </p>
          <div className="bg-gray-900 rounded-xl p-4 font-mono text-xs text-green-400 overflow-x-auto mb-4">
            <pre>{`import pandas as pd
import numpy as np

df = pd.DataFrame({
    "A": [1, 2, np.nan, 4, 5],
    "B": [np.nan, 2, 3, np.nan, 5],
    "C": ["x", "y", "y", "x", "y"]
})

# Detect missing
print(df.isnull().sum())

# Drop missing
df_dropped = df.dropna()

# Fill missing
df_filled = df.fillna({
    "A": df["A"].mean(),
    "B": 0
})

# Forward fill
df_ffill = df.fillna(method="ffill")

# Duplicates
df[df.duplicated(subset=["C"], keep=False)]
df_clean = df.drop_duplicates()

# Type conversion
df["A"] = df["A"].astype("int32")`}</pre>
          </div>
        </div>

        {/* GroupBy, Merge, Join */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-sm font-black uppercase tracking-wider text-gray-700 mb-4 flex items-center gap-2">
            <GitMerge className="w-4 h-4 text-blue-500" /> GroupBy, Merge & Join
          </h2>
          <p className="text-sm text-gray-600 mb-4 leading-relaxed">
            GroupBy enables split-apply-combine operations for aggregation. Merge and Join combine multiple DataFrames on keys, similar to SQL JOINs.
          </p>
          <div className="bg-gray-900 rounded-xl p-4 font-mono text-xs text-green-400 overflow-x-auto mb-4">
            <pre>{`import pandas as pd

# GroupBy
df = pd.DataFrame({
    "department": ["Sales", "Eng", "Sales", "Eng", "HR"],
    "salary": [70000, 95000, 80000, 110000, 65000]
})
grouped = df.groupby("department")["salary"]
print(grouped.mean())
print(grouped.agg(["mean", "std", "count"]))

# Merge (SQL-style joins)
orders = pd.DataFrame({
    "order_id": [1, 2, 3],
    "customer_id": [101, 102, 101]
})
customers = pd.DataFrame({
    "customer_id": [101, 102, 103],
    "name": ["Alice", "Bob", "Charlie"]
})
merged = pd.merge(orders, customers, on="customer_id", how="inner")
print(merged)

# Concat
df1 = pd.DataFrame({"A": [1, 2]})
df2 = pd.DataFrame({"A": [3, 4]})
combined = pd.concat([df1, df2], ignore_index=True)`}</pre>
          </div>
        </div>

        {/* Interview Questions */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-sm font-black uppercase tracking-wider text-gray-700 mb-4">Interview Questions</h2>
          <div className="space-y-4">
            {[
              ["What is the difference between a Series and a DataFrame?",
               "A Series is a 1-D labeled array (like a single column). A DataFrame is a 2-D labeled data structure with rows and columns, essentially a collection of Series sharing the same index."],
              ["How do you handle missing values in Pandas?",
               "Use `df.isnull()` to detect, `df.dropna()` to remove, and `df.fillna(value)` to impute. Strategy depends on context: drop rows with too many missing, fill with mean/median for numeric, or forward-fill for time series."],
              ["Explain the difference between merge, join, and concat.",
               "`merge` combines DataFrames on columns (SQL-style). `join` combines on indices. `concat` stacks DataFrames along rows or columns without requiring a key."],
              ["What is the GroupBy operation and how does it work?",
               "GroupBy follows split-apply-combine: split data into groups based on a key, apply a function (aggregation, transformation, or filtering) to each group, and combine the results into a new DataFrame."],
            ].map(([q, a]) => (
              <div key={q} className="p-4 bg-violet-50 rounded-xl border border-violet-100">
                <p className="text-sm font-bold text-violet-900 mb-1">Q: {q}</p>
                <p className="text-xs text-violet-700 leading-relaxed">{a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
