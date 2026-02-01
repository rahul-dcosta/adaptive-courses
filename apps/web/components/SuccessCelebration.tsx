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
    <div className={`
      max-w-lg w-full transition-all duration-500 transform
      ${show ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}
    `}>
      <div className="bg-white rounded-2xl shadow-xl p-8 md:p-10 text-center" style={{ border: '1px solid rgba(0, 63, 135, 0.1)' }}>
        {/* Success icon */}
        <div className="relative mb-6">
          <div className="w-20 h-20 mx-auto rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(34, 197, 94, 0.1)' }}>
            <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>

        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3 font-serif">
          Course Ready
        </h2>

        {courseTitle && (
          <p className="text-lg text-gray-600 mb-6">
            <span className="font-semibold" style={{ color: 'var(--royal-blue)' }}>{courseTitle}</span>
          </p>
        )}

        <p className="text-gray-600 mb-8">
          Your personalized curriculum has been generated.
        </p>

        <button
          onClick={onContinue}
          className="w-full text-white font-semibold text-lg py-4 px-8 rounded-xl transition-all transform hover:scale-[1.02] shadow-lg"
          style={{ backgroundColor: 'var(--royal-blue)' }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--royal-blue-light)')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'var(--royal-blue)')}
        >
          Start Learning
        </button>
      </div>
    </div>

  );
}
