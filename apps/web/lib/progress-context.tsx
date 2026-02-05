'use client';

import {
  createContext,
  useContext,
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';
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
  SYNC_DEBOUNCE_MS,
  TIME_TRACKING_INTERVAL_MS,
} from './progress';

// =============================================================================
// Context Types
// =============================================================================

interface ProgressContextValue {
  // State
  progress: CourseProgressData | null;
  streak: StreakData;
  isLoading: boolean;
  isSyncing: boolean;
  error: string | null;

  // Course management
  initializeCourse: (courseId: string, totalLessons: number, userId?: string) => void;
  loadCourse: (courseId: string) => void;
  clearCourse: () => void;

  // Lesson progress
  markLessonComplete: (lessonKey: string) => void;
  markLessonIncomplete: (lessonKey: string) => void;
  updateQuizScore: (lessonKey: string, score: number, passed: boolean) => void;
  getLessonProgressData: (lessonKey: string) => LessonProgress | null;

  // Time tracking
  startTimeTracking: (lessonKey: string) => void;
  stopTimeTracking: () => void;

  // Position tracking
  updatePosition: (moduleIndex: number, lessonIndex: number) => void;
  getCurrentPosition: () => { moduleIndex: number; lessonIndex: number } | null;

  // Module progress
  getModuleProgress: (moduleIndex: number, totalLessonsInModule: number) => {
    lessonsCompleted: number;
    totalLessons: number;
    completionPercent: number;
  } | null;

  // Sync
  syncToDatabase: () => Promise<boolean>;
}

const ProgressContext = createContext<ProgressContextValue | null>(null);

// =============================================================================
// Provider Component
// =============================================================================

interface ProgressProviderProps {
  children: ReactNode;
}

export function ProgressProvider({ children }: ProgressProviderProps) {
  // State
  const [progress, setProgress] = useState<CourseProgressData | null>(null);
  const [streak, setStreak] = useState<StreakData>(() => getStreakFromStorage());
  const [isLoading, setIsLoading] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Refs for time tracking
  const timeTrackingRef = useRef<{
    lessonKey: string | null;
    intervalId: ReturnType<typeof setInterval> | null;
    startTime: number | null;
  }>({
    lessonKey: null,
    intervalId: null,
    startTime: null,
  });

  // Ref for sync debouncing
  const syncTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ==========================================================================
  // Auto-save to localStorage when progress changes
  // ==========================================================================
  useEffect(() => {
    if (progress) {
      saveProgressToStorage(progress);

      // Debounce database sync
      if (progress.pendingSync) {
        if (syncTimeoutRef.current) {
          clearTimeout(syncTimeoutRef.current);
        }
        syncTimeoutRef.current = setTimeout(() => {
          syncToDatabase();
        }, SYNC_DEBOUNCE_MS);
      }
    }
  }, [progress]);

  // Save streak when it changes
  useEffect(() => {
    saveStreakToStorage(streak);
  }, [streak]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeTrackingRef.current.intervalId) {
        clearInterval(timeTrackingRef.current.intervalId);
      }
      if (syncTimeoutRef.current) {
        clearTimeout(syncTimeoutRef.current);
      }
    };
  }, []);

  // ==========================================================================
  // Course Management
  // ==========================================================================

  const initializeCourse = useCallback(
    (courseId: string, totalLessons: number, userId?: string) => {
      setIsLoading(true);
      setError(null);

      try {
        // Check if we have existing progress
        const existingProgress = getProgressFromStorage(courseId);

        if (existingProgress) {
          // Update totalLessons if it changed (course might have been regenerated)
          if (existingProgress.totalLessons !== totalLessons) {
            existingProgress.totalLessons = totalLessons;
          }
          setProgress(existingProgress);
        } else {
          // Create new progress
          const newProgress = createInitialProgress(courseId, totalLessons, userId);
          setProgress(newProgress);
          saveProgressToStorage(newProgress);
        }

        // Update streak
        const updatedStreak = updateStreak(streak);
        setStreak(updatedStreak);
      } catch (err) {
        setError('Failed to initialize course progress');
        console.error('Error initializing course progress:', err);
      } finally {
        setIsLoading(false);
      }
    },
    [streak]
  );

  const loadCourse = useCallback((courseId: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const existingProgress = getProgressFromStorage(courseId);
      if (existingProgress) {
        setProgress(existingProgress);
      } else {
        setProgress(null);
      }
    } catch (err) {
      setError('Failed to load course progress');
      console.error('Error loading course progress:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearCourse = useCallback(() => {
    stopTimeTracking();
    setProgress(null);
  }, []);

  // ==========================================================================
  // Lesson Progress
  // ==========================================================================

  const markLessonComplete = useCallback(
    (lessonKey: string) => {
      if (!progress) return;

      const updatedProgress = updateLessonProgress(progress, lessonKey, {
        completed: true,
      });
      setProgress(updatedProgress);

      // Update global streak
      const updatedStreak = updateStreak(streak);
      setStreak(updatedStreak);
    },
    [progress, streak]
  );

  const markLessonIncomplete = useCallback(
    (lessonKey: string) => {
      if (!progress) return;

      const updatedProgress = updateLessonProgress(progress, lessonKey, {
        completed: false,
        completedAt: null,
      });

      // Recalculate completedAt if course was marked complete
      if (updatedProgress.lessonsCompleted < updatedProgress.totalLessons) {
        updatedProgress.completedAt = null;
      }

      setProgress(updatedProgress);
    },
    [progress]
  );

  const updateQuizScore = useCallback(
    (lessonKey: string, score: number, passed: boolean) => {
      if (!progress) return;

      const updatedProgress = updateLessonProgress(progress, lessonKey, {
        quizScore: score,
        quizPassed: passed,
      });
      setProgress(updatedProgress);

      // Update global streak
      const updatedStreak = updateStreak(streak);
      setStreak(updatedStreak);
    },
    [progress, streak]
  );

  const getLessonProgressData = useCallback(
    (lessonKey: string): LessonProgress | null => {
      if (!progress) return null;
      return getLessonProgress(progress, lessonKey);
    },
    [progress]
  );

  // ==========================================================================
  // Time Tracking
  // ==========================================================================

  const startTimeTracking = useCallback(
    (lessonKey: string) => {
      // Stop any existing tracking
      if (timeTrackingRef.current.intervalId) {
        clearInterval(timeTrackingRef.current.intervalId);
      }

      timeTrackingRef.current = {
        lessonKey,
        startTime: Date.now(),
        intervalId: setInterval(() => {
          if (!progress) return;

          // Add time in increments
          const secondsToAdd = TIME_TRACKING_INTERVAL_MS / 1000;
          const updatedProgress = addTimeSpent(progress, lessonKey, secondsToAdd);
          setProgress(updatedProgress);
        }, TIME_TRACKING_INTERVAL_MS),
      };
    },
    [progress]
  );

  const stopTimeTracking = useCallback(() => {
    if (timeTrackingRef.current.intervalId) {
      clearInterval(timeTrackingRef.current.intervalId);

      // Add any remaining time since last interval
      if (
        progress &&
        timeTrackingRef.current.lessonKey &&
        timeTrackingRef.current.startTime
      ) {
        const elapsedMs = Date.now() - timeTrackingRef.current.startTime;
        const lastUpdateMs =
          Math.floor(elapsedMs / TIME_TRACKING_INTERVAL_MS) * TIME_TRACKING_INTERVAL_MS;
        const remainingSeconds = Math.floor((elapsedMs - lastUpdateMs) / 1000);

        if (remainingSeconds > 0) {
          const updatedProgress = addTimeSpent(
            progress,
            timeTrackingRef.current.lessonKey,
            remainingSeconds
          );
          setProgress(updatedProgress);
        }
      }

      timeTrackingRef.current = {
        lessonKey: null,
        intervalId: null,
        startTime: null,
      };
    }
  }, [progress]);

  // ==========================================================================
  // Position Tracking
  // ==========================================================================

  const updatePosition = useCallback(
    (moduleIndex: number, lessonIndex: number) => {
      if (!progress) return;

      const updatedProgress = updateCurrentPosition(progress, moduleIndex, lessonIndex);
      setProgress(updatedProgress);
    },
    [progress]
  );

  const getCurrentPosition = useCallback(() => {
    if (!progress) return null;

    return {
      moduleIndex: progress.currentModuleIndex,
      lessonIndex: progress.currentLessonIndex,
    };
  }, [progress]);

  // ==========================================================================
  // Module Progress
  // ==========================================================================

  const getModuleProgress = useCallback(
    (moduleIndex: number, totalLessonsInModule: number) => {
      if (!progress) return null;

      const moduleData = calculateModuleProgress(
        progress.lessonProgress,
        moduleIndex,
        totalLessonsInModule
      );

      return {
        lessonsCompleted: moduleData.lessonsCompleted,
        totalLessons: moduleData.totalLessons,
        completionPercent: moduleData.completionPercent,
      };
    },
    [progress]
  );

  // ==========================================================================
  // Database Sync
  // ==========================================================================

  const syncToDatabase = useCallback(async (): Promise<boolean> => {
    if (!progress || !progress.pendingSync) return true;

    setIsSyncing(true);
    setError(null);

    try {
      const response = await fetch('/api/progress', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          courseId: progress.courseId,
          lessonProgress: progress.lessonProgress,
          currentModuleIndex: progress.currentModuleIndex,
          currentLessonIndex: progress.currentLessonIndex,
          totalTimeSpent: progress.totalTimeSpent,
          lessonsCompleted: progress.lessonsCompleted,
          overallCompletionPercent: progress.overallCompletionPercent,
          streak: streak,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to sync progress');
      }

      // Mark as synced
      const syncedProgress = {
        ...progress,
        syncedAt: new Date().toISOString(),
        pendingSync: false,
      };
      setProgress(syncedProgress);
      saveProgressToStorage(syncedProgress);

      return true;
    } catch (err) {
      console.error('Failed to sync progress to database:', err);
      // Don't set error state - sync failures shouldn't block the user
      return false;
    } finally {
      setIsSyncing(false);
    }
  }, [progress, streak]);

  // ==========================================================================
  // Context Value
  // ==========================================================================

  const value: ProgressContextValue = {
    progress,
    streak,
    isLoading,
    isSyncing,
    error,
    initializeCourse,
    loadCourse,
    clearCourse,
    markLessonComplete,
    markLessonIncomplete,
    updateQuizScore,
    getLessonProgressData,
    startTimeTracking,
    stopTimeTracking,
    updatePosition,
    getCurrentPosition,
    getModuleProgress,
    syncToDatabase,
  };

  return (
    <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>
  );
}

// =============================================================================
// Hook
// =============================================================================

export function useProgressContext(): ProgressContextValue {
  const context = useContext(ProgressContext);
  if (!context) {
    throw new Error('useProgressContext must be used within a ProgressProvider');
  }
  return context;
}
