"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Container, ChevronRight, BookOpen, FileCode2, Network,
  Play, RotateCcw, Layers, Terminal, Copy, Check
} from "lucide-react";

const LIFECYCLE_STEPS = [
  { label: "Dockerfile", desc: "Define the image layers", color: "bg-blue-500" },
  { label: "docker build", desc: "Build image from Dockerfile", color: "bg-indigo-500" },
  { label: "Image", desc: "Immutable artifact stored locally/registry", color: "bg-violet-500" },
  { label: "docker run", desc: "Create & start a container", color: "bg-purple-500" },
  { label: "Running Container", desc: "Isolated process with its own FS", color: "bg-pink-500" },
  { label: "docker stop", desc: "Gracefully stop the container", color: "bg-amber-500" },
  { label: "Stopped Container", desc: "Container exists but not running", color: "bg-orange-500" },
  { label: "docker rm", desc: "Remove the container", color: "bg-red-500" },
];

const DOCKERFILE = `FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build

FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
EXPOSE 3000
CMD ["node", "dist/index.js"]`;

const COMPOSE = `version: "3.8"
services:
  web:
    build: .
    ports:
      - "3000:3000"
    depends_on:
      - db
    environment:
      - DATABASE_URL=postgres://user:pass@db:5432/app

  db:
    image: postgres:15
    volumes:
      - pgdata:/var/lib/postgresql/data
    environment:
      POSTGRES_USER: user
      POSTGRES_PASSWORD: pass

volumes:
  pgdata:`;

const COMMANDS = [
  { cmd: "docker ps", desc: "List running containers" },
  { cmd: "docker ps -a", desc: "List all containers" },
  { cmd: "docker images", desc: "List images" },
  { cmd: "docker build -t app .", desc: "Build image" },
  { cmd: "docker run -d -p 8080:80 nginx", desc: "Run container detached" },
  { cmd: "docker exec -it cont bash", desc: "Shell into container" },
  { cmd: "docker logs -f cont", desc: "Follow container logs" },
  { cmd: "docker stop cont", desc: "Stop container" },
  { cmd: "docker rm cont", desc: "Remove container" },
  { cmd: "docker rmi img", desc: "Remove image" },
  { cmd: "docker compose up -d", desc: "Start Compose services" },
  { cmd: "docker compose down", desc: "Stop Compose services" },
];

const NETWORK_MODES = [
  { mode: "bridge", desc: "Default network. Containers communicate via IP on a private subnet." },
  { mode: "host", desc: "Container uses host's network stack directly. No isolation." },
  { mode: "none", desc: "No network interfaces except loopback." },
  { mode: "overlay", desc: "Multi-host networking for Swarm/Kubernetes." },
];

const INTERVIEW_QS = [
  {
    q: "What is the difference between an image and a container?",
    a: "An image is an immutable, read-only template with instructions for creating a container. A container is a runnable instance of an image — it has a writable layer on top of the image layers and runs as an isolated process on the host."
  },
  {
    q: "How does Docker use layers and copy-on-write?",
    a: "Each Dockerfile instruction creates a read-only layer. When a container runs, Docker adds a thin writable layer on top. On write, the file is copied up from the underlying layer (copy-on-write). This makes containers lightweight — they share base layers and only store differences."
  },
  {
    q: "Explain Docker multi-stage builds and their benefits.",
    a: "Multi-stage builds use multiple FROM statements in one Dockerfile. Build artifacts are copied from intermediate stages to the final stage. Benefits: smaller final images (no build tools), cleaner Dockerfiles, and no need for separate build scripts. The builder pattern reduces image size by 10-100x."
  },
  {
    q: "What is the difference between docker-compose and docker stack?",
    a: "Docker Compose is a CLI tool for defining and running multi-container applications on a single host using a compose.yml file. Docker Stack is part of Docker Swarm — it deploys the same compose file across a Swarm cluster with built-in load balancing, rolling updates, and replication."
  }
];

export default function DockerPage() {
  const [activeStep, setActiveStep] = useState(0);
  const [copied, setCopied] = useState<string | null>(null);

  const copyCode = (key: string, code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(key);
    setTimeout(() => setCopied(null), 1500);
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <div className="max-w-6xl mx-auto space-y-6 sm:space-y-8">
        <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-gray-500">
          <Link href="/tools/devops" className="hover:text-blue-600 transition-colors font-semibold">DevOps</Link>
          <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 shrink-0" />
          <span className="text-blue-600 font-bold">Docker</span>
        </div>

        <div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-gray-900 mb-2 sm:mb-3">
            <Container className="inline w-7 h-7 sm:w-9 sm:h-9 mr-2 text-blue-600" />
            Docker
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-gray-600 max-w-3xl">
            Containerization platform for building, shipping, and running applications. Explore images, containers, Dockerfiles, Compose, and networking.
          </p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <div className="flex items-center gap-2 mb-5"><Play className="w-4 h-4 text-blue-600" /><h2 className="text-sm font-black uppercase tracking-wider text-gray-700">Container Lifecycle Simulator</h2></div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 mb-5">
            {LIFECYCLE_STEPS.map((step, i) => (
              <button
                key={step.label}
                onClick={() => setActiveStep(i)}
                className={`p-3 rounded-xl border-2 text-left transition-all ${
                  i === activeStep
                    ? "border-blue-400 bg-blue-50 shadow-sm"
                    : i < activeStep
                    ? "border-green-300 bg-green-50"
                    : "border-gray-200 bg-white hover:border-gray-300"
                }`}
              >
                <div className={`w-5 h-5 rounded ${step.color} flex items-center justify-center text-[9px] font-bold text-white mb-1.5`}>
                  {i < activeStep ? "✓" : i + 1}
                </div>
                <h4 className="text-xs font-bold text-gray-800">{step.label}</h4>
                <p className="text-[10px] text-gray-500 mt-0.5">{step.desc}</p>
              </button>
            ))}
          </div>
          <div className="bg-gray-900 text-green-400 rounded-xl p-4 text-xs sm:text-sm font-mono">
            <div className="flex items-center gap-2 text-gray-400 text-[10px] mb-2">$ <span className="text-blue-300">docker</span> lifecycle demo</div>
            <p className="text-white font-sans font-semibold mb-1">Step {activeStep + 1}: {LIFECYCLE_STEPS[activeStep].label}</p>
            <p className="text-gray-300 font-sans text-xs">{LIFECYCLE_STEPS[activeStep].desc}</p>
            <div className="mt-2 flex gap-2">
              <button onClick={() => setActiveStep(Math.max(0, activeStep - 1))} className="px-3 py-1 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded text-xs transition">&larr; Prev</button>
              <button onClick={() => setActiveStep(Math.min(LIFECYCLE_STEPS.length - 1, activeStep + 1))} className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded text-xs transition">Next &rarr;</button>
              <button onClick={() => setActiveStep(0)} className="px-3 py-1 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded text-xs transition flex items-center gap-1"><RotateCcw className="w-3 h-3" /> Reset</button>
            </div>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2"><FileCode2 className="w-4 h-4 text-blue-600" /><h3 className="text-sm font-black uppercase tracking-wider text-gray-700">Dockerfile</h3></div>
              <button onClick={() => copyCode("dockerfile", DOCKERFILE)} className="flex items-center gap-1 px-2.5 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-[10px] font-semibold text-gray-600 transition">
                {copied === "dockerfile" ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
              </button>
            </div>
            <pre className="bg-gray-900 text-green-400 p-4 rounded-xl text-xs font-mono overflow-x-auto leading-relaxed">{DOCKERFILE}</pre>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2"><Layers className="w-4 h-4 text-blue-600" /><h3 className="text-sm font-black uppercase tracking-wider text-gray-700">Docker Compose</h3></div>
              <button onClick={() => copyCode("compose", COMPOSE)} className="flex items-center gap-1 px-2.5 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-[10px] font-semibold text-gray-600 transition">
                {copied === "compose" ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
              </button>
            </div>
            <pre className="bg-gray-900 text-green-400 p-4 rounded-xl text-xs font-mono overflow-x-auto leading-relaxed">{COMPOSE}</pre>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <div className="flex items-center gap-2 mb-4"><Terminal className="w-4 h-4 text-blue-600" /><h2 className="text-sm font-black uppercase tracking-wider text-gray-700">Essential Docker Commands</h2></div>
          <div className="grid sm:grid-cols-2 gap-2">
            {COMMANDS.map(c => (
              <div key={c.cmd} className="flex items-start gap-2 p-2 rounded-lg hover:bg-gray-50">
                <code className="text-xs font-mono bg-blue-50 text-blue-700 px-2 py-0.5 rounded shrink-0 whitespace-nowrap">{c.cmd}</code>
                <span className="text-xs text-gray-600">{c.desc}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <div className="flex items-center gap-2 mb-4"><Network className="w-4 h-4 text-cyan-600" /><h2 className="text-sm font-black uppercase tracking-wider text-gray-700">Container Networking</h2></div>
          <div className="grid sm:grid-cols-2 gap-4">
            {NETWORK_MODES.map(m => (
              <div key={m.mode} className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                <h4 className="font-bold text-xs text-gray-800">{m.mode}</h4>
                <p className="text-[11px] text-gray-600 mt-0.5">{m.desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200 text-xs text-blue-800">
            <span className="font-bold">Pro tip:</span> Use <code className="font-mono text-blue-600">docker network create mynet</code> to create a user-defined bridge network. Containers on the same network can resolve each other by container name.
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <div className="flex items-center gap-2 mb-4"><BookOpen className="w-4 h-4 text-blue-600" /><h2 className="text-sm font-black uppercase tracking-wider text-gray-700">Interview Questions</h2></div>
          <div className="space-y-3">
            {INTERVIEW_QS.map((item, i) => (
              <details key={i} className="bg-blue-50 rounded-xl border border-blue-200 group">
                <summary className="px-4 py-3 flex items-center justify-between cursor-pointer text-xs sm:text-sm font-semibold text-gray-900 hover:text-blue-700 transition-colors list-none">
                  <span>Q{i + 1}: {item.q}</span>
                  <ChevronRight className="w-4 h-4 text-gray-400 group-open:rotate-90 transition-transform shrink-0" />
                </summary>
                <div className="px-4 pb-4 text-xs sm:text-sm text-gray-600 leading-relaxed border-t border-blue-200 pt-3">{item.a}</div>
              </details>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
