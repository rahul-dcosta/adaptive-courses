'use client';

import { useMemo } from 'react';
import { ProgressRing, ProgressRingWithStats } from './ProgressRing';
import { ProgressBar, SegmentedProgressBar } from './ProgressBarEnhanced';
import { LearningStreak, StreakMilestone } from './LearningStreak';
import { ResumeCard, ResumeBanner, NoResumeState } from './ResumeCard';
import {
  type CourseProgressData,
  type StreakData,
  getAllProgressFromStorage,
  getStreakFromStorage,
  formatTimeSpent,
  getWeeklyActivity,
} from '@/lib/progress';

// =============================================================================
// Types
// =============================================================================

interface CourseForDashboard {
  id: string;
  title: string;
  modules: Array<{
    title: string;
    lessons?: Array<{ title: string }>;
  }>;
}

// =============================================================================
// Main Progress Dashboard Component
// =============================================================================

interface ProgressDashboardProps {
  courses: CourseForDashboard[];
  onResumeCourse: (courseId: string) => void;
  onCreateCourse: () => void;
  className?: string;
}

export function ProgressDashboard({
  courses,
  onResumeCourse,
  onCreateCourse,
  className = '',
}: ProgressDashboardProps) {
  // Load all progress data
  const allProgress = useMemo(() => getAllProgressFromStorage(), []);
  const streak = useMemo(() => getStreakFromStorage(), []);
  const weeklyActivity = useMemo(() => getWeeklyActivity(streak.streakHistory), [streak.streakHistory]);

  // Calculate overall stats
  const stats = useMemo(() => {
    let totalLessonsCompleted = 0;
    let totalLessons = 0;
    let totalTimeSpent = 0;
    let coursesCompleted = 0;
    let coursesInProgress = 0;

    allProgress.forEach((progress) => {
      totalLessonsCompleted += progress.lessonsCompleted;
      totalLessons += progress.totalLessons;
      totalTimeSpent += progress.totalTimeSpent;

      if (progress.overallCompletionPercent >= 100) {
        coursesCompleted++;
      } else if (progress.overallCompletionPercent > 0) {
        coursesInProgress++;
      }
    });

    return {
      totalLessonsCompleted,
      totalLessons,
      totalTimeSpent,
      coursesCompleted,
      coursesInProgress,
      overallCompletion: totalLessons > 0
        ? Math.round((totalLessonsCompleted / totalLessons) * 100)
        : 0,
    };
  }, [allProgress]);

  // Get in-progress courses sorted by last activity
  const inProgressCourses = useMemo(() => {
    return allProgress
      .filter((p) => p.overallCompletionPercent > 0 && p.overallCompletionPercent < 100)
      .sort((a, b) => new Date(b.lastActivityAt).getTime() - new Date(a.lastActivityAt).getTime())
      .map((progress) => {
        const course = courses.find((c) => c.id === progress.courseId);
        if (!course) return null;

        const currentModule = course.modules[progress.currentModuleIndex];
        const currentLesson = currentModule?.lessons?.[progress.currentLessonIndex];

        return {
          courseId: progress.courseId,
          title: course.title,
          currentModuleIndex: progress.currentModuleIndex,
          currentLessonIndex: progress.currentLessonIndex,
          currentLessonTitle: currentLesson?.title,
          currentModuleTitle: currentModule?.title,
          completionPercent: progress.overallCompletionPercent,
          lastActivityAt: progress.lastActivityAt,
          totalLessons: progress.totalLessons,
          lessonsCompleted: progress.lessonsCompleted,
        };
      })
      .filter(Boolean);
  }, [allProgress, courses]);

  // Get most recent course for resume banner
  const mostRecentCourse = inProgressCourses[0] || null;

  return (
    <div className={`space-y-8 ${className}`}>
      {/* Resume Banner - show most recent in-progress course */}
      {mostRecentCourse && (
        <ResumeBanner
          course={mostRecentCourse}
          onResume={() => onResumeCourse(mostRecentCourse.courseId)}
          className="mb-6"
        />
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          label="Courses Completed"
          value={stats.coursesCompleted}
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
          color="green"
        />
        <StatCard
          label="In Progress"
          value={stats.coursesInProgress}
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
          color="blue"
        />
        <StatCard
          label="Lessons Done"
          value={stats.totalLessonsCompleted}
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          }
          color="purple"
        />
        <StatCard
          label="Time Spent"
          value={formatTimeSpent(stats.totalTimeSpent)}
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
          color="orange"
          isText
        />
      </div>

      {/* Streak and Weekly Activity Section */}
      <div className="grid md:grid-cols-2 gap-6">
        <LearningStreak streak={streak} size="md" showCalendar showLongestStreak />
        {streak.currentStreak > 0 && <StreakMilestone streak={streak} />}
      </div>

      {/* Weekly Activity Chart */}
      <WeeklyActivityChart activity={weeklyActivity} />

      {/* In Progress Courses */}
      <div>
        <h3 className="text-lg font-bold text-gray-900 mb-4 font-serif">Continue Learning</h3>
        {inProgressCourses.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {inProgressCourses.map((course) => (
              course && (
                <ResumeCard
                  key={course.courseId}
                  course={course}
                  onResume={() => onResumeCourse(course.courseId)}
                />
              )
            ))}
          </div>
        ) : (
          <NoResumeState onCreateCourse={onCreateCourse} />
        )}
      </div>
    </div>
  );
}

// =============================================================================
// Stat Card Component
// =============================================================================

interface StatCardProps {
  label: string;
  value: number | string;
  icon: React.ReactNode;
  color: 'blue' | 'green' | 'purple' | 'orange';
  isText?: boolean;
}

function StatCard({ label, value, icon, color, isText = false }: StatCardProps) {
  const colors = {
    blue: {
      bg: 'rgba(0, 63, 135, 0.08)',
      icon: 'var(--royal-blue)',
      text: 'var(--royal-blue)',
    },
    green: {
      bg: 'rgba(34, 197, 94, 0.08)',
      icon: 'rgb(34, 197, 94)',
      text: 'rgb(22, 163, 74)',
    },
    purple: {
      bg: 'rgba(139, 92, 246, 0.08)',
      icon: 'rgb(139, 92, 246)',
      text: 'rgb(124, 58, 237)',
    },
    orange: {
      bg: 'rgba(251, 146, 60, 0.08)',
      icon: 'rgb(251, 146, 60)',
      text: 'rgb(234, 88, 12)',
    },
  };

  const c = colors[color];

  return (
    <div
      className="rounded-xl p-4"
      style={{ backgroundColor: c.bg }}
    >
      <div className="flex items-center gap-3">
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: c.bg, color: c.icon }}
        >
          {icon}
        </div>
        <div>
          <p className="text-xs text-gray-500">{label}</p>
          <p
            className={`font-bold ${isText ? 'text-lg' : 'text-2xl'} tabular-nums`}
            style={{ color: c.text }}
          >
            {value}
          </p>
        </div>
      </div>
    </div>
  );
}

// =============================================================================
// Weekly Activity Chart
// =============================================================================

interface WeeklyActivityChartProps {
  activity: Array<{ date: string; dayName: string; hasActivity: boolean }>;
}

function WeeklyActivityChart({ activity }: WeeklyActivityChartProps) {
  const today = new Date().toISOString().split('T')[0];
  const activeDays = activity.filter((a) => a.hasActivity).length;

  return (
    <div
      className="rounded-xl p-6"
      style={{
        backgroundColor: 'rgba(0, 63, 135, 0.04)',
        border: '1px solid rgba(0, 63, 135, 0.1)',
      }}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-gray-900">This Week</h3>
        <span className="text-xs text-gray-500">{activeDays}/7 days active</span>
      </div>

      <div className="flex justify-between gap-2">
        {activity.map((day) => {
          const isToday = day.date === today;
          return (
            <div key={day.date} className="flex-1 text-center">
              <div
                className={`h-16 rounded-lg mb-2 flex items-end justify-center transition-all ${
                  isToday ? 'ring-2 ring-offset-2' : ''
                }`}
                style={{
                  backgroundColor: day.hasActivity
                    ? 'var(--royal-blue)'
                    : 'rgba(0, 63, 135, 0.08)',
                  ringColor: isToday ? 'var(--royal-blue)' : undefined,
                }}
              >
                {day.hasActivity && (
                  <svg
                    className="w-5 h-5 text-white mb-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </div>
              <p className="text-xs text-gray-500">{day.dayName}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// =============================================================================
// Compact Stats Summary (for sidebar or cards)
// =============================================================================

interface CompactStatsSummaryProps {
  className?: string;
}

export function CompactStatsSummary({ className = '' }: CompactStatsSummaryProps) {
  const allProgress = useMemo(() => getAllProgressFromStorage(), []);
  const streak = useMemo(() => getStreakFromStorage(), []);

  const stats = useMemo(() => {
    let totalLessonsCompleted = 0;
    let totalLessons = 0;
    let coursesCompleted = 0;

    allProgress.forEach((progress) => {
      totalLessonsCompleted += progress.lessonsCompleted;
      totalLessons += progress.totalLessons;

      if (progress.overallCompletionPercent >= 100) {
        coursesCompleted++;
      }
    });

    return {
      totalLessonsCompleted,
      totalLessons,
      coursesCompleted,
      totalCourses: allProgress.length,
    };
  }, [allProgress]);

  return (
    <div
      className={`rounded-xl p-4 ${className}`}
      style={{
        backgroundColor: 'rgba(0, 63, 135, 0.04)',
        border: '1px solid rgba(0, 63, 135, 0.1)',
      }}
    >
      <h4 className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--royal-blue)' }}>
        Your Progress
      </h4>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Courses completed</span>
          <span className="font-semibold text-gray-900">
            {stats.coursesCompleted}/{stats.totalCourses}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Lessons completed</span>
          <span className="font-semibold text-gray-900">
            {stats.totalLessonsCompleted}/{stats.totalLessons}
          </span>
        </div>

        {streak.currentStreak > 0 && (
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Current streak</span>
            <span className="font-semibold" style={{ color: 'rgb(234, 88, 12)' }}>
              {streak.currentStreak} day{streak.currentStreak !== 1 ? 's' : ''}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProgressDashboard;
