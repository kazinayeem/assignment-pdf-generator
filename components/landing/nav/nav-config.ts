import {
  BookOpen, Briefcase, Calculator, Code2, FilePlus, FileText, GraduationCap,
  Map, School, Wrench, BrainCircuit, Globe, Shield, BarChart3, Sparkles, Library, Cpu,
  type LucideIcon,
} from "lucide-react";

export type NavLinkItem = {
  key: string;
  href: string;
  labelKey: string;
  description?: string;
  icon?: LucideIcon;
  badge?: "popular" | "new";
};

export type MegaMenuConfig = {
  key: string;
  labelKey: string;
  href: string;
  featured: NavLinkItem[];
  quickLinks: NavLinkItem[];
};

export const MEGA_MENUS: MegaMenuConfig[] = [
  {
    key: "tools",
    labelKey: "tools",
    href: "/tools",
    featured: [
      { key: "learning-tools", href: "/tools", labelKey: "nav.mega.learningTools", description: "nav.mega.learningToolsDesc", icon: BrainCircuit, badge: "popular" },
      { key: "dsa", href: "/tools/dsa", labelKey: "nav.mega.dsa", description: "nav.mega.dsaDesc", icon: Code2 },
      { key: "web", href: "/tools/web", labelKey: "nav.mega.web", description: "nav.mega.webDesc", icon: Globe, badge: "new" },
    ],
    quickLinks: [
      { key: "os", href: "/tools/os", labelKey: "nav.mega.os", icon: Cpu },
      { key: "algorithms", href: "/tools/algorithms", labelKey: "nav.mega.algorithms", icon: BrainCircuit },
      { key: "assignment", href: "/assignment", labelKey: "assignment", icon: FileText },
      { key: "lab", href: "/lab-report", labelKey: "labReport", icon: BookOpen },
      { key: "resources", href: "/interview/resources", labelKey: "nav.mega.resources", icon: Library },
      { key: "all-tools", href: "/tools", labelKey: "nav.mega.allTools", icon: Sparkles },
    ],
  },
  {
    key: "roadmaps",
    labelKey: "roadmaps",
    href: "/roadmaps",
    featured: [
      { key: "explore", href: "/roadmaps", labelKey: "nav.mega.exploreRoadmaps", description: "nav.mega.roadmapsDesc", icon: Map, badge: "popular" },
      { key: "dashboard", href: "/roadmaps/dashboard", labelKey: "nav.mega.roadmapDashboard", description: "nav.mega.dashboardDesc", icon: GraduationCap },
      { key: "frontend", href: "/roadmaps/frontend", labelKey: "nav.mega.frontendRoadmap", description: "nav.mega.frontendDesc", icon: Globe, badge: "new" },
    ],
    quickLinks: [
      { key: "backend", href: "/roadmaps/backend", labelKey: "nav.mega.backend", icon: Code2 },
      { key: "devops", href: "/roadmaps/devops", labelKey: "nav.mega.devops", icon: Wrench },
      { key: "ai", href: "/roadmaps/ai-engineer", labelKey: "nav.mega.ai", icon: Sparkles },
    ],
  },
  {
    key: "universities",
    labelKey: "universities",
    href: "/universities",
    featured: [
      { key: "hub", href: "/universities", labelKey: "nav.mega.uniHub", description: "nav.mega.uniHubDesc", icon: School, badge: "popular" },
      { key: "compare", href: "/universities/compare", labelKey: "nav.mega.compare", description: "nav.mega.compareDesc", icon: BarChart3 },
      { key: "predictor", href: "/universities/predictor", labelKey: "nav.mega.predictor", description: "nav.mega.predictorDesc", icon: Calculator, badge: "new" },
    ],
    quickLinks: [
      { key: "scholarships", href: "/universities/scholarships", labelKey: "nav.mega.scholarships", icon: GraduationCap },
      { key: "calculator", href: "/universities/calculator", labelKey: "nav.mega.uniCalculator", icon: Calculator },
      { key: "calculators", href: "/calculators", labelKey: "calculators", icon: Calculator },
      { key: "recommend", href: "/universities/recommend", labelKey: "nav.mega.recommend", icon: Sparkles },
    ],
  },
  {
    key: "career",
    labelKey: "career",
    href: "/career",
    featured: [
      { key: "career-hub", href: "/career", labelKey: "nav.mega.careerHub", description: "nav.mega.careerHubDesc", icon: Briefcase, badge: "popular" },
      { key: "interview", href: "/interview", labelKey: "interview", description: "nav.mega.interviewDesc", icon: BookOpen },
      { key: "cv", href: "/cv-builder", labelKey: "cvBuilder", description: "nav.mega.cvDesc", icon: FilePlus, badge: "new" },
    ],
    quickLinks: [
      { key: "assignment", href: "/assignment", labelKey: "assignment", icon: FileText },
      { key: "lab", href: "/lab-report", labelKey: "labReport", icon: BookOpen },
      { key: "calculators", href: "/calculators", labelKey: "calculators", icon: Calculator },
      { key: "resources", href: "/interview/resources", labelKey: "nav.mega.resources", icon: Library },
    ],
  },
  {
    key: "developer",
    labelKey: "developer",
    href: "/developer-tools",
    featured: [
      { key: "devtools-hub", href: "/developer-tools", labelKey: "nav.mega.devtoolsHub", description: "nav.mega.devtoolsDesc", icon: Wrench, badge: "popular" },
      { key: "json", href: "/developer-tools/json-formatter", labelKey: "nav.mega.json", description: "nav.mega.jsonDesc", icon: Code2 },
      { key: "hash", href: "/developer-tools/hash-generator", labelKey: "nav.mega.hash", description: "nav.mega.hashDesc", icon: Shield, badge: "new" },
    ],
    quickLinks: [
      { key: "base64", href: "/developer-tools/base64-encode", labelKey: "nav.mega.base64", icon: Code2 },
      { key: "json-viewer", href: "/developer-tools/json-viewer", labelKey: "nav.mega.jsonViewer", icon: Sparkles },
      { key: "all-devtools", href: "/developer-tools", labelKey: "nav.mega.allDevtools", icon: Wrench },
    ],
  },
];

/** @deprecated All secondary links live inside mega menus */
export const SIMPLE_NAV_LINKS: NavLinkItem[] = [];
/** @deprecated All secondary links live inside mega menus */
export const SECONDARY_NAV_LINKS: NavLinkItem[] = [];
