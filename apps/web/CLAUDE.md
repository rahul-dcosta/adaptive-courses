# CLAUDE.md - Adaptive Courses

**Updated:** 2026-02-05 | **Domain:** [adaptivecourses.ai](https://adaptivecourses.ai) | **Status:** Beta

---

## Quick Start

```bash
git clone https://github.com/rahul-dcosta/adaptive-courses.git
cd adaptive-courses && npm install
git checkout dev && npm run dev
```

| Environment | URL                                     | Branch                  |
|-------------|-----------------------------------------|-------------------------|
| Production  | <https://adaptivecourses.ai>            | `main` (teaser landing) |
| Development | <https://adaptive-courses.vercel.app>   | `dev` (full app)        |

---

## Working with Existing Files

When user references an existing file by name, ALWAYS check if that file exists and read it before providing guidance or starting new work.

---

## General Guidelines

Before suggesting commands or features, verify they actually exist. If unsure, say so rather than attempting to use non-existent functionality.

---

## Task Planning

For document creation and data analysis tasks, confirm the full scope and expected output format before beginning work to ensure completion within the session.

---

## What This Is

**AI-powered courses built around *why* you're learning, not just what.**

Generates personalized courses adapted to your context, goals, and timeline. Target users: professionals needing to learn complex topics for specific situations (interviews, meetings, career switches).

**Not:** a course library, marketplace, MOOC, or casual learning app.

---

## Monorepo Structure

```
adaptive-courses/
├── apps/web/                 # Next.js application
│   ├── app/
│   │   ├── api/              # API routes (generate-*, auth/*, email-capture, track)
│   │   ├── page.tsx          # Homepage
│   │   └── globals.css
│   ├── components/           # React components
│   │   ├── AccessGate.tsx            # Beta access code gate (dev only)
│   │   ├── LandingPageTeaser.tsx     # Teaser landing (main branch)
│   │   ├── LandingPagePremium.tsx    # Full landing page (dev branch)
│   │   ├── CourseBuilderSmart.tsx    # Course generation flow
│   │   ├── CourseViewer.tsx          # Course reading UI
│   │   └── LoadingSpinner.tsx        # Generation progress UI
│   ├── lib/                  # Utilities (analytics, logger, rate-limit, supabase, types)
│   └── legal/                # UAE legal docs (privacy, terms, business setup)
├── packages/api-client/      # Shared types & Supabase client
├── docs/research/            # Business docs (pricing, roadmap, SEO, metrics)
└── marketing/                # Reddit strategy, etc.
```

---

## Tech Stack

| Layer | Stack |
|-------|-------|
| Frontend | Next.js 16, React 19, Tailwind 4, Mermaid.js |
| Backend | Next.js API Routes, Anthropic Claude (claude-sonnet-4-5-20250929) |
| Database | Supabase (PostgreSQL) |
| Infra | Vercel, Porkbun (domain) |
| Planned | Stripe payments, Resend email |

---

## Key APIs

| Endpoint | Purpose |
|----------|---------|
| `POST /api/generate-outline` | Generate course outline preview |
| `POST /api/generate-course` | Generate full course content |
| `POST /api/generate-onboarding-questions` | Dynamic onboarding questions |
| `POST /api/auth/send-otp` | Send 6-digit OTP (5-min expiry) |
| `POST /api/auth/verify-otp` | Verify OTP code |
| `POST /api/email-capture` | Waitlist signup |
| `POST /api/track` | Analytics events |

**Rate Limiting:** All APIs use Upstash Redis rate limiting (see [lib/rate-limit.ts](lib/rate-limit.ts)). Limits vary by user type (anonymous/authenticated/paid) and endpoint.

**Access Gate:** Site requires access code "sixseven" to enter (see [AccessGate.tsx](components/AccessGate.tsx)). Access stored in localStorage.

**Branch Strategy:** `main` shows teaser landing (no navbar/access gate), `dev` shows full app.

---

## Course Generation Behavior

**Learner Fingerprint:** Courses adapt based on learning style, prior knowledge, goal, time commitment, content format, and challenge preference.

**Goal-Aware Next Steps:** The "What You'll Do Next" section adapts to topic type:

- **Casual/fun topics** (memes, dance moves, pop culture): Light suggestions like "Try it at your next party"
- **Academic/professional topics**: Concrete exercises and practice drills
- **Goal-specific**: hobby/sound_smart gets casual tone, career/interview gets professional tone

**Course Depth Options:** Users select course depth (not just time), which maps to structure:

- `30_min` → Quick Overview: 2 modules, ~5 min read, key points only
- `1_hour` → Solid Foundation: 3 modules, ~10 min read, core concepts
- `2_hours` → Thorough Coverage: 4 modules, ~20 min read, real depth
- `1_week` → Comprehensive Guide: 5 modules, ~30 min read, full curriculum
- `no_rush` → Deep Mastery: 6 modules, ~45 min read, expert-level

See `generate-course/route.ts` for word count mappings per lesson.

---

## Environment Variables

```env
ANTHROPIC_API_KEY=sk-ant-...
NEXT_PUBLIC_SUPABASE_URL=https://...supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
UPSTASH_REDIS_REST_URL=https://...upstash.io
UPSTASH_REDIS_REST_TOKEN=AX...
RESEND_API_KEY=re_...
# Future: STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET
```

---

## Git Workflow

```bash
# Development
git checkout dev
# make changes
git push origin dev  # → deploys to adaptive-courses.vercel.app

# Production release
git checkout main && git merge dev && git push origin main
# → deploys to adaptivecourses.ai
```

**Vercel Config:** Root Directory = `apps/web`, Node 20.x

---

## Design System

- **Colors:** Royal Blue `#003F87` (primary), `#0056B3` (hover), `#002D5F` (dark)
- **Fonts:** Merriweather (headings), Inter (body), Monaco (code)
- **Principles:** Academic premium, subtle borders (1px, 0.08-0.12 opacity), generous whitespace

Full details in [DESIGN.md](./DESIGN.md)

---

## Database (Supabase)

**Tables:** `users`, `courses`, `sessions`, `otp_codes`, `email_signups`

Key fields:
- `users.plan`: free | per_course | pro
- `courses.content`: JSONB with full course
- `courses.fingerprint`: JSONB with learner preferences

---

## Code Standards

- TypeScript strict (no `any`, use `unknown`)
- Error handling with `getErrorMessage()` from `@/lib/types`
- Components in PascalCase, hooks with `use` prefix
- Tailwind only (no inline styles)

**Commit format:** `emoji type: description`
```
🎨 UI  ✨ feat  🐛 fix  📝 docs  ♻️ refactor  ⚡ perf  🔒 security  🏗️ build
```

---

## Commands

```bash
npm run dev       # Start dev server
npm run build     # Production build
npm run lint      # Lint
```

---

## Testing

**Requires Node 22+** (use `nvm use` - .nvmrc configured)

```bash
# Unit/Integration (Vitest) - 141 tests
npm test              # Watch mode
npm run test:run      # Single run (~700ms)
npm run test:coverage # With coverage report

# E2E (Playwright) - 42 tests
npm run test:e2e         # Headless (~26s)
npm run test:e2e:ui      # Interactive UI
npm run test:e2e:headed  # Visible browser
```

**Test Structure:**
```
apps/web/
├── __tests__/           # Vitest unit/integration
│   ├── api/             # API route tests
│   │   ├── auth.test.ts
│   │   ├── generate-course.test.ts
│   │   └── health.test.ts
│   ├── lib/             # Utility tests
│   │   ├── validation.test.ts
│   │   └── helpers.test.ts
│   └── setup.ts         # Test setup (mocks env vars)
├── e2e/                 # Playwright E2E
│   ├── access-gate.spec.ts
│   ├── auth.spec.ts
│   ├── navigation.spec.ts
│   ├── onboarding.spec.ts
│   └── fixtures.ts      # Test fixtures (bypasses access gate)
├── vitest.config.ts
└── playwright.config.ts
```

**Always run tests before pushing** - they catch regressions.

---

## Links

- **Repo:** https://github.com/rahul-dcosta/adaptive-courses
- **Vercel:** https://vercel.com/rahuls-projects/adaptive-courses
- **Docs:** [docs/research/](../../docs/research/) (pricing, roadmap, SEO)
