"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Activity, ChevronRight, BookOpen, BarChart3, Search,
  Bell, Database, LineChart
} from "lucide-react";

const PROMETHEUS_CONFIG = `# prometheus.yml
global:
  scrape_interval: 15s
  evaluation_interval: 15s

alerting:
  alertmanagers:
    - static_configs:
        - targets: ['localhost:9093']

rule_files:
  - "alerts.yml"

scrape_configs:
  - job_name: 'node'
    static_configs:
      - targets: ['localhost:9100']

  - job_name: 'kubernetes'
    kubernetes_sd_configs:
      - role: pod`;

const PROMQL_EXAMPLES = [
  { query: 'node_cpu_seconds_total{mode="idle"}', desc: "CPU idle time" },
  { query: 'rate(node_cpu_seconds_total[5m])', desc: "CPU usage rate over 5 minutes" },
  { query: 'node_memory_MemAvailable_bytes / node_memory_MemTotal_bytes * 100', desc: "Memory available %" },
  { query: 'rate(http_requests_total[1m])', desc: "HTTP requests per second" },
  { query: 'histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m]))', desc: "p95 latency" },
  { query: 'up == 0', desc: "Down targets (alert)" },
];

const ALERTS_YAML = `# alerts.yml
groups:
  - name: node_alerts
    rules:
      - alert: HighCPUUsage
        expr: node_cpu_seconds_total{mode="idle"} < 20
        for: 5m
        labels:
          severity: critical
        annotations:
          summary: "CPU usage above 80% for 5 minutes"`;

const ELK_COMPONENTS = [
  {
    name: "Elasticsearch", icon: Search, desc: "Distributed search and analytics engine",
    details: "Stores and indexes log data. Supports full-text search, aggregation, and scaling across clusters. RESTful API for ingestion and querying."
  },
  {
    name: "Logstash", icon: Database, desc: "Server-side data processing pipeline",
    details: "Ingests data from multiple sources (file, syslog, beats), transforms it with filters (grok, mutate, date), and sends it to Elasticsearch."
  },
  {
    name: "Kibana", icon: LineChart, desc: "Visualization and dashboard platform",
    details: "Web UI for Elasticsearch. Create dashboards, discover logs, build visualizations, set up alerts, and manage Elastic Stack."
  },
  {
    name: "Beats", icon: Activity, desc: "Lightweight data shippers",
    details: "Single-purpose agents: Filebeat (logs), Metricbeat (metrics), Heartbeat (uptime), Winlogbeat (Windows events)."
  },
];

const GRAFANA_DATASOURCES = [
  { name: "Prometheus", desc: "Time-series metrics" },
  { name: "Elasticsearch", desc: "Logs and search analytics" },
  { name: "InfluxDB", desc: "Time-series database" },
  { name: "CloudWatch", desc: "AWS metrics" },
  { name: "Azure Monitor", desc: "Azure metrics" },
  { name: "Stackdriver", desc: "Google Cloud metrics" },
  { name: "Loki", desc: "Log aggregation (Grafana-native)" },
  { name: "Tempo", desc: "Tracing backend" },
];

const INTERVIEW_QS = [
  {
    q: "What is the difference between white-box and black-box monitoring?",
    a: "White-box monitoring monitors internal application metrics (CPU, memory, request rate, error rate, latency) exposed by the application itself. Black-box monitoring tests the system from the outside (synthetic checks, uptime probes, API endpoint validation). White-box tells you what's happening inside; black-box tells you what users experience."
  },
  {
    q: "Explain the Prometheus pull model vs push-based monitoring.",
    a: "Prometheus pulls metrics by scraping targets at configured intervals. Targets expose an HTTP endpoint (/metrics). The pull model is simpler for discovery, self-monitoring (alert if target is down), and centralized control. Push-based systems (Graphite, InfluxDB) require agents to send data — better for batch jobs or firewalled environments."
  },
  {
    q: "What are the four golden signals of monitoring?",
    a: "1) Latency — time to service a request. 2) Traffic — demand on the system (requests/sec). 3) Errors — rate of failed requests (explicit HTTP 500s, implicit slow responses). 4) Saturation — how full the service is (CPU, memory, queue depth). These signals, from Google SRE, provide a comprehensive view of system health."
  },
  {
    q: "How does the ELK stack work together?",
    a: "Beats ship data from sources (Filebeat for logs, Metricbeat for metrics). Logstash optionally processes and transforms data with filters (parsing, enrichment). Elasticsearch stores and indexes data for fast search and aggregation. Kibana provides visualization, dashboards, and alerting. This forms the Elastic Stack (formerly ELK) for centralized logging."
  }
];

export default function MonitoringPage() {
  const [activeOverview, setActiveOverview] = useState(0);
  const [promqlIndex, setPromqlIndex] = useState(0);

  return (
    <div className="min-h-screen bg-gray-50 px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <div className="max-w-6xl mx-auto space-y-6 sm:space-y-8">
        <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-gray-500">
          <Link href="/tools/devops" className="hover:text-cyan-600 transition-colors font-semibold">DevOps</Link>
          <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 shrink-0" />
          <span className="text-cyan-600 font-bold">Monitoring</span>
        </div>

        <div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-gray-900 mb-2 sm:mb-3">
            <Activity className="inline w-7 h-7 sm:w-9 sm:h-9 mr-2 text-cyan-600" />
            Monitoring & Observability
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-gray-600 max-w-3xl">
            Observability with Prometheus, Grafana, and the ELK Stack. Metrics, logs, traces, dashboards, and alerting.
          </p>
        </div>

        <div className="grid sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
            <div className="flex items-center gap-2 mb-2"><BarChart3 className="w-4 h-4 text-orange-600" /><h3 className="font-bold text-xs text-gray-900">Prometheus</h3></div>
            <p className="text-[11px] text-gray-500">Time-series monitoring with pull-based metric collection, powerful PromQL query language, and built-in alerting.</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
            <div className="flex items-center gap-2 mb-2"><Activity className="w-4 h-4 text-green-600" /><h3 className="font-bold text-xs text-gray-900">Grafana</h3></div>
            <p className="text-[11px] text-gray-500">Open-source dashboard and visualization platform. Supports multiple data sources with rich panel types.</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
            <div className="flex items-center gap-2 mb-2"><Search className="w-4 h-4 text-blue-600" /><h3 className="font-bold text-xs text-gray-900">ELK Stack</h3></div>
            <p className="text-[11px] text-gray-500">Centralized logging: Elasticsearch stores logs, Logstash processes, Kibana visualizes. Add Filebeat for shipping.</p>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <div className="flex items-center gap-2 mb-4"><BarChart3 className="w-4 h-4 text-orange-600" /><h2 className="text-sm font-black uppercase tracking-wider text-gray-700">Prometheus</h2></div>
          <pre className="bg-gray-900 text-green-400 p-4 rounded-xl text-xs font-mono overflow-x-auto leading-relaxed mb-4">{PROMETHEUS_CONFIG}</pre>
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-gray-700">PromQL Examples</h3>
            <div className="flex flex-wrap gap-2 mb-3">
              {PROMQL_EXAMPLES.map((ex, i) => (
                <button
                  key={i}
                  onClick={() => setPromqlIndex(i)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                    promqlIndex === i ? "border-orange-400 bg-orange-50 text-orange-700" : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
                  }`}
                >
                  {ex.query.length > 30 ? ex.query.slice(0, 30) + "..." : ex.query}
                </button>
              ))}
            </div>
            <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
              <code className="text-xs font-mono text-orange-700 font-bold">{PROMQL_EXAMPLES[promqlIndex].query}</code>
              <p className="text-xs text-gray-600 mt-1">{PROMQL_EXAMPLES[promqlIndex].desc}</p>
            </div>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
            <div className="flex items-center gap-2 mb-4"><Activity className="w-4 h-4 text-green-600" /><h2 className="text-sm font-black uppercase tracking-wider text-gray-700">Grafana Dashboards</h2></div>
            <div className="space-y-3">
              <div>
                <h4 className="text-xs font-bold text-gray-800 mb-2">Supported Data Sources</h4>
                <div className="grid grid-cols-2 gap-1.5">
                  {GRAFANA_DATASOURCES.map(ds => (
                    <div key={ds.name} className="flex items-center gap-1.5 p-1.5 bg-gray-50 rounded">
                      <span className="w-2 h-2 rounded-full bg-green-500 shrink-0" />
                      <span className="text-[11px] font-semibold text-gray-700">{ds.name}</span>
                      <span className="text-[10px] text-gray-500 ml-auto">{ds.desc}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg border border-blue-200 text-xs text-blue-800">
                <span className="font-bold">Panels:</span> Time series, Bar chart, Stat, Gauge, Table, Heatmap, Logs, Traces
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
            <div className="flex items-center gap-2 mb-4"><Search className="w-4 h-4 text-blue-600" /><h2 className="text-sm font-black uppercase tracking-wider text-gray-700">ELK Stack</h2></div>
            <div className="space-y-2">
              {ELK_COMPONENTS.map((comp, i) => {
                const Icon = comp.icon;
                return (
                  <button
                    key={comp.name}
                    onClick={() => setActiveOverview(i)}
                    className={`w-full flex items-start gap-3 p-3 rounded-xl border text-left transition-all ${
                      i === activeOverview
                        ? "border-blue-400 bg-blue-50"
                        : "border-gray-200 bg-white hover:border-gray-300"
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                      i === 0 ? "bg-blue-100 text-blue-600" : i === 1 ? "bg-purple-100 text-purple-600" : i === 2 ? "bg-green-100 text-green-600" : "bg-amber-100 text-amber-600"
                    }`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-gray-900">{comp.name}</h4>
                      <p className="text-[11px] text-gray-500 mt-0.5">{comp.desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>
            <div className="mt-3 p-3 bg-gray-50 rounded-lg text-xs text-gray-600">
              <span className="font-bold">Flow:</span> Beats → Logstash → Elasticsearch → Kibana
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <div className="flex items-center gap-2 mb-4"><Bell className="w-4 h-4 text-rose-600" /><h2 className="text-sm font-black uppercase tracking-wider text-gray-700">Alerting</h2></div>
          <pre className="bg-gray-900 text-green-400 p-4 rounded-xl text-xs font-mono overflow-x-auto leading-relaxed mb-3">{ALERTS_YAML}</pre>
          <div className="grid sm:grid-cols-2 gap-3 text-xs text-gray-600">
            <div className="p-3 bg-gray-50 rounded-lg">
              <span className="font-bold text-gray-800">Alertmanager</span>
              <p className="text-[11px]">Handles deduplication, grouping, silencing, and routing alerts to receivers (Slack, PagerDuty, email).</p>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <span className="font-bold text-gray-800">Alert Rules</span>
              <p className="text-[11px]">PromQL expressions evaluated periodically. Transition from pending to firing after the `for` duration.</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <div className="flex items-center gap-2 mb-4"><BookOpen className="w-4 h-4 text-cyan-600" /><h2 className="text-sm font-black uppercase tracking-wider text-gray-700">Interview Questions</h2></div>
          <div className="space-y-3">
            {INTERVIEW_QS.map((item, i) => (
              <details key={i} className="bg-cyan-50 rounded-xl border border-cyan-200 group">
                <summary className="px-4 py-3 flex items-center justify-between cursor-pointer text-xs sm:text-sm font-semibold text-gray-900 hover:text-cyan-700 transition-colors list-none">
                  <span>Q{i + 1}: {item.q}</span>
                  <ChevronRight className="w-4 h-4 text-gray-400 group-open:rotate-90 transition-transform shrink-0" />
                </summary>
                <div className="px-4 pb-4 text-xs sm:text-sm text-gray-600 leading-relaxed border-t border-cyan-200 pt-3">{item.a}</div>
              </details>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
