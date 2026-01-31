# Design Philosophy - Adaptive Courses

## Core Principle
**Don't make the user think. Don't make them wait. Don't waste their time.**

---

## 1. Information Density > Visual Noise

**Why:**  
People don't need pretty animations. They need information, fast.

**How:**
- Typography does the heavy lifting (size, weight, spacing)
- Color is functional, not decorative (black for emphasis, gray for secondary)
- White space separates concepts, not just for aesthetics
- Grid-based layouts (eyes know where to look)

**Example:**
```
❌ Gradient backgrounds, glowing buttons, floating emojis
✅ Clean white, bold text, clear hierarchy
```

---

## 2. Confidence > Persuasion

**Why:**  
If your product needs urgency banners and fake scarcity, it's not good enough.

**How:**
- State what it does, not why you should buy it
- No countdown timers, no "limited spots"
- Let the product speak (show, don't sell)
- Trust the user to decide

**Example:**
```
❌ "Only 47 spots left! Join 1,234 users!"
✅ "First course free. $2 per course after that."
```

---

## 3. Speed > Features

**Why:**  
A fast product with 3 features beats a slow product with 30.

**How:**
- Minimize JS (only what's needed)
- Server-side render what you can
- Lazy load images (but not text)
- No loading spinners for <200ms actions

**Example:**
```
❌ 5-second loading animation with inspirational quotes
✅ Instant page load, content appears immediately
```

---

## 4. Opinionated > Flexible

**Why:**  
Choices are work. Make decisions for the user.

**How:**
- One CTA per screen (not 5)
- Default to the best option
- Hide advanced settings behind a link
- Don't ask if you can infer

**Example:**
```
❌ "Choose your theme: Light, Dark, Auto, High Contrast, Custom..."
✅ Clean white by default (add dark mode later if users ask)
```

---

## 5. Text > Icons

**Why:**  
Icons are ambiguous. Text is clear.

**How:**
- Button text > icon-only buttons
- Labels > placeholder text
- Descriptions > tooltips on hover
- Exception: universally understood icons (search, close, menu)

**Example:**
```
❌ [📄] [⚙️] [🔔] (what do these mean?)
✅ "Download PDF" "Settings" "Notifications"
```

---

## 6. Focus > Everything

**Why:**  
Every element competes for attention. Remove everything that doesn't help the user right now.

**How:**
- One primary action per page
- Secondary actions are subtle (gray, smaller)
- No popups, no chat widgets, no cookie banners (if you can avoid it)
- User came here to do ONE thing - let them do it

**Example:**
```
❌ Hero with 3 CTAs + chat widget + newsletter popup + announcement banner
✅ Hero with 1 clear CTA, everything else is below the fold
```

---

## 7. Honest > Optimized

**Why:**  
Dark patterns work short-term, kill trust long-term.

**How:**
- No fake urgency ("3 people viewing this now!")
- No hidden costs (show price upfront)
- No confusing unsubscribe flows
- If you wouldn't do it to a friend, don't do it to users

**Example:**
```
❌ "Free trial" that auto-charges after 7 days (hidden in fine print)
✅ "First course free. $2 per course after. No subscription."
```

---

## 8. Defaults Matter

**Why:**  
90% of users never change settings.

**How:**
- Default to the best experience
- Don't make onboarding mandatory
- Pre-fill what you can infer
- Progressive disclosure (show advanced options when needed)

**Example:**
```
❌ 5-step onboarding asking name, role, company, goals, preferences
✅ Email → Start using (ask for more later if needed)
```

---

## 9. Accessibility = Good Design

**Why:**  
Making it work for screen readers makes it work for everyone.

**How:**
- Semantic HTML (h1, nav, button - not div soup)
- Keyboard navigation works
- Color contrast 4.5:1 minimum
- Touch targets 44px minimum
- Focus states visible

**Example:**
```
❌ <div onclick="submit()">Submit</div>
✅ <button type="submit">Submit</button>
```

---

## 10. Copy = Design

**Why:**  
Bad copy ruins good design. Good copy fixes bad design.

**How:**
- Short sentences (10-15 words max)
- Active voice ("Generate course" not "Course will be generated")
- Conversational, not corporate
- Remove filler words (just, very, really, actually)

**Example:**
```
❌ "We leverage AI to optimize your learning journey"
✅ "AI builds you a custom course in 30 seconds"
```

---

## Specific to Adaptive Courses

### Course Viewing Philosophy

**Problem:**  
Udemy/Coursera are heavy. Videos, forums, certificates, gamification.  
Users just want to learn the thing.

**Our Approach:**

**Option A: PDF Download** (simplest)
- Generate course → Download PDF
- No login, no platform lock-in
- Read offline, print, annotate
- Cons: No progress tracking, no interactivity

**Option B: Interactive Web** (richer)
- Read on website, save progress
- Check off completed modules
- Take quizzes, get feedback
- Bookmark for later
- Cons: Requires account, more complex

**Our Decision:**
Start with **both**:
1. Always offer PDF download (no friction)
2. Optionally save to account for progress tracking

**UI for Course:**
```
Clean, readable text
├─ Module 1 ✓ (completed)
├─ Module 2 ← (current)
├─ Module 3
└─ Module 4

[Download PDF] [Mark Complete] [Next Module →]
```

**Not:**
```
Sidebar navigation
Video player with transcript
Discussion forum
Certificate generator
Gamification points
```

---

## Competitive Landscape

### Who's doing AI-generated courses?

**Similar but different:**

1. **ChatGPT Edu** (OpenAI)
   - General AI tutor, not structured courses
   - Conversational, no curriculum
   - Free/paid tiers

2. **Khan Academy + Khanmigo**
   - AI tutor for K-12
   - Pre-made content + AI guidance
   - Not situation-based

3. **Duolingo Max** (GPT-4 powered)
   - Language learning only
   - AI for practice, not course generation
   - Subscription model

4. **Coursera AI courses**
   - Traditional courses about AI
   - Not AI-generated courses
   - Long-form, video-heavy

5. **Synthesia / D-ID**
   - AI video generation for courses
   - Not personalized to situation
   - Expensive

**Nobody doing exactly this:**
- ✅ Situation-based customization (factory tour vs career switch)
- ✅ 30-minute time constraint
- ✅ AI-generated full curriculum (not just tutoring)
- ✅ Pay-per-course (not subscription)
- ✅ Download + go (not platform lock-in)

**Closest competitor:** None. This is genuinely novel.

**Biggest threat:** ChatGPT users just asking "teach me X" and copy-pasting into a doc.

**Our edge:**
1. Structured curriculum (not just Q&A)
2. Situation-aware (not generic)
3. Polished output (not raw AI dump)
4. Multiple formats (web, PDF, email)
5. Progress tracking (if they want it)

---

## Design Decisions for Adaptive Courses

### Landing Page
- ❌ Gradient backgrounds (looks generic)
- ✅ Clean white, bold black text
- ❌ Multiple CTAs
- ✅ One email input, one button
- ❌ Marketing jargon
- ✅ "Learn anything in 30 minutes" (clear, confident)

### Course Builder
- ❌ Long form with 10 questions
- ✅ 4 button clicks (topic, situation, timeline, goal)
- ❌ Progress bar with percentage
- ✅ Step numbers (1/4, 2/4, 3/4, 4/4)
- ❌ "Please wait while we process..."
- ✅ "Building your course..." with subtle progress

### Course View
- ❌ Dashboard with analytics and points
- ✅ Just the course content, clean and readable
- ❌ Force login to view
- ✅ View immediately, save optionally
- ❌ Gamification (streaks, badges, leaderboards)
- ✅ Simple progress (module 1 done, module 2 current)

### Monetization
- ❌ Subscription ($19/month)
- ✅ Pay-per-course ($2)
- ❌ Freemium with paywalls mid-course
- ✅ First course free, transparent pricing
- ❌ Upsells, add-ons, premium tiers
- ✅ One price, one product

---

## Typography Scale

```
Hero headline:     text-6xl md:text-7xl (72px)  font-black
Section headline:  text-3xl md:text-4xl (36px)  font-bold
Body large:        text-xl md:text-2xl (24px)   font-normal
Body:              text-base (16px)             font-normal
Small:             text-sm (14px)               font-normal
Tiny:              text-xs (12px)               font-medium
```

## Color Palette

```
Primary text:      #111827 (gray-900)
Secondary text:    #6B7280 (gray-500)
Border:            #D1D5DB (gray-300)
Background:        #FFFFFF (white)
Accent:            #111827 (black) for buttons
Hover:             #1F2937 (gray-800)
```

No blues, no purples, no gradients (for now).

---

## Metrics That Matter

**Don't optimize for:**
- Time on page (we want them to learn fast, not scroll forever)
- Pageviews (one page = one course, that's fine)
- Session length (efficient learning = short sessions)

**Do optimize for:**
- Email → Course generation (conversion)
- Course completion rate (did they finish?)
- Course quality (would they pay for another?)
- Word of mouth (did they share it?)

---

## Summary

**Good design is:**
- Fast
- Clear
- Honest
- Focused
- Minimal

**Bad design is:**
- Slow
- Confusing
- Manipulative
- Cluttered
- Excessive

**Adaptive Courses design:**
- Clean white background
- Bold black typography
- One CTA per screen
- No BS, no fake urgency
- PDF or web, user chooses
- Pay per course, no subscription

**Inspiration:**
- Linear (confidence, minimalism)
- Raycast (bold type, speed)
- Superhuman (premium feel)

**Anti-inspiration:**
- Udemy (cluttered, overwhelming)
- Coursera (slow, corporate)
- Generic SaaS landing pages (gradients, fake social proof)

---

*Design philosophy v1 - Jan 31, 2026*
