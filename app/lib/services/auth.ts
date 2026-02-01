// Authentication Service
// Handles OTP and magic link email verification
// See /docs/BUSINESS-MODEL.md for user flow context

import { supabaseAdmin, UserRow, OTPVerificationRow, MagicLinkVerificationRow, AuthSessionRow, DeviceFingerprintRow } from '../supabase';
import { sendOTPEmail, sendMagicLinkEmail, sendWelcomeEmail } from './email';
import { env } from '../env';
import {
  AuthenticatedUser,
  SendOTPRequest,
  SendOTPResponse,
  VerifyOTPRequest,
  VerifyOTPResponse,
  SendMagicLinkRequest,
  SendMagicLinkResponse,
  generateOTP,
  isValidEmail,
  isDisposableEmail,
  AUTH_RATE_LIMITS,
  AUTH_EXPIRY,
} from '../types/auth';

// =============================================================================
// Crypto Helpers
// =============================================================================

async function hashString(str: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(str);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

function generateToken(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, b => b.toString(16).padStart(2, '0')).join('');
}

// =============================================================================
// OTP Verification Flow
// =============================================================================

export async function sendOTP(request: SendOTPRequest): Promise<SendOTPResponse> {
  const { email, pendingCourseId } = request;
  const normalizedEmail = email.toLowerCase().trim();

  // Validate email
  if (!isValidEmail(normalizedEmail)) {
    return {
      success: false,
      sessionId: '',
      expiresIn: 0,
      error: isDisposableEmail(normalizedEmail)
        ? 'Disposable email addresses are not allowed.'
        : 'Please enter a valid email address.',
    };
  }

  // Check rate limiting
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
  const { count: recentRequests } = await supabaseAdmin
    .from('otp_verifications')
    .select('*', { count: 'exact', head: true })
    .eq('email', normalizedEmail)
    .gte('created_at', oneHourAgo);

  if (recentRequests && recentRequests >= AUTH_RATE_LIMITS.otpRequestsPerHour) {
    return {
      success: false,
      sessionId: '',
      expiresIn: 0,
      error: 'Too many verification requests. Please try again later.',
    };
  }

  // Generate OTP code
  const code = generateOTP();
  const codeHash = await hashString(code);
  const now = new Date();
  const expiresAt = new Date(now.getTime() + AUTH_EXPIRY.otpCode);

  // Store OTP verification in database
  const { data: otpRecord, error: insertError } = await supabaseAdmin
    .from('otp_verifications')
    .insert({
      email: normalizedEmail,
      code_hash: codeHash,
      expires_at: expiresAt.toISOString(),
      attempts: 0,
    })
    .select()
    .single();

  if (insertError) {
    console.error('[AUTH] Failed to create OTP verification:', insertError);
    return {
      success: false,
      sessionId: '',
      expiresIn: 0,
      error: 'Failed to create verification. Please try again.',
    };
  }

  // Send OTP email
  const emailResult = await sendOTPEmail(normalizedEmail, code);
  if (!emailResult.success) {
    // Clean up the OTP record if email failed
    await supabaseAdmin.from('otp_verifications').delete().eq('id', otpRecord.id);
    return {
      success: false,
      sessionId: '',
      expiresIn: 0,
      error: 'Failed to send verification email. Please try again.',
    };
  }

  console.log(`[AUTH] OTP sent to ${normalizedEmail} (session: ${otpRecord.id})`);

  return {
    success: true,
    sessionId: otpRecord.id,
    expiresIn: AUTH_EXPIRY.otpCode / 1000,
  };
}

export async function verifyOTP(request: VerifyOTPRequest): Promise<VerifyOTPResponse> {
  const { sessionId, code } = request;

  // Fetch OTP verification from database
  const { data: verification, error: fetchError } = await supabaseAdmin
    .from('otp_verifications')
    .select('*')
    .eq('id', sessionId)
    .single();

  if (fetchError || !verification) {
    return {
      success: false,
      isNewUser: false,
      error: 'Verification session not found or expired.',
    };
  }

  const otpRecord = verification as OTPVerificationRow;

  // Check expiry
  if (new Date(otpRecord.expires_at) < new Date()) {
    await supabaseAdmin.from('otp_verifications').delete().eq('id', sessionId);
    return {
      success: false,
      isNewUser: false,
      error: 'Verification code has expired. Please request a new one.',
    };
  }

  // Check attempts
  if (otpRecord.attempts >= AUTH_RATE_LIMITS.otpAttemptsPerCode) {
    await supabaseAdmin.from('otp_verifications').delete().eq('id', sessionId);
    return {
      success: false,
      isNewUser: false,
      error: 'Too many incorrect attempts. Please request a new code.',
    };
  }

  // Verify code
  const hashedInput = await hashString(code);
  if (hashedInput !== otpRecord.code_hash) {
    // Increment attempts
    await supabaseAdmin
      .from('otp_verifications')
      .update({ attempts: otpRecord.attempts + 1 })
      .eq('id', sessionId);

    const remaining = AUTH_RATE_LIMITS.otpAttemptsPerCode - otpRecord.attempts - 1;
    return {
      success: false,
      isNewUser: false,
      error: `Incorrect code. ${remaining} attempt${remaining !== 1 ? 's' : ''} remaining.`,
    };
  }

  // Success! Delete the OTP record
  await supabaseAdmin.from('otp_verifications').delete().eq('id', sessionId);

  // Create or get user
  const { user, isNewUser } = await getOrCreateUser(otpRecord.email);

  // Create auth session
  const authToken = generateToken();
  await createAuthSession(user.id, authToken);

  // Send welcome email for new users
  if (isNewUser) {
    await sendWelcomeEmail(user.email);
  }

  console.log(`[AUTH] OTP verified for ${otpRecord.email}, userId: ${user.id}, isNewUser: ${isNewUser}`);

  return {
    success: true,
    userId: user.id,
    authToken,
    isNewUser,
  };
}

// =============================================================================
// Magic Link Verification Flow
// =============================================================================

export async function sendMagicLink(request: SendMagicLinkRequest): Promise<SendMagicLinkResponse> {
  const { email, pendingCourseId, redirectUrl } = request;
  const normalizedEmail = email.toLowerCase().trim();

  // Validate email
  if (!isValidEmail(normalizedEmail)) {
    return {
      success: false,
      sessionId: '',
      error: isDisposableEmail(normalizedEmail)
        ? 'Disposable email addresses are not allowed.'
        : 'Please enter a valid email address.',
    };
  }

  // Check rate limiting
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
  const { count: recentRequests } = await supabaseAdmin
    .from('magic_link_verifications')
    .select('*', { count: 'exact', head: true })
    .eq('email', normalizedEmail)
    .gte('created_at', oneHourAgo);

  if (recentRequests && recentRequests >= AUTH_RATE_LIMITS.magicLinkRequestsPerHour) {
    return {
      success: false,
      sessionId: '',
      error: 'Too many sign-in requests. Please try again later.',
    };
  }

  // Generate magic link token
  const token = generateToken();
  const tokenHash = await hashString(token);
  const now = new Date();
  const expiresAt = new Date(now.getTime() + AUTH_EXPIRY.magicLink);

  // Store magic link verification in database
  const { data: linkRecord, error: insertError } = await supabaseAdmin
    .from('magic_link_verifications')
    .insert({
      email: normalizedEmail,
      token_hash: tokenHash,
      expires_at: expiresAt.toISOString(),
      used: false,
    })
    .select()
    .single();

  if (insertError) {
    console.error('[AUTH] Failed to create magic link:', insertError);
    return {
      success: false,
      sessionId: '',
      error: 'Failed to create sign-in link. Please try again.',
    };
  }

  // Build magic link URL
  const baseUrl = env.APP_URL;
  const magicLink = `${baseUrl}/api/auth/verify?token=${token}&session=${linkRecord.id}${redirectUrl ? `&redirect=${encodeURIComponent(redirectUrl)}` : ''}`;

  // Send magic link email
  const emailResult = await sendMagicLinkEmail(normalizedEmail, magicLink);
  if (!emailResult.success) {
    await supabaseAdmin.from('magic_link_verifications').delete().eq('id', linkRecord.id);
    return {
      success: false,
      sessionId: '',
      error: 'Failed to send sign-in email. Please try again.',
    };
  }

  console.log(`[AUTH] Magic link sent to ${normalizedEmail} (session: ${linkRecord.id})`);

  return {
    success: true,
    sessionId: linkRecord.id,
  };
}

export async function verifyMagicLink(token: string, sessionId: string): Promise<VerifyOTPResponse> {
  // Fetch magic link verification from database
  const { data: verification, error: fetchError } = await supabaseAdmin
    .from('magic_link_verifications')
    .select('*')
    .eq('id', sessionId)
    .single();

  if (fetchError || !verification) {
    return {
      success: false,
      isNewUser: false,
      error: 'Invalid or expired link.',
    };
  }

  const linkRecord = verification as MagicLinkVerificationRow;

  if (linkRecord.used) {
    return {
      success: false,
      isNewUser: false,
      error: 'This link has already been used.',
    };
  }

  if (new Date(linkRecord.expires_at) < new Date()) {
    await supabaseAdmin.from('magic_link_verifications').delete().eq('id', sessionId);
    return {
      success: false,
      isNewUser: false,
      error: 'This link has expired. Please request a new one.',
    };
  }

  // Verify token
  const hashedInput = await hashString(token);
  if (hashedInput !== linkRecord.token_hash) {
    return {
      success: false,
      isNewUser: false,
      error: 'Invalid link.',
    };
  }

  // Mark as used
  await supabaseAdmin
    .from('magic_link_verifications')
    .update({ used: true })
    .eq('id', sessionId);

  // Create or get user
  const { user, isNewUser } = await getOrCreateUser(linkRecord.email);

  // Create auth session
  const authToken = generateToken();
  await createAuthSession(user.id, authToken);

  // Send welcome email for new users
  if (isNewUser) {
    await sendWelcomeEmail(user.email);
  }

  console.log(`[AUTH] Magic link verified for ${linkRecord.email}, userId: ${user.id}, isNewUser: ${isNewUser}`);

  return {
    success: true,
    userId: user.id,
    authToken,
    isNewUser,
  };
}

// =============================================================================
// User Management
// =============================================================================

async function getOrCreateUser(email: string): Promise<{ user: UserRow; isNewUser: boolean }> {
  // Try to find existing user
  const { data: existingUser } = await supabaseAdmin
    .from('users')
    .select('*')
    .eq('email', email)
    .single();

  if (existingUser) {
    // Update last login and mark as active
    await supabaseAdmin
      .from('users')
      .update({
        last_login_at: new Date().toISOString(),
        status: 'active',
        email_verified: true,
        email_verified_at: existingUser.email_verified_at || new Date().toISOString(),
      })
      .eq('id', existingUser.id);

    return { user: existingUser as UserRow, isNewUser: false };
  }

  // Create new user
  const { data: newUser, error: createError } = await supabaseAdmin
    .from('users')
    .insert({
      email,
      email_verified: true,
      email_verified_at: new Date().toISOString(),
      plan: 'free',
      status: 'active',
      last_login_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (createError || !newUser) {
    console.error('[AUTH] Failed to create user:', createError);
    throw new Error('Failed to create user account');
  }

  return { user: newUser as UserRow, isNewUser: true };
}

// =============================================================================
// Session Management
// =============================================================================

export async function createAuthSession(
  userId: string,
  token: string,
  metadata?: { userAgent?: string; ipAddress?: string }
): Promise<AuthSessionRow> {
  const tokenHash = await hashString(token);
  const now = new Date();

  const { data: session, error } = await supabaseAdmin
    .from('auth_sessions')
    .insert({
      user_id: userId,
      token_hash: tokenHash,
      expires_at: new Date(now.getTime() + AUTH_EXPIRY.authSession).toISOString(),
      last_active_at: now.toISOString(),
      user_agent: metadata?.userAgent,
      ip_address: metadata?.ipAddress,
    })
    .select()
    .single();

  if (error || !session) {
    console.error('[AUTH] Failed to create session:', error);
    throw new Error('Failed to create session');
  }

  return session as AuthSessionRow;
}

export async function validateAuthSession(token: string): Promise<AuthenticatedUser | null> {
  const tokenHash = await hashString(token);

  // Find session
  const { data: session } = await supabaseAdmin
    .from('auth_sessions')
    .select('*')
    .eq('token_hash', tokenHash)
    .single();

  if (!session || new Date(session.expires_at) < new Date()) {
    return null;
  }

  // Update last active
  await supabaseAdmin
    .from('auth_sessions')
    .update({ last_active_at: new Date().toISOString() })
    .eq('id', session.id);

  // Get user
  const { data: user } = await supabaseAdmin
    .from('users')
    .select('*')
    .eq('id', session.user_id)
    .single();

  if (!user || user.status === 'suspended') {
    return null;
  }

  return {
    id: user.id,
    email: user.email,
    emailVerified: user.email_verified,
    emailVerifiedAt: user.email_verified_at,
    name: user.name,
    status: user.status,
    createdAt: user.created_at,
    updatedAt: user.updated_at,
    lastLoginAt: user.last_login_at,
  };
}

export async function invalidateAuthSession(token: string): Promise<void> {
  const tokenHash = await hashString(token);
  await supabaseAdmin.from('auth_sessions').delete().eq('token_hash', tokenHash);
}

export async function invalidateAllUserSessions(userId: string): Promise<void> {
  await supabaseAdmin.from('auth_sessions').delete().eq('user_id', userId);
}

// =============================================================================
// Device Fingerprinting (Abuse Tracking)
// =============================================================================

export async function trackDevice(
  fingerprintData: {
    userAgent: string;
    screenResolution: string;
    timezone: string;
    language: string;
    platform: string;
  },
  ipAddress?: string
): Promise<DeviceFingerprintRow> {
  const fingerprintString = JSON.stringify(fingerprintData);
  const fingerprintHash = await hashString(fingerprintString);

  // Try to find existing fingerprint
  const { data: existing } = await supabaseAdmin
    .from('device_fingerprints')
    .select('*')
    .eq('fingerprint_hash', fingerprintHash)
    .single();

  if (existing) {
    // Update last seen and add IP if new
    const ipAddresses = existing.ip_addresses || [];
    if (ipAddress && !ipAddresses.includes(ipAddress)) {
      ipAddresses.push(ipAddress);
      // Keep only last 5 IPs
      while (ipAddresses.length > 5) ipAddresses.shift();
    }

    const { data: updated } = await supabaseAdmin
      .from('device_fingerprints')
      .update({
        last_seen_at: new Date().toISOString(),
        ip_addresses: ipAddresses,
      })
      .eq('id', existing.id)
      .select()
      .single();

    return (updated || existing) as DeviceFingerprintRow;
  }

  // Create new fingerprint
  const { data: newFingerprint, error } = await supabaseAdmin
    .from('device_fingerprints')
    .insert({
      fingerprint_hash: fingerprintHash,
      ip_addresses: ipAddress ? [ipAddress] : [],
    })
    .select()
    .single();

  if (error) {
    console.error('[AUTH] Failed to track device:', error);
    throw new Error('Failed to track device');
  }

  return newFingerprint as DeviceFingerprintRow;
}

export async function checkDeviceAbuse(fingerprintHash: string): Promise<{
  allowed: boolean;
  reason?: string;
}> {
  const { data: fingerprint } = await supabaseAdmin
    .from('device_fingerprints')
    .select('*')
    .eq('fingerprint_hash', fingerprintHash)
    .single();

  if (!fingerprint) {
    return { allowed: true };
  }

  if (fingerprint.suspicious) {
    return {
      allowed: false,
      reason: fingerprint.suspicious_reason || 'Suspicious activity detected.',
    };
  }

  if (fingerprint.free_courses_generated >= 3) {
    return {
      allowed: false,
      reason: 'Free course limit reached. Please create an account to continue.',
    };
  }

  return { allowed: true };
}

export async function incrementFreeCoursesGenerated(fingerprintHash: string): Promise<void> {
  await supabaseAdmin.rpc('increment_free_courses', { fp_hash: fingerprintHash });
}

// =============================================================================
// Inactive Account Handling
// =============================================================================

export async function getInactiveAccounts(): Promise<UserRow[]> {
  const warningThreshold = new Date(Date.now() - AUTH_EXPIRY.inactiveAccountWarning).toISOString();

  const { data: inactiveUsers } = await supabaseAdmin
    .from('users')
    .select('*')
    .eq('status', 'active')
    .lt('last_login_at', warningThreshold);

  return (inactiveUsers || []) as UserRow[];
}

export async function deactivateInactiveAccounts(): Promise<number> {
  const deactivationThreshold = new Date(Date.now() - AUTH_EXPIRY.inactiveAccountDeactivation).toISOString();

  const { data: deactivated } = await supabaseAdmin
    .from('users')
    .update({ status: 'inactive' })
    .eq('status', 'active')
    .lt('last_login_at', deactivationThreshold)
    .select();

  return deactivated?.length || 0;
}

// =============================================================================
// Logout
// =============================================================================

export async function logout(token: string): Promise<void> {
  await invalidateAuthSession(token);
}
