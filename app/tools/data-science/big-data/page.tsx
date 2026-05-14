"use client";

import React from "react";
import Link from "next/link";
import { ChevronRight, Network, Server, Database, GitBranch } from "lucide-react";

export default function BigDataPage() {
  return (
    <div className="min-h-screen bg-gray-50 px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-6">
        <Link href="/tools/data-science" className="hover:text-gray-700 transition-colors">Data Science</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-gray-700 font-semibold">Big Data</span>
      </div>

      <div className="max-w-4xl mx-auto space-y-6">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center shadow-sm">
              <Network className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-gray-900">Big Data</h1>
              <p className="text-gray-500 text-sm">Hadoop, Spark, MapReduce, and data pipelines at scale.</p>
            </div>
          </div>
        </div>

        {/* Hadoop Ecosystem */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-sm font-black uppercase tracking-wider text-gray-700 mb-4 flex items-center gap-2">
            <Server className="w-4 h-4 text-teal-500" /> Hadoop Ecosystem
          </h2>
          <p className="text-sm text-gray-600 mb-4 leading-relaxed">
            Apache Hadoop is the foundation of big data processing. It provides distributed storage (HDFS) and distributed computation (MapReduce) across clusters of commodity hardware.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
            {[
              ["HDFS", "Distributed file system", "Stores files in blocks (128 MB) across nodes with replication (default 3x)"],
              ["MapReduce", "Compute framework", "Processes data in two phases: Map (filter/sort) and Reduce (aggregate/summarize)"],
              ["YARN", "Resource manager", "Manages cluster resources, schedules jobs, allocates CPU/memory per application"],
              ["Hive", "SQL on Hadoop", "SQL-like interface (HiveQL) that compiles queries into MapReduce/Tez jobs"],
              ["HBase", "NoSQL database", "Column-oriented, real-time random read/write on top of HDFS"],
              ["Oozie", "Workflow scheduler", "Orchestrates dependent jobs (MapReduce, Pig, Hive) in DAGs"],
              ["ZooKeeper", "Coordination service", "Distributed configuration, synchronization, and leader election"],
              ["Sqoop", "Data transfer", "Imports/exports data between Hadoop and relational databases"],
            ].map(([name, role, desc]) => (
              <div key={name} className="p-3 bg-teal-50 rounded-xl border border-teal-100">
                <p className="text-sm font-bold text-teal-800">{name}</p>
                <p className="text-[10px] text-teal-600 font-semibold">{role}</p>
                <p className="text-[9px] text-teal-500 mt-0.5">{desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* MapReduce Concept */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-sm font-black uppercase tracking-wider text-gray-700 mb-4 flex items-center gap-2">
            <GitBranch className="w-4 h-4 text-amber-500" /> MapReduce Concept
          </h2>
          <p className="text-sm text-gray-600 mb-4 leading-relaxed">
            MapReduce splits a job into map and reduce phases. The map phase processes input key-value pairs in parallel across nodes. The reduce phase aggregates intermediate results. Shuffling sorts and transfers data between phases.
          </p>
          <div className="bg-gray-900 rounded-xl p-4 font-mono text-xs text-green-400 overflow-x-auto mb-4">
            <pre>{`# Word Count — the Hello World of MapReduce
# Map phase: emit (word, 1) for each word
def mapper(line):
    words = line.strip().split()
    for word in words:
        print(f"{word.lower()}\\t1")

# Reduce phase: sum counts for each word
def reducer(word, counts):
    total = sum(counts)
    print(f"{word}\\t{total}")

# Input: "hello world hello hadoop"
# Map outputs:
#   hello  1
#   world  1
#   hello  1
#   hadoop 1
# Shuffle & sort:
#   hadoop [1]
#   hello  [1, 1]
#   world  [1]
# Reduce outputs:
#   hadoop  1
#   hello   2
#   world   1`}</pre>
          </div>
        </div>

        {/* Apache Spark */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-sm font-black uppercase tracking-wider text-gray-700 mb-4 flex items-center gap-2">
            <Database className="w-4 h-4 text-blue-500" /> Apache Spark
          </h2>
          <p className="text-sm text-gray-600 mb-4 leading-relaxed">
            Spark is a fast, in-memory distributed computing engine that outperforms MapReduce by 10-100x for many workloads. It provides high-level APIs in Python (PySpark), Scala, and SQL.
          </p>
          <div className="bg-gray-900 rounded-xl p-4 font-mono text-xs text-green-400 overflow-x-auto mb-4">
            <pre>{`from pyspark.sql import SparkSession
from pyspark.sql.functions import col, avg, count, when

# Initialize Spark
spark = SparkSession.builder \\
    .appName("DataScience") \\
    .getOrCreate()

# Read data
df = spark.read.csv("s3://bucket/sales.csv", header=True, inferSchema=True)
print(f"Partitions: {df.rdd.getNumPartitions()}")
print(f"Schema: {df.printSchema()}")

# Transformations (lazy — only computed on action)
daily_sales = df.groupBy("date").agg(
    count("*").alias("order_count"),
    avg("amount").alias("avg_amount"),
    sum("amount").alias("total_revenue")
)

# Action triggers computation
daily_sales.show(10)
daily_sales.write.parquet("output/daily_sales.parquet")

# Spark SQL
df.createOrReplaceTempView("sales")
result = spark.sql("""
    SELECT
        region,
        SUM(amount) as revenue
    FROM sales
    WHERE year = 2024
    GROUP BY region
    ORDER BY revenue DESC
""")
result.show()

# MLlib — distributed ML
from pyspark.ml.feature import VectorAssembler
from pyspark.ml.clustering import KMeans`}</pre>
          </div>
        </div>

        {/* Data Pipelines / ETL */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-sm font-black uppercase tracking-wider text-gray-700 mb-4">Data Pipelines & ETL</h2>
          <p className="text-sm text-gray-600 mb-4 leading-relaxed">
            ETL (Extract, Transform, Load) pipelines move data from sources to data warehouses or lakes. Modern tools like Airflow, dbt, and Spark Structure Streaming enable reliable, scalable pipeline orchestration.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
            {[
              ["Extract", "Pull data from APIs, databases, logs, SaaS tools, or streaming platforms (Kafka, Kinesis)"],
              ["Transform", "Clean, validate, aggregate, join, and enrich data. Apply business logic and schema changes."],
              ["Load", "Write to data warehouse (Snowflake, Redshift, BigQuery), data lake (S3, ADLS), or analytics store"],
            ].map(([phase, desc]) => (
              <div key={phase} className="p-4 bg-gradient-to-b from-gray-50 to-gray-100 rounded-xl border border-gray-200">
                <p className="text-sm font-bold text-gray-800 mb-1">{phase}</p>
                <p className="text-xs text-gray-500">{desc}</p>
              </div>
            ))}
          </div>
          <div className="bg-gray-900 rounded-xl p-4 font-mono text-xs text-green-400 overflow-x-auto">
            <pre>{`# Apache Airflow DAG (simplified)
from airflow import DAG
from airflow.operators.python import PythonOperator
from datetime import datetime

def extract(**ctx):
    # Read from API / database
    pass

def transform(**ctx):
    # Clean and aggregate
    pass

def load(**ctx):
    # Write to warehouse
    pass

with DAG(
    "sales_etl",
    start_date=datetime(2024, 1, 1),
    schedule="@daily",
    catchup=False
):
    extract_task = PythonOperator(
        task_id="extract", python_callable=extract
    )
    transform_task = PythonOperator(
        task_id="transform", python_callable=transform
    )
    load_task = PythonOperator(
        task_id="load", python_callable=load
    )

    extract_task >> transform_task >> load_task`}</pre>
          </div>
        </div>

        {/* Interview Questions */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-sm font-black uppercase tracking-wider text-gray-700 mb-4">Interview Questions</h2>
          <div className="space-y-4">
            {[
              ["What is the difference between Hadoop MapReduce and Spark?",
               "MapReduce writes intermediate data to disk between map and reduce phases, making it slower for iterative algorithms. Spark processes data in memory (RDDs/DataFrames), achieving 10-100x speedup. Spark also provides richer APIs (SQL, ML, streaming)."],
              ["Explain HDFS architecture.",
               "HDFS has a NameNode (master) that manages metadata and DataNodes (workers) that store data blocks. Files are split into blocks (default 128 MB) and replicated across DataNodes (default 3x) for fault tolerance."],
              ["What is the difference between a data lake and a data warehouse?",
               "A data warehouse stores structured, processed data optimized for SQL analytics (e.g., Snowflake). A data lake stores raw data in any format (structured, semi-structured, unstructured) typically on object storage (S3, ADLS)."],
              ["What is Spark's RDD and how does it differ from a DataFrame?",
               "RDD (Resilient Distributed Dataset) is the low-level distributed collection with no schema. DataFrame has a schema (like a table) and uses Spark SQL's Catalyst optimizer, providing better performance and simpler APIs."],
            ].map(([q, a]) => (
              <div key={q} className="p-4 bg-teal-50 rounded-xl border border-teal-100">
                <p className="text-sm font-bold text-teal-900 mb-1">Q: {q}</p>
                <p className="text-xs text-teal-700 leading-relaxed">{a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
