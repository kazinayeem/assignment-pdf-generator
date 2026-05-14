"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ChevronRight, Plus, Trash2, Search, RotateCcw, Info } from "lucide-react";

interface TreeNode { value: number; left: TreeNode | null; right: TreeNode | null; state?: "default" | "highlight" | "found" | "inserted"; }

function insert(root: TreeNode | null, val: number): TreeNode {
  if (!root) return { value: val, left: null, right: null, state: "inserted" };
  if (val < root.value) return { ...root, left: insert(root.left, val) };
  if (val > root.value) return { ...root, right: insert(root.right, val) };
  return root;
}

function deleteNode(root: TreeNode | null, val: number): TreeNode | null {
  if (!root) return null;
  if (val < root.value) return { ...root, left: deleteNode(root.left, val) };
  if (val > root.value) return { ...root, right: deleteNode(root.right, val) };
  if (!root.left) return root.right;
  if (!root.right) return root.left;
  let min = root.right;
  while (min.left) min = min.left;
  return { ...root, value: min.value, right: deleteNode(root.right, min.value) };
}

function inorder(root: TreeNode | null): number[] {
  if (!root) return [];
  return [...inorder(root.left), root.value, ...inorder(root.right)];
}

function preorder(root: TreeNode | null): number[] {
  if (!root) return [];
  return [root.value, ...preorder(root.left), ...preorder(root.right)];
}

function postorder(root: TreeNode | null): number[] {
  if (!root) return [];
  return [...postorder(root.left), ...postorder(root.right), root.value];
}

function clearStates(root: TreeNode | null): TreeNode | null {
  if (!root) return null;
  return { ...root, state: "default", left: clearStates(root.left), right: clearStates(root.right) };
}

// ── Tree renderer ─────────────────────────────────────────────────────────────
function TreeNodeView({ node, x, y, parentX, parentY, level }: {
  node: TreeNode; x: number; y: number; parentX?: number; parentY?: number; level: number;
}) {
  const gap = 200 / Math.pow(2, level);
  const c = node.state === "found" ? { bg: "#dcfce7", border: "#4ade80", text: "#15803d" }
    : node.state === "highlight" ? { bg: "#fef9c3", border: "#fde047", text: "#854d0e" }
    : node.state === "inserted" ? { bg: "#eff6ff", border: "#60a5fa", text: "#1d4ed8" }
    : { bg: "#f8fafc", border: "#cbd5e1", text: "#334155" };

  return (
    <g>
      {parentX !== undefined && parentY !== undefined && (
        <line x1={parentX} y1={parentY + 18} x2={x} y2={y - 18} stroke="#cbd5e1" strokeWidth="1.5" />
      )}
      <circle cx={x} cy={y} r={18} fill={c.bg} stroke={c.border} strokeWidth="2" />
      <text x={x} y={y + 5} textAnchor="middle" fontSize="12" fontWeight="bold" fill={c.text}>{node.value}</text>
      {node.left && <TreeNodeView node={node.left} x={x - gap} y={y + 60} parentX={x} parentY={y} level={level + 1} />}
      {node.right && <TreeNodeView node={node.right} x={x + gap} y={y + 60} parentX={x} parentY={y} level={level + 1} />}
    </g>
  );
}

function buildInitialTree(): TreeNode {
  let root: TreeNode | null = null;
  for (const v of [50, 30, 70, 20, 40, 60, 80]) root = insert(root, v);
  return root!;
}

export default function TreePage() {
  const [root, setRoot] = useState<TreeNode | null>(buildInitialTree());
  const [input, setInput] = useState("");
  const [traversal, setTraversal] = useState<"inorder" | "preorder" | "postorder">("inorder");
  const [traversalResult, setTraversalResult] = useState<number[]>([]);
  const [log, setLog] = useState<string[]>(["BST initialized: 50, 30, 70, 20, 40, 60, 80"]);

  const addLog = (msg: string) => setLog((p) => [msg, ...p.slice(0, 9)]);

  const handleInsert = () => {
    const val = parseInt(input);
    if (isNaN(val)) return;
    setRoot((r) => insert(clearStates(r), val));
    addLog(`✅ Inserted ${val} into BST`);
    setInput("");
  };

  const handleDelete = () => {
    const val = parseInt(input);
    if (isNaN(val)) return;
    setRoot((r) => clearStates(deleteNode(r, val)));
    addLog(`🗑️ Deleted ${val} from BST`);
    setInput("");
  };

  const handleSearch = () => {
    const val = parseInt(input);
    if (isNaN(val)) return;
    const highlight = (node: TreeNode | null, target: number): TreeNode | null => {
      if (!node) return null;
      if (node.value === target) return { ...node, state: "found", left: clearStates(node.left), right: clearStates(node.right) };
      if (target < node.value) return { ...node, state: "highlight", left: highlight(node.left, target), right: clearStates(node.right) };
      return { ...node, state: "highlight", right: highlight(node.right, target), left: clearStates(node.left) };
    };
    setRoot((r) => highlight(r, val));
    const found = inorder(root).includes(val);
    addLog(found ? `✅ Found ${val} in BST` : `❌ ${val} not found`);
  };

  const handleTraversal = () => {
    const result = traversal === "inorder" ? inorder(root)
      : traversal === "preorder" ? preorder(root)
      : postorder(root);
    setTraversalResult(result);
    addLog(`📋 ${traversal}: [${result.join(", ")}]`);
  };

  const handleReset = () => {
    setRoot(buildInitialTree());
    setLog(["BST reset."]);
    setInput(""); setTraversalResult([]);
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-6">
        <Link href="/tools/dsa" className="hover:text-gray-700 transition-colors">DSA</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-gray-700 font-semibold">Binary Tree</span>
      </div>

      <div className="max-w-5xl mx-auto space-y-6">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-black text-gray-900">Binary Search Tree</h1>
              <p className="text-gray-500 text-sm mt-1">Insert, delete, search and traverse a BST visually.</p>
            </div>
            <div className="flex gap-3 shrink-0">
              {[["O(log n)", "Search"], ["O(log n)", "Insert"], ["O(log n)", "Delete"]].map(([v, l]) => (
                <div key={l} className="px-3 py-2 bg-teal-50 rounded-xl border border-teal-100 text-center">
                  <p className="text-sm font-black text-teal-600">{v}</p>
                  <p className="text-[9px] font-bold uppercase tracking-wider text-teal-400">{l}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tree SVG */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 overflow-x-auto">
          <svg width="100%" height="320" viewBox="0 0 600 320" style={{ minWidth: 400 }}>
            {root && <TreeNodeView node={root} x={300} y={40} level={0} />}
            {!root && <text x="300" y="160" textAnchor="middle" fill="#94a3b8" fontSize="14">Empty tree</text>}
          </svg>
        </div>

        {/* Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <h3 className="text-xs font-black uppercase tracking-wider text-gray-500 mb-3">Operations</h3>
            <div className="space-y-2">
              <input type="number" value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleInsert()} placeholder="Enter value" className="w-full h-9 px-3 text-sm rounded-lg border border-gray-200 focus:outline-none focus:border-teal-400" />
              <div className="grid grid-cols-3 gap-2">
                <button onClick={handleInsert} disabled={!input} className="h-9 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white text-xs font-bold rounded-lg flex items-center justify-center gap-1"><Plus className="w-3.5 h-3.5" /> Insert</button>
                <button onClick={handleDelete} disabled={!input} className="h-9 bg-red-500 hover:bg-red-600 disabled:opacity-50 text-white text-xs font-bold rounded-lg flex items-center justify-center gap-1"><Trash2 className="w-3.5 h-3.5" /> Delete</button>
                <button onClick={handleSearch} disabled={!input} className="h-9 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-bold rounded-lg flex items-center justify-center gap-1"><Search className="w-3.5 h-3.5" /> Find</button>
              </div>
              <button onClick={handleReset} className="w-full h-9 bg-gray-100 hover:bg-gray-200 text-gray-600 text-sm font-bold rounded-lg flex items-center justify-center gap-1.5"><RotateCcw className="w-3.5 h-3.5" /> Reset</button>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <h3 className="text-xs font-black uppercase tracking-wider text-gray-500 mb-3">Traversal</h3>
            <div className="flex gap-1 p-1 bg-gray-100 rounded-xl mb-3">
              {(["inorder", "preorder", "postorder"] as const).map((t) => (
                <button key={t} onClick={() => setTraversal(t)} className={`flex-1 py-1.5 rounded-lg text-[10px] font-bold capitalize transition-all ${traversal === t ? "bg-white text-gray-900 shadow-sm" : "text-gray-500"}`}>{t}</button>
              ))}
            </div>
            <button onClick={handleTraversal} className="w-full h-9 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-lg mb-3">Run Traversal</button>
            {traversalResult.length > 0 && (
              <div className="p-3 bg-indigo-50 rounded-xl border border-indigo-100">
                <p className="text-[10px] font-black text-indigo-400 uppercase tracking-wider mb-1">{traversal} result:</p>
                <p className="text-sm font-mono text-indigo-700">[{traversalResult.join(" → ")}]</p>
              </div>
            )}
          </div>
        </div>

        {/* Log */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h3 className="text-xs font-black uppercase tracking-wider text-gray-500 mb-3 flex items-center gap-1.5"><Info className="w-3.5 h-3.5" /> Log</h3>
          <div className="space-y-1.5 max-h-32 overflow-y-auto">
            {log.map((entry, i) => (
              <p key={i} className={`text-xs font-medium px-2 py-1 rounded-lg ${i === 0 ? "bg-teal-50 text-teal-700" : "text-gray-500"}`}>{entry}</p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
