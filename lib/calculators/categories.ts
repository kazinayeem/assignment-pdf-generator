import type { CalculatorCategory } from "./types";

export const CALCULATOR_CATEGORIES: CalculatorCategory[] = [
  { id: "banking", label: "Banking", emoji: "🏦", description: "EMI, loans, mortgages, and banking tools" },
  { id: "loans", label: "Loans", emoji: "💰", description: "Personal, home, car, and education loans" },
  { id: "investments", label: "Investments", emoji: "📈", description: "SIP, mutual funds, ROI, and compound growth" },
  { id: "savings", label: "Savings", emoji: "💵", description: "Goals, emergency funds, and retirement planning" },
  { id: "real-estate", label: "Real Estate", emoji: "🏠", description: "Mortgage, affordability, and property tools" },
  { id: "tax", label: "Tax", emoji: "📊", description: "Income tax, VAT, and capital gains" },
  { id: "credit-cards", label: "Credit Cards", emoji: "💳", description: "Interest and payoff calculators" },
  { id: "salary", label: "Salary", emoji: "💼", description: "Take-home pay, overtime, and bonuses" },
  { id: "business", label: "Business", emoji: "🧾", description: "Profit, markup, GST, and cash flow" },
  { id: "currency", label: "Currency", emoji: "🌍", description: "Currency conversion tools" },
  { id: "general", label: "General", emoji: "📐", description: "Percentage, BMI, age, and utilities" },
  { id: "student", label: "Student", emoji: "🎓", description: "Education loans and student finance" },
  { id: "bangladesh", label: "Bangladesh", emoji: "🇧🇩", description: "Bangladesh bank EMIs, FDR, DPS, and tax" },
];

export function getCategoryById(id: string) {
  return CALCULATOR_CATEGORIES.find((c) => c.id === id);
}
