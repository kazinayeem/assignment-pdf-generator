export type ReleaseType = "stable" | "beta" | "alpha" | "hotfix" | "major" | "minor" | "patch";
export type ReleaseStatus = "released" | "beta" | "alpha" | "deprecated" | "archived";

export type ChangeCategory =
  | "feature"
  | "improvement"
  | "performance"
  | "bugfix"
  | "security"
  | "ui"
  | "accessibility"
  | "i18n"
  | "mobile"
  | "desktop"
  | "ai"
  | "learning"
  | "bornomaps"
  | "bornocareer"
  | "bornouni"
  | "bornodev"
  | "resume"
  | "assignment"
  | "labreport"
  | "news"
  | "university"
  | "api"
  | "dx"
  | "infrastructure"
  | "analytics";

export type ProductId =
  | "bornoflow"
  | "bornomaps"
  | "bornoai"
  | "bornocareer"
  | "bornouni"
  | "bornodev"
  | "resume"
  | "devtools"
  | "interview"
  | "learning"
  | "university"
  | "assignment"
  | "labreport";

export type ReleaseTag =
  | "new"
  | "popular"
  | "experimental"
  | "beta"
  | "deprecated"
  | "breaking"
  | "improved"
  | "fixed"
  | "security"
  | "performance";

export type ChangeItem = {
  id: string;
  title: string;
  description?: string;
  category: ChangeCategory;
  product?: ProductId;
  tags?: ReleaseTag[];
  docsUrl?: string;
  commitUrl?: string;
  roadmapUrl?: string;
};

export type ReleaseMedia = {
  type: "image" | "gif" | "video";
  src: string;
  alt: string;
  caption?: string;
};

export type ReleaseStats = {
  commits?: number;
  linesChanged?: number;
  contributors?: number;
  roadmapsAdded?: number;
  devToolsAdded?: number;
  universitiesAdded?: number;
  interviewQuestionsAdded?: number;
  learningTopicsAdded?: number;
};

export type Release = {
  id: string;
  version: string;
  semver: string;
  date: string;
  releaseType: ReleaseType;
  status: ReleaseStatus;
  products: ProductId[];
  title: string;
  overview: string;
  changes: ChangeItem[];
  breakingChanges?: string[];
  migrationGuide?: string[];
  knownIssues?: string[];
  developerNotes?: string[];
  media?: ReleaseMedia[];
  stats?: ReleaseStats;
  githubUrl?: string;
  docsUrl?: string;
  archived?: boolean;
};

export type UpcomingStatus = "comingSoon" | "inDevelopment" | "planned" | "research" | "ideas";

export type UpcomingRelease = {
  id: string;
  title: string;
  status: UpcomingStatus;
  progress: number;
  quarter: string;
  product?: ProductId;
};

export type ChangelogFilters = {
  query: string;
  version: string;
  category: ChangeCategory | "all";
  releaseType: ReleaseType | "all";
  product: ProductId | "all";
  year: string;
  month: string;
  status: ReleaseStatus | "all";
};

export type ChangelogStats = {
  totalReleases: number;
  totalFeatures: number;
  bugFixes: number;
  performanceImprovements: number;
  contributors: number;
  commits: number;
  linesChanged: number;
  roadmapsAdded: number;
  devToolsAdded: number;
  universitiesAdded: number;
  interviewQuestionsAdded: number;
  learningTopicsAdded: number;
};
