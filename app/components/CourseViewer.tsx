'use client';

import { useState, useEffect } from 'react';
import { analytics } from '@/lib/analytics';

interface Module {
  title: string;
  content: string;
  quiz?: {
    question: string;
    options: string[];
    correctAnswer: number;
    explanation?: string;
  }[];
}

interface Course {
  id?: string;
  title: string;
  description: string;
  modules: Module[];
  topic?: string;
}

interface CourseViewerProps {
  course: Course;
  onExit?: () => void;
}

export default function CourseViewer({ course, onExit }: CourseViewerProps) {
  const [currentModule, setCurrentModule] = useState(0);
  const [completedModules, setCompletedModules] = useState<Set<number>>(new Set());
  const [showNav, setShowNav] = useState(true);

  useEffect(() => {
    // Load progress from localStorage
    if (course.id) {
      const saved = localStorage.getItem(`course_${course.id}`);
      if (saved) {
        const { completed } = JSON.parse(saved);
        setCompletedModules(new Set(completed));
      }
    }
  }, [course.id]);

  useEffect(() => {
    // Save progress
    if (course.id) {
      localStorage.setItem(`course_${course.id}`, JSON.stringify({
        completed: Array.from(completedModules),
        lastModule: currentModule,
        lastAccessed: new Date().toISOString()
      }));
    }
  }, [completedModules, currentModule, course.id]);

  useEffect(() => {
    // Keyboard shortcuts
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' && currentModule < course.modules.length - 1) {
        handleNext();
      } else if (e.key === 'ArrowLeft' && currentModule > 0) {
        handlePrevious();
      } else if (e.key === 'm') {
        setShowNav(!showNav);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentModule, showNav]);

  const handleModuleComplete = () => {
    const newCompleted = new Set(completedModules);
    newCompleted.add(currentModule);
    setCompletedModules(newCompleted);

    analytics.track('module_completed', {
      courseId: course.id,
      moduleIndex: currentModule,
      moduleTitle: course.modules[currentModule].title
    });

    // Auto-advance if not last module
    if (currentModule < course.modules.length - 1) {
      setTimeout(() => setCurrentModule(currentModule + 1), 500);
    }
  };

  const handleNext = () => {
    if (currentModule < course.modules.length - 1) {
      setCurrentModule(currentModule + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrevious = () => {
    if (currentModule > 0) {
      setCurrentModule(currentModule - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleDownloadPDF = () => {
    analytics.track('pdf_download', { courseId: course.id });
    // TODO: Implement actual PDF generation
    alert('PDF download coming soon!');
  };

  const module = course.modules[currentModule];
  const isCompleted = completedModules.has(currentModule);
  const totalCompleted = completedModules.size;
  const progress = (totalCompleted / course.modules.length) * 100;

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {onExit && (
                <button
                  onClick={onExit}
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                  title="Exit course"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                </button>
              )}
              
              <div>
                <h1 className="text-lg font-bold text-gray-900">{course.title}</h1>
                <p className="text-sm text-gray-500">
                  Module {currentModule + 1} of {course.modules.length}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Progress */}
              <div className="hidden md:flex items-center gap-2">
                <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-2 bg-gray-900 transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <span className="text-sm text-gray-600 font-medium">
                  {totalCompleted}/{course.modules.length}
                </span>
              </div>

              {/* Download PDF */}
              <button
                onClick={handleDownloadPDF}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
                title="Download PDF"
              >
                Download PDF
              </button>

              {/* Menu toggle */}
              <button
                onClick={() => setShowNav(!showNav)}
                className="p-2 text-gray-600 hover:text-gray-900 transition-colors md:hidden"
                title="Toggle navigation (M)"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar navigation */}
        {showNav && (
          <div className="w-64 border-r border-gray-200 min-h-screen sticky top-[73px] hidden md:block">
            <div className="p-6">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
                Modules
              </h3>
              <nav className="space-y-1">
                {course.modules.map((mod, idx) => {
                  const isActive = idx === currentModule;
                  const isDone = completedModules.has(idx);

                  return (
                    <button
                      key={idx}
                      onClick={() => setCurrentModule(idx)}
                      className={`
                        w-full text-left px-3 py-2 rounded-lg text-sm transition-colors
                        ${isActive 
                          ? 'bg-gray-900 text-white font-medium' 
                          : isDone
                          ? 'text-gray-900 hover:bg-gray-100'
                          : 'text-gray-600 hover:bg-gray-100'
                        }
                      `}
                    >
                      <div className="flex items-center gap-2">
                        <div className={`
                          w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 text-xs
                          ${isActive 
                            ? 'bg-white text-gray-900' 
                            : isDone 
                            ? 'bg-gray-900 text-white'
                            : 'bg-gray-200 text-gray-600'
                          }
                        `}>
                          {isDone ? '✓' : idx + 1}
                        </div>
                        <span className="line-clamp-2">{mod.title}</span>
                      </div>
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>
        )}

        {/* Main content */}
        <div className="flex-1">
          <article className="max-w-3xl mx-auto px-6 py-12">
            {/* Module header */}
            <div className="mb-12">
              <div className="flex items-center gap-2 mb-4">
                <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded">
                  Module {currentModule + 1}
                </span>
                {isCompleted && (
                  <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded flex items-center gap-1">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Completed
                  </span>
                )}
              </div>
              
              <h2 className="text-4xl font-black text-gray-900 mb-4 leading-tight">
                {module.title}
              </h2>
            </div>

            {/* Module content */}
            <div 
              className="prose prose-lg prose-gray max-w-none mb-12"
              dangerouslySetInnerHTML={{ __html: module.content }}
            />

            {/* Quiz (if exists) */}
            {module.quiz && module.quiz.length > 0 && (
              <div className="border-t border-gray-200 pt-12 mb-12">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">
                  Quick Check
                </h3>
                {/* Quiz component would go here */}
                <p className="text-gray-600">Quiz functionality coming soon...</p>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-8 border-t border-gray-200">
              <div>
                {!isCompleted && (
                  <button
                    onClick={handleModuleComplete}
                    className="px-6 py-3 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors"
                  >
                    Mark as Complete
                  </button>
                )}
              </div>

              <div className="flex gap-3">
                {currentModule > 0 && (
                  <button
                    onClick={handlePrevious}
                    className="flex items-center gap-2 px-4 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:border-gray-900 hover:text-gray-900 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Previous
                  </button>
                )}
                
                {currentModule < course.modules.length - 1 && (
                  <button
                    onClick={handleNext}
                    className="flex items-center gap-2 px-4 py-3 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors"
                  >
                    Next Module
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                )}

                {currentModule === course.modules.length - 1 && isCompleted && (
                  <div className="px-6 py-3 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-green-700 font-medium">
                      🎉 Course completed!
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Keyboard shortcuts hint */}
            <div className="mt-8 p-4 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-500 text-center">
                <kbd className="px-2 py-1 bg-white border border-gray-300 rounded text-xs font-mono">←</kbd>
                {' '}Previous{' '}
                <kbd className="px-2 py-1 bg-white border border-gray-300 rounded text-xs font-mono">→</kbd>
                {' '}Next{' '}
                <kbd className="px-2 py-1 bg-white border border-gray-300 rounded text-xs font-mono">M</kbd>
                {' '}Toggle menu
              </p>
            </div>
          </article>
        </div>
      </div>
    </div>
  );
}
