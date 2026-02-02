'use client';

import { useEffect, useRef, useCallback, useState } from 'react';
import { Network, Options, Data } from 'vis-network';
import type { ViewerCourse } from '@/lib/types';

interface KnowledgeGraphProps {
  course: ViewerCourse;
  completedLessons: Set<string>;
  quizAttempts: Map<string, boolean>;
  currentLesson: string;
  onLessonClick: (moduleIdx: number, lessonIdx: number) => void;
  /** When true, graph fills parent container height (for mobile modal) */
  fullHeight?: boolean;
}

// Royal blue theme colors
const COLORS = {
  royalBlue: '#003F87',
  royalBlueLight: '#0056B3',
  // Progress states
  notStarted: {
    background: '#F3F4F6',
    border: '#D1D5DB',
    font: '#6B7280',
  },
  inProgress: {
    background: '#FEF3C7',
    border: '#F59E0B',
    font: '#92400E',
  },
  mastered: {
    background: '#D1FAE5',
    border: '#10B981',
    font: '#065F46',
  },
  current: {
    border: '#003F87',
    shadow: 'rgba(0, 63, 135, 0.4)',
  },
  // Module group colors (royal blue variations)
  modules: [
    { background: 'rgba(0, 63, 135, 0.15)', border: '#003F87' },    // Royal blue
    { background: 'rgba(16, 185, 129, 0.15)', border: '#10B981' },  // Green
    { background: 'rgba(245, 158, 11, 0.15)', border: '#F59E0B' },  // Amber
    { background: 'rgba(139, 92, 246, 0.15)', border: '#8B5CF6' },  // Purple
    { background: 'rgba(236, 72, 153, 0.15)', border: '#EC4899' },  // Pink
  ],
};

function getNodeColor(
  lessonKey: string,
  completedLessons: Set<string>,
  quizAttempts: Map<string, boolean>,
  currentLesson: string
) {
  const isViewed = completedLessons.has(lessonKey);
  const quizPassed = quizAttempts.get(lessonKey);
  const isCurrent = lessonKey === currentLesson;

  let colors;
  if (quizPassed === true) {
    colors = COLORS.mastered;
  } else if (isViewed) {
    colors = COLORS.inProgress;
  } else {
    colors = COLORS.notStarted;
  }

  return {
    background: colors.background,
    border: isCurrent ? COLORS.current.border : colors.border,
    highlight: {
      background: colors.background,
      border: COLORS.royalBlue,
    },
    hover: {
      background: colors.background,
      border: COLORS.royalBlueLight,
    },
  };
}

function courseToGraph(
  course: ViewerCourse,
  completedLessons: Set<string>,
  quizAttempts: Map<string, boolean>,
  currentLesson: string
) {
  const nodes: Array<{
    id: string;
    label: string;
    group: string;
    color: ReturnType<typeof getNodeColor>;
    title: string;
    borderWidth: number;
    borderWidthSelected: number;
    font: { color: string; size: number };
  }> = [];

  const edges: Array<{
    id: string;
    from: string;
    to: string;
    dashes?: boolean;
    color?: { color: string; opacity: number };
  }> = [];

  let edgeId = 0;

  course.modules.forEach((module, modIdx) => {
    const lessons = module.lessons || [];

    lessons.forEach((lesson, lesIdx) => {
      const lessonKey = `${modIdx}-${lesIdx}`;
      const isCurrent = lessonKey === currentLesson;
      const isViewed = completedLessons.has(lessonKey);
      const quizPassed = quizAttempts.get(lessonKey);

      // Determine status text
      let statusText = 'Not started';
      if (quizPassed === true) statusText = 'Mastered';
      else if (quizPassed === false) statusText = 'Needs review';
      else if (isViewed) statusText = 'In progress';

      // Add lesson node
      nodes.push({
        id: lessonKey,
        label: lesson.title.length > 25 ? lesson.title.slice(0, 25) + '...' : lesson.title,
        group: String(modIdx),
        color: getNodeColor(lessonKey, completedLessons, quizAttempts, currentLesson),
        title: `<b>${lesson.title}</b><br/>${module.title}<br/><i>${statusText}</i>`,
        borderWidth: isCurrent ? 3 : 2,
        borderWidthSelected: 4,
        font: {
          color: quizPassed ? COLORS.mastered.font : isViewed ? COLORS.inProgress.font : COLORS.notStarted.font,
          size: 12,
        },
      });

      // Add edge to next lesson in same module
      if (lesIdx > 0) {
        edges.push({
          id: `edge-${edgeId++}`,
          from: `${modIdx}-${lesIdx - 1}`,
          to: lessonKey,
          color: { color: COLORS.modules[modIdx % COLORS.modules.length].border, opacity: 0.6 },
        });
      }
    });

    // Connect last lesson of this module to first of next module
    if (modIdx > 0 && lessons.length > 0) {
      const prevModule = course.modules[modIdx - 1];
      const prevLessons = prevModule.lessons || [];
      if (prevLessons.length > 0) {
        edges.push({
          id: `edge-${edgeId++}`,
          from: `${modIdx - 1}-${prevLessons.length - 1}`,
          to: `${modIdx}-0`,
          dashes: true,
          color: { color: '#9CA3AF', opacity: 0.5 },
        });
      }
    }
  });

  return { nodes, edges };
}

export function KnowledgeGraph({
  course,
  completedLessons,
  quizAttempts,
  currentLesson,
  onLessonClick,
  fullHeight = false,
}: KnowledgeGraphProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const networkRef = useRef<Network | null>(null);
  const prevLessonRef = useRef<string>(currentLesson);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleClick = useCallback(
    (params: { nodes: string[] }) => {
      if (params.nodes.length > 0) {
        const nodeId = params.nodes[0];
        const [modIdx, lesIdx] = nodeId.split('-').map(Number);
        onLessonClick(modIdx, lesIdx);
      }
    },
    [onLessonClick]
  );

  // Handle smooth focus transition when currentLesson changes
  useEffect(() => {
    if (networkRef.current && currentLesson !== prevLessonRef.current) {
      setIsTransitioning(true);

      // Animate focus to new lesson with smooth easing
      networkRef.current.focus(currentLesson, {
        scale: 1.3,
        animation: {
          duration: 600,
          easingFunction: 'easeInOutCubic',
        },
      });

      // Select the new node to highlight it
      networkRef.current.selectNodes([currentLesson]);

      // Reset transition state after animation
      setTimeout(() => {
        setIsTransitioning(false);
        prevLessonRef.current = currentLesson;
      }, 650);
    }
  }, [currentLesson]);

  useEffect(() => {
    if (!containerRef.current) return;

    const { nodes, edges } = courseToGraph(course, completedLessons, quizAttempts, currentLesson);

    // Build groups config from modules
    const groups: Record<string, { color: { background: string; border: string } }> = {};
    course.modules.forEach((_, idx) => {
      const moduleColor = COLORS.modules[idx % COLORS.modules.length];
      groups[String(idx)] = {
        color: {
          background: moduleColor.background,
          border: moduleColor.border,
        },
      };
    });

    const data: Data = { nodes, edges };

    const options: Options = {
      nodes: {
        shape: 'box',
        margin: { top: 10, right: 10, bottom: 10, left: 10 },
        widthConstraint: { minimum: 120, maximum: 180 },
        font: {
          face: 'system-ui, -apple-system, sans-serif',
          size: 12,
        },
        shadow: {
          enabled: true,
          color: 'rgba(0, 0, 0, 0.1)',
          size: 8,
          x: 2,
          y: 2,
        },
        chosen: {
          node: (values: { shadow: boolean; shadowSize: number; shadowColor: string }) => {
            values.shadow = true;
            values.shadowSize = 15;
            values.shadowColor = 'rgba(0, 63, 135, 0.3)';
          },
          label: false,
        } as const,
      },
      edges: {
        arrows: {
          to: { enabled: true, scaleFactor: 0.5 },
        },
        smooth: {
          enabled: true,
          type: 'cubicBezier',
          roundness: 0.5,
        },
        width: 2,
      },
      groups,
      physics: {
        enabled: true,
        solver: 'forceAtlas2Based',
        forceAtlas2Based: {
          gravitationalConstant: -50,
          centralGravity: 0.01,
          springLength: 150,
          springConstant: 0.08,
          damping: 0.4,
        },
        stabilization: {
          enabled: true,
          iterations: 200,
          updateInterval: 25,
        },
      },
      interaction: {
        hover: true,
        tooltipDelay: 100,
        zoomView: true,
        dragView: true,
        dragNodes: true,
        hoverConnectedEdges: true,
        selectConnectedEdges: true,
      },
      layout: {
        improvedLayout: true,
        hierarchical: {
          enabled: false,
        },
      },
    };

    const network = new Network(
      containerRef.current,
      data,
      options
    );

    network.on('click', handleClick);

    // Add hover effects for better feedback
    network.on('hoverNode', () => {
      if (containerRef.current) {
        containerRef.current.style.cursor = 'pointer';
      }
    });

    network.on('blurNode', () => {
      if (containerRef.current) {
        containerRef.current.style.cursor = 'default';
      }
    });

    // Focus on current lesson after stabilization with enhanced animation
    network.once('stabilizationIterationsDone', () => {
      if (currentLesson) {
        // Brief delay for smoother initial appearance
        setTimeout(() => {
          network.focus(currentLesson, {
            scale: 1.2,
            animation: {
              duration: 800,
              easingFunction: 'easeOutCubic',
            },
          });
          network.selectNodes([currentLesson]);
        }, 100);
      }
    });

    networkRef.current = network;
    prevLessonRef.current = currentLesson;

    return () => {
      network.destroy();
    };
  }, [course, completedLessons, quizAttempts, handleClick]);

  return (
    <div className={`relative ${fullHeight ? 'h-full' : ''}`}>
      {/* Transition overlay indicator */}
      <div
        className={`absolute inset-0 z-20 pointer-events-none rounded-xl transition-opacity duration-300 ${
          isTransitioning ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          background: 'radial-gradient(circle at center, rgba(0, 63, 135, 0.08) 0%, transparent 70%)',
        }}
      />

      {/* Legend */}
      <div
        className="absolute top-3 left-3 z-10 p-2 sm:p-3 rounded-lg text-xs space-y-1.5 sm:space-y-2 transition-all duration-200 hover:shadow-md"
        style={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', border: '1px solid rgba(0, 63, 135, 0.1)' }}
      >
        <div className="font-semibold text-gray-700 mb-1.5 sm:mb-2">Progress</div>
        <div className="flex items-center gap-2 transition-transform duration-200 hover:translate-x-0.5">
          <div
            className="w-3 h-3 sm:w-4 sm:h-4 rounded transition-transform duration-200"
            style={{ backgroundColor: COLORS.notStarted.background, border: `2px solid ${COLORS.notStarted.border}` }}
          />
          <span className="text-gray-600">Not started</span>
        </div>
        <div className="flex items-center gap-2 transition-transform duration-200 hover:translate-x-0.5">
          <div
            className="w-3 h-3 sm:w-4 sm:h-4 rounded transition-transform duration-200"
            style={{ backgroundColor: COLORS.inProgress.background, border: `2px solid ${COLORS.inProgress.border}` }}
          />
          <span className="text-gray-600">In progress</span>
        </div>
        <div className="flex items-center gap-2 transition-transform duration-200 hover:translate-x-0.5">
          <div
            className="w-3 h-3 sm:w-4 sm:h-4 rounded transition-transform duration-200"
            style={{ backgroundColor: COLORS.mastered.background, border: `2px solid ${COLORS.mastered.border}` }}
          />
          <span className="text-gray-600">Mastered</span>
        </div>
      </div>

      {/* Instructions */}
      <div
        className="absolute bottom-3 left-3 z-10 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg text-xs text-gray-500 transition-all duration-200 hover:bg-white"
        style={{ backgroundColor: 'rgba(255, 255, 255, 0.9)' }}
      >
        <span className="hidden sm:inline">Click a lesson to navigate</span>
        <span className="sm:hidden">Tap to navigate</span>
        <span className="hidden sm:inline"> • Scroll to zoom • Drag to pan</span>
      </div>

      {/* Graph container */}
      <div
        ref={containerRef}
        className={`w-full rounded-xl transition-all duration-300 ${fullHeight ? 'h-full' : ''}`}
        style={{
          height: fullHeight ? '100%' : '450px',
          backgroundColor: 'rgba(0, 63, 135, 0.02)',
          border: '1px solid rgba(0, 63, 135, 0.08)',
        }}
      />
    </div>
  );
}
