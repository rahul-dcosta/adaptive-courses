import { NextRequest, NextResponse } from 'next/server';
import { sendOTP } from '@/lib/services/auth';

export async function POST(request: NextRequest) {
  try {
    const { email, pendingCourseId } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    const result = await sendOTP({ email, pendingCourseId });

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      sessionId: result.sessionId,
      expiresIn: result.expiresIn,
    });

  } catch (error: any) {
    console.error('Send OTP error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to send verification code' },
      { status: 500 }
    );
  }
}
