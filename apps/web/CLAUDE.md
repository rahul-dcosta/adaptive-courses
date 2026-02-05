# CLAUDE.md - Adaptive Courses

**Updated:** 2026-02-04 | **Domain:** [adaptivecourses.ai](https://adaptivecourses.ai) | **Status:** Beta

---

## Quick Start

```bash
git clone https://github.com/rahul-dcosta/adaptive-courses.git
cd adaptive-courses && npm install
git checkout dev && npm run dev
```

| Environment | URL | Branch |
|-------------|-----|--------|
| Production | https://adaptivecourses.ai | `main` (maintenance mode) |
| Development | https://adaptive-courses.vercel.app | `dev` (full features) |

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
│   │   ├── AccessGate.tsx            # Beta access code gate
│   │   ├── LandingPagePremium.tsx    # Main landing page
│   │   ├── CourseBuilderSmart.tsx    # Course generation flow
│   │   ├── CourseViewer.tsx          # Course reading UI
│   │   └── ErrorBoundary.tsx
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

**Maintenance Mode:** When `NEXT_PUBLIC_MAINTENANCE_MODE=true`, generation APIs return 503 and landing shows waitlist modal.

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
NEXT_PUBLIC_MAINTENANCE_MODE=true  # Production only
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

## Links

- **Repo:** https://github.com/rahul-dcosta/adaptive-courses
- **Vercel:** https://vercel.com/rahuls-projects/adaptive-courses
- **Docs:** [docs/research/](../../docs/research/) (pricing, roadmap, SEO)
