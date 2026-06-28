"use client";

import Link from "next/link";
import { Home, ChevronRight, Cpu, Zap } from "lucide-react";
import { Section, InfoCard, CodeBlock, Diagram, AnimatedFlow, InterviewQuestion } from "../components";

export default function DMAPage() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      <div className="flex items-center gap-2 mb-6 text-xs text-slate-500">
        <Link href="/tools/arch" className="text-cyan-600 no-underline flex items-center gap-1.5 hover:text-cyan-800 transition">
          <Home size={16} /> Architecture
        </Link>
        <ChevronRight size={16} />
        <span className="text-slate-900 font-semibold">DMA</span>
      </div>

      <div className="mb-10">
        <h1 className="text-4xl font-extrabold text-slate-900 mb-3">🔄 Direct Memory Access (DMA)</h1>
        <p className="text-base text-slate-500 leading-relaxed max-w-xl">
          DMA is a hardware mechanism that allows peripheral devices to transfer data directly to and from main memory without involving the CPU, dramatically improving system throughput.
        </p>
      </div>

      <Section title="What is DMA?">
        <InfoCard title="Definition" type="info">
          Direct Memory Access (DMA) is a feature that enables I/O devices to access memory directly, bypassing the CPU. A dedicated DMA controller manages the data transfer, freeing the CPU to execute other tasks. This is essential for high-bandwidth devices like disk drives, graphics cards, and network interfaces.
        </InfoCard>
        <div className="grid sm:grid-cols-2 gap-4">
          {[
            { title: "CPU Overhead Reduction", desc: "Without DMA, CPU copies every byte between device and memory. With DMA, CPU only sets up the transfer.", icon: <Cpu size={20} /> },
            { title: "Parallel Operation", desc: "While DMA transfers data, CPU can continue executing instructions, enabling true parallelism.", icon: <Zap size={20} /> },
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

      <Section title="DMA Controller Functionality">
        <InfoCard title="DMA Controller Components" type="info">
          The DMA controller acts as a bus master that can read from and write to memory independently. It contains registers for source address, destination address, transfer count, control flags, and status.
        </InfoCard>
        <div className="grid sm:grid-cols-2 gap-4">
          {[
            { reg: "Source Address Register", desc: "Points to the memory location where data is read from (for memory-to-I/O transfers)." },
            { reg: "Destination Address Register", desc: "Points to the memory location where data will be written (for I/O-to-memory transfers)." },
            { reg: "Transfer Count Register", desc: "Number of bytes/words to transfer. Decremented after each transfer. Reaches zero = transfer complete." },
            { reg: "Control Register", desc: "Configures direction (read/write), transfer mode (burst/cycle steal), and enables interrupts on completion." },
          ].map((r, i) => (
            <div key={i} className="bg-white rounded-xl border border-slate-200 p-4">
              <h4 className="text-sm font-bold text-slate-900 mb-1.5">{r.reg}</h4>
              <p className="text-xs text-slate-500">{r.desc}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section title="DMA Transfer Modes">
        <div className="grid sm:grid-cols-3 gap-4">
          {[
            {
              title: "Burst Mode",
              desc: "DMA controller takes control of the bus and transfers the entire block without releasing it. Fast but blocks the CPU for the entire duration.",
              pros: "Highest transfer rate",
              cons: "CPU is halted for whole transfer",
            },
            {
              title: "Cycle Stealing",
              desc: "DMA transfers one byte/word at a time, then releases the bus. Alternates bus access between CPU and DMA.",
              pros: "CPU stays responsive",
              cons: "Slower transfer, more overhead",
            },
            {
              title: "Transparent Mode",
              desc: "DMA transfers only when CPU is not using the bus (e.g., during CPU internal operations). No CPU slowdown at all.",
              pros: "Zero CPU overhead",
              cons: "Transfer rate depends on CPU idle time",
            },
          ].map((m, i) => (
            <div key={i} className="bg-white rounded-xl border border-slate-200 p-4">
              <h4 className="text-sm font-bold text-slate-900 mb-2">{m.title}</h4>
              <p className="text-xs text-slate-500 mb-3">{m.desc}</p>
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-semibold text-emerald-600">Pros: {m.pros}</span>
                <span className="text-[10px] font-semibold text-pink-600">Cons: {m.cons}</span>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section title="DMA vs Programmed I/O Performance">
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-cyan-600 text-white">
                <th className="p-3 text-left font-bold">Metric</th>
                <th className="p-3 text-left font-bold">Programmed I/O</th>
                <th className="p-3 text-left font-bold">DMA (Cycle Steal)</th>
                <th className="p-3 text-left font-bold">DMA (Burst)</th>
              </tr>
            </thead>
            <tbody>
              {[
                { m: "CPU cycles per byte", p: "10-100", dcs: "1-2 (setup amortized)", db: "0 (total block)" },
                { m: "CPU utilization during 1 MB transfer", p: "100%", dcs: "~5%", db: "0%" },
                { m: "Transfer time (1 MB, 100 MHz bus)", p: "~10 ms", dcs: "~0.5 ms", db: "~0.1 ms" },
                { m: "System throughput impact", p: "Severe", dcs: "Minimal", db: "Moderate" },
                { m: "Best for", p: "Byte-at-a-time devices", dcs: "Medium-speed, always-on", db: "High-speed, block devices" },
              ].map((row, i) => (
                <tr key={i} className={i % 2 === 0 ? "bg-slate-50" : "bg-white"}>
                  <td className="p-3 font-semibold text-slate-900 border-b border-slate-200">{row.m}</td>
                  <td className="p-3 text-slate-600 border-b border-slate-200">{row.p}</td>
                  <td className="p-3 text-slate-600 border-b border-slate-200">{row.dcs}</td>
                  <td className="p-3 text-slate-600 border-b border-slate-200">{row.db}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Section title="DMA Channels and Arbitration">
        <InfoCard title="DMA Channels" type="info">
          A DMA controller typically supports multiple channels, each capable of managing an independent data transfer. Each channel has its own set of registers (source, destination, count, control). Arbitration logic decides which channel gets bus access when multiple channels request simultaneously.
        </InfoCard>
        <div className="grid sm:grid-cols-2 gap-4">
          {[
            { title: "Daisy Chaining", desc: "Devices are connected in series. Bus grant passes from one device to the next. Simple but can be unfair to devices farther from the CPU." },
            { title: "Independent Request", desc: "Each device has dedicated request/grant lines to the arbiter. More complex but allows programmable priority." },
          ].map((a, i) => (
            <div key={i} className="bg-white rounded-xl border border-slate-200 p-4">
              <h4 className="text-sm font-bold text-slate-900 mb-1.5">{a.title}</h4>
              <p className="text-xs text-slate-500">{a.desc}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Bus Mastering">
        <InfoCard title="What is Bus Mastering?" type="tip">
          A bus master is a device that can initiate and control bus transactions. The CPU is the default bus master, but the DMA controller can become a bus master to perform transfers. Modern high-performance devices (like NVMe SSDs and GPUs) can act as bus masters themselves.
        </InfoCard>
        <Diagram title="CPU vs DMA Data Path">
          <div className="w-full max-w-2xl">
            <div className="flex flex-col gap-4">
              <div className="bg-blue-50 border-2 border-blue-500 rounded-xl p-4">
                <div className="text-xs font-bold text-blue-700 mb-2">Without DMA (Programmed I/O)</div>
                <div className="flex items-center gap-2 text-[10px]">
                  <span className="bg-blue-600 text-white px-3 py-1.5 rounded-lg font-bold">CPU</span>
                  <span className="text-slate-400">→ reads →</span>
                  <span className="bg-amber-600 text-white px-3 py-1.5 rounded-lg font-bold">Device</span>
                  <span className="text-slate-400">→ writes →</span>
                  <span className="bg-emerald-600 text-white px-3 py-1.5 rounded-lg font-bold">Memory</span>
                </div>
                <div className="text-[10px] text-slate-500 mt-1">✗ CPU copies every byte — cannot do other work</div>
              </div>
              <div className="bg-emerald-50 border-2 border-emerald-500 rounded-xl p-4">
                <div className="text-xs font-bold text-emerald-700 mb-2">With DMA</div>
                <div className="flex items-center gap-2 text-[10px]">
                  <span className="bg-blue-600 text-white px-3 py-1.5 rounded-lg font-bold">CPU</span>
                  <span className="text-slate-400">→ setup →</span>
                  <span className="bg-purple-600 text-white px-3 py-1.5 rounded-lg font-bold">DMA Ctrl</span>
                  <span className="text-slate-400">↔ reads/writes ↔</span>
                  <span className="bg-emerald-600 text-white px-3 py-1.5 rounded-lg font-bold">Memory</span>
                </div>
                <div className="text-[10px] text-slate-500 mt-1">✓ CPU sets up transfer, then works on other tasks in parallel</div>
              </div>
            </div>
          </div>
        </Diagram>
      </Section>

      <Section title="Code Example: DMA Transfer Concept">
        <CodeBlock code={`#include <stdint.h>

// DMA controller registers (memory-mapped)
#define DMA_SRC    ((volatile uint32_t*)0xFFFFF000)
#define DMA_DST    ((volatile uint32_t*)0xFFFFF004)
#define DMA_CNT    ((volatile uint32_t*)0xFFFFF008)
#define DMA_CTRL   ((volatile uint32_t*)0xFFFFF00C)
#define DMA_STATUS ((volatile uint32_t*)0xFFFFF010)

#define DMA_START  0x1
#define DMA_READ   0x2   // Device → Memory
#define DMA_WRITE  0x4   // Memory → Device
#define DMA_IRQ_EN 0x8

// DMA transfer setup
void dma_transfer(void *src, void *dst, uint32_t count, int dir) {
    *DMA_SRC = (uint32_t)src;
    *DMA_DST = (uint32_t)dst;
    *DMA_CNT = count;
    *DMA_CTRL = dir | DMA_IRQ_EN | DMA_START;
}

// Without DMA: CPU copies every byte (slow)
void programmed_io_transfer(uint8_t *buf, uint32_t count) {
    for (uint32_t i = 0; i < count; i++) {
        while (!(inb(DEV_STATUS) & READY));  // Poll
        buf[i] = inb(DEV_DATA);              // Read byte
        // CPU stalls on every byte — terrible for large transfers
    }
}`} language="c" />
      </Section>

      <Section title="DMA Transfer Flow">
        <AnimatedFlow steps={[
          { label: "CPU Setup", desc: "Configures DMA registers" },
          { label: "DMA Grant", desc: "Arbiter grants bus to DMA" },
          { label: "Data Transfer", desc: "DMA moves data blocks" },
          { label: "Count Done", desc: "All bytes transferred" },
          { label: "DMA IRQ", desc: "DMA interrupts CPU" },
        ]} />
        <InfoCard title="Real-World DMA Example" type="tip">
          A Gigabit Ethernet card receiving data: The NIC buffers a packet, asserts DMA request. The DMA controller transfers the packet (up to 1500 bytes) directly to main memory. The CPU is only interrupted once per packet (not 1500 times) and just processes the data already in memory.
        </InfoCard>
      </Section>

      <Section title="Interview Questions">
        <div className="space-y-3">
          <InterviewQuestion question="What is the difference between DMA and programmed I/O?" answer="In programmed I/O, the CPU is involved in every byte transferred — it reads from the device and writes to memory. In DMA, a dedicated controller handles transfers directly between device and memory. DMA requires setup overhead but transfers each byte without CPU involvement, making it vastly more efficient for large or high-speed transfers." />
          <InterviewQuestion question="Explain the three DMA transfer modes with examples." answer="1) Burst mode: DMA transfers entire block without releasing the bus — example: disk controller reading a full sector. 2) Cycle stealing: DMA transfers one word then releases the bus — example: sound card continuously streaming audio. 3) Transparent mode: DMA transfers only when CPU is using internal buses — example: background memory refresh." />
          <InterviewQuestion question="What happens during a DMA cycle steal?" answer="The DMA controller requests bus access via HOLD signal. The CPU finishes the current bus cycle, asserts HLDA (Hold Acknowledge), and tri-states its bus lines. The DMA controller performs one bus transfer (read device → write memory, or vice versa), then deasserts HOLD. The CPU resumes. This steals one bus cycle from the CPU." />
          <InterviewQuestion question="How does scatter-gather DMA work?" answer="Scatter-gather DMA uses a list of buffer descriptors (source, destination, length tuples) in memory. The DMA controller processes each descriptor sequentially, automatically chaining transfers across multiple non-contiguous buffers. This eliminates the need for the CPU to copy data into a single contiguous buffer. Widely used in network adapters and storage controllers." />
        </div>
      </Section>
    </div>
  );
}
