import { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, XCircle } from "lucide-react";

export const metadata: Metadata = { title: "TCP vs UDP | Computer Networks" };

export default function TCPUDPPage() {
  return (
    <div className="min-h-screen bg-gray-50 px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900">TCP vs UDP</h1>
          <p className="text-gray-500 mt-2 leading-relaxed">Both are Transport Layer (Layer 4) protocols. TCP is reliable and connection-oriented; UDP is fast and connectionless.</p>
        </div>

        {/* Comparison */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {[
            {
              name: "TCP", full: "Transmission Control Protocol", color: "#3b82f6", bg: "#eff6ff", border: "#bfdbfe",
              features: [
                ["Connection", "Connection-oriented (3-way handshake)"],
                ["Reliability", "Guaranteed delivery"],
                ["Order", "Data arrives in order"],
                ["Error checking", "Yes — retransmits lost packets"],
                ["Flow control", "Yes — sliding window"],
                ["Speed", "Slower (overhead)"],
                ["Header size", "20–60 bytes"],
                ["Use cases", "HTTP, FTP, SMTP, SSH"],
              ],
              pros: ["Reliable data delivery", "Error detection & correction", "Flow and congestion control", "Ordered delivery"],
              cons: ["Higher overhead", "Slower than UDP", "Not suitable for real-time"],
            },
            {
              name: "UDP", full: "User Datagram Protocol", color: "#10b981", bg: "#f0fdf4", border: "#bbf7d0",
              features: [
                ["Connection", "Connectionless"],
                ["Reliability", "No guarantee"],
                ["Order", "No ordering"],
                ["Error checking", "Basic checksum only"],
                ["Flow control", "None"],
                ["Speed", "Faster (low overhead)"],
                ["Header size", "8 bytes (fixed)"],
                ["Use cases", "DNS, VoIP, Video streaming, Gaming"],
              ],
              pros: ["Very fast", "Low overhead", "Good for real-time apps", "Supports broadcast/multicast"],
              cons: ["No reliability", "No ordering", "No flow control", "Packets may be lost"],
            },
          ].map((proto) => (
            <div key={proto.name} className="bg-white rounded-2xl border shadow-sm overflow-hidden" style={{ borderColor: proto.border }}>
              <div className="px-5 py-4" style={{ backgroundColor: proto.bg }}>
                <h2 className="text-xl font-black" style={{ color: proto.color }}>{proto.name}</h2>
                <p className="text-xs text-gray-500">{proto.full}</p>
              </div>
              <div className="p-5 space-y-4">
                <div className="space-y-2">
                  {proto.features.map(([k, v]) => (
                    <div key={k} className="flex justify-between text-sm border-b border-gray-50 pb-1.5">
                      <span className="text-gray-500 font-medium">{k}</span>
                      <span className="font-bold text-gray-800 text-right max-w-[55%]">{v}</span>
                    </div>
                  ))}
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-wider text-gray-400 mb-2">Pros</p>
                  {proto.pros.map((p) => (
                    <div key={p} className="flex items-center gap-1.5 text-xs text-gray-600 mb-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" /> {p}
                    </div>
                  ))}
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-wider text-gray-400 mb-2">Cons</p>
                  {proto.cons.map((c) => (
                    <div key={c} className="flex items-center gap-1.5 text-xs text-gray-600 mb-1">
                      <XCircle className="w-3.5 h-3.5 text-red-400 shrink-0" /> {c}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* When to use */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-lg font-black text-gray-900 mb-4">When to Use Which?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
              <p className="font-black text-blue-700 mb-2">Use TCP when:</p>
              {["Data accuracy is critical (banking, file transfer)", "Order of data matters", "You need error recovery", "HTTP/HTTPS web requests", "Email (SMTP, IMAP)"].map((u) => (
                <div key={u} className="flex items-start gap-1.5 text-xs text-blue-700 mb-1">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0 mt-0.5" /> {u}
                </div>
              ))}
            </div>
            <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100">
              <p className="font-black text-emerald-700 mb-2">Use UDP when:</p>
              {["Speed is more important than reliability", "Real-time applications (VoIP, video calls)", "Online gaming", "DNS queries", "Live streaming"].map((u) => (
                <div key={u} className="flex items-start gap-1.5 text-xs text-emerald-700 mb-1">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0 mt-0.5" /> {u}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-between">
          <Link href="/tools/network/tcp-ip" className="flex items-center gap-1.5 text-sm font-bold text-gray-500 hover:text-gray-900">← TCP/IP Model</Link>
          <Link href="/tools/network/ip-addressing" className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition-colors">
            Next: IP Addressing →
          </Link>
        </div>
      </div>
    </div>
  );
}
