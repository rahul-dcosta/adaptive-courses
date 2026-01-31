# Pricing Experiments

**Current Price:** $5 per course  
**Hypothesis:** This is the optimal price point for MVP

---

## Experiment 1: The Baseline ($5)

**When:** Launch (Month 1)  
**Duration:** 2 weeks minimum  
**Goal:** Establish baseline conversion rate

**Metrics to Track:**
- Landing page → Email signup: Target 15%
- Email signup → Course start: Target 60%
- Course start → Payment: Target 20%
- Overall conversion: Target 2-3%

**Success Criteria:**
- 100+ courses sold
- Conversion rate >2%
- Refund rate <10%

**Decision Point:**
If we hit targets: Keep $5 for Month 1  
If we miss: Run Experiment 2

---

## Experiment 2: Price Anchoring ($7 with $5 "Launch Special")

**Hypothesis:** Showing $7 crossed out makes $5 feel like a deal

**Implementation:**
- Regular price: $7
- Launch special: $5 (save $2!)
- Deadline: "First 500 courses"

**Expected Impact:**
- Urgency increases conversion by 10-20%
- Higher anchor = $5 feels cheaper
- Can raise to $7 later without backlash

**Test Duration:** 1 week  
**Sample Size:** 500 visitors

---

## Experiment 3: Tiered Pricing

**Hypothesis:** Some users want more, will pay more

**Tiers:**
- **Basic:** $5 - Current offering
- **Plus:** $10 - Add PDF export + email delivery + priority generation
- **Pro:** $20 - Add voice narration + 3 revisions + phone support

**Expected Split:**
- Basic: 70%
- Plus: 25%
- Pro: 5%

**Impact:** Average revenue per user increases from $5 to $7.25 (+45%)

**Test Duration:** 2 weeks  
**Decision:** Keep if Plus+Pro = >20% of revenue

---

## Experiment 4: Bundle Pricing

**Hypothesis:** Power users want bulk discounts

**Bundles:**
- **Single:** $5/course
- **3-Pack:** $12 ($4/course, save $3)
- **10-Pack:** $35 ($3.50/course, save $15)

**Expected Impact:**
- Higher LTV per customer
- Upfront cash flow
- Locks in repeat purchases

**Test Duration:** 2 weeks  
**Decision:** Keep if 10%+ choose bundles

---

## Experiment 5: Free Trial (Limited)

**Hypothesis:** Let people preview the QUALITY, not just a sample

**Implementation:**
- First course: Free (no payment)
- Shows full course AFTER generating
- Must provide email
- Watermarked "Free Preview"
- CTA: "Remove watermark for $5"

**Expected Impact:**
- Lower barrier to entry
- More email signups
- Conversion happens after seeing quality

**Risk:** People game the system with multiple emails

**Mitigation:** IP-based limit (1 free per IP)

---

## Experiment 6: Pay What You Want (Risky)

**Hypothesis:** Transparency and trust increase average price

**Implementation:**
- Suggested: $5
- Minimum: $3
- Let users pay more if they want

**Expected Outcome:**
- 60% pay $3-5
- 35% pay exactly $5
- 5% pay $10+
- Average: ~$5.50

**Test Duration:** 1 week only (risky)  
**Decision:** Probably don't keep, but great PR

---

## Experiment 7: Dynamic Pricing

**Hypothesis:** Different topics have different willingness to pay

**Implementation:**
- Popular topics (manufacturing, supply chain): $7
- Niche topics: $5
- Super niche: $3
- Pricing shown after topic input

**Expected Impact:**
- Revenue optimization
- More courses on niche topics (lower barrier)

**Challenge:** Complex to explain  
**Test:** A/B test with 50/50 split

---

## Experiment 8: Subscription (Controversial)

**Hypothesis:** Power users want unlimited access

**Implementation:**
- Pay-per-course: $5 (stays)
- Unlimited: $20/month

**Target Customer:**
- Career switchers
- Consultants
- Students
- Corporate buyers

**Expected Split:**
- 90% pay-per-course
- 10% subscription
- Break-even: 4 courses/month

**Risk:** Complicates messaging  
**Decision:** Only if 5%+ of users generate >3 courses/month

---

## When to Test Each

**Month 1:** Baseline ($5)  
**Month 2:** Price anchoring ($7 → $5)  
**Month 3:** Bundles (3-pack, 10-pack)  
**Month 4:** Tiered pricing (Basic/Plus/Pro)  
**Month 5:** Dynamic pricing (topic-based)  
**Month 6:** Subscription (if data supports)

**Never test:** Pay-what-you-want (too risky)  
**Maybe test:** Free trial (if conversion is low)

---

## Test Framework

**For each experiment:**

1. **Hypothesis:** What do we think will happen?
2. **Metric:** What are we measuring?
3. **Sample size:** How many users needed? (min 100)
4. **Duration:** How long to run? (min 1 week)
5. **Success criteria:** What % change means success?
6. **Rollback plan:** If it fails, how do we revert?

**Statistical Significance:**
- Need 100+ conversions per variant
- Run until p-value <0.05
- Don't end early (let it cook)

---

## Pricing Psychology

### Anchoring
$10 crossed out → $5 = "Deal!"  
$5 alone = "Is this cheap or expensive?"

**Use:** Show original $7 price

### Decoy Effect
- Basic: $5
- Plus: $10 (most popular!)
- Pro: $20

Most pick Plus (middle option)

**Use:** If we add tiers

### Scarcity
"First 100 users get $3 launch price"

**Use:** Launch promotions only

### Social Proof
"500+ professionals already learning"

**Use:** On pricing page

---

## Price Elasticity Test

**Question:** How sensitive are users to price changes?

**Test:** A/B test $3 vs $5 vs $7

**Measure:**
- Conversion rate at each price
- Revenue at each price
- Optimal price = maximum revenue

**Hypothesis:** $5 is the sweet spot  
**But:** $7 with 20% lower conversion = more revenue

**Math:**
- $5 × 100 conversions = $500
- $7 × 80 conversions = $560 (better!)

---

## Refund Rate Impact

**Current:** 24-hour money-back guarantee

**Risk:** High refund rate kills revenue

**Acceptable:** <10% refunds  
**Concern:** >20% refunds  
**Crisis:** >30% refunds

**If high refunds:**
1. Improve course quality (better prompts)
2. Add sample preview (see before you buy)
3. Tighten refund window (24h → 1h?)
4. Better expectations ("emergency learning, not mastery")

---

## Corporate Pricing (Future)

**When:** After 1,000 individual customers

**Model:**
- Team license: $50/month for 10 users
- Enterprise: Custom pricing

**Target:** Companies with learning budgets

**Pitch:** Onboard new hires fast, prep teams for client meetings

---

## Key Principles

1. **Start simple** - $5 flat for launch
2. **Test one thing at a time** - Change only price, not messaging
3. **Run for 2+ weeks** - Let it stabilize
4. **Measure everything** - Conversion, revenue, refunds
5. **Don't optimize too early** - Need 1,000+ users first

---

## Pricing Mistakes to Avoid

❌ **Pricing too low** - Hard to raise later  
❌ **Pricing too high** - Kills conversion before you learn  
❌ **Complex tiers** - Confuses users  
❌ **Changing price weekly** - Looks desperate  
❌ **Discounting too often** - Trains users to wait  
❌ **Hiding price** - Users hate surprises

✅ **One clear price** - Easy decision  
✅ **Value before price** - Show what they get  
✅ **Guarantee** - 24h refund reduces risk  
✅ **Test slowly** - One experiment at a time

---

## Current Recommendation

**Launch Price:** $5 per course  
**Why:**
- Low enough = impulse buy
- High enough = sustainable
- Simple = no confusion
- Easy to A/B test later

**When to raise:**
- After 500+ courses sold
- If conversion >3% (demand is there)
- If refunds <5% (quality is there)
- Test $7 with 50% of traffic

**When to lower:**
- If conversion <1% (price resistance)
- If competing with free alternatives
- If quality concerns persist

---

Last Updated: 2026-01-31
