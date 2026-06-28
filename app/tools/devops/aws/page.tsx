"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Cloud, ChevronRight, BookOpen, Server, Database,
  Cpu, Shield, Network, Terminal
} from "lucide-react";

const SERVICES = [
  {
    name: "EC2", icon: Server, desc: "Virtual servers in the cloud", color: "bg-amber-500",
    details: ["Instance types (t3.micro, c5.large)", "Security Groups, Key Pairs", "Auto Scaling, Load Balancers",
      "User data scripts for bootstrapping", "EBS volumes for persistent storage"]
  },
  {
    name: "S3", icon: Database, desc: "Object storage with 99.999999999% durability", color: "bg-green-500",
    details: ["Buckets and objects", "Storage classes (Standard, Glacier)", "Bucket policies & ACLs",
      "Versioning and lifecycle rules", "Static website hosting"]
  },
  {
    name: "Lambda", icon: Cpu, desc: "Serverless function compute", color: "bg-blue-500",
    details: ["Event-driven execution", "Supports Node, Python, Java, Go, .NET", "Cold start vs warm start",
      "Triggers (S3, SQS, API Gateway)", "Provisioned Concurrency"]
  },
  {
    name: "RDS", icon: Database, desc: "Managed relational databases", color: "bg-indigo-500",
    details: ["Aurora, PostgreSQL, MySQL, MariaDB", "Multi-AZ for high availability", "Read replicas for scaling",
      "Automated backups & snapshots", "Performance Insights"]
  },
];

const AWS_CLI = [
  { cmd: "aws ec2 describe-instances", desc: "List all EC2 instances" },
  { cmd: "aws s3 ls s3://my-bucket", desc: "List S3 bucket contents" },
  { cmd: "aws lambda invoke --function-name fn out.json", desc: "Invoke Lambda function" },
  { cmd: "aws rds describe-db-instances", desc: "List database instances" },
  { cmd: "aws iam list-users", desc: "List IAM users" },
  { cmd: "aws ec2 describe-security-groups", desc: "List security groups" },
  { cmd: "aws elbv2 describe-load-balancers", desc: "Describe load balancers" },
  { cmd: "aws autoscaling describe-auto-scaling-groups", desc: "Describe ASGs" },
  { cmd: "aws s3 cp file.txt s3://bucket/", desc: "Upload file to S3" },
  { cmd: "aws sts get-caller-identity", desc: "Show current IAM identity" },
];

const INTERVIEW_QS = [
  {
    q: "What is the difference between Security Groups and NACLs?",
    a: "Security Groups (SGs) are stateful firewalls attached to ENIs — they allow only, deny rules are implicit. NACLs are stateless, operate at subnet level, and support allow/deny rules in numbered order. SGs evaluate all rules together; NACLs process rules in order and stop at the first match."
  },
  {
    q: "Explain EC2 Auto Scaling and how it works with Load Balancers.",
    a: "Auto Scaling Groups (ASGs) maintain a desired number of EC2 instances. Launch templates define instance configuration. Scaling policies trigger based on CloudWatch metrics (CPU, memory, request count). An Application Load Balancer (ALB) distributes traffic to healthy instances across AZs. ASG integrates with ALB via target groups."
  },
  {
    q: "What is the shared responsibility model in AWS?",
    a: "AWS is responsible for security of the cloud: physical facilities, hardware, network infrastructure, and managed services. The customer is responsible for security in the cloud: IAM configuration, data encryption, OS patching on EC2, firewall rules, and application-level security controls."
  },
  {
    q: "How does IAM work and what are best practices?",
    a: "IAM manages users, groups, roles, and policies. Policies are JSON documents that define permissions (Allow/Deny) on specific resources. Best practices: least privilege principle, use roles instead of access keys, enable MFA, use IAM Identity Center for workforce access, rotate keys regularly, and audit with IAM Access Analyzer."
  }
];

export default function AWSPage() {
  const [activeService, setActiveService] = useState(0);

  return (
    <div className="min-h-screen bg-gray-50 px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <div className="max-w-6xl mx-auto space-y-6 sm:space-y-8">
        <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-gray-500">
          <Link href="/tools/devops" className="hover:text-amber-600 transition-colors font-semibold">DevOps</Link>
          <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 shrink-0" />
          <span className="text-amber-600 font-bold">AWS</span>
        </div>

        <div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-gray-900 mb-2 sm:mb-3">
            <Cloud className="inline w-7 h-7 sm:w-9 sm:h-9 mr-2 text-amber-600" />
            Amazon Web Services
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-gray-600 max-w-3xl">
            The leading cloud platform. Learn EC2, S3, Lambda, RDS, IAM, VPC, Auto Scaling, Load Balancers, and more.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {SERVICES.map((svc, i) => {
            const Icon = svc.icon;
            return (
              <button
                key={svc.name}
                onClick={() => setActiveService(i)}
                className={`p-4 rounded-xl border-2 text-left transition-all ${
                  i === activeService
                    ? "border-amber-400 bg-amber-50 shadow-sm"
                    : "border-gray-200 bg-white hover:border-gray-300"
                }`}
              >
                <div className={`w-9 h-9 rounded-xl ${svc.color} flex items-center justify-center mb-2 shadow-sm`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-bold text-sm text-gray-900">{svc.name}</h3>
                <p className="text-[11px] text-gray-500 mt-0.5">{svc.desc}</p>
              </button>
            );
          })}
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className={`w-8 h-8 rounded-lg ${SERVICES[activeService].color} flex items-center justify-center`}>
              {(() => { const Icon = SERVICES[activeService].icon; return <Icon className="w-4 h-4 text-white" />; })()}
            </div>
            <div>
              <h2 className="font-bold text-sm text-gray-900">{SERVICES[activeService].name} — Deep Dive</h2>
              <p className="text-xs text-gray-500">{SERVICES[activeService].desc}</p>
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-2">
            {SERVICES[activeService].details.map((d, i) => (
              <div key={i} className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50">
                <span className="w-5 h-5 rounded bg-amber-100 text-amber-700 flex items-center justify-center text-[9px] font-bold shrink-0">{i + 1}</span>
                <span className="text-xs text-gray-600">{d}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <div className="flex items-center gap-2 mb-4"><Terminal className="w-4 h-4 text-amber-600" /><h2 className="text-sm font-black uppercase tracking-wider text-gray-700">AWS CLI Commands</h2></div>
          <div className="grid sm:grid-cols-2 gap-2">
            {AWS_CLI.map(c => (
              <div key={c.cmd} className="flex items-start gap-2 p-2 rounded-lg hover:bg-gray-50">
                <code className="text-xs font-mono bg-amber-50 text-amber-700 px-2 py-0.5 rounded shrink-0 whitespace-nowrap">{c.cmd}</code>
                <span className="text-xs text-gray-600">{c.desc}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
            <div className="flex items-center gap-2 mb-3"><Shield className="w-4 h-4 text-rose-600" /><h3 className="font-bold text-sm text-gray-900">IAM & Security</h3></div>
            <ul className="space-y-2 text-xs sm:text-sm text-gray-600">
              <li><span className="font-bold">Users:</span> Individual people with long-term credentials</li>
              <li><span className="font-bold">Groups:</span> Collections of users with shared permissions</li>
              <li><span className="font-bold">Roles:</span> Temporary credentials assumed by services/users</li>
              <li><span className="font-bold">Policies:</span> JSON documents defining permissions</li>
              <li><span className="font-bold">Best practice:</span> Use roles over access keys</li>
            </ul>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
            <div className="flex items-center gap-2 mb-3"><Network className="w-4 h-4 text-cyan-600" /><h3 className="font-bold text-sm text-gray-900">VPC & Networking</h3></div>
            <ul className="space-y-2 text-xs sm:text-sm text-gray-600">
              <li><span className="font-bold">VPC:</span> Virtual Private Cloud (isolated network)</li>
              <li><span className="font-bold">Subnets:</span> Public (Internet Gateway) and Private (NAT)</li>
              <li><span className="font-bold">Route Tables:</span> Define traffic routing rules</li>
              <li><span className="font-bold">Security Groups:</span> Instance-level stateful firewall</li>
              <li><span className="font-bold">NACLs:</span> Subnet-level stateless firewall</li>
              <li><span className="font-bold">VPC Peering / Transit Gateway:</span> Connect VPCs</li>
            </ul>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <div className="flex items-center gap-2 mb-4"><BookOpen className="w-4 h-4 text-amber-600" /><h2 className="text-sm font-black uppercase tracking-wider text-gray-700">Interview Questions</h2></div>
          <div className="space-y-3">
            {INTERVIEW_QS.map((item, i) => (
              <details key={i} className="bg-amber-50 rounded-xl border border-amber-200 group">
                <summary className="px-4 py-3 flex items-center justify-between cursor-pointer text-xs sm:text-sm font-semibold text-gray-900 hover:text-amber-700 transition-colors list-none">
                  <span>Q{i + 1}: {item.q}</span>
                  <ChevronRight className="w-4 h-4 text-gray-400 group-open:rotate-90 transition-transform shrink-0" />
                </summary>
                <div className="px-4 pb-4 text-xs sm:text-sm text-gray-600 leading-relaxed border-t border-amber-200 pt-3">{item.a}</div>
              </details>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
