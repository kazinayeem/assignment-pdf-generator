"use client";

import { useState, useMemo, useCallback } from "react";
import Link from "next/link";
import { Regex, Copy, Check, AlertCircle, ChevronDown, ChevronUp, BookOpen, Hash, List, HelpCircle } from "lucide-react";

const PRESETS = [
  { label: "Email", pattern: "[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}", flags: "g" },
  { label: "Phone", pattern: "\\(?\\d{3}\\)?[-.\\s]?\\d{3}[-.\\s]?\\d{4}", flags: "g" },
  { label: "URL", pattern: "https?://[\\w.-]+(:\\d+)?(/[\\w./%-]*)?", flags: "g" },
  { label: "IPv4", pattern: "\\b(?:\\d{1,3}\\.){3}\\d{1,3}\\b", flags: "g" },
  { label: "Date (ISO)", pattern: "\\d{4}-\\d{2}-\\d{2}", flags: "g" },
  { label: "Hashtag", pattern: "#\\w+", flags: "g" },
];

const REGEX_THEORY = [
  { title: "What is a Regular Expression?", body: "A regular expression (regex) is a sequence of characters that defines a search pattern. It is used for string matching, validation, and text processing. In automata theory, every regular expression corresponds to a finite automaton (Kleene's theorem)." },
  { title: "Common Patterns", body: ". (any char), * (zero or more), + (one or more), ? (optional), [abc] (character class), [^abc] (negation), \\d (digit), \\w (word char), \\s (whitespace), | (alternation), () (grouping)" },
  { title: "Quantifiers", body: "* = {0,}, + = {1,}, ? = {0,1}, {n} = exactly n, {n,} = n or more, {n,m} = between n and m. These are greedy by default; add ? for lazy matching." },
  { title: "Thompson Construction", body: "Thompson's construction algorithm converts a regex into an equivalent NFA. It recursively builds NFA fragments for each subexpression: concatenation, alternation (|), Kleene star (*), and grouping. The resulting NFA has exactly one accepting state and can be converted to a DFA via subset construction." },
];

const INTERVIEW_QUESTIONS = [
  { q: "How would you match a valid email address using regex?", a: "A common pattern is [a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}. For RFC 5322 compliance, the pattern is significantly more complex, but this covers most practical cases. Note that regex alone cannot validate all edge cases (e.g., nested comments)." },
  { q: "What is the difference between greedy and lazy quantifiers?", a: "Greedy quantifiers (default: *, +, {n,m}) match as much as possible while still allowing the overall pattern to match. Lazy quantifiers (*?, +?, {n,m}?) match as little as possible. For example, on 'aaab', /a+b/ matches 'aaab' greedily, but /a+?b/ still needs the 'b', so it also matches 'aaab' but tries fewer 'a's first." },
  { q: "Explain Kleene's theorem and its significance.", a: "Kleene's theorem states that a language is regular if and only if it can be described by a regular expression. This bridges the gap between algebraic descriptions (regex) and machine-based recognition (finite automata). It implies that we can always convert between regex and DFA/NFA, which is the foundation of tools like grep, lex, and pattern matching in programming languages." },
];

function HighlightedText({ text, matches, isGlobal }: { text: string; matches: RegExpExecArray[]; isGlobal: boolean }) {
  if (matches.length === 0) return <span className="text-slate-600 whitespace-pre-wrap">{text}</span>;

  const segments: { start: number; end: number; matched: boolean }[] = [];
  let lastIndex = 0;

  if (isGlobal) {
    for (const m of matches) {
      if (m.index > lastIndex) segments.push({ start: lastIndex, end: m.index, matched: false });
      segments.push({ start: m.index, end: m.index + m[0].length, matched: true });
      lastIndex = m.index + m[0].length;
    }
  } else {
    const m = matches[0];
    if (m.index > 0) segments.push({ start: 0, end: m.index, matched: false });
    segments.push({ start: m.index, end: m.index + m[0].length, matched: true });
    lastIndex = m.index + m[0].length;
  }
  if (lastIndex < text.length) segments.push({ start: lastIndex, end: text.length, matched: false });

  return (
    <span className="whitespace-pre-wrap">
      {segments.map((seg, i) =>
        seg.matched ? (
          <mark key={i} className="bg-yellow-200 text-slate-900 rounded-sm px-0.5">{text.slice(seg.start, seg.end)}</mark>
        ) : (
          <span key={i} className="text-slate-600">{text.slice(seg.start, seg.end)}</span>
        )
      )}
    </span>
  );
}

export default function RegexPage() {
  const [pattern, setPattern] = useState("\\d{3}-\\d{2}-\\d{4}");
  const [flags, setFlags] = useState("g");
  const [testString, setTestString] = useState("Contact us at 123-45-6789 or 987-65-4321.\nEmail: john@example.com\nVisit https://example.com");
  const [expandedTheory, setExpandedTheory] = useState(false);
  const [copied, setCopied] = useState(false);

  const regex = useMemo(() => {
    try {
      return new RegExp(pattern, flags);
    } catch {
      return null;
    }
  }, [pattern, flags]);

  const matches = useMemo(() => {
    if (!regex) return [];
    const results: RegExpExecArray[] = [];
    const r = new RegExp(regex.source, regex.flags.includes("g") ? regex.flags : regex.flags + "g");
    let m: RegExpExecArray | null;
    while ((m = r.exec(testString)) !== null) {
      results.push(m);
      if (!r.flags.includes("g")) break;
    }
    return results;
  }, [regex, testString]);

  const error = useMemo(() => {
    if (!pattern) return "Enter a pattern";
    try { new RegExp(pattern); return null; } catch (e: unknown) { return (e as Error).message; }
  }, [pattern]);

  const handlePreset = useCallback((p: typeof PRESETS[0]) => {
    setPattern(p.pattern);
    setFlags(p.flags);
  }, []);

  const copyMatches = useCallback(() => {
    navigator.clipboard.writeText(matches.map((m) => m[0]).join("\n"));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [matches]);

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-5xl px-4 py-6">
        <nav className="flex items-center gap-2 text-xs text-slate-400 mb-6">
          <Link href="/tools" className="hover:text-indigo-600 transition-colors">Tools</Link>
          <span>/</span>
          <Link href="/tools/theory-of-computing" className="hover:text-indigo-600 transition-colors">Theory of Comp.</Link>
          <span>/</span>
          <span className="text-slate-700 font-medium">Regex Engine</span>
        </nav>

        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-md">
            <Regex size={20} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Regex Engine</h1>
            <p className="text-xs text-slate-500">Test regular expressions with live match highlighting</p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-4">
            <div className="rounded-xl bg-white border border-slate-200 shadow-sm p-4">
              <label className="block text-xs font-semibold text-slate-500 mb-1.5">Pattern</label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-mono text-sm">/</span>
                  <input value={pattern} onChange={(e) => setPattern(e.target.value)} className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-7 pr-3 text-sm font-mono text-slate-800 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100" placeholder="Enter regex pattern" />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 font-mono text-sm">/{flags}</span>
                </div>
              </div>
              {error && <p className="mt-1 flex items-center gap-1 text-xs text-red-500"><AlertCircle size={12} /> {error}</p>}
              <div className="mt-3 flex flex-wrap gap-1.5">
                {PRESETS.map((p) => (
                  <button key={p.label} onClick={() => handlePreset(p)} className="rounded-md bg-slate-100 px-2.5 py-1 text-[10px] font-medium text-slate-600 hover:bg-indigo-100 hover:text-indigo-700 transition-colors cursor-pointer">{p.label}</button>
                ))}
              </div>
            </div>

            <div className="rounded-xl bg-white border border-slate-200 shadow-sm p-4">
              <label className="block text-xs font-semibold text-slate-500 mb-1.5">Test String</label>
              <textarea value={testString} onChange={(e) => setTestString(e.target.value)} rows={5} className="w-full rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm font-mono text-slate-800 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100 resize-y" placeholder="Enter test strings here..." />
            </div>

            <div className="rounded-xl bg-white border border-slate-200 shadow-sm p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xs font-semibold text-slate-500">Matches {matches.length > 0 && <span className="text-indigo-600">({matches.length})</span>}</h3>
                {matches.length > 0 && (
                  <button onClick={copyMatches} className="flex items-center gap-1 text-[10px] text-slate-400 hover:text-indigo-600 transition-colors cursor-pointer">
                    {copied ? <Check size={12} /> : <Copy size={12} />} {copied ? "Copied" : "Copy"}
                  </button>
                )}
              </div>
              {matches.length > 0 ? (
                <div className="max-h-32 overflow-y-auto space-y-1">
                  {matches.map((m, i) => (
                    <div key={i} className="flex items-center gap-2 rounded-md bg-indigo-50 px-3 py-1.5">
                      <Hash size={10} className="text-indigo-400 shrink-0" />
                      <span className="font-mono text-xs text-indigo-800">{m[0]}</span>
                      <span className="ml-auto text-[10px] text-indigo-400">pos {m.index}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-400">No matches found</p>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-xl bg-white border border-slate-200 shadow-sm p-4">
              <h3 className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 mb-3"><List size={14} /> Highlighted View</h3>
              <div className="min-h-[200px] rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm font-mono leading-relaxed">
                <HighlightedText text={testString} matches={matches} isGlobal={flags.includes("g")} />
              </div>
            </div>

            <div className="rounded-xl bg-white border border-slate-200 shadow-sm p-4">
              <button onClick={() => setExpandedTheory(!expandedTheory)} className="flex items-center justify-between w-full text-xs font-semibold text-slate-500 cursor-pointer">
                <span className="flex items-center gap-1.5"><BookOpen size={14} /> Regex Theory</span>
                {expandedTheory ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </button>
              {expandedTheory && (
                <div className="mt-3 space-y-3">
                  {REGEX_THEORY.map((t) => (
                    <div key={t.title}>
                      <h4 className="text-xs font-semibold text-slate-700 mb-0.5">{t.title}</h4>
                      <p className="text-[11px] text-slate-500 leading-relaxed">{t.body}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-8 rounded-xl bg-white border border-slate-200 shadow-sm p-5">
          <h2 className="flex items-center gap-2 text-base font-bold text-slate-800 mb-4"><HelpCircle size={18} className="text-indigo-500" /> Interview Questions</h2>
          <div className="space-y-4">
            {INTERVIEW_QUESTIONS.map((item, i) => (
              <div key={i} className="rounded-lg bg-slate-50 p-4">
                <p className="text-sm font-semibold text-slate-800 mb-1">Q{i + 1}: {item.q}</p>
                <p className="text-xs text-slate-600 leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
