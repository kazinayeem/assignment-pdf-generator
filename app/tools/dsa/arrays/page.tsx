"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ChevronRight, Plus, Trash2, Search, RotateCcw } from "lucide-react";

export default function ArraysPage() {
  const [array, setArray] = useState<number[]>([5, 12, 8, 3, 15, 7, 10]);
  const [input, setInput] = useState("");
  const [index, setIndex] = useState("");
  const [searchVal, setSearchVal] = useState("");
  const [log, setLog] = useState<string[]>(["Array initialized with 7 elements."]);
  const [highlighted, setHighlighted] = useState<number | null>(null);

  const addLog = (msg: string) => setLog((p) => [msg, ...p.slice(0, 9)]);

  const handleInsert = () => {
    const val = parseInt(input);
    if (isNaN(val)) return;
    const idx = index === "" ? array.length : parseInt(index);
    if (idx < 0 || idx > array.length) { addLog(`❌ Index ${idx} out of bounds.`); return; }
    const a = [...array];
    a.splice(idx, 0, val);
    setArray(a);
    addLog(`✅ Inserted ${val} at index ${idx}. Size: ${a.length}`);
    setInput(""); setIndex("");
  };

  const handleDelete = () => {
    const idx = parseInt(index);
    if (isNaN(idx) || idx < 0 || idx >= array.length) { addLog(`❌ Invalid index.`); return; }
    const a = [...array];
    a.splice(idx, 1);
    setArray(a);
    addLog(`🗑️ Deleted element at index ${idx}. Size: ${a.length}`);
    setIndex("");
  };

  const handleSearch = () => {
    const val = parseInt(searchVal);
    if (isNaN(val)) return;
    const idx = array.indexOf(val);
    if (idx !== -1) {
      setHighlighted(idx);
      addLog(`✅ Found ${val} at index ${idx}.`);
      setTimeout(() => setHighlighted(null), 2000);
    } else {
      addLog(`❌ ${val} not found.`);
    }
  };

  const handleReset = () => {
    setArray([5, 12, 8, 3, 15, 7, 10]);
    setLog(["Array reset."]);
    setInput(""); setIndex(""); setSearchVal(""); setHighlighted(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-6">
        <Link href="/tools/dsa" className="hover:text-gray-700 transition-colors">DSA</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-gray-700 font-semibold">Arrays</span>
      </div>

      <div className="max-w-4xl mx-auto space-y-6">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h1 className="text-2xl font-black text-gray-900">Array Operations</h1>
          <p className="text-gray-500 text-sm mt-1">Insert, delete, and search within a dynamic array.</p>
        </div>

        {/* Array visualization */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-black text-gray-700 uppercase tracking-wider">Array State</h2>
            <span className="text-xs text-gray-400">Size: {array.length}</span>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 min-h-[60px] items-center">
            {array.map((val, i) => (
              <div key={i} className="flex flex-col items-center shrink-0">
                <div
                  className={`w-14 h-14 rounded-xl border-2 flex items-center justify-center font-black text-lg transition-all duration-300 ${
                    highlighted === i
                      ? "bg-emerald-100 border-emerald-400 text-emerald-700 shadow-md"
                      : "bg-white border-gray-200 text-gray-700 hover:border-blue-300"
                  }`}
                >
                  {val}
                </div>
                <span className="text-[9px] font-bold text-gray-400 mt-1">[{i}]</span>
              </div>
            ))}
          </div>
        </div>

        {/* Controls */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <h3 className="text-xs font-black uppercase tracking-wider text-gray-500 mb-3 flex items-center gap-1.5">
              <Plus className="w-3.5 h-3.5 text-blue-500" /> Insert
            </h3>
            <div className="space-y-2">
              <input type="number" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Value" className="w-full h-9 px-3 text-sm rounded-lg border border-gray-200 focus:outline-none focus:border-blue-400" />
              <input type="number" value={index} onChange={(e) => setIndex(e.target.value)} placeholder="Index (optional)" className="w-full h-9 px-3 text-sm rounded-lg border border-gray-200 focus:outline-none focus:border-blue-400" />
              <button onClick={handleInsert} disabled={!input} className="w-full h-9 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm font-bold rounded-lg transition-colors">Insert</button>
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <h3 className="text-xs font-black uppercase tracking-wider text-gray-500 mb-3 flex items-center gap-1.5">
              <Trash2 className="w-3.5 h-3.5 text-red-500" /> Delete
            </h3>
            <div className="space-y-2">
              <input type="number" value={index} onChange={(e) => setIndex(e.target.value)} placeholder="Index to delete" className="w-full h-9 px-3 text-sm rounded-lg border border-gray-200 focus:outline-none focus:border-red-400" />
              <button onClick={handleDelete} disabled={index === ""} className="w-full h-9 bg-red-500 hover:bg-red-600 disabled:opacity-50 text-white text-sm font-bold rounded-lg transition-colors">Delete</button>
              <button onClick={handleReset} className="w-full h-9 bg-gray-100 hover:bg-gray-200 text-gray-600 text-sm font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5">
                <RotateCcw className="w-3.5 h-3.5" /> Reset
              </button>
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <h3 className="text-xs font-black uppercase tracking-wider text-gray-500 mb-3 flex items-center gap-1.5">
              <Search className="w-3.5 h-3.5 text-emerald-500" /> Search
            </h3>
            <div className="space-y-2">
              <input type="number" value={searchVal} onChange={(e) => setSearchVal(e.target.value)} placeholder="Value to find" className="w-full h-9 px-3 text-sm rounded-lg border border-gray-200 focus:outline-none focus:border-emerald-400" />
              <button onClick={handleSearch} disabled={!searchVal} className="w-full h-9 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-sm font-bold rounded-lg transition-colors">Search</button>
            </div>
            <div className="mt-3 space-y-1 max-h-32 overflow-y-auto">
              {log.map((entry, i) => (
                <p key={i} className={`text-[10px] font-medium px-2 py-1 rounded-lg ${i === 0 ? "bg-blue-50 text-blue-700" : "text-gray-400"}`}>{entry}</p>
              ))}
            </div>
          </div>
        </div>

        {/* Complexity */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-sm font-black uppercase tracking-wider text-gray-700 mb-4">Array Complexity</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[["Access", "O(1)"], ["Search", "O(n)"], ["Insert", "O(n)"], ["Delete", "O(n)"]].map(([op, c]) => (
              <div key={op} className="p-3 bg-blue-50 rounded-xl border border-blue-100 text-center">
                <p className="text-sm font-black text-blue-600">{c}</p>
                <p className="text-[10px] font-bold text-blue-400 mt-0.5">{op}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
