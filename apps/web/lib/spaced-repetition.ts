/**
 * Spaced Repetition System (SM-2 Algorithm)
 *
 * Creates review items from quiz questions and schedules them
 * using the SuperMemo SM-2 algorithm for optimal retention.
 */

// =============================================================================
// Types
// =============================================================================

export interface ReviewItem {
  id: string;
  courseId: string;
  question: string;
  answer: string;
  lessonTitle: string;
  moduleTitle: string;

  // SM-2 parameters
  easeFactor: number; // starts at 2.5
  interval: number; // days until next review
  repetitions: number; // successful reviews in a row
  nextReviewDate: string; // ISO date string (YYYY-MM-DD)
  lastReviewDate: string | null;
}

export type ReviewRating = 'again' | 'hard' | 'good' | 'easy';

// =============================================================================
// Constants
// =============================================================================

const REVIEW_STORAGE_PREFIX = 'ac_reviews_';

// =============================================================================
// Storage
// =============================================================================

export function getReviewItems(courseId: string): ReviewItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(`${REVIEW_STORAGE_PREFIX}${courseId}`);
    if (!raw) return [];
    return JSON.parse(raw) as ReviewItem[];
  } catch {
    return [];
  }
}

export function saveReviewItems(courseId: string, items: ReviewItem[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(`${REVIEW_STORAGE_PREFIX}${courseId}`, JSON.stringify(items));
  } catch {
    // silently fail
  }
}

export function getAllReviewItems(): ReviewItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const results: ReviewItem[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith(REVIEW_STORAGE_PREFIX)) {
        const raw = localStorage.getItem(key);
        if (raw) {
          results.push(...(JSON.parse(raw) as ReviewItem[]));
        }
      }
    }
    return results;
  } catch {
    return [];
  }
}

// =============================================================================
// SM-2 Algorithm
// =============================================================================

/**
 * Add or update a review item from a quiz question
 */
export function addReviewItem(
  courseId: string,
  lessonKey: string,
  question: string,
  answer: string,
  lessonTitle: string,
  moduleTitle: string
): void {
  const items = getReviewItems(courseId);
  const id = `${courseId}-${lessonKey}`;

  // Don't add if already exists
  if (items.some((item) => item.id === id)) return;

  const today = new Date().toISOString().split('T')[0];

  items.push({
    id,
    courseId,
    question,
    answer,
    lessonTitle,
    moduleTitle,
    easeFactor: 2.5,
    interval: 1,
    repetitions: 0,
    nextReviewDate: today, // Due immediately on first review
    lastReviewDate: null,
  });

  saveReviewItems(courseId, items);
}

/**
 * Apply SM-2 algorithm to a review item based on user rating.
 *
 * Rating mapping:
 * - again (0): Complete failure. Reset repetitions.
 * - hard (3): Correct but difficult. Slight interval increase.
 * - good (4): Correct with some effort. Normal increase.
 * - easy (5): Perfect recall. Large interval increase.
 */
export function reviewItem(courseId: string, itemId: string, rating: ReviewRating): void {
  const items = getReviewItems(courseId);
  const item = items.find((i) => i.id === itemId);
  if (!item) return;

  const qualityMap: Record<ReviewRating, number> = {
    again: 0,
    hard: 3,
    good: 4,
    easy: 5,
  };

  const quality = qualityMap[rating];
  const today = new Date().toISOString().split('T')[0];

  if (quality < 3) {
    // Failed — reset
    item.repetitions = 0;
    item.interval = 1;
  } else {
    // Successful review
    if (item.repetitions === 0) {
      item.interval = 1;
    } else if (item.repetitions === 1) {
      item.interval = 6;
    } else {
      item.interval = Math.round(item.interval * item.easeFactor);
    }
    item.repetitions += 1;
  }

  // Update ease factor (minimum 1.3)
  item.easeFactor = Math.max(
    1.3,
    item.easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))
  );

  // Schedule next review
  const nextDate = new Date();
  nextDate.setDate(nextDate.getDate() + item.interval);
  item.nextReviewDate = nextDate.toISOString().split('T')[0];
  item.lastReviewDate = today;

  saveReviewItems(courseId, items);
}

// =============================================================================
// Queries
// =============================================================================

/**
 * Get items due for review today (or overdue)
 */
export function getDueReviews(courseId?: string): ReviewItem[] {
  const items = courseId ? getReviewItems(courseId) : getAllReviewItems();
  const today = new Date().toISOString().split('T')[0];
  return items.filter((item) => item.nextReviewDate <= today);
}

/**
 * Get total count of items due for review across all courses
 */
export function getTotalDueCount(): number {
  return getDueReviews().length;
}
