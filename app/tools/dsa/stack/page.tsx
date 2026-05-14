"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ChevronRight, Plus, Trash2, Eye, RotateCcw, Info } from "lucide-react";

interface StackItem { value: number; id: number; isNew?: boolean; }
let idC = 0;

export default function StackPage() {
  const [stack, setStack] = useState<StackItem[]>([
    { value: 10, id: idC++ }, { value: 25, id: idC++ }, { value: 7, id: idC++ },
  ]);
  const [input, setInput] = useState("");
  const [log, setLog] = useState<string[]>(["Stack initialized with 3 elements."]);
  const [peeked, setPeeked] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const addLog = (msg: string) => setLog((p) => [msg, ...p.slice(0, 9)]);
  const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

  const handlePush = async () => {
    const val = parseInt(input);
    if (isNaN(val)) return;
    if (stack.length >= 8) { addLog("❌ Stack overflow! Max size 8."); return; }
    setIsAnimating(true);
    setPeeked(false);
    const item: StackItem = { value: val, id: idC++, isNew: true };
    setStack((p) => [...p, item]);
    addLog(`📥 PUSH ${val} → Stack size: ${stack.length + 1}`);
    await sleep(500);
    setStack((p) => p.map((s) => ({ ...s, isNew: false })));
    setIsAnimating(false);
    setInput("");
  };

  const handlePop = async () => {
    if (stack.length === 0) { addLog("❌ Stack underflow! Stack is empty."); return; }
    setIsAnimating(true);
    setPeeked(false);
    const top = stack[stack.length - 1];
    addLog(`📤 POP → Removed ${top.value}. Stack size: ${stack.length - 1}`);
    await sleep(400);
    setStack((p) => p.slice(0, -1));
    setIsAnimating(false);
  };

  const handlePeek = () => {
    if (stack.length === 0) { addLog("❌ Stack is empty."); return; }
    setPeeked(true);
    addLog(`👁️ PEEK → Top element is ${stack[stack.length - 1].value}`);
    setTimeout(() => setPeeked(false), 1500);
  };

  const handleReset = () => {
    setStack([{ value: 10, id: idC++ }, { value: 25, id: idC++ }, { value: 7, id: idC++ }]);
    setLog(["Stack reset."]);
    setInput("");
    setPeeked(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-6">
        <Link href="/tools/dsa" className="hover:text-gray-700 transition-colors">DSA</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-gray-700 font-semibold">Stack</span>
      </div>

      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-black text-gray-900">Stack Visualizer</h1>
              <p className="text-gray-500 text-sm mt-1">LIFO — Last In, First Out. Push, pop and peek operations.</p>
            </div>
            <div className="flex gap-3 shrink-0">
              {[["O(1)", "Push"], ["O(1)", "Pop"], ["O(1)", "Peek"]].map(([v, l]) => (
                <div key={l} className="px-3 py-2 bg-emerald-50 rounded-xl border border-emerald-100 text-center">
                  <p className="text-sm font-black text-emerald-600">{v}</p>
                  <p className="text-[9px] font-bold uppercase tracking-wider text-emerald-400">{l}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Stack visual */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-black text-gray-700 uppercase tracking-wider">Stack (Top → Bottom)</h2>
              <span className="text-xs text-gray-400">Size: {stack.length}/8</span>
            </div>

            {/* Stack container */}
            <div className="relative border-2 border-gray-200 rounded-xl overflow-hidden min-h-[320px] flex flex-col-reverse">
              {/* Bottom label */}
              <div className="absolute bottom-0 left-0 right-0 h-8 bg-gray-100 border-t-2 border-gray-200 flex items-center justify-center">
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Bottom</span>
              </div>

              <div className="flex flex-col-reverse gap-1 p-2 pb-10">
                {stack.map((item, i) => {
                  const isTop = i === stack.length - 1;
                  const isPeeked = peeked && isTop;
                  return (
                    <div
                      key={item.id}
                      className="relative flex items-center gap-3 px-4 py-3 rounded-xl border-2 transition-all duration-300"
                      style={{
                        backgroundColor: item.isNew ? "#dcfce7" : isPeeked ? "#fef9c3" : isTop ? "#eff6ff" : "#f8fafc",
                        borderColor: item.isNew ? "#4ade80" : isPeeked ? "#fde047" : isTop ? "#bfdbfe" : "#e2e8f0",
                      }}
                    >
                      <span className="text-lg font-black" style={{ color: isTop ? "#1d4ed8" : "#475569" }}>
                        {item.value}
                      </span>
                      {isTop && (
                        <span className="ml-auto text-[10px] font-black uppercase tracking-widest text-blue-400 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100">
                          TOP
                        </span>
                      )}
                      {isPeeked && (
                        <span className="ml-auto text-[10px] font-black text-yellow-600 bg-yellow-50 px-2 py-0.5 rounded-full border border-yellow-200">
                          👁️ PEEK
                        </span>
                      )}
                    </div>
                  );
                })}
                {stack.length === 0 && (
                  <div className="flex items-center justify-center h-32 text-gray-300 text-sm font-medium">
                    Stack is empty
                  </div>
                )}
              </div>

              {/* Top label */}
              <div className="absolute top-0 left-0 right-0 h-8 bg-blue-50 border-b-2 border-blue-100 flex items-center justify-center">
                <span className="text-[10px] font-black uppercase tracking-widest text-blue-400">Top</span>
              </div>
            </div>
          </div>

          {/* Controls + Log */}
          <div className="space-y-4">
            {/* Controls */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <h3 className="text-xs font-black uppercase tracking-wider text-gray-500 mb-4">Operations</h3>
              <div className="space-y-3">
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handlePush()}
                    placeholder="Enter value"
                    className="flex-1 h-10 px-3 text-sm rounded-lg border border-gray-200 focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/10"
                  />
                  <button onClick={handlePush} disabled={isAnimating || !input} className="px-4 h-10 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-sm font-bold rounded-lg transition-colors flex items-center gap-1.5">
                    <Plus className="w-4 h-4" /> Push
                  </button>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <button onClick={handlePop} disabled={isAnimating || stack.length === 0} className="h-10 bg-red-500 hover:bg-red-600 disabled:opacity-50 text-white text-sm font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5">
                    <Trash2 className="w-3.5 h-3.5" /> Pop
                  </button>
                  <button onClick={handlePeek} disabled={stack.length === 0} className="h-10 bg-yellow-500 hover:bg-yellow-600 disabled:opacity-50 text-white text-sm font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5">
                    <Eye className="w-3.5 h-3.5" /> Peek
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
                  <p key={i} className={`text-xs font-medium px-2 py-1.5 rounded-lg ${i === 0 ? "bg-emerald-50 text-emerald-700" : "text-gray-500"}`}>
                    {entry}
                  </p>
                ))}
              </div>
            </div>

            {/* Use cases */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <h3 className="text-xs font-black uppercase tracking-wider text-gray-500 mb-3">Real-world Use Cases</h3>
              <div className="space-y-1.5">
                {["Undo/Redo in text editors", "Browser back/forward history", "Function call stack", "Expression evaluation", "Balanced parentheses check"].map((u) => (
                  <div key={u} className="flex items-center gap-2 text-xs text-gray-600">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                    {u}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
