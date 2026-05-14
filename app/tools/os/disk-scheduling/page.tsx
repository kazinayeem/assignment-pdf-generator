"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  HardDrive,
  Activity,
  Cpu,
  Layers3,
  Gauge,
  CheckCircle2,
} from "lucide-react";

export default function DiskSchedulingPage() {
  const [algorithm, setAlgorithm] = useState("FCFS");

  const [requests, setRequests] = useState("98 183 37 122 14 124 65 67");

  const [head, setHead] = useState(53);

  const requestArray = useMemo(() => {
    return requests
      .split(" ")
      .map(Number)
      .filter((n) => !isNaN(n));
  }, [requests]);

  const simulation = useMemo(() => {
    let order: number[] = [];
    let totalSeek = 0;

    if (algorithm === "FCFS") {
      order = [head, ...requestArray];

      for (let i = 0; i < order.length - 1; i++) {
        totalSeek += Math.abs(order[i] - order[i + 1]);
      }
    }

    if (algorithm === "SSTF") {
      let current = head;
      let pending = [...requestArray];

      order.push(current);

      while (pending.length > 0) {
        let closest = pending.reduce((prev, curr) =>
          Math.abs(curr - current) <
          Math.abs(prev - current)
            ? curr
            : prev
        );

        totalSeek += Math.abs(current - closest);

        current = closest;

        order.push(current);

        pending = pending.filter((p) => p !== closest);
      }
    }

    if (algorithm === "SCAN") {
      let current = head;

      const left = requestArray
        .filter((r) => r < current)
        .sort((a, b) => b - a);

      const right = requestArray
        .filter((r) => r >= current)
        .sort((a, b) => a - b);

      order = [current, ...right, ...left];

      for (let i = 0; i < order.length - 1; i++) {
        totalSeek += Math.abs(order[i] - order[i + 1]);
      }
    }

    return {
      order,
      totalSeek,
      avgSeek:
        requestArray.length > 0
          ? (totalSeek / requestArray.length).toFixed(2)
          : 0,
    };
  }, [algorithm, requestArray, head]);

  return (
    <div className="min-h-screen bg-[#edf4fb] px-4 sm:px-6 md:px-8 py-6 sm:py-8">
      <div className="mx-auto max-w-7xl">

        {/* Back */}
        <Link
          href="/tools/os"
          className="mb-4 sm:mb-6 inline-flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-semibold text-sky-600"
        >
          <ArrowLeft size={16} />
          Back to Operating Systems
        </Link>

        {/* Hero */}
        <div className="flex flex-col gap-6 sm:gap-8 lg:flex-row lg:items-center lg:justify-between">

          <div>
            <p className="text-[11px] sm:text-sm uppercase tracking-[3px] sm:tracking-[5px] text-slate-500">
              Operating Systems
            </p>

            <h1 className="mt-2 sm:mt-3 text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-slate-900">
              Disk Scheduling Simulator
            </h1>

            <p className="mt-3 sm:mt-5 max-w-3xl text-sm sm:text-base leading-6 sm:leading-8 text-slate-500 md:text-lg">
              Learn how Operating Systems optimize disk access
              requests using FCFS, SSTF and SCAN scheduling
              algorithms with real-time visualization.
            </p>
          </div>

          <div className="rounded-2xl sm:rounded-[32px] bg-gradient-to-br from-indigo-500 via-sky-500 to-cyan-500 p-5 sm:p-8 text-white shadow-2xl">
            <HardDrive className="mb-3 sm:mb-4 h-10 w-10 sm:h-14 sm:w-14" />

            <h2 className="text-xl sm:text-3xl font-bold">
              Disk Scheduler Lab
            </h2>

            <p className="mt-2 sm:mt-3 max-w-xs text-sm sm:text-base leading-6 sm:leading-7 text-white/80">
              Visualize seek operations and disk head movement.
            </p>
          </div>
        </div>

        {/* Top Cards */}
        <div className="mt-6 sm:mt-10 grid grid-cols-2 gap-3 sm:gap-6 md:grid-cols-2 xl:grid-cols-4">

          <div className="rounded-2xl sm:rounded-[28px] bg-white p-4 sm:p-7 shadow-md">
            <Cpu className="mb-2 sm:mb-4 text-sky-500" size={24} />

            <h2 className="text-base sm:text-2xl font-bold text-slate-900">
              FCFS
            </h2>

            <p className="mt-1 sm:mt-3 text-xs sm:text-base leading-5 sm:leading-7 text-slate-500">
              First Come First Serve executes requests in arrival order.
            </p>
          </div>

          <div className="rounded-2xl sm:rounded-[28px] bg-white p-4 sm:p-7 shadow-md">
            <Activity className="mb-2 sm:mb-4 text-indigo-500" size={24} />

            <h2 className="text-base sm:text-2xl font-bold text-slate-900">
              SSTF
            </h2>

            <p className="mt-1 sm:mt-3 text-xs sm:text-base leading-5 sm:leading-7 text-slate-500">
              Shortest Seek Time First selects nearest request.
            </p>
          </div>

          <div className="rounded-2xl sm:rounded-[28px] bg-white p-4 sm:p-7 shadow-md">
            <Layers3 className="mb-2 sm:mb-4 text-cyan-500" size={24} />

            <h2 className="text-base sm:text-2xl font-bold text-slate-900">
              SCAN
            </h2>

            <p className="mt-1 sm:mt-3 text-xs sm:text-base leading-5 sm:leading-7 text-slate-500">
              Disk arm moves like an elevator servicing requests.
            </p>
          </div>

          <div className="rounded-2xl sm:rounded-[28px] bg-white p-4 sm:p-7 shadow-md">
            <Gauge className="mb-2 sm:mb-4 text-emerald-500" size={24} />

            <h2 className="text-base sm:text-2xl font-bold text-slate-900">
              Seek Time
            </h2>

            <p className="mt-1 sm:mt-3 text-xs sm:text-base leading-5 sm:leading-7 text-slate-500">
              Total head movement between disk tracks.
            </p>
          </div>
        </div>

        {/* Main */}
        <div className="mt-6 sm:mt-10 grid gap-6 sm:gap-8 xl:grid-cols-[380px_1fr]">

          {/* Left Controls */}
          <div className="rounded-2xl sm:rounded-[32px] bg-white p-5 sm:p-8 shadow-md">

            <h2 className="text-xl sm:text-3xl font-bold text-slate-900">
              Simulation Controls
            </h2>

            <div className="mt-5 sm:mt-8">

              <label className="mb-2 sm:mb-3 block text-xs sm:text-sm font-semibold text-slate-500">
                Select Algorithm
              </label>

              <select
                value={algorithm}
                onChange={(e) => setAlgorithm(e.target.value)}
                className="w-full rounded-xl sm:rounded-2xl border border-slate-200 bg-slate-50 px-3 sm:px-5 py-3 sm:py-4 text-sm sm:text-lg font-semibold outline-none focus:border-sky-400"
              >
                <option value="FCFS">FCFS</option>
                <option value="SSTF">SSTF</option>
                <option value="SCAN">SCAN</option>
              </select>
            </div>

            <div className="mt-5 sm:mt-8">

              <label className="mb-2 sm:mb-3 block text-xs sm:text-sm font-semibold text-slate-500">
                Initial Head Position
              </label>

              <input
                type="number"
                value={head}
                onChange={(e) => setHead(Number(e.target.value))}
                className="w-full rounded-xl sm:rounded-2xl border border-slate-200 px-3 sm:px-5 py-3 sm:py-4 text-sm sm:text-lg font-semibold outline-none focus:border-sky-400"
              />
            </div>

            <div className="mt-5 sm:mt-8">

              <label className="mb-2 sm:mb-3 block text-xs sm:text-sm font-semibold text-slate-500">
                Disk Requests
              </label>

              <textarea
                rows={4}
                value={requests}
                onChange={(e) => setRequests(e.target.value)}
                className="w-full rounded-xl sm:rounded-2xl border border-slate-200 px-3 sm:px-5 py-3 sm:py-4 text-sm leading-6 sm:leading-8 outline-none focus:border-sky-400"
              />

              <p className="mt-2 sm:mt-3 text-xs sm:text-sm text-slate-400">
                Example: 98 183 37 122 14 124 65 67
              </p>
            </div>

            {/* Stats */}
            <div className="mt-6 sm:mt-10 space-y-3 sm:space-y-5">

              <div className="rounded-2xl sm:rounded-3xl bg-gradient-to-br from-sky-500 to-cyan-400 p-4 sm:p-6 text-white shadow-xl">
                <p className="text-[11px] sm:text-sm uppercase tracking-[2px] sm:tracking-[3px] text-white/80">
                  Total Seek Time
                </p>

                <h2 className="mt-2 sm:mt-4 text-3xl sm:text-5xl font-black">
                  {simulation.totalSeek}
                </h2>
              </div>

              <div className="rounded-2xl sm:rounded-3xl bg-gradient-to-br from-indigo-500 to-violet-500 p-4 sm:p-6 text-white shadow-xl">
                <p className="text-[11px] sm:text-sm uppercase tracking-[2px] sm:tracking-[3px] text-white/80">
                  Average Seek Time
                </p>

                <h2 className="mt-2 sm:mt-4 text-3xl sm:text-5xl font-black">
                  {simulation.avgSeek}
                </h2>
              </div>

            </div>
          </div>

          {/* Right */}
          <div className="space-y-6 sm:space-y-8">

            {/* Sequence */}
            <div className="rounded-2xl sm:rounded-[32px] bg-white p-5 sm:p-8 shadow-md">

              <div className="flex items-center gap-2 sm:gap-3">
                <CheckCircle2 size={20} className="text-sky-600" />

                <h2 className="text-xl sm:text-3xl font-bold text-slate-900">
                  Execution Order
                </h2>
              </div>

              <div className="mt-6 sm:mt-10 flex flex-wrap items-center gap-3 sm:gap-5">

                {simulation.order.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 sm:gap-5"
                  >
                    <div className="rounded-2xl sm:rounded-3xl bg-gradient-to-br from-sky-500 to-cyan-400 px-4 sm:px-8 py-3 sm:py-6 text-center text-white shadow-lg">
                      <h3 className="text-lg sm:text-2xl font-black">
                        {item}
                      </h3>
                    </div>

                    {index !== simulation.order.length - 1 && (
                      <div className="text-2xl sm:text-4xl font-black text-slate-300">
                        →
                      </div>
                    )}
                  </div>
                ))}

              </div>
            </div>

            {/* Visualization */}
            <div className="rounded-2xl sm:rounded-[32px] bg-white p-5 sm:p-8 shadow-md">

              <h2 className="text-xl sm:text-3xl font-bold text-slate-900">
                Disk Head Movement
              </h2>

              <div className="mt-6 sm:mt-10 overflow-x-auto">

                <div className="flex min-w-max items-end gap-3 sm:gap-5">

                  {simulation.order.map((item, index) => (
                    <div
                      key={index}
                      className="flex flex-col items-center"
                    >
                      <div
                        className="flex w-14 sm:w-20 items-end justify-center rounded-t-2xl sm:rounded-t-3xl bg-gradient-to-br from-indigo-500 to-sky-500 text-white shadow-lg"
                        style={{
                          height: `${Math.max(60, item + 80)}px`,
                        }}
                      >
                        <span className="mb-2 sm:mb-4 text-sm sm:text-lg font-black">
                          {item}
                        </span>
                      </div>

                      <div className="mt-2 sm:mt-3 rounded-lg sm:rounded-xl bg-slate-100 px-2 sm:px-4 py-1 sm:py-2 text-[10px] sm:text-sm font-semibold text-slate-600">
                        Step {index}
                      </div>
                    </div>
                  ))}

                </div>
              </div>
            </div>

            {/* Explanation */}
            <div className="rounded-2xl sm:rounded-[32px] bg-white p-5 sm:p-8 shadow-md">

              <h2 className="text-xl sm:text-3xl font-bold text-slate-900">
                How Disk Scheduling Works
              </h2>

              <div className="mt-4 sm:mt-6 space-y-3 sm:space-y-5 text-sm sm:text-lg leading-7 sm:leading-9 text-slate-600">

                <p>
                  Disk Scheduling algorithms determine the order
                  in which disk I/O requests are serviced.
                </p>

                <p>
                  Efficient scheduling minimizes seek time and
                  improves overall Operating System performance.
                </p>

                <p>
                  Different algorithms focus on fairness,
                  efficiency and reducing head movement.
                </p>

              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}