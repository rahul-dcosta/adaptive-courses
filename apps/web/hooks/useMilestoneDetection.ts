'use client';

import { useCallback, useState } from 'react';

// =============================================================================
// Types
// =============================================================================

export type MilestoneType = 'progress' | 'streak' | 'lessons';

export interface Milestone {
  id: string;
  type: MilestoneType;
  value: number;
  title: string;
  description: string;
  emoji: string;
}

// =============================================================================
// Milestone Definitions
// =============================================================================

const PROGRESS_MILESTONES: Omit<Milestone, 'id'>[] = [
  { type: 'progress', value: 25, title: 'Quarter Way There!', description: "You've completed 25% of the course. Keep going!", emoji: '🌱' },
  { type: 'progress', value: 50, title: 'Halfway Point!', description: "You're halfway through. Impressive dedication!", emoji: '⭐' },
  { type: 'progress', value: 75, title: 'Almost There!', description: 'Just 25% left. The finish line is in sight!', emoji: '🔥' },
  { type: 'progress', value: 100, title: 'Course Complete!', description: "You've mastered the entire course. Outstanding!", emoji: '🎓' },
];

const STREAK_MILESTONES: Omit<Milestone, 'id'>[] = [
  { type: 'streak', value: 7, title: '7-Day Streak!', description: "A full week of learning. You're building a habit!", emoji: '🔥' },
  { type: 'streak', value: 14, title: '2-Week Streak!', description: 'Two weeks straight. Your consistency is paying off!', emoji: '💪' },
  { type: 'streak', value: 30, title: '30-Day Streak!', description: "A whole month of daily learning. You're unstoppable!", emoji: '🏆' },
  { type: 'streak', value: 100, title: '100-Day Streak!', description: 'One hundred days. Legendary commitment!', emoji: '👑' },
];

const LESSON_MILESTONES: Omit<Milestone, 'id'>[] = [
  { type: 'lessons', value: 5, title: '5 Lessons Done!', description: "You've completed 5 lessons. Great start!", emoji: '📚' },
  { type: 'lessons', value: 10, title: '10 Lessons Done!', description: 'Double digits! Your knowledge is growing fast.', emoji: '🚀' },
  { type: 'lessons', value: 25, title: '25 Lessons Done!', description: 'Twenty-five lessons completed. Remarkable!', emoji: '✨' },
  { type: 'lessons', value: 50, title: '50 Lessons Done!', description: "Half a century of lessons. You're a learning machine!", emoji: '🌟' },
];

// =============================================================================
// Storage
// =============================================================================

const MILESTONE_STORAGE_KEY = 'ac_shown_milestones';

function getShownMilestones(): Set<string> {
  if (typeof window === 'undefined') return new Set();
  try {
    const data = localStorage.getItem(MILESTONE_STORAGE_KEY);
    if (!data) return new Set();
    return new Set(JSON.parse(data) as string[]);
  } catch {
    return new Set();
  }
}

function markMilestoneShown(milestoneId: string): void {
  if (typeof window === 'undefined') return;
  try {
    const shown = getShownMilestones();
    shown.add(milestoneId);
    localStorage.setItem(MILESTONE_STORAGE_KEY, JSON.stringify([...shown]));
  } catch {
    // silently fail
  }
}

// =============================================================================
// Hook
// =============================================================================

interface UseMilestoneDetectionReturn {
  activeMilestone: Milestone | null;
  dismissMilestone: () => void;
  checkMilestones: (params: {
    progressPercent: number;
    streakDays: number;
    lessonsCompleted: number;
    courseId: string;
  }) => void;
}

export function useMilestoneDetection(): UseMilestoneDetectionReturn {
  const [activeMilestone, setActiveMilestone] = useState<Milestone | null>(null);

  const dismissMilestone = useCallback(() => {
    if (activeMilestone) {
      markMilestoneShown(activeMilestone.id);
    }
    setActiveMilestone(null);
  }, [activeMilestone]);

  const checkMilestones = useCallback(
    (params: {
      progressPercent: number;
      streakDays: number;
      lessonsCompleted: number;
      courseId: string;
    }) => {
      const shown = getShownMilestones();

      // Check progress milestones (course-scoped)
      for (const m of PROGRESS_MILESTONES) {
        const id = `progress-${m.value}-${params.courseId}`;
        if (params.progressPercent >= m.value && !shown.has(id)) {
          setActiveMilestone({ ...m, id });
          return;
        }
      }

      // Check streak milestones (global)
      for (const m of STREAK_MILESTONES) {
        const id = `streak-${m.value}`;
        if (params.streakDays >= m.value && !shown.has(id)) {
          setActiveMilestone({ ...m, id });
          return;
        }
      }

      // Check lesson milestones (global)
      for (const m of LESSON_MILESTONES) {
        const id = `lessons-${m.value}`;
        if (params.lessonsCompleted >= m.value && !shown.has(id)) {
          setActiveMilestone({ ...m, id });
          return;
        }
      }
    },
    []
  );

  return { activeMilestone, dismissMilestone, checkMilestones };
}
