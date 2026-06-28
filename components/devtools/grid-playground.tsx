"use client";

import { useMemo, useState } from "react";
import { ToolShell } from "./tool-shell";

export function GridPlayground() {
  const [cols, setCols] = useState(3);
  const [rows, setRows] = useState(2);
  const [gap, setGap] = useState(16);
  const [align, setAlign] = useState("stretch");
  const [justify, setJustify] = useState("stretch");

  const css = useMemo(() => `.grid-container {
  display: grid;
  grid-template-columns: repeat(${cols}, 1fr);
  grid-template-rows: repeat(${rows}, 80px);
  gap: ${gap}px;
  align-items: ${align};
  justify-items: ${justify};
}`, [cols, rows, gap, align, justify]);

  return (
    <div className="space-y-6">
      <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-3">
        <div className="glass-card p-3">
          <label className="text-xs font-bold text-slate-500">Columns ({cols})</label>
          <input type="range" min={1} max={6} value={cols} onChange={(e) => setCols(Number(e.target.value))} className="w-full mt-2" />
        </div>
        <div className="glass-card p-3">
          <label className="text-xs font-bold text-slate-500">Rows ({rows})</label>
          <input type="range" min={1} max={4} value={rows} onChange={(e) => setRows(Number(e.target.value))} className="w-full mt-2" />
        </div>
        <div className="glass-card p-3">
          <label className="text-xs font-bold text-slate-500">Gap ({gap}px)</label>
          <input type="range" min={0} max={48} value={gap} onChange={(e) => setGap(Number(e.target.value))} className="w-full mt-2" />
        </div>
        <div className="glass-card p-3">
          <label className="text-xs font-bold text-slate-500 mb-1 block">Align Items</label>
          <select value={align} onChange={(e) => setAlign(e.target.value)} className="w-full rounded-lg border px-2 py-2 text-sm min-h-[44px] dark:bg-white/5">
            {["stretch", "start", "center", "end"].map((o) => <option key={o}>{o}</option>)}
          </select>
        </div>
        <div className="glass-card p-3">
          <label className="text-xs font-bold text-slate-500 mb-1 block">Justify Items</label>
          <select value={justify} onChange={(e) => setJustify(e.target.value)} className="w-full rounded-lg border px-2 py-2 text-sm min-h-[44px] dark:bg-white/5">
            {["stretch", "start", "center", "end"].map((o) => <option key={o}>{o}</option>)}
          </select>
        </div>
      </div>

      <div
        className="glass-card p-4 rounded-2xl border-2 border-dashed border-slate-200 dark:border-white/10"
        style={{ display: "grid", gridTemplateColumns: `repeat(${cols}, 1fr)`, gridTemplateRows: `repeat(${rows}, 80px)`, gap, alignItems: align, justifyItems: justify }}
      >
        {Array.from({ length: cols * rows }).map((_, i) => (
          <div key={i} className="rounded-xl bg-gradient-to-br from-[#6D5DF6]/80 to-[#06B6D4]/80 flex items-center justify-center text-white font-bold text-sm">
            {i + 1}
          </div>
        ))}
      </div>

      <ToolShell input={css} output={css} onInputChange={() => {}} onReset={() => { setCols(3); setRows(2); setGap(16); }} inputLabel="Generated CSS" outputLabel="CSS Output" />
    </div>
  );
}
