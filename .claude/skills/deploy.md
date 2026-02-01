# Deploy Skill

Automated deployment workflow for Adaptive Courses.

## Steps

Run these in order:

1. **Build check**
   ```bash
   npm run build
   ```
   Fix any TypeScript or build errors before proceeding.

2. **Lint check**
   ```bash
   npm run lint
   ```
   Fix any linting errors.

3. **Git status**
   Check for uncommitted changes:
   ```bash
   git status
   ```

4. **Stage and commit**
   Stage relevant files (not node_modules, .env, etc.):
   ```bash
   git add [specific files]
   git commit -m "descriptive message"
   ```

   Commit message format:
   - feat: new feature
   - fix: bug fix
   - docs: documentation
   - style: formatting
   - refactor: code restructure
   - test: adding tests
   - chore: maintenance

5. **Push to current branch**
   ```bash
   git push origin [current-branch]
   ```

6. **Merge prompt (if on dev)**
   If on dev branch, ask user if they want to merge to main:
   - If yes: `git checkout main && git merge dev && git push origin main && git checkout dev`
   - If no: done

## Pre-deploy Checklist

Before deploying to production (main), verify:
- [ ] All features work locally
- [ ] No console errors
- [ ] Environment variables are set in Vercel
- [ ] No sensitive data in commits

## Rollback

If something breaks in production:
```bash
git revert HEAD
git push origin main
```

Or in Vercel dashboard: Deployments → find last working → Redeploy

## When to Use This Skill

Invoke `/deploy` when:
- Ready to push changes
- Want full build/lint/commit/push workflow
- Need to deploy to production
