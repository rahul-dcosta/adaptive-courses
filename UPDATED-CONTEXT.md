# Updated Context - Adaptive Courses (Feb 1, 2026)

**What Changed:** Business structure, pricing, domain, Reddit strategy

---

## ✅ Key Updates

### 1. Business Structure: UAE Setup
**Previous plan:** US LLC (H1B complications)  
**NEW:** UAE Free Zone company (Golden Visa holder benefits)

**Why:**
- 0% personal income tax in UAE
- 0-9% corporate tax (vs. 20-40% in US)
- Golden Visa holder = easier setup
- Better for international SaaS

**Action items:**
- [ ] Choose free zone (DMCC or Dubai Silicon Oasis recommended)
- [ ] Budget AED 30-50K (~$8-13.5K) for Year 1 setup
- [ ] Update all legal docs (Terms, Privacy) to UAE jurisdiction
- [ ] Open UAE bank account (Emirates NBD or Mashreq Neo)

**Details:** See `apps/web/legal/UAE-BUSINESS-SETUP.md`

---

### 2. Pricing Structure
**Previous research:** $7 per course  
**ACTUAL PRICING (from main repo):**

| Tier | Price | What You Get |
|------|-------|--------------|
| **Free** | $0 | 1 course, 5 AI prompts lifetime |
| **Per-Course** | **$3.99** | Course forever + 10 prompts/day |
| **Unlimited** | **$7.99/mo** | Unlimited courses, 50 prompts/day |
| **Pro** | **$14.99/mo** | Everything + 200 prompts + certificates |

**All research docs updated to reflect $3.99 pricing.**

---

### 3. Domain
**Domain:** adaptivecourses.ai (already purchased)  
**Status:** Live at https://adaptivecourses.ai

---

### 4. Monorepo Structure (Already Set Up!)
**Structure:**
```
adaptive-courses/
├── apps/
│   └── web/           ← Next.js app (moved from app/)
├── packages/
│   └── api-client/    ← Shared code
├── docs/
│   └── research/      ← NEW: Market research (added today)
├── marketing/
│   ├── product-hunt/  ← NEW: PH launch materials
│   └── REDDIT-STRATEGY.md ← NEW: 57M+ reach plan
└── ...
```

**Monorepo already live:** Claude Code set it up while I was working on research.

---

## 📚 New Documents Created Today

### Legal (UAE-specific)
- `apps/web/legal/UAE-BUSINESS-SETUP.md` - Complete UAE setup guide
- `apps/web/legal/TERMS-OF-SERVICE-UAE.md` - UAE jurisdiction ToS
- `apps/web/legal/PRIVACY-POLICY-UAE.md` - GDPR + UAE privacy

### Marketing
- `marketing/REDDIT-STRATEGY.md` - 27 subreddits (57M+ reach), posting templates
- `marketing/product-hunt/LAUNCH-CHECKLIST.md` - Hour-by-hour PH launch
- `marketing/product-hunt/OUTREACH-TEMPLATES.md` - 13 DM templates

### Research (in docs/research/)
- `COMPETITIVE-ANALYSIS.md` - Coursera, Udemy, Skillshare analysis
- `CUSTOMER-PAIN-POINTS.md` - Reddit/Twitter complaints, exact language
- `SEO-STRATEGY.md` - Keywords, blog ideas, content calendar
- `PRICING-STRATEGY.md` - Updated to $3.99, unit economics
- `POSITIONING.md` - Professional + casual positioning
- `ROADMAP.md` - v1-v4 features, Pro tier strategy
- `METRICS.md` - KPIs, analytics setup (PostHog recommended)
- `MOBILE-APP-COSTS.md` - PWA vs React Native analysis
- `APPLE-GOOGLE-DEV-COSTS.md` - Real costs ($124) + pain points

---

## 🎯 Reddit Marketing Strategy (NEW)

### Target Communities (57M+ Total Reach)

**Tier 1: Mega (10M+)**
- r/InternetIsBeautiful (17M)
- r/Entrepreneur (4.8M)
- r/productivity (4M)

**Tier 2: Business (2-4M)**
- r/business (2.5M)
- r/smallbusiness (2.2M)
- r/startups (2.0M)

**Tier 3-6: Niche (11K-1M)**
- r/SideProject (430K)
- r/indiehackers (91K)
- r/buildinpublic (55K)
- ...and 24 more (see REDDIT-STRATEGY.md)

**Posting Strategy:**
- 1-2 posts per day (not spam)
- Different angles per community (professional, casual, builder)
- Engage with EVERY comment
- Track conversions with UTM params

**Expected Results:**
- 2,000+ site visits (Week 1 from Reddit)
- 50+ signups
- 10+ paid conversions

**Details:** See `marketing/REDDIT-STRATEGY.md`

---

## 🏗️ What's Already Built (from main repo)

**Web app (apps/web/):**
- ✅ Next.js 16 + React 19 + Tailwind 4
- ✅ Claude Sonnet 4.5 integration
- ✅ Supabase (database, auth)
- ✅ Stripe payments
- ✅ Pre-generated sample courses
- ✅ Mobile-responsive
- ✅ PWA-ready

**Pricing implemented:**
- ✅ Free tier (1 course, 5 prompts)
- ✅ $3.99 per course
- ✅ $7.99/mo unlimited
- ✅ $14.99/mo pro

**Latest commits show:**
- Schema price fixed to $3.99
- Pre-generated sample course added
- Tailwind v4 build fixed on Vercel
- Claude Code skills added (.claude/skills/)

---

## ⚠️ Action Items (Immediate)

### Legal/Business
- [ ] **Choose UAE free zone** (DMCC or Dubai Silicon Oasis)
- [ ] **Get quote** from free zone (exact costs, timeline)
- [ ] **Budget** $10-15K for Year 1 setup
- [ ] **Update live site** Terms/Privacy to UAE entity (once registered)

### Marketing
- [ ] **Launch Reddit** campaign (start with r/InternetIsBeautiful)
- [ ] **Prepare Product Hunt** launch (assets, outreach list)
- [ ] **Set up analytics** (PostHog or Plausible)
- [ ] **Track conversions** from Reddit (UTM params)

### Product
- [ ] **Mobile app** (React Native/Expo) - monorepo structure ready
- [ ] **Certificates** - implement based on ROADMAP.md
- [ ] **SEO content** - 10 blog posts from SEO-STRATEGY.md

---

## 📊 Current Metrics Baseline

**Track these (see METRICS.md):**
- Daily revenue
- Conversion rate (visit → paid)
- Course completion rate (target: 80%+)
- Return rate (buy 2nd course: target 30%+)
- Traffic sources (Reddit, PH, organic)

**Tools:**
- Vercel Analytics (current)
- PostHog (recommended for deeper analytics)
- Stripe Dashboard (revenue)

---

## 🚀 Next 30 Days Roadmap

### Week 1 (Current)
- [x] Complete market research ✅
- [x] UAE business setup guide ✅
- [x] Reddit marketing strategy ✅
- [ ] Launch Reddit posts (1-2 per day)
- [ ] UAE free zone registration

### Week 2
- [ ] Product Hunt launch
- [ ] 10 Reddit posts (different communities)
- [ ] UAE company setup (if fast-tracked)
- [ ] First blog post (SEO)

### Week 3
- [ ] Mobile app (React Native setup)
- [ ] Implement certificates
- [ ] 5 more blog posts
- [ ] Track Reddit conversions

### Week 4
- [ ] UAE bank account (if company registered)
- [ ] Update live Terms/Privacy to UAE
- [ ] Mobile app beta (TestFlight/APK)
- [ ] Review metrics, iterate

---

## 💰 Unit Economics (Updated to $3.99)

**Per $3.99 course:**
- Revenue: $3.99
- Claude API cost: ~$0.50
- Stripe fee (2.9% + $0.30): ~$0.42
- **Gross profit: $3.07 (~77% margin)**

**Break-even:**
- Fixed costs: ~$1,000/mo (Supabase, Vercel, licenses)
- Break-even: ~326 courses/month
- OR ~41 Unlimited subs ($7.99/mo)

**Target (Month 1):**
- 100 paid courses = $399 revenue
- 20 Unlimited subs = $160/mo recurring
- **Total: ~$560 Month 1**

---

## 🔄 Cross-Communication: Clawd ↔ Claude Code

**What Clawd (me) did:**
- ✅ Market research (competitors, SEO, customers)
- ✅ Reddit strategy (27 communities, templates)
- ✅ Product Hunt launch plan
- ✅ UAE legal docs
- ✅ Pricing updated ($3.99)
- ✅ Roadmap (v1-v4)

**What Claude Code did (based on git log):**
- ✅ Monorepo setup (apps/web + packages/api-client)
- ✅ Price schema fixed to $3.99
- ✅ Pre-generated sample courses
- ✅ Tailwind v4 build fixes
- ✅ Claude Code skills added

**Both committed to same repo → all synced!**

---

## 📁 File Locations Quick Reference

```
adaptive-courses/
├── apps/web/legal/
│   ├── UAE-BUSINESS-SETUP.md        ← UAE setup guide
│   ├── TERMS-OF-SERVICE-UAE.md      ← New ToS (UAE)
│   └── PRIVACY-POLICY-UAE.md        ← New Privacy (GDPR + UAE)
├── docs/research/
│   ├── COMPETITIVE-ANALYSIS.md      ← Market research
│   ├── CUSTOMER-PAIN-POINTS.md      ← Reddit/Twitter research
│   ├── SEO-STRATEGY.md              ← Keywords, content
│   ├── PRICING-STRATEGY.md          ← $3.99 rationale
│   ├── POSITIONING.md               ← Product positioning
│   ├── ROADMAP.md                   ← v1-v4 features
│   ├── METRICS.md                   ← KPIs, analytics
│   └── MOBILE-APP-COSTS.md          ← PWA vs native
├── marketing/
│   ├── REDDIT-STRATEGY.md           ← 27 subreddits plan
│   └── product-hunt/
│       ├── LAUNCH-CHECKLIST.md      ← PH launch guide
│       └── OUTREACH-TEMPLATES.md    ← 13 DM templates
└── UPDATED-CONTEXT.md               ← This file
```

---

## ✅ Summary

**What's different now:**
1. **UAE setup** (not US) - 0% personal income tax, Golden Visa benefits
2. **Pricing: $3.99** per course (not $7) + $7.99/$14.99 monthly tiers
3. **Domain: adaptivecourses.ai** (purchased, live)
4. **Monorepo structure** (already set up by Claude Code)
5. **Reddit strategy** (57M+ reach, 27 communities, templates ready)
6. **Legal docs** (UAE Terms, Privacy, business setup guide)

**What to do next:**
- Launch Reddit marketing (1-2 posts/day)
- Register UAE free zone company ($10-15K Year 1)
- Track metrics (PostHog, conversions)
- Build mobile app (monorepo ready)

**All docs committed to GitHub.** Claude Code + Clawd both up to date. 🚀
