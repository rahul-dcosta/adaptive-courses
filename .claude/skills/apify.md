# Apify Skill

Use Apify actors to scrape web data for course generation.

## What is Apify

Apify is a web scraping platform with pre-built "actors" that scrape specific sites:
- LinkedIn Jobs
- Google Maps businesses
- Indeed job postings
- Glassdoor reviews
- Company websites
- And 1000s more

## Use Cases for Adaptive Courses

### Job Interview Prep
1. User says "I have an interview at [Company] for [Role]"
2. Scrape LinkedIn/Indeed for that exact job posting
3. Scrape company info, Glassdoor reviews, recent news
4. Generate course with real interview questions for that role

### Company/Industry Research
1. User wants to learn about an industry
2. Scrape Google Maps for businesses in that space
3. Scrape news, trends, key players
4. Generate contextual course

### Skill Gap Analysis
1. Scrape job postings for target role
2. Extract required skills
3. Compare to user's current skills
4. Generate courses to fill gaps

## API Integration

### Setup
```bash
# Install Apify client
npm install apify-client
```

### Environment Variable
```
APIFY_API_TOKEN=your_token_here
```

### Basic Usage
```typescript
import { ApifyClient } from 'apify-client';

const client = new ApifyClient({
  token: process.env.APIFY_API_TOKEN,
});

// Run an actor
const run = await client.actor('apify/google-search-scraper').call({
  queries: ['software engineer interview questions'],
  maxPagesPerQuery: 1,
});

// Get results
const { items } = await client.dataset(run.defaultDatasetId).listItems();
```

## Useful Actors

| Actor | Use Case | Actor ID |
|-------|----------|----------|
| Google Search | Research topics | `apify/google-search-scraper` |
| LinkedIn Jobs | Job postings | `bebity/linkedin-jobs-scraper` |
| Indeed Scraper | Job postings | `misceres/indeed-scraper` |
| Google Maps | Local businesses | `compass/crawler-google-places` |
| Website Content | Company pages | `apify/website-content-crawler` |
| Glassdoor | Company reviews | `epctex/glassdoor-scraper` |

## Workflow Example

```typescript
// 1. User input
const userInput = {
  company: "Stripe",
  role: "Senior Software Engineer",
  interviewDate: "next week"
};

// 2. Scrape job posting
const jobData = await scrapeLinkedInJob(userInput.company, userInput.role);

// 3. Scrape company info
const companyData = await scrapeCompanyInfo(userInput.company);

// 4. Generate course with real context
const course = await generateCourse({
  topic: `${userInput.role} Interview at ${userInput.company}`,
  context: {
    jobRequirements: jobData.requirements,
    companyMission: companyData.mission,
    recentNews: companyData.news,
    glassdoorInsights: companyData.reviews
  }
});
```

## Rate Limits & Costs

- Apify has a free tier (small usage)
- Pay-as-you-go for more
- Cache results to avoid re-scraping same data
- Set reasonable limits on scraping frequency

## When to Use This Skill

Invoke `/apify` when:
- Need to scrape web data for course generation
- Want to enrich courses with real job postings
- Building interview prep with company-specific data
- Researching industries or companies programmatically
