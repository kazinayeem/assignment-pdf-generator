"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ChevronRight, Plus, Trash2, Search, RotateCcw, Info } from "lucide-react";

const COLORS = {
  default: { bg: "#eff6ff", border: "#bfdbfe", text: "#1d4ed8" },
  highlight: { bg: "#fef9c3", border: "#fde047", text: "#854d0e" },
  found: { bg: "#dcfce7", border: "#86efac", text: "#15803d" },
  deleted: { bg: "#fee2e2", border: "#fca5a5", text: "#dc2626" },
  inserted: { bg: "#f0fdf4", border: "#4ade80", text: "#16a34a" },
};

type CellState = "default" | "highlight" | "found" | "deleted" | "inserted";

interface Cell {
  value: number;
  state: CellState;
  id: number;
}

let idCounter = 100;

export default function ArrayPage() {
  const [cells, setCells] = useState<Cell[]>(
    [5, 12, 8, 3, 19, 7, 14, 2].map((v, i) => ({ value: v, state: "default", id: i }))
  );
  const [inputVal, setInputVal] = useState("");
  const [inputIdx, setInputIdx] = useState("");
  const [searchVal, setSearchVal] = useState("");
  const [log, setLog] = useState<string[]>(["Array initialized with 8 elements."]);
  const [isAnimating, setIsAnimating] = useState(false);

  const addLog = (msg: string) => setLog((prev) => [msg, ...prev.slice(0, 9)]);

  const resetStates = () =>
    setCells((prev) => prev.map((c) => ({ ...c, state: "default" })));

  const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

  // ── Insert at index ──────────────────────────────────────────────────────
  const handleInsert = async () => {
    const val = parseInt(inputVal);
    const idx = inputIdx === "" ? cells.length : parseInt(inputIdx);
    if (isNaN(val)) return;
    if (idx < 0 || idx > cells.length) { addLog(`❌ Index ${idx} out of bounds.`); return; }
    setIsAnimating(true);
    resetStates();
    // Highlight shift positions
    for (let i = cells.length - 1; i >= idx; i--) {
      setCells((prev) => prev.map((c, j) => ({ ...c, state: j === i ? "highlight" : c.state })));
      await sleep(120);
    }
    const newCell: Cell = { value: val, state: "inserted", id: idCounter++ };
    setCells((prev) => {
      const arr = [...prev];
      arr.splice(idx, 0, newCell);
      return arr;
    });
    addLog(`✅ Inserted ${val} at index ${idx}. Array size: ${cells.length + 1}`);
    await sleep(600);
    resetStates();
    setIsAnimating(false);
    setInputVal("");
    setInputIdx("");
  };

  // ── Delete at index ──────────────────────────────────────────────────────
  const handleDelete = async () => {
    const idx = parseInt(inputIdx);
    if (isNaN(idx) || idx < 0 || idx >= cells.length) {
      addLog(`❌ Invalid index ${inputIdx}.`); return;
    }
    setIsAnimating(true);
    setCells((prev) => prev.map((c, i) => ({ ...c, state: i === idx ? "deleted" : "default" })));
    addLog(`🗑️ Deleting element at index ${idx} (value: ${cells[idx].value})`);
    await sleep(600);
    setCells((prev) => prev.filter((_, i) => i !== idx));
    addLog(`✅ Deleted. Array size: ${cells.length - 1}`);
    setIsAnimating(false);
    setInputIdx("");
  };

  // ── Linear Search ────────────────────────────────────────────────────────
  const handleSearch = async () => {
    const val = parseInt(searchVal);
    if (isNaN(val)) return;
    setIsAnimating(true);
    addLog(`🔍 Searching for ${val}...`);
    let found = false;
    for (let i = 0; i < cells.length; i++) {
      setCells((prev) => prev.map((c, j) => ({
        ...c,
        state: j === i ? "highlight" : j < i ? "default" : "default",
      })));
      await sleep(300);
      if (cells[i].value === val) {
        setCells((prev) => prev.map((c, j) => ({ ...c, state: j === i ? "found" : "default" })));
        addLog(`✅ Found ${val} at index ${i}! (${i + 1} comparisons)`);
        found = true;
        break;
      }
    }
    if (!found) {
      resetStates();
      addLog(`❌ ${val} not found. (${cells.length} comparisons)`);
    }
    setIsAnimating(false);
  };

  // ── Reset ────────────────────────────────────────────────────────────────
  const handleReset = () => {
    setCells([5, 12, 8, 3, 19, 7, 14, 2].map((v, i) => ({ value: v, state: "default", id: i })));
    setLog(["Array reset to initial state."]);
    setInputVal(""); setInputIdx(""); setSearchVal("");
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-6">
        <Link href="/tools/dsa" className="hover:text-gray-700 transition-colors">DSA</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-gray-700 font-semibold">Array</span>
      </div>

      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-black text-gray-900">Array Visualizer</h1>
              <p className="text-gray-500 text-sm mt-1">Insert, delete and search with step-by-step animation.</p>
            </div>
            <div className="flex gap-3 text-center shrink-0">
              {[["O(1)", "Access"], ["O(n)", "Search"], ["O(n)", "Insert"]].map(([v, l]) => (
                <div key={l} className="px-3 py-2 bg-blue-50 rounded-xl border border-blue-100">
                  <p className="text-sm font-black text-blue-600">{v}</p>
                  <p className="text-[9px] font-bold uppercase tracking-wider text-blue-400">{l}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Array visualization */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-black text-gray-700 uppercase tracking-wider">Array State</h2>
            <span className="text-xs text-gray-400 font-medium">Size: {cells.length}</span>
          </div>

          {/* Index labels */}
          <div className="flex gap-1 mb-1 overflow-x-auto pb-1">
            {cells.map((_, i) => (
              <div key={i} className="w-14 shrink-0 text-center text-[10px] font-bold text-gray-400">[{i}]</div>
            ))}
          </div>

          {/* Cells */}
          <div className="flex gap-1 overflow-x-auto pb-2">
            {cells.map((cell) => {
              const c = COLORS[cell.state];
              return (
                <div
                  key={cell.id}
                  className="w-14 h-14 shrink-0 rounded-xl border-2 flex items-center justify-center font-black text-lg transition-all duration-300"
                  style={{ backgroundColor: c.bg, borderColor: c.border, color: c.text }}
                >
                  {cell.value}
                </div>
              );
            })}
            {cells.length === 0 && (
              <div className="w-full h-14 flex items-center justify-center text-gray-300 text-sm font-medium border-2 border-dashed border-gray-200 rounded-xl">
                Empty array
              </div>
            )}
          </div>

          {/* Memory address simulation */}
          <div className="flex gap-1 mt-1 overflow-x-auto">
            {cells.map((_, i) => (
              <div key={i} className="w-14 shrink-0 text-center text-[9px] font-mono text-gray-300">
                0x{(1000 + i * 4).toString(16).toUpperCase()}
              </div>
            ))}
          </div>
        </div>

        {/* Controls */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Insert */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <h3 className="text-xs font-black uppercase tracking-wider text-gray-500 mb-3 flex items-center gap-1.5">
              <Plus className="w-3.5 h-3.5 text-blue-500" /> Insert
            </h3>
            <div className="space-y-2">
              <input
                type="number"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                placeholder="Value"
                className="w-full h-9 px-3 text-sm rounded-lg border border-gray-200 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-500/10"
              />
              <input
                type="number"
                value={inputIdx}
                onChange={(e) => setInputIdx(e.target.value)}
                placeholder="Index (optional, default: end)"
                className="w-full h-9 px-3 text-sm rounded-lg border border-gray-200 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-500/10"
              />
              <button
                onClick={handleInsert}
                disabled={isAnimating || !inputVal}
                className="w-full h-9 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm font-bold rounded-lg transition-colors"
              >
                Insert
              </button>
            </div>
          </div>

          {/* Delete */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <h3 className="text-xs font-black uppercase tracking-wider text-gray-500 mb-3 flex items-center gap-1.5">
              <Trash2 className="w-3.5 h-3.5 text-red-500" /> Delete
            </h3>
            <div className="space-y-2">
              <input
                type="number"
                value={inputIdx}
                onChange={(e) => setInputIdx(e.target.value)}
                placeholder="Index to delete"
                className="w-full h-9 px-3 text-sm rounded-lg border border-gray-200 focus:outline-none focus:border-red-400 focus:ring-2 focus:ring-red-500/10"
              />
              <button
                onClick={handleDelete}
                disabled={isAnimating || inputIdx === ""}
                className="w-full h-9 bg-red-500 hover:bg-red-600 disabled:opacity-50 text-white text-sm font-bold rounded-lg transition-colors"
              >
                Delete at Index
              </button>
            </div>
          </div>

          {/* Search */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <h3 className="text-xs font-black uppercase tracking-wider text-gray-500 mb-3 flex items-center gap-1.5">
              <Search className="w-3.5 h-3.5 text-emerald-500" /> Linear Search
            </h3>
            <div className="space-y-2">
              <input
                type="number"
                value={searchVal}
                onChange={(e) => setSearchVal(e.target.value)}
                placeholder="Value to search"
                className="w-full h-9 px-3 text-sm rounded-lg border border-gray-200 focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/10"
              />
              <button
                onClick={handleSearch}
                disabled={isAnimating || !searchVal}
                className="w-full h-9 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-sm font-bold rounded-lg transition-colors"
              >
                Search
              </button>
            </div>
          </div>
        </div>

        {/* Reset + Log */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Legend + Reset */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-black uppercase tracking-wider text-gray-500">Legend</h3>
              <button onClick={handleReset} disabled={isAnimating} className="flex items-center gap-1.5 text-xs font-bold text-gray-400 hover:text-red-500 transition-colors">
                <RotateCcw className="w-3.5 h-3.5" /> Reset
              </button>
            </div>
            <div className="space-y-2">
              {Object.entries(COLORS).map(([key, c]) => (
                <div key={key} className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg border-2 shrink-0" style={{ backgroundColor: c.bg, borderColor: c.border }} />
                  <span className="text-xs font-medium text-gray-600 capitalize">{key}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Operation log */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <h3 className="text-xs font-black uppercase tracking-wider text-gray-500 mb-3 flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5" /> Operation Log
            </h3>
            <div className="space-y-1.5 max-h-48 overflow-y-auto">
              {log.map((entry, i) => (
                <p key={i} className={`text-xs font-medium px-2 py-1 rounded-lg ${i === 0 ? "bg-blue-50 text-blue-700" : "text-gray-500"}`}>
                  {entry}
                </p>
              ))}
            </div>
          </div>
        </div>

        {/* Theory */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-sm font-black uppercase tracking-wider text-gray-700 mb-4">Array — Key Concepts</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-600">
            <div className="space-y-2">
              <p className="font-bold text-gray-800">What is an Array?</p>
              <p className="leading-relaxed">A contiguous block of memory storing elements of the same type. Elements are accessed via index in O(1) time.</p>
            </div>
            <div className="space-y-2">
              <p className="font-bold text-gray-800">Complexity Summary</p>
              <div className="space-y-1">
                {[["Access by index", "O(1)"], ["Search (linear)", "O(n)"], ["Insert at end", "O(1) amortized"], ["Insert at index", "O(n)"], ["Delete at index", "O(n)"]].map(([op, c]) => (
                  <div key={op} className="flex justify-between text-xs">
                    <span className="text-gray-500">{op}</span>
                    <span className="font-black text-blue-600">{c}</span>
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
