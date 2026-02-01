# Adaptive Courses Business Model

## Pricing Tiers

### Free Tier
- **Cost**: $0
- **What you get**:
  - 1 free course (first course ever)
  - Full course content, forever yours
  - 5 AI prompts total (lifetime, not per day)
  - No PDF export
  - No email delivery
- **Purpose**: Get users hooked, reduce friction to first value

### Per-Course ($3.99)
- **Cost**: $3.99 per course
- **What you get**:
  - Course is yours forever (even if you later subscribe and cancel)
  - 10 AI prompts/day on that course's topic
  - PDF export included
  - Email delivery included
- **Purpose**: Low commitment, fair exchange of value

### Unlimited ($7.99/mo)
- **Cost**: $7.99/month (or $79/year = 2 months free)
- **What you get**:
  - Unlimited course generation
  - 50 AI prompts/day (global, across all courses)
  - Priority generation (faster API)
  - PDF export + email delivery
  - Early access to new features
  - All courses generated remain yours if you cancel
- **Purpose**: Regular learners, hobbyists

### Pro ($14.99/mo)
- **Cost**: $14.99/month (or $149/year = 2 months free)
- **What you get**:
  - Everything in Unlimited, plus:
  - 200 AI prompts/day (effectively unlimited for most users)
  - Advanced AI features (deeper explanations, custom learning paths)
  - Priority support
  - Course certificates (AI-personalized, verifiable)
  - API access for integrations (future)
- **Purpose**: Power users, educators, lifelong learners, professionals

---

## Feature Matrix

| Feature                    | Free | Per-Course | Unlimited | Pro |
|----------------------------|------|------------|-----------|-----|
| Course generation          | 1    | Per purchase | Unlimited | Unlimited |
| Course ownership           | Forever | Forever | Forever | Forever |
| AI prompts                 | 5 total | 10/day/course | 50/day | 200/day |
| PDF export                 | No   | Yes        | Yes       | Yes |
| Email delivery             | No   | Yes        | Yes       | Yes |
| Priority generation        | No   | No         | Yes       | Yes |
| Early access features      | No   | No         | Yes       | Yes |
| Certificates               | No   | No         | No        | Yes |
| Priority support           | No   | No         | No        | Yes |

---

## Financial Projections

### Assumptions
- Monthly visitors: 10,000 (starting)
- Free trial conversion: 15% (1,500 users try first course)
- Per-course purchase rate: 8% of free users (120/month)
- Subscription conversion: 3% of free users (45/month)
- Churn rate (subscription): 5%/month
- Average per-course purchases per user: 2.5 courses before upgrading

### Unit Economics

**Per-Course Customer**
```
Revenue per course: $3.99
Claude API cost per course: ~$0.15 (outline) + ~$0.80 (full) = $0.95
Stripe fees: $0.42 (2.9% + $0.30)
Gross margin: $3.99 - $0.95 - $0.42 = $2.62 (65.7%)
```

**Unlimited Subscriber ($7.99/mo)**
```
Revenue per month: $7.99
Assumed courses generated: 3/month
Claude API cost: 3 × $0.95 = $2.85
AI chat cost: ~$0.50/month (assuming 50 prompts)
Stripe fees: $0.53
Gross margin: $7.99 - $2.85 - $0.50 - $0.53 = $4.11 (51.4%)
```

**Pro Subscriber ($14.99/mo)**
```
Revenue per month: $14.99
Assumed courses generated: 5/month
Claude API cost: 5 × $0.95 = $4.75
AI chat cost: ~$1.50/month (assuming 150 prompts)
Stripe fees: $0.73
Gross margin: $14.99 - $4.75 - $1.50 - $0.73 = $8.01 (53.4%)
```

**Annual Unlimited ($79/year)**
```
Revenue: $79
API costs (12 months): ~$40
Stripe: $2.59
Gross margin: $79 - $40 - $2.59 = $36.41 (46.1%)
But: 0% churn for 12 months = way better LTV
```

**Annual Pro ($149/year)**
```
Revenue: $149
API costs (12 months): ~$75
Stripe: $4.62
Gross margin: $149 - $75 - $4.62 = $69.38 (46.6%)
Plus: certificate generation adds stickiness
```

### Revenue Model (Month 1-12)

```
Month 1:
  - Free users: 1,500
  - Per-course purchases: 120 × $3.99 = $478.80
  - New Unlimited subs: 35 × $7.99 = $279.65
  - New Pro subs: 10 × $14.99 = $149.90
  - Total MRR: $908.35

Month 3:
  - Free users cumulative: 4,500
  - Per-course: 360 purchases = $1,436.40
  - Unlimited subs: 105 - churn(5) = 100 active = $799.00
  - Pro subs: 30 - churn(2) = 28 active = $419.72
  - Total MRR: $2,655.12

Month 6:
  - Per-course: 720 purchases = $2,872.80
  - Unlimited subs: 210 - churn(21) = 189 active = $1,510.11
  - Pro subs: 60 - churn(6) = 54 active = $809.46
  - Total MRR: $5,192.37

Month 12:
  - Per-course: 1,440 purchases = $5,745.60
  - Unlimited subs: 420 - churn(63) = 357 active = $2,852.43
  - Pro subs: 120 - churn(18) = 102 active = $1,528.98
  - Annual conversions (~20%): Unlimited 71 × $79 + Pro 20 × $149 = $8,589
  - Total MRR: $10,126.01 + annuals amortized
```

### The Upgrade Funnel Math

**Key insight**: Per-course users who buy 3+ courses should upgrade.

At 3 courses/month:
- Per-course cost: $11.97
- Subscription cost: $9.99
- Savings: $1.98/month

**Trigger point**: After 2nd course purchase, show upgrade prompt:
> "You've spent $7.98 on courses this month. For $9.99, get unlimited courses + AI chat. [Upgrade]"

**Expected conversion**:
- 25% of 2+ course buyers upgrade = ~30 new subs/month
- This adds ~$300/month MRR from upsells alone

### Cost Structure

**Fixed Costs (Monthly)**
- Vercel Pro: $20
- Domain: ~$1 (amortized)
- Monitoring (Sentry/etc): $0 (free tier)
- Total fixed: ~$21/month

**Variable Costs**
- Claude API: ~$0.95/course
- Stripe: 2.9% + $0.30
- Resend (email): $0 first 3k/month

**Break-even**: ~8 courses sold covers fixed costs

### Lifetime Value (LTV) Analysis

**Per-Course User**
```
Average purchases before churn: 2.5
LTV = 2.5 × $2.62 = $6.55
```

**Monthly Subscriber**
```
Average lifespan: 1 / 0.05 = 20 months
LTV = 20 × $6.05 = $121
```

**Annual Subscriber**
```
Renewal rate: 60%
LTV = $55.83 + (0.6 × $55.83) + (0.36 × $55.83) = $109.42
But guaranteed 12 months vs monthly churn risk
```

### Customer Acquisition

**Target CAC**: < $10 for per-course, < $30 for subscription

**Channels**:
1. Organic/SEO (free courses as lead magnets)
2. Twitter/X (topic threads → course link)
3. Product Hunt launch
4. Reddit (r/learnprogramming, r/productivity, etc.)
5. Word of mouth (referral program: give $2, get $2)

---

## Database Schema (Stubbed)

```typescript
// Users
interface User {
  id: string;
  email: string;
  plan: 'free' | 'per_course' | 'unlimited';
  stripeCustomerId?: string;
  subscriptionId?: string;
  subscriptionStatus?: 'active' | 'canceled' | 'past_due';
  createdAt: Date;
}

// Courses (owned by user)
interface OwnedCourse {
  id: string;
  userId: string;
  courseId: string;
  purchaseType: 'free' | 'purchased' | 'subscription';
  purchasedAt: Date;
  aiPromptsUsedToday: number;
  aiPromptsLastReset: Date;
}

// AI Usage Tracking
interface AIUsage {
  userId: string;
  courseId: string;
  promptsToday: number;
  promptsAllTime: number;
  lastPromptAt: Date;
}

// Subscriptions
interface Subscription {
  id: string;
  userId: string;
  stripeSubscriptionId: string;
  plan: 'monthly' | 'annual';
  status: 'active' | 'canceled' | 'past_due';
  currentPeriodEnd: Date;
  cancelAtPeriodEnd: boolean;
}
```

---

## Implementation Priority

### Phase 1: Auth + Basic Payments (Current)
- [x] Stripe checkout for per-course
- [ ] User accounts (email/password or OAuth)
- [ ] Course ownership tracking
- [ ] Library page (your courses)

### Phase 2: Subscription Tier
- [ ] Stripe subscription products
- [ ] Subscription status middleware
- [ ] Unlimited course generation for subs
- [ ] Cancel/reactivate flow

### Phase 3: AI Chat + Limits
- [ ] AI chat interface in course viewer
- [ ] Prompt counting + daily reset
- [ ] Upgrade prompts when hitting limits
- [ ] Usage analytics

### Phase 4: Upsell Optimization
- [ ] Smart upgrade prompts (after 2nd purchase)
- [ ] Annual plan discount
- [ ] Referral program
- [ ] Win-back emails for churned subs

### Phase 5: Certification System (Pro Feature)
- [ ] AI-generated certificates based on course completion
- [ ] Unique certificate ID with verification URL
- [ ] Certificate content customized to actual learning:
  - Topic mastery demonstrated
  - Quiz scores achieved
  - AI chat topics explored
  - Time invested
- [ ] Public verification page (anyone can verify)
- [ ] LinkedIn/social sharing integration
- [ ] Certificate PDF download with QR code
- [ ] "New wave of certifications" - legitimacy through AI-verified learning

---

## Key Metrics to Track

1. **Activation Rate**: % of visitors who complete first course
2. **Purchase Conversion**: % of free users who buy
3. **Upgrade Rate**: % of per-course users who go unlimited
4. **Prompt Usage**: How many AI prompts per user/course
5. **Churn Rate**: Monthly subscription cancellations
6. **NRR (Net Revenue Retention)**: Expansion - Churn

---

## Notes

- "You paid for it, you keep it forever" is the core trust principle
- Daily prompt reset at midnight UTC (simple, predictable)
- Show prompt count in UI: "8/10 prompts today"
- When limit hit: soft gate with upgrade CTA, not hard block
- Consider: "Buy 3 more prompts for $0.99" as micro-transaction

## Account & Auth Flow

- **No account**: See redacted/preview version of course (Module 1 only)
- **Free account**: Email verification required (OTP or magic link)
- **One free course per account**: First course is full access, forever
- **90-day inactive policy**: Warn at 75 days, deactivate at 90, offer free course to re-engage
- **Device fingerprinting**: Light tracking to prevent abuse of free tier
- **Disposable email blocking**: Block known temporary email domains

## Two Subscription Tiers

| Tier | Price | AI Prompts | Key Features |
|------|-------|------------|--------------|
| Unlimited | $7.99/mo ($79/yr) | 50/day | Unlimited courses, priority gen |
| Pro | $14.99/mo ($149/yr) | 200/day | + Certificates, priority support |

---

*Last updated: 2026-02-01*
