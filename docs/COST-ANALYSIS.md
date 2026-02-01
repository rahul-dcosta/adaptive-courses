# Adaptive Courses Cost Analysis

*Last updated: 2026-02-01*

## AI Model Pricing Comparison (per Million Tokens)

| Model | Input | Output | Best For |
|-------|-------|--------|----------|
| **Claude Haiku 3** | $0.25 | $1.25 | Cheap testing, simple tasks |
| **Claude Haiku 4.5** | $1.00 | $5.00 | Fast, good quality |
| **Claude Sonnet 4.5** | $3.00 | $15.00 | Balanced quality/cost |
| **Claude Opus 4.5** | $5.00 | $25.00 | Maximum quality |
| **GPT-4o** | $2.50 | $10.00 | OpenAI alternative |
| **GPT-4o Mini** | $0.15 | $0.60 | Cheapest viable option |

---

## Course Generation Cost Per Model

Assuming a typical course generation uses:
- **Outline**: ~2K input, ~1.5K output tokens
- **Full course**: ~4K input, ~15K output tokens
- **Total**: ~6K input, ~16.5K output tokens

| Model | Outline Cost | Full Course Cost | Total | Margin @ $3.99 |
|-------|--------------|------------------|-------|----------------|
| **Haiku 3** | $0.003 | $0.03 | **$0.03** | 99.2% |
| **Haiku 4.5** | $0.01 | $0.10 | **$0.11** | 97.2% |
| **Sonnet 4.5** | $0.04 | $0.33 | **$0.37** | 90.7% |
| **Opus 4.5** | $0.05 | $0.54 | **$0.59** | 85.2% |
| **GPT-4o** | $0.03 | $0.22 | **$0.25** | 93.7% |
| **GPT-4o Mini** | $0.002 | $0.01 | **$0.01** | 99.7% |

---

## AI Chat Cost (per prompt session)

Assuming ~500 input + 800 output tokens per prompt exchange:

| Model | Cost per 10 prompts | 50 prompts/day (Pro) |
|-------|---------------------|----------------------|
| **Haiku 3** | $0.01 | $0.05 |
| **Haiku 4.5** | $0.05 | $0.25 |
| **Sonnet 4.5** | $0.14 | $0.70 |
| **Opus 4.5** | $0.23 | $1.15 |
| **GPT-4o Mini** | $0.006 | $0.03 |

---

## Recommended Model Strategy

```
┌─────────────────────────────────────────────────────────┐
│  COURSE GENERATION                                      │
│  ════════════════                                       │
│  Outline preview → Haiku 4.5 (fast, cheap, good enough)│
│  Full course     → Sonnet 4.5 (quality matters here)   │
│                                                         │
│  Cost: $0.01 (outline) + $0.33 (full) = $0.34/course   │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│  AI CHAT                                                │
│  ═══════                                                │
│  Free users        → 5 prompts lifetime (Haiku 4.5)    │
│  Per-course users  → 10 prompts/day/course (Haiku 4.5) │
│  Pro users         → 50 prompts/day global (Haiku 4.5) │
│                                                         │
│  Alternative: GPT-4o Mini for chat (93% cheaper)       │
└─────────────────────────────────────────────────────────┘
```

**Key insight**: Using Sonnet for Pro chat is unprofitable at 50 prompts/day ($21/mo cost vs $9.99 revenue). Use Haiku or GPT-4o Mini instead.

---

## Revised Unit Economics with Model Strategy

### Per-Course ($3.99)
```
Revenue:                    $3.99
Course gen (Haiku+Sonnet):  $0.34
AI chat (5 prompts, Haiku): $0.03
Stripe fees:                $0.42
────────────────────────────────
Gross profit:               $3.20 (80.2% margin)
```

### Pro Subscriber ($9.99/mo)
```
Revenue:                    $9.99
3 courses (Haiku+Sonnet):   $1.02
AI chat (Haiku, 50/day):    $0.70/mo
Stripe fees:                $0.59
────────────────────────────────
Gross profit:               $7.68 (76.9% margin)
```

---

## The Model Arbitrage Opportunity

Using **GPT-4o Mini for AI chat** instead of Claude Haiku:

| Tier | Claude Haiku Chat | GPT-4o Mini Chat | Savings |
|------|-------------------|------------------|---------|
| Pro (50/day) | $0.70/mo | $0.09/mo | 87% |

**Hybrid strategy recommendation:**
- **Claude Sonnet 4.5** for course generation (quality matters)
- **GPT-4o Mini** for chat (cost matters, quality acceptable)

---

## Infrastructure Costs

| Service | Free Tier | Paid Tier | When to Upgrade |
|---------|-----------|-----------|-----------------|
| **Vercel** | Hobby (free) | Pro $20/mo | >100 concurrent users |
| **Supabase** | 500MB, 50K MAUs | Pro $25/mo | >500MB or need uptime SLA |
| **Resend** | 3K emails/mo | Pro $20/mo | >100 emails/day |
| **Stripe** | 2.9% + $0.30 | Same | N/A (usage-based) |

### Monthly Infrastructure at Scale

| Stage | Users | Vercel | Supabase | Resend | Stripe | Total |
|-------|-------|--------|----------|--------|--------|-------|
| Launch | 0-500 | $0 | $0 | $0 | ~$50 | **$50** |
| Growth | 500-5K | $20 | $25 | $0 | ~$300 | **$345** |
| Scale | 5K-50K | $20 | $25 | $20 | ~$1,500 | **$1,565** |

---

## Total Cost Per Customer Type

| Customer | AI Costs | Infra (amortized) | Stripe | Total Cost | Revenue | Margin |
|----------|----------|-------------------|--------|------------|---------|--------|
| Free user | $0.34 | $0.02 | $0 | $0.36 | $0 | -$0.36 |
| Per-course | $0.37 | $0.02 | $0.42 | $0.81 | $3.99 | **79.7%** |
| Pro/mo | $1.72 | $0.05 | $0.59 | $2.36 | $9.99 | **76.4%** |
| Pro/yr | $20.64 | $0.60 | $3.17 | $24.41 | $99 | **75.3%** |

---

## Break-Even Analysis

| Fixed Costs | Amount |
|-------------|--------|
| Vercel Pro | $20 |
| Supabase Pro | $25 |
| Domain | $1 |
| **Total** | **$46/mo** |

**Break-even points:**
- Per-course only: 15 courses/month ($3.20 margin each)
- Pro subs only: 6 subscribers/month ($7.63 margin each)
- Mixed (realistic): 5 courses + 3 subs = break-even

---

## Competitive Pricing Context

| Platform | Model | Price | Our Advantage |
|----------|-------|-------|---------------|
| Skillshare | Subscription | $29-32/mo | We're **69% cheaper** at $9.99/mo |
| MasterClass | Annual only | $120-240/yr | We offer monthly flexibility at $99/yr |
| Udemy | Per-course | $20-200 each | We're **5-50x cheaper** at $3.99 |
| Coursera | Subscription | $59/mo | We're **83% cheaper** |

---

## Key Takeaways

1. **Use Haiku 4.5** for outline generation (fast, cheap)
2. **Use Sonnet 4.5** for full course generation (quality matters)
3. **Use Haiku 4.5 or GPT-4o Mini** for AI chat (NOT Sonnet—kills margins)
4. **Stay on free tiers** until 500+ users
5. **75%+ margins** achievable at all tiers with smart model selection
6. **Break-even** at ~15 courses or ~6 Pro subscribers per month

---

## Sources

- [Claude API Pricing](https://platform.claude.com/docs/en/about-claude/pricing)
- [OpenAI Pricing](https://openai.com/api/pricing/)
- [Vercel Pricing](https://vercel.com/pricing)
- [Supabase Pricing](https://supabase.com/pricing)
- [Resend Pricing](https://resend.com/pricing)
