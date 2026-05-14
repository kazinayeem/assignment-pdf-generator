"use client";

import Link from "next/link";
import {
  Terminal, ChevronRight, BookOpen, FolderTree, Shield,
  Package, Activity, FileCode2, HardDrive
} from "lucide-react";

const COMMANDS = [
  { cmd: "ls -la", desc: "List all files with permissions, owner, size, date" },
  { cmd: "cd /path", desc: "Change directory to specified path" },
  { cmd: "pwd", desc: "Print working directory" },
  { cmd: "grep 'pattern' file", desc: "Search for pattern in file" },
  { cmd: "awk '{print $1}' file", desc: "Print first column of each line" },
  { cmd: "sed 's/old/new/g' file", desc: "Replace text across file" },
  { cmd: "chmod 755 file", desc: "Set rwxr-xr-x permissions" },
  { cmd: "chown user:group file", desc: "Change file owner and group" },
  { cmd: "ps aux", desc: "List all running processes" },
  { cmd: "kill -9 PID", desc: "Force kill a process by PID" },
  { cmd: "top / htop", desc: "Real-time process monitoring" },
  { cmd: "df -h", desc: "Disk space usage in human-readable format" },
];

const PERMISSION_TABLE = [
  { octal: "755", owner: "rwx", group: "r-x", other: "r-x", meaning: "Executable (common for scripts)" },
  { octal: "644", owner: "rw-", group: "r--", other: "r--", meaning: "Regular file" },
  { octal: "600", owner: "rw-", group: "---", other: "---", meaning: "Private file (SSH keys)" },
  { octal: "700", owner: "rwx", group: "---", other: "---", meaning: "Private directory" },
];

const SHELL_EXAMPLE = `#!/bin/bash
# Backup script with rotation
BACKUP_DIR="/var/backups"
SOURCE_DIR="/var/www"
RETENTION_DAYS=7

# Create timestamped backup
tar -czf "$BACKUP_DIR/backup-$(date +%Y%m%d).tar.gz" "$SOURCE_DIR"

# Remove backups older than retention period
find "$BACKUP_DIR" -name "*.tar.gz" -mtime +$RETENTION_DAYS -delete

# Log the operation
echo "[$(date)] Backup completed" >> /var/log/backup.log`;

const INTERVIEW_QS = [
  {
    q: "What is the difference between a hard link and a symbolic link?",
    a: "A hard link is a direct reference to the inode — it shares the same data blocks as the original file. Deleting the original does not remove the data. A symbolic link (symlink) is a pointer to the filename; if the original is deleted, the symlink breaks. Hard links cannot cross filesystems or link to directories."
  },
  {
    q: "Explain the Linux boot process.",
    a: "1) BIOS/UEFI performs POST and loads the bootloader. 2) GRUB loads the kernel into memory. 3) Kernel initializes hardware and mounts the initial RAM disk (initramfs). 4) systemd (or init) starts as PID 1 and launches target units. 5) System services and getty are started, presenting the login prompt."
  },
  {
    q: "How do you troubleshoot a high CPU process in Linux?",
    a: "Use `top` or `htop` to identify the offending PID. Check `strace -p PID` for system calls. Use `perf top` for profiling. For Java apps, use `jstack` to dump thread stacks. Common fixes include restarting the service, adding resource limits via systemd or ulimit, or optimizing the application code."
  },
  {
    q: "What is the role of cgroups and namespaces in Linux containers?",
    a: "Namespaces provide isolation — they make each container see its own PID, network, mount, and UTS namespace. Cgroups (control groups) limit and account resource usage (CPU, memory, disk I/O). Together they form the foundation of Linux containerization used by Docker and Podman."
  }
];

export default function LinuxPage() {
  return (
    <div className="min-h-screen bg-gray-50 px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <div className="max-w-6xl mx-auto space-y-6 sm:space-y-8">
        <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-gray-500">
          <Link href="/tools/devops" className="hover:text-blue-600 transition-colors font-semibold">DevOps</Link>
          <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 shrink-0" />
          <span className="text-blue-600 font-bold">Linux Basics</span>
        </div>

        <div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-gray-900 mb-2 sm:mb-3">
            <Terminal className="inline w-7 h-7 sm:w-9 sm:h-9 mr-2 text-blue-600" />
            Linux Basics
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-gray-600 max-w-3xl">
            Master the Linux command line — the foundation of modern DevOps. Covers filesystem navigation, permissions, package management, process control, and shell scripting.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center"><FolderTree className="w-4 h-4 text-blue-600" /></div>
              <h3 className="font-bold text-sm text-gray-900">Filesystem Hierarchy</h3>
            </div>
            <ul className="space-y-1 text-xs sm:text-sm text-gray-600">
              <li><code className="text-blue-600 font-mono">/bin</code> — Essential user binaries</li>
              <li><code className="text-blue-600 font-mono">/etc</code> — Configuration files</li>
              <li><code className="text-blue-600 font-mono">/var</code> — Variable data (logs, databases)</li>
              <li><code className="text-blue-600 font-mono">/usr</code> — User programs and libraries</li>
              <li><code className="text-blue-600 font-mono">/proc</code> — Virtual filesystem for processes</li>
              <li><code className="text-blue-600 font-mono">/tmp</code> — Temporary files (cleared on boot)</li>
              <li><code className="text-blue-600 font-mono">/home</code> — User home directories</li>
            </ul>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center"><Shield className="w-4 h-4 text-amber-600" /></div>
              <h3 className="font-bold text-sm text-gray-900">File Permissions</h3>
            </div>
            <p className="text-xs sm:text-sm text-gray-600 mb-3">Permissions: <code className="font-mono text-amber-600">rwx</code> (read, write, execute) for Owner / Group / Others.</p>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead><tr className="border-b border-gray-200"><th className="text-left py-1 pr-2 font-bold text-gray-500">Octal</th><th className="text-left py-1 pr-2 font-bold text-gray-500">Owner</th><th className="text-left py-1 pr-2 font-bold text-gray-500">Group</th><th className="text-left py-1 pr-2 font-bold text-gray-500">Other</th><th className="text-left py-1 font-bold text-gray-500">Use</th></tr></thead>
                <tbody>{PERMISSION_TABLE.map(r => <tr key={r.octal} className="border-b border-gray-100"><td className="py-1.5 pr-2 font-mono font-bold text-gray-800">{r.octal}</td><td className="py-1.5 pr-2 font-mono text-gray-600">{r.owner}</td><td className="py-1.5 pr-2 font-mono text-gray-600">{r.group}</td><td className="py-1.5 pr-2 font-mono text-gray-600">{r.other}</td><td className="py-1.5 text-gray-500">{r.meaning}</td></tr>)}</tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <div className="flex items-center gap-2 mb-4">
            <Terminal className="w-4 h-4 text-blue-600" />
            <h2 className="text-sm font-black uppercase tracking-wider text-gray-700">Essential Commands</h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-2">
            {COMMANDS.map(c => (
              <div key={c.cmd} className="flex items-start gap-2 p-2 rounded-lg hover:bg-gray-50">
                <code className="text-xs font-mono bg-gray-100 text-blue-700 px-2 py-0.5 rounded shrink-0 whitespace-nowrap">{c.cmd}</code>
                <span className="text-xs text-gray-600">{c.desc}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
            <div className="flex items-center gap-2 mb-3"><Package className="w-4 h-4 text-emerald-600" /><h3 className="font-bold text-sm text-gray-900">Package Management</h3></div>
            <ul className="space-y-2 text-xs sm:text-sm text-gray-600">
              <li><span className="font-bold text-emerald-700">Debian/Ubuntu (apt):</span><br /><code className="font-mono text-emerald-600">apt update &amp;&amp; apt install nginx</code></li>
              <li><span className="font-bold text-red-700">RHEL/CentOS (yum/dnf):</span><br /><code className="font-mono text-red-600">yum install -y nginx</code></li>
              <li><span className="font-bold text-blue-700">Arch (pacman):</span><br /><code className="font-mono text-blue-600">pacman -S nginx</code></li>
              <li><span className="font-bold text-amber-700">Alpine (apk):</span><br /><code className="font-mono text-amber-600">apk add nginx</code></li>
            </ul>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
            <div className="flex items-center gap-2 mb-3"><Activity className="w-4 h-4 text-rose-600" /><h3 className="font-bold text-sm text-gray-900">Process Management</h3></div>
            <ul className="space-y-2 text-xs sm:text-sm text-gray-600">
              <li><code className="font-mono text-rose-600">ps aux</code> — Snapshot of all processes</li>
              <li><code className="font-mono text-rose-600">top</code> — Real-time process viewer</li>
              <li><code className="font-mono text-rose-600">kill -15 PID</code> — Graceful termination</li>
              <li><code className="font-mono text-rose-600">kill -9 PID</code> — Force kill</li>
              <li><code className="font-mono text-rose-600">systemctl start nginx</code> — systemd service mgmt</li>
              <li><code className="font-mono text-rose-600">journalctl -u nginx</code> — View service logs</li>
              <li><code className="font-mono text-rose-600">nice -n -10 ./app</code> — Set process priority</li>
            </ul>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <div className="flex items-center gap-2 mb-4"><FileCode2 className="w-4 h-4 text-violet-600" /><h2 className="text-sm font-black uppercase tracking-wider text-gray-700">Shell Scripting</h2></div>
          <pre className="bg-gray-900 text-green-400 p-4 rounded-xl text-xs sm:text-sm font-mono overflow-x-auto leading-relaxed">{SHELL_EXAMPLE}</pre>
          <div className="grid sm:grid-cols-3 gap-3 mt-4 text-xs sm:text-sm text-gray-600">
            <div className="p-3 bg-gray-50 rounded-lg"><span className="font-bold text-gray-800">Variables</span><br /><code className="font-mono text-violet-600">NAME="value"; echo $NAME</code></div>
            <div className="p-3 bg-gray-50 rounded-lg"><span className="font-bold text-gray-800">Conditionals</span><br /><code className="font-mono text-violet-600">if [ -f "$file" ]; then ...</code></div>
            <div className="p-3 bg-gray-50 rounded-lg"><span className="font-bold text-gray-800">Loops</span><br /><code className="font-mono text-violet-600">{'for i in {1..10}; do ... done'}</code></div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <div className="flex items-center gap-2 mb-4"><HardDrive className="w-4 h-4 text-indigo-600" /><h2 className="text-sm font-black uppercase tracking-wider text-gray-700">Networking & Storage</h2></div>
          <div className="grid sm:grid-cols-2 gap-4 text-xs sm:text-sm text-gray-600">
            <div>
              <h4 className="font-bold text-gray-800 mb-2">Network Commands</h4>
              <ul className="space-y-1">
                <li><code className="font-mono text-indigo-600">ss -tuln</code> — Listening ports</li>
                <li><code className="font-mono text-indigo-600">ip addr</code> — IP configuration</li>
                <li><code className="font-mono text-indigo-600">curl -v http://...</code> — HTTP debugging</li>
                <li><code className="font-mono text-indigo-600">nc -vz host 80</code> — Port connectivity</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-gray-800 mb-2">Disk & Filesystem</h4>
              <ul className="space-y-1">
                <li><code className="font-mono text-indigo-600">df -h</code> — Disk usage</li>
                <li><code className="font-mono text-indigo-600">du -sh *</code> — Directory sizes</li>
                <li><code className="font-mono text-indigo-600">fdisk -l</code> — Partition table</li>
                <li><code className="font-mono text-indigo-600">mount /dev/sda1 /mnt</code> — Mount filesystem</li>
              </ul>
            </div>
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
