# Metrics & Analytics Strategy - Adaptive Courses

## Key Performance Indicators (KPIs)

### North Star Metric
**Courses Generated & Completed**
- Why: Measures actual value delivered (not just traffic or signups)
- Target: 80%+ completion rate (vs. 15% for typical Udemy course)
- Tracks: Are people finishing what they start?

---

## Primary Metrics (Track Daily)

### 1. Revenue Metrics
- **Daily Revenue** - Total $ earned per day
- **Monthly Recurring Revenue (MRR)** - If/when subscription tier launches
- **Average Revenue Per User (ARPU)** - Total revenue / # customers
- **Customer Acquisition Cost (CAC)** - Marketing spend / # customers acquired
- **Lifetime Value (LTV)** - Average customer spend over lifetime
- **LTV:CAC Ratio** - Target: 3:1 or better

**Tracking:**
- Stripe dashboard (revenue, transactions)
- Custom DB query (ARPU, LTV)

---

### 2. Conversion Funnel
**Landing Page → Trial/View → Purchase → Complete**

| Stage | Metric | Target |
|-------|--------|--------|
| **Landing** | Unique visitors | Track baseline |
| **Intent** | "Generate Course" clicks | 20-30% of visitors |
| **Trial** | Free preview/sample generated | 50% of intent |
| **Purchase** | Paid course purchase | 10-15% of trials |
| **Complete** | Course finished | 80%+ of purchases |

**Why This Funnel:**
- Standard funnel: visit → sign up → purchase → use
- Our funnel: visit → try → buy → complete (lower friction)

**Tracking:**
- Plausible/PostHog custom events
- Conversion rate = purchases / visitors
- Drop-off points = identify where people leave

---

### 3. User Engagement
- **Time to Complete Course** - Avg. time from purchase to finish (target: <2 hours)
- **Completion Rate** - % of purchased courses finished (target: 80%+)
- **Return Rate** - % of customers who buy 2+ courses (target: 30%+)
- **Flashcard Usage** - % of users who review flashcards (engagement signal)
- **PDF Downloads** - % who download course PDF (completion intent)

**Tracking:**
- Custom events in PostHog
- User session tracking

---

### 4. Traffic Sources
- **Organic Search** - Google (SEO effectiveness)
- **Direct** - Brand awareness, return visitors
- **Social** - Twitter, LinkedIn, Reddit
- **Referral** - Word of mouth, affiliate links
- **Product Hunt** - Launch spike tracking
- **Paid** - If/when running ads

**Why Track Sources:**
- Identify what's working (double down)
- Calculate CAC per channel
- Prioritize marketing efforts

**Tracking:**
- Plausible (privacy-friendly, shows sources)
- UTM parameters for campaigns

---

### 5. Product Quality
- **Customer Satisfaction (CSAT)** - "Did this course help you?" (Yes/No)
- **Net Promoter Score (NPS)** - "Would you recommend this?" (0-10 scale)
- **Course Ratings** - 1-5 stars per course
- **Refund Rate** - % of purchases refunded (target: <5%)

**Tracking:**
- Post-purchase email survey
- In-app rating prompt after completion
- Stripe refund data

---

## Secondary Metrics (Track Weekly/Monthly)

### Content Performance
- **Top Requested Topics** - What courses are people generating?
- **Search Queries** - What are people searching for on landing page?
- **Failed Generations** - Topics AI couldn't handle well
- **Avg. Course Length** - Generated content size (too long = problem)

### Customer Insights
- **Use Cases** - Why did they need the course? (job interview, meeting, presentation)
- **Urgency Level** - "I need this tomorrow" vs. "just curious"
- **Time to Purchase** - Visit → buy (impulse vs. deliberate)

### Growth Indicators
- **Email Signups** - Newsletter subscribers (future marketing)
- **Social Followers** - Twitter, LinkedIn growth
- **Waitlist** - For pro tier or new features
- **Press Mentions** - Media coverage count

---

## Analytics Tools Comparison

### Option 1: Plausible (Recommended for MVP)
**Pros:**
- Privacy-friendly (no cookie banner needed)
- Simple, clean UI
- Lightweight script (< 1KB)
- Easy custom events
- Great for indie hackers

**Cons:**
- Less detailed than PostHog
- No session replay
- No funnels (manual calculation)

**Pricing:**
- $9/month (up to 10K visitors)
- $19/month (up to 100K visitors)

**Best for:** Privacy-conscious, simple setup, low traffic MVP

---

### Option 2: PostHog (Recommended for Scale)
**Pros:**
- Open-source (self-host or cloud)
- Session replay (see user behavior)
- Feature flags (A/B testing)
- Funnel analysis built-in
- Heatmaps, cohorts, retention tracking
- Generous free tier

**Cons:**
- More complex setup
- Heavier script (impacts page load)
- Can get expensive at scale

**Pricing:**
- Free tier: 1M events/month
- $0.00031 per event after (scales with usage)

**Best for:** Growth stage, deep product analytics, A/B testing

---

### Option 3: Vercel Analytics (Easiest Setup)
**Pros:**
- Built into Vercel (1-click enable)
- Web Vitals tracking (performance)
- Simple, privacy-friendly
- No extra script to load

**Cons:**
- Very basic (just traffic + performance)
- No custom events
- No user-level tracking

**Pricing:**
- Free tier: 2,500 events/month
- Pro: $10/month (100K events)

**Best for:** Quick MVP launch, performance monitoring, minimal setup

---

## Recommended Setup (Phased Approach)

### Phase 1: MVP Launch (Week 1)
**Use:** Vercel Analytics + Stripe Dashboard
- **Why:** Minimal setup, focus on shipping
- **Track:** Traffic, revenue, basic conversions
- **Cost:** Free

### Phase 2: Post-Launch (Week 2-4)
**Add:** Plausible Analytics
- **Why:** Better traffic insights, custom events
- **Track:** Conversion funnel, traffic sources, engagement
- **Cost:** $9/month

### Phase 3: Growth (Month 2+)
**Upgrade to:** PostHog
- **Why:** Deep product analytics, session replay, funnels
- **Track:** User behavior, retention, feature usage, A/B tests
- **Cost:** Free tier initially, $50-200/month at scale

---

## Event Tracking Plan

### Critical Events to Track

**Landing Page:**
```javascript
// User visits landing page
trackEvent('page_view', { source: utm_source });

// User clicks "Generate Course" CTA
trackEvent('cta_click', { location: 'hero' });

// User scrolls to pricing
trackEvent('pricing_view');
```

**Course Generation:**
```javascript
// User enters topic
trackEvent('topic_entered', { topic: 'supply chain' });

// Generation starts
trackEvent('generation_started', { topic, urgency_level });

// Generation completes
trackEvent('generation_completed', { 
  topic, 
  generation_time: '45s',
  course_length: '42min' 
});

// User previews free sample
trackEvent('sample_viewed', { topic });
```

**Purchase Flow:**
```javascript
// User clicks "Buy Course"
trackEvent('purchase_initiated', { topic, price: 7 });

// Stripe checkout opened
trackEvent('checkout_opened', { topic });

// Purchase successful
trackEvent('purchase_completed', { 
  topic, 
  price: 7,
  revenue: 7,
  customer_id: 'cus_123'
});
```

**Course Engagement:**
```javascript
// User starts course
trackEvent('course_started', { topic, course_id });

// Module completed
trackEvent('module_completed', { 
  topic, 
  module: '1-introduction',
  time_spent: '8min' 
});

// Flashcards reviewed
trackEvent('flashcards_reviewed', { topic, cards_count: 15 });

// PDF downloaded
trackEvent('pdf_downloaded', { topic });

// Course completed
trackEvent('course_completed', { 
  topic,
  completion_time: '52min',
  rating: 5 
});
```

**Retention:**
```javascript
// User returns to site
trackEvent('return_visit', { days_since_last: 3 });

// User generates 2nd course
trackEvent('repeat_purchase', { topic, purchase_count: 2 });
```

---

## Dashboard Views (What to Monitor)

### Daily Dashboard (Check Every Morning)
1. **Revenue:** Yesterday's $ earned
2. **New Customers:** # of first-time buyers
3. **Courses Generated:** # of completed generations
4. **Completion Rate:** % of courses finished
5. **Traffic:** Visitors + top sources

### Weekly Dashboard (Review Every Monday)
1. **Revenue Growth:** Week-over-week %
2. **Conversion Rate:** Visit → Purchase %
3. **Top Topics:** Most generated courses
4. **Customer Feedback:** Ratings + NPS
5. **Marketing Performance:** Which channels drove sales

### Monthly Dashboard (End of Month Review)
1. **MRR:** If subscription launched
2. **LTV:CAC:** Unit economics
3. **Retention:** % of customers who return
4. **Churn:** If subscription, % who cancel
5. **Product Roadmap:** What to build next based on data

---

## A/B Testing Plan (PostHog Feature Flags)

### Landing Page Tests
- **Headline:** "Learn [Topic] in 1 Hour" vs. "AI Crash Courses for Urgent Learning"
- **CTA:** "Generate Course" vs. "Start Learning" vs. "Get Prepared"
- **Pricing:** $3.99 vs. $10 (measure conversion + revenue)
- **Social Proof:** Testimonials vs. Stats (e.g., "500+ courses generated")

### Product Tests
- **Free Sample:** Show 1 module free vs. full preview
- **Pricing Display:** Show price upfront vs. after generation
- **Course Format:** Modules only vs. Modules + Flashcards + PDF

### Growth Tests
- **Referral CTA:** "Share with a friend" vs. "Refer & earn $5"
- **Email Capture:** Pre-generation email vs. post-generation
- **Upsell:** "Buy 3-pack" vs. single purchase only

---

## Success Benchmarks (90-Day Goals)

### Traffic Goals
- **Month 1:** 1,000 visitors (launch spike)
- **Month 2:** 2,000 visitors (SEO + content)
- **Month 3:** 5,000 visitors (organic growth)

### Revenue Goals
- **Month 1:** $1,000 (launch momentum)
- **Month 2:** $2,500 (steady growth)
- **Month 3:** $5,000 (product-market fit signal)

### Engagement Goals
- **Completion Rate:** 80%+ (vs. 15% industry avg)
- **Return Rate:** 30%+ buy 2nd course
- **NPS:** 50+ (strong product-market fit)

### Product Goals
- **Avg. Generation Time:** <60 seconds
- **Refund Rate:** <5%
- **Customer Support Load:** <10 tickets/week

---

## Red Flags to Watch For

### Metric Warnings
- **Completion Rate < 50%** - Courses too long or not valuable
- **Refund Rate > 10%** - Quality issue or mismatched expectations
- **Return Rate < 10%** - One-and-done product (not sticky)
- **Traffic but No Conversions** - Messaging mismatch or pricing problem
- **High Drop-Off at Checkout** - Friction in purchase flow

### User Behavior Warnings
- **High Bounce Rate (>70%)** - Landing page not compelling
- **Low Time on Page (<30s)** - Not reading content
- **Abandoned Generations** - Users start but don't finish generation

---

## Reporting Cadence

### Daily (Quick Check, 5 min)
- Revenue
- New customers
- Obvious bugs/errors

### Weekly (Deep Dive, 30 min)
- Conversion funnel
- Traffic sources
- Customer feedback
- Top topics

### Monthly (Strategy Review, 2 hours)
- Growth trends
- Unit economics
- Product roadmap priorities
- Marketing ROI

---

## Final Recommendation

**For MVP (First 30 Days):**
1. **Vercel Analytics** (free, built-in)
2. **Stripe Dashboard** (revenue tracking)
3. **Google Sheet** (manual tracking of key metrics)

**After Product-Market Fit Signal:**
1. **PostHog** (free tier → paid as you scale)
2. **Custom dashboard** (combine Stripe + PostHog data)
3. **Weekly email report** (automate with Zapier/n8n)

**Why Simple First:**
- Focus on shipping, not analytics setup
- Manually track 5-10 key metrics
- Add complexity only when it's needed

**Remember:** Metrics are tools, not goals. The goal is to help people learn fast. Track what helps you do that better. 🎯
