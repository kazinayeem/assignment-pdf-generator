"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ChevronRight, Plus, Trash2, Play, RotateCcw, Info } from "lucide-react";

type Algorithm = "FCFS" | "SJF" | "SRTF" | "RR" | "Priority";

interface Process {
  id: string;
  name: string;
  arrival: number;
  burst: number;
  priority: number;
}

interface GanttBlock {
  name: string;
  start: number;
  end: number;
  color: string;
}

interface Result {
  name: string;
  arrival: number;
  burst: number;
  completion: number;
  turnaround: number;
  waiting: number;
}

const COLORS = ["#3b82f6","#8b5cf6","#10b981","#f59e0b","#ef4444","#06b6d4","#f97316","#ec4899"];

let pid = 0;
function uid() { return `P${++pid}`; }

function runFCFS(procs: Process[]): { gantt: GanttBlock[]; results: Result[] } {
  const sorted = [...procs].sort((a, b) => a.arrival - b.arrival);
  const gantt: GanttBlock[] = [];
  const results: Result[] = [];
  let time = 0;
  sorted.forEach((p, i) => {
    if (time < p.arrival) time = p.arrival;
    const start = time;
    time += p.burst;
    gantt.push({ name: p.name, start, end: time, color: COLORS[i % COLORS.length] });
    results.push({ name: p.name, arrival: p.arrival, burst: p.burst, completion: time, turnaround: time - p.arrival, waiting: time - p.arrival - p.burst });
  });
  return { gantt, results };
}

function runSJF(procs: Process[]): { gantt: GanttBlock[]; results: Result[] } {
  const remaining = procs.map((p, i) => ({ ...p, done: false, colorIdx: i }));
  const gantt: GanttBlock[] = [];
  const results: Result[] = [];
  let time = 0;
  let done = 0;
  while (done < remaining.length) {
    const available = remaining.filter(p => !p.done && p.arrival <= time);
    if (available.length === 0) { time++; continue; }
    available.sort((a, b) => a.burst - b.burst);
    const p = available[0];
    const start = time;
    time += p.burst;
    gantt.push({ name: p.name, start, end: time, color: COLORS[p.colorIdx % COLORS.length] });
    results.push({ name: p.name, arrival: p.arrival, burst: p.burst, completion: time, turnaround: time - p.arrival, waiting: time - p.arrival - p.burst });
    remaining.find(r => r.id === p.id)!.done = true;
    done++;
  }
  return { gantt, results };
}

function runRR(procs: Process[], quantum: number): { gantt: GanttBlock[]; results: Result[] } {
  const queue = procs.map((p, i) => ({ ...p, rem: p.burst, colorIdx: i, completion: 0 }));
  const gantt: GanttBlock[] = [];
  let time = 0;
  const ready: typeof queue = [];
  const arrived = new Set<string>();
  let idx = 0;

  while (true) {
    // Add newly arrived
    queue.forEach(p => { if (p.arrival <= time && !arrived.has(p.id)) { ready.push(p); arrived.add(p.id); } });
    if (ready.length === 0) {
      if (queue.every(p => p.rem === 0)) break;
      time++; idx++;
      continue;
    }
    const p = ready.shift()!;
    const exec = Math.min(quantum, p.rem);
    gantt.push({ name: p.name, start: time, end: time + exec, color: COLORS[p.colorIdx % COLORS.length] });
    time += exec;
    p.rem -= exec;
    // Add newly arrived during this slice
    queue.forEach(q => { if (q.arrival <= time && !arrived.has(q.id)) { ready.push(q); arrived.add(q.id); } });
    if (p.rem > 0) ready.push(p);
    else p.completion = time;
  }

  const results: Result[] = queue.map(p => ({
    name: p.name, arrival: p.arrival, burst: p.burst, completion: p.completion,
    turnaround: p.completion - p.arrival, waiting: p.completion - p.arrival - p.burst,
  }));
  return { gantt, results };
}

function runPriority(procs: Process[]): { gantt: GanttBlock[]; results: Result[] } {
  const remaining = procs.map((p, i) => ({ ...p, done: false, colorIdx: i }));
  const gantt: GanttBlock[] = [];
  const results: Result[] = [];
  let time = 0;
  let done = 0;
  while (done < remaining.length) {
    const available = remaining.filter(p => !p.done && p.arrival <= time);
    if (available.length === 0) { time++; continue; }
    available.sort((a, b) => a.priority - b.priority);
    const p = available[0];
    const start = time;
    time += p.burst;
    gantt.push({ name: p.name, start, end: time, color: COLORS[p.colorIdx % COLORS.length] });
    results.push({ name: p.name, arrival: p.arrival, burst: p.burst, completion: time, turnaround: time - p.arrival, waiting: time - p.arrival - p.burst });
    remaining.find(r => r.id === p.id)!.done = true;
    done++;
  }
  return { gantt, results };
}

const ALGO_INFO: Record<Algorithm, { desc: string; preemptive: boolean; best: string }> = {
  FCFS:     { desc: "First Come First Served — processes execute in arrival order. Simple but can cause convoy effect.", preemptive: false, best: "Batch systems" },
  SJF:      { desc: "Shortest Job First — picks the process with smallest burst time. Optimal average waiting time.", preemptive: false, best: "Batch systems with known burst times" },
  SRTF:     { desc: "Shortest Remaining Time First — preemptive SJF. Preempts if a shorter job arrives.", preemptive: true, best: "Interactive systems" },
  RR:       { desc: "Round Robin — each process gets a fixed time quantum. Fair and widely used in time-sharing.", preemptive: true, best: "Time-sharing systems" },
  Priority: { desc: "Priority Scheduling — process with highest priority (lowest number) runs first.", preemptive: false, best: "Real-time systems" },
};

export default function CPUSchedulingPage() {
  const [processes, setProcesses] = useState<Process[]>([
    { id: uid(), name: "P1", arrival: 0, burst: 6, priority: 2 },
    { id: uid(), name: "P2", arrival: 2, burst: 4, priority: 1 },
    { id: uid(), name: "P3", arrival: 4, burst: 2, priority: 3 },
    { id: uid(), name: "P4", arrival: 6, burst: 8, priority: 2 },
  ]);
  const [algo, setAlgo] = useState<Algorithm>("FCFS");
  const [quantum, setQuantum] = useState(2);
  const [gantt, setGantt] = useState<GanttBlock[]>([]);
  const [results, setResults] = useState<Result[]>([]);
  const [ran, setRan] = useState(false);

  const addProcess = () => {
    const n = processes.length + 1;
    setProcesses(p => [...p, { id: uid(), name: `P${n}`, arrival: 0, burst: 4, priority: 1 }]);
  };

  const removeProcess = (id: string) => setProcesses(p => p.filter(x => x.id !== id));

  const updateProcess = (id: string, field: keyof Process, value: string | number) => {
    setProcesses(p => p.map(x => x.id === id ? { ...x, [field]: typeof value === "string" ? value : Number(value) } : x));
  };

  const run = () => {
    let res: { gantt: GanttBlock[]; results: Result[] };
    if (algo === "FCFS") res = runFCFS(processes);
    else if (algo === "SJF" || algo === "SRTF") res = runSJF(processes);
    else if (algo === "RR") res = runRR(processes, quantum);
    else res = runPriority(processes);
    setGantt(res.gantt);
    setResults(res.results);
    setRan(true);
  };

  const reset = () => { setGantt([]); setResults([]); setRan(false); };

  const totalTime = gantt.length > 0 ? gantt[gantt.length - 1].end : 0;
  const avgWT = results.length > 0 ? (results.reduce((s, r) => s + r.waiting, 0) / results.length).toFixed(2) : "—";
  const avgTAT = results.length > 0 ? (results.reduce((s, r) => s + r.turnaround, 0) / results.length).toFixed(2) : "—";
  const cpuUtil = totalTime > 0 ? ((processes.reduce((s, p) => s + p.burst, 0) / totalTime) * 100).toFixed(1) : "—";

  return (
    <div className="min-h-screen bg-gray-50 px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-6">
        <Link href="/tools/os" className="hover:text-gray-700 transition-colors">OS</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-gray-700 font-semibold">CPU Scheduling</span>
      </div>

      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <h1 className="text-2xl font-black text-gray-900">CPU Scheduling Simulator</h1>
              <p className="text-gray-500 text-sm mt-1">Simulate FCFS, SJF, SRTF, Round Robin and Priority scheduling with Gantt chart.</p>
            </div>
            <div className="flex gap-3 shrink-0">
              {[["Avg WT", avgWT + "ms"], ["Avg TAT", avgTAT + "ms"], ["CPU Util", cpuUtil + "%"]].map(([l, v]) => (
                <div key={l} className="px-3 py-2 bg-sky-50 rounded-xl border border-sky-100 text-center">
                  <p className="text-sm font-black text-sky-600">{v}</p>
                  <p className="text-[9px] font-bold uppercase tracking-wider text-sky-400">{l}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Algorithm selector */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h2 className="text-xs font-black uppercase tracking-wider text-gray-500 mb-3">Algorithm</h2>
          <div className="flex flex-wrap gap-2 mb-4">
            {(["FCFS", "SJF", "SRTF", "RR", "Priority"] as Algorithm[]).map((a) => (
              <button key={a} onClick={() => setAlgo(a)}
                className={`px-4 py-2 rounded-xl text-sm font-bold border transition-all ${algo === a ? "bg-sky-600 text-white border-sky-600 shadow-sm" : "bg-white text-gray-600 border-gray-200 hover:border-sky-300"}`}>
                {a}
              </button>
            ))}
          </div>
          <div className="p-4 bg-sky-50 rounded-xl border border-sky-100 flex flex-wrap gap-4 items-start">
            <div className="flex-1 min-w-0">
              <p className="text-xs font-black text-sky-700 mb-1">{algo} — {ALGO_INFO[algo].preemptive ? "Preemptive" : "Non-Preemptive"}</p>
              <p className="text-xs text-sky-600 leading-relaxed">{ALGO_INFO[algo].desc}</p>
            </div>
            <div className="text-xs text-sky-500 shrink-0">Best for: <span className="font-bold">{ALGO_INFO[algo].best}</span></div>
          </div>
          {algo === "RR" && (
            <div className="mt-3 flex items-center gap-3">
              <label className="text-xs font-bold text-gray-500">Time Quantum:</label>
              <input type="number" min={1} max={20} value={quantum} onChange={(e) => setQuantum(parseInt(e.target.value) || 1)}
                className="w-20 h-9 px-3 text-sm rounded-lg border border-gray-200 focus:outline-none focus:border-sky-400" />
              <span className="text-xs text-gray-400">ms</span>
            </div>
          )}
        </div>

        {/* Process table */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xs font-black uppercase tracking-wider text-gray-500">Processes</h2>
            <button onClick={addProcess} className="flex items-center gap-1.5 text-xs font-bold text-sky-600 hover:text-sky-700 transition-colors">
              <Plus className="w-3.5 h-3.5" /> Add Process
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  {["Process", "Arrival Time", "Burst Time", algo === "Priority" ? "Priority (lower=higher)" : "Priority", ""].map((h) => (
                    <th key={h} className="text-left py-2 px-3 text-[10px] font-black uppercase tracking-wider text-gray-400">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {processes.map((p, i) => (
                  <tr key={p.id} className="border-b border-gray-50">
                    <td className="py-2 px-3">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                        <input value={p.name} onChange={(e) => updateProcess(p.id, "name", e.target.value)}
                          className="w-16 h-8 px-2 text-sm font-bold rounded-lg border border-gray-200 focus:outline-none focus:border-sky-400" />
                      </div>
                    </td>
                    <td className="py-2 px-3">
                      <input type="number" min={0} value={p.arrival} onChange={(e) => updateProcess(p.id, "arrival", e.target.value)}
                        className="w-20 h-8 px-2 text-sm rounded-lg border border-gray-200 focus:outline-none focus:border-sky-400" />
                    </td>
                    <td className="py-2 px-3">
                      <input type="number" min={1} value={p.burst} onChange={(e) => updateProcess(p.id, "burst", e.target.value)}
                        className="w-20 h-8 px-2 text-sm rounded-lg border border-gray-200 focus:outline-none focus:border-sky-400" />
                    </td>
                    <td className="py-2 px-3">
                      <input type="number" min={1} value={p.priority} onChange={(e) => updateProcess(p.id, "priority", e.target.value)}
                        className="w-20 h-8 px-2 text-sm rounded-lg border border-gray-200 focus:outline-none focus:border-sky-400"
                        disabled={algo !== "Priority"} />
                    </td>
                    <td className="py-2 px-3">
                      <button onClick={() => removeProcess(p.id)} disabled={processes.length <= 1}
                        className="text-gray-300 hover:text-red-500 disabled:opacity-30 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex gap-3 mt-4">
            <button onClick={run} className="flex items-center gap-2 px-6 py-2.5 bg-sky-600 hover:bg-sky-700 text-white text-sm font-bold rounded-xl transition-colors shadow-sm">
              <Play className="w-4 h-4" /> Run Simulation
            </button>
            <button onClick={reset} className="flex items-center gap-2 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-bold rounded-xl transition-colors">
              <RotateCcw className="w-4 h-4" /> Reset
            </button>
          </div>
        </div>

        {/* Gantt Chart */}
        {ran && gantt.length > 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <h2 className="text-xs font-black uppercase tracking-wider text-gray-500 mb-4">Gantt Chart</h2>
            <div className="overflow-x-auto pb-2">
              <div className="flex items-end gap-0 min-w-max">
                {gantt.map((block, i) => {
                  const width = Math.max(40, ((block.end - block.start) / totalTime) * 700);
                  return (
                    <div key={i} className="flex flex-col items-center">
                      <div className="flex items-center justify-center text-white text-xs font-black rounded-sm"
                        style={{ width, height: 44, backgroundColor: block.color, minWidth: 40 }}>
                        {block.name}
                      </div>
                      <span className="text-[9px] text-gray-400 mt-1">{block.start}</span>
                    </div>
                  );
                })}
                <div className="flex flex-col items-center">
                  <div style={{ width: 2, height: 44, backgroundColor: "transparent" }} />
                  <span className="text-[9px] text-gray-400 mt-1">{totalTime}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Results table */}
        {ran && results.length > 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <h2 className="text-xs font-black uppercase tracking-wider text-gray-500 mb-4">Results</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100">
                    {["Process", "Arrival", "Burst", "Completion", "Turnaround", "Waiting"].map((h) => (
                      <th key={h} className="text-left py-2 px-3 text-[10px] font-black uppercase tracking-wider text-gray-400">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {results.map((r, i) => (
                    <tr key={r.name} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                      <td className="py-2.5 px-3">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                          <span className="font-bold">{r.name}</span>
                        </div>
                      </td>
                      <td className="py-2.5 px-3 text-gray-600">{r.arrival}</td>
                      <td className="py-2.5 px-3 text-gray-600">{r.burst}</td>
                      <td className="py-2.5 px-3 font-bold text-sky-600">{r.completion}</td>
                      <td className="py-2.5 px-3 font-bold text-violet-600">{r.turnaround}</td>
                      <td className="py-2.5 px-3 font-bold text-emerald-600">{r.waiting}</td>
                    </tr>
                  ))}
                  <tr className="bg-gray-50 font-bold">
                    <td className="py-2.5 px-3 text-gray-700" colSpan={4}>Averages</td>
                    <td className="py-2.5 px-3 text-violet-700">{avgTAT}</td>
                    <td className="py-2.5 px-3 text-emerald-700">{avgWT}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Theory */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-sm font-black uppercase tracking-wider text-gray-700 mb-4 flex items-center gap-2">
            <Info className="w-4 h-4 text-sky-500" /> Algorithm Comparison
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  {["Algorithm", "Preemptive", "Starvation", "Overhead", "Best For"].map((h) => (
                    <th key={h} className="text-left py-2 px-3 text-[10px] font-black uppercase tracking-wider text-gray-400">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  ["FCFS",     "No",  "No",       "Low",    "Batch systems"],
                  ["SJF",      "No",  "Yes",      "Medium", "Batch with known burst"],
                  ["SRTF",     "Yes", "Yes",      "High",   "Interactive systems"],
                  ["RR",       "Yes", "No",       "Medium", "Time-sharing OS"],
                  ["Priority", "No",  "Yes",      "Medium", "Real-time systems"],
                ].map(([name, pre, starv, over, best]) => (
                  <tr key={name} className={`border-b border-gray-50 hover:bg-gray-50 transition-colors ${name === algo ? "bg-sky-50" : ""}`}>
                    <td className="py-2.5 px-3 font-bold text-gray-800">{name}</td>
                    <td className="py-2.5 px-3"><span className={`text-xs font-bold px-2 py-0.5 rounded-full ${pre === "Yes" ? "bg-orange-50 text-orange-600" : "bg-gray-100 text-gray-500"}`}>{pre}</span></td>
                    <td className="py-2.5 px-3"><span className={`text-xs font-bold px-2 py-0.5 rounded-full ${starv === "Yes" ? "bg-red-50 text-red-500" : "bg-emerald-50 text-emerald-600"}`}>{starv}</span></td>
                    <td className="py-2.5 px-3 text-gray-600 text-xs">{over}</td>
                    <td className="py-2.5 px-3 text-gray-500 text-xs">{best}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Viva */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-sm font-black uppercase tracking-wider text-gray-700 mb-4">Interview Questions</h2>
          <div className="space-y-3">
            {[
              { q: "What is the convoy effect in FCFS?", a: "When a long process holds the CPU, causing shorter processes to wait — leading to poor average waiting time." },
              { q: "Why is SJF optimal for average waiting time?", a: "By always picking the shortest job, it minimizes the total waiting time across all processes." },
              { q: "What is the difference between SJF and SRTF?", a: "SJF is non-preemptive (runs to completion), SRTF is preemptive (can be interrupted by a shorter job)." },
              { q: "What happens if quantum is too large in Round Robin?", a: "It degenerates to FCFS. If too small, context switching overhead becomes significant." },
              { q: "What is aging in priority scheduling?", a: "Gradually increasing the priority of waiting processes to prevent starvation." },
            ].map((qa, i) => (
              <div key={i} className="p-4 bg-sky-50 rounded-xl border border-sky-100">
                <p className="text-sm font-bold text-gray-800 mb-1">Q: {qa.q}</p>
                <p className="text-sm text-sky-700">A: {qa.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
