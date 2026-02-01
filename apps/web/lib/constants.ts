// Application constants

export const APP_NAME = 'Adaptive Courses';
export const APP_DESCRIPTION = 'AI-powered courses that understand your situation, not just your skill level';
export const APP_URL = 'https://adaptivecourses.ai';
export const SUPPORT_EMAIL = 'support@adaptive-courses.com';

export const PRICING = {
  COURSE_PRICE: 3.99, // $3.99 per course after first free one
  FIRST_COURSE_FREE: true,
  CURRENCY: 'USD',
  STRIPE_FEE_PERCENT: 0.029,
  STRIPE_FEE_FIXED: 0.30
} as const;

export const API = {
  MAX_COURSE_GENERATION_TIME_MS: 90000, // 90 seconds
  RATE_LIMIT_REQUESTS: 10,
  RATE_LIMIT_WINDOW_MS: 60000, // 1 minute
  MAX_TOPIC_LENGTH: 200,
  MAX_GOAL_LENGTH: 500,
  MIN_COURSE_MODULES: 2,
  MAX_COURSE_MODULES: 5
} as const;

export const SITUATIONS = [
  { label: 'Visiting a factory', value: 'visiting_factory', emoji: '🏭' },
  { label: 'Job interview', value: 'job_interview', emoji: '💼' },
  { label: 'Career switch', value: 'career_switch', emoji: '🔄' },
  { label: 'Just curious', value: 'curious', emoji: '🤔' }
] as const;

export const TIMELINES = [
  { label: 'Tomorrow', value: 'tomorrow', emoji: '🔥' },
  { label: 'This week', value: 'this_week', emoji: '📅' },
  { label: 'No rush', value: 'no_rush', emoji: '🧘' }
] as const;

export const GOALS = [
  { label: 'Sound smart', value: 'sound_smart', emoji: '🎯' },
  { label: 'Ask good questions', value: 'ask_questions', emoji: '❓' },
  { label: 'Actually understand it', value: 'understand', emoji: '🧠' }
] as const;

export const SKILL_LEVELS = ['beginner', 'intermediate', 'advanced'] as const;

export const CACHE_TTL = {
  STATS: 300, // 5 minutes
  HEALTH: 60, // 1 minute
  FEEDBACK: 600 // 10 minutes
} as const;

export const ANALYTICS_EVENTS = {
  PAGE_VIEW: 'page_view',
  EMAIL_SIGNUP: 'email_signup',
  COURSE_STARTED: 'course_started',
  COURSE_GENERATED: 'course_generated',
  PAYMENT_INITIATED: 'payment_initiated',
  PAYMENT_COMPLETED: 'payment_completed',
  COURSE_SHARED: 'course_shared',
  FEEDBACK_SUBMITTED: 'feedback_submitted'
} as const;

export const ROUTES = {
  HOME: '/',
  SAMPLE: '/sample',
  FAQ: '/faq',
  TERMS: '/terms',
  PRIVACY: '/privacy',
  TESTIMONIALS: '/testimonials',
  STATS: '/stats',
  DEBUG: '/debug',
  SUCCESS: '/success'
} as const;

export const SOCIAL_LINKS = {
  TWITTER: 'https://twitter.com/adaptivecourses',
  LINKEDIN: 'https://linkedin.com/company/adaptive-courses',
  GITHUB: 'https://github.com/rahul-dcosta/adaptive-courses'
} as const;

export const SEO = {
  DEFAULT_TITLE: 'Adaptive Courses - Learn Anything in 30 Minutes',
  DEFAULT_DESCRIPTION: 'AI-powered courses that understand your situation. First course FREE, then just $3.99 per course. No subscription.',
  KEYWORDS: [
    'AI learning',
    'custom courses',
    'personalized education',
    'Claude AI',
    'learn fast',
    'job interview prep',
    'factory tour preparation',
    'adaptive learning'
  ],
  OG_IMAGE: '/og-image.png'
} as const;
