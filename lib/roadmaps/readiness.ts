import type { Roadmap, ReadinessBreakdown, RoadmapProgress } from "./types";
import { useRoadmapsStore } from "./store";

function pct(done: number, total: number): number {
  if (!total) return 0;
  return Math.round((done / total) * 100);
}

export function computeReadiness(roadmap: Roadmap, progress: RoadmapProgress): ReadinessBreakdown {
  const totalTopics = roadmap.nodes.length;
  const topicsDone = progress.completedNodeIds.length;

  const portfolioTotal = roadmap.enrichment.portfolioChecklist.filter((p) => p.required).length;
  const portfolioDone = roadmap.enrichment.portfolioChecklist.filter(
    (p) => p.required && progress.portfolioCompleted[p.id]
  ).length;

  const interviewTarget = Math.min(50, roadmap.enrichment.interviewHub.length);
  const interviewDone = Math.min(progress.interviewPracticedIds.length, interviewTarget);

  const codingTarget = Math.min(20, roadmap.enrichment.codingProblems.length);
  const codingDone = Math.min(progress.codingSolvedIds.length, codingTarget);

  const projectsTarget = 5;
  const projectsDone = Math.min(
    portfolioDone,
    projectsTarget
  );

  const scores = {
    topicsCompleted: pct(topicsDone, totalTopics),
    projectsCompleted: pct(projectsDone, projectsTarget),
    interviewPracticed: pct(interviewDone, interviewTarget),
    codingSolved: pct(codingDone, codingTarget),
    portfolioReady: pct(portfolioDone, portfolioTotal),
    resumeReady: progress.resumeReady ? 100 : 0,
    githubReady: progress.githubReady ? 100 : 0,
    linkedinReady: progress.linkedinReady ? 100 : 0,
    mockInterviewCompleted: progress.mockInterviewDone ? 100 : 0,
  };

  const values = Object.values(scores);
  const overall = Math.round(values.reduce((a, b) => a + b, 0) / values.length);
  const isComplete = overall === 100;

  return { ...scores, overall, isComplete };
}

export function getReadinessForSlug(slug: string, roadmap: Roadmap): ReadinessBreakdown {
  const progress = useRoadmapsStore.getState().getRoadmapProgress(slug);
  return computeReadiness(roadmap, progress);
}
