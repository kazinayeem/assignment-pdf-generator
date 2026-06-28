"use client";

import { useState, useCallback, useRef } from "react";
import Link from "next/link";
import {
  RefreshCw,
  Shield,
  Lock,
  Database,
  ChevronRight,
  BookOpen,
  AlertTriangle,
  CheckCircle,
  XCircle,
} from "lucide-react";

type LogEntry = {
  step: number;
  message: string;
  type: "info" | "success" | "error" | "rollback";
};

type SimState = "idle" | "running" | "done" | "failed";

const ACID_PROPERTIES = [
  {
    letter: "A",
    title: "Atomicity",
    icon: <Database size={28} />,
    color: "red",
    desc: "A transaction is an all-or-nothing operation. If any part fails, the entire transaction is rolled back as if it never happened.",
    example: "In a fund transfer, both the debit and credit must succeed. If the credit fails, the debit is reversed.",
  },
  {
    letter: "C",
    title: "Consistency",
    icon: <Shield size={28} />,
    color: "amber",
    desc: "Transactions bring the database from one valid state to another. All rules, constraints, and triggers are preserved.",
    example: "After a transfer, the total money across all accounts remains the same — no money is created or destroyed.",
  },
  {
    letter: "I",
    title: "Isolation",
    icon: <Lock size={28} />,
    color: "amber",
    desc: "Concurrent transactions execute as if they were run sequentially. Intermediate states are invisible to other transactions.",
    example: "Two concurrent transfers from the same account won't interfere — each sees a consistent snapshot.",
  },
  {
    letter: "D",
    title: "Durability",
    icon: <RefreshCw size={28} />,
    color: "green",
    desc: "Once committed, a transaction's changes survive system failures, crashes, or power losses permanently.",
    example: "After the bank confirms a transfer, the new balances persist even if the server crashes immediately after.",
  },
];

const CONCURRENCY_PROBLEMS = [
  {
    name: "Dirty Read",
    desc: "Reading uncommitted data from another transaction that may later be rolled back.",
    example: "Transaction A reads balance $800 before Transaction B rolls back its debit, so A saw a phantom state.",
  },
  {
    name: "Non-repeatable Read",
    desc: "Reading the same row twice within a transaction but getting different values each time.",
    example: "Transaction A reads $1000, Transaction B updates it to $900 and commits, then A reads $900 — inconsistent.",
  },
  {
    name: "Phantom Read",
    desc: "A query returns different sets of rows when executed twice within the same transaction.",
    example: "A reads accounts with balance > $500 getting 3 rows, then B inserts a new $700 account, A re-reads and gets 4 rows.",
  },
];

const ISOLATION_LEVELS = [
  { level: "Read Uncommitted", dirty: "✔️", nonrepeat: "✔️", phantom: "✔️", desc: "No isolation; all problems can occur." },
  { level: "Read Committed", dirty: "❌", nonrepeat: "✔️", phantom: "✔️", desc: "Default in PostgreSQL, Oracle, SQL Server." },
  { level: "Repeatable Read", dirty: "❌", nonrepeat: "❌", phantom: "✔️", desc: "Default in MySQL/InnoDB." },
  { level: "Serializable", dirty: "❌", nonrepeat: "❌", phantom: "❌", desc: "Fully isolated; slowest but safest." },
];

const INTERVIEW_QUESTIONS = [
  {
    q: "What is a database transaction and why is it important?",
    a: "A transaction is a sequence of database operations executed as a single logical unit of work. It's important because it ensures data integrity — either all operations succeed (commit) or none do (rollback), preventing partial updates and data corruption in multi-step operations like bank transfers or order processing.",
  },
  {
    q: "Explain the ACID properties in detail with real-world examples.",
    a: "Atomicity: All-or-nothing execution (bank transfer: debit + credit both succeed or both fail). Consistency: Valid state transitions (invariants like total balance preserved). Isolation: Concurrent transactions don't interfere (two withdrawals from same account are serialized). Durability: Committed changes persist (survive power loss, crashes via WAL write-ahead logging).",
  },
  {
    q: "What is the difference between COMMIT and ROLLBACK?",
    a: "COMMIT permanently saves all changes made during the current transaction, making them visible to other transactions. ROLLBACK undoes all changes made since the transaction began (or since a SAVEPOINT), restoring the database to its previous consistent state. Think of COMMIT as 'save' and ROLLBACK as 'undo all'.",
  },
  {
    q: "What are the four isolation levels in SQL and what problems do they prevent?",
    a: "Read Uncommitted (no prevention), Read Committed (prevents dirty reads), Repeatable Read (prevents dirty + non-repeatable reads), Serializable (prevents all: dirty, non-repeatable, and phantom reads). Higher isolation = better consistency but lower concurrency and performance.",
  },
  {
    q: "What is a deadlock in database transactions and how can it be resolved?",
    a: "A deadlock occurs when two or more transactions each hold locks the other needs, causing them to wait indefinitely. Databases detect deadlocks via wait-for graphs and resolve them by aborting one transaction (the 'victim'), rolling it back, and allowing others to proceed. Prevention: acquire locks in a consistent order, use timeouts, keep transactions short.",
  },
];

const STEP_DELAY = 1000;

export default function TransactionsPage() {
  const [simState, setSimState] = useState<SimState>("idle");
  const [currentSimStep, setCurrentSimStep] = useState(-1);
  const [accountA, setAccountA] = useState(1000);
  const [accountB, setAccountB] = useState(500);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [transferError, setTransferError] = useState(false);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const logCountRef = useRef(0);

  const addLog = useCallback((message: string, type: LogEntry["type"]) => {
    logCountRef.current += 1;
    const step = logCountRef.current;
    setLogs((prev) => [...prev, { step, message, type }]);
  }, []);

  const clearAllTimers = useCallback(() => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
  }, []);

  const reset = useCallback(() => {
    clearAllTimers();
    logCountRef.current = 0;
    setSimState("idle");
    setCurrentSimStep(-1);
    setAccountA(1000);
    setAccountB(500);
    setLogs([]);
    setTransferError(false);
  }, [clearAllTimers]);

  const scheduleStep = useCallback(
    (delay: number, fn: () => void) => {
      const id = setTimeout(fn, delay);
      timersRef.current.push(id);
    },
    []
  );

  const runSuccessfulTransfer = useCallback(() => {
    reset();
    setSimState("running");

    const step0 = () => {
      setCurrentSimStep(0);
      addLog("BEGIN TRANSACTION — Starting fund transfer...", "info");
    };

    const step1 = () => {
      setCurrentSimStep(1);
      setAccountA(800);
      addLog("DEBIT $200 FROM Account A — Balance: $1000 → $800", "success");
    };

    const step2 = () => {
      setCurrentSimStep(2);
      setAccountB(700);
      addLog("CREDIT $200 TO Account B — Balance: $500 → $700", "success");
    };

    const step3 = () => {
      setCurrentSimStep(3);
      addLog("COMMIT — Transaction applied successfully!", "success");
      addLog(`Final — Account A: $800, Account B: $700 (Total: $1,500)`, "info");
      setSimState("done");
    };

    scheduleStep(0, step0);
    scheduleStep(STEP_DELAY, step1);
    scheduleStep(STEP_DELAY * 2, step2);
    scheduleStep(STEP_DELAY * 3, step3);
  }, [reset, addLog, scheduleStep]);

  const runFailedTransfer = useCallback(() => {
    reset();
    setSimState("running");
    setTransferError(false);

    const step0 = () => {
      setCurrentSimStep(0);
      addLog("BEGIN TRANSACTION — Starting fund transfer...", "info");
    };

    const step1 = () => {
      setCurrentSimStep(1);
      setAccountA(800);
      addLog("DEBIT $200 FROM Account A — Balance: $1000 → $800", "success");
    };

    const step2 = () => {
      setCurrentSimStep(2);
      setTransferError(true);
      addLog("CREDIT $200 TO Account B — FAILED! Network timeout.", "error");
    };

    const step3 = () => {
      setCurrentSimStep(3);
      setAccountA(1000);
      addLog("ROLLBACK — Reverting Account A to $1,000 (original balance)", "rollback");
    };

    const step4 = () => {
      setCurrentSimStep(4);
      addLog("Transaction aborted. No changes persisted.", "rollback");
      addLog(`Final — Account A: $1,000, Account B: $500 (Total: $1,500)`, "info");
      setSimState("failed");
    };

    scheduleStep(0, step0);
    scheduleStep(STEP_DELAY, step1);
    scheduleStep(STEP_DELAY * 2, step2);
    scheduleStep(STEP_DELAY * 3, step3);
    scheduleStep(STEP_DELAY * 4, step4);
  }, [reset, addLog, scheduleStep]);

  const isEnabled = simState === "idle";

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm font-semibold text-gray-500 mb-8">
          <Link href="/tools/database" className="text-amber-600 hover:text-amber-700">
            Database
          </Link>
          <ChevronRight size={14} />
          <span className="text-gray-900">Transactions & ACID</span>
        </nav>

        {/* Hero */}
        <div className="mb-12">
          <h1 className="text-5xl font-black text-gray-900 mb-4">🔄 Transaction Simulator</h1>
          <p className="text-xl text-gray-600 max-w-3xl">
            Learn how ACID properties ensure data integrity through interactive simulations of database transactions, 
            concurrency control, and isolation levels.
          </p>
        </div>

        {/* ACID Properties Section */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <Shield size={24} className="text-amber-600" />
            ACID Properties
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {ACID_PROPERTIES.map((prop) => (
              <div
                key={prop.letter}
                className="bg-white rounded-xl border-2 border-gray-200 p-6 hover:border-amber-300 transition-all shadow-sm"
              >
                <div
                  className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${
                    prop.color === "red"
                      ? "bg-red-100 text-red-600"
                      : prop.color === "amber"
                      ? "bg-amber-100 text-amber-600"
                      : "bg-green-100 text-green-600"
                  }`}
                >
                  {prop.icon}
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <span
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold ${
                      prop.color === "red"
                        ? "bg-red-500"
                        : prop.color === "amber"
                        ? "bg-amber-500"
                        : "bg-green-500"
                    }`}
                  >
                    {prop.letter}
                  </span>
                  <h3 className="font-bold text-lg text-gray-900">{prop.title}</h3>
                </div>
                <p className="text-sm text-gray-600 mb-3">{prop.desc}</p>
                <p className="text-xs text-gray-500 italic border-t border-gray-100 pt-3">{prop.example}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Interactive Transaction Simulator */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <RefreshCw size={24} className="text-amber-600" />
            Interactive Transaction Simulator
          </h2>
          <div className="bg-white rounded-xl border-2 border-gray-200 p-6 md:p-8 shadow-sm">
            {/* Accounts Display */}
            <div className="grid sm:grid-cols-2 gap-4 mb-6">
              <div className="p-4 rounded-lg border-2 border-green-200 bg-green-50 transition-all duration-500">
                <p className="text-xs font-bold uppercase tracking-wider text-green-700 mb-1">Account A</p>
                <p className="text-2xl font-black text-green-800 transition-all duration-500">
                  ${accountA.toLocaleString()}
                </p>
                <p className="text-xs text-green-600 mt-1">Initial: $1,000</p>
              </div>
              <div className="p-4 rounded-lg border-2 border-blue-200 bg-blue-50 transition-all duration-500">
                <p className="text-xs font-bold uppercase tracking-wider text-blue-700 mb-1">Account B</p>
                <p className="text-2xl font-black text-blue-800 transition-all duration-500">
                  ${accountB.toLocaleString()}
                </p>
                <p className="text-xs text-blue-600 mt-1">Initial: $500</p>
              </div>
            </div>

            {/* Simulator Steps */}
            <div className="mb-6 space-y-2">
              {/* Step 1: BEGIN */}
              <div
                className={`flex items-center gap-3 p-3 rounded-lg border-2 transition-all duration-300 ${
                  currentSimStep === 0
                    ? "border-amber-500 bg-amber-50 shadow-md"
                    : currentSimStep > 0
                    ? "border-green-300 bg-green-50"
                    : "border-gray-200 bg-gray-50 opacity-50"
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white ${
                    currentSimStep > 0
                      ? "bg-green-500"
                      : currentSimStep === 0
                      ? "bg-amber-500 animate-pulse"
                      : "bg-gray-300"
                  }`}
                >
                  {currentSimStep > 0 ? <CheckCircle size={16} /> : "1"}
                </div>
                <div className="flex-1">
                  <p className="font-bold text-sm text-gray-900">BEGIN TRANSACTION</p>
                  <p className="text-xs text-gray-600">Start a new database transaction</p>
                </div>
                {currentSimStep === 0 && (
                  <span className="text-xs font-bold text-amber-600 bg-amber-100 px-2 py-1 rounded">
                    IN PROGRESS
                  </span>
                )}
              </div>

              {/* Step 2: DEBIT */}
              <div
                className={`flex items-center gap-3 p-3 rounded-lg border-2 transition-all duration-300 ${
                  currentSimStep === 1
                    ? "border-amber-500 bg-amber-50 shadow-md"
                    : currentSimStep > 1
                    ? "border-green-300 bg-green-50"
                    : "border-gray-200 bg-gray-50 opacity-50"
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white ${
                    currentSimStep > 1
                      ? "bg-green-500"
                      : currentSimStep === 1
                      ? "bg-amber-500 animate-pulse"
                      : "bg-gray-300"
                  }`}
                >
                  {currentSimStep > 1 ? <CheckCircle size={16} /> : "2"}
                </div>
                <div className="flex-1">
                  <p className="font-bold text-sm text-gray-900">DEBIT $200 FROM Account A</p>
                  <p className="text-xs text-gray-600">Balance: $1,000 → $800</p>
                </div>
                {currentSimStep === 1 && (
                  <span className="text-xs font-bold text-amber-600 bg-amber-100 px-2 py-1 rounded">
                    IN PROGRESS
                  </span>
                )}
              </div>

              {/* Step 3: CREDIT */}
              <div
                className={`flex items-center gap-3 p-3 rounded-lg border-2 transition-all duration-300 ${
                  currentSimStep === 2
                    ? transferError
                      ? "border-red-400 bg-red-50 shadow-md"
                      : "border-amber-500 bg-amber-50 shadow-md"
                    : currentSimStep > 2
                    ? transferError
                      ? "border-red-300 bg-red-50"
                      : "border-green-300 bg-green-50"
                    : "border-gray-200 bg-gray-50 opacity-50"
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white ${
                    transferError && currentSimStep >= 2
                      ? "bg-red-500"
                      : currentSimStep > 2
                      ? "bg-green-500"
                      : currentSimStep === 2
                      ? transferError
                        ? "bg-red-500 animate-pulse"
                        : "bg-amber-500 animate-pulse"
                      : "bg-gray-300"
                  }`}
                >
                  {transferError && currentSimStep >= 2 ? (
                    <XCircle size={16} />
                  ) : currentSimStep > 2 && !transferError ? (
                    <CheckCircle size={16} />
                  ) : (
                    "3"
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-bold text-sm text-gray-900">CREDIT $200 TO Account B</p>
                  <p className="text-xs text-gray-600">
                    {transferError ? "❌ FAILED — Network timeout error" : "Balance: $500 → $700"}
                  </p>
                </div>
                {currentSimStep === 2 && transferError && (
                  <span className="text-xs font-bold text-red-600 bg-red-100 px-2 py-1 rounded">
                    ERROR
                  </span>
                )}
                {currentSimStep === 2 && !transferError && (
                  <span className="text-xs font-bold text-amber-600 bg-amber-100 px-2 py-1 rounded">
                    IN PROGRESS
                  </span>
                )}
              </div>

              {/* Step 4: COMMIT or ROLLBACK */}
              <div
                className={`flex items-center gap-3 p-3 rounded-lg border-2 transition-all duration-300 ${
                  currentSimStep === 3 || currentSimStep === 4
                    ? transferError
                      ? "border-orange-400 bg-orange-50 shadow-md"
                      : "border-green-500 bg-green-50 shadow-md"
                    : "border-gray-200 bg-gray-50 opacity-50"
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white ${
                    currentSimStep >= 3
                      ? transferError
                        ? "bg-orange-500"
                        : "bg-green-600"
                      : "bg-gray-300"
                  }`}
                >
                  {currentSimStep >= 3 ? (
                    transferError ? (
                      <AlertTriangle size={16} />
                    ) : (
                      <CheckCircle size={16} />
                    )
                  ) : (
                    "4"
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-bold text-sm text-gray-900">
                    {transferError ? "ROLLBACK" : "COMMIT"}
                  </p>
                  <p className="text-xs text-gray-600">
                    {transferError
                      ? "Reverting changes — Account A restored to $1,000"
                      : "Changes permanently saved!"}
                  </p>
                </div>
                {currentSimStep >= 3 && (
                  <span
                    className={`text-xs font-bold px-2 py-1 rounded ${
                      transferError
                        ? "text-orange-600 bg-orange-100"
                        : "text-green-600 bg-green-100"
                    }`}
                  >
                    {transferError ? "ROLLED BACK" : "COMMITTED"}
                  </span>
                )}
              </div>

              {/* Done indicator */}
              {currentSimStep >= 4 && !transferError && simState === "done" && (
                <div className="flex items-center gap-3 p-3 rounded-lg border-2 border-green-500 bg-green-50">
                  <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center">
                    <CheckCircle size={16} className="text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-sm text-green-800">TRANSACTION COMPLETE</p>
                    <p className="text-xs text-green-600">All ACID properties satisfied ✓</p>
                  </div>
                  <span className="text-xs font-bold text-green-600 bg-green-100 px-2 py-1 rounded">
                    SUCCESS
                  </span>
                </div>
              )}
              {currentSimStep === 4 && transferError && simState === "failed" && (
                <div className="flex items-center gap-3 p-3 rounded-lg border-2 border-orange-500 bg-orange-50">
                  <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center">
                    <AlertTriangle size={16} className="text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-sm text-orange-800">TRANSACTION ABORTED</p>
                    <p className="text-xs text-orange-600">Atomicity ensured: partial changes undone ✓</p>
                  </div>
                  <span className="text-xs font-bold text-orange-600 bg-orange-100 px-2 py-1 rounded">
                    ROLLED BACK
                  </span>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3 mb-6">
              <button
                onClick={runSuccessfulTransfer}
                disabled={!isEnabled}
                className={`px-6 py-3 rounded-lg font-bold text-sm flex items-center gap-2 transition-all ${
                  isEnabled
                    ? "bg-green-600 text-white hover:bg-green-700 shadow-md hover:shadow-lg"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }`}
              >
                <CheckCircle size={18} />
                Run Successful Transfer
              </button>
              <button
                onClick={runFailedTransfer}
                disabled={!isEnabled}
                className={`px-6 py-3 rounded-lg font-bold text-sm flex items-center gap-2 transition-all ${
                  isEnabled
                    ? "bg-red-600 text-white hover:bg-red-700 shadow-md hover:shadow-lg"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }`}
              >
                <XCircle size={18} />
                Run Failed Transfer
              </button>
              <button
                onClick={reset}
                disabled={simState === "idle"}
                className={`px-6 py-3 rounded-lg font-bold text-sm flex items-center gap-2 transition-all ${
                  simState !== "idle"
                    ? "bg-amber-600 text-white hover:bg-amber-700 shadow-md hover:shadow-lg"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }`}
              >
                <RefreshCw size={18} />
                Reset
              </button>
            </div>

            {/* Log Panel */}
            <div>
              <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                <BookOpen size={18} className="text-amber-600" />
                Transaction Log
              </h3>
              <div className="bg-gray-900 rounded-lg p-4 max-h-56 overflow-y-auto font-mono text-xs space-y-1.5">
                {logs.length === 0 ? (
                  <p className="text-gray-500 italic">No operations yet. Click a button above to start a simulation.</p>
                ) : (
                  logs.map((entry) => {
                    return (
                      <div key={entry.step} className="flex gap-2 items-start">
                        <span className="text-gray-500 shrink-0 w-6">#{entry.step}</span>
                        <span
                          className={`${
                            entry.type === "success"
                              ? "text-green-400"
                              : entry.type === "error"
                              ? "text-red-400"
                              : entry.type === "rollback"
                              ? "text-orange-400"
                              : "text-blue-300"
                          }`}
                        >
                          {entry.message}
                        </span>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Concurrency Control Section */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <Lock size={24} className="text-amber-600" />
            Concurrency Control
          </h2>

          <div className="bg-white rounded-xl border-2 border-gray-200 p-6 md:p-8 shadow-sm mb-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Concurrency Problems</h3>
            <div className="grid md:grid-cols-3 gap-4">
              {CONCURRENCY_PROBLEMS.map((problem) => (
                <div key={problem.name} className="border-l-4 border-amber-500 pl-4 p-3 bg-amber-50 rounded-r-lg">
                  <h4 className="font-bold text-gray-900 mb-1">{problem.name}</h4>
                  <p className="text-sm text-gray-700 mb-2">{problem.desc}</p>
                  <p className="text-xs text-gray-500 italic">{problem.example}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl border-2 border-gray-200 p-6 md:p-8 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Isolation Levels Comparison</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="text-left py-3 px-4 font-bold text-gray-900">Isolation Level</th>
                    <th className="text-center py-3 px-4 font-bold text-gray-900">Dirty Read</th>
                    <th className="text-center py-3 px-4 font-bold text-gray-900">Non-repeatable Read</th>
                    <th className="text-center py-3 px-4 font-bold text-gray-900">Phantom Read</th>
                    <th className="text-left py-3 px-4 font-bold text-gray-900 hidden lg:table-cell">Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {ISOLATION_LEVELS.map((level) => (
                    <tr key={level.level} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4 font-semibold text-gray-900">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-xs font-bold ${
                            level.level === "Serializable"
                              ? "bg-green-100 text-green-700"
                              : level.level === "Read Uncommitted"
                              ? "bg-red-100 text-red-700"
                              : "bg-amber-100 text-amber-700"
                          }`}
                        >
                          {level.level}
                        </span>
                      </td>
                      <td className="text-center py-3 px-4">{level.dirty}</td>
                      <td className="text-center py-3 px-4">{level.nonrepeat}</td>
                      <td className="text-center py-3 px-4">{level.phantom}</td>
                      <td className="py-3 px-4 text-gray-600 text-xs hidden lg:table-cell">{level.desc}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* SQL Syntax Section */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <Database size={24} className="text-amber-600" />
            SQL Transaction Syntax
          </h2>
          <div className="bg-white rounded-xl border-2 border-gray-200 p-6 md:p-8 shadow-sm">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-bold text-gray-900 mb-3">Basic Transaction</h3>
                <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm overflow-x-auto mb-3">
                  <pre className="leading-relaxed">{`BEGIN TRANSACTION;

UPDATE accounts 
SET balance = balance - 200 
WHERE id = 1;

UPDATE accounts 
SET balance = balance + 200 
WHERE id = 2;

COMMIT;`}</pre>
                </div>
                <p className="text-xs text-gray-600">
                  A complete fund transfer wrapped in a transaction. Both UPDATEs succeed or neither does.
                </p>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-3">Transaction with ROLLBACK</h3>
                <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm overflow-x-auto mb-3">
                  <pre className="leading-relaxed">{`BEGIN TRANSACTION;

UPDATE accounts SET balance = balance - 200 WHERE id = 1;

-- Simulate error
IF @@ERROR > 0
    ROLLBACK;

UPDATE accounts SET balance = balance + 200 WHERE id = 2;

COMMIT;`}</pre>
                </div>
                <p className="text-xs text-gray-600">
                  Error handling with ROLLBACK — if the credit fails, the debit is undone.
                </p>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-3">Using SAVEPOINT</h3>
                <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm overflow-x-auto mb-3">
                  <pre className="leading-relaxed">{`BEGIN TRANSACTION;

SAVEPOINT sp1;

UPDATE products SET stock = stock - 1 WHERE id = 101;

IF @@ROWCOUNT = 0
    ROLLBACK TO SAVEPOINT sp1;

RELEASE SAVEPOINT sp1;

COMMIT;`}</pre>
                </div>
                <p className="text-xs text-gray-600">
                  SAVEPOINT lets you roll back part of a transaction without aborting entirely.
                </p>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-3">Setting Isolation Level</h3>
                <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm overflow-x-auto mb-3">
                  <pre className="leading-relaxed">{`SET TRANSACTION 
ISOLATION LEVEL SERIALIZABLE;

BEGIN TRANSACTION;

SELECT balance FROM accounts 
WHERE id = 1;

-- Other transactions cannot modify
-- accounts until this one commits

COMMIT;`}</pre>
                </div>
                <p className="text-xs text-gray-600">
                  Serializable isolation prevents all concurrency issues at the cost of performance.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Interview Questions */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <BookOpen size={24} className="text-amber-600" />
            Interview Questions
          </h2>
          <div className="space-y-4">
            {INTERVIEW_QUESTIONS.map((item, idx) => (
              <details
                key={idx}
                className="bg-white rounded-xl border-2 border-gray-200 p-6 shadow-sm group open:border-amber-400 transition-all"
              >
                <summary className="flex items-start gap-3 cursor-pointer list-none">
                  <span className="w-8 h-8 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-sm shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900 group-open:text-amber-700 transition-colors">
                      {item.q}
                    </h3>
                    <span className="text-xs text-amber-600 font-semibold group-open:inline hidden mt-1">
                      Click to collapse answer
                    </span>
                    <span className="text-xs text-gray-400 font-semibold group-open:hidden mt-1">
                      Click to reveal answer
                    </span>
                  </div>
                  <ChevronRight
                    size={20}
                    className="text-gray-400 group-open:rotate-90 transition-transform shrink-0 mt-1"
                  />
                </summary>
                <div className="mt-4 pl-11">
                  <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-lg">
                    <p className="text-sm text-gray-800 leading-relaxed">{item.a}</p>
                  </div>
                </div>
              </details>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
