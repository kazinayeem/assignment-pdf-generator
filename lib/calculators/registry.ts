import type { CalculatorCategoryId, CalculatorDefinition, CalculatorEngine } from "./types";

type CalcInput = {
  slug: string;
  title: string;
  description: string;
  category: CalculatorCategoryId;
  engine: CalculatorEngine;
  icon?: string;
  popular?: boolean;
  featured?: boolean;
};

function c(d: CalcInput): CalculatorDefinition {
  return { icon: "Calculator", currency: "BDT", ...d };
}

function emiGroup(
  items: { slug: string; title: string; desc: string }[],
  category: CalculatorCategoryId,
  extra?: Partial<CalcInput>
): CalculatorDefinition[] {
  return items.map((i) =>
    c({ slug: i.slug, title: i.title, description: i.desc, category, engine: "emi", ...extra })
  );
}

const BANKING_EMI = emiGroup(
  [
    { slug: "emi-calculator", title: "EMI Calculator", desc: "Calculate monthly EMI for any loan with reducing balance." },
    { slug: "loan-emi-calculator", title: "Loan EMI Calculator", desc: "Estimate loan EMI, total interest, and schedule." },
    { slug: "home-loan-emi", title: "Home Loan EMI", desc: "Plan home loan EMI with full amortization." },
    { slug: "personal-loan-emi", title: "Personal Loan EMI", desc: "Personal loan monthly installment calculator." },
    { slug: "car-loan-emi", title: "Car Loan EMI", desc: "Car loan EMI before you buy." },
    { slug: "education-loan-emi", title: "Education Loan EMI", desc: "Education loan repayment planner." },
    { slug: "business-loan-emi", title: "Business Loan EMI", desc: "Business loan EMI estimator." },
    { slug: "gold-loan-emi", title: "Gold Loan EMI", desc: "Gold loan monthly payment calculator." },
    { slug: "mortgage-calculator", title: "Mortgage Calculator", desc: "Mortgage EMI with principal and interest." },
    { slug: "monthly-installment", title: "Monthly Installment Calculator", desc: "Quick monthly installment estimator." },
  ],
  "banking",
  { popular: true }
);

const BANKING_EXTRA: CalculatorDefinition[] = [
  c({ slug: "loan-eligibility", title: "Loan Eligibility Calculator", description: "How much loan you qualify for.", category: "banking", engine: "loan-eligibility", popular: true }),
  c({ slug: "interest-rate-calculator", title: "Interest Rate Calculator", description: "Effective loan interest breakdown.", category: "banking", engine: "emi" }),
  c({ slug: "loan-affordability", title: "Loan Affordability Calculator", description: "Loan that fits your budget.", category: "banking", engine: "loan-affordability" }),
  c({ slug: "outstanding-loan", title: "Outstanding Loan Calculator", description: "Remaining balance after payments.", category: "banking", engine: "outstanding-loan" }),
  c({ slug: "reducing-balance-emi", title: "Reducing Balance EMI", description: "Reducing balance interest EMI.", category: "banking", engine: "emi", featured: true }),
  c({ slug: "flat-interest-emi", title: "Flat Interest EMI", description: "Flat rate interest EMI.", category: "banking", engine: "emi-flat" }),
  c({ slug: "loan-comparison", title: "Loan Comparison", description: "Compare two loan offers.", category: "loans", engine: "loan-comparison", popular: true }),
  c({ slug: "prepayment-calculator", title: "Prepayment Calculator", description: "Interest saved with prepayment.", category: "loans", engine: "emi-prepayment", featured: true }),
  c({ slug: "part-payment-calculator", title: "Part Payment Calculator", description: "Impact of partial payments.", category: "loans", engine: "emi-part-payment" }),
  c({ slug: "loan-tenure-calculator", title: "Loan Tenure Calculator", description: "Optimal tenure for your EMI.", category: "loans", engine: "emi-tenure" }),
];

const FD_CALCS: CalculatorDefinition[] = [
  c({ slug: "fixed-deposit", title: "Fixed Deposit Calculator", description: "FD maturity with compound interest.", category: "banking", engine: "fd", popular: true, featured: true }),
  c({ slug: "bank-fd", title: "Bank FD Calculator", description: "Bank FD returns calculator.", category: "banking", engine: "fd" }),
  c({ slug: "monthly-interest-fd", title: "Monthly Interest FD", description: "Monthly interest payout FD.", category: "banking", engine: "fd" }),
  c({ slug: "quarterly-interest-fd", title: "Quarterly Interest FD", description: "Quarterly compounding FD.", category: "banking", engine: "fd" }),
  c({ slug: "yearly-interest-fd", title: "Yearly Interest FD", description: "Annual compounding FD.", category: "banking", engine: "fd" }),
  c({ slug: "simple-interest-fd", title: "Simple Interest FD", description: "Simple interest FD returns.", category: "banking", engine: "simple" }),
  c({ slug: "compound-interest-fd", title: "Compound Interest FD", description: "Compound interest on FD.", category: "banking", engine: "compound" }),
  c({ slug: "tax-saving-fd", title: "Tax Saving FD", description: "Tax-saving FD maturity.", category: "banking", engine: "fd" }),
  c({ slug: "recurring-deposit", title: "Recurring Deposit Calculator", description: "RD maturity calculator.", category: "banking", engine: "rd", popular: true }),
  c({ slug: "dps-calculator", title: "DPS Calculator", description: "Deposit Pension Scheme calculator.", category: "banking", engine: "rd" }),
  c({ slug: "monthly-savings", title: "Monthly Savings Calculator", description: "Monthly savings growth tracker.", category: "savings", engine: "sip" }),
  c({ slug: "target-savings", title: "Target Savings Calculator", description: "Reach a savings goal.", category: "savings", engine: "savings-goal" }),
];

const INVESTMENT: CalculatorDefinition[] = [
  c({ slug: "compound-interest", title: "Compound Interest", description: "Compound interest growth calculator.", category: "investments", engine: "compound", popular: true, featured: true }),
  c({ slug: "simple-interest", title: "Simple Interest", description: "Simple interest calculator.", category: "investments", engine: "simple" }),
  c({ slug: "sip-calculator", title: "SIP Calculator", description: "Systematic Investment Plan returns.", category: "investments", engine: "sip", popular: true, featured: true }),
  c({ slug: "mutual-fund", title: "Mutual Fund Calculator", description: "Mutual fund SIP growth estimator.", category: "investments", engine: "mutual-fund" }),
  c({ slug: "stock-investment", title: "Stock Investment Calculator", description: "Stock investment ROI estimator.", category: "investments", engine: "roi" }),
  c({ slug: "dividend-calculator", title: "Dividend Calculator", description: "Total dividend from share holdings.", category: "investments", engine: "dividend" }),
  c({ slug: "roi-calculator", title: "ROI Calculator", description: "Return on investment percentage.", category: "investments", engine: "roi", popular: true }),
  c({ slug: "investment-return", title: "Investment Return Calculator", description: "Total investment return analysis.", category: "investments", engine: "roi" }),
  c({ slug: "future-value", title: "Future Value Calculator", description: "Future value of present investment.", category: "investments", engine: "future-value" }),
  c({ slug: "present-value", title: "Present Value Calculator", description: "Present value of future amount.", category: "investments", engine: "present-value" }),
  c({ slug: "inflation-calculator", title: "Inflation Calculator", description: "Impact of inflation on money.", category: "investments", engine: "inflation" }),
];

const SAVINGS: CalculatorDefinition[] = [
  c({ slug: "savings-goal", title: "Savings Goal", description: "Time to reach your savings target.", category: "savings", engine: "savings-goal", popular: true }),
  c({ slug: "emergency-fund", title: "Emergency Fund", description: "Build your emergency fund plan.", category: "savings", engine: "emergency-fund" }),
  c({ slug: "retirement-savings", title: "Retirement Savings", description: "Retirement corpus calculator.", category: "savings", engine: "retirement", featured: true }),
  c({ slug: "monthly-saving-planner", title: "Monthly Saving Planner", description: "Monthly savings planner.", category: "savings", engine: "sip" }),
  c({ slug: "college-savings", title: "College Savings", description: "Save for college education.", category: "student", engine: "savings-goal" }),
  c({ slug: "child-education-fund", title: "Child Education Fund", description: "Education fund for your child.", category: "student", engine: "savings-goal" }),
  c({ slug: "vacation-savings", title: "Vacation Savings", description: "Save for your dream vacation.", category: "savings", engine: "savings-goal" }),
];

const TAX: CalculatorDefinition[] = [
  c({ slug: "income-tax", title: "Income Tax Calculator", description: "Estimate income tax liability.", category: "tax", engine: "income-tax", popular: true }),
  c({ slug: "vat-calculator", title: "VAT Calculator", description: "VAT amount and total price.", category: "tax", engine: "vat" }),
  c({ slug: "sales-tax", title: "Sales Tax Calculator", description: "Sales tax on purchases.", category: "tax", engine: "sales-tax" }),
  c({ slug: "capital-gain-tax", title: "Capital Gain Tax", description: "Capital gains tax estimator.", category: "tax", engine: "capital-gains" }),
  c({ slug: "corporate-tax", title: "Corporate Tax", description: "Corporate tax on profits.", category: "tax", engine: "corporate-tax" }),
  c({ slug: "payroll-tax", title: "Payroll Tax", description: "Payroll tax deduction calculator.", category: "tax", engine: "payroll-tax" }),
];

const SALARY: CalculatorDefinition[] = [
  c({ slug: "salary-calculator", title: "Salary Calculator", description: "Gross to net salary breakdown.", category: "salary", engine: "salary", popular: true }),
  c({ slug: "take-home-salary", title: "Take Home Salary", description: "Net take-home pay calculator.", category: "salary", engine: "take-home", featured: true }),
  c({ slug: "overtime-calculator", title: "Overtime Calculator", description: "Overtime pay calculator.", category: "salary", engine: "overtime" }),
  c({ slug: "hourly-wage", title: "Hourly Wage Calculator", description: "Annual to hourly wage converter.", category: "salary", engine: "hourly-wage" }),
  c({ slug: "annual-income", title: "Annual Income Calculator", description: "Annual income from monthly salary.", category: "salary", engine: "annual-income" }),
  c({ slug: "bonus-calculator", title: "Bonus Calculator", description: "Bonus amount from salary percent.", category: "salary", engine: "bonus" }),
];

const BUSINESS: CalculatorDefinition[] = [
  c({ slug: "profit-margin", title: "Profit Margin", description: "Profit margin percentage.", category: "business", engine: "profit-margin", popular: true }),
  c({ slug: "break-even", title: "Break Even", description: "Break-even point calculator.", category: "business", engine: "break-even" }),
  c({ slug: "markup-calculator", title: "Markup Calculator", description: "Selling price from markup.", category: "business", engine: "markup" }),
  c({ slug: "discount-calculator", title: "Discount Calculator", description: "Price after discount.", category: "business", engine: "discount", popular: true }),
  c({ slug: "gst-calculator", title: "GST Calculator", description: "GST on goods and services.", category: "business", engine: "gst" }),
  c({ slug: "business-vat", title: "Business VAT", description: "Business VAT calculator.", category: "business", engine: "vat" }),
  c({ slug: "cash-flow", title: "Cash Flow", description: "Net cash flow calculator.", category: "business", engine: "cash-flow" }),
  c({ slug: "inventory-turnover", title: "Inventory Turnover", description: "Inventory turnover ratio.", category: "business", engine: "inventory-turnover" }),
];

const GENERAL: CalculatorDefinition[] = [
  c({ slug: "percentage", title: "Percentage Calculator", description: "Calculate percentage of a value.", category: "general", engine: "percentage", popular: true }),
  c({ slug: "percentage-increase", title: "Percentage Increase", description: "Percent increase between values.", category: "general", engine: "percentage-change" }),
  c({ slug: "percentage-decrease", title: "Percentage Decrease", description: "Percent decrease between values.", category: "general", engine: "percentage-change" }),
  c({ slug: "average-calculator", title: "Average Calculator", description: "Average of multiple numbers.", category: "general", engine: "average" }),
  c({ slug: "age-calculator", title: "Age Calculator", description: "Calculate age from birth year.", category: "general", engine: "age" }),
  c({ slug: "date-difference", title: "Date Difference", description: "Difference between dates in days.", category: "general", engine: "date-diff" }),
  c({ slug: "bmi-calculator", title: "BMI Calculator", description: "Body Mass Index calculator.", category: "general", engine: "bmi", popular: true }),
  c({ slug: "fuel-cost", title: "Fuel Cost Calculator", description: "Trip fuel cost estimator.", category: "general", engine: "fuel" }),
  c({ slug: "electricity-bill", title: "Electricity Bill", description: "Electricity bill from units.", category: "general", engine: "electricity" }),
  c({ slug: "currency-converter", title: "Currency Converter", description: "Convert between currencies.", category: "currency", engine: "currency", featured: true }),
];

const BD_BANKS = [
  "Bangladesh Bank", "BRAC Bank", "City Bank", "Dutch Bangla", "EBL", "IBBL",
  "Prime Bank", "Eastern Bank", "IFIC", "UCB", "One Bank", "NRB Bank",
  "Mutual Trust Bank", "Bank Asia", "Standard Bank", "Jamuna Bank",
  "Mercantile Bank", "Trust Bank", "Pubali Bank", "Sonali Bank", "Agrani Bank",
  "Janata Bank", "Rupali Bank",
];

const BANGLADESH: CalculatorDefinition[] = [
  ...BD_BANKS.map((bank) => {
    const slug = bank.toLowerCase().replace(/\s+/g, "-") + "-emi";
    return c({
      slug,
      title: `${bank} EMI`,
      description: `${bank} loan EMI calculator for Bangladesh.`,
      category: "bangladesh",
      engine: "emi",
      popular: ["brac-bank-emi", "dutch-bangla-emi", "city-bank-emi"].includes(slug),
    });
  }),
  c({ slug: "bangladesh-dps", title: "Bangladesh DPS Calculator", description: "DPS maturity for Bangladesh banks.", category: "bangladesh", engine: "rd", featured: true }),
  c({ slug: "bangladesh-fdr", title: "Bangladesh FDR Calculator", description: "FDR returns for Bangladesh.", category: "bangladesh", engine: "fd", featured: true }),
  c({ slug: "bangladesh-income-tax", title: "Bangladesh Income Tax Calculator", description: "NBR income tax slab calculator.", category: "bangladesh", engine: "income-tax-bd", popular: true, featured: true }),
];

export const ALL_CALCULATORS: CalculatorDefinition[] = [
  ...BANKING_EMI,
  ...BANKING_EXTRA,
  ...FD_CALCS,
  ...INVESTMENT,
  ...SAVINGS,
  ...TAX,
  ...SALARY,
  ...BUSINESS,
  ...GENERAL,
  ...BANGLADESH,
];

export const CALCULATOR_MAP = new Map(ALL_CALCULATORS.map((c) => [c.slug, c]));

export function getCalculator(slug: string) {
  return CALCULATOR_MAP.get(slug);
}

export function getCalculatorsByCategory(category: string) {
  return ALL_CALCULATORS.filter((c) => c.category === category);
}

export const POPULAR_CALCULATORS = ALL_CALCULATORS.filter((c) => c.popular);
export const FEATURED_CALCULATORS = ALL_CALCULATORS.filter((c) => c.featured);

export const CALCULATOR_SLUGS = ALL_CALCULATORS.map((c) => c.slug);
