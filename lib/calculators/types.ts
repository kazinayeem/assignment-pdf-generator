import type { LucideIcon } from "lucide-react";

export type CalculatorCategoryId =
  | "banking"
  | "loans"
  | "investments"
  | "savings"
  | "real-estate"
  | "tax"
  | "credit-cards"
  | "salary"
  | "business"
  | "currency"
  | "general"
  | "student"
  | "bangladesh";

export type CalculatorEngine =
  | "emi"
  | "emi-flat"
  | "emi-prepayment"
  | "emi-part-payment"
  | "emi-tenure"
  | "loan-eligibility"
  | "loan-affordability"
  | "loan-comparison"
  | "outstanding-loan"
  | "fd"
  | "rd"
  | "sip"
  | "compound"
  | "simple"
  | "future-value"
  | "present-value"
  | "inflation"
  | "roi"
  | "mutual-fund"
  | "dividend"
  | "savings-goal"
  | "emergency-fund"
  | "retirement"
  | "income-tax"
  | "income-tax-bd"
  | "vat"
  | "sales-tax"
  | "capital-gains"
  | "corporate-tax"
  | "payroll-tax"
  | "salary"
  | "take-home"
  | "overtime"
  | "hourly-wage"
  | "annual-income"
  | "bonus"
  | "profit-margin"
  | "break-even"
  | "markup"
  | "discount"
  | "gst"
  | "cash-flow"
  | "inventory-turnover"
  | "percentage"
  | "percentage-change"
  | "average"
  | "age"
  | "date-diff"
  | "bmi"
  | "fuel"
  | "electricity"
  | "currency";

export type FieldType = "number" | "select" | "date";

export type CalculatorField = {
  name: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  unit?: string;
  min?: number;
  max?: number;
  step?: number;
  defaultValue: number | string;
  options?: { label: string; value: string }[];
};

export type CalculatorDefinition = {
  slug: string;
  title: string;
  description: string;
  category: CalculatorCategoryId;
  engine: CalculatorEngine;
  icon: string;
  popular?: boolean;
  featured?: boolean;
  fields?: CalculatorField[];
  defaults?: Record<string, number | string>;
  formula?: string;
  steps?: string[];
  currency?: "BDT" | "USD" | "INR";
};

export type CalculatorCategory = {
  id: CalculatorCategoryId;
  label: string;
  emoji: string;
  description: string;
};

export type CalculationResult = {
  primary: { label: string; value: number | string; highlight?: boolean }[];
  secondary?: { label: string; value: number | string }[];
  chart?: { labels: string[]; principal: number[]; interest: number[] };
  amortization?: { month: number; emi: number; principal: number; interest: number; balance: number }[];
  steps?: string[];
};

export type CategoryMeta = CalculatorCategory & { icon?: LucideIcon };
