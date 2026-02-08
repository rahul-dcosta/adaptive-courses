import { NextRequest, NextResponse } from 'next/server';
import { getErrorMessage } from '@/lib/types';

/**
 * Push subscription endpoint
 *
 * Stores push subscriptions for sending notifications.
 * TODO: Store in Supabase push_subscriptions table.
 */

export async function POST(request: NextRequest) {
  try {
    const subscription = await request.json();

    if (!subscription.endpoint) {
      return NextResponse.json(
        { error: 'Invalid push subscription' },
        { status: 400 }
      );
    }

    // TODO: Store subscription in Supabase
    // For now, just acknowledge receipt
    console.log('Push subscription received:', subscription.endpoint.slice(0, 50) + '...');

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: getErrorMessage(error) },
      { status: 500 }
    );
  }
}
