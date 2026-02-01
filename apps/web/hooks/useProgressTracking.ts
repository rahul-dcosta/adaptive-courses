import { useMemo } from 'react';
import type { CourseProgress, ModuleProgress, QuizAttempt } from '@/lib/types';

// Flexible course type that works with CourseViewer's local interface
interface CourseForProgress {
  content?: {
    modules?: Array<{
      title: string;
      lessons?: Array<{
        title: string;
        quiz?: { question: string; answer?: string };
      }>;
    }>;
  };
}

interface ProgressTrackingResult {
  moduleProgress: ModuleProgress[];
  overallProgress: number;
  lessonsComplete: number;
  totalLessons: number;
  lessonsMastered: number;  // Lessons with quiz passed or no quiz + viewed
}

/**
 * Calculate detailed progress for a course including per-module breakdown
 *
 * Progress logic:
 * - Lesson with no quiz: 100% when viewed
 * - Lesson with quiz: 50% when viewed, 100% when quiz passed
 * - Module progress = average of lesson progress
 * - Overall = average of module progress (equal weights for V1)
 */
export function useProgressTracking(
  course: CourseForProgress | null,
  completedLessons: Set<string>,
  quizAttempts: Map<string, boolean>
): ProgressTrackingResult {
  return useMemo(() => {
    if (!course?.content?.modules) {
      return {
        moduleProgress: [],
        overallProgress: 0,
        lessonsComplete: 0,
        totalLessons: 0,
        lessonsMastered: 0,
      };
    }

    const modules = course.content.modules;
    let totalLessons = 0;
    let lessonsComplete = 0;
    let lessonsMastered = 0;

    const moduleProgress: ModuleProgress[] = modules.map((module, moduleIdx) => {
      const lessons = module.lessons || [];
      const lessonCount = lessons.length;
      totalLessons += lessonCount;

      if (lessonCount === 0) {
        return {
          title: module.title,
          progress: 0,
          status: 'empty' as const,
          lessonsComplete: 0,
          totalLessons: 0,
        };
      }

      let moduleProgressSum = 0;
      let moduleLessonsComplete = 0;

      lessons.forEach((lesson, lessonIdx) => {
        const lessonKey = `${moduleIdx}-${lessonIdx}`;
        const isViewed = completedLessons.has(lessonKey);
        const hasQuiz = !!lesson.quiz;
        const quizPassed = quizAttempts.get(lessonKey) === true;

        let lessonProgress = 0;

        if (hasQuiz) {
          // 50% for viewing, additional 50% for passing quiz
          if (isViewed) lessonProgress += 50;
          if (quizPassed) lessonProgress += 50;
        } else {
          // 100% for viewing if no quiz
          if (isViewed) lessonProgress = 100;
        }

        moduleProgressSum += lessonProgress;

        // Count as "complete" if viewed
        if (isViewed) {
          lessonsComplete++;
          moduleLessonsComplete++;
        }

        // Count as "mastered" if fully done (viewed + quiz passed, or viewed with no quiz)
        if (lessonProgress === 100) {
          lessonsMastered++;
        }
      });

      const progress = Math.round(moduleProgressSum / lessonCount);

      let status: 'empty' | 'started' | 'complete';
      if (progress === 0) {
        status = 'empty';
      } else if (progress === 100) {
        status = 'complete';
      } else {
        status = 'started';
      }

      return {
        title: module.title,
        progress,
        status,
        lessonsComplete: moduleLessonsComplete,
        totalLessons: lessonCount,
      };
    });

    // Overall progress = average of module progress (equal weights)
    const overallProgress = moduleProgress.length > 0
      ? Math.round(moduleProgress.reduce((sum, m) => sum + m.progress, 0) / moduleProgress.length)
      : 0;

    return {
      moduleProgress,
      overallProgress,
      lessonsComplete,
      totalLessons,
      lessonsMastered,
    };
  }, [course, completedLessons, quizAttempts]);
}

/**
 * Initialize progress state from localStorage
 */
export function loadProgressFromStorage(courseId: string): {
  completed: Set<string>;
  quizAttempts: Map<string, boolean>;
  lastModule: number;
  lastLesson: number;
} {
  const defaultState = {
    completed: new Set<string>(),
    quizAttempts: new Map<string, boolean>(),
    lastModule: 0,
    lastLesson: 0,
  };

  if (typeof window === 'undefined') return defaultState;

  try {
    const saved = localStorage.getItem(`course_${courseId}`);
    if (!saved) return defaultState;

    const parsed: CourseProgress = JSON.parse(saved);

    return {
      completed: new Set(parsed.completed || []),
      quizAttempts: new Map(
        (parsed.quizAttempts || []).map((a: QuizAttempt) => [a.lessonKey, a.passed])
      ),
      lastModule: parsed.lastModule || 0,
      lastLesson: parsed.lastLesson || 0,
    };
  } catch {
    return defaultState;
  }
}

/**
 * Save progress state to localStorage
 */
export function saveProgressToStorage(
  courseId: string,
  completed: Set<string>,
  quizAttempts: Map<string, boolean>,
  currentModule: number,
  currentLesson: number
): void {
  if (typeof window === 'undefined') return;

  const progress: CourseProgress = {
    completed: Array.from(completed),
    quizAttempts: Array.from(quizAttempts.entries()).map(([lessonKey, passed]) => ({
      lessonKey,
      passed,
      attemptedAt: new Date().toISOString(),
    })),
    lastModule: currentModule,
    lastLesson: currentLesson,
    lastAccessed: new Date().toISOString(),
  };

  localStorage.setItem(`course_${courseId}`, JSON.stringify(progress));
}
