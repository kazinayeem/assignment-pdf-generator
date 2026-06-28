"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Server, ChevronRight, BookOpen, FileCode2, Users,
  Terminal, Copy, Settings
} from "lucide-react";

const PLAYBOOK = `---
- name: Configure web servers
  hosts: webservers
  become: yes
  vars:
    app_port: 3000
    app_env: production

  tasks:
    - name: Install Nginx
      apt:
        name: nginx
        state: present
        update_cache: yes

    - name: Copy configuration
      template:
        src: nginx.conf.j2
        dest: /etc/nginx/nginx.conf
      notify: restart nginx

    - name: Start Nginx service
      service:
        name: nginx
        state: started
        enabled: yes

  handlers:
    - name: restart nginx
      service:
        name: nginx
        state: restarted`;

const INVENTORY = `# inventory.ini
[webservers]
web1 ansible_host=192.168.1.10
web2 ansible_host=192.168.1.11

[databases]
db1 ansible_host=192.168.1.20

${String.fromCharCode(91)}all:vars${String.fromCharCode(93)}
ansible_user=deploy
ansible_ssh_private_key_file=~/.ssh/id_rsa`;

const ADHOC = [
  { cmd: "ansible all -m ping", desc: "Ping all hosts" },
  { cmd: "ansible all -m command -a 'uptime'", desc: "Run uptime on all hosts" },
  { cmd: "ansible webservers -m apt -a 'name=nginx state=latest' -b", desc: "Install Nginx with sudo" },
  { cmd: "ansible db -m copy -a 'src=/tmp/config dest=/etc/config'", desc: "Copy file to db hosts" },
  { cmd: "ansible all -m service -a 'name=docker state=started' -b", desc: "Start Docker everywhere" },
  { cmd: "ansible all -m shell -a 'df -h'", desc: "Check disk space on all hosts" },
  { cmd: "ansible-playbook playbook.yml -i inventory.ini", desc: "Run playbook against inventory" },
  { cmd: "ansible-playbook play.yml --check", desc: "Dry run (check mode)" },
  { cmd: "ansible-galaxy role init myrole", desc: "Scaffold a new Ansible role" },
  { cmd: "ansible all -m setup", desc: "Gather system facts from all hosts" },
];

const MODULES = [
  { name: "apt / yum / dnf", desc: "Package management" },
  { name: "copy / template", desc: "File management with Jinja2 templates" },
  { name: "service / systemd", desc: "Service lifecycle management" },
  { name: "command / shell", desc: "Execute arbitrary commands" },
  { name: "user / group", desc: "User and group management" },
  { name: "file", desc: "Set permissions, ownership, create directories" },
  { name: "docker_container", desc: "Manage Docker containers" },
  { name: "uri", desc: "HTTP API requests" },
];

const INTERVIEW_QS = [
  {
    q: "What is the difference between Ansible and Terraform?",
    a: "Ansible is a configuration management tool — it installs software, manages configs, and ensures desired state on existing servers. Terraform is an infrastructure provisioning tool — it creates, modifies, and destroys cloud resources (VMs, networks, load balancers). They complement each other: Terraform provisions, Ansible configures."
  },
  {
    q: "What are Ansible roles and how do they differ from playbooks?",
    a: "Roles are reusable, self-contained units of automation with a predefined directory structure (tasks, handlers, templates, vars, defaults). Playbooks orchestrate multiple roles and define the execution order. Roles promote modularity and sharing via Ansible Galaxy. A playbook can include roles, include tasks, or run inline tasks."
  },
  {
    q: "How does Ansible handle idempotency?",
    a: "Ansible modules are designed to be idempotent — running a playbook multiple times produces the same result. Modules check the current state before making changes. For example, `apt: name=nginx state=present` only installs if Nginx is not already installed. The `--check` flag performs a dry run to preview changes."
  },
  {
    q: "Explain Ansible's push-based architecture vs pull-based alternatives.",
    a: "Ansible uses a push model — the control node connects to managed nodes via SSH and pushes configuration. No agent is required on managed nodes. Alternatives like Chef and Puppet use a pull model where agents periodically check a central server. Ansible's push model is simpler for small-to-medium deployments but may not scale as well for thousands of nodes."
  }
];

export default function AnsiblePage() {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="min-h-screen bg-gray-50 px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <div className="max-w-6xl mx-auto space-y-6 sm:space-y-8">
        <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-gray-500">
          <Link href="/tools/devops" className="hover:text-red-600 transition-colors font-semibold">DevOps</Link>
          <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 shrink-0" />
          <span className="text-red-600 font-bold">Ansible</span>
        </div>

        <div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-gray-900 mb-2 sm:mb-3">
            <Server className="inline w-7 h-7 sm:w-9 sm:h-9 mr-2 text-red-600" />
            Ansible
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-gray-600 max-w-3xl">
            Simple, agentless IT automation. Configuration management, application deployment, task automation, and orchestration.
          </p>
        </div>

        <div className="grid sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 text-center">
            <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center mx-auto mb-2"><Terminal className="w-5 h-5 text-red-600" /></div>
            <h3 className="font-bold text-xs text-gray-900">Agentless</h3>
            <p className="text-[11px] text-gray-500">No agents on managed nodes. Uses SSH and Python.</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 text-center">
            <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center mx-auto mb-2"><FileCode2 className="w-5 h-5 text-red-600" /></div>
            <h3 className="font-bold text-xs text-gray-900">YAML Playbooks</h3>
            <p className="text-[11px] text-gray-500">Human-readable automation expressed in YAML.</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 text-center">
            <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center mx-auto mb-2"><Settings className="w-5 h-5 text-red-600" /></div>
            <h3 className="font-bold text-xs text-gray-900">Idempotent</h3>
            <p className="text-[11px] text-gray-500">Running the same playbook repeatedly gives the same result.</p>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="flex border-b border-gray-200">
            {["Playbook", "Inventory"].map((label, i) => (
              <button
                key={label}
                onClick={() => setActiveTab(i)}
                className={`px-4 py-3 text-xs font-bold transition-colors border-b-2 ${
                  i === activeTab ? "border-red-500 text-red-700 bg-red-50" : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
          <div className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-mono text-gray-400">YAML</span>
              <button onClick={() => navigator.clipboard.writeText(activeTab === 0 ? PLAYBOOK : INVENTORY)} className="flex items-center gap-1 px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded text-[10px] text-gray-600 transition"><Copy className="w-3 h-3" /> Copy</button>
            </div>
            <pre className="bg-gray-900 text-green-400 p-4 rounded-xl text-xs font-mono overflow-x-auto leading-relaxed">{activeTab === 0 ? PLAYBOOK : INVENTORY}</pre>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <div className="flex items-center gap-2 mb-4"><Terminal className="w-4 h-4 text-red-600" /><h2 className="text-sm font-black uppercase tracking-wider text-gray-700">Ad-Hoc Commands</h2></div>
          <div className="grid sm:grid-cols-2 gap-2">
            {ADHOC.map(c => (
              <div key={c.cmd} className="flex items-start gap-2 p-2 rounded-lg hover:bg-gray-50">
                <code className="text-xs font-mono bg-red-50 text-red-700 px-2 py-0.5 rounded shrink-0 whitespace-nowrap">{c.cmd}</code>
                <span className="text-xs text-gray-600">{c.desc}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
            <div className="flex items-center gap-2 mb-3"><Settings className="w-4 h-4 text-red-600" /><h3 className="font-bold text-sm text-gray-900">Common Modules</h3></div>
            <div className="grid gap-2">
              {MODULES.map(m => (
                <div key={m.name} className="flex items-start gap-2 p-2 rounded-lg bg-gray-50">
                  <code className="text-xs font-mono text-red-700 shrink-0">{m.name}</code>
                  <span className="text-[11px] text-gray-600">{m.desc}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
            <div className="flex items-center gap-2 mb-3"><Users className="w-4 h-4 text-red-600" /><h3 className="font-bold text-sm text-gray-900">Roles & Handlers</h3></div>
            <p className="text-xs text-gray-600 mb-3"><strong>Roles</strong> organize automation into reusable components with a standard directory layout.</p>
            <pre className="bg-gray-900 text-green-400 p-3 rounded-lg text-xs font-mono overflow-x-auto mb-3">roles/
  nginx/
    tasks/main.yml
    handlers/main.yml
    templates/nginx.conf.j2
    vars/main.yml
    defaults/main.yml</pre>
            <p className="text-xs text-gray-600"><strong>Handlers</strong> run on change notification. Only execute when notified by a task, typically used for service restarts. They run once at the end of the playbook, even if notified multiple times.</p>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <div className="flex items-center gap-2 mb-4"><BookOpen className="w-4 h-4 text-red-600" /><h2 className="text-sm font-black uppercase tracking-wider text-gray-700">Interview Questions</h2></div>
          <div className="space-y-3">
            {INTERVIEW_QS.map((item, i) => (
              <details key={i} className="bg-red-50 rounded-xl border border-red-200 group">
                <summary className="px-4 py-3 flex items-center justify-between cursor-pointer text-xs sm:text-sm font-semibold text-gray-900 hover:text-red-700 transition-colors list-none">
                  <span>Q{i + 1}: {item.q}</span>
                  <ChevronRight className="w-4 h-4 text-gray-400 group-open:rotate-90 transition-transform shrink-0" />
                </summary>
                <div className="px-4 pb-4 text-xs sm:text-sm text-gray-600 leading-relaxed border-t border-red-200 pt-3">{item.a}</div>
              </details>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
