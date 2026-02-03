import { NextRequest, NextResponse } from 'next/server';

// RFC 5322 compliant email regex (simplified but robust)
const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

function isValidEmail(email: string): boolean {
  if (!email || typeof email !== 'string') return false;
  if (email.length > 254) return false; // RFC 5321 max length
  return EMAIL_REGEX.test(email);
}

export async function POST(request: NextRequest) {
  try {
    const { email, source } = await request.json();

    // Validate email with proper regex
    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }

    const { createClient } = await import('@supabase/supabase-js');
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || '',
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
    );

    // Try to insert, ignore if duplicate
    const { data, error } = await supabase
      .from('email_signups')
      .insert({
        email: email.toLowerCase().trim(),
        source: source || 'unknown'
      })
      .select()
      .single();

    if (error) {
      // If duplicate, that's ok - they're already signed up
      if (error.code === '23505') { // Unique violation
        return NextResponse.json({
          success: true,
          message: 'Email already registered',
          alreadyExists: true
        });
      }
      throw error;
    }

    return NextResponse.json({
      success: true,
      message: 'Email captured successfully',
      id: data.id
    });

  } catch (error) {
    console.error('Email capture error:', error);
    const message = error instanceof Error ? error.message : 'Failed to capture email';
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
