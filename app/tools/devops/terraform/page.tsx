"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Layers, ChevronRight, BookOpen, FileCode2, Database,
  Cpu, GitBranch, Terminal, Copy
} from "lucide-react";

const BACKEND_TF = `# backend.tf
terraform {
  backend "s3" {
    bucket         = "my-terraform-state"
    key            = "prod/terraform.tfstate"
    region         = "us-east-1"
    dynamodb_table = "terraform-locks"
  }
}`;

const HCL_EXAMPLE = `# main.tf — AWS EC2 instance
terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = "us-east-1"
}

resource "aws_instance" "web" {
  ami           = "ami-0c55b159cbfafe1f0"
  instance_type = "t3.micro"

  tags = {
    Name = "WebServer"
  }
}`;

const VARIABLES = `# variables.tf
variable "environment" {
  description = "Deployment environment"
  type        = string
  default     = "dev"
}

variable "instance_count" {
  type    = number
  default = 2
}

variable "tags" {
  type = map(string)
  default = {
    Project = "MyApp"
    ManagedBy = "Terraform"
  }
}`;

const OUTPUTS = `# outputs.tf
output "instance_id" {
  description = "ID of the EC2 instance"
  value       = aws_instance.web.id
}

output "public_ip" {
  value = aws_instance.web.public_ip
}`;

const MODULES = `# modules/vpc/main.tf
resource "aws_vpc" "main" {
  cidr_block = var.cidr
  tags = { Name = var.name }
}

variable "cidr" { type = string }
variable "name" { type = string }

output "vpc_id" { value = aws_vpc.main.id }

# root/main.tf
module "vpc" {
  source = "./modules/vpc"
  cidr   = "10.0.0.0/16"
  name   = "main-vpc"
}`;

const TF_COMMANDS = [
  { cmd: "terraform init", desc: "Initialize working directory and download providers" },
  { cmd: "terraform plan", desc: "Preview changes without applying" },
  { cmd: "terraform apply", desc: "Create or update infrastructure" },
  { cmd: "terraform destroy", desc: "Destroy managed infrastructure" },
  { cmd: "terraform fmt", desc: "Format code to canonical style" },
  { cmd: "terraform validate", desc: "Check configuration for validity" },
  { cmd: "terraform state list", desc: "List resources in state" },
  { cmd: "terraform state show res", desc: "Show a resource's state details" },
  { cmd: "terraform import res id", desc: "Import existing resource" },
  { cmd: "terraform output", desc: "Show output values" },
  { cmd: "terraform workspace list", desc: "List workspaces" },
  { cmd: "terraform refresh", desc: "Sync state with real infrastructure" },
];

const STATE_BACKENDS = [
  { name: "local", desc: "State stored in terraform.tfstate file (default)" },
  { name: "S3 + DynamoDB", desc: "Remote state on S3 with DynamoDB locking (recommended)" },
  { name: "Terraform Cloud", desc: "Managed remote state, VCS integration, Sentinel" },
  { name: "AzureRM", desc: "State in Azure Storage Account" },
  { name: "GCS", desc: "State in Google Cloud Storage" },
];

const INTERVIEW_QS = [
  {
    q: "What is Terraform state and why is it important?",
    a: "State is Terraform's mapping of real-world infrastructure to configuration. It stores resource attributes, dependencies, and metadata. It enables Terraform to detect drift, plan changes, and delete resources. Remote state with locking prevents concurrent modifications. Never edit state manually."
  },
  {
    q: "Explain the difference between Terraform provisioners and configuration management tools.",
    a: "Provisioners (file, remote-exec, local-exec) are last-resort mechanisms to perform actions on resources — they are not idempotent and should be avoided. Configuration management tools like Ansible, Chef, or Puppet are designed for ongoing server configuration. Prefer using Ansible after Terraform provisions infrastructure."
  },
  {
    q: "What are Terraform modules and how do you use them?",
    a: "Modules are reusable Terraform configurations grouped in a directory with inputs (variables) and outputs. They follow the same HCL syntax as root configurations. The root directory calling a module uses `module \"name\" { source = \"./path\" }`. Modules promote DRY principles and can be versioned via Git tags or the Terraform Registry."
  },
  {
    q: "How do you manage sensitive data in Terraform?",
    a: "Never hardcode secrets in .tf files. Use variables marked `sensitive = true`. Store secrets in a Vault provider (Hashicorp Vault, AWS Secrets Manager). Use `.tfvars` files with `.gitignore`. For remote state, enable encryption at rest (S3 SSE, KMS). Terraform Cloud/Enterprise supports variable sets with sensitive classification."
  }
];

export default function TerraformPage() {
  const [codeTab, setCodeTab] = useState(0);

  const CODE_TABS = [
    { label: "Resources", code: HCL_EXAMPLE, lang: "HCL" },
    { label: "Variables", code: VARIABLES, lang: "HCL" },
    { label: "Outputs", code: OUTPUTS, lang: "HCL" },
    { label: "Modules", code: MODULES, lang: "HCL" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <div className="max-w-6xl mx-auto space-y-6 sm:space-y-8">
        <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-gray-500">
          <Link href="/tools/devops" className="hover:text-purple-600 transition-colors font-semibold">DevOps</Link>
          <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 shrink-0" />
          <span className="text-purple-600 font-bold">Terraform</span>
        </div>

        <div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-gray-900 mb-2 sm:mb-3">
            <Layers className="inline w-7 h-7 sm:w-9 sm:h-9 mr-2 text-purple-600" />
            Terraform
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-gray-600 max-w-3xl">
            Infrastructure as Code (IaC) with HashiCorp Terraform. HCL syntax, state management, providers, modules, and remote backends.
          </p>
        </div>

        <div className="grid sm:grid-cols-3 gap-4">
          <div className="bg-purple-50 rounded-xl border border-purple-200 p-4">
            <div className="flex items-center gap-2 mb-2"><FileCode2 className="w-4 h-4 text-purple-600" /><h3 className="font-bold text-xs text-gray-900">Declarative</h3></div>
            <p className="text-[11px] text-gray-600">Describe desired state. Terraform figures out the diff and applies changes.</p>
          </div>
          <div className="bg-purple-50 rounded-xl border border-purple-200 p-4">
            <div className="flex items-center gap-2 mb-2"><Database className="w-4 h-4 text-purple-600" /><h3 className="font-bold text-xs text-gray-900">State Management</h3></div>
            <p className="text-[11px] text-gray-600">Tracks real-world resources in a state file for planning and drift detection.</p>
          </div>
          <div className="bg-purple-50 rounded-xl border border-purple-200 p-4">
            <div className="flex items-center gap-2 mb-2"><Cpu className="w-4 h-4 text-purple-600" /><h3 className="font-bold text-xs text-gray-900">Provider Ecosystem</h3></div>
            <p className="text-[11px] text-gray-600">2000+ providers: AWS, Azure, GCP, Kubernetes, Helm, and more.</p>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="flex border-b border-gray-200">
            {CODE_TABS.map((tab, i) => (
              <button
                key={tab.label}
                onClick={() => setCodeTab(i)}
                className={`px-4 py-3 text-xs font-bold transition-colors border-b-2 ${
                  i === codeTab ? "border-purple-500 text-purple-700 bg-purple-50" : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <div className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-mono text-gray-400">{CODE_TABS[codeTab].lang}</span>
              <button onClick={() => navigator.clipboard.writeText(CODE_TABS[codeTab].code)} className="flex items-center gap-1 px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded text-[10px] text-gray-600 transition"><Copy className="w-3 h-3" /> Copy</button>
            </div>
            <pre className="bg-gray-900 text-green-400 p-4 rounded-xl text-xs font-mono overflow-x-auto leading-relaxed">{CODE_TABS[codeTab].code}</pre>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <div className="flex items-center gap-2 mb-4"><Terminal className="w-4 h-4 text-purple-600" /><h2 className="text-sm font-black uppercase tracking-wider text-gray-700">Terraform Commands</h2></div>
          <div className="grid sm:grid-cols-2 gap-2">
            {TF_COMMANDS.map(c => (
              <div key={c.cmd} className="flex items-start gap-2 p-2 rounded-lg hover:bg-gray-50">
                <code className="text-xs font-mono bg-purple-50 text-purple-700 px-2 py-0.5 rounded shrink-0 whitespace-nowrap">{c.cmd}</code>
                <span className="text-xs text-gray-600">{c.desc}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
            <div className="flex items-center gap-2 mb-3"><Database className="w-4 h-4 text-purple-600" /><h3 className="font-bold text-sm text-gray-900">State Backends</h3></div>
            <div className="space-y-2">
              {STATE_BACKENDS.map(s => (
                <div key={s.name} className="p-2.5 bg-gray-50 rounded-lg border border-gray-100">
                  <h4 className="font-bold text-xs text-gray-800">{s.name}</h4>
                  <p className="text-[11px] text-gray-600">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
            <div className="flex items-center gap-2 mb-3"><GitBranch className="w-4 h-4 text-purple-600" /><h3 className="font-bold text-sm text-gray-900">Workspaces & Remote Ops</h3></div>
            <ul className="space-y-2 text-xs sm:text-sm text-gray-600">
              <li><span className="font-bold">Workspaces:</span> Isolated state for different environments (dev/staging/prod)</li>
              <li><span className="font-bold">Remote Backend:</span> S3 + DynamoDB for team collaboration</li>
              <li><span className="font-bold">Terraform Cloud:</span> Managed runs, VCS integration, Sentinel policies</li>
              <li><span className="font-bold">CI/CD:</span> Run <code className="font-mono text-purple-600">terraform plan</code> in PRs, <code className="font-mono text-purple-600">apply</code> on merge</li>
            </ul>
            <pre className="bg-gray-900 text-green-400 p-3 rounded-lg text-xs font-mono overflow-x-auto mt-3">{BACKEND_TF}</pre>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <div className="flex items-center gap-2 mb-4"><BookOpen className="w-4 h-4 text-purple-600" /><h2 className="text-sm font-black uppercase tracking-wider text-gray-700">Interview Questions</h2></div>
          <div className="space-y-3">
            {INTERVIEW_QS.map((item, i) => (
              <details key={i} className="bg-purple-50 rounded-xl border border-purple-200 group">
                <summary className="px-4 py-3 flex items-center justify-between cursor-pointer text-xs sm:text-sm font-semibold text-gray-900 hover:text-purple-700 transition-colors list-none">
                  <span>Q{i + 1}: {item.q}</span>
                  <ChevronRight className="w-4 h-4 text-gray-400 group-open:rotate-90 transition-transform shrink-0" />
                </summary>
                <div className="px-4 pb-4 text-xs sm:text-sm text-gray-600 leading-relaxed border-t border-purple-200 pt-3">{item.a}</div>
              </details>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
