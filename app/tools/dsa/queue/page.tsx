"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ChevronRight, Plus, Trash2, RotateCcw, Info } from "lucide-react";

interface QItem { value: number; id: number; isNew?: boolean; isLeaving?: boolean; }
let idC = 0;

export default function QueuePage() {
  const [queue, setQueue] = useState<QItem[]>([
    { value: 5, id: idC++ }, { value: 12, id: idC++ }, { value: 8, id: idC++ }, { value: 3, id: idC++ },
  ]);
  const [input, setInput] = useState("");
  const [log, setLog] = useState<string[]>(["Queue initialized with 4 elements."]);
  const [isAnimating, setIsAnimating] = useState(false);

  const addLog = (msg: string) => setLog((p) => [msg, ...p.slice(0, 9)]);
  const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

  const handleEnqueue = async () => {
    const val = parseInt(input);
    if (isNaN(val)) return;
    if (queue.length >= 8) { addLog("❌ Queue is full! Max size 8."); return; }
    setIsAnimating(true);
    const item: QItem = { value: val, id: idC++, isNew: true };
    setQueue((p) => [...p, item]);
    addLog(`📥 ENQUEUE ${val} → Rear. Size: ${queue.length + 1}`);
    await sleep(500);
    setQueue((p) => p.map((q) => ({ ...q, isNew: false })));
    setIsAnimating(false);
    setInput("");
  };

  const handleDequeue = async () => {
    if (queue.length === 0) { addLog("❌ Queue is empty!"); return; }
    setIsAnimating(true);
    const front = queue[0];
    addLog(`📤 DEQUEUE → Removed ${front.value} from Front. Size: ${queue.length - 1}`);
    setQueue((p) => p.map((q, i) => i === 0 ? { ...q, isLeaving: true } : q));
    await sleep(400);
    setQueue((p) => p.slice(1));
    setIsAnimating(false);
  };

  const handleReset = () => {
    setQueue([{ value: 5, id: idC++ }, { value: 12, id: idC++ }, { value: 8, id: idC++ }, { value: 3, id: idC++ }]);
    setLog(["Queue reset."]);
    setInput("");
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-6">
        <Link href="/tools/dsa" className="hover:text-gray-700 transition-colors">DSA</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-gray-700 font-semibold">Queue</span>
      </div>

      <div className="max-w-4xl mx-auto space-y-6">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-black text-gray-900">Queue Visualizer</h1>
              <p className="text-gray-500 text-sm mt-1">FIFO — First In, First Out. Enqueue at rear, dequeue from front.</p>
            </div>
            <div className="flex gap-3 shrink-0">
              {[["O(1)", "Enqueue"], ["O(1)", "Dequeue"], ["O(1)", "Front"]].map(([v, l]) => (
                <div key={l} className="px-3 py-2 bg-orange-50 rounded-xl border border-orange-100 text-center">
                  <p className="text-sm font-black text-orange-600">{v}</p>
                  <p className="text-[9px] font-bold uppercase tracking-wider text-orange-400">{l}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Queue visualization */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-sm font-black text-gray-700 uppercase tracking-wider">Queue State</h2>
            <span className="text-xs text-gray-400">Size: {queue.length}/8</span>
          </div>

          {/* Direction labels */}
          <div className="flex items-center justify-between mb-2 px-2">
            <div className="flex items-center gap-1.5">
              <div className="w-6 h-6 rounded-full bg-red-100 border border-red-200 flex items-center justify-center">
                <Trash2 className="w-3 h-3 text-red-500" />
              </div>
              <span className="text-xs font-bold text-red-500">FRONT (Dequeue)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-emerald-500">REAR (Enqueue)</span>
              <div className="w-6 h-6 rounded-full bg-emerald-100 border border-emerald-200 flex items-center justify-center">
                <Plus className="w-3 h-3 text-emerald-500" />
              </div>
            </div>
          </div>

          {/* Queue cells */}
          <div className="flex gap-2 overflow-x-auto pb-2 min-h-[80px] items-center">
            {queue.length === 0 ? (
              <div className="w-full h-16 flex items-center justify-center text-gray-300 text-sm font-medium border-2 border-dashed border-gray-200 rounded-xl">
                Queue is empty
              </div>
            ) : (
              queue.map((item, i) => {
                const isFront = i === 0;
                const isRear = i === queue.length - 1;
                return (
                  <div key={item.id} className="flex flex-col items-center gap-1 shrink-0">
                    <div
                      className="w-16 h-16 rounded-xl border-2 flex items-center justify-center font-black text-lg transition-all duration-300"
                      style={{
                        backgroundColor: item.isNew ? "#dcfce7" : item.isLeaving ? "#fee2e2" : isFront ? "#fff7ed" : "#f8fafc",
                        borderColor: item.isNew ? "#4ade80" : item.isLeaving ? "#fca5a5" : isFront ? "#fed7aa" : "#e2e8f0",
                        color: isFront ? "#c2410c" : isRear ? "#15803d" : "#475569",
                      }}
                    >
                      {item.value}
                    </div>
                    <span className="text-[9px] font-bold text-gray-400">[{i}]</span>
                    {isFront && <span className="text-[9px] font-black text-red-400 uppercase">Front</span>}
                    {isRear && queue.length > 1 && <span className="text-[9px] font-black text-emerald-400 uppercase">Rear</span>}
                    {queue.length === 1 && <span className="text-[9px] font-black text-orange-400 uppercase">F+R</span>}
                  </div>
                );
              })
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Controls */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <h3 className="text-xs font-black uppercase tracking-wider text-gray-500 mb-4">Operations</h3>
            <div className="space-y-3">
              <div className="flex gap-2">
                <input
                  type="number"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleEnqueue()}
                  placeholder="Enter value"
                  className="flex-1 h-10 px-3 text-sm rounded-lg border border-gray-200 focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-500/10"
                />
                <button onClick={handleEnqueue} disabled={isAnimating || !input} className="px-4 h-10 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-sm font-bold rounded-lg transition-colors flex items-center gap-1.5">
                  <Plus className="w-4 h-4" /> Enqueue
                </button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button onClick={handleDequeue} disabled={isAnimating || queue.length === 0} className="h-10 bg-red-500 hover:bg-red-600 disabled:opacity-50 text-white text-sm font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5">
                  <Trash2 className="w-3.5 h-3.5" /> Dequeue
                </button>
                <button onClick={handleReset} className="h-10 bg-gray-100 hover:bg-gray-200 text-gray-600 text-sm font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5">
                  <RotateCcw className="w-3.5 h-3.5" /> Reset
                </button>
              </div>
            </div>
          </div>

          {/* Log */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <h3 className="text-xs font-black uppercase tracking-wider text-gray-500 mb-3 flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5" /> Operation Log
            </h3>
            <div className="space-y-1.5 max-h-48 overflow-y-auto">
              {log.map((entry, i) => (
                <p key={i} className={`text-xs font-medium px-2 py-1.5 rounded-lg ${i === 0 ? "bg-orange-50 text-orange-700" : "text-gray-500"}`}>
                  {entry}
                </p>
              ))}
            </div>
          </div>
        </div>

        {/* Theory */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-sm font-black uppercase tracking-wider text-gray-700 mb-4">Queue Variants</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { name: "Simple Queue", desc: "Basic FIFO. Enqueue at rear, dequeue from front.", color: "bg-orange-50 border-orange-100 text-orange-700" },
              { name: "Circular Queue", desc: "Rear wraps around to front. Efficient memory use.", color: "bg-blue-50 border-blue-100 text-blue-700" },
              { name: "Priority Queue", desc: "Elements dequeued by priority, not insertion order.", color: "bg-violet-50 border-violet-100 text-violet-700" },
            ].map((v) => (
              <div key={v.name} className={`p-4 rounded-xl border ${v.color}`}>
                <p className="font-bold text-sm mb-1">{v.name}</p>
                <p className="text-xs opacity-80 leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
