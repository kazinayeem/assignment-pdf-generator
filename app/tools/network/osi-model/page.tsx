import { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, CheckCircle2, AlertCircle, BookOpen } from "lucide-react";

export const metadata: Metadata = { title: "OSI Model | Computer Networks" };

const LAYERS = [
  {
    num: 7, name: "Application", color: "#3b82f6", bg: "#eff6ff", border: "#bfdbfe",
    protocols: ["HTTP", "HTTPS", "FTP", "SMTP", "DNS", "DHCP", "Telnet", "SSH"],
    desc: "Provides network services directly to end-user applications. This is the layer users interact with.",
    devices: ["Web browsers", "Email clients", "FTP clients"],
    pdu: "Data",
    functions: ["File transfer", "Email", "Web browsing", "Remote login", "Network management"],
    mnemonic: "All",
  },
  {
    num: 6, name: "Presentation", color: "#8b5cf6", bg: "#f5f3ff", border: "#ddd6fe",
    protocols: ["SSL/TLS", "JPEG", "MPEG", "ASCII", "EBCDIC", "GIF"],
    desc: "Translates data between application and network formats. Handles encryption, compression and encoding.",
    devices: ["Gateways", "Redirectors"],
    pdu: "Data",
    functions: ["Data translation", "Encryption/Decryption", "Compression", "Character encoding"],
    mnemonic: "People",
  },
  {
    num: 5, name: "Session", color: "#06b6d4", bg: "#ecfeff", border: "#a5f3fc",
    protocols: ["NetBIOS", "RPC", "PPTP", "SAP", "L2TP"],
    desc: "Manages sessions between applications. Establishes, maintains and terminates communication sessions.",
    devices: ["Gateways"],
    pdu: "Data",
    functions: ["Session establishment", "Session maintenance", "Session termination", "Synchronization", "Dialog control"],
    mnemonic: "Seem",
  },
  {
    num: 4, name: "Transport", color: "#10b981", bg: "#f0fdf4", border: "#bbf7d0",
    protocols: ["TCP", "UDP", "SCTP", "SPX"],
    desc: "Provides end-to-end communication, error recovery and flow control between hosts.",
    devices: ["Gateways", "Load balancers"],
    pdu: "Segment (TCP) / Datagram (UDP)",
    functions: ["Segmentation", "Flow control", "Error control", "Connection management", "Port addressing"],
    mnemonic: "To",
  },
  {
    num: 3, name: "Network", color: "#f59e0b", bg: "#fffbeb", border: "#fde68a",
    protocols: ["IP", "ICMP", "OSPF", "BGP", "RIP", "ARP"],
    desc: "Handles logical addressing and routing of packets between different networks.",
    devices: ["Routers", "Layer-3 switches"],
    pdu: "Packet",
    functions: ["Logical addressing (IP)", "Routing", "Path determination", "Packet forwarding", "Fragmentation"],
    mnemonic: "Need",
  },
  {
    num: 2, name: "Data Link", color: "#f97316", bg: "#fff7ed", border: "#fed7aa",
    protocols: ["Ethernet", "Wi-Fi (802.11)", "PPP", "HDLC", "Frame Relay"],
    desc: "Provides node-to-node data transfer and handles error detection in the physical layer.",
    devices: ["Switches", "Bridges", "NICs"],
    pdu: "Frame",
    functions: ["MAC addressing", "Error detection (CRC)", "Flow control", "Frame synchronization", "Access control"],
    mnemonic: "Data",
  },
  {
    num: 1, name: "Physical", color: "#ef4444", bg: "#fef2f2", border: "#fecaca",
    protocols: ["Ethernet (physical)", "USB", "Bluetooth", "DSL", "SONET"],
    desc: "Transmits raw bits over a physical medium. Defines electrical, mechanical and timing specifications.",
    devices: ["Hubs", "Repeaters", "Cables", "Modems"],
    pdu: "Bits",
    functions: ["Bit transmission", "Physical topology", "Signal encoding", "Transmission media", "Data rate control"],
    mnemonic: "Processing",
  },
];

const VIVA_QS = [
  { q: "What does OSI stand for?", a: "Open Systems Interconnection" },
  { q: "Which layer is responsible for routing?", a: "Network Layer (Layer 3)" },
  { q: "What PDU does the Transport layer use?", a: "Segment (TCP) or Datagram (UDP)" },
  { q: "Which layer handles encryption?", a: "Presentation Layer (Layer 6)" },
  { q: "What devices operate at Layer 2?", a: "Switches and Bridges" },
  { q: "What is the mnemonic for OSI layers (top to bottom)?", a: "All People Seem To Need Data Processing" },
];

export default function OSIModelPage() {
  return (
    <div className="min-h-screen bg-gray-50 px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-5xl mx-auto space-y-8">

        {/* Header */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-1 bg-blue-50 text-blue-600 border border-blue-100 rounded-full">Essential</span>
                <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-1 bg-gray-50 text-gray-500 border border-gray-100 rounded-full">Layer 1–7</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-gray-900">OSI Model</h1>
              <p className="text-gray-500 mt-2 max-w-2xl leading-relaxed">
                The Open Systems Interconnection (OSI) model is a conceptual framework that standardizes network communication into 7 distinct layers. Each layer has specific responsibilities and communicates with adjacent layers.
              </p>
            </div>
            <Link href="/tools/network/simulations/packet-transfer"
              className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition-colors shrink-0">
              <BookOpen className="w-4 h-4" /> Try Simulation
            </Link>
          </div>
        </div>

        {/* Mnemonic */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-100 p-5">
          <p className="text-xs font-black uppercase tracking-wider text-blue-500 mb-2">Memory Trick (Top → Bottom)</p>
          <p className="text-lg font-black text-blue-900">
            <span className="text-blue-600">A</span>ll{" "}
            <span className="text-violet-600">P</span>eople{" "}
            <span className="text-cyan-600">S</span>eem{" "}
            <span className="text-emerald-600">T</span>o{" "}
            <span className="text-amber-600">N</span>eed{" "}
            <span className="text-orange-600">D</span>ata{" "}
            <span className="text-red-600">P</span>rocessing
          </p>
          <p className="text-xs text-blue-600 mt-1">Application · Presentation · Session · Transport · Network · Data Link · Physical</p>
        </div>

        {/* Layer cards */}
        <div className="space-y-3">
          {LAYERS.map((layer) => (
            <div key={layer.num} className="bg-white rounded-2xl border shadow-sm overflow-hidden" style={{ borderColor: layer.border }}>
              <div className="flex items-center gap-4 px-5 py-4" style={{ backgroundColor: layer.bg }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-black text-sm shrink-0" style={{ backgroundColor: layer.color }}>
                  L{layer.num}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="font-black text-gray-900">{layer.name} Layer</h2>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/70 border" style={{ color: layer.color, borderColor: layer.border }}>
                      PDU: {layer.pdu}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-0.5">{layer.desc}</p>
                </div>
              </div>

              <div className="px-5 py-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-wider text-gray-400 mb-2">Protocols</p>
                  <div className="flex flex-wrap gap-1.5">
                    {layer.protocols.map((p) => (
                      <span key={p} className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">{p}</span>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-wider text-gray-400 mb-2">Key Functions</p>
                  <ul className="space-y-1">
                    {layer.functions.slice(0, 3).map((f) => (
                      <li key={f} className="flex items-center gap-1.5 text-xs text-gray-600">
                        <span className="w-1 h-1 rounded-full shrink-0" style={{ backgroundColor: layer.color }} />
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-wider text-gray-400 mb-2">Devices</p>
                  <div className="flex flex-wrap gap-1.5">
                    {layer.devices.map((d) => (
                      <span key={d} className="text-[10px] font-bold px-2 py-0.5 rounded-full border bg-white" style={{ borderColor: layer.border, color: layer.color }}>{d}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* OSI vs TCP/IP comparison */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-lg font-black text-gray-900 mb-4">OSI vs TCP/IP Model</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left py-2 px-3 text-[10px] font-black uppercase tracking-wider text-gray-400">Feature</th>
                  <th className="text-left py-2 px-3 text-[10px] font-black uppercase tracking-wider text-blue-400">OSI Model</th>
                  <th className="text-left py-2 px-3 text-[10px] font-black uppercase tracking-wider text-emerald-400">TCP/IP Model</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["Layers", "7 layers", "4 layers"],
                  ["Type", "Reference/Conceptual", "Practical/Implementation"],
                  ["Developed by", "ISO (1984)", "DARPA (1970s)"],
                  ["Usage", "Teaching & troubleshooting", "Internet communication"],
                  ["Transport protocols", "TCP, UDP, SCTP", "TCP, UDP"],
                  ["Session & Presentation", "Separate layers (5 & 6)", "Merged into Application"],
                ].map(([f, o, t]) => (
                  <tr key={f} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="py-2.5 px-3 font-semibold text-gray-700">{f}</td>
                    <td className="py-2.5 px-3 text-blue-600 font-medium">{o}</td>
                    <td className="py-2.5 px-3 text-emerald-600 font-medium">{t}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Viva Questions */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-lg font-black text-gray-900 mb-4 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-orange-500" /> Viva / Interview Questions
          </h2>
          <div className="space-y-3">
            {VIVA_QS.map((qa, i) => (
              <div key={i} className="p-4 bg-orange-50 rounded-xl border border-orange-100">
                <p className="text-sm font-bold text-gray-800 mb-1">Q: {qa.q}</p>
                <p className="text-sm text-orange-700 font-medium flex items-start gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" /> {qa.a}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Next topic */}
        <div className="flex justify-between items-center">
          <Link href="/tools/network" className="flex items-center gap-1.5 text-sm font-bold text-gray-500 hover:text-gray-900 transition-colors">
            ← Back to Overview
          </Link>
          <Link href="/tools/network/tcp-ip" className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition-colors">
            Next: TCP/IP Model <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
