'use client';

import { useState } from 'react';
import ReferralCard from './ReferralCard';

interface Module {
  title: string;
  content: string;
  quiz?: any;
}

interface CoursePreviewProps {
  course: {
    title: string;
    description: string;
    modules: Module[];
  };
  onUnlock?: () => void;
  isFree?: boolean;
  showReferral?: boolean;
}

export default function CoursePreview({ course, onUnlock, isFree = true, showReferral = true }: CoursePreviewProps) {
  const [expandedModule, setExpandedModule] = useState<number>(0);

  const testimonials = [
    { text: "Worth way more than $5. Saved me hours of Googling.", author: "Alex T.", role: "Software Engineer" },
    { text: "This saved me 8 hours of research before my factory visit!", author: "Sarah M.", role: "Operations Manager" },
    { text: "Better than a $2000 online course. No fluff, just what I needed.", author: "Mike R.", role: "Product Manager" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                {course.title}
              </h1>
              <p className="text-gray-600 text-lg">
                {course.description}
              </p>
            </div>
            
            {isFree && (
              <div className="bg-gradient-to-r from-green-400 to-emerald-500 text-white px-4 py-2 rounded-full font-bold text-sm whitespace-nowrap ml-4">
                🎁 FREE
              </div>
            )}
          </div>

          {/* Course stats */}
          <div className="flex flex-wrap gap-6 text-sm text-gray-600 pt-4 border-t border-gray-200">
            <div className="flex items-center gap-2">
              <span className="text-2xl">📚</span>
              <span><strong className="text-gray-900">{course.modules.length}</strong> modules</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">⏱️</span>
              <span><strong className="text-gray-900">~30</strong> minutes</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">✅</span>
              <span><strong className="text-gray-900">Interactive</strong> quizzes</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">📄</span>
              <span><strong className="text-gray-900">PDF</strong> download</span>
            </div>
          </div>
        </div>

        {/* Modules */}
        <div className="space-y-4">
          {course.modules.map((module, idx) => {
            const isLocked = idx > 0 && !isFree;
            const isExpanded = expandedModule === idx;

            return (
              <div 
                key={idx}
                className={`
                  bg-white rounded-2xl shadow-lg overflow-hidden
                  transition-all duration-300
                  ${isLocked ? 'relative' : ''}
                  ${isExpanded ? 'shadow-2xl' : 'hover:shadow-xl'}
                `}
              >
                {/* Module header */}
                <button
                  onClick={() => !isLocked && setExpandedModule(isExpanded ? -1 : idx)}
                  className={`
                    w-full p-6 flex items-center justify-between text-left
                    transition-colors
                    ${isLocked ? 'cursor-not-allowed' : 'hover:bg-gray-50'}
                  `}
                  disabled={isLocked}
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className={`
                      w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg
                      ${isLocked 
                        ? 'bg-gray-200 text-gray-400' 
                        : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white'
                      }
                    `}>
                      {isLocked ? '🔒' : idx + 1}
                    </div>
                    <div className="flex-1">
                      <h2 className="text-xl font-bold text-gray-900 mb-1">
                        {module.title}
                      </h2>
                      {isLocked && (
                        <p className="text-sm text-gray-500">
                          Unlock to access this module
                        </p>
                      )}
                    </div>
                  </div>
                  
                  {!isLocked && (
                    <svg 
                      className={`w-6 h-6 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  )}
                </button>

                {/* Module content */}
                {!isLocked && isExpanded && (
                  <div className="px-6 pb-6 animate-fade-in">
                    <div className="prose prose-sm max-w-none text-gray-700">
                      <div dangerouslySetInnerHTML={{ __html: module.content }} />
                    </div>
                    
                    {module.quiz && (
                      <div className="mt-6 p-4 bg-indigo-50 rounded-xl border border-indigo-200">
                        <h3 className="font-bold text-indigo-900 mb-3 flex items-center gap-2">
                          <span className="text-xl">📝</span>
                          Quick Check
                        </h3>
                        {/* Quiz content here */}
                        <p className="text-sm text-indigo-700">Interactive quiz coming soon...</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Locked overlay */}
                {isLocked && (
                  <div className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 border-t border-gray-200">
                    <div className="blur-sm pointer-events-none select-none text-gray-400 text-sm">
                      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore...</p>
                      <p className="mt-2">Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip...</p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Unlock CTA (if locked modules exist) */}
        {course.modules.length > 1 && !isFree && (
          <div className="mt-8 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-3xl p-8 md:p-12 text-center text-white shadow-2xl">
            <div className="max-w-2xl mx-auto">
              <div className="text-5xl mb-4">🔓</div>
              <h3 className="text-3xl md:text-4xl font-bold mb-4">
                Unlock Full Course
              </h3>
              <p className="text-xl mb-6 text-indigo-100">
                {course.modules.length - 1} more module{course.modules.length > 2 ? 's' : ''} waiting for you
              </p>
              
              {/* Benefits */}
              <div className="grid md:grid-cols-2 gap-4 mb-8 text-left">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">✓</span>
                    <div>
                      <h4 className="font-bold mb-1">{course.modules.length} Expert Modules</h4>
                      <p className="text-sm text-indigo-100">Complete learning path</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">✓</span>
                    <div>
                      <h4 className="font-bold mb-1">Interactive Quizzes</h4>
                      <p className="text-sm text-indigo-100">Test your knowledge</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">✓</span>
                    <div>
                      <h4 className="font-bold mb-1">Downloadable PDF</h4>
                      <p className="text-sm text-indigo-100">Save and share</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">✓</span>
                    <div>
                      <h4 className="font-bold mb-1">Lifetime Access</h4>
                      <p className="text-sm text-indigo-100">Review anytime</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Social proof */}
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 mb-8 border border-white/20">
                <div className="text-sm italic text-indigo-100 mb-3">
                  "{testimonials[0].text}"
                </div>
                <div className="text-xs text-indigo-200">
                  - {testimonials[0].author}, {testimonials[0].role}
                </div>
              </div>

              {/* Price & CTA */}
              <div className="mb-6">
                <div className="text-5xl font-black mb-2">$5</div>
                <p className="text-indigo-100">One-time payment. No subscription.</p>
              </div>

              <button
                onClick={onUnlock}
                className="w-full md:w-auto bg-white text-indigo-600 font-bold text-lg px-12 py-4 rounded-2xl hover:scale-105 transition-transform shadow-xl hover:shadow-2xl mb-4"
              >
                Unlock Now →
              </button>

              <p className="text-xs text-indigo-200">
                💯 100% money-back guarantee if not satisfied
              </p>
            </div>
          </div>
        )}

        {/* Referral Card */}
        {showReferral && isFree && (
          <div className="mt-8">
            <ReferralCard />
          </div>
        )}

        {/* Free course CTA */}
        {isFree && (
          <div className="mt-8 bg-gradient-to-r from-green-400 to-emerald-500 rounded-3xl p-8 text-center text-white shadow-xl">
            <div className="text-5xl mb-4">🎉</div>
            <h3 className="text-2xl font-bold mb-2">
              This Course is FREE!
            </h3>
            <p className="text-lg mb-6 text-green-50">
              Every course after is just $2. No subscription. No BS.
            </p>
            <button className="bg-white text-green-600 font-bold px-8 py-3 rounded-xl hover:scale-105 transition-transform">
              Save to Dashboard →
            </button>
          </div>
        )}

        {/* Trust badges */}
        <div className="mt-8 bg-white rounded-2xl shadow-lg p-6">
          <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🔒</span>
              <span>Secure payment</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">💯</span>
              <span>Money-back guarantee</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">⚡</span>
              <span>Instant access</span>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
