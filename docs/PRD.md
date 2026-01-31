# Product Requirements Document - Adaptive Courses

## Overview
AI-powered personalized course generator that creates custom learning paths from minimal user input.

## User Flow
1. User lands on homepage
2. Types: "I want to learn X"
3. System asks 2-3 refinement questions (skill level, goals, time)
4. User pays $5 via Stripe
5. Full course generated in <60 seconds
6. User gets: modules, lessons, quizzes, resources

## Core Features (MVP)
- [ ] Landing page with input box
- [ ] Question refinement flow (2-3 questions)
- [ ] Stripe payment integration ($5 one-time)
- [ ] Claude API course generation
- [ ] Course viewer (modules, lessons, quizzes)
- [ ] PDF export
- [ ] Email delivery

## Tech Stack
- **Frontend:** Next.js 14 (App Router), Tailwind CSS
- **Backend:** Next.js API routes
- **Database:** Supabase (Postgres + Auth)
- **AI:** Claude 3.5 Sonnet (course gen), Haiku (quizzes)
- **Payments:** Stripe Checkout
- **Hosting:** Vercel
- **Email:** Resend or SendGrid

## Pricing
- $5 per course (one-time payment)
- No subscriptions (for now)
- Stripe takes ~$0.44, we net $4.56/course

## Success Metrics
- Courses generated per day
- Payment conversion rate
- Average generation time
- User satisfaction (future: feedback form)

## Timeline
- **Week 1:** MVP (landing + generation + payment)
- **Week 2:** Polish + launch on Product Hunt
- **Week 3:** Iterate based on feedback

## Future Features
- Course templates (popular topics pre-loaded)
- Multi-language support
- Spaced repetition quizzes
- Community-shared courses
- Affiliate program

---
**Status:** Foundation setup in progress
**Last Updated:** 2026-01-31
