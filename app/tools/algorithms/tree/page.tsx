"use client";

import { useState } from "react";
import Link from "next/link";
import { Home, ChevronRight } from "lucide-react";
import { Section, ComplexityBadge, CodeBlock, InfoCard, StepByStepBreakdown, VisualAnimationContainer, InterviewQuestions, AlgorithmCard } from "../components";

const ALGORITHMS = [
  { id: "inorder", name: "Inorder Traversal", description: "Left → Root → Right. Produces sorted order for BSTs.", complexity: { time: "O(n)", space: "O(h)" }, featured: true, code: "def inorder(node):\n    if not node: return\n    inorder(node.left)\n    print(node.val)\n    inorder(node.right)" },
  { id: "preorder", name: "Preorder Traversal", description: "Root → Left → Right. Used for copying trees.", complexity: { time: "O(n)", space: "O(h)" }, featured: false, code: "def preorder(node):\n    if not node: return\n    print(node.val)\n    preorder(node.left)\n    preorder(node.right)" },
  { id: "postorder", name: "Postorder Traversal", description: "Left → Right → Root. Used for deleting trees.", complexity: { time: "O(n)", space: "O(h)" }, featured: false, code: "def postorder(node):\n    if not node: return\n    postorder(node.left)\n    postorder(node.right)\n    print(node.val)" },
  { id: "level-order", name: "Level Order Traversal", description: "BFS on tree, visit nodes level by level.", complexity: { time: "O(n)", space: "O(n)" }, featured: true, code: "from collections import deque\n\ndef levelOrder(root):\n    if not root: return []\n    result = []\n    queue = deque([root])\n    while queue:\n        level = []\n        for _ in range(len(queue)):\n            node = queue.popleft()\n            level.append(node.val)\n            if node.left: queue.append(node.left)\n            if node.right: queue.append(node.right)\n        result.append(level)\n    return result" },
  { id: "bst-search", name: "BST Search", description: "Efficient search in a binary search tree.", complexity: { time: "O(h)", space: "O(1)" }, featured: false, code: "def searchBST(root, val):\n    while root and root.val != val:\n        if val < root.val:\n            root = root.left\n        else:\n            root = root.right\n    return root" },
  { id: "lca", name: "Lowest Common Ancestor", description: "Find LCA of two nodes in a binary tree.", complexity: { time: "O(n)", space: "O(h)" }, featured: false, code: "def lowestCommonAncestor(root, p, q):\n    if not root or root == p or root == q:\n        return root\n    left = lowestCommonAncestor(root.left, p, q)\n    right = lowestCommonAncestor(root.right, p, q)\n    if left and right: return root\n    return left or right" },
];

const USES = [
  { title: "File Systems", desc: "Hierarchical directory/folder structures are trees" },
  { title: "HTML DOM", desc: "Browser represents HTML as a tree (Document Object Model)" },
  { title: "Databases", desc: "B-Trees and B+ Trees index database records efficiently" },
  { title: "Compilers", desc: "Abstract Syntax Trees (ASTs) represent program structure" },
  { title: "Network Routing", desc: "Spanning trees prevent loops in network broadcasts" },
  { title: "AI Decision Trees", desc: "Decision trees and random forests for classification" },
];

const QUIZ = [
  { q: "Which traversal produces sorted order in BST?", options: ["Preorder", "Inorder", "Postorder", "Level order"], answer: 1 },
  { q: "Height of a balanced BST with n nodes is:", options: ["O(n)", "O(log n)", "O(√n)", "O(1)"], answer: 1 },
  { q: "Which traversal is used to delete a tree?", options: ["Preorder", "Inorder", "Postorder", "Level order"], answer: 2 },
  { q: "What traversal mimics BFS?", options: ["Preorder", "Inorder", "Postorder", "Level order"], answer: 3 },
  { q: "What is the space complexity of level order traversal?", options: ["O(1)", "O(log n)", "O(n)", "O(h)"], answer: 2 },
];

export default function TreePage() {
  const [selected, setSelected] = useState("inorder");
  const [quiz, setQuiz] = useState<Record<number, number>>({});
  const [showResults, setShowResults] = useState(false);
  const algo = ALGORITHMS.find((a) => a.id === selected)!;
  const handleAnswer = (qi: number, ai: number) => setQuiz((p) => ({ ...p, [qi]: ai }));
  const quizScore = QUIZ.reduce((s, q, i) => s + (quiz[i] === q.answer ? 1 : 0), 0);

  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      <div className="flex items-center gap-2 mb-6 text-xs text-slate-500">
        <Link href="/tools/algorithms" className="text-indigo-600 no-underline flex items-center gap-1.5 hover:text-indigo-800 transition"><Home size={16} /> Algorithms</Link>
        <ChevronRight size={16} /><span className="text-slate-900 font-semibold">Tree Algorithms</span>
      </div>
      <div className="mb-10">
        <h1 className="text-4xl font-extrabold text-slate-900 mb-3">🌳 Tree Algorithms</h1>
        <p className="text-base text-slate-500 leading-relaxed max-w-xl">Master tree traversals, binary search trees, and advanced tree operations. Trees are fundamental in databases, compilers, and AI.</p>
      </div>
      <Section title="Overview">
        <InfoCard title="What are Tree Algorithms?" type="info">Trees are hierarchical data structures with a root node and child subtrees. Tree algorithms handle traversal (visiting all nodes), search (finding specific nodes), and modification (insert/delete). Binary Search Trees enable O(log n) operations.</InfoCard>
        <div className="bg-white rounded-xl border border-slate-200 p-6 mb-4">
          <h3 className="text-base font-bold text-slate-900 mb-4">Key Tree Algorithms</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">{ALGORITHMS.map((a) => <AlgorithmCard key={a.id} title={a.name} description={a.description} complexity={a.complexity} featured={a.featured} />)}</div>
        </div>
      </Section>
      <Section title="Interactive Visualizer">
        <div className="flex gap-2 flex-wrap mb-5">{ALGORITHMS.map((a) => (<button key={a.id} onClick={() => setSelected(a.id)} className={`px-4 py-2.5 rounded-lg text-xs font-medium cursor-pointer transition-all ${selected === a.id ? "bg-indigo-50 text-indigo-600 border-2 border-indigo-500" : "bg-white text-slate-500 border border-slate-200 hover:border-indigo-400"}`}>{a.name}</button>))}</div>
        <VisualAnimationContainer title="Tree Visualization">
          <div className="bg-slate-50 rounded-lg p-10 text-center text-slate-500 h-[300px] flex items-center justify-center flex-col">
            <div className="text-5xl mb-3">🌳</div>
            <p className="mb-4">{algo.name} Tree Visualizer</p>
            <p className="text-xs max-w-xs text-slate-400">Watch nodes being traversed with highlights showing the current node and direction.</p>
          </div>
        </VisualAnimationContainer>
        <div className="bg-white rounded-xl border border-slate-200 p-5 grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <button className="py-2.5 bg-indigo-600 text-white border-none rounded-lg font-semibold cursor-pointer text-xs hover:bg-indigo-700 transition">Generate Tree</button>
          <button className="py-2.5 bg-purple-600 text-white border-none rounded-lg font-semibold cursor-pointer text-xs hover:bg-purple-700 transition">Start Traversal</button>
          <input type="range" min="0.1" max="2" step="0.1" defaultValue="1" className="w-full" />
          <button className="py-2.5 bg-red-500 text-white border-none rounded-lg font-semibold cursor-pointer text-xs hover:bg-red-600 transition">Reset</button>
        </div>
      </Section>
      <Section title={`Deep Dive: ${algo.name}`}>
        <div className="grid sm:grid-cols-3 gap-4 mb-5">
          <div className="bg-white rounded-xl border border-slate-200 p-4"><h4 className="text-[10px] font-bold text-slate-400 uppercase mb-2 tracking-wider">Time Complexity</h4><ComplexityBadge type="time" value={algo.complexity.time} /></div>
          <div className="bg-white rounded-xl border border-slate-200 p-4"><h4 className="text-[10px] font-bold text-slate-400 uppercase mb-2 tracking-wider">Space Complexity</h4><ComplexityBadge type="space" value={algo.complexity.space} /></div>
          <div className="bg-white rounded-xl border border-slate-200 p-4"><h4 className="text-[10px] font-bold text-slate-400 uppercase mb-2 tracking-wider">Method</h4><span className="text-xs text-slate-900 font-semibold">{algo.id.includes("order") ? "Recursive/Iterative" : algo.id === "bst-search" ? "Iterative" : "Recursive"}</span></div>
        </div>
        <InfoCard title="Algorithm Approach" type="tip">{algo.id === "inorder" ? "Visit left subtree, then root, then right subtree. For BSTs, this visits nodes in ascending order. Iterative version uses explicit stack." : algo.id === "preorder" ? "Visit root first, then left subtree, then right subtree. Useful for creating a copy of the tree (serialization)." : algo.id === "postorder" ? "Visit left subtree, right subtree, then root. Used for deleting trees (delete children before parent)." : algo.id === "level-order" ? "Use a queue. Process current node, then enqueue its children. This visits nodes level by level from top to bottom." : algo.id === "bst-search" ? "At each node, compare target with node value. If equal, found. If smaller, go left. If larger, go right. Uses BST property: left < root < right." : "Recursively find LCA: if both nodes are in left subtree, LCA is in left. If both in right, LCA is in right. If one in each, current node is LCA."}</InfoCard>
        <CodeBlock code={algo.code} language="python" />
        <StepByStepBreakdown steps={[{ step: 1, title: "Choose Traversal", desc: "Select order based on what you need: inorder for sorted, preorder for copy, postorder for deletion." }, { step: 2, title: "Handle Base Case", desc: "If node is null, return (do nothing). This is the foundation of recursive traversal." }, { step: 3, title: "Recursive Calls", desc: "Make recursive calls in the correct order with left and right children." }, { step: 4, title: "Process Node", desc: "Print, collect, or transform node value at the appropriate point in the recursion." }]} />
      </Section>
      <Section title="Real-World Applications"><div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">{USES.map((u, i) => (<div key={i} className="bg-white rounded-xl border border-slate-200 p-4"><h4 className="text-sm font-bold text-slate-900 mb-1.5">{u.title}</h4><p className="text-xs text-slate-500 leading-relaxed">{u.desc}</p></div>))}</div></Section>
      <Section title="Interview Questions">
        <InterviewQuestions questions={[
          { q: "What's the difference between a binary tree and BST?", a: "Binary tree: each node has at most 2 children, no ordering. BST: for each node, left subtree has smaller values, right subtree has larger values. BST enables O(h) search." },
          { q: "How do you check if a binary tree is balanced?", a: "Check that height difference between left and right subtrees ≤ 1 for every node. Can be done with a recursive function that returns height and checks balance simultaneously (postorder)." },
          { q: "What is tree serialization?", a: "Serialization converts a tree to a string (e.g., for network transmission). Preorder traversal with null markers works well. Deserialization reconstructs the tree from the string." },
        ]} />
      </Section>
      <Section title="Knowledge Check">
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="space-y-5">{QUIZ.map((q, qi) => (<div key={qi}><p className="text-sm font-semibold text-slate-900 mb-3">{qi + 1}. {q.q}</p><div className="grid sm:grid-cols-2 gap-2">{q.options.map((opt, oi) => { const selected = quiz[qi] === oi; const correct = showResults && oi === q.answer; const wrong = showResults && selected && oi !== q.answer; return (<button key={oi} onClick={() => !showResults && handleAnswer(qi, oi)} className={`text-xs text-left px-4 py-2.5 rounded-lg border transition-all cursor-pointer ${correct ? "bg-green-50 border-green-500 text-green-700" : wrong ? "bg-red-50 border-red-500 text-red-700" : selected ? "bg-indigo-50 border-indigo-500 text-indigo-700" : "bg-white border-slate-200 text-slate-600 hover:border-indigo-400"}`}>{opt}</button>); })}</div></div>))}</div>
          <div className="flex gap-3 mt-6">{!showResults ? (<button onClick={() => setShowResults(true)} className="px-6 py-2.5 bg-indigo-600 text-white rounded-lg text-xs font-semibold cursor-pointer hover:bg-indigo-700 transition">Submit Answers</button>) : (<div className="flex items-center gap-4"><span className="text-sm font-bold text-slate-900">Score: {quizScore}/{QUIZ.length}</span><button onClick={() => { setQuiz({}); setShowResults(false); }} className="px-6 py-2.5 bg-slate-100 text-slate-600 rounded-lg text-xs font-semibold cursor-pointer hover:bg-slate-200 transition">Reset</button></div>)}</div>
        </div>
      </Section>
      <Section title="What's Next?"><div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-xl p-6 text-white"><h3 className="text-lg font-bold mb-3">Advanced Tree Topics</h3><p className="text-white/90 mb-4 text-sm">Explore more tree concepts:</p><div className="grid sm:grid-cols-3 gap-3">{[{ name: "Graph Algorithms", href: "/tools/algorithms/graph" }, { name: "Heap & Priority Queue", href: "/tools/algorithms/heap" }, { name: "Trie Algorithms", href: "/tools/algorithms/trie" }].map((t, i) => (<Link key={i} href={t.href} className="no-underline"><button className="w-full bg-white/20 border border-white/30 text-white py-3 rounded-lg font-semibold text-xs cursor-pointer hover:bg-white/30 transition">{t.name} →</button></Link>))}</div></div></Section>
    </div>
  );
}
