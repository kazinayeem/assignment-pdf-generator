import type { Difficulty } from "@/lib/tools/tokens";

export type QuizDifficulty = "easy" | "medium" | "hard" | "expert";

export type QuestionType =
  | "mcq"
  | "multi-select"
  | "true-false"
  | "fill-blank"
  | "match"
  | "ordering"
  | "code-output"
  | "debugging"
  | "scenario"
  | "short-answer";

export type ExamMode =
  | "practice"
  | "timed"
  | "mock-university"
  | "interview"
  | "final-assessment";

export type QuestionCategory =
  | "theory"
  | "practical"
  | "coding"
  | "interview"
  | "company"
  | "real-world";

export type QuizQuestion = {
  id: string;
  subjectSlug: string;
  topicSlug: string;
  subtopicSlug?: string;
  type: QuestionType;
  category: QuestionCategory;
  difficulty: QuizDifficulty;
  question: string;
  options?: string[];
  answer: string | number | number[] | boolean | string[];
  explanation: string;
  references?: string[];
  relatedTopics?: string[];
  estimatedSeconds: number;
  visualHint?: string;
};

export type TopicSubtopic = {
  slug: string;
  title: string;
  duration: string;
  difficulty: Difficulty;
};

export type RegistryTopic = {
  slug: string;
  title: string;
  description: string;
  icon: string;
  difficulty: Difficulty;
  duration: string;
  status: "live" | "planned";
  href?: string;
  order: number;
  subtopics: TopicSubtopic[];
  learningObjectives: string[];
  prerequisites?: string[];
  hasQuiz: boolean;
  hasSimulator: boolean;
  hasInterview: boolean;
  hasCheatSheet: boolean;
};

export type RegistrySubject = {
  slug: string;
  title: string;
  description: string;
  estimatedHours: number;
  difficulty: Difficulty;
  learningPath: string[];
  categories: { title: string; topics: RegistryTopic[] }[];
  missingModules: string[];
};

export type ExamConfig = {
  mode: ExamMode;
  subjectSlug: string;
  topicSlug?: string;
  difficulty?: QuizDifficulty | "all";
  questionCount: number;
  timeLimitMinutes?: number;
  negativeMarking?: boolean;
  passingScore?: number;
  shuffleQuestions?: boolean;
  shuffleOptions?: boolean;
  showExplanations?: boolean;
};

export type ExamAnswer = {
  questionId: string;
  userAnswer: string | number | number[] | boolean | string[] | null;
  correct: boolean;
  skipped: boolean;
  timeSpentSeconds: number;
};

export type ExamResult = {
  id: string;
  subjectSlug: string;
  topicSlug?: string;
  mode: ExamMode;
  difficulty: QuizDifficulty | "mixed";
  score: number;
  total: number;
  percentage: number;
  passed: boolean;
  timeTakenSeconds: number;
  answers: ExamAnswer[];
  topicBreakdown: Record<string, { correct: number; total: number }>;
  completedAt: string;
};

export type Certificate = {
  id: string;
  studentName: string;
  subject: string;
  topic?: string;
  score: number;
  issuedAt: string;
  type: "subject" | "final-exam" | "learning-path" | "excellence";
};

export type Achievement = {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt: string;
};

export type LeaderboardEntry = {
  id: string;
  name: string;
  score: number;
  examsTaken: number;
  streak: number;
  university?: string;
  department?: string;
};
