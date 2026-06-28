"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ShieldAlert,
  Lock,
  Activity,
  Cpu,
  CheckCircle2,
  XCircle,
} from "lucide-react";

type Process = {
  id: string;
  allocation: number[];
  maximum: number[];
};

export default function DeadlockPage() {
  const [available, setAvailable] = useState([3, 3, 2]);

  const [processes] = useState<Process[]>([
    {
      id: "P0",
      allocation: [0, 1, 0],
      maximum: [7, 5, 3],
    },
    {
      id: "P1",
      allocation: [2, 0, 0],
      maximum: [3, 2, 2],
    },
    {
      id: "P2",
      allocation: [3, 0, 2],
      maximum: [9, 0, 2],
    },
    {
      id: "P3",
      allocation: [2, 1, 1],
      maximum: [2, 2, 2],
    },
    {
      id: "P4",
      allocation: [0, 0, 2],
      maximum: [4, 3, 3],
    },
  ]);

  const simulation = useMemo(() => {
    const need = processes.map((p) =>
      p.maximum.map((max, i) => max - p.allocation[i])
    );

    let work = [...available];
    const finish = new Array(processes.length).fill(false);
    const safeSequence: string[] = [];

    let changed = true;

    while (changed) {
      changed = false;

      for (let i = 0; i < processes.length; i++) {
        if (!finish[i]) {
          const canRun = need[i].every((n, idx) => n <= work[idx]);

          if (canRun) {
            work = work.map(
              (w, idx) => w + processes[i].allocation[idx]
            );

            finish[i] = true;
            safeSequence.push(processes[i].id);
            changed = true;
          }
        }
      }
    }

    return {
      need,
      safe: finish.every(Boolean),
      sequence: safeSequence,
    };
  }, [available, processes]);

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
              Deadlock & Banker's Algorithm
            </h1>

            <p className="mt-3 sm:mt-5 max-w-3xl text-sm sm:text-base leading-6 sm:leading-8 text-slate-500 md:text-lg">
              Learn deadlock detection, safe state analysis and resource
              allocation using Banker's Algorithm with interactive simulation.
            </p>
          </div>

          <div className="rounded-2xl sm:rounded-[32px] bg-gradient-to-br from-red-500 via-orange-500 to-yellow-400 p-5 sm:p-8 text-white shadow-2xl">
            <ShieldAlert className="mb-3 sm:mb-4 h-10 w-10 sm:h-14 sm:w-14" />

            <h2 className="text-xl sm:text-3xl font-bold">
              Deadlock Simulator
            </h2>

            <p className="mt-2 sm:mt-3 max-w-xs text-sm sm:text-base leading-6 sm:leading-7 text-white/80">
              Analyze process execution and detect safe or unsafe states.
            </p>
          </div>
        </div>

        {/* Info Cards */}
        <div className="mt-6 sm:mt-10 grid grid-cols-2 gap-3 sm:gap-6 md:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-2xl sm:rounded-[28px] bg-white p-4 sm:p-7 shadow-md">
            <Lock className="mb-2 sm:mb-4 text-red-500" size={24} />

            <h2 className="text-base sm:text-2xl font-bold text-slate-900">
              Deadlock
            </h2>

            <p className="mt-1 sm:mt-3 text-xs sm:text-base leading-5 sm:leading-7 text-slate-500">
              A situation where processes wait forever for resources.
            </p>
          </div>

          <div className="rounded-2xl sm:rounded-[28px] bg-white p-4 sm:p-7 shadow-md">
            <Activity className="mb-2 sm:mb-4 text-sky-500" size={24} />

            <h2 className="text-base sm:text-2xl font-bold text-slate-900">
              Safe State
            </h2>

            <p className="mt-1 sm:mt-3 text-xs sm:text-base leading-5 sm:leading-7 text-slate-500">
              System can allocate resources safely without deadlock.
            </p>
          </div>

          <div className="rounded-2xl sm:rounded-[28px] bg-white p-4 sm:p-7 shadow-md">
            <Cpu className="mb-2 sm:mb-4 text-indigo-500" size={24} />

            <h2 className="text-base sm:text-2xl font-bold text-slate-900">
              Banker's Algorithm
            </h2>

            <p className="mt-1 sm:mt-3 text-xs sm:text-base leading-5 sm:leading-7 text-slate-500">
              Prevents unsafe resource allocation dynamically.
            </p>
          </div>

          <div className="rounded-2xl sm:rounded-[28px] bg-white p-4 sm:p-7 shadow-md">
            <ShieldAlert className="mb-2 sm:mb-4 text-orange-500" size={24} />

            <h2 className="text-base sm:text-2xl font-bold text-slate-900">
              Resource Allocation
            </h2>

            <p className="mt-1 sm:mt-3 text-xs sm:text-base leading-5 sm:leading-7 text-slate-500">
              Manages CPU, memory and device resource distribution.
            </p>
          </div>
        </div>

        {/* Main Layout */}
        <div className="mt-6 sm:mt-10 grid gap-6 sm:gap-8 xl:grid-cols-[380px_1fr]">
          
          {/* Left Controls */}
          <div className="rounded-2xl sm:rounded-[32px] bg-white p-5 sm:p-8 shadow-md">
            <h2 className="text-xl sm:text-3xl font-bold text-slate-900">
              Available Resources
            </h2>

            <div className="mt-5 sm:mt-8 space-y-4 sm:space-y-5">
              {available.map((value, index) => (
                <div key={index}>
                  <label className="mb-1.5 sm:mb-2 block text-xs sm:text-sm font-semibold text-slate-500">
                    Resource {String.fromCharCode(65 + index)}
                  </label>

                  <input
                    type="number"
                    value={value}
                    onChange={(e) => {
                      const updated = [...available];
                      updated[index] = Number(e.target.value);
                      setAvailable(updated);
                    }}
                    className="w-full rounded-xl sm:rounded-2xl border border-slate-200 px-3 sm:px-5 py-3 sm:py-4 text-sm sm:text-lg font-semibold outline-none focus:border-sky-400"
                  />
                </div>
              ))}
            </div>

            {/* Status */}
            <div
              className={`mt-6 sm:mt-10 rounded-2xl sm:rounded-3xl p-5 sm:p-6 text-white shadow-xl ${
                simulation.safe
                  ? "bg-gradient-to-br from-emerald-500 to-green-500"
                  : "bg-gradient-to-br from-red-500 to-orange-500"
              }`}
            >
              <div className="flex items-center gap-2 sm:gap-3">
                {simulation.safe ? (
                  <CheckCircle2 size={24} />
                ) : (
                  <XCircle size={24} />
                )}

                <h2 className="text-lg sm:text-2xl font-bold">
                  {simulation.safe ? "Safe State" : "Unsafe State"}
                </h2>
              </div>

              <p className="mt-3 sm:mt-4 text-sm sm:text-base leading-6 sm:leading-7 text-white/90">
                {simulation.safe
                  ? "The system can execute processes safely without entering deadlock."
                  : "The system may enter deadlock because resources are insufficient."}
              </p>
            </div>
          </div>

          {/* Right Section */}
          <div className="space-y-6 sm:space-y-8">
            
            {/* Table */}
            <div className="rounded-2xl sm:rounded-[32px] bg-white p-5 sm:p-8 shadow-md">
              <h2 className="text-xl sm:text-3xl font-bold text-slate-900">
                Process Allocation Table
              </h2>

              <div className="mt-5 sm:mt-8 overflow-x-auto">
                <table className="w-full min-w-[600px] sm:min-w-[900px]">
                  <thead>
                    <tr className="bg-slate-100 text-left">
                      <th className="rounded-l-xl sm:rounded-l-2xl px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-slate-700">
                        Process
                      </th>

                      <th className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-slate-700">
                        Allocation
                      </th>

                      <th className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-slate-700">
                        Maximum
                      </th>

                      <th className="rounded-r-xl sm:rounded-r-2xl px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-slate-700">
                        Need
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {processes.map((process, index) => (
                      <tr
                        key={index}
                        className="border-b border-slate-100"
                      >
                        <td className="px-3 sm:px-6 py-3 sm:py-5 text-xs sm:text-sm font-bold text-slate-900">
                          {process.id}
                        </td>

                        <td className="px-3 sm:px-6 py-3 sm:py-5 text-xs sm:text-sm text-slate-600">
                          {process.allocation.join(" , ")}
                        </td>

                        <td className="px-3 sm:px-6 py-3 sm:py-5 text-xs sm:text-sm text-slate-600">
                          {process.maximum.join(" , ")}
                        </td>

                        <td className="px-3 sm:px-6 py-3 sm:py-5 text-xs sm:text-sm font-semibold text-sky-600">
                          {simulation.need[index].join(" , ")}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Safe Sequence */}
            <div className="rounded-2xl sm:rounded-[32px] bg-white p-5 sm:p-8 shadow-md">
              <h2 className="text-xl sm:text-3xl font-bold text-slate-900">
                Safe Sequence
              </h2>

              <div className="mt-5 sm:mt-8 flex flex-wrap gap-3 sm:gap-4">
                {simulation.sequence.map((item, index) => (
                  <div
                    key={index}
                    className="rounded-xl sm:rounded-2xl bg-gradient-to-br from-sky-500 to-cyan-400 px-4 sm:px-8 py-3 sm:py-5 text-base sm:text-xl font-bold text-white shadow-lg"
                  >
                    {item}
                  </div>
                ))}
              </div>

              {!simulation.safe && (
                <div className="mt-4 sm:mt-6 rounded-xl sm:rounded-2xl bg-red-50 p-4 sm:p-5 text-sm sm:text-base text-red-600">
                  Unsafe allocation detected. Deadlock may occur.
                </div>
              )}
            </div>

            {/* Explanation */}
            <div className="rounded-2xl sm:rounded-[32px] bg-white p-5 sm:p-8 shadow-md">
              <h2 className="text-xl sm:text-3xl font-bold text-slate-900">
                How Deadlock Happens
              </h2>

              <div className="mt-4 sm:mt-6 space-y-3 sm:space-y-5 text-sm sm:text-lg leading-7 sm:leading-9 text-slate-600">
                <p>
                  Deadlock occurs when multiple processes hold resources while
                  waiting for other resources locked by other processes.
                </p>

                <p>
                  Banker's Algorithm checks whether resource allocation keeps
                  the system in a safe state before granting requests.
                </p>

                <p>
                  If a safe sequence exists, processes can complete execution
                  without deadlock.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}