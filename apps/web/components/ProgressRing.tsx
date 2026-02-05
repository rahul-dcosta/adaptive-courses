'use client';

import { useEffect, useState } from 'react';

interface ProgressRingProps {
  /** Progress percentage (0-100) */
  progress: number;
  /** Size of the ring in pixels */
  size?: number;
  /** Stroke width in pixels */
  strokeWidth?: number;
  /** Primary color for the progress arc */
  color?: string;
  /** Background track color */
  trackColor?: string;
  /** Whether to show the percentage in the center */
  showPercentage?: boolean;
  /** Whether to animate the progress */
  animate?: boolean;
  /** Animation duration in ms */
  animationDuration?: number;
  /** Custom content to display in the center */
  children?: React.ReactNode;
  /** Additional CSS classes */
  className?: string;
  /** Label shown below percentage */
  label?: string;
}

export function ProgressRing({
  progress,
  size = 80,
  strokeWidth = 8,
  color = 'var(--royal-blue)',
  trackColor = 'rgba(0, 63, 135, 0.1)',
  showPercentage = true,
  animate = true,
  animationDuration = 500,
  children,
  className = '',
  label,
}: ProgressRingProps) {
  const [animatedProgress, setAnimatedProgress] = useState(animate ? 0 : progress);

  // Calculate circle dimensions
  const center = size / 2;
  const radius = center - strokeWidth / 2;
  const circumference = 2 * Math.PI * radius;

  // Animate progress on mount or when progress changes
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

      // Easing function (ease-out)
      const eased = 1 - Math.pow(1 - progressRatio, 3);
      const currentProgress = startProgress + (endProgress - startProgress) * eased;

      setAnimatedProgress(currentProgress);

      if (progressRatio < 1) {
        requestAnimationFrame(animateProgress);
      }
    };

    requestAnimationFrame(animateProgress);
  }, [progress, animate, animationDuration]);

  // Calculate stroke dashoffset for progress
  const strokeDashoffset = circumference * (1 - animatedProgress / 100);

  // Determine completion state for color variations
  const isComplete = progress >= 100;
  const progressColor = isComplete ? 'rgb(34, 197, 94)' : color;

  return (
    <div
      className={`relative inline-flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
    >
      <svg
        width={size}
        height={size}
        className="transform -rotate-90"
        role="progressbar"
        aria-valuenow={Math.round(animatedProgress)}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        {/* Background track */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={trackColor}
          strokeWidth={strokeWidth}
        />

        {/* Progress arc */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={progressColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          style={{
            transition: animate ? 'none' : `stroke-dashoffset ${animationDuration}ms ease-out`,
          }}
        />

        {/* Completion glow effect */}
        {isComplete && (
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke="rgb(34, 197, 94)"
            strokeWidth={strokeWidth + 4}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={0}
            opacity={0.2}
            className="animate-pulse"
          />
        )}
      </svg>

      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {children ? (
          children
        ) : showPercentage ? (
          <>
            <span
              className="font-bold tabular-nums"
              style={{
                fontSize: size * 0.22,
                color: progressColor,
              }}
            >
              {Math.round(animatedProgress)}%
            </span>
            {label && (
              <span
                className="text-gray-500"
                style={{ fontSize: Math.max(10, size * 0.1) }}
              >
                {label}
              </span>
            )}
          </>
        ) : null}
      </div>
    </div>
  );
}

// =============================================================================
// Variant: Mini Progress Ring (for compact displays)
// =============================================================================

interface MiniProgressRingProps {
  progress: number;
  size?: number;
  className?: string;
}

export function MiniProgressRing({
  progress,
  size = 24,
  className = '',
}: MiniProgressRingProps) {
  const strokeWidth = Math.max(2, size / 8);
  const center = size / 2;
  const radius = center - strokeWidth / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - progress / 100);

  const isComplete = progress >= 100;
  const color = isComplete ? 'rgb(34, 197, 94)' : 'var(--royal-blue)';

  return (
    <svg
      width={size}
      height={size}
      className={`transform -rotate-90 ${className}`}
      role="progressbar"
      aria-valuenow={Math.round(progress)}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <circle
        cx={center}
        cy={center}
        r={radius}
        fill="none"
        stroke="rgba(0, 63, 135, 0.1)"
        strokeWidth={strokeWidth}
      />
      <circle
        cx={center}
        cy={center}
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={strokeDashoffset}
        style={{ transition: 'stroke-dashoffset 0.3s ease-out' }}
      />
      {isComplete && (
        <circle
          cx={center}
          cy={center}
          r={radius - strokeWidth}
          fill={color}
          opacity={0.15}
        />
      )}
    </svg>
  );
}

// =============================================================================
// Variant: Progress Ring with Stats
// =============================================================================

interface ProgressRingWithStatsProps {
  progress: number;
  completed: number;
  total: number;
  size?: number;
  className?: string;
}

export function ProgressRingWithStats({
  progress,
  completed,
  total,
  size = 100,
  className = '',
}: ProgressRingWithStatsProps) {
  return (
    <div className={`flex items-center gap-4 ${className}`}>
      <ProgressRing progress={progress} size={size} />
      <div>
        <p className="text-2xl font-bold text-gray-900">
          {completed}<span className="text-gray-400">/{total}</span>
        </p>
        <p className="text-sm text-gray-600">lessons complete</p>
      </div>
    </div>
  );
}

export default ProgressRing;
