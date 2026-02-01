'use client';

import { useEffect, useRef, useCallback } from 'react';
import { Network, Options, Data } from 'vis-network';

interface Module {
  title: string;
  lessons?: Array<{
    title: string;
    quiz?: { question: string; answer?: string };
  }>;
}

interface Course {
  title: string;
  modules: Module[];
}

interface KnowledgeGraphProps {
  course: Course;
  completedLessons: Set<string>;
  quizAttempts: Map<string, boolean>;
  currentLesson: string;
  onLessonClick: (moduleIdx: number, lessonIdx: number) => void;
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
  course: Course,
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
}: KnowledgeGraphProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const networkRef = useRef<Network | null>(null);

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

    // Focus on current lesson after stabilization
    network.once('stabilizationIterationsDone', () => {
      if (currentLesson) {
        network.focus(currentLesson, {
          scale: 1.2,
          animation: {
            duration: 500,
            easingFunction: 'easeInOutQuad',
          },
        });
      }
    });

    networkRef.current = network;

    return () => {
      network.destroy();
    };
  }, [course, completedLessons, quizAttempts, currentLesson, handleClick]);

  return (
    <div className="relative">
      {/* Legend */}
      <div
        className="absolute top-3 left-3 z-10 p-3 rounded-lg text-xs space-y-2"
        style={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', border: '1px solid rgba(0, 63, 135, 0.1)' }}
      >
        <div className="font-semibold text-gray-700 mb-2">Progress</div>
        <div className="flex items-center gap-2">
          <div
            className="w-4 h-4 rounded"
            style={{ backgroundColor: COLORS.notStarted.background, border: `2px solid ${COLORS.notStarted.border}` }}
          />
          <span className="text-gray-600">Not started</span>
        </div>
        <div className="flex items-center gap-2">
          <div
            className="w-4 h-4 rounded"
            style={{ backgroundColor: COLORS.inProgress.background, border: `2px solid ${COLORS.inProgress.border}` }}
          />
          <span className="text-gray-600">In progress</span>
        </div>
        <div className="flex items-center gap-2">
          <div
            className="w-4 h-4 rounded"
            style={{ backgroundColor: COLORS.mastered.background, border: `2px solid ${COLORS.mastered.border}` }}
          />
          <span className="text-gray-600">Mastered</span>
        </div>
      </div>

      {/* Instructions */}
      <div
        className="absolute bottom-3 left-3 z-10 px-3 py-2 rounded-lg text-xs text-gray-500"
        style={{ backgroundColor: 'rgba(255, 255, 255, 0.9)' }}
      >
        Click a lesson to navigate • Scroll to zoom • Drag to pan
      </div>

      {/* Graph container */}
      <div
        ref={containerRef}
        className="w-full rounded-xl"
        style={{
          height: '450px',
          backgroundColor: 'rgba(0, 63, 135, 0.02)',
          border: '1px solid rgba(0, 63, 135, 0.08)',
        }}
      />
    </div>
  );
}
