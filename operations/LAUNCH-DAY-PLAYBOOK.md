# Launch Day Playbook

**Launch Target:** February 3-5, 2026  
**Primary Channel:** Product Hunt  
**Goal:** Top 5 Product of the Day, 50+ paid courses

---

## Pre-Launch (Day -1)

### Evening Before (9 PM EST)
- [ ] **Final QA pass** - Test entire flow 5x
- [ ] **Stripe live mode** - Switch from test to production keys
- [ ] **Update webhook URLs** - Point to production
- [ ] **Database check** - Verify all migrations ran
- [ ] **Monitoring setup** - Sentry, analytics live
- [ ] **Support inbox** - Check support@adaptive-courses.com working
- [ ] **Buffer posts** - Queue LinkedIn/Twitter posts
- [ ] **Product Hunt draft** - Upload images, copy, video
- [ ] **Personal network email** - Draft ready to send
- [ ] **Caffeine stocked** ☕
- [ ] **Set alarms** - 6 AM, 9 AM, 12 PM, 6 PM

---

## Launch Day Timeline

### 12:00 AM PST / 3:00 AM EST (Submission)
- [ ] **Submit to Product Hunt** (exactly 12:01 AM PST)
- [ ] **Post first comment** (maker intro)
- [ ] **Share in PH community** (Discord/Slack)
- [ ] **Pin submission link** in personal docs
- [ ] **Screenshot confirmation**
- [ ] Go back to sleep (set alarm for 6 AM)

### 6:00 AM PST / 9:00 AM EST (Morning Push)
**Rahul wakes up**

- [ ] **Check PH ranking** - Screenshot current position
- [ ] **Reply to all comments** (<15 min response time)
- [ ] **Post LinkedIn #1** - "The Problem" post
- [ ] **Post Twitter thread** - Launch announcement
- [ ] **Email personal network** - 50 people, BCC
- [ ] **Post in communities:**
  - IndieHackers
  - r/SideProject (Reddit)
  - HackerNews? (maybe, if traction strong)
  - AI Builders Discord
  - Product Hunt Ship

### 9:00 AM PST / 12:00 PM EST (Midday Check)
- [ ] **Engagement blitz** - Reply to ALL comments
- [ ] **Monitor analytics** - Check conversions
- [ ] **Fix critical bugs** (if any)
- [ ] **Post LinkedIn #2** - Share early traction
- [ ] **Thank supporters** - Individual DMs to hunters
- [ ] **Update PH post** - Add "Edit: Thanks for X upvotes!"

### 12:00 PM PST / 3:00 PM EST (Afternoon Push)
- [ ] **Content push** - Share user testimonials
- [ ] **LinkedIn #3** - Behind the scenes story
- [ ] **Community engagement** - Answer questions
- [ ] **Check press** - Any journalists reaching out?

### 3:00 PM PST / 6:00 PM EST (Evening Wrap)
- [ ] **Final ranking check** - Screenshot
- [ ] **LinkedIn #4** - Day recap + results
- [ ] **Thank you post** - PH community
- [ ] **Email supporters** - Personal thanks
- [ ] **Review metrics** - What worked, what didn't

### 9:00 PM PST / 12:00 AM EST (Wind Down)
- [ ] **Final comment replies**
- [ ] **Plan tomorrow's follow-up**
- [ ] **Sleep** (you earned it!)

---

## Minute-by-Minute (First Hour)

### 12:01 AM - Submit
- Click "Post" on Product Hunt
- Verify it's live

### 12:02 AM - First Comment
Paste pre-written maker intro

### 12:03 AM - Share Links
- PH Ship community
- Personal Slack/Discord

### 12:05 AM - Monitor
- Refresh every 2 minutes
- Reply to first comments immediately

### 12:15 AM - Early Traction Check
- Any upvotes? Comments?
- Adjust strategy if needed

### 12:30 AM - First Update
- Tweet: "Just launched on PH!"
- Include link

### 1:00 AM - Sleep
- Set alarm for 6 AM
- Let it cook overnight

---

## Response Templates

### Product Hunt Comment Replies

**Someone asks "How is this different from ChatGPT?"**
> "Great question! ChatGPT gives you text. We give you structured courses with modules, lessons, and quizzes. Plus, we ask the RIGHT questions - not 'what's your skill level' but 'what's the situation?' That context makes all the difference."

**Someone shares they tried it**
> "Amazing! What topic did you try? Would love to hear what worked (or didn't). DM me if you have feedback!"

**Someone skeptical about AI quality**
> "Totally fair concern. That's why we have a sample course you can preview before paying: [link]. If the quality isn't there after you pay, 24-hour money-back guarantee, no questions asked."

**Someone asks about pricing**
> "$5 per course, one-time. No subscription, no upsells. Wanted it cheaper than a coffee but sustainable to keep improving."

---

## Social Media Posts

### Twitter Launch Thread (Pre-Written)
```
🚀 I just launched Adaptive Courses on Product Hunt

AI-powered learning that understands your SITUATION, not just your skill level

Here's how it works 👇

[Link to PH]

(1/7)
```

### LinkedIn Post #1 (9 AM)
"I had a factory tour in 24 hours..."
[See marketing/social/linkedin.md]

### LinkedIn Post #2 (12 PM - if traction is good)
"We just hit [X] upvotes on Product Hunt! 🎉

Here's what I learned in the first 3 hours of launching..."

---

## Email to Personal Network

**Subject:** I just launched Adaptive Courses (would love your support!)

Hi [Name],

I've been building something for the past week and just launched it on Product Hunt today:

**Adaptive Courses** - AI-powered courses that understand your situation, not just your skill level.

The idea: You have a factory tour tomorrow. You need to learn "just enough" to ask smart questions. Traditional courses teach you everything. This teaches you exactly what you need.

**Would love your help:**
1. Check it out: [Product Hunt link]
2. Upvote if you think it's cool
3. Share with anyone who might find it useful

No pressure if you're busy! Just excited to ship this and thought you might find it interesting.

Thanks,
Rahul

---

## Metrics Dashboard (Monitor Live)

### Product Hunt
- **Ranking:** Check every hour
- **Upvotes:** Target 200+ for Top 5
- **Comments:** Reply <15 min
- **Hunters:** Thank individually

### Website
- **Visitors:** Google Analytics real-time
- **Sign-ups:** Check email_signups table
- **Conversions:** Check courses where paid=true
- **Errors:** Sentry dashboard

### Revenue
- **Stripe Dashboard:** Real-time transactions
- **Target:** 50+ courses = $250

---

## Crisis Management

### If PH ranking drops
- **Don't panic** - Fluctuates throughout day
- **Engage harder** - Reply faster, share more
- **Reach out** - Ask friends to share

### If site goes down
- **Immediate:** Check Vercel status
- **Post update:** "We're experiencing high traffic, working on it!"
- **Fix:** Scale up or fix bug
- **Compensate:** Free courses for affected users

### If negative feedback
- **Respond quickly** - Acknowledge, apologize, fix
- **Offer refund** - No hesitation
- **Learn:** Update product based on feedback
- **Don't argue:** Never get defensive

### If payment issues
- **Top priority** - Fix within 30 minutes
- **Manual process** - If Stripe down, manual PayPal
- **Communication:** Keep users informed

---

## Success Criteria

### Minimum Viable Success
- Top 10 on Product Hunt
- 20+ paid courses ($100 revenue)
- 100+ email signups
- 5+ organic testimonials

### Good Success
- Top 5 on Product Hunt
- 50+ paid courses ($250 revenue)
- 200+ email signups
- 10+ press mentions
- 1-2 influencer shares

### Great Success
- #1 Product of the Day
- 100+ paid courses ($500 revenue)
- 500+ email signups
- Feature on TechCrunch/HN front page
- 5+ influencers sharing

---

## Post-Launch (Days 2-7)

### Day 2
- [ ] Publish "What I Learned" post
- [ ] Email everyone who signed up
- [ ] Fix critical bugs
- [ ] Plan Week 1 content

### Day 3
- [ ] LinkedIn post #3 (Behind the scenes)
- [ ] Reach out to press (if traction strong)
- [ ] Start building in public thread

### Day 7
- [ ] Week 1 recap post
- [ ] Analyze metrics
- [ ] Plan Week 2 experiments
- [ ] Thank everyone publicly

---

## Content Calendar (Week 1)

**Monday (Launch):**
- Product Hunt submission
- LinkedIn post 1
- Twitter thread
- Email network

**Tuesday:**
- Product Hunt follow-up
- LinkedIn post 2
- Share testimonials

**Wednesday:**
- LinkedIn post 3
- HackerNews? (Show HN)
- Reddit AMA?

**Thursday:**
- LinkedIn post 4
- Case study post
- Email update to signups

**Friday:**
- LinkedIn post 5
- Week 1 recap
- Community Q&A

**Weekend:**
- Respond to feedback
- Plan Week 2
- Fix bugs

---

## Emergency Contacts

**Vercel:** Status page + support
**Stripe:** Dashboard + support chat
**Anthropic:** API status page
**Supabase:** Status page + support

**Backup Plan:**
If all else fails, manual processing:
- Take payments via PayPal
- Generate courses manually
- Email to users

---

## Celebration Checklist

**When you hit Top 5:**
- [ ] Screenshot the ranking
- [ ] Share on social media
- [ ] Thank everyone
- [ ] Open champagne 🍾

**When you hit $100 revenue:**
- [ ] Screenshot Stripe dashboard
- [ ] Tweet about first $100
- [ ] Frame the screenshot

**When you hit #1:**
- [ ] GO CRAZY
- [ ] Screenshot everything
- [ ] Call friends/family
- [ ] Write a blog post

---

Last Updated: 2026-01-31  
**Status:** Pre-Launch  
**Ready:** 95%
