"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import { ChevronRight, Play, RotateCcw, Shuffle } from "lucide-react";

type SearchAlgo = "linear" | "binary";

interface Bar { value: number; state: "default" | "comparing" | "found" | "eliminated" | "range"; }

function randomSortedArray(n = 16): Bar[] {
  const arr = Array.from({ length: n }, (_, i) => (i + 1) * Math.floor(Math.random() * 5 + 3));
  return arr.map((v) => ({ value: v, state: "default" }));
}

function randomArray(n = 16): Bar[] {
  return Array.from({ length: n }, () => ({ value: Math.floor(Math.random() * 90) + 10, state: "default" as const }));
}

export default function SearchingPage() {
  const [algo, setAlgo] = useState<SearchAlgo>("linear");
  const [bars, setBars] = useState<Bar[]>(randomSortedArray());
  const [target, setTarget] = useState("");
  const [running, setRunning] = useState(false);
  const [comparisons, setComparisons] = useState(0);
  const [result, setResult] = useState<string>("");
  const stopRef = useRef(false);

  const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

  const handleAlgoChange = (a: SearchAlgo) => {
    if (running) return;
    setAlgo(a);
    setBars(a === "binary" ? randomSortedArray() : randomArray());
    setResult(""); setComparisons(0);
  };

  const shuffle = () => {
    if (running) return;
    setBars(algo === "binary" ? randomSortedArray() : randomArray());
    setResult(""); setComparisons(0);
  };

  const reset = () => {
    stopRef.current = true;
    setTimeout(() => {
      setBars(algo === "binary" ? randomSortedArray() : randomArray());
      setResult(""); setComparisons(0); setRunning(false); stopRef.current = false;
    }, 100);
  };

  const runSearch = async () => {
    const val = parseInt(target);
    if (isNaN(val)) { setResult("❌ Enter a valid number to search."); return; }
    setRunning(true); stopRef.current = false;
    setComparisons(0); setResult("");
    const arr = bars.map((b) => ({ ...b, state: "default" as const }));
    let cmp = 0;

    if (algo === "linear") {
      let found = false;
      for (let i = 0; i < arr.length; i++) {
        if (stopRef.current) { setRunning(false); return; }
        arr[i].state = "comparing";
        setBars([...arr]); cmp++; setComparisons(cmp);
        await sleep(300);
        if (arr[i].value === val) {
          arr[i].state = "found";
          setBars([...arr]);
          setResult(`✅ Found ${val} at index ${i} in ${cmp} comparisons!`);
          found = true; break;
        } else {
          arr[i].state = "eliminated";
          setBars([...arr]);
        }
      }
      if (!found) setResult(`❌ ${val} not found after ${cmp} comparisons.`);
    }

    if (algo === "binary") {
      let lo = 0, hi = arr.length - 1, found = false;
      while (lo <= hi) {
        if (stopRef.current) { setRunning(false); return; }
        const mid = Math.floor((lo + hi) / 2);
        // Mark range
        for (let i = 0; i < arr.length; i++) {
          arr[i].state = i >= lo && i <= hi ? "range" : "eliminated";
        }
        arr[mid].state = "comparing";
        setBars([...arr]); cmp++; setComparisons(cmp);
        await sleep(500);
        if (arr[mid].value === val) {
          arr[mid].state = "found";
          setBars([...arr]);
          setResult(`✅ Found ${val} at index ${mid} in ${cmp} comparisons!`);
          found = true; break;
        } else if (arr[mid].value < val) {
          lo = mid + 1;
        } else {
          hi = mid - 1;
        }
      }
      if (!found) setResult(`❌ ${val} not found after ${cmp} comparisons.`);
    }

    setRunning(false);
  };

  const COLOR_MAP: Record<Bar["state"], string> = {
    default:    "#bfdbfe",
    comparing:  "#fde047",
    found:      "#4ade80",
    eliminated: "#e2e8f0",
    range:      "#c7d2fe",
  };

  const maxVal = Math.max(...bars.map((b) => b.value));

  return (
    <div className="min-h-screen bg-gray-50 px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-6">
        <Link href="/tools/dsa" className="hover:text-gray-700 transition-colors">DSA</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-gray-700 font-semibold">Searching</span>
      </div>

      <div className="max-w-5xl mx-auto space-y-6">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h1 className="text-2xl font-black text-gray-900">Searching Algorithms</h1>
          <p className="text-gray-500 text-sm mt-1">Visualize Linear and Binary search step by step.</p>
        </div>

        {/* Algo selector */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <div className="flex gap-3 flex-wrap">
            {([["linear", "Linear Search", "O(n)", "Works on unsorted arrays"], ["binary", "Binary Search", "O(log n)", "Requires sorted array"]] as const).map(([id, name, time, note]) => (
              <button key={id} onClick={() => handleAlgoChange(id)} disabled={running}
                className={`flex-1 min-w-[180px] p-4 rounded-xl border-2 text-left transition-all ${algo === id ? "border-cyan-400 bg-cyan-50" : "border-gray-100 hover:border-cyan-200"}`}>
                <p className={`font-black text-sm ${algo === id ? "text-cyan-700" : "text-gray-700"}`}>{name}</p>
                <p className={`text-xs font-bold mt-0.5 ${algo === id ? "text-cyan-500" : "text-gray-400"}`}>{time} · {note}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Visualization */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
            <div className="flex gap-4">
              <div className="text-center">
                <p className="text-lg font-black text-gray-900">{comparisons}</p>
                <p className="text-[9px] font-bold uppercase tracking-wider text-gray-400">Comparisons</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {Object.entries(COLOR_MAP).map(([key, color]) => (
                <div key={key} className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: color }} />
                  <span className="text-[9px] font-medium text-gray-500 capitalize">{key}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Bars */}
          <div className="flex items-end gap-1 h-40 bg-gray-50 rounded-xl p-3 mb-3">
            {bars.map((bar, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-0.5 min-w-0">
                <div className="w-full rounded-t-sm transition-all duration-200" style={{ height: `${(bar.value / maxVal) * 100}%`, backgroundColor: COLOR_MAP[bar.state], minHeight: "4px" }} />
              </div>
            ))}
          </div>

          {/* Values */}
          <div className="flex gap-1 overflow-x-auto">
            {bars.map((bar, i) => (
              <div key={i} className="flex-1 text-center text-[9px] font-mono text-gray-400 min-w-0 truncate">{bar.value}</div>
            ))}
          </div>
        </div>

        {/* Result */}
        {result && (
          <div className={`p-4 rounded-xl border font-bold text-sm ${result.startsWith("✅") ? "bg-emerald-50 border-emerald-200 text-emerald-700" : "bg-red-50 border-red-200 text-red-700"}`}>
            {result}
          </div>
        )}

        {/* Controls */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <div className="flex flex-wrap items-center gap-3">
            <input
              type="number"
              value={target}
              onChange={(e) => setTarget(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && runSearch()}
              placeholder={`Search value (array: ${bars[0]?.value}–${bars[bars.length - 1]?.value})`}
              className="flex-1 min-w-[200px] h-10 px-3 text-sm rounded-xl border border-gray-200 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/10"
            />
            <button onClick={shuffle} disabled={running} className="flex items-center gap-1.5 px-4 py-2 bg-gray-100 hover:bg-gray-200 disabled:opacity-50 text-gray-700 text-sm font-bold rounded-xl transition-colors">
              <Shuffle className="w-4 h-4" /> New Array
            </button>
            <button onClick={reset} className="flex items-center gap-1.5 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-bold rounded-xl transition-colors">
              <RotateCcw className="w-4 h-4" /> Reset
            </button>
            <button onClick={runSearch} disabled={running || !target} className="flex items-center gap-1.5 px-6 py-2 bg-cyan-600 hover:bg-cyan-700 disabled:opacity-50 text-white text-sm font-bold rounded-xl transition-colors shadow-sm">
              <Play className="w-4 h-4" /> {running ? "Searching…" : "Search"}
            </button>
          </div>
        </div>

        {/* Comparison */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { name: "Linear Search", time: "O(n)", space: "O(1)", sorted: "Not required", best: "O(1)", worst: "O(n)", color: "blue" },
            { name: "Binary Search", time: "O(log n)", space: "O(1)", sorted: "Required", best: "O(1)", worst: "O(log n)", color: "cyan" },
          ].map((s) => (
            <div key={s.name} className={`p-5 rounded-2xl border ${s.color === "blue" ? "bg-blue-50 border-blue-100" : "bg-cyan-50 border-cyan-100"}`}>
              <p className={`font-black mb-3 ${s.color === "blue" ? "text-blue-700" : "text-cyan-700"}`}>{s.name}</p>
              <div className="space-y-1.5 text-xs">
                {[["Time Complexity", s.time], ["Space Complexity", s.space], ["Sorted Array", s.sorted], ["Best Case", s.best], ["Worst Case", s.worst]].map(([k, v]) => (
                  <div key={k} className="flex justify-between">
                    <span className="text-gray-500">{k}</span>
                    <span className={`font-black ${s.color === "blue" ? "text-blue-600" : "text-cyan-600"}`}>{v}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
