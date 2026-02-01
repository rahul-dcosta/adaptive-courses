'use client';

import { useEffect, useState } from 'react';

const steps = [
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
    title: 'Pick any topic',
    description: 'From quantum physics to sourdough baking—if you can describe it, we can teach it.',
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: 'Answer 3 quick questions',
    description: "We ask about your situation, timeline, and goals—not just your skill level.",
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
    title: 'Learn your way',
    description: 'Get a custom course with modules, lessons, and quizzes—generated in 30 seconds.',
  },
];

export default function WelcomePage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="min-h-screen pt-20 flex items-center justify-center px-6 py-16">
      <div className="max-w-2xl w-full">
        {/* Welcome Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 text-center">
          {/* Animated checkmark */}
          <div
            className={`w-20 h-20 rounded-full mx-auto mb-8 flex items-center justify-center transition-all duration-500 ${
              mounted ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
            }`}
            style={{ background: 'rgba(0, 63, 135, 0.1)' }}
          >
            <svg
              className="w-10 h-10"
              style={{ color: 'var(--royal-blue)' }}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>

          <h1
            className="text-3xl md:text-4xl font-black mb-4 tracking-tight"
            style={{ color: 'var(--royal-blue)' }}
          >
            Welcome to Adaptive Courses!
          </h1>

          <p className="text-lg text-gray-600 mb-8">
            Your account is all set up. Your first course is on us—completely free.
          </p>

          {/* How it works */}
          <div className="text-left mb-10">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-6 text-center">
              Here's how it works
            </h2>
            <div className="space-y-6">
              {steps.map((step, idx) => (
                <div
                  key={idx}
                  className={`flex gap-4 items-start transition-all duration-300 ${
                    mounted ? 'translate-x-0 opacity-100' : '-translate-x-4 opacity-0'
                  }`}
                  style={{ transitionDelay: `${(idx + 1) * 150}ms` }}
                >
                  <div
                    className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: 'rgba(0, 63, 135, 0.08)', color: 'var(--royal-blue)' }}
                  >
                    {step.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">{step.title}</h3>
                    <p className="text-gray-600 text-sm">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <a
            href="/"
            className="inline-block w-full sm:w-auto px-8 py-4 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all"
            style={{ background: 'var(--royal-blue)' }}
          >
            Create Your First Course →
          </a>

          <p className="text-sm text-gray-500 mt-4">
            Takes about 30 seconds to generate
          </p>
        </div>

        {/* Quick Links */}
        <div className="mt-8 flex justify-center gap-6 text-sm">
          <a href="/pricing" className="text-gray-500 hover:text-gray-700">
            View Pricing
          </a>
          <a href="/faq" className="text-gray-500 hover:text-gray-700">
            FAQ
          </a>
          <a href="/about" className="text-gray-500 hover:text-gray-700">
            About Us
          </a>
        </div>
      </div>
    </div>
  );
}
