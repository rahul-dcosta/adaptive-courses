'use client';

import { useState, useRef, useEffect } from 'react';
import type { ModuleProgress } from '@/lib/types';

interface ProgressTableProps {
  moduleProgress: ModuleProgress[];
  overallProgress: number;
  lessonsMastered: number;
  totalLessons: number;
}

function StatusIndicator({ status, animate }: { status: 'empty' | 'started' | 'complete'; animate?: boolean }) {
  const colors = {
    empty: { bg: 'rgb(229, 231, 235)', dot: 'rgb(156, 163, 175)' },     // Gray
    started: { bg: 'rgb(254, 243, 199)', dot: 'rgb(245, 158, 11)' },    // Amber/Yellow
    complete: { bg: 'rgb(209, 250, 229)', dot: 'rgb(16, 185, 129)' },   // Green
  };

  const color = colors[status];

  return (
    <div
      className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
        animate && status === 'complete' ? 'scale-110' : ''
      }`}
      style={{ backgroundColor: color.bg }}
    >
      <div
        className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full transition-transform duration-300 ${
          animate && status === 'complete' ? 'scale-125' : ''
        }`}
        style={{ backgroundColor: color.dot }}
      />
    </div>
  );
}

export function ProgressTable({
  moduleProgress,
  overallProgress,
  lessonsMastered,
  totalLessons,
}: ProgressTableProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useState<number | 'auto'>('auto');

  // Measure content height for smooth animation
  useEffect(() => {
    if (contentRef.current) {
      setContentHeight(contentRef.current.scrollHeight);
    }
  }, [moduleProgress]);

  const handleToggle = () => {
    setIsAnimating(true);
    setIsExpanded(!isExpanded);
    setTimeout(() => setIsAnimating(false), 300);
  };

  return (
    <div
      className="rounded-xl p-4 mb-4 transition-all duration-300"
      style={{ backgroundColor: 'rgba(0, 63, 135, 0.03)' }}
    >
      {/* Header - always visible */}
      <button
        onClick={handleToggle}
        className="w-full flex items-center justify-between text-left group hover:opacity-80 transition-opacity duration-200"
      >
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold" style={{ color: 'var(--royal-blue)' }}>
            Your Progress
          </span>
        </div>
        <svg
          className={`w-4 h-4 transition-transform duration-300 ease-out ${isExpanded ? 'rotate-180' : 'rotate-0'}`}
          style={{ color: 'var(--royal-blue)' }}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Summary - always visible */}
      <div className="mt-3">
        {/* Progress bar with animated fill */}
        <div className="h-2 rounded-full bg-gray-200 overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-700 ease-out progress-bar-animated"
            style={{
              width: `${overallProgress}%`,
              backgroundColor: 'var(--royal-blue)',
            }}
          />
        </div>
        <div className="flex justify-between mt-1.5">
          <span className="text-xs text-gray-500 transition-all duration-300">
            {lessonsMastered} of {totalLessons} mastered
          </span>
          <span className="text-xs font-semibold transition-all duration-300" style={{ color: 'var(--royal-blue)' }}>
            {overallProgress}%
          </span>
        </div>
      </div>

      {/* Expanded content - module breakdown with smooth animation */}
      <div
        ref={contentRef}
        className="overflow-hidden transition-all duration-300 ease-out"
        style={{
          maxHeight: isExpanded ? contentHeight : 0,
          opacity: isExpanded ? 1 : 0,
          transform: isExpanded ? 'translateY(0)' : 'translateY(-8px)',
        }}
      >
        {moduleProgress.length > 0 && (
          <div className="mt-4 space-y-2">
            <div className="text-xs text-gray-500 uppercase tracking-wide mb-2">
              By Module
            </div>
            {moduleProgress.map((module, idx) => (
              <div
                key={idx}
                className="flex items-center gap-3 py-1.5 transition-all duration-200 hover:bg-white/50 rounded-lg px-2 -mx-2"
                style={{
                  animationDelay: isAnimating ? `${idx * 50}ms` : '0ms',
                }}
              >
                <StatusIndicator status={module.status} animate={isAnimating} />
                <div className="flex-1 min-w-0">
                  <div className="text-sm text-gray-700 truncate">
                    {module.title}
                  </div>
                </div>
                <div className="text-xs font-medium text-gray-500 w-10 text-right tabular-nums">
                  {module.progress}%
                </div>
              </div>
            ))}

            {/* Legend - responsive layout */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-3 pt-3 border-t border-gray-100">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-gray-400 flex-shrink-0" />
                <span className="text-xs text-gray-500 whitespace-nowrap">Not started</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: 'rgb(245, 158, 11)' }} />
                <span className="text-xs text-gray-500 whitespace-nowrap">In progress</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: 'rgb(16, 185, 129)' }} />
                <span className="text-xs text-gray-500 whitespace-nowrap">Complete</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
