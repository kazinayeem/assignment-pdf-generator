export type SalaryCountry = "BD" | "US" | "CA" | "UK" | "AU" | "DE";

export type SalaryInput = {
  amount: number;
  country: SalaryCountry;
  period: "monthly" | "annual" | "hourly";
  hoursPerWeek?: number;
  overtimeHours?: number;
  overtimeRate?: number;
};

export type SalaryResult = {
  monthly: number;
  annual: number;
  hourly: number;
  estimatedTax: number;
  takeHomeAnnual: number;
  takeHomeMonthly: number;
  currency: string;
  breakdown: { label: string; value: string }[];
};

const TAX_RATES: Record<SalaryCountry, number> = {
  BD: 0.10,
  US: 0.22,
  CA: 0.25,
  UK: 0.20,
  AU: 0.23,
  DE: 0.30,
};

const CURRENCIES: Record<SalaryCountry, string> = {
  BD: "BDT",
  US: "USD",
  CA: "CAD",
  UK: "GBP",
  AU: "AUD",
  DE: "EUR",
};

const SYMBOLS: Record<SalaryCountry, string> = {
  BD: "৳",
  US: "$",
  CA: "C$",
  UK: "£",
  AU: "A$",
  DE: "€",
};

function fmt(n: number, country: SalaryCountry) {
  return `${SYMBOLS[country]}${Math.round(n).toLocaleString()}`;
}

export function calculateSalary(input: SalaryInput): SalaryResult {
  const { amount, country, period, hoursPerWeek = 40, overtimeHours = 0, overtimeRate = 1.5 } = input;
  const taxRate = TAX_RATES[country];

  let annual: number;
  let monthly: number;
  let hourly: number;

  if (period === "annual") {
    annual = amount;
    monthly = annual / 12;
    hourly = annual / (52 * hoursPerWeek);
  } else if (period === "monthly") {
    monthly = amount;
    annual = monthly * 12;
    hourly = annual / (52 * hoursPerWeek);
  } else {
    hourly = amount;
    annual = hourly * hoursPerWeek * 52 + hourly * overtimeRate * overtimeHours * 52;
    monthly = annual / 12;
  }

  const overtimePay = period === "hourly" ? hourly * overtimeRate * overtimeHours * 52 : 0;
  const estimatedTax = annual * taxRate;
  const takeHomeAnnual = annual - estimatedTax;
  const takeHomeMonthly = takeHomeAnnual / 12;

  return {
    monthly,
    annual,
    hourly,
    estimatedTax,
    takeHomeAnnual,
    takeHomeMonthly,
    currency: CURRENCIES[country],
    breakdown: [
      { label: "Gross Annual", value: fmt(annual, country) },
      { label: "Gross Monthly", value: fmt(monthly, country) },
      { label: "Hourly Rate", value: fmt(hourly, country) },
      ...(overtimePay > 0 ? [{ label: "Overtime (annual)", value: fmt(overtimePay, country) }] : []),
      { label: `Est. Tax (${taxRate * 100}%)`, value: fmt(estimatedTax, country) },
      { label: "Take-home Annual", value: fmt(takeHomeAnnual, country) },
      { label: "Take-home Monthly", value: fmt(takeHomeMonthly, country) },
    ],
  };
}
