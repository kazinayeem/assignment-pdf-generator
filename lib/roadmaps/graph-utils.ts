import type { Roadmap, RoadmapNode, RoadmapDifficulty, NodeStatus } from "./types";
import { GRAPH_NODE_SIZE } from "./builder";

export type EdgeVisualState = "not-started" | "available" | "completed" | "current" | "recommended";

export type NodeStats = {
  lessons: number;
  projects: number;
  interviewQuestions: number;
  mcqs: number;
  codeExamples: number;
  videos: number;
  articles: number;
  documentation: number;
  practiceProblems: number;
  cheatSheets: number;
  resources: number;
};

export type GraphFilters = {
  difficulty: RoadmapDifficulty | "all";
  status: "all" | "completed" | "not-started" | "bookmarked";
  content: "all" | "interview" | "projects" | "theory" | "coding";
  sort: "default" | "popular" | "recommended" | "recent";
};

export const EDGE_COLORS: Record<EdgeVisualState, string> = {
  "not-started": "var(--muted-foreground)",
  available: "var(--brand)",
  completed: "var(--success)",
  current: "var(--chart-4, #a855f7)",
  recommended: "var(--chart-1, #f97316)",
};

export function computeNodeStats(node: RoadmapNode): NodeStats {
  const lessons = (node.theory ? 3 : 0) + (node.cheatSheet?.length ?? 0) * 2;
  return {
    lessons: Math.max(lessons, 4),
    projects: node.projects.length,
    interviewQuestions: node.interviewQuestions.length,
    mcqs: node.quizzes.length,
    codeExamples: node.codeExample ? 1 : 0 + node.codingProblems.length,
    videos: node.videos?.length ?? Math.min(3, node.learningResources.filter((r) => r.type === "video").length),
    articles: node.resources.filter((r) => r.type === "article").length + node.learningResources.filter((r) => r.type === "article").length,
    documentation: node.learningResources.filter((r) => r.type === "docs").length,
    practiceProblems: node.codingProblems.length + node.challenges.length,
    cheatSheets: node.cheatSheet?.length ?? 0,
    resources: node.learningResources.length + node.resources.length,
  };
}

export function computeNodeProgress(
  node: RoadmapNode,
  isComplete: boolean,
  quizScore?: number
): number {
  if (isComplete) return 100;
  let score = 0;
  if (quizScore && quizScore > 0) score += Math.min(40, quizScore * 0.4);
  if (node.theory) score += 15;
  if (node.codeExample) score += 15;
  return Math.min(99, Math.round(score));
}

export function computeNodeXp(node: RoadmapNode, progress: number): number {
  const base = node.estimatedHours * 10;
  return Math.round((base * progress) / 100);
}

export function getEdgeVisualState(
  sourceComplete: boolean,
  targetComplete: boolean,
  targetId: string,
  selectedId: string | null,
  recommendedId: string | null
): EdgeVisualState {
  if (targetId === selectedId) return "current";
  if (targetId === recommendedId) return "recommended";
  if (sourceComplete && targetComplete) return "completed";
  if (sourceComplete) return "available";
  return "not-started";
}

export function getNodeVisualStatus(
  nodeId: string,
  getNodeStatus: (id: string) => NodeStatus,
  isComplete: boolean,
  selectedId: string | null,
  recommendedId: string | null
): "completed" | "current" | "recommended" | "available" | "locked" {
  if (nodeId === selectedId) return "current";
  if (nodeId === recommendedId) return "recommended";
  if (isComplete) return "completed";
  const status = getNodeStatus(nodeId);
  if (status === "locked") return "locked";
  return "available";
}

export function getRecommendedNodeId(roadmap: Roadmap, isNodeComplete: (id: string) => boolean): string | null {
  const next = roadmap.nodes.find((n) => !isNodeComplete(n.id));
  return next?.id ?? null;
}

export function searchRoadmapNodes(
  roadmap: Roadmap,
  query: string
): { node: RoadmapNode; matchReason: string }[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  const results: { node: RoadmapNode; matchReason: string; score: number }[] = [];

  for (const node of roadmap.nodes) {
    let score = 0;
    let reason = "";

    if (node.title.toLowerCase().includes(q)) {
      score += 10;
      reason = "Topic";
    }
    if (node.description.toLowerCase().includes(q)) {
      score += 5;
      reason = reason || "Description";
    }
    if (node.theory?.toLowerCase().includes(q)) {
      score += 3;
      reason = reason || "Theory";
    }
    const projectHit = node.projects.find((p) => p.title.toLowerCase().includes(q));
    if (projectHit) {
      score += 6;
      reason = "Project";
    }
    const interviewHit = node.interviewQuestions.find((i) => i.question.toLowerCase().includes(q));
    if (interviewHit) {
      score += 6;
      reason = "Interview";
    }
    const resourceHit = node.learningResources.find((r) => r.title.toLowerCase().includes(q));
    if (resourceHit) {
      score += 4;
      reason = "Resource";
    }
    const toolHit = node.learningResources.find((r) => r.type === "tool" && r.title.toLowerCase().includes(q));
    if (toolHit) {
      score += 4;
      reason = "Tool";
    }

    if (score > 0) results.push({ node, matchReason: reason, score });
  }

  return results.sort((a, b) => b.score - a.score).map(({ node, matchReason }) => ({ node, matchReason }));
}

export function filterGraphNodes(
  nodes: RoadmapNode[],
  filters: GraphFilters,
  opts: {
    completedIds: Set<string>;
    bookmarkedIds: Set<string>;
    recommendedId: string | null;
  }
): RoadmapNode[] {
  return nodes.filter((node) => {
    if (filters.difficulty !== "all" && node.difficulty !== filters.difficulty) return false;

    const complete = opts.completedIds.has(node.id);
    if (filters.status === "completed" && !complete) return false;
    if (filters.status === "not-started" && complete) return false;
    if (filters.status === "bookmarked" && !opts.bookmarkedIds.has(node.id)) return false;

    if (filters.content === "interview" && node.interviewQuestions.length === 0) return false;
    if (filters.content === "projects" && node.projects.length === 0) return false;
    if (filters.content === "theory" && !node.theory) return false;
    if (filters.content === "coding" && node.codingProblems.length === 0) return false;

    return true;
  });
}

export function getPhaseCompletion(
  roadmap: Roadmap,
  phaseId: string,
  isNodeComplete: (id: string) => boolean
): number {
  const phaseNodes = roadmap.nodes.filter((n) => n.phaseId === phaseId);
  if (!phaseNodes.length) return 0;
  const done = phaseNodes.filter((n) => isNodeComplete(n.id)).length;
  return Math.round((done / phaseNodes.length) * 100);
}

export function getMilestoneProgress(roadmap: Roadmap, isNodeComplete: (id: string) => boolean) {
  const levels: RoadmapDifficulty[] = ["beginner", "intermediate", "advanced", "expert"];
  return levels.map((level) => {
    const nodes = roadmap.nodes.filter((n) => n.difficulty === level);
    const total = nodes.length || 1;
    const done = nodes.filter((n) => isNodeComplete(n.id)).length;
    return { level, percent: Math.round((done / total) * 100), total: nodes.length, done };
  });
}

export function getEdgePath(source: RoadmapNode, target: RoadmapNode, boundsMinX: number, boundsMinY: number): string {
  const w = GRAPH_NODE_SIZE.width;
  const h = GRAPH_NODE_SIZE.height;
  const sx = source.position.x - boundsMinX + w / 2;
  const sy = source.position.y - boundsMinY + h;
  const tx = target.position.x - boundsMinX + w / 2;
  const ty = target.position.y - boundsMinY;
  const my = (sy + ty) / 2;
  return `M ${sx} ${sy} C ${sx} ${my}, ${tx} ${my}, ${tx} ${ty}`;
}

export const DEFAULT_GRAPH_FILTERS: GraphFilters = {
  difficulty: "all",
  status: "all",
  content: "all",
  sort: "default",
};
