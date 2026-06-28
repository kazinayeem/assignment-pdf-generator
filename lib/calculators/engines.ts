import type { CalculationResult, CalculatorEngine, CalculatorField } from "./types";

const fmt = (n: number, decimals = 2) =>
  Number.isFinite(n) ? Number(n.toFixed(decimals)) : 0;

const fmtCur = (n: number, currency = "BDT") =>
  new Intl.NumberFormat("en-BD", { style: "currency", currency, maximumFractionDigits: 0 }).format(n);

export function formatCurrency(n: number, currency = "BDT") {
  try {
    return fmtCur(n, currency);
  } catch {
    return `৳${fmt(n, 0).toLocaleString()}`;
  }
}

function emiSchedule(principal: number, annualRate: number, months: number) {
  const r = annualRate / 12 / 100;
  if (months <= 0 || principal <= 0) return { emi: 0, total: 0, interest: 0, schedule: [] as CalculationResult["amortization"] };
  const emi = r === 0 ? principal / months : (principal * r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1);
  let balance = principal;
  const schedule: NonNullable<CalculationResult["amortization"]> = [];
  let totalInterest = 0;
  for (let m = 1; m <= months; m++) {
    const interest = balance * r;
    const princ = emi - interest;
    balance = Math.max(0, balance - princ);
    totalInterest += interest;
    schedule.push({ month: m, emi: fmt(emi), principal: fmt(princ), interest: fmt(interest), balance: fmt(balance) });
  }
  return { emi: fmt(emi), total: fmt(emi * months), interest: fmt(totalInterest), schedule };
}

export function runCalculation(
  engine: CalculatorEngine,
  inputs: Record<string, number | string>,
  currency = "BDT"
): CalculationResult {
  const n = (key: string, fallback = 0) => {
    const v = inputs[key];
    return typeof v === "number" ? v : parseFloat(String(v)) || fallback;
  };

  switch (engine) {
    case "emi":
    case "emi-tenure": {
      const principal = n("principal", 1000000);
      const rate = n("rate", 9);
      const tenure = n("tenure", 20);
      const tenureUnit = String(inputs.tenureUnit || "years");
      const months = tenureUnit === "months" ? tenure : tenure * 12;
      const { emi, total, interest, schedule } = emiSchedule(principal, rate, months);
      const scheduleRows = schedule ?? [];
      const chartLabels = scheduleRows.filter((_, i) => i % Math.max(1, Math.floor(months / 12)) === 0 || i === months - 1).map((s) => `M${s.month}`);
      const chartPrincipal = scheduleRows.filter((_, i) => i % Math.max(1, Math.floor(months / 12)) === 0 || i === months - 1).map((s) => s.principal);
      const chartInterest = scheduleRows.filter((_, i) => i % Math.max(1, Math.floor(months / 12)) === 0 || i === months - 1).map((s) => s.interest);
      return {
        primary: [
          { label: "Monthly EMI", value: formatCurrency(emi, currency), highlight: true },
          { label: "Total Payment", value: formatCurrency(total, currency) },
          { label: "Total Interest", value: formatCurrency(interest, currency) },
        ],
        secondary: [
          { label: "Principal", value: formatCurrency(principal, currency) },
          { label: "Tenure", value: `${months} months` },
        ],
        chart: { labels: chartLabels, principal: chartPrincipal, interest: chartInterest },
        amortization: schedule,
        steps: [
          `Monthly rate r = ${rate}% ÷ 12 = ${fmt(rate / 12, 4)}%`,
          `Tenure n = ${months} months`,
          `EMI = P × r × (1+r)ⁿ / ((1+r)ⁿ − 1)`,
          `EMI = ${formatCurrency(emi, currency)}`,
        ],
      };
    }
    case "emi-flat": {
      const principal = n("principal", 500000);
      const rate = n("rate", 12);
      const tenure = n("tenure", 5);
      const months = tenure * 12;
      const totalInterest = principal * (rate / 100) * tenure;
      const total = principal + totalInterest;
      const emi = total / months;
      return {
        primary: [
          { label: "Monthly EMI (Flat)", value: formatCurrency(emi, currency), highlight: true },
          { label: "Total Interest", value: formatCurrency(totalInterest, currency) },
          { label: "Total Payment", value: formatCurrency(total, currency) },
        ],
        steps: [`Flat interest = ${formatCurrency(principal, currency)} × ${rate}% × ${tenure} yrs`, `EMI = Total ÷ ${months} months`],
      };
    }
    case "emi-prepayment": {
      const principal = n("principal", 2000000);
      const rate = n("rate", 9);
      const tenure = n("tenure", 15);
      const prepay = n("prepayment", 200000);
      const months = tenure * 12;
      const base = emiSchedule(principal, rate, months);
      const newPrincipal = Math.max(0, principal - prepay);
      const reduced = emiSchedule(newPrincipal, rate, months);
      const saved = base.interest - reduced.interest;
      return {
        primary: [
          { label: "Original EMI", value: formatCurrency(base.emi, currency) },
          { label: "New EMI", value: formatCurrency(reduced.emi, currency), highlight: true },
          { label: "Interest Saved", value: formatCurrency(saved, currency) },
        ],
        secondary: [{ label: "Prepayment", value: formatCurrency(prepay, currency) }],
      };
    }
    case "emi-part-payment": {
      const principal = n("principal", 1500000);
      const rate = n("rate", 10);
      const tenure = n("tenure", 10);
      const partPay = n("partPayment", 100000);
      const months = tenure * 12;
      const after = emiSchedule(Math.max(0, principal - partPay), rate, months);
      return {
        primary: [
          { label: "New EMI", value: formatCurrency(after.emi, currency), highlight: true },
          { label: "Total Interest", value: formatCurrency(after.interest, currency) },
          { label: "Part Payment", value: formatCurrency(partPay, currency) },
        ],
        amortization: after.schedule,
      };
    }
    case "loan-eligibility": {
      const income = n("income", 80000);
      const existingEmi = n("existingEmi", 0);
      const rate = n("rate", 9);
      const tenure = n("tenure", 20);
      const months = tenure * 12;
      const maxEmi = income * 0.4 - existingEmi;
      const r = rate / 12 / 100;
      const eligible = r === 0 ? maxEmi * months : (maxEmi * (Math.pow(1 + r, months) - 1)) / (r * Math.pow(1 + r, months));
      return {
        primary: [
          { label: "Eligible Loan Amount", value: formatCurrency(Math.max(0, eligible), currency), highlight: true },
          { label: "Max Monthly EMI", value: formatCurrency(Math.max(0, maxEmi), currency) },
        ],
      };
    }
    case "loan-affordability": {
      const income = n("income", 100000);
      const expenses = n("expenses", 40000);
      const rate = n("rate", 9);
      const tenure = n("tenure", 15);
      const affordable = Math.max(0, (income - expenses) * 0.5);
      const months = tenure * 12;
      const r = rate / 12 / 100;
      const loan = r === 0 ? affordable * months : (affordable * (Math.pow(1 + r, months) - 1)) / (r * Math.pow(1 + r, months));
      return {
        primary: [
          { label: "Affordable EMI", value: formatCurrency(affordable, currency), highlight: true },
          { label: "Affordable Loan", value: formatCurrency(loan, currency) },
        ],
      };
    }
    case "outstanding-loan": {
      const principal = n("principal", 3000000);
      const rate = n("rate", 9);
      const tenure = n("tenure", 20);
      const paid = n("paidMonths", 60);
      const months = tenure * 12;
      const r = rate / 12 / 100;
      const emi = r === 0 ? principal / months : (principal * r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1);
      let balance = principal;
      for (let i = 0; i < paid; i++) {
        const interest = balance * r;
        balance -= emi - interest;
      }
      return {
        primary: [
          { label: "Outstanding Balance", value: formatCurrency(Math.max(0, balance), currency), highlight: true },
          { label: "EMI Paid", value: `${paid} months` },
          { label: "Remaining", value: `${months - paid} months` },
        ],
      };
    }
    case "fd":
    case "compound": {
      const principal = n("principal", 100000);
      const rate = n("rate", 7);
      const tenure = n("tenure", 5);
      const freq = n("frequency", 4);
      const amount = principal * Math.pow(1 + rate / 100 / freq, freq * tenure);
      const interest = amount - principal;
      return {
        primary: [
          { label: "Maturity Amount", value: formatCurrency(amount, currency), highlight: true },
          { label: "Interest Earned", value: formatCurrency(interest, currency) },
          { label: "Principal", value: formatCurrency(principal, currency) },
        ],
        steps: [`A = P(1 + r/n)^(nt)`, `A = ${formatCurrency(amount, currency)}`],
      };
    }
    case "simple": {
      const principal = n("principal", 100000);
      const rate = n("rate", 8);
      const tenure = n("tenure", 3);
      const interest = principal * (rate / 100) * tenure;
      return {
        primary: [
          { label: "Total Amount", value: formatCurrency(principal + interest, currency), highlight: true },
          { label: "Simple Interest", value: formatCurrency(interest, currency) },
        ],
        steps: [`SI = P × R × T = ${formatCurrency(interest, currency)}`],
      };
    }
    case "rd": {
      const monthly = n("monthly", 5000);
      const rate = n("rate", 7);
      const tenure = n("tenure", 5);
      const months = tenure * 12;
      const r = rate / 12 / 100;
      const fv = r === 0 ? monthly * months : monthly * ((Math.pow(1 + r, months) - 1) / r) * (1 + r);
      return {
        primary: [
          { label: "Maturity Value", value: formatCurrency(fv, currency), highlight: true },
          { label: "Total Deposited", value: formatCurrency(monthly * months, currency) },
          { label: "Interest Earned", value: formatCurrency(fv - monthly * months, currency) },
        ],
      };
    }
    case "sip":
    case "mutual-fund": {
      const monthly = n("monthly", 10000);
      const rate = n("rate", 12);
      const tenure = n("tenure", 10);
      const months = tenure * 12;
      const r = rate / 12 / 100;
      const fv = r === 0 ? monthly * months : monthly * ((Math.pow(1 + r, months) - 1) / r) * (1 + r);
      const invested = monthly * months;
      return {
        primary: [
          { label: "Future Value", value: formatCurrency(fv, currency), highlight: true },
          { label: "Amount Invested", value: formatCurrency(invested, currency) },
          { label: "Wealth Gained", value: formatCurrency(fv - invested, currency) },
        ],
        chart: {
          labels: Array.from({ length: tenure }, (_, i) => `Y${i + 1}`),
          principal: Array.from({ length: tenure }, (_, i) => monthly * 12 * (i + 1)),
          interest: Array.from({ length: tenure }, (_, i) => {
            const m = (i + 1) * 12;
            return r === 0 ? 0 : monthly * ((Math.pow(1 + r, m) - 1) / r) * (1 + r) - monthly * m;
          }),
        },
      };
    }
    case "future-value": {
      const pv = n("presentValue", 100000);
      const rate = n("rate", 10);
      const tenure = n("tenure", 5);
      const fv = pv * Math.pow(1 + rate / 100, tenure);
      return {
        primary: [{ label: "Future Value", value: formatCurrency(fv, currency), highlight: true }],
      };
    }
    case "present-value": {
      const fv = n("futureValue", 200000);
      const rate = n("rate", 8);
      const tenure = n("tenure", 5);
      const pv = fv / Math.pow(1 + rate / 100, tenure);
      return {
        primary: [{ label: "Present Value", value: formatCurrency(pv, currency), highlight: true }],
      };
    }
    case "inflation": {
      const amount = n("amount", 100000);
      const rate = n("rate", 6);
      const tenure = n("tenure", 10);
      const future = amount * Math.pow(1 + rate / 100, tenure);
      const todayEquiv = amount / Math.pow(1 + rate / 100, tenure);
      return {
        primary: [
          { label: "Future Cost", value: formatCurrency(future, currency), highlight: true },
          { label: "Today's Equivalent", value: formatCurrency(todayEquiv, currency) },
        ],
      };
    }
    case "roi": {
      const invested = n("invested", 50000);
      const returned = n("returned", 75000);
      const roi = invested > 0 ? ((returned - invested) / invested) * 100 : 0;
      return {
        primary: [
          { label: "ROI", value: `${fmt(roi)}%`, highlight: true },
          { label: "Net Profit", value: formatCurrency(returned - invested, currency) },
        ],
      };
    }
    case "dividend": {
      const shares = n("shares", 100);
      const divPerShare = n("dividend", 5);
      const total = shares * divPerShare;
      return {
        primary: [{ label: "Total Dividend", value: formatCurrency(total, currency), highlight: true }],
      };
    }
    case "savings-goal":
    case "emergency-fund": {
      const goal = n("goal", 500000);
      const monthly = n("monthly", 10000);
      const rate = n("rate", 6);
      const r = rate / 12 / 100;
      let balance = 0;
      let months = 0;
      while (balance < goal && months < 600) {
        balance = balance * (1 + r) + monthly;
        months++;
      }
      return {
        primary: [
          { label: "Months to Goal", value: `${months}`, highlight: true },
          { label: "Goal Amount", value: formatCurrency(goal, currency) },
          { label: "Monthly Saving", value: formatCurrency(monthly, currency) },
        ],
      };
    }
    case "retirement": {
      const monthly = n("monthly", 15000);
      const rate = n("rate", 10);
      const years = n("tenure", 25);
      const months = years * 12;
      const r = rate / 12 / 100;
      const fv = r === 0 ? monthly * months : monthly * ((Math.pow(1 + r, months) - 1) / r) * (1 + r);
      return {
        primary: [
          { label: "Retirement Corpus", value: formatCurrency(fv, currency), highlight: true },
          { label: "Monthly Investment", value: formatCurrency(monthly, currency) },
        ],
      };
    }
    case "income-tax":
    case "income-tax-bd": {
      const income = n("income", 1200000);
      let tax = 0;
      if (income <= 350000) tax = 0;
      else if (income <= 450000) tax = (income - 350000) * 0.05;
      else if (income <= 750000) tax = 5000 + (income - 450000) * 0.1;
      else if (income <= 1150000) tax = 35000 + (income - 750000) * 0.15;
      else if (income <= 1650000) tax = 95000 + (income - 1150000) * 0.2;
      else tax = 195000 + (income - 1650000) * 0.25;
      const net = income - tax;
      return {
        primary: [
          { label: "Income Tax", value: formatCurrency(tax, currency), highlight: true },
          { label: "Net Income", value: formatCurrency(net, currency) },
          { label: "Effective Rate", value: `${fmt((tax / income) * 100)}%` },
        ],
        steps: ["Based on Bangladesh FY slab rates (approximate)"],
      };
    }
    case "vat":
    case "sales-tax":
    case "gst": {
      const amount = n("amount", 10000);
      const rate = n("rate", 15);
      const tax = amount * (rate / 100);
      return {
        primary: [
          { label: "Tax Amount", value: formatCurrency(tax, currency), highlight: true },
          { label: "Total with Tax", value: formatCurrency(amount + tax, currency) },
        ],
      };
    }
    case "capital-gains": {
      const buy = n("buyPrice", 100);
      const sell = n("sellPrice", 150);
      const qty = n("quantity", 100);
      const gain = (sell - buy) * qty;
      const tax = gain > 0 ? gain * 0.15 : 0;
      return {
        primary: [
          { label: "Capital Gain", value: formatCurrency(gain, currency), highlight: true },
          { label: "Estimated Tax (15%)", value: formatCurrency(tax, currency) },
        ],
      };
    }
    case "corporate-tax": {
      const profit = n("profit", 5000000);
      const rate = n("rate", 27.5);
      const tax = profit * (rate / 100);
      return {
        primary: [
          { label: "Corporate Tax", value: formatCurrency(tax, currency), highlight: true },
          { label: "After Tax Profit", value: formatCurrency(profit - tax, currency) },
        ],
      };
    }
    case "payroll-tax": {
      const gross = n("gross", 80000);
      const rate = n("rate", 10);
      const tax = gross * (rate / 100);
      return {
        primary: [
          { label: "Payroll Tax", value: formatCurrency(tax, currency), highlight: true },
          { label: "Net Pay", value: formatCurrency(gross - tax, currency) },
        ],
      };
    }
    case "salary":
    case "take-home":
    case "annual-income": {
      const basic = n("basic", 50000);
      const hra = n("hra", 15000);
      const allowances = n("allowances", 10000);
      const deductions = n("deductions", 5000);
      const gross = basic + hra + allowances;
      const net = gross - deductions;
      return {
        primary: [
          { label: "Gross Salary", value: formatCurrency(gross, currency) },
          { label: "Net Salary", value: formatCurrency(net, currency), highlight: true },
          { label: "Annual", value: formatCurrency(net * 12, currency) },
        ],
      };
    }
    case "overtime": {
      const hourly = n("hourly", 500);
      const hours = n("hours", 20);
      const multiplier = n("multiplier", 1.5);
      const pay = hourly * hours * multiplier;
      return {
        primary: [{ label: "Overtime Pay", value: formatCurrency(pay, currency), highlight: true }],
      };
    }
    case "hourly-wage": {
      const annual = n("annual", 600000);
      const hours = n("hoursPerWeek", 40);
      const hourly = annual / (hours * 52);
      return {
        primary: [{ label: "Hourly Wage", value: formatCurrency(hourly, currency), highlight: true }],
      };
    }
    case "bonus": {
      const salary = n("salary", 60000);
      const percent = n("percent", 10);
      const bonus = salary * (percent / 100);
      return {
        primary: [{ label: "Bonus Amount", value: formatCurrency(bonus, currency), highlight: true }],
      };
    }
    case "profit-margin": {
      const revenue = n("revenue", 1000000);
      const cost = n("cost", 700000);
      const profit = revenue - cost;
      const margin = revenue > 0 ? (profit / revenue) * 100 : 0;
      return {
        primary: [
          { label: "Profit Margin", value: `${fmt(margin)}%`, highlight: true },
          { label: "Net Profit", value: formatCurrency(profit, currency) },
        ],
      };
    }
    case "break-even": {
      const fixed = n("fixedCost", 50000);
      const price = n("price", 100);
      const variable = n("variableCost", 60);
      const units = price > variable ? fixed / (price - variable) : 0;
      return {
        primary: [
          { label: "Break-even Units", value: `${fmt(units, 0)}`, highlight: true },
          { label: "Break-even Revenue", value: formatCurrency(units * price, currency) },
        ],
      };
    }
    case "markup": {
      const cost = n("cost", 100);
      const percent = n("percent", 30);
      const price = cost * (1 + percent / 100);
      return {
        primary: [
          { label: "Selling Price", value: formatCurrency(price, currency), highlight: true },
          { label: "Markup", value: `${percent}%` },
        ],
      };
    }
    case "discount": {
      const price = n("price", 1000);
      const percent = n("percent", 20);
      const discounted = price * (1 - percent / 100);
      return {
        primary: [
          { label: "Discounted Price", value: formatCurrency(discounted, currency), highlight: true },
          { label: "You Save", value: formatCurrency(price - discounted, currency) },
        ],
      };
    }
    case "cash-flow": {
      const inflow = n("inflow", 200000);
      const outflow = n("outflow", 150000);
      const net = inflow - outflow;
      return {
        primary: [{ label: "Net Cash Flow", value: formatCurrency(net, currency), highlight: true }],
      };
    }
    case "inventory-turnover": {
      const cogs = n("cogs", 500000);
      const inventory = n("inventory", 100000);
      const turnover = inventory > 0 ? cogs / inventory : 0;
      return {
        primary: [{ label: "Inventory Turnover", value: `${fmt(turnover)}×`, highlight: true }],
      };
    }
    case "percentage": {
      const value = n("value", 200);
      const percent = n("percent", 15);
      const result = value * (percent / 100);
      return {
        primary: [{ label: "Result", value: fmt(result), highlight: true }],
      };
    }
    case "percentage-change": {
      const oldVal = n("oldValue", 100);
      const newVal = n("newValue", 120);
      const change = oldVal !== 0 ? ((newVal - oldVal) / oldVal) * 100 : 0;
      return {
        primary: [{ label: "Percentage Change", value: `${fmt(change)}%`, highlight: true }],
      };
    }
    case "average": {
      const a = n("a", 10);
      const b = n("b", 20);
      const c = n("c", 30);
      return {
        primary: [{ label: "Average", value: fmt((a + b + c) / 3), highlight: true }],
      };
    }
    case "age": {
      const birthYear = n("birthYear", 2000);
      const age = new Date().getFullYear() - birthYear;
      return {
        primary: [{ label: "Age", value: `${age} years`, highlight: true }],
      };
    }
    case "date-diff": {
      const days = n("days", 365);
      return {
        primary: [
          { label: "Years", value: `${fmt(days / 365, 1)}`, highlight: true },
          { label: "Months", value: `${fmt(days / 30, 0)}` },
        ],
      };
    }
    case "bmi": {
      const weight = n("weight", 70);
      const height = n("height", 170) / 100;
      const bmi = height > 0 ? weight / (height * height) : 0;
      let category = "Normal";
      if (bmi < 18.5) category = "Underweight";
      else if (bmi >= 25) category = "Overweight";
      if (bmi >= 30) category = "Obese";
      return {
        primary: [
          { label: "BMI", value: fmt(bmi, 1), highlight: true },
          { label: "Category", value: category },
        ],
      };
    }
    case "fuel": {
      const distance = n("distance", 100);
      const mileage = n("mileage", 12);
      const price = n("price", 120);
      const liters = distance / mileage;
      const cost = liters * price;
      return {
        primary: [{ label: "Fuel Cost", value: formatCurrency(cost, currency), highlight: true }],
      };
    }
    case "electricity": {
      const units = n("units", 250);
      const rate = n("rate", 8.5);
      const bill = units * rate;
      return {
        primary: [{ label: "Electricity Bill", value: formatCurrency(bill, currency), highlight: true }],
      };
    }
    case "currency": {
      const amount = n("amount", 1000);
      const rate = n("rate", 110);
      return {
        primary: [{ label: "Converted Amount", value: fmt(amount * rate, 2), highlight: true }],
      };
    }
    case "loan-comparison": {
      const p1 = n("principal1", 1000000);
      const r1 = n("rate1", 9);
      const p2 = n("principal2", 1000000);
      const r2 = n("rate2", 10.5);
      const tenure = n("tenure", 15);
      const months = tenure * 12;
      const e1 = emiSchedule(p1, r1, months);
      const e2 = emiSchedule(p2, r2, months);
      return {
        primary: [
          { label: "Loan A EMI", value: formatCurrency(e1.emi, currency) },
          { label: "Loan B EMI", value: formatCurrency(e2.emi, currency), highlight: true },
          { label: "Difference", value: formatCurrency(Math.abs(e1.emi - e2.emi), currency) },
        ],
      };
    }
    default:
      return { primary: [{ label: "Result", value: "—", highlight: true }] };
  }
}

export function getDefaultFields(engine: CalculatorEngine): CalculatorField[] {
  const common = {
    principal: { name: "principal", label: "Loan Amount", type: "number" as const, defaultValue: 1000000, unit: "৳", min: 0 },
    rate: { name: "rate", label: "Interest Rate", type: "number" as const, defaultValue: 9, unit: "% p.a.", min: 0, max: 30, step: 0.1 },
    tenure: { name: "tenure", label: "Loan Tenure", type: "number" as const, defaultValue: 15, unit: "years", min: 1, max: 30 },
    monthly: { name: "monthly", label: "Monthly Investment", type: "number" as const, defaultValue: 10000, unit: "৳" },
    income: { name: "income", label: "Monthly Income", type: "number" as const, defaultValue: 80000, unit: "৳" },
    amount: { name: "amount", label: "Amount", type: "number" as const, defaultValue: 10000, unit: "৳" },
    goal: { name: "goal", label: "Target Amount", type: "number" as const, defaultValue: 500000, unit: "৳" },
    frequency: { name: "frequency", label: "Compounding", type: "select" as const, defaultValue: "4", options: [
      { label: "Monthly", value: "12" },
      { label: "Quarterly", value: "4" },
      { label: "Yearly", value: "1" },
    ]},
  };

  const map: Partial<Record<CalculatorEngine, CalculatorField[]>> = {
    emi: [common.principal, common.rate, common.tenure],
    "emi-flat": [common.principal, common.rate, common.tenure],
    "emi-prepayment": [common.principal, common.rate, common.tenure, { name: "prepayment", label: "Prepayment Amount", type: "number", defaultValue: 200000, unit: "৳" }],
    "emi-part-payment": [common.principal, common.rate, common.tenure, { name: "partPayment", label: "Part Payment", type: "number", defaultValue: 100000, unit: "৳" }],
    fd: [common.principal, common.rate, common.tenure, common.frequency],
    compound: [common.principal, common.rate, common.tenure, common.frequency],
    simple: [common.principal, common.rate, common.tenure],
    rd: [common.monthly, common.rate, common.tenure],
    sip: [common.monthly, common.rate, common.tenure],
    "mutual-fund": [common.monthly, common.rate, common.tenure],
    "savings-goal": [common.goal, common.monthly, common.rate],
    "emergency-fund": [common.goal, common.monthly, common.rate],
    retirement: [common.monthly, common.rate, common.tenure],
    "income-tax": [{ name: "income", label: "Annual Income", type: "number", defaultValue: 1200000, unit: "৳" }],
    "income-tax-bd": [{ name: "income", label: "Annual Income", type: "number", defaultValue: 1200000, unit: "৳" }],
    vat: [common.amount, { name: "rate", label: "VAT Rate", type: "number", defaultValue: 15, unit: "%" }],
    gst: [common.amount, { name: "rate", label: "GST Rate", type: "number", defaultValue: 15, unit: "%" }],
    salary: [
      { name: "basic", label: "Basic Salary", type: "number", defaultValue: 50000, unit: "৳" },
      { name: "hra", label: "HRA", type: "number", defaultValue: 15000, unit: "৳" },
      { name: "allowances", label: "Allowances", type: "number", defaultValue: 10000, unit: "৳" },
      { name: "deductions", label: "Deductions", type: "number", defaultValue: 5000, unit: "৳" },
    ],
    "profit-margin": [
      { name: "revenue", label: "Revenue", type: "number", defaultValue: 1000000, unit: "৳" },
      { name: "cost", label: "Cost", type: "number", defaultValue: 700000, unit: "৳" },
    ],
    percentage: [
      { name: "value", label: "Value", type: "number", defaultValue: 200 },
      { name: "percent", label: "Percentage", type: "number", defaultValue: 15, unit: "%" },
    ],
    bmi: [
      { name: "weight", label: "Weight", type: "number", defaultValue: 70, unit: "kg" },
      { name: "height", label: "Height", type: "number", defaultValue: 170, unit: "cm" },
    ],
    currency: [
      { name: "amount", label: "Amount", type: "number", defaultValue: 1000 },
      { name: "rate", label: "Exchange Rate", type: "number", defaultValue: 110 },
    ],
    "loan-comparison": [
      { name: "principal1", label: "Loan A Amount", type: "number", defaultValue: 1000000, unit: "৳" },
      { name: "rate1", label: "Loan A Rate", type: "number", defaultValue: 9, unit: "%" },
      { name: "principal2", label: "Loan B Amount", type: "number", defaultValue: 1000000, unit: "৳" },
      { name: "rate2", label: "Loan B Rate", type: "number", defaultValue: 10.5, unit: "%" },
      common.tenure,
    ],
  };

  return map[engine] || [common.principal, common.rate, common.tenure];
}
