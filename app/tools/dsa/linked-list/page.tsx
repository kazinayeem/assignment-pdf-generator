"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ChevronRight, Plus, Trash2, RotateCcw, Info, ArrowRight } from "lucide-react";

interface LLNode { value: number; id: number; state: "default" | "highlight" | "found" | "deleted" | "inserted"; }
let idC = 0;

export default function LinkedListPage() {
  const [nodes, setNodes] = useState<LLNode[]>(
    [10, 25, 7, 42, 18].map((v) => ({ value: v, id: idC++, state: "default" }))
  );
  const [type, setType] = useState<"singly" | "doubly" | "circular">("singly");
  const [inputVal, setInputVal] = useState("");
  const [inputIdx, setInputIdx] = useState("");
  const [searchVal, setSearchVal] = useState("");
  const [log, setLog] = useState<string[]>(["Linked list initialized with 5 nodes."]);
  const [isAnimating, setIsAnimating] = useState(false);

  const addLog = (msg: string) => setLog((p) => [msg, ...p.slice(0, 9)]);
  const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
  const resetStates = () => setNodes((p) => p.map((n) => ({ ...n, state: "default" })));

  const handleInsert = async () => {
    const val = parseInt(inputVal);
    const idx = inputIdx === "" ? nodes.length : parseInt(inputIdx);
    if (isNaN(val)) return;
    if (idx < 0 || idx > nodes.length) { addLog(`❌ Index ${idx} out of bounds.`); return; }
    setIsAnimating(true);
    // Traverse to position
    for (let i = 0; i < idx; i++) {
      setNodes((p) => p.map((n, j) => ({ ...n, state: j === i ? "highlight" : "default" })));
      await sleep(200);
    }
    const newNode: LLNode = { value: val, id: idC++, state: "inserted" };
    setNodes((p) => { const a = [...p]; a.splice(idx, 0, newNode); return a; });
    addLog(`✅ Inserted ${val} at position ${idx}`);
    await sleep(600);
    resetStates();
    setIsAnimating(false);
    setInputVal(""); setInputIdx("");
  };

  const handleDelete = async () => {
    const idx = parseInt(inputIdx);
    if (isNaN(idx) || idx < 0 || idx >= nodes.length) { addLog(`❌ Invalid index.`); return; }
    setIsAnimating(true);
    for (let i = 0; i <= idx; i++) {
      setNodes((p) => p.map((n, j) => ({ ...n, state: j === i ? (i === idx ? "deleted" : "highlight") : "default" })));
      await sleep(200);
    }
    addLog(`🗑️ Deleted node at index ${idx} (value: ${nodes[idx].value})`);
    await sleep(500);
    setNodes((p) => p.filter((_, i) => i !== idx));
    setIsAnimating(false);
    setInputIdx("");
  };

  const handleSearch = async () => {
    const val = parseInt(searchVal);
    if (isNaN(val)) return;
    setIsAnimating(true);
    addLog(`🔍 Searching for ${val}...`);
    let found = false;
    for (let i = 0; i < nodes.length; i++) {
      setNodes((p) => p.map((n, j) => ({ ...n, state: j === i ? "highlight" : j < i ? "default" : "default" })));
      await sleep(350);
      if (nodes[i].value === val) {
        setNodes((p) => p.map((n, j) => ({ ...n, state: j === i ? "found" : "default" })));
        addLog(`✅ Found ${val} at index ${i}!`);
        found = true; break;
      }
    }
    if (!found) { resetStates(); addLog(`❌ ${val} not found.`); }
    setIsAnimating(false);
  };

  const handleReset = () => {
    setNodes([10, 25, 7, 42, 18].map((v) => ({ value: v, id: idC++, state: "default" })));
    setLog(["Linked list reset."]);
    setInputVal(""); setInputIdx(""); setSearchVal("");
  };

  const stateColor = (s: LLNode["state"]) => ({
    default:  { bg: "#eff6ff", border: "#bfdbfe", text: "#1d4ed8" },
    highlight:{ bg: "#fef9c3", border: "#fde047", text: "#854d0e" },
    found:    { bg: "#dcfce7", border: "#86efac", text: "#15803d" },
    deleted:  { bg: "#fee2e2", border: "#fca5a5", text: "#dc2626" },
    inserted: { bg: "#f0fdf4", border: "#4ade80", text: "#16a34a" },
  }[s]);

  return (
    <div className="min-h-screen bg-gray-50 px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-6">
        <Link href="/tools/dsa" className="hover:text-gray-700 transition-colors">DSA</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-gray-700 font-semibold">Linked List</span>
      </div>

      <div className="max-w-5xl mx-auto space-y-6">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <h1 className="text-2xl font-black text-gray-900">Linked List Visualizer</h1>
              <p className="text-gray-500 text-sm mt-1">Insert, delete and search with pointer traversal animation.</p>
            </div>
            <div className="flex gap-1 p-1 bg-gray-100 rounded-xl">
              {(["singly", "doubly", "circular"] as const).map((t) => (
                <button key={t} onClick={() => setType(t)} className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all ${type === t ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}>
                  {t}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Visualization */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-black text-gray-700 uppercase tracking-wider">{type.charAt(0).toUpperCase() + type.slice(1)} Linked List</h2>
            <span className="text-xs text-gray-400">Nodes: {nodes.length}</span>
          </div>

          {/* NULL head */}
          <div className="flex items-center gap-2 overflow-x-auto pb-4">
            <div className="flex flex-col items-center shrink-0">
              <div className="px-3 py-2 bg-gray-100 border-2 border-dashed border-gray-300 rounded-xl text-xs font-black text-gray-400">HEAD</div>
            </div>
            {nodes.length > 0 && <ArrowRight className="w-4 h-4 text-gray-400 shrink-0" />}

            {nodes.map((node, i) => {
              const c = stateColor(node.state);
              return (
                <React.Fragment key={node.id}>
                  <div className="flex flex-col items-center shrink-0">
                    {/* Node box */}
                    <div className="flex rounded-xl border-2 overflow-hidden transition-all duration-300" style={{ borderColor: c.border }}>
                      {type === "doubly" && (
                        <div className="w-8 flex items-center justify-center text-[10px] font-black" style={{ backgroundColor: c.bg, color: c.text }}>←</div>
                      )}
                      <div className="w-14 h-12 flex items-center justify-center font-black text-lg border-x-2" style={{ backgroundColor: c.bg, borderColor: c.border, color: c.text }}>
                        {node.value}
                      </div>
                      <div className="w-8 flex items-center justify-center text-[10px] font-black" style={{ backgroundColor: c.bg, color: c.text }}>
                        {i === nodes.length - 1 && type !== "circular" ? "∅" : "→"}
                      </div>
                    </div>
                    <span className="text-[9px] text-gray-400 mt-1">[{i}]</span>
                  </div>
                  {i < nodes.length - 1 && <ArrowRight className="w-4 h-4 text-gray-400 shrink-0" />}
                  {i === nodes.length - 1 && type === "circular" && (
                    <div className="flex items-center gap-1 shrink-0">
                      <ArrowRight className="w-4 h-4 text-violet-400" />
                      <span className="text-[10px] font-black text-violet-400">HEAD</span>
                    </div>
                  )}
                </React.Fragment>
              );
            })}

            {nodes.length === 0 && (
              <div className="flex items-center gap-2">
                <ArrowRight className="w-4 h-4 text-gray-300" />
                <div className="px-3 py-2 bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl text-xs font-black text-gray-300">NULL</div>
              </div>
            )}
            {nodes.length > 0 && type === "singly" && (
              <div className="flex items-center gap-2 shrink-0">
                <ArrowRight className="w-4 h-4 text-gray-300" />
                <div className="px-3 py-2 bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl text-xs font-black text-gray-300">NULL</div>
              </div>
            )}
          </div>
        </div>

        {/* Controls */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <h3 className="text-xs font-black uppercase tracking-wider text-gray-500 mb-3 flex items-center gap-1.5"><Plus className="w-3.5 h-3.5 text-blue-500" /> Insert</h3>
            <div className="space-y-2">
              <input type="number" value={inputVal} onChange={(e) => setInputVal(e.target.value)} placeholder="Value" className="w-full h-9 px-3 text-sm rounded-lg border border-gray-200 focus:outline-none focus:border-blue-400" />
              <input type="number" value={inputIdx} onChange={(e) => setInputIdx(e.target.value)} placeholder="Index (optional)" className="w-full h-9 px-3 text-sm rounded-lg border border-gray-200 focus:outline-none focus:border-blue-400" />
              <button onClick={handleInsert} disabled={isAnimating || !inputVal} className="w-full h-9 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm font-bold rounded-lg transition-colors">Insert</button>
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <h3 className="text-xs font-black uppercase tracking-wider text-gray-500 mb-3 flex items-center gap-1.5"><Trash2 className="w-3.5 h-3.5 text-red-500" /> Delete</h3>
            <div className="space-y-2">
              <input type="number" value={inputIdx} onChange={(e) => setInputIdx(e.target.value)} placeholder="Index to delete" className="w-full h-9 px-3 text-sm rounded-lg border border-gray-200 focus:outline-none focus:border-red-400" />
              <button onClick={handleDelete} disabled={isAnimating || inputIdx === ""} className="w-full h-9 bg-red-500 hover:bg-red-600 disabled:opacity-50 text-white text-sm font-bold rounded-lg transition-colors">Delete</button>
              <button onClick={handleReset} className="w-full h-9 bg-gray-100 hover:bg-gray-200 text-gray-600 text-sm font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5"><RotateCcw className="w-3.5 h-3.5" /> Reset</button>
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <h3 className="text-xs font-black uppercase tracking-wider text-gray-500 mb-3 flex items-center gap-1.5"><Info className="w-3.5 h-3.5 text-emerald-500" /> Search</h3>
            <div className="space-y-2">
              <input type="number" value={searchVal} onChange={(e) => setSearchVal(e.target.value)} placeholder="Value to find" className="w-full h-9 px-3 text-sm rounded-lg border border-gray-200 focus:outline-none focus:border-emerald-400" />
              <button onClick={handleSearch} disabled={isAnimating || !searchVal} className="w-full h-9 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-sm font-bold rounded-lg transition-colors">Search</button>
            </div>
            <div className="mt-3 space-y-1.5 max-h-32 overflow-y-auto">
              {log.map((entry, i) => (
                <p key={i} className={`text-[10px] font-medium px-2 py-1 rounded-lg ${i === 0 ? "bg-violet-50 text-violet-700" : "text-gray-400"}`}>{entry}</p>
              ))}
            </div>
          </div>
        </div>

        {/* Complexity */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-sm font-black uppercase tracking-wider text-gray-700 mb-4">Complexity Summary</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[["Access", "O(n)"], ["Search", "O(n)"], ["Insert (head)", "O(1)"], ["Delete (head)", "O(1)"]].map(([op, c]) => (
              <div key={op} className="p-3 bg-violet-50 rounded-xl border border-violet-100 text-center">
                <p className="text-sm font-black text-violet-600">{c}</p>
                <p className="text-[10px] font-bold text-violet-400 mt-0.5">{op}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
