'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import CourseBuilderSmart from './CourseBuilderSmart';
import ExampleCourses from './ExampleCourses';
import { analytics } from '@/lib/analytics';

// Maintenance mode - set via environment variable
const MAINTENANCE_MODE = process.env.NEXT_PUBLIC_MAINTENANCE_MODE === 'true';

export default function LandingPagePremium() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [topic, setTopic] = useState('');
  const [showWaitlistModal, setShowWaitlistModal] = useState(false);
  const [waitlistEmail, setWaitlistEmail] = useState('');
  const [waitlistSubmitted, setWaitlistSubmitted] = useState(false);
  const [pendingTopic, setPendingTopic] = useState('');

  // Check if we're in builder mode from URL
  const showBuilder = searchParams.get('mode') === 'build';
  const initialTopic = searchParams.get('topic') || '';

  useEffect(() => {
    if (!showBuilder) {
      analytics.pageView('landing');
    }
  }, [showBuilder]);

  // In maintenance mode, redirect away from builder
  useEffect(() => {
    if (MAINTENANCE_MODE && showBuilder) {
      router.replace('/');
    }
  }, [showBuilder, router]);

  const handleTopicSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (topic.trim()) {
      analytics.track('topic_entered_landing', { topic });

      // In maintenance mode, show waitlist modal instead
      if (MAINTENANCE_MODE) {
        setPendingTopic(topic.trim());
        setShowWaitlistModal(true);
        return;
      }

      // Navigate with search params to signal builder mode
      router.push(`/?mode=build&topic=${encodeURIComponent(topic.trim())}`);
    }
  };

  const handleSelectExample = (exampleTopic: string) => {
    analytics.track('example_course_selected', { topic: exampleTopic });

    // In maintenance mode, show waitlist modal instead
    if (MAINTENANCE_MODE) {
      setPendingTopic(exampleTopic);
      setShowWaitlistModal(true);
      return;
    }

    router.push(`/?mode=build&topic=${encodeURIComponent(exampleTopic)}`);
  };

  const handleWaitlistSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (waitlistEmail.trim()) {
      analytics.track('waitlist_signup', { email: waitlistEmail, topic: pendingTopic });
      // TODO: Send to backend when ready
      setWaitlistSubmitted(true);
    }
  };

  // In maintenance mode, don't show builder even if URL says so
  if (showBuilder && !MAINTENANCE_MODE) {
    return <CourseBuilderSmart initialTopic={initialTopic || topic} />;
  }

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <div className="max-w-6xl mx-auto px-6 pt-32 pb-20">
        <div className="max-w-4xl">
          {/* Subtle badge with pulse animation */}
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-gray-100 rounded-full mb-8">
            <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-gray-700 font-medium">Now in beta</span>
          </div>

          {/* Hero headline */}
          <h1 className="text-6xl md:text-7xl font-black mb-8 leading-[1.1] tracking-tight" style={{ color: 'var(--royal-blue)' }}>
            Learn Anything,<br />
            Your Way
          </h1>

          <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-2xl leading-relaxed">
            AI-powered courses built around you. From game theory to cats in ancient Egypt—whether it's for work, curiosity, or just for fun.
          </p>

          {/* Topic input - direct to course builder */}
          <form onSubmit={handleTopicSubmit} className="max-w-md">
            <div className="flex gap-3">
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="What do you want to learn?"
                className="flex-1 px-4 py-3 glass rounded-xl text-base text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-900/20 transition-all shadow-sm"
                required
                autoFocus
              />
              <button
                type="submit"
                disabled={!topic.trim()}
                className="px-6 py-3 text-white rounded-xl font-medium transition-all disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap shadow-lg hover:shadow-xl"
                style={{ background: 'var(--royal-blue)' }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'var(--royal-blue-light)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'var(--royal-blue)'}
              >
                Get started
              </button>
            </div>
            <p className="text-sm text-gray-500 mt-3">
              First course free. Then $3.99/course or $7.99/mo unlimited.
            </p>
          </form>
        </div>
      </div>

      {/* Example Courses */}
      <ExampleCourses onSelectTopic={handleSelectExample} />

      {/* How it works */}
      <div className="max-w-6xl mx-auto px-6 py-24">
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-12">
          How it works
        </h2>
        
        <div className="grid md:grid-cols-3 gap-16">
          <div>
            <div className="w-10 h-10 bg-gray-900 rounded-lg flex items-center justify-center mb-6">
              <span className="text-white font-bold">1</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              Tell us why you're learning
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Job interview? Dinner party trivia? Pure curiosity? We shape the course around your goal.
            </p>
          </div>

          <div>
            <div className="w-10 h-10 bg-gray-900 rounded-lg flex items-center justify-center mb-6">
              <span className="text-white font-bold">2</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              AI builds your course
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Claude generates a custom curriculum in seconds. No fluff. Just what matters to you.
            </p>
          </div>

          <div>
            <div className="w-10 h-10 bg-gray-900 rounded-lg flex items-center justify-center mb-6">
              <span className="text-white font-bold">3</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              Start learning
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Read online, download PDF, or get it via email. Learn whenever inspiration strikes.
            </p>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="max-w-6xl mx-auto px-6 py-24 border-t border-gray-200">
        <div className="grid md:grid-cols-2 gap-16">
          <div>
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Built around your "why"
            </h3>
            <p className="text-lg text-gray-600 leading-relaxed">
              Most courses ask "What's your level?" We ask "Why are you learning?"
              A course for fun hits different than one for a job interview.
            </p>
          </div>

          <div>
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Keep it forever
            </h3>
            <p className="text-lg text-gray-600 leading-relaxed">
              First course free. Then $3.99 per course or $7.99/mo unlimited.
              Every course you create is yours forever, even if you cancel.
            </p>
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div className="max-w-6xl mx-auto px-6 py-24 border-t border-gray-200">
        <div className="grid md:grid-cols-2 gap-12">
          <div className="border-l-2 border-gray-900 pl-6">
            <p className="text-lg text-gray-900 mb-4 leading-relaxed">
              "Made a course on Renaissance art before my Italy trip. Saw the paintings completely differently."
            </p>
            <p className="text-sm text-gray-500">
              Emily T., Teacher
            </p>
          </div>

          <div className="border-l-2 border-gray-900 pl-6">
            <p className="text-lg text-gray-900 mb-4 leading-relaxed">
              "Finally, learning that fits my schedule. Created a course on behavioral economics during my lunch break."
            </p>
            <p className="text-sm text-gray-500">
              Marcus R., Product Manager
            </p>
          </div>
        </div>
      </div>

      {/* Final CTA */}
      <div className="max-w-6xl mx-auto px-6 py-32 border-t border-gray-200">
        <div className="max-w-2xl">
          <h2 className="text-5xl font-black text-gray-900 mb-6 leading-tight">
            Ready to learn<br />something new?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Generate your first course for free.
          </p>
          
          <form onSubmit={handleTopicSubmit} className="max-w-md">
            <div className="flex gap-3">
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="What do you want to learn?"
                className="flex-1 px-4 py-3 bg-white border border-gray-300 rounded-lg text-base text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-900 transition-colors"
                required
              />
              <button
                type="submit"
                disabled={!topic.trim()}
                className="px-6 py-3 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 active:bg-black transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Get started
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Footer */}
      <div className="max-w-6xl mx-auto px-6 py-12 border-t border-gray-200">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <p className="font-bold text-gray-900 mb-1">Adaptive Courses</p>
            <p className="text-sm text-gray-500">&copy; {new Date().getFullYear()} Adaptive Courses LLC</p>
          </div>

          <div className="flex gap-8 text-sm text-gray-600">
            <a href="/about" className="hover:text-gray-900 transition-colors">About</a>
            <a href="/pricing" className="hover:text-gray-900 transition-colors">Pricing</a>
            <a href="/faq" className="hover:text-gray-900 transition-colors">FAQ</a>
            <a href="/terms" className="hover:text-gray-900 transition-colors">Terms</a>
            <a href="/privacy" className="hover:text-gray-900 transition-colors">Privacy</a>
          </div>
        </div>
      </div>

      {/* Waitlist Modal (Maintenance Mode) */}
      {showWaitlistModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="waitlist-modal-title"
            className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl"
          >
            {!waitlistSubmitted ? (
              <>
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 id="waitlist-modal-title" className="text-2xl font-bold text-gray-900 mb-2">Launching Soon!</h3>
                  <p className="text-gray-600">
                    We're putting the finishing touches on Adaptive Courses. Join the waitlist to be first in line.
                  </p>
                </div>

                {pendingTopic && (
                  <div className="bg-gray-50 rounded-lg p-3 mb-4">
                    <p className="text-sm text-gray-500">Your course topic:</p>
                    <p className="font-medium text-gray-900">{pendingTopic}</p>
                  </div>
                )}

                <form onSubmit={handleWaitlistSubmit}>
                  <label htmlFor="waitlist-email" className="sr-only">Email address</label>
                  <input
                    id="waitlist-email"
                    type="email"
                    value={waitlistEmail}
                    onChange={(e) => setWaitlistEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                    aria-label="Email address for waitlist"
                  />
                  <button
                    type="submit"
                    className="w-full py-3 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors"
                  >
                    Join Waitlist
                  </button>
                </form>

                <button
                  onClick={() => setShowWaitlistModal(false)}
                  className="w-full mt-3 py-2 text-gray-500 hover:text-gray-700 transition-colors text-sm"
                >
                  Maybe later
                </button>
              </>
            ) : (
              <div className="text-center py-4" role="status" aria-live="polite">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">You're on the list!</h3>
                <p className="text-gray-600 mb-6">
                  We'll email you as soon as we launch. Get ready to learn about "{pendingTopic}".
                </p>
                <button
                  onClick={() => {
                    setShowWaitlistModal(false);
                    setWaitlistSubmitted(false);
                    setWaitlistEmail('');
                  }}
                  className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                >
                  Close
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
