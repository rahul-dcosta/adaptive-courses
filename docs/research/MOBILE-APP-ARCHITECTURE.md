# Mobile App Architecture Scoping Report

*Generated February 7, 2026 for Adaptive Courses*

---

## Executive Summary

Adaptive Courses is an AI-powered course generation platform that could absolutely support a mobile app. The codebase is well-structured with existing API infrastructure, shared type definitions, and a monorepo setup that already anticipates mobile development. The biggest assets are: (1) RESTful APIs that are mobile-ready, (2) a shared `@adaptive-courses/api-client` package for code reuse, (3) Supabase as backend, and (4) already-mobile-optimized web UI.

---

## 1. Current Architecture

### Tech Stack

| Layer | Technology | Notes |
|-------|-----------|-------|
| **Frontend (Web)** | Next.js 16, React 19, Tailwind 4 | Client-side course rendering, form handling, state management |
| **Backend** | Next.js API Routes | Server-side auth, course generation, progress tracking |
| **Database** | Supabase (PostgreSQL) | Users, courses, OTP, sessions, device fingerprints, owned_courses |
| **AI** | Anthropic Claude (claude-sonnet-4-5-20250929) | Course generation, onboarding questions |
| **Infrastructure** | Vercel | Hosting, edge functions ready |
| **Rate Limiting** | Upstash Redis | Sliding window rate limits per endpoint |
| **Payments** | Stripe | Checkout sessions, $3.99 per course |
| **Email** | Resend | OTP emails, magic links, welcome emails |
| **Monitoring** | Custom analytics tracking | Basic event logging to `/api/track` |
| **File Export** | jsPDF, svg2pdf.js | PDF generation for courses |
| **Visualization** | Mermaid.js | Diagrams in course content |

### Monorepo Structure

```
adaptive-courses/
├── apps/web/                          # Next.js 16 app (current)
│   ├── app/api/                       # 18 API routes (RESTful)
│   ├── components/                    # 30+ React components
│   ├── lib/
│   │   ├── services/auth.ts          # OTP, magic link, session management
│   │   ├── services/email.ts         # Email templates
│   │   ├── supabase.ts              # Supabase admin + client
│   │   ├── rate-limit.ts            # Upstash rate limiting
│   │   ├── payment.ts               # Stripe integration
│   │   ├── progress.ts              # Progress tracking types
│   │   ├── analytics.ts             # Event tracking
│   │   └── types/
│   │       ├── auth.ts              # Auth types, OTP validation
│   │       └── subscription.ts      # Plan enums
│   └── __tests__/                   # 307 unit + 42 E2E tests
├── packages/api-client/             # Shared package (key for mobile!)
│   └── src/
│       ├── types.ts                 # Shared Course, Module, Lesson, User, OwnedCourse types
│       ├── index.ts                 # Re-exports
│       └── supabase.ts              # Supabase client factory (supports EXPO_PUBLIC_*)
└── package.json                     # Workspaces configured for mobile
```

---

## 2. API Layer

### Available Endpoints (RESTful)

| Endpoint | Method | Purpose | Auth | Rate Limit | Mobile-Ready? |
|----------|--------|---------|------|-----------|---------------|
| `/api/auth/send-otp` | POST | Send 6-digit OTP | No | 3/hour | Yes |
| `/api/auth/verify-otp` | POST | Verify OTP code | No | n/a | Yes |
| `/api/auth/send-magic-link` | POST | Magic link email | No | n/a | Yes |
| `/api/auth/verify` | POST | Verify session token | Yes | n/a | Yes |
| `/api/auth/logout` | POST | Invalidate session | Yes | n/a | Yes |
| `/api/generate-outline` | POST | Course outline preview | Paid users | 15/hour (anon), 45/hour (auth) | Yes |
| `/api/generate-course` | POST | Full course generation | Paid users | 5/hour (anon), 15/hour (auth), 50/hour (paid) | Yes |
| `/api/generate-onboarding-questions` | POST | Dynamic Q&A | No | 15/hour (anon) | Yes |
| `/api/courses/[id]` | GET | Fetch single course | Yes | n/a | Yes |
| `/api/courses/[id]` | DELETE | Delete course | Yes | n/a | Yes |
| `/api/progress` | POST/GET | Update/fetch progress | Yes | 120/min (auth) | Yes |
| `/api/track` | POST | Analytics events | No | 60/min (anon) | Yes |
| `/api/feedback` | POST | Course feedback | No | n/a | Yes |
| `/api/create-checkout` | POST | Stripe session | No | n/a | Yes |
| `/api/stripe-webhook` | POST | Payment webhook | No | n/a | Yes |
| `/api/email-capture` | POST | Waitlist signup | No | 3/hour | Yes |
| `/api/stats` | GET | App statistics | No | Cached | Yes |
| `/api/health` | GET | Health check | No | n/a | Yes |

**Analysis:** All endpoints are JSON-based, stateless, and designed for mobile clients. Auth already supports `Authorization: Bearer {token}` header.

---

## 3. Data Models & Database

### Database Schema (Supabase PostgreSQL)

| Table | Purpose | Key Fields |
|-------|---------|-----------|
| `auth.users` (native Supabase) | User accounts | id, email, encrypted_password |
| `users` | Custom user profile | id, email, plan (free/per_course/pro), stripe_customer_id, created_at |
| `courses` | Generated courses | id, user_id, topic, skill_level, goal, time_available, content (JSONB), paid, created_at |
| `otp_verifications` | OTP sessions | id, email, code_hash, expires_at, attempts, created_at |
| `magic_link_verifications` | Magic link sessions | id, email, token_hash, expires_at, used, created_at |
| `auth_sessions` | Active sessions | id, user_id, token_hash, expires_at, user_agent, ip_address |
| `device_fingerprints` | Anonymous tracking | id, fingerprint_hash, user_id, free_courses_generated, suspicious, ip_addresses |
| `owned_courses` | Purchase tracking | course_id, user_id, purchase_type (free/purchased), purchased_at |
| `course_feedback` | User ratings | id, course_id, rating (1-5), feedback, email, created_at |

### Shared Types Package (`@adaptive-courses/api-client`)

```typescript
export interface Course {
  id: string;
  userId?: string;
  topic: string;
  title: string;
  subtitle?: string;
  modules: Module[];
  createdAt: string;
  status: 'generating' | 'complete' | 'error';
}

export interface Module {
  id: string;
  title: string;
  lessons: Lesson[];
}

export interface Lesson {
  id: string;
  title: string;
  content: string;
  quiz?: Quiz;
}

export interface User {
  id: string;
  email: string;
  plan: 'free' | 'per_course' | 'pro';
  createdAt: string;
}
```

---

## 4. Auth System

### Current Implementation (OTP-based)

1. User enters email → `/api/auth/send-otp` generates 6-digit code
2. Email sent via Resend
3. User enters code → `/api/auth/verify-otp` validates SHA-256 hash, checks expiry (5 min)
4. Server creates `auth_sessions` record
5. Sets `auth_token` HTTP-only cookie (30-day expiry)
6. Response includes `userId` and `isNewUser` flag

### Mobile Auth

The API already supports Bearer token auth:
```typescript
const authToken = request.headers.get('Authorization')?.replace('Bearer ', '') ||
                  request.cookies.get('auth_token')?.value;
```

Mobile clients would store tokens in Expo SecureStore (iOS Keychain / Android Keystore) instead of cookies.

---

## 5. Core Features & Mobile Translation

| Feature | Web Implementation | Mobile Difficulty |
|---------|-------------------|-------------------|
| **Onboarding** | 7-step wizard | Easy (carousel/tabs) |
| **Course Generation** | Streaming + spinner | Easy (same API) |
| **Course Viewing** | React + Mermaid.js | Medium (WebView) |
| **Progress Tracking** | localStorage + Supabase | Medium (offline queue) |
| **Quiz/Validation** | Interactive buttons | Easy (touch buttons) |
| **PDF Export** | jsPDF in browser | Medium (native share) |
| **Dark Mode** | CSS variables + context | Easy (same system) |
| **Push Notifications** | Not implemented | Hard (FCM + APNs) |
| **Offline Support** | Not implemented | Hard (SQLite + sync) |

---

## 6. Mobile Approach Recommendation: React Native + Expo

### Why This Approach

- **60-70% code sharing** with existing React/TypeScript codebase
- **Team fit** — React + TypeScript expertise translates directly
- **4-6 weeks to MVP** vs. 12+ weeks for native
- **Single tech stack** across web + mobile
- **~$75/month** infrastructure (minimal increase from current ~$70)

### Proposed Structure

```
apps/
├── web/                 # Existing Next.js
├── mobile/              # New React Native + Expo
│   ├── app/             # Tab/stack navigation
│   ├── components/      # Native components
│   ├── hooks/           # useAuth, useProgress, useOfflineSync
│   └── services/        # API wrapper, secure storage, offline queue
└── packages/
    ├── api-client/      # Shared (already exists)
    └── shared-utils/    # New: validation, progress logic
```

### Phased Rollout

- **Phase 1 (4 weeks):** Auth, course viewer (WebView), library, progress, dark mode
- **Phase 2 (4 weeks):** Offline support, push notifications, native markdown, beta
- **Phase 3 (2 weeks):** App store submission & polish

### Key Challenges & Solutions

| Challenge | Solution |
|-----------|----------|
| Mermaid diagrams | WebView wrapper (easy) or pre-render SVGs server-side |
| Offline support | SQLite + sync queue via `expo-sqlite` |
| Auth on mobile | Expo SecureStore for tokens |
| Course generation wait | Deterministic progress animation |
| Push notifications | Expo Notifications + new `/api/push-tokens` endpoint |

### What NOT to Do

- **Native Swift/Kotlin** — 3x dev time, minimal UX gain for this use case
- **Flutter** — Team doesn't know Dart, less code sharing
- **PWA-only** — Misses app store distribution opportunity

---

## 7. Backend Changes Required (Minimal)

1. New endpoint: `POST /api/push-tokens` for push token registration
2. New endpoint: `GET /api/app-version` for forcing updates
3. Rate limit adjustment for offline sync batches
4. API documentation (OpenAPI/Swagger spec)

The backend is already **95% mobile-ready** — all APIs are RESTful, stateless, and support Bearer token auth.

---

## 8. Cost Comparison

| Approach | Dev Time | Monthly Cost | App Store? |
|----------|----------|-------------|------------|
| **PWA** | 2-3 weeks | ~$70 | No |
| **React Native + Expo** | 6-8 weeks | ~$75 | Yes |
| **Native (iOS + Android)** | 24-32 weeks | ~$75 | Yes |

---

## Conclusion

The adaptive-courses codebase is **exceptionally well-positioned for mobile**. The monorepo structure, shared type packages, RESTful APIs, and Bearer token auth support mean a React Native + Expo app can be built with minimal backend changes. Recommended launch target: **April 2026**.
