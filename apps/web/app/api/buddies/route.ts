import { NextRequest, NextResponse } from 'next/server';
import { getErrorMessage } from '@/lib/types';

/**
 * Learning Buddies API
 *
 * GET: List buddy connections for the authenticated user
 * POST: Create a buddy invite link
 */

export async function GET() {
  try {
    // TODO: Implement with Supabase once buddy_connections table is created
    // For now, return from localStorage-synced data
    return NextResponse.json({ buddies: [] });
  } catch (error: unknown) {
    return NextResponse.json({ error: getErrorMessage(error) }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action } = body;

    if (action === 'create-invite') {
      // Generate a unique invite token
      const token = crypto.randomUUID();
      const inviteUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'https://adaptivecourses.ai'}/buddy?invite=${token}`;

      // TODO: Store invite in Supabase
      return NextResponse.json({ inviteUrl, token });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error: unknown) {
    return NextResponse.json({ error: getErrorMessage(error) }, { status: 500 });
  }
}
