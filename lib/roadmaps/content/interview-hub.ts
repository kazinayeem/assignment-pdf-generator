import type { InterviewCategory, InterviewQuestion, RoadmapDefinition, RoadmapDifficulty } from "../types";
import { ALL_COMPANIES, DIFFICULTY_LEVELS, INTERVIEW_CATEGORIES } from "./constants";

const CATEGORY_PROMPTS: Record<InterviewCategory, string[]> = {
  theory: [
    "Explain the core concepts of {topic} in {role}.",
    "What are the fundamental principles behind {topic}?",
    "How does {topic} fit into the {role} ecosystem?",
  ],
  practical: [
    "Walk me through how you would implement {topic} in a real project.",
    "Describe a hands-on task involving {topic} you have completed.",
    "What tools would you use when working with {topic}?",
  ],
  coding: [
    "Write a function that demonstrates {topic} fundamentals.",
    "Solve a coding problem using {topic} with optimal complexity.",
    "Implement a small module showcasing {topic} best practices.",
  ],
  scenario: [
    "Your team must deliver a feature using {topic} under a tight deadline. What do you do?",
    "A production issue relates to {topic}. How do you diagnose and fix it?",
    "Stakeholders disagree on the approach for {topic}. How do you handle it?",
  ],
  debugging: [
    "How would you debug a failure related to {topic}?",
    "What logging and monitoring would you add around {topic}?",
    "Describe your step-by-step debugging process for {topic} issues.",
  ],
  design: [
    "Design a system component that relies heavily on {topic}.",
    "How would you design for scalability when using {topic}?",
    "What trade-offs exist when choosing {topic} for this use case?",
  ],
  architecture: [
    "How does {topic} influence overall system architecture for {role}?",
    "Explain microservices vs monolith considerations with {topic}.",
    "What patterns pair well with {topic} at scale?",
  ],
  behavioral: [
    "Tell me about a time you learned {topic} quickly for a project.",
    "Describe a conflict while implementing {topic} and how you resolved it.",
    "Share an example of mentoring others on {topic}.",
  ],
  hr: [
    "Why are you interested in a {role} position involving {topic}?",
    "Where do you see {topic} skills taking your career in 3 years?",
    "What motivates you to keep improving in {topic}?",
  ],
};

function topicsFromDef(def: RoadmapDefinition): string[] {
  return def.nodeDefs.map((n) => n.title);
}

function pickTopic(topics: string[], index: number): string {
  return topics[index % topics.length] ?? "core fundamentals";
}

function buildAnswer(role: string, topic: string, category: InterviewCategory, difficulty: RoadmapDifficulty): string {
  return `As a ${role} candidate, demonstrate structured thinking about ${topic}. Start with definitions, explain practical application, mention trade-offs, and connect to real projects. At ${difficulty} level, interviewers expect depth proportional to experience.`;
}

function generateCategoryQuestions(
  def: RoadmapDefinition,
  category: InterviewCategory,
  difficulty: RoadmapDifficulty,
  topics: string[],
  startId: number
): InterviewQuestion[] {
  const prompts = CATEGORY_PROMPTS[category];
  const role = def.title;
  return prompts.map((template, i) => {
    const topic = pickTopic(topics, startId + i);
    const question = template.replace("{topic}", topic).replace("{role}", role);
    const id = `${def.slug}-iq-${category}-${difficulty}-${i}`;
    return {
      id,
      question,
      answer: buildAnswer(role, topic, category, difficulty),
      explanation: `${category} questions at ${difficulty} level assess how well you understand ${topic} in ${role} contexts. Structure answers with context, action, result, and lessons learned.`,
      commonMistakes: [
        "Answering without concrete examples",
        "Skipping trade-offs and limitations",
        "Using buzzwords without demonstrating understanding",
      ],
      followUpQuestions: [
        `Can you go deeper on ${topic}?`,
        `What would you do differently in a larger team?`,
        `How would you measure success for this approach?`,
      ],
      difficulty,
      category,
      topic,
      tips: [
        "Use the STAR method for behavioral answers",
        "Think aloud for coding and design questions",
        "Ask clarifying questions before solving",
      ],
    };
  });
}

function generateCompanyQuestions(def: RoadmapDefinition, topics: string[]): InterviewQuestion[] {
  const role = def.title;
  return ALL_COMPANIES.map((company, i) => {
    const topic = pickTopic(topics, i);
    return {
      id: `${def.slug}-co-${i}`,
      question: `How would you approach a ${role} interview at ${company} involving ${topic}?`,
      answer: `Research ${company}'s products, tech stack, and engineering culture. Prepare stories showing ${topic} expertise, system thinking, and collaboration. Tailor examples to ${company}'s domain and scale.`,
      explanation: `${company} interviews typically combine fundamentals, practical skills, and culture fit. For ${role} roles, emphasize ${topic} depth plus communication and ownership.`,
      commonMistakes: [
        `Not researching ${company}-specific products`,
        "Generic answers without company context",
        "Ignoring behavioral and leadership signals",
      ],
      followUpQuestions: [
        "What project would you propose for their stack?",
        "How do you handle ambiguity in large orgs?",
      ],
      difficulty: (i % 4 === 0 ? "beginner" : i % 4 === 1 ? "intermediate" : i % 4 === 2 ? "advanced" : "expert") as RoadmapDifficulty,
      category: "scenario" as InterviewCategory,
      company,
      topic,
      tips: [
        "Study recent engineering blogs from the company",
        "Practice whiteboard or live coding if applicable",
        "Prepare thoughtful questions for interviewers",
      ],
    };
  });
}

export function generateInterviewHub(def: RoadmapDefinition): InterviewQuestion[] {
  const topics = topicsFromDef(def);
  const questions: InterviewQuestion[] = [];
  let idCounter = 0;

  for (const cat of INTERVIEW_CATEGORIES) {
    for (const diff of DIFFICULTY_LEVELS) {
      questions.push(...generateCategoryQuestions(def, cat.id, diff, topics, idCounter));
      idCounter += 3;
    }
  }

  questions.push(...generateCompanyQuestions(def, topics));

  return questions;
}
