// Environment configuration helpers

export const env = {
  // App
  NODE_ENV: process.env.NODE_ENV || 'development',
  IS_PRODUCTION: process.env.NODE_ENV === 'production',
  IS_DEVELOPMENT: process.env.NODE_ENV === 'development',
  
  // URLs
  APP_URL: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  
  // Anthropic
  ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY || '',
  
  // Supabase
  SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY || '',
  
  // Stripe
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY || '',
  STRIPE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '',
  STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET || '',
  
  // Email (Resend)
  RESEND_API_KEY: process.env.RESEND_API_KEY || '',
  
  // Analytics
  GA_ID: process.env.NEXT_PUBLIC_GA_ID || '',
  
  // Error Monitoring
  SENTRY_DSN: process.env.NEXT_PUBLIC_SENTRY_DSN || '',
} as const;

// Validation
export function validateEnv(): { valid: boolean; missing: string[] } {
  const required = [
    'ANTHROPIC_API_KEY',
    'SUPABASE_URL',
    'SUPABASE_ANON_KEY',
  ];
  
  const missing = required.filter(key => !env[key as keyof typeof env]);
  
  return {
    valid: missing.length === 0,
    missing
  };
}

// Check if all required env vars are present (server-side only)
if (typeof window === 'undefined' && env.IS_PRODUCTION) {
  const { valid, missing } = validateEnv();
  if (!valid) {
    console.error('Missing required environment variables:', missing.join(', '));
  }
}
