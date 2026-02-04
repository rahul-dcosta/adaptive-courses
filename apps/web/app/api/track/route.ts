import { NextRequest, NextResponse } from 'next/server';
import { checkRateLimit, rateLimitResponse } from '@/lib/rate-limit';

export async function POST(request: NextRequest) {
  // Check rate limit (fail silently for analytics - don't block user experience)
  const rateLimitResult = await checkRateLimit(request, 'track');
  if (!rateLimitResult.success) {
    // For analytics, just return success but don't actually track
    // This prevents attackers from knowing they're rate limited
    return NextResponse.json({ success: true });
  }

  try {
    const body = await request.json();
    const { event, properties } = body;

    // Validate required fields
    if (!event || typeof event !== 'string') {
      return NextResponse.json({ error: 'Event name is required' }, { status: 400 });
    }

    // Sanitize event name (alphanumeric, underscores, max 100 chars)
    const sanitizedEvent = event.slice(0, 100).replace(/[^a-zA-Z0-9_]/g, '_');

    // TODO: Send to analytics service (Google Analytics, PostHog, etc.)
    console.log('[Analytics]', sanitizedEvent, properties);

    // For now, just log to Supabase
    const { createClient } = await import('@supabase/supabase-js');
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || '',
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
    );

    await supabase.from('analytics_events').insert({
      event_name: sanitizedEvent,
      properties: properties || {},
      user_agent: request.headers.get('user-agent')?.slice(0, 500), // Limit UA length
      ip_address: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip'),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Analytics error:', error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
