# Adaptive Courses V1 Launch Checklist

*Last updated: 2026-02-01*

## Overview

Everything needed for v1 launch. Nothing ships until every CRITICAL item is checked.

---

## CRITICAL - Must Have for Launch

### Pages (Complete ✅)

- [x] **`/pricing`** - Pricing page with 3 tiers (Free, Per-Course $3.99, Pro $9.99/mo)
  - Show feature comparison table ✅
  - CTAs to start free or upgrade ✅
  - FAQ section about billing ✅

- [x] **`/welcome`** - New user welcome/onboarding page
  - Auth redirects here after signup
  - Explain what they can do ✅
  - CTA to create first course ✅

- [x] **`/auth/error`** - Auth error page
  - Show friendly error messages ✅
  - Link to retry or contact support ✅

- [x] **`/dashboard`** - User dashboard (course library)
  - List of user's courses ✅
  - Course status (generating, complete) ✅
  - Quick actions (view, download PDF, delete) ✅

- [x] **`/account`** - Account settings
  - Email, plan status ✅
  - Billing history ✅
  - Cancel/upgrade subscription ✅
  - Delete account ✅

### Payment System (0% Complete)

- [ ] **Stripe Account Setup**
  - [ ] Create Stripe account (if not done)
  - [ ] Create Products in Stripe Dashboard:
    - Per-Course: $3.99 one-time
    - Pro Monthly: $9.99/month
    - Pro Annual: $99/year
  - [ ] Get Price IDs and add to `.env`:
    - `STRIPE_SECRET_KEY`
    - `STRIPE_PUBLISHABLE_KEY`
    - `STRIPE_WEBHOOK_SECRET`
    - `NEXT_PUBLIC_STRIPE_PRICE_COURSE`
    - `NEXT_PUBLIC_STRIPE_PRICE_PRO_MONTHLY`
    - `NEXT_PUBLIC_STRIPE_PRICE_PRO_ANNUAL`

- [ ] **Checkout Flow** (`/api/create-checkout`)
  - [ ] Initialize Stripe client
  - [ ] Create checkout session for per-course
  - [ ] Create checkout session for Pro subscription
  - [ ] Handle success/cancel URLs
  - [ ] Pass course metadata for delivery

- [ ] **Webhook Handler** (`/api/stripe-webhook`)
  - [ ] Verify webhook signature
  - [ ] Handle `checkout.session.completed`
  - [ ] Handle `customer.subscription.created`
  - [ ] Handle `customer.subscription.updated`
  - [ ] Handle `customer.subscription.deleted`
  - [ ] Handle `invoice.payment_failed`
  - [ ] Update user plan in database
  - [ ] Trigger course delivery on purchase

- [ ] **Success Page** (`/success`)
  - [ ] Verify payment via session ID
  - [ ] Show course access
  - [ ] Handle subscription confirmation

- [ ] **Billing Portal**
  - [ ] Stripe Customer Portal setup
  - [ ] Link from account page to manage subscription

### Database (Course Persistence)

- [ ] **Supabase Tables**
  - [ ] `users` table (id, email, plan, stripe_customer_id, created_at)
  - [ ] `courses` table (id, user_id, title, content, created_at)
  - [ ] `purchases` table (id, user_id, course_id, stripe_session_id, amount, created_at)
  - [ ] `subscriptions` table (id, user_id, stripe_subscription_id, status, current_period_end)

- [ ] **Course Storage**
  - [ ] Save generated course to database
  - [ ] Link course to user account
  - [ ] Retrieve courses for dashboard

### Auth Flow Fixes

- [x] **Logout Button**
  - [x] Add to navbar when logged in ✅
  - [x] Clear session cookie ✅
  - [x] Redirect to homepage ✅

- [ ] **Session Check**
  - [ ] Middleware to verify auth on protected routes
  - [ ] Redirect unauthenticated users appropriately

---

## HIGH PRIORITY - Should Have

### Legal & Compliance

- [ ] **Business Registration**
  - [ ] LLC formation (Delaware or home state)
  - [ ] EIN from IRS
  - [ ] Business bank account

- [ ] **Stripe Legal**
  - [ ] Add business address to Stripe
  - [ ] Add support email
  - [ ] Add business description
  - [ ] Enable payouts

- [ ] **Terms of Service**
  - [x] Page exists (`/terms`)
  - [ ] Review for accuracy
  - [ ] Add refund policy details
  - [ ] Add AI-generated content disclaimer

- [ ] **Privacy Policy**
  - [x] Page exists (`/privacy`)
  - [ ] Add Stripe data handling
  - [ ] Add cookie policy details
  - [ ] GDPR compliance check

### Trust Signals

- [ ] **Security Badges**
  - [ ] "Powered by Stripe" badge in checkout
  - [ ] SSL/HTTPS verified badge (optional)
  - [ ] "256-bit encryption" mention in checkout

- [ ] **Social Proof**
  - [ ] Real testimonials (replace placeholders)
  - [ ] Course count ("10,000+ courses generated")
  - [ ] User count if significant

### Email System

- [ ] **Custom Domain**
  - [ ] Buy domain (adaptivecourses.com)
  - [ ] Configure DNS for Resend
  - [ ] Update FROM_EMAIL to use custom domain

- [ ] **Transactional Emails**
  - [x] OTP verification email
  - [x] Magic link email
  - [x] Welcome email
  - [ ] Course delivery email (PDF attachment)
  - [ ] Payment receipt email
  - [ ] Subscription renewal reminder

### SEO & Marketing

- [ ] **Domain**
  - [ ] Purchase adaptivecourses.com
  - [ ] Configure in Vercel
  - [ ] Update all hardcoded URLs

- [ ] **Social Links**
  - [ ] Create Twitter/X account
  - [ ] Create LinkedIn page
  - [ ] Add social links to footer

- [ ] **Open Graph / Meta**
  - [x] OG image exists
  - [ ] Verify OG tags render correctly
  - [ ] Test social sharing preview

---

## MEDIUM PRIORITY - Nice to Have

### User Experience

- [ ] **PDF Export**
  - [ ] Generate PDF from course content
  - [ ] Include diagrams/charts
  - [ ] Download button in course viewer
  - [ ] Email delivery option

- [ ] **Course Sharing**
  - [ ] Shareable link (read-only)
  - [ ] Social share buttons

- [ ] **Progress Tracking**
  - [ ] Mark lessons complete
  - [ ] Resume where left off
  - [ ] Completion certificate

### AI Chat (Phase 3)

- [ ] **Chat Interface**
  - [ ] Chat panel in course viewer
  - [ ] Context-aware responses about course
  - [ ] Prompt limit display ("8/10 prompts today")

- [ ] **Rate Limiting**
  - [ ] Track prompts per user
  - [ ] Daily reset at midnight UTC
  - [ ] Upgrade prompt when limit hit

### Analytics & Monitoring

- [ ] **Error Tracking**
  - [ ] Sentry integration
  - [ ] Error boundary reporting

- [ ] **Analytics**
  - [ ] Google Analytics or Plausible
  - [ ] Conversion funnel tracking
  - [ ] Course completion rates

- [ ] **Logging**
  - [ ] Production log aggregation
  - [ ] API latency monitoring

---

## LOW PRIORITY - Future

### Growth Features

- [ ] **Referral Program**
  - [ ] Give $2, get $2 credits
  - [ ] Referral link generation
  - [ ] Track referrals

- [ ] **Affiliate Program**
  - [ ] Partner dashboard
  - [ ] Commission tracking

### Advanced Features

- [ ] **Course Revisions**
  - [ ] Edit generated course
  - [ ] Regenerate sections
  - [ ] Version history

- [ ] **Team Plans**
  - [ ] Multi-seat subscriptions
  - [ ] Shared course library

- [ ] **API Access**
  - [ ] Public API for course generation
  - [ ] API keys management

---

## Build & Deploy Fixes

### Current Warnings to Address

- [ ] **Viewport/ThemeColor Warning**
  - Move from `metadata` to `viewport` export in:
    - [ ] `/faq`
    - [ ] `/about`
    - [ ] `/debug`
    - [ ] Root layout

- [ ] **Stripe Webhook Config**
  - [ ] Remove deprecated `export const config`
  - [ ] Use route segment config instead

- [ ] **CSS Import Order**
  - [ ] Move `@import` to top of globals.css

---

## Environment Variables Needed

```env
# Already Set
ANTHROPIC_API_KEY=xxx
RESEND_API_KEY=xxx
SUPABASE_URL=xxx
SUPABASE_ANON_KEY=xxx

# Need to Add
STRIPE_SECRET_KEY=sk_live_xxx
STRIPE_PUBLISHABLE_KEY=pk_live_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
NEXT_PUBLIC_STRIPE_PRICE_COURSE=price_xxx
NEXT_PUBLIC_STRIPE_PRICE_PRO_MONTHLY=price_xxx
NEXT_PUBLIC_STRIPE_PRICE_PRO_ANNUAL=price_xxx

# Optional
SENTRY_DSN=xxx
GOOGLE_ANALYTICS_ID=xxx
```

---

## Launch Order

### Phase 1: Core (This Week)
1. Create `/pricing` page
2. Create `/welcome` page
3. Create `/auth/error` page
4. Implement Stripe checkout
5. Implement Stripe webhook
6. Fix `/success` page
7. Database tables for users/courses

### Phase 2: Polish (Next Week)
1. Create `/dashboard` page
2. Create `/account` page
3. Add logout button
4. Custom email domain
5. Real testimonials
6. Security badges

### Phase 3: Growth (After Launch)
1. PDF export
2. AI chat
3. Referral program
4. Analytics

---

## Current Status

| Component | Status | Notes |
|-----------|--------|-------|
| Landing Page | ✅ Ready | |
| Course Builder | ✅ Ready | |
| Course Viewer | ✅ Ready | |
| Auth System | ✅ Ready | /welcome, /auth/error, logout all complete |
| Payment System | ❌ 0% | Stripe integration not started |
| User Dashboard | ✅ Ready | UI complete, needs Supabase integration |
| Account Page | ✅ Ready | UI complete, needs Supabase integration |
| Pricing Page | ✅ Ready | 3 tiers with comparison table |
| Legal Pages | ✅ Ready | Terms, Privacy exist |
| Info Pages | ✅ Ready | About, FAQ exist |
| Email System | 🟡 80% | Works, needs custom domain |

**Overall: ~75% complete for v1**

*Remaining: Stripe integration, Supabase database tables, session middleware*

---

## Quick Reference

**Stripe Dashboard**: https://dashboard.stripe.com
**Vercel Dashboard**: https://vercel.com/rahul-dcosta/adaptive-courses
**Supabase Dashboard**: https://supabase.com/dashboard
**Resend Dashboard**: https://resend.com/emails
**GitHub Repo**: https://github.com/rahul-dcosta/adaptive-courses
