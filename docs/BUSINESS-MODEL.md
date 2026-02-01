# Adaptive Courses Business Model

*Last updated: 2026-02-01*

## Pricing Philosophy

Simple, honest pricing. Three tiers. No tricks.

| Tier | Price | Target User |
|------|-------|-------------|
| **Free** | $0 | Try before you buy |
| **Per-Course** | $3.99 | Casual learners |
| **Unlimited** | $7.99/mo | Regular learners |

---

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
- **Purpose**: Regular learners, hobbyists, power users

---

## Feature Matrix

| Feature                    | Free | Per-Course | Unlimited |
|----------------------------|------|------------|-----------|
| Course generation          | 1    | Per purchase | Unlimited |
| Course ownership           | Forever | Forever | Forever |
| AI prompts                 | 5 total | 10/day/course | 50/day |
| PDF export                 | No   | Yes        | Yes       |
| Email delivery             | No   | Yes        | Yes       |
| Priority generation        | No   | No         | Yes       |
| Early access features      | No   | No         | Yes       |

---

## Competitive Positioning

| Platform | Model | Price | Our Advantage |
|----------|-------|-------|---------------|
| Skillshare | Subscription | $29-32/mo | **75% cheaper** |
| MasterClass | Annual only | $120-240/yr | Monthly flexibility |
| Udemy | Per-course | $20-200 each | **5-50x cheaper** |
| Coursera | Subscription | $59/mo | **87% cheaper** |

We slot in at a price point that doesn't exist: **impulse-buy territory for learning.**

---

## Financial Projections

### Unit Economics

**Per-Course Customer ($3.99)**
```
Revenue per course:         $3.99
Claude API (Haiku+Sonnet):  $0.34
Stripe fees:                $0.42
─────────────────────────────────
Gross margin:               $3.23 (81%)
```

**Unlimited Subscriber ($7.99/mo)**
```
Revenue per month:          $7.99
3 courses × $0.34:          $1.02
AI chat (Haiku, 50/day):    $0.70
Stripe fees:                $0.53
─────────────────────────────────
Gross margin:               $5.74 (72%)
```

**Annual Unlimited ($79/year)**
```
Revenue:                    $79.00
12 months API costs:        ~$20.64
Stripe:                     $2.59
─────────────────────────────────
Gross margin:               $55.77 (71%)
Plus: 0% churn for 12 months
```

### Revenue Model (Month 1-12)

```
Month 1:
  - Free users: 1,500
  - Per-course purchases: 120 × $3.99 = $478.80
  - New Unlimited subs: 45 × $7.99 = $359.55
  - Total MRR: $838.35

Month 6:
  - Per-course: 720 purchases = $2,872.80
  - Unlimited subs: 270 - churn(27) = 243 active = $1,941.57
  - Total MRR: $4,814.37

Month 12:
  - Per-course: 1,440 purchases = $5,745.60
  - Unlimited subs: 540 - churn(81) = 459 active = $3,667.41
  - Annual conversions (~20%): 92 × $79 = $7,268
  - Total MRR: $9,413.01 + annuals amortized
```

### The Upgrade Funnel

**Key insight**: Per-course users who buy 3+ courses should upgrade.

At 3 courses/month:
- Per-course cost: $11.97
- Subscription cost: $7.99
- Savings: $3.98/month

**Trigger point**: After 2nd course purchase, show upgrade prompt:
> "You've spent $7.98 on courses this month. For $7.99, get unlimited courses + AI chat. [Upgrade]"

---

## Cost Structure

### Fixed Costs (Monthly)
| Service | Cost |
|---------|------|
| Vercel Pro | $20 |
| Supabase Pro | $25 |
| Domain | ~$1 |
| **Total** | **$46/month** |

### Variable Costs
| Item | Cost |
|------|------|
| Course generation | ~$0.34/course |
| AI chat (Haiku) | ~$0.025/10 prompts |
| Stripe | 2.9% + $0.30 |
| Resend | $0 (first 3k/month) |

### Break-Even
- Per-course only: **15 courses/month**
- Unlimited subs only: **9 subscribers/month**
- Mixed: 5 courses + 4 subs = break-even

---

## Customer Acquisition

**Target CAC**: < $10 for per-course, < $25 for subscription

**Channels**:
1. Organic/SEO (free courses as lead magnets)
2. Twitter/X (topic threads → course link)
3. Product Hunt launch
4. Reddit (r/learnprogramming, r/productivity, etc.)
5. Word of mouth (referral program: give $2, get $2)

---

## Lifetime Value (LTV) Analysis

| Customer Type | LTV | Calculation |
|---------------|-----|-------------|
| Per-Course | $8.08 | 2.5 courses avg × $3.23 margin |
| Monthly Sub | $114.80 | 20 months avg × $5.74 margin |
| Annual Sub | $111.54 | $55.77 + 60% renewal × $55.77 |

---

## Database Schema

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
- [ ] User accounts (email verification)
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

### Phase 4: Growth
- [ ] Smart upgrade prompts (after 2nd purchase)
- [ ] Annual plan discount
- [ ] Referral program
- [ ] Win-back emails for churned subs

---

## Key Metrics to Track

1. **Activation Rate**: % of visitors who complete first course
2. **Purchase Conversion**: % of free users who buy
3. **Upgrade Rate**: % of per-course users who go unlimited
4. **Prompt Usage**: How many AI prompts per user/course
5. **Churn Rate**: Monthly subscription cancellations
6. **NRR (Net Revenue Retention)**: Expansion - Churn

---

## Core Principles

1. **"You paid for it, you keep it forever"** - Trust differentiator
2. **Daily prompt reset at midnight UTC** - Simple, predictable
3. **Show prompt count in UI** - "8/10 prompts today"
4. **Soft gates, not hard blocks** - Upgrade CTA when limit hit
5. **No hidden fees** - What you see is what you pay

---

## Account & Auth Flow

- **No account**: See redacted/preview version (Module 1 only)
- **Free account**: Email verification required (OTP or magic link)
- **One free course per account**: First course is full access, forever
- **90-day inactive policy**: Warn at 75 days, deactivate at 90
- **Device fingerprinting**: Light tracking to prevent free tier abuse
