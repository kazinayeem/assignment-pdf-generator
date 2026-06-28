export const toolsColors = {
  primary: "#6D5DF6",
  secondary: "#8B5CF6",
  accent: "#3B82F6",
  success: "#22C55E",
  warning: "#F59E0B",
  danger: "#EF4444",
  background: "#F8FAFC",
  surface: "#FFFFFF",
  darkSurface: "#0F172A",
  border: "#E5E7EB",
} as const;

export type Difficulty = "Beginner" | "Intermediate" | "Advanced";

export const difficultyStyles: Record<Difficulty, string> = {
  Beginner: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20",
  Intermediate: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20",
  Advanced: "bg-violet-50 text-violet-700 border-violet-200 dark:bg-violet-500/10 dark:text-violet-400 dark:border-violet-500/20",
};

export type AccentKey = "indigo" | "emerald" | "cyan" | "violet" | "blue" | "green" | "orange" | "red" | "amber" | "pink" | "teal" | "yellow";

export const accentStyles: Record<AccentKey, { from: string; to: string; text: string; bg: string; ring: string; gradient: string }> = {
  indigo: { from: "from-[#6D5DF6]", to: "to-[#8B5CF6]", text: "text-[#6D5DF6]", bg: "bg-[#6D5DF6]/8", ring: "ring-[#6D5DF6]/20", gradient: "from-[#6D5DF6] to-[#8B5CF6]" },
  emerald: { from: "from-emerald-500", to: "to-teal-600", text: "text-emerald-600", bg: "bg-emerald-50", ring: "ring-emerald-200", gradient: "from-emerald-500 to-teal-600" },
  cyan: { from: "from-cyan-500", to: "to-[#3B82F6]", text: "text-cyan-600", bg: "bg-cyan-50", ring: "ring-cyan-200", gradient: "from-cyan-500 to-blue-600" },
  violet: { from: "from-violet-500", to: "to-purple-600", text: "text-violet-600", bg: "bg-violet-50", ring: "ring-violet-200", gradient: "from-violet-500 to-purple-600" },
  blue: { from: "from-blue-500", to: "to-cyan-500", text: "text-blue-600", bg: "bg-blue-50", ring: "ring-blue-200", gradient: "from-blue-500 to-cyan-500" },
  green: { from: "from-green-500", to: "to-emerald-500", text: "text-green-600", bg: "bg-green-50", ring: "ring-green-200", gradient: "from-green-500 to-emerald-500" },
  orange: { from: "from-orange-500", to: "to-amber-600", text: "text-orange-600", bg: "bg-orange-50", ring: "ring-orange-200", gradient: "from-orange-500 to-amber-600" },
  red: { from: "from-red-500", to: "to-rose-600", text: "text-red-600", bg: "bg-red-50", ring: "ring-red-200", gradient: "from-red-500 to-rose-600" },
  amber: { from: "from-amber-500", to: "to-orange-600", text: "text-amber-600", bg: "bg-amber-50", ring: "ring-amber-200", gradient: "from-amber-500 to-orange-600" },
  pink: { from: "from-pink-500", to: "to-rose-600", text: "text-pink-600", bg: "bg-pink-50", ring: "ring-pink-200", gradient: "from-pink-500 to-rose-600" },
  teal: { from: "from-teal-500", to: "to-emerald-600", text: "text-teal-600", bg: "bg-teal-50", ring: "ring-teal-200", gradient: "from-teal-500 to-emerald-600" },
  yellow: { from: "from-yellow-500", to: "to-orange-600", text: "text-yellow-600", bg: "bg-yellow-50", ring: "ring-yellow-200", gradient: "from-yellow-500 to-orange-600" },
};
