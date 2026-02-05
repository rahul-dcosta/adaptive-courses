import { NextResponse, type NextRequest } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { getErrorMessage } from '@/lib/types';

// =============================================================================
// Types
// =============================================================================

interface ProgressPayload {
  courseId: string;
  lessonProgress: Record<string, {
    completed: boolean;
    completedAt: string | null;
    timeSpent: number;
    quizScore: number | null;
    quizPassed: boolean | null;
  }>;
  currentModuleIndex: number;
  currentLessonIndex: number;
  totalTimeSpent: number;
  lessonsCompleted: number;
  overallCompletionPercent: number;
  streak?: {
    currentStreak: number;
    longestStreak: number;
    lastActivityDate: string | null;
  };
}

// =============================================================================
// POST - Save/Update Progress
// =============================================================================

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as ProgressPayload;

    const {
      courseId,
      lessonProgress,
      currentModuleIndex,
      currentLessonIndex,
      totalTimeSpent,
      lessonsCompleted,
      overallCompletionPercent,
      streak,
    } = body;

    // Validate required fields
    if (!courseId) {
      return NextResponse.json(
        { success: false, error: 'Missing courseId' },
        { status: 400 }
      );
    }

    // Get user from session cookie (optional - progress works for anonymous users too)
    const sessionToken = request.cookies.get('auth_session')?.value;
    let userId: string | null = null;

    if (sessionToken) {
      // Verify session and get user
      const { data: session } = await supabaseAdmin
        .from('auth_sessions')
        .select('user_id')
        .eq('token_hash', sessionToken)
        .gt('expires_at', new Date().toISOString())
        .single();

      if (session) {
        userId = session.user_id;
      }
    }

    // Prepare progress data for upsert
    const progressData = {
      course_id: courseId,
      user_id: userId,
      lesson_progress: lessonProgress,
      current_lesson_id: `${currentModuleIndex}-${currentLessonIndex}`,
      overall_percent: overallCompletionPercent,
      total_time_spent: totalTimeSpent,
      lessons_completed: lessonsCompleted,
      streak_days: streak?.currentStreak ?? 0,
      longest_streak: streak?.longestStreak ?? 0,
      last_activity_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    // Check if progress exists for this course/user combination
    const { data: existingProgress } = await supabaseAdmin
      .from('course_progress')
      .select('id')
      .eq('course_id', courseId)
      .eq(userId ? 'user_id' : 'user_id', userId)
      .maybeSingle();

    if (existingProgress) {
      // Update existing progress
      const { error: updateError } = await supabaseAdmin
        .from('course_progress')
        .update(progressData)
        .eq('id', existingProgress.id);

      if (updateError) {
        console.error('Progress update error:', updateError);
        // Don't fail the request - localStorage is the primary storage
        return NextResponse.json({
          success: true,
          synced: false,
          message: 'Progress saved locally, database sync pending',
        });
      }
    } else {
      // Insert new progress
      const { error: insertError } = await supabaseAdmin
        .from('course_progress')
        .insert({
          ...progressData,
          created_at: new Date().toISOString(),
        });

      if (insertError) {
        // Check if it's a duplicate key error (race condition)
        if (insertError.code === '23505') {
          // Try update instead
          const { error: retryError } = await supabaseAdmin
            .from('course_progress')
            .update(progressData)
            .eq('course_id', courseId)
            .eq(userId ? 'user_id' : 'user_id', userId);

          if (retryError) {
            console.error('Progress retry error:', retryError);
            return NextResponse.json({
              success: true,
              synced: false,
              message: 'Progress saved locally, database sync pending',
            });
          }
        } else {
          console.error('Progress insert error:', insertError);
          return NextResponse.json({
            success: true,
            synced: false,
            message: 'Progress saved locally, database sync pending',
          });
        }
      }
    }

    return NextResponse.json({
      success: true,
      synced: true,
      message: 'Progress saved successfully',
    });
  } catch (error) {
    console.error('Progress API error:', error);
    return NextResponse.json(
      {
        success: false,
        error: getErrorMessage(error),
      },
      { status: 500 }
    );
  }
}

// =============================================================================
// GET - Fetch Progress
// =============================================================================

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const courseId = searchParams.get('courseId');

    if (!courseId) {
      return NextResponse.json(
        { success: false, error: 'Missing courseId parameter' },
        { status: 400 }
      );
    }

    // Get user from session cookie
    const sessionToken = request.cookies.get('auth_session')?.value;
    let userId: string | null = null;

    if (sessionToken) {
      const { data: session } = await supabaseAdmin
        .from('auth_sessions')
        .select('user_id')
        .eq('token_hash', sessionToken)
        .gt('expires_at', new Date().toISOString())
        .single();

      if (session) {
        userId = session.user_id;
      }
    }

    // Fetch progress
    const { data: progress, error } = await supabaseAdmin
      .from('course_progress')
      .select('*')
      .eq('course_id', courseId)
      .eq(userId ? 'user_id' : 'user_id', userId)
      .maybeSingle();

    if (error) {
      console.error('Progress fetch error:', error);
      return NextResponse.json({
        success: true,
        progress: null,
        message: 'No progress found',
      });
    }

    if (!progress) {
      return NextResponse.json({
        success: true,
        progress: null,
        message: 'No progress found',
      });
    }

    // Transform database format to client format
    const clientProgress = {
      courseId: progress.course_id,
      userId: progress.user_id,
      lessonProgress: progress.lesson_progress || {},
      currentModuleIndex: parseInt(progress.current_lesson_id?.split('-')[0] || '0', 10),
      currentLessonIndex: parseInt(progress.current_lesson_id?.split('-')[1] || '0', 10),
      overallCompletionPercent: progress.overall_percent || 0,
      totalTimeSpent: progress.total_time_spent || 0,
      lessonsCompleted: progress.lessons_completed || 0,
      streak: {
        currentStreak: progress.streak_days || 0,
        longestStreak: progress.longest_streak || 0,
        lastActivityDate: progress.last_activity_at?.split('T')[0] || null,
      },
      lastActivityAt: progress.last_activity_at,
      updatedAt: progress.updated_at,
    };

    return NextResponse.json({
      success: true,
      progress: clientProgress,
    });
  } catch (error) {
    console.error('Progress GET error:', error);
    return NextResponse.json(
      {
        success: false,
        error: getErrorMessage(error),
      },
      { status: 500 }
    );
  }
}

// =============================================================================
// DELETE - Reset Progress
// =============================================================================

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const courseId = searchParams.get('courseId');

    if (!courseId) {
      return NextResponse.json(
        { success: false, error: 'Missing courseId parameter' },
        { status: 400 }
      );
    }

    // Get user from session cookie
    const sessionToken = request.cookies.get('auth_session')?.value;
    let userId: string | null = null;

    if (sessionToken) {
      const { data: session } = await supabaseAdmin
        .from('auth_sessions')
        .select('user_id')
        .eq('token_hash', sessionToken)
        .gt('expires_at', new Date().toISOString())
        .single();

      if (session) {
        userId = session.user_id;
      }
    }

    // Delete progress
    const { error } = await supabaseAdmin
      .from('course_progress')
      .delete()
      .eq('course_id', courseId)
      .eq(userId ? 'user_id' : 'user_id', userId);

    if (error) {
      console.error('Progress delete error:', error);
      return NextResponse.json({
        success: true,
        deleted: false,
        message: 'Failed to delete from database',
      });
    }

    return NextResponse.json({
      success: true,
      deleted: true,
      message: 'Progress deleted successfully',
    });
  } catch (error) {
    console.error('Progress DELETE error:', error);
    return NextResponse.json(
      {
        success: false,
        error: getErrorMessage(error),
      },
      { status: 500 }
    );
  }
}
