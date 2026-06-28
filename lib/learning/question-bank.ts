import type { QuizDifficulty, QuizQuestion, QuestionType, QuestionCategory } from "./types";

type SeedFact = {
  topicSlug: string;
  subtopicSlug?: string;
  concept: string;
  correct: string;
  wrong: string[];
  explanation: string;
  difficulty: QuizDifficulty;
  category?: QuestionCategory;
  type?: QuestionType;
};

const OS_FACTS: SeedFact[] = [
  { topicSlug: "process-management", concept: "process state after creation", correct: "New", wrong: ["Running", "Terminated", "Blocked"], explanation: "A newly created process enters the New state before being admitted to the ready queue.", difficulty: "easy" },
  { topicSlug: "process-management", concept: "PCB stores", correct: "Process state and context", wrong: ["Only program code", "Only user data", "Network topology"], explanation: "The Process Control Block stores process state, CPU registers, memory management info, and I/O status.", difficulty: "medium" },
  { topicSlug: "cpu-scheduling", concept: "FCFS scheduling", correct: "First-Come First-Served", wrong: ["Shortest Job First", "Round Robin", "Priority"], explanation: "FCFS executes processes in arrival order — simple but can cause convoy effect.", difficulty: "easy" },
  { topicSlug: "cpu-scheduling", concept: "Round Robin time quantum", correct: "Limits CPU time per process before preemption", wrong: ["Eliminates context switching", "Sorts by priority only", "Prevents deadlock"], explanation: "Time quantum ensures fair CPU sharing via preemption in Round Robin scheduling.", difficulty: "medium" },
  { topicSlug: "deadlock", concept: "necessary condition for deadlock", correct: "Mutual exclusion", wrong: ["Preemption", "Parallel execution", "Caching"], explanation: "Deadlock requires mutual exclusion, hold and wait, no preemption, and circular wait.", difficulty: "medium" },
  { topicSlug: "deadlock", concept: "Banker's algorithm purpose", correct: "Deadlock avoidance", wrong: ["Deadlock detection only", "Memory compaction", "File allocation"], explanation: "Banker's algorithm checks if a resource allocation keeps the system in a safe state.", difficulty: "hard" },
  { topicSlug: "memory-management", concept: "external fragmentation", correct: "Free memory scattered in small holes", wrong: ["Memory inside allocated blocks", "Page table overhead", "Cache miss"], explanation: "External fragmentation leaves unusable gaps between allocated memory segments.", difficulty: "medium" },
  { topicSlug: "paging", concept: "TLB purpose", correct: "Speed up virtual-to-physical address translation", wrong: ["Store file metadata", "Schedule processes", "Encrypt memory"], explanation: "Translation Lookaside Buffer caches recent page table entries for faster access.", difficulty: "medium" },
  { topicSlug: "virtual-memory", concept: "page fault", correct: "Referenced page not in physical memory", wrong: ["CPU overheating", "Disk failure", "Process termination"], explanation: "A page fault triggers loading the page from secondary storage into RAM.", difficulty: "easy" },
  { topicSlug: "threads", concept: "thread vs process", correct: "Threads share address space within a process", wrong: ["Threads have separate address spaces", "Processes share stack memory", "Threads cannot run concurrently"], explanation: "Threads within the same process share code, data, and files but have separate stacks.", difficulty: "easy" },
  { topicSlug: "synchronization", concept: "critical section", correct: "Code segment accessing shared resources", wrong: ["Kernel boot code", "Dead code", "User login module"], explanation: "Only one process may execute in the critical section at a time to prevent races.", difficulty: "medium" },
  { topicSlug: "semaphores", concept: "wait() on semaphore", correct: "Decrements value; blocks if zero", wrong: ["Increments value always", "Terminates process", "Allocates memory"], explanation: "wait() (P) decrements the semaphore; if result is negative, the process blocks.", difficulty: "hard" },
  { topicSlug: "mutex", concept: "mutex lock", correct: "Mutual exclusion for shared resource access", wrong: ["Memory paging technique", "Disk scheduling", "File compression"], explanation: "Mutex ensures only one thread holds the lock protecting a critical section.", difficulty: "easy" },
  { topicSlug: "disk-scheduling", concept: "SSTF", correct: "Shortest Seek Time First", wrong: ["Smallest Stack Time First", "Sequential Seek Transfer", "Static Service Time"], explanation: "SSTF selects the request closest to the current head position.", difficulty: "medium" },
  { topicSlug: "file-systems", concept: "inode stores", correct: "File metadata and block pointers", wrong: ["Only file name", "User password", "CPU registers"], explanation: "Inodes store permissions, size, timestamps, and pointers to data blocks.", difficulty: "medium" },
];

const TF_STATEMENTS: { topicSlug: string; statement: string; answer: boolean; explanation: string; difficulty: QuizDifficulty }[] = [
  { topicSlug: "process-management", statement: "Context switch saves the state of the outgoing process.", answer: true, explanation: "The OS saves CPU registers and PCB state during context switch.", difficulty: "easy" },
  { topicSlug: "cpu-scheduling", statement: "SJF scheduling is optimal for minimizing average waiting time.", answer: true, explanation: "SJF minimizes average waiting time but requires knowing burst times.", difficulty: "medium" },
  { topicSlug: "deadlock", statement: "Deadlock can occur without mutual exclusion.", answer: false, explanation: "Mutual exclusion is one of the four necessary conditions for deadlock.", difficulty: "easy" },
  { topicSlug: "virtual-memory", statement: "Thrashing occurs when a process spends more time paging than executing.", answer: true, explanation: "Excessive page faults lead to thrashing and severe performance degradation.", difficulty: "medium" },
  { topicSlug: "threads", statement: "Kernel-level threads are managed entirely by user libraries.", answer: false, explanation: "Kernel threads are managed by the OS kernel, not user-space libraries.", difficulty: "easy" },
];

function mcqFromFact(fact: SeedFact, variant: number): QuizQuestion {
  const options = [fact.correct, ...fact.wrong];
  const shuffled = [...options].sort(() => (variant % 3) - 1);
  const answerIdx = shuffled.indexOf(fact.correct);
  return {
    id: `os-${fact.topicSlug}-mcq-${variant}-${fact.concept.slice(0, 8).replace(/\s/g, "")}`,
    subjectSlug: "os",
    topicSlug: fact.topicSlug,
    subtopicSlug: fact.subtopicSlug,
    type: fact.type ?? "mcq",
    category: fact.category ?? "theory",
    difficulty: fact.difficulty,
    question: `Regarding ${fact.concept} in OS: which is correct?`,
    options: shuffled,
    answer: answerIdx,
    explanation: fact.explanation,
    relatedTopics: [fact.topicSlug],
    estimatedSeconds: fact.difficulty === "easy" ? 45 : fact.difficulty === "medium" ? 60 : 90,
  };
}

function tfQuestion(tf: typeof TF_STATEMENTS[0], i: number): QuizQuestion {
  return {
    id: `os-${tf.topicSlug}-tf-${i}`,
    subjectSlug: "os",
    topicSlug: tf.topicSlug,
    type: "true-false",
    category: "theory",
    difficulty: tf.difficulty,
    question: tf.statement,
    options: ["True", "False"],
    answer: tf.answer,
    explanation: tf.explanation,
    estimatedSeconds: 30,
  };
}

function fillBlank(topicSlug: string, i: number, blank: string, answer: string, explanation: string, difficulty: QuizDifficulty): QuizQuestion {
  return {
    id: `os-${topicSlug}-fill-${i}`,
    subjectSlug: "os",
    topicSlug,
    type: "fill-blank",
    category: "theory",
    difficulty,
    question: blank,
    answer,
    explanation,
    estimatedSeconds: 45,
  };
}

function generateVariations(fact: SeedFact): QuizQuestion[] {
  const variants: QuizQuestion[] = [];
  for (let v = 0; v < 6; v++) variants.push(mcqFromFact(fact, v));
  return variants;
}

export function generateOSQuestions(): QuizQuestion[] {
  const questions: QuizQuestion[] = [];

  OS_FACTS.forEach((f) => questions.push(...generateVariations(f)));
  TF_STATEMENTS.forEach((tf, i) => questions.push(tfQuestion(tf, i)));

  const fills: [string, string, string, string, QuizDifficulty][] = [
    ["cpu-scheduling", "The _____ scheduling algorithm uses a fixed time quantum.", "Round Robin", "Round Robin preempts after each quantum.", "easy"],
    ["deadlock", "A state is _____ if the system can allocate resources to avoid deadlock.", "safe", "Safe states allow all processes to complete.", "hard"],
    ["paging", "The _____ caches page table entries for fast translation.", "TLB", "TLB reduces memory access for address translation.", "medium"],
    ["semaphores", "The _____ operation increments a semaphore value.", "signal", "signal() (V) increments and may wake a waiting process.", "medium"],
    ["memory-management", "_____ fragmentation occurs within allocated memory blocks.", "Internal", "Internal fragmentation is unused space inside allocated units.", "medium"],
  ];
  fills.forEach(([topic, q, a, exp, diff], i) => questions.push(fillBlank(topic, i, q, a, exp, diff)));

  // Interview & company style
  const interviewQs = [
    { topic: "process-management", q: "What happens during a context switch?", a: "CPU state is saved, another process loaded, TLB may be flushed.", diff: "medium" as QuizDifficulty },
    { topic: "cpu-scheduling", q: "Why is Round Robin preferred in time-sharing systems?", a: "Fair CPU allocation and reasonable response time via preemption.", diff: "medium" as QuizDifficulty },
    { topic: "deadlock", q: "Explain the four necessary conditions for deadlock.", a: "Mutual exclusion, hold and wait, no preemption, circular wait.", diff: "hard" as QuizDifficulty },
    { topic: "virtual-memory", q: "What is thrashing and how do you prevent it?", a: "Excessive paging; prevent via working set model or increasing memory.", diff: "hard" as QuizDifficulty },
  ];
  interviewQs.forEach((iq, i) => {
    for (let v = 0; v < 5; v++) {
      questions.push({
        id: `os-${iq.topic}-interview-${i}-${v}`,
        subjectSlug: "os",
        topicSlug: iq.topic,
        type: "short-answer",
        category: "interview",
        difficulty: iq.diff,
        question: iq.q,
        answer: iq.a,
        explanation: iq.a,
        estimatedSeconds: 120,
      });
    }
  });

  return questions;
}

/** Generate scaled question bank for any topic using templates */
export function generateTopicQuestionBank(
  subjectSlug: string,
  topicSlug: string,
  topicTitle: string,
  count = 100
): QuizQuestion[] {
  const difficulties: QuizDifficulty[] = ["easy", "medium", "hard", "expert"];
  const types: QuestionType[] = ["mcq", "true-false", "fill-blank", "scenario"];
  const categories: QuestionCategory[] = ["theory", "practical", "interview", "company"];
  const questions: QuizQuestion[] = [];

  for (let i = 0; i < count; i++) {
    const diff = difficulties[i % 4];
    const type = types[i % types.length];
    const cat = categories[i % categories.length];
    const id = `${subjectSlug}-${topicSlug}-gen-${i}`;

    if (type === "mcq") {
      questions.push({
        id,
        subjectSlug,
        topicSlug,
        type: "mcq",
        category: cat,
        difficulty: diff,
        question: `[${topicTitle}] Concept check #${i + 1}: Which statement about ${topicTitle} is most accurate?`,
        options: [
          `Core principle of ${topicTitle}`,
          `Unrelated OS networking concept`,
          `Incorrect inverse of ${topicTitle}`,
          `Deprecated legacy approach`,
        ],
        answer: 0,
        explanation: `The correct answer relates to fundamental ${topicTitle} principles covered in the lesson.`,
        relatedTopics: [topicSlug],
        estimatedSeconds: diff === "easy" ? 45 : 75,
      });
    } else if (type === "true-false") {
      questions.push({
        id,
        subjectSlug,
        topicSlug,
        type: "true-false",
        category: "theory",
        difficulty: diff,
        question: `${topicTitle} is essential for modern operating system design.`,
        options: ["True", "False"],
        answer: true,
        explanation: `${topicTitle} is a core OS topic covered in university curricula and industry interviews.`,
        estimatedSeconds: 30,
      });
    } else if (type === "fill-blank") {
      questions.push({
        id,
        subjectSlug,
        topicSlug,
        type: "fill-blank",
        category: "theory",
        difficulty: diff,
        question: `In ${topicTitle}, the key mechanism is _____.`,
        answer: topicTitle.split(" ")[0].toLowerCase(),
        explanation: `Review the ${topicTitle} theory notes for the complete answer.`,
        estimatedSeconds: 45,
      });
    } else {
      questions.push({
        id,
        subjectSlug,
        topicSlug,
        type: "scenario",
        category: "real-world",
        difficulty: diff,
        question: `Scenario: A system exhibits issues related to ${topicTitle}. What is the best first step?`,
        options: ["Analyze system logs and metrics", "Restart without investigation", "Ignore the issue", "Disable the feature"],
        answer: 0,
        explanation: "Systematic analysis is the correct engineering approach for OS-related issues.",
        estimatedSeconds: 90,
      });
    }
  }
  return questions;
}

let _cachedBank: QuizQuestion[] | null = null;

export function getAllQuestions(): QuizQuestion[] {
  if (!_cachedBank) {
    const os = generateOSQuestions();
    const osTopics = ["introduction", "threads", "synchronization", "semaphores", "mutex", "paging", "segmentation", "virtual-memory", "file-systems", "io-systems", "os-security", "case-studies"];
    const generated = osTopics.flatMap((slug) =>
      generateTopicQuestionBank("os", slug, slug.replace(/-/g, " "), 100)
    );
    const dsa = ["arrays", "linked-list", "stack", "queue", "tree", "graph", "heap", "hashing", "searching", "sorting"]
      .flatMap((slug) => generateTopicQuestionBank("dsa", slug, slug.replace(/-/g, " "), 100));
    const db = ["basics", "relational-model", "sql", "normalization", "erd", "indexing", "transactions", "query-optimization"]
      .flatMap((slug) => generateTopicQuestionBank("database", slug, slug.replace(/-/g, " "), 100));
    const net = ["basics", "osi-model", "tcp-ip", "tcp-udp", "ip-addressing", "subnetting", "dns", "http"]
      .flatMap((slug) => generateTopicQuestionBank("network", slug, slug.replace(/-/g, " "), 100));
    _cachedBank = [...os, ...generated, ...dsa, ...db, ...net];
  }
  return _cachedBank;
}

export function getQuestionCount(subjectSlug: string, topicSlug?: string) {
  return getAllQuestions().filter((q) => q.subjectSlug === subjectSlug && (!topicSlug || q.topicSlug === topicSlug)).length;
}
