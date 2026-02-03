import { NextRequest, NextResponse } from 'next/server';
import { getErrorMessage } from '@/lib/types';

export async function POST(request: NextRequest) {
  try {
    const { courseId, rating, feedback, email } = await request.json();

    // Validate inputs
    if (!courseId || !rating) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'Rating must be between 1 and 5' },
        { status: 400 }
      );
    }

    const { createClient } = await import('@supabase/supabase-js');
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || '',
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
    );

    // Save feedback
    const { data, error } = await supabase
      .from('course_feedback')
      .insert({
        course_id: courseId,
        rating,
        feedback: feedback || null,
        email: email || null
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    // If rating is 4 or 5, could trigger testimonial request
    const shouldAskForTestimonial = rating >= 4;

    return NextResponse.json({
      success: true,
      id: data.id,
      shouldAskForTestimonial,
      message: 'Thank you for your feedback!'
    });

  } catch (error: unknown) {
    console.error('Feedback error:', error);
    return NextResponse.json(
      { error: getErrorMessage(error) || 'Failed to submit feedback' },
      { status: 500 }
    );
  }
}

// Get feedback stats
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const courseId = searchParams.get('courseId');

    const { createClient } = await import('@supabase/supabase-js');
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || '',
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
    );

    let query = supabase
      .from('course_feedback')
      .select('rating, feedback, created_at');

    if (courseId) {
      query = query.eq('course_id', courseId);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    // Calculate average rating
    const totalRating = data?.reduce((sum, item) => sum + item.rating, 0) || 0;
    const avgRating = data && data.length > 0 ? totalRating / data.length : 0;

    // Count by rating
    const ratingCounts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    data?.forEach(item => {
      ratingCounts[item.rating as keyof typeof ratingCounts]++;
    });

    return NextResponse.json({
      success: true,
      totalFeedback: data?.length || 0,
      averageRating: Math.round(avgRating * 10) / 10,
      ratingCounts,
      recentFeedback: data?.slice(0, 10) || []
    });

  } catch (error: unknown) {
    console.error('Feedback fetch error:', error);
    return NextResponse.json(
      { error: getErrorMessage(error) || 'Failed to fetch feedback' },
      { status: 500 }
    );
  }
}
