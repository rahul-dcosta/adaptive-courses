'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

const errorMessages: Record<string, { title: string; description: string }> = {
  'invalid-otp': {
    title: 'Invalid verification code',
    description: 'The code you entered is incorrect or has expired. Please request a new one.',
  },
  'expired-link': {
    title: 'Link expired',
    description: 'This magic link has expired. Please request a new one to sign in.',
  },
  'email-not-found': {
    title: 'Email not found',
    description: "We couldn't find an account with that email. Please check and try again.",
  },
  'rate-limited': {
    title: 'Too many attempts',
    description: 'You\'ve made too many requests. Please wait a few minutes and try again.',
  },
  'server-error': {
    title: 'Something went wrong',
    description: 'We encountered an error on our end. Please try again or contact support.',
  },
  'default': {
    title: 'Authentication error',
    description: 'Something went wrong during sign in. Please try again.',
  },
};

function AuthErrorContent() {
  const searchParams = useSearchParams();
  const errorCode = searchParams.get('error') || 'default';
  const error = errorMessages[errorCode] || errorMessages['default'];

  return (
    <div className="min-h-screen pt-20 flex items-center justify-center px-6 py-16">
      <div className="max-w-md w-full text-center">
        {/* Error Icon */}
        <div
          className="w-20 h-20 rounded-full mx-auto mb-8 flex items-center justify-center"
          style={{ background: 'rgba(239, 68, 68, 0.1)' }}
        >
          <svg
            className="w-10 h-10 text-red-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>

        {/* Error Message */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h1
            className="text-2xl font-bold mb-3"
            style={{ color: 'var(--royal-blue)' }}
          >
            {error.title}
          </h1>
          <p className="text-gray-600 mb-8">
            {error.description}
          </p>

          {/* Actions */}
          <div className="space-y-3">
            <a
              href="/"
              className="block w-full py-3 px-6 text-white font-medium rounded-xl transition-all shadow-lg hover:shadow-xl"
              style={{ background: 'var(--royal-blue)' }}
            >
              Try Again
            </a>
            <a
              href="mailto:support@adaptive-courses.com"
              className="block w-full py-3 px-6 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 transition-all"
            >
              Contact Support
            </a>
          </div>
        </div>

        {/* Help Links */}
        <div className="mt-8 flex justify-center gap-6 text-sm">
          <a href="/faq" className="text-gray-500 hover:text-gray-700">
            FAQ
          </a>
          <a href="/" className="text-gray-500 hover:text-gray-700">
            Back to Home
          </a>
        </div>
      </div>
    </div>
  );
}

export default function AuthErrorPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="animate-pulse text-gray-400">Loading...</div>
      </div>
    }>
      <AuthErrorContent />
    </Suspense>
  );
}
