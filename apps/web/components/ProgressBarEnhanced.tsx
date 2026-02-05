'use client';

import { useEffect, useState } from 'react';

// =============================================================================
// Main Progress Bar Component
// =============================================================================

interface ProgressBarProps {
  /** Progress percentage (0-100) */
  progress: number;
  /** Height of the bar in pixels */
  height?: number;
  /** Whether to show the percentage label */
  showLabel?: boolean;
  /** Label position */
  labelPosition?: 'inside' | 'right' | 'top';
  /** Whether to animate the progress */
  animate?: boolean;
  /** Animation duration in ms */
  animationDuration?: number;
  /** Primary color for the progress fill */
  color?: string;
  /** Background track color */
  trackColor?: string;
  /** Whether to show gradient fill */
  gradient?: boolean;
  /** Additional CSS classes */
  className?: string;
  /** Show completion celebration effect */
  celebrateOnComplete?: boolean;
}

export function ProgressBar({
  progress,
  height = 8,
  showLabel = false,
  labelPosition = 'right',
  animate = true,
  animationDuration = 500,
  color = 'var(--royal-blue)',
  trackColor = 'rgba(0, 63, 135, 0.1)',
  gradient = false,
  className = '',
  celebrateOnComplete = true,
}: ProgressBarProps) {
  const [animatedProgress, setAnimatedProgress] = useState(animate ? 0 : progress);
  const [showCelebration, setShowCelebration] = useState(false);

  // Animate progress
  useEffect(() => {
    if (!animate) {
      setAnimatedProgress(progress);
      return;
    }

    const startProgress = animatedProgress;
    const endProgress = Math.min(100, Math.max(0, progress));
    const startTime = performance.now();

    const animateProgress = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progressRatio = Math.min(elapsed / animationDuration, 1);
      const eased = 1 - Math.pow(1 - progressRatio, 3);
      const currentProgress = startProgress + (endProgress - startProgress) * eased;

      setAnimatedProgress(currentProgress);

      if (progressRatio < 1) {
        requestAnimationFrame(animateProgress);
      }
    };

    requestAnimationFrame(animateProgress);
  }, [progress, animate, animationDuration]);

  // Celebrate on 100%
  useEffect(() => {
    if (celebrateOnComplete && progress >= 100 && animatedProgress >= 99) {
      setShowCelebration(true);
      const timeout = setTimeout(() => setShowCelebration(false), 2000);
      return () => clearTimeout(timeout);
    }
  }, [progress, animatedProgress, celebrateOnComplete]);

  const isComplete = progress >= 100;
  const fillColor = isComplete ? 'rgb(34, 197, 94)' : color;
  const gradientStyle = gradient
    ? {
        background: isComplete
          ? 'linear-gradient(90deg, rgb(34, 197, 94) 0%, rgb(74, 222, 128) 100%)'
          : 'linear-gradient(90deg, var(--royal-blue) 0%, var(--royal-blue-light) 100%)',
      }
    : { backgroundColor: fillColor };

  const label = (
    <span
      className="text-sm font-medium tabular-nums"
      style={{ color: fillColor }}
    >
      {Math.round(animatedProgress)}%
    </span>
  );

  return (
    <div className={className}>
      {showLabel && labelPosition === 'top' && (
        <div className="flex justify-end mb-1">{label}</div>
      )}

      <div className="flex items-center gap-3">
        <div
          className="relative flex-1 rounded-full overflow-hidden"
          style={{ height, backgroundColor: trackColor }}
          role="progressbar"
          aria-valuenow={Math.round(animatedProgress)}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          {/* Progress fill */}
          <div
            className="absolute inset-y-0 left-0 rounded-full transition-all"
            style={{
              width: `${animatedProgress}%`,
              ...gradientStyle,
              transition: animate ? 'none' : `width ${animationDuration}ms ease-out`,
            }}
          />

          {/* Shine effect */}
          {animatedProgress > 0 && (
            <div
              className="absolute inset-y-0 left-0 rounded-full opacity-30"
              style={{
                width: `${animatedProgress}%`,
                background:
                  'linear-gradient(180deg, rgba(255,255,255,0.4) 0%, transparent 50%, rgba(0,0,0,0.1) 100%)',
              }}
            />
          )}

          {/* Celebration pulse */}
          {showCelebration && (
            <div
              className="absolute inset-0 rounded-full animate-pulse"
              style={{
                backgroundColor: 'rgb(34, 197, 94)',
                opacity: 0.3,
              }}
            />
          )}

          {/* Inside label */}
          {showLabel && labelPosition === 'inside' && height >= 20 && (
            <div
              className="absolute inset-0 flex items-center justify-end pr-2"
              style={{ color: 'white', fontSize: height * 0.6 }}
            >
              <span className="font-semibold tabular-nums">
                {Math.round(animatedProgress)}%
              </span>
            </div>
          )}
        </div>

        {showLabel && labelPosition === 'right' && label}
      </div>
    </div>
  );
}

// =============================================================================
// Segmented Progress Bar (for modules)
// =============================================================================

interface SegmentedProgressBarProps {
  /** Array of segment progress percentages */
  segments: Array<{
    progress: number;
    label?: string;
  }>;
  /** Height of the bar in pixels */
  height?: number;
  /** Gap between segments in pixels */
  gap?: number;
  /** Whether to show segment labels on hover */
  showLabels?: boolean;
  /** Additional CSS classes */
  className?: string;
}

export function SegmentedProgressBar({
  segments,
  height = 8,
  gap = 2,
  showLabels = true,
  className = '',
}: SegmentedProgressBarProps) {
  const [hoveredSegment, setHoveredSegment] = useState<number | null>(null);

  return (
    <div className={className}>
      <div className="flex" style={{ gap }}>
        {segments.map((segment, index) => {
          const isComplete = segment.progress >= 100;
          const isStarted = segment.progress > 0;
          const fillColor = isComplete
            ? 'rgb(34, 197, 94)'
            : isStarted
              ? 'var(--royal-blue)'
              : 'rgba(0, 63, 135, 0.2)';

          return (
            <div
              key={index}
              className="relative flex-1 rounded-full overflow-hidden cursor-pointer transition-transform hover:scale-y-125"
              style={{
                height,
                backgroundColor: 'rgba(0, 63, 135, 0.1)',
              }}
              onMouseEnter={() => setHoveredSegment(index)}
              onMouseLeave={() => setHoveredSegment(null)}
            >
              <div
                className="absolute inset-y-0 left-0 rounded-full transition-all duration-300"
                style={{
                  width: `${segment.progress}%`,
                  backgroundColor: fillColor,
                }}
              />

              {/* Tooltip */}
              {showLabels && hoveredSegment === index && (
                <div
                  className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 text-xs font-medium rounded-lg whitespace-nowrap z-10"
                  style={{
                    backgroundColor: 'var(--royal-blue)',
                    color: 'white',
                  }}
                >
                  {segment.label || `Module ${index + 1}`}: {Math.round(segment.progress)}%
                  <div
                    className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 rotate-45"
                    style={{ backgroundColor: 'var(--royal-blue)' }}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// =============================================================================
// Mini Progress Bar (for cards and compact displays)
// =============================================================================

interface MiniProgressBarProps {
  progress: number;
  height?: number;
  showLabel?: boolean;
  className?: string;
}

export function MiniProgressBar({
  progress,
  height = 4,
  showLabel = false,
  className = '',
}: MiniProgressBarProps) {
  const isComplete = progress >= 100;
  const fillColor = isComplete ? 'rgb(34, 197, 94)' : 'var(--royal-blue)';

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div
        className="flex-1 rounded-full overflow-hidden"
        style={{
          height,
          backgroundColor: 'rgba(0, 63, 135, 0.1)',
        }}
      >
        <div
          className="h-full rounded-full transition-all duration-300"
          style={{
            width: `${progress}%`,
            backgroundColor: fillColor,
          }}
        />
      </div>
      {showLabel && (
        <span
          className="text-xs font-medium tabular-nums"
          style={{ color: fillColor }}
        >
          {Math.round(progress)}%
        </span>
      )}
    </div>
  );
}

// =============================================================================
// Progress Bar with Module Markers
// =============================================================================

interface ProgressBarWithMarkersProps {
  progress: number;
  moduleCount: number;
  currentModule: number;
  height?: number;
  className?: string;
}

export function ProgressBarWithMarkers({
  progress,
  moduleCount,
  currentModule,
  height = 8,
  className = '',
}: ProgressBarWithMarkersProps) {
  const isComplete = progress >= 100;
  const fillColor = isComplete ? 'rgb(34, 197, 94)' : 'var(--royal-blue)';

  return (
    <div className={`relative ${className}`} style={{ paddingTop: 12 }}>
      {/* Module markers */}
      <div className="absolute top-0 left-0 right-0 flex justify-between px-0.5">
        {Array.from({ length: moduleCount }).map((_, index) => {
          const markerPosition = ((index + 1) / moduleCount) * 100;
          const isPast = progress >= markerPosition;
          const isCurrent = currentModule === index;

          return (
            <div
              key={index}
              className="relative flex flex-col items-center"
              style={{ width: `${100 / moduleCount}%` }}
            >
              <div
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  isCurrent ? 'ring-2 ring-offset-1 ring-[var(--royal-blue)]' : ''
                }`}
                style={{
                  backgroundColor: isPast ? fillColor : 'rgba(0, 63, 135, 0.2)',
                }}
              />
            </div>
          );
        })}
      </div>

      {/* Progress bar */}
      <div
        className="relative rounded-full overflow-hidden"
        style={{
          height,
          backgroundColor: 'rgba(0, 63, 135, 0.1)',
        }}
      >
        <div
          className="absolute inset-y-0 left-0 rounded-full transition-all duration-500"
          style={{
            width: `${progress}%`,
            backgroundColor: fillColor,
          }}
        />
      </div>
    </div>
  );
}

export default ProgressBar;
