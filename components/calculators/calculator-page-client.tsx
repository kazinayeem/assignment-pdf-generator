"use client";

import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import {
  Bookmark, Copy, RotateCcw, Share2, Check, History,
} from "lucide-react";
import toast from "react-hot-toast";
import type { CalculatorDefinition } from "@/lib/calculators/types";
import { runCalculation, getDefaultFields, formatCurrency } from "@/lib/calculators/engines";
import { getCategoryById } from "@/lib/calculators/categories";
import { useCalculatorsStore } from "@/lib/calculators-store";
import { CalculatorChart } from "./calculator-chart";
import { ToolsButton } from "@/components/tools/tools-button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export function CalculatorPageClient({ calculator }: { calculator: CalculatorDefinition }) {
  const fields = calculator.fields || getDefaultFields(calculator.engine);
  const defaults = useMemo(() => {
    const d: Record<string, number | string> = {};
    fields.forEach((f) => { d[f.name] = f.defaultValue; });
    return { ...d, ...calculator.defaults };
  }, [fields, calculator.defaults]);

  const { register, watch, reset, handleSubmit } = useForm({ defaultValues: defaults });
  const values = watch();
  const [copied, setCopied] = useState(false);
  const { toggleFavorite, isFavorite, addRecent, addHistory } = useCalculatorsStore();
  const category = getCategoryById(calculator.category);

  useEffect(() => {
    addRecent(calculator.slug);
  }, [calculator.slug, addRecent]);

  const result = useMemo(
    () => runCalculation(calculator.engine, values, calculator.currency),
    [calculator.engine, calculator.currency, values]
  );

  const onCopy = async () => {
    const text = result.primary.map((p) => `${p.label}: ${p.value}`).join("\n");
    await navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success("Copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  const onShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      await navigator.share({ title: calculator.title, url });
    } else {
      await navigator.clipboard.writeText(url);
      toast.success("Link copied");
    }
  };

  const onReset = () => reset(defaults);

  const onSaveHistory = () => {
    addHistory({
      slug: calculator.slug,
      title: calculator.title,
      inputs: values,
      result: result.primary.map((p) => `${p.label}: ${p.value}`).join(", "),
    });
    toast.success("Saved to history");
  };

  const exportPdf = async () => {
    const { default: jsPDF } = await import("jspdf");
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text(calculator.title, 14, 20);
    doc.setFontSize(11);
    doc.text(calculator.description, 14, 30);
    let y = 45;
    result.primary.forEach((p) => {
      doc.text(`${p.label}: ${p.value}`, 14, y);
      y += 8;
    });
    if (result.amortization?.length) {
      y += 10;
      doc.setFontSize(12);
      doc.text("Amortization (first 12 months)", 14, y);
      y += 8;
      doc.setFontSize(9);
      result.amortization.slice(0, 12).forEach((row) => {
        doc.text(`M${row.month}: EMI ${row.emi} | Prin ${row.principal} | Int ${row.interest}`, 14, y);
        y += 6;
      });
    }
    doc.save(`${calculator.slug}-result.pdf`);
    toast.success("PDF downloaded");
  };

  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex flex-wrap items-start justify-between gap-4 mb-8">
          <div>
            {category && (
              <span className="inline-flex items-center gap-1.5 text-sm font-semibold px-3 py-1 rounded-full bg-brand/10 text-brand mb-3">
                {category.emoji} {category.label}
              </span>
            )}
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {calculator.title}
            </h1>
            <p className="mt-2 text-base text-slate-500 dark:text-slate-400 max-w-2xl leading-relaxed">
              {calculator.description}
            </p>
          </div>
          <button
            onClick={() => toggleFavorite(calculator.slug)}
            aria-label="Toggle favorite"
            className="p-3 rounded-2xl border border-border dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/5 min-h-[44px] min-w-[44px]"
          >
            <Bookmark size={20} className={cn(isFavorite(calculator.slug) ? "fill-brand text-brand" : "text-slate-400")} />
          </button>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 lg:gap-8">
          {/* Input form */}
          <div className="glass-card p-5 sm:p-8">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Input Details</h2>
            <form className="space-y-5" onSubmit={handleSubmit(() => {})}>
              {fields.map((field) => (
                <div key={field.name}>
                  <label htmlFor={field.name} className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    {field.label}
                    {field.unit && <span className="text-slate-400 font-normal ml-1">({field.unit})</span>}
                  </label>
                  {field.type === "select" ? (
                    <select
                      id={field.name}
                      {...register(field.name)}
                      className="w-full rounded-xl border border-border dark:border-white/10 bg-white dark:bg-white/5 px-4 py-3 text-sm min-h-[44px] outline-none focus:border-brand/50 focus:ring-2 focus:ring-brand/20"
                    >
                      {field.options?.map((o) => (
                        <option key={o.value} value={o.value}>{o.label}</option>
                      ))}
                    </select>
                  ) : (
                    <Input
                      id={field.name}
                      type="number"
                      step={field.step ?? "any"}
                      min={field.min}
                      max={field.max}
                      {...register(field.name, { valueAsNumber: true })}
                      className="rounded-xl min-h-[44px] text-base"
                    />
                  )}
                </div>
              ))}
            </form>
          </div>

          {/* Live results */}
          <div className="space-y-6">
            <div className="glass-card p-5 sm:p-8">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Results</h2>
              <div className="grid gap-4">
                {result.primary.map((item, i) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.05 }}
                    className={cn(
                      "rounded-2xl p-4 sm:p-5",
                      item.highlight
                        ? "bg-gradient-to-br from-brand to-brand-secondary text-white shadow-lg shadow-brand/25"
                        : "bg-slate-50 dark:bg-white/5 border border-border dark:border-white/10"
                    )}
                  >
                    <p className={cn("text-sm font-medium mb-1", item.highlight ? "text-white/80" : "text-slate-500")}>
                      {item.label}
                    </p>
                    <p className={cn("text-xl sm:text-2xl font-extrabold", item.highlight ? "text-white" : "text-slate-900 dark:text-white")}>
                      {item.value}
                    </p>
                  </motion.div>
                ))}
              </div>
              {result.secondary && (
                <div className="mt-4 grid grid-cols-2 gap-3">
                  {result.secondary.map((s) => (
                    <div key={s.label} className="text-center p-3 rounded-xl bg-slate-50 dark:bg-white/5">
                      <p className="text-xs text-slate-500">{s.label}</p>
                      <p className="text-sm font-bold text-slate-800 dark:text-white">{s.value}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex flex-wrap gap-2">
              <ToolsButton variant="secondary" size="sm" onClick={onCopy}>
                {copied ? <Check size={16} /> : <Copy size={16} />} Copy
              </ToolsButton>
              <ToolsButton variant="secondary" size="sm" onClick={onReset}>
                <RotateCcw size={16} /> Reset
              </ToolsButton>
              <ToolsButton variant="secondary" size="sm" onClick={onShare}>
                <Share2 size={16} /> Share
              </ToolsButton>
              <ToolsButton variant="secondary" size="sm" onClick={onSaveHistory}>
                <History size={16} /> Save
              </ToolsButton>
              <ToolsButton variant="primary" size="sm" onClick={exportPdf}>
                Export PDF
              </ToolsButton>
            </div>

            <CalculatorChart result={result} />
          </div>
        </div>

        {/* Formula & steps */}
        {(result.steps?.length || calculator.formula) && (
          <div className="mt-8 glass-card p-5 sm:p-8">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">How It&apos;s Calculated</h2>
            {calculator.formula && (
              <p className="text-sm font-mono bg-slate-900 text-slate-200 rounded-xl p-4 mb-4">{calculator.formula}</p>
            )}
            <ol className="space-y-2">
              {(result.steps || []).map((step, i) => (
                <li key={i} className="text-sm text-slate-600 dark:text-slate-400 flex gap-3">
                  <span className="w-6 h-6 rounded-lg bg-brand/10 text-brand text-xs font-bold flex items-center justify-center shrink-0">
                    {i + 1}
                  </span>
                  {step}
                </li>
              ))}
            </ol>
          </div>
        )}

        {/* Amortization table */}
        {result.amortization && result.amortization.length > 0 && (
          <div className="mt-8 glass-card p-5 sm:p-8 overflow-x-auto">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Amortization Schedule</h2>
            <table className="w-full text-sm min-w-[500px]">
              <thead>
                <tr className="border-b border-border dark:border-white/10 text-left text-slate-500">
                  <th className="py-3 pr-4">Month</th>
                  <th className="py-3 pr-4">EMI</th>
                  <th className="py-3 pr-4">Principal</th>
                  <th className="py-3 pr-4">Interest</th>
                  <th className="py-3">Balance</th>
                </tr>
              </thead>
              <tbody>
                {result.amortization.slice(0, 24).map((row) => (
                  <tr key={row.month} className="border-b border-border/50 dark:border-white/5">
                    <td className="py-2.5 pr-4 font-medium">{row.month}</td>
                    <td className="py-2.5 pr-4">{formatCurrency(row.emi, calculator.currency)}</td>
                    <td className="py-2.5 pr-4">{formatCurrency(row.principal, calculator.currency)}</td>
                    <td className="py-2.5 pr-4">{formatCurrency(row.interest, calculator.currency)}</td>
                    <td className="py-2.5">{formatCurrency(row.balance, calculator.currency)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {result.amortization.length > 24 && (
              <p className="text-xs text-slate-400 mt-3">Showing first 24 of {result.amortization.length} months. Export PDF for full schedule.</p>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
}
