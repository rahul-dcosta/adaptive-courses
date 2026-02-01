'use client';

import { useState, useEffect } from 'react';
import CourseBuilderSmart from './CourseBuilderSmart';
import ExampleCourses from './ExampleCourses';
import { analytics } from '@/lib/analytics';

export default function LandingPagePremium() {
  const [showBuilder, setShowBuilder] = useState(false);
  const [topic, setTopic] = useState('');

  useEffect(() => {
    analytics.pageView('landing');
  }, []);

  const handleTopicSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (topic.trim()) {
      analytics.track('topic_entered_landing', { topic });
      setShowBuilder(true);
    }
  };

  const handleSelectExample = (exampleTopic: string) => {
    analytics.track('example_course_selected', { topic: exampleTopic });
    setTopic(exampleTopic);
    setShowBuilder(true);
  };

  if (showBuilder) {
    return <CourseBuilderSmart initialTopic={topic} />;
  }

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <div className="max-w-6xl mx-auto px-6 pt-32 pb-20">
        <div className="max-w-4xl">
          {/* Subtle badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-gray-100 rounded-full mb-8">
            <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
            <span className="text-sm text-gray-700 font-medium">Early access</span>
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
              First course free. $3.99 per course after that.
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
              No subscription BS
            </h3>
            <p className="text-lg text-gray-600 leading-relaxed">
              First course free. Every course after is $3.99. No monthly fees.
              No premium tiers. No upsells. Just great courses.
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
              "Prepped for my interview in an afternoon. Got the job. Best $4 I ever spent."
            </p>
            <p className="text-sm text-gray-500">
              James K., Software Engineer
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
                autoFocus
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
            <p className="text-sm text-gray-500">Built with Claude</p>
          </div>
          
          <div className="flex gap-8 text-sm text-gray-600">
            <a href="/about" className="hover:text-gray-900 transition-colors">About</a>
            <a href="/faq" className="hover:text-gray-900 transition-colors">FAQ</a>
            <a href="/terms" className="hover:text-gray-900 transition-colors">Terms</a>
            <a href="/privacy" className="hover:text-gray-900 transition-colors">Privacy</a>
          </div>
        </div>
      </div>
    </div>
  );
}
