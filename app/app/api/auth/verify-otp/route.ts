import { NextRequest, NextResponse } from 'next/server';
import { verifyOTP } from '@/lib/services/auth';

export async function POST(request: NextRequest) {
  try {
    const { sessionId, code } = await request.json();

    if (!sessionId || !code) {
      return NextResponse.json(
        { error: 'Session ID and verification code are required' },
        { status: 400 }
      );
    }

    // Validate code format (6 digits)
    if (!/^\d{6}$/.test(code)) {
      return NextResponse.json(
        { error: 'Verification code must be 6 digits' },
        { status: 400 }
      );
    }

    const result = await verifyOTP({ sessionId, code });

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      );
    }

    // Set auth cookie
    const response = NextResponse.json({
      success: true,
      userId: result.userId,
      isNewUser: result.isNewUser,
    });

    // Set secure HTTP-only cookie with auth token
    if (result.authToken) {
      response.cookies.set('auth_token', result.authToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 30 * 24 * 60 * 60, // 30 days
        path: '/',
      });
    }

    return response;

  } catch (error: any) {
    console.error('Verify OTP error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to verify code' },
      { status: 500 }
    );
  }
}
