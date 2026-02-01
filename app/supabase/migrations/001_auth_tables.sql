-- Adaptive Courses Auth System Migration
-- Run this in Supabase SQL Editor
-- Last updated: 2026-02-01

-- =============================================================================
-- COURSES TABLE (if not exists)
-- =============================================================================

CREATE TABLE IF NOT EXISTS courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  topic TEXT NOT NULL,
  skill_level TEXT,
  goal TEXT,
  time_available TEXT,
  content JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  paid BOOLEAN DEFAULT FALSE
);

CREATE INDEX IF NOT EXISTS idx_courses_user ON courses(user_id);
CREATE INDEX IF NOT EXISTS idx_courses_created ON courses(created_at);

-- =============================================================================
-- USERS TABLE
-- =============================================================================

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  email_verified BOOLEAN DEFAULT FALSE,
  email_verified_at TIMESTAMPTZ,
  name TEXT,
  avatar_url TEXT,
  plan TEXT DEFAULT 'free' CHECK (plan IN ('free', 'per_course', 'unlimited')),
  status TEXT DEFAULT 'pending_verification' CHECK (status IN ('pending_verification', 'active', 'inactive', 'suspended')),
  stripe_customer_id TEXT,
  google_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  last_login_at TIMESTAMPTZ
);

-- Trigger to update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =============================================================================
-- OTP VERIFICATIONS
-- =============================================================================

CREATE TABLE IF NOT EXISTS otp_verifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  code_hash TEXT NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  attempts INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Auto-delete expired OTPs (run via cron or scheduled function)
CREATE INDEX idx_otp_email ON otp_verifications(email);
CREATE INDEX idx_otp_expires ON otp_verifications(expires_at);

-- =============================================================================
-- MAGIC LINK VERIFICATIONS
-- =============================================================================

CREATE TABLE IF NOT EXISTS magic_link_verifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  token_hash TEXT NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  used BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_magic_link_email ON magic_link_verifications(email);
CREATE INDEX idx_magic_link_expires ON magic_link_verifications(expires_at);

-- =============================================================================
-- AUTH SESSIONS
-- =============================================================================

CREATE TABLE IF NOT EXISTS auth_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token_hash TEXT NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_active_at TIMESTAMPTZ DEFAULT NOW(),
  user_agent TEXT,
  ip_address TEXT
);

CREATE INDEX idx_sessions_user ON auth_sessions(user_id);
CREATE INDEX idx_sessions_token ON auth_sessions(token_hash);
CREATE INDEX idx_sessions_expires ON auth_sessions(expires_at);

-- =============================================================================
-- DEVICE FINGERPRINTS (Abuse Tracking)
-- =============================================================================

CREATE TABLE IF NOT EXISTS device_fingerprints (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  fingerprint_hash TEXT UNIQUE NOT NULL,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  free_courses_generated INTEGER DEFAULT 0,
  first_seen_at TIMESTAMPTZ DEFAULT NOW(),
  last_seen_at TIMESTAMPTZ DEFAULT NOW(),
  ip_addresses TEXT[] DEFAULT '{}',
  suspicious BOOLEAN DEFAULT FALSE,
  suspicious_reason TEXT
);

CREATE INDEX idx_fingerprint_hash ON device_fingerprints(fingerprint_hash);
CREATE INDEX idx_fingerprint_user ON device_fingerprints(user_id);

-- Function to increment free courses generated
CREATE OR REPLACE FUNCTION increment_free_courses(fp_hash TEXT)
RETURNS VOID AS $$
BEGIN
  UPDATE device_fingerprints
  SET free_courses_generated = free_courses_generated + 1,
      last_seen_at = NOW()
  WHERE fingerprint_hash = fp_hash;
END;
$$ LANGUAGE plpgsql;

-- =============================================================================
-- OWNED COURSES
-- =============================================================================

CREATE TABLE IF NOT EXISTS owned_courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  course_title TEXT NOT NULL,
  purchase_type TEXT NOT NULL CHECK (purchase_type IN ('free', 'purchased', 'subscription')),
  purchased_at TIMESTAMPTZ DEFAULT NOW(),
  ai_prompts_used_today INTEGER DEFAULT 0,
  ai_prompts_last_reset DATE DEFAULT CURRENT_DATE,
  UNIQUE(user_id, course_id)
);

CREATE INDEX idx_owned_courses_user ON owned_courses(user_id);
CREATE INDEX idx_owned_courses_course ON owned_courses(course_id);

-- Function to reset daily AI prompts (call via cron at midnight UTC)
CREATE OR REPLACE FUNCTION reset_daily_ai_prompts()
RETURNS VOID AS $$
BEGIN
  UPDATE owned_courses
  SET ai_prompts_used_today = 0,
      ai_prompts_last_reset = CURRENT_DATE
  WHERE ai_prompts_last_reset < CURRENT_DATE;
END;
$$ LANGUAGE plpgsql;

-- =============================================================================
-- SUBSCRIPTIONS
-- =============================================================================

CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  stripe_subscription_id TEXT UNIQUE NOT NULL,
  plan TEXT NOT NULL CHECK (plan IN ('monthly', 'annual')),
  tier TEXT NOT NULL CHECK (tier IN ('unlimited')),
  status TEXT NOT NULL CHECK (status IN ('active', 'canceled', 'past_due', 'trialing')),
  current_period_start TIMESTAMPTZ NOT NULL,
  current_period_end TIMESTAMPTZ NOT NULL,
  cancel_at_period_end BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_subscriptions_user ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_stripe ON subscriptions(stripe_subscription_id);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);

-- =============================================================================
-- AI USAGE TRACKING
-- =============================================================================

CREATE TABLE IF NOT EXISTS ai_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  course_id UUID REFERENCES courses(id) ON DELETE SET NULL,
  prompts_today INTEGER DEFAULT 0,
  prompts_all_time INTEGER DEFAULT 0,
  last_prompt_at TIMESTAMPTZ,
  last_reset_date DATE DEFAULT CURRENT_DATE,
  UNIQUE(user_id, course_id)
);

CREATE INDEX idx_ai_usage_user ON ai_usage(user_id);

-- Function to increment AI usage
CREATE OR REPLACE FUNCTION increment_ai_usage(p_user_id UUID, p_course_id UUID)
RETURNS TABLE(prompts_today INTEGER, prompts_all_time INTEGER) AS $$
DECLARE
  v_record ai_usage%ROWTYPE;
BEGIN
  -- Get or create record
  SELECT * INTO v_record FROM ai_usage
  WHERE user_id = p_user_id AND (course_id = p_course_id OR (course_id IS NULL AND p_course_id IS NULL));

  IF NOT FOUND THEN
    INSERT INTO ai_usage (user_id, course_id, prompts_today, prompts_all_time, last_prompt_at)
    VALUES (p_user_id, p_course_id, 1, 1, NOW())
    RETURNING * INTO v_record;
  ELSE
    -- Reset if new day
    IF v_record.last_reset_date < CURRENT_DATE THEN
      UPDATE ai_usage
      SET prompts_today = 1,
          prompts_all_time = prompts_all_time + 1,
          last_prompt_at = NOW(),
          last_reset_date = CURRENT_DATE
      WHERE id = v_record.id
      RETURNING * INTO v_record;
    ELSE
      UPDATE ai_usage
      SET prompts_today = prompts_today + 1,
          prompts_all_time = prompts_all_time + 1,
          last_prompt_at = NOW()
      WHERE id = v_record.id
      RETURNING * INTO v_record;
    END IF;
  END IF;

  RETURN QUERY SELECT v_record.prompts_today, v_record.prompts_all_time;
END;
$$ LANGUAGE plpgsql;

-- =============================================================================
-- CLEANUP FUNCTIONS
-- =============================================================================

-- Delete expired OTPs (run every hour)
CREATE OR REPLACE FUNCTION cleanup_expired_otps()
RETURNS INTEGER AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  DELETE FROM otp_verifications WHERE expires_at < NOW();
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- Delete expired magic links (run every hour)
CREATE OR REPLACE FUNCTION cleanup_expired_magic_links()
RETURNS INTEGER AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  DELETE FROM magic_link_verifications WHERE expires_at < NOW();
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- Delete expired sessions (run daily)
CREATE OR REPLACE FUNCTION cleanup_expired_sessions()
RETURNS INTEGER AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  DELETE FROM auth_sessions WHERE expires_at < NOW();
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- =============================================================================
-- ROW LEVEL SECURITY (RLS)
-- =============================================================================

-- Enable RLS on all tables
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE otp_verifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE magic_link_verifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE auth_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE device_fingerprints ENABLE ROW LEVEL SECURITY;
ALTER TABLE owned_courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_usage ENABLE ROW LEVEL SECURITY;

-- Service role bypasses RLS (for server-side operations)
-- Public users have no direct access (all access through API routes)

-- =============================================================================
-- GRANTS
-- =============================================================================

-- Grant service_role full access
GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO service_role;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO service_role;
