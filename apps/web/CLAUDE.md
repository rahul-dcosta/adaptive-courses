# CLAUDE.md - Adaptive Courses

**Updated:** 2026-02-07 (v4) | **Domain:** [adaptivecourses.ai](https://adaptivecourses.ai) | **Status:** Beta

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

## Session Continuity

When user says **"update claude.md"**, treat it as a session checkpoint (like a manual save in gaming). Update this file with:

- New features/components added
- Architectural decisions made
- Bugs fixed and their solutions
- Any patterns or gotchas discovered

This ensures the next chat session starts with full context of where we left off.

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
│   │   ├── api/              # API routes (generate-*, auth/*, buddies, notifications, etc.)
│   │   ├── dashboard/        # Dashboard page (real progress data)
│   │   ├── page.tsx          # Homepage
│   │   └── globals.css
│   ├── components/           # React components (see Component Inventory below)
│   ├── hooks/                # Custom React hooks
│   ├── lib/                  # Utilities (analytics, progress, daily-goals, feedback, etc.)
│   └── legal/                # UAE legal docs (privacy, terms, business setup)
├── packages/api-client/      # Shared types & Supabase client
├── docs/research/            # Business + research docs
│   ├── MOBILE-APP-ARCHITECTURE.md   # Mobile app scoping report
│   ├── UI-UX-RETENTION-RESEARCH.md  # 15 UI/UX retention recommendations
│   └── ...                          # pricing, roadmap, SEO, metrics
└── marketing/                # Reddit strategy, etc.
```

---

## Tech Stack

| Layer | Stack |
|-------|-------|
| Frontend | Next.js 16, React 19, Tailwind 4, Mermaid.js, canvas-confetti |
| Backend | Next.js API Routes, Anthropic Claude (claude-sonnet-4-5-20250929) |
| Database | Supabase (PostgreSQL) |
| Infra | Vercel, Porkbun (domain) |
| PWA | Service Worker, Web Push API, Web Audio API |
| Planned | Stripe payments, Resend email, web-push (server) |

---

## Key APIs

| Endpoint | Purpose |
|----------|---------|
| `POST /api/generate-outline` | Generate course outline preview |
| `POST /api/generate-course` | Generate full course content (with personalization + glossary) |
| `POST /api/generate-diagnostic` | Generate 5-question diagnostic MCQ quiz |
| `POST /api/generate-onboarding-questions` | Dynamic onboarding questions |
| `POST /api/auth/send-otp` | Send 6-digit OTP (5-min expiry) |
| `POST /api/auth/verify-otp` | Verify OTP code |
| `POST /api/email-capture` | Waitlist signup |
| `POST /api/track` | Analytics events |
| `GET/POST /api/buddies` | Learning buddy connections + invite links |
| `POST /api/notifications/subscribe` | Store push notification subscription |

**Rate Limiting:** All APIs use Upstash Redis rate limiting (see [lib/rate-limit.ts](lib/rate-limit.ts)). Limits vary by user type (anonymous/authenticated/paid) and endpoint.

**Access Gate:** Site requires access code "sixseven" to enter (see [AccessGate.tsx](components/AccessGate.tsx)). Access stored in localStorage.

**Branch Strategy:** `main` shows teaser landing (no navbar/access gate), `dev` shows full app.

---

## Retention Features (Implemented 2026-02-07)

All 15 UI/UX retention recommendations from research were implemented in a single session. See `docs/research/UI-UX-RETENTION-RESEARCH.md` for the full analysis.

### Phase 1: Quick Wins
| Rec | Feature | Key Files |
|-----|---------|-----------|
| 2 | "Continue Where You Left Off" resume banner | `LandingPagePremium.tsx`, `ResumeCard.tsx`, `lib/progress.ts` (`getMostRecentProgress()`) |
| 5 | Post-lesson "What's Next" guidance card | `CourseViewer.tsx` (3 CTAs: quiz, next lesson, review) |
| 6 | Progress rings on dashboard with real data | `dashboard/page.tsx`, `ProgressRing.tsx` |
| 7 | Milestone celebrations with confetti | `MilestoneCelebration.tsx`, `hooks/useMilestoneDetection.ts` |

### Phase 2: Core Retention
| Rec | Feature | Key Files |
|-----|---------|-----------|
| 1 | Daily goals + streak system | `lib/daily-goals.ts`, `DailyGoal.tsx` (CompactDailyGoal + DailyGoalCard) |
| 3 | Personalization callouts in content | `generate-course/route.ts` (prompt), `CourseViewer.tsx` (parser for `[PERSONALIZED: ...]`) |
| 8 | Glossary tooltips on hover/tap | `GlossaryTooltip.tsx`, `CourseViewer.tsx` (parser for `{{term:definition}}`) |

### Phase 3: Deep Engagement
| Rec | Feature | Key Files |
|-----|---------|-----------|
| 14 | Haptic + audio feedback | `lib/feedback.ts` (Web Audio API + navigator.vibrate) |
| 9 | Learning path (Duolingo-style journey) | `LearningPath.tsx` (3rd sidebar view mode: outline/path/graph) |
| 4 | Spaced repetition (SM-2 algorithm) | `lib/spaced-repetition.ts`, `ReviewQueue.tsx` (flashcard UI) |

### Phase 4: Platform Maturity
| Rec | Feature | Key Files |
|-----|---------|-----------|
| 10 | Pre-course diagnostic quiz | `DiagnosticQuiz.tsx`, `api/generate-diagnostic/route.ts`, `CourseBuilderSmart.tsx` |
| 11 | PWA + offline support | `public/sw.js`, `PWAProvider.tsx`, `OfflineBanner.tsx`, `InstallPrompt.tsx` |
| 12 | Learning buddies | `BuddyInvite.tsx`, `BuddyProgress.tsx`, `api/buddies/route.ts` |
| 13 | Card-based mobile lessons | `CardLessonView.tsx`, `hooks/useSwipeGesture.ts` |
| 15 | Push notifications | `lib/notification-scheduler.ts`, `NotificationSettings.tsx`, `api/notifications/subscribe/route.ts` |

---

## Component Inventory

### Core Flow
- `LandingPagePremium.tsx` — Full landing with resume banner for returning users
- `CourseBuilderSmart.tsx` — Onboarding → diagnostic (optional) → outline → generation → viewer
- `CourseViewer.tsx` — Course reading UI with sidebar (outline/path/graph), quiz, milestones, daily goal
- `LoadingSpinner.tsx` — Generation progress UI

### Retention / Engagement
- `MilestoneCelebration.tsx` — Modal overlay with confetti for progress/streak/lesson milestones
- `DailyGoal.tsx` — `CompactDailyGoal` (header widget) + `DailyGoalCard` (dashboard card)
- `ReviewQueue.tsx` — Flashcard review UI + `ReviewBadge` (due count indicator)
- `LearningPath.tsx` — Duolingo-style vertical node journey map
- `DiagnosticQuiz.tsx` — MCQ diagnostic before course generation (non-beginners only)
- `GlossaryTooltip.tsx` — Hover/tap tooltip for `{{term:definition}}` spans
- `CardLessonView.tsx` — Swipeable card-based mobile lesson view
- `ResumeCard.tsx` — `ResumeCard`, `ResumeBanner`, `ResumeListItem`, `NoResumeState`

### PWA / Platform
- `PWAProvider.tsx` — Registers service worker, renders offline banner + install prompt
- `OfflineBanner.tsx` — Orange top bar when offline
- `InstallPrompt.tsx` — PWA install prompt (captures beforeinstallprompt)
- `NotificationSettings.tsx` — Toggle switches per notification type
- `BuddyInvite.tsx` — Generate/share buddy invite links
- `BuddyProgress.tsx` — Display connected buddies' streaks

### Progress / Gamification
- `ProgressRing.tsx` — SVG circular progress indicator
- `ProgressBarEnhanced.tsx` — Animated progress bars
- `ProgressTable.tsx` — Module-by-module progress table
- `LearningStreak.tsx` — Streak badge + weekly calendar
- `KnowledgeGraph.tsx` — Interactive knowledge graph visualization

---

## Hooks

| Hook | Purpose |
|------|---------|
| `useProgressTracking` | Set/Map-based progress (legacy `course_*` keys) |
| `useProgress` | Rich CourseProgressData tracking (`ac_progress_*` keys) |
| `useMilestoneDetection` | Tracks shown milestones, checks thresholds (25/50/75/100% + streak + lessons) |
| `useGlossaryTooltips` | Attaches hover/click listeners to `[data-glossary]` spans |
| `useSwipeGesture` | Touch event swipe detection (left/right) |
| `useOffline` | Online/offline state tracking |

---

## Lib Utilities

| Module | Purpose |
|--------|---------|
| `lib/progress.ts` | CourseProgressData types, localStorage CRUD, streak, resume helpers |
| `lib/daily-goals.ts` | Daily goal config, presets, progress recording, storage |
| `lib/spaced-repetition.ts` | SM-2 algorithm, ReviewItem CRUD, due review queries |
| `lib/feedback.ts` | Haptic (navigator.vibrate) + audio (Web Audio API) feedback |
| `lib/notification-scheduler.ts` | Push subscription, notification prefs, quiet hours |
| `lib/analytics.ts` | Event tracking |
| `lib/theme-context.tsx` | Dark mode theme provider + system detection |

---

## Course Generation Behavior

**Learner Fingerprint:** Courses adapt based on learning style, prior knowledge, goal, course depth, content format, and challenge preference.

**Pre-Course Diagnostic:** Non-beginner users get a 5-question MCQ diagnostic (beginner→advanced) before outline generation. Results adjust the `priorKnowledge` field in the fingerprint.

**Personalization Callouts:** The prompt instructs Claude to include 1-2 `[PERSONALIZED: ...]` markers per lesson. These render as blue left-border accent cards with "Tailored for you:" prefix.

**Glossary Terms:** The prompt instructs Claude to include 2-4 `{{term:definition}}` inline markers per lesson. These render as dashed-underline blue spans with hover/tap tooltips.

**Goal-Aware Next Steps:** The "What You'll Do Next" section adapts to topic type:

- **Casual/fun topics** (memes, dance moves, pop culture): Light suggestions
- **Academic/professional topics**: Concrete exercises and practice drills
- **Goal-specific**: hobby/sound_smart gets casual tone, career/interview gets professional tone

**Course Depth Options:**

- `30_min` → Quick Overview: 2 modules, ~5 min read
- `1_hour` → Solid Foundation: 3 modules, ~15 min read
- `2_hours` → Thorough Coverage: 5 modules, ~25 min read
- `1_week` → Full Course: 8 modules, ~45 min read
- `no_rush` → Deep Mastery: 10 modules, ~1 hr read
- `masterclass` → Masterclass: 15 modules, ~2 hr read

**JSON Parsing:** Claude responses occasionally have malformed JSON. The API includes fallback repair:

1. Normalize curly quotes → straight quotes
2. Remove trailing commas
3. Attempt to escape unescaped quotes inside content strings
4. Escape actual newlines that should be `\n`

---

## localStorage Keys

| Key Pattern | Purpose |
|-------------|---------|
| `ac_progress_{courseId}` | Rich course progress (CourseProgressData) |
| `course_{courseId}` | Legacy progress (Set/Map-based, pre-migration) |
| `ac_streak_data` | Global streak data |
| `ac_daily_goal` | Daily goal config + today's progress + 30-day history |
| `ac_shown_milestones` | Array of milestone IDs already shown |
| `ac_reviews_{courseId}` | Spaced repetition review items |
| `ac_feedback_prefs` | Haptic/sound toggle preferences |
| `ac_notification_prefs` | Notification type toggles + quiet hours |
| `ac_access_code` | Access gate code |

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
# PWA Push (not yet configured):
# NEXT_PUBLIC_VAPID_PUBLIC_KEY=...
# VAPID_PRIVATE_KEY=...
# VAPID_SUBJECT=mailto:...
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

## Dark Mode

**Implementation:** CSS variables + React Context (`lib/theme-context.tsx`)

**Theme Toggle:** In navbar, uses `ThemeProvider` wrapping the app in `layout.tsx`

**CSS Variables (globals.css):**

```css
:root {
  --bg-primary: #f8fafc;
  --bg-card: #ffffff;
  --bg-glass-dark: rgba(0, 63, 135, 0.04);
  --text-primary: #1a1a2e;
  --text-secondary: #4a5568;
  --text-muted: #718096;
  --border-secondary: rgba(0, 63, 135, 0.1);
  --royal-blue: #003F87;
}

.dark {
  --bg-primary: #0f172a;
  --bg-card: #1e293b;
  --bg-glass-dark: rgba(255, 255, 255, 0.05);
  --text-primary: #f1f5f9;
  --text-secondary: #cbd5e1;
  --text-muted: #94a3b8;
  --border-secondary: rgba(255, 255, 255, 0.1);
}
```

**CRITICAL:** Always use CSS variables for colors, never hardcoded `text-gray-*` or `bg-white`:

```tsx
// CORRECT
className="text-[var(--text-primary)] bg-[var(--bg-card)]"

// WRONG - breaks dark mode
className="text-gray-900 bg-white"
```

**Ring Colors:** Use Tailwind classes, not inline styles:

```tsx
// CORRECT
className="ring-2 ring-[var(--royal-blue)]"

// WRONG - ringColor is not a valid CSS property
style={{ ringColor: 'var(--royal-blue)' }}
```

---

## Course Library (Dashboard)

**Route:** `/dashboard` → [app/dashboard/page.tsx](app/dashboard/page.tsx)

**Features:**

- Course cards with `ProgressRing` (real data from `getAllProgressFromStorage()`)
- Filter tabs: All, In Progress (count), Completed (count)
- Stats grid: Total Courses, Completed, Lessons Done, Time Spent
- Streak banner (when active)
- Daily Goal card with preset editor
- Spaced Repetition review section with expandable ReviewQueue
- Learning Buddies invite card
- Upgrade prompt (when 1 course)

---

## Progress Tracking

**Two parallel systems exist (migration needed):**

1. `hooks/useProgressTracking.ts` — Set/Map-based, `course_${id}` localStorage keys (used in CourseViewer)
2. `lib/progress.ts` + `hooks/useProgress.ts` — Rich `CourseProgressData`, `ac_progress_${id}` keys (used in dashboard, resume)

**TODO:** Add `migrateProgressData()` to unify into the richer system.

**Components:**

- `ProgressRing.tsx` - SVG circular progress indicator
- `ProgressBarEnhanced.tsx` - Animated progress bars
- `ProgressTable.tsx` - Module-by-module breakdown
- `LearningStreak.tsx` - Activity streak calendar

---

## Database (Supabase)

**Tables:** `users`, `courses`, `sessions`, `otp_codes`, `email_signups`

**Planned tables:** `buddy_connections`, `push_subscriptions`

Key fields:
- `users.plan`: free | per_course | pro
- `courses.content`: JSONB with full course
- `courses.fingerprint`: JSONB with learner preferences

---

## Code Standards

- TypeScript strict (no `any`, use `unknown`)
- Error handling with `getErrorMessage()` from `@/lib/types`
- Components in PascalCase, hooks with `use` prefix
- Tailwind only (no inline styles except CSS variable references)
- All new components MUST use CSS variables for dark mode compatibility

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
# Unit/Integration (Vitest) - 307 tests
npm test              # Watch mode
npm run test:run      # Single run
npm run test:coverage # With coverage report

# E2E (Playwright) - 42 tests
npm run test:e2e         # Headless
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
│   │   ├── courses.test.ts
│   │   ├── progress.test.ts
│   │   └── health.test.ts
│   ├── lib/             # Utility tests
│   │   ├── validation.test.ts
│   │   ├── helpers.test.ts
│   │   └── progress.test.ts
│   ├── components/      # Component tests
│   │   └── CourseLibrary.test.tsx
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

**Important:** Run tests from `apps/web/` directory (not repo root).

**Always run tests before pushing** - they catch regressions.

**E2E Test Gotchas (discovered 2026-02-06):**

- **Auth modal button timing:** The "Continue with email" button (`disabled={loading || !email}`) can have a race condition with Playwright's `fill()` and React's controlled input state update. Always use `await expect(button).toBeEnabled({ timeout: 5000 })` before clicking, not just `.click()` (which has its own wait but can be flaky under load).
- **Never use `test.skip()` inside `.catch()`** — it doesn't halt execution. The skip throws internally but gets swallowed by the catch, and subsequent lines still run. Use `if/return` pattern instead.
- **Keep E2E assertions in sync with UI text.** The social proof bar and onboarding questions have been updated but tests lagged behind. When changing user-facing text in components, grep the `e2e/` directory for matching assertions.

---

## What's Next / TODO

- **Progress migration:** Unify `course_*` and `ac_progress_*` localStorage systems
- **Supabase tables:** Create `buddy_connections` and `push_subscriptions`
- **VAPID keys:** Generate and configure for push notifications
- **CardLessonView integration:** Wire into CourseViewer for mobile viewport detection
- **web-push:** Install server-side package + create send endpoint
- **Tests:** Add Vitest tests for new lib modules (daily-goals, spaced-repetition, feedback)
- **Mobile app:** See `docs/research/MOBILE-APP-ARCHITECTURE.md` for React Native + Expo plan

---

## Links

- **Repo:** https://github.com/rahul-dcosta/adaptive-courses
- **Vercel:** https://vercel.com/rahuls-projects/adaptive-courses
- **Docs:** [docs/research/](../../docs/research/) (pricing, roadmap, SEO, mobile architecture, UI/UX research)
