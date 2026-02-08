'use client';

import { useState, useMemo } from 'react';
import { useSwipeGesture } from '@/hooks/useSwipeGesture';

// =============================================================================
// Types
// =============================================================================

interface CardLessonViewProps {
  content: string;
  lessonTitle: string;
  onComplete?: () => void;
  /**
   * Content formatter that returns sanitized HTML.
   * Uses the same escapeHtml + formatTextContent pipeline as CourseViewer.
   */
  formatContent: (text: string) => string;
}

// =============================================================================
// Helpers
// =============================================================================

/**
 * Split lesson content into cards by splitting on headers (##, ###)
 * or every ~200 words when no headers exist.
 */
function splitIntoCards(content: string): string[] {
  // First try splitting by headers
  const headerSplit = content.split(/\n(?=#{2,3}\s)/);
  if (headerSplit.length > 1) {
    return headerSplit.filter((s) => s.trim().length > 0);
  }

  // Fall back to splitting by double newlines (paragraphs)
  const paragraphs = content.split(/\n\n+/).filter((p) => p.trim().length > 0);

  // Group paragraphs into cards (~200 words each)
  const cards: string[] = [];
  let currentCard = '';
  let wordCount = 0;

  for (const para of paragraphs) {
    const paraWords = para.split(/\s+/).length;
    if (wordCount + paraWords > 200 && currentCard.length > 0) {
      cards.push(currentCard.trim());
      currentCard = para;
      wordCount = paraWords;
    } else {
      currentCard += (currentCard ? '\n\n' : '') + para;
      wordCount += paraWords;
    }
  }

  if (currentCard.trim()) {
    cards.push(currentCard.trim());
  }

  return cards.length > 0 ? cards : [content];
}

// =============================================================================
// Component
// =============================================================================

export function CardLessonView({ content, lessonTitle, onComplete, formatContent }: CardLessonViewProps) {
  const cards = useMemo(() => splitIntoCards(content), [content]);
  const [currentCard, setCurrentCard] = useState(0);
  const [animDir, setAnimDir] = useState<'none' | 'left' | 'right'>('none');

  const goNext = () => {
    if (currentCard < cards.length - 1) {
      setAnimDir('left');
      setTimeout(() => {
        setCurrentCard((c) => c + 1);
        setAnimDir('none');
      }, 150);
    } else if (onComplete) {
      onComplete();
    }
  };

  const goPrev = () => {
    if (currentCard > 0) {
      setAnimDir('right');
      setTimeout(() => {
        setCurrentCard((c) => c - 1);
        setAnimDir('none');
      }, 150);
    }
  };

  const swipeHandlers = useSwipeGesture({
    onSwipeLeft: goNext,
    onSwipeRight: goPrev,
  });

  const isLast = currentCard === cards.length - 1;

  // Content is pre-sanitized through escapeHtml in formatContent (same as CourseViewer)
  const formattedHtml = formatContent(cards[currentCard]);

  return (
    <div className="flex flex-col h-full" {...swipeHandlers}>
      {/* Card counter */}
      <div className="flex items-center justify-between px-4 py-3">
        <h3 className="text-sm font-semibold text-[var(--text-primary)] truncate font-serif">
          {lessonTitle}
        </h3>
        <span className="text-xs text-[var(--text-muted)] flex-shrink-0">
          {currentCard + 1}/{cards.length}
        </span>
      </div>

      {/* Progress dots */}
      <div className="flex gap-1 px-4 mb-4">
        {cards.map((_, i) => (
          <div
            key={i}
            className="h-1 rounded-full flex-1 transition-all duration-300"
            style={{
              backgroundColor:
                i <= currentCard ? 'var(--royal-blue)' : 'rgba(0, 63, 135, 0.1)',
            }}
          />
        ))}
      </div>

      {/* Card content */}
      <div className="flex-1 overflow-y-auto px-4 pb-4">
        <div
          className={`transition-all duration-150 ${
            animDir === 'left'
              ? 'opacity-0 -translate-x-4'
              : animDir === 'right'
                ? 'opacity-0 translate-x-4'
                : 'opacity-100 translate-x-0'
          }`}
        >
          {/* Content is sanitized via escapeHtml in the formatContent pipeline */}
          <div
            className="prose prose-sm max-w-none"
            style={{
              color: 'var(--text-secondary)',
              lineHeight: '1.75',
            }}
            dangerouslySetInnerHTML={{ __html: formattedHtml }}
          />
        </div>
      </div>

      {/* Navigation buttons */}
      <div className="flex gap-3 px-4 py-4" style={{ borderTop: '1px solid var(--border-secondary)' }}>
        <button
          onClick={goPrev}
          disabled={currentCard === 0}
          className="flex-1 py-3 rounded-xl text-sm font-medium transition-all disabled:opacity-30"
          style={{
            backgroundColor: 'rgba(0, 63, 135, 0.05)',
            color: 'var(--royal-blue)',
          }}
        >
          Previous
        </button>
        <button
          onClick={goNext}
          className="flex-1 py-3 rounded-xl text-sm font-semibold text-white transition-all hover:shadow-md"
          style={{ backgroundColor: 'var(--royal-blue)' }}
        >
          {isLast ? 'Complete' : 'Next'}
        </button>
      </div>
    </div>
  );
}

export default CardLessonView;
