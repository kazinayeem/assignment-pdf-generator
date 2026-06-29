import type { CodingProblem, RoadmapDefinition, RoadmapDifficulty } from "../types";
import { DIFFICULTY_LEVELS } from "./constants";

const PROBLEMS_PER_DIFFICULTY = 10;

const TEMPLATES: Record<RoadmapDifficulty, (role: string, topic: string, n: number) => Omit<CodingProblem, "id" | "difficulty" | "topic">> = {
  beginner: (role, topic, n) => ({
    title: `${topic} Basics #${n}`,
    statement: `Given a basic ${topic} task for ${role}, implement a solution that demonstrates foundational understanding.`,
    input: "Sample input varies by problem (arrays, strings, or config objects).",
    output: "Expected output matching problem specification.",
    constraints: ["1 ≤ n ≤ 10^4", "Use standard library only", "Handle edge cases"],
    hints: ["Start with brute force", "Consider edge cases first", `Review ${topic} documentation`],
    solution: `// Solution outline for ${topic}\nfunction solve(input) {\n  // Step 1: Parse input\n  // Step 2: Apply ${topic} logic\n  // Step 3: Return result\n  return input;\n}`,
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
  }),
  intermediate: (role, topic, n) => ({
    title: `${topic} Application #${n}`,
    statement: `Build a ${topic} solution for a ${role} scenario with multiple components interacting.`,
    input: "Structured input with nested data.",
    output: "Transformed or aggregated output.",
    constraints: ["Optimize for readability and performance", "n ≤ 10^5"],
    hints: ["Use appropriate data structures", "Avoid redundant passes", "Test with large inputs"],
    solution: `function solve(data) {\n  const map = new Map();\n  for (const item of data) {\n    map.set(item.key, (map.get(item.key) ?? 0) + 1);\n  }\n  return [...map.entries()];\n}`,
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
  }),
  advanced: (role, topic, n) => ({
    title: `${topic} Advanced Challenge #${n}`,
    statement: `Design and implement an advanced ${topic} module for production ${role} systems.`,
    input: "Complex input with constraints on memory and latency.",
    output: "Optimized result under production constraints.",
    constraints: ["Must handle concurrent access or scale", "Memory limit applies"],
    hints: ["Consider caching", "Profile before optimizing", "Document assumptions"],
    solution: `// Advanced pattern for ${topic}\nclass ${topic.replace(/\s/g, "")}Service {\n  constructor(private cache) {}\n  async process(payload) { /* ... */ }\n}`,
    timeComplexity: "O(n log n)",
    spaceComplexity: "O(n)",
  }),
  expert: (role, topic, n) => ({
    title: `${topic} Expert System #${n}`,
    statement: `Architect a distributed or high-scale ${topic} solution suitable for senior ${role} interviews.`,
    input: "Large-scale streaming or batch input.",
    output: "System-level output with SLA guarantees.",
    constraints: ["Fault tolerance required", "Horizontal scaling assumed"],
    hints: ["Discuss CAP trade-offs", "Consider idempotency", "Plan observability"],
    solution: `// Expert-level design + pseudocode\n// Sharding strategy, queue workers, idempotent handlers`,
    timeComplexity: "O(n) amortized",
    spaceComplexity: "O(n) distributed",
  }),
};

export function generateCodingProblems(def: RoadmapDefinition): CodingProblem[] {
  const topics = def.nodeDefs.map((n) => n.title);
  const problems: CodingProblem[] = [];
  let globalIdx = 0;

  for (const difficulty of DIFFICULTY_LEVELS) {
    const count = difficulty === "expert" ? 7 : PROBLEMS_PER_DIFFICULTY;
    for (let i = 0; i < count; i++) {
      const topic = topics[globalIdx % topics.length];
      const template = TEMPLATES[difficulty](def.title, topic, i + 1);
      problems.push({
        id: `${def.slug}-cp-${difficulty}-${i}`,
        difficulty,
        topic,
        ...template,
      });
      globalIdx++;
    }
  }

  return problems;
}

export function getNodeCodingProblems(all: CodingProblem[], topic: string, limit = 6): CodingProblem[] {
  const matched = all.filter((p) => p.topic === topic);
  if (matched.length >= limit) return matched.slice(0, limit);
  return [...matched, ...all.filter((p) => p.topic !== topic)].slice(0, limit);
}
