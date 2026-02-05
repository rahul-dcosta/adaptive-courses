'use client';

import { useState, useEffect } from 'react';

interface LoadingSpinnerProps {
  topic?: string;
}

const LOADING_MESSAGES = [
  { emoji: '1', text: 'Analyzing learner profile specifications' },
  { emoji: '2', text: 'Constructing optimal learning pathway' },
  { emoji: '3', text: 'Structuring personalized curriculum modules' },
  { emoji: '4', text: 'Adapting content to learner context' },
  { emoji: '5', text: 'Integrating domain-specific insights' },
  { emoji: '6', text: 'Incorporating practical applications' },
  { emoji: '7', text: 'Finalizing course structure' }
];

export default function LoadingSpinner({ topic }: LoadingSpinnerProps) {
  const [messageIndex, setMessageIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Sync message index with progress (not time-based)
    const updateMessage = () => {
      if (progress < 15) setMessageIndex(0);
      else if (progress < 30) setMessageIndex(1);
      else if (progress < 50) setMessageIndex(2);
      else if (progress < 70) setMessageIndex(3);
      else if (progress < 85) setMessageIndex(4);
      else if (progress < 92) setMessageIndex(5);
      else setMessageIndex(6); // "Almost there..." at 92%+
    };

    // Realistic progress: fast start, slow at end
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev < 60) return prev + 3; // Fast initial progress
        if (prev < 80) return prev + 1.5; // Slow down
        if (prev < 92) return prev + 0.5; // Very slow near end
        return 92; // Cap at 92%, stay at "Almost there..." until actual completion
      });
    }, 500);

    updateMessage();

    return () => {
      clearInterval(progressInterval);
    };
  }, [progress]);

  const currentMessage = LOADING_MESSAGES[messageIndex];

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          {/* Animated icon */}
          <div className="relative w-24 h-24 mx-auto mb-6">
            <div className="absolute inset-0 rounded-full animate-ping opacity-20" style={{ backgroundColor: 'var(--royal-blue)' }}></div>
            <div className="relative rounded-full w-24 h-24 flex items-center justify-center" style={{ backgroundColor: 'var(--royal-blue)' }}>
              <svg className="w-12 h-12 text-white animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
          </div>
          
          <h2 className="text-3xl font-bold mb-3 font-serif" style={{ color: 'var(--royal-blue)' }}>
            Generating Course Content
          </h2>
          {topic && (
            <p className="text-gray-600 text-lg mb-2 leading-relaxed">
              Subject: <span className="font-semibold" style={{ textTransform: 'capitalize' }}>{topic}</span>
            </p>
          )}
          <p className="text-gray-500 text-sm">Processing time: approximately 30–60 seconds</p>
        </div>
        
        {/* Progress bar */}
        <div className="mb-6">
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div 
              className="h-3 rounded-full transition-all duration-500 ease-out"
              style={{ 
                width: `${progress}%`,
                backgroundColor: 'var(--royal-blue)'
              }}
            />
          </div>
          <p className="text-gray-600 text-sm text-center mt-2">
            {Math.round(progress)}%
          </p>
        </div>
        
        {/* Rotating status messages */}
        <div className="space-y-3 glass rounded-2xl p-6 min-h-[200px] shadow-xl">
          {LOADING_MESSAGES.map((msg, idx) => (
            <div 
              key={idx} 
              className={`
                flex items-center gap-3 transition-all duration-500
                ${idx === messageIndex ? 'opacity-100 translate-x-0' :
                  idx < messageIndex ? 'opacity-60 -translate-x-2' :
                  'opacity-70 translate-x-2'}
              `}
            >
              <div 
                className={`
                  w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0
                  ${idx < messageIndex ? 'text-white' : 
                    idx === messageIndex ? 'text-white' : 
                    'bg-gray-200 text-gray-500'}
                  transition-all duration-500
                `}
                style={{
                  backgroundColor: idx < messageIndex ? '#10b981' : 
                    idx === messageIndex ? 'var(--royal-blue)' : undefined
                }}
              >
                <span className="flex items-center justify-center w-full h-full">
                  {idx < messageIndex ? '✓' : msg.emoji}
                </span>
              </div>
              <span className={`
                ${idx === messageIndex ? 'text-gray-900 font-medium' :
                  idx < messageIndex ? 'text-gray-600' : 'text-gray-500'}
                transition-colors duration-500
              `}>
                {msg.text}
              </span>
            </div>
          ))}
        </div>

        {/* Academic note */}
        <div className="mt-6 glass-dark rounded-xl p-4 shadow-md">
          <p className="text-gray-700 text-sm text-center leading-relaxed">
            <strong>Note:</strong> Course content is dynamically generated based on your learner profile, 
            incorporating context-specific examples and adaptive difficulty progression.
          </p>
        </div>
      </div>
    </div>
  );
}
