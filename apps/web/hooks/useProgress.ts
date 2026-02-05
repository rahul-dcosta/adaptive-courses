'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  type CourseProgressData,
  type LessonProgress,
  type StreakData,
  createInitialProgress,
  getProgressFromStorage,
  saveProgressToStorage,
  getStreakFromStorage,
  saveStreakToStorage,
  updateLessonProgress,
  updateCurrentPosition,
  addTimeSpent,
  updateStreak,
  getLessonProgress,
  calculateModuleProgress,
  formatTimeSpent,
  getRelativeTime,
  getWeeklyActivity,
  TIME_TRACKING_INTERVAL_MS,
} from '@/lib/progress';

// =============================================================================
// Types
// =============================================================================

interface CourseInfo {
  id: string;
  modules: Array<{
    title: string;
    lessons?: Array<{
      title: string;
      quiz?: { question: string; answer?: string };
    }>;
  }>;
}

interface UseProgressOptions {
  autoSave?: boolean;
  syncToServer?: boolean;
  userId?: string;
}

interface UseProgressReturn {
  // Loading states
  isLoading: boolean;
  isSyncing: boolean;
  error: string | null;

  // Progress data
  progress: CourseProgressData | null;
  streak: StreakData;

  // Computed values
  completionPercent: number;
  lessonsCompleted: number;
  totalLessons: number;
  formattedTimeSpent: string;
  lastActivityFormatted: string | null;
  weeklyActivity: Array<{ date: string; dayName: string; hasActivity: boolean }>;

  // Module-level data
  getModuleCompletion: (moduleIndex: number) => {
    completed: number;
    total: number;
    percent: number;
  };

  // Lesson-level data
  isLessonCompleted: (lessonKey: string) => boolean;
  getLessonTime: (lessonKey: string) => number;
  getLessonQuizResult: (lessonKey: string) => { score: number | null; passed: boolean | null };

  // Actions
  markComplete: (lessonKey: string) => void;
  markIncomplete: (lessonKey: string) => void;
  updateQuiz: (lessonKey: string, passed: boolean) => void;
  updatePosition: (moduleIndex: number, lessonIndex: number) => void;

  // Time tracking
  startTracking: (lessonKey: string) => void;
  stopTracking: () => void;

  // Resume
  getResumePosition: () => { moduleIndex: number; lessonIndex: number } | null;

  // Sync
  syncProgress: () => Promise<boolean>;
  resetProgress: () => void;
}

// =============================================================================
// Hook Implementation
// =============================================================================

export function useProgress(
  course: CourseInfo | null,
  options: UseProgressOptions = {}
): UseProgressReturn {
  const { autoSave = true, syncToServer = true, userId } = options;

  // State
  const [progress, setProgress] = useState<CourseProgressData | null>(null);
  const [streak, setStreak] = useState<StreakData>(() => getStreakFromStorage());
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Time tracking ref
  const [trackingLessonKey, setTrackingLessonKey] = useState<string | null>(null);

  // Calculate total lessons
  const totalLessons = useMemo(() => {
    if (!course) return 0;
    return course.modules.reduce((sum, mod) => sum + (mod.lessons?.length || 0), 0);
  }, [course]);

  // ==========================================================================
  // Initialize progress on mount
  // ==========================================================================
  useEffect(() => {
    if (!course?.id) {
      setProgress(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const existingProgress = getProgressFromStorage(course.id);

      if (existingProgress) {
        // Update total lessons if course structure changed
        if (existingProgress.totalLessons !== totalLessons) {
          existingProgress.totalLessons = totalLessons;
        }
        setProgress(existingProgress);
      } else {
        const newProgress = createInitialProgress(course.id, totalLessons, userId);
        setProgress(newProgress);
        if (autoSave) {
          saveProgressToStorage(newProgress);
        }
      }

      // Update streak on course load
      const updatedStreak = updateStreak(streak);
      setStreak(updatedStreak);
      saveStreakToStorage(updatedStreak);
    } catch (err) {
      setError('Failed to load progress');
      console.error('Progress loading error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [course?.id, totalLessons, userId, autoSave]);

  // ==========================================================================
  // Auto-save when progress changes
  // ==========================================================================
  useEffect(() => {
    if (progress && autoSave) {
      saveProgressToStorage(progress);
    }
  }, [progress, autoSave]);

  // ==========================================================================
  // Time tracking interval
  // ==========================================================================
  useEffect(() => {
    if (!trackingLessonKey || !progress) return;

    const interval = setInterval(() => {
      const secondsToAdd = TIME_TRACKING_INTERVAL_MS / 1000;
      setProgress((prev) => {
        if (!prev) return null;
        return addTimeSpent(prev, trackingLessonKey, secondsToAdd);
      });
    }, TIME_TRACKING_INTERVAL_MS);

    return () => clearInterval(interval);
  }, [trackingLessonKey, progress?.courseId]);

  // ==========================================================================
  // Computed values
  // ==========================================================================
  const completionPercent = progress?.overallCompletionPercent ?? 0;
  const lessonsCompleted = progress?.lessonsCompleted ?? 0;

  const formattedTimeSpent = useMemo(() => {
    return formatTimeSpent(progress?.totalTimeSpent ?? 0);
  }, [progress?.totalTimeSpent]);

  const lastActivityFormatted = useMemo(() => {
    if (!progress?.lastActivityAt) return null;
    return getRelativeTime(progress.lastActivityAt);
  }, [progress?.lastActivityAt]);

  const weeklyActivity = useMemo(() => {
    return getWeeklyActivity(streak.streakHistory);
  }, [streak.streakHistory]);

  // ==========================================================================
  // Module-level helpers
  // ==========================================================================
  const getModuleCompletion = useCallback(
    (moduleIndex: number) => {
      if (!progress || !course) {
        return { completed: 0, total: 0, percent: 0 };
      }

      const moduleData = course.modules[moduleIndex];
      const totalInModule = moduleData?.lessons?.length || 0;

      const modProgress = calculateModuleProgress(
        progress.lessonProgress,
        moduleIndex,
        totalInModule
      );

      return {
        completed: modProgress.lessonsCompleted,
        total: totalInModule,
        percent: modProgress.completionPercent,
      };
    },
    [progress, course]
  );

  // ==========================================================================
  // Lesson-level helpers
  // ==========================================================================
  const isLessonCompleted = useCallback(
    (lessonKey: string): boolean => {
      if (!progress) return false;
      return getLessonProgress(progress, lessonKey).completed;
    },
    [progress]
  );

  const getLessonTime = useCallback(
    (lessonKey: string): number => {
      if (!progress) return 0;
      return getLessonProgress(progress, lessonKey).timeSpent;
    },
    [progress]
  );

  const getLessonQuizResult = useCallback(
    (lessonKey: string): { score: number | null; passed: boolean | null } => {
      if (!progress) return { score: null, passed: null };
      const lp = getLessonProgress(progress, lessonKey);
      return { score: lp.quizScore, passed: lp.quizPassed };
    },
    [progress]
  );

  // ==========================================================================
  // Actions
  // ==========================================================================
  const markComplete = useCallback(
    (lessonKey: string) => {
      if (!progress) return;

      const updated = updateLessonProgress(progress, lessonKey, { completed: true });
      setProgress(updated);

      // Update streak
      const newStreak = updateStreak(streak);
      setStreak(newStreak);
      saveStreakToStorage(newStreak);
    },
    [progress, streak]
  );

  const markIncomplete = useCallback(
    (lessonKey: string) => {
      if (!progress) return;

      const updated = updateLessonProgress(progress, lessonKey, {
        completed: false,
        completedAt: null,
      });

      // Reset course completion if needed
      if (updated.lessonsCompleted < updated.totalLessons) {
        updated.completedAt = null;
      }

      setProgress(updated);
    },
    [progress]
  );

  const updateQuiz = useCallback(
    (lessonKey: string, passed: boolean) => {
      if (!progress) return;

      const updated = updateLessonProgress(progress, lessonKey, {
        quizScore: passed ? 100 : 0,
        quizPassed: passed,
      });
      setProgress(updated);

      // Update streak
      const newStreak = updateStreak(streak);
      setStreak(newStreak);
      saveStreakToStorage(newStreak);
    },
    [progress, streak]
  );

  const updatePositionFn = useCallback(
    (moduleIndex: number, lessonIndex: number) => {
      if (!progress) return;

      const updated = updateCurrentPosition(progress, moduleIndex, lessonIndex);
      setProgress(updated);
    },
    [progress]
  );

  // ==========================================================================
  // Time tracking
  // ==========================================================================
  const startTracking = useCallback((lessonKey: string) => {
    setTrackingLessonKey(lessonKey);
  }, []);

  const stopTracking = useCallback(() => {
    setTrackingLessonKey(null);
  }, []);

  // ==========================================================================
  // Resume
  // ==========================================================================
  const getResumePosition = useCallback(() => {
    if (!progress) return null;

    return {
      moduleIndex: progress.currentModuleIndex,
      lessonIndex: progress.currentLessonIndex,
    };
  }, [progress]);

  // ==========================================================================
  // Sync
  // ==========================================================================
  const syncProgress = useCallback(async (): Promise<boolean> => {
    if (!progress || !syncToServer) return true;

    setIsSyncing(true);

    try {
      const response = await fetch('/api/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          courseId: progress.courseId,
          lessonProgress: progress.lessonProgress,
          currentModuleIndex: progress.currentModuleIndex,
          currentLessonIndex: progress.currentLessonIndex,
          totalTimeSpent: progress.totalTimeSpent,
          lessonsCompleted: progress.lessonsCompleted,
          overallCompletionPercent: progress.overallCompletionPercent,
          streak,
        }),
      });

      if (!response.ok) {
        throw new Error('Sync failed');
      }

      const synced = {
        ...progress,
        syncedAt: new Date().toISOString(),
        pendingSync: false,
      };
      setProgress(synced);
      saveProgressToStorage(synced);

      return true;
    } catch (err) {
      console.error('Sync error:', err);
      return false;
    } finally {
      setIsSyncing(false);
    }
  }, [progress, streak, syncToServer]);

  const resetProgress = useCallback(() => {
    if (!course?.id) return;

    const newProgress = createInitialProgress(course.id, totalLessons, userId);
    setProgress(newProgress);
    saveProgressToStorage(newProgress);
  }, [course?.id, totalLessons, userId]);

  // ==========================================================================
  // Return
  // ==========================================================================
  return {
    isLoading,
    isSyncing,
    error,
    progress,
    streak,
    completionPercent,
    lessonsCompleted,
    totalLessons,
    formattedTimeSpent,
    lastActivityFormatted,
    weeklyActivity,
    getModuleCompletion,
    isLessonCompleted,
    getLessonTime,
    getLessonQuizResult,
    markComplete,
    markIncomplete,
    updateQuiz,
    updatePosition: updatePositionFn,
    startTracking,
    stopTracking,
    getResumePosition,
    syncProgress,
    resetProgress,
  };
}

// =============================================================================
// Simple progress hook for quick access (uses existing useProgressTracking pattern)
// =============================================================================

/**
 * Lightweight hook for accessing progress without full context
 * Useful for components that just need to display progress
 */
export function useProgressDisplay(courseId: string | null) {
  const [progress, setProgress] = useState<CourseProgressData | null>(null);

  useEffect(() => {
    if (!courseId) {
      setProgress(null);
      return;
    }

    const stored = getProgressFromStorage(courseId);
    setProgress(stored);
  }, [courseId]);

  return {
    completionPercent: progress?.overallCompletionPercent ?? 0,
    lessonsCompleted: progress?.lessonsCompleted ?? 0,
    totalLessons: progress?.totalLessons ?? 0,
    lastActivity: progress?.lastActivityAt ?? null,
    currentPosition: progress
      ? { moduleIndex: progress.currentModuleIndex, lessonIndex: progress.currentLessonIndex }
      : null,
  };
}
