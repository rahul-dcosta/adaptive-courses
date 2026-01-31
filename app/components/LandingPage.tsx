'use client';

import { useState } from 'react';
import CourseBuilderNew from './CourseBuilderNew';

export default function LandingPage() {
  const [showBuilder, setShowBuilder] = useState(false);
  const [email, setEmail] = useState('');
  const [emailCaptured, setEmailCaptured] = useState(false);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      try {
        // Save email to Supabase
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
        // Continue anyway - don't block the user
      }
      
      setEmailCaptured(true);
      setShowBuilder(true);
    }
  };

  if (showBuilder) {
    return <CourseBuilderNew />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Hero Section */}
      <div className="container mx-auto px-4 pt-20 pb-12">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Learn anything in <span className="text-indigo-600">30 minutes</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-8">
            AI-powered courses that understand your situation, not just your skill level.
          </p>
          <p className="text-lg text-gray-500 mb-12">
            Going to a factory tomorrow? Job interview next week? We'll teach you exactly what you need, nothing more.
          </p>

          {/* Email Capture */}
          <div className="max-w-md mx-auto mb-16">
            <form onSubmit={handleEmailSubmit} className="flex gap-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="flex-1 px-6 py-4 text-lg rounded-lg border-2 border-gray-300 focus:border-indigo-500 focus:outline-none"
                required
              />
              <button
                type="submit"
                className="bg-indigo-600 text-white font-semibold px-8 py-4 rounded-lg hover:bg-indigo-700 transition whitespace-nowrap"
              >
                Start Learning →
              </button>
            </form>
            <p className="text-sm text-gray-500 mt-3">
              Your first course is $5. No subscription. No BS.
            </p>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="bg-white py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">
            How it works
          </h2>
          <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">💬</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Tell us what you need</h3>
              <p className="text-gray-600">
                Type your topic. We'll ask 3 quick questions about your situation and timeline.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🤖</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">AI builds your course</h3>
              <p className="text-gray-600">
                Claude generates a custom curriculum in 30 seconds. Modules, lessons, quizzes — the works.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🎓</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Start learning</h3>
              <p className="text-gray-600">
                Read online, download as PDF, or get it via email. Learn on your terms.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">
            What people are saying
          </h2>
          <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-indigo-200 rounded-full mr-3"></div>
                <div>
                  <p className="font-semibold">Sarah Chen</p>
                  <p className="text-sm text-gray-500">Product Manager</p>
                </div>
              </div>
              <p className="text-gray-700">
                "Had a factory tour in 24 hours. This course gave me the exact vocab I needed to not look clueless. Worth every penny."
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-indigo-200 rounded-full mr-3"></div>
                <div>
                  <p className="font-semibold">Mike Rodriguez</p>
                  <p className="text-sm text-gray-500">Supply Chain Analyst</p>
                </div>
              </div>
              <p className="text-gray-700">
                "I was switching careers and needed to sound smart in interviews. The 'ask good questions' goal was perfect for me."
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-indigo-200 rounded-full mr-3"></div>
                <div>
                  <p className="font-semibold">Emma Watson</p>
                  <p className="text-sm text-gray-500">Consultant</p>
                </div>
              </div>
              <p className="text-gray-700">
                "The button-based questions felt like magic. It knew exactly what I needed without me having to explain."
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Ready to learn something new?
          </h2>
          <button
            onClick={() => setShowBuilder(true)}
            className="bg-indigo-600 text-white font-semibold px-12 py-4 rounded-lg hover:bg-indigo-700 transition text-lg"
          >
            Generate Your Course — $5
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 mb-4 md:mb-0">
              © 2026 Adaptive Courses. Built with Claude.
            </p>
            <div className="flex gap-6 flex-wrap justify-center">
              <a href="/faq" className="text-gray-400 hover:text-white transition">
                FAQ
              </a>
              <a href="/terms" className="text-gray-400 hover:text-white transition">
                Terms
              </a>
              <a href="/privacy" className="text-gray-400 hover:text-white transition">
                Privacy
              </a>
              <a href="mailto:support@adaptive-courses.com" className="text-gray-400 hover:text-white transition">
                Contact
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
