'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import CourseBuilderSmart from './CourseBuilderSmart';
import ExampleCourses from './ExampleCourses';
import { analytics } from '@/lib/analytics';

export default function LandingPagePremium() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [topic, setTopic] = useState('');

  // Check if we're in builder mode from URL
  const showBuilder = searchParams.get('mode') === 'build';
  const initialTopic = searchParams.get('topic') || '';

  useEffect(() => {
    if (!showBuilder) {
      analytics.pageView('landing');
    }
  }, [showBuilder]);

  const handleTopicSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (topic.trim()) {
      analytics.track('topic_entered_landing', { topic });
      router.push(`/?mode=build&topic=${encodeURIComponent(topic.trim())}`);
    }
  };

  const handleSelectExample = (exampleTopic: string) => {
    analytics.track('example_course_selected', { topic: exampleTopic });
    router.push(`/?mode=build&topic=${encodeURIComponent(exampleTopic)}`);
  };

  if (showBuilder) {
    return <CourseBuilderSmart initialTopic={initialTopic || topic} />;
  }

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <div className="max-w-6xl mx-auto px-6 pt-24 md:pt-32 pb-16 md:pb-20">
        <div className="max-w-4xl">
          {/* Free badge - prominent value signal */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-6" style={{ backgroundColor: 'rgba(0, 63, 135, 0.08)', border: '1px solid rgba(0, 63, 135, 0.15)' }}>
            <svg className="w-4 h-4" style={{ color: 'var(--royal-blue)' }} fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="text-sm font-semibold" style={{ color: 'var(--royal-blue)' }}>Your first course is free</span>
          </div>

          {/* Hero headline - clearer value prop */}
          <h1 className="text-5xl md:text-7xl font-black mb-6 leading-[1.1] tracking-tight" style={{ color: 'var(--royal-blue)' }}>
            Custom Courses<br />
            in 60 Seconds
          </h1>

          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-2xl leading-relaxed">
            Tell us what you need to learn and why. Our AI creates a personalized course tailored to your goals, timeline, and learning style.
          </p>

          {/* Topic input - direct to course builder */}
          <form onSubmit={handleTopicSubmit} className="max-w-lg">
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g., Game theory for my job interview"
                className="flex-1 px-5 py-4 glass rounded-xl text-base text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 transition-all shadow-sm"
                style={{ '--tw-ring-color': 'rgba(0, 63, 135, 0.3)' } as React.CSSProperties}
                required
                autoFocus
              />
              <button
                type="submit"
                disabled={!topic.trim()}
                className="px-8 py-4 text-white rounded-xl font-semibold text-base transition-all disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
                style={{ background: 'var(--royal-blue)' }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'var(--royal-blue-light)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'var(--royal-blue)'}
              >
                Create My Course
              </button>
            </div>
            {/* Trust signals below input */}
            <div className="flex flex-wrap items-center gap-4 mt-4 text-sm text-gray-500">
              <span className="flex items-center gap-1.5">
                <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                No credit card required
              </span>
              <span className="flex items-center gap-1.5">
                <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Ready in under a minute
              </span>
            </div>
          </form>
        </div>
      </div>

      {/* Social Proof Bar - visible above the fold on desktop */}
      <div className="max-w-6xl mx-auto px-6 pb-16">
        <div className="flex flex-wrap items-center gap-8 md:gap-12 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-8 h-8 rounded-full" style={{ backgroundColor: 'rgba(0, 63, 135, 0.08)' }}>
              <svg className="w-4 h-4" style={{ color: 'var(--royal-blue)' }} fill="currentColor" viewBox="0 0 20 20">
                <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
              </svg>
            </div>
            <span><strong className="text-gray-900">6</strong> course topics available</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-8 h-8 rounded-full" style={{ backgroundColor: 'rgba(0, 63, 135, 0.08)' }}>
              <svg className="w-4 h-4" style={{ color: 'var(--royal-blue)' }} fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
              </svg>
            </div>
            <span><strong className="text-gray-900">Under 60 seconds</strong> to generate</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-8 h-8 rounded-full" style={{ backgroundColor: 'rgba(0, 63, 135, 0.08)' }}>
              <svg className="w-4 h-4" style={{ color: 'var(--royal-blue)' }} fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </div>
            <span><strong className="text-gray-900">AI-powered</strong> personalization</span>
          </div>
        </div>
      </div>

      {/* Quick Testimonial - visible near above-the-fold */}
      <div className="max-w-6xl mx-auto px-6 pb-16">
        <div className="p-6 rounded-xl bg-white/60 backdrop-blur-sm" style={{ border: '1px solid rgba(0, 63, 135, 0.1)' }}>
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm" style={{ backgroundColor: 'var(--royal-blue)' }}>
              ET
            </div>
            <div>
              <p className="text-gray-700 leading-relaxed mb-2">
                "Made a course on Renaissance art before my Italy trip. Saw the paintings completely differently."
              </p>
              <p className="text-sm text-gray-500">Emily T., Teacher</p>
            </div>
          </div>
        </div>
      </div>

      {/* Example Courses */}
      <ExampleCourses onSelectTopic={handleSelectExample} />

      {/* How it works */}
      <div className="max-w-6xl mx-auto px-6 py-24">
        <h2 className="text-sm font-semibold uppercase tracking-wider mb-12" style={{ color: 'var(--royal-blue)' }}>
          How it works
        </h2>

        <div className="grid md:grid-cols-3 gap-12 md:gap-16">
          <div>
            <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-6" style={{ backgroundColor: 'var(--royal-blue)' }}>
              <span className="text-white font-bold text-lg">1</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              Tell us why you're learning
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Job interview? Dinner party trivia? Pure curiosity? We shape the course around your specific goal.
            </p>
          </div>

          <div>
            <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-6" style={{ backgroundColor: 'var(--royal-blue)' }}>
              <span className="text-white font-bold text-lg">2</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              AI builds your course
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Our AI generates a custom curriculum in under 60 seconds. No fluff—just what matters to you.
            </p>
          </div>

          <div>
            <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-6" style={{ backgroundColor: 'var(--royal-blue)' }}>
              <span className="text-white font-bold text-lg">3</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              Start learning immediately
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Read online, download PDF, or get it via email. Your course is yours forever.
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
        <h2 className="text-sm font-semibold uppercase tracking-wider mb-12" style={{ color: 'var(--royal-blue)' }}>
          What learners say
        </h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="p-6 rounded-xl bg-white" style={{ border: '2px solid rgba(0, 63, 135, 0.1)' }}>
            <div className="flex items-center gap-3 mb-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm" style={{ backgroundColor: 'var(--royal-blue)' }}>
                ET
              </div>
              <div>
                <p className="font-semibold text-gray-900">Emily T.</p>
                <p className="text-sm text-gray-500">Teacher</p>
              </div>
            </div>
            <p className="text-gray-700 leading-relaxed">
              "Made a course on Renaissance art before my Italy trip. Saw the paintings completely differently."
            </p>
          </div>

          <div className="p-6 rounded-xl bg-white" style={{ border: '2px solid rgba(0, 63, 135, 0.1)' }}>
            <div className="flex items-center gap-3 mb-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm" style={{ backgroundColor: 'var(--royal-blue)' }}>
                MR
              </div>
              <div>
                <p className="font-semibold text-gray-900">Marcus R.</p>
                <p className="text-sm text-gray-500">Product Manager</p>
              </div>
            </div>
            <p className="text-gray-700 leading-relaxed">
              "Finally, learning that fits my schedule. Created a course on behavioral economics during my lunch break."
            </p>
          </div>
        </div>
      </div>

      {/* Final CTA */}
      <div className="max-w-6xl mx-auto px-6 py-24 md:py-32 border-t border-gray-200">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-6" style={{ backgroundColor: 'rgba(0, 63, 135, 0.08)', border: '1px solid rgba(0, 63, 135, 0.15)' }}>
            <svg className="w-4 h-4" style={{ color: 'var(--royal-blue)' }} fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span className="text-sm font-medium" style={{ color: 'var(--royal-blue)' }}>First course free</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black mb-6 leading-tight" style={{ color: 'var(--royal-blue)' }}>
            Ready to learn<br />something new?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Create your personalized course in under a minute. No credit card required.
          </p>

          <form onSubmit={handleTopicSubmit} className="max-w-lg">
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g., Supply chain basics for my factory tour"
                className="flex-1 px-5 py-4 bg-white rounded-xl text-base text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 transition-all shadow-sm"
                style={{ border: '1px solid rgba(0, 63, 135, 0.2)', '--tw-ring-color': 'rgba(0, 63, 135, 0.3)' } as React.CSSProperties}
                required
              />
              <button
                type="submit"
                disabled={!topic.trim()}
                className="px-8 py-4 text-white rounded-xl font-semibold text-base transition-all disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
                style={{ background: 'var(--royal-blue)' }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'var(--royal-blue-light)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'var(--royal-blue)'}
              >
                Create My Course
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

    </div>
  );
}
