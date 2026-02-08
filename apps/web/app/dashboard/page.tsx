'use client';

import { useState, useEffect } from 'react';
import { getAllProgressFromStorage, getStreakFromStorage, formatTimeSpent, getRelativeTime, type CourseProgressData } from '@/lib/progress';
import { ProgressRing } from '@/components/ProgressRing';
import { DailyGoalCard } from '@/components/DailyGoal';
import { ReviewBadge, ReviewQueue } from '@/components/ReviewQueue';
import { getTotalDueCount } from '@/lib/spaced-repetition';
import { BuddyInvite } from '@/components/BuddyInvite';

type FilterType = 'all' | 'in-progress' | 'completed';

function CourseCard({ course }: { course: CourseProgressData }) {
  const progress = course.overallCompletionPercent;
  const isComplete = progress >= 100;

  return (
    <div className="bg-[var(--bg-card)] rounded-xl shadow-sm hover:shadow-md transition-shadow p-6" style={{ border: '1px solid var(--border-secondary)' }}>
      <div className="flex justify-between items-start gap-4 mb-4">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-[var(--text-primary)] mb-1 truncate">
            {course.courseTitle || 'Untitled Course'}
          </h3>
          <p className="text-sm text-[var(--text-muted)]">
            {course.lessonsCompleted}/{course.totalLessons} lessons
          </p>
        </div>
        <ProgressRing
          progress={progress}
          size={52}
          strokeWidth={5}
          color={isComplete ? 'rgb(34, 197, 94)' : 'var(--royal-blue)'}
          showPercentage
          animate
        />
      </div>

      {/* Time & activity info */}
      <div className="flex items-center gap-4 text-xs text-[var(--text-muted)] mb-4">
        {course.totalTimeSpent > 0 && (
          <span className="flex items-center gap-1">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {formatTimeSpent(course.totalTimeSpent)}
          </span>
        )}
        <span>{getRelativeTime(course.lastActivityAt)}</span>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <a
          href={`/?mode=build&resume=${course.courseId}`}
          className="flex-1 py-2.5 px-4 text-center text-sm font-medium text-white rounded-lg transition-all hover:shadow-md"
          style={{ background: 'var(--royal-blue)' }}
        >
          {isComplete ? 'Review' : 'Continue'}
        </a>
      </div>

      <div className="mt-4 pt-3 border-t border-[var(--border-secondary)]">
        <p className="text-xs text-[var(--text-muted)]">
          Started {getRelativeTime(course.startedAt)}
        </p>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const [courses, setCourses] = useState<CourseProgressData[]>([]);
  const [filter, setFilter] = useState<FilterType>('all');
  const [isLoaded, setIsLoaded] = useState(false);
  const [reviewDueCount, setReviewDueCount] = useState(0);
  const [showReviewQueue, setShowReviewQueue] = useState(false);

  useEffect(() => {
    const allProgress = getAllProgressFromStorage();
    // Sort by most recently accessed
    allProgress.sort((a, b) => new Date(b.lastActivityAt).getTime() - new Date(a.lastActivityAt).getTime());
    setCourses(allProgress);
    setReviewDueCount(getTotalDueCount());
    setIsLoaded(true);
  }, []);

  const streak = typeof window !== 'undefined' ? getStreakFromStorage() : { currentStreak: 0, longestStreak: 0, lastActivityDate: null, streakHistory: [] };

  const filteredCourses = courses.filter((course) => {
    if (filter === 'all') return true;
    if (filter === 'in-progress') return course.overallCompletionPercent < 100;
    if (filter === 'completed') return course.overallCompletionPercent >= 100;
    return true;
  });

  const completedCount = courses.filter((c) => c.overallCompletionPercent >= 100).length;
  const inProgressCount = courses.filter((c) => c.overallCompletionPercent < 100).length;
  const totalLessons = courses.reduce((sum, c) => sum + c.lessonsCompleted, 0);
  const totalTime = courses.reduce((sum, c) => sum + c.totalTimeSpent, 0);

  return (
    <div className="min-h-screen pt-20">
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div>
            <h1 className="text-3xl font-bold" style={{ color: 'var(--royal-blue)' }}>
              My Courses
            </h1>
            <p className="text-[var(--text-secondary)] mt-1">
              {courses.length} course{courses.length !== 1 ? 's' : ''} in your library
            </p>
          </div>
          <a
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all"
            style={{ background: 'var(--royal-blue)' }}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Course
          </a>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-[var(--bg-card)] rounded-xl p-4 shadow-sm" style={{ border: '1px solid var(--border-secondary)' }}>
            <p className="text-sm text-[var(--text-muted)]">Total Courses</p>
            <p className="text-2xl font-bold" style={{ color: 'var(--royal-blue)' }}>
              {courses.length}
            </p>
          </div>
          <div className="bg-[var(--bg-card)] rounded-xl p-4 shadow-sm" style={{ border: '1px solid var(--border-secondary)' }}>
            <p className="text-sm text-[var(--text-muted)]">Completed</p>
            <p className="text-2xl font-bold text-green-600">{completedCount}</p>
          </div>
          <div className="bg-[var(--bg-card)] rounded-xl p-4 shadow-sm" style={{ border: '1px solid var(--border-secondary)' }}>
            <p className="text-sm text-[var(--text-muted)]">Lessons Done</p>
            <p className="text-2xl font-bold" style={{ color: 'var(--royal-blue)' }}>{totalLessons}</p>
          </div>
          <div className="bg-[var(--bg-card)] rounded-xl p-4 shadow-sm" style={{ border: '1px solid var(--border-secondary)' }}>
            <p className="text-sm text-[var(--text-muted)]">Time Spent</p>
            <p className="text-2xl font-bold" style={{ color: 'var(--royal-blue)' }}>
              {totalTime > 0 ? formatTimeSpent(totalTime) : '0m'}
            </p>
          </div>
        </div>

        {/* Streak banner */}
        {streak.currentStreak > 0 && (
          <div
            className="flex items-center gap-3 p-4 rounded-xl mb-8"
            style={{
              backgroundColor: 'rgba(251, 146, 60, 0.08)',
              border: '1px solid rgba(251, 146, 60, 0.2)',
            }}
          >
            <span className="text-2xl">🔥</span>
            <div>
              <p className="font-semibold text-[var(--text-primary)]">
                {streak.currentStreak} day streak!
              </p>
              <p className="text-sm text-[var(--text-muted)]">
                Keep learning daily to maintain your streak
              </p>
            </div>
          </div>
        )}

        {/* Daily Goal + Reviews */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <DailyGoalCard className="md:col-span-1" />
          {reviewDueCount > 0 && !showReviewQueue && (
            <div
              className="md:col-span-2 rounded-xl p-5 flex items-center justify-between"
              style={{
                backgroundColor: 'var(--bg-card)',
                border: '1px solid var(--border-secondary)',
              }}
            >
              <div>
                <h3 className="font-semibold text-[var(--text-primary)]">Spaced Repetition</h3>
                <p className="text-sm text-[var(--text-muted)]">Review cards to boost long-term retention</p>
              </div>
              <ReviewBadge count={reviewDueCount} onClick={() => setShowReviewQueue(true)} />
            </div>
          )}
        </div>

        {/* Review Queue (expandable) */}
        {showReviewQueue && (
          <div
            className="rounded-xl p-6 mb-8 animate-fade-in"
            style={{
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border-secondary)',
            }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-[var(--text-primary)]">Review Queue</h3>
              <button
                onClick={() => setShowReviewQueue(false)}
                className="text-sm text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
              >
                Close
              </button>
            </div>
            <ReviewQueue
              onComplete={() => {
                setReviewDueCount(getTotalDueCount());
                setShowReviewQueue(false);
              }}
            />
          </div>
        )}

        {/* Filters */}
        <div className="flex gap-2 mb-6">
          {([
            { key: 'all' as FilterType, label: 'All' },
            { key: 'in-progress' as FilterType, label: `In Progress${inProgressCount > 0 ? ` (${inProgressCount})` : ''}` },
            { key: 'completed' as FilterType, label: `Completed${completedCount > 0 ? ` (${completedCount})` : ''}` },
          ]).map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                filter === f.key
                  ? 'text-white'
                  : 'bg-[var(--bg-card)] text-[var(--text-secondary)] hover:bg-[var(--bg-glass-dark)]'
              }`}
              style={filter === f.key ? { background: 'var(--royal-blue)' } : { border: '1px solid var(--border-secondary)' }}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Course Grid */}
        {isLoaded && filteredCourses.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course) => (
              <CourseCard key={course.courseId} course={course} />
            ))}
          </div>
        ) : isLoaded ? (
          <div className="text-center py-16">
            <div
              className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center"
              style={{ background: 'var(--bg-glass-dark)' }}
            >
              <svg
                className="w-8 h-8"
                style={{ color: 'var(--royal-blue)' }}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-[var(--text-primary)] mb-2">
              {filter !== 'all' ? 'No matching courses' : 'No courses yet'}
            </h3>
            <p className="text-[var(--text-muted)] mb-6">
              {filter !== 'all' ? 'Try a different filter' : 'Create your first course to get started'}
            </p>
            <a
              href="/"
              className="inline-block px-6 py-3 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all"
              style={{ background: 'var(--royal-blue)' }}
            >
              Create Your First Course
            </a>
          </div>
        ) : null}

        {/* Learning Buddies */}
        {courses.length > 0 && (
          <div className="mt-8">
            <BuddyInvite />
          </div>
        )}

        {/* Upgrade prompt for free users */}
        {courses.length === 1 && (
          <div className="mt-12 bg-[var(--bg-glass-dark)] rounded-2xl p-8 text-center">
            <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2">
              Ready for more?
            </h3>
            <p className="text-[var(--text-secondary)] mb-6">
              You&apos;ve used your free course. Unlock unlimited learning for just $9.99/month.
            </p>
            <a
              href="/pricing"
              className="inline-block px-8 py-3 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all"
              style={{ background: 'var(--royal-blue)' }}
            >
              View Pricing
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
