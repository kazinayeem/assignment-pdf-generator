import type {
  Roadmap,
  RoadmapDefinition,
  RoadmapEdge,
  RoadmapNode,
  RoadmapNodeDefinition,
  RoadmapPhase,
} from "./types";
import { enrichRoadmapDefinition } from "./enrich";

const NODE_WIDTH = 280;
const NODE_HEIGHT = 148;
const COL_GAP = 360;
const ROW_GAP = 200;
const PHASE_HEADER_HEIGHT = 56;

export function layoutNodes(
  phases: RoadmapPhase[],
  nodeDefs: RoadmapNodeDefinition[]
): RoadmapNode[] {
  const byPhase = new Map<string, RoadmapNodeDefinition[]>();
  for (const def of nodeDefs) {
    const list = byPhase.get(def.phaseId) ?? [];
    list.push(def);
    byPhase.set(def.phaseId, list);
  }

  const nodes: RoadmapNode[] = [];
  phases.forEach((phase, colIndex) => {
    const phaseNodes = byPhase.get(phase.id) ?? [];
    const totalHeight = phaseNodes.length * ROW_GAP;
    const startY = -totalHeight / 2 + ROW_GAP / 2;

    phaseNodes.forEach((def, rowIndex) => {
      nodes.push({
        ...def,
        interviewQuestions: [],
        codingProblems: [],
        learningResources: [],
        position: {
          x: colIndex * COL_GAP,
          y: PHASE_HEADER_HEIGHT + startY + rowIndex * ROW_GAP,
        },
      });
    });
  });

  return nodes;
}

export function buildSequentialEdges(nodeDefs: { id: string; phaseId: string }[]): RoadmapEdge[] {
  const edges: RoadmapEdge[] = [];
  const byPhase = new Map<string, string[]>();
  for (const n of nodeDefs) {
    const list = byPhase.get(n.phaseId) ?? [];
    list.push(n.id);
    byPhase.set(n.phaseId, list);
  }

  const phaseIds = [...byPhase.keys()];
  for (let p = 0; p < phaseIds.length; p++) {
    const ids = byPhase.get(phaseIds[p]) ?? [];
    for (let i = 0; i < ids.length - 1; i++) {
      edges.push({ id: `e-${ids[i]}-${ids[i + 1]}`, source: ids[i], target: ids[i + 1] });
    }
    if (p < phaseIds.length - 1) {
      const nextIds = byPhase.get(phaseIds[p + 1]) ?? [];
      if (ids.length && nextIds.length) {
        edges.push({
          id: `e-phase-${p}`,
          source: ids[ids.length - 1],
          target: nextIds[0],
        });
      }
    }
  }
  return edges;
}

export function buildRoadmap(def: RoadmapDefinition): Roadmap {
  return enrichRoadmapDefinition(def);
}

export function getGraphBounds(nodes: RoadmapNode[]) {
  if (!nodes.length) return { minX: 0, minY: 0, maxX: 800, maxY: 600, width: 800, height: 600 };
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  for (const n of nodes) {
    minX = Math.min(minX, n.position.x);
    minY = Math.min(minY, n.position.y);
    maxX = Math.max(maxX, n.position.x + NODE_WIDTH);
    maxY = Math.max(maxY, n.position.y + NODE_HEIGHT);
  }
  const pad = 80;
  return {
    minX: minX - pad,
    minY: minY - pad,
    maxX: maxX + pad,
    maxY: maxY + pad,
    width: maxX - minX + pad * 2,
    height: maxY - minY + pad * 2,
  };
}

export const GRAPH_NODE_SIZE = { width: NODE_WIDTH, height: NODE_HEIGHT, phaseHeaderHeight: PHASE_HEADER_HEIGHT };
