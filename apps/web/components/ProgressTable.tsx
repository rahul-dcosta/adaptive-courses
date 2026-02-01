'use client';

import { useState } from 'react';
import type { ModuleProgress } from '@/lib/types';

interface ProgressTableProps {
  moduleProgress: ModuleProgress[];
  overallProgress: number;
  lessonsMastered: number;
  totalLessons: number;
}

function StatusIndicator({ status }: { status: 'empty' | 'started' | 'complete' }) {
  const colors = {
    empty: { bg: 'rgb(229, 231, 235)', dot: 'rgb(156, 163, 175)' },     // Gray
    started: { bg: 'rgb(254, 243, 199)', dot: 'rgb(245, 158, 11)' },    // Amber/Yellow
    complete: { bg: 'rgb(209, 250, 229)', dot: 'rgb(16, 185, 129)' },   // Green
  };

  const color = colors[status];

  return (
    <div
      className="w-6 h-6 rounded-full flex items-center justify-center"
      style={{ backgroundColor: color.bg }}
    >
      <div
        className="w-3 h-3 rounded-full"
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

  return (
    <div
      className="rounded-xl p-4 mb-4"
      style={{ backgroundColor: 'rgba(0, 63, 135, 0.03)' }}
    >
      {/* Header - always visible */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between text-left"
      >
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold" style={{ color: 'var(--royal-blue)' }}>
            Your Progress
          </span>
        </div>
        <svg
          className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
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
        {/* Progress bar */}
        <div className="h-2 rounded-full bg-gray-200 overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${overallProgress}%`,
              backgroundColor: 'var(--royal-blue)',
            }}
          />
        </div>
        <div className="flex justify-between mt-1.5">
          <span className="text-xs text-gray-500">
            {lessonsMastered} of {totalLessons} mastered
          </span>
          <span className="text-xs font-semibold" style={{ color: 'var(--royal-blue)' }}>
            {overallProgress}%
          </span>
        </div>
      </div>

      {/* Expanded content - module breakdown */}
      {isExpanded && moduleProgress.length > 0 && (
        <div className="mt-4 space-y-2">
          <div className="text-xs text-gray-500 uppercase tracking-wide mb-2">
            By Module
          </div>
          {moduleProgress.map((module, idx) => (
            <div
              key={idx}
              className="flex items-center gap-3 py-1.5"
            >
              <StatusIndicator status={module.status} />
              <div className="flex-1 min-w-0">
                <div className="text-sm text-gray-700 truncate">
                  {module.title}
                </div>
              </div>
              <div className="text-xs font-medium text-gray-500 w-10 text-right">
                {module.progress}%
              </div>
            </div>
          ))}

          {/* Legend */}
          <div className="flex items-center gap-4 mt-3 pt-3 border-t border-gray-100">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-gray-400" />
              <span className="text-xs text-gray-500">Not started</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: 'rgb(245, 158, 11)' }} />
              <span className="text-xs text-gray-500">In progress</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: 'rgb(16, 185, 129)' }} />
              <span className="text-xs text-gray-500">Complete</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
