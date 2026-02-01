# CLAUDE.md - Adaptive Courses Platform Master Reference

**Last Updated:** 2026-02-01 15:00 UTC
**Domain:** [adaptivecourses.ai](https://adaptivecourses.ai)
**Status:** Beta (Production Locked / Dev Active)
**Architecture:** Monorepo (npm workspaces)

> This document is the single source of truth for the entire product—business, design, technical, and operational aspects.

---

## 🚀 Quick Start

```bash
# Clone and install
git clone https://github.com/rahul-dcosta/adaptive-courses.git
cd adaptive-courses
npm install

# Development (on dev branch)
git checkout dev
npm run dev

# Build
npm run build
```

**Live URLs:**
- 🔒 **Production:** https://adaptivecourses.ai (maintenance mode)
- 🧪 **Development:** https://adaptive-courses.vercel.app (full features)

---

## 🆕 Latest Updates (2026-02-01)

### Monorepo Restructure + Domain Launch

**What's New:**

| Change | Details |
|--------|---------|
| 🏗️ **Monorepo** | npm workspaces: `apps/web`, `packages/api-client` |
| 🌐 **Domain** | Launched on `adaptivecourses.ai` |
| 🔒 **Maintenance Mode** | Production locked, waitlist modal active |
| 🌿 **Git Workflow** | `dev` branch → testing, `main` → production |
| 🇦🇪 **Business Entity** | UAE Free Zone LLC planned (Stripe-ready) |

**Branch Strategy:**
```
dev branch  →  adaptive-courses.vercel.app  (full features)
    ↓ merge
main branch →  adaptivecourses.ai           (locked/waitlist)
```

---

## 📋 Table of Contents

1. [Product Vision](#-product-vision)
2. [Business Model](#-business-model)
3. [Architecture](#-architecture)
4. [Monorepo Structure](#-monorepo-structure)
5. [User Journey](#-user-journey)
6. [Design System](#-design-system)
7. [Tech Stack](#-tech-stack)
8. [API Reference](#-api-reference)
9. [Database Schema](#-database-schema)
10. [Deployment & DevOps](#-deployment--devops)
11. [Security](#-security)
12. [Roadmap](#-roadmap)

---

## 🎯 Product Vision

### The One-Liner
**AI-powered courses built around *why* you're learning, not just what.**

### What We Are
A personalized learning platform that generates custom courses adapted to your specific context, goals, and timeline. Learn game theory for your job interview, not a generic textbook.

### What We're NOT
- ❌ A subscription course library (Skillshare, Coursera)
- ❌ A marketplace for pre-made courses (Udemy)
- ❌ A casual "learn fun facts" app
- ❌ A MOOC competitor

### Target Users
Professionals who need to learn complex topics for specific situations:

| User | Situation | Topic |
|------|-----------|-------|
| Product Manager | Strategy meeting prep | Game Theory |
| Factory Engineer | Plant visit | Supply Chain |
| Startup Founder | Fundraising | Term Sheet Basics |
| Career Switcher | Interview prep | Industry Fundamentals |

### Unique Value Proposition
> "Traditional courses ask: What's your skill level?
> We ask: What's the situation? What's your goal? When do you need it?"

---

## 💰 Business Model

### Pricing Philosophy
**"Netflix quality at coffee prices"**

We occupy the impulse-buy territory that doesn't exist in learning:
- 75% cheaper than Skillshare ($29/mo)
- 87% cheaper than Coursera ($59/mo)
- 5-50x cheaper than Udemy per-course ($20-200)

### Pricing Tiers

| Tier | Price | What You Get | Gross Margin |
|------|-------|--------------|--------------|
| **Free** | $0 | 1 course, 5 AI prompts lifetime | N/A |
| **Per-Course** | $3.99 | Course forever + 10 prompts/day | 65.7% |
| **Unlimited** | $7.99/mo | Unlimited courses, 50 prompts/day | 51.4% |
| **Pro** | $14.99/mo | Everything + 200 prompts + certificates | 53.4% |

### The "Keep It Forever" Differentiator
Every course you generate is **yours forever**, even if you cancel. This:
- ✅ Builds trust (no hostage-taking)
- ✅ Reduces churn anxiety
- ✅ Creates word-of-mouth
- ✅ Costs us nothing (value is in generation, not storage)

### Business Entity Plan
**UAE Free Zone LLC** (planned for payment activation)
- Meydan or SHAMS Free Zone (~$1,500-3,000)
- Stripe UAE integration
- 0% personal income tax
- Golden Visa holder = simplified setup

---

## 🏗️ Architecture

### High-Level Flow
```
Landing Page → Onboarding (Fingerprint) → Outline Preview → Course Generation → Course Viewer
```

### System Diagram
```
┌─────────────────────────────────────────────────────────────────┐
│                         FRONTEND                                 │
│  ┌─────────────┐  ┌──────────────┐  ┌─────────────────────────┐ │
│  │   Landing   │→ │  Onboarding  │→ │    Course Viewer        │ │
│  │    Page     │  │ (Fingerprint)│  │  (Lessons + Quizzes)    │ │
│  └─────────────┘  └──────────────┘  └─────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                        API LAYER                                 │
│  ┌────────────────┐  ┌────────────────┐  ┌──────────────────┐   │
│  │ /generate-     │  │ /generate-     │  │ /generate-       │   │
│  │  outline       │  │  course        │  │  onboarding-qs   │   │
│  └────────────────┘  └────────────────┘  └──────────────────┘   │
│  ┌────────────────┐  ┌────────────────┐  ┌──────────────────┐   │
│  │ /auth/*        │  │ /stripe-webhook│  │ /email-capture   │   │
│  └────────────────┘  └────────────────┘  └──────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                       SERVICES                                   │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐              │
│  │  Anthropic  │  │  Supabase   │  │   Stripe    │              │
│  │  Claude API │  │  (Postgres) │  │  Payments   │              │
│  └─────────────┘  └─────────────┘  └─────────────┘              │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📁 Monorepo Structure

```
adaptive-courses/
├── package.json              # Root workspace config
├── .gitignore               # Root gitignore
│
├── apps/
│   └── web/                 # Next.js web application
│       ├── app/
│       │   ├── api/         # API routes
│       │   │   ├── auth/    # Authentication endpoints
│       │   │   ├── generate-course/
│       │   │   ├── generate-outline/
│       │   │   └── ...
│       │   ├── page.tsx     # Homepage
│       │   ├── layout.tsx   # Root layout
│       │   └── globals.css  # Global styles
│       ├── components/      # React components
│       │   ├── LandingPagePremium.tsx
│       │   ├── CourseBuilderSmart.tsx
│       │   ├── CourseViewer.tsx
│       │   └── ...
│       ├── lib/             # Utilities & services
│       │   ├── services/    # Auth, email services
│       │   ├── types/       # TypeScript types
│       │   └── ...
│       ├── CLAUDE.md        # This file
│       ├── DESIGN.md        # Design system
│       └── package.json     # Web app dependencies
│
├── packages/
│   └── api-client/          # Shared types & Supabase client
│       ├── src/
│       │   ├── index.ts     # Exports
│       │   ├── types.ts     # Shared types
│       │   └── supabase.ts  # Supabase client factory
│       ├── package.json
│       └── tsconfig.json
│
└── docs/                    # Documentation
    ├── BUSINESS-MODEL.md
    └── marketing/
```

### Workspace Commands

```bash
# From root directory:
npm run dev          # Start web dev server
npm run build        # Build web app
npm run dev:web      # Explicit web dev
npm run lint         # Lint web app
```

---

## 🚶 User Journey

### 1. Landing Page
- Hero: "Learn Anything, Your Way"
- Topic input field
- Example courses grid
- **Maintenance Mode:** Shows waitlist modal instead of builder

### 2. Onboarding (Learner Fingerprint)
Collects 8 dimensions to personalize the course:

| Dimension | Options | Impact |
|-----------|---------|--------|
| Prior Knowledge | Beginner → Advanced | Depth & vocabulary |
| Learning Goal | Interview / Career / Curiosity | Framing & examples |
| Time Commitment | 30min → No rush | Length & density |
| Learning Style | Visual / Reading / Mixed | Diagrams vs text |
| Content Format | Examples-first / Theory-first | Structure |
| Challenge Pref | Easy→Hard / Adaptive | Difficulty curve |
| Context | Free text | Specific tailoring |

### 3. Outline Preview
- AI generates 2-module outline
- User can approve or request changes
- Natural language feedback loop

### 4. Course Generation
- 30-60 second generation
- Progress messages during wait
- Success celebration animation

### 5. Course Viewer
- Sidebar navigation
- Progress tracking (localStorage)
- Interactive quizzes
- Mermaid diagrams
- Keyboard shortcuts (← → M)

---

## 🎨 Design System

> Full details in `DESIGN.md`

### Brand Colors
```css
--royal-blue: #003F87      /* Primary */
--royal-blue-light: #0056B3 /* Hover */
--royal-blue-dark: #002D5F  /* Emphasis */
```

### Typography
- **Headings:** Merriweather (serif, academic)
- **Body:** Inter (clean, readable)
- **Code:** Monaco (monospace)

### Design Principles
1. **Academic Premium** - Serious, sophisticated, credible
2. **Subtle Borders** - 1px, 0.08-0.12 opacity
3. **Generous White Space** - Breathing room
4. **Royal Blue Accents** - Used sparingly
5. **Clean Typography** - Large, readable, hierarchical

---

## 🛠️ Tech Stack

### Frontend
| Technology | Version | Purpose |
|------------|---------|---------|
| Next.js | 16.1.6 | Framework (App Router) |
| React | 19.2.3 | UI Library |
| Tailwind CSS | 4.x | Styling |
| Mermaid.js | 11.12.2 | Diagrams |

### Backend
| Technology | Purpose |
|------------|---------|
| Next.js API Routes | Serverless endpoints |
| Anthropic Claude | AI course generation |
| Supabase | Database (PostgreSQL) |
| Resend | Transactional email |
| Stripe | Payments (planned) |

### Infrastructure
| Service | Purpose |
|---------|---------|
| Vercel | Hosting & deployment |
| Supabase Cloud | Database hosting |
| Porkbun | Domain registrar |
| GitHub | Source control |

---

## 🔌 API Reference

### Course Generation

#### `POST /api/generate-outline`
Generates course outline for preview.

```typescript
// Request
{
  topic: string;
  learningStyle: "visual" | "reading" | "mixed";
  priorKnowledge: "beginner" | "intermediate" | "advanced";
  learningGoal: string;
  timeCommitment: string;
  context?: string;
}

// Response
{
  outline: {
    title: string;
    modules: Array<{
      title: string;
      lessons: Array<{ title: string }>;
    }>;
    estimated_time: string;
  }
}
```

#### `POST /api/generate-course`
Generates full course content.

```typescript
// Response
{
  success: true;
  course: {
    title: string;
    modules: Array<{
      title: string;
      lessons: Array<{
        title: string;
        content: string;  // Markdown with Mermaid
        quiz: { question: string; answer: string; }
      }>;
    }>;
  };
  courseId: string;
}
```

### Authentication

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/auth/send-otp` | POST | Send 6-digit OTP email |
| `/api/auth/verify-otp` | POST | Verify OTP code |
| `/api/auth/send-magic-link` | POST | Send magic link |
| `/api/auth/verify` | GET | Verify magic link token |
| `/api/auth/logout` | POST | Clear session |

### Maintenance Mode
When `NEXT_PUBLIC_MAINTENANCE_MODE=true`:
- All generation APIs return `503 Service Unavailable`
- Landing page shows waitlist modal instead of builder
- URL params `?mode=build` redirect to home

---

## 💾 Database Schema

### Core Tables

```sql
-- Users
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  plan TEXT DEFAULT 'free',  -- free | per_course | pro
  created_at TIMESTAMP DEFAULT NOW()
);

-- Courses
CREATE TABLE courses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  topic TEXT NOT NULL,
  content JSONB NOT NULL,
  fingerprint JSONB,
  status TEXT DEFAULT 'complete',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Sessions
CREATE TABLE sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  token TEXT UNIQUE NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- OTP Codes
CREATE TABLE otp_codes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT NOT NULL,
  code TEXT NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  used BOOLEAN DEFAULT FALSE
);
```

---

## 🚢 Deployment & DevOps

### Environment Variables

```env
# AI
ANTHROPIC_API_KEY=sk-ant-...

# Database
NEXT_PUBLIC_SUPABASE_URL=https://...supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# Payments (future)
STRIPE_SECRET_KEY=sk_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Email
RESEND_API_KEY=re_...

# Feature Flags
NEXT_PUBLIC_MAINTENANCE_MODE=true  # Production only
```

### Vercel Configuration

| Setting | Value |
|---------|-------|
| Root Directory | `apps/web` |
| Build Command | `npm run build` |
| Output Directory | `.next` |
| Node Version | 20.x |

### Git Workflow

```bash
# Development flow
git checkout dev
# ... make changes ...
git add -A && git commit -m "feat: description"
git push origin dev
# → Deploys to adaptive-courses.vercel.app

# Production release
git checkout main
git merge dev
git push origin main
# → Deploys to adaptivecourses.ai
```

### Deployment Checklist
- [ ] Build passes locally (`npm run build`)
- [ ] Test on dev deployment
- [ ] Merge to main
- [ ] Verify production deployment
- [ ] Check error logs in Vercel

---

## 🔒 Security

### Production Lockdown (Current State)
- ✅ `NEXT_PUBLIC_MAINTENANCE_MODE=true` on production
- ✅ Landing page visible (marketing/SEO)
- ✅ Course creation blocked → waitlist modal
- ✅ API routes return 503
- ✅ Dev environment has full access

### Authentication Security
- 6-digit OTP codes (5-minute expiry)
- Magic links (1-hour expiry, single-use)
- Session tokens (7-day expiry)
- Device fingerprinting for abuse prevention

### API Security
- Rate limiting on generation endpoints
- Input validation and sanitization
- No secrets in client-side code
- CORS configured for domain

---

## 🗺️ Roadmap

### Phase 1: MVP Launch (Current)
- [x] Monorepo restructure
- [x] Domain setup (adaptivecourses.ai)
- [x] Maintenance mode + waitlist
- [x] Dev/prod branch workflow
- [ ] Finish core features on dev
- [ ] Stripe integration
- [ ] UAE company formation
- [ ] Launch to waitlist

### Phase 2: Growth
- [ ] PDF export
- [ ] Email course delivery
- [ ] Course library (past courses)
- [ ] Referral system
- [ ] Product Hunt launch

### Phase 3: Scale
- [ ] Mobile app (React Native)
- [ ] Team accounts
- [ ] API for integrations
- [ ] Course marketplace

### Phase 4: Expand
- [ ] AI tutor chat
- [ ] Certificates
- [ ] Enterprise features
- [ ] Internationalization

---

## 📞 Quick Reference

### Key Files
| File | Purpose |
|------|---------|
| `apps/web/components/LandingPagePremium.tsx` | Main landing page |
| `apps/web/components/CourseBuilderSmart.tsx` | Course generation flow |
| `apps/web/components/CourseViewer.tsx` | Course reading UI |
| `apps/web/app/api/generate-course/route.ts` | AI generation endpoint |
| `apps/web/lib/constants.ts` | App-wide constants |

### Useful Commands
```bash
npm run dev              # Start dev server
npm run build            # Production build
git checkout dev         # Switch to dev branch
git merge main           # Sync with main
```

### Links
- **Production:** https://adaptivecourses.ai
- **Staging:** https://adaptive-courses.vercel.app
- **GitHub:** https://github.com/rahul-dcosta/adaptive-courses
- **Vercel:** https://vercel.com/rahuls-projects/adaptive-courses

---

## 🤝 Contributing

### Commit Format
```
emoji type: description

Types:
🎨 UI      - Visual changes
✨ feat    - New feature
🐛 fix     - Bug fix
📝 docs    - Documentation
♻️ refactor - Code restructure
⚡ perf    - Performance
🔒 security - Security fix
🏗️ build   - Build/deploy changes
```

### Code Standards
- TypeScript strict mode
- Components in PascalCase
- Hooks prefix with `use`
- No `any` types (use `unknown`)
- Tailwind for styling (no inline styles)

---

**End of CLAUDE.md**

*Maintained by Claude Code. Update this file when making significant product changes.*

*Co-Authored-By: Claude Opus 4.5*
