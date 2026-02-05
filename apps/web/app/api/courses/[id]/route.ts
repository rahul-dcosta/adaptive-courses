import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { validateAuthSession } from '@/lib/services/auth';
import { getErrorMessage } from '@/lib/types';

// DELETE /api/courses/[id] - Delete a course
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: courseId } = await params;

    if (!courseId) {
      return NextResponse.json(
        { error: 'Course ID is required' },
        { status: 400 }
      );
    }

    // Get auth token from cookie
    const authToken = request.cookies.get('auth_token')?.value;

    if (!authToken) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Validate session and get user
    const user = await validateAuthSession(authToken);

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid or expired session' },
        { status: 401 }
      );
    }

    // First, verify the course exists and belongs to the user
    const { data: course, error: fetchError } = await supabaseAdmin
      .from('courses')
      .select('id, user_id, topic')
      .eq('id', courseId)
      .single();

    if (fetchError || !course) {
      return NextResponse.json(
        { error: 'Course not found' },
        { status: 404 }
      );
    }

    // Verify ownership
    if (course.user_id !== user.id) {
      return NextResponse.json(
        { error: 'You do not have permission to delete this course' },
        { status: 403 }
      );
    }

    // Delete the course
    const { error: deleteError } = await supabaseAdmin
      .from('courses')
      .delete()
      .eq('id', courseId);

    if (deleteError) {
      console.error('[COURSES] Delete error:', deleteError);
      return NextResponse.json(
        { error: 'Failed to delete course' },
        { status: 500 }
      );
    }

    // Also delete any associated owned_courses records
    await supabaseAdmin
      .from('owned_courses')
      .delete()
      .eq('course_id', courseId);

    console.log(`[COURSES] Course deleted: ${courseId} by user: ${user.id}`);

    return NextResponse.json({
      success: true,
      message: 'Course deleted successfully',
    });
  } catch (error: unknown) {
    console.error('[COURSES] Delete error:', error);
    return NextResponse.json(
      { error: getErrorMessage(error) || 'Failed to delete course' },
      { status: 500 }
    );
  }
}

// GET /api/courses/[id] - Get a single course
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: courseId } = await params;

    if (!courseId) {
      return NextResponse.json(
        { error: 'Course ID is required' },
        { status: 400 }
      );
    }

    // Get auth token from cookie
    const authToken = request.cookies.get('auth_token')?.value;

    if (!authToken) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Validate session and get user
    const user = await validateAuthSession(authToken);

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid or expired session' },
        { status: 401 }
      );
    }

    // Fetch the course
    const { data: course, error: fetchError } = await supabaseAdmin
      .from('courses')
      .select('*')
      .eq('id', courseId)
      .single();

    if (fetchError || !course) {
      return NextResponse.json(
        { error: 'Course not found' },
        { status: 404 }
      );
    }

    // Verify ownership
    if (course.user_id !== user.id) {
      return NextResponse.json(
        { error: 'You do not have permission to view this course' },
        { status: 403 }
      );
    }

    return NextResponse.json({
      success: true,
      course,
    });
  } catch (error: unknown) {
    console.error('[COURSES] Get error:', error);
    return NextResponse.json(
      { error: getErrorMessage(error) || 'Failed to fetch course' },
      { status: 500 }
    );
  }
}
