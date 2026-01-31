import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { email, source } = await request.json();

    // Validate email
    if (!email || !email.includes('@')) {
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

  } catch (error: any) {
    console.error('Email capture error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to capture email' },
      { status: 500 }
    );
  }
}
