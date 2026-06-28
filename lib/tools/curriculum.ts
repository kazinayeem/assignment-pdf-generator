import type { Difficulty } from "./tokens";

export type CurriculumTopic = {
  slug: string;
  title: string;
  description: string;
  icon: string;
  difficulty: Difficulty;
  duration: string;
  status: "live" | "planned";
  href?: string;
  learningObjectives?: string[];
  prerequisites?: string[];
};

export type SubjectCurriculum = {
  slug: string;
  title: string;
  estimatedHours: number;
  difficulty: Difficulty;
  learningPath: string[];
  topics: CurriculumTopic[];
  missingModules: string[];
};

export const SWE_CURRICULUM: SubjectCurriculum = {
  slug: "swe",
  title: "Software Engineering",
  estimatedHours: 28,
  difficulty: "Intermediate",
  learningPath: [
    "SDLC Models",
    "Requirements Engineering",
    "UML & Modeling",
    "Design Patterns",
    "Software Testing",
    "Quality Assurance",
    "Project Management",
    "System Design",
  ],
  topics: [
    { slug: "sdlc-models", title: "SDLC Models", description: "Waterfall, Agile, Scrum, Kanban, and DevOps lifecycle models.", icon: "🔄", difficulty: "Beginner", duration: "45 min", status: "planned", learningObjectives: ["Compare SDLC models", "Choose the right model for a project", "Understand Agile ceremonies"] },
    { slug: "design-patterns", title: "Design Patterns", description: "Creational, structural, and behavioral patterns for maintainable code.", icon: "🏗️", difficulty: "Intermediate", duration: "60 min", status: "planned", learningObjectives: ["Apply Singleton, Factory, Observer", "Recognize anti-patterns", "Refactor toward patterns"] },
    { slug: "uml-modeling", title: "UML & Modeling", description: "Class, sequence, use-case, and deployment diagrams.", icon: "📊", difficulty: "Beginner", duration: "40 min", status: "planned" },
    { slug: "requirements-engineering", title: "Requirements Engineering", description: "Gathering, analysis, specification, and traceability.", icon: "📋", difficulty: "Beginner", duration: "50 min", status: "planned" },
    { slug: "software-testing", title: "Software Testing", description: "Unit, integration, system, and acceptance testing strategies.", icon: "🧪", difficulty: "Intermediate", duration: "55 min", status: "planned" },
    { slug: "quality-assurance", title: "Quality Assurance", description: "QA processes, metrics, ISO standards, and continuous improvement.", icon: "✅", difficulty: "Intermediate", duration: "45 min", status: "planned" },
    { slug: "project-management", title: "Project Management", description: "Planning, estimation, risk management, and delivery tracking.", icon: "📈", difficulty: "Intermediate", duration: "50 min", status: "planned" },
    { slug: "system-design", title: "System Design", description: "Scalability, load balancing, caching, and distributed architecture.", icon: "🎯", difficulty: "Advanced", duration: "90 min", status: "planned" },
  ],
  missingModules: ["API Design (REST/gRPC)", "Microservices vs Monolith", "Technical Debt", "Code Review Practices"],
};

export const PROGRAMMING_CURRICULUM: SubjectCurriculum = {
  slug: "programming",
  title: "Programming",
  estimatedHours: 40,
  difficulty: "Beginner",
  learningPath: ["Python", "JavaScript", "C Programming", "C++", "Java"],
  topics: [
    { slug: "c", title: "C Programming", description: "Pointers, memory management, structs, and file I/O.", icon: "©️", difficulty: "Beginner", duration: "8 hrs", status: "planned" },
    { slug: "cpp", title: "C++", description: "OOP, STL, templates, and modern C++17/20 features.", icon: "➕", difficulty: "Intermediate", duration: "10 hrs", status: "planned" },
    { slug: "javascript", title: "JavaScript", description: "ES6+, closures, async/await, and the event loop.", icon: "📜", difficulty: "Beginner", duration: "8 hrs", status: "planned" },
    { slug: "python", title: "Python", description: "Syntax, data structures, and the standard library.", icon: "🐍", difficulty: "Beginner", duration: "8 hrs", status: "live", href: "/tools/data-science/python" },
    { slug: "java", title: "Java", description: "OOP, collections, streams, generics, and the JVM.", icon: "☕", difficulty: "Intermediate", duration: "10 hrs", status: "planned" },
  ],
  missingModules: ["Go", "Rust", "TypeScript", "Debugging & Tooling", "Build Systems"],
};

export const WEB_CURRICULUM: SubjectCurriculum = {
  slug: "web",
  title: "Web Development",
  estimatedHours: 36,
  difficulty: "Intermediate",
  learningPath: ["HTML & CSS", "JavaScript", "React", "Next.js", "Node.js", "Full-Stack"],
  topics: [
    { slug: "html-css", title: "HTML & CSS", description: "Semantic HTML, Flexbox, Grid, and responsive design.", icon: "🎨", difficulty: "Beginner", duration: "6 hrs", status: "planned" },
    { slug: "javascript", title: "JavaScript", description: "DOM manipulation, events, fetch API, and ES6+.", icon: "⚡", difficulty: "Beginner", duration: "8 hrs", status: "planned" },
    { slug: "react", title: "React", description: "Components, hooks, state management, and routing.", icon: "⚛️", difficulty: "Intermediate", duration: "10 hrs", status: "planned" },
    { slug: "nodejs", title: "Node.js", description: "Express, REST APIs, middleware, and authentication.", icon: "🟢", difficulty: "Intermediate", duration: "8 hrs", status: "planned" },
    { slug: "full-stack", title: "Full-Stack", description: "Auth, databases, deployment, and production patterns.", icon: "🔗", difficulty: "Advanced", duration: "12 hrs", status: "planned" },
    { slug: "nextjs", title: "Next.js", description: "App Router, SSR, API routes, and server components.", icon: "▲", difficulty: "Intermediate", duration: "8 hrs", status: "planned" },
  ],
  missingModules: ["TypeScript", "Web Performance", "Accessibility (a11y)", "Testing (Jest/Cypress)"],
};

export const AI_CURRICULUM: SubjectCurriculum = {
  slug: "ai",
  title: "Artificial Intelligence",
  estimatedHours: 36,
  difficulty: "Advanced",
  learningPath: ["AI Foundations", "Search & Logic", "ML Basics", "Neural Networks", "NLP", "LLMs"],
  topics: [
    { slug: "ai-foundations", title: "AI Foundations", description: "History, agents, problem solving, knowledge representation.", icon: "🤖", difficulty: "Beginner", duration: "6 hrs", status: "planned" },
    { slug: "search-algorithms", title: "Search Algorithms", description: "BFS, DFS, A*, heuristic search.", icon: "🔍", difficulty: "Intermediate", duration: "5 hrs", status: "planned" },
    { slug: "machine-learning", title: "Machine Learning", description: "Supervised, unsupervised, model evaluation.", icon: "📊", difficulty: "Intermediate", duration: "8 hrs", status: "live", href: "/tools/data-science/machine-learning" },
    { slug: "deep-learning", title: "Deep Learning", description: "CNNs, RNNs, transformers.", icon: "🧠", difficulty: "Advanced", duration: "10 hrs", status: "live", href: "/tools/data-science/deep-learning" },
    { slug: "nlp", title: "Natural Language Processing", description: "Tokenization, embeddings, transformers.", icon: "💬", difficulty: "Advanced", duration: "8 hrs", status: "live", href: "/tools/data-science/nlp" },
    { slug: "llm", title: "Large Language Models", description: "Prompt engineering, RAG, fine-tuning.", icon: "✨", difficulty: "Advanced", duration: "6 hrs", status: "live", href: "/tools/data-science/llm" },
  ],
  missingModules: ["Computer Vision", "Reinforcement Learning", "AI Ethics"],
};

export const MOBILE_CURRICULUM: SubjectCurriculum = {
  slug: "mobile",
  title: "Mobile Development",
  estimatedHours: 32,
  difficulty: "Intermediate",
  learningPath: ["Mobile UI", "React Native", "Flutter", "State Management", "Deployment"],
  topics: [
    { slug: "mobile-ui", title: "Mobile UI/UX", description: "Design patterns, navigation, responsive layouts.", icon: "📱", difficulty: "Beginner", duration: "6 hrs", status: "planned" },
    { slug: "react-native", title: "React Native", description: "Components, navigation, native modules.", icon: "⚛️", difficulty: "Intermediate", duration: "10 hrs", status: "planned" },
    { slug: "flutter", title: "Flutter", description: "Widgets, state management, Dart basics.", icon: "🦋", difficulty: "Intermediate", duration: "10 hrs", status: "planned" },
    { slug: "mobile-state", title: "State Management", description: "Redux, MobX, Provider, Riverpod.", icon: "🔄", difficulty: "Intermediate", duration: "4 hrs", status: "planned" },
    { slug: "app-deployment", title: "App Store Deployment", description: "iOS App Store, Google Play, CI/CD.", icon: "🚀", difficulty: "Advanced", duration: "4 hrs", status: "planned" },
  ],
  missingModules: ["Swift/iOS Native", "Kotlin/Android Native", "Push Notifications"],
};

export function getPlannedTopic(subject: string, slug: string) {
  const map: Record<string, SubjectCurriculum> = {
    swe: SWE_CURRICULUM,
    programming: PROGRAMMING_CURRICULUM,
    web: WEB_CURRICULUM,
    ai: AI_CURRICULUM,
    mobile: MOBILE_CURRICULUM,
  };
  return map[subject]?.topics.find((t) => t.slug === slug);
}

export function topicHref(subject: string, topic: CurriculumTopic) {
  if (topic.href) return topic.href;
  return `/tools/${subject}/${topic.slug}`;
}
