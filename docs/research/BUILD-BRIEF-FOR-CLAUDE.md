# Build Brief for Claude Code - Adaptive Courses

## Product Overview

**One product, multiple access methods:**
- Web app (desktop/laptop browsers)
- Mobile web (responsive, works on phone browsers)
- PWA (installable mobile web app) - Day 1
- iOS native app (App Store) - Optional, Week 2-4
- Android native app (Play Store) - Optional, Week 2-4

**Same features, same backend, same pricing across all platforms.**

## Repo Strategy

**NEW REPO** (separate from this workspace)

**Structure:**
```
/root/clawd/              ← Current workspace (planning, docs, research)
/root/adaptive-courses/   ← New repo (Next.js app, production code)
```

---

## Brief to Give Claude Code

### Session 1: Initial Setup (Copy-Paste This)

```
I'm building Adaptive Courses - generates personalized crash courses on any topic in 60 seconds using Claude API.

PRODUCT:
- One product: Adaptive Courses
- Access via: Web (desktop/mobile) + PWA (installable) from Day 1
- Later: Native iOS/Android apps (same product, different distribution)

CORE FLOW:
- User enters topic (e.g., "React hooks for job interview" or "types of water bottles")
- AI generates 30-60 min crash course (5-8 modules) in <60 seconds
- Free preview (1 module shown)
- Pay $7 to unlock full course
- Get: Full course + flashcards + PDF download + certificate

TECH STACK:
- Next.js 14 (App Router) + TypeScript + Tailwind CSS
- Anthropic Claude API (course generation)
- Stripe (payments)
- PostgreSQL + Prisma (courses, purchases)
- Vercel (hosting)
- PWA (next-pwa for installable mobile app)

MVP FEATURES (Ship Week 1):
1. Landing page with topic input
2. Course generation (<60 sec)
3. Free preview (1 module)
4. Stripe checkout ($7)
5. Full course unlock
6. Flashcards (AI-generated)
7. Downloadable PDF
8. Certificate (PDF with name, topic, date)
9. Mobile-responsive + PWA manifest (installable)

NOT IN MVP:
- User accounts (guest checkout only)
- Saved library
- Pro subscription
- Audio courses
- Quizzes

CONSTRAINTS:
- Ship in 1 week
- Mobile-first design
- PWA-ready from Day 1
- Generation <60 seconds

START:
1. Create Next.js project
2. Landing page + topic input
3. Course generation API (Claude)
4. Show me the file structure

Let's ship. 🚀
```

---

## Phased Build Approach

### Phase 1: Core Generation (Day 1-2)
**Goal:** Prove the AI works

**What to build:**
- Landing page with topic input
- API route that calls Claude to generate course
- Display generated course modules
- Basic styling (Tailwind)

**Success:** Type "water bottles" → get 5-8 modules in <60 sec

---

### Phase 2: Payment Flow (Day 3-4)
**Goal:** Make money

**What to build:**
- Stripe integration
- Free preview (show 1 module, lock others)
- Checkout flow ($7 payment)
- Success page (unlock full course)
- Store purchases in database

**Success:** Complete payment → unlock course

---

### Phase 3: Extras (Day 5-6)
**Goal:** Polish the MVP

**What to build:**
- Flashcards generation
- PDF download (react-pdf or similar)
- Simple certificate (PDF with topic, date)
- Landing page polish (testimonials, social proof)
- Error handling (failed generation, payment errors)

**Success:** Full user flow works end-to-end

---

### Phase 4: Launch Prep (Day 7)
**Goal:** Ship it

**What to build:**
- Deploy to Vercel
- Set up Stripe production mode
- Add analytics (Vercel Analytics)
- Test on mobile
- Product Hunt assets (screenshots, demo GIF)

**Success:** Live URL, ready to share

---

## File Structure to Request

Ask Claude Code to create this structure:

```
adaptive-courses/  ← The web app (works on all platforms)
├── app/
│   ├── page.tsx                 # Landing page
│   ├── generate/
│   │   └── page.tsx             # Course generation UI
│   ├── course/
│   │   └── [id]/
│   │       └── page.tsx         # Course view (locked/unlocked)
│   ├── api/
│   │   ├── generate/
│   │   │   └── route.ts         # Claude API integration
│   │   ├── checkout/
│   │   │   └── route.ts         # Stripe checkout
│   │   └── webhook/
│   │       └── route.ts         # Stripe webhook (payment confirmation)
├── components/
│   ├── TopicInput.tsx           # Topic entry form
│   ├── CourseModule.tsx         # Single module display
│   ├── Flashcard.tsx            # Flashcard component
│   ├── PaywallModal.tsx         # "Unlock for $7" modal
│   └── Certificate.tsx          # Certificate generation
├── lib/
│   ├── anthropic.ts             # Claude API client
│   ├── stripe.ts                # Stripe client
│   └── db.ts                    # Prisma client
├── prisma/
│   └── schema.prisma            # Database schema
├── public/
│   └── assets/                  # Images, icons
└── package.json
```

---

## Key Implementation Details

### 1. Course Generation Prompt (for Claude API)

```typescript
// Example prompt structure
const prompt = `Generate a crash course on "${topic}" that can be completed in 30-60 minutes.

Context: ${userContext} // e.g., "for a job interview tomorrow"

Requirements:
- 5-8 modules, each 5-10 minutes of reading
- Concise, actionable content (no fluff)
- Include key concepts, examples, takeaways
- Appropriate for: ${urgencyLevel} // "urgent professional" or "casual curiosity"

Format as JSON:
{
  "title": "Course title",
  "description": "1-2 sentence overview",
  "modules": [
    {
      "title": "Module 1 Title",
      "content": "Markdown-formatted content...",
      "keyTakeaways": ["takeaway 1", "takeaway 2"],
      "timeEstimate": "8 minutes"
    },
    // ... more modules
  ],
  "flashcards": [
    { "question": "...", "answer": "..." },
    // ... 10-15 flashcards
  ]
}`;
```

---

### 2. Database Schema (Prisma)

```prisma
// prisma/schema.prisma

model Course {
  id          String   @id @default(cuid())
  topic       String
  title       String
  description String
  modules     Json     // Store as JSON
  flashcards  Json     // Store as JSON
  createdAt   DateTime @default(now())
  purchases   Purchase[]
}

model Purchase {
  id              String   @id @default(cuid())
  courseId        String
  course          Course   @relation(fields: [courseId], references: [id])
  email           String   // For guest checkout
  stripePaymentId String   @unique
  createdAt       DateTime @default(now())
}
```

---

### 3. Stripe Integration Pattern

```typescript
// app/api/checkout/route.ts

export async function POST(req: Request) {
  const { courseId, email } = await req.json();
  
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [{
      price_data: {
        currency: 'usd',
        product_data: { name: `Crash Course: ${courseTopic}` },
        unit_amount: 700, // $7.00
      },
      quantity: 1,
    }],
    mode: 'payment',
    success_url: `${process.env.NEXT_PUBLIC_URL}/course/${courseId}?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_URL}/course/${courseId}`,
    customer_email: email,
  });
  
  return Response.json({ url: session.url });
}
```

---

### 4. PWA Setup (for mobile)

Add to `next.config.js`:
```javascript
const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
});

module.exports = withPWA({
  // your config
});
```

Add `public/manifest.json`:
```json
{
  "name": "Adaptive Courses",
  "short_name": "CoursePrep",
  "description": "Learn anything in 1 hour",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#000000",
  "icons": [
    {
      "src": "/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

---

## Environment Variables to Set

Create `.env.local`:
```bash
# Anthropic (Claude API)
ANTHROPIC_API_KEY=sk-ant-...

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Database
DATABASE_URL=postgresql://...

# App
NEXT_PUBLIC_URL=http://localhost:3000
```

---

## Iteration Strategy with Claude Code

### Session 1: "Build the skeleton"
- Set up project structure
- Landing page + basic styling
- Topic input form

### Session 2: "Make the AI work"
- Integrate Claude API
- Generate course on button click
- Display modules

### Session 3: "Add payment"
- Stripe checkout
- Lock/unlock logic
- Database storage

### Session 4: "Polish the MVP"
- Flashcards
- PDF download
- Certificate
- Error handling

### Session 5: "Deploy"
- Vercel deployment
- Production Stripe setup
- Final testing

**Key:** Break it into small, testable chunks. Ship incrementally.

---

## What to Tell Claude Code After Each Session

**Good:**
"This works! Now add [next feature]."
"The course generation is too slow. Can we stream the response?"
"Stripe checkout works, but the success page is broken. Fix it."

**Better:**
"Session 2 complete. The AI generates courses in 45 seconds. Next: Add Stripe payment so I can unlock courses after paying $7."

**Best:**
"✅ Working: Course generation, module display
❌ Not working: Stripe webhook (payment not confirming)
Next: Debug webhook, then add flashcards."

---

## Common Issues to Watch For

### 1. Claude API Rate Limits
- Anthropic has rate limits (especially on free tier)
- Solution: Add retry logic, show "Generating..." state

### 2. Stripe Webhook Locally
- Webhooks need public URL (localhost won't work)
- Solution: Use Stripe CLI (`stripe listen --forward-to localhost:3000/api/webhook`)

### 3. PDF Generation Performance
- Generating PDF on server can be slow
- Solution: Generate client-side (react-pdf) or use service (PDFShift)

### 4. Large JSON in Database
- Storing course modules as JSON can get big
- Solution: Fine for MVP, optimize later if needed

---

## When to Ask Claude Code to Pause

**Pause and review if:**
- File structure looks overly complex (too many abstractions)
- Dependencies are piling up (keep it simple)
- You don't understand what was built (ask for explanation)
- Something breaks and you need to debug manually

**Claude Code is great at:**
- Scaffolding projects
- Implementing APIs
- Styling with Tailwind
- Integrating third-party services

**Claude Code needs help with:**
- Complex business logic (you decide)
- API key management (you provide)
- Design decisions (you choose)

---

## Final Checklist Before Launch

- [ ] Landing page loads on mobile
- [ ] Course generation works (<60 sec)
- [ ] Stripe payment completes
- [ ] Full course unlocks after payment
- [ ] PDF download works
- [ ] Certificate generates
- [ ] Error handling (API fails, payment fails)
- [ ] Deployed to Vercel (production URL)
- [ ] Stripe in production mode
- [ ] Analytics tracking (Vercel Analytics)
- [ ] Tested on iPhone + Android (PWA)

---

## Bottom Line

**Repo:** New repo (`/root/adaptive-courses/`)
**Brief:** Copy the "Session 1" prompt above to Claude Code
**Approach:** Build in 5 sessions (skeleton → AI → payment → polish → deploy)
**Timeline:** 7 days to MVP

**Start with:** "Hey Claude Code, create a new Next.js project for Adaptive Courses..." and paste the brief.

Let's ship this. 🚀
