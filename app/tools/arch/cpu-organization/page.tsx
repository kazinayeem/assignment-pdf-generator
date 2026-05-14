"use client";

import { useState } from "react";
import Link from "next/link";
import { Home, ChevronRight, Cpu, CircuitBoard, Workflow, Bus } from "lucide-react";
import { Section, InfoCard, CodeBlock, Diagram, InterviewQuestion, AnimatedFlow, CPUStage } from "../components";

const CPU_COMPONENTS = [
  { id: "alu", name: "ALU", icon: "🧮", desc: "Arithmetic Logic Unit — performs arithmetic (add, sub) and logic (and, or, xor) operations on data from registers.", color: "bg-blue-500" },
  { id: "cu", name: "Control Unit", icon: "🎛️", desc: "Decodes instructions and generates control signals that coordinate data movement between registers, ALU, memory, and I/O.", color: "bg-emerald-500" },
  { id: "regs", name: "Register File", icon: "📋", desc: "Fast on-chip storage. Includes general-purpose registers, program counter (PC), instruction register (IR), and status flags.", color: "bg-amber-500" },
  { id: "bus", name: "Bus System", icon: "🔌", desc: "Data, address, and control buses carry information between CPU components and memory. Single vs multi-bus organizations.", color: "bg-purple-500" },
  { id: "mem", name: "Memory Interface", icon: "💾", desc: "Connects CPU to cache and main memory. Handles load/store operations and manages data transfer between registers and memory.", color: "bg-rose-500" },
];

const FETCH_STAGES = [
  { stage: "Fetch", desc: "PC → MAR → Memory → MDR → IR", icon: "📡" },
  { stage: "Decode", desc: "IR[opcode] → Control Unit → Control Signals", icon: "🧩" },
  { stage: "Execute", desc: "ALU performs operation on register operands", icon: "⚙️" },
  { stage: "Memory", desc: "Load/Store: access data memory via MAR/MDR", icon: "💾" },
  { stage: "Write Back", desc: "Result written back to register file", icon: "📝" },
];

const BUS_TYPES = [
  { name: "Single Bus", desc: "All components share one bus. Only one transfer at a time. Simple but slow — every data movement competes for the same bus.", pros: ["Simple design", "Low cost", "Easy to extend"], cons: ["Bus contention", "Low throughput", "One transfer per cycle"] },
  { name: "Multi Bus", desc: "Separate buses for data, address, and control. Some designs split data into local (CPU-internal) and system (memory-I/O) buses.", pros: ["Parallel transfers", "Higher throughput", "Reduced contention"], cons: ["More complex", "Higher cost", "Bridge logic needed"] },
];

const DATAPATH_ITEMS = [
  { id: "pc", label: "PC", x: 10, y: 10 },
  { id: "ir", label: "IR", x: 45, y: 10 },
  { id: "mdr", label: "MDR", x: 80, y: 10 },
  { id: "mar", label: "MAR", x: 10, y: 55 },
  { id: "regs", label: "Reg File", x: 45, y: 55 },
  { id: "alu", label: "ALU", x: 80, y: 55 },
  { id: "ctrl", label: "Control", x: 30, y: 85 },
  { id: "mem", label: "Memory", x: 70, y: 85 },
];

const DATAPATH_CONNECTIONS = [
  { from: "pc", to: "mar", label: "Address" },
  { from: "mar", to: "mem", label: "Read" },
  { from: "mem", to: "mdr", label: "Data In" },
  { from: "mdr", to: "ir", label: "Instr" },
  { from: "ir", to: "ctrl", label: "Opcode" },
  { from: "ctrl", to: "regs", label: "Sel" },
  { from: "regs", to: "alu", label: "Ops" },
  { from: "alu", to: "regs", label: "Result" },
];

export default function CPUOrganizationPage() {
  const [activeComponent, setActiveComponent] = useState<string | null>(null);
  const [activeBus, setActiveBus] = useState(0);
  const [activeDatapath, setActiveDatapath] = useState<string | null>(null);
  const [expandedRTL, setExpandedRTL] = useState(false);

  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      <div className="flex items-center gap-2 mb-6 text-xs text-slate-500">
        <Link href="/tools/arch" className="text-cyan-600 no-underline flex items-center gap-1.5 hover:text-cyan-800 transition">
          <Home size={16} /> Architecture
        </Link>
        <ChevronRight size={16} />
        <span className="text-slate-900 font-semibold">CPU Organization</span>
      </div>

      <div className="mb-10">
        <h1 className="text-4xl font-extrabold text-slate-900 mb-3">⚙️ CPU Organization</h1>
        <p className="text-base text-slate-500 leading-relaxed max-w-xl">
          The internal architecture of a CPU — how the ALU, control unit, registers, and buses work together to fetch, decode, and execute instructions.
        </p>
      </div>

      <Section title="CPU Major Components">
        <InfoCard title="The CPU at a Glance" type="info">
          The Central Processing Unit is the brain of the computer. Its major components are the <strong>ALU</strong> (does the math), the <strong>Control Unit</strong> (directs traffic), the <strong>Register File</strong> (fast temporary storage), and the <strong>Bus System</strong> (connects everything). These components work together in a continuous fetch-decode-execute cycle.
        </InfoCard>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
          {CPU_COMPONENTS.map(comp => (
            <button key={comp.id} onClick={() => setActiveComponent(activeComponent === comp.id ? null : comp.id)}
              className={`rounded-xl p-4 border-2 text-left cursor-pointer transition-all ${
                activeComponent === comp.id
                  ? "bg-gradient-to-br from-cyan-50 to-blue-50 border-cyan-400 shadow-md"
                  : "bg-white border-slate-200 hover:border-slate-300"
              }`}>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">{comp.icon}</span>
                <h3 className="font-bold text-sm text-slate-900">{comp.name}</h3>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">{comp.desc}</p>
              {activeComponent === comp.id && (
                <div className={`mt-3 ${comp.color.replace('bg-', 'bg-').replace('500', '100')} rounded-lg px-3 py-1.5 text-[10px] font-bold ${comp.color.replace('bg-', 'text-')} border ${comp.color.replace('bg-', 'border-').replace('500', '200')}`}>
                  ✓ Selected — click again to dismiss
                </div>
              )}
            </button>
          ))}
        </div>
      </Section>

      <Section title="Internal CPU Block Diagram">
        <Diagram title="CPU Internal Organization">
          <div className="w-full max-w-2xl mx-auto">
            <div className="relative bg-white rounded-xl p-4" style={{ minHeight: 200 }}>
              <svg viewBox="0 0 400 200" className="w-full" style={{ maxHeight: 240 }}>
                {/* ALU */}
                <rect x="260" y="30" width="80" height="50" rx="8" fill={activeComponent === "alu" ? "#e0f2fe" : "#f1f5f9"} stroke={activeComponent === "alu" ? "#06b6d4" : "#94a3b8"} strokeWidth={2} />
                <text x="300" y="60" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#1e293b">ALU</text>
                <text x="300" y="74" textAnchor="middle" fontSize="8" fill="#64748b">Arithmetic & Logic</text>

                {/* Register File */}
                <rect x="260" y="110" width="80" height="50" rx="8" fill={activeComponent === "regs" ? "#fef3c7" : "#f1f5f9"} stroke={activeComponent === "regs" ? "#d97706" : "#94a3b8"} strokeWidth={2} />
                <text x="300" y="140" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#1e293b">Registers</text>
                <text x="300" y="154" textAnchor="middle" fontSize="8" fill="#64748b">PC, IR, R0-R31</text>

                {/* Control Unit */}
                <rect x="50" y="30" width="110" height="50" rx="8" fill={activeComponent === "cu" ? "#d1fae5" : "#f1f5f9"} stroke={activeComponent === "cu" ? "#059669" : "#94a3b8"} strokeWidth={2} />
                <text x="105" y="54" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#1e293b">Control Unit</text>
                <text x="105" y="68" textAnchor="middle" fontSize="8" fill="#64748b">Decode + Control Signals</text>

                {/* Bus */}
                <rect x="50" y="110" width="110" height="50" rx="8" fill={activeComponent === "bus" ? "#ede9fe" : "#f1f5f9"} stroke={activeComponent === "bus" ? "#7c3aed" : "#94a3b8"} strokeWidth={2} />
                <text x="105" y="134" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#1e293b">Bus System</text>
                <text x="105" y="148" textAnchor="middle" fontSize="8" fill="#64748b">Internal Data Bus</text>

                {/* Connections */}
                <line x1="160" y1="55" x2="260" y2="55" stroke={activeComponent && ["cu", "alu"].includes(activeComponent) ? "#06b6d4" : "#cbd5e1"} strokeWidth={2} strokeDasharray="4,2" />
                <text x="210" y="50" textAnchor="middle" fontSize="7" fill="#94a3b8">Control</text>

                <line x1="160" y1="135" x2="260" y2="135" stroke={activeComponent && ["bus", "regs"].includes(activeComponent) ? "#7c3aed" : "#cbd5e1"} strokeWidth={2} />
                <text x="210" y="130" textAnchor="middle" fontSize="7" fill="#94a3b8">Data</text>

                <line x1="300" y1="80" x2="300" y2="110" stroke={activeComponent && ["alu", "regs"].includes(activeComponent) ? "#d97706" : "#cbd5e1"} strokeWidth={2} />
                <text x="315" y="97" textAnchor="middle" fontSize="7" fill="#94a3b8">Result</text>

                <line x1="50" y1="80" x2="50" y2="110" stroke={activeComponent === "cu" ? "#059669" : "#cbd5e1"} strokeWidth={2} />
                <text x="35" y="97" textAnchor="middle" fontSize="7" fill="#94a3b8">Ctrl Bus</text>

                {/* Memory Interface */}
                <rect x="360" y="60" width="35" height="80" rx="6" fill={activeComponent === "mem" ? "#ffe4e6" : "#f1f5f9"} stroke={activeComponent === "mem" ? "#e11d48" : "#94a3b8"} strokeWidth={1.5} />
                <text x="377" y="104" textAnchor="middle" fontSize="8" fontWeight="bold" fill="#1e293b" transform="rotate(90, 377, 104)">Memory I/F</text>
              </svg>
            </div>
            <p className="text-[10px] text-slate-400 mt-2 text-center">Click a component above to highlight it in the diagram</p>
          </div>
        </Diagram>
      </Section>

      <Section title="Data Path: How Data Flows">
        <InfoCard title="Data Path Definition" type="info">
          The data path is the collection of functional units (registers, ALU, multiplexers, buses) and the paths data travels between them. Every instruction follows a specific data path through these components, controlled by the control unit's signals.
        </InfoCard>

        <Diagram title="Interactive Data Path Visualizer">
          <p className="text-xs text-slate-500 mb-4 text-center">Click on a data path element to trace the flow</p>
          <div className="w-full max-w-2xl mx-auto">
            <svg viewBox="0 0 380 200" className="w-full" style={{ maxHeight: 220 }}>
              {DATAPATH_CONNECTIONS.map((conn, i) => {
                const fromItem = DATAPATH_ITEMS.find(d => d.id === conn.from)!;
                const toItem = DATAPATH_ITEMS.find(d => d.id === conn.to)!;
                const isActive = activeDatapath === conn.from || activeDatapath === conn.to;
                return (
                  <g key={i}>
                    <line
                      x1={fromItem.x * 3.6 + 25} y1={fromItem.y * 1.8 + 12}
                      x2={toItem.x * 3.2 + 15} y2={toItem.y * 1.8 + 12}
                      stroke={isActive ? "#06b6d4" : "#cbd5e1"}
                      strokeWidth={isActive ? 3 : 1.5}
                      strokeDasharray={isActive ? "none" : "3,2"}
                    />
                    <text
                      x={(fromItem.x * 3.6 + toItem.x * 3.2 + 40) / 2}
                      y={(fromItem.y * 1.8 + toItem.y * 1.8 + 24) / 2 - 5}
                      textAnchor="middle" fontSize="6" fill={isActive ? "#0e7490" : "#94a3b8"}
                      fontWeight={isActive ? "bold" : "normal"}
                    >
                      {conn.label}
                    </text>
                  </g>
                );
              })}
              {DATAPATH_ITEMS.map(item => {
                const isHighlighted = activeDatapath === item.id;
                const connected = DATAPATH_CONNECTIONS.some(c => c.from === item.id || c.to === item.id);
                const isActiveConn = connected && (activeDatapath === item.id || DATAPATH_CONNECTIONS.some(c => (c.from === activeDatapath && c.to === item.id) || (c.to === activeDatapath && c.from === item.id)));
                return (
                  <g key={item.id} onClick={() => setActiveDatapath(activeDatapath === item.id ? null : item.id)} style={{ cursor: "pointer" }}>
                    <rect
                      x={item.x * 3.6} y={item.y * 1.8}
                      width={item.id === "mem" ? 50 : item.id === "ctrl" ? 60 : 45}
                      height={22} rx={6}
                      fill={isHighlighted ? "#e0f2fe" : isActiveConn ? "#fef3c7" : "#f8fafc"}
                      stroke={isHighlighted ? "#06b6d4" : isActiveConn ? "#d97706" : "#e2e8f0"}
                      strokeWidth={isHighlighted || isActiveConn ? 2.5 : 1.5}
                    />
                    <text x={item.x * 3.6 + (item.id === "mem" ? 25 : item.id === "ctrl" ? 30 : 22.5)}
                          y={item.y * 1.8 + 14}
                          textAnchor="middle" fontSize="9" fontWeight="bold" fill="#1e293b">
                      {item.label}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
          {activeDatapath && (
            <div className="mt-4 bg-cyan-50 border border-cyan-200 rounded-xl p-3 text-center">
              <span className="text-xs font-bold text-cyan-700">Highlighted: {activeDatapath.toUpperCase()}</span>
              <p className="text-[10px] text-slate-500 mt-1">
                {DATAPATH_CONNECTIONS.filter(c => c.from === activeDatapath || c.to === activeDatapath).map(c =>
                  `${c.from.toUpperCase()} → ${c.to.toUpperCase()} (${c.label})`
                ).join(" | ") || "Click a connected component to see data flow paths"}
              </p>
            </div>
          )}
        </Diagram>
      </Section>

      <Section title="CPU Operation: Fetch-Decode-Execute Cycle">
        <div className="grid sm:grid-cols-5 gap-2 mb-5">
          {FETCH_STAGES.map((s, i) => (
            <CPUStage key={s.stage} stage={s.stage} desc={s.desc} icon={s.icon} />
          ))}
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5 mb-4 shadow-sm">
          <h4 className="font-bold text-sm text-slate-900 mb-3">Step-by-Step: ADD R1, R2, R3</h4>
          <div className="space-y-2">
            {[
              { step: "1. Fetch", desc: "PC → MAR. Memory read. MDR → IR. PC = PC + 4." },
              { step: "2. Decode", desc: "IR[31:26] → opcode. Control unit generates ALU control signals. IR[25:21] = R2, IR[20:16] = R3, IR[15:11] = R1." },
              { step: "3. Execute", desc: "Register file outputs R2, R3 values to ALU inputs. ALU adds them. Result appears on ALU output." },
              { step: "4. Memory", desc: "No memory access needed for ADD (ALU operation). Stage is idle/write-through." },
              { step: "5. Write Back", desc: "ALU output written to register file at address R1." },
            ].map(item => (
              <div key={item.step} className="flex items-start gap-3 bg-slate-50 rounded-xl p-3">
                <div className="bg-cyan-500 text-white w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-bold shrink-0">{item.step.split(" ")[1]}</div>
                <div>
                  <h5 className="text-xs font-bold text-slate-900">{item.step}</h5>
                  <p className="text-[11px] text-slate-500 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <AnimatedFlow steps={[
          { label: "Fetch", desc: "Get instruction" },
          { label: "Decode", desc: "Interpret opcode" },
          { label: "Execute", desc: "ALU operation" },
          { label: "Memory", desc: "Data access" },
          { label: "Write", desc: "Store result" },
        ]} />
      </Section>

      <Section title="Single Bus vs Multi-Bus Organization">
        <div className="grid sm:grid-cols-2 gap-4 mb-4">
          {BUS_TYPES.map((bt, i) => (
            <button key={bt.name} onClick={() => setActiveBus(i)}
              className={`rounded-xl p-5 border-2 text-left cursor-pointer transition-all ${
                activeBus === i ? "bg-gradient-to-br from-cyan-50 to-blue-50 border-cyan-400 shadow-md" : "bg-white border-slate-200 hover:border-slate-300"
              }`}>
              <div className="flex items-center gap-2 mb-3">
                {i === 0 ? <Bus size={18} className="text-slate-600" /> : <Workflow size={18} className="text-cyan-600" />}
                <h4 className="font-bold text-sm text-slate-900">{bt.name}</h4>
              </div>
              <p className="text-xs text-slate-500 mb-3 leading-relaxed">{bt.desc}</p>
              <div className="grid grid-cols-2 gap-2 text-[10px]">
                <div><span className="text-emerald-600 font-bold">Pros:</span> {bt.pros.join(", ")}</div>
                <div><span className="text-red-500 font-bold">Cons:</span> {bt.cons.join(", ")}</div>
              </div>
            </button>
          ))}
        </div>

        <Diagram title={activeBus === 0 ? "Single Bus Organization" : "Multi-Bus Organization"}>
          <div className="w-full max-w-lg mx-auto">
            <svg viewBox="0 0 300 120" className="w-full">
              {activeBus === 0 ? (
                <>
                  <rect x="10" y="10" width="55" height="30" rx="5" fill="#e0f2fe" stroke="#06b6d4" strokeWidth="1.5" />
                  <text x="37" y="29" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#1e293b">CPU</text>
                  <rect x="10" y="50" width="55" height="30" rx="5" fill="#fef3c7" stroke="#d97706" strokeWidth="1.5" />
                  <text x="37" y="69" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#1e293b">Memory</text>
                  <rect x="10" y="90" width="55" height="25" rx="5" fill="#ede9fe" stroke="#7c3aed" strokeWidth="1.5" />
                  <text x="37" y="105" textAnchor="middle" fontSize="8" fontWeight="bold" fill="#1e293b">I/O</text>
                  <line x1="65" y1="25" x2="280" y2="25" stroke="#64748b" strokeWidth="3" />
                  <line x1="65" y1="65" x2="280" y2="65" stroke="#64748b" strokeWidth="3" />
                  <line x1="65" y1="102" x2="280" y2="102" stroke="#64748b" strokeWidth="3" />
                  <text x="270" y="20" fontSize="7" fill="#64748b">Data</text>
                  <text x="270" y="60" fontSize="7" fill="#64748b">Address</text>
                  <text x="270" y="97" fontSize="7" fill="#64748b">Control</text>
                </>
              ) : (
                <>
                  <rect x="10" y="15" width="70" height="30" rx="5" fill="#e0f2fe" stroke="#06b6d4" strokeWidth="1.5" />
                  <text x="45" y="34" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#1e293b">CPU</text>
                  <rect x="120" y="15" width="70" height="30" rx="5" fill="#d1fae5" stroke="#059669" strokeWidth="1.5" />
                  <text x="155" y="34" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#1e293b">Cache</text>
                  <line x1="80" y1="30" x2="120" y2="30" stroke="#06b6d4" strokeWidth="3" />
                  <text x="100" y="25" textAnchor="middle" fontSize="7" fill="#06b6d4">Local Bus</text>
                  <rect x="10" y="70" width="70" height="25" rx="5" fill="#fef3c7" stroke="#d97706" strokeWidth="1.5" />
                  <text x="45" y="86" textAnchor="middle" fontSize="8" fontWeight="bold" fill="#1e293b">Main Memory</text>
                  <rect x="120" y="70" width="70" height="25" rx="5" fill="#ede9fe" stroke="#7c3aed" strokeWidth="1.5" />
                  <text x="155" y="86" textAnchor="middle" fontSize="8" fontWeight="bold" fill="#1e293b">I/O Devices</text>
                  <line x1="80" y1="45" x2="200" y2="82" stroke="#64748b" strokeWidth="2.5" strokeDasharray="4,2" />
                  <text x="145" y="55" textAnchor="middle" fontSize="7" fill="#64748b">System Bus (bridge)</text>
                </>
              )}
            </svg>
          </div>
        </Diagram>
      </Section>

      <Section title="Register Transfer Language (RTL)">
        <InfoCard title="What is RTL?" type="info">
          Register Transfer Language describes CPU operations at the register-transfer level — specifying how data moves between registers and functional units cycle by cycle. RTL is the bridge between the architectural description and the actual hardware implementation.
        </InfoCard>

        <button onClick={() => setExpandedRTL(!expandedRTL)}
          className="w-full flex items-center justify-between bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-4 border border-blue-200 cursor-pointer mb-3">
          <span className="font-bold text-sm text-slate-900">📖 RTL Notation Guide</span>
          <span className="text-xs text-cyan-600">{expandedRTL ? "▲ Hide" : "▼ Show"}</span>
        </button>

        {expandedRTL && (
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm mb-4">
            <div className="grid sm:grid-cols-2 gap-3 mb-4">
              {[
                { notation: "R1 ← R2 + R3", meaning: "Add R2 and R3, store in R1" },
                { notation: "MAR ← PC", meaning: "Transfer PC address to MAR" },
                { notation: "MDR ← M[MAR]", meaning: "Read memory at MAR into MDR" },
                { notation: "IR ← MDR", meaning: "Transfer instruction to IR" },
                { notation: "PC ← PC + 4", meaning: "Increment PC by 4 (next instruction)" },
                { notation: "R1 ← MDR", meaning: "Load MDR value into register R1" },
              ].map(item => (
                <div key={item.notation} className="bg-slate-50 rounded-xl p-3 border border-slate-200">
                  <code className="text-xs font-mono font-bold text-cyan-700">{item.notation}</code>
                  <p className="text-[10px] text-slate-500 mt-1">{item.meaning}</p>
                </div>
              ))}
            </div>
            <InfoCard title="RTL for ADD Instruction" type="tip">
              The complete RTL sequence for <strong>ADD R1, R2, R3</strong> across 5 cycles: <br />
              <strong>T1:</strong> MAR ← PC, PC ← PC + 4 <br />
              <strong>T2:</strong> MDR ← M[MAR], IR ← MDR <br />
              <strong>T3:</strong> A ← R2, B ← R3 <br />
              <strong>T4:</strong> ALUOut ← A + B <br />
              <strong>T5:</strong> R1 ← ALUOut
            </InfoCard>
          </div>
        )}

        <CodeBlock code={`// Register Transfer Level description of ADD instruction
// Notation: [register] ← [source operation]

// FETCH CYCLE
T1: MAR ← PC          // Send PC address to memory
    PC ← PC + 4       // Prepare for next instruction
T2: MDR ← M[MAR]      // Read instruction from memory
    IR ← MDR          // Load instruction into IR

// DECODE CYCLE  
T3: IR[opcode] → Control Unit
    A ← Reg[IR[25:21]]  // Read R2 into A register
    B ← Reg[IR[20:16]]  // Read R3 into B register

// EXECUTE CYCLE
T4: ALUOut ← A + B     // ALU performs addition

// WRITE BACK CYCLE
T5: Reg[IR[15:11]] ← ALUOut  // Store result to R1`} language="plaintext" />
      </Section>

      <Section title="Real-World Example: Intel & AMD CPU Organization">
        <div className="grid sm:grid-cols-2 gap-4 mb-4">
          <div className="bg-gradient-to-br from-blue-50 to-sky-50 rounded-xl border border-blue-200 p-5">
            <div className="flex items-center gap-2 mb-3">
              <Cpu size={18} className="text-blue-600" />
              <h4 className="font-bold text-sm text-slate-900">Intel Core (x86-64)</h4>
            </div>
            <ul className="text-xs text-slate-600 space-y-2">
              <li className="flex items-start gap-2"><span className="text-blue-500 font-bold">•</span> Complex control unit: microcode ROM for x86 decode → μops</li>
              <li className="flex items-start gap-2"><span className="text-blue-500 font-bold">•</span> Deep out-of-order execution engine with reorder buffer (ROB)</li>
              <li className="flex items-start gap-2"><span className="text-blue-500 font-bold">•</span> Split L1 cache: 32KB instruction + 32KB data (8-way associative)</li>
              <li className="flex items-start gap-2"><span className="text-blue-500 font-bold">•</span> Ring bus interconnect between cores and LLC (last-level cache)</li>
              <li className="flex items-start gap-2"><span className="text-blue-500 font-bold">•</span> Multiple ALUs: 4 integer + 2/3 vector (AVX-512) per core</li>
            </ul>
          </div>
          <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl border border-emerald-200 p-5">
            <div className="flex items-center gap-2 mb-3">
              <CircuitBoard size={18} className="text-emerald-600" />
              <h4 className="font-bold text-sm text-slate-900">AMD Ryzen (Zen)</h4>
            </div>
            <ul className="text-xs text-slate-600 space-y-2">
              <li className="flex items-start gap-2"><span className="text-emerald-500 font-bold">•</span> CCX (Core Complex): 4 cores sharing 16MB L3 cache</li>
              <li className="flex items-start gap-2"><span className="text-emerald-500 font-bold">•</span> Unified L2 cache (512KB per core), prefetch units</li>
              <li className="flex items-start gap-2"><span className="text-emerald-500 font-bold">•</span> Infinity Fabric interconnect between CCX complexes</li>
              <li className="flex items-start gap-2"><span className="text-emerald-500 font-bold">•</span> SMT (Simultaneous Multithreading): 2 threads per core</li>
              <li className="flex items-start gap-2"><span className="text-emerald-500 font-bold">•</span> 4-wide instruction decode, 6 ALU dispatch per cycle</li>
            </ul>
          </div>
        </div>
        <InfoCard title="Key Difference" type="warning">
          Intel uses a <strong>ring bus</strong> topology connecting cores to shared L3 cache, while AMD's Zen uses <strong>Infinity Fabric</strong> — a scalable, distributed interconnect that allows CCX complexes to scale to 64+ cores without ring bus bandwidth limitations.
        </InfoCard>
      </Section>

      <Section title="Interview Questions">
        <InterviewQuestion question="Explain the major components of a CPU and their roles." answer="The CPU has four major components: (1) ALU — performs arithmetic and logic operations on data from registers. (2) Control Unit — decodes instructions and generates control signals that direct data flow between all components. (3) Register File — fast temporary storage including general-purpose registers, PC (program counter), and IR (instruction register). (4) Bus System — carries data, addresses, and control signals between CPU, memory, and I/O." />
        <InterviewQuestion question="What is the fetch-decode-execute cycle? Describe each stage in detail." answer="The CPU continuously repeats: (1) Fetch — PC supplies address to MAR, memory read brings instruction to MDR, then IR. PC increments by 4. (2) Decode — control unit interprets IR opcode, generates signals, selects register operands. (3) Execute — ALU performs the operation (add, sub, and, etc.) on register values. (4) Memory — for load/store instructions, access data memory via MAR/MDR. (5) Write Back — ALU result or loaded data written to register file." />
        <InterviewQuestion question="Compare single-bus and multi-bus CPU organization." answer="Single-bus: all components share one bus for data, address, and control. Only one transfer per cycle — simple and cheap but causes bus contention and limits throughput. Multi-bus: separate buses for data/address/control, often with local (CPU-cache) and system (memory-I/O) buses. Allows parallel transfers and higher throughput at the cost of more complex hardware and bridge logic between bus domains." />
        <InterviewQuestion question="What is Register Transfer Language (RTL) and why is it important?" answer="RTL describes CPU behavior at the register-transfer level — specifying data movements between registers and functional units each clock cycle. It bridges the gap between the instruction set architecture and the hardware implementation. RTL notation like 'MAR ← PC' or 'R1 ← R2 + R3' precisely describes operations and timing, forming the basis for hardware synthesis and digital design." />
      </Section>
    </div>
  );
}
