"use client";

import Link from "next/link";
import { Home, ChevronRight, Cpu, Zap, Repeat, ArrowLeftRight } from "lucide-react";
import { Section, InfoCard, CodeBlock, Diagram, InterviewQuestion } from "../components";

export default function IOOrganizationPage() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      <div className="flex items-center gap-2 mb-6 text-xs text-slate-500">
        <Link href="/tools/arch" className="text-cyan-600 no-underline flex items-center gap-1.5 hover:text-cyan-800 transition">
          <Home size={16} /> Architecture
        </Link>
        <ChevronRight size={16} />
        <span className="text-slate-900 font-semibold">I/O Organization</span>
      </div>

      <div className="mb-10">
        <h1 className="text-4xl font-extrabold text-slate-900 mb-3">🔌 I/O Organization</h1>
        <p className="text-base text-slate-500 leading-relaxed max-w-xl">
          How input and output devices communicate with the CPU, including programmed I/O, interrupt-driven I/O, and Direct Memory Access (DMA).
        </p>
      </div>

      <Section title="I/O Modules and Their Functions">
        <InfoCard title="Role of I/O Modules" type="info">
          I/O modules act as interfaces between the CPU/memory and peripheral devices. They handle data buffering, protocol conversion, error detection, and device synchronization so the CPU can communicate with diverse peripherals through a standard interface.
        </InfoCard>
        <div className="grid sm:grid-cols-2 gap-4">
          {[
            { title: "Data Buffering", desc: "Temporarily stores data to bridge speed differences between CPU and device.", icon: <ArrowLeftRight size={20} /> },
            { title: "Control & Timing", desc: "Coordinates data flow between internal and external devices.", icon: <Cpu size={20} /> },
            { title: "Device Selection", desc: "Decodes address lines to select the correct peripheral.", icon: <Repeat size={20} /> },
            { title: "Error Detection", desc: "Checks parity and reports transmission errors to the CPU.", icon: <Zap size={20} /> },
          ].map((m, i) => (
            <div key={i} className="bg-white rounded-xl border border-slate-200 p-4 flex gap-3">
              <div className="text-cyan-600 mt-0.5">{m.icon}</div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 mb-1">{m.title}</h4>
                <p className="text-xs text-slate-500">{m.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Programmed I/O (Polling)">
        <InfoCard title="How It Works" type="info">
          The CPU repeatedly checks the status of an I/O device to see if it is ready for data transfer. The CPU sits in a busy loop, wasting cycles until the device is ready.
        </InfoCard>
        <CodeBlock code={`// Programmed I/O — CPU actively polls device status
while (true) {
    status = read_device_status();  // Poll device
    if (status == READY) {
        data = read_device_data();  // Transfer byte
        memory[addr++] = data;
        if (block_complete) break;
    }
    // CPU is busy-waiting — no other work done
}`} language="c" />
        <div className="grid sm:grid-cols-2 gap-4 mt-4">
          <div className="bg-emerald-50 rounded-xl border border-emerald-200 p-4">
            <h4 className="text-sm font-bold text-emerald-700 mb-1">✅ Advantages</h4>
            <ul className="text-xs text-slate-600 space-y-1 mt-2">
              <li>Simple to implement</li>
              <li>No special hardware needed</li>
              <li>Deterministic timing</li>
            </ul>
          </div>
          <div className="bg-pink-50 rounded-xl border border-pink-200 p-4">
            <h4 className="text-sm font-bold text-pink-700 mb-1">❌ Disadvantages</h4>
            <ul className="text-xs text-slate-600 space-y-1 mt-2">
              <li>Wastes CPU cycles (busy-waiting)</li>
              <li>Poor utilization — CPU can not do other work</li>
              <li>Not suitable for high-speed devices</li>
            </ul>
          </div>
        </div>
      </Section>

      <Section title="Interrupt-Driven I/O">
        <InfoCard title="Key Concept" type="tip">
          Instead of polling, the device interrupts the CPU when it is ready. The CPU can execute other tasks until the interrupt occurs, dramatically improving system efficiency.
        </InfoCard>
        <CodeBlock code={`// Interrupt-driven I/O — CPU works until device signals
void main_loop() {
    while (true) {
        do_other_work();      // CPU is productive
    }
}

// Interrupt Service Routine (ISR)
void device_interrupt_handler() {
    data = read_device_data();
    memory[addr++] = data;
    // Return to main loop — CPU does not waste cycles polling
}`} language="c" />
        <Diagram title="Interrupt-Driven I/O Flow">
          <div className="flex items-center gap-2 sm:gap-4 overflow-x-auto py-5 w-full justify-center">
            {[
              { label: "CPU", desc: "Running tasks" },
              { label: "Device Ready", desc: "Sends IRQ" },
              { label: "CPU Saves State", desc: "Context switch" },
              { label: "ISR Executes", desc: "Data transfer" },
              { label: "Resume", desc: "Restore context" },
            ].map((step, i) => (
              <div key={i} className="flex items-center gap-2 sm:gap-4">
                <div className="bg-gradient-to-br from-cyan-500 to-blue-600 text-white w-20 h-20 rounded-xl flex flex-col items-center justify-center shrink-0 text-[10px] font-bold text-center p-2">
                  <div>{step.label}</div>
                  <div className="text-[8px] font-normal mt-1 opacity-90">{step.desc}</div>
                </div>
                {i < 4 && <div className="text-cyan-500 text-xl shrink-0">→</div>}
              </div>
            ))}
          </div>
        </Diagram>
      </Section>

      <Section title="Direct Memory Access (DMA)">
        <InfoCard title="How DMA Works" type="info">
          A dedicated DMA controller handles data transfers directly between I/O devices and memory without CPU involvement for each byte. The CPU sets up the transfer, then the DMA controller manages the data movement, interrupting the CPU only when the entire block is complete.
        </InfoCard>
        <div className="grid sm:grid-cols-3 gap-4">
          {[
            { title: "CPU Initiation", desc: "CPU sets source, destination, and count in DMA registers." },
            { title: "DMA Transfer", desc: "DMA controller moves data byte-by-byte. CPU operates in parallel." },
            { title: "Completion IRQ", desc: "DMA sends interrupt to CPU when block transfer is done." },
          ].map((d, i) => (
            <div key={i} className="bg-gradient-to-br from-cyan-50 to-white border-2 border-cyan-500 rounded-xl p-4 text-center">
              <span className="bg-cyan-600 text-white w-7 h-7 rounded-full inline-flex items-center justify-center font-bold text-xs mb-2">{i + 1}</span>
              <h4 className="text-sm font-bold text-cyan-700 mb-1">{d.title}</h4>
              <p className="text-xs text-slate-500">{d.desc}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section title="I/O Processor / Channel">
        <InfoCard title="I/O Channel" type="info">
          An I/O processor (or channel) is a specialized processor dedicated to handling all I/O operations. It can execute its own instruction set for I/O, freeing the CPU entirely from I/O management. Used in mainframes and high-performance systems.
        </InfoCard>
        <div className="grid sm:grid-cols-2 gap-4">
          {[
            { title: "Selector Channel", desc: "Handles one high-speed device at a time (e.g., disk drive). Transfers data at full device speed." },
            { title: "Multiplexor Channel", desc: "Handles multiple slow devices simultaneously by interleaving byte transfers." },
          ].map((ch, i) => (
            <div key={i} className="bg-white rounded-xl border border-slate-200 p-4">
              <h4 className="text-sm font-bold text-slate-900 mb-1.5">{ch.title}</h4>
              <p className="text-xs text-slate-500">{ch.desc}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Comparison of I/O Methods">
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-cyan-600 text-white">
                <th className="p-3 text-left font-bold">Feature</th>
                <th className="p-3 text-left font-bold">Programmed I/O</th>
                <th className="p-3 text-left font-bold">Interrupt-Driven</th>
                <th className="p-3 text-left font-bold">DMA</th>
              </tr>
            </thead>
            <tbody>
              {[
                { f: "CPU Involvement", p: "Per byte", i: "Per byte", d: "Setup + completion" },
                { f: "CPU Utilization", p: "Poor (busy-wait)", i: "Good", d: "Excellent" },
                { f: "Hardware Required", p: "Minimal", i: "Interrupt controller", d: "DMA controller" },
                { f: "Transfer Rate", p: "Slow", i: "Medium", d: "High" },
                { f: "Best For", p: "Simple, slow devices", i: "Medium-speed devices", d: "High-speed devices" },
                { f: "Complexity", p: "Low", i: "Medium", d: "High" },
                { f: "Overhead per byte", p: "Very high", i: "High", d: "Very low" },
              ].map((row, i) => (
                <tr key={i} className={i % 2 === 0 ? "bg-slate-50" : "bg-white"}>
                  <td className="p-3 font-semibold text-slate-900 border-b border-slate-200">{row.f}</td>
                  <td className="p-3 text-slate-600 border-b border-slate-200">{row.p}</td>
                  <td className="p-3 text-slate-600 border-b border-slate-200">{row.i}</td>
                  <td className="p-3 text-slate-600 border-b border-slate-200">{row.d}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Section title="Code Example: Polling vs Interrupt">
        <InfoCard title="Assembly-Level Comparison" type="tip">
          This simplified example shows the fundamental difference. Polling checks device status in a tight loop. Interrupt-driven I/O lets the CPU work until the device signals readiness.
        </InfoCard>
        <CodeBlock code={`; === Programmed I/O (Polling) ===
POLL:   IN  STATUS, DEVICE    ; Read device status
        AND STATUS, #READY    ; Check ready flag
        BZ   POLL             ; Not ready? Keep polling
        IN  DATA, DEVICE      ; Read data from device
        STORE DATA, MEM_ADDR  ; Store to memory
        ; CPU wasted all cycles polling

; === Interrupt-Driven I/O ===
MAIN:   ; Main program does useful work
        ADD  R1, R2, R3      ; Compute...
        ; Device will interrupt when ready

ISR:    ; Interrupt Service Routine
        IN  DATA, DEVICE      ; Read data
        STORE DATA, MEM_ADDR  ; Store to memory  
        IRET                  ; Return from interrupt
        ; CPU was productive until interrupt`} language="assembly" />
      </Section>

      <Section title="Interview Questions">
        <div className="space-y-3">
          <InterviewQuestion question="What are the three main methods of I/O data transfer?" answer="1) Programmed I/O (polling) — CPU actively checks device status wasting cycles. 2) Interrupt-driven I/O — Device interrupts CPU when ready, improving utilization. 3) DMA — Dedicated controller transfers data directly between device and memory with minimal CPU intervention." />
          <InterviewQuestion question="Explain the difference between an I/O processor and a DMA controller." answer="A DMA controller simply moves data between memory and devices. An I/O processor is a more sophisticated unit that can execute its own instructions, handle multiple devices, perform data formatting, and manage complex I/O protocols — essentially acting as a dedicated I/O CPU." />
          <InterviewQuestion question="Why is programmed I/O inefficient for high-speed devices?" answer="With programmed I/O, the CPU must poll the device for every byte transferred. High-speed devices transfer millions of bytes per second, meaning the CPU would spend all its time polling, leaving no time for actual computation. Interrupt-driven I/O or DMA is essential for such devices." />
          <InterviewQuestion question="What is cycle stealing in DMA?" answer="Cycle stealing is a DMA transfer mode where the DMA controller forces the CPU to pause for one bus cycle to transfer a single byte of data, then returns control to the CPU. This 'steals' individual bus cycles from the CPU, allowing it to continue processing between transfers. It is the most common DMA mode." />
        </div>
      </Section>
    </div>
  );
}
