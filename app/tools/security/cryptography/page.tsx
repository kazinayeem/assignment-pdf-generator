"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  Key, Lock, Unlock, Hash, Eye, ChevronRight,
  BookOpen, Code2, Shuffle, Copy, Check, Play
} from "lucide-react";

function modExp(base: number, exp: number, mod: number): number {
  let result = 1;
  base = base % mod;
  while (exp > 0) {
    if (exp & 1) result = (result * base) % mod;
    exp >>= 1;
    base = (base * base) % mod;
  }
  return result;
}

function gcd(a: number, b: number): number {
  while (b) { const t = b; b = a % b; a = t; }
  return a;
}

function modInverse(a: number, m: number): number {
  for (let x = 1; x < m; x++) {
    if ((a * x) % m === 1) return x;
  }
  return 1;
}

function simpleHash(text: string): string {
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    const char = text.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  const n = Math.abs(hash);
  const h = n.toString(16);
  return "0".repeat(32 - h.length) + h;
}

function simulateMD5(text: string): string {
  let h = 0x67452301;
  for (let i = 0; i < text.length; i++) {
    h = ((h << 7) | (h >>> 25)) ^ text.charCodeAt(i);
    h = (h * 0x5C4B3A1D) ^ (h >>> 16);
  }
  return (h >>> 0).toString(16).padStart(32, "0");
}

function simulateSHA1(text: string): string {
  let h0 = 0x67452301, h1 = 0xEFCDAB89, h2 = 0x98BADCFE, h3 = 0x10325476, h4 = 0xC3D2E1F0;
  for (let i = 0; i < text.length; i++) {
    const c = text.charCodeAt(i);
    h0 = ((h0 << 5) | (h0 >>> 27)) + (h1 ^ h2 ^ h3 ^ h4) + c;
    h1 = ((h1 << 5) | (h1 >>> 27)) + (h0 ^ h2 ^ h3 ^ h4) + c;
    h2 = ((h2 << 5) | (h2 >>> 27)) + (h0 ^ h1 ^ h3 ^ h4) + c;
    h3 = ((h3 << 5) | (h3 >>> 27)) + (h0 ^ h1 ^ h2 ^ h4) + c;
    h4 = ((h4 << 5) | (h4 >>> 27)) + (h0 ^ h1 ^ h2 ^ h3) + c;
  }
  return [h0, h1, h2, h3, h4].map(v => (v >>> 0).toString(16).padStart(8, "0")).join("");
}

function simulateSHA256(text: string): string {
  let h = 0x6A09E667;
  for (let i = 0; i < text.length; i++) {
    h = ((h << 13) | (h >>> 19)) ^ text.charCodeAt(i);
    h = (h * 0x9E3779B9) ^ (h >>> 11);
    h = (h * 0x85EBCA6B) ^ (h >>> 7);
  }
  const r = (h >>> 0).toString(16).padStart(16, "0");
  return r + r + r + r;
}

function simulateSHA512(text: string): string {
  let h = 0x6A09E667F3BCC908n;
  for (let i = 0; i < text.length; i++) {
    h = ((h << 23n) | (h >> 41n)) ^ BigInt(text.charCodeAt(i));
    h = (h * 0x9E3779B97F4A7C15n) ^ (h >> 17n);
    h = (h * 0x85EBCA6BC6B1D3C7n) ^ (h >> 13n);
  }
  return h.toString(16).padStart(128, "0").slice(0, 128);
}

function caesarEncrypt(text: string, shift: number): string {
  return text.split("").map(ch => {
    if (ch >= "A" && ch <= "Z") return String.fromCharCode(((ch.charCodeAt(0) - 65 + shift) % 26) + 65);
    if (ch >= "a" && ch <= "z") return String.fromCharCode(((ch.charCodeAt(0) - 97 + shift) % 26) + 97);
    return ch;
  }).join("");
}

function caesarDecrypt(text: string, shift: number): string {
  return caesarEncrypt(text, 26 - (shift % 26));
}

const AES_STEPS = [
  "Plaintext",
  "AddRoundKey",
  "SubBytes",
  "ShiftRows",
  "MixColumns",
  "Round Key",
  "Ciphertext",
];

const AES_COLORS = [
  "bg-emerald-500", "bg-blue-500", "bg-violet-500", "bg-amber-500",
  "bg-rose-500", "bg-cyan-500", "bg-fuchsia-500",
];

const COMPARISON_ROWS = [
  { algo: "AES", type: "Symmetric", keySize: "128/256 bits", speed: "Fast", use: "Data at rest, TLS" },
  { algo: "DES", type: "Symmetric", keySize: "56 bits", speed: "Fast", use: "Legacy systems" },
  { algo: "RSA", type: "Asymmetric", keySize: "2048/4096 bits", speed: "Slow", use: "Key exchange, signatures" },
  { algo: "ECC", type: "Asymmetric", keySize: "256 bits", speed: "Moderate", use: "Mobile, IoT, TLS" },
  { algo: "Blowfish", type: "Symmetric", keySize: "32-448 bits", speed: "Fast", use: "File encryption" },
  { algo: "DSA", type: "Asymmetric", keySize: "1024/2048 bits", speed: "Slow", use: "Digital signatures" },
];

const INTERVIEW_QS = [
  {
    q: "What is the difference between symmetric and asymmetric encryption?",
    a: "Symmetric encryption uses the same key for encryption and decryption (e.g., AES). Asymmetric encryption uses a public key to encrypt and a private key to decrypt (e.g., RSA). Symmetric is faster but requires secure key exchange; asymmetric solves key distribution but is computationally expensive.",
  },
  {
    q: "How does RSA encryption work?",
    a: "RSA relies on the difficulty of factoring large primes. Two large primes p and q are chosen, n = p × q, φ(n) = (p-1)(q-1). A public exponent e is chosen (typically 65537), and the private key d = e⁻¹ mod φ(n). Encryption: c = m^e mod n. Decryption: m = c^d mod n.",
  },
  {
    q: "What is the difference between hashing and encryption?",
    a: "Hashing is a one-way function that produces a fixed-size output; it cannot be reversed. Encryption is a two-way function that can be decrypted with the proper key. Hashing is used for integrity checks and password storage; encryption is used for confidentiality.",
  },
  {
    q: "What is a digital signature and how does it work?",
    a: "A digital signature provides authenticity and non-repudiation. The sender hashes the message and encrypts the hash with their private key. The receiver decrypts the hash with the sender's public key and compares it to the hash of the received message. If they match, the message is authentic.",
  },
  {
    q: "What is the AES encryption algorithm?",
    a: "AES (Advanced Encryption Standard) is a symmetric block cipher that operates on 128-bit blocks with 128/192/256-bit keys. It uses multiple rounds (10/12/14) of SubBytes, ShiftRows, MixColumns, and AddRoundKey operations. It is the standard for modern symmetric encryption.",
  },
];

const CODE_SNIPPETS = [
  {
    lang: "Python",
    code: `from cryptography.fernet import Fernet

# Generate a key
key = Fernet.generate_key()
cipher = Fernet(key)

# Encrypt
plaintext = b"Sensitive data"
ciphertext = cipher.encrypt(plaintext)

# Decrypt
decrypted = cipher.decrypt(ciphertext)
print(decrypted.decode())`,
  },
  {
    lang: "JavaScript (Node.js)",
    code: `const crypto = require('crypto');

const algorithm = 'aes-256-cbc';
const key = crypto.randomBytes(32);
const iv = crypto.randomBytes(16);

function encrypt(text) {
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
}

function decrypt(encrypted) {
  const decipher = crypto.createDecipheriv(algorithm, key, iv);
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}`,
  },
  {
    lang: "Go",
    code: `package main

import (
  "crypto/aes"
  "crypto/cipher"
  "crypto/rand"
  "fmt"
)

func main() {
  key := []byte("examplekey123456")
  plaintext := []byte("Hello, AES!")

  block, _ := aes.NewCipher(key)
  aesGCM, _ := cipher.NewGCM(block)

  nonce := make([]byte, aesGCM.NonceSize())
  rand.Read(nonce)

  ciphertext := aesGCM.Seal(nil, nonce, plaintext, nil)
  fmt.Printf("Encrypted: %x\\n", ciphertext)
}`,
  },
];

export default function CryptographyPage() {
  const [activeTab, setActiveTab] = useState(0);
  const [caesarInput, setCaesarInput] = useState("HELLO");
  const [caesarShift, setCaesarShift] = useState(3);
  const [rsaP] = useState(17);
  const [rsaQ] = useState(11);
  const [rsaKeys, setRsaKeys] = useState<{ n: number; e: number; d: number; phi: number } | null>(null);
  const [rsaPlaintext, setRsaPlaintext] = useState("");
  const [aesStep, setAesStep] = useState(0);
  const [aesInput, setAesInput] = useState("AB");
  const [hashInput, setHashInput] = useState("Hello, World!");
  const [copiedHash, setCopiedHash] = useState("");
  const [copied, setCopied] = useState(false);

  const caesarEncrypted = useMemo(() => caesarEncrypt(caesarInput, caesarShift), [caesarInput, caesarShift]);
  const caesarDecrypted = useMemo(() => caesarDecrypt(caesarEncrypted, caesarShift), [caesarEncrypted, caesarShift]);
  const caesarTable = useMemo(() => {
    const alpha = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    return alpha.split("").map(ch => ({
      original: ch,
      shifted: String.fromCharCode(((ch.charCodeAt(0) - 65 + caesarShift) % 26) + 65),
    }));
  }, [caesarShift]);

  const rsaN = rsaP * rsaQ;
  const rsaPhi = (rsaP - 1) * (rsaQ - 1);
  const rsaE = (() => { for (let i = 2; i < rsaPhi; i++) if (gcd(i, rsaPhi) === 1) return i; return 1; })();
  const rsaD = modInverse(rsaE, rsaPhi);

  function generateRsaKeys() {
    setRsaKeys({ n: rsaN, e: rsaE, d: rsaD, phi: rsaPhi });
  }

  const rsaCiphertext = useMemo(() => {
    const m = parseInt(rsaPlaintext);
    if (isNaN(m) || !rsaKeys) return "";
    return modExp(m, rsaKeys.e, rsaKeys.n).toString();
  }, [rsaPlaintext, rsaKeys]);

  const rsaDecrypted = useMemo(() => {
    const c = parseInt(rsaCiphertext);
    if (isNaN(c) || !rsaKeys) return "";
    return modExp(c, rsaKeys.d, rsaKeys.n).toString();
  }, [rsaCiphertext, rsaKeys]);

  const hashResults = useMemo(() => ({
    MD5: simulateMD5(hashInput),
    "SHA-1": simulateSHA1(hashInput),
    "SHA-256": simulateSHA256(hashInput),
    "SHA-512": simulateSHA512(hashInput),
  }), [hashInput]);

  function copyHash(algo: string) {
    navigator.clipboard.writeText(hashResults[algo as keyof typeof hashResults]);
    setCopiedHash(algo);
    setCopied(true);
    setTimeout(() => { setCopied(false); setCopiedHash(""); }, 1500);
  }

  const TAB_LABELS = ["Caesar Cipher", "RSA Demo", "AES Visualization", "Hash Generator"];
  const TAB_ICONS = [Shuffle, Key, Eye, Hash];

  const aesMatrix = useMemo(() => {
    const bytes = aesInput.split("").map(ch => ch.charCodeAt(0));
    const matrix: number[][] = [];
    for (let r = 0; r < 4; r++) {
      matrix[r] = [];
      for (let c = 0; c < 4; c++) {
        const idx = r * 4 + c;
        matrix[r][c] = idx < bytes.length ? bytes[idx] : 0x00;
      }
    }
    return matrix;
  }, [aesInput]);

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <style>{`
        @keyframes pulse-glow { 0%,100% { opacity: 0.4; } 50% { opacity: 1; } }
        @keyframes slideIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        .anim-step { animation: slideIn 0.3s ease-out; }
        .matrix-cell { transition: all 0.2s ease; }
      `}</style>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 py-4 text-xs sm:text-sm text-gray-400">
          <Link href="/tools/security" className="hover:text-violet-400 transition-colors font-medium">Security</Link>
          <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />
          <span className="text-violet-300 font-semibold">Cryptography</span>
        </div>

        {/* Hero */}
        <div className="py-6 sm:py-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-violet-500/10 border border-violet-500/30 rounded-full text-[11px] font-semibold mb-4 text-violet-300">
            <Lock className="w-3.5 h-3.5" /> Interactive Lab
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black mb-4 leading-tight">
            🔑 Cryptography Lab
          </h1>
          <p className="text-sm sm:text-base lg:text-lg text-gray-400 max-w-3xl leading-relaxed">
            Explore encryption algorithms — from classical ciphers to modern RSA, AES, and cryptographic hashing.
            Interactive simulators let you see every step of the process.
          </p>
        </div>

        {/* Theory Section */}
        <div className="grid sm:grid-cols-2 gap-4 sm:gap-6 mb-10">
          <div className="bg-gray-900/60 border border-gray-800 rounded-xl p-5 sm:p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
                <Lock className="w-4 h-4 text-blue-400" />
              </div>
              <h3 className="font-bold text-sm sm:text-base text-white">Symmetric Encryption</h3>
            </div>
            <p className="text-xs sm:text-sm text-gray-400 leading-relaxed mb-3">
              Same key encrypts and decrypts. Fast and efficient for bulk data. Examples: AES, DES, Blowfish.
            </p>
            <p className="text-xs text-gray-500">
              <span className="text-violet-400 font-semibold">Use when:</span> encrypting files, database columns, or large volumes of data where both parties already share a secret key.
            </p>
          </div>
          <div className="bg-gray-900/60 border border-gray-800 rounded-xl p-5 sm:p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-lg bg-violet-500/20 flex items-center justify-center">
                <Key className="w-4 h-4 text-violet-400" />
              </div>
              <h3 className="font-bold text-sm sm:text-base text-white">Asymmetric Encryption</h3>
            </div>
            <p className="text-xs sm:text-sm text-gray-400 leading-relaxed mb-3">
              Public key encrypts, private key decrypts. Solves key distribution. Examples: RSA, ECC, DSA.
            </p>
            <p className="text-xs text-gray-500">
              <span className="text-violet-400 font-semibold">Use when:</span> key exchange, digital signatures, TLS/SSL certificates, and scenarios where parties have never shared a secret.
            </p>
          </div>
        </div>

        {/* Interactive Simulator Tabs */}
        <div className="bg-gray-900/80 border border-gray-800 rounded-xl overflow-hidden mb-10">
          {/* Tab Bar */}
          <div className="flex border-b border-gray-800 overflow-x-auto">
            {TAB_LABELS.map((label, i) => {
              const Icon = TAB_ICONS[i];
              return (
                <button
                  key={label}
                  onClick={() => setActiveTab(i)}
                  className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-3 sm:py-4 text-xs sm:text-sm font-semibold transition-colors whitespace-nowrap border-b-2 shrink-0 ${
                    activeTab === i
                      ? "border-violet-500 text-violet-300 bg-violet-500/5"
                      : "border-transparent text-gray-500 hover:text-gray-300 hover:bg-gray-800/50"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  {label}
                </button>
              );
            })}
          </div>

          {/* Tab Content */}
          <div className="p-4 sm:p-6 lg:p-8">
            {/* Tab 1: Caesar Cipher */}
            {activeTab === 0 && (
              <div className="space-y-6 anim-step">
                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-semibold text-gray-400 mb-1.5">Input Text</label>
                    <input
                      type="text"
                      value={caesarInput}
                      onChange={e => setCaesarInput(e.target.value)}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
                      placeholder="Enter text..."
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-400 mb-1.5">Shift: {caesarShift}</label>
                    <input
                      type="range"
                      min={1}
                      max={25}
                      value={caesarShift}
                      onChange={e => setCaesarShift(parseInt(e.target.value))}
                      className="w-full accent-violet-500"
                    />
                    <div className="flex justify-between text-[10px] text-gray-500 mt-0.5">
                      <span>1</span><span>25</span>
                    </div>
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="bg-gray-800/60 border border-gray-700 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Lock className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-xs font-bold text-emerald-400 uppercase tracking-wide">Encrypted</span>
                    </div>
                    <p className="text-lg sm:text-xl font-mono font-bold text-emerald-300 break-all">{caesarEncrypted}</p>
                  </div>
                  <div className="bg-gray-800/60 border border-gray-700 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Unlock className="w-3.5 h-3.5 text-blue-400" />
                      <span className="text-xs font-bold text-blue-400 uppercase tracking-wide">Decrypted</span>
                    </div>
                    <p className="text-lg sm:text-xl font-mono font-bold text-blue-300 break-all">{caesarDecrypted}</p>
                  </div>
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-gray-400 mb-3">Substitution Table</h4>
                  <div className="grid grid-cols-13 sm:grid-cols-26 gap-1">
                    {caesarTable.map(({ original, shifted }) => (
                      <div key={original} className="text-center bg-gray-800/60 border border-gray-700 rounded p-1.5">
                        <div className="text-xs font-bold text-gray-300">{original}</div>
                        <div className="text-[11px] font-mono text-violet-400">↓</div>
                        <div className="text-xs font-bold text-violet-300">{shifted}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Tab 2: RSA Demo */}
            {activeTab === 1 && (
              <div className="space-y-6 anim-step">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="bg-gray-800/60 border border-gray-700 rounded-lg p-4">
                    <span className="text-xs font-semibold text-gray-400">Prime p</span>
                    <p className="text-lg font-mono font-bold text-violet-300">{rsaP}</p>
                  </div>
                  <div className="bg-gray-800/60 border border-gray-700 rounded-lg p-4">
                    <span className="text-xs font-semibold text-gray-400">Prime q</span>
                    <p className="text-lg font-mono font-bold text-violet-300">{rsaQ}</p>
                  </div>
                </div>
                <button
                  onClick={generateRsaKeys}
                  className="px-5 py-2.5 bg-violet-600 hover:bg-violet-500 text-white text-sm font-bold rounded-lg transition flex items-center gap-2"
                >
                  <Key className="w-4 h-4" /> Generate Keys
                </button>
                {rsaKeys && (
                  <div className="space-y-4">
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
                      <div className="bg-gray-800/60 border border-gray-700 rounded-lg p-3">
                        <span className="text-[10px] font-semibold text-gray-500 uppercase">n = p × q</span>
                        <p className="text-sm font-mono font-bold text-white">{rsaKeys.n}</p>
                      </div>
                      <div className="bg-gray-800/60 border border-gray-700 rounded-lg p-3">
                        <span className="text-[10px] font-semibold text-gray-500 uppercase">φ(n)</span>
                        <p className="text-sm font-mono font-bold text-white">{rsaKeys.phi}</p>
                      </div>
                      <div className="bg-emerald-900/40 border border-emerald-800 rounded-lg p-3">
                        <span className="text-[10px] font-semibold text-emerald-400 uppercase">Public Key (e, n)</span>
                        <p className="text-sm font-mono font-bold text-emerald-300">({rsaKeys.e}, {rsaKeys.n})</p>
                      </div>
                      <div className="bg-red-900/40 border border-red-800 rounded-lg p-3">
                        <span className="text-[10px] font-semibold text-red-400 uppercase">Private Key (d, n)</span>
                        <p className="text-sm font-mono font-bold text-red-300">({rsaKeys.d}, {rsaKeys.n})</p>
                      </div>
                    </div>
                    <div className="border-t border-gray-800 pt-4">
                      <label className="block text-xs font-semibold text-gray-400 mb-1.5">Plaintext (number &lt; n)</label>
                      <input
                        type="number"
                        value={rsaPlaintext}
                        onChange={e => setRsaPlaintext(e.target.value)}
                        className="w-full max-w-xs bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
                        placeholder="Enter a number..."
                      />
                      {rsaPlaintext && rsaKeys && (
                        <div className="grid sm:grid-cols-2 gap-4 mt-4">
                          <div className="bg-gray-800/60 border border-gray-700 rounded-lg p-4">
                            <span className="text-xs font-semibold text-amber-400">Ciphertext = m^e mod n</span>
                            <p className="text-lg font-mono font-bold text-amber-300 break-all">{rsaCiphertext}</p>
                          </div>
                          <div className="bg-gray-800/60 border border-gray-700 rounded-lg p-4">
                            <span className="text-xs font-semibold text-blue-400">Decrypted = c^d mod n</span>
                            <p className="text-lg font-mono font-bold text-blue-300 break-all">{rsaDecrypted}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Tab 3: AES Visualization */}
            {activeTab === 2 && (
              <div className="space-y-6 anim-step">
                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-1.5">Input Text</label>
                  <input
                    type="text"
                    value={aesInput}
                    onChange={e => setAesInput(e.target.value.slice(0, 16))}
                    className="w-full max-w-xs bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
                    placeholder="Up to 16 chars..."
                  />
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  {AES_STEPS.map((step, i) => (
                    <button
                      key={step}
                      onClick={() => setAesStep(i === aesStep ? 0 : i)}
                      className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition-colors ${
                        i === aesStep
                          ? "bg-violet-600 border-violet-500 text-white"
                          : "bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-600"
                      }`}
                    >
                      {i}. {step}
                    </button>
                  ))}
                  <button
                    onClick={() => setAesStep(prev => (prev + 1) % AES_STEPS.length)}
                    className="px-3 py-1.5 text-xs font-bold rounded-lg bg-violet-600 hover:bg-violet-500 text-white border border-violet-500 transition flex items-center gap-1.5"
                  >
                    <Play className="w-3 h-3" /> Step Through
                  </button>
                </div>
                <div className="bg-gray-800/60 border border-gray-700 rounded-xl p-4 sm:p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <div className={`w-6 h-6 rounded-md ${AES_COLORS[aesStep]} flex items-center justify-center text-[10px] font-bold text-white`}>
                      {aesStep + 1}
                    </div>
                    <h4 className="text-sm font-bold text-white">Step: {AES_STEPS[aesStep]}</h4>
                  </div>
                  <div className="grid grid-cols-4 gap-1.5 sm:gap-2 max-w-xs mx-auto">
                    {aesMatrix.flat().map((byte, idx) => {
                      const highlight = aesStep === 1 || aesStep === 5 || (aesStep === 2);
                      const rowShifted = aesStep === 3;
                      const mixed = aesStep === 4;
                      const isFinal = aesStep === 6;
                      let cellColor = "bg-gray-800 border-gray-700 text-gray-400";
                      if (isFinal) cellColor = "bg-emerald-900/60 border-emerald-700 text-emerald-300";
                      else if (highlight) cellColor = "bg-violet-900/60 border-violet-700 text-violet-300";
                      else if (rowShifted) cellColor = "bg-blue-900/60 border-blue-700 text-blue-300";
                      else if (mixed) cellColor = "bg-amber-900/60 border-amber-700 text-amber-300";
                      return (
                        <div
                          key={idx}
                          className={`matrix-cell aspect-square rounded-lg border flex items-center justify-center text-[10px] sm:text-xs font-mono font-bold ${cellColor}`}
                        >
                          {byte.toString(16).padStart(2, "0").toUpperCase()}
                        </div>
                      );
                    })}
                  </div>
                  <div className="flex justify-center gap-4 sm:gap-8 mt-4 text-[10px] text-gray-500">
                    <span>Col 0</span><span>Col 1</span><span>Col 2</span><span>Col 3</span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-3 text-xs text-gray-500">
                  {AES_STEPS.map((step, i) => (
                    <div key={step} className="flex items-center gap-1.5">
                      <div className={`w-3 h-3 rounded ${AES_COLORS[i]}`} />
                      <span>{i}. {step}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab 4: Hash Generator */}
            {activeTab === 3 && (
              <div className="space-y-6 anim-step">
                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-1.5">Input Text</label>
                  <input
                    type="text"
                    value={hashInput}
                    onChange={e => setHashInput(e.target.value)}
                    className="w-full max-w-md bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
                    placeholder="Enter text to hash..."
                  />
                </div>
                <div className="grid gap-3">
                  {Object.entries(hashResults).map(([algo, hash], idx) => {
                    const colors = [
                      { bg: "bg-emerald-900/30 border-emerald-800", badge: "bg-emerald-600", text: "text-emerald-300" },
                      { bg: "bg-blue-900/30 border-blue-800", badge: "bg-blue-600", text: "text-blue-300" },
                      { bg: "bg-violet-900/30 border-violet-800", badge: "bg-violet-600", text: "text-violet-300" },
                      { bg: "bg-amber-900/30 border-amber-800", badge: "bg-amber-600", text: "text-amber-300" },
                    ];
                    const c = colors[idx];
                    return (
                      <div key={algo} className={`${c.bg} border rounded-lg p-3 sm:p-4 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4`}>
                        <span className={`${c.badge} px-2 py-0.5 rounded text-[10px] font-bold text-white shrink-0`}>{algo}</span>
                        <code className={`${c.text} font-mono text-[10px] sm:text-xs break-all flex-1`}>{hash}</code>
                        <button
                          onClick={() => copyHash(algo)}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg text-[10px] font-semibold text-gray-300 transition shrink-0"
                        >
                          {copied && copiedHash === algo ? (
                            <><Check className="w-3 h-3 text-emerald-400" /> Copied</>
                          ) : (
                            <><Copy className="w-3 h-3" /> Copy</>
                          )}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Algorithm Comparison Table */}
        <div className="mb-10">
          <h2 className="text-lg sm:text-xl font-bold text-white mb-4">Algorithm Comparison</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-xs sm:text-sm border-collapse">
              <thead>
                <tr className="bg-gray-800/80 border-b border-gray-700">
                  <th className="text-left px-3 sm:px-4 py-3 font-bold text-gray-300">Algorithm</th>
                  <th className="text-left px-3 sm:px-4 py-3 font-bold text-gray-300">Type</th>
                  <th className="text-left px-3 sm:px-4 py-3 font-bold text-gray-300">Key Size</th>
                  <th className="text-left px-3 sm:px-4 py-3 font-bold text-gray-300">Speed</th>
                  <th className="text-left px-3 sm:px-4 py-3 font-bold text-gray-300">Use Case</th>
                </tr>
              </thead>
              <tbody>
                {COMPARISON_ROWS.map((row, i) => (
                  <tr key={row.algo} className={`border-b border-gray-800 ${i % 2 === 0 ? "bg-gray-900/40" : "bg-gray-900/20"}`}>
                    <td className="px-3 sm:px-4 py-3 font-bold text-white">{row.algo}</td>
                    <td className="px-3 sm:px-4 py-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        row.type === "Symmetric" ? "bg-blue-900/50 text-blue-300" : "bg-violet-900/50 text-violet-300"
                      }`}>{row.type}</span>
                    </td>
                    <td className="px-3 sm:px-4 py-3 text-gray-400 font-mono text-[11px]">{row.keySize}</td>
                    <td className="px-3 sm:px-4 py-3">
                      <span className={`font-semibold ${
                        row.speed === "Fast" ? "text-emerald-400" : row.speed === "Slow" ? "text-red-400" : "text-amber-400"
                      }`}>{row.speed}</span>
                    </td>
                    <td className="px-3 sm:px-4 py-3 text-gray-400">{row.use}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Interview Questions */}
        <div className="mb-10">
          <h2 className="text-lg sm:text-xl font-bold text-white mb-4">
            <BookOpen className="w-4 h-4 inline mr-2 text-violet-400" />
            Cryptography Interview Questions
          </h2>
          <div className="space-y-3">
            {INTERVIEW_QS.map((item, i) => (
              <details key={i} className="bg-gray-900/60 border border-gray-800 rounded-lg group">
                <summary className="px-4 sm:px-5 py-3 sm:py-4 flex items-center justify-between cursor-pointer text-xs sm:text-sm font-semibold text-gray-200 hover:text-violet-300 transition-colors list-none">
                  <span>{i + 1}. {item.q}</span>
                  <ChevronRight className="w-4 h-4 text-gray-500 group-open:rotate-90 transition-transform shrink-0" />
                </summary>
                <div className="px-4 sm:px-5 pb-4 text-xs sm:text-sm text-gray-400 leading-relaxed border-t border-gray-800 pt-3">
                  {item.a}
                </div>
              </details>
            ))}
          </div>
        </div>

        {/* Code Examples */}
        <div className="mb-12">
          <h2 className="text-lg sm:text-xl font-bold text-white mb-4">
            <Code2 className="w-4 h-4 inline mr-2 text-violet-400" />
            AES Encryption Code Examples
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {CODE_SNIPPETS.map((snippet) => (
              <div key={snippet.lang} className="bg-gray-900/80 border border-gray-800 rounded-xl overflow-hidden">
                <div className="flex items-center gap-2 px-4 py-2.5 bg-gray-800/60 border-b border-gray-800">
                  <Code2 className="w-3.5 h-3.5 text-violet-400" />
                  <span className="text-xs font-bold text-gray-300">{snippet.lang}</span>
                </div>
                <pre className="p-4 text-[10px] sm:text-[11px] leading-relaxed text-gray-300 font-mono overflow-x-auto whitespace-pre">{snippet.code}</pre>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
