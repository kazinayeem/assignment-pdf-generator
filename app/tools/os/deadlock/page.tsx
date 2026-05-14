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
    let finish = new Array(processes.length).fill(false);
    let safeSequence: string[] = [];

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
    <div className="min-h-screen bg-[#edf4fb] px-4 py-8 md:px-8">
      <div className="mx-auto max-w-7xl">
        
        {/* Back */}
        <Link
          href="/tools/os"
          className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-sky-600"
        >
          <ArrowLeft size={18} />
          Back to Operating Systems
        </Link>

        {/* Hero */}
        <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[5px] text-slate-500">
              Operating Systems
            </p>

            <h1 className="mt-3 text-4xl font-black text-slate-900 md:text-6xl">
              Deadlock & Banker's Algorithm
            </h1>

            <p className="mt-5 max-w-3xl text-base leading-8 text-slate-500 md:text-lg">
              Learn deadlock detection, safe state analysis and resource
              allocation using Banker's Algorithm with interactive simulation.
            </p>
          </div>

          <div className="rounded-[32px] bg-gradient-to-br from-red-500 via-orange-500 to-yellow-400 p-8 text-white shadow-2xl">
            <ShieldAlert className="mb-4 h-14 w-14" />

            <h2 className="text-3xl font-bold">
              Deadlock Simulator
            </h2>

            <p className="mt-3 max-w-xs leading-7 text-white/80">
              Analyze process execution and detect safe or unsafe states.
            </p>
          </div>
        </div>

        {/* Info Cards */}
        <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-[28px] bg-white p-7 shadow-md">
            <Lock className="mb-4 text-red-500" size={34} />

            <h2 className="text-2xl font-bold text-slate-900">
              Deadlock
            </h2>

            <p className="mt-3 leading-7 text-slate-500">
              A situation where processes wait forever for resources.
            </p>
          </div>

          <div className="rounded-[28px] bg-white p-7 shadow-md">
            <Activity className="mb-4 text-sky-500" size={34} />

            <h2 className="text-2xl font-bold text-slate-900">
              Safe State
            </h2>

            <p className="mt-3 leading-7 text-slate-500">
              System can allocate resources safely without deadlock.
            </p>
          </div>

          <div className="rounded-[28px] bg-white p-7 shadow-md">
            <Cpu className="mb-4 text-indigo-500" size={34} />

            <h2 className="text-2xl font-bold text-slate-900">
              Banker’s Algorithm
            </h2>

            <p className="mt-3 leading-7 text-slate-500">
              Prevents unsafe resource allocation dynamically.
            </p>
          </div>

          <div className="rounded-[28px] bg-white p-7 shadow-md">
            <ShieldAlert className="mb-4 text-orange-500" size={34} />

            <h2 className="text-2xl font-bold text-slate-900">
              Resource Allocation
            </h2>

            <p className="mt-3 leading-7 text-slate-500">
              Manages CPU, memory and device resource distribution.
            </p>
          </div>
        </div>

        {/* Main Layout */}
        <div className="mt-10 grid gap-8 xl:grid-cols-[380px_1fr]">
          
          {/* Left Controls */}
          <div className="rounded-[32px] bg-white p-8 shadow-md">
            <h2 className="text-3xl font-bold text-slate-900">
              Available Resources
            </h2>

            <div className="mt-8 space-y-5">
              {available.map((value, index) => (
                <div key={index}>
                  <label className="mb-2 block text-sm font-semibold text-slate-500">
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
                    className="w-full rounded-2xl border border-slate-200 px-5 py-4 text-lg font-semibold outline-none focus:border-sky-400"
                  />
                </div>
              ))}
            </div>

            {/* Status */}
            <div
              className={`mt-10 rounded-3xl p-6 text-white shadow-xl ${
                simulation.safe
                  ? "bg-gradient-to-br from-emerald-500 to-green-500"
                  : "bg-gradient-to-br from-red-500 to-orange-500"
              }`}
            >
              <div className="flex items-center gap-3">
                {simulation.safe ? (
                  <CheckCircle2 size={30} />
                ) : (
                  <XCircle size={30} />
                )}

                <h2 className="text-2xl font-bold">
                  {simulation.safe ? "Safe State" : "Unsafe State"}
                </h2>
              </div>

              <p className="mt-4 leading-7 text-white/90">
                {simulation.safe
                  ? "The system can execute processes safely without entering deadlock."
                  : "The system may enter deadlock because resources are insufficient."}
              </p>
            </div>
          </div>

          {/* Right Section */}
          <div className="space-y-8">
            
            {/* Table */}
            <div className="rounded-[32px] bg-white p-8 shadow-md">
              <h2 className="text-3xl font-bold text-slate-900">
                Process Allocation Table
              </h2>

              <div className="mt-8 overflow-x-auto">
                <table className="w-full min-w-[900px]">
                  <thead>
                    <tr className="bg-slate-100 text-left">
                      <th className="rounded-l-2xl px-6 py-4 text-slate-700">
                        Process
                      </th>

                      <th className="px-6 py-4 text-slate-700">
                        Allocation
                      </th>

                      <th className="px-6 py-4 text-slate-700">
                        Maximum
                      </th>

                      <th className="rounded-r-2xl px-6 py-4 text-slate-700">
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
                        <td className="px-6 py-5 font-bold text-slate-900">
                          {process.id}
                        </td>

                        <td className="px-6 py-5 text-slate-600">
                          {process.allocation.join(" , ")}
                        </td>

                        <td className="px-6 py-5 text-slate-600">
                          {process.maximum.join(" , ")}
                        </td>

                        <td className="px-6 py-5 font-semibold text-sky-600">
                          {simulation.need[index].join(" , ")}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Safe Sequence */}
            <div className="rounded-[32px] bg-white p-8 shadow-md">
              <h2 className="text-3xl font-bold text-slate-900">
                Safe Sequence
              </h2>

              <div className="mt-8 flex flex-wrap gap-4">
                {simulation.sequence.map((item, index) => (
                  <div
                    key={index}
                    className="rounded-2xl bg-gradient-to-br from-sky-500 to-cyan-400 px-8 py-5 text-xl font-bold text-white shadow-lg"
                  >
                    {item}
                  </div>
                ))}
              </div>

              {!simulation.safe && (
                <div className="mt-6 rounded-2xl bg-red-50 p-5 text-red-600">
                  Unsafe allocation detected. Deadlock may occur.
                </div>
              )}
            </div>

            {/* Explanation */}
            <div className="rounded-[32px] bg-white p-8 shadow-md">
              <h2 className="text-3xl font-bold text-slate-900">
                How Deadlock Happens
              </h2>

              <div className="mt-6 space-y-5 text-lg leading-9 text-slate-600">
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