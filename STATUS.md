# Project Status

**Last Updated:** 2026-01-31 11:15 UTC  
**Version:** 0.9 (Pre-Launch MVP)  
**Deployment:** https://adaptive-courses.vercel.app

---

## ✅ What Works

### Core Product
- [x] **Landing page**
  - Hero with compelling copy
  - Email capture form
  - "How it works" section (3 steps)
  - Testimonials (placeholder social proof)
  - CTA buttons
  - Footer

- [x] **Course Generation Flow**
  - Button-based onboarding (4 steps)
  - Topic input (text field)
  - Situation selection (4 options with emojis)
  - Timeline selection (3 options)
  - Goal selection (3 options)
  - Progress breadcrumbs
  - Loading state with spinner
  - Generated course display

- [x] **AI Integration**
  - Claude Sonnet 4.5 API integration
  - Custom prompt engineering
  - JSON response parsing (handles markdown wrapping)
  - Error handling with user-friendly messages
  - API key health check endpoint (`/api/test-api`)

- [x] **Database**
  - Supabase setup complete
  - Courses table with schema
  - Auto-save on generation
  - Stores topic, skill_level, goal, time_available, content

- [x] **UI/UX**
  - Fully responsive (mobile, tablet, desktop)
  - Tailwind CSS styling
  - Smooth transitions and hover states
  - Accessible button design
  - Clean typography
  - Brand colors (indigo/blue gradient)

- [x] **DevOps**
  - Vercel auto-deployment on push
  - Environment variables configured
  - Git repo (private on GitHub)
  - Commit history attribution (Cofounder C)

### Infrastructure
- [x] Next.js 14 App Router
- [x] TypeScript
- [x] Supabase client library
- [x] Anthropic SDK
- [x] Vercel hosting
- [x] Custom domain ready (TBD)

---

## 🚧 In Progress / Blocked

### Payments
- [ ] **Stripe integration** - Not started
  - Checkout session creation
  - Payment success webhook
  - Update `paid` flag in database
  - Redirect to course after payment

**Blocker:** Need to decide when to charge (before or after generation)

### Email Delivery
- [ ] **Email service setup** - Not started
  - Resend or SendGrid integration
  - Course delivery email template
  - Trigger on successful generation
  - Include course content + PDF attachment

**Blocker:** Need email service API key

### PDF Export
- [ ] **PDF generation** - Not started
  - Course content → PDF conversion
  - Formatting and styling
  - Download button on course page
  - Email attachment

**Blocker:** Need PDF library (puppeteer or react-pdf)

### Authentication
- [ ] **User auth flow** - Not started
  - Sign up / Sign in with Supabase Auth
  - User dashboard to view past courses
  - Row-level security policies
  - Auth state management

**Blocker:** Decide if needed for MVP or post-launch

---

## 🐛 Known Bugs

### Critical
None currently.

### Minor
- [ ] Email capture doesn't actually save to database yet (just logs to console)
- [ ] No validation on email format (accepts invalid emails)
- [ ] Course generation can fail silently if Supabase save fails (still returns course)
- [ ] No retry logic if Claude API rate limits
- [ ] Long topics (>100 chars) might break UI layout

### Nice-to-Fix
- [ ] No loading state on email submit button
- [ ] Testimonials are fake (need real ones)
- [ ] No analytics tracking (Google Analytics, etc.)
- [ ] Missing meta tags for SEO/social sharing
- [ ] No favicon

---

## 🎯 Pre-Launch Checklist

### Must-Have (Blocking Launch)
- [ ] **Stripe payment integration** - Can't launch without this
- [ ] **Real testimonials** - At least 3 from beta testers
- [ ] **Terms of Service** - Legal requirement
- [ ] **Privacy Policy** - Legal requirement
- [ ] **Meta tags** - SEO + social sharing (OpenGraph)
- [ ] **Favicon** - Basic branding
- [ ] **Analytics** - Track conversions

### Should-Have (High Priority)
- [ ] **Email delivery** - Users expect to receive courses
- [ ] **PDF export** - Easy to share and save
- [ ] **FAQ page** - Reduce support burden
- [ ] **Refund policy** - Build trust

### Nice-to-Have (Can Launch Without)
- [ ] User authentication
- [ ] Course preview before payment
- [ ] Social login (Google, GitHub)
- [ ] Multi-language support

---

## 📊 Metrics to Track

### Pre-Launch
- [x] API works (tested manually)
- [ ] Page load time (<2 seconds)
- [ ] Mobile usability (100% responsive)
- [ ] Conversion funnel (landing → email → payment → course)

### Post-Launch
- [ ] Landing page visits
- [ ] Email sign-ups
- [ ] Courses generated
- [ ] Courses paid
- [ ] Conversion rate (email → paid)
- [ ] Average course generation time
- [ ] API costs per course
- [ ] Customer support tickets

---

## 🚀 Deployment Status

### Production
- **URL:** https://adaptive-courses.vercel.app
- **Branch:** `main`
- **Auto-deploy:** ✅ Enabled
- **Environment:** Production
- **Last Deploy:** [Auto-updates on push]

### Environment Variables (Vercel)
- ✅ `ANTHROPIC_API_KEY`
- ✅ `NEXT_PUBLIC_SUPABASE_URL`
- ✅ `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- ❌ `STRIPE_SECRET_KEY` (not added yet)
- ❌ `STRIPE_PUBLISHABLE_KEY` (not added yet)

---

## 🎨 Marketing Materials

### Ready
- [x] 5 LinkedIn launch posts (scheduled)
- [x] Product Hunt submission copy
- [x] Product Hunt first comment (maker intro)
- [x] Twitter launch thread
- [x] Launch plan with timeline
- [x] Distribution strategy

### Needed
- [ ] Demo video (60 seconds)
- [ ] Screenshot gallery (5 images for Product Hunt)
- [ ] Press kit (logo, screenshots, copy)
- [ ] Email drip sequence (for sign-ups who don't convert)

---

## 🔧 Technical Debt

### High Priority
- [ ] Add proper error boundaries (React)
- [ ] Implement request rate limiting
- [ ] Add input sanitization (prevent injection)
- [ ] Set up error monitoring (Sentry or similar)
- [ ] Add unit tests for critical paths

### Medium Priority
- [ ] Optimize bundle size (currently ~200KB)
- [ ] Add caching for course content
- [ ] Implement proper TypeScript types (some `any` types exist)
- [ ] Refactor CourseBuilder into smaller components

### Low Priority
- [ ] Add Storybook for component library
- [ ] Set up CI/CD pipeline (tests on PR)
- [ ] Add accessibility audit (WCAG 2.1)

---

## 💰 Cost Breakdown (Estimated)

### Current Monthly Costs
- Vercel: **$0** (free tier)
- Supabase: **$0** (free tier)
- Anthropic API: **~$0.50/course** (assuming 500 tokens/course)
- Domain: **$1/month** (if purchased)
- **Total:** ~$1 + ($0.50 × courses generated)

### At 100 courses/month
- Anthropic: $50
- Vercel: $0 (still free)
- Supabase: $0 (still free)
- **Total:** ~$51/month

### At 500 courses/month
- Anthropic: $250
- Vercel: $20 (Pro plan needed)
- Supabase: $25 (Pro plan needed)
- **Total:** ~$295/month

### Revenue Needed to Break Even
- 100 courses/month → Need 11 paid courses ($5 each = $55)
- 500 courses/month → Need 60 paid courses ($5 each = $300)

**Margin:** ~92% after costs at scale

---

## 🎯 Next 48 Hours

### Priority 1: Get to Launchable State
1. [ ] Add Stripe payment integration
2. [ ] Create Terms of Service + Privacy Policy
3. [ ] Add meta tags for SEO/social
4. [ ] Collect 3 real testimonials from beta users
5. [ ] Record 60-second demo video
6. [ ] Take Product Hunt gallery screenshots

### Priority 2: Quality Polish
7. [ ] Fix email capture (save to database)
8. [ ] Add Google Analytics
9. [ ] Test full flow end-to-end (10× manually)
10. [ ] Load test (simulate 100 concurrent users)

### Priority 3: Launch Prep
11. [ ] Schedule Product Hunt submission (12:01 AM PST)
12. [ ] Queue LinkedIn posts
13. [ ] Prepare Twitter thread
14. [ ] Email personal network

---

## ✨ Changelog

### 2026-01-31 (Today)
- ✅ Built button-based onboarding (The Fingerprint Model)
- ✅ Added landing page with email capture
- ✅ Wrote 5 LinkedIn launch posts
- ✅ Created Product Hunt copy
- ✅ Updated README with project overview
- ✅ Added Supabase course saving
- ✅ Fixed model name (claude-sonnet-4-5-20250929)
- ✅ Improved JSON parsing for AI responses
- ✅ Made git commits attributed to "Cofounder C"
- ✅ Added API health check endpoint

### 2026-01-30
- ✅ Initial setup (Next.js, Tailwind, Supabase)
- ✅ Basic course generation API
- ✅ Text-based onboarding (deprecated)

---

## 🤔 Open Questions

1. **When to charge?**
   - Option A: Before generation (lower risk, higher friction)
   - Option B: After generation (higher conversion, payment collection risk)
   - **Leaning:** Before generation (reduces API abuse)

2. **What to do with failed payments?**
   - Save course anyway? Delete it? Lock it?
   - **Leaning:** Save but lock until paid

3. **Email vs. no email?**
   - Require email before showing course builder?
   - Or make it optional?
   - **Leaning:** Required (builds email list)

4. **Refund policy?**
   - Auto-refund if unsatisfied?
   - Manual approval?
   - No refunds?
   - **Leaning:** 24-hour refund window, manual approval

5. **Course quality validation?**
   - Let all courses through?
   - Add human review?
   - AI quality check?
   - **Leaning:** Let all through, iterate based on feedback

---

## 📞 Support

**Bugs/Issues:** Open GitHub issue  
**Feature Requests:** GitHub Discussions  
**Contact:** rdcosta@umich.edu

---

**TL;DR:**  
✅ Core product works  
🚧 Payments & email delivery pending  
🎯 Can launch in 48 hours with Stripe integration  
💰 Break-even at ~11 paid courses/month
