"use client";

import { useMemo, useState } from "react";

function TreeNode({ name, value, depth = 0 }: { name: string; value: unknown; depth?: number }) {
  const [open, setOpen] = useState(depth < 2);
  const isObj = value !== null && typeof value === "object";
  const isArr = Array.isArray(value);

  if (!isObj) {
    return (
      <div className="flex gap-2 py-0.5 font-mono text-sm" style={{ paddingLeft: depth * 16 }}>
        <span className="text-[#6D5DF6]">{name}:</span>
        <span className="text-emerald-600 dark:text-emerald-400">{JSON.stringify(value)}</span>
      </div>
    );
  }

  const entries = isArr
    ? (value as unknown[]).map((v, i) => [String(i), v] as const)
    : Object.entries(value as Record<string, unknown>);

  return (
    <div style={{ paddingLeft: depth * 16 }}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="text-left font-mono text-sm text-slate-700 dark:text-slate-300 hover:text-[#6D5DF6] min-h-[32px]"
      >
        {open ? "▼" : "▶"} {name}{isArr ? ` [${entries.length}]` : ` {${entries.length}}`}
      </button>
      {open && entries.map(([k, v]) => (
        <TreeNode key={k} name={k} value={v} depth={depth + 1} />
      ))}
    </div>
  );
}

export function JsonTreeViewer({ data }: { data: string }) {
  const parsed = useMemo(() => {
    try { return JSON.parse(data); }
    catch { return null; }
  }, [data]);

  if (parsed === null) {
    return <p className="text-sm text-red-500">Invalid JSON — fix input to see tree view.</p>;
  }

  return (
    <div className="overflow-auto max-h-96 p-2">
      <TreeNode name="root" value={parsed} />
    </div>
  );
}
