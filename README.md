# BornoFlow

<p align="center">
  <strong>The complete learning, career, and productivity platform for Computer Science students.</strong><br />
  A product of <a href="https://bornosoftnr.com"><strong>Bornosoft</strong></a>
</p>

<p align="center">
  <a href="https://bornosoftnr.com">Website</a> ·
  <a href="https://github.com/kazinayeem/assignment-pdf-generator">GitHub</a> ·
  <a href="/changelog">Changelog</a> ·
  <a href="/about">About</a>
</p>

---

## Table of Contents

- [Introduction](#introduction)
- [Why BornoFlow](#why-bornoflow)
- [Platform Products](#platform-products)
- [Feature Deep Dive](#feature-deep-dive)
- [Routes & Navigation](#routes--navigation)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Design System](#design-system)
- [Internationalization](#internationalization)
- [PDF & Document Generation](#pdf--document-generation)
- [State Management & Persistence](#state-management--persistence)
- [Knowledge Base & Interview Content](#knowledge-base--interview-content)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Scripts & Commands](#scripts--commands)
- [Firebase & Authentication](#firebase--authentication)
- [Building for Production](#building-for-production)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [Policies & Legal](#policies--legal)
- [Links](#links)

---

## Introduction

**BornoFlow** is an all-in-one platform built for **CSE, SWE, and CS students** — especially in Bangladesh — who need structured learning paths, career preparation tools, academic document generators, university guidance, and everyday developer utilities in one place.

Instead of juggling five or more separate websites for resumes, roadmaps, interview prep, PDF covers, and JSON formatters, BornoFlow brings everything together under a single premium SaaS experience with:

- Dark / light mode
- English & Bangla (বাংলা) language support
- Mobile-responsive layouts (320px → 2560px)
- Client-side PDF generation (no server upload required for most tools)
- Free access for students

**Bornosoft** is the parent company behind BornoFlow and related EdTech products. Company branding, changelog, and documentation follow the BornoFlow / Bornosoft identity.

| | |
|---|---|
| **Platform** | BornoFlow |
| **Company** | Bornosoft |
| **Website** | [bornosoftnr.com](https://bornosoftnr.com) |
| **Repository** | [github.com/kazinayeem/assignment-pdf-generator](https://github.com/kazinayeem/assignment-pdf-generator) |
| **Contact** | [bornosoftnr@gmail.com](mailto:bornosoftnr@gmail.com) |
| **Current version** | v6.1 (see `/changelog`) |

---

## Why BornoFlow

| Problem | BornoFlow solution |
|---------|-------------------|
| Scattered learning resources | 75+ structured career roadmaps with interactive graphs |
| Generic resume builders | ATS-optimized CV builder tuned for tech hiring |
| No Bangladesh-specific interview prep | 5,000+ questions from local & global tech companies |
| Manual assignment formatting | One-click DIU official cover & lab report PDFs |
| University research is fragmented | 181+ UGC universities with compare, cost & admission tools |
| Too many dev utility tabs open | 100+ in-browser tools (JSON, YAML, encoding, QR, etc.) |
| Paid courses for basic CS practice | Free interactive simulators, quizzes, and exams |

---

## Platform Products

BornoFlow is organized into named sub-products under the Bornosoft ecosystem:

| Product | Codename | What it does | Entry route |
|---------|----------|--------------|-------------|
| **BornoMaps** | Career roadmaps | 75 interactive learning paths with graph UI, progress, interview Q&A, coding problems, PDF export | `/roadmaps` |
| **BornoCareer** | Career hub | Resume, ATS checker, cover letter, portfolio, LinkedIn, GitHub README, job & internship trackers | `/career` |
| **BornoUni** | University hub | 181 UGC universities, rankings, compare, calculators, admission tools | `/universities` |
| **BornoDev** | Developer tools | 100 browser utilities — formatters, encoders, generators, playgrounds | `/developer-tools` |
| **Borno AI** | Learning assistant | AI-powered study tools (in development) | `/tools` |
| **Assignment Studio** | Academic docs | DIU-format assignment cover page generator | `/assignment` |
| **Lab Report Generator** | Academic docs | DIU-format lab report with evaluation table | `/lab-report` |
| **Interview Hub** | Interview prep | Company-wise questions, search, notes, snippets, archive | `/interview` |
| **CS Learning Hub** | Interactive learning | 15+ CS subjects with simulators, lessons, exams | `/tools` |
| **Calculators** | Financial & academic | 80+ EMI, FD, SIP, tax, salary, and student calculators | `/calculators` |

---

## Feature Deep Dive

### BornoMaps — Career Roadmaps (`/roadmaps`)

The flagship learning product with **75 career roadmaps** across roles, languages, frameworks, cloud, DevOps, security, data, and AI.

**Roadmap categories:**
- Career Roles (Frontend, Backend, Full Stack, DevOps, Data Scientist, etc.)
- Languages (Python, JavaScript, Java, Go, Rust, C++, etc.)
- Frameworks (React, Next.js, Django, Spring Boot, Laravel, etc.)
- Cloud (AWS, Azure, GCP)
- DevOps & Platform (Docker, Kubernetes, Terraform, Linux)
- Security (Ethical Hacking, SOC Analyst)
- Data & AI (Data Analyst, Machine Learning, Deep Learning)
- Mobile, Game Dev, Blockchain, and more

**Per-roadmap features:**
- Multi-phase structured learning path
- **Graph V2** — React Flow interactive node graph with zoom, pan, minimap
- Node detail panels: theory, code examples, cheat sheets, resources, projects
- Interview questions & coding problems per topic
- Career salary ranges & job market demand indicators
- Portfolio checklist & job readiness score
- Bookmarking, recent activity, daily/weekly goals
- Learning dashboard at `/roadmaps/dashboard`
- **PDF export** with BornoFlow branding

**Example roadmaps:** `frontend-developer`, `backend-developer`, `devops-engineer`, `data-scientist`, `react`, `nextjs`, `aws`, `kubernetes`, `ethical-hacking`, `machine-learning`

---

### BornoCareer — Career Hub (`/career`)

End-to-end career preparation toolkit:

| Tool | Route | Description |
|------|-------|-------------|
| Career Hub Home | `/career` | Overview of all career tools |
| CV / Resume Builder | `/cv-builder` | Europass-style, ATS-friendly resume with PDF export |
| ATS Checker | `/career/ats-checker` | Keyword density, formatting & readability analysis |
| Cover Letter | `/career/cover-letter` | Generate tailored cover letters |
| Portfolio Builder | `/career/portfolio` | Structure your developer portfolio |
| LinkedIn Optimizer | `/career/linkedin` | Profile improvement suggestions |
| GitHub README | `/career/github-readme` | Generate professional README templates |
| Job Tracker | `/career/job-tracker` | Track applications, stages, and follow-ups |
| Internship Tracker | `/career/internship-tracker` | Manage internship applications |
| Salary Calculator | `/career/salary-calculator` | Estimate tech salaries by role & region |
| Career Analytics | `/career/analytics` | Visualize your career prep progress |
| Mock Interview | `/career/interview/mock` | Practice interview sessions |
| Legacy career roadmaps | `/career/roadmaps` | Redirects to BornoMaps (`/roadmaps`) |

---

### Interview Hub (`/interview`)

Comprehensive interview preparation powered by a markdown knowledge base in `docs/`:

| Section | Route |
|---------|-------|
| Hub home | `/interview` |
| Browse by company | `/interview/companies` |
| Search all questions | `/interview/search` |
| Study notes | `/interview/notes` |
| Code snippets | `/interview/snippets` |
| Resources | `/interview/resources` |
| Upcoming interviews | `/interview/upcoming` |
| Archive | `/interview/archive` |
| Dynamic topic pages | `/interview/[...slug]` |

Covers **Bangladeshi companies** (Brain Station 23, BJIT, Enosis, TigerIT, etc.) and **global tech giants** (Google, Microsoft, Amazon, Meta, etc.) with real interview questions, answers, and preparation guides.

---

### CS Learning Hub (`/tools`)

**15 interactive CS subjects** with simulators, visualizations, lessons, and practice:

| Subject | Route | Highlights |
|---------|-------|------------|
| Operating Systems | `/tools/os` | Scheduling, memory, deadlock simulators |
| Data Structures | `/tools/dsa` | Arrays, linked lists, trees, graphs |
| Algorithms | `/tools/algorithms` | Sorting, DP, graphs, interview patterns |
| Computer Networks | `/tools/network` | TCP/IP, subnetting, HTTP, simulations |
| Database Systems | `/tools/database` | SQL, ERD, normalization |
| Cyber Security | `/tools/security` | Encryption, web security, malware labs |
| Computer Architecture | `/tools/arch` | CPU, cache, pipelining (40+ topics) |
| Theory of Computing | `/tools/theory-of-computing` | DFA, NFA, Turing machines |
| Software Engineering | `/tools/swe` | SDLC, UML, Agile |
| Programming | `/tools/programming` | C, C++, Python, JavaScript, Java |
| Web Development | `/tools/web` | Frontend, backend, full-stack |
| Data Science | `/tools/data-science` | ML, deep learning, NLP, LLMs |
| DevOps | `/tools/devops` | Docker, K8s, CI/CD, Terraform |
| Mobile Development | `/tools/mobile` | React Native, Flutter |
| Exams & Quizzes | `/tools/exam` | Timed quizzes with leaderboard |

**Learning features:**
- Progress tracking (`/tools/learning/progress`)
- Leaderboard (`/tools/learning/leaderboard`)
- Pinnable subjects in sidebar
- Collapsible sidebar with search
- Per-topic simulators and visual demos

---

### BornoUni — University Hub (`/universities`)

**181 UGC-approved Bangladeshi universities** with rich profiles and decision tools.

| Feature | Route |
|---------|-------|
| University explorer | `/universities` |
| University detail | `/universities/[slug]` |
| Department detail | `/universities/[slug]/departments/[dept]` |
| Side-by-side compare (up to 4) | `/universities/compare` |
| Total degree cost calculator | `/universities/calculator` |
| Admission chance predictor | `/universities/predictor` |
| AI university recommender | `/universities/recommend` |
| Scholarship eligibility checker | `/universities/scholarships` |
| Credit transfer estimator | `/universities/credit-transfer` |
| Admission circulars hub | `/universities/circulars` |
| Student community Q&A | `/universities/community` |

**Data includes:** tuition & fees, QS/THE/Webometrics rankings, THE Sustainability SDG scores, admission requirements, hostel & scholarship info, employability scores, virtual campus tours, curriculum browser, student reviews, and PDF export for profiles and comparisons.

---

### BornoDev — Developer Tools (`/developer-tools`)

**100 in-browser utilities** — no install, no account required for most tools.

**Categories:**

| Category | Examples |
|----------|----------|
| **JSON** (12 tools) | Viewer, formatter, validator, minifier, compare, to-YAML/XML/CSV/TypeScript |
| **YAML** | Viewer, formatter, validator, to-JSON |
| **XML & CSV** | Format, validate, convert |
| **CSS & Tailwind** | Formatter, minifier, gradient generator, Tailwind playground |
| **Layout** | Flexbox playground, CSS Grid playground |
| **Color** | Picker, converter, palette generator, contrast checker |
| **SVG & Image** | Optimizer, converter, resizer, favicon generator |
| **QR & Barcode** | QR generator, barcode generator |
| **Encoding** | Base64, URL, HTML, Unicode, ASCII, binary, hex |
| **Generators** | UUID, Nano ID, password, hash (SHA-256/512), JWT encode/decode, timestamp, lorem ipsum, random string/number |
| **Network** | IP lookup, CIDR calculator, subnet calculator, HTTP header viewer, user-agent parser, port reference |

Features: favorites, recent tools, usage counts (persisted in localStorage).

---

### Calculators (`/calculators`)

**80+ calculators** for students and professionals:

- **Banking & Loans:** EMI, home/personal/car/education loan, mortgage, prepayment, loan comparison, eligibility
- **Fixed Deposits:** FD maturity, monthly/quarterly/yearly interest, tax-saving FD, RD/DPS
- **Investments:** SIP, mutual fund, compound/simple interest, stock ROI
- **Tax:** Income tax (India & Bangladesh)
- **Salary:** In-hand salary, CTC breakdown
- **Business:** Profit margin, break-even, ROI
- **Bangladesh-specific:** BDT-focused financial tools

Each calculator supports favorites, recent history, and result export.

---

### Academic Productivity

| Tool | Route | Details |
|------|-------|---------|
| Assignment Cover | `/assignment` | DIU official format, auto-fill profile, one-click PDF |
| Lab Report | `/lab-report` | DIU lab report with evaluation table |
| CV Builder | `/cv-builder` | Europass CV, ATS optimization, PDF download |
| Routine Builder | `/routine-builder` | Drag-and-drop class timetable |
| Result / Transcript | `/result` | Unofficial transcript generation |
| Lab Performance | `/lab-performance` | Lab performance tracking |

**DIU integration:** Student profiles auto-save course, teacher, and department info. Google OAuth restricted to `@diu.edu.bd` for authenticated student features.

---

### Landing, About & Changelog

| Page | Route | Description |
|------|-------|-------------|
| Landing V5 | `/` | Hero, features, testimonials, pricing, FAQ, roadmap preview |
| About V2 | `/about` | Company story, mission/vision, founders, timeline, ecosystem |
| Changelog | `/changelog` | Full release center with filters, search, PDF export, RSS |
| FAQ | `/#faq` | 20+ categorized questions (schema.org markup) |
| Login | `/login` | Google OAuth sign-in |
| Policies | `/privacy-policy`, `/cookie-policy`, `/refund-policy`, `/security-policy` |

**Changelog RSS feed:** `/api/changelog/rss`

---

## Routes & Navigation

### Top-level navigation (navbar mega menus)

- **Tools** → CS learning subjects, exams, progress
- **Roadmaps** → BornoMaps hub, dashboard, individual roadmaps
- **Universities** → Explorer, compare, calculator, predictor
- **Interview** → Company questions, search, notes
- **Career** → Resume, ATS, trackers, portfolio
- **Developer** → BornoDev tool registry
- **Calculators** → Financial calculator hub
- **Assignment / CV / Lab** → Quick academic tools

### Sitemap

The production sitemap (`/sitemap.xml`) is auto-generated from:

- Static routes (home, career, tools, interview, policies, about, changelog)
- All roadmap slugs (`/roadmaps/[slug]`)
- All university slugs (`/universities/[slug]`)
- Knowledge base routes from `docs/` markdown imports

---

## Tech Stack

### Core

| Technology | Version | Purpose |
|------------|---------|---------|
| **Next.js** | 15.3 | App Router, SSR/SSG, API routes, metadata |
| **React** | 19 | UI components |
| **TypeScript** | 5 | Type safety across the entire codebase |
| **Tailwind CSS** | 4 | Utility-first styling, design tokens |
| **Turbopack** | — | Fast dev server (`next dev --turbopack`) |

### UI & Animation

| Technology | Purpose |
|------------|---------|
| **ShadCN UI** + **Radix UI** | Accessible primitives (dialog, select, slot) |
| **Framer Motion** | Page transitions, landing animations |
| **Lucide React** | Icon system |
| **Plus Jakarta Sans** + **Geist Mono** | Typography (Google Fonts) |
| **next-themes** | Dark / light / system theme |

### Data & State

| Technology | Purpose |
|------------|---------|
| **Zustand** | Client state with `persist` middleware |
| **React Hook Form** + **Zod** | Form validation |
| **Firebase Auth** | Google OAuth |
| **Firestore** | Teachers, courses, students, profiles |
| **NextAuth** | Session management |

### Documents & Export

| Technology | Purpose |
|------------|---------|
| **jsPDF** + **jspdf-autotable** | Roadmap, university, changelog PDFs |
| **html2pdf.js** | HTML-to-PDF for CV and documents |
| **html-to-image** | Screenshot / image export |
| **xlsx** | Spreadsheet export |

### Visualization & Interaction

| Technology | Purpose |
|------------|---------|
| **React Flow** | BornoMaps interactive graph V2 |
| **Chart.js** + **react-chartjs-2** | Analytics charts |
| **FullCalendar** | Routine builder calendar |
| **@dnd-kit** | Drag-and-drop (routine builder, sortable lists) |
| **qrcode** | QR code generation |

### Content & Markdown

| Technology | Purpose |
|------------|---------|
| **gray-matter** | Frontmatter parsing for knowledge base |
| **react-markdown** | Render interview docs & content |
| **remark-gfm** | GitHub-flavored markdown |
| **rehype-*** | Syntax highlighting, sanitization, slug headings |

### DevOps & Analytics

| Technology | Purpose |
|------------|---------|
| **Vercel** | Hosting & deployment |
| **@vercel/analytics** | Usage analytics |
| **Firebase CLI** | Firestore rules deployment |
| **tsx** | TypeScript script runner (seed, import) |
| **ESLint** | Code linting |

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Next.js App Router                       │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────────────┐ │
│  │ Landing  │ │ Roadmaps │ │ Career   │ │ Universities     │ │
│  │ /        │ │ /roadmaps│ │ /career  │ │ /universities    │ │
│  └──────────┘ └──────────┘ └──────────┘ └──────────────────┘ │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────────────┐ │
│  │ Tools    │ │ Interview│ │ DevTools │ │ Calculators      │ │
│  │ /tools   │ │/interview│ │/dev-tools│ │ /calculators     │ │
│  └──────────┘ └──────────┘ └──────────┘ └──────────────────┘ │
└──────────────────────────┬──────────────────────────────────┘
                           │
         ┌─────────────────┼─────────────────┐
         ▼                 ▼                 ▼
   ┌───────────┐    ┌─────────────┐   ┌─────────────┐
   │ Zustand   │    │ Firebase    │   │ Static JSON │
   │ Stores    │    │ Auth + DB   │   │ + Markdown  │
   │ (local)   │    │ (optional)  │   │ docs/       │
   └───────────┘    └─────────────┘   └─────────────┘
```

### Key architectural decisions

1. **Client-side PDF generation** — Most documents are generated in the browser via jsPDF/html2pdf. No file upload to servers for assignment covers, lab reports, or CVs.

2. **Catalog-driven tools** — Roadmaps (`lib/roadmaps/catalog.ts`), dev tools (`lib/devtools/registry.ts`), and calculators (`lib/calculators/registry.ts`) are defined as typed registries. New tools are added by extending the catalog, not creating duplicate page files.

3. **Markdown knowledge base** — Interview content lives in `docs/` as markdown. The `scripts/import-knowledge.ts` script runs at build time (`prebuild`) to index content for search and routing.

4. **i18n via JSON namespaces** — Translations are file-based (`locales/en/`, `locales/bn/`) loaded through `lib/i18n/messages.ts` and consumed via `useTranslation()` hook.

5. **Brand single source of truth** — All company/platform URLs, logos, and PDF branding come from `lib/brand.ts`.

6. **Design system tokens** — Shared spacing, typography, buttons, cards, and inputs in `lib/design-system/index.ts` + CSS variables in `app/globals.css`.

---

## Project Structure

```
assignment-pdf-generator/
├── app/                          # Next.js App Router
│   ├── page.tsx                  # Landing page (V5)
│   ├── layout.tsx                # Root layout, metadata, providers
│   ├── globals.css               # Design tokens, dark mode, print styles
│   ├── about/                    # About page V2
│   ├── changelog/                # Release notes center
│   ├── roadmaps/                 # BornoMaps
│   │   ├── page.tsx              # Roadmap hub
│   │   ├── dashboard/            # Learning dashboard
│   │   └── [slug]/               # Individual roadmap + graph
│   ├── career/                   # BornoCareer tools
│   ├── universities/             # BornoUni hub
│   ├── developer-tools/          # BornoDev registry UI
│   ├── calculators/              # Calculator hub
│   ├── tools/                    # CS learning (200+ pages)
│   ├── interview/                # Interview knowledge hub
│   ├── assignment/               # Assignment cover generator
│   ├── lab-report/               # Lab report generator
│   ├── cv-builder/               # Resume builder
│   ├── routine-builder/          # Class routine builder
│   ├── login/                    # Auth page
│   ├── admin/                    # Super admin dashboard
│   ├── student/                  # Student dashboard
│   └── api/                      # API routes (changelog RSS, etc.)
│
├── components/                   # React components
│   ├── landing/                  # Landing V4/V5 sections
│   ├── roadmaps/                 # Graph V2, hub, dashboard, node panels
│   ├── career/                   # ATS, trackers, portfolio
│   ├── universities/             # Cards, compare, calculator, rankings
│   ├── devtools/                 # Tool renderer components
│   ├── calculators/              # Calculator UI
│   ├── changelog/                # Timeline, filters, release cards
│   ├── about/                    # About V2 sections
│   ├── knowledge/                # Interview sidebar, search, markdown
│   ├── ui/                       # ShadCN primitives
│   ├── footer.tsx                # Premium multi-column footer
│   └── app-footer.tsx            # Footer wrapper
│
├── lib/                          # Business logic
│   ├── brand.ts                  # BornoFlow / Bornosoft constants
│   ├── design-system/            # Spacing, typography, button tokens
│   ├── i18n/                     # Provider, messages, types
│   ├── roadmaps/                 # Catalog, store, graph, PDF export
│   ├── universities/             # Seeds, search, rankings, PDF
│   ├── devtools/                 # Registry, engines, store
│   ├── calculators/              # Registry, engines, store
│   ├── career/                   # Career store, salary, ATS logic
│   ├── learning-store.ts         # CS learning progress
│   ├── exam-store.ts             # Quiz & exam state
│   ├── knowledge-store.ts        # Interview bookmarks
│   ├── changelog/                # Release catalog, export, RSS
│   └── auth-store.ts             # Firebase auth state
│
├── locales/
│   ├── en/                       # English translations (10 namespaces)
│   └── bn/                       # Bangla translations (10 namespaces)
│
├── docs/                         # Interview & knowledge markdown
│   ├── companies/                # Per-company interview guides
│   ├── notes/                    # CS study notes
│   └── index.md
│
├── public/
│   ├── manifest.json             # PWA manifest
│   ├── sw.js                     # Service worker
│   └── logo_navbar.png
│
├── scripts/
│   ├── import-knowledge.ts       # Build-time markdown indexer
│   └── seed-firebase.ts          # Firestore data seeder
│
├── firestore.rules               # Firestore security rules
├── FIREBASE_SETUP.md             # Firebase setup guide
└── package.json
```

---

## Design System

BornoFlow uses a centralized design system for visual consistency:

**Brand color:** `#6D5DF6` (violet) — CSS variable `--brand`

**Key files:**
- `lib/design-system/index.ts` — `spacing`, `typography`, `button`, `card`, `input`, `badge`, `animation`
- `app/globals.css` — CSS custom properties, dark mode, glassmorphism, print footer

**Principles:**
- `rounded-xl` / `rounded-2xl` border radius on cards and inputs
- `min-h-[44px]` touch targets on mobile
- `bg-background` / `text-foreground` semantic colors (no hardcoded grays on new components)
- `focus:ring-brand/20` focus rings for accessibility
- Framer Motion for section reveal animations on landing

---

## Internationalization

BornoFlow supports **English (`en`)** and **Bangla (`bn`)**.

| Namespace | Covers |
|-----------|--------|
| `common` | Navbar, mega menus, cookie banner, theme toggle |
| `home` | Landing page sections |
| `footer` | Footer columns and links |
| `faq` | FAQ accordion content |
| `about` | About page V2 (all 15 sections) |
| `policies` | Privacy, cookie, refund, security |
| `v5` | Landing V5 extras (demo, community, changelog preview) |
| `universities` | Full university hub UI |
| `roadmaps` | Roadmap hub, graph, dashboard |
| `changelog` | Release center |

**How it works:**
1. User selects language via navbar/footer switcher
2. Locale stored in `localStorage` (`campusflow-locale`)
3. `document.documentElement.lang` updated to `bn` or `en`
4. Components call `useTranslation("namespace")` → `t("key")`

Bangla copy uses natural, student-friendly language (not machine-translated formal Bengali).

---

## PDF & Document Generation

| Document | Engine | Branding |
|----------|--------|----------|
| Assignment cover | jsPDF | BornoFlow / Bornosoft |
| Lab report | jsPDF + autotable | BornoFlow / Bornosoft |
| CV / Resume | html2pdf.js | User content + platform footer |
| Roadmap export | jsPDF (multi-section) | Company-only footer |
| University profile | jsPDF | BornoFlow branding |
| Changelog release notes | jsPDF | Company-only footer |
| Print styles | CSS `@media print` | `body::after` company line |

PDF filenames use the `bornoflow` prefix (e.g. `frontend-developer-bornoflow-roadmap.pdf`).

---

## State Management & Persistence

Zustand stores with `persist` middleware (localStorage):

| Store | Key | Data persisted |
|-------|-----|----------------|
| Roadmaps | `campusflow-roadmaps-v1` | Progress, bookmarks, goals, readiness |
| DevTools | `campusflow-devtools` | Favorites, recent, usage counts |
| Calculators | `campusflow-calculators` | Favorites, recent, calculation history |
| Learning | `campusflow-learning` | Subject progress, pins |
| Exam | `campusflow-exam` | Quiz scores, attempts |
| Career | `campusflow-career` | Job tracker, applications |
| Knowledge | `campusflow-knowledge` | Interview bookmarks |
| Universities | `campusflow-uni-*` | Favorites, bookmarks, reviews, offline |
| Locale | `campusflow-locale` | `en` or `bn` |
| Cookie consent | `campusflow-cookie-consent` | Accept level |
| Theme | `next-themes` | Light / dark / system |

> Store keys retain the `campusflow-*` prefix for backward compatibility with existing user data.

---

## Knowledge Base & Interview Content

The `docs/` folder contains markdown files for the Interview Hub:

```
docs/
├── companies/          # 40+ company interview guides
│   ├── bs23.md
│   ├── enosis.md
│   ├── brain-station-23.md
│   └── ...
├── notes/              # CS topic notes
├── resource/           # Additional resources
└── index.md
```

**Build pipeline:**
```bash
npm run import-knowledge   # Indexes markdown → searchable routes
npm run build              # Runs import-knowledge automatically (prebuild)
```

Imported routes power `/interview/[...slug]` dynamic pages with sidebar navigation, full-text search, and syntax-highlighted code blocks.

---

## Getting Started

### Prerequisites

- **Node.js** 20 or later
- **npm** or **yarn**
- **Git**

Optional (for auth/admin features):
- Firebase project with Auth + Firestore enabled
- Google Cloud OAuth credentials

### Installation

```bash
# 1. Clone
git clone https://github.com/kazinayeem/assignment-pdf-generator.git
cd assignment-pdf-generator

# 2. Install dependencies
npm install

# 3. Environment (optional for public tools)
cp .env.local.example .env.local   # if available — see FIREBASE_SETUP.md

# 4. Start development server
npm run dev
```

Open **http://localhost:3000**

### First-time build

```bash
npm run import-knowledge   # Index interview markdown
npm run build              # Production build
npm run start              # Serve production build
```

---

## Environment Variables

Create `.env.local` in the project root:

```env
# Site
NEXT_PUBLIC_SITE_URL=https://bornosoftnr.com

# Firebase (required for auth & admin)
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# NextAuth (if configured)
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_secret
```

| Variable | Required | Used for |
|----------|----------|----------|
| `NEXT_PUBLIC_SITE_URL` | Recommended | Sitemap, RSS, Open Graph, canonical URLs |
| `NEXT_PUBLIC_FIREBASE_*` | Auth only | Login, student dashboard, admin panel |
| `NEXTAUTH_*` | Auth only | Session management |

> **Note:** Assignment generator, roadmaps, dev tools, calculators, universities, and interview hub work **without** Firebase. Only `/login`, `/student/*`, and `/admin/*` require Firebase.

Full setup guide: **[FIREBASE_SETUP.md](./FIREBASE_SETUP.md)**

---

## Scripts & Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server with Turbopack on port 3000 |
| `npm run build` | Production build (auto-runs `import-knowledge`) |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint (zero warnings target) |
| `npm run seed` | Seed Firestore with teachers, courses, students |
| `npm run import-knowledge` | Index `docs/` markdown for interview hub |

### Type checking

```bash
npx tsc --noEmit
```

### Firebase commands

```bash
firebase deploy --only firestore:rules   # Deploy security rules
firebase deploy --only firestore:indexes # Deploy indexes (if configured)
```

---

## Firebase & Authentication

### Authentication flow

1. User clicks **Sign In** → Google OAuth popup
2. Email validated against `@diu.edu.bd` domain
3. Role assigned: `student` or `super-admin`
4. Session persisted via Firebase Auth + NextAuth

### User roles

| Role | Access |
|------|--------|
| **Student** | `/student/dashboard`, teacher search, department selection, PDF generation with saved profile |
| **Super Admin** | `/admin` — manage teachers, courses, students, seed data |

### Admin routes

```
/admin                  # Dashboard overview
/admin/teachers         # Teacher management
/admin/courses          # Course management
/admin/students         # Student management
/admin/departments      # Department management
/admin/seed-teachers    # Bulk teacher import
/admin/wipe-and-seed    # Reset & reseed database
```

### Student routes

```
/student/dashboard      # Student home
/student/assignment     # Assignment generator (authenticated)
/student/mycourses      # Enrolled courses
/student/routine        # Personal routine view
/student/lab-performance
```

---

## Building for Production

```bash
# Full production pipeline
npm run lint          # 1. Lint
npx tsc --noEmit      # 2. Type check
npm run build         # 3. Build (includes knowledge import)
npm run start         # 4. Verify locally
```

**Build output includes:**
- Static pages (landing, about, policies)
- Dynamic routes (roadmaps, universities, tools, interview)
- API routes (`/api/changelog/rss`)
- Optimized JS bundles with code splitting per route

**Pre-build step:** `scripts/import-knowledge.ts` scans `docs/` and generates searchable route metadata used by the interview hub and sitemap.

---

## Deployment

### Vercel (recommended)

1. Connect GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy — `next build` runs automatically

```bash
# Or deploy via CLI
vercel --prod
```

### Environment on Vercel

Set `NEXT_PUBLIC_SITE_URL` to your production domain (e.g. `https://bornosoftnr.com`).

### PWA

- `public/manifest.json` — app name, icons, theme color
- `public/sw.js` — service worker for offline university data
- Manifest linked in root `app/layout.tsx`

---

## Contributing

BornoFlow is **open source**. We welcome contributions of all kinds.

### How to contribute

1. **Fork** the repository
2. **Create a branch:** `git checkout -b feature/your-feature`
3. **Make changes** following existing code conventions
4. **Test:** `npm run lint && npx tsc --noEmit && npm run build`
5. **Commit** with a clear message
6. **Open a Pull Request** with description and screenshots

### Contribution areas

- New career roadmaps (`lib/roadmaps/catalog.ts`)
- New developer tools (`lib/devtools/registry.ts`)
- Interview company guides (`docs/companies/`)
- Bangla translations (`locales/bn/`)
- Bug fixes and accessibility improvements
- University data updates (`lib/universities/seeds.ts`)

### Code conventions

- Use `lib/design-system` tokens for new UI
- Use `BRAND` from `lib/brand.ts` for all branding strings
- Add i18n keys to both `locales/en/` and `locales/bn/` for user-facing text
- Keep components focused — prefer extending catalogs over duplicating pages
- Run lint before submitting PRs

### Report issues

- [GitHub Issues](https://github.com/kazinayeem/assignment-pdf-generator/issues)
- Email: [bornosoftnr@gmail.com](mailto:bornosoftnr@gmail.com)

---

## Policies & Legal

| Policy | Route |
|--------|-------|
| Privacy Policy | `/privacy-policy` |
| Cookie Policy | `/cookie-policy` |
| Refund Policy | `/refund-policy` |
| Security Policy | `/security-policy` |

BornoFlow is **free for students**. No credit card required. Core features will remain free.

---

## Links

| Resource | URL |
|----------|-----|
| BornoFlow website | [bornosoftnr.com](https://bornosoftnr.com) |
| GitHub repository | [github.com/kazinayeem/assignment-pdf-generator](https://github.com/kazinayeem/assignment-pdf-generator) |
| Changelog | `/changelog` |
| Changelog RSS | `/api/changelog/rss` |
| About & founders | `/about` |
| Firebase setup | [FIREBASE_SETUP.md](./FIREBASE_SETUP.md) |

---

## License

MIT License — see the repository for the full license text.

---

<p align="center">
  <strong>BornoFlow</strong> · A product of <strong>Bornosoft</strong><br />
  <a href="https://bornosoftnr.com">bornosoftnr.com</a>
</p>
