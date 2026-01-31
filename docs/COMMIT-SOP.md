# Commit Standard Operating Procedure (SOP)

## ⚠️ MANDATORY PRE-COMMIT CHECKLIST

**NEVER push code without completing ALL steps below.**

### 1. Build Locally
```bash
cd /root/projects/adaptive-courses/app
npm run build
```

**Required:** Build MUST exit with code 0 (success).

### 2. Check for Errors
- ❌ **Any build errors?** Fix before committing
- ⚠️ **Warnings OK** (metadata, deprecated features) - non-blocking
- ✅ **Exit code 0?** Safe to proceed

### 3. Test Locally (Optional but Recommended)
```bash
npm run dev
```

Open http://localhost:3000 and verify:
- Landing page loads
- Course builder works
- No console errors

### 4. Commit & Push
```bash
git add -A
git commit -m "Clear description of changes

- BUILD VERIFIED LOCALLY
- List specific changes
- Note any breaking changes"
git push origin main
```

### 5. Monitor Deployment
- Watch Vercel deployment dashboard
- Verify build passes on Vercel
- Check live site after deployment

---

## Why This Matters

**Without local builds:**
- Waste 5-10 minutes per failed deploy
- Rack up failed deployment history
- Risk breaking production
- Lose user trust

**With local builds:**
- Catch errors in 30 seconds
- Push with confidence
- Clean deployment history
- Production stays stable

---

## Common Build Errors

### Tailwind v4 Issues
- **Error:** `theme() function not supported`
- **Fix:** Use plain CSS hex codes instead

### TypeScript Errors
- **Error:** Type mismatches, missing properties
- **Fix:** Run `npm run build` to see all TS errors

### Missing Dependencies
- **Error:** Module not found
- **Fix:** `npm install <package>`

### Environment Variables
- **Error:** Undefined env vars
- **Fix:** Create `.env.local` with required vars

---

## Emergency: Build Failing on Vercel

If you pushed code and Vercel build fails:

1. **Don't panic** - revert is easy
2. **Check logs** - Vercel shows exact error
3. **Fix locally** - reproduce error with `npm run build`
4. **Test fix** - verify build passes
5. **Push fix** - commit with clear message
6. **Verify** - watch deployment succeed

---

## The Rule

**🚨 IF BUILD FAILS LOCALLY, DO NOT PUSH 🚨**

No exceptions. No "I'll fix it in the next commit."

Build first. Push second. Always.
