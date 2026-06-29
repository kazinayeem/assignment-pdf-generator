"use client";

import { useMemo } from "react";
import { useShallow } from "zustand/react/shallow";
import type { RoadmapProgress } from "./types";
import { useRoadmapsStore } from "./store";

function emptyProgress(): RoadmapProgress {
  return {
    completedNodeIds: [],
    bookmarked: false,
    bookmarkedNodeIds: [],
    recentNodeIds: [],
    quizScores: {},
    lastVisitedAt: null,
    studyMinutes: 0,
    interviewPracticedIds: [],
    codingSolvedIds: [],
    portfolioCompleted: {},
    mockInterviewDone: false,
    resumeReady: false,
    githubReady: false,
    linkedinReady: false,
  };
}

/** Stable progress snapshot — avoids re-renders from getRoadmapProgress() returning new objects. */
export function useRoadmapProgress(slug: string): RoadmapProgress {
  const stored = useRoadmapsStore(useShallow((s) => s.progress[slug]));
  return useMemo(() => ({ ...emptyProgress(), ...stored }), [stored]);
}
