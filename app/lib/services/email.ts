// Email Service using Resend
// Handles all transactional emails for Adaptive Courses

import { Resend } from 'resend';
import { env } from '../env';
import {
  generateOTPEmail,
  generateMagicLinkEmail,
  generateWelcomeEmail,
  generateCourseEmail,
  CourseEmailData,
} from '../email-templates';

// Initialize Resend client
const resend = new Resend(env.RESEND_API_KEY);

// Email configuration
// TODO: Switch to custom domain once adaptivecourses.com is set up
// For now, always use onboarding@resend.dev (only sends to verified emails/contacts)
const FROM_EMAIL = 'Adaptive Courses <onboarding@resend.dev>';
const REPLY_TO = 'rahuldc2000@gmail.com';

// Log configuration on startup
if (typeof window === 'undefined') {
  console.log('[EMAIL] Config:', {
    from: FROM_EMAIL,
    hasApiKey: !!env.RESEND_API_KEY,
    apiKeyPrefix: env.RESEND_API_KEY?.slice(0, 10) + '...',
  });
}

export interface SendEmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

// =============================================================================
// OTP Verification Email
// =============================================================================

export async function sendOTPEmail(
  email: string,
  code: string
): Promise<SendEmailResult> {
  try {
    const html = generateOTPEmail(code, email);

    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: `${code} is your Adaptive Courses verification code`,
      html,
      headers: {
        'X-Entity-Ref-ID': `otp-${Date.now()}`, // Prevent threading
      },
    });

    if (error) {
      console.error('[EMAIL] OTP send failed:', error);
      return { success: false, error: error.message };
    }

    console.log(`[EMAIL] OTP sent to ${email}, messageId: ${data?.id}`);
    return { success: true, messageId: data?.id };
  } catch (err: any) {
    console.error('[EMAIL] OTP send error:', err);
    return { success: false, error: err.message || 'Failed to send email' };
  }
}

// =============================================================================
// Magic Link Email
// =============================================================================

export async function sendMagicLinkEmail(
  email: string,
  magicLink: string
): Promise<SendEmailResult> {
  try {
    const html = generateMagicLinkEmail(magicLink, email);

    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: 'Sign in to Adaptive Courses',
      html,
      headers: {
        'X-Entity-Ref-ID': `magic-${Date.now()}`,
      },
    });

    if (error) {
      console.error('[EMAIL] Magic link send failed:', error);
      return { success: false, error: error.message };
    }

    console.log(`[EMAIL] Magic link sent to ${email}, messageId: ${data?.id}`);
    return { success: true, messageId: data?.id };
  } catch (err: any) {
    console.error('[EMAIL] Magic link send error:', err);
    return { success: false, error: err.message || 'Failed to send email' };
  }
}

// =============================================================================
// Welcome Email
// =============================================================================

export async function sendWelcomeEmail(email: string): Promise<SendEmailResult> {
  try {
    const html = generateWelcomeEmail(email);

    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      replyTo: REPLY_TO,
      subject: 'Welcome to Adaptive Courses!',
      html,
    });

    if (error) {
      console.error('[EMAIL] Welcome email failed:', error);
      return { success: false, error: error.message };
    }

    console.log(`[EMAIL] Welcome email sent to ${email}, messageId: ${data?.id}`);
    return { success: true, messageId: data?.id };
  } catch (err: any) {
    console.error('[EMAIL] Welcome email error:', err);
    return { success: false, error: err.message || 'Failed to send email' };
  }
}

// =============================================================================
// Course Delivery Email
// =============================================================================

export async function sendCourseEmail(
  data: CourseEmailData
): Promise<SendEmailResult> {
  try {
    const html = generateCourseEmail(data);

    const { data: emailData, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: data.userEmail,
      replyTo: REPLY_TO,
      subject: `Your course is ready: ${data.courseName}`,
      html,
    });

    if (error) {
      console.error('[EMAIL] Course email failed:', error);
      return { success: false, error: error.message };
    }

    console.log(`[EMAIL] Course email sent to ${data.userEmail}, messageId: ${emailData?.id}`);
    return { success: true, messageId: emailData?.id };
  } catch (err: any) {
    console.error('[EMAIL] Course email error:', err);
    return { success: false, error: err.message || 'Failed to send email' };
  }
}

// =============================================================================
// Inactive Account Warning Email
// =============================================================================

export async function sendInactiveWarningEmail(
  email: string,
  daysInactive: number
): Promise<SendEmailResult> {
  try {
    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>We miss you!</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: #003F87; color: white; padding: 24px; border-radius: 12px 12px 0 0; text-align: center;">
    <h1 style="margin: 0;">We miss you!</h1>
  </div>

  <div style="padding: 32px; background: white; border: 1px solid #e5e7eb; border-top: none;">
    <p>It's been ${daysInactive} days since you last visited Adaptive Courses.</p>

    <p>Your account will become inactive in ${90 - daysInactive} days. But don't worry - we'd love to have you back!</p>

    <p><strong>Here's a gift:</strong> Come back now and get another free course on us.</p>

    <div style="text-align: center; margin: 32px 0;">
      <a href="${env.APP_URL}?welcome_back=true" style="display: inline-block; padding: 14px 32px; background: #003F87; color: white; text-decoration: none; border-radius: 8px; font-weight: 600;">
        Claim Your Free Course
      </a>
    </div>

    <p style="color: #6b7280; font-size: 14px;">
      If you no longer wish to use Adaptive Courses, no action is needed. Your account will be deactivated automatically.
    </p>
  </div>

  <div style="text-align: center; padding: 20px; color: #6b7280; font-size: 12px;">
    <p>© 2026 Adaptive Courses</p>
  </div>
</body>
</html>
    `.trim();

    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      replyTo: REPLY_TO,
      subject: 'We miss you! Here\'s a free course',
      html,
    });

    if (error) {
      console.error('[EMAIL] Inactive warning failed:', error);
      return { success: false, error: error.message };
    }

    return { success: true, messageId: data?.id };
  } catch (err: any) {
    console.error('[EMAIL] Inactive warning error:', err);
    return { success: false, error: err.message || 'Failed to send email' };
  }
}
