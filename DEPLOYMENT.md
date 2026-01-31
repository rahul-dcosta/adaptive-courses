# Deployment Guide

## Vercel Deployment

### Prerequisites
- GitHub account with repo access
- Vercel account (free tier is fine)
- Supabase account
- Anthropic API key
- Stripe account (for payments)

---

## Step 1: Supabase Setup

### 1.1 Create Project
1. Go to [supabase.com](https://supabase.com)
2. Click "New Project"
3. Choose organization
4. Set project name (e.g., "adaptive-courses")
5. Set database password (save it!)
6. Choose region (closest to users)
7. Click "Create Project"
8. Wait ~2 minutes for provisioning

### 1.2 Run Database Migrations
1. Go to SQL Editor in Supabase dashboard
2. Click "New Query"
3. Copy SQL from `docs/MIGRATIONS.md` (Migration 1: Courses table)
4. Click "Run"
5. Verify: `SELECT * FROM courses LIMIT 1;` should return empty result
6. Repeat for Migration 2 (Email signups)
7. Repeat for Migration 3 (Analytics - optional)

### 1.3 Get API Keys
1. Go to Project Settings → API
2. Copy:
   - `URL` (looks like https://xxxxx.supabase.co)
   - `anon public` key (starts with eyJ...)
   - `service_role` key (starts with eyJ... - KEEP SECRET)

---

## Step 2: Get API Keys

### 2.1 Anthropic API
1. Go to [console.anthropic.com](https://console.anthropic.com)
2. Navigate to API Keys
3. Click "Create Key"
4. Copy the key (starts with `sk-ant-api03-`)
5. **Important:** This is shown ONCE, save it immediately

### 2.2 Stripe (For Payments)
1. Go to [dashboard.stripe.com](https://dashboard.stripe.com)
2. Toggle "Test mode" ON (top right)
3. Go to Developers → API keys
4. Copy:
   - `Publishable key` (starts with `pk_test_`)
   - `Secret key` (starts with `sk_test_`)
5. Go to Developers → Webhooks
6. Click "Add endpoint"
7. Endpoint URL: `https://your-domain.vercel.app/api/stripe-webhook`
8. Select events: `checkout.session.completed`
9. Copy the Webhook signing secret (starts with `whsec_`)

---

## Step 3: Deploy to Vercel

### 3.1 Connect GitHub
1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repo: `rahul-dcosta/adaptive-courses`
4. Select the repo

### 3.2 Configure Build Settings
```
Framework Preset: Next.js
Root Directory: ./app
Build Command: npm run build
Output Directory: .next
Install Command: npm install
```

### 3.3 Add Environment Variables
Click "Environment Variables" and add ALL of these:

**Supabase:**
```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
```

**Anthropic:**
```
ANTHROPIC_API_KEY=sk-ant-api03-...
```

**Stripe:**
```
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

**Optional (Analytics, Email):**
```
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
RESEND_API_KEY=re_...
```

### 3.4 Deploy
1. Click "Deploy"
2. Wait ~2-3 minutes
3. Visit your deployment URL (e.g., `adaptive-courses.vercel.app`)
4. Test `/api/health` endpoint to verify config

---

## Step 4: Configure Custom Domain (Optional)

### 4.1 Purchase Domain
- Recommended: Vercel Domains, Namecheap, or Cloudflare
- Cost: ~$12/year for `.com`

### 4.2 Add to Vercel
1. Go to Project Settings → Domains
2. Click "Add"
3. Enter domain (e.g., `adaptive-courses.com`)
4. Follow DNS instructions (usually add A/CNAME records)
5. Wait for DNS propagation (~10-60 minutes)
6. Enable HTTPS (automatic via Vercel)

---

## Step 5: Test Everything

### 5.1 Manual Testing Checklist
- [ ] Landing page loads
- [ ] Email capture works
- [ ] Course generation works (test topic: "manufacturing")
- [ ] Payment flow works (use test card: `4242 4242 4242 4242`)
- [ ] Course appears after payment
- [ ] Database saves course (`SELECT * FROM courses;`)
- [ ] Analytics tracking fires (`SELECT * FROM analytics_events;`)
- [ ] All pages work (Terms, Privacy, FAQ, Sample, 404)
- [ ] Mobile responsive (test on phone)

### 5.2 Test Stripe Webhook
```bash
# Install Stripe CLI
brew install stripe/stripe-cli/stripe

# Login
stripe login

# Forward webhooks to local dev
stripe listen --forward-to https://your-domain.vercel.app/api/stripe-webhook

# Trigger test event
stripe trigger checkout.session.completed
```

### 5.3 Check Logs
1. Vercel dashboard → Deployments → Latest → Logs
2. Look for errors
3. Verify no crashes

---

## Step 6: Enable Analytics (Optional)

### 6.1 Google Analytics
1. Go to [analytics.google.com](https://analytics.google.com)
2. Create new property
3. Get Measurement ID (G-XXXXXXXXXX)
4. Add to Vercel env vars: `NEXT_PUBLIC_GA_ID`
5. Redeploy

### 6.2 Sentry (Error Monitoring)
```bash
# In app/ directory
npm install @sentry/nextjs
npx @sentry/wizard -i nextjs
```
1. Follow wizard prompts
2. Get DSN from sentry.io
3. Add to Vercel env vars: `NEXT_PUBLIC_SENTRY_DSN`
4. Redeploy

---

## Step 7: Launch Checklist

### Pre-Launch
- [ ] All environment variables set
- [ ] Database migrations run
- [ ] Stripe test mode works
- [ ] Switch Stripe to LIVE mode
- [ ] Update Stripe webhook URL to production
- [ ] Final QA pass
- [ ] Custom domain configured (optional)
- [ ] SSL certificate active
- [ ] Analytics tracking verified
- [ ] Error monitoring active

### Launch Day
- [ ] Switch Stripe to live keys
- [ ] Update webhook endpoint
- [ ] Monitor logs
- [ ] Have rollback plan ready

---

## Troubleshooting

### Issue: Course generation fails
**Check:**
1. Anthropic API key is valid (test at `/api/test-api`)
2. Model name is correct (`claude-sonnet-4-5-20250929`)
3. Vercel function timeout (default 10s, may need increase)

**Fix:**
- Verify env vars in Vercel dashboard
- Check Vercel function logs
- Test with curl: `curl -X POST https://your-domain/api/generate-course -d '{"topic":"test","skillLevel":"beginner","goal":"learn","timeAvailable":"1 hour"}'`

### Issue: Database save fails
**Check:**
1. Supabase URL/key correct
2. Tables exist (`SELECT * FROM courses;`)
3. RLS policies allow inserts

**Fix:**
- Re-run migrations
- Check Supabase logs (Dashboard → Logs)
- Verify RLS policies in Table Editor

### Issue: Stripe webhook not firing
**Check:**
1. Webhook endpoint URL correct
2. Webhook signing secret matches
3. Events selected: `checkout.session.completed`

**Fix:**
- Use Stripe CLI to test locally
- Check Stripe dashboard → Developers → Webhooks → Logs
- Verify endpoint URL is publicly accessible

### Issue: Page load slow
**Check:**
1. Vercel region (should be close to users)
2. Bundle size (run `npm run build` locally)
3. Image optimization

**Fix:**
- Enable Vercel Analytics
- Use Next.js Image component
- Lazy load non-critical content

---

## Rollback Procedure

### If something breaks after deployment:

```bash
# From Vercel dashboard
1. Go to Deployments
2. Find last working deployment
3. Click "..." menu → "Promote to Production"
```

### If database is corrupted:

```sql
-- Backup first
CREATE TABLE courses_backup AS SELECT * FROM courses;

-- Restore
DELETE FROM courses WHERE created_at > 'YYYY-MM-DD HH:MM:SS';
```

---

## Monitoring

### Daily Checks
- Vercel Analytics (traffic, errors)
- Supabase Dashboard (database size, queries)
- Stripe Dashboard (payments, disputes)

### Weekly Checks
- Cost review (API usage, infrastructure)
- Error rate (Sentry or logs)
- User feedback (support emails)

### Alerts to Set Up
- Vercel: Function errors >10/hour
- Supabase: Database >80% capacity
- Stripe: Failed payment >5/day
- Email: Support tickets >10 unread

---

## Scaling Considerations

### At 100 courses/month
- No changes needed
- Free tier is fine

### At 1,000 courses/month
- Upgrade Vercel to Pro ($20/mo)
- Upgrade Supabase to Pro ($25/mo)
- API costs: ~$500/mo
- Consider caching

### At 10,000 courses/month
- Enterprise Vercel
- Dedicated Supabase
- CDN for static assets
- Redis for caching
- Load balancing

---

## Security Checklist

- [ ] All API keys in env vars (not code)
- [ ] Supabase RLS policies enabled
- [ ] Stripe webhook signature verified
- [ ] HTTPS enabled (automatic via Vercel)
- [ ] CORS configured properly
- [ ] Rate limiting on API routes (TODO)
- [ ] Input validation on all forms
- [ ] No sensitive data in logs
- [ ] Regular dependency updates (`npm audit`)

---

## Costs Summary

### Free Tier (0-100 courses/month)
- Vercel: $0
- Supabase: $0
- Anthropic: ~$50
- Domain: $12/year
- **Total:** ~$50/month

### Pro Tier (100-1,000 courses/month)
- Vercel Pro: $20
- Supabase Pro: $25
- Anthropic: ~$500
- Domain: $12/year
- **Total:** ~$545/month

### Revenue Needed
- Free tier: 11 courses/month @ $5
- Pro tier: 109 courses/month @ $5

---

## Support

**Deployment issues:** Check Vercel logs first  
**Database issues:** Check Supabase logs  
**Payment issues:** Check Stripe dashboard  
**General bugs:** GitHub Issues

**Emergency contact:** rdcosta@umich.edu
