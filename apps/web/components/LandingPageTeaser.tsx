'use client';

import { useState, useEffect } from 'react';
import { analytics } from '@/lib/analytics';

export default function LandingPageTeaser() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    analytics.pageView('teaser');
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      analytics.track('waitlist_signup', { email });
      // TODO: Send to backend
      setSubmitted(true);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 relative overflow-hidden">
      {/* Subtle animated gradient background */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          background: 'radial-gradient(ellipse at 30% 20%, rgba(0, 63, 135, 0.15) 0%, transparent 50%), radial-gradient(ellipse at 70% 80%, rgba(0, 86, 179, 0.1) 0%, transparent 50%)'
        }}
      />

      {/* Content */}
      <div className="relative z-10 max-w-2xl mx-auto text-center">
        {/* Logo/Brand */}
        <div
          className={`mb-12 transition-all duration-1000 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
        >
          <h1
            className="text-5xl md:text-7xl font-black tracking-tight mb-4"
            style={{ color: 'var(--royal-blue)' }}
          >
            Adaptive Courses
          </h1>
          <div
            className="h-1 w-24 mx-auto rounded-full"
            style={{ backgroundColor: 'var(--royal-blue)' }}
          />
        </div>

        {/* The cryptic tagline */}
        <p
          className={`text-xl md:text-2xl text-gray-600 mb-4 leading-relaxed transition-all duration-1000 delay-200 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
        >
          Learning that understands why.
        </p>

        <p
          className={`text-lg text-gray-400 mb-16 transition-all duration-1000 delay-300 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
        >
          Something new is coming.
        </p>

        {/* Email capture */}
        <div
          className={`transition-all duration-1000 delay-500 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
        >
          {!submitted ? (
            <form onSubmit={handleSubmit} className="max-w-md mx-auto">
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="flex-1 px-5 py-4 bg-white/80 backdrop-blur-sm rounded-xl text-base text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 transition-all"
                  style={{
                    border: '1px solid rgba(0, 63, 135, 0.15)',
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    ['--tw-ring-color' as any]: 'rgba(0, 63, 135, 0.3)'
                  }}
                  required
                />
                <button
                  type="submit"
                  disabled={!email.trim()}
                  className="px-8 py-4 text-white rounded-xl font-semibold text-base transition-all disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap hover:scale-[1.02] active:scale-[0.98]"
                  style={{ backgroundColor: 'var(--royal-blue)' }}
                >
                  Notify Me
                </button>
              </div>
              <p className="text-sm text-gray-400 mt-4">
                Be the first to know.
              </p>
            </form>
          ) : (
            <div className="text-center">
              <div
                className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4"
                style={{ backgroundColor: 'rgba(0, 63, 135, 0.1)' }}
              >
                <svg
                  className="w-8 h-8"
                  style={{ color: 'var(--royal-blue)' }}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="text-xl text-gray-700 font-medium">You're on the list.</p>
              <p className="text-gray-500 mt-2">We'll be in touch.</p>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div
        className={`absolute bottom-8 left-0 right-0 text-center transition-all duration-1000 delay-700 ${mounted ? 'opacity-100' : 'opacity-0'}`}
      >
        <p className="text-sm text-gray-400">
          &copy; {new Date().getFullYear()} Adaptive Courses
        </p>
      </div>
    </div>
  );
}
