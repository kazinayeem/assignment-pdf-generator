"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Cpu,
  Layers3,
  Workflow,
  Activity,
  Timer,
  PlayCircle,
  PauseCircle,
  CheckCircle2,
} from "lucide-react";

type ProcessType = {
  id: string;
  state: string;
  burst: number;
};

export default function ProcessManagementPage() {
  const [processes, setProcesses] = useState<ProcessType[]>([
    {
      id: "P1",
      state: "Ready",
      burst: 5,
    },
    {
      id: "P2",
      state: "Running",
      burst: 2,
    },
    {
      id: "P3",
      state: "Waiting",
      burst: 4,
    },
    {
      id: "P4",
      state: "Ready",
      burst: 6,
    },
  ]);

  const statistics = useMemo(() => {
    return {
      total: processes.length,
      ready: processes.filter((p) => p.state === "Ready").length,
      running: processes.filter((p) => p.state === "Running").length,
      waiting: processes.filter((p) => p.state === "Waiting").length,
      completed: processes.filter((p) => p.state === "Completed").length,
    };
  }, [processes]);

  const changeState = (index: number, state: string) => {
    const updated = [...processes];
    updated[index].state = state;
    setProcesses(updated);
  };

  const addProcess = () => {
    const next = processes.length + 1;

    setProcesses([
      ...processes,
      {
        id: `P${next}`,
        state: "Ready",
        burst: 3,
      },
    ]);
  };

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
            <p className="text-xs sm:text-sm uppercase tracking-[3px] sm:tracking-[5px] text-slate-500">
              Operating Systems
            </p>

            <h1 className="mt-3 text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-black text-slate-900">
              Process Management Simulator
            </h1>

            <p className="mt-4 sm:mt-5 max-w-3xl text-sm sm:text-base leading-7 sm:leading-8 text-slate-500 md:text-lg">
              Learn how processes move between Ready, Running,
              Waiting and Completed states inside Operating Systems.
            </p>
          </div>

          <div className="rounded-[24px] sm:rounded-[32px] bg-gradient-to-br from-sky-500 via-cyan-500 to-indigo-500 p-5 sm:p-8 text-white shadow-2xl shrink-0">
            <Cpu className="mb-3 sm:mb-4 h-10 w-10 sm:h-14 sm:w-14" />

            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold">
              Process Control Lab
            </h2>

            <p className="mt-2 sm:mt-3 max-w-xs text-sm sm:text-base leading-6 sm:leading-7 text-white/80">
              Visualize process states and scheduling flow dynamically.
            </p>
          </div>
        </div>

        {/* Cards */}
        <div className="mt-8 sm:mt-10 grid gap-4 sm:gap-6 grid-cols-2 sm:grid-cols-2 lg:grid-cols-4">

          <div className="rounded-2xl sm:rounded-[28px] bg-white p-4 sm:p-7 shadow-md">
            <PlayCircle className="mb-2 sm:mb-4 text-sky-500" size={24} />

            <h2 className="text-base sm:text-xl md:text-2xl font-bold text-slate-900">
              Ready
            </h2>

            <p className="mt-2 sm:mt-3 text-xs sm:text-sm leading-5 sm:leading-7 text-slate-500">
              Process waits in queue for CPU execution.
            </p>
          </div>

          <div className="rounded-2xl sm:rounded-[28px] bg-white p-4 sm:p-7 shadow-md">
            <Activity className="mb-2 sm:mb-4 text-emerald-500" size={24} />

            <h2 className="text-base sm:text-xl md:text-2xl font-bold text-slate-900">
              Running
            </h2>

            <p className="mt-2 sm:mt-3 text-xs sm:text-sm leading-5 sm:leading-7 text-slate-500">
              Process is currently executing on CPU.
            </p>
          </div>

          <div className="rounded-2xl sm:rounded-[28px] bg-white p-4 sm:p-7 shadow-md">
            <PauseCircle className="mb-2 sm:mb-4 text-orange-500" size={24} />

            <h2 className="text-base sm:text-xl md:text-2xl font-bold text-slate-900">
              Waiting
            </h2>

            <p className="mt-2 sm:mt-3 text-xs sm:text-sm leading-5 sm:leading-7 text-slate-500">
              Process waits for I/O or another resource.
            </p>
          </div>

          <div className="rounded-2xl sm:rounded-[28px] bg-white p-4 sm:p-7 shadow-md">
            <CheckCircle2 className="mb-2 sm:mb-4 text-indigo-500" size={24} />

            <h2 className="text-base sm:text-xl md:text-2xl font-bold text-slate-900">
              Completed
            </h2>

            <p className="mt-2 sm:mt-3 text-xs sm:text-sm leading-5 sm:leading-7 text-slate-500">
              Process has finished execution successfully.
            </p>
          </div>
        </div>

        {/* Main */}
        <div className="mt-10 grid gap-8 xl:grid-cols-[360px_1fr]">

          {/* Left */}
          <div className="space-y-8">

            {/* Stats */}
            <div className="rounded-[32px] bg-white p-8 shadow-md">

              <h2 className="text-3xl font-bold text-slate-900">
                Process Statistics
              </h2>

              <div className="mt-8 space-y-5">

                <div className="flex items-center justify-between rounded-2xl bg-slate-50 p-5">
                  <p className="font-semibold text-slate-600">
                    Total Processes
                  </p>

                  <h3 className="text-2xl font-black text-slate-900">
                    {statistics.total}
                  </h3>
                </div>

                <div className="flex items-center justify-between rounded-2xl bg-sky-50 p-5">
                  <p className="font-semibold text-sky-700">
                    Ready
                  </p>

                  <h3 className="text-2xl font-black text-sky-600">
                    {statistics.ready}
                  </h3>
                </div>

                <div className="flex items-center justify-between rounded-2xl bg-emerald-50 p-5">
                  <p className="font-semibold text-emerald-700">
                    Running
                  </p>

                  <h3 className="text-2xl font-black text-emerald-600">
                    {statistics.running}
                  </h3>
                </div>

                <div className="flex items-center justify-between rounded-2xl bg-orange-50 p-5">
                  <p className="font-semibold text-orange-700">
                    Waiting
                  </p>

                  <h3 className="text-2xl font-black text-orange-600">
                    {statistics.waiting}
                  </h3>
                </div>

                <div className="flex items-center justify-between rounded-2xl bg-indigo-50 p-5">
                  <p className="font-semibold text-indigo-700">
                    Completed
                  </p>

                  <h3 className="text-2xl font-black text-indigo-600">
                    {statistics.completed}
                  </h3>
                </div>
              </div>

              <button
                onClick={addProcess}
                className="mt-8 w-full rounded-2xl bg-gradient-to-r from-sky-500 to-cyan-500 px-5 py-4 text-lg font-bold text-white shadow-lg transition hover:scale-[1.02]"
              >
                + Add New Process
              </button>
            </div>

            {/* PCB */}
            <div className="rounded-[32px] bg-white p-8 shadow-md">

              <div className="flex items-center gap-3">
                <Layers3 className="text-sky-600" />

                <h2 className="text-3xl font-bold text-slate-900">
                  Process Control Block
                </h2>
              </div>

              <div className="mt-6 space-y-4 text-slate-600 leading-8">

                <p>
                  • Process ID (PID)
                </p>

                <p>
                  • Process State
                </p>

                <p>
                  • CPU Registers
                </p>

                <p>
                  • Memory Information
                </p>

                <p>
                  • Scheduling Information
                </p>

              </div>
            </div>
          </div>

          {/* Right */}
          <div className="space-y-8">

            {/* Process Table */}
            <div className="rounded-[32px] bg-white p-8 shadow-md">

              <div className="flex items-center gap-3">
                <Workflow className="text-sky-600" />

                <h2 className="text-3xl font-bold text-slate-900">
                  Process State Management
                </h2>
              </div>

              <div className="mt-8 overflow-x-auto">
                <table className="w-full min-w-[900px]">

                  <thead>
                    <tr className="bg-slate-100 text-left">

                      <th className="rounded-l-2xl px-6 py-4">
                        Process
                      </th>

                      <th className="px-6 py-4">
                        State
                      </th>

                      <th className="px-6 py-4">
                        Burst Time
                      </th>

                      <th className="rounded-r-2xl px-6 py-4">
                        Actions
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

                        <td className="px-6 py-5">

                          <span
                            className={`rounded-full px-4 py-2 text-sm font-bold ${
                              process.state === "Ready"
                                ? "bg-sky-100 text-sky-700"
                                : process.state === "Running"
                                ? "bg-emerald-100 text-emerald-700"
                                : process.state === "Waiting"
                                ? "bg-orange-100 text-orange-700"
                                : "bg-indigo-100 text-indigo-700"
                            }`}
                          >
                            {process.state}
                          </span>

                        </td>

                        <td className="px-6 py-5 text-slate-600">
                          {process.burst} ms
                        </td>

                        <td className="px-6 py-5">

                          <div className="flex flex-wrap gap-3">

                            <button
                              onClick={() =>
                                changeState(index, "Ready")
                              }
                              className="rounded-xl bg-sky-100 px-4 py-2 text-sm font-semibold text-sky-700 transition hover:bg-sky-200"
                            >
                              Ready
                            </button>

                            <button
                              onClick={() =>
                                changeState(index, "Running")
                              }
                              className="rounded-xl bg-emerald-100 px-4 py-2 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-200"
                            >
                              Run
                            </button>

                            <button
                              onClick={() =>
                                changeState(index, "Waiting")
                              }
                              className="rounded-xl bg-orange-100 px-4 py-2 text-sm font-semibold text-orange-700 transition hover:bg-orange-200"
                            >
                              Wait
                            </button>

                            <button
                              onClick={() =>
                                changeState(index, "Completed")
                              }
                              className="rounded-xl bg-indigo-100 px-4 py-2 text-sm font-semibold text-indigo-700 transition hover:bg-indigo-200"
                            >
                              Complete
                            </button>

                          </div>

                        </td>
                      </tr>
                    ))}
                  </tbody>

                </table>
              </div>
            </div>

            {/* State Diagram */}
            <div className="rounded-[32px] bg-white p-8 shadow-md">

              <div className="flex items-center gap-3">
                <Timer className="text-sky-600" />

                <h2 className="text-3xl font-bold text-slate-900">
                  Process State Flow
                </h2>
              </div>

              <div className="mt-10 flex flex-wrap items-center justify-center gap-6">

                <div className="rounded-3xl bg-sky-500 px-8 py-6 text-center text-white shadow-lg">
                  <h3 className="text-2xl font-bold">
                    Ready
                  </h3>
                </div>

                <div className="text-4xl font-black text-slate-300">
                  →
                </div>

                <div className="rounded-3xl bg-emerald-500 px-8 py-6 text-center text-white shadow-lg">
                  <h3 className="text-2xl font-bold">
                    Running
                  </h3>
                </div>

                <div className="text-4xl font-black text-slate-300">
                  →
                </div>

                <div className="rounded-3xl bg-orange-500 px-8 py-6 text-center text-white shadow-lg">
                  <h3 className="text-2xl font-bold">
                    Waiting
                  </h3>
                </div>

                <div className="text-4xl font-black text-slate-300">
                  →
                </div>

                <div className="rounded-3xl bg-indigo-500 px-8 py-6 text-center text-white shadow-lg">
                  <h3 className="text-2xl font-bold">
                    Completed
                  </h3>
                </div>

              </div>
            </div>

            {/* Explanation */}
            <div className="rounded-[32px] bg-white p-8 shadow-md">

              <h2 className="text-3xl font-bold text-slate-900">
                How Process Management Works
              </h2>

              <div className="mt-6 space-y-5 text-lg leading-9 text-slate-600">

                <p>
                  Process Management is a core Operating System
                  function that handles creation, execution and
                  termination of processes.
                </p>

                <p>
                  The scheduler decides which process gets CPU
                  time while maintaining efficiency and fairness.
                </p>

                <p>
                  Processes continuously move between Ready,
                  Running, Waiting and Completed states based
                  on CPU execution and I/O operations.
                </p>

              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}