"use client";

import { useMemo, useState } from "react";
import { ToolShell } from "./tool-shell";

const OPTIONS = {
  direction: ["row", "row-reverse", "column", "column-reverse"],
  justify: ["flex-start", "center", "flex-end", "space-between", "space-around", "space-evenly"],
  align: ["stretch", "flex-start", "center", "flex-end", "baseline"],
  wrap: ["nowrap", "wrap", "wrap-reverse"],
};

export function FlexboxPlayground() {
  const [direction, setDirection] = useState("row");
  const [justify, setJustify] = useState("flex-start");
  const [align, setAlign] = useState("stretch");
  const [wrap, setWrap] = useState("nowrap");
  const [gap, setGap] = useState(12);

  const css = useMemo(() => `.container {
  display: flex;
  flex-direction: ${direction};
  justify-content: ${justify};
  align-items: ${align};
  flex-wrap: ${wrap};
  gap: ${gap}px;
}`, [direction, justify, align, wrap, gap]);

  return (
    <div className="space-y-6">
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: "Direction", key: "direction", opts: OPTIONS.direction, val: direction, set: setDirection },
          { label: "Justify", key: "justify", opts: OPTIONS.justify, val: justify, set: setJustify },
          { label: "Align", key: "align", opts: OPTIONS.align, val: align, set: setAlign },
          { label: "Wrap", key: "wrap", opts: OPTIONS.wrap, val: wrap, set: setWrap },
        ].map(({ label, opts, val, set }) => (
          <div key={label} className="glass-card p-3">
            <label className="text-xs font-bold text-slate-500 mb-1 block">{label}</label>
            <select
              value={val}
              onChange={(e) => set(e.target.value)}
              className="w-full rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 px-3 py-2 text-sm min-h-[44px]"
            >
              {opts.map((o) => <option key={o} value={o}>{o}</option>)}
            </select>
          </div>
        ))}
        <div className="glass-card p-3">
          <label className="text-xs font-bold text-slate-500 mb-1 block">Gap ({gap}px)</label>
          <input type="range" min={0} max={48} value={gap} onChange={(e) => setGap(Number(e.target.value))} className="w-full mt-2" />
        </div>
      </div>

      <div
        className="glass-card p-4 min-h-[200px] rounded-2xl border-2 border-dashed border-slate-200 dark:border-white/10"
        style={{ display: "flex", flexDirection: direction as React.CSSProperties["flexDirection"], justifyContent: justify as React.CSSProperties["justifyContent"], alignItems: align as React.CSSProperties["alignItems"], flexWrap: wrap as React.CSSProperties["flexWrap"], gap }}
      >
        {[1, 2, 3, 4, 5].map((n) => (
          <div key={n} className="w-16 h-16 rounded-xl bg-gradient-to-br from-brand to-brand-accent flex items-center justify-center text-white font-bold text-sm shrink-0">
            {n}
          </div>
        ))}
      </div>

      <ToolShell
        input={css}
        output={css}
        onInputChange={() => {}}
        onReset={() => { setDirection("row"); setJustify("flex-start"); setAlign("stretch"); setWrap("nowrap"); setGap(12); }}
        inputLabel="Generated CSS"
        outputLabel="CSS Output"
      />
    </div>
  );
}
