# PrepFlow 🚀

> **Your unified platform for technical interview preparation.**
> Practice DSA, compile code in the browser, check your resume with AI, and discover real job opportunities — all in one place.

🌐 **Live:** [prepflow.vercel.app](https://prepflow.vercel.app)

---

## ✨ Features

### 📚 Curated DSA Sheets
- Browse multiple curated problem sheets (e.g., Striver's A2Z, Love Babbar 450, and more)
- Problems sourced from **LeetCode** and **GeeksForGeeks**
- Filter by difficulty, topic, and company tags
- Track your progress per-problem with a PostgreSQL-backed `UserProgress` model

### 🏢 Company-Wise Questions
- Dedicated company pages for **Google, Amazon, Microsoft, Meta, Apple**, and many more
- Browse problems tagged by company with difficulty and acceptance rate
- Hover cards showing problem details at a glance via `@radix-ui/react-hover-card`

### 💻 Online Code Compiler
- Powered by **Monaco Editor** (the engine behind VS Code)
- Supports **Python, Java, C, C++, and JavaScript**
- Custom **IntelliSense** — language-aware keyword and built-in completion providers for all 5 languages
- **Code Snippets** — rich tab-stop snippets (loops, classes, try-catch, etc.) for all languages
- Live terminal output via `@xterm/xterm`
- Resizable panels with `react-resizable-panels` and fullscreen mode

### 🤖 AI-Powered ATS Resume Checker
- Upload a **PDF or DOCX** resume (up to 5MB)
- Powered by **Google Gemini 2.5 Flash** via `@google/generative-ai`
- Generates a scored ATS report with:
  - **ATS Score** (0–100) broken down into: Relevance & Impact, Keyword Match, Formatting, Contact Completeness
  - **Missing sections** (critical & recommended)
  - **Missing skills** (must-have & nice-to-have) when a job description is provided
  - **Weak bullet rewrites** — up to 3 specific bullet-point improvement suggestions
  - **Actionable suggestions** tailored to real recruiter standards
- Optional job description input for targeted analysis

### 💼 Jobs & Internships Board
- Browse full-time, part-time, remote, and contract job listings
- Internship listings with stipend, duration, and type
- Filter and search across roles, companies, and locations

### 🗺️ Roadmap Builder (Admin)
- Visual roadmap builder powered by **React Flow (`@xyflow/react`)**
- Node types: MAIN, SUB, END, OPTIONAL — persisted to PostgreSQL via Prisma

### 🔐 Authentication
- Secure authentication via **Better Auth** with session management
- Google OAuth and email methods supported
- Role-based access control (`USER` / `ADMIN`)

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | Next.js 16 (App Router, Server Actions) |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS v4, `tw-animate-css`, `tailwindcss-motion` |
| **UI Components** | Radix UI, shadcn/ui, Lucide React, Framer Motion |
| **Database** | PostgreSQL via `pg` + Prisma ORM |
| **Auth** | Better Auth |
| **AI** | Google Gemini 2.5 Flash (`@google/generative-ai`) |
| **Code Editor** | Monaco Editor (`@monaco-editor/react`) |
| **Terminal** | xterm.js (`@xterm/xterm`) |
| **State Management** | Zustand, TanStack Query (React Query) |
| **Data Tables** | TanStack Table |
| **Routing / Flow** | React Flow (`@xyflow/react`) |
| **File Parsing** | `pdf-parse`, `mammoth` |
| **Caching** | Upstash Redis |
| **Deployment** | Vercel |
| **Analytics** | Vercel Analytics |

---

## 🗄️ Database Schema (Key Models)

```
User → UserProgress (many-to-many through problems)
Problem → ProblemTopic, ProblemCompany, ProblemMainTopic, ProblemCategory, SheetCategory
Sheets → SheetCategory → Problem
Jobs, Internships
Roadmap → Node → Edge
```

Platforms supported: **LeetCode**, **GeeksForGeeks**
Difficulty levels: `EASY`, `MEDIUM`, `HARD`, `BASIC`, `SCHOOL`

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL database
- Google AI API key (for ATS checker)
- Upstash Redis (for caching)

### Installation

```bash
# Clone the repository
git clone https://github.com/cygnuxxs/prepflow.git
cd prepflow

# Install dependencies (automatically runs prisma generate & db push)
pnpm install

# Set up environment variables
cp .env.example .env
# Fill in: DATABASE_URL, GOOGLE_AI_API_KEY, BETTER_AUTH_SECRET, UPSTASH_REDIS_REST_URL, etc.

# Start the development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Available Scripts

| Command | Description |
|---|---|
| `pnpm dev` | Start dev server with Turbopack |
| `pnpm build` | Generate Prisma client & build for production |
| `pnpm start` | Start production server |
| `pnpm lint` | Run ESLint |
| `pnpm generate-sql` | Generate SQL dump from seed data |
| `pnpm verify-db` | Verify database import |

---

## 📁 Project Structure

```
prepflow/
├── src/
│   ├── app/
│   │   ├── (user)/           # User-facing routes
│   │   │   ├── ats-checker/  # AI resume analyzer
│   │   │   ├── compiler/     # Monaco code editor
│   │   │   ├── companies/    # Company-wise questions
│   │   │   ├── dsa-sheets/   # DSA problem sheets
│   │   │   └── jobs/         # Jobs & internships
│   │   ├── (admin)/          # Admin dashboard routes
│   │   ├── api/              # API routes (Better Auth)
│   │   └── page.tsx          # Landing page
│   ├── actions/              # Next.js Server Actions
│   │   ├── atsActions.ts     # AI resume analysis
│   │   ├── actions.ts        # Problem & progress actions
│   │   └── job-actions.tsx   # Jobs & internships actions
│   ├── components/           # Shared React components
│   ├── hooks/                # Custom React hooks
│   ├── lib/                  # Utilities & helpers
│   ├── store/                # Zustand state stores
│   └── auth.ts               # Better Auth configuration
├── prisma/
│   └── schema.prisma         # Database schema
└── public/                   # Static assets & logos
```

---

## 🌐 Deployment

PrepFlow is deployed on **Vercel** with automatic deployments on push to `main`.

- Full-text search via PostgreSQL (`fullTextSearchPostgres` preview feature)
- Prisma adapter for PostgreSQL using `@prisma/adapter-pg`
- Redis caching via Upstash for performance optimization

---

## 👥 Authors

| Name | LinkedIn |
|---|---|
| **Ashok Atragadda** | [linkedin.com/in/ashok-atragadda](https://www.linkedin.com/in/ashok-atragadda/) |
| **R.B.S.S Durga Prasad (Bharani)** | [linkedin.com/in/rayudu-bharani-satya-siva-durga-prasad](https://www.linkedin.com/in/rayudu-bharani-satya-siva-durga-prasad/) |

---

## 📄 License

This project is private. All rights reserved.

---

> *"We built the platform we wish we'd had when we started — and now we're sharing it with every aspiring developer who needs a better way to prepare."*