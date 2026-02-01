'use client';

import { useState, useEffect, useCallback, Component, ReactNode } from 'react';
import { analytics } from '@/lib/analytics';
import { generateCoursePDF } from '@/lib/generateCoursePDF';
import MermaidDiagram from './MermaidDiagram';
import ContextMenu, { ContextMenuItem, Icons } from './ContextMenu';
import { ProgressTable } from './ProgressTable';
import { KnowledgeGraph } from './KnowledgeGraph';
import { useProgressTracking, loadProgressFromStorage, saveProgressToStorage } from '@/hooks/useProgressTracking';
import { EmptyState } from './EmptyState';
import type { ViewerCourse, ContextMenuState, ContextMenuType } from '@/lib/types';

interface CourseViewerProps {
  course: ViewerCourse;
  onExit?: () => void;
}

// Error Boundary for CourseViewer component
interface ErrorBoundaryProps {
  children: ReactNode;
  onReset?: () => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

class CourseViewerErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('CourseViewer error:', error, errorInfo);
    analytics.track('course_viewer_error', {
      error: error.message,
      componentStack: errorInfo.componentStack?.slice(0, 500)
    });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined });
    this.props.onReset?.();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'linear-gradient(135deg, #e8f0f9 0%, #ffffff 100%)' }}>
          <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="w-16 h-16 mx-auto mb-6 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)' }}>
              <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-3 font-serif">Course Display Error</h2>
            <p className="text-gray-600 mb-6">
              We had trouble displaying this course. Don't worry, your progress is saved.
            </p>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <div className="mb-6 p-4 bg-red-50 rounded-xl text-left">
                <p className="text-xs text-red-700 font-mono break-all">
                  {this.state.error.message}
                </p>
              </div>
            )}

            <div className="flex flex-col gap-3">
              <button
                onClick={this.handleReset}
                className="w-full py-3 rounded-xl font-semibold text-white transition-all shadow-lg hover:shadow-xl"
                style={{ backgroundColor: 'var(--royal-blue)' }}
              >
                Try Again
              </button>
              <button
                onClick={() => window.location.reload()}
                className="w-full py-3 rounded-xl font-medium text-gray-600 hover:text-gray-900 transition-all"
                style={{ backgroundColor: 'rgba(0, 63, 135, 0.05)' }}
              >
                Reload Page
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Export a wrapper component that includes error boundary
export function CourseViewerWithErrorBoundary({ course, onExit }: CourseViewerProps) {
  return (
    <CourseViewerErrorBoundary onReset={() => window.location.reload()}>
      <CourseViewerContent course={course} onExit={onExit} />
    </CourseViewerErrorBoundary>
  );
}

// Helper function to parse content and extract mermaid diagrams
function parseContent(content: string) {
  const parts: Array<{ type: 'text' | 'mermaid'; content: string }> = [];
  const mermaidRegex = /```mermaid\n([\s\S]*?)```/g;
  let lastIndex = 0;
  let match;

  while ((match = mermaidRegex.exec(content)) !== null) {
    // Add text before mermaid block
    if (match.index > lastIndex) {
      const textContent = content.substring(lastIndex, match.index);
      if (textContent.trim()) {
        parts.push({ type: 'text', content: textContent });
      }
    }

    // Add mermaid block
    parts.push({ type: 'mermaid', content: match[1].trim() });
    lastIndex = match.index + match[0].length;
  }

  // Add remaining text
  if (lastIndex < content.length) {
    const remaining = content.substring(lastIndex);
    if (remaining.trim()) {
      parts.push({ type: 'text', content: remaining });
    }
  }

  // If no mermaid blocks found, return the whole content as text
  if (parts.length === 0) {
    parts.push({ type: 'text', content });
  }

  return parts;
}

// Format text content with proper typography and structure
function formatTextContent(text: string): string {
  // Split into paragraphs (double newline or single newline followed by empty-ish content)
  const paragraphs = text.split(/\n\n+/).filter(p => p.trim());

  return paragraphs.map(para => {
    let formatted = para.trim();

    // Handle headers (### Header -> h4, ## Header -> h3)
    if (formatted.startsWith('### ')) {
      const headerText = formatted.slice(4);
      return `<h4 class="text-lg font-bold text-gray-900 mt-8 mb-3 font-serif">${escapeHtml(headerText)}</h4>`;
    }
    if (formatted.startsWith('## ')) {
      const headerText = formatted.slice(3);
      return `<h3 class="text-xl font-bold text-gray-900 mt-10 mb-4 font-serif">${escapeHtml(headerText)}</h3>`;
    }

    // Handle bullet lists (lines starting with - or *)
    const lines = formatted.split('\n');
    const isList = lines.every(line => /^[\-\*]\s/.test(line.trim()) || line.trim() === '');
    if (isList && lines.some(line => /^[\-\*]\s/.test(line.trim()))) {
      const listItems = lines
        .filter(line => /^[\-\*]\s/.test(line.trim()))
        .map(line => `<li class="mb-2">${formatInlineText(line.replace(/^[\-\*]\s/, '').trim())}</li>`)
        .join('');
      return `<ul class="list-disc pl-6 my-4 space-y-1 text-gray-700">${listItems}</ul>`;
    }

    // Handle numbered lists (lines starting with 1. 2. etc)
    const isNumberedList = lines.every(line => /^\d+\.\s/.test(line.trim()) || line.trim() === '');
    if (isNumberedList && lines.some(line => /^\d+\.\s/.test(line.trim()))) {
      const listItems = lines
        .filter(line => /^\d+\.\s/.test(line.trim()))
        .map(line => `<li class="mb-2">${formatInlineText(line.replace(/^\d+\.\s/, '').trim())}</li>`)
        .join('');
      return `<ol class="list-decimal pl-6 my-4 space-y-1 text-gray-700">${listItems}</ol>`;
    }

    // Handle definition-style content (Term: Definition)
    if (/^[A-Z][^:]+:/.test(formatted) && formatted.includes(':')) {
      const colonIndex = formatted.indexOf(':');
      const term = formatted.slice(0, colonIndex);
      const definition = formatted.slice(colonIndex + 1).trim();
      // Handle multi-line definitions
      const formattedDef = definition.split('\n').map(line => formatInlineText(line.trim())).join('<br/>');
      return `<p class="my-4"><strong class="font-semibold text-gray-900">${escapeHtml(term)}:</strong> <span class="text-gray-700">${formattedDef}</span></p>`;
    }

    // Regular paragraph - handle inline newlines as soft breaks
    const formattedPara = formatted.split('\n').map(line => formatInlineText(line.trim())).join('<br/>');
    return `<p class="my-4 text-gray-700 leading-relaxed">${formattedPara}</p>`;
  }).join('');
}

// Format inline text (bold, italic, code)
function formatInlineText(text: string): string {
  let result = escapeHtml(text);
  // Bold: **text** or __text__
  result = result.replace(/\*\*([^*]+)\*\*/g, '<strong class="font-semibold text-gray-900">$1</strong>');
  result = result.replace(/__([^_]+)__/g, '<strong class="font-semibold text-gray-900">$1</strong>');
  // Italic: *text* or _text_
  result = result.replace(/\*([^*]+)\*/g, '<em class="italic">$1</em>');
  result = result.replace(/_([^_]+)_/g, '<em class="italic">$1</em>');
  // Inline code: `code`
  result = result.replace(/`([^`]+)`/g, '<code class="px-1.5 py-0.5 rounded text-sm font-mono" style="background-color: rgba(0, 63, 135, 0.08); color: var(--royal-blue-dark);">$1</code>');
  return result;
}

// Escape HTML to prevent XSS
function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// Interactive Quiz Section with answer tracking
interface QuizSectionProps {
  quiz: { question: string; answer?: string };
  lessonKey: string;
  previousAttempt?: boolean;
  onAttempt: (passed: boolean) => void;
  onContextMenu: (e: React.MouseEvent) => void;
}

function QuizSection({ quiz, lessonKey, previousAttempt, onAttempt, onContextMenu }: QuizSectionProps) {
  const [showAnswer, setShowAnswer] = useState(false);
  const [hasAnswered, setHasAnswered] = useState(previousAttempt !== undefined);

  // Reset state when lesson changes
  useEffect(() => {
    setShowAnswer(previousAttempt !== undefined);
    setHasAnswered(previousAttempt !== undefined);
  }, [lessonKey, previousAttempt]);

  const handleRevealAnswer = () => {
    setShowAnswer(true);
  };

  const handleSelfAssess = (gotItRight: boolean) => {
    setHasAnswered(true);
    onAttempt(gotItRight);
  };

  return (
    <div
      key={`quiz-${lessonKey}`}
      className="p-8 rounded-xl mb-16 group relative transition-all duration-200 hover:shadow-md"
      style={{
        backgroundColor: previousAttempt === true
          ? 'rgba(34, 197, 94, 0.06)'
          : previousAttempt === false
            ? 'rgba(239, 68, 68, 0.06)'
            : 'rgba(0, 63, 135, 0.04)',
        border: previousAttempt === true
          ? '1px solid rgba(34, 197, 94, 0.2)'
          : previousAttempt === false
            ? '1px solid rgba(239, 68, 68, 0.2)'
            : '1px solid rgba(0, 63, 135, 0.12)'
      }}
      onContextMenu={onContextMenu}
    >
      <div className="flex items-start gap-3">
        <svg
          className="w-6 h-6 flex-shrink-0 mt-1"
          style={{
            color: previousAttempt === true
              ? 'rgb(34, 197, 94)'
              : previousAttempt === false
                ? 'rgb(239, 68, 68)'
                : 'var(--royal-blue)'
          }}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          {previousAttempt === true ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          ) : previousAttempt === false ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          )}
        </svg>
        <div className="w-full">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-lg font-bold text-gray-900">Quick Check</h3>
            {previousAttempt !== undefined && (
              <span
                className="text-xs font-medium px-2 py-0.5 rounded-full"
                style={{
                  backgroundColor: previousAttempt ? 'rgba(34, 197, 94, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                  color: previousAttempt ? 'rgb(22, 163, 74)' : 'rgb(220, 38, 38)'
                }}
              >
                {previousAttempt ? 'Mastered' : 'Review needed'}
              </span>
            )}
          </div>
          <p className="text-base text-gray-700 font-medium mb-4">{quiz.question}</p>

          {!showAnswer && !hasAnswered && (
            <button
              onClick={handleRevealAnswer}
              className="text-sm font-semibold px-4 py-2 rounded-lg transition-all hover:shadow-sm"
              style={{
                backgroundColor: 'rgba(0, 63, 135, 0.08)',
                color: 'var(--royal-blue)'
              }}
            >
              Think about it, then reveal answer
            </button>
          )}

          {showAnswer && quiz.answer && (
            <div className="mt-4">
              <p className="text-sm text-gray-700 pl-4 border-l-2 mb-4" style={{ borderColor: 'var(--royal-blue)' }}>
                {quiz.answer}
              </p>

              {!hasAnswered && (
                <div className="flex gap-3 mt-4">
                  <p className="text-sm text-gray-600 mr-2">Did you get it right?</p>
                  <button
                    onClick={() => handleSelfAssess(true)}
                    className="text-sm font-medium px-4 py-1.5 rounded-lg transition-all"
                    style={{
                      backgroundColor: 'rgba(34, 197, 94, 0.1)',
                      color: 'rgb(22, 163, 74)'
                    }}
                  >
                    Yes, got it!
                  </button>
                  <button
                    onClick={() => handleSelfAssess(false)}
                    className="text-sm font-medium px-4 py-1.5 rounded-lg transition-all"
                    style={{
                      backgroundColor: 'rgba(239, 68, 68, 0.1)',
                      color: 'rgb(220, 38, 38)'
                    }}
                  >
                    Not quite
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function CourseViewerContent({ course, onExit }: CourseViewerProps) {
  const [currentModule, setCurrentModule] = useState(0);
  const [currentLesson, setCurrentLesson] = useState(0);
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(new Set());
  const [quizAttempts, setQuizAttempts] = useState<Map<string, boolean>>(new Map());
  const [showNav, setShowNav] = useState(true);
  const [viewMode, setViewMode] = useState<'outline' | 'graph'>('outline');
  const [showMobileGraph, setShowMobileGraph] = useState(false);
  // Animation states
  const [lessonTransition, setLessonTransition] = useState<'idle' | 'slide-left' | 'slide-right'>('idle');
  const [showMasteryCelebration, setShowMasteryCelebration] = useState(false);
  // Context menu state
  const [contextMenu, setContextMenu] = useState<ContextMenuState | null>(null);
  // PDF download state
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  // Check if course has valid content
  const hasValidCourse = course && course.modules && course.modules.length > 0;

  // Progress tracking hook - must be called unconditionally (before any early returns)
  const { moduleProgress, overallProgress, lessonsMastered, totalLessons } = useProgressTracking(
    hasValidCourse ? { content: { modules: course.modules } } : null,
    completedLessons,
    quizAttempts
  );

  useEffect(() => {
    // Load progress from localStorage (including quiz attempts)
    if (hasValidCourse && course.id) {
      const savedProgress = loadProgressFromStorage(course.id);
      setCompletedLessons(savedProgress.completed);
      setQuizAttempts(savedProgress.quizAttempts);
    }

    // Read URL params for deep linking
    if (typeof window !== 'undefined' && hasValidCourse) {
      const params = new URLSearchParams(window.location.search);
      const moduleParam = params.get('module');
      const lessonParam = params.get('lesson');

      if (moduleParam) {
        const moduleIndex = parseInt(moduleParam, 10) - 1;
        if (moduleIndex >= 0 && moduleIndex < course.modules.length) {
          setCurrentModule(moduleIndex);
        }
      }

      if (lessonParam) {
        const lessonIndex = parseInt(lessonParam, 10) - 1;
        const moduleIndex = moduleParam ? parseInt(moduleParam, 10) - 1 : 0;
        const moduleToCheck = course.modules[moduleIndex];
        if (lessonIndex >= 0 && moduleToCheck?.lessons && lessonIndex < moduleToCheck.lessons.length) {
          setCurrentLesson(lessonIndex);
        }
      }
    }
  }, [course?.id, course?.modules, hasValidCourse]);

  // Handle empty course - show empty state (after all hooks)
  if (!hasValidCourse) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #e8f0f9 0%, #ffffff 100%)' }}>
        <EmptyState
          type="no-modules"
          title="Course Not Available"
          description="This course doesn't have any content yet. Please try generating it again."
          action={onExit ? {
            label: 'Go Back',
            onClick: onExit
          } : undefined}
        />
      </div>
    );
  }

  useEffect(() => {
    // Save progress (including quiz attempts)
    if (course.id) {
      saveProgressToStorage(course.id, completedLessons, quizAttempts, currentModule, currentLesson);
    }

    // Update URL with current position
    const url = new URL(window.location.href);
    url.searchParams.set('module', String(currentModule + 1));
    url.searchParams.set('lesson', String(currentLesson + 1));
    window.history.replaceState({}, '', url.toString());
  }, [completedLessons, quizAttempts, currentModule, currentLesson, course.id]);

  useEffect(() => {
    // Keyboard shortcuts
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        handlePrevious();
      } else if (e.key === 'm') {
        setShowNav(!showNav);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentModule, currentLesson, showNav]);

  const handleLessonComplete = () => {
    const lessonKey = `${currentModule}-${currentLesson}`;
    const newCompleted = new Set(completedLessons);
    newCompleted.add(lessonKey);
    setCompletedLessons(newCompleted);

    analytics.track('lesson_completed', {
      courseId: course.id,
      moduleIndex: currentModule,
      lessonIndex: currentLesson
    });

    // Auto-advance
    setTimeout(() => handleNext(), 500);
  };

  const handleNext = () => {
    const module = course.modules[currentModule];
    const lessons = module.lessons || [];

    // Start transition animation
    setLessonTransition('slide-left');

    setTimeout(() => {
      if (currentLesson < lessons.length - 1) {
        setCurrentLesson(currentLesson + 1);
      } else if (currentModule < course.modules.length - 1) {
        setCurrentModule(currentModule + 1);
        setCurrentLesson(0);
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });

      // Reset transition after navigation
      setTimeout(() => setLessonTransition('idle'), 50);
    }, 150);
  };

  const handlePrevious = () => {
    // Start transition animation
    setLessonTransition('slide-right');

    setTimeout(() => {
      if (currentLesson > 0) {
        setCurrentLesson(currentLesson - 1);
      } else if (currentModule > 0) {
        const prevModule = course.modules[currentModule - 1];
        const prevLessons = prevModule.lessons || [];
        setCurrentModule(currentModule - 1);
        setCurrentLesson(Math.max(0, prevLessons.length - 1));
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });

      // Reset transition after navigation
      setTimeout(() => setLessonTransition('idle'), 50);
    }, 150);
  };

  const handleDownloadPDF = async () => {
    if (isGeneratingPDF) return;

    setIsGeneratingPDF(true);
    analytics.track('pdf_download', { courseId: course.id });

    try {
      await generateCoursePDF(course);
      analytics.track('pdf_download_success', { courseId: course.id });
    } catch (error) {
      console.error('PDF generation error:', error);
      alert('Failed to generate PDF. Please try again.');
      analytics.track('pdf_download_error', { courseId: course.id, error: String(error) });
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  // Handle quiz answer submission
  const handleQuizAnswer = (lessonKey: string, isCorrect: boolean) => {
    const newAttempts = new Map(quizAttempts);
    newAttempts.set(lessonKey, isCorrect);
    setQuizAttempts(newAttempts);

    analytics.track('quiz_attempted', {
      courseId: course.id,
      lessonKey,
      isCorrect
    });
  };

  // Context menu handlers
  const handleContextMenu = useCallback((
    e: React.MouseEvent,
    type: ContextMenuType,
    data?: string
  ) => {
    e.preventDefault();
    e.stopPropagation();
    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      type,
      data
    });
  }, []);

  const closeContextMenu = useCallback(() => {
    setContextMenu(null);
  }, []);

  // Generate context menu items based on type
  const getContextMenuItems = (): ContextMenuItem[] => {
    if (!contextMenu) return [];

    const lessonKey = `${currentModule}-${currentLesson}`;
    const isLessonCompleted = completedLessons.has(lessonKey);

    const baseItems: ContextMenuItem[] = [];

    // Lesson-specific items
    if (contextMenu.type === 'lesson' || contextMenu.type === 'text') {
      if (!isLessonCompleted) {
        baseItems.push({
          label: 'Mark as Complete',
          icon: <Icons.Check />,
          onClick: handleLessonComplete
        });
      } else {
        baseItems.push({
          label: 'Mark as Incomplete',
          icon: <Icons.Reset />,
          onClick: () => {
            const newCompleted = new Set(completedLessons);
            newCompleted.delete(lessonKey);
            setCompletedLessons(newCompleted);
          }
        });
      }
      baseItems.push({ label: '', onClick: () => {}, divider: true });
    }

    // Diagram-specific items
    if (contextMenu.type === 'diagram') {
      baseItems.push({
        label: 'Expand Diagram',
        icon: <Icons.Expand />,
        onClick: () => {
          // TODO: Implement diagram modal view
          alert('Full-screen diagram view coming soon!');
        }
      });
      baseItems.push({ label: '', onClick: () => {}, divider: true });
    }

    // Universal items
    baseItems.push({
      label: 'Ask about this',
      icon: <Icons.Chat />,
      onClick: () => {
        analytics.track('context_menu_ask', { type: contextMenu.type });
        alert('AI Chat feature coming in v2! You\'ll be able to ask questions about any content.');
      }
    });

    baseItems.push({
      label: 'Copy Content',
      icon: <Icons.Copy />,
      onClick: async () => {
        const lesson = course.modules[currentModule]?.lessons?.[currentLesson];
        if (lesson) {
          await navigator.clipboard.writeText(lesson.content);
          analytics.track('content_copied', { lessonKey });
        }
      }
    });

    baseItems.push({
      label: 'Bookmark',
      icon: <Icons.Bookmark />,
      onClick: () => {
        analytics.track('content_bookmarked', { lessonKey });
        alert('Bookmark feature coming soon!');
      },
      disabled: true
    });

    baseItems.push({ label: '', onClick: () => {}, divider: true });

    baseItems.push({
      label: 'Share Lesson',
      icon: <Icons.Share />,
      onClick: async () => {
        const url = window.location.href;
        await navigator.clipboard.writeText(url);
        alert('Lesson URL copied to clipboard!');
        analytics.track('lesson_shared', { lessonKey });
      }
    });

    return baseItems;
  };

  const module = course.modules[currentModule];
  const lesson = module.lessons?.[currentLesson];
  const lessonKey = `${currentModule}-${currentLesson}`;
  const isCompleted = completedLessons.has(lessonKey);

  // Progress comes from the hook (hybrid: viewing + quiz mastery)
  const completedCount = completedLessons.size;
  const progress = overallProgress;

  const isLastLesson = currentModule === course.modules.length - 1 &&
                       currentLesson === (module.lessons?.length || 1) - 1;

  return (
    <div
      className="min-h-screen course-viewer-cursor"
      style={{ background: 'linear-gradient(135deg, #e8f0f9 0%, #ffffff 100%)' }}
      onContextMenu={(e) => {
        // Show custom menu everywhere unless clicking on specific nested areas
        const target = e.target as HTMLElement;
        if (!target.closest('[data-context-type]')) {
          handleContextMenu(e, 'lesson');
        }
      }}
    >
      {/* Premium Header */}
      <header className="sticky top-0 z-20 bg-white/95 backdrop-blur-sm border-b shadow-sm" style={{ borderColor: 'rgba(0, 63, 135, 0.1)' }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 sm:py-5">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 sm:gap-4 min-w-0">
              {onExit && (
                <button
                  onClick={onExit}
                  className="text-gray-500 hover:text-gray-900 transition-colors p-1 flex-shrink-0"
                  title="Exit course"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                </button>
              )}

              <div className="min-w-0">
                <h1 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 font-serif truncate">{course.title}</h1>
                <div className="flex items-center gap-2 sm:gap-3 mt-0.5 sm:mt-1">
                  <p className="text-xs sm:text-sm text-gray-600 whitespace-nowrap">
                    Module {currentModule + 1}/{course.modules.length}
                  </p>
                  {course.estimated_time && (
                    <>
                      <span className="text-gray-300 hidden sm:inline">•</span>
                      <p className="text-xs sm:text-sm text-gray-600 hidden sm:block">{course.estimated_time}</p>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* Progress bar - responsive width */}
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-16 sm:w-24 md:w-40 h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-2 transition-all duration-500 rounded-full"
                    style={{
                      width: `${progress}%`,
                      backgroundColor: 'var(--royal-blue)'
                    }}
                  />
                </div>
                <span className="text-xs sm:text-sm font-medium" style={{ color: 'var(--royal-blue)' }}>
                  {Math.round(progress)}%
                </span>
              </div>

              {/* Mobile Knowledge Graph button */}
              <button
                onClick={() => setShowMobileGraph(true)}
                className="lg:hidden flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg transition-all"
                style={{
                  backgroundColor: 'rgba(0, 63, 135, 0.08)',
                  color: 'var(--royal-blue)'
                }}
                title="View Knowledge Graph"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
                <span className="hidden sm:inline">Graph</span>
              </button>

              {/* Download PDF - icon only on mobile */}
              <button
                onClick={handleDownloadPDF}
                disabled={isGeneratingPDF}
                className="flex items-center gap-2 px-2 sm:px-4 py-2 text-sm font-medium rounded-lg transition-all hover:bg-gray-50 disabled:opacity-50 disabled:cursor-wait"
                style={{ color: 'var(--royal-blue)' }}
                title={isGeneratingPDF ? 'Generating PDF...' : 'Download PDF'}
              >
                {isGeneratingPDF ? (
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                )}
                <span className="hidden sm:inline">{isGeneratingPDF ? 'Generating...' : 'Download'}</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex max-w-7xl mx-auto">
        {/* Elegant Sidebar */}
        {showNav && (
          <aside className="w-80 min-h-screen sticky top-[89px] hidden lg:block border-r" style={{ borderColor: 'rgba(0, 63, 135, 0.08)' }}>
            <div className="p-8">
              {/* Progress Summary */}
              <div className="mb-8 p-6 rounded-xl bg-white/50" style={{ border: '1px solid rgba(0, 63, 135, 0.1)' }}>
                <h3 className="text-xs font-bold uppercase tracking-wider mb-4" style={{ color: 'var(--royal-blue)' }}>
                  Course Progress
                </h3>
                
                {/* Circular Progress */}
                <div className="flex items-center gap-6 mb-4">
                  <div className="relative w-20 h-20">
                    <svg className="transform -rotate-90 w-20 h-20">
                      <circle
                        cx="40"
                        cy="40"
                        r="32"
                        stroke="rgba(0, 63, 135, 0.1)"
                        strokeWidth="8"
                        fill="none"
                      />
                      <circle
                        cx="40"
                        cy="40"
                        r="32"
                        stroke="var(--royal-blue)"
                        strokeWidth="8"
                        fill="none"
                        strokeDasharray={`${2 * Math.PI * 32}`}
                        strokeDashoffset={`${2 * Math.PI * 32 * (1 - progress / 100)}`}
                        strokeLinecap="round"
                        style={{ transition: 'stroke-dashoffset 0.5s ease' }}
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-xl font-bold" style={{ color: 'var(--royal-blue)' }}>
                        {Math.round(progress)}%
                      </span>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-2xl font-bold text-gray-900">
                      {completedCount}/{totalLessons}
                    </p>
                    <p className="text-sm text-gray-600">
                      lessons complete
                    </p>
                  </div>
                </div>

                {/* Estimated time remaining */}
                {course.estimated_time && (
                  <p className="text-xs text-gray-500">
                    ⏱️ {course.estimated_time} total
                  </p>
                )}
              </div>

              {/* Module Progress Breakdown */}
              {moduleProgress.length > 0 && (
                <ProgressTable
                  moduleProgress={moduleProgress}
                  overallProgress={overallProgress}
                  lessonsMastered={lessonsMastered}
                  totalLessons={totalLessons}
                />
              )}

              {/* Divider */}
              <div className="mb-6 border-t" style={{ borderColor: 'rgba(0, 63, 135, 0.08)' }}></div>

              {/* View Toggle */}
              <div className="flex gap-2 mb-6">
                <button
                  onClick={() => setViewMode('outline')}
                  className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold rounded-lg transition-all ${
                    viewMode === 'outline' ? 'text-white' : 'text-gray-600 hover:text-gray-900'
                  }`}
                  style={{
                    backgroundColor: viewMode === 'outline' ? 'var(--royal-blue)' : 'rgba(0, 63, 135, 0.05)',
                  }}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                  </svg>
                  Outline
                </button>
                <button
                  onClick={() => setViewMode('graph')}
                  className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold rounded-lg transition-all ${
                    viewMode === 'graph' ? 'text-white' : 'text-gray-600 hover:text-gray-900'
                  }`}
                  style={{
                    backgroundColor: viewMode === 'graph' ? 'var(--royal-blue)' : 'rgba(0, 63, 135, 0.05)',
                  }}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                  Graph
                </button>
              </div>

              {/* Conditional View: Outline or Graph */}
              {viewMode === 'outline' ? (
                <nav className="space-y-6">
                  {course.modules.map((mod, modIdx) => {
                    const lessons = mod.lessons || [];
                    return (
                      <div key={modIdx}>
                        <h4 className="text-sm font-bold text-gray-900 mb-3 font-serif">
                          {modIdx + 1}. {mod.title}
                        </h4>
                        <div className="space-y-1 ml-3 border-l" style={{ borderColor: 'rgba(0, 63, 135, 0.12)' }}>
                          {lessons.map((les, lesIdx) => {
                            const key = `${modIdx}-${lesIdx}`;
                            const isActive = modIdx === currentModule && lesIdx === currentLesson;
                            const isDone = completedLessons.has(key);

                            return (
                              <button
                                key={lesIdx}
                                onClick={() => {
                                  setCurrentModule(modIdx);
                                  setCurrentLesson(lesIdx);
                                }}
                                className={`
                                  w-full text-left px-4 py-2 text-sm transition-all rounded-r-lg -ml-px
                                  ${isActive
                                    ? 'font-medium'
                                    : 'text-gray-600 hover:text-gray-900'
                                  }
                                `}
                                style={{
                                  color: isActive ? 'var(--royal-blue)' : undefined,
                                  backgroundColor: isActive ? 'rgba(0, 63, 135, 0.08)' : undefined,
                                  borderLeft: isActive ? '2px solid var(--royal-blue)' : undefined
                                }}
                              >
                                <div className="flex items-center gap-2">
                                  {isDone && (
                                    <svg className="w-4 h-4 text-green-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                  )}
                                  <span className="line-clamp-2">{les.title}</span>
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </nav>
              ) : (
                <KnowledgeGraph
                  course={course}
                  completedLessons={completedLessons}
                  quizAttempts={quizAttempts}
                  currentLesson={lessonKey}
                  onLessonClick={(modIdx, lesIdx) => {
                    setCurrentModule(modIdx);
                    setCurrentLesson(lesIdx);
                  }}
                />
              )}
            </div>
          </aside>
        )}

        {/* Premium Main Content */}
        <main className="flex-1 min-h-screen">
          <article className="max-w-3xl mx-auto px-4 sm:px-6 md:px-8 py-8 sm:py-12 md:py-16">
            {/* Module badge */}
            <div className="mb-6">
              <span 
                className="inline-block px-3 py-1 text-xs font-semibold rounded-full border"
                style={{ 
                  backgroundColor: 'rgba(0, 63, 135, 0.05)',
                  borderColor: 'rgba(0, 63, 135, 0.15)',
                  color: 'var(--royal-blue)'
                }}
              >
                Module {currentModule + 1}: {module.title}
              </span>
            </div>

            {/* Lesson Title */}
            {lesson && (
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 sm:mb-8 leading-tight font-serif">
                {lesson.title}
              </h2>
            )}

            {/* Lesson Content */}
            {lesson && (
              <div
                className="lesson-prose max-w-none mb-16"
                style={{
                  fontSize: '1.125rem',
                  lineHeight: '1.875',
                }}
                onContextMenu={(e) => handleContextMenu(e, 'lesson')}
              >
                {parseContent(lesson.content).map((part, idx) => {
                  if (part.type === 'mermaid') {
                    return (
                      <div
                        key={idx}
                        className="group relative my-8 cursor-pointer"
                        onContextMenu={(e) => handleContextMenu(e, 'diagram', part.content)}
                      >
                        {/* Hover overlay for diagrams */}
                        <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10"
                          style={{
                            background: 'linear-gradient(135deg, rgba(0, 63, 135, 0.02) 0%, rgba(0, 63, 135, 0.04) 100%)',
                            border: '2px solid rgba(0, 63, 135, 0.15)'
                          }}
                        />
                        {/* Interaction hint */}
                        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-20">
                          <div
                            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium"
                            style={{
                              backgroundColor: 'rgba(255, 255, 255, 0.95)',
                              color: 'var(--royal-blue)',
                              border: '1px solid rgba(0, 63, 135, 0.15)',
                              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)'
                            }}
                          >
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                            </svg>
                            Right-click for options
                          </div>
                        </div>
                        <MermaidDiagram chart={part.content} />
                      </div>
                    );
                  }
                  return (
                    <div
                      key={idx}
                      className="lesson-content group relative"
                      onContextMenu={(e) => handleContextMenu(e, 'text')}
                    >
                      {/* Subtle left border on hover */}
                      <div
                        className="absolute -left-6 top-0 bottom-0 w-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                        style={{ backgroundColor: 'rgba(0, 63, 135, 0.15)' }}
                      />
                      <div dangerouslySetInnerHTML={{ __html: formatTextContent(part.content) }} />
                    </div>
                  );
                })}
              </div>
            )}

            {/* Quiz Section */}
            {lesson?.quiz && (
              <QuizSection
                quiz={lesson.quiz}
                lessonKey={lessonKey}
                previousAttempt={quizAttempts.get(lessonKey)}
                onAttempt={(passed) => handleQuizAnswer(lessonKey, passed)}
                onContextMenu={(e) => handleContextMenu(e, 'quiz')}
              />
            )}

            {/* Completion Status */}
            {isCompleted && (
              <div 
                className="flex items-center gap-3 p-4 rounded-xl mb-8"
                style={{ 
                  backgroundColor: 'rgba(34, 197, 94, 0.08)',
                  border: '1px solid rgba(34, 197, 94, 0.2)'
                }}
              >
                <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-sm font-medium text-green-700">
                  Lesson completed
                </span>
              </div>
            )}

            {/* Navigation Actions */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-12 border-t" style={{ borderColor: 'rgba(0, 63, 135, 0.1)' }}>
              <div>
                {!isCompleted && (
                  <button
                    onClick={handleLessonComplete}
                    className="px-6 py-3 rounded-xl font-semibold text-white transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
                    style={{ backgroundColor: 'var(--royal-blue)' }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--royal-blue-light)')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'var(--royal-blue)')}
                  >
                    Mark Complete
                  </button>
                )}
              </div>

              <div className="flex gap-3">
                {(currentModule > 0 || currentLesson > 0) && (
                  <button
                    onClick={handlePrevious}
                    className="flex items-center gap-2 px-5 py-3 border-2 rounded-xl font-medium transition-all hover:shadow-md"
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
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Previous
                  </button>
                )}
                
                {!isLastLesson && (
                  <button
                    onClick={handleNext}
                    className="flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-white transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
                    style={{ backgroundColor: 'var(--royal-blue)' }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--royal-blue-light)')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'var(--royal-blue)')}
                  >
                    Next Lesson
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                )}

                {isLastLesson && isCompleted && (
                  <div 
                    className="px-6 py-3 rounded-xl border-2"
                    style={{ 
                      backgroundColor: 'rgba(34, 197, 94, 0.1)',
                      borderColor: 'rgba(34, 197, 94, 0.3)'
                    }}
                  >
                    <p className="text-green-700 font-semibold flex items-center gap-2">
                      <span className="text-xl">🎉</span>
                      Course Completed!
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Next Steps Section */}
            {isLastLesson && course.next_steps && course.next_steps.length > 0 && (
              <div className="mt-16 p-8 rounded-xl" style={{ backgroundColor: 'rgba(0, 63, 135, 0.04)', border: '1px solid rgba(0, 63, 135, 0.12)' }}>
                <h3 className="text-2xl font-bold text-gray-900 mb-6 font-serif">Next Steps</h3>
                <ul className="space-y-4">
                  {course.next_steps.map((step, idx) => (
                    <li key={idx} className="flex gap-4">
                      <span 
                        className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold text-white"
                        style={{ backgroundColor: 'var(--royal-blue)' }}
                      >
                        {idx + 1}
                      </span>
                      <span className="text-gray-700 text-lg">{step}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Keyboard shortcuts */}
            <div className="mt-12 p-6 rounded-xl border" style={{ backgroundColor: 'rgba(255, 255, 255, 0.6)', borderColor: 'rgba(0, 63, 135, 0.08)' }}>
              <p className="text-xs text-gray-500 text-center flex items-center justify-center gap-4 flex-wrap">
                <span className="flex items-center gap-2">
                  <kbd className="px-3 py-1 bg-white border rounded text-xs font-mono" style={{ borderColor: 'var(--royal-blue)' }}>←</kbd>
                  Previous
                </span>
                <span className="flex items-center gap-2">
                  <kbd className="px-3 py-1 bg-white border rounded text-xs font-mono" style={{ borderColor: 'var(--royal-blue)' }}>→</kbd>
                  Next
                </span>
                <span className="flex items-center gap-2">
                  <kbd className="px-3 py-1 bg-white border rounded text-xs font-mono" style={{ borderColor: 'var(--royal-blue)' }}>M</kbd>
                  Menu
                </span>
                <span className="flex items-center gap-2 border-l pl-4 ml-2" style={{ borderColor: 'rgba(0, 63, 135, 0.15)' }}>
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                  </svg>
                  Right-click for options
                </span>
              </p>
            </div>
          </article>
        </main>
      </div>

      {/* Custom Context Menu */}
      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          items={getContextMenuItems()}
          onClose={closeContextMenu}
          context={{ type: contextMenu.type, data: contextMenu.data }}
        />
      )}

      {/* Mobile Knowledge Graph Modal */}
      {showMobileGraph && (
        <div
          className="fixed inset-0 z-50 lg:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Knowledge Graph"
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowMobileGraph(false)}
          />

          {/* Modal Content */}
          <div className="absolute inset-4 sm:inset-6 md:inset-8 bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden">
            {/* Modal Header */}
            <div
              className="flex items-center justify-between px-4 sm:px-6 py-4 border-b"
              style={{ borderColor: 'rgba(0, 63, 135, 0.1)' }}
            >
              <div>
                <h3 className="text-lg font-bold text-gray-900 font-serif">Knowledge Graph</h3>
                <p className="text-sm text-gray-500 mt-0.5">
                  Tap a lesson to navigate
                </p>
              </div>
              <button
                onClick={() => setShowMobileGraph(false)}
                className="p-2 rounded-lg transition-colors hover:bg-gray-100"
                aria-label="Close"
              >
                <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Progress Summary */}
            <div
              className="px-4 sm:px-6 py-4 border-b"
              style={{ borderColor: 'rgba(0, 63, 135, 0.1)', backgroundColor: 'rgba(0, 63, 135, 0.02)' }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="relative w-14 h-14">
                    <svg className="transform -rotate-90 w-14 h-14">
                      <circle
                        cx="28"
                        cy="28"
                        r="22"
                        stroke="rgba(0, 63, 135, 0.1)"
                        strokeWidth="6"
                        fill="none"
                      />
                      <circle
                        cx="28"
                        cy="28"
                        r="22"
                        stroke="var(--royal-blue)"
                        strokeWidth="6"
                        fill="none"
                        strokeDasharray={`${2 * Math.PI * 22}`}
                        strokeDashoffset={`${2 * Math.PI * 22 * (1 - progress / 100)}`}
                        strokeLinecap="round"
                        style={{ transition: 'stroke-dashoffset 0.5s ease' }}
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-sm font-bold" style={{ color: 'var(--royal-blue)' }}>
                        {Math.round(progress)}%
                      </span>
                    </div>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-gray-900">
                      {completedCount}/{totalLessons}
                    </p>
                    <p className="text-sm text-gray-600">
                      lessons complete
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Knowledge Graph */}
            <div className="flex-1 p-4 sm:p-6 overflow-hidden">
              <KnowledgeGraph
                course={course}
                completedLessons={completedLessons}
                quizAttempts={quizAttempts}
                currentLesson={lessonKey}
                onLessonClick={(modIdx, lesIdx) => {
                  setCurrentModule(modIdx);
                  setCurrentLesson(lesIdx);
                  setShowMobileGraph(false);
                }}
                fullHeight
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Default export wraps content with error boundary
export default function CourseViewer({ course, onExit }: CourseViewerProps) {
  return (
    <CourseViewerErrorBoundary onReset={() => window.location.reload()}>
      <CourseViewerContent course={course} onExit={onExit} />
    </CourseViewerErrorBoundary>
  );
}
