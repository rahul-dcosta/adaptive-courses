import { NextRequest, NextResponse } from 'next/server';
import { verifyMagicLink } from '@/lib/services/auth';

// GET handler for magic link verification (user clicks link in email)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');
    const sessionId = searchParams.get('session');
    const redirectUrl = searchParams.get('redirect');

    if (!token || !sessionId) {
      return NextResponse.redirect(
        new URL('/auth/error?reason=invalid_link', request.url)
      );
    }

    const result = await verifyMagicLink(token, sessionId);

    if (!result.success) {
      return NextResponse.redirect(
        new URL(`/auth/error?reason=${encodeURIComponent(result.error || 'verification_failed')}`, request.url)
      );
    }

    // Build redirect URL
    const finalRedirect = redirectUrl || '/';
    const redirectResponse = NextResponse.redirect(
      new URL(finalRedirect, request.url)
    );

    // Set auth cookie
    if (result.authToken) {
      redirectResponse.cookies.set('auth_token', result.authToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 30 * 24 * 60 * 60, // 30 days
        path: '/',
      });
    }

    // If new user, redirect to welcome/onboarding
    if (result.isNewUser) {
      return NextResponse.redirect(
        new URL('/welcome', request.url)
      );
    }

    return redirectResponse;

  } catch (error: any) {
    console.error('Magic link verification error:', error);
    return NextResponse.redirect(
      new URL('/auth/error?reason=server_error', request.url)
    );
  }
}
