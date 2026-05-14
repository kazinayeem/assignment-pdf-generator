"use client";

import React from "react";
import Link from "next/link";
import { ChevronRight, Sparkles, MessageSquare, BookOpen, PenTool } from "lucide-react";

export default function LLMPage() {
  return (
    <div className="min-h-screen bg-gray-50 px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-6">
        <Link href="/tools/data-science" className="hover:text-gray-700 transition-colors">Data Science</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-gray-700 font-semibold">LLM & GPT</span>
      </div>

      <div className="max-w-4xl mx-auto space-y-6">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-sm">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-gray-900">LLMs & GPT</h1>
              <p className="text-gray-500 text-sm">Large language models, fine-tuning, RAG, and prompt engineering.</p>
            </div>
          </div>
        </div>

        {/* What are LLMs */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-sm font-black uppercase tracking-wider text-gray-700 mb-4 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500" /> What Are LLMs?
          </h2>
          <p className="text-sm text-gray-600 mb-4 leading-relaxed">
            Large Language Models (LLMs) are neural networks with billions of parameters trained on massive text corpora. They predict the next token in a sequence, enabling them to generate coherent text, answer questions, translate, summarize, and reason.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
            {[
              ["GPT-4", "OpenAI", "1.8T params"],
              ["Claude", "Anthropic", "~500B params"],
              ["LLaMA 3", "Meta", "405B params"],
              ["Gemini", "Google DeepMind", "Multimodal"],
            ].map(([name, company, params]) => (
              <div key={name} className="p-3 bg-amber-50 rounded-xl border border-amber-100">
                <p className="text-sm font-bold text-amber-800">{name}</p>
                <p className="text-[10px] text-amber-600">{company}</p>
                <p className="text-[10px] text-amber-500 font-mono">{params}</p>
              </div>
            ))}
          </div>
        </div>

        {/* GPT Architecture */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-sm font-black uppercase tracking-wider text-gray-700 mb-4 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-blue-500" /> GPT Architecture
          </h2>
          <p className="text-sm text-gray-600 mb-4 leading-relaxed">
            GPT uses a decoder-only transformer architecture. It is autoregressive: it generates one token at a time, conditioning each new token on all previous tokens via masked self-attention.
          </p>
          <div className="bg-gray-900 rounded-xl p-4 font-mono text-xs text-green-400 overflow-x-auto mb-4">
            <pre>{`# GPT-style architecture (conceptual)
# Decoder-only transformer block

class GPTBlock:
    def __init__(self, d_model=768, num_heads=12):
        self.attention = MultiHeadAttention(num_heads, d_model)
        self.norm1 = LayerNorm(d_model)
        self.ffn = Sequential([
            Dense(d_model * 4, activation="gelu"),
            Dense(d_model)
        ])
        self.norm2 = LayerNorm(d_model)

    def __call__(self, x, mask):
        # Masked self-attention (can't look ahead)
        attn_out = self.attention(x, x, x, mask)
        x = self.norm1(x + attn_out)  # residual + norm

        # Feed-forward
        ffn_out = self.ffn(x)
        x = self.norm2(x + ffn_out)   # residual + norm
        return x

# Key differences from BERT:
# - Decoder-only (vs encoder-only)
# - Causal masking (vs bidirectional)
# - Autoregressive generation (vs span fill)`}</pre>
          </div>
        </div>

        {/* Fine-Tuning & RAG */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-sm font-black uppercase tracking-wider text-gray-700 mb-4 flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-emerald-500" /> Fine-Tuning & RAG
          </h2>
          <p className="text-sm text-gray-600 mb-4 leading-relaxed">
            Fine-tuning adapts a pre-trained LLM to a specific task using labeled data. RAG (Retrieval-Augmented Generation) combines LLMs with external knowledge retrieval to ground responses in factual data without retraining.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100">
              <p className="text-sm font-bold text-emerald-800 mb-2">Fine-Tuning</p>
              <ul className="text-xs text-emerald-700 space-y-1">
                <li>• Train on task-specific labeled data</li>
                <li>• Full fine-tuning: update all parameters</li>
                <li>• LoRA: train small adapter matrices (efficient)</li>
                <li>• QLoRA: quantize + LoRA for consumer GPUs</li>
                <li>• Use when: task-specific style/format needed</li>
              </ul>
            </div>
            <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
              <p className="text-sm font-bold text-blue-800 mb-2">RAG (Retrieval-Augmented Generation)</p>
              <ul className="text-xs text-blue-700 space-y-1">
                <li>• Retrieve relevant docs from vector DB</li>
                <li>• Inject into LLM context as extra knowledge</li>
                <li>• No training required — data stays external</li>
                <li>• Use when: factual accuracy & freshness needed</li>
                <li>• Reduces hallucinations dramatically</li>
              </ul>
            </div>
          </div>
          <div className="bg-gray-900 rounded-xl p-4 font-mono text-xs text-green-400 overflow-x-auto">
            <pre>{`# Fine-tuning with LoRA (using HuggingFace PEFT)
from peft import LoraConfig, get_peft_model
from transformers import AutoModelForCausalLM

model = AutoModelForCausalLM.from_pretrained("meta-llama/Llama-2-7b")

lora_config = LoraConfig(
    r=8,                     # rank
    lora_alpha=32,
    target_modules=["q_proj", "v_proj"],
    lora_dropout=0.05
)
model = get_peft_model(model, lora_config)
print(f"Trainable params: {model.num_parameters(only_trainable=True):,}")

# RAG pipeline (conceptual)
# 1. Embed query → search vector database
# 2. Retrieve top-k relevant chunks
# 3. Build prompt: context + query
# 4. Generate response with LLM`}</pre>
          </div>
        </div>

        {/* Prompt Engineering */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-sm font-black uppercase tracking-wider text-gray-700 mb-4 flex items-center gap-2">
            <PenTool className="w-4 h-4 text-purple-500" /> Prompt Engineering Basics
          </h2>
          <p className="text-sm text-gray-600 mb-4 leading-relaxed">
            Prompt engineering is the practice of crafting inputs to get desired outputs from LLMs. Key techniques improve reliability, accuracy, and control.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
            {[
              ["Zero-Shot", "Classify this review: 'Great product!'\nSentiment:", "No examples needed"],
              ["Few-Shot", "Positive: 'Love it'\nNegative: 'Terrible'\nReview: 'Okay' →", "Provide 2-3 examples"],
              ["Chain-of-Thought", "Q: 24 × 37 = ?\nLet's think step by step...", "Reason step-by-step"],
            ].map(([name, example, desc]) => (
              <div key={name} className="p-3 bg-purple-50 rounded-xl border border-purple-100">
                <p className="text-sm font-bold text-purple-800 mb-1">{name}</p>
                <code className="text-[10px] text-purple-600 block mb-1 font-mono bg-purple-100 p-1 rounded">{example}</code>
                <p className="text-[10px] text-purple-500">{desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Interview Questions */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-sm font-black uppercase tracking-wider text-gray-700 mb-4">Interview Questions</h2>
          <div className="space-y-4">
            {[
              ["What is the difference between a base LLM and an instruction-tuned LLM?",
               "Base LLMs are pre-trained on raw text to predict the next token. Instruction-tuned models are further fine-tuned on instruction-response pairs (often with RLHF) to follow user instructions and produce helpful, safe outputs."],
              ["What is RAG and when would you use it over fine-tuning?",
               "RAG retrieves external knowledge and injects it into the LLM context. Use RAG when you need up-to-date information, reduce hallucinations, or access proprietary data without retraining. Fine-tuning is better for task-specific style or behavior."],
              ["Explain the transformer attention mechanism in GPT.",
               "GPT uses masked (causal) self-attention: each token can only attend to itself and prior tokens. The attention scores determine how much each previous token contributes to the current token's representation. This enables autoregressive generation."],
              ["What are some prompt engineering best practices?",
               "Be specific and clear, provide examples (few-shot), use chain-of-thought for reasoning, split complex tasks into steps, set output format (JSON, bullet points), and iterate by refining based on responses."],
            ].map(([q, a]) => (
              <div key={q} className="p-4 bg-amber-50 rounded-xl border border-amber-100">
                <p className="text-sm font-bold text-amber-900 mb-1">Q: {q}</p>
                <p className="text-xs text-amber-700 leading-relaxed">{a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
