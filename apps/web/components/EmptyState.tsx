'use client';

interface EmptyStateProps {
  type: 'no-modules' | 'no-lessons' | 'no-content' | 'no-courses' | 'error';
  title?: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

const DEFAULT_CONTENT: Record<EmptyStateProps['type'], { icon: string; title: string; description: string }> = {
  'no-modules': {
    icon: 'modules',
    title: 'No Modules Found',
    description: 'This course doesn\'t have any modules yet. Please try generating the course again.'
  },
  'no-lessons': {
    icon: 'lessons',
    title: 'No Lessons in This Module',
    description: 'This module doesn\'t contain any lessons. Try navigating to a different module.'
  },
  'no-content': {
    icon: 'content',
    title: 'No Content Available',
    description: 'The content for this lesson hasn\'t loaded. Please try refreshing the page.'
  },
  'no-courses': {
    icon: 'courses',
    title: 'No Courses Yet',
    description: 'You haven\'t created any courses yet. Start by generating your first personalized course!'
  },
  'error': {
    icon: 'error',
    title: 'Something Went Wrong',
    description: 'We encountered an issue loading this content. Please try again.'
  }
};

function EmptyStateIcon({ type }: { type: string }) {
  switch (type) {
    case 'modules':
      return (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      );
    case 'lessons':
      return (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      );
    case 'content':
      return (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      );
    case 'courses':
      return (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
        </svg>
      );
    case 'error':
    default:
      return (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      );
  }
}

export function EmptyState({ type, title, description, action, className = '' }: EmptyStateProps) {
  const defaults = DEFAULT_CONTENT[type];

  return (
    <div className={`flex flex-col items-center justify-center py-16 px-8 text-center ${className}`}>
      <div
        className="w-20 h-20 rounded-full flex items-center justify-center mb-6"
        style={{
          backgroundColor: type === 'error' ? 'rgba(239, 68, 68, 0.08)' : 'rgba(0, 63, 135, 0.06)',
          color: type === 'error' ? 'rgb(239, 68, 68)' : 'var(--royal-blue)'
        }}
      >
        <EmptyStateIcon type={defaults.icon} />
      </div>

      <h3 className="text-xl font-bold text-gray-900 mb-2 font-serif">
        {title || defaults.title}
      </h3>

      <p className="text-gray-600 max-w-sm mb-6">
        {description || defaults.description}
      </p>

      {action && (
        <button
          onClick={action.onClick}
          className="px-6 py-3 rounded-xl font-semibold text-white transition-all shadow-lg hover:shadow-xl"
          style={{ backgroundColor: 'var(--royal-blue)' }}
        >
          {action.label}
        </button>
      )}
    </div>
  );
}

export default EmptyState;
