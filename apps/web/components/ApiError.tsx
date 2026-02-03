'use client';

import { useState } from 'react';

// User-friendly error messages mapping
const ERROR_MESSAGES: Record<string, { title: string; description: string; action?: string }> = {
  // Network errors
  'Failed to fetch': {
    title: 'Connection Problem',
    description: 'Unable to reach our servers. Please check your internet connection and try again.',
    action: 'Check Connection'
  },
  'NetworkError': {
    title: 'Network Error',
    description: 'Your internet connection appears to be unstable. Please try again.',
    action: 'Retry'
  },
  'ERR_NETWORK': {
    title: 'Connection Lost',
    description: 'We lost connection to the server. This usually resolves itself - please try again.',
    action: 'Try Again'
  },

  // Server errors
  '503': {
    title: 'Service Temporarily Unavailable',
    description: 'We\'re doing some maintenance right now. Please try again in a few minutes.',
    action: 'Retry Later'
  },
  '500': {
    title: 'Something Went Wrong',
    description: 'Our servers encountered an unexpected error. We\'re looking into it.',
    action: 'Try Again'
  },
  '429': {
    title: 'Too Many Requests',
    description: 'You\'ve made too many requests. Please wait a moment before trying again.',
    action: 'Wait and Retry'
  },
  '408': {
    title: 'Request Timeout',
    description: 'The request took too long to complete. Please try again.',
    action: 'Retry'
  },

  // AI/Generation errors
  'parse': {
    title: 'Generation Error',
    description: 'We had trouble creating your course. This can happen occasionally. Please try again.',
    action: 'Generate Again'
  },
  'JSON': {
    title: 'Processing Error',
    description: 'Something went wrong while processing your course. Let\'s try that again.',
    action: 'Retry'
  },

  // Validation errors
  'Missing required': {
    title: 'Missing Information',
    description: 'Some required information is missing. Please go back and fill in all fields.',
    action: 'Go Back'
  },

  // Default fallback
  'default': {
    title: 'Something Went Wrong',
    description: 'An unexpected error occurred. Please try again.',
    action: 'Try Again'
  }
};

interface ApiErrorProps {
  error: string | null;
  onRetry?: () => void;
  onDismiss?: () => void;
  className?: string;
  inline?: boolean; // Show as inline message vs modal
}

function getErrorInfo(error: string): { title: string; description: string; action?: string } {
  // Check for specific error patterns
  for (const [pattern, info] of Object.entries(ERROR_MESSAGES)) {
    if (pattern !== 'default' && error.toLowerCase().includes(pattern.toLowerCase())) {
      return info;
    }
  }
  return ERROR_MESSAGES['default'];
}

export function ApiError({ error, onRetry, onDismiss, className = '', inline = false }: ApiErrorProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!error) return null;

  const errorInfo = getErrorInfo(error);

  if (inline) {
    return (
      <div className={`p-4 rounded-xl ${className}`} style={{ backgroundColor: 'rgba(239, 68, 68, 0.08)', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-5 h-5 mt-0.5">
            <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="flex-1">
            <h4 className="text-sm font-semibold text-red-700">{errorInfo.title}</h4>
            <p className="text-sm text-red-600 mt-1">{errorInfo.description}</p>

            {/* Show technical details in dev mode */}
            {process.env.NODE_ENV === 'development' && (
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-xs text-red-400 mt-2 hover:text-red-600"
              >
                {isExpanded ? 'Hide details' : 'Show details'}
              </button>
            )}
            {isExpanded && process.env.NODE_ENV === 'development' && (
              <pre className="mt-2 text-xs bg-red-50 p-2 rounded overflow-auto text-red-700 font-mono">
                {error}
              </pre>
            )}

            <div className="flex gap-2 mt-3">
              {onRetry && (
                <button
                  onClick={onRetry}
                  className="text-sm font-medium text-red-700 hover:text-red-800 px-3 py-1 rounded-lg"
                  style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)' }}
                >
                  {errorInfo.action || 'Try Again'}
                </button>
              )}
              {onDismiss && (
                <button
                  onClick={onDismiss}
                  className="text-sm text-gray-500 hover:text-gray-700 px-3 py-1"
                >
                  Dismiss
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Modal/fullscreen error display
  return (
    <div className={`fixed inset-0 flex items-center justify-center p-4 z-50 ${className}`} style={{ backgroundColor: 'rgba(0, 0, 0, 0.4)' }}>
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 text-center">
        <div className="w-16 h-16 mx-auto mb-6 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)' }}>
          <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mb-3 font-serif">{errorInfo.title}</h2>
        <p className="text-gray-600 mb-6">{errorInfo.description}</p>

        {/* Technical details in dev */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mb-6">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-xs text-gray-400 hover:text-gray-600"
            >
              {isExpanded ? 'Hide technical details' : 'Show technical details'}
            </button>
            {isExpanded && (
              <pre className="mt-2 text-xs bg-gray-100 p-3 rounded-lg overflow-auto text-left text-gray-700 font-mono max-h-32">
                {error}
              </pre>
            )}
          </div>
        )}

        <div className="flex flex-col gap-3">
          {onRetry && (
            <button
              onClick={onRetry}
              className="w-full py-3 rounded-xl font-semibold text-white transition-all shadow-lg hover:shadow-xl"
              style={{ backgroundColor: 'var(--royal-blue)' }}
            >
              {errorInfo.action || 'Try Again'}
            </button>
          )}
          {onDismiss && (
            <button
              onClick={onDismiss}
              className="w-full py-3 rounded-xl font-medium text-gray-600 hover:text-gray-900 transition-all"
              style={{ backgroundColor: 'rgba(0, 63, 135, 0.05)' }}
            >
              Go Back
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default ApiError;
