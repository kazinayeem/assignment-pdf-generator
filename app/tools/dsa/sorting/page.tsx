"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import { ChevronRight, Play, RotateCcw, Shuffle } from "lucide-react";

type SortAlgo = "bubble" | "selection" | "insertion" | "merge" | "quick";

const ALGO_INFO: Record<SortAlgo, { name: string; time: string; space: string; stable: boolean; desc: string }> = {
  bubble:    { name: "Bubble Sort",    time: "O(n²)",      space: "O(1)",    stable: true,  desc: "Repeatedly swaps adjacent elements if they are in wrong order." },
  selection: { name: "Selection Sort", time: "O(n²)",      space: "O(1)",    stable: false, desc: "Finds minimum element and places it at the beginning each pass." },
  insertion: { name: "Insertion Sort", time: "O(n²)",      space: "O(1)",    stable: true,  desc: "Builds sorted array one element at a time by inserting into correct position." },
  merge:     { name: "Merge Sort",     time: "O(n log n)", space: "O(n)",    stable: true,  desc: "Divides array in half, sorts each half, then merges them back together." },
  quick:     { name: "Quick Sort",     time: "O(n log n)", space: "O(log n)", stable: false, desc: "Picks a pivot, partitions array around it, recursively sorts partitions." },
};

const BAR_COLORS = {
  default:   "#bfdbfe",
  comparing: "#fde047",
  swapping:  "#f87171",
  sorted:    "#4ade80",
  pivot:     "#c084fc",
};

interface Bar { value: number; state: keyof typeof BAR_COLORS; }

function randomArray(n = 16): Bar[] {
  return Array.from({ length: n }, () => ({
    value: Math.floor(Math.random() * 90) + 10,
    state: "default" as const,
  }));
}

export default function SortingPage() {
  const [bars, setBars] = useState<Bar[]>(randomArray());
  const [algo, setAlgo] = useState<SortAlgo>("bubble");
  const [speed, setSpeed] = useState(80);
  const [running, setRunning] = useState(false);
  const [comparisons, setComparisons] = useState(0);
  const [swaps, setSwaps] = useState(0);
  const stopRef = useRef(false);

  const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

  const reset = () => {
    stopRef.current = true;
    setTimeout(() => {
      setBars(randomArray());
      setComparisons(0);
      setSwaps(0);
      setRunning(false);
      stopRef.current = false;
    }, 100);
  };

  const shuffle = () => {
    if (running) return;
    setBars(randomArray());
    setComparisons(0);
    setSwaps(0);
  };

  const markSorted = (arr: Bar[], indices: number[]) =>
    arr.map((b, i) => ({ ...b, state: indices.includes(i) ? "sorted" as const : b.state }));

  const runSort = async () => {
    if (running) return;
    setRunning(true);
    stopRef.current = false;
    setComparisons(0);
    setSwaps(0);

    const arr: Bar[] = bars.map((b) => ({ ...b, state: "default" }));
    let cmp = 0, sw = 0;

    const update = (a: Bar[]) => setBars([...a]);
    const delay = () => sleep(Math.max(10, 200 - speed * 1.8));

    if (algo === "bubble") {
      for (let i = 0; i < arr.length - 1; i++) {
        for (let j = 0; j < arr.length - i - 1; j++) {
          if (stopRef.current) { setRunning(false); return; }
          arr[j].state = "comparing"; arr[j + 1].state = "comparing";
          update(arr); cmp++; setComparisons(cmp);
          await delay();
          if (arr[j].value > arr[j + 1].value) {
            [arr[j].value, arr[j + 1].value] = [arr[j + 1].value, arr[j].value];
            arr[j].state = "swapping"; arr[j + 1].state = "swapping";
            update(arr); sw++; setSwaps(sw);
            await delay();
          }
          arr[j].state = "default"; arr[j + 1].state = "default";
        }
        arr[arr.length - 1 - i].state = "sorted";
        update(arr);
      }
      arr[0].state = "sorted";
    }

    if (algo === "selection") {
      for (let i = 0; i < arr.length - 1; i++) {
        let minIdx = i;
        arr[i].state = "pivot";
        for (let j = i + 1; j < arr.length; j++) {
          if (stopRef.current) { setRunning(false); return; }
          arr[j].state = "comparing"; update(arr); cmp++; setComparisons(cmp);
          await delay();
          if (arr[j].value < arr[minIdx].value) {
            if (minIdx !== i) arr[minIdx].state = "default";
            minIdx = j; arr[minIdx].state = "swapping";
          } else { arr[j].state = "default"; }
        }
        if (minIdx !== i) {
          [arr[i].value, arr[minIdx].value] = [arr[minIdx].value, arr[i].value];
          sw++; setSwaps(sw);
        }
        arr[i].state = "sorted"; if (minIdx !== i) arr[minIdx].state = "default";
        update(arr);
      }
      arr[arr.length - 1].state = "sorted";
    }

    if (algo === "insertion") {
      arr[0].state = "sorted";
      for (let i = 1; i < arr.length; i++) {
        if (stopRef.current) { setRunning(false); return; }
        const key = arr[i].value;
        arr[i].state = "pivot"; update(arr);
        let j = i - 1;
        while (j >= 0 && arr[j].value > key) {
          if (stopRef.current) { setRunning(false); return; }
          arr[j].state = "comparing"; cmp++; setComparisons(cmp);
          arr[j + 1].value = arr[j].value; arr[j + 1].state = "swapping";
          update(arr); sw++; setSwaps(sw);
          await delay();
          arr[j].state = "sorted"; j--;
        }
        arr[j + 1].value = key; arr[j + 1].state = "sorted";
        update(arr);
      }
    }

    // Mark all sorted at end
    setBars(arr.map((b) => ({ ...b, state: "sorted" })));
    setRunning(false);
  };

  const maxVal = Math.max(...bars.map((b) => b.value));

  return (
    <div className="min-h-screen bg-gray-50 px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-6">
        <Link href="/tools/dsa" className="hover:text-gray-700 transition-colors">DSA</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-gray-700 font-semibold">Sorting Algorithms</span>
      </div>

      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h1 className="text-2xl font-black text-gray-900">Sorting Algorithms Visualizer</h1>
          <p className="text-gray-500 text-sm mt-1">Watch sorting algorithms in action with animated bar charts.</p>
        </div>

        {/* Algorithm selector */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h2 className="text-xs font-black uppercase tracking-wider text-gray-500 mb-3">Select Algorithm</h2>
          <div className="flex flex-wrap gap-2">
            {(Object.keys(ALGO_INFO) as SortAlgo[]).map((a) => (
              <button
                key={a}
                onClick={() => { if (!running) setAlgo(a); }}
                disabled={running}
                className={`px-4 py-2 rounded-xl text-sm font-bold border transition-all ${
                  algo === a
                    ? "bg-indigo-600 text-white border-indigo-600 shadow-sm"
                    : "bg-white text-gray-600 border-gray-200 hover:border-indigo-300 hover:text-indigo-600"
                }`}
              >
                {ALGO_INFO[a].name}
              </button>
            ))}
          </div>

          {/* Info */}
          <div className="mt-4 p-4 bg-indigo-50 rounded-xl border border-indigo-100 flex flex-wrap gap-4 items-start">
            <div className="flex-1 min-w-0">
              <p className="text-xs font-black text-indigo-700 mb-1">{ALGO_INFO[algo].name}</p>
              <p className="text-xs text-indigo-600 leading-relaxed">{ALGO_INFO[algo].desc}</p>
            </div>
            <div className="flex gap-3 shrink-0">
              <div className="text-center">
                <p className="text-xs font-black text-indigo-700">{ALGO_INFO[algo].time}</p>
                <p className="text-[9px] text-indigo-400 uppercase tracking-wider">Time</p>
              </div>
              <div className="text-center">
                <p className="text-xs font-black text-indigo-700">{ALGO_INFO[algo].space}</p>
                <p className="text-[9px] text-indigo-400 uppercase tracking-wider">Space</p>
              </div>
              <div className="text-center">
                <p className="text-xs font-black text-indigo-700">{ALGO_INFO[algo].stable ? "Yes" : "No"}</p>
                <p className="text-[9px] text-indigo-400 uppercase tracking-wider">Stable</p>
              </div>
            </div>
          </div>
        </div>

        {/* Visualization */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          {/* Stats */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex gap-4">
              <div className="text-center">
                <p className="text-lg font-black text-gray-900">{comparisons}</p>
                <p className="text-[9px] font-bold uppercase tracking-wider text-gray-400">Comparisons</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-black text-gray-900">{swaps}</p>
                <p className="text-[9px] font-bold uppercase tracking-wider text-gray-400">Swaps</p>
              </div>
            </div>
            {/* Legend */}
            <div className="flex flex-wrap gap-2">
              {Object.entries(BAR_COLORS).map(([key, color]) => (
                <div key={key} className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: color }} />
                  <span className="text-[9px] font-medium text-gray-500 capitalize">{key}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Bars */}
          <div className="flex items-end gap-1 h-48 bg-gray-50 rounded-xl p-3 overflow-hidden">
            {bars.map((bar, i) => (
              <div
                key={i}
                className="flex-1 rounded-t-sm transition-all duration-100 min-w-0"
                style={{
                  height: `${(bar.value / maxVal) * 100}%`,
                  backgroundColor: BAR_COLORS[bar.state],
                  minHeight: "4px",
                }}
                title={`${bar.value}`}
              />
            ))}
          </div>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-gray-500">Speed:</span>
              <input
                type="range" min="10" max="100" value={speed}
                onChange={(e) => setSpeed(parseInt(e.target.value))}
                disabled={running}
                className="w-24 accent-indigo-600"
              />
              <span className="text-xs text-gray-400">{speed}%</span>
            </div>

            <div className="flex gap-2 ml-auto">
              <button onClick={shuffle} disabled={running} className="flex items-center gap-1.5 px-4 py-2 bg-gray-100 hover:bg-gray-200 disabled:opacity-50 text-gray-700 text-sm font-bold rounded-xl transition-colors">
                <Shuffle className="w-4 h-4" /> Shuffle
              </button>
              <button onClick={reset} className="flex items-center gap-1.5 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-bold rounded-xl transition-colors">
                <RotateCcw className="w-4 h-4" /> Reset
              </button>
              <button onClick={runSort} disabled={running} className="flex items-center gap-1.5 px-6 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-sm font-bold rounded-xl transition-colors shadow-sm">
                <Play className="w-4 h-4" /> {running ? "Sorting…" : "Sort"}
              </button>
            </div>
          </div>
        </div>

        {/* Comparison table */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 overflow-x-auto">
          <h2 className="text-sm font-black uppercase tracking-wider text-gray-700 mb-4">Algorithm Comparison</h2>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                {["Algorithm", "Best", "Average", "Worst", "Space", "Stable"].map((h) => (
                  <th key={h} className="text-left py-2 px-3 text-[10px] font-black uppercase tracking-wider text-gray-400">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                ["Bubble Sort",    "O(n)",      "O(n²)",      "O(n²)",      "O(1)",    "✅"],
                ["Selection Sort", "O(n²)",     "O(n²)",      "O(n²)",      "O(1)",    "❌"],
                ["Insertion Sort", "O(n)",      "O(n²)",      "O(n²)",      "O(1)",    "✅"],
                ["Merge Sort",     "O(n log n)","O(n log n)", "O(n log n)", "O(n)",    "✅"],
                ["Quick Sort",     "O(n log n)","O(n log n)", "O(n²)",      "O(log n)","❌"],
                ["Heap Sort",      "O(n log n)","O(n log n)", "O(n log n)", "O(1)",    "❌"],
              ].map(([name, best, avg, worst, space, stable]) => (
                <tr key={name} className={`border-b border-gray-50 hover:bg-gray-50 transition-colors ${name.toLowerCase().replace(" sort","") === algo ? "bg-indigo-50" : ""}`}>
                  <td className="py-2.5 px-3 font-semibold text-gray-800">{name}</td>
                  <td className="py-2.5 px-3 font-mono text-emerald-600 text-xs">{best}</td>
                  <td className="py-2.5 px-3 font-mono text-yellow-600 text-xs">{avg}</td>
                  <td className="py-2.5 px-3 font-mono text-red-500 text-xs">{worst}</td>
                  <td className="py-2.5 px-3 font-mono text-gray-500 text-xs">{space}</td>
                  <td className="py-2.5 px-3 text-center">{stable}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
