"use client";

import Link from "next/link";
import { Home, ChevronRight, Zap, Cpu } from "lucide-react";
import { Section, InfoCard, CodeBlock, Diagram, AnimatedFlow, InterviewQuestion } from "../components";

export default function InterruptsPage() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      <div className="flex items-center gap-2 mb-6 text-xs text-slate-500">
        <Link href="/tools/arch" className="text-cyan-600 no-underline flex items-center gap-1.5 hover:text-cyan-800 transition">
          <Home size={16} /> Architecture
        </Link>
        <ChevronRight size={16} />
        <span className="text-slate-900 font-semibold">Interrupts</span>
      </div>

      <div className="mb-10">
        <h1 className="text-4xl font-extrabold text-slate-900 mb-3">⚡ Interrupts</h1>
        <p className="text-base text-slate-500 leading-relaxed max-w-xl">
          Interrupts allow the CPU to respond to events asynchronously. Learn about interrupt handling, prioritization, and how modern systems manage multiple interrupt sources.
        </p>
      </div>

      <Section title="What Are Interrupts?">
        <InfoCard title="Definition" type="info">
          An interrupt is a signal sent to the processor that temporarily suspends the current program execution and redirects the CPU to handle a specific event. Interrupts allow the CPU to respond to urgent events (like I/O completion or timer expiry) without constant polling.
        </InfoCard>
        <div className="grid sm:grid-cols-2 gap-4">
          {[
            { title: "Why Interrupts?", desc: "Without interrupts, CPU must poll devices constantly, wasting cycles. Interrupts enable efficient multitasking and real-time response.", icon: <Zap size={20} /> },
            { title: "How They Work", desc: "Device sends a signal on the interrupt request line. CPU saves its current state, runs the handler, then restores and resumes.", icon: <Cpu size={20} /> },
          ].map((item, i) => (
            <div key={i} className="bg-white rounded-xl border border-slate-200 p-4 flex gap-3">
              <div className="text-cyan-600 mt-0.5">{item.icon}</div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 mb-1">{item.title}</h4>
                <p className="text-xs text-slate-500">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Interrupt Service Routine (ISR)">
        <InfoCard title="ISR Flow" type="tip">
          When an interrupt fires, the CPU: 1) Completes the current instruction, 2) Saves PC and processor status register onto the stack, 3) Disables further interrupts, 4) Jumps to the ISR address, 5) Executes the handler, 6) Restores saved state and resumes the interrupted program.
        </InfoCard>
        <AnimatedFlow steps={[
          { label: "IRQ Signal", desc: "Device asserts interrupt" },
          { label: "Save State", desc: "PC & flags pushed" },
          { label: "Vector Lookup", desc: "Find ISR address" },
          { label: "Execute ISR", desc: "Handle the event" },
          { label: "Restore", desc: "IRET, resume program" },
        ]} />
        <CodeBlock code={`; Conceptual interrupt handling sequence
; Step 1: CPU completes current instruction
; Step 2: Automatically pushes PC and flags to stack
; Step 3: Looks up ISR address from vector table
; Step 4: Jumps to ISR

ISR_HANDLER:
    PUSH R0              ; Save registers used in ISR
    PUSH R1
    IN   R0, DATA_PORT   ; Read data from device
    STORE R0, BUFFER     ; Store in memory buffer
    POP  R1              ; Restore registers
    POP  R0
    IRET                 ; Return: restores PC & flags

; Step 5: CPU pops PC and flags, resumes original program`} language="assembly" />
      </Section>

      <Section title="Interrupt Vector Table (IVT)">
        <InfoCard title="Purpose" type="info">
          The IVT is a table in memory that maps each interrupt type/vector number to the address of its corresponding ISR. When an interrupt occurs, the CPU uses the vector number as an index into this table to find the handler address.
        </InfoCard>
        <Diagram title="Interrupt Vector Table Structure">
          <div className="w-full max-w-lg">
            <div className="grid grid-cols-3 gap-0 text-xs mb-2">
              <div className="bg-cyan-700 text-white p-2 font-bold text-center">Vector #</div>
              <div className="bg-cyan-700 text-white p-2 font-bold text-center">ISR Address</div>
              <div className="bg-cyan-700 text-white p-2 font-bold text-center">Description</div>
            </div>
            {[
              { vec: "0", addr: "0x0000", desc: "Division by zero" },
              { vec: "1", addr: "0x0004", desc: "Single-step (debug)" },
              { vec: "2", addr: "0x0008", desc: "Non-maskable (NMI)" },
              { vec: "3", addr: "0x000C", desc: "Breakpoint" },
              { vec: "4", addr: "0x0010", desc: "Overflow" },
              { vec: "5..255", addr: "0x0014..", desc: "Hardware / software IRQs" },
            ].map((row, i) => (
              <div key={i} className={`grid grid-cols-3 gap-0 ${i % 2 === 0 ? "bg-slate-50" : "bg-white"}`}>
                <div className="p-2 font-mono text-slate-800 border border-slate-200">{row.vec}</div>
                <div className="p-2 font-mono text-cyan-700 border border-slate-200">{row.addr}</div>
                <div className="p-2 text-slate-600 border border-slate-200">{row.desc}</div>
              </div>
            ))}
          </div>
        </Diagram>
      </Section>

      <Section title="Types of Interrupts">
        <div className="grid sm:grid-cols-2 gap-4">
          {[
            { title: "Hardware Interrupt", desc: "Generated by external devices (keyboard, disk, timer) via an interrupt request line (IRQ).", ex: "Keyboard press → IRQ1 → ISR reads scancode", color: "border-cyan-200 bg-cyan-50" },
            { title: "Software Interrupt", desc: "Generated by running programs via special instructions (INT, syscall, trap).", ex: "INT 0x80 on x86 Linux → system call", color: "border-amber-200 bg-amber-50" },
            { title: "Maskable Interrupt", desc: "Can be temporarily ignored (masked) by the CPU. Most hardware IRQs are maskable.", ex: "cli instruction on x86 disables maskable IRQs", color: "border-emerald-200 bg-emerald-50" },
            { title: "Non-Maskable (NMI)", desc: "Cannot be disabled. Used for critical events like power failure or memory errors.", ex: "RAM parity error → NMI → emergency shutdown", color: "border-pink-200 bg-pink-50" },
          ].map((t, i) => (
            <div key={i} className={`${t.color} border rounded-xl p-4`}>
              <h4 className="text-sm font-bold text-slate-900 mb-1.5">{t.title}</h4>
              <p className="text-xs text-slate-500 mb-2">{t.desc}</p>
              <p className="text-[10px] font-mono text-slate-400">Example: {t.ex}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Interrupt Priority and Nesting">
        <InfoCard title="Priority & Nesting" type="tip">
          When multiple interrupts occur simultaneously, the one with the highest priority is serviced first. In nested interrupt handling, a higher-priority interrupt can preempt a lower-priority ISR that is currently executing. The priority is typically encoded in the interrupt controller (PIC or APIC).
        </InfoCard>
        <Diagram title="Nested Interrupt Handling Flow">
          <div className="w-full max-w-xl text-xs font-mono">
            <div className="flex flex-col gap-1">
              <div className="bg-blue-100 border border-blue-300 rounded p-2 text-blue-800">Main Program (lowest priority)</div>
              <div className="bg-amber-100 border border-amber-300 rounded p-2 text-amber-800 ml-4">IRQ1: Keyboard ISR (priority 4) — starts</div>
              <div className="bg-pink-100 border border-pink-300 rounded p-2 text-pink-800 ml-8">IRQ4: Timer ISR (priority 1, highest) — preempts!</div>
              <div className="bg-pink-100 border border-pink-300 rounded p-2 text-pink-800 ml-8">IRQ4: Timer ISR — completes</div>
              <div className="bg-amber-100 border border-amber-300 rounded p-2 text-amber-800 ml-4">IRQ1: Keyboard ISR — resumes, completes</div>
              <div className="bg-blue-100 border border-blue-300 rounded p-2 text-blue-800">Main Program — resumes</div>
            </div>
          </div>
        </Diagram>
        <div className="grid sm:grid-cols-2 gap-4">
          {[
            { term: "Priority", def: "Determines which ISR runs first when multiple interrupts arrive simultaneously. Lower number = higher priority typically." },
            { term: "Nesting", def: "Higher-priority interrupts can preempt lower-priority ISRs. Requires saving/restoring state for each level." },
            { term: "Masking", def: "During an ISR, the CPU can mask (disable) lower-priority interrupts to prevent preemption." },
            { term: "Interrupt Latency", def: "The time between interrupt signal and the start of ISR execution. Must be minimized for real-time systems." },
          ].map((item, i) => (
            <div key={i} className="bg-white rounded-xl border border-slate-200 p-4">
              <h4 className="text-sm font-bold text-slate-900 mb-1">{item.term}</h4>
              <p className="text-xs text-slate-500">{item.def}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Multiple Interrupt Handling Approaches">
        <div className="grid sm:grid-cols-2 gap-4">
          {[
            { name: "Sequential (Disable All)", desc: "Disable all interrupts while servicing any interrupt. Simple but doesn't handle priorities.", pros: "Very simple implementation", cons: "High-priority events can be delayed" },
            { name: "Priority-Based (Nested)", desc: "Interrupts with higher priority can preempt lower-priority ISRs. Requires priority management.", pros: "Low latency for critical events", cons: "Complex implementation, more stack space" },
          ].map((m, i) => (
            <div key={i} className="bg-white rounded-xl border border-slate-200 p-4">
              <h4 className="text-sm font-bold text-slate-900 mb-2">{m.name}</h4>
              <p className="text-xs text-slate-500 mb-3">{m.desc}</p>
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-semibold text-emerald-600">Pros: {m.pros}</span>
                <span className="text-[10px] font-semibold text-pink-600">Cons: {m.cons}</span>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Conceptual Code: ISR in C">
        <InfoCard title="Note" type="tip">
          This code simulates interrupt-driven I/O with a shared buffer. In real systems, ISRs must be short and fast — they often just acknowledge the interrupt and queue work for a handler thread.
        </InfoCard>
        <CodeBlock code={`#include <stdint.h>
#include <stdbool.h>

volatile uint8_t buffer[256];
volatile uint16_t head = 0, tail = 0;
volatile bool data_ready = false;

// Simulated Interrupt Service Routine
// Called by hardware when device has data
void __attribute__((interrupt)) device_isr(void) {
    uint8_t data = inb(DEVICE_DATA_PORT);
    
    // Store in circular buffer
    uint16_t next = (head + 1) & 0xFF;
    if (next != tail) {  // Buffer not full
        buffer[head] = data;
        head = next;
    }
    
    // Acknowledge interrupt to PIC
    outb(PIC_EOI, 0x20);
    // ISR returns — CPU restores context automatically
}

// Main program runs concurrently
int main(void) {
    while (1) {
        if (tail != head) {
            // Process data from buffer
            uint8_t data = buffer[tail];
            tail = (tail + 1) & 0xFF;
            process_data(data);
        }
        // Do other work — no polling needed!
    }
    return 0;
}`} language="c" />
      </Section>

      <Section title="Interview Questions">
        <div className="space-y-3">
          <InterviewQuestion question="What is the difference between a trap and an interrupt?" answer="A trap (or software interrupt) is intentionally triggered by a program via a special instruction (e.g., syscall, INT). Interrupts are usually asynchronous events from hardware. Both use the same mechanism: save state, vector to handler, execute, return. Traps are synchronous (caused by the current instruction), interrupts are asynchronous (from external devices)." />
          <InterviewQuestion question="Explain interrupt latency and how to minimize it." answer="Interrupt latency is the delay from interrupt assertion to the first instruction of the ISR. It includes: finishing current instruction, saving state, vector lookup. To minimize: keep ISRs short, use nested interrupts for high-priority sources, avoid disabling interrupts for long periods, and consider interrupt coalescing in high-throughput systems." />
          <InterviewQuestion question="What happens when multiple interrupts occur at the same time?" answer="Modern interrupt controllers assign priorities to each IRQ line. When multiple interrupts arrive, the highest priority one is serviced first. In nested mode, a higher priority interrupt can preempt a lower priority ISR. After the highest priority ISR completes, the next highest is serviced, and so on, until control returns to the main program." />
          <InterviewQuestion question="What is a spurious interrupt?" answer="A spurious interrupt is an interrupt that is not generated by any actual device. It can occur due to electrical noise, race conditions in interrupt signaling, or when the interrupt controller delivers an interrupt that has already been cleared by the device. The ISR must detect and ignore spurious interrupts to prevent system instability." />
        </div>
      </Section>
    </div>
  );
}
