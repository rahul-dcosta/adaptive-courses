'use client';

interface ExampleCourse {
  icon: string;
  title: string;
  description: string;
  tags: string[];
}

const examples: ExampleCourse[] = [
  {
    icon: '🎯',
    title: 'Game Theory for Workplace Negotiations',
    description: 'Master Nash equilibrium, prisoner\'s dilemma, and strategic thinking for salary negotiations, team conflicts, and office politics.',
    tags: ['Strategy', 'Management', 'Career']
  },
  {
    icon: '🧠',
    title: 'Behavioral Economics for Product Managers',
    description: 'Understand cognitive biases, nudge theory, and loss aversion to design products users actually want and use.',
    tags: ['Psychology', 'Product', 'UX']
  },
  {
    icon: '⚙️',
    title: 'Supply Chain Optimization for Factory Engineers',
    description: 'Learn WIP management, bottleneck analysis, and lean principles adapted to your specific manufacturing context.',
    tags: ['Operations', 'Engineering', 'Manufacturing']
  },
  {
    icon: '🧬',
    title: 'Network Theory for Social Media Growth',
    description: 'Apply graph theory, centrality measures, and network effects to build influence and viral content strategies.',
    tags: ['Marketing', 'Analytics', 'Growth']
  },
  {
    icon: '📊',
    title: 'Bayesian Statistics for Data Scientists',
    description: 'Move beyond frequentist stats with prior distributions, likelihood functions, and posterior probability in real-world ML scenarios.',
    tags: ['Data Science', 'Statistics', 'ML']
  },
  {
    icon: '⚖️',
    title: 'Constitutional Law for Tech Founders',
    description: 'Understand First Amendment, Section 230, and privacy rights without law school—tailored to startup challenges.',
    tags: ['Legal', 'Startups', 'Policy']
  }
];

interface ExampleCoursesProps {
  onSelectTopic?: (topic: string) => void;
}

export default function ExampleCourses({ onSelectTopic }: ExampleCoursesProps) {
  return (
    <div className="max-w-6xl mx-auto px-6 py-24 border-t" style={{ borderColor: 'rgba(0, 63, 135, 0.08)' }}>
      {/* Section Header */}
      <div className="mb-12">
        <h2 className="text-sm font-bold uppercase tracking-wider mb-3" style={{ color: 'var(--royal-blue)' }}>
          Example Courses
        </h2>
        <h3 className="text-4xl font-bold text-gray-900 font-serif mb-4">
          Complex Topics, Adapted to Your Context
        </h3>
        <p className="text-lg text-gray-600 max-w-3xl">
          We don't just teach textbook concepts. We adapt advanced academic subjects to your specific goals, 
          situation, and timeline. Here's what's possible.
        </p>
      </div>

      {/* Example Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {examples.map((course, idx) => (
          <button
            key={idx}
            onClick={() => onSelectTopic?.(course.title)}
            className="group text-left bg-white rounded-xl p-8 transition-all hover:shadow-lg"
            style={{ 
              border: '1px solid rgba(0, 63, 135, 0.1)',
              cursor: onSelectTopic ? 'pointer' : 'default'
            }}
            onMouseEnter={(e) => {
              if (onSelectTopic) {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.borderColor = 'rgba(0, 63, 135, 0.2)';
              }
            }}
            onMouseLeave={(e) => {
              if (onSelectTopic) {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.borderColor = 'rgba(0, 63, 135, 0.1)';
              }
            }}
          >
            {/* Icon */}
            <div className="text-5xl mb-4" style={{ color: 'var(--royal-blue)' }}>
              {course.icon}
            </div>

            {/* Title */}
            <h4 className="text-xl font-bold text-gray-900 mb-3 font-serif group-hover:text-royal-blue transition-colors">
              {course.title}
            </h4>

            {/* Description */}
            <p className="text-gray-700 leading-relaxed mb-4">
              {course.description}
            </p>

            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              {course.tags.map((tag, tagIdx) => (
                <span
                  key={tagIdx}
                  className="inline-block px-3 py-1 text-xs font-medium rounded-full"
                  style={{
                    backgroundColor: 'rgba(0, 63, 135, 0.05)',
                    color: 'var(--royal-blue)',
                    border: '1px solid rgba(0, 63, 135, 0.12)'
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Hover Arrow (only if clickable) */}
            {onSelectTopic && (
              <div className="mt-6 flex items-center gap-2 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: 'var(--royal-blue)' }}>
                <span>Generate this course</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            )}
          </button>
        ))}
      </div>

      {/* CTA Footer */}
      <div className="mt-12 text-center">
        <p className="text-gray-600 text-lg">
          Or enter your own topic above to create a custom course in minutes.
        </p>
      </div>
    </div>
  );
}
