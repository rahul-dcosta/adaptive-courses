# Quick Start Guide

**⚡ Get from zero to deployed in 30 minutes**

---

## 1. Clone & Setup (2 min)
```bash
git clone https://github.com/rahul-dcosta/adaptive-courses.git
cd adaptive-courses/app
npm install
```

---

## 2. Get API Keys (10 min)

### Supabase (2 min)
1. [supabase.com](https://supabase.com) → New Project
2. Settings → API → Copy `URL` and `anon` key

### Anthropic (2 min)
1. [console.anthropic.com](https://console.anthropic.com) → API Keys
2. Create key → Copy (starts with `sk-ant-`)

### Stripe (5 min)
1. [dashboard.stripe.com](https://dashboard.stripe.com) → Test mode ON
2. Developers → API keys → Copy both keys
3. Developers → Webhooks → Add endpoint → Copy signing secret

---

## 3. Environment Variables (2 min)

Create `app/.env.local`:
```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...

# Anthropic
ANTHROPIC_API_KEY=sk-ant-api03-...

# Stripe (optional for local dev)
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

---

## 4. Database Setup (3 min)

1. Supabase → SQL Editor
2. Copy SQL from `docs/MIGRATIONS.md` (Migration 1)
3. Run
4. Repeat for Migration 2
5. Test: `SELECT * FROM courses;`

---

## 5. Run Locally (1 min)
```bash
cd app
npm run dev
```
Visit: http://localhost:3000

---

## 6. Test (5 min)

1. **Landing page:** http://localhost:3000
2. **Email capture:** Enter email → Should save to DB
3. **Course generation:**
   - Topic: "manufacturing"
   - Situation: Visiting a factory
   - Timeline: Tomorrow
   - Goal: Ask good questions
   - Wait 30-60s → Course should appear
4. **API test:** http://localhost:3000/api/test-api
5. **Health check:** http://localhost:3000/api/health

---

## 7. Deploy to Vercel (5 min)

1. Push to GitHub
2. [vercel.com](https://vercel.com) → Import repo
3. Add ALL env vars from step 3
4. Deploy
5. Visit: `https://your-project.vercel.app`

---

## 8. Post-Deploy (2 min)

- ✅ Test live site
- ✅ Update Stripe webhook URL to production
- ✅ Switch Stripe to live mode (when ready to launch)
- ✅ Configure custom domain (optional)

---

## Common Issues

### "Module not found" error
```bash
npm install
```

### "API key invalid"
- Check `.env.local` has no extra spaces
- Verify key starts with correct prefix
- Restart dev server after adding keys

### Course generation fails
- Check Anthropic key at `/api/test-api`
- Verify Supabase tables exist
- Check browser console for errors

### Database save fails
- Re-run migrations
- Verify RLS policies (see MIGRATIONS.md)
- Check Supabase logs

---

## File Structure
```
adaptive-courses/
├── app/              # Next.js app
│   ├── app/         # Pages & API routes
│   ├── components/  # React components
│   └── lib/         # Utils & clients
├── docs/            # Documentation
├── marketing/       # Launch materials
└── *.md             # Project docs
```

---

## Key Files

- `DEPLOYMENT.md` - Full deployment guide
- `TESTING.md` - QA procedures
- `STATUS.md` - Current project state
- `PRE-LAUNCH-CHECKLIST.md` - Launch steps
- `docs/MIGRATIONS.md` - Database schema
- `marketing/launch-plan.md` - Go-to-market

---

## Development Commands

```bash
# Install dependencies
npm install

# Run dev server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint

# Check types
npx tsc --noEmit
```

---

## Testing Commands

```bash
# Test API
curl http://localhost:3000/api/test-api

# Test course generation
curl -X POST http://localhost:3000/api/generate-course \
  -H "Content-Type: application/json" \
  -d '{"topic":"test","skillLevel":"beginner","goal":"learn","timeAvailable":"1 hour"}'

# Check health
curl http://localhost:3000/api/health
```

---

## Next Steps

1. ✅ Verify everything works locally
2. ✅ Deploy to Vercel
3. ⏳ Complete Stripe integration (see TODO in code)
4. ⏳ Add email delivery (Resend)
5. ⏳ Implement PDF export
6. ⏳ Collect beta testimonials
7. ⏳ Record demo video
8. ⏳ Launch on Product Hunt

---

## Resources

- **Live Site:** https://adaptive-courses.vercel.app
- **GitHub:** https://github.com/rahul-dcosta/adaptive-courses
- **Docs:** See `/docs` folder
- **Support:** rdcosta@umich.edu

---

**Built with:** Next.js 14, Supabase, Claude AI, Stripe, Vercel  
**License:** Proprietary  
**Version:** 0.9 (Pre-launch MVP)
