# Product Roadmap - Adaptive Courses

## Current Version (v1.0 - MVP)

### Core Features ✅
- AI-generated crash courses (30-60 min)
- Topic input with context (what, why, when)
- Modular course structure (5-8 sections)
- Flashcards for review
- Downloadable PDF
- Pay-per-course ($3.99)
- Stripe payment integration

### Target Users
- Consultants prepping for client meetings
- Job seekers preparing for interviews
- Presenters learning overnight
- Professionals facing "learn X fast" moments

---

## v1.5 - Post-Launch Refinements (Month 1-2)

### User-Requested Features (Based on Feedback)
- [ ] **Course customization**
  - Adjust length (30 min vs. 60 min)
  - Adjust depth (high-level vs. detailed)
  - Adjust style (beginner-friendly vs. technical)

- [ ] **Course revision**
  - "Regenerate this section"
  - "Make this simpler"
  - "Add more examples"

- [ ] **Better flashcards**
  - Spaced repetition algorithm
  - Mobile-friendly review
  - Export to Anki

- [ ] **Progress tracking**
  - Mark modules complete
  - Resume where you left off
  - Track time spent per section

### Technical Improvements
- [ ] Faster generation (target: 30 seconds)
- [ ] Better error handling (retry failed generations)
- [ ] Email delivery (send course to email)
- [ ] Mobile optimization (responsive design)

---

## v2.0 - Premium Features (Month 3-4)

### Quizzes & Assessments
**Why:** Users want to test understanding, not just consume content

**Features:**
- [ ] Auto-generated quiz after each module
- [ ] Final assessment at end of course
- [ ] Score tracking (did you learn it?)
- [ ] Retake incorrect answers

**Pricing Impact:** Part of Pro tier ($20/month) or $2 add-on

---

### Audio Courses (TTS)
**Why:** Commuters, gym-goers, multitaskers want audio learning

**Features:**
- [ ] Text-to-speech for entire course
- [ ] Download as MP3
- [ ] Playback controls (speed, rewind)
- [ ] Auto-generated podcast-style narration

**Tech:** ElevenLabs or Play.ht API

**Pricing Impact:** $3 add-on or included in Pro tier

---

### Certificates
**Why:** LinkedIn credibility, proof of learning, AND fun factor

**The Magic:**
- "Supply Chain Management Certificate" → Serious, LinkedIn-worthy
- "Water Bottle Expert Certificate" → Fun, Twitter meme-able
- Same quality, user decides the vibe
- Trust-based: You did the course = you earned it

**Features:**
- [ ] Auto-generated certificate PDF after completion
- [ ] Custom branding (professional design)
- [ ] Verifiable link (share on LinkedIn, Twitter)
- [ ] Skills listed (e.g., "Supply Chain Management" or "Water Bottle Types")
- [ ] Fun + legitimate (not goofy, actually educational)

**Positioning:**
- Proof you LEARNED something (not just proof of credential)
- Shareable (LinkedIn for serious, Twitter for fun)
- Meme potential (viral marketing via "weird" certificates)

**Pricing Impact:** $5 add-on or included in Pro tier

---

### Pro Tier Subscription ($20/month)
**Why:** Power users (consultants, career changers) need unlimited access

**What's Included:**
- Unlimited course generations
- Audio courses (TTS)
- Quizzes & assessments
- Certificates
- Priority generation (faster queue)
- Course revision requests (regenerate sections)
- Advanced customization (length, depth, style)

**Target Users:**
- Consultants (5+ courses/month)
- Career changers (learning new field)
- Executive coaches (client prep)

**Economics:**
- Break-even: 3 courses/month ($3.99 x 3 = $21)
- Value prop: "Unlimited learning for less than 3 courses"

---

## v3.0 - Advanced Features (Month 5-6)

### Interactive Simulations
**Why:** Some topics need practice, not just reading

**Examples:**
- **Interview simulation:** AI asks questions, evaluates answers
- **Negotiation roleplay:** Practice salary negotiation
- **Presentation feedback:** Record yourself, get AI critique

**Tech:** OpenAI Realtime API (voice) + Claude (evaluation)

**Pricing Impact:** $10 add-on or Pro tier only

---

### Multi-Course Learning Paths
**Why:** Some users need a sequence (e.g., "prep for consulting career")

**Features:**
- [ ] Pre-built paths (e.g., "Factory Manager Crash Course")
- [ ] Custom paths (AI suggests course sequence)
- [ ] Progress tracking across courses
- [ ] Bundle pricing (5 courses for $25)

**Example Paths:**
- "Consultant Onboarding" → Business basics, presentation skills, client communication
- "Tech Interview Prep" → Data structures, system design, behavioral questions
- "Sales Enablement" → Product knowledge, objection handling, industry trends

**Pricing Impact:** $25 bundle (vs. $35 individual)

---

### AI Tutor (Chat with Course)
**Why:** Questions arise while learning - let users ask follow-ups

**Features:**
- [ ] Chat interface during course
- [ ] "Explain this concept more"
- [ ] "Give me an example of X"
- [ ] "Quiz me on this section"

**Tech:** RAG (retrieval-augmented generation) over course content

**Pricing Impact:** Pro tier only (prevents API abuse)

---

### Collaborative Learning
**Why:** Teams (consulting firms, sales teams) learn together

**Features:**
- [ ] Share course with team
- [ ] Team quiz leaderboard
- [ ] Discussion threads per module
- [ ] Manager dashboard (who completed what)

**Pricing Impact:** Team tier ($150/user/year)

---

## v4.0 - Enterprise & Scale (Month 7-12)

### Enterprise Features
**Target:** Consulting firms, sales teams, training departments

**Features:**
- [ ] SSO (Single Sign-On)
- [ ] Admin dashboard (usage analytics)
- [ ] Custom branding (white-label courses)
- [ ] Bulk course generation (upload CSV of topics)
- [ ] API access (integrate with LMS)
- [ ] SCORM export (compatibility with corporate LMS)

**Pricing:** Custom (likely $500-5000/month depending on seats)

---

### Video Courses (AI-Generated)
**Why:** Some users prefer video over text

**Tech Stack:**
- AI script generation (Claude)
- AI voiceover (ElevenLabs)
- AI video generation (Synthesia or D-ID)
- Slide generation (AI-designed visuals)

**Features:**
- [ ] Auto-generated video course (10-15 min)
- [ ] Professional voiceover
- [ ] Animated slides
- [ ] Downloadable MP4

**Challenges:**
- High cost (video generation expensive)
- Slower generation (10+ minutes to create)
- Quality control (need human review?)

**Pricing Impact:** $15 add-on or Premium tier ($30/month)

---

### Mobile App
**Why:** On-the-go learning (commutes, waiting rooms)

**Features:**
- [ ] iOS + Android app
- [ ] Offline mode (download courses)
- [ ] Push notifications (reminders to finish)
- [ ] Dark mode
- [ ] Sync across devices

**Dev Cost:** High (need mobile dev or React Native)

**Pricing Impact:** No additional cost (drives retention)

---

## Future Experiments (TBD)

### AI Course Marketplace
**Idea:** Let users share/sell their generated courses

**How It Works:**
- User generates "Supply Chain for Beginners"
- Chooses to publish to marketplace
- Other users buy it for $3 (vs. $3.99 to generate their own)
- Original creator gets 50% ($1.50)

**Pros:**
- User-generated content (scale without effort)
- Lower price point for buyers
- Creator incentive (passive income)

**Cons:**
- Quality control (how to filter bad courses?)
- Cannibalization (why generate if you can buy cheaper?)

**Status:** Interesting idea, needs validation

---

### Live Expert Sessions
**Idea:** After finishing a course, book a 15-min Q&A with human expert

**How It Works:**
- User finishes "Supply Chain Basics"
- Option: "Book 15-min expert call ($25)"
- Matched with verified expert (Cal.com integration)
- Ask follow-up questions, get real-world advice

**Pros:**
- High-margin add-on ($25, split 50/50 with expert)
- Human touch (AI + human hybrid)
- Deeper learning

**Cons:**
- Logistics (scheduling, expert vetting)
- Scalability (human bottleneck)

**Status:** Potential premium feature for v3+

---

### "Teach Me Like I'm 5" Mode
**Idea:** Simplify any course to elementary school level

**Use Case:**
- Explaining complex topics to non-experts
- Teaching kids
- Extreme beginners

**Features:**
- [ ] Toggle: "Simplify this course"
- [ ] AI rewrites in simple language
- [ ] Analogies and examples for kids

**Pricing Impact:** Free (just a generation mode)

---

### Corporate Training Integration
**Idea:** Partner with companies for onboarding/training

**Use Case:**
- New hire onboarding (e.g., "Learn our tech stack in 1 hour")
- Sales team training (e.g., "Product knowledge crash course")
- Compliance training (e.g., "GDPR basics for marketers")

**Features:**
- [ ] White-label branding
- [ ] Company-specific content
- [ ] Completion tracking
- [ ] Manager dashboard

**Revenue Model:** $1,000-10,000/month per company

**Status:** High-value opportunity, requires enterprise sales focus

---

## What Would Make Someone Pay $20 Instead of $5?

### Value Multipliers (Why Pay 4x More?)

**1. Unlimited Access**
- Pay $3.99 per course → expensive if you need 5+ courses/month
- Pay $20/month unlimited → cheaper at 3+ courses/month
- **Economics:** Consultants, career changers generate 5-10 courses/month

**2. Premium Features**
- Audio courses (commute-friendly)
- Quizzes (test understanding)
- Certificates (LinkedIn credibility)
- **Value:** Outcomes (job offer, promotion) worth $20

**3. Time Savings**
- Priority queue (30-second generation vs. 60 seconds)
- Revision requests (refine without repurchasing)
- **Value:** Time is money (especially for consultants)

**4. Customization**
- Adjust length, depth, style
- Regenerate specific sections
- **Value:** Tailored to your exact needs

**5. Accountability & Progress**
- Track learning across courses
- Reminders to complete
- Learning streaks
- **Value:** Habit formation, actual skill gains

---

## What's the "Pro" Tier Look Like?

### Pro Tier ($20/month)

**Included:**
- ✅ Unlimited course generations
- ✅ Audio courses (TTS)
- ✅ Quizzes & assessments
- ✅ Certificates (shareable on LinkedIn)
- ✅ Priority generation (faster)
- ✅ Course customization (length, depth, style)
- ✅ Revision requests (regenerate sections)
- ✅ Progress tracking
- ✅ AI tutor (chat with course)
- ✅ Download all courses (PDF + audio)

**Target Users:**
- **Consultants:** Need 5-10 courses/month (client prep)
- **Career changers:** Learning new field, need many courses
- **Coaches/trainers:** Generate courses for clients
- **Students:** Cramming for multiple exams

**Break-Even:** 3 courses/month ($3.99 x 3 = $21 vs. $20 subscription)

**Positioning:** "Unlimited learning for less than 3 courses"

---

## Roadmap Prioritization Framework

### High Priority (Do First)
- ✅ Directly increases revenue
- ✅ Frequently requested by users
- ✅ Low dev effort

**Examples:**
- Course customization (length, depth)
- Audio courses (TTS)
- Flashcard improvements

---

### Medium Priority (Do Next)
- Increases retention
- Enables Pro tier
- Moderate dev effort

**Examples:**
- Quizzes & assessments
- Certificates
- Progress tracking

---

### Low Priority (Later)
- Interesting but unproven demand
- High dev effort
- Nice-to-have, not essential

**Examples:**
- Video courses
- Mobile app
- Marketplace

---

## Revenue Model Evolution

### Phase 1: MVP (Month 1-3)
- **Model:** Pay-per-course ($3.99)
- **Revenue:** $1,000-5,000/month
- **Focus:** Product-market fit

### Phase 2: Pro Tier (Month 4-6)
- **Model:** Pay-per-course ($3.99) + Pro subscription ($20/month)
- **Revenue:** $5,000-15,000/month
- **Focus:** Retention & LTV

### Phase 3: Enterprise (Month 7-12)
- **Model:** Pay-per-course + Pro + Team ($150/user/year) + Enterprise (custom)
- **Revenue:** $15,000-50,000/month
- **Focus:** B2B sales

### Phase 4: Scale (Year 2+)
- **Model:** Multi-tier (Free trial → Pro → Team → Enterprise)
- **Revenue:** $50,000-200,000/month
- **Focus:** Market leadership

---

## Success Metrics by Version

### v1.0 (MVP)
- 100+ paying customers
- 80%+ completion rate
- 30%+ return rate (buy 2nd course)

### v2.0 (Pro Tier)
- 500+ paying customers
- 50+ Pro subscribers
- $10K MRR

### v3.0 (Advanced Features)
- 2,000+ paying customers
- 200+ Pro subscribers
- $30K MRR

### v4.0 (Enterprise)
- 5,000+ paying customers
- 500+ Pro subscribers
- 10+ enterprise clients
- $100K MRR

---

## Anti-Roadmap (What We're NOT Building)

### ❌ Social Network Features
- No user profiles
- No "follow" mechanics
- No feed algorithm
- **Why:** Distracts from core value (just-in-time learning)

### ❌ Gamification Overload
- No badges
- No leaderboards (unless B2B team feature)
- No "streaks" (unless proven to help completion)
- **Why:** Focus on outcomes, not vanity metrics

### ❌ Free Tier
- No freemium model (initially)
- No ad-supported version
- **Why:** Quality product, fair price - avoid race to bottom

### ❌ Course Marketplace (Initially)
- Not letting users sell courses yet
- **Why:** Quality control nightmare, focus on AI generation

---

## Decision Framework: Should We Build This?

**Ask These Questions:**
1. **Does it help users learn faster?** (Core mission)
2. **Will users pay for it?** (Revenue test)
3. **Can we build it in <2 weeks?** (Opportunity cost)
4. **Is it frequently requested?** (Demand signal)
5. **Does it differentiate us?** (Competitive moat)

**If 3+ answers are YES → Build it**
**If <3 answers are YES → Backlog it**

---

**Remember:** The best roadmap is the one you actually ship. Start small, validate demand, then build more. 🚀
