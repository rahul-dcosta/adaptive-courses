'use client';

import { useState, useEffect } from 'react';

interface SuccessCelebrationProps {
  onContinue: () => void;
  courseTitle?: string;
}

export default function SuccessCelebration({ onContinue, courseTitle }: SuccessCelebrationProps) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Trigger animation after mount
    setTimeout(() => setShow(true), 100);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center p-4">
      <div className={`
        max-w-lg w-full transition-all duration-700 transform
        ${show ? 'scale-100 opacity-100' : 'scale-90 opacity-0'}
      `}>
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 text-center relative overflow-hidden">
          {/* Confetti animation */}
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(30)].map((_, i) => (
              <div
                key={i}
                className="absolute animate-confetti"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: '-10%',
                  animationDelay: `${Math.random() * 2}s`,
                  animationDuration: `${2 + Math.random() * 2}s`
                }}
              >
                {['🎉', '✨', '🌟', '💫', '🎊'][Math.floor(Math.random() * 5)]}
              </div>
            ))}
          </div>

          {/* Success icon with pulse */}
          <div className="relative mb-6">
            <div className="w-24 h-24 mx-auto bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center animate-bounce-slow">
              <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            {/* Pulse rings */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-24 h-24 rounded-full bg-green-400 animate-ping opacity-20"></div>
            </div>
          </div>

          <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
            Your Course is Ready!
          </h2>
          
          {courseTitle && (
            <p className="text-xl text-gray-600 mb-6">
              <span className="font-semibold text-indigo-600">{courseTitle}</span>
            </p>
          )}

          <p className="text-lg text-gray-600 mb-8">
            We created a personalized <strong>30-minute learning path</strong> tailored to your situation
          </p>

          {/* Feature highlights */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="text-center">
              <div className="text-3xl mb-2">📚</div>
              <p className="text-sm text-gray-600">
                <strong className="text-gray-900">5</strong><br/>
                Modules
              </p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-2">⏱️</div>
              <p className="text-sm text-gray-600">
                <strong className="text-gray-900">~30</strong><br/>
                Minutes
              </p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-2">✅</div>
              <p className="text-sm text-gray-600">
                <strong className="text-gray-900">Interactive</strong><br/>
                Quizzes
              </p>
            </div>
          </div>

          <button
            onClick={onContinue}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-lg py-5 px-8 rounded-2xl hover:from-indigo-700 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg mb-4 animate-pulse-slow"
          >
            See Your Course →
          </button>

          <p className="text-sm text-gray-500">
            🎁 Your first course is <strong className="text-indigo-600">FREE</strong>
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes confetti {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
          }
        }
        @keyframes bounce-slow {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-20px);
          }
        }
        @keyframes pulse-slow {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.8;
          }
        }
        .animate-confetti {
          animation: confetti linear forwards;
        }
        .animate-bounce-slow {
          animation: bounce-slow 2s ease-in-out infinite;
        }
        .animate-pulse-slow {
          animation: pulse-slow 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
