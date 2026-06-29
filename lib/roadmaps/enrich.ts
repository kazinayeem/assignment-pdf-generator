import { layoutNodes } from "./builder";
import type { Roadmap, RoadmapDefinition, RoadmapNode } from "./types";
import { generateCareerOutlook, generateLearningPath, generatePortfolioChecklist } from "./content/career";
import { generateCodingProblems, getNodeCodingProblems } from "./content/coding-problems";
import { generateInterviewHub } from "./content/interview-hub";
import { generateResources, getNodeResources } from "./content/resources";

export function enrichRoadmapDefinition(def: RoadmapDefinition): Roadmap {
  const interviewHub = generateInterviewHub(def);
  const codingProblems = generateCodingProblems(def);
  const resources = generateResources(def);
  const career = generateCareerOutlook(def);
  const learningPath = generateLearningPath(def);
  const portfolioChecklist = generatePortfolioChecklist();

  const baseNodes = layoutNodes(def.phases, def.nodeDefs);
  const nodes: RoadmapNode[] = baseNodes.map((node) => {
    const topicInterview = interviewHub.filter((q) => q.topic === node.title);
    const nodeInterview = topicInterview.length >= 8
      ? topicInterview.slice(0, 12)
      : [...topicInterview, ...interviewHub.filter((q) => q.topic !== node.title)].slice(0, 12);

    return {
      ...node,
      interviewQuestions: nodeInterview,
      codingProblems: getNodeCodingProblems(codingProblems, node.title, 6),
      learningResources: getNodeResources(resources, node.title, 10),
      resources: getNodeResources(resources, node.title, 6).map((r) => ({
        label: r.title,
        url: r.url,
        type: r.type === "tool" || r.type === "cheatsheet" ? "article" : r.type,
      })),
      challenges: getNodeCodingProblems(codingProblems, node.title, 4).map((p) => ({
        title: p.title,
        difficulty: p.difficulty,
        hints: p.hints,
        complexity: `${p.timeComplexity} time, ${p.spaceComplexity} space`,
      })),
      interview: nodeInterview.slice(0, 5).map((q) => ({
        question: q.question,
        type: q.category === "hr" ? "hr" as const : q.category === "behavioral" ? "behavioral" as const : q.category === "design" || q.category === "architecture" ? "system-design" as const : "technical" as const,
        hint: q.tips[0],
      })),
    };
  });

  return {
    ...def,
    nodes,
    enrichment: {
      interviewHub,
      codingProblems,
      resources,
      career,
      learningPath,
      portfolioChecklist,
    },
  };
}
