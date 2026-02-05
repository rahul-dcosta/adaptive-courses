'use client';

import { useState, useRef, useEffect } from 'react';

export type CourseStatus = 'in_progress' | 'completed' | 'archived' | 'generating';

export interface CourseData {
  id: string;
  title: string;
  subtitle?: string;
  createdAt: string;
  status: CourseStatus;
  moduleCount: number;
  progress: number; // 0-100
}

interface CourseCardProps {
  course: CourseData;
  viewMode: 'board' | 'list';
  onView: (id: string) => void;
  onDownload: (id: string) => void;
  onDelete: (id: string, title: string) => void;
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function getStatusConfig(status: CourseStatus, progress: number) {
  if (status === 'generating') {
    return {
      label: 'Generating',
      bgColor: 'bg-amber-50',
      textColor: 'text-amber-700',
      borderColor: 'border-amber-200',
      showSpinner: true,
    };
  }
  if (status === 'archived') {
    return {
      label: 'Archived',
      bgColor: 'bg-gray-50',
      textColor: 'text-gray-600',
      borderColor: 'border-gray-200',
      showSpinner: false,
    };
  }
  if (progress === 100 || status === 'completed') {
    return {
      label: 'Completed',
      bgColor: 'bg-emerald-50',
      textColor: 'text-emerald-700',
      borderColor: 'border-emerald-200',
      showSpinner: false,
    };
  }
  return {
    label: 'In Progress',
    bgColor: 'bg-blue-50',
    textColor: 'text-[#003F87]',
    borderColor: 'border-blue-200',
    showSpinner: false,
  };
}

function StatusBadge({ status, progress }: { status: CourseStatus; progress: number }) {
  const config = getStatusConfig(status, progress);

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full ${config.bgColor} ${config.textColor} border ${config.borderColor}`}
    >
      {config.showSpinner && (
        <svg className="w-3 h-3 animate-spin" fill="none" viewBox="0 0 24 24">
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      {config.label}
    </span>
  );
}

function CircularProgress({ progress }: { progress: number }) {
  const circumference = 2 * Math.PI * 18; // radius = 18
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative w-12 h-12">
      <svg className="w-12 h-12 -rotate-90" viewBox="0 0 44 44">
        {/* Background circle */}
        <circle
          cx="22"
          cy="22"
          r="18"
          fill="none"
          stroke="rgba(0, 63, 135, 0.1)"
          strokeWidth="4"
        />
        {/* Progress circle */}
        <circle
          cx="22"
          cy="22"
          r="18"
          fill="none"
          stroke="#003F87"
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className="transition-all duration-500"
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-xs font-semibold text-[#003F87]">
        {progress}%
      </span>
    </div>
  );
}

function ActionsDropdown({
  onView,
  onDownload,
  onDelete,
}: {
  onView: () => void;
  onDownload: () => void;
  onDelete: () => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
        aria-label="More actions"
      >
        <svg
          className="w-5 h-5 text-gray-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-1 w-44 bg-white rounded-xl shadow-lg border border-gray-100 py-1.5 z-50">
          <button
            onClick={() => {
              onView();
              setIsOpen(false);
            }}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
              />
            </svg>
            View Course
          </button>
          <button
            onClick={() => {
              onDownload();
              setIsOpen(false);
            }}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
              />
            </svg>
            Download PDF
          </button>
          <hr className="my-1.5 border-gray-100" />
          <button
            onClick={() => {
              onDelete();
              setIsOpen(false);
            }}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
            Delete Course
          </button>
        </div>
      )}
    </div>
  );
}

export function CourseCard({ course, viewMode, onView, onDownload, onDelete }: CourseCardProps) {
  const isGenerating = course.status === 'generating';

  if (viewMode === 'list') {
    return (
      <div
        className="group flex items-center gap-4 px-4 py-3 bg-white hover:bg-gray-50/50 border-b border-gray-100 last:border-b-0 transition-colors cursor-pointer"
        onClick={() => !isGenerating && onView(course.id)}
      >
        {/* Title & Subtitle */}
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-gray-900 truncate group-hover:text-[#003F87] transition-colors">
            {course.title}
          </h3>
          {course.subtitle && (
            <p className="text-sm text-gray-500 truncate mt-0.5">{course.subtitle}</p>
          )}
        </div>

        {/* Progress */}
        <div className="w-24 text-center">
          {isGenerating ? (
            <span className="text-sm text-amber-600">...</span>
          ) : (
            <div className="flex items-center gap-2">
              <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${course.progress}%`,
                    backgroundColor: '#003F87',
                  }}
                />
              </div>
              <span className="text-xs text-gray-500 w-8">{course.progress}%</span>
            </div>
          )}
        </div>

        {/* Modules */}
        <div className="w-20 text-center">
          <span className="text-sm text-gray-600">
            {isGenerating ? '-' : `${course.moduleCount} modules`}
          </span>
        </div>

        {/* Created */}
        <div className="w-28 text-center">
          <span className="text-sm text-gray-500">{formatDate(course.createdAt)}</span>
        </div>

        {/* Status */}
        <div className="w-28">
          <StatusBadge status={course.status} progress={course.progress} />
        </div>

        {/* Actions */}
        <div className="w-10 flex justify-end" onClick={(e) => e.stopPropagation()}>
          <ActionsDropdown
            onView={() => onView(course.id)}
            onDownload={() => onDownload(course.id)}
            onDelete={() => onDelete(course.id, course.title)}
          />
        </div>
      </div>
    );
  }

  // Board View - Card Layout
  return (
    <div
      className="group bg-white rounded-xl border border-[rgba(0,63,135,0.08)] hover:border-[rgba(0,63,135,0.2)] hover:shadow-lg transition-all duration-200 cursor-grab active:cursor-grabbing"
      onClick={() => !isGenerating && onView(course.id)}
    >
      <div className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 group-hover:text-[#003F87] transition-colors line-clamp-2">
              {course.title}
            </h3>
            {course.subtitle && (
              <p className="text-sm text-gray-500 mt-1 line-clamp-2">{course.subtitle}</p>
            )}
          </div>
          <div onClick={(e) => e.stopPropagation()}>
            <ActionsDropdown
              onView={() => onView(course.id)}
              onDownload={() => onDownload(course.id)}
              onDelete={() => onDelete(course.id, course.title)}
            />
          </div>
        </div>

        {/* Progress Section */}
        {isGenerating ? (
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <div className="w-10 h-10 mb-3">
              <svg className="w-full h-full animate-spin text-[#003F87]" fill="none" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
            </div>
            <p className="text-sm text-gray-600">Generating your course...</p>
            <p className="text-xs text-gray-400 mt-1">This usually takes 30-60 seconds</p>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <CircularProgress progress={course.progress} />
            <div className="flex-1">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  />
                </svg>
                <span>{course.moduleCount} modules</span>
              </div>
              <StatusBadge status={course.status} progress={course.progress} />
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
          <span className="text-xs text-gray-400">Created {formatDate(course.createdAt)}</span>
          {!isGenerating && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onView(course.id);
              }}
              className="text-sm font-medium text-[#003F87] hover:text-[#0056B3] transition-colors"
            >
              {course.progress === 100 ? 'Review' : 'Continue'} →
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default CourseCard;
