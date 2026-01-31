'use client';

import { useState, useEffect } from 'react';
import CourseBuilderEnhanced from './CourseBuilderEnhanced';
import UrgencyBanner from './UrgencyBanner';
import LiveActivityFeed from './LiveActivityFeed';
import TestimonialsCarousel from './TestimonialsCarousel';
import ExitIntentPopup from './ExitIntentPopup';
import { analytics } from '@/lib/analytics';

export default function LandingPageEnhanced() {
  const [showBuilder, setShowBuilder] = useState(false);
  const [email, setEmail] = useState('');

  useEffect(() => {
    analytics.pageView('landing');
  }, []);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      try {
        const { createClient } = await import('@supabase/supabase-js');
        const supabase = createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL || '',
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
        );
        
        await supabase.from('email_signups').insert({
          email,
          source: 'landing_page'
        });
      } catch (error) {
        console.error('Failed to save email:', error);
      }
      
      analytics.emailSignup(email);
      setShowBuilder(true);
    }
  };

  if (showBuilder) {
    return <CourseBuilderEnhanced />;
  }

  return (
    <>
      {/* Exit intent popup */}
      <ExitIntentPopup onCapture={(email) => {
        setEmail(email);
        setShowBuilder(true);
      }} />
      
      {/* Urgency banner at top */}
      <UrgencyBanner type="early-pricing" />
      
      {/* Live activity feed */}
      <LiveActivityFeed />
      
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        {/* Hero Section */}
        <div className="container mx-auto px-4 pt-16 md:pt-24 pb-12">
          <div className="max-w-5xl mx-auto">
            {/* Social proof badge */}
            <div className="text-center mb-6">
              <div className="inline-flex items-center gap-2 bg-white rounded-full px-4 py-2 shadow-md border border-indigo-100">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <img 
                      key={i}
                      src={`https://i.pravatar.cc/150?img=${i}`} 
                      alt=""
                      className="w-6 h-6 rounded-full border-2 border-white"
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-700">
                  Join <strong>1,234+</strong> people learning smarter
                </span>
              </div>
            </div>

            <div className="text-center mb-8 md:mb-12">
              <h1 className="text-4xl sm:text-5xl md:text-7xl font-black text-gray-900 mb-4 md:mb-6 leading-tight px-2">
                Learn Anything<br className="hidden sm:block" />
                in <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  30 Minutes
                </span>
              </h1>
              <p className="text-lg sm:text-xl md:text-2xl text-gray-600 mb-4 md:mb-6 max-w-3xl mx-auto px-4">
                AI-powered courses that understand <strong>your situation</strong>, not just your skill level
              </p>
              <p className="text-base sm:text-lg text-gray-500 mb-4 max-w-2xl mx-auto px-4">
                Factory visit tomorrow? Job interview next week?<br className="hidden md:block" />
                We'll teach you exactly what you need. <strong>Nothing more.</strong>
              </p>
              
              {/* Quick sample link */}
              <a 
                href="/sample" 
                className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-medium hover:underline mb-12"
              >
                <span>See a sample course first</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </a>
            </div>

            {/* Email Capture - Enhanced */}
            <div className="max-w-lg mx-auto mb-6 md:mb-8 px-4">
              <form onSubmit={handleEmailSubmit} className="relative">
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email to start"
                    className="flex-1 px-5 sm:px-6 py-4 sm:py-5 text-base sm:text-lg rounded-2xl border-2 border-gray-300 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 focus:outline-none transition-all shadow-sm"
                    required
                  />
                  <button
                    type="submit"
                    disabled={!email.includes('@')}
                    className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold px-8 sm:px-10 py-4 sm:py-5 rounded-2xl hover:from-indigo-700 hover:to-purple-700 transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl text-base sm:text-lg whitespace-nowrap min-h-[56px]"
                  >
                    Start Learning →
                  </button>
                </div>
              </form>
              
              <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 mt-4 text-xs sm:text-sm text-gray-600 px-4">
                <div className="flex items-center gap-1">
                  <span className="text-green-600">✓</span>
                  <span>First course FREE</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-green-600">✓</span>
                  <span>No subscription</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-green-600">✓</span>
                  <span>30-second setup</span>
                </div>
              </div>
            </div>

            {/* Limited slots urgency */}
            <div className="max-w-lg mx-auto">
              <UrgencyBanner type="limited-slots" />
            </div>
          </div>
        </div>

        {/* How It Works */}
        <div className="bg-white py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl md:text-5xl font-bold text-center text-gray-900 mb-4">
              How it works
            </h2>
            <p className="text-center text-gray-600 mb-16 text-lg">
              From topic to complete course in under 60 seconds
            </p>
            
            <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-8 md:gap-12">
              <div className="text-center group">
                <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform">
                  <span className="text-4xl">💬</span>
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900">Tell us what you need</h3>
                <p className="text-gray-600">
                  Type your topic. We'll ask 3 button-click questions about your situation, timeline, and goals.
                </p>
              </div>
              
              <div className="text-center group">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform">
                  <span className="text-4xl">✨</span>
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900">AI crafts your course</h3>
                <p className="text-gray-600">
                  Claude Sonnet 4.5 generates a custom curriculum in 30 seconds. Modules, lessons, quizzes — the works.
                </p>
              </div>
              
              <div className="text-center group">
                <div className="w-20 h-20 bg-gradient-to-br from-pink-500 to-red-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform">
                  <span className="text-4xl">🚀</span>
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900">Start learning instantly</h3>
                <p className="text-gray-600">
                  Read online, download as PDF, or save to your dashboard. Learn on your terms, anytime.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Testimonials */}
        <div className="py-20 bg-gradient-to-br from-gray-50 to-indigo-50">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl md:text-5xl font-bold text-center text-gray-900 mb-4">
              Loved by learners
            </h2>
            <div className="flex items-center justify-center gap-2 mb-12">
              <div className="text-yellow-400 text-2xl">⭐⭐⭐⭐⭐</div>
              <span className="text-gray-600 font-medium">4.9/5 from 1,234 courses generated</span>
            </div>
            
            <div className="max-w-3xl mx-auto">
              <TestimonialsCarousel />
            </div>
          </div>
        </div>

        {/* Feature Highlights */}
        <div className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl md:text-5xl font-bold text-center text-gray-900 mb-16">
              Why Adaptive Courses?
            </h2>
            
            <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8">
              <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-8 border border-indigo-100">
                <div className="text-4xl mb-4">🎯</div>
                <h3 className="text-2xl font-bold mb-3 text-gray-900">Situation-aware learning</h3>
                <p className="text-gray-700">
                  Traditional courses ask "What's your skill level?" We ask "What's the situation?" — because learning for a factory tour is different than learning out of curiosity.
                </p>
              </div>
              
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-8 border border-purple-100">
                <div className="text-4xl mb-4">⚡</div>
                <h3 className="text-2xl font-bold mb-3 text-gray-900">Insanely fast</h3>
                <p className="text-gray-700">
                  No 10-hour video courses. No week-long programs. Just focused, 30-minute learning paths that get you ready when you need it.
                </p>
              </div>
              
              <div className="bg-gradient-to-br from-pink-50 to-red-50 rounded-2xl p-8 border border-pink-100">
                <div className="text-4xl mb-4">💎</div>
                <h3 className="text-2xl font-bold mb-3 text-gray-900">No fluff, just value</h3>
                <p className="text-gray-700">
                  AI cuts through the noise. You get exactly what you need — no filler content, no upsells, no "bonus modules" you'll never watch.
                </p>
              </div>
              
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-8 border border-green-100">
                <div className="text-4xl mb-4">🎁</div>
                <h3 className="text-2xl font-bold mb-3 text-gray-900">Ridiculously affordable</h3>
                <p className="text-gray-700">
                  First course free. Every course after is $5. No subscriptions. No hidden fees. Cancel? There's nothing to cancel.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Final CTA */}
        <div className="py-20 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to learn something new?
            </h2>
            <p className="text-xl text-indigo-100 mb-8 max-w-2xl mx-auto">
              Join 1,234+ people who learned smarter with AI-powered courses
            </p>
            <button
              onClick={() => setShowBuilder(true)}
              className="bg-white text-indigo-600 font-bold px-12 py-5 rounded-2xl hover:scale-105 transition-transform text-lg shadow-2xl inline-flex items-center gap-2"
            >
              <span>Generate Your Course</span>
              <span className="text-2xl">→</span>
            </button>
            <p className="text-indigo-200 mt-4 text-sm">
              🎁 Your first course is FREE • No credit card required
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-900 text-white py-12">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
              <div>
                <h3 className="font-bold text-xl mb-2">Adaptive Courses</h3>
                <p className="text-gray-400 text-sm">Learn anything in 30 minutes</p>
              </div>
              
              <div className="flex flex-wrap gap-6 text-sm">
                <a href="/about" className="text-gray-400 hover:text-white transition">About</a>
                <a href="/faq" className="text-gray-400 hover:text-white transition">FAQ</a>
                <a href="/terms" className="text-gray-400 hover:text-white transition">Terms</a>
                <a href="/privacy" className="text-gray-400 hover:text-white transition">Privacy</a>
              </div>
            </div>
            
            <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-500 text-sm">
              <p>© 2026 Adaptive Courses. Built with Claude Sonnet 4.5.</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
