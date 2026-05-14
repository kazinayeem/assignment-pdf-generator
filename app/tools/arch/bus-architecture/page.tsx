"use client";

import { useState } from "react";
import Link from "next/link";
import { Home, ChevronRight, Zap, Clock, Cpu, Database, Monitor } from "lucide-react";
import { Section, InfoCard, CodeBlock, InterviewQuestion, Diagram } from "../components";

const BUS_TYPES = [
  { bus: "Data Bus", dir: "Bidirectional", width: "8-64 bits", purpose: "Transfers actual data between CPU, memory, and I/O devices", color: "cyan" },
  { bus: "Address Bus", dir: "Unidirectional (CPU → devices)", width: "16-64 bits", purpose: "Carries memory addresses or I/O device identifiers", color: "emerald" },
  { bus: "Control Bus", dir: "Bidirectional", width: "4-10 lines", purpose: "Carries control signals (read/write, interrupt, clock, bus request/grant)", color: "amber" },
];

const ARBITRATION_TYPES = [
  { name: "Daisy Chaining", desc: "Devices are connected in series. Bus grant passes from one device to the next. Priority is determined by position.", pros: "Simple, easy to expand", cons: "Slow for low-priority devices, single point of failure" },
  { name: "Polling", desc: "The arbiter polls each device in order to check if it needs the bus. Priority determined by polling sequence.", pros: "Fair, flexible priority", cons: "Overhead from polling inactive devices" },
  { name: "Independent Request", desc: "Each device has separate request/grant lines to the arbiter. The arbiter uses a priority encoder to select.", pros: "Fast, flexible priority", cons: "More wires, complex arbiter" },
];

const BUS_STANDARDS = [
  { name: "PCI", speed: "133 MB/s (32-bit, 33 MHz)", type: "Parallel", use: "Internal expansion (GPU, NIC, sound cards)", modern: false },
  { name: "PCI Express", speed: "16 GB/s (x16 Gen 4)", type: "Serial (Lane-based)", use: "Modern GPU, SSD, high-speed peripherals", modern: true },
  { name: "USB 3.2", speed: "20 Gbps", type: "Serial", use: "External peripherals (keyboard, mouse, storage)", modern: true },
  { name: "SATA", speed: "6 Gbps", type: "Serial", use: "Storage devices (HDD, SSD)", modern: false },
  { name: "AMBA AXI", speed: "Up to several hundred GB/s", type: "Parallel (on-chip)", use: "SoC interconnect (ARM processors)", modern: true },
  { name: "HyperTransport", speed: "51.2 GB/s", type: "Serial", use: "CPU-to-CPU, CPU-to-chipset (AMD)", modern: false },
];

export default function BusArchitecturePage() {
  const [activeArb, setActiveArb] = useState(0);
  const [busMode, setBusMode] = useState<"sync" | "async">("sync");
  const [expandedBus, setExpandedBus] = useState<number | null>(null);

  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      <div className="flex items-center gap-2 mb-6 text-xs text-slate-500">
        <Link href="/tools/arch" className="text-cyan-600 no-underline flex items-center gap-1.5 hover:text-cyan-800 transition">
          <Home size={16} /> Architecture
        </Link>
        <ChevronRight size={16} />
        <span className="text-slate-900 font-semibold">Bus Architecture</span>
      </div>

      <div className="mb-10">
        <h1 className="text-4xl font-extrabold text-slate-900 mb-3">🚌 Bus Architecture</h1>
        <p className="text-base text-slate-500 leading-relaxed max-w-xl">
          The system bus is the communication backbone of a computer. Explore how data, address, and control signals travel between CPU, memory, and I/O devices through different bus architectures and arbitration schemes.
        </p>
      </div>

      <Section title="The System Bus">
        <InfoCard title="What is a Bus?" type="info">
          A bus is a shared communication pathway that connects multiple subsystems within a computer. It consists of a set of parallel wires or traces on a circuit board, each carrying specific signals. All devices connected to the bus can receive data, but only one device can transmit at a time.
        </InfoCard>
        <Diagram title="System Bus Overview">
          <div className="flex flex-col items-center gap-3 w-full max-w-lg">
            <div className="bg-gradient-to-br from-cyan-500 to-blue-600 text-white p-4 rounded-xl w-full text-center shadow-md">
              <Cpu className="w-6 h-6 mx-auto mb-1" />
              <h4 className="text-sm font-bold">CPU</h4>
              <p className="text-[10px] text-white/80">Master / Initiator</p>
            </div>
            <div className="flex gap-2 w-full justify-center">
              <div className="h-1.5 flex-1 bg-cyan-300 rounded-full max-w-[120px]" />
              <div className="h-1.5 flex-1 bg-emerald-300 rounded-full max-w-[120px]" />
              <div className="h-1.5 flex-1 bg-amber-300 rounded-full max-w-[120px]" />
            </div>
            <p className="text-[10px] text-slate-400 flex gap-4">
              <span className="text-cyan-500">● Data Bus</span>
              <span className="text-emerald-500">● Address Bus</span>
              <span className="text-amber-500">● Control Bus</span>
            </p>
            <div className="grid grid-cols-2 gap-3 w-full">
              <div className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white p-4 rounded-xl text-center shadow-md">
                <Database className="w-5 h-5 mx-auto mb-1" />
                <h4 className="text-sm font-bold">Memory</h4>
                <p className="text-[10px] text-white/80">RAM / ROM</p>
              </div>
              <div className="bg-gradient-to-br from-amber-500 to-orange-600 text-white p-4 rounded-xl text-center shadow-md">
                <Monitor className="w-5 h-5 mx-auto mb-1" />
                <h4 className="text-sm font-bold">I/O Devices</h4>
                <p className="text-[10px] text-white/80">Keyboard, Disk, Display</p>
              </div>
            </div>
          </div>
        </Diagram>
      </Section>

      <Section title="Bus Types">
        <div className="grid sm:grid-cols-3 gap-4 mb-5">
          {BUS_TYPES.map((bus, i) => (
            <div key={i} onClick={() => setExpandedBus(expandedBus === i ? null : i)}
              className={`bg-white rounded-xl border-2 p-4 cursor-pointer transition ${
                expandedBus === i ? "border-cyan-500 shadow-md" : "border-slate-200 hover:border-slate-300"
              }`}>
              <h4 className="text-xs font-bold text-slate-900 mb-1">{bus.bus}</h4>
              <p className="text-[10px] text-slate-400 mb-2">{bus.dir}</p>
              <p className="text-[10px] font-mono text-cyan-600 font-bold mb-1">Width: {bus.width}</p>
              {expandedBus === i && (
                <p className="text-[11px] text-slate-500 mt-2 pt-2 border-t border-slate-100">{bus.purpose}</p>
              )}
            </div>
          ))}
        </div>
      </Section>

      <Section title="Bus Types: Single, Multiple, Hierarchical">
        <InfoCard title="Architecture Choices" type="tip">
          Single-bus is simplest but creates a bottleneck. Multiple buses increase throughput by separating traffic domains. Hierarchical buses (e.g., front-side bus + PCI + SATA in older systems) provide dedicated bandwidth for critical paths.
        </InfoCard>
        <div className="grid sm:grid-cols-3 gap-4 mb-5">
          <div className="bg-white rounded-xl border border-slate-200 p-4">
            <div className="text-center mb-3">
              <div className="inline-flex gap-0.5">
                {[1].map((_, i) => (
                  <div key={i} className="w-16 h-1 bg-cyan-400 rounded-full" />
                ))}
              </div>
            </div>
            <h4 className="text-xs font-bold text-slate-900 mb-2 text-center">Single Bus</h4>
            <ul className="text-[10px] text-slate-500 space-y-1">
              <li>✓ Simplest design, low cost</li>
              <li>✗ All devices share one bus</li>
              <li>✗ Severe bottleneck</li>
              <li>✗ Low throughput</li>
            </ul>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-4">
            <div className="text-center mb-3 flex justify-center gap-1">
              {[1, 2].map((_, i) => (
                <div key={i} className="w-14 h-1 bg-emerald-400 rounded-full" />
              ))}
            </div>
            <h4 className="text-xs font-bold text-slate-900 mb-2 text-center">Multiple Bus</h4>
            <ul className="text-[10px] text-slate-500 space-y-1">
              <li>✓ Separate buses for memory & I/O</li>
              <li>✓ Higher throughput</li>
              <li>✓ Memory and I/O overlap</li>
              <li>✗ More complex, more wires</li>
            </ul>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-4">
            <div className="text-center mb-3">
              <div className="inline-flex gap-1 items-end">
                {[1, 2, 3].map((_, i) => (
                  <div key={i} className="w-10 bg-violet-400 rounded-full"
                    style={{ height: `${6 + i * 4}px` }} />
                ))}
              </div>
            </div>
            <h4 className="text-xs font-bold text-slate-900 mb-2 text-center">Hierarchical Bus</h4>
            <ul className="text-[10px] text-slate-500 space-y-1">
              <li>✓ Bridges connect bus tiers</li>
              <li>✓ Maximum bandwidth</li>
              <li>✓ Used in modern chipsets</li>
              <li>✗ Highest complexity/latency</li>
            </ul>
          </div>
        </div>
      </Section>

      <Section title="Bus Arbitration">
        <InfoCard title="Why Arbitration?" type="info">
          Multiple devices may request the bus simultaneously. The bus arbiter decides which device gets control. The device with control is called the bus master. Arbitration can be centralized (single arbiter) or distributed (devices collaborate).
        </InfoCard>
        <div className="flex gap-2 mb-5 flex-wrap">
          {ARBITRATION_TYPES.map((_, i) => (
            <button key={i} onClick={() => setActiveArb(i)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition cursor-pointer ${
                activeArb === i ? "bg-cyan-600 text-white border-cyan-600" : "bg-white text-slate-600 border-slate-200 hover:border-cyan-400"
              }`}>
              {ARBITRATION_TYPES[i].name}
            </button>
          ))}
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-5 mb-5">
          <h4 className="text-sm font-bold text-slate-900 mb-2">{ARBITRATION_TYPES[activeArb].name}</h4>
          <p className="text-xs text-slate-500 mb-3 leading-relaxed">{ARBITRATION_TYPES[activeArb].desc}</p>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-emerald-50 rounded-lg p-3">
              <p className="text-[10px] font-bold text-emerald-700 mb-1">Advantages</p>
              <p className="text-[11px] text-slate-500">{ARBITRATION_TYPES[activeArb].pros}</p>
            </div>
            <div className="bg-pink-50 rounded-lg p-3">
              <p className="text-[10px] font-bold text-pink-700 mb-1">Disadvantages</p>
              <p className="text-[11px] text-slate-500">{ARBITRATION_TYPES[activeArb].cons}</p>
            </div>
          </div>
        </div>
      </Section>

      <Section title="Synchronous vs Asynchronous Bus">
        <div className="flex gap-3 mb-5">
          <button onClick={() => setBusMode("sync")}
            className={`flex-1 p-3 rounded-xl text-xs font-bold border transition cursor-pointer ${
              busMode === "sync" ? "bg-cyan-600 text-white border-cyan-600" : "bg-white text-slate-600 border-slate-200"
            }`}>
            <Clock className="w-4 h-4 mx-auto mb-1" /> Synchronous
          </button>
          <button onClick={() => setBusMode("async")}
            className={`flex-1 p-3 rounded-xl text-xs font-bold border transition cursor-pointer ${
              busMode === "async" ? "bg-cyan-600 text-white border-cyan-600" : "bg-white text-slate-600 border-slate-200"
            }`}>
            <Zap className="w-4 h-4 mx-auto mb-1" /> Asynchronous
          </button>
        </div>
        {busMode === "sync" ? (
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <h4 className="text-sm font-bold text-slate-900 mb-2">Synchronous Bus</h4>
            <p className="text-xs text-slate-500 leading-relaxed mb-3">All devices operate at a fixed clock rate determined by the bus clock. The clock signal provides a common time reference. Data transfers occur on clock edges.</p>
            <div className="flex items-center gap-1 mb-3 overflow-x-auto py-3">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="flex flex-col items-center">
                  <div className={`w-6 h-8 rounded border ${i % 2 === 0 ? "bg-slate-900" : "bg-slate-200"} transition-all`} />
                  <span className="text-[8px] text-slate-400 mt-1">{i % 2 === 0 ? "↑" : "↓"}</span>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-3 text-[10px]">
              <div className="bg-emerald-50 rounded-lg p-2"><strong className="text-emerald-700">Pros:</strong> Simple design, predictable timing, easy to implement</div>
              <div className="bg-pink-50 rounded-lg p-2"><strong className="text-pink-700">Cons:</strong> All devices must run at same speed, clock skew problems</div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <h4 className="text-sm font-bold text-slate-900 mb-2">Asynchronous Bus</h4>
            <p className="text-xs text-slate-500 leading-relaxed mb-3">No common clock. Devices use handshaking signals (e.g., Request, Acknowledge) to coordinate transfers. Each transfer can occur at the device's own speed.</p>
            <div className="flex items-center gap-4 mb-3 justify-center py-3">
              <div className="bg-cyan-100 border-2 border-cyan-500 rounded-lg px-4 py-2 text-[10px] font-mono text-cyan-700 font-bold">REQ</div>
              <ChevronRight size={18} className="text-slate-300" />
              <div className="bg-amber-100 border-2 border-amber-500 rounded-lg px-4 py-2 text-[10px] font-mono text-amber-700 font-bold">ACK</div>
              <ChevronRight size={18} className="text-slate-300" />
              <div className="bg-emerald-100 border-2 border-emerald-500 rounded-lg px-4 py-2 text-[10px] font-mono text-emerald-700 font-bold">DATA</div>
            </div>
            <div className="grid grid-cols-2 gap-3 text-[10px]">
              <div className="bg-emerald-50 rounded-lg p-2"><strong className="text-emerald-700">Pros:</strong> Flexible speeds, no clock skew, supports mixed-speed devices</div>
              <div className="bg-pink-50 rounded-lg p-2"><strong className="text-pink-700">Cons:</strong> More complex, slower per-transfer (handshake overhead)</div>
            </div>
          </div>
        )}
      </Section>

      <Section title="Bus Standards">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-5">
          {BUS_STANDARDS.map((std, i) => (
            <div key={i} className={`bg-white rounded-xl border-2 p-4 ${
              std.modern ? "border-cyan-200 hover:border-cyan-400" : "border-slate-200 hover:border-slate-300"
            } transition cursor-pointer`}>
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-bold text-slate-900">{std.name}</h4>
                {std.modern && <span className="text-[8px] bg-cyan-100 text-cyan-700 px-1.5 py-0.5 rounded font-bold">Modern</span>}
              </div>
              <p className="text-[10px] text-slate-500"><strong>Speed:</strong> {std.speed}</p>
              <p className="text-[10px] text-slate-500"><strong>Type:</strong> {std.type}</p>
              <p className="text-[10px] text-slate-400 mt-1">{std.use}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Bus Transaction Example (Verilog)">
        <InfoCard title="Simple Bus Protocol" type="info">
          A basic bus transaction: the master asserts address and control signals, waits for the slave to respond, then transfers data. The handshake ensures reliable communication.
        </InfoCard>
        <CodeBlock code={`// Simple synchronous bus interface
module bus_master (
    input  logic        clk, reset_n,
    output logic [31:0] address,
    output logic        read_en, write_en,
    inout  wire  [31:0] data,
    output logic [3:0]  byte_enable,
    input  logic        ready
);
    typedef enum {IDLE, ADDR, DATA, DONE} state_t;
    state_t state;
    logic [31:0] data_out;
    
    assign data = write_en ? data_out : 32'bz;
    
    always_ff @(posedge clk or negedge reset_n) begin
        if (!reset_n) begin
            state <= IDLE;
            read_en <= 0; write_en <= 0;
        end else case (state)
            IDLE: if (start_transfer) begin
                address <= addr;      // Drive address
                byte_enable <= be;    // Byte mask
                read_en <= rd; write_en <= wr;
                state <= ADDR;
            end
            ADDR: state <= DATA;      // Wait for slave decode
            DATA: if (ready) begin    // Slave ready
                data_out <= rd_data;  // Read data
                read_en <= 0; write_en <= 0;
                state <= DONE;
            end
            DONE: state <= IDLE;
        endcase
    end
endmodule`} language="verilog" />
      </Section>

      <Section title="Interview Questions">
        <InterviewQuestion question="Explain the three types of buses in a system bus and their roles."
          answer="The data bus carries actual data between components (bidirectional, typically 32-64 bits wide). The address bus carries memory addresses or I/O port numbers from the CPU to memory/I/O (unidirectional, width determines addressable memory). The control bus carries timing and command signals like Read/Write, Interrupt Request, Bus Request/Grant, and Clock — these coordinate bus access and data flow direction." />
        <InterviewQuestion question="Compare daisy chain, polling, and independent request arbitration."
          answer="Daisy chain: devices are serially connected; grant passes through each device. Simple wiring but high priority device nearest the arbiter dominates. Polling: arbiter sequentially checks each device's request. Fair but wastes time checking inactive devices. Independent request: each device has dedicated request/grant lines. Fastest with flexible priority via priority encoder but uses more wires. Modern PCIe uses a variation of independent request with message-signaled interrupts." />
        <InterviewQuestion question="What are the advantages of a hierarchical bus architecture?"
          answer="Hierarchical buses use bridges to connect multiple bus segments at different speeds. The CPU connects to a high-speed front-side bus or direct memory interface. A bridge connects to slower buses (PCI, SATA, USB). This allows: (1) concurrent transfers on different segments, (2) appropriate bandwidth allocation, (3) electrical isolation, (4) support for mixed-speed devices. Modern chipsets use this extensively." />
        <InterviewQuestion question="How does PCI Express differ from traditional parallel PCI?"
          answer="PCI is a parallel bus (32/64-bit wide, shared medium, half-duplex). PCIe is a serial, point-to-point, packet-switched interconnect using differential pairs (lanes). Each lane is full-duplex. Devices use 1, 4, 8, or 16 lanes (x1, x4, x8, x16). PCIe has lower latency, higher bandwidth (scalable with lane count), hot-plug support, and advanced features like peer-to-peer DMA and ACS. A x16 PCIe 4.0 slot delivers ~32 GB/s vs PCI's 133 MB/s." />
      </Section>
    </div>
  );
}
