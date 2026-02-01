# CLAUDE.md - Adaptive Courses Platform Master Reference

**Last Updated:** 2026-02-01  
**Product:** Adaptive personalized course generation platform  
**Status:** MVP / Early Access

This document is the single source of truth for understanding the entire product - business, design, technical, and operational aspects.

---

## 📋 Table of Contents

1. [Product Vision & Positioning](#product-vision--positioning)
2. [Business Model](#business-model)
3. [User Journey](#user-journey)
4. [Technical Architecture](#technical-architecture)
5. [Design System](#design-system)
6. [Key Features](#key-features)
7. [Tech Stack](#tech-stack)
8. [File Structure](#file-structure)
9. [API Endpoints](#api-endpoints)
10. [Database Schema](#database-schema)
11. [Deployment](#deployment)
12. [Analytics & Tracking](#analytics--tracking)
13. [Known Issues](#known-issues)
14. [Future Roadmap](#future-roadmap)

---

## 🎯 Product Vision & Positioning

### What We Are
**Academic Premium Personalized Learning Platform**

We generate custom courses on complex academic topics (game theory, behavioral economics, supply chain optimization) adapted to the user's specific context, goals, and timeline.

### What We Are NOT
- Not a casual "learn anything" platform
- Not a subscription learning service
- Not a generic online course marketplace
- Not a MOOC competitor

### Target User
**Professionals who need to learn complex topics for specific situations:**
- Factory engineer visiting a new plant → needs supply chain basics
- Product manager preparing for strategy meeting → needs game theory
- Startup founder facing legal questions → needs constitutional law fundamentals
- Data scientist switching industries → needs Bayesian stats refresher

### Unique Value Proposition
**"Complex topics, adapted to your context"**

Traditional courses ask: "What's your skill level?"  
We ask: "What's the situation? What's your goal? When do you need it?"

Then we build a course that teaches game theory *for workplace negotiations* or behavioral economics *for product design* - not generic textbook knowledge.

### Positioning Statement
Serious academic subjects, personalized for professionals. Learn game theory, behavioral economics, supply chain - not for fun, but for your next meeting, project, or career move.

---

## 💰 Business Model

### Pricing
- **First course:** Free
- **Subsequent courses:** $3.99 each
- **No subscriptions, no tiers, no upsells**

### Revenue Strategy
- Simple pay-per-course model
- Stripe integration for payments
- Email capture for free course (marketing funnel)

### Why This Model?
1. **Low friction:** No subscription commitment
2. **Fair value:** $3.99 feels cheap for personalized academic content
3. **Repeat purchases:** Users buy multiple courses over time
4. **Trust building:** Free first course proves value

### Future Monetization Ideas
- Premium features (PDF export, team access)
- Bulk course packs
- API access for enterprises
- White-label for educational institutions

---

## 🚀 User Journey

### Landing Page
1. User arrives at homepage
2. Sees headline: "Master Complex Topics, Adapted to Your Goals"
3. Views example courses (6 impressive academic topics)
4. Enters topic in search bar OR clicks example course

### Onboarding (Fingerprint Collection)
User answers questions to build "learner fingerprint":
1. **Topic confirmation:** What do you want to learn?
2. **Prior knowledge:** Beginner / Some exposure / Intermediate / Advanced
3. **Learning goal:** Job interview / Career / Sound smart / Academic / Hobby / Teach others
4. **Time commitment:** 30 min / 1 hour / 2 hours / 1 week / No rush
5. **Learning style:** Visual / Auditory / Reading / Kinesthetic / Mixed
6. **Content format:** Examples first / Theory first / Visual diagrams / Text heavy / Mixed
7. **Challenge preference:** Easy to hard / Adaptive / Deep dive / Practical only
8. **Context (optional):** Tell us more about your situation

### Outline Generation
1. AI generates course outline (2 modules, 2-3 lessons each)
2. User reviews outline
3. User can:
   - ✅ Approve → generates full course
   - 🔄 Request changes → AI regenerates with feedback

### Course Generation
1. Loading screen with progress messages
2. AI generates full course (30-60 seconds)
3. Success celebration animation
4. Transition to course viewer

### Course Viewing
1. Premium course viewer with:
   - Sidebar navigation (progress tracking, module outline)
   - Main content area (lesson text, quizzes, diagrams)
   - Progress tracking (lessons completed, percentage)
   - Keyboard shortcuts (← → M)
2. User reads lessons, marks complete
3. Optional PDF download (future)

---

## 🏗️ Technical Architecture

### High-Level Flow
```
User Input → Onboarding → Fingerprint → Outline Generation → Review → Full Course Generation → Course Viewer
```

### Core Components
1. **Landing Page** (`LandingPagePremium.tsx`)
2. **Onboarding** (`OnboardingFingerprint.tsx`)
3. **Outline Preview** (`CourseOutlinePreview.tsx`)
4. **Course Builder** (`CourseBuilderSmart.tsx`) - orchestrates the flow
5. **Course Viewer** (`CourseViewer.tsx`) - reading experience
6. **Example Courses** (`ExampleCourses.tsx`) - showcase section

### API Layer
- `/api/generate-onboarding-questions` - Dynamic question generation
- `/api/generate-outline` - Course structure creation
- `/api/generate-course` - Full course content generation
- `/api/email-capture` - Lead capture
- `/api/feedback` - User feedback collection
- `/api/track` - Analytics events
- `/api/stripe-webhook` - Payment processing

### AI Generation
**Model:** Claude Sonnet 4.5 (via Anthropic API)

**Prompt Engineering:**
- Learner fingerprint variables injected into system prompt
- Style adaptation based on learning preferences
- Length control based on time commitment
- Goal-specific framing (interview prep vs academic deep dive)
- Visual diagram instructions (Mermaid.js syntax)

### Data Storage
**Supabase (PostgreSQL)**

Tables:
- `courses` - Generated course content + metadata
- `users` - Email capture, payment status
- `analytics_events` - User behavior tracking

### State Management
- React hooks (useState, useEffect)
- localStorage for progress persistence
- URL params for session state (module/lesson position)

---

## 🎨 Design System

**Full documentation:** `DESIGN.md`

### Brand Colors
- **Royal Blue:** `#003F87` (primary)
- **Royal Blue Light:** `#0056B3` (hover)
- **Royal Blue Dark:** `#002D5F` (emphasis)

### Typography
- **Serif (Headings):** Merriweather
- **Sans-Serif (Body):** Inter
- **Monospace (Code):** Monaco

### Design Principles
1. **Academic Premium** - Serious, sophisticated, credible
2. **Subtle Borders** - 1px, 0.08-0.12 opacity (never heavy)
3. **Generous White Space** - Breathing room, not cluttered
4. **Restrained Shadows** - Depth without drama
5. **Royal Blue Accents** - Used sparingly for impact
6. **Clean Typography** - Large, readable, hierarchical

### Component Patterns
- **Cards:** White bg, subtle border, rounded-xl
- **Buttons:** Royal blue with shadow, hover effects
- **Badges:** Pill shape, light blue tint
- **Progress:** Circular SVG or linear bar
- **Quiz sections:** Light background, bordered box
- **Completion badges:** Green tint, checkmark icon

### Spacing
Multiples of 4px (Tailwind scale): 4, 8, 12, 16, 24, 32, 48, 64px

---

## ✨ Key Features

### 1. Learner Fingerprinting
Collects 8 dimensions of user context to personalize course:
- Prior knowledge level
- Learning goal (why they're learning)
- Time available
- Learning style (visual, auditory, etc.)
- Content format preference
- Challenge preference
- Context/situation

### 2. Outline Approval Flow
User reviews AI-generated outline before full course generation:
- See module/lesson structure upfront
- Request changes with natural language feedback
- AI regenerates outline incorporating feedback
- Approve when satisfied

### 3. Progress Tracking
- Tracks completed lessons via localStorage
- Circular progress indicator in sidebar
- Percentage completion
- Persists across sessions (keyed by course ID)

### 4. Interactive Quizzes
- Each lesson includes quiz question + answer
- Collapsible answer (click to reveal)
- Reinforces learning without being pushy

### 5. Visual Diagrams (Mermaid.js)
- Client-side diagram rendering
- Flowcharts, sequence diagrams, state machines, ER diagrams
- Embedded directly in lesson content
- Styled to match royal blue theme

### 6. Keyboard Navigation
- `→` Next lesson
- `←` Previous lesson
- `M` Toggle sidebar
- Smooth scrolling between lessons

### 7. Responsive Design
- Mobile-first approach
- Sidebar collapses on mobile
- Touch-friendly navigation
- Readable typography at all sizes

---

## 🛠️ Tech Stack

### Frontend
- **Framework:** Next.js 16 (App Router)
- **UI:** React 19
- **Styling:** Tailwind CSS + Custom CSS
- **Fonts:** Google Fonts (Merriweather, Inter)
- **Diagrams:** Mermaid.js 11.12.2

### Backend
- **Runtime:** Next.js API Routes (serverless)
- **AI:** Anthropic Claude API (Sonnet 4.5)
- **Database:** Supabase (PostgreSQL)
- **Payments:** Stripe
- **Analytics:** Custom implementation (Supabase events)

### Infrastructure
- **Hosting:** Vercel
- **Database:** Supabase Cloud
- **Domain:** Custom domain (TBD)
- **CDN:** Vercel Edge Network

### Development
- **Language:** TypeScript
- **Package Manager:** npm
- **Version Control:** Git + GitHub
- **Linting:** ESLint
- **Formatting:** Prettier (default)

---

## 📁 File Structure

```
app/
├── app/
│   ├── api/
│   │   ├── generate-course/route.ts          # Full course generation
│   │   ├── generate-outline/route.ts         # Outline generation
│   │   ├── generate-onboarding-questions/    # Dynamic questions
│   │   ├── email-capture/route.ts            # Lead capture
│   │   ├── feedback/route.ts                 # User feedback
│   │   ├── track/route.ts                    # Analytics
│   │   ├── stripe-webhook/route.ts           # Payment webhook
│   │   └── health/route.ts                   # Healthcheck
│   ├── page.tsx                              # Homepage
│   ├── globals.css                           # Global styles + theme
│   └── layout.tsx                            # Root layout
├── components/
│   ├── LandingPagePremium.tsx               # Main landing page
│   ├── CourseBuilderSmart.tsx               # Flow orchestrator
│   ├── OnboardingFingerprint.tsx            # Fingerprint collection
│   ├── CourseOutlinePreview.tsx             # Outline review
│   ├── CourseViewer.tsx                     # Course reading UI
│   ├── ExampleCourses.tsx                   # Example showcase
│   ├── MermaidDiagram.tsx                   # Diagram renderer
│   ├── LoadingSpinner.tsx                   # Loading states
│   └── SuccessCelebration.tsx               # Completion animation
├── lib/
│   ├── analytics.ts                         # Analytics helpers
│   ├── supabase.ts                          # Supabase client
│   ├── types.ts                             # TypeScript types
│   ├── validation.ts                        # Input validation
│   └── helpers.ts                           # Utility functions
├── DESIGN.md                                # Design system
├── MERMAID.md                               # Mermaid usage guide
├── CLAUDE.md                                # This file
└── package.json                             # Dependencies
```

---

## 🔌 API Endpoints

### POST `/api/generate-course`
**Purpose:** Generate full course content

**Input:**
```json
{
  "topic": "Game Theory",
  "learningStyle": "visual",
  "priorKnowledge": "beginner",
  "learningGoal": "job_interview",
  "timeCommitment": "1_hour",
  "contentFormat": "examples_first",
  "challengePreference": "adaptive",
  "context": "Preparing for strategy consultant interview"
}
```

**Output:**
```json
{
  "success": true,
  "course": {
    "title": "Game Theory for Job Interviews",
    "estimated_time": "1 hour",
    "modules": [
      {
        "title": "Module 1",
        "description": "...",
        "lessons": [
          {
            "title": "Lesson 1",
            "content": "...",
            "quiz": {
              "question": "...",
              "answer": "..."
            }
          }
        ]
      }
    ],
    "next_steps": ["...", "...", "..."]
  },
  "courseId": "uuid"
}
```

### POST `/api/generate-outline`
**Purpose:** Generate course outline for preview

**Input:** Same as `/api/generate-course` + optional `previousOutline` and `feedback`

**Output:**
```json
{
  "outline": {
    "title": "Course Title",
    "modules": [
      {
        "title": "Module 1",
        "lessons": [
          { "title": "Lesson 1" },
          { "title": "Lesson 2" }
        ]
      }
    ],
    "estimated_time": "1 hour"
  }
}
```

### POST `/api/generate-onboarding-questions`
**Purpose:** Generate dynamic follow-up questions

**Input:**
```json
{
  "topic": "Supply Chain Optimization",
  "answers": {
    "priorKnowledge": "beginner",
    "learningGoal": "career"
  }
}
```

**Output:**
```json
{
  "questions": [
    {
      "id": "context",
      "question": "Tell us about your factory/warehouse setup",
      "type": "text"
    }
  ]
}
```

### POST `/api/email-capture`
**Purpose:** Capture email for free course

**Input:**
```json
{
  "email": "user@example.com",
  "topic": "Game Theory"
}
```

### POST `/api/feedback`
**Purpose:** Collect user feedback

**Input:**
```json
{
  "courseId": "uuid",
  "rating": 5,
  "feedback": "Great course!",
  "email": "user@example.com"
}
```

### POST `/api/track`
**Purpose:** Track analytics events

**Input:**
```json
{
  "event": "course_generated",
  "properties": {
    "topic": "Game Theory",
    "duration": 1234
  }
}
```

---

## 💾 Database Schema

### Table: `courses`
```sql
CREATE TABLE courses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  topic TEXT NOT NULL,
  skill_level TEXT,
  goal TEXT,
  time_available TEXT,
  content JSONB NOT NULL,
  paid BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  user_email TEXT,
  fingerprint JSONB
);
```

### Table: `users`
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  stripe_customer_id TEXT,
  courses_purchased INTEGER DEFAULT 0
);
```

### Table: `analytics_events`
```sql
CREATE TABLE analytics_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_name TEXT NOT NULL,
  properties JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  session_id TEXT,
  user_id UUID REFERENCES users(id)
);
```

---

## 🚢 Deployment

### Vercel
- **Framework:** Next.js (auto-detected)
- **Build Command:** `npm run build`
- **Output Directory:** `.next`
- **Install Command:** `npm install`

### Environment Variables
```env
ANTHROPIC_API_KEY=sk-ant-...
NEXT_PUBLIC_SUPABASE_URL=https://...supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
STRIPE_SECRET_KEY=sk_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_...
```

### Git Workflow
1. Main branch: `main`
2. Push to main triggers Vercel deployment
3. Preview deployments for PRs (if needed)

### Build Process
1. `npm install` - Install dependencies
2. `npm run build` - Next.js production build
3. TypeScript compilation
4. Static page generation
5. Deploy to Vercel edge network

---

## 📊 Analytics & Tracking

### Events Tracked
- `page_view` - Landing page visit
- `topic_entered_landing` - User enters topic
- `example_course_selected` - Clicks example course
- `onboarding_started` - Begins fingerprint
- `onboarding_completed` - Finishes fingerprint
- `outline_generated` - Outline created
- `outline_approved` - User approves outline
- `outline_revision_requested` - User requests changes
- `course_generated` - Full course created
- `lesson_completed` - User marks lesson complete
- `pdf_download` - Downloads course (future)

### Analytics Helper
```typescript
// lib/analytics.ts
export const analytics = {
  track: (event: string, properties?: any) => void,
  pageView: (page: string) => void,
  courseStarted: (topic: string) => void,
  courseGenerated: (topic: string, duration: number) => void
};
```

### Future Analytics
- Funnel conversion rates
- Time to course completion
- Most popular topics
- Drop-off points
- A/B testing framework

---

## ⚠️ Known Issues

### 1. Mermaid Diagrams Not Rendering
**Status:** IN PROGRESS  
**Issue:** Claude API not consistently generating mermaid syntax despite instructions  
**Attempted Fixes:**
- Added mermaid instructions to prompt (v1)
- Made instructions mandatory with examples (v2)
- Multiple reminders in prompt (v3)

**Next Steps:**
- Test with different topics
- Consider post-processing to inject diagrams
- May need to use different model or few-shot examples

### 2. Quiz Answer Persistence
**Status:** FIXED (commit ba0157a)  
**Issue:** Quiz answers stayed expanded when navigating lessons  
**Fix:** Added unique keys to quiz details element

### 3. Loading Screen Not Centered
**Status:** FIXED (commit b6edd06)  
**Issue:** Loading screens used min-h-screen instead of fixed positioning  
**Fix:** Changed to `fixed inset-0` for true centering

### 4. Metadata Warnings
**Status:** KNOWN, LOW PRIORITY  
**Issue:** Next.js warnings about viewport/themeColor in metadata  
**Impact:** None (just build warnings)  
**Fix:** Move to viewport export (future)

---

## 🔮 Future Roadmap

### Short Term (Next 2-4 weeks)
- [ ] Fix mermaid diagram generation reliability
- [ ] Add PDF export functionality
- [ ] Implement Stripe payment flow
- [ ] Email delivery of courses
- [ ] Basic user accounts (email + password)
- [ ] Course library (view past courses)

### Medium Term (1-3 months)
- [ ] Course sharing (shareable links)
- [ ] Team/organization accounts
- [ ] Course editing/regeneration
- [ ] More visual diagram types
- [ ] Audio narration (TTS)
- [ ] Mobile app (React Native)

### Long Term (3-6 months)
- [ ] Interactive exercises/coding challenges
- [ ] Live expert Q&A sessions
- [ ] Course marketplace (user-generated)
- [ ] API for enterprise integrations
- [ ] White-label licensing
- [ ] Certificates of completion

### Experimental Ideas
- [ ] AI tutor chat alongside course
- [ ] Spaced repetition quiz system
- [ ] Community discussion forums
- [ ] Course recommendations engine
- [ ] Integration with calendars (study scheduling)

---

## 📚 Related Documentation

- **DESIGN.md** - Complete design system and component patterns
- **MERMAID.md** - Guide to using Mermaid diagrams in courses
- **README.md** - Developer setup and contribution guide (if exists)

---

## 🤝 Development Workflow

### Making Changes
1. Read `DESIGN.md` first for UI changes
2. Read `CLAUDE.md` (this file) for context
3. Make changes locally
4. Test locally: `npm run dev`
5. Build: `npm run build`
6. Commit with descriptive message
7. Push to main → auto-deploys to Vercel

### Commit Message Format
```
🎨 UI: Visual design changes
✨ Feature: New feature
🐛 Fix: Bug fix
📝 Docs: Documentation
♻️ Refactor: Code restructure
⚡ Performance: Speed improvement
```

### Testing Checklist
- [ ] Test on mobile (375px width)
- [ ] Test on desktop (1920px width)
- [ ] Test all user flows end-to-end
- [ ] Check console for errors
- [ ] Verify API responses
- [ ] Test edge cases (empty states, errors)

---

## 💡 Philosophy & Principles

### Product Philosophy
1. **Respect the user's time** - No fluff, no filler, just what they need
2. **Personalization over scale** - Better to serve 100 users perfectly than 10,000 mediocrely
3. **Academic rigor** - Real learning, not edutainment
4. **Fair pricing** - $3.99 for quality content, no tricks

### Design Philosophy
1. **Subtle over flashy** - Elegance comes from restraint
2. **Academic premium** - Sophisticated without being stuffy
3. **Function drives form** - Beauty in service of usability
4. **Consistency builds trust** - Follow DESIGN.md religiously

### Technical Philosophy
1. **Simple over clever** - Boring tech that works > exciting tech that breaks
2. **Ship fast, iterate faster** - MVP mentality
3. **User experience > developer experience** - But not at the cost of maintainability
4. **Measure everything** - Analytics guide decisions

---

**End of CLAUDE.md**

*This document is maintained by Clawd (AI assistant) and should be updated as the product evolves. When making significant changes, update this file to reflect new understanding.*
