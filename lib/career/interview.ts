function subject(
  slug: string,
  title: string,
  description: string,
  theory: string[],
  interviewQuestions: string[],
  companyQuestions: string[] = []
) {
  return {
    slug,
    title,
    category: "technical" as const,
    description,
    theory,
    mcqs: [
      { q: `What is a core concept in ${title}?`, options: ["Theory A", "Theory B", "Correct concept", "Theory D"], answer: 2 },
      { q: `Best practice for ${title} interviews?`, options: ["Memorize only", "Practice problems", "Skip basics", "Avoid projects"], answer: 1 },
      { q: `Time complexity matters most in?`, options: ["UI design", "Algorithm choice", "Color theory", "Typography"], answer: 1 },
    ],
    flashcards: theory.slice(0, 4).map((t, i) => ({
      front: `${title} — Key Point ${i + 1}`,
      back: t,
    })),
    interviewQuestions,
    companyQuestions: companyQuestions.length ? companyQuestions : [`${title} question asked at FAANG companies`, `System design involving ${title}`],
    cheatSheet: theory,
  };
}

const TECHNICAL_SLUGS: [string, string, string, string[], string[]][] = [
  ["data-structures", "Data Structures", "Arrays, trees, graphs, hash maps, and complexity.", ["Big-O analysis", "Array vs Linked List tradeoffs", "Tree traversals: in/pre/post-order", "Graph BFS/DFS", "Hash table collision handling"], ["Reverse a linked list", "Find middle of linked list", "Detect cycle in graph", "Implement LRU cache"]],
  ["algorithms", "Algorithms", "Sorting, searching, DP, greedy, and patterns.", ["Master theorem basics", "Two-pointer technique", "Sliding window", "Dynamic programming memoization", "Greedy vs DP choice"], ["Merge intervals", "Longest increasing subsequence", "Coin change problem", "Binary search variants"]],
  ["operating-systems", "Operating Systems", "Processes, threads, memory, and scheduling.", ["Process vs Thread", "CPU scheduling algorithms", "Deadlock conditions", "Virtual memory & paging", "Synchronization primitives"], ["What is a deadlock?", "Explain paging vs segmentation", "Difference between mutex and semaphore"]],
  ["dbms", "DBMS", "SQL, normalization, indexing, and transactions.", ["ACID properties", "Normal forms (1NF–3NF)", "B-tree indexing", "Query optimization", "Isolation levels"], ["Design a schema for e-commerce", "Explain JOIN types", "What is database sharding?"]],
  ["computer-networks", "Computer Networks", "OSI, TCP/IP, routing, and protocols.", ["OSI 7 layers", "TCP vs UDP", "HTTP/HTTPS", "DNS resolution", "Subnetting basics"], ["Explain 3-way handshake", "What happens when you type a URL?", "Difference between HTTP/1.1 and HTTP/2"]],
  ["oop", "OOP", "Encapsulation, inheritance, polymorphism, abstraction.", ["Four pillars of OOP", "Composition over inheritance", "SOLID principles", "Design patterns overview", "Interface vs abstract class"], ["Explain polymorphism with example", "What is dependency injection?"]],
  ["software-engineering", "Software Engineering", "SDLC, Agile, testing, and design.", ["Agile vs Waterfall", "Unit vs integration testing", "CI/CD pipeline", "Code review best practices", "Technical debt management"], ["How do you handle production bugs?", "Explain your development workflow"]],
  ["system-design", "System Design", "Scalability, load balancing, and architecture.", ["Horizontal vs vertical scaling", "Load balancers", "Caching strategies", "CAP theorem", "Microservices vs monolith"], ["Design URL shortener", "Design Twitter feed", "Design rate limiter"]],
  ["web-development", "Web Development", "HTML, CSS, JS, and full-stack fundamentals.", ["Semantic HTML", "CSS Flexbox/Grid", "REST API design", "CORS", "Web performance"], ["How does browser rendering work?", "Explain same-origin policy"]],
  ["backend", "Backend Development", "APIs, databases, auth, and server architecture.", ["REST vs GraphQL", "JWT authentication", "Database connection pooling", "Message queues", "API versioning"], ["Design RESTful API for users", "How to handle rate limiting?"]],
  ["frontend", "Frontend Development", "UI architecture, state, and performance.", ["Component architecture", "State management", "Core Web Vitals", "Accessibility (a11y)", "Responsive design"], ["Virtual DOM explanation", "How to optimize React renders?"]],
  ["react", "React", "Hooks, state, lifecycle, and patterns.", ["useState vs useReducer", "useEffect cleanup", "React.memo", "Context API", "Custom hooks"], ["Keys in lists — why?", "Explain reconciliation"]],
  ["nextjs", "Next.js", "App Router, SSR, SSG, and API routes.", ["SSR vs SSG vs ISR", "App Router layouts", "Server Components", "Middleware", "Image optimization"], ["When to use Server Components?", "Explain Next.js caching"]],
  ["nodejs", "Node.js", "Event loop, async, Express, and performance.", ["Event loop phases", "Callbacks vs Promises", "Streams", "Cluster module", "Error handling middleware"], ["Explain event loop", "How to handle uncaught exceptions?"]],
  ["typescript", "TypeScript", "Types, generics, and advanced patterns.", ["Union vs intersection types", "Generics", "Type guards", "Utility types", "strict mode benefits"], ["any vs unknown", "Implement Pick and Omit"]],
  ["java", "Java", "OOP, collections, JVM, and Spring basics.", ["JVM vs JRE vs JDK", "ArrayList vs LinkedList", "Garbage collection", "Spring Boot basics", "Multithreading"], ["HashMap internal working", "Difference between == and equals"]],
  ["python", "Python", "Data structures, OOP, and common libraries.", ["List comprehensions", "GIL concept", "Decorators", "Virtual environments", "pandas basics"], ["Mutable vs immutable types", "Explain decorators"]],
  ["cpp", "C++", "Pointers, memory, STL, and OOP.", ["Pointers vs references", "RAII", "STL containers", "Smart pointers", "Move semantics"], ["Virtual functions", "Difference between stack and heap"]],
  ["sql", "SQL", "Queries, joins, optimization, and design.", ["SELECT, JOIN, GROUP BY", "Indexes", "Window functions", "Subqueries vs CTEs", "Execution plans"], ["Find second highest salary", "Optimize slow query"]],
  ["devops", "DevOps", "CI/CD, automation, and infrastructure.", ["CI/CD pipeline stages", "Infrastructure as Code", "Monitoring & alerting", "Blue-green deployment", "GitOps"], ["Explain CI/CD workflow", "Docker vs VM"]],
  ["cloud", "Cloud Computing", "AWS, Azure, GCP, and cloud patterns.", ["IaaS vs PaaS vs SaaS", "EC2, S3, Lambda overview", "Auto-scaling", "Cloud security", "Multi-region architecture"], ["Design highly available system on AWS"]],
  ["docker", "Docker", "Containers, images, Dockerfile, and compose.", ["Image vs container", "Dockerfile best practices", "Docker Compose", "Volume mounts", "Multi-stage builds"], ["What is a container?", "How to reduce image size?"]],
  ["kubernetes", "Kubernetes", "Pods, services, deployments, and scaling.", ["Pod lifecycle", "Deployments vs StatefulSets", "Services (ClusterIP, LoadBalancer)", "ConfigMaps & Secrets", "Horizontal Pod Autoscaler"], ["What is a pod?", "Rolling update vs recreate"]],
];

export const TECHNICAL_SUBJECTS = TECHNICAL_SLUGS.map(([slug, title, desc, theory, questions]) =>
  subject(slug, title, desc, theory, questions)
);

export const BEHAVIORAL_TOPICS = [
  { slug: "tell-me-about-yourself", title: "Tell Me About Yourself", tip: "Use Present-Past-Future structure. Keep it under 2 minutes.", star: "Present: current role/skills → Past: relevant experience → Future: why this role" },
  { slug: "leadership", title: "Leadership", tip: "Use STAR: Situation, Task, Action, Result.", star: "Describe a time you led a team through a challenge and delivered results." },
  { slug: "teamwork", title: "Teamwork", tip: "Highlight collaboration and conflict resolution.", star: "Share how you collaborated cross-functionally to ship a project." },
  { slug: "conflict-resolution", title: "Conflict Resolution", tip: "Stay professional; focus on resolution not blame.", star: "Describe disagreeing with a teammate and how you resolved it." },
  { slug: "failure", title: "Failure", tip: "Show growth mindset and lessons learned.", star: "Share a failure, what you learned, and how you improved." },
  { slug: "strengths", title: "Strengths", tip: "Pick strengths relevant to the job with examples.", star: "Problem-solving with a concrete example from a project." },
  { slug: "weaknesses", title: "Weaknesses", tip: "Choose real weakness + improvement steps.", star: "Public speaking — joined toastmasters, now present weekly." },
  { slug: "time-management", title: "Time Management", tip: "Mention prioritization frameworks.", star: "Used Eisenhower matrix during finals + internship." },
  { slug: "communication", title: "Communication", tip: "Written and verbal examples.", star: "Documented API for team reducing onboarding time 50%." },
  { slug: "problem-solving", title: "Problem Solving", tip: "Walk through your analytical process.", star: "Debugged production issue using logs and reproduced locally." },
];

export const HR_QUESTIONS = [
  { q: "Why do you want to work here?", a: "Research the company mission, products, and culture. Connect your goals to their values.", mistake: "Generic answers without company research." },
  { q: "What are your salary expectations?", a: "Give a researched range based on role, location, and experience level.", mistake: "Giving a number without research or being inflexible." },
  { q: "Where do you see yourself in 5 years?", a: "Align growth with the company's career paths — technical depth or leadership.", mistake: "Saying you plan to leave or start a competing business." },
  { q: "Why should we hire you?", a: "Summarize unique skills, projects, and cultural fit in 3 bullet points.", mistake: "Repeating resume without differentiation." },
  { q: "Do you have any questions for us?", a: "Ask about team structure, onboarding, growth, and tech stack.", mistake: "Saying 'No questions' — always prepare 3 questions." },
  { q: "Are you open to relocation / remote work?", a: "Be honest about preferences while showing flexibility.", mistake: "Being unclear or contradictory about availability." },
];

export const MOCK_QUESTIONS = {
  hr: HR_QUESTIONS.map((h) => h.q),
  technical: TECHNICAL_SUBJECTS.flatMap((s) => s.interviewQuestions).slice(0, 30),
  behavioral: BEHAVIORAL_TOPICS.map((b) => `Tell me about a time when you demonstrated ${b.title.toLowerCase()}.`),
  mixed: [] as string[],
};

MOCK_QUESTIONS.mixed = [...MOCK_QUESTIONS.hr.slice(0, 3), ...MOCK_QUESTIONS.technical.slice(0, 4), ...MOCK_QUESTIONS.behavioral.slice(0, 3)];

export function getInterviewSubject(slug: string) {
  return TECHNICAL_SUBJECTS.find((s) => s.slug === slug);
}

export const INTERVIEW_SUBJECT_SLUGS = TECHNICAL_SUBJECTS.map((s) => s.slug);
