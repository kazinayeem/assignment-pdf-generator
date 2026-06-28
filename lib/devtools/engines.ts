import * as yaml from "js-yaml";
import type { DevToolDefinition, DevToolEngine, DevToolOperation, ToolResult, ToolTransformOptions } from "./types";

const SAMPLE_JSON = `{
  "name": "CampusFlow",
  "version": "2.0",
  "features": ["tools", "calculators", "devtools"],
  "active": true
}`;

const SAMPLE_YAML = `name: CampusFlow
version: "2.0"
features:
  - tools
  - calculators
active: true`;

const SAMPLE_XML = `<?xml version="1.0" encoding="UTF-8"?>
<root>
  <name>CampusFlow</name>
  <version>2.0</version>
</root>`;

const SAMPLE_CSV = `name,role,active
CampusFlow,platform,true
DevTools,module,true`;

export function getSampleInput(tool: DevToolDefinition): string {
  if (tool.sampleInput) return tool.sampleInput;
  if (tool.engine === "json" || tool.operation === "to-json") return SAMPLE_JSON;
  if (tool.engine === "yaml") return SAMPLE_YAML;
  if (tool.engine === "xml") return SAMPLE_XML;
  if (tool.engine === "csv") return SAMPLE_CSV;
  if (tool.engine === "css") return `.card {\n  padding: 1rem;\n  border-radius: 12px;\n  background: #fff;\n}`;
  if (tool.engine === "encoding") return "Hello, CampusFlow!";
  if (tool.engine === "jwt") return "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkNhbXB1c0Zsb3ciLCJpYXQiOjE1MTYyMzkwMjJ9.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";
  return "";
}

// ─── JSON helpers ───────────────────────────────────────────────
function parseJson(input: string): unknown {
  return JSON.parse(input.trim());
}

function jsonToTypeScript(obj: unknown, name = "Root"): string {
  if (obj === null) return "null";
  if (Array.isArray(obj)) {
    if (obj.length === 0) return "unknown[]";
    return `${jsonToTypeScript(obj[0], name)}[]`;
  }
  if (typeof obj === "object") {
    const entries = Object.entries(obj as Record<string, unknown>);
    const props = entries.map(([k, v]) => {
      const key = /^[a-zA-Z_$][\w$]*$/.test(k) ? k : `"${k}"`;
      return `  ${key}: ${jsonToTypeScript(v, k)};`;
    });
    return `{\n${props.join("\n")}\n}`;
  }
  if (typeof obj === "string") return "string";
  if (typeof obj === "number") return "number";
  if (typeof obj === "boolean") return "boolean";
  return "unknown";
}

function jsonToInterface(obj: unknown, name = "Root"): string {
  const body = jsonToTypeScript(obj, name);
  return `export interface ${name} ${body}`;
}

function jsonToCsv(data: unknown): string {
  const rows: Record<string, unknown>[] = Array.isArray(data)
    ? data
    : typeof data === "object" && data !== null
      ? [data as Record<string, unknown>]
      : [];
  if (rows.length === 0) return "";
  const keys = [...new Set(rows.flatMap((r) => Object.keys(r)))];
  const header = keys.join(",");
  const lines = rows.map((row) =>
    keys.map((k) => {
      const v = row[k];
      const s = v === null || v === undefined ? "" : String(v);
      return s.includes(",") || s.includes('"') ? `"${s.replace(/"/g, '""')}"` : s;
    }).join(",")
  );
  return [header, ...lines].join("\n");
}

function csvToJson(input: string): string {
  const lines = input.trim().split(/\r?\n/).filter(Boolean);
  if (lines.length === 0) return "[]";
  const headers = parseCsvLine(lines[0]);
  const rows = lines.slice(1).map((line) => {
    const vals = parseCsvLine(line);
    return headers.reduce<Record<string, string>>((acc, h, i) => {
      acc[h] = vals[i] ?? "";
      return acc;
    }, {});
  });
  return JSON.stringify(rows, null, 2);
}

function parseCsvLine(line: string): string[] {
  const result: string[] = [];
  let cur = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') { cur += '"'; i++; }
      else inQuotes = !inQuotes;
    } else if (ch === "," && !inQuotes) {
      result.push(cur); cur = "";
    } else cur += ch;
  }
  result.push(cur);
  return result;
}

function xmlToJson(xml: string): string {
  const parser = new DOMParser();
  const doc = parser.parseFromString(xml, "text/xml");
  if (doc.querySelector("parsererror")) throw new Error("Invalid XML");
  return JSON.stringify(xmlNodeToObj(doc.documentElement), null, 2);
}

function xmlNodeToObj(node: Element): unknown {
  const kids = [...node.children];
  if (kids.length === 0) {
    const t = node.textContent?.trim() ?? "";
    return t === "true" ? true : t === "false" ? false : !isNaN(Number(t)) && t !== "" ? Number(t) : t;
  }
  const obj: Record<string, unknown> = {};
  for (const child of kids) {
    const val = xmlNodeToObj(child);
    const name = child.tagName;
    if (obj[name] !== undefined) {
      if (!Array.isArray(obj[name])) obj[name] = [obj[name]];
      (obj[name] as unknown[]).push(val);
    } else obj[name] = val;
  }
  return obj;
}

function jsonToXml(data: unknown, tag = "root"): string {
  if (data === null || data === undefined) return `<${tag}/>`;
  if (typeof data !== "object") return `<${tag}>${escapeXml(String(data))}</${tag}>`;
  if (Array.isArray(data)) {
    return data.map((item, i) => jsonToXml(item, `item${i}`)).join("\n");
  }
  const entries = Object.entries(data as Record<string, unknown>);
  const inner = entries.map(([k, v]) => jsonToXml(v, k.replace(/[^a-zA-Z0-9_-]/g, "_"))).join("\n");
  return `<${tag}>\n${inner}\n</${tag}>`;
}

function escapeXml(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function prettifyXml(xml: string): string {
  const formatted = xml.replace(/>\s*</g, ">\n<");
  let pad = 0;
  return formatted.split("\n").map((line) => {
    const trimmed = line.trim();
    if (trimmed.match(/^<\/.+>/)) pad = Math.max(0, pad - 1);
    const out = "  ".repeat(pad) + trimmed;
    if (trimmed.match(/^<[^!?/][^>]*[^/]>$/)) pad++;
    return out;
  }).join("\n");
}

function minifyXml(xml: string): string {
  return xml.replace(/>\s+</g, "><").replace(/\s+/g, " ").trim();
}

// ─── CSS helpers ────────────────────────────────────────────────
function beautifyCss(css: string): string {
  return css
    .replace(/\{/g, " {\n  ")
    .replace(/;/g, ";\n  ")
    .replace(/\}/g, "\n}\n")
    .replace(/\n\s*\n/g, "\n")
    .replace(/  \}/g, "}")
    .trim();
}

function minifyCss(css: string): string {
  return css.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\s+/g, " ").replace(/\s*([{}:;,])\s*/g, "$1").trim();
}

// ─── Encoding ─────────────────────────────────────────────────
function encodeBase64(s: string) {
  try { return btoa(unescape(encodeURIComponent(s))); }
  catch { return btoa(s); }
}

function decodeBase64(s: string) {
  try { return decodeURIComponent(escape(atob(s.trim()))); }
  catch { return atob(s.trim()); }
}

// ─── Generators ───────────────────────────────────────────────
export function generateUuid(): string {
  return crypto.randomUUID();
}

export function generateNanoid(size = 21): string {
  const alphabet = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz_-";
  const bytes = new Uint8Array(size);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => alphabet[b % alphabet.length]).join("");
}

export function generatePassword(len = 16, opts?: { upper?: boolean; lower?: boolean; numbers?: boolean; symbols?: boolean }): string {
  const upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const lower = "abcdefghijklmnopqrstuvwxyz";
  const numbers = "0123456789";
  const symbols = "!@#$%^&*()_+-=[]{}|;:,.<>?";
  let chars = "";
  if (opts?.upper !== false) chars += upper;
  if (opts?.lower !== false) chars += lower;
  if (opts?.numbers !== false) chars += numbers;
  if (opts?.symbols) chars += symbols;
  if (!chars) chars = upper + lower + numbers;
  const bytes = new Uint8Array(len);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => chars[b % chars.length]).join("");
}

export function passwordStrength(pw: string): { score: number; label: string; tips: string[] } {
  let score = 0;
  const tips: string[] = [];
  if (pw.length >= 8) score++; else tips.push("Use at least 8 characters");
  if (pw.length >= 12) score++;
  if (/[a-z]/.test(pw) && /[A-Z]/.test(pw)) score++; else tips.push("Mix upper and lower case");
  if (/\d/.test(pw)) score++; else tips.push("Add numbers");
  if (/[^a-zA-Z0-9]/.test(pw)) score++; else tips.push("Add symbols");
  const labels = ["Very Weak", "Weak", "Fair", "Good", "Strong", "Excellent"];
  return { score, label: labels[Math.min(score, 5)], tips };
}

export async function hashText(text: string, algo: string): Promise<string> {
  const algorithms: Record<string, AlgorithmIdentifier> = {
    "SHA-256": "SHA-256",
    "SHA-384": "SHA-384",
    "SHA-512": "SHA-512",
  };
  const algorithm = algorithms[algo] ?? "SHA-256";
  const enc = new TextEncoder();
  const buf = await crypto.subtle.digest(algorithm, enc.encode(text));
  return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, "0")).join("");
}

function decodeJwt(token: string): string {
  const parts = token.trim().split(".");
  if (parts.length < 2) throw new Error("Invalid JWT format");
  const decode = (p: string) => JSON.parse(decodeURIComponent(escape(atob(p.replace(/-/g, "+").replace(/_/g, "/")))));
  return JSON.stringify({ header: decode(parts[0]), payload: decode(parts[1]), signature: parts[2] ?? "" }, null, 2);
}

function encodeJwt(header: string, payload: string): string {
  const enc = (obj: string) => {
    const parsed = JSON.parse(obj);
    return btoa(unescape(encodeURIComponent(JSON.stringify(parsed)))).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  };
  const h = enc(header);
  const p = enc(payload);
  return `${h}.${p}.unsigned`;
}

function timestampConvert(input: string, mode: string): string {
  const n = input.trim();
  if (mode === "unix-to-date") {
    const ms = n.length <= 10 ? Number(n) * 1000 : Number(n);
    return new Date(ms).toISOString();
  }
  const d = new Date(n);
  if (isNaN(d.getTime())) throw new Error("Invalid date");
  return JSON.stringify({ iso: d.toISOString(), unix: Math.floor(d.getTime() / 1000), ms: d.getTime() }, null, 2);
}

function loremIpsum(paragraphs = 3): string {
  const words = "lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua".split(" ");
  return Array.from({ length: paragraphs }, () => {
    const len = 40 + Math.floor(Math.random() * 30);
    const sentence = Array.from({ length: len }, () => words[Math.floor(Math.random() * words.length)]).join(" ");
    return sentence.charAt(0).toUpperCase() + sentence.slice(1) + ".";
  }).join("\n\n");
}

// ─── Network ────────────────────────────────────────────────────
function cidrCalc(cidr: string): string {
  const [ip, bitsStr] = cidr.split("/");
  const bits = Number(bitsStr);
  if (!ip || isNaN(bits) || bits < 0 || bits > 32) throw new Error("Invalid CIDR notation");
  const octets = ip.split(".").map(Number);
  if (octets.length !== 4 || octets.some((o) => isNaN(o) || o < 0 || o > 255)) throw new Error("Invalid IP");
  const mask = bits === 0 ? 0 : (~0 << (32 - bits)) >>> 0;
  const ipNum = octets.reduce((a, o) => (a << 8) + o, 0) >>> 0;
  const network = (ipNum & mask) >>> 0;
  const broadcast = (network | (~mask >>> 0)) >>> 0;
  const hosts = bits >= 31 ? 0 : Math.pow(2, 32 - bits) - 2;
  const fmt = (n: number) => [(n >>> 24) & 255, (n >>> 16) & 255, (n >>> 8) & 255, n & 255].join(".");
  return JSON.stringify({
    cidr, network: fmt(network), broadcast: fmt(broadcast),
    mask: fmt(mask), usableHosts: hosts, firstHost: bits < 31 ? fmt(network + 1) : "N/A",
    lastHost: bits < 31 ? fmt(broadcast - 1) : "N/A",
  }, null, 2);
}

function parseUserAgent(ua: string): string {
  const isMobile = /Mobile|Android|iPhone/i.test(ua);
  const browser = ua.match(/(Firefox|Chrome|Safari|Edge|Opera)\/[\d.]+/)?.[0] ?? "Unknown";
  const os = ua.match(/\(([^)]+)\)/)?.[1] ?? "Unknown";
  return JSON.stringify({ browser, os, mobile: isMobile, raw: ua }, null, 2);
}

const PORT_REFERENCE = `Common Ports Reference:
21   FTP          22   SSH          23   Telnet
25   SMTP         53   DNS          80   HTTP
110  POP3         143  IMAP         443  HTTPS
3306 MySQL        5432 PostgreSQL   6379 Redis
27017 MongoDB     8080 HTTP Alt     8443 HTTPS Alt`;

// ─── Main transform ─────────────────────────────────────────────
export function runToolTransform(
  engine: DevToolEngine,
  operation: DevToolOperation,
  opts: ToolTransformOptions
): ToolResult {
  const { input, inputB } = opts;
  try {
    switch (engine) {
      case "json": {
        switch (operation) {
          case "view":
          case "format":
          case "prettify":
            return { output: JSON.stringify(parseJson(input), null, 2) };
          case "minify":
            return { output: JSON.stringify(parseJson(input)) };
          case "validate": {
            parseJson(input);
            return { output: "✓ Valid JSON" };
          }
          case "compare": {
            const a = parseJson(input);
            const b = parseJson(inputB ?? "{}");
            return { output: JSON.stringify(a) === JSON.stringify(b) ? "✓ Identical" : "✗ Different\n\nA:\n" + JSON.stringify(a, null, 2) + "\n\nB:\n" + JSON.stringify(b, null, 2) };
          }
          case "to-csv":
            return { output: jsonToCsv(parseJson(input)) };
          case "to-yaml":
            return { output: yaml.dump(parseJson(input), { lineWidth: 120 }) };
          case "to-xml":
            return { output: '<?xml version="1.0" encoding="UTF-8"?>\n' + jsonToXml(parseJson(input)) };
          case "to-typescript":
            return { output: `type Root = ${jsonToTypeScript(parseJson(input))};` };
          case "to-interface":
            return { output: jsonToInterface(parseJson(input)) };
          case "tree":
            return { output: JSON.stringify(parseJson(input), null, 2) };
          default:
            return { output: JSON.stringify(parseJson(input), null, 2) };
        }
      }
      case "yaml": {
        switch (operation) {
          case "format":
          case "prettify":
            return { output: yaml.dump(yaml.load(input), { lineWidth: 120 }) };
          case "validate":
            yaml.load(input);
            return { output: "✓ Valid YAML" };
          case "to-json":
            return { output: JSON.stringify(yaml.load(input), null, 2) };
          default:
            return { output: yaml.dump(yaml.load(input), { lineWidth: 120 }) };
        }
      }
      case "xml": {
        switch (operation) {
          case "format":
          case "beautify":
          case "prettify":
            return { output: prettifyXml(input) };
          case "minify":
            return { output: minifyXml(input) };
          case "validate": {
            const doc = new DOMParser().parseFromString(input, "text/xml");
            if (doc.querySelector("parsererror")) throw new Error("Invalid XML");
            return { output: "✓ Valid XML" };
          }
          case "to-json":
            return { output: xmlToJson(input) };
          default:
            return { output: prettifyXml(input) };
        }
      }
      case "csv": {
        switch (operation) {
          case "to-json":
            return { output: csvToJson(input) };
          case "format": {
            const json = csvToJson(input);
            return { output: jsonToCsv(JSON.parse(json)) };
          }
          case "parse":
            return { output: csvToJson(input) };
          case "filter": {
            const q = String(opts.options?.query ?? "").toLowerCase();
            const rows = JSON.parse(csvToJson(input)) as Record<string, string>[];
            const filtered = q ? rows.filter((r) => Object.values(r).some((v) => v.toLowerCase().includes(q))) : rows;
            return { output: jsonToCsv(filtered) };
          }
          default:
            return { output: input };
        }
      }
      case "css": {
        switch (operation) {
          case "format":
          case "beautify":
          case "prettify":
            return { output: beautifyCss(input) };
          case "minify":
            return { output: minifyCss(input) };
          case "gradient": {
            const c1 = String(opts.options?.color1 ?? "#6D5DF6");
            const c2 = String(opts.options?.color2 ?? "#06B6D4");
            return { output: `.gradient {\n  background: linear-gradient(135deg, ${c1} 0%, ${c2} 100%);\n}` };
          }
          case "shadow": {
            const x = opts.options?.x ?? 0;
            const y = opts.options?.y ?? 8;
            const blur = opts.options?.blur ?? 24;
            const color = opts.options?.color ?? "rgba(109, 93, 246, 0.25)";
            return { output: `.shadow {\n  box-shadow: ${x}px ${y}px ${blur}px ${color};\n}` };
          }
          case "border-radius":
            return { output: `.rounded {\n  border-radius: ${opts.options?.radius ?? 16}px;\n}` };
          case "animation":
            return { output: `@keyframes fadeIn {\n  from { opacity: 0; transform: translateY(8px); }\n  to { opacity: 1; transform: translateY(0); }\n}\n\n.animated {\n  animation: fadeIn ${opts.options?.duration ?? 0.6}s ease-out;\n}` };
          case "glass":
            return { output: `.glass {\n  background: rgba(255, 255, 255, 0.72);\n  backdrop-filter: blur(16px);\n  border: 1px solid rgba(255, 255, 255, 0.3);\n  border-radius: 16px;\n}` };
          case "neumorphism":
            return { output: `.neumorphic {\n  background: #e0e0e0;\n  border-radius: 20px;\n  box-shadow: 8px 8px 16px #bebebe, -8px -8px 16px #ffffff;\n}` };
          case "clamp":
            return { output: `.fluid {\n  font-size: clamp(${opts.options?.min ?? 14}px, ${opts.options?.pref ?? "2vw"}, ${opts.options?.max ?? 24}px);\n}` };
          default:
            return { output: beautifyCss(input) };
        }
      }
      case "encoding": {
        const op = operation;
        if (op === "encode") {
          const type = String(opts.options?.type ?? "base64");
          if (type === "base64") return { output: encodeBase64(input) };
          if (type === "url") return { output: encodeURIComponent(input) };
          if (type === "html") return { output: input.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;") };
          if (type === "unicode") return { output: [...input].map((c) => "\\u" + c.charCodeAt(0).toString(16).padStart(4, "0")).join("") };
          if (type === "hex") return { output: [...input].map((c) => c.charCodeAt(0).toString(16).padStart(2, "0")).join(" ") };
          if (type === "binary") return { output: [...input].map((c) => c.charCodeAt(0).toString(2).padStart(8, "0")).join(" ") };
          if (type === "ascii") return { output: [...input].map((c) => c.charCodeAt(0)).join(" ") };
        }
        if (op === "decode") {
          const type = String(opts.options?.type ?? "base64");
          if (type === "base64") return { output: decodeBase64(input) };
          if (type === "url") return { output: decodeURIComponent(input) };
          if (type === "html") return { output: input.replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"') };
          if (type === "hex") return { output: String.fromCharCode(...input.trim().split(/\s+/).map((h) => parseInt(h, 16))) };
          if (type === "binary") return { output: String.fromCharCode(...input.trim().split(/\s+/).map((b) => parseInt(b, 2))) };
          if (type === "ascii") return { output: String.fromCharCode(...input.trim().split(/\s+/).map(Number)) };
        }
        return { output: input };
      }
      case "uuid":
        return { output: generateUuid() };
      case "nanoid":
        return { output: generateNanoid(Number(opts.options?.size ?? 21)) };
      case "password": {
        if (operation === "strength") {
          const r = passwordStrength(input);
          return { output: `Strength: ${r.label} (${r.score}/5)\n${r.tips.length ? "Tips:\n- " + r.tips.join("\n- ") : "Great password!"}` };
        }
        return { output: generatePassword(Number(opts.options?.length ?? 16), { symbols: Boolean(opts.options?.symbols) }) };
      }
      case "jwt": {
        if (operation === "decode-jwt") return { output: decodeJwt(input) };
        if (operation === "encode-jwt") {
          const [header, payload] = input.split("\n---\n");
          return { output: encodeJwt(header || '{"alg":"HS256","typ":"JWT"}', payload || '{"sub":"user"}') };
        }
        return { output: decodeJwt(input) };
      }
      case "timestamp":
        return { output: timestampConvert(input, String(opts.options?.mode ?? "unix-to-date")) };
      case "lorem":
        return { output: loremIpsum(Number(opts.options?.paragraphs ?? 3)) };
      case "random": {
        const type = String(opts.options?.type ?? "string");
        const len = Number(opts.options?.length ?? 10);
        if (type === "number") {
          const min = Number(opts.options?.min ?? 1);
          const max = Number(opts.options?.max ?? 100);
          return { output: String(Math.floor(Math.random() * (max - min + 1)) + min) };
        }
        return { output: generateNanoid(len) };
      }
      case "network": {
        switch (operation) {
          case "cidr":
            return { output: cidrCalc(input) };
          case "subnet":
            return { output: cidrCalc(input.includes("/") ? input : `${input}/24`) };
          case "user-agent":
            return { output: parseUserAgent(input) };
          case "ports":
            return { output: PORT_REFERENCE };
          case "dns":
            return { output: "DNS Lookup requires a backend API. Use your system resolver or a DNS service.\n\nExample: nslookup campusflow.com" };
          case "ip":
            return { output: JSON.stringify({ input, note: "Full IP geolocation requires an external API.", private: /^(10\.|172\.(1[6-9]|2\d|3[01])\.|192\.168\.)/.test(input) }, null, 2) };
          case "headers": {
            try {
              const lines = input.split("\n").filter(Boolean);
              const obj: Record<string, string> = {};
              lines.forEach((l) => { const i = l.indexOf(":"); if (i > 0) obj[l.slice(0, i).trim()] = l.slice(i + 1).trim(); });
              return { output: JSON.stringify(obj, null, 2) };
            } catch { return { output: input }; }
          }
          default:
            return { output: input };
        }
      }
      case "svg": {
        switch (operation) {
          case "minify":
          case "compress":
          case "clean":
            return { output: input.replace(/<!--[\s\S]*?-->/g, "").replace(/\s+/g, " ").replace(/>\s+</g, "><").trim() };
          case "to-jsx": {
            const jsx = input
              .replace(/class=/g, "className=")
              .replace(/stroke-width=/g, "strokeWidth=")
              .replace(/fill-rule=/g, "fillRule=")
              .replace(/clip-rule=/g, "clipRule=")
              .replace(/xmlns:xlink/g, "xmlnsXlink");
            return { output: `const Icon = () => (\n  ${jsx}\n);\n\nexport default Icon;` };
          }
          case "to-react":
            return { output: `import React from 'react';\n\nexport function SvgIcon(props: React.SVGProps<SVGSVGElement>) {\n  return (\n    ${input.replace("<svg", "<svg {...props}")}\n  );\n}` };
          default:
            return { output: input };
        }
      }
      case "color": {
        const hex = input.trim().replace("#", "");
        if (operation === "convert" && /^[0-9a-fA-F]{6}$/.test(hex)) {
          const r = parseInt(hex.slice(0, 2), 16);
          const g = parseInt(hex.slice(2, 4), 16);
          const b = parseInt(hex.slice(4, 6), 16);
          const hsl = rgbToHsl(r, g, b);
          return { output: JSON.stringify({ hex: `#${hex}`, rgb: { r, g, b }, hsl }, null, 2) };
        }
        if (operation === "random-palette") {
          const colors = Array.from({ length: 5 }, () => "#" + Math.floor(Math.random() * 16777215).toString(16).padStart(6, "0"));
          return { output: colors.join("\n") };
        }
        if (operation === "gradient") {
          const c1 = input || "#6D5DF6";
          const c2 = String(opts.options?.color2 ?? "#06B6D4");
          return { output: `linear-gradient(135deg, ${c1} 0%, ${c2} 100%)` };
        }
        if (operation === "contrast" || operation === "a11y") {
          const [fg, bg] = (input + "," + (opts.options?.bg ?? "#ffffff")).split(",");
          const ratio = contrastRatio(fg.trim(), bg.trim());
          return { output: `Contrast ratio: ${ratio.toFixed(2)}:1\nWCAG AA (normal text): ${ratio >= 4.5 ? "Pass ✓" : "Fail ✗"}\nWCAG AA (large text): ${ratio >= 3 ? "Pass ✓" : "Fail ✗"}` };
        }
        return { output: input };
      }
      case "tailwind": {
        if (operation === "shadow") return { output: "shadow-lg shadow-[#6D5DF6]/25" };
        if (operation === "spacing") return { output: `p-${opts.options?.size ?? 4} m-${opts.options?.size ?? 4} gap-${opts.options?.size ?? 4}` };
        if (operation === "config") return { output: `/** @type {import('tailwindcss').Config} */\nmodule.exports = {\n  content: ['./app/**/*.{js,ts,jsx,tsx}'],\n  theme: { extend: { colors: { brand: '#6D5DF6' } } },\n  plugins: [],\n};` };
        return { output: `flex items-center justify-center p-4 rounded-2xl bg-brand text-white` };
      }
      default:
        return { output: input, error: "Use the interactive panel for this tool." };
    }
  } catch (e) {
    return { output: "", error: e instanceof Error ? e.message : "Processing failed" };
  }
}

function rgbToHsl(r: number, g: number, b: number) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}

function contrastRatio(fg: string, bg: string) {
  const lum = (hex: string) => {
    const h = hex.replace("#", "");
    const [r, g, b] = [0, 2, 4].map((i) => {
      const c = parseInt(h.slice(i, i + 2), 16) / 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };
  const l1 = lum(fg.startsWith("#") ? fg : "#000000");
  const l2 = lum(bg.startsWith("#") ? bg : "#ffffff");
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

export async function runAsyncTool(
  engine: DevToolEngine,
  operation: DevToolOperation,
  opts: ToolTransformOptions
): Promise<ToolResult> {
  if (engine === "hash") {
    const algo = String(opts.options?.algo ?? "SHA-256");
    const hash = await hashText(opts.input, algo);
    return { output: hash };
  }
  return runToolTransform(engine, operation, opts);
}
