# Code Review Skill

Review code changes as a senior engineer would.

## Review Checklist

### 1. Correctness
- Does the code do what it's supposed to do?
- Are there edge cases not handled?
- Any obvious bugs?

### 2. Security
- SQL injection risks?
- XSS vulnerabilities?
- Exposed secrets or credentials?
- Proper input validation?
- OWASP Top 10 issues?

### 3. Performance
- N+1 query problems?
- Unnecessary re-renders (React)?
- Large bundle size additions?
- Missing memoization where needed?

### 4. Maintainability
- Is the code readable?
- Are names descriptive?
- Is complexity justified?
- Would a new team member understand this?

### 5. Testing
- Are critical paths tested?
- Do tests actually test behavior?
- Any flaky test risks?

### 6. Architecture
- Does this fit existing patterns?
- Any unnecessary abstractions?
- Proper separation of concerns?

## Severity Levels

**Critical:** Security vulnerabilities, data loss risks, crashes
**High:** Bugs that affect functionality, performance issues
**Medium:** Code smell, maintainability concerns
**Low:** Style nitpicks, minor improvements

## Output Format

```markdown
## Code Review: [filename or feature]

### Summary
[1-2 sentence overview]

### Critical Issues
- [ ] Issue description (line X)

### High Priority
- [ ] Issue description (line X)

### Medium Priority
- [ ] Issue description (line X)

### Suggestions
- Consider doing X instead of Y
- This pattern is cleaner: [example]

### What's Good
- [Positive feedback on well-written code]
```

## Review Principles

1. **Be specific.** "This is wrong" → "This will throw if user is null (line 42)"
2. **Explain why.** "Use const" → "Use const because this value never changes"
3. **Offer alternatives.** Don't just criticize, suggest better approaches
4. **Acknowledge good code.** Point out what's done well

## When to Use This Skill

Invoke `/review` when:
- Want code changes reviewed before committing
- Reviewing a PR or diff
- Want a second opinion on implementation
- Checking for security issues
