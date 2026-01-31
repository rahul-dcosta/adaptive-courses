# Testing Guide

## Manual Testing Checklist

### Landing Page
- [ ] Page loads quickly (<2 seconds)
- [ ] Hero copy is clear and compelling
- [ ] Email input accepts valid emails
- [ ] Email input rejects invalid formats
- [ ] "Start Learning" button works
- [ ] "How it Works" section visible
- [ ] Testimonials display properly
- [ ] Footer links work (Terms, Privacy, FAQ, Contact)
- [ ] Mobile responsive (test on phone)

### Email Capture
- [ ] Email saves to database (check Supabase)
- [ ] No duplicate emails (unique constraint)
- [ ] Transition to course builder is smooth
- [ ] Analytics event fires (`email_signup`)

### Course Builder - Onboarding
- [ ] Topic input accepts text
- [ ] Topic input requires non-empty value
- [ ] "Continue" button is disabled when empty
- [ ] Progress breadcrumbs show correctly
- [ ] Situation buttons display with emojis
- [ ] Timeline buttons display correctly
- [ ] Goal buttons work
- [ ] Each button click advances the flow
- [ ] Back navigation works (breadcrumbs)

### Course Generation
- [ ] Loading spinner shows
- [ ] "Crafting your course..." message displays
- [ ] Generation takes 30-90 seconds
- [ ] Success: Course displays properly
- [ ] Failure: Error message shows
- [ ] Analytics events fire:
  - `course_started` (on submit)
  - `course_generated` (on success)

### Course Display
- [ ] Course title displays prominently
- [ ] Estimated time shows (if provided)
- [ ] Modules numbered correctly
- [ ] Lessons formatted with headings
- [ ] Quiz questions display
- [ ] "Show answer" toggle works
- [ ] Next steps section shows (if provided)
- [ ] Icons render properly
- [ ] Mobile responsive layout
- [ ] "Download PDF" button shows (alerts "coming soon")
- [ ] "Email Me This" button shows (alerts "coming soon")
- [ ] "Generate Another Course" resets flow
- [ ] "Back to Home" returns to landing page

### API Endpoints

#### `/api/test-api` (GET)
```bash
curl https://adaptive-courses.vercel.app/api/test-api
```
Expected: `{ "success": true, "response": "...", "model": "claude-sonnet-4-5-20250929" }`

#### `/api/generate-course` (POST)
```bash
curl -X POST https://adaptive-courses.vercel.app/api/generate-course \
  -H "Content-Type: application/json" \
  -d '{
    "topic": "manufacturing basics",
    "skillLevel": "intermediate",
    "goal": "sound smart",
    "timeAvailable": "2 hours"
  }'
```
Expected: `{ "success": true, "course": {...}, "courseId": "..." }`

#### `/api/track` (POST)
```bash
curl -X POST https://adaptive-courses.vercel.app/api/track \
  -H "Content-Type: application/json" \
  -d '{
    "event": "test_event",
    "properties": { "test": true }
  }'
```
Expected: `{ "success": true }`

### Database Checks

#### Verify email signups saved
```sql
SELECT * FROM email_signups ORDER BY created_at DESC LIMIT 10;
```

#### Verify courses saved
```sql
SELECT id, topic, skill_level, goal, paid, created_at 
FROM courses 
ORDER BY created_at DESC 
LIMIT 10;
```

#### Check analytics events
```sql
SELECT event_name, properties, created_at 
FROM analytics_events 
ORDER BY created_at DESC 
LIMIT 20;
```

### Performance Testing

#### Page Load Time
- Use Chrome DevTools → Network tab
- Target: <2 seconds on 3G
- Check: First Contentful Paint, Largest Contentful Paint

#### Course Generation Time
- Measure from button click to course display
- Target: 30-90 seconds
- Log: Check Vercel function logs for duration

#### Lighthouse Score
```bash
npm install -g lighthouse
lighthouse https://adaptive-courses.vercel.app --view
```
Target:
- Performance: >90
- Accessibility: >95
- Best Practices: >90
- SEO: >90

### Browser Compatibility
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile Safari (iOS)
- [ ] Mobile Chrome (Android)

### Error Scenarios

#### Invalid API Key
1. Set `ANTHROPIC_API_KEY` to invalid value
2. Try generating course
3. Expected: Error message "Failed to generate course: ..."

#### Network Timeout
1. Disconnect internet mid-generation
2. Expected: Error message, return to topic step

#### Malformed Input
1. Submit topic with SQL injection attempt: `'; DROP TABLE courses; --`
2. Expected: No error, treated as normal text
3. Verify in database that course was created safely

#### Rate Limiting
1. Generate 10 courses rapidly
2. Expected: Either success or graceful degradation (not crash)

### Mobile Testing

#### iPhone (Safari)
- [ ] All text readable (font size adequate)
- [ ] Buttons tappable (not too small)
- [ ] No horizontal scroll
- [ ] Form inputs work (no zoom on focus)

#### Android (Chrome)
- [ ] Same checks as iPhone
- [ ] Material Design buttons render correctly

---

## Automated Testing (TODO)

### Unit Tests (Jest + React Testing Library)
```bash
# Install
npm install --save-dev jest @testing-library/react @testing-library/jest-dom

# Run tests
npm test
```

### E2E Tests (Playwright)
```bash
# Install
npm install --save-dev @playwright/test

# Run tests
npx playwright test
```

### Example E2E Test
```typescript
import { test, expect } from '@playwright/test';

test('complete course generation flow', async ({ page }) => {
  await page.goto('https://adaptive-courses.vercel.app');
  
  // Email capture
  await page.fill('input[type="email"]', 'test@example.com');
  await page.click('button:has-text("Start Learning")');
  
  // Topic input
  await page.fill('input[placeholder*="manufacturing"]', 'supply chain basics');
  await page.click('button:has-text("Continue")');
  
  // Situation
  await page.click('button:has-text("Job interview")');
  
  // Timeline
  await page.click('button:has-text("This week")');
  
  // Goal
  await page.click('button:has-text("Sound smart")');
  
  // Wait for course generation (max 2 minutes)
  await page.waitForSelector('h1', { timeout: 120000 });
  
  // Verify course displayed
  const courseTitle = await page.textContent('h1');
  expect(courseTitle).toBeTruthy();
});
```

---

## Load Testing

### Using Apache Bench
```bash
# Test landing page
ab -n 100 -c 10 https://adaptive-courses.vercel.app/

# Test API endpoint
ab -n 10 -c 2 -p payload.json -T application/json \
   https://adaptive-courses.vercel.app/api/generate-course
```

### Using Artillery
```yaml
# artillery.yml
config:
  target: 'https://adaptive-courses.vercel.app'
  phases:
    - duration: 60
      arrivalRate: 10

scenarios:
  - name: "Generate course"
    flow:
      - get:
          url: "/"
      - post:
          url: "/api/generate-course"
          json:
            topic: "test"
            skillLevel: "beginner"
            goal: "learn"
            timeAvailable: "1 hour"
```

```bash
npm install -g artillery
artillery run artillery.yml
```

---

## Pre-Launch Final Checks

- [ ] All API keys set in Vercel
- [ ] Database migrations run
- [ ] Terms & Privacy pages live
- [ ] FAQ page complete
- [ ] Meta tags/SEO configured
- [ ] Favicon displays
- [ ] Analytics tracking works
- [ ] Error monitoring setup (Sentry)
- [ ] Stripe integration tested (sandbox)
- [ ] Email delivery tested
- [ ] PDF export tested
- [ ] Mobile experience polished
- [ ] Load test passed (100+ concurrent users)
- [ ] Lighthouse score >85
- [ ] No console errors
- [ ] No broken links
