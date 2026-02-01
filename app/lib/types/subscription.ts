// Subscription & User Types
// See /docs/BUSINESS-MODEL.md for full context

export type PlanType = 'free' | 'per_course' | 'pro';
export type SubscriptionPlan = 'monthly' | 'annual';
export type SubscriptionStatus = 'active' | 'canceled' | 'past_due' | 'trialing';
export type PurchaseType = 'free' | 'purchased' | 'subscription';

export interface User {
  id: string;
  email: string;
  name?: string;
  plan: PlanType;
  stripeCustomerId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Subscription {
  id: string;
  userId: string;
  stripeSubscriptionId: string;
  plan: SubscriptionPlan;
  status: SubscriptionStatus;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  createdAt: string;
}

export interface OwnedCourse {
  id: string;
  userId: string;
  courseId: string;
  courseTitle: string;
  purchaseType: PurchaseType;
  purchasedAt: string;
  // For per-course users: track daily AI prompts
  aiPromptsUsedToday: number;
  aiPromptsLastReset: string; // ISO date string
}

export interface AIUsage {
  userId: string;
  courseId?: string; // null = global usage (for pro users)
  promptsToday: number;
  promptsAllTime: number;
  lastPromptAt: string;
}

// Plan limits
export const PLAN_LIMITS = {
  free: {
    maxCourses: 1,
    aiPromptsPerDay: 0, // 5 total lifetime, tracked separately
    aiPromptsLifetime: 5,
    pdfExport: false,
    emailDelivery: false,
    priorityGeneration: false,
  },
  per_course: {
    maxCourses: Infinity, // pay per course
    aiPromptsPerDay: 10, // per course
    aiPromptsLifetime: Infinity,
    pdfExport: true,
    emailDelivery: true,
    priorityGeneration: false,
  },
  pro: {
    maxCourses: Infinity,
    aiPromptsPerDay: 50, // global across all courses
    aiPromptsLifetime: Infinity,
    pdfExport: true,
    emailDelivery: true,
    priorityGeneration: true,
  },
} as const;

// Stripe price IDs (to be configured)
export const STRIPE_PRICES = {
  per_course: process.env.NEXT_PUBLIC_STRIPE_PRICE_COURSE || 'price_xxx',
  pro_monthly: process.env.NEXT_PUBLIC_STRIPE_PRICE_PRO_MONTHLY || 'price_xxx',
  pro_annual: process.env.NEXT_PUBLIC_STRIPE_PRICE_PRO_ANNUAL || 'price_xxx',
} as const;

// Helper functions
export function canGenerateCourse(user: User, ownedCourses: OwnedCourse[]): boolean {
  if (user.plan === 'pro') return true;
  if (user.plan === 'free' && ownedCourses.length === 0) return true;
  // per_course users can always buy more
  return user.plan === 'per_course';
}

export function canUseAIChat(
  user: User,
  courseId: string,
  ownedCourses: OwnedCourse[],
  freePromptsUsed: number,
  globalPromptsUsedToday: number = 0
): { allowed: boolean; remaining: number; reason?: string } {
  const limits = PLAN_LIMITS[user.plan];

  // Pro: global daily limit across all courses
  if (user.plan === 'pro') {
    const remaining = limits.aiPromptsPerDay - globalPromptsUsedToday;
    if (remaining <= 0) {
      return {
        allowed: false,
        remaining: 0,
        reason: `Daily prompt limit (${limits.aiPromptsPerDay}) reached. Resets at midnight UTC.`
      };
    }
    return { allowed: true, remaining };
  }

  if (user.plan === 'free') {
    const remaining = limits.aiPromptsLifetime - freePromptsUsed;
    if (remaining <= 0) {
      return {
        allowed: false,
        remaining: 0,
        reason: 'You\'ve used all 5 free AI prompts. Upgrade to continue chatting.'
      };
    }
    return { allowed: true, remaining };
  }

  // per_course: check daily limit for this specific course
  const course = ownedCourses.find(c => c.courseId === courseId);
  if (!course) {
    return {
      allowed: false,
      remaining: 0,
      reason: 'You don\'t own this course.'
    };
  }

  const remaining = limits.aiPromptsPerDay - course.aiPromptsUsedToday;
  if (remaining <= 0) {
    return {
      allowed: false,
      remaining: 0,
      reason: 'Daily prompt limit reached. Resets at midnight UTC.'
    };
  }

  return { allowed: true, remaining };
}

export function shouldShowUpgradePrompt(ownedCourses: OwnedCourse[]): boolean {
  // Show upgrade prompt after 2+ course purchases
  const purchasedCourses = ownedCourses.filter(c => c.purchaseType === 'purchased');
  return purchasedCourses.length >= 2;
}

export function getUpgradeMessage(ownedCourses: OwnedCourse[]): string {
  const purchasedCourses = ownedCourses.filter(c => c.purchaseType === 'purchased');
  const spent = purchasedCourses.length * 3.99;

  if (spent >= 7.98) {
    return `You've spent $${spent.toFixed(2)} on courses. For $9.99/month, get Pro and generate unlimited courses.`;
  }

  return 'Upgrade to Pro for unlimited courses and AI chat.';
}
