import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

// Public client (for client-side operations)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Server client with service role (for auth operations - server-side only)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

// =============================================================================
// Database Types
// =============================================================================

export type Course = {
  id: string;
  user_id: string;
  topic: string;
  skill_level: string;
  goal: string;
  time_available: string;
  content: any;
  created_at: string;
  paid: boolean;
};

export type UserRow = {
  id: string;
  email: string;
  email_verified: boolean;
  email_verified_at: string | null;
  name: string | null;
  plan: 'free' | 'per_course' | 'unlimited' | 'pro';
  status: 'pending_verification' | 'active' | 'inactive' | 'suspended';
  stripe_customer_id: string | null;
  google_id: string | null;
  created_at: string;
  updated_at: string;
  last_login_at: string | null;
};

export type OTPVerificationRow = {
  id: string;
  email: string;
  code_hash: string;
  expires_at: string;
  attempts: number;
  created_at: string;
};

export type MagicLinkVerificationRow = {
  id: string;
  email: string;
  token_hash: string;
  expires_at: string;
  used: boolean;
  created_at: string;
};

export type AuthSessionRow = {
  id: string;
  user_id: string;
  token_hash: string;
  expires_at: string;
  created_at: string;
  last_active_at: string;
  user_agent: string | null;
  ip_address: string | null;
};

export type DeviceFingerprintRow = {
  id: string;
  fingerprint_hash: string;
  user_id: string | null;
  free_courses_generated: number;
  first_seen_at: string;
  last_seen_at: string;
  ip_addresses: string[];
  suspicious: boolean;
  suspicious_reason: string | null;
};

export type OwnedCourseRow = {
  id: string;
  user_id: string;
  course_id: string;
  course_title: string;
  purchase_type: 'free' | 'purchased' | 'subscription';
  purchased_at: string;
  ai_prompts_used_today: number;
  ai_prompts_last_reset: string;
};

export type SubscriptionRow = {
  id: string;
  user_id: string;
  stripe_subscription_id: string;
  plan: 'monthly' | 'annual';
  tier: 'unlimited' | 'pro';
  status: 'active' | 'canceled' | 'past_due' | 'trialing';
  current_period_start: string;
  current_period_end: string;
  cancel_at_period_end: boolean;
  created_at: string;
};
