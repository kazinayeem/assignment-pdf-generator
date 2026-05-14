"use client";

import { useState } from "react";
import Link from "next/link";
import { Home, ChevronRight } from "lucide-react";
import { Section, ComplexityBadge, CodeBlock, InfoCard, StepByStepBreakdown, VisualAnimationContainer, InterviewQuestions, AlgorithmCard } from "../components";

const ALGORITHMS = [
  { id: "trie-insert", name: "Trie Insert & Search", description: "Insert words into trie and search for exact matches", complexity: { time: "O(L)", space: "O(N*L)" }, featured: true, code: `class TrieNode:\n    def __init__(self):\n        self.children = {}\n        self.is_end = False\n\nclass Trie:\n    def __init__(self):\n        self.root = TrieNode()\n    \n    def insert(self, word):\n        node = self.root\n        for char in word:\n            if char not in node.children:\n                node.children[char] = TrieNode()\n            node = node.children[char]\n        node.is_end = True\n    \n    def search(self, word):\n        node = self.root\n        for char in word:\n            if char not in node.children:\n                return False\n            node = node.children[char]\n        return node.is_end` },
  { id: "prefix-search", name: "Prefix Search & Autocomplete", description: "Find all words with given prefix", complexity: { time: "O(L + M)", space: "O(N*L)" }, featured: true, code: `class TrieWithAutocomplete:\n    def __init__(self):\n        self.root = TrieNode()\n    \n    def insert(self, word):\n        node = self.root\n        for char in word:\n            if char not in node.children:\n                node.children[char] = TrieNode()\n            node = node.children[char]\n        node.is_end = True\n    \n    def search_prefix(self, prefix):\n        node = self.root\n        for char in prefix:\n            if char not in node.children:\n                return []\n            node = node.children[char]\n        return self._dfs(node, prefix)\n    \n    def _dfs(self, node, prefix):\n        result = []\n        if node.is_end:\n            result.append(prefix)\n        for char, child in node.children.items():\n            result.extend(self._dfs(child, prefix + char))\n        return result` },
  { id: "word-break-trie", name: "Word Break (Trie)", description: "Check if string can be segmented into dictionary words", complexity: { time: "O(n²)", space: "O(n + N*L)" }, featured: false, code: `def wordBreak(s, wordDict):\n    trie = Trie()\n    for word in wordDict:\n        trie.insert(word)\n    n = len(s)\n    dp = [False] * (n + 1)\n    dp[0] = True\n    for i in range(n):\n        if dp[i]:\n            node = trie.root\n            for j in range(i, n):\n                if s[j] not in node.children:\n                    break\n                node = node.children[s[j]]\n                if node.is_end:\n                    dp[j + 1] = True\n                if j + 1 == n:\n                    break\n    return dp[n]` },
  { id: "maximum-xor", name: "Maximum XOR Pair", description: "Find two numbers with maximum XOR using trie", complexity: { time: "O(n*32)", space: "O(n*32)" }, featured: false, code: `class BinaryTrie:\n    def __init__(self):\n        self.root = {}\n    \n    def insert(self, num):\n        node = self.root\n        for i in range(31, -1, -1):\n            bit = (num >> i) & 1\n            if bit not in node:\n                node[bit] = {}\n            node = node[bit]\n    \n    def max_xor(self, num):\n        node = self.root\n        xor = 0\n        for i in range(31, -1, -1):\n            bit = (num >> i) & 1\n            toggled = 1 - bit\n            if toggled in node:\n                xor |= (1 << i)\n                node = node[toggled]\n            else:\n                node = node[bit]\n        return xor` },
];

const USES = [
  { title: "Autocomplete", desc: "Search engines, IDE code completion, text prediction" },
  { title: "Spell Checkers", desc: "Dictionary lookup with suggestions for misspelled words" },
  { title: "IP Routing", desc: "Longest prefix matching in network routers" },
  { title: "Search Engines", desc: "Inverted index, prefix-based query suggestions" },
  { title: "Phone Directory", desc: "Contact search by name prefix" },
  { title: "Bioinformatics", desc: "Gene sequence pattern matching" },
];

const QUIZ = [
  { q: "What is the time complexity of trie search?", options: ["O(log n)", "O(L) where L is word length", "O(n)", "O(1)"], answer: 1 },
  { q: "What does each node in a trie store?", options: ["Full word", "Character + children", "Hash of word", "Index"], answer: 1 },
  { q: "What is the main advantage of trie over hash set?", options: ["Faster", "Prefix search", "Less memory", "Easier to implement"], answer: 1 },
  { q: "Space complexity of a trie with N words of avg length L?", options: ["O(N)", "O(N*L)", "O(L)", "O(N²)"], answer: 1 },
  { q: "Which problem is best solved with trie?", options: ["Two sum", "Autocomplete/prefix search", "Binary search", "Graph traversal"], answer: 1 },
];

export default function TriePage() {
  const [selected, setSelected] = useState("trie-insert");
  const [quiz, setQuiz] = useState<Record<number, number>>({});
  const [showResults, setShowResults] = useState(false);
  const algo = ALGORITHMS.find((a) => a.id === selected)!;
  const handleAnswer = (qi: number, ai: number) => setQuiz((p) => ({ ...p, [qi]: ai }));
  const quizScore = QUIZ.reduce((s, q, i) => s + (quiz[i] === q.answer ? 1 : 0), 0);

  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      <div className="flex items-center gap-2 mb-6 text-xs text-slate-500">
        <Link href="/tools/algorithms" className="text-indigo-600 no-underline flex items-center gap-1.5 hover:text-indigo-800 transition"><Home size={16} /> Algorithms</Link>
        <ChevronRight size={16} /><span className="text-slate-900 font-semibold">Trie Algorithms</span>
      </div>
      <div className="mb-10">
        <h1 className="text-4xl font-extrabold text-slate-900 mb-3">🌲 Trie Algorithms</h1>
        <p className="text-base text-slate-500 leading-relaxed max-w-xl">Master prefix trees (tries) for efficient string search, autocomplete, and prefix matching operations.</p>
      </div>
      <Section title="Overview">
        <InfoCard title="What is a Trie?" type="info">A trie (prefix tree) is a tree data structure where each node represents a character. Words are stored by traversing from root to leaf, sharing common prefixes. This enables O(L) search and efficient prefix operations that hash tables can't do.</InfoCard>
        <div className="bg-white rounded-xl border border-slate-200 p-6 mb-4">
          <h3 className="text-base font-bold text-slate-900 mb-4">Key Trie Algorithms</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">{ALGORITHMS.map((a) => <AlgorithmCard key={a.id} title={a.name} description={a.description} complexity={a.complexity} featured={a.featured} />)}</div>
        </div>
      </Section>
      <Section title="Interactive Visualizer">
        <div className="flex gap-2 flex-wrap mb-5">{ALGORITHMS.map((a) => (<button key={a.id} onClick={() => setSelected(a.id)} className={`px-4 py-2.5 rounded-lg text-xs font-medium cursor-pointer transition-all ${selected === a.id ? "bg-indigo-50 text-indigo-600 border-2 border-indigo-500" : "bg-white text-slate-500 border border-slate-200 hover:border-indigo-400"}`}>{a.name}</button>))}</div>
        <VisualAnimationContainer title="Trie Visualization">
          <div className="bg-slate-50 rounded-lg p-10 text-center text-slate-500 h-[300px] flex items-center justify-center flex-col">
            <div className="text-5xl mb-3">🌲</div>
            <p className="mb-4">{algo.name} Trie Visualizer</p>
            <p className="text-xs max-w-xs text-slate-400">Watch how words are inserted, searched, and how common prefixes share nodes in the trie.</p>
          </div>
        </VisualAnimationContainer>
        <div className="bg-white rounded-xl border border-slate-200 p-5 grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <button className="py-2.5 bg-indigo-600 text-white border-none rounded-lg font-semibold cursor-pointer text-xs hover:bg-indigo-700 transition">Insert Word</button>
          <button className="py-2.5 bg-purple-600 text-white border-none rounded-lg font-semibold cursor-pointer text-xs hover:bg-purple-700 transition">Search Word</button>
          <button className="py-2.5 bg-amber-600 text-white border-none rounded-lg font-semibold cursor-pointer text-xs hover:bg-amber-700 transition">Search Prefix</button>
          <button className="py-2.5 bg-red-500 text-white border-none rounded-lg font-semibold cursor-pointer text-xs hover:bg-red-600 transition">Reset</button>
        </div>
      </Section>
      <Section title={`Deep Dive: ${algo.name}`}>
        <div className="grid sm:grid-cols-3 gap-4 mb-5">
          <div className="bg-white rounded-xl border border-slate-200 p-4"><h4 className="text-[10px] font-bold text-slate-400 uppercase mb-2 tracking-wider">Time Complexity</h4><ComplexityBadge type="time" value={algo.complexity.time} /></div>
          <div className="bg-white rounded-xl border border-slate-200 p-4"><h4 className="text-[10px] font-bold text-slate-400 uppercase mb-2 tracking-wider">Space Complexity</h4><ComplexityBadge type="space" value={algo.complexity.space} /></div>
          <div className="bg-white rounded-xl border border-slate-200 p-4"><h4 className="text-[10px] font-bold text-slate-400 uppercase mb-2 tracking-wider">Best For</h4><span className="text-xs text-slate-900 font-semibold">Prefix Operations</span></div>
        </div>
        <InfoCard title="Trie Strategy" type="tip">{algo.id === "trie-insert" ? "Insert: traverse character by character, creating nodes as needed. Mark the final node as end of word. Search: traverse characters, return is_end at final node." : algo.id === "prefix-search" ? "First, navigate to the node representing the prefix. Then perform DFS from that node to collect all words with that prefix. Also useful for autocomplete suggestions." : algo.id === "word-break-trie" ? "Use DP + trie. dp[i] = can segment s[0:i]. For each position i where dp[i] is True, traverse trie from i to find all dictionary words starting at i, marking dp[j+1] = True for each match." : "Build a binary trie of numbers (32-bit). For each number, try to find the opposite bit at each position to maximize XOR. Greedily picking opposite bits yields max XOR."}</InfoCard>
        <CodeBlock code={algo.code} language="python" />
        <StepByStepBreakdown steps={[{ step: 1, title: "Define Node", desc: "Each node has children (dictionary/hash map) and an end-of-word flag." }, { step: 2, title: "Insert", desc: "Traverse character by character, creating missing nodes. Mark last node as end." }, { step: 3, title: "Search", desc: "Traverse characters. Return false if any character missing. Return is_end at final node." }, { step: 4, title: "Prefix Query", desc: "Navigate to prefix node, then collect all words in its subtree via DFS." }]} />
      </Section>
      <Section title="Real-World Applications"><div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">{USES.map((u, i) => (<div key={i} className="bg-white rounded-xl border border-slate-200 p-4"><h4 className="text-sm font-bold text-slate-900 mb-1.5">{u.title}</h4><p className="text-xs text-slate-500 leading-relaxed">{u.desc}</p></div>))}</div></Section>
      <Section title="Interview Questions">
        <InterviewQuestions questions={[
          { q: "When would you use trie over hash table?", a: "Trie excels when: 1) Prefix search is needed (autocomplete), 2) Words share common prefixes (memory efficient), 3) Lexicographic ordering is needed, 4) You need longest prefix matching (routing). Hash table can't do prefix search efficiently." },
          { q: "What are the memory tradeoffs of trie?", a: "Trie can use more memory than hash table for non-overlapping words (each node is an object). But for words with shared prefixes (like 'test', 'testing', 'tested'), trie is more memory efficient. Compressed trie (radix tree) reduces memory." },
          { q: "How would you implement autocomplete with trie?", a: "Insert all dictionary words. For a prefix, navigate to prefix node, then perform DFS to collect all words under that node. Sort by frequency/rank. Can optimize with top-k suggestions per node." },
        ]} />
      </Section>
      <Section title="Knowledge Check">
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="space-y-5">{QUIZ.map((q, qi) => (<div key={qi}><p className="text-sm font-semibold text-slate-900 mb-3">{qi + 1}. {q.q}</p><div className="grid sm:grid-cols-2 gap-2">{q.options.map((opt, oi) => { const selected = quiz[qi] === oi; const correct = showResults && oi === q.answer; const wrong = showResults && selected && oi !== q.answer; return (<button key={oi} onClick={() => !showResults && handleAnswer(qi, oi)} className={`text-xs text-left px-4 py-2.5 rounded-lg border transition-all cursor-pointer ${correct ? "bg-green-50 border-green-500 text-green-700" : wrong ? "bg-red-50 border-red-500 text-red-700" : selected ? "bg-indigo-50 border-indigo-500 text-indigo-700" : "bg-white border-slate-200 text-slate-600 hover:border-indigo-400"}`}>{opt}</button>); })}</div></div>))}</div>
          <div className="flex gap-3 mt-6">{!showResults ? (<button onClick={() => setShowResults(true)} className="px-6 py-2.5 bg-indigo-600 text-white rounded-lg text-xs font-semibold cursor-pointer hover:bg-indigo-700 transition">Submit Answers</button>) : (<div className="flex items-center gap-4"><span className="text-sm font-bold text-slate-900">Score: {quizScore}/{QUIZ.length}</span><button onClick={() => { setQuiz({}); setShowResults(false); }} className="px-6 py-2.5 bg-slate-100 text-slate-600 rounded-lg text-xs font-semibold cursor-pointer hover:bg-slate-200 transition">Reset</button></div>)}</div>
        </div>
      </Section>
      <Section title="What's Next?"><div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-xl p-6 text-white"><h3 className="text-lg font-bold mb-3">Related Topics</h3><p className="text-white/90 mb-4 text-sm">Continue your learning:</p><div className="grid sm:grid-cols-3 gap-3">{[{ name: "String Algorithms", href: "/tools/algorithms/string" }, { name: "Tree Algorithms", href: "/tools/algorithms/tree" }, { name: "Graph Algorithms", href: "/tools/algorithms/graph" }].map((t, i) => (<Link key={i} href={t.href} className="no-underline"><button className="w-full bg-white/20 border border-white/30 text-white py-3 rounded-lg font-semibold text-xs cursor-pointer hover:bg-white/30 transition">{t.name} →</button></Link>))}</div></div></Section>
    </div>
  );
}
