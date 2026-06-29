import type {
  RoadmapCategory,
  RoadmapDefinition,
  RoadmapDifficulty,
  RoadmapNodeResource,
} from "./types";
import { buildSequentialEdges } from "./builder";

type RoadmapSeed = {
  slug: string;
  title: string;
  shortTitle?: string;
  description: string;
  icon: string;
  category: RoadmapCategory;
  difficulty?: RoadmapDifficulty;
  learningMonths?: number;
  prerequisites?: string[];
  salaryRange?: string;
  jobMarket?: "high" | "medium" | "growing" | "niche";
  demand?: "very-high" | "high" | "medium";
  tags?: string[];
  languages?: string[];
  beginnerFriendly?: boolean;
  popularity?: number;
  featured?: boolean;
  phases: { title: string; description: string; topics: string[] }[];
};

const DEFAULT_RESOURCES: RoadmapNodeResource[] = [
  { label: "MDN Web Docs", url: "https://developer.mozilla.org", type: "docs" },
  { label: "freeCodeCamp", url: "https://www.freecodecamp.org", type: "course" },
];

function seedToDefinition(seed: RoadmapSeed): RoadmapDefinition {
  const phases = seed.phases.map((p, i) => ({
    id: `phase-${i + 1}`,
    title: p.title,
    description: p.description,
  }));

  const nodeDefs = seed.phases.flatMap((p, pi) =>
    p.topics.map((topic, ti) => {
      const id = `${seed.slug}-p${pi + 1}-n${ti + 1}`;
      const difficulty: RoadmapDifficulty =
        pi === 0 ? "beginner" : pi === seed.phases.length - 1 ? "advanced" : "intermediate";
      return {
        id,
        title: topic,
        description: `Learn ${topic} as part of the ${seed.title} learning path. Build practical skills through exercises, projects, and interview preparation.`,
        difficulty,
        estimatedHours: 8 + pi * 4 + ti * 2,
        phaseId: `phase-${pi + 1}`,
        theory: `${topic} is a core competency for ${seed.title} roles. Focus on fundamentals first, then apply through hands-on practice and portfolio projects.`,
        bestPractices: [
          "Study in focused 45–90 minute blocks",
          "Build small projects after each topic",
          "Document learnings in your portfolio",
        ],
        commonMistakes: [
          "Skipping fundamentals for trendy tools",
          "Tutorial-only learning without practice",
          "Ignoring interview-style problem solving",
        ],
        codeExample: `// ${topic} — practice starter\n// Replace with hands-on exercises from BornoFlow tools\nconsole.log("Learning: ${topic}");`,
        cheatSheet: [`${topic} key concepts`, "Common patterns", "Interview talking points"],
        resources: DEFAULT_RESOURCES,
        projects: [
          {
            title: `${topic} Mini Project`,
            level: (pi === 0 ? "beginner" : "intermediate") as "beginner" | "intermediate",
            description: `Apply ${topic} in a small scoped project.`,
            requirements: ["Clear README", "Working demo", "Reflection notes"],
            tech: seed.languages ?? [seed.shortTitle ?? seed.title],
          },
        ],
        challenges: [
          {
            title: `${topic} fundamentals`,
            difficulty,
            hints: ["Break the problem into steps", "Review official documentation"],
            complexity: "O(n) typical for practice problems",
          },
        ],
        quizzes: [
          {
            question: `What is the primary purpose of ${topic} in ${seed.title}?`,
            options: ["Core skill", "Optional niche", "Deprecated", "Unrelated"],
            answer: 0,
            explanation: `${topic} is essential for this career path.`,
          },
        ],
        interview: [
          {
            question: `Explain how you would use ${topic} in a real project.`,
            type: "technical" as const,
            hint: "Use STAR format with a concrete example",
          },
        ],
        aiSummary: `Master ${topic} through theory, practice, and projects on the ${seed.title} roadmap.`,
      };
    })
  );

  const edges = buildSequentialEdges(nodeDefs);

  const months = seed.learningMonths ?? seed.phases.length * 2;
  return {
    slug: seed.slug,
    title: seed.title,
    shortTitle: seed.shortTitle ?? seed.title.split(" ")[0],
    description: seed.description,
    icon: seed.icon,
    category: seed.category,
    difficulty: seed.difficulty ?? "intermediate",
    learningMonths: months,
    learningHours: months * 40,
    prerequisites: seed.prerequisites ?? ["Basic computer literacy", "English reading skills"],
    salaryRange: seed.salaryRange ?? "৳40,000 – ৳2,50,000+ / month (BD tech market, varies by level)",
    jobMarket: seed.jobMarket ?? "high",
    demand: seed.demand ?? "high",
    tags: seed.tags ?? [seed.category, seed.title],
    languages: seed.languages ?? [],
    beginnerFriendly: seed.beginnerFriendly ?? seed.difficulty === "beginner",
    popularity: seed.popularity ?? 70,
    updatedAt: "2026-06-28",
    featured: seed.featured,
    phases,
    nodeDefs,
    edges,
  };
}

const SEEDS: RoadmapSeed[] = [
  {
    slug: "frontend",
    title: "Frontend Developer",
    description: "Master HTML, CSS, JavaScript, React, and modern web UX from beginner to job-ready.",
    icon: "Layout",
    category: "role",
    difficulty: "beginner",
    learningMonths: 8,
    featured: true,
    popularity: 98,
    languages: ["HTML", "CSS", "JavaScript", "TypeScript"],
    phases: [
      { title: "Web Foundations", description: "Core building blocks", topics: ["HTML & Semantics", "CSS & Layout", "JavaScript Basics", "Git & CLI"] },
      { title: "Modern Frontend", description: "Frameworks & tooling", topics: ["TypeScript", "React", "State Management", "Tailwind CSS"] },
      { title: "Production Skills", description: "Ship real apps", topics: ["Next.js", "Testing", "Performance", "Accessibility"] },
      { title: "Career Ready", description: "Portfolio & interviews", topics: ["Portfolio Projects", "System Design Basics", "Interview Prep", "Job Applications"] },
    ],
  },
  {
    slug: "backend",
    title: "Backend Developer",
    description: "Build scalable APIs, databases, authentication, and server-side systems.",
    icon: "Server",
    category: "role",
    featured: true,
    popularity: 95,
    languages: ["Node.js", "Python", "SQL"],
    phases: [
      { title: "Core Backend", description: "Server fundamentals", topics: ["HTTP & REST", "Node.js / Python", "SQL Databases", "API Design"] },
      { title: "Advanced Backend", description: "Production patterns", topics: ["Authentication", "Caching & Redis", "NoSQL", "Message Queues"] },
      { title: "DevOps Basics", description: "Deploy & monitor", topics: ["Docker", "CI/CD", "Logging", "Testing APIs"] },
      { title: "Job Ready", description: "Interviews & systems", topics: ["System Design", "Microservices Intro", "Portfolio API", "Interview Prep"] },
    ],
  },
  {
    slug: "full-stack",
    title: "Full Stack Developer",
    description: "End-to-end web development from UI to database and deployment.",
    icon: "Layers",
    category: "role",
    featured: true,
    popularity: 97,
    phases: [
      { title: "Frontend Core", description: "User interfaces", topics: ["HTML/CSS/JS", "React", "TypeScript", "UI Patterns"] },
      { title: "Backend Core", description: "Server & data", topics: ["REST APIs", "Databases", "Auth", "File Storage"] },
      { title: "Integration", description: "Full applications", topics: ["Next.js Full Stack", "Real-time Features", "Payments", "Email"] },
      { title: "Ship & Hire", description: "Career launch", topics: ["SaaS MVP", "Deployment", "Monitoring", "Interviews"] },
    ],
  },
  { slug: "devops", title: "DevOps Engineer", description: "CI/CD, infrastructure automation, and reliable delivery pipelines.", icon: "Workflow", category: "devops", phases: [{ title: "Foundation", description: "Ops basics", topics: ["Linux", "Git", "Networking", "Scripting"] }, { title: "Containers", description: "Docker & K8s", topics: ["Docker", "Kubernetes", "Helm", "Service Mesh Intro"] }, { title: "IaC & CI/CD", description: "Automation", topics: ["Terraform", "GitHub Actions", "Monitoring", "SRE Basics"] }] },
  { slug: "mlops", title: "MLOps Engineer", description: "Deploy, monitor, and scale machine learning systems in production.", icon: "Cpu", category: "ai", phases: [{ title: "ML Foundations", description: "Core ML", topics: ["Python ML Stack", "Model Training", "Feature Stores", "Experiment Tracking"] }, { title: "Pipelines", description: "Production ML", topics: ["ML Pipelines", "Model Registry", "A/B Testing", "Drift Detection"] }, { title: "Scale", description: "Enterprise MLOps", topics: ["Kubeflow", "GPU Serving", "Cost Optimization", "Governance"] }] },
  { slug: "sre", title: "Site Reliability Engineer", description: "Reliability, observability, incident response, and SLO-driven engineering.", icon: "Activity", category: "devops", shortTitle: "SRE", phases: [{ title: "Reliability", description: "SRE fundamentals", topics: ["SLOs & SLIs", "Error Budgets", "Incident Response", "Postmortems"] }, { title: "Observability", description: "Monitor systems", topics: ["Metrics", "Logging", "Tracing", "Alerting"] }, { title: "Scale", description: "Large systems", topics: ["Capacity Planning", "Chaos Engineering", "Automation", "On-call"] }] },
  { slug: "cloud-engineer", title: "Cloud Engineer", description: "Design and operate cloud-native infrastructure across major providers.", icon: "Cloud", category: "cloud", phases: [{ title: "Cloud Basics", description: "Core concepts", topics: ["Cloud Models", "IAM", "Networking", "Storage"] }, { title: "Services", description: "Managed services", topics: ["Compute", "Databases", "Serverless", "CDN"] }, { title: "Architecture", description: "Design at scale", topics: ["Well-Architected", "Multi-region", "Cost Control", "Security"] }] },
  { slug: "ai-engineer", title: "AI Engineer", description: "Build AI-powered applications with LLMs, RAG, and intelligent agents.", icon: "Brain", category: "ai", featured: true, phases: [{ title: "AI Foundations", description: "ML & Python", topics: ["Python for AI", "ML Basics", "Neural Networks", "Transformers Intro"] }, { title: "LLM Apps", description: "Application layer", topics: ["Prompt Engineering", "RAG", "Vector DBs", "AI APIs"] }, { title: "Production AI", description: "Ship AI products", topics: ["Evaluation", "Safety", "Deployment", "Cost Control"] }] },
  { slug: "machine-learning", title: "Machine Learning Engineer", description: "Train, evaluate, and deploy machine learning models.", icon: "BrainCircuit", category: "ai", phases: [{ title: "ML Core", description: "Algorithms", topics: ["Statistics", "scikit-learn", "Feature Engineering", "Model Selection"] }, { title: "Deep Learning", description: "Neural nets", topics: ["PyTorch", "CNNs", "NLP", "Transformers"] }, { title: "Production", description: "Real systems", topics: ["Model Serving", "MLOps", "Monitoring", "Interview Prep"] }] },
  { slug: "data-science", title: "Data Scientist", description: "Analyze data, build models, and communicate insights.", icon: "BarChart3", category: "data", phases: [{ title: "Analytics", description: "Data skills", topics: ["SQL", "pandas", "Visualization", "Statistics"] }, { title: "Modeling", description: "Predictive ML", topics: ["Regression", "Classification", "Time Series", "Experimentation"] }, { title: "Storytelling", description: "Business impact", topics: ["Dashboards", "Case Studies", "A/B Tests", "Presentations"] }] },
  { slug: "cyber-security", title: "Cyber Security Engineer", description: "Protect systems, networks, and applications from threats.", icon: "Shield", category: "security", phases: [{ title: "Security Basics", description: "Fundamentals", topics: ["Networking", "Cryptography", "Linux Security", "Threat Models"] }, { title: "Offensive", description: "Pentesting", topics: ["Reconnaissance", "Web Exploits", "Burp Suite", "CTF Practice"] }, { title: "Defensive", description: "SOC & compliance", topics: ["SIEM", "Incident Response", "Compliance", "Certifications"] }] },
  { slug: "mobile-developer", title: "Mobile Developer", description: "Build native and cross-platform mobile applications.", icon: "Smartphone", category: "mobile", phases: [{ title: "Mobile Basics", description: "UI & patterns", topics: ["Mobile UX", "State Management", "Navigation", "APIs"] }, { title: "Platforms", description: "Ship apps", topics: ["Android / iOS", "Cross-platform", "Push Notifications", "App Store"] }, { title: "Career", description: "Portfolio", topics: ["2–3 Apps", "Performance", "Testing", "Interviews"] }] },
  { slug: "android", title: "Android Developer", description: "Kotlin, Jetpack Compose, and Google Play deployment.", icon: "Smartphone", category: "mobile", languages: ["Kotlin"], phases: [{ title: "Kotlin", description: "Language", topics: ["Kotlin Basics", "OOP", "Coroutines", "Android Studio"] }, { title: "Android UI", description: "Compose", topics: ["Jetpack Compose", "Navigation", "Room DB", "Networking"] }, { title: "Ship", description: "Play Store", topics: ["Testing", "Play Console", "Performance", "Material Design"] }] },
  { slug: "ios", title: "iOS Developer", description: "Swift, SwiftUI, and App Store publishing.", icon: "Smartphone", category: "mobile", languages: ["Swift"], phases: [{ title: "Swift", description: "Language", topics: ["Swift Basics", "Optionals", "Protocols", "Xcode"] }, { title: "SwiftUI", description: "UI layer", topics: ["SwiftUI Views", "Combine", "Core Data", "Networking"] }, { title: "App Store", description: "Release", topics: ["TestFlight", "HIG", "Accessibility", "App Review"] }] },
  { slug: "flutter", title: "Flutter Developer", description: "Cross-platform apps with Dart and Flutter.", icon: "Smartphone", category: "mobile", languages: ["Dart"], phases: [{ title: "Dart", description: "Language", topics: ["Dart Basics", "Widgets", "State", "Async"] }, { title: "Flutter", description: "Apps", topics: ["Layouts", "Navigation", "Firebase", "Animations"] }, { title: "Deploy", description: "Stores", topics: ["Testing", "iOS Build", "Android Build", "CI/CD"] }] },
  { slug: "react-native", title: "React Native Developer", description: "Mobile apps with JavaScript and React Native.", icon: "Smartphone", category: "mobile", languages: ["JavaScript", "TypeScript"], phases: [{ title: "RN Basics", description: "Core", topics: ["Components", "Navigation", "Styling", "Native Modules"] }, { title: "Production", description: "Real apps", topics: ["State", "APIs", "Offline", "Push"] }, { title: "Release", description: "Stores", topics: ["EAS Build", "Performance", "Testing", "Debugging"] }] },
  { slug: "game-development", title: "Game Developer", description: "Design and build interactive games and game systems.", icon: "Gamepad2", category: "other", phases: [{ title: "Game Basics", description: "Foundations", topics: ["Game Loops", "Physics", "2D Graphics", "Input"] }, { title: "Engines", description: "Tools", topics: ["Unity / Godot", "Scenes", "Scripting", "Audio"] }, { title: "Polish", description: "Ship games", topics: ["UI/UX", "Optimization", "Publishing", "Portfolio"] }] },
  { slug: "blockchain", title: "Blockchain Developer", description: "Distributed ledgers, smart contracts, and dApp architecture.", icon: "Link", category: "other", phases: [{ title: "Blockchain Core", description: "Concepts", topics: ["Cryptography", "Consensus", "Wallets", "Ethereum"] }, { title: "Smart Contracts", description: "On-chain", topics: ["Solidity", "Hardhat", "Testing", "Security"] }, { title: "dApps", description: "Full stack Web3", topics: ["Web3.js", "IPFS", "DeFi Intro", "Auditing"] }] },
  { slug: "web3", title: "Web3 Developer", description: "Decentralized applications and blockchain integration.", icon: "Globe", category: "other", phases: [{ title: "Web3 Stack", description: "Basics", topics: ["Wallets", "RPC", "Smart Contracts", "Tokens"] }, { title: "Frontend Web3", description: "dApp UI", topics: ["wagmi", "ethers.js", "NFT UIs", "Transactions"] }, { title: "Security", description: "Safe Web3", topics: ["Common Exploits", "Audits", "Best Practices", "Compliance"] }] },
  { slug: "embedded-systems", title: "Embedded Systems Engineer", description: "Firmware, microcontrollers, and hardware-software integration.", icon: "Microchip", category: "other", phases: [{ title: "Electronics", description: "Hardware", topics: ["C/C++", "Microcontrollers", "GPIO", "Protocols"] }, { title: "RTOS", description: "Real-time", topics: ["FreeRTOS", "Drivers", "Debugging", "Power"] }, { title: "Projects", description: "Devices", topics: ["IoT Device", "Sensors", "OTA Updates", "Certification"] }] },
  { slug: "iot", title: "IoT Engineer", description: "Connected devices, edge computing, and cloud integration.", icon: "Wifi", category: "other", phases: [{ title: "IoT Stack", description: "Layers", topics: ["Sensors", "MQTT", "Edge", "Cloud IoT"] }, { title: "Platforms", description: "Build", topics: ["ESP32", "Raspberry Pi", "AWS IoT", "Dashboards"] }, { title: "Security", description: "Safe IoT", topics: ["Device Auth", "OTA", "Monitoring", "Scale"] }] },
  { slug: "robotics", title: "Robotics Engineer", description: "Robots, control systems, and autonomous navigation.", icon: "Bot", category: "other", phases: [{ title: "Robotics Math", description: "Theory", topics: ["Kinematics", "Control Theory", "ROS Intro", "Simulation"] }, { title: "Build", description: "Hardware", topics: ["Actuators", "Sensors", "SLAM", "Path Planning"] }, { title: "Autonomy", description: "AI robots", topics: ["Computer Vision", "ML for Robotics", "Safety", "Competitions"] }] },
  { slug: "qa-automation", title: "QA Automation Engineer", description: "Automated testing frameworks and quality pipelines.", icon: "TestTube", category: "role", phases: [{ title: "Testing", description: "QA basics", topics: ["Test Plans", "Manual QA", "Bug Lifecycle", "Agile QA"] }, { title: "Automation", description: "Tools", topics: ["Selenium", "Cypress", "API Testing", "CI Integration"] }, { title: "Advanced", description: "Scale QA", topics: ["Performance Tests", "Mobile Testing", "Reporting", "Leadership"] }] },
  { slug: "software-testing", title: "Software Testing", description: "Comprehensive software quality assurance practices.", icon: "Bug", category: "role", beginnerFriendly: true, phases: [{ title: "Fundamentals", description: "QA core", topics: ["Testing Types", "Test Cases", "SDLC", "Documentation"] }, { title: "Techniques", description: "Methods", topics: ["Black Box", "White Box", "Exploratory", "Regression"] }, { title: "Career", description: "Growth", topics: ["ISTQB", "Automation Intro", "Agile", "Interview"] }] },
  { slug: "ui-ux-design", title: "UI/UX Designer", description: "User research, interface design, and design systems.", icon: "Palette", category: "design", phases: [{ title: "UX", description: "Research", topics: ["User Research", "Personas", "Journey Maps", "Wireframes"] }, { title: "UI", description: "Visual design", topics: ["Figma", "Typography", "Color", "Components"] }, { title: "Portfolio", description: "Case studies", topics: ["Design System", "Prototyping", "Accessibility", "Interviews"] }] },
  { slug: "product-management", title: "Product Manager", description: "Product strategy, roadmapping, and cross-functional leadership.", icon: "Target", category: "role", phases: [{ title: "PM Foundations", description: "Core skills", topics: ["Product Discovery", "Roadmaps", "User Stories", "Metrics"] }, { title: "Execution", description: "Delivery", topics: ["Agile", "Stakeholders", "Prioritization", "Go-to-Market"] }, { title: "Interview", description: "PM roles", topics: ["Product Cases", "Estimation", "Strategy", "Behavioral"] }] },
  { slug: "technical-writing", title: "Technical Writer", description: "Documentation, developer content, and API guides.", icon: "FileText", category: "other", phases: [{ title: "Writing", description: "Core skills", topics: ["Technical Style", "Docs-as-Code", "API Docs", "Tutorials"] }, { title: "Tools", description: "Platforms", topics: ["Markdown", "Docusaurus", "OpenAPI", "Diagrams"] }, { title: "Career", description: "Portfolio", topics: ["Sample Docs", "Open Source", "Developer Advocacy", "Freelance"] }] },
  { slug: "open-source", title: "Open Source Contributor", description: "Contribute to OSS projects and build public reputation.", icon: "Github", category: "other", phases: [{ title: "OSS Basics", description: "Culture", topics: ["Git Workflow", "Issues & PRs", "Code Review", "Community"] }, { title: "Contribute", description: "First PRs", topics: ["Good First Issues", "Documentation", "Testing", "Maintainer Skills"] }, { title: "Lead", description: "Ownership", topics: ["Own a Module", "RFCs", "Release Management", "Mentorship"] }] },
  { slug: "forward-deployed-engineer", title: "Forward Deployed Engineer", description: "Customer-facing engineering solving real enterprise problems.", icon: "Rocket", category: "role", phases: [{ title: "Engineering", description: "Strong base", topics: ["Full Stack", "SQL", "APIs", "Debugging"] }, { title: "Customer", description: "FDE skills", topics: ["Requirements", "Prototyping", "Deployments", "Training"] }, { title: "Scale", description: "Impact", topics: ["Solution Design", "Feedback Loops", "Product Influence", "Travel Ready"] }] },
  { slug: "platform-engineer", title: "Platform Engineer", description: "Internal developer platforms and golden paths for engineering teams.", icon: "Boxes", category: "devops", phases: [{ title: "Platform", description: "Concepts", topics: ["IDP", "Developer Experience", "Kubernetes", "GitOps"] }, { title: "Build", description: "Platform services", topics: ["Service Catalog", "CI Templates", "Observability", "Security"] }, { title: "Adoption", description: "Scale platform", topics: ["Documentation", "Onboarding", "Metrics", "Governance"] }] },
  { slug: "data-engineer", title: "Data Engineer", description: "Data pipelines, warehouses, and analytics infrastructure.", icon: "Database", category: "data", phases: [{ title: "Data Foundations", description: "Core", topics: ["SQL", "Python", "ETL", "Data Modeling"] }, { title: "Pipelines", description: "Scale", topics: ["Airflow", "Spark", "Kafka", "dbt"] }, { title: "Cloud Data", description: "Modern stack", topics: ["Snowflake", "BigQuery", "Lakehouse", "Governance"] }] },
  { slug: "prompt-engineer", title: "Prompt Engineer", description: "Design effective prompts and LLM workflows.", icon: "MessageSquare", category: "ai", phases: [{ title: "Prompting", description: "Techniques", topics: ["Zero-shot", "Few-shot", "Chain-of-Thought", "Evaluation"] }, { title: "Applications", description: "Use cases", topics: ["RAG Prompts", "Agents", "Tools", "Safety"] }, { title: "Production", description: "At scale", topics: ["Prompt Versioning", "A/B Tests", "Cost", "Monitoring"] }] },
  { slug: "llm-engineer", title: "LLM Engineer", description: "Build applications on large language models.", icon: "Sparkles", category: "ai", phases: [{ title: "LLM Basics", description: "Models", topics: ["Transformers", "Tokenization", "Fine-tuning", "Embeddings"] }, { title: "Apps", description: "Build", topics: ["LangChain", "RAG", "Function Calling", "Agents"] }, { title: "Production", description: "Ship", topics: ["Latency", "Caching", "Safety", "Evals"] }] },
  { slug: "agentic-ai-engineer", title: "Agentic AI Engineer", description: "Autonomous AI agents and multi-step reasoning systems.", icon: "Bot", category: "ai", phases: [{ title: "Agents", description: "Concepts", topics: ["Agent Loops", "Tool Use", "Memory", "Planning"] }, { title: "Frameworks", description: "Build", topics: ["LangGraph", "CrewAI", "MCP", "Orchestration"] }, { title: "Enterprise", description: "Scale", topics: ["Guardrails", "Human-in-Loop", "Observability", "Compliance"] }] },
  { slug: "computer-vision", title: "Computer Vision Engineer", description: "Image processing, object detection, and visual AI.", icon: "Eye", category: "ai", phases: [{ title: "CV Basics", description: "Foundations", topics: ["OpenCV", "Image Processing", "CNNs", "Datasets"] }, { title: "Detection", description: "Models", topics: ["YOLO", "Segmentation", "Tracking", "Augmentation"] }, { title: "Deploy", description: "Production", topics: ["Edge CV", "ONNX", "Real-time", "MLOps"] }] },
  { slug: "nlp-engineer", title: "NLP Engineer", description: "Natural language processing and text intelligence.", icon: "Languages", category: "ai", phases: [{ title: "NLP Core", description: "Text", topics: ["Tokenization", "Embeddings", "Classification", "NER"] }, { title: "Transformers", description: "Modern NLP", topics: ["BERT", "Fine-tuning", "Summarization", "QA Systems"] }, { title: "LLM NLP", description: "Production", topics: ["RAG", "Evaluation", "Multilingual", "Deployment"] }] },
  { slug: "site-reliability-engineer", title: "Site Reliability Engineer", description: "Large-scale reliability engineering and operations.", icon: "Gauge", category: "devops", shortTitle: "SRE", phases: [{ title: "SRE", description: "Principles", topics: ["Google SRE Book", "Toil Reduction", "Automation", "Blameless PMs"] }, { title: "Systems", description: "At scale", topics: ["Distributed Systems", "Load Balancing", "Databases at Scale", "Caching"] }, { title: "Practice", description: "On-call", topics: ["Runbooks", "Game Days", "Capacity", "Interview"] }] },
  { slug: "infrastructure-engineer", title: "Infrastructure Engineer", description: "Core infrastructure, networking, and compute platforms.", icon: "HardDrive", category: "devops", phases: [{ title: "Infra", description: "Basics", topics: ["Linux", "Networking", "Storage", "Virtualization"] }, { title: "Cloud Infra", description: "Scale", topics: ["VPC", "Load Balancers", "DNS", "CDN"] }, { title: "Automation", description: "IaC", topics: ["Terraform", "Ansible", "Monitoring", "DR"] }] },
  { slug: "solutions-architect", title: "Solutions Architect", description: "Design enterprise solutions across cloud and software systems.", icon: "Network", category: "cloud", phases: [{ title: "Architecture", description: "Design", topics: ["Patterns", "Trade-offs", "Cloud Services", "Security"] }, { title: "Enterprise", description: "Scale", topics: ["Integration", "Migration", "Cost", "Compliance"] }, { title: "Certification", description: "AWS/Azure", topics: ["SA Associate", "Case Studies", "Whiteboarding", "Stakeholders"] }] },
  { slug: "cloud-security", title: "Cloud Security Engineer", description: "Secure cloud workloads, IAM, and compliance.", icon: "ShieldCheck", category: "security", phases: [{ title: "Cloud Sec", description: "Basics", topics: ["Shared Responsibility", "IAM", "Encryption", "VPC Security"] }, { title: "Threats", description: "Defense", topics: ["CSPM", "WAF", "SIEM", "Incident Response"] }, { title: "Compliance", description: "Governance", topics: ["SOC 2", "ISO 27001", "Audits", "Zero Trust"] }] },
  { slug: "network-engineer", title: "Network Engineer", description: "Enterprise networking, routing, and network security.", icon: "Network", category: "other", phases: [{ title: "Networking", description: "CCNA level", topics: ["TCP/IP", "Subnetting", "Routing", "Switching"] }, { title: "Advanced", description: "Enterprise", topics: ["BGP", "VPN", "Firewalls", "Wi-Fi"] }, { title: "Cert", description: "Career", topics: ["CCNA", "Lab Practice", "Troubleshooting", "Design"] }] },
  { slug: "linux-engineer", title: "Linux Engineer", description: "Linux administration, shell scripting, and server management.", icon: "Terminal", category: "devops", languages: ["Bash"], phases: [{ title: "Linux", description: "Admin", topics: ["Filesystem", "Users & Permissions", "systemd", "Package Mgmt"] }, { title: "Scripting", description: "Automation", topics: ["Bash", "awk/sed", "Cron", "Logs"] }, { title: "Servers", description: "Production", topics: ["Web Servers", "Hardening", "Monitoring", "Troubleshooting"] }] },
  { slug: "go-developer", title: "Go Developer", description: "Build fast, concurrent backend services with Go.", icon: "Code2", category: "language", languages: ["Go"], phases: [{ title: "Go Basics", description: "Language", topics: ["Syntax", "Structs", "Interfaces", "Error Handling"] }, { title: "Concurrency", description: "Goroutines", topics: ["Goroutines", "Channels", "Context", "sync"] }, { title: "Services", description: "Backend", topics: ["HTTP Servers", "gRPC", "Testing", "Deployment"] }] },
  { slug: "rust-developer", title: "Rust Developer", description: "Systems programming with memory safety and performance.", icon: "Code2", category: "language", languages: ["Rust"], phases: [{ title: "Rust", description: "Ownership", topics: ["Ownership", "Borrowing", "Structs", "Enums"] }, { title: "Intermediate", description: "Patterns", topics: ["Traits", "Lifetimes", "Error Types", "Collections"] }, { title: "Systems", description: "Build", topics: ["CLI Tools", "WebAssembly", "Async", "Performance"] }] },
  { slug: "python-developer", title: "Python Developer", description: "Python for web, automation, data, and scripting.", icon: "Code2", category: "language", languages: ["Python"], beginnerFriendly: true, popularity: 92, phases: [{ title: "Python Core", description: "Language", topics: ["Syntax", "OOP", "Modules", "Virtual Envs"] }, { title: "Applications", description: "Domains", topics: ["Web (Django/FastAPI)", "Automation", "Data Scripts", "Testing"] }, { title: "Career", description: "Jobs", topics: ["Portfolio", "Open Source", "Interview", "Specialization"] }] },
  { slug: "java-developer", title: "Java Developer", description: "Enterprise Java, Spring ecosystem, and JVM applications.", icon: "Coffee", category: "language", languages: ["Java"], phases: [{ title: "Java Core", description: "Language", topics: ["OOP", "Collections", "Streams", "Concurrency"] }, { title: "Spring", description: "Framework", topics: ["Spring Boot", "JPA", "REST", "Security"] }, { title: "Enterprise", description: "Scale", topics: ["Microservices", "Testing", "Maven/Gradle", "Interview"] }] },
  { slug: "cpp-developer", title: "C++ Developer", description: "High-performance systems and application development in C++.", icon: "Code2", category: "language", languages: ["C++"], phases: [{ title: "C++ Core", description: "Language", topics: ["Pointers", "OOP", "STL", "Memory"] }, { title: "Modern C++", description: "C++17/20", topics: ["Smart Pointers", "Templates", "Move Semantics", "Concurrency"] }, { title: "Domains", description: "Apply", topics: ["Game Dev", "Systems", "Competitive Prog", "Interview"] }] },
  { slug: "csharp-developer", title: "C# Developer", description: ".NET applications, ASP.NET Core, and enterprise software.", icon: "Code2", category: "language", languages: ["C#"], phases: [{ title: "C# Core", description: "Language", topics: ["Syntax", "LINQ", "Async", "OOP"] }, { title: ".NET", description: "Framework", topics: ["ASP.NET Core", "Entity Framework", "Blazor", "Testing"] }, { title: "Cloud", description: "Azure", topics: ["Azure App Service", "Functions", "DevOps", "Interview"] }] },
  { slug: "nodejs-developer", title: "Node.js Developer", description: "JavaScript runtime for APIs, real-time apps, and tooling.", icon: "Hexagon", category: "language", languages: ["JavaScript", "TypeScript"], phases: [{ title: "Node Core", description: "Runtime", topics: ["Event Loop", "Modules", "NPM", "Streams"] }, { title: "APIs", description: "Backend", topics: ["Express", "Fastify", "Auth", "Databases"] }, { title: "Advanced", description: "Scale", topics: ["WebSockets", "Microservices", "Testing", "Performance"] }] },
  { slug: "php-developer", title: "PHP Developer", description: "Web applications with PHP and modern frameworks.", icon: "Code2", category: "language", languages: ["PHP"], phases: [{ title: "PHP Core", description: "Language", topics: ["Syntax", "OOP", "Composer", "MySQL"] }, { title: "Laravel", description: "Framework", topics: ["Routing", "Eloquent", "Blade", "APIs"] }, { title: "Deploy", description: "Production", topics: ["Hosting", "Security", "Caching", "WordPress Intro"] }] },
  { slug: "aws", title: "AWS Cloud", description: "Amazon Web Services certification and architecture path.", icon: "Cloud", category: "cloud", phases: [{ title: "Cloud Practitioner", description: "Foundations", topics: ["IAM", "EC2", "S3", "Billing"] }, { title: "Associate", description: "Solutions Architect", topics: ["VPC", "RDS", "Lambda", "CloudFormation"] }, { title: "Professional", description: "Advanced", topics: ["Multi-account", "Hybrid", "Migration", "Cost"] }] },
  { slug: "azure", title: "Microsoft Azure", description: "Azure cloud services and certification path.", icon: "Cloud", category: "cloud", phases: [{ title: "AZ-900", description: "Fundamentals", topics: ["Cloud Concepts", "Azure Services", "Security", "Pricing"] }, { title: "AZ-104", description: "Administrator", topics: ["VMs", "Storage", "Networking", "Identity"] }, { title: "AZ-305", description: "Architect", topics: ["Design", "Migration", "Governance", "DR"] }] },
  { slug: "gcp", title: "Google Cloud Platform", description: "GCP services, data, and cloud-native development.", icon: "Cloud", category: "cloud", phases: [{ title: "Foundations", description: "GCP basics", topics: ["IAM", "Compute Engine", "Cloud Storage", "VPC"] }, { title: "Associate", description: "Cloud Engineer", topics: ["GKE", "Cloud Run", "Pub/Sub", "Terraform"] }, { title: "Professional", description: "Architect", topics: ["Hybrid", "BigQuery", "Security", "Migration"] }] },
  { slug: "docker", title: "Docker", description: "Containerization fundamentals and Docker workflows.", icon: "Box", category: "devops", phases: [{ title: "Containers", description: "Basics", topics: ["Images", "Containers", "Dockerfile", "Volumes"] }, { title: "Compose", description: "Multi-container", topics: ["Docker Compose", "Networking", "Dev Environments", "Best Practices"] }, { title: "Production", description: "Ops", topics: ["Registry", "Security", "Optimization", "Kubernetes Intro"] }] },
  { slug: "kubernetes", title: "Kubernetes", description: "Container orchestration at scale with K8s.", icon: "Boxes", category: "devops", phases: [{ title: "K8s Core", description: "Objects", topics: ["Pods", "Deployments", "Services", "ConfigMaps"] }, { title: "Operations", description: "Run clusters", topics: ["Ingress", "Helm", "RBAC", "Monitoring"] }, { title: "CKA", description: "Certification", topics: ["Troubleshooting", "Networking", "Storage", "Security"] }] },
  { slug: "terraform", title: "Terraform", description: "Infrastructure as Code with HashiCorp Terraform.", icon: "FileCode", category: "devops", phases: [{ title: "IaC", description: "Basics", topics: ["HCL", "Providers", "State", "Modules"] }, { title: "AWS/GCP", description: "Cloud", topics: ["VPC Modules", "IAM", "Remote State", "Workspaces"] }, { title: "Enterprise", description: "Scale", topics: ["Terragrunt", "Policy as Code", "CI/CD", "Drift"] }] },
  { slug: "linux", title: "Linux", description: "Master Linux for development and operations.", icon: "Terminal", category: "devops", beginnerFriendly: true, phases: [{ title: "User", description: "Daily use", topics: ["Shell", "Files", "Permissions", "Processes"] }, { title: "Admin", description: "Server", topics: ["systemd", "Networking", "Packages", "Logs"] }, { title: "Power User", description: "Advanced", topics: ["Bash Scripting", "SSH", "Containers", "Security"] }] },
  { slug: "networking", title: "Computer Networking", description: "Network protocols, architecture, and troubleshooting.", icon: "Network", category: "other", phases: [{ title: "Protocols", description: "OSI/TCP", topics: ["TCP/IP", "DNS", "HTTP", "TLS"] }, { title: "LAN/WAN", description: "Infrastructure", topics: ["Subnetting", "Routing", "NAT", "VPN"] }, { title: "Practice", description: "Labs", topics: ["Wireshark", "Packet Tracer", "Troubleshooting", "Interview"] }] },
  { slug: "ethical-hacking", title: "Ethical Hacking", description: "Authorized penetration testing and security research.", icon: "ShieldAlert", category: "security", phases: [{ title: "Recon", description: "Info gathering", topics: ["OSINT", "Scanning", "Enumeration", "Vulnerabilities"] }, { title: "Exploitation", description: "Pentest", topics: ["Web Hacks", "Metasploit", "Privilege Escalation", "Reporting"] }, { title: "CEH", description: "Cert path", topics: ["Methodology", "Tools", "Legal Ethics", "Lab Practice"] }] },
  { slug: "soc-analyst", title: "SOC Analyst", description: "Security operations center monitoring and incident response.", icon: "Shield", category: "security", phases: [{ title: "SOC", description: "Operations", topics: ["SIEM", "Log Analysis", "Alert Triage", "Playbooks"] }, { title: "Threats", description: "Detection", topics: ["MITRE ATT&CK", "Malware Analysis", "Phishing", "Forensics Intro"] }, { title: "Career", description: "Growth", topics: ["Security+", "Shift Work", "Escalation", "Blue Team"] }] },
  { slug: "data-analytics", title: "Data Analyst", description: "Business analytics, SQL, and data visualization.", icon: "PieChart", category: "data", beginnerFriendly: true, phases: [{ title: "Analytics", description: "Core", topics: ["Excel", "SQL", "Statistics", "BI Tools"] }, { title: "Visualization", description: "Dashboards", topics: ["Tableau", "Power BI", "Looker", "Storytelling"] }, { title: "Career", description: "Jobs", topics: ["Case Studies", "Portfolio", "Domain Knowledge", "Interview"] }] },
  { slug: "deep-learning", title: "Deep Learning", description: "Neural networks, CNNs, RNNs, and transformers.", icon: "Brain", category: "ai", phases: [{ title: "Neural Nets", description: "Theory", topics: ["Backprop", "Activation", "Optimizers", "Regularization"] }, { title: "Architectures", description: "Models", topics: ["CNNs", "RNNs", "Transformers", "GANs Intro"] }, { title: "Practice", description: "Projects", topics: ["PyTorch", "Kaggle", "Research Papers", "Deployment"] }] },
  { slug: "laravel", title: "Laravel Developer", description: "PHP web applications with Laravel framework.", icon: "Code2", category: "framework", languages: ["PHP"], phases: [{ title: "Laravel", description: "Core", topics: ["Routing", "Blade", "Eloquent", "Migrations"] }, { title: "APIs", description: "Backend", topics: ["REST API", "Auth", "Queues", "Testing"] }, { title: "Production", description: "Deploy", topics: ["Forge", "Horizon", "Performance", "SaaS Patterns"] }] },
  { slug: "spring-boot", title: "Spring Boot Developer", description: "Enterprise Java microservices with Spring Boot.", icon: "Coffee", category: "framework", languages: ["Java"], phases: [{ title: "Spring", description: "Core", topics: ["Dependency Injection", "Spring Boot", "JPA", "REST"] }, { title: "Microservices", description: "Scale", topics: ["Spring Cloud", "Security", "Messaging", "Testing"] }, { title: "Deploy", description: "Ops", topics: ["Docker", "Kubernetes", "Observability", "Interview"] }] },
  { slug: "django", title: "Django Developer", description: "Full-stack Python web apps with Django.", icon: "Code2", category: "framework", languages: ["Python"], phases: [{ title: "Django", description: "Core", topics: ["Models", "Views", "Templates", "Admin"] }, { title: "APIs", description: "DRF", topics: ["Django REST", "Auth", "Permissions", "Testing"] }, { title: "Production", description: "Deploy", topics: ["PostgreSQL", "Celery", "Caching", "Security"] }] },
  { slug: "fastapi", title: "FastAPI Developer", description: "Modern Python APIs with FastAPI and async.", icon: "Zap", category: "framework", languages: ["Python"], phases: [{ title: "FastAPI", description: "Core", topics: ["Routes", "Pydantic", "Dependency Injection", "OpenAPI"] }, { title: "Data", description: "Persistence", topics: ["SQLAlchemy", "Alembic", "Redis", "Background Tasks"] }, { title: "Production", description: "Ship", topics: ["Docker", "Auth", "Testing", "Performance"] }] },
  { slug: "react", title: "React Developer", description: "Component-based UI development with React.", icon: "Atom", category: "framework", languages: ["JavaScript", "TypeScript"], popularity: 94, phases: [{ title: "React Core", description: "Fundamentals", topics: ["JSX", "Components", "Hooks", "State"] }, { title: "Ecosystem", description: "Tools", topics: ["React Router", "TanStack Query", "Forms", "Testing"] }, { title: "Advanced", description: "Patterns", topics: ["Performance", "Patterns", "TypeScript", "Interview"] }] },
  { slug: "nextjs", title: "Next.js Developer", description: "Full-stack React with Next.js App Router.", icon: "Triangle", category: "framework", languages: ["TypeScript"], popularity: 93, phases: [{ title: "App Router", description: "Core", topics: ["Routing", "Server Components", "Data Fetching", "Layouts"] }, { title: "Full Stack", description: "Features", topics: ["API Routes", "Auth", "Middleware", "Caching"] }, { title: "Production", description: "Deploy", topics: ["Vercel", "SEO", "Performance", "Monitoring"] }] },
  { slug: "angular", title: "Angular Developer", description: "Enterprise frontends with Angular and TypeScript.", icon: "Triangle", category: "framework", languages: ["TypeScript"], phases: [{ title: "Angular", description: "Core", topics: ["Components", "Services", "RxJS", "Routing"] }, { title: "State", description: "Patterns", topics: ["NgRx", "Forms", "HTTP", "Testing"] }, { title: "Enterprise", description: "Scale", topics: ["Modules", "Lazy Loading", "i18n", "Interview"] }] },
  { slug: "vue", title: "Vue.js Developer", description: "Progressive JavaScript framework for modern UIs.", icon: "Triangle", category: "framework", languages: ["JavaScript"], phases: [{ title: "Vue Core", description: "Basics", topics: ["Reactivity", "Components", "Composition API", "Vue Router"] }, { title: "Ecosystem", description: "Tools", topics: ["Pinia", "Nuxt", "Testing", "TypeScript"] }, { title: "Projects", description: "Build", topics: ["SPA", "SSR", "Performance", "Interview"] }] },
  { slug: "svelte", title: "Svelte Developer", description: "Compile-time framework for fast web apps.", icon: "Triangle", category: "framework", languages: ["JavaScript"], phases: [{ title: "Svelte", description: "Core", topics: ["Reactivity", "Stores", "Transitions", "Actions"] }, { title: "SvelteKit", description: "Full stack", topics: ["Routing", "SSR", "Adapters", "Forms"] }, { title: "Ship", description: "Deploy", topics: ["Performance", "Testing", "Animations", "Portfolio"] }] },
  { slug: "unity", title: "Unity Developer", description: "Game development with Unity engine and C#.", icon: "Gamepad2", category: "other", languages: ["C#"], phases: [{ title: "Unity", description: "Basics", topics: ["Editor", "GameObjects", "Physics", "Scripting"] }, { title: "Gameplay", description: "Systems", topics: ["AI", "UI", "Audio", "Animation"] }, { title: "Publish", description: "Ship", topics: ["Build", "Mobile", "Optimization", "Portfolio"] }] },
  { slug: "unreal-engine", title: "Unreal Engine Developer", description: "AAA game development with Unreal Engine.", icon: "Gamepad2", category: "other", languages: ["C++"], phases: [{ title: "Unreal", description: "Editor", topics: ["Blueprints", "Level Design", "Materials", "Lighting"] }, { title: "C++", description: "Gameplay", topics: ["C++ API", "Actors", "Multiplayer", "AI"] }, { title: "Ship", description: "Release", topics: ["Packaging", "Optimization", "Marketplace", "Portfolio"] }] },
  { slug: "solidity", title: "Solidity Developer", description: "Smart contract development on Ethereum.", icon: "Link", category: "other", languages: ["Solidity"], phases: [{ title: "Solidity", description: "Language", topics: ["Syntax", "Mappings", "Events", "Modifiers"] }, { title: "Contracts", description: "Build", topics: ["ERC-20", "ERC-721", "DeFi Patterns", "Testing"] }, { title: "Security", description: "Audit", topics: ["Reentrancy", "Oracle Risks", "Audits", "Mainnet Deploy"] }] },
  { slug: "software-architecture", title: "Software Architect", description: "System design, architecture patterns, and technical leadership.", icon: "Building2", category: "role", phases: [{ title: "Patterns", description: "Design", topics: ["SOLID", "Design Patterns", "DDD", "Clean Architecture"] }, { title: "Distributed", description: "Scale", topics: ["Microservices", "Event-Driven", "CAP", "Caching"] }, { title: "Leadership", description: "Architect", topics: ["ADRs", "Trade-offs", "Stakeholders", "Interview"] }] },
];

export const ROADMAP_DEFINITIONS: RoadmapDefinition[] = SEEDS.map(seedToDefinition);

export const ROADMAP_SLUGS = ROADMAP_DEFINITIONS.map((r) => r.slug);

export function getRoadmapDefinition(slug: string) {
  return ROADMAP_DEFINITIONS.find((r) => r.slug === slug);
}

export function getRoadmapCatalog() {
  return ROADMAP_DEFINITIONS.map(({ nodeDefs: _n, edges: _e, phases: _p, ...meta }) => meta);
}

export const ROADMAP_CATEGORIES: { id: RoadmapCategory; label: string }[] = [
  { id: "role", label: "Career Roles" },
  { id: "language", label: "Languages" },
  { id: "framework", label: "Frameworks" },
  { id: "cloud", label: "Cloud" },
  { id: "devops", label: "DevOps & Platform" },
  { id: "security", label: "Security" },
  { id: "data", label: "Data" },
  { id: "ai", label: "AI & ML" },
  { id: "mobile", label: "Mobile" },
  { id: "design", label: "Design" },
  { id: "other", label: "Specialized" },
];
