"use client";

import { useCallback, useState } from "react";
import toast from "react-hot-toast";
import { ToolsButton } from "@/components/tools/tools-button";

export function ImageTool({ mode }: { mode: "compress" | "resize" | "convert" | "metadata" }) {
  const [preview, setPreview] = useState<string | null>(null);
  const [info, setInfo] = useState("");
  const [width, setWidth] = useState(800);
  const [quality, setQuality] = useState(0.8);
  const [format, setFormat] = useState<"image/jpeg" | "image/png" | "image/webp">("image/jpeg");

  const processFile = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const w = mode === "resize" ? width : img.width;
        const h = mode === "resize" ? Math.round((width / img.width) * img.height) : img.height;
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        ctx.drawImage(img, 0, 0, w, h);
        const mime = mode === "convert" || mode === "compress" ? format : file.type;
        const q = mode === "compress" ? quality : 0.92;
        setPreview(canvas.toDataURL(mime, q));
        setInfo(`Original: ${img.width}×${img.height} · ${(file.size / 1024).toFixed(1)} KB`);
        if (mode === "metadata") {
          setInfo(JSON.stringify({
            name: file.name,
            type: file.type,
            size: file.size,
            width: img.width,
            height: img.height,
            lastModified: new Date(file.lastModified).toISOString(),
          }, null, 2));
        }
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  }, [mode, width, quality, format]);

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file?.type.startsWith("image/")) processFile(file);
  };

  const download = () => {
    if (!preview) return;
    const a = document.createElement("a");
    a.href = preview;
    a.download = `image.${format.split("/")[1]}`;
    a.click();
    toast.success("Downloaded");
  };

  return (
    <div className="space-y-4">
      {(mode === "resize" || mode === "compress" || mode === "convert") && (
        <div className="flex flex-wrap gap-4 glass-card p-4">
          {mode === "resize" && (
            <div>
              <label className="text-xs font-bold text-slate-500">Width ({width}px)</label>
              <input type="range" min={100} max={2000} value={width} onChange={(e) => setWidth(Number(e.target.value))} className="w-48 block mt-1" />
            </div>
          )}
          {mode === "compress" && (
            <div>
              <label className="text-xs font-bold text-slate-500">Quality ({Math.round(quality * 100)}%)</label>
              <input type="range" min={0.1} max={1} step={0.05} value={quality} onChange={(e) => setQuality(Number(e.target.value))} className="w-48 block mt-1" />
            </div>
          )}
          {mode === "convert" && (
            <select value={format} onChange={(e) => setFormat(e.target.value as typeof format)} className="rounded-lg border px-3 py-2 min-h-[44px] dark:bg-white/5">
              <option value="image/jpeg">JPEG</option>
              <option value="image/png">PNG</option>
              <option value="image/webp">WEBP</option>
            </select>
          )}
        </div>
      )}

      <div
        className="glass-card p-8 border-2 border-dashed border-slate-200 dark:border-white/10 text-center min-h-[200px] flex flex-col items-center justify-center gap-4"
        onDragOver={(e) => e.preventDefault()}
        onDrop={onDrop}
      >
        <input type="file" accept="image/*" className="hidden" id="img-upload" onChange={(e) => e.target.files?.[0] && processFile(e.target.files[0])} />
        <label htmlFor="img-upload" className="cursor-pointer text-[#6D5DF6] font-semibold min-h-[44px] flex items-center">
          Drop image here or click to upload
        </label>
        {preview && mode !== "metadata" && (
          <img src={preview} alt="Processed preview" className="max-w-full max-h-64 rounded-xl" />
        )}
        {info && mode === "metadata" && (
          <pre className="text-left text-sm font-mono w-full overflow-auto p-4 bg-slate-50 dark:bg-black/20 rounded-xl">{info}</pre>
        )}
        {info && mode !== "metadata" && <p className="text-sm text-slate-500">{info}</p>}
      </div>

      {preview && mode !== "metadata" && (
        <ToolsButton onClick={download} className="min-h-[44px]">Download Image</ToolsButton>
      )}
    </div>
  );
}
