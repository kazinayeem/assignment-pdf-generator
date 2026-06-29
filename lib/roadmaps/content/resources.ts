import type { LearningResource, RoadmapDefinition, RoadmapDifficulty } from "../types";

const OFFICIAL_DOCS: { match: RegExp; resources: Omit<LearningResource, "id" | "difficulty" | "topic">[] }[] = [
  { match: /react|frontend|next/i, resources: [
    { title: "React Documentation", description: "Official React docs for components, hooks, and patterns.", url: "https://react.dev", type: "docs", pricing: "free", estimatedHours: 20 },
    { title: "Next.js Learn", description: "Interactive Next.js course from Vercel.", url: "https://nextjs.org/learn", type: "course", pricing: "free", estimatedHours: 15 },
    { title: "MDN Web Docs", description: "Comprehensive web platform documentation.", url: "https://developer.mozilla.org", type: "docs", pricing: "free", estimatedHours: 40 },
  ]},
  { match: /python|django|fastapi|ml|data|ai|llm/i, resources: [
    { title: "Python Documentation", description: "Official Python language reference.", url: "https://docs.python.org/3/", type: "docs", pricing: "free", estimatedHours: 25 },
    { title: "FastAPI Docs", description: "Modern Python API framework documentation.", url: "https://fastapi.tiangolo.com", type: "docs", pricing: "free", estimatedHours: 10 },
    { title: "scikit-learn User Guide", description: "ML algorithms and pipelines.", url: "https://scikit-learn.org/stable/user_guide.html", type: "docs", pricing: "free", estimatedHours: 30 },
  ]},
  { match: /node|javascript|typescript/i, resources: [
    { title: "Node.js Documentation", description: "Official Node.js runtime docs.", url: "https://nodejs.org/docs", type: "docs", pricing: "free", estimatedHours: 15 },
    { title: "TypeScript Handbook", description: "Official TypeScript language guide.", url: "https://www.typescriptlang.org/docs/", type: "docs", pricing: "free", estimatedHours: 12 },
  ]},
  { match: /docker|kubernetes|devops|sre|platform|terraform|linux/i, resources: [
    { title: "Docker Documentation", description: "Container fundamentals and best practices.", url: "https://docs.docker.com", type: "docs", pricing: "free", estimatedHours: 12 },
    { title: "Kubernetes Documentation", description: "Official K8s concepts and tasks.", url: "https://kubernetes.io/docs/", type: "docs", pricing: "free", estimatedHours: 25 },
    { title: "Terraform Registry", description: "Infrastructure as Code modules and providers.", url: "https://registry.terraform.io", type: "docs", pricing: "free", estimatedHours: 10 },
  ]},
  { match: /aws|cloud|azure|gcp/i, resources: [
    { title: "AWS Documentation", description: "Amazon Web Services service guides.", url: "https://docs.aws.amazon.com", type: "docs", pricing: "free", estimatedHours: 30 },
    { title: "Microsoft Learn", description: "Azure and .NET learning paths.", url: "https://learn.microsoft.com", type: "course", pricing: "free", estimatedHours: 25 },
    { title: "Google Cloud Skills Boost", description: "GCP labs and certifications.", url: "https://www.cloudskillsboost.google", type: "course", pricing: "freemium", estimatedHours: 20 },
  ]},
  { match: /security|cyber|ethical|soc/i, resources: [
    { title: "OWASP Top Ten", description: "Web application security risks.", url: "https://owasp.org/www-project-top-ten/", type: "docs", pricing: "free", estimatedHours: 8 },
    { title: "TryHackMe", description: "Hands-on cybersecurity labs.", url: "https://tryhackme.com", type: "practice", pricing: "freemium", estimatedHours: 40 },
  ]},
  { match: /go|golang/i, resources: [
    { title: "Go Documentation", description: "Official Go language and standard library.", url: "https://go.dev/doc/", type: "docs", pricing: "free", estimatedHours: 15 },
  ]},
  { match: /rust/i, resources: [
    { title: "The Rust Book", description: "Official Rust programming guide.", url: "https://doc.rust-lang.org/book/", type: "book", pricing: "free", estimatedHours: 30 },
  ]},
];

const UNIVERSAL_RESOURCES: Omit<LearningResource, "id" | "difficulty" | "topic">[] = [
  { title: "freeCodeCamp", description: "Free coding courses and certifications.", url: "https://www.freecodecamp.org", type: "course", pricing: "free", estimatedHours: 50 },
  { title: "GitHub Student Developer Pack", description: "Free tools for students.", url: "https://education.github.com/pack", type: "tool", pricing: "free", estimatedHours: 2 },
  { title: "LeetCode", description: "Coding interview practice platform.", url: "https://leetcode.com", type: "practice", pricing: "freemium", estimatedHours: 100 },
  { title: "System Design Primer", description: "Open source system design guide.", url: "https://github.com/donnemartin/system-design-primer", type: "repo", pricing: "free", estimatedHours: 20 },
];

function difficultyForIndex(i: number): RoadmapDifficulty {
  if (i % 4 === 0) return "beginner";
  if (i % 4 === 1) return "intermediate";
  if (i % 4 === 2) return "advanced";
  return "expert";
}

export function generateResources(def: RoadmapDefinition): LearningResource[] {
  const resources: LearningResource[] = [];
  const haystack = `${def.title} ${def.languages.join(" ")} ${def.tags.join(" ")}`;
  let idx = 0;

  for (const group of OFFICIAL_DOCS) {
    if (group.match.test(haystack)) {
      for (const r of group.resources) {
        resources.push({ ...r, id: `${def.slug}-res-${idx++}`, difficulty: difficultyForIndex(idx) });
      }
    }
  }

  for (const r of UNIVERSAL_RESOURCES) {
    resources.push({ ...r, id: `${def.slug}-res-${idx++}`, difficulty: difficultyForIndex(idx) });
  }

  for (const node of def.nodeDefs) {
    resources.push({
      id: `${def.slug}-res-${node.id}`,
      title: `${node.title} — Official Guide`,
      description: `Curated learning path for ${node.title} within ${def.title}.`,
      url: "https://developer.mozilla.org",
      type: "article",
      pricing: "free",
      estimatedHours: node.estimatedHours,
      difficulty: node.difficulty,
      topic: node.title,
    });
    resources.push({
      id: `${def.slug}-res-yt-${node.id}`,
      title: `${node.title} YouTube Playlist`,
      description: `Recommended video playlist for mastering ${node.title}.`,
      url: "https://www.youtube.com/results?search_query=" + encodeURIComponent(`${node.title} tutorial`),
      type: "video",
      pricing: "free",
      estimatedHours: 5,
      difficulty: node.difficulty,
      topic: node.title,
    });
  }

  return resources;
}

export function getNodeResources(all: LearningResource[], topic: string, limit = 10): LearningResource[] {
  const matched = all.filter((r) => r.topic === topic);
  if (matched.length >= limit) return matched.slice(0, limit);
  return [...matched, ...all.filter((r) => !r.topic)].slice(0, limit);
}
