"use client";

import React from "react";
import Link from "next/link";
import { ChevronRight, BarChart3, PieChart, LineChart, TrendingUp, Code } from "lucide-react";

export default function DataVisualizationPage() {
  return (
    <div className="min-h-screen bg-gray-50 px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-6">
        <Link href="/tools/data-science" className="hover:text-gray-700 transition-colors">Data Science</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-gray-700 font-semibold">Data Visualization</span>
      </div>

      <div className="max-w-4xl mx-auto space-y-6">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-sm">
              <BarChart3 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-gray-900">Data Visualization</h1>
              <p className="text-gray-500 text-sm">Matplotlib, Seaborn, Plotly and principles of effective visual communication.</p>
            </div>
          </div>
        </div>

        {/* Matplotlib Basics */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-sm font-black uppercase tracking-wider text-gray-700 mb-4 flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-emerald-500" /> Matplotlib Fundamentals
          </h2>
          <p className="text-sm text-gray-600 mb-4 leading-relaxed">
            Matplotlib is the foundational plotting library for Python. It provides fine-grained control over every element of a figure — axes, ticks, labels, legends, and styles. Use the pyplot interface for quick plots and the object-oriented API for complex layouts.
          </p>
          <div className="bg-gray-900 rounded-xl p-4 font-mono text-xs text-green-400 overflow-x-auto mb-4">
            <pre>{`import matplotlib.pyplot as plt
import numpy as np

# Data
x = np.linspace(0, 10, 100)
y1 = np.sin(x)
y2 = np.cos(x)

# Figure & axes (OO API)
fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(10, 4))

# Line plot
ax1.plot(x, y1, label="sin(x)", color="blue", linewidth=2)
ax1.plot(x, y2, label="cos(x)", color="red", linestyle="--")
ax1.set_title("Trigonometric Functions")
ax1.set_xlabel("x"); ax1.set_ylabel("y")
ax1.legend(); ax1.grid(alpha=0.3)

# Bar chart
categories = ["A", "B", "C", "D"]
values = [23, 45, 56, 78]
colors = ["#4ECDC4", "#45B7D1", "#96CEB4", "#FFEAA7"]
bars = ax2.bar(categories, values, color=colors, edgecolor="white")
ax2.set_title("Category Values")
ax2.bar_label(bars, padding=3)

plt.tight_layout()
plt.show()
# Output: two-panel figure with line plot and bar chart`}</pre>
          </div>
        </div>

        {/* Seaborn */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-sm font-black uppercase tracking-wider text-gray-700 mb-4 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-blue-500" /> Statistical Plots with Seaborn
          </h2>
          <p className="text-sm text-gray-600 mb-4 leading-relaxed">
            Seaborn builds on Matplotlib with high-level statistical visualizations. It integrates with Pandas DataFrames, automatically handles aggregation, and provides attractive default styles and color palettes.
          </p>
          <div className="bg-gray-900 rounded-xl p-4 font-mono text-xs text-green-400 overflow-x-auto mb-4">
            <pre>{`import seaborn as sns
import matplotlib.pyplot as plt
import pandas as pd

# Load built-in dataset
tips = sns.load_dataset("tips")

# Set style
sns.set_theme(style="whitegrid", palette="muted")

# 1. Box plot — distribution by category
plt.figure(figsize=(8, 4))
sns.boxplot(data=tips, x="day", y="total_bill", hue="sex")
plt.title("Bill Distribution by Day")
plt.show()

# 2. Violin plot — density + box
plt.figure(figsize=(8, 4))
sns.violinplot(data=tips, x="time", y="total_bill", hue="sex", split=True)
plt.title("Lunch vs Dinner Bill Distribution")
plt.show()

# 3. Heatmap — correlation matrix
numeric_cols = tips.select_dtypes(include=["float64", "int64"])
corr = numeric_cols.corr()
sns.heatmap(corr, annot=True, cmap="coolwarm", center=0,
            square=True, linewidths=1)
plt.title("Feature Correlations")
plt.show()

# 4. Pairplot — all numeric relationships
sns.pairplot(tips, hue="sex", diag_kind="kde", corner=True)
plt.show()`}</pre>
          </div>
        </div>

        {/* Chart Types and When to Use */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-sm font-black uppercase tracking-wider text-gray-700 mb-4 flex items-center gap-2">
            <PieChart className="w-4 h-4 text-violet-500" /> Chart Types & Best Practices
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
            {[
              ["Line Chart", "Time series trends, continuous data over intervals. Use markers sparingly. Always include zero baseline if appropriate."],
              ["Bar Chart", "Compare categories or groups. Horizontal bars for long labels. Sort bars for easier comparison."],
              ["Histogram", "Distribution of a single numeric variable. Choose appropriate bin width. Overlay KDE for smooth density estimation."],
              ["Scatter Plot", "Relationship between two numeric variables. Add transparency for overlapping points. Use hue for third variable encoding."],
              ["Box Plot", "Distribution quartiles and outliers. Good for comparing multiple groups. Combine with swarm plot for small datasets."],
              ["Heatmap", "Matrix values as colors. Use diverging colormaps when there is a meaningful midpoint. Annotate with values for precision."],
            ].map(([name, desc]) => (
              <div key={name} className="p-3 bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl border border-emerald-100">
                <p className="text-sm font-bold text-emerald-800 mb-1">{name}</p>
                <p className="text-xs text-emerald-600 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
          <div className="bg-gray-900 rounded-xl p-4 font-mono text-xs text-green-400 overflow-x-auto">
            <pre>{`# Interactive plots with Plotly Express
import plotly.express as px

# Scatter matrix (SPLOM)
df = px.data.iris()
fig = px.scatter_matrix(df, dimensions=["sepal_length", "sepal_width",
                        "petal_length", "petal_width"], color="species")
fig.show()

# 3D scatter
fig = px.scatter_3d(df, x="sepal_length", y="sepal_width",
                     z="petal_length", color="species",
                     size="petal_width", hover_name="species")
fig.show()

# Animated choropleth
gapminder = px.data.gapminder()
fig = px.scatter(gapminder, x="gdpPercap", y="lifeExp",
                 size="pop", color="continent",
                 animation_frame="year", log_x=True,
                 size_max=60, range_y=[20, 90])
fig.show()`}</pre>
          </div>
        </div>

        {/* Interactive & Dashboard */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-sm font-black uppercase tracking-wider text-gray-700 mb-4 flex items-center gap-2">
            <LineChart className="w-4 h-4 text-rose-500" /> Interactive Dashboards
          </h2>
          <p className="text-sm text-gray-600 mb-4 leading-relaxed">
            For dashboards and interactive exploration, Plotly Dash and Streamlit let you build web-based visualizations with Python alone. Plotly graphs are zoomable, hoverable, and exportable. Streamlit creates live-updating dashboards with minimal code.
          </p>
          <div className="bg-gray-900 rounded-xl p-4 font-mono text-xs text-green-400 overflow-x-auto mb-4">
            <pre>{`# Streamlit dashboard
import streamlit as st
import pandas as pd
import plotly.express as px

st.set_page_config(page_title="Sales Dashboard", layout="wide")

# Upload data
uploaded = st.file_uploader("Upload CSV", type="csv")
if uploaded:
    df = pd.read_csv(uploaded)

    # Sidebar filters
    st.sidebar.header("Filters")
    category = st.sidebar.multiselect(
        "Category", df["category"].unique(), default=df["category"].unique()
    )
    filtered = df[df["category"].isin(category)]

    # Layout
    col1, col2 = st.columns(2)

    with col1:
        fig = px.bar(filtered, x="month", y="revenue",
                     color="category", title="Monthly Revenue")
        st.plotly_chart(fig, use_container_width=True)

    with col2:
        fig = px.pie(filtered, values="sales", names="region",
                     title="Sales by Region")
        st.plotly_chart(fig, use_container_width=True)

    # Time series
    fig = px.line(filtered, x="date", y="cumulative",
                  color="category", title="Cumulative Growth")
    st.plotly_chart(fig, use_container_width=True)`}</pre>
          </div>
        </div>

        {/* Interview Questions */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-sm font-black uppercase tracking-wider text-gray-700 mb-4">Interview Questions</h2>
          <div className="space-y-4">
            {[
              ["What is the difference between Matplotlib, Seaborn, and Plotly?",
               "Matplotlib is the lowest-level library with full control over every element. Seaborn provides high-level statistical plots with built-in aggregation and attractive defaults. Plotly produces interactive, web-ready visualizations with hover, zoom, and animation support."],
              ["How do you choose the right chart type for your data?",
               "Line charts for trends over time. Bar charts for comparing categories. Histograms for distributions. Scatter plots for relationships. Box plots for comparing distributions across groups. Heatmaps for matrix/correlation data. Pie charts only for parts-of-a-whole with few categories."],
              ["What are the key principles of effective data visualization?",
               "1) Know your audience and context. 2) Choose the right chart type. 3) Minimize chart junk — remove unnecessary gridlines, borders, and effects. 4) Use color intentionally (not just decoration). 5) Label axes clearly. 6) Include context (baselines, annotations). 7) Tell a story with the data."],
              ["How does color choice impact data visualization?",
               "Color encodes meaning: sequential colormaps (light→dark) for magnitude, diverging colormaps (two hues) for deviation from a midpoint, qualitative palettes for categories. Always consider colorblind accessibility — use shapes/texture as redundant encoding. Avoid rainbow colormaps as they misrepresent data."],
              ["What is the difference between exploratory and explanatory visualizations?",
               "Exploratory visualizations are for data analysis — quick plots to find patterns, outliers, and relationships (e.g., pairplots, histograms). They are often messy and temporary. Explanatory visualizations are polished, annotated, and designed to communicate a specific insight to an audience (e.g., dashboards, reports)."],
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
