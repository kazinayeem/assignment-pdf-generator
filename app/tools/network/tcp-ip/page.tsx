import { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, CheckCircle2, AlertCircle } from "lucide-react";

export const metadata: Metadata = { title: "TCP/IP Model | Computer Networks" };

const LAYERS = [
  {
    num: 4, name: "Application", color: "#3b82f6", bg: "#eff6ff", border: "#bfdbfe",
    osi: "Application + Presentation + Session (OSI 5,6,7)",
    protocols: ["HTTP", "HTTPS", "FTP", "SMTP", "DNS", "DHCP", "SSH", "Telnet"],
    desc: "Combines OSI's top 3 layers. Handles all high-level protocols, data representation and session management.",
    pdu: "Data / Message",
  },
  {
    num: 3, name: "Transport", color: "#10b981", bg: "#f0fdf4", border: "#bbf7d0",
    osi: "Transport (OSI 4)",
    protocols: ["TCP", "UDP", "SCTP"],
    desc: "Provides end-to-end communication. TCP offers reliable, ordered delivery. UDP offers fast, connectionless delivery.",
    pdu: "Segment / Datagram",
  },
  {
    num: 2, name: "Internet", color: "#f59e0b", bg: "#fffbeb", border: "#fde68a",
    osi: "Network (OSI 3)",
    protocols: ["IP (IPv4/IPv6)", "ICMP", "ARP", "OSPF", "BGP", "RIP"],
    desc: "Handles logical addressing and routing of packets across multiple networks using IP addresses.",
    pdu: "Packet",
  },
  {
    num: 1, name: "Network Access", color: "#ef4444", bg: "#fef2f2", border: "#fecaca",
    osi: "Data Link + Physical (OSI 1,2)",
    protocols: ["Ethernet", "Wi-Fi", "PPP", "ARP", "MAC"],
    desc: "Combines OSI's bottom 2 layers. Handles physical transmission and local network addressing.",
    pdu: "Frame / Bits",
  },
];

const TCP_HANDSHAKE = [
  { step: 1, from: "Client", to: "Server", msg: "SYN", desc: "Client sends SYN (synchronize) to initiate connection", color: "#3b82f6" },
  { step: 2, from: "Server", to: "Client", msg: "SYN-ACK", desc: "Server acknowledges with SYN-ACK (synchronize-acknowledge)", color: "#10b981" },
  { step: 3, from: "Client", to: "Server", msg: "ACK", desc: "Client sends ACK — connection established!", color: "#8b5cf6" },
];

export default function TCPIPPage() {
  return (
    <div className="min-h-screen bg-gray-50 px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-5xl mx-auto space-y-8">

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900">TCP/IP Model</h1>
          <p className="text-gray-500 mt-2 leading-relaxed max-w-2xl">
            The TCP/IP model is the practical networking model that powers the internet. It has 4 layers and maps to the OSI model's 7 layers. Developed by DARPA in the 1970s.
          </p>
        </div>

        {/* Layers */}
        <div className="space-y-3">
          {LAYERS.map((layer) => (
            <div key={layer.num} className="bg-white rounded-2xl border shadow-sm overflow-hidden" style={{ borderColor: layer.border }}>
              <div className="flex items-center gap-4 px-5 py-4" style={{ backgroundColor: layer.bg }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-black text-sm shrink-0" style={{ backgroundColor: layer.color }}>
                  L{layer.num}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="font-black text-gray-900">{layer.name} Layer</h2>
                    <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-white/70 border text-gray-500" style={{ borderColor: layer.border }}>
                      PDU: {layer.pdu}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">Maps to: {layer.osi}</p>
                </div>
              </div>
              <div className="px-5 py-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-wider text-gray-400 mb-2">Protocols</p>
                  <div className="flex flex-wrap gap-1.5">
                    {layer.protocols.map((p) => (
                      <span key={p} className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">{p}</span>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-wider text-gray-400 mb-2">Description</p>
                  <p className="text-xs text-gray-600 leading-relaxed">{layer.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* TCP 3-way handshake */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-lg font-black text-gray-900 mb-5">TCP 3-Way Handshake</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
            {TCP_HANDSHAKE.map((step) => (
              <div key={step.step} className="p-4 rounded-xl border-2 text-center" style={{ borderColor: step.color, backgroundColor: step.color + "10" }}>
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-black mx-auto mb-2" style={{ backgroundColor: step.color }}>
                  {step.step}
                </div>
                <p className="font-black text-lg mb-1" style={{ color: step.color }}>{step.msg}</p>
                <p className="text-xs text-gray-500">{step.from} → {step.to}</p>
                <p className="text-xs text-gray-600 mt-1 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
          <Link href="/tools/network/simulations/tcp-handshake" className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-xl text-sm font-bold hover:bg-emerald-700 transition-colors">
            Animate TCP Handshake →
          </Link>
        </div>

        {/* Viva */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-lg font-black text-gray-900 mb-4 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-orange-500" /> Key Questions
          </h2>
          <div className="space-y-3">
            {[
              { q: "How many layers does TCP/IP have?", a: "4 layers: Application, Transport, Internet, Network Access" },
              { q: "What is the difference between TCP and UDP?", a: "TCP is connection-oriented, reliable, ordered. UDP is connectionless, faster, no guarantee." },
              { q: "What does IP stand for?", a: "Internet Protocol — handles logical addressing and routing" },
              { q: "What is a 3-way handshake?", a: "TCP connection setup: SYN → SYN-ACK → ACK" },
            ].map((qa, i) => (
              <div key={i} className="p-4 bg-orange-50 rounded-xl border border-orange-100">
                <p className="text-sm font-bold text-gray-800 mb-1">Q: {qa.q}</p>
                <p className="text-sm text-orange-700 font-medium flex items-start gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" /> {qa.a}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-between">
          <Link href="/tools/network/osi-model" className="flex items-center gap-1.5 text-sm font-bold text-gray-500 hover:text-gray-900">← OSI Model</Link>
          <Link href="/tools/network/ip-addressing" className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition-colors">
            Next: IP Addressing <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
