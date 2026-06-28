import type { CareerRoadmap } from "./types";

function roadmap(
  slug: string,
  title: string,
  description: string,
  icon: string,
  months: number,
  skills: string[],
  courses: string[],
  projects: string[],
  certs: string[],
  interview: string[],
  phases: { title: string; items: string[] }[]
): CareerRoadmap {
  return { slug, title, description, icon, estimatedMonths: months, skills, courses, projects, certifications: certs, interviewPrep: interview, phases };
}

export const CAREER_ROADMAPS: CareerRoadmap[] = [
  roadmap("frontend", "Frontend Developer", "Master HTML, CSS, JavaScript, React, and modern web development.", "Layout", 8,
    ["HTML/CSS", "JavaScript", "TypeScript", "React", "Next.js", "Tailwind", "Git", "Testing"],
    ["freeCodeCamp Responsive Web", "The Odin Project", "React Official Docs", "Next.js Learn"],
    ["Portfolio site", "Todo app with auth", "E-commerce UI clone", "Open source contribution"],
    ["Meta Front-End Certificate"],
    ["React hooks", "CSS layout", "Performance optimization", "System design basics"],
    [{ title: "Foundations (2 mo)", items: ["HTML semantics", "CSS Flexbox/Grid", "JavaScript ES6+"] }, { title: "React Ecosystem (3 mo)", items: ["React + hooks", "TypeScript", "Next.js App Router"] }, { title: "Job Ready (3 mo)", items: ["Portfolio", "Interview prep", "Apply to internships"] }]
  ),
  roadmap("backend", "Backend Developer", "Build APIs, databases, and server-side systems.", "Server", 10,
    ["Node.js/Python", "REST/GraphQL", "SQL/NoSQL", "Auth", "Docker", "Testing", "System Design"],
    ["Node.js course", "PostgreSQL for Developers", "System Design Primer"],
    ["REST API with JWT", "Blog CMS backend", "Real-time chat server"],
    ["AWS Cloud Practitioner"],
    ["API design", "Database indexing", "Caching", "Microservices intro"],
    [{ title: "Core (3 mo)", items: ["Pick language", "HTTP & REST", "SQL fundamentals"] }, { title: "Advanced (4 mo)", items: ["Auth patterns", "ORM", "Caching/Redis"] }, { title: "Production (3 mo)", items: ["Docker", "CI/CD", "Interview prep"] }]
  ),
  roadmap("fullstack", "Full Stack Developer", "End-to-end web development from UI to database.", "Layers", 12,
    ["Frontend + Backend", "Databases", "DevOps basics", "System Design", "Git", "Agile"],
    ["Full Stack Open", "CS50 Web", "Docker for Developers"],
    ["SaaS MVP", "Social app", "Marketplace clone"],
    ["AWS Solutions Architect Associate"],
    ["Full project walkthrough", "Deployment", "Database design"],
    [{ title: "Frontend (3 mo)", items: ["React/Next.js"] }, { title: "Backend (4 mo)", items: ["APIs + DB"] }, { title: "Integration (5 mo)", items: ["Deploy full app", "Scale", "Interview"] }]
  ),
  roadmap("mobile", "Mobile Developer", "iOS/Android or cross-platform mobile apps.", "Smartphone", 10,
    ["React Native/Flutter", "Mobile UI/UX", "State management", "Push notifications", "App Store deploy"],
    ["React Native docs", "Flutter codelabs"],
    ["Weather app", "Fitness tracker", "Social media clone"],
    ["Google Associate Android Developer"],
    ["Mobile architecture", "Offline-first", "Performance"],
    [{ title: "Basics (3 mo)", items: ["Language + UI"] }, { title: "Apps (4 mo)", items: ["2-3 projects"] }, { title: "Ship (3 mo)", items: ["Store deploy", "Interview"] }]
  ),
  roadmap("devops", "DevOps Engineer", "CI/CD, infrastructure, and automation.", "Cloud", 10,
    ["Linux", "Docker", "Kubernetes", "Terraform", "CI/CD", "Monitoring", "AWS/GCP"],
    ["Linux Journey", "KodeKloud DevOps", "AWS Skill Builder"],
    ["CI pipeline", "K8s deployment", "IaC project"],
    ["CKA", "AWS SAA"],
    ["Docker/K8s", "Infrastructure design", "Incident response"],
    [{ title: "Foundation (3 mo)", items: ["Linux + Git + Docker"] }, { title: "Orchestration (4 mo)", items: ["K8s", "Terraform", "CI/CD"] }, { title: "Cloud (3 mo)", items: ["AWS", "Monitoring", "Interview"] }]
  ),
  roadmap("cloud", "Cloud Engineer", "Design and manage cloud infrastructure.", "Cloud", 9,
    ["AWS/Azure/GCP", "Networking", "Security", "Serverless", "Storage", "IAM"],
    ["AWS Cloud Practitioner", "A Cloud Guru"],
    ["3-tier web app on AWS", "Serverless API", "Multi-region setup"],
    ["AWS Solutions Architect"],
    ["Cloud architecture", "Cost optimization", "Security best practices"],
    [{ title: "Fundamentals (3 mo)", items: ["Cloud concepts", "One provider deep dive"] }, { title: "Services (3 mo)", items: ["Compute, storage, networking"] }, { title: "Architect (3 mo)", items: ["Design systems", "Certification"] }]
  ),
  roadmap("ai-engineer", "AI Engineer", "Build AI-powered applications and pipelines.", "Brain", 12,
    ["Python", "ML basics", "LLMs", "Prompt engineering", "RAG", "MLOps", "Vector DBs"],
    ["Fast.ai", "DeepLearning.AI", "LangChain docs"],
    ["RAG chatbot", "Fine-tuned classifier", "AI SaaS tool"],
    ["TensorFlow Developer"],
    ["ML fundamentals", "LLM architecture", "System design for AI"],
    [{ title: "ML Basics (4 mo)", items: ["Python", "scikit-learn", "Neural nets"] }, { title: "LLMs (4 mo)", items: ["Prompting", "RAG", "Fine-tuning"] }, { title: "Production (4 mo)", items: ["Deploy models", "MLOps"] }]
  ),
  roadmap("ml-engineer", "ML Engineer", "Production machine learning systems.", "Cpu", 12,
    ["Python", "Statistics", "scikit-learn", "TensorFlow/PyTorch", "Feature engineering", "MLOps"],
    ["Andrew Ng ML", "Made With ML"],
    ["Kaggle competition", "Recommendation system", "ML pipeline"],
    ["AWS ML Specialty"],
    ["ML system design", "Model evaluation", "A/B testing"],
    [{ title: "Foundations (4 mo)", items: ["Math + Python + ML"] }, { title: "Deep Learning (4 mo)", items: ["CNNs", "NLP", "Transformers"] }, { title: "MLOps (4 mo)", items: ["Deploy", "Monitor", "Interview"] }]
  ),
  roadmap("data-scientist", "Data Scientist", "Analyze data and build predictive models.", "BarChart3", 11,
    ["Python", "pandas", "Statistics", "Visualization", "ML", "SQL", "Storytelling"],
    ["DataCamp", "Kaggle Learn", "Storytelling with Data"],
    ["EDA notebook", "Predictive model", "Dashboard"],
    ["Google Data Analytics"],
    ["Statistics", "A/B testing", "Communication"],
    [{ title: "Analytics (4 mo)", items: ["SQL + pandas + viz"] }, { title: "ML (4 mo)", items: ["Supervised learning"] }, { title: "Portfolio (3 mo)", items: ["Case studies", "Interview"] }]
  ),
  roadmap("cybersecurity", "Cyber Security Engineer", "Protect systems and networks.", "Shield", 12,
    ["Networking", "Linux", "Cryptography", "Pentesting", "SIEM", "Compliance"],
    ["TryHackMe", "CompTIA Security+ prep"],
    ["Home lab", "CTF challenges", "Vulnerability report"],
    ["CompTIA Security+", "CEH"],
    ["Security fundamentals", "Incident response", "Risk assessment"],
    [{ title: "Basics (4 mo)", items: ["Networking + Linux"] }, { title: "Offensive (4 mo)", items: ["Pentesting tools"] }, { title: "Defensive (4 mo)", items: ["SOC", "Certification"] }]
  ),
  roadmap("software-engineer", "Software Engineer", "General software engineering career path.", "Code2", 10,
    ["DSA", "OOP", "System Design", "Git", "Testing", "Agile", "One language deep"],
    ["CS50", "Grokking Algorithms"],
    ["Full-stack project", "Open source", "Internship"],
    [],
    ["DSA", "System design", "Behavioral"],
    [{ title: "CS Fundamentals (4 mo)", items: ["DSA + OOP"] }, { title: "Projects (3 mo)", items: ["2-3 solid projects"] }, { title: "Interview (3 mo)", items: ["LeetCode", "Mock interviews"] }]
  ),
  roadmap("qa-engineer", "QA Engineer", "Software testing and quality assurance.", "Bug", 8,
    ["Manual testing", "Selenium", "Cypress", "API testing", "CI integration", "Test plans"],
    ["ISTQB foundation", "Test Automation University"],
    ["Automation framework", "API test suite"],
    ["ISTQB Foundation"],
    ["Testing strategies", "Bug reporting", "Agile QA"],
    [{ title: "Manual (2 mo)", items: ["Test cases", "Bug lifecycle"] }, { title: "Automation (4 mo)", items: ["Selenium/Cypress"] }, { title: "CI (2 mo)", items: ["Pipeline integration"] }]
  ),
  roadmap("ui-ux", "UI/UX Designer", "Design user-centered digital products.", "Palette", 9,
    ["Figma", "User research", "Wireframing", "Prototyping", "Design systems", "Accessibility"],
    ["Google UX Design Certificate", "Refactoring UI"],
    ["Mobile app redesign", "Design system", "Case study"],
    ["Google UX Design"],
    ["Portfolio presentation", "Design process", "Critique"],
    [{ title: "Fundamentals (3 mo)", items: ["UX research", "Figma"] }, { title: "Projects (3 mo)", items: ["2-3 case studies"] }, { title: "Portfolio (3 mo)", items: ["Behance/Dribbble", "Interview"] }]
  ),
  roadmap("product-manager", "Product Manager", "Lead product strategy and development.", "Target", 10,
    ["Product strategy", "User research", "Roadmapping", "Agile", "Analytics", "Stakeholder management"],
    ["Product School resources", "Inspired by Marty Cagan"],
    ["PRD document", "Feature launch case study"],
    ["Product Management Certificate"],
    ["Product sense", "Metrics", "Prioritization frameworks"],
    [{ title: "Foundations (3 mo)", items: ["PM frameworks", "User research"] }, { title: "Practice (4 mo)", items: ["Side projects as PM"] }, { title: "Interview (3 mo)", items: ["Product cases", "Estimation"] }]
  ),
];

export function getRoadmap(slug: string) {
  return CAREER_ROADMAPS.find((r) => r.slug === slug);
}

export const ROADMAP_SLUGS = CAREER_ROADMAPS.map((r) => r.slug);
