// Authentication & Email Verification Types
// See /docs/BUSINESS-MODEL.md for user account flow context

export type VerificationMethod = 'otp' | 'magic_link';
export type AccountStatus = 'pending_verification' | 'active' | 'inactive' | 'suspended';

// 6-digit OTP verification
export interface OTPVerification {
  id: string;
  email: string;
  code: string; // 6-digit code, hashed in DB
  expiresAt: string; // ISO date, typically 10 minutes
  attempts: number; // Max 3 attempts before regenerating
  createdAt: string;
}

// Magic link verification
export interface MagicLinkVerification {
  id: string;
  email: string;
  token: string; // UUID token, hashed in DB
  expiresAt: string; // ISO date, typically 15 minutes
  used: boolean;
  createdAt: string;
}

// Verification session (pre-account state)
export interface VerificationSession {
  id: string;
  email: string;
  method: VerificationMethod;
  verified: boolean;
  verifiedAt?: string;
  // Pending course to claim after verification
  pendingCourseId?: string;
  pendingCourseData?: string; // JSON stringified course data from localStorage
  createdAt: string;
  expiresAt: string; // Session expires after 30 minutes
}

// Device fingerprint for abuse tracking
export interface DeviceFingerprint {
  id: string;
  fingerprintHash: string; // Hash of browser fingerprint
  userId?: string; // Linked after account creation
  freeCoursesGenerated: number;
  firstSeenAt: string;
  lastSeenAt: string;
  ipAddresses: string[]; // Last 5 IPs seen
  suspicious: boolean;
  suspiciousReason?: string;
}

// Auth session (post-verification)
export interface AuthSession {
  id: string;
  userId: string;
  token: string; // Session token, hashed in DB
  expiresAt: string;
  createdAt: string;
  lastActiveAt: string;
  userAgent?: string;
  ipAddress?: string;
}

// Extended User type with auth fields
export interface AuthenticatedUser {
  id: string;
  email: string;
  emailVerified: boolean;
  emailVerifiedAt?: string;
  name?: string;
  avatarUrl?: string;
  // Account status
  status: AccountStatus;
  inactiveSince?: string; // For 90-day inactive tracking
  // OAuth connections (future)
  googleId?: string;
  // Timestamps
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
}

// Verification request/response types
export interface SendOTPRequest {
  email: string;
  pendingCourseId?: string;
}

export interface SendOTPResponse {
  success: boolean;
  sessionId: string;
  expiresIn: number; // seconds
  error?: string;
}

export interface VerifyOTPRequest {
  sessionId: string;
  code: string;
}

export interface VerifyOTPResponse {
  success: boolean;
  userId?: string;
  authToken?: string;
  isNewUser: boolean;
  error?: string;
}

export interface SendMagicLinkRequest {
  email: string;
  pendingCourseId?: string;
  redirectUrl?: string;
}

export interface SendMagicLinkResponse {
  success: boolean;
  sessionId: string;
  error?: string;
}

// Email validation
export const DISPOSABLE_EMAIL_DOMAINS = [
  'tempmail.com',
  'throwaway.com',
  'mailinator.com',
  'guerrillamail.com',
  '10minutemail.com',
  'temp-mail.org',
  'fakeinbox.com',
  // Add more as needed
] as const;

export function isDisposableEmail(email: string): boolean {
  const domain = email.split('@')[1]?.toLowerCase();
  return DISPOSABLE_EMAIL_DOMAINS.includes(domain as typeof DISPOSABLE_EMAIL_DOMAINS[number]);
}

export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && !isDisposableEmail(email);
}

// OTP generation helper - uses cryptographically secure randomness
export function generateOTP(): string {
  // Use crypto.getRandomValues for secure OTP generation
  const array = new Uint32Array(1);
  crypto.getRandomValues(array);
  // Generate 6-digit code (100000-999999)
  return String(100000 + (array[0] % 900000));
}

// Rate limiting constants
export const AUTH_RATE_LIMITS = {
  otpRequestsPerHour: 5,
  otpAttemptsPerCode: 3,
  magicLinkRequestsPerHour: 5,
  loginAttemptsPerHour: 10,
} as const;

// Expiration times (in milliseconds)
export const AUTH_EXPIRY = {
  otpCode: 10 * 60 * 1000, // 10 minutes
  magicLink: 15 * 60 * 1000, // 15 minutes
  verificationSession: 30 * 60 * 1000, // 30 minutes
  authSession: 30 * 24 * 60 * 60 * 1000, // 30 days
  inactiveAccountWarning: 75 * 24 * 60 * 60 * 1000, // 75 days (warning before 90)
  inactiveAccountDeactivation: 90 * 24 * 60 * 60 * 1000, // 90 days
} as const;
