"use client";

import dynamic from "next/dynamic";
import { useMemo } from "react";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import type { CalculationResult } from "@/lib/calculators/types";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const Bar = dynamic(() => import("react-chartjs-2").then((mod) => mod.Bar), {
  ssr: false,
  loading: () => <div className="h-48 rounded-2xl bg-slate-100 dark:bg-white/5 animate-pulse" aria-hidden="true" />,
});

export function CalculatorChart({ result }: { result: CalculationResult }) {
  const chart = result.chart;
  const data = useMemo(() => {
    if (!chart) return null;
    return {
      labels: chart.labels,
      datasets: [
        {
          label: "Principal",
          data: chart.principal,
          backgroundColor: "rgba(109, 93, 246, 0.7)",
          borderRadius: 6,
        },
        {
          label: "Interest",
          data: chart.interest,
          backgroundColor: "rgba(6, 182, 212, 0.7)",
          borderRadius: 6,
        },
      ],
    };
  }, [chart]);

  if (!data) return null;

  return (
    <div className="glass-card p-4 sm:p-6">
      <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4">Payment Breakdown</h3>
      <div className="h-48 sm:h-56" role="img" aria-label="Payment breakdown chart">
        <Bar
          data={data}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { position: "bottom" as const, labels: { color: "#64748b" } } },
            scales: {
              x: { grid: { display: false }, ticks: { color: "#64748b" } },
              y: { grid: { color: "rgba(0,0,0,0.05)" }, ticks: { color: "#64748b" } },
            },
          }}
        />
      </div>
    </div>
  );
}
