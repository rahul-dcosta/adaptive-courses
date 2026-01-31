# Commit Standard Operating Procedure (SOP)

## ⚠️ MANDATORY POST-PUSH CHECK

**Don't just push and walk away - verify the build!**

---

## The Workflow

### 1. Make Changes & Commit
```bash
cd /root/projects/adaptive-courses
git add -A
git commit -m "Clear description of changes"
```

### 2. Push
```bash
git push origin main
```

### 3. ⚠️ CHECK THE BUILD (MANDATORY)
**Do NOT move on until you verify the deployment!**

**How to check:**
- Watch the command output for any immediate errors
- Check Vercel dashboard (or ask user for build status)
- Wait for deployment to complete (~2-3 minutes)

### 4. Build Result

#### ✅ If Build Passes:
- You're done! 
- Site is live with your changes

#### ❌ If Build Fails:
**Fix it immediately:**

1. Look at the error in Vercel logs (user will send it)
2. Fix the issue locally
3. Commit the fix:
   ```bash
   git add -A
   git commit -m "Fix: [describe the build error]"
   git push origin main
   ```
4. **CHECK THE BUILD AGAIN** (repeat step 3)

---

## The Golden Rule

**🚨 NEVER PUSH AND FORGET 🚨**

Always verify the deployment succeeds.

---

## Why This Matters

**If you don't check:**
- Production could be broken for hours
- User has to tell you it's broken
- Wastes everyone's time

**If you do check:**
- Catch issues in 2-3 minutes
- Fix before user notices
- Maintain trust and reliability

---

## Quick Checklist

After every push:
- [ ] Push completed successfully
- [ ] Waited for Vercel build (~2-3 min)
- [ ] Checked build status (passed/failed)
- [ ] If failed: fixed immediately
- [ ] Verified fix deployed successfully

---

**Remember:** The build happens on Vercel AFTER you push. Your job is to WATCH and VERIFY it succeeds.
