"use client";

import Link from "next/link";
import { ChevronRight, Hash, Shield, FileCode, Lock, CheckCircle, HelpCircle, ChevronDown, Key, BookOpen, ExternalLink } from "lucide-react";
import { useState } from "react";

const interviewData = [
  {
    q: "What is the difference between hashing and encryption?",
    a: "Hashing is a one-way function that produces a fixed-size output; you cannot reverse a hash to get the original input. Encryption is two-way — data can be decrypted with the correct key. Hashing is used for integrity verification and password storage; encryption is used for confidentiality."
  },
  {
    q: "What is the avalanche effect in hashing?",
    a: "The avalanche effect means that a tiny change in the input (even a single bit) produces a completely different hash output. This property is crucial for security — it prevents attackers from predicting how changes affect the hash and makes finding collisions difficult."
  },
  {
    q: "Why is SHA-256 preferred over MD5?",
    a: "MD5 produces a 128-bit hash and has known collision vulnerabilities (two different inputs can produce the same hash). SHA-256 produces a 256-bit hash and is collision-resistant. For security-sensitive applications like digital signatures and certificates, SHA-256 is the standard."
  },
  {
    q: "What is HMAC and how is it different from regular hashing?",
    a: "HMAC (Hash-based Message Authentication Code) combines a secret key with a hash function. Unlike regular hashing which anyone can compute, HMAC requires the secret key for both creation and verification. This provides both integrity and authenticity."
  },
  {
    q: "How do digital signatures work?",
    a: "The sender hashes the message and encrypts the hash with their private key to create the signature. The receiver decrypts the signature using the sender's public key, hashes the original message independently, and compares the two hashes. If they match, the message is authentic and unaltered."
  }
];

function InterviewAccordion({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-4 text-left bg-white hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-start gap-3">
          <HelpCircle className="w-5 h-5 text-violet-500 mt-0.5 flex-shrink-0" />
          <span className="font-semibold text-gray-900 text-sm">{q}</span>
        </div>
        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform flex-shrink-0 ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="px-4 pb-4 pt-0 bg-gray-50 border-t border-gray-100">
          <p className="text-sm text-gray-600 leading-relaxed pl-8">{a}</p>
        </div>
      )}
    </div>
  );
}

function simulateHash(input: string, algo: string): string {
  const chars = "0123456789abcdef";
  const len = algo === "sha256" ? 64 : algo === "sha512" ? 128 : 40;
  let hash = "";
  let seed = 0;
  for (let i = 0; i < input.length; i++) seed = ((seed << 5) - seed + input.charCodeAt(i)) | 0;
  for (let i = 0; i < len; i++) {
    seed = (seed * 1103515245 + 12345) & 0x7fffffff;
    hash += chars[seed % 16];
  }
  return hash;
}

export default function HashingPage() {
  const [input1, setInput1] = useState("Hello, World!");
  const [input2, setInput2] = useState("Hello, world!");

  const hash1 = simulateHash(input1, "sha256");
  const hash2 = simulateHash(input2, "sha256");

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-violet-50/20 to-gray-50 px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-6">
          <Link href="/tools/security" className="hover:text-gray-700 transition-colors">Security</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-gray-700 font-semibold">Hashing & Digital Signatures</span>
        </div>

        <div className="bg-gradient-to-r from-violet-600 to-indigo-700 rounded-2xl p-8 md:p-12 mb-8 text-white">
          <h1 className="text-3xl md:text-4xl font-black mb-3">Hashing & Digital Signatures</h1>
          <p className="text-violet-100 text-lg max-w-3xl">
            Understanding cryptographic hash functions, common algorithms, HMAC, digital signatures, and their real-world applications.
          </p>
        </div>

        {/* What is Hashing */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 md:p-8 mb-6">
          <h2 className="text-lg font-black uppercase tracking-wider text-gray-500 mb-1">What is Hashing?</h2>
          <p className="text-sm text-gray-500 mb-6">A one-way cryptographic function that transforms data into a fixed-size string</p>
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { title: "One-Way Function", icon: Lock, desc: "You cannot reverse a hash to recover the original input. It's computationally infeasible to find the input given the hash output." },
              { title: "Fixed Output Size", icon: Hash, desc: "Regardless of input size (a single character or a 10GB file), the hash output has a fixed length (e.g., 256 bits for SHA-256)." },
              { title: "Avalanche Effect", icon: Shield, desc: "A tiny change in input dramatically changes the output hash. Even changing one bit flips ~50% of the output bits, making hashes unpredictable." }
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="p-5 bg-gray-50 rounded-xl border border-gray-200">
                  <Icon className="w-6 h-6 text-violet-600 mb-3" />
                  <h3 className="font-bold text-gray-900 text-sm mb-2">{item.title}</h3>
                  <p className="text-xs text-gray-600 leading-relaxed">{item.desc}</p>
                </div>
              );
            })}
          </div>

          {/* Hash Visualization */}
          <div className="mt-8 p-5 bg-gray-50 rounded-xl border border-gray-200">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2"><Hash className="w-4 h-4 text-violet-600" /> Hash Visualization — SHA-256</h3>
            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5">Input 1</label>
                <input
                  type="text"
                  value={input1}
                  onChange={(e) => setInput1(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent font-mono"
                />
                <div className="mt-2 p-3 bg-gray-900 rounded-lg">
                  <code className="text-xs text-emerald-400 break-all">{hash1}</code>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5">Input 2</label>
                <input
                  type="text"
                  value={input2}
                  onChange={(e) => setInput2(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent font-mono"
                />
                <div className="mt-2 p-3 bg-gray-900 rounded-lg">
                  <code className="text-xs text-emerald-400 break-all">{hash2}</code>
                </div>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-3 text-center">Notice how even a small difference in input completely changes the hash (avalanche effect).</p>
          </div>
        </div>

        {/* Algorithm Comparison */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 md:p-8 mb-6">
          <h2 className="text-lg font-black uppercase tracking-wider text-gray-500 mb-4">Common Hashing Algorithms</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-100">
                  <th className="text-left p-3 font-bold text-gray-700 border-b border-gray-200">Algorithm</th>
                  <th className="text-left p-3 font-bold text-gray-700 border-b border-gray-200">Output Bits</th>
                  <th className="text-left p-3 font-bold text-gray-700 border-b border-gray-200">Collision Risk</th>
                  <th className="text-left p-3 font-bold text-gray-700 border-b border-gray-200">Speed</th>
                  <th className="text-left p-3 font-bold text-gray-700 border-b border-gray-200">Status</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { algo: "MD5", bits: "128", risk: "High (collisions found)", speed: "Very Fast", status: "Broken — not recommended" },
                  { algo: "SHA-1", bits: "160", risk: "Medium (theoretical attacks)", speed: "Fast", status: "Deprecated — avoid" },
                  { algo: "SHA-256", bits: "256", risk: "Very Low", speed: "Moderate", status: "Secure — widely used" },
                  { algo: "SHA-512", bits: "512", risk: "Negligible", speed: "Moderate", status: "Secure — strongest in SHA-2" },
                  { algo: "bcrypt", bits: "192", risk: "Very Low", speed: "Slow (intentional)", status: "Secure — ideal for passwords" },
                  { algo: "Argon2", bits: "Variable", risk: "Very Low", speed: "Configurable", status: "Secure — password hashing winner" }
                ].map((row) => (
                  <tr key={row.algo} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="p-3 font-bold text-violet-700">{row.algo}</td>
                    <td className="p-3 text-gray-700">{row.bits}</td>
                    <td className="p-3 text-gray-600 text-xs">{row.risk}</td>
                    <td className="p-3 text-gray-600 text-xs">{row.speed}</td>
                    <td className="p-3">
                      <span className={`inline-block text-xs font-semibold px-2 py-0.5 rounded-full ${row.status.includes("Secure") ? "bg-emerald-100 text-emerald-700" : row.status.includes("Deprecated") || row.status.includes("Broken") ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"}`}>
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* HMAC */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 md:p-8 mb-6">
          <h2 className="text-lg font-black uppercase tracking-wider text-gray-500 mb-1">HMAC (Hash-based Message Authentication Code)</h2>
          <p className="text-sm text-gray-500 mb-4">A keyed hash function that provides both integrity and authenticity</p>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-5 bg-gray-50 rounded-xl border border-gray-200">
              <h3 className="font-bold text-sm text-gray-900 mb-2 flex items-center gap-2"><Key className="w-4 h-4 text-violet-600" /> How HMAC Works</h3>
              <ol className="text-xs text-gray-600 space-y-2 list-decimal list-inside">
                <li>Combine the secret key with the message using a specific padding scheme</li>
                <li>Hash the result with the chosen hash function (e.g., SHA-256)</li>
                <li>Combine the key with the hash using a second padding scheme</li>
                <li>Hash again to produce the final HMAC output</li>
              </ol>
              <p className="text-xs text-gray-500 mt-3">The double-hashing approach prevents length-extension attacks on the underlying hash.</p>
            </div>
            <div className="p-5 bg-gray-50 rounded-xl border border-gray-200">
              <h3 className="font-bold text-sm text-gray-900 mb-2 flex items-center gap-2"><CheckCircle className="w-4 h-4 text-emerald-600" /> Use Cases</h3>
              <ul className="text-xs text-gray-600 space-y-1.5 list-disc list-inside">
                <li>API authentication (e.g., AWS Signature V4)</li>
                <li>TLS/SSL handshake message verification</li>
                <li>JWT token integrity</li>
                <li>Secure cookie signing</li>
                <li>VPN protocol authentication</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Digital Signatures */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 md:p-8 mb-6">
          <h2 className="text-lg font-black uppercase tracking-wider text-gray-500 mb-1">Digital Signatures</h2>
          <p className="text-sm text-gray-500 mb-6">Providing authenticity, integrity, and non-repudiation for digital data</p>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-5 bg-blue-50 rounded-xl border border-blue-200">
              <h3 className="font-bold text-sm text-gray-900 mb-3 flex items-center gap-2"><FileCode className="w-4 h-4 text-blue-600" /> Signing Process</h3>
              <ol className="text-xs text-gray-600 space-y-2 list-decimal list-inside">
                <li>Hash the original message using a hash function</li>
                <li>Encrypt the hash with the sender's <strong>private key</strong></li>
                <li>The encrypted hash is the digital signature</li>
                <li>Send the original message + signature to the recipient</li>
              </ol>
            </div>
            <div className="p-5 bg-emerald-50 rounded-xl border border-emerald-200">
              <h3 className="font-bold text-sm text-gray-900 mb-3 flex items-center gap-2"><Shield className="w-4 h-4 text-emerald-600" /> Verification Process</h3>
              <ol className="text-xs text-gray-600 space-y-2 list-decimal list-inside">
                <li>Decrypt the signature using the sender's <strong>public key</strong></li>
                <li>Independently hash the received message</li>
                <li>Compare the decrypted hash with the computed hash</li>
                <li>If they match → authenticity and integrity confirmed</li>
              </ol>
            </div>
          </div>
          <div className="mt-4 p-4 bg-amber-50 rounded-xl border border-amber-200">
            <p className="text-xs text-amber-800"><strong>Certificates:</strong> A digital certificate binds a public key to an identity. Certificate Authorities (CAs) sign certificates to vouch for their authenticity. This creates the PKI (Public Key Infrastructure) trust chain.</p>
          </div>
        </div>

        {/* Real-World Uses */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 md:p-8 mb-6">
          <h2 className="text-lg font-black uppercase tracking-wider text-gray-500 mb-4">Real-World Applications</h2>
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { title: "Password Storage", desc: "Passwords are hashed (with salt) before storage. When a user logs in, the input is hashed and compared to the stored hash. If the database is breached, passwords remain protected.", icon: Lock },
              { title: "Integrity Checking", desc: "Software downloads include checksums (SHA-256). After downloading, users verify the checksum matches to ensure the file wasn't tampered with during transfer.", icon: CheckCircle },
              { title: "Blockchain", desc: "Each block in a blockchain contains the hash of the previous block, creating an immutable chain. Altering any block would change all subsequent hashes, making tampering detectable.", icon: BookOpen }
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="p-5 bg-gray-50 rounded-xl border border-gray-200">
                  <Icon className="w-5 h-5 text-violet-600 mb-2" />
                  <h3 className="font-bold text-gray-900 text-sm mb-1">{item.title}</h3>
                  <p className="text-xs text-gray-600">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Code Examples */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 md:p-8 mb-6">
          <h2 className="text-lg font-black uppercase tracking-wider text-gray-500 mb-4">Code Examples</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-4 bg-gray-900 rounded-xl">
              <div className="flex items-center gap-2 mb-3">
                <ExternalLink className="w-4 h-4 text-yellow-400" />
                <span className="text-xs font-bold text-yellow-400 uppercase">Python</span>
              </div>
              <pre className="text-xs text-gray-300 leading-relaxed overflow-x-auto">{`import hashlib, hmac

# SHA-256 hashing
data = b"Hello, World!"
hash_obj = hashlib.sha256(data)
print(hash_obj.hexdigest())
# dffd6021... (64 chars)

# HMAC
key = b"secret-key"
hmac_obj = hmac.new(key, data, hashlib.sha256)
print(hmac_obj.hexdigest())

# bcrypt for passwords
import bcrypt
salt = bcrypt.gensalt()
hashed = bcrypt.hashpw(b"password123", salt)`}</pre>
            </div>
            <div className="p-4 bg-gray-900 rounded-xl">
              <div className="flex items-center gap-2 mb-3">
                <ExternalLink className="w-4 h-4 text-yellow-400" />
                <span className="text-xs font-bold text-yellow-400 uppercase">JavaScript (Node.js)</span>
              </div>
              <pre className="text-xs text-gray-300 leading-relaxed overflow-x-auto">{`const crypto = require('crypto');

// SHA-256 hashing
const data = 'Hello, World!';
const hash = crypto
  .createHash('sha256')
  .update(data)
  .digest('hex');
console.log(hash);
// dffd6021... (64 chars)

// HMAC
const key = 'secret-key';
const hmac = crypto
  .createHmac('sha256', key)
  .update(data)
  .digest('hex');
console.log(hmac);

// SHA-512
const hash512 = crypto
  .createHash('sha512')
  .update(data)
  .digest('hex');`}</pre>
            </div>
          </div>
        </div>

        {/* Interview Questions */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 md:p-8 mb-6">
          <h2 className="text-lg font-black uppercase tracking-wider text-gray-500 mb-1">Interview Questions</h2>
          <p className="text-sm text-gray-500 mb-6">Common hashing and digital signatures interview questions with answers</p>
          <div className="space-y-3">
            {interviewData.map((item, i) => (
              <InterviewAccordion key={i} q={item.q} a={item.a} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
