"use client";

import { useEffect, useRef, useState } from "react";
import { Download } from "lucide-react";
import toast from "react-hot-toast";
import { ToolsButton } from "@/components/tools/tools-button";

const QR_TYPES = ["text", "url", "email", "phone", "wifi", "vcard"] as const;

export function QrGenerator() {
  const [type, setType] = useState<(typeof QR_TYPES)[number]>("url");
  const [value, setValue] = useState("https://campusflow.app");
  const [size, setSize] = useState(256);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let cancelled = false;
    const text = (() => {
      switch (type) {
        case "url": return value.startsWith("http") ? value : `https://${value}`;
        case "email": return `mailto:${value}`;
        case "phone": return `tel:${value}`;
        case "wifi": return `WIFI:T:WPA;S:${value.split(",")[0] || "Network"};P:${value.split(",")[1] || "password"};;`;
        case "vcard": return `BEGIN:VCARD\nVERSION:3.0\nFN:${value}\nEND:VCARD`;
        default: return value;
      }
    })();
    (async () => {
      try {
        const QRCode = (await import("qrcode")).default;
        if (canvasRef.current && !cancelled) {
          await QRCode.toCanvas(canvasRef.current, text, { width: size, margin: 2 });
        }
      } catch { /* empty */ }
    })();
    return () => { cancelled = true; };
  }, [type, value, size]);

  const downloadPng = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const a = document.createElement("a");
    a.download = "qrcode.png";
    a.href = canvas.toDataURL("image/png");
    a.click();
    toast.success("Downloaded PNG");
  };

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      <div className="glass-card p-5 space-y-4">
        <div>
          <label className="text-xs font-bold text-slate-500 mb-1 block">QR Type</label>
          <select value={type} onChange={(e) => setType(e.target.value as typeof type)} className="w-full rounded-xl border px-3 py-2.5 min-h-[44px] dark:bg-white/5">
            {QR_TYPES.map((t) => <option key={t} value={t}>{t.toUpperCase()}</option>)}
          </select>
        </div>
        <div>
          <label className="text-xs font-bold text-slate-500 mb-1 block">Content</label>
          <textarea
            value={value}
            onChange={(e) => setValue(e.target.value)}
            rows={4}
            className="w-full rounded-xl border px-4 py-3 font-mono text-sm dark:bg-white/5 min-h-[100px]"
            placeholder={type === "wifi" ? "SSID,password" : "Enter content..."}
          />
        </div>
        <div>
          <label className="text-xs font-bold text-slate-500">Size ({size}px)</label>
          <input type="range" min={128} max={512} step={32} value={size} onChange={(e) => setSize(Number(e.target.value))} className="w-full mt-2" />
        </div>
      </div>
      <div className="glass-card p-5 flex flex-col items-center justify-center gap-4">
        <canvas ref={canvasRef} className="rounded-xl border border-slate-200 dark:border-white/10" aria-label="QR code preview" />
        <ToolsButton onClick={downloadPng} className="min-h-[44px]">
          <Download size={16} aria-hidden /> Download PNG
        </ToolsButton>
      </div>
    </div>
  );
}
