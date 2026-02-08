'use client';

import { useState, useEffect, useCallback } from 'react';
import { getDueReviews, reviewItem, type ReviewItem, type ReviewRating } from '@/lib/spaced-repetition';
import { feedbackQuizCorrect, feedbackQuizIncorrect } from '@/lib/feedback';

// =============================================================================
// Flashcard Component
// =============================================================================

interface FlashcardProps {
  item: ReviewItem;
  onRate: (rating: ReviewRating) => void;
}

function Flashcard({ item, onRate }: FlashcardProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleRate = (rating: ReviewRating) => {
    if (rating === 'again') {
      feedbackQuizIncorrect();
    } else {
      feedbackQuizCorrect();
    }
    onRate(rating);
    setIsFlipped(false);
  };

  return (
    <div className="max-w-lg mx-auto">
      {/* Card */}
      <div
        className="rounded-2xl p-8 min-h-[240px] flex flex-col justify-center cursor-pointer transition-all hover:shadow-lg"
        style={{
          backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--border-secondary)',
        }}
        onClick={() => !isFlipped && setIsFlipped(true)}
      >
        {/* Source info */}
        <p className="text-xs text-[var(--text-muted)] mb-4">
          {item.moduleTitle} &middot; {item.lessonTitle}
        </p>

        {!isFlipped ? (
          <>
            <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-6 font-serif">
              {item.question}
            </h3>
            <p className="text-sm text-[var(--text-muted)] text-center">
              Tap to reveal answer
            </p>
          </>
        ) : (
          <>
            <p className="text-xs text-[var(--text-muted)] uppercase tracking-wider mb-2">Answer</p>
            <p className="text-[var(--text-secondary)] leading-relaxed animate-fade-in">
              {item.answer}
            </p>
          </>
        )}
      </div>

      {/* Rating buttons */}
      {isFlipped && (
        <div className="flex gap-2 mt-4 animate-fade-in">
          <button
            onClick={() => handleRate('again')}
            className="flex-1 py-3 rounded-lg text-sm font-medium transition-all"
            style={{
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              color: 'rgb(220, 38, 38)',
            }}
          >
            Again
          </button>
          <button
            onClick={() => handleRate('hard')}
            className="flex-1 py-3 rounded-lg text-sm font-medium transition-all"
            style={{
              backgroundColor: 'rgba(251, 146, 60, 0.1)',
              color: 'rgb(234, 88, 12)',
            }}
          >
            Hard
          </button>
          <button
            onClick={() => handleRate('good')}
            className="flex-1 py-3 rounded-lg text-sm font-medium transition-all"
            style={{
              backgroundColor: 'rgba(34, 197, 94, 0.1)',
              color: 'rgb(22, 163, 74)',
            }}
          >
            Good
          </button>
          <button
            onClick={() => handleRate('easy')}
            className="flex-1 py-3 rounded-lg text-sm font-medium transition-all"
            style={{
              backgroundColor: 'rgba(0, 63, 135, 0.1)',
              color: 'var(--royal-blue)',
            }}
          >
            Easy
          </button>
        </div>
      )}
    </div>
  );
}

// =============================================================================
// Review Queue
// =============================================================================

interface ReviewQueueProps {
  courseId?: string;
  onComplete?: () => void;
  className?: string;
}

export function ReviewQueue({ courseId, onComplete, className = '' }: ReviewQueueProps) {
  const [dueItems, setDueItems] = useState<ReviewItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [reviewedCount, setReviewedCount] = useState(0);

  useEffect(() => {
    setDueItems(getDueReviews(courseId));
  }, [courseId]);

  const handleRate = useCallback(
    (rating: ReviewRating) => {
      const item = dueItems[currentIndex];
      if (!item) return;

      reviewItem(item.courseId, item.id, rating);
      setReviewedCount((c) => c + 1);

      if (currentIndex < dueItems.length - 1) {
        setCurrentIndex((i) => i + 1);
      } else {
        onComplete?.();
      }
    },
    [dueItems, currentIndex, onComplete]
  );

  if (dueItems.length === 0) {
    return (
      <div className={`text-center py-8 ${className}`}>
        <div
          className="w-14 h-14 rounded-full mx-auto mb-4 flex items-center justify-center"
          style={{ backgroundColor: 'rgba(34, 197, 94, 0.1)' }}
        >
          <svg className="w-7 h-7 text-green-500" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <h3 className="font-semibold text-[var(--text-primary)] mb-1">All caught up!</h3>
        <p className="text-sm text-[var(--text-muted)]">No reviews due right now.</p>
      </div>
    );
  }

  const currentItem = dueItems[currentIndex];
  const isComplete = currentIndex >= dueItems.length;

  if (isComplete) {
    return (
      <div className={`text-center py-8 ${className}`}>
        <div className="text-4xl mb-4">🎉</div>
        <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2 font-serif">
          Review Complete!
        </h3>
        <p className="text-[var(--text-secondary)]">
          You reviewed {reviewedCount} card{reviewedCount !== 1 ? 's' : ''}.
        </p>
      </div>
    );
  }

  return (
    <div className={className}>
      {/* Progress */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm text-[var(--text-muted)]">
          {currentIndex + 1} of {dueItems.length}
        </span>
        <div
          className="flex-1 mx-4 h-1.5 rounded-full overflow-hidden"
          style={{ backgroundColor: 'rgba(0, 63, 135, 0.1)' }}
        >
          <div
            className="h-full rounded-full transition-all duration-300"
            style={{
              width: `${((currentIndex + 1) / dueItems.length) * 100}%`,
              backgroundColor: 'var(--royal-blue)',
            }}
          />
        </div>
        <span className="text-sm text-[var(--text-muted)]">{reviewedCount} done</span>
      </div>

      {/* Flashcard */}
      <Flashcard key={currentItem.id} item={currentItem} onRate={handleRate} />
    </div>
  );
}

// =============================================================================
// Review Badge (for dashboard)
// =============================================================================

interface ReviewBadgeProps {
  count: number;
  onClick?: () => void;
  className?: string;
}

export function ReviewBadge({ count, onClick, className = '' }: ReviewBadgeProps) {
  if (count === 0) return null;

  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all hover:shadow-md ${className}`}
      style={{
        backgroundColor: 'rgba(0, 63, 135, 0.1)',
        color: 'var(--royal-blue)',
      }}
    >
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
        />
      </svg>
      {count} review{count !== 1 ? 's' : ''} due
    </button>
  );
}

export default ReviewQueue;
