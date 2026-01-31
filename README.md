# Adaptive Courses

> **AI-powered courses that understand your situation, not just your skill level.**

Learn anything in 30 minutes. Perfect for factory tours, job interviews, career switches, and learning emergencies.

🚀 **Live:** [adaptive-courses.vercel.app](https://adaptive-courses.vercel.app)

---

## What We Built

### The Problem
Traditional courses ask: "What's your skill level?"

But that's the **wrong question**.

Learning for a job interview is different than learning out of curiosity.

### The Solution
Adaptive Courses asks:
- ✨ **What's the situation?** (factory visit, job interview, career switch, just curious)
- ⏰ **When do you need this?** (tomorrow, this week, no rush)  
- 🎯 **What's the goal?** (sound smart, ask good questions, actually understand it)

Then Claude generates a custom course in **30 seconds**.

No typing. Just button clicks. Magic.

---

## Features

### ✅ Working
- [x] **Landing page** with email capture
- [x] **Button-based onboarding** (3 questions, ~10 seconds)
- [x] **AI course generation** (Claude Sonnet 4.5)
- [x] **Course viewer** (modules, lessons, quizzes)
- [x] **Supabase integration** (courses saved to database)
- [x] **Mobile responsive**
- [x] **API health check** (test Anthropic key)

### 🚧 In Progress
- [ ] **Stripe payment integration** ($5 checkout)
- [ ] **Email delivery** (send course via email)
- [ ] **PDF export** (download course)
- [ ] **User authentication** (view past courses)

### 🔮 Future
- [ ] Spaced repetition quizzes
- [ ] Multi-language support
- [ ] Voice narration (TTS)
- [ ] Course templates (popular topics)
- [ ] Community sharing

---

## Tech Stack

**Frontend:** Next.js 14 (App Router) + Tailwind CSS  
**AI:** Claude Sonnet 4.5 (course generation)  
**Database:** Supabase (Postgres + Auth)  
**Payments:** Stripe (not yet integrated)  
**Hosting:** Vercel  
**Domain:** TBD

**Cost to run:** ~$50/month at 200 courses/month

---

## Quick Start

### 1. Clone & Install
```bash
git clone https://github.com/rahul-dcosta/adaptive-courses.git
cd adaptive-courses/app
npm install
```

### 2. Environment Variables
Create `app/.env.local`:
```bash
# Anthropic API
ANTHROPIC_API_KEY=sk-ant-api03-...

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...

# Stripe (coming soon)
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

### 3. Database Setup
Run migrations in Supabase SQL Editor (see `docs/SETUP.md`):
```sql
create table courses (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users,
  topic text not null,
  skill_level text not null,
  goal text not null,
  time_available text not null,
  content jsonb not null,
  paid boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
```

### 4. Run Locally
```bash
npm run dev
```

Visit http://localhost:3000

---

## Project Structure

```
adaptive-courses/
├── app/                    # Next.js application
│   ├── app/               # App router pages
│   │   ├── api/          # API routes
│   │   │   ├── generate-course/  # Main course generation
│   │   │   └── test-api/         # API health check
│   │   └── page.tsx      # Landing page
│   ├── components/        # React components
│   │   ├── LandingPage.tsx       # Hero + email capture
│   │   └── CourseBuilderNew.tsx  # Button-based flow
│   └── lib/              # Utils & clients
│       └── supabase.ts   # Supabase client
├── docs/                  # Product docs
│   ├── PRD.md            # Product requirements
│   └── SETUP.md          # Setup instructions
└── marketing/             # Launch materials
    ├── social/           # LinkedIn, Twitter posts
    ├── copy/             # Product Hunt copy
    └── launch-plan.md    # Go-to-market strategy
```

---

## Launch Plan

**Target:** February 3-5, 2026

**Strategy:**
1. Product Hunt launch (main channel)
2. LinkedIn organic posts (5 posts over 7 days)
3. Personal network (warm intros)
4. Reddit/IndieHackers (secondary)

**Pricing:**
- $5 per course (standard)
- $3 with code `HUNTER` (first 100 users)

**Goals (Week 1):**
- Top 5 on Product Hunt
- 50+ paid courses
- 200+ email sign-ups

See `marketing/launch-plan.md` for full details.

---

## Development Principles

### The Fingerprint Model
Onboarding **IS** the product. Each button click infers 10x more than it asks.

**Bad:** "What's your skill level?" (requires self-assessment)  
**Good:** "What's the situation?" (reveals context automatically)

### Ship Fast, Iterate Faster
- Commit after every completed task
- Deploy on every push (Vercel auto-deploy)
- No feature branches (main is production)
- Fix bugs in <24 hours

### Built With
- Claude Code (pair programming)
- Cursor (code editor)
- Vercel (hosting)
- Supabase (backend)
- Stripe (payments, coming soon)

---

## What's Next

### Immediate (This Week)
1. ✅ Fix course generation bugs
2. ✅ Add landing page
3. ✅ Write launch copy
4. 🚧 Integrate Stripe payments
5. 🚧 Add email delivery

### Short-term (Month 1)
- User authentication & dashboard
- PDF export with better formatting
- Sample course previews
- A/B test pricing ($3 vs $5 vs $7)

### Long-term (Month 2-3)
- Spaced repetition system
- Course templates library
- Referral/affiliate program
- Multi-language support

---

## Contributing

This is a solo project for now, but feedback is welcome!

**Found a bug?** Open an issue.  
**Have an idea?** Open a discussion.  
**Want to help?** Reach out: rdcosta@umich.edu

---

## License

Proprietary (for now). May open-source parts later.

---

## Credits

**Built by:** Rahul D'Costa (@rahul-dcosta)  
**AI Co-founder:** Claude (Anthropic)  
**Inspired by:** Learning emergencies everywhere

---

**Last Updated:** 2026-01-31  
**Status:** Pre-launch (90% MVP complete)  
**Launch Target:** Feb 3-5, 2026
