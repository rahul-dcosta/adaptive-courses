'use client';

import { useMemo } from 'react';
import { getRelativeTime } from '@/lib/progress';
import { MiniProgressBar } from './ProgressBarEnhanced';

// =============================================================================
// Types
// =============================================================================

interface CourseResumeData {
  courseId: string;
  title: string;
  currentModuleIndex: number;
  currentLessonIndex: number;
  currentLessonTitle?: string;
  currentModuleTitle?: string;
  completionPercent: number;
  lastActivityAt: string;
  totalLessons: number;
  lessonsCompleted: number;
}

// =============================================================================
// Main Resume Card Component
// =============================================================================

interface ResumeCardProps {
  course: CourseResumeData;
  onResume: () => void;
  className?: string;
}

export function ResumeCard({ course, onResume, className = '' }: ResumeCardProps) {
  const relativeTime = useMemo(
    () => getRelativeTime(course.lastActivityAt),
    [course.lastActivityAt]
  );

  const isComplete = course.completionPercent >= 100;

  return (
    <div
      className={`rounded-xl overflow-hidden transition-all hover:shadow-lg ${className}`}
      style={{
        backgroundColor: 'var(--bg-card)',
        border: '1px solid var(--border-secondary)',
      }}
    >
      {/* Progress indicator strip at top */}
      <div
        className="h-1"
        style={{
          background: isComplete
            ? 'rgb(34, 197, 94)'
            : `linear-gradient(90deg, var(--royal-blue) ${course.completionPercent}%, rgba(0, 63, 135, 0.1) ${course.completionPercent}%)`,
        }}
      />

      <div className="p-5">
        {/* Header: Last activity */}
        <div className="flex items-center gap-2 mb-3">
          <div
            className="w-2 h-2 rounded-full"
            style={{
              backgroundColor: isComplete ? 'rgb(34, 197, 94)' : 'var(--royal-blue)',
            }}
          />
          <span className="text-xs text-[var(--text-muted)]">
            {isComplete ? 'Completed' : 'In progress'} - {relativeTime}
          </span>
        </div>

        {/* Course title */}
        <h3 className="font-bold text-[var(--text-primary)] text-lg mb-2 line-clamp-1 font-serif">
          {course.title}
        </h3>

        {/* Current position */}
        {!isComplete && (
          <div className="mb-4">
            <p className="text-sm text-[var(--text-secondary)]">
              <span className="font-medium">Next up:</span>{' '}
              {course.currentLessonTitle || `Lesson ${course.currentLessonIndex + 1}`}
            </p>
            {course.currentModuleTitle && (
              <p className="text-xs text-[var(--text-muted)] mt-0.5">
                Module {course.currentModuleIndex + 1}: {course.currentModuleTitle}
              </p>
            )}
          </div>
        )}

        {/* Progress bar */}
        <MiniProgressBar
          progress={course.completionPercent}
          showLabel
          height={6}
          className="mb-4"
        />

        {/* Stats row */}
        <div className="flex items-center justify-between text-xs text-[var(--text-muted)] mb-4">
          <span>
            {course.lessonsCompleted}/{course.totalLessons} lessons
          </span>
          <span>{course.completionPercent}% complete</span>
        </div>

        {/* Resume button */}
        <button
          onClick={onResume}
          className="w-full py-3 px-4 rounded-lg font-semibold text-white transition-all hover:shadow-md hover-lift btn-press flex items-center justify-center gap-2"
          style={{ backgroundColor: 'var(--royal-blue)' }}
        >
          {isComplete ? (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              Review Course
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
              Continue Learning
            </>
          )}
        </button>
      </div>
    </div>
  );
}

// =============================================================================
// Compact Resume Banner (for homepage/dashboard header)
// =============================================================================

interface ResumeBannerProps {
  course: CourseResumeData;
  onResume: () => void;
  onDismiss?: () => void;
  className?: string;
}

export function ResumeBanner({
  course,
  onResume,
  onDismiss,
  className = '',
}: ResumeBannerProps) {
  const relativeTime = useMemo(
    () => getRelativeTime(course.lastActivityAt),
    [course.lastActivityAt]
  );

  return (
    <div
      className={`rounded-xl p-4 ${className}`}
      style={{
        background: 'linear-gradient(135deg, rgba(0, 63, 135, 0.08) 0%, rgba(0, 63, 135, 0.04) 100%)',
        border: '1px solid rgba(0, 63, 135, 0.15)',
      }}
    >
      <div className="flex items-center gap-4">
        {/* Play icon */}
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: 'var(--royal-blue)' }}
        >
          <svg className="w-5 h-5 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z" />
          </svg>
        </div>

        {/* Course info */}
        <div className="flex-1 min-w-0">
          <p className="text-xs text-[var(--text-muted)] mb-0.5">Continue where you left off</p>
          <h4 className="font-semibold text-[var(--text-primary)] truncate">{course.title}</h4>
          <p className="text-sm text-[var(--text-secondary)]">
            {course.currentLessonTitle || `Lesson ${course.currentLessonIndex + 1}`}{' '}
            <span className="text-[var(--text-muted)]">- {relativeTime}</span>
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={onResume}
            className="px-4 py-2 rounded-lg font-semibold text-white transition-all hover:shadow-md"
            style={{ backgroundColor: 'var(--royal-blue)' }}
          >
            Resume
          </button>
          {onDismiss && (
            <button
              onClick={onDismiss}
              className="p-2 text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors"
              title="Dismiss"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Progress bar */}
      <div className="mt-3">
        <MiniProgressBar progress={course.completionPercent} height={3} />
      </div>
    </div>
  );
}

// =============================================================================
// Resume List Item (for sidebar/lists)
// =============================================================================

interface ResumeListItemProps {
  course: CourseResumeData;
  onResume: () => void;
  className?: string;
}

export function ResumeListItem({
  course,
  onResume,
  className = '',
}: ResumeListItemProps) {
  const relativeTime = useMemo(
    () => getRelativeTime(course.lastActivityAt),
    [course.lastActivityAt]
  );

  return (
    <button
      onClick={onResume}
      className={`w-full text-left p-3 rounded-lg transition-all hover:bg-[var(--bg-glass-dark)] ${className}`}
    >
      <div className="flex items-start gap-3">
        {/* Progress ring */}
        <div className="relative w-10 h-10 flex-shrink-0">
          <svg className="w-10 h-10 transform -rotate-90">
            <circle
              cx="20"
              cy="20"
              r="16"
              fill="none"
              stroke="rgba(0, 63, 135, 0.1)"
              strokeWidth="4"
            />
            <circle
              cx="20"
              cy="20"
              r="16"
              fill="none"
              stroke={course.completionPercent >= 100 ? 'rgb(34, 197, 94)' : 'var(--royal-blue)'}
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 16}`}
              strokeDashoffset={`${2 * Math.PI * 16 * (1 - course.completionPercent / 100)}`}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span
              className="text-xs font-bold"
              style={{
                color: course.completionPercent >= 100 ? 'rgb(34, 197, 94)' : 'var(--royal-blue)',
              }}
            >
              {course.completionPercent}%
            </span>
          </div>
        </div>

        {/* Course info */}
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-[var(--text-primary)] text-sm truncate">{course.title}</h4>
          <p className="text-xs text-[var(--text-muted)] truncate">
            {course.currentLessonTitle || `Lesson ${course.currentLessonIndex + 1}`}
          </p>
          <p className="text-xs text-[var(--text-muted)] mt-0.5">{relativeTime}</p>
        </div>

        {/* Arrow */}
        <svg
          className="w-4 h-4 text-[var(--text-muted)] flex-shrink-0 mt-1"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </button>
  );
}

// =============================================================================
// No Resume State
// =============================================================================

interface NoResumeStateProps {
  onCreateCourse: () => void;
  className?: string;
}

export function NoResumeState({ onCreateCourse, className = '' }: NoResumeStateProps) {
  return (
    <div
      className={`rounded-xl p-6 text-center ${className}`}
      style={{
        backgroundColor: 'rgba(0, 63, 135, 0.04)',
        border: '1px dashed rgba(0, 63, 135, 0.2)',
      }}
    >
      <div
        className="w-12 h-12 rounded-full mx-auto mb-4 flex items-center justify-center"
        style={{ backgroundColor: 'rgba(0, 63, 135, 0.1)' }}
      >
        <svg
          className="w-6 h-6"
          style={{ color: 'var(--royal-blue)' }}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
          />
        </svg>
      </div>

      <h3 className="font-semibold text-[var(--text-primary)] mb-2">No courses in progress</h3>
      <p className="text-sm text-[var(--text-muted)] mb-4">
        Start learning something new today!
      </p>

      <button
        onClick={onCreateCourse}
        className="px-4 py-2 rounded-lg font-medium text-white transition-all hover:shadow-md"
        style={{ backgroundColor: 'var(--royal-blue)' }}
      >
        Create a Course
      </button>
    </div>
  );
}

export default ResumeCard;
