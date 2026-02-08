'use client';

import { useEffect, useRef, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { feedbackMilestone } from '@/lib/feedback';
import type { Milestone } from '@/hooks/useMilestoneDetection';

// =============================================================================
// Confetti Presets
// =============================================================================

function fireConfetti(type: 'progress' | 'streak' | 'lessons', value: number) {
  const isBig = value >= 100 || (type === 'progress' && value >= 75);

  if (isBig) {
    // Grand celebration — multiple bursts
    const duration = 2000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.7 },
        colors: ['#003F87', '#0056B3', '#FFD700', '#22C55E'],
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.7 },
        colors: ['#003F87', '#0056B3', '#FFD700', '#22C55E'],
      });
      if (Date.now() < end) requestAnimationFrame(frame);
    };
    frame();
  } else {
    // Simple burst
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#003F87', '#0056B3', '#FFD700', '#22C55E', '#818CF8'],
    });
  }
}

// =============================================================================
// Component
// =============================================================================

interface MilestoneCelebrationProps {
  milestone: Milestone;
  onDismiss: () => void;
}

export function MilestoneCelebration({ milestone, onDismiss }: MilestoneCelebrationProps) {
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!hasAnimated.current) {
      hasAnimated.current = true;
      fireConfetti(milestone.type, milestone.value);
      feedbackMilestone();
    }
  }, [milestone]);

  // Dismiss on Escape key
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onDismiss();
    },
    [onDismiss]
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      onClick={onDismiss}
      role="dialog"
      aria-modal="true"
      aria-label={milestone.title}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 animate-fade-in"
        style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', backdropFilter: 'blur(4px)' }}
      />

      {/* Card */}
      <div
        className="relative bg-[var(--bg-card)] rounded-2xl shadow-2xl max-w-sm w-full p-8 text-center animate-fade-in-scale"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Emoji badge */}
        <div className="text-6xl mb-4 animate-celebrate-pop">{milestone.emoji}</div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-[var(--text-primary)] font-serif mb-2">
          {milestone.title}
        </h2>

        {/* Description */}
        <p className="text-[var(--text-secondary)] mb-6">{milestone.description}</p>

        {/* Progress indicator for progress milestones */}
        {milestone.type === 'progress' && (
          <div className="mb-6">
            <div
              className="h-2 rounded-full overflow-hidden"
              style={{ backgroundColor: 'rgba(0, 63, 135, 0.1)' }}
            >
              <div
                className="h-full rounded-full transition-all duration-1000 ease-out"
                style={{
                  width: `${milestone.value}%`,
                  background:
                    milestone.value >= 100
                      ? 'linear-gradient(90deg, #22C55E, #16A34A)'
                      : 'linear-gradient(90deg, #003F87, #0056B3)',
                }}
              />
            </div>
            <p className="text-xs text-[var(--text-muted)] mt-1">{milestone.value}% complete</p>
          </div>
        )}

        {/* Dismiss button */}
        <button
          onClick={onDismiss}
          className="w-full py-3 px-6 rounded-xl font-semibold text-white transition-all hover:shadow-lg"
          style={{ backgroundColor: 'var(--royal-blue)' }}
        >
          {milestone.value >= 100 && milestone.type === 'progress' ? 'Celebrate!' : 'Keep Going!'}
        </button>
      </div>
    </div>
  );
}

export default MilestoneCelebration;
