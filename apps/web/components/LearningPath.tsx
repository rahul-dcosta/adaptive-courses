'use client';

/**
 * Duolingo-style vertical Learning Path
 *
 * Renders a scrollable vertical node map of all lessons in the course.
 * Nodes alternate left/right in a zigzag pattern.
 * Colors: gray (locked), pulsing blue (current), solid blue (completed), gold (100% module).
 */

interface LearningPathProps {
  modules: Array<{
    title: string;
    lessons?: Array<{ title: string }>;
  }>;
  completedLessons: Set<string>;
  currentModule: number;
  currentLesson: number;
  onNavigate: (moduleIdx: number, lessonIdx: number) => void;
}

export function LearningPath({
  modules,
  completedLessons,
  currentModule,
  currentLesson,
  onNavigate,
}: LearningPathProps) {
  // Build flat list of all lessons with their indices
  const nodes: Array<{
    moduleIdx: number;
    lessonIdx: number;
    moduleTitle: string;
    lessonTitle: string;
    key: string;
    isCompleted: boolean;
    isCurrent: boolean;
    isModuleStart: boolean;
  }> = [];

  modules.forEach((mod, modIdx) => {
    const lessons = mod.lessons || [];
    lessons.forEach((les, lesIdx) => {
      const key = `${modIdx}-${lesIdx}`;
      nodes.push({
        moduleIdx: modIdx,
        lessonIdx: lesIdx,
        moduleTitle: mod.title,
        lessonTitle: les.title,
        key,
        isCompleted: completedLessons.has(key),
        isCurrent: modIdx === currentModule && lesIdx === currentLesson,
        isModuleStart: lesIdx === 0,
      });
    });
  });

  // Check if a full module is completed
  const isModuleComplete = (modIdx: number) => {
    const lessons = modules[modIdx]?.lessons || [];
    return lessons.length > 0 && lessons.every((_, lesIdx) =>
      completedLessons.has(`${modIdx}-${lesIdx}`)
    );
  };

  return (
    <div className="relative py-4 px-2">
      {nodes.map((node, i) => {
        // Zigzag: alternate offset every other node
        const offset = i % 2 === 0 ? 'ml-2' : 'ml-12';
        const moduleComplete = isModuleComplete(node.moduleIdx);

        // Determine node color
        let bgColor: string;
        let borderColor: string;
        let textColor: string;

        if (node.isCompleted) {
          if (moduleComplete) {
            bgColor = 'rgb(234, 179, 8)'; // gold
            borderColor = 'rgb(202, 138, 4)';
            textColor = 'text-amber-900';
          } else {
            bgColor = 'var(--royal-blue)';
            borderColor = 'var(--royal-blue)';
            textColor = 'text-white';
          }
        } else if (node.isCurrent) {
          bgColor = 'var(--royal-blue)';
          borderColor = 'var(--royal-blue)';
          textColor = 'text-white';
        } else {
          bgColor = 'rgba(0, 63, 135, 0.08)';
          borderColor = 'rgba(0, 63, 135, 0.15)';
          textColor = 'text-[var(--text-muted)]';
        }

        return (
          <div key={node.key}>
            {/* Module header */}
            {node.isModuleStart && (
              <div className={`mb-2 ${i > 0 ? 'mt-4' : ''}`}>
                <p className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">
                  Module {node.moduleIdx + 1}
                </p>
                <p className="text-sm font-semibold text-[var(--text-primary)] font-serif truncate">
                  {node.moduleTitle}
                </p>
              </div>
            )}

            {/* Connector line */}
            {i > 0 && (
              <div
                className="w-0.5 h-4 ml-7"
                style={{
                  backgroundColor: node.isCompleted || node.isCurrent
                    ? 'var(--royal-blue)'
                    : 'rgba(0, 63, 135, 0.1)',
                }}
              />
            )}

            {/* Node */}
            <button
              onClick={() => onNavigate(node.moduleIdx, node.lessonIdx)}
              className={`flex items-center gap-3 w-full ${offset} transition-all group`}
            >
              {/* Circle */}
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${
                  node.isCurrent ? 'animate-pulse-glow ring-2 ring-[var(--royal-blue)] ring-offset-2 ring-offset-[var(--bg-card)]' : ''
                }`}
                style={{
                  backgroundColor: bgColor,
                  border: `2px solid ${borderColor}`,
                }}
              >
                {node.isCompleted ? (
                  <svg className={`w-5 h-5 ${textColor}`} fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : (
                  <span className={`text-xs font-bold ${textColor}`}>
                    {node.lessonIdx + 1}
                  </span>
                )}
              </div>

              {/* Label */}
              <span
                className={`text-sm truncate transition-colors ${
                  node.isCurrent
                    ? 'font-semibold text-[var(--text-primary)]'
                    : node.isCompleted
                      ? 'text-[var(--text-secondary)]'
                      : 'text-[var(--text-muted)] group-hover:text-[var(--text-secondary)]'
                }`}
              >
                {node.lessonTitle}
              </span>
            </button>
          </div>
        );
      })}

      {/* Completion flag */}
      {nodes.length > 0 && nodes.every((n) => n.isCompleted) && (
        <div className="flex items-center gap-3 mt-4 ml-2">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center"
            style={{ backgroundColor: 'rgb(34, 197, 94)' }}
          >
            <span className="text-lg">🎓</span>
          </div>
          <span className="text-sm font-semibold text-green-600">Course Complete!</span>
        </div>
      )}
    </div>
  );
}

export default LearningPath;
