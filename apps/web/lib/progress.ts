/**
 * Progress Tracking Types and Utilities
 *
 * This module provides comprehensive progress tracking for courses,
 * including lesson completion, time spent, quiz scores, and learning streaks.
 */

// =============================================================================
// Types
// =============================================================================

/**
 * Progress data for a single lesson
 */
export interface LessonProgress {
  completed: boolean;
  completedAt: string | null;
  timeSpent: number; // seconds
  quizScore: number | null; // 0-100, null if no quiz or not attempted
  quizPassed: boolean | null;
}

/**
 * Progress data for a module (collection of lessons)
 */
export interface ModuleProgressData {
  lessonsCompleted: number;
  totalLessons: number;
  quizScores: number[]; // Array of scores for lessons with quizzes
  averageQuizScore: number | null;
  timeSpent: number; // total seconds across all lessons
  completionPercent: number;
}

/**
 * Streak data for gamification
 */
export interface StreakData {
  currentStreak: number;
  longestStreak: number;
  lastActivityDate: string | null; // ISO date string (YYYY-MM-DD)
  streakHistory: string[]; // Array of dates with activity (last 30 days)
}

/**
 * Complete progress data for a course
 */
export interface CourseProgressData {
  courseId: string;
  userId?: string;

  // Lesson progress by key (moduleIdx-lessonIdx)
  lessonProgress: Record<string, LessonProgress>;

  // Current position for resume functionality
  currentModuleIndex: number;
  currentLessonIndex: number;

  // Overall statistics
  overallCompletionPercent: number;
  totalTimeSpent: number; // seconds
  lessonsCompleted: number;
  totalLessons: number;

  // Streak data
  streak: StreakData;

  // Timestamps
  startedAt: string;
  lastActivityAt: string;
  completedAt: string | null;

  // Sync status
  syncedAt: string | null;
  pendingSync: boolean;
}

/**
 * Progress update payload for API calls
 */
export interface ProgressUpdatePayload {
  courseId: string;
  lessonKey?: string;
  updates: Partial<LessonProgress>;
  currentPosition?: {
    moduleIndex: number;
    lessonIndex: number;
  };
}

/**
 * Batch progress update for syncing multiple changes
 */
export interface BatchProgressUpdate {
  courseId: string;
  updates: Array<{
    lessonKey: string;
    progress: Partial<LessonProgress>;
  }>;
  currentPosition: {
    moduleIndex: number;
    lessonIndex: number;
  };
  totalTimeSpent: number;
}

// =============================================================================
// Constants
// =============================================================================

export const PROGRESS_STORAGE_PREFIX = 'ac_progress_';
export const STREAK_STORAGE_KEY = 'ac_streak_data';
export const SYNC_DEBOUNCE_MS = 2000;
export const TIME_TRACKING_INTERVAL_MS = 10000; // Update time every 10 seconds

// =============================================================================
// Local Storage Helpers
// =============================================================================

/**
 * Get progress data from localStorage
 */
export function getProgressFromStorage(courseId: string): CourseProgressData | null {
  if (typeof window === 'undefined') return null;

  try {
    const key = `${PROGRESS_STORAGE_PREFIX}${courseId}`;
    const data = localStorage.getItem(key);
    if (!data) return null;

    return JSON.parse(data) as CourseProgressData;
  } catch (error) {
    console.warn('Failed to load progress from localStorage:', error);
    return null;
  }
}

/**
 * Save progress data to localStorage
 */
export function saveProgressToStorage(progress: CourseProgressData): boolean {
  if (typeof window === 'undefined') return false;

  try {
    const key = `${PROGRESS_STORAGE_PREFIX}${progress.courseId}`;
    localStorage.setItem(key, JSON.stringify(progress));
    return true;
  } catch (error) {
    console.warn('Failed to save progress to localStorage:', error);
    return false;
  }
}

/**
 * Remove progress data from localStorage
 */
export function removeProgressFromStorage(courseId: string): boolean {
  if (typeof window === 'undefined') return false;

  try {
    const key = `${PROGRESS_STORAGE_PREFIX}${courseId}`;
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.warn('Failed to remove progress from localStorage:', error);
    return false;
  }
}

/**
 * Get all course progress from localStorage
 */
export function getAllProgressFromStorage(): CourseProgressData[] {
  if (typeof window === 'undefined') return [];

  try {
    const results: CourseProgressData[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith(PROGRESS_STORAGE_PREFIX)) {
        const data = localStorage.getItem(key);
        if (data) {
          results.push(JSON.parse(data) as CourseProgressData);
        }
      }
    }
    return results;
  } catch (error) {
    console.warn('Failed to load all progress from localStorage:', error);
    return [];
  }
}

// =============================================================================
// Streak Helpers
// =============================================================================

/**
 * Get streak data from localStorage
 */
export function getStreakFromStorage(): StreakData {
  if (typeof window === 'undefined') {
    return createDefaultStreak();
  }

  try {
    const data = localStorage.getItem(STREAK_STORAGE_KEY);
    if (!data) return createDefaultStreak();

    return JSON.parse(data) as StreakData;
  } catch (error) {
    console.warn('Failed to load streak from localStorage:', error);
    return createDefaultStreak();
  }
}

/**
 * Save streak data to localStorage
 */
export function saveStreakToStorage(streak: StreakData): boolean {
  if (typeof window === 'undefined') return false;

  try {
    localStorage.setItem(STREAK_STORAGE_KEY, JSON.stringify(streak));
    return true;
  } catch (error) {
    console.warn('Failed to save streak to localStorage:', error);
    return false;
  }
}

/**
 * Create default streak data
 */
export function createDefaultStreak(): StreakData {
  return {
    currentStreak: 0,
    longestStreak: 0,
    lastActivityDate: null,
    streakHistory: [],
  };
}

/**
 * Update streak data with new activity
 */
export function updateStreak(existingStreak: StreakData): StreakData {
  const today = new Date().toISOString().split('T')[0];
  const streak = { ...existingStreak };

  if (streak.lastActivityDate === today) {
    // Already recorded activity today
    return streak;
  }

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split('T')[0];

  if (streak.lastActivityDate === yesterdayStr) {
    // Continuing streak from yesterday
    streak.currentStreak += 1;
  } else if (streak.lastActivityDate === null || streak.lastActivityDate < yesterdayStr) {
    // Streak broken, start new one
    streak.currentStreak = 1;
  }

  // Update longest streak
  if (streak.currentStreak > streak.longestStreak) {
    streak.longestStreak = streak.currentStreak;
  }

  // Update last activity date
  streak.lastActivityDate = today;

  // Update streak history (keep last 30 days)
  if (!streak.streakHistory.includes(today)) {
    streak.streakHistory = [...streak.streakHistory, today].slice(-30);
  }

  return streak;
}

/**
 * Check if streak is still active (user had activity yesterday or today)
 */
export function isStreakActive(streak: StreakData): boolean {
  if (!streak.lastActivityDate) return false;

  const today = new Date().toISOString().split('T')[0];
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split('T')[0];

  return streak.lastActivityDate === today || streak.lastActivityDate === yesterdayStr;
}

// =============================================================================
// Progress Calculation Helpers
// =============================================================================

/**
 * Create initial progress data for a course
 */
export function createInitialProgress(
  courseId: string,
  totalLessons: number,
  userId?: string
): CourseProgressData {
  const now = new Date().toISOString();

  return {
    courseId,
    userId,
    lessonProgress: {},
    currentModuleIndex: 0,
    currentLessonIndex: 0,
    overallCompletionPercent: 0,
    totalTimeSpent: 0,
    lessonsCompleted: 0,
    totalLessons,
    streak: createDefaultStreak(),
    startedAt: now,
    lastActivityAt: now,
    completedAt: null,
    syncedAt: null,
    pendingSync: false,
  };
}

/**
 * Calculate overall completion percentage from lesson progress
 */
export function calculateCompletionPercent(
  lessonProgress: Record<string, LessonProgress>,
  totalLessons: number
): number {
  if (totalLessons === 0) return 0;

  const completedLessons = Object.values(lessonProgress).filter(
    (lp) => lp.completed
  ).length;

  return Math.round((completedLessons / totalLessons) * 100);
}

/**
 * Calculate module progress from lesson progress
 */
export function calculateModuleProgress(
  lessonProgress: Record<string, LessonProgress>,
  moduleIndex: number,
  totalLessonsInModule: number
): ModuleProgressData {
  let lessonsCompleted = 0;
  let timeSpent = 0;
  const quizScores: number[] = [];

  for (let i = 0; i < totalLessonsInModule; i++) {
    const key = `${moduleIndex}-${i}`;
    const progress = lessonProgress[key];

    if (progress) {
      if (progress.completed) lessonsCompleted++;
      timeSpent += progress.timeSpent;
      if (progress.quizScore !== null) {
        quizScores.push(progress.quizScore);
      }
    }
  }

  const averageQuizScore = quizScores.length > 0
    ? Math.round(quizScores.reduce((a, b) => a + b, 0) / quizScores.length)
    : null;

  const completionPercent = totalLessonsInModule > 0
    ? Math.round((lessonsCompleted / totalLessonsInModule) * 100)
    : 0;

  return {
    lessonsCompleted,
    totalLessons: totalLessonsInModule,
    quizScores,
    averageQuizScore,
    timeSpent,
    completionPercent,
  };
}

/**
 * Get lesson progress or create default
 */
export function getLessonProgress(
  progress: CourseProgressData,
  lessonKey: string
): LessonProgress {
  return progress.lessonProgress[lessonKey] || {
    completed: false,
    completedAt: null,
    timeSpent: 0,
    quizScore: null,
    quizPassed: null,
  };
}

/**
 * Update lesson progress
 */
export function updateLessonProgress(
  progress: CourseProgressData,
  lessonKey: string,
  updates: Partial<LessonProgress>
): CourseProgressData {
  const existingLesson = getLessonProgress(progress, lessonKey);
  const updatedLesson = { ...existingLesson, ...updates };

  // If marking as complete and not already complete, set completedAt
  if (updates.completed && !existingLesson.completed) {
    updatedLesson.completedAt = new Date().toISOString();
  }

  const newProgress = {
    ...progress,
    lessonProgress: {
      ...progress.lessonProgress,
      [lessonKey]: updatedLesson,
    },
    lastActivityAt: new Date().toISOString(),
    pendingSync: true,
  };

  // Recalculate overall stats
  newProgress.lessonsCompleted = Object.values(newProgress.lessonProgress).filter(
    (lp) => lp.completed
  ).length;
  newProgress.overallCompletionPercent = calculateCompletionPercent(
    newProgress.lessonProgress,
    newProgress.totalLessons
  );
  newProgress.totalTimeSpent = Object.values(newProgress.lessonProgress).reduce(
    (sum, lp) => sum + lp.timeSpent,
    0
  );

  // Check if course is completed
  if (newProgress.lessonsCompleted === newProgress.totalLessons && !newProgress.completedAt) {
    newProgress.completedAt = new Date().toISOString();
  }

  // Update streak
  newProgress.streak = updateStreak(newProgress.streak);

  return newProgress;
}

/**
 * Update current position (resume functionality)
 */
export function updateCurrentPosition(
  progress: CourseProgressData,
  moduleIndex: number,
  lessonIndex: number
): CourseProgressData {
  return {
    ...progress,
    currentModuleIndex: moduleIndex,
    currentLessonIndex: lessonIndex,
    lastActivityAt: new Date().toISOString(),
    pendingSync: true,
  };
}

/**
 * Add time spent to a lesson
 */
export function addTimeSpent(
  progress: CourseProgressData,
  lessonKey: string,
  seconds: number
): CourseProgressData {
  const existingLesson = getLessonProgress(progress, lessonKey);

  return {
    ...progress,
    lessonProgress: {
      ...progress.lessonProgress,
      [lessonKey]: {
        ...existingLesson,
        timeSpent: existingLesson.timeSpent + seconds,
      },
    },
    totalTimeSpent: progress.totalTimeSpent + seconds,
    lastActivityAt: new Date().toISOString(),
    pendingSync: true,
  };
}

// =============================================================================
// Time Formatting Helpers
// =============================================================================

/**
 * Format seconds into human-readable time
 */
export function formatTimeSpent(seconds: number): string {
  if (seconds < 60) {
    return `${seconds}s`;
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  if (minutes < 60) {
    return remainingSeconds > 0 ? `${minutes}m ${remainingSeconds}s` : `${minutes}m`;
  }

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (remainingMinutes > 0) {
    return `${hours}h ${remainingMinutes}m`;
  }
  return `${hours}h`;
}

/**
 * Get relative time string (e.g., "2 hours ago")
 */
export function getRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSeconds < 60) {
    return 'just now';
  }
  if (diffMinutes < 60) {
    return `${diffMinutes} minute${diffMinutes !== 1 ? 's' : ''} ago`;
  }
  if (diffHours < 24) {
    return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
  }
  if (diffDays < 7) {
    return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
  }

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
  });
}

// =============================================================================
// Weekly Activity Helpers
// =============================================================================

/**
 * Get activity data for the past week
 */
export function getWeeklyActivity(streakHistory: string[]): Array<{
  date: string;
  dayName: string;
  hasActivity: boolean;
}> {
  const result = [];
  const today = new Date();

  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });

    result.push({
      date: dateStr,
      dayName,
      hasActivity: streakHistory.includes(dateStr),
    });
  }

  return result;
}
