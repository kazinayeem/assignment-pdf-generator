"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Layers, ChevronRight, BookOpen, Container, Shield,
  Network, HardDrive, Terminal, Copy, Check, RotateCcw
} from "lucide-react";

const POD_STATES = [
  { state: "Pending", desc: "API object created, image being pulled", color: "bg-yellow-400" },
  { state: "Creating", desc: "Container runtime starting the container", color: "bg-blue-400" },
  { state: "Running", desc: "Containers executing, pod is healthy", color: "bg-green-500" },
  { state: "Succeeded", desc: "All containers terminated with exit 0", color: "bg-gray-400" },
  { state: "Failed", desc: "Containers terminated with non-zero exit", color: "bg-red-500" },
  { state: "CrashLoopBackOff", desc: "Container keeps crashing, restart backoff", color: "bg-orange-500" },
];

const KUBECTL_CMDS = [
  { cmd: "kubectl get pods", desc: "List pods in current namespace" },
  { cmd: "kubectl get pods -A", desc: "List pods across all namespaces" },
  { cmd: "kubectl describe pod mypod", desc: "Detailed pod information" },
  { cmd: "kubectl logs -f deploy/myapp", desc: "Stream logs from deployment" },
  { cmd: "kubectl exec -it pod -- sh", desc: "Shell into a pod" },
  { cmd: "kubectl apply -f deploy.yaml", desc: "Apply resource from file" },
  { cmd: "kubectl delete pod mypod", desc: "Delete a pod" },
  { cmd: "kubectl get svc", desc: "List services" },
  { cmd: "kubectl get nodes", desc: "List cluster nodes" },
  { cmd: "kubectl port-forward svc/app 8080:80", desc: "Forward local port to service" },
];

const DEPLOYMENT_YAML = `apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx-deployment
spec:
  replicas: 3
  selector:
    matchLabels:
      app: nginx
  template:
    metadata:
      labels:
        app: nginx
    spec:
      containers:
      - name: nginx
        image: nginx:1.25
        ports:
        - containerPort: 80
        resources:
          requests:
            cpu: 100m
            memory: 128Mi`;

const SERVICE_YAML = `apiVersion: v1
kind: Service
metadata:
  name: nginx-service
spec:
  type: ClusterIP
  selector:
    app: nginx
  ports:
  - port: 80
    targetPort: 80`;

const INTERVIEW_QS = [
  {
    q: "What is the difference between a pod and a deployment?",
    a: "A pod is the smallest deployable unit in Kubernetes — a group of one or more containers with shared storage/network. A Deployment manages a ReplicaSet, providing declarative updates, rollbacks, scaling, and self-healing. You rarely manage pods directly; you use Deployments to manage them."
  },
  {
    q: "How does Kubernetes service discovery work?",
    a: "Services have a stable IP and DNS name. kube-proxy on each node watches the API server and maintains iptables/IPVS rules to route traffic to healthy pods. ClusterIP services are accessible only within the cluster. Headless services (clusterIP: None) return pod IPs directly for stateful workloads."
  },
  {
    q: "What are ConfigMaps and Secrets used for?",
    a: "ConfigMaps store non-sensitive configuration as key-value pairs or files. Secrets store sensitive data (base64 encoded, with encryption at rest if configured). Both can be injected into pods as environment variables, CLI arguments, or mounted as volumes. Secrets are per-namespace and access-controlled via RBAC."
  },
  {
    q: "Explain the role of etcd in Kubernetes.",
    a: "etcd is a distributed, consistent key-value store that serves as Kubernetes' source of truth. It stores all cluster state: pods, services, configs, secrets, and resource specifications. The API server is the only component that talks to etcd. Backups of etcd are critical for disaster recovery."
  }
];

export default function KubernetesPage() {
  const [podStep, setPodStep] = useState(0);
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
          <Link href="/tools/devops" className="hover:text-indigo-600 transition-colors font-semibold">DevOps</Link>
          <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 shrink-0" />
          <span className="text-indigo-600 font-bold">Kubernetes</span>
        </div>

        <div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-gray-900 mb-2 sm:mb-3">
            <Layers className="inline w-7 h-7 sm:w-9 sm:h-9 mr-2 text-indigo-600" />
            Kubernetes
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-gray-600 max-w-3xl">
            Production-grade container orchestration. Learn pods, services, deployments, ConfigMaps, Secrets, Ingress, and kubectl.
          </p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <div className="flex items-center gap-2 mb-5"><Container className="w-4 h-4 text-indigo-600" /><h2 className="text-sm font-black uppercase tracking-wider text-gray-700">Pod Lifecycle Visualization</h2></div>
          <div className="flex flex-wrap gap-2 mb-5">
            {POD_STATES.map((s, i) => (
              <button
                key={s.state}
                onClick={() => setPodStep(i)}
                className={`px-3 py-2 rounded-lg border-2 text-xs font-bold transition-all ${
                  i === podStep
                    ? "border-indigo-400 bg-indigo-50"
                    : i < podStep
                    ? "border-green-300 bg-green-50 text-green-800"
                    : "border-gray-200 bg-white hover:border-gray-300"
                }`}
              >
                {i < podStep ? "✓ " : ""}{s.state}
              </button>
            ))}
          </div>
          <div className="bg-gray-900 text-green-400 rounded-xl p-4 sm:p-6">
            <div className="flex items-center gap-2 mb-3">
              <div className={`w-3 h-3 rounded-full ${POD_STATES[podStep].color} animate-pulse`} />
              <span className="text-white font-bold text-sm">Pod Status: {POD_STATES[podStep].state}</span>
            </div>
            <p className="text-gray-300 text-xs sm:text-sm mb-3">{POD_STATES[podStep].desc}</p>
            <div className="flex gap-2">
              <button onClick={() => setPodStep(Math.max(0, podStep - 1))} className="px-4 py-1.5 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg text-xs transition">&larr; Prev</button>
              <button onClick={() => setPodStep(Math.min(POD_STATES.length - 1, podStep + 1))} className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs transition">Next &rarr;</button>
              <button onClick={() => setPodStep(0)} className="px-4 py-1.5 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg text-xs transition flex items-center gap-1"><RotateCcw className="w-3 h-3" /> Reset</button>
            </div>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2"><Layers className="w-4 h-4 text-indigo-600" /><h3 className="text-sm font-black uppercase tracking-wider text-gray-700">Deployment</h3></div>
              <button onClick={() => copyCode("deploy", DEPLOYMENT_YAML)} className="flex items-center gap-1 px-2.5 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-[10px] font-semibold text-gray-600 transition">
                {copied === "deploy" ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
              </button>
            </div>
            <pre className="bg-gray-900 text-green-400 p-4 rounded-xl text-xs font-mono overflow-x-auto leading-relaxed">{DEPLOYMENT_YAML}</pre>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2"><Network className="w-4 h-4 text-indigo-600" /><h3 className="text-sm font-black uppercase tracking-wider text-gray-700">Service</h3></div>
              <button onClick={() => copyCode("svc", SERVICE_YAML)} className="flex items-center gap-1 px-2.5 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-[10px] font-semibold text-gray-600 transition">
                {copied === "svc" ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
              </button>
            </div>
            <pre className="bg-gray-900 text-green-400 p-4 rounded-xl text-xs font-mono overflow-x-auto leading-relaxed">{SERVICE_YAML}</pre>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <div className="flex items-center gap-2 mb-4"><Terminal className="w-4 h-4 text-indigo-600" /><h2 className="text-sm font-black uppercase tracking-wider text-gray-700">kubectl Commands</h2></div>
          <div className="grid sm:grid-cols-2 gap-2">
            {KUBECTL_CMDS.map(c => (
              <div key={c.cmd} className="flex items-start gap-2 p-2 rounded-lg hover:bg-gray-50">
                <code className="text-xs font-mono bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded shrink-0 whitespace-nowrap">{c.cmd}</code>
                <span className="text-xs text-gray-600">{c.desc}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
            <div className="flex items-center gap-2 mb-3"><Shield className="w-4 h-4 text-rose-600" /><h3 className="font-bold text-sm text-gray-900">ConfigMaps & Secrets</h3></div>
            <pre className="bg-gray-900 text-green-400 p-3 rounded-lg text-xs font-mono overflow-x-auto mb-3">kubectl create configmap app-config --from-literal=APP_ENV=production
kubectl create secret generic db-creds \
  --from-literal=username=admin \
  --from-literal=password=s3cret</pre>
            <p className="text-xs text-gray-600">ConfigMaps: non-sensitive config. Secrets: sensitive data (base64, encryption at rest via KMS). Both mountable as env vars or volumes.</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
            <div className="flex items-center gap-2 mb-3"><HardDrive className="w-4 h-4 text-cyan-600" /><h3 className="font-bold text-sm text-gray-900">Ingress & Volumes</h3></div>
            <p className="text-xs text-gray-600 mb-3"><strong>Ingress:</strong> HTTP/HTTPS routing to services. Supports TLS termination, path-based routing, and virtual hosts.</p>
            <pre className="bg-gray-900 text-green-400 p-3 rounded-lg text-xs font-mono overflow-x-auto">apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: app-ingress
spec:
  rules:
  - host: app.example.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: app-service
            port:
              number: 80</pre>
            <p className="text-xs text-gray-600 mt-3"><strong>Volumes:</strong> emptyDir (ephemeral), hostPath (node-local), PersistentVolumeClaim (durable storage), ConfigMap/Secret (injected config).</p>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <div className="flex items-center gap-2 mb-4"><BookOpen className="w-4 h-4 text-indigo-600" /><h2 className="text-sm font-black uppercase tracking-wider text-gray-700">Interview Questions</h2></div>
          <div className="space-y-3">
            {INTERVIEW_QS.map((item, i) => (
              <details key={i} className="bg-indigo-50 rounded-xl border border-indigo-200 group">
                <summary className="px-4 py-3 flex items-center justify-between cursor-pointer text-xs sm:text-sm font-semibold text-gray-900 hover:text-indigo-700 transition-colors list-none">
                  <span>Q{i + 1}: {item.q}</span>
                  <ChevronRight className="w-4 h-4 text-gray-400 group-open:rotate-90 transition-transform shrink-0" />
                </summary>
                <div className="px-4 pb-4 text-xs sm:text-sm text-gray-600 leading-relaxed border-t border-indigo-200 pt-3">{item.a}</div>
              </details>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
