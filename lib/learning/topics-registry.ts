import type { RegistrySubject, RegistryTopic, TopicSubtopic } from "./types";
import type { Difficulty } from "@/lib/tools/tokens";

function topic(
  slug: string,
  title: string,
  description: string,
  icon: string,
  difficulty: Difficulty,
  duration: string,
  order: number,
  subtopics: TopicSubtopic[],
  opts: Partial<RegistryTopic> = {}
): RegistryTopic {
  return {
    slug,
    title,
    description,
    icon,
    difficulty,
    duration,
    order,
    subtopics,
    learningObjectives: opts.learningObjectives ?? [`Understand ${title}`, `Apply ${title} concepts`, `Solve exam-style problems on ${title}`],
    prerequisites: opts.prerequisites,
    status: opts.status ?? "live",
    href: opts.href,
    hasQuiz: opts.hasQuiz ?? true,
    hasSimulator: opts.hasSimulator ?? false,
    hasInterview: opts.hasInterview ?? true,
    hasCheatSheet: opts.hasCheatSheet ?? true,
  };
}

function subs(...items: [string, string, string, Difficulty][]): TopicSubtopic[] {
  return items.map(([slug, title, duration, difficulty]) => ({ slug, title, duration, difficulty }));
}

export const OS_REGISTRY: RegistrySubject = {
  slug: "os",
  title: "Operating Systems",
  description: "Processes, threads, scheduling, memory, file systems, and synchronization.",
  estimatedHours: 48,
  difficulty: "Intermediate",
  learningPath: ["Introduction", "Processes & Threads", "CPU Scheduling", "Synchronization", "Memory Management", "File Systems", "I/O & Security", "Final Assessment"],
  missingModules: [],
  categories: [
    {
      title: "Foundations",
      topics: [
        topic("introduction", "Introduction to OS", "OS roles, kernel, user/kernel mode, system calls.", "📖", "Beginner", "30 min", 1,
          subs(["os-role", "Kernel Basics", "20 min", "Beginner"], ["system-calls", "System Calls", "15 min", "Beginner"]),
          { status: "planned" }),
      ],
    },
    {
      title: "Process Management",
      topics: [
        topic("process-management", "Processes", "Process states, PCB, context switching, process creation.", "⚙️", "Intermediate", "45 min", 2,
          subs(["process-states", "Process States", "15 min", "Beginner"], ["pcb", "Process Control Block", "15 min", "Intermediate"], ["context-switch", "Context Switching", "15 min", "Intermediate"]),
          { hasSimulator: true, href: "/tools/os/process-management" }),
        topic("threads", "Threads", "User vs kernel threads, multithreading models, thread libraries.", "🧵", "Intermediate", "40 min", 3,
          subs(["thread-models", "Threading Models", "15 min", "Intermediate"], ["thread-creation", "Thread Creation", "15 min", "Intermediate"], ["thread-vs-process", "Threads vs Processes", "10 min", "Beginner"]),
          { status: "planned" }),
        topic("cpu-scheduling", "CPU Scheduling", "FCFS, SJF, Round Robin, priority scheduling, multilevel queues.", "🎯", "Intermediate", "50 min", 4,
          subs(["fcfs", "FCFS", "10 min", "Beginner"], ["sjf", "SJF / SRTF", "15 min", "Intermediate"], ["round-robin", "Round Robin", "15 min", "Intermediate"], ["priority", "Priority Scheduling", "10 min", "Advanced"]),
          { hasSimulator: true, href: "/tools/os/cpu-scheduling" }),
        topic("process-scheduling", "Process Scheduling", "Scheduling criteria, dispatcher, scheduling algorithms comparison.", "⏱️", "Beginner", "35 min", 5,
          subs(["criteria", "Scheduling Criteria", "10 min", "Beginner"], ["dispatcher", "Dispatcher", "10 min", "Beginner"], ["comparison", "Algorithm Comparison", "15 min", "Intermediate"]),
          { href: "/tools/os/process-scheduling" }),
      ],
    },
    {
      title: "Synchronization",
      topics: [
        topic("synchronization", "Synchronization", "Critical section, race conditions, Peterson's solution, hardware support.", "🔒", "Intermediate", "45 min", 6,
          subs(["critical-section", "Critical Section", "15 min", "Intermediate"], ["race-conditions", "Race Conditions", "15 min", "Intermediate"], ["peterson", "Peterson's Solution", "15 min", "Advanced"]),
          { status: "planned" }),
        topic("semaphores", "Semaphores", "Counting/binary semaphores, wait/signal operations, producer-consumer.", "🔢", "Intermediate", "40 min", 7,
          subs(["binary-semaphore", "Binary Semaphore", "15 min", "Intermediate"], ["counting-semaphore", "Counting Semaphore", "15 min", "Intermediate"], ["producer-consumer", "Producer-Consumer", "10 min", "Advanced"]),
          { status: "planned" }),
        topic("mutex", "Mutex & Locks", "Mutex locks, spinlocks, lock-free concepts, deadlock prevention basics.", "🔐", "Intermediate", "35 min", 8,
          subs(["mutex-locks", "Mutex Locks", "15 min", "Intermediate"], ["spinlocks", "Spinlocks", "10 min", "Advanced"], ["deadlock-prevention", "Deadlock Prevention", "10 min", "Advanced"]),
          { status: "planned" }),
        topic("deadlock", "Deadlocks", "Four conditions, resource allocation graph, detection, avoidance, bankers algorithm.", "🚫", "Advanced", "55 min", 9,
          subs(["four-conditions", "Four Conditions", "15 min", "Intermediate"], ["detection", "Detection & Recovery", "15 min", "Advanced"], ["avoidance", "Avoidance", "15 min", "Advanced"], ["bankers", "Banker's Algorithm", "10 min", "Advanced"]),
          { hasSimulator: true, href: "/tools/os/deadlock" }),
        topic("bankers-algorithm", "Banker's Algorithm", "Safe state, resource allocation, need matrix, safety algorithm.", "🏦", "Advanced", "60 min", 10,
          subs(["safe-state", "Safe State", "20 min", "Advanced"], ["safety-algorithm", "Safety Algorithm", "20 min", "Advanced"], ["request-algorithm", "Request Algorithm", "20 min", "Advanced"]),
          { hasSimulator: true, href: "/tools/os/bankers-algorithm" }),
      ],
    },
    {
      title: "Memory Management",
      topics: [
        topic("memory-management", "Memory Management", "Contiguous allocation, fragmentation, paging basics, address translation.", "📦", "Intermediate", "48 min", 11,
          subs(["contiguous", "Contiguous Allocation", "15 min", "Beginner"], ["fragmentation", "Fragmentation", "15 min", "Intermediate"], ["address-translation", "Address Translation", "18 min", "Intermediate"]),
          { hasSimulator: true, href: "/tools/os/memory-management" }),
        topic("paging", "Paging", "Page tables, TLB, multi-level paging, inverted page tables.", "📄", "Intermediate", "45 min", 12,
          subs(["page-tables", "Page Tables", "15 min", "Intermediate"], ["tlb", "TLB", "15 min", "Intermediate"], ["multi-level", "Multi-level Paging", "15 min", "Advanced"]),
          { status: "planned" }),
        topic("segmentation", "Segmentation", "Segment tables, combined segmentation-paging, protection.", "📐", "Intermediate", "40 min", 13,
          subs(["segment-tables", "Segment Tables", "15 min", "Intermediate"], ["seg-paging", "Segmentation + Paging", "15 min", "Advanced"], ["protection", "Memory Protection", "10 min", "Intermediate"]),
          { status: "planned" }),
        topic("virtual-memory", "Virtual Memory", "Demand paging, page faults, working set, thrashing.", "💾", "Advanced", "50 min", 14,
          subs(["demand-paging", "Demand Paging", "15 min", "Intermediate"], ["page-faults", "Page Faults", "15 min", "Intermediate"], ["thrashing", "Thrashing", "20 min", "Advanced"]),
          { status: "planned" }),
      ],
    },
    {
      title: "Storage & I/O",
      topics: [
        topic("file-systems", "File Systems", "File structure, directories, allocation methods, free space management.", "📁", "Intermediate", "45 min", 15,
          subs(["file-structure", "File Structure", "15 min", "Beginner"], ["allocation", "Allocation Methods", "15 min", "Intermediate"], ["free-space", "Free Space Management", "15 min", "Intermediate"]),
          { status: "planned" }),
        topic("disk-scheduling", "Disk Scheduling", "FCFS, SSTF, SCAN, C-SCAN, LOOK algorithms.", "💿", "Intermediate", "42 min", 16,
          subs(["fcfs-disk", "FCFS", "10 min", "Beginner"], ["sstf", "SSTF", "10 min", "Intermediate"], ["scan", "SCAN / C-SCAN", "12 min", "Intermediate"], ["look", "LOOK / C-LOOK", "10 min", "Intermediate"]),
          { hasSimulator: true, href: "/tools/os/disk-scheduling" }),
        topic("io-systems", "I/O Systems", "I/O hardware, buffering, spooling, device drivers.", "🔌", "Intermediate", "40 min", 17,
          subs(["io-hardware", "I/O Hardware", "15 min", "Intermediate"], ["buffering", "Buffering & Caching", "15 min", "Intermediate"], ["spooling", "Spooling", "10 min", "Beginner"]),
          { status: "planned" }),
      ],
    },
    {
      title: "Security & Assessment",
      topics: [
        topic("os-security", "OS Security", "Access control, authentication, protection rings, security policies.", "🛡️", "Intermediate", "40 min", 18,
          subs(["access-control", "Access Control", "15 min", "Intermediate"], ["authentication", "Authentication", "15 min", "Intermediate"], ["protection-rings", "Protection Rings", "10 min", "Advanced"]),
          { status: "planned" }),
        topic("case-studies", "Case Studies", "Linux, Windows, and real-world OS design decisions.", "📚", "Advanced", "50 min", 19,
          subs(["linux", "Linux Kernel", "20 min", "Advanced"], ["windows", "Windows OS", "15 min", "Advanced"], ["comparisons", "OS Comparisons", "15 min", "Intermediate"]),
          { status: "planned" }),
        topic("final-assessment", "Final Assessment", "Comprehensive OS exam covering all topics.", "🎓", "Advanced", "90 min", 20,
          subs(["theory-exam", "Theory Exam", "45 min", "Advanced"], ["practical-exam", "Practical Exam", "45 min", "Advanced"]),
          { status: "planned", hasSimulator: false }),
      ],
    },
  ],
};

// Compact registries for other subjects — expandable
function compactSubject(
  slug: string,
  title: string,
  description: string,
  hours: number,
  difficulty: Difficulty,
  categories: { title: string; topics: [string, string, string, Difficulty, string, number, string?][] }[]
): RegistrySubject {
  return {
    slug,
    title,
    description,
    estimatedHours: hours,
    difficulty,
    learningPath: categories.flatMap((c) => c.topics.map((t) => t[1])),
    missingModules: [],
    categories: categories.map((cat) => ({
      title: cat.title,
      topics: cat.topics.map(([tslug, ttitle, tdesc, tdiff, dur, ord, href]) => {
        return topic(tslug, ttitle, tdesc, "📖", tdiff, dur, ord,
          subs([`${tslug}-intro`, "Introduction", "15 min", "Beginner"], [`${tslug}-practice`, "Practice", "20 min", tdiff], [`${tslug}-quiz`, "Quiz", "15 min", tdiff]),
          { href: href ?? `/tools/${slug}/${tslug}`, status: href ? "live" : "planned" });
      }),
    })),
  };
}

export const DSA_REGISTRY = compactSubject("dsa", "Data Structures", "Arrays, linked lists, trees, graphs, stacks, queues.", 32, "Intermediate", [
  { title: "Linear Structures", topics: [
    ["arrays", "Arrays", "Array operations and complexity.", "Beginner", "40 min", 1, "/tools/dsa/arrays"],
    ["linked-list", "Linked Lists", "Singly, doubly, circular lists.", "Intermediate", "45 min", 2, "/tools/dsa/linked-list"],
    ["stack", "Stacks", "LIFO operations and applications.", "Beginner", "35 min", 3, "/tools/dsa/stack"],
    ["queue", "Queues", "FIFO, deque, priority queue.", "Beginner", "35 min", 4, "/tools/dsa/queue"],
  ]},
  { title: "Non-Linear", topics: [
    ["tree", "Trees", "BST, traversals, AVL intro.", "Intermediate", "50 min", 5, "/tools/dsa/tree"],
    ["graph", "Graphs", "BFS, DFS, representations.", "Advanced", "55 min", 6],
    ["heap", "Heaps", "Min/max heap, heapify.", "Intermediate", "40 min", 7],
    ["hashing", "Hash Tables", "Hash functions, collision resolution.", "Intermediate", "45 min", 8],
  ]},
  { title: "Algorithms on Structures", topics: [
    ["searching", "Searching", "Linear, binary search.", "Beginner", "35 min", 9, "/tools/dsa/searching"],
    ["sorting", "Sorting", "Merge, quick, heap sort.", "Intermediate", "50 min", 10, "/tools/dsa/sorting"],
  ]},
]);

export const DATABASE_REGISTRY = compactSubject("database", "Database Systems", "SQL, normalization, transactions, indexing.", 24, "Intermediate", [
  { title: "Fundamentals", topics: [
    ["basics", "DB Basics", "DBMS concepts and architecture.", "Beginner", "40 min", 1, "/tools/database/basics"],
    ["relational-model", "Relational Model", "Keys, schemas, relationships.", "Beginner", "45 min", 2, "/tools/database/relational-model"],
    ["sql", "SQL", "DDL, DML, queries, joins.", "Intermediate", "60 min", 3, "/tools/database/sql"],
    ["erd", "ERD Design", "Entity-relationship modeling.", "Beginner", "40 min", 4, "/tools/database/erd"],
  ]},
  { title: "Advanced", topics: [
    ["normalization", "Normalization", "1NF through BCNF.", "Intermediate", "50 min", 5, "/tools/database/normalization"],
    ["indexing", "Indexing", "B-trees, hash indexes.", "Intermediate", "45 min", 6, "/tools/database/indexing"],
    ["transactions", "Transactions", "ACID, isolation levels.", "Advanced", "50 min", 7, "/tools/database/transactions"],
    ["query-optimization", "Query Optimization", "Execution plans, optimization.", "Advanced", "55 min", 8, "/tools/database/query-optimization"],
  ]},
]);

export const NETWORK_REGISTRY = compactSubject("network", "Computer Networks", "OSI, TCP/IP, routing, DNS, subnetting.", 22, "Intermediate", [
  { title: "Fundamentals", topics: [
    ["basics", "Network Basics", "Types, topologies, models.", "Beginner", "35 min", 1, "/tools/network/basics"],
    ["osi-model", "OSI Model", "Seven layers explained.", "Beginner", "40 min", 2, "/tools/network/osi-model"],
    ["tcp-ip", "TCP/IP", "Internet protocol suite.", "Intermediate", "45 min", 3, "/tools/network/tcp-ip"],
  ]},
  { title: "Protocols", topics: [
    ["tcp-udp", "TCP vs UDP", "Transport layer protocols.", "Intermediate", "40 min", 4, "/tools/network/tcp-udp"],
    ["ip-addressing", "IP Addressing", "IPv4, CIDR, subnetting.", "Intermediate", "50 min", 5, "/tools/network/ip-addressing"],
    ["subnetting", "Subnetting", "Subnet masks and VLSM.", "Intermediate", "45 min", 6, "/tools/network/subnetting"],
    ["dns", "DNS", "Domain name resolution.", "Beginner", "35 min", 7, "/tools/network/dns"],
    ["http", "HTTP/HTTPS", "Web protocols and security.", "Intermediate", "40 min", 8, "/tools/network/http"],
  ]},
]);

export const ALL_SUBJECT_REGISTRIES: RegistrySubject[] = [
  OS_REGISTRY,
  DSA_REGISTRY,
  DATABASE_REGISTRY,
  NETWORK_REGISTRY,
];

export function getSubjectRegistry(slug: string) {
  return ALL_SUBJECT_REGISTRIES.find((s) => s.slug === slug);
}

export function getRegistryTopic(subjectSlug: string, topicSlug: string) {
  const subject = getSubjectRegistry(subjectSlug);
  if (!subject) return undefined;
  for (const cat of subject.categories) {
    const t = cat.topics.find((x) => x.slug === topicSlug);
    if (t) return t;
  }
  return undefined;
}

export function getAllRegistryTopics(subjectSlug: string) {
  const subject = getSubjectRegistry(subjectSlug);
  if (!subject) return [];
  return subject.categories.flatMap((c) => c.topics).sort((a, b) => a.order - b.order);
}

export function getTopicHref(subjectSlug: string, topic: RegistryTopic) {
  return topic.href ?? `/tools/${subjectSlug}/${topic.slug}`;
}

export function getAdjacentTopics(subjectSlug: string, topicSlug: string) {
  const topics = getAllRegistryTopics(subjectSlug);
  const idx = topics.findIndex((t) => t.slug === topicSlug);
  return {
    prev: idx > 0 ? topics[idx - 1] : null,
    next: idx < topics.length - 1 ? topics[idx + 1] : null,
  };
}

/** Topics added in this audit vs legacy inline lists */
export const AUDIT_ADDED_TOPICS: Record<string, string[]> = {
  os: ["introduction", "threads", "synchronization", "semaphores", "mutex", "paging", "segmentation", "virtual-memory", "file-systems", "io-systems", "os-security", "case-studies", "final-assessment"],
  dsa: ["graph", "heap", "hashing"],
  database: [],
  network: [],
};

export const AUDIT_ADDED_SUBTOPICS: Record<string, number> = {
  os: OS_REGISTRY.categories.reduce((a, c) => a + c.topics.reduce((b, t) => b + t.subtopics.length, 0), 0),
};
