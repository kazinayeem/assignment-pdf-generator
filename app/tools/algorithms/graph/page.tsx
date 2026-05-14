"use client";

import { useState } from "react";
import Link from "next/link";
import { Home, ChevronRight } from "lucide-react";
import { Section, ComplexityBadge, CodeBlock, InfoCard, StepByStepBreakdown, VisualAnimationContainer, InterviewQuestions, AlgorithmCard } from "../components";

const ALGORITHMS = [
  { id: "bfs", name: "Breadth-First Search", description: "Level-by-level graph traversal using a queue", complexity: { time: "O(V + E)", space: "O(V)" }, featured: true, code: `from collections import deque\n\ndef bfs(graph, start):\n    visited = set()\n    queue = deque([start])\n    visited.add(start)\n    while queue:\n        vertex = queue.popleft()\n        print(vertex, end=" ")\n        for neighbor in graph[vertex]:\n            if neighbor not in visited:\n                visited.add(neighbor)\n                queue.append(neighbor)` },
  { id: "dfs", name: "Depth-First Search", description: "Explore as far as possible before backtracking", complexity: { time: "O(V + E)", space: "O(V)" }, featured: false, code: `def dfs(graph, start, visited=None):\n    if visited is None:\n        visited = set()\n    visited.add(start)\n    print(start, end=" ")\n    for neighbor in graph[start]:\n        if neighbor not in visited:\n            dfs(graph, neighbor, visited)` },
  { id: "dijkstra", name: "Dijkstra's Algorithm", description: "Shortest path from source to all vertices (positive weights)", complexity: { time: "O((V+E) log V)", space: "O(V)" }, featured: true, code: `import heapq\n\ndef dijkstra(graph, start):\n    distances = {node: float('inf') for node in graph}\n    distances[start] = 0\n    pq = [(0, start)]\n    while pq:\n        dist, curr = heapq.heappop(pq)\n        if dist > distances[curr]: continue\n        for neighbor, weight in graph[curr]:\n            d = dist + weight\n            if d < distances[neighbor]:\n                distances[neighbor] = d\n                heapq.heappush(pq, (d, neighbor))\n    return distances` },
  { id: "kruskal", name: "Kruskal's Algorithm", description: "Minimum spanning tree using union-find", complexity: { time: "O(E log E)", space: "O(V)" }, featured: false, code: `def kruskal(vertices, edges):\n    parent = {v: v for v in vertices}\n    def find(x):\n        while parent[x] != x:\n            parent[x] = parent[parent[x]]\n            x = parent[x]\n        return x\n    def union(x, y):\n        parent[find(x)] = find(y)\n    mst = []\n    edges.sort(key=lambda e: e[2])\n    for u, v, w in edges:\n        if find(u) != find(v):\n            union(u, v)\n            mst.append((u, v, w))\n    return mst` },
  { id: "topological", name: "Topological Sort", description: "Linear ordering of DAG vertices respecting edges", complexity: { time: "O(V + E)", space: "O(V)" }, featured: false, code: `from collections import deque\n\ndef topologicalSort(graph):\n    in_degree = {u: 0 for u in graph}\n    for u in graph:\n        for v in graph[u]:\n            in_degree[v] += 1\n    queue = deque([u for u in graph if in_degree[u] == 0])\n    result = []\n    while queue:\n        u = queue.popleft()\n        result.append(u)\n        for v in graph[u]:\n            in_degree[v] -= 1\n            if in_degree[v] == 0:\n                queue.append(v)\n    return result` },
];

const USES = [
  { title: "Social Networks", desc: "Friend recommendations, mutual connections, influence analysis" },
  { title: "GPS Navigation", desc: "Shortest path computation for route planning and traffic optimization" },
  { title: "Web Crawling", desc: "BFS crawls web pages level by level from a seed URL" },
  { title: "Circuit Design", desc: "Topological sort for determining component order" },
  { title: "Network Routing", desc: "OSPF protocol uses Dijkstra for shortest path routing" },
  { title: "AI & Game Dev", desc: "Pathfinding (A*), game state exploration, decision trees" },
];

const QUIZ = [
  { q: "What data structure does BFS use?", options: ["Stack", "Queue", "Heap", "Hash Table"], answer: 1 },
  { q: "What data structure does DFS use?", options: ["Queue", "Stack (or recursion)", "Priority Queue", "Linked List"], answer: 1 },
  { q: "Can Dijkstra handle negative edge weights?", options: ["Yes", "No", "Only with modifications", "Yes if no cycles"], answer: 1 },
  { q: "What does Kruskal's algorithm find?", options: ["Shortest path", "Minimum spanning tree", "Max flow", "Topological order"], answer: 1 },
  { q: "When can topological sort be applied?", options: ["Any graph", "DAG only", "Connected graphs only", "Weighted graphs only"], answer: 1 },
];

export default function GraphPage() {
  const [selectedAlgo, setSelectedAlgo] = useState("bfs");
  const [quiz, setQuiz] = useState<Record<number, number>>({});
  const [showResults, setShowResults] = useState(false);
  const algo = ALGORITHMS.find((a) => a.id === selectedAlgo)!;
  const handleAnswer = (qi: number, ai: number) => setQuiz((p) => ({ ...p, [qi]: ai }));
  const quizScore = QUIZ.reduce((s, q, i) => s + (quiz[i] === q.answer ? 1 : 0), 0);

  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      <div className="flex items-center gap-2 mb-6 text-xs text-slate-500">
        <Link href="/tools/algorithms" className="text-indigo-600 no-underline flex items-center gap-1.5 hover:text-indigo-800 transition"><Home size={16} /> Algorithms</Link>
        <ChevronRight size={16} /><span className="text-slate-900 font-semibold">Graph Algorithms</span>
      </div>
      <div className="mb-10">
        <h1 className="text-4xl font-extrabold text-slate-900 mb-3">🕸️ Graph Algorithms</h1>
        <p className="text-base text-slate-500 leading-relaxed max-w-xl">Traverse, search, and optimize graph structures. Master BFS, DFS, shortest paths, and minimum spanning trees.</p>
      </div>
      <Section title="Overview">
        <InfoCard title="What are Graph Algorithms?" type="info">Graphs model relationships between entities. Graph algorithms solve problems like finding paths, detecting cycles, computing connectivity, and optimizing flows. They're essential in social networks, navigation systems, and network routing.</InfoCard>
        <div className="bg-white rounded-xl border border-slate-200 p-6 mb-4">
          <h3 className="text-base font-bold text-slate-900 mb-4">Key Graph Algorithms</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">{ALGORITHMS.map((a) => <AlgorithmCard key={a.id} title={a.name} description={a.description} complexity={a.complexity} featured={a.featured} />)}</div>
        </div>
      </Section>
      <Section title="Interactive Visualizer">
        <div className="flex gap-2 flex-wrap mb-5">{ALGORITHMS.map((a) => (<button key={a.id} onClick={() => setSelectedAlgo(a.id)} className={`px-4 py-2.5 rounded-lg text-xs font-medium cursor-pointer transition-all ${selectedAlgo === a.id ? "bg-indigo-50 text-indigo-600 border-2 border-indigo-500" : "bg-white text-slate-500 border border-slate-200 hover:border-indigo-400"}`}>{a.name}</button>))}</div>
        <VisualAnimationContainer title="Graph Visualization">
          <div className="bg-slate-50 rounded-lg p-10 text-center text-slate-500 h-[300px] flex items-center justify-center flex-col">
            <div className="text-5xl mb-3">🕸️</div>
            <p className="mb-4">{algo.name} Graph Visualizer</p>
            <p className="text-xs max-w-xs text-slate-400">Interact with nodes and edges to see how graph algorithms traverse and process graph structures.</p>
          </div>
        </VisualAnimationContainer>
        <div className="bg-white rounded-xl border border-slate-200 p-5 grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <button className="py-2.5 bg-indigo-600 text-white border-none rounded-lg font-semibold cursor-pointer text-xs hover:bg-indigo-700 transition">Generate Graph</button>
          <button className="py-2.5 bg-purple-600 text-white border-none rounded-lg font-semibold cursor-pointer text-xs hover:bg-purple-700 transition">Run Algorithm</button>
          <input type="range" min="0.1" max="2" step="0.1" defaultValue="1" className="w-full" />
          <button className="py-2.5 bg-red-500 text-white border-none rounded-lg font-semibold cursor-pointer text-xs hover:bg-red-600 transition">Reset</button>
        </div>
      </Section>
      <Section title={`Deep Dive: ${algo.name}`}>
        <div className="grid sm:grid-cols-3 gap-4 mb-5">
          <div className="bg-white rounded-xl border border-slate-200 p-4"><h4 className="text-[10px] font-bold text-slate-400 uppercase mb-2 tracking-wider">Time Complexity</h4><ComplexityBadge type="time" value={algo.complexity.time} /></div>
          <div className="bg-white rounded-xl border border-slate-200 p-4"><h4 className="text-[10px] font-bold text-slate-400 uppercase mb-2 tracking-wider">Space Complexity</h4><ComplexityBadge type="space" value={algo.complexity.space} /></div>
          <div className="bg-white rounded-xl border border-slate-200 p-4"><h4 className="text-[10px] font-bold text-slate-400 uppercase mb-2 tracking-wider">Requires</h4><span className="text-xs text-slate-900 font-semibold">{algo.id === "topological" ? "DAG" : "Graph"}</span></div>
        </div>
        <InfoCard title="Algorithm Approach" type="tip">{algo.id === "bfs" ? "BFS explores neighbors of the current vertex before moving to next level. It finds the shortest path in unweighted graphs and is ideal for level-order traversal." : algo.id === "dfs" ? "DFS explores as deep as possible along each branch before backtracking. Uses stack (recursion). Ideal for connectivity, cycle detection, and topological ordering." : algo.id === "dijkstra" ? "Dijkstra's maintains distances from source. At each step, it relaxes edges from the unvisited vertex with the smallest known distance. Uses a priority queue for efficiency." : algo.id === "kruskal" ? "Sort edges by weight. Add edges in order if they connect different components (use Union-Find to detect cycles). The result is a minimum spanning tree." : "Kahn's algorithm: repeatedly remove vertices with in-degree 0. The removal order is a valid topological sort. Works only on DAGs."}</InfoCard>
        <CodeBlock code={algo.code} language="python" />
        <StepByStepBreakdown steps={[{ step: 1, title: "Represent Graph", desc: "Choose adjacency list, matrix, or edge list based on density and operations needed." }, { step: 2, title: "Initialize State", desc: "Set up visited set, distances, queue/stack/priority queue as needed." }, { step: 3, title: "Process Vertices", desc: "Follow algorithm-specific rules to explore neighbors and update state." }, { step: 4, title: "Return Results", desc: "Extract path, distances, ordering, or tree structure from computed state." }]} />
      </Section>
      <Section title="Real-World Applications"><div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">{USES.map((u, i) => (<div key={i} className="bg-white rounded-xl border border-slate-200 p-4"><h4 className="text-sm font-bold text-slate-900 mb-1.5">{u.title}</h4><p className="text-xs text-slate-500 leading-relaxed">{u.desc}</p></div>))}</div></Section>
      <Section title="Interview Questions">
        <InterviewQuestions questions={[
          { q: "What's the difference between BFS and DFS?", a: "BFS uses a queue and finds shortest path in unweighted graphs. DFS uses a stack (or recursion) and uses less memory on average. BFS is better for finding closest solutions; DFS is better for exploring entire graphs." },
          { q: "Why doesn't Dijkstra work with negative edges?", a: "Dijkstra assumes adding more edges always increases distance. With negative edges, a longer path might have lower total weight. Bellman-Ford handles negative edges by relaxing all edges V-1 times." },
          { q: "What are the tradeoffs between adjacency list and matrix?", a: "Adjacency list: O(V+E) space, O(deg(v)) neighbor iteration. Adjacency matrix: O(V²) space, O(1) edge lookup. Lists are better for sparse graphs; matrices for dense graphs." },
        ]} />
      </Section>
      <Section title="Knowledge Check">
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="space-y-5">{QUIZ.map((q, qi) => (<div key={qi}><p className="text-sm font-semibold text-slate-900 mb-3">{qi + 1}. {q.q}</p><div className="grid sm:grid-cols-2 gap-2">{q.options.map((opt, oi) => { const selected = quiz[qi] === oi; const correct = showResults && oi === q.answer; const wrong = showResults && selected && oi !== q.answer; return (<button key={oi} onClick={() => !showResults && handleAnswer(qi, oi)} className={`text-xs text-left px-4 py-2.5 rounded-lg border transition-all cursor-pointer ${correct ? "bg-green-50 border-green-500 text-green-700" : wrong ? "bg-red-50 border-red-500 text-red-700" : selected ? "bg-indigo-50 border-indigo-500 text-indigo-700" : "bg-white border-slate-200 text-slate-600 hover:border-indigo-400"}`}>{opt}</button>); })}</div></div>))}</div>
          <div className="flex gap-3 mt-6">{!showResults ? (<button onClick={() => setShowResults(true)} className="px-6 py-2.5 bg-indigo-600 text-white rounded-lg text-xs font-semibold cursor-pointer hover:bg-indigo-700 transition">Submit Answers</button>) : (<div className="flex items-center gap-4"><span className="text-sm font-bold text-slate-900">Score: {quizScore}/{QUIZ.length}</span><button onClick={() => { setQuiz({}); setShowResults(false); }} className="px-6 py-2.5 bg-slate-100 text-slate-600 rounded-lg text-xs font-semibold cursor-pointer hover:bg-slate-200 transition">Reset</button></div>)}</div>
        </div>
      </Section>
      <Section title="What's Next?"><div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-xl p-6 text-white"><h3 className="text-lg font-bold mb-3">Advanced Graph Topics</h3><p className="text-white/90 mb-4 text-sm">Level up with these advanced concepts:</p><div className="grid sm:grid-cols-3 gap-3">{[{ name: "Tree Algorithms", href: "/tools/algorithms/tree" }, { name: "Dynamic Programming", href: "/tools/algorithms/dynamic-programming" }, { name: "Backtracking", href: "/tools/algorithms/backtracking" }].map((t, i) => (<Link key={i} href={t.href} className="no-underline"><button className="w-full bg-white/20 border border-white/30 text-white py-3 rounded-lg font-semibold text-xs cursor-pointer hover:bg-white/30 transition">{t.name} →</button></Link>))}</div></div></Section>
    </div>
  );
}
