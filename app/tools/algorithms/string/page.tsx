"use client";

import { useState } from "react";
import Link from "next/link";
import { Home, ChevronRight } from "lucide-react";
import { Section, ComplexityBadge, CodeBlock, InfoCard, StepByStepBreakdown, VisualAnimationContainer, InterviewQuestions, AlgorithmCard } from "../components";

const ALGORITHMS = [
  { id: "kmp", name: "KMP Pattern Matching", description: "Linear-time pattern matching using prefix function", complexity: { time: "O(n+m)", space: "O(m)" }, featured: true, code: `def kmp(text, pattern):\n    n, m = len(text), len(pattern)\n    lps = [0] * m\n    j = 0\n    for i in range(1, m):\n        while j > 0 and pattern[i] != pattern[j]:\n            j = lps[j-1]\n        if pattern[i] == pattern[j]:\n            j += 1\n            lps[i] = j\n    j = 0\n    for i in range(n):\n        while j > 0 and text[i] != pattern[j]:\n            j = lps[j-1]\n        if text[i] == pattern[j]:\n            j += 1\n        if j == m:\n            return i - m + 1\n    return -1` },
  { id: "rabin-karp", name: "Rabin-Karp", description: "Pattern matching using rolling hash", complexity: { time: "O(n+m) avg, O(nm) worst", space: "O(1)" }, featured: false, code: `def rabinKarp(text, pattern):\n    n, m = len(text), len(pattern)\n    if m > n: return -1\n    base, mod = 256, 10**9+7\n    hp = sum(ord(pattern[i]) * pow(base, m-1-i, mod) for i in range(m)) % mod\n    ht = sum(ord(text[i]) * pow(base, m-1-i, mod) for i in range(m)) % mod\n    for i in range(n-m+1):\n        if hp == ht:\n            if text[i:i+m] == pattern:\n                return i\n        if i < n-m:\n            ht = (base * (ht - ord(text[i]) * pow(base, m-1, mod)) + ord(text[i+m])) % mod\n    return -1` },
  { id: "lcs-string", name: "Longest Common Subsequence", description: "Find longest subsequence common to two strings", complexity: { time: "O(n*m)", space: "O(min(n,m))" }, featured: false, code: `def lcs(text1, text2):\n    m, n = len(text1), len(text2)\n    if m < n: return lcs(text2, text1)\n    dp = [0] * (n + 1)\n    for i in range(1, m + 1):\n        prev = 0\n        for j in range(1, n + 1):\n            temp = dp[j]\n            if text1[i-1] == text2[j-1]:\n                dp[j] = prev + 1\n            else:\n                dp[j] = max(dp[j], dp[j-1])\n            prev = temp\n    return dp[n]` },
  { id: "manacher", name: "Manacher's Algorithm", description: "Find all palindromic substrings in O(n)", complexity: { time: "O(n)", space: "O(n)" }, featured: false, code: `def manacher(s):\n    t = '#' + '#'.join(s) + '#'\n    n = len(t)\n    radii = [0] * n\n    center = right = 0\n    for i in range(n):\n        if i < right:\n            radii[i] = min(right - i, radii[2*center - i])\n        while i - radii[i] - 1 >= 0 and i + radii[i] + 1 < n and t[i-radii[i]-1] == t[i+radii[i]+1]:\n            radii[i] += 1\n        if i + radii[i] > right:\n            center, right = i, i + radii[i]\n    return max(radii)` },
  { id: "anagram", name: "Anagram Detection", description: "Check if two strings are anagrams", complexity: { time: "O(n)", space: "O(1)" }, featured: false, code: `from collections import Counter\n\ndef isAnagram(s, t):\n    if len(s) != len(t): return False\n    return Counter(s) == Counter(t)` },
];

const USES = [
  { title: "Text Editors", desc: "Find and replace, spell checking, auto-complete" },
  { title: "Search Engines", desc: "Pattern matching in crawled documents, query suggestions" },
  { title: "Bioinformatics", desc: "DNA sequence alignment and pattern matching" },
  { title: "Network Security", desc: "Intrusion detection systems match attack patterns" },
  { title: "Plagiarism Detection", desc: "String matching to find similar text passages" },
  { title: "Compression", desc: "String algorithms for LZ77, LZW, and other compressors" },
];

const QUIZ = [
  { q: "What is the time complexity of KMP?", options: ["O(n*m)", "O(n+m)", "O(n²)", "O(2ⁿ)"], answer: 1 },
  { q: "What does LPS array store in KMP?", options: ["Length of longest prefix suffix", "Length of pattern", "Hash values", "Character positions"], answer: 0 },
  { q: "What technique does Rabin-Karp use?", options: ["Prefix function", "Rolling hash", "Suffix tree", "Dynamic programming"], answer: 1 },
  { q: "Manacher's algorithm finds what in O(n)?", options: ["LCS", "Palindromic substrings", "Pattern matches", "Anagrams"], answer: 1 },
  { q: "What is the space-optimized LCS approach?", options: ["2D array", "1D rolling array", "Hash table", "Stack"], answer: 1 },
];

export default function StringPage() {
  const [selected, setSelected] = useState("kmp");
  const [quiz, setQuiz] = useState<Record<number, number>>({});
  const [showResults, setShowResults] = useState(false);
  const algo = ALGORITHMS.find((a) => a.id === selected)!;
  const handleAnswer = (qi: number, ai: number) => setQuiz((p) => ({ ...p, [qi]: ai }));
  const quizScore = QUIZ.reduce((s, q, i) => s + (quiz[i] === q.answer ? 1 : 0), 0);

  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      <div className="flex items-center gap-2 mb-6 text-xs text-slate-500">
        <Link href="/tools/algorithms" className="text-indigo-600 no-underline flex items-center gap-1.5 hover:text-indigo-800 transition"><Home size={16} /> Algorithms</Link>
        <ChevronRight size={16} /><span className="text-slate-900 font-semibold">String Algorithms</span>
      </div>
      <div className="mb-10">
        <h1 className="text-4xl font-extrabold text-slate-900 mb-3">📝 String Algorithms</h1>
        <p className="text-base text-slate-500 leading-relaxed max-w-xl">Master pattern matching, string searching, and manipulation algorithms. Essential for text processing and bioinformatics.</p>
      </div>
      <Section title="Overview">
        <InfoCard title="What are String Algorithms?" type="info">String algorithms process and analyze text. They handle pattern matching (finding substrings), comparison (similarity, anagrams), transformation (editing, compressing), and analysis (palindromes, subsequences).</InfoCard>
        <div className="bg-white rounded-xl border border-slate-200 p-6 mb-4">
          <h3 className="text-base font-bold text-slate-900 mb-4">Key String Algorithms</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">{ALGORITHMS.map((a) => <AlgorithmCard key={a.id} title={a.name} description={a.description} complexity={a.complexity} featured={a.featured} />)}</div>
        </div>
      </Section>
      <Section title="Interactive Visualizer">
        <div className="flex gap-2 flex-wrap mb-5">{ALGORITHMS.map((a) => (<button key={a.id} onClick={() => setSelected(a.id)} className={`px-4 py-2.5 rounded-lg text-xs font-medium cursor-pointer transition-all ${selected === a.id ? "bg-indigo-50 text-indigo-600 border-2 border-indigo-500" : "bg-white text-slate-500 border border-slate-200 hover:border-indigo-400"}`}>{a.name}</button>))}</div>
        <VisualAnimationContainer title="String Algorithm Visualization">
          <div className="bg-slate-50 rounded-lg p-10 text-center text-slate-500 h-[300px] flex items-center justify-center flex-col">
            <div className="text-5xl mb-3">📝</div>
            <p className="mb-4">{algo.name} Visualizer</p>
            <p className="text-xs max-w-xs text-slate-400">Watch string matching in action with character-by-character comparison highlighting.</p>
          </div>
        </VisualAnimationContainer>
        <div className="bg-white rounded-xl border border-slate-200 p-5 grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <button className="py-2.5 bg-indigo-600 text-white border-none rounded-lg font-semibold cursor-pointer text-xs hover:bg-indigo-700 transition">Generate Text</button>
          <button className="py-2.5 bg-purple-600 text-white border-none rounded-lg font-semibold cursor-pointer text-xs hover:bg-purple-700 transition">Run Algorithm</button>
          <input type="range" min="0.1" max="2" step="0.1" defaultValue="1" className="w-full" />
          <button className="py-2.5 bg-red-500 text-white border-none rounded-lg font-semibold cursor-pointer text-xs hover:bg-red-600 transition">Reset</button>
        </div>
      </Section>
      <Section title={`Deep Dive: ${algo.name}`}>
        <div className="grid sm:grid-cols-3 gap-4 mb-5">
          <div className="bg-white rounded-xl border border-slate-200 p-4"><h4 className="text-[10px] font-bold text-slate-400 uppercase mb-2 tracking-wider">Time Complexity</h4><ComplexityBadge type="time" value={algo.complexity.time} /></div>
          <div className="bg-white rounded-xl border border-slate-200 p-4"><h4 className="text-[10px] font-bold text-slate-400 uppercase mb-2 tracking-wider">Space Complexity</h4><ComplexityBadge type="space" value={algo.complexity.space} /></div>
          <div className="bg-white rounded-xl border border-slate-200 p-4"><h4 className="text-[10px] font-bold text-slate-400 uppercase mb-2 tracking-wider">Type</h4><span className="text-xs text-slate-900 font-semibold">{algo.id === "kmp" || algo.id === "rabin-karp" ? "Pattern Matching" : algo.id === "lcs-string" ? "Subsequence" : algo.id === "manacher" ? "Palindrome" : "Comparison"}</span></div>
        </div>
        <InfoCard title="Algorithm Approach" type="tip">{algo.id === "kmp" ? "KMP computes an LPS array that stores the longest proper prefix which is also a suffix. When a mismatch occurs, we use LPS to skip characters we already know match, avoiding backtracking in the text." : algo.id === "rabin-karp" ? "Rabin-Karp computes a rolling hash of the pattern and window-sized substring of the text. Hash collision is handled by direct comparison. Average case is O(n+m), worst case O(nm) with many hash collisions." : algo.id === "lcs-string" ? "DP approach: if characters match, dp[j] = prev + 1 (where prev is diagonal value). Otherwise dp[j] = max(dp[j], dp[j-1]). Using 1D array optimizes space." : algo.id === "manacher" ? "Manacher's transforms the string with separators (#), then uses mirror property of palindromes to avoid redundant checks. Maintains center and right boundary of current palindrome." : "Use hash map / Counter to count character frequencies. Both strings must have identical character counts to be anagrams. O(n) time, O(1) space (26 letters for lowercase)."}</InfoCard>
        <CodeBlock code={algo.code} language="python" />
        <StepByStepBreakdown steps={[{ step: 1, title: "Preprocess", desc: "Some algorithms (KMP, Manacher) need preprocessing of pattern/string." }, { step: 2, title: "Scan/Compare", desc: "Iterate through text/string, applying the core comparison logic." }, { step: 3, title: "Handle Mismatches", desc: "Use preprocessing info to skip redundant comparisons on mismatch." }, { step: 4, title: "Return Result", desc: "The answer is either match index, length, or boolean based on problem." }]} />
      </Section>
      <Section title="Real-World Applications"><div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">{USES.map((u, i) => (<div key={i} className="bg-white rounded-xl border border-slate-200 p-4"><h4 className="text-sm font-bold text-slate-900 mb-1.5">{u.title}</h4><p className="text-xs text-slate-500 leading-relaxed">{u.desc}</p></div>))}</div></Section>
      <Section title="Interview Questions">
        <InterviewQuestions questions={[
          { q: "When would you use KMP over Rabin-Karp?", a: "KMP has guaranteed O(n+m) time regardless of input. Rabin-Karp has O(n+m) average but O(nm) worst case. KMP is better when worst-case performance matters. Rabin-Karp is better for multi-pattern search (one hash, many patterns)." },
          { q: "What is string hashing and its tradeoffs?", a: "String hashing maps strings to integers for O(1) comparison. Rolling hash updates in O(1) as window slides. Tradeoff: hash collisions require verification. Use double hashing or large prime mod to reduce collisions." },
          { q: "How do you find longest palindromic substring efficiently?", a: "Manacher's algorithm solves this in O(n). Expand around center approach is O(n²). DP is also O(n²) with O(n²) space. Manacher uses palindrome symmetry to avoid redundant expansions." },
        ]} />
      </Section>
      <Section title="Knowledge Check">
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="space-y-5">{QUIZ.map((q, qi) => (<div key={qi}><p className="text-sm font-semibold text-slate-900 mb-3">{qi + 1}. {q.q}</p><div className="grid sm:grid-cols-2 gap-2">{q.options.map((opt, oi) => { const selected = quiz[qi] === oi; const correct = showResults && oi === q.answer; const wrong = showResults && selected && oi !== q.answer; return (<button key={oi} onClick={() => !showResults && handleAnswer(qi, oi)} className={`text-xs text-left px-4 py-2.5 rounded-lg border transition-all cursor-pointer ${correct ? "bg-green-50 border-green-500 text-green-700" : wrong ? "bg-red-50 border-red-500 text-red-700" : selected ? "bg-indigo-50 border-indigo-500 text-indigo-700" : "bg-white border-slate-200 text-slate-600 hover:border-indigo-400"}`}>{opt}</button>); })}</div></div>))}</div>
          <div className="flex gap-3 mt-6">{!showResults ? (<button onClick={() => setShowResults(true)} className="px-6 py-2.5 bg-indigo-600 text-white rounded-lg text-xs font-semibold cursor-pointer hover:bg-indigo-700 transition">Submit Answers</button>) : (<div className="flex items-center gap-4"><span className="text-sm font-bold text-slate-900">Score: {quizScore}/{QUIZ.length}</span><button onClick={() => { setQuiz({}); setShowResults(false); }} className="px-6 py-2.5 bg-slate-100 text-slate-600 rounded-lg text-xs font-semibold cursor-pointer hover:bg-slate-200 transition">Reset</button></div>)}</div>
        </div>
      </Section>
      <Section title="What's Next?"><div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-xl p-6 text-white"><h3 className="text-lg font-bold mb-3">Related Topics</h3><p className="text-white/90 mb-4 text-sm">Continue learning:</p><div className="grid sm:grid-cols-3 gap-3">{[{ name: "Trie Algorithms", href: "/tools/algorithms/trie" }, { name: "Sliding Window", href: "/tools/algorithms/sliding-window" }, { name: "Dynamic Programming", href: "/tools/algorithms/dynamic-programming" }].map((t, i) => (<Link key={i} href={t.href} className="no-underline"><button className="w-full bg-white/20 border border-white/30 text-white py-3 rounded-lg font-semibold text-xs cursor-pointer hover:bg-white/30 transition">{t.name} →</button></Link>))}</div></div></Section>
    </div>
  );
}
