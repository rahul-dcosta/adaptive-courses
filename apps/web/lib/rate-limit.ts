import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import { NextRequest, NextResponse } from 'next/server';

// Initialize Redis client (uses UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN env vars)
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL || '',
  token: process.env.UPSTASH_REDIS_REST_TOKEN || '',
});

// Check if Redis is configured
const isRedisConfigured = !!(
  process.env.UPSTASH_REDIS_REST_URL &&
  process.env.UPSTASH_REDIS_REST_TOKEN
);

// User types for rate limiting
export type UserType = 'anonymous' | 'authenticated' | 'paid';

// Rate limit configuration per endpoint and user type
interface RateLimitConfig {
  anonymous: { requests: number; window: string };
  authenticated: { requests: number; window: string };
  paid: { requests: number; window: string };
}

// Endpoint-specific rate limits
const RATE_LIMITS: Record<string, RateLimitConfig> = {
  'generate-course': {
    anonymous: { requests: 5, window: '1h' },
    authenticated: { requests: 15, window: '1h' },
    paid: { requests: 50, window: '1h' },
  },
  'generate-onboarding-questions': {
    anonymous: { requests: 15, window: '1h' },
    authenticated: { requests: 45, window: '1h' },
    paid: { requests: 150, window: '1h' },
  },
  'email-capture': {
    anonymous: { requests: 3, window: '1h' },
    authenticated: { requests: 5, window: '1h' },
    paid: { requests: 10, window: '1h' },
  },
  'track': {
    anonymous: { requests: 60, window: '1m' },
    authenticated: { requests: 120, window: '1m' },
    paid: { requests: 500, window: '1m' },
  },
};

// Create rate limiters for each endpoint/user type combination
const rateLimiters: Record<string, Ratelimit> = {};

function getRateLimiter(endpoint: string, userType: UserType): Ratelimit | null {
  if (!isRedisConfigured) {
    return null;
  }

  const key = `${endpoint}:${userType}`;

  if (!rateLimiters[key]) {
    const config = RATE_LIMITS[endpoint]?.[userType];
    if (!config) {
      return null;
    }

    // Parse window string to duration
    const windowMs = parseWindow(config.window);

    rateLimiters[key] = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(config.requests, `${windowMs}ms`),
      prefix: `ratelimit:${endpoint}`,
      analytics: true,
    });
  }

  return rateLimiters[key];
}

// Parse window string like "1h", "1m", "30s" to milliseconds
function parseWindow(window: string): number {
  const match = window.match(/^(\d+)(s|m|h|d)$/);
  if (!match) return 60000; // Default 1 minute

  const value = parseInt(match[1]);
  const unit = match[2];

  switch (unit) {
    case 's': return value * 1000;
    case 'm': return value * 60 * 1000;
    case 'h': return value * 60 * 60 * 1000;
    case 'd': return value * 24 * 60 * 60 * 1000;
    default: return 60000;
  }
}

// Get client IP from request
export function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');

  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }

  if (realIP) {
    return realIP;
  }

  return 'unknown';
}

// Determine user type from request (can be extended to check auth tokens, etc.)
export function getUserType(request: NextRequest): UserType {
  // Check for paid user cookie/header (implement based on your auth system)
  const isPaid = request.headers.get('x-user-paid') === 'true';
  if (isPaid) return 'paid';

  // Check for authenticated user (implement based on your auth system)
  const authToken = request.cookies.get('auth-token')?.value;
  if (authToken) return 'authenticated';

  return 'anonymous';
}

// Rate limit result
export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number; // Unix timestamp when limit resets
  retryAfter?: number; // Seconds until retry is allowed
}

// Check rate limit for a request
export async function checkRateLimit(
  request: NextRequest,
  endpoint: string,
  userType?: UserType
): Promise<RateLimitResult> {
  // If Redis is not configured, allow all requests (graceful degradation)
  if (!isRedisConfigured) {
    console.warn('[RateLimit] Redis not configured - allowing request');
    return {
      success: true,
      limit: 999,
      remaining: 999,
      reset: Date.now() + 3600000,
    };
  }

  const finalUserType = userType || getUserType(request);
  const ip = getClientIP(request);
  const identifier = `${ip}:${finalUserType}`;

  const limiter = getRateLimiter(endpoint, finalUserType);

  if (!limiter) {
    // No rate limit configured for this endpoint
    return {
      success: true,
      limit: 999,
      remaining: 999,
      reset: Date.now() + 3600000,
    };
  }

  try {
    const result = await limiter.limit(identifier);

    return {
      success: result.success,
      limit: result.limit,
      remaining: result.remaining,
      reset: result.reset,
      retryAfter: result.success ? undefined : Math.ceil((result.reset - Date.now()) / 1000),
    };
  } catch (error) {
    // If rate limiting fails, allow the request (fail open)
    console.error('[RateLimit] Error checking rate limit:', error);
    return {
      success: true,
      limit: 999,
      remaining: 999,
      reset: Date.now() + 3600000,
    };
  }
}

// Create rate limit error response
export function rateLimitResponse(result: RateLimitResult, endpoint: string): NextResponse {
  const config = RATE_LIMITS[endpoint];
  const windowText = config?.anonymous?.window || '1 hour';

  const response = NextResponse.json(
    {
      error: 'Rate limit exceeded',
      message: `You've made too many requests. Please wait ${result.retryAfter} seconds before trying again.`,
      retryAfter: result.retryAfter,
      limit: result.limit,
      reset: new Date(result.reset).toISOString(),
    },
    { status: 429 }
  );

  // Add standard rate limit headers
  response.headers.set('X-RateLimit-Limit', result.limit.toString());
  response.headers.set('X-RateLimit-Remaining', result.remaining.toString());
  response.headers.set('X-RateLimit-Reset', result.reset.toString());
  if (result.retryAfter) {
    response.headers.set('Retry-After', result.retryAfter.toString());
  }

  return response;
}

// Convenience function to apply rate limiting in a route
export async function withRateLimit(
  request: NextRequest,
  endpoint: string,
  handler: () => Promise<NextResponse>
): Promise<NextResponse> {
  const rateLimitResult = await checkRateLimit(request, endpoint);

  if (!rateLimitResult.success) {
    return rateLimitResponse(rateLimitResult, endpoint);
  }

  // Execute the handler and add rate limit headers to response
  const response = await handler();

  response.headers.set('X-RateLimit-Limit', rateLimitResult.limit.toString());
  response.headers.set('X-RateLimit-Remaining', rateLimitResult.remaining.toString());
  response.headers.set('X-RateLimit-Reset', rateLimitResult.reset.toString());

  return response;
}

// Export rate limit config for documentation/testing
export { RATE_LIMITS };
