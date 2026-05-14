
"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  MemoryStick,
  Layers3,
  MonitorSmartphone,
  ShieldCheck,
  Activity,
  RotateCcw,
} from "lucide-react";

const algorithms = ["FIFO", "LRU", "Optimal"];

export default function MemoryManagementPage() {
  const [selectedAlgorithm, setSelectedAlgorithm] = useState("FIFO");

  const [referenceString, setReferenceString] = useState(
    "7 0 1 2 0 3 0 4 2 3 0 3 2"
  );

  const [frames, setFrames] = useState(3);

  const pages = useMemo(() => {
    return referenceString
      .split(" ")
      .map(Number)
      .filter((n) => !isNaN(n));
  }, [referenceString]);

  const simulation = useMemo(() => {
    let memory: number[] = [];
    let history: any[] = [];
    let faults = 0;

    pages.forEach((page, index) => {
      let hit = memory.includes(page);

      if (!hit) {
        faults++;

        if (memory.length < frames) {
          memory.push(page);
        } else {
          if (selectedAlgorithm === "FIFO") {
            memory.shift();
            memory.push(page);
          }

          if (selectedAlgorithm === "LRU") {
            let leastRecentlyUsed = memory[0];
            let leastIndex = Infinity;

            memory.forEach((m) => {
              const lastUse = [...pages]
                .slice(0, index)
                .lastIndexOf(m);

              if (lastUse < leastIndex) {
                leastIndex = lastUse;
                leastRecentlyUsed = m;
              }
            });

            memory = memory.filter((m) => m !== leastRecentlyUsed);
            memory.push(page);
          }

          if (selectedAlgorithm === "Optimal") {
            let replacePage = memory[0];
            let farthest = -1;

            memory.forEach((m) => {
              const future = pages
                .slice(index + 1)
                .indexOf(m);

              if (future === -1) {
                replacePage = m;
                farthest = Infinity;
              } else if (future > farthest) {
                farthest = future;
                replacePage = m;
              }
            });

            memory = memory.filter((m) => m !== replacePage);
            memory.push(page);
          }
        }
      } else {
        if (selectedAlgorithm === "LRU") {
          memory = memory.filter((m) => m !== page);
          memory.push(page);
        }
      }

      history.push({
        page,
        frames: [...memory],
        hit,
      });
    });

    return {
      history,
      faults,
      hits: pages.length - faults,
      hitRate: ((pages.length - faults) / pages.length) * 100,
    };
  }, [pages, frames, selectedAlgorithm]);

  return (
    <div className="min-h-screen bg-[#edf4fb] px-6 py-10">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <Link
          href="/learn/os"
          className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-sky-600"
        >
          <ArrowLeft size={18} />
          Back to Operating Systems
        </Link>

        <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[5px] text-slate-500">
              Operating Systems
            </p>

            <h1 className="mt-3 text-5xl font-black text-slate-900">
              Memory Management Simulator
            </h1>

            <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-500">
              Learn how Operating Systems manage memory using page replacement
              algorithms like FIFO, LRU and Optimal with real-time simulation.
            </p>
          </div>

          <div className="rounded-[32px] bg-gradient-to-br from-indigo-500 to-sky-500 p-8 text-white shadow-2xl">
            <MemoryStick className="mb-5 h-12 w-12" />

            <h2 className="text-3xl font-bold">Virtual Memory Lab</h2>

            <p className="mt-3 max-w-xs text-white/80 leading-7">
              Visualize page loading, replacement and page fault behavior.
            </p>
          </div>
        </div>

        {/* Intro Cards */}
        <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-[28px] bg-white p-7 shadow-md">
            <Layers3 className="mb-4 text-sky-600" size={32} />

            <h2 className="text-2xl font-bold text-slate-900">FIFO</h2>

            <p className="mt-3 leading-7 text-slate-500">
              First In First Out removes the oldest page from memory.
            </p>
          </div>

          <div className="rounded-[28px] bg-white p-7 shadow-md">
            <Activity className="mb-4 text-indigo-600" size={32} />

            <h2 className="text-2xl font-bold text-slate-900">LRU</h2>

            <p className="mt-3 leading-7 text-slate-500">
              Least Recently Used replaces the least recently accessed page.
            </p>
          </div>

          <div className="rounded-[28px] bg-white p-7 shadow-md">
            <MonitorSmartphone className="mb-4 text-cyan-600" size={32} />

            <h2 className="text-2xl font-bold text-slate-900">Optimal</h2>

            <p className="mt-3 leading-7 text-slate-500">
              Replaces the page that will not be used for the longest time.
            </p>
          </div>

          <div className="rounded-[28px] bg-white p-7 shadow-md">
            <ShieldCheck className="mb-4 text-emerald-600" size={32} />

            <h2 className="text-2xl font-bold text-slate-900">
              Page Fault
            </h2>

            <p className="mt-3 leading-7 text-slate-500">
              Happens when a page is not available in memory frames.
            </p>
          </div>
        </div>

        {/* Main Section */}
        <div className="mt-10 grid gap-8 xl:grid-cols-[400px_1fr]">
          {/* Controls */}
          <div className="rounded-[32px] bg-white p-8 shadow-md">
            <h2 className="text-3xl font-bold text-slate-900">
              Simulation Controls
            </h2>

            <div className="mt-8">
              <label className="mb-3 block text-sm font-semibold text-slate-500">
                Select Algorithm
              </label>

              <select
                value={selectedAlgorithm}
                onChange={(e) => setSelectedAlgorithm(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 text-lg font-semibold outline-none focus:border-sky-400"
              >
                {algorithms.map((algo) => (
                  <option key={algo}>{algo}</option>
                ))}
              </select>
            </div>

            <div className="mt-8">
              <label className="mb-3 block text-sm font-semibold text-slate-500">
                Number of Frames
              </label>

              <input
                type="number"
                value={frames}
                min={1}
                max={10}
                onChange={(e) => setFrames(Number(e.target.value))}
                className="w-full rounded-2xl border border-slate-200 px-5 py-4 text-lg font-semibold outline-none focus:border-sky-400"
              />
            </div>

            <div className="mt-8">
              <label className="mb-3 block text-sm font-semibold text-slate-500">
                Reference String
              </label>

              <textarea
                rows={6}
                value={referenceString}
                onChange={(e) => setReferenceString(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 px-5 py-4 leading-8 outline-none focus:border-sky-400"
              />

              <p className="mt-3 text-sm text-slate-400">
                Example: 7 0 1 2 0 3 0 4 2 3 0 3 2
              </p>
            </div>

            <button
              onClick={() => {
                setReferenceString("7 0 1 2 0 3 0 4 2 3 0 3 2");
                setFrames(3);
              }}
              className="mt-8 flex w-full items-center justify-center gap-3 rounded-2xl bg-slate-100 px-5 py-4 font-semibold text-slate-700 transition hover:bg-slate-200"
            >
              <RotateCcw size={20} />
              Reset Simulation
            </button>
          </div>

          {/* Visualization */}
          <div className="space-y-8">
            {/* Memory Frames */}
            <div className="rounded-[32px] bg-white p-8 shadow-md">
              <h2 className="text-3xl font-bold text-slate-900">
                Page Replacement Visualization
              </h2>

              <div className="mt-8 overflow-x-auto">
                <table className="w-full min-w-[900px] border-separate border-spacing-y-3">
                  <thead>
                    <tr>
                      <th className="rounded-l-2xl bg-slate-100 px-5 py-4 text-left text-slate-700">
                        Step
                      </th>

                      <th className="bg-slate-100 px-5 py-4 text-left text-slate-700">
                        Page
                      </th>

                      <th className="bg-slate-100 px-5 py-4 text-left text-slate-700">
                        Frames
                      </th>

                      <th className="rounded-r-2xl bg-slate-100 px-5 py-4 text-left text-slate-700">
                        Status
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {simulation.history.map((item, index) => (
                      <tr key={index}>
                        <td className="rounded-l-2xl bg-slate-50 px-5 py-5 font-semibold text-slate-900">
                          {index + 1}
                        </td>

                        <td className="bg-slate-50 px-5 py-5 text-lg font-bold text-sky-600">
                          {item.page}
                        </td>

                        <td className="bg-slate-50 px-5 py-5">
                          <div className="flex gap-3">
                            {Array.from({ length: frames }).map((_, i) => (
                              <div
                                key={i}
                                className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 to-cyan-400 text-lg font-bold text-white shadow-md"
                              >
                                {item.frames[i] ?? "-"}
                              </div>
                            ))}
                          </div>
                        </td>

                        <td className="rounded-r-2xl bg-slate-50 px-5 py-5">
                          <span
                            className={`rounded-full px-4 py-2 text-sm font-semibold ${
                              item.hit
                                ? "bg-emerald-100 text-emerald-700"
                                : "bg-red-100 text-red-600"
                            }`}
                          >
                            {item.hit ? "Page Hit" : "Page Fault"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Statistics */}
            <div className="grid gap-6 md:grid-cols-3">
              <div className="rounded-[30px] bg-gradient-to-br from-red-500 to-orange-500 p-8 text-white shadow-xl">
                <p className="text-sm uppercase tracking-[3px] text-white/80">
                  Total Page Faults
                </p>

                <h2 className="mt-4 text-5xl font-black">
                  {simulation.faults}
                </h2>
              </div>

              <div className="rounded-[30px] bg-gradient-to-br from-emerald-500 to-green-500 p-8 text-white shadow-xl">
                <p className="text-sm uppercase tracking-[3px] text-white/80">
                  Total Hits
                </p>

                <h2 className="mt-4 text-5xl font-black">
                  {simulation.hits}
                </h2>
              </div>

              <div className="rounded-[30px] bg-gradient-to-br from-sky-500 to-indigo-500 p-8 text-white shadow-xl">
                <p className="text-sm uppercase tracking-[3px] text-white/80">
                  Hit Rate
                </p>

                <h2 className="mt-4 text-5xl font-black">
                  {simulation.hitRate.toFixed(1)}%
                </h2>
              </div>
            </div>

            {/* Explanation */}
            <div className="rounded-[32px] bg-white p-8 shadow-md">
              <h2 className="text-3xl font-bold text-slate-900">
                How Memory Management Works
              </h2>

              <div className="mt-6 space-y-5 text-lg leading-9 text-slate-600">
                <p>
                  Memory Management is responsible for allocating and managing
                  RAM efficiently between processes.
                </p>

                <p>
                  When memory becomes full, the Operating System uses page
                  replacement algorithms to decide which page should be removed.
                </p>

                <p>
                  Page replacement algorithms help improve system performance by
                  minimizing page faults and maximizing page hits.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
