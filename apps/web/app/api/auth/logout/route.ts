import { NextRequest, NextResponse } from 'next/server';
import { logout } from '@/lib/services/auth';

export async function POST(request: NextRequest) {
  try {
    // Get auth token from cookie
    const authToken = request.cookies.get('auth_token')?.value;

    if (authToken) {
      // Invalidate the session in database
      await logout(authToken);
    }

    // Create response and clear cookies
    const response = NextResponse.json({ success: true });

    // Clear auth cookies
    response.cookies.delete('auth_token');
    response.cookies.delete('user_id');

    return response;
  } catch (error) {
    console.error('[AUTH] Logout error:', error);
    // Still clear cookies even if DB operation fails
    const response = NextResponse.json({ success: true });
    response.cookies.delete('auth_token');
    response.cookies.delete('user_id');
    return response;
  }
}
