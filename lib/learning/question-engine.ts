import type { ExamConfig, ExamResult, QuizDifficulty, QuizQuestion, QuestionType } from "./types";

export function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function filterQuestions(
  questions: QuizQuestion[],
  opts: {
    subjectSlug?: string;
    topicSlug?: string;
    subtopicSlug?: string;
    difficulty?: QuizDifficulty | "all";
    types?: QuestionType[];
    categories?: QuizQuestion["category"][];
    excludeIds?: string[];
  }
): QuizQuestion[] {
  let result = [...questions];
  if (opts.subjectSlug) result = result.filter((q) => q.subjectSlug === opts.subjectSlug);
  if (opts.topicSlug) result = result.filter((q) => q.topicSlug === opts.topicSlug);
  if (opts.subtopicSlug) result = result.filter((q) => q.subtopicSlug === opts.subtopicSlug);
  if (opts.difficulty && opts.difficulty !== "all") result = result.filter((q) => q.difficulty === opts.difficulty);
  if (opts.types?.length) result = result.filter((q) => opts.types!.includes(q.type));
  if (opts.categories?.length) result = result.filter((q) => opts.categories!.includes(q.category));
  if (opts.excludeIds?.length) result = result.filter((q) => !opts.excludeIds!.includes(q.id));
  return result;
}

export function selectQuestions(questions: QuizQuestion[], config: ExamConfig, seenIds: string[] = []): QuizQuestion[] {
  let pool = filterQuestions(questions, {
    subjectSlug: config.subjectSlug,
    topicSlug: config.topicSlug,
    difficulty: config.difficulty,
    excludeIds: seenIds,
  });

  if (pool.length < config.questionCount) {
    pool = filterQuestions(questions, {
      subjectSlug: config.subjectSlug,
      topicSlug: config.topicSlug,
      difficulty: config.difficulty,
    });
  }

  if (config.shuffleQuestions !== false) pool = shuffle(pool);
  return pool.slice(0, config.questionCount).map((q) => {
    if (config.shuffleOptions !== false && q.options?.length) {
      return { ...q, options: shuffle(q.options) };
    }
    return q;
  });
}

export function checkAnswer(question: QuizQuestion, userAnswer: QuizQuestion["answer"] | null): boolean {
  if (userAnswer === null || userAnswer === undefined) return false;
  const correct = question.answer;

  if (question.type === "multi-select") {
    const ua = Array.isArray(userAnswer) ? [...userAnswer].sort() : [];
    const ca = Array.isArray(correct) ? [...correct].sort() : [];
    return JSON.stringify(ua) === JSON.stringify(ca);
  }

  if (question.type === "ordering" || question.type === "match") {
    return JSON.stringify(userAnswer) === JSON.stringify(correct);
  }

  if (typeof correct === "string" && typeof userAnswer === "string") {
    return correct.toLowerCase().trim() === userAnswer.toLowerCase().trim();
  }

  return userAnswer === correct;
}

export function scoreExam(
  questions: QuizQuestion[],
  answers: Map<string, QuizQuestion["answer"] | null>,
  times: Map<string, number>,
  config: ExamConfig
): Omit<ExamResult, "id" | "completedAt"> {
  const examAnswers = questions.map((q) => {
    const userAnswer = answers.get(q.id) ?? null;
    const correct = checkAnswer(q, userAnswer);
    const skipped = userAnswer === null;
    return {
      questionId: q.id,
      userAnswer,
      correct,
      skipped,
      timeSpentSeconds: times.get(q.id) ?? 0,
    };
  });

  let score = examAnswers.filter((a) => a.correct).length;
  const total = questions.length;

  if (config.negativeMarking) {
    const wrong = examAnswers.filter((a) => !a.correct && !a.skipped).length;
    score = Math.max(0, score - wrong * 0.25);
  }

  const percentage = total > 0 ? Math.round((score / total) * 100) : 0;
  const passingScore = config.passingScore ?? (config.mode === "final-assessment" ? 70 : 60);
  const topicBreakdown: Record<string, { correct: number; total: number }> = {};

  questions.forEach((q, i) => {
    const key = q.topicSlug;
    if (!topicBreakdown[key]) topicBreakdown[key] = { correct: 0, total: 0 };
    topicBreakdown[key].total++;
    if (examAnswers[i].correct) topicBreakdown[key].correct++;
  });

  const timeTakenSeconds = [...times.values()].reduce((a, b) => a + b, 0);

  return {
    subjectSlug: config.subjectSlug,
    topicSlug: config.topicSlug,
    mode: config.mode,
    difficulty: config.difficulty === "all" || !config.difficulty ? "mixed" : config.difficulty,
    score: Math.round(score),
    total,
    percentage,
    passed: percentage >= passingScore,
    timeTakenSeconds,
    answers: examAnswers,
    topicBreakdown,
  };
}

export function adaptiveDifficulty(recentScores: number[]): QuizDifficulty {
  if (recentScores.length === 0) return "medium";
  const avg = recentScores.reduce((a, b) => a + b, 0) / recentScores.length;
  if (avg >= 85) return "hard";
  if (avg >= 65) return "medium";
  return "easy";
}

export const EXAM_MODE_DEFAULTS: Record<ExamConfig["mode"], Partial<ExamConfig>> = {
  practice: { questionCount: 10, showExplanations: true, shuffleQuestions: true, shuffleOptions: true },
  timed: { questionCount: 20, timeLimitMinutes: 30, showExplanations: false, shuffleQuestions: true },
  "mock-university": { questionCount: 30, timeLimitMinutes: 60, negativeMarking: true, passingScore: 50, shuffleQuestions: true },
  interview: { questionCount: 15, timeLimitMinutes: 45, showExplanations: true, shuffleQuestions: true },
  "final-assessment": { questionCount: 40, timeLimitMinutes: 90, passingScore: 70, negativeMarking: false, shuffleQuestions: true },
};

export function buildExamConfig(mode: ExamConfig["mode"], subjectSlug: string, topicSlug?: string): ExamConfig {
  return {
    mode,
    subjectSlug,
    topicSlug,
    difficulty: "all",
    ...EXAM_MODE_DEFAULTS[mode],
  } as ExamConfig;
}
