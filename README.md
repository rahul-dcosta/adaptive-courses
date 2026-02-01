# Adaptive Courses

> **AI-powered courses that understand your situation, not just your skill level.**

Learn anything in 30 minutes. Perfect for factory tours, job interviews, career switches, and learning emergencies.

**Live:** [adaptivecourses.ai](https://adaptivecourses.ai)

---

## What We Built

### The Problem
Traditional courses ask: "What's your skill level?"

But that's the **wrong question**.

Learning for a job interview is different than learning out of curiosity.

### The Solution
Adaptive Courses asks:
- **What's the situation?** (factory visit, job interview, career switch, just curious)
- **When do you need this?** (tomorrow, this week, no rush)
- **What's the goal?** (sound smart, ask good questions, actually understand it)

Then Claude generates a custom course in **30 seconds**.

---

## Pricing

| Tier | Price | What You Get |
|------|-------|--------------|
| **Free** | $0 | 1 course, 5 AI prompts lifetime |
| **Per-Course** | $3.99 | Course forever + 10 prompts/day |
| **Unlimited** | $7.99/mo | Unlimited courses, 50 prompts/day |
| **Pro** | $14.99/mo | Everything + 200 prompts + certificates |

**Keep it forever:** Every course you create is yours forever, even if you cancel.

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| **Framework** | Next.js 16 (App Router) |
| **Frontend** | React 19, Tailwind CSS 4 |
| **AI** | Claude Sonnet 4.5 |
| **Database** | Supabase (PostgreSQL) |
| **Payments** | Stripe (planned) |
| **Hosting** | Vercel |
| **Domain** | adaptivecourses.ai |

---

## Project Structure

```
adaptive-courses/
├── apps/
│   └── web/                 # Next.js web application
│       ├── app/             # App router pages & API routes
│       ├── components/      # React components
│       ├── lib/             # Utilities & services
│       └── CLAUDE.md        # Master reference doc
├── packages/
│   └── api-client/          # Shared types & Supabase client
├── .claude/
│   └── skills/              # Claude Code custom skills
├── docs/                    # Documentation
├── marketing/               # Launch materials
└── business/                # Business docs
```

---

## Quick Start

```bash
# Clone and install
git clone https://github.com/rahul-dcosta/adaptive-courses.git
cd adaptive-courses
npm install

# Development
git checkout dev
npm run dev

# Build
npm run build
```

### Environment Variables

Create `apps/web/.env.local`:
```bash
ANTHROPIC_API_KEY=sk-ant-...
NEXT_PUBLIC_SUPABASE_URL=https://...supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
RESEND_API_KEY=re_...
```

---

## Deployment

| Branch | Environment | URL |
|--------|-------------|-----|
| `dev` | Preview | adaptive-courses.vercel.app |
| `main` | Production | adaptivecourses.ai |

```bash
# Deploy to dev
git checkout dev
git push origin dev

# Deploy to production
git checkout main
git merge dev
git push origin main
```

---

## Status

**Current:** Beta (Production locked with waitlist, Dev active)

### Phase 1: MVP Launch (Current)
- [x] Monorepo restructure
- [x] Domain setup (adaptivecourses.ai)
- [x] Maintenance mode + waitlist
- [x] Dev/prod branch workflow
- [ ] Stripe integration
- [ ] UAE company formation
- [ ] Launch to waitlist

### Phase 2: Growth
- [ ] PDF export
- [ ] Email course delivery
- [ ] Course library
- [ ] Referral system

---

## Links

- **Production:** https://adaptivecourses.ai
- **Development:** https://adaptive-courses.vercel.app
- **GitHub:** https://github.com/rahul-dcosta/adaptive-courses

---

## Credits

**Built by:** Rahul D'Costa
**AI Partner:** Claude (Anthropic)

---

**Last Updated:** 2026-02-01
