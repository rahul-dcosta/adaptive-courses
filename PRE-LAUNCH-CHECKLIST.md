# Pre-Launch Checklist

**Launch Target:** February 3-5, 2026  
**Current Status:** 90% MVP Complete

---

## 🔴 CRITICAL (Must Do Before Launch)

### Payment Flow
- [ ] **Add Stripe API keys to Vercel**
  - Get keys from stripe.com/dashboard
  - Add to Vercel env vars: `STRIPE_SECRET_KEY`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
  
- [ ] **Implement Stripe Checkout**
  - Install `@stripe/stripe-js` package
  - Update `/api/create-checkout` to create real sessions
  - Add checkout redirect to CourseBuilderNew (after goal selection)
  - Test with Stripe test cards
  
- [ ] **Set up Stripe Webhook**
  - Get webhook signing secret
  - Add to Vercel: `STRIPE_WEBHOOK_SECRET`
  - Update `/api/stripe-webhook` to handle events
  - Test with Stripe CLI: `stripe listen --forward-to localhost:3000/api/stripe-webhook`
  
- [ ] **Link payment → course generation**
  - Webhook triggers course generation on payment success
  - Update `paid` flag in database
  - Handle failed payments gracefully

**Estimated time:** 3-4 hours  
**Priority:** 🔴 BLOCKING LAUNCH

---

### Database Setup
- [ ] **Run Migration 1: Courses table**
  - Open Supabase SQL Editor
  - Copy SQL from `docs/MIGRATIONS.md` (Migration 1)
  - Execute and verify with `SELECT * FROM courses LIMIT 1;`
  
- [ ] **Run Migration 2: Email signups table**
  - Execute Migration 2 SQL
  - Verify with `SELECT * FROM email_signups LIMIT 1;`
  
- [ ] **Run Migration 3 (Optional): Analytics table**
  - Execute Migration 3 SQL
  - Verify with `SELECT * FROM analytics_events LIMIT 1;`

**Estimated time:** 15-30 minutes  
**Priority:** 🔴 BLOCKING LAUNCH

---

### Testimonials
- [ ] **Collect 3 real testimonials**
  - Send free course access to 10 friends/colleagues
  - Ask for feedback after they try it
  - Request quote: name, title, what worked for them
  - Get permission to use publicly
  
- [ ] **Update LandingPage.tsx testimonials**
  - Replace placeholder quotes
  - Add real names and titles
  - Maybe add photos (optional)

**Estimated time:** 2-3 hours (waiting on people)  
**Priority:** 🔴 BLOCKING LAUNCH (can't use fake testimonials on PH)

---

### Product Hunt Assets
- [ ] **Record 60-second demo video**
  - Show problem → onboarding → course generation → result
  - Use Loom or QuickTime
  - Keep it punchy and fast-paced
  - Upload to YouTube (unlisted) or host on Vercel
  
- [ ] **Take 5 gallery screenshots**
  1. Hero shot (landing page)
  2. Onboarding flow (4-panel)
  3. Course generation loading
  4. Course viewer (full screen)
  5. Mobile view
  - Use full-screen browser, hide dev tools
  - 1200x800px or larger
  - Clean, professional look
  
- [ ] **Create Product Hunt submission**
  - Use copy from `marketing/copy/producthunt.md`
  - Upload video + screenshots
  - Schedule for 12:01 AM PST launch day

**Estimated time:** 2-3 hours  
**Priority:** 🔴 BLOCKING LAUNCH

---

## 🟡 IMPORTANT (Should Do Before Launch)

### Email Delivery
- [ ] **Sign up for Resend or SendGrid**
  - Recommended: Resend (easier setup)
  - Get API key
  - Add to Vercel: `RESEND_API_KEY`
  
- [ ] **Create email template**
  - Subject: "Your [Topic] course is ready!"
  - Include: Course link, PDF attachment, support email
  - Use React Email or plain HTML
  
- [ ] **Add email send to success flow**
  - Trigger after payment confirmed
  - Send course content
  - Log email sent to database

**Estimated time:** 2 hours  
**Priority:** 🟡 HIGH (users expect this)

---

### PDF Export
- [ ] **Install PDF library**
  - Option A: `react-pdf` (React components → PDF)
  - Option B: `puppeteer` (render page → PDF)
  - Recommended: `react-pdf` for smaller bundle
  
- [ ] **Create PDF generation route**
  - `/api/generate-pdf` endpoint
  - Takes courseId, returns PDF file
  - Cache PDFs in Supabase Storage
  
- [ ] **Add download button**
  - Update CourseBuilderNew to actually download
  - Remove "coming soon" alert

**Estimated time:** 3-4 hours  
**Priority:** 🟡 HIGH (expected feature)

---

### Analytics
- [ ] **Create Google Analytics property**
  - Go to analytics.google.com
  - Create new property
  - Get tracking ID (G-XXXXXXXXXX)
  
- [ ] **Add GA4 to app/layout.tsx**
  ```tsx
  <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} />
  <Script id="google-analytics">
    {`
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '${GA_ID}');
    `}
  </Script>
  ```
  
- [ ] **Verify tracking works**
  - Visit site, check GA Real-time view

**Estimated time:** 30 minutes  
**Priority:** 🟡 MEDIUM (can add after launch)

---

### Error Monitoring
- [ ] **Sign up for Sentry**
  - Free tier is fine for MVP
  - Get DSN
  
- [ ] **Install Sentry SDK**
  ```bash
  npm install @sentry/nextjs
  npx @sentry/wizard -i nextjs
  ```
  
- [ ] **Add Sentry DSN to Vercel**
  - `NEXT_PUBLIC_SENTRY_DSN`
  
- [ ] **Test error tracking**
  - Trigger a test error, verify in Sentry dashboard

**Estimated time:** 30 minutes  
**Priority:** 🟡 MEDIUM

---

## 🟢 NICE-TO-HAVE (Can Skip for MVP)

### User Authentication
- [ ] Implement Supabase Auth
- [ ] User dashboard (view past courses)
- [ ] "My Courses" page
- [ ] Login/signup flow

**Priority:** 🟢 LOW (can launch without)

---

### Course Templates
- [ ] Pre-generate courses for popular topics
- [ ] "Manufacturing Basics" template
- [ ] "Supply Chain 101" template
- [ ] "Job Interview Prep" template

**Priority:** 🟢 LOW

---

### Social Features
- [ ] Social sharing buttons (Twitter, LinkedIn)
- [ ] "Share this course" feature
- [ ] Referral program

**Priority:** 🟢 LOW

---

## 🔍 FINAL QA (Launch Day -1)

### Manual Testing
- [ ] **Landing page:**
  - Email capture works
  - Links work (FAQ, Terms, Privacy, Sample)
  - Mobile responsive
  
- [ ] **Course generation flow:**
  - All 4 steps work
  - Progress breadcrumbs update
  - Loading state shows
  - Course displays properly
  
- [ ] **Payment flow:**
  - Stripe checkout opens
  - Test card works (`4242 4242 4242 4242`)
  - Webhook receives event
  - Course marked as paid
  - Success page shows
  
- [ ] **Cross-browser:**
  - Chrome ✓
  - Firefox ✓
  - Safari ✓
  - Mobile Safari ✓

### Performance
- [ ] **Lighthouse audit:** Run on landing page
  - Target: Performance >85, Accessibility >90
  
- [ ] **Page load time:** <2 seconds on 3G
  
- [ ] **Course generation time:** <90 seconds

### Legal & Compliance
- [ ] **Terms of Service:** Live and linked
- [ ] **Privacy Policy:** Live and linked
- [ ] **Cookie notice:** (Optional for MVP)
- [ ] **GDPR compliance:** (If targeting EU)

---

## 📅 LAUNCH DAY TIMELINE

### 12:01 AM PST (Launch)
- [ ] Submit to Product Hunt
- [ ] Post first comment (maker intro)
- [ ] Share launch link in personal Slack/Discord

### 9:00 AM EST (Morning Push)
- [ ] LinkedIn Post #1 (The Problem)
- [ ] Twitter launch thread
- [ ] Email personal network (50 people)
- [ ] Post in IndieHackers
- [ ] Post in r/SideProject

### Throughout Day
- [ ] Reply to every Product Hunt comment (<15 min)
- [ ] Monitor analytics dashboard
- [ ] Track conversions in real-time
- [ ] Fix critical bugs if found

### 6:00 PM EST (Evening Push)
- [ ] LinkedIn Post #5 (Launch Day recap)
- [ ] Share early traction numbers
- [ ] Thank everyone who supported

---

## 📊 SUCCESS METRICS (Week 1)

**Minimum Viable Success:**
- [ ] Top 10 on Product Hunt
- [ ] 20+ paid courses ($100 revenue)
- [ ] 100+ email sign-ups
- [ ] 5+ organic testimonials/tweets

**Good Success:**
- [ ] Top 5 on Product Hunt
- [ ] 50+ paid courses ($250 revenue)
- [ ] 200+ email sign-ups
- [ ] 10+ press mentions/features

**Great Success:**
- [ ] #1 Product of the Day
- [ ] 100+ paid courses ($500 revenue)
- [ ] 500+ email sign-ups
- [ ] TechCrunch/HackerNews feature

---

## ⚠️ LAUNCH BLOCKERS (Stop If)

- [ ] Stripe payment doesn't work (CRITICAL)
- [ ] Course generation fails >50% (CRITICAL)
- [ ] Database is down (CRITICAL)
- [ ] Major security vulnerability found (CRITICAL)

If any of these occur: **DELAY LAUNCH**, fix, then re-schedule.

---

## ✅ DEFINITION OF DONE

**Ready to launch when:**
- [x] Landing page works
- [x] Onboarding flow works
- [x] Course generation works
- [ ] Payment flow works (Stripe)
- [ ] Database migrations run
- [ ] 3 real testimonials collected
- [ ] Product Hunt assets ready
- [x] Legal pages live
- [x] FAQ complete
- [ ] Email delivery works (nice-to-have)
- [ ] PDF export works (nice-to-have)

**Absolute minimum:** First 9 items. Can launch without email/PDF if needed.

---

**Last Updated:** 2026-01-31  
**Launch Target:** Feb 3-5, 2026  
**Progress:** 90% → 100% (6-8 hours remaining)
