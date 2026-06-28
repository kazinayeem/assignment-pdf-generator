"use client";

import { useMemo, useState } from "react";
import { DollarSign } from "lucide-react";
import { CareerPageHeader } from "./career-page-header";
import { calculateSalary, type SalaryCountry } from "@/lib/career/salary";

const COUNTRIES: { id: SalaryCountry; label: string }[] = [
  { id: "BD", label: "Bangladesh" },
  { id: "US", label: "USA" },
  { id: "CA", label: "Canada" },
  { id: "UK", label: "UK" },
  { id: "AU", label: "Australia" },
  { id: "DE", label: "Germany" },
];

export function SalaryCalculatorClient() {
  const [amount, setAmount] = useState(50000);
  const [country, setCountry] = useState<SalaryCountry>("US");
  const [period, setPeriod] = useState<"monthly" | "annual" | "hourly">("annual");
  const [hoursPerWeek, setHoursPerWeek] = useState(40);
  const [overtimeHours, setOvertimeHours] = useState(0);

  const result = useMemo(
    () => calculateSalary({ amount, country, period, hoursPerWeek, overtimeHours }),
    [amount, country, period, hoursPerWeek, overtimeHours]
  );

  return (
    <div>
      <CareerPageHeader title="Salary Calculator" description="Calculate monthly, annual, and hourly salary with tax estimation for 6 countries." icon={DollarSign} badge="6 Countries" />
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="glass-card p-5 space-y-4">
            <div>
              <label className="text-xs font-bold uppercase text-slate-500 mb-2 block">Country</label>
              <select value={country} onChange={(e) => setCountry(e.target.value as SalaryCountry)} className="w-full rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 p-3 text-sm min-h-[44px] outline-none focus:border-brand/50">
                {COUNTRIES.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-bold uppercase text-slate-500 mb-2 block">Period</label>
              <div className="flex flex-wrap gap-2">
                {(["annual", "monthly", "hourly"] as const).map((p) => (
                  <button key={p} type="button" onClick={() => setPeriod(p)} className={`px-4 py-2 rounded-xl text-sm font-medium capitalize min-h-[44px] ${period === p ? "gradient-primary text-white" : "bg-slate-100 dark:bg-white/5"}`}>{p}</button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-xs font-bold uppercase text-slate-500 mb-2 block">Amount ({result.currency})</label>
              <input type="number" value={amount} onChange={(e) => setAmount(Number(e.target.value))} className="w-full rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 p-3 text-sm min-h-[44px] outline-none focus:border-brand/50" />
            </div>
            {period === "hourly" && (
              <>
                <div>
                  <label className="text-xs font-bold uppercase text-slate-500 mb-2 block">Hours per Week</label>
                  <input type="number" value={hoursPerWeek} onChange={(e) => setHoursPerWeek(Number(e.target.value))} className="w-full rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 p-3 text-sm min-h-[44px] outline-none focus:border-brand/50" />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase text-slate-500 mb-2 block">Overtime Hours / Week</label>
                  <input type="number" value={overtimeHours} onChange={(e) => setOvertimeHours(Number(e.target.value))} className="w-full rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 p-3 text-sm min-h-[44px] outline-none focus:border-brand/50" />
                </div>
              </>
            )}
          </div>

          <div className="glass-card p-6">
            <h3 className="font-bold text-lg mb-4">Salary Breakdown</h3>
            <div className="space-y-3">
              {result.breakdown.map((row) => (
                <div key={row.label} className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-white/5 last:border-0">
                  <span className="text-sm text-slate-500">{row.label}</span>
                  <span className="text-sm font-bold text-slate-800 dark:text-slate-100 tabular-nums">{row.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
