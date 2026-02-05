'use client';

import { useMemo } from 'react';
import type { StreakData } from '@/lib/progress';
import { getWeeklyActivity, isStreakActive } from '@/lib/progress';

// =============================================================================
// Main Learning Streak Component
// =============================================================================

interface LearningStreakProps {
  streak: StreakData;
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
  /** Whether to show the weekly activity calendar */
  showCalendar?: boolean;
  /** Whether to show the longest streak */
  showLongestStreak?: boolean;
  /** Additional CSS classes */
  className?: string;
}

export function LearningStreak({
  streak,
  size = 'md',
  showCalendar = true,
  showLongestStreak = true,
  className = '',
}: LearningStreakProps) {
  const isActive = isStreakActive(streak);
  const weeklyActivity = useMemo(
    () => getWeeklyActivity(streak.streakHistory),
    [streak.streakHistory]
  );

  // Size-based styling
  const sizeStyles = {
    sm: {
      iconSize: 'w-4 h-4',
      textSize: 'text-lg',
      labelSize: 'text-xs',
      padding: 'p-3',
      gap: 'gap-1.5',
      daySize: 'w-5 h-5',
    },
    md: {
      iconSize: 'w-5 h-5',
      textSize: 'text-2xl',
      labelSize: 'text-sm',
      padding: 'p-4',
      gap: 'gap-2',
      daySize: 'w-6 h-6',
    },
    lg: {
      iconSize: 'w-6 h-6',
      textSize: 'text-3xl',
      labelSize: 'text-base',
      padding: 'p-6',
      gap: 'gap-3',
      daySize: 'w-8 h-8',
    },
  };

  const styles = sizeStyles[size];

  return (
    <div
      className={`rounded-xl ${styles.padding} ${className}`}
      style={{
        backgroundColor: isActive
          ? 'rgba(251, 146, 60, 0.08)'
          : 'rgba(0, 63, 135, 0.04)',
        border: isActive
          ? '1px solid rgba(251, 146, 60, 0.2)'
          : '1px solid rgba(0, 63, 135, 0.1)',
      }}
    >
      {/* Streak count and fire icon */}
      <div className={`flex items-center ${styles.gap}`}>
        <div
          className={`${styles.iconSize} flex-shrink-0`}
          style={{ color: isActive ? 'rgb(251, 146, 60)' : 'rgb(156, 163, 175)' }}
        >
          <FireIcon active={isActive} />
        </div>

        <div className="flex-1">
          <div className="flex items-baseline gap-2">
            <span
              className={`font-bold tabular-nums ${styles.textSize}`}
              style={{ color: isActive ? 'rgb(234, 88, 12)' : 'rgb(107, 114, 128)' }}
            >
              {streak.currentStreak}
            </span>
            <span
              className={`font-medium ${styles.labelSize}`}
              style={{ color: isActive ? 'rgb(234, 88, 12)' : 'rgb(107, 114, 128)' }}
            >
              day{streak.currentStreak !== 1 ? 's' : ''} streak
            </span>
          </div>

          {showLongestStreak && streak.longestStreak > 0 && (
            <p className="text-xs text-gray-500 mt-0.5">
              Best: {streak.longestStreak} day{streak.longestStreak !== 1 ? 's' : ''}
            </p>
          )}
        </div>

        {/* Streak status badge */}
        {isActive && streak.currentStreak >= 3 && (
          <div
            className="px-2 py-1 rounded-full text-xs font-semibold"
            style={{
              backgroundColor: 'rgba(251, 146, 60, 0.15)',
              color: 'rgb(234, 88, 12)',
            }}
          >
            On Fire
          </div>
        )}
      </div>

      {/* Weekly activity calendar */}
      {showCalendar && (
        <div className="mt-4">
          <WeeklyActivityCalendar
            activity={weeklyActivity}
            daySize={styles.daySize}
          />
        </div>
      )}
    </div>
  );
}

// =============================================================================
// Fire Icon Component
// =============================================================================

function FireIcon({ active }: { active: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={active ? 'animate-pulse' : ''}
    >
      <path d="M12 23c-4.97 0-9-4.03-9-9 0-3.53 2.42-6.43 5-8.47V7c0 2.21 1.79 4 4 4s4-1.79 4-4V5.53c2.58 2.04 5 4.94 5 8.47 0 4.97-4.03 9-9 9zm0-2c3.86 0 7-3.14 7-7 0-2.79-1.91-5.45-4-7.08V7c0 1.1-.9 2-2 2s-2-.9-2-2V6.92C8.91 8.55 5 11.21 5 14c0 3.86 3.14 7 7 7z" />
      {active && (
        <path
          d="M12 19c-2.76 0-5-2.24-5-5 0-1.5.67-2.85 1.73-3.76L12 7l3.27 3.24A4.98 4.98 0 0117 14c0 2.76-2.24 5-5 5z"
          fill="rgba(251, 146, 60, 0.4)"
        />
      )}
    </svg>
  );
}

// =============================================================================
// Weekly Activity Calendar
// =============================================================================

interface WeeklyActivityCalendarProps {
  activity: Array<{ date: string; dayName: string; hasActivity: boolean }>;
  daySize?: string;
}

function WeeklyActivityCalendar({
  activity,
  daySize = 'w-6 h-6',
}: WeeklyActivityCalendarProps) {
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="flex justify-between gap-1">
      {activity.map((day) => {
        const isToday = day.date === today;

        return (
          <div key={day.date} className="flex flex-col items-center gap-1">
            <span className="text-xs text-gray-400">{day.dayName}</span>
            <div
              className={`${daySize} rounded-md flex items-center justify-center transition-all ${
                isToday ? 'ring-2 ring-offset-1' : ''
              }`}
              style={{
                backgroundColor: day.hasActivity
                  ? 'rgba(251, 146, 60, 0.2)'
                  : 'rgba(0, 63, 135, 0.06)',
                ringColor: isToday ? 'var(--royal-blue)' : undefined,
              }}
            >
              {day.hasActivity && (
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: 'rgb(251, 146, 60)' }}
                />
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// =============================================================================
// Compact Streak Badge (for headers/navbars)
// =============================================================================

interface StreakBadgeProps {
  streak: StreakData;
  className?: string;
}

export function StreakBadge({ streak, className = '' }: StreakBadgeProps) {
  const isActive = isStreakActive(streak);

  if (streak.currentStreak === 0) {
    return null;
  }

  return (
    <div
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full ${className}`}
      style={{
        backgroundColor: isActive
          ? 'rgba(251, 146, 60, 0.15)'
          : 'rgba(107, 114, 128, 0.1)',
        color: isActive ? 'rgb(234, 88, 12)' : 'rgb(107, 114, 128)',
      }}
    >
      <svg
        className={`w-3.5 h-3.5 ${isActive ? 'animate-pulse' : ''}`}
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path d="M12 23c-4.97 0-9-4.03-9-9 0-3.53 2.42-6.43 5-8.47V7c0 2.21 1.79 4 4 4s4-1.79 4-4V5.53c2.58 2.04 5 4.94 5 8.47 0 4.97-4.03 9-9 9z" />
      </svg>
      <span className="text-xs font-semibold tabular-nums">{streak.currentStreak}</span>
    </div>
  );
}

// =============================================================================
// Streak Milestone Component
// =============================================================================

interface StreakMilestoneProps {
  streak: StreakData;
  className?: string;
}

export function StreakMilestone({ streak, className = '' }: StreakMilestoneProps) {
  const milestones = [3, 7, 14, 30, 60, 100];
  const nextMilestone = milestones.find((m) => m > streak.currentStreak) || milestones[milestones.length - 1];
  const previousMilestone = milestones.filter((m) => m <= streak.currentStreak).pop() || 0;

  const progressToNextMilestone =
    ((streak.currentStreak - previousMilestone) / (nextMilestone - previousMilestone)) * 100;

  if (streak.currentStreak === 0) {
    return null;
  }

  return (
    <div
      className={`rounded-xl p-4 ${className}`}
      style={{
        backgroundColor: 'rgba(251, 146, 60, 0.06)',
        border: '1px solid rgba(251, 146, 60, 0.15)',
      }}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-700">Next milestone</span>
        <span
          className="text-sm font-bold tabular-nums"
          style={{ color: 'rgb(234, 88, 12)' }}
        >
          {nextMilestone} days
        </span>
      </div>

      <div
        className="h-2 rounded-full overflow-hidden"
        style={{ backgroundColor: 'rgba(251, 146, 60, 0.15)' }}
      >
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{
            width: `${progressToNextMilestone}%`,
            backgroundColor: 'rgb(251, 146, 60)',
          }}
        />
      </div>

      <p className="text-xs text-gray-500 mt-2">
        {nextMilestone - streak.currentStreak} more day
        {nextMilestone - streak.currentStreak !== 1 ? 's' : ''} to go!
      </p>
    </div>
  );
}

export default LearningStreak;
