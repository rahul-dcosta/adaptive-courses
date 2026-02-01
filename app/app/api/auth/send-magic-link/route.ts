import { NextRequest, NextResponse } from 'next/server';
import { sendMagicLink } from '@/lib/services/auth';

export async function POST(request: NextRequest) {
  try {
    const { email, pendingCourseId, redirectUrl } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    const result = await sendMagicLink({ email, pendingCourseId, redirectUrl });

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      sessionId: result.sessionId,
      message: 'Check your email for a sign-in link',
    });

  } catch (error: any) {
    console.error('Send magic link error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to send sign-in link' },
      { status: 500 }
    );
  }
}
