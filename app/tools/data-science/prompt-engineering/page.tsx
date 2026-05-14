"use client";

import React from "react";
import Link from "next/link";
import { ChevronRight, Sparkles, MessageSquare, BrainCircuit, Sliders, Code } from "lucide-react";

export default function PromptEngineeringPage() {
  return (
    <div className="min-h-screen bg-gray-50 px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-6">
        <Link href="/tools/data-science" className="hover:text-gray-700 transition-colors">Data Science</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-gray-700 font-semibold">Prompt Engineering</span>
      </div>

      <div className="max-w-4xl mx-auto space-y-6">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center shadow-sm">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-gray-900">Prompt Engineering</h1>
              <p className="text-gray-500 text-sm">Designing effective prompts to get the best output from LLMs.</p>
            </div>
          </div>
        </div>

        {/* What is Prompt Engineering */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-sm font-black uppercase tracking-wider text-gray-700 mb-4 flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-orange-500" /> What is Prompt Engineering?
          </h2>
          <p className="text-sm text-gray-600 mb-4 leading-relaxed">
            Prompt engineering is the practice of carefully crafting input text to guide large language models (LLMs) toward desired outputs. Well-structured prompts dramatically improve response quality, reduce hallucinations, and enable complex reasoning chains.
          </p>
          <div className="bg-gray-900 rounded-xl p-4 font-mono text-xs text-green-400 overflow-x-auto mb-4">
            <pre>{`# Bad prompt — vague and ambiguous
prompt = "Tell me about AI"
# Likely result: a generic paragraph with no depth

# Good prompt — specific, structured, with constraints
prompt = """
You are an expert AI researcher. Explain the following concepts
to a university CS student in 3-4 sentences each:
1. Transformer architecture
2. Self-attention mechanism
3. Fine-tuning vs RAG

Use analogies where helpful and avoid jargon without explanation.
"""

# Result: focused, educational, and well-structured response`}</pre>
          </div>
        </div>

        {/* Prompt Techniques */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-sm font-black uppercase tracking-wider text-gray-700 mb-4 flex items-center gap-2">
            <BrainCircuit className="w-4 h-4 text-purple-500" /> Core Prompt Techniques
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            {[
              ["Zero-Shot Prompting", "Ask directly without examples. Works best for simple, well-known tasks. E.g., 'Translate to French: Hello.'"],
              ["Few-Shot Prompting", "Provide 2-5 examples before asking the target question. Helps with formatting, style, and complex tasks."],
              ["Chain-of-Thought (CoT)", "Prompt the model to reason step-by-step before answering. Significantly improves math, logic, and multi-step problems."],
              ["Tree-of-Thought (ToT)", "Explore multiple reasoning paths simultaneously, then evaluate and choose the best one. Useful for planning and strategy."],
              ["Role Prompting", "Assign a persona (e.g., 'You are a senior software engineer') to set context, tone, and expertise level for the output."],
              ["Structured Output", "Request specific formats: JSON, markdown, bullet points, or tables. Use explicit schemas to get parseable results."],
            ].map(([name, desc]) => (
              <div key={name} className="p-3 bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl border border-orange-100">
                <p className="text-sm font-bold text-orange-800 mb-1">{name}</p>
                <p className="text-xs text-orange-600 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Advanced Strategies */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-sm font-black uppercase tracking-wider text-gray-700 mb-4 flex items-center gap-2">
            <Sliders className="w-4 h-4 text-blue-500" /> Advanced Strategies
          </h2>
          <p className="text-sm text-gray-600 mb-4 leading-relaxed">
            Combine techniques for complex real-world tasks. Chain prompts together, use temperature/ top-p controls, and iterate based on model feedback.
          </p>
          <div className="bg-gray-900 rounded-xl p-4 font-mono text-xs text-green-400 overflow-x-auto mb-4">
            <pre>{`# Multi-step prompt chain
def research_topic(topic: str) -> dict:
    """Chain multiple prompts to generate a structured report."""

    # Step 1: Outline
    outline_prompt = f"""
    Create a detailed outline for a 500-word article on '{topic}'.
    Include: introduction, 3 key concepts, applications, and conclusion.
    Output as JSON with keys: sections, subsections.
    """

    # Step 2: Expand each section using the outline
    expand_prompt = f"""
    Using this outline: {outline_prompt}
    Expand each section with specific examples, data points,
    and practical code snippets where applicable.
    Keep each section under 150 words.
    """

    # Step 3: Review & refine
    review_prompt = f"""
    Review the following article for accuracy, clarity, and completeness.
    Identify any claims that need citations and suggest improvements.
    ---
    Article: {expand_prompt}
    """

    return {"outline": outline_prompt, "draft": expand_prompt, "review": review_prompt}

# Parameters that affect output
config = {
    "temperature": 0.3,    # 0 = deterministic, 1 = creative
    "top_p": 0.9,          # nucleus sampling threshold
    "max_tokens": 2048,    # response length limit
    "presence_penalty": 0, # discourage topic repetition
    "frequency_penalty": 0 # discourage word repetition
}`}</pre>
          </div>
        </div>

        {/* System Prompts */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-sm font-black uppercase tracking-wider text-gray-700 mb-4 flex items-center gap-2">
            <Code className="w-4 h-4 text-emerald-500" /> System Prompts & RAG
          </h2>
          <p className="text-sm text-gray-600 mb-4 leading-relaxed">
            System prompts set the model behavior, constraints, and context. In RAG (Retrieval-Augmented Generation), prompts incorporate retrieved documents to ground the model in factual information.
          </p>
          <div className="bg-gray-900 rounded-xl p-4 font-mono text-xs text-green-400 overflow-x-auto mb-4">
            <pre>{`# System prompt pattern
SYSTEM_PROMPT = """
You are a helpful coding assistant for university students.
Rules:
- Always explain concepts before showing code
- Use Python with simple examples
- If unsure, say "I don't know" instead of guessing
- Keep responses under 200 words
"""

# RAG prompt pattern
RAG_PROMPT = """
Context documents:
{document_1}
{document_2}

Question: {user_question}

Answer based only on the provided context.
If the context does not contain the answer, say so.
Cite the relevant context in your answer.
"""

# Few-shot example embedded in prompt
FEW_SHOT = """
Classify the sentiment of each review:

Review: "This product exceeded my expectations!"
Sentiment: Positive

Review: "Terrible quality, broke in a day."
Sentiment: Negative

Review: "It's okay for the price."
Sentiment: Neutral

Review: "{input_text}"
Sentiment:"""`}</pre>
          </div>
        </div>

        {/* Interview Questions */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-sm font-black uppercase tracking-wider text-gray-700 mb-4">Interview Questions</h2>
          <div className="space-y-4">
            {[
              ["What is chain-of-thought prompting and when should you use it?",
               "Chain-of-thought (CoT) prompts the model to reason step-by-step before answering. Use it for arithmetic, logical reasoning, multi-step problems, and any task requiring intermediate steps. It reduces errors by making the reasoning process explicit."],
              ["How does temperature affect LLM output?",
               "Temperature controls randomness: 0 makes output deterministic (always picks highest probability token), values closer to 1 increase creativity and variety. Use low temperature (0.1–0.3) for factual tasks, high temperature (0.7–0.9) for creative writing."],
              ["What is the difference between a system prompt and a user prompt?",
               "A system prompt sets the model's behavior, persona, and constraints (e.g., 'You are a helpful tutor'). It persists across a conversation. User prompts are the actual queries or instructions and can vary with each turn. System prompts have stronger steering influence."],
              ["How does few-shot prompting differ from fine-tuning?",
               "Few-shot prompting provides examples in the prompt at inference time — no training needed. Fine-tuning updates the model's weights on labeled data, permanently altering its behavior. Few-shot is quick and flexible; fine-tuning is more thorough but expensive."],
              ["What is RAG and how does it improve prompt engineering?",
               "RAG (Retrieval-Augmented Generation) retrieves relevant documents from a knowledge base and injects them into the prompt as context. This grounds the model in factual information, reduces hallucinations, and enables question answering over private data without retraining."],
            ].map(([q, a]) => (
              <div key={q} className="p-4 bg-orange-50 rounded-xl border border-orange-100">
                <p className="text-sm font-bold text-orange-900 mb-1">Q: {q}</p>
                <p className="text-xs text-orange-700 leading-relaxed">{a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
