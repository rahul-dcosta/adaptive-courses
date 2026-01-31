'use client';

import { useState, useEffect } from 'react';
import CourseBuilderEnhanced from './CourseBuilderEnhanced';
import { analytics } from '@/lib/analytics';

export default function LandingPagePremium() {
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
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <div className="max-w-6xl mx-auto px-6 pt-32 pb-20">
        <div className="max-w-4xl">
          {/* Subtle badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-gray-100 rounded-full mb-8">
            <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
            <span className="text-sm text-gray-700 font-medium">Early access</span>
          </div>

          {/* Hero headline */}
          <h1 className="text-6xl md:text-7xl font-black text-gray-900 mb-8 leading-[1.1] tracking-tight">
            Learn anything<br />
            in 30 minutes
          </h1>

          <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-2xl leading-relaxed">
            AI-powered courses tailored to your situation.
            Factory tour tomorrow? Job interview next week?
            Get exactly what you need.
          </p>

          {/* Email capture */}
          <form onSubmit={handleEmailSubmit} className="max-w-md">
            <div className="flex gap-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 bg-white border border-gray-300 rounded-lg text-base text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-900 transition-colors"
                required
              />
              <button
                type="submit"
                disabled={!email.includes('@')}
                className="px-6 py-3 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 active:bg-black transition-colors disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap"
              >
                Get started
              </button>
            </div>
            <p className="text-sm text-gray-500 mt-3">
              First course free. $2 per course after that.
            </p>
          </form>
        </div>
      </div>

      {/* Social proof - subtle */}
      <div className="max-w-6xl mx-auto px-6 py-16 border-t border-gray-200">
        <p className="text-sm text-gray-500 mb-8">Trusted by people at</p>
        <div className="flex flex-wrap gap-12 items-center opacity-40">
          <div className="text-2xl font-bold text-gray-900">Google</div>
          <div className="text-2xl font-bold text-gray-900">Tesla</div>
          <div className="text-2xl font-bold text-gray-900">Stripe</div>
          <div className="text-2xl font-bold text-gray-900">Y Combinator</div>
        </div>
      </div>

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
              Describe your situation
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Factory visit? Job interview? Career switch? We ask what you need and when you need it.
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
              Claude generates a custom curriculum in 30 seconds. No fluff. Just what you need.
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
              Read online, download PDF, or get it via email. Learn on your schedule.
            </p>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="max-w-6xl mx-auto px-6 py-24 border-t border-gray-200">
        <div className="grid md:grid-cols-2 gap-16">
          <div>
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Situation-aware learning
            </h3>
            <p className="text-lg text-gray-600 leading-relaxed">
              Traditional courses ask "What's your skill level?" We ask "What's the situation?"
              Because learning for a factory tour is different than learning for fun.
            </p>
          </div>

          <div>
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              No subscription BS
            </h3>
            <p className="text-lg text-gray-600 leading-relaxed">
              First course free. Every course after is $2. No monthly fees.
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
              "Saved me 8 hours of research before my factory visit. Worth way more than $5."
            </p>
            <p className="text-sm text-gray-500">
              Sarah M., Operations Manager
            </p>
          </div>

          <div className="border-l-2 border-gray-900 pl-6">
            <p className="text-lg text-gray-900 mb-4 leading-relaxed">
              "Better than a $2000 course. No fluff, just what I needed for my interview."
            </p>
            <p className="text-sm text-gray-500">
              Mike R., Product Manager
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
          
          <form onSubmit={handleEmailSubmit} className="max-w-md">
            <div className="flex gap-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 bg-white border border-gray-300 rounded-lg text-base text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-900 transition-colors"
                required
              />
              <button
                type="submit"
                disabled={!email.includes('@')}
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
