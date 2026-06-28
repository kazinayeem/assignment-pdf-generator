export type KnowledgeCategory =
  | "companies"
  | "notes"
  | "resources"
  | "archive"
  | "upcoming"
  | "snippets"
  | "hub";

export type KnowledgeDifficulty = "easy" | "medium" | "hard" | "expert";

export type ExtractedQuestion = {
  id: string;
  question: string;
  answer?: string;
  explanation?: string;
  difficulty: KnowledgeDifficulty;
  company?: string;
  category: string;
  tags: string[];
  type: "technical" | "hr" | "behavioral" | "coding" | "system-design" | "general";
};

export type KnowledgeQuizItem = {
  id: string;
  type: "mcq" | "true-false" | "fill-blank" | "flashcard" | "short";
  question: string;
  options?: string[];
  answer: string | number | boolean;
  explanation: string;
  difficulty: KnowledgeDifficulty;
};

export type KnowledgeArticle = {
  id: string;
  slug: string;
  route: string;
  title: string;
  summary: string;
  content: string;
  rawPath: string;
  category: KnowledgeCategory;
  tags: string[];
  difficulty: KnowledgeDifficulty;
  readingMinutes: number;
  wordCount: number;
  company?: string;
  lastUpdated?: string;
  relatedSlugs: string[];
  questions: ExtractedQuestion[];
  quiz: KnowledgeQuizItem[];
  enhancements: {
    keyTakeaways: string[];
    interviewTips: string[];
    commonMistakes: string[];
    practiceQuestions: string[];
  };
  wasTranslated: boolean;
  imagePaths: string[];
  headings: { id: string; text: string; level: number }[];
};

export type SidebarNode = {
  id: string;
  title: string;
  route?: string;
  children?: SidebarNode[];
  collapsed?: boolean;
};

export type KnowledgeIndex = {
  generatedAt: string;
  stats: {
    foldersScanned: number;
    markdownFiles: number;
    images: number;
    questionsExtracted: number;
    companiesDetected: number;
    quizzesGenerated: number;
    flashcardsCreated: number;
    banglaTranslated: number;
    brokenLinks: string[];
    missingImages: string[];
  };
  articles: KnowledgeArticle[];
  sidebar: SidebarNode[];
  companies: { slug: string; name: string; route: string; questionCount: number }[];
  searchIndex: { id: string; title: string; summary: string; route: string; tags: string[]; company?: string; category: KnowledgeCategory; contentPreview: string }[];
};

export type SnippetFile = {
  slug: string;
  route: string;
  title: string;
  language: string;
  content: string;
  rawPath: string;
};
