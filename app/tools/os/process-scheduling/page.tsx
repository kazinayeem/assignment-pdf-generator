"use client";

import Link from "next/link";
import { ChevronRight, Cpu, Timer, Layers, ArrowRight } from "lucide-react";

export default function ProcessSchedulingPage() {
  return (
    <div className="min-h-screen bg-gray-50 px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-6">
        <Link href="/tools/os" className="hover:text-gray-700 transition-colors">OS</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-gray-700 font-semibold">Process Scheduling</span>
      </div>

      <div className="max-w-4xl mx-auto space-y-6">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h1 className="text-2xl font-black text-gray-900">Process Scheduling Concepts</h1>
          <p className="text-gray-500 text-sm mt-1">Long-term, medium-term, and short-term scheduling in operating systems.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { title: "Long-Term Scheduler", icon: Timer, desc: "Controls degree of multiprogramming. Selects processes from disk to load into memory.", color: "blue", bg: "bg-blue-50", border: "border-blue-100", iconColor: "text-blue-600" },
            { title: "Medium-Term Scheduler", icon: Layers, desc: "Handles swapping. Moves processes between memory and disk to manage system load.", color: "violet", bg: "bg-violet-50", border: "border-violet-100", iconColor: "text-violet-600" },
            { title: "Short-Term Scheduler", icon: Cpu, desc: "Also called CPU scheduler. Selects which ready process gets the CPU next.", color: "emerald", bg: "bg-emerald-50", border: "border-emerald-100", iconColor: "text-emerald-600" },
          ].map((s) => {
            const Icon = s.icon;
            return (
              <div key={s.title} className={`p-6 ${s.bg} rounded-2xl border ${s.border}`}>
                <Icon className={`w-8 h-8 ${s.iconColor} mb-3`} />
                <h2 className="text-lg font-black text-gray-900 mb-2">{s.title}</h2>
                <p className="text-sm text-gray-600 leading-relaxed">{s.desc}</p>
              </div>
            );
          })}
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-sm font-black uppercase tracking-wider text-gray-500 mb-4">Scheduling Queues</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  {["Queue", "Description", "Managed By"].map((h) => (
                    <th key={h} className="text-left py-2 px-3 text-[10px] font-black uppercase tracking-wider text-gray-400">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  ["Job Queue", "Contains all processes in the system", "Long-term scheduler"],
                  ["Ready Queue", "Processes ready to execute in memory", "Short-term scheduler"],
                  ["Device Queue", "Processes waiting for I/O devices", "I/O subsystem"],
                ].map(([queue, desc, manager]) => (
                  <tr key={queue} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="py-2.5 px-3 font-bold text-gray-800">{queue}</td>
                    <td className="py-2.5 px-3 text-gray-600 text-xs">{desc}</td>
                    <td className="py-2.5 px-3 text-gray-500 text-xs">{manager}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-sm font-black uppercase tracking-wider text-gray-500 mb-4">Context Switching</h2>
          <p className="text-sm text-gray-600 leading-relaxed mb-4">
            Context switching is the mechanism where the OS saves the state of a running process (registers, program counter, memory map) and loads the saved state of another process. While necessary for multitasking, context switching has overhead — typically a few microseconds per switch.
          </p>
          <div className="p-4 bg-amber-50 rounded-xl border border-amber-100">
            <p className="text-xs font-bold text-amber-700 mb-1">⚡ Performance Impact</p>
            <p className="text-xs text-amber-600">Context switch overhead includes saving/loading registers, flushing TLB, and cache misses. Too many switches can degrade performance significantly.</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-4">
          <Link href="/tools/os/cpu-scheduling">
            <button className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-colors shadow-sm">
              Try CPU Scheduling Simulator <ArrowRight className="w-4 h-4" />
            </button>
          </Link>
          <Link href="/tools/os">
            <button className="flex items-center gap-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition-colors">
              Back to OS
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
