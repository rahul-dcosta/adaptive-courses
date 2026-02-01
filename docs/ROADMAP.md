# Product Roadmap - Adaptive Courses

## ✅ v1.0 - Static Course Generation (CURRENT FOCUS)

**Goal:** Ship a working product that generates personalized courses based on learner fingerprint.

**Features:**
- [x] 7-dimension learner fingerprint collection
- [x] Fingerprint-aware course generation (Claude API)
- [x] Royal blue branding throughout
- [x] PDF download option
- [x] Web-based course viewer (read-only)
- [ ] Supabase persistence (courses, fingerprints)
- [ ] Payment integration ($2 per course after first free)
- [ ] Email delivery option
- [ ] Basic analytics (courses generated, topics, conversion)

**Philosophy:**
- Keep it simple
- Ship fast
- Validate demand before building complexity
- Static courses are fine for v1 - focus on quality generation

**Timeline:** Ship by Feb 7, 2026

---

## 🚀 v2.0 - Interactive Learning (FUTURE)

**Inspiration:** ChatGPT-style learning with structured curriculum

**Example Use Case:**
User learns "Factory Operations for Mercedes Site Visit"
- Sees progress: "9% complete, 15% Time Metrics, 12% OEE"
- Reads lesson on Takt Time
- Asks: "wait, throughput time = touch time?"
- AI explains the difference inline
- Progress updates: "12% complete"
- User continues to next lesson

**Features to Add:**

### 1. Progress Tracking
- Overall progress percentage
- Category breakdown (weighted)
- Lesson completion checkboxes
- Visual progress bars
- "You're X% ready for [goal]" messaging

### 2. Interactive Q&A Within Course
- Chat interface embedded in course viewer
- "Ask a question about this lesson" button
- AI maintains context of current lesson
- Follow-up questions allowed
- Explanations adapt to confusion signals

### 3. Adaptive Content Delivery
- "Explain this differently" option
- "Give me more examples" button
- "Skip this, I already know it" → updates fingerprint
- AI notices confusion, offers simpler explanation
- Tracks which learning styles work best for this user

### 4. Smart Progress System
```
Progress Tracker
┌───────────────────────┬────────┬──────┬─────────────────────┐
│       Category        │ Weight │ Done │       Status        │
├───────────────────────┼────────┼──────┼─────────────────────┤
│ Time Metrics          │ 15%    │ 8%   │ 🟡 In Progress      │
├───────────────────────┼────────┼──────┼─────────────────────┤
│ OEE & Reliability     │ 12%    │ 0%   │ ⚪ Not Started      │
├───────────────────────┼────────┼──────┼─────────────────────┤
│ Total                 │ 100%   │ 9%   │                     │
└───────────────────────┴────────┴──────┴─────────────────────┘
```

### 5. Conversational Learning Mode
- Toggle between "structured reading" and "chat mode"
- In chat mode: conversational teaching like a tutor
- In reading mode: traditional course layout
- User picks preference (another fingerprint dimension!)

### 6. Quiz & Validation
- Quick checks after each lesson
- "Seems like you got it, moving on" or "Want to review?"
- Adaptive difficulty based on performance
- Updates progress only when concepts validated

### 7. Learning History
- Track which formats/styles worked for this user
- "People like you prefer examples-first" insights
- Refine fingerprint over time
- Cross-course learning patterns

**Technical Requirements:**
- WebSocket or Server-Sent Events for real-time chat
- Lesson state management (Redux or Zustand)
- AI streaming responses (Claude streaming API)
- Progress persistence (Supabase)
- Context window management (keep lesson context in chat)

**Monetization Implications:**
- Interactive mode = more API calls = higher cost
- Maybe tier pricing: $2 static, $5 interactive?
- Or bundle: "5 interactive courses for $20"

**Timeline:** After v1 ships and validates demand (March-April 2026)

---

## 🔮 v3.0 - Personalization & Community (FUTURE)

**Features:**
- Multi-course learning paths ("SQL → Python → Data Analysis")
- Spaced repetition reminders ("Review Takt Time in 3 days")
- Share courses with others (referral loop)
- Community Q&A ("Ask someone who learned this")
- Course ratings & feedback loop
- Export to Notion, Obsidian, Anki

---

## 📊 Metrics to Track

**v1 Metrics:**
- Courses generated
- Conversion rate (email → course generation)
- Payment conversion (free → paid)
- Topic distribution
- Fingerprint patterns (which combos most common?)
- Completion rate (do they read the whole course?)

**v2 Metrics (Interactive):**
- Questions asked per course
- Lesson completion rate
- Time spent per lesson
- Confusion signals (how many "explain differently" requests?)
- Learning style effectiveness (visual learners + diagrams = better retention?)

---

## 🎯 Current Focus

**DO NOT BUILD v2 FEATURES YET.**

Ship v1 first. Validate:
1. People want AI-generated courses
2. Fingerprint model improves outcomes
3. People will pay $2 per course
4. There's demand for this

THEN build interactivity.

Feature creep kills momentum. Ship fast, iterate based on real usage.

---

**Last Updated:** Feb 1, 2026  
**Status:** Shipping v1.0
