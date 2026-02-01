'use client';

import { useState, useEffect, useCallback } from 'react';
import { analytics } from '@/lib/analytics';
import MermaidDiagram from './MermaidDiagram';
import ContextMenu, { ContextMenuItem, Icons } from './ContextMenu';

interface Module {
  title: string;
  description?: string;
  lessons?: Array<{
    title: string;
    content: string;
    quiz?: {
      question: string;
      answer?: string;
    };
  }>;
  content?: string;
}

interface Course {
  id?: string;
  title: string;
  description?: string;
  estimated_time?: string;
  modules: Module[];
  next_steps?: string[];
  topic?: string;
}

interface CourseViewerProps {
  course: Course;
  onExit?: () => void;
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

export default function CourseViewer({ course, onExit }: CourseViewerProps) {
  const [currentModule, setCurrentModule] = useState(0);
  const [currentLesson, setCurrentLesson] = useState(0);
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(new Set());
  const [showNav, setShowNav] = useState(true);

  // Context menu state
  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
    type: 'lesson' | 'diagram' | 'text' | 'quiz';
    data?: any;
  } | null>(null);

  useEffect(() => {
    // Load progress from localStorage
    if (course.id) {
      const saved = localStorage.getItem(`course_${course.id}`);
      if (saved) {
        const { completed } = JSON.parse(saved);
        setCompletedLessons(new Set(completed));
      }
    }
  }, [course.id]);

  useEffect(() => {
    // Save progress
    if (course.id) {
      localStorage.setItem(`course_${course.id}`, JSON.stringify({
        completed: Array.from(completedLessons),
        lastModule: currentModule,
        lastLesson: currentLesson,
        lastAccessed: new Date().toISOString()
      }));
    }

    // Update URL with current position
    const url = new URL(window.location.href);
    url.searchParams.set('module', String(currentModule + 1));
    url.searchParams.set('lesson', String(currentLesson + 1));
    window.history.replaceState({}, '', url.toString());
  }, [completedLessons, currentModule, currentLesson, course.id]);

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
    
    if (currentLesson < lessons.length - 1) {
      setCurrentLesson(currentLesson + 1);
    } else if (currentModule < course.modules.length - 1) {
      setCurrentModule(currentModule + 1);
      setCurrentLesson(0);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePrevious = () => {
    if (currentLesson > 0) {
      setCurrentLesson(currentLesson - 1);
    } else if (currentModule > 0) {
      const prevModule = course.modules[currentModule - 1];
      const prevLessons = prevModule.lessons || [];
      setCurrentModule(currentModule - 1);
      setCurrentLesson(Math.max(0, prevLessons.length - 1));
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDownloadPDF = () => {
    analytics.track('pdf_download', { courseId: course.id });
    alert('PDF download coming soon!');
  };

  // Context menu handlers
  const handleContextMenu = useCallback((
    e: React.MouseEvent,
    type: 'lesson' | 'diagram' | 'text' | 'quiz',
    data?: any
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

  // Calculate total progress
  const totalLessons = course.modules.reduce((sum, m) => sum + (m.lessons?.length || 0), 0);
  const completedCount = completedLessons.size;
  const progress = totalLessons > 0 ? (completedCount / totalLessons) * 100 : 0;

  const isLastLesson = currentModule === course.modules.length - 1 && 
                       currentLesson === (module.lessons?.length || 1) - 1;

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #e8f0f9 0%, #ffffff 100%)' }}>
      {/* Premium Header */}
      <header className="sticky top-0 z-20 bg-white/95 backdrop-blur-sm border-b shadow-sm" style={{ borderColor: 'rgba(0, 63, 135, 0.1)' }}>
        <div className="max-w-6xl mx-auto px-6 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {onExit && (
                <button
                  onClick={onExit}
                  className="text-gray-500 hover:text-gray-900 transition-colors p-1"
                  title="Exit course"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                </button>
              )}
              
              <div>
                <h1 className="text-xl font-bold text-gray-900 font-serif">{course.title}</h1>
                <div className="flex items-center gap-3 mt-1">
                  <p className="text-sm text-gray-600">
                    Module {currentModule + 1} of {course.modules.length}
                  </p>
                  {course.estimated_time && (
                    <>
                      <span className="text-gray-300">•</span>
                      <p className="text-sm text-gray-600">{course.estimated_time}</p>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* Progress bar */}
              <div className="hidden md:flex items-center gap-3">
                <div className="w-40 h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className="h-2 transition-all duration-500 rounded-full"
                    style={{ 
                      width: `${progress}%`,
                      backgroundColor: 'var(--royal-blue)'
                    }}
                  />
                </div>
                <span className="text-sm font-medium" style={{ color: 'var(--royal-blue)' }}>
                  {Math.round(progress)}%
                </span>
              </div>

              {/* Download PDF */}
              <button
                onClick={handleDownloadPDF}
                className="hidden sm:flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all hover:bg-gray-50"
                style={{ color: 'var(--royal-blue)' }}
                title="Download PDF"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Download
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

              {/* Divider */}
              <div className="mb-8 border-t" style={{ borderColor: 'rgba(0, 63, 135, 0.08)' }}></div>

              {/* Module outline header */}
              <div className="mb-6">
                <h3 className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--royal-blue)' }}>
                  Course Outline
                </h3>
              </div>
              
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
            </div>
          </aside>
        )}

        {/* Premium Main Content */}
        <main className="flex-1 min-h-screen">
          <article className="max-w-3xl mx-auto px-8 py-16">
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
              <h2 className="text-5xl font-bold text-gray-900 mb-8 leading-tight font-serif">
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
              <div
                key={`quiz-${currentModule}-${currentLesson}`}
                className="p-8 rounded-xl mb-16 group relative cursor-pointer transition-all duration-200 hover:shadow-md"
                style={{
                  backgroundColor: 'rgba(0, 63, 135, 0.04)',
                  border: '1px solid rgba(0, 63, 135, 0.12)'
                }}
                onContextMenu={(e) => handleContextMenu(e, 'quiz')}
              >
                <div className="flex items-start gap-3 mb-4">
                  <svg className="w-6 h-6 flex-shrink-0 mt-1" style={{ color: 'var(--royal-blue)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div className="w-full">
                    <h3 className="text-lg font-bold text-gray-900 mb-2">Quick Check</h3>
                    <p className="text-base text-gray-700 font-medium mb-3">{lesson.quiz.question}</p>
                    {lesson.quiz.answer && (
                      <details key={`answer-${currentModule}-${currentLesson}`} className="mt-4">
                        <summary className="text-sm font-semibold cursor-pointer hover:opacity-75 transition-opacity" style={{ color: 'var(--royal-blue)' }}>
                          View Answer
                        </summary>
                        <p className="mt-3 text-sm text-gray-700 pl-4 border-l-2" style={{ borderColor: 'var(--royal-blue)' }}>
                          {lesson.quiz.answer}
                        </p>
                      </details>
                    )}
                  </div>
                </div>
              </div>
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
    </div>
  );
}
