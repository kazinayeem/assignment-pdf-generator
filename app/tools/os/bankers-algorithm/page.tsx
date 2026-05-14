"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ShieldCheck,
  Database,
  Cpu,
  CheckCircle2,
  XCircle,
  Activity,
  Layers3,
} from "lucide-react";

type ProcessType = {
  id: string;
  allocation: number[];
  maximum: number[];
};

export default function BankersAlgorithmPage() {
  const [available, setAvailable] = useState([3, 3, 2]);

  const [processes] = useState<ProcessType[]>([
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
      p.maximum.map((m, i) => m - p.allocation[i])
    );

    let work = [...available];
    let finish = new Array(processes.length).fill(false);

    let safeSequence: string[] = [];
    let steps: any[] = [];

    let changed = true;

    while (changed) {
      changed = false;

      for (let i = 0; i < processes.length; i++) {
        if (!finish[i]) {
          const canRun = need[i].every(
            (n, idx) => n <= work[idx]
          );

          if (canRun) {
            steps.push({
              process: processes[i].id,
              before: [...work],
            });

            work = work.map(
              (w, idx) => w + processes[i].allocation[idx]
            );

            finish[i] = true;
            safeSequence.push(processes[i].id);

            steps[steps.length - 1].after = [...work];

            changed = true;
          }
        }
      }
    }

    return {
      need,
      safe: finish.every(Boolean),
      safeSequence,
      finalResources: work,
      steps,
    };
  }, [available, processes]);

  return (
    <div className="min-h-screen bg-[#eef4fb] px-4 py-8 md:px-8">
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
              Banker’s Algorithm Simulator
            </h1>

            <p className="mt-5 max-w-3xl text-base leading-8 text-slate-500 md:text-lg">
              Simulate Banker’s Algorithm to detect safe states,
              analyze resource allocation and prevent deadlock
              in Operating Systems.
            </p>
          </div>

          <div className="rounded-[32px] bg-gradient-to-br from-sky-500 via-cyan-500 to-indigo-500 p-8 text-white shadow-2xl">
            <ShieldCheck className="mb-4 h-14 w-14" />

            <h2 className="text-3xl font-bold">
              Safe State Analyzer
            </h2>

            <p className="mt-3 max-w-xs leading-7 text-white/80">
              Visualize resource allocation and safe sequence execution.
            </p>
          </div>
        </div>

        {/* Cards */}
        <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4">

          <div className="rounded-[28px] bg-white p-7 shadow-md">
            <Database className="mb-4 text-sky-500" size={34} />

            <h2 className="text-2xl font-bold text-slate-900">
              Allocation
            </h2>

            <p className="mt-3 leading-7 text-slate-500">
              Resources currently assigned to each process.
            </p>
          </div>

          <div className="rounded-[28px] bg-white p-7 shadow-md">
            <Cpu className="mb-4 text-indigo-500" size={34} />

            <h2 className="text-2xl font-bold text-slate-900">
              Maximum
            </h2>

            <p className="mt-3 leading-7 text-slate-500">
              Maximum resources required by processes.
            </p>
          </div>

          <div className="rounded-[28px] bg-white p-7 shadow-md">
            <Layers3 className="mb-4 text-cyan-500" size={34} />

            <h2 className="text-2xl font-bold text-slate-900">
              Need Matrix
            </h2>

            <p className="mt-3 leading-7 text-slate-500">
              Remaining resources needed for completion.
            </p>
          </div>

          <div className="rounded-[28px] bg-white p-7 shadow-md">
            <Activity className="mb-4 text-emerald-500" size={34} />

            <h2 className="text-2xl font-bold text-slate-900">
              Safe Sequence
            </h2>

            <p className="mt-3 leading-7 text-slate-500">
              Execution order that avoids deadlock.
            </p>
          </div>
        </div>

        {/* Main */}
        <div className="mt-10 grid gap-8 xl:grid-cols-[380px_1fr]">

          {/* Left */}
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

            {/* Safe Status */}
            <div
              className={`mt-10 rounded-[28px] p-6 text-white shadow-xl ${
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
                  {simulation.safe
                    ? "System is Safe"
                    : "Unsafe State"}
                </h2>
              </div>

              <p className="mt-4 leading-7 text-white/90">
                {simulation.safe
                  ? "A safe sequence exists. No deadlock will occur."
                  : "Safe sequence not found. Deadlock may happen."}
              </p>
            </div>

            {/* Final Resources */}
            <div className="mt-8 rounded-[28px] bg-slate-50 p-6">
              <p className="text-sm uppercase tracking-[3px] text-slate-400">
                Final Available Resources
              </p>

              <div className="mt-5 flex gap-3">
                {simulation.finalResources.map((r, i) => (
                  <div
                    key={i}
                    className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 to-cyan-400 text-xl font-bold text-white shadow-md"
                  >
                    {r}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right */}
          <div className="space-y-8">

            {/* Table */}
            <div className="rounded-[32px] bg-white p-8 shadow-md">

              <h2 className="text-3xl font-bold text-slate-900">
                Banker’s Algorithm Table
              </h2>

              <div className="mt-8 overflow-x-auto">
                <table className="w-full min-w-[1000px]">
                  <thead>
                    <tr className="bg-slate-100 text-left">
                      <th className="rounded-l-2xl px-6 py-4">
                        Process
                      </th>

                      <th className="px-6 py-4">
                        Allocation
                      </th>

                      <th className="px-6 py-4">
                        Maximum
                      </th>

                      <th className="rounded-r-2xl px-6 py-4">
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
                {simulation.safeSequence.map((item, index) => (
                  <div
                    key={index}
                    className="rounded-2xl bg-gradient-to-br from-sky-500 to-cyan-400 px-8 py-5 text-xl font-bold text-white shadow-lg"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>

            {/* Step Simulation */}
            <div className="rounded-[32px] bg-white p-8 shadow-md">

              <h2 className="text-3xl font-bold text-slate-900">
                Step-by-Step Simulation
              </h2>

              <div className="mt-8 space-y-5">
                {simulation.steps.map((step, index) => (
                  <div
                    key={index}
                    className="rounded-3xl border border-slate-100 bg-slate-50 p-6"
                  >
                    <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

                      <div>
                        <p className="text-sm font-semibold uppercase tracking-[3px] text-slate-400">
                          Step {index + 1}
                        </p>

                        <h3 className="mt-2 text-2xl font-bold text-slate-900">
                          Execute {step.process}
                        </h3>
                      </div>

                      <div className="flex flex-wrap gap-5">

                        <div>
                          <p className="mb-2 text-sm font-semibold text-slate-400">
                            Before
                          </p>

                          <div className="flex gap-2">
                            {step.before.map(
                              (b: number, i: number) => (
                                <div
                                  key={i}
                                  className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-200 font-bold text-slate-700"
                                >
                                  {b}
                                </div>
                              )
                            )}
                          </div>
                        </div>

                        <div>
                          <p className="mb-2 text-sm font-semibold text-slate-400">
                            After
                          </p>

                          <div className="flex gap-2">
                            {step.after.map(
                              (a: number, i: number) => (
                                <div
                                  key={i}
                                  className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-green-500 font-bold text-white"
                                >
                                  {a}
                                </div>
                              )
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Explanation */}
            <div className="rounded-[32px] bg-white p-8 shadow-md">

              <h2 className="text-3xl font-bold text-slate-900">
                How Banker’s Algorithm Works
              </h2>

              <div className="mt-6 space-y-5 text-lg leading-9 text-slate-600">
                <p>
                  Banker’s Algorithm checks whether granting a
                  resource request keeps the system in a safe state.
                </p>

                <p>
                  The algorithm calculates Allocation, Maximum,
                  Available and Need matrices to determine if all
                  processes can finish successfully.
                </p>

                <p>
                  If a safe sequence exists, the system avoids
                  deadlock and continues execution safely.
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}