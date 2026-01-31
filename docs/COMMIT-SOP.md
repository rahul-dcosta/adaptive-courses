# Commit Standard Operating Procedure (SOP)

## ⚠️ MANDATORY PRE-PUSH WORKFLOW

**The correct order: Commit → Build → Push**

### 1. Make Changes & Commit
```bash
cd /root/projects/adaptive-courses
git add -A
git commit -m "Clear description of changes

- List specific changes
- Note any breaking changes"
```

**Don't push yet!**

### 2. Build to Verify
```bash
cd app
npm run build
```

**Required:** Build MUST exit with code 0 (success).

### 3. Check Build Result
- ❌ **Build errors?** → Go to step 4 (Fix)
- ⚠️ **Warnings OK** (metadata, deprecated features) - non-blocking
- ✅ **Exit code 0?** → Go to step 5 (Push)

### 4. If Build Fails
```bash
# Fix the errors
# Then amend the commit
git add -A
git commit --amend --no-edit

# Build again
cd app && npm run build

# If passes → proceed to step 5
# If fails → repeat step 4
```

### 5. Push (Only After Build Passes)
```bash
git push origin main
```

### 5. Monitor Deployment
- Watch Vercel deployment dashboard
- Verify build passes on Vercel
- Check live site after deployment

---

## The Golden Rule

**🚨 COMMIT → BUILD → PUSH (ONLY IF BUILD PASSES) 🚨**

Never push without building first.

---

## Why This Matters

**Without build checks:**
- Waste 5-10 minutes per failed deploy
- Rack up failed deployment history
- Risk breaking production
- Lose user trust

**With build checks:**
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
