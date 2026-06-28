"use client";

import { useCallback, useRef, useState } from "react";
import { Copy, ClipboardPaste, Trash2, RotateCcw, Download, Upload, Check } from "lucide-react";
import toast from "react-hot-toast";
import { cn } from "@/lib/utils";
import { ToolsButton } from "@/components/tools/tools-button";

type ToolShellProps = {
  input: string;
  output: string;
  error?: string;
  onInputChange: (v: string) => void;
  inputB?: string;
  onInputBChange?: (v: string) => void;
  inputLabel?: string;
  outputLabel?: string;
  inputPlaceholder?: string;
  showSecondInput?: boolean;
  acceptsFile?: boolean;
  fileTypes?: string;
  onReset: () => void;
  children?: React.ReactNode;
  toolbar?: React.ReactNode;
};

export function ToolShell({
  input,
  output,
  error,
  onInputChange,
  inputB = "",
  onInputBChange,
  inputLabel = "Input",
  outputLabel = "Output",
  inputPlaceholder = "Paste or type here...",
  showSecondInput,
  acceptsFile,
  fileTypes,
  onReset,
  children,
  toolbar,
}: ToolShellProps) {
  const [copied, setCopied] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const onCopy = async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    setCopied(true);
    toast.success("Copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  const onPaste = async () => {
    const text = await navigator.clipboard.readText();
    onInputChange(text);
    toast.success("Pasted from clipboard");
  };

  const onClear = () => onInputChange("");

  const onDownload = () => {
    if (!output) return;
    const blob = new Blob([output], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "output.txt";
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Downloaded");
  };

  const handleFile = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => onInputChange(String(e.target?.result ?? ""));
    reader.readAsText(file);
  }, [onInputChange]);

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  return (
    <div className="space-y-4">
      {toolbar}

      <div className="flex flex-wrap gap-2">
        <ToolsButton size="sm" variant="secondary" onClick={onPaste} className="min-h-[44px]">
          <ClipboardPaste size={16} aria-hidden /> Paste
        </ToolsButton>
        <ToolsButton size="sm" variant="secondary" onClick={onCopy} disabled={!output} className="min-h-[44px]">
          {copied ? <Check size={16} /> : <Copy size={16} aria-hidden />} Copy
        </ToolsButton>
        <ToolsButton size="sm" variant="secondary" onClick={onClear} className="min-h-[44px]">
          <Trash2 size={16} aria-hidden /> Clear
        </ToolsButton>
        <ToolsButton size="sm" variant="secondary" onClick={onReset} className="min-h-[44px]">
          <RotateCcw size={16} aria-hidden /> Reset
        </ToolsButton>
        <ToolsButton size="sm" variant="secondary" onClick={onDownload} disabled={!output} className="min-h-[44px]">
          <Download size={16} aria-hidden /> Download
        </ToolsButton>
        {acceptsFile && (
          <>
            <input ref={fileRef} type="file" accept={fileTypes} className="hidden" onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} />
            <ToolsButton size="sm" variant="secondary" onClick={() => fileRef.current?.click()} className="min-h-[44px]">
              <Upload size={16} aria-hidden /> Upload
            </ToolsButton>
          </>
        )}
      </div>

      <div className={cn("grid gap-4", showSecondInput ? "lg:grid-cols-2" : "lg:grid-cols-2")}>
        <div
          className={cn(
            "glass-card p-4 sm:p-5",
            dragOver && "ring-2 ring-brand/50"
          )}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={onDrop}
        >
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 block">{inputLabel}</label>
          <textarea
            value={input}
            onChange={(e) => onInputChange(e.target.value)}
            placeholder={inputPlaceholder}
            spellCheck={false}
            className="w-full min-h-[200px] sm:min-h-[280px] resize-y rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 p-4 font-mono text-sm outline-none focus:border-brand/50 focus:ring-2 focus:ring-brand/20"
            aria-label={inputLabel}
          />
          {showSecondInput && onInputBChange && (
            <>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 mt-4 block">Compare With</label>
              <textarea
                value={inputB}
                onChange={(e) => onInputBChange(e.target.value)}
                placeholder="Second JSON..."
                spellCheck={false}
                className="w-full min-h-[120px] resize-y rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 p-4 font-mono text-sm outline-none focus:border-brand/50"
              />
            </>
          )}
        </div>

        <div className="glass-card p-4 sm:p-5">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 block">{outputLabel}</label>
          {error ? (
            <div role="alert" className="rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 p-4 text-sm text-red-700 dark:text-red-300 font-mono">
              {error}
            </div>
          ) : (
            <pre className="w-full min-h-[200px] sm:min-h-[280px] overflow-auto rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-black/20 p-4 font-mono text-sm text-slate-800 dark:text-slate-200 whitespace-pre-wrap break-words">
              {output || "Output will appear here..."}
            </pre>
          )}
        </div>
      </div>

      {children}
    </div>
  );
}
