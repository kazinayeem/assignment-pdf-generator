"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Bookmark, Share2 } from "lucide-react";
import toast from "react-hot-toast";
import type { DevToolDefinition } from "@/lib/devtools/types";
import { getDevToolCategory } from "@/lib/devtools/categories";
import { getSampleInput, runAsyncTool, runToolTransform } from "@/lib/devtools/engines";
import { useDevToolsStore } from "@/lib/devtools-store";
import { ToolShell } from "./tool-shell";
import { FlexboxPlayground } from "./flexbox-playground";
import { GridPlayground } from "./grid-playground";
import { QrGenerator } from "./qr-generator";
import { ImageTool } from "./image-tool";
import { ToolsButton } from "@/components/tools/tools-button";
import { ToolsBadge } from "@/components/tools/tools-badge";
import dynamic from "next/dynamic";

const JsonTree = dynamic(() => import("./json-tree-viewer").then((m) => m.JsonTreeViewer), {
  ssr: false,
  loading: () => <div className="h-48 animate-pulse rounded-xl bg-slate-100 dark:bg-white/5" />,
});

export function DevToolPageClient({ tool }: { tool: DevToolDefinition }) {
  const sample = getSampleInput(tool);
  const [input, setInput] = useState(sample);
  const [inputB, setInputB] = useState("{}");
  const [output, setOutput] = useState("");
  const [error, setError] = useState<string | undefined>();
  const [options, setOptions] = useState<Record<string, string | number | boolean>>({});
  const { toggleFavorite, isFavorite, addRecent, incrementUsage } = useDevToolsStore();
  const category = getDevToolCategory(tool.category);
  const fav = isFavorite(tool.slug);

  useEffect(() => {
    addRecent(tool.slug);
    incrementUsage(tool.slug);
  }, [tool.slug, addRecent, incrementUsage]);

  const encodingType = useMemo(() => {
    if (tool.engine !== "encoding") return "base64";
    if (tool.slug.includes("url")) return "url";
    if (tool.slug.includes("html")) return "html";
    if (tool.slug.includes("unicode")) return "unicode";
    if (tool.slug.includes("ascii")) return "ascii";
    if (tool.slug.includes("binary")) return "binary";
    if (tool.slug.includes("hex")) return "hex";
    return "base64";
  }, [tool]);

  const process = useCallback(async () => {
    if (tool.ui === "playground" || tool.ui === "media" || tool.engine === "qr" || tool.engine === "barcode") return;

    const opts: Record<string, string | number | boolean> = { ...options, type: encodingType };
    if (tool.engine === "hash") opts.algo = String(options.algo ?? "SHA-256");
    if (tool.engine === "random" && tool.slug.includes("number")) opts.type = "number";
    if (tool.engine === "timestamp") opts.mode = tool.slug.includes("unix") ? "unix-to-date" : "date-to-unix";

    const result = tool.engine === "hash"
      ? await runAsyncTool(tool.engine, tool.operation, { input, inputB, options: opts })
      : runToolTransform(tool.engine, tool.operation, { input, inputB, options: opts });

    setOutput(result.output);
    setError(result.error);
  }, [tool, input, inputB, options, encodingType]);

  useEffect(() => {
    if (tool.ui === "playground" || tool.ui === "media" || tool.engine === "qr") return;
    if (tool.engine === "uuid" || tool.engine === "nanoid" || tool.engine === "lorem" || (tool.engine === "password" && tool.operation === "generate")) {
      process();
      return;
    }
    const t = setTimeout(() => { process(); }, 300);
    return () => clearTimeout(t);
  }, [input, inputB, options, tool, process]);

  const onReset = () => {
    setInput(sample);
    setInputB("{}");
    setOptions({});
    setError(undefined);
  };

  const onShare = async () => {
    const url = window.location.href;
    if (navigator.share) await navigator.share({ title: tool.title, url });
    else { await navigator.clipboard.writeText(url); toast.success("Link copied"); }
  };

  const renderBody = () => {
    if (tool.engine === "flexbox") return <FlexboxPlayground />;
    if (tool.engine === "grid") return <GridPlayground />;
    if (tool.engine === "qr" || tool.engine === "barcode") return <QrGenerator />;
    if (tool.engine === "image") {
      const mode = tool.operation === "metadata" ? "metadata" : tool.operation === "resize" ? "resize" : tool.operation === "convert" ? "convert" : "compress";
      return <ImageTool mode={mode} />;
    }

    const toolbar = (
      <div className="flex flex-wrap gap-2 items-center">
        {tool.engine === "hash" && (
          <select
            value={String(options.algo ?? "SHA-256")}
            onChange={(e) => setOptions((o) => ({ ...o, algo: e.target.value }))}
            className="rounded-lg border px-3 py-2 text-sm min-h-[44px] dark:bg-white/5"
          >
            <option value="SHA-256">SHA-256</option>
            <option value="SHA-384">SHA-384</option>
            <option value="SHA-512">SHA-512</option>
          </select>
        )}
        {tool.engine === "css" && tool.operation === "gradient" && (
          <>
            <input type="color" value={String(options.color1 ?? "#6D5DF6")} onChange={(e) => setOptions((o) => ({ ...o, color1: e.target.value }))} className="w-11 h-11 rounded-lg cursor-pointer" aria-label="Color 1" />
            <input type="color" value={String(options.color2 ?? "#06B6D4")} onChange={(e) => setOptions((o) => ({ ...o, color2: e.target.value }))} className="w-11 h-11 rounded-lg cursor-pointer" aria-label="Color 2" />
          </>
        )}
        {tool.engine === "csv" && tool.operation === "filter" && (
          <input
            placeholder="Filter query..."
            value={String(options.query ?? "")}
            onChange={(e) => setOptions((o) => ({ ...o, query: e.target.value }))}
            className="rounded-lg border px-3 py-2 text-sm min-h-[44px] dark:bg-white/5 flex-1 min-w-[200px]"
          />
        )}
        {(tool.engine === "uuid" || tool.engine === "nanoid" || tool.engine === "password" && tool.operation === "generate" || tool.engine === "lorem") && (
          <ToolsButton size="sm" onClick={() => process()}>Regenerate</ToolsButton>
        )}
      </div>
    );

    return (
      <>
        <ToolShell
          input={input}
          output={output}
          error={error}
          onInputChange={setInput}
          inputB={inputB}
          onInputBChange={setInputB}
          showSecondInput={tool.ui === "compare"}
          inputLabel={tool.inputLabel}
          outputLabel={tool.outputLabel}
          inputPlaceholder={tool.inputPlaceholder}
          acceptsFile={tool.acceptsFile}
          fileTypes={tool.fileTypes}
          onReset={onReset}
          toolbar={toolbar}
        />
        {tool.operation === "tree" && !error && input && (
          <div className="glass-card p-4 mt-4">
            <h3 className="text-sm font-bold mb-3 text-slate-900 dark:text-white">Tree View</h3>
            <JsonTree data={input} />
          </div>
        )}
        {tool.engine === "color" && tool.operation === "picker" && (
          <div className="glass-card p-4 flex flex-wrap gap-4 items-center">
            <input type="color" value={input.startsWith("#") ? input : "#6D5DF6"} onChange={(e) => setInput(e.target.value)} className="w-20 h-20 rounded-xl cursor-pointer" aria-label="Pick color" />
            <p className="text-sm text-slate-500">Select a color — output updates automatically.</p>
          </div>
        )}
      </>
    );
  };

  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8">
          <div>
            {category && (
              <ToolsBadge variant="Intermediate">{category.emoji} {category.label}</ToolsBadge>
            )}
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-2 tracking-tight">
              {tool.title}
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-2 max-w-2xl">{tool.description}</p>
          </div>
          <div className="flex gap-2 shrink-0">
            <ToolsButton size="sm" variant="secondary" onClick={() => toggleFavorite(tool.slug)} className="min-h-[44px]">
              <Bookmark size={16} className={fav ? "fill-[#6D5DF6] text-[#6D5DF6]" : ""} aria-hidden />
              {fav ? "Saved" : "Favorite"}
            </ToolsButton>
            <ToolsButton size="sm" variant="secondary" onClick={onShare} className="min-h-[44px]">
              <Share2 size={16} aria-hidden /> Share
            </ToolsButton>
          </div>
        </div>

        {renderBody()}
      </motion.div>
    </div>
  );
}
