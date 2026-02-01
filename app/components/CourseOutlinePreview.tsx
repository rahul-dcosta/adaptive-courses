'use client';

import { useState } from 'react';

interface Lesson {
  title: string;
}

interface Module {
  title: string;
  description: string;
  lessons: Lesson[];
}

interface CourseOutline {
  title: string;
  estimated_time: string;
  modules: Module[];
  next_steps: string[];
}

interface CourseOutlinePreviewProps {
  outline: CourseOutline;
  onApprove: () => void;
  onRequestChanges: (feedback: string) => void;
  isRegenerating?: boolean;
}

export default function CourseOutlinePreview({ 
  outline, 
  onApprove, 
  onRequestChanges,
  isRegenerating 
}: CourseOutlinePreviewProps) {
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedback, setFeedback] = useState('');

  const totalLessons = outline.modules.reduce((sum, mod) => sum + mod.lessons.length, 0);

  const handleSubmitFeedback = () => {
    if (feedback.trim()) {
      onRequestChanges(feedback.trim());
      setFeedback('');
      setShowFeedback(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'linear-gradient(135deg, #e8f0f9 0%, #ffffff 100%)' }}>
      <div className="max-w-4xl w-full">
        <div className="glass rounded-3xl p-12 shadow-2xl">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6" style={{ backgroundColor: 'rgba(0, 63, 135, 0.1)' }}>
              <span className="text-2xl">📋</span>
              <span className="text-sm font-semibold" style={{ color: 'var(--royal-blue)' }}>
                Course Preview
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl font-black mb-4 font-serif" style={{ color: 'var(--royal-blue)' }}>
              {outline.title}
            </h1>
            
            <div className="flex items-center justify-center gap-6 text-gray-600">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{outline.estimated_time}</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span>{outline.modules.length} modules, {totalLessons} lessons</span>
              </div>
            </div>
          </div>

          {/* Module Outline */}
          <div className="space-y-6 mb-12">
            {outline.modules.map((module, modIdx) => (
              <div 
                key={modIdx}
                className="p-6 rounded-2xl"
                style={{ 
                  backgroundColor: 'rgba(0, 63, 135, 0.03)',
                  border: '2px solid rgba(0, 63, 135, 0.1)'
                }}
              >
                <div className="flex items-start gap-4 mb-4">
                  <div 
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold flex-shrink-0"
                    style={{ backgroundColor: 'var(--royal-blue)' }}
                  >
                    {modIdx + 1}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-2 font-serif">
                      {module.title}
                    </h3>
                    <p className="text-gray-600">
                      {module.description}
                    </p>
                  </div>
                </div>

                <div className="ml-14 space-y-2">
                  {module.lessons.map((lesson, lesIdx) => (
                    <div key={lesIdx} className="flex items-center gap-3 text-gray-700">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: 'var(--royal-blue)' }}></div>
                      <span className="text-base">{lesson.title}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Next Steps Preview */}
          {outline.next_steps && outline.next_steps.length > 0 && (
            <div className="mb-12 p-6 rounded-2xl" style={{ backgroundColor: 'rgba(0, 63, 135, 0.05)' }}>
              <h4 className="text-sm font-bold uppercase tracking-wider mb-4" style={{ color: 'var(--royal-blue)' }}>
                What You'll Do Next
              </h4>
              <ul className="space-y-2">
                {outline.next_steps.map((step, idx) => (
                  <li key={idx} className="flex gap-3 text-gray-700">
                    <span className="font-bold" style={{ color: 'var(--royal-blue)' }}>{idx + 1}.</span>
                    <span>{step}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Feedback Section */}
          {showFeedback ? (
            <div className="mb-8 p-6 rounded-2xl" style={{ backgroundColor: 'rgba(0, 63, 135, 0.03)', border: '2px solid rgba(0, 63, 135, 0.15)' }}>
              <h4 className="text-lg font-bold mb-4" style={{ color: 'var(--royal-blue)' }}>
                What would you like to change?
              </h4>
              <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="e.g., 'Add a module on practical applications' or 'Make it more technical' or 'I need it shorter'"
                className="w-full px-4 py-3 text-base text-gray-900 placeholder-gray-400 rounded-xl border-2 focus:outline-none resize-none mb-4"
                style={{ borderColor: 'var(--royal-blue)' }}
                rows={4}
                maxLength={500}
                autoFocus
              />
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-gray-500">{feedback.length}/500 characters</span>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowFeedback(false);
                    setFeedback('');
                  }}
                  className="flex-1 px-6 py-3 border-2 rounded-xl font-semibold transition-all"
                  style={{ 
                    borderColor: 'var(--royal-blue)',
                    color: 'var(--royal-blue)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(0, 63, 135, 0.05)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmitFeedback}
                  disabled={!feedback.trim() || isRegenerating}
                  className="flex-1 text-white font-semibold px-6 py-3 rounded-xl transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                  style={{ backgroundColor: 'var(--royal-blue)' }}
                  onMouseEnter={(e) => !feedback.trim() || (e.currentTarget.style.backgroundColor = 'var(--royal-blue-light)')}
                  onMouseLeave={(e) => !feedback.trim() || (e.currentTarget.style.backgroundColor = 'var(--royal-blue)')}
                >
                  {isRegenerating ? 'Regenerating...' : 'Update Outline'}
                </button>
              </div>
            </div>
          ) : (
            /* Action Buttons */
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => setShowFeedback(true)}
                disabled={isRegenerating}
                className="flex-1 px-8 py-4 border-2 rounded-xl font-semibold text-lg transition-all disabled:opacity-40"
                style={{ 
                  borderColor: 'var(--royal-blue)',
                  color: 'var(--royal-blue)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(0, 63, 135, 0.05)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                Request Changes
              </button>

              <button
                onClick={onApprove}
                disabled={isRegenerating}
                className="flex-1 text-white font-bold text-lg px-8 py-4 rounded-xl transition-all shadow-lg hover:shadow-xl disabled:opacity-40 disabled:cursor-not-allowed"
                style={{ backgroundColor: 'var(--royal-blue)' }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--royal-blue-light)')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'var(--royal-blue)')}
              >
                Looks Perfect! Generate Full Course →
              </button>
            </div>
          )}

          {/* Info */}
          <div className="mt-8 p-4 rounded-xl" style={{ backgroundColor: 'rgba(0, 63, 135, 0.05)' }}>
            <p className="text-sm text-gray-600 text-center">
              💡 This is a preview. The full course will have detailed content, examples, and quizzes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
